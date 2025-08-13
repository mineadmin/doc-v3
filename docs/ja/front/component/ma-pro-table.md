# MaProTable
`ma-pro-table` は `ma-search` と `ma-table` の2つのコンポーネントを基に構築されており、完全な `CRUD` 機能を素早く構築するために使用され、サボる時間を増やします。

:::tip ヒント
システムに組み込まれている **ユーザー、ロール管理** はすべて `ma-pro-table` CRUDのベストプラクティスであり、ドキュメントと実際の例を参照することで、このコンポーネントを素早く習得できます。

注意：このコンポーネントは `2.0 ma-crud` のように直接 `追加` や `編集` 機能をサポートしなくなりました。これらは自分で実装する必要があります。
:::

## クイックスタート

<DemoPreview dir="demos/ma-pro-table" />

## サンプル集

以下のサンプルを通じて、MaProTableの様々な使用シナリオと機能特性を素早く理解できます：

### 基本機能
- **[基本使用法](/ja/front/component/ma-pro-table/examples/basic)** - 最もシンプルなテーブルの使用方法
- **[高度な検索](/ja/front/component/ma-pro-table/examples/advanced-search)** - 複数の検索コンポーネントと複雑な検索ロジック
- **[カスタム操作](/ja/front/component/ma-pro-table/examples/custom-operations)** - 柔軟な操作列の設定とバッチ操作

### 拡張機能
- **[セルレンダリングプラグイン](/ja/front/component/ma-pro-table/examples/cell-render-plugins)** - 豊富なセルレンダリング効果
- **[ツールバー拡張](/ja/front/component/ma-pro-table/examples/toolbar-extensions)** - カスタムツールバー機能
- **[データ管理](/ja/front/component/ma-pro-table/examples/data-management)** - 完全なCRUD操作フロー

### 高度な特性
- **[レスポンシブレイアウト](/ja/front/component/ma-pro-table/examples/responsive-layout)** - マルチデバイス適応とレスポンシブデザイン

## コア特性

### 🚀 迅速な開発
- ma-searchとma-tableの組み合わせに基づき、すぐに使用可能
- 一般的なCRUD操作モードを内蔵
- 複数のデータソースとAPIフォーマットをサポート

### 🎨 豊富なレンダリング
- 内蔵セルレンダリングプラグインシステム
- カスタムレンダリングコンポーネントをサポート
- 柔軟な操作列設定

### 🔧 強力な拡張
- ツールバープラグインシステム
- 完全なTypeScript型サポート
- 豊富なイベントとコールバック

### 📱 レスポンシブデザイン
- 異なるデバイスサイズに自動適応
- モバイルフレンドリーなインタラクション体験
- 柔軟なレイアウト設定

## cellRenderTo セルレンダリングプラグイン
::: tip なぜcellRenderToプラグインが必要なのか？
まず、セルのレンダリング内容が異なることは非常に頻繁に発生するシナリオであり、多くのコードは同じで、パラメータやフィールド名が異なるだけの場合があります。そのため、`ma-pro-table`を構築する際にこの問題を解決する方法を検討しました。

`ma-pro-table`は`url`、`image`、`video`、`switch`レンダリングなど、異なる内容に対してレンダリングを内蔵できますが、問題はニーズが多様であり、
内蔵機能ではビジネスニーズの増加に永遠に対応できないことです。同時にコードの冗長性を避けるため、このプラグインメカニズムが導入されました。

皆さんがよく使用する、または特定のビジネスに特化したセルレンダリングプラグインを共有し、アプリケーションマーケットで共有することで、セルレンダリングを豊かにし、同じコードを書く必要がなくなります。
:::

### セルプラグインの使用

