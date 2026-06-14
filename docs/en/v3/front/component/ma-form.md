# MaForm

A `Form` component based on the secondary encapsulation of `Element plus` forms. It supports all native form parameters, events, slots, and syntax, and can also be implemented through configuration.

Additionally, it supports layout planning using `el-row` and `el-space` for responsive form design.

::: tip Note
Since it is fully compatible with all parameters, events, and slots of the native `el-form`, this document mainly focuses on extended features.

For official form parameters, please refer to the [Element plus](https://element-plus.org/zh-CN/component/form.html) documentation.
:::

## Quick Start

### Using Configuration
<DemoPreview dir="demos/ma-form/config" />

### Using Template
<DemoPreview dir="demos/ma-form/template" />

### Getting the `Ref` of `Component` and `el-form-item`
:::tip Tip
This method is for the **configuration approach**; in the `template`, you can define `ref` yourself.
:::

<DemoPreview dir="demos/ma-form/getRef" />

## Complete Examples

:::info Example Navigation
The following examples demonstrate various uses and advanced features of MaForm, from basic usage to complex scenarios. It is recommended to learn in order for the best results.
:::

### Basic Functionality Examples
- [Basic Usage](/v3/front/component/ma-form/examples/basic-usage) - Basic configuration and usage of common form controls
- [Layout System](/v3/front/component/ma-form/examples/layout-systems) - Responsive design with Flex and Grid layouts
- [Component Rendering](/v3/front/component/ma-form/examples/component-rendering) - Display of all supported Element Plus components

### Advanced Functionality Examples
- [Conditional Rendering](/v3/front/component/ma-form/examples/conditional-rendering) - Field display control based on form data
- [Dynamic Validation](/v3/front/component/ma-form/examples/dynamic-validation) - Custom validation rules and asynchronous validation
- [Slot System](/v3/front/component/ma-form/examples/slots-examples) - Flexible use of multi-level slots

### Feature Demonstration Examples
- [Exposed Methods](/v3/front/component/ma-form/examples/expose-methods) - Demonstration of all API methods
- [Loading States](/v3/front/component/ma-form/examples/loading-states) - Handling various loading scenarios
- [Nested Forms](/v3/front/component/ma-form/examples/nested-forms) - Form handling for complex hierarchical structures

### Practical Application Examples
- [Advanced Scenarios](/v3/front/component/ma-form/examples/advanced-scenarios) - Multi-step processes and complex business logic
- [Performance Optimization](/v3/front/component/ma-form/examples/performance-demo) - Performance optimization strategies for large forms

## TypeScript Type Definitions

### Core Interfaces

#### MaFormOptions
Complete type definition for form configuration options:

```typescript
interface MaFormOptions {
  // Element Plus native el-form properties
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
  
  // MaForm extended properties
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
  // Basic Configuration
  label?: string | (() => string)
  prop?: string | (() => string)
  hide?: boolean | ((item: MaFormItem, model: MaModel) => boolean)
  show?: boolean | ((item: MaFormItem, model: MaModel) => boolean)
  
  // Layout Configuration
  cols?: ColsConfiguration
  itemProps?: ElFormItemProps
  itemSlots?: Record<string, (...args: any[]) => VNode | VNode[]>
  
  // Rendering Configuration
  render?: RenderType
  renderProps?: Record<string, any>
  renderSlots?: Record<string, (...args: any[]) => VNode | VNode[]>
  
  // Nesting Configuration
  children?: MaFormItem[]
  
  // Validation Configuration
  customValidator?: (rule: any, value: any, callback: Function) => void
  asyncValidator?: (rule: any, value: any) => Promise<void>
}
```

#### ColsConfiguration
Responsive column configuration type:

```typescript
interface ColsConfiguration {
  // Basic Grid Configuration
  span?: number
  offset?: number
  push?: number
  pull?: number
  
  // Responsive Configuration
  xs?: number | ResponsiveColConfig
  sm?: number | ResponsiveColConfig
  md?: number | ResponsiveColConfig
  lg?: number | ResponsiveColConfig
  xl?: number | ResponsiveColConfig
  
  // Custom Configuration
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
Type definition for component exposed methods:

```typescript
interface MaFormExpose {
  // State Management
  setLoadingState: (loading: boolean) => void
  getLoadingState: () => boolean
  
  // Configuration Management
  setOptions: (options: Partial<MaFormOptions>) => void
  getOptions: () => MaFormOptions
  updateOptions: (updater: (options: MaFormOptions) => MaFormOptions) => void
  
  // Form Item Management
  setItems: (items: MaFormItem[]) => void
  getItems: () => MaFormItem[]
  appendItem: (item: MaFormItem, index?: number) => void
  prependItem: (item: MaFormItem) => void
  removeItem: (prop: string) => boolean
  updateItem: (prop: string, updates: Partial<MaFormItem>) => boolean
  
  // Form Item Query
  getItemByProp: (prop: string) => MaFormItem | undefined
  getItemsByCondition: (condition: (item: MaFormItem) => boolean) => MaFormItem[]
  getVisibleItems: () => MaFormItem[]
  
  // Form Validation
  validate: () => Promise<boolean>
  validateField: (prop: string) => Promise<boolean>
  resetFields: (props?: string[]) => void
  clearValidate: (props?: string[]) => void
  
  // Form Data
  getFormData: () => Record<string, any>
  setFormData: (data: Record<string, any>) => void
  resetFormData: () => void
  
  // El-Form Instance
  getElFormRef: () => FormInstance | undefined
}
```

## Props

| Parameter  | Description                            | Type          | Default | Version |
|------------|----------------------------------------|-------------------|---------|---------|
| `v-model`  | Form data, two-way binding with reactive updates | `Record<string, any>` | `{}` | 1.0.0 |
| `options`  | Form configuration options, includes Element Plus native and extended properties | `MaFormOptions` | `{}` | 1.0.0 |
| `items`    | Form item configuration array, supports nesting and dynamic configuration | `MaFormItem[]` | `[]` | 1.0.0 |
| `loading`  | Global loading state, takes priority over options.loading | `boolean` | `false` | 1.0.0 |
| `disabled` | Global disabled state, takes priority over options.disabled | `boolean` | `false` | 1.0.0 |

### MaFormOptions Extended Configuration

::: tip Note
These are extended parameters of `ma-form` for `el-form`, fully compatible with Element Plus native parameters.
:::

| Parameter         | Description                                                                     | Type                                                                                               | Default     | Version |
|-------------------|---------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|-------------|---------|
| `containerClass`  | Custom class name for form container, used for style customization              | `string`                                                                                           | -           | 1.0.0 |
| `loading`         | Whether to show loading animation, supports global and local loading states     | `boolean`                                                                                          | `false`     | 1.0.0 |
| `loadingConfig`   | Detailed loading animation configuration options                                | [LoadingConfig](#loadingconfig-configuration)                                                        | `{}`        | 1.0.0 |
| `layout`          | Layout method: `flex` uses grid system, `grid` uses spacing layout              | `'flex' \| 'grid'`                                                                                 | `flex`      | 1.0.0 |
| `flex`            | Flex layout configuration, based on `el-row` component                          | `ElRowProps`                                                                                       | `{}`        | 1.0.0 |
| `grid`            | Grid layout configuration, based on `el-space` component                        | `ElSpaceProps`                                                                                     | `{}`        | 1.0.0 |
| `footerSlot`      | Configuration-based footer slot, can return VNode or VNode array                | `() => VNode \| VNode[]`                                                                           | -           | 1.0.0 |

#### LoadingConfig Configuration

Detailed configuration options for the loading animation:

| Parameter      | Description                      | Type     | Default                    | Version |
|----------------|----------------------------------|----------|----------------------------|---------|
| `text`         | Text displayed below the loading icon | `string` | `'Loading...'`             | 1.0.0 |
| `spinner`      | Custom loading icon class name   | `string` | -                          | 1.0.0 |
| `svg`          | Custom SVG loading icon          | `string` | -                          | 1.0.0 |
| `viewBox`      | ViewBox property for the SVG icon | `string` | -                          | 1.0.0 |
| `background`   | Background mask color            | `string` | `'rgba(0, 0, 0, 0.8)'`    | 1.0.0 |
| `customClass`  | Custom style class name          | `string` | -                          | 1.0.0 |
| `lock`         | Whether to lock scrolling        | `boolean`| `true`                     | 1.0.0 |
| `fullscreen`   | Whether to display fullscreen    | `boolean`| `false`                    | 1.0.0 |

### MaFormItem Configuration Details

Complete configuration options for form items:

#### Basic Configuration

| Parameter | Description                                                                                                                 | Type                                                                                                  | Default    | Version |
|-----------|-----------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|------------|---------|
| `label`   | Form item label, supports string or function return value                                                                   | `string \| (() => string)`                                                                            | -          | 1.0.0  |
| `prop`    | Form item field name, supports string or function return value, used for data binding and validation                        | `string \| (() => string)`                                                                            | -          | 1.0.0  |
| `hide`    | Whether to hide the item (hidden but data retained), supports dynamic control                                              | `boolean \| ((item: MaFormItem, model: Record<string, any>) => boolean)`  | `false`    | 1.0.0  |
| `show`    | Whether to show the item (not shown means no rendering and no data), supports dynamic control                              | `boolean \| ((item: MaFormItem, model: Record<string, any>) => boolean)`  | `true`     | 1.0.0  |

#### Layout Configuration

| Parameter    | Description                                                                                                                 | Type                                                                                                  | Default    | Version |
|--------------|-----------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|------------|---------|
| `cols`       | Grid layout configuration, effective when `layout` is `flex`, supports responsive configuration                            | `ColsConfiguration`                    | -          | 1.0.0  |
| `itemProps`  | Native properties of Element Plus `el-form-item`                                                                          | `ElFormItemProps`                    | `{}`       | 1.0.0  |
| `itemSlots`  | Native slot configuration of Element Plus `el-form-item`                                                                  | `Record<string, (...args: any[]) => VNode \| VNode[]>`                         | `{}`       | 1.0.0  |

#### Rendering Configuration

| Parameter     | Description                                                                                                                 | Type                                                                                                  | Default    | Version |
|---------------|-----------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|------------|---------|
| `render`      | Render component type: can be Element Plus component name (e.g., `'input'`, `'select'`), Vue component, or render function  | `RenderType`                                                                            | -          | 1.0.0  |
| `renderProps` | Props configuration for the rendered component                                                                              | `Record<string, any>`                                                                                | `{}`       | 1.0.0  |
| `renderSlots` | Slot configuration for the rendered component                                                                               | `Record<string, (...args: any[]) => VNode \| VNode[]>`                                                                  | `{}`       | 1.0.0  |

#### Nesting and Conditional Configuration

| Parameter  | Description                                                                  | Type                     | Default | Version |
|------------|------------------------------------------------------------------------------|--------------------------|---------|---------|
| `children` | Child configuration items, supports infinite nesting for complex form structures | `MaFormItem[]`           | `[]`    | 1.0.33 |

#### Validation Configuration

| Parameter         | Description                                               | Type                                                                       | Default | Version |
|-------------------|-----------------------------------------------------------|----------------------------------------------------------------------------|---------|---------|
| `customValidator` | Custom synchronous validation function                    | `(rule: any, value: any, callback: Function) => void`                      | -       | 1.0.0 |
| `asyncValidator`  | Custom asynchronous validation function                   | `(rule: any, value: any) => Promise<void>`                                 | -       | 1.0.0 |

## Slot System

MaForm provides a flexible slot system that supports multi-level content customization:

### Global Slots

| Name        | Description                                                 | Scope Variables              | Example                                                                                   |
|-------------|-------------------------------------------------------------|------------------------------|-------------------------------------------------------------------------------------------|
| `default`   | Default slot, can write native `<el-form-item>` tags, configuration becomes invalid after use | -                            | `<ma-form><el-form-item>...</el-form-item></ma-form>`                                     |
| `footer`    | Form footer slot, used for placing action elements like submit buttons | `{ formRef, model, loading }` | `<template #footer="{ formRef }">`                                                        |
| `loading`   | Custom loading state content                                | `{ loading }`                | `<template #loading="{ loading }">`                                                       |

### Form Item Level Slots

Each `MaFormItem` supports custom slots via `itemSlots`:

#### itemSlots Configuration

```typescript
interface ItemSlots {
  // Element Plus el-form-item native slots
  label?: (scope: { label: string }) => VNode | VNode[]
  error?: (scope: { error: string }) => VNode | VNode[]
  
  // MaForm extended slots
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

Supports dynamic slot naming based on `prop`, format: `item-{prop}`

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

For rendered Element Plus components, their slots can be configured via `renderSlots`:

```tsx
const field ={
  render: 'select',
  renderSlots: {
    // el-select's default slot
    default: () => [
      h('el-option', { label: 'Option 1', value: '1' }),
      h('el-option', { label: 'Option 2', value: '2' })
    ],
    // el-select's prefix slot
    prefix: () => h('el-icon', {}, [h('Search')])
  }
}
```

## Exposed Methods (Expose)

The MaForm component exposes a rich set of API methods via `defineExpose` for external control and data manipulation:

### State Management

| Method Name | Description | Parameters | Return Value | Example |
|------------|-------------|------------|--------------|---------|
| `setLoadingState(loading)` | Set the form loading state | `loading: boolean` | `void` | `formRef.value.setLoadingState(true)` |
| `getLoadingState()` | Get the current loading state | - | `boolean` | `const loading = formRef.value.getLoadingState()` |

### Configuration Management

| Method Name | Description | Parameters | Return Value | Example |
|------------|-------------|------------|--------------|---------|
| `setOptions(options)` | Set form configuration options | `options: Partial<MaFormOptions>` | `void` | `formRef.value.setOptions({ loading: true })` |
| `getOptions()` | Get current form configuration | - | `MaFormOptions` | `const opts = formRef.value.getOptions()` |
| `updateOptions(updater)` | Modify configuration via updater function | `updater: (options) => MaFormOptions` | `void` | `formRef.value.updateOptions(opts => ({ ...opts, loading: false }))` |

### Form Item Management

| Method Name | Description | Parameters | Return Value | Example |
|------------|-------------|------------|--------------|---------|
| `setItems(items)` | Set the form item array | `items: MaFormItem[]` | `void` | `formRef.value.setItems(newItems)` |
| `getItems()` | Get current form item array | - | `MaFormItem[]` | `const items = formRef.value.getItems()` |
| `appendItem(item, index?)` | Add a form item at a specified position | `item: MaFormItem, index?: number` | `void` | `formRef.value.appendItem(newItem, 2)` |
| `prependItem(item)` | Add a form item at the beginning | `item: MaFormItem` | `void` | `formRef.value.prependItem(firstItem)` |
| `removeItem(prop)` | Remove a form item by prop | `prop: string` | `boolean` | `const removed = formRef.value.removeItem('username')` |
| `updateItem(prop, updates)` | Update a specified form item | `prop: string, updates: Partial<MaFormItem>` | `boolean` | `formRef.value.updateItem('email', { hide: true })` |

### Form Item Query

| Method Name | Description | Parameters | Return Value | Example |
|------------|-------------|------------|--------------|---------|
| `getItemByProp(prop)` | Get a form item by prop | `prop: string` | `MaFormItem \| undefined` | `const item = formRef.value.getItemByProp('username')` |
| `getItemsByCondition(condition)` | Get form items by condition | `condition: (item) => boolean` | `MaFormItem[]` | `const hiddenItems = formRef.value.getItemsByCondition(item => item.hide)` |
| `getVisibleItems()` | Get all visible form items | - | `MaFormItem[]` | `const visible = formRef.value.getVisibleItems()` |

### Form Validation

| Method Name | Description | Parameters | Return Value | Example |
|------------|-------------|------------|--------------|---------|
| `validate()` | Validate the entire form | - | `Promise<boolean>` | `const valid = await formRef.value.validate()` |
| `validateField(prop)` | Validate a specific field | `prop: string` | `Promise<boolean>` | `const valid = await formRef.value.validateField('email')` |
| `resetFields(props?)` | Reset fields to their initial values | `props?: string[]` | `void` | `formRef.value.resetFields(['username', 'email'])` |
| `clearValidate(props?)` | Clear validation results | `props?: string[]` | `void` | `formRef.value.clearValidate()` |

### Form Data

| Method Name | Description | Parameters | Return Value | Example |
|------------|-------------|------------|--------------|---------|
| `getFormData()` | Get form data | - | `Record<string, any>` | `const data = formRef.value.getFormData()` |
| `setFormData(data)` | Set form data | `data: Record<string, any>` | `void` | `formRef.value.setFormData({ username: 'admin' })` |
| `resetFormData()` | Reset form data to initial state | - | `void` | `formRef.value.resetFormData()` |

### Element Plus Native Instance

| Method Name | Description | Parameters | Return Value | Example |
|------------|-------------|------------|--------------|---------|
| `getElFormRef()` | Get the Element Plus el-form instance | - | `FormInstance \| undefined` | `const elForm = formRef.value.getElFormRef()` |

### Usage Example

```vue
<template>
  <ma-form 
    ref="formRef" 
    v-model="formData" 
    :options="formOptions" 
    :items="formItems"
  />
  
  <div>
    <el-button @click="handleValidate">Validate Form</el-button>
    <el-button @click="handleAddItem">Add Item</el-button>
    <el-button @click="handleToggleLoading">Toggle Loading</el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const formRef = ref()
const formData = ref({})

const handleValidate = async () => {
  const isValid = await formRef.value.validate()
  console.log('Form validation result:', isValid)
}

const handleAddItem = () => {
  formRef.value.appendItem({
    label: 'New Field',
    prop: 'newField',
    render: 'input'
  })
}

const handleToggleLoading = () => {
  const currentLoading = formRef.value.getLoadingState()
  formRef.value.setLoadingState(!currentLoading)
}
</script>
```

## Layout System Details

MaForm provides two layout systems that support responsive design:

### Flex Layout (Default)

Implements a grid system based on Element Plus's `el-row` and `el-col` components:

```typescript
const field ={
  layout: 'flex',
  flex: {
    gutter: 20,        // Grid spacing
    type: 'flex',      // Modern flexbox mode
    justify: 'start',  // Horizontal alignment
    align: 'middle'    // Vertical alignment
  }
}
```

#### Grid Configuration

Each form item can be configured with grid layout via the `cols` property:

```typescript
const field ={
  label: 'Username',
  prop: 'username',
  render: 'input',
  cols: {
    span: 12,        // Occupies 12 grids (total 24)
    offset: 0,       // Left offset
    push: 0,         // Move right
    pull: 0,         // Move left
    order: 1,        // Order
    
    // Responsive configuration
    xs: 24,          // <768px full width
    sm: 12,          // ≥768px half width
    md: 8,           // ≥992px one third
    lg: 6,           // ≥1200px one quarter
    xl: 4            // ≥1920px one sixth
  }
}
```

### Grid Layout

Implements a spacing layout based on Element Plus's `el-space` component:

```typescript
const field ={
  layout: 'grid',
  grid: {
    direction: 'vertical',  // Layout direction
    size: 'medium',         // Spacing size
    wrap: true,             // Whether to wrap
    fill: true,             // Whether to fill the container
    fillRatio: 30,          // Fill ratio
    alignment: 'start'      // Alignment method
  }
}
```

### Responsive Configuration

#### Breakpoint System

| Breakpoint | Device Type | Width Range |
|------------|-------------|-------------|
| `xs`       | Extra small screen | <768px |
| `sm`       | Small screen | ≥768px |
| `md`       | Medium screen | ≥992px |
| `lg`       | Large screen | ≥1200px |
| `xl`       | Extra large screen | ≥1920px |

## Component Rendering System

MaForm supports multiple component rendering methods, providing flexible extensibility:

### Supported Element Plus Components

| Component Name | Render Value | Description | Common Configuration |
|----------------|--------------|-------------|----------------------|
| `input`        | `'input'`    | Input box | `type`, `placeholder`, `clearable` |
| `textarea`     | `'textarea'` | Textarea | `rows`, `autosize`, `resize` |
| `select`       | `'select'`   | Selector | `multiple`, `filterable`, `remote` |
| `cascader`     | `'cascader'` | Cascading selector | `options`, `props`, `showAllLevels` |
| `datePicker`   | `'datePicker'` | Date picker | `type`, `format`, `valueFormat` |
| `timePicker`   | `'timePicker'` | Time picker | `format`, `valueFormat`, `selectableRange` |
| `switch`       | `'switch'`   | Switch | `activeText`, `inactiveText`, `activeValue` |
| `checkbox`     | `'checkbox'` | Checkbox | `trueLabel`, `falseLabel` |
| `checkboxGroup`| `'checkboxGroup'` | Checkbox group | `min`, `max` |
| `radio`        | `'radio'`    | Radio button | `label`, `border` |
| `radioGroup`   | `'radioGroup'` | Radio button group | `textColor`, `fill` |
| `rate`         | `'rate'`     | Rating | `max`, `allowHalf`, `showText` |
| `slider`       | `'slider'`   | Slider | `min`, `max`, `step`, `range` |
| `upload`       | `'upload'`   | Upload | `action`, `headers`, `multiple` |
| `transfer`     | `'transfer'` | Transfer | `data`, `targetKeys`, `titles` |

### Rendering Methods Detail

#### 1. String Rendering

```typescript
const field ={
  label: 'Username',
  prop: 'username',
  render: 'input',                    // String method
  renderProps: {
    placeholder: 'Please enter username',
    clearable: true,
    prefixIcon: 'User'
  }
}
```

#### 2. Component Rendering

```typescript
import CustomInput from './CustomInput.vue'

const field ={
  label: 'Custom Field',
  prop: 'custom',
  render: CustomInput,                // Component method
  renderProps: {
    customProp: 'value'
  }
}
```

#### 3. Function Rendering

```typescript
const field = {
  label: 'Dynamic Rendering',
  prop: 'dynamic',
  render: ({ item, model, disabled }) => {
    return h('div', [
      h('el-input', {
        modelValue: model[item.prop],
        'onUpdate:modelValue': (value) => model[item.prop] = value,
        disabled,
        placeholder: 'Dynamically rendered input box'
      })
    ])
  }
}
```

#### 4. JSX/TSX Rendering

```tsx
const field ={
  label: 'JSX Rendering',
  prop: 'jsx',
  render: ({ item, model }) => (
    <el-input
      v-model={model[item.prop]}
      placeholder="JSX rendered input box"
      clearable
    />
  )
}
```

### Complex Component Configuration Examples

#### Select Selector

```typescript
const field ={
  label: 'Selection',
  prop: 'selection',
  render: 'select',
  renderProps: {
    multiple: true,
    filterable: true,
    remote: true,
    remoteMethod: (query) => {
      // Remote search logic
    },
    placeholder: 'Please select'
  },
  renderSlots: {
    default: () => [
      h('el-option', { label: 'Option 1', value: '1' }),
      h('el-option', { label: 'Option 2', value: '2' })
    ],
    prefix: () => h('el-icon', [h('Search')])
  }
}
```

#### Upload Component

```typescript
const field ={
  label: 'File Upload',
  prop: 'files',
  render: 'upload',
  renderProps: {
    action: '/api/upload',
    multiple: true,
    showFileList: true,
    drag: true,
    accept: '.jpg,.png,.pdf',
    beforeUpload: (file) => {
      // Pre-upload validation
      return true
    },
    onSuccess: (response, file) => {
      // Upload success handling
    }
  },
  renderSlots: {
    trigger: () => h('el-button', { type: 'primary' }, 'Select File'),
    tip: () => h('div', { class: 'el-upload__tip' }, 'Only jpg/png files under 500kb are allowed')
  }
}
```

## Advanced Features

### Conditional Rendering

Dynamically control the display and hiding of form items based on form data:

```typescript
const field =[
    {
      label: 'Account Type',
      prop: 'accountType',
      render: 'select',
      renderProps: { /* ... */ }
    },
    {
      label: 'Company Name',
      prop: 'companyName',
      render: 'input',
      // Only show when account type is 'company'
      show: (model) => model.accountType === 'company',
    }
]
```

### Dynamic Validation

Supports context-based dynamic validation rules:

```typescript
const field ={
  label: 'Confirm Password',
  prop: 'confirmPassword',
  render: 'input',
  renderProps: {
    type: 'password',
    showPassword: true
  },
  customValidator: (rule, value, callback) => {
    if (value !== model.password) {
      callback(new Error('Passwords do not match'))
    } else {
      callback()
    }
  }
}
```

### Asynchronous Data Loading

```typescript
const field ={
  label: 'City Selection',
  prop: 'city',
  render: 'select',
  renderProps: {
    loading: false,
    filterable: true,
    remote: true,
    remoteMethod: async (query) => {
      formRef.value.updateItem('city', {
        renderProps: { loading: true }
      })
      
      try {
        const cities = await fetchCities(query)
        // Update options
        updateCityOptions(cities)
      } finally {
        formRef.value.updateItem('city', {
          renderProps: { loading: false }
        })
      }
    }
  }
}
```

## Best Practices

### 1. Performance Optimization

#### Using `show` vs `hide`

```typescript
// Recommended: Use show, hidden items are not rendered
{
  show: (item, model) => model.userType === 'admin'
}

// Avoid: Using hide, still rendered but hidden
{
  hide: (item, model) => model.userType !== 'admin'
}
```

#### Reasonable Use of Responsive Configuration

```typescript
// Recommended: Optimized for mobile
const field ={
  cols: {
    xs: 24,    // Mobile single column
    sm: 12,    // Tablet dual column
    md: 8      // Desktop three columns
  }
}
```

### 2. Form Validation Strategy

#### Layered Validation

```typescript
// 1. Basic validation (Element Plus rules)
itemProps: {
  rules: [
    { required: true, message: 'Please enter username', trigger: 'blur' },
    { min: 3, max: 20, message: 'Length should be between 3 and 20 characters', trigger: 'blur' }
  ]
}

// 2. Custom validation
customValidator: (rule, value, callback) => {
  if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    callback(new Error('Only letters, numbers, and underscores are allowed'))
  } else {
    callback()
  }
}

