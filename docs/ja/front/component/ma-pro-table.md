# MaProTable
`ma-pro-table` は `ma-search` と `ma-table` の2つのコンポーネントを基に構築されており、完全な `CRUD` 機能を素早く構築し、サボる時間を増やすために設計されています。

:::tip ヒント
システムに組み込まれている **ユーザー管理、ロール管理** はすべて `ma-pro-table` CRUDのベストプラクティスです。ドキュメントと実際の事例を参照することで、このコンポーネントを迅速に習得できます。

注意：このコンポーネントは `2.0 ma-crud` のように直接 `追加` や `編集` 機能をサポートしなくなりました。これらは自分で実装する必要があります。
:::

## クイックスタート

<DemoPreview dir="demos/ma-pro-table" />

## サンプル集

以下のサンプルを通じて、MaProTableの様々な使用シナリオと機能特性を迅速に理解できます：

### 基本機能
- **[基本使用法](/front/component/ma-pro-table/examples/basic)** - 最もシンプルなテーブルの使用方法
- **[高度な検索](/front/component/ma-pro-table/examples/advanced-search)** - 複数の検索コンポーネントと複雑な検索ロジック
- **[カスタム操作](/front/component/ma-pro-table/examples/custom-operations)** - 柔軟な操作列設定と一括操作

### 拡張機能
- **[セルレンダリングプラグイン](/front/component/ma-pro-table/examples/cell-render-plugins)** - 豊富なセルレンダリング効果
- **[ツールバー拡張](/front/component/ma-pro-table/examples/toolbar-extensions)** - カスタムツールバー機能
- **[データ管理](/front/component/ma-pro-table/examples/data-management)** - 完全なCRUD操作フロー

### 高度な特性
- **[レスポンシブレイアウト](/front/component/ma-pro-table/examples/responsive-layout)** - マルチデバイス適応とレスポンシブデザイン

## コア特性

### 🚀 迅速な開発
- ma-searchとma-tableの組み合わせに基づき、すぐに使用可能
- 一般的なCRUD操作モードを内蔵
- 複数のデータソースとAPIフォーマットをサポート

### 🎨 豊富なレンダリング
- 内蔵セルレンダリングプラグインシステム
- カスタムレンダリングコンポーネントをサポート
- 柔軟な操作列設定

### 🔧 強力な拡張性
- ツールバープラグインシステム
- 完全なTypeScript型サポート
- 豊富なイベントとコールバック

### 📱 レスポンシブデザイン
- 異なるデバイスサイズに自動適応
- モバイルフレンドリーなインタラクション体験
- 柔軟なレイアウト設定

## cellRenderTo セルレンダリングプラグイン
::: tip なぜcellRenderToプラグインが必要なのか？
まず、セルに異なる内容をレンダリングすることは非常に頻繁に使用されるシナリオです。多くのコードは同じで、パラメータやフィールド名が異なるだけの場合があります。そのため、`ma-pro-table`を構築する際にこの問題を解決する方法を検討しました。

`ma-pro-table`は`url`、`image`、`video`、`switch`レンダリングなど、異なる内容に対して内蔵レンダリングをサポートできますが、問題は要件が多様で、内蔵機能ではビジネス要件の増加に永遠に対応できないことです。同時にコードの冗長性を避けるため、このプラグイン機構が導入されました。

一般的に使用される、または特定のビジネスに特化したセルレンダリングプラグインを共有し、アプリケーション市場で共有することで、セルレンダリングを豊富にし、同じコードを再度書く必要がなくなります。
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
        // プラグイン名、このプラグインは文字列をel-tag形式でレンダリングし、ma-pro-tableはこれ唯一の内蔵プラグインです。
        name: 'tag', 
        // プラグインに必要なパラメータを渡すことができます
        props: {
          // このプラグインは必須パラメータがないため、渡しません
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
プラグインを登録するには、`useProTableRenderPlugin()`メソッドをインポートし、このメソッドを使用してプラグインを登録・削除します。
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
- `proxy` タイプ: `MaProTableExpose` このセクションの最後にある`Expose`ノードの説明を参照
:::

ドキュメントではプラグインの登録方法のみを説明します。プラグインを登録するには`addPlugin`関数を使用します。

内蔵`tag`プラグインのプロトタイプは以下の通り：
```ts
import { h } from 'vue'
import { useProTableRenderPlugin } from '@mineadmin/pro-table'
import { ElTag } from 'element-plus'

const { addPlugin } = useProTableRenderPlugin()

// プラグインを登録
addPlugin({
  // プラグイン名、一意の識別子。アプリケーション市場にアップロードする場合は、専用のプレフィックスを含めてください
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
`ma-pro-table`には[スロット](#slot)でここを拡張することもできます。一時的な機能にはスロットを使用し、システム全体で必要な場合は`api`で拡張することをお勧めします。
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
| `order`  | ツールレンダリング順序、数字が小さいほど前に表示 | `number` |
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
  // `ma-pro-table`から渡されるproxyパラメータを受け取るためにpropsを定義
  import { MaProTableExpose } from "@mineadmin/pro-table"
  import { ElMessage } from 'element-plus'

  const { proxy } = defineProps<{ proxy: MaProTableExpose }>()
  
  const execute = async () => {
    // テーブルを更新
    await proxy?.refresh?.()
    ElMessage.success('テーブルが更新されました')
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
| `id`                   | 現在のid、グローバルで一意、指定しない場合はランダムに生成                      | `string`                                    | -      | 1.0.0  |
| `adaptionOffsetBottom` | 底部からのオフセット量                                   | `number`                                    | 0      | 1.0.0  |
| `actionBtnPosition`    | アクションボタンの配置位置、自動モードではタイトルバーが有効な場合はタイトルバーに、それ以外はテーブル左上に表示 | `auto, header, table`                       | `auto` | 1.0.0  |
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
| `enabled`         | 行右クリックメニューを有効にするか | `boolean`                                                                          | `false` | 1.0.0 |
| `items`           | 右クリックメニューリスト    | `ContextMenuItem[]`                                                                | -       | 1.0.0 |
| -                 | -         | -                                                                                  | -      | -     |
| `ContextMenuItem` |