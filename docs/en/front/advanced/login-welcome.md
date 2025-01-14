# Login and Welcome Page

:::tip
This chapter explains the login page, login code invocation, and the configuration of the default page to which the user is redirected after logging in.
:::

## Login Page

The page is located at `src/modules/base/views/login/index.vue`. This page is actually an integrated page, where the login process is divided into many small components, which are then combined together by `index.vue`.
Among these, `<LoginForm />` is responsible for the form login functionality. You can trace the code by using `ctrl (or COMMAND on Mac) + click` in the `IDE`.

::: info Modification Suggestion:
First, it's important to note that the form on the login page is not from the `Element plus` component library but uses `MineAdmin`'s own `basic component library`. These components are very basic and only support the most ordinary functionalities.
If you need to modify this page, it is not recommended to directly alter the source code to avoid issues with future `upgrades`.

The `3.0` version of the frontend supports [plugins](/en/front/high/plugin.md). It is suggested to use plugins to change the `component` property of the `login` route, achieving the effect of `replacing the login page`.

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
If in actual development you only need to modify the `UI` and do not need to change the `login process`, you can skip this section.
:::

The login invocation process is as follows:

- The `login()` method under `src/store/modules/useUserStore.ts` internally executes the saving of `token`, `refresh_token`, `expire_at`, and other authentication data.
- After the page redirects to the welcome page, it is intercepted by the `route guard`, which then requests the user's basic data.
- The `requestUserInfo()` method under `src/store/modules/useUserStore.ts` requests `user data, menu permissions, roles`, and other basic data.
- An important step is also executed in `requestUserInfo()`: initializing the `route data`, with the invocation code: `routeStore.initRoutes()`.

The above is the entire login invocation process. If you still don't understand, you can consult in the communication group or contact us.

## Default Welcome Page Configuration

After logging in, if there is a specified redirect route: `/#/login?redirect=[the route address to redirect to after successful login]`, it will redirect to the page carried by the parameter. However, this usually happens when the identity authentication expires and redirects to the login page, carrying the previous page address. By default, after a successful login, we are redirected to the system's built-in default page, such as: `index`, `dashboard`, etc.

```ts
welcomePage: {
    name: 'welcome',
    path: '/welcome',
    title: 'Welcome Page',
    icon: 'icon-park-outline:jewelry',
}
```

::: info Configuration Suggestion
`3.0` allows configuring the default welcome page along with its name, icon, description, etc. Open the `src/provider/settings/index.ts` file, find the `welcomePage` configuration item, and you can configure this item.

However, it is not recommended to directly modify this file. You can copy some parameters to the `settings.config.ts` file in the same directory, and the system will automatically merge the configuration parameters without affecting the default configuration.
:::