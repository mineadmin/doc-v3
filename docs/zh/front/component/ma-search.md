# MaSearch 搜索组件

`ma-search` 基于 `ma-form` 封装而来，用于快速构建一个搜索表单。它提供了丰富的配置选项、响应式布局、表单验证等功能，是构建后台管理系统搜索功能的理想选择。

:::tip 提示
`form` 和 `form-item` 与 `ma-form` 的参数一致。更多详细配置请参考 [ma-form 文档](ma-form)。
:::

## 快速开始

<DemoPreview dir="demos/ma-search/default" />

## 示例大全

### 基础功能
- **[基础用法](./ma-search/examples/basic-usage)** - 最简单的搜索表单实现
- **[高级搜索](./ma-search/examples/advanced-search)** - 复杂搜索场景，支持 JSX 自定义渲染
- **[折叠搜索](./ma-search/examples/collapsible-search)** - 节省空间的折叠展开功能

### 自定义扩展
- **[自定义操作](./ma-search/examples/custom-actions)** - 自定义操作按钮和插槽使用
- **[动态管理](./ma-search/examples/dynamic-items)** - 运行时动态添加、删除搜索项
- **[方法演示](./ma-search/examples/methods-demo)** - 所有暴露方法的详细使用

### 高级应用
- **[响应式布局](./ma-search/examples/responsive-layout)** - 不同设备下的自适应显示
- **[表格集成](./ma-search/examples/table-integration)** - 与数据表格的完整集成方案
- **[表单验证](./ma-search/examples/form-validation)** - 各种验证规则和场景演示

## API 文档

### Props

