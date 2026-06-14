# Responsive Tables

Showcases features such as adaptive height, responsive layout, and loading states for tables.

## Responsive Table Demo

<DemoPreview dir="demos/ma-table/responsive" />

## Features

### Adaptive Height
- **Dynamic Height**: Table height adjusts automatically based on window size.
- **Bottom Offset**: Configurable offset from the bottom of the page.
- **Window Listener**: Listens for window resize events and responds in real-time.
- **Container Adaptation**: Automatically adjusts based on the parent container's size.

### Responsive Layout
- **Column Width Adaptation**: Column widths adjust automatically based on content and available space.
- **Mobile Adaptation**: Optimizes display on small screen devices.
- **Size Control**: Supports large, medium, and small table sizes.

### Loading State
- **Loading Animation**: Displays an overlay and animation during data loading.
- **Custom Configuration**: Customizable loading text, icon, background, etc.
- **State Control**: Programmatic control over displaying and hiding the loading state.

## Configuration Examples

### Adaptive Height Configuration
```javascript
const options = {
  adaption: true,              // Enable adaptive height
  adaptionOffsetBottom: 100,   // Offset from bottom (px)
  containerHeight: 'auto'      // Container height setting
}
```

### Loading State Configuration
```javascript
const options = {
  loading: false,              // Loading state
  loadingConfig: {
    text: 'Data loading...',      // Loading text
    spinner: 'el-icon-loading', // Loading icon
    background: 'rgba(0, 0, 0, 0.7)', // Background color
    customClass: 'custom-loading'      // Custom CSS class
  }
}
```

### Responsive Column Configuration
```javascript
const columns = [
  { 
    label: 'Title', 
    prop: 'title',
    minWidth: 200,              // Minimum width
    showOverflowTooltip: true   // Show tooltip on overflow
  },
  { 
    label: 'Description', 
    prop: 'description',
    width: 'auto',              // Adaptive width
    align: 'left'
  }
]
```

### Dynamic Control Example
```vue
<template>
  <div>
    <!-- Control Panel -->
    <div class="control-panel">
      <el-switch 
        v-model="adaptionEnabled"
        @change="toggleAdaption"
        active-text="Adaptive Height"
      />
      
      <el-slider 
        v-model="offsetBottom"
        :min="50"
        :max="200"
        @change="updateOffset"
        style="width: 200px;"
      />
      
      <el-button @click="simulateLoading">
        Refresh Data
      </el-button>
    </div>
    
    <ma-table 
      ref="tableRef"
      :columns="columns" 
      :data="data" 
      :options="options" 
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'

const tableRef = ref()
const adaptionEnabled = ref(true)
const offsetBottom = ref(100)

const options = reactive({
  adaption: true,
  adaptionOffsetBottom: 100,
  loading: false,
  loadingConfig: {
    text: 'Data loading...',
    background: 'rgba(0, 0, 0, 0.7)'
  }
})

// Toggle adaptive height
const toggleAdaption = (enabled) => {
  options.adaption = enabled
  tableRef.value?.setOptions(options)
}

// Update bottom offset
const updateOffset = (value) => {
  options.adaptionOffsetBottom = value
  tableRef.value?.setOptions(options)
}

// Simulate loading
const simulateLoading = async () => {
  tableRef.value?.setLoadingState(true)
  
  try {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Update data
    await refreshData()
    
  } finally {
    tableRef.value?.setLoadingState(false)
  }
}

// Window resize listener
const handleResize = () => {
  // The table will automatically respond to window changes; additional logic can be added here
  console.log('Window resized')
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
```

## Responsive Parameters

### Adaptive Configuration

| Parameter | Description | Type | Default |
|-----------|-------------|------|---------|
| `adaption` | Enable adaptive height | `boolean` | `false` |
| `adaptionOffsetBottom` | Offset from bottom (px) | `number` | `70` |
| `containerHeight` | Container height setting | `string` | - |
| `height` | Table height | `string \| number` | - |
| `maxHeight` | Table maximum height | `string \| number` | - |

