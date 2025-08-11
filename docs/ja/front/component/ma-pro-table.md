# MaProTable
`ma-pro-table` は `ma-search` と `ma-table` の2つのコンポーネントを基に構築されており、完全な `CRUD` 機能を素早く構築し、サボる時間を増やすために使用されます。

:::tip ヒント
システムに組み込まれている **ユーザー管理、ロール管理** はすべて `ma-pro-table` のCRUDのベストプラクティスです。ドキュメントと実際の例を参照することで、このコンポーネントを迅速に習得できます。

注意：このコンポーネントは `2.0 ma-crud` のように直接 `新規作成` や `編集` 機能をサポートしていません。これらは自分で実装する必要があります。
:::

## 使用
<DemoPreview dir="demos/ma-pro-table" />

## cellRenderTo セルレンダリングプラグイン
::: tip なぜ cellRenderTo プラグインが必要なのか？
まず、セルに異なる内容をレンダリングするのは非常に頻繁に使用されるシナリオであり、多くのコードは同じで、パラメータやフィールド名だけが異なる場合があります。そのため、`ma-pro-table` を構築する際にこの問題をどのように解決するか検討しました。

`ma-pro-table` は `url`、`image`、`video` など、さまざまな内容のレンダリングを組み込みでサポートできますが、問題は要件が多様であることです。
組み込みの機能では業務要件の増加に永遠に対応できませんが、同時にコードの冗長性を避けるため、このプラグイン機構が導入されました。

