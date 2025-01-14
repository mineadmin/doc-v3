# Service Provider

## Description
::: tip Preface
Service providers are common in backend systems, and `3.0` frontend has also added a similar feature, albeit a simplified version. Its purpose is to provide a series of services, such as:
- Registering global data into `Vue`'s `globalProperties` or `provide`.
- Implementing component registration and initialization.
- Providing default configuration files for plugins.
- And more, to be discovered by yourself.

Service providers are automatically scanned and registered during frontend initialization, so you don't need to worry about importing them. You only need to focus on how to bind and register data to `Vue` objects.
:::

::: danger Note
The initialization of service providers occurs before `pinia`, `vue-router`, and `vue-i18n`. Therefore, these cannot be used within service providers, so be cautious.
:::

## Default Service Providers

::: info Location

All service providers are stored in the **`src/provider`** directory, categorized by principle. You can decide whether to create directories to distinguish between different service providers.

:::

### Dictionary
This service provides a **dictionary data** storage function. `3.0` backend does not come with a dictionary feature, which will be supported later through plugins. However, the frontend needs to provide a complete solution to support current and future needs.

In `src/provider/dictionary/data`, there are individual dictionary data files, each corresponding to a collection. The file name is the **dictionary name**, and the file content is the **dictionary data**.

For example, the `system-status.ts` file defines a collection named `System Status` with two data entries: **Enabled and Disabled**.
Once defined, we don't need to worry about how to import or operate it, only how to use it. Refer to the component tutorial section for usage.

```ts
import type { Dictionary } from '#/global'

export default [
  { label: 'Enabled', value: 1, i18n: 'dictionary.system.statusEnabled', color: 'primary' },
  { label: 'Disabled', value: 2, i18n: 'dictionary.system.statusDisabled', color: 'danger' },
] as Dictionary[]
```

### ECharts
This provides initialization for the `ECharts` component, including importing the required `ECharts` components (not all are imported by default, you can modify and add more later),
and binding `ECharts` to `Vue`'s `globalProperties` object: **$echarts**, as well as registering themes for dark mode, etc.

In a `vue` page, get the instance via `useGlobal().$echarts`. For specific usage, refer to the [MaEcharts](/en/front/component/ma-echarts) chapter.

### Plugins
This registers default parameters for the `MineAdmin Plugin System`, making it easier for plugins to use default parameters and for developers to modify plugin parameters here rather than in the plugin source code.
This does not detail how to publish plugin configuration files; refer to the [Plugin System](/en/front/high/plugins) chapter.

### Mine-Core
This initializes the core components of `MineAdmin`: **ma-table, ma-search, ma-form, ma-pro-table**,
and mounts global parameters and configurations, which can be used alongside local configurations.

In a `vue` page, access the configuration via `useGlobal().$mineCore`.

### Settings
This provides configuration parameters for the entire frontend. Do not modify parameters in the default `index.ts`; instead, copy the parameters to `settings.config.ts` and modify them there.

## Creating a Service Provider

### Service Provider Type
```ts
declare namespace ProviderService {
  interface Provider {
    name: string
    init?: () => any | void
    setProvider: (app: App) => any | void
    getProvider: () => T
  }
}
```
Each service provider needs to create a directory, and there must be an `index.ts` file in the directory. It must implement the `Provider` interface under `ProviderService` and export it.

```ts
// src/provider/demo/index.ts
import type { ProviderService } from '#/global'

const provider: ProviderService.Provider = {
  // Instance name, must be configured and unique.
  name: 'demoProvider',
  // The init method is optional.
  init: () => {},
  // Must implement this method to set the service.
  setProvider(app: App): void {
    app.config.globalProperties.$demo = 'Demo Service Provider'
  },
  // Get the service, must implement this method. However, this is rarely used
  // because you can directly use useGlobal() externally to get it, but it's better to define it for standardization.
  getProvider() {
    return useGlobal().$demo
  },
}

// Export the configuration
export default provider as ProviderService.Provider
```

## Removing a Service Provider

If you need to remove a service provider, simply delete its directory.