# プラグインシステム

::: tip プラグインシステム説明
`3.0` フロントエンドはコアレベルでプラグインシステムをサポートしており、`2.0` の設計当初ではプラグイン機能を考慮していなかったため、
システムのインターフェースや動作、機能を変更する際にはソースコードを修正する必要があり、その結果、後続のアップグレードができなくなり、公式コードとの差異が大きくなっていました。
その後、アプリストア機能が追加されましたが、プラグインを強制的にサポートする場合でも、プラグインはソースコードを修正する必要があり、初期化が必要な場所ではプラグインが拡張実装できず、`main.js`を修正するしかありませんでした。

**現在、これらの問題はすべて解決されています。フロントエンドプラグインシステムは強力なサポートを提供し、インターフェースの置換、機能の追加、サードパーティコンポーネントまたは独自開発コンポーネントの導入をシステムにシームレスに統合できます。さらに、複数の `hooks（フック）` を提供しており、フロントエンドの実行に影響を与えたり変更を加えたりすることも可能です。**
:::

## プラグインデータタイプ紹介

::: info タイプ定義ファイル
タイプ定義は `types/global.d.ts` 内にあります
:::

:::details クリックしてタイプ定義を表示
```ts
declare namespace Plugin {

  /**
   * プラグイン基本情報
   */
  interface Info {
    name: string
    version: string
    author: string
    description: string
    order?: number
  }

  interface Config {
    /**
     * プラグイン情報
     */
    info: Info
    /**
     * プラグインが有効かどうか
     */
    enable: boolean
  }

  interface Views extends Route.RouteRecordRaw {}

  interface PluginConfig {
    install: (app: App) => void
    config: Config
    views?: Views[]
    /**
     * プラグインフック
     * プラグインが無効の場合、定義されたフックはトリガーされません
     */
    hooks?: {
      // プラグイン起動時にトリガーされ、例えば enable = false を設定してプラグイン起動を阻止できます
      start?: (config: Config) => any | void
      // プラグインがシステム初期化完了後にトリガーされ、Vueのコンテキストやinjectサービスなどを呼び出せます
      setup?: () => any | void
      // ルート登録時にトリガーされ、ルートに対してすべての操作が可能です
      registerRoute?: (router: Router, routesRaw: Route.RouteRecordRaw[] | Plugin.Views[] | MineRoute.routeRecord[]) => any | void
      // ログイン時にトリガーされます
      login?: (formInfo: any) => any | void
      // ログアウト時にトリガーされます
      logout?: () => any | void
      // ユーザー情報取得時にトリガーされます
      getUserInfo?: (userInfo: any) => any | void
      // ルート遷移時のフック、外部リンク形式のルートでは有効になりません
      routerRedirect?: (route: RouteRecordRaw, router: Router) => any | void
      // ネットワークリクエスト時のフック
      networkRequest?: (request: T) => any | void
      // ネットワーク応答後のフック
      networkResponse?: (response: T) => any | void
    }
    [key: string]: T
  }
}
```
:::

## プラグイン作成

