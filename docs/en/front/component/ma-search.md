# MaSearch Component

`ma-search` is built on top of `ma-form` to quickly construct search forms. It provides rich configuration options, responsive layouts, form validation, and more, making it an ideal choice for building search functionalities in backend management systems.

:::tip Note
The `form` and `form-item` parameters are consistent with `ma-form`. For more detailed configurations, refer to the [ma-form documentation](ma-form).
:::

## Quick Start

<DemoPreview dir="demos/ma-search/default" />

## Complete Examples

### Basic Features
- **[Basic Usage](./ma-search/examples/basic-usage)** - Simplest search form implementation
- **[Advanced Search](./ma-search/examples/advanced-search)** - Complex search scenarios with JSX custom rendering
- **[Collapsible Search](./ma-search/examples/collapsible-search)** - Space-saving expand/collapse functionality

### Custom Extensions
- **[Custom Actions](./ma-search/examples/custom-actions)** - Custom action buttons and slot usage
- **[Dynamic Management](./ma-search/examples/dynamic-items)** - Dynamically add/remove search items at runtime
- **[Methods Demo](./ma-search/examples/methods-demo)** - Detailed usage of all exposed methods

### Advanced Applications
- **[Responsive Layout](./ma-search/examples/responsive-layout)** - Adaptive display for different devices
- **[Table Integration](./ma-search/examples/table-integration)** - Complete integration with data tables
- **[Form Validation](./ma-search/examples/form-validation)** - Various validation rules and scenarios

## API Documentation

### Props

