# 前端模塊化系統

::: tip 説明
MineAdmin 前端採用模塊化架構，將**視圖文件、API接口、國際化文件**等按功能進行模塊化管理，提供清晰的代碼組織結構。
:::

## 模塊系統架構

MineAdmin 的前端模塊系統主要分為兩個層面：

1. **核心模塊系統** (`src/modules/`) - 業務功能模塊
2. **插件系統** (`src/plugins/`) - 可擴展插件模塊

### 核心模塊目錄結構

```
web/src/modules/
└── base/                    # 基礎核心模塊
    ├── api/                 # API 接口定義
    │   ├── attachment.ts    # 附件管理接口
    │   ├── log.ts          # 日誌管理接口  
    │   ├── menu.ts         # 菜單管理接口
    │   ├── permission.ts   # 權限管理接口
    │   ├── role.ts         # 角色管理接口
    │   └── user.ts         # 用户管理接口
    ├── locales/            # 國際化語言包
    │   ├── en[English].yaml
    │   ├── zh_CN[簡體中文].yaml
    │   └── zh_TW[繁體中文].yaml
    └── views/              # 視圖組件
        ├── dashboard/      # 儀表盤
        ├── dataCenter/     # 數據中心
        ├── log/           # 日誌管理
        ├── login/         # 登錄頁面
        ├── permission/    # 權限管理
        ├── uc/           # 用户中心
        └── welcome/      # 歡迎頁
```

