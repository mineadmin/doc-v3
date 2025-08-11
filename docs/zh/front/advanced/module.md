# 前端模块化系统

::: tip 说明
MineAdmin 前端采用模块化架构，将**视图文件、API接口、国际化文件**等按功能进行模块化管理，提供清晰的代码组织结构。
:::

## 模块系统架构

MineAdmin 的前端模块系统主要分为两个层面：

1. **核心模块系统** (`src/modules/`) - 业务功能模块
2. **插件系统** (`src/plugins/`) - 可扩展插件模块

### 核心模块目录结构

```
web/src/modules/
└── base/                    # 基础核心模块
    ├── api/                 # API 接口定义
    │   ├── attachment.ts    # 附件管理接口
    │   ├── log.ts          # 日志管理接口  
    │   ├── menu.ts         # 菜单管理接口
    │   ├── permission.ts   # 权限管理接口
    │   ├── role.ts         # 角色管理接口
    │   └── user.ts         # 用户管理接口
    ├── locales/            # 国际化语言包
    │   ├── en[English].yaml
    │   ├── zh_CN[简体中文].yaml
    │   └── zh_TW[繁體中文].yaml
    └── views/              # 视图组件
        ├── dashboard/      # 仪表盘
        ├── dataCenter/     # 数据中心
        ├── log/           # 日志管理
        ├── login/         # 登录页面
        ├── permission/    # 权限管理
        ├── uc/           # 用户中心
        └── welcome/      # 欢迎页
```

