# MaProTable

`@mineadmin/pro-table` 是基於 `@mineadmin/search` 和 `@mineadmin/table` 封裝的高階表格元件，適合後臺列表、分頁查詢、搜尋篩選、跨頁多選、操作列、工具欄擴充套件和右鍵選單等資料管理場景。

本文基於 `@mineadmin/pro-table` `1.0.89` 原始碼整理。

## 安裝

```bash
pnpm add @mineadmin/pro-table @mineadmin/search @mineadmin/table @mineadmin/form element-plus @imengyu/vue3-context-menu
```

`ma-pro-table` 內部會渲染 `ma-search` 和 `ma-table`，而 `ma-search` 又依賴 `ma-form`，所以應用入口需要一起註冊這些元件。
如果專案不需要行右鍵選單，可以省略 `@imengyu/vue3-context-menu` 以及示例中的 `provider.contextMenu`。

```ts
import { createApp, markRaw } from 'vue'
import ElementPlus from 'element-plus'
import MaForm from '@mineadmin/form'
import MaTable from '@mineadmin/table'
import MaSearch from '@mineadmin/search'
import MaProTable from '@mineadmin/pro-table'
import ContextMenu from '@imengyu/vue3-context-menu'

import 'element-plus/dist/index.css'
import '@mineadmin/search/dist/style.css'
import '@mineadmin/table/dist/style.css'
import '@mineadmin/pro-table/dist/style.css'
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'

const app = createApp(App)

app
  .use(ElementPlus)
  .use(MaForm)
  .use(MaTable)
  .use(MaSearch)
  .use(MaProTable, {
    ssr: false,
    provider: {
      app,
      contextMenu: markRaw(ContextMenu.showContextMenu),
    },
  })
  .mount('#app')
```

如果在 SSR 場景使用，可以把 `ssr` 設為 `true`，元件會等到客戶端掛載後再渲染主體內容。

## 快速開始

下面示例展示了一個包含搜尋、分頁、行拖拽、操作列、工具欄插槽和右鍵選單的完整 `ma-pro-table`。

<DemoPreview dir="demos/ma-pro-table" />

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'
import type {
  MaProTableExpose,
  MaProTableOptions,
  MaProTableSchema,
} from '@mineadmin/pro-table'

const tableRef = ref<MaProTableExpose>()

const getUserList = (params: Record<string, any>) => {
  return Promise.resolve({
    data: {
      total: 2,
      list: [
        { id: 1, username: 'admin', status: '啟用', created_at: '2026-06-15' },
        { id: 2, username: 'demo', status: '停用', created_at: '2026-06-15' },
      ],
    },
  })
}

const options = reactive<MaProTableOptions>({
  requestOptions: {
    api: getUserList,
    response: {
      dataKey: 'list',
      totalKey: 'total',
    },
    requestPage: {
      pageName: 'page',
      sizeName: 'page_size',
      size: 10,
    },
  },
  tableOptions: {
    rowKey: 'id',
    stripe: true,
  },
})

const schema = reactive<MaProTableSchema>({
  searchItems: [
    { label: '使用者名稱', prop: 'username', render: 'input' },
    { label: '狀態', prop: 'status', render: 'select' },
  ],
  tableColumns: [
    { type: 'selection' },
    { type: 'index' },
    { label: '使用者名稱', prop: 'username' },
    {
      label: '狀態',
      prop: 'status',
      cellRenderTo: {
        name: 'tag',
        props: { type: 'success' },
      },
    },
    { label: '建立時間', prop: 'created_at' },
  ],
})
</script>

<template>
  <ma-pro-table ref="tableRef" :options="options" :schema="schema" />
