# 表格整合

展示與資料表格的完整整合方案，包含搜尋、分頁、排序、表格/卡片檢視切換等功能，是構建完整資料管理介面的最佳實踐。

## 表格整合演示

<DemoPreview dir="demos/ma-search/table-integration" />

## 整合方案說明

### 搜尋與表格聯動
實現搜尋條件與表格資料的實時同步：

```typescript
// 搜尋處理函式
const handleSearch = (searchData: any) => {
  // 重置分頁到第一頁
  pagination.page = 1
  // 儲存搜尋條件
  searchCondition.value = { ...searchData }
  // 重新載入表格資料
  loadTableData()
}

// 重置處理函式  
const handleReset = () => {
  // 清空搜尋條件
  searchCondition.value = {}
  // 重置分頁
  pagination.page = 1
  // 重新載入表格資料
  loadTableData()
}
```

### 分頁整合
搜尋與分頁系統的完整整合：

```typescript
// 分頁配置
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 分頁改變處理
const handlePageChange = (page: number) => {
  pagination.page = page
  loadTableData()
}

// 頁碼大小改變處理
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1  // 重置到第一頁
  loadTableData()
}
```

### 資料載入邏輯
統一的資料載入和狀態管理：

```typescript
// 資料載入函式
const loadTableData = async () => {
  try {
    loading.value = true
    
    // 構建請求引數
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchCondition.value  // 包含搜尋條件
    }
    
    // 呼叫API
    const response = await fetchTableData(params)
    
    // 更新資料
    tableData.value = response.data
    pagination.total = response.total
    
  } catch (error) {
    console.error('資料載入失敗:', error)
  } finally {
    loading.value = false
  }
}
```

## 使用場景

### 1. 使用者管理系統
完整的使用者資料管理介面：

```typescript
// 使用者搜尋項配置
const userSearchItems = [
  { label: '使用者名稱', prop: 'username', render: 'input' },
  { label: '郵箱', prop: 'email', render: 'input' },
  { label: '狀態', prop: 'status', render: 'select', options: statusOptions },
  { label: '註冊時間', prop: 'created_at', render: 'date-picker' }
]

// 使用者表格列配置
const userTableColumns = [
  { prop: 'username', label: '使用者名稱' },
  { prop: 'email', label: '郵箱' },
  { prop: 'status', label: '狀態' },
  { prop: 'created_at', label: '註冊時間' }
]
```

### 2. 訂單管理系統
訂單資料的查詢和展示：

```typescript
// 訂單搜尋配置
const orderSearchItems = [
  { label: '訂單號', prop: 'order_no', render: 'input' },
  { label: '訂單狀態', prop: 'status', render: 'select', options: orderStatusOptions },
  { label: '客戶姓名', prop: 'customer', render: 'input' },
  { label: '下單時間', prop: 'order_date', render: 'date-range-picker' }
]
```

### 3. 商品管理系統
商品資訊的篩選和管理：

```typescript
// 商品搜尋配置
const productSearchItems = [
  { label: '商品名稱', prop: 'name', render: 'input' },
  { label: '商品分類', prop: 'category', render: 'cascader', options: categoryOptions },
  { label: '價格區間', prop: 'price_range', render: 'input-number-range' },
  { label: '上架狀態', prop: 'status', render: 'radio-group', options: productStatusOptions }
]
```

## 高階功能

### 檢視切換
支援表格檢視和卡片檢視的切換：

```typescript
// 檢視模式管理
const viewMode = ref<'table' | 'card'>('table')

// 檢視切換處理
const switchView = (mode: 'table' | 'card') => {
  viewMode.value = mode
  // 可以根據檢視模式調整分頁大小
  if (mode === 'card') {
    pagination.pageSize = 12  // 卡片檢視顯示更多項
  } else {
    pagination.pageSize = 10  // 表格檢視標準分頁
  }
  loadTableData()
}
```

### 排序整合
搜尋條件與表格排序的聯動：

```typescript
// 排序狀態管理
const sortConfig = reactive({
  prop: '',
  order: ''
})

// 排序改變處理
const handleSortChange = ({ prop, order }: any) => {
  sortConfig.prop = prop
  sortConfig.order = order
  // 重新載入資料，包含排序引數
  loadTableData()
}

// 在資料載入函式中包含排序引數
const params = {
  page: pagination.page,
  pageSize: pagination.pageSize,
  sortBy: sortConfig.prop,
  sortOrder: sortConfig.order,
  ...searchCondition.value
}
```

