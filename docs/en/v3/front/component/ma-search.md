# MaSearch Component

`ma-search` is built on top of `ma-form` to quickly construct a search form. It offers rich configuration options, responsive layout, form validation, and more, making it an ideal choice for building search functionality in backend management systems.

:::tip Tip
The parameters for `form` and `form-item` are consistent with `ma-form`. For more detailed configuration, please refer to the [ma-form documentation](/libs/ma-form/latest/).
:::

## Quick Start

<DemoPreview dir="demos/ma-search/default" />

## Examples Overview

### Basic Features
- **[Basic Usage](./ma-search/examples/basic-usage)** - Simplest search form implementation
- **[Advanced Search](./ma-search/examples/advanced-search)** - Complex search scenarios, supports JSX custom rendering
- **[Collapsible Search](./ma-search/examples/collapsible-search)** - Space-saving collapse and expand functionality

### Custom Extensions
- **[Custom Actions](./ma-search/examples/custom-actions)** - Custom action buttons and slot usage
- **[Dynamic Management](./ma-search/examples/dynamic-items)** - Dynamically add and remove search items at runtime
- **[Methods Demo](./ma-search/examples/methods-demo)** - Detailed usage of all exposed methods

### Advanced Applications
- **[Responsive Layout](./ma-search/examples/responsive-layout)** - Adaptive display on different devices
- **[Table Integration](./ma-search/examples/table-integration)** - Complete integration solution with data tables
- **[Form Validation](./ma-search/examples/form-validation)** - Various validation rules and scenario demonstrations

## API Documentation

### Props

