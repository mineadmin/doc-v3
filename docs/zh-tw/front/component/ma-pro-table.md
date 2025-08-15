# MaProTable
`ma-pro-table` 基於 `ma-search` 和 `ma-table` 兩個元件封裝而來，用於快速構建一個完整的 `CRUD` 功能，增加摸魚的時間。

:::tip 提示
系統內自帶的 **使用者、角色管理** 都是 `ma-pro-table` CRUD的最佳實踐，文件和實際案例參考，才能快速掌握這個元件。

注意：本元件不再像 `2.0 ma-crud` 那樣直接內建支援 `新增` 和 `編輯` 功能，這些需要自己來實現。
:::

## 快速開始

<DemoPreview dir="demos/ma-pro-table" />

## 示例大全

透過以下示例，你可以快速瞭解 MaProTable 的各種使用場景和功能特性：

### 基礎功能
- **[基礎用法](/zh-tw/front/component/ma-pro-table/examples/basic)** - 最簡單的表格使用方式
- **[高階搜尋](/zh-tw/front/component/ma-pro-table/examples/advanced-search)** - 多種搜尋元件和複雜搜尋邏輯
- **[自定義操作](/zh-tw/front/component/ma-pro-table/examples/custom-operations)** - 靈活的操作列配置和批次操作

### 擴充套件功能
- **[單元格渲染外掛](/zh-tw/front/component/ma-pro-table/examples/cell-render-plugins)** - 豐富的單元格渲染效果
- **[工具欄擴充套件](/zh-tw/front/component/ma-pro-table/examples/toolbar-extensions)** - 自定義工具欄功能
- **[資料管理](/zh-tw/front/component/ma-pro-table/examples/data-management)** - 完整的CRUD操作流程

### 高階特性
- **[響應式佈局](/zh-tw/front/component/ma-pro-table/examples/responsive-layout)** - 多裝置適配和響應式設計

## 核心特性

### 🚀 快速開發
- 基於 ma-search 和 ma-table 組合，開箱即用
- 內建常用的 CRUD 操作模式
- 支援多種資料來源和 API 格式

### 🎨 豐富的渲染
- 內建單元格渲染外掛系統
- 支援自定義渲染元件
- 靈活的操作列配置

### 🔧 強大的擴充套件
- 工具欄外掛系統
- 完整的 TypeScript 型別支援
- 豐富的事件和回撥

### 📱 響應式設計
- 自動適配不同裝置尺寸
- 移動端友好的互動體驗
- 靈活的佈局配置

## cellRenderTo 單元格渲染外掛
::: tip 為什麼要存在 cellRenderTo 外掛？
首先，單元格渲染不同內容是使用非常非常頻繁的場景，很多程式碼可能都一樣，只是引數不一樣，欄位名不一樣。所以在構建 `ma-pro-table` 時就在考慮如何解決這個問題。

`ma-pro-table` 雖然可以內建針對不同內容的渲染，比如 `url`, `image`, `video`，再比如 `switch` 渲染。但問題是需求多變的，
內建的功能也永遠滿足不了業務需求的增長，但同時為了避免程式碼冗餘，所以有了這個外掛機制。

大家可以把自己常用的、或者某些專屬業務封裝的單元格渲染外掛，分享出來，分享到應用市場，來豐富單元格渲染，這樣大家都不需要再寫同樣的東西了。
:::

### 使用單元格外掛

