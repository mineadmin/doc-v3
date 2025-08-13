# Table Integration

A complete integration solution for data tables, including search, pagination, sorting, table/card view switching, and more. This represents best practices for building comprehensive data management interfaces.

## Table Integration Demo

<DemoPreview dir="demos/ma-search/table-integration" />

## Integration Solution Explanation

### Search and Table Interaction
Real-time synchronization between search conditions and table data:

```typescript
// Search handler
const handleSearch = (searchData: any) => {
  // Reset pagination to first page
  pagination.page = 1
  // Save search conditions
  searchCondition.value = { ...searchData }
  // Reload table data
  loadTableData()
}

// Reset handler  
const handleReset = () => {
  // Clear search conditions
  searchCondition.value = {}
  // Reset pagination
  pagination.page = 1
  // Reload table data
  loadTableData()
}
```

### Pagination Integration
Complete integration of search and pagination systems:

```typescript
// Pagination configuration
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// Page change handler
const handlePageChange = (page: number) => {
  pagination.page = page
  loadTableData()
}

// Page size change handler
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1  // Reset to first page
  loadTableData()
}
```

### Data Loading Logic
Unified data loading and state management:

```typescript
// Data loading function
const loadTableData = async () => {
  try {
    loading.value = true
    
    // Build request parameters
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchCondition.value  // Include search conditions
    }
    
    // Call API
    const response = await fetchTableData(params)
    
    // Update data
    tableData.value = response.data
    pagination.total = response.total
    
  } catch (error) {
    console.error('Data loading failed:', error)
  } finally {
    loading.value = false
  }
}
```

## Usage Scenarios

### 1. User Management System
Complete user data management interface:

```typescript
// User search item configuration
const userSearchItems = [
  { label: 'Username', prop: 'username', render: 'input' },
  { label: 'Email', prop: 'email', render: 'input' },
  { label: 'Status', prop: 'status', render: 'select', options: statusOptions },
  { label: 'Registration Date', prop: 'created_at', render: 'date-picker' }
]

// User table column configuration
const userTableColumns = [
  { prop: 'username', label: 'Username' },
  { prop: 'email', label: 'Email' },
  { prop: 'status', label: 'Status' },
  { prop: 'created_at', label: 'Registration Date' }
]
```

### 2. Order Management System
Order data query and display:

```typescript
// Order search configuration
const orderSearchItems = [
  { label: 'Order Number', prop: 'order_no', render: 'input' },
  { label: 'Order Status', prop: 'status', render: 'select', options: orderStatusOptions },
  { label: 'Customer Name', prop: 'customer', render: 'input' },
  { label: 'Order Date', prop: 'order_date', render: 'date-range-picker' }
]
```

### 3. Product Management System
Product information filtering and management:

```typescript
// Product search configuration
const productSearchItems = [
  { label: 'Product Name', prop: 'name', render: 'input' },
  { label: 'Product Category', prop: 'category', render: 'cascader', options: categoryOptions },
  { label: 'Price Range', prop: 'price_range', render: 'input-number-range' },
  { label: 'Listing Status', prop: 'status', render: 'radio-group', options: productStatusOptions }
]
```

## Advanced Features

### View Switching
Support switching between table view and card view:

```typescript
// View mode management
const viewMode = ref<'table' | 'card'>('table')

// View switching handler
const switchView = (mode: 'table' | 'card') => {
  viewMode.value = mode
  // Adjust page size based on view mode
  if (mode === 'card') {
    pagination.pageSize = 12  // Show more items in card view
  } else {
    pagination.pageSize = 10  // Standard pagination for table view
  }
  loadTableData()
}
```

### Sorting Integration
Interaction between search conditions and table sorting:

```typescript
// Sorting state management
const sortConfig = reactive({
  prop: '',
  order: ''
})

// Sorting change handler
const handleSortChange = ({ prop, order }: any) => {
  sortConfig.prop = prop
  sortConfig.order = order
  // Reload data with sorting parameters
  loadTableData()
}

// Include sorting parameters in data loading function
const params = {
  page: pagination.page,
  pageSize: pagination.pageSize,
  sortBy: sortConfig.prop,
  sortOrder: sortConfig.order,
  ...searchCondition.value
}
```

