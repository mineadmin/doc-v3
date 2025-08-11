# Hooks

MineAdmin provides a series of powerful custom Hooks that encapsulate commonly used functionalities and logic, enabling developers to easily reuse code in Vue 3 components. This documentation details the usage, parameters, return values, and practical application scenarios for each Hook.

## useCache()

A Hook for browser cache operations, supporting localStorage and sessionStorage, with expiration time configuration.

**Source Path:** `/web/src/hooks/useCache.ts`  
**GitHub Link:** [View Source](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useCache.ts)

### Type Definitions

```typescript
export type CacheType = 'localStorage' | 'sessionStorage'

export interface CacheOptions {
  /**
   * Timeout in seconds.
   * Defaults to unlimited.
   */
  exp?: number

  /**
   * When true: If insertion fails due to exceeding maximum capacity, clears expired cache entries before retrying.
   * Defaults to true.
   */
  force?: boolean
}
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| type | CacheType | 'localStorage' | Cache type, either localStorage or sessionStorage |

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| cache | WebStorageCache | Underlying WebStorageCache instance |
| prefix | string | Cache key prefix |
| set | Function | Set cache |
| get | Function | Get cache |
| remove | Function | Remove cache |
| removeAllExpires | Function | Remove all expired cache entries |
| touch | Function | Update cache expiration time |

### Usage Example

```typescript
import useCache from '@/hooks/useCache'

// Use localStorage (default)
const { set, get, remove, removeAllExpires, touch } = useCache()

// Use sessionStorage
const sessionCache = useCache('sessionStorage')

// Set cache (no expiration)
set('userInfo', { name: 'MineAdmin', role: 'admin' })

// Set cache (expires in 30 seconds)
set('tempData', 'temporary value', { exp: 30 })

// Get cache
const userInfo = get('userInfo', null)

// Remove specific cache
remove('tempData')

// Remove all expired cache
removeAllExpires()

// Update cache expiration (extend by 60 seconds)
touch('userInfo', 60)
```

### Practical Application Scenario

```typescript
// In user login component
const { set, get } = useCache()

// Save user login info
const saveUserInfo = (userInfo: any) => {
  set('userInfo', userInfo, { exp: 24 * 60 * 60 }) // Expires in 24 hours
}

// Get user info
const getUserInfo = () => {
  return get('userInfo', null)
}
```

## useDialog()

A Hook for creating dialogs, providing complete dialog lifecycle management with support for custom titles, properties, and event callbacks.

**Source Path:** `/web/src/hooks/useDialog.ts`  
**GitHub Link:** [View Source](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useDialog.ts)

### Type Definitions

```typescript
export interface UseDialogExpose {
  on: {
    ok?: (...args: any[]) => void
    cancel?: (...args: any[]) => void
  }
  Dialog: Component
  open: (...args: any[]) => void
  close: () => void
  setTitle: (title: string) => void
  setAttr: (attr: Record<string, any>) => void
}
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| dialogProps | Record<string, any> \| null | null | Initial dialog property configuration |

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| on | Object | Event callback configuration |
| Dialog | Component | Dialog component |
| open | Function | Open dialog |
| close | Function | Close dialog |
| setTitle | Function | Set dialog title |
| setAttr | Function | Set dialog properties |

### Usage Example

```typescript
import useDialog from '@/hooks/useDialog'

export default defineComponent({
  setup() {
    // Create dialog instance
    const { Dialog, open, close, setTitle, on } = useDialog({
      width: '500px',
      draggable: true
    })

    // Configure event callbacks
    on.ok = () => {
      console.log('User clicked OK')
      close()
    }

    on.cancel = () => {
      console.log('User clicked Cancel')
      return true // Return true to allow closing
    }

    // Open dialog
    const openDialog = () => {
      setTitle('Edit User Info')
      open({ userId: 123 })
    }

    return {
      Dialog,
      openDialog
    }
  },

  render() {
    return (
      <div>
        <el-button onClick={this.openDialog}>Open Dialog</el-button>
        <Dialog title="Default Title">
          <div>Dialog content here</div>
        </Dialog>
      </div>
    )
  }
})
```

### Practical Application Scenario

```vue
<template>
  <div>
    <el-button @click="editUser">Edit User</el-button>
    <Dialog>
      <div>Edit user form content</div>
    </Dialog>
  </div>
</template>

<script setup>
import useDialog from '@/hooks/useDialog'

const { Dialog, open, close, setTitle, on } = useDialog({
  width: '600px',
  destroyOnClose: true
})

const currentUserId = ref(null)

// Edit user
const editUser = () => {
  currentUserId.value = 123
  setTitle('Edit User Info')
  open()
}

// Handle form submission
const handleSubmit = async (formData) => {
  try {
    console.log('Submit user data:', formData)
    close()
    // Handle form submission logic here
  } catch (error) {
    console.error('Submission failed:', error)
  }
}

// Configure events
on.ok = () => {
  // Trigger form submission here
  return false // Prevent default close behavior
}
</script>
```

## useEcharts()

A Hook for integrating ECharts library, providing theme switching and chart initialization.

