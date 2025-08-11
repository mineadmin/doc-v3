# Login and Welcome Page

:::tip  
This section explains the login page, login code invocation, and the configuration of the default redirect page after login.  
:::

## Login Page  

The page is located at `src/modules/base/views/login/index.vue`. This page is essentially an integrated page where the login process is divided into multiple small components, which are combined together by `index.vue`.  
Among them, `<LoginForm />` handles form login functionality. In the `IDE`, you can `Ctrl (Command on Mac) + Click` to trace and view the code.  

::: info Modification Suggestions:  
First, it’s important to note that the login form does not use the `Element Plus` component library but instead relies on `MineAdmin`'s own `Basic Component Library`. These components are very simplistic and only support the most basic functionalities.  
If you need to modify this page, it is not recommended to directly edit the source code to avoid issues with future `upgrades`.  

`3.0` introduces [plugin](/en/front/high/plugin.md) functionality for the frontend. It is recommended to use a plugin to modify the `component` property of the `login` route, achieving the effect of `replacing the login page`.  

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
    <!-- Below is for mobile compatibility -->
    <div class="min-[380px] relative left-0 top-0 z-4 h-full max-w-[1024px] w-full flex lg:hidden">
      <Dashed />
      <Light />
    </div>
  </div>
</template>
```

## Login Code Invocation  

::: info  
If your development only involves modifying the `UI` and does not require changes to the `login process`, you can skip this section.  
::  

The login invocation process:  

1. The `login()` method in `src/store/modules/useUserStore.ts` internally saves authentication data such as `token`, `refresh_token`, and `expire_at`.  
2. After the page redirects to the welcome page, it is intercepted by the `route guard`, which then requests basic user data.  
3. The `requestUserInfo()` method in `src/store/modules/useUserStore.ts` fetches basic data such as `user information, menu permissions, and roles`.  
4. A critical step in `requestUserInfo()` is the initialization of `route data`, invoked via `routeStore.initRoutes()`.  

The above outlines the entire login invocation process. If you still have questions, feel free to ask in the community group or contact us.  

## Default Welcome Page Configuration  

After login, if a redirect route is specified: `/#/login?redirect=[route address after successful login]`, the system will redirect to the page specified in the parameter. However, this typically occurs when authentication expires and redirects to the login page while carrying the previous page address. By default, after a successful login, the system redirects to a built-in default page, such as `index`, `dashboard`, etc.  

```ts
welcomePage: {
    name: 'welcome',
    path: '/welcome',
    title: 'Welcome Page',
    icon: 'icon-park-outline:jewelry',
}
```

::: info Configuration Suggestions:  
`3.0` allows configuration of the default welcome page, including its name, icon, description, etc. Open the `src/provider/settings/index.ts` file and locate the `welcomePage` configuration item to adjust these settings.  

However, it is not recommended to directly modify this file. Instead, you can copy some parameters to the `settings.config.ts` file in the same directory. The system will automatically merge these configuration parameters without affecting the default settings.  
:::