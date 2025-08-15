# MaForm

`Element plus` に基づいて二次的にカプセル化された `Form` コンポーネントで、すべてのネイティブフォームのパラメータ、イベント、スロット、書き方をサポートし、設定方式でも実現できます。
さらに、`el-row` と `el-space` に基づいたレイアウトでフォームを計画し、レスポンシブデザイン能力を備えています。

::: tip 説明
ネイティブ `el-from` のすべてのパラメータ、イベント、スロットを完全に互換性およびサポートしているため、このドキュメントでは主に拡張機能について説明します。

公式フォームパラメータについては [Element plus](https://element-plus.org/zh-CN/component/form.html) 公式ドキュメントを参照してください。
:::

## クイックスタート

### 設定方式で使用
<DemoPreview dir="demos/ma-form/config" />

### テンプレート方式で使用
<DemoPreview dir="demos/ma-form/template" />

### `コンポーネント`と`el-form-item`の`Ref`を取得
:::tip ヒント
この方法は **設定形式** 用で、`template` では自分で `ref` を定義できます
:::

<DemoPreview dir="demos/ma-form/getRef" />

## 完全な例

:::info サンプルナビゲーション
以下の例は、MaForm のさまざまな使用方法と高度な機能を展示しており、基本的な使用から複雑なシナリオアプリケーションまでをカバーしています。最適な効果を得るために順番に学習することをお勧めします。
:::

### 基本機能の例
- [基本的な使い方](/front/component/ma-form/examples/basic-usage) - 一般的なフォームコントロールの基本設定と使用方法
- [レイアウトシステム](/front/component/ma-form/examples/layout-systems) - Flex と Grid レイアウトのレスポンシブデザイン
- [コンポーネントレンダリング](/front/component/ma-form/examples/component-rendering) - サポートされているすべての Element Plus コンポーネントの展示

### 高度な機能の例
- [条件付きレンダリング](/front/component/ma-form/examples/conditional-rendering) - フォームデータに基づいたフィールド表示制御
- [動的検証](/front/component/ma-form/examples/dynamic-validation) - カスタム検証ルールと非同期検証
- [スロットシステム](/front/component/ma-form/examples/slots-examples) - マルチレベルスロットの柔軟な使用方法

### 機能デモの例
- [公開メソッド](/front/component/ma-form/examples/expose-methods) - すべての API メソッドの使用デモ
- [ローディング状態](/front/component/ma-form/examples/loading-states) - さまざまなローディングシナリオの処理方法
- [ネストされたフォーム](/front/component/ma-form/examples/nested-forms) - 複雑な階層構造のフォーム処理

### 実際のアプリケーション例
- [高度なシナリオ](/front/component/ma-form/examples/advanced-scenarios) - マルチステッププロセスと複雑なビジネスロジック
- [パフォーマンス最適化](/front/component/ma-form/examples/performance-demo) - 大規模フォームのパフォーマンス最適化戦略

## TypeScript 型定義

### コアインターフェース

#### MaFormOptions
フォーム設定オプションの完全な型定義:

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
フォームアイテム設定の完全な型定義:

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
  
  // 検証設定
  customValidator?: (rule: any, value: any, callback: Function) => void
  asyncValidator?: (rule: any, value: any) => Promise<void>
}
```

#### ColsConfiguration
レスポンシブ列設定タイプ:

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
コンポーネントレンダリング型定義:

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
コンポーネント公開メソッドの型定義:

```typescript
interface MaFormExpose {
  // 状態管理
  setLoadingState: (loading: boolean) => void
  getLoadingState: () => boolean
  
  // 設定管理
  setOptions: (options: Partial<MaFormOptions>) => void
  getOptions: () => MaFormOptions
  updateOptions: (updater: (options: MaFormOptions) => MaFormOptions) => void
  
  // フォームアイテム管理
  setItems: (items: MaFormItem[]) => void
  getItems: () => MaFormItem[]
  appendItem: (item: MaFormItem, index?: number) => void
  prependItem: (item: MaFormItem) => void
  removeItem: (prop: string) => boolean
  updateItem: (prop: string, updates: Partial<MaFormItem>) => boolean
  
  // フォームアイテムクエリ
  getItemByProp: (prop: string) => MaFormItem | undefined
  getItemsByCondition: (condition: (item: MaFormItem) => boolean) => MaFormItem[]
  getVisibleItems: () => MaFormItem[]
  
