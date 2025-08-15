# Service Providers

## Overview

### Core Functionality
Service Providers (Providers) are one of the core features of the MineAdmin 3.0 frontend architecture, drawing inspiration from backend service provider design concepts to provide modular service registration and management mechanisms for frontend applications.

::: tip Key Features
- **Global Service Registration**: Register services to Vue's `globalProperties` or `provide/inject` system
- **Component Initialization**: Automatically initialize and configure global components
- **Plugin Configuration Management**: Provide default configurations and parameter management for plugins
- **Dependency Injection**: Implement dependency relationship management between services
- **Modular Architecture**: Support organizing services by functional modules
:::

### Initialization Sequence
::: danger Important Note
Service providers load during the early stages of application initialization, **before** libraries like `pinia`, `vue-router`, and `vue-i18n` are initialized. Therefore, these library features cannot be used directly within service providers.

**Initialization Order**:
1. Service provider scanning and registration ⚡
2. Pinia state management initialization
3. Vue Router initialization
4. Vue I18n internationalization initialization
5. Main application launch
:::

## Architecture Design

### Directory Structure
```
src/provider/
├── dictionary/          # Dictionary service provider
│   ├── index.ts        # Service provider main file
│   └── data/           # Dictionary data files
├── echarts/            # Chart service provider
│   └── index.ts
├── plugins/            # Plugin configuration service provider
│   └── index.ts
├── mine-core/          # Core component service provider
│   └── index.ts
├── settings/           # System configuration service provider
│   ├── index.ts
│   └── settings.config.ts
└── toolbars/           # Toolbar service provider
    └── index.ts
```

### Auto-Discovery Mechanism
During system startup, all subdirectories under `src/provider/` are automatically scanned. Each subdirectory's `index.ts` file is recognized as a service provider and automatically registered.

## Built-in Services

### Dictionary Service

**Description**: Provides unified data dictionary management functionality with support for multilingualism and theme color schemes.

**Source Location**: 
- GitHub: [src/provider/dictionary/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider/dictionary)
- Local: `/Users/zhuzhu/project/mineadmin/web/src/provider/dictionary/`

**Key Features**:
- Supports multilingual internationalization identifiers
- Built-in theme color system
- Automatic type inference
- Reactive data updates

**Dictionary Data Example** (`src/provider/dictionary/data/system-status.ts`):
```ts
import type { Dictionary } from '#/global'

export default [
  { 
    label: 'Enabled', 
    value: 1, 
    i18n: 'dictionary.system.statusEnabled', 
    color: 'primary' 
  },
  { 
    label: 'Disabled', 
    value: 2, 
    i18n: 'dictionary.system.statusDisabled', 
    color: 'danger' 
  },
] as Dictionary[]
```

**Usage**:
```ts
// Using dictionary data in components
import { useDictionary } from '@/composables/useDictionary'

const { getDictionary } = useDictionary()
const statusDict = getDictionary('system-status')
```

### ECharts Service

**Description**: Provides initialization, configuration, and theme management for the ECharts library.

**Source Location**:
- GitHub: [src/provider/echarts/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider/echarts)
- Local: `/Users/zhuzhu/project/mineadmin/web/src/provider/echarts/`

**Key Features**:
- On-demand chart component imports to reduce bundle size
- Automatic theme adaptation (light/dark modes)
- Global instance registration with Vue
- Responsive chart resizing

**Usage**:
```ts
// Getting ECharts instance in components
import { useGlobal } from '@/composables/useGlobal'

const { $echarts } = useGlobal()

// Initializing charts
const chartInstance = $echarts.init(chartRef.value)
```

Reference component: [MaEcharts](/front/component/ma-echarts)

### Plugins Service

**Description**: Provides default configuration management for the MineAdmin plugin system, supporting unified plugin parameter configuration and management.

**Source Location**:
- GitHub: [src/provider/plugins/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider/plugins)
- Local: `/Users/zhuzhu/project/mineadmin/web/src/provider/plugins/`

**Key Features**:
- Centralized plugin configuration management
- Default parameter registration
- Hot configuration updates
- Plugin dependency management

Reference documentation: [Plugin System](/front/high/plugins)

### MineCore Service

**Description**: Initializes the MineAdmin core component library, providing global configuration and component registration services.

**Source Location**:
- GitHub: [src/provider/mine-core/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider/mine-core)
- Local: `/Users/zhuzhu/project/mineadmin/web/src/provider/mine-core/`

**Managed Components**:
- `ma-table` - Data table component
- `ma-search` - Search form component
- `ma-form` - Form component
- `ma-pro-table` - Advanced table component

**Usage**:
```ts
import { useGlobal } from '@/composables/useGlobal'

const { $mineCore } = useGlobal()
const tableConfig = $mineCore.table
```

### Settings Service

**Description**: Provides global configuration parameter management for frontend applications, supporting separate configurations for development and production environments.

**Source Location**:
- GitHub: [src/provider/settings/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider/settings)
- Local: `/Users/zhuzhu/project/mineadmin/web/src/provider/settings/`

