# MaProTable
`ma-pro-table` is built upon the `ma-search` and `ma-table` components, designed to quickly implement complete `CRUD` functionality and increase slacking time.

:::tip Note
The built-in **User and Role Management** systems within the platform serve as best practice examples for `ma-pro-table` CRUD operations. Refer to both documentation and actual cases to master this component quickly.

Note: Unlike `2.0 ma-crud`, this component no longer directly supports built-in `Add` and `Edit` functionalities - these need to be implemented separately.
:::

## Quick Start

<DemoPreview dir="demos/ma-pro-table" />

## Comprehensive Examples

Explore various usage scenarios and features of MaProTable through these examples:

### Basic Features
- **[Basic Usage](/front/component/ma-pro-table/examples/basic)** - Simplest table implementation
- **[Advanced Search](/front/component/ma-pro-table/examples/advanced-search)** - Multiple search components and complex search logic
- **[Custom Operations](/front/component/ma-pro-table/examples/custom-operations)** - Flexible operation column configuration and batch operations

### Extended Features
- **[Cell Render Plugins](/front/component/ma-pro-table/examples/cell-render-plugins)** - Rich cell rendering effects
- **[Toolbar Extensions](/front/component/ma-pro-table/examples/toolbar-extensions)** - Custom toolbar functionality
- **[Data Management](/front/component/ma-pro-table/examples/data-management)** - Complete CRUD workflow

### Advanced Features
- **[Responsive Layout](/front/component/ma-pro-table/examples/responsive-layout)** - Multi-device adaptation and responsive design

## Core Features

### 🚀 Rapid Development
- Combined ma-search and ma-table components, ready out-of-the-box
- Built-in common CRUD operation patterns
- Supports multiple data sources and API formats

### 🎨 Rich Rendering
- Built-in cell render plugin system
- Supports custom render components
- Flexible operation column configuration

### 🔧 Powerful Extensibility
- Toolbar plugin system
- Comprehensive TypeScript type support
- Rich events and callbacks

### 📱 Responsive Design
- Automatic adaptation to different device sizes
- Mobile-friendly interaction experience
- Flexible layout configuration

## cellRenderTo Cell Render Plugins
::: tip Why cellRenderTo plugins exist?
First, cell rendering is an extremely frequent scenario where much code may be identical except for parameters and field names. When building `ma-pro-table`, we considered how to solve this problem.

While `ma-pro-table` can provide built-in rendering for different content types like `url`, `image`, `video`, or `switch`, requirements constantly evolve. Built-in features can never keep up with business growth, yet we want to avoid code redundancy - hence this plugin mechanism.

You can share commonly used or business-specific cell render plugins in the marketplace to enrich cell rendering options, eliminating repetitive coding.
:::

### Using Cell Plugins

```vue 
<script setup lang="ts">
import { ref } from 'vue'
import { MaProTableSchema } from "@mineadmin/pro-table";

const schema = ref<MaProTableSchema>({
  tableColumns: [
    {
      title: 'Cell Render Example',
      prop: 'title',
      // Invoke cell render plugin // [!code focus:9]
      cellRenderTo: {
        // Plugin name - this renders strings as el-tag (the only built-in plugin)
        name: 'tag', 
        // Optional plugin parameters
        props: {
          // This plugin doesn't require parameters
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
Plugin registration requires importing the `useProTableRenderPlugin()` method, then using it to register/remove plugins.
```ts
import { useProTableRenderPlugin } from '@mineadmin/pro-table'
```
`useProTableRenderPlugin()` returns these methods:

- `addPlugin(plugin: MaProTableRenderPlugin): void`: Register plugin
- `removePlugin(pluginName: string): void`: Remove plugin
- `getPlugins(): MaProTableRenderPlugin[]`: Get all registered plugins
- `getPluginByName(pluginName: string): MaProTableRenderPlugin`: Get plugin by name


::: details Click to view `MaProTableRenderPlugin` type definition
| Parameter | Description | Type |
|----------|-------------|------|
| `name` | Unique plugin identifier | `string`|
| `render` | Render function supporting `components, jsx, tsx` etc. | `Function` |

`render` function parameters:
- `data` type: `TableColumnRenderer` containing native `el-table` `scope` parameters and `ma-table` extensions
- `props`: External parameters passed when invoking the plugin
- `proxy` type: `MaProTableExpose` (see `Expose` section below)
:::

This documentation only covers plugin registration using the `addPlugin` function.

The built-in `tag` plugin prototype:
```ts
import { h } from 'vue'
import { useProTableRenderPlugin } from '@mineadmin/pro-table'
import { ElTag } from 'element-plus'

