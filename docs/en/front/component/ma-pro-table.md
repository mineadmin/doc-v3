# MaProTable
`ma-pro-table` is built on top of the `ma-search` and `ma-table` components, designed to quickly construct a complete `CRUD` functionality, thereby increasing your leisure time.

:::tip Tip
The built-in **User and Role Management** systems are the best practices for `ma-pro-table` CRUD. Refer to the documentation and actual examples to quickly master this component.

Note: This component no longer directly supports `Add` and `Edit` functionalities like `2.0 ma-crud` did. These need to be implemented by yourself.
:::

## Usage
<DemoPreview dir="demos/ma-pro-table" />

## cellRenderTo Cell Rendering Plugin
::: tip Why does the cellRenderTo plugin exist?
First, rendering different content in cells is a very frequent scenario. Much of the code might be the same, only differing in parameters and field names. Therefore, when building `ma-pro-table`, we considered how to solve this problem.

Although `ma-pro-table` can natively render different content types like `url`, `image`, `video`, and even `switch`, the issue is that requirements are ever-changing. Built-in functionalities can never keep up with the growth of business needs. To avoid code redundancy, we introduced this plugin mechanism.

You can share your commonly used or business-specific cell rendering plugins on the app market to enrich cell rendering options, so everyone doesn't have to write the same things repeatedly.
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
      // Call the cell rendering plugin // [!code focus:9]
      cellRenderTo: {
        // Plugin name, this plugin renders strings as el-tag, the only one built into ma-pro-table.
        name: 'tag', 
        // You can pass parameters required by the plugin
        props: {
          // This plugin doesn't require parameters, so we won't pass any.
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
To register a plugin, you need to import the `useProTableRenderPlugin()` method and then use it to register or remove plugins.
```ts
import { useProTableRenderPlugin } from '@mineadmin/pro-table'
```
`useProTableRenderPlugin()` returns the following methods:

- `addPlugin(plugin: MaProTableRenderPlugin): void`: Register a plugin
- `removePlugin(pluginName: string): void`: Remove a plugin
- `getPlugins(): MaProTableRenderPlugin[]`: Get all registered plugins in **ma-pro-table**
- `getPluginByName(pluginName: string): MaProTableRenderPlugin`: Get a plugin by its name


::: details Click to view `MaProTableRenderPlugin` type description
| Parameter       | Description                  | Type         |
|----------|---------------------|-------------------|
| `name` | Cell rendering plugin name, unique identifier | `string`|
| `render`  | Rendering function, supports `components, jsx, tsx`, etc. | `Function` |

`render` function parameter description:
- `data` type: `TableColumnRenderer` includes `el-table`'s `scope` native parameters and `ma-table` extended parameters
- `props`, external parameters passed through the `props` parameter when calling the plugin.
- `proxy` type: `MaProTableExpose` Refer to the `Expose` section at the bottom of this chapter for details.
:::

The documentation only explains how to register plugins. We need to use the `addPlugin` function to register.

The built-in `tag` plugin prototype is as follows:
```ts
import { h } from 'vue'
import { useProTableRenderPlugin } from '@mineadmin/pro-table'
import { ElTag } from 'element-plus'

const { addPlugin } = useProTableRenderPlugin()

// Register the plugin
addPlugin({
  // Plugin name, unique identifier. If uploading to the app market, please include a unique prefix.
  name: 'tag',
  // Plugin rendering function, supports specifying other Vue components or directly writing tsx or jsx.
  render: (data: TableColumnRenderer, props: any, proxy: MaProTableExpose) => {
    return h(
      ElTag,  // Use el-tag for rendering
      props,  // Pass through external props parameters when calling the plugin
      {
        default: () => data.row[props?.prop] // Use el-tag's default slot
      }
    )
  }
})

```

## ToolbarPlugin Toolbar Plugin
![Table Toolbar](https://s21.ax1x.com/2024/11/03/pArlfRU.png)

::: tip Explanation
`ma-pro-table` also has [slots](#slot) to extend this area. If certain one-time functionalities are needed, use slots. If the entire system requires it, it is recommended to use the `api` for extension.
:::

`useProTableToolbar()` returns the following methods:
- `get: (name: string) => MaProTableToolbar` Get a tool's information
- `getAll: () => MaProTableToolbar[]` Get all tools' information
- `add: (toolbar: MaProTableToolbar) => void` Add a new tool
- `remove: (name: string) => void` Remove a tool
- `hide: (name: string) => void` Set a tool to not render
- `show: (name: string) => void` Set a tool to render normally

::: details Click to view `MaProTableToolbar` type description
| Parameter       | Description                  | Type         |
|----------|---------------------|-------------------|
| `name` | Tool name, unique identifier | `string`|
| `render`  | Rendering function, supports `components, jsx, tsx`, etc. | `Function` |
| `show`  | Whether to show by default | `boolean` |
| `order`  | Tool rendering order, the smaller the number, the earlier it appears | `number` |
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
  // Specify the rendering component, a proxy parameter will be passed to the component, which needs to define props to receive it
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
  <!-- Add the circle attribute to make it a circular button, consistent with the system -->
  <el-button circle @click="execute">😀</el-button>
</template>
```
:::

## Props
| Parameter       | Description                  | Type         | Version    |
|----------|---------------------|-------------------|--------|
| `options` | `ma-pro-table` parameter settings | `MaProTableOptions`   | 1.0.0 |
| `schema`  | `ma-pro-table` schema configuration | `MaProTableSchema` | 1.0.0 |

### MaProTableOptions
| Parameter                     | Description                                        | Type                                  | Default    | Version    |
|------------------------|-------------------------------------------|-------------------------------------|--------|-------|
| `tableOptions`         | `ma-table` parameters                             | `MaTableOptions`                    | -      | 1.0.0 |
| `searchOptions`        | `ma-search` parameters                            | `MaSearchOptions`                   | -      | 1.0.0 |
| `searchFormOptions`    | `ma-form` parameters                              | `MaFormOptions`                     | -      | 1.0.0 |
| -                      | -                                         | -                                   | -      | -     |
| `id`                   | Current ID, globally unique, randomly generated if not specified                      | `string`                            | -      | 1.0.0 |
| `adaptionOffsetBottom` | Bottom offset                                   | `number`                            | 0      | 1.0.0 |
| `actionBtnPosition`    | Action button placement, in auto mode, if the header is enabled, it appears in the header, otherwise in the top-left of the table | `auto, header, table`               | `auto` | 1.0.0 |
| `header`               | Header configuration                                      | See [Parameter Configuration](#headerconfig)            | -      | 1.0.0 |
| `toolbar`              | Whether to show the toolbar                                   | `boolean, (() => boolean)`          | `true` | 1.0.0 |
| `toolStates`           | Configure tool display on demand                                | { `[key:string]` : `boolean, (() => boolean)` | -      | 1.0.69 |
| `rowContextMenu`       | Right-click configuration                                      | See [Parameter Configuration](#rowcontextmenu)          | -      | 1.0.0 |
| `requestOptions`       | List network request configuration                                  | See [Parameter Configuration](#requestoptions)          | -      | 1.0.0 |
| `onSearchSubmit`       | Search submit event                                    | `(form: Record<string, any>) => void` | -      | 1.0.0 |
| `onSearchReset`        | Search reset event                                    | `(form: Record<string, any>) => void`          | -      | 1.0.0 |


#### HeaderConfig
| Parameter   | Description           | Type                         | Default     | Version    |
|------|--------------|----------------------------|---------|-------|
| `show` | Whether to show the header  | `boolean, (() => boolean)` | `true`  | 1.0.0 |
| `mainTitle` | Main title  | `string, (() => string)`   | `Table Main Title` | 1.0.0 |
| `subTitle` | Subtitle  | `string, (() => string)`                   | -       | 1.0.0 |

#### rowContextMenu
| Parameter                | Description        | Type                                                                                 | Default     | Version    |
|-------------------|-----------|------------------------------------------------------------------------------------|---------|-------|
| `enabled`         | Whether to enable row right-click menu | `boolean`                                                                          | `false` | 1.0.0 |
| `items`           | Right-click menu list    | `ContextMenuItem[]`                                                                | -       | 1.0.0 |
| -                 | -         | -                                                                                  | -      | -     |
| `ContextMenuItem` | Description        | Menu list configuration description                                                                           | -      | -     |
| `label`           | Menu display text    | `string, (() => string)`                                                           | -       | 1.0.0 |
| `icon`            | Menu display icon    | `string, (() => string)`                                                           | -       | 1.0.0 |
| `disabled`        | Whether to disable      | `boolean`                                                                          | -       | 1.0.0 |
| `divided`         | Whether to show a divider   | `boolean`                                                                          | -       | 1.0.0 |
| `onMenuClick`     | Menu item click event   | `(data: { row: any, column: any, proxy: MaProTableExpose }, event: Event) => void` | -       | 1.0.0 |

#### requestOptions
| Parameter                    | Description                    | Type                                                        | Default                                                    | Version    |
|-----------------------|-----------------------|-----------------------------------------------------------|--------------------------------------------------------|-------|
| `api`                 | Request API method             | `(...args: any[]) => any`                                 | -                                                      | 1.0.0 |
| `autoRequest`         | Whether to auto-request                | `boolean`                                                 | `true`                                                 | 1.0.0 |
| `response`            | Response structure configuration              | `{ totalKey?: string, dataKey?: string }`                 | `{ totalKey: 'total', dataKey: 'list'}`                | 1.0.0 |
| `requestPage`         | Request pagination configuration                | `{ pageName?: string, sizeName?: string, size?: number }` | `{ pageName: 'page', sizeName: 'pageSize', size: 10 }` | 1.0.0 |
| `requestParams`       | Default request parameters                | `Object`                                                  | -                                                      | 1.0.0 |
| `responseDataHandler` | Post-response data processing, note: `must return the table data` | `(response: Record<string, any>) => any[]`                | -                                                      | 1.0.0 |
| `on`                  | Event list | `Record<string, (...args: any[]) => any>`                 | -                                                      | 1.0.0 |


### MaProTableSchema
| Parameter   | Description       | Type                                                | Default | Version    |
|------|----------|---------------------------------------------------|-----|-------|
|`searchItems`| Search item list configuration  | `MaSearchItem[]` [Configuration](ma-search#searchitems) | -   | 1.0.0 |
|`tableColumns`| Table column configuration | `MaProTableColumns[]`                             | -   | 1.0.0 |

#### MaProTableColumns
::: tip
Inherits from `el-table-columns` and `ma-table`'s [extended columns configuration](ma-table#columnextraprops). Below are the extended parameters.
:::
| Parameter   | Description                         | Type                                                 | Default | Version    |
|------|----------------------------|----------------------------------------------------|-----|-------|
|`type`| On top of `el-table` native types, adds `operation`, `sort`. The first is for operation columns, which can be extended via `API`, the second is for `row drag sorting`. | `string` | -   | 1.0.0 |
|`cellRenderTo`| Render cells using registered plugins                     | [See below for type](#cellrenderto-using-rendering-plugins)    | -   | 1.0.0 |
|`isRender`| Whether to render the column, unlike `hide`, it won't show this column in the table settings                     | `boolean & () => boolean`    | -   | 1.0.55 |
|`cellRenderPro`| Enhanced `cellRender`, adds a second parameter `proxy: MaProTableExpose`                    | `(data, proxy) => VNode & string`    | -   | 1.0.55 |
|`headerRenderPro`| Enhanced `headerRender`, adds a second parameter `proxy: MaProTableExpose`                     | `(data, proxy) => VNode & string`    | -   | 1.0.55 |
|`operationConfigure`| Operation column configuration, only effective when `type` is `operation`  | [See below for type](#operationconfigure-operation-column)    | -   | 1.0.0 |

##### cellRenderTo Using Rendering Plugins
::: info 
`ma-pro-table` cell rendering plugins must be registered before use.
:::
| Parameter      | Description        | Type           | Default | Version    |
|---------|-----------|--------------|-----|-------|
| `name`  | Cell rendering plugin name  | `string`     | -   | 1.0.0 |
| `props` | Additional parameters required by the plugin | `any, any[]` | -   | 1.0.0 |

##### operationConfigure Operation Column
::: info 
`Operation Column` can only be set via `api`. If it's too cumbersome, you can add a regular column in `columns` and implement it yourself using slots.
:::
| Parameter      | Description        | Type           | Default | Version    |
|---------|-----------|--------------|-----|-------|
| `type`  | Display mode, auto mode: `auto`, dropdown menu: `dropdown`, tile: `tile`  | `string`     | `auto`   | `auto` requires `1.0.75` |
| `fold`  | In auto mode, the number of tiles before auto-collapsing, default: `1`  | `number`     | `1`   | 1.0.75 |
| `actions` | Action bar configuration list | `OperationAction[]` | -   | 1.0.0 |

###### OperationAction Action Bar Configuration
| Parameter    | Description                     | Type                                                             | Default | Version |
|-------------|--------------------------------|----------------------------------------------------------------|---------|---------|
| `name`      | Action identifier              | `string`                                                       | -       | 1.0.0   |
| `text`      | Text configuration             | `string, ((data: TableColumnRenderer) => string)`              | -       | 1.0.0   |
| `icon`      | Icon configuration (rendered internally with `ma-svg-icon`) | `string, ((data: TableColumnRenderer) => string)`              | -       | 1.0.0   |
| `order`     | Sort order (lower numbers appear first) | `number`                                                       | -       | 1.0.0   |
| `disabled`  | Whether disabled               | `((data: TableColumnRenderer) => boolean)`                     | -       | 1.0.0   |
| `show`      | Whether to show                | `((data: TableColumnRenderer) => boolean)`                     | -       | 1.0.0   |
| `onClick`   | Click event handler            | `(data: TableColumnRenderer, proxy: MaProTableExpose) => void` | -       | 1.0.0   |
| `linkProps` | `el-link` component props      | [LinkProps Documentation](https://element-plus.org/en-US/component/link.html#attributes) | -       | 1.0.0   |

## Events

| Name             | Description          | Parameters                                                     |
|------------------|---------------------|---------------------------------------------------------------|
| `row-drag-sort`  | Row drag sort event  | `(tableData: any[]) => void`                                  |
| `search-submit`  | Search submit event  | `(form: Record<string, any>) => Record<string, any>, void`     |
| `search-reset`   | Search reset event   | `(form: Record<string, any>) => Record<string, any>, void`    |

## Slots

| Name                    | Description                                                                 | Parameters |
|-------------------------|-----------------------------------------------------------------------------|------------|
| `default`               | Default slot and native `el-table` slots                                    | -          |
| `empty`                 | Native slot displayed when data is empty                                     | -          |
| `append`                | Native slot for the last row of the table                                   | -          |
| `pageLeft`              | Slot for left area of pagination row                                        | -          |
| `column-[prop]`         | Table column slot (`prop` is the field name)                                | scope      |
| `header-[prop]`         | Table header slot (`prop` is the field name)                               | scope      |
| `middle`                | Slot for area between table and search bar                                 | -          |
| `tableHeader`           | Slot for entire header area                                                | -          |
| `headerTitle`           | Slot for title area in header                                              | -          |
| `headerRight`           | Slot for right area in header                                              | -          |
| `toolbarLeft`           | Slot for left area of toolbar                                              | -          |
| `toolbar`               | Slot for toolbar list (not recommended, prefer [API extension](#toolbarplugin-toolbar-plugin)) | -          |
| `beforeToolbar`         | Pre-toolbar list slot                                                      | -          |
| `afterToolbar`          | Post-toolbar list slot                                                     | -          |
| `tableTop`              | Slot at top of table container (above toolbar)                             | -          |
| `tableCranny`           | Slot for gap between table and toolbar in table container                 | -          |
| `search`                | Search component slot (disables search item configuration when used)      | -          |
| `searchActions`         | Slot for search action buttons content                                     | -          |
| `searchBeforeActions`   | Slot for content before search action buttons                              | -          |
| `searchAfterActions`    | Slot for content after search action buttons                               | -          |

## Exposed Methods
| Name                     | Description                           | Parameters                                                              | Return Type               |
|--------------------------|--------------------------------------|------------------------------------------------------------------------|---------------------------|
| `getSearchRef()`         | Get `ma-search` reference            | -                                                                     | `MaSearchExpose`          |
| `getTableRef()`          | Get `ma-table` reference              | -                                                                     | `MaTableExpose`           |
| `getElTableStates()`     | Get `el-table` exposed states         | -                                                                     | `any`                     |
| `setTableColumns()`      | Set table columns                     | `(cols: MaProTableColumns[]) => void`                                 | `void`                    |
| `getTableColumns()`      | Get table columns                     | `() => MaProTableColumns[]`                                           | `MaProTableColumns[]`      |
| `refresh()`              | Refresh table data                    | `() => Promise<void>`                                                 | `Promise<void>`           |
| `requestData()`          | Request table data                    | `() => Promise<void>`                                                 | `Promise<void>`           |
| `changeApi()`            | Change request API                   | `(api: () => any, isRequestNow: boolean) => void`                     | `void`                    |
| `setRequestParams()`     | Set request parameters               | `(params: Record<string, any>, isRequestNow: boolean) => void`       | `void`                    |
| `setSearchForm()`        | Set search form default values        | `(form: Record<string, any>) => void`                                 | `void`                    |
| `getSearchForm()`        | Get search form data                 | `() => Record<string, any>`                                           | `Record<string, any>`     |
| `search()`               | Search method                        | `(form: Record<string, any>) => void`                                 | `void`                    |
| `setProTableOptions()`   | Set `ma-pro-table` options           | `(opts: MaProTableOptions) => void`                                   | `void`                    |
| `getProTableOptions()`   | Get `ma-pro-table` options           | `() => MaProTableOptions`                                             | `MaProTableOptions`       |
| `resizeHeight()`         | Reset table height                   | `() => Promise<void>`                                                 | `Promise<void>`           |
| `getCurrentId()`         | Get current component ID             | -                                                                     | `string`                  |