**Source Path:** `/web/src/hooks/useEcharts.ts`  
**GitHub Link:** [View Source](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useEcharts.ts)

### Exported Functions

| Function | Type | Description |
|----------|------|-------------|
| useEcharts | Function | useEcharts function from @mineadmin/echarts |
| themeMode | Function | Get current theme mode |

### Usage Example

```typescript
import { useEcharts, themeMode } from '@/hooks/useEcharts'

export default defineComponent({
  setup() {
    const chartRef = ref()
    
    onMounted(async () => {
      // Initialize chart
      const chart = await useEcharts(chartRef.value)
      
      // Configure chart options
      const option = {
        title: { text: 'Sales Data' },
        theme: themeMode(), // Use current theme
        xAxis: {
          type: 'category',
          data: ['Jan', 'Feb', 'Mar', 'Apr', 'May']
        },
        yAxis: { type: 'value' },
        series: [{
          data: [820, 932, 901, 934, 1290],
          type: 'bar'
        }]
      }
      
      chart.setOption(option)
    })

    return { chartRef }
  },

  render() {
    return <div ref="chartRef" style="width: 100%; height: 400px;"></div>
  }
})
```

### Practical Application Scenario

```vue
<template>
  <div class="dashboard">
    <div ref="salesChartRef" class="chart-container"></div>
    <div ref="trafficChartRef" class="chart-container"></div>
  </div>
</template>

<script setup>
import { useEcharts, themeMode } from '@/hooks/useEcharts'
import { ref, onMounted } from 'vue'

const salesChartRef = ref()
const trafficChartRef = ref()

onMounted(async () => {
  // Initialize sales chart
  const salesChart = await useEcharts(salesChartRef.value)
  salesChart.setOption({
    title: { text: 'Sales Trend' },
    theme: themeMode(),
    // ... other configurations
  })

  // Initialize traffic chart
  const trafficChart = await useEcharts(trafficChartRef.value)
  trafficChart.setOption({
    title: { text: 'Traffic Statistics' },
    theme: themeMode(),
    // ... other configurations
  })
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
  margin-bottom: 20px;
}
</style>
```

## useForm()

A Hook for form operations, providing form instance access and manipulation.

**Source Path:** `/web/src/hooks/useForm.ts`  
**GitHub Link:** [View Source](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useForm.ts)

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| refName | string | Form reference name |

### Return Values

Returns a Promise resolving to a form instance of type `MaFormExpose`.

### Usage Example

```typescript
import useForm from '@/hooks/useForm'

export default defineComponent({
  setup() {
    const formRef = ref()
    
    // Get form instance
    const getFormInstance = async () => {
      try {
        const formInstance = await useForm('userForm')
        
        // Use form instance for operations
        await formInstance.validate()
        const formData = formInstance.getFieldsValue()
        
        console.log('Form data:', formData)
      } catch (error) {
        console.error('Form validation failed:', error)
      }
    }

    return {
      formRef,
      getFormInstance
    }
  }
})
```

### Practical Application Scenario

```vue
<template>
  <div>Form content</div>
  <el-button @click="handleSubmit">Submit</el-button>
</template>

<script setup>
import useForm from '@/hooks/useForm'
import { ref } from 'vue'

const userFormRef = ref()

const formColumns = [
  {
    title: 'Username',
    dataIndex: 'username',
    formType: 'input',
    rules: [{ required: true, message: 'Please enter username' }]
  },
  {
    title: 'Email',
    dataIndex: 'email',
    formType: 'input',
    rules: [{ required: true, type: 'email', message: 'Please enter valid email' }]
  }
]

const handleSubmit = async () => {
  try {
    const formInstance = await useForm('userForm')
    
    // Form submission logic
    console.log('Form submission')
  } catch (error) {
    console.error('Submission failed:', error)
  }
}
</script>
```

## useTable()

A Hook for table operations, providing table instance access and manipulation.

**Source Path:** `/web/src/hooks/useTable.ts`  
**GitHub Link:** [View Source](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useTable.ts)

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| refName | string | Table reference name |

### Return Values

Returns a Promise resolving to a table instance of type `MaTableExpose`.

### Usage Example

```typescript
import useTable from '@/hooks/useTable'

export default defineComponent({
  setup() {
    // Get table instance
    const getTableInstance = async () => {
      try {
        const tableInstance = await useTable('userTable')
        
        // Refresh table data
        await tableInstance.refresh()
        
        // Get selected rows
        const selectedRows = tableInstance.getSelectedRows()
        console.log('Selected rows:', selectedRows)
        
        // Clear selection
        tableInstance.clearSelection()
      } catch (error) {
        console.error('Failed to get table instance:', error)
      }
    }

    return { getTableInstance }
  }
})
```

### Practical Application Scenario

