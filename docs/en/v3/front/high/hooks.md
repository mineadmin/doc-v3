# Hooks

MineAdmin provides a series of powerful custom Hooks that encapsulate common functionality and logic, allowing developers to easily reuse code in Vue 3 components. This document will detail the usage, parameters, return values, and practical application scenarios for each Hook.

## useCache()

A Hook for browser cache operations, supporting localStorage and sessionStorage, and provides an expiration time setting feature.

**Source Path:** `/web/src/hooks/useCache.ts`
**GitHub Link:** [View Source](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useCache.ts)

### Type Definition

```typescript
export type CacheType = 'localStorage' | 'sessionStorage'

export interface CacheOptions {
  /**
   * Expiration time in seconds.
   * Defaults to infinity.
   */
  exp?: number

  /**
   * When true: If the maximum capacity is exceeded, preventing further data insertion, first clear expired content in the cache and then try the insertion again.
   * Defaults to true.
   */
  force?: boolean
}
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| type | CacheType | 'localStorage' | Cache type, optional localStorage or sessionStorage |

### Return Value

| Property | Type | Description |
|----------|------|-------------|
| cache | WebStorageCache | Underlying WebStorageCache instance |
| prefix | string | Cache key prefix |
| set | Function | Set cache |
| get | Function | Get cache |
| remove | Function | Remove cache |
| removeAllExpires | Function | Remove all expired cache |
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

// Update cache expiration time (extend by 60 seconds)
touch('userInfo', 60)
```

### Practical Application Scenario

```typescript
// Used in user login component
const { set, get } = useCache()

// Save user login information
const saveUserInfo = (userInfo: any) => {
  set('userInfo', userInfo, { exp: 24 * 60 * 60 }) // Expires in 24 hours
}

// Get user information
const getUserInfo = () => {
  return get('userInfo', null)
}
```

## useDialog()

A Hook for creating dialogs, providing complete dialog lifecycle management, supporting custom titles, properties, and event callbacks.

**Source Path:** `/web/src/hooks/useDialog.ts`
**GitHub Link:** [View Source](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useDialog.ts)

### Type Definition

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

### Return Value

| Property | Type | Description |
|----------|------|-------------|
| on | Object | Event callback configuration |
| Dialog | Component | Dialog component |
| open | Function | Open the dialog |
| close | Function | Close the dialog |
| setTitle | Function | Set the dialog title |
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
      console.log('User clicked confirm')
      close()
    }

    on.cancel = () => {
      console.log('User clicked cancel')
      return true // Return true to allow closing
    }

    // Open dialog
    const openDialog = () => {
      setTitle('Edit User Information')
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
  setTitle('Edit User Information')
  open()
}

