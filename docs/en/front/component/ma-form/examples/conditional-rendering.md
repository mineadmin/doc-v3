# Conditional Rendering

Demonstrates the conditional rendering functionality that dynamically controls field visibility based on form data, including linked displays and complex conditional judgments.

<DemoPreview dir="demos/ma-form/conditional-rendering" />

## Features

- **Dynamic Visibility Control**: Show/hide fields based on form data
- **Dependency Management**: Declare field dependencies through dependencies
- **Complex Condition Support**: Supports multi-condition combination judgments
- **Performance Optimization**: Only recalculates conditions when dependent fields change
- **show vs hide**: Provides two different control methods

## Conditional Rendering Methods

### 1. show Property (Recommended)
Does not render the component when conditions are not met, saving DOM space with better performance:

```typescript
{
  label: 'Company Name',
  prop: 'companyName',
  render: 'input',
  show: (model, item) => model.userType === 'company',
  dependencies: ['userType']
}
```

### 2. hide Property
Hides the component when conditions are not met, but still occupies DOM space:

```typescript
{
  label: 'Personal Info', 
  prop: 'personalInfo',
  render: 'input',
  hide: (model, item) => model.userType === 'company',
  dependencies: ['userType']
}
```

### 3. when Condition Function
More flexible conditional judgment method:

```typescript
{
  label: 'Advanced Options',
  prop: 'advancedOptions',
  render: 'switch',
  when: (model, item) => {
    return model.userLevel === 'advanced' && model.isVip === true
  },
  dependencies: ['userLevel', 'isVip']
}
```

## Common Use Cases

### 1. Type-Linked Display

```typescript
const userTypeFields = [
  {
    label: 'User Type',
    prop: 'userType',
    render: 'select',
    renderProps: {
      placeholder: 'Please select user type'
    },
    renderSlots: {
      default: () => [
        h('el-option', { label: 'Individual User', value: 'personal' }),
        h('el-option', { label: 'Enterprise User', value: 'company' })
      ]
    }
  },
  {
    label: 'Real Name',
    prop: 'realName',
    render: 'input',
    show: (model) => model.userType === 'personal',
    dependencies: ['userType']
  },
  {
    label: 'Company Name',
    prop: 'companyName',
    render: 'input',
    show: (model) => model.userType === 'company',
    dependencies: ['userType']
  },
  {
    label: 'Unified Social Credit Code',
    prop: 'creditCode',
    render: 'input',
    show: (model) => model.userType === 'company',
    dependencies: ['userType']
  }
]
```

### 2. Permission Level Control

```typescript
const permissionFields = [
  {
    label: 'User Permission',
    prop: 'permission',
    render: 'select',
    renderSlots: {
      default: () => [
        h('el-option', { label: 'Regular User', value: 'user' }),
        h('el-option', { label: 'Administrator', value: 'admin' }),
        h('el-option', { label: 'Super Administrator', value: 'superAdmin' })
      ]
    }
  },
  {
    label: 'Management Scope',
    prop: 'adminScope',
    render: 'checkboxGroup',
    show: (model) => ['admin', 'superAdmin'].includes(model.permission),
    dependencies: ['permission']
  },
  {
    label: 'System Configuration Permission',
    prop: 'systemConfig',
    render: 'switch',
    show: (model) => model.permission === 'superAdmin',
    dependencies: ['permission']
  }
]
```

### 3. Complex Multi-Condition Judgment

```typescript
const complexConditionField = {
  label: 'Special Feature',
  prop: 'specialFeature',
  render: 'input',
  when: (model, item) => {
    // Multiple condition judgments
    const hasPermission = model.userLevel >= 5
    const isSubscribed = model.subscription === 'premium'
    const isEligible = model.accountAge > 365 // Account age > 1 year
    
    // Combined condition: requires permission, subscription status and account age
    return hasPermission && isSubscribed && isEligible
  },
  dependencies: ['userLevel', 'subscription', 'accountAge']
}
```

### 4. Nested Conditional Rendering

```typescript
const nestedConditionFields = [
  {
    label: 'Enable Advanced Features',
    prop: 'enableAdvanced',
    render: 'switch'
  },
  {
    label: 'Advanced Configuration',
    prop: 'advancedConfig',
    show: (model) => model.enableAdvanced === true,
    dependencies: ['enableAdvanced'],
    children: [
      {
        label: 'Cache Strategy',
        prop: 'cacheStrategy',
        render: 'select',
        show: (model) => model.enableAdvanced === true,
        dependencies: ['enableAdvanced']
      },
      {
        label: 'Cache Timeout (hours)',
        prop: 'cacheTimeout',
        render: 'inputNumber',
        show: (model) => {
          return model.enableAdvanced === true && 
                 model.cacheStrategy === 'custom'
        },
        dependencies: ['enableAdvanced', 'cacheStrategy']
      }
    ]
  }
]
```

## Dependency Optimization

### 1. Declare Dependent Fields
Use `dependencies` array to declare field dependencies for precise updates:

```typescript
{
  label: 'Related Field',
  prop: 'relatedField',
  render: 'input',
  show: (model) => model.status === 'active' && model.type === 'premium',
  dependencies: ['status', 'type']  // Only recalculates when these fields change
}
```

### 2. Avoid Excessive Dependencies

```typescript
// ❌ Not recommended: Too many dependencies
{
  dependencies: ['field1', 'field2', 'field3', 'field4', 'field5']
}

// ✅ Recommended: Precise dependencies
{
  dependencies: ['userType']  // Only depends on fields that actually affect visibility
}
```

## Performance Considerations

### 1. Use show Instead of hide

```typescript
// ✅ Recommended: Use show, doesn't render hidden elements
{
  show: (model) => model.userType === 'admin'
}

// ❌ Avoid: Using hide still renders but hides elements
{  
  hide: (model) => model.userType !== 'admin'
}
```

### 2. Cache Condition Calculation Results

```typescript
// Complex condition calculations can use computed properties for caching
const computedCondition = computed(() => {
  return model.value.userLevel >= 5 && 
         model.value.subscription === 'premium' &&
         model.value.accountAge > 365
})

const field = {
  label: 'Special Feature',
  prop: 'specialFeature',
  render: 'input',
  show: () => computedCondition.value,
  dependencies: ['userLevel', 'subscription', 'accountAge']
}
```

## Debugging Tips

### 1. Condition Function Debugging

```typescript
{
  label: 'Debug Field',
  prop: 'debugField',
  render: 'input',
  show: (model, item) => {
    const condition = model.userType === 'admin'
    console.log(`Field ${item.prop} visibility condition:`, {
      userType: model.userType,
      condition
    })
    return condition
  },
  dependencies: ['userType']
}
```

### 2. Dependency Tracking

```typescript
{
  label: 'Track Field',
  prop: 'trackField',
  render: 'input',
  show: (model, item) => {
    console.log(`Dependency field changes:`, {
      dependencies: item.dependencies,
      values: item.dependencies?.map(dep => ({ [dep]: model[dep] }))
    })
    return model.status === 'active'
  },
  dependencies: ['status']
}
```

## Related Links

- [MaFormItem Configuration Details](/en/front/component/ma-form#maformitem-configuration-details)
- [Advanced Features - Conditional Rendering](/en/front/component/ma-form#conditional-rendering)
- [Nested Form Structure](/en/front/component/ma-form/examples/nested-forms)