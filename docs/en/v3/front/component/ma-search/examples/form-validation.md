# Form Validation

Demonstrates various validation rules and scenarios, including basic validation, advanced validation, asynchronous validation, conditional validation, etc., ensuring the accuracy of search criteria and data integrity.

## Form Validation Demo

<DemoPreview dir="demos/ma-search/form-validation" />

## Validation Rules Description

### Basic Validation
Most commonly used form validation rules:

```typescript
// Required validation
{
  label: 'Username',
  prop: 'username',
  render: 'input',
  rules: [
    { required: true, message: 'Username cannot be empty', trigger: 'blur' }
  ]
}

// Length validation
{
  label: 'Description',
  prop: 'description', 
  render: 'input',
  rules: [
    { min: 10, max: 100, message: 'Description length must be between 10-100 characters', trigger: 'blur' }
  ]
}
```

### Format Validation
Email, phone number, URL, and other format validation:

```typescript
// Email validation
{
  label: 'Email',
  prop: 'email',
  render: 'input',
  rules: [
    { required: true, message: 'Email cannot be empty', trigger: 'blur' },
    { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
  ]
}

// Custom regex validation
{
  label: 'Phone Number',
  prop: 'phone',
  render: 'input',
  rules: [
    { 
      pattern: /^1[3-9]\d{9}$/, 
      message: 'Please enter a valid phone number', 
      trigger: 'blur' 
    }
  ]
}
```

### Numeric Range Validation
Range validation for number inputs:

```typescript
// Numeric range validation
{
  label: 'Age',
  prop: 'age',
  render: 'input-number',
  rules: [
    { type: 'number', min: 18, max: 65, message: 'Age must be between 18-65', trigger: 'blur' }
  ]
}

// Amount validation
{
  label: 'Price',
  prop: 'price',
  render: 'input-number',
  rules: [
    { required: true, message: 'Price cannot be empty', trigger: 'blur' },
    { type: 'number', min: 0.01, message: 'Price must be greater than 0', trigger: 'blur' }
  ]
}
```

## Advanced Validation Scenarios

### Asynchronous Validation
Supports server-side validation with async validation rules:

```typescript
// Async validation example
{
  label: 'Username',
  prop: 'username',
  render: 'input',
  rules: [
    {
      validator: async (rule: any, value: string) => {
        if (!value) return
        
        // Simulate async validation
        const response = await checkUsernameExists(value)
        if (response.exists) {
          throw new Error('Username already exists')
        }
      },
      trigger: 'blur'
    }
  ]
}

// Debounced async validation
{
  label: 'Company Name',
  prop: 'company',
  render: 'input',
  rules: [
    {
      validator: debounce(async (rule: any, value: string) => {
        if (!value) return
        
        const isValid = await validateCompanyName(value)
        if (!isValid) {
          throw new Error('Company name does not meet the requirements')
        }
      }, 500),
      trigger: 'change'
    }
  ]
}
```

### Conditional Validation
Performs validation based on other field values:

```typescript
// Conditional validation example
const createConditionalRules = () => {
  return [
    {
      validator: (rule: any, value: string) => {
        const formData = searchRef.value?.getSearchForm()
        
        // When 'Enterprise User' is selected, company name is required
        if (formData?.userType === 'enterprise' && !value) {
          throw new Error('Enterprise users must fill in the company name')
        }
      },
      trigger: 'blur'
    }
  ]
}

// Apply conditional validation
{
  label: 'Company Name',
  prop: 'company',
  render: 'input',
  rules: createConditionalRules()
}
```

### Combined Validation
Joint validation across multiple fields:

```typescript
// Password confirmation validation
{
  label: 'Confirm Password',
  prop: 'confirmPassword',
  render: 'input',
  props: { type: 'password' },
  rules: [
    {
      validator: (rule: any, value: string) => {
        const formData = searchRef.value?.getSearchForm()
        
        if (value !== formData?.password) {
          throw new Error('The two entered passwords do not match')
        }
      },
      trigger: 'blur'
    }
  ]
}

// Date range validation
{
  label: 'End Time',
  prop: 'endDate',
  render: 'date-picker',
  rules: [
    {
      validator: (rule: any, value: string) => {
        const formData = searchRef.value?.getSearchForm()
        
        if (value && formData?.startDate && new Date(value) < new Date(formData.startDate)) {
          throw new Error('End time cannot be earlier than start time')
        }
      },
      trigger: 'change'
    }
  ]
}
```

## Usage Scenarios

### 1. User Registration Search
Strict validation for user registration information:

```typescript
const userRegisterSearchItems = [
  {
    label: 'Username',
    prop: 'username',
    render: 'input',
    rules: [
      { required: true, message: 'Username cannot be empty' },
      { min: 3, max: 20, message: 'Username length must be between 3-20 characters' },
      { pattern: /^[a-zA-Z0-9_]+$/, message: 'Username can only contain letters, numbers, and underscores' }
    ]
  },
  {
    label: 'Email',
    prop: 'email',
    render: 'input',
    rules: [
      { required: true, message: 'Email cannot be empty' },
      { type: 'email', message: 'Incorrect email format' }
    ]
  }
]
```

