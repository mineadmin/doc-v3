# 插件系統

::: tip 插件系統説明
`3.0` 前端從核心層面支持了插件系統，相比 `2.0` 在設計之初沒有考慮插件功能，
在改變系統界面或者行為、功能的時候都需要去修改源代碼，而後導致後續無法升級，跟官方代碼差別越來越大，
後面增加了應用商店功能，雖然可以強行支持插件，插件也必須修改源代碼，而且在需要初始化的地方，插件無法去擴展實現，只能去修改 `main.js`。

**現在以上問題全部都不存在了，前端插件系統提供了強有力的支持，從替換界面、增加功能、引入第三方組件或者自研組件都可以無縫融入到系統裏去，
而且還提供了多種 `hooks(鈎子）` ，甚至可以去影響和改變前端的運行**
:::

## 插件數據類型介紹

::: info 類型定義文件
類型定義在 `types/global.d.ts` 內
:::

:::details 點擊查看類型定義
```ts
declare namespace Plugin {

  /**
   * 插件基礎信息
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
     * 插件信息
     */
    info: Info
    /**
     * 是否開啓插件
     */
    enable: boolean
  }

  interface Views extends Route.RouteRecordRaw {}

  interface PluginConfig {
    install: (app: App) => void
    config: Config
    views?: Views[]
    /**
     * 插件hooks
     * 插件禁用時，定義的hook不會被觸發
     */
    hooks?: {
      // 插件啓動時觸發，比如可以設置 enable = false，阻止插件啓動
      start?: (config: Config) => any | void
      // 插件在系統初始化完畢後觸發，可調用Vue的上下文、inject等服務
      setup?: () => any | void
      // 註冊路由時觸發，可以對路由進行所有操作
      registerRoute?: (router: Router, routesRaw: Route.RouteRecordRaw[] | Plugin.Views[] | MineRoute.routeRecord[]) => any | void
      // 登錄時觸發
      login?: (formInfo: any) => any | void
      // 退出登錄時觸發
      logout?: () => any | void
      // 獲取用户信息時觸發
      getUserInfo?: (userInfo: any) => any | void
      // 路由跳轉時鈎子，外鍊形式路由不生效
      routerRedirect?: (route: RouteRecordRaw, router: Router) => any | void
      // 網絡請求時鈎子
      networkRequest?: (request: T) => any | void
      // 網絡返回後鈎子
      networkResponse?: (response: T) => any | void
    }
    [key: string]: T
  }
}
```
:::

## 創建插件

### 目錄説明
所有插件都放在 `src/plugins` 目錄下，且插件有別名 `$` 指向了此目錄，插件跟後端結構相同，
由 `開發作者名稱空間/插件名稱` 組成插件目錄。斜槓左邊是**作者名稱空間**，可在 [MineAdmin官網設置](https://www.mineadmin.com)，
斜槓右邊則為**插件名稱**，在這個作者名稱空間下唯一。

插件目錄示例：
- `mine-admin/app-store`  內置的應用商店插件
- `zhang-san/oss-uploader` 示例插件

::: tip 提示
本地直接在插件目錄創建插件也可以被識別和使用。**只是無法上傳到MineAdmin應用市場去！**
:::

### 文件説明
```bash
# 示例插件，目錄地址：src/plugins
- zhang-san/     # 作者名稱空間
-   demo/       # 插件目錄
-     config.ts # 此為插件可發佈的配置文件，以供開發者修改，而非修改插件源碼。
-     index.ts  # 此為每個插件必須有的文件，存放了插件基礎信息，啓用、hooks定義內容。

```

### `index.ts` 配置
此文件是插件暴露給系統控制的文件，插件基礎信息、是否啓用、插件的初始化、引入第三方組件等等功能都在這裏面定義。

以下是定義示例內容：
```ts
// 引入相關所需數據類型
import type { Router, RouteRecordRaw } from 'vue-router'
import type { MineToolbarExpose, Plugin } from '#/global'

// 定義插件
const pluginConfig: Plugin.PluginConfig = {
  // 插件安裝方法，必須實現
  install(app) {
    // app 是當前 vue 的示例
    // 可通過 app 調用 vue 的 `use`、`component` 等函數去註冊組件。
    // 此方法只會在插件狀態為啓用時執行一次，禁用後下次再啓用也不會執行該方法。
  },
  // 插件基礎信息，必須配置
  config: {
    // 是否啓用，也可以根據 import.meta.env 環境變量來確定是否啓用，比如打包後不可使用。
    enable: true, 
    // 基礎信息
    info: {
      // 插件名稱，和目錄層級一致
      name: 'zhang-san/demo',
      // 插件版本
      version: '1.0.0',
      // 插件作者
      author: '張三',
      // 插件介紹
      description: '張三的演示插件',
      // 插件啓動順序，越大越先被啓動執行，包括hooks
      order: 1
    },
  },
  // 插件 hooks 定義，非必須實現
  hooks: {
    // 插件在啓動時被調用，會傳入插件的 config 對象
    start: (config) => {},
    // 插件在系統執行到 `vue` 的 `setup` 生命週期時被調用。
    setup: () => {},
    // 在用户登錄時被調用，傳入(用户名、token等參數)
    login: (formInfo) => {},
    // 在用户退出時被調用
    logout: () => {},
    // 在請求用户信息後被調用，傳入用户權限、角色等數據。
    getUserInfo: (userInfo) => {},
    // 在系統註冊路由時被調用，傳入了 `vue-router` 實例和路由原始數據。
    registerRoute: (router: Router, routesRaw) => {},
    // 在頁面跳轉時被調用，傳入了原路由和新路由的數據、以及 `vue-router` 實例。注意：外鏈不生效
    routerRedirect: ({ oldRoute: RouteRecordRaw, newRoute: RouteRecordRaw }, router: Router) => {},
    // 在網絡請求時被調用，傳入了原始的請求數據，可對數據加密之類的
    networkRequest: (request) => {},
    // 在服務器返回數據後被調用，傳入了原始的響應數據。
    networkResponse: (response) => {},
  },
  // 插件頁面，這裏的靜態路由數據會被系統自動註冊。（非必須實現）
  views: [
    {
      name: 'zhangsan:demo:index',
      path: '/zhangsan/demo',
      component: () => import('./views/index.vue'),
      meta: {
        title: '張三的演示插件',
        i18n: '國際化的key',
      }
    }
  ]
}
```

::: info 大功告成
做完以上的事，插件就創建完成了，可以開始使用插件了。
:::

### 發佈插件配置文件
如果插件有可默認使用的配置，又擔心使用者改變了源配置文件，導致插件升級有麻煩，則可以使用插件配置發佈命令。
```bash
# 在 ./web/ 的命令行界面，執行

pnpm plugin:publish zhang-san/demo
```

插件的配置文件會被髮布到 `src/provider/plugins/config` 目錄下，
依上述例子，文件名為：`zhang-san.demo.config.ts`

使用發佈的配置文件
```ts
// 獲取默認參數配置
const config = useGlobal().$pluginsConfig['zhang-san/demo']
```

## 動態啓停插件
可通過 `usePluginStore()` 來動態控制某個插件的啓用和停用

```ts
const { disabled, enabled } = usePluginStore()

// 啓用插件
enbaled('zhang-san/demo')

// 停用插件
disabled('li-si/demo')
```

## 默認自帶插件
在 `src/plugins/mine-admin` 下是官方插件，目前內置了：

- `basic-ui` 系統基礎UI庫
- `app-store` 應用市場
- `demo` 演示插件
