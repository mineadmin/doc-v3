# Collapsible Search

Displays a search form with collapsible and expandable functionality, suitable for scenarios with numerous search items. The collapsible feature saves page space and enhances user experience.

## Collapsible Search Demo

<DemoPreview dir="demos/ma-search/collapsible-search" />

## Collapsible Functionality Description

### Basic Configuration
Control collapsible behavior through `fold` and `foldRows` parameters:

```typescript
const searchOptions = {
  fold: true,        // Enable collapsible feature
  foldRows: 2,       // Display 2 rows by default
}
```

### Custom Button Text
Customize the collapsible button text through `text` configuration:

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

### 1. Backend Management Systems
In admin backends where multiple search conditions are typically needed, the collapsible feature maintains interface cleanliness.

### 2. Data Analysis Platforms
For complex data filtering conditions, commonly used criteria are displayed while advanced conditions remain hidden in the collapsible area.

### 3. Mobile Adaptation
On mobile devices with limited screen space, the collapsible feature is particularly important.

## Collapsible Strategies

### Smart Collapsing
- Automatically calculates the number of search items to collapse
- Prioritizes displaying the most frequently used search conditions
- Keeps action buttons always visible

### Responsive Collapsing
- Automatically adjusts the number of collapsed rows based on screen size
- Defaults to more compact display on mobile
- Smooth expand/collapse animation effects

## Key Features

- 📱 Mobile-friendly design
- 🔄 Smooth expand/collapse animations
- 🎛 Flexible row collapse configuration
- 📝 Customizable button text
- ⚡ Programmatic state control

## Best Practices

### 1. Reasonable Fold Row Settings
Set the `foldRows` parameter appropriately based on actual business scenarios and page layout:

```typescript
// Recommended 2-3 rows for desktop
// Recommended 1-2 rows for mobile
const searchOptions = {
  foldRows: window.innerWidth < 768 ? 1 : 2
}
```

### 2. Optimize Search Item Order
Place the most commonly used search conditions first to ensure visibility in collapsed state.

### 3. Provide State Indication
Clearly indicate the current collapsed state through custom button text or icons.

## Related Links

- [Responsive Layout](./responsive-layout) - Learn about adaptive display across different screens
- [Custom Actions](./custom-actions) - Understand custom action buttons
- [Basic Usage](./basic-usage) - Learn fundamental search functionality