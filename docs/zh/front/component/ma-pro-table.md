# MaProTable
`ma-pro-table` 基于 `ma-search` 和 `ma-table` 两个组件封装而来，用于快速构建一个完整的 `CRUD` 功能，增加摸鱼的时间。

:::tip 提示
系统内自带的 **用户、角色管理** 都是 `ma-pro-table` CRUD的最佳实践，文档和实际案例参考，才能快速掌握这个组件。

注意：本组件不再像 `2.0 ma-crud` 那样直接内置支持 `新增` 和 `编辑` 功能，这些需要自己来实现。
:::

## 使用
<DemoPreview dir="demos/ma-pro-table" />

## cellRenderTo 单元格渲染插件
::: tip 为什么要存在 cellRenderTo 插件？
首先，单元格渲染不同内容是使用非常非常频繁的场景，很多代码可能都一样，只是参数不一样，字段名不一样。所以在构建 `ma-pro-table` 时就在考虑如何解决这个问题。

`ma-pro-table` 虽然可以内置针对不同内容的渲染，比如 `url`, `image`, `video`，再比如 `switch` 渲染。但问题是需求多变的，
内置的功能也永远满足不了业务需求的增长，但同时为了避免代码冗余，所以有了这个插件机制。

大家可以把自己常用的、或者某些专属业务封装的单元格渲染插件，分享出来，分享到应用市场，来丰富单元格渲染，这样大家都不需要再写同样的东西了。
:::

### 使用单元格插件

```vue 
<script setup lang="ts">
import { ref } from 'vue'
import { MaProTableSchema } from "@mineadmin/pro-table";

const schema = ref<MaProTableSchema>({
  tableColumns: [
    {
      title: '单元格渲染示例',
      prop: 'title',
      // 调用单元格渲染插件 // [!code focus:9]
      cellRenderTo: {
        // 插件名，此插件将字符串以 el-tag 形式渲染，ma-pro-table 内置这唯一一个。
        name: 'tag', 
        // 可以传入插件所需的参数
        props: {
          // 该插件非必须传入参数，就不传了、
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

### 注册单元格插件
注册插件需要导入 `useProTableRenderPlugin()` 方法，然后使用此方法注册、移除插件。
```ts
import { useProTableRenderPlugin } from '@mineadmin/pro-table'
```
`useProTableRenderPlugin()` 返回了以下几个方法：

- `addPlugin(plugin: MaProTableRenderPlugin): void`: 注册插件
- `removePlugin(pluginName: string): void`: 移除插件
- `getPlugins(): MaProTableRenderPlugin[]`: 获取 **ma-pro-table** 已注册的所有插件
- `getPluginByName(pluginName: string): MaProTableRenderPlugin`: 按插件名获取某个插件信息


::: details 点击查看 `MaProTableRenderPlugin` 类型说明
| 参数       | 说明                  | 类型         |
|----------|---------------------|-------------------|
| `name` | 单元格渲染插件名称，唯一标识符 | `string`|
| `render`  | 渲染函数，支持 `组件, jsx, tsx` 等 | `Function` |

`render` 函数参数说明：
- `data` 类型: `TableColumnRenderer` 包含 `el-table` 的 `scope` 原生参数，以及 `ma-table` 扩展参数
- `props`，调用插件时通过 `props` 参数传入的外部参数。
- `proxy` 类型: `MaProTableExpose` 可查看此章节最下面的 `Expose` 节点说明。
:::

文档就只说明如何注册插件，我们需要用到 `addPlugin` 函数来注册。

内置 `tag` 插件原型如下：
```ts
import { h } from 'vue'
import { useProTableRenderPlugin } from '@mineadmin/pro-table'
import { ElTag } from 'element-plus'

const { addPlugin } = useProTableRenderPlugin()

