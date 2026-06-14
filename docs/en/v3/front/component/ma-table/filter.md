# Table Filtering

Supports multiple filtering methods: column header filtering, custom search, combined filtering, etc.

## Filtering Demo

<DemoPreview dir="demos/ma-table/filter" />

## Features

### Filtering Types
- **Column Header Filtering**: Provides filter dropdown menu in the column header
- **Multi-Select Filtering**: Supports selecting multiple filter conditions simultaneously
- **Custom Filtering**: Implements custom filter logic via `filterMethod`
- **External Search**: Implements external filtering in combination with input fields, selectors, and other components

### Filter Control
- **Filter Data**: Defines filter options via `filters`
- **Filter Method**: Custom filter logic via `filterMethod`
- **Filter Event**: Listens to the `filter-change` event to get filter changes

## Configuration Examples

### Basic Filtering
```javascript
const columns = [
  { 
    label: 'Department', 
    prop: 'department',
    filters: [
      { text: 'Tech Department', value: 'Tech Department' },
      { text: 'Product Department', value: 'Product Department' },
      { text: 'Design Department', value: 'Design Department' }
    ],
    filterMethod: (value, row) => row.department === value
  }
]
```

### Multi-Select Filtering
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
    filterMultiple: true  // Enable multi-select
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
      placeholder="Search by name" 
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
|-----------|-------------|------|---------|
| `filters` | Options for data filtering | `array[{ text, value }]` | - |
| `filterPlacement` | Placement of the filter popup | `string` | - |
| `filterMultiple` | Whether the data filter options support multi-select | `boolean` | `true` |
| `filterMethod` | Method used for data filtering | `Function(value, row, column)` | - |
| `filteredValue` | Selected data filter items | `array` | - |

## Filter Methods

| Method Name | Description | Parameters |
|-------------|-------------|------------|
| `clearFilter` | Used to clear filter conditions for a specified column | `columnKeys` |
| `setCurrentRow` | Used for single-select tables to set a certain row as the selected row | `row` |

## Event Description

| Event Name | Description | Parameters |
|------------|-------------|------------|
| `filter-change` | Triggered when the table filter conditions change | `filters` |

## Best Practices

1. **Use Filtering Wisely**: For columns with large amounts of data, it is recommended to use filtering to enhance user experience
2. **Filter Option Naming**: The text of filter options should be concise and clear for easy user understanding
3. **Combined Filtering**: Multiple filter conditions can be used together to provide more precise filtering capabilities
4. **Filter Feedback**: Provide timely feedback to the user after filtering, displaying the number of filtered results