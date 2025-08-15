# Multi-Select Table

Demonstrates the multi-select functionality of tables, including single selection, select all, batch operations, etc.

## Multi-Select Table Demo

<DemoPreview dir="demos/ma-table/selection" />

## Features

### Selection Control
- **Single-row selection**: Click checkbox to select single row data
- **Select all**: Header checkbox to select/deselect all
- **Selection constraints**: Configure certain rows as non-selectable
- **Selection persistence**: Supports maintaining selection state across pages

### Batch Operations
- **Batch processing**: Perform operations based on selected rows
- **Selection statistics**: Real-time display of selected record count and status
- **Operation feedback**: Confirmation and result feedback for batch operations

## Configuration Examples

### Basic Multi-Select Configuration
```javascript
const columns = [
  {
    type: 'selection',        // Multi-select column
    width: 50,
    selectable: (row, index) => {
      // Set selection constraints
      return row.status !== 'disabled'
    }
  },
  { label: 'Name', prop: 'name' },
  { label: 'Status', prop: 'status' }
]
```

### Listening to Selection Events
```javascript
const options = {
  on: {
    onSelect: (selection, row) => {
      console.log('Single selection:', row, selection.includes(row) ? 'selected' : 'deselected')
    },
    onSelectAll: (selection) => {
      console.log('Select all:', selection.length > 0 ? 'select all' : 'deselect all')
    },
    onSelectionChange: (selection) => {
      console.log('Selection changed:', selection)
      // Update selected state
      selectedRows.value = selection
    }
  }
}
```

### Programmatic Selection Control
```vue
<template>
  <div>
    <div class="selection-controls">
      <el-button @click="selectAll">Select All</el-button>
      <el-button @click="clearSelection">Clear Selection</el-button>
      <el-button @click="toggleSelection">Toggle Selection</el-button>
      <el-button @click="selectActive">Select Active Status</el-button>
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
const tableRef = ref()
const selectedRows = ref([])

// Select all
const selectAll = () => {
  const selectableRows = data.value.filter(row => row.status !== 'disabled')
  selectableRows.forEach(row => {
    tableRef.value?.getElTableRef()?.toggleRowSelection(row, true)
  })
}

// Clear selection
const clearSelection = () => {
  tableRef.value?.getElTableRef()?.clearSelection()
}

// Toggle selection
const toggleSelection = () => {
  data.value.forEach(row => {
    if (row.status !== 'disabled') {
      const isSelected = selectedRows.value.includes(row)
      tableRef.value?.getElTableRef()?.toggleRowSelection(row, !isSelected)
    }
  })
}

// Select rows meeting specific conditions
const selectActive = () => {
  const activeRows = data.value.filter(row => row.status === 'active')
  activeRows.forEach(row => {
    tableRef.value?.getElTableRef()?.toggleRowSelection(row, true)
  })
}
</script>
```

### Batch Operation Example
```vue
<template>
  <div>
    <!-- Batch operation toolbar -->
    <div v-if="selectedRows.length > 0" class="batch-toolbar">
      <span>Selected {{ selectedRows.length }} records</span>
      <el-button type="success" @click="batchActivate">
        Batch Activate
      </el-button>
      <el-button type="warning" @click="batchDeactivate">
        Batch Deactivate
      </el-button>
      <el-button type="danger" @click="batchDelete">
        Batch Delete
      </el-button>
    </div>
    
    <ma-table 
      :columns="columns" 
      :data="data" 
      :options="options" 
    />
  </div>
</template>

<script setup>
// Batch activate
const batchActivate = async () => {
  try {
    await ElMessageBox.confirm(
      `Confirm activating ${selectedRows.value.length} selected users?`,
      'Batch Activate',
      { type: 'warning' }
    )
    
    // Execute batch operation
    const ids = selectedRows.value.map(row => row.id)
    await api.batchActivateUsers(ids)
    
    // Update local data
    selectedRows.value.forEach(row => {
      row.status = 'active'
    })
    
    ElMessage.success('Batch activation successful')
    clearSelection()
    
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Batch activation failed')
    }
  }
}

// Batch delete
const batchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `Confirm deleting ${selectedRows.value.length} selected records? This cannot be undone!`,
      'Batch Delete',
      { type: 'error' }
    )
    
    const ids = selectedRows.value.map(row => row.id)
    await api.batchDeleteUsers(ids)
    
    // Remove from local data
    data.value = data.value.filter(row => !ids.includes(row.id))
    
    ElMessage.success('Batch deletion successful')
    selectedRows.value = []
    
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Batch deletion failed')
    }
  }
}
</script>
```

