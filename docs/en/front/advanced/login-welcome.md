# Login and Welcome Page  

:::tip  
This chapter explains the login page, login code invocation, and the configuration of the default page to redirect to after login.  
:::  

## Login Page  

The page is located at `src/modules/base/views/login/index.vue`. This page is essentially an integrated page where the login process is divided into multiple small components, which are imported and combined in `index.vue`.  
Among them, `<LoginForm />` represents the form login functionality. In the `IDE`, you can `Ctrl (or Command on Mac) + Click` to trace the code.  

::: info Modification Suggestion:  
First, it should be noted that the login form does not use the `Element Plus` component library but instead relies on `MineAdmin`'s own `Basic Component Library`. These components are very simple and only support the most basic functionalities.  
If you need to modify this page, it is not recommended to directly edit the source code to avoid affecting future `upgrades`.  

The `3.0` frontend supports the [Plugin](/en/front/high/plugin.md) feature. It is recommended to use a plugin to modify the `component` property of the `login` route, achieving the effect of `replacing the login page`.  

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
    <!-- Mobile compatibility below -->  
    <div class="min-[380px] relative left-0 top-0 z-4 h-full max-w-[1024px] w-full flex lg:hidden">  
      <Dashed />  
      <Light />  
    </div>  
  </div>  
</template>  
```  

## Login Code Invocation  

::: info  
If your actual development only involves modifying the `UI` and does not require changes to the `login process`, you can skip this section.  
:::  

The login invocation process is as follows:  

- The `login()` method in `src/store/modules/useUserStore.ts` internally saves authentication data such as `token`, `refresh_token`, and `expire_at`.  
- After the page redirects to the welcome page, it is intercepted by the `route guard`, which then requests basic user data.  
- The `requestUserInfo()` method in `src/store/modules/useUserStore.ts` retrieves basic data such as `user data, menu permissions, and roles`.  
- `requestUserInfo()` also performs a critical step: initializing `route data` by calling `routeStore.initRoutes()`.  

The above describes the entire login invocation process. If you still don’t understand, you can consult the community group or contact us.  

## Default Welcome Page Configuration  

After login, if there is a specified redirect route: `/#/login?redirect=[the route to redirect to after successful login]`, the system will redirect to the page specified in the parameter. However, this usually occurs when the authentication expires and redirects to the login page, carrying the previous page address. By default, after a successful login, the system redirects to the built-in default page, such as `index`, `dashboard`, etc.  

```ts  
welcomePage: {  
    name: 'welcome',  
    path: '/welcome',  
    title: 'Welcome Page',  
    icon: 'icon-park-outline:jewelry',  
}  
```  

::: info Configuration Suggestion:  
`3.0` allows you to configure the default welcome page, including its name, icon, description, etc. Open the `src/provider/settings/index.ts` file, locate the `welcomePage` configuration item, and modify it as needed.  

However, it is not recommended to directly edit this file. Instead, you can copy some parameters to the `settings.config.ts` file in the same directory. The system will automatically merge the configuration parameters without affecting the default settings.  
:::