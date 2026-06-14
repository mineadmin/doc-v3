# Basic Table

Demonstrates the most fundamental table functionality, including features such as striping, borders, and highlighting the current row.

## Basic Usage

<DemoPreview dir="demos/ma-table/basic" />

## Feature Description

### Basic Configuration
- **Striped Display**: `stripe: true` enables alternating row colors
- **Border Display**: `border: true` shows table borders
- **Current Row Highlighting**: `highlightCurrentRow: true` highlights a row when clicked
- **Header Display**: `showHeader: true` controls the visibility of the table header

### Column Configuration
- **Fixed Width**: `width` sets a fixed width for the column
- **Minimum Width**: `minWidth` sets the minimum width for the column
- **Column Alignment**: `align` controls the text alignment within the column

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
  { name: 'Zhang San', age: 28, email: 'zhangsan@example.com', department: 'Technology', position: 'Frontend Engineer' },
  // ... more data
]
</script>
```

## Configuration Parameters

| Parameter | Description | Type | Default |
|-----------|-------------|------|---------|
| `stripe` | Whether to use alternating row colors | `boolean` | `false` |
| `border` | Whether to display vertical borders | `boolean` | `false` |
| `size` | Table size | `'large' \| 'default' \| 'small'` | `'default'` |
| `highlightCurrentRow` | Whether to highlight the current row | `boolean` | `false` |
| `showHeader` | Whether to display the table header | `boolean` | `true` |