### 批次操作
結合搜尋和表格選擇的批次操作：

```typescript
// 選擇狀態管理
const selection = ref<any[]>([])

// 批次操作處理
const handleBatchOperation = async (operation: string) => {
  if (selection.value.length === 0) {
    ElMessage.warning('請選擇要操作的資料')
    return
  }
  
  try {
    const ids = selection.value.map(item => item.id)
    await batchOperation(operation, ids)
    
    // 操作完成後重新載入資料
    await loadTableData()
    selection.value = []
    
    ElMessage.success('批次操作成功')
  } catch (error) {
    ElMessage.error('批次操作失敗')
  }
}
```

## 關鍵特性

- 🔗 完整的搜尋與表格聯動
- 📄 智慧的分頁整合
- 🔄 靈活的檢視切換
- 📊 強大的排序功能
- ⚡ 高效能的資料載入
- 📱 響應式的移動端適配

## 效能最佳化

### 防抖搜尋
對搜尋輸入進行防抖處理：

```typescript
import { debounce } from 'lodash-es'

// 防抖搜尋處理
const debouncedSearch = debounce((searchData: any) => {
  handleSearch(searchData)
}, 300)

// 在搜尋元件中使用防抖
const onSearchInput = (searchData: any) => {
  debouncedSearch(searchData)
}
```

### 資料快取
實現搜尋結果的智慧快取：

```typescript
// 快取配置
const searchCache = new Map()

// 快取鍵生成
const getCacheKey = (params: any) => {
  return JSON.stringify(params)
}

// 帶快取的資料載入
const loadTableDataWithCache = async () => {
  const params = {
    page: pagination.page,
    pageSize: pagination.pageSize,
    ...searchCondition.value
  }
  
  const cacheKey = getCacheKey(params)
  
  // 檢查快取
  if (searchCache.has(cacheKey)) {
    const cachedData = searchCache.get(cacheKey)
    tableData.value = cachedData.data
    pagination.total = cachedData.total
    return
  }
  
  // 載入新資料
  const response = await fetchTableData(params)
  
  // 儲存到快取
  searchCache.set(cacheKey, {
    data: response.data,
    total: response.total
  })
  
  tableData.value = response.data
  pagination.total = response.total
}
```

## 最佳實踐

### 1. 狀態同步
確保搜尋狀態與URL引數同步：

```typescript
// URL引數同步
const syncUrlParams = () => {
  const params = new URLSearchParams()
  
  // 同步分頁引數
  params.set('page', pagination.page.toString())
  params.set('pageSize', pagination.pageSize.toString())
  
  // 同步搜尋條件
  Object.entries(searchCondition.value).forEach(([key, value]) => {
    if (value) {
      params.set(key, value as string)
    }
  })
  
  // 更新URL
  window.history.replaceState({}, '', `${window.location.pathname}?${params}`)
}
```

### 2. 錯誤處理
完善的錯誤處理和使用者反饋：

```typescript
const handleError = (error: any, context: string) => {
  console.error(`${context}失敗:`, error)
  
  // 使用者友好的錯誤提示
  const errorMessage = error.response?.data?.message || '操作失敗，請稍後重試'
  ElMessage.error(errorMessage)
  
  // 錯誤上報（可選）
  if (process.env.NODE_ENV === 'production') {
    reportError(error, context)
  }
}
```

### 3. 載入狀態管理
細粒度的載入狀態控制：

```typescript
// 不同操作的載入狀態
const loadingStates = reactive({
  table: false,
  search: false,
  export: false,
  batch: false
})

// 統一的載入狀態管理
const withLoading = async (key: keyof typeof loadingStates, operation: () => Promise<any>) => {
  try {
    loadingStates[key] = true
    return await operation()
  } finally {
    loadingStates[key] = false
  }
}
```

## 相關連結

- [響應式佈局](./responsive-layout) - 瞭解在不同裝置下的表格顯示最佳化
- [表單驗證](./form-validation) - 瞭解搜尋條件的驗證處理
- [方法演示](./methods-demo) - 瞭解元件方法在表格整合中的應用