| Parameter | Description | Type | Default | Version |
|-----------|-------------|------|---------|---------|
| `options` | Configuration options for `ma-search` | `MaSearchOptions` | - | 1.0.0 |
| `formOptions` | Configuration options for `ma-form` (see [ma-form Props](ma-form#props)) | `MaFormOptions` | - | 1.0.0 |
| `searchItems` | Search form item configurations (extends [ma-form-item](ma-form#maformitem)) | `MaSearchItem[]` | - | 1.0.0 |

### MaSearchOptions

Core configuration options for the search component:

| Parameter | Description | Type | Default | Version |
|-----------|-------------|------|---------|---------|
| `defaultValue` | Default values for the search form | `Record<string, any>` | - | 1.0.0 |
| `cols` | Responsive column configuration for different screen sizes | `MediaBreakPoint` | `{xs: 1, sm: 2, md: 2, lg: 3, xl: 4}` | 1.0.0 |
| `fold` | Whether to enable collapsible functionality | `boolean` | `false` | 1.0.0 |
| `foldRows` | Number of rows to display when folded | `number` | `2` | 1.0.0 |
| `show` | Whether to show the search panel | `boolean` | `true` | 1.0.0 |
| `text` | Button text configuration | `TextConfig` | - | 1.0.0 |

#### MediaBreakPoint

Responsive breakpoint configuration for column counts:

| Parameter | Description | Screen Size | Type | Default | Version |
|-----------|-------------|-------------|------|---------|---------|
| `xs` | Columns for extra small screens | `< 768px` | `number` | `1` | 1.0.0 |
| `sm` | Columns for small screens | `≥ 768px` | `number` | `2` | 1.0.0 |
| `md` | Columns for medium screens | `≥ 992px` | `number` | `2` | 1.0.0 |
| `lg` | Columns for large screens | `≥ 1200px` | `number` | `3` | 1.0.0 |
| `xl` | Columns for extra large screens | `≥ 1920px` | `number` | `4` | 1.0.0 |

#### TextConfig

Button text configuration:

| Parameter | Description | Type | Default | Version |
|-----------|-------------|------|---------|---------|
| `searchBtn` | Search button text | `string \| (() => string)` | `'Search'` | 1.0.0 |
| `resetBtn` | Reset button text | `string \| (() => string)` | `'Reset'` | 1.0.0 |
| `isFoldBtn` | Expand button text | `string \| (() => string)` | `'Expand'` | 1.0.0 |
| `notFoldBtn` | Collapse button text | `string \| (() => string)` | `'Collapse'` | 1.0.0 |

### MaSearchItem

Search form item configuration (extends `ma-form-item`):

| Parameter | Description | Type | Default | Version |
|-----------|-------------|------|---------|---------|
| `label` | Label text | `string` | - | 1.0.0 |
| `prop` | Field name (key in form data) | `string` | - | 1.0.0 |
| `render` | Rendering method (string, function, or component) | `string \| Function \| Component` | - | 1.0.0 |
| `options` | Options for select-type components | `Array<{label: string, value: any}>` | - | 1.0.0 |
| `props` | Props passed to form components | `object` | - | 1.0.0 |
| `rules` | Validation rules | `FormItemRule[]` | - | 1.0.0 |
| `span` | Grid span (number of columns occupied) | `number` | `1` | 1.0.0 |
| `offset` | Grid left offset | `number` | `0` | 1.0.0 |
| `hide` | Whether to hide this form item | `boolean \| (() => boolean)` | `false` | 1.0.0 |

#### Built-in Render Types

Supported built-in render types:

| Type | Description | Example |
|------|-------------|---------|
| `'input'` | Text input | `render: 'input'` |
| `'select'` | Select dropdown | `render: 'select'` |
| `'date-picker'` | Date picker | `render: 'date-picker'` |
| `'input-number'` | Number input | `render: 'input-number'` |
| `'switch'` | Switch toggle | `render: 'switch'` |
| `'radio-group'` | Radio group | `render: 'radio-group'` |
| `'checkbox-group'` | Checkbox group | `render: 'checkbox-group'` |
| `'cascader'` | Cascader | `render: 'cascader'` |

### Events

| Name | Description | Parameters | Version |
|------|-------------|------------|---------|
| `search` | Triggered when search button is clicked | `(formData: Record<string, any>) => void` | 1.0.0 |
| `reset` | Triggered when reset button is clicked | `(formData: Record<string, any>) => void` | 1.0.0 |
| `fold` | Triggered when fold state changes | `(state: boolean) => void` | 1.0.0 |

### Slots

| Name | Description | Parameters | Version |
|------|-------------|------------|---------|
| `default` | Default slot for native `<el-form-item>` tags (overrides configuration) | - | 1.0.0 |
| `actions` | Completely replaces action buttons area | `{ searchLoading: boolean, resetLoading: boolean }` | 1.0.0 |
| `beforeActions` | Inserts content before action buttons | - | 1.0.0 |
| `afterActions` | Appends content after action buttons | - | 1.0.0 |

### Exposed Methods

| Method | Description | Parameters | Returns | Version |
|--------|-------------|------------|---------|---------|
| `getMaFormRef()` | Gets internal `ma-form` component reference | - | `MaFormRef` | 1.0.0 |
| `foldToggle()` | Toggles fold state | - | - | 1.0.0 |
| `getFold()` | Gets current fold state | - | `boolean` | 1.0.0 |
| `setSearchForm(form)` | Sets search form data | `form: Record<string, any>` | - | 1.0.0 |
| `getSearchForm()` | Gets current search form data | - | `Record<string, any>` | 1.0.0 |
| `setShowState(visible)` | Sets component visibility | `visible: boolean` | - | 1.0.0 |
| `getShowState()` | Gets current visibility state | - | `boolean` | 1.0.0 |
| `setOptions(options)` | Dynamically sets component options | `options: MaSearchOptions` | - | 1.0.0 |
| `getOptions()` | Gets current component options | - | `MaSearchOptions` | 1.0.0 |
| `setFormOptions(options)` | Dynamically sets form options | `options: MaFormOptions` | - | 1.0.0 |
| `getFormOptions()` | Gets current form options | - | `MaFormOptions` | 1.0.0 |
| `setItems(items)` | Dynamically sets search items | `items: MaSearchItem[]` | - | 1.0.0 |
| `getItems()` | Gets current search items | - | `MaSearchItem[]` | 1.0.0 |
| `appendItem(item)` | Appends a single search item | `item: MaSearchItem` | - | 1.0.0 |
| `removeItem(prop)` | Removes specified search item | `prop: string` | - | 1.0.0 |
| `getItemByProp(prop)` | Gets search item by property name | `prop: string` | `MaSearchItem \| undefined` | 1.0.0 |

## TypeScript Definitions

```typescript
// Main interface definitions
interface MaSearchOptions {
  defaultValue?: Record<string, any>
  cols?: MediaBreakPoint
  fold?: boolean
  foldRows?: number
  show?: boolean
  text?: TextConfig
}

interface MediaBreakPoint {
  xs?: number  // < 768px
  sm?: number  // ≥ 768px
  md?: number  // ≥ 992px
  lg?: number  // ≥ 1200px
  xl?: number  // ≥ 1920px
}

interface TextConfig {
  searchBtn?: string | (() => string)
  resetBtn?: string | (() => string)
  isFoldBtn?: string | (() => string)
  notFoldBtn?: string | (() => string)
}

interface MaSearchItem {
  label: string
  prop: string
  render: string | Function | Component
  options?: Array<{label: string, value: any}>
  props?: Record<string, any>
  rules?: FormItemRule[]
  span?: number
  offset?: number
  hide?: boolean | (() => boolean)
}

// Component instance type
interface MaSearchInstance {
  getMaFormRef(): MaFormRef
  foldToggle(): void
  getFold(): boolean
  setSearchForm(form: Record<string, any>): void
  getSearchForm(): Record<string, any>
  setShowState(visible: boolean): void
  getShowState(): boolean
  setOptions(options: MaSearchOptions): void
  getOptions(): MaSearchOptions
  setFormOptions(options: MaFormOptions): void
  getFormOptions(): MaFormOptions
  setItems(items: MaSearchItem[]): void
  getItems(): MaSearchItem[]
  appendItem(item: MaSearchItem): void
  removeItem(prop: string): void
  getItemByProp(prop: string): MaSearchItem | undefined
}
```

## Best Practices

### 1. Responsive Design

Configure `cols` appropriately for different screen sizes:

```typescript
const searchOptions = {
  cols: {
    xs: 1,  // Single column on mobile
    sm: 2,  // Two columns on tablets
    md: 3,  // Three columns on desktops
    lg: 4,  // Four columns on large screens
    xl: 6   // Six columns on extra large screens
  }
}
```

### 2. Collapsible Functionality

Enable folding when there are many search items:

```typescript
const searchOptions = {
  fold: true,
  foldRows: 2,  // Show 2 rows by default
  text: {
    isFoldBtn: 'Show more conditions',
    notFoldBtn: 'Hide some conditions'
  }
}
```

### 3. Form Validation

Add validation rules for important fields:

```typescript
const searchItems = [
  {
    label: 'Email',
    prop: 'email',
    render: 'input',
    rules: [
      { required: true, message: 'Email is required', trigger: 'blur' },
      { type: 'email', message: 'Invalid email format', trigger: 'blur' }
    ]
  }
]
```

### 4. Dynamic Form Items

Add or remove search items dynamically based on business needs:

```typescript
// Add search item
const addSearchItem = () => {
  searchRef.value?.appendItem({
    label: 'New Field',
    prop: 'new_field',
    render: 'input'
  })
}

// Remove search item
const removeSearchItem = (prop: string) => {
  searchRef.value?.removeItem(prop)
}
```

### 5. Table Integration

Combine with data tables for complete data management:

```typescript
const handleSearch = (searchData: any) => {
  // Reset pagination to first page
  pagination.page = 1
  // Save search conditions
  searchCondition.value = searchData
  // Load data
  loadTableData()
}
```

## FAQ

### Q: How to customize form item rendering?

A: Pass a function or component via the `render` property:

```typescript
{
  label: 'Custom',
  prop: 'custom',
  render: () => <CustomComponent />
}
```

### Q: How to implement conditional display of search items?

A: Use the `hide` property with a function:

```typescript
{
  label: 'Conditional Field',
  prop: 'conditional',
  render: 'input',
  hide: () => someCondition // Hide when returns true
}
```

### Q: How to get form validation status?

A: Get form reference via `getMaFormRef()`:

```typescript
const validateForm = async () => {
  const formRef = searchRef.value?.getMaFormRef()
  try {
    await formRef?.validate()
    console.log('Validation passed')
  } catch (error) {
    console.log('Validation failed')
  }
}
```

### Q: How to implement search history?

A: Listen to search events and save conditions:

```typescript
const searchHistory = ref<any[]>([])

const handleSearch = (formData: any) => {
  // Add to history
  searchHistory.value.unshift({
    data: formData,
    time: new Date().toLocaleString()
  })
  
  // Limit history size
  if (searchHistory.value.length > 10) {
    searchHistory.value = searchHistory.value.slice(0, 10)
  }
}
```

## Changelog

### v1.0.27 (Latest)
- 🎉 Added form validation support
- 🐛 Fixed display issues in some responsive layouts
- ⚡️ Optimized performance (reduced unnecessary re-renders)
- 📝 Improved TypeScript definitions

### v1.0.20
- 🎉 Added dynamic search item management
- 🎉 Added more built-in render types
- 🐛 Fixed styling issues in folded state

### v1.0.15
- 🎉 Initial version release
- ✨ Basic search functionality
- ✨ Responsive layout support
- ✨ Collapsible panel support