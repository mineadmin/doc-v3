# MaTable

基於 `Element plus` 的表格二次封裝的 `Table` 元件，支援所有原生表格引數、事件、插槽，同時增強了部分功能，非常好用。

::: tip 說明
由於全部相容及支援原生 `el-table` 的所有引數、事件、插槽，表格只講擴充套件引數。

官方引數請參考 [Element plus](https://element-plus.org/zh-CN/component/table.html) 官方文件。

**注意：演示元件顯示語言包不對很正常，專案裡不會存在此問題。**
:::

## 使用
<DemoPreview dir="demos/ma-table" />

## Props

| 引數        | 說明                                                  | 型別         | Ele-官網文件                                                                                     | 版本    |
|-----------|-----------------------------------------------------|-------------------|----------------------------------------------------------------------------------------------|-------|
| `options` | `el-table` 引數及[擴充套件引數](#extraprops)              | `MaTableOptions`   | [表格屬性](https://element-plus.org/zh-CN/component/table.html#table-%E5%B1%9E%E6%80%A7)         | 1.0.0 |
| `columns` | `el-table-column` 引數及[擴充套件引數](#columnextraprops) | `MaTableColumns[]` | [表格列屬性](https://element-plus.org/zh-CN/component/table.html#table-column-%E5%B1%9E%E6%80%A7) | 1.0.0 |
| `data`    | 表格資料                                                | `any[]`          | -                                                                                            | 1.0.0 |

### ExtraProps
::: tip 說明
此為 `ma-table` 對 `el-table` 的擴充套件引數
:::
| 引數        | 說明                                                                    | 型別                                                                                              | 預設值      | 版本    |
|-----------|-----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|----------|-------|
| `containerHeight` | 容器高度                                                                  | `string`                                                                                        | -        | 1.0.0 |
| `loading` | 是否開啟載入動畫                                                              | `boolean`                                                                                       | `false`  | 1.0.0 |
| `loadingConfig` | 載入動畫的相關配置                                                             | [LoadingConfig](#loadingconfig說明)                                                               | -        | 1.0.0 |
| `columnAlign` | 單元格對齊方式                                                               | `left、center、right`                                                                             | `center` | 1.0.0 |
| `headerAlign` | <el-tooltip content="表頭對齊方式，若不設定該項，則使用單元格的對齊方式">`滑鼠放上檢視`</el-tooltip> | `left、center、right`                                                                             | -        | 1.0.0 |
| `showOverflowTooltip` | <el-tooltip content="當內容過長被隱藏時顯示 tooltip">`滑鼠放上檢視`</el-tooltip>       | `boolean`                                                                                       | `false`  | 1.0.0 |
| `adaption` | 是否適應高度                                                                | `boolean`                                                                                       | `false`  | 1.0.0 |
| `adaptionOffsetBottom` | 距離底部偏移量                                                               | `number`                                                                                        | `70`     | 1.0.0 |
| `showPagination` | 是否顯示分頁                                                               | `boolean`                                                                                        | `true`     | 1.0.0 |
| `pagination` | El分頁原生屬性、事件                                                           | [el-pageination文件](https://element-plus.org/zh-CN/component/pagination.html#%E5%B1%9E%E6%80%A7) | -        | 1.0.0 |
| `on`      | `el-table` 表格事件集合                                                     | <el-tooltip content="Object: { onSelect: (args) => {}, .... }">`滑鼠放上檢視`</el-tooltip>            | -        | 1.0.0 |


#### LoadingConfig說明
| 引數        | 說明      | 型別   | 預設值 | 版本    |
|-----------|----------|------|-----|-------|
| `text` | 顯示在載入圖示下方的載入文案   | `string`  | -   | 1.0.0 |
| `spinner` | 自定義載入圖示   | `string` | -   | 1.0.0 |
| `svg` | 自定義 `svg` 載入圖示   | `string` | -   | 1.0.0 |
| `viewBox` | 載入圖示的大小   | `string` | -   | 1.0.0 |
| `background` | 背景遮罩的顏色   | `string` | -   | 1.0.0 |
| `customClass` | 自定義 class 類名   | `string` | -   | 1.0.0 |

### ColumnExtraProps
::: tip 說明
此為 `ma-table` 對 `el-table-column` 的擴充套件引數
:::

| 引數        | 說明                                                                                | 型別                                  | 預設值     | 版本    |
|-----------|-----------------------------------------------------------------------------------|-------------------------------------|---------|-------|
| `hide` | 是否隱藏列                                                                             | `boolean`                           | `false` | 1.0.0 |
| `children` | 多級表頭                                                                              | `MaTableColumns[]`                  | -       | 1.0.0 |
| `cellRender` | <el-tooltip content="自定義單元格渲染器，支援元件、虛擬dom、字串，支援 jsx 和 tsx">`滑鼠放上檢視`</el-tooltip> | `(data: TableColumnRenderer) => {}` | -       | 1.0.0 |
| `headerRender` | <el-tooltip content="自定義表頭渲染器，支援元件、虛擬dom、字串，支援 jsx 和 tsx">`滑鼠放上檢視`</el-tooltip>  | `(data: TableColumnRenderer) => {}` | -       | 1.0.0 |

## Slot

| 名稱              | 說明                                     | 引數 |
|-----------------|----------------------------------------|----|
| `empty`         | 原生插槽，空資料時顯示                            | -  |
| `append`        | 原生插槽，表格最後一行                            | -  |
| `pageLeft`      | 分頁那行左邊區域插槽                             |    |
| `column-[prop]` | 表格列插槽，`prop` 為欄位名                      |  scope  |
| `header-[prop]` | 表格頭插槽，`prop` 為欄位名                      |  scope  |

## Event
| 名稱              | 說明         | 引數          |
|-----------------|------------|-------------|
| `set-data-callback`  | 設定表格資料後的回撥 | `data: any[]` |

## Expose
| 名稱                  | 說明                | 引數                   | 返回值                |
|---------------------|-------------------|----------------------|--------------------|
| `setData()`         | 設定表格資料            | `(any[])`            | -                  |
| `setPagination()`   | 設定分頁引數            | El原生引數               | -                  |
| `setLoadingState()` | 設定表格 `loading` 狀態 | `(boolean)`          | -                  |
| `setOptions()`      | 設定 `ma-table` 配置  | `(MaTableOptions)`   | -                  |
| `getOptions()`      | 獲取 `ma-table` 配置  | -                    | `MaTableOptions`   |
| `setColumns()`      | 設定表格列             | `(MaTableColumns[])` | -                  |
| `getColumns()`      | 獲取表格列             | -                    | `MaTableColumns[]` |
| `appendColumn()`    | 追加表格列             | `(MaTableColumns)`   | -                  |
| `removeColumn()`    | 移除表格列             | `(prop: string)`     | -                  |
| `getColumnByProp()`    | 按`prop`獲取表格列      | `(prop: string)`     | `MaTableColumns`   |
| `getElTableRef()`    | 獲取 `el-table` Ref | -                    | `El-Table`         |
