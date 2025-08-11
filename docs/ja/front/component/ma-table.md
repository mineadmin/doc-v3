# MaTable

`Element plus` のテーブルを二次的にカプセル化した `Table` コンポーネントで、すべてのネイティブテーブルパラメータ、イベント、スロットをサポートし、一部の機能を強化しています。非常に使いやすいです。

::: tip 説明
ネイティブの `el-table` のすべてのパラメータ、イベント、スロットを完全に互換性を持ってサポートしているため、テーブルでは拡張パラメータのみを説明します。

公式パラメータについては [Element plus](https://element-plus.org/zh-CN/component/table.html) 公式ドキュメントを参照してください。

**注意：デモコンポーネントの言語パッケージ表示が正しくない場合がありますが、実際のプロジェクトではこの問題は発生しません。**
:::

## 使用
<DemoPreview dir="demos/ma-table" />

## Props

| パラメータ        | 説明                                                  | タイプ         | Ele-公式ドキュメント                                                                                     | バージョン    |
|-----------|-----------------------------------------------------|-------------------|----------------------------------------------------------------------------------------------|-------|
| `options` | `el-table` パラメータおよび[拡張パラメータ](#extraprops)              | `MaTableOptions`   | [テーブル属性](https://element-plus.org/zh-CN/component/table.html#table-%E5%B1%9E%E6%80%A7)         | 1.0.0 |
| `columns` | `el-table-column` パラメータおよび[拡張パラメータ](#columnextraprops) | `MaTableColumns[]` | [テーブル列属性](https://element-plus.org/zh-CN/component/table.html#table-column-%E5%B1%9E%E6%80%A7) | 1.0.0 |
| `data`    | テーブルデータ                                                | `any[]`          | -                                                                                            | 1.0.0 |

### ExtraProps
::: tip 説明
これは `ma-table` が `el-table` に対して拡張したパラメータです
:::
| パラメータ        | 説明                                                                    | タイプ                                                                                              | デフォルト値      | バージョン    |
|-----------|-----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|----------|-------|
| `containerHeight` | コンテナの高さ                                                                  | `string`                                                                                        | -        | 1.0.0 |
| `loading` | ローディングアニメーションを有効にするか                                                              | `boolean`                                                                                       | `false`  | 1.0.0 |
| `loadingConfig` | ローディングアニメーションの関連設定                                                             | [LoadingConfig](#loadingconfig説明)                                                               | -        | 1.0.0 |
| `columnAlign` | セルの配置方式                                                               | `left、center、right`                                                                             | `center` | 1.0.0 |
| `headerAlign` | <el-tooltip content="ヘッダーの配置方式、設定しない場合はセルの配置方式を使用">`マウスオーバーで表示`</el-tooltip> | `left、center、right`                                                                             | -        | 1.0.0 |
| `showOverflowTooltip` | <el-tooltip content="内容が長すぎて隠れた場合に tooltip を表示">`マウスオーバーで表示`</el-tooltip>       | `boolean`                                                                                       | `false`  | 1.0.0 |
| `adaption` | 高さに適応するか                                                                | `boolean`                                                                                       | `false`  | 1.0.0 |
| `adaptionOffsetBottom` | 下部からのオフセット量                                                               | `number`                                                                                        | `70`     | 1.0.0 |
| `showPagination` | ページネーションを表示するか                                                               | `boolean`                                                                                        | `true`     | 1.0.0 |
| `pagination` | Elページネーションのネイティブ属性、イベント                                                           | [el-pageinationドキュメント](https://element-plus.org/zh-CN/component/pagination.html#%E5%B1%9E%E6%80%A7) | -        | 1.0.0 |
| `on`      | `el-table` テーブルイベントの集合                                                     | <el-tooltip content="Object: { onSelect: (args) => {}, .... }">`マウスオーバーで表示`</el-tooltip>            | -        | 1.0.0 |


#### LoadingConfig説明
| パラメータ        | 説明      | タイプ   | デフォルト値 | バージョン    |
|-----------|----------|------|-----|-------|
| `text` | ローディングアイコンの下に表示するテキスト   | `string`  | -   | 1.0.0 |
| `spinner` | カスタムローディングアイコン   | `string` | -   | 1.0.0 |
| `svg` | カスタム `svg` ローディングアイコン   | `string` | -   | 1.0.0 |
| `viewBox` | ローディングアイコンのサイズ   | `string` | -   | 1.0.0 |
| `background` | 背景マスクの色   | `string` | -   | 1.0.0 |
| `customClass` | カスタム class クラス名   | `string` | -   | 1.0.0 |

### ColumnExtraProps
::: tip 説明
これは `ma-table` が `el-table-column` に対して拡張したパラメータです
:::

| パラメータ        | 説明                                                                                | タイプ                                  | デフォルト値     | バージョン    |
|-----------|-----------------------------------------------------------------------------------|-------------------------------------|---------|-------|
| `hide` | 列を非表示にするか                                                                             | `boolean`                           | `false` | 1.0.0 |
| `children` | マルチレベルヘッダー                                                                              | `MaTableColumns[]`                  | -       | 1.0.0 |
| `cellRender` | <el-tooltip content="カスタムセルレンダラー、コンポーネント、仮想DOM、文字列をサポート、jsx と tsx をサポート">`マウスオーバーで表示`</el-tooltip> | `(data: TableColumnRenderer) => {}` | -       | 1.0.0 |
| `headerRender` | <el-tooltip content="カスタムヘッダーレンダラー、コンポーネント、仮想DOM、文字列をサポート、jsx と tsx をサポート">`マウスオーバーで表示`</el-tooltip>  | `(data: TableColumnRenderer) => {}` | -       | 1.0.0 |

## Slot

| 名前              | 説明                                     | パラメータ |
|-----------------|----------------------------------------|----|
| `empty`         | ネイティブスロット、データが空の場合に表示                            | -  |
| `append`        | ネイティブスロット、テーブルの最後の行                            | -  |
| `pageLeft`      | ページネーション行の左側領域スロット                             |    |
| `column-[prop]` | テーブル列スロット、`prop` はフィールド名                      |  scope  |
| `header-[prop]` | テーブルヘッダースロット、`prop` はフィールド名                      |  scope  |

## Event
| 名前              | 説明         | パラメータ          |
|-----------------|------------|-------------|
| `set-data-callback`  | テーブルデータ設定後のコールバック | `data: any[]` |

## Expose
| 名前                  | 説明                | パラメータ                   | 戻り値                |
|---------------------|-------------------|----------------------|--------------------|
| `setData()`         | テーブルデータを設定            | `(any[])`            | -                  |
| `setPagination()`   | ページネーションパラメータを設定            | Elネイティブパラメータ               | -                  |
| `setLoadingState()` | テーブルの `loading` 状態を設定 | `(boolean)`          | -                  |
| `setOptions()`      | `ma-table` 設定を設定  | `(MaTableOptions)`   | -                  |
| `getOptions()`      | `ma-table` 設定を取得  | -                    | `MaTableOptions`   |
| `setColumns()`      | テーブル列を設定             | `(MaTableColumns[])` | -                  |
| `getColumns()`      | テーブル列を取得             | -                    | `MaTableColumns[]` |
| `appendColumn()`    | テーブル列を追加             | `(MaTableColumns)`   | -                  |
| `removeColumn()`    | テーブル列を削除             | `(prop: string)`     | -                  |
| `getColumnByProp()`    | `prop`でテーブル列を取得      | `(prop: string)`     | `MaTableColumns`   |
| `getElTableRef()`    | `el-table` Refを取得 | -                    | `El-Table`         |