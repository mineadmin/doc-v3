# MaProTable

`ma-pro-table` is encapsulated based on `ma-search` and `ma-table` components, used to quickly build a complete `CRUD` function, increasing time for slacking off.

:::tip Tip
The system's built-in **User and Role Management** are best practices for `ma-pro-table` CRUD. You can quickly master this component by referring to the documentation and practical examples.

Note: This component no longer natively supports `Add` and `Edit` functions like the `2.0 ma-crud`; these need to be implemented by yourself.
:::

## Quick Start

<DemoPreview dir="demos/ma-pro-table" />

## Full Example Collection

Through the following examples, you can quickly understand the various usage scenarios and features of MaProTable:

### Basic Features
- **[Basic Usage](/v3/front/component/ma-pro-table/examples/basic)** - The simplest way to use the table
- **[Advanced Search](/v3/front/component/ma-pro-table/examples/advanced-search)** - Multiple search components and complex search logic
- **[Custom Operations](/v3/front/component/ma-pro-table/examples/custom-operations)** - Flexible operation column configuration and batch operations

### Extended Features
- **[Cell Render Plugins](/v3/front/component/ma-pro-table/examples/cell-render-plugins)** - Rich cell rendering effects
- **[Toolbar Extensions](/v3/front/component/ma-pro-table/examples/toolbar-extensions)** - Custom toolbar functionality
- **[Data Management](/v3/front/component/ma-pro-table/examples/data-management)** - Complete CRUD operation flow

### Advanced Features
- **[Responsive Layout](/v3/front/component/ma-pro-table/examples/responsive-layout)** - Multi-device adaptation and responsive design

## Core Features

### 🚀 Rapid Development
- Built on ma-search and ma-table, ready to use out of the box
- Built-in common CRUD operation patterns
- Supports multiple data sources and API formats

### 🎨 Rich Rendering
- Built-in cell rendering plugin system
- Supports custom rendering components
- Flexible operation column configuration

### 🔧 Powerful Extensibility
- Toolbar plugin system
- Complete TypeScript type support
- Rich events and callbacks

### 📱 Responsive Design
- Automatically adapts to different device sizes
- Mobile-friendly interactive experience
- Flexible layout configuration

## cellRenderTo Cell Rendering Plugin
::: tip Why does the cellRenderTo plugin exist?
First, rendering different content in cells is a very common scenario. Much of the code may be identical, only differing in parameters or field names. We considered how to solve this problem when building `ma-pro-table`.

`ma-pro-table` can natively support rendering for different content, such as `url`, `image`, `video`, and `switch` rendering. However, the problem is that requirements are diverse. Built-in features can never fully meet growing business needs. To avoid code redundancy, this plugin mechanism was created.

You can share your commonly used cell rendering plugins or those encapsulating specific business scenarios to the application marketplace, enriching cell rendering so that everyone no longer needs to write the same things.
:::

### Using Cell Plugins

```vue 
<script setup lang="ts">
import { ref } from 'vue'
import { MaProTableSchema } from "@mineadmin/pro-table";

const schema = ref<MaProTableSchema>({
  tableColumns: [
    {
      title: 'Cell Rendering Example',
      prop: 'title',
      // Call cell rendering plugin // [!code focus:9]
      cellRenderTo: {
        // Plugin name. This plugin renders strings as el-tag. ma-pro-table has this built-in.
        name: 'tag', 
        // Can pass parameters required by the plugin
        props: {
          // This plugin does not require mandatory parameters, so none are passed
        }
      }
    }
  ]
})
</script>

<template>
  <ma-pro-table :schema="schema"/>
</template>

```

### Registering Cell Plugins
To register a plugin, import the `useProTableRenderPlugin()` method, then use it to register or remove plugins.
```ts
import { useProTableRenderPlugin } from '@mineadmin/pro-table'
```
`useProTableRenderPlugin()` returns the following methods:

- `addPlugin(plugin: MaProTableRenderPlugin): void`: Register a plugin
- `removePlugin(pluginName: string): void`: Remove a plugin
- `getPlugins(): MaProTableRenderPlugin[]`: Get all registered plugins of **ma-pro-table**
- `getPluginByName(pluginName: string): MaProTableRenderPlugin`: Get a specific plugin by name


