# Tree Table

Displays hierarchical data structures, supporting features such as expand/collapse, lazy loading, and custom icons.

## Tree Table Demo

<DemoPreview dir="demos/ma-table/tree-table" />

## Features

### Hierarchical Structure
- **Multi-level Nesting**: Supports displaying tree data at any depth
- **Expand Control**: Allows control over node expand and collapse states
- **Default Expansion**: Supports setting nodes to be expanded by default
- **Lazy Loading**: Supports lazy loading mechanism for nodes

### Visual Indicators
- **Level Indentation**: Automatically adds indentation based on hierarchy level
- **Expand Icon**: Provides default expand/collapse icons
- **Custom Icons**: Supports custom icons for each node
- **Status Indicators**: Can add visual indicators for nodes in different states

## Configuration Examples

### Basic Tree Configuration
```javascript
const options = {
  rowKey: 'id',                    // Key for row data
  defaultExpandAll: false,         // Whether to expand all rows by default
  treeProps: {
    children: 'children',          // Specify the field name for child nodes
    hasChildren: 'hasChildren'     // Specify the field name indicating if a node has children
  }
}
```

### Default Expand Specific Nodes
```javascript
const options = {
  rowKey: 'id',
  expandRowKeys: [1, 2, 3],       // Array of keys for rows to be expanded by default
  treeProps: {
    children: 'children',
    hasChildren: 'hasChildren'
  }
}
```

### Lazy Loading Configuration
```javascript
const options = {
  rowKey: 'id',
  lazy: true,                     // Enable lazy loading
  load: async (row, treeNode, resolve) => {
    // Asynchronously load child node data
    try {
      const children = await loadChildrenData(row.id)
      resolve(children)
    } catch (error) {
      resolve([])
    }
  },
  treeProps: {
    children: 'children',
    hasChildren: 'hasChildren'
  }
}
```

### Tree Data Structure
```javascript
const treeData = [
  {
    id: 1,
    name: 'Headquarters',
    manager: 'General Manager Zhang',
    children: [
      {
        id: 11,
        name: 'Technology Department',
        manager: 'Tech Manager Li',
        children: [
          {
            id: 111,
            name: 'Frontend Team',
            manager: 'Frontend Manager Wang',
            children: []
          },
          {
            id: 112,
            name: 'Backend Team',
            manager: 'Backend Manager Zhao',
            children: []
          }
        ]
      }
    ]
  }
]
```

### Custom Node Rendering
```javascript
const columns = [
  {
    label: 'Department Name',
    prop: 'name',
    cellRender: ({ row }) => (
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 16px;">{row.icon}</span>
        <span style={`font-weight: ${row.children?.length ? 'bold' : 'normal'}`}>
          {row.name}
        </span>
        {row.isNew && <el-tag size="small" type="success">New</el-tag>}
      </div>
    )
  }
]
```

## Tree Table Parameters

### Basic Parameters

| Parameter | Description | Type | Default |
|-----------|-------------|------|---------|
| `rowKey` | Key for row data, used to optimize Table rendering | `string \| Function(row): string` | - |
| `defaultExpandAll` | Whether to expand all rows by default | `boolean` | `false` |
| `expandRowKeys` | Can be used to set the currently expanded rows | `array` | - |
| `treeProps` | Configuration options for rendering nested data | `object` | - |

### Lazy Loading Parameters

| Parameter | Description | Type | Default |
|-----------|-------------|------|---------|
| `lazy` | Whether to lazy load child node data | `boolean` | `false` |
| `load` | Function for loading child node data | `Function(row, treeNode, resolve)` | - |
| `indent` | Horizontal indentation between adjacent level nodes, in pixels | `number` | `16` |

### treeProps Configuration

| Parameter | Description | Type | Default |
|-----------|-------------|------|---------|
| `children` | Specifies the subtree as a property value of the node object | `string` | `'children'` |
| `hasChildren` | Specifies the flag for whether a node object is a leaf node | `string` | `'hasChildren'` |

## Tree Table Events

| Event Name | Description | Parameters |
|------------|-------------|------------|
| `expand` | Triggered when a user expands or collapses a row | `(row, expanded)` |

## Tree Table Methods

| Method Name | Description | Parameters |
|-------------|-------------|------------|
| `toggleRowExpansion` | Used for expandable tables or tree tables to toggle the expand state of a row | `(row, expanded)` |

## Usage Examples

### Department Organization Structure
```vue
<template>
  <ma-table
    ref="tableRef"
    :columns="columns"
    :data="departmentData"
    :options="treeOptions"
  />
</template>

<script setup>
import { ref } from 'vue'

const tableRef = ref()

const columns = [
  {
    label: 'Department Name',
    prop: 'name',
    cellRender: ({ row }) => (
      <div style="display: flex; align-items: center; gap: 8px;">
        <span>{row.icon}</span>
        <span>{row.name}</span>
      </div>
    )
  },
  { label: 'Manager', prop: 'manager' },
  { label: 'Employee Count', prop: 'employeeCount' }
]

const treeOptions = {
  rowKey: 'id',
  defaultExpandAll: false,
  treeProps: {
    children: 'children',
    hasChildren: 'hasChildren'
  },
  on: {
    onExpand: (row, expanded) => {
      console.log(`${row.name} ${expanded ? 'expanded' : 'collapsed'}`)
    }
  }
}

// Expand all nodes
const expandAll = () => {
  // Get all node IDs
  const getAllIds = (nodes) => {
    const ids = []
    nodes.forEach(node => {
      ids.push(node.id)
      if (node.children?.length) {
        ids.push(...getAllIds(node.children))
      }
    })
    return ids
  }
  
  treeOptions.expandRowKeys = getAllIds(departmentData)
}

// Collapse all nodes
const collapseAll = () => {
  treeOptions.expandRowKeys = []
}
</script>
```

### Lazy Loading Example
```vue
<script setup>
const lazyTreeOptions = {
  rowKey: 'id',
  lazy: true,
  load: async (row, treeNode, resolve) => {
    try {
      // Simulate asynchronous loading
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const children = await fetchChildrenData(row.id)
      resolve(children)
    } catch (error) {
      console.error('Failed to load child nodes:', error)
      resolve([])
    }
  },
  treeProps: {
    children: 'children',
    hasChildren: 'hasChildren'
  }
}

const fetchChildrenData = async (parentId) => {
  // Simulate API call
  const response = await api.getChildren(parentId)
  return response.data
}
</script>
```

## Best Practices

1. **Data Structure**: Ensure tree data has correct parent-child relationships and unique IDs
2. **Performance Optimization**: For large datasets, it is recommended to use lazy loading
3. **User Experience**: Provide clear loading states and expand/collapse feedback
4. **Level Control**: Reasonably control the depth of the tree structure to avoid overly deep nesting
5. **Interaction**: Provide appropriate action buttons and context menus for tree nodes

## Notes

- `rowKey` is required, used to uniquely identify each row of data
- In lazy loading mode, the `hasChildren` field is used to determine if a node has children
- The expand state is controlled via `expandRowKeys`, ensuring values in the array correspond to `rowKey`
- Modifications to tree data must maintain the integrity of the data structure