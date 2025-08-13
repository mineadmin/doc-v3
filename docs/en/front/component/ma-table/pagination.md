# Paginated Table

Demonstrates complete pagination functionality including pagination configuration, event handling, dynamic updates, etc.

## Pagination Demo

<DemoPreview dir="demos/ma-table/pagination" />

## Features

### Pagination Component
- **Page Navigation**: Supports page switching and jumping
- **Page Size**: Allows selecting the number of items per page
- **Total Count**: Displays the total number of data items
- **Quick Jump**: Supports inputting page numbers for quick navigation

### Pagination Configuration
- **Layout Configuration**: Customizes display elements of the pagination component
- **Style Configuration**: Supports background color, size, and other style configurations
- **Event Handling**: Listens for page number and page size change events
- **Dynamic Updates**: Modifies pagination configuration at runtime

## Configuration Examples

### Basic Pagination Configuration
```javascript
const options = {
  showPagination: true,
  pagination: {
    currentPage: 1,
    pageSize: 10,
    total: 100,
    layout: 'total, sizes, prev, pager, next, jumper',
    pageSizes: [10, 20, 50, 100],
    background: true
  }
}
```

### Pagination Event Handling
```javascript
const options = {
  pagination: {
    currentPage: 1,
    pageSize: 10,
    total: 100,
    onChange: (currentPage, pageSize) => {
      console.log('Pagination changed:', currentPage, pageSize)
      // Reload data
      loadData(currentPage, pageSize)
    },
    onSizeChange: (pageSize) => {
      console.log('Page size changed:', pageSize)
    },
    onCurrentChange: (currentPage) => {
      console.log('Current page changed:', currentPage)
    }
  }
}
```

### Custom Pagination Layout
```javascript
const options = {
  pagination: {
    layout: 'prev, pager, next, jumper, ->, total, sizes',
    pageSizes: [5, 10, 20, 50],
    // Hide pagination when there's only one page
    hideOnSinglePage: true
  }
}
```

### Pagination Style Configuration
```javascript
const options = {
  pagination: {
    size: 'small',        // Pagination size
    background: true,     // Page number background
    disabled: false,      // Whether disabled
    prevText: 'Previous', // Previous button text
    nextText: 'Next'      // Next button text
  }
}
```

### Updating Pagination Using Expose Methods
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
const tableRef = ref()

// Update pagination configuration
const updatePagination = () => {
  const newPagination = {
    currentPage: 1,
    pageSize: 20,
    total: 200
  }
  tableRef.value?.setPagination(newPagination)
}

// Get current configuration
const getCurrentOptions = () => {
  const options = tableRef.value?.getOptions()
  console.log('Current pagination config:', options.pagination)
}
</script>
```

## Pagination Parameters

### Basic Parameters

| Parameter | Description | Type | Default |
|-----|------|-----|--------|
| `currentPage` | Current page number | `number` | `1` |
| `pageSize` | Number of items per page | `number` | `10` |
| `total` | Total number of items | `number` | `0` |
| `pageSizes` | Options for page size selector | `number[]` | `[10, 20, 50, 100]` |

### Style Parameters

| Parameter | Description | Type | Default |
|-----|------|-----|--------|
| `size` | Pagination component size | `'large' \| 'default' \| 'small'` | `'default'` |
| `background` | Whether to add background color to page buttons | `boolean` | `false` |
| `layout` | Component layout, with child component names separated by commas | `string` | `'prev, pager, next, jumper, ->, total'` |
| `pagerCount` | Number of page buttons | `number` | `7` |

### Control Parameters

| Parameter | Description | Type | Default |
|-----|------|-----|--------|
| `disabled` | Whether pagination is disabled | `boolean` | `false` |
| `hideOnSinglePage` | Whether to hide when there's only one page | `boolean` | `false` |
| `prevText` | Text for previous page button (replaces icon) | `string` | - |
| `nextText` | Text for next page button (replaces icon) | `string` | - |

## Pagination Events

| Event | Description | Parameters |
|-------|------|------|
| `onChange` | Triggered when page number or size changes | `(currentPage, pageSize)` |
| `onSizeChange` | Triggered when page size changes | `(pageSize)` |
| `onCurrentChange` | Triggered when current page changes | `(currentPage)` |
| `onPrevClick` | Triggered after user clicks previous page button | `(currentPage)` |
| `onNextClick` | Triggered after user clicks next page button | `(currentPage)` |

## Layout Options

The `layout` property can configure the following components:

- `prev`: Previous page button
- `pager`: Page number list
- `next`: Next page button
- `jumper`: Jump input box
- `total`: Total item count
- `sizes`: Page size selector
- `->`: Separator, indicating right alignment for following components

Example layouts:
- `'total, sizes, prev, pager, next, jumper'`
- `'prev, pager, next, jumper, ->, total, sizes'`

## Best Practices

1. **Server-side Pagination**: Recommend implementing pagination on the server side to avoid loading large amounts of data at once
2. **State Synchronization**: Ensure pagination state stays synchronized with actual data
3. **User Experience**: Provide appropriate page size options, typically including 10, 20, 50, etc.
4. **Loading State**: Display loading state during data fetching
5. **Error Handling**: Handle pagination data loading failures appropriately

## Server-side Pagination Example

```vue
<template>
  <ma-table 
    :columns="columns" 
    :data="currentPageData" 
    :options="tableOptions" 
  />
</template>

<script setup>
import { ref, reactive } from 'vue'

const currentPageData = ref([])
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const tableOptions = {
  loading: false,
  pagination: {
    ...pagination,
    onChange: async (currentPage, pageSize) => {
      pagination.currentPage = currentPage
      pagination.pageSize = pageSize
      await loadData()
    }
  }
}

const loadData = async () => {
  try {
    tableOptions.loading = true
    const response = await api.getTableData({
      page: pagination.currentPage,
      size: pagination.pageSize
    })
    
    currentPageData.value = response.data
    pagination.total = response.total
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    tableOptions.loading = false
  }
}

// Initial load
loadData()
</script>
```