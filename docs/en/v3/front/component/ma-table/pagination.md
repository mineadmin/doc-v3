# Paginated Table

Demonstrates complete pagination functionality, including pagination configuration, event handling, dynamic updates, etc.

## Pagination Demo

<DemoPreview dir="demos/ma-table/pagination" />

## Features

### Pagination Component
- **Page Navigation**: Supports page switching and skipping
- **Page Size**: Allows selection of items displayed per page
- **Total Display**: Shows the total number of data items
- **Quick Jump**: Supports quick page jump via input

### Pagination Configuration
- **Layout Configuration**: Customize display elements of the pagination component
- **Style Configuration**: Supports style configuration such as background color and size
- **Event Handling**: Listen to page and page size change events
- **Dynamic Update**: Modify pagination configuration at runtime

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
    // Hide pagination on single page
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
    prevText: 'Previous', // Previous page button text
    nextText: 'Next'     // Next page button text
  }
}
```

### Update Pagination Using Expose Methods
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
  console.log('Current pagination configuration:', options.pagination)
}
</script>
```

## Pagination Parameters

### Basic Parameters

| Parameter | Description | Type | Default |
|-----------|-------------|------|---------|
| `currentPage` | Current page number | `number` | `1` |
| `pageSize` | Number of items per page | `number` | `10` |
| `total` | Total number of items | `number` | `0` |
| `pageSizes` | Options for page size selector | `number[]` | `[10, 20, 50, 100]` |

### Style Parameters

| Parameter | Description | Type | Default |
|-----------|-------------|------|---------|
| `size` | Pagination component size | `'large' \| 'default' \| 'small'` | `'default'` |
| `background` | Whether to add background color to page buttons | `boolean` | `false` |
| `layout` | Component layout, sub-component names separated by commas | `string` | `'prev, pager, next, jumper, ->, total'` |
| `pagerCount` | Number of page buttons | `number` | `7` |

### Control Parameters

| Parameter | Description | Type | Default |
|-----------|-------------|------|---------|
| `disabled` | Whether to disable pagination | `boolean` | `false` |
| `hideOnSinglePage` | Whether to hide when only one page | `boolean` | `false` |
| `prevText` | Text for the previous page button replacing the icon | `string` | - |
| `nextText` | Text for the next page button replacing the icon | `string` | - |

## Pagination Events

| Event Name | Description | Parameters |
|-----------|-------------|------------|
| `onChange` | Triggered when page or page size changes | `(currentPage, pageSize)` |
| `onSizeChange` | Triggered when items per page changes | `(pageSize)` |
| `onCurrentChange` | Triggered when current page changes | `(currentPage)` |
| `onPrevClick` | Triggered after user clicks the previous page button | `(currentPage)` |
| `onNextClick` | Triggered after user clicks the next page button | `(currentPage)` |

## Layout Options

The `layout` property can configure the following components:

- `prev`: Previous page button
- `pager`: Page number list
- `next`: Next page button
- `jumper`: Jump input
- `total`: Total items
- `sizes`: Items per page selector
- `->`: Separator, components after it are aligned to the right

Example layouts:
- `'total, sizes, prev, pager, next, jumper'`
- `'prev, pager, next, jumper, ->, total, sizes'`

## Best Practices

1. **Data Pagination**: It is recommended to perform data pagination on the server side to avoid loading large amounts of data at once
2. **State Synchronization**: Ensure pagination state stays synchronized with the actual data
3. **User Experience**: Provide appropriate page size options, typically including 10, 20, 50, etc.
4. **Loading State**: Display a loading state while data is being loaded
5. **Error Handling**: Handle cases where paginated data loading fails

## Server-Side Pagination Example

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