# MaProTable

`@mineadmin/pro-table` 是基于 `@mineadmin/search` 和 `@mineadmin/table` 封装的高级表格组件，适合后台列表、分页查询、搜索筛选、跨页多选、操作列、工具栏扩展和右键菜单等数据管理场景。

本文基于 `@mineadmin/pro-table` `1.0.89` 源码整理。

## 安装

```bash
pnpm add @mineadmin/pro-table @mineadmin/search @mineadmin/table @mineadmin/form element-plus @imengyu/vue3-context-menu
```

`ma-pro-table` 内部会渲染 `ma-search` 和 `ma-table`，而 `ma-search` 又依赖 `ma-form`，所以应用入口需要一起注册这些组件。
如果项目不需要行右键菜单，可以省略 `@imengyu/vue3-context-menu` 以及示例中的 `provider.contextMenu`。

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

如果在 SSR 场景使用，可以把 `ssr` 设为 `true`，组件会等到客户端挂载后再渲染主体内容。

## 快速开始

下面示例展示了一个包含搜索、分页、行拖拽、操作列、工具栏插槽和右键菜单的完整 `ma-pro-table`。

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
        { id: 1, username: 'admin', status: '启用', created_at: '2026-06-15' },
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
    { label: '状态', prop: 'status', render: 'select' },
  ],
  tableColumns: [
    { type: 'selection' },
    { type: 'index' },
    { label: '用户名', prop: 'username' },
    {
      label: '状态',
      prop: 'status',
      cellRenderTo: {
        name: 'tag',
        props: { type: 'success' },
      },
    },
    { label: '创建时间', prop: 'created_at' },
  ],
})
</script>

<template>
  <ma-pro-table ref="tableRef" :options="options" :schema="schema" />
</template>
```

## 示例演示

### 基础用法

最简单的表格使用方式，包含搜索、分页和基本操作功能。

<DemoPreview dir="demos/ma-pro-table-examples/basic" />

### 高级搜索

展示多种搜索组件类型和复杂搜索逻辑，包含日期范围、数字范围、多选等场景。

<DemoPreview dir="demos/ma-pro-table-examples/advanced-search" />

### 自定义操作

展示操作列、批量动作、条件显示和拖拽排序等交互配置。

<DemoPreview dir="demos/ma-pro-table-examples/custom-operations" />

### 单元格渲染插件

演示内置 `tag` 插件以及自定义渲染插件的注册与使用。

<DemoPreview dir="demos/ma-pro-table-examples/cell-render-plugins" />

### 工具栏扩展

通过 `useProTableToolbar()` 和插槽扩展默认工具栏。

<DemoPreview dir="demos/ma-pro-table-examples/toolbar-extensions" />

### 数据管理

展示新增、编辑、删除、选中导出和统计联动等完整 CRUD 流程。

<DemoPreview dir="demos/ma-pro-table-examples/data-management" />

### 响应式布局

演示不同宽度下的表格和搜索区域布局适配。

<DemoPreview dir="demos/ma-pro-table-examples/responsive-layout" />

## 组件参数

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `options` | 表格、搜索、请求、工具栏等运行配置 | `MaProTableOptions` | `{ tableOptions: {}, searchOptions: {}, searchFormOptions: {} }` |
| `schema` | 搜索项与表格列配置 | `MaProTableSchema` | `{ searchItems: [], tableColumns: [] }` |

### MaProTableSchema

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| `searchItems` | 搜索表单项，透传给 `ma-search` 的 `search-items` | `MaSearchItem[]` |
| `tableColumns` | 表格列配置，最终会转换为 `ma-table` 列 | `MaProTableColumns[]` |

### MaProTableColumns

`MaProTableColumns` 继承 `ma-table` 的列配置，并额外扩展了以下能力：

| 字段 | 说明 |
| --- | --- |
| `type` | 支持 `ma-table` 原有列类型，并扩展 `operation` 操作列、`sort` 行拖拽列 |
| `toolHide` | 在默认列设置工具里隐藏该列 |
| `cellRenderTo` | 使用已注册的单元格渲染插件 |
| `cellRenderPro` | 自定义单元格渲染，参数会额外拿到 `MaProTableExpose` |
| `headerRenderPro` | 自定义表头渲染，参数会额外拿到 `MaProTableExpose` |
| `operationConfigure` | `type: 'operation'` 时的操作列配置 |
| `children` | 多级表头 |

## 请求与分页

配置 `requestOptions.api` 后，组件会在挂载时自动请求数据，并在分页、搜索、重置时更新请求参数。

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

默认响应结构为：

```ts
{
  data: {
    list: [],
    total: 0,
  },
}
```

| 配置 | 说明 | 默认值 |
| --- | --- | --- |
| `api` | 请求方法，组件会把合并后的分页、搜索和 `requestParams` 作为第一个参数传入 | - |
| `autoRequest` | 是否挂载后自动请求 | `true` |
| `response.dataKey` | 列表数据字段 | `list` |
| `response.totalKey` | 总数字段 | `total` |
| `requestPage.pageName` | 页码参数名 | `page` |
| `requestPage.sizeName` | 每页条数参数名 | `page_size` |
| `requestPage.size` | 默认每页条数 | `10` |
| `requestParams` | 初始请求参数 | `{}` |
| `responseDataHandler` | 响应数据后处理函数，需要返回最终表格数组 | - |

如果没有配置 `requestOptions.api`，组件会使用 `tableOptions.data` 作为静态数据。

## 搜索

`schema.searchItems` 会交给 `ma-search` 渲染。`searchOptions` 会透传给 `ma-search`，`searchFormOptions` 会透传给 `ma-search` 内部的 `ma-form`。

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

`onSearchSubmit` 和 `onSearchReset` 的返回值会继续作为请求参数合并。如果只做副作用，也需要 `return form`。

## 操作列

把列类型设为 `operation` 后，可以通过 `operationConfigure.actions` 配置行操作。

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
            text: '编辑',
            order: 10,
            linkProps: { type: 'primary' },
            show: ({ row }) => row.status !== 'locked',
            disabled: ({ row }) => row.status === 'disabled',
            onClick: ({ row }, proxy) => {
              console.log('编辑行', row)
              proxy.refresh()
            },
          },
          {
            name: 'delete',
            text: ({ row }) => `删除 ${row.username}`,
            order: 20,
            linkProps: { type: 'danger' },
            onClick: ({ row }) => {
              console.log('删除行', row)
            },
          },
        ],
      },
    },
  ],
}
```

