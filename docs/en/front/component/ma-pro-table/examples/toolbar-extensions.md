# Toolbar Extensions

Demonstrates how to extend toolbar functionality through the plugin API, including custom tool buttons and toolbar layouts.

<DemoPreview dir="demos/ma-pro-table-examples/toolbar-extensions" />

## Features

- **Plugin Mechanism**: Extend toolbar functionality via plugin API
- **Custom Tools**: Supports registering custom tool buttons
- **Slot Extensions**: Supports extending toolbar layout through slots
- **State Control**: Supports dynamic show/hide of tools
- **Order Control**: Supports custom tool display order

## Plugin API Extensions

### Registering Toolbar Plugins
```javascript
import { useProTableToolbar } from '@mineadmin/pro-table'

const { add, remove, hide, show } = useProTableToolbar()

// Add custom tool
add({
  name: 'statistics',           // Tool name (unique identifier)
  render: ({ proxy }) => (      // Render function
    <el-button
      circle
      type="info"
      title="Data Statistics"
      onClick={() => showStatistics()}
    >
      <el-icon><ChatDotRound /></el-icon>
    </el-button>
  ),
  show: true,                   // Whether to display
  order: 1                      // Display order
})
```

### Toolbar Management Methods
```javascript
const { add, remove, hide, show, get, getAll } = useProTableToolbar()

// Add tool
add(toolbar)

// Remove tool
remove('tool-name')

// Hide tool
hide('tool-name')

// Show tool
show('tool-name')

// Get single tool
const tool = get('tool-name')

// Get all tools
const allTools = getAll()
```

## Common Tool Examples

### 1. Data Statistics Tool
```javascript
add({
  name: 'statistics',
  render: ({ proxy }) => (
    <el-button
      circle
      type="info"
      title="Data Statistics"
      onClick={() => {
        const stats = calculateStatistics(proxy.getTableData())
        ElNotification({
          title: 'Data Statistics',
          message: `Total: ${stats.total} | Active: ${stats.active}`,
          type: 'info'
        })
      }}
    >
      <el-icon><ChatDotRound /></el-icon>
    </el-button>
  ),
  show: true,
  order: 1
})
```

### 2. Export Tool
```javascript
add({
  name: 'export',
  render: ({ proxy }) => (
    <el-button
      circle
      type="success"
      title="Export Data"
      onClick={() => {
        const data = proxy.getTableData()
        exportToExcel(data)
        ElMessage.success('Exporting...')
      }}
    >
      <el-icon><Download /></el-icon>
    </el-button>
  ),
  show: true,
  order: 2
})
```

### 3. Import Tool
```javascript
add({
  name: 'import',
  render: ({ proxy }) => (
    <el-button
      circle
      type="warning"
      title="Import Data"
      onClick={() => {
        ElMessageBox.confirm('Confirm import?', 'Import Confirmation', {
          type: 'warning'
        }).then(() => {
          // Trigger file selection or show import dialog
          showImportDialog(proxy)
        })
      }}
    >
      <el-icon><Upload /></el-icon>
    </el-button>
  ),
  show: true,
  order: 3
})
```

### 4. Settings Tool
```javascript
add({
  name: 'settings',
  render: ({ proxy }) => (
    <el-button
      circle
      type="primary"
      title="Advanced Settings"
      onClick={() => {
        showSettingsDialog(proxy)
      }}
    >
      <el-icon><Setting /></el-icon>
    </el-button>
  ),
  show: true,
  order: 4
})
```

### 5. Custom Refresh Tool
```javascript
add({
  name: 'refresh',
  render: ({ proxy }) => (
    <el-button
      circle
      title="Refresh Data"
      onClick={async () => {
        ElMessage.info('Refreshing...')
        await proxy.refresh()
        ElMessage.success('Refresh completed')
      }}
    >
      <el-icon><Refresh /></el-icon>
    </el-button>
  ),
  show: true,
  order: 0                      // Highest priority
})
```

## Slot Extensions

### Left Toolbar Extension
```vue
<template>
  <MaProTable :options="options" :schema="schema">
    <template #toolbarLeft>
      <div class="custom-toolbar-left">
        <el-space>
          <el-text type="primary">Total {{ totalCount }} records</el-text>
          <el-divider direction="vertical" />
          <el-text type="success">Active {{ activeCount }} users</el-text>
        </el-space>
      </div>
    </template>
  </MaProTable>
</template>
```

