# Collapsible Search

Demonstrates the collapse and expand functionality of search forms, suitable for scenarios with many search items. By using the collapse feature, it saves page space and enhances the user experience.

## Collapsible Search Demo

<DemoPreview dir="demos/ma-search/collapsible-search" />

## Collapse Feature Description

### Basic Configuration
Control collapse behavior via the `fold` and `foldRows` parameters:

```typescript
const searchOptions = {
  fold: true,        // Enable collapse feature
  foldRows: 2,       // Default display of 2 rows
}
```

### Custom Button Text
Configure custom button text for the collapse button via `text`:

```typescript
const searchOptions = {
  text: {
    isFoldBtn: 'Expand more search criteria',
    notFoldBtn: 'Collapse some search criteria'
  }
}
```

### Programmatic Control
Control the collapse state via component instance methods:

```typescript
// Toggle collapse state
searchRef.value?.foldToggle()

// Get current collapse state
const isFold = searchRef.value?.getFold()
```

## Use Cases

### 1. Backend Management Systems
In management backends, multiple search criteria are often required. The collapse feature helps keep the interface clean.

### 2. Data Analysis Platforms
For complex data filtering conditions, commonly used conditions are displayed through the collapse feature, while advanced conditions are hidden in the collapsed area.

### 3. Mobile Adaptation
On mobile devices, where screen space is limited, the collapse feature is particularly important.

## Collapse Strategy

### Smart Collapse
- Automatically calculates the number of search items to be collapsed
- Prioritizes displaying the most commonly used search conditions
- Keeps action buttons always visible

### Responsive Collapse
- Automatically adjusts the number of collapsed rows based on screen size
- Default to a more compact display on mobile devices
- Smooth expand/collapse animations

## Key Features

- 📱 Mobile-friendly design
- 🔄 Smooth expand/collapse animations
- 🎛 Flexible configuration of collapsed rows
- 📝 Customizable button text
- ⚡ Programmatic state control

## Best Practices

### 1. Set Collapsed Rows Appropriately
Set the `foldRows` parameter appropriately based on actual business scenarios and page layout:

```typescript
// Recommended 2-3 rows for desktop
// Recommended 1-2 rows for mobile
const searchOptions = {
  foldRows: window.innerWidth < 768 ? 1 : 2
}
```

### 2. Optimize Search Item Order
Place the most commonly used search conditions at the front to ensure they are visible even in the collapsed state.

### 3. Provide State Indication
Use custom button text or icons to clearly indicate the current collapse state to the user.

## Related Links

- [Responsive Layout](./responsive-layout) - Learn about adaptive display on different screens
- [Custom Actions](./custom-actions) - Learn about custom action buttons
- [Basic Usage](./basic-usage) - Learn about basic search functionality