**源码位置：**
- GitHub: [https://github.com/mineadmin/mineadmin/tree/main/web/src/modules](https://github.com/mineadmin/mineadmin/tree/main/web/src/modules)
- 本地路径: `/Users/zhuzhu/project/mineadmin/web/src/modules`

## Base 模块详解

`base` 模块是系统的核心基础模块，包含了 MineAdmin 的所有基础功能：登录认证、权限管理、用户管理、菜单管理、日志监控等。

### API 接口层设计

以用户管理 API 为例，展示标准的接口设计模式：

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

// 标准 CRUD 接口
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

**源码位置：**
- GitHub: [https://github.com/mineadmin/mineadmin/blob/master/web/src/modules/base/api/user.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/modules/base/api/user.ts)
- 本地路径: `/Users/zhuzhu/project/mineadmin/web/src/modules/base/api/user.ts`

### 国际化支持

模块内的国际化文件采用 YAML 格式，支持多语言：

```yaml
# web/src/modules/base/locales/zh_CN[简体中文].yaml
baseUserManage:
  avatar: 头像
  username: 用户名
  nickname: 昵称
  phone: 手机
  email: 邮箱
  password: 密码
  userType: 用户类型
  role: 角色
  signed: 个人签名
  mainTitle: 用户管理
  subTitle: 提供用户添加、编辑、删除功能，超管不可修改。

baseRoleManage:
  mainTitle: 角色管理
  subTitle: 提供用户角色、权限设置
  name: 角色名称
  code: 角色标识
  permission: 权限菜单
  setPermission: 赋予权限
```

**源码位置：**
- GitHub: [https://github.com/mineadmin/mineadmin/blob/master/web/src/modules/base/locales/zh_CN%5B%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87%5D.yaml](https://github.com/mineadmin/mineadmin/blob/master/web/src/modules/base/locales/zh_CN%5B%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87%5D.yaml)
- 本地路径: `/Users/zhuzhu/project/mineadmin/web/src/modules/base/locales/zh_CN[简体中文].yaml`

## 插件系统

MineAdmin 还提供了强大的插件系统，位于 `src/plugins/` 目录。插件系统允许开发者创建独立的功能模块。

### 插件目录结构

```
web/src/plugins/
└── mine-admin/              # 官方插件命名空间
    ├── app-store/          # 应用市场插件
    │   ├── api/           # 插件 API
    │   ├── views/         # 插件视图
    │   ├── utils/         # 插件工具
    │   ├── style/         # 插件样式
    │   └── index.ts       # 插件入口
    ├── basic-ui/          # 基础 UI 组件库
    └── demo/              # 演示插件
```

### 插件配置示例

```typescript
// web/src/plugins/mine-admin/app-store/index.ts
import type { Plugin } from '#/global'

const pluginConfig: Plugin.PluginConfig = {
  install() {
    console.log('MineAdmin应用市场已启动')
  },
  config: {
    enable: import.meta.env.DEV,
    info: {
      name: 'mine-admin/app-store',
      version: '1.0.0',
      author: 'X.Mo',
      description: '提供应用市场功能',
    },
  },
  views: [
    {
      name: 'MineAppStoreRoute',
      path: '/appstore',
      meta: {
        title: '应用市场',
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

**源码位置：**
- GitHub: [https://github.com/mineadmin/mineadmin/blob/master/web/src/plugins/mine-admin/app-store/index.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/plugins/mine-admin/app-store/index.ts)
- 本地路径: `/Users/zhuzhu/project/mineadmin/web/src/plugins/mine-admin/app-store/index.ts`

### 插件注册机制

系统通过 Provider 服务自动扫描和注册插件：

```typescript
// web/src/provider/plugins/index.ts
const pluginList = {}
async function getPluginList() {
  // 自动扫描插件目录
  const plugins = import.meta.glob('../../plugins/*/*/index.ts')
  const sortedPlugins: any[] = []
  
  for (const path in plugins) {
    const { default: plugin }: any = await plugins[path]()
    sortedPlugins.push(plugin)
  }

  // 按优先级排序插件
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

**源码位置：**
- GitHub: [https://github.com/mineadmin/mineadmin/blob/master/web/src/provider/plugins/index.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/provider/plugins/index.ts)
- 本地路径: `/Users/zhuzhu/project/mineadmin/web/src/provider/plugins/index.ts`

## 模块开发规范

### 1. 创建新模块

当需要开发新功能时，建议创建独立模块而不是在 `base` 模块下添加：

```bash
web/src/modules/
└── your-module/
    ├── api/                 # API 接口定义
    │   └── index.ts
    ├── locales/            # 国际化文件
    │   ├── en[English].yaml
    │   ├── zh_CN[简体中文].yaml
    │   └── zh_TW[繁體中文].yaml
    ├── views/              # 视图组件
    │   └── index.vue
    └── types/              # 类型定义（可选）
        └── index.ts
```

### 2. API 接口规范

每个模块的 API 接口应该：
- 定义清晰的 TypeScript 接口类型
- 使用统一的 `useHttp()` 方法
- 遵循 RESTful API 设计原则
- 包含完整的 CRUD 操作

### 3. 国际化规范

- 使用 YAML 格式
- 采用层级结构组织翻译键
- 为每个支持的语言创建对应文件
- 翻译键命名采用驼峰式

### 4. 视图组件规范

- 使用 Vue 3 Composition API
- 支持响应式设计
- 遵循 Element Plus 设计规范
- 组件应具备良好的可维护性

## TypeScript 类型支持

系统提供了完整的 TypeScript 类型定义，包括插件配置、路由元信息等：

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
      // ... 更多钩子
    }
  }
}
```

**源码位置：**
- GitHub: [https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts](https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts)
- 本地路径: `/Users/zhuzhu/project/mineadmin/web/types/global.d.ts`

## 最佳实践

::: tip 开发建议
1. **模块职责单一**：每个模块专注于特定的业务领域
2. **API 接口统一**：使用标准化的接口设计模式
3. **国际化完整**：为所有文本内容提供多语言支持
4. **类型安全**：充分利用 TypeScript 类型系统
5. **插件优先**：对于可选功能，优先考虑插件方式实现
:::

::: warning 注意事项
- 避免在 `base` 模块中添加业务特定功能
- 新模块应该保持独立性，减少与其他模块的耦合
- 插件的启用/禁用不应影响系统核心功能
- 所有模块都应该支持国际化
:::