const { addPlugin } = useProTableRenderPlugin()

// Register plugin
addPlugin({
  // Unique plugin identifier (prefix recommended for marketplace submissions)
  name: 'tag',
  // Render function (can use Vue components or write tsx/jsx directly)
  render: (data: TableColumnRenderer, props: any, proxy: MaProTableExpose) => {
    return h(
      ElTag,  // Render using el-tag
      props,  // Pass through external props
      {
        default: () => data.row[props?.prop] // Use el-tag default slot
      }
    )
  }
})

```

## ToolbarPlugin Toolbar Plugins
![Table Toolbar](https://s21.ax1x.com/2024/11/03/pArlfRU.png)

::: tip Note
`ma-pro-table` also provides [slots](#slot) for toolbar extension. Use slots for one-off features, but prefer the API approach for system-wide requirements.
:::

`useProTableToolbar()` returns these methods:
- `get: (name: string) => MaProTableToolbar` Get tool info
- `getAll: () => MaProTableToolbar[]` Get all tools
- `add: (toolbar: MaProTableToolbar) => void` Add new tool
- `remove: (name: string) => void` Remove tool
- `hide: (name: string) => void` Hide tool
- `show: (name: string) => void` Show tool

::: details Click to view `MaProTableToolbar` type definition
| Parameter | Description | Type |
|----------|-------------|------|
| `name` | Unique tool identifier | `string`|
| `render` | Render function supporting `components, jsx, tsx` etc. | `Function` |
| `show` | Default visibility | `boolean` |
| `order` | Render order (lower numbers appear first) | `number` |
  :::

### Extending Toolbar

::: code-group 
```ts [index.vue]
import { useProTableToolbar } from '@mineadmin/pro-table'
import CustomerTool from './CustomerTool.vue'

const { add } = useProTableToolbar()

add({
  // Tool name
  name: 'heihei',
  // Render component (receives proxy parameter - component needs props definition)
  render: CustomerTool,
  show: true,
  order: 99,
})
```

```vue [CustomerTool.vue]

<script setup lang="ts">
  // Define props to receive ma-pro-table's proxy parameter
  import { MaProTableExpose } from "@mineadmin/pro-table"
  import { ElMessage } from 'element-plus'

  const { proxy } = defineProps<{ proxy: MaProTableExpose }>()
  
  const execute = async () => {
    // Refresh table
    await proxy?.refresh?.()
    ElMessage.success('Table refreshed successfully')
  }
</script>

<template>
  <!-- Add circle prop for rounded button (consistent with system style) -->
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

