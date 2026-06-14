# MaTable

A `Table` component based on the secondary encapsulation of `Element Plus`, supporting all native table parameters, events, and slots, while enhancing some functionalities for ease of use.

::: tip Note
Since it fully supports all parameters, events, and slots of the native `el-table`, the documentation only covers extended parameters.

For official parameters, please refer to the [Element Plus](https://element-plus.org/en-US/component/table.html) official documentation.

**Note: Displayed language pack inconsistencies in the demo component are normal and will not occur in the actual project.**
:::

## Basic Usage
<DemoPreview dir="demos/ma-table/default" />

## Full Examples

### Basic Feature Examples
- [Basic Table](./ma-table/basic) - Basic data display and configuration
- [Table Sorting](./ma-table/sorting) - Various sorting function demonstrations
- [Table Filtering](./ma-table/filter) - Filtering and search functionalities

### Advanced Feature Examples  
- [Custom Rendering](./ma-table/custom-render) - Custom rendering for cells and headers
- [Dynamic Column Management](./ma-table/dynamic-columns) - Dynamic addition, deletion, and modification of columns
- [Pagination Table](./ma-table/pagination) - Complete pagination functionality

### Special Scenario Examples
- [Tree Table](./ma-table/tree-table) - Displaying hierarchical data
- [Selection Table](./ma-table/selection) - Selection and batch operations
- [Responsive Table](./ma-table/responsive) - Adaptive height and responsive layout

## Props

| Parameter | Description | Type | Ele Official Documentation | Version |
|-----------|-------------|------|---------------------------|---------|
| `options` | `el-table` parameters and [extended parameters](#extraprops) | `MaTableOptions` | [Table Attributes](https://element-plus.org/en-US/component/table.html#table-attributes) | 1.0.0 |
| `columns` | `el-table-column` parameters and [extended parameters](#columnextraprops) | `MaTableColumns[]` | [Table Column Attributes](https://element-plus.org/en-US/component/table.html#table-column-attributes) | 1.0.0 |

::: tip Type Description
- `MaTableOptions`: Extends all native properties of Element Plus tables and adds configuration options like container height, loading state, alignment, adaptive height, pagination, etc.
- `MaTableColumns[]`: Extends all native properties of Element Plus table columns and adds features like column hiding, custom rendering, multi-level headers, etc.
:::

### ExtraProps
::: tip Note
These are extended parameters of `ma-table` for `el-table`.
:::
| Parameter | Description | Type | Default | Version |
|-----------|-------------|------|---------|---------|
| `containerHeight` | Container height | `string` | - | 1.0.0 |
| `loading` | Enable loading animation | `boolean` | `false` | 1.0.0 |
| `loadingConfig` | Loading animation configuration | [LoadingConfig](#loadingconfig-description) | - | 1.0.0 |
| `columnAlign` | Cell alignment | `left`, `center`, `right` | `center` | 1.0.0 |
| `headerAlign` | <el-tooltip content="Header alignment; if not set, uses the cell's alignment">`Hover to view`</el-tooltip> | `left`, `center`, `right` | - | 1.0.0 |
| `showOverflowTooltip` | <el-tooltip content="Show tooltip when content is truncated">`Hover to view`</el-tooltip> | `boolean` | `false` | 1.0.0 |
| `adaption` | Enable adaptive height | `boolean` | `false` | 1.0.0 |
| `adaptionOffsetBottom` | Bottom offset distance | `number` | `70` | 1.0.0 |
| `showPagination` | Show pagination | `boolean` | `true` | 1.0.0 |
| `pagination` | El pagination native properties/events | [el-pagination documentation](https://element-plus.org/en-US/component/pagination.html#attributes) | - | 1.0.0 |
| `on` | `el-table` table event collection | <el-tooltip content="Object: { onSelect: (args) => {}, .... }">`Hover to view`</el-tooltip> | - | 1.0.0 |

#### LoadingConfig Description
| Parameter | Description | Type | Default | Version |
|-----------|-------------|------|---------|---------|
| `text` | Loading text displayed below the icon | `string` | - | 1.0.0 |
| `spinner` | Custom loading icon | `string` | - | 1.0.0 |
| `svg` | Custom `svg` loading icon | `string` | - | 1.0.0 |
| `viewBox` | Loading icon size | `string` | - | 1.0.0 |
| `background` | Background overlay color | `string` | - | 1.0.0 |
| `customClass` | Custom class name | `string` | - | 1.0.0 |

### ColumnExtraProps
::: tip Note
These are extended parameters of `ma-table` for `el-table-column`.
:::

| Parameter | Description | Type | Default | Version |
|-----------|-------------|------|---------|---------|
| `hide` | Hide column | `boolean` | `false` | 1.0.0 |
| `children` | Multi-level header | `MaTableColumns[]` | - | 1.0.0 |
| `cellRender` | <el-tooltip content="Custom cell renderer supporting components, virtual DOM, strings, JSX, and TSX">`Hover to view`</el-tooltip> | `(data: TableColumnRenderer) => {}` | - | 1.0.0 |
| `headerRender` | <el-tooltip content="Custom header renderer supporting components, virtual DOM, strings, JSX, and TSX">`Hover to view`</el-tooltip> | `(data: TableColumnRenderer) => {}` | - | 1.0.0 |

## Slot

| Name | Description | Parameters | Example |
|------|-------------|------------|---------|
| `empty` | Native slot, displayed when data is empty | - | `#empty` |
| `append` | Native slot, displayed in the last row of the table | - | `#append` |
| `pageLeft` | Left area slot in the pagination row | - | `#pageLeft` |
| `column-[prop]` | Table column slot; `prop` is the field name | `{ row, column, $index }` | `#column-name="{ row }"` |
| `header-[prop]` | Table header slot; `prop` is the field name | `{ column, $index }` | `#header-name="{ column }"` |
| `default` | Default column content slot | `{ row, column, $index }` | `#default="{ row }"` |
| `header` | Default header content slot | `{ column, $index }` | `#header="{ column }"` |
| `filterIcon` | Custom filter icon slot | - | `#filterIcon` |

::: tip Slot Parameter Description
- **scope parameters**: `row` represents the current row data, `column` represents the current column configuration, `$index` represents the current row index.
- **Dynamic slots**: `[prop]` in `column-[prop]` and `header-[prop]` needs to be replaced with the actual field name.
- **Pagination slot**: The `pageLeft` slot can be used to add custom content on the left side of the pagination area, such as batch operation buttons.
:::

## Event
| Name | Description | Parameters | Trigger Condition |
|------|-------------|------------|-------------------|
| `set-data-callback` | Callback after setting table data | `data: any[]` | Triggered after calling the `setData` method |

::: tip Event Description
In addition to the extended events above, ma-table also supports all native events of Element Plus tables, such as `select`, `select-all`, `selection-change`, `cell-click`, `row-click`, etc.
These events can be configured via the `options.on` object.
:::

## Expose
| Name | Description | Parameters | Return Value | Usage Scenario |
|------|-------------|------------|--------------|----------------|
| `setData()` | Set table data | `data: any[]` | - | Dynamically update table data |
| `setPagination()` | Set pagination parameters | `pagination: PaginationProps` | - | Update pagination configuration |
| `setLoadingState()` | Set table `loading` state | `loading: boolean` | - | Control loading state |
| `setOptions()` | Set `ma-table` configuration | `options: MaTableOptions` | - | Dynamically update table configuration |
| `getOptions()` | Get `ma-table` configuration | - | `MaTableOptions` | Get current configuration |
| `setColumns()` | Set table columns | `columns: MaTableColumns[]` | - | Reset all columns |
| `getColumns()` | Get table columns | - | `MaTableColumns[]` | Get current column configuration |
| `appendColumn()` | Append a table column | `column: MaTableColumns` | - | Dynamically add a new column |
| `removeColumn()` | Remove a table column | `prop: string` | - | Dynamically delete a specified column |
| `getColumnByProp()` | Get a table column by `prop` | `prop: string` | `MaTableColumns` | Get a specific column configuration |
| `getElTableRef()` | Get `el-table` Ref | - | `Ref<ElTable>` | Access native table methods |

::: tip Expose Method Description
- **Data Methods**: `setData`, `setPagination`, `setLoadingState` for dynamically updating table state.
- **Configuration Methods**: `setOptions`, `getOptions` for dynamically modifying table configuration.
- **Column Management Methods**: `setColumns`, `getColumns`, `appendColumn`, `removeColumn`, `getColumnByProp` provide comprehensive column management.
- **Native Access**: `getElTableRef` can obtain the native Element Plus table instance and call all native methods.
:::

## Full Type Definitions

### MaTableOptions Interface
```typescript
interface MaTableOptions {
  // Container and Loading
  containerHeight?: string
  loading?: boolean
  loadingConfig?: LoadingConfig
  
  // Alignment
  columnAlign?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  
  // Display Options
  showOverflowTooltip?: boolean
  pagination?: PaginationProps
  
  // Adaptive Height
  adaption?: boolean
  adaptionOffsetBottom?: number
  showPagination?: boolean
  
  // Element Plus Native Properties
  data?: any[]
  height?: string | number
  maxHeight?: string | number
  stripe?: boolean
  border?: boolean
  size?: 'large' | 'default' | 'small'
  fit?: boolean
  showHeader?: boolean
  highlightCurrentRow?: boolean
  currentRowKey?: string | number
  // ... more Element Plus properties
  
  // Event Handling
  on?: {
    [eventName: string]: (...args: any[]) => void
  }
}
```

### MaTableColumns Interface
```typescript
interface MaTableColumns {
  // Extended Properties
  hide?: boolean | ((column: MaTableColumns) => boolean)
  children?: MaTableColumns[]
  cellRender?: (data: TableColumnRenderer) => VNode | string
  headerRender?: (data: TableColumnRenderer) => VNode | string
  
  // Element Plus Native Properties
  label?: string
  prop?: string
  type?: 'selection' | 'index' | 'expand'
  width?: string | number
  minWidth?: string | number
  fixed?: boolean | 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  sortable?: boolean | 'custom'
  // ... more Element Plus column properties
}
```

### TableColumnRenderer Interface
```typescript
interface TableColumnRenderer {
  row: any          // Current row data
  column: TableColumn   // Current column configuration
  $index: number    // Current row index
  options: TableColumn  // Column options
  attrs: any        // Other attributes
}
```