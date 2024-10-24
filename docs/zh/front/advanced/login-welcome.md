# 登录与欢迎页

:::tip
本章节讲解登录页面、登录代码调用、以及登录后默认跳转的页面配置
:::

## 登录页面

页面在 `src/modules/base/views/login/index.vue`，这个页面实际是个整合页面，登录分为很多小组件，由 `index.vue` 引入整合在一起。
其中，`<LoginForm />` 为表单登录功能，在 `IDE` 内 `ctrl(苹果:COMMAND) + 单击` 即可追踪进去查看代码。

::: info 修改建议：
首先说明一点，登录页的表单并非 `Element plus` 组件库，而是使用了 `MineAdmin` 自身的 `基础组件库`，这些组件非常简陋、仅仅支持最普通的功能。
如果需要修改此页面，不建议直接修改源码，以免影响后续 `升级` 的问题。

`3.0`的前端支持了[插件](/zh/front/high/plugin.md)功能，建议通过插件的形式，来改变 `login` 路由的 `component` 属性，达到`替换登录页面`的效果

:::

```vue
<template>
  <div class="h-full min-w-[380px] w-full flex items-center justify-center overflow-hidden border-1 bg-blue-950 lg:justify-between lg:bg-white">
    <div class="relative hidden h-full w-10/12 md:hidden lg:flex">
      <div class="gradient-rainbow" />
      <Dashed />
      <Light />
      <Slogan />
      <OneWord />
    </div>
    <div class="login-form-container">
      <Logo />
      <LoginForm />
      <CopyRight />
    </div>
    <!-- 下面兼容移动端的 -->
    <div class="min-[380px] relative left-0 top-0 z-4 h-full max-w-[1024px] w-full flex lg:hidden">
      <Dashed />
      <Light />
    </div>
  </div>
</template>
```

## 登录代码调用

::: info
如果实际开发中只是修改`UI`，不需要修改 `登录流程` 可跳过此段落。
:::

登录调用过程：

- `src/store/modules/useUserStore.ts` 下的 `login()` 方法，内部执行了保存 `token`，`refresh_token`，`expire_at` 等认证数据。
- 页面执行跳转欢迎页后，被 `路由守卫` 拦截，去请求用户基础数据。
- `src/store/modules/useUserStore.ts` 下的 `requestUserInfo()` 方法，请求了 `用户数据、菜单权限、角色` 等基础数据。
- 在 `requestUserInfo()` 还执行了重要的一步：初始化 `路由数据`，调用代码：`routeStore.initRoutes()`。

以上就是整个登录调用流程，如果还不懂，可以到交流群里咨询或者联系我们。

## 默认欢迎页配置

登录后，如果有指定跳转的路由：`/#/login?redirect=[登录成功跳转的路由地址]`，则会跳转到参数所携带的页面，但这个一般在身份认证过期后
跳转登录页才会携带之前页面地址，默认情况下，我们登录成功后都是跳转到系统内置的默认页面，比如：`index`, `dashboard` 等等。

```ts
welcomePage: {
    name: 'welcome',
    path: '/welcome',
    title: '欢迎页',
    icon: 'icon-park-outline:jewelry',
}
```

::: info 配置建议
`3.0` 可配置默认欢迎页面以及名称、图标、描述等，打开 `src/provider/settings/index.ts` 文件，找到 `welcomePage` 配置项，可配置此项。

但不建议直接修改这个文件，可将部分参数 `copy` 到同级目录的 `settings.config.ts` 文件中，系统会自动合并配置参数，而影响默认配置。
:::

