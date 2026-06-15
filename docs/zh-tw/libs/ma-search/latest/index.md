# MaSearch

`@mineadmin/search` 是基於 `@mineadmin/form` 和 Element Plus 封裝的列表搜尋面板元件。它把搜尋欄位、搜尋/重置按鈕、摺疊展開、響應式列布局和執行時方法組織成一個獨立庫，適合後臺列表頁、篩選面板和 `ma-pro-table` 搜尋區域。


## 當前版本

- 文件版本：`latest`
- 包名：`@mineadmin/search`
- 原始碼版本：`1.0.59`
- 版本策略：獨立發版，不跟隨 MineAdmin 主產品大版本
- peer dependency：`element-plus`

## 安裝

```bash
pnpm add @mineadmin/search @mineadmin/form element-plus
```

`ma-search` 內部渲染 `ma-form`，因此應用入口需要同時註冊 Element Plus、MaForm 和 MaSearch。

```ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import MaForm from '@mineadmin/form'
import MaSearch from '@mineadmin/search'

import 'element-plus/dist/index.css'
import '@mineadmin/form/dist/index.css'
import '@mineadmin/search/dist/index.css'
import App from './App.vue'

const app = createApp(App)

app
  .use(ElementPlus)
  .use(MaForm)
  .use(MaSearch)
  .mount('#app')
```

SSR 場景可以開啟客戶端掛載後渲染：

```ts
app.use(MaSearch, { ssr: true })
```

## 基礎用法

`ma-search` 接收三組核心配置：

- `options`：搜尋面板自身配置，例如預設值、列數、摺疊、按鈕文案。
- `formOptions`：透傳給內部 `ma-form` 的表單配置，例如 `labelWidth`。
- `searchItems`：搜尋項配置，型別繼承自 `MaFormItem`，額外擴充套件 `span`、`offset` 和 `hide`。

<DemoPreview dir="demos/ma-search/default" />

```vue
<script setup lang="tsx">
import { ref } from 'vue'
import type {
  MaSearchExpose,
  MaSearchItem,
  MaSearchOptions,
} from '@mineadmin/search'

const searchRef = ref<MaSearchExpose>()

const options: MaSearchOptions = {
  defaultValue: {
    status: 'enabled',
  },
  cols: {
    xs: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 4,
  },
}

const searchItems: MaSearchItem[] = [
  {
    label: '使用者名稱',
    prop: 'username',
    render: 'input',
    renderProps: {
      clearable: true,
      placeholder: '請輸入使用者名稱',
    },
  },
  {
    label: '狀態',
    prop: 'status',
    render: 'select',
    renderProps: {
      clearable: true,
      placeholder: '請選擇狀態',
    },
    renderSlots: {
      default: () => [
        { label: '啟用', value: 'enabled' },
        { label: '停用', value: 'disabled' },
      ].map(item => (
        <el-option label={item.label} value={item.value} />
      )),
    },
  },
  {
    label: '建立時間',
    prop: 'created_at',
    render: 'date-picker',
    span: 2,
    renderProps: {
      type: 'daterange',
      valueFormat: 'YYYY-MM-DD',
      startPlaceholder: '開始日期',
      endPlaceholder: '結束日期',
    },
  },
]

const handleSearch = (form: Record<string, any>) => {
  console.log('搜尋引數', form)
}

const handleReset = (form: Record<string, any>) => {
  console.log('重置後引數', form)
}
</script>

<template>
  <ma-search
    ref="searchRef"
    :options="options"
    :form-options="{ labelWidth: '90px' }"
    :search-items="searchItems"
    @search="handleSearch"
    @reset="handleReset"
  />
</template>
```

搜尋項的 `prop` 支援點路徑，欄位值會寫入對應的巢狀物件：

```ts
const searchItems: MaSearchItem[] = [
  { label: '使用者名稱', prop: 'user.name', render: 'input' },
]
```

輸入元件監聽回車鍵，按下 `Enter` 會觸發一次 `search` 事件。

## 示例演示

### 基礎搜尋

常規輸入框、選擇器、日期範圍等搜尋項組合。

<DemoPreview dir="demos/ma-search/basic-usage" />

### 高階搜尋

展示 TSX 自定義渲染、多選、級聯等複雜篩選場景。

<DemoPreview dir="demos/ma-search/advanced-search" />

### 摺疊搜尋

搜尋項較多時，可以透過 `fold` 和 `foldRows` 控制初始展示數量。

<DemoPreview dir="demos/ma-search/collapsible-search" />

### 自定義操作區

使用 `actions`、`beforeActions` 和 `afterActions` 插槽擴充套件按鈕區域。

<DemoPreview dir="demos/ma-search/custom-actions" />

### 動態搜尋項

透過暴露方法在執行時新增、刪除或替換搜尋項。

<DemoPreview dir="demos/ma-search/dynamic-items" />

### 響應式佈局

使用 `cols` 配置不同斷點下的搜尋項列數。

<DemoPreview dir="demos/ma-search/responsive-layout" />

### 表格整合

