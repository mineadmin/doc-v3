# 服務提供器

## 概述

### 核心作用
服務提供器（Provider）是 MineAdmin 3.0 前端架構的核心特性之一，借鑑了後端服務提供器的設計理念，為前端應用提供了模組化的服務註冊和管理機制。

::: tip 主要功能
- **全域性服務註冊**: 將服務註冊到 Vue 的 `globalProperties` 或 `provide/inject` 系統
- **元件初始化**: 自動初始化和配置全域性元件
- **外掛配置管理**: 提供外掛的預設配置和引數管理
- **依賴注入**: 實現服務之間的依賴關係管理
- **模組化架構**: 支援按功能模組組織服務
:::

### 初始化順序
::: danger 重要提示
服務提供器在應用初始化的早期階段載入，**早於** `pinia`、`vue-router`、`vue-i18n` 等庫的初始化。因此在服務提供器中無法直接使用這些庫的功能。

**初始化順序**:
1. 服務提供器掃描和註冊 ⚡
2. Pinia 狀態管理初始化
3. Vue Router 路由初始化
4. Vue I18n 國際化初始化
5. 應用主體啟動
:::

## 架構設計

### 目錄結構
```
src/provider/
├── dictionary/          # 字典服務提供器
│   ├── index.ts        # 服務提供器主檔案
│   └── data/           # 字典資料檔案
├── echarts/            # 圖表服務提供器
│   └── index.ts
├── plugins/            # 外掛配置服務提供器
│   └── index.ts
├── mine-core/          # 核心元件服務提供器
│   └── index.ts
├── settings/           # 系統配置服務提供器
│   ├── index.ts
│   └── settings.config.ts
└── toolbars/           # 工具欄服務提供器
    └── index.ts
```

### 自動發現機制
系統啟動時會自動掃描 `src/provider/` 目錄下的所有子目錄，每個子目錄的 `index.ts` 檔案都會被識別為一個服務提供器並自動註冊。

## 系統內建服務

### Dictionary（字典服務）

**功能說明**: 提供統一的資料字典管理功能，支援多語言和主題配色。

**原始碼位置**: 
- GitHub: [src/provider/dictionary/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider/dictionary)
- 本地: `/Users/zhuzhu/project/mineadmin/web/src/provider/dictionary/`

**核心特性**:
- 支援多語言國際化標識
- 內建主題色彩系統
- 自動型別推導
- 響應式資料更新

**字典資料示例** (`src/provider/dictionary/data/system-status.ts`):
```ts
import type { Dictionary } from '#/global'

export default [
  { 
    label: '啟用', 
    value: 1, 
    i18n: 'dictionary.system.statusEnabled', 
    color: 'primary' 
  },
  { 
    label: '停用', 
    value: 2, 
    i18n: 'dictionary.system.statusDisabled', 
    color: 'danger' 
  },
] as Dictionary[]
```

**使用方法**:
```ts
// 在元件中使用字典資料
import { useDictionary } from '@/composables/useDictionary'

const { getDictionary } = useDictionary()
const statusDict = getDictionary('system-status')
```

### ECharts（圖表服務）

**功能說明**: 提供 ECharts 圖表庫的初始化、配置和主題管理功能。

**原始碼位置**:
- GitHub: [src/provider/echarts/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider/echarts)
- 本地: `/Users/zhuzhu/project/mineadmin/web/src/provider/echarts/`

**核心特性**:
- 按需引入圖表元件，減少包體積
- 自動適配系統主題（明暗模式）
- 全域性例項註冊到 Vue
- 響應式圖表尺寸調整

**使用方法**:
```ts
// 在元件中獲取 ECharts 例項
import { useGlobal } from '@/composables/useGlobal'

const { $echarts } = useGlobal()

// 初始化圖表
const chartInstance = $echarts.init(chartRef.value)
```

參考元件: [MaEcharts](/front/component/ma-echarts)

### Plugins（外掛配置服務）

**功能說明**: 為 MineAdmin 外掛系統提供預設配置管理，支援外掛引數的統一配置和管理。