| 参数 | 说明 | 类型 | 默认值 | 版本 |
|------|------|------|-------|------|
| `options` | `ma-search` 组件配置选项 | `MaSearchOptions` | - | 1.0.0 |
| `formOptions` | `ma-form` 组件配置选项，详见 [ma-form Props](ma-form#props) | `MaFormOptions` | - | 1.0.0 |
| `searchItems` | 搜索表单项配置，基于 [ma-form-item](ma-form#maformitem) 扩展 | `MaSearchItem[]` | - | 1.0.0 |

### MaSearchOptions

搜索组件的核心配置选项：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
|------|------|------|-------|------|
| `defaultValue` | 搜索表单默认值配置 | `Record<string, any>` | - | 1.0.0 |
| `cols` | 响应式列数配置，支持不同屏幕尺寸 | `MediaBreakPoint` | `{xs: 1, sm: 2, md: 2, lg: 3, xl: 4}` | 1.0.0 |
| `fold` | 是否启用折叠功能 | `boolean` | `false` | 1.0.0 |
| `foldRows` | 折叠后显示的行数 | `number` | `2` | 1.0.0 |
| `show` | 是否显示搜索面板 | `boolean` | `true` | 1.0.0 |
| `text` | 按钮文案配置 | `TextConfig` | - | 1.0.0 |

#### MediaBreakPoint

响应式断点配置，定义不同屏幕尺寸下的列数：

| 参数 | 说明 | 屏幕尺寸 | 类型 | 默认值 | 版本 |
|------|------|----------|------|-------|------|
| `xs` | 超小屏显示列数 | `< 768px` | `number` | `1` | 1.0.0 |
| `sm` | 小屏显示列数 | `≥ 768px` | `number` | `2` | 1.0.0 |
| `md` | 中屏显示列数 | `≥ 992px` | `number` | `2` | 1.0.0 |
| `lg` | 大屏显示列数 | `≥ 1200px` | `number` | `3` | 1.0.0 |
| `xl` | 超大屏显示列数 | `≥ 1920px` | `number` | `4` | 1.0.0 |

#### TextConfig

按钮文案配置：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
|------|------|------|-------|------|
| `searchBtn` | 搜索按钮文案 | `string \| (() => string)` | `'搜索'` | 1.0.0 |
| `resetBtn` | 重置按钮文案 | `string \| (() => string)` | `'重置'` | 1.0.0 |
| `isFoldBtn` | 展开按钮文案 | `string \| (() => string)` | `'展开'` | 1.0.0 |
| `notFoldBtn` | 折叠按钮文案 | `string \| (() => string)` | `'折叠'` | 1.0.0 |

### MaSearchItem

搜索表单项配置，基于 `ma-form-item` 扩展：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
|------|------|------|-------|------|
| `label` | 标签文本 | `string` | - | 1.0.0 |
| `prop` | 字段名，对应表单数据的键名 | `string` | - | 1.0.0 |
| `render` | 渲染方式，支持字符串或函数 | `string \| Function \| Component` | - | 1.0.0 |
| `options` | 选择类组件的选项数据 | `Array<{label: string, value: any}>` | - | 1.0.0 |
| `props` | 传递给表单组件的属性 | `object` | - | 1.0.0 |
| `rules` | 验证规则 | `FormItemRule[]` | - | 1.0.0 |
| `span` | 栅格跨度，表单项占用的列数 | `number` | `1` | 1.0.0 |
| `offset` | 栅格左侧间隔格数 | `number` | `0` | 1.0.0 |
| `hide` | 是否隐藏该表单项 | `boolean \| (() => boolean)` | `false` | 1.0.0 |

#### 内置 render 类型

支持以下内置渲染类型：

| 类型 | 说明 | 示例 |
|------|------|------|
| `'input'` | 文本输入框 | `render: 'input'` |
| `'select'` | 选择器 | `render: 'select'` |
| `'date-picker'` | 日期选择器 | `render: 'date-picker'` |
| `'input-number'` | 数字输入框 | `render: 'input-number'` |
| `'switch'` | 开关 | `render: 'switch'` |
| `'radio-group'` | 单选组 | `render: 'radio-group'` |
| `'checkbox-group'` | 复选组 | `render: 'checkbox-group'` |
| `'cascader'` | 级联选择器 | `render: 'cascader'` |

### Events

| 名称 | 说明 | 参数 | 版本 |
|------|------|------|------|
| `search` | 点击搜索按钮触发 | `(formData: Record<string, any>) => void` | 1.0.0 |
| `reset` | 点击重置按钮触发 | `(formData: Record<string, any>) => void` | 1.0.0 |
| `fold` | 折叠状态改变时触发 | `(state: boolean) => void` | 1.0.0 |

### Slots

| 名称 | 说明 | 参数 | 版本 |
|------|------|------|------|
| `default` | 默认插槽，可写原生标签 `<el-form-item>`，使用后配置方式自动失效 | - | 1.0.0 |
| `actions` | 完全替换操作按钮区域 | `{ searchLoading: boolean, resetLoading: boolean }` | 1.0.0 |
| `beforeActions` | 在操作按钮前插入内容 | - | 1.0.0 |
| `afterActions` | 在操作按钮后追加内容 | - | 1.0.0 |

### 暴露方法 (Expose)

| 方法名 | 说明 | 参数 | 返回值 | 版本 |
|--------|------|------|-------|------|
| `getMaFormRef()` | 获取内部 `ma-form` 组件引用 | - | `MaFormRef` | 1.0.0 |
| `foldToggle()` | 切换折叠状态 | - | - | 1.0.0 |
| `getFold()` | 获取当前折叠状态 | - | `boolean` | 1.0.0 |
| `setSearchForm(form)` | 设置搜索表单数据 | `form: Record<string, any>` | - | 1.0.0 |
| `getSearchForm()` | 获取当前搜索表单数据 | - | `Record<string, any>` | 1.0.0 |
| `setShowState(visible)` | 设置搜索组件显示状态 | `visible: boolean` | - | 1.0.0 |
| `getShowState()` | 获取当前显示状态 | - | `boolean` | 1.0.0 |
| `setOptions(options)` | 动态设置组件配置 | `options: MaSearchOptions` | - | 1.0.0 |
| `getOptions()` | 获取当前组件配置 | - | `MaSearchOptions` | 1.0.0 |
| `setFormOptions(options)` | 动态设置表单配置 | `options: MaFormOptions` | - | 1.0.0 |
| `getFormOptions()` | 获取当前表单配置 | - | `MaFormOptions` | 1.0.0 |
| `setItems(items)` | 动态设置搜索项配置 | `items: MaSearchItem[]` | - | 1.0.0 |
| `getItems()` | 获取当前搜索项配置 | - | `MaSearchItem[]` | 1.0.0 |
| `appendItem(item)` | 追加单个搜索项 | `item: MaSearchItem` | - | 1.0.0 |
| `removeItem(prop)` | 移除指定的搜索项 | `prop: string` | - | 1.0.0 |
| `getItemByProp(prop)` | 根据属性名获取搜索项 | `prop: string` | `MaSearchItem \| undefined` | 1.0.0 |

## TypeScript 类型定义

```typescript
// 主要接口定义
interface MaSearchOptions {
  defaultValue?: Record<string, any>
  cols?: MediaBreakPoint
  fold?: boolean
  foldRows?: number
  show?: boolean
  text?: TextConfig
}

interface MediaBreakPoint {
  xs?: number  // < 768px
  sm?: number  // ≥ 768px
  md?: number  // ≥ 992px
  lg?: number  // ≥ 1200px
  xl?: number  // ≥ 1920px
}

interface TextConfig {
  searchBtn?: string | (() => string)
  resetBtn?: string | (() => string)
  isFoldBtn?: string | (() => string)
  notFoldBtn?: string | (() => string)
}

interface MaSearchItem {
  label: string
  prop: string
  render: string | Function | Component
  options?: Array<{label: string, value: any}>
  props?: Record<string, any>
  rules?: FormItemRule[]
  span?: number
  offset?: number
  hide?: boolean | (() => boolean)
}

// 组件实例类型
interface MaSearchInstance {
  getMaFormRef(): MaFormRef
  foldToggle(): void
  getFold(): boolean
  setSearchForm(form: Record<string, any>): void
  getSearchForm(): Record<string, any>
  setShowState(visible: boolean): void
  getShowState(): boolean
  setOptions(options: MaSearchOptions): void
  getOptions(): MaSearchOptions
  setFormOptions(options: MaFormOptions): void
  getFormOptions(): MaFormOptions
  setItems(items: MaSearchItem[]): void
  getItems(): MaSearchItem[]
  appendItem(item: MaSearchItem): void
  removeItem(prop: string): void
  getItemByProp(prop: string): MaSearchItem | undefined
}
```

## 最佳实践

### 1. 响应式设计

合理配置 `cols` 参数以适应不同屏幕尺寸：

```typescript
const searchOptions = {
  cols: {
    xs: 1,  // 移动端单列
    sm: 2,  // 平板双列
    md: 3,  // 桌面三列
    lg: 4,  // 大屏四列
    xl: 6   // 超大屏六列
  }
}
```

### 2. 折叠功能

当搜索项较多时，建议开启折叠功能：

```typescript
const searchOptions = {
  fold: true,
  foldRows: 2,  // 默认显示2行
  text: {
    isFoldBtn: '展开更多条件',
    notFoldBtn: '收起部分条件'
  }
}
```

### 3. 表单验证

为重要字段添加验证规则：

```typescript
const searchItems = [
  {
    label: '邮箱',
    prop: 'email',
    render: 'input',
    rules: [
      { required: true, message: '邮箱不能为空', trigger: 'blur' },
      { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
    ]
  }
]
```

### 4. 动态表单项

根据业务需求动态添加或移除搜索项：

```typescript
// 添加搜索项
const addSearchItem = () => {
  searchRef.value?.appendItem({
    label: '新字段',
    prop: 'new_field',
    render: 'input'
  })
}

// 移除搜索项
const removeSearchItem = (prop: string) => {
  searchRef.value?.removeItem(prop)
}
```

### 5. 与表格集成

搭配数据表格实现完整的数据管理：

```typescript
const handleSearch = (searchData: any) => {
  // 重置分页到第一页
  pagination.page = 1
  // 保存搜索条件
  searchCondition.value = searchData
  // 加载数据
  loadTableData()
}
```

## 常见问题

### Q: 如何自定义表单项的渲染？

A: 可以通过 `render` 属性传入函数或组件：

```typescript
{
  label: '自定义',
  prop: 'custom',
  render: () => <CustomComponent />
}
```

### Q: 如何实现搜索项的条件显示？

A: 使用 `hide` 属性配合函数：

```typescript
{
  label: '条件字段',
  prop: 'conditional',
  render: 'input',
  hide: () => someCondition // 返回 true 时隐藏
}
```

### Q: 如何获取表单验证状态？

A: 通过 `getMaFormRef()` 获取表单引用：

```typescript
const validateForm = async () => {
  const formRef = searchRef.value?.getMaFormRef()
  try {
    await formRef?.validate()
    console.log('验证通过')
  } catch (error) {
    console.log('验证失败')
  }
}
```

### Q: 如何实现搜索历史记录？

A: 监听搜索事件并保存搜索条件：

```typescript
const searchHistory = ref<any[]>([])

const handleSearch = (formData: any) => {
  // 添加到历史记录
  searchHistory.value.unshift({
    data: formData,
    time: new Date().toLocaleString()
  })
  
  // 限制历史记录数量
  if (searchHistory.value.length > 10) {
    searchHistory.value = searchHistory.value.slice(0, 10)
  }
}
```

## 更新日志

### v1.0.27 (最新)
- 🎉 新增表单验证支持
- 🐛 修复响应式布局在某些情况下的显示问题
- ⚡️ 优化性能，减少不必要的重新渲染
- 📝 完善 TypeScript 类型定义

### v1.0.20
- 🎉 新增动态搜索项管理功能
- 🎉 新增更多内置 render 类型
- 🐛 修复折叠状态下的样式问题

### v1.0.15
- 🎉 初始版本发布
- ✨ 支持基础搜索功能
- ✨ 支持响应式布局
- ✨ 支持折叠面板