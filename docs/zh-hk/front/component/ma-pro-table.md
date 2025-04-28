# MaProTable
`ma-pro-table` 基於 `ma-search` 和 `ma-table` 兩個組件封裝而來，用於快速構建一個完整的 `CRUD` 功能，增加摸魚的時間。

:::tip 提示
系統內自帶的 **用户、角色管理** 都是 `ma-pro-table` CRUD的最佳實踐，文檔和實際案例參考，才能快速掌握這個組件。

注意：本組件不再像 `2.0 ma-crud` 那樣直接內置支持 `新增` 和 `編輯` 功能，這些需要自己來實現。
:::

## 使用
<DemoPreview dir="demos/ma-pro-table" />

## cellRenderTo 單元格渲染插件
::: tip 為什麼要存在 cellRenderTo 插件？
首先，單元格渲染不同內容是使用非常非常頻繁的場景，很多代碼可能都一樣，只是參數不一樣，字段名不一樣。所以在構建 `ma-pro-table` 時就在考慮如何解決這個問題。

`ma-pro-table` 雖然可以內置針對不同內容的渲染，比如 `url`, `image`, `video`，再比如 `switch` 渲染。但問題是需求多變的，
內置的功能也永遠滿足不了業務需求的增長，但同時為了避免代碼冗餘，所以有了這個插件機制。

大家可以把自己常用的、或者某些專屬業務封裝的單元格渲染插件，分享出來，分享到應用市場，來豐富單元格渲染，這樣大家都不需要再寫同樣的東西了。
:::

### 使用單元格插件

```vue 
<script setup lang="ts">
import { ref } from 'vue'
import { MaProTableSchema } from "@mineadmin/pro-table";

const schema = ref<MaProTableSchema>({
  tableColumns: [
    {
      title: '單元格渲染示例',
      prop: 'title',
      // 調用單元格渲染插件 // [!code focus:9]
      cellRenderTo: {
        // 插件名，此插件將字符串以 el-tag 形式渲染，ma-pro-table 內置這唯一一個。
        name: 'tag', 
        // 可以傳入插件所需的參數
        props: {
          // 該插件非必須傳入參數，就不傳了、
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

### 註冊單元格插件
註冊插件需要導入 `useProTableRenderPlugin()` 方法，然後使用此方法註冊、移除插件。
```ts
import { useProTableRenderPlugin } from '@mineadmin/pro-table'
```
`useProTableRenderPlugin()` 返回了以下幾個方法：

- `addPlugin(plugin: MaProTableRenderPlugin): void`: 註冊插件
- `removePlugin(pluginName: string): void`: 移除插件
- `getPlugins(): MaProTableRenderPlugin[]`: 獲取 **ma-pro-table** 已註冊的所有插件
- `getPluginByName(pluginName: string): MaProTableRenderPlugin`: 按插件名獲取某個插件信息


::: details 點擊查看 `MaProTableRenderPlugin` 類型説明
| 參數       | 説明                  | 類型         |
|----------|---------------------|-------------------|
| `name` | 單元格渲染插件名稱，唯一標識符 | `string`|
| `render`  | 渲染函數，支持 `組件, jsx, tsx` 等 | `Function` |

`render` 函數參數説明：
- `data` 類型: `TableColumnRenderer` 包含 `el-table` 的 `scope` 原生參數，以及 `ma-table` 擴展參數
- `props`，調用插件時通過 `props` 參數傳入的外部參數。
- `proxy` 類型: `MaProTableExpose` 可查看此章節最下面的 `Expose` 節點説明。
:::

文檔就只説明如何註冊插件，我們需要用到 `addPlugin` 函數來註冊。

內置 `tag` 插件原型如下：
```ts
import { h } from 'vue'
import { useProTableRenderPlugin } from '@mineadmin/pro-table'
import { ElTag } from 'element-plus'

const { addPlugin } = useProTableRenderPlugin()

