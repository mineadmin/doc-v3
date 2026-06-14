# Service Provider

## Overview

### Core Function
The Service Provider (Provider) is a core feature of the MineAdmin 3.0 frontend architecture. Drawing on the design concept of backend service providers, it offers a modular service registration and management mechanism for frontend applications.

::: tip Main Features
- **Global Service Registration**: Register services into Vue's `globalProperties` or `provide/inject` system
- **Component Initialization**: Automatically initialize and configure global components
- **Plugin Configuration Management**: Provide default configurations and parameter management for plugins
- **Dependency Injection**: Implement dependency relationship management between services
- **Modular Architecture**: Support organizing services by functional modules
:::

### Initialization Order
::: danger Important Note
Service providers are loaded in the early stages of application initialization, **before** the initialization of `pinia`, `vue-router`, `vue-i18n`, and other libraries. Therefore, these libraries' functionalities cannot be directly used within service providers.

**Initialization Order**:
1. Service Provider scanning and registration ⚡
2. Pinia state management initialization
3. Vue Router routing initialization
4. Vue I18n internationalization initialization
5. Application main body startup
:::

## Architecture Design

### Directory Structure
```
src/provider/
├── dictionary/          # Dictionary Service Provider
│   ├── index.ts        # Service Provider Main File
│   └── data/           # Dictionary Data Files
├── echarts/            # Chart Service Provider
│   └── index.ts
├── plugins/            # Plugin Configuration Service Provider
│   └── index.ts
├── mine-core/          # Core Component Service Provider
│   └── index.ts
├── settings/           # System Configuration Service Provider
│   ├── index.ts
│   └── settings.config.ts
└── toolbars/           # Toolbar Service Provider
    └── index.ts
```

### Auto-Discovery Mechanism
Upon system startup, all subdirectories under `src/provider/` are automatically scanned. The `index.ts` file in each subdirectory is identified as a service provider and registered automatically.

## System Built-in Services

### Dictionary Service

**Function Description**: Provides unified data dictionary management functionality, supporting multi-language and theme color schemes.

**Source Location**:
- GitHub: [src/provider/dictionary/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider/dictionary)
- Local: `/Users/zhuzhu/project/mineadmin/web/src/provider/dictionary/`

**Core Features**:
- Supports multi-language internationalization identifiers
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

**Function Description**: Provides ECharts chart library initialization, configuration, and theme management capabilities.

**Source Location**:
- GitHub: [src/provider/echarts/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider/echarts)
- Local: `/Users/zhuzhu/project/mineadmin/web/src/provider/echarts/`

**Core Features**:
- Import chart components on demand, reducing bundle size
- Automatic adaptation to system themes (light/dark mode)
- Global instance registration into Vue
- Responsive chart size adjustment

**Usage**:
```ts
// Getting ECharts instance in components
import { useGlobal } from '@/composables/useGlobal'

const { $echarts } = useGlobal()

// Initialize chart
const chartInstance = $echarts.init(chartRef.value)
```

Reference Component: [MaEcharts](/v3/front/component/ma-echarts)

### Plugins Service

**Function Description**: Provides default configuration management for the MineAdmin plugin system, supporting unified configuration and management of plugin parameters.

**Source Location**:
- GitHub: [src/provider/plugins/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider/plugins)
- Local: `/Users/zhuzhu/project/mineadmin/web/src/provider/plugins/`

**Core Features**:
- Centralized plugin configuration management
- Default parameter registration
- Configuration hot-reload support
- Plugin dependency relationship management

Reference Documentation: [Plugin System](/v3/front/high/plugins)

### MineCore Service

**Function Description**: Initializes the MineAdmin core component library, providing global configuration and component registration services.

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

**Function Description**: Provides global configuration parameter management for the frontend application, supporting configuration separation between development and production environments.

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
  // System base configuration
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

### Creating a Basic Service Provider

**Step 1**: Create the service directory
```bash
mkdir src/provider/my-service
```

**Step 2**: Create the service provider file (`src/provider/my-service/index.ts`)
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
    console.log('MyService is initializing...')
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

### Creating an Advanced Service Provider with Configuration

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
    dependencies: ['settings'] // Depends on the settings service
  },
  
  async init() {
    // Asynchronous initialization logic
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
    // Logic for loading external dependency libraries
  }
}

export default provider
```

### Using a Service Provider

**In a Vue Component**:
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

**In a Composable**:
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
- Global properties use the `$` prefix

### 2. Type Safety
```ts
// Extending global property types
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

### Disabling a Service Provider
```ts
const provider: ProviderService.Provider = {
  name: 'optionalService',
  config: {
    enabled: false // Disable this service
  },
  // ...other configurations
}
```

### Removing a Service Provider
Simply delete the corresponding service provider directory:
```bash
rm -rf src/provider/unwanted-service
```

### Debugging a Service Provider
```ts
const provider: ProviderService.Provider = {
  name: 'debugService',
  
  init() {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Provider] ${this.name} initialization complete`)
    }
  },
  
  setProvider(app: App) {
    // Add debug information in development environment
    if (process.env.NODE_ENV === 'development') {
      window.__DEBUG_PROVIDERS__ = window.__DEBUG_PROVIDERS__ || {}
      window.__DEBUG_PROVIDERS__[this.name] = this
    }
    
    // Normal service registration logic
  }
}
```

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Service not registered successfully | Missing `index.ts` file or required interfaces not implemented | Check file existence and interface implementation |
| Cannot use Pinia | Service provider initialization occurs before Pinia | Move Pinia-related logic to components or Composables |
| Service dependency conflict | Circular dependency or incorrect dependency order | Redesign dependency relationships or use an event bus |
| Type inference error | Global property types not correctly extended | Add TypeScript module declaration |
| Hot reload not working | Service caching issue | Restart the development server |

## Related Resources

**Source Code Reference**:
- GitHub Repository: [MineAdmin Source Code](https://github.com/mineadmin/mineadmin)
- Service Provider Directory: [web/src/provider/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider)
- Local Source Code: `/Users/zhuzhu/project/mineadmin/web/src/provider/`

**Related Documentation**:
- [Plugin System](/v3/front/high/plugins)
- [MaEcharts Component](/v3/front/component/ma-echarts)