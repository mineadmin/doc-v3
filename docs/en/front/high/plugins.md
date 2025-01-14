# Plugin System

::: tip Plugin System Overview
The `3.0` version of the frontend natively supports a plugin system. Compared to `2.0`, which was not designed with plugin functionality in mind, modifying the system's interface or behavior required altering the source code, leading to difficulties in upgrading and increasing divergence from the official codebase. Although an app store feature was later added to forcibly support plugins, these plugins still had to modify the source code, and initialization points could not be extended by plugins, necessitating changes to `main.js`.

**Now, all these issues are resolved. The frontend plugin system provides robust support, allowing seamless integration of interface replacements, additional features, third-party components, or custom components into the system. It also offers various `hooks` that can influence and alter the frontend's operation.**
:::

## Introduction to Plugin Data Types

::: info Type Definition File
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
     * Plugin Information
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
     * Plugin Hooks
     * Defined hooks will not be triggered if the plugin is disabled
     */
    hooks?: {
      // Triggered when the plugin starts, e.g., can set enable = false to prevent plugin startup
      start?: (config: Config) => any | void
      // Triggered after the system initializes, can call Vue context, inject services, etc.
      setup?: () => any | void
      // Triggered when registering routes, allowing full manipulation of routes
      registerRoute?: (router: Router, routesRaw: Route.RouteRecordRaw[] | Plugin.Views[] | MineRoute.routeRecord[]) => any | void
      // Triggered on login
      login?: (formInfo: any) => any | void
      // Triggered on logout
      logout?: () => any | void
      // Triggered when fetching user information
      getUserInfo?: (userInfo: any) => any | void
      // Hook triggered during route redirection, does not apply to external links
      routerRedirect?: (route: RouteRecordRaw, router: Router) => any | void
      // Hook triggered during network requests
      networkRequest?: (request: T) => any | void
      // Hook triggered after network response
      networkResponse?: (response: T) => any | void
    }
    [key: string]: T
  }
}
```
:::

## Creating a Plugin

### Directory Structure
All plugins are placed in the `src/plugins` directory, with the alias `$` pointing to this directory. Plugins follow the same structure as the backend, consisting of `developer namespace/plugin name`. The left side of the slash is the **developer namespace**, which can be set on the [MineAdmin website](https://www.mineadmin.com), and the right side is the **plugin name**, which must be unique within that developer namespace.

Example plugin directories:
- `mine-admin/app-store` Built-in app store plugin
- `zhang-san/oss-uploader` Example plugin

::: tip Note
Plugins created directly in the plugin directory can also be recognized and used locally. **However, they cannot be uploaded to the MineAdmin app market!**
:::

### File Structure
```bash
# Example plugin, directory path: src/plugins
- zhang-san/     # Developer namespace
-   demo/       # Plugin directory
-     config.ts # This is the plugin's publishable configuration file, allowing developers to modify settings without altering the plugin's source code.
-     index.ts  # This file is mandatory for each plugin, containing the plugin's basic information, enable status, and hook definitions.
```

### `index.ts` Configuration
This file exposes the plugin to the system for control, including the plugin's basic information, enable status, initialization, and third-party component integration.

Example configuration:
```ts
// Import necessary data types
import type { Router, RouteRecordRaw } from 'vue-router'
import type { MineToolbarExpose, Plugin } from '#/global'

// Define the plugin
const pluginConfig: Plugin.PluginConfig = {
  // Plugin installation method, must be implemented
  install(app) {
    // app is the current Vue instance
    // Use app to call Vue's `use`, `component` functions to register components.
    // This method is executed only once when the plugin is enabled; it won't execute again if disabled and re-enabled.
  },
  // Plugin basic information, must be configured
  config: {
    // Whether the plugin is enabled, can also be determined by import.meta.env environment variables, e.g., not usable after build.
    enable: true, 
    // Basic information
    info: {
      // Plugin name, consistent with the directory structure
      name: 'zhang-san/demo',
      // Plugin version
      version: '1.0.0',
      // Plugin author
      author: '张三',
      // Plugin description
      description: '张三的演示插件',
      // Plugin startup order, higher values are executed first, including hooks
      order: 1
    },
  },
  // Plugin hooks definition, optional
  hooks: {
    // Triggered when the plugin starts, receives the plugin's config object
    start: (config) => {},
    // Triggered when the system reaches Vue's `setup` lifecycle.
    setup: () => {},
    // Triggered on user login, receives (username, token, etc.)
    login: (formInfo) => {},
    // Triggered on user logout
    logout: () => {},
    // Triggered after fetching user information, receives user permissions, roles, etc.
    getUserInfo: (userInfo) => {},
    // Triggered when the system registers routes, receives `vue-router` instance and raw route data.
    registerRoute: (router: Router, routesRaw) => {},
    // Triggered on page redirection, receives old and new route data, and `vue-router` instance. Note: External links do not trigger this.
    routerRedirect: ({ oldRoute: RouteRecordRaw, newRoute: RouteRecordRaw }, router: Router) => {},
    // Triggered during network requests, receives raw request data, can encrypt data, etc.
    networkRequest: (request) => {},
    // Triggered after server response, receives raw response data.
    networkResponse: (response) => {},
  },
  // Plugin pages, static route data here will be automatically registered by the system. (Optional)
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

::: info All Done
After completing the above steps, the plugin is created and ready to use.
:::

### Publishing Plugin Configuration Files
If the plugin has default configurations and you want to avoid users modifying the source configuration files, which could cause issues during upgrades, you can use the plugin configuration publishing command.
```bash
# In the ./web/ command line interface, execute

pnpm plugin:publish zhang-san/demo
```

The plugin's configuration file will be published to the `src/provider/plugins/config` directory.
For the above example, the file will be named: `zhang-san.demo.config.ts`

Using the published configuration file:
```ts
// Get default parameter configuration
const config = useGlobal().$pluginsConfig['zhang-san/demo']
```

## Dynamically Enabling/Disabling Plugins
You can dynamically control the enable/disable status of a plugin using `usePluginStore()`.

```ts
const { disabled, enabled } = usePluginStore()

// Enable plugin
enbaled('zhang-san/demo')

// Disable plugin
disabled('li-si/demo')
```

## Default Built-in Plugins
Official plugins are located in `src/plugins/mine-admin`, currently including:

- `basic-ui` System basic UI library
- `app-store` App market
- `demo` Demo plugin