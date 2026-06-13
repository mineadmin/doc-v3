# MaSearch 搜索組件

`ma-search` 基於 `ma-form` 封裝而來，用於快速構建一個搜索表單。它提供了豐富的配置選項、響應式佈局、表單驗證等功能，是構建後台管理系統搜索功能的理想選擇。

:::tip 提示
`form` 和 `form-item` 與 `ma-form` 的參數一致。更多詳細配置請參考 [ma-form 文檔](ma-form)。
:::

## 快速開始

<DemoPreview dir="demos/ma-search/default" />

## 示例大全

### 基礎功能
- **[基礎用法](./ma-search/examples/basic-usage)** - 最簡單的搜索表單實現
- **[高級搜索](./ma-search/examples/advanced-search)** - 複雜搜索場景，支持 JSX 自定義渲染
- **[摺疊搜索](./ma-search/examples/collapsible-search)** - 節省空間的摺疊展開功能

### 自定義擴展
- **[自定義操作](./ma-search/examples/custom-actions)** - 自定義操作按鈕和插槽使用
- **[動態管理](./ma-search/examples/dynamic-items)** - 運行時動態添加、刪除搜索項
- **[方法演示](./ma-search/examples/methods-demo)** - 所有暴露方法的詳細使用

### 高級應用
- **[響應式佈局](./ma-search/examples/responsive-layout)** - 不同設備下的自適應顯示
- **[表格集成](./ma-search/examples/table-integration)** - 與數據表格的完整集成方案
- **[表單驗證](./ma-search/examples/form-validation)** - 各種驗證規則和場景演示

## API 文檔

### Props

