# 服務提供器


## 説明
::: tip 前言
服務提供器在後端很常見，`3.0`的前端也增加了類似功能，但屬於簡略版，它的作用也是提供一系列服務，比如：
- 註冊全局數據到 `Vue` 的 `globalProperties` 或 `provide` 裏去
- 實現註冊組件，對組件初始化
- 提供插件默認配置文件
- 等等由自己去發掘

服務提供器在前端初始化時已被自動掃描註冊，無需關心引入的，你只需要關心如何向 `Vue` 的對象綁定、註冊數據即可。
:::

::: danger 注意
服務提供器初始化的環節早於 `pinia`、`vue-router`、`vue-i18n` 以上在服務提供器無法使用，需要注意。
:::

## 默認服務提供器

::: info 存放位置

所有服務提供都在 **`src/provider`** 目錄下存放着，以歸類為原則，自主考慮是否建立目錄來區分不同服務提供器。

:::

### dictionary (字典)
這個服務提供了**字典數據**存放功能，`3.0` 後端不自帶字典功能，後續通過插件來支持，但前端需要提供一個完整的解決方案來解決現在及後續的支持。

在 `src/provider/dictionary/data` 下，存放着一個個數據字典文件，一個文件對應一個集合。文件名就是**字典名**，文件內容就是**字典數據**

比如 `system-status.ts` 文件，定義了名為 `系統狀態` 的數據集合，包含兩個數據，**啓用和禁用**
定義好之後，我們不需要關心如何引入、如何運作，只關心如何使用即可，使用的話參考後面的組件教程章節。

```ts
import type { Dictionary } from '#/global'

export default [
  { label: '啓用', value: 1, i18n: 'dictionary.system.statusEnabled', color: 'primary' },
  { label: '禁用', value: 2, i18n: 'dictionary.system.statusDisabled', color: 'danger' },
] as Dictionary[]
```

### echarts
這個提供了 `echarts` 組件的初始化，包括引入需要使用的 `echarts` 組件（默認並沒有全量引入，後續可自己修改添加），
以及將 `echarts` 綁定到 `Vue` 的 `globalProperties` 對象上: **$echarts**，還有黑暗模式下主題的註冊等等。

在 `vue` 頁面裏通過 `useGlobal().$echarts` 獲取實例，具體如何使用可參考 [MaEcharts](/zh-hk/front/component/ma-echarts) 章節 


### plugins
這個對 `MineAdmin插件系統` 提供了默認參數的註冊，方便插件後續使用默認參數，也方便後續開發者在這裏修改插件的參數，而非插件源碼。
這裏不詳細講解如何發佈插件配置文件，可以參考 [插件系統](/zh-hk/front/high/plugins) 章節。

### mine-core
這個是對 `MineAdmin` 下的 **ma-table、ma-search、ma-form、ma-pro-table** 核心組件初始化，
並掛載全局參數和全局配置，可引入與局部配置一起使用。

在 `vue` 頁面裏通過 `useGlobal().$mineCore` 調取配置

### settings
這個裏面提供了整個前端的配置參數，不要在默認的 `index.ts` 裏修改參數，請複製裏面的參數到 `settings.config.ts` 裏修改，

## 創建服務提供器

### 服務提供器類型
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
每個服務提供器，需要創建一個目錄，目錄下必須存在 `index.ts` 文件，切必須要實現 `ProviderService` 下的 `Provider` 接口，並導出。

```ts
// src/provider/demo/index.ts
import type { ProviderService } from '#/global'

const provider: ProviderService.Provider = {
  // 實例名稱，必須配置，且唯一。
  name: 'demoProvider',
  // init 方法可有可無，
  init: () => {},
  // 必須實現的方法，設置服務。
  setProvider(app: App): void {
    app.config.globalProperties.$demo = 'demo 服務提供器'
  },
  // 獲取服務，必須實現的方法。但這個獲取服務目前基本用不到
  // 因為可在外部直接使用 useGlobal() 獲取，但為了規範還是定義一下比較好。
  getProvider() {
    return useGlobal().$demo
  },
}

// 導出配置
export default provider as ProviderService.Provider
```

## 移除服務提供器

如果需要移除的話，把某個提供器的目錄刪除即可。