| Parameter | Description | Type | Default | Version |
|-----------|-------------|------|---------|---------|
| `options` | `ma-search` component configuration options | `MaSearchOptions` | - | 1.0.0 |
| `formOptions` | `ma-form` component configuration options, see [ma-form Props](/libs/ma-form/latest/#props) | `MaFormOptions` | - | 1.0.0 |
| `searchItems` | Search form item configuration, extended from [ma-form-item](/libs/ma-form/latest/#maformitem) | `MaSearchItem[]` | - | 1.0.0 |

### MaSearchOptions

Core configuration options for the search component:

| Parameter | Description | Type | Default | Version |
|-----------|-------------|------|---------|---------|
| `defaultValue` | Default value configuration for search form | `Record<string, any>` | - | 1.0.0 |
| `cols` | Responsive column count configuration, supports different screen sizes | `MediaBreakPoint` | `{xs: 1, sm: 2, md: 2, lg: 3, xl: 4}` | 1.0.0 |
| `fold` | Whether to enable collapse functionality | `boolean` | `false` | 1.0.0 |
| `foldRows` | Number of rows to display when collapsed | `number` | `2` | 1.0.0 |
| `show` | Whether to show the search panel | `boolean` | `true` | 1.0.0 |
| `text` | Button text configuration | `TextConfig` | - | 1.0.0 |

#### MediaBreakPoint

Responsive breakpoint configuration, defining the number of columns at different screen sizes:

| Parameter | Description | Screen Size | Type | Default | Version |
|-----------|-------------|-------------|------|---------|---------|
| `xs` | Columns on extra small screens | `< 768px` | `number` | `1` | 1.0.0 |
| `sm` | Columns on small screens | `≥ 768px` | `number` | `2` | 1.0.0 |
| `md` | Columns on medium screens | `≥ 992px` | `number` | `2` | 1.0.0 |
| `lg` | Columns on large screens | `≥ 1200px` | `number` | `3` | 1.0.0 |
| `xl` | Columns on extra large screens | `≥ 1920px` | `number` | `4` | 1.0.0 |

#### TextConfig

Button text configuration:

| Parameter | Description | Type | Default | Version |
|-----------|-------------|------|---------|---------|
| `searchBtn` | Search button text | `string \| (() => string)` | `'Search'` | 1.0.0 |
| `resetBtn` | Reset button text | `string \| (() => string)` | `'Reset'` | 1.0.0 |
| `isFoldBtn` | Expand button text | `string \| (() => string)` | `'Expand'` | 1.0.0 |
| `notFoldBtn` | Collapse button text | `string \| (() => string)` | `'Collapse'` | 1.0.0 |

### MaSearchItem

Search form item configuration, extended from `ma-form-item`:

| Parameter | Description | Type | Default | Version |
|-----------|-------------|------|---------|---------|
| `label` | Label text | `string` | - | 1.0.0 |
| `prop` | Field name, corresponding key in form data | `string` | - | 1.0.0 |
| `render` | Rendering method, supports string or function | `string \| Function \| Component` | - | 1.0.0 |
| `options` | Option data for selection components | `Array<{label: string, value: any}>` | - | 1.0.0 |
| `props` | Properties passed to the form component | `object` | - | 1.0.0 |
| `rules` | Validation rules | `FormItemRule[]` | - | 1.0.0 |
| `span` | Grid span, number of columns occupied | `number` | `1` | 1.0.0 |
| `offset` | Number of grid spaces on the left | `number` | `0` | 1.0.0 |
| `hide` | Whether to hide this form item | `boolean \| (() => boolean)` | `false` | 1.0.0 |

#### Built-in render Types

Supports the following built-in rendering types:

| Type | Description | Example |
|------|-------------|---------|
| `'input'` | Text input box | `render: 'input'` |
| `'select'` | Selector | `render: 'select'` |
| `'date-picker'` | Date picker | `render: 'date-picker'` |
| `'input-number'` | Number input | `render: 'input-number'` |
| `'switch'` | Switch | `render: 'switch'` |
| `'radio-group'` | Radio group | `render: 'radio-group'` |
| `'checkbox-group'` | Checkbox group | `render: 'checkbox-group'` |
| `'cascader'` | Cascader | `render: 'cascader'` |

### Events

| Name | Description | Parameters | Version |
|------|-------------|------------|---------|
| `search` | Triggered when search button is clicked | `(formData: Record<string, any>) => void` | 1.0.0 |
| `reset` | Triggered when reset button is clicked | `(formData: Record<string, any>) => void` | 1.0.0 |
| `fold` | Triggered when collapse state changes | `(state: boolean) => void` | 1.0.0 |

### Slots

| Name | Description | Parameters | Version |
|------|-------------|------------|---------|
| `default` | Default slot, can write native `<el-form-item>` tags, configuration method becomes invalid after use | - | 1.0.0 |
| `actions` | Completely replace action button area | `{ searchLoading: boolean, resetLoading: boolean }` | 1.0.0 |
| `beforeActions` | Insert content before action buttons | - | 1.0.0 |
| `afterActions` | Append content after action buttons | - | 1.0.0 |

### Exposed Methods (Expose)

| Method Name | Description | Parameters | Return Value | Version |
|-------------|-------------|------------|--------------|---------|
| `getMaFormRef()` | Get internal `ma-form` component reference | - | `MaFormRef` | 1.0.0 |
| `foldToggle()` | Toggle collapse state | - | - | 1.0.0 |
| `getFold()` | Get current collapse state | - | `boolean` | 1.0.0 |
| `setSearchForm(form)` | Set search form data | `form: Record<string, any>` | - | 1.0.0 |
| `getSearchForm()` | Get current search form data | - | `Record<string, any>` | 1.0.0 |
| `setShowState(visible)` | Set search component display state | `visible: boolean` | - | 1.0.0 |
| `getShowState()` | Get current display state | - | `boolean` | 1.0.0 |
| `setOptions(options)` | Dynamically set component configuration | `options: MaSearchOptions` | - | 1.0.0 |
| `getOptions()` | Get current component configuration | - | `MaSearchOptions` | 1.0.0 |
| `setFormOptions(options)` | Dynamically set form configuration | `options: MaFormOptions` | - | 1.0.0 |
| `getFormOptions()` | Get current form configuration | - | `MaFormOptions` | 1.0.0 |
| `setItems(items)` | Dynamically set search item configuration | `items: MaSearchItem[]` | - | 1.0.0 |
| `getItems()` | Get current search item configuration | - | `MaSearchItem[]` | 1.0.0 |
| `appendItem(item)` | Append a single search item | `item: MaSearchItem` | - | 1.0.0 |
| `removeItem(prop)` | Remove specified search item | `prop: string` | - | 1.0.0 |
| `getItemByProp(prop)` | Get search item by property name | `prop: string` | `MaSearchItem \| undefined` | 1.0.0 |

## TypeScript Type Definitions

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

Properly configure the `cols` parameter to adapt to different screen sizes:

```typescript
const searchOptions = {
  cols: {
    xs: 1,  // Mobile single column
    sm: 2,  // Tablet dual column
    md: 3,  // Desktop three columns
    lg: 4,  // Large screen four columns
    xl: 6   // Extra large screen six columns
  }
}
```

### 2. Collapse Functionality

When there are many search items, it's recommended to enable the collapse functionality:

```typescript
const searchOptions = {
  fold: true,
  foldRows: 2,  // Display 2 rows by default
  text: {
    isFoldBtn: 'Expand More Conditions',
    notFoldBtn: 'Collapse Some Conditions'
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
      { required: true, message: 'Email cannot be empty', trigger: 'blur' },
      { type: 'email', message: 'Invalid email format', trigger: 'blur' }
    ]
  }
]
```

### 4. Dynamic Form Items

Dynamically add or remove search items based on business requirements:

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

### 5. Integration with Tables

Combine with data tables for complete data management:

```typescript
const handleSearch = (searchData: any) => {
  // Reset pagination to the first page
  pagination.page = 1
  // Save search criteria
  searchCondition.value = searchData
  // Load data
  loadTableData()
}
```

## FAQ

### Q: How to customize the rendering of form items?

A: You can pass a function or component via the `render` property:

```typescript
{
  label: 'Custom',
  prop: 'custom',
  render: () => <CustomComponent />
}
```

### Q: How to conditionally display search items?

A: Use the `hide` property with a function:

```typescript
{
  label: 'Conditional Field',
  prop: 'conditional',
  render: 'input',
  hide: () => someCondition // Hidden when true is returned
}
```

### Q: How to get the form validation status?

A: Get the form reference via `getMaFormRef()`:

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

A: Listen to the search event and save search criteria:

```typescript
const searchHistory = ref<any[]>([])

const handleSearch = (formData: any) => {
  // Add to history
  searchHistory.value.unshift({
    data: formData,
    time: new Date().toLocaleString()
  })
  
  // Limit the number of history records
  if (searchHistory.value.length > 10) {
    searchHistory.value = searchHistory.value.slice(0, 10)
  }
}
```

## Changelog

### v1.0.27 (Latest)
- 🎉 Added form validation support
- 🐛 Fixed responsive layout display issues in certain scenarios
- ⚡️ Optimized performance, reduced unnecessary re-renders
- 📝 Improved TypeScript type definitions

### v1.0.20
- 🎉 Added dynamic search item management functionality
- 🎉 Added more built-in render types
- 🐛 Fixed style issues in collapsed state

### v1.0.15
- 🎉 Initial version release
- ✨ Supports basic search functionality
- ✨ Supports responsive layout
- ✨ Supports collapsible panel