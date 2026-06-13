# MaTable

基於 `Element plus` 的表格二次封裝的 `Table` 元件，支援所有原生表格引數、事件、插槽，同時增強了部分功能，非常好用。

::: tip 說明
由於全部相容及支援原生 `el-table` 的所有引數、事件、插槽，表格只講擴充套件引數。

官方引數請參考 [Element plus](https://element-plus.org/zh-CN/component/table.html) 官方文件。

**注意：演示元件顯示語言包不對很正常，專案裡不會存在此問題。**
:::

## 基礎使用
<DemoPreview dir="demos/ma-table/default" />

## 示例大全

### 基礎功能示例
- [基礎表格](./ma-table/basic) - 基本的資料展示和配置
- [表格排序](./ma-table/sorting) - 各種排序功能演示
- [表格篩選](./ma-table/filter) - 篩選和搜尋功能

### 高階功能示例  
- [自定義渲染](./ma-table/custom-render) - 單元格和表頭自定義渲染
- [動態列管理](./ma-table/dynamic-columns) - 動態增刪改列
- [分頁表格](./ma-table/pagination) - 完整的分頁功能

### 特殊場景示例
- [樹形表格](./ma-table/tree-table) - 展示層級資料
- [多選表格](./ma-table/selection) - 選擇和批次操作
- [響應式表格](./ma-table/responsive) - 自適應高度和響應式佈局

## Props

| 引數        | 說明                                                  | 型別         | Ele-官網文件                                                                                     | 版本    |
|-----------|-----------------------------------------------------|-------------------|----------------------------------------------------------------------------------------------|-------|
| `options` | `el-table` 引數及[擴充套件引數](#extraprops)              | `MaTableOptions`   | [表格屬性](https://element-plus.org/zh-CN/component/table.html#table-%E5%B1%9E%E6%80%A7)         | 1.0.0 |
| `columns` | `el-table-column` 引數及[擴充套件引數](#columnextraprops) | `MaTableColumns[]` | [表格列屬性](https://element-plus.org/zh-CN/component/table.html#table-column-%E5%B1%9E%E6%80%A3) | 1.0.0 |

::: tip 型別說明
- `MaTableOptions`: 擴充套件了 Element Plus 表格所有原生屬性，並新增了容器高度、載入狀態、對齊方式、自適應高度、分頁等配置選項
- `MaTableColumns[]`: 擴充套件了 Element Plus 表格列所有原生屬性，並新增了隱藏列、自定義渲染、多級表頭等功能
:::

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

| 名稱              | 說明                                     | 引數 | 示例 |
|-----------------|----------------------------------------|----|-----|
| `empty`         | 原生插槽，空資料時顯示                            | -  | `#empty` |
| `append`        | 原生插槽，表格最後一行                            | -  | `#append` |
| `pageLeft`      | 分頁那行左邊區域插槽                             | -  | `#pageLeft` |
| `column-[prop]` | 表格列插槽，`prop` 為欄位名                      | `{ row, column, $index }` | `#column-name="{ row }"` |
| `header-[prop]` | 表格頭插槽，`prop` 為欄位名                      | `{ column, $index }` | `#header-name="{ column }"` |
| `default`       | 預設列內容插槽                              | `{ row, column, $index }` | `#default="{ row }"` |
| `header`        | 預設表頭內容插槽                              | `{ column, $index }` | `#header="{ column }"` |
| `filterIcon`    | 自定義篩選圖示插槽                              | - | `#filterIcon` |

::: tip 插槽引數說明
- **scope 引數**: `row` 表示當前行資料，`column` 表示當前列配置，`$index` 表示當前行索引
- **動態插槽**: `column-[prop]` 和 `header-[prop]` 中的 `[prop]` 需要替換為實際的欄位名
- **分頁插槽**: `pageLeft` 插槽可以在分頁區域左側新增自定義內容，如批次操作按鈕等
:::

## Event
| 名稱              | 說明         | 引數          | 觸發時機 |
|-----------------|------------|-------------|---------|
| `set-data-callback`  | 設定表格資料後的回撥 | `data: any[]` | 呼叫 `setData` 方法後觸發 |

::: tip 事件說明
除了上述擴充套件事件，ma-table 還支援所有 Element Plus 表格的原生事件，如 `select`、`select-all`、`selection-change`、`cell-click`、`row-click` 等。
這些事件可以透過 `options.on` 物件進行配置。
:::

## Expose
| 名稱                  | 說明                | 引數                   | 返回值                | 使用場景 |
|---------------------|-------------------|----------------------|--------------------|---------| 
| `setData()`         | 設定表格資料            | `data: any[]`        | -                  | 動態更新表格資料 |
| `setPagination()`   | 設定分頁引數            | `pagination: PaginationProps` | -     | 更新分頁配置 |
| `setLoadingState()` | 設定表格 `loading` 狀態 | `loading: boolean`   | -                  | 控制載入狀態 |
| `setOptions()`      | 設定 `ma-table` 配置  | `options: MaTableOptions`   | -       | 動態更新表格配置 |
| `getOptions()`      | 獲取 `ma-table` 配置  | -                    | `MaTableOptions`   | 獲取當前配置 |
| `setColumns()`      | 設定表格列             | `columns: MaTableColumns[]` | -       | 重新設定所有列 |
| `getColumns()`      | 獲取表格列             | -                    | `MaTableColumns[]` | 獲取當前列配置 |
| `appendColumn()`    | 追加表格列             | `column: MaTableColumns`   | -        | 動態新增新列 |
| `removeColumn()`    | 移除表格列             | `prop: string`       | -                  | 動態刪除指定列 |
| `getColumnByProp()` | 按`prop`獲取表格列      | `prop: string`       | `MaTableColumns`   | 獲取指定列配置 |
| `getElTableRef()`   | 獲取 `el-table` Ref | -                    | `Ref<ElTable>`     | 訪問原生表格方法 |

::: tip Expose 方法說明
- **資料方法**: `setData`、`setPagination`、`setLoadingState` 用於動態更新表格狀態
- **配置方法**: `setOptions`、`getOptions` 用於動態修改表格配置
- **列管理方法**: `setColumns`、`getColumns`、`appendColumn`、`removeColumn`、`getColumnByProp` 提供完整的列管理功能
- **原生訪問**: `getElTableRef` 可以獲取到原生 Element Plus 表格例項，呼叫所有原生方法
:::

## 完整型別定義

### MaTableOptions 介面
```typescript
interface MaTableOptions {
  // 容器和載入
  containerHeight?: string
  loading?: boolean
  loadingConfig?: LoadingConfig
  
  // 對齊方式
  columnAlign?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  
  // 顯示選項
  showOverflowTooltip?: boolean
  pagination?: PaginationProps
  
  // 自適應高度
  adaption?: boolean
  adaptionOffsetBottom?: number
  showPagination?: boolean
  
  // Element Plus 原生屬性
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
  // ... 更多 Element Plus 屬性
  
  // 事件處理
  on?: {
    [eventName: string]: (...args: any[]) => void
  }
}
```

### MaTableColumns 介面
```typescript
interface MaTableColumns {
  // 擴充套件屬性
  hide?: boolean | ((column: MaTableColumns) => boolean)
  children?: MaTableColumns[]
  cellRender?: (data: TableColumnRenderer) => VNode | string
  headerRender?: (data: TableColumnRenderer) => VNode | string
  
  // Element Plus 原生屬性
  label?: string
  prop?: string
  type?: 'selection' | 'index' | 'expand'
  width?: string | number
  minWidth?: string | number
  fixed?: boolean | 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  sortable?: boolean | 'custom'
  // ... 更多 Element Plus 列屬性
}
```

### TableColumnRenderer 介面
```typescript
interface TableColumnRenderer {
  row: any          // 當前行資料
  column: TableColumn   // 當前列配置
  $index: number    // 當前行索引
  options: TableColumn  // 列選項
  attrs: any        // 其他屬性
}
```
