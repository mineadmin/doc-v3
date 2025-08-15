# MaForm

基于 `Element plus` 的表单二次封装的 `Form` 组件，支持所有原生表单的参数、事件、插槽、写法，还支持通过配置方式来实现。
另外还支持了基于 `el-row` 和 `el-space` 的布局来规划表单，具备响应式设计能力。

::: tip 说明
由于全部兼容及支持原生 `el-from` 的所有参数、事件、插槽，所以本文档主要讲解扩展功能。

官方表单参数请参考 [Element plus](https://element-plus.org/zh-CN/component/form.html) 官方文档。
:::

## 快速开始

### 配置方式使用
<DemoPreview dir="demos/ma-form/config" />

### 模板方式使用
<DemoPreview dir="demos/ma-form/template" />

### 获取`组件`和`el-form-item`的`Ref`
:::tip 提示
这个方式用于 **配置形式**，`template` 里可以自己定义 `ref` 
:::

<DemoPreview dir="demos/ma-form/getRef" />

## 完整示例

:::info 示例导航
以下示例展示了 MaForm 的各种用法和高级特性，从基础使用到复杂场景应用。建议按顺序学习以获得最佳效果。
:::

### 基础功能示例
- [基础用法](/front/component/ma-form/examples/basic-usage) - 常见表单控件的基础配置和使用方法
- [布局系统](/front/component/ma-form/examples/layout-systems) - Flex 和 Grid 布局的响应式设计
- [组件渲染](/front/component/ma-form/examples/component-rendering) - 所有支持的 Element Plus 组件展示

### 高级功能示例
- [条件渲染](/front/component/ma-form/examples/conditional-rendering) - 基于表单数据的字段显示控制
- [动态验证](/front/component/ma-form/examples/dynamic-validation) - 自定义验证规则和异步验证
- [插槽系统](/front/component/ma-form/examples/slots-examples) - 多级插槽的灵活使用方法

### 功能演示示例
- [暴露方法](/front/component/ma-form/examples/expose-methods) - 所有 API 方法的使用演示
- [加载状态](/front/component/ma-form/examples/loading-states) - 各种加载场景的处理方式
- [嵌套表单](/front/component/ma-form/examples/nested-forms) - 复杂层级结构的表单处理

### 实际应用示例
- [高级场景](/front/component/ma-form/examples/advanced-scenarios) - 多步骤流程和复杂业务逻辑
- [性能优化](/front/component/ma-form/examples/performance-demo) - 大表单性能优化策略

## TypeScript 类型定义

### 核心接口

#### MaFormOptions
表单配置选项的完整类型定义：

```typescript
interface MaFormOptions {
  // Element Plus 原生 el-form 属性
  model?: Record<string, any>
  rules?: Record<string, FormItemRule[]>
  inline?: boolean
  labelPosition?: 'left' | 'right' | 'top'
  labelWidth?: string | number
  labelSuffix?: string
  hideRequiredAsterisk?: boolean
  requireAsteriskPosition?: 'left' | 'right'
  showMessage?: boolean
  inlineMessage?: boolean
  statusIcon?: boolean
  validateOnRuleChange?: boolean
  size?: 'large' | 'default' | 'small'
  disabled?: boolean
  scrollToError?: boolean
  scrollIntoViewOptions?: boolean | ScrollIntoViewOptions
  
  // MaForm 扩展属性
  containerClass?: string
  loading?: boolean
  loadingConfig?: LoadingConfig
  layout?: 'flex' | 'grid'
  flex?: ElRowProps
  grid?: ElSpaceProps
  footerSlot?: () => VNode | VNode[]
}
```

#### MaFormItem
表单项配置的完整类型定义：

```typescript
interface MaFormItem {
  // 基础配置
  label?: string | (() => string)
  prop?: string | (() => string)
  hide?: boolean | ((item: MaFormItem, model: MaModel) => boolean)
  show?: boolean | ((item: MaFormItem, model: MaModel) => boolean)
  
  // 布局配置
  cols?: ColsConfiguration
  itemProps?: ElFormItemProps
  itemSlots?: Record<string, (...args: any[]) => VNode | VNode[]>
  
  // 渲染配置
  render?: RenderType
  renderProps?: Record<string, any>
  renderSlots?: Record<string, (...args: any[]) => VNode | VNode[]>
  
  // 嵌套配置
  children?: MaFormItem[]
  
  // 验证配置
  customValidator?: (rule: any, value: any, callback: Function) => void
  asyncValidator?: (rule: any, value: any) => Promise<void>
}
```

#### ColsConfiguration
响应式列配置类型：

```typescript
interface ColsConfiguration {
  // 基础栅格配置
  span?: number
  offset?: number
  push?: number
  pull?: number
  
  // 响应式配置
  xs?: number | ResponsiveColConfig
  sm?: number | ResponsiveColConfig
  md?: number | ResponsiveColConfig
  lg?: number | ResponsiveColConfig
  xl?: number | ResponsiveColConfig
  
  // 自定义配置
  order?: number
  flex?: string | number
}

interface ResponsiveColConfig {
  span?: number
  offset?: number
  push?: number
  pull?: number
}
```

#### RenderType
组件渲染类型定义：

```typescript
type RenderType = 
  | string  // Element Plus 组件名称
  | Component  // Vue 组件
  | ((data: RenderContext) => VNode | VNode[])  // 渲染函数

interface RenderContext {
  item: MaFormItem
  model: MaModel
  formRef: Ref<FormInstance | undefined>
  disabled: boolean
  readonly: boolean
  size: ComponentSize
}
```

#### MaFormExpose
组件暴露方法的类型定义：

```typescript
interface MaFormExpose {
  // 状态管理
  setLoadingState: (loading: boolean) => void
  getLoadingState: () => boolean
  
  // 配置管理
  setOptions: (options: Partial<MaFormOptions>) => void
  getOptions: () => MaFormOptions
  updateOptions: (updater: (options: MaFormOptions) => MaFormOptions) => void
  
  // 表单项管理
  setItems: (items: MaFormItem[]) => void
  getItems: () => MaFormItem[]
  appendItem: (item: MaFormItem, index?: number) => void
  prependItem: (item: MaFormItem) => void
  removeItem: (prop: string) => boolean
  updateItem: (prop: string, updates: Partial<MaFormItem>) => boolean
  
  // 表单项查询
  getItemByProp: (prop: string) => MaFormItem | undefined
  getItemsByCondition: (condition: (item: MaFormItem) => boolean) => MaFormItem[]
  getVisibleItems: () => MaFormItem[]
  
  // 表单验证
  validate: () => Promise<boolean>
  validateField: (prop: string) => Promise<boolean>
  resetFields: (props?: string[]) => void
  clearValidate: (props?: string[]) => void
  
  // 表单数据
  getFormData: () => Record<string, any>
  setFormData: (data: Record<string, any>) => void
  resetFormData: () => void
  
  // El-Form 实例
  getElFormRef: () => FormInstance | undefined
}
```

## Props

| 参数        | 说明                             | 类型         | 默认值 | 版本    |
|-----------|--------------------------------|-------------------|-------|-------|
| `v-model` | 表单数据，双向绑定，支持响应式更新 | `Record<string, any>` | `{}` | 1.0.0 |
| `options` | 表单配置选项，包含 Element Plus 原生属性和扩展属性 | `MaFormOptions` | `{}` | 1.0.0 |
| `items`   | 表单项配置数组，支持嵌套和动态配置 | `MaFormItem[]` | `[]` | 1.0.0 |
| `loading` | 全局加载状态，优先级高于 options.loading | `boolean` | `false` | 1.0.0 |
| `disabled` | 全局禁用状态，优先级高于 options.disabled | `boolean` | `false` | 1.0.0 |

### MaFormOptions 扩展配置

::: tip 说明
这些是 `ma-form` 对 `el-form` 的扩展参数，与 Element Plus 原生参数完全兼容。
:::

| 参数        | 说明                                                                    | 类型                                                                                              | 默认值      | 版本    |
|-----------|-----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|----------|-------|
| `containerClass` | 表单容器自定义类名，用于样式定制                                                   | `string`                                                                                        | -        | 1.0.0 |
| `loading` | 是否显示加载动画，支持全局和局部加载状态                                               | `boolean`                                                                                       | `false`  | 1.0.0 |
| `loadingConfig` | 加载动画详细配置选项                                                             | [LoadingConfig](#loadingconfig-配置)                                                               | `{}`     | 1.0.0 |
| `layout` | 布局方式：`flex` 使用栅格系统，`grid` 使用间距布局                                    | `'flex' \| 'grid'`                                                                              | `flex`   | 1.0.0 |
| `flex` | flex 布局配置，基于 `el-row` 组件                                            | `ElRowProps`                                                                                    | `{}`     | 1.0.0 |
| `grid` | grid 布局配置，基于 `el-space` 组件                                          | `ElSpaceProps`                                                                                  | `{}`     | 1.0.0 |
| `footerSlot` | 配置型底部插槽，可返回 VNode 或 VNode 数组                                        | `() => VNode \| VNode[]`                                                                        | -        | 1.0.0 |

#### LoadingConfig 配置

加载动画的详细配置选项：

| 参数        | 说明      | 类型   | 默认值 | 版本    |
|-----------|----------|------|-----|-------|
| `text` | 显示在加载图标下方的加载文案   | `string`  | `'加载中...'`   | 1.0.0 |
| `spinner` | 自定义加载图标类名   | `string` | -   | 1.0.0 |
| `svg` | 自定义 SVG 加载图标   | `string` | -   | 1.0.0 |
| `viewBox` | SVG 图标的 viewBox 属性   | `string` | -   | 1.0.0 |
| `background` | 背景遮罩的颜色   | `string` | `'rgba(0, 0, 0, 0.8)'`   | 1.0.0 |
| `customClass` | 自定义样式类名   | `string` | -   | 1.0.0 |
| `lock` | 是否锁定滚动   | `boolean` | `true`   | 1.0.0 |
| `fullscreen` | 是否全屏显示   | `boolean` | `false`   | 1.0.0 |

### MaFormItem 配置详解

表单项的完整配置选项：

#### 基础配置

| 参数            | 说明                                                                                                                                                                             | 类型                                                                                                 | 默认值     | 版本     |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|---------|--------|
| `label`       | 表单项标签，支持字符串或函数返回值                                                                                                                                                                | `string \| (() => string)`                                                                             | -       | 1.0.0  |
| `prop`        | 表单项字段名，支持字符串或函数返回值，用于数据绑定和验证                                                                                                                                                                | `string \| (() => string)`                                                                             | -       | 1.0.0  |
| `hide`        | 是否隐藏该项（隐藏但保留数据），支持动态控制                                                                                            | `boolean \| ((item: MaFormItem, model: Record<string, any>) => boolean)` | `false` | 1.0.0  |
| `show`        | 是否显示该项（不显示则不渲染且无数据），支持动态控制                                                                                       | `boolean \| ((item: MaFormItem, model: Record<string, any>) => boolean)` | `true`  | 1.0.0  |

#### 布局配置

| 参数            | 说明                                                                                                                                                                             | 类型                                                                                                 | 默认值     | 版本     |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|---------|--------|
| `cols`        | 栅格布局配置，在 `layout` 为 `flex` 时生效，支持响应式配置                                                                                                                                                  | `ColsConfiguration`                    | -       | 1.0.0  |
| `itemProps`   | Element Plus `el-form-item` 的原生属性                                                                                                                                                                            | `ElFormItemProps`                    | `{}`       | 1.0.0  |
| `itemSlots`   | Element Plus `el-form-item` 的原生插槽配置                                                                                                                                                                            | `Record<string, (...args: any[]) => VNode \| VNode[]>`                         | `{}`       | 1.0.0  |

#### 渲染配置

| 参数            | 说明                                                                                                                                                                             | 类型                                                                                                 | 默认值     | 版本     |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|---------|--------|
| `render`      | 渲染组件类型：可设置 Element Plus 组件名（如 `'input'`, `'select'`），Vue 组件，或渲染函数 | `RenderType`                                                                            | -       | 1.0.0  |
| `renderProps` | 被渲染组件的 props 属性配置                                                                                                                                                                              | `Record<string, any>`                                                                              | `{}`       | 1.0.0  |
| `renderSlots` | 被渲染组件的插槽配置                                                                                                                                                                       | `Record<string, (...args: any[]) => VNode \| VNode[]>`                                                                  | `{}`       | 1.0.0  |

#### 嵌套与条件配置

| 参数            | 说明                                                                                                                                                                             | 类型                                                                                                 | 默认值     | 版本     |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|---------|--------|
| `children`    | 子配置项，支持无限嵌套，用于复杂表单结构                                                                                                                                                                 | `MaFormItem[]`                                                                                     | `[]`       | 1.0.33 |

#### 验证配置

| 参数            | 说明                                                                                                                                                                             | 类型                                                                                                 | 默认值     | 版本     |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|---------|--------|
| `customValidator` | 自定义同步验证函数                                                                                                                                                                | `(rule: any, value: any, callback: Function) => void`                                                                                     | -       | 1.0.0 |
| `asyncValidator`  | 自定义异步验证函数                                                                                                                                                                | `(rule: any, value: any) => Promise<void>`                                                                                     | -       | 1.0.0 |

## 插槽系统

MaForm 提供了灵活的插槽系统，支持多层级的内容自定义：

### 全局插槽

| 名称              | 说明                                    | 作用域变量 | 示例 |
|-----------------|---------------------------------------|----------|------|
| `default`       | 默认插槽，可写原生 `<el-form-item>` 标签，使用后配置方式自动失效 | - | `<ma-form><el-form-item>...</el-form-item></ma-form>` |
| `footer`        | 表单底部插槽，用于放置提交按钮等操作元素 | `{ formRef, model, loading }` | `<template #footer="{ formRef }">` |
| `loading`       | 自定义加载状态内容 | `{ loading }` | `<template #loading="{ loading }">` |

### 表单项级别插槽

每个 `MaFormItem` 都支持通过 `itemSlots` 配置自定义插槽：

#### itemSlots 配置

```typescript
interface ItemSlots {
  // Element Plus el-form-item 原生插槽
  label?: (scope: { label: string }) => VNode | VNode[]
  error?: (scope: { error: string }) => VNode | VNode[]
  
  // MaForm 扩展插槽
  prepend?: (scope: FormItemScope) => VNode | VNode[]  // 前置内容
  append?: (scope: FormItemScope) => VNode | VNode[]   // 后置内容
  help?: (scope: FormItemScope) => VNode | VNode[]     // 帮助信息
}

interface FormItemScope {
  item: MaFormItem
  model: Record<string, any>
  disabled: boolean
  readonly: boolean
  size: ComponentSize
  formRef: Ref<FormInstance | undefined>
}
```

### 动态插槽命名

支持基于 `prop` 的动态插槽命名，格式：`item-{prop}`

```vue
<ma-form :items="items">
  <!-- 为 prop 为 'username' 的项自定义渲染 -->
  <template #item-username="{ item, model }">
    <el-input v-model="model[item.prop]" prefix-icon="User" />
  </template>
  
  <!-- 为 prop 为 'password' 的项自定义标签 -->
  <template #label-password>
    <span style="color: red;">* 密码</span>
  </template>
</ma-form>
```

### 嵌套组件插槽

对于渲染的 Element Plus 组件，可以通过 `renderSlots` 配置其插槽：

```tsx
const field ={
  render: 'select',
  renderSlots: {
    // el-select 的默认插槽
    default: () => [
      h('el-option', { label: '选项1', value: '1' }),
      h('el-option', { label: '选项2', value: '2' })
    ],
    // el-select 的前缀插槽
    prefix: () => h('el-icon', {}, [h('Search')])
  }
}
```


## 暴露方法 (Expose)

MaForm 组件通过 `defineExpose` 暴露了丰富的 API 方法，用于外部控制和数据操作：

### 状态管理

| 方法名 | 说明 | 参数 | 返回值 | 示例 |
|-------|------|-----|-------|------|
| `setLoadingState(loading)` | 设置表单加载状态 | `loading: boolean` | `void` | `formRef.value.setLoadingState(true)` |
| `getLoadingState()` | 获取当前加载状态 | - | `boolean` | `const loading = formRef.value.getLoadingState()` |

### 配置管理

| 方法名 | 说明 | 参数 | 返回值 | 示例 |
|-------|------|-----|-------|------|
| `setOptions(options)` | 设置表单配置选项 | `options: Partial<MaFormOptions>` | `void` | `formRef.value.setOptions({ loading: true })` |
| `getOptions()` | 获取当前表单配置 | - | `MaFormOptions` | `const opts = formRef.value.getOptions()` |
| `updateOptions(updater)` | 通过更新函数修改配置 | `updater: (options) => MaFormOptions` | `void` | `formRef.value.updateOptions(opts => ({ ...opts, loading: false }))` |

### 表单项管理

| 方法名 | 说明 | 参数 | 返回值 | 示例 |
|-------|------|-----|-------|------|
| `setItems(items)` | 设置表单项数组 | `items: MaFormItem[]` | `void` | `formRef.value.setItems(newItems)` |
| `getItems()` | 获取当前表单项数组 | - | `MaFormItem[]` | `const items = formRef.value.getItems()` |
| `appendItem(item, index?)` | 添加表单项到指定位置 | `item: MaFormItem, index?: number` | `void` | `formRef.value.appendItem(newItem, 2)` |
| `prependItem(item)` | 在开头添加表单项 | `item: MaFormItem` | `void` | `formRef.value.prependItem(firstItem)` |
| `removeItem(prop)` | 根据 prop 移除表单项 | `prop: string` | `boolean` | `const removed = formRef.value.removeItem('username')` |
| `updateItem(prop, updates)` | 更新指定表单项 | `prop: string, updates: Partial<MaFormItem>` | `boolean` | `formRef.value.updateItem('email', { hide: true })` |

### 表单项查询

| 方法名 | 说明 | 参数 | 返回值 | 示例 |
|-------|------|-----|-------|------|
| `getItemByProp(prop)` | 根据 prop 获取表单项 | `prop: string` | `MaFormItem \| undefined` | `const item = formRef.value.getItemByProp('username')` |
| `getItemsByCondition(condition)` | 根据条件获取表单项数组 | `condition: (item) => boolean` | `MaFormItem[]` | `const hiddenItems = formRef.value.getItemsByCondition(item => item.hide)` |
| `getVisibleItems()` | 获取所有可见表单项 | - | `MaFormItem[]` | `const visible = formRef.value.getVisibleItems()` |

### 表单验证

| 方法名 | 说明 | 参数 | 返回值 | 示例 |
|-------|------|-----|-------|------|
| `validate()` | 验证整个表单 | - | `Promise<boolean>` | `const valid = await formRef.value.validate()` |
| `validateField(prop)` | 验证指定字段 | `prop: string` | `Promise<boolean>` | `const valid = await formRef.value.validateField('email')` |
| `resetFields(props?)` | 重置字段到初始值 | `props?: string[]` | `void` | `formRef.value.resetFields(['username', 'email'])` |
| `clearValidate(props?)` | 清除验证结果 | `props?: string[]` | `void` | `formRef.value.clearValidate()` |

### 表单数据

| 方法名 | 说明 | 参数 | 返回值 | 示例 |
|-------|------|-----|-------|------|
| `getFormData()` | 获取表单数据 | - | `Record<string, any>` | `const data = formRef.value.getFormData()` |
| `setFormData(data)` | 设置表单数据 | `data: Record<string, any>` | `void` | `formRef.value.setFormData({ username: 'admin' })` |
| `resetFormData()` | 重置表单数据为初始状态 | - | `void` | `formRef.value.resetFormData()` |

### Element Plus 原生实例

| 方法名 | 说明 | 参数 | 返回值 | 示例 |
|-------|------|-----|-------|------|
| `getElFormRef()` | 获取 Element Plus el-form 实例 | - | `FormInstance \| undefined` | `const elForm = formRef.value.getElFormRef()` |

### 使用示例

```vue
<template>
  <ma-form 
    ref="formRef" 
    v-model="formData" 
    :options="formOptions" 
    :items="formItems"
  />
  
  <div>
    <el-button @click="handleValidate">验证表单</el-button>
    <el-button @click="handleAddItem">添加项</el-button>
    <el-button @click="handleToggleLoading">切换加载</el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const formRef = ref()
const formData = ref({})

const handleValidate = async () => {
  const isValid = await formRef.value.validate()
  console.log('表单验证结果:', isValid)
}

const handleAddItem = () => {
  formRef.value.appendItem({
    label: '新字段',
    prop: 'newField',
    render: 'input'
  })
}

const handleToggleLoading = () => {
  const currentLoading = formRef.value.getLoadingState()
  formRef.value.setLoadingState(!currentLoading)
}
</script>
```

## 布局系统详解

MaForm 提供了两种布局系统，支持响应式设计：

### Flex 布局 (默认)

基于 Element Plus 的 `el-row` 和 `el-col` 组件实现栅格系统：

```typescript
const field ={
  layout: 'flex',
  flex: {
    gutter: 20,        // 栅格间距
    type: 'flex',      // 现代 flexbox 模式
    justify: 'start',  // 水平对齐方式
    align: 'middle'    // 垂直对齐方式
  }
}
```

#### 栅格配置

每个表单项可以通过 `cols` 属性配置栅格布局：

```typescript
const field ={
  label: '用户名',
  prop: 'username',
  render: 'input',
  cols: {
    span: 12,        // 占据12格（总共24格）
    offset: 0,       // 左侧间隔
    push: 0,         // 向右移动
    pull: 0,         // 向左移动
    order: 1,        // 排序
    
    // 响应式配置
    xs: 24,          // <768px 时占满整行
    sm: 12,          // ≥768px 时占一半
    md: 8,           // ≥992px 时占三分之一
    lg: 6,           // ≥1200px 时占四分之一
    xl: 4            // ≥1920px 时占六分之一
  }
}
```

### Grid 布局

基于 Element Plus 的 `el-space` 组件实现间距布局：

```typescript
const field ={
  layout: 'grid',
  grid: {
    direction: 'vertical',  // 排列方向
    size: 'medium',         // 间距大小
    wrap: true,             // 是否换行
    fill: true,             // 是否填充容器
    fillRatio: 30,          // 填充比例
    alignment: 'start'      // 对齐方式
  }
}
```

### 响应式配置

#### 断点系统

| 断点 | 设备类型 | 宽度范围 |
|------|---------|----------|
| `xs` | 超小屏幕 | <768px |
| `sm` | 小屏幕 | ≥768px |
| `md` | 中等屏幕 | ≥992px |
| `lg` | 大屏幕 | ≥1200px |
| `xl` | 超大屏幕 | ≥1920px |

## 组件渲染系统

MaForm 支持多种组件渲染方式，提供灵活的扩展能力：

### 支持的 Element Plus 组件

| 组件名称 | 渲染值 | 说明 | 常用配置 |
|---------|-------|------|----------|
| `input` | `'input'` | 输入框 | `type`, `placeholder`, `clearable` |
| `textarea` | `'textarea'` | 文本域 | `rows`, `autosize`, `resize` |
| `select` | `'select'` | 选择器 | `multiple`, `filterable`, `remote` |
| `cascader` | `'cascader'` | 级联选择器 | `options`, `props`, `showAllLevels` |
| `datePicker` | `'datePicker'` | 日期选择器 | `type`, `format`, `valueFormat` |
| `timePicker` | `'timePicker'` | 时间选择器 | `format`, `valueFormat`, `selectableRange` |
| `switch` | `'switch'` | 开关 | `activeText`, `inactiveText`, `activeValue` |
| `checkbox` | `'checkbox'` | 复选框 | `trueLabel`, `falseLabel` |
| `checkboxGroup` | `'checkboxGroup'` | 复选框组 | `min`, `max` |
| `radio` | `'radio'` | 单选框 | `label`, `border` |
| `radioGroup` | `'radioGroup'` | 单选框组 | `textColor`, `fill` |
| `rate` | `'rate'` | 评分 | `max`, `allowHalf`, `showText` |
| `slider` | `'slider'` | 滑块 | `min`, `max`, `step`, `range` |
| `upload` | `'upload'` | 上传 | `action`, `headers`, `multiple` |
| `transfer` | `'transfer'` | 穿梭框 | `data`, `targetKeys`, `titles` |

### 渲染方式详解

#### 1. 字符串渲染

```typescript
const field ={
  label: '用户名',
  prop: 'username',
  render: 'input',                    // 字符串方式
  renderProps: {
    placeholder: '请输入用户名',
    clearable: true,
    prefixIcon: 'User'
  }
}
```

#### 2. 组件渲染

```typescript
import CustomInput from './CustomInput.vue'

const field ={
  label: '自定义字段',
  prop: 'custom',
  render: CustomInput,                // 组件方式
  renderProps: {
    customProp: 'value'
  }
}
```

#### 3. 函数渲染

```typescript
const field = {
  label: '动态渲染',
  prop: 'dynamic',
  render: ({ item, model, disabled }) => {
    return h('div', [
      h('el-input', {
        modelValue: model[item.prop],
        'onUpdate:modelValue': (value) => model[item.prop] = value,
        disabled,
        placeholder: '动态渲染的输入框'
      })
    ])
  }
}
```

#### 4. JSX/TSX 渲染

```tsx
const field ={
  label: 'JSX 渲染',
  prop: 'jsx',
  render: ({ item, model }) => (
    <el-input
      v-model={model[item.prop]}
      placeholder="JSX 渲染的输入框"
      clearable
    />
  )
}
```

### 复杂组件配置示例

#### Select 选择器

```typescript
const field ={
  label: '选择项',
  prop: 'selection',
  render: 'select',
  renderProps: {
    multiple: true,
    filterable: true,
    remote: true,
    remoteMethod: (query) => {
      // 远程搜索逻辑
    },
    placeholder: '请选择'
  },
  renderSlots: {
    default: () => [
      h('el-option', { label: '选项1', value: '1' }),
      h('el-option', { label: '选项2', value: '2' })
    ],
    prefix: () => h('el-icon', [h('Search')])
  }
}
```

#### Upload 上传

```typescript
const field ={
  label: '文件上传',
  prop: 'files',
  render: 'upload',
  renderProps: {
    action: '/api/upload',
    multiple: true,
    showFileList: true,
    drag: true,
    accept: '.jpg,.png,.pdf',
    beforeUpload: (file) => {
      // 上传前验证
      return true
    },
    onSuccess: (response, file) => {
      // 上传成功处理
    }
  },
  renderSlots: {
    trigger: () => h('el-button', { type: 'primary' }, '选择文件'),
    tip: () => h('div', { class: 'el-upload__tip' }, '只能上传jpg/png文件，且不超过500kb')
  }
}
```

## 高级特性

### 条件渲染

基于表单数据动态控制表单项的显示和隐藏：

```typescript
const field =[
    {
      label: '账户类型',
      prop: 'accountType',
      render: 'select',
      renderProps: { /* ... */ }
    },
    {
      label: '企业名称',
      prop: 'companyName',
      render: 'input',
      // 仅当账户类型为企业时显示
      show: (model) => model.accountType === 'company',
    }
]
```

### 动态验证

支持基于上下文的动态验证规则：

```typescript
const field ={
  label: '确认密码',
  prop: 'confirmPassword',
  render: 'input',
  renderProps: {
    type: 'password',
    showPassword: true
  },
  customValidator: (rule, value, callback) => {
    if (value !== model.password) {
      callback(new Error('两次输入的密码不一致'))
    } else {
      callback()
    }
  }
}
```

### 异步数据加载

```typescript
const field ={
  label: '城市选择',
  prop: 'city',
  render: 'select',
  renderProps: {
    loading: false,
    filterable: true,
    remote: true,
    remoteMethod: async (query) => {
      formRef.value.updateItem('city', {
        renderProps: { loading: true }
      })
      
      try {
        const cities = await fetchCities(query)
        // 更新选项
        updateCityOptions(cities)
      } finally {
        formRef.value.updateItem('city', {
          renderProps: { loading: false }
        })
      }
    }
  }
}
```

## 最佳实践

### 1. 性能优化

#### 使用 `show` vs `hide`

```typescript
// 推荐：使用 show，不渲染隐藏项
{
  show: (item,model) => model.userType === 'admin'
}

// 避免：使用 hide，仍会渲染但隐藏
{
  hide: (item,model) => model.userType !== 'admin'
}
```

#### 合理使用响应式配置

```typescript
// 推荐：针对移动端优化
const field ={
  cols: {
    xs: 24,    // 移动端单列
    sm: 12,    // 平板双列
    md: 8      // 桌面三列
  }
}
```

### 2. 表单验证策略

#### 分层验证

```typescript
// 1. 基础验证（Element Plus 规则）
itemProps: {
  rules: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ]
}

// 2. 自定义验证
customValidator: (rule, value, callback) => {
  if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    callback(new Error('只能包含字母、数字和下划线'))
  } else {
    callback()
  }
}

// 3. 异步验证
asyncValidator: async (rule, value) => {
  const exists = await checkUsernameExists(value)
  if (exists) {
    throw new Error('用户名已存在')
  }
}
```

### 3. 组件复用

#### 创建通用配置

```typescript
// utils/formConfigs.ts
export const createUserFormItems = (readonly = false): MaFormItem[] => [
  {
    label: '用户名',
    prop: 'username',
    render: 'input',
    renderProps: {
      disabled: readonly,
      placeholder: readonly ? '' : '请输入用户名'
    }
  },
  {
    label: '邮箱',
    prop: 'email',
    render: 'input',
    renderProps: {
      disabled: readonly,
      type: 'email'
    }
  }
]
```

#### 使用组合式 API

```typescript
// composables/useFormConfig.ts
export function useFormConfig() {
  const createFormItems = (type: 'create' | 'edit' | 'view') => {
    const readonly = type === 'view'
    
    return [
      // 基础信息
      ...createUserFormItems(readonly),
      
      // 条件字段
      ...(type !== 'view' ? [
        {
          label: '密码',
          prop: 'password',
          render: 'input',
          renderProps: { type: 'password' }
        }
      ] : [])
    ]
  }
  
  return { createFormItems }
}
```

### 4. 错误处理

```typescript
const handleSubmit = async () => {
  try {
    // 验证表单
    const isValid = await formRef.value.validate()
    if (!isValid) {
      ElMessage.error('请检查表单填写')
      return
    }
    
    // 获取表单数据
    const formData = formRef.value.getFormData()
    
    // 提交数据
    await submitForm(formData)
    
    ElMessage.success('提交成功')
  } catch (error) {
    console.error('表单提交失败:', error)
    ElMessage.error('提交失败，请稍后重试')
  }
}
```

## 常见问题 (FAQ)

### Q: 如何实现表单项的动态增减？

A: 使用 `appendItem` 和 `removeItem` 方法：

```typescript
// 添加表单项
const addItem = () => {
  formRef.value.appendItem({
    label: `字段${Date.now()}`,
    prop: `field_${Date.now()}`,
    render: 'input'
  })
}

// 删除表单项
const removeItem = (prop: string) => {
  formRef.value.removeItem(prop)
}
```

### Q: 如何自定义验证规则？

A: 使用 `customValidator` 或 `asyncValidator`：

```typescript
const field ={
  customValidator: (rule, value, callback) => {
    // 同步验证逻辑
    if (condition) {
      callback(new Error('验证失败'))
    } else {
      callback()
    }
  },
  asyncValidator: async (rule, value) => {
    // 异步验证逻辑
    const result = await validateAsync(value)
    if (!result.valid) {
      throw new Error(result.message)
    }
  }
}
```

### Q: 如何处理复杂的嵌套表单？

A: 使用 `children` 配置：

```typescript
const field ={
  label: '地址信息',
  prop: 'address',
  render: 'input',  // 父级渲染（可选）
  children: [
    {
      label: '省份',
      prop: 'address.province',
      render: 'select'
    },
    {
      label: '城市',
      prop: 'address.city', 
      render: 'select'
    }
  ]
}
```