| 配置 | 说明 | 默认值 |
| --- | --- | --- |
| `operationConfigure.type` | 展示方式：`auto` 自动折叠、`dropdown` 全部下拉、`tile` 全部平铺 | `auto` |
| `operationConfigure.fold` | `auto` 模式下平铺显示几个操作，其余进入下拉 | `1` |
| `actions[].name` | 操作标识 | - |
| `actions[].text` | 文本或返回文本的函数 | `unknown` |
| `actions[].icon` | 图标名或返回图标名的函数，需要注册 `provider.icon` | - |
| `actions[].order` | 排序值，越小越靠前 | - |
| `actions[].show` | 是否显示 | - |
| `actions[].disabled` | 是否禁用 | - |
| `actions[].onClick` | 点击回调，参数为表格渲染数据、`proxy` 和鼠标事件 | - |
| `actions[].linkProps` | 透传给 `el-link` 的属性 | - |

## 行拖拽排序

添加 `type: 'sort'` 列后，组件会渲染拖拽手柄，并在拖拽结束后触发 `row-drag-sort`。

```vue
<script setup lang="ts">
const schema = {
  tableColumns: [
    { type: 'sort' },
    { label: '用户名', prop: 'username' },
  ],
}

const handleDragSort = (data: any[]) => {
  console.log('排序后的数据', data)
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

也可以通过 `options.on.rowDragSort` 接收同一个结果。

## 跨页多选

跨页多选会把不同分页上的选择项合并到同一个数组里。实际使用时建议显式配置 `rowKey`，并提供 `onSelectionChange` 回调接收合并后的结果。

```ts
const selectedRows = ref<any[]>([])