```vue 
<script setup lang="ts">
import { ref } from 'vue'
import { MaProTableSchema } from "@mineadmin/pro-table";

const schema = ref<MaProTableSchema>({
  tableColumns: [
    {
      title: 'セルレンダリング例',
      prop: 'title',
      // セルレンダリングプラグインを呼び出す // [!code focus:9]
      cellRenderTo: {
        // プラグイン名、このプラグインは文字列をel-tag形式でレンダリングし、ma-pro-tableはこれ一つだけを内蔵しています。
        name: 'tag', 
        // プラグインに必要なパラメータを渡すことができます
        props: {
          // このプラグインはパラメータを必須としないため、渡しません
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
プラグインを登録するには、`useProTableRenderPlugin()`メソッドをインポートし、このメソッドを使用してプラグインを登録、削除します。
```ts
import { useProTableRenderPlugin } from '@mineadmin/pro-table'
```
`useProTableRenderPlugin()`は以下のメソッドを返します：

- `addPlugin(plugin: MaProTableRenderPlugin): void`: プラグインを登録
- `removePlugin(pluginName: string): void`: プラグインを削除
- `getPlugins(): MaProTableRenderPlugin[]`: **ma-pro-table**に登録されているすべてのプラグインを取得
- `getPluginByName(pluginName: string): MaProTableRenderPlugin`: プラグイン名で特定のプラグイン情報を取得


::: details `MaProTableRenderPlugin` タイプ説明を表示
| パラメータ       | 説明                  | タイプ         |
|----------|---------------------|-------------------|
| `name` | セルレンダリングプラグイン名、一意の識別子 | `string`|
| `render`  | レンダリング関数、`コンポーネント、jsx、tsx`などをサポート | `Function` |

`render` 関数パラメータ説明：
- `data` タイプ: `TableColumnRenderer` `el-table`の`scope`ネイティブパラメータと`ma-table`拡張パラメータを含む
- `props`、プラグイン呼び出し時に`props`パラメータを通じて渡される外部パラメータ。
- `proxy` タイプ: `MaProTableExpose` このセクションの最後にある`Expose`ノードの説明を参照してください。
:::

ドキュメントではプラグインの登録方法のみを説明します。`addPlugin`関数を使用して登録します。

内蔵`tag`プラグインのプロトタイプは以下の通り：
```ts
import { h } from 'vue'
import { useProTableRenderPlugin } from '@mineadmin/pro-table'
import { ElTag } from 'element-plus'

const { addPlugin } = useProTableRenderPlugin()

// プラグインを登録
addPlugin({
  // プラグイン名、一意の識別子。アプリケーションマーケットにアップロードする場合は、専用のプレフィックスを付けてください
  name: 'tag',
  // プラグインレンダリング関数、他のvueコンポーネントを指定するか、直接tsxまたはjsxを記述できます
  render: (data: TableColumnRenderer, props: any, proxy: MaProTableExpose) => {
    return h(
      ElTag,  // el-tagを使用してレンダリング
      props,  // プラグイン呼び出し時に渡されるpropsパラメータを透過的に渡す
      {
        default: () => data.row[props?.prop] // el-tagのデフォルトスロットを使用
      }
    )
  }
})

```

## ToolbarPlugin ツールバープラグイン
![テーブルツールバー](https://s21.ax1x.com/2024/11/03/pArlfRU.png)

::: tip 説明
`ma-pro-table`には[スロット](#slot)もあり、ここを拡張できます。もし特定の一時的な機能が必要な場合はスロットを使用し、システム全体で必要な場合は`api`を使用して拡張することをお勧めします。
:::

`useProTableToolbar()`は以下のメソッドを返します：
- `get: (name: string) => MaProTableToolbar` 特定のツール情報を取得
- `getAll: () => MaProTableToolbar[]` すべてのツール情報を取得
- `add: (toolbar: MaProTableToolbar) => void` 新しいツールを追加
- `remove: (name: string) => void` ツールを削除
- `hide: (name: string) => void` ツールを非表示に設定
- `show: (name: string) => void` ツールを表示に設定

::: details `MaProTableToolbar` タイプ説明を表示
| パラメータ       | 説明                  | タイプ         |
|----------|---------------------|-------------------|
| `name` | ツール名、一意の識別子 | `string`|
| `render`  | レンダリング関数、`コンポーネント、jsx、tsx`などをサポート | `Function` |
| `show`  | デフォルトで表示するか | `boolean` |
| `order`  | ツールのレンダリング順序、数字が小さいほど前に表示 | `number` |
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
  // レンダリングコンポーネントを指定。コンポーネントにはproxyパラメータが渡され、コンポーネント内部でpropsを定義して受け取る必要があります
  render: CustomerTool,
  show: true,
  order: 99,
})
```

