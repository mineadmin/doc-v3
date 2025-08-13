# MaSearch 検索コンポーネント

`ma-search` は `ma-form` をベースに構築された検索フォームコンポーネントです。豊富な設定オプション、レスポンシブレイアウト、フォームバリデーションなどの機能を提供し、管理システムの検索機能構築に最適です。

:::tip ヒント
`form` と `form-item` のパラメータは `ma-form` と同じです。詳細は [ma-form ドキュメント](ma-form) を参照してください。
:::

## クイックスタート

<DemoPreview dir="demos/ma-search/default" />

## サンプル一覧

### 基本機能
- **[基本使用法](./ma-search/examples/basic-usage)** - シンプルな検索フォームの実装
- **[高度な検索](./ma-search/examples/advanced-search)** - 複雑な検索シナリオ、JSXカスタムレンダリング対応
- **[折りたたみ検索](./ma-search/examples/collapsible-search)** - スペース節約の折りたたみ機能

### カスタマイズ拡張
- **[カスタムアクション](./ma-search/examples/custom-actions)** - カスタムボタンとスロットの使用
- **[動的管理](./ma-search/examples/dynamic-items)** - 実行時の検索項目追加・削除
- **[メソッドデモ](./ma-search/examples/methods-demo)** - 公開メソッドの詳細な使用例

### 高度な応用
- **[レスポンシブレイアウト](./ma-search/examples/responsive-layout)** - デバイスに応じた表示
- **[テーブル連携](./ma-search/examples/table-integration)** - データテーブルとの統合ソリューション
- **[フォーム検証](./ma-search/examples/form-validation)** - 各種バリデーションルールとシナリオ

## API ドキュメント

### Props

