# Frontend Modular System

::: tip Note
MineAdmin's frontend adopts a modular architecture, managing **view files, API interfaces, internationalization files**, etc., by functionality, providing a clear code organization structure.
:::

## Modular System Architecture

MineAdmin's frontend modular system is primarily divided into two levels:

1. **Core Module System** (`src/modules/`) - Business functional modules
2. **Plugin System** (`src/plugins/`) - Extensible plugin modules

### Core Module Directory Structure

```
web/src/modules/
└── base/                    # Core base module
    ├── api/                 # API interface definitions
    │   ├── attachment.ts    # Attachment management interface
    │   ├── log.ts          # Log management interface  
    │   ├── menu.ts         # Menu management interface
    │   ├── permission.ts   # Permission management interface
    │   ├── role.ts         # Role management interface
    │   └── user.ts         # User management interface
    ├── locales/            # Internationalization language packs
    │   ├── en[English].yaml
    │   ├── zh_CN[Simplified Chinese].yaml
    │   └── zh_TW[Traditional Chinese].yaml
    └── views/              # View components
        ├── dashboard/      # Dashboard
        ├── dataCenter/     # Data center
        ├── log/           # Log management
        ├── login/         # Login page
        ├── permission/    # Permission management
        ├── uc/           # User center
        └── welcome/      # Welcome page
```