```vue 
<script setup lang="ts">
import { ref } from 'vue'
import { MaProTableSchema } from "@mineadmin/pro-table";

const schema = ref<MaProTableSchema>({
  tableColumns: [
    {
      title: '單元格渲染示例',
      prop: 'title',
      // 呼叫單元格渲染外掛 // [!code focus:9]
      cellRenderTo: {
        // 外掛名，此外掛將字串以 el-tag 形式渲染，ma-pro-table 內建這唯一一個。
        name: 'tag', 
        // 可以傳入外掛所需的引數
        props: {
          // 該外掛非必須傳入引數，就不傳了、
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

### 註冊單元格外掛
註冊外掛需要匯入 `useProTableRenderPlugin()` 方法，然後使用此方法註冊、移除外掛。
```ts
import { useProTableRenderPlugin } from '@mineadmin/pro-table'
```
`useProTableRenderPlugin()` 返回了以下幾個方法：

- `addPlugin(plugin: MaProTableRenderPlugin): void`: 註冊外掛
- `removePlugin(pluginName: string): void`: 移除外掛
- `getPlugins(): MaProTableRenderPlugin[]`: 獲取 **ma-pro-table** 已註冊的所有外掛
- `getPluginByName(pluginName: string): MaProTableRenderPlugin`: 按外掛名獲取某個外掛資訊


::: details 點選檢視 `MaProTableRenderPlugin` 型別說明
| 引數       | 說明                  | 型別         |
|----------|---------------------|-------------------|
| `name` | 單元格渲染外掛名稱，唯一識別符號 | `string`|
| `render`  | 渲染函式，支援 `元件, jsx, tsx` 等 | `Function` |

`render` 函式引數說明：
- `data` 型別: `TableColumnRenderer` 包含 `el-table` 的 `scope` 原生引數，以及 `ma-table` 擴充套件引數
- `props`，呼叫外掛時透過 `props` 引數傳入的外部引數。
- `proxy` 型別: `MaProTableExpose` 可檢視此章節最下面的 `Expose` 節點說明。
:::

文件就只說明如何註冊外掛，我們需要用到 `addPlugin` 函式來註冊。

內建 `tag` 外掛原型如下：
```ts
import { h } from 'vue'
import { useProTableRenderPlugin } from '@mineadmin/pro-table'
import { ElTag } from 'element-plus'

const { addPlugin } = useProTableRenderPlugin()

// 註冊外掛
addPlugin({
  // 外掛名，唯一識別符號，如果需要上傳應用市場，請帶上專屬字首
  name: 'tag',
  // 外掛渲染函式，支援指定其他vue元件或者直接編寫 tsx 與 jsx 都可以
  render: (data: TableColumnRenderer, props: any, proxy: MaProTableExpose) => {
    return h(
      ElTag,  // 使用 el-tag 來渲染
      props,  // 透傳外部呼叫外掛時傳入的 props 引數
      {
        default: () => data.row[props?.prop] // 使用 el-tag 預設插槽
      }
    )
  }
})

```

## ToolbarPlugin 工具欄外掛
![表格工具欄](https://s21.ax1x.com/2024/11/03/pArlfRU.png)

::: tip 說明
`ma-pro-table` 也有[插槽](#slot)可以擴充套件這裡，如果某些一次性的功能可使用插槽，如果整個系統都有需求，則建議使用 `api` 來擴充套件了。
:::

`useProTableToolbar()` 返回了以下幾個方法：
- `get: (name: string) => MaProTableToolbar` 獲取某個工具資訊
- `getAll: () => MaProTableToolbar[]` 獲取所有工具資訊
- `add: (toolbar: MaProTableToolbar) => void` 新增新工具
- `remove: (name: string) => void` 移除一個工具
- `hide: (name: string) => void` 設定一個工具為不渲染狀態
- `show: (name: string) => void` 設定一個工具為正常渲染狀態

::: details 點選檢視 `MaProTableToolbar` 型別說明
| 引數       | 說明                  | 型別         |
|----------|---------------------|-------------------|
| `name` | 工具名稱，唯一識別符號 | `string`|
| `render`  | 渲染函式，支援 `元件, jsx, tsx` 等 | `Function` |
| `show`  | 預設是否顯示 | `boolean` |
| `order`  | 工具渲染順序，數字越小，越靠前 | `number` |
  :::

### 擴充套件工具欄

::: code-group 
```ts [index.vue]
import { useProTableToolbar } from '@mineadmin/pro-table'
import CustomerTool from './CustomerTool.vue'

const { add } = useProTableToolbar()

