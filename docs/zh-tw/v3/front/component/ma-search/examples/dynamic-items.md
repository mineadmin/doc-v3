# 動態管理搜尋項

展示所有程式設計式管理方法的使用，包括新增、刪除、修改搜尋項等操作，適用於需要根據業務邏輯動態調整搜尋條件的場景。

## 動態管理演示

<DemoPreview dir="demos/ma-search/dynamic-items" />

## 動態管理方法

### 新增搜尋項
使用 `appendItem` 方法動態新增新的搜尋項：

```typescript
// 新增單個搜尋項
const addSearchItem = () => {
  searchRef.value?.appendItem({
    label: '新欄位',
    prop: 'new_field',
    render: 'input',
    props: {
      placeholder: '請輸入新欄位值'
    }
  })
}
```

### 刪除搜尋項
使用 `removeItem` 方法移除指定的搜尋項：

```typescript
// 刪除指定搜尋項
const removeSearchItem = (prop: string) => {
  searchRef.value?.removeItem(prop)
}
```

### 批次設定搜尋項
使用 `setItems` 方法一次性設定所有搜尋項：

```typescript
// 批次更新搜尋項
const updateAllItems = () => {
  const newItems = [
    { label: '使用者名稱', prop: 'username', render: 'input' },
    { label: '狀態', prop: 'status', render: 'select', options: statusOptions }
  ]
  searchRef.value?.setItems(newItems)
}
```

### 獲取搜尋項資訊
使用各種獲取方法查詢當前搜尋項配置：

```typescript
// 獲取所有搜尋項
const allItems = searchRef.value?.getItems()

// 獲取特定搜尋項
const userItem = searchRef.value?.getItemByProp('username')

// 檢查搜尋項是否存在
const hasUserItem = !!searchRef.value?.getItemByProp('username')
```

## 使用場景

### 1. 許可權控制
根據使用者許可權動態顯示不同的搜尋條件：

```typescript
// 管理員顯示所有搜尋項，普通使用者顯示部分搜尋項
if (userRole === 'admin') {
  searchRef.value?.appendItem({
    label: '建立人',
    prop: 'creator',
    render: 'select',
    options: userOptions
  })
}
```

### 2. 業務場景切換
根據業務場景切換不同的搜尋條件組合：

```typescript
// 切換業務場景
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

### 3. 條件依賴關係
實現搜尋條件之間的依賴關係：

```typescript
// 當選擇某個分類時，動態新增子分類搜尋項
const onCategoryChange = (categoryId: string) => {
  if (categoryId) {
    searchRef.value?.appendItem({
      label: '子分類',
      prop: 'subcategory',
      render: 'select',
      options: getSubcategories(categoryId)
    })
  } else {
    searchRef.value?.removeItem('subcategory')
  }
}
```

## 關鍵特性

- 🔧 完整的 CRUD 操作支援
- 🔄 實時的搜尋項管理
- 📊 豐富的查詢和檢索方法
- 🎯 支援複雜的業務邏輯
- ⚡ 高效能的動態更新機制

## 高階用法

### 搜尋項模板系統
建立可重用的搜尋項模板：

```typescript
// 定義搜尋項模板
const templates = {
  userSearch: [
    { label: '使用者名稱', prop: 'username', render: 'input' },
    { label: '郵箱', prop: 'email', render: 'input' },
    { label: '狀態', prop: 'status', render: 'select', options: statusOptions }
  ],
  orderSearch: [
    { label: '訂單號', prop: 'order_no', render: 'input' },
    { label: '訂單狀態', prop: 'order_status', render: 'select', options: orderStatusOptions },
    { label: '下單時間', prop: 'created_at', render: 'date-picker' }
  ]
}

// 應用模板
const applyTemplate = (templateName: string) => {
  const template = templates[templateName]
  if (template) {
    searchRef.value?.setItems([...template])
  }
}
```

### 動態驗證規則
根據搜尋項動態新增驗證規則：

```typescript
const addItemWithValidation = (item: any) => {
  // 為某些欄位新增驗證規則
  if (item.prop === 'email') {
    item.rules = [
      { required: true, message: '郵箱不能為空', trigger: 'blur' },
      { type: 'email', message: '郵箱格式不正確', trigger: 'blur' }
    ]
  }
  
  searchRef.value?.appendItem(item)
}
```

## 最佳實踐

### 1. 狀態管理
建議使用狀態管理庫（如 Pinia）來管理複雜的搜尋項狀態：

```typescript
// 使用 Pinia store 管理搜尋項
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

### 2. 效能最佳化
在頻繁動態更新搜尋項時，使用防抖技術最佳化效能：

```typescript
import { debounce } from 'lodash-es'

// 防抖更新搜尋項
const updateItemsDebounced = debounce((items: any[]) => {
  searchRef.value?.setItems(items)
}, 300)
```

### 3. 資料持久化
將動態建立的搜尋項配置儲存到本地儲存：

```typescript
// 儲存搜尋項配置
const saveSearchConfig = () => {
  const items = searchRef.value?.getItems()
  localStorage.setItem('searchConfig', JSON.stringify(items))
}

// 恢復搜尋項配置
const restoreSearchConfig = () => {
  const savedConfig = localStorage.getItem('searchConfig')
  if (savedConfig) {
    const items = JSON.parse(savedConfig)
    searchRef.value?.setItems(items)
  }
}
```

## 相關連結

- [方法演示](./methods-demo) - 瞭解所有暴露方法的詳細使用
- [自定義操作](./custom-actions) - 瞭解自定義操作按鈕
- [高階搜尋](./advanced-search) - 瞭解複雜搜尋場景的實現