### Loading Configuration

| Parameter | Description | Type | Default |
|-----------|-------------|------|---------|
| `loading` | Show loading state | `boolean` | `false` |
| `loadingConfig.text` | Loading prompt text | `string` | - |
| `loadingConfig.spinner` | Custom loading icon | `string` | - |
| `loadingConfig.svg` | Custom SVG icon | `string` | - |
| `loadingConfig.background` | Overlay background color | `string` | - |
| `loadingConfig.customClass` | Custom CSS class | `string` | - |

### Responsive Column Configuration

| Parameter | Description | Type | Default |
|-----------|-------------|------|---------|
| `minWidth` | Minimum column width | `string \| number` | - |
| `showOverflowTooltip` | Show tooltip on text overflow | `boolean` | `false` |
| `fit` | Column width stretches automatically | `boolean` | `true` |

## Exposed Methods

| Method Name | Description | Parameters | Return Value |
|-------------|-------------|------------|--------------|
| `setLoadingState` | Set loading state | `loading: boolean` | - |
| `setOptions` | Update table configuration | `options: MaTableOptions` | - |

## Usage Scenarios

### 1. Full-Screen Table
```javascript
const fullScreenOptions = {
  adaption: true,
  adaptionOffsetBottom: 0,  // No bottom offset
  containerHeight: '100vh',
  showPagination: false
}
```

### 2. Table in a Dialog
```javascript
const dialogTableOptions = {
  adaption: false,
  height: '400px',         // Fixed height
  maxHeight: '400px'
}
```

### 3. Mobile Adaptation
```javascript
const mobileOptions = {
  size: 'small',           // Small size
  showOverflowTooltip: true,
  columnAlign: 'left',     // Left alignment is more suitable for mobile
  showPagination: true,
  pagination: {
    size: 'small',
    layout: 'prev, pager, next'  // Simplified pagination layout
  }
}
```

### 4. Data Refresh Scenario
```vue
<script setup>
// Data refresh with loading state
const refreshWithLoading = async () => {
  try {
    // Enable loading state
    tableRef.value?.setLoadingState(true)
    
    // Fetch new data
    const newData = await api.fetchTableData()
    
    // Update data
    tableRef.value?.setData(newData)
    
    ElMessage.success('Data refreshed successfully')
    
  } catch (error) {
    ElMessage.error('Data refresh failed')
    console.error(error)
    
  } finally {
    // Disable loading state
    tableRef.value?.setLoadingState(false)
  }
}

// Timed refresh
let refreshTimer = null

const startAutoRefresh = () => {
  refreshTimer = setInterval(refreshWithLoading, 30000) // Refresh every 30 seconds
}

const stopAutoRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

onMounted(startAutoRefresh)
onUnmounted(stopAutoRefresh)
</script>
```

## Best Practices

1. **Use Adaptation Wisely**: Use adaptive height in main page areas and fixed height in scenarios like dialogs.
2. **Loading State Management**: Manage loading states uniformly to avoid duplicate displays.
3. **Responsive Design**: Consider display effects across different screen sizes.
4. **Performance Optimization**: Avoid frequent height calculations and DOM operations.
5. **User Experience**: Provide clear loading feedback and error handling.

## Notes

- Adaptive height depends on window size and may be inaccurate in hidden states.
- Loading state display and hiding should be paired to avoid state confusion.
- Touch operation experience is especially important on mobile devices.
- Window resize listeners should be cleaned up promptly to avoid memory leaks.

## CSS Variable Customization

```css
/* Custom table responsive styles */
.ma-table {
  --table-border-color: #ebeef5;
  --table-text-color: #606266;
  --table-header-background: #f5f7fa;
  --table-row-hover-background: #f5f7fa;
}

/* Mobile adaptation */
@media (max-width: 768px) {
  .ma-table {
    font-size: 12px;
  }
  
  .ma-table .cell {
    padding: 8px 4px;
  }
}
```