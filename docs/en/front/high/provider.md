# Service Provider  

## Description  

::: tip Preface  
Service providers are common in backend systems. The frontend of `3.0` has also introduced a similar but simplified feature. Its purpose is to provide a range of services, such as:  
- Registering global data into `Vue`'s `globalProperties` or `provide`.  
- Implementing component registration and initialization.  
- Providing default configuration files for plugins.  
- And more for you to explore.  

Service providers are automatically scanned and registered during frontend initialization, so you don’t need to worry about importing them. You only need to focus on how to bind and register data to `Vue` objects.  
:::  

::: danger Note  
Service providers are initialized **before** `pinia`, `vue-router`, and `vue-i18n`, so these cannot be used within service providers. Please take note.  
:::  

## Default Service Providers  

::: info Location  

All service providers are stored in the **`src/provider`** directory. They are categorized by purpose, and you can decide whether to create subdirectories to distinguish different service providers.  

:::  

### Dictionary  
This service provides **dictionary data** storage functionality. The `3.0` backend does not include a built-in dictionary feature, but future plugins will support it. However, the frontend requires a complete solution to address current and future needs.  

Under `src/provider/dictionary/data`, there are individual dictionary data files, where each file corresponds to a collection. The filename serves as the **dictionary name**, and the file content represents the **dictionary data**.  

For example, the `system-status.ts` file defines a data collection named `System Status`, containing two entries: **Enabled** and **Disabled**. Once defined, you don’t need to worry about how it’s imported or how it works—just focus on how to use it. For usage, refer to the later component tutorial section.  

```ts  
import type { Dictionary } from '#/global'  

export default [  
  { label: 'Enabled', value: 1, i18n: 'dictionary.system.statusEnabled', color: 'primary' },  
  { label: 'Disabled', value: 2, i18n: 'dictionary.system.statusDisabled', color: 'danger' },  
] as Dictionary[]  
```  

### ECharts  
This service initializes the `ECharts` component, including importing the required `ECharts` modules (not all are imported by default; you can modify or add more later). It also binds `ECharts` to `Vue`'s `globalProperties` object as **$echarts** and registers themes for dark mode, among other features.  

In a `Vue` page, you can access the instance via `useGlobal().$echarts`. For specific usage, refer to the [MaEcharts](/en/front/component/ma-echarts) section.  

### Plugins  
This service registers default parameters for the `MineAdmin Plugin System`, making it easier for plugins to use default configurations and for developers to modify plugin parameters without altering the plugin source code.  

For details on publishing plugin configuration files, refer to the [Plugin System](/en/front/high/plugins) section.  

### Mine-Core  
This service initializes the core components of `MineAdmin`, including **ma-table, ma-search, ma-form, and ma-pro-table**, and mounts global parameters and configurations for use alongside local configurations.  

In a `Vue` page, you can access the configuration via `useGlobal().$mineCore`.  

### Settings  
This service provides configuration parameters for the entire frontend. **Do not modify parameters in the default `index.ts` file.** Instead, copy the parameters to `settings.config.ts` and make changes there.  

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

Each service provider must create a directory with an `index.ts` file that implements the `Provider` interface from `ProviderService` and exports it.  

```ts  
// src/provider/demo/index.ts  
import type { ProviderService } from '#/global'  

const provider: ProviderService.Provider = {  
  // The instance name is required and must be unique.  
  name: 'demoProvider',  
  // The init method is optional.  
  init: () => {},  
  // Required method to set up the service.  
  setProvider(app: App): void {  
    app.config.globalProperties.$demo = 'Demo Service Provider'  
  },  
  // Required method to get the service. Currently, this is rarely used  
  // since you can directly use `useGlobal()` externally, but it's defined for standardization.  
  getProvider() {  
    return useGlobal().$demo  
  },  
}  

// Export the configuration  
export default provider as ProviderService.Provider  
```  

## Removing a Service Provider  

To remove a service provider, simply delete its corresponding directory.