::: details Click to view the `MaProTableRenderPlugin` type description
| Parameter | Description | Type |
|----------|---------------------|-------------------|
| `name` | Cell rendering plugin name, unique identifier | `string`|
| `render` | Render function, supports `component, jsx, tsx`, etc. | `Function` |

`render` function parameter description:
- `data` type: `TableColumnRenderer` Includes the native `scope` parameters of `el-table` and extended parameters of `ma-table`
- `props`, external parameters passed via the `props` parameter when calling the plugin.
- `proxy` type: `MaProTableExpose` See the `Expose` section at the end of this chapter.
:::

The documentation only explains how to register plugins. We need to use the `addPlugin` function.

The built-in `tag` plugin prototype is as follows:
```ts
import { h } from 'vue'
import { useProTableRenderPlugin } from '@mineadmin/pro-table'
import { ElTag } from 'element-plus'

const { addPlugin } = useProTableRenderPlugin()

// Register plugin
addPlugin({
  // Plugin name, unique identifier. If uploading to the app marketplace, add a specific prefix.
  name: 'tag',
  // Plugin render function, supports specifying other Vue components or directly writing tsx and jsx.
  render: (data: TableColumnRenderer, props: any, proxy: MaProTableExpose) => {
    return h(
      ElTag,  // Use el-tag for rendering
      props,  // Pass through props parameters passed when the plugin is called externally
      {
        default: () => data.row[props?.prop] // Use el-tag default slot
      }
    )
  }
})

```

