# MaSearch

`ma-search` は `ma-form` をベースにカプセル化されており、検索フォームを素早く構築するために使用されます。

:::tip ヒント
`form` と `form-item` のパラメータは `ma-form` と同じです。
:::

## 使用方法
<DemoPreview dir="demos/ma-search" />

## Props
::: tip パラメータ説明
- `options` は検索コンポーネントの設定項目です
- `formOptions` は `ma-form` の設定項目です
- `searchItems` は [ma-form-item](ma-form#maformitem) に新しい属性を追加したものです
:::
| パラメータ       | 説明                          | タイプ         | バージョン    |
|----------|-----------------------------|-------------------|--------|
| `options` | `ma-search` のパラメータ              | `MaFormOptions`   | 1.0.0 |
| `formOptions`  | [ma-formパラメータ](ma-form#props)  | `MaFormOptions` | 1.0.0 |
| `searchItems`  | [form-itemパラメータ](#searchitems) | `MaSearchItem[]` | 1.0.0 |

### MaFormOptions
| パラメータ        | 説明       | タイプ                                                  | デフォルト値     | バージョン    |
|-----------|----------|-----------------------------------------------------|---------|-------|
| `defaultValue` | 検索デフォルト値の設定  | `Record<string, any>`                               | -       | 1.0.0 |
| `cols` | 検索列数の設定   | Record<[MediaBreakPoint](#mediabreakpoint), number> | -       | 1.0.0 |
| `fold` | 検索パネルを折りたたむかどうか | `boolean`                                           | `false` | 1.0.0 |
| `foldRows` | 折りたたんだ後の表示数  | `number`                                            | 2       | 1.0.0 |
| `show` | 検索パネルを表示するかどうか | `boolean`                                           | `true`  | 1.0.0 |
| `text` | テキスト設定     | [テキスト設定](#テキスト設定)                                   | -       | 1.0.0 |

#### MediaBreakPoint
| パラメータ   | 説明           | タイプ       | デフォルト値 | バージョン    |
|------|--------------|----------|-----|-------|
| `xs` | <768px 表示列数  | `number` | 1   | 1.0.0 |
| `sm` | ≥768px 表示列数  | `number` | 2   | 1.0.0 |
| `md` | ≥992px 表示列数  | `number` | 2   | 1.0.0 |
| `lg` | ≥1200px 表示列数     | `number` | 3   | 1.0.0 |
| `xl` | ≥1920px 表示列数     | `number` | 4   | 1.0.0 |

#### テキスト設定
| パラメータ           | 説明        | タイプ         | デフォルト値 | バージョン    |
|--------------|-----------|------------|----|-------|
| `searchBtn`  | 検索ボタンのテキスト  | `() => {}` | 検索 | 1.0.0 |
| `resetBtn`   | リセットボタンのテキスト  |  `() => {}`   | リセット | 1.0.0 |
| `isFoldBtn`  | 展開ボタンのテキスト  |  `() => {}`   | 展開 | 1.0.0 |
| `notFoldBtn` | 折りたたみボタンのテキスト  |  `() => {}`   | 折りたたみ | 1.0.0 |

### SearchItems

| パラメータ       | 説明                     | タイプ                        | デフォルト値 | バージョン    |
|----------|------------------------|---------------------------|---|-------|
| `span`   | 列の結合数                  | `number`                  | 1 | 1.0.0 |
| `offset` | 間隔サイズ                   | `number`                  | 0 | 1.0.0 |
| `hide`   | 非表示にするかどうか                   | `boolean & () => boolean` | false | 1.0.0 |
| ...      | その他は `ma-form-item` のパラメータ | -                         | - | 1.0.0 |

## Event

| 名前              | 説明       | パラメータ                       |
|-----------------|----------|--------------------------|
| `search`       | 検索を実行     | `(formData: any) => {}`               |
| `reset`        | 検索をリセット     | `(formData: any) => {}`  |
| `fold`        | 折りたたみ/展開時にトリガー | `(state: boolean) => {}` |

## Slot

| 名前              | 説明                                   | パラメータ |
|-----------------|--------------------------------------|----|
| `default`       | デフォルトスロット、ネイティブタグ `<el-form-item>` を記述可能、設定方法は自動的に無効化 | -  |
| `actions`        | コンポーネント内の `検索`、`リセット` ボタンスロットを上書き               | -  |
| `beforeActions`        | `操作ボタン`の前にコンテンツを挿入                      | -  |
| `afterActions`        | `操作ボタン`の後にコンテンツを追加                      | -  |

## Expose
| 名前                | 説明                 | パラメータ                    | 戻り値                   |
|-------------------|--------------------|-----------------------|-----------------------|
| `getMaFormRef()`  | `ma-form` のRefを取得  | -                     | MaForm                |
| `foldToggle()`    | 展開/折りたたみを切り替え            | -                     | -                     |
| `getFold()`       | 折りたたみ状態を取得             | -                     | `boolean`             |
| `setSearchForm()` | 検索フォームの値を設定            | `(form: any) => void` | -                     |
| `getSearchForm()` | 検索フォームの値を取得            | -                     | `Record<string, any>` |
| `setShowState()`  | 検索の表示/非表示を設定           | (boolean) => void     | -                     |
| `getShowState()`  | 検索の表示状態を取得           | -                     | `boolean`             |
| `setOptions()`    | `ma-search` のパラメータを設定  | `(MaSearchOptions)`   | -                     |
| `getOptions()`    | `ma-search` のパラメータを取得  | -                     | `MaSearchOptions`     |
| `setFormOptions()`      | `ma-form` のパラメータを設定    | `(MaFormOptions)`     | -                     |
| `getFormOptions()`      | `ma-form` のパラメータを取得    | -                     | `MaFormOptions`       |
| `setItems()`      | `ma-search` のフォーム項目を設定 | `(MaSearchItem[])`    | -                     |
| `getItems()`      | `ma-search` のフォーム項目を取得 | -                     | `MaSearchItem`                     |
| `appendItem()`    | 検索フォーム項目を追加              | `(MaSearchItem)`        | -                     |
| `removeItem()`    | 検索フォーム項目を削除              | `(prop: string)`      | -                     |
| `getItemByProp()` | `prop`で検索フォーム項目を取得     | `(prop: string)`      | `MaSearchItem`          |