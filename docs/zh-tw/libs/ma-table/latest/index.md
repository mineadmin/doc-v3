# MaTable

`@mineadmin/table` 是基於 Element Plus `el-table` 封裝的基礎表格元件庫。它保留 Element Plus Table / TableColumn 的原生屬性、事件和插槽，同時補充配置式列、分頁、載入狀態、自適應高度、列顯隱、自定義渲染和執行時操作方法。


## 安裝

```bash
pnpm add @mineadmin/table element-plus
```

## 全域性註冊

```ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import MaTable from '@mineadmin/table'

import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus)
app.use(MaTable, {
  ssr: false,
  options: {},
})

app.mount('#app')
```

`app.use(MaTable, options)` 支援：

| 引數 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| `ssr` | SSR 場景下延遲到客戶端掛載後再渲染表格。 | `boolean` | `false` |
| `options` | 注入到元件中的預設表格配置。當前實現會在元件傳入同名 `options` 鍵時參與合併，業務表格仍建議顯式維護自己的 `options`。 | `MaTableOptions` | `{}` |

## 基礎用法

`ma-table` 接收兩個核心配置：`columns` 描述列，`options` 描述表格行為。`data`、`border`、`stripe` 等 Element Plus Table 屬性也可以直接寫在元件上，它們會透傳給內部 `el-table`。

<DemoPreview dir="demos/ma-table/default" />

```vue
<script setup lang="tsx">
import { ref } from 'vue'
import type { MaTableColumns, MaTableOptions } from '@mineadmin/table'

const tableData = [
  { id: 1, name: '張三', dept: '研發部', salary: 18000 },
  { id: 2, name: '李四', dept: '產品部', salary: 22000 },
]

const columns = ref<MaTableColumns[]>([
  { label: '姓名', prop: 'name', align: 'left' },
  { label: '部門', prop: 'dept' },
  {
    label: '薪資',
    prop: 'salary',
    sortable: true,
    cellRender: ({ row }) => <el-tag>{row.salary}</el-tag>,
  },
])

const options = ref<MaTableOptions>({
  stripe: true,
  border: true,
  defaultSort: { prop: 'salary', order: 'descending' },
})
</script>

<template>
  <ma-table :columns="columns" :data="tableData" :options="options" />
</template>
```

## Props

| 引數 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| `columns` | 表格列配置，相容 Element Plus `el-table-column` 屬性，並擴充套件顯隱、多級表頭和渲染器能力。 | `MaTableColumns[]` | `[]` |
| `options` | 表格配置，相容 Element Plus `el-table` 屬性，並擴充套件載入、分頁、自適應高度等能力。 | `MaTableOptions` | `{}` |

::: tip 屬性透傳
除了 `columns` 和 `options`，傳給 `ma-table` 的其他屬性會繼續傳給內部 `el-table`。如果同一屬性同時出現在 `options` 和元件屬性上，元件屬性會覆蓋 `options`。
:::

## MaTableOptions

`MaTableOptions` 包含 Element Plus Table 的原生屬性，例如 `data`、`height`、`stripe`、`border`、`rowKey`、`showSummary`、`summaryMethod`、`lazy`、`treeProps`、`spanMethod` 等。下面只列出 MaTable 擴充套件項。

| 引數 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| `containerHeight` | 型別中保留的容器高度配置；實際高度通常使用 Element Plus 的 `height`、`maxHeight` 或 MaTable 的 `adaption` 控制。 | `string` | - |
| `loading` | 是否顯示 Element Plus Loading 遮罩。 | `boolean` | `false` |
| `loadingConfig` | Loading 指令配置。 | `LoadingConfig` | - |
| `columnAlign` | 表格列預設對齊方式。 | `'left' \| 'center' \| 'right'` | `center` |
| `headerAlign` | 表頭預設對齊方式；列 `align` 與表格 `columnAlign` 的優先順序更高。 | `'left' \| 'center' \| 'right'` | - |
| `showOverflowTooltip` | 內容溢位時是否顯示 tooltip。 | `boolean` | `true` |
| `pagination` | Element Plus Pagination 配置與事件。 | `PaginationProps` | - |
| `showPagination` | 是否顯示內建分頁器。需要同時配置 `pagination`。 | `boolean` | `false` |
| `adaption` | 是否根據視窗高度自動設定表格高度。 | `boolean` | `false` |
| `adaptionOffsetBottom` | 自適應高度時保留的底部偏移量。 | `number` | `70` |
| `on` | Element Plus Table 事件集合，會展開到內部 `el-table`。 | `Record<string, Function>` | - |

