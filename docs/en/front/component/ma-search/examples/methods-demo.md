# Method Demonstration

Showcase the usage of all exposed methods, including real-time state tracking and operation logging, to help developers gain a deeper understanding of the component's programming interface and advanced usage.

## Method Demonstration

<DemoPreview dir="demos/ma-search/methods-demo" />

## Exposed Method Details

### Form Data Management
Manipulate and retrieve search form data:

```typescript
// Set search form data
const setFormData = () => {
  const newData = {
    username: 'admin',
    status: 'active',
    created_at: '2024-01-01'
  }
  searchRef.value?.setSearchForm(newData)
}

// Get current search form data
const getFormData = () => {
  const formData = searchRef.value?.getSearchForm()
  console.log('Current form data:', formData)
  return formData
}

// Clear form data
const clearFormData = () => {
  searchRef.value?.setSearchForm({})
}
```

### Collapse State Control
Manage the collapse/expand state of the search panel:

```typescript
// Toggle collapse state
const toggleFold = () => {
  searchRef.value?.foldToggle()
}

// Get current collapse state
const getCurrentFoldState = () => {
  const isFold = searchRef.value?.getFold()
  console.log('Current collapse state:', isFold ? 'Collapsed' : 'Expanded')
  return isFold
}

// Programmatically set collapse state
const setFoldState = (fold: boolean) => {
  const currentState = searchRef.value?.getFold()
  if (currentState !== fold) {
    searchRef.value?.foldToggle()
  }
}
```

### Visibility Management
Control the display state of the entire search component:

```typescript
// Set visibility state
const setVisibility = (visible: boolean) => {
  searchRef.value?.setShowState(visible)
}

// Get current visibility state
const getVisibility = () => {
  const isVisible = searchRef.value?.getShowState()
  console.log('Component visibility:', isVisible ? 'Visible' : 'Hidden')
  return isVisible
}

// Toggle visibility state
const toggleVisibility = () => {
  const currentState = searchRef.value?.getShowState()
  searchRef.value?.setShowState(!currentState)
}
```

### Dynamic Configuration Management
Modify various component configuration options dynamically:

```typescript
// Dynamically set search options
const updateSearchOptions = () => {
  const newOptions = {
    cols: { xs: 1, sm: 2, md: 3, lg: 4 },
    fold: true,
    foldRows: 3,
    text: {
      searchBtn: 'Search Now',
      resetBtn: 'Reset Conditions'
    }
  }
  searchRef.value?.setOptions(newOptions)
}

// Dynamically set form options  
const updateFormOptions = () => {
  const formOptions = {
    labelWidth: '120px',
    labelPosition: 'right',
    size: 'large'
  }
  searchRef.value?.setFormOptions(formOptions)
}

// Get current configuration
const getCurrentConfig = () => {
  const searchOptions = searchRef.value?.getOptions()
  const formOptions = searchRef.value?.getFormOptions()
  
  console.log('Search component configuration:', searchOptions)
  console.log('Form component configuration:', formOptions)
  
  return { searchOptions, formOptions }
}
```

### Search Item Dynamic Management
Modify search item configurations at runtime:

```typescript
// Batch set search items
const setBatchItems = () => {
  const newItems = [
    { label: 'User ID', prop: 'user_id', render: 'input-number' },
    { label: 'Username', prop: 'username', render: 'input' },
    { label: 'Email', prop: 'email', render: 'input' },
    { label: 'Status', prop: 'status', render: 'select', options: statusOptions }
  ]
  searchRef.value?.setItems(newItems)
}

// Append single search item
const appendSingleItem = () => {
  const newItem = {
    label: 'Registration Date',
    prop: 'created_at',
    render: 'date-picker',
    props: {
      type: 'daterange',
      format: 'YYYY-MM-DD'
    }
  }
  searchRef.value?.appendItem(newItem)
}

// Remove specific search item
const removeSpecificItem = (prop: string) => {
  searchRef.value?.removeItem(prop)
}

// Find specific search item
const findItemByProp = (prop: string) => {
  const item = searchRef.value?.getItemByProp(prop)
  if (item) {
    console.log(`Found search item:`, item)
  } else {
    console.log(`Search item with prop "${prop}" not found`)
  }
  return item
}

// Get all search items
const getAllItems = () => {
  const items = searchRef.value?.getItems()
  console.log('All search items:', items)
  return items
}
```

