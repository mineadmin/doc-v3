# Responsive Layout

Demonstrates responsive effects across different screen sizes, including real-time viewport information and dynamic configuration testing to ensure the search component provides an optimal user experience on all devices.

## Responsive Layout Demo

<DemoPreview dir="demos/ma-search/responsive-layout" />

## Responsive Configuration Guide

### Breakpoint System
MaSearch employs a responsive breakpoint system based on CSS Media Queries:

| Breakpoint | Screen Size | Default Columns | Typical Devices |
|------------|-------------|------------------|------------------|
| `xs` | < 768px | 1 | Mobile portrait |
| `sm` | ≥ 768px | 2 | Mobile landscape, small tablets |
| `md` | ≥ 992px | 2 | Tablets, small laptops |
| `lg` | ≥ 1200px | 3 | Desktop monitors |
| `xl` | ≥ 1920px | 4 | Large screens |

### Basic Configuration
Configure column counts per breakpoint using the `cols` parameter:

```typescript
const searchOptions = {
  cols: {
    xs: 1,  // Single column on mobile
    sm: 2,  // Two columns on tablets  
    md: 2,  // Two columns on medium screens
    lg: 3,  // Three columns on large screens
    xl: 4   // Four columns on extra-large screens
  }
}
```

### Custom Breakpoints
Define custom breakpoints based on business requirements:

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

## Use Cases

### 1. Mobile-First Design
Search interface optimized for mobile devices:

```typescript
// Mobile-friendly configuration
const mobileFirstConfig = {
  cols: { xs: 1, sm: 1, md: 2, lg: 3, xl: 4 },
  fold: true,
  foldRows: 1  // Show only one row by default on mobile
}
```

### 2. Dense Desktop Display
Maximize screen real estate on desktop:

```typescript
// Dense desktop display
const desktopDenseConfig = {
  cols: { xs: 1, sm: 2, md: 3, lg: 4, xl: 6 }
}
```

### 3. Adaptive Data Dashboard
Automatically adjust search area based on dashboard layout:

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
The component automatically calculates column counts based on container width and breakpoint configuration.

### Smooth Transitions
Layout transitions smoothly during screen size changes to avoid abrupt jumps.

### Content Overflow Handling
Automatically adds ellipsis or line breaks when search item content is too long.

## Key Features

- 📱 Mobile-friendly responsive design
- 🖥 Optimal large-screen utilization
- 🔄 Smooth layout transition animations
- 📏 Flexible breakpoint configuration system
- ⚡ High-performance layout calculations

## Advanced Configuration

### Dynamic Responsiveness
Adjust layout dynamically based on container size:

```typescript
// Monitor container size changes
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
Design starting from mobile and progressively enhance desktop experience:

```typescript
// Mobile-first configuration strategy
const progressiveConfig = {
  // Basic mobile experience
  cols: { xs: 1 },
  fold: true,
  foldRows: 1,
  
  // Tablet enhancements
  ...window.innerWidth >= 768 && { 
    cols: { xs: 1, sm: 2 },
    foldRows: 2 
  },
  
  // Complete desktop experience
  ...window.innerWidth >= 1200 && { 
    cols: { xs: 1, sm: 2, md: 3, lg: 4 },
    foldRows: 3 
  }
}
```

### 2. Content Prioritization
Display search items with different priorities across screen sizes:

```typescript
// Show items by priority based on screen size
const getItemsByPriority = (screenSize: string) => {
  const allItems = [
    { label: 'Username', prop: 'username', priority: 'high' },
    { label: 'Status', prop: 'status', priority: 'high' },
    { label: 'Registration Date', prop: 'created_at', priority: 'medium' },
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
Optimize rendering performance on small screens:

```typescript
// Small-screen performance optimization
const optimizedConfig = {
  // Reduce columns on mobile for better performance
  cols: window.innerWidth < 768 ? { xs: 1 } : { xs: 1, sm: 2, md: 3, lg: 4 },
  
  // Collapse by default on mobile to reduce initial rendering
  fold: window.innerWidth < 768,
  foldRows: window.innerWidth < 768 ? 1 : 2
}
```

## Related Links

- [Collapsible Search](./collapsible-search) - Learn about combining folding with responsive features
- [Table Integration](./table-integration) - Understand responsive search integration with tables
- [Basic Usage](./basic-usage) - Learn fundamental search functionality