# MaProTable
`ma-pro-table` は `ma-search` と `ma-table` の2つのコンポーネントをラップして作られており、完全な `CRUD` 機能を素早く構築し、時間を節約するためのものです。

:::tip ヒント
システムに組み込まれている **ユーザー、ロール管理** は `ma-pro-table` CRUDのベストプラクティスです。ドキュメントと実際のケースを参考にすることで、このコンポーネントを素早く習得できます。

注意：本コンポーネントは `2.0 ma-crud` のように `追加` や `編集` 機能を直接内蔵していません。これらは自分で実装する必要があります。
:::

## クイックスタート

<DemoPreview dir="demos/ma-pro-table" />

## サンプル集

以下のサンプルで、MaProTable の様々なユースケースと機能をすぐに理解できます：

### 基本機能
- **[基本の使い方](/v3/front/component/ma-pro-table/examples/basic)** - 最もシンプルなテーブル使用方法
- **[高度な検索](/v3/front/component/ma-pro-table/examples/advanced-search)** - 複数の検索コンポーネントと複雑な検索ロジック
- **[カスタム操作](/v3/front/component/ma-pro-table/examples/custom-operations)** - 柔軟な操作列構成と一括操作

### 拡張機能
- **[セルレンダリングプラグイン](/v3/front/component/ma-pro-table/examples/cell-render-plugins)** - 豊富なセルレンダリングエフェクト
- **[ツールバー拡張](/v3/front/component/ma-pro-table/examples/toolbar-extensions)** - カスタムツールバー機能
- **[データ管理](/v3/front/component/ma-pro-table/examples/data-management)** - 完全なCRUD操作フロー

### 高度な機能
- **[レスポンシブレイアウト](/v3/front/component/ma-pro-table/examples/responsive-layout)** - マルチデバイス対応とレスポンシブデザイン

## コア機能

### 🚀 高速開発
- ma-search と ma-table の組み合わせで、すぐに使用可能
- よく使われる CRUD 操作パターンを内蔵
- 複数のデータソースと API 形式をサポート

### 🎨 豊富なレンダリング
- 内蔵セルレンダリングプラグインシステム
- カスタムレンダリングコンポーネントのサポート
- 柔軟な操作列構成

### 🔧 強力な拡張
- ツールバープラグインシステム
- 完全な TypeScript 型サポート
- 豊富なイベントとコールバック

### 📱 レスポンシブデザイン
- 異なるデバイスサイズに自動適応
- モバイル端末に優しいインタラクション体験
- 柔軟なレイアウト構成

## cellRenderTo セルレンダリングプラグイン
::: tip なぜ cellRenderTo プラグインが必要なのか？
まず、セルのレンダリングで異なる内容を表示することは非常に頻繁なシーンであり、多くのコードはパラメータやフィールド名が異なるだけで同じものになりがちです。そのため、`ma-pro-table` を構築する際にこの問題をどう解決するかを検討していました。

`ma-pro-table` は `url`、`image`、`video`、`switch` レンダリングなど、様々な内容に対するレンダリングを内蔵できます。しかし、要件は多様であり、内蔵機能だけではビジネス要件の増加に永遠に対応できません。同時にコードの重複を避けるため、このプラグインメカニズムが生まれました。

皆さんがよく使うものや、特定の業務用にカプセル化したセルレンダリングプラグインを公開し、アプリケーションマーケットで共有することで、誰もが同じものを再度書く必要がなくなります。
:::

### セルプラグインの使用

```vue 
<script setup lang="ts">
import { ref } from 'vue'
import { MaProTableSchema } from "@mineadmin/pro-table";

const schema = ref<MaProTableSchema>({
  tableColumns: [
    {
      title: 'セルレンダリングサンプル',
      prop: 'title',
      // セルレンダリングプラグインを呼び出す // [!code focus:9]
      cellRenderTo: {
        // プラグイン名。このプラグインは文字列を el-tag 形式でレンダリングします。ma-pro-table はこの1つだけを内蔵しています。
        name: 'tag', 
        // プラグインに必要なパラメータを渡せます
        props: {
          // このプラグインは必須パラメータではないので、渡しません
        }
      }
    }
  ]
})
</script>

<template>
  <ma-pro-table :schema="schema"/>
</template>

```

