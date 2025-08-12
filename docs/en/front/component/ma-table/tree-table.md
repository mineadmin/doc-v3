# Tree Table

Displays hierarchical structure data, supporting expand/collapse, lazy loading, custom icons, and other features.

## Tree Table Demo

<DemoPreview dir="demos/ma-table/tree-table" />

## Features

### Hierarchical Structure
- **Multi-level nesting**: Supports displaying tree data with any number of levels
- **Expand control**: Allows controlling the expand/collapse state of nodes
- **Default expansion**: Supports setting default expanded nodes
- **Lazy loading**: Supports lazy loading mechanism for nodes

### Visual Indicators
- **Level indentation**: Automatically adds indentation based on hierarchy
- **Expand icons**: Provides default expand/collapse icons
- **Custom icons**: Supports custom icons for each node
- **Status indicators**: Can add visual markers for nodes with different statuses

## Configuration Examples

### Basic Tree Configuration
```javascript
const options = {
  rowKey: 'id',                    // Row data key
  defaultExpandAll: false,         // Whether to expand all rows by default
  treeProps: {
    children: 'children',          // Specifies the child node field name
    hasChildren: 'hasChildren'     // Specifies the field name indicating whether child nodes exist
  }
}
```

### Default Expanded Nodes
```javascript
const options = {
  rowKey: 'id',
  expandRowKeys: [1, 2, 3],       // Array of keys for rows to expand by default
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
    manager: 'Director Zhang',
    children: [
      {
        id: 11,
        name: 'Technology Department',
        manager: 'Tech Lead Li',
        children: [
          {
            id: 111,
            name: 'Frontend Team',
            manager: 'Frontend Wang',
            children: []
          },
          {
            id: 112,
            name: 'Backend Team',
            manager: 'Backend Zhao',
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
|-----|------|-----|--------|
| `rowKey` | Row data key, used to optimize Table rendering | `string \| Function(row): string` | - |
| `defaultExpandAll` | Whether to expand all rows by default | `boolean` | `false` |
| `expandRowKeys` | Can set currently expanded rows through this property | `array` | - |
| `treeProps` | Configuration options for rendering nested data | `object` | - |

### Lazy Loading Parameters

| Parameter | Description | Type | Default |
|-----|------|-----|--------|
| `lazy` | Whether to lazily load child node data | `boolean` | `false` |
| `load` | Function to load child node data | `Function(row, treeNode, resolve)` | - |
| `indent` | Horizontal indentation between adjacent level nodes, in pixels | `number` | `16` |

### treeProps Configuration

| Parameter | Description | Type | Default |
|-----|------|-----|--------|
| `children` | Specifies which node property contains the subtree | `string` | `'children'` |
| `hasChildren` | Specifies the node property indicating whether it's a leaf node | `string` | `'hasChildren'` |

## Tree Table Events

| Event Name | Description | Parameters |
|-------|------|------|
| `expand` | Triggered when user expands or collapses a row | `(row, expanded)` |

## Tree Table Methods

| Method Name | Description | Parameters |
|-------|------|------|
| `toggleRowExpansion` | Used for expandable tables or tree tables to toggle a row's expansion state | `(row, expanded)` |

## Usage Examples

### Department Organizational Structure
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
      // Simulate async loading
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
2. **Performance Optimization**: For large datasets, recommend using lazy loading mechanism
3. **User Experience**: Provide clear loading states and expand/collapse feedback
4. **Level Control**: Reasonably control the depth of tree structure, avoid excessive nesting
5. **Interaction Design**: Provide appropriate action buttons and context menus for tree nodes

## Notes

- `rowKey` is required to uniquely identify each row of data
- In lazy loading mode, the `hasChildren` field determines whether a node has children
- Expansion state is controlled through `expandRowKeys`, ensure values match `rowKey`
- Modifications to tree data must maintain structural integrity