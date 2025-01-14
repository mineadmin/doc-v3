# 路由和菜單

跟`2.x`一樣，系統基於 `vue-router` 提供了一套基礎的路由系統，分為**靜態路由**和**動態路由**。

## 路由、菜單説明

### 靜態路由
靜態路由是在前端事先定義好的，並在啓動時就已經確定的路由。
如果你的頁面不需要權限控制，可以直接使用靜態路由，系統內所有靜態路由配置都在 `src/router/static-routes` 目錄下；
由系統加載並與動態路由合併成最終的路由數據。

::: tip 未來構想
其實，本來可以做成`文件路由`模式，即**文件就是路由**。但目前沒有在 `MineAdmin` 內匹配到合適的場景，
或許未來哪天可能就加入文件路由系統了。
:::

### 動態路由
動態路由是在用户登錄後，請求了 `/admin/permission/menus` 接口，根據服務器返回的菜單權限數據動態生成的路由，
這一步還需要系統對服務器返回的數據轉換成前端所識別的路由，而後再轉換成可展示的菜單。

### 菜單

菜單是路由的另一種表現形式，不管靜態路由還是動態路由，最終都是將路由轉換成了菜單，展示在界面上，他們是息息相關的。

## 路由配置

### 基礎配置
首先，可以在 `#/types/global.d.ts` 內找到定義路由的數據類型 `MineRouter`，定義如下：
::: details 查看數據類型定義
```ts
declare namespace MineRoute {
  interface routeRecord {
    name?: string
    path?: string
    redirect?: string
    expand?: boolean
    component?: () => Promise<any>
    components?: () => Promise<any>
    meta?: RouteMeta
    children?: routeRecord[]
  }
  interface RouteMeta {
    title?: string | (() => string)
    i18n?: string | (() => string)
    badge?: () => string | number
    icon?: string
    affix?: boolean
    hidden?: boolean
    subForceShow?: boolean
    copyright?: boolean
    link?: string
    breadcrumb?: routeRecord[]
    breadcrumbEnable?: boolean
    activeName?: string
    cache?: boolean
    type?: 'M' | 'B' | 'I' | 'L' | string
    // 權限驗證配置
    auth?: string[]
    role?: string[]
    user?: string[]
  }
}
```
:::

路由重要配置在`meta`的元數據中定義着，可點擊查看上面的數據類型結構，以下為示例配置：

```ts {6-10}
const routes = [
  {
    name: 'welcome',
    path: '/welcome',
    component: () => import('~/base/views/welcome/index.vue'),
    meta: {
      icon: 'icon-park-outline:jewelry',
      title: '歡迎頁',
      i18n: 'menu.welcome',
    },
  },
];
```

### META 項説明

#### title

- 類型：`string`
- 默認值：`''`

用於配置路由的標題，會在菜單和標籤頁、瀏覽器標題中等其他場景顯示，如果沒有設置 `i18n` 項，則為默認顯示的標題。

#### icon

- 類型：`string`
- 默認值：`''`

用於配置路由的圖標，會在菜單、麪包屑和標籤頁中顯示。一般會配合圖標庫使用。

#### type

- 類型：`'M' | 'B' | 'I' | 'L'`
- 默認值：`''`

用於配置路由的類型 `M：菜單，B：按鈕，I：iFrame，L：外鏈`，在路由中 `B` 類型的路由不會顯示在菜單中且不可存在下級路由，
`I` 和 `L` 類型不可存在二級以及多級路由，只有 `M` 類型下可存在其他所有類型路由。

#### badge

- 類型：`string`
- 默認值：`''`

用於配置路由的徽標，會在菜單後面顯示出一個紅色背景的徽標，用於標記菜單的特殊性。

#### affix

- 類型：`boolean`
- 默認值：`false`

用於配置頁面是否默認固定在標籤頁。

#### cache

- 類型：`boolean`
- 默認值：`false`

用於配置頁面是是否緩存，如果開了此項，需要頁面裏定義：

`defineOptions({ name: '菜單的name' })`

#### hidden

- 類型：`boolean`
- 默認值：`false`

用於配置路由是否顯示在菜單內，雖然不顯示，但這個路由確實被註冊，可以通過輸入地址來訪問。

#### subForceShow

- 類型：`boolean`
- 默認值：`false`

用於配置路由是否強制顯示在子側邊欄，與 `hidden` 不衝突。

#### copyright

- 類型：`boolean`
- 默認值：`false`

用於配置頁面是否顯示底部的版權信息。

#### link

- 類型：`string`
- 默認值：`''`

用於配置外鏈和iFrame類型的菜單鏈接，此屬性只有在 `type === 'I' | 'L'` 才生效。

#### breadcrumb

- 類型：`routeRecord[]`
- 默認值：`[]`

此屬性可忽略，由系統內部自動處理。

#### breadcrumbEnable

- 類型：`boolean`
- 默認值：`false`

用於配置路由是否顯示在麪包屑。

#### activeName

- 類型：`string`
- 默認值：`''`

用於配置路由在激活後，哪個菜單為高亮形式。

#### auth

- 類型：`string[]`
- 默認值：`[]`

用於路由可由那些權限訪問

#### role

- 類型：`string[]`
- 默認值：`[]`

用於路由可由那些角色訪問

#### user

- 類型：`string[]`
- 默認值：`[]`

用於路由可由那些用户訪問