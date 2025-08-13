# Basic Usage

The simplest way to use the table, including search, pagination, and basic operation functionalities.

<DemoPreview dir="demos/ma-pro-table-examples/basic" />

## Key Features

- **Quick Setup**: Built on the combination of ma-search and ma-table
- **Search Functionality**: Built-in search form supporting multiple search components
- **Pagination Support**: Automatic pagination logic handling
- **Action Column**: Flexible configuration for operation buttons
- **Data Binding**: Automatic API request handling and data rendering

## Core Configuration

### Basic Structure
```vue
<template>
  <MaProTable :options="options" :schema="schema" />
</template>

<script setup>
import { reactive } from 'vue'

// Component configuration
const options = reactive({
  requestOptions: {
    api: getDataList,        // API endpoint
    autoRequest: true,       // Auto request
    response: {
      totalKey: 'data.total',
      dataKey: 'data.list'
    }
  },
  tableOptions: {
    adaption: true,          // Auto height adjustment
    pagination: {
      total: 0,
      pageSize: 10
    }
  }
})

// Table schema
const schema = reactive({
  searchItems: [             // Search configuration
    {
      label: 'Name',
      prop: 'name',
      render: 'input'
    }
  ],
  tableColumns: [            // Table column configuration
    { label: 'ID', prop: 'id' },
    { label: 'Name', prop: 'name' }
  ]
})
</script>
```

### Action Column Configuration
```javascript
{
  type: 'operation',
  label: 'Actions',
  width: 200,
  operationConfigure: {
    type: 'tile',            // Tile display
    actions: [
      {
        name: 'edit',
        text: 'Edit',
        onClick: (data) => {
          console.log('Edit', data.row)
        }
      }
    ]
  }
}
```

## Usage Instructions

1. **API Interface**: Should return data in `{ code, data: { list, total } }` format
2. **Search Components**: Supports various types including input, select, date, etc.
3. **Action Buttons**: Configurable click events, display conditions, styles, etc.
4. **Auto Height Adjustment**: Automatically calculates table height when `adaption` is enabled

This is the most basic example of using MaProTable, demonstrating how to quickly build a complete CRUD interface.