## Multi-Select Parameters

### Selection Column Configuration

| Parameter | Description | Type | Default |
|-----|------|-----|--------|
| `type` | Column type, set to 'selection' for multi-select column | `string` | - |
| `selectable` | Whether the row's checkbox can be checked | `Function(row, index)` | - |
| `reserveSelection` | Whether to retain selection after data updates | `boolean` | `false` |

### Selection Events

| Event | Description | Parameters |
|-------|------|------|
| `select` | Triggered when manually checking a row's Checkbox | `(selection, row)` |
| `select-all` | Triggered when manually checking the select-all Checkbox | `(selection)` |
| `selection-change` | Triggered when selection changes | `(selection)` |

## Table Methods

Access the following methods via `tableRef.value?.getElTableRef()`:

| Method | Description | Parameters |
|-------|------|------|
| `clearSelection` | Clear all selections | - |
| `getSelectionRows` | Returns currently selected rows | - |
| `toggleRowSelection` | Toggle a row's selection state | `(row, selected)` |
| `toggleAllSelection` | Toggle select-all state | - |

## Usage Scenarios

### 1. User Management
```javascript
// User data structure
const userData = [
  {
    id: 1,
    name: 'Zhang San',
    status: 'active',    // Selectable in active status
    role: 'admin'
  },
  {
    id: 2,
    name: 'Li Si',
    status: 'disabled',  // Non-selectable in disabled status
    role: 'user'
  }
]

// Selection constraints
const columns = [
  {
    type: 'selection',
    selectable: (row) => row.status !== 'disabled'
  }
]
```

### 2. Order Management
```javascript
// Batch process orders
const batchProcessOrders = async (action) => {
  const orderIds = selectedRows.value.map(row => row.orderId)
  
  try {
    switch (action) {
      case 'ship':
        await api.batchShipOrders(orderIds)
        break
      case 'cancel':
        await api.batchCancelOrders(orderIds)
        break
      case 'export':
        await api.exportOrders(orderIds)
        break
    }
    
    ElMessage.success(`Batch ${action} operation successful`)
    refreshData()
    
  } catch (error) {
    ElMessage.error(`Batch ${action} operation failed`)
  }
}
```

### 3. Data Export
```javascript
// Export selected data
const exportSelected = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('Please select data to export first')
    return
  }
  
  // Construct export data
  const exportData = selectedRows.value.map(row => ({
    Name: row.name,
    Email: row.email,
    Department: row.department,
    Position: row.position
  }))
  
  // Execute export
  exportToExcel(exportData, 'UserData.xlsx')
  ElMessage.success(`Exported ${selectedRows.value.length} records`)
}
```

## Best Practices

1. **Selection constraints**: Properly configure `selectable` function to prevent selecting invalid data
2. **State synchronization**: Ensure selected state remains synchronized with actual data
3. **Batch confirmation**: Implement secondary confirmation for batch operations, especially dangerous ones like deletion
4. **Operation feedback**: Provide timely feedback on batch operation results
5. **Performance considerations**: For large datasets, consider virtual scrolling or pagination

## Notes

- Selection state is not automatically persisted and will be lost on page refresh
- Cross-page selection requires special handling using `reserveSelection` property
- Consider network exceptions and partial failures during batch operations
- Selection constraint functions are called during each render - avoid complex computations