add({
  // 工具名稱
  name: 'heihei',
  // 指定渲染元件，會向元件傳入一個 proxy 引數，元件內部需要定義 props 來接收
  render: CustomerTool,
  show: true,
  order: 99,
})
```

```vue [CustomerTool.vue]

<script setup lang="ts">
  // 定義 props 來接收 `ma-pro-table` 傳入的 proxy 引數
  import { MaProTableExpose } from "@mineadmin/pro-table"
  import { ElMessage } from 'element-plus'

  const { proxy } = defineProps<{ proxy: MaProTableExpose }>()
  
  const execute = async () => {
    // 執行重新整理表格
    await proxy?.refresh?.()
    ElMessage.success('表格重新整理成功')
  }
</script>

<template>
  <!-- 加入 circle 屬性成為圓按鈕，與系統的保持統一 -->
  <el-button circle @click="execute">😀</el-button>
</template>
```
:::

## TypeScript 型別定義

### 核心型別

```typescript
// 元件主要介面
interface MaProTableProps {
  options: MaProTableOptions    // 元件配置
  schema: MaProTableSchema      // 表格架構
}

// 元件暴露的方法和屬性
interface MaProTableExpose {
  // 子元件訪問
  getSearchRef(): MaSearchExpose
  getTableRef(): MaTableExpose
  getElTableStates(): Record<string, any>
  
  // 資料操作
  refresh(): Promise<void>
  requestData(): Promise<void>
  changeApi(api: () => any, isRequestNow: boolean): void
  setRequestParams(params: Record<string, any>, isRequestNow: boolean): void
  
  // 列管理
  setTableColumns(cols: MaProTableColumns[]): void
  getTableColumns(): MaProTableColumns[]
  
  // 搜尋管理
  setSearchForm(form: Record<string, any>): void
  getSearchForm(): Record<string, any>
  search(form: Record<string, any>): void
  
  // 配置管理
  setProTableOptions(opts: MaProTableOptions): void
  getProTableOptions(): MaProTableOptions
  
  // 工具方法
  resizeHeight(): Promise<void>
  getCurrentId(): string
}
```

### 外掛系統型別

```typescript
// 單元格渲染外掛
interface MaProTableRenderPlugin {
  name: string
  render: (data: TableColumnRenderer, props: any, proxy: MaProTableExpose) => VNode | string
}

