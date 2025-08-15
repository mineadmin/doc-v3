# 表格集成

展示与数据表格的完整集成方案，包含搜索、分页、排序、表格/卡片视图切换等功能，是构建完整数据管理界面的最佳实践。

## 表格集成演示

<DemoPreview dir="demos/ma-search/table-integration" />

## 集成方案说明

### 搜索与表格联动
实现搜索条件与表格数据的实时同步：

```typescript
// 搜索处理函数
const handleSearch = (searchData: any) => {
  // 重置分页到第一页
  pagination.page = 1
  // 保存搜索条件
  searchCondition.value = { ...searchData }
  // 重新加载表格数据
  loadTableData()
}

// 重置处理函数  
const handleReset = () => {
  // 清空搜索条件
  searchCondition.value = {}
  // 重置分页
  pagination.page = 1
  // 重新加载表格数据
  loadTableData()
}
```

### 分页集成
搜索与分页系统的完整集成：

```typescript
// 分页配置
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 分页改变处理
const handlePageChange = (page: number) => {
  pagination.page = page
  loadTableData()
}

// 页码大小改变处理
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1  // 重置到第一页
  loadTableData()
}
```

### 数据加载逻辑
统一的数据加载和状态管理：

```typescript
// 数据加载函数
const loadTableData = async () => {
  try {
    loading.value = true
    
    // 构建请求参数
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchCondition.value  // 包含搜索条件
    }
    
    // 调用API
    const response = await fetchTableData(params)
    
    // 更新数据
    tableData.value = response.data
    pagination.total = response.total
    
  } catch (error) {
    console.error('数据加载失败:', error)
  } finally {
    loading.value = false
  }
}
```

## 使用场景

### 1. 用户管理系统
完整的用户数据管理界面：

```typescript
// 用户搜索项配置
const userSearchItems = [
  { label: '用户名', prop: 'username', render: 'input' },
  { label: '邮箱', prop: 'email', render: 'input' },
  { label: '状态', prop: 'status', render: 'select', options: statusOptions },
  { label: '注册时间', prop: 'created_at', render: 'date-picker' }
]

// 用户表格列配置
const userTableColumns = [
  { prop: 'username', label: '用户名' },
  { prop: 'email', label: '邮箱' },
  { prop: 'status', label: '状态' },
  { prop: 'created_at', label: '注册时间' }
]
```

### 2. 订单管理系统
订单数据的查询和展示：

```typescript
// 订单搜索配置
const orderSearchItems = [
  { label: '订单号', prop: 'order_no', render: 'input' },
  { label: '订单状态', prop: 'status', render: 'select', options: orderStatusOptions },
  { label: '客户姓名', prop: 'customer', render: 'input' },
  { label: '下单时间', prop: 'order_date', render: 'date-range-picker' }
]
```

### 3. 商品管理系统
商品信息的筛选和管理：

```typescript
// 商品搜索配置
const productSearchItems = [
  { label: '商品名称', prop: 'name', render: 'input' },
  { label: '商品分类', prop: 'category', render: 'cascader', options: categoryOptions },
  { label: '价格区间', prop: 'price_range', render: 'input-number-range' },
  { label: '上架状态', prop: 'status', render: 'radio-group', options: productStatusOptions }
]
```

## 高级功能

### 视图切换
支持表格视图和卡片视图的切换：

```typescript
// 视图模式管理
const viewMode = ref<'table' | 'card'>('table')

// 视图切换处理
const switchView = (mode: 'table' | 'card') => {
  viewMode.value = mode
  // 可以根据视图模式调整分页大小
  if (mode === 'card') {
    pagination.pageSize = 12  // 卡片视图显示更多项
  } else {
    pagination.pageSize = 10  // 表格视图标准分页
  }
  loadTableData()
}
```

### 排序集成
搜索条件与表格排序的联动：

```typescript
// 排序状态管理
const sortConfig = reactive({
  prop: '',
  order: ''
})

// 排序改变处理
const handleSortChange = ({ prop, order }: any) => {
  sortConfig.prop = prop
  sortConfig.order = order
  // 重新加载数据，包含排序参数
  loadTableData()
}

// 在数据加载函数中包含排序参数
const params = {
  page: pagination.page,
  pageSize: pagination.pageSize,
  sortBy: sortConfig.prop,
  sortOrder: sortConfig.order,
  ...searchCondition.value
}
```

