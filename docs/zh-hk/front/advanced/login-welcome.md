# 登錄與歡迎頁

:::tip
本章節講解登錄頁面、登錄代碼調用、以及登錄後默認跳轉的頁面配置
:::

## 登錄頁面

頁面在 `src/modules/base/views/login/index.vue`，這個頁面實際是個整合頁面，登錄分為很多小組件，由 `index.vue` 引入整合在一起。
其中，`<LoginForm />` 為表單登錄功能，在 `IDE` 內 `ctrl(蘋果:COMMAND) + 單擊` 即可追蹤進去查看代碼。

::: info 修改建議：
首先説明一點，登錄頁的表單並非 `Element plus` 組件庫，而是使用了 `MineAdmin` 自身的 `基礎組件庫`，這些組件非常簡陋、僅僅支持最普通的功能。
如果需要修改此頁面，不建議直接修改源碼，以免影響後續 `升級` 的問題。

`3.0`的前端支持了[插件](/zh-hk/front/high/plugin.md)功能，建議通過插件的形式，來改變 `login` 路由的 `component` 屬性，達到`替換登錄頁面`的效果

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
    <!-- 下面兼容移動端的 -->
    <div class="min-[380px] relative left-0 top-0 z-4 h-full max-w-[1024px] w-full flex lg:hidden">
      <Dashed />
      <Light />
    </div>
  </div>
</template>
```

## 登錄代碼調用

::: info
如果實際開發中只是修改`UI`，不需要修改 `登錄流程` 可跳過此段落。
:::

登錄調用過程：

- `src/store/modules/useUserStore.ts` 下的 `login()` 方法，內部執行了保存 `token`，`refresh_token`，`expire_at` 等認證數據。
- 頁面執行跳轉歡迎頁後，被 `路由守衞` 攔截，去請求用户基礎數據。
- `src/store/modules/useUserStore.ts` 下的 `requestUserInfo()` 方法，請求了 `用户數據、菜單權限、角色` 等基礎數據。
- 在 `requestUserInfo()` 還執行了重要的一步：初始化 `路由數據`，調用代碼：`routeStore.initRoutes()`。

以上就是整個登錄調用流程，如果還不懂，可以到交流羣裏諮詢或者聯繫我們。

## 默認歡迎頁配置

登錄後，如果有指定跳轉的路由：`/#/login?redirect=[登錄成功跳轉的路由地址]`，則會跳轉到參數所攜帶的頁面，但這個一般在身份認證過期後
跳轉登錄頁才會攜帶之前頁面地址，默認情況下，我們登錄成功後都是跳轉到系統內置的默認頁面，比如：`index`, `dashboard` 等等。

```ts
welcomePage: {
    name: 'welcome',
    path: '/welcome',
    title: '歡迎頁',
    icon: 'icon-park-outline:jewelry',
}
```

::: info 配置建議
`3.0` 可配置默認歡迎頁面以及名稱、圖標、描述等，打開 `src/provider/settings/index.ts` 文件，找到 `welcomePage` 配置項，可配置此項。

但不建議直接修改這個文件，可將部分參數 `copy` 到同級目錄的 `settings.config.ts` 文件中，系統會自動合併配置參數，而影響默認配置。
:::