// 工具欄外掛
interface MaProTableToolbar {
  name: string
  render: (props: { proxy: MaProTableExpose }) => VNode | Component
  show: boolean | (() => boolean)
  order: number
}
```

## Props
| 引數       | 說明                  | 型別         | 版本    |
|----------|---------------------|-------------------|--------|
| `options` | `ma-pro-table` 引數設定 | `MaProTableOptions`   | 1.0.0 |
| `schema`  | `ma-pro-table` 架構配置 | `MaProTableSchema` | 1.0.0 |

### MaProTableOptions
| 引數                     | 說明                                        | 型別                                          | 預設值    | 版本     |
|------------------------|-------------------------------------------|---------------------------------------------|--------|--------|
| `tableOptions`         | `ma-table` 引數                             | `MaTableOptions`                            | -      | 1.0.0  |
| `searchOptions`        | `ma-search` 引數                            | `MaSearchOptions`                           | -      | 1.0.0  |
| `searchFormOptions`    | `ma-form` 引數                              | `MaFormOptions`                             | -      | 1.0.0  |
| -                      | -                                         | -                                           | -      | -      |
| `id`                   | 當前id，全域性唯一，不指定則隨機生成一個                      | `string`                                    | -      | 1.0.0  |
| `adaptionOffsetBottom` | 距離底部偏移量                                   | `number`                                    | 0      | 1.0.0  |
| `actionBtnPosition`    | 動作按鈕放置位置，自動模式下，如果開啟標題欄，則顯示在標題欄，否則顯示在表格左上方 | `auto, header, table`                       | `auto` | 1.0.0  |
| `header`               | 頭部配置                                      | 檢視 [引數配置](#headerconfig)                    | -      | 1.0.0  |
| `toolbar`              | 工具欄是否顯示                                   | `boolean, (() => boolean)`                  | `true` | 1.0.0  |
| `toolStates`           | 按需設定工具是否顯示                                | { `[key:string]` : `boolean, (() => boolean)` | -      | 1.0.69 |
| `rowContextMenu`       | 右鍵配置                                      | 檢視 [引數配置](#rowcontextmenu)                  | -      | 1.0.0  |
| `requestOptions`       | 列表網路請求配置                                  | 檢視 [引數配置](#requestoptions)                  | -      | 1.0.0  |
| `onSearchSubmit`       | 搜尋提交事件                                    | `(form: Record<string, any>) => void`       | -      | 1.0.0  |
| `onSearchReset`        | 搜尋重置事件                                    | `(form: Record<string, any>) => void`       | -      | 1.0.0  |


#### HeaderConfig
| 引數   | 說明           | 型別                         | 預設值     | 版本    |
|------|--------------|----------------------------|---------|-------|
| `show` | 是否顯示頭部  | `boolean, (() => boolean)` | `true`  | 1.0.0 |
| `mainTitle` | 主標題  | `string, (() => string)`   | `表格主標題` | 1.0.0 |
| `subTitle` | 子標題  | `string, (() => string)`                   | -       | 1.0.0 |

#### rowContextMenu
| 引數                | 說明        | 型別                                                                                 | 預設值     | 版本    |
|-------------------|-----------|------------------------------------------------------------------------------------|---------|-------|
| `enabled`         | 是否開啟行右鍵選單 | `boolean`                                                                          | `false` | 1.0.0 |
| `items`           | 右鍵選單列表    | `ContextMenuItem[]`                                                                | -       | 1.0.0 |
| -                 | -         | -                                                                                  | -      | -     |
| `ContextMenuItem` | 說明        | 選單列表配置說明                                                                           | -      | -     |
| `label`           | 選單顯示文案    | `string, (() => string)`                                                           | -       | 1.0.0 |
| `icon`            | 選單顯示圖示    | `string, (() => string)`                                                           | -       | 1.0.0 |
| `disabled`        | 是否停用      | `boolean`                                                                          | -       | 1.0.0 |
| `divided`         | 是否顯示分割線   | `boolean`                                                                          | -       | 1.0.0 |
| `onMenuClick`     | 選單項點選事件   | `(data: { row: any, column: any, proxy: MaProTableExpose }, event: Event) => void` | -       | 1.0.0 |

#### requestOptions
| 引數                    | 說明                    | 型別                                                        | 預設值                                                    | 版本    |
|-----------------------|-----------------------|-----------------------------------------------------------|--------------------------------------------------------|-------|
| `api`                 | 請求 api 方法             | `(...args: any[]) => any`                                 | -                                                      | 1.0.0 |
| `autoRequest`         | 是否自動請求                | `boolean`                                                 | `true`                                                 | 1.0.0 |
| `response`            | 響應返回結構配置              | `{ totalKey?: string, dataKey?: string }`                 | `{ totalKey: 'total', dataKey: 'list'}`                | 1.0.0 |
| `requestPage`         | 請求分頁配置                | `{ pageName?: string, sizeName?: string, size?: number }` | `{ pageName: 'page', sizeName: 'pageSize', size: 10 }` | 1.0.0 |
| `requestParams`       | 預設請求引數                | `Object`                                                  | -                                                      | 1.0.0 |
| `responseDataHandler` | 響應後資料處理，注意：`要把表格資料返回回去` | `(response: Record<string, any>) => any[]`                | -                                                      | 1.0.0 |
| `on`                  | 事件列表 | `Record<string, (...args: any[]) => any>`                 | -                                                      | 1.0.0 |


### MaProTableSchema
| 引數   | 說明       | 型別                                                | 預設值 | 版本    |
|------|----------|---------------------------------------------------|-----|-------|
|`searchItems`| 搜尋項列表配置  | `MaSearchItem[]` [配置項](ma-search#searchitems) | -   | 1.0.0 |
|`tableColumns`| 表格列表配置 | `MaProTableColumns[]`                             | -   | 1.0.0 |

#### MaProTableColumns
::: tip
繼承於 `el-table-columns` 和 `ma-table` 的 [擴充套件columns配置](ma-table#columnextraprops) ，以下是擴充套件引數
:::
| 引數   | 說明                         | 型別                                                 | 預設值 | 版本    |
|------|----------------------------|----------------------------------------------------|-----|-------|
|`type`| `el-table` 原生基礎上，增加 `operation`, `sort`，第一個為操作欄，可透過 `API 擴充套件`，第二個為`行拖動排序` | `string` | -   | 1.0.0 |
|`cellRenderTo`| 渲染單元格為表格註冊的外掛                     | [檢視下方型別](#cellrenderto-使用渲染外掛)    | -   | 1.0.0 |
|`isRender`| 是否渲染列，跟 `hide` 不同的是，不會在表格設定裡顯示此列                     | `boolean & () => boolean`    | -   | 1.0.55 |
|`cellRenderPro`| `cellRender` 加強型，增加了第二個引數 `proxy: MaProTableExpose`                    | `(data, proxy) => VNode & string`    | -   | 1.0.55 |
|`headerRenderPro`| `headerRender` 加強型，增加了第二個引數 `proxy: MaProTableExpose`                     | `(data, proxy) => VNode & string`    | -   | 1.0.55 |
|`operationConfigure`| 操作欄配置，只有 `type` 為 `operation` 生效  | [檢視下方型別](#operationconfigure-操作欄)    | -   | 1.0.0 |

##### cellRenderTo 使用渲染外掛
::: info 
`ma-pro-table` 單元格渲染外掛，得先必須註冊了外掛後才可使用。
:::
| 引數      | 說明        | 型別           | 預設值 | 版本    |
|---------|-----------|--------------|-----|-------|
| `name`  | 單元格渲染外掛名  | `string`     | -   | 1.0.0 |
| `props` | 外掛所需的額外引數 | `any, any[]` | -   | 1.0.0 |

##### operationConfigure 操作欄
::: info 
`操作欄` 只能透過 `api` 來設定操作項，如果覺著麻煩，可自己在 `columns` 增加一個普通列，自己使用插槽來實現。
:::
| 引數      | 說明        | 型別           | 預設值 | 版本    |
|---------|-----------|--------------|-----|-------|
| `type`  | 顯示方式，自動模式：`auto`, 下拉選單：`dropdown`, 平鋪：`tile`  | `string`     | `auto`   | `auto` 所需 `1.0.75` |
| `fold`  | 自動模式下，平鋪幾個後自動摺疊，預設為：`1` 個  | `number`     | `1`   | 1.0.75 |
| `actions` | 操作欄配置列表 | `OperationAction[]` | -   | 1.0.0 |

###### OperationAction 操作欄列表配置
| 引數         | 說明                        | 型別                                                             | 預設值 | 版本    |
|------------|---------------------------|----------------------------------------------------------------|-----|-------|
| `name`     | 操作標識                      | `string`                                                       | -  | 1.0.0 |
| `text`     | 文字配置                      | `string, ((data: TableColumnRenderer) => string)`              | -  | 1.0.0 |
| `icon`     | 圖示配置，內部用 `ma-svg-icon` 渲染 | `string, ((data: TableColumnRenderer) => string)`              | -  | 1.0.0 |
| `order`    | 排序，越小越靠前                  | `number`                                                       | -   | 1.0.0 |
| `disabled` | 是否停用                      | `((data: TableColumnRenderer) => boolean)`                     | -   | 1.0.0 |
| `show`     | 是否顯示                      | `((data: TableColumnRenderer) => boolean)`                     | -   | 1.0.0 |
| `onClick`  | 點選事件                      | `(data: TableColumnRenderer, proxy: MaProTableExpose) => void` | -   | 1.0.0 |
| `linkProps`  | `el-link` 的 `props` 引數      | [LinkProps 文件](https://element-plus.org/zh-CN/component/link.html#attributes)                                               | -   | 1.0.0 |

## Event

| 名稱              | 說明      | 引數                                                         |
|-----------------|---------|------------------------------------------------------------|
| `row-drag-sort` | 拖動行排序事件 | `(tableData: any[]) => void`                               |
| `search-submit` | 搜尋提交事件  | `(form: Record<string, any>) => Record<string, any>, void` |
| `search-reset`  | 搜尋重置事件  | `(form: Record<string, any>) => Record<string, any>, void`                              |

## Slot 插槽系統

MaProTable 提供了豐富的插槽系統，讓你可以靈活地自定義各個區域的內容。

### 核心插槽

| 名稱                | 說明                                      | 引數    | 使用場景 |
|-------------------|-------------------------------------------|---------|----------|
| `default`         | 預設插槽及 `el-table` 原生插槽               | -       | 表格內容擴充套件 |
| `empty`           | 空資料時顯示的內容                           | -       | 自定義空狀態 |
| `append`          | 表格最後一行內容                            | -       | 總計行等 |

### 佈局插槽

| 名稱                | 說明                                      | 引數    | 使用場景 |
|-------------------|-------------------------------------------|---------|----------|
| `middle`          | 搜尋欄與表格中間區域                         | -       | 新增統計資訊 |
| `tableHeader`     | 表格頭部整個區域                            | -       | 完全自定義頭部 |
| `headerTitle`     | 表格頭部標題區域                            | -       | 自定義標題 |
| `headerRight`     | 表格頭部右側區域                            | -       | 新增快捷操作 |
| `tableTop`        | 表格容器頂部，工具欄上方                     | -       | 批次操作按鈕 |
| `tableCranny`     | 表格與工具欄中間縫隙                         | -       | 狀態提示 |
| `pageLeft`        | 分頁左側區域                               | -       | 統計資訊 |

### 工具欄插槽

| 名稱                | 說明                                      | 引數    | 使用場景 |
|-------------------|-------------------------------------------|---------|----------|
| `toolbarLeft`     | 工具欄左側區域                              | -       | 統計資料展示 |
| `toolbar`         | 工具欄列表（不推薦，建議用API擴充套件）           | -       | 自定義工具 |
| `beforeToolbar`   | 工具欄前置內容                              | -       | 前置按鈕 |
| `afterToolbar`    | 工具欄後置內容                              | -       | 後置按鈕 |

### 搜尋插槽

| 名稱                   | 說明                                      | 引數    | 使用場景 |
|----------------------|-------------------------------------------|---------|----------|
| `search`             | 搜尋元件整體替換                            | -       | 完全自定義搜尋 |
| `searchActions`      | 搜尋操作按鈕區域                            | -       | 自定義搜尋按鈕 |
| `searchBeforeActions`| 搜尋按鈕前置內容                            | -       | 新增前置操作 |
| `searchAfterActions` | 搜尋按鈕後置內容                            | -       | 新增後置操作 |

### 動態插槽

| 名稱                | 說明                                      | 引數    | 使用場景 |
|-------------------|-------------------------------------------|---------|----------|
| `column-[prop]`   | 表格列內容插槽                              | scope   | 自定義列渲染 |
| `header-[prop]`   | 表格頭部插槽                               | scope   | 自定義表頭 |

### 插槽使用示例

```vue
<template>
  <MaProTable :options="options" :schema="schema">
    <!-- 工具欄左側統計 -->
    <template #toolbarLeft>
      <div class="stats">
        <el-text>總計: {{ total }} 條</el-text>
      </div>
    </template>
    
    <!-- 表格頂部批次操作 -->
    <template #tableTop>
      <div class="batch-actions">
        <el-button @click="batchDelete">批次刪除</el-button>
      </div>
    </template>
    
    <!-- 自定義列內容 -->
    <template #column-status="{ row }">
      <el-switch v-model="row.status" />
    </template>
  </MaProTable>