### 2. Financial Data Query
Precise data validation in the financial sector:

```typescript
const financialSearchItems = [
  {
    label: 'Transaction Amount',
    prop: 'amount',
    render: 'input-number',
    rules: [
      { required: true, message: 'Transaction amount cannot be empty' },
      { type: 'number', min: 0.01, max: 999999.99, message: 'Amount range 0.01-999999.99' }
    ]
  },
  {
    label: 'Account Number',
    prop: 'account',
    render: 'input',
    rules: [
      { required: true, message: 'Account number cannot be empty' },
      { pattern: /^\d{16,19}$/, message: 'Account number must be 16-19 digits' }
    ]
  }
]
```

### 3. Order Management Validation
Business rule validation for order queries:

```typescript
const orderSearchItems = [
  {
    label: 'Order Number',
    prop: 'orderNo',
    render: 'input',
    rules: [
      { pattern: /^ORD\d{12}$/, message: 'Order number format: ORD + 12 digits' }
    ]
  },
  {
    label: 'Order Amount',
    prop: 'orderAmount',
    render: 'input-number',
    rules: [
      { type: 'number', min: 1, message: 'Order amount must be greater than 0' }
    ]
  }
]
```

## Key Features

- ✅ Complete validation rule support
- 🔄 Asynchronous validation capability
- 🎯 Conditional and combined validation
- 📝 User-friendly error messages
- ⚡ High-performance validation mechanism
- 🛡 Data security and integrity assurance

## Validation Timing Control

### Trigger Method Configuration
Different validation trigger timings:

```typescript
// Real-time validation
{
  rules: [
    { required: true, message: 'Cannot be empty', trigger: 'change' }
  ]
}

// Blur validation
{
  rules: [
    { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
  ]
}

// Manual validation
{
  rules: [
    { 
      validator: validateAsync, 
      trigger: 'manual'  // Requires manual call to validate
    }
  ]
}
```

### Validation State Management
Getting and controlling validation state:

```typescript
// Validate a single field
const validateField = async (prop: string) => {
  const formRef = searchRef.value?.getMaFormRef()
  try {
    await formRef?.validateField(prop)
    console.log(`${prop} field validation passed`)
  } catch (error) {
    console.log(`${prop} field validation failed:`, error)
  }
}

// Validate the entire form
const validateForm = async () => {
  const formRef = searchRef.value?.getMaFormRef()
  try {
    await formRef?.validate()
    console.log('Form validation passed, can submit search')
    return true
  } catch (error) {
    console.log('Form validation failed:', error)
    return false
  }
}

// Clear validation state
const clearValidation = () => {
  const formRef = searchRef.value?.getMaFormRef()
  formRef?.clearValidate()
}
```

## Best Practices

### 1. User Experience Optimization
- Provide real-time validation feedback
- Use user-friendly error messages
- Support internationalization of error messages

```typescript
// User-friendly error messages
const createFriendlyRules = (fieldName: string) => [
  { 
    required: true, 
    message: `Please enter ${fieldName}`, 
    trigger: 'blur' 
  },
  {
    validator: (rule: any, value: string) => {
      if (value && value.length < 2) {
        throw new Error(`${fieldName} requires at least 2 characters`)
      }
    },
    trigger: 'blur'
  }
]
```

### 2. Performance Optimization
- Use debouncing for frequent validation
- Error handling for async validation
- Validation caching mechanism

```typescript
// Validation cache
const validationCache = new Map()

const cachedValidator = (cacheKey: string, validator: Function) => {
  return async (rule: any, value: string) => {
    if (validationCache.has(cacheKey + value)) {
      const result = validationCache.get(cacheKey + value)
      if (result.error) {
        throw new Error(result.error)
      }
      return
    }
    
    try {
      await validator(rule, value)
      validationCache.set(cacheKey + value, { success: true })
    } catch (error) {
      validationCache.set(cacheKey + value, { error: error.message })
      throw error
    }
  }
}
```

### 3. Maintainability
- Extract common validation rules
- Create validation rule factory functions
- Support dynamic configuration of validation rules

```typescript
// Common validation rules library
const ValidationRules = {
  required: (message?: string) => ({
    required: true,
    message: message || 'This field is required',
    trigger: 'blur'
  }),
  
  email: (message?: string) => ({
    type: 'email',
    message: message || 'Incorrect email format',
    trigger: 'blur'
  }),
  
  phone: (message?: string) => ({
    pattern: /^1[3-9]\d{9}$/,
    message: message || 'Please enter a valid phone number',
    trigger: 'blur'
  }),
  
  range: (min: number, max: number, message?: string) => ({
    type: 'number',
    min,
    max,
    message: message || `Value must be between ${min}-${max}`,
    trigger: 'blur'
  })
}

// Using common rules
{
  label: 'Email',
  prop: 'email',
  render: 'input',
  rules: [
    ValidationRules.required(),
    ValidationRules.email()
  ]
}
```

## Related Links

- [Advanced Search](./advanced-search) - Learn about validation applications in complex search scenarios
- [Table Integration](./table-integration) - Learn about the role of validation before data submission
- [Methods Demo](./methods-demo) - Learn about validation-related component methods