## ToolbarPlugin Toolbar Plugin
![Table Toolbar](https://s21.ax1x.com/2024/11/03/pArlfRU.png)

::: tip Description
`ma-pro-table` also has [slots](#slot) for extending this area. If you need a one-time function, use slots. If the entire system requires it, it is recommended to use the `api` for extension.
:::

`useProTableToolbar()` returns the following methods:
- `get: (name: string) => MaProTableToolbar` Get a specific tool's information
- `getAll: () => MaProTableToolbar[]` Get all tool information
- `add: (toolbar: MaProTableToolbar) => void` Add a new tool
- `remove: (name: string) => void` Remove a tool
- `hide: (name: string) => void` Set a tool to non-rendering state
- `show: (name: string) => void` Set a tool to normal rendering state

::: details Click to view the `MaProTableToolbar` type description
| Parameter | Description | Type |
|----------|---------------------|-------------------|
| `name` | Tool name, unique identifier | `string`|
| `render` | Render function, supports `component, jsx, tsx`, etc. | `Function` |
| `show` | Whether to display by default | `boolean` |
| `order` | Tool rendering order, smaller number renders first | `number` |
  :::

### Extending the Toolbar

::: code-group 
```ts [index.vue]
import { useProTableToolbar } from '@mineadmin/pro-table'
import CustomerTool from './CustomerTool.vue'

const { add } = useProTableToolbar()

add({
  // Tool name
  name: 'heihei',
  // Specifies the render component. It passes a proxy parameter to the component. The component needs to define props to receive it.
  render: CustomerTool,
  show: true,
  order: 99,
})
```

```vue [CustomerTool.vue]

<script setup lang="ts">
  // Define props to receive the proxy parameter passed by `ma-pro-table`
  import { MaProTableExpose } from "@mineadmin/pro-table"
  import { ElMessage } from 'element-plus'

  const { proxy } = defineProps<{ proxy: MaProTableExpose }>()
  
  const execute = async () => {
    // Execute table refresh
    await proxy?.refresh?.()
    ElMessage.success('Table refreshed successfully')
  }
</script>

<template>
  <!-- Add circle attribute to make it a round button, consistent with the system -->
  <el-button circle @click="execute">😀</el-button>
</template>
```
:::

## TypeScript Type Definitions

### Core Types

```typescript
// Main component interface
interface MaProTableProps {
  options: MaProTableOptions    // Component configuration
  schema: MaProTableSchema      // Table schema
}

// Exposed methods and properties of the component
interface MaProTableExpose {
  // Sub-component access
  getSearchRef(): MaSearchExpose
  getTableRef(): MaTableExpose
  getElTableStates(): Record<string, any>
  
  // Data operations
  refresh(): Promise<void>
  requestData(): Promise<void>
  changeApi(api: () => any, isRequestNow: boolean): void
  setRequestParams(params: Record<string, any>, isRequestNow: boolean): void
  
  // Column management
  setTableColumns(cols: MaProTableColumns[]): void
  getTableColumns(): MaProTableColumns[]
  
  // Search management
  setSearchForm(form: Record<string, any>): void
  getSearchForm(): Record<string, any>
  search(form: Record<string, any>): void
  
  // Configuration management
  setProTableOptions(opts: MaProTableOptions): void
  getProTableOptions(): MaProTableOptions
  
  // Utility methods
  resizeHeight(): Promise<void>
  getCurrentId(): string
}
```

### Plugin System Types

```typescript
// Cell rendering plugin
interface MaProTableRenderPlugin {
  name: string
  render: (data: TableColumnRenderer, props: any, proxy: MaProTableExpose) => VNode | string
}

// Toolbar plugin
interface MaProTableToolbar {
  name: string
  render: (props: { proxy: MaProTableExpose }) => VNode | Component
  show: boolean | (() => boolean)
  order: number
}
```

## Props
| Parameter | Description | Type | Version |
|----------|---------------------|-------------------|--------|
| `options` | `ma-pro-table` parameter settings | `MaProTableOptions` | 1.0.0 |
| `schema` | `ma-pro-table` schema configuration | `MaProTableSchema` | 1.0.0 |

### MaProTableOptions
| Parameter | Description | Type | Default | Version |
|------------------------|-------------------------------------------|---------------------------------------------|--------|--------|
| `tableOptions` | `ma-table` parameters | `MaTableOptions` | - | 1.0.0 |
| `searchOptions` | `ma-search` parameters | `MaSearchOptions` | - | 1.0.0 |
| `searchFormOptions` | `ma-form` parameters | `MaFormOptions` | - | 1.0.0 |
| - | - | - | - | - |
| `id` | Current ID, globally unique. If not specified, one is randomly generated. | `string` | - | 1.0.0 |
| `adaptionOffsetBottom` | Offset distance from the bottom | `number` | 0 | 1.0.0 |
| `actionBtnPosition` | Action button placement. In auto mode, if the header is enabled, it displays in the header; otherwise, it displays at the top left of the table. | `auto, header, table` | `auto` | 1.0.0 |
| `header` | Header configuration | See [Parameter Configuration](#headerconfig) | - | 1.0.0 |
| `toolbar` | Whether to display the toolbar | `boolean, (() => boolean)` | `true` | 1.0.0 |
| `toolStates` | Set whether tools are displayed as needed | { `[key:string]` : `boolean, (() => boolean)` | - | 1.0.69 |
| `rowContextMenu` | Right-click configuration | See [Parameter Configuration](#rowcontextmenu) | - | 1.0.0 |
| `requestOptions` | List network request configuration | See [Parameter Configuration](#requestoptions) | - | 1.0.0 |
| `onSearchSubmit` | Search submit event | `(form: Record<string, any>) => void` | - | 1.0.0 |
| `onSearchReset` | Search reset event | `(form: Record<string, any>) => void` | - | 1.0.0 |


#### HeaderConfig
| Parameter | Description | Type | Default | Version |
|------|--------------|----------------------------|---------|-------|
| `show` | Whether to display the header | `boolean, (() => boolean)` | `true` | 1.0.0 |
| `mainTitle` | Main title | `string, (() => string)` | `Main Table Title` | 1.0.0 |
| `subTitle` | Subtitle | `string, (() => string)` | - | 1.0.0 |

#### rowContextMenu
| Parameter | Description | Type | Default | Version |
|-------------------|-----------|------------------------------------------------------------------------------------|---------|-------|
| `enabled` | Whether to enable row right-click menu | `boolean` | `false` | 1.0.0 |
| `items` | Right-click menu list | `ContextMenuItem[]` | - | 1.0.0 |
| - | - | - | - | - |
| `ContextMenuItem` | Description | Menu list configuration description | - | - |
| `label` | Menu display text | `string, (() => string)` | - | 1.0.0 |
| `icon` | Menu display icon | `string, (() => string)` | - | 1.0.0 |
| `disabled` | Whether disabled | `boolean` | - | 1.0.0 |
| `divided` | Whether to display a separator line | `boolean` | - | 1.0.0 |
| `onMenuClick` | Menu item click event | `(data: { row: any, column: any, proxy: MaProTableExpose }, event: Event) => void` | - | 1.0.0 |

#### requestOptions
| Parameter | Description | Type | Default | Version |
|-----------------------|-----------------------|-----------------------------------------------------------|--------------------------------------------------------|-------|
| `api` | Request API method | `(...args: any[]) => any` | - | 1.0.0 |
| `autoRequest` | Whether to auto-request | `boolean` | `true` | 1.0.0 |
| `response` | Response return structure configuration | `{ totalKey?: string, dataKey?: string }` | `{ totalKey: 'total', dataKey: 'list'}` | 1.0.0 |
| `requestPage` | Request pagination configuration | `{ pageName?: string, sizeName?: string, size?: number }` | `{ pageName: 'page', sizeName: 'pageSize', size: 10 }` | 1.0.0 |
| `requestParams` | Default request parameters | `Object` | - | 1.0.0 |
| `responseDataHandler` | Response data handler. Note: `must return the table data back` | `(response: Record<string, any>) => any[]` | - | 1.0.0 |
| `on` | Event list | `Record<string, (...args: any[]) => any>` | - | 1.0.0 |


### MaProTableSchema
| Parameter | Description | Type | Default | Version |
|------|----------|---------------------------------------------------|-----|-------|
|`searchItems`| Search item list configuration | `MaSearchItem[]` [Configuration Item](ma-search#searchitems) | - | 1.0.0 |
|`tableColumns`| Table column list configuration | `MaProTableColumns[]` | - | 1.0.0 |

#### MaProTableColumns
::: tip
Inherits from `el-table-columns` and the [extended columns configuration](ma-table#columnextraprops) of `ma-table`. The following are extended parameters.
:::
| Parameter | Description | Type | Default | Version |
|------|----------------------------|----------------------------------------------------|-----|-------|
|`type`| Based on the native `el-table` type, adds `operation`, `sort`. The first is the operation column, extensible via `API`. The second is for `row drag-and-drop sorting`. | `string` | - | 1.0.0 |
|`cellRenderTo`| Renders the cell using a plugin registered with the table. | [See type below](#cellrenderto-using-render-plugins) | - | 1.0.0 |
|`isRender`| Whether to render the column. Unlike `hide`, this column will not be displayed in table settings. | `boolean & () => boolean` | - | 1.0.55 |
|`cellRenderPro`| Enhanced `cellRender`, adds a second parameter `proxy: MaProTableExpose` | `(data, proxy) => VNode & string` | - | 1.0.55 |
|`headerRenderPro`| Enhanced `headerRender`, adds a second parameter `proxy: MaProTableExpose` | `(data, proxy) => VNode & string` | - | 1.0.55 |
|`operationConfigure`| Operation column configuration. Only takes effect when `type` is `operation`. | [See type below](#operationconfigure-operation-column) | - | 1.0.0 |

##### cellRenderTo Using Render Plugins
::: info 
`ma-pro-table` cell rendering plugins must be registered before they can be used.
:::
| Parameter | Description | Type | Default | Version |
|---------|-----------|--------------|-----|-------|
| `name` | Cell rendering plugin name | `string` | - | 1.0.0 |
| `props` | Additional parameters required by the plugin | `any, any[]` | - | 1.0.0 |

##### operationConfigure Operation Column
::: info 
The `operation column` can only be configured via the `api`. If you find it cumbersome, you can add a regular column in `columns` and implement it yourself using slots.
:::
| Parameter | Description | Type | Default | Version |
|---------|-----------|--------------|-----|-------|
| `type` | Display mode. Auto: `auto`, Dropdown menu: `dropdown`, Tile: `tile` | `string` | `auto` | `auto` requires `1.0.75` |
| `fold` | In auto mode, auto-collapse after tiling a certain number. Default is `1`. | `number` | `1` | 1.0.75 |
| `actions` | Operation column configuration list | `OperationAction[]` | - | 1.0.0 |

###### OperationAction Operation Column List Configuration
| Parameter | Description | Type | Default | Version |
|------------|---------------------------|----------------------------------------------------------------|-----|-------|
| `name` | Operation identifier | `string` | - | 1.0.0 |
| `text` | Text configuration | `string, ((data: TableColumnRenderer) => string)` | - | 1.0.0 |
| `icon` | Icon configuration, rendered internally with `ma-svg-icon` | `string, ((data: TableColumnRenderer) => string)` | - | 1.0.0 |
| `order` | Sorting, smaller numbers render first | `number` | - | 1.0.0 |
| `disabled` | Whether disabled | `((data: TableColumnRenderer) => boolean)` | - | 1.0.0 |
| `show` | Whether to display | `((data: TableColumnRenderer) => boolean)` | - | 1.0.0 |
| `onClick` | Click event | `(data: TableColumnRenderer, proxy: MaProTableExpose) => void` | - | 1.0.0 |
| `linkProps` | `props` parameter of `el-link` | [LinkProps Documentation](https://element-plus.org/zh-CN/component/link.html#attributes) | - | 1.0.0 |

## Event

| Name | Description | Parameter |
|-----------------|---------|------------------------------------------------------------|
| `row-drag-sort` | Row drag sorting event | `(tableData: any[]) => void` |
| `search-submit` | Search submit event | `(form: Record<string, any>) => Record<string, any>, void` |
| `search-reset` | Search reset event | `(form: Record<string, any>) => Record<string, any>, void` |

## Slot System

MaProTable provides a rich slot system, allowing you to flexibly customize the content of various areas.

### Core Slots

| Name | Description | Parameters | Use Case |
|-------------------|-------------------------------------------|---------|----------|
| `default` | Default slot and native `el-table` slots | - | Table content extension |
| `empty` | Content displayed when data is empty | - | Custom empty state |
| `append` | Content of the last row of the table | - | Totals row, etc. |

### Layout Slots

| Name | Description | Parameters | Use Case |
|-------------------|-------------------------------------------|---------|----------|
| `middle` | Area between search bar and table | - | Add statistics information |
| `tableHeader` | Entire table header area | - | Fully customize the header |
| `headerTitle` | Table header title area | - | Custom title |
| `headerRight` | Table header right area | - | Add quick actions |
| `tableTop` | Table container top, above toolbar | - | Batch operation buttons |
| `tableCranny` | Gap between table and toolbar | - | Status prompts |
| `pageLeft` | Pagination left area | - | Statistics information |

### Toolbar Slots

| Name | Description | Parameters | Use Case |
|-------------------|-------------------------------------------|---------|----------|
| `toolbarLeft` | Toolbar left area | - | Statistics data display |
| `toolbar` | Toolbar list (not recommended, use API extension) | - | Custom tools |
| `beforeToolbar` | Content before toolbar | - | Preceding buttons |
| `afterToolbar` | Content after toolbar | - | Following buttons |

### Search Slots

| Name | Description | Parameters | Use Case |
|----------------------|-------------------------------------------|---------|----------|
| `search` | Complete replacement of the search component | - | Fully customize search |
| `searchActions` | Search action button area | - | Custom search buttons |
| `searchBeforeActions`| Content before search buttons | - | Add preceding actions |
| `searchAfterActions` | Content after search buttons | - | Add following actions |

### Dynamic Slots

| Name | Description | Parameters | Use Case |
|-------------------|-------------------------------------------|---------|----------|
| `column-[prop]` | Table column content slot | scope | Custom column rendering |
| `header-[prop]` | Table header slot | scope | Custom header |

### Slot Usage Examples

```vue
<template>
  <MaProTable :options="options" :schema="schema">
    <!-- Toolbar left statistics -->
    <template #toolbarLeft>
      <div class="stats">
        <el-text>Total: {{ total }} items</el-text>
      </div>
    </template>
    
    <!-- Table top batch operations -->
    <template #tableTop>
      <div class="batch-actions">
        <el-button @click="batchDelete">Batch Delete</el-button>
      </div>
    </template>
    
    <!-- Custom column content -->
    <template #column-status="{ row }">
      <el-switch v-model="row.status" />
    </template>
  </MaProTable>
</template>
```

## Expose Methods

The MaProTable component exposes a rich set of methods and properties, allowing you to fully control the table's behavior.

### Sub-component Access

| Method Name | Description | Return Value |
|-----------------------|---------------------------------------|----------------------|
| `getSearchRef()` | Get the search component instance | `MaSearchExpose` |
| `getTableRef()` | Get the table component instance | `MaTableExpose` |
| `getElTableStates()` | Get Element Plus table states | `any` |

### Data Operations

| Method Name | Description | Parameters | Return Value |
|----------------------|---------------------------------------|----------------------------------------------------------------|--------------------|
| `refresh()` | Refresh table data | - | `Promise<void>` |
| `requestData()` | Re-request table data | - | `Promise<void>` |
| `changeApi()` | Dynamically change the data interface | `(api: () => any, isRequestNow: boolean) => void` | `void` |
| `setRequestParams()` | Set request parameters | `(params: Record<string, any>, isRequestNow: boolean) => void` | `void` |

### Column Management

| Method Name | Description | Parameters | Return Value |
|----------------------|---------------------------------------|---------------------------------------------|-------------------------|
| `setTableColumns()` | Dynamically set table columns | `(cols: MaProTableColumns[]) => void` | `void` |
| `getTableColumns()` | Get current table column configuration | - | `MaProTableColumns[]` |

### Search Management

| Method Name | Description | Parameters | Return Value |
|---------------------|---------------------------------------|---------------------------------------------|-------------------------|
| `setSearchForm()` | Set search form data | `(form: Record<string, any>) => void` | `void` |
| `getSearchForm()` | Get search form data | - | `Record<string, any>` |
| `search()` | Execute a search operation | `(form: Record<string, any>) => void` | `void` |

### Configuration Management

| Method Name | Description | Parameters | Return Value |
|------------------------|---------------------------------------|---------------------------------------------|----------------------|
| `setProTableOptions()` | Dynamically set component configuration | `(opts: MaProTableOptions) => void` | `void` |
| `getProTableOptions()` | Get current component configuration | - | `MaProTableOptions` |

### Utility Methods

| Method Name | Description | Parameters | Return Value |
|--------------------|---------------------------------------|------|--------------------|
| `resizeHeight()` | Recalculate table height | - | `Promise<void>` |
| `getCurrentId()` | Get the component's unique identifier | - | `string` |

### Usage Example

```vue
<template>
  <div>
    <el-button @click="handleRefresh">Refresh Data</el-button>
    <el-button @click="handleSearch">Search</el-button>
    <el-button @click="handleChangeApi">Switch API</el-button>
    
    <MaProTable ref="tableRef" :options="options" :schema="schema" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tableRef = ref()

// Refresh data
const handleRefresh = async () => {
  await tableRef.value?.refresh()
  console.log('Data refreshed')
}

// Execute search
const handleSearch = () => {
  tableRef.value?.search({ name: 'Zhang San', status: 1 })
}

// Dynamically switch API
const handleChangeApi = () => {
  tableRef.value?.changeApi(newApiFunction, true)
}

// Get selected rows
const getSelectedRows = () => {
  const tableInstance = tableRef.value?.getTableRef()
  return tableInstance?.getSelectionRows()
}

// Dynamically update column configuration
const updateColumns = () => {
  const newColumns = [
    { label: 'ID', prop: 'id' },
    { label: 'Name', prop: 'name' }
  ]
  tableRef.value?.setTableColumns(newColumns)
}
</script>
```