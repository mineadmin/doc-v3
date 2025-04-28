# MaProTable
`ma-pro-table` 基於 `ma-search` 和 `ma-table` 兩個元件封裝而來，用於快速構建一個完整的 `CRUD` 功能，增加摸魚的時間。

:::tip 提示
系統內自帶的 **使用者、角色管理** 都是 `ma-pro-table` CRUD的最佳實踐，文件和實際案例參考，才能快速掌握這個元件。

注意：本元件不再像 `2.0 ma-crud` 那樣直接內建支援 `新增` 和 `編輯` 功能，這些需要自己來實現。
:::

## 使用
<DemoPreview dir="demos/ma-pro-table" />

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

## Props
| 引數       | 說明                  | 型別         | 版本    |
|----------|---------------------|-------------------|--------|
| `options` | `ma-pro-table` 引數設定 | `MaProTableOptions`   | 1.0.0 |
| `schema`  | `ma-pro-table` 架構配置 | `MaProTableSchema` | 1.0.0 |

### MaProTableOptions
| 引數                     | 說明                                        | 型別                                  | 預設值    | 版本    |
|------------------------|-------------------------------------------|-------------------------------------|--------|-------|
| `tableOptions`         | `ma-table` 引數                             | `MaTableOptions`                    | -      | 1.0.0 |
| `searchOptions`        | `ma-search` 引數                            | `MaSearchOptions`                   | -      | 1.0.0 |
| `searchFormOptions`    | `ma-form` 引數                              | `MaFormOptions`                     | -      | 1.0.0 |
| -                      | -                                         | -                                   | -      | -     |
| `id`                   | 當前id，全域性唯一，不指定則隨機生成一個                      | `string`                            | -      | 1.0.0 |
| `adaptionOffsetBottom` | 距離底部偏移量                                   | `number`                            | 0      | 1.0.0 |
| `actionBtnPosition`    | 動作按鈕放置位置，自動模式下，如果開啟標題欄，則顯示在標題欄，否則顯示在表格左上方 | `auto, header, table`               | `auto` | 1.0.0 |
| `header`               | 頭部配置                                      | 檢視 [引數配置](#headerconfig)            | -      | 1.0.0 |
| `toolbar`              | 工具欄是否顯示                                   | `boolean, (() => boolean)`          | `true` | 1.0.0 |
| `rowContextMenu`       | 右鍵配置                                      | 檢視 [引數配置](#rowcontextmenu)          | -      | 1.0.0 |
| `requestOptions`       | 列表網路請求配置                                  | 檢視 [引數配置](#requestoptions)          | -      | 1.0.0 |
| `onSearchSubmit`       | 搜尋提交事件                                    | `(form: Record<string, any>) => void` | -      | 1.0.0 |
| `onSearchReset`        | 搜尋重置事件                                    | `(form: Record<string, any>) => void`          | -      | 1.0.0 |


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
| `type`  | 顯示方式，下拉選單：`dropdown`, 平鋪：`tile`  | `string`     | `dropdown`   | 1.0.0 |
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

## Slot

| 名稱                                             | 說明                                                      | 引數 |
|------------------------------------------------|---------------------------------------------------------|----|
| `default`                                      | 預設插槽及 `el-table` 原生插槽                                   | -  |
| `empty`                                        | 原生插槽，空資料時顯示                                             | -  |
| `append`                                       | 原生插槽，表格最後一行                                             | -  |
| `pageLeft`                                     | 分頁那行左邊區域插槽                                              |    |
| `column-[prop]`                                | 表格列插槽，`prop` 為欄位名                                       |  scope  |
| `header-[prop]`                                | 表格頭插槽，`prop` 為欄位名                                       |  scope  |
| `middle`                                       | 表格與搜尋欄中間區域插槽                                            | -  |
| `tableHeader`                                  | `header` 整個區域插槽                                         | -  |
| `headerTitle`                                  | `header` 標題區域插槽                                         | -  |
| `headerRight`                                  | `header` 右側區域插槽                                         | -  |
| `toolbarLeft`                                  | `toolbar` 左側區域插槽                                        | -  |
| `toolbar`                                      | `toolbar` 工具欄列表插槽，不建議使用，推薦[API擴充套件](#toolbarplugin-工具欄外掛) | -  |
| `beforeToolbar`                                | `toolbar` 工具欄列表前置插槽                                     | -  |
| `afterToolbar`                                 | `toolbar` 工具欄列表後置插槽                                     | -  |
| `tableTop`                                     | `table` 容器內頂部插槽，位於工具欄上方                                 | -  |
| `tableCranny`         |  `table` 容器內表格與工具欄中間縫隙插槽                                | -  |
| `search`                                       | 搜尋元件插槽，使用後，搜尋項配置失效                                      | -  |
| `searchActions`                                | 搜尋 `操作按鈕` 內容插槽                                          | -  |
| `searchBeforeActions`                          | 搜尋 `操作按鈕` 前置內容插槽                                        | -  |
| `searchAfterActions`                           | 搜尋 `操作按鈕` 後置內容插槽                                        | -  |
| `searchAfterActions`                           | 搜尋 `操作按鈕` 後置內容插槽                                        | -  |

## Expose
| 名稱                     | 說明                           | 引數                                                              | 返回值                   |
|------------------------|------------------------------|-----------------------------------------------------------------|-----------------------|
| `getSearchRef()`       | 獲取 `ma-search` 的Ref          | -                                                               | `MaSearchExpose`      |
| `getTableRef()`        | 獲取 `ma-table` 的Ref           | -                                                               | `MaTableExpose`       |
| `getElTableStates()`   | 獲取 `el-table` 的暴露的states屬性列表 | -                                                               | `any`                 |
| `setTableColumns()`    | 設定表格列                        | `(cols: MaProTableColumns[]) => void`                           | `void`                |
| `getTableColumns()`    | 獲取表格列                        | `() => MaProTableColumns[]`                                     | `MaProTableColumns[]` |
| `refresh()`            | 重新整理表格資料                       | `() => Promise<void>`                                           | `Promise<void>`       |
| `requestData()`        | 請求表格資料                       | `() => Promise<void>`                                           | `Promise<void>`       |
| `changeApi()`          | 變更請求api                      | `( api: () => any, isRequestNow: boolean ) => void`             | `void`                |
| `setRequestParams()`   | 設定請求引數                       | `( params: Record<string, any>, isRequestNow: boolean) => void` | `void`                |
| `setSearchForm()`      | 設定搜尋表單預設值                    | `(form: Record<string, any>) => void`                           | `void`                |
| `getSearchForm()`      | 獲取搜尋表單資料                     | `() => Record<string, any>`                                     | `Record<string, any>` |
| `search()`             | 搜尋                         | `(form: Record<string, any>) => void`                           | `void`                |
| `setProTableOptions()` | 設定 `ma-pro-table` 的引數        | `(opts: MaProTableOptions) => void`                             | `void`                |
| `getProTableOptions()` | 獲取 `ma-pro-table` 的引數        | `() => MaProTableOptions`                                       | `MaProTableOptions`   |
| `resizeHeight()`       | 重置表格高度                       | `() => Promise<void>`                                           | `Promise<void>`       |
| `getCurrentId()`       | 獲取當前元件ID                     | -                                                               | `string`              |**