```vue
<template>
  <div>
    <el-button @click="refreshTable">Refresh</el-button>
    <el-button @click="deleteSelected">Delete Selected</el-button>
    <div>Table content</div>
  </div>
</template>

<script setup>
import useTable from '@/hooks/useTable'

const userTableRef = ref()

const tableColumns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: 'Username', dataIndex: 'username' },
  { title: 'Email', dataIndex: 'email' },
  { title: 'Status', dataIndex: 'status' }
]

// Refresh table
const refreshTable = async () => {
  const tableInstance = await useTable('userTable')
  await tableInstance.refresh()
  ElMessage.success('Refresh successful')
}

// Delete selected users
const deleteSelected = async () => {
  try {
    const tableInstance = await useTable('userTable')
    const selectedRows = tableInstance.getSelectedRows()
    
    if (selectedRows.length === 0) {
      ElMessage.warning('Please select users to delete')
      return
    }
    
    await ElMessageBox.confirm('Confirm to delete selected users?')
    
    const ids = selectedRows.map(row => row.id)
    await deleteUsers(ids)
    
    // Refresh table and clear selection
    await tableInstance.refresh()
    tableInstance.clearSelection()
    
    ElMessage.success('Deletion successful')
  } catch (error) {
    ElMessage.error('Deletion failed')
  }
}
</script>
```

## useLocalTrans()

A Hook for localization translation, providing translation functionality based on vue-i18n.

**Source Path:** `/web/src/hooks/useLocalTrans.ts`  
**GitHub Link:** [View Source](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useLocalTrans.ts)

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| key | any \| null | null | Translation key, returns translation function when null |

### Return Values

- When `key` is null: Returns translation function `ComposerTranslation`
- When `key` has value: Returns translated string

### Usage Example

```typescript
import { useLocalTrans } from '@/hooks/useLocalTrans'

export default defineComponent({
  setup() {
    // Get translation function
    const t = useLocalTrans()
    
    // Direct translation
    const title = useLocalTrans('user.title')
    const message = useLocalTrans('user.welcome', { name: 'MineAdmin' })
    
    return {
      t,
      title,
      message
    }
  },

  render() {
    return (
      <div>
        <h1>{this.title}</h1>
        <p>{this.message}</p>
        <p>{this.t("user.description")}</p>
      </div>
    )
  }
})
```

### Practical Application Scenario

```vue
<template>
  <div class="user-panel">
    <h2>{{ pageTitle }}</h2>
    <el-button @click="showWelcome">{{ t('user.showWelcome') }}</el-button>
    <p>{{ welcomeMessage }}</p>
  </div>
</template>

<script setup>
import { useLocalTrans } from '@/hooks/useLocalTrans'

// Get translation function
const t = useLocalTrans()

// Directly get translated text
const pageTitle = useLocalTrans('user.management')

const userName = ref('Admin')
const welcomeMessage = computed(() => 
  t('user.welcomeMessage', { name: userName.value })
)

const showWelcome = () => {
  ElMessage.success(t('user.welcomeBack'))
}
</script>
```

## useMessage()

A Hook for message notifications, encapsulating Element Plus message components with a unified interface.

**Source Path:** `/web/src/hooks/useMessage.ts`  
**GitHub Link:** [View Source](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useMessage.ts)

### Return Values

| Method | Parameters | Description |
|--------|------------|-------------|
| info | (content: string) | Show info message |
| error | (content: string) | Show error message |
| success | (content: string) | Show success message |
| warning | (content: string) | Show warning message |
| alert | (content: string) | Show alert dialog |
| alertError | (content: string) | Show error alert |
| alertSuccess | (content: string) | Show success alert |
| alertWarning | (content: string) | Show warning alert |
| notify | (content: string, args?: Record<string, any>) | Show notification |
| notifyError | (content: string) | Show error notification |
| notifySuccess | (content: string) | Show success notification |
| notifyWarning | (content: string) | Show warning notification |
| confirm | (content: string, tip?: string) | Show confirmation dialog |
| delConfirm | (content?: string, tip?: string) | Show delete confirmation |
| exportConfirm | (content?: string, tip?: string) | Show export confirmation |
| prompt | (content: string, defaultValue?: string, tip?: string, inputValidator?: MessageBoxInputValidator) | Show input dialog |

### Usage Example

```typescript
import { useMessage } from '@/hooks/useMessage'

export default defineComponent({
  setup() {
    const message = useMessage()

    const handleSuccess = () => {
      message.success('Operation successful!')
    }

    const handleError = () => {
      message.error('Operation failed, please retry')
    }

    const handleConfirm = async () => {
      try {
        await message.confirm('Confirm this operation?')
        console.log('User confirmed operation')
      } catch {
        console.log('User canceled operation')
      }
    }

    const handleDelete = async () => {
      try {
        await message.delConfirm()
        console.log('Perform deletion')
      } catch {
        console.log('Cancel deletion')
      }
    }

    return {
      handleSuccess,
      handleError,
      handleConfirm,
      handleDelete
    }
  }
})
```

### Practical Application Scenario

```vue
<template>
  <div>
    <el-button @click="saveData">Save Data</el-button>
    <el-button @click="deleteItem" type="danger">Delete</el-button>
    <el-button @click="exportData">Export Data</el-button>
  </div>
</template>

<script setup>
import { useMessage } from '@/hooks/useMessage'
import { saveUserData,