// 注册插件
addPlugin({
  // 插件名，唯一标识符，如果需要上传应用市场，请带上专属前缀
  name: 'tag',
  // 插件渲染函数，支持指定其他vue组件或者直接编写 tsx 与 jsx 都可以
  render: (data: TableColumnRenderer, props: any, proxy: MaProTableExpose) => {
    return h(
      ElTag,  // 使用 el-tag 来渲染
      props,  // 透传外部调用插件时传入的 props 参数
      {
        default: () => data.row[props?.prop] // 使用 el-tag 默认插槽
      }
    )
  }
})

```

## ToolbarPlugin 工具栏插件
![表格工具栏](https://s21.ax1x.com/2024/11/03/pArlfRU.png)

::: tip 说明
`ma-pro-table` 也有[插槽](#slot)可以扩展这里，如果某些一次性的功能可使用插槽，如果整个系统都有需求，则建议使用 `api` 来扩展了。
:::

`useProTableToolbar()` 返回了以下几个方法：
- `get: (name: string) => MaProTableToolbar` 获取某个工具信息
- `getAll: () => MaProTableToolbar[]` 获取所有工具信息
- `add: (toolbar: MaProTableToolbar) => void` 添加新工具
- `remove: (name: string) => void` 移除一个工具
- `hide: (name: string) => void` 设置一个工具为不渲染状态
- `show: (name: string) => void` 设置一个工具为正常渲染状态

::: details 点击查看 `MaProTableToolbar` 类型说明
| 参数       | 说明                  | 类型         |
|----------|---------------------|-------------------|
| `name` | 工具名称，唯一标识符 | `string`|
| `render`  | 渲染函数，支持 `组件, jsx, tsx` 等 | `Function` |
| `show`  | 默认是否显示 | `boolean` |
| `order`  | 工具渲染顺序，数字越小，越靠前 | `number` |
  :::

### 扩展工具栏

::: code-group 
```ts [index.vue]
import { useProTableToolbar } from '@mineadmin/pro-table'
import CustomerTool from './CustomerTool.vue'

const { add } = useProTableToolbar()

add({
  // 工具名称
  name: 'heihei',
  // 指定渲染组件，会向组件传入一个 proxy 参数，组件内部需要定义 props 来接收
  render: CustomerTool,
  show: true,
  order: 99,
})
```

```vue [CustomerTool.vue]

<script setup lang="ts">
  // 定义 props 来接收 `ma-pro-table` 传入的 proxy 参数
  import { MaProTableExpose } from "@mineadmin/pro-table"
  import { ElMessage } from 'element-plus'

  const { proxy } = defineProps<{ proxy: MaProTableExpose }>()
  
  const execute = async () => {
    // 执行刷新表格
    await proxy?.refresh?.()
    ElMessage.success('表格刷新成功')
  }
</script>

<template>
  <!-- 加入 circle 属性成为圆按钮，与系统的保持统一 -->
  <el-button circle @click="execute">😀</el-button>
