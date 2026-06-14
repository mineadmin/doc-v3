# Multi-Select Table

Demonstrates the multi-select functionality of the table, including single selection, select all, batch operations, etc.

## Multi-Select Table Demo

<DemoPreview dir="demos/ma-table/selection" />

## Features

### Selection Control
- **Single Row Selection**: Click the checkbox to select a single row of data
- **Select All**: The header checkbox implements select all/deselect all
- **Selection Constraints**: Can set certain rows as unselectable
- **Selection Persistence**: Supports maintaining selection state across pages

### Batch Operations
- **Batch Processing**: Perform batch operations based on selected rows
- **Selection Statistics**: Real-time display of the count and status of selected records
- **Operation Feedback**: Result feedback and confirmation for batch operations

## Configuration Examples

### Basic Multi-Select Configuration
```javascript
const columns = [
  {
    type: 'selection',        // Multi-select column
    width: 50,
    selectable: (row, index) => {
      // Set selection constraint conditions
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
      console.log('Single row selection:', row, selection.includes(row) ? 'Selected' : 'Deselected')
    },
    onSelectAll: (selection) => {
      console.log('Select all operation:', selection.length > 0 ? 'Select All' : 'Deselect All')
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
      <el-button @click="toggleSelection">Invert Selection</el-button>
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

// Select All
const selectAll = () => {
  const selectableRows = data.value.filter(row => row.status !== 'disabled')
  selectableRows.forEach(row => {
    tableRef.value?.getElTableRef()?.toggleRowSelection(row, true)
  })
}

// Clear Selection
const clearSelection = () => {
  tableRef.value?.getElTableRef()?.clearSelection()
}

// Invert Selection
const toggleSelection = () => {
  data.value.forEach(row => {
    if (row.status !== 'disabled') {
      const isSelected = selectedRows.value.includes(row)
      tableRef.value?.getElTableRef()?.toggleRowSelection(row, !isSelected)
    }
  })
}

// Select Rows with Specific Conditions
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
    <!-- Batch Operation Toolbar -->
    <div v-if="selectedRows.length > 0" class="batch-toolbar">
      <span>{{ selectedRows.length }} records selected</span>
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
// Batch Activate
const batchActivate = async () => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to activate the selected ${selectedRows.value.length} users?`,
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

// Batch Delete
const batchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete the selected ${selectedRows.value.length} records? This action cannot be undone!`,
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
|-----------|-------------|------|---------|
| `type` | Column type, set to 'selection' for multi-select column | `string` | - |
| `selectable` | Whether the row's checkbox can be checked | `Function(row, index)` | - |
| `reserveSelection` | Whether to retain selection after data update | `boolean` | `false` |

### Selection Events

| Event Name | Description | Parameters |
|------------|-------------|------------|
| `select` | Triggered when the user manually checks a data row's Checkbox | `(selection, row)` |
| `select-all` | Triggered when the user manually checks the select all Checkbox | `(selection)` |
| `selection-change` | Triggered when a selection item changes | `(selection)` |

## Table Methods

Access the following methods via `tableRef.value?.getElTableRef()`:

| Method Name | Description | Parameters |
|-------------|-------------|------------|
| `clearSelection` | Clear all selections | - |
| `getSelectionRows` | Return currently selected rows | - |
| `toggleRowSelection` | Toggle the selection state of a row | `(row, selected)` |
| `toggleAllSelection` | Toggle the select all state | - |

## Use Cases

### 1. User Management
```javascript
// User data structure
const userData = [
  {
    id: 1,
    name: 'Zhang San',
    status: 'active',    // Normal status, selectable
    role: 'admin'
  },
  {
    id: 2,
    name: 'Li Si',
    status: 'disabled',  // Disabled status, not selectable
    role: 'user'
  }
]

// Selection constraint
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
    ElMessage.warning('Please select the data to export first')
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
  exportToExcel(exportData, 'User Data.xlsx')
  ElMessage.success(`Exported ${selectedRows.value.length} records`)
}
```

## Best Practices

1. **Selection Constraints**: Reasonably set the `selectable` function to prevent users from selecting data they should not operate on
2. **State Synchronization**: Ensure selection state remains synchronized with actual data
3. **Batch Confirmation**: Perform secondary confirmation before batch operations, especially for dangerous operations like deletion
4. **Operation Feedback**: Promptly provide users with feedback on batch operation results
5. **Performance Considerations**: Consider virtual scrolling or pagination for large datasets

## Notes

- Selection state is not automatically saved and will be lost after page refresh
- Cross-page selection requires special handling; use the `reserveSelection` property
- Consider network anomalies and partial failures during batch operations
- The selection constraint function is called on each render; avoid complex calculations