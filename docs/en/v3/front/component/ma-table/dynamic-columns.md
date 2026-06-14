# Dynamic Column Management

Demonstrates how to dynamically control column visibility, add and delete columns, and manage columns using Expose methods.

## Dynamic Column Demo

<DemoPreview dir="demos/ma-table/dynamic-columns" />

## Features

### Column Control Methods
- **Show/Hide**: Control column display state via reactive data
- **Dynamic Addition**: Add new columns to the table at runtime
- **Dynamic Deletion**: Remove unnecessary columns
- **Column Configuration Retrieval**: Get current column configuration information

### Expose Methods
ma-table provides a complete column management API:
- `setColumns()`: Reset all columns
- `getColumns()`: Get current column configuration
- `appendColumn()`: Append a new column
- `removeColumn()`: Delete a specified column
- `getColumnByProp()`: Get column configuration by property name

## Usage Examples

### Column Visibility Control
```vue
<template>
  <div>
    <!-- Column Control Toggles -->
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

### Dynamic Column Management Using Expose Methods
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

// Add a new column
const addColumn = () => {
  const newColumn = {
    label: 'New Column',
    prop: 'newField',
    cellRender: ({ row }) => <el-tag>Dynamic Column</el-tag>
  }
  tableRef.value?.appendColumn(newColumn)
}

// Delete a column
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
|--------|-------------|------------|--------------|
| `setColumns(columns)` | Reset table columns | `MaTableColumns[]` | - |
| `getColumns()` | Get current table column configuration | - | `MaTableColumns[]` |
| `appendColumn(column)` | Append a new column to the end of the table | `MaTableColumns` | - |
| `removeColumn(prop)` | Delete a column by property name | `string` | - |
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
  cellRender?: Function  // Custom rendering
  // ... Other Element Plus column properties
}
```

## Use Cases

1. **Personalized Configuration**: Users can show or hide specific columns as needed
2. **Permission Control**: Dynamically display different columns based on user permissions
3. **Data Adaptation**: Adjust column configuration dynamically based on different data sources
4. **Real-time Configuration**: Add or delete columns at runtime based on business requirements
5. **Column Configuration Saving**: Save user column configuration preferences

## Best Practices

1. **State Management**: Use reactive data to manage column display states
2. **Configuration Validation**: Validate completeness and uniqueness when adding new columns
3. **User Experience**: Provide intuitive column control interfaces, such as toggles, checkboxes, etc.
4. **Data Synchronization**: Ensure data contains corresponding fields when dynamically adding columns
5. **Performance Optimization**: Avoid frequent column operations; consider batch updates

## Notes

- When dynamically deleting columns, the corresponding data is not deleted, only hidden
- Dynamically added columns require corresponding fields in the data, otherwise they display as empty
- Using `setColumns` will completely replace the existing column configuration
- The column `prop` property must be unique and cannot be repeated