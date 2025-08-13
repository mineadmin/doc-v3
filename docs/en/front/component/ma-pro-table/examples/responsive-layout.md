# Responsive Layout

Demonstrates the responsive behavior of tables across different screen sizes, including mobile adaptation and layout optimization.

<DemoPreview dir="demos/ma-pro-table-examples/responsive-layout" />

## Key Features

- **Device Adaptation**: Automatically adapts to different devices like desktops, tablets, and mobile phones
- **Dynamic Column Management**: Dynamically shows/hides columns based on screen size
- **Responsive Search**: Search form supports responsive layouts
- **Operation Optimization**: Optimized operation methods for different devices
- **Performance Friendly**: Avoids displaying excessive information on small-screen devices

## Device Breakpoint Configuration

### Standard Breakpoints
```javascript
const deviceConfigs = {
  desktop: { 
    width: 1200, 
    name: 'Desktop', 
    type: 'Large Screen', 
    columns: 8 
  },
  tablet: { 
    width: 768, 
    name: 'Tablet', 
    type: 'Medium Screen', 
    columns: 5 
  },
  mobile: { 
    width: 375, 
    name: 'Mobile', 
    type: 'Small Screen', 
    columns: 3 
  }
}
```

### Responsive Container
```vue
<template>
  <div 
    class="responsive-container" 
    :class="currentDevice"
    :style="{ width: containerWidth + 'px' }"
  >
    <MaProTable :options="options" :schema="schema" />
  </div>
</template>

<style scoped>
.responsive-container {
  margin: 0 auto;
  border: 2px dashed #e4e7ed;
  border-radius: 8px;
  overflow-x: auto;
  transition: all 0.3s ease;
}

.responsive-container.desktop {
  border-color: #409eff;
}

.responsive-container.tablet {
  border-color: #e6a23c;
}

.responsive-container.mobile {
  border-color: #f56c6c;
}
</style>
```

## Responsive Search

### Search Item Quantity Control
```javascript
// Adjust displayed search items based on device
const updateSearchLayout = (device) => {
  const showNumber = device === 'desktop' ? 4 : 
                    device === 'tablet' ? 2 : 1
                    
  options.searchOptions = {
    showNumber,
    layout: device === 'mobile' ? 'vertical' : 'auto'
  }
}
```

### Search Layout Modes
```javascript
const searchOptions = {
  showNumber: 3,            // Default number of displayed search items
  layout: 'auto',           // auto/inline/vertical
  responsive: {
    mobile: {
      showNumber: 1,
      layout: 'vertical'
    },
    tablet: {
      showNumber: 2,
      layout: 'auto'
    }
  }
}
```

## Responsive Table Columns

### Dynamic Column Display
```javascript
const updateTableColumns = (device) => {
  const baseColumns = [
    { label: 'ID', prop: 'id', width: 60 },
    { label: 'Name', prop: 'name', width: 100, fixed: 'left' },
    { label: 'Department', prop: 'department', width: 100 },
    { label: 'Position', prop: 'position', width: 150 },
    { label: 'Salary', prop: 'salary', width: 120 },
    { label: 'Status', prop: 'status', width: 80 },
    { label: 'Join Date', prop: 'createTime', width: 120 }
  ]
  
  let visibleColumns
  if (device === 'mobile') {
    // Mobile shows only core information
    visibleColumns = [
      baseColumns[0], // ID
      baseColumns[1], // Name
      baseColumns[2], // Department
      baseColumns[5], // Status
      operationColumn
    ]
  } else if (device === 'tablet') {
    // Tablet shows main information
    visibleColumns = [
      baseColumns[0], // ID
      baseColumns[1], // Name
      baseColumns[2], // Department
      baseColumns[3], // Position
      baseColumns[4], // Salary
      baseColumns[5], // Status
      operationColumn
    ]
  } else {
    // Desktop shows all information
    visibleColumns = [...baseColumns, operationColumn]
  }
  
  schema.tableColumns = visibleColumns
}
```

### Column Width Adaptation
```javascript
// Mobile column width optimization
const getColumnWidth = (device, column) => {
  if (device === 'mobile') {
    return {
      id: 50,
      name: 80,
      department: 90,
      status: 70
    }[column.prop] || column.width
  }
  return column.width
}
```

## Responsive Operations

### Operation Column Adaptation
```javascript
const getOperationConfig = (device) => {
  return {
    type: device === 'mobile' ? 'dropdown' : 'auto',
    width: device === 'mobile' ? 120 : 
           device === 'tablet' ? 160 : 200,
    fold: device === 'mobile' ? 1 : 
          device === 'tablet' ? 2 : 3,
    actions: getDeviceActions(device)
  }
}
```