**源碼位置：**
- GitHub: [https://github.com/mineadmin/mineadmin/tree/master/web/src/modules](https://github.com/mineadmin/mineadmin/tree/master/web/src/modules)
- 本地路徑: `mineadmin/web/src/modules`

## Base 模塊詳解

`base` 模塊是系統的核心基礎模塊，包含了 MineAdmin 的所有基礎功能：登錄認證、權限管理、用户管理、菜單管理、日誌監控等。

### API 接口層設計

以用户管理 API 為例，展示標準的接口設計模式：

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

// 標準 CRUD 接口
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

**源碼位置：**
- GitHub: [https://github.com/mineadmin/mineadmin/blob/master/web/src/modules/base/api/user.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/modules/base/api/user.ts)
- 本地路徑: `mineadmin/web/src/modules/base/api/user.ts`

### 國際化支持

模塊內的國際化文件採用 YAML 格式，支持多語言：

```yaml
# web/src/modules/base/locales/zh_CN[簡體中文].yaml
baseUserManage:
  avatar: 頭像
  username: 用户名
  nickname: 暱稱
  phone: 手機
  email: 郵箱
  password: 密碼
  userType: 用户類型
  role: 角色
  signed: 個人簽名
  mainTitle: 用户管理
  subTitle: 提供用户添加、編輯、刪除功能，超管不可修改。

baseRoleManage:
  mainTitle: 角色管理
  subTitle: 提供用户角色、權限設置
  name: 角色名稱
  code: 角色標識
  permission: 權限菜單
  setPermission: 賦予權限
```

**源碼位置：**
- GitHub: [https://github.com/mineadmin/mineadmin/blob/master/web/src/modules/base/locales/zh_CN%5B%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87%5D.yaml](https://github.com/mineadmin/mineadmin/blob/master/web/src/modules/base/locales/zh_CN%5B%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87%5D.yaml)
- 本地路徑: `mineadmin/web/src/modules/base/locales/zh_CN[簡體中文].yaml`

## 插件系統

MineAdmin 還提供了強大的插件系統，位於 `src/plugins/` 目錄。插件系統允許開發者創建獨立的功能模塊。

### 插件目錄結構

```
web/src/plugins/
└── mine-admin/              # 官方插件命名空間
    ├── app-store/          # 應用市場插件
    │   ├── api/           # 插件 API
    │   ├── views/         # 插件視圖
    │   ├── utils/         # 插件工具
    │   ├── style/         # 插件樣式
    │   └── index.ts       # 插件入口
    ├── basic-ui/          # 基礎 UI 組件庫
    └── demo/              # 演示插件
```

### 插件配置示例

```typescript
// web/src/plugins/mine-admin/app-store/index.ts
import type { Plugin } from '#/global'

const pluginConfig: Plugin.PluginConfig = {
  install() {
    console.log('MineAdmin應用市場已啓動')
  },
  config: {
    enable: import.meta.env.DEV,
    info: {
      name: 'mine-admin/app-store',
      version: '1.0.0',
      author: 'X.Mo',
      description: '提供應用市場功能',
    },
  },
  views: [
    {
      name: 'MineAppStoreRoute',
      path: '/appstore',
      meta: {
        title: '應用市場',
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

**源碼位置：**
- GitHub: [https://github.com/mineadmin/mineadmin/blob/master/web/src/plugins/mine-admin/app-store/index.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/plugins/mine-admin/app-store/index.ts)
- 本地路徑: `mineadmin/web/src/plugins/mine-admin/app-store/index.ts`

### 插件註冊機制

系統通過 Provider 服務自動掃描和註冊插件：

```typescript
// web/src/provider/plugins/index.ts
const pluginList = {}
async function getPluginList() {
  // 自動掃描插件目錄
  const plugins = import.meta.glob('../../plugins/*/*/index.ts')
  const sortedPlugins: any[] = []
  
  for (const path in plugins) {
    const { default: plugin }: any = await plugins[path]()
    sortedPlugins.push(plugin)
  }

  // 按優先級排序插件
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

**源碼位置：**
- GitHub: [https://github.com/mineadmin/mineadmin/blob/master/web/src/provider/plugins/index.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/provider/plugins/index.ts)
- 本地路徑: `mineadmin/web/src/provider/plugins/index.ts`

## 模塊開發規範

### 1. 創建新模塊

當需要開發新功能時，建議創建獨立模塊而不是在 `base` 模塊下添加：

```bash
web/src/modules/
└── your-module/
    ├── api/                 # API 接口定義
    │   └── index.ts
    ├── locales/            # 國際化文件
    │   ├── en[English].yaml
    │   ├── zh_CN[簡體中文].yaml
    │   └── zh_TW[繁體中文].yaml
    ├── views/              # 視圖組件
    │   └── index.vue
    └── types/              # 類型定義（可選）
        └── index.ts
```

### 2. API 接口規範

每個模塊的 API 接口應該：
- 定義清晰的 TypeScript 接口類型
- 使用統一的 `useHttp()` 方法
- 遵循 RESTful API 設計原則
- 包含完整的 CRUD 操作

### 3. 國際化規範

- 使用 YAML 格式
- 採用層級結構組織翻譯鍵
- 為每個支持的語言創建對應文件
- 翻譯鍵命名採用駝峯式

### 4. 視圖組件規範

- 使用 Vue 3 Composition API
- 支持響應式設計
- 遵循 Element Plus 設計規範
- 組件應具備良好的可維護性

## TypeScript 類型支持

系統提供了完整的 TypeScript 類型定義，包括插件配置、路由元信息等：

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
      // ... 更多鈎子
    }
  }
}
```

**源碼位置：**
- GitHub: [https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts](https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts)
- 本地路徑: `mineadmin/web/types/global.d.ts`

## 最佳實踐

::: tip 開發建議
1. **模塊職責單一**：每個模塊專注於特定的業務領域
2. **API 接口統一**：使用標準化的接口設計模式
3. **國際化完整**：為所有文本內容提供多語言支持
4. **類型安全**：充分利用 TypeScript 類型系統
5. **插件優先**：對於可選功能，優先考慮插件方式實現
:::

::: warning 注意事項
- 避免在 `base` 模塊中添加業務特定功能
- 新模塊應該保持獨立性，減少與其他模塊的耦合
- 插件的啓用/禁用不應影響系統核心功能
- 所有模塊都應該支持國際化
:::