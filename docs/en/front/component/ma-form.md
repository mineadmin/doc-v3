# MaForm

A secondary encapsulation of the `Form` component based on `Element Plus`, supporting all native form parameters, events, slots, and syntax, as well as configuration-based implementation.  
Additionally, it supports form layout planning based on `el-row` and `el-space`, featuring responsive design capabilities.

::: tip Note
Since it fully supports all parameters, events, and slots of the native `el-form`, this documentation primarily focuses on extended features.

For official form parameters, please refer to the [Element Plus](https://element-plus.org/en-US/component/form.html) documentation.
:::

## Quick Start

### Using Configuration Approach
<DemoPreview dir="demos/ma-form/config" />

### Using Template Approach
<DemoPreview dir="demos/ma-form/template" />

### Getting `Component` and `el-form-item` `Refs`
:::tip Tip
This method is for **configuration form**. For `template`, you can define `ref` yourself.
:::

<DemoPreview dir="demos/ma-form/getRef" />

## Complete Examples

:::info Example Navigation
The following examples demonstrate various usage scenarios and advanced features of MaForm, from basic usage to complex applications. It is recommended to follow the order for optimal learning.
:::

### Basic Functionality Examples
- [Basic Usage](/front/component/ma-form/examples/basic-usage) - Common form controls and their basic configuration
- [Layout System](/front/component/ma-form/examples/layout-systems) - Responsive design with Flex and Grid layouts
- [Component Rendering](/front/component/ma-form/examples/component-rendering) - Showcase of all supported Element Plus components

### Advanced Functionality Examples
- [Conditional Rendering](/front/component/ma-form/examples/conditional-rendering) - Field display control based on form data
- [Dynamic Validation](/front/component/ma-form/examples/dynamic-validation) - Custom validation rules and async validation
- [Slot System](/front/component/ma-form/examples/slots-examples) - Flexible usage of multi-level slots

### Feature Demonstration Examples
- [Exposed Methods](/front/component/ma-form/examples/expose-methods) - Demonstration of all API methods
- [Loading States](/front/component/ma-form/examples/loading-states) - Handling various loading scenarios
- [Nested Forms](/front/component/ma-form/examples/nested-forms) - Managing complex hierarchical forms

### Practical Application Examples
- [Advanced Scenarios](/front/component/ma-form/examples/advanced-scenarios) - Multi-step workflows and complex business logic
- [Performance Optimization](/front/component/ma-form/examples/performance-demo) - Strategies for optimizing large forms

## TypeScript Type Definitions

### Core Interfaces

#### MaFormOptions
Complete type definition for form configuration options:

```typescript
interface MaFormOptions {
  // Native el-form properties from Element Plus
  model?: Record<string, any>
  rules?: Record<string, FormItemRule[]>
  inline?: boolean
  labelPosition?: 'left' | 'right' | 'top'
  labelWidth?: string | number
  labelSuffix?: string
  hideRequiredAsterisk?: boolean
  requireAsteriskPosition?: 'left' | 'right'
  showMessage?: boolean
  inlineMessage?: boolean
  statusIcon?: boolean
  validateOnRuleChange?: boolean
  size?: 'large' | 'default' | 'small'
  disabled?: boolean
  scrollToError?: boolean
  scrollIntoViewOptions?: boolean | ScrollIntoViewOptions
  
  // Extended properties for MaForm
  containerClass?: string
  loading?: boolean
  loadingConfig?: LoadingConfig
  layout?: 'flex' | 'grid'
  flex?: ElRowProps
  grid?: ElSpaceProps
  footerSlot?: () => VNode | VNode[]
}
```

#### MaFormItem
Complete type definition for form item configuration:

```typescript
interface MaFormItem {
  // Basic configuration
  label?: string | (() => string)
  prop?: string | (() => string)
  hide?: boolean | ((item: MaFormItem, model: MaModel) => boolean)
  show?: boolean | ((item: MaFormItem, model: MaModel) => boolean)
  
  // Layout configuration
  cols?: ColsConfiguration
  itemProps?: ElFormItemProps
  itemSlots?: Record<string, (...args: any[]) => VNode | VNode[]>
  
  // Rendering configuration
  render?: RenderType
  renderProps?: Record<string, any>
  renderSlots?: Record<string, (...args: any[]) => VNode | VNode[]>
  
  // Nested configuration
  children?: MaFormItem[]
  
  // Validation configuration
  customValidator?: (rule: any, value: any, callback: Function) => void
  asyncValidator?: (rule: any, value: any) => Promise<void>
}
```

#### ColsConfiguration
Responsive column configuration type:

```typescript
interface ColsConfiguration {
  // Basic grid configuration
  span?: number
  offset?: number
  push?: number
  pull?: number
  
  // Responsive configuration
  xs?: number | ResponsiveColConfig
  sm?: number | ResponsiveColConfig
  md?: number | ResponsiveColConfig
  lg?: number | ResponsiveColConfig
  xl?: number | ResponsiveColConfig
  
  // Custom configuration
  order?: number
  flex?: string | number
}

interface ResponsiveColConfig {
  span?: number
  offset?: number
  push?: number
  pull?: number
}
```

#### RenderType
Component rendering type definition:

```typescript
type RenderType = 
  | string  // Element Plus component name
  | Component  // Vue component
  | ((data: RenderContext) => VNode | VNode[])  // Render function

interface RenderContext {
  item: MaFormItem
  model: MaModel
  formRef: Ref<FormInstance | undefined>
  disabled: boolean
  readonly: boolean
  size: ComponentSize
}
```

#### MaFormExpose
Type definition for exposed component methods:

```typescript
interface MaFormExpose {
  // State management
  setLoadingState: (loading: boolean) => void
  getLoadingState: () => boolean
  
  // Configuration management
  setOptions: (options: Partial<MaFormOptions>) => void
  getOptions: () => MaFormOptions
  updateOptions: (updater: (options: MaFormOptions) => MaFormOptions) => void
  
  // Form item management
  setItems: (items: MaFormItem[]) => void
  getItems: () => MaFormItem[]
  appendItem: (item: MaFormItem, index?: number) => void
  prependItem: (item: MaFormItem) => void
  removeItem: (prop: string) => boolean
  updateItem: (prop: string, updates: Partial<MaFormItem>) => boolean
  
  // Form item query
  getItemByProp: (prop: string) => MaFormItem | undefined
  getItemsByCondition: (condition: (item: MaFormItem) => boolean) => MaFormItem[]
  getVisibleItems: () => MaFormItem[]
  
  // Form validation
  validate: () => Promise<boolean>
  validateField: (prop: string) => Promise<boolean>
  resetFields: (props?: string[]) => void
  clearValidate: (props?: string[]) => void
  
  // Form data
  getFormData: () => Record<string, any>
  setFormData: (data: Record<string, any>) => void
  resetFormData: () => void
  
  // El-Form instance
  getElFormRef: () => FormInstance | undefined
}
```

## Props

| Parameter | Description | Type | Default | Version |
|-----------|-------------|------|---------|---------|
| `v-model` | Form data, two-way binding, supports reactive updates | `Record<string, any>` | `{}` | 1.0.0 |
| `options` | Form configuration options, including native Element Plus properties and extended properties | `MaFormOptions` | `{}` | 1.0.0 |
| `items`   | Array of form item configurations, supports nesting and dynamic configuration | `MaFormItem[]` | `[]` | 1.0.0 |
| `loading` | Global loading state, takes precedence over options.loading | `boolean` | `false` | 1.0.0 |
| `disabled` | Global disabled state, takes precedence over options.disabled | `boolean` | `false` | 1.0.0 |

### MaFormOptions Extended Configuration

::: tip Note
These are extended parameters of `ma-form` for `el-form`, fully compatible with native Element Plus parameters.
:::

| Parameter | Description | Type | Default | Version |
|-----------|-------------|------|---------|---------|
| `containerClass` | Custom class name for form container, used for styling | `string` | - | 1.0.0 |
| `loading` | Whether to show loading animation, supports global and local loading states | `boolean` | `false` | 1.0.0 |
| `loadingConfig` | Detailed loading animation configuration options | [LoadingConfig](#loadingconfig-configuration) | `{}` | 1.0.0 |
| `layout` | Layout method: `flex` uses grid system, `grid` uses spacing layout | `'flex' \| 'grid'` | `flex` | 1.0.0 |
| `flex` | Flex layout configuration, based on `el-row` component | `ElRowProps` | `{}` | 1.0.0 |
| `grid` | Grid layout configuration, based on `el-space` component | `ElSpaceProps` | `{}` | 1.0.0 |
| `footerSlot` | Configuration-based footer slot, can return VNode or VNode array | `() => VNode \| VNode[]` | - | 1.0.0 |

#### LoadingConfig Configuration

Detailed loading animation configuration options:

| Parameter | Description | Type | Default | Version |
|-----------|-------------|------|---------|---------|
| `text` | Loading text displayed below the loading icon | `string` | `'Loading...'` | 1.0.0 |
| `spinner` | Custom loading icon class name | `string` | - | 1.0.0 |
| `svg` | Custom SVG loading icon | `string` | - | 1.0.0 |
| `viewBox` | SVG icon's viewBox attribute | `string` | - | 1.0.0 |
| `background` | Background mask color | `string` | `'rgba(0, 0, 0, 0.8)'` | 1.0.0 |
| `customClass` | Custom style class name | `string` | - | 1.0.0 |
| `lock` | Whether to lock scrolling | `boolean` | `true` | 1.0.0 |
| `fullscreen` | Whether to display in full screen | `boolean` | `false` | 1.0.0 |

### MaFormItem Configuration Details

Complete configuration options for form items:

#### Basic Configuration

| Parameter | Description | Type | Default | Version |
|-----------|-------------|------|---------|---------|
| `label` | Form item label, supports string or function return value | `string \| (() => string)` | - | 1.0.0 |
| `prop` | Form item field name, supports string or function return value, used for data binding and validation | `string \| (() => string)` | - | 1.0.0 |
| `hide` | Whether to hide the item (hidden but retains data), supports dynamic control | `boolean \| ((item: MaFormItem, model: Record<string, any>) => boolean)` | `false` | 1.0.0 |
| `show` | Whether to show the item (not displayed if not rendered and no data), supports dynamic control | `boolean \| ((item: MaFormItem, model: Record<string, any>) => boolean)` | `true` | 1.0.0 |

#### Layout Configuration

| Parameter | Description | Type | Default | Version |
|-----------|-------------|------|---------|---------|
| `cols` | Grid layout configuration, effective when `layout` is `flex`, supports responsive configuration | `ColsConfiguration` | - | 1.0.0 |
| `itemProps` | Native properties of Element Plus `el-form-item` | `ElFormItemProps` | `{}` | 1.0.0 |
| `itemSlots` | Native slot configuration for Element Plus `el-form-item` | `Record<string, (...args: any[]) => VNode \| VNode[]>` | `{}` | 1.0.0 |

#### Rendering Configuration

| Parameter | Description | Type | Default | Version |
|-----------|-------------|------|---------|---------|
| `render` | Component rendering type: can be Element Plus component name (e.g., `'input'`, `'select'`), Vue component, or render function | `RenderType` | - | 1.0.0 |
| `renderProps` | Props configuration for the rendered component | `Record<string, any>` | `{}` | 1.0.0 |
| `renderSlots` | Slot configuration for the rendered component | `Record<string, (...args: any[]) => VNode \| VNode[]>` | `{}` | 1.0.0 |

#### Nested and Conditional Configuration

| Parameter | Description | Type | Default | Version |
|-----------|-------------|------|---------|---------|
| `children` | Child configuration items, supports infinite nesting, used for complex form structures | `MaFormItem[]` | `[]` | 1.0.33 |

#### Validation Configuration

| Parameter | Description | Type | Default | Version |
|-----------|-------------|------|---------|---------|
| `customValidator` | Custom synchronous validation function | `(rule: any, value: any, callback: Function) => void` | - | 1.0.0 |
| `asyncValidator` | Custom asynchronous validation function | `(rule: any, value: any) => Promise<void>` | - | 1.0.0 |

## Slot System

MaForm provides a flexible slot system supporting multi-level content customization:

### Global Slots

| Name | Description | Scope Variables | Example |
|------|-------------|----------------|---------|
| `default` | Default slot, can write native `<el-form-item>` tags, configuration approach becomes invalid when used | - | `<ma-form><el-form-item>...</el-form-item></ma-form>` |
| `footer` | Form footer slot, used for action elements like submit buttons | `{ formRef, model, loading }` | `<template #footer="{ formRef }">` |
| `loading` | Custom loading state content | `{ loading }` | `<template #loading="{ loading }">` |

### Form Item Level Slots

Each `MaFormItem` supports custom slots via `itemSlots` configuration:

#### itemSlots Configuration

```typescript
interface ItemSlots {
  // Native slots for Element Plus el-form-item
  label?: (scope: { label: string }) => VNode | VNode[]
  error?: (scope: { error: string }) => VNode | VNode[]
  
  // Extended slots for MaForm
  prepend?: (scope: FormItemScope) => VNode | VNode[]  // Prepend content
  append?: (scope: FormItemScope) => VNode | VNode[]   // Append content
  help?: (scope: FormItemScope) => VNode | VNode[]     // Help information
}

interface FormItemScope {
  item: MaFormItem
  model: Record<string, any>
  disabled: boolean
  readonly: boolean
  size: ComponentSize
  formRef: Ref<FormInstance | undefined>
}
```

### Dynamic Slot Naming

Supports dynamic slot naming based on `prop` in the format: `item-{prop}`

```vue
<ma-form :items="items">
  <!-- Custom rendering for item with prop 'username' -->
  <template #item-username="{ item, model }">
    <el-input v-model="model[item.prop]" prefix-icon="User" />
  </template>
  
  <!-- Custom label for item with prop 'password' -->
  <template #label-password>
    <span style="color: red;">* Password</span>
  </template>
</ma-form>
```

### Nested Component Slots

For rendered Element Plus components, slots can be configured via `renderSlots`:

```tsx
const field ={
  render: 'select',
  renderSlots: {
    // Default slot for el-select
    default: () => [
      h('el-option', { label: 'Option 1', value: '1' }),
      h('el-option', { label: 'Option 2', value: '2' })
    ],
    // Prefix slot for el-select
    prefix: () => h('el-icon', {}, [h('Search')])
  }
}
```

## Exposed Methods (Expose)

MaForm component exposes rich API methods via `defineExpose` for external control and data manipulation:

### State Management

| Method | Description | Parameters | Return Value | Example |
|--------|-------------|------------|--------------|---------|
| `setLoadingState(loading)` | Sets form loading state | `loading: boolean` | `void` | `formRef.value.setLoadingState(true)` |
| `getLoadingState()` | Gets current loading state | - | `boolean` | `const loading = formRef.value.getLoadingState()` |

### Configuration Management

| Method | Description | Parameters | Return Value | Example |
|--------|-------------|------------|--------------|---------|
| `setOptions(options)` | Sets form configuration options | `options: Partial<MaFormOptions>` | `void` | `formRef.value.setOptions({ loading: true })` |
| `getOptions()` | Gets current form configuration | - | `MaFormOptions` | `const opts = formRef.value.getOptions()` |
| `updateOptions(updater)` | Modifies configuration via update function | `updater: (options) => MaFormOptions` | `void` | `formRef.value.updateOptions(opts => ({ ...opts, loading: false }))` |

### Form Item Management

| Method | Description | Parameters | Return Value | Example |
|--------|-------------|------------|--------------|---------|
| `setItems(items)` | Sets form item array | `items: MaFormItem[]` | `void` | `formRef.value.setItems(newItems)` |
| `getItems()` | Gets current form item array