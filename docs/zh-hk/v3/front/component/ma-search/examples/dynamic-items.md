# 動態管理搜索項

展示所有編程式管理方法的使用，包括添加、刪除、修改搜索項等操作，適用於需要根據業務邏輯動態調整搜索條件的場景。

## 動態管理演示

<DemoPreview dir="demos/ma-search/dynamic-items" />

## 動態管理方法

### 添加搜索項
使用 `appendItem` 方法動態添加新的搜索項：

```typescript
// 添加單個搜索項
const addSearchItem = () => {
  searchRef.value?.appendItem({
    label: '新字段',
    prop: 'new_field',
    render: 'input',
    props: {
      placeholder: '請輸入新字段值'
    }
  })
}
```

### 刪除搜索項
使用 `removeItem` 方法移除指定的搜索項：

```typescript
// 刪除指定搜索項
const removeSearchItem = (prop: string) => {
  searchRef.value?.removeItem(prop)
}
```

### 批量設置搜索項
使用 `setItems` 方法一次性設置所有搜索項：

```typescript
// 批量更新搜索項
const updateAllItems = () => {
  const newItems = [
    { label: '用户名', prop: 'username', render: 'input' },
    { label: '狀態', prop: 'status', render: 'select', options: statusOptions }
  ]
  searchRef.value?.setItems(newItems)
}
```

### 獲取搜索項信息
使用各種獲取方法查詢當前搜索項配置：

```typescript
// 獲取所有搜索項
const allItems = searchRef.value?.getItems()

// 獲取特定搜索項
const userItem = searchRef.value?.getItemByProp('username')

// 檢查搜索項是否存在
const hasUserItem = !!searchRef.value?.getItemByProp('username')
```

## 使用場景

### 1. 權限控制
根據用户權限動態顯示不同的搜索條件：

```typescript
// 管理員顯示所有搜索項，普通用户顯示部分搜索項
if (userRole === 'admin') {
  searchRef.value?.appendItem({
    label: '創建人',
    prop: 'creator',
    render: 'select',
    options: userOptions
  })
}
```

### 2. 業務場景切換
根據業務場景切換不同的搜索條件組合：

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
實現搜索條件之間的依賴關係：

```typescript
// 當選擇某個分類時，動態添加子分類搜索項
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

- 🔧 完整的 CRUD 操作支持
- 🔄 實時的搜索項管理
- 📊 豐富的查詢和檢索方法
- 🎯 支持複雜的業務邏輯
- ⚡ 高性能的動態更新機制

## 高級用法

### 搜索項模板系統
創建可重用的搜索項模板：

```typescript
// 定義搜索項模板
const templates = {
  userSearch: [
    { label: '用户名', prop: 'username', render: 'input' },
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
根據搜索項動態添加驗證規則：

```typescript
const addItemWithValidation = (item: any) => {
  // 為某些字段添加驗證規則
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
建議使用狀態管理庫（如 Pinia）來管理複雜的搜索項狀態：

```typescript
// 使用 Pinia store 管理搜索項
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

### 2. 性能優化
在頻繁動態更新搜索項時，使用防抖技術優化性能：

```typescript
import { debounce } from 'lodash-es'

// 防抖更新搜索項
const updateItemsDebounced = debounce((items: any[]) => {
  searchRef.value?.setItems(items)
}, 300)
```

### 3. 數據持久化
將動態創建的搜索項配置保存到本地存儲：

```typescript
// 保存搜索項配置
const saveSearchConfig = () => {
  const items = searchRef.value?.getItems()
  localStorage.setItem('searchConfig', JSON.stringify(items))
}

// 恢復搜索項配置
const restoreSearchConfig = () => {
  const savedConfig = localStorage.getItem('searchConfig')
  if (savedConfig) {
    const items = JSON.parse(savedConfig)
    searchRef.value?.setItems(items)
  }
}
```

## 相關鏈接

- [方法演示](./methods-demo) - 瞭解所有暴露方法的詳細使用
- [自定義操作](./custom-actions) - 瞭解自定義操作按鈕
- [高級搜索](./advanced-search) - 瞭解複雜搜索場景的實現