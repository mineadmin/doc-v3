# 外掛系統

::: tip 外掛系統說明
`3.0` 前端從核心層面支援了外掛系統，相比 `2.0` 在設計之初沒有考慮外掛功能，
在改變系統介面或者行為、功能的時候都需要去修改原始碼，而後導致後續無法升級，跟官方程式碼差別越來越大，
後面增加了應用商店功能，雖然可以強行支援外掛，外掛也必須修改原始碼，而且在需要初始化的地方，外掛無法去擴充套件實現，只能去修改 `main.js`。

**現在以上問題全部都不存在了，前端外掛系統提供了強有力的支援，從替換介面、增加功能、引入第三方元件或者自研元件都可以無縫融入到系統裡去，
而且還提供了多種 `hooks(鉤子）` ，甚至可以去影響和改變前端的執行**
:::

## 外掛資料型別介紹

::: info 型別定義檔案
型別定義在 `types/global.d.ts` 內
:::

:::details 點選檢視型別定義
```ts
declare namespace Plugin {

  /**
   * 外掛基礎資訊
   */
  interface Info {
    name: string
    version: string
    author: string
    description: string
    order?: number
  }

  interface Config {
    /**
     * 外掛資訊
     */
    info: Info
    /**
     * 是否開啟外掛
     */
    enable: boolean
  }

  interface Views extends Route.RouteRecordRaw {}

  interface PluginConfig {
    install: (app: App) => void
    config: Config
    views?: Views[]
    /**
     * 外掛hooks
     * 外掛停用時，定義的hook不會被觸發
     */
    hooks?: {
      // 外掛啟動時觸發，比如可以設定 enable = false，阻止外掛啟動
      start?: (config: Config) => any | void
      // 外掛在系統初始化完畢後觸發，可呼叫Vue的上下文、inject等服務
      setup?: () => any | void
      // 註冊路由時觸發，可以對路由進行所有操作
      registerRoute?: (router: Router, routesRaw: Route.RouteRecordRaw[] | Plugin.Views[] | MineRoute.routeRecord[]) => any | void
      // 登入時觸發
      login?: (formInfo: any) => any | void
      // 退出登入時觸發
      logout?: () => any | void
      // 獲取使用者資訊時觸發
      getUserInfo?: (userInfo: any) => any | void
      // 路由跳轉時鉤子，外鍊形式路由不生效
      routerRedirect?: (route: RouteRecordRaw, router: Router) => any | void
      // 網路請求時鉤子
      networkRequest?: (request: T) => any | void
      // 網路返回後鉤子
      networkResponse?: (response: T) => any | void
    }
    [key: string]: T
  }
}
```
:::

## 建立外掛

