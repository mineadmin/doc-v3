# 動的な検索項目管理

すべてのプログラム的管理方法の使用法を紹介します。検索項目の追加、削除、変更などの操作を含み、ビジネスロジックに応じて検索条件を動的に調整する必要があるシナリオに適しています。

## 動的管理デモ

<DemoPreview dir="demos/ma-search/dynamic-items" />

## 動的管理方法

### 検索項目の追加
`appendItem` メソッドを使用して、動的に新しい検索項目を追加します：

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
`removeItem` メソッドを使用して、指定された検索項目を削除します：

```typescript
// 指定された検索項目を削除
const removeSearchItem = (prop: string) => {
  searchRef.value?.removeItem(prop)
}
```

### 検索項目の一括設定
`setItems` メソッドを使用して、すべての検索項目を一度に設定します：

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
各種取得メソッドを使用して、現在の検索項目設定を照会します：

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
ユーザー権限に応じて、異なる検索条件を動的に表示します：

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

### 2. ビジネスシナリオの切り替え
ビジネスシナリオに応じて、異なる検索条件の組み合わせを切り替えます：

```typescript
// ビジネスシナリオを切り替え
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

### 3. 条件の依存関係
検索条件間の依存関係を実現します：

```typescript
// 特定のカテゴリを選択した場合、動的にサブカテゴリ検索項目を追加
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

## 主な特徴

- 🔧 完全な CRUD 操作サポート
- 🔄 リアルタイムな検索項目管理
- 📊 豊富なクエリおよび検索メソッド
- 🎯 複雑なビジネスロジックのサポート
- ⚡ 高性能な動的更新メカニズム

## 高度な使用法

### 検索項目テンプレートシステム
再利用可能な検索項目テンプレートを作成します：

```typescript
// 検索項目テンプレートの定義
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

// テンプレートの適用
const applyTemplate = (templateName: string) => {
  const template = templates[templateName]
  if (template) {
    searchRef.value?.setItems([...template])
  }
}
```

### 動的検証ルール
検索項目に応じて動的に検証ルールを追加します：

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
複雑な検索項目の状態を管理するために、状態管理ライブラリ（Pinia など）の使用を推奨します：

```typescript
// Pinia store を使用した検索項目の管理
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
検索項目を頻繁に動的更新する場合、デバウンス技術を使用してパフォーマンスを最適化します：

```typescript
import { debounce } from 'lodash-es'

// デバウンスによる検索項目の更新
const updateItemsDebounced = debounce((items: any[]) => {
  searchRef.value?.setItems(items)
}, 300)
```

### 3. データの永続化
動的に作成された検索項目設定をローカルストレージに保存します：

```typescript
// 検索項目設定の保存
const saveSearchConfig = () => {
  const items = searchRef.value?.getItems()
  localStorage.setItem('searchConfig', JSON.stringify(items))
}

// 検索項目設定の復元
const restoreSearchConfig = () => {
  const savedConfig = localStorage.getItem('searchConfig')
  if (savedConfig) {
    const items = JSON.parse(savedConfig)
    searchRef.value?.setItems(items)
  }
}
```

## 関連リンク

- [メソッドデモ](./methods-demo) - すべての公開メソッドの詳細な使用法について
- [カスタム操作](./custom-actions) - カスタム操作ボタンについて
- [高度な検索](./advanced-search) - 複雑な検索シナリオの実装について