### Table Top Action Area
```vue
<template>
  <MaProTable :options="options" :schema="schema">
    <template #tableTop>
      <div class="table-top-actions">
        <el-space>
          <el-button type="primary" size="small" @click="handleBatchAdd">
            <el-icon><Plus /></el-icon>
            Batch Add
          </el-button>
          <el-button type="warning" size="small" @click="handleBatchEdit">
            <el-icon><Edit /></el-icon>
            Batch Edit
          </el-button>
          <el-button type="danger" size="small" @click="handleBatchDelete">
            <el-icon><Delete /></el-icon>
            Batch Delete
          </el-button>
        </el-space>
      </div>
    </template>
  </MaProTable>
</template>
```

### Toolbar Before/After Extensions
```vue
<template>
  <MaProTable :options="options" :schema="schema">
    <!-- Pre-toolbar content -->
    <template #beforeToolbar>
      <el-button size="small" type="text">Pre-button</el-button>
    </template>
    
    <!-- Post-toolbar content -->
    <template #afterToolbar>
      <el-button size="small" type="text">Post-button</el-button>
    </template>
  </MaProTable>
</template>
```

## Tool State Control

### Configuring Tool Display State
```javascript
const options = {
  toolbar: true,                // Whether to show toolbar
  toolStates: {
    size: true,                 // Show size adjustment tool
    setting: true,              // Show column settings tool
    fullscreen: true,           // Show fullscreen tool
    refresh: false              // Hide refresh tool
  }
}
```

### Dynamic Tool State Control
```javascript
// Runtime control
const { hide, show } = useProTableToolbar()

// Hide a tool
hide('statistics')

// Show a tool
show('statistics')

// Conditional display
const shouldShowExport = computed(() => hasPermission('export'))
add({
  name: 'export',
  show: shouldShowExport.value,
  render: ({ proxy }) => (...)
})
```

## Advanced Tool Examples

### System Monitor Tool
```javascript
add({
  name: 'monitor',
  render: ({ proxy }) => (
    <el-button
      circle
      type="danger"
      title="System Monitor"
      onClick={() => {
        // Get system status
        const status = getSystemStatus()
        ElNotification({
          title: 'System Monitor',
          message: `CPU: ${status.cpu}% | Memory: ${status.memory}% | DB: ${status.db}`,
          type: 'warning',
          duration: 4000
        })
      }}
    >
      <el-icon><Warning /></el-icon>
    </el-button>
  ),
  show: true,
  order: 5
})
```

### Batch Operations Tool
```javascript
add({
  name: 'batch-operations',
  render: ({ proxy }) => (
    <el-dropdown
      trigger="click"
      onCommand={(command) => handleBatchCommand(command, proxy)}
    >
      {{
        default: () => (
          <el-button circle type="warning" title="Batch Operations">
            <el-icon><MoreFilled /></el-icon>
          </el-button>
        ),
        dropdown: () => (
          <el-dropdown-menu>
            <el-dropdown-item command="approve">Batch Approve</el-dropdown-item>
            <el-dropdown-item command="reject">Batch Reject</el-dropdown-item>
            <el-dropdown-item command="delete" divided>Batch Delete</el-dropdown-item>
          </el-dropdown-menu>
        )
      }}
    </el-dropdown>
  ),
  show: true,
  order: 6
})
```

### Real-time Data Tool
```javascript
add({
  name: 'realtime',
  render: ({ proxy }) => {
    const [isRealtime, setIsRealtime] = useState(false)
    
    return (
      <el-button
        circle
        type={isRealtime ? 'success' : 'info'}
        title={isRealtime ? 'Stop Real-time Refresh' : 'Start Real-time Refresh'}
        onClick={() => {
          setIsRealtime(!isRealtime)
          if (!isRealtime) {
            startRealtimeRefresh(proxy)
          } else {
            stopRealtimeRefresh()
          }
        }}
      >
        <el-icon>{isRealtime ? <VideoPause /> : <VideoPlay />}</el-icon>
      </el-button>
    )
  },
  show: true,
  order: 7
})
```

## Toolbar Type Definitions

```typescript
interface MaProTableToolbar {
  name: string                          // Tool name
  render: (props: {                     // Render function
    proxy: MaProTableExpose
  }) => VNode | Component
  show: boolean | (() => boolean)       // Whether to display
  order: number                         // Display order
}
```

## Best Practices

### 1. Tool Naming
- Use descriptive names
- Avoid conflicts with built-in tools
- Maintain naming consistency

### 2. User Experience
- Provide clear tooltips
- Use appropriate icons and colors
- Consider logical grouping of tools

### 3. Performance Optimization
- Avoid heavy computations in render functions
- Use reactive states appropriately
- Remove unnecessary tools when needed

### 4. Permission Control
```javascript
add({
  name: 'admin-tool',
  show: () => hasRole('admin'),         // Display based on permissions
  render: ({ proxy }) => (...)
})
```

The toolbar extension functionality allows you to build feature-rich table operation interfaces, enhancing user interaction experience.