### 批量操作
结合搜索和表格选择的批量操作：

```typescript
// 选择状态管理
const selection = ref<any[]>([])

// 批量操作处理
const handleBatchOperation = async (operation: string) => {
  if (selection.value.length === 0) {
    ElMessage.warning('请选择要操作的数据')
    return
  }
  
  try {
    const ids = selection.value.map(item => item.id)
    await batchOperation(operation, ids)
    
    // 操作完成后重新加载数据
    await loadTableData()
    selection.value = []
    
    ElMessage.success('批量操作成功')
  } catch (error) {
    ElMessage.error('批量操作失败')
  }
}
```

## 关键特性

- 🔗 完整的搜索与表格联动
- 📄 智能的分页集成
- 🔄 灵活的视图切换
- 📊 强大的排序功能
- ⚡ 高性能的数据加载
- 📱 响应式的移动端适配

## 性能优化

### 防抖搜索
对搜索输入进行防抖处理：

```typescript
import { debounce } from 'lodash-es'

// 防抖搜索处理
const debouncedSearch = debounce((searchData: any) => {
  handleSearch(searchData)
}, 300)

// 在搜索组件中使用防抖
const onSearchInput = (searchData: any) => {
  debouncedSearch(searchData)
}
```

### 数据缓存
实现搜索结果的智能缓存：

```typescript
// 缓存配置
const searchCache = new Map()

// 缓存键生成
const getCacheKey = (params: any) => {
  return JSON.stringify(params)
}

// 带缓存的数据加载
const loadTableDataWithCache = async () => {
  const params = {
    page: pagination.page,
    pageSize: pagination.pageSize,
    ...searchCondition.value
  }
  
  const cacheKey = getCacheKey(params)
  
  // 检查缓存
  if (searchCache.has(cacheKey)) {
    const cachedData = searchCache.get(cacheKey)
    tableData.value = cachedData.data
    pagination.total = cachedData.total
    return
  }
  
  // 加载新数据
  const response = await fetchTableData(params)
  
  // 存储到缓存
  searchCache.set(cacheKey, {
    data: response.data,
    total: response.total
  })
  
  tableData.value = response.data
  pagination.total = response.total
}
```

## 最佳实践

### 1. 状态同步
确保搜索状态与URL参数同步：

```typescript
// URL参数同步
const syncUrlParams = () => {
  const params = new URLSearchParams()
  
  // 同步分页参数
  params.set('page', pagination.page.toString())
  params.set('pageSize', pagination.pageSize.toString())
  
  // 同步搜索条件
  Object.entries(searchCondition.value).forEach(([key, value]) => {
    if (value) {
      params.set(key, value as string)
    }
  })
  
  // 更新URL
  window.history.replaceState({}, '', `${window.location.pathname}?${params}`)
}
```

### 2. 错误处理
完善的错误处理和用户反馈：

```typescript
const handleError = (error: any, context: string) => {
  console.error(`${context}失败:`, error)
  
  // 用户友好的错误提示
  const errorMessage = error.response?.data?.message || '操作失败，请稍后重试'
  ElMessage.error(errorMessage)
  
  // 错误上报（可选）
  if (process.env.NODE_ENV === 'production') {
    reportError(error, context)
  }
}
```

### 3. 加载状态管理
细粒度的加载状态控制：

```typescript
// 不同操作的加载状态
const loadingStates = reactive({
  table: false,
  search: false,
  export: false,
  batch: false
})

// 统一的加载状态管理
const withLoading = async (key: keyof typeof loadingStates, operation: () => Promise<any>) => {
  try {
    loadingStates[key] = true
    return await operation()
  } finally {
    loadingStates[key] = false
  }
}
```

## 相关链接

- [响应式布局](./responsive-layout) - 了解在不同设备下的表格显示优化
- [表单验证](./form-validation) - 了解搜索条件的验证处理
- [方法演示](./methods-demo) - 了解组件方法在表格集成中的应用