# 服務提供器


## 說明
::: tip 前言
服務提供器在後端很常見，`3.0`的前端也增加了類似功能，但屬於簡略版，它的作用也是提供一系列服務，比如：
- 註冊全域性資料到 `Vue` 的 `globalProperties` 或 `provide` 裡去
- 實現註冊元件，對元件初始化
- 提供外掛預設配置檔案
- 等等由自己去發掘

服務提供器在前端初始化時已被自動掃描註冊，無需關心引入的，你只需要關心如何向 `Vue` 的物件繫結、註冊資料即可。
:::

::: danger 注意
服務提供器初始化的環節早於 `pinia`、`vue-router`、`vue-i18n` 以上在服務提供器無法使用，需要注意。
:::

## 預設服務提供器

::: info 存放位置

所有服務提供都在 **`src/provider`** 目錄下存放著，以歸類為原則，自主考慮是否建立目錄來區分不同服務提供器。

:::

### dictionary (字典)
這個服務提供了**字典資料**存放功能，`3.0` 後端不自帶字典功能，後續透過外掛來支援，但前端需要提供一個完整的解決方案來解決現在及後續的支援。

在 `src/provider/dictionary/data` 下，存放著一個個資料字典檔案，一個檔案對應一個集合。檔名就是**字典名**，檔案內容就是**字典資料**

比如 `system-status.ts` 檔案，定義了名為 `系統狀態` 的資料集合，包含兩個資料，**啟用和停用**
定義好之後，我們不需要關心如何引入、如何運作，只關心如何使用即可，使用的話參考後面的元件教程章節。

```ts
import type { Dictionary } from '#/global'

export default [
  { label: '啟用', value: 1, i18n: 'dictionary.system.statusEnabled', color: 'primary' },
  { label: '停用', value: 2, i18n: 'dictionary.system.statusDisabled', color: 'danger' },
] as Dictionary[]
```

### echarts
這個提供了 `echarts` 元件的初始化，包括引入需要使用的 `echarts` 元件（預設並沒有全量引入，後續可自己修改新增），
以及將 `echarts` 繫結到 `Vue` 的 `globalProperties` 物件上: **$echarts**，還有黑暗模式下主題的註冊等等。

在 `vue` 頁面裡透過 `useGlobal().$echarts` 獲取例項，具體如何使用可參考 [MaEcharts](/zh-tw/front/component/ma-echarts) 章節 


### plugins
這個對 `MineAdmin外掛系統` 提供了預設引數的註冊，方便外掛後續使用預設引數，也方便後續開發者在這裡修改外掛的引數，而非外掛原始碼。
這裡不詳細講解如何釋出外掛配置檔案，可以參考 [外掛系統](/zh-tw/front/high/plugins) 章節。

### mine-core
這個是對 `MineAdmin` 下的 **ma-table、ma-search、ma-form、ma-pro-table** 核心元件初始化，
並掛載全域性引數和全域性配置，可引入與區域性配置一起使用。

在 `vue` 頁面裡透過 `useGlobal().$mineCore` 調取配置

### settings
這個裡面提供了整個前端的配置引數，不要在預設的 `index.ts` 裡修改引數，請複製裡面的引數到 `settings.config.ts` 裡修改，

## 建立服務提供器

### 服務提供器型別
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
每個服務提供器，需要建立一個目錄，目錄下必須存在 `index.ts` 檔案，切必須要實現 `ProviderService` 下的 `Provider` 介面，並匯出。

```ts
// src/provider/demo/index.ts
import type { ProviderService } from '#/global'

const provider: ProviderService.Provider = {
  // 例項名稱，必須配置，且唯一。
  name: 'demoProvider',
  // init 方法可有可無，
  init: () => {},
  // 必須實現的方法，設定服務。
  setProvider(app: App): void {
    app.config.globalProperties.$demo = 'demo 服務提供器'
  },
  // 獲取服務，必須實現的方法。但這個獲取服務目前基本用不到
  // 因為可在外部直接使用 useGlobal() 獲取，但為了規範還是定義一下比較好。
  getProvider() {
    return useGlobal().$demo
  },
}

// 匯出配置
export default provider as ProviderService.Provider
```

## 移除服務提供器

如果需要移除的話，把某個提供器的目錄刪除即可。