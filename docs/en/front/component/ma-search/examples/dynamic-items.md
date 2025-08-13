# Dynamic Management of Search Items

Demonstrates all programmatic management methods, including adding, removing, and modifying search items, suitable for scenarios requiring dynamic adjustment of search conditions based on business logic.

## Dynamic Management Demo

<DemoPreview dir="demos/ma-search/dynamic-items" />

## Dynamic Management Methods

### Adding Search Items
Use the `appendItem` method to dynamically add new search items:

```typescript
// Add a single search item
const addSearchItem = () => {
  searchRef.value?.appendItem({
    label: 'New Field',
    prop: 'new_field',
    render: 'input',
    props: {
      placeholder: 'Please enter new field value'
    }
  })
}
```

### Removing Search Items
Use the `removeItem` method to remove specified search items:

```typescript
// Remove specified search item
const removeSearchItem = (prop: string) => {
  searchRef.value?.removeItem(prop)
}
```

### Batch Setting Search Items
Use the `setItems` method to set all search items at once:

```typescript
// Batch update search items
const updateAllItems = () => {
  const newItems = [
    { label: 'Username', prop: 'username', render: 'input' },
    { label: 'Status', prop: 'status', render: 'select', options: statusOptions }
  ]
  searchRef.value?.setItems(newItems)
}
```

### Retrieving Search Item Information
Use various retrieval methods to query current search item configurations:

```typescript
// Get all search items
const allItems = searchRef.value?.getItems()

// Get specific search item
const userItem = searchRef.value?.getItemByProp('username')

// Check if search item exists
const hasUserItem = !!searchRef.value?.getItemByProp('username')
```

## Usage Scenarios

### 1. Permission Control
Dynamically display different search conditions based on user permissions:

```typescript
// Admin sees all search items, regular users see partial items
if (userRole === 'admin') {
  searchRef.value?.appendItem({
    label: 'Creator',
    prop: 'creator',
    render: 'select',
    options: userOptions
  })
}
```

### 2. Business Scenario Switching
Switch between different search condition combinations based on business scenarios:

```typescript
// Switch business scenario
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

### 3. Conditional Dependencies
Implement dependencies between search conditions:

```typescript
// When selecting a category, dynamically add subcategory search item
const onCategoryChange = (categoryId: string) => {
  if (categoryId) {
    searchRef.value?.appendItem({
      label: 'Subcategory',
      prop: 'subcategory',
      render: 'select',
      options: getSubcategories(categoryId)
    })
  } else {
    searchRef.value?.removeItem('subcategory')
  }
}
```

## Key Features

- 🔧 Full CRUD operation support
- 🔄 Real-time search item management
- 📊 Comprehensive query and retrieval methods
- 🎯 Support for complex business logic
- ⚡ High-performance dynamic update mechanism

## Advanced Usage

### Search Item Template System
Create reusable search item templates:

```typescript
// Define search item templates
const templates = {
  userSearch: [
    { label: 'Username', prop: 'username', render: 'input' },
    { label: 'Email', prop: 'email', render: 'input' },
    { label: 'Status', prop: 'status', render: 'select', options: statusOptions }
  ],
  orderSearch: [
    { label: 'Order No.', prop: 'order_no', render: 'input' },
    { label: 'Order Status', prop: 'order_status', render: 'select', options: orderStatusOptions },
    { label: 'Order Time', prop: 'created_at', render: 'date-picker' }
  ]
}

// Apply template
const applyTemplate = (templateName: string) => {
  const template = templates[templateName]
  if (template) {
    searchRef.value?.setItems([...template])
  }
}
```

### Dynamic Validation Rules
Add validation rules dynamically based on search items:

```typescript
const addItemWithValidation = (item: any) => {
  // Add validation rules for certain fields
  if (item.prop === 'email') {
    item.rules = [
      { required: true, message: 'Email cannot be empty', trigger: 'blur' },
      { type: 'email', message: 'Invalid email format', trigger: 'blur' }
    ]
  }
  
  searchRef.value?.appendItem(item)
}
```

## Best Practices

### 1. State Management
Recommended to use state management libraries (like Pinia) for managing complex search item states:

```typescript
// Use Pinia store to manage search items
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

### 2. Performance Optimization
Use debounce technique when frequently updating search items dynamically:

```typescript
import { debounce } from 'lodash-es'

// Debounced item update
const updateItemsDebounced = debounce((items: any[]) => {
  searchRef.value?.setItems(items)
}, 300)
```

### 3. Data Persistence
Save dynamically created search item configurations to local storage:

```typescript
// Save search configuration
const saveSearchConfig = () => {
  const items = searchRef.value?.getItems()
  localStorage.setItem('searchConfig', JSON.stringify(items))
}

// Restore search configuration
const restoreSearchConfig = () => {
  const savedConfig = localStorage.getItem('searchConfig')
  if (savedConfig) {
    const items = JSON.parse(savedConfig)
    searchRef.value?.setItems(items)
  }
}
```

## Related Links

- [Method Demonstration](./methods-demo) - Learn detailed usage of all exposed methods
- [Custom Actions](./custom-actions) - Learn about custom action buttons
- [Advanced Search](./advanced-search) - Learn implementation of complex search scenarios