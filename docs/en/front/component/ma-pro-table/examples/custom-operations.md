# Custom Operations

Demonstrates different types of action column configurations, including conditional display, custom styles, and complex operation logic.

<DemoPreview dir="demos/ma-pro-table-examples/custom-operations" />

## Key Features

- **Multiple Action Types**: Supports tiled, dropdown menu, auto-collapse display modes
- **Conditional Display**: Dynamically show/hide action buttons based on row data
- **Context Menu**: Supports row right-click menu functionality
- **Drag Sorting**: Supports row drag-and-drop reordering
- **Batch Operations**: Supports multi-selection and batch operation features

## Action Column Configuration

### Basic Operation Configuration
```javascript
{
  type: 'operation',
  label: 'Actions',
  width: 280,
  fixed: 'right',
  operationConfigure: {
    type: 'auto',           // auto/dropdown/tile
    fold: 2,                // Collapse threshold in auto mode
    actions: [
      {
        name: 'view',
        text: 'Details',
        icon: 'view',
        onClick: (data) => {
          console.log('View details:', data.row)
        }
      }
    ]
  }
}
```

### Operation Type Explanation

#### 1. Auto Mode (auto)
```javascript
operationConfigure: {
  type: 'auto',
  fold: 2,                  // Collapse after showing 2 buttons
  actions: [...]
}
```

#### 2. Dropdown Menu Mode (dropdown)
```javascript
operationConfigure: {
  type: 'dropdown',
  actions: [...]
}
```

#### 3. Tiled Mode (tile)
```javascript
operationConfigure: {
  type: 'tile',
  actions: [...]
}
```

## Action Button Configuration

### Basic Button
```javascript
{
  name: 'edit',
  text: 'Edit',
  icon: 'edit',
  onClick: (data, proxy) => {
    console.log('Edit data:', data.row)
    console.log('Table instance:', proxy)
  }
}
```

### Conditional Display
```javascript
{
  name: 'approve',
  text: 'Approve',
  show: (data) => data.row.status === 'pending',    // Conditional display
  disabled: (data) => !data.row.canApprove,        // Conditional disable
  onClick: (data, proxy) => {
    // Approval logic
    proxy.refresh()  // Refresh table
  }
}
```

### Custom Styles
```javascript
{
  name: 'delete',
  text: 'Delete',
  icon: 'delete',
  linkProps: {
    type: 'danger',         // Button type
    size: 'small'           // Button size
  },
  onClick: (data) => {
    ElMessageBox.confirm('Confirm deletion?', 'Confirmation', {
      type: 'warning'
    }).then(() => {
      console.log('Delete:', data.row)
    })
  }
}
```

### Operation Ordering
```javascript
{
  name: 'high-priority',
  text: 'High Priority',
  order: 1,                 // Sort weight, lower numbers come first
  onClick: (data) => {
    console.log('High priority operation')
  }
}
```

## Context Menu

### Enable Context Menu
```javascript
const options = {
  rowContextMenu: {
    enabled: true,
    items: [
      {
        label: 'View Details',
        icon: 'view',
        onMenuClick: (data, event) => {
          console.log('Right-click view:', data.row)
        }
      },
      {
        label: 'Copy Application',
        icon: 'copy',
        onMenuClick: (data, event) => {
          console.log('Copy data:', data.row)
        }
      },
      {
        label: 'Delete',
        icon: 'delete',
        disabled: (data) => !data.row.canDelete,  // Conditional disable
        onMenuClick: (data, event) => {
          console.log('Right-click delete:', data.row)
        }
      }
    ]
  }
}
```

## Drag Sorting

### Enable Dragging
```javascript
const options = {
  tableOptions: {
    rowDrag: true           // Enable row dragging
  }
}

// Listen to drag events
const schema = {
  tableColumns: [
    { type: 'sort', width: 60 },  // Drag column
    // ...other columns
  ]
}
```

### Drag Events
```vue
<MaProTable 
  :options="options" 
  :schema="schema"
  @row-drag-sort="handleRowDragSort"
/>

<script setup>
const handleRowDragSort = (tableData) => {
  console.log('New order:', tableData.map(item => item.title))
  // Call API to save new order
}
</script>
```

## Batch Operations

### Enable Multi-selection
```javascript
const options = {
  tableOptions: {
    selection: true         // Enable multi-selection
  }
}
```

### Batch Operation Example
```vue
<template>
  <div class="control-panel">
    <el-button @click="batchApprove" type="primary">Batch Approve</el-button>
    <el-button @click="batchDelete" type="danger">Batch Delete</el-button>
  </div>
  <MaProTable ref="tableRef" :options="options" :schema="schema" />
</template>

<script setup>
const tableRef = ref()

const batchApprove = () => {
  const selectedRows = tableRef.value?.getTableRef?.()?.getSelectionRows?.()
  console.log('Selected rows:', selectedRows)
}

const batchDelete = () => {
  ElMessageBox.confirm('Confirm batch deletion?', 'Batch Operation', {
    type: 'warning'
  }).then(() => {
    // Batch delete logic
    tableRef.value?.refresh()
  })
}
</script>
```

## Advanced Operation Examples

### Asynchronous Operation
```javascript
{
  name: 'async-action',
  text: 'Async Operation',
  onClick: async (data, proxy) => {
    try {
      ElMessage.info('Processing...')
      await someAsyncOperation(data.row.id)
      ElMessage.success('Operation successful')
      await proxy.refresh()  // Refresh table
    } catch (error) {
      ElMessage.error('Operation failed')
    }
  }
}
```

### Dialog Operation
```javascript
{
  name: 'dialog-action',
  text: 'Dialog Operation',
  onClick: (data, proxy) => {
    ElMessageBox.prompt('Please enter remarks', 'Operation Confirmation', {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel'
    }).then(({ value }) => {
      console.log('Remarks:', value)
      console.log('Data:', data.row)
      proxy.refresh()
    })
  }
}
```

Custom operation functionality allows you to build complex interaction logic to meet various business scenario requirements.