### LoadingConfig

| 引數 | 說明 | 型別 |
| --- | --- | --- |
| `text` | 載入文案。 | `string` |
| `spinner` | 自定義載入圖示類名。 | `string` |
| `svg` | 自定義 SVG 載入圖示。 | `string` |
| `viewBox` | SVG 圖示 `viewBox`。 | `string` |
| `background` | 型別中宣告的遮罩背景色。當前渲染邏輯未單獨讀取它，需要定製遮罩時建議配合 `customClass`。 | `string` |
| `customClass` | 自定義 Loading class。 | `string` |

### PaginationProps

分頁配置相容 Element Plus Pagination。元件內部維護當前頁，預設從第 `1` 頁開始；需要主動跳頁時可以呼叫 `setCurrentPage`，頁碼變化通常透過 `onChange`、`onCurrentChange` 等回撥同步業務請求。

| 引數 | 說明 | 型別 |
| --- | --- | --- |
| `total` | 總條目數。 | `number` |
| `pageSize` | 每頁條數。 | `number` |
| `currentPage` | 當前頁碼。 | `number` |
| `pageSizes` | 每頁條數選項。 | `number[]` |
| `layout` | 分頁佈局，例如 `total, sizes, prev, pager, next, jumper`。 | `string` |
| `background` | 是否為按鈕新增背景色。 | `boolean` |
| `onSizeChange` | 每頁條數變化回撥。 | `(value: number) => void` |
| `onCurrentChange` | 當前頁變化回撥。 | `(value: number) => void` |
| `onChange` | 頁碼或每頁條數變化回撥。 | `(currentPage: number, pageSize: number) => void` |

```ts
const options: MaTableOptions = {
  showPagination: true,
  pagination: {
    currentPage: 1,
    pageSize: 10,
    total: 100,
    pageSizes: [10, 20, 50, 100],
    layout: 'total, sizes, prev, pager, next, jumper',
    onChange: (currentPage, pageSize) => {
      fetchList({ currentPage, pageSize })
    },
  },
}
```

## MaTableColumns

`MaTableColumns` 相容 Element Plus TableColumn 的原生屬性，例如 `label`、`prop`、`type`、`width`、`fixed`、`sortable`、`filters`、`filterMethod`、`formatter`、`align` 等。下面是 MaTable 擴充套件項。

| 引數 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| `hide` | 是否隱藏當前列。可以傳佈爾值，也可以傳函式動態判斷；函式執行時接收元件透傳的 `attrs`。 | `boolean \| CallableFunction` | `false` |
| `children` | 多級表頭配置，內部渲染為巢狀 `el-table-column`。 | `MaTableColumns[]` | - |
| `cellRender` | 自定義單元格渲染器，適合 TSX / JSX。 | `(data: TableColumnRenderer) => VNode \| string` | - |
| `headerRender` | 自定義表頭渲染器，適合 TSX / JSX。 | `(data: TableColumnRenderer) => VNode \| string` | - |

```tsx
const columns: MaTableColumns[] = [
  { type: 'selection', prop: 'selection', width: 56 },
  {
    label: '使用者資訊',
    prop: 'profile',
    children: [
      { label: '姓名', prop: 'name', align: 'left' },
      { label: '手機號', prop: 'phone' },
    ],
  },
  {
    label: '狀態',
    prop: 'status',
    headerRender: ({ column }) => <el-tag>{column.label}</el-tag>,
    cellRender: ({ row }) => (
      <el-tag type={row.status === 1 ? 'success' : 'info'}>
        {row.status === 1 ? '啟用' : '停用'}
      </el-tag>
    ),
  },
]
```

### 渲染器引數

`cellRender` 和 `headerRender` 接收 `TableColumnRenderer`：