const options: MaProTableOptions = {
  selection: {
    crossPage: true,
    selectedText: '已选择 {number} 项',
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

## 右键菜单

右键菜单需要在安装组件时提供 `provider.contextMenu`，然后在页面里开启 `rowContextMenu.enabled`。

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

## 单元格渲染插件

`cellRenderTo` 适合把常见单元格显示逻辑封装成可复用插件。组件内置了一个 `tag` 插件，会用 `el-tag` 渲染单元格内容。

```ts
const schema: MaProTableSchema = {
  tableColumns: [
    {
      label: '状态',
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

当 `props.prop` 未传入时，组件会自动使用当前列的 `prop`。

### 注册插件

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

当前 `1.0.89` 源码在执行 `cellRenderTo` 时传给插件的参数顺序是 `(data, props, proxy)`，其中 `props` 来自列配置的 `cellRenderTo.props`，`proxy` 是当前 `ma-pro-table` 实例。

| 方法 | 说明 |
| --- | --- |
| `addPlugin(plugin)` | 注册插件，同名插件不会重复注册 |
| `removePlugin(name)` | 移除插件 |
| `getPlugins()` | 获取所有插件 |
| `getPluginByName(name)` | 按名称获取插件 |

## 工具栏

默认工具栏包含：

| 名称 | 功能 |
| --- | --- |
| `mineProTableRefresh` | 刷新数据 |
| `mineProTableSearch` | 显示或隐藏搜索区域 |
| `mineProTablePrint` | 打印当前表格 |
| `mineProTableSetting` | 列显示与固定列设置 |

可以通过 `toolStates` 在当前页面控制默认工具显示状态。

```ts
const options: MaProTableOptions = {
  toolbar: true,
  toolStates: {
    mineProTablePrint: false,
  },
}
```

### 扩展工具栏

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

自定义工具组件会收到 `proxy` 参数。
默认安装参数中的 `provider.toolbars` 会被组件初始化为内置工具栏；需要扩展工具时，建议在组件上下文中使用 `useProTableToolbar()` 添加。

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
  <el-button circle @click="exportData">导</el-button>
</template>
```

`useProTableToolbar()` 提供：

| 方法 | 说明 |
| --- | --- |
| `add(toolbar)` | 添加工具，同名工具不会重复注册 |
| `remove(name)` | 移除工具 |
| `get(name)` | 获取指定工具 |
| `getAll()` | 获取全部工具 |
| `hide(name)` | 全局隐藏工具 |
| `show(name)` | 全局显示工具 |

## Header 与布局

```ts
const options: MaProTableOptions = {
  header: {
    show: true,
    mainTitle: '用户管理',
    subTitle: '维护账号、角色和状态',
  },
  actionBtnPosition: 'auto',
  toolbar: true,
  adaptionOffsetBottom: 0,
  tableOptions: {
    adaption: true,
  },
}
```

| 配置 | 说明 | 默认值 |
| --- | --- | --- |
| `header.show` | 是否显示头部 | `false` |
| `header.mainTitle` | 主标题 | `表格主标题` |
| `header.subTitle` | 副标题 | 空字符串 |
| `actionBtnPosition` | `actions` 插槽显示位置：`auto`、`header`、`table` | `auto` |
| `toolbar` | 是否显示工具栏 | `true` |
| `adaptionOffsetBottom` | 自适应高度额外底部偏移 | `0` |

## 插槽

| 插槽 | 说明 |
| --- | --- |
| `search` | 搜索表单默认内容，透传给 `ma-search` |
| `searchActions` | 搜索按钮区域，透传给 `ma-search` |
| `searchBeforeActions` | 搜索操作前置区域 |
| `searchAfterActions` | 搜索操作后置区域 |
| `actions` | 页面动作按钮区域，位置由 `actionBtnPosition` 决定 |
| `headerTitle` | 替换默认头部标题 |
| `tableHeader` | 替换整个头部 |
| `headerRight` | 头部右侧扩展 |
| `toolbarLeft` | 工具栏左侧扩展 |
| `beforeToolbar` | 默认工具栏前置内容 |
| `toolbar` | 替换默认工具栏 |
| `afterToolbar` | 默认工具栏后置内容 |
| `middle` | 搜索区与表格卡片之间的内容 |
| `tableTop` | 表格卡片顶部内容 |
| `tableCranny` | 工具栏和表格之间的内容 |
| `default` | 默认插槽会继续传递给内部 `ma-table` |

除以上插槽外，传入 `ma-pro-table` 的其他插槽也会继续透传给内部 `ma-table`。

## 事件

| 事件 | 说明 |
| --- | --- |
| `search-submit` | 搜索提交后触发，参数为最终搜索表单 |
| `search-reset` | 搜索重置后触发，参数为最终搜索表单 |
| `row-drag-sort` | 行拖拽排序结束后触发，参数为排序后的表格数据 |

`ma-table` 原生事件建议通过 `options.tableOptions.on` 配置。

## 暴露方法

通过模板引用可以调用组件暴露的方法。

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

| 方法 | 说明 |
| --- | --- |
| `getSearchRef()` | 获取内部 `ma-search` 实例 |
| `getTableRef()` | 获取内部 `ma-table` 实例 |
| `getElTableStates()` | 获取内部 Element Plus Table store states |
| `refresh()` | 按当前参数重新请求数据 |
| `requestData()` | 请求数据；当 `autoRequest` 为 `false` 时首次调用会初始化分页并开启请求 |
| `changeApi(api, isRequestNow)` | 更换请求方法，`isRequestNow` 默认 `true` |
| `setRequestParams(params, isRequestNow)` | 合并请求参数，`isRequestNow` 默认 `false` |
| `setTableColumns(cols)` | 重设表格列 |
| `getTableColumns()` | 获取当前表格列 |
| `setSearchForm(form)` | 设置搜索表单 |
| `getSearchForm()` | 获取搜索表单 |
| `search(params?)` | 合并当前搜索表单和额外参数后立即查询 |
| `setProTableOptions(opts)` | 动态合并组件配置 |
| `getProTableOptions()` | 获取当前组件配置 |
| `resizeHeight()` | 重新计算自适应高度 |
| `getCurrentId()` | 获取当前组件内部生成的 ID |

## 常见注意点

- `requestPage.sizeName` 当前源码默认值是 `page_size`，如果后端使用 `pageSize`，需要显式配置。
- `onSearchSubmit` 和 `onSearchReset` 会把返回值作为最终搜索参数；不要只写副作用后不返回表单。
- 开启跨页多选时，建议同时配置 `tableOptions.rowKey` 和 `tableOptions.on.onSelectionChange`。
- 类型里保留了 `options.id`，但当前组件会生成内部随机 ID；运行时请通过 `getCurrentId()` 获取。
- `cellRenderTo` 适合复用渲染逻辑；一次性的单元格展示可以直接使用 `cellRenderPro` 或 `ma-table` 原有 `cellRender`。
