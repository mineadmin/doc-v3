# サービスプロバイダー

## 説明
::: tip はじめに
サービスプロバイダーはバックエンドでよく見られますが、`3.0`のフロントエンドにも簡易版が追加されました。その役割は以下のようなサービスを提供することです：
- `Vue`の`globalProperties`や`provide`にグローバルデータを登録する
- コンポーネントの登録と初期化を実装する
- プラグインのデフォルト設定ファイルを提供する
- その他、自分で発見できる機能

サービスプロバイダーはフロントエンドの初期化時に自動的にスキャンされ登録されるため、インポートを気にする必要はありません。`Vue`オブジェクトへのデータのバインドや登録方法にのみ注意を払えばよいです。
:::

::: danger 注意
サービスプロバイダーの初期化は`pinia`、`vue-router`、`vue-i18n`よりも前に行われるため、これらはサービスプロバイダー内で使用できません。注意が必要です。
:::

## デフォルトのサービスプロバイダー

::: info 保存場所

すべてのサービスプロバイダーは**`src/provider`**ディレクトリに保存されており、分類を原則として、異なるサービスプロバイダーを区別するためにディレクトリを作成するかどうかは自主的に判断します。

:::

### dictionary (辞書)
このサービスは**辞書データ**の保存機能を提供します。`3.0`のバックエンドには辞書機能が標準で含まれていませんが、後続のプラグインでサポートされます。ただし、フロントエンドでは現在および将来のサポートを解決するための完全なソリューションを提供する必要があります。

`src/provider/dictionary/data`の下には、個々の辞書データファイルが保存されています。1つのファイルが1つの集合に対応し、ファイル名が**辞書名**、ファイル内容が**辞書データ**です。

例えば、`system-status.ts`ファイルでは、`システム状態`という名前のデータ集合を定義しており、**有効と無効**の2つのデータが含まれています。定義後、どのようにインポートし、動作するかは気にする必要がなく、使用方法のみを気にすればよいです。使用方法については、後のコンポーネントチュートリアルの章を参照してください。

```ts
import type { Dictionary } from '#/global'

export default [
  { label: '有効', value: 1, i18n: 'dictionary.system.statusEnabled', color: 'primary' },
  { label: '無効', value: 2, i18n: 'dictionary.system.statusDisabled', color: 'danger' },
] as Dictionary[]
```

### echarts
これは`echarts`コンポーネントの初期化を提供し、使用する`echarts`コンポーネントのインポート（デフォルトでは全量がインポートされていないため、後で自分で追加・変更できます）、および`echarts`を`Vue`の`globalProperties`オブジェクトにバインドする機能：**$echarts**、さらにダークモードでのテーマの登録などを行います。

`vue`ページでは`useGlobal().$echarts`を使用してインスタンスを取得します。具体的な使用方法は[MaEcharts](/ja/front/component/ma-echarts)の章を参照してください。

### plugins
これは`MineAdminプラグインシステム`にデフォルトパラメータの登録を提供し、後続のプラグインがデフォルトパラメータを使用しやすくするとともに、後続の開発者がここでプラグインのパラメータを変更しやすくします（プラグインのソースコードを変更する必要はありません）。ここではプラグイン設定ファイルの公開方法については詳しく説明しません。[プラグインシステム](/ja/front/high/plugins)の章を参照してください。

### mine-core
これは`MineAdmin`の**ma-table、ma-search、ma-form、ma-pro-table**コアコンポーネントの初期化を行い、グローバルパラメータとグローバル設定をマウントします。ローカル設定と一緒に使用するために導入できます。

`vue`ページでは`useGlobal().$mineCore`を使用して設定を取得します。

### settings
ここにはフロントエンド全体の設定パラメータが提供されています。デフォルトの`index.ts`でパラメータを変更しないでください。`settings.config.ts`にパラメータをコピーして変更してください。

## サービスプロバイダーの作成

### サービスプロバイダーのタイプ
```ts
declare namespace ProviderService {
  interface Provider {
    name: string
    init?: () => any | void
    setProvider: (app: App) => any | void
    getProvider: () => T
  }
}
```
各サービスプロバイダーはディレクトリを作成する必要があり、ディレクトリの下には必ず`index.ts`ファイルが存在し、`ProviderService`の`Provider`インターフェースを実装してエクスポートする必要があります。

```ts
// src/provider/demo/index.ts
import type { ProviderService } from '#/global'

const provider: ProviderService.Provider = {
  // インスタンス名、必須設定で、かつ一意である必要があります。
  name: 'demoProvider',
  // initメソッドはあってもなくてもよいです。
  init: () => {},
  // 必須実装メソッド、サービスを設定します。
  setProvider(app: App): void {
    app.config.globalProperties.$demo = 'demo サービスプロバイダー'
  },
  // サービスを取得、必須実装メソッド。ただし、このサービス取得は基本的に使用されません。
  // 外部で直接useGlobal()を使用して取得できるためですが、規範のために定義しておいた方がよいです。
  getProvider() {
    return useGlobal().$demo
  },
}

// 設定をエクスポート
export default provider as ProviderService.Provider
```

## サービスプロバイダーの削除

削除する必要がある場合は、該当するプロバイダーのディレクトリを削除してください。