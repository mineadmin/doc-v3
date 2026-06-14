# Conditional Rendering

Demonstrates the conditional rendering functionality that dynamically controls field display and hiding based on form data, including linked display and complex condition judgment.

<DemoPreview dir="demos/ma-form/conditional-rendering" />

## Features

- **Dynamic Display Control**: Control field show/hide based on form data
- **Dependency Management**: Declare field dependencies via the `dependencies` property
- **Complex Condition Support**: Support multi-condition combination judgment
- **Performance Optimization**: Recalculate conditions only when dependent fields change
- **Two Rendering Methods**: `show` and `hide` properties provide different display control strategies

## Conditional Rendering Methods

MaForm provides two methods for conditional rendering, each with its specific use cases:

### show Property (Recommended)

Does not render the DOM if the condition is not met, best performance, suitable for most scenarios:

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
- ✅ No DOM rendered, best performance
- ✅ Does not occupy page space
- ✅ Suitable for most scenarios
- ⚠️ May have slight flickering on initialization

### hide Property

Hides the DOM if the condition is not met but still renders it, suitable for frequently toggling scenarios:

```typescript
{
  label: 'Email Notification',
  prop: 'emailNotifications', 
  render: 'switch',
  hide: (item, model) => !model.enableNotifications,
  dependencies: ['enableNotifications']
}
```

**Characteristics:**
- ✅ Smooth toggling, no flickering
- ✅ Maintains stable form structure
- ❌ Still renders the DOM
- ❌ Occupies page space

## Use Case Comparison

### show Property Use Cases

**1. Displaying Different Fields Based on User Type**

```typescript
const userTypeFields = [
  {
    label: 'User Type',
    prop: 'userType',
    render: 'select',
    options: [
      { label: 'Personal User', value: 'personal' },
      { label: 'Business User', value: 'company' }
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
    label: 'Admin Scope',
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
    label: 'Email Notification',
    prop: 'emailNotifications',
    render: 'switch',
    // Use hide to maintain layout stability for smoother toggling
    hide: (item, model) => !model.enableNotifications,
    dependencies: ['enableNotifications']
  },
  {
    label: 'SMS Notification',
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
  // Use hide to avoid layout jumping
  hide: (item, model) => !model.password || model.password.length === 0,
  dependencies: ['password']
}
```

## Complex Condition Scenarios

### 1. Multiple Condition Judgment

```typescript
{
  label: 'Special Feature',
  prop: 'specialFeature',
  render: 'input',
  show: (item, model) => {
    // Multiple conditions: all conditions must be met simultaneously
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
    label: 'Need Address',
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
    // Cascading condition: needs address AND selected China
    show: (item, model) => model.needAddress && model.country === 'china',
    dependencies: ['needAddress', 'country']
  },
  {
    label: 'City',
    prop: 'city',
    render: 'select',
    // More complex cascade: needs address AND province selected
    show: (item, model) => model.needAddress && !!model.province,
    dependencies: ['needAddress', 'province']
  }
]
```

### 3. Dynamically Computed Conditions

```typescript
// Using computed properties to optimize complex conditions
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

## Dependency Relationship Optimization

### 1. Declare Precise Dependencies

```typescript
// ✅ Recommended: Precise dependency
{
  show: (item, model) => model.userType === 'admin',
  dependencies: ['userType']  // Only depends on the field that truly affects display
}

// ❌ Avoid: Over-dependency
{
  show: (item, model) => model.userType === 'admin',
  dependencies: ['userType', 'userName', 'email', 'phone']  // Includes unnecessary dependencies
}
```

### 2. Avoid Circular Dependencies

```typescript
// ❌ Incorrect: May cause circular dependency
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

// ✅ Correct: Use a common control field
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

## Performance Optimization Suggestions

### 1. Prefer Using the show Property

```typescript
// ✅ Recommended: Use show, does not render hidden elements
{
  show: (item, model) => model.userType === 'admin'
}

// ⚠️ Use with caution: Using hide still renders but hides the element
{  
  hide: (item, model) => model.userType !== 'admin'
}
```

### 2. Cache Complex Computations

```typescript
// Cache complex condition calculations using computed properties
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

### 3. Reduce the Number of Dependencies

```typescript
// ✅ Combine related logic to reduce dependencies
{
  show: (item, model) => {
    // Merge related conditions into one function
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

## Debugging Tips

### 1. Condition Function Debugging

```typescript
{
  label: 'Debug Field',
  prop: 'debugField',
  render: 'input',
  show: (item, model) => {
    const condition = model.userType === 'admin'
    
    // Debugging information in development mode
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

### 2. Dependency Tracking

```typescript
// Create a debug utility function
const createDebugShow = (conditionFn: Function, debugName: string) => {
  return (item: any, model: any) => {
    const result = conditionFn(item, model)
    
    console.log(`[${debugName}] Condition Check:`, {
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

// Use the debug utility
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

### 1. Define Clear Use Cases

- **show Property**: Suitable for most conditional rendering scenarios, best performance
- **hide Property**: Suitable for frequently toggling scenarios requiring stable layout

### 2. Design Dependencies Reasonably

- Only declare fields that truly affect the display as dependencies
- Avoid over-dependency and circular dependencies
- Use computed properties to cache complex conditions

### 3. Consider User Experience

- For frequently toggling scenarios, use the `hide` property to avoid layout jumping
- For one-time display scenarios, use the `show` property to save performance
- Provide appropriate transition animations to enhance the experience

## Related Links

- [MaFormItem Configuration Details](/v3/front/component/ma-form#maformitem-configuration-details)
- [Advanced Features - Conditional Rendering](/v3/front/component/ma-form#conditional-rendering)
- [Nested Form Structures](/v3/front/component/ma-form/examples/nested-forms)