### Batch Operations
Batch operations combining search and table selection:

```typescript
// Selection state management
const selection = ref<any[]>([])

// Batch operation handler
const handleBatchOperation = async (operation: string) => {
  if (selection.value.length === 0) {
    ElMessage.warning('Please select data to operate')
    return
  }
  
  try {
    const ids = selection.value.map(item => item.id)
    await batchOperation(operation, ids)
    
    // Reload data after operation
    await loadTableData()
    selection.value = []
    
    ElMessage.success('Batch operation successful')
  } catch (error) {
    ElMessage.error('Batch operation failed')
  }
}
```

## Key Features

- 🔗 Complete search and table interaction
- 📄 Smart pagination integration
- 🔄 Flexible view switching
- 📊 Powerful sorting functionality
- ⚡ High-performance data loading
- 📱 Responsive mobile adaptation

## Performance Optimization

### Debounced Search
Debounce handling for search inputs:

```typescript
import { debounce } from 'lodash-es'

// Debounced search handler
const debouncedSearch = debounce((searchData: any) => {
  handleSearch(searchData)
}, 300)

// Use debounce in search component
const onSearchInput = (searchData: any) => {
  debouncedSearch(searchData)
}
```

### Data Caching
Intelligent caching of search results:

```typescript
// Cache configuration
const searchCache = new Map()

// Cache key generation
const getCacheKey = (params: any) => {
  return JSON.stringify(params)
}

// Cached data loading
const loadTableDataWithCache = async () => {
  const params = {
    page: pagination.page,
    pageSize: pagination.pageSize,
    ...searchCondition.value
  }
  
  const cacheKey = getCacheKey(params)
  
  // Check cache
  if (searchCache.has(cacheKey)) {
    const cachedData = searchCache.get(cacheKey)
    tableData.value = cachedData.data
    pagination.total = cachedData.total
    return
  }
  
  // Load new data
  const response = await fetchTableData(params)
  
  // Store in cache
  searchCache.set(cacheKey, {
    data: response.data,
    total: response.total
  })
  
  tableData.value = response.data
  pagination.total = response.total
}
```

## Best Practices

### 1. State Synchronization
Synchronize search state with URL parameters:

```typescript
// URL parameter synchronization
const syncUrlParams = () => {
  const params = new URLSearchParams()
  
  // Sync pagination parameters
  params.set('page', pagination.page.toString())
  params.set('pageSize', pagination.pageSize.toString())
  
  // Sync search conditions
  Object.entries(searchCondition.value).forEach(([key, value]) => {
    if (value) {
      params.set(key, value as string)
    }
  })
  
  // Update URL
  window.history.replaceState({}, '', `${window.location.pathname}?${params}`)
}
```

### 2. Error Handling
Comprehensive error handling and user feedback:

```typescript
const handleError = (error: any, context: string) => {
  console.error(`${context} failed:`, error)
  
  // User-friendly error message
  const errorMessage = error.response?.data?.message || 'Operation failed, please try again later'
  ElMessage.error(errorMessage)
  
  // Error reporting (optional)
  if (process.env.NODE_ENV === 'production') {
    reportError(error, context)
  }
}
```

### 3. Loading State Management
Granular loading state control:

```typescript
// Loading states for different operations
const loadingStates = reactive({
  table: false,
  search: false,
  export: false,
  batch: false
})

// Unified loading state management
const withLoading = async (key: keyof typeof loadingStates, operation: () => Promise<any>) => {
  try {
    loadingStates[key] = true
    return await operation()
  } finally {
    loadingStates[key] = false
  }
}
```

## Related Links

- [Responsive Layout](./responsive-layout) - Learn about table display optimization across devices
- [Form Validation](./form-validation) - Understand search condition validation
- [Methods Demo](./methods-demo) - Learn about component methods in table integration