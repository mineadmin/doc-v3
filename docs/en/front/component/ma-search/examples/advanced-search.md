# Advanced Search

Demonstrates the implementation of complex search scenarios, including advanced features such as multiple form component types, JSX custom rendering, conditional display, and more.

## Complex Search Form

<DemoPreview dir="demos/ma-search/advanced-search" />

## Advanced Features

### JSX Custom Rendering
Fully customize form components by returning JSX elements via functions:

```typescript
{
  label: 'Custom Component',
  prop: 'custom',
  render: () => <CustomSearchComponent />
}
```

### Conditional Display
Dynamically show or hide search items using the `hide` function:

```typescript
{
  label: 'Advanced Option',
  prop: 'advanced',
  render: 'input',
  hide: () => !showAdvanced.value
}
```

### Multi-Select Components
Supports multi-select components like checkbox groups and cascaders:

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
Ideal for complex business data filtering with multi-dimensional, multi-condition combined queries.

### 2. Report Query Systems  
Suitable for report queries requiring precise condition control, supporting time ranges, numerical intervals, and other complex criteria.

### 3. E-commerce Advanced Filtering
Perfect for product filtering in e-commerce platforms, supporting multiple dimensions like brands, specifications, and prices.

## Key Features

- 🎯 Supports JSX/TSX custom rendering
- 🔄 Dynamic show/hide for search items
- 📊 Multiple data selection component options
- ⚡ Performance-optimized rendering
- 🛠 Flexible configuration and extensibility

## Technical Highlights

### Custom Rendering Functions
- Supports returning any Vue component or JSX element
- Automatically passes form data and update methods
- Full type inference and intelligent suggestions

### Performance Optimization
- Uses virtual list technology for large option sets
- Debounce handling to reduce unnecessary requests
- Smart caching for improved user experience

## Related Links

- [Basic Usage](./basic-usage) - Learn basic search configurations
- [Custom Actions](./custom-actions) - Learn about custom action buttons
- [Dynamic Management](./dynamic-items) - Learn about dynamic search item management