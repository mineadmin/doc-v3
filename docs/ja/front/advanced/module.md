# フロントエンドモジュール化システム

::: tip 説明
MineAdminのフロントエンドはモジュール化アーキテクチャを採用し、**ビューファイル、APIインターフェース、国際化ファイル**などを機能ごとにモジュール管理し、明確なコード構造を提供します。
:::

## モジュールシステムアーキテクチャ

MineAdminのフロントエンドモジュールシステムは主に2つの層に分かれます：

1. **コアモジュールシステム** (`src/modules/`) - 業務機能モジュール
2. **プラグインシステム** (`src/plugins/`) - 拡張可能なプラグインモジュール

### コアモジュールディレクトリ構造

```
web/src/modules/
└── base/                    # 基本コアモジュール
    ├── api/                 # API インターフェース定義
    │   ├── attachment.ts    # 添付ファイル管理インターフェース
    │   ├── log.ts          # ログ管理インターフェース  
    │   ├── menu.ts         # メニュー管理インターフェース
    │   ├── permission.ts   # 権限管理インターフェース
    │   ├── role.ts         # ロール管理インターフェース
    │   └── user.ts         # ユーザー管理インターフェース
    ├── locales/            # 国際化言語パック
    │   ├── en[English].yaml
    │   ├── zh_CN[簡体字中国語].yaml
    │   └── zh_TW[繁体字中国語].yaml
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

`base` モジュールはシステムのコア基本モジュールで、MineAdminのすべての基本機能を含みます：ログイン認証、権限管理、ユーザー管理、メニュー管理、ログ監視など。

### API インターフェース層設計

ユーザー管理APIを例に、標準的なインターフェース設計パターンを表示：

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

モジュール内の国際化ファイルはYAML形式を使用し、多言語をサポート：

```yaml
# web/src/modules/base/locales/zh_CN[簡体字中国語].yaml
baseUserManage:
  avatar: アバター
  username: ユーザー名
  nickname: ニックネーム
  phone: 電話
  email: メール
  password: パスワード
  userType: ユーザータイプ
  role: ロール
  signed: 個人署名
  mainTitle: ユーザー管理
  subTitle: ユーザーの追加、編集、削除機能を提供します。スーパー管理者は変更できません。

baseRoleManage:
  mainTitle: ロール管理
  subTitle: ユーザーロールと権限設定を提供
  name: ロール名
  code: ロール識別子
  permission: 権限メニュー
  setPermission: 権限付与
```

**ソースコードの場所：**
- GitHub: [https://github.com/mineadmin/mineadmin/blob/master/web/src/modules/base/locales/zh_CN%5B%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87%5D.yaml](https://github.com/mineadmin/mineadmin/blob/master/web/src/modules/base/locales/zh_CN%5B%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87%5D.yaml)
- ローカルパス: `mineadmin/web/src/modules/base/locales/zh_CN[簡体字中国語].yaml`

## プラグインシステム

MineAdminは強力なプラグインシステムも提供し、`src/plugins/`ディレクトリに配置されます。プラグインシステムにより、開発者は独立した機能モジュールを作成できます。

### プラグインディレクトリ構造

```
web/src/plugins/
└── mine-admin/              # 公式プラグインネームスペース
    ├── app-store/          # アプリストアプラグイン
    │   ├── api/           # プラグインAPI
    │   ├── views/         # プラグインビュー
    │   ├── utils/         # プラグインツール
    │   ├── style/         # プラグインスタイル
    │   └── index.ts       # プラグインエントリ
    ├── basic-ui/          # 基本UIコンポーネントライブラリ
    └── demo/              # デモプラグイン
```

### プラグイン設定例

```typescript
// web/src/plugins/mine-admin/app-store/index.ts
import type { Plugin } from '#/global'

const pluginConfig: Plugin.PluginConfig = {
  install() {
    console.log('MineAdminアプリストアが起動しました')
  },
  config: {
    enable: import.meta.env.DEV,
    info: {
      name: 'mine-admin/app-store',
      version: '1.0.0',
      author: 'X.Mo',
      description: 'アプリストア機能を提供',
    },
  },
  views: [
    {
      name: 'MineAppStoreRoute',
      path: '/appstore',
      meta: {
        title: 'アプリストア',
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

システムはProviderサービスで自動的にプラグインをスキャンし登録：

```typescript
// web/src/provider/plugins/index.ts
const pluginList = {}
async function getPluginList() {
  // 自動的にプラグインディレクトリをスキャン
  const plugins = import.meta.glob('../../plugins/*/*/index.ts')
  const sortedPlugins: any[] = []
  
  for (const path in plugins) {
    const { default: plugin }: any = await plugins[path]()
    sortedPlugins.push(plugin)
  }

  // 優先度でプラグインをソート
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

## モジュール開発規範

### 1. 新規モジュール作成

新機能を開発する際は、`base`モジュールに追加するのではなく、独立したモジュールを作成することを推奨：

```bash
web/src/modules/
└── your-module/
    ├── api/                 # API インターフェース定義
    │   └── index.ts
    ├── locales/            # 国際化ファイル
    │   ├── en[English].yaml
    │   ├── zh_CN[簡体字中国語].yaml
    │   └── zh_TW[繁体字中国語].yaml
    ├── views/              # ビューコンポーネント
    │   └── index.vue
    └── types/              # タイプ定義（オプション）
        └── index.ts
```

### 2. API インターフェース規範

各モジュールのAPIインターフェースは以下を満たすべき：
- 明確なTypeScriptインターフェースタイプを定義
- 統一された`useHttp()`メソッドを使用
- RESTful API設計原則に従う
- 完全なCRUD操作を含む

### 3. 国際化規範

- YAML形式を使用
- 階層構造で翻訳キーを整理
- サポートする各言語に対応するファイルを作成
- 翻訳キー名はキャメルケースを使用

### 4. ビューコンポーネント規範

- Vue 3 Composition APIを使用
- レスポンシブデザインをサポート
- Element Plusデザイン規範に従う
- コンポーネントは良好な保守性を持つべき

## TypeScript タイプサポート

システムは完全なTypeScriptタイプ定義を提供し、プラグイン設定、ルートメタ情報などを含む：

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
      // ... その他のフック
    }
  }
}
```

**ソースコードの場所：**
- GitHub: [https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts](https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts)
- ローカルパス: `mineadmin/web/types/global.d.ts`

## ベストプラクティス

::: tip 開発アドバイス
1. **モジュールの単一責任**：各モジュールは特定の業務領域に集中
2. **APIインターフェースの統一**：標準化されたインターフェース設計パターンを使用
3. **国際化の完全性**：すべてのテキストコンテンツに多言語サポートを提供
4. **タイプセーフティ**：TypeScriptタイプシステムを十分に活用
5. **プラグイン優先**：オプション機能についてはプラグイン方式を優先的に検討
:::

::: warning 注意事項
- `base`モジュールに業務固有の機能を追加しない
- 新しいモジュールは独立性を保ち、他のモジュールとの結合を減らす
- プラグインの有効化/無効化はシステムコア機能に影響を与えない
- すべてのモジュールは国際化をサポートすべき
:::