# Basic Table

Demonstrates the most fundamental table functionalities, including striping, borders, highlighting the current row, and other features.

## Basic Usage

<DemoPreview dir="demos/ma-table/basic" />

## Feature Description

### Basic Configuration
- **Striped Rows**: `stripe: true` enables alternating row colors  
- **Borders**: `border: true` displays table borders  
- **Current Row Highlight**: `highlightCurrentRow: true` highlights the clicked row  
- **Header Visibility**: `showHeader: true` controls header display  

### Column Configuration  
- **Fixed Width**: `width` sets a fixed column width  
- **Minimum Width**: `minWidth` sets the minimum column width  
- **Alignment**: `align` controls content alignment within columns  

## Code Example  

```vue
<template>
  <ma-table
    :columns="columns"
    :data="data"
    :options="options"
  />
</template>

<script setup>
import { ref } from 'vue'

const columns = ref([
  { label: 'Name', prop: 'name', width: 120 },
  { label: 'Age', prop: 'age', width: 80 },
  { label: 'Email', prop: 'email' },
  { label: 'Department', prop: 'department' },
  { label: 'Position', prop: 'position' }
])

const options = ref({
  stripe: true,
  border: true,
  size: 'default',
  showHeader: true,
  highlightCurrentRow: true
})

const data = [
  { name: 'Zhang San', age: 28, email: 'zhangsan@example.com', department: 'Tech', position: 'Frontend Engineer' },
  // ... more data
]
</script>
```

## Configuration Parameters  

| Parameter | Description | Type | Default |  
|-----------|-------------|------|---------|  
| `stripe` | Whether to display striped rows | `boolean` | `false` |  
| `border` | Whether to show vertical borders | `boolean` | `false` |  
| `size` | Table size | `'large' \| 'default' \| 'small'` | `'default'` |  
| `highlightCurrentRow` | Whether to highlight the current row | `boolean` | `false` |  
| `showHeader` | Whether to display the header | `boolean` | `true` |