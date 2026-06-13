# Layout Systems

Demonstrates MaForm's two layout systems: Flex grid layout and Grid spacing layout, along with responsive design implementation.

<DemoPreview dir="demos/ma-form/layout-systems" />

## Features

- **Dual Layout System**: Supports both Flex and Grid layout methods
- **Responsive Grid**: Responsive layout based on Element Plus grid system
- **Breakpoint Adaptation**: Supports five breakpoints: xs, sm, md, lg, xl
- **Flexible Configuration**: Allows setting layout properties for each form item individually
- **Mobile Optimization**: Automatically switches to single-column layout on mobile devices

## Flex Layout (Default)

Grid system implemented based on Element Plus's `el-row` and `el-col`:

### Basic Configuration
```typescript
const formOptions = {
  layout: 'flex',
  flex: {
    gutter: 20,        // Grid spacing
    type: 'flex',      // Enable flex mode
    justify: 'start',  // Horizontal alignment
    align: 'middle'    // Vertical alignment
  }
}
```

### Grid Configuration
```typescript
const formItem = {
  label: 'Title',
  prop: 'title',
  render: 'input',
  cols: {
    span: 12,        // Occupies 12 columns (out of 24 total)
    offset: 0,       // Left side interval columns
    push: 0,         // Columns to move right
    pull: 0,         // Columns to move left
    order: 1,        // Sort priority
    
    // Responsive configuration
    xs: 24,          // Extra small screen: fills one row
    sm: 12,          // Small screen: occupies half
    md: 8,           // Medium screen: occupies one third
    lg: 6,           // Large screen: occupies one quarter
    xl: 4            // Extra large screen: occupies one sixth
  }
}
```

## Grid Layout

Spacing layout implemented based on Element Plus's `el-space`:

### Basic Configuration
```typescript
const formOptions = {
  layout: 'grid',
  grid: {
    direction: 'vertical',    // Arrangement direction
    size: 'large',           // Spacing size: small | default | large
    wrap: true,              // Whether to wrap
    fill: true,              // Whether to fill container width
    fillRatio: 30,           // Fill ratio
    alignment: 'start'       // Alignment method
  }
}
```

### Use Cases
- **Vertical Forms**: Simple forms with fewer fields
- **Dynamic Forms**: Forms with an uncertain number of fields
- **Compact Layout**: Scenarios requiring space saving

## Responsive System

### Breakpoint Definition

| Breakpoint | Device Type | Width Range | Recommended Columns |
|------------|-------------|-------------|---------------------|
| `xs` | Mobile Portrait | < 768px | 1 column |
| `sm` | Mobile Landscape/Small Tablet | ≥ 768px | 1-2 columns |
| `md` | Tablet | ≥ 992px | 2-3 columns |
| `lg` | Small Desktop | ≥ 1200px | 3-4 columns |
| `xl` | Large Desktop | ≥ 1920px | 4+ columns |

### Responsive Configuration Example

```typescript
// Responsive form item configuration
const responsiveField = {
  label: 'Title',
  prop: 'title',
  render: 'input',
  cols: {
    // Mobile-first
    xs: { span: 24 },                    // Phone: fills the entire row
    sm: { span: 12, offset: 0 },         // Small screen: two columns per row
    md: { span: 8, offset: 0 },          // Medium screen: three columns per row  
    lg: { span: 6, offset: 0 },          // Large screen: four columns per row
    xl: { span: 4, offset: 2 }           // Extra large screen: six columns per row, left margin
  }
}

// Global responsive configuration
const formOptions = {
  responsiveConfig: {
    enabled: true,
    mobileSingleColumn: true,      // Force single column on mobile
    mobileHideLabels: false,       // Whether to hide labels on mobile
    breakpoints: {
      xs: 576,
      sm: 768, 
      md: 992,
      lg: 1200,
      xl: 1920
    }
  }
}
```

## Layout Best Practices

### 1. Choose the Right Layout System

```typescript
// Complex form → Use Flex layout
const complexForm = {
  layout: 'flex',
  flex: { gutter: 16 }
}

// Simple form → Use Grid layout  
const simpleForm = {
  layout: 'grid',
  grid: { direction: 'vertical', size: 'medium' }
}
```

### 2. Plan Grid Rationally

```typescript
// Standard three-column layout
const threeColumnLayout = {
  cols: {
    xs: 24,    // Mobile: single column
    sm: 24,    // Small screen: single column
    md: 8,     // Medium screen: three columns
    lg: 8,     // Large screen: three columns
    xl: 8      // Extra large screen: three columns
  }
}

// Primary-secondary layout
const primarySecondaryLayout = {
  // Primary field
  cols: { xs: 24, sm: 16, md: 12, lg: 16 },
  
  // Secondary field
  cols: { xs: 24, sm: 8, md: 6, lg: 8 }
}
```

### 3. Mobile Optimization

```typescript
const mobileOptimized = {
  mobileBreakpoint: 768,
  responsiveConfig: {
    enabled: true,
    mobileSingleColumn: true,      // Single column on mobile
    mobileHideLabels: false        // Keep labels visible
  }
}
```

## Related Links

- [Layout System Details](/v3/front/component/ma-form#layout-system-details)
- [Responsive Configuration](/v3/front/component/ma-form#responsiveconfig-responsive-configuration)
- [Mobile Adaptation](/v3/front/component/ma-form/examples/mobile-responsive)