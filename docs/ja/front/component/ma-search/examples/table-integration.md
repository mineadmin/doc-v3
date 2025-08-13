# テーブル統合

データテーブルとの完全な統合ソリューションを展示し、検索、ページネーション、ソート、テーブル/カードビューの切り替えなどの機能を含み、完全なデータ管理インターフェースを構築するためのベストプラクティスを提供します。

## テーブル統合デモ

<DemoPreview dir="demos/ma-search/table-integration" />

## 統合ソリューション説明

### 検索とテーブルの連動
検索条件とテーブルデータのリアルタイム同期を実現：

```typescript
// 検索処理関数
const handleSearch = (searchData: any) => {
  // ページネーションを最初のページにリセット
  pagination.page = 1
  // 検索条件を保存
  searchCondition.value = { ...searchData }
  // テーブルデータを再読み込み
  loadTableData()
}

// リセット処理関数  
const handleReset = () => {
  // 検索条件をクリア
  searchCondition.value = {}
  // ページネーションをリセット
  pagination.page = 1
  // テーブルデータを再読み込み
  loadTableData()
}
```

### ページネーション統合
検索とページネーションシステムの完全な統合：

```typescript
// ページネーション設定
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// ページ変更処理
const handlePageChange = (page: number) => {
  pagination.page = page
  loadTableData()
}

// ページサイズ変更処理
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1  // 最初のページにリセット
  loadTableData()
}
```

### データ読み込みロジック
統一されたデータ読み込みと状態管理：

```typescript
// データ読み込み関数
const loadTableData = async () => {
  try {
    loading.value = true
    
    // リクエストパラメータを構築
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchCondition.value  // 検索条件を含む
    }
    
    // APIを呼び出し
    const response = await fetchTableData(params)
    
    // データを更新
    tableData.value = response.data
    pagination.total = response.total
    
  } catch (error) {
    console.error('データ読み込み失敗:', error)
  } finally {
    loading.value = false
  }
}
```

## 使用シナリオ

### 1. ユーザー管理システム
完全なユーザーデータ管理インターフェース：

```typescript
// ユーザー検索項目設定
const userSearchItems = [
  { label: 'ユーザー名', prop: 'username', render: 'input' },
  { label: 'メールアドレス', prop: 'email', render: 'input' },
  { label: 'ステータス', prop: 'status', render: 'select', options: statusOptions },
  { label: '登録日時', prop: 'created_at', render: 'date-picker' }
]

// ユーザーテーブル列設定
const userTableColumns = [
  { prop: 'username', label: 'ユーザー名' },
  { prop: 'email', label: 'メールアドレス' },
  { prop: 'status', label: 'ステータス' },
  { prop: 'created_at', label: '登録日時' }
]
```

### 2. 注文管理システム
注文データの検索と表示：

```typescript
// 注文検索設定
const orderSearchItems = [
  { label: '注文番号', prop: 'order_no', render: 'input' },
  { label: '注文ステータス', prop: 'status', render: 'select', options: orderStatusOptions },
  { label: '顧客名', prop: 'customer', render: 'input' },
  { label: '注文日時', prop: 'order_date', render: 'date-range-picker' }
]
```

### 3. 商品管理システム
商品情報のフィルタリングと管理：

```typescript
// 商品検索設定
const productSearchItems = [
  { label: '商品名', prop: 'name', render: 'input' },
  { label: '商品カテゴリ', prop: 'category', render: 'cascader', options: categoryOptions },
  { label: '価格範囲', prop: 'price_range', render: 'input-number-range' },
  { label: '公開ステータス', prop: 'status', render: 'radio-group', options: productStatusOptions }
]
```

## 高度な機能

### ビュー切り替え
テーブルビューとカードビューの切り替えをサポート：

```typescript
// ビューモード管理
const viewMode = ref<'table' | 'card'>('table')

// ビュー切り替え処理
const switchView = (mode: 'table' | 'card') => {
  viewMode.value = mode
  // ビューモードに応じてページサイズを調整
  if (mode === 'card') {
    pagination.pageSize = 12  // カードビューでより多くの項目を表示
  } else {
    pagination.pageSize = 10  // テーブルビューの標準ページネーション
  }
  loadTableData()
}
```

### ソート統合
検索条件とテーブルソートの連動：

```typescript
// ソート状態管理
const sortConfig = reactive({
  prop: '',
  order: ''
})

// ソート変更処理
const handleSortChange = ({ prop, order }: any) => {
  sortConfig.prop = prop
  sortConfig.order = order
  // ソートパラメータを含めてデータを再読み込み
  loadTableData()
}

// データ読み込み関数にソートパラメータを含める
const params = {
  page: pagination.page,
  pageSize: pagination.pageSize,
  sortBy: sortConfig.prop,
  sortOrder: sortConfig.order,
  ...searchCondition.value
}
```

