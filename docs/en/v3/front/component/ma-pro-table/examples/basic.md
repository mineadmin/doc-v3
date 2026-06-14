# Basic Usage

The simplest way to use a table, including search, pagination, and basic operation features.

<DemoPreview dir="demos/ma-pro-table-examples/basic" />

## Features

- **Quick Setup**: Built on the combination of ma-search and ma-table
- **Search Functionality**: Built-in search form supporting various search components
- **Pagination Support**: Automatic pagination logic handling
- **Operation Column**: Flexible operation button configuration
- **Data Binding**: Automatic API request and data rendering

## Core Configuration

### Basic Structure
```vue
<template>
  <MaProTable :options="options" :schema="schema" />
</template>

<script setup>
import { reactive } from 'vue'

// Component options
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

### Operation Column Configuration
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

## Usage Notes

1. **API Interface**: Must return data in `{ code, data: { list, total } }` format
2. **Search Components**: Supports various types like input, select, date, etc.
3. **Action Buttons**: Supports click events, display conditions, styles, etc.
4. **Auto Height**: Enables automatic table height calculation when `adaption` is enabled

This is the most basic example of using MaProTable, demonstrating how to quickly build a complete CRUD interface.