```vue [CustomerTool.vue]

<script setup lang="ts">
  // propsを定義して`ma-pro-table`から渡されるproxyパラメータを受け取る
  import { MaProTableExpose } from "@mineadmin/pro-table"
  import { ElMessage } from 'element-plus'

  const { proxy } = defineProps<{ proxy: MaProTableExpose }>()
  
  const execute = async () => {
    // テーブルをリフレッシュ
    await proxy?.refresh?.()
    ElMessage.success('テーブルがリフレッシュされました')
  }
</script>

<template>
  <!-- circle属性を追加して円形ボタンにし、システムと統一感を出す -->
  <el-button circle @click="execute">😀</el-button>
</template>
```
:::

## TypeScript タイプ定義

### コアタイプ

```typescript
// コンポーネント主要インターフェース
interface MaProTableProps {
  options: MaProTableOptions    // コンポーネント設定
  schema: MaProTableSchema      // テーブルスキーマ
}

// コンポーネント公開メソッドとプロパティ
interface MaProTableExpose {
  // 子コンポーネントアクセス
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

### プラグインシステムタイプ

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
| パラメータ       | 説明                  | タイプ         | バージョン    |
|----------|---------------------|-------------------|--------|
| `options` | `ma-pro-table` パラメータ設定 | `MaProTableOptions`   | 1.0.0 |
| `schema`  | `ma-pro-table` スキーマ設定 | `MaProTableSchema` | 1.0.0 |

### MaProTableOptions
| パラメータ                     | 説明                                        | タイプ                                          | デフォルト値    | バージョン     |
|------------------------|-------------------------------------------|---------------------------------------------|--------|--------|
| `tableOptions`         | `ma-table` パラメータ                             | `MaTableOptions`                            | -      | 1.0.0  |
| `searchOptions`        | `ma-search` パラメータ                            | `MaSearchOptions`                           | -      | 1.0.0  |
| `searchFormOptions`    | `ma-form` パラメータ                              | `MaFormOptions`                             | -      | 1.0.0  |
| -                      | -                                         | -                                           | -      | -      |
| `id`                   | 現在のID、グローバルに一意、指定しない場合はランダムに生成                      | `string`                                    | -      | 1.0.0  |
| `adaptionOffsetBottom` | 底部からのオフセット量                                   | `number`                                    | 0      | 1.0.0  |
| `actionBtnPosition`    | アクションボタンの配置位置、自動モードではタイトルバーが有効な場合はタイトルバーに表示、それ以外はテーブルの左上に表示 | `auto, header, table`                       | `auto` | 1.0.0  |
| `header`               | ヘッダー設定                                      | [パラメータ設定](#headerconfig)を参照                    | -      | 1.0.0  |
| `toolbar`              | ツールバーを表示するか                                   | `boolean, (() => boolean)`                  | `true` | 1.0.0  |
| `toolStates`           | 必要に応じてツールの表示を設定                                | { `[key:string]` : `boolean, (() => boolean)` | -      | 1.0.69 |
| `rowContextMenu`       | 右クリック設定                                      | [パラメータ設定](#rowcontextmenu)を参照                  | -      | 1.0.0  |
| `requestOptions`       | リストネットワークリクエスト設定                                  | [パラメータ設定](#requestoptions)を参照                  | -      | 1.0.0  |
| `onSearchSubmit`       | 検索送信イベント                                    | `(form: Record<string, any>) => void`       | -      | 1.0.0  |
| `onSearchReset`        | 検索リセットイベント                                    | `(form: Record<string, any>) => void`       | -      | 1.0.0  |


#### HeaderConfig
| パラメータ   | 説明           | タイプ                         | デフォルト値     | バージョン    |
|------|--------------|----------------------------|---------|-------|
| `show` | ヘッダーを表示するか  | `boolean, (() => boolean)` | `true`  | 1.0.0 |
| `mainTitle` | メインタイトル  | `string, (() => string)`   | `テーブルメインタイトル` | 1.0.0 |
| `subTitle` | サブタイトル  | `string, (() => string)`                   | -       | 1.0.0 |

#### rowContextMenu
| パラメータ                | 説明        | タイプ                                                                                 | デフォルト値     | バージョン    |
|-------------------|-----------|------------------------------------------------------------------------------------|---------|-------|
| `enabled`         | 行の右クリックメニューを有効にするか | `boolean`                                                                          | `false` | 1.0.0 |
| `items`           | 右クリックメニュー