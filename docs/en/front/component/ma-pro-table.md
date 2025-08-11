# MaProTable  
`ma-pro-table` is built upon the `ma-search` and `ma-table` components, designed to quickly implement full `CRUD` functionality and maximize slacking time.

:::tip Note  
The built-in **User and Role Management** modules in the system are the best examples of `ma-pro-table` CRUD in action. Refer to both the documentation and real-world examples to master this component quickly.  

Note: Unlike `2.0 ma-crud`, this component no longer natively supports `Add` and `Edit` functionalities—these must be implemented manually.  
:::

## Usage  
<DemoPreview dir="demos/ma-pro-table" />

## cellRenderTo Cell Rendering Plugins  
::: tip Why Do cellRenderTo Plugins Exist?  
First, rendering different content in table cells is an extremely common scenario. Much of the code may be identical, differing only in parameters or field names. When designing `ma-pro-table`, we considered how to address this issue.  

While `ma-pro-table` can natively render different content types—such as `url`, `image`, `video`, or `switch`—the reality is that requirements are ever-changing. Built-in features can never keep up with growing business demands. To avoid redundant code, we introduced this plugin mechanism.  

Everyone is encouraged to share commonly used or specialized cell rendering plugins in the marketplace to enrich the ecosystem, eliminating the need to rewrite the same logic repeatedly.  
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
      // Invoke the cell rendering plugin // [!code focus:9]  
      cellRenderTo: {  
        // Plugin name. This plugin renders strings as el-tag, the only built-in example.  
        name: 'tag',   
        // Optional plugin parameters  
        props: {  
          // This plugin doesn't require parameters, so none are passed.  
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
To register a plugin, import the `useProTableRenderPlugin()` method and use it to add or remove plugins.  
```ts  
import { useProTableRenderPlugin } from '@mineadmin/pro-table'  
```  
`useProTableRenderPlugin()` returns the following methods:  

- `addPlugin(plugin: MaProTableRenderPlugin): void`: Register a plugin.  
- `removePlugin(pluginName: string): void`: Remove a plugin.  
- `getPlugins(): MaProTableRenderPlugin[]`: Retrieve all registered plugins in **ma-pro-table**.  
- `getPluginByName(pluginName: string): MaProTableRenderPlugin`: Get a specific plugin by name.  

::: details Click to View `MaProTableRenderPlugin` Type Definition  
| Parameter | Description | Type |  
|----------|-------------|------|  
| `name` | Unique identifier for the cell rendering plugin | `string` |  
| `render` | Rendering function, supports `components, jsx, tsx`, etc. | `Function` |  

`render` Function Parameters:  
- `data`: Type: `TableColumnRenderer`—includes `el-table`'s native `scope` parameters and `ma-table` extensions.  
- `props`: External parameters passed via the `props` argument when invoking the plugin.  
- `proxy`: Type: `MaProTableExpose`—refer to the `Expose` section at the bottom of this chapter.  
:::

The documentation only explains how to register plugins. We use the `addPlugin` function for registration.  

The built-in `tag` plugin prototype is as follows:  
```ts  
import { h } from 'vue'  
import { useProTableRenderPlugin } from '@mineadmin/pro-table'  
import { ElTag } from 'element-plus'  

const { addPlugin } = useProTableRenderPlugin()  

// Register the plugin  
addPlugin({  
  // Plugin name, a unique identifier. If uploading to the marketplace, prefix it uniquely.  
  name: 'tag',  
  // Plugin rendering function—supports Vue components or direct tsx/jsx.  
  render: (data: TableColumnRenderer, props: any, proxy: MaProTableExpose) => {  
    return h(  
      ElTag,  // Render using el-tag  
      props,  // Pass through external props  
      {  
        default: () => data.row[props?.prop] // Use el-tag's default slot  
      }  
    )  
  }  
})  
```

## ToolbarPlugin Toolbar Plugins  
![Table Toolbar](https://s21.ax1x.com/2024/11/03/pArlfRU.png)  

::: tip Note  
`ma-pro-table` also provides [slots](#slot) for extending the toolbar. For one-off features, use slots. For system-wide needs, use the `API` extension.  
:::

`useProTableToolbar()` returns the following methods:  
- `get: (name: string) => MaProTableToolbar`: Retrieve a specific tool's info.  
- `getAll: () => MaProTableToolbar[]`: Retrieve all tools' info.  
- `add: (toolbar: MaProTableToolbar) => void`: Add a new tool.  
- `remove: (name: string) => void`: Remove a tool.  
- `hide: (name: string) => void`: Set a tool to hidden.  
- `show: (name: string) => void`: Set a tool to visible.  

::: details Click to View `MaProTableToolbar` Type Definition  
| Parameter | Description | Type |  
|----------|-------------|------|  
| `name` | Unique identifier for the tool | `string` |  
| `render` | Rendering function, supports `components, jsx, tsx`, etc. | `Function` |  
| `show` | Whether to display by default | `boolean` |  
| `order` | Rendering order—smaller numbers appear first | `number` |  
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
  // Specify the rendering component. The component receives a `proxy` prop.  
  render: CustomerTool,  
  show: true,  
  order: 99,  
})  
```  

```vue [CustomerTool.vue]  
<script setup lang="ts">  
  // Define props to receive `ma-pro-table`'s `proxy` parameter.  
  import { MaProTableExpose } from "@mineadmin/pro-table"  
  import { ElMessage } from 'element-plus'  

  const { proxy } = defineProps<{ proxy: MaProTableExpose }>()  

  const execute = async () => {  
    // Refresh the table  
    await proxy?.refresh?.()  
    ElMessage.success('Table refreshed successfully')  
  }  
</script>  

<template>  
  <!-- Add the `circle` prop to match the system's style -->  
  <el-button circle @click="execute">😀</el-button>  
</template>  
```  
:::

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
| `id` | Unique ID for the component. Randomly generated if unspecified. | `string` | - | 1.0.0 |  
| `adaptionOffsetBottom` | Bottom offset for height adaptation | `number` | 0 | 1.0.0 |  
| `actionBtnPosition` | Action button placement. In `auto` mode, shows in the header if enabled; otherwise, top-left of the table. | `auto, header, table` | `auto` | 1.0.0 |  
| `header` | Header configuration | See [HeaderConfig](#headerconfig) | - | 1.0.0 |  
| `toolbar` | Whether to show the toolbar | `boolean, (() => boolean)` | `true` | 1.0.0 |  
| `toolStates` | Conditionally show/hide tools | `{ [key:string]: boolean, (() => boolean) }` | - | 1.0.69 |  
| `rowContextMenu` | Right-click menu configuration | See [RowContextMenu](#rowcontextmenu) | - | 1.0.0 |  
| `requestOptions` | Table data request configuration | See [RequestOptions](#requestoptions) | - | 1.0.0 |  
| `onSearchSubmit` | Search submit event | `(form: Record<string, any>) => void` | - | 1.0.0 |  
| `onSearchReset` | Search reset event | `(form: Record<string, any>) => void` | - | 1.0.0 |  

#### HeaderConfig  
| Parameter | Description | Type | Default | Version |  
|----------|-------------|------|---------|---------|  
| `show` | Whether to show the header | `boolean, (() => boolean)` | `true` | 1.0.0 |  
| `mainTitle` | Main title | `string, (() => string)` | `Table Title` | 1.0.0 |  
| `subTitle` | Subtitle | `string, (() => string)` | - | 1.0.0 |  

#### rowContextMenu  
| Parameter | Description | Type | Default | Version |  
|----------|-------------|------|---------|---------|  
| `enabled` | Enable row right-click menu | `boolean` | `false` | 1.0.0 |  
| `items` | Menu items | `ContextMenuItem[]` | - | 1.0.0 |  
| - | - | - | - | - |  
| `ContextMenuItem` | Description | Menu item configuration | - | - |  
| `label` | Menu display text | `string, (() => string)` | - | 1.0.0 |  
| `icon` | Menu icon | `string, (() => string)` | - | 1.0.0 |  
| `disabled` | Disable the item | `boolean` | - | 1.0.0 |  
| `divided` | Show a divider | `boolean` | - | 1.0.0 |  
| `onMenuClick` | Menu item click event | `(data: { row: any, column: any, proxy: MaProTableExpose }, event: Event) => void` | - | 1.0.0 |  

#### requestOptions  
| Parameter | Description | Type | Default | Version |  
|----------|-------------|------|---------|---------|  
| `api` | API method for data fetching | `(...args: any[]) => any` | - | 1.0.0 |  
| `autoRequest` | Auto-fetch data | `boolean` | `true` | 1.0.0 |  
| `response` | Response structure configuration | `{ totalKey?: string, dataKey?: string }` | `{ totalKey: 'total', dataKey: 'list'}` | 1.0.0 |  
| `requestPage` | Pagination configuration | `{ pageName?: string, sizeName?: string, size?: number }` | `{ pageName: 'page', sizeName: 'pageSize', size: 10 }` | 1.0.0 |  
| `requestParams` | Default request parameters | `Object` | - | 1.0.0 |  
| `responseDataHandler` | Post-response data processing (must return table data) | `(response: Record<string, any>) => any[]` | - | 1.0.0 |  
| `on` | Event listeners | `Record<string, (...args: any[]) => any>` | - | 1.0.0 |  

### MaProTableSchema  
| Parameter | Description | Type | Default | Version |  
|----------|-------------|------|---------|---------|  
| `searchItems` | Search item configuration | `MaSearchItem[]` [Config](ma-search#searchitems) | - | 1.0.0 |  
| `tableColumns` | Table column configuration | `MaProTableColumns[]` | - | 1.0.0 |  

#### MaProTableColumns  
::: tip  
Extends `el-table-columns` and `ma-table`'s [extra column config](ma-table#columnextraprops). Below are the extended parameters.  
:::
| Parameter | Description | Type | Default | Version |  
|----------|-------------|------|---------|---------|  
| `type` | Adds `operation` (action column, extendable via API) and `sort` (drag-to-sort) to native `el-table` types. | `string` | - | 1.0.0 |  
| `cellRenderTo` | Render cells using registered plugins | [See Below](#cellrenderto-cell-rendering-plugins) | - | 1.0.0 |  
| `isRender` | Whether to render the column (unlike `hide`, it won't appear in table settings) | `boolean & () => boolean` | - | 1.0.55 |  
| `cellRenderPro` | Enhanced `cellRender` with a second `proxy: MaProTableExpose` parameter | `(data, proxy) => VNode & string` | - | 1.0.55 |  
| `headerRenderPro` | Enhanced `headerRender` with a second `proxy: MaProTableExpose` parameter | `(data, proxy) => VNode & string` | - | 1.0.55 |  
| `operationConfigure` | Action column config (only when `type` is `operation`) | [See Below](#operationconfigure-action-column) | - | 1.0.0 |  

##### cellRenderTo Cell Rendering Plugins  
::: info  
Plugins must be registered before use.  
:::
| Parameter | Description | Type | Default | Version |  
|----------|-------------|------|---------|---------|  
| `name` | Plugin name | `string` | - | 1.0.0 |  
| `props` | Plugin parameters | `any, any[]` | - | 1.0.0 |  

##### operationConfigure Action Column  
::: info  
Action items can only be configured via `API`. For simplicity, add a regular column and implement via slots.  
:::
| Parameter | Description | Type | Default | Version |  
|----------|-------------|------|---------|---------|  
| `type` | Display mode: `auto`, `dropdown`, or `tile` | `string` | `auto` | 1.0.75 |  
| `fold` | In `auto` mode, number of items before folding | `number` | `1` | 1.0.75 |  
| `actions` | Action item list | `OperationAction[]` | - | 1.0.0 |  

###### OperationAction Action Item Config  
| Parameter | Description | Type | Default | Version |  
|----------|-------------|------|---------|---------|  
| `name` | Action identifier | `string` | - | 1.0.0 |  
| `text` | Display text | `string, ((data: TableColumnRenderer) => string)` | - | 1.0.0 |  
| `icon` | Icon (rendered via `ma-svg-icon`) | `string, ((data: TableColumnRenderer) => string)` | - | 1.0.0 |  
| `order` | Sort order (lower = earlier) | `number` | - | 1.0.0 |  
| `disabled` | Disable the action | `((data: TableColumnRenderer) => boolean)` | - | 1.0.0 |  
| `show` | Show the action | `((data: TableColumnRenderer) => boolean)` | - | 1.0.0 |  
| `onClick` | Click event | `(data: TableColumnRenderer, proxy: MaProTableExpose) => void` | - | 1.0.0 |  
| `linkProps` | `el-link` props | [LinkProps Docs](https://element-plus.org/zh-CN/component/link.html#attributes) | - | 1.0.0 |  

## Event  

| Name | Description | Parameters |  
|------|-------------|------------|  
| `row-drag-sort` | Row drag-sort event | `(tableData: any[]) => void` |  
| `search-submit` | Search submit event | `(form: Record<string, any>) => Record<string, any>, void` |  
| `search-reset` | Search reset event | `(form: Record<string, any>) => Record<string, any>, void` |  

## Slot  

| Name | Description | Parameters |  
|------|-------------|------------|  
| `default` | Default slot (includes native `el-table` slots) | - |  
| `empty` | Native slot for empty data | - |  
| `append` | Native slot for the last row | - |  
| `pageLeft` | Left side of the pagination row | - |  
| `column-[prop]` | Column slot (`prop` = field name) | `scope` |  
| `header-[prop]` | Header slot (`prop` = field name) | `