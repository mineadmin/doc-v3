# MaProTable
`ma-pro-table` is built upon the `ma-search` and `ma-table` components, designed for quickly implementing complete `CRUD` functionality to increase slacking time.

:::tip Note
The built-in **User and Role Management** systems in the platform serve as best practice examples of `ma-pro-table` CRUD implementation. Refer to both documentation and actual cases to quickly master this component.

Note: Unlike `2.0 ma-crud`, this component no longer directly supports built-in `Add` and `Edit` functionality - these need to be implemented separately.
:::

## Quick Start

<DemoPreview dir="demos/ma-pro-table" />

## Comprehensive Examples

Through the following examples, you can quickly understand various usage scenarios and features of MaProTable:

### Basic Features
- **[Basic Usage](/en/front/component/ma-pro-table/examples/basic)** - Simplest table implementation
- **[Advanced Search](/en/front/component/ma-pro-table/examples/advanced-search)** - Multiple search components and complex search logic
- **[Custom Operations](/en/front/component/ma-pro-table/examples/custom-operations)** - Flexible operation column configuration and batch operations

### Extended Features
- **[Cell Render Plugins](/en/front/component/ma-pro-table/examples/cell-render-plugins)** - Rich cell rendering effects
- **[Toolbar Extensions](/en/front/component/ma-pro-table/examples/toolbar-extensions)** - Custom toolbar functionality
- **[Data Management](/en/front/component/ma-pro-table/examples/data-management)** - Complete CRUD workflow

### Advanced Features
- **[Responsive Layout](/en/front/component/ma-pro-table/examples/responsive-layout)** - Multi-device adaptation and responsive design

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
- Complete TypeScript type support
- Comprehensive events and callbacks

### 📱 Responsive Design
- Automatic adaptation to different device sizes
- Mobile-friendly interaction experience
- Flexible layout configuration

## cellRenderTo Cell Render Plugins
::: tip Why does cellRenderTo plugin exist?
First, cell rendering for different content is an extremely frequent scenario where much code may be identical except for parameters and field names. When building `ma-pro-table`, we considered how to solve this problem.

