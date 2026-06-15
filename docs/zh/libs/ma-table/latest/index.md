# MaTable

`@mineadmin/table` 是基于 Element Plus `el-table` 封装的基础表格组件库。它保留 Element Plus Table / TableColumn 的原生属性、事件和插槽，同时补充配置式列、分页、加载状态、自适应高度、列显隐、自定义渲染和运行时操作方法。


## 安装

```bash
pnpm add @mineadmin/table element-plus
```

## 全局注册

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

`app.use(MaTable, options)` 支持：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `ssr` | SSR 场景下延迟到客户端挂载后再渲染表格。 | `boolean` | `false` |
| `options` | 注入到组件中的默认表格配置。当前实现会在组件传入同名 `options` 键时参与合并，业务表格仍建议显式维护自己的 `options`。 | `MaTableOptions` | `{}` |

## 基础用法

`ma-table` 接收两个核心配置：`columns` 描述列，`options` 描述表格行为。`data`、`border`、`stripe` 等 Element Plus Table 属性也可以直接写在组件上，它们会透传给内部 `el-table`。

<DemoPreview dir="demos/ma-table/default" />

```vue
<script setup lang="tsx">
import { ref } from 'vue'
import type { MaTableColumns, MaTableOptions } from '@mineadmin/table'

const tableData = [
  { id: 1, name: '张三', dept: '研发部', salary: 18000 },
  { id: 2, name: '李四', dept: '产品部', salary: 22000 },
]

const columns = ref<MaTableColumns[]>([
  { label: '姓名', prop: 'name', align: 'left' },
  { label: '部门', prop: 'dept' },
  {
    label: '薪资',
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

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `columns` | 表格列配置，兼容 Element Plus `el-table-column` 属性，并扩展显隐、多级表头和渲染器能力。 | `MaTableColumns[]` | `[]` |
| `options` | 表格配置，兼容 Element Plus `el-table` 属性，并扩展加载、分页、自适应高度等能力。 | `MaTableOptions` | `{}` |

::: tip 属性透传
除了 `columns` 和 `options`，传给 `ma-table` 的其他属性会继续传给内部 `el-table`。如果同一属性同时出现在 `options` 和组件属性上，组件属性会覆盖 `options`。
:::

## MaTableOptions

`MaTableOptions` 包含 Element Plus Table 的原生属性，例如 `data`、`height`、`stripe`、`border`、`rowKey`、`showSummary`、`summaryMethod`、`lazy`、`treeProps`、`spanMethod` 等。下面只列出 MaTable 扩展项。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `containerHeight` | 类型中保留的容器高度配置；实际高度通常使用 Element Plus 的 `height`、`maxHeight` 或 MaTable 的 `adaption` 控制。 | `string` | - |
| `loading` | 是否显示 Element Plus Loading 遮罩。 | `boolean` | `false` |
| `loadingConfig` | Loading 指令配置。 | `LoadingConfig` | - |
| `columnAlign` | 表格列默认对齐方式。 | `'left' \| 'center' \| 'right'` | `center` |
| `headerAlign` | 表头默认对齐方式；列 `align` 与表格 `columnAlign` 的优先级更高。 | `'left' \| 'center' \| 'right'` | - |
| `showOverflowTooltip` | 内容溢出时是否显示 tooltip。 | `boolean` | `true` |
| `pagination` | Element Plus Pagination 配置与事件。 | `PaginationProps` | - |
| `showPagination` | 是否显示内置分页器。需要同时配置 `pagination`。 | `boolean` | `false` |
| `adaption` | 是否根据窗口高度自动设置表格高度。 | `boolean` | `false` |
| `adaptionOffsetBottom` | 自适应高度时保留的底部偏移量。 | `number` | `70` |
| `on` | Element Plus Table 事件集合，会展开到内部 `el-table`。 | `Record<string, Function>` | - |

### LoadingConfig

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| `text` | 加载文案。 | `string` |
| `spinner` | 自定义加载图标类名。 | `string` |
| `svg` | 自定义 SVG 加载图标。 | `string` |
| `viewBox` | SVG 图标 `viewBox`。 | `string` |
| `background` | 类型中声明的遮罩背景色。当前渲染逻辑未单独读取它，需要定制遮罩时建议配合 `customClass`。 | `string` |
| `customClass` | 自定义 Loading class。 | `string` |

### PaginationProps

分页配置兼容 Element Plus Pagination。组件内部维护当前页，默认从第 `1` 页开始；需要主动跳页时可以调用 `setCurrentPage`，页码变化通常通过 `onChange`、`onCurrentChange` 等回调同步业务请求。

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| `total` | 总条目数。 | `number` |
| `pageSize` | 每页条数。 | `number` |
| `currentPage` | 当前页码。 | `number` |
| `pageSizes` | 每页条数选项。 | `number[]` |
| `layout` | 分页布局，例如 `total, sizes, prev, pager, next, jumper`。 | `string` |
| `background` | 是否为按钮添加背景色。 | `boolean` |
| `onSizeChange` | 每页条数变化回调。 | `(value: number) => void` |
| `onCurrentChange` | 当前页变化回调。 | `(value: number) => void` |
| `onChange` | 页码或每页条数变化回调。 | `(currentPage: number, pageSize: number) => void` |

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

`MaTableColumns` 兼容 Element Plus TableColumn 的原生属性，例如 `label`、`prop`、`type`、`width`、`fixed`、`sortable`、`filters`、`filterMethod`、`formatter`、`align` 等。下面是 MaTable 扩展项。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `hide` | 是否隐藏当前列。可以传布尔值，也可以传函数动态判断；函数运行时接收组件透传的 `attrs`。 | `boolean \| CallableFunction` | `false` |
| `children` | 多级表头配置，内部渲染为嵌套 `el-table-column`。 | `MaTableColumns[]` | - |
| `cellRender` | 自定义单元格渲染器，适合 TSX / JSX。 | `(data: TableColumnRenderer) => VNode \| string` | - |
| `headerRender` | 自定义表头渲染器，适合 TSX / JSX。 | `(data: TableColumnRenderer) => VNode \| string` | - |

```tsx
const columns: MaTableColumns[] = [
  { type: 'selection', prop: 'selection', width: 56 },
  {
    label: '用户信息',
    prop: 'profile',
    children: [
      { label: '姓名', prop: 'name', align: 'left' },
      { label: '手机号', prop: 'phone' },
    ],
  },
  {
    label: '状态',
    prop: 'status',
    headerRender: ({ column }) => <el-tag>{column.label}</el-tag>,
    cellRender: ({ row }) => (
      <el-tag type={row.status === 1 ? 'success' : 'info'}>
        {row.status === 1 ? '启用' : '停用'}
      </el-tag>
    ),
  },
]
```

### 渲染器参数

`cellRender` 和 `headerRender` 接收 `TableColumnRenderer`：

| 参数 | 说明 |
| --- | --- |
| `row` | 当前行数据。表头渲染时可能不存在。 |
| `column` | 当前 Element Plus 列上下文。 |
| `$index` | 当前行或列索引。 |
| `options` | 当前 MaTable 表格配置。 |
| `attrs` | 传给 `ma-table` 的透传属性。 |

## 插槽

| 名称 | 说明 | 参数 |
| --- | --- | --- |
| `empty` | 空数据内容，覆盖默认 `ElEmpty`。 | - |
| `append` | 表格尾部追加内容。 | - |
| `pageLeft` | 分页区域左侧内容，常用于批量操作按钮。 | - |
| `column-[prop]` | 指定列的单元格插槽。 | `{ row, column, $index }` |
| `header-[prop]` | 指定列的表头插槽。 | `{ column, $index }` |
| `default` | 默认单元格插槽，作为所有列的兜底渲染。 | `{ row, column, $index }` |
| `header` | 默认表头插槽，作为所有列的兜底渲染。 | `{ column, $index }` |
| `filterIcon` | 自定义筛选图标插槽。 | Element Plus 原生参数 |

```vue
<ma-table :columns="columns" :data="tableData" :options="options">
  <template #pageLeft>
    <el-button type="primary">批量导出</el-button>
  </template>

  <template #column-name="{ row }">
    <el-link type="primary">{{ row.name }}</el-link>
  </template>