**原始碼位置**:
- GitHub: [src/provider/plugins/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider/plugins)
- 本地: `/Users/zhuzhu/project/mineadmin/web/src/provider/plugins/`

**核心特性**:
- 外掛配置集中管理
- 預設引數註冊
- 配置熱更新支援
- 外掛依賴關係管理

參考文件: [外掛系統](/front/high/plugins)

### MineCore（核心元件服務）

**功能說明**: 初始化 MineAdmin 核心元件庫，提供全域性配置和元件註冊服務。

**原始碼位置**:
- GitHub: [src/provider/mine-core/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider/mine-core)
- 本地: `/Users/zhuzhu/project/mineadmin/web/src/provider/mine-core/`

**管理的元件**:
- `ma-table` - 資料表格元件
- `ma-search` - 搜尋表單元件
- `ma-form` - 表單元件
- `ma-pro-table` - 高階表格元件

**使用方法**:
```ts
import { useGlobal } from '@/composables/useGlobal'

const { $mineCore } = useGlobal()
const tableConfig = $mineCore.table
```

### Settings（系統配置服務）

**功能說明**: 提供前端應用的全域性配置引數管理，支援開發和生產環境的配置分離。

**原始碼位置**:
- GitHub: [src/provider/settings/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider/settings)
- 本地: `/Users/zhuzhu/project/mineadmin/web/src/provider/settings/`

**配置檔案**:
- `index.ts` - 預設配置（請勿直接修改）
- `settings.config.ts` - 使用者自定義配置檔案

**配置示例**:
```ts
// settings.config.ts
export default {
  // 系統基礎配置
  app: {
    name: 'MineAdmin',
    version: '3.0.0',
    logo: '/logo.png'
  },
  // API 配置
  api: {
    baseUrl: process.env.NODE_ENV === 'development' 
      ? 'http://localhost:9501' 
      : 'https://api.example.com',
    timeout: 10000
  },
  // 主題配置
  theme: {
    primaryColor: '#409eff',
    darkMode: 'auto'
  }
}
```

## 開發指南

### 建立基礎服務提供器

**步驟 1**: 建立服務目錄
```bash
mkdir src/provider/my-service
```

**步驟 2**: 建立服務提供器檔案 (`src/provider/my-service/index.ts`)
```ts
import type { App } from 'vue'
import type { ProviderService } from '#/global'

// 定義服務介面
interface MyService {
  version: string
  getName: () => string
  setConfig: (config: any) => void
}

const provider: ProviderService.Provider<MyService> = {
  name: 'myService',
  
  init() {
    console.log('MyService 正在初始化...')
  },
  
  setProvider(app: App) {
    const service: MyService = {
      version: '1.0.0',
      getName: () => 'My Custom Service',
      setConfig: (config) => {
        console.log('配置已更新:', config)
      }
    }
    
    // 註冊到全域性屬性
    app.config.globalProperties.$myService = service
    
    // 或者使用 provide/inject
    app.provide('myService', service)
  },
  
  getProvider() {
    return useGlobal().$myService
  }
}

export default provider
```

### 建立帶配置的高階服務提供器

```ts
import type { App } from 'vue'
import type { ProviderService } from '#/global'

// 服務配置介面
interface ServiceConfig {
  apiUrl: string
  timeout: number
  retries: number
}

// 服務例項介面
interface AdvancedService {
  config: ServiceConfig
  request: (url: string) => Promise<any>
  updateConfig: (newConfig: Partial<ServiceConfig>) => void
}

const provider: ProviderService.Provider<AdvancedService> = {
  name: 'advancedService',
  
  config: {
    enabled: true,
    priority: 10,
    dependencies: ['settings'] // 依賴 settings 服務
  },
  
  async init() {
    // 非同步初始化邏輯
    await this.loadExternalLibrary()
  },
  
  setProvider(app: App) {
    const defaultConfig: ServiceConfig = {
      apiUrl: '/api/v1',
      timeout: 5000,
      retries: 3
    }
    
    const service: AdvancedService = {
      config: { ...defaultConfig },
      
      async request(url: string) {
        // 實現請求邏輯
        return fetch(`${this.config.apiUrl}${url}`, {
          timeout: this.config.timeout
        })
      },
      
      updateConfig(newConfig) {
        Object.assign(this.config, newConfig)
      }
    }
    
    app.config.globalProperties.$advancedService = service
  },
  
  getProvider() {
    return useGlobal().$advancedService
  },
  
  async loadExternalLibrary() {
    // 載入外部依賴庫的邏輯
  }
}

export default provider
```