| パラメータ | 説明 | タイプ | デフォルト値 | バージョン |
|------|------|------|-------|------|
| `options` | `ma-search` コンポーネント設定 | `MaSearchOptions` | - | 1.0.0 |
| `formOptions` | `ma-form` コンポーネント設定（[ma-form Props](ma-form#props) 参照） | `MaFormOptions` | - | 1.0.0 |
| `searchItems` | 検索項目設定（[ma-form-item](ma-form#maformitem) 拡張） | `MaSearchItem[]` | - | 1.0.0 |

### MaSearchOptions

検索コンポーネントのコア設定:

| パラメータ | 説明 | タイプ | デフォルト値 | バージョン |
|------|------|------|-------|------|
| `defaultValue` | 検索フォームのデフォルト値 | `Record<string, any>` | - | 1.0.0 |
| `cols` | レスポンシブ列数設定 | `MediaBreakPoint` | `{xs: 1, sm: 2, md: 2, lg: 3, xl: 4}` | 1.0.0 |
| `fold` | 折りたたみ機能有効化 | `boolean` | `false` | 1.0.0 |
| `foldRows` | 折りたたみ時の表示行数 | `number` | `2` | 1.0.0 |
| `show` | 検索パネル表示 | `boolean` | `true` | 1.0.0 |
| `text` | ボタンテキスト設定 | `TextConfig` | - | 1.0.0 |

#### MediaBreakPoint

レスポンシブブレークポイント設定:

| パラメータ | 説明 | 画面サイズ | タイプ | デフォルト値 | バージョン |
|------|------|----------|------|-------|------|
| `xs` | 超小型画面列数 | `< 768px` | `number` | `1` | 1.0.0 |
| `sm` | 小型画面列数 | `≥ 768px` | `number` | `2` | 1.0.0 |
| `md` | 中型画面列数 | `≥ 992px` | `number` | `2` | 1.0.0 |
| `lg` | 大型画面列数 | `≥ 1200px` | `number` | `3` | 1.0.0 |
| `xl` | 超大型画面列数 | `≥ 1920px` | `number` | `4` | 1.0.0 |

#### TextConfig

ボタンテキスト設定:

| パラメータ | 説明 | タイプ | デフォルト値 | バージョン |
|------|------|------|-------|------|
| `searchBtn` | 検索ボタンテキスト | `string \| (() => string)` | `'検索'` | 1.0.0 |
| `resetBtn` | リセットボタンテキスト | `string \| (() => string)` | `'リセット'` | 1.0.0 |
| `isFoldBtn` | 展開ボタンテキスト | `string \| (() => string)` | `'展開'` | 1.0.0 |
| `notFoldBtn` | 折りたたみボタンテキスト | `string \| (() => string)` | `'折りたたみ'` | 1.0.0 |

### MaSearchItem

検索項目設定（`ma-form-item` 拡張）:

| パラメータ | 説明 | タイプ | デフォルト値 | バージョン |
|------|------|------|-------|------|
| `label` | ラベルテキスト | `string` | - | 1.0.0 |
| `prop` | フィールド名（フォームデータのキー） | `string` | - | 1.0.0 |
| `render` | レンダリング方法（文字列/関数/コンポーネント） | `string \| Function \| Component` | - | 1.0.0 |
| `options` | 選択型コンポーネントのオプション | `Array<{label: string, value: any}>` | - | 1.0.0 |
| `props` | フォームコンポーネントに渡すプロパティ | `object` | - | 1.0.0 |
| `rules` | バリデーションルール | `FormItemRule[]` | - | 1.0.0 |
| `span` | グリッドスパン（占有列数） | `number` | `1` | 1.0.0 |
| `offset` | グリッド左間隔 | `number` | `0` | 1.0.0 |
| `hide` | 項目非表示設定 | `boolean \| (() => boolean)` | `false` | 1.0.0 |

#### 組み込み render タイプ

以下のレンダリングタイプをサポート:

| タイプ | 説明 | 例 |
|------|------|------|
| `'input'` | テキスト入力 | `render: 'input'` |
| `'select'` | セレクター | `render: 'select'` |
| `'date-picker'` | 日付選択 | `render: 'date-picker'` |
| `'input-number'` | 数値入力 | `render: 'input-number'` |
| `'switch'` | スイッチ | `render: 'switch'` |
| `'radio-group'` | ラジオボタングループ | `render: 'radio-group'` |
| `'checkbox-group'` | チェックボックスグループ | `render: 'checkbox-group'` |
| `'cascader'` | カスケード選択 | `render: 'cascader'` |

### Events

| イベント名 | 説明 | パラメータ | バージョン |
|------|------|------|------|
| `search` | 検索ボタンクリック時 | `(formData: Record<string, any>) => void` | 1.0.0 |
| `reset` | リセットボタンクリック時 | `(formData: Record<string, any>) => void` | 1.0.0 |
| `fold` | 折りたたみ状態変更時 | `(state: boolean) => void` | 1.0.0 |

### Slots

| スロット名 | 説明 | パラメータ | バージョン |
|------|------|------|------|
| `default` | デフォルトスロット（`<el-form-item>` 直接記述可能） | - | 1.0.0 |
| `actions` | アクションボタン領域完全置換 | `{ searchLoading: boolean, resetLoading: boolean }` | 1.0.0 |
| `beforeActions` | アクションボタン前コンテンツ | - | 1.0.0 |
| `afterActions` | アクションボタン後コンテンツ | - | 1.0.0 |

### 公開メソッド (Expose)

| メソッド名 | 説明 | パラメータ | 戻り値 | バージョン |
|--------|------|------|-------|------|
| `getMaFormRef()` | 内部 `ma-form` 参照取得 | - | `MaFormRef` | 1.0.0 |
| `foldToggle()` | 折りたたみ状態切り替え | - | - | 1.0.0 |
| `getFold()` | 現在の折りたたみ状態取得 | - | `boolean` | 1.0.0 |
| `setSearchForm(form)` | 検索フォームデータ設定 | `form: Record<string, any>` | - | 1.0.0 |
| `getSearchForm()` | 現在の検索フォームデータ取得 | - | `Record<string, any>` | 1.0.0 |
| `setShowState(visible)` | コンポーネント表示状態設定 | `visible: boolean` | - | 1.0.0 |
| `getShowState()` | 現在の表示状態取得 | - | `boolean` | 1.0.0 |
| `setOptions(options)` | コンポーネント設定動的変更 | `options: MaSearchOptions` | - | 1.0.0 |
| `getOptions()` | 現在のコンポーネント設定取得 | - | `MaSearchOptions` | 1.0.0 |
| `setFormOptions(options)` | フォーム設定動的変更 | `options: MaFormOptions` | - | 1.0.0 |
| `getFormOptions()` | 現在のフォーム設定取得 | - | `MaFormOptions` | 1.0.0 |
| `setItems(items)` | 検索項目設定動的変更 | `items: MaSearchItem[]` | - | 1.0.0 |
| `getItems()` | 現在の検索項目設定取得 | - | `MaSearchItem[]` | 1.0.0 |
| `appendItem(item)` | 検索項目追加 | `item: MaSearchItem` | - | 1.0.0 |
| `removeItem(prop)` | 指定検索項目削除 | `prop: string` | - | 1.0.0 |
| `getItemByProp(prop)` | プロパティ名で検索項目取得 | `prop: string` | `MaSearchItem \| undefined` | 1.0.0 |

## TypeScript 型定義

```typescript
// 主要インターフェース
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

`cols` パラメータで画面サイズに応じた列数を設定:

```typescript
const searchOptions = {
  cols: {
    xs: 1,  // モバイル単列
    sm: 2,  // タブレット2列
    md: 3,  // デスクトップ3列
    lg: 4,  // 大型画面4列
    xl: 6   // 超大型画面6列
  }
}
```

### 2. 折りたたみ機能

検索項目が多い場合に折りたたみを有効化:

```typescript
const searchOptions = {
  fold: true,
  foldRows: 2,  // デフォルト2行表示
  text: {
    isFoldBtn: 'さらに条件を表示',
    notFoldBtn: '条件を一部非表示'
  }
}
```

### 3. フォーム検証

重要なフィールドに検証ルールを追加:

```typescript
const searchItems = [
  {
    label: 'メールアドレス',
    prop: 'email',
    render: 'input',
    rules: [
      { required: true, message: 'メールアドレス必須', trigger: 'blur' },
      { type: 'email', message: 'メール形式不正', trigger: 'blur' }
    ]
  }
]
```

### 4. 動的検索項目

ビジネス要件に応じて動的に項目を追加・削除:

```typescript
// 項目追加
const addSearchItem = () => {
  searchRef.value?.appendItem({
    label: '新規フィールド',
    prop: 'new_field',
    render: 'input'
  })
}

// 項目削除
const removeSearchItem = (prop: string) => {
  searchRef.value?.removeItem(prop)
}
```

### 5. テーブル連携

データテーブルと統合したデータ管理:

```typescript
const handleSearch = (searchData: any) => {
  // ページネーションを1ページ目にリセット
  pagination.page = 1
  // 検索条件保存
  searchCondition.value = searchData
  // データ読み込み
  loadTableData()
}
```

## よくある質問

### Q: 検索項目のカスタムレンダリング方法は？

A: `render` プロパティに関数またはコンポーネントを指定:

```typescript
{
  label: 'カスタム',
  prop: 'custom',
  render: () => <CustomComponent />
}
```

### Q: 条件付き表示を実装するには？

A: `hide` プロパティと関数を組み合わせ:

```typescript
{
  label: '条件フィールド',
  prop: 'conditional',
  render: 'input',
  hide: () => someCondition // trueで非表示
}
```

### Q: フォーム検証状態を取得するには？

A: `getMaFormRef()` でフォーム参照を取得:

```typescript
const validateForm = async () => {
  const formRef = searchRef.value?.getMaFormRef()
  try {
    await formRef?.validate()
    console.log('検証成功')
  } catch (error) {
    console.log('検証失敗')
  }
}
```

### Q: 検索履歴を実装するには？

A: 検索イベントを監視して条件を保存:

```typescript
const searchHistory = ref<any[]>([])

const handleSearch = (formData: any) => {
  // 履歴に追加
  searchHistory.value.unshift({
    data: formData,
    time: new Date().toLocaleString()
  })
  
  // 履歴数を制限
  if (searchHistory.value.length >