### 目錄說明
所有外掛都放在 `src/plugins` 目錄下，且外掛有別名 `$` 指向了此目錄，外掛跟後端結構相同，
由 `開發作者名稱空間/外掛名稱` 組成外掛目錄。斜槓左邊是**作者名稱空間**，可在 [MineAdmin官網設定](https://www.mineadmin.com)，
斜槓右邊則為**外掛名稱**，在這個作者名稱空間下唯一。

外掛目錄示例：
- `mine-admin/app-store`  內建的應用商店外掛
- `zhang-san/oss-uploader` 示例外掛

::: tip 提示
本地直接在外掛目錄建立外掛也可以被識別和使用。**只是無法上傳到MineAdmin應用市場去！**
:::

### 檔案說明
```bash
# 示例外掛，目錄地址：src/plugins
- zhang-san/     # 作者名稱空間
-   demo/       # 外掛目錄
-     config.ts # 此為外掛可釋出的配置檔案，以供開發者修改，而非修改外掛原始碼。
-     index.ts  # 此為每個外掛必須有的檔案，存放了外掛基礎資訊，啟用、hooks定義內容。

```

### `index.ts` 配置
此檔案是外掛暴露給系統控制的檔案，外掛基礎資訊、是否啟用、外掛的初始化、引入第三方元件等等功能都在這裡面定義。

以下是定義示例內容：
```ts
// 引入相關所需資料型別
import type { Router, RouteRecordRaw } from 'vue-router'
import type { MineToolbarExpose, Plugin } from '#/global'

// 定義外掛
const pluginConfig: Plugin.PluginConfig = {
  // 外掛安裝方法，必須實現
  install(app) {
    // app 是當前 vue 的示例
    // 可透過 app 呼叫 vue 的 `use`、`component` 等函式去註冊元件。
    // 此方法只會在外掛狀態為啟用時執行一次，停用後下次再啟用也不會執行該方法。
  },
  // 外掛基礎資訊，必須配置
  config: {
    // 是否啟用，也可以根據 import.meta.env 環境變數來確定是否啟用，比如打包後不可使用。
    enable: true, 
    // 基礎資訊
    info: {
      // 外掛名稱，和目錄層級一致
      name: 'zhang-san/demo',
      // 外掛版本
      version: '1.0.0',
      // 外掛作者
      author: '張三',
      // 外掛介紹
      description: '張三的演示外掛',
      // 外掛啟動順序，越大越先被啟動執行，包括hooks
      order: 1
    },
  },
  // 外掛 hooks 定義，非必須實現
  hooks: {
    // 外掛在啟動時被呼叫，會傳入外掛的 config 物件
    start: (config) => {},
    // 外掛在系統執行到 `vue` 的 `setup` 生命週期時被呼叫。
    setup: () => {},
    // 在使用者登入時被呼叫，傳入(使用者名稱、token等引數)
    login: (formInfo) => {},
    // 在使用者退出時被呼叫
    logout: () => {},
    // 在請求使用者資訊後被呼叫，傳入使用者許可權、角色等資料。
    getUserInfo: (userInfo) => {},
    // 在系統註冊路由時被呼叫，傳入了 `vue-router` 例項和路由原始資料。
    registerRoute: (router: Router, routesRaw) => {},
    // 在頁面跳轉時被呼叫，傳入了原路由和新路由的資料、以及 `vue-router` 例項。注意：外鏈不生效
    routerRedirect: ({ oldRoute: RouteRecordRaw, newRoute: RouteRecordRaw }, router: Router) => {},
    // 在網路請求時被呼叫，傳入了原始的請求資料，可對資料加密之類的
    networkRequest: (request) => {},
    // 在伺服器返回資料後被呼叫，傳入了原始的響應資料。
    networkResponse: (response) => {},
  },
  // 外掛頁面，這裡的靜態路由資料會被系統自動註冊。（非必須實現）
  views: [
    {
      name: 'zhangsan:demo:index',
      path: '/zhangsan/demo',
      component: () => import('./views/index.vue'),
      meta: {
        title: '張三的演示外掛',
        i18n: '國際化的key',
      }
    }
  ]
}
```

::: info 大功告成
做完以上的事，外掛就建立完成了，可以開始使用外掛了。
:::

### 釋出外掛配置檔案
如果外掛有可預設使用的配置，又擔心使用者改變了源配置檔案，導致外掛升級有麻煩，則可以使用外掛配置釋出命令。
```bash
# 在 ./web/ 的命令列介面，執行

pnpm plugin:publish zhang-san/demo
```

外掛的配置檔案會被髮布到 `src/provider/plugins/config` 目錄下，
依上述例子，檔名為：`zhang-san.demo.config.ts`

使用釋出的配置檔案
```ts
// 獲取預設引數配置
const config = useGlobal().$pluginsConfig['zhang-san/demo']
```

## 動態啟停外掛
可透過 `usePluginStore()` 來動態控制某個外掛的啟用和停用

```ts
const { disabled, enabled } = usePluginStore()

// 啟用外掛
enbaled('zhang-san/demo')

// 停用外掛
disabled('li-si/demo')
```

## 預設自帶外掛
在 `src/plugins/mine-admin` 下是官方外掛，目前內建了：

- `basic-ui` 系統基礎UI庫
- `app-store` 應用市場
- `demo` 演示外掛
