# MaSearch 検索コンポーネント

`ma-search` は `ma-form` をベースにカプセル化され、検索フォームを素早く構築するために使用されます。豊富な設定オプション、レスポンシブレイアウト、フォームバリデーションなどの機能を提供し、管理システムの検索機能構築に最適です。

:::tip ヒント
`form` と `form-item` は `ma-form` のパラメータと同じです。詳細な設定は [ma-form ドキュメント](ma-form) を参照してください。
:::

## クイックスタート

<DemoPreview dir="demos/ma-search/default" />

## サンプル一覧

### 基本機能
- **[基本的な使い方](./ma-search/examples/basic-usage)** - 最もシンプルな検索フォーム実装
- **[高度な検索](./ma-search/examples/advanced-search)** - 複雑な検索シナリオ、JSXカスタムレンダリング対応
- **[折りたたみ検索](./ma-search/examples/collapsible-search)** - スペースを節約する折りたたみ展開機能

### カスタム拡張
- **[カスタム操作](./ma-search/examples/custom-actions)** - カスタム操作ボタンとスロットの使用
- **[動的管理](./ma-search/examples/dynamic-items)** - 実行時に検索項目を動的に追加・削除
- **[メソッドデモ](./ma-search/examples/methods-demo)** - すべての公開メソッドの詳細な使用例

### 高度なアプリケーション
- **[レスポンシブレイアウト](./ma-search/examples/responsive-layout)** - 異なるデバイスでの自動適応表示
- **[テーブル連携](./ma-search/examples/table-integration)** - データテーブルとの完全な連携ソリューション
- **[フォームバリデーション](./ma-search/examples/form-validation)** - 様々なバリデーションルールとシナリオのデモ

## API ドキュメント

### Props