### Form Reference Access
Get internal ma-form component reference for lower-level operations:

```typescript
// Get form reference
const getFormRef = () => {
  const formRef = searchRef.value?.getMaFormRef()
  if (formRef) {
    console.log('Obtained form reference:', formRef)
    return formRef
  }
}

// Validate via form reference
const validateViaFormRef = async () => {
  const formRef = searchRef.value?.getMaFormRef()
  if (formRef) {
    try {
      await formRef.validate()
      console.log('Form validation passed')
      return true
    } catch (error) {
      console.log('Form validation failed:', error)
      return false
    }
  }
}

// Reset form via reference
const resetViaFormRef = () => {
  const formRef = searchRef.value?.getMaFormRef()
  if (formRef) {
    formRef.resetFields()
    console.log('Form reset')
  }
}
```

## Usage Scenarios

### 1. Search Condition Presets
Preset different search conditions based on business scenarios:

```typescript
// Preset search scenarios
const presetScenarios = {
  today: () => {
    searchRef.value?.setSearchForm({
      created_at: [
        dayjs().format('YYYY-MM-DD'),
        dayjs().format('YYYY-MM-DD')
      ]
    })
  },
  
  thisWeek: () => {
    searchRef.value?.setSearchForm({
      created_at: [
        dayjs().startOf('week').format('YYYY-MM-DD'),
        dayjs().endOf('week').format('YYYY-MM-DD')
      ]
    })
  },
  
  activeUsers: () => {
    searchRef.value?.setSearchForm({
      status: 'active',
      last_login: [
        dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
        dayjs().format('YYYY-MM-DD')
      ]
    })
  }
}

// Apply preset scenario
const applyPreset = (scenario: keyof typeof presetScenarios) => {
  presetScenarios[scenario]()
}
```

### 2. Permission Control
Dynamically adjust search functionality based on user permissions:

```typescript
// Permission control for search items
const applyPermissionControl = (userRole: string) => {
  const baseItems = [
    { label: 'Username', prop: 'username', render: 'input' },
    { label: 'Status', prop: 'status', render: 'select', options: statusOptions }
  ]
  
  // Admins can see more search items
  if (userRole === 'admin') {
    baseItems.push(
      { label: 'Creator', prop: 'creator', render: 'select', options: userOptions },
      { label: 'Internal ID', prop: 'internal_id', render: 'input-number' }
    )
  }
  
  searchRef.value?.setItems(baseItems)
}

// Permission control for visibility
const applyVisibilityControl = (userRole: string) => {
  // Hide search for guest users
  if (userRole === 'guest') {
    searchRef.value?.setShowState(false)
  } else {
    searchRef.value?.setShowState(true)
  }
}
```

### 3. Responsive Configuration Adjustment
Dynamically adjust configurations based on device type and screen size:

```typescript
// Responsive configuration adjustment
const adjustForDevice = () => {
  const isMobile = window.innerWidth < 768
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024
  
  let newOptions = {}
  
  if (isMobile) {
    newOptions = {
      cols: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
      fold: true,
      foldRows: 1
    }
  } else if (isTablet) {
    newOptions = {
      cols: { xs: 1, sm: 2, md: 2, lg: 2, xl: 2 },
      fold: true,
      foldRows: 2
    }
  } else {
    newOptions = {
      cols: { xs: 2, sm: 3, md: 4, lg: 4, xl: 5 },
      fold: false,
      foldRows: 3
    }
  }
  
  searchRef.value?.setOptions(newOptions)
}

// Listen to window resize
onMounted(() => {
  window.addEventListener('resize', adjustForDevice)
  adjustForDevice() // Initial adjustment
})

onUnmounted(() => {
  window.removeEventListener('resize', adjustForDevice)
})
```