</template>
```

## 示例演示

### 基礎用法

最簡單的表格使用方式，包含搜尋、分頁和基本操作功能。

<DemoPreview dir="demos/ma-pro-table-examples/basic" />

### 高階搜尋

展示多種搜尋元件型別和複雜搜尋邏輯，包含日期範圍、數字範圍、多選等場景。

<DemoPreview dir="demos/ma-pro-table-examples/advanced-search" />

### 自定義操作

展示操作列、批次動作、條件顯示和拖拽排序等互動配置。

<DemoPreview dir="demos/ma-pro-table-examples/custom-operations" />

### 單元格渲染外掛

演示內建 `tag` 外掛以及自定義渲染外掛的註冊與使用。

<DemoPreview dir="demos/ma-pro-table-examples/cell-render-plugins" />

### 工具欄擴充套件

透過 `useProTableToolbar()` 和插槽擴充套件預設工具欄。

<DemoPreview dir="demos/ma-pro-table-examples/toolbar-extensions" />

### 資料管理

展示新增、編輯、刪除、選中匯出和統計聯動等完整 CRUD 流程。

<DemoPreview dir="demos/ma-pro-table-examples/data-management" />

### 響應式佈局

演示不同寬度下的表格和搜尋區域佈局適配。

<DemoPreview dir="demos/ma-pro-table-examples/responsive-layout" />

## 元件引數

| 引數 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| `options` | 表格、搜尋、請求、工具欄等執行配置 | `MaProTableOptions` | `{ tableOptions: {}, searchOptions: {}, searchFormOptions: {} }` |
| `schema` | 搜尋項與表格列配置 | `MaProTableSchema` | `{ searchItems: [], tableColumns: [] }` |

### MaProTableSchema

| 欄位 | 說明 | 型別 |
| --- | --- | --- |
| `searchItems` | 搜尋表單項，透傳給 `ma-search` 的 `search-items` | `MaSearchItem[]` |
| `tableColumns` | 表格列配置，最終會轉換為 `ma-table` 列 | `MaProTableColumns[]` |

### MaProTableColumns

`MaProTableColumns` 繼承 `ma-table` 的列配置，並額外擴充套件了以下能力：

| 欄位 | 說明 |
| --- | --- |
| `type` | 支援 `ma-table` 原有列型別，並擴充套件 `operation` 操作列、`sort` 行拖拽列 |
| `toolHide` | 在預設列設定工具裡隱藏該列 |
| `cellRenderTo` | 使用已註冊的單元格渲染外掛 |
| `cellRenderPro` | 自定義單元格渲染，引數會額外拿到 `MaProTableExpose` |
| `headerRenderPro` | 自定義表頭渲染，引數會額外拿到 `MaProTableExpose` |
| `operationConfigure` | `type: 'operation'` 時的操作列配置 |
| `children` | 多級表頭 |

## 請求與分頁

配置 `requestOptions.api` 後，元件會在掛載時自動請求資料，並在分頁、搜尋、重置時更新請求引數。

```ts
const options: MaProTableOptions = {
  requestOptions: {
    api: params => http.get('/system/user', { params }),
    autoRequest: true,
    requestParams: {
      status: 1,
    },
    requestPage: {
      pageName: 'page',
      sizeName: 'page_size',
      size: 20,
    },
    response: {
      dataKey: 'list',
      totalKey: 'total',
    },
    responseDataHandler: response => response.list ?? [],
  },
}
```

預設響應結構為：

```ts
{
  data: {
    list: [],
    total: 0,
  },
}
```

| 配置 | 說明 | 預設值 |
| --- | --- | --- |
| `api` | 請求方法，元件會把合併後的分頁、搜尋和 `requestParams` 作為第一個引數傳入 | - |
| `autoRequest` | 是否掛載後自動請求 | `true` |
| `response.dataKey` | 列表資料欄位 | `list` |
| `response.totalKey` | 總數字段 | `total` |
| `requestPage.pageName` | 頁碼引數名 | `page` |
| `requestPage.sizeName` | 每頁條數引數名 | `page_size` |
| `requestPage.size` | 預設每頁條數 | `10` |
| `requestParams` | 初始請求引數 | `{}` |
| `responseDataHandler` | 響應資料後處理函式，需要返回最終表格陣列 | - |

如果沒有配置 `requestOptions.api`，元件會使用 `tableOptions.data` 作為靜態資料。

## 搜尋

`schema.searchItems` 會交給 `ma-search` 渲染。`searchOptions` 會透傳給 `ma-search`，`searchFormOptions` 會透傳給 `ma-search` 內部的 `ma-form`。

```ts
const options: MaProTableOptions = {
  searchOptions: {
    show: true,
    fold: true,
  },
  searchFormOptions: {
    labelWidth: '90px',
  },
  onSearchSubmit: form => {
    return {
      ...form,
      searched_at: Date.now(),
    }
  },
  onSearchReset: form => {
    return form
  },
}
```

`onSearchSubmit` 和 `onSearchReset` 的返回值會繼續作為請求引數合併。如果只做副作用，也需要 `return form`。

## 操作列

把列型別設為 `operation` 後，可以透過 `operationConfigure.actions` 配置行操作。

```ts
const schema: MaProTableSchema = {
  tableColumns: [
    {
      type: 'operation',
      operationConfigure: {
        type: 'auto',
        fold: 1,
        actions: [
          {
            name: 'edit',
            text: '編輯',
            order: 10,
            linkProps: { type: 'primary' },
            show: ({ row }) => row.status !== 'locked',
            disabled: ({ row }) => row.status === 'disabled',
            onClick: ({ row }, proxy) => {
              console.log('編輯行', row)
              proxy.refresh()
            },
          },
          {
            name: 'delete',
            text: ({ row }) => `刪除 ${row.username}`,
            order: 20,
            linkProps: { type: 'danger' },
            onClick: ({ row }) => {
              console.log('刪除行', row)
            },
          },
        ],
      },
    },
  ],
}
```

| 配置 | 說明 | 預設值 |
| --- | --- | --- |
| `operationConfigure.type` | 展示方式：`auto` 自動摺疊、`dropdown` 全部下拉、`tile` 全部平鋪 | `auto` |
| `operationConfigure.fold` | `auto` 模式下平鋪顯示幾個操作，其餘進入下拉 | `1` |
| `actions[].name` | 操作標識 | - |
| `actions[].text` | 文字或返回文字的函式 | `unknown` |
| `actions[].icon` | 圖示名或返回圖示名的函式，需要註冊 `provider.icon` | - |
| `actions[].order` | 排序值，越小越靠前 | - |
| `actions[].show` | 是否顯示 | - |
| `actions[].disabled` | 是否停用 | - |
| `actions[].onClick` | 點選回撥，引數為表格渲染資料、`proxy` 和滑鼠事件 | - |
| `actions[].linkProps` | 透傳給 `el-link` 的屬性 | - |

## 行拖拽排序

新增 `type: 'sort'` 列後，元件會渲染拖拽手柄，並在拖拽結束後觸發 `row-drag-sort`。

```vue
<script setup lang="ts">
const schema = {
  tableColumns: [
    { type: 'sort' },
    { label: '使用者名稱', prop: 'username' },
  ],
}

