# MaTable

基於 `Element plus` 的表格二次封裝的 `Table` 組件，支持所有原生表格參數、事件、插槽，同時增強了部分功能，非常好用。

::: tip 説明
由於全部兼容及支持原生 `el-table` 的所有參數、事件、插槽，表格只講擴展參數。

官方參數請參考 [Element plus](https://element-plus.org/zh-CN/component/table.html) 官方文檔。

**注意：演示組件顯示語言包不對很正常，項目裏不會存在此問題。**
:::

## 使用
<DemoPreview dir="demos/ma-table" />

## Props

| 參數        | 説明                                                  | 類型         | Ele-官網文檔                                                                                     | 版本    |
|-----------|-----------------------------------------------------|-------------------|----------------------------------------------------------------------------------------------|-------|
| `options` | `el-table` 參數及[擴展參數](#extraprops)              | `MaTableOptions`   | [表格屬性](https://element-plus.org/zh-CN/component/table.html#table-%E5%B1%9E%E6%80%A7)         | 1.0.0 |
| `columns` | `el-table-column` 參數及[擴展參數](#columnextraprops) | `MaTableColumns[]` | [表格列屬性](https://element-plus.org/zh-CN/component/table.html#table-column-%E5%B1%9E%E6%80%A7) | 1.0.0 |
| `data`    | 表格數據                                                | `any[]`          | -                                                                                            | 1.0.0 |

### ExtraProps
::: tip 説明
此為 `ma-table` 對 `el-table` 的擴展參數
:::
| 參數        | 説明                                                                    | 類型                                                                                              | 默認值      | 版本    |
|-----------|-----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|----------|-------|
| `containerHeight` | 容器高度                                                                  | `string`                                                                                        | -        | 1.0.0 |
| `loading` | 是否開啓加載動畫                                                              | `boolean`                                                                                       | `false`  | 1.0.0 |
| `loadingConfig` | 加載動畫的相關配置                                                             | [LoadingConfig](#loadingconfig説明)                                                               | -        | 1.0.0 |
| `columnAlign` | 單元格對齊方式                                                               | `left、center、right`                                                                             | `center` | 1.0.0 |
| `headerAlign` | <el-tooltip content="表頭對齊方式，若不設置該項，則使用單元格的對齊方式">`鼠標放上查看`</el-tooltip> | `left、center、right`                                                                             | -        | 1.0.0 |
| `showOverflowTooltip` | <el-tooltip content="當內容過長被隱藏時顯示 tooltip">`鼠標放上查看`</el-tooltip>       | `boolean`                                                                                       | `false`  | 1.0.0 |
| `adaption` | 是否適應高度                                                                | `boolean`                                                                                       | `false`  | 1.0.0 |
| `adaptionOffsetBottom` | 距離底部偏移量                                                               | `number`                                                                                        | `70`     | 1.0.0 |
| `showPagination` | 是否顯示分頁                                                               | `boolean`                                                                                        | `true`     | 1.0.0 |
| `pagination` | El分頁原生屬性、事件                                                           | [el-pageination文檔](https://element-plus.org/zh-CN/component/pagination.html#%E5%B1%9E%E6%80%A7) | -        | 1.0.0 |
| `on`      | `el-table` 表格事件集合                                                     | <el-tooltip content="Object: { onSelect: (args) => {}, .... }">`鼠標放上查看`</el-tooltip>            | -        | 1.0.0 |


#### LoadingConfig説明
| 參數        | 説明      | 類型   | 默認值 | 版本    |
|-----------|----------|------|-----|-------|
| `text` | 顯示在加載圖標下方的加載文案   | `string`  | -   | 1.0.0 |
| `spinner` | 自定義加載圖標   | `string` | -   | 1.0.0 |
| `svg` | 自定義 `svg` 加載圖標   | `string` | -   | 1.0.0 |
| `viewBox` | 加載圖標的大小   | `string` | -   | 1.0.0 |
| `background` | 背景遮罩的顏色   | `string` | -   | 1.0.0 |
| `customClass` | 自定義 class 類名   | `string` | -   | 1.0.0 |

### ColumnExtraProps
::: tip 説明
此為 `ma-table` 對 `el-table-column` 的擴展參數
:::

| 參數        | 説明                                                                                | 類型                                  | 默認值     | 版本    |
|-----------|-----------------------------------------------------------------------------------|-------------------------------------|---------|-------|
| `hide` | 是否隱藏列                                                                             | `boolean`                           | `false` | 1.0.0 |
| `children` | 多級表頭                                                                              | `MaTableColumns[]`                  | -       | 1.0.0 |
| `cellRender` | <el-tooltip content="自定義單元格渲染器，支持組件、虛擬dom、字符串，支持 jsx 和 tsx">`鼠標放上查看`</el-tooltip> | `(data: TableColumnRenderer) => {}` | -       | 1.0.0 |
| `headerRender` | <el-tooltip content="自定義表頭渲染器，支持組件、虛擬dom、字符串，支持 jsx 和 tsx">`鼠標放上查看`</el-tooltip>  | `(data: TableColumnRenderer) => {}` | -       | 1.0.0 |

## Slot

| 名稱              | 説明                                     | 參數 |
|-----------------|----------------------------------------|----|
| `empty`         | 原生插槽，空數據時顯示                            | -  |
| `append`        | 原生插槽，表格最後一行                            | -  |
| `pageLeft`      | 分頁那行左邊區域插槽                             |    |
| `column-[prop]` | 表格列插槽，`prop` 為字段名                      |  scope  |
| `header-[prop]` | 表格頭插槽，`prop` 為字段名                      |  scope  |

## Event
| 名稱              | 説明         | 參數          |
|-----------------|------------|-------------|
| `set-data-callback`  | 設置表格數據後的回調 | `data: any[]` |

## Expose
| 名稱                  | 説明                | 參數                   | 返回值                |
|---------------------|-------------------|----------------------|--------------------|
| `setData()`         | 設置表格數據            | `(any[])`            | -                  |
| `setPagination()`   | 設置分頁參數            | El原生參數               | -                  |
| `setLoadingState()` | 設置表格 `loading` 狀態 | `(boolean)`          | -                  |
| `setOptions()`      | 設置 `ma-table` 配置  | `(MaTableOptions)`   | -                  |
| `getOptions()`      | 獲取 `ma-table` 配置  | -                    | `MaTableOptions`   |
| `setColumns()`      | 設置表格列             | `(MaTableColumns[])` | -                  |
| `getColumns()`      | 獲取表格列             | -                    | `MaTableColumns[]` |
| `appendColumn()`    | 追加表格列             | `(MaTableColumns)`   | -                  |
| `removeColumn()`    | 移除表格列             | `(prop: string)`     | -                  |
| `getColumnByProp()`    | 按`prop`獲取表格列      | `(prop: string)`     | `MaTableColumns`   |
| `getElTableRef()`    | 獲取 `el-table` Ref | -                    | `El-Table`         |