### セルプラグインの登録
プラグインを登録するには `useProTableRenderPlugin()` メソッドをインポートし、このメソッドを使用してプラグインの登録・削除を行います。
```ts
import { useProTableRenderPlugin } from '@mineadmin/pro-table'
```
`useProTableRenderPlugin()` は以下のメソッドを返します：

- `addPlugin(plugin: MaProTableRenderPlugin): void`: プラグインの登録
- `removePlugin(pluginName: string): void`: プラグインの削除
- `getPlugins(): MaProTableRenderPlugin[]`: **ma-pro-table** に登録された全プラグインの取得
- `getPluginByName(pluginName: string): MaProTableRenderPlugin`: プラグイン名で特定のプラグイン情報を取得


::: details クリックして `MaProTableRenderPlugin` の型説明を表示
| パラメータ       | 説明                  | 型         |
|----------|---------------------|-------------------|
| `name` | セルレンダリングプラグイン名、ユニーク識別子 | `string`|
| `render`  | レンダリング関数。`コンポーネント, jsx, tsx` などをサポート | `Function` |

`render` 関数のパラメータ説明：
- `data` 型: `TableColumnRenderer` `el-table` の `scope` ネイティブパラメータと `ma-table` 拡張パラメータを含む
- `props`、プラグイン呼び出し時に `props` パラメータで渡される外部パラメータ
- `proxy` 型: `MaProTableExpose` この章の最後にある `Expose` ノードの説明を参照してください。
:::

ドキュメントではプラグインの登録方法のみ説明します。`addPlugin` 関数を使用して登録します。

内蔵の `tag` プラグインのプロトタイプは以下の通りです：
```ts
import { h } from 'vue'
import { useProTableRenderPlugin } from '@mineadmin/pro-table'
import { ElTag } from 'element-plus'

const { addPlugin } = useProTableRenderPlugin()

// プラグインの登録
addPlugin({
  // プラグイン名、ユニーク識別子。アプリケーションマーケットにアップロードする場合は、専用のプレフィックスを付けてください
  name: 'tag',
  // プラグインレンダリング関数。他のVueコンポーネントを指定したり、直接 tsx や jsx を記述可能
  render: (data: TableColumnRenderer, props: any, proxy: MaProTableExpose) => {
    return h(
      ElTag,  // el-tag を使用してレンダリング
      props,  // プラグイン呼び出し時に渡された props パラメータを透過的に渡す
      {
        default: () => data.row[props?.prop] // el-tag のデフォルトスロットを使用
      }
    )
  }
})

```