// 註冊插件
addPlugin({
  // 插件名，唯一標識符，如果需要上傳應用市場，請帶上專屬前綴
  name: 'tag',
  // 插件渲染函數，支持指定其他vue組件或者直接編寫 tsx 與 jsx 都可以
  render: (data: TableColumnRenderer, props: any, proxy: MaProTableExpose) => {
    return h(
      ElTag,  // 使用 el-tag 來渲染
      props,  // 透傳外部調用插件時傳入的 props 參數
      {
        default: () => data.row[props?.prop] // 使用 el-tag 默認插槽
      }
    )
  }
})

```

## ToolbarPlugin 工具欄插件
![表格工具欄](https://s21.ax1x.com/2024/11/03/pArlfRU.png)

::: tip 説明
`ma-pro-table` 也有[插槽](#slot)可以擴展這裏，如果某些一次性的功能可使用插槽，如果整個系統都有需求，則建議使用 `api` 來擴展了。
:::

`useProTableToolbar()` 返回了以下幾個方法：
- `get: (name: string) => MaProTableToolbar` 獲取某個工具信息
- `getAll: () => MaProTableToolbar[]` 獲取所有工具信息
- `add: (toolbar: MaProTableToolbar) => void` 添加新工具
- `remove: (name: string) => void` 移除一個工具
- `hide: (name: string) => void` 設置一個工具為不渲染狀態
- `show: (name: string) => void` 設置一個工具為正常渲染狀態

::: details 點擊查看 `MaProTableToolbar` 類型説明
| 參數       | 説明                  | 類型         |
|----------|---------------------|-------------------|
| `name` | 工具名稱，唯一標識符 | `string`|
| `render`  | 渲染函數，支持 `組件, jsx, tsx` 等 | `Function` |
| `show`  | 默認是否顯示 | `boolean` |
| `order`  | 工具渲染順序，數字越小，越靠前 | `number` |
  :::

### 擴展工具欄

::: code-group 
```ts [index.vue]
import { useProTableToolbar } from '@mineadmin/pro-table'
import CustomerTool from './CustomerTool.vue'

const { add } = useProTableToolbar()

add({
  // 工具名稱
  name: 'heihei',
  // 指定渲染組件，會向組件傳入一個 proxy 參數，組件內部需要定義 props 來接收
  render: CustomerTool,
  show: true,
  order: 99,
})
```

```vue [CustomerTool.vue]

<script setup lang="ts">
  // 定義 props 來接收 `ma-pro-table` 傳入的 proxy 參數
  import { MaProTableExpose } from "@mineadmin/pro-table"
  import { ElMessage } from 'element-plus'

  const { proxy } = defineProps<{ proxy: MaProTableExpose }>()
  
  const execute = async () => {
    // 執行刷新表格
    await proxy?.refresh?.()
    ElMessage.success('表格刷新成功')
  }
</script>

<template>
  <!-- 加入 circle 屬性成為圓按鈕，與系統的保持統一 -->
  <el-button circle @click="execute">😀</el-button>
