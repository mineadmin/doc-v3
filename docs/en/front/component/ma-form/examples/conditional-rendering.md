# Conditional Rendering

Demonstrates the conditional rendering functionality that dynamically controls field visibility based on form data, including linked displays and complex conditional judgments.

<DemoPreview dir="demos/ma-form/conditional-rendering" />

## Features

- **Dynamic Display Control**: Controls field show/hide based on form data
- **Dependency Management**: Declares field dependencies through dependencies
- **Complex Condition Support**: Supports multi-condition combination judgments
- **Performance Optimization**: Recalculates conditions only when dependent fields change
- **Two Rendering Modes**: show and hide properties provide different display control strategies

## Conditional Rendering Methods

MaForm provides two conditional rendering methods, each with specific use cases:

### show Property (Recommended)

Does not render DOM when conditions are not met, offering optimal performance for most scenarios:

```typescript
{
  label: 'Company Name',
  prop: 'companyName',
  render: 'input',
  show: (item, model) => model.userType === 'company',
  dependencies: ['userType']
}
```

**Characteristics:**
- ✅ No DOM rendering, best performance
- ✅ Does not occupy page space
- ✅ Suitable for most scenarios
- ⚠️ Slight flicker possible during initialization

### hide Property

Hides DOM when conditions are not met but still renders, suitable for frequently toggled scenarios:

```typescript
{
  label: 'Email Notifications',
  prop: 'emailNotifications', 
  render: 'switch',
  hide: (item, model) => !model.enableNotifications,
  dependencies: ['enableNotifications']
}
```

**Characteristics:**
- ✅ Smooth transitions without flickering
- ✅ Maintains stable form structure
- ❌ Still renders DOM
- ❌ Occupies page space

## Use Case Comparisons

### show Property Use Cases

**1. Display Different Fields Based on User Type**

```typescript
const userTypeFields = [
  {
    label: 'User Type',
    prop: 'userType',
    render: 'select',
    options: [
      { label: 'Personal User', value: 'personal' },
      { label: 'Enterprise User', value: 'company' }
    ]
  },
  {
    label: 'Real Name', 
    prop: 'realName',
    render: 'input',
    show: (item, model) => model.userType === 'personal',
    dependencies: ['userType']
  },
  {
    label: 'Company Name',
    prop: 'companyName', 
    render: 'input',
    show: (item, model) => model.userType === 'company',
    dependencies: ['userType']
  }
]
```

**2. Permission Level Control**

```typescript
const permissionFields = [
  {
    label: 'User Permission',
    prop: 'permission',
    render: 'select',
    options: [
      { label: 'Regular User', value: 'user' },
      { label: 'Administrator', value: 'admin' },
      { label: 'Super Administrator', value: 'superAdmin' }
    ]
  },
  {
    label: 'Management Scope',
    prop: 'adminScope',
    render: 'checkboxGroup',
    show: (item, model) => ['admin', 'superAdmin'].includes(model.permission),
    dependencies: ['permission']
  },
  {
    label: 'System Configuration Permission',
    prop: 'systemConfig',
    render: 'switch',
    show: (item, model) => model.permission === 'superAdmin',
    dependencies: ['permission']
  }
]
```

### hide Property Use Cases

**1. Frequently Toggled Feature Switches**

```typescript
const notificationFields = [
  {
    label: 'Enable Notifications',
    prop: 'enableNotifications',
    render: 'switch'
  },
  {
    label: 'Email Notifications',
    prop: 'emailNotifications',
    render: 'switch',
    // Use hide to maintain layout stability with smooth transitions
    hide: (item, model) => !model.enableNotifications,
    dependencies: ['enableNotifications']
  },
  {
    label: 'SMS Notifications',
    prop: 'smsNotifications',
    render: 'switch',
    hide: (item, model) => !model.enableNotifications,
    dependencies: ['enableNotifications']
  }
]
```

**2. Form Validation Hints**

```typescript
{
  label: 'Password Strength Hint',
  prop: 'passwordStrengthTip',
  render: 'input',
  renderProps: {
    readonly: true,
    placeholder: 'Password Strength: Weak'
  },
  // Use hide to avoid layout jumps
  hide: (item, model) => !model.password || model.password.length === 0,
  dependencies: ['password']
}
```

## Complex Condition Scenarios

### 1. Multiple Condition Judgments

```typescript
{
  label: 'Special Feature',
  prop: 'specialFeature',
  render: 'input',
  show: (item, model) => {
    // Multiple conditions: must satisfy all simultaneously
    return model.userLevel >= 5 && 
           model.subscription === 'premium' && 
           model.accountAge > 365
  },
  dependencies: ['userLevel', 'subscription', 'accountAge']
}
```

### 2. Cascading Conditional Rendering

```typescript
const cascadeFields = [
  {
    label: 'Require Address',
    prop: 'needAddress',
    render: 'switch'
  },
  {
    label: 'Country',
    prop: 'country',
    render: 'select',
    show: (item, model) => model.needAddress,
    dependencies: ['needAddress']
  },
  {
    label: 'Province',
    prop: 'province',
    render: 'select',
    // Cascading condition: requires address AND China selection
    show: (item, model) => model.needAddress && model.country === 'china',
    dependencies: ['needAddress', 'country']
  },
  {
    label: 'City',
    prop: 'city',
    render: 'select',
    // More complex cascade: requires address AND selected province
    show: (item, model) => model.needAddress && !!model.province,
    dependencies: ['needAddress', 'province']
  }
]
```