## Key Features

- 🔧 Complete programming interface
- 📊 Real-time state tracking
- 🎯 Flexible configuration management
- ⚡ High-performance method calls
- 🛠 Powerful extension capabilities
- 📝 Detailed operation logging

## Advanced Usage Examples

### Search Template System
Create savable and loadable search templates:

```typescript
// Search template management
class SearchTemplateManager {
  private templates = new Map()
  
  // Save current search configuration as template
  saveTemplate(name: string, searchRef: any) {
    const template = {
      formData: searchRef.getSearchForm(),
      items: searchRef.getItems(),
      options: searchRef.getOptions()
    }
    this.templates.set(name, template)
    
    // Persist to local storage
    localStorage.setItem('searchTemplates', JSON.stringify(Array.from(this.templates)))
  }
  
  // Load search template
  loadTemplate(name: string, searchRef: any) {
    const template = this.templates.get(name)
    if (template) {
      searchRef.setItems(template.items)
      searchRef.setOptions(template.options)
      searchRef.setSearchForm(template.formData)
      return true
    }
    return false
  }
  
  // Restore templates from local storage
  loadFromStorage() {
    const stored = localStorage.getItem('searchTemplates')
    if (stored) {
      const templates = JSON.parse(stored)
      this.templates = new Map(templates)
    }
  }
}
```

### Search State Monitoring
Monitor various state changes of the search component:

```typescript
// State monitor
class SearchStateMonitor {
  private logs: any[] = []
  
  // Monitor method calls
  monitorMethod(methodName: string, args: any[], result: any) {
    const log = {
      timestamp: new Date(),
      method: methodName,
      arguments: args,
      result: result,
      type: 'method_call'
    }
    this.logs.push(log)
    console.log('Method call:', log)
  }
  
  // Monitor state changes
  monitorStateChange(stateName: string, oldValue: any, newValue: any) {
    const log = {
      timestamp: new Date(),
      state: stateName,
      oldValue: oldValue,
      newValue: newValue,
      type: 'state_change'
    }
    this.logs.push(log)
    console.log('State change:', log)
  }
  
  // Get monitoring logs
  getLogs(type?: string) {
    if (type) {
      return this.logs.filter(log => log.type === type)
    }
    return [...this.logs]
  }
  
  // Clear logs
  clearLogs() {
    this.logs = []
  }
}
```

## Best Practices

### 1. Error Handling for Method Calls
```typescript
const safeMethodCall = async (methodName: string, ...args: any[]) => {
  try {
    const method = searchRef.value?.[methodName]
    if (typeof method === 'function') {
      return await method.apply(searchRef.value, args)
    } else {
      throw new Error(`Method ${methodName} does not exist`)
    }
  } catch (error) {
    console.error(`Failed to call method ${methodName}:`, error)
    // Add user-friendly error message
    ElMessage.error(`Operation failed: ${error.message}`)
    return null
  }
}
```

### 2. Batch Operation Optimization
```typescript
const batchOperations = (operations: Array<() => void>) => {
  // Pause reactive updates
  const pauseReactivity = () => {
    // Implementation to pause
  }
  
  const resumeReactivity = () => {
    // Implementation to resume
  }
  
  try {
    pauseReactivity()
    operations.forEach(operation => operation())
  } finally {
    resumeReactivity()
  }
}
```

### 3. State Synchronization
```typescript
const syncWithExternalState = (externalState: any) => {
  // Sync form data
  if (externalState.formData) {
    searchRef.value?.setSearchForm(externalState.formData)
  }
  
  // Sync configuration options
  if (externalState.options) {
    searchRef.value?.setOptions(externalState.options)
  }
  
  // Sync search items
  if (externalState.items) {
    searchRef.value?.setItems(externalState.items)
  }
}
```

## Related Links

- [Dynamic Management](./dynamic-items) - Learn about dynamic management of search items
- [Custom Actions](./custom-actions) - Learn about implementing custom action buttons
- [Form Validation](./form-validation) - Learn about form validation via methods