</ma-table>
```

## 事件

MaTable 自身新增了一个事件：

| 名称 | 说明 | 参数 |
| --- | --- | --- |
| `set-data-callback` | 调用 `setData` 后触发。 | `data: any[]` |

Element Plus Table 事件通过 `options.on` 传入。事件名需要使用 Vue 组件属性格式，例如 `onSelectionChange`、`onRowClick`、`onSortChange`。

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

通过模板 `ref` 可以访问 MaTable 暴露的方法。

| 方法 | 说明 | 参数 | 返回值 |
| --- | --- | --- | --- |
| `setData(data)` | 设置表格数据，并触发 `set-data-callback`。 | `any[]` | `void` |
| `setPagination(pagination)` | 合并更新分页配置。 | `PaginationProps` | `void` |
| `setCurrentPage(pager)` | 设置当前页码。 | `number` | `void` |
| `getCurrentPage()` | 获取当前页码。 | - | `number` |
| `setLoadingState(loading)` | 设置加载状态。 | `boolean` | `void` |
| `setOptions(options)` | 合并更新表格配置。 | `MaTableOptions` | `void` |
| `getOptions()` | 获取当前表格配置。 | - | `MaTableOptions` |
| `setColumns(columns)` | 重设所有列。 | `MaTableColumns[]` | `void` |
| `getColumns()` | 获取当前列配置。 | - | `MaTableColumns[]` |
| `appendColumn(column)` | 追加一列。 | `MaTableColumns` | `void` |
| `removeColumn(prop)` | 根据 `prop` 删除列。 | `string` | `void` |
| `getColumnByProp(prop)` | 根据 `prop` 获取列配置；运行时未找到会返回 `null`。 | `string` | `MaTableColumns \| null` |
| `getElTableRef()` | 获取内部 Element Plus Table 实例。 | - | `Ref<typeof ElTable>` |

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

`useTable(refName)` 需要在 `setup` 阶段调用。它会在组件挂载后按模板 ref 名称查找 MaTable 实例，并返回 `MaTableExpose`。如果找不到对应 ref，会抛出 `[@mineadmin/table]: not found ref for ma-table component`。

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

## 常见场景

### 分页表格

设置 `showPagination: true` 并传入 `pagination` 后，MaTable 会在表格下方渲染 Element Plus Pagination。分页区域左侧可以通过 `pageLeft` 插槽放批量操作。

<DemoPreview dir="demos/ma-table/pagination" />

### 排序

排序能力继承自 Element Plus TableColumn。列上配置 `sortable`、`sortMethod`、`sortBy`、`sortOrders`；远程排序使用 `sortable: 'custom'` 并在 `options.on` 中监听 `onSortChange`。

<DemoPreview dir="demos/ma-table/sorting" />

### 筛选

筛选能力继承自 Element Plus TableColumn。列上配置 `filters`、`filterMethod`、`filterMultiple`、`filteredValue`，筛选变化可以通过 `onFilterChange` 处理。

<DemoPreview dir="demos/ma-table/filter" />

### 自定义渲染

简单内容可以使用 `column-[prop]` 插槽；需要更强类型或 TSX 表达能力时，使用 `cellRender` 和 `headerRender`。

<DemoPreview dir="demos/ma-table/custom-render" />

### 动态列

运行时可以通过 `setColumns`、`appendColumn`、`removeColumn` 维护列配置，也可以在列配置里用 `hide` 控制显隐。

<DemoPreview dir="demos/ma-table/dynamic-columns" />

### 树形表格

配置 `rowKey`、`treeProps`、`defaultExpandAll` 即可展示层级数据；懒加载时继续使用 Element Plus 的 `lazy` 和 `load`。

<DemoPreview dir="demos/ma-table/tree-table" />

### 多选表格

列上配置 `type: 'selection'` 开启多选。需要跨页或数据刷新后保留选择时，配合 `rowKey` 和 `reserveSelection` 使用。

<DemoPreview dir="demos/ma-table/selection" />

### 响应式和自适应高度

开启 `adaption` 后，组件会根据窗口高度设置表格 `height`，并用 `adaptionOffsetBottom` 保留底部空间。加载状态可以通过 `loading` 或 `setLoadingState` 控制。

<DemoPreview dir="demos/ma-table/responsive" />

## 使用建议

MaTable 的核心是把 Element Plus Table / TableColumn 配置集中到 `options` 和 `columns`：

- 静态表格优先使用 `columns`、`options` 和组件属性完成声明式配置。
- 需要根据接口结果调整列或分页时，通过模板 `ref` 调用 `setData`、`setPagination`、`setColumns`。
- 需要访问原生 Element Plus Table 方法时，通过 `getElTableRef()` 获取内部表格实例。
- 复杂单元格优先使用 `cellRender` 或 `column-[prop]` 插槽，表头则使用 `headerRender` 或 `header-[prop]` 插槽。

## 类型导出

`@mineadmin/table` 导出下列类型，业务项目可以直接复用：

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

## 相关链接

- [Element Plus Table](https://element-plus.org/zh-CN/component/table.html)
- [Element Plus Pagination](https://element-plus.org/zh-CN/component/pagination.html)
- [@mineadmin/table 源码仓库](https://github.com/mineadmin/mineadmin-table)