// Exposed methods and properties
interface MaProTableExpose {
  // Child component access
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
// Cell render plugin
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
|----------|-------------|------|---------|
| `options` | `ma-pro-table` configuration | `MaProTableOptions` | 1.0.0 |
| `schema` | `ma-pro-table` schema | `MaProTableSchema` | 1.0.0 |

### MaProTableOptions
| Parameter | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| `tableOptions` | `ma-table` parameters | `MaTableOptions` | - | 1.0.0 |
| `searchOptions` | `ma-search` parameters | `MaSearchOptions` | - | 1.0.0 |
| `searchFormOptions` | `ma-form` parameters | `MaFormOptions` | - | 1.0.0 |
| - | - | - | - | - |
| `id` | Unique ID (random if not specified) | `string` | - | 1.0.0 |
| `adaptionOffsetBottom` | Bottom offset | `number` | 0 | 1.0.0 |
| `actionBtnPosition` | Action button position (`auto`: header if enabled, otherwise table top-left) | `auto, header, table` | `auto` | 1.0.0 |
| `header` | Header configuration | See [HeaderConfig](#headerconfig) | - | 1.0.0 |
| `toolbar` | Whether to show toolbar | `boolean, (() => boolean)` | `true` | 1.0.0 |
| `toolStates` | Conditional tool visibility | { `[key:string]` : `boolean, (() => boolean)` | - | 1.0.69 |
| `rowContextMenu` | Right-click configuration | See [RowContextMenu](#rowcontextmenu) | - | 1.0.0 |
| `requestOptions` | List request configuration | See [RequestOptions](#requestoptions) | - | 1.0.0 |
| `onSearchSubmit` | Search submit event | `(form: Record<string, any>) => void` | - | 1.0.0 |
| `onSearchReset` | Search reset event | `(form: Record<string, any>) => void` | - | 1.0.0 |


#### HeaderConfig
| Parameter | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| `show` | Whether to show header | `boolean, (() => boolean)` | `true` | 1.0.0 |
| `mainTitle` | Main title | `string, (() => string)` | `Table Title` | 1.0.0 |
| `subTitle` | Subtitle | `string, (() => string)` | - | 1.0.0 |

#### rowContextMenu
| Parameter | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| `enabled` | Whether to enable row right-click menu | `boolean` | `false` | 1.0.0 |
| `items` | Menu items | `ContextMenuItem[]` | - | 1.0.0 |
| - | - | - | - | - |
| `ContextMenuItem` | Description | Menu configuration | - | - |
| `label` | Menu text | `string, (() => string)` | - | 1.0.0 |
| `icon` | Menu icon (rendered with `ma-svg-icon`) | `string, (() => string)` | - | 1.0.0 |
| `disabled` | Whether disabled | `boolean` | - | 1.0.0 |
| `divided` | Whether to show divider | `boolean` | - | 1.0.0 |
| `onMenuClick` | Menu click event | `(data: { row: any, column: any, proxy: MaProTableExpose }, event: Event) => void` | - | 1.0.0 |

#### requestOptions
| Parameter | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| `api` | Request API method | `(...args: any[]) => any` | - | 1.0.0 |
| `autoRequest` | Whether to auto-request | `boolean` | `true` | 1.0.0 |
| `response` | Response structure configuration | `{ totalKey?: string, dataKey?: string }` | `{ totalKey: 'total', dataKey: 'list'}` | 1.0.0 |
| `requestPage` | Pagination configuration | `{ pageName?: string, sizeName?: string, size?: number }` | `{ pageName: 'page', sizeName: 'pageSize', size: 10 }` | 1.0.0 |
| `requestParams` | Default request parameters | `Object` | - | 1.0.0 |
| `responseDataHandler` | Post-response data processing (must return table data) | `(response: Record<string, any>) => any[]` | - | 1.0.0 |
| `on` | Event list | `Record<string, (...args: any[]) => any>` | - | 1.0.0 |


### MaProTableSchema
| Parameter | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
|`searchItems`| Search item configuration | `MaSearchItem[]` [Configuration](ma-search#searchitems) | - | 1.0.0 |
|`tableColumns`| Table column configuration | `MaProTableColumns[]` | - | 1.0.0 |

#### MaProTableColumns
::: tip
Extends `el-table-columns` and `ma-table` [column extensions](ma-table#columnextraprops). Below are additional parameters.
:::
| Parameter | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
|`type`| Adds `operation` (action column) and `sort` (row drag sorting) to native types | `string` | - | 1.0.0 |
|`cellRenderTo`| Render cell using registered plugins | [See below](#cellrenderto-cell-render-plugins) | - | 1.0.0 |
|`isRender`| Whether to render column (unlike `hide`, won't appear in table settings) | `boolean & () => boolean` | - | 1.0.55 |
|`cellRenderPro`| Enhanced `cellRender` with `proxy: MaProTableExpose` parameter | `(data, proxy) => VNode & string` | - | 1.0.55 |
|`headerRenderPro`| Enhanced `headerRender` with `proxy: MaProTableExpose` parameter | `(data, proxy) => VNode & string` | - | 1.0.55 |
|`operationConfigure`| Operation column configuration (only when `type` is `operation`) | [See below](#operationconfigure-operation-column) | - | 1.0.0 |

##### cellRenderTo Cell Render Plugins
::: info 
Plugins must be registered before use.
:::
| Parameter | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| `name` | Plugin name | `string` | - | 1.0.0 |
| `props` | Plugin parameters | `any, any[]` | - | 1.0.0 |

##### operationConfigure Operation Column
::: info 
Operation columns can only be configured via API. For one-off needs, add a regular column and implement via slots.
:::
| Parameter | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| `type` | Display mode: `auto`, `dropdown` (menu), or `tile` (flat) | `string` | `auto` | 1.0.75 |
| `fold` | Auto-fold threshold (number of items before folding) | `number` | `1` | 1.0.75 |
| `actions` | Operation column configuration | `OperationAction[]` | - | 1.0.0 |

###### OperationAction Operation Column Configuration
| Parameter | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| `name` | Operation identifier | `string` | - | 1.0.0 |
| `text` | Text configuration | `string, ((data: TableColumnRenderer) => string)` | - | 1.0.0 |
| `icon` | Icon configuration (rendered with `ma-svg-icon`) | `string, ((data: TableColumnRenderer) => string)` | - | 1