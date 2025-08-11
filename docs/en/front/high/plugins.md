# Plugin System

::: tip Plugin System Overview
The `3.0` frontend natively supports a plugin system. Compared to `2.0`, which was not designed with plugin functionality in mind, modifying the system's interface or behavior required altering the source code. This led to difficulties in future upgrades and increasing divergence from the official codebase. Although an app store feature was later added to forcibly support plugins, plugins still had to modify the source code. Additionally, plugins could not extend initialization logic and had to modify `main.js` directly.

**Now, all these issues are resolved. The frontend plugin system provides robust support, allowing seamless integration of interface replacements, feature additions, third-party components, or custom components into the system. It also offers various `hooks` that can even influence and alter the frontend's runtime behavior.**
:::

## Plugin Data Types Introduction

::: info Type Definitions
Type definitions are located in `types/global.d.ts`.
:::

:::details Click to View Type Definitions
```ts
declare namespace Plugin {

  /**
   * Basic plugin information
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
     * Defined hooks will not trigger if the plugin is disabled
     */
    hooks?: {
      // Triggered when the plugin starts, e.g., can set enable = false to prevent plugin startup
      start?: (config: Config) => any | void
      // Triggered after system initialization, can access Vue context, inject services, etc.
      setup?: () => any | void
      // Triggered when registering routes, allowing full manipulation of routes
      registerRoute?: (router: Router, routesRaw: Route.RouteRecordRaw[] | Plugin.Views[] | MineRoute.routeRecord[]) => any | void
      // Triggered on login
      login?: (formInfo: any) => any | void
      // Triggered on logout
      logout?: () => any | void
      // Triggered when fetching user info
      getUserInfo?: (userInfo: any) => any | void
      // Route navigation hook (does not apply to external links)
      routerRedirect?: (route: RouteRecordRaw, router: Router) => any | void
      // Network request hook
      networkRequest?: (request: T) => any | void
      // Network response hook
      networkResponse?: (response: T) => any | void
    }
    [key: string]: T
  }
}
```
:::

## Creating a Plugin

### Directory Structure
All plugins are placed under the `src/plugins` directory, with the alias `$` pointing to this directory. The plugin structure mirrors the backend, consisting of `developer-namespace/plugin-name`. The left side of the slash is the **developer namespace**, which can be configured on the [MineAdmin website](https://www.mineadmin.com). The right side is the **plugin name**, which must be unique within that namespace.

Example plugin directories:
- `mine-admin/app-store`  Built-in app store plugin
- `zhang-san/oss-uploader` Example plugin

::: tip Note
Plugins created locally in the plugin directory can also be recognized and used. **However, they cannot be uploaded to the MineAdmin App Market!**
:::

### File Structure
```bash
# Example plugin, directory path: src/plugins
- zhang-san/     # Developer namespace
-   demo/       # Plugin directory
-     config.ts # Plugin configuration file for distribution (allows customization without modifying plugin source).
-     index.ts  # Mandatory file for each plugin, containing basic info, enable status, and hook definitions.
```

### `index.ts` Configuration
This file exposes the plugin to the system, defining basic information, enable status, initialization, third-party component integration, and more.

Example configuration:
```ts
// Import required types
import type { Router, RouteRecordRaw } from 'vue-router'
import type { MineToolbarExpose, Plugin } from '#/global'

// Define the plugin
const pluginConfig: Plugin.PluginConfig = {
  // Mandatory installation method
  install(app) {
    // `app` is the current Vue instance
    // Use `app` to call Vue's `use`, `component`, etc., to register components.
    // This method executes only once when the plugin is enabled and does not re-run on re-enabling.
  },
  // Mandatory basic configuration
  config: {
    // Enable status. Can also use import.meta.env to control enablement (e.g., disable in production).
    enable: true, 
    // Basic info
    info: {
      // Plugin name (matches directory structure)
      name: 'zhang-san/demo',
      // Plugin version
      version: '1.0.0',
      // Plugin author
      author: '张三',
      // Plugin description
      description: '张三的演示插件',
      // Plugin startup order (higher values execute first, including hooks)
      order: 1
    },
  },
  // Optional hooks
  hooks: {
    // Triggered on plugin startup, receives the plugin's config object
    start: (config) => {},
    // Triggered during Vue's `setup` lifecycle
    setup: () => {},
    // Triggered on user login (receives username, token, etc.)
    login: (formInfo) => {},
    // Triggered on user logout
    logout: () => {},
    // Triggered after fetching user info (receives permissions, roles, etc.)
    getUserInfo: (userInfo) => {},
    // Triggered during route registration (receives `vue-router` instance and raw route data)
    registerRoute: (router: Router, routesRaw) => {},
    // Triggered on page navigation (receives old/new route data and `vue-router` instance; external links excluded)
    routerRedirect: ({ oldRoute: RouteRecordRaw, newRoute: RouteRecordRaw }, router: Router) => {},
    // Triggered on network requests (receives raw request data, e.g., for encryption)
    networkRequest: (request) => {},
    // Triggered on server response (receives raw response data)
    networkResponse: (response) => {},
  },
  // Plugin views (static routes auto-registered by the system; optional)
  views: [
    {
      name: 'zhangsan:demo:index',
      path: '/zhangsan/demo',
      component: () => import('./views/index.vue'),
      meta: {
        title: '张三的演示插件',
        i18n: 'Internationalization key',
      }
    }
  ]
}
```

::: info All Set!
Once the above steps are completed, the plugin is ready for use.
:::

### Publishing Plugin Configuration
If a plugin has default configurations but you want to avoid source file modifications (which could complicate upgrades), use the plugin configuration publish command.
```bash
# In the ./web/ command line, run:

pnpm plugin:publish zhang-san/demo
```

The plugin's configuration file will be published to `src/provider/plugins/config`. For the example above, the filename will be: `zhang-san.demo.config.ts`.

Using the published configuration:
```ts
// Retrieve default configuration
const config = useGlobal().$pluginsConfig['zhang-san/demo']
```

## Dynamically Enabling/Disabling Plugins
Use `usePluginStore()` to dynamically control plugin enablement.

```ts
const { disabled, enabled } = usePluginStore()

// Enable a plugin
enbaled('zhang-san/demo')

// Disable a plugin
disabled('li-si/demo')
```

## Built-in Plugins
Official plugins are located under `src/plugins/mine-admin`. Currently included:

- `basic-ui`  Core UI library
- `app-store`  App Market
- `demo`  Demo plugin