把 `search` 和 `reset` 事件轉換為列表查詢引數。

<DemoPreview dir="demos/ma-search/table-integration" />

### 表單驗證

配合內部 `ma-form` 的規則校驗能力控制搜尋提交。

<DemoPreview dir="demos/ma-search/form-validation" />

### 方法演示

演示 `setSearchForm`、`setOptions`、`appendItem`、按鈕屬性設定等例項方法。

<DemoPreview dir="demos/ma-search/methods-demo" />

## Props

| 引數 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| `options` | 搜尋面板配置 | `MaSearchOptions` | `{}` |
| `formOptions` | 內部 `ma-form` 配置 | `MaFormOptions` | `{}` |
| `searchItems` | 搜尋項配置陣列 | `MaSearchItem[]` | `[]` |

元件上的其他屬性會繼續透傳給內部 `ma-form`。

## MaSearchOptions

| 引數 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| `defaultValue` | 搜尋表單預設值 | `Record<string, any>` | `{}` |
| `cols` | 響應式列數配置 | `Record<'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl', number>` | 見下方斷點 |
| `fold` | 初始摺疊配置。傳 `true` 時掛載後會先收起超過 `foldRows` 的搜尋項 | `boolean` | `false` |
| `foldButtonShow` | 是否顯示摺疊/展開按鈕 | `boolean` | `true` |
| `foldRows` | 收起狀態下保留的搜尋項行數 | `number` | `2` |
| `show` | 是否顯示整個搜尋面板，也可以傳函式動態判斷 | `boolean \| (() => boolean)` | `true` |
| `text` | 搜尋、重置、展開、摺疊按鈕文案 | `TextConfig` | - |
| `searchBtnProps` | 透傳給搜尋按鈕的 Element Plus Button 屬性 | `Record<string, any>` | - |
| `resetBtnProps` | 透傳給重置按鈕的 Element Plus Button 屬性 | `Record<string, any>` | - |

### 響應式列

`cols` 根據視窗寬度計算當前網格列數。未配置某個斷點時使用內建預設值。

| 斷點 | 寬度範圍 | 預設列數 |
| --- | --- | --- |
| `xs` | `< 768px` | `1` |
| `sm` | `>= 768px` 且 `< 992px` | `2` |
| `md` | `>= 992px` 且 `< 1200px` | `2` |
| `lg` | `>= 1200px` 且 `< 1920px` | `3` |
| `xl` | `>= 1920px` | `4` |

```ts
const options: MaSearchOptions = {
  cols: {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 6,
  },
}
```

### 按鈕文案

按鈕文案需要使用函式返回字串。

```ts
const options: MaSearchOptions = {
  text: {
    searchBtn: () => '查詢',
    resetBtn: () => '清空',
    isFoldBtn: () => '收起',
    notFoldBtn: () => '更多',
  },
}
```

### 摺疊行為

元件掛載時會執行一次 `foldToggle()` 來初始化摺疊狀態：

- `options.fold` 省略或為 `false`：初始展開全部搜尋項。
- `options.fold` 為 `true`：初始只保留 `foldRows` 行內的搜尋項，其餘項收起。
- `getFold()` 返回的是當前執行狀態，`true` 表示展開，`false` 表示收起。

```ts
const options: MaSearchOptions = {
  fold: true,
  foldRows: 1,
}
```

## MaSearchItem

`MaSearchItem` 繼承 `@mineadmin/form` 的 `MaFormItem`，所以 `label`、`prop`、`render`、`renderProps`、`renderSlots`、`itemProps`、`cols` 等能力與 MaForm 保持一致。

MaSearch 額外處理以下欄位：

| 引數 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| `hide` | 是否隱藏當前搜尋項。收起/展開計算時會尊重該配置 | `boolean \| (() => boolean)` | `false` |
| `span` | 當前項在搜尋網格中跨幾列 | `number` | `1` |
| `offset` | 當前項左側偏移幾列 | `number` | `0` |

```ts
const searchItems: MaSearchItem[] = [
  {
    label: '關鍵詞',
    prop: 'keyword',
    render: 'input',
    span: 2,
    renderProps: {
      clearable: true,
      placeholder: '請輸入名稱、編號或手機號',
    },
  },
  {
    label: '內部欄位',
    prop: 'internal',
    render: 'input',
    hide: () => true,
  },
]
```

::: tip
元件內部會自動追加一個 `__MaSearchAction` 操作項，用來渲染搜尋、重置和摺疊按鈕。搜尋、重置以及 `getSearchForm()` 返回資料前都會移除這個內部欄位。
:::

## 事件

| 事件 | 說明 | 引數 |
| --- | --- | --- |
| `search` | 點選搜尋按鈕或在輸入項中按下回車後觸發 | `form: Record<string, any>` |
| `reset` | 點選重置按鈕後觸發 | `form: Record<string, any>` |
| `fold` | 摺疊狀態變化後觸發 | `state: boolean` |

## 插槽

