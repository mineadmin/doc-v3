# 服务提供器

## 概述

### 核心作用
服务提供器（Provider）是 MineAdmin 3.0 前端架构的核心特性之一，借鉴了后端服务提供器的设计理念，为前端应用提供了模块化的服务注册和管理机制。

::: tip 主要功能
- **全局服务注册**: 将服务注册到 Vue 的 `globalProperties` 或 `provide/inject` 系统
- **组件初始化**: 自动初始化和配置全局组件
- **插件配置管理**: 提供插件的默认配置和参数管理
- **依赖注入**: 实现服务之间的依赖关系管理
- **模块化架构**: 支持按功能模块组织服务
:::

### 初始化顺序
::: danger 重要提示
服务提供器在应用初始化的早期阶段加载，**早于** `pinia`、`vue-router`、`vue-i18n` 等库的初始化。因此在服务提供器中无法直接使用这些库的功能。

**初始化顺序**:
1. 服务提供器扫描和注册 ⚡
2. Pinia 状态管理初始化
3. Vue Router 路由初始化
4. Vue I18n 国际化初始化
5. 应用主体启动
:::

## 架构设计

### 目录结构
```
src/provider/
├── dictionary/          # 字典服务提供器
│   ├── index.ts        # 服务提供器主文件
│   └── data/           # 字典数据文件
├── echarts/            # 图表服务提供器
│   └── index.ts
├── plugins/            # 插件配置服务提供器
│   └── index.ts
├── mine-core/          # 核心组件服务提供器
│   └── index.ts
├── settings/           # 系统配置服务提供器
│   ├── index.ts
│   └── settings.config.ts
└── toolbars/           # 工具栏服务提供器
    └── index.ts
```

### 自动发现机制
系统启动时会自动扫描 `src/provider/` 目录下的所有子目录，每个子目录的 `index.ts` 文件都会被识别为一个服务提供器并自动注册。

## 系统内置服务

### Dictionary（字典服务）

**功能说明**: 提供统一的数据字典管理功能，支持多语言和主题配色。

**源码位置**: 
- GitHub: [src/provider/dictionary/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider/dictionary)
- 本地: `/Users/zhuzhu/project/mineadmin/web/src/provider/dictionary/`

**核心特性**:
- 支持多语言国际化标识
- 内置主题色彩系统
- 自动类型推导
- 响应式数据更新

**字典数据示例** (`src/provider/dictionary/data/system-status.ts`):
```ts
import type { Dictionary } from '#/global'

export default [
  { 
    label: '启用', 
    value: 1, 
    i18n: 'dictionary.system.statusEnabled', 
    color: 'primary' 
  },
  { 
    label: '禁用', 
    value: 2, 
    i18n: 'dictionary.system.statusDisabled', 
    color: 'danger' 
  },
] as Dictionary[]
```

**使用方法**:
```ts
// 在组件中使用字典数据
import { useDictionary } from '@/composables/useDictionary'

const { getDictionary } = useDictionary()
const statusDict = getDictionary('system-status')
```

### ECharts（图表服务）

**功能说明**: 提供 ECharts 图表库的初始化、配置和主题管理功能。

**源码位置**:
- GitHub: [src/provider/echarts/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider/echarts)
- 本地: `/Users/zhuzhu/project/mineadmin/web/src/provider/echarts/`

**核心特性**:
- 按需引入图表组件，减少包体积
- 自动适配系统主题（明暗模式）
- 全局实例注册到 Vue
- 响应式图表尺寸调整

**使用方法**:
```ts
// 在组件中获取 ECharts 实例
import { useGlobal } from '@/composables/useGlobal'

const { $echarts } = useGlobal()

// 初始化图表
const chartInstance = $echarts.init(chartRef.value)
```

参考组件: [MaEcharts](/front/component/ma-echarts)

### Plugins（插件配置服务）

**功能说明**: 为 MineAdmin 插件系统提供默认配置管理，支持插件参数的统一配置和管理。

**源码位置**:
- GitHub: [src/provider/plugins/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider/plugins)
- 本地: `/Users/zhuzhu/project/mineadmin/web/src/provider/plugins/`

**核心特性**:
- 插件配置集中管理
- 默认参数注册
- 配置热更新支持
- 插件依赖关系管理

参考文档: [插件系统](/front/high/plugins)

### MineCore（核心组件服务）

**功能说明**: 初始化 MineAdmin 核心组件库，提供全局配置和组件注册服务。

**源码位置**:
- GitHub: [src/provider/mine-core/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider/mine-core)
- 本地: `/Users/zhuzhu/project/mineadmin/web/src/provider/mine-core/`

