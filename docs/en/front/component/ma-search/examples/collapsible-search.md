# Collapsible Search

Displays a search form with collapsible functionality, suitable for scenarios with multiple search items. The collapsible feature saves page space and enhances user experience.

## Collapsible Search Demo

<DemoPreview dir="demos/ma-search/collapsible-search" />

## Collapsible Functionality

### Basic Configuration
Control collapsible behavior through `fold` and `foldRows` parameters:

```typescript
const searchOptions = {
  fold: true,        // Enable collapsible feature
  foldRows: 2,       // Display 2 rows by default
}
```

### Custom Button Text
Customize collapsible button text through `text` configuration:

```typescript
const searchOptions = {
  text: {
    isFoldBtn: 'Show more search conditions',
    notFoldBtn: 'Hide some search conditions'
  }
}
```

### Programmatic Control
Control collapsible state through component instance methods:

```typescript
// Toggle collapsible state
searchRef.value?.foldToggle()

// Get current collapsible state
const isFold = searchRef.value?.getFold()
```

## Usage Scenarios

### 1. Admin Systems
In admin backends where multiple search conditions are often needed, the collapsible feature maintains interface cleanliness.

### 2. Data Analysis Platforms
For complex data filtering, frequently used conditions are displayed while advanced conditions remain hidden in the collapsible area.

### 3. Mobile Adaptation
Particularly important on mobile devices where screen space is limited.

## Collapsible Strategies

### Smart Collapsing
- Automatically calculates number of items to collapse
- Prioritizes display of most frequently used search conditions
- Keeps action buttons always visible

### Responsive Collapsing
- Automatically adjusts fold rows based on screen size
- Defaults to more compact display on mobile
- Smooth expand/collapse animations

## Key Features

- 📱 Mobile-friendly design
- 🔄 Smooth expand/collapse animations
- 🎛 Flexible fold row configuration
- 📝 Customizable button text
- ⚡ Programmatic state control

## Best Practices

### 1. Reasonable Fold Row Settings
Set `foldRows` appropriately based on actual business scenarios and page layout:

```typescript
// Recommended 2-3 rows for desktop
// Recommended 1-2 rows for mobile
const searchOptions = {
  foldRows: window.innerWidth < 768 ? 1 : 2
}
```

### 2. Optimize Search Item Order
Place most frequently used search conditions first to ensure visibility when collapsed.

### 3. Provide State Indicators
Clearly indicate current collapsible state through custom button text or icons.

## Related Links

- [Responsive Layout](./responsive-layout) - Learn about adaptive display across screens
- [Custom Actions](./custom-actions) - Learn about custom action buttons
- [Basic Usage](./basic-usage) - Learn about basic search functionality