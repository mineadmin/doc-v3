# 表格集成

展示與數據表格的完整集成方案，包含搜索、分頁、排序、表格/卡片視圖切換等功能，是構建完整數據管理界面的最佳實踐。

## 表格集成演示

<DemoPreview dir="demos/ma-search/table-integration" />

## 集成方案説明

### 搜索與表格聯動
實現搜索條件與表格數據的實時同步：

```typescript
// 搜索處理函數
const handleSearch = (searchData: any) => {
  // 重置分頁到第一頁
  pagination.page = 1
  // 保存搜索條件
  searchCondition.value = { ...searchData }
  // 重新加載表格數據
  loadTableData()
}

// 重置處理函數  
const handleReset = () => {
  // 清空搜索條件
  searchCondition.value = {}
  // 重置分頁
  pagination.page = 1
  // 重新加載表格數據
  loadTableData()
}
```

### 分頁集成
搜索與分頁系統的完整集成：

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

### 數據加載邏輯
統一的數據加載和狀態管理：

```typescript
// 數據加載函數
const loadTableData = async () => {
  try {
    loading.value = true
    
    // 構建請求參數
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchCondition.value  // 包含搜索條件
    }
    
    // 調用API
    const response = await fetchTableData(params)
    
    // 更新數據
    tableData.value = response.data
    pagination.total = response.total
    
  } catch (error) {
    console.error('數據加載失敗:', error)
  } finally {
    loading.value = false
  }
}
```

## 使用場景

### 1. 用户管理系統
完整的用户數據管理界面：

```typescript
// 用户搜索項配置
const userSearchItems = [
  { label: '用户名', prop: 'username', render: 'input' },
  { label: '郵箱', prop: 'email', render: 'input' },
  { label: '狀態', prop: 'status', render: 'select', options: statusOptions },
  { label: '註冊時間', prop: 'created_at', render: 'date-picker' }
]

// 用户表格列配置
const userTableColumns = [
  { prop: 'username', label: '用户名' },
  { prop: 'email', label: '郵箱' },
  { prop: 'status', label: '狀態' },
  { prop: 'created_at', label: '註冊時間' }
]
```

### 2. 訂單管理系統
訂單數據的查詢和展示：

```typescript
// 訂單搜索配置
const orderSearchItems = [
  { label: '訂單號', prop: 'order_no', render: 'input' },
  { label: '訂單狀態', prop: 'status', render: 'select', options: orderStatusOptions },
  { label: '客户姓名', prop: 'customer', render: 'input' },
  { label: '下單時間', prop: 'order_date', render: 'date-range-picker' }
]
```

### 3. 商品管理系統
商品信息的篩選和管理：

```typescript
// 商品搜索配置
const productSearchItems = [
  { label: '商品名稱', prop: 'name', render: 'input' },
  { label: '商品分類', prop: 'category', render: 'cascader', options: categoryOptions },
  { label: '價格區間', prop: 'price_range', render: 'input-number-range' },
  { label: '上架狀態', prop: 'status', render: 'radio-group', options: productStatusOptions }
]
```

## 高級功能

### 視圖切換
支持表格視圖和卡片視圖的切換：

```typescript
// 視圖模式管理
const viewMode = ref<'table' | 'card'>('table')

// 視圖切換處理
const switchView = (mode: 'table' | 'card') => {
  viewMode.value = mode
  // 可以根據視圖模式調整分頁大小
  if (mode === 'card') {
    pagination.pageSize = 12  // 卡片視圖顯示更多項
  } else {
    pagination.pageSize = 10  // 表格視圖標準分頁
  }
  loadTableData()
}
```

### 排序集成
搜索條件與表格排序的聯動：

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
  // 重新加載數據，包含排序參數
  loadTableData()
}

// 在數據加載函數中包含排序參數
const params = {
  page: pagination.page,
  pageSize: pagination.pageSize,
  sortBy: sortConfig.prop,
  sortOrder: sortConfig.order,
  ...searchCondition.value
}
```

### 批量操作
結合搜索和表格選擇的批量操作：

```typescript
// 選擇狀態管理
const selection = ref<any[]>([])

// 批量操作處理
const handleBatchOperation = async (operation: string) => {
  if (selection.value.length === 0) {
    ElMessage.warning('請選擇要操作的數據')
    return
  }
  
  try {
    const ids = selection.value.map(item => item.id)
    await batchOperation(operation, ids)
    
    // 操作完成後重新加載數據
    await loadTableData()
    selection.value = []
    
    ElMessage.success('批量操作成功')
  } catch (error) {
    ElMessage.error('批量操作失敗')
  }
}
```

## 關鍵特性

- 🔗 完整的搜索與表格聯動
- 📄 智能的分頁集成
- 🔄 靈活的視圖切換
- 📊 強大的排序功能
- ⚡ 高性能的數據加載
- 📱 響應式的移動端適配

## 性能優化

### 防抖搜索
對搜索輸入進行防抖處理：

```typescript
import { debounce } from 'lodash-es'

// 防抖搜索處理
const debouncedSearch = debounce((searchData: any) => {
  handleSearch(searchData)
}, 300)

// 在搜索組件中使用防抖
const onSearchInput = (searchData: any) => {
  debouncedSearch(searchData)
}
```

### 數據緩存
實現搜索結果的智能緩存：

```typescript
// 緩存配置
const searchCache = new Map()

// 緩存鍵生成
const getCacheKey = (params: any) => {
  return JSON.stringify(params)
}

// 帶緩存的數據加載
const loadTableDataWithCache = async () => {
  const params = {
    page: pagination.page,
    pageSize: pagination.pageSize,
    ...searchCondition.value
  }
  
  const cacheKey = getCacheKey(params)
  
  // 檢查緩存
  if (searchCache.has(cacheKey)) {
    const cachedData = searchCache.get(cacheKey)
    tableData.value = cachedData.data
    pagination.total = cachedData.total
    return
  }
  
  // 加載新數據
  const response = await fetchTableData(params)
  
  // 存儲到緩存
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
確保搜索狀態與URL參數同步：

```typescript
// URL參數同步
const syncUrlParams = () => {
  const params = new URLSearchParams()
  
  // 同步分頁參數
  params.set('page', pagination.page.toString())
  params.set('pageSize', pagination.pageSize.toString())
  
  // 同步搜索條件
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
完善的錯誤處理和用户反饋：

```typescript
const handleError = (error: any, context: string) => {
  console.error(`${context}失敗:`, error)
  
  // 用户友好的錯誤提示
  const errorMessage = error.response?.data?.message || '操作失敗，請稍後重試'
  ElMessage.error(errorMessage)
  
  // 錯誤上報（可選）
  if (process.env.NODE_ENV === 'production') {
    reportError(error, context)
  }
}
```

### 3. 加載狀態管理
細粒度的加載狀態控制：

```typescript
// 不同操作的加載狀態
const loadingStates = reactive({
  table: false,
  search: false,
  export: false,
  batch: false
})

// 統一的加載狀態管理
const withLoading = async (key: keyof typeof loadingStates, operation: () => Promise<any>) => {
  try {
    loadingStates[key] = true
    return await operation()
  } finally {
    loadingStates[key] = false
  }
}
```

## 相關鏈接

- [響應式佈局](./responsive-layout) - 瞭解在不同設備下的表格顯示優化
- [表單驗證](./form-validation) - 瞭解搜索條件的驗證處理
- [方法演示](./methods-demo) - 瞭解組件方法在表格集成中的應用