### Device-Specific Operations
```javascript
const getDeviceActions = (device) => {
  const baseActions = [
    {
      name: 'view',
      text: device === 'mobile' ? 'View' : 'Details',
      onClick: (data) => {
        if (device === 'mobile') {
          showMobileDetail(data.row)
        } else {
          showDesktopDetail(data.row)
        }
      }
    },
    {
      name: 'edit',
      text: 'Edit',
      onClick: (data) => {
        showEditDialog(data.row, device)
      }
    }
  ]
  
  // Desktop shows more operations
  if (device === 'desktop') {
    baseActions.push(
      {
        name: 'contact',
        text: 'Contact',
        onClick: (data) => {
          showContactInfo(data.row)
        }
      },
      {
        name: 'history',
        text: 'History',
        onClick: (data) => {
          showHistory(data.row)
        }
      }
    )
  }
  
  return baseActions
}
```

## Mobile Optimization

### Cell Content Adaptation
```javascript
// Mobile skill tag display optimization
{
  label: 'Skills',
  prop: 'skills',
  cellRender: ({ row }) => (
    <div>
      {row.skills.slice(0, device === 'mobile' ? 1 : 3).map((skill, index) => (
        <el-tag key={index} size="small">
          {skill}
        </el-tag>
      ))}
      {row.skills.length > (device === 'mobile' ? 1 : 3) && (
        <el-tag size="small" type="info">
          +{row.skills.length - (device === 'mobile' ? 1 : 3)}
        </el-tag>
      )}
    </div>
  )
}
```

### Mobile Styles
```css
/* Mobile-specific styles */
.responsive-container.mobile :deep(.ma-pro-table) {
  font-size: 14px;
}

.responsive-container.mobile :deep(.el-table th),
.responsive-container.mobile :deep(.el-table td) {
  padding: 8px 4px;
}

.responsive-container.mobile :deep(.el-pagination) {
  text-align: center;
}

.responsive-container.mobile :deep(.el-tag) {
  font-size: 12px;
  height: 20px;
  line-height: 18px;
}
```

### Tablet Styles
```css
/* Tablet-specific styles */
.responsive-container.tablet :deep(.el-table th),
.responsive-container.tablet :deep(.el-table td) {
  padding: 10px 6px;
}

.responsive-container.tablet :deep(.el-button) {
  padding: 6px 12px;
}
```

## Responsive Pagination

### Pagination Layout Adaptation
```javascript
const getPaginationLayout = (device) => {
  if (device === 'mobile') {
    return 'total, prev, pager, next'
  } else if (device === 'tablet') {
    return 'total, sizes, prev, pager, next'
  } else {
    return 'total, sizes, prev, pager, next, jumper'
  }
}

const options = {
  tableOptions: {
    pagination: {
      layout: getPaginationLayout(currentDevice.value),
      pageSizes: currentDevice.value === 'mobile' ? [10, 20] : [10, 20, 50, 100]
    }
  }
}
```

## Media Query Integration

### CSS Media Queries
```css
/* Use media queries for true responsiveness */
@media (max-width: 768px) {
  .ma-pro-table {
    font-size: 14px;
  }
  
  .ma-pro-table .el-table th,
  .ma-pro-table .el-table td {
    padding: 8px 4px !important;
  }
  
  .search-form .el-form-item {
    margin-bottom: 12px;
  }
}

@media (max-width: 480px) {
  .ma-pro-table {
    font-size: 12px;
  }
  
  .toolbar-buttons .el-button {
    padding: 4px 8px;
    font-size: 12px;
  }
}
```

### JavaScript Media Queries
```javascript
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false)
  
  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)
    
    const listener = (e) => setMatches(e.matches)
    media.addListener(listener)
    
    return () => media.removeListener(listener)
  }, [query])
  
  return matches
}

// Usage
const isMobile = useMediaQuery('(max-width: 768px)')
const isTablet = useMediaQuery('(max-width: 1024px) and (min-width: 769px)')
```

## Responsive Toolbar

### Toolbar Button Adaptation
```javascript
const getToolbarConfig = (device) => {
  if (device === 'mobile') {
    return {
      size: 'small',
      onlyIcons: true,        // Show only icons
      maxButtons: 3           // Maximum 3 buttons
    }
  } else if (device === 'tablet') {
    return {
      size: 'default',
      showText: true,         // Show text
      maxButtons: 5
    }
  } else {
    return {
      size: 'default',
      showText: true,
      maxButtons: -1          // Show all buttons
    }
  }
}
```

## Best Practices

### 1. Progressive Enhancement
- Start designing from mobile
- Gradually add desktop features
- Ensure core functionality works on all devices

### 2. Performance Optimization
- Avoid loading excessive data on small screens
- Use virtual scrolling for large datasets
- Optimize image and media resources

### 3. User Experience
- Provide device-specific interaction methods
- Maintain consistent visual hierarchy
- Ensure touch targets are large enough

### 4. Testing Strategy
- Test on real devices
- Use browser developer tools for simulation
- Consider network condition impacts

The responsive layout feature enables your table application to perfectly adapt to various devices, providing a consistent user experience.