// Handle form submission
const handleSubmit = async (formData) => {
  try {
    console.log('Submitting user data:', formData)
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

A Hook for integrating the ECharts chart library, providing theme switching and chart initialization functionality.

**Source Path:** `/web/src/hooks/useEcharts.ts`
**GitHub Link:** [View Source](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useEcharts.ts)

### Exported Functions

| Function | Type | Description |
|----------|------|-------------|
| useEcharts | Function | useEcharts function from @mineadmin/echarts |
| themeMode | Function | Get the current theme mode |

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
        theme: themeMode(), // Use the current theme
        xAxis: {
          type: 'category',
          data: ['January', 'February', 'March', 'April', 'May']
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
    title: { text: 'Page View Statistics' },
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

A Hook for form operations, providing form instance retrieval and manipulation.

**Source Path:** `/web/src/hooks/useForm.ts`
**GitHub Link:** [View Source](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useForm.ts)

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| refName | string | Form reference name |

### Return Value

Returns a Promise that resolves to a `MaFormExpose` type form instance.

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
    rules: [{ required: true, message: 'Please enter a username' }]
  },
  {
    title: 'Email',
    dataIndex: 'email',
    formType: 'input',
    rules: [{ required: true, type: 'email', message: 'Please enter a valid email' }]
  }
]

const handleSubmit = async () => {
  try {
    const formInstance = await useForm('userForm')
    
    // Form submission logic
    console.log('Form submitted')
  } catch (error) {
    console.error('Submission failed:', error)
  }
}
</script>
```

## useTable()

A Hook for table operations, providing table instance retrieval and manipulation.

**Source Path:** `/web/src/hooks/useTable.ts`
**GitHub Link:** [View Source](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useTable.ts)

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| refName | string | Table reference name |

### Return Value

Returns a Promise that resolves to a `MaTableExpose` type table instance.

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
    
    await ElMessageBox.confirm('Are you sure you want to delete the selected users?')
    
    const ids = selectedRows.map(row => row.id)
    await deleteUsers(ids)
    
    // Refresh table and clear selection
    await tableInstance.refresh()
    tableInstance.clearSelection()
    
    ElMessage.success('Delete successful')
  } catch (error) {
    ElMessage.error('Delete failed')
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
| key | any \| null | null | Translation key name, returns the translation function when null |

### Return Value

- When `key` is null, returns the translation function `ComposerTranslation`
- When `key` has a value, returns the translated string

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

const userName = ref('Administrator')
const welcomeMessage = computed(() => 
  t('user.welcomeMessage', { name: userName.value })
)

const showWelcome = () => {
  ElMessage.success(t('user.welcomeBack'))
}
</script>
```

## useMessage()

A Hook for message prompts, wrapping Element Plus message components and providing a unified message prompt interface.

**Source Path:** `/web/src/hooks/useMessage.ts`
**GitHub Link:** [View Source](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useMessage.ts)

### Return Value

| Method | Parameters | Description |
|--------|------------|-------------|
| info | (content: string) | Display info message |
| error | (content: string) | Display error message |
| success | (content: string) | Display success message |
| warning | (content: string) | Display warning message |
| alert | (content: string) | Display alert dialog |
| alertError | (content: string) | Display error alert dialog |
| alertSuccess | (content: string) | Display success alert dialog |
| alertWarning | (content: string) | Display warning alert dialog |
| notify | (content: string, args?: Record<string, any>) | Display notification |
| notifyError | (content: string) | Display error notification |
| notifySuccess | (content: string) | Display success notification |
| notifyWarning | (content: string) | Display warning notification |
| confirm | (content: string, tip?: string) | Display confirmation dialog |
| delConfirm | (content?: string, tip?: string) | Display delete confirmation dialog |
| exportConfirm | (content?: string, tip?: string) | Display export confirmation dialog |
| prompt | (content: string, defaultValue?: string, tip?: string, inputValidator?: MessageBoxInputValidator) | Display input dialog |

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
        await message.confirm('Are you sure you want to perform this operation?')
        console.log('User confirmed the operation')
      } catch {
        console.log('User canceled the operation')
      }
    }

    const handleDelete = async () => {
      try {
        await message.delConfirm()
        console.log('Executing delete operation')
      } catch {
        console.log('Canceled deletion')
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
import { saveUserData, deleteUserById, exportUserData } from '@/api/user'

const message = useMessage()

// Save data
const saveData = async () => {
  try {
    await saveUserData({ name: 'test', email: 'test@example.com' })
    message.success('Data saved successfully')
  } catch (error) {
    message.error('Save failed: ' + error.message)
  }
}

// Delete item
const deleteItem = async () => {
  try {
    await message.delConfirm('Are you sure you want to delete this user?')
    await deleteUserById(123)
    message.success('Delete successful')
  } catch (error) {
    if (error !== 'cancel') {
      message.error('Delete failed')
    }
  }
}

// Export data
const exportData = async () => {
  try {
    await message.exportConfirm()
    const data = await exportUserData()
    message.notifySuccess('Data export completed')
  } catch (error) {
    if (error !== 'cancel') {
      message.notifyError('Export failed')
    }
  }
}

// Display custom notification
const showCustomNotify = () => {
  message.notify('This is a custom notification', {
    type: 'info',
    duration: 5000,
    position: 'top-right'
  })
}
</script>
```

## useTabCollection()

A Hook for tab page collection, allowing users to bookmark and manage commonly used tabs.

**Source Path:** `/web/src/hooks/useTabCollection.ts`
**GitHub Link:** [View Source](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useTabCollection.ts)

### Return Value

| Property | Type | Description |
|----------|------|-------------|
| tabCollection | Ref<MineTabbar[]> | List of collected tabs |
| addToCollection | Function | Add a tab to the collection |
| removeCollection | Function | Remove a tab from the collection |

### Usage Example

```typescript
import useTabCollection from '@/hooks/useTabCollection'

export default defineComponent({
  setup() {
    const { tabCollection, addToCollection, removeCollection } = useTabCollection()

    // Add current tab to collection
    const addCurrentTab = () => {
      addToCollection() // Without parameters, it automatically gets the current tab
    }

    // Add specified tab to collection
    const addSpecificTab = () => {
      const tab = {
        name: 'userList',
        title: 'User List',
        path: '/user/list',
        fullPath: '/user/list?status=active',
        icon: 'user'
      }
      addToCollection(tab)
    }

    // Remove from collection
    const removeTab = (tab) => {
      removeCollection(tab)
    }

    return {
      tabCollection,
      addCurrentTab,
      addSpecificTab,
      removeTab
    }
  }
})
```

### Practical Application Scenario

```vue
<template>
  <div class="tab-collection">
    <div class="collection-header">
      <h3>My Bookmarks</h3>
      <el-button @click="addCurrentTab" size="small">
        <el-icon><Star /></el-icon>
        Bookmark Current Page
      </el-button>
    </div>
    
    <div class="collection-list">
      <div 
        v-for="tab in tabCollection" 
        :key="tab.fullPath"
        class="collection-item"
      >
        <el-icon v-if="tab.icon">
          <component :is="tab.icon" />
        </el-icon>
        <span class="tab-title" @click="goToTab(tab)">
          {{ tab.title }}
        </span>
        <el-button 
          @click="removeTab(tab)" 
          type="text" 
          size="small"
          class="remove-btn"
        >
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import useTabCollection from '@/hooks/useTabCollection'
import { Star, Close } from '@element-plus/icons-vue'

const router = useRouter()
const { tabCollection, addToCollection, removeCollection } = useTabCollection()

// Add current tab to collection
const addCurrentTab = () => {
  addToCollection()
}

// Navigate to specified tab
const goToTab = (tab) => {
  router.push(tab.fullPath)
}

// Remove from collection
const removeTab = (tab) => {
  removeCollection(tab)
}
</script>

<style scoped>
.collection-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.tab-title {
  flex: 1;
  margin-left: 8px;
  cursor: pointer;
}

.tab-title:hover {
  color: var(--el-color-primary);
}

.remove-btn {
  margin-left: auto;
}
</style>
```

## useImageViewer()

A Hook for image preview, based on Element Plus's ImageViewer component, supporting multi-image browsing.

**Source Path:** `/web/src/hooks/useImageViewer.ts`
**GitHub Link:** [View Source](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useImageViewer.ts)

### Type Definition

```typescript
type Options = Partial<Omit<ImageViewerProps, 'urlList'>>
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| images | string[] | Array of image URLs |
| options | Options | Image viewer configuration options |

### Usage Example

```typescript
import { useImageViewer } from '@/hooks/useImageViewer'

export default defineComponent({
  setup() {
    const previewImages = () => {
      const images = [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
        'https://example.com/image3.jpg'
      ]

      useImageViewer(images, {
        initialIndex: 0, // Start with the first image
        zIndex: 3000,    // Set z-index
        hideOnClickModal: true // Close on modal click
      })
    }

    return { previewImages }
  }
})
```

### Practical Application Scenario

```vue
<template>
  <div class="image-gallery">
    <div 
      v-for="(image, index) in imageList" 
      :key="index"
      class="image-item"
      @click="previewImage(index)"
    >
      <img :src="image" alt="Image" />
      <div class="image-overlay">
        <el-icon><ZoomIn /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useImageViewer } from '@/hooks/useImageViewer'
import { ZoomIn } from '@element-plus/icons-vue'

const imageList = ref([
  'https://example.com/gallery/img1.jpg',
  'https://example.com/gallery/img2.jpg',
  'https://example.com/gallery/img3.jpg',
  'https://example.com/gallery/img4.jpg'
])

// Preview image
const previewImage = (index) => {
  useImageViewer(imageList.value, {
    initialIndex: index, // Start from the clicked image
    zIndex: 2500,
    hideOnClickModal: true,
    // Custom close callback
    onClose: () => {
      console.log('Image preview closed')
    }
  })
}

// Preview single image
const previewSingleImage = (imageUrl) => {
  useImageViewer([imageUrl], {
    zIndex: 2500,
    hideOnClickModal: true
  })
}
</script>

<style scoped>
.image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.image-item {
  position: relative;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
}

.image-item img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  transition: transform 0.3s;
}

.image-item:hover img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-item:hover .image-overlay {
  opacity: 1;
}

.image-overlay .el-icon {
  color: white;
  font-size: 24px;
}
</style>
```

## useResourcePicker()

A Hook for resource selection, providing file, image, and other resource selection functionality.

**Source Path:** `/web/src/hooks/useResourcePicker.ts`
**GitHub Link:** [View Source](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useResourcePicker.ts)

### Type Definition

```typescript
export type WithOnEventListeners<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]?: T[K];
}

type Options = Partial<ResourcePickerProps & WithOnEventListeners<ResourcePickerEmits>>
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| options | Options | Resource picker configuration options |

### Usage Example

```typescript
import { useResourcePicker } from '@/hooks/useResourcePicker'

export default defineComponent({
  setup() {
    const selectSingleFile = () => {
      useResourcePicker({
        multiple: false,
        defaultFileType: 'image',
        onConfirm: (resources) => {
          console.log('Selected resources:', resources)
          // Handle selected resources
          if (resources.length > 0) {
            const selectedFile = resources[0]
            console.log('File name:', selectedFile.origin_name)
            console.log('File URL:', selectedFile.url)
          }
        },
        onCancel: () => {
          console.log('User canceled the selection')
        }
      })
    }

    const selectMultipleImages = () => {
      useResourcePicker({
        multiple: true,
        limit: 5, // Maximum of 5 files
        defaultFileType: 'image',
        onConfirm: (resources) => {
          console.log('Selected images:', resources)
          // Batch process images
          resources.forEach(image => {
            console.log(`Image: ${image.origin_name}, URL: ${image.url}`)
          })
        }
      })
    }

    return {
      selectSingleFile,
      selectMultipleImages
    }
  }
})
```

### Practical Application Scenario

```vue
<template>
  <div class="resource-demo">
    <div class="upload-area">
      <el-button @click="selectAvatar">Select Avatar</el-button>
      <div v-if="avatarUrl" class="avatar-preview">
        <img :src="avatarUrl" alt="Avatar Preview" />
      </div>
    </div>

    <div class="gallery-area">
      <el-button @click="selectGalleryImages">Select Images</el-button>
      <div class="gallery-preview">
        <div 
          v-for="(image, index) in galleryImages" 
          :key="index"
          class="gallery-item"
        >
          <img :src="image.url" :alt="image.origin_name" />
          <p>{{ image.origin_name }}</p>
        </div>
      </div>
    </div>

    <div class="file-area">
      <el-button @click="selectDocuments">Select Documents</el-button>
      <ul class="file-list">
        <li v-for="(file, index) in documentFiles" :key="index">
          <span>{{ file.origin_name }}</span>
          <span>{{ file.size_info }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useResourcePicker } from '@/hooks/useResourcePicker'

const avatarUrl = ref('')
const galleryImages = ref([])
const documentFiles = ref([])

// Select avatar
const selectAvatar = () => {
  useResourcePicker({
    multiple: false,
    defaultFileType: 'image',
    fileTypes: [
      { value: 'image', label: 'Images', suffix: 'jpg,jpeg,png,gif' }
    ],
    onConfirm: (resources) => {
      if (resources.length > 0) {
        avatarUrl.value = resources[0].url
        ElMessage.success('Avatar selected successfully')
      }
    }
  })
}

// Select gallery images
const selectGalleryImages = () => {
  useResourcePicker({
    multiple: true,
    limit: 10,
    defaultFileType: 'image',
    onConfirm: (resources) => {
      galleryImages.value = resources
      ElMessage.success(`Selected ${resources.length} images`)
    }
  })
}

// Select documents
const selectDocuments = () => {
  useResourcePicker({
    multiple: true,
    limit: 20,
    defaultFileType: 'document',
    fileTypes: [
      { value: 'document', label: 'Documents', suffix: 'pdf,doc,docx,xls,xlsx,ppt,pptx' },
      { value: 'text', label: 'Text Files', suffix: 'txt,md' }
    ],
    onConfirm: (resources) => {
      documentFiles.value = resources
      ElMessage.success(`Selected ${resources.length} documents`)
    }
  })
}
</script>

<style scoped>
.resource-demo {
  padding: 20px;
}

.upload-area, .gallery-area, .file-area {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.avatar-preview img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-top: 10px;
}

.gallery-preview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.gallery-item img {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.file-list {
  list-style: none;
  padding: 0;
  margin-top: 16px;
}

.file-list li {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  border-bottom: 1px solid #f0f0f0;
}
</style>
```

## useWatermark()

A Hook for adding watermarks, supporting text watermark addition and removal, automatically adapting to dark and light themes.

**Source Path:** `/web/src/hooks/useWatermark.ts`
**GitHub Link:** [View Source](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useWatermark.ts)

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| appendEl | HTMLElement \| null | document.body | The target element to which the watermark is added |

### Return Value

| Method | Parameters | Description |
|--------|------------|-------------|
| setWatermark | (str: string \| string[]) | Set watermark text |
| clear | () | Clear the watermark |

### Usage Example

```typescript
import useWatermark from '@/hooks/useWatermark'

export default defineComponent({
  setup() {
    // Default to document.body
    const { setWatermark, clear } = useWatermark()

    // Add to specified element
    const containerRef = ref()
    const { setWatermark: setContainerWatermark, clear: clearContainer } = 
      useWatermark(containerRef.value)

    onMounted(() => {
      // Set single-line watermark
      setWatermark('MineAdmin Internal System')

      // Set multi-line watermark
      setWatermark(['MineAdmin', 'Management System', '2024'])
    })

    onUnmounted(() => {
      // Clear watermark when component unmounts
      clear()
    })

    return {
      containerRef,
      setWatermark,
      clear
    }
  }
})
```

### Practical Application Scenario

```vue
<template>
  <div class="watermark-demo">
    <div class="control-panel">
      <el-input 
        v-model="watermarkText" 
        placeholder="Enter watermark text"
        style="width: 200px; margin-right: 16px;"
      />
      <el-button @click="addWatermark">Add Watermark</el-button>
      <el-button @click="removeWatermark">Clear Watermark</el-button>
    </div>

    <div class="watermark-modes">
      <el-button @click="setSystemWatermark">System Watermark</el-button>
      <el-button @click="setUserWatermark">User Watermark</el-button>
      <el-button @click="setMultiLineWatermark">Multi-line Watermark</el-button>
    </div>

    <div 
      ref="previewArea" 
      class="preview-area"
      style="position: relative; height: 400px; border: 1px solid #ccc;"
    >
      <h3>Preview Area</h3>
      <p>This is the content area. The watermark will be overlaid on top of this area.</p>
      <el-button @click="addAreaWatermark">Add Watermark to This Area</el-button>
      <el-button @click="clearAreaWatermark">Clear Area Watermark</el-button>
    </div>
  </div>
</template>

<script setup>
import useWatermark from '@/hooks/useWatermark'
import { useUserStore } from '@/store/modules/useUserStore'

const userStore = useUserStore()
const previewArea = ref()

// Global watermark
const { setWatermark: setGlobalWatermark, clear: clearGlobal } = useWatermark()

// Area watermark
const { setWatermark: setAreaWatermark, clear: clearArea } = useWatermark()

const watermarkText = ref('MineAdmin')

// Add watermark
const addWatermark = () => {
  if (watermarkText.value.trim()) {
    setGlobalWatermark(watermarkText.value)
    ElMessage.success('Watermark added successfully')
  } else {
    ElMessage.warning('Please enter