**管理的组件**:
- `ma-table` - 数据表格组件
- `ma-search` - 搜索表单组件
- `ma-form` - 表单组件
- `ma-pro-table` - 高级表格组件

**使用方法**:
```ts
import { useGlobal } from '@/composables/useGlobal'

const { $mineCore } = useGlobal()
const tableConfig = $mineCore.table
```

### Settings（系统配置服务）

**功能说明**: 提供前端应用的全局配置参数管理，支持开发和生产环境的配置分离。

**源码位置**:
- GitHub: [src/provider/settings/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider/settings)
- 本地: `/Users/zhuzhu/project/mineadmin/web/src/provider/settings/`

**配置文件**:
- `index.ts` - 默认配置（请勿直接修改）
- `settings.config.ts` - 用户自定义配置文件

**配置示例**:
```ts
// settings.config.ts
export default {
  // 系统基础配置
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
  // 主题配置
  theme: {
    primaryColor: '#409eff',
    darkMode: 'auto'
  }
}
```

## 开发指南

### 创建基础服务提供器

**步骤 1**: 创建服务目录
```bash
mkdir src/provider/my-service
```

**步骤 2**: 创建服务提供器文件 (`src/provider/my-service/index.ts`)
```ts
import type { App } from 'vue'
import type { ProviderService } from '#/global'

// 定义服务接口
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
    
    // 注册到全局属性
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

### 创建带配置的高级服务提供器

```ts
import type { App } from 'vue'
import type { ProviderService } from '#/global'

// 服务配置接口
interface ServiceConfig {
  apiUrl: string
  timeout: number
  retries: number
}

// 服务实例接口
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
    dependencies: ['settings'] // 依赖 settings 服务
  },
  
  async init() {
    // 异步初始化逻辑
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
        // 实现请求逻辑
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
    // 加载外部依赖库的逻辑
  }
}

export default provider
```

### 使用服务提供器

**在 Vue 组件中使用**:
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

## 最佳实践

### 1. 命名规范
- 服务提供器名称使用 **camelCase** 格式
- 目录名使用 **kebab-case** 格式
- 全局属性使用 `$` 前缀

### 2. 类型安全
```ts
// 扩展全局属性类型
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $myService: MyService
  }
}
```

### 3. 依赖管理
```ts
const provider: ProviderService.Provider = {
  name: 'dependentService',
  config: {
    dependencies: ['settings', 'dictionary']
  },
  // ...其他配置
}
```

### 4. 错误处理
```ts
setProvider(app: App) {
  try {
    // 服务初始化逻辑
    app.config.globalProperties.$service = createService()
  } catch (error) {
    console.error(`服务 ${this.name} 初始化失败:`, error)
    // 提供降级方案
    app.config.globalProperties.$service = createFallbackService()
  }
}
```

## 服务管理

### 禁用服务提供器
```ts
const provider: ProviderService.Provider = {
  name: 'optionalService',
  config: {
    enabled: false // 禁用该服务
  },
  // ...其他配置
}
```

### 移除服务提供器
删除对应的服务提供器目录即可：
```bash
rm -rf src/provider/unwanted-service
```

### 调试服务提供器
```ts
const provider: ProviderService.Provider = {
  name: 'debugService',
  
  init() {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Provider] ${this.name} 初始化完成`)
    }
  },
  
  setProvider(app: App) {
    // 开发环境下添加调试信息
    if (process.env.NODE_ENV === 'development') {
      window.__DEBUG_PROVIDERS__ = window.__DEBUG_PROVIDERS__ || {}
      window.__DEBUG_PROVIDERS__[this.name] = this
    }
    
    // 正常的服务注册逻辑
  }
}
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 服务未注册成功 | 缺少 `index.ts` 文件或未实现必要接口 | 检查文件存在性和接口实现 |
| 无法使用 Pinia | 服务提供器初始化早于 Pinia | 将 Pinia 相关逻辑移至组件或 Composable 中 |
| 服务依赖冲突 | 循环依赖或依赖顺序错误 | 重新设计依赖关系或使用事件总线 |
| 类型推导错误 | 全局属性类型未正确扩展 | 添加 TypeScript 模块声明 |
| 热更新失效 | 服务缓存问题 | 重启开发服务器 |

## 相关资源

**源码参考**:
- GitHub 仓库: [MineAdmin 源码](https://github.com/mineadmin/mineadmin)
- 服务提供器目录: [web/src/provider/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider)
- 本地源码: `/Users/zhuzhu/project/mineadmin/web/src/provider/`

**相关文档**:
- [插件系统](/front/high/plugins)
- [MaEcharts 组件](/front/component/ma-echarts)