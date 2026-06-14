# Responsive Layout

Demonstrates responsive effects across different screen sizes, including real-time viewport information and dynamic configuration testing, ensuring a good user experience for the search component on various devices.

## Responsive Layout Demo

<DemoPreview dir="demos/ma-search/responsive-layout" />

## Responsive Configuration Description

### Breakpoint System
MaSearch uses a responsive breakpoint system based on CSS Media Queries:

| Breakpoint | Screen Size | Default Columns | Typical Device |
|------------|-------------|-----------------|----------------|
| `xs` | < 768px | 1 | Phone Portrait |
| `sm` | ≥ 768px | 2 | Phone Landscape, Small Tablet |
| `md` | ≥ 992px | 2 | Tablet, Small Laptop |
| `lg` | ≥ 1200px | 3 | Desktop Monitor |
| `xl` | ≥ 1920px | 4 | Large Screen Monitor |

### Basic Configuration
Configure the number of columns at different breakpoints via the `cols` parameter:

```typescript
const searchOptions = {
  cols: {
    xs: 1,  // Single column on mobile
    sm: 2,  // Double column on tablet
    md: 2,  // Double column on medium screens
    lg: 3,  // Triple column on large screens
    xl: 4   // Four columns on extra-large screens
  }
}
```

### Custom Breakpoints
Customize breakpoint configuration based on actual business needs:

```typescript
// Compact layout
const compactCols = {
  xs: 1,
  sm: 3,
  md: 4,
  lg: 5,
  xl: 6
}

// Spacious layout
const spaciousCols = {
  xs: 1,
  sm: 1,
  md: 2,
  lg: 2,
  xl: 3
}
```

## Usage Scenarios

### 1. Mobile-First Design
Search interface optimized for mobile devices:

```typescript
// Mobile-friendly configuration
const mobileFirstConfig = {
  cols: { xs: 1, sm: 1, md: 2, lg: 3, xl: 4 },
  fold: true,
  foldRows: 1  // Only one row shown by default on mobile
}
```

### 2. Desktop Dense Display
Fully utilize desktop screen space:

```typescript
// Desktop dense display
const desktopDenseConfig = {
  cols: { xs: 1, sm: 2, md: 3, lg: 4, xl: 6 }
}
```

### 3. Adaptive Data Dashboard
Automatically adjust the search area according to the dashboard layout:

```typescript
// Dashboard adaptive configuration
const dashboardConfig = {
  cols: { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 },
  fold: true,
  foldRows: 1
}
```

## Responsive Features

### Automatic Column Calculation
The component automatically calculates the number of columns per row based on container width and breakpoint configuration.

### Smooth Transition
The layout transitions smoothly when the screen size changes, avoiding abrupt jumps.

### Content Overflow Handling
When search item content is too long, ellipsis or line-wrapping handling is automatically applied.

## Key Features

- 📱 Mobile-friendly responsive design
- 🖥 Full utilization of large screen space
- 🔄 Smooth layout transition animation
- 📏 Flexible breakpoint configuration system
- ⚡ High-performance layout calculations

## Advanced Configuration

### Dynamic Responsive
Dynamically adjust layout based on container size:

```typescript
// Listen for container size changes
const useResponsiveColumns = () => {
  const containerRef = ref<HTMLElement>()
  const cols = ref({ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 })
  
  const updateCols = () => {
    if (!containerRef.value) return
    
    const width = containerRef.value.offsetWidth
    if (width < 600) {
      cols.value = { xs: 1, sm: 1, md: 2, lg: 3, xl: 4 }
    } else if (width > 1400) {
      cols.value = { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }
    }
  }
  
  onMounted(() => {
    window.addEventListener('resize', updateCols)
    updateCols()
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', updateCols)
  })
  
  return { containerRef, cols }
}
```

### Device Type Detection
Optimize layout based on device type:

```typescript
// Detect device type
const deviceType = () => {
  const ua = navigator.userAgent
  if (/Mobile|Android|iPhone/i.test(ua)) {
    return 'mobile'
  } else if (/Tablet|iPad/i.test(ua)) {
    return 'tablet' 
  } else {
    return 'desktop'
  }
}

// Configure based on device type
const getDeviceConfig = () => {
  const type = deviceType()
  switch (type) {
    case 'mobile':
      return { cols: { xs: 1, sm: 1, md: 1, lg: 2, xl: 2 }, foldRows: 1 }
    case 'tablet':
      return { cols: { xs: 1, sm: 2, md: 2, lg: 3, xl: 3 }, foldRows: 2 }
    case 'desktop':
      return { cols: { xs: 2, sm: 3, md: 4, lg: 4, xl: 5 }, foldRows: 3 }
  }
}
```

## Best Practices

### 1. Progressive Enhancement
Start designing from mobile and gradually enhance the desktop experience:

```typescript
// Mobile-first configuration strategy
const progressiveConfig = {
  // Mobile basic experience
  cols: { xs: 1 },
  fold: true,
  foldRows: 1,
  
  // Tablet enhancement
  ...window.innerWidth >= 768 && { 
    cols: { xs: 1, sm: 2 },
    foldRows: 2 
  },
  
  // Desktop complete experience
  ...window.innerWidth >= 1200 && { 
    cols: { xs: 1, sm: 2, md: 3, lg: 4 },
    foldRows: 3 
  }
}
```

### 2. Content Priority
Display search items with different priorities on different screens:

```typescript
// Display search items with different priorities based on screen size
const getItemsByPriority = (screenSize: string) => {
  const allItems = [
    { label: 'Username', prop: 'username', priority: 'high' },
    { label: 'Status', prop: 'status', priority: 'high' },
    { label: 'Registration Time', prop: 'created_at', priority: 'medium' },
    { label: 'Last Login', prop: 'last_login', priority: 'low' }
  ]
  
  switch (screenSize) {
    case 'xs':
      return allItems.filter(item => item.priority === 'high')
    case 'sm':
      return allItems.filter(item => ['high', 'medium'].includes(item.priority))
    default:
      return allItems
  }
}
```

### 3. Performance Optimization
Optimize rendering performance on small screen devices:

```typescript
// Performance optimization for small screen devices
const optimizedConfig = {
  // Reduce columns on mobile for better performance
  cols: window.innerWidth < 768 ? { xs: 1 } : { xs: 1, sm: 2, md: 3, lg: 4 },
  
  // Collapse by default on mobile to reduce initial rendering
  fold: window.innerWidth < 768,
  foldRows: window.innerWidth < 768 ? 1 : 2
}
```

## Related Links

- [Collapsible Search](./collapsible-search) - Learn about combining the collapse feature with responsive design
- [Table Integration](./table-integration) - Learn about integrating responsive search with tables
- [Basic Usage](./basic-usage) - Learn about basic search functionality