const handleDragSort = (data: any[]) => {
  console.log('排序後的資料', data)
}
</script>

<template>
  <ma-pro-table
    :schema="schema"
    :options="options"
    @row-drag-sort="handleDragSort"
  />
</template>
```

也可以透過 `options.on.rowDragSort` 接收同一個結果。

## 跨頁多選

跨頁多選會把不同分頁上的選擇項合併到同一個數組裡。實際使用時建議顯式配置 `rowKey`，並提供 `onSelectionChange` 回撥接收合併後的結果。

```ts
const selectedRows = ref<any[]>([])

const options: MaProTableOptions = {
  selection: {
    crossPage: true,
    selectedText: '已選擇 {number} 項',
    clearText: '清空',
  },
  tableOptions: {
    rowKey: 'id',
    on: {
      onSelectionChange: rows => {
        selectedRows.value = rows
      },
    },
  },
}
```

## 右鍵選單

右鍵選單需要在安裝元件時提供 `provider.contextMenu`，然後在頁面裡開啟 `rowContextMenu.enabled`。

```ts
const options: MaProTableOptions = {
  rowContextMenu: {
    enabled: true,
    items: [
      {
        label: '重新整理',
        icon: 'i-ri-refresh-line',
        onMenuClick: ({ row, proxy }, event) => {
          console.log(row, event)
          proxy.refresh()
        },
      },
    ],
  },
}
```

`ContextMenuItem` 支援 `label`、`icon`、`disabled`、`divided` 和 `onMenuClick`。

## 單元格渲染外掛

`cellRenderTo` 適合把常見單元格顯示邏輯封裝成可複用外掛。元件內建了一個 `tag` 外掛，會用 `el-tag` 渲染單元格內容。

```ts
const schema: MaProTableSchema = {
  tableColumns: [
    {
      label: '狀態',
      prop: 'status_text',
      cellRenderTo: {
        name: 'tag',
        props: {
          type: 'success',
        },
      },
    },
  ],
}
```

當 `props.prop` 未傳入時，元件會自動使用當前列的 `prop`。

### 註冊外掛

```ts
import { h } from 'vue'
import { ElTag } from 'element-plus'
import {
  useProTableRenderPlugin,
  type MaProTableRenderPlugin,
} from '@mineadmin/pro-table'