| 參數 | 説明 | 類型 | 默認值 | 版本 |
|------|------|------|-------|------|
| `options` | `ma-search` 組件配置選項 | `MaSearchOptions` | - | 1.0.0 |
| `formOptions` | `ma-form` 組件配置選項，詳見 [ma-form Props](ma-form#props) | `MaFormOptions` | - | 1.0.0 |
| `searchItems` | 搜索表單項配置，基於 [ma-form-item](ma-form#maformitem) 擴展 | `MaSearchItem[]` | - | 1.0.0 |

### MaSearchOptions

搜索組件的核心配置選項：

| 參數 | 説明 | 類型 | 默認值 | 版本 |
|------|------|------|-------|------|
| `defaultValue` | 搜索表單默認值配置 | `Record<string, any>` | - | 1.0.0 |
| `cols` | 響應式列數配置，支持不同屏幕尺寸 | `MediaBreakPoint` | `{xs: 1, sm: 2, md: 2, lg: 3, xl: 4}` | 1.0.0 |
| `fold` | 是否啓用摺疊功能 | `boolean` | `false` | 1.0.0 |
| `foldRows` | 摺疊後顯示的行數 | `number` | `2` | 1.0.0 |
| `show` | 是否顯示搜索面板 | `boolean` | `true` | 1.0.0 |
| `text` | 按鈕文案配置 | `TextConfig` | - | 1.0.0 |

#### MediaBreakPoint

響應式斷點配置，定義不同屏幕尺寸下的列數：

| 參數 | 説明 | 屏幕尺寸 | 類型 | 默認值 | 版本 |
|------|------|----------|------|-------|------|
| `xs` | 超小屏顯示列數 | `< 768px` | `number` | `1` | 1.0.0 |
| `sm` | 小屏顯示列數 | `≥ 768px` | `number` | `2` | 1.0.0 |
| `md` | 中屏顯示列數 | `≥ 992px` | `number` | `2` | 1.0.0 |
| `lg` | 大屏顯示列數 | `≥ 1200px` | `number` | `3` | 1.0.0 |
| `xl` | 超大屏顯示列數 | `≥ 1920px` | `number` | `4` | 1.0.0 |

#### TextConfig

按鈕文案配置：

| 參數 | 説明 | 類型 | 默認值 | 版本 |
|------|------|------|-------|------|
| `searchBtn` | 搜索按鈕文案 | `string \| (() => string)` | `'搜索'` | 1.0.0 |
| `resetBtn` | 重置按鈕文案 | `string \| (() => string)` | `'重置'` | 1.0.0 |
| `isFoldBtn` | 展開按鈕文案 | `string \| (() => string)` | `'展開'` | 1.0.0 |
| `notFoldBtn` | 摺疊按鈕文案 | `string \| (() => string)` | `'摺疊'` | 1.0.0 |

### MaSearchItem

搜索表單項配置，基於 `ma-form-item` 擴展：

| 參數 | 説明 | 類型 | 默認值 | 版本 |
|------|------|------|-------|------|
| `label` | 標籤文本 | `string` | - | 1.0.0 |
| `prop` | 字段名，對應表單數據的鍵名 | `string` | - | 1.0.0 |
| `render` | 渲染方式，支持字符串或函數 | `string \| Function \| Component` | - | 1.0.0 |
| `options` | 選擇類組件的選項數據 | `Array<{label: string, value: any}>` | - | 1.0.0 |
| `props` | 傳遞給表單組件的屬性 | `object` | - | 1.0.0 |
| `rules` | 驗證規則 | `FormItemRule[]` | - | 1.0.0 |
| `span` | 柵格跨度，表單項佔用的列數 | `number` | `1` | 1.0.0 |
| `offset` | 柵格左側間隔格數 | `number` | `0` | 1.0.0 |
| `hide` | 是否隱藏該表單項 | `boolean \| (() => boolean)` | `false` | 1.0.0 |

#### 內置 render 類型

支持以下內置渲染類型：

| 類型 | 説明 | 示例 |
|------|------|------|
| `'input'` | 文本輸入框 | `render: 'input'` |
| `'select'` | 選擇器 | `render: 'select'` |
| `'date-picker'` | 日期選擇器 | `render: 'date-picker'` |
| `'input-number'` | 數字輸入框 | `render: 'input-number'` |
| `'switch'` | 開關 | `render: 'switch'` |
| `'radio-group'` | 單選組 | `render: 'radio-group'` |
| `'checkbox-group'` | 複選組 | `render: 'checkbox-group'` |
| `'cascader'` | 級聯選擇器 | `render: 'cascader'` |

### Events

| 名稱 | 説明 | 參數 | 版本 |
|------|------|------|------|
| `search` | 點擊搜索按鈕觸發 | `(formData: Record<string, any>) => void` | 1.0.0 |
| `reset` | 點擊重置按鈕觸發 | `(formData: Record<string, any>) => void` | 1.0.0 |
| `fold` | 摺疊狀態改變時觸發 | `(state: boolean) => void` | 1.0.0 |

### Slots

| 名稱 | 説明 | 參數 | 版本 |
|------|------|------|------|
| `default` | 默認插槽，可寫原生標籤 `<el-form-item>`，使用後配置方式自動失效 | - | 1.0.0 |
| `actions` | 完全替換操作按鈕區域 | `{ searchLoading: boolean, resetLoading: boolean }` | 1.0.0 |
| `beforeActions` | 在操作按鈕前插入內容 | - | 1.0.0 |
| `afterActions` | 在操作按鈕後追加內容 | - | 1.0.0 |

### 暴露方法 (Expose)

| 方法名 | 説明 | 參數 | 返回值 | 版本 |
|--------|------|------|-------|------|
| `getMaFormRef()` | 獲取內部 `ma-form` 組件引用 | - | `MaFormRef` | 1.0.0 |
| `foldToggle()` | 切換摺疊狀態 | - | - | 1.0.0 |
| `getFold()` | 獲取當前摺疊狀態 | - | `boolean` | 1.0.0 |
| `setSearchForm(form)` | 設置搜索表單數據 | `form: Record<string, any>` | - | 1.0.0 |
| `getSearchForm()` | 獲取當前搜索表單數據 | - | `Record<string, any>` | 1.0.0 |
| `setShowState(visible)` | 設置搜索組件顯示狀態 | `visible: boolean` | - | 1.0.0 |
| `getShowState()` | 獲取當前顯示狀態 | - | `boolean` | 1.0.0 |
| `setOptions(options)` | 動態設置組件配置 | `options: MaSearchOptions` | - | 1.0.0 |
| `getOptions()` | 獲取當前組件配置 | - | `MaSearchOptions` | 1.0.0 |
| `setFormOptions(options)` | 動態設置表單配置 | `options: MaFormOptions` | - | 1.0.0 |
| `getFormOptions()` | 獲取當前表單配置 | - | `MaFormOptions` | 1.0.0 |
| `setItems(items)` | 動態設置搜索項配置 | `items: MaSearchItem[]` | - | 1.0.0 |
| `getItems()` | 獲取當前搜索項配置 | - | `MaSearchItem[]` | 1.0.0 |
| `appendItem(item)` | 追加單個搜索項 | `item: MaSearchItem` | - | 1.0.0 |
| `removeItem(prop)` | 移除指定的搜索項 | `prop: string` | - | 1.0.0 |
| `getItemByProp(prop)` | 根據屬性名獲取搜索項 | `prop: string` | `MaSearchItem \| undefined` | 1.0.0 |

## TypeScript 類型定義

```typescript
// 主要接口定義
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

// 組件實例類型
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

## 最佳實踐

### 1. 響應式設計

合理配置 `cols` 參數以適應不同屏幕尺寸：

```typescript
const searchOptions = {
  cols: {
    xs: 1,  // 移動端單列
    sm: 2,  // 平板雙列
    md: 3,  // 桌面三列
    lg: 4,  // 大屏四列
    xl: 6   // 超大屏六列
  }
}
```

### 2. 摺疊功能

當搜索項較多時，建議開啓摺疊功能：

```typescript
const searchOptions = {
  fold: true,
  foldRows: 2,  // 默認顯示2行
  text: {
    isFoldBtn: '展開更多條件',
    notFoldBtn: '收起部分條件'
  }
}
```

### 3. 表單驗證

為重要字段添加驗證規則：

```typescript
const searchItems = [
  {
    label: '郵箱',
    prop: 'email',
    render: 'input',
    rules: [
      { required: true, message: '郵箱不能為空', trigger: 'blur' },
      { type: 'email', message: '郵箱格式不正確', trigger: 'blur' }
    ]
  }
]
```

### 4. 動態表單項

根據業務需求動態添加或移除搜索項：

```typescript
// 添加搜索項
const addSearchItem = () => {
  searchRef.value?.appendItem({
    label: '新字段',
    prop: 'new_field',
    render: 'input'
  })
}

// 移除搜索項
const removeSearchItem = (prop: string) => {
  searchRef.value?.removeItem(prop)
}
```

### 5. 與表格集成

搭配數據表格實現完整的數據管理：

```typescript
const handleSearch = (searchData: any) => {
  // 重置分頁到第一頁
  pagination.page = 1
  // 保存搜索條件
  searchCondition.value = searchData
  // 加載數據
  loadTableData()
}
```

## 常見問題

### Q: 如何自定義表單項的渲染？

A: 可以通過 `render` 屬性傳入函數或組件：

```typescript
{
  label: '自定義',
  prop: 'custom',
  render: () => <CustomComponent />
}
```

### Q: 如何實現搜索項的條件顯示？

A: 使用 `hide` 屬性配合函數：

```typescript
{
  label: '條件字段',
  prop: 'conditional',
  render: 'input',
  hide: () => someCondition // 返回 true 時隱藏
}
```

### Q: 如何獲取表單驗證狀態？

A: 通過 `getMaFormRef()` 獲取表單引用：

```typescript
const validateForm = async () => {
  const formRef = searchRef.value?.getMaFormRef()
  try {
    await formRef?.validate()
    console.log('驗證通過')
  } catch (error) {
    console.log('驗證失敗')
  }
}
```

### Q: 如何實現搜索歷史記錄？

A: 監聽搜索事件並保存搜索條件：

```typescript
const searchHistory = ref<any[]>([])

const handleSearch = (formData: any) => {
  // 添加到歷史記錄
  searchHistory.value.unshift({
    data: formData,
    time: new Date().toLocaleString()
  })
  
  // 限制歷史記錄數量
  if (searchHistory.value.length > 10) {
    searchHistory.value = searchHistory.value.slice(0, 10)
  }
}
```

## 更新日誌

### v1.0.27 (最新)
- 🎉 新增表單驗證支持
- 🐛 修復響應式佈局在某些情況下的顯示問題
- ⚡️ 優化性能，減少不必要的重新渲染
- 📝 完善 TypeScript 類型定義

### v1.0.20
- 🎉 新增動態搜索項管理功能
- 🎉 新增更多內置 render 類型
- 🐛 修復摺疊狀態下的樣式問題

### v1.0.15
- 🎉 初始版本發佈
- ✨ 支持基礎搜索功能
- ✨ 支持響應式佈局
- ✨ 支持摺疊面板