  // フォーム検証
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

| パラメータ        | 説明                             | タイプ         | デフォルト値 | バージョン    |
|-----------|--------------------------------|-------------------|-------|-------|
| `v-model` | フォームデータ、双方向バインディング、レスポンシブ更新をサポート | `Record<string, any>` | `{}` | 1.0.0 |
| `options` | フォーム設定オプション、Element Plus ネイティブプロパティと拡張プロパティを含む | `MaFormOptions` | `{}` | 1.0.0 |
| `items`   | フォームアイテム設定配列、ネストと動的設定をサポート | `MaFormItem[]` | `[]` | 1.0.0 |
| `loading` | グローバルローディング状態、options.loading より優先度が高い | `boolean` | `false` | 1.0.0 |
| `disabled` | グローバル無効状態、options.disabled より優先度が高い | `boolean` | `false` | 1.0.0 |

### MaFormOptions 拡張設定

::: tip 説明
これらは `ma-form` の `el-form` に対する拡張パラメータで、Element Plus ネイティブパラメータと完全に互換性があります。
:::

| パラメータ        | 説明                                                                    | タイプ                                                                                              | デフォルト値      | バージョン    |
|-----------|-----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|----------|-------|
| `containerClass` | フォームコンテナのカスタムクラス名、スタイルカスタマイズ用                                                   | `string`                                                                                        | -        | 1.0.0 |
| `loading` | ローディングアニメーションを表示するかどうか、グローバルとローカルのローディング状態をサポート                                               | `boolean`                                                                                       | `false`  | 1.0.0 |
| `loadingConfig` | ローディングアニメーションの詳細設定オプション                                                             | [LoadingConfig](#loadingconfig-設定)                                                               | `{}`     | 1.0.0 |
| `layout` | レイアウト方法：`flex` はグリッドシステムを使用、`grid` は間隔レイアウトを使用                                    | `'flex' \| 'grid'`                                                                              | `flex`   | 1.0.0 |
| `flex` | flex レイアウト設定、`el-row` コンポーネントに基づく                                            | `ElRowProps`                                                                                    | `{}`     | 1.0.0 |
| `grid` | grid レイアウト設定、`el-space` コンポーネントに基づく                                          | `ElSpaceProps`                                                                                  | `{}`     | 1.0.0 |
| `footerSlot` | 設定型フッタースロット、VNode または VNode 配列を返すことが可能                                        | `() => VNode \| VNode[]`                                                                        | -        | 1.0.0 |

#### LoadingConfig 設定

ローディングアニメーションの詳細設定オプション:

| パラメータ        | 説明      | タイプ   | デフォルト値 | バージョン    |
|-----------|----------|------|-----|-------|
| `text` | ローディングアイコンの下に表示されるローディングテキスト   | `string`  | `'ローディング中...'`   | 1.0.0 |
| `spinner` | カスタムローディングアイコンクラス名   | `string` | -   | 1.0.0 |
| `svg` | カスタム SVG ローディングアイコン   | `string` | -   | 1.0.0 |
| `viewBox` | SVG アイコンの viewBox 属性   | `string` | -   | 1.0.0 |
| `background` | 背景マスクの色   | `string` | `'rgba(0, 0, 0, 0.8)'`   | 1.0.0 |
| `customClass` | カスタムスタイルクラス名   | `string` | -   | 1.0.0 |
| `lock` | スクロールをロックするかどうか   | `boolean` | `true`   | 1.0.0 |
| `fullscreen` | 全画面表示するかどうか   | `boolean` | `false`   | 1.0.0 |

### MaFormItem 設定詳細

フォームアイテムの完全な設定オプション:

#### 基本設定

| パラメータ            | 説明                                                                                                                                                                             | タイプ                                                                                                 | デフォルト値     | バージョン     |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|---------|--------|
| `label`       | フォームアイテムラベル、文字列または関数の戻り値をサポート                                                                                                                                                                | `string \| (() => string)`                                                                             | -       | 1.0.0  |
| `prop`        | フォームアイテムフィールド名、文字列または関数の戻り値をサポート、データバインディングと検証用                                                                                                                                                                | `string \| (() => string)`                                                                             | -       | 1.0.0  |
| `hide`        | このアイテムを非表示にするかどうか（非表示だがデータは保持）、動的制御をサポート                                                                                            | `boolean \| ((item: MaFormItem, model: Record<string, any>) => boolean)` | `false` | 1.0.0  |
| `show`        | このアイテムを表示するかどうか（表示しない場合はレンダリングされずデータもない）、動的制御をサポート                                                                                       | `boolean \| ((item: MaFormItem, model: Record<string, any>) => boolean)` | `true`  | 1.0.0  |

#### レイアウト設定

| パラメータ            | 説明                                                                                                                                                                             | タイプ                                                                                                 | デフォルト値     | バージョン     |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|---------|--------|
| `cols`        | グリッドレイアウト設定、`layout` が `flex` の場合に有効、レスポンシブ設定をサポート                                                                                                                                                  | `ColsConfiguration`                    | -       | 1.0.0  |
| `itemProps`   | Element Plus `el-form-item` のネイティブプロパティ                                                                                                                                                                            | `ElFormItemProps`                    | `{}`       | 1.0.0  |
| `itemSlots`   | Element Plus `el-form-item` のネイティブスロット設定                                                                                                                                                                            | `Record<string, (...args: any[]) => VNode \| VNode[]>`                         | `{}`       | 1.0.0  |

#### レンダリング設定

| パラメータ            | 説明                                                                                                                                                                             | タイプ                                                                                                 | デフォルト値     | バージョン     |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|---------|--------|
| `render`      | レンダリングコンポーネントタイプ：Element Plus コンポーネント名（例：`'input'`, `'select'`）、Vue コンポーネント、またはレンダリング関数を設定可能 | `RenderType`                                                                            | -       | 1.0.0  |
| `renderProps` | レンダリングされるコンポーネントの props プロパティ設定                                                                                                                                                                              | `Record<string, any>`                                                                              | `{}`       | 1.0.0  |
| `renderSlots` | レンダリングされるコンポーネントのスロット設定                                                                                                                                                                       | `Record<string, (...args: any[]) => VNode \| VNode[]>`                                                                  | `{}`       | 1.0.0  |

#### ネストと条件設定

| パラメータ            | 説明                                                                                                                                                                             | タイプ                                                                                                 | デフォルト値     | バージョン     |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|---------|--------|
| `children`    | 子設定アイテム、無限ネストをサポート、複雑なフォーム構造用                                                                                                                                                                 | `MaFormItem[]`                                                                                     | `[]`       | 1.0.33 |

#### 検証設定

| パラメータ            | 説明                                                                                                                                                                             | タイプ                                                                                                 | デフォルト値    