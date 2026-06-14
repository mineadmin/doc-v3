# Advanced Search

Demonstrates the implementation of complex search scenarios, including multiple form component types, JSX custom rendering, conditional display, and other advanced features.

## Complex Search Form

<DemoPreview dir="demos/ma-search/advanced-search" />

## Advanced Feature Description

### JSX Custom Rendering
Achieve fully customized form components by returning JSX elements through functions:

```typescript
{
  label: 'Custom Component',
  prop: 'custom',
  render: () => <CustomSearchComponent />
}
```

### Conditional Display
Use the `hide` function to dynamically show and hide search items:

```typescript
{
  label: 'Advanced Options',
  prop: 'advanced',
  render: 'input',
  hide: () => !showAdvanced.value
}
```

### Multi-Select Components
Support multi-select search components such as checkbox groups and cascading selectors:

```typescript
{
  label: 'Multi-Select Categories',
  prop: 'categories',
  render: 'checkbox-group',
  options: categoryOptions
}
```

## Use Cases

### 1. Enterprise-Level Data Filtering
Suitable for complex business data filtering, supporting multi-dimensional and multi-condition combined queries.

### 2. Report Query System
Suitable for report queries requiring precise condition control, supporting complex conditions such as time ranges and numerical intervals.

### 3. E-commerce Advanced Filtering
Suitable for product filtering on e-commerce platforms, supporting various filtering dimensions such as brand, specifications, and price.

## Key Features

- 🎯 Support for JSX/TSX custom rendering
- 🔄 Dynamic show and hide of search items
- 📊 Support for multiple data selection components
- ⚡ Performance-optimized rendering mechanism
- 🛠 Flexible configuration and extensibility

## Technical Highlights

### Custom Rendering Functions
- Supports returning any Vue component or JSX element
- Automatically passes form data and update methods
- Complete type inference and intelligent hints

### Performance Optimization
- Uses virtual list technology to handle large amounts of options
- Debounce handling to reduce unnecessary requests
- Intelligent caching to enhance user experience

## Related Links

- [Basic Usage](./basic-usage) - Learn basic search configuration
- [Custom Actions](./custom-actions) - Learn about custom action buttons
- [Dynamic Management](./dynamic-items) - Learn about dynamic search item management