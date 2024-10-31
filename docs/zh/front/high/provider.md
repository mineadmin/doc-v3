# 服务提供器


## 说明
::: tip 前言
服务提供器在后端很常见，`3.0`的前端也增加了类似功能，但属于简略版，它的作用也是提供一系列服务，比如：
- 注册全局数据到 `Vue` 的 `globalProperties` 或 `provide` 里去
- 实现注册组件，对组件初始化
- 提供插件默认配置文件
- 等等由自己去发掘

服务提供器在前端初始化时已被自动扫描注册，无需关心引入的，你只需要关心如何向 `Vue` 的对象绑定、注册数据即可。
:::

::: danger 注意
服务提供器初始化的环节早于 `pinia`、`vue-router`、`vue-i18n` 以上在服务提供器无法使用，需要注意。
:::

## 默认服务提供器

::: info 存放位置

所有服务提供都在 **`src/provider`** 目录下存放着，以归类为原则，自主考虑是否建立目录来区分不同服务提供器。

:::

### dictionary (字典)
这个服务提供了**字典数据**存放功能，`3.0` 后端不自带字典功能，后续通过插件来支持，但前端需要提供一个完整的解决方案来解决现在及后续的支持。

在 `src/provider/dictionary/data` 下，存放着一个个数据字典文件，一个文件对应一个集合。文件名就是**字典名**，文件内容就是**字典数据**

比如 `system-status.ts` 文件，定义了名为 `系统状态` 的数据集合，包含两个数据，**启用和禁用**
定义好之后，我们不需要关心如何引入、如何运作，只关心如何使用即可，使用的话参考后面的组件教程章节。

```ts
import type { Dictionary } from '#/global'

export default [
  { label: '启用', value: 1, i18n: 'dictionary.system.statusEnabled', color: 'primary' },
  { label: '禁用', value: 2, i18n: 'dictionary.system.statusDisabled', color: 'danger' },
] as Dictionary[]
```

### echarts
这个提供了 `echarts` 组件的初始化，包括引入需要使用的 `echarts` 组件（默认并没有全量引入，后续可自己修改添加），
以及将 `echarts` 绑定到 `Vue` 的 `globalProperties` 对象上: **$echarts**，还有黑暗模式下主题的注册等等。

在 `vue` 页面里通过 `useGlobal().$echarts` 获取实例，具体如何使用可参考 [MaEcharts](/zh/front/component/ma-echarts) 章节 


### plugins
这个对 `MineAdmin插件系统` 提供了默认参数的注册，方便插件后续使用默认参数，也方便后续开发者在这里修改插件的参数，而非插件源码。
这里不详细讲解如何发布插件配置文件，可以参考 [插件系统](/zh/front/high/plugins) 章节。

### mine-core
这个是对 `MineAdmin` 下的 **ma-table、ma-search、ma-form、ma-pro-table** 核心组件初始化，
并挂载全局参数和全局配置，可引入与局部配置一起使用。

在 `vue` 页面里通过 `useGlobal().$mineCore` 调取配置

### settings
这个里面提供了整个前端的配置参数，不要在默认的 `index.ts` 里修改参数，请复制里面的参数到 `settings.config.ts` 里修改，

## 创建服务提供器

### 服务提供器类型
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
每个服务提供器，需要创建一个目录，目录下必须存在 `index.ts` 文件，切必须要实现 `ProviderService` 下的 `Provider` 接口，并导出。

```ts
// src/provider/demo/index.ts
import type { ProviderService } from '#/global'

const provider: ProviderService.Provider = {
  // 实例名称，必须配置，且唯一。
  name: 'demoProvider',
  // init 方法可有可无，
  init: () => {},
  // 必须实现的方法，设置服务。
  setProvider(app: App): void {
    app.config.globalProperties.$demo = 'demo 服务提供器'
  },
  // 获取服务，必须实现的方法。但这个获取服务目前基本用不到
  // 因为可在外部直接使用 useGlobal() 获取，但为了规范还是定义一下比较好。
  getProvider() {
    return useGlobal().$demo
  },
}

// 导出配置
export default provider as ProviderService.Provider
```

## 移除服务提供器

如果需要移除的话，把某个提供器的目录删除即可。