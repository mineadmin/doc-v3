# MaProTable
`ma-pro-table` is built upon the `ma-search` and `ma-table` components, designed to quickly implement complete `CRUD` functionality and increase time for slacking off.

:::tip Note
The built-in **User and Role Management** modules in the system serve as best practice examples of `ma-pro-table` CRUD implementation. Refer to both documentation and actual cases to master this component quickly.

Note: Unlike `2.0 ma-crud`, this component no longer directly supports built-in `Add` and `Edit` functionality - these need to be implemented manually.
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
- Combined from ma-search and ma-table, ready to use out of the box
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
- Automatic adaptation to different device sizes
- Mobile-friendly interaction experience
- Flexible layout configuration

## cellRenderTo Cell Rendering Plugins
::: tip Why does cellRenderTo plugin exist?
First, rendering different content in cells is an extremely frequent scenario. Much of the code may be identical, differing only in parameters or field names. When building `ma-pro-table`, we considered how to solve this problem.

While `ma-pro-table` can provide built-in rendering for different content types like `url`, `image`, `video`, or `switch` rendering, requirements are constantly changing. Built-in functionality can never keep up with growing business needs, yet we want to avoid code redundancy. Hence, this plugin mechanism was created.

You can share commonly used or business-specific cell rendering plugins in the app marketplace to enrich cell rendering options, eliminating the need to rewrite the same code.
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
      // Calling cell rendering plugin // [!code focus:9]
      cellRenderTo: {
        // Plugin name - this plugin renders strings as el-tag, the only built-in one in ma-pro-table
        name: 'tag', 
        // Can pass parameters required by the plugin
        props: {
          // This plugin doesn't require parameters, so none are passed
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
To register a plugin, import the `useProTableRenderPlugin()` method, then use it to register/remove plugins.
```ts
import { useProTableRenderPlugin } from '@mineadmin/pro-table'
```
`useProTableRenderPlugin()` returns the following methods:

- `addPlugin(plugin: MaProTableRenderPlugin): void`: Register plugin
- `removePlugin(pluginName: string): void`: Remove plugin
- `getPlugins(): MaProTableRenderPlugin[]`: Get all registered plugins in **ma-pro-table**
- `getPluginByName(pluginName: string): MaProTableRenderPlugin`: Get plugin info by name


::: details Click to view `MaProTableRenderPlugin` type description
| Parameter | Description | Type |
|----------|-------------|------|
| `name` | Cell rendering plugin name, unique identifier | `string`|
| `render` | Render function, supports `components, jsx, tsx` etc. | `Function` |

`render` function parameters:
- `data` type: `TableColumnRenderer` contains native `scope` parameters from `el-table` and extended parameters from `ma-table`
- `props`, external parameters passed when calling the plugin via `props` parameter.
- `proxy` type: `MaProTableExpose` refer to `Expose` section at the bottom of this chapter.
:::

The documentation only explains how to register plugins. We need to use the `addPlugin` function to register.

The built-in `tag` plugin prototype is as follows:
```ts
import { h } from 'vue'
import { useProTableRenderPlugin } from '@mineadmin/pro-table'
import { ElTag } from 'element-plus'

const { addPlugin } = useProTableRenderPlugin()

// Register plugin
addPlugin({
  // Plugin name, unique identifier. If uploading to app marketplace, include a unique prefix
  name: 'tag',
  // Plugin render function, can specify other Vue components or directly write tsx/jsx
  render: (data: TableColumnRenderer, props: any, proxy: MaProTableExpose) => {
    return h(
      ElTag,  // Use el-tag for rendering
      props,  // Pass through external props parameters when calling the plugin
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
`ma-pro-table` also has [slots](#slot) to extend this area. For one-time features, use slots. For system-wide needs, use the `api` for extension.
:::

`useProTableToolbar()` returns the following methods:
- `get: (name: string) => MaProTableToolbar` Get tool info
- `getAll: () => MaProTableToolbar[]` Get all tool info
- `add: (toolbar: MaProTableToolbar) => void` Add new tool
- `remove: (name: string) => void` Remove a tool
- `hide: (name: string) => void` Set a tool to non-rendered state
- `show: (name: string) => void` Set a tool to normal rendered state

::: details Click to view `MaProTableToolbar` type description
| Parameter | Description | Type |
|----------|-------------|------|
| `name` | Tool name, unique identifier | `string`|
| `render` | Render function, supports `components, jsx, tsx` etc. | `Function` |
| `show` | Whether to show by default | `boolean` |
| `order` | Tool rendering order - smaller numbers appear first | `number` |
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
  // Specify render component - will pass a proxy parameter to component which needs to define props to receive
  render: CustomerTool,
  show: true,
  order: 99,
})
```

```vue [CustomerTool.vue]

<script setup lang="ts">
  // Define props to receive proxy parameter from `ma-pro-table`
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
  <!-- Add circle attribute to make round button, consistent with system style -->
  <el-button circle @click="execute">😀</el-button>
</template>
```
:::

## TypeScript Type Definitions

### Core Types

```typescript
// Component main interface
interface MaProTableProps {
  options: MaProTableOptions    // Component configuration
  schema: MaProTableSchema      // Table schema
}

// Component exposed methods and properties
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
|----------|-------------|------|---------|
| `options` | `ma-pro-table` parameter settings | `MaProTableOptions` | 1.0.0 |
| `schema` | `ma-pro-table` schema configuration | `MaProTableSchema` | 1.0.0 |

### MaProTableOptions
| Parameter | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| `tableOptions` | `ma-table` parameters | `MaTableOptions` | - | 1.0.0 |
| `searchOptions` | `ma-search` parameters | `MaSearchOptions` | - | 1.0.0 |
| `searchFormOptions` | `ma-form` parameters | `MaFormOptions` | - | 1.0.0 |
| - | - | - | - | - |
| `id` | Current id, globally unique. Randomly generated if not specified | `string` | - | 1.0.0 |
| `adaptionOffsetBottom` | Bottom offset distance | `number` | 0 | 1.0.0 |
| `actionBtnPosition` | Action button position. In auto mode: shows in header if header enabled, otherwise top-left of table | `auto, header, table` | `auto` | 1.0.0 |
| `header` | Header configuration | See [Parameter Configuration](#headerconfig) | - | 1.0.0 |
| `toolbar` | Whether to show toolbar | `boolean, (() => boolean)` | `true` | 1.0.0 |
| `toolStates` | Conditionally set tool visibility | { `[key:string]` : `boolean, (() => boolean)` | - | 1.0.69 |
| `rowContextMenu` | Right-click configuration | See [Parameter Configuration](#rowcontextmenu) | - | 1.0.0 |
| `requestOptions` | List network request configuration | See [Parameter Configuration](#requestoptions) | - | 1.0.0 |
| `onSearchSubmit` | Search submit event | `(form: Record<string, any>) => void` | - | 1.0.0 |
| `onSearchReset` | Search reset event | `(form: Record<string, any>) => void` | - | 1.0.0 |


#### HeaderConfig
| Parameter | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| `show` | Whether to show header | `boolean, (() => boolean)` | `true` | 1.0.0 |
| `mainTitle` | Main title | `string, (() => string)` | `Table Main Title` | 1.0.0 |
| `subTitle` | Subtitle | `string, (() => string)` | - | 1.0.0 |

#### rowContextMenu
| Parameter | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| `enabled` | Whether to enable row right-click menu | `boolean` | `false` | 1.0.0 |
| `items` | Right-click menu list | `ContextMenuItem[]` | - | 1.0.0 |
| - | - | - | - | - |
| `ContextMenuItem` | Description | Menu list configuration | - | - |
| `label` | Menu display text | `string, (() => string)` | - | 1.0.0 |
| `icon` | Menu display icon | `string, (() => string)` | - | 1.0.0 |
| `disabled` | Whether disabled | `boolean` | - | 1.0.0 |
| `divided` | Whether to show divider | `boolean` | - | 1.0.0 |
| `onMenuClick` | Menu item click event | `(data: { row: any, column: any, proxy: MaProTableExpose }, event: Event) => void` | - | 1.0.0 |

#### requestOptions
| Parameter | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| `api` | Request api method | `(...args: any[]) => any` | - | 1.0.0 |
| `autoRequest` | Whether to auto request | `boolean` | `true` | 1.0.0 |
| `response` | Response structure configuration | `{ totalKey?: string, dataKey?: string }` | `{ totalKey: 'total', dataKey: 'list'}` | 1.0.0 |
| `requestPage` | Pagination request configuration | `{ pageName?: string, sizeName?: string, size?: number }` | `{ pageName: 'page', sizeName: 'pageSize', size: 10 }` | 1.0.0 |
| `requestParams` | Default request parameters | `Object` | - | 1.0.0 |
| `responseDataHandler` | Post-response data processing. Note: `Must return table data` | `(response: Record<string, any>) => any[]` | - | 1.0.0 |
| `on` | Event list | `Record<string, (...args: any[]) => any>` | - | 1.0.0 |


### MaProTableSchema
| Parameter | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
|`searchItems`| Search item list configuration | `MaSearchItem[]` [Configuration](ma-search#searchitems) | - | 1.0.0 |
|`tableColumns`| Table list configuration | `MaProTableColumns[]` | - | 1.0.0 |

#### MaProTableColumns
::: tip
Extends `el-table-columns` and `ma-table` [Extended columns configuration](ma-table#columnextraprops). Below are extended parameters.
:::
| Parameter | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
|`type`| On top of native `el-table`, adds `operation`, `sort` - first for operation column (extendable via API), second for `row drag sorting` | `string` | - | 1.0.0 |
|`cellRenderTo`| Render cell as registered plugin | [See type below](#cellrenderto-using-render-plugins) | - | 1.0.0 |
|`isRender`| Whether to render column. Unlike `hide`, won't show in table settings | `boolean & () => boolean` | - | 1.0.55 |
|`cellRenderPro`| Enhanced `cellRender`, adds second parameter `proxy: MaProTableExpose` | `(data, proxy) => VNode & string` | - | 1.0.55 |
|`headerRenderPro`| Enhanced `headerRender`, adds second parameter `proxy: MaProTableExpose` | `(data, proxy) => VNode & string` | - | 1.0.55 |
|`operationConfigure`| Operation column configuration, only effective when `type` is `operation` | [See type below](#operationconfigure-operation-column) | - | 1.0.0 |

##### cellRenderTo Using Render Plugins
::: info 
`ma-pro-table` cell rendering plugins must be registered before use.
:::
| Parameter | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| `name` | Cell rendering plugin name | `string` | - | 1.0.0 |
| `props` | Additional parameters required by plugin | `any, any[]` | - | 1.0.0 |

##### operationConfigure Operation Column
::: info 
`Operation Column` can only be configured via `api`. If too cumbersome, you can add a regular column in `columns` and implement via slots.
:::
| Parameter | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| `type` | Display mode: auto: `auto`, dropdown: