# MaProTable
`ma-pro-table` 基于 `ma-search` 和 `ma-table` 两个组件封装而来，用于快速构建一个完整的 `CRUD` 功能，增加摸鱼的时间。

:::tip 提示
系统内自带的 **用户、角色管理** 都是 `ma-pro-table` CRUD的最佳实践，文档和实际案例参考，才能快速掌握这个组件。
:::

## 使用
<DemoPreview dir="demos/ma-pro-table" />

## cellRenderTo 单元格渲染插件


## ToolbarPlugin 工具栏插件


## Props
| 参数       | 说明                  | 类型         | 版本    |
|----------|---------------------|-------------------|--------|
| `options` | `ma-pro-table` 参数设置 | `MaProTableOptions`   | 1.0.0 |
| `schema`  | `ma-pro-table` 架构配置 | `MaProTableSchema` | 1.0.0 |

### MaProTableOptions
| 参数                  | 说明                                        | 类型                         | 默认值    | 版本    |
|---------------------|-------------------------------------------|----------------------------|--------|-------|
| `tableOptions`      | `ma-table` 参数                             | `MaTableOptions`           | -      | 1.0.0 |
| `searchOptions`     | `ma-search` 参数                            | `MaSearchOptions`          | -      | 1.0.0 |
| `searchFormOptions` | `ma-form` 参数                              | `MaFormOptions`            | -      | 1.0.0 |
| ------------------  | --------------------         | -----------------          | -      | -     |
| `id`                | 当前id，全局唯一，不指定则随机生成一个                      | `string`                   | -      | 1.0.0 |
| `adaptionOffsetBottom`  | 距离底部偏移量                                   | `number`                   | 0      | 1.0.0 |
| `actionBtnPosition`  | 动作按钮放置位置，自动模式下，如果开启标题栏，则显示在标题栏，否则显示在表格左上方 | `auto, header, table`      | `auto` | 1.0.0 |
| `header`  | 头部配置                                      | 查看 [参数配置](#headerconfig)   | -      | 1.0.0 |
| `toolbar`  | 工具栏是否显示                                   | `boolean, (() => boolean)` | `true` | 1.0.0 |
| `rowContextMenu`  | 右键配置                                      | 查看 [参数配置](#rowcontextmenu) | -      | 1.0.0 |
| `requestOptions`  | 列表网络请求配置                                  | 查看 [参数配置](#requestoptions) | -      | 1.0.0 |


#### HeaderConfig
| 参数   | 说明           | 类型                         | 默认值     | 版本    |
|------|--------------|----------------------------|---------|-------|
| `show` | 是否显示头部  | `boolean, (() => boolean)` | `true`  | 1.0.0 |
| `mainTitle` | 主标题  | `string, (() => string)`   | `表格主标题` | 1.0.0 |
| `subTitle` | 子标题  | `string, (() => string)`                   | -       | 1.0.0 |

#### rowContextMenu
| 参数                   | 说明                     | 类型                       | 默认值     | 版本    |
|----------------------|------------------------|--------------------------|---------|-------|
| `enabled`            | 是否开启行右键菜单              | `boolean`                | `false` | 1.0.0 |
| `items`              | 右键菜单列表                 | `ContextMenuItem[]`      | -       | 1.0.0 |
| -------------        | ----- | ----------               | -      | -     |
| `ContextMenuItem`  | 说明                     | 菜单列表配置说明                        | -      | -     |
| `label`              | 菜单显示文案                 | `string, (() => string)` | -       | 1.0.0 |
| `icon`              | 菜单显示图标                 | `string, (() => string)` | -       | 1.0.0 |
| `disabled`              | 是否禁用                   | `boolean`                | -       | 1.0.0 |
| `divided`              | 是否显示分割线                | `boolean`                | -       | 1.0.0 |
| `onMenuClick`              | 菜单项点击事件                | `(data: { row: any, column: any, proxy: MaProTableExpose }, event: Event) => void`                | -       | 1.0.0 |

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
| 参数   | 说明           | 类型       | 默认值 | 版本    |
|------|--------------|----------|-----|-------|


## Event

| 名称              | 说明       | 参数                           |
|-----------------|----------|------------------------------|
| `row-drag-sort`  | 拖动行排序事件  | `(tableData: any[]) => void` |

## Slot

| 名称              | 说明                                                       | 参数 |
|-----------------|----------------------------------------------------------|----|
| `default`       | 默认插槽及 `el-table` 原生插槽    | -  |
| `empty`         | 原生插槽，空数据时显示                            | -  |
| `append`        | 原生插槽，表格最后一行                            | -  |
| `pageLeft`      | 分页那行左边区域插槽                             |    |
| `column-[prop]` | 表格列插槽，`prop` 为字段名                      |  scope  |
| `header-[prop]` | 表格头插槽，`prop` 为字段名                      |  scope  |
| `middle`        | 表格与搜索栏中间区域插槽                                             | -  |
| `tableHeader`        | `header` 整个区域插槽                                          | -  |
| `headerTitle`        | `header` 标题区域插槽                                          | -  |
| `headerRight`        | `header` 右侧区域插槽                                          | -  |
| `toolbarLeft`        | `toolbar` 左侧区域插槽                                         | -  |
| `toolbar`        | `toolbar` 工具栏列表插槽，不建议使用，推荐[API扩展](#toolbarplugin-工具栏插件) | -  |
| `beforeToolbar`        | `toolbar` 工具栏列表前置插槽                                      | -  |
| `afterToolbar`        | `toolbar` 工具栏列表后置插槽                                      | -  |
| `search`        | 搜索组件插槽，使用后，搜索项配置失效                                       | -  |
| `searchActions`        | 搜索 `操作按钮` 内容插槽                                           | -  |
| `searchBeforeActions`        | 搜索 `操作按钮` 前置内容插槽                                         | -  |
| `searchAfterActions`        | 搜索 `操作按钮` 后置内容插槽                                         | -  |
| `searchAfterActions`        | 搜索 `操作按钮` 后置内容插槽                                         | -  |

## Expose
| 名称                | 说明                    | 参数                                                              | 返回值                   |
|-------------------|-----------------------|-----------------------------------------------------------------|-----------------------|
| `getSearchRef()`  | 获取 `ma-search` 的Ref   | -                                                               | `MaSearchExpose`      |
| `getTableRef()`  | 获取 `ma-table` 的Ref    | -                                                               | `MaTableExpose`       |
| `refresh()`  | 刷新表格数据                | `() => Promise<void>`                                           | `Promise<void>`       |
| `requestData()`  | 请求表格数据                | `() => Promise<void>`                                           | `Promise<void>`       |
| `changeApi()`  | 变更请求api               | `( api: () => any, isRequestNow: boolean ) => void`             | `void`                |
| `setRequestParams()`  | 设置请求参数                | `( params: Record<string, any>, isRequestNow: boolean) => void` | `void`                |
| `setSearchForm()`    | 设置搜索表单默认值             | `(form: Record<string, any>) => void`                           | `void`                |
| `getSearchForm()`    | 获取搜索表单数据              | `() => Record<string, any>`                                     | `Record<string, any>`                |
| `getProTableOptions()`    | 获取 `ma-pro-table` 的参数 | `() => Record<string, any>`                                     | `Record<string, any>`                |
| `resizeHeight()`    | 重置表格高度                | `() => Promise<void>`                                           | `Promise<void>`                |
| `getCurrentId()`    | 获取当前组件ID              | -                                                               | `string`                |
