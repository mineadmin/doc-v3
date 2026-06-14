# フロントエンドモジュールシステム

::: tip 説明
MineAdmin フロントエンドはモジュール方式を採用し、**ビューファイル、API インターフェース、国際化ファイル**などを機能ごとにモジュール管理し、明確なコード構成を提供します。
:::

## モジュールシステムアーキテクチャ

MineAdmin のフロントエンドモジュールシステムは主に 2 つの階層に分かれています。

1. **コアモジュールシステム** (`src/modules/`) - ビジネス機能モジュール
2. **プラグインシステム** (`src/plugins/`) - 拡張可能なプラグインモジュール

### コアモジュールディレクトリ構成

```
web/src/modules/
└── base/                    # ベースコアモジュール
    ├── api/                 # API インターフェース定義
    │   ├── attachment.ts    # 添付ファイル管理インターフェース
    │   ├── log.ts          # ログ管理インターフェース
    │   ├── menu.ts         # メニュー管理インターフェース
    │   ├── permission.ts   # 権限管理インターフェース
    │   ├── role.ts         # ロール管理インターフェース
    │   └── user.ts         # ユーザー管理インターフェース
    ├── locales/            # 国際化言語パック
    │   ├── en[English].yaml
    │   ├── zh_CN[简体中文].yaml
    │   └── zh_TW[繁體中文].yaml
    └── views/              # ビューコンポーネント
        ├── dashboard/      # ダッシュボード
        ├── dataCenter/     # データセンター
        ├── log/           # ログ管理
        ├── login/         # ログインページ
        ├── permission/    # 権限管理
        ├── uc/           # ユーザーセンター
        └── welcome/      # ウェルカムページ
```

**ソースコードの場所：**
- GitHub: [https://github.com/mineadmin/mineadmin/tree/master/web/src/modules](https://github.com/mineadmin/mineadmin/tree/master/web/src/modules)
- ローカルパス: `mineadmin/web/src/modules`

## Base モジュールの詳細

`base` モジュールはシステムのコアとなる基本モジュールで、MineAdmin のすべての基本機能（ログイン認証、権限管理、ユーザー管理、メニュー管理、ログ監視など）を含んでいます。

### API インターフェース層の設計

ユーザー管理 API を例に、標準的なインターフェース設計パターンを示します。

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

// 標準 CRUD インターフェース
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

**ソースコードの場所：**
- GitHub: [https://github.com/mineadmin/mineadmin/blob/master/web/src/modules/base/api/user.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/modules/base/api/user.ts)
- ローカルパス: `mineadmin/web/src/modules/base/api/user.ts`

### 国際化サポート

モジュール内の国際化ファイルは YAML 形式を採用し、多言語をサポートします。

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

**ソースコードの場所：**
- GitHub: [https://github.com/mineadmin/mineadmin/blob/master/web/src/modules/base/locales/zh_CN%5B%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87%5D.yaml](https://github.com/mineadmin/mineadmin/blob/master/web/src/modules/base/locales/zh_CN%5B%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87%5D.yaml)
- ローカルパス: `mineadmin/web/src/modules/base/locales/zh_CN[简体中文].yaml`

## プラグインシステム

MineAdmin は強力なプラグインシステムも提供しており、`src/plugins/` ディレクトリに配置されています。プラグインシステムにより、開発者は独立した機能モジュールを作成できます。

### プラグインディレクトリ構成

```
web/src/plugins/
└── mine-admin/              # 公式プラグインネームスペース
    ├── app-store/          # アプリマーケットプラグイン
    │   ├── api/           # プラグイン API
    │   ├── views/         # プラグインビュー
    │   ├── utils/         # プラグインユーティリティ
    │   ├── style/         # プラグインスタイル
    │   └── index.ts       # プラグインエントリー
    ├── basic-ui/          # ベース UI コンポーネントライブラリ
    └── demo/              # デモプラグイン
```

### プラグイン設定例

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

**ソースコードの場所：**
- GitHub: [https://github.com/mineadmin/mineadmin/blob/master/web/src/plugins/mine-admin/app-store/index.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/plugins/mine-admin/app-store/index.ts)
- ローカルパス: `mineadmin/web/src/plugins/mine-admin/app-store/index.ts`

### プラグイン登録メカニズム

システムは Provider サービスを通じてプラグインを自動的にスキャンして登録します。

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

**ソースコードの場所：**
- GitHub: [https://github.com/mineadmin/mineadmin/blob/master/web/src/provider/plugins/index.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/provider/plugins/index.ts)
- ローカルパス: `mineadmin/web/src/provider/plugins/index.ts`

## モジュール開発規約

### 1. 新しいモジュールの作成

新機能を開発する必要がある場合は、`base` モジュールに追加するのではなく、独立したモジュールを作成することを推奨します。

```bash
web/src/modules/
└── your-module/
    ├── api/                 # API インターフェース定義
    │   └── index.ts
    ├── locales/            # 国際化ファイル
    │   ├── en[English].yaml
    │   ├── zh_CN[简体中文].yaml
    │   └── zh_TW[繁體中文].yaml
    ├── views/              # ビューコンポーネント
    │   └── index.vue
    └── types/              # 型定義（任意）
        └── index.ts
```

### 2. API インターフェース規約

各モジュールの API インターフェースは以下を満たす必要があります。
- 明確な TypeScript インターフェース型を定義する
- 統一された `useHttp()` メソッドを使用する
- RESTful API 設計原則に従う
- 完全な CRUD 操作を含む

### 3. 国際化規約

- YAML 形式を使用する
- 階層構造で翻訳キーを整理する
- サポートする言語ごとに対応ファイルを作成する
- 翻訳キーの命名はキャメルケースを使用する

### 4. ビューコンポーネント規約

- Vue 3 Composition API を使用する
- レスポンシブデザインをサポートする
- Element Plus デザイン規約に従う
- コンポーネントは保守性が高いものであるべき

## TypeScript 型サポート

システムはプラグイン設定、ルートメタ情報などを含む完全な TypeScript 型定義を提供します。

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

**ソースコードの場所：**
- GitHub: [https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts](https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts)
- ローカルパス: `mineadmin/web/types/global.d.ts`

## ベストプラクティス

::: tip 開発のアドバイス
1. **モジュールの責務は単一に**：各モジュールは特定のビジネス領域に集中する
2. **API インターフェースの統一**：標準化されたインターフェース設計パターンを使用する
3. **国際化を完全に**：すべてのテキストコンテンツに多言語サポートを提供する
4. **型安全性**：TypeScript の型システムを最大限活用する
5. **プラグイン優先**：オプション機能については、プラグイン方式での実装を優先的に検討する
:::

::: warning 注意事項
- `base` モジュールにビジネス固有の機能を追加しないでください
- 新しいモジュールは独立性を保ち、他のモジュールとの結合を減らす必要があります
- プラグインの有効化/無効化はシステムのコア機能に影響を与えてはいけません
- すべてのモジュールは国際化をサポートする必要があります
:::