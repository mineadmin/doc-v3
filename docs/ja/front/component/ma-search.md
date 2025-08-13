# MaSearch 検索コンポーネント

`ma-search` は `ma-form` をベースに構築された検索フォームを素早く作成するためのコンポーネントです。豊富な設定オプション、レスポンシブレイアウト、フォーム検証などの機能を提供し、管理システムの検索機能構築に最適です。

:::tip ヒント
`form` と `form-item` のパラメータは `ma-form` と同じです。詳細な設定については [ma-form ドキュメント](ma-form) を参照してください。
:::

## クイックスタート

<DemoPreview dir="demos/ma-search/default" />

## サンプル集

### 基本機能
- **[基本使用法](./ma-search/examples/basic-usage)** - 最もシンプルな検索フォームの実装
- **[高度な検索](./ma-search/examples/advanced-search)** - 複雑な検索シナリオ、JSXカスタムレンダリング対応
- **[折りたたみ検索](./ma-search/examples/collapsible-search)** - スペース節約の折りたたみ機能

### カスタム拡張
- **[カスタム操作](./ma-search/examples/custom-actions)** - カスタム操作ボタンとスロットの使用
- **[動的管理](./ma-search/examples/dynamic-items)** - 実行時の動的な検索項目の追加・削除
- **[メソッドデモ](./ma-search/examples/methods-demo)** - 公開メソッドの詳細な使用方法

### 高度な応用
- **[レスポンシブレイアウト](./ma-search/examples/responsive-layout)** - 異なるデバイスでの適応表示
- **[テーブル統合](./ma-search/examples/table-integration)** - データテーブルとの完全な統合ソリューション
- **[フォーム検証](./ma-search/examples/form-validation)** - 各種検証ルールとシナリオのデモ

## API ドキュメント

### Props