### ディレクトリ説明
すべてのプラグインは `src/plugins` ディレクトリに配置され、プラグインにはこのディレクトリを指すエイリアス `$` があります。プラグインはバックエンドと同じ構造で、
`開発者名前空間/プラグイン名` でプラグインディレクトリを構成します。スラッシュの左側は**作者名前空間**で、[MineAdmin公式サイト設定](https://www.mineadmin.com)で設定でき、
スラッシュの右側は**プラグイン名**で、この作者名前空間内で一意です。

プラグインディレクトリ例：
- `mine-admin/app-store`  組み込みのアプリストアプラグイン
- `zhang-san/oss-uploader` サンプルプラグイン

::: tip ヒント
ローカルで直接プラグインディレクトリにプラグインを作成しても認識され使用可能です。**ただし、MineAdminアプリケーションマーケットにアップロードできません！**
:::

### ファイル説明
```bash
# サンプルプラグイン、ディレクトリパス：src/plugins
- zhang-san/     # 作者名前空間
-   demo/       # プラグインディレクトリ
-     config.ts # これはプラグインが公開可能な設定ファイルで、開発者が修正できるようにするもので、プラグインソースコードを修正するものではありません。
-     index.ts  # これは各プラグインに必須のファイルで、プラグイン基本情報、有効化、フック定義内容が含まれます。

```

### `index.ts` 設定
このファイルはシステムに制御されるプラグインを公開するファイルで、プラグイン基本情報、有効化、プラグイン初期化、サードパーティコンポーネント導入などの機能が定義されています。

以下は定義例です：
```ts
// 関連する必要なデータタイプをインポート
import type { Router, RouteRecordRaw } from 'vue-router'
import type { MineToolbarExpose, Plugin } from '#/global'

// プラグイン定義
const pluginConfig: Plugin.PluginConfig = {
  // プラグインインストールメソッド、必須実装
  install(app) {
    // app は現在の vue インスタンス
    // app を通じて vue の `use`、`component` などの関数を呼び出し、コンポーネントを登録できます。
    // このメソッドはプラグイン状態が有効の場合にのみ一度実行され、無効化後再度有効にしてもこのメソッドは実行されません。
  },
  // プラグイン基本情報、必須設定
  config: {
    // 有効かどうか、import.meta.env 環境変数に基づいて有効化を決定することも可能です。例えば、ビルド後は使用不可など。
    enable: true, 
    // 基本情報
    info: {
      // プラグイン名、ディレクトリ階層と一致
      name: 'zhang-san/demo',
      // プラグインバージョン
      version: '1.0.0',
      // プラグイン作者
      author: '張三',
      // プラグイン説明
      description: '張三のデモプラグイン',
      // プラグイン起動順序、大きいほど先に起動実行されます（フックも含む）
      order: 1
    },
  },
  // プラグインフック定義、必須実装ではありません
  hooks: {
    // プラグイン起動時に呼び出され、プラグインの config オブジェクトが渡されます
    start: (config) => {},
    // プラグインがシステムで `vue` の `setup` ライフサイクルに達した時に呼び出されます。
    setup: () => {},
    // ユーザーログイン時に呼び出され、（ユーザー名、tokenなどのパラメータ）が渡されます
    login: (formInfo) => {},
    // ユーザーログアウト時に呼び出されます
    logout: () => {},
    // ユーザー情報リクエスト後に呼び出され、ユーザー権限、ロールなどのデータが渡されます。
    getUserInfo: (userInfo) => {},
    // システムがルートを登録する際に呼び出され、`vue-router` インスタンスとルート生データが渡されます。
    registerRoute: (router: Router, routesRaw) => {},
    // ページ遷移時に呼び出され、元ルートと新ルートのデータ、および `vue-router` インスタンスが渡されます。注意：外部リンクは有効になりません
    routerRedirect: ({ oldRoute: RouteRecordRaw, newRoute: RouteRecordRaw }, router: Router) => {},
    // ネットワークリクエスト時に呼び出され、元のリクエストデータが渡され、データ暗号化などが可能です
    networkRequest: (request) => {},
    // サーバー応答データ後に呼び出され、元の応答データが渡されます。
    networkResponse: (response) => {},
  },
  // プラグインページ、ここでの静的ルートデータはシステムにより自動登録されます。（必須実装ではありません）
  views: [
    {
      name: 'zhangsan:demo:index',
      path: '/zhangsan/demo',
      component: () => import('./views/index.vue'),
      meta: {
        title: '張三のデモプラグイン',
        i18n: '国際化キー',
      }
    }
  ]
}
```

::: info 完了
以上の作業を完了すると、プラグイン作成が完了し、プラグインを使用開始できます。
:::

### プラグイン設定ファイル公開
プラグインにデフォルトで使用可能な設定があり、利用者がソース設定ファイルを変更してプラグインアップグレードに問題が生じるのを懸念する場合、プラグイン設定公開コマンドを使用できます。
```bash
# ./web/ のコマンドラインインターフェースで実行

pnpm plugin:publish zhang-san/demo
```

プラグイン設定ファイルは `src/provider/plugins/config` ディレクトリに公開され、
上記の例では、ファイル名は：`zhang-san.demo.config.ts` となります。

公開された設定ファイルの使用
```ts
// デフォルトパラメータ設定を取得
const config = useGlobal().$pluginsConfig['zhang-san/demo']
```

## 動的プラグイン有効化/無効化
`usePluginStore()` を使用して特定のプラグインの有効化と無効化を動的に制御できます

```ts
const { disabled, enabled } = usePluginStore()

// プラグイン有効化
enbaled('zhang-san/demo')

// プラグイン無効化
disabled('li-si/demo')
```

## デフォルト組み込みプラグイン
`src/plugins/mine-admin` 下には公式プラグインがあり、現在以下のものが組み込まれています：

- `basic-ui` システム基本UIライブラリ
- `app-store` アプリストア
- `demo` デモプラグイン