| 引數 | 說明 |
| --- | --- |
| `row` | 當前行資料。表頭渲染時可能不存在。 |
| `column` | 當前 Element Plus 列上下文。 |
| `$index` | 當前行或列索引。 |
| `options` | 當前 MaTable 表格配置。 |
| `attrs` | 傳給 `ma-table` 的透傳屬性。 |

## 插槽

| 名稱 | 說明 | 引數 |
| --- | --- | --- |
| `empty` | 空資料內容，覆蓋預設 `ElEmpty`。 | - |
| `append` | 表格尾部追加內容。 | - |
| `pageLeft` | 分頁區域左側內容，常用於批次操作按鈕。 | - |
| `column-[prop]` | 指定列的單元格插槽。 | `{ row, column, $index }` |
| `header-[prop]` | 指定列的表頭插槽。 | `{ column, $index }` |
| `default` | 預設單元格插槽，作為所有列的兜底渲染。 | `{ row, column, $index }` |
| `header` | 預設表頭插槽，作為所有列的兜底渲染。 | `{ column, $index }` |
| `filterIcon` | 自定義篩選圖示插槽。 | Element Plus 原生引數 |

```vue
<ma-table :columns="columns" :data="tableData" :options="options">
  <template #pageLeft>
    <el-button type="primary">批次匯出</el-button>
  </template>

  <template #column-name="{ row }">
    <el-link type="primary">{{ row.name }}</el-link>
  </template>
</ma-table>
```

## 事件

MaTable 自身新增了一個事件：

| 名稱 | 說明 | 引數 |
| --- | --- | --- |
| `set-data-callback` | 呼叫 `setData` 後觸發。 | `data: any[]` |

Element Plus Table 事件透過 `options.on` 傳入。事件名需要使用 Vue 元件屬性格式，例如 `onSelectionChange`、`onRowClick`、`onSortChange`。

```ts
const options: MaTableOptions = {
  on: {
    onSelectionChange: (rows) => {
      selectedRows.value = rows
    },
    onRowClick: (row) => {
      currentRow.value = row
    },
  },
}
```

## 暴露方法

透過模板 `ref` 可以訪問 MaTable 暴露的方法。

| 方法 | 說明 | 引數 | 返回值 |
| --- | --- | --- | --- |
| `setData(data)` | 設定表格資料，並觸發 `set-data-callback`。 | `any[]` | `void` |
| `setPagination(pagination)` | 合併更新分頁配置。 | `PaginationProps` | `void` |
| `setCurrentPage(pager)` | 設定當前頁碼。 | `number` | `void` |
| `getCurrentPage()` | 獲取當前頁碼。 | - | `number` |
| `setLoadingState(loading)` | 設定載入狀態。 | `boolean` | `void` |
| `setOptions(options)` | 合併更新表格配置。 | `MaTableOptions` | `void` |
| `getOptions()` | 獲取當前表格配置。 | - | `MaTableOptions` |
| `setColumns(columns)` | 重設所有列。 | `MaTableColumns[]` | `void` |
| `getColumns()` | 獲取當前列配置。 | - | `MaTableColumns[]` |
| `appendColumn(column)` | 追加一列。 | `MaTableColumns` | `void` |
| `removeColumn(prop)` | 根據 `prop` 刪除列。 | `string` | `void` |
| `getColumnByProp(prop)` | 根據 `prop` 獲取列配置；執行時未找到會返回 `null`。 | `string` | `MaTableColumns \| null` |
| `getElTableRef()` | 獲取內部 Element Plus Table 例項。 | - | `Ref<typeof ElTable>` |

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { MaTableExpose } from '@mineadmin/table'

const tableRef = ref<MaTableExpose>()

const reload = async () => {
  tableRef.value?.setLoadingState(true)
  const data = await requestList()
  tableRef.value?.setData(data)
  tableRef.value?.setLoadingState(false)
}
</script>

<template>
  <ma-table ref="tableRef" :columns="columns" />
</template>
```

## useTable

`useTable(refName)` 需要在 `setup` 階段呼叫。它會在元件掛載後按模板 ref 名稱查詢 MaTable 例項，並返回 `MaTableExpose`。如果找不到對應 ref，會丟擲 `[@mineadmin/table]: not found ref for ma-table component`。

```vue
<script setup lang="tsx">
import { useTable } from '@mineadmin/table'
import type { MaTableExpose } from '@mineadmin/table'

useTable('userTable').then((table: MaTableExpose) => {
  table.setLoadingState(true)
  table.setColumns(columns)
  table.setData([])
  table.setOptions({
    showPagination: true,
    pagination: { total: 0, currentPage: 1, pageSize: 10 },
  })
  table.setLoadingState(false)
})
</script>

<template>
  <ma-table ref="userTable" />
</template>
```

## 常見場景

### 分頁表格

設定 `showPagination: true` 並傳入 `pagination` 後，MaTable 會在表格下方渲染 Element Plus Pagination。分頁區域左側可以透過 `pageLeft` 插槽放批次操作。

<DemoPreview dir="demos/ma-table/pagination" />

### 排序

排序能力繼承自 Element Plus TableColumn。列上配置 `sortable`、`sortMethod`、`sortBy`、`sortOrders`；遠端排序使用 `sortable: 'custom'` 並在 `options.on` 中監聽 `onSortChange`。

<DemoPreview dir="demos/ma-table/sorting" />

### 篩選

篩選能力繼承自 Element Plus TableColumn。列上配置 `filters`、`filterMethod`、`filterMultiple`、`filteredValue`，篩選變化可以透過 `onFilterChange` 處理。

<DemoPreview dir="demos/ma-table/filter" />

### 自定義渲染

簡單內容可以使用 `column-[prop]` 插槽；需要更強型別或 TSX 表達能力時，使用 `cellRender` 和 `headerRender`。

<DemoPreview dir="demos/ma-table/custom-render" />

### 動態列

執行時可以透過 `setColumns`、`appendColumn`、`removeColumn` 維護列配置，也可以在列配置裡用 `hide` 控制顯隱。

<DemoPreview dir="demos/ma-table/dynamic-columns" />

### 樹形表格

配置 `rowKey`、`treeProps`、`defaultExpandAll` 即可展示層級資料；懶載入時繼續使用 Element Plus 的 `lazy` 和 `load`。

<DemoPreview dir="demos/ma-table/tree-table" />

### 多選表格

列上配置 `type: 'selection'` 開啟多選。需要跨頁或資料重新整理後保留選擇時，配合 `rowKey` 和 `reserveSelection` 使用。

<DemoPreview dir="demos/ma-table/selection" />

### 響應式和自適應高度

開啟 `adaption` 後，元件會根據視窗高度設定表格 `height`，並用 `adaptionOffsetBottom` 保留底部空間。載入狀態可以透過 `loading` 或 `setLoadingState` 控制。

<DemoPreview dir="demos/ma-table/responsive" />

## 使用建議

MaTable 的核心是把 Element Plus Table / TableColumn 配置集中到 `options` 和 `columns`：

- 靜態表格優先使用 `columns`、`options` 和元件屬性完成宣告式配置。
- 需要根據介面結果調整列或分頁時，透過模板 `ref` 呼叫 `setData`、`setPagination`、`setColumns`。
- 需要訪問原生 Element Plus Table 方法時，透過 `getElTableRef()` 獲取內部表格例項。
- 複雜單元格優先使用 `cellRender` 或 `column-[prop]` 插槽，表頭則使用 `headerRender` 或 `header-[prop]` 插槽。

## 型別匯出

`@mineadmin/table` 匯出下列型別，業務專案可以直接複用：

```ts
export type {
  MaTableInstallOptions,
  MaTableSetting,
  MaTableOptions,
  MaTableExpose,
  MaTableColumns,
  PaginationProps,
  LoadingConfig,
  TableColumnFilterPlacement,
  TableColumnSortOrders,
  TableColumnSortable,
  TableColumnRenderer,
  TableColumnScope,
  TableColumnFixed,
  TableColumnType,
  TableColumn,
} from '@mineadmin/table'
```

## 相關連結

- [Element Plus Table](https://element-plus.org/zh-CN/component/table.html)
- [Element Plus Pagination](https://element-plus.org/zh-CN/component/pagination.html)
- [@mineadmin/table 原始碼倉庫](https://github.com/mineadmin/mineadmin-table)