| パラメータ | 説明 | タイプ | デフォルト値 | バージョン |
|------|------|------|-------|------|
| `options` | `ma-search` コンポーネント設定オプション | `MaSearchOptions` | - | 1.0.0 |
| `formOptions` | `ma-form` コンポーネント設定オプション、詳細は [ma-form Props](ma-form#props) 参照 | `MaFormOptions` | - | 1.0.0 |
| `searchItems` | 検索フォーム項目設定、[ma-form-item](ma-form#maformitem) を拡張 | `MaSearchItem[]` | - | 1.0.0 |

### MaSearchOptions

検索コンポーネントのコア設定オプション：

| パラメータ | 説明 | タイプ | デフォルト値 | バージョン |
|------|------|------|-------|------|
| `defaultValue` | 検索フォームのデフォルト値設定 | `Record<string, any>` | - | 1.0.0 |
| `cols` | レスポンシブ列数設定、異なる画面サイズに対応 | `MediaBreakPoint` | `{xs: 1, sm: 2, md: 2, lg: 3, xl: 4}` | 1.0.0 |
| `fold` | 折りたたみ機能を有効にするか | `boolean` | `false` | 1.0.0 |
| `foldRows` | 折りたたみ後の表示行数 | `number` | `2` | 1.0.0 |
| `show` | 検索パネルを表示するか | `boolean` | `true` | 1.0.0 |
| `text` | ボタンテキスト設定 | `TextConfig` | - | 1.0.0 |

#### MediaBreakPoint

レスポンシブブレークポイント設定、異なる画面サイズでの列数を定義：

| パラメータ | 説明 | 画面サイズ | タイプ | デフォルト値 | バージョン |
|------|------|----------|------|-------|------|
| `xs` | 超小型画面の表示列数 | `< 768px` | `number` | `1` | 1.0.0 |
| `sm` | 小型画面の表示列数 | `≥ 768px` | `number` | `2` | 1.0.0 |
| `md` | 中型画面の表示列数 | `≥ 992px` | `number` | `2` | 1.0.0 |
| `lg` | 大型画面の表示列数 | `≥ 1200px` | `number` | `3` | 1.0.0 |
| `xl` | 超大型画面の表示列数 | `≥ 1920px` | `number` | `4` | 1.0.0 |

#### TextConfig

ボタンテキスト設定：

| パラメータ | 説明 | タイプ | デフォルト値 | バージョン |
|------|------|------|-------|------|
| `searchBtn` | 検索ボタンテキスト | `string \| (() => string)` | `'検索'` | 1.0.0 |
| `resetBtn` | リセットボタンテキスト | `string \| (() => string)` | `'リセット'` | 1.0.0 |
| `isFoldBtn` | 展開ボタンテキスト | `string \| (() => string)` | `'展開'` | 1.0.0 |
| `notFoldBtn` | 折りたたみボタンテキスト | `string \| (() => string)` | `'折りたたみ'` | 1.0.0 |

### MaSearchItem

検索フォーム項目設定、`ma-form-item` を拡張：

| パラメータ | 説明 | タイプ | デフォルト値 | バージョン |
|------|------|------|-------|------|
| `label` | ラベルテキスト | `string` | - | 1.0.0 |
| `prop` | フィールド名、フォームデータのキー名に対応 | `string` | - | 1.0.0 |
| `render` | レンダリング方法、文字列または関数をサポート | `string \| Function \| Component` | - | 1.0.0 |
| `options` | 選択型コンポーネントのオプションデータ | `Array<{label: string, value: any}>` | - | 1.0.0 |
| `props` | フォームコンポーネントに渡すプロパティ | `object` | - | 1.0.0 |
| `rules` | 検証ルール | `FormItemRule[]` | - | 1.0.0 |
| `span` | グリッドスパン、フォーム項目が占める列数 | `number` | `1` | 1.0.0 |
| `offset` | グリッド左側の間隔数 | `number` | `0` | 1.0.0 |
| `hide` | このフォーム項目を非表示にするか | `boolean \| (() => boolean)` | `false` | 1.0.0 |

#### 組み込み render タイプ

以下の組み込みレンダリングタイプをサポート：

| タイプ | 説明 | 例 |
|------|------|------|
| `'input'` | テキスト入力ボックス | `render: 'input'` |
| `'select'` | セレクター | `render: 'select'` |
| `'date-picker'` | 日付ピッカー | `render: 'date-picker'` |
| `'input-number'` | 数値入力ボックス | `render: 'input-number'` |
| `'switch'` | スイッチ | `render: 'switch'` |
| `'radio-group'` | ラジオボタングループ | `render: 'radio-group'` |
| `'checkbox-group'` | チェックボックスグループ | `render: 'checkbox-group'` |
| `'cascader'` | カスケードセレクター | `render: 'cascader'` |

### Events

| 名前 | 説明 | パラメータ | バージョン |
|------|------|------|------|
| `search` | 検索ボタンクリック時にトリガー | `(formData: Record<string, any>) => void` | 1.0.0 |
| `reset` | リセットボタンクリック時にトリガー | `(formData: Record<string, any>) => void` | 1.0.0 |
| `fold` | 折りたたみ状態変更時にトリガー | `(state: boolean) => void` | 1.0.0 |

### Slots

| 名前 | 説明 | パラメータ | バージョン |
|------|------|------|------|
| `default` | デフォルトスロット、ネイティブタグ `<el-form-item>` を記述可能、使用後は設定方法が自動的に無効化 | - | 1.0.0 |
| `actions` | 操作ボタン領域を完全に置き換え | `{ searchLoading: boolean, resetLoading: boolean }` | 1.0.0 |
| `beforeActions` | 操作ボタンの前にコンテンツを挿入 | - | 1.0.0 |
| `afterActions` | 操作ボタンの後にコンテンツを追加 | - | 1.0.0 |

### 公開メソッド (Expose)

| メソッド名 | 説明 | パラメータ | 戻り値 | バージョン |
|--------|------|------|-------|------|
| `getMaFormRef()` | 内部 `ma-form` コンポーネント参照を取得 | - | `MaFormRef` | 1.0.0 |
| `foldToggle()` | 折りたたみ状態を切り替え | - | - | 1.0.0 |
| `getFold()` | 現在の折りたたみ状態を取得 | - | `boolean` | 1.0.0 |
| `setSearchForm(form)` | 検索フォームデータを設定 | `form: Record<string, any>` | - | 1.0.0 |
| `getSearchForm()` | 現在の検索フォームデータを取得 | - | `Record<string, any>` | 1.0.0 |
| `setShowState(visible)` | 検索コンポーネントの表示状態を設定 | `visible: boolean` | - | 1.0.0 |
| `getShowState()` | 現在の表示状態を取得 | - | `boolean` | 1.0.0 |
| `setOptions(options)` | コンポーネント設定を動的に設定 | `options: MaSearchOptions` | - | 1.0.0 |
| `getOptions()` | 現在のコンポーネント設定を取得 | - | `MaSearchOptions` | 1.0.0 |
| `setFormOptions(options)` | フォーム設定を動的に設定 | `options: MaFormOptions` | - | 1.0.0 |
| `getFormOptions()` | 現在のフォーム設定を取得 | - | `MaFormOptions` | 1.0.0 |
| `setItems(items)` | 検索項目設定を動的に設定 | `items: MaSearchItem[]` | - | 1.0.0 |
| `getItems()` | 現在の検索項目設定を取得 | - | `MaSearchItem[]` | 1.0.0 |
| `appendItem(item)` | 単一の検索項目を追加 | `item: MaSearchItem` | - | 1.0.0 |
| `removeItem(prop)` | 指定した検索項目を削除 | `prop: string` | - | 1.0.0 |
| `getItemByProp(prop)` | プロパティ名で検索項目を取得 | `prop: string` | `MaSearchItem \| undefined` | 1.0.0 |

## TypeScript 型定義

```typescript
// 主要インターフェース定義
interface MaSearchOptions {
  defaultValue?: Record<string, any>
  cols?: MediaBreakPoint
  fold?: boolean
  foldRows?: number
  show?: boolean
  text?: TextConfig
}

interface MediaBreakPoint {
  xs?: number  // < 768px
  sm?: number  // ≥ 768px
  md?: number  // ≥ 992px
  lg?: number  // ≥ 1200px
  xl?: number  // ≥ 1920px
}

interface TextConfig {
  searchBtn?: string | (() => string)
  resetBtn?: string | (() => string)
  isFoldBtn?: string | (() => string)
  notFoldBtn?: string | (() => string)
}

interface MaSearchItem {
  label: string
  prop: string
  render: string | Function | Component
  options?: Array<{label: string, value: any}>
  props?: Record<string, any>
  rules?: FormItemRule[]
  span?: number
  offset?: number
  hide?: boolean | (() => boolean)
}

// コンポーネントインスタンスタイプ
interface MaSearchInstance {
  getMaFormRef(): MaFormRef
  foldToggle(): void
  getFold(): boolean
  setSearchForm(form: Record<string, any>): void
  getSearchForm(): Record<string, any>
  setShowState(visible: boolean): void
  getShowState(): boolean
  setOptions(options: MaSearchOptions): void
  getOptions(): MaSearchOptions
  setFormOptions(options: MaFormOptions): void
  getFormOptions(): MaFormOptions
  setItems(items: MaSearchItem[]): void
  getItems(): MaSearchItem[]
  appendItem(item: MaSearchItem): void
  removeItem(prop: string): void
  getItemByProp(prop: string): MaSearchItem | undefined
}
```

## ベストプラクティス

### 1. レスポンシブデザイン

`cols` パラメータを適切に設定して異なる画面サイズに対応：

```typescript
const searchOptions = {
  cols: {
    xs: 1,  // モバイル端末で1列
    sm: 2,  // タブレットで2列
    md: 3,  // デスクトップで3列
    lg: 4,  // 大型画面で4列
    xl: 6   // 超大型画面で6列
  }
}
```

### 2. 折りたたみ機能

検索項目が多い場合、折りたたみ機能を有効に：

```typescript
const searchOptions = {
  fold: true,
  foldRows: 2,  // デフォルトで2行表示
  text: {
    isFoldBtn: 'さらに条件を表示',
    notFoldBtn: '一部条件を非表示'
  }
}
```

### 3. フォーム検証

重要なフィールドに検証ルールを追加：

```typescript
const searchItems = [
  {
    label: 'メールアドレス',
    prop: 'email',
    render: 'input',
    rules: [
      { required: true, message: 'メールアドレスは必須です', trigger: 'blur' },
      { type: 'email', message: 'メールアドレス形式が正しくありません', trigger: 'blur' }
    ]
  }
]
```

### 4. 動的フォーム項目

業務要件に基づいて検索項目を動的に追加・削除：

```typescript
// 検索項目を追加
const addSearchItem = () => {
  searchRef.value?.appendItem({
    label: '新規フィールド',
    prop: 'new_field',
    render: 'input'
  })
}

// 検索項目を削除
const removeSearchItem = (prop: string) => {
  searchRef.value?.removeItem(prop)
}
```

### 5. テーブルとの統合

データテーブルと組み合わせて完全なデータ管理を実現：

```typescript
const handleSearch = (searchData: any) => {
  // ページネーションを1ページ目にリセット
  pagination.page = 1
  // 検索条件を保存
  searchCondition.value = searchData
  // データを読み込み
  loadTableData()
}
```

## よくある質問

### Q: フォーム項目のレンダリングをカスタマイズするには？

A: `render` プロパティに関数またはコンポーネントを渡す：

```typescript
{
  label: 'カスタム',
  prop: 'custom',
  render: () => <CustomComponent />
}
```

### Q: 検索項目の条件表示を実装するには？

A: `hide` プロパティと関数を組み合わせる：

```typescript
{
  label: '条件フィールド',
  prop: 'conditional',
  render: 'input',
  hide: () => someCondition // true を返すと非表示
}
```

### Q: フォーム検証状態を取得するには？

A: `getMaFormRef()` 