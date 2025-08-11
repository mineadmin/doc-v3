# Basic Usage

Demonstration of MaForm's basic usage, including configuration methods for common form controls and core functionality features.

<DemoPreview dir="demos/ma-form/basic-usage" />

## Features

- **Multiple Input Types Support**: Text input, password field, numeric input, etc.
- **Automatic Data Binding**: Two-way form data binding without manual handling
- **Basic Validation Rules**: Supports common validations like required, length, format
- **Simple Component Configuration**: Quickly build forms through declarative configuration
- **Native Compatibility**: Fully compatible with Element Plus native properties and events

## Core Concepts

### Declarative Development
Configure form items through the `items` array, each configuration object contains:
- `label`: Form item label
- `prop`: Bound data field name
- `render`: Component type to render
- `renderProps`: Properties passed to the component

### Data Binding
Use `v-model` for two-way data binding:
```vue
<ma-form v-model="formData" :items="formItems" />
```

## Common Configuration Examples

### Basic Input Field
```typescript
{
  label: 'Username',
  prop: 'username',
  render: 'input',
  renderProps: {
    placeholder: 'Please enter username',
    clearable: true
  }
}
```

### Password Input Field
```typescript
{
  label: 'Password',
  prop: 'password',
  render: 'input',
  renderProps: {
    type: 'password',
    showPassword: true,
    placeholder: 'Please enter password'
  }
}
```

### Numeric Input Field
```typescript
{
  label: 'Age',
  prop: 'age',
  render: 'inputNumber',
  renderProps: {
    min: 0,
    max: 150,
    controlsPosition: 'right'
  }
}
```

## Related Links

- [Props Configuration](/en/front/component/ma-form#props)
- [MaFormItem Configuration](/en/front/component/ma-form#maformitem-configuration-details)
- [Component Rendering System](/en/front/component/ma-form#component-rendering-system)