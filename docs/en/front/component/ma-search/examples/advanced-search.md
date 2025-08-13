# Advanced Search

Demonstrates the implementation of complex search scenarios, including advanced features such as multiple form component types, JSX custom rendering, conditional display, and more.

## Complex Search Form

<DemoPreview dir="demos/ma-search/advanced-search" />

## Advanced Features Explained

### JSX Custom Rendering
Achieve fully customized form components by returning JSX elements via functions:

```typescript
{
  label: 'Custom Component',
  prop: 'custom',
  render: () => <CustomSearchComponent />
}
```

### Conditional Display
Use the `hide` function to dynamically show or hide search items:

```typescript
{
  label: 'Advanced Option',
  prop: 'advanced',
  render: 'input',
  hide: () => !showAdvanced.value
}
```

### Multi-Select Components
Support multi-select type search components such as checkbox groups and cascading selectors:

```typescript
{
  label: 'Multi-Select Categories',
  prop: 'categories',
  render: 'checkbox-group',
  options: categoryOptions
}
```

## Use Cases

### 1. Enterprise Data Filtering
Suitable for complex business data filtering, supporting multi-dimensional and multi-condition combined queries.

### 2. Report Query Systems  
Ideal for report queries requiring precise condition control, supporting complex conditions such as time ranges and numerical intervals.

### 3. E-commerce Advanced Filtering
Perfect for product filtering on e-commerce platforms, supporting various filtering dimensions like brand, specifications, and price.

## Key Features

- 🎯 Supports JSX/TSX custom rendering
- 🔄 Dynamic display and hiding of search items
- 📊 Multiple data selection component support
- ⚡ Performance-optimized rendering mechanism
- 🛠 Flexible configuration and expansion capabilities

## Technical Highlights

### Custom Rendering Functions
- Supports returning any Vue component or JSX element
- Automatically passes form data and update methods
- Full type inference and intelligent hints

### Performance Optimization
- Uses virtual list technology to handle large numbers of options
- Debounce processing to reduce unnecessary requests
- Smart caching to enhance user experience

## Related Links

- [Basic Usage](./basic-usage) - Learn about basic search configurations
- [Custom Actions](./custom-actions) - Learn about custom action buttons
- [Dynamic Management](./dynamic-items) - Learn about dynamic search item management