# MaProTable

`@mineadmin/pro-table` 是基於 `@mineadmin/search` 和 `@mineadmin/table` 封裝的高級表格組件，適合後台列表、分頁查詢、搜索篩選、跨頁多選、操作列、工具欄擴展和右鍵菜單等數據管理場景。

本文基於 `@mineadmin/pro-table` `1.0.89` 源碼整理。

## 安裝

```bash
pnpm add @mineadmin/pro-table @mineadmin/search @mineadmin/table @mineadmin/form element-plus @imengyu/vue3-context-menu
```

`ma-pro-table` 內部會渲染 `ma-search` 和 `ma-table`，而 `ma-search` 又依賴 `ma-form`，所以應用入口需要一起註冊這些組件。
如果項目不需要行右鍵菜單，可以省略 `@imengyu/vue3-context-menu` 以及示例中的 `provider.contextMenu`。

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

如果在 SSR 場景使用，可以把 `ssr` 設為 `true`，組件會等到客户端掛載後再渲染主體內容。

## 快速開始

下面示例展示了一個包含搜索、分頁、行拖拽、操作列、工具欄插槽和右鍵菜單的完整 `ma-pro-table`。

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
        { id: 1, username: 'admin', status: '啓用', created_at: '2026-06-15' },
        { id: 2, username: 'demo', status: '禁用', created_at: '2026-06-15' },
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
    { label: '用户名', prop: 'username', render: 'input' },
    { label: '狀態', prop: 'status', render: 'select' },
  ],
  tableColumns: [
    { type: 'selection' },
    { type: 'index' },
    { label: '用户名', prop: 'username' },
    {
      label: '狀態',
      prop: 'status',
      cellRenderTo: {
        name: 'tag',
        props: { type: 'success' },
      },
    },
    { label: '創建時間', prop: 'created_at' },
  ],
})
</script>

<template>
  <ma-pro-table ref="tableRef" :options="options" :schema="schema" />
</template>
```

## 示例演示

### 基礎用法

最簡單的表格使用方式，包含搜索、分頁和基本操作功能。

<DemoPreview dir="demos/ma-pro-table-examples/basic" />

### 高級搜索

展示多種搜索組件類型和複雜搜索邏輯，包含日期範圍、數字範圍、多選等場景。

<DemoPreview dir="demos/ma-pro-table-examples/advanced-search" />

### 自定義操作

展示操作列、批量動作、條件顯示和拖拽排序等交互配置。

<DemoPreview dir="demos/ma-pro-table-examples/custom-operations" />

### 單元格渲染插件

演示內置 `tag` 插件以及自定義渲染插件的註冊與使用。

<DemoPreview dir="demos/ma-pro-table-examples/cell-render-plugins" />

### 工具欄擴展

通過 `useProTableToolbar()` 和插槽擴展默認工具欄。

<DemoPreview dir="demos/ma-pro-table-examples/toolbar-extensions" />

### 數據管理

展示新增、編輯、刪除、選中導出和統計聯動等完整 CRUD 流程。

<DemoPreview dir="demos/ma-pro-table-examples/data-management" />

### 響應式佈局

演示不同寬度下的表格和搜索區域佈局適配。

<DemoPreview dir="demos/ma-pro-table-examples/responsive-layout" />

## 組件參數

| 參數 | 説明 | 類型 | 默認值 |
| --- | --- | --- | --- |
| `options` | 表格、搜索、請求、工具欄等運行配置 | `MaProTableOptions` | `{ tableOptions: {}, searchOptions: {}, searchFormOptions: {} }` |
| `schema` | 搜索項與表格列配置 | `MaProTableSchema` | `{ searchItems: [], tableColumns: [] }` |

### MaProTableSchema

| 字段 | 説明 | 類型 |
| --- | --- | --- |
| `searchItems` | 搜索表單項，透傳給 `ma-search` 的 `search-items` | `MaSearchItem[]` |
| `tableColumns` | 表格列配置，最終會轉換為 `ma-table` 列 | `MaProTableColumns[]` |

### MaProTableColumns

`MaProTableColumns` 繼承 `ma-table` 的列配置，並額外擴展了以下能力：

| 字段 | 説明 |
| --- | --- |
| `type` | 支持 `ma-table` 原有列類型，並擴展 `operation` 操作列、`sort` 行拖拽列 |
| `toolHide` | 在默認列設置工具裏隱藏該列 |
| `cellRenderTo` | 使用已註冊的單元格渲染插件 |
| `cellRenderPro` | 自定義單元格渲染，參數會額外拿到 `MaProTableExpose` |
| `headerRenderPro` | 自定義表頭渲染，參數會額外拿到 `MaProTableExpose` |
| `operationConfigure` | `type: 'operation'` 時的操作列配置 |
| `children` | 多級表頭 |

## 請求與分頁

配置 `requestOptions.api` 後，組件會在掛載時自動請求數據，並在分頁、搜索、重置時更新請求參數。

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

默認響應結構為：

```ts
{
  data: {
    list: [],
    total: 0,
  },
}
```

| 配置 | 説明 | 默認值 |
| --- | --- | --- |
| `api` | 請求方法，組件會把合併後的分頁、搜索和 `requestParams` 作為第一個參數傳入 | - |
| `autoRequest` | 是否掛載後自動請求 | `true` |
| `response.dataKey` | 列表數據字段 | `list` |
| `response.totalKey` | 總數字段 | `total` |
| `requestPage.pageName` | 頁碼參數名 | `page` |
| `requestPage.sizeName` | 每頁條數參數名 | `page_size` |
| `requestPage.size` | 默認每頁條數 | `10` |
| `requestParams` | 初始請求參數 | `{}` |
| `responseDataHandler` | 響應數據後處理函數，需要返回最終表格數組 | - |

如果沒有配置 `requestOptions.api`，組件會使用 `tableOptions.data` 作為靜態數據。

## 搜索

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

`onSearchSubmit` 和 `onSearchReset` 的返回值會繼續作為請求參數合併。如果只做副作用，也需要 `return form`。

## 操作列

把列類型設為 `operation` 後，可以通過 `operationConfigure.actions` 配置行操作。

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

| 配置 | 説明 | 默認值 |
| --- | --- | --- |
| `operationConfigure.type` | 展示方式：`auto` 自動摺疊、`dropdown` 全部下拉、`tile` 全部平鋪 | `auto` |
| `operationConfigure.fold` | `auto` 模式下平鋪顯示幾個操作，其餘進入下拉 | `1` |
| `actions[].name` | 操作標識 | - |
| `actions[].text` | 文本或返回文本的函數 | `unknown` |
| `actions[].icon` | 圖標名或返回圖標名的函數，需要註冊 `provider.icon` | - |
| `actions[].order` | 排序值，越小越靠前 | - |
| `actions[].show` | 是否顯示 | - |
| `actions[].disabled` | 是否禁用 | - |
| `actions[].onClick` | 點擊回調，參數為表格渲染數據、`proxy` 和鼠標事件 | - |
| `actions[].linkProps` | 透傳給 `el-link` 的屬性 | - |

## 行拖拽排序

添加 `type: 'sort'` 列後，組件會渲染拖拽手柄，並在拖拽結束後觸發 `row-drag-sort`。

```vue
<script setup lang="ts">
const schema = {
  tableColumns: [
    { type: 'sort' },
    { label: '用户名', prop: 'username' },
  ],
}