While `ma-pro-table` can provide built-in rendering for different content types like `url`, `image`, `video`, or `switch`, requirements are ever-changing. Built-in features can never keep up with business growth. To avoid code redundancy while addressing this, we created this plugin mechanism.

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
      // Calling cell render plugin // [!code focus:9]
      cellRenderTo: {
        // Plugin name - this plugin renders strings as el-tag (the only built-in one)
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
- `getPlugins(): MaProTableRenderPlugin[]`: Get all registered plugins in **ma-pro-table**
- `getPluginByName(pluginName: string): MaProTableRenderPlugin`: Get plugin info by name


::: details Click to view `MaProTableRenderPlugin` type definition
| Parameter | Description | Type |
|----------|-------------|------|
| `name` | Unique cell render plugin identifier | `string`|
| `render` | Render function supporting `components, jsx, tsx` etc. | `Function` |

`render` function parameters:
- `data` type: `TableColumnRenderer` containing native `el-table` `scope` parameters plus `ma-table` extended parameters
- `props`: External parameters passed when calling the plugin via `props`
- `proxy` type: `MaProTableExpose` (see `Expose` section at bottom)
:::

Documentation only covers plugin registration using the `addPlugin` function.

Built-in `tag` plugin prototype:
```ts
import { h } from 'vue'
import { useProTableRenderPlugin } from '@mineadmin/pro-table'
import { ElTag } from 'element-plus'

const { addPlugin } = useProTableRenderPlugin()

// Register plugin
addPlugin({
  // Unique plugin identifier (prefix required for marketplace submissions)
  name: 'tag',
  // Plugin render function (can use Vue components or tsx/jsx)
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
`ma-pro-table` also has [slots](#slot) for toolbar extension. Use slots for one-off features, but prefer API extension for system-wide needs.
:::

`useProTableToolbar()` returns these methods:
- `get: (name: string) => MaProTableToolbar` Get tool info
- `getAll: () => MaProTableToolbar[]` Get all tools info
- `add: (toolbar: MaProTableToolbar) => void` Add new tool
- `remove: (name: string) => void` Remove tool
- `hide: (name: string) => void` Set tool to hidden state
- `show: (name: string) => void` Set tool to visible state

::: details Click to view `MaProTableToolbar` type definition
| Parameter | Description | Type |
|----------|-------------|------|
| `name` | Unique tool identifier | `string`|
| `render` | Render function supporting `components, jsx, tsx` | `Function` |
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
  // Specify render component (receives proxy parameter)
  render: CustomerTool,
  show: true,
  order: 99,
})
```

```vue [CustomerTool.vue]

<script setup lang="ts">
  // Define props to receive proxy from `ma-pro-table`
  import { MaProTableExpose } from "@mineadmin/pro-table"
  import { ElMessage } from 'element-plus'

  const { proxy } = defineProps<{ proxy: MaProTableExpose }>()
  
  const execute = async () => {
    // Refresh table
    await proxy?.refresh?.()
    ElMessage.success('Table refreshed')
  }
</script>

<template>
  <!-- Add circle prop to match system style -->
  <el-button circle @click="execute">😀</el-button>
</template>
```
:::

## TypeScript Type Definitions

### Core Types

```typescript
// Component main interface
interface MaProTableProps {
  options: MaProTableOptions    // Component config
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
| `schema` | `ma-pro-table` schema configuration | `MaProTableSchema` | 1.0.0 |

### MaProTableOptions
| Parameter | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| `tableOptions` | `ma-table` parameters | `MaTableOptions` | - | 1.0.0 |
| `searchOptions` | `ma-search` parameters | `MaSearchOptions` | - | 1.0.0 |
| `searchFormOptions` | `ma-form` parameters | `MaFormOptions` | - | 1.0.0 |
| - | - | - | - | - |
| `id` | Unique ID (random if not specified) | `string` | - | 1.0.0 |
| `adaptionOffsetBottom` | Bottom offset | `number` | 0 | 1.0.0 |
| `actionBtnPosition` | Action button position (auto: header if enabled, otherwise top-left) | `auto, header, table` | `auto` | 1.0.0 |
| `header` | Header config | See [Config](#headerconfig) | - | 1.0.0 |
| `toolbar` | Whether to show toolbar | `boolean, (() => boolean)` | `true` | 1.0.0 |
| `toolStates` | Conditional tool visibility | { `[key:string]` : `boolean, (() => boolean)` | - | 1.0.69 |
| `rowContextMenu` | Right-click config | See [Config](#rowcontextmenu) | - | 1.0.0 |
| `requestOptions` | List request config | See [Config](#requestoptions) | - | 1.0.0 |
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
| `enabled` | Enable row right-click menu | `boolean` | `false` | 1.0.0 |
| `items` | Menu items | `ContextMenuItem[]` | - | 1.0.0 |
| - | - | - | - | - |
| `ContextMenuItem` | Description | Menu item config | - | - |
| `label` | Menu text | `string, (() => string)` | - | 1.0.0 |
| `icon` | Menu icon | `string, (() => string)` | - | 1.0.0 |
| `disabled` | Whether disabled | `boolean` | - | 1.0.0 |
| `divided` | Whether to show divider | `boolean` | - | 1.0.0 |
| `onMenuClick` | Menu click event | `(data: { row: any, column: any, proxy: MaProTableExpose }, event: Event) => void` | - | 1.0.0 |

#### requestOptions
| Parameter | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| `api` | Request API method | `(...args: any[]) => any` | - | 1.0.0 |
| `autoRequest` | Whether to auto-request | `boolean` | `true` | 1.0.0 |
| `response` | Response structure config | `{ totalKey?: string, dataKey?: string }` | `{ totalKey: 'total', dataKey: 'list'}` | 1.0.0 |
| `requestPage` | Pagination config | `{ pageName?: string, sizeName?: string, size?: number }` | `{ pageName: 'page', sizeName: 'pageSize', size: 10 }` | 1.0.0 |
| `requestParams` | Default request params | `Object` | - | 1.0.0 |
| `responseDataHandler` | Post-response data handler (must return table data) | `(response: Record<string, any>) => any[]` | - | 1.0.0 |
| `on` | Event list | `Record<string, (...args: any[]) => any>` | - | 1.0.0 |


### MaProTableSchema
| Parameter | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
|`searchItems`| Search items config | `MaSearchItem[]` [Config](ma-search#searchitems) | - | 1.0.0 |
|`tableColumns`| Table columns config | `MaProTableColumns[]` | - | 1.0.0 |

#### MaProTableColumns
::: tip
Extends `el-table-columns` and `ma-table` [extended columns config](ma-table#columnextraprops). Below are extended parameters.
:::
| Parameter | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
|`type`| Adds `operation`, `sort` to native types (first for operation column via API, second for drag sorting) | `string` | - | 1.0.0 |
|`cellRenderTo`| Render cell using registered plugins | [See below](#cellrenderto-using-render-plugins) | - | 1.0.0 |
|`isRender`| Whether to render column (unlike `hide`, won't show in table settings) | `boolean & () => boolean` | - | 1.0.55 |
|`cellRenderPro`| Enhanced `cellRender` with `proxy: MaProTableExpose` param | `(data, proxy) => VNode & string` | - | 1.0.55 |
|`headerRenderPro`| Enhanced `headerRender` with `proxy: MaProTableExpose` param | `(data, proxy) => VNode & string` | - | 1.0.55 |
|`operationConfigure`| Operation column config (only when `type` is `operation`) | [See below](#operationconfigure-operation-column) | - | 1.0.0 |

##### cellRenderTo Using Render Plugins
::: info 
`ma-pro-table` cell render plugins must be registered before use.
:::
| Parameter | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| `name` | Cell render plugin name | `string` | - | 1.0.0 |
| `props` | Additional plugin parameters | `any, any[]` | - | 1.0.0 |

##### operationConfigure Operation Column
::: info 
`Operation Column` can only be configured via API. For simpler needs, add a regular column and implement via slots.
:::
| Parameter | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| `type` | Display mode: `auto`, `dropdown`, `tile` | `string` | `auto` | `auto` requires `1.0.75` |
| `fold` | Auto-fold threshold (default folds after 1 item) | `number` | `1` | 1.0.75 |
| `actions` | Operation column config list | `OperationAction[]` | - | 1.0.0 |

###### OperationAction Operation Column Config
| Parameter | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| `name` | Operation identifier | `string` | - | 1.0.0 |
| `text` | Text config | `string, ((data: TableColumnRenderer) => string)` | - | 1.0.0 |
| `icon` |