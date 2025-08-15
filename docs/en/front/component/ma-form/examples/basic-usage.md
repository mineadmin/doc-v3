# Basic Usage

Demonstrates the basic usage of MaForm, including common form control configurations and core features.

<DemoPreview dir="demos/ma-form/basic-usage" />

## Features

- **Multiple Input Types**: Text input, password field, number input, etc.
- **Automatic Data Binding**: Two-way data binding without manual handling
- **Basic Validation Rules**: Supports required fields, length, format, and other common validations
- **Simple Component Configuration**: Quickly build forms through declarative configuration
- **Native Compatibility**: Fully compatible with Element Plus native properties and events

## Core Concepts

### Declarative Development
Configure form items through the `items` array, where each configuration object contains:
- `label`: Form item label
- `prop`: Data field name for binding
- `render`: Type of component to render
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

### Number Input Field
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

- [Props Configuration](/front/component/ma-form#props)
- [MaFormItem Configuration](/front/component/ma-form#maformitem-configuration-details)
- [Component Rendering System](/front/component/ma-form#component-rendering-system)