**Source Location:**
- GitHub: [https://github.com/mineadmin/mineadmin/tree/master/web/src/modules](https://github.com/mineadmin/mineadmin/tree/master/web/src/modules)
- Local Path: `mineadmin/web/src/modules`

## Base Module Details

The `base` module is the core foundational module of the system, containing all of MineAdmin's basic functionalities: login authentication, permission management, user management, menu management, log monitoring, etc.

### API Layer Design

Taking the user management API as an example, showcasing the standard interface design pattern:

```typescript
// web/src/modules/base/api/user.ts
import type { PageList, ResponseStruct } from '#/global'

export interface UserVo {
  id?: number
  username?: string
  user_type?: number
  nickname?: string
  phone?: string
  email?: string
  avatar?: string
  signed?: string
  dashboard?: string
  status?: 1 | 2
  login_ip?: string
  login_time?: string
  backend_setting?: Record<string, any>
  remark?: string
  password?: string
}

export interface UserSearchVo {
  username?: string
  nickname?: string
  phone?: string
  email?: string
  status?: number
}

// Standard CRUD interfaces
export function page(data: UserSearchVo): Promise<ResponseStruct<PageList<UserVo>>> {
  return useHttp().get('/admin/user/list', { params: data })
}

export function create(data: UserVo): Promise<ResponseStruct<null>> {
  return useHttp().post('/admin/user', data)
}

export function save(id: number, data: UserVo): Promise<ResponseStruct<null>> {
  return useHttp().put(`/admin/user/${id}`, data)
}

export function deleteByIds(ids: number[]): Promise<ResponseStruct<null>> {
  return useHttp().delete('/admin/user', { data: ids })
}
```

**Source Location:**
- GitHub: [https://github.com/mineadmin/mineadmin/blob/master/web/src/modules/base/api/user.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/modules/base/api/user.ts)
- Local Path: `mineadmin/web/src/modules/base/api/user.ts`

### Internationalization Support

Internationalization files within modules use YAML format, supporting multiple languages:

```yaml
# web/src/modules/base/locales/zh_CN[Simplified Chinese].yaml
baseUserManage:
  avatar: Avatar
  username: Username
  nickname: Nickname
  phone: Phone
  email: Email
  password: Password
  userType: User Type
  role: Role
  signed: Personal Signature
  mainTitle: User Management
  subTitle: Provides user addition, editing, and deletion functions. Super administrators cannot be modified.

baseRoleManage:
  mainTitle: Role Management
  subTitle: Provides user role and permission settings
  name: Role Name
  code: Role Identifier
  permission: Permission Menu
  setPermission: Grant Permissions
```

**Source Location:**
- GitHub: [https://github.com/mineadmin/mineadmin/blob/master/web/src/modules/base/locales/zh_CN%5B%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87%5D.yaml](https://github.com/mineadmin/mineadmin/blob/master/web/src/modules/base/locales/zh_CN%5B%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87%5D.yaml)
- Local Path: `mineadmin/web/src/modules/base/locales/zh_CN[Simplified Chinese].yaml`

## Plugin System

MineAdmin also provides a powerful plugin system located in the `src/plugins/` directory. The plugin system allows developers to create independent functional modules.

### Plugin Directory Structure

```
web/src/plugins/
└── mine-admin/              # Official plugin namespace
    ├── app-store/          # App Store plugin
    │   ├── api/           # Plugin API
    │   ├── views/         # Plugin views
    │   ├── utils/         # Plugin utilities
    │   ├── style/         # Plugin styles
    │   └── index.ts       # Plugin entry
    ├── basic-ui/          # Basic UI component library
    └── demo/              # Demo plugin
```

### Plugin Configuration Example

```typescript
// web/src/plugins/mine-admin/app-store/index.ts
import type { Plugin } from '#/global'

const pluginConfig: Plugin.PluginConfig = {
  install() {
    console.log('MineAdmin App Store started')
  },
  config: {
    enable: import.meta.env.DEV,
    info: {
      name: 'mine-admin/app-store',
      version: '1.0.0',
      author: 'X.Mo',
      description: 'Provides app store functionality',
    },
  },
  views: [
    {
      name: 'MineAppStoreRoute',
      path: '/appstore',
      meta: {
        title: 'App Store',
        badge: () => 'Hot',
        i18n: 'menu.appstore',
        icon: 'vscode-icons:file-type-azure',
        type: 'M',
        hidden: true,
        subForceShow: true,
        breadcrumbEnable: true,
        copyright: false,
        cache: true,
      },
      component: () => import('./views/index.vue'),
    },
  ],
}

export default pluginConfig
```

**Source Location:**
- GitHub: [https://github.com/mineadmin/mineadmin/blob/master/web/src/plugins/mine-admin/app-store/index.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/plugins/mine-admin/app-store/index.ts)
- Local Path: `mineadmin/web/src/plugins/mine-admin/app-store/index.ts`

### Plugin Registration Mechanism

The system automatically scans and registers plugins through the Provider service:

```typescript
// web/src/provider/plugins/index.ts
const pluginList = {}
async function getPluginList() {
  // Automatically scan plugin directory
  const plugins = import.meta.glob('../../plugins/*/*/index.ts')
  const sortedPlugins: any[] = []
  
  for (const path in plugins) {
    const { default: plugin }: any = await plugins[path]()
    sortedPlugins.push(plugin)
  }

  // Sort plugins by priority
  sort(sortedPlugins, f => f.config.info.order ?? 0, true).map((item) => {
    pluginList[item.config.info.name] = item
  })
}

const provider: ProviderService.Provider = {
  name: 'plugins',
  async init() {
    await getPluginList()
    await getPluginConfig()
  },
  setProvider(app: App) {
    app.config.globalProperties.$plugins = pluginList
    app.config.globalProperties.$pluginsConfig = pluginConfig
  },
  getProvider(): any {
    return useGlobal().$plugins
  },
}
```

**Source Location:**
- GitHub: [https://github.com/mineadmin/mineadmin/blob/master/web/src/provider/plugins/index.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/provider/plugins/index.ts)
- Local Path: `mineadmin/web/src/provider/plugins/index.ts`

## Module Development Standards

### 1. Creating New Modules

When developing new features, it's recommended to create independent modules rather than adding to the `base` module:

```bash
web/src/modules/
└── your-module/
    ├── api/                 # API interface definitions
    │   └── index.ts
    ├── locales/            # Internationalization files
    │   ├── en[English].yaml
    │   ├── zh_CN[Simplified Chinese].yaml
    │   └── zh_TW[Traditional Chinese].yaml
    ├── views/              # View components
    │   └── index.vue
    └── types/              # Type definitions (optional)
        └── index.ts
```

### 2. API Interface Standards

Each module's API interfaces should:
- Define clear TypeScript interface types
- Use the unified `useHttp()` method
- Follow RESTful API design principles
- Include complete CRUD operations

### 3. Internationalization Standards

- Use YAML format
- Organize translation keys hierarchically
- Create corresponding files for each supported language
- Name translation keys using camelCase

### 4. View Component Standards

- Use Vue 3 Composition API
- Support responsive design
- Follow Element Plus design standards
- Components should be maintainable

## TypeScript Type Support

The system provides complete TypeScript type definitions, including plugin configuration, route meta information, etc.:

```typescript
// types/global.d.ts
declare namespace Plugin {
  interface Info {
    name: string
    version: string
    author: string
    description: string
    order?: number
  }

  interface Config {
    info: Info
    enable: boolean
  }

  interface PluginConfig {
    install: (app: App) => void
    config: Config
    views?: Views[]
    hooks?: {
      start?: (config: Config) => any | void
      setup?: () => any | void
      registerRoute?: (router: Router, routesRaw: Route.RouteRecordRaw[]) => any | void
      // ... More hooks
    }
  }
}
```

**Source Location:**
- GitHub: [https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts](https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts)
- Local Path: `mineadmin/web/types/global.d.ts`

## Best Practices

::: tip Development Recommendations
1. **Single Responsibility for Modules**: Each module focuses on a specific business domain
2. **Unified API Interfaces**: Use standardized interface design patterns
3. **Complete Internationalization**: Provide multilingual support for all text content
4. **Type Safety**: Make full use of TypeScript's type system
5. **Plugins First**: For optional features, prioritize plugin implementation
:::

::: warning Notes
- Avoid adding business-specific functionality to the `base` module
- New modules should maintain independence and reduce coupling with other modules
- Enabling/disabling plugins should not affect core system functionality
- All modules should support internationalization
:::