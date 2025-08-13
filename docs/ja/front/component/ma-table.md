# MaTable

`Element plus` のテーブルを二次的にカプセル化した `Table` コンポーネントで、すべてのネイティブテーブルパラメータ、イベント、スロットをサポートし、一部の機能を強化しており、非常に使いやすいです。

::: tip 説明
ネイティブの `el-table` のすべてのパラメータ、イベント、スロットを完全に互換性を持ってサポートしているため、テーブルでは拡張パラメータのみを説明します。

公式パラメータについては [Element plus](https://element-plus.org/ja/component/table.html) 公式ドキュメントを参照してください。

**注意：デモコンポーネントの言語パッケージ表示が正しくない場合がありますが、実際のプロジェクトではこの問題は発生しません。**
:::

## 基本的な使用
<DemoPreview dir="demos/ma-table/default" />

## サンプル一覧

### 基本機能サンプル
- [基本テーブル](./ma-table/basic) - 基本的なデータ表示と設定
- [テーブルソート](./ma-table/sorting) - 各種ソート機能のデモ
- [テーブルフィルタ](./ma-table/filter) - フィルタと検索機能

### 高度な機能サンプル  
- [カスタムレンダリング](./ma-table/custom-render) - セルとヘッダーのカスタムレンダリング
- [動的列管理](./ma-table/dynamic-columns) - 列の動的な追加、削除、変更
- [ページネーションテーブル](./ma-table/pagination) - 完全なページネーション機能

### 特殊なシナリオサンプル
- [ツリーテーブル](./ma-table/tree-table) - 階層データの表示
- [複数選択テーブル](./ma-table/selection) - 選択とバッチ操作
- [レスポンシブテーブル](./ma-table/responsive) - 高さの自動調整とレスポンシブレイアウト

## Props

| パラメータ        | 説明                                                  | タイプ         | Ele-公式ドキュメント                                                                                     | バージョン    |
|-----------|-----------------------------------------------------|-------------------|----------------------------------------------------------------------------------------------|-------|
| `options` | `el-table` パラメータおよび[拡張パラメータ](#extraprops)              | `MaTableOptions`   | [テーブル属性](https://element-plus.org/ja/component/table.html#table-%E5%B1%9E%E6%80%A7)         | 1.0.0 |
| `columns` | `el-table-column` パラメータおよび[拡張パラメータ](#columnextraprops) | `MaTableColumns[]` | [テーブル列属性](https://element-plus.org/ja/component/table.html#table-column-%E5%B1%9E%E6%80%BC) | 1.0.0 |

::: tip タイプ説明
- `MaTableOptions`: Element Plus テーブルのすべてのネイティブ属性を拡張し、コンテナの高さ、ローディング状態、配置方法、高さの自動調整、ページネーションなどの設定オプションを追加
- `MaTableColumns[]`: Element Plus テーブル列のすべてのネイティブ属性を拡張し、非表示列、カスタムレンダリング、マルチレベルヘッダーなどの機能を追加
:::

### ExtraProps
::: tip 説明
これは `ma-table` が `el-table` に対して追加した拡張パラメータです
:::
| パラメータ        | 説明                                                                    | タイプ                                                                                              | デフォルト値      | バージョン    |
|-----------|-----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|----------|-------|
| `containerHeight` | コンテナの高さ                                                                  | `string`                                                                                        | -        | 1.0.0 |
| `loading` | ローディングアニメーションを有効にするか                                                              | `boolean`                                                                                       | `false`  | 1.0.0 |
| `loadingConfig` | ローディングアニメーションの関連設定                                                             | [LoadingConfig](#loadingconfig説明)                                                               | -        | 1.0.0 |
| `columnAlign` | セルの配置方法                                                               | `left、center、right`                                                                             | `center` | 1.0.0 |
| `headerAlign` | <el-tooltip content="ヘッダーの配置方法、この項目が設定されていない場合はセルの配置方法を使用">`マウスオーバーで表示`</el-tooltip> | `left、center、right`                                                                             | -        | 1.0.0 |
| `showOverflowTooltip` | <el-tooltip content="内容が長すぎて隠されている場合に tooltip を表示">`マウスオーバーで表示`</el-tooltip>       | `boolean`                                                                                       | `false`  | 1.0.0 |
| `adaption` | 高さを自動調整するか                                                                | `boolean`                                                                                       | `false`  | 1.0.0 |
| `adaptionOffsetBottom` | 下部からのオフセット量                                                               | `number`                                                                                        | `70`     | 1.0.0 |
| `showPagination` | ページネーションを表示するか                                                               | `boolean`                                                                                        | `true`     | 1.0.0 |
| `pagination` | Elページネーションのネイティブ属性、イベント                                                           | [el-pageinationドキュメント](https://element-plus.org/ja/component/pagination.html#%E5%B1%9E%E6%80%A7) | -        | 1.0.0 |
| `on`      | `el-table` テーブルイベントコレクション                                                     | <el-tooltip content="Object: { onSelect: (args) => {}, .... }">`マウスオーバーで表示`</el-tooltip>            | -        | 1.0.0 |


#### LoadingConfig説明
| パラメータ        | 説明      | タイプ   | デフォルト値 | バージョン    |
|-----------|----------|------|-----|-------|
| `text` | ローディングアイコンの下に表示するローディングテキスト   | `string`  | -   | 1.0.0 |
| `spinner` | カスタムローディングアイコン   | `string` | -   | 1.0.0 |
| `svg` | カスタム `svg` ローディングアイコン   | `string` | -   | 1.0.0 |
| `viewBox` | ローディングアイコンのサイズ   | `string` | -   | 1.0.0 |
| `background` | 背景マスクの色   | `string` | -   | 1.0.0 |
| `customClass` | カスタム class クラス名   | `string` | -   | 1.0.0 |

### ColumnExtraProps
::: tip 説明
これは `ma-table` が `el-table-column` に対して追加した拡張パラメータです
:::

| パラメータ        | 説明                                                                                | タイプ                                  | デフォルト値     | バージョン    |
|-----------|-----------------------------------------------------------------------------------|-------------------------------------|---------|-------|
| `hide` | 列を非表示にするか                                                                             | `boolean`                           | `false` | 1.0.0 |
| `children` | マルチレベルヘッダー                                                                              | `MaTableColumns[]`                  | -       | 1.0.0 |
| `cellRender` | <el-tooltip content="カスタムセルレンダラー、コンポーネント、仮想DOM、文字列をサポート、jsx と tsx をサポート">`マウスオーバーで表示`</el-tooltip> | `(data: TableColumnRenderer) => {}` | -       | 1.0.0 |
| `headerRender` | <el-tooltip content="カスタムヘッダーレンダラー、コンポーネント、仮想DOM、文字列をサポート、jsx と tsx をサポート">`マウスオーバーで表示`</el-tooltip>  | `(data: TableColumnRenderer) => {}` | -       | 1.0.0 |

## Slot

| 名前              | 説明                                     | パラメータ | 例 |
|-----------------|----------------------------------------|----|-----|
| `empty`         | ネイティブスロット、データが空の場合に表示                            | -  | `#empty` |
| `append`        | ネイティブスロット、テーブルの最後の行                            | -  | `#append` |
| `pageLeft`      | ページネーション行の左側領域スロット                             | -  | `#pageLeft` |
| `column-[prop]` | テーブル列スロット、`prop` はフィールド名                      | `{ row, column, $index }` | `#column-name="{ row }"` |
| `header-[prop]` | テーブルヘッダースロット、`prop` はフィールド名                      | `{ column, $index }` | `#header-name="{ column }"` |
| `default`       | デフォルト列内容スロット                              | `{ row, column, $index }` | `#default="{ row }"` |
| `header`        | デフォルトヘッダー内容スロット                              | `{ column, $index }` | `#header="{ column }"` |
| `filterIcon`    | カスタムフィルターアイコンスロット                              | - | `#filterIcon` |

::: tip スロットパラメータ説明
- **scope パラメータ**: `row` は現在の行データ、`column` は現在の列設定、`$index` は現在の行インデックス
- **動的スロット**: `column-[prop]` と `header-[prop]` の `[prop]` は実際のフィールド名に置き換える必要があります
- **ページネーションスロット**: `pageLeft` スロットを使用してページネーション領域の左側にカスタムコンテンツ（バッチ操作ボタンなど）を追加できます
:::

## Event
| 名前              | 説明         | パラメータ          | トリガータイミング |
|-----------------|------------|-------------|---------|
| `set-data-callback`  | テーブルデータ設定後のコールバック | `data: any[]` | `setData` メソッド呼び出し後にトリガー |

::: tip イベント説明
上記の拡張イベントに加えて、ma-table は Element Plus テーブルのすべてのネイティブイベント（`select`、`select-all`、`selection-change`、`cell-click`、`row-click` など）をサポートしています。
これらのイベントは `options.on` オブジェクトを介して設定できます。
:::

## Expose
| 名前                  | 説明                | パラメータ                   | 戻り値                | 使用シナリオ |
|---------------------|-------------------|----------------------|--------------------|---------| 
| `setData()`         | テーブルデータを設定            | `data: any[]`        | -                  | テーブルデータを動的に更新 |
| `setPagination()`   | ページネーションパラメータを設定            | `pagination: PaginationProps` | -     | ページネーション設定を更新 |
| `setLoadingState()` | テーブルの `loading` 状態を設定 | `loading: boolean`   | -                  | ローディング状態を制御 |
| `setOptions()`      | `ma-table` 設定を設定  | `options: MaTableOptions`   | -       | テーブル設定を動的に更新 |
| `getOptions()`      | `ma-table` 設定を取得  | -                    | `MaTableOptions`   | 現在の設定を取得 |
| `setColumns()`      | テーブル列を設定             | `columns: MaTableColumns[]` | -       | すべての列を再設定 |
| `getColumns()`      | テーブル列を取得             | -                    | `MaTableColumns[]` | 現在の列設定を取得 |
| `appendColumn()`    | テーブル列を追加             | `column: MaTableColumns`   | -        | 新しい列を動的に追加 |
| `removeColumn()`    | テーブル列を削除             | `prop: string`       | -                  | 指定した列を動的に削除 |
| `getColumnByProp()` | `prop`でテーブル列を取得      | `prop: string`       | `MaTableColumns`   | 指定した列設定を取得 |
| `getElTableRef()`   | `el-table` Refを取得 | -                    | `Ref<ElTable>`     | ネイティブテーブルメソッドにアクセス |

::: tip Expose メソッド説明
- **データメソッド**: `setData`、`setPagination`、`setLoadingState` はテーブルの状態を動的に更新するために使用
- **設定メソッド**: `setOptions`、`getOptions` はテーブル設定を動的に変更するために使用
- **列管理メソッド**: `setColumns`、`getColumns`、`appendColumn`、`removeColumn`、`getColumnByProp` は完全な列管理機能を提供
- **ネイティブアクセス**: `getElTableRef` を使用して Element Plus テーブルのネイティブインスタンスを取得し、すべてのネイティブメソッドを呼び出し可能
:::

## 完全なタイプ定義

### MaTableOptions インターフェース
```typescript
interface MaTableOptions {
  // コンテナとローディング
  containerHeight?: string
  loading?: boolean
  loadingConfig?: LoadingConfig
  
  // 配置方法
  columnAlign?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  
  // 表示オプション
  showOverflowTooltip?: boolean
  pagination?: PaginationProps
  
  // 高さの自動調整
  adaption?: boolean
  adaptionOffsetBottom?: number
  showPagination?: boolean
  
  // Element Plus ネイティブ属性
  data?: any[]
  height?: string | number
  maxHeight?: string | number
  stripe?: boolean
  border?: boolean
  size?: 'large' | 'default' | 'small'
  fit?: boolean
  showHeader?: boolean
  highlightCurrentRow?: boolean
  currentRowKey?: string | number
  // ... その他の Element Plus 属性
  
  // イベント処理
  on?: {
    [eventName: string]: (...args: any[]) => void
  }
}
```

### MaTableColumns インターフェース
```typescript
interface MaTableColumns {
  // 拡張属性
  hide?: boolean | ((column: MaTableColumns) => boolean)
  children?: MaTableColumns[]
  cellRender?: (data: TableColumnRenderer) => VNode | string
  headerRender?: (data: TableColumnRenderer) => VNode | string
  
  // Element Plus ネイティブ属性
  label?: string
  prop?: string
  type?: 'selection' | 'index' | 'expand'
  width?: string | number
  minWidth?: string | number
  fixed?: boolean | 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  sortable?: boolean | 'custom'
  // ... その他の Element Plus 列属性
}
```

### TableColumnRenderer インターフェース
```typescript
interface TableColumnRenderer {
  row: any          // 現在の行データ
  column: TableColumn   // 現在の列設定
  $index: number    // 現在の行インデックス
  options: TableColumn  // 列オプション
  attrs: any        // その他の属性
}
```