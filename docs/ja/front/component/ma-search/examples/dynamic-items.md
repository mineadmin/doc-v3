# 動的な検索項目管理

すべてのプログラム的な管理方法の使用を表示し、検索項目の追加、削除、変更などの操作を含み、業務ロジックに基づいて検索条件を動的に調整する必要があるシナリオに適用されます。

## 動的管理デモ

<DemoPreview dir="demos/ma-search/dynamic-items" />

## 動的管理方法

### 検索項目の追加
`appendItem` メソッドを使用して新しい検索項目を動的に追加:

```typescript
// 単一の検索項目を追加
const addSearchItem = () => {
  searchRef.value?.appendItem({
    label: '新規フィールド',
    prop: 'new_field',
    render: 'input',
    props: {
      placeholder: '新規フィールド値を入力してください'
    }
  })
}
```

### 検索項目の削除
`removeItem` メソッドを使用して指定した検索項目を削除:

```typescript
// 指定した検索項目を削除
const removeSearchItem = (prop: string) => {
  searchRef.value?.removeItem(prop)
}
```

### 検索項目の一括設定
`setItems` メソッドを使用してすべての検索項目を一度に設定:

```typescript
// 検索項目を一括更新
const updateAllItems = () => {
  const newItems = [
    { label: 'ユーザー名', prop: 'username', render: 'input' },
    { label: 'ステータス', prop: 'status', render: 'select', options: statusOptions }
  ]
  searchRef.value?.setItems(newItems)
}
```

### 検索項目情報の取得
各種取得メソッドを使用して現在の検索項目構成をクエリ:

```typescript
// すべての検索項目を取得
const allItems = searchRef.value?.getItems()

// 特定の検索項目を取得
const userItem = searchRef.value?.getItemByProp('username')

// 検索項目の存在を確認
const hasUserItem = !!searchRef.value?.getItemByProp('username')
```

## 使用シナリオ

### 1. 権限制御
ユーザー権限に基づいて異なる検索条件を動的に表示:

```typescript
// 管理者はすべての検索項目を表示、一般ユーザーは一部の検索項目を表示
if (userRole === 'admin') {
  searchRef.value?.appendItem({
    label: '作成者',
    prop: 'creator',
    render: 'select',
    options: userOptions
  })
}
```

### 2. 業務シナリオ切り替え
業務シナリオに応じて異なる検索条件の組み合わせを切り替え:

```typescript
// 業務シナリオを切り替え
const switchScenario = (scenario: string) => {
  let items = []
  switch (scenario) {
    case 'order':
      items = orderSearchItems
      break
    case 'user':
      items = userSearchItems
      break
    case 'product':
      items = productSearchItems
      break
  }
  searchRef.value?.setItems(items)
}
```

### 3. 条件依存関係
検索条件間の依存関係を実現:

```typescript
// 特定のカテゴリを選択した場合、サブカテゴリ検索項目を動的に追加
const onCategoryChange = (categoryId: string) => {
  if (categoryId) {
    searchRef.value?.appendItem({
      label: 'サブカテゴリ',
      prop: 'subcategory',
      render: 'select',
      options: getSubcategories(categoryId)
    })
  } else {
    searchRef.value?.removeItem('subcategory')
  }
}
```

## 主要機能

- 🔧 完全なCRUD操作サポート
- 🔄 リアルタイムの検索項目管理
- 📊 豊富なクエリと検索方法
- 🎯 複雑な業務ロジックのサポート
- ⚡ 高性能な動的更新メカニズム

## 高度な使用方法

### 検索項目テンプレートシステム
再利用可能な検索項目テンプレートを作成:

```typescript
// 検索項目テンプレートを定義
const templates = {
  userSearch: [
    { label: 'ユーザー名', prop: 'username', render: 'input' },
    { label: 'メール', prop: 'email', render: 'input' },
    { label: 'ステータス', prop: 'status', render: 'select', options: statusOptions }
  ],
  orderSearch: [
    { label: '注文番号', prop: 'order_no', render: 'input' },
    { label: '注文ステータス', prop: 'order_status', render: 'select', options: orderStatusOptions },
    { label: '注文日時', prop: 'created_at', render: 'date-picker' }
  ]
}

// テンプレートを適用
const applyTemplate = (templateName: string) => {
  const template = templates[templateName]
  if (template) {
    searchRef.value?.setItems([...template])
  }
}
```

### 動的検証ルール
検索項目に基づいて動的に検証ルールを追加:

```typescript
const addItemWithValidation = (item: any) => {
  // 特定のフィールドに検証ルールを追加
  if (item.prop === 'email') {
    item.rules = [
      { required: true, message: 'メールは必須です', trigger: 'blur' },
      { type: 'email', message: 'メール形式が正しくありません', trigger: 'blur' }
    ]
  }
  
  searchRef.value?.appendItem(item)
}
```

## ベストプラクティス

### 1. 状態管理
複雑な検索項目の状態を管理するために状態管理ライブラリ（Piniaなど）を使用することを推奨:

```typescript
// Piniaストアを使用して検索項目を管理
const useSearchStore = defineStore('search', () => {
  const searchItems = ref([])
  
  const addItem = (item: any) => {
    searchItems.value.push(item)
    searchRef.value?.setItems(searchItems.value)
  }
  
  const removeItem = (prop: string) => {
    searchItems.value = searchItems.value.filter(item => item.prop !== prop)
    searchRef.value?.setItems(searchItems.value)
  }
  
  return { searchItems, addItem, removeItem }
})
```

### 2. パフォーマンス最適化
頻繁に検索項目を動的に更新する場合、デバウンス技術を使用してパフォーマンスを最適化:

```typescript
import { debounce } from 'lodash-es'

// 検索項目の更新をデバウンス
const updateItemsDebounced = debounce((items: any[]) => {
  searchRef.value?.setItems(items)
}, 300)
```

### 3. データ永続化
動的に作成された検索項目構成をローカルストレージに保存:

```typescript
// 検索項目構成を保存
const saveSearchConfig = () => {
  const items = searchRef.value?.getItems()
  localStorage.setItem('searchConfig', JSON.stringify(items))
}

// 検索項目構成を復元
const restoreSearchConfig = () => {
  const savedConfig = localStorage.getItem('searchConfig')
  if (savedConfig) {
    const items = JSON.parse(savedConfig)
    searchRef.value?.setItems(items)
  }
}
```

## 関連リンク

- [メソッドデモ](./methods-demo) - すべての公開メソッドの詳細な使用方法を確認
- [カスタム操作](./custom-actions) - カスタム操作ボタンについて学ぶ
- [高度な検索](./advanced-search) - 複雑な検索シナリオの実装を理解