</template>
```
:::

## Props
| 參數       | 説明                  | 類型         | 版本    |
|----------|---------------------|-------------------|--------|
| `options` | `ma-pro-table` 參數設置 | `MaProTableOptions`   | 1.0.0 |
| `schema`  | `ma-pro-table` 架構配置 | `MaProTableSchema` | 1.0.0 |

### MaProTableOptions
| 參數                     | 説明                                        | 類型                                  | 默認值    | 版本    |
|------------------------|-------------------------------------------|-------------------------------------|--------|-------|
| `tableOptions`         | `ma-table` 參數                             | `MaTableOptions`                    | -      | 1.0.0 |
| `searchOptions`        | `ma-search` 參數                            | `MaSearchOptions`                   | -      | 1.0.0 |
| `searchFormOptions`    | `ma-form` 參數                              | `MaFormOptions`                     | -      | 1.0.0 |
| -                      | -                                         | -                                   | -      | -     |
| `id`                   | 當前id，全局唯一，不指定則隨機生成一個                      | `string`                            | -      | 1.0.0 |
| `adaptionOffsetBottom` | 距離底部偏移量                                   | `number`                            | 0      | 1.0.0 |
| `actionBtnPosition`    | 動作按鈕放置位置，自動模式下，如果開啓標題欄，則顯示在標題欄，否則顯示在表格左上方 | `auto, header, table`               | `auto` | 1.0.0 |
| `header`               | 頭部配置                                      | 查看 [參數配置](#headerconfig)            | -      | 1.0.0 |
| `toolbar`              | 工具欄是否顯示                                   | `boolean, (() => boolean)`          | `true` | 1.0.0 |
| `rowContextMenu`       | 右鍵配置                                      | 查看 [參數配置](#rowcontextmenu)          | -      | 1.0.0 |
| `requestOptions`       | 列表網絡請求配置                                  | 查看 [參數配置](#requestoptions)          | -      | 1.0.0 |
| `onSearchSubmit`       | 搜索提交事件                                    | `(form: Record<string, any>) => void` | -      | 1.0.0 |
| `onSearchReset`        | 搜索重置事件                                    | `(form: Record<string, any>) => void`          | -      | 1.0.0 |


#### HeaderConfig
| 參數   | 説明           | 類型                         | 默認值     | 版本    |
|------|--------------|----------------------------|---------|-------|
| `show` | 是否顯示頭部  | `boolean, (() => boolean)` | `true`  | 1.0.0 |
| `mainTitle` | 主標題  | `string, (() => string)`   | `表格主標題` | 1.0.0 |
| `subTitle` | 子標題  | `string, (() => string)`                   | -       | 1.0.0 |

#### rowContextMenu
| 參數                | 説明        | 類型                                                                                 | 默認值     | 版本    |
|-------------------|-----------|------------------------------------------------------------------------------------|---------|-------|
| `enabled`         | 是否開啓行右鍵菜單 | `boolean`                                                                          | `false` | 1.0.0 |
| `items`           | 右鍵菜單列表    | `ContextMenuItem[]`                                                                | -       | 1.0.0 |
| -                 | -         | -                                                                                  | -      | -     |
| `ContextMenuItem` | 説明        | 菜單列表配置説明                                                                           | -      | -     |
| `label`           | 菜單顯示文案    | `string, (() => string)`                                                           | -       | 1.0.0 |
| `icon`            | 菜單顯示圖標    | `string, (() => string)`                                                           | -       | 1.0.0 |
| `disabled`        | 是否禁用      | `boolean`                                                                          | -       | 1.0.0 |
| `divided`         | 是否顯示分割線   | `boolean`                                                                          | -       | 1.0.0 |
| `onMenuClick`     | 菜單項點擊事件   | `(data: { row: any, column: any, proxy: MaProTableExpose }, event: Event) => void` | -       | 1.0.0 |

#### requestOptions
| 參數                    | 説明                    | 類型                                                        | 默認值                                                    | 版本    |
|-----------------------|-----------------------|-----------------------------------------------------------|--------------------------------------------------------|-------|
| `api`                 | 請求 api 方法             | `(...args: any[]) => any`                                 | -                                                      | 1.0.0 |
| `autoRequest`         | 是否自動請求                | `boolean`                                                 | `true`                                                 | 1.0.0 |
| `response`            | 響應返回結構配置              | `{ totalKey?: string, dataKey?: string }`                 | `{ totalKey: 'total', dataKey: 'list'}`                | 1.0.0 |
| `requestPage`         | 請求分頁配置                | `{ pageName?: string, sizeName?: string, size?: number }` | `{ pageName: 'page', sizeName: 'pageSize', size: 10 }` | 1.0.0 |
| `requestParams`       | 默認請求參數                | `Object`                                                  | -                                                      | 1.0.0 |
| `responseDataHandler` | 響應後數據處理，注意：`要把表格數據返回回去` | `(response: Record<string, any>) => any[]`                | -                                                      | 1.0.0 |
| `on`                  | 事件列表 | `Record<string, (...args: any[]) => any>`                 | -                                                      | 1.0.0 |


### MaProTableSchema
| 參數   | 説明       | 類型                                                | 默認值 | 版本    |
|------|----------|---------------------------------------------------|-----|-------|
|`searchItems`| 搜索項列表配置  | `MaSearchItem[]` [配置項](ma-search#searchitems) | -   | 1.0.0 |
|`tableColumns`| 表格列表配置 | `MaProTableColumns[]`                             | -   | 1.0.0 |

#### MaProTableColumns
::: tip
繼承於 `el-table-columns` 和 `ma-table` 的 [擴展columns配置](ma-table#columnextraprops) ，以下是擴展參數
:::
| 參數   | 説明                         | 類型                                                 | 默認值 | 版本    |
|------|----------------------------|----------------------------------------------------|-----|-------|
|`type`| `el-table` 原生基礎上，增加 `operation`, `sort`，第一個為操作欄，可通過 `API 擴展`，第二個為`行拖動排序` | `string` | -   | 1.0.0 |
|`cellRenderTo`| 渲染單元格為表格註冊的插件                     | [查看下方類型](#cellrenderto-使用渲染插件)    | -   | 1.0.0 |
|`isRender`| 是否渲染列，跟 `hide` 不同的是，不會在表格設置裏顯示此列                     | `boolean & () => boolean`    | -   | 1.0.55 |
|`cellRenderPro`| `cellRender` 加強型，增加了第二個參數 `proxy: MaProTableExpose`                    | `(data, proxy) => VNode & string`    | -   | 1.0.55 |
|`headerRenderPro`| `headerRender` 加強型，增加了第二個參數 `proxy: MaProTableExpose`                     | `(data, proxy) => VNode & string`    | -   | 1.0.55 |
|`operationConfigure`| 操作欄配置，只有 `type` 為 `operation` 生效  | [查看下方類型](#operationconfigure-操作欄)    | -   | 1.0.0 |

##### cellRenderTo 使用渲染插件
::: info 
`ma-pro-table` 單元格渲染插件，得先必須註冊了插件後才可使用。
:::
| 參數      | 説明        | 類型           | 默認值 | 版本    |
|---------|-----------|--------------|-----|-------|
| `name`  | 單元格渲染插件名  | `string`     | -   | 1.0.0 |
| `props` | 插件所需的額外參數 | `any, any[]` | -   | 1.0.0 |

##### operationConfigure 操作欄
::: info 
`操作欄` 只能通過 `api` 來設置操作項，如果覺着麻煩，可自己在 `columns` 增加一個普通列，自己使用插槽來實現。
:::
| 參數      | 説明        | 類型           | 默認值 | 版本    |
|---------|-----------|--------------|-----|-------|
| `type`  | 顯示方式，下拉菜單：`dropdown`, 平鋪：`tile`  | `string`     | `dropdown`   | 1.0.0 |
| `actions` | 操作欄配置列表 | `OperationAction[]` | -   | 1.0.0 |

###### OperationAction 操作欄列表配置
| 參數         | 説明                        | 類型                                                             | 默認值 | 版本    |
|------------|---------------------------|----------------------------------------------------------------|-----|-------|
| `name`     | 操作標識                      | `string`                                                       | -  | 1.0.0 |
| `text`     | 文本配置                      | `string, ((data: TableColumnRenderer) => string)`              | -  | 1.0.0 |
| `icon`     | 圖標配置，內部用 `ma-svg-icon` 渲染 | `string, ((data: TableColumnRenderer) => string)`              | -  | 1.0.0 |
| `order`    | 排序，越小越靠前                  | `number`                                                       | -   | 1.0.0 |
| `disabled` | 是否禁用                      | `((data: TableColumnRenderer) => boolean)`                     | -   | 1.0.0 |
| `show`     | 是否顯示                      | `((data: TableColumnRenderer) => boolean)`                     | -   | 1.0.0 |
| `onClick`  | 點擊事件                      | `(data: TableColumnRenderer, proxy: MaProTableExpose) => void` | -   | 1.0.0 |
| `linkProps`  | `el-link` 的 `props` 參數      | [LinkProps 文檔](https://element-plus.org/zh-CN/component/link.html#attributes)                                               | -   | 1.0.0 |

## Event

| 名稱              | 説明      | 參數                                                         |
|-----------------|---------|------------------------------------------------------------|
| `row-drag-sort` | 拖動行排序事件 | `(tableData: any[]) => void`                               |
| `search-submit` | 搜索提交事件  | `(form: Record<string, any>) => Record<string, any>, void` |
| `search-reset`  | 搜索重置事件  | `(form: Record<string, any>) => Record<string, any>, void`                              |

## Slot

| 名稱                                             | 説明                                                      | 參數 |
|------------------------------------------------|---------------------------------------------------------|----|
| `default`                                      | 默認插槽及 `el-table` 原生插槽                                   | -  |
| `empty`                                        | 原生插槽，空數據時顯示                                             | -  |
| `append`                                       | 原生插槽，表格最後一行                                             | -  |
| `pageLeft`                                     | 分頁那行左邊區域插槽                                              |    |
| `column-[prop]`                                | 表格列插槽，`prop` 為字段名                                       |  scope  |
| `header-[prop]`                                | 表格頭插槽，`prop` 為字段名                                       |  scope  |
| `middle`                                       | 表格與搜索欄中間區域插槽                                            | -  |
| `tableHeader`                                  | `header` 整個區域插槽                                         | -  |
| `headerTitle`                                  | `header` 標題區域插槽                                         | -  |
| `headerRight`                                  | `header` 右側區域插槽                                         | -  |
| `toolbarLeft`                                  | `toolbar` 左側區域插槽                                        | -  |
| `toolbar`                                      | `toolbar` 工具欄列表插槽，不建議使用，推薦[API擴展](#toolbarplugin-工具欄插件) | -  |
| `beforeToolbar`                                | `toolbar` 工具欄列表前置插槽                                     | -  |
| `afterToolbar`                                 | `toolbar` 工具欄列表後置插槽                                     | -  |
| `tableTop`                                     | `table` 容器內頂部插槽，位於工具欄上方                                 | -  |
| `tableCranny`         |  `table` 容器內表格與工具欄中間縫隙插槽                                | -  |
| `search`                                       | 搜索組件插槽，使用後，搜索項配置失效                                      | -  |
| `searchActions`                                | 搜索 `操作按鈕` 內容插槽                                          | -  |
| `searchBeforeActions`                          | 搜索 `操作按鈕` 前置內容插槽                                        | -  |
| `searchAfterActions`                           | 搜索 `操作按鈕` 後置內容插槽                                        | -  |
| `searchAfterActions`                           | 搜索 `操作按鈕` 後置內容插槽                                        | -  |

## Expose
| 名稱                     | 説明                         | 參數                                                              | 返回值                   |
|------------------------|----------------------------|-----------------------------------------------------------------|-----------------------|
| `getSearchRef()`       | 獲取 `ma-search` 的Ref        | -                                                               | `MaSearchExpose`      |
| `getTableRef()`        | 獲取 `ma-table` 的Ref         | -                                                               | `MaTableExpose`       |
| `getElTableStates()`   | 獲取 `el-table` 的暴露的states屬性列表 | -                                                               | `any`                 |
| `setTableColumns()`    | 設置表格列                      | `(cols: MaProTableColumns[]) => void`                           | `void`                |
| `getTableColumns()`    | 獲取表格列                      | `() => MaProTableColumns[]`                                     | `MaProTableColumns[]` |
| `refresh()`            | 刷新表格數據                     | `() => Promise<void>`                                           | `Promise<void>`       |
| `requestData()`        | 請求表格數據                     | `() => Promise<void>`                                           | `Promise<void>`       |
| `changeApi()`          | 變更請求api                    | `( api: () => any, isRequestNow: boolean ) => void`             | `void`                |
| `setRequestParams()`   | 設置請求參數                     | `( params: Record<string, any>, isRequestNow: boolean) => void` | `void`                |
| `setSearchForm()`      | 設置搜索表單默認值                  | `(form: Record<string, any>) => void`                           | `void`                |
| `getSearchForm()`      | 獲取搜索表單數據                   | `() => Record<string, any>`                                     | `Record<string, any>` |
| `search()`             | 搜索                         | `(form: Record<string, any>) => void`                           | `void`                |
| `setProTableOptions()` | 設置 `ma-pro-table` 的參數      | `(opts: MaProTableOptions) => void`                             | `void`                |
| `getProTableOptions()` | 獲取 `ma-pro-table` 的參數      | `() => MaProTableOptions`                                       | `MaProTableOptions`   |
| `resizeHeight()`       | 重置表格高度                     | `() => Promise<void>`                                           | `Promise<void>`       |
| `getCurrentId()`       | 獲取當前組件ID                   | -                                                               | `string`              |**