| パラメータ | 説明 | 型 | デフォルト値 | バージョン |
|-----------|------|------|-----------|----------|
| `options` | `ma-search` コンポーネントの設定オプション | `MaSearchOptions` | - | 1.0.0 |
| `formOptions` | `ma-form` コンポーネントの設定オプション、詳細は [ma-form Props](ma-form#props) を参照 | `MaFormOptions` | - | 1.0.0 |
| `searchItems` | 検索フォーム項目設定、[ma-form-item](ma-form#maformitem) を拡張 | `MaSearchItem[]` | - | 1.0.0 |

### MaSearchOptions

検索コンポーネントのコア設定オプション：

| パラメータ | 説明 | 型 | デフォルト値 | バージョン |
|-----------|------|------|-----------|----------|
| `defaultValue` | 検索フォームのデフォルト値設定 | `Record<string, any>` | - | 1.0.0 |
| `cols` | レスポンシブ列数設定、異なる画面サイズに対応 | `MediaBreakPoint` | `{xs: 1, sm: 2, md: 2, lg: 3, xl: 4}` | 1.0.0 |
| `fold` | 折りたたみ機能を有効にするかどうか | `boolean` | `false` | 1.0.0 |
| `foldRows` | 折りたたみ後に表示する行数 | `number` | `2` | 1.0.0 |
| `show` | 検索パネルを表示するかどうか | `boolean` | `true` | 1.0.0 |
| `text` | ボタン文言の設定 | `TextConfig` | - | 1.0.0 |

#### MediaBreakPoint

レスポンシブブレークポイント設定、異なる画面サイズでの列数を定義：

| パラメータ | 説明 | 画面サイズ | 型 | デフォルト値 | バージョン |
|-----------|------|----------|------|-----------|----------|
| `xs` | 超小画面表示列数 | `< 768px` | `number` | `1` | 1.0.0 |
| `sm` | 小画面表示列数 | `≥ 768px` | `number` | `2` | 1.0.0 |
| `md` | 中画面表示列数 | `≥ 992px` | `number` | `2` | 1.0.0 |
| `lg` | 大画面表示列数 | `≥ 1200px` | `number` | `3` | 1.0.0 |
| `xl` | 超大画面表示列数 | `≥ 1920px` | `number` | `4` | 1.0.0 |

#### TextConfig

ボタン文言設定：

| パラメータ | 説明 | 型 | デフォルト値 | バージョン |
|-----------|------|------|-----------|----------|
| `searchBtn` | 検索ボタン文言 | `string \| (() => string)` | `'検索'` | 1.0.0 |
| `resetBtn` | リセットボタン文言 | `string \| (() => string)` | `'リセット'` | 1.0.0 |
| `isFoldBtn` | 展開ボタン文言 | `string \| (() => string)` | `'展開'` | 1.0.0 |
| `notFoldBtn` | 折りたたみボタン文言 | `string \| (() => string)` | `'折りたたみ'` | 1.0.0 |

### MaSearchItem

検索フォーム項目設定、`ma-form-item` を拡張：

| パラメータ | 説明 | 型 | デフォルト値 | バージョン |
|-----------|------|------|-----------|----------|
| `label` | ラベルテキスト | `string` | - | 1.0.0 |
| `prop` | フィールド名、フォームデータのキー名に対応 | `string` | - | 1.0.0 |
| `render` | レンダリング方法、文字列または関数に対応 | `string \| Function \| Component` | - | 1.0.0 |
| `options` | 選択系コンポーネントのオプションデータ | `Array<{label: string, value: any}>` | - | 1.0.0 |
| `props` | フォームコンポーネントに渡すプロパティ | `object` | - | 1.0.0 |
| `rules` | バリデーションルール | `FormItemRule[]` | - | 1.0.0 |
| `span` | グリッドスパン、フォーム項目が占める列数 | `number` | `1` | 1.0.0 |
| `offset` | グリッド左側の間隔数 | `number` | `0` | 1.0.0 |
| `hide` | このフォーム項目を非表示にするかどうか | `boolean \| (() => boolean)` | `false` | 1.0.0 |

#### 内蔵 render タイプ

以下の内蔵レンダリングタイプに対応：

| タイプ | 説明 | 例 |
|-------|------|-----|
| `'input'` | テキスト入力ボックス | `render: 'input'` |
| `'select'` | セレクター | `render: 'select'` |
| `'date-picker'` | 日付セレクター | `render: 'date-picker'` |
| `'input-number'` | 数字入力ボックス | `render: 'input-number'` |
| `'switch'` | スイッチ | `render: 'switch'` |
| `'radio-group'` | ラジオグループ | `render: 'radio-group'` |
| `'checkbox-group'` | チェックボックスグループ | `render: 'checkbox-group'` |
| `'cascader'` | カスケードセレクター | `render: 'cascader'` |

### Events

| 名前 | 説明 | パラメータ | バージョン |
|------|------|----------|----------|
| `search` | 検索ボタンクリック時に発火 | `(formData: Record<string, any>) => void` | 1.0.0 |
| `reset` | リセットボタンクリック時に発火 | `(formData: Record<string, any>) => void` | 1.0.0 |
| `fold` | 折りたたみ状態が変更されたときに発火 | `(state: boolean) => void` | 1.0.0 |

### Slots

| 名前 | 説明 | パラメータ | バージョン |
|------|------|----------|----------|
| `default` | デフォルトスロット、ネイティブタグ `<el-form-item>` を記述可能。使用すると設定方式が自動的に無効になります | - | 1.0.0 |
| `actions` | 操作ボタン領域を完全に置き換え | `{ searchLoading: boolean, resetLoading: boolean }` | 1.0.0 |
| `beforeActions` | 操作ボタンの前に内容を挿入 | - | 1.0.0 |
| `afterActions` | 操作ボタンの後に内容を追加 | - | 1.0.0 |

### 公開メソッド (Expose)

| メソッド名 | 説明 | パラメータ | 戻り値 | バージョン |
|-----------|------|----------|-------|----------|
| `getMaFormRef()` | 内部 `ma-form` コンポーネントの参照を取得 | - | `MaFormRef` | 1.0.0 |
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
| `removeItem(prop)` | 指定された検索項目を削除 | `prop: string` | - | 1.0.0 |
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

// コンポーネントインスタンス型
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

異なる画面サイズに適応するよう `cols` パラメータを適切に設定：

```typescript
const searchOptions = {
  cols: {
    xs: 1,  // モバイル端末は1列
    sm: 2,  // タブレットは2列
    md: 3,  // デスクトップは3列
    lg: 4,  // 大画面は4列
    xl: 6   // 超大型画面は6列
  }
}
```

### 2. 折りたたみ機能

検索項目が多い場合は、折りたたみ機能の有効化を推奨：

```typescript
const searchOptions = {
  fold: true,
  foldRows: 2,  // デフォルトで2行表示
  text: {
    isFoldBtn: 'さらに条件を展開',
    notFoldBtn: '一部の条件を折りたたむ'
  }
}
```

### 3. フォームバリデーション

重要なフィールドにバリデーションルールを追加：

```typescript
const searchItems = [
  {
    label: 'メール',
    prop: 'email',
    render: 'input',
    rules: [
      { required: true, message: 'メールアドレスは必須です', trigger: 'blur' },
      { type: 'email', message: 'メールアドレスの形式が正しくありません', trigger: 'blur' }
    ]
  }
]
```

### 4. 動的フォーム項目

ビジネス要件に応じて検索項目を動的に追加・削除：

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

### 5. テーブルとの連携

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

A: `render` プロパティに関数やコンポーネントを渡すことで実現できます：

```typescript
{
  label: 'カスタム',
  prop: 'custom',
  render: () => <CustomComponent />
}
```

### Q: 検索項目の条件付き表示を実現するには？

A: `hide` プロパティを関数と組み合わせて使用します：

```typescript
{
  label: '条件付きフィールド',
  prop: 'conditional',
  render: 'input',
  hide: () => someCondition // trueを返すと非表示
}
```

### Q: フォームのバリデーション状態を取得するには？

A: `getMaFormRef()` でフォーム参照を取得します：

```typescript
const validateForm = async () => {
  const formRef = searchRef.value?.getMaFormRef()
  try {
    await formRef?.validate()
    console.log('バリデーション成功')
  } catch (error) {
    console.log('バリデーション失敗')
  }
}
```

### Q: 検索履歴を実装するには？

A: 検索イベントを監視し、検索条件を保存します：

```typescript
const searchHistory = ref<any[]>([])

const handleSearch = (formData: any) => {
  // 履歴に追加
  searchHistory.value.unshift({
    data: formData,
    time: new Date().toLocaleString()
  })
  
  // 履歴数を制限
  if (searchHistory.value.length > 10) {
    searchHistory.value = searchHistory.value.slice(0, 10)
  }
}
```

## 更新履歴

### v1.0.27 (最新)
- 🎉 フォームバリデーション対応を追加
- 🐛 特定の状況でのレスポンシブレイアウト表示問題を修正
- ⚡️ パフォーマンスを最適化、不要な再レンダリングを削減
- 📝 TypeScript 型定義を充実

### v1.0.20
- 🎉 動的検索項目管理機能を追加
- 🎉 より多くの内蔵 render タイプを追加
- 🐛 折りたたみ状態でのスタイル問題を修正

### v1.0.15
- 🎉 初回バージョン公開
- ✨ 基本検索機能をサポート
- ✨ レスポンシブレイアウトをサポート
- ✨ 折りたたみパネルをサポート