# 前端模組化系統

::: tip 說明
MineAdmin 前端採用模組化架構，將**檢視檔案、API介面、國際化檔案**等按功能進行模組化管理，提供清晰的程式碼組織結構。
:::

## 模組系統架構

MineAdmin 的前端模組系統主要分為兩個層面：

1. **核心模組系統** (`src/modules/`) - 業務功能模組
2. **外掛系統** (`src/plugins/`) - 可擴充套件外掛模組

### 核心模組目錄結構

```
web/src/modules/
└── base/                    # 基礎核心模組
    ├── api/                 # API 介面定義
    │   ├── attachment.ts    # 附件管理介面
    │   ├── log.ts          # 日誌管理介面  
    │   ├── menu.ts         # 選單管理介面
    │   ├── permission.ts   # 許可權管理介面
    │   ├── role.ts         # 角色管理介面
    │   └── user.ts         # 使用者管理介面
    ├── locales/            # 國際化語言包
    │   ├── en[English].yaml
    │   ├── zh_CN[簡體中文].yaml
    │   └── zh_TW[繁體中文].yaml
    └── views/              # 檢視元件
        ├── dashboard/      # 儀表盤
        ├── dataCenter/     # 資料中心
        ├── log/           # 日誌管理
        ├── login/         # 登入頁面
        ├── permission/    # 許可權管理
        ├── uc/           # 使用者中心
        └── welcome/      # 歡迎頁
```

**原始碼位置：**
- GitHub: [https://github.com/mineadmin/mineadmin/tree/master/web/src/modules](https://github.com/mineadmin/mineadmin/tree/master/web/src/modules)
- 本地路徑: `mineadmin/web/src/modules`

## Base 模組詳解

`base` 模組是系統的核心基礎模組，包含了 MineAdmin 的所有基礎功能：登入認證、許可權管理、使用者管理、選單管理、日誌監控等。

### API 介面層設計

以使用者管理 API 為例，展示標準的介面設計模式：

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

// 標準 CRUD 介面
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

**原始碼位置：**
- GitHub: [https://github.com/mineadmin/mineadmin/blob/master/web/src/modules/base/api/user.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/modules/base/api/user.ts)
- 本地路徑: `mineadmin/web/src/modules/base/api/user.ts`

### 國際化支援

模組內的國際化檔案採用 YAML 格式，支援多語言：

```yaml
# web/src/modules/base/locales/zh_CN[簡體中文].yaml
baseUserManage:
  avatar: 頭像
  username: 使用者名稱
  nickname: 暱稱
  phone: 手機
  email: 郵箱
  password: 密碼
  userType: 使用者型別
  role: 角色
  signed: 個人簽名
  mainTitle: 使用者管理
  subTitle: 提供使用者新增、編輯、刪除功能，超管不可修改。

baseRoleManage:
  mainTitle: 角色管理
  subTitle: 提供使用者角色、許可權設定
  name: 角色名稱
  code: 角色標識
  permission: 許可權選單
  setPermission: 賦予許可權
```

**原始碼位置：**
- GitHub: [https://github.com/mineadmin/mineadmin/blob/master/web/src/modules/base/locales/zh_CN%5B%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87%5D.yaml](https://github.com/mineadmin/mineadmin/blob/master/web/src/modules/base/locales/zh_CN%5B%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87%5D.yaml)
- 本地路徑: `mineadmin/web/src/modules/base/locales/zh_CN[簡體中文].yaml`

## 外掛系統

MineAdmin 還提供了強大的外掛系統，位於 `src/plugins/` 目錄。外掛系統允許開發者建立獨立的功能模組。

### 外掛目錄結構

```
web/src/plugins/
└── mine-admin/              # 官方外掛名稱空間
    ├── app-store/          # 應用市場外掛
    │   ├── api/           # 外掛 API
    │   ├── views/         # 外掛檢視
    │   ├── utils/         # 外掛工具
    │   ├── style/         # 外掛樣式
    │   └── index.ts       # 外掛入口
    ├── basic-ui/          # 基礎 UI 元件庫
    └── demo/              # 演示外掛
```

### 外掛配置示例

```typescript
// web/src/plugins/mine-admin/app-store/index.ts
import type { Plugin } from '#/global'

const pluginConfig: Plugin.PluginConfig = {
  install() {
    console.log('MineAdmin應用市場已啟動')
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

**原始碼位置：**
- GitHub: [https://github.com/mineadmin/mineadmin/blob/master/web/src/plugins/mine-admin/app-store/index.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/plugins/mine-admin/app-store/index.ts)
- 本地路徑: `mineadmin/web/src/plugins/mine-admin/app-store/index.ts`

### 外掛註冊機制

系統透過 Provider 服務自動掃描和註冊外掛：

```typescript
// web/src/provider/plugins/index.ts
const pluginList = {}
async function getPluginList() {
  // 自動掃描外掛目錄
  const plugins = import.meta.glob('../../plugins/*/*/index.ts')
  const sortedPlugins: any[] = []
  
  for (const path in plugins) {
    const { default: plugin }: any = await plugins[path]()
    sortedPlugins.push(plugin)
  }

  // 按優先順序排序外掛
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

**原始碼位置：**
- GitHub: [https://github.com/mineadmin/mineadmin/blob/master/web/src/provider/plugins/index.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/provider/plugins/index.ts)
- 本地路徑: `mineadmin/web/src/provider/plugins/index.ts`

## 模組開發規範

### 1. 建立新模組

當需要開發新功能時，建議建立獨立模組而不是在 `base` 模組下新增：

```bash
web/src/modules/
└── your-module/
    ├── api/                 # API 介面定義
    │   └── index.ts
    ├── locales/            # 國際化檔案
    │   ├── en[English].yaml
    │   ├── zh_CN[簡體中文].yaml
    │   └── zh_TW[繁體中文].yaml
    ├── views/              # 檢視元件
    │   └── index.vue
    └── types/              # 型別定義（可選）
        └── index.ts
```

### 2. API 介面規範

每個模組的 API 介面應該：
- 定義清晰的 TypeScript 介面型別
- 使用統一的 `useHttp()` 方法
- 遵循 RESTful API 設計原則
- 包含完整的 CRUD 操作

### 3. 國際化規範

- 使用 YAML 格式
- 採用層級結構組織翻譯鍵
- 為每個支援的語言建立對應檔案
- 翻譯鍵命名採用駝峰式

### 4. 檢視元件規範

- 使用 Vue 3 Composition API
- 支援響應式設計
- 遵循 Element Plus 設計規範
- 元件應具備良好的可維護性

## TypeScript 型別支援

系統提供了完整的 TypeScript 型別定義，包括外掛配置、路由元資訊等：

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
      // ... 更多鉤子
    }
  }
}
```

**原始碼位置：**
- GitHub: [https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts](https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts)
- 本地路徑: `mineadmin/web/types/global.d.ts`

## 最佳實踐

::: tip 開發建議
1. **模組職責單一**：每個模組專注於特定的業務領域
2. **API 介面統一**：使用標準化的介面設計模式
3. **國際化完整**：為所有文字內容提供多語言支援
4. **型別安全**：充分利用 TypeScript 型別系統
5. **外掛優先**：對於可選功能，優先考慮外掛方式實現
:::

::: warning 注意事項
- 避免在 `base` 模組中新增業務特定功能
- 新模組應該保持獨立性，減少與其他模組的耦合
- 外掛的啟用/停用不應影響系統核心功能
- 所有模組都應該支援國際化
:::