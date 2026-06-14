# Custom Rendering

Demonstrates how to use `cellRender` and `headerRender` to customize cell and header rendering.

## Custom Rendering Demo

<DemoPreview dir="demos/ma-table/custom-render" />

## Features

### Render Types
- **Cell Rendering**: Customize cell content via `cellRender`
- **Header Rendering**: Customize header content via `headerRender`
- **JSX Syntax**: Supports JSX and TSX syntax for writing render functions
- **Component Rendering**: Can render any Vue component

### Render Parameters
The render function receives `TableColumnRenderer` parameters:
- `row`: Current row data
- `column`: Current column configuration
- `$index`: Current row index
- `options`: Column option configuration
- `attrs`: Other attributes

## Configuration Examples

### Basic Cell Rendering
```javascript
const columns = [
  { 
    label: 'Avatar', 
    prop: 'avatar',
    cellRender: ({ row }) => (
      <el-image
        style="width: 40px; height: 40px; border-radius: 50%;"
        src={row.avatar}
        fit="cover"
      />
    )
  }
]
```

### Progress Bar Rendering
```javascript
const columns = [
  { 
    label: 'Skill Level', 
    prop: 'skillLevel',
    cellRender: ({ row }) => (
      <el-progress
        percentage={row.skillLevel}
        color={row.skillLevel >= 80 ? '#67c23a' : '#e6a23c'}
        stroke-width={8}
        text-inside
      />
    )
  }
]
```

### Custom Header
```javascript
const columns = [
  { 
    label: 'Skill Level', 
    prop: 'skillLevel',
    headerRender: () => (
      <div style="display: flex; align-items: center; gap: 4px;">
        <span>⚡</span>
        <span style="color: #e74c3c;">Skill Level</span>
      </div>
    )
  }
]
```

### Action Button Group
```javascript
const columns = [
  { 
    label: 'Actions', 
    prop: 'actions',
    cellRender: ({ row }) => (
      <div style="display: flex; gap: 8px;">
        <el-button size="small" type="primary" onClick={() => handleEdit(row)}>
          Edit
        </el-button>
        <el-button size="small" type="danger" onClick={() => handleDelete(row)}>
          Delete
        </el-button>
      </div>
    )
  }
]
```

### Status Tag Rendering
```javascript
const columns = [
  { 
    label: 'Status', 
    prop: 'status',
    cellRender: ({ row }) => {
      const statusConfig = {
        'online': { type: 'success', icon: '🟢', text: 'Online' },
        'busy': { type: 'warning', icon: '🟡', text: 'Busy' },
        'offline': { type: 'danger', icon: '🔴', text: 'Offline' }
      }
      const config = statusConfig[row.status]
      return (
        <el-tag type={config.type}>
          <span style="margin-right: 4px;">{config.icon}</span>
          {config.text}
        </el-tag>
      )
    }
  }
]
```

### Complex Content Rendering
```javascript
const columns = [
  { 
    label: 'User Info', 
    prop: 'userInfo',
    cellRender: ({ row }) => (
      <div style="display: flex; align-items: center; gap: 12px;">
        <el-avatar size={40} src={row.avatar}>
          {row.name.charAt(0)}
        </el-avatar>
        <div>
          <div style="font-weight: bold; color: #333;">
            {row.name}
          </div>
          <div style="font-size: 12px; color: #999;">
            {row.email}
          </div>
        </div>
      </div>
    )
  }
]
```

### Rate Component Rendering
```javascript
const columns = [
  { 
    label: 'Rating', 
    prop: 'rating',
    cellRender: ({ row }) => (
      <el-rate
        v-model={row.rating}
        disabled
        show-score
        text-color="#ff9900"
        score-template="{value} points"
      />
    )
  }
]
```

## Render Function Type Definition

```typescript
interface TableColumnRenderer {
  row: any              // Current row data
  column: TableColumn   // Current column configuration  
  $index: number        // Current row index
  options: TableColumn  // Column options
  attrs: any            // Other attributes
}

type CellRenderFunction = (data: TableColumnRenderer) => VNode | string
type HeaderRenderFunction = (data: TableColumnRenderer) => VNode | string
```

## Best Practices

1. **Performance Considerations**: Avoid complex calculations in render functions, preprocess data during data processing stage
2. **Event Handling**: Define event handler functions outside the component to avoid duplicate creation
3. **Style Control**: Use inline styles or CSS classes to control rendered content styling
4. **Component Reuse**: Extract complex rendering logic into separate components for reuse
5. **Type Safety**: In TypeScript projects, add type annotations for render function parameters

## Notes

- Render function return values can be VNode, string, or component
- Supports rendering all Element Plus components
- Can access and modify row data within render functions
- Events in render functions need to be handled manually
- Recommended to use JSX/TSX syntax for better development experience