皆さんがよく使用する、または特定の業務に特化したセルレンダリングプラグインを共有し、アプリケーション市場で公開することで、セルレンダリングを豊富にし、同じものを再度記述する必要がなくなります。
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
        // プラグイン名。このプラグインは文字列を el-tag 形式でレンダリングします。ma-pro-table はこれ唯一の組み込みプラグインです。
        name: 'tag', 
        // プラグインに必要なパラメータを渡すことができます
        props: {
          // このプラグインはパラメータを必須としないため、何も渡しません
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
プラグインを登録するには `useProTableRenderPlugin()` メソッドをインポートし、このメソッドを使用してプラグインを登録または削除します。
```ts
import { useProTableRenderPlugin } from '@mineadmin/pro-table'
```
`useProTableRenderPlugin()` は以下のメソッドを返します：

- `addPlugin(plugin: MaProTableRenderPlugin): void`: プラグインを登録
- `removePlugin(pluginName: string): void`: プラグインを削除
- `getPlugins(): MaProTableRenderPlugin[]`: **ma-pro-table** に登録されているすべてのプラグインを取得
- `getPluginByName(pluginName: string): MaProTableRenderPlugin`: プラグイン名で特定のプラグイン情報を取得


::: details `MaProTableRenderPlugin` 型の説明を表示
| パラメータ       | 説明                  | タイプ         |
|----------|---------------------|-------------------|
| `name` | セルレンダリングプラグイン名、一意の識別子 | `string`|
| `render`  | レンダリング関数、`コンポーネント、jsx、tsx` などをサポート | `Function` |

`render` 関数のパラメータ説明：
- `data` タイプ: `TableColumnRenderer` `el-table` の `scope` ネイティブパラメータと `ma-table` 拡張パラメータを含む
- `props`、プラグイン呼び出し時に `props` パラメータで渡される外部パラメータ。
- `proxy` タイプ: `MaProTableExpose` このセクションの最後にある `Expose` ノードの説明を参照してください。
:::

ドキュメントではプラグインの登録方法のみを説明します。登録には `addPlugin` 関数を使用します。

組み込みの `tag` プラグインのプロトタイプは以下の通りです：
```ts
import { h } from 'vue'
import { useProTableRenderPlugin } from '@mineadmin/pro-table'
import { ElTag } from 'element-plus'

const { addPlugin } = useProTableRenderPlugin()

// プラグインを登録
addPlugin({
  // プラグイン名、一意の識別子。アプリケーション市場にアップロードする場合は専用のプレフィックスを付けてください
  name: 'tag',
  // プラグインレンダリング関数。他のVueコンポーネントを指定するか、直接 tsx または jsx を記述できます
  render: (data: TableColumnRenderer, props: any, proxy: MaProTableExpose) => {
    return h(
      ElTag,  // el-tag を使用してレンダリング
      props,  // プラグイン呼び出し時に渡される props パラメータを透過的に渡す
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
`ma-pro-table` には[スロット](#slot)でここを拡張することもできます。一時的な機能にはスロットを使用し、システム全体で必要な場合は `API` で拡張することをお勧めします。
:::

`useProTableToolbar()` は以下のメソッドを返します：
- `get: (name: string) => MaProTableToolbar` 特定のツール情報を取得
- `getAll: () => MaProTableToolbar[]` すべてのツール情報を取得
- `add: (toolbar: MaProTableToolbar) => void` 新しいツールを追加
- `remove: (name: string) => void` ツールを削除
- `hide: (name: string) => void` ツールを非表示に設定
- `show: (name: string) => void` ツールを表示に設定

::: details `MaProTableToolbar` 型の説明を表示
| パラメータ       | 説明                  | タイプ         |
|----------|---------------------|-------------------|
| `name` | ツール名、一意の識別子 | `string`|
| `render`  | レンダリング関数、`コンポーネント、jsx、tsx` などをサポート | `Function` |
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
  // レンダリングコンポーネントを指定。コンポーネントには proxy パラメータが渡されます。コンポーネント内部で props を定義して受け取る必要があります
  render: CustomerTool,
  show: true,
  order: 99,
})
```

```vue [CustomerTool.vue]

<script setup lang="ts">
  // `ma-pro-table` から渡される proxy パラメータを受け取るために props を定義
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
  <!-- circle 属性を追加して円形ボタンにし、システムと統一性を持たせる -->
  <el-button circle @click="execute">😀</el-button>
</template>
```
:::

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
| `id`                   | 現在のID、グローバルで一意。指定しない場合はランダムに生成されます                      | `string`                                    | -      | 1.0.0  |
| `adaptionOffsetBottom` | 下部からのオフセット量                                   | `number`                                    | 0      | 1.0.0  |
| `actionBtnPosition`    | アクションボタンの配置位置。自動モードでは、ヘッダーが有効な場合はヘッダーに表示され、それ以外はテーブルの左上に表示されます | `auto, header, table`                       | `auto` | 1.0.0  |
| `header`               | ヘッダー設定                                      | [パラメータ設定](#headerconfig) を参照                    | -      | 1.0.0  |
| `toolbar`              | ツールバーを表示するか                                   | `boolean, (() => boolean)`                  | `true` | 1.0.0  |
| `toolStates`           | 必要に応じてツールの表示を設定                                | { `[key:string]` : `boolean, (() => boolean)` | -      | 1.0.69 |
| `rowContextMenu`       | 右クリック設定                                      | [パラメータ設定](#rowcontextmenu) を参照                  | -      | 1.0.0  |
| `requestOptions`       | リストのネットワークリクエスト設定                                  | [パラメータ設定](#requestoptions) を参照                  | -      | 1.0.0  |
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
| `items`           | 右クリックメニューリスト    | `ContextMenuItem[]`                                                                | -       | 1.0.0 |
| -                 | -         | -                                                                                  | -      | -     |
| `ContextMenuItem` | 説明        | メニューリスト設定説明                                                                           | -      | -     |
| `label`           | メニュー表示テキスト    | `string, (() => string)`                                                           | -       | 1.0.0 |
| `icon`            | メニュー表示アイコン    | `string, (() => string)`                                                           | -       | 1.0.0 |
| `disabled`        | 無効にするか      | `boolean`                                                                          | -       | 1.0.0 |
| `divided`         | 分割線を表示するか   | `boolean`                                                                          | -       | 1.0.0 |
| `onMenuClick`     | メニュー項目クリックイベント   | `(data: { row: any, column: any, proxy: MaProTableExpose }, event: Event) => void` | -       | 1.0.0 |

#### requestOptions
| パラメータ                    | 説明                    | タイプ                                                        | デフォルト値                                                    | バージョン    |
|-----------------------|-----------------------|-----------------------------------------------------------|--------------------------------------------------------|-------|
| `api`                 | リクエストAPIメソッド             | `(...args: any[]) => any`                                 | -                                                      | 1.0.0 |
| `autoRequest`         | 自動リクエストするか                | `boolean`                                                 | `true`                                                 | 1.0.0 |
| `response`            | レスポンス構造設定              | `{ totalKey?: string, dataKey?: string }`                 | `{ totalKey: 'total', dataKey: 'list'}`                | 1.0.0 |
| `requestPage`         | ページネーションリクエスト設定                | `{ pageName?: string, sizeName?: string, size?: number }` | `{ pageName: 'page', sizeName: 'pageSize', size: 10 }` | 1.0.0 |
| `requestParams`       | デフォルトリクエストパラメータ                | `Object`                                                  | -                                                      | 1.0.0 |
| `responseDataHandler` | レスポンス後のデータ処理。注意：`テーブルデータを返す必要があります` | `(response: Record<string, any>) => any[]`                | -                                                      | 1.0.0 |
| `on`                  | イベントリスト | `Record<string, (...args: any[]) => any>`                 | -                                                      | 1.0.0 |


### MaProTableSchema
| パラメータ   | 説明       | タイプ                                                | デフォルト値 | バージョン    |
|------|----------|---------------------------------------------------|-----|-------|
|`searchItems`| 検索項目リスト設定  | `MaSearchItem[]` [設定項目](ma-search#searchitems) | -   | 1.0.0 |
|`tableColumns`| テーブルリスト設定 | `MaProTableColumns[]`                             | -   | 1.0.0 |

#### MaProTableColumns
::: tip
`el-table-columns` と `ma-table` の [拡張columns設定](ma-table#columnextraprops) を継承しています。以下は拡張パラメータです。
:::
| パラメータ   | 説明                         | タイプ                                                 | デフォルト値 | バージョン    |
|------|----------------------------|----------------------------------------------------|-----|-------|
|`type`| `el-table` ネイティブに加え、`operation`（操作欄）、`sort`（行ドラッグソート）を追加 | `string` | -   | 1.0.0 |
|`cellRenderTo`| テーブルに登録されたプラグインでセルをレンダリング                     | [以下のタイプを参照](#cellrenderto-レンダリングプラグインの使用)    | -   | 1.0.0 |
|`isRender`| 列をレンダリングするか。`hide`