# MaForm

`Element plus` をベースにしたフォームの二次ラッピング `Form` コンポーネントで、すべてのネイティブフォームのパラメータ、イベント、スロット、書き方をサポートし、設定方式でも実装可能です。
さらに、`el-row` と `el-space` をベースにしたレイアウトでフォームを設計することもサポートしています。

::: tip 説明
ネイティブ `el-from` のすべてのパラメータ、イベント、スロットを完全に互換性およびサポートしているため、拡張パラメータのみを説明します。

公式フォームのパラメータについては、[Element plus](https://element-plus.org/zh-CN/component/form.html) 公式ドキュメントを参照してください。
:::

## 設定方式での使用
<DemoPreview dir="demos/ma-form/config" />

## テンプレート方式での使用
<DemoPreview dir="demos/ma-form/template" />

## `コンポーネント`と`el-form-item`の`Ref`を取得
:::tip ヒント
この方法は **設定形式** 用です。`template` では自分で `ref` を定義できます。
:::

<DemoPreview dir="demos/ma-form/getRef" />

## Props

| パラメータ        | 説明                             | タイプ         | Ele-公式ドキュメント                                                                   | バージョン    |
|-----------|--------------------------------|-------------------|----------------------------------------------------------------------------|-------|
| `v-model` | `ma-form`データ、双方向バインディング               | `MaModel`   | -                                                                          | 1.0.0 |
| `options` | `el-form` パラメータおよび[拡張パラメータ](#extraprops) | `MaFormOptions`   | [フォーム属性](https://element-plus.org/zh-CN/component/form.html#form-attributes) | 1.0.0 |
| `items`   | [ma-form-itemパラメータ](#maformitem)  | `MaFormItem[]` | -                                                                          | 1.0.0 |

### ExtraProps
::: tip 説明
これは `ma-form` が `el-form` に対して拡張したパラメータです。
:::
| パラメータ        | 説明                                                                    | タイプ                                                                                              | デフォルト値      | バージョン    |
|-----------|-----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|----------|-------|
| `containerClass` | フォームコンテナのクラス名                                                                  | `string`                                                                                        | -        | 1.0.0 |
| `loading` | ローディングアニメーションを有効にするか                                                              | `boolean`                                                                                       | `false`  | 1.0.0 |
| `loadingConfig` | ローディングアニメーションの関連設定                                                             | [LoadingConfig](#loadingconfig説明)                                                               | -        | 1.0.0 |
| `layout` | <el-tooltip content="レイアウト方式。`flex`を使用する場合、`item`の`itemProps`設定で`cols`パラメータを設定できます。デフォルト値：`flex`">`マウスを乗せて確認`</el-tooltip>  | `flex, grid` | `flex` | 1.0.0 |
| `grid` | <el-tooltip content=" `grid` レイアウト。`layout`が`grid`の場合に有効。実際には`el-space`を使用しており、設定は`element-plus`の`el-space`ドキュメントを参照してください">`マウスを乗せて確認`</el-tooltip> | [el-spaceドキュメント](https://element-plus.org/zh-CN/component/space.html#attributes)     | -        | 1.0.0 |
| `flex` | <el-tooltip content=" `flex` レイアウト。`layout`が`flex`の場合に有効。実際には`el-row`を使用しており、設定は`element-plus`の`el-row`ドキュメントを参照してください">`マウスを乗せて確認`</el-tooltip> | [el-rowドキュメント](https://element-plus.org/zh-CN/component/layout.html#row-attributes)     | -        | 1.0.0 |
| `footerSlot` | <el-tooltip content="設定型スロット。`template`での書き方は #footer">`マウスを乗せて確認`</el-tooltip>       | `() => {}`  | -  | 1.0.0 |

#### LoadingConfig説明
| パラメータ        | 説明      | タイプ   | デフォルト値 | バージョン    |
|-----------|----------|------|-----|-------|
| `text` | ローディングアイコンの下に表示されるテキスト   | `string`  | -   | 1.0.0 |
| `spinner` | カスタムローディングアイコン   | `string` | -   | 1.0.0 |
| `svg` | カスタム `svg` ローディングアイコン   | `string` | -   | 1.0.0 |
| `viewBox` | ローディングアイコンのサイズ   | `string` | -   | 1.0.0 |
| `background` | 背景マスクの色   | `string` | -   | 1.0.0 |
| `customClass` | カスタム class クラス名   | `string` | -   | 1.0.0 |

### MaFormItem

| パラメータ            | 説明                                                                                                                                                                             | タイプ                                                                                                 | デフォルト値     | バージョン     |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|---------|--------|
| `label`       | ネイティブパラメータを強化し、関数タイプをサポート                                                                                                                                                                | `string, () => string`                                                                             | -       | 1.0.0  |
| `prop`        | ネイティブパラメータを強化し、関数タイプをサポート                                                                                                                                                                | `string, () => string`                                                                             | -       | 1.0.0  |
| `hide`        | <el-tooltip content="この項目を非表示にするかどうか。非表示にしてもデータは保持されます。デフォルト: `false`。カスタムコンポーネントでは無効な場合があります">`マウスを乗せて確認`</el-tooltip>                                                                                            | <el-tooltip content="boolean, (item: MaFormItem, model: MaModel) => boolean">`マウスを乗せて確認`</el-tooltip> | `false` | 1.0.0  |
| `show`        | <el-tooltip content="この項目を表示するかどうか。表示しない場合、実際にはレンダリングされず、データも保持されません。デフォルト: `true`。カスタムコンポーネントでは無効な場合があります">`マウスを乗せて確認`</el-tooltip>                                                                                       | <el-tooltip content="boolean, (item: MaFormItem, model: MaModel) => boolean">`マウスを乗せて確認`</el-tooltip> | `true`  | 1.0.0  |
| `cols`        | `options.layout が flex` の場合に有効                                                                                                                                                  | [el-colドキュメント](https://element-plus.org/zh-CN/component/layout.html#col-attributes)                    | -       | 1.0.0  |
| `itemProps`   | `el-form-item` ネイティブ属性                                                                                                                                                            | [フォーム項目属性](https://element-plus.org/zh-CN/component/form.html#formitem-attributes)                    | -       | 1.0.0  |
| `itemSlots`   | `el-form-item` ネイティブスロット                                                                                                                                                            | [フォーム項目スロット](https://element-plus.org/zh-CN/component/form.html#formitem-slots)                         | -       | 1.0.0  |
| `render`      | レンダリングコンポーネント：<el-tooltip content="レンダリングするコンポーネントを設定します。`element plus` のすべての `form` コンポーネントを設定できます。例：`input`, `datePicker`。また、`tsx`, `jsx` 構文の仮想DOMや、コンポーネント、関数形式（例：() => ElInput）も渡せます">`マウスを乗せて確認`</el-tooltip> | `string, (data) => any`                                                                            | -       | 1.0.0  |
| `renderProps` | レンダリングコンポーネントの `props` 属性                                                                                                                                                              | `Record<string, any>`                                                                              | -       | 1.0.0  |
| `renderSlots` | レンダリングコンポーネントのスロット                                                                                                                                                                       | `Record<string, (...args) => {}>`                                                                  | -       | 1.0.0  |
| `children`    | 子設定項目。無限ネストをサポート。注：親コンポーネントでスロットを使用する場合、子設定項目は無効になります                                                                                                                                                 | `MaFormItem[]`                                                                                     | -       | 1.0.33 |

## Slot

| 名前              | 説明                                    | パラメータ |
|-----------------|---------------------------------------|----|
| `default`       | デフォルトスロット。ネイティブタグ `<el-form-item>` を記述可能。設定方式では自動的に無効化 | -  |
| `footer`        | フォームフッタースロット                                | -  |


## Expose
| 名前                  | 説明                | パラメータ                | 戻り値             |
|---------------------|-------------------|-------------------|-----------------|
| `setLoadingState()` | フォームの `loading` 状態を設定 | `(boolean)`       | -               |
| `setOptions()`      | `ma-form` 設定を設定   | `(MaFormOptions)` | -               |
| `getOptions()`      | `ma-form` 設定を取得   | -                 | `MaFormOptions` |
| `setItems()`        | フォーム項目を設定             | `(MaFormItem[])`  | -               |
| `getItems()`        | フォーム項目を取得             | -                 | `MaFormItem[]`  |
| `appendItem()`      | フォーム項目を追加             | `(MaFormItem)`    | -               |
| `removeItem()`      | フォーム項目を削除             | `(prop: string)`  | -              |
| `getItemByProp()`   | `prop`でフォーム項目を取得      | `(prop: string)`  | `MaFormItem`    |
| `isMobileState()`   | モバイルモードかどうかを確認        | -                 | `boolean`    |
| `getElFormRef()`    | `el-form` Ref を取得  | -                 | `El-Form`       |