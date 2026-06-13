# MaProTable
`ma-pro-table` 基於 `ma-search` 和 `ma-table` 兩個組件封裝而來，用於快速構建一個完整的 `CRUD` 功能，增加摸魚的時間。

:::tip 提示
系統內自帶的 **用户、角色管理** 都是 `ma-pro-table` CRUD的最佳實踐，文檔和實際案例參考，才能快速掌握這個組件。

注意：本組件不再像 `2.0 ma-crud` 那樣直接內置支持 `新增` 和 `編輯` 功能，這些需要自己來實現。
:::

## 快速開始

<DemoPreview dir="demos/ma-pro-table" />

## 示例大全

通過以下示例，你可以快速瞭解 MaProTable 的各種使用場景和功能特性：

### 基礎功能
- **[基礎用法](/v3/front/component/ma-pro-table/examples/basic)** - 最簡單的表格使用方式
- **[高級搜索](/v3/front/component/ma-pro-table/examples/advanced-search)** - 多種搜索組件和複雜搜索邏輯
- **[自定義操作](/v3/front/component/ma-pro-table/examples/custom-operations)** - 靈活的操作列配置和批量操作

### 擴展功能
- **[單元格渲染插件](/v3/front/component/ma-pro-table/examples/cell-render-plugins)** - 豐富的單元格渲染效果
- **[工具欄擴展](/v3/front/component/ma-pro-table/examples/toolbar-extensions)** - 自定義工具欄功能
- **[數據管理](/v3/front/component/ma-pro-table/examples/data-management)** - 完整的CRUD操作流程

### 高級特性
- **[響應式佈局](/v3/front/component/ma-pro-table/examples/responsive-layout)** - 多設備適配和響應式設計

## 核心特性

### 🚀 快速開發
- 基於 ma-search 和 ma-table 組合，開箱即用
- 內置常用的 CRUD 操作模式
- 支持多種數據源和 API 格式

### 🎨 豐富的渲染
- 內置單元格渲染插件系統
- 支持自定義渲染組件
- 靈活的操作列配置

### 🔧 強大的擴展
- 工具欄插件系統
- 完整的 TypeScript 類型支持
- 豐富的事件和回調

### 📱 響應式設計
- 自動適配不同設備尺寸
- 移動端友好的交互體驗
- 靈活的佈局配置

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

## TypeScript 類型定義

### 核心類型

```typescript
// 組件主要接口
interface MaProTableProps {
  options: MaProTableOptions    // 組件配置
  schema: MaProTableSchema      // 表格架構
}

// 組件暴露的方法和屬性
interface MaProTableExpose {
  // 子組件訪問
  getSearchRef(): MaSearchExpose
  getTableRef(): MaTableExpose
  getElTableStates(): Record<string, any>
  
  // 數據操作
  refresh(): Promise<void>
  requestData(): Promise<void>
  changeApi(api: () => any, isRequestNow: boolean): void
  setRequestParams(params: Record<string, any>, isRequestNow: boolean): void
  
  // 列管理
  setTableColumns(cols: MaProTableColumns[]): void
  getTableColumns(): MaProTableColumns[]
  
  // 搜索管理
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

### 插件系統類型

```typescript
// 單元格渲染插件
interface MaProTableRenderPlugin {
  name: string
  render: (data: TableColumnRenderer, props: any, proxy: MaProTableExpose) => VNode | string
}