</template>
```
:::

## Props
| 参数       | 说明                  | 类型         | 版本    |
|----------|---------------------|-------------------|--------|
| `options` | `ma-pro-table` 参数设置 | `MaProTableOptions`   | 1.0.0 |
| `schema`  | `ma-pro-table` 架构配置 | `MaProTableSchema` | 1.0.0 |

### MaProTableOptions
| 参数                     | 说明                                        | 类型                                  | 默认值    | 版本    |
|------------------------|-------------------------------------------|-------------------------------------|--------|-------|
| `tableOptions`         | `ma-table` 参数                             | `MaTableOptions`                    | -      | 1.0.0 |
| `searchOptions`        | `ma-search` 参数                            | `MaSearchOptions`                   | -      | 1.0.0 |
| `searchFormOptions`    | `ma-form` 参数                              | `MaFormOptions`                     | -      | 1.0.0 |
| -                      | -                                         | -                                   | -      | -     |
| `id`                   | 当前id，全局唯一，不指定则随机生成一个                      | `string`                            | -      | 1.0.0 |
| `adaptionOffsetBottom` | 距离底部偏移量                                   | `number`                            | 0      | 1.0.0 |
| `actionBtnPosition`    | 动作按钮放置位置，自动模式下，如果开启标题栏，则显示在标题栏，否则显示在表格左上方 | `auto, header, table`               | `auto` | 1.0.0 |
| `header`               | 头部配置                                      | 查看 [参数配置](#headerconfig)            | -      | 1.0.0 |
| `toolbar`              | 工具栏是否显示                                   | `boolean, (() => boolean)`          | `true` | 1.0.0 |
| `rowContextMenu`       | 右键配置                                      | 查看 [参数配置](#rowcontextmenu)          | -      | 1.0.0 |
| `requestOptions`       | 列表网络请求配置                                  | 查看 [参数配置](#requestoptions)          | -      | 1.0.0 |
| `onSearchSubmit`       | 搜索提交事件                                    | `(form: Record<string, any>) => void` | -      | 1.0.0 |
| `onSearchReset`        | 搜索重置事件                                    | `(form: Record<string, any>) => void`          | -      | 1.0.0 |


#### HeaderConfig
| 参数   | 说明           | 类型                         | 默认值     | 版本    |
|------|--------------|----------------------------|---------|-------|
| `show` | 是否显示头部  | `boolean, (() => boolean)` | `true`  | 1.0.0 |
| `mainTitle` | 主标题  | `string, (() => string)`   | `表格主标题` | 1.0.0 |
| `subTitle` | 子标题  | `string, (() => string)`                   | -       | 1.0.0 |

#### rowContextMenu
| 参数                | 说明        | 类型                                                                                 | 默认值     | 版本    |
|-------------------|-----------|------------------------------------------------------------------------------------|---------|-------|
| `enabled`         | 是否开启行右键菜单 | `boolean`                                                                          | `false` | 1.0.0 |
| `items`           | 右键菜单列表    | `ContextMenuItem[]`                                                                | -       | 1.0.0 |
| -                 | -         | -                                                                                  | -      | -     |
| `ContextMenuItem` | 说明        | 菜单列表配置说明                                                                           | -      | -     |
| `label`           | 菜单显示文案    | `string, (() => string)`                                                           | -       | 1.0.0 |
| `icon`            | 菜单显示图标    | `string, (() => string)`                                                           | -       | 1.0.0 |
| `disabled`        | 是否禁用      | `boolean`                                                                          | -       | 1.0.0 |
| `divided`         | 是否显示分割线   | `boolean`                                                                          | -       | 1.0.0 |
| `onMenuClick`     | 菜单项点击事件   | `(data: { row: any, column: any, proxy: MaProTableExpose }, event: Event) => void` | -       | 1.0.0 |

#### requestOptions
| 参数                    | 说明                    | 类型                                                        | 默认值                                                    | 版本    |
|-----------------------|-----------------------|-----------------------------------------------------------|--------------------------------------------------------|-------|
| `api`                 | 请求 api 方法             | `(...args: any[]) => any`                                 | -                                                      | 1.0.0 |
| `autoRequest`         | 是否自动请求                | `boolean`                                                 | `true`                                                 | 1.0.0 |
| `response`            | 响应返回结构配置              | `{ totalKey?: string, dataKey?: string }`                 | `{ totalKey: 'total', dataKey: 'list'}`                | 1.0.0 |
| `requestPage`         | 请求分页配置                | `{ pageName?: string, sizeName?: string, size?: number }` | `{ pageName: 'page', sizeName: 'pageSize', size: 10 }` | 1.0.0 |
| `requestParams`       | 默认请求参数                | `Object`                                                  | -                                                      | 1.0.0 |
| `responseDataHandler` | 响应后数据处理，注意：`要把表格数据返回回去` | `(response: Record<string, any>) => any[]`                | -                                                      | 1.0.0 |
| `on`                  | 事件列表 | `Record<string, (...args: any[]) => any>`                 | -                                                      | 1.0.0 |


### MaProTableSchema
| 参数   | 说明       | 类型                                                | 默认值 | 版本    |
|------|----------|---------------------------------------------------|-----|-------|
|`searchItems`| 搜索项列表配置  | `MaSearchItem[]` [配置项](ma-search#searchitems) | -   | 1.0.0 |
|`tableColumns`| 表格列表配置 | `MaProTableColumns[]`                             | -   | 1.0.0 |

#### MaProTableColumns
::: tip
继承于 `el-table-columns` 和 `ma-table` 的 [扩展columns配置](ma-table#columnextraprops) ，以下是扩展参数
:::
| 参数   | 说明                         | 类型                                                 | 默认值 | 版本    |
|------|----------------------------|----------------------------------------------------|-----|-------|
|`type`| `el-table` 原生基础上，增加 `operation`, `sort`，第一个为操作栏，可通过 `API 扩展`，第二个为`行拖动排序` | `string` | -   | 1.0.0 |
|`cellRenderTo`| 渲染单元格为表格注册的插件                     | [查看下方类型](#cellrenderto-使用渲染插件)    | -   | 1.0.0 |
|`operationConfigure`| 操作栏配置，只有 `type` 为 `operation` 生效  | [查看下方类型](#operationconfigure-操作栏)    | -   | 1.0.0 |

##### cellRenderTo 使用渲染插件
::: info 
`ma-pro-table` 单元格渲染插件，得先必须注册了插件后才可使用。
:::
| 参数      | 说明        | 类型           | 默认值 | 版本    |
|---------|-----------|--------------|-----|-------|
| `name`  | 单元格渲染插件名  | `string`     | -   | 1.0.0 |
| `props` | 插件所需的额外参数 | `any, any[]` | -   | 1.0.0 |

##### operationConfigure 操作栏
::: info 
`操作栏` 只能通过 `api` 来设置操作项，如果觉着麻烦，可自己在 `columns` 增加一个普通列，自己使用插槽来实现。
:::
| 参数      | 说明        | 类型           | 默认值 | 版本    |
|---------|-----------|--------------|-----|-------|
| `type`  | 显示方式，下拉菜单：`dropdown`, 平铺：`tile`  | `string`     | `dropdown`   | 1.0.0 |
| `actions` | 操作栏配置列表 | `OperationAction[]` | -   | 1.0.0 |

###### OperationAction 操作栏列表配置
| 参数         | 说明                        | 类型                                                             | 默认值 | 版本    |
|------------|---------------------------|----------------------------------------------------------------|-----|-------|
| `name`     | 操作标识                      | `string`                                                       | -  | 1.0.0 |
| `text`     | 文本配置                      | `string, ((data: TableColumnRenderer) => string)`              | -  | 1.0.0 |
| `icon`     | 图标配置，内部用 `ma-svg-icon` 渲染 | `string, ((data: TableColumnRenderer) => string)`              | -  | 1.0.0 |
| `order`    | 排序，越小越靠前                  | `number`                                                       | -   | 1.0.0 |
| `disabled` | 是否禁用                      | `((data: TableColumnRenderer) => boolean)`                     | -   | 1.0.0 |
| `show`     | 是否显示                      | `((data: TableColumnRenderer) => boolean)`                     | -   | 1.0.0 |
| `onClick`  | 点击事件                      | `(data: TableColumnRenderer, proxy: MaProTableExpose) => void` | -   | 1.0.0 |
| `linkProps`  | `el-link` 的 `props` 参数      | [LinkProps 文档](https://element-plus.org/zh-CN/component/link.html#attributes)                                               | -   | 1.0.0 |

## Event

| 名称              | 说明      | 参数                                                         |
|-----------------|---------|------------------------------------------------------------|
| `row-drag-sort` | 拖动行排序事件 | `(tableData: any[]) => void`                               |
| `search-submit` | 搜索提交事件  | `(form: Record<string, any>) => Record<string, any>, void` |
| `search-reset`  | 搜索重置事件  | `(form: Record<string, any>) => Record<string, any>, void`                              |

## Slot

| 名称                                             | 说明                                                      | 参数 |
|------------------------------------------------|---------------------------------------------------------|----|
| `default`                                      | 默认插槽及 `el-table` 原生插槽                                   | -  |
| `empty`                                        | 原生插槽，空数据时显示                                             | -  |
| `append`                                       | 原生插槽，表格最后一行                                             | -  |
| `pageLeft`                                     | 分页那行左边区域插槽                                              |    |
| `column-[prop]`                                | 表格列插槽，`prop` 为字段名                                       |  scope  |
| `header-[prop]`                                | 表格头插槽，`prop` 为字段名                                       |  scope  |
| `middle`                                       | 表格与搜索栏中间区域插槽                                            | -  |
| `tableHeader`                                  | `header` 整个区域插槽                                         | -  |
| `headerTitle`                                  | `header` 标题区域插槽                                         | -  |
| `headerRight`                                  | `header` 右侧区域插槽                                         | -  |
| `toolbarLeft`                                  | `toolbar` 左侧区域插槽                                        | -  |
| `toolbar`                                      | `toolbar` 工具栏列表插槽，不建议使用，推荐[API扩展](#toolbarplugin-工具栏插件) | -  |
| `beforeToolbar`                                | `toolbar` 工具栏列表前置插槽                                     | -  |
| `afterToolbar`                                 | `toolbar` 工具栏列表后置插槽                                     | -  |
| `tableTop`                                     | `table` 容器内顶部插槽，位于工具栏上方                                 | -  |
| `tableCranny`         |  `table` 容器内表格与工具栏中间缝隙插槽                                | -  |
| `search`                                       | 搜索组件插槽，使用后，搜索项配置失效                                      | -  |
| `searchActions`                                | 搜索 `操作按钮` 内容插槽                                          | -  |
| `searchBeforeActions`                          | 搜索 `操作按钮` 前置内容插槽                                        | -  |
| `searchAfterActions`                           | 搜索 `操作按钮` 后置内容插槽                                        | -  |
| `searchAfterActions`                           | 搜索 `操作按钮` 后置内容插槽                                        | -  |

## Expose
| 名称                     | 说明                    | 参数                                                              | 返回值                   |
|------------------------|-----------------------|-----------------------------------------------------------------|-----------------------|
| `getSearchRef()`       | 获取 `ma-search` 的Ref   | -                                                               | `MaSearchExpose`      |
| `getTableRef()`        | 获取 `ma-table` 的Ref    | -                                                               | `MaTableExpose`       |
| `setTableColumns()`    | 设置表格列                 | `(cols: MaProTableColumns[]) => void`                           | `void`                |
| `getTableColumns()`    | 获取表格列                 | `() => MaProTableColumns[]`                                     | `MaProTableColumns[]`                |
| `refresh()`            | 刷新表格数据                | `() => Promise<void>`                                           | `Promise<void>`       |
| `requestData()`        | 请求表格数据                | `() => Promise<void>`                                           | `Promise<void>`       |
| `changeApi()`          | 变更请求api               | `( api: () => any, isRequestNow: boolean ) => void`             | `void`                |
| `setRequestParams()`   | 设置请求参数                | `( params: Record<string, any>, isRequestNow: boolean) => void` | `void`                |
| `setSearchForm()`      | 设置搜索表单默认值             | `(form: Record<string, any>) => void`                           | `void`                |
| `getSearchForm()`      | 获取搜索表单数据              | `() => Record<string, any>`                                     | `Record<string, any>` |
| `setProTableOptions()` | 设置 `ma-pro-table` 的参数 | `(opts: MaProTableOptions) => void`                             | `void`                |
| `getProTableOptions()` | 获取 `ma-pro-table` 的参数 | `() => MaProTableOptions`                                       | `MaProTableOptions` |
| `resizeHeight()`       | 重置表格高度                | `() => Promise<void>`                                           | `Promise<void>`       |
| `getCurrentId()`       | 获取当前组件ID              | -                                                               | `string`              |**