## ToolbarPlugin ツールバープラグイン
![テーブルツールバー](https://s21.ax1x.com/2024/11/03/pArlfRU.png)

::: tip 説明
`ma-pro-table` にはここを拡張できる[スロット](#slot)もあります。一度きりの機能にはスロットを、システム全体で必要な場合は `API` で拡張することをお勧めします。
:::

`useProTableToolbar()` は以下のメソッドを返します：
- `get: (name: string) => MaProTableToolbar` 特定のツール情報の取得
- `getAll: () => MaProTableToolbar[]` 全ツール情報の取得
- `add: (toolbar: MaProTableToolbar) => void` 新しいツールの追加
- `remove: (name: string) => void` ツールの削除
- `hide: (name: string) => void` ツールを非表示に設定
- `show: (name: string) => void` ツールを通常表示に設定

::: details クリックして `MaProTableToolbar` の型説明を表示
| パラメータ       | 説明                  | 型         |
|----------|---------------------|-------------------|
| `name` | ツール名、ユニーク識別子 | `string`|
| `render`  | レンダリング関数。`コンポーネント, jsx, tsx` などをサポート | `Function` |
| `show`  | デフォルトで表示するか | `boolean` |
| `order`  | ツールのレンダリング順序。数字が小さいほど前に表示 | `number` |
  :::

### ツールバーの拡張

::: code-group 
```ts [index.vue]
import { useProTableToolbar } from '@mineadmin/pro-table'
import CustomerTool from './CustomerTool.vue'

const { add } = useProTableToolbar()

add({
  // ツール名
  name: 'heihei',
  // レンダリングコンポーネントを指定。コンポーネントには proxy パラメータが渡され、内部で props を定義して受け取る必要があります
  render: CustomerTool,
  show: true,
  order: 99,
})
```

```vue [CustomerTool.vue]

<script setup lang="ts">
  // props を定義して `ma-pro-table` から渡される proxy パラメータを受け取る
  import { MaProTableExpose } from "@mineadmin/pro-table"
  import { ElMessage } from 'element-plus'

  const { proxy } = defineProps<{ proxy: MaProTableExpose }>()
  
  const execute = async () => {
    // テーブルをリフレッシュ
    await proxy?.refresh?.()
    ElMessage.success('テーブルが正常にリフレッシュされました')
  }
</script>

<template>
  <!-- circle 属性を追加して円形ボタンにし、システムと統一感を出す -->
  <el-button circle @click="execute">😀</el-button>
</template>
```
:::

## TypeScript 型定義

### コア型

```typescript
// コンポーネント主要インターフェース
interface MaProTableProps {
  options: MaProTableOptions    // コンポーネント設定
  schema: MaProTableSchema      // テーブル構成
}

// コンポーネントが公開するメソッドとプロパティ
interface MaProTableExpose {
  // 子コンポーネントへのアクセス
  getSearchRef(): MaSearchExpose
  getTableRef(): MaTableExpose
  getElTableStates(): Record<string, any>
  
  // データ操作
  refresh(): Promise<void>
  requestData(): Promise<void>
  changeApi(api: () => any, isRequestNow: boolean): void
  setRequestParams(params: Record<string, any>, isRequestNow: boolean): void
  
  // 列管理
  setTableColumns(cols: MaProTableColumns[]): void
  getTableColumns(): MaProTableColumns[]
  
  // 検索管理
  setSearchForm(form: Record<string, any>): void
  getSearchForm(): Record<string, any>
  search(form: Record<string, any>): void
  
  // 設定管理
  setProTableOptions(opts: MaProTableOptions): void
  getProTableOptions(): MaProTableOptions
  
  // ユーティリティメソッド
  resizeHeight(): Promise<void>
  getCurrentId(): string
}
```

### プラグインシステム型

```typescript
// セルレンダリングプラグイン
interface MaProTableRenderPlugin {
  name: string
  render: (data: TableColumnRenderer, props: any, proxy: MaProTableExpose) => VNode | string
}

// ツールバープラグイン
interface MaProTableToolbar {
  name: string
  render: (props: { proxy: MaProTableExpose }) => VNode | Component
  show: boolean | (() => boolean)
  order: number
}
```

## Props
| パラメータ       | 説明                  | 型         | バージョン    |
|----------|---------------------|-------------------|--------|
| `options` | `ma-pro-table` パラメータ設定 | `MaProTableOptions`   | 1.0.0 |
| `schema`  | `ma-pro-table` 構成設定 | `MaProTableSchema` | 1.0.0 |

### MaProTableOptions
| パラメータ                     | 説明                                        | 型                                          | デフォルト値    | バージョン     |
|------------------------|-------------------------------------------|---------------------------------------------|--------|--------|
| `tableOptions`         | `ma-table` パラメータ                             | `MaTableOptions`                            | -      | 1.0.0  |
| `searchOptions`        | `ma-search` パラメータ                            | `MaSearchOptions`                           | -      | 1.0.0  |
| `searchFormOptions`    | `ma-form` パラメータ                              | `MaFormOptions`                             | -      | 1.0.0  |
| -                      | -                                         | -                                           | -      | -      |
| `id`                   | 現在のID、グローバルにユニーク。指定しない場合はランダム生成                      | `string`                                    | -      | 1.0.0  |
| `adaptionOffsetBottom` | 下部からのオフセット量                                   | `number`                                    | 0      | 1.0.0  |
| `actionBtnPosition`    | アクションボタンの配置位置。自動モードでは、タイトルバーが有効ならタイトルバー、そうでなければテーブル左上 | `auto, header, table`                       | `auto` | 1.0.0  |
| `header`               | ヘッダー設定                                      | [パラメータ設定](#headerconfig) を参照                    | -      | 1.0.0  |
| `toolbar`              | ツールバーを表示するか                                   | `boolean, (() => boolean)`                  | `true` | 1.0.0  |
| `toolStates`           | ツールの表示・非表示を個別設定                                | { `[key:string]` : `boolean, (() => boolean)` | -      | 1.0.69 |
| `rowContextMenu`       | 右クリック設定                                      | [パラメータ設定](#rowcontextmenu) を参照                  | -      | 1.0.0  |
| `requestOptions`       | リストネットワークリクエスト設定                                  | [パラメータ設定](#requestoptions) を参照                  | -      | 1.0.0  |
| `onSearchSubmit`       | 検索送信イベント                                    | `(form: Record<string, any>) => void`       | -      | 1.0.0  |
| `onSearchReset`        | 検索リセットイベント                                    | `(form: Record<string, any>) => void`       | -      | 1.0.0  |


#### HeaderConfig
| パラメータ   | 説明           | 型                         | デフォルト値     | バージョン    |
|------|--------------|----------------------------|---------|-------|
| `show` | ヘッダーを表示するか  | `boolean, (() => boolean)` | `true`  | 1.0.0 |
| `mainTitle` | メインタイトル  | `string, (() => string)`   | `テーブルメインタイトル` | 1.0.0 |
| `subTitle` | サブタイトル  | `string, (() => string)`                   | -       | 1.0.0 |

#### rowContextMenu
| パラメータ                | 説明        | 型                                                                                 | デフォルト値     | バージョン    |
|-------------------|-----------|------------------------------------------------------------------------------------|---------|-------|
| `enabled`         | 行右クリックメニューを有効にするか | `boolean`                                                                          | `false` | 1.0.0 |
| `items`           | 右クリックメニューリスト    | `ContextMenuItem[]`                                                                | -       | 1.0.0 |
| -                 | -         | -                                                                                  | -      | -     |
| `ContextMenuItem` | 説明        | メニューリスト設定の説明                                                                           | -      | -     |
| `label`           | メニュー表示テキスト    | `string, (() => string)`                                                           | -       | 1.0.0 |
| `icon`            | メニュー表示アイコン    | `string, (() => string)`                                                           | -       | 1.0.0 |
| `disabled`        | 無効にするか      | `boolean`                                                                          | -       | 1.0.0 |
| `divided`         | 区切り線を表示するか   | `boolean`                                                                          | -       | 1.0.0 |
| `onMenuClick`     | メニュー項目クリックイベント   | `(data: { row: any, column: any, proxy: MaProTableExpose }, event: Event) => void` | -       | 1.0.0 |

#### requestOptions
| パラメータ                    | 説明                    | 型                                                        | デフォルト値                                                    | バージョン    |
|-----------------------|-----------------------|-----------------------------------------------------------|--------------------------------------------------------|-------|
| `api`                 | リクエスト API メソッド             | `(...args: any[]) => any`                                 | -                                                      | 1.0.0 |
| `autoRequest`         | 自動リクエストするか                | `boolean`                                                 | `true`                                                 | 1.0.0 |
| `response`            | レスポンス返却構造設定              | `{ totalKey?: string, dataKey?: string }`                 | `{ totalKey: 'total', dataKey: 'list'}`                | 1.0.0 |
| `requestPage`         | リクエストページネーション設定                | `{ pageName?: string, sizeName?: string, size?: number }` | `{ pageName: 'page', sizeName: 'pageSize', size: 10 }` | 1.0.0 |
| `requestParams`       | デフォルトリクエストパラメータ                | `Object`                                                  | -                                                      | 1.0.0 |
| `responseDataHandler` | レスポンス後のデータ処理。注意：`テーブルデータを返す必要があります` | `(response: Record<string, any>) => any[]`                | -                                                      | 1.0.0 |
| `on`                  | イベントリスト | `Record<string, (...args: any[]) => any>`                 | -                                                      | 1.0.0 |


### MaProTableSchema
| パラメータ   | 説明       | 型                                                | デフォルト値 | バージョン    |
|------|----------|---------------------------------------------------|-----|-------|
|`searchItems`| 検索項目リスト設定  | `MaSearchItem[]` [設定項目](ma-search#searchitems) | -   | 1.0.0 |
|`tableColumns`| テーブル列リスト設定 | `MaProTableColumns[]`                             | -   | 1.0.0 |

#### MaProTableColumns
::: tip
`el-table-columns` と `ma-table` の [拡張columns設定](ma-table#columnextraprops) を継承しています。以下は拡張パラメータです。
:::
| パラメータ   | 説明                         | 型                                                 | デフォルト値 | バージョン    |
|------|----------------------------|----------------------------------------------------|-----|-------|
|`type`| `el-table` ネイティブに加え、`operation`（操作列）、`sort`（行ドラッグ並び替え）を追加 | `string` | -   | 1.0.0 |
|`cellRenderTo`| セルをテーブルに登録されたプラグインでレンダリング                     | [以下の型を参照](#cellrenderto-レンダリングプラグインの使用)    | -   | 1.0.0 |
|`isRender`| 列をレンダリングするか。`hide` と異なり、テーブル設定でこの列が表示されない                     | `boolean & () => boolean`    | -   | 1.0.55 |
|`cellRenderPro`| `cellRender` の強化版。第2パラメータ `proxy: MaProTableExpose` を追加                    | `(data, proxy) => VNode & string`    | -   | 1.0.55 |
|`headerRenderPro`| `headerRender` の強化版。第2パラメータ `proxy: MaProTableExpose` を追加                     | `(data, proxy) => VNode & string`    | -   | 1.0.55 |
|`operationConfigure`| 操作列設定。`type` が `operation` の場合のみ有効  | [以下の型を参照](#operationconfigure-操作列)    | -   | 1.0.0 |

##### cellRenderTo レンダリングプラグインの使用
::: info 
`ma-pro-table` のセルレンダリングプラグインは、事前にプラグインが登録されている必要があります。
:::
| パラメータ      | 説明        | 型           | デフォルト値 | バージョン    |
|---------|-----------|--------------|-----|-------|
| `name`  | セルレンダリングプラグイン名  | `string`     | -   | 1.0.0 |
| `props` | プラグインに必要な追加パラメータ | `any, any[]` | -   | 1.0.0 |

##### operationConfigure 操作列
::: info 
`操作列` は `API` を介してのみ操作項目を設定できます。面倒な場合は、`columns` に通常の列を追加し、スロットを使用して自分で実装することもできます。
:::
| パラメータ      | 説明        | 型           | デフォルト値 | バージョン    |
|---------|-----------|--------------|-----|-------|
| `type`  | 表示方式。自動モード：`auto`、ドロップダウンメニュー：`dropdown`、タイル表示：`tile`  | `string`     | `auto`   | `auto` は `1.0.75` が必要 |
| `fold`  | 自動モードで、いくつタイル表示したら折りたたむか。デフォルト：`1` 個  | `number`     | `1`   | 1.0.75 |
| `actions` | 操作列設定リスト | `OperationAction[]` | -   | 1.0.0 |

###### OperationAction 操作列リスト設定
| パラメータ         | 説明                        | 型                                                             | デフォルト値 | バージョン    |
|------------|---------------------------|----------------------------------------------------------------|-----|-------|
| `name`     | 操作識別子                      | `string`                                                       | -  | 1.0.0 |
| `text`     | テキスト設定                      | `string, ((data: TableColumnRenderer) => string)`              | -  | 1.0.0 |
| `icon`     | アイコン設定。内部で `ma-svg-icon` を使用してレンダリング | `string, ((data: TableColumnRenderer) => string)`              | -  | 1.0.0 |
| `order`    | 並び順。小さいほど前に表示                  | `number`                                                       | -   | 1.0.0 |
| `disabled` | 無効にするか                      | `((data: TableColumnRenderer) => boolean)`                     | -   | 1.0.0 |
| `show`     | 表示するか                      | `((data: TableColumnRenderer) => boolean)`                     | -   | 1.0.0 |
| `onClick`  | クリックイベント                      | `(data: TableColumnRenderer, proxy: MaProTableExpose) => void` | -   | 1.0.0 |
| `linkProps`  | `el-link` の `props` パラメータ      | [LinkProps ドキュメント](https://element-plus.org/ja-JP/component/link.html#attributes)                                               | -   | 1.0.0 |

## Event

| 名前              | 説明      | パラメータ                                                         |
|-----------------|---------|------------------------------------------------------------|
| `row-drag-sort` | 行ドラッグ並び替えイベント | `(tableData: any[]) => void`                               |
| `search-submit` | 検索送信イベント  | `(form: Record<string, any>) => Record<string, any>, void` |
| `search-reset`  | 検索リセットイベント  | `(form: Record<string, any>) => Record<string, any>, void`                              |

## Slot スロットシステム

MaProTable は豊富なスロットシステムを提供し、各エリアのコンテンツを柔軟にカスタマイズできます。

### コアスロット

| 名前                | 説明                                      | パラメータ    | 使用シーン |
|-------------------|-------------------------------------------|---------|----------|
| `default`         | デフォルトスロットと `el-table` ネイティブスロット               | -       | テーブルコンテンツ拡張 |
| `empty`           | データがない場合に表示するコンテンツ                           | -       | カスタム空状態 |
| `append`          | テーブル最終行のコンテンツ                            | -       | 合計行など |

### レイアウトスロット

| 名前                | 説明                                      | パラメータ    | 使用シーン |
|-------------------|-------------------------------------------|---------|----------|
| `middle`          | 検索バーとテーブルの間の領域                         | -       | 統計情報の追加 |
| `tableHeader`     | テーブルヘッダー全体領域                            | -       | ヘッダーを完全にカスタマイズ |
| `headerTitle`     | テーブルヘッダータイトル領域                            | -       | タイトルのカスタマイズ |
| `headerRight`     | テーブルヘッダー右側領域                            | -       | クイック操作の追加 |
| `tableTop`        | テーブルコンテナ上部、ツールバーの上                     | -       | 一括操作ボタン |
| `tableCranny`     | テーブルとツールバーの間の隙間                         | -       | 状態表示 |
| `pageLeft`        | ページネーション左側領域                               | -       | 統計情報 |

### ツールバースロット

| 名前                | 説明                                      | パラメータ    | 使用シーン |
|-------------------|-------------------------------------------|---------|----------|
| `toolbarLeft`     | ツールバー左側領域                              | -       | 統計データ表示 |
| `toolbar`         | ツールバーリスト（非推奨。API拡張を推奨）           | -       | カスタムツール |
| `beforeToolbar`   | ツールバー前置コンテンツ                              | -       | 前置ボタン |
| `afterToolbar`    | ツールバー後置コンテンツ                              | -       | 後置ボタン |

### 検索スロット

| 名前                   | 説明                                      | パラメータ    | 使用シーン |
|----------------------|-------------------------------------------|---------|----------|
| `search`             | 検索コンポーネント全体の置き換え                            | -       | 検索を完全にカスタマイズ |
| `searchActions`      | 検索操作ボタン領域                            | -       | 検索ボタンのカスタマイズ |
| `searchBeforeActions`| 検索ボタン前置コンテンツ                            | -       | 前置操作の追加 |
| `searchAfterActions` | 検索ボタン後置コンテンツ                            | -       | 後置操作の追加 |

### 動的スロット

| 名前                | 説明                                      | パラメータ    | 使用シーン |
|-------------------|-------------------------------------------|---------|----------|
| `column-[prop]`   | テーブル列コンテンツスロット                              | scope   | 列レンダリングのカスタマイズ |
| `header-[prop]`   | テーブルヘッダースロット                               | scope   | テーブルヘッダーのカスタマイズ |

### スロット使用例

```vue
<template>
  <MaProTable :options="options" :schema="schema">
    <!-- ツールバー左側統計 -->
    <template #toolbarLeft>
      <div class="stats">
        <el-text>合計: {{ total }} 件</el-text>
      </div>
    </template>
    
    <!-- テーブル上部一括操作 -->
    <template #tableTop>
      <div class="batch-actions">
        <el-button @click="batchDelete">一括削除</el-button>
      </div>
    </template>
    
    <!-- カスタム列コンテンツ -->
    <template #column-status="{ row }">
      <el-switch v-model="row.status" />
    </template>
  </MaProTable>
</template>
```

## Expose 公開メソッド

MaProTable コンポーネントは豊富なメソッドとプロパティを公開し、テーブルの動作を完全に制御できます。

### 子コンポーネントへのアクセス

| メソッド名                 | 説明                                  | 戻り値                |
|-----------------------|---------------------------------------|----------------------|
| `getSearchRef()`      | 検索コンポーネントインスタンスの取得                       | `MaSearchExpose`     |
| `getTableRef()`       | テーブルコンポーネントインスタンスの取得                       | `MaTableExpose`      |
| `getElTableStates()`  | Element Plus テーブル状態の取得            | `any`                |

### データ操作

| メソッド名                | 説明                                  | パラメータ                                                            | 戻り値              |
|----------------------|---------------------------------------|----------------------------------------------------------------|--------------------|
| `refresh()`          | テーブルデータのリフレッシュ                           | -                                                              | `Promise<void>`    |
| `requestData()`      | テーブルデータの再リクエスト                       | -                                                              | `Promise<void>`    |
| `changeApi()`        | データインターフェースの動的変更                       | `(api: () => any, isRequestNow: boolean) => void`             | `void`             |
| `setRequestParams()` | リクエストパラメータの設定                           | `(params: Record<string, any>, isRequestNow: boolean) => void` | `void`             |

### 列管理

| メソッド名                | 説明                                  | パラメータ                                         | 戻り値                    |
|----------------------|---------------------------------------|---------------------------------------------|-------------------------|
| `setTableColumns()`  | テーブル列の動的設定                         | `(cols: MaProTableColumns[]) => void`      | `void`                  |
| `getTableColumns()`  | 現在のテーブル列設定の取得                     | -                                           | `MaProTableColumns[]`   |

### 検索管理

| メソッド名               | 説明                                  | パラメータ                                         | 戻り値                    |
|---------------------|---------------------------------------|---------------------------------------------|-------------------------|
| `setSearchForm()`   | 検索フォームデータの設定                       | `(form: Record<string, any>) => void`      | `void`                  |
| `getSearchForm()`   | 検索フォームデータの取得                       | -                                           | `Record<string, any>`   |
| `search()`          | 検索操作の実行                           | `(form: Record<string, any>) => void`      | `void`                  |

### 設定管理

| メソッド名                  | 説明                                  | パラメータ                                         | 戻り値                |
|------------------------|---------------------------------------|---------------------------------------------|----------------------|
| `setProTableOptions()` | コンポーネント設定の動的変更                       | `(opts: MaProTableOptions) => void`        | `void`               |
| `getProTableOptions()` | 現在のコンポーネント設定の取得                       | -                                           | `MaProTableOptions`  |

### ユーティリティメソッド

| メソッド名              | 説明                                  | パラメータ | 戻り値              |
|--------------------|---------------------------------------|------|--------------------|
| `resizeHeight()`   | テーブル高さの再計算                       | -    | `Promise<void>`    |
| `getCurrentId()`   | コンポーネントユニークIDの取得                       | -    | `string`           |

### 使用例

```vue
<template>
  <div>
    <el-button @click="handleRefresh">データリフレッシュ</el-button>
    <el-button @click="handleSearch">検索</el-button>
    <el-button @click="handleChangeApi">インターフェース切替</el-button>
    
    <Ma