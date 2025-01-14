# 路由和選單

跟`2.x`一樣，系統基於 `vue-router` 提供了一套基礎的路由系統，分為**靜態路由**和**動態路由**。

## 路由、選單說明

### 靜態路由
靜態路由是在前端事先定義好的，並在啟動時就已經確定的路由。
如果你的頁面不需要許可權控制，可以直接使用靜態路由，系統內所有靜態路由配置都在 `src/router/static-routes` 目錄下；
由系統載入並與動態路由合併成最終的路由資料。

::: tip 未來構想
其實，本來可以做成`檔案路由`模式，即**檔案就是路由**。但目前沒有在 `MineAdmin` 內匹配到合適的場景，
或許未來哪天可能就加入檔案路由系統了。
:::

### 動態路由
動態路由是在使用者登入後，請求了 `/admin/permission/menus` 介面，根據伺服器返回的選單許可權資料動態生成的路由，
這一步還需要系統對伺服器返回的資料轉換成前端所識別的路由，而後再轉換成可展示的選單。

### 選單

選單是路由的另一種表現形式，不管靜態路由還是動態路由，最終都是將路由轉換成了選單，展示在介面上，他們是息息相關的。

## 路由配置

### 基礎配置
首先，可以在 `#/types/global.d.ts` 內找到定義路由的資料型別 `MineRouter`，定義如下：
::: details 檢視資料型別定義
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
    // 許可權驗證配置
    auth?: string[]
    role?: string[]
    user?: string[]
  }
}
```
:::

路由重要配置在`meta`的元資料中定義著，可點選檢視上面的資料型別結構，以下為示例配置：

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

### META 項說明

#### title

- 型別：`string`
- 預設值：`''`

用於配置路由的標題，會在選單和標籤頁、瀏覽器標題中等其他場景顯示，如果沒有設定 `i18n` 項，則為預設顯示的標題。

#### icon

- 型別：`string`
- 預設值：`''`

用於配置路由的圖示，會在選單、麵包屑和標籤頁中顯示。一般會配合圖示庫使用。

#### type

- 型別：`'M' | 'B' | 'I' | 'L'`
- 預設值：`''`

用於配置路由的型別 `M：選單，B：按鈕，I：iFrame，L：外鏈`，在路由中 `B` 型別的路由不會顯示在選單中且不可存在下級路由，
`I` 和 `L` 型別不可存在二級以及多級路由，只有 `M` 型別下可存在其他所有型別路由。

#### badge

- 型別：`string`
- 預設值：`''`

用於配置路由的徽標，會在選單後面顯示出一個紅色背景的徽標，用於標記選單的特殊性。

#### affix

- 型別：`boolean`
- 預設值：`false`

用於配置頁面是否預設固定在標籤頁。

#### cache

- 型別：`boolean`
- 預設值：`false`

用於配置頁面是是否快取，如果開了此項，需要頁面裡定義：

`defineOptions({ name: '選單的name' })`

#### hidden

- 型別：`boolean`
- 預設值：`false`

用於配置路由是否顯示在選單內，雖然不顯示，但這個路由確實被註冊，可以透過輸入地址來訪問。

#### subForceShow

- 型別：`boolean`
- 預設值：`false`

用於配置路由是否強制顯示在子側邊欄，與 `hidden` 不衝突。

#### copyright

- 型別：`boolean`
- 預設值：`false`

用於配置頁面是否顯示底部的版權資訊。

#### link

- 型別：`string`
- 預設值：`''`

用於配置外鏈和iFrame型別的菜單鏈接，此屬性只有在 `type === 'I' | 'L'` 才生效。

#### breadcrumb

- 型別：`routeRecord[]`
- 預設值：`[]`

此屬性可忽略，由系統內部自動處理。

#### breadcrumbEnable

- 型別：`boolean`
- 預設值：`false`

用於配置路由是否顯示在麵包屑。

#### activeName

- 型別：`string`
- 預設值：`''`

用於配置路由在啟用後，哪個選單為高亮形式。

#### auth

- 型別：`string[]`
- 預設值：`[]`

用於路由可由那些許可權訪問

#### role

- 型別：`string[]`
- 預設值：`[]`

用於路由可由那些角色訪問

#### user

- 型別：`string[]`
- 預設值：`[]`

用於路由可由那些使用者訪問