### 使用服務提供器

**在 Vue 元件中使用**:
```vue
<template>
  <div>
    <h3>{{ serviceName }}</h3>
    <p>版本: {{ version }}</p>
  </div>
</template>

<script setup lang="ts">
import { useGlobal } from '@/composables/useGlobal'

const { $myService } = useGlobal()

const serviceName = $myService.getName()
const version = $myService.version

// 更新配置
$myService.setConfig({ theme: 'dark' })
</script>
```

**在 Composable 中使用**:
```ts
// composables/useMyService.ts
import { useGlobal } from '@/composables/useGlobal'

export function useMyService() {
  const { $myService } = useGlobal()
  
  const updateServiceConfig = (config: any) => {
    $myService.setConfig(config)
  }
  
  return {
    service: $myService,
    updateServiceConfig
  }
}
```

## 最佳實踐

### 1. 命名規範
- 服務提供器名稱使用 **camelCase** 格式
- 目錄名使用 **kebab-case** 格式
- 全域性屬性使用 `$` 字首

### 2. 型別安全
```ts
// 擴充套件全域性屬性型別
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $myService: MyService
  }
}
```

### 3. 依賴管理
```ts
const provider: ProviderService.Provider = {
  name: 'dependentService',
  config: {
    dependencies: ['settings', 'dictionary']
  },
  // ...其他配置
}
```

### 4. 錯誤處理
```ts
setProvider(app: App) {
  try {
    // 服務初始化邏輯
    app.config.globalProperties.$service = createService()
  } catch (error) {
    console.error(`服務 ${this.name} 初始化失敗:`, error)
    // 提供降級方案
    app.config.globalProperties.$service = createFallbackService()
  }
}
```

## 服務管理

### 停用服務提供器
```ts
const provider: ProviderService.Provider = {
  name: 'optionalService',
  config: {
    enabled: false // 停用該服務
  },
  // ...其他配置
}
```

### 移除服務提供器
刪除對應的服務提供器目錄即可：
```bash
rm -rf src/provider/unwanted-service
```

### 除錯服務提供器
```ts
const provider: ProviderService.Provider = {
  name: 'debugService',
  
  init() {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Provider] ${this.name} 初始化完成`)
    }
  },
  
  setProvider(app: App) {
    // 開發環境下新增除錯資訊
    if (process.env.NODE_ENV === 'development') {
      window.__DEBUG_PROVIDERS__ = window.__DEBUG_PROVIDERS__ || {}
      window.__DEBUG_PROVIDERS__[this.name] = this
    }
    
    // 正常的服務註冊邏輯
  }
}
```

## 常見問題

| 問題 | 原因 | 解決方案 |
|------|------|----------|
| 服務未註冊成功 | 缺少 `index.ts` 檔案或未實現必要介面 | 檢查檔案存在性和介面實現 |
| 無法使用 Pinia | 服務提供器初始化早於 Pinia | 將 Pinia 相關邏輯移至元件或 Composable 中 |
| 服務依賴衝突 | 迴圈依賴或依賴順序錯誤 | 重新設計依賴關係或使用事件匯流排 |
| 型別推導錯誤 | 全域性屬性型別未正確擴充套件 | 新增 TypeScript 模組宣告 |
| 熱更新失效 | 服務快取問題 | 重啟開發伺服器 |

## 相關資源

**原始碼參考**:
- GitHub 倉庫: [MineAdmin 原始碼](https://github.com/mineadmin/mineadmin)
- 服務提供器目錄: [web/src/provider/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider)
- 本地原始碼: `/Users/zhuzhu/project/mineadmin/web/src/provider/`

**相關文件**:
- [外掛系統](/front/high/plugins)
- [MaEcharts 元件](/front/component/ma-echarts)