### バッチ操作
検索とテーブル選択を組み合わせたバッチ操作：

```typescript
// 選択状態管理
const selection = ref<any[]>([])

// バッチ操作処理
const handleBatchOperation = async (operation: string) => {
  if (selection.value.length === 0) {
    ElMessage.warning('操作するデータを選択してください')
    return
  }
  
  try {
    const ids = selection.value.map(item => item.id)
    await batchOperation(operation, ids)
    
    // 操作後にデータを再読み込み
    await loadTableData()
    selection.value = []
    
    ElMessage.success('バッチ操作が成功しました')
  } catch (error) {
    ElMessage.error('バッチ操作が失敗しました')
  }
}
```

## 主要特性

- 🔗 完全な検索とテーブルの連動
- 📄 インテリジェントなページネーション統合
- 🔄 柔軟なビュー切り替え
- 📊 強力なソート機能
- ⚡ 高性能なデータ読み込み
- 📱 レスポンシブなモバイル対応

## パフォーマンス最適化

### デバウンス検索
検索入力にデバウンス処理を適用：

```typescript
import { debounce } from 'lodash-es'

// デバウンス検索処理
const debouncedSearch = debounce((searchData: any) => {
  handleSearch(searchData)
}, 300)

// 検索コンポーネントでデバウンスを使用
const onSearchInput = (searchData: any) => {
  debouncedSearch(searchData)
}
```

### データキャッシュ
検索結果のインテリジェントなキャッシュを実現：

```typescript
// キャッシュ設定
const searchCache = new Map()

// キャッシュキー生成
const getCacheKey = (params: any) => {
  return JSON.stringify(params)
}

// キャッシュ付きデータ読み込み
const loadTableDataWithCache = async () => {
  const params = {
    page: pagination.page,
    pageSize: pagination.pageSize,
    ...searchCondition.value
  }
  
  const cacheKey = getCacheKey(params)
  
  // キャッシュをチェック
  if (searchCache.has(cacheKey)) {
    const cachedData = searchCache.get(cacheKey)
    tableData.value = cachedData.data
    pagination.total = cachedData.total
    return
  }
  
  // 新しいデータを読み込み
  const response = await fetchTableData(params)
  
  // キャッシュに保存
  searchCache.set(cacheKey, {
    data: response.data,
    total: response.total
  })
  
  tableData.value = response.data
  pagination.total = response.total
}
```

## ベストプラクティス

### 1. 状態同期
検索状態とURLパラメータの同期を確保：

```typescript
// URLパラメータ同期
const syncUrlParams = () => {
  const params = new URLSearchParams()
  
  // ページネーションパラメータを同期
  params.set('page', pagination.page.toString())
  params.set('pageSize', pagination.pageSize.toString())
  
  // 検索条件を同期
  Object.entries(searchCondition.value).forEach(([key, value]) => {
    if (value) {
      params.set(key, value as string)
    }
  })
  
  // URLを更新
  window.history.replaceState({}, '', `${window.location.pathname}?${params}`)
}
```

### 2. エラー処理
完全なエラー処理とユーザーフィードバック：

```typescript
const handleError = (error: any, context: string) => {
  console.error(`${context}失敗:`, error)
  
  // ユーザーフレンドリーなエラーメッセージ
  const errorMessage = error.response?.data?.message || '操作が失敗しました。後ほど再試行してください'
  ElMessage.error(errorMessage)
  
  // エラー報告（オプション）
  if (process.env.NODE_ENV === 'production') {
    reportError(error, context)
  }
}
```

### 3. ローディング状態管理
きめ細かいローディング状態制御：

```typescript
// 異なる操作のローディング状態
const loadingStates = reactive({
  table: false,
  search: false,
  export: false,
  batch: false
})

// 統一されたローディング状態管理
const withLoading = async (key: keyof typeof loadingStates, operation: () => Promise<any>) => {
  try {
    loadingStates[key] = true
    return await operation()
  } finally {
    loadingStates[key] = false
  }
}
```

## 関連リンク

- [レスポンシブレイアウト](./responsive-layout) - 異なるデバイスでのテーブル表示最適化について
- [フォームバリデーション](./form-validation) - 検索条件のバリデーション処理について
- [メソッドデモ](./methods-demo) - テーブル統合におけるコンポーネントメソッドの応用について