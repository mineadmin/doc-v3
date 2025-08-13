# Cell Render Plugins

Demonstrates the usage of various cell render plugins, including built-in and custom plugins.

<DemoPreview dir="demos/ma-pro-table-examples/cell-render-plugins" />

## Features

- **Plugin Mechanism**: Extend cell rendering capabilities through a plugin system
- **Built-in Plugins**: Provides commonly used render plugins (e.g., tags, progress bars)
- **Custom Plugins**: Supports registering custom render plugins
- **Flexible Configuration**: Supports dynamic property configuration and conditional rendering
- **Code Reusability**: Avoids repetitive rendering logic

## Built-in Plugins

### Tag Plugin
```javascript
{
  label: 'Status',
  prop: 'status',
  cellRenderTo: {
    name: 'tag',
    props: (data) => ({
      type: data.row.status === 1 ? 'success' : 'danger'
    })
  },
  formatter: (row) => row.status === 1 ? 'Active' : 'Inactive'
}
```

## Custom Plugins

### Register Plugin
```javascript
import { useProTableRenderPlugin } from '@mineadmin/pro-table'
import { h } from 'vue'

const { addPlugin } = useProTableRenderPlugin()

// Register progress bar plugin
addPlugin({
  name: 'progress',
  render: (data, props) => {
    return h(ElProgress, {
      percentage: data.row[data.column.property] || 0,
      color: props?.color || '#409eff',
      strokeWidth: props?.strokeWidth || 10,
      textInside: props?.textInside !== false,
      ...props
    })
  }
})
```

### Using Custom Plugin
```javascript
{
  label: 'Work Progress',
  prop: 'progress',
  cellRenderTo: {
    name: 'progress',
    props: (data) => ({
      color: data.row.progress >= 90 ? '#67c23a' : '#e6a23c',
      strokeWidth: 12,
      textInside: true
    })
  }
}
```

## Common Plugin Examples

### 1. Progress Bar Plugin
```javascript
addPlugin({
  name: 'progress',
  render: (data, props) => {
    return h(ElProgress, {
      percentage: data.row[data.column.property] || 0,
      color: props?.color || '#409eff',
      strokeWidth: props?.strokeWidth || 10,
      textInside: props?.textInside !== false,
      ...props
    })
  }
})
```

### 2. Rating Plugin
```javascript
addPlugin({
  name: 'rate',
  render: (data, props) => {
    return h(ElRate, {
      modelValue: data.row[data.column.property] || 0,
      disabled: true,
      showScore: props?.showScore !== false,
      scoreTemplate: props?.scoreTemplate || '{value} points',
      ...props
    })
  }
})
```

### 3. Image Plugin
```javascript
addPlugin({
  name: 'image',
  render: (data, props) => {
    const src = data.row[data.column.property]
    if (!src) return 'No Image'
    
    return h(ElImage, {
      src,
      style: { width: '60px', height: '40px' },
      fit: 'cover',
      previewSrcList: [src],
      ...props
    })
  }
})
```

### 4. Switch Plugin
```javascript
addPlugin({
  name: 'switch',
  render: (data, props, proxy) => {
    return h(ElSwitch, {
      modelValue: !!data.row[data.column.property],
      onChange: (value) => {
        // Handle switch change
        console.log(`${data.row.name} status ${value ? 'enabled' : 'disabled'}`)
      },
      ...props
    })
  }
})
```

### 5. Link Plugin
```javascript
addPlugin({
  name: 'link',
  render: (data, props) => {
    const text = data.row[data.column.property]
    return h(ElLink, {
      type: props?.type || 'primary',
      href: props?.href || '#',
      target: props?.target || '_blank',
      onClick: () => {
        if (props?.onClick) {
          props.onClick(data)
        }
      },
      ...props
    }, {
      default: () => text
    })
  }
})
```

### 6. Tags Plugin
```javascript
addPlugin({
  name: 'tags',
  render: (data, props) => {
    const tags = data.row[data.column.property] || []
    if (!Array.isArray(tags)) return 'No Tags'
    
    return h('div', tags.map((tag, index) => 
      h('el-tag', {
        key: index,
        size: 'small',
        type: props?.type || 'primary',
        style: 'margin-right: 4px; margin-bottom: 2px;',
        ...props
      }, {
        default: () => tag
      })
    ))
  }
})
```

## Plugin Usage Examples

### Avatar Display
```javascript
{
  label: 'Avatar',
  prop: 'avatar',
  width: 100,
  cellRenderTo: {
    name: 'image',
    props: {
      style: { width: '50px', height: '50px', borderRadius: '50%' }
    }
  }
}
```

### Skill Tags
```javascript
{
  label: 'Skills',
  prop: 'skills',
  width: 200,
  cellRenderTo: {
    name: 'tags',
    props: {
      type: 'info'
    }
  }
}
```

### Rating Display
```javascript
{
  label: 'Rating',
  prop: 'rating',
  width: 150,
  cellRenderTo: {
    name: 'rate',
    props: {
      showScore: true,
      scoreTemplate: '{value} points'
    }
  }
}
```

### Personal Website Link
```javascript
{
  label: 'Website',
  prop: 'website',
  width: 120,
  cellRenderTo: {
    name: 'link',
    props: (data) => ({
      type: 'primary',
      href: data.row.website,
      target: '_blank',
      onClick: (linkData) => {
        console.log(`Visiting ${linkData.row.name}'s website`)
      }
    })
  },
  formatter: () => 'Visit Site'
}
```

## Plugin Management

### Get Plugin Information
```javascript
import { useProTableRenderPlugin } from '@mineadmin/pro-table'

const { getPlugins, getPluginByName, removePlugin } = useProTableRenderPlugin()

// Get all plugins
const allPlugins = getPlugins()

// Get specific plugin
const tagPlugin = getPluginByName('tag')

// Remove plugin
removePlugin('custom-plugin')
```

### Plugin Parameter Description
```javascript
// Plugin definition
interface MaProTableRenderPlugin {
  name: string                    // Plugin name (unique identifier)
  render: (                       // Render function
    data: TableColumnRenderer,    // Table data and column info
    props: any,                   // Plugin parameters
    proxy: MaProTableExpose       // Table instance
  ) => VNode | string
}

// Using plugin
{
  cellRenderTo: {
    name: 'plugin-name',          // Plugin name
    props: any | any[] | (data) => any  // Plugin parameters (supports dynamic calculation)
  }
}
```

## Best Practices

### 1. Plugin Naming
- Use descriptive names like `progress`, `image`, `tags`
- Avoid conflicts with built-in plugin names
- Consider adding prefixes if publishing to marketplace

### 2. Performance Optimization
- Avoid complex computations in render functions
- Use props functions for conditional logic and property calculations
- Leverage Vue's reactivity system appropriately

### 3. Error Handling
```javascript
addPlugin({
  name: 'safe-plugin',
  render: (data, props) => {
    try {
      // Plugin logic
      return h(SomeComponent, props)
    } catch (error) {
      console.error('Plugin render error:', error)
      return 'Render Error'
    }
  }
})
```

### 4. Type Safety
```typescript
// TypeScript plugin definition
import type { MaProTableRenderPlugin } from '@mineadmin/pro-table'

const myPlugin: MaProTableRenderPlugin = {
  name: 'my-plugin',
  render: (data, props) => {
    // Type-safe plugin logic
    return h('div', data.row[data.column.property])
  }
}
```

The cell render plugin system provides powerful extensibility, allowing you to easily build rich table display effects.