# MaForm

`Element plus` をベースにフォームを再ラップした `Form` コンポーネントです。すべてのネイティブフォームのパラメータ、イベント、スロット、記述方法をサポートし、設定による実装も可能です。
また、`el-row` と `el-space` に基づくレイアウトを使用してフォームを計画し、レスポンシブデザイン機能も備えています。

::: tip 説明
すべてのネイティブ `el-form` のパラメータ、イベント、スロットを完全に互換・サポートしているため、このドキュメントでは主に拡張機能について説明します。

公式フォームパラメータについては [Element plus](https://element-plus.org/zh-CN/component/form.html) 公式ドキュメントを参照してください。
:::

## クイックスタート

### 設定方式での使用
<DemoPreview dir="demos/ma-form/config" />

### テンプレート方式での使用
<DemoPreview dir="demos/ma-form/template" />

### `コンポーネント` と `el-form-item` の `Ref` を取得
:::tip ヒント
この方法は **設定形式** に使用します。`template` 内で自分で `ref` を定義することもできます。
:::

<DemoPreview dir="demos/ma-form/getRef" />

## 完全なサンプル

:::info サンプルナビゲーション
以下のサンプルは、MaForm のさまざまな使用方法と高度な機能を示しています。基本的な使用から複雑なシナリオまでを網羅しています。最良の結果を得るために順番に学習することをお勧めします。
:::

### 基本機能サンプル
- [基本的な使い方](/v3/front/component/ma-form/examples/basic-usage) - 一般的なフォームコントロールの基本的な設定と使用方法
- [レイアウトシステム](/v3/front/component/ma-form/examples/layout-systems) - Flex および Grid レイアウトのレスポンシブデザイン
- [コンポーネントレンダリング](/v3/front/component/ma-form/examples/component-rendering) - サポートされているすべての Element Plus コンポーネントの表示

### 高度な機能サンプル
- [条件付きレンダリング](/v3/front/component/ma-form/examples/conditional-rendering) - フォームデータに基づくフィールド表示制御
- [動的バリデーション](/v3/front/component/ma-form/examples/dynamic-validation) - カスタムバリデーションルールと非同期バリデーション
- [スロットシステム](/v3/front/component/ma-form/examples/slots-examples) - マルチレベルのスロットの柔軟な使用方法

### 機能デモサンプル
- [公開メソッド](/v3/front/component/ma-form/examples/expose-methods) - すべての API メソッドの使用デモ
- [ローディング状態](/v3/front/component/ma-form/examples/loading-states) - さまざまなローディングシナリオの処理方法
- [ネストフォーム](/v3/front/component/ma-form/examples/nested-forms) - 複雑な階層構造のフォーム処理

### 実践的な応用サンプル
- [高度なシナリオ](/v3/front/component/ma-form/examples/advanced-scenarios) - マルチステップフローと複雑なビジネスロジック
- [パフォーマンス最適化](/v3/front/component/ma-form/examples/performance-demo) - 大規模フォームのパフォーマンス最適化戦略

## TypeScript 型定義

### コアインターフェース

#### MaFormOptions
フォーム設定オプションの完全な型定義：

```typescript
interface MaFormOptions {
  // Element Plus ネイティブ el-form プロパティ
  model?: Record<string, any>
  rules?: Record<string, FormItemRule[]>
  inline?: boolean
  labelPosition?: 'left' | 'right' | 'top'
  labelWidth?: string | number
  labelSuffix?: string
  hideRequiredAsterisk?: boolean
  requireAsteriskPosition?: 'left' | 'right'
  showMessage?: boolean
  inlineMessage?: boolean
  statusIcon?: boolean
  validateOnRuleChange?: boolean
  size?: 'large' | 'default' | 'small'
  disabled?: boolean
  scrollToError?: boolean
  scrollIntoViewOptions?: boolean | ScrollIntoViewOptions
  
  // MaForm 拡張プロパティ
  containerClass?: string
  loading?: boolean
  loadingConfig?: LoadingConfig
  layout?: 'flex' | 'grid'
  flex?: ElRowProps
  grid?: ElSpaceProps
  footerSlot?: () => VNode | VNode[]
}
```

#### MaFormItem
フォーム項目設定の完全な型定義：

```typescript
interface MaFormItem {
  // 基本設定
  label?: string | (() => string)
  prop?: string | (() => string)
  hide?: boolean | ((item: MaFormItem, model: MaModel) => boolean)
  show?: boolean | ((item: MaFormItem, model: MaModel) => boolean)
  
  // レイアウト設定
  cols?: ColsConfiguration
  itemProps?: ElFormItemProps
  itemSlots?: Record<string, (...args: any[]) => VNode | VNode[]>
  
  // レンダリング設定
  render?: RenderType
  renderProps?: Record<string, any>
  renderSlots?: Record<string, (...args: any[]) => VNode | VNode[]>
  
  // ネスト設定
  children?: MaFormItem[]
  
  // バリデーション設定
  customValidator?: (rule: any, value: any, callback: Function) => void
  asyncValidator?: (rule: any, value: any) => Promise<void>
}
```

#### ColsConfiguration
レスポンシブカラム設定型：

```typescript
interface ColsConfiguration {
  // 基本グリッド設定
  span?: number
  offset?: number
  push?: number
  pull?: number
  
  // レスポンシブ設定
  xs?: number | ResponsiveColConfig
  sm?: number | ResponsiveColConfig
  md?: number | ResponsiveColConfig
  lg?: number | ResponsiveColConfig
  xl?: number | ResponsiveColConfig
  
  // カスタム設定
  order?: number
  flex?: string | number
}

interface ResponsiveColConfig {
  span?: number
  offset?: number
  push?: number
  pull?: number
}
```

#### RenderType
コンポーネントレンダリング型定義：

```typescript
type RenderType = 
  | string  // Element Plus コンポーネント名
  | Component  // Vue コンポーネント
  | ((data: RenderContext) => VNode | VNode[])  // レンダリング関数

interface RenderContext {
  item: MaFormItem
  model: MaModel
  formRef: Ref<FormInstance | undefined>
  disabled: boolean
  readonly: boolean
  size: ComponentSize
}
```

#### MaFormExpose
コンポーネント公開メソッドの型定義：

```typescript
interface MaFormExpose {
  // 状態管理
  setLoadingState: (loading: boolean) => void
  getLoadingState: () => boolean
  
  // 設定管理
  setOptions: (options: Partial<MaFormOptions>) => void
  getOptions: () => MaFormOptions
  updateOptions: (updater: (options: MaFormOptions) => MaFormOptions) => void
  
  // フォーム項目管理
  setItems: (items: MaFormItem[]) => void
  getItems: () => MaFormItem[]
  appendItem: (item: MaFormItem, index?: number) => void
  prependItem: (item: MaFormItem) => void
  removeItem: (prop: string) => boolean
  updateItem: (prop: string, updates: Partial<MaFormItem>) => boolean
  
  // フォーム項目検索
  getItemByProp: (prop: string) => MaFormItem | undefined
  getItemsByCondition: (condition: (item: MaFormItem) => boolean) => MaFormItem[]
  getVisibleItems: () => MaFormItem[]
  
  // フォームバリデーション
  validate: () => Promise<boolean>
  validateField: (prop: string) => Promise<boolean>
  resetFields: (props?: string[]) => void
  clearValidate: (props?: string[]) => void
  
  // フォームデータ
  getFormData: () => Record<string, any>
  setFormData: (data: Record<string, any>) => void
  resetFormData: () => void
  
  // El-Form インスタンス
  getElFormRef: () => FormInstance | undefined
}
```

## Props

| パラメータ    | 説明                             | 型         | デフォルト値 | バージョン    |
|-----------|--------------------------------|-------------------|-------|-------|
| `v-model` | フォームデータ、双方向バインディング、レスポンシブ更新対応 | `Record<string, any>` | `{}` | 1.0.0 |
| `options` | フォーム設定オプション、Element Plus ネイティブプロパティと拡張プロパティを含む | `MaFormOptions` | `{}` | 1.0.0 |
| `items`   | フォーム項目設定配列、ネストと動的設定対応 | `MaFormItem[]` | `[]` | 1.0.0 |
| `loading` | グローバルローディング状態、options.loading より優先 | `boolean` | `false` | 1.0.0 |
| `disabled` | グローバル無効状態、options.disabled より優先 | `boolean` | `false` | 1.0.0 |

### MaFormOptions 拡張設定

::: tip 説明
これらは `ma-form` の `el-form` に対する拡張パラメータであり、Element Plus ネイティブパラメータと完全に互換性があります。
:::

| パラメータ        | 説明                                                                    | 型                                                                                              | デフォルト値      | バージョン    |
|-----------|-----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|----------|-------|
| `containerClass` | フォームコンテナカスタムクラス名、スタイルカスタマイズ用                                                   | `string`                                                                                        | -        | 1.0.0 |
| `loading` | ローディングアニメーションを表示するかどうか、グローバルおよび部分的なローディング状態をサポート                                               | `boolean`                                                                                       | `false`  | 1.0.0 |
| `loadingConfig` | ローディングアニメーション詳細設定オプション                                                             | [LoadingConfig](#loadingconfig-設定)                                                               | `{}`     | 1.0.0 |
| `layout` | レイアウト方式：`flex` はグリッドシステムを使用、`grid` はスペースレイアウトを使用                                    | `'flex' \| 'grid'`                                                                              | `flex`   | 1.0.0 |
| `flex` | flex レイアウト設定、`el-row` コンポーネントベース                                            | `ElRowProps`                                                                                    | `{}`     | 1.0.0 |
| `grid` | grid レイアウト設定、`el-space` コンポーネントベース                                          | `ElSpaceProps`                                                                                  | `{}`     | 1.0.0 |
| `footerSlot` | 設定型フッタースロット、VNode または VNode 配列を返す可                                        | `() => VNode \| VNode[]`                                                                        | -        | 1.0.0 |

#### LoadingConfig 設定

ローディングアニメーションの詳細設定オプション：

| パラメータ        | 説明      | 型   | デフォルト値 | バージョン    |
|-----------|----------|------|-----|-------|
| `text` | ローディングアイコン下に表示するローディングテキスト   | `string`  | `'加载中...'`   | 1.0.0 |
| `spinner` | カスタムローディングアイコンクラス名   | `string` | -   | 1.0.0 |
| `svg` | カスタム SVG ローディングアイコン   | `string` | -   | 1.0.0 |
| `viewBox` | SVG アイコンの viewBox プロパティ   | `string` | -   | 1.0.0 |
| `background` | 背景マスクの色   | `string` | `'rgba(0, 0, 0, 0.8)'`   | 1.0.0 |
| `customClass` | カスタムスタイルクラス名   | `string` | -   | 1.0.0 |
| `lock` | スクロールをロックするかどうか   | `boolean` | `true`   | 1.0.0 |
| `fullscreen` | 全画面表示するかどうか   | `boolean` | `false`   | 1.0.0 |

### MaFormItem 設定詳細

フォーム項目の完全な設定オプション：

#### 基本設定

| パラメータ            | 説明                                                                                                                                                                             | 型                                                                                                 | デフォルト値     | バージョン     |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|---------|--------|
| `label`       | フォーム項目ラベル、文字列または関数の戻り値をサポート                                                                                                                                                                | `string \| (() => string)`                                                                             | -       | 1.0.0  |
| `prop`        | フォーム項目フィールド名、文字列または関数の戻り値をサポート、データバインディングとバリデーション用                                                                                                                                                                | `string \| (() => string)`                                                                             | -       | 1.0.0  |
| `hide`        | この項目を非表示にするかどうか（非表示でもデータは保持）、動的制御サポート                                                                                            | `boolean \| ((item: MaFormItem, model: Record<string, any>) => boolean)` | `false` | 1.0.0  |
| `show`        | この項目を表示するかどうか（表示しない場合はレンダリングされずデータもなし）、動的制御サポート                                                                                       | `boolean \| ((item: MaFormItem, model: Record<string, any>) => boolean)` | `true`  | 1.0.0  |

#### レイアウト設定

| パラメータ            | 説明                                                                                                                                                                             | 型                                                                                                 | デフォルト値     | バージョン     |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|---------|--------|
| `cols`        | グリッドレイアウト設定、`layout` が `flex` の場合に有効、レスポンシブ設定をサポート                                                                                                                                                  | `ColsConfiguration`                    | -       | 1.0.0  |
| `itemProps`   | Element Plus `el-form-item` のネイティブプロパティ                                                                                                                                                                            | `ElFormItemProps`                    | `{}`       | 1.0.0  |
| `itemSlots`   | Element Plus のネイティブスロット設定                                                                                                                                                                            | `Record<string, (...args: any[]) => VNode \| VNode[]>`                         | `{}`       | 1.0.0  |

#### レンダリング設定

| パラメータ            | 説明                                                                                                                                                                             | 型                                                                                                 | デフォルト値     | バージョン     |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|---------|--------|
| `render`      | レンダリングコンポーネントタイプ：Element Plus コンポーネント名（例：`'input'`, `'select'`）、Vue コンポーネント、またはレンダリング関数を設定可能 | `RenderType`                                                                            | -       | 1.0.0  |
| `renderProps` | レンダリングされるコンポーネントの props プロパティ設定                                                                                                                                                                              | `Record<string, any>`                                                                              | `{}`       | 1.0.0  |
| `renderSlots` | レンダリングされるコンポーネントのスロット設定                                                                                                                                                                       | `Record<string, (...args: any[]) => VNode \| VNode[]>`                                                                  | `{}`       | 1.0.0  |

#### ネストと条件設定

| パラメータ            | 説明                                                                                                                                                                             | 型                                                                                                 | デフォルト値     | バージョン     |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|---------|--------|
| `children`    | 子設定項目、無限ネスト対応、複雑なフォーム構造用                                                                                                                                                                 | `MaFormItem[]`                                                                                     | `[]`       | 1.0.33 |

#### バリデーション設定

| パラメータ            | 説明                                                                                                                                                                             | 型                                                                                                 | デフォルト値     | バージョン     |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|---------|--------|
| `customValidator` | カスタム同期バリデーション関数                                                                                                                                                                | `(rule: any, value: any, callback: Function) => void`                                                                                     | -       | 1.0.0 |
| `asyncValidator`  | カスタム非同期バリデーション関数                                                                                                                                                                | `(rule: any, value: any) => Promise<void>`                                                                                     | -       | 1.0.0 |

## スロットシステム

MaForm は柔軟なスロットシステムを提供し、マルチレベルのコンテンツカスタマイズをサポートします：

### グローバルスロット

| 名前              | 説明                                    | スコープ変数 | 例 |
|-----------------|---------------------------------------|----------|------|
| `default`       | デフォルトスロット、ネイティブ `<el-form-item>` タグを記述可能。使用すると設定方式は自動的に無効になります。 | - | `<ma-form><el-form-item>...</el-form-item></ma-form>` |
| `footer`        | フォームフッタースロット、送信ボタンなどの操作要素を配置するために使用 | `{ formRef, model, loading }` | `<template #footer="{ formRef }">` |
| `loading`       | カスタムローディング状態コンテンツ | `{ loading }` | `<template #loading="{ loading }">` |

### フォーム項目レベルスロット

各 `MaFormItem` は `itemSlots` 設定によるカスタムスロットをサポートします：

#### itemSlots 設定

```typescript
interface ItemSlots {
  // Element Plus el-form-item ネイティブスロット
  label?: (scope: { label: string }) => VNode | VNode[]
  error?: (scope: { error: string }) => VNode | VNode[]
  
  // MaForm 拡張スロット
  prepend?: (scope: FormItemScope) => VNode | VNode[]  // 前置コンテンツ
  append?: (scope: FormItemScope) => VNode | VNode[]   // 後置コンテンツ
  help?: (scope: FormItemScope) => VNode | VNode[]     // ヘルプ情報
}

interface FormItemScope {
  item: MaFormItem
  model: Record<string, any>
  disabled: boolean
  readonly: boolean
  size: ComponentSize
  formRef: Ref<FormInstance | undefined>
}
```

### 動的スロット命名

`prop` に基づいた動的スロット命名をサポート、フォーマット：`item-{prop}`

```vue
<ma-form :items="items">
  <!-- prop が 'username' の項目をカスタムレンダリング -->
  <template #item-username="{ item, model }">
    <el-input v-model="model[item.prop]" prefix-icon="User" />
  </template>
  
  <!-- prop が 'password' の項目のラベルをカスタマイズ -->
  <template #label-password>
    <span style="color: red;">* パスワード</span>
  </template>
</ma-form>
```

### ネストコンポーネントスロット

レンダリングされる Element Plus コンポーネントに対して、`renderSlots` でスロットを設定できます：

```tsx
const field ={
  render: 'select',
  renderSlots: {
    // el-select のデフォルトスロット
    default: () => [
      h('el-option', { label: 'オプション1', value: '1' }),
      h('el-option', { label: 'オプション2', value: '2' })
    ],
    // el-select のプレフィックススロット
    prefix: () => h('el-icon', {}, [h('Search')])
  }
}
```


## 公開メソッド (Expose)

MaForm コンポーネントは `defineExpose` を通じて豊富な API メソッドを公開し、外部からの制御とデータ操作を可能にします：

### 状態管理

| メソッド名 | 説明 | パラメータ | 戻り値 | 例 |
|-------|------|-----|-------|------|
| `setLoadingState(loading)` | フォームローディング状態を設定 | `loading: boolean` | `void` | `formRef.value.setLoadingState(true)` |
| `getLoadingState()` | 現在のローディング状態を取得 | - | `boolean` | `const loading = formRef.value.getLoadingState()` |

### 設定管理

| メソッド名 | 説明 | パラメータ | 戻り値 | 例 |
|-------|------|-----|-------|------|
| `setOptions(options)` | フォーム設定オプションを設定 | `options: Partial<MaFormOptions>` | `void` | `formRef.value.setOptions({ loading: true })` |
| `getOptions()` | 現在のフォーム設定を取得 | - | `MaFormOptions` | `const opts = formRef.value.getOptions()` |
| `updateOptions(updater)` | 更新関数で設定を変更 | `updater: (options) => MaFormOptions` | `void` | `formRef.value.updateOptions(opts => ({ ...opts, loading: false }))` |

### フォーム項目管理

| メソッド名 | 説明 | パラメータ | 戻り値 | 例 |
|-------|------|-----|-------|------|
| `setItems(items)` | フォーム項目配列を設定 | `items: MaFormItem[]` | `void` | `formRef.value.setItems(newItems)` |
| `getItems()` | 現在のフォーム項目配列を取得 | - | `MaFormItem[]` | `const items = formRef.value.getItems()` |
| `appendItem(item, index?)` | 指定位置にフォーム項目を追加 | `item: MaFormItem, index?: number` | `void` | `formRef.value.appendItem(newItem, 2)` |
| `prependItem(item)` | 先頭にフォーム項目を追加 | `item: MaFormItem` | `void` | `formRef.value.prependItem(firstItem)` |
| `removeItem(prop)` | prop に基づいてフォーム項目を削除 | `prop: string` | `boolean` | `const removed = formRef.value.removeItem('username')` |
| `updateItem(prop, updates)` | 指定フォーム項目を更新 | `prop: string, updates: Partial<MaFormItem>` | `boolean` | `formRef.value.updateItem('email', { hide: true })` |

### フォーム項目検索

| メソッド名 | 説明 | パラメータ | 戻り値 | 例 |
|-------|------|-----|-------|------|
| `getItemByProp(prop)` | prop に基づいてフォーム項目を取得 | `prop: string` | `MaFormItem \| undefined` | `const item = formRef.value.getItemByProp('username')` |
| `getItemsByCondition(condition)` | 条件に基づいてフォーム項目配列を取得 | `condition: (item) => boolean` | `MaFormItem[]` | `const hiddenItems = formRef.value.getItemsByCondition(item => item.hide)` |
| `getVisibleItems()` | すべての表示フォーム項目を取得 | - | `MaFormItem[]` | `const visible = formRef.value.getVisibleItems()` |

### フォームバリデーション

| メソッド名 | 説明 | パラメータ | 戻り値 | 例 |
|-------|------|-----|-------|------|
| `validate()` | フォーム全体をバリデーション | - | `Promise<boolean>` | `const valid = await formRef.value.validate()` |
| `validateField(prop)` | 指定フィールドをバリデーション | `prop: string` | `Promise<boolean>` | `const valid = await formRef.value.validateField('email')` |
| `resetFields(props?)` | フィールドを初期値にリセット | `props?: string[]` | `void` | `formRef.value.resetFields(['username', 'email'])` |
| `clearValidate(props?)` | バリデーション結果をクリア | `props?: string[]` | `void` | `formRef.value.clearValidate()` |

### フォームデータ

| メソッド名 | 説明 | パラメータ | 戻り値 | 例 |
|-------|------|-----|-------|------|
| `getFormData()` | フォームデータを取得 | - | `Record<string, any>` | `const data = formRef.value.getFormData()` |
| `setFormData(data)` | フォームデータを設定 | `data: Record<string, any>` | `void` | `formRef.value.setFormData({ username: 'admin' })` |
| `resetFormData()` | フォームデータを初期状態にリセット | - | `void` | `formRef.value.resetFormData()` |

### Element Plus ネイティブインスタンス

| メソッド名 | 説明 | パラメータ | 戻り値 | 例 |
|-------|------|-----|-------|------|
| `getElFormRef()` | Element Plus el-form インスタンスを取得 | - | `FormInstance \| undefined` | `const elForm = formRef.value.getElFormRef()` |

### 使用例

```vue
<template>
  <ma-form 
    ref="formRef" 
    v-model="formData" 
    :options="formOptions" 
    :items="formItems"
  />
  
  <div>
    <el-button @click="handleValidate">フォームバリデーション</el-button>
    <el-button @click="handleAddItem">項目追加</el-button>
    <el-button @click="handleToggleLoading">ローディング切替</el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const formRef = ref()
const formData = ref({})

const handleValidate = async () => {
  const isValid = await formRef.value.validate()
  console.log('フォームバリデーション結果:', isValid)
}

const handleAddItem = () => {
  formRef.value.appendItem({
    label: '新しいフィールド',
    prop: 'newField',
    render: 'input'
  })
}

const handleToggleLoading = () => {
  const currentLoading = formRef.value.getLoadingState()
  formRef.value.setLoadingState(!currentLoading)
}
</script>
```

## レイアウトシステム詳細

MaForm は 2 つのレイアウトシステムを提供し、レスポンシブデザインをサポートします：

### Flex レイアウト (デフォルト)

Element Plus の `el-row` および `el-col` コンポーネントに基づくグリッドシステム：

```typescript
const field ={
  layout: 'flex',
  flex: {
    gutter: 20,        // グリッド間隔
    type: 'flex',      // モダン flexbox モード
    justify: 'start',  // 水平方向の配置
    align: 'middle'    // 垂直方向の配置
  }
}
```

#### グリッド設定

各フォーム項目は `cols` プロパティでグリッドレイアウトを設定できます：

```typescript
const field ={
  label: 'ユーザー名',
  prop: 'username',
  render: 'input',
  cols: {
    span: 12,        // 12 グリッドを占有（合計 24 グリッド）
    offset: 0,       // 左側の間隔
    push: 0,         // 右に移動
    pull: 0,         // 左に移動
    order: 1,        // 並び順
    
    // レスポンシブ設定
    xs: 24,          // <768px で全行を占有
    sm: 12,          // ≥768px で半分を占有
    md: 8,           // ≥992px で 1/3 を占有
    lg: 6,           // ≥1200px で 1/4 を占有
    xl: 4            // ≥1920px で 1/6 を占有
  }
}
```

### Grid レイアウト

Element Plus の `el-space` コンポーネントに基づくスペースレイアウト：

```typescript
const field ={
  layout: 'grid',
  grid: {
    direction: 'vertical',  // 並び方向
    size: 'medium',         // スペースサイズ
    wrap: true,             // 折り返すかどうか
    fill: true,             // コンテナを埋めるかどうか
    fillRatio: 30,          // 埋める比率
    alignment: 'start'      // 配置方法
  }
}
```

### レスポンシブ設定

#### ブレークポイント

| ブレークポイント | デバイスタイプ | 幅の範囲 |
|------|---------|----------|
| `xs` | 超小画面 | <768px |
| `sm` | 小画面 | ≥768px |
| `md` | 中画面 | ≥992px |
| `lg` | 大画面 | ≥1200px |
| `xl` | 超大画面 | ≥1920px |

## コンポーネントレンダリングシステム

MaForm は複数のコンポーネントレンダリング方法をサポートし、柔軟な拡張機能を提供します：

### サポートされている Element Plus コンポーネント

| コンポーネント名 | レンダリング値 | 説明 | よく使う設定 |
|---------|-------|------|----------|
| `input` | `'input'` | 入力ボックス | `type`, `placeholder`, `clearable` |
| `textarea` | `'textarea'` | テキストエリア | `rows`, `autosize`, `resize` |
| `select` | `'select'` | セレクター | `multiple`, `filterable`, `remote` |
| `cascader` | `'cascader'` | カスケードセレクター | `options`, `props`, `showAllLevels` |
| `datePicker` | `'datePicker'` | 日付ピッカー | `type`, `format`, `valueFormat` |
| `timePicker` | `'timePicker'` | 時間ピッカー | `format`, `valueFormat`, `selectableRange` |
| `switch` | `'switch'` | スイッチ | `activeText`, `inactiveText`, `activeValue` |
| `checkbox` | `'checkbox'` | チェックボックス | `trueLabel`, `falseLabel` |
| `checkboxGroup` | `'checkboxGroup'` | チェックボックスグループ | `min`, `max` |
| `radio` | `'radio'` | ラジオボタン | `label`, `border` |
| `radioGroup` | `'radioGroup'` | ラジオボタングループ | `textColor`, `fill` |
| `rate` | `'rate'` | レート | `max`, `allowHalf`, `showText` |
| `slider` | `'slider'` | スライダー | `min`, `max`, `step`, `range` |
| `upload` | `'upload'` | アップロード | `action`, `headers`, `multiple` |
| `transfer` | `'transfer'` | トランスファー | `data`, `targetKeys`, `titles` |

### レンダリング方法詳細

#### 1. 文字列レンダリング

```typescript
const field ={
  label: 'ユーザー名',
  prop: 'username',
  render: 'input',                    // 文字列方式
  renderProps: {
    placeholder: 'ユーザー名を入力してください',
    clearable: true,
    prefixIcon: 'User'
  }
}
```

#### 2. コンポーネントレンダリング

```typescript
import CustomInput from './CustomInput.vue'

const field ={
  label: 'カスタムフィールド',
  prop: 'custom',
  render: CustomInput,                // コンポーネント方式
  renderProps: {
    customProp: 'value'
  }
}
```

#### 3. 関数レンダリング

```typescript
const field = {
  label: '動的レンダリング',
  prop: 'dynamic',
  render: ({ item, model, disabled }) => {
    return h('div', [
      h('el-input', {
        modelValue: model[item.prop],
        'onUpdate:modelValue': (value) => model[item.prop] = value,
        disabled,
        placeholder: '動的レンダリングされた入力ボックス'
      })
    ])
  }
}
```

#### 4. JSX/TSX レンダリング

```tsx
const field ={
  label: 'JSX レンダリング',
  prop: 'jsx',
  render: ({ item, model }) => (
    <el-input
      v-model={model[item.prop]}
      placeholder="JSX レンダリングされた入力ボックス"
      clearable
    />
  )
}
```

### 複雑なコンポーネント設定例

#### Select セレクター

```typescript
const field ={
  label: '選択項目',
  prop: 'selection',
  render: '