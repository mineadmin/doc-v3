# MaTable

A secondary encapsulation of the `Table` component based on `Element Plus`, supporting all native table parameters, events, and slots while enhancing some functionalities. Extremely user-friendly.

::: tip Note
Since it fully supports all parameters, events, and slots of the native `el-table`, this documentation only covers the extended parameters.

For official parameters, please refer to the [Element Plus](https://element-plus.org/zh-CN/component/table.html) documentation.

**Note: The demo component may display incorrect language packs, but this issue does not occur in actual projects.**
:::

## Usage
<DemoPreview dir="demos/ma-table" />

## Props

| Parameter | Description | Type | Ele-Official Docs | Version |
|-----------|-------------|------|-------------------|---------|
| `options` | `el-table` parameters and [extended parameters](#extraprops) | `MaTableOptions` | [Table Attributes](https://element-plus.org/zh-CN/component/table.html#table-%E5%B1%9E%E6%80%A7) | 1.0.0 |
| `columns` | `el-table-column` parameters and [extended parameters](#columnextraprops) | `MaTableColumns[]` | [Table Column Attributes](https://element-plus.org/zh-CN/component/table.html#table-column-%E5%B1%9E%E6%80%A7) | 1.0.0 |
| `data`    | Table data | `any[]` | - | 1.0.0 |

### ExtraProps
::: tip Note
These are the extended parameters added by `ma-table` to `el-table`.
:::
| Parameter | Description | Type | Default | Version |
|-----------|-------------|------|---------|---------|
| `containerHeight` | Container height | `string` | - | 1.0.0 |
| `loading` | Whether to enable loading animation | `boolean` | `false` | 1.0.0 |
| `loadingConfig` | Configuration for loading animation | [LoadingConfig](#loadingconfig-explanation) | - | 1.0.0 |
| `columnAlign` | Cell alignment | `left`, `center`, `right` | `center` | 1.0.0 |
| `headerAlign` | <el-tooltip content="Header alignment. If not set, cell alignment is used.">`Hover to view`</el-tooltip> | `left`, `center`, `right` | - | 1.0.0 |
| `showOverflowTooltip` | <el-tooltip content="Show tooltip when content is truncated">`Hover to view`</el-tooltip> | `boolean` | `false` | 1.0.0 |
| `adaption` | Whether to adapt height | `boolean` | `false` | 1.0.0 |
| `adaptionOffsetBottom` | Bottom offset | `number` | `70` | 1.0.0 |
| `showPagination` | Whether to show pagination | `boolean` | `true` | 1.0.0 |
| `pagination` | Native properties and events for El-Pagination | [el-pagination Docs](https://element-plus.org/zh-CN/component/pagination.html#%E5%B1%9E%E6%80%A7) | - | 1.0.0 |
| `on`      | `el-table` event collection | <el-tooltip content="Object: { onSelect: (args) => {}, .... }">`Hover to view`</el-tooltip> | - | 1.0.0 |

#### LoadingConfig Explanation
| Parameter | Description | Type | Default | Version |
|-----------|-------------|------|---------|---------|
| `text` | Loading text displayed below the icon | `string` | - | 1.0.0 |
| `spinner` | Custom loading icon | `string` | - | 1.0.0 |
| `svg` | Custom SVG loading icon | `string` | - | 1.0.0 |
| `viewBox` | Size of the loading icon | `string` | - | 1.0.0 |
| `background` | Background mask color | `string` | - | 1.0.0 |
| `customClass` | Custom class name | `string` | - | 1.0.0 |

### ColumnExtraProps
::: tip Note
These are the extended parameters added by `ma-table` to `el-table-column`.
:::

| Parameter | Description | Type | Default | Version |
|-----------|-------------|------|---------|---------|
| `hide` | Whether to hide the column | `boolean` | `false` | 1.0.0 |
| `children` | Multi-level headers | `MaTableColumns[]` | - | 1.0.0 |
| `cellRender` | <el-tooltip content="Custom cell renderer, supports components, virtual DOM, strings, JSX, and TSX">`Hover to view`</el-tooltip> | `(data: TableColumnRenderer) => {}` | - | 1.0.0 |
| `headerRender` | <el-tooltip content="Custom header renderer, supports components, virtual DOM, strings, JSX, and TSX">`Hover to view`</el-tooltip> | `(data: TableColumnRenderer) => {}` | - | 1.0.0 |

## Slot

| Name | Description | Parameters |
|------|-------------|------------|
| `empty` | Native slot, displayed when data is empty | - |
| `append` | Native slot, appended to the last row of the table | - |
| `pageLeft` | Slot for the left area of the pagination row | - |
| `column-[prop]` | Table column slot, `prop` is the field name | scope |
| `header-[prop]` | Table header slot, `prop` is the field name | scope |

## Events
| Name | Description | Parameters |
|------|-------------|------------|
| `set-data-callback` | Callback after setting table data | `data: any[]` |

## Expose
| Name | Description | Parameters | Return Value |
|------|-------------|------------|--------------|
| `setData()` | Set table data | `(any[])` | - |
| `setPagination()` | Set pagination parameters | El native parameters | - |
| `setLoadingState()` | Set table `loading` state | `(boolean)` | - |
| `setOptions()` | Set `ma-table` configuration | `(MaTableOptions)` | - |
| `getOptions()` | Get `ma-table` configuration | - | `MaTableOptions` |
| `setColumns()` | Set table columns | `(MaTableColumns[])` | - |
| `getColumns()` | Get table columns | - | `MaTableColumns[]` |
| `appendColumn()` | Append a table column | `(MaTableColumns)` | - |
| `removeColumn()` | Remove a table column | `(prop: string)` | - |
| `getColumnByProp()` | Get a table column by `prop` | `(prop: string)` | `MaTableColumns` |
| `getElTableRef()` | Get `el-table` Ref | - | `El-Table` |