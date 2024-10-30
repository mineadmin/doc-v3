# MaTable

基于 `Element plus` 的表格二次封装的 `Table` 组件，支持所有原生表格参数、事件、插槽，同时增强了部分功能，非常好用。

::: tip 说明
由于全部兼容及支持原生 `el-table` 的所有参数、事件、插槽，表格只讲扩展参数。

官方参数请参考 [Element plus](https://element-plus.org/zh-CN/component/table.html) 官方文档。

**注意：演示组件显示语言包不对很正常，项目里不会存在此问题。**
:::

## 使用
<DemoPreview dir="demos/ma-table" />

## Props

| 参数        | 说明                                                  | 类型         | Ele-官网文档                                                                                     | 版本    |
|-----------|-----------------------------------------------------|-------------------|----------------------------------------------------------------------------------------------|-------|
| `options` | `el-table` 参数及[扩展参数](#extraprops)              | `MaTableOptions`   | [表格属性](https://element-plus.org/zh-CN/component/table.html#table-%E5%B1%9E%E6%80%A7)         | 1.0.0 |
| `columns` | `el-table-column` 参数及[扩展参数](#columnextraprops) | `MaTableColumns[]` | [表格列属性](https://element-plus.org/zh-CN/component/table.html#table-column-%E5%B1%9E%E6%80%A7) | 1.0.0 |
| `data`    | 表格数据                                                | `any[]`          | -                                                                                            | 1.0.0 |

### ExtraProps
::: tip 说明
此为 `ma-table` 对 `el-table` 的扩展参数
:::
| 参数        | 说明                                                                    | 类型                                                                                              | 默认值      | 版本    |
|-----------|-----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|----------|-------|
| `containerHeight` | 容器高度                                                                  | `string`                                                                                        | -        | 1.0.0 |
| `loading` | 是否开启加载动画                                                              | `boolean`                                                                                       | `false`  | 1.0.0 |
| `loadingConfig` | 加载动画的相关配置                                                             | [LoadingConfig](#loadingconfig说明)                                                               | -        | 1.0.0 |
| `columnAlign` | 单元格对齐方式                                                               | `left、center、right`                                                                             | `center` | 1.0.0 |
| `headerAlign` | <el-tooltip content="表头对齐方式，若不设置该项，则使用单元格的对齐方式">`鼠标放上查看`</el-tooltip> | `left、center、right`                                                                             | -        | 1.0.0 |
| `showOverflowTooltip` | <el-tooltip content="当内容过长被隐藏时显示 tooltip">`鼠标放上查看`</el-tooltip>       | `boolean`                                                                                       | `false`  | 1.0.0 |
| `adaption` | 是否适应高度                                                                | `boolean`                                                                                       | `false`  | 1.0.0 |
| `adaptionOffsetBottom` | 距离底部偏移量                                                               | `number`                                                                                        | `70`     | 1.0.0 |
| `pagination` | El分页原生属性、事件                                                           | [el-pageination文档](https://element-plus.org/zh-CN/component/pagination.html#%E5%B1%9E%E6%80%A7) | -        | 1.0.0 |
| `on`      | `el-table` 表格事件集合                                                     | <el-tooltip content="Object: { onSelect: (args) => {}, .... }">`鼠标放上查看`</el-tooltip>            | -        | 1.0.0 |


#### LoadingConfig说明
| 参数        | 说明      | 类型   | 默认值 | 版本    |
|-----------|----------|------|-----|-------|
| `text` | 显示在加载图标下方的加载文案   | `string`  | -   | 1.0.0 |
| `spinner` | 自定义加载图标   | `string` | -   | 1.0.0 |
| `svg` | 自定义 `svg` 加载图标   | `string` | -   | 1.0.0 |
| `viewBox` | 加载图标的大小   | `string` | -   | 1.0.0 |
| `background` | 背景遮罩的颜色   | `string` | -   | 1.0.0 |
| `customClass` | 自定义 class 类名   | `string` | -   | 1.0.0 |

### ColumnExtraProps
::: tip 说明
此为 `ma-table` 对 `el-table-column` 的扩展参数
:::

| 参数        | 说明                                                                                | 类型                                  | 默认值     | 版本    |
|-----------|-----------------------------------------------------------------------------------|-------------------------------------|---------|-------|
| `hide` | 是否隐藏列                                                                             | `boolean`                           | `false` | 1.0.0 |
| `children` | 多级表头                                                                              | `MaTableColumns[]`                  | -       | 1.0.0 |
| `cellRender` | <el-tooltip content="自定义单元格渲染器，支持组件、虚拟dom、字符串，支持 jsx 和 tsx">`鼠标放上查看`</el-tooltip> | `(data: TableColumnRenderer) => {}` | -       | 1.0.0 |
| `headerRender` | <el-tooltip content="自定义表头渲染器，支持组件、虚拟dom、字符串，支持 jsx 和 tsx">`鼠标放上查看`</el-tooltip>  | `(data: TableColumnRenderer) => {}` | -       | 1.0.0 |

## Slot

| 名称              | 说明                                     | 参数 |
|-----------------|----------------------------------------|----|
| `empty`         | 原生插槽，空数据时显示                            | -  |
| `append`        | 原生插槽，表格最后一行                            | -  |
| `pageLeft`      | 分页那行左边区域插槽                             |    |
| `column-[prop]` | 表格列插槽，`prop` 为字段名                      |  scope  |
| `header-[prop]` | 表格头插槽，`prop` 为字段名                      |  scope  |

## Event
| 名称              | 说明         | 参数          |
|-----------------|------------|-------------|
| `set-data-callback`  | 设置表格数据后的回调 | `data: any[]` |

## Expose
| 名称                  | 说明                | 参数                   | 返回值                |
|---------------------|-------------------|----------------------|--------------------|
| `setData()`         | 设置表格数据            | `(any[])`            | -                  |
| `setPagination()`   | 设置分页参数            | El原生参数               | -                  |
| `setLoadingState()` | 设置表格 `loading` 状态 | `(boolean)`          | -                  |
| `setOptions()`      | 设置 `ma-table` 配置  | `(MaTableOptions)`   | -                  |
| `getOptions()`      | 获取 `ma-table` 配置  | -                    | `MaTableOptions`   |
| `setColumns()`      | 设置表格列             | `(MaTableColumns[])` | -                  |
| `getColumns()`      | 获取表格列             | -                    | `MaTableColumns[]` |
| `appendColumn()`    | 追加表格列             | `(MaTableColumns)`   | -                  |
| `removeColumn()`    | 移除表格列             | `(prop: string)`     | -                  |
| `getColumnByProp()`    | 按`prop`获取表格列      | `(prop: string)`     | `MaTableColumns`   |
| `getElTableRef()`    | 获取 `el-table` Ref | -                    | `El-Table`         |
