# 路由和菜单

跟`2.x`一样，系统基于 `vue-router` 提供了一套基础的路由系统，分为**静态路由**和**动态路由**。

## 路由、菜单说明

### 静态路由
静态路由是在前端事先定义好的，并在启动时就已经确定的路由。
如果你的页面不需要权限控制，可以直接使用静态路由，系统内所有静态路由配置都在 `src/router/static-routes` 目录下；
由系统加载并与动态路由合并成最终的路由数据。

::: tip 未来构想
其实，本来可以做成`文件路由`模式，即**文件就是路由**。但目前没有在 `MineAdmin` 内匹配到合适的场景，
或许未来哪天可能就加入文件路由系统了。


另外，在未来小版本更新中，可能会加入**前端权限控制**，就是说，静态路由也可以通过权限控制来控制是否注册或者显示路由。
:::

### 动态路由
动态路由是在用户登录后，请求了 `/admin/permission/menus` 接口，根据服务器返回的菜单权限数据动态生成的路由，
这一步还需要系统对服务器返回的数据转换成前端所识别的路由，而后再转换成可展示的菜单。

### 菜单

菜单是路由的另一种表现形式，不管静态路由还是动态路由，最终都是将路由转换成了菜单，展示在界面上，他们是息息相关的。

## 路由配置

### 基础配置
首先，可以在 `#/types/global.d.ts` 内找到定义路由的数据类型 `MineRouter`，定义如下：
::: details 查看数据类型定义
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
    // 权限验证配置
    auth?: string[]
    role?: string[]
    user?: string[]
  }
}
```
:::

路由重要配置在`meta`的元数据中定义着，可点击查看上面的数据类型结构，以下为示例配置：

```ts {6-10}
const routes = [
  {
    name: 'welcome',
    path: '/welcome',
    component: () => import('~/base/views/welcome/index.vue'),
    meta: {
      icon: 'icon-park-outline:jewelry',
      title: '欢迎页',
      i18n: 'menu.welcome',
    },
  },
];
```

### META 项说明

#### title

- 类型：`string`
- 默认值：`''`

用于配置路由的标题，会在菜单和标签页、浏览器标题中等其他场景显示，如果没有设置 `i18n` 项，则为默认显示的标题。

#### icon

- 类型：`string`
- 默认值：`''`

用于配置路由的图标，会在菜单、面包屑和标签页中显示。一般会配合图标库使用。

#### type

- 类型：`'M' | 'B' | 'I' | 'L'`
- 默认值：`''`

用于配置路由的类型 `M：菜单，B：按钮，I：iFrame，L：外链`，在路由中 `B` 类型的路由不会显示在菜单中且不可存在下级路由，
`I` 和 `L` 类型不可存在二级以及多级路由，只有 `M` 类型下可存在其他所有类型路由。

#### badge

- 类型：`string`
- 默认值：`''`

用于配置路由的徽标，会在菜单后面显示出一个红色背景的徽标，用于标记菜单的特殊性。

#### affix

- 类型：`boolean`
- 默认值：`false`

用于配置页面是否默认固定在标签页。

#### cache

- 类型：`boolean`
- 默认值：`false`

用于配置页面是是否缓存，如果开了此项，需要页面里定义：

`defineOptions({ name: '菜单的name' })`

#### hidden

- 类型：`boolean`
- 默认值：`false`

用于配置路由是否显示在菜单内，虽然不显示，但这个路由确实被注册，可以通过输入地址来访问。

#### subForceShow

- 类型：`boolean`
- 默认值：`false`

用于配置路由是否强制显示在子侧边栏，与 `hidden` 不冲突。

#### copyright

- 类型：`boolean`
- 默认值：`false`

用于配置页面是否显示底部的版权信息。

#### link

- 类型：`string`
- 默认值：`''`

用于配置外链和iFrame类型的菜单链接，此属性只有在 `type === 'I' | 'L'` 才生效。

#### breadcrumb

- 类型：`routeRecord[]`
- 默认值：`[]`

此属性可忽略，由系统内部自动处理。

#### breadcrumbEnable

- 类型：`boolean`
- 默认值：`false`

用于配置路由是否显示在面包屑。

#### activeName

- 类型：`string`
- 默认值：`''`

用于配置路由在激活后，哪个菜单为高亮形式。

#### auth

- 类型：`string[]`
- 默认值：`[]`

用于路由可由那些权限访问，注：还未完成，后续小版本更新加入。

#### role

- 类型：`string[]`
- 默认值：`[]`

用于路由可由那些角色访问，注：还未完成，后续小版本更新加入。

#### user

- 类型：`string[]`
- 默认值：`[]`

用于路由可由那些用户访问，注：还未完成，后续小版本更新加入。