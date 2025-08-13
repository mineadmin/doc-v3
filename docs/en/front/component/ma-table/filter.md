# Table Filtering

Supports multiple filtering methods: column header filtering, custom search, combined filtering, etc.

## Filter Demo

<DemoPreview dir="demos/ma-table/filter" />

## Features

### Filter Types
- **Column Header Filtering**: Provides filter dropdown in column headers
- **Multiple Selection Filtering**: Supports selecting multiple filter conditions simultaneously
- **Custom Filtering**: Implements custom filtering logic through `filterMethod`
- **External Search**: Combines with input boxes, selectors and other components for external filtering

### Filter Control
- **Filter Data**: Define filter options through `filters`
- **Filter Method**: Customize filtering logic through `filterMethod`
- **Filter Events**: Listen to `filter-change` event to get filter changes

## Configuration Examples

### Basic Filtering
```javascript
const columns = [
  { 
    label: 'Department', 
    prop: 'department',
    filters: [
      { text: 'Tech', value: 'Tech' },
      { text: 'Product', value: 'Product' },
      { text: 'Design', value: 'Design' }
    ],
    filterMethod: (value, row) => row.department === value
  }
]
```

### Multiple Selection Filtering
```javascript
const columns = [
  { 
    label: 'Level', 
    prop: 'level',
    filters: [
      { text: 'P5', value: 'P5' },
      { text: 'P6', value: 'P6' },
      { text: 'P7', value: 'P7' }
    ],
    filterMethod: (value, row) => row.level === value,
    filterMultiple: true  // Enable multiple selection
  }
]
```

### Custom Filter Logic
```javascript
const columns = [
  { 
    label: 'Salary Range', 
    prop: 'salary',
    filters: [
      { text: 'Below 10k', value: 'low' },
      { text: '10k-20k', value: 'medium' },
      { text: '20k-30k', value: 'high' }
    ],
    filterMethod: (value, row) => {
      switch (value) {
        case 'low': return row.salary < 10
        case 'medium': return row.salary >= 10 && row.salary < 20
        case 'high': return row.salary >= 20 && row.salary < 30
        default: return true
      }
    }
  }
]
```

### External Filter Control
```vue
<template>
  <div>
    <!-- External filter control -->
    <el-input 
      v-model="searchName" 
      placeholder="Search name" 
      @input="handleSearch"
    />
    
    <ma-table 
      :columns="columns" 
      :data="filteredData" 
      :options="options" 
    />
  </div>
</template>

<script setup>
const searchName = ref('')
const filteredData = ref([...originalData])

const handleSearch = () => {
  filteredData.value = originalData.filter(item => 
    item.name.includes(searchName.value)
  )
}
</script>
```

## Filter Parameters

| Parameter | Description | Type | Default |
|-----|------|-----|--------|
| `filters` | Filter options | `array[{ text, value }]` | - |
| `filterPlacement` | Filter popup positioning | `string` | - |
| `filterMultiple` | Whether filter options are multiple select | `boolean` | `true` |
| `filterMethod` | Custom filter method | `Function(value, row, column)` | - |
| `filteredValue` | Selected filter items | `array` | - |

## Filter Methods

| Method | Description | Parameters |
|-------|------|------|
| `clearFilter` | Clears filter conditions for specified columns | `columnKeys` |
| `setCurrentRow` | For single-select tables, sets a row as selected | `row` |

## Events

| Event | Description | Parameters |
|-------|------|------|
| `filter-change` | Triggered when table filter conditions change | `filters` |

## Best Practices

1. **Use Filters Appropriately**: Recommended for columns with large data volumes to improve UX
2. **Filter Naming**: Keep filter option texts concise and clear for user understanding
3. **Combined Filtering**: Multiple filter conditions can be combined for more precise filtering
4. **Filter Feedback**: Provide immediate feedback to users after filtering, showing result counts