# 插件系统

::: tip 插件系统说明
`3.0` 前端从核心层面支持了插件系统，相比 `2.0` 在设计之初没有考虑插件功能，
在改变系统界面或者行为、功能的时候都需要去修改源代码，而后导致后续无法升级，跟官方代码差别越来越大，
后面增加了应用商店功能，虽然可以强行支持插件，插件也必须修改源代码，而且在需要初始化的地方，插件无法去扩展实现，只能去修改 `main.js`。

**现在以上问题全部都不存在了，前端插件系统提供了强有力的支持，从替换界面、增加功能、引入第三方组件或者自研组件都可以无缝融入到系统里去，
而且还提供了多种 `hooks(钩子）` ，甚至可以去影响和改变前端的运行**
:::

## 插件数据类型介绍

::: info 类型定义文件
类型定义在 `types/global.d.ts` 内
:::

:::details 点击查看类型定义
```ts
declare namespace Plugin {

  /**
   * 插件基础信息
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
     * 是否开启插件
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
     * 插件禁用时，定义的hook不会被触发
     */
    hooks?: {
      // 插件启动时触发，比如可以设置 enable = false，阻止插件启动
      start?: (config: Config) => any | void
      // 插件在系统初始化完毕后触发，可调用Vue的上下文、inject等服务
      setup?: () => any | void
      // 注册路由时触发，可以对路由进行所有操作
      registerRoute?: (router: Router, routesRaw: Route.RouteRecordRaw[] | Plugin.Views[] | MineRoute.routeRecord[]) => any | void
      // 登录时触发
      login?: (formInfo: any) => any | void
      // 退出登录时触发
      logout?: () => any | void
      // 获取用户信息时触发
      getUserInfo?: (userInfo: any) => any | void
      // 路由跳转时钩子，外链形式路由不生效
      routerRedirect?: (route: RouteRecordRaw, router: Router) => any | void
      // 网络请求时钩子
      networkRequest?: (request: T) => any | void
      // 网络返回后钩子
      networkResponse?: (response: T) => any | void
    }
    [key: string]: T
  }
}
```
:::

## 创建插件

### 目录说明
所有插件都放在 `src/plugins` 目录下，且插件有别名 `$` 指向了此目录，插件跟后端结构相同，
由 `开发作者名称空间/插件名称` 组成插件目录。斜杠左边是**作者名称空间**，可在 [MineAdmin官网设置](https://www.mineadmin.com)，
斜杠右边则为**插件名称**，在这个作者名称空间下唯一。

插件目录示例：
- `mine-admin/app-store`  内置的应用商店插件
- `zhang-san/oss-uploader` 示例插件

::: tip 提示
本地直接在插件目录创建插件也可以被识别和使用。**只是无法上传到MineAdmin应用市场去！**
:::

### 文件说明
```bash
# 示例插件，目录地址：src/plugins
- zhang-san/     # 作者名称空间
-   demo/       # 插件目录
-     config.ts # 此为插件可发布的配置文件，以供开发者修改，而非修改插件源码。
-     index.ts  # 此为每个插件必须有的文件，存放了插件基础信息，启用、hooks定义内容。

```

### `index.ts` 配置
此文件是插件暴露给系统控制的文件，插件基础信息、是否启用、插件的初始化、引入第三方组件等等功能都在这里面定义。

以下是定义示例内容：
```ts
// 引入相关所需数据类型
import type { Router, RouteRecordRaw } from 'vue-router'
import type { MineToolbarExpose, Plugin } from '#/global'

// 定义插件
const pluginConfig: Plugin.PluginConfig = {
  // 插件安装方法，必须实现
  install(app) {
    // app 是当前 vue 的示例
    // 可通过 app 调用 vue 的 `use`、`component` 等函数去注册组件。
    // 此方法只会在插件状态为启用时执行一次，禁用后下次再启用也不会执行该方法。
  },
  // 插件基础信息，必须配置
  config: {
    // 是否启用，也可以根据 import.meta.env 环境变量来确定是否启用，必须打包后不可使用。
    enable: true, 
    // 基础信息
    info: {
      // 插件名称，和目录层级一致
      name: 'zhang-san/demo',
      // 插件版本
      version: '1.0.0',
      // 插件作者
      author: '张三',
      // 插件介绍
      description: '张三的演示插件',
      // 插件启动顺序，越大越先被启动执行，包括hooks
      order: 1
    },
  },
  // 插件 hooks 定义，非必须实现
  hooks: {
    // 插件在启动时被调用，会传入插件的 config 对象
    start: (config) => {},
    // 插件在系统执行到 `vue` 的 `setup` 生命周期时被调用。
    setup: () => {},
    // 在用户登录时被调用，传入(用户名、token等参数)
    login: (formInfo) => {},
    // 在用户退出时被调用
    logout: () => {},
    // 在请求用户信息后被调用，传入用户权限、角色等数据。
    getUserInfo: (userInfo) => {},
    // 在系统注册路由时被调用，传入了 `vue-router` 实例和路由原始数据。
    registerRoute: (router: Router, routesRaw) => {},
    // 在页面跳转时被调用，传入了当前路由的数据。
    routerRedirect: (route: RouteRecordRaw) => {},
    // 在网络请求时被调用，传入了原始的请求数据，可对数据加密之类的
    networkRequest: (request) => {},
    // 在服务器返回数据后被调用，传入了原始的响应数据。
    networkResponse: (response) => {},
  },
  // 插件页面，这里的静态路由数据会被系统自动注册。（非必须实现）
  views: [
    {
      name: 'zhangsan:demo:index',
      path: '/zhangsan/demo',
      component: () => import('./views/index.vue'),
      meta: {
        title: '张三的演示插件',
        i18n: '国际化的key',
      }
    }
  ]
}
```

::: info 大功告成
做完以上的事，插件就创建完成了，可以开始使用插件了。
:::

### 发布插件配置文件
如果插件有可默认使用的配置，又担心使用者改变了源配置文件，导致插件升级有麻烦，则可以使用插件配置发布命令。
```bash
# 在 ./web/ 的命令行界面，执行

pnpm plugin:publish zhang-san/demo
```

插件的配置文件会被发布到 `src/provider/plugins/config` 目录下，
依上述例子，文件名为：`zhang-san.demo.config.ts`

使用发布的配置文件
```ts
// 获取默认参数配置
const config = useGlobal().$pluginsConfig['zhang-san/demo']
```

## 动态启停插件
可通过 `usePluginStore()` 来动态控制某个插件的启用和停用

```ts
const { disabled, enabled } = usePluginStore()

// 启用插件
enbaled('zhang-san/demo')

// 停用插件
disabled('li-si/demo')
```

## 默认自带插件
在 `src/plugins/mine-admin` 下是官方插件，目前内置了：

- `basic-ui` 系统基础UI库
- `app-store` 应用市场
- `demo` 演示插件