// 工具欄插件
interface MaProTableToolbar {
  name: string
  render: (props: { proxy: MaProTableExpose }) => VNode | Component
  show: boolean | (() => boolean)
  order: number
}
```

## Props
| 參數       | 説明                  | 類型         | 版本    |
|----------|---------------------|-------------------|--------|
| `options` | `ma-pro-table` 參數設置 | `MaProTableOptions`   | 1.0.0 |
| `schema`  | `ma-pro-table` 架構配置 | `MaProTableSchema` | 1.0.0 |

### MaProTableOptions
| 參數                     | 説明                                        | 類型                                          | 默認值    | 版本     |
|------------------------|-------------------------------------------|---------------------------------------------|--------|--------|
| `tableOptions`         | `ma-table` 參數                             | `MaTableOptions`                            | -      | 1.0.0  |
| `searchOptions`        | `ma-search` 參數                            | `MaSearchOptions`                           | -      | 1.0.0  |
| `searchFormOptions`    | `ma-form` 參數                              | `MaFormOptions`                             | -      | 1.0.0  |
| -                      | -                                         | -                                           | -      | -      |
| `id`                   | 當前id，全局唯一，不指定則隨機生成一個                      | `string`                                    | -      | 1.0.0  |
| `adaptionOffsetBottom` | 距離底部偏移量                                   | `number`                                    | 0      | 1.0.0  |
| `actionBtnPosition`    | 動作按鈕放置位置，自動模式下，如果開啓標題欄，則顯示在標題欄，否則顯示在表格左上方 | `auto, header, table`                       | `auto` | 1.0.0  |
| `header`               | 頭部配置                                      | 查看 [參數配置](#headerconfig)                    | -      | 1.0.0  |
| `toolbar`              | 工具欄是否顯示                                   | `boolean, (() => boolean)`                  | `true` | 1.0.0  |
| `toolStates`           | 按需設置工具是否顯示                                | { `[key:string]` : `boolean, (() => boolean)` | -      | 1.0.69 |
| `rowContextMenu`       | 右鍵配置                                      | 查看 [參數配置](#rowcontextmenu)                  | -      | 1.0.0  |
| `requestOptions`       | 列表網絡請求配置                                  | 查看 [參數配置](#requestoptions)                  | -      | 1.0.0  |
| `onSearchSubmit`       | 搜索提交事件                                    | `(form: Record<string, any>) => void`       | -      | 1.0.0  |
| `onSearchReset`        | 搜索重置事件                                    | `(form: Record<string, any>) => void`       | -      | 1.0.0  |


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
| `type`  | 顯示方式，自動模式：`auto`, 下拉菜單：`dropdown`, 平鋪：`tile`  | `string`     | `auto`   | `auto` 所需 `1.0.75` |
| `fold`  | 自動模式下，平鋪幾個後自動摺疊，默認為：`1` 個  | `number`     | `1`   | 1.0.75 |
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

## Slot 插槽系統

MaProTable 提供了豐富的插槽系統，讓你可以靈活地自定義各個區域的內容。

### 核心插槽

| 名稱                | 説明                                      | 參數    | 使用場景 |
|-------------------|-------------------------------------------|---------|----------|
| `default`         | 默認插槽及 `el-table` 原生插槽               | -       | 表格內容擴展 |
| `empty`           | 空數據時顯示的內容                           | -       | 自定義空狀態 |
| `append`          | 表格最後一行內容                            | -       | 總計行等 |

### 佈局插槽

| 名稱                | 説明                                      | 參數    | 使用場景 |
|-------------------|-------------------------------------------|---------|----------|
| `middle`          | 搜索欄與表格中間區域                         | -       | 添加統計信息 |
| `tableHeader`     | 表格頭部整個區域                            | -       | 完全自定義頭部 |
| `headerTitle`     | 表格頭部標題區域                            | -       | 自定義標題 |
| `headerRight`     | 表格頭部右側區域                            | -       | 添加快捷操作 |
| `tableTop`        | 表格容器頂部，工具欄上方                     | -       | 批量操作按鈕 |
| `tableCranny`     | 表格與工具欄中間縫隙                         | -       | 狀態提示 |
| `pageLeft`        | 分頁左側區域                               | -       | 統計信息 |

### 工具欄插槽

| 名稱                | 説明                                      | 參數    | 使用場景 |
|-------------------|-------------------------------------------|---------|----------|
| `toolbarLeft`     | 工具欄左側區域                              | -       | 統計數據展示 |
| `toolbar`         | 工具欄列表（不推薦，建議用API擴展）           | -       | 自定義工具 |
| `beforeToolbar`   | 工具欄前置內容                              | -       | 前置按鈕 |
| `afterToolbar`    | 工具欄後置內容                              | -       | 後置按鈕 |

### 搜索插槽

| 名稱                   | 説明                                      | 參數    | 使用場景 |
|----------------------|-------------------------------------------|---------|----------|
| `search`             | 搜索組件整體替換                            | -       | 完全自定義搜索 |
| `searchActions`      | 搜索操作按鈕區域                            | -       | 自定義搜索按鈕 |
| `searchBeforeActions`| 搜索按鈕前置內容                            | -       | 添加前置操作 |
| `searchAfterActions` | 搜索按鈕後置內容                            | -       | 添加後置操作 |

### 動態插槽

| 名稱                | 説明                                      | 參數    | 使用場景 |
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
    
    <!-- 表格頂部批量操作 -->
    <template #tableTop>
      <div class="batch-actions">
        <el-button @click="batchDelete">批量刪除</el-button>
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

MaProTable 組件暴露了豐富的方法和屬性，讓你可以完全控制表格的行為。

### 子組件訪問

| 方法名                 | 説明                                  | 返回值                |
|-----------------------|---------------------------------------|----------------------|
| `getSearchRef()`      | 獲取搜索組件實例                       | `MaSearchExpose`     |
| `getTableRef()`       | 獲取表格組件實例                       | `MaTableExpose`      |
| `getElTableStates()`  | 獲取 Element Plus 表格狀態            | `any`                |

### 數據操作

| 方法名                | 説明                                  | 參數                                                            | 返回值              |
|----------------------|---------------------------------------|----------------------------------------------------------------|--------------------|
| `refresh()`          | 刷新表格數據                           | -                                                              | `Promise<void>`    |
| `requestData()`      | 重新請求表格數據                       | -                                                              | `Promise<void>`    |
| `changeApi()`        | 動態更換數據接口                       | `(api: () => any, isRequestNow: boolean) => void`             | `void`             |
| `setRequestParams()` | 設置請求參數                           | `(params: Record<string, any>, isRequestNow: boolean) => void` | `void`             |

### 列管理

| 方法名                | 説明                                  | 參數                                         | 返回值                    |
|----------------------|---------------------------------------|---------------------------------------------|-------------------------|
| `setTableColumns()`  | 動態設置表格列                         | `(cols: MaProTableColumns[]) => void`      | `void`                  |
| `getTableColumns()`  | 獲取當前表格列配置                     | -                                           | `MaProTableColumns[]`   |

### 搜索管理

| 方法名               | 説明                                  | 參數                                         | 返回值                    |
|---------------------|---------------------------------------|---------------------------------------------|-------------------------|
| `setSearchForm()`   | 設置搜索表單數據                       | `(form: Record<string, any>) => void`      | `void`                  |
| `getSearchForm()`   | 獲取搜索表單數據                       | -                                           | `Record<string, any>`   |
| `search()`          | 執行搜索操作                           | `(form: Record<string, any>) => void`      | `void`                  |

### 配置管理

| 方法名                  | 説明                                  | 參數                                         | 返回值                |
|------------------------|---------------------------------------|---------------------------------------------|----------------------|
| `setProTableOptions()` | 動態設置組件配置                       | `(opts: MaProTableOptions) => void`        | `void`               |
| `getProTableOptions()` | 獲取當前組件配置                       | -                                           | `MaProTableOptions`  |

### 工具方法

| 方法名              | 説明                                  | 參數 | 返回值              |
|--------------------|---------------------------------------|------|--------------------|
| `resizeHeight()`   | 重新計算表格高度                       | -    | `Promise<void>`    |
| `getCurrentId()`   | 獲取組件唯一標識                       | -    | `string`           |

### 使用示例

```vue
<template>
  <div>
    <el-button @click="handleRefresh">刷新數據</el-button>
    <el-button @click="handleSearch">搜索</el-button>
    <el-button @click="handleChangeApi">切換接口</el-button>
    
    <MaProTable ref="tableRef" :options="options" :schema="schema" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tableRef = ref()

// 刷新數據
const handleRefresh = async () => {
  await tableRef.value?.refresh()
  console.log('數據刷新完成')
}

// 執行搜索
const handleSearch = () => {
  tableRef.value?.search({ name: '張三', status: 1 })
}

// 動態切換接口
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