// 3. Asynchronous validation
asyncValidator: async (rule, value) => {
  const exists = await checkUsernameExists(value)
  if (exists) {
    throw new Error('Username already exists')
  }
}
```

### 3. Component Reuse

#### Creating Common Configurations

```typescript
// utils/formConfigs.ts
export const createUserFormItems = (readonly = false): MaFormItem[] => [
  {
    label: 'Username',
    prop: 'username',
    render: 'input',
    renderProps: {
      disabled: readonly,
      placeholder: readonly ? '' : 'Please enter username'
    }
  },
  {
    label: 'Email',
    prop: 'email',
    render: 'input',
    renderProps: {
      disabled: readonly,
      type: 'email'
    }
  }
]
```

#### Using Composition API

```typescript
// composables/useFormConfig.ts
export function useFormConfig() {
  const createFormItems = (type: 'create' | 'edit' | 'view') => {
    const readonly = type === 'view'
    
    return [
      // Basic information
      ...createUserFormItems(readonly),
      
      // Conditional fields
      ...(type !== 'view' ? [
        {
          label: 'Password',
          prop: 'password',
          render: 'input',
          renderProps: { type: 'password' }
        }
      ] : [])
    ]
  }
  
  return { createFormItems }
}
```

### 4. Error Handling

```typescript
const handleSubmit = async () => {
  try {
    // Validate form
    const isValid = await formRef.value.validate()
    if (!isValid) {
      ElMessage.error('Please check the form')
      return
    }
    
    // Get form data
    const formData = formRef.value.getFormData()
    
    // Submit data
    await submitForm(formData)
    
    ElMessage.success('Submission successful')
  } catch (error) {
    console.error('Form submission failed:', error)
    ElMessage.error('Submission failed, please try again later')
  }
}
```

## Frequently Asked Questions (FAQ)

### Q: How to dynamically add or remove form items?

A: Use the `appendItem` and `removeItem` methods:

```typescript
// Add a form item
const addItem = () => {
  formRef.value.appendItem({
    label: `Field${Date.now()}`,
    prop: `field_${Date.now()}`,
    render: 'input'
  })
}

// Remove a form item
const removeItem = (prop: string) => {
  formRef.value.removeItem(