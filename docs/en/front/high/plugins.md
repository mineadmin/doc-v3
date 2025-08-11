# Plugin System

::: tip Plugin System Overview  
The `3.0` frontend natively supports a plugin system. Unlike `2.0`, which was not designed with plugin functionality in mind, modifying the system's interface or behavior in `2.0` required altering the source code. This led to difficulties in future upgrades and growing divergence from the official codebase.  
Although an app store feature was later introduced to forcibly support plugins, plugins still had to modify source code. Additionally, plugins could not extend initialization logic and had to modify `main.js` directly.  

**Now, all these issues are resolved. The frontend plugin system provides robust support, seamlessly integrating features such as interface replacement, functionality expansion, third-party components, or custom components into the system. It also offers various `hooks` that can even influence and alter the frontend's runtime behavior.**  
:::

## Plugin Data Types  

::: info Type Definitions  
Type definitions are located in `types/global.d.ts`.  
:::

:::details Click to View Type Definitions  
```ts
declare namespace Plugin {

  /**
   * Basic Plugin Information  
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
     * Plugin information  
     */
    info: Info
    /**
     * Whether the plugin is enabled  
     */
    enable: boolean
  }

  interface Views extends Route.RouteRecordRaw {}

  interface PluginConfig {
    install: (app: App) => void
    config: Config
    views?: Views[]
    /**
     * Plugin hooks  
     * Defined hooks will not trigger if the plugin is disabled.  
     */
    hooks?: {
      // Triggered when the plugin starts. For example, setting `enable = false` can prevent plugin activation.  
      start?: (config: Config) => any | void
      // Triggered after system initialization. Can access Vue context, inject services, etc.  
      setup?: () => any | void
      // Triggered during route registration. Allows full manipulation of routes.  
      registerRoute?: (router: Router, routesRaw: Route.RouteRecordRaw[] | Plugin.Views[] | MineRoute.routeRecord[]) => any | void
      // Triggered on login.  
      login?: (formInfo: any) => any | void
      // Triggered on logout.  
      logout?: () => any | void
      // Triggered when fetching user info.  
      getUserInfo?: (userInfo: any) => any | void
      // Route navigation hook (does not apply to external links).  
      routerRedirect?: (route: RouteRecordRaw, router: Router) => any | void
      // Network request hook.  
      networkRequest?: (request: T) => any | void
      // Network response hook.  
      networkResponse?: (response: T) => any | void
    }
    [key: string]: T
  }
}
```
:::

## Creating a Plugin  

### Directory Structure  
All plugins are placed under `src/plugins`. The directory has an alias `$` pointing to it. The structure mirrors the backend, consisting of `developer-namespace/plugin-name`.  
The left side of the slash is the **developer namespace**, which can be configured on the [MineAdmin website](https://www.mineadmin.com). The right side is the **plugin name**, unique within that namespace.  

Example plugin directories:  
- `mine-admin/app-store` – Built-in app store plugin  
- `zhang-san/oss-uploader` – Example plugin  

::: tip Note  
Plugins created locally in the plugin directory can still be recognized and used. **However, they cannot be uploaded to the MineAdmin App Market!**  
:::

### File Structure  
```bash
# Example plugin directory: src/plugins  
- zhang-san/     # Developer namespace  
-   demo/       # Plugin directory  
-     config.ts # Plugin configuration file for distribution (to avoid modifying source code).  
-     index.ts  # Mandatory file containing plugin metadata, activation status, and hooks.  
```

### `index.ts` Configuration  
This file exposes plugin controls to the system, including metadata, activation status, initialization, and third-party component integration.  

Example configuration:  
```ts
// Import required types  
import type { Router, RouteRecordRaw } from 'vue-router'  
import type { MineToolbarExpose, Plugin } from '#/global'  

// Define the plugin  
const pluginConfig: Plugin.PluginConfig = {  
  // Mandatory installation method  
  install(app) {  
    // `app` is the Vue instance  
    // Use `app` to call Vue's `use`, `component`, etc., to register components.  
    // This method runs only once when the plugin is enabled.  
  },  
  // Mandatory plugin metadata  
  config: {  
    // Activation status. Can use `import.meta.env` for environment-based control.  
    enable: true,   
    // Metadata  
    info: {  
      // Plugin name (matches directory structure)  
      name: 'zhang-san/demo',  
      // Plugin version  
      version: '1.0.0',  
      // Plugin author  
      author: '张三',  
      // Plugin description  
      description: '张三的演示插件',  
      // Startup order (higher values execute earlier, including hooks)  
      order: 1  
    },  
  },  
  // Optional hooks  
  hooks: {  
    // Triggered on plugin startup (receives config object)  
    start: (config) => {},  
    // Triggered during Vue's `setup` lifecycle  
    setup: () => {},  
    // Triggered on login (receives username, token, etc.)  
    login: (formInfo) => {},  
    // Triggered on logout  
    logout: () => {},  
    // Triggered after fetching user info (receives permissions, roles, etc.)  
    getUserInfo: (userInfo) => {},  
    // Triggered during route registration (receives router instance and raw routes)  
    registerRoute: (router: Router, routesRaw) => {},  
    // Triggered on page navigation (receives old/new routes and router instance; external links excluded)  
    routerRedirect: ({ oldRoute: RouteRecordRaw, newRoute: RouteRecordRaw }, router: Router) => {},  
    // Triggered on network requests (receives raw request data; e.g., for encryption)  
    networkRequest: (request) => {},  
    // Triggered on server response (receives raw response data)  
    networkResponse: (response) => {},  
  },  
  // Plugin views (optional; static routes auto-registered by the system)  
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

::: info Success!  
With the above steps completed, the plugin is ready for use.  
:::

### Publishing Plugin Configurations  
If a plugin has default configurations but users might modify them (causing upgrade issues), use the plugin config publish command:  
```bash  
# Run in the `./web/` CLI:  
pnpm plugin:publish zhang-san/demo  
```  

The config file will be published to `src/provider/plugins/config`.  
For the example above, the filename would be: `zhang-san.demo.config.ts`.  

Using the published config:  
```ts  
// Retrieve default config  
const config = useGlobal().$pluginsConfig['zhang-san/demo']  
```  

## Dynamically Enabling/Disabling Plugins  
Use `usePluginStore()` to control plugin activation:  

```ts  
const { disabled, enabled } = usePluginStore()  

// Enable a plugin  
enbaled('zhang-san/demo')  

// Disable a plugin  
disabled('li-si/demo')  
```  

## Built-in Plugins  
Official plugins are located in `src/plugins/mine-admin`, including:  

- `basic-ui` – Core UI library  
- `app-store` – App Market  
- `demo` – Demo plugin