</template>
```

## Expose 暴露方法

MaProTable 元件暴露了豐富的方法和屬性，讓你可以完全控制表格的行為。

### 子元件訪問

| 方法名                 | 說明                                  | 返回值                |
|-----------------------|---------------------------------------|----------------------|
| `getSearchRef()`      | 獲取搜尋元件例項                       | `MaSearchExpose`     |
| `getTableRef()`       | 獲取表格元件例項                       | `MaTableExpose`      |
| `getElTableStates()`  | 獲取 Element Plus 表格狀態            | `any`                |

### 資料操作

| 方法名                | 說明                                  | 引數                                                            | 返回值              |
|----------------------|---------------------------------------|----------------------------------------------------------------|--------------------|
| `refresh()`          | 重新整理表格資料                           | -                                                              | `Promise<void>`    |
| `requestData()`      | 重新請求表格資料                       | -                                                              | `Promise<void>`    |
| `changeApi()`        | 動態更換資料介面                       | `(api: () => any, isRequestNow: boolean) => void`             | `void`             |
| `setRequestParams()` | 設定請求引數                           | `(params: Record<string, any>, isRequestNow: boolean) => void` | `void`             |

### 列管理

| 方法名                | 說明                                  | 引數                                         | 返回值                    |
|----------------------|---------------------------------------|---------------------------------------------|-------------------------|
| `setTableColumns()`  | 動態設定表格列                         | `(cols: MaProTableColumns[]) => void`      | `void`                  |
| `getTableColumns()`  | 獲取當前表格列配置                     | -                                           | `MaProTableColumns[]`   |

### 搜尋管理

| 方法名               | 說明                                  | 引數                                         | 返回值                    |
|---------------------|---------------------------------------|---------------------------------------------|-------------------------|
| `setSearchForm()`   | 設定搜尋表單資料                       | `(form: Record<string, any>) => void`      | `void`                  |
| `getSearchForm()`   | 獲取搜尋表單資料                       | -                                           | `Record<string, any>`   |
| `search()`          | 執行搜尋操作                           | `(form: Record<string, any>) => void`      | `void`                  |

### 配置管理

| 方法名                  | 說明                                  | 引數                                         | 返回值                |
|------------------------|---------------------------------------|---------------------------------------------|----------------------|
| `setProTableOptions()` | 動態設定元件配置                       | `(opts: MaProTableOptions) => void`        | `void`               |
| `getProTableOptions()` | 獲取當前元件配置                       | -                                           | `MaProTableOptions`  |

### 工具方法

| 方法名              | 說明                                  | 引數 | 返回值              |
|--------------------|---------------------------------------|------|--------------------|
| `resizeHeight()`   | 重新計算表格高度                       | -    | `Promise<void>`    |
| `getCurrentId()`   | 獲取元件唯一標識                       | -    | `string`           |

### 使用示例

```vue
<template>
  <div>
    <el-button @click="handleRefresh">重新整理資料</el-button>
    <el-button @click="handleSearch">搜尋</el-button>
    <el-button @click="handleChangeApi">切換介面</el-button>
    
    <MaProTable ref="tableRef" :options="options" :schema="schema" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tableRef = ref()

// 重新整理資料
const handleRefresh = async () => {
  await tableRef.value?.refresh()
  console.log('資料重新整理完成')
}

// 執行搜尋
const handleSearch = () => {
  tableRef.value?.search({ name: '張三', status: 1 })
}

// 動態切換介面
const handleChangeApi = () => {
  tableRef.value?.changeApi(newApiFunction, true)
}

// 獲取選中行
const getSelectedRows = () => {
  const tableInstance = tableRef.value?.getTableRef()
  return tableInstance?.getSelectionRows()
}

// 動態更新列配置
const updateColumns = () => {
  const newColumns = [
    { label: 'ID', prop: 'id' },
    { label: '姓名', prop: 'name' }
  ]
  tableRef.value?.setTableColumns(newColumns)
}
</script>
```