const handleDragSort = (data: any[]) => {
  console.log('排序後的數據', data)
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

也可以通過 `options.on.rowDragSort` 接收同一個結果。

## 跨頁多選

跨頁多選會把不同分頁上的選擇項合併到同一個數組裏。實際使用時建議顯式配置 `rowKey`，並提供 `onSelectionChange` 回調接收合併後的結果。

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

## 右鍵菜單

右鍵菜單需要在安裝組件時提供 `provider.contextMenu`，然後在頁面裏開啓 `rowContextMenu.enabled`。

```ts
const options: MaProTableOptions = {
  rowContextMenu: {
    enabled: true,
    items: [
      {
        label: '刷新',
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

`ContextMenuItem` 支持 `label`、`icon`、`disabled`、`divided` 和 `onMenuClick`。

## 單元格渲染插件

`cellRenderTo` 適合把常見單元格顯示邏輯封裝成可複用插件。組件內置了一個 `tag` 插件，會用 `el-tag` 渲染單元格內容。

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

當 `props.prop` 未傳入時，組件會自動使用當前列的 `prop`。

### 註冊插件

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

當前 `1.0.89` 源碼在執行 `cellRenderTo` 時傳給插件的參數順序是 `(data, props, proxy)`，其中 `props` 來自列配置的 `cellRenderTo.props`，`proxy` 是當前 `ma-pro-table` 實例。

| 方法 | 説明 |
| --- | --- |
| `addPlugin(plugin)` | 註冊插件，同名插件不會重複註冊 |
| `removePlugin(name)` | 移除插件 |
| `getPlugins()` | 獲取所有插件 |
| `getPluginByName(name)` | 按名稱獲取插件 |

## 工具欄

默認工具欄包含：

| 名稱 | 功能 |
| --- | --- |
| `mineProTableRefresh` | 刷新數據 |
| `mineProTableSearch` | 顯示或隱藏搜索區域 |
| `mineProTablePrint` | 打印當前表格 |
| `mineProTableSetting` | 列顯示與固定列設置 |

可以通過 `toolStates` 在當前頁面控制默認工具顯示狀態。

```ts
const options: MaProTableOptions = {
  toolbar: true,
  toolStates: {
    mineProTablePrint: false,
  },
}
```

### 擴展工具欄

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

自定義工具組件會收到 `proxy` 參數。
默認安裝參數中的 `provider.toolbars` 會被組件初始化為內置工具欄；需要擴展工具時，建議在組件上下文中使用 `useProTableToolbar()` 添加。

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

| 方法 | 説明 |
| --- | --- |
| `add(toolbar)` | 添加工具，同名工具不會重複註冊 |
| `remove(name)` | 移除工具 |
| `get(name)` | 獲取指定工具 |
| `getAll()` | 獲取全部工具 |
| `hide(name)` | 全局隱藏工具 |
| `show(name)` | 全局顯示工具 |

## Header 與佈局

```ts
const options: MaProTableOptions = {
  header: {
    show: true,
    mainTitle: '用户管理',
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

| 配置 | 説明 | 默認值 |
| --- | --- | --- |
| `header.show` | 是否顯示頭部 | `false` |
| `header.mainTitle` | 主標題 | `表格主標題` |
| `header.subTitle` | 副標題 | 空字符串 |
| `actionBtnPosition` | `actions` 插槽顯示位置：`auto`、`header`、`table` | `auto` |
| `toolbar` | 是否顯示工具欄 | `true` |
| `adaptionOffsetBottom` | 自適應高度額外底部偏移 | `0` |

## 插槽

| 插槽 | 説明 |
| --- | --- |
| `search` | 搜索表單默認內容，透傳給 `ma-search` |
| `searchActions` | 搜索按鈕區域，透傳給 `ma-search` |
| `searchBeforeActions` | 搜索操作前置區域 |
| `searchAfterActions` | 搜索操作後置區域 |
| `actions` | 頁面動作按鈕區域，位置由 `actionBtnPosition` 決定 |
| `headerTitle` | 替換默認頭部標題 |
| `tableHeader` | 替換整個頭部 |
| `headerRight` | 頭部右側擴展 |
| `toolbarLeft` | 工具欄左側擴展 |
| `beforeToolbar` | 默認工具欄前置內容 |
| `toolbar` | 替換默認工具欄 |
| `afterToolbar` | 默認工具欄後置內容 |
| `middle` | 搜索區與表格卡片之間的內容 |
| `tableTop` | 表格卡片頂部內容 |
| `tableCranny` | 工具欄和表格之間的內容 |
| `default` | 默認插槽會繼續傳遞給內部 `ma-table` |

除以上插槽外，傳入 `ma-pro-table` 的其他插槽也會繼續透傳給內部 `ma-table`。

## 事件

| 事件 | 説明 |
| --- | --- |
| `search-submit` | 搜索提交後觸發，參數為最終搜索表單 |
| `search-reset` | 搜索重置後觸發，參數為最終搜索表單 |
| `row-drag-sort` | 行拖拽排序結束後觸發，參數為排序後的表格數據 |

`ma-table` 原生事件建議通過 `options.tableOptions.on` 配置。

## 暴露方法

通過模板引用可以調用組件暴露的方法。

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

| 方法 | 説明 |
| --- | --- |
| `getSearchRef()` | 獲取內部 `ma-search` 實例 |
| `getTableRef()` | 獲取內部 `ma-table` 實例 |
| `getElTableStates()` | 獲取內部 Element Plus Table store states |
| `refresh()` | 按當前參數重新請求數據 |
| `requestData()` | 請求數據；當 `autoRequest` 為 `false` 時首次調用會初始化分頁並開啓請求 |
| `changeApi(api, isRequestNow)` | 更換請求方法，`isRequestNow` 默認 `true` |
| `setRequestParams(params, isRequestNow)` | 合併請求參數，`isRequestNow` 默認 `false` |
| `setTableColumns(cols)` | 重設表格列 |
| `getTableColumns()` | 獲取當前表格列 |
| `setSearchForm(form)` | 設置搜索表單 |
| `getSearchForm()` | 獲取搜索表單 |
| `search(params?)` | 合併當前搜索表單和額外參數後立即查詢 |
| `setProTableOptions(opts)` | 動態合併組件配置 |
| `getProTableOptions()` | 獲取當前組件配置 |
| `resizeHeight()` | 重新計算自適應高度 |
| `getCurrentId()` | 獲取當前組件內部生成的 ID |

## 常見注意點

- `requestPage.sizeName` 當前源碼默認值是 `page_size`，如果後端使用 `pageSize`，需要顯式配置。
- `onSearchSubmit` 和 `onSearchReset` 會把返回值作為最終搜索參數；不要只寫副作用後不返回表單。
- 開啓跨頁多選時，建議同時配置 `tableOptions.rowKey` 和 `tableOptions.on.onSelectionChange`。
- 類型裏保留了 `options.id`，但當前組件會生成內部隨機 ID；運行時請通過 `getCurrentId()` 獲取。
- `cellRenderTo` 適合複用渲染邏輯；一次性的單元格展示可以直接使用 `cellRenderPro` 或 `ma-table` 原有 `cellRender`。