| 插槽 | 說明 |
| --- | --- |
| `default` | 透傳給內部 `ma-form` 的預設插槽，適合直接編寫自定義表單項 |
| `actions` | 完全替換預設操作區域 |
| `beforeActions` | 插入到搜尋、重置按鈕之前 |
| `afterActions` | 插入到搜尋、重置按鈕之後 |

```vue
<template>
  <ma-search :search-items="searchItems">
    <template #beforeActions>
      <el-button>匯出</el-button>
    </template>

    <template #afterActions>
      <el-button link type="primary">儲存篩選</el-button>
    </template>
  </ma-search>
</template>
```

如果需要完全接管按鈕區域，可以使用 `actions`：

```vue
<template>
  <ma-search ref="searchRef" :search-items="searchItems">
    <template #actions>
      <el-button type="primary" @click="searchRef?.getSearchForm()">
        自定義查詢
      </el-button>
    </template>
  </ma-search>
</template>
```

## 暴露方法

| 方法 | 說明 |
| --- | --- |
| `getMaFormRef()` | 獲取內部 `ma-form` 例項 |
| `foldToggle()` | 切換展開/收起狀態 |
| `getFold()` | 獲取當前執行狀態，`true` 為展開 |
| `setSearchForm(form)` | 合併設定搜尋表單；傳 `null` 時清空表單物件 |
| `getSearchForm()` | 獲取當前搜尋表單資料 |
| `setShowState(state)` | 設定搜尋面板顯示狀態 |
| `getShowState()` | 獲取搜尋面板顯示狀態 |
| `setOptions(options)` | 合併更新搜尋面板配置，並重新初始化搜尋項 |
| `getOptions()` | 獲取搜尋面板配置 |
| `setFormOptions(options)` | 合併更新內部 `ma-form` 配置 |
| `getFormOptions()` | 獲取內部 `ma-form` 配置 |
| `setItems(items)` | 替換搜尋項陣列 |
| `getItems()` | 獲取當前搜尋項陣列 |
| `appendItem(item)` | 追加一個搜尋項 |
| `removeItem(prop)` | 按 `prop` 移除搜尋項 |
| `getItemByProp(prop)` | 按 `prop` 獲取搜尋項，未找到時返回 `null` |
| `setSearchBtnProps(props)` | 合併設定搜尋按鈕屬性 |
| `setResetBtnProps(props)` | 合併設定重置按鈕屬性 |

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { MaSearchExpose, MaSearchItem } from '@mineadmin/search'

const searchRef = ref<MaSearchExpose>()

const addField = () => {
  searchRef.value?.appendItem({
    label: '手機號',
    prop: 'mobile',
    render: 'input',
    renderProps: {
      clearable: true,
    },
  })
}

const disableSearch = () => {
  searchRef.value?.setSearchBtnProps({
    disabled: true,
  })
}

const setDefaultStatus = () => {
  searchRef.value?.setSearchForm({
    status: 'enabled',
  })
}

const resetModel = () => {
  searchRef.value?.setSearchForm(null)
}
</script>
```

## 型別定義

```ts
export type MediaBreakPoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface MaSearchOptions {
  defaultValue?: Record<string, any>
  cols?: Record<MediaBreakPoint, number>
  fold?: boolean
  foldButtonShow?: boolean
  foldRows?: number
  show?: boolean | (() => boolean)
  text?: {
    searchBtn?: () => string
    resetBtn?: () => string
    isFoldBtn?: () => string
    notFoldBtn?: () => string
  }
  searchBtnProps?: Record<string, any>
  resetBtnProps?: Record<string, any>
}

export interface MaSearchItem extends MaFormItem {
  hide?: boolean | (() => boolean)
  span?: number
  offset?: number
}

export interface MaSearchExpose {
  getMaFormRef: () => typeof MaForm
  foldToggle: () => void
  getFold: () => boolean
  setSearchForm: (form: null | Record<string, any>) => void
  getSearchForm: () => Record<string, any>
  setShowState: (state: boolean) => void
  getShowState: () => boolean
  setOptions: (opts: MaSearchOptions) => void
  getOptions: () => MaSearchOptions
  setFormOptions: (opts: MaFormOptions) => void
  getFormOptions: () => MaFormOptions
  setItems: (items: MaSearchItem[]) => void
  getItems: () => MaSearchItem[]
  appendItem: (item: MaSearchItem) => void
  removeItem: (prop: string) => void
  getItemByProp: (prop: string) => MaSearchItem | null
  setSearchBtnProps: (props: Record<string, any>) => void
  setResetBtnProps: (props: Record<string, any>) => void
}
```

## 使用建議

- 搜尋項較多時，建議設定 `fold: true` 和 `foldRows`，讓頁面初始只展示高頻欄位。
- 列表頁查詢引數建議統一從 `search` 事件或 `getSearchForm()` 獲取，不要直接讀取內部 `ma-form` 模型。
- 複雜欄位渲染優先複用 `ma-form` 的 `render`、`renderProps`、`renderSlots` 能力，MaSearch 只負責搜尋面板佈局和動作區域。
