# MaTable

基于 `Element plus` 的表格二次封装的 `Table` 组件，支持所有原生表格参数、事件、插槽，同时增强了部分功能，非常好用。

::: tip 说明
由于全部兼容及支持原生 `el-table` 的所有参数、事件、插槽，表格只讲扩展参数。

官方参数请参考 [Element plus](https://element-plus.org/zh-CN/component/table.html) 官方文档。

**注意：演示组件显示语言包不对很正常，项目里不会存在此问题。**
:::

## 基础使用
<DemoPreview dir="demos/ma-table/default" />

## 示例大全

### 基础功能示例
- [基础表格](./ma-table/basic) - 基本的数据展示和配置
- [表格排序](./ma-table/sorting) - 各种排序功能演示
- [表格筛选](./ma-table/filter) - 筛选和搜索功能

### 高级功能示例  
- [自定义渲染](./ma-table/custom-render) - 单元格和表头自定义渲染
- [动态列管理](./ma-table/dynamic-columns) - 动态增删改列
- [分页表格](./ma-table/pagination) - 完整的分页功能

### 特殊场景示例
- [树形表格](./ma-table/tree-table) - 展示层级数据
- [多选表格](./ma-table/selection) - 选择和批量操作
- [响应式表格](./ma-table/responsive) - 自适应高度和响应式布局

## Props

| 参数        | 说明                                                  | 类型         | Ele-官网文档                                                                                     | 版本    |
|-----------|-----------------------------------------------------|-------------------|----------------------------------------------------------------------------------------------|-------|
| `options` | `el-table` 参数及[扩展参数](#extraprops)              | `MaTableOptions`   | [表格属性](https://element-plus.org/zh-CN/component/table.html#table-%E5%B1%9E%E6%80%A7)         | 1.0.0 |
| `columns` | `el-table-column` 参数及[扩展参数](#columnextraprops) | `MaTableColumns[]` | [表格列属性](https://element-plus.org/zh-CN/component/table.html#table-column-%E5%B1%9E%E6%80%A3) | 1.0.0 |

::: tip 类型说明
- `MaTableOptions`: 扩展了 Element Plus 表格所有原生属性，并新增了容器高度、加载状态、对齐方式、自适应高度、分页等配置选项
- `MaTableColumns[]`: 扩展了 Element Plus 表格列所有原生属性，并新增了隐藏列、自定义渲染、多级表头等功能
:::

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
| `showPagination` | 是否显示分页                                                               | `boolean`                                                                                        | `true`     | 1.0.0 |
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

| 名称              | 说明                                     | 参数 | 示例 |
|-----------------|----------------------------------------|----|-----|
| `empty`         | 原生插槽，空数据时显示                            | -  | `#empty` |
| `append`        | 原生插槽，表格最后一行                            | -  | `#append` |
| `pageLeft`      | 分页那行左边区域插槽                             | -  | `#pageLeft` |
| `column-[prop]` | 表格列插槽，`prop` 为字段名                      | `{ row, column, $index }` | `#column-name="{ row }"` |
| `header-[prop]` | 表格头插槽，`prop` 为字段名                      | `{ column, $index }` | `#header-name="{ column }"` |
| `default`       | 默认列内容插槽                              | `{ row, column, $index }` | `#default="{ row }"` |
| `header`        | 默认表头内容插槽                              | `{ column, $index }` | `#header="{ column }"` |
| `filterIcon`    | 自定义筛选图标插槽                              | - | `#filterIcon` |

::: tip 插槽参数说明
- **scope 参数**: `row` 表示当前行数据，`column` 表示当前列配置，`$index` 表示当前行索引
- **动态插槽**: `column-[prop]` 和 `header-[prop]` 中的 `[prop]` 需要替换为实际的字段名
- **分页插槽**: `pageLeft` 插槽可以在分页区域左侧添加自定义内容，如批量操作按钮等
:::

## Event
| 名称              | 说明         | 参数          | 触发时机 |
|-----------------|------------|-------------|---------|
| `set-data-callback`  | 设置表格数据后的回调 | `data: any[]` | 调用 `setData` 方法后触发 |

::: tip 事件说明
除了上述扩展事件，ma-table 还支持所有 Element Plus 表格的原生事件，如 `select`、`select-all`、`selection-change`、`cell-click`、`row-click` 等。
这些事件可以通过 `options.on` 对象进行配置。
:::

## Expose
| 名称                  | 说明                | 参数                   | 返回值                | 使用场景 |
|---------------------|-------------------|----------------------|--------------------|---------| 
| `setData()`         | 设置表格数据            | `data: any[]`        | -                  | 动态更新表格数据 |
| `setPagination()`   | 设置分页参数            | `pagination: PaginationProps` | -     | 更新分页配置 |
| `setLoadingState()` | 设置表格 `loading` 状态 | `loading: boolean`   | -                  | 控制加载状态 |
| `setOptions()`      | 设置 `ma-table` 配置  | `options: MaTableOptions`   | -       | 动态更新表格配置 |
| `getOptions()`      | 获取 `ma-table` 配置  | -                    | `MaTableOptions`   | 获取当前配置 |
| `setColumns()`      | 设置表格列             | `columns: MaTableColumns[]` | -       | 重新设置所有列 |
| `getColumns()`      | 获取表格列             | -                    | `MaTableColumns[]` | 获取当前列配置 |
| `appendColumn()`    | 追加表格列             | `column: MaTableColumns`   | -        | 动态添加新列 |
| `removeColumn()`    | 移除表格列             | `prop: string`       | -                  | 动态删除指定列 |
| `getColumnByProp()` | 按`prop`获取表格列      | `prop: string`       | `MaTableColumns`   | 获取指定列配置 |
| `getElTableRef()`   | 获取 `el-table` Ref | -                    | `Ref<ElTable>`     | 访问原生表格方法 |

::: tip Expose 方法说明
- **数据方法**: `setData`、`setPagination`、`setLoadingState` 用于动态更新表格状态
- **配置方法**: `setOptions`、`getOptions` 用于动态修改表格配置
- **列管理方法**: `setColumns`、`getColumns`、`appendColumn`、`removeColumn`、`getColumnByProp` 提供完整的列管理功能
- **原生访问**: `getElTableRef` 可以获取到原生 Element Plus 表格实例，调用所有原生方法
:::

## 完整类型定义

### MaTableOptions 接口
```typescript
interface MaTableOptions {
  // 容器和加载
  containerHeight?: string
  loading?: boolean
  loadingConfig?: LoadingConfig
  
  // 对齐方式
  columnAlign?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  
  // 显示选项
  showOverflowTooltip?: boolean
  pagination?: PaginationProps
  
  // 自适应高度
  adaption?: boolean
  adaptionOffsetBottom?: number
  showPagination?: boolean
  
  // Element Plus 原生属性
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
  // ... 更多 Element Plus 属性
  
  // 事件处理
  on?: {
    [eventName: string]: (...args: any[]) => void
  }
}
```

### MaTableColumns 接口
```typescript
interface MaTableColumns {
  // 扩展属性
  hide?: boolean | ((column: MaTableColumns) => boolean)
  children?: MaTableColumns[]
  cellRender?: (data: TableColumnRenderer) => VNode | string
  headerRender?: (data: TableColumnRenderer) => VNode | string
  
  // Element Plus 原生属性
  label?: string
  prop?: string
  type?: 'selection' | 'index' | 'expand'
  width?: string | number
  minWidth?: string | number
  fixed?: boolean | 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  sortable?: boolean | 'custom'
  // ... 更多 Element Plus 列属性
}
```

### TableColumnRenderer 接口
```typescript
interface TableColumnRenderer {
  row: any          // 当前行数据
  column: TableColumn   // 当前列配置
  $index: number    // 当前行索引
  options: TableColumn  // 列选项
  attrs: any        // 其他属性
}
```