**Configuration Files**:
- `index.ts` - Default configuration (do not modify directly)
- `settings.config.ts` - User custom configuration file

**Configuration Example**:
```ts
// settings.config.ts
export default {
  // System basic configuration
  app: {
    name: 'MineAdmin',
    version: '3.0.0',
    logo: '/logo.png'
  },
  // API configuration
  api: {
    baseUrl: process.env.NODE_ENV === 'development' 
      ? 'http://localhost:9501' 
      : 'https://api.example.com',
    timeout: 10000
  },
  // Theme configuration
  theme: {
    primaryColor: '#409eff',
    darkMode: 'auto'
  }
}
```

## Development Guide

### Creating Basic Service Providers

**Step 1**: Create service directory
```bash
mkdir src/provider/my-service
```

**Step 2**: Create service provider file (`src/provider/my-service/index.ts`)
```ts
import type { App } from 'vue'
import type { ProviderService } from '#/global'

// Define service interface
interface MyService {
  version: string
  getName: () => string
  setConfig: (config: any) => void
}

const provider: ProviderService.Provider<MyService> = {
  name: 'myService',
  
  init() {
    console.log('MyService initializing...')
  },
  
  setProvider(app: App) {
    const service: MyService = {
      version: '1.0.0',
      getName: () => 'My Custom Service',
      setConfig: (config) => {
        console.log('Configuration updated:', config)
      }
    }
    
    // Register to global properties
    app.config.globalProperties.$myService = service
    
    // Or use provide/inject
    app.provide('myService', service)
  },
  
  getProvider() {
    return useGlobal().$myService
  }
}

export default provider
```

### Creating Advanced Service Providers with Configuration

```ts
import type { App } from 'vue'
import type { ProviderService } from '#/global'

// Service configuration interface
interface ServiceConfig {
  apiUrl: string
  timeout: number
  retries: number
}

// Service instance interface
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
    dependencies: ['settings'] // Depends on settings service
  },
  
  async init() {
    // Async initialization logic
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
        // Implement request logic
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
    // Logic for loading external dependencies
  }
}

export default provider
```

### Using Service Providers

**In Vue Components**:
```vue
<template>
  <div>
    <h3>{{ serviceName }}</h3>
    <p>Version: {{ version }}</p>
  </div>
</template>

<script setup lang="ts">
import { useGlobal } from '@/composables/useGlobal'

const { $myService } = useGlobal()

const serviceName = $myService.getName()
const version = $myService.version

// Update configuration
$myService.setConfig({ theme: 'dark' })
</script>
```

**In Composables**:
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

## Best Practices

### 1. Naming Conventions
- Service provider names use **camelCase** format
- Directory names use **kebab-case** format
- Global properties use `$` prefix

### 2. Type Safety
```ts
// Extend global property types
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $myService: MyService
  }
}
```

### 3. Dependency Management
```ts
const provider: ProviderService.Provider = {
  name: 'dependentService',
  config: {
    dependencies: ['settings', 'dictionary']
  },
  // ...other configurations
}
```

### 4. Error Handling
```ts
setProvider(app: App) {
  try {
    // Service initialization logic
    app.config.globalProperties.$service = createService()
  } catch (error) {
    console.error(`Service ${this.name} initialization failed:`, error)
    // Provide fallback solution
    app.config.globalProperties.$service = createFallbackService()
  }
}
```

## Service Management

### Disabling Service Providers
```ts
const provider: ProviderService.Provider = {
  name: 'optionalService',
  config: {
    enabled: false // Disable this service
  },
  // ...other configurations
}
```

### Removing Service Providers
Delete the corresponding service provider directory:
```bash
rm -rf src/provider/unwanted-service
```

### Debugging Service Providers
```ts
const provider: ProviderService.Provider = {
  name: 'debugService',
  
  init() {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Provider] ${this.name} initialization complete`)
    }
  },
  
  setProvider(app: App) {
    // Add debug info in development environment
    if (process.env.NODE_ENV === 'development') {
      window.__DEBUG_PROVIDERS__ = window.__DEBUG_PROVIDERS__ || {}
      window.__DEBUG_PROVIDERS__[this.name] = this
    }
    
    // Normal service registration logic
  }
}
```

## Frequently Asked Questions

| Issue | Cause | Solution |
|------|------|----------|
| Service not registered | Missing `index.ts` file or unimplemented required interfaces | Check file existence and interface implementation |
| Cannot use Pinia | Service providers initialize before Pinia | Move Pinia-related logic to components or composables |
| Service dependency conflicts | Circular dependencies or incorrect dependency order | Redesign dependencies or use event bus |
| Type inference errors | Global property types not properly extended | Add TypeScript module declarations |
| Hot reload fails | Service caching issues | Restart development server |

## Related Resources

**Source Code References**:
- GitHub Repository: [MineAdmin Source](https://github.com/mineadmin/mineadmin)
- Service Provider Directory: [web/src/provider/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider)
- Local Source: `/Users/zhuzhu/project/mineadmin/web/src/provider/`

**Related Documentation**:
- [Plugin System](/front/high/plugins)
- [MaEcharts Component](/front/component/ma-echarts)