const { addPlugin } = useProTableRenderPlugin()

const statusPlugin: MaProTableRenderPlugin = {
  name: 'status-tag',
  render: (data, props, proxy) => {
    return h(
      ElTag,
      {
        type: data.row.status === 1 ? 'success' : 'info',
        ...props,
      },
      {
        default: () => data.row[props?.prop ?? 'status_text'],
      },
    )
  },
}

addPlugin(statusPlugin)
```

`useProTableRenderPlugin()` 提供：

當前 `1.0.89` 原始碼在執行 `cellRenderTo` 時傳給外掛的引數順序是 `(data, props, proxy)`，其中 `props` 來自列配置的 `cellRenderTo.props`，`proxy` 是當前 `ma-pro-table` 例項。

| 方法 | 說明 |
| --- | --- |
| `addPlugin(plugin)` | 註冊外掛，同名外掛不會重複註冊 |
| `removePlugin(name)` | 移除外掛 |
| `getPlugins()` | 獲取所有外掛 |
| `getPluginByName(name)` | 按名稱獲取外掛 |

## 工具欄

預設工具欄包含：

| 名稱 | 功能 |
| --- | --- |
| `mineProTableRefresh` | 重新整理資料 |
| `mineProTableSearch` | 顯示或隱藏搜尋區域 |
| `mineProTablePrint` | 列印當前表格 |
| `mineProTableSetting` | 列顯示與固定列設定 |

可以透過 `toolStates` 在當前頁面控制預設工具顯示狀態。

```ts
const options: MaProTableOptions = {
  toolbar: true,
  toolStates: {
    mineProTablePrint: false,
  },
}
```

### 擴充套件工具欄

```ts
import ExportButton from './ExportButton.vue'
import { useProTableToolbar } from '@mineadmin/pro-table'

const { add } = useProTableToolbar()

add({
  name: 'export',
  order: 20,
  show: true,
  render: () => ExportButton,
})
```

自定義工具元件會收到 `proxy` 引數。
預設安裝引數中的 `provider.toolbars` 會被元件初始化為內建工具欄；需要擴充套件工具時，建議在元件上下文中使用 `useProTableToolbar()` 新增。

```vue
<script setup lang="ts">
import type { MaProTableExpose } from '@mineadmin/pro-table'

const props = defineProps<{
  proxy: MaProTableExpose
}>()

const exportData = async () => {
  await props.proxy.requestData()
  console.log(props.proxy.getTableColumns())
}
</script>

<template>
  <el-button circle @click="exportData">導</el-button>
</template>
```

`useProTableToolbar()` 提供：

| 方法 | 說明 |
| --- | --- |
| `add(toolbar)` | 新增工具，同名工具不會重複註冊 |
| `remove(name)` | 移除工具 |
| `get(name)` | 獲取指定工具 |
| `getAll()` | 獲取全部工具 |
| `hide(name)` | 全域性隱藏工具 |
| `show(name)` | 全域性顯示工具 |

## Header 與佈局

```ts
const options: MaProTableOptions = {
  header: {
    show: true,
    mainTitle: '使用者管理',
    subTitle: '維護賬號、角色和狀態',
  },
  actionBtnPosition: 'auto',
  toolbar: true,
  adaptionOffsetBottom: 0,
  tableOptions: {
    adaption: true,
  },
}
```

| 配置 | 說明 | 預設值 |
| --- | --- | --- |
| `header.show` | 是否顯示頭部 | `false` |
| `header.mainTitle` | 主標題 | `表格主標題` |
| `header.subTitle` | 副標題 | 空字串 |
| `actionBtnPosition` | `actions` 插槽顯示位置：`auto`、`header`、`table` | `auto` |
| `toolbar` | 是否顯示工具欄 | `true` |
| `adaptionOffsetBottom` | 自適應高度額外底部偏移 | `0` |

## 插槽

| 插槽 | 說明 |
| --- | --- |
| `search` | 搜尋表單預設內容，透傳給 `ma-search` |
| `searchActions` | 搜尋按鈕區域，透傳給 `ma-search` |
| `searchBeforeActions` | 搜尋操作前置區域 |
| `searchAfterActions` | 搜尋操作後置區域 |
| `actions` | 頁面動作按鈕區域，位置由 `actionBtnPosition` 決定 |
| `headerTitle` | 替換預設頭部標題 |
| `tableHeader` | 替換整個頭部 |
| `headerRight` | 頭部右側擴充套件 |
| `toolbarLeft` | 工具欄左側擴充套件 |
| `beforeToolbar` | 預設工具欄前置內容 |
| `toolbar` | 替換預設工具欄 |
| `afterToolbar` | 預設工具欄後置內容 |
| `middle` | 搜尋區與表格卡片之間的內容 |
| `tableTop` | 表格卡片頂部內容 |
| `tableCranny` | 工具欄和表格之間的內容 |
| `default` | 預設插槽會繼續傳遞給內部 `ma-table` |

除以上插槽外，傳入 `ma-pro-table` 的其他插槽也會繼續透傳給內部 `ma-table`。

## 事件

| 事件 | 說明 |
| --- | --- |
| `search-submit` | 搜尋提交後觸發，引數為最終搜尋表單 |
| `search-reset` | 搜尋重置後觸發，引數為最終搜尋表單 |
| `row-drag-sort` | 行拖拽排序結束後觸發，引數為排序後的表格資料 |

`ma-table` 原生事件建議透過 `options.tableOptions.on` 配置。

## 暴露方法

透過模板引用可以呼叫元件暴露的方法。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { MaProTableExpose } from '@mineadmin/pro-table'

const tableRef = ref<MaProTableExpose>()

const reloadWithStatus = async () => {
  await tableRef.value?.setRequestParams({ status: 1 }, true)
}
</script>

<template>
  <ma-pro-table ref="tableRef" :options="options" :schema="schema" />
</template>
```

| 方法 | 說明 |
| --- | --- |
| `getSearchRef()` | 獲取內部 `ma-search` 例項 |
| `getTableRef()` | 獲取內部 `ma-table` 例項 |
| `getElTableStates()` | 獲取內部 Element Plus Table store states |
| `refresh()` | 按當前引數重新請求資料 |
| `requestData()` | 請求資料；當 `autoRequest` 為 `false` 時首次呼叫會初始化分頁並開啟請求 |
| `changeApi(api, isRequestNow)` | 更換請求方法，`isRequestNow` 預設 `true` |
| `setRequestParams(params, isRequestNow)` | 合併請求引數，`isRequestNow` 預設 `false` |
| `setTableColumns(cols)` | 重設表格列 |
| `getTableColumns()` | 獲取當前表格列 |
| `setSearchForm(form)` | 設定搜尋表單 |
| `getSearchForm()` | 獲取搜尋表單 |
| `search(params?)` | 合併當前搜尋表單和額外引數後立即查詢 |
| `setProTableOptions(opts)` | 動態合併元件配置 |
| `getProTableOptions()` | 獲取當前元件配置 |
| `resizeHeight()` | 重新計算自適應高度 |
| `getCurrentId()` | 獲取當前元件內部生成的 ID |

## 常見注意點

- `requestPage.sizeName` 當前原始碼預設值是 `page_size`，如果後端使用 `pageSize`，需要顯式配置。
- `onSearchSubmit` 和 `onSearchReset` 會把返回值作為最終搜尋引數；不要只寫副作用後不返回表單。
- 開啟跨頁多選時，建議同時配置 `tableOptions.rowKey` 和 `tableOptions.on.onSelectionChange`。
- 型別裡保留了 `options.id`，但當前元件會生成內部隨機 ID；執行時請透過 `getCurrentId()` 獲取。
- `cellRenderTo` 適合複用渲染邏輯；一次性的單元格展示可以直接使用 `cellRenderPro` 或 `ma-table` 原有 `cellRender`。
