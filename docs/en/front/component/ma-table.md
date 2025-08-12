# MaTable

A secondary encapsulated `Table` component based on `Element Plus`, supporting all native table parameters, events, and slots while enhancing some features. Extremely user-friendly.

::: tip Note
Since full compatibility with all native `el-table` parameters, events, and slots is maintained, this documentation only covers the extended parameters.

For official parameters, please refer to the [Element Plus](https://element-plus.org/en-US/component/table.html) documentation.

**Note: The demo component's language pack display may appear incorrect, but this issue will not occur in actual projects.**
:::

## Basic Usage
<DemoPreview dir="demos/ma-table/default" />

## Complete Examples

### Basic Functionality Examples
- [Basic Table](./ma-table/basic) - Basic data display and configuration
- [Table Sorting](./ma-table/sorting) - Various sorting functionalities
- [Table Filtering](./ma-table/filter) - Filtering and search capabilities

### Advanced Functionality Examples  
- [Custom Rendering](./ma-table/custom-render) - Custom cell and header rendering
- [Dynamic Column Management](./ma-table/dynamic-columns) - Dynamic column addition, deletion, and modification
- [Pagination Table](./ma-table/pagination) - Full pagination functionality

### Special Scenario Examples
- [Tree Table](./ma-table/tree-table) - Display hierarchical data
- [Multiple Selection Table](./ma-table/selection) - Selection and batch operations
- [Responsive Table](./ma-table/responsive) - Adaptive height and responsive layout

## Props

| Parameter        | Description                                                  | Type         | Ele-Official Documentation                                                                                     | Version    |
|-----------|-----------------------------------------------------|-------------------|----------------------------------------------------------------------------------------------|-------|
| `options` | `el-table` parameters and [extended parameters](#extraprops)              | `MaTableOptions`   | [Table Attributes](https://element-plus.org/en-US/component/table.html#table-attributes)         | 1.0.0 |
| `columns` | `el-table-column` parameters and [extended parameters](#columnextraprops) | `MaTableColumns[]` | [Table Column Attributes](https://element-plus.org/en-US/component/table.html#table-column-attributes) | 1.0.0 |

::: tip Type Description
- `MaTableOptions`: Extends all native Element Plus table attributes and adds container height, loading state, alignment, adaptive height, pagination, and other configuration options.
- `MaTableColumns[]`: Extends all native Element Plus table column attributes and adds hidden columns, custom rendering, multi-level headers, and other features.
:::

### ExtraProps
::: tip Note
These are `ma-table`'s extended parameters for `el-table`.
:::
| Parameter        | Description                                                                    | Type                                                                                              | Default      | Version    |
|-----------|-----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|----------|-------|
| `containerHeight` | Container height                                                                  | `string`                                                                                        | -        | 1.0.0 |
| `loading` | Whether to enable loading animation                                                              | `boolean`                                                                                       | `false`  | 1.0.0 |
| `loadingConfig` | Loading animation configuration                                                             | [LoadingConfig](#loadingconfig-description)                                                               | -        | 1.0.0 |
| `columnAlign` | Cell alignment                                                               | `left、center、right`                                                                             | `center` | 1.0.0 |
| `headerAlign` | <el-tooltip content="Header alignment. If not set, cell alignment will be used.">`Hover to view`</el-tooltip> | `left、center、right`                                                                             | -        | 1.0.0 |
| `showOverflowTooltip` | <el-tooltip content="Show tooltip when content is too long and hidden">`Hover to view`</el-tooltip>       | `boolean`                                                                                       | `false`  | 1.0.0 |
| `adaption` | Whether to adapt height                                                                | `boolean`                                                                                       | `false`  | 1.0.0 |
| `adaptionOffsetBottom` | Bottom offset distance                                                               | `number`                                                                                        | `70`     | 1.0.0 |
| `showPagination` | Whether to show pagination                                                               | `boolean`                                                                                        | `true`     | 1.0.0 |
| `pagination` | El-pagination native attributes and events                                                           | [el-pageination docs](https://element-plus.org/en-US/component/pagination.html#attributes) | -        | 1.0.0 |
| `on`      | `el-table` event collection                                                     | <el-tooltip content="Object: { onSelect: (args) => {}, .... }">`Hover to view`</el-tooltip>            | -        | 1.0.0 |


#### LoadingConfig Description
| Parameter        | Description      | Type   | Default | Version    |
|-----------|----------|------|-----|-------|
| `text` | Loading text displayed below the icon   | `string`  | -   | 1.0.0 |
| `spinner` | Custom loading icon   | `string` | -   | 1.0.0 |
| `svg` | Custom `svg` loading icon   | `string` | -   | 1.0.0 |
| `viewBox` | Loading icon size   | `string` | -   | 1.0.0 |
| `background` | Background mask color   | `string` | -   | 1.0.0 |
| `customClass` | Custom class name   | `string` | -   | 1.0.0 |

### ColumnExtraProps
::: tip Note
These are `ma-table`'s extended parameters for `el-table-column`.
:::

| Parameter        | Description                                                                                | Type                                  | Default     | Version    |
|-----------|-----------------------------------------------------------------------------------|-------------------------------------|---------|-------|
| `hide` | Whether to hide the column                                                                             | `boolean`                           | `false` | 1.0.0 |
| `children` | Multi-level headers                                                                              | `MaTableColumns[]`                  | -       | 1.0.0 |
| `cellRender` | <el-tooltip content="Custom cell renderer, supporting components, virtual DOM, strings, jsx, and tsx">`Hover to view`</el-tooltip> | `(data: TableColumnRenderer) => {}` | -       | 1.0.0 |
| `headerRender` | <el-tooltip content="Custom header renderer, supporting components, virtual DOM, strings, jsx, and tsx">`Hover to view`</el-tooltip>  | `(data: TableColumnRenderer) => {}` | -       | 1.0.0 |

## Slot

| Name              | Description                                     | Parameters | Example |
|-----------------|----------------------------------------|----|-----|
| `empty`         | Native slot, displayed when data is empty                            | -  | `#empty` |
| `append`        | Native slot, displayed at the last row of the table                            | -  | `#append` |
| `pageLeft`      | Slot for the left area of the pagination row                             | -  | `#pageLeft` |
| `column-[prop]` | Table column slot, `prop` is the field name                      | `{ row, column, $index }` | `#column-name="{ row }"` |
| `header-[prop]` | Table header slot, `prop` is the field name                      | `{ column, $index }` | `#header-name="{ column }"` |
| `default`       | Default column content slot                              | `{ row, column, $index }` | `#default="{ row }"` |
| `header`        | Default header content slot                              | `{ column, $index }` | `#header="{ column }"` |
| `filterIcon`    | Custom filter icon slot                              | - | `#filterIcon` |

::: tip Slot Parameter Description
- **Scope Parameters**: `row` represents current row data, `column` represents current column configuration, `$index` represents current row index.
- **Dynamic Slots**: `column-[prop]` and `header-[prop]` require replacing `[prop]` with the actual field name.
- **Pagination Slot**: The `pageLeft` slot can add custom content to the left of the pagination area, such as batch operation buttons.
:::

## Event
| Name              | Description         | Parameters          | Trigger Timing |
|-----------------|------------|-------------|---------|
| `set-data-callback`  | Callback after setting table data | `data: any[]` | Triggered after calling the `setData` method |

::: tip Event Description
In addition to the extended events above, ma-table supports all native Element Plus table events, such as `select`, `select-all`, `selection-change`, `cell-click`, `row-click`, etc.
These events can be configured via the `options.on` object.
:::

## Expose
| Name                  | Description                | Parameters                   | Return Value                | Use Case |
|---------------------|-------------------|----------------------|--------------------|---------| 
| `setData()`         | Set table data            | `data: any[]`        | -                  | Dynamically update table data |
| `setPagination()`   | Set pagination parameters            | `pagination: PaginationProps` | -     | Update pagination configuration |
| `setLoadingState()` | Set table `loading` state | `loading: boolean`   | -                  | Control loading state |
| `setOptions()`      | Set `ma-table` configuration  | `options: MaTableOptions`   | -       | Dynamically update table configuration |
| `getOptions()`      | Get `ma-table` configuration  | -                    | `MaTableOptions`   | Get current configuration |
| `setColumns()`      | Set table columns             | `columns: MaTableColumns[]` | -       | Reset all columns |
| `getColumns()`      | Get table columns             | -                    | `MaTableColumns[]` | Get current column configuration |
| `appendColumn()`    | Append table column             | `column: MaTableColumns`   | -        | Dynamically add new column |
| `removeColumn()`    | Remove table column             | `prop: string`       | -                  | Dynamically delete specified column |
| `getColumnByProp()` | Get column by `prop`      | `prop: string`       | `MaTableColumns`   | Get specified column configuration |
| `getElTableRef()`   | Get `el-table` Ref | -                    | `Ref<ElTable>`     | Access native table methods |

::: tip Expose Method Description
- **Data Methods**: `setData`, `setPagination`, `setLoadingState` for dynamically updating table state.
- **Configuration Methods**: `setOptions`, `getOptions` for dynamically modifying table configuration.
- **Column Management Methods**: `setColumns`, `getColumns`, `appendColumn`, `removeColumn`, `getColumnByProp` provide complete column management functionality.
- **Native Access**: `getElTableRef` can access the native Element Plus table instance to call all native methods.
:::

## Complete Type Definitions

### MaTableOptions Interface
```typescript
interface MaTableOptions {
  // Container and loading
  containerHeight?: string
  loading?: boolean
  loadingConfig?: LoadingConfig
  
  // Alignment
  columnAlign?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  
  // Display options
  showOverflowTooltip?: boolean
  pagination?: PaginationProps
  
  // Adaptive height
  adaption?: boolean
  adaptionOffsetBottom?: number
  showPagination?: boolean
  
  // Element Plus native attributes
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
  // ... More Element Plus attributes
  
  // Event handling
  on?: {
    [eventName: string]: (...args: any[]) => void
  }
}
```

### MaTableColumns Interface
```typescript
interface MaTableColumns {
  // Extended attributes
  hide?: boolean | ((column: MaTableColumns) => boolean)
  children?: MaTableColumns[]
  cellRender?: (data: TableColumnRenderer) => VNode | string
  headerRender?: (data: TableColumnRenderer) => VNode | string
  
  // Element Plus native attributes
  label?: string
  prop?: string
  type?: 'selection' | 'index' | 'expand'
  width?: string | number
  minWidth?: string | number
  fixed?: boolean | 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  sortable?: boolean | 'custom'
  // ... More Element Plus column attributes
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