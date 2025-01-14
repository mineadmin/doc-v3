# 登入與歡迎頁

:::tip
本章節講解登入頁面、登入程式碼呼叫、以及登入後預設跳轉的頁面配置
:::

## 登入頁面

頁面在 `src/modules/base/views/login/index.vue`，這個頁面實際是個整合頁面，登入分為很多小元件，由 `index.vue` 引入整合在一起。
其中，`<LoginForm />` 為表單登入功能，在 `IDE` 內 `ctrl(蘋果:COMMAND) + 單擊` 即可追蹤進去檢視程式碼。

::: info 修改建議：
首先說明一點，登入頁的表單並非 `Element plus` 元件庫，而是使用了 `MineAdmin` 自身的 `基礎元件庫`，這些元件非常簡陋、僅僅支援最普通的功能。
如果需要修改此頁面，不建議直接修改原始碼，以免影響後續 `升級` 的問題。

`3.0`的前端支援了[外掛](/zh-tw/front/high/plugin.md)功能，建議透過外掛的形式，來改變 `login` 路由的 `component` 屬性，達到`替換登入頁面`的效果

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
    <!-- 下面相容移動端的 -->
    <div class="min-[380px] relative left-0 top-0 z-4 h-full max-w-[1024px] w-full flex lg:hidden">
      <Dashed />
      <Light />
    </div>
  </div>
</template>
```

## 登入程式碼呼叫

::: info
如果實際開發中只是修改`UI`，不需要修改 `登入流程` 可跳過此段落。
:::

登入呼叫過程：

- `src/store/modules/useUserStore.ts` 下的 `login()` 方法，內部執行了儲存 `token`，`refresh_token`，`expire_at` 等認證資料。
- 頁面執行跳轉歡迎頁後，被 `路由守衛` 攔截，去請求使用者基礎資料。
- `src/store/modules/useUserStore.ts` 下的 `requestUserInfo()` 方法，請求了 `使用者資料、選單許可權、角色` 等基礎資料。
- 在 `requestUserInfo()` 還執行了重要的一步：初始化 `路由資料`，呼叫程式碼：`routeStore.initRoutes()`。

以上就是整個登入呼叫流程，如果還不懂，可以到交流群裡諮詢或者聯絡我們。

## 預設歡迎頁配置

登入後，如果有指定跳轉的路由：`/#/login?redirect=[登入成功跳轉的路由地址]`，則會跳轉到引數所攜帶的頁面，但這個一般在身份認證過期後
跳轉登入頁才會攜帶之前頁面地址，預設情況下，我們登入成功後都是跳轉到系統內建的預設頁面，比如：`index`, `dashboard` 等等。

```ts
welcomePage: {
    name: 'welcome',
    path: '/welcome',
    title: '歡迎頁',
    icon: 'icon-park-outline:jewelry',
}
```

::: info 配置建議
`3.0` 可配置預設歡迎頁面以及名稱、圖示、描述等，開啟 `src/provider/settings/index.ts` 檔案，找到 `welcomePage` 配置項，可配置此項。

但不建議直接修改這個檔案，可將部分引數 `copy` 到同級目錄的 `settings.config.ts` 檔案中，系統會自動合併配置引數，而影響預設配置。
:::

