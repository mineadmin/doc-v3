# Dynamic Column Management

Demonstrates how to dynamically control column visibility, add/remove columns, and use Expose methods for column management.

## Dynamic Columns Demo

<DemoPreview dir="demos/ma-table/dynamic-columns" />

## Features

### Column Control Methods
- **Show/Hide**: Control column visibility through reactive data
- **Dynamic Addition**: Add new columns at runtime
- **Dynamic Removal**: Remove unnecessary columns
- **Column Configuration Retrieval**: Get current column configuration

### Expose Methods
ma-table provides comprehensive column management APIs:
- `setColumns()`: Reset all columns
- `getColumns()`: Get current column configuration
- `appendColumn()`: Append new column
- `removeColumn()`: Remove specified column
- `getColumnByProp()`: Get column configuration by property name

## Usage Examples

### Column Visibility Control
```vue
<template>
  <div>
    <!-- Column toggle switches -->
    <el-switch 
      v-for="(visible, key) in columnVisibility" 
      :key="key"
      v-model="columnVisibility[key]"
      :label="getColumnLabel(key)"
    />
    
    <ma-table 
      :columns="visibleColumns" 
      :data="data" 
      :options="options" 
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Column visibility state
const columnVisibility = ref({
  name: true,
  age: true,
  email: true,
  department: false
})

// Base column configuration
const baseColumns = [
  { label: 'Name', prop: 'name' },
  { label: 'Age', prop: 'age' },
  { label: 'Email', prop: 'email' },
  { label: 'Department', prop: 'department' }
]

// Compute visible columns
const visibleColumns = computed(() => {
  return baseColumns.filter(col => 
    columnVisibility.value[col.prop]
  )
})
</script>
```

### Using Expose Methods for Dynamic Column Management
```vue
<template>
  <ma-table 
    ref="tableRef"
    :columns="columns" 
    :data="data" 
    :options="options" 
  />
</template>

<script setup>
import { ref } from 'vue'

const tableRef = ref()

// Add new column
const addColumn = () => {
  const newColumn = {
    label: 'New Column',
    prop: 'newField',
    cellRender: ({ row }) => <el-tag>Dynamic Column</el-tag>
  }
  tableRef.value?.appendColumn(newColumn)
}

// Remove column
const removeColumn = (prop) => {
  tableRef.value?.removeColumn(prop)
}

// Get column configuration
const getColumns = () => {
  const columns = tableRef.value?.getColumns()
  console.log('Current column configuration:', columns)
}

// Reset column configuration
const resetColumns = () => {
  const newColumns = [
    { label: 'Name', prop: 'name' },
    { label: 'Age', prop: 'age' }
  ]
  tableRef.value?.setColumns(newColumns)
}
</script>
```

### Dynamic Column Form
```vue
<template>
  <div>
    <el-dialog v-model="dialogVisible" title="Add Column">
      <el-form :model="newColumn">
        <el-form-item label="Column Title" required>
          <el-input v-model="newColumn.label" />
        </el-form-item>
        <el-form-item label="Field Name" required>
          <el-input v-model="newColumn.prop" />
        </el-form-item>
        <el-form-item label="Column Width">
          <el-input v-model="newColumn.width" />
        </el-form-item>
        <el-form-item label="Alignment">
          <el-select v-model="newColumn.align">
            <el-option label="Left" value="left" />
            <el-option label="Center" value="center" />
            <el-option label="Right" value="right" />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="confirmAddColumn">Confirm</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
const dialogVisible = ref(false)
const newColumn = ref({
  label: '',
  prop: '',
  width: '',
  align: 'center'
})

const confirmAddColumn = () => {
  // Validate form
  if (!newColumn.value.label || !newColumn.value.prop) {
    return
  }
  
  // Build column configuration
  const column = {
    label: newColumn.value.label,
    prop: newColumn.value.prop,
    align: newColumn.value.align,
    width: newColumn.value.width ? parseInt(newColumn.value.width) : undefined,
    cellRender: ({ row }) => row[newColumn.value.prop] || '--'
  }
  
  // Add to table
  tableRef.value?.appendColumn(column)
  
  // Reset form
  newColumn.value = { label: '', prop: '', width: '', align: 'center' }
  dialogVisible.value = false
}
</script>
```

## API Reference

### Expose Methods

| Method | Description | Parameters | Return Value |
|-------|------------|------------|--------------|
| `setColumns(columns)` | Reset table columns | `MaTableColumns[]` | - |
| `getColumns()` | Get current column configuration | - | `MaTableColumns[]` |
| `appendColumn(column)` | Append new column to table end | `MaTableColumns` | - |
| `removeColumn(prop)` | Remove column by property name | `string` | - |
| `getColumnByProp(prop)` | Get column configuration by property name | `string` | `MaTableColumns` |

### Dynamic Column Configuration

```typescript
interface MaTableColumns {
  label: string           // Column title
  prop: string           // Field name
  width?: number         // Column width
  minWidth?: number      // Minimum width
  align?: 'left' | 'center' | 'right'  // Alignment
  hide?: boolean         // Whether to hide
  cellRender?: Function  // Custom render
  // ... Other Element Plus column properties
}
```

## Use Cases

1. **Personalized Configuration**: Users can show/hide specific columns as needed
2. **Permission Control**: Dynamically display different columns based on user permissions
3. **Data Adaptation**: Adjust column configuration according to different data sources
4. **Real-time Configuration**: Add/remove columns at runtime based on business needs
5. **Column Preference Saving**: Save user column configuration preferences

## Best Practices

1. **State Management**: Use reactive data to manage column visibility
2. **Configuration Validation**: Verify completeness and uniqueness when adding new columns
3. **User Experience**: Provide intuitive column control interfaces like switches, checkboxes
4. **Data Synchronization**: Ensure data contains corresponding fields when adding columns
5. **Performance Optimization**: Avoid frequent column operations, consider batch updates

## Notes

- When dynamically removing columns, corresponding data won't be deleted, only hidden
- Dynamically added columns must have corresponding fields in the data, otherwise empty
- Using `setColumns` will completely replace existing column configuration
- Column `prop` must be unique, no duplicates allowed