### 3. Dynamic Condition Calculation

```typescript
// Use computed properties to optimize complex conditions
const isAdvancedUser = computed(() => {
  return formData.value.userLevel >= 10 && 
         formData.value.vipStatus === 'active' &&
         formData.value.experience > 1000
})

const advancedField = {
  label: 'Advanced Feature',
  prop: 'advancedFeature',
  render: 'input',
  show: (item) => isAdvancedUser.value,
  dependencies: ['userLevel', 'vipStatus', 'experience']
}
```

## Dependency Optimization

### 1. Precise Dependency Declaration

```typescript
// ✅ Recommended: Precise dependencies
{
  show: (item, model) => model.userType === 'admin',
  dependencies: ['userType']  // Only depends on fields that truly affect display
}

// ❌ Avoid: Over-dependency
{
  show: (item, model) => model.userType === 'admin',
  dependencies: ['userType', 'userName', 'email', 'phone']  // Includes unnecessary dependencies
}
```

### 2. Avoid Circular Dependencies

```typescript
// ❌ Wrong: May cause circular dependencies
{
  label: 'Field A',
  prop: 'fieldA',
  show: (item, model) => model.fieldB === 'show',
  dependencies: ['fieldB']
},
{
  label: 'Field B',
  prop: 'fieldB',
  show: (item, model) => model.fieldA === 'active',
  dependencies: ['fieldA']  // Circular dependency
}

// ✅ Correct: Use common control field
{
  label: 'Control Switch',
  prop: 'enableFeatures',
  render: 'switch'
},
{
  label: 'Field A',
  prop: 'fieldA',
  show: (item, model) => model.enableFeatures,
  dependencies: ['enableFeatures']
},
{
  label: 'Field B',
  prop: 'fieldB',
  show: (item, model) => model.enableFeatures,
  dependencies: ['enableFeatures']
}
```

## Performance Optimization Recommendations

### 1. Prefer show Property

```typescript
// ✅ Recommended: Use show, doesn't render hidden elements
{
  show: (item, model) => model.userType === 'admin'
}

// ⚠️ Use with caution: Use hide, still renders but hides
{  
  hide: (item, model) => model.userType !== 'admin'
}
```

### 2. Cache Complex Calculations

```typescript
// Cache complex condition calculations with computed properties
const complexCondition = computed(() => {
  const { userLevel, subscription, accountAge } = formData.value
  return userLevel >= 5 && 
         subscription === 'premium' &&
         accountAge > 365
})

const field = {
  label: 'Special Feature',
  prop: 'specialFeature', 
  render: 'input',
  show: () => complexCondition.value,
  dependencies: ['userLevel', 'subscription', 'accountAge']
}
```

### 3. Reduce Dependency Count

```typescript
// ✅ Merge related logic to reduce dependencies
{
  show: (item, model) => {
    // Combine related conditions in one function
    return model.status === 'active' && model.level > 3
  },
  dependencies: ['status', 'level']
}

// ❌ Avoid: Scattered condition checks
{
  show: (item, model) => model.status === 'active',
  dependencies: ['status', 'level', 'type', 'category']
}
```

## Debugging Techniques

### 1. Condition Function Debugging

```typescript
{
  label: 'Debug Field',
  prop: 'debugField',
  render: 'input',
  show: (item, model) => {
    const condition = model.userType === 'admin'
    
    // Debug information in development environment
    if (process.env.NODE_ENV === 'development') {
      console.log(`Field ${item.prop} display condition:`, {
        userType: model.userType,
        condition,
        dependencies: item.dependencies
      })
    }
    
    return condition
  },
  dependencies: ['userType']
}
```

### 2. Dependency Tracing

```typescript
// Create debug utility function
const createDebugShow = (conditionFn: Function, debugName: string) => {
  return (item: any, model: any) => {
    const result = conditionFn(item, model)
    
    console.log(`[${debugName}] Condition check:`, {
      result,
      dependencies: item.dependencies,
      dependencyValues: item.dependencies?.reduce((acc: any, dep: string) => {
        acc[dep] = model[dep]
        return acc
      }, {})
    })
    
    return result
  }
}

// Use debug utility
{
  label: 'Test Field',
  prop: 'testField',
  render: 'input',
  show: createDebugShow(
    (item, model) => model.status === 'active',
    'testField'
  ),
  dependencies: ['status']
}
```

## Best Practices

### 1. Clear Use Cases

- **show property**: Suitable for most conditional rendering scenarios with best performance
- **hide property**: Suitable for frequently toggled scenarios requiring layout stability

### 2. Reasonable Dependency Design

- Only declare fields that truly affect display as dependencies
- Avoid over-dependencies and circular dependencies
- Use computed properties to cache complex conditions

### 3. Consider User Experience

- For frequently toggled scenarios, use hide property to avoid layout jumps
- For one-time display scenarios, use show property to save performance
- Provide appropriate transition animations to enhance experience

## Related Links

- [MaFormItem Configuration Details](/en/front/component/ma-form#maformitem-configuration-details)
- [Advanced Features - Conditional Rendering](/en/front/component/ma-form#conditional-rendering)
- [Nested Form Structures](/en/front/component/ma-form/examples/nested-forms)