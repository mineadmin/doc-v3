# Basic Usage

Basic usage demonstration of MaForm, including configuration methods and basic functional features for common form controls.

<DemoPreview dir="demos/ma-form/basic-usage" />

## Features

- **Multiple Input Types Support**: Text input, password input, number input, etc.
- **Automatic Data Binding**: Two-way binding of form data, no manual handling required
- **Basic Validation Rules**: Supports common validations such as required, length, and format
- **Simple Component Configuration**: Quickly build forms through configuration
- **Native Compatibility**: Fully compatible with Element Plus native properties and events

## Core Concepts

### Configuration-Driven Development
Configure form items via the `items` array, where each configuration object contains:
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

### Basic Input
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

### Password Input
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

### Number Input
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

- [Props Configuration](/v3/front/component/ma-form#props)
- [MaFormItem Configuration](/v3/front/component/ma-form#maformitem-配置详解)
- [Component Rendering System](/v3/front/component/ma-form#组件渲染系统)