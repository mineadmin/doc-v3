# Dynamic Validation

Demonstrates MaForm's dynamic validation capabilities, including custom synchronous validation, asynchronous validation, linked validation, and complex validation rules.

<DemoPreview dir="demos/ma-form/dynamic-validation" />

## Features

- **Multi-level Validation**: Supports Element Plus native rules, custom synchronous validation, and asynchronous validation
- **Linked Validation**: Interdependent validation logic between fields
- **Real-time Validation**: Instant validation feedback during input
- **Asynchronous Validation**: Supports server-side validation (e.g., uniqueness checks)
- **Custom Error Messages**: Flexible error message customization

## Validation Levels

### 1. Element Plus Native Validation Rules

```typescript
{
  label: 'Username',
  prop: 'username',
  render: 'input',
  itemProps: {
    rules: [
      { required: true, message: 'Please enter username', trigger: 'blur' },
      { min: 3, max: 15, message: 'Length should be 3 to 15 characters', trigger: 'blur' },
      { pattern: /^[a-zA-Z0-9_]+$/, message: 'Only letters, numbers and underscores allowed', trigger: 'blur' }
    ]
  }
}
```

### 2. Custom Synchronous Validation

```typescript
{
  label: 'Confirm Password',
  prop: 'confirmPassword',
  render: 'input',
  renderProps: {
    type: 'password',
    showPassword: true
  },
  customValidator: (rule, value, callback) => {
    if (!value) {
      callback(new Error('Please confirm password'))
    } else if (value !== formData.password) {
      callback(new Error('Passwords do not match'))
    } else {
      callback()
    }
  }
}
```

### 3. Asynchronous Validation

```typescript
{
  label: 'Email Address',
  prop: 'email', 
  render: 'input',
  renderProps: {
    type: 'email'
  },
  asyncValidator: async (rule, value) => {
    if (!value) {
      throw new Error('Please enter email address')
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      throw new Error('Please enter a valid email address')
    }
    
    // Asynchronous email existence check
    try {
      const exists = await checkEmailExists(value)
      if (exists) {
        throw new Error('This email is already registered')
      }
    } catch (error) {
      if (error.message.includes('already registered')) {
        throw error
      }
      throw new Error('Email verification failed, please try again later')
    }
  }
}
```

## Complex Validation Scenarios

### 1. Linked Validation

```typescript
const linkedValidationFields = [
  {
    label: 'Start Date',
    prop: 'startDate',
    render: 'datePicker',
    renderProps: {
      type: 'date',
      placeholder: 'Select start date'
    },
    customValidator: (rule, value, callback) => {
      if (!value) {
        callback(new Error('Please select start date'))
        return
      }
      
      const endDate = formData.endDate
      if (endDate && new Date(value) >= new Date(endDate)) {
        callback(new Error('Start date must be earlier than end date'))
      } else {
        callback()
        // Trigger end date revalidation
        nextTick(() => {
          if (endDate) {
            formRef.value?.validateField('endDate')
          }
        })
      }
    }
  },
  {
    label: 'End Date',
    prop: 'endDate',
    render: 'datePicker',
    renderProps: {
      type: 'date', 
      placeholder: 'Select end date'
    },
    customValidator: (rule, value, callback) => {
      if (!value) {
        callback(new Error('Please select end date'))
        return
      }
      
      const startDate = formData.startDate
      if (startDate && new Date(value) <= new Date(startDate)) {
        callback(new Error('End date must be later than start date'))
      } else {
        callback()
        // Trigger start date revalidation
        nextTick(() => {
          if (startDate) {
            formRef.value?.validateField('startDate')
          }
        })
      }
    }
  }
]
```

### 2. Conditional Validation

```typescript
{
  label: 'Phone Number',
  prop: 'phoneNumber',
  render: 'input',
  customValidator: (rule, value, callback) => {
    // Determine if required based on user type
    const userType = formData.userType
    const isRequired = userType === 'individual'
    
    if (isRequired && !value) {
      callback(new Error('Individual users must provide phone number'))
      return
    }
    
    if (value && !/^1[3-9]\d{9}$/.test(value)) {
      callback(new Error('Please enter a valid phone number'))
      return  
    }
    
    callback()
  },
  dependencies: ['userType']
}
```

### 3. Business Logic Validation

```typescript
{
  label: 'Product Price',
  prop: 'price',
  render: 'inputNumber',
  renderProps: {
    min: 0,
    precision: 2,
    controlsPosition: 'right'
  },
  customValidator: (rule, value, callback) => {
    if (value === null || value === undefined) {
      callback(new Error('Please enter product price'))
      return
    }
    
    if (value <= 0) {
      callback(new Error('Product price must be greater than 0'))
      return
    }
    
    // Business rule: VIP product price cannot be below 100
    const isVipProduct = formData.isVipProduct
    if (isVipProduct && value < 100) {
      callback(new Error('VIP product price cannot be below 100'))
      return
    }
    
    // Business rule: Promotional product price cannot exceed 1000
    const isPromotional = formData.isPromotional  
    if (isPromotional && value > 1000) {
      callback(new Error('Promotional product price cannot exceed 1000'))
      return
    }
    
    callback()
  },
  dependencies: ['isVipProduct', 'isPromotional']
}
```

## Asynchronous Validation Best Practices

### 1. Debounce Handling

```typescript
// Create debounce function
const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Debounced asynchronous validation
const debouncedUsernameCheck = debounce(async (username) => {
  return await checkUsernameExists(username)
}, 500)

{
  label: 'Username',
  prop: 'username',
  render: 'input',
  asyncValidator: async (rule, value) => {
    if (!value) {
      throw new Error('Please enter username')
    }
    
    const exists = await debouncedUsernameCheck(value)
    if (exists) {
      throw new Error('Username already exists')
    }
  }
}
```

### 2. Loading State Indication

```typescript
{
  label: 'Username',
  prop: 'username', 
  render: 'input',
  renderProps: {
    loading: false  // Dynamically updated via updateItem
  },
  asyncValidator: async (rule, value) => {
    if (!value) {
      throw new Error('Please enter username')
    }
    
    // Show loading state
    formRef.value?.updateItem('username', {
      renderProps: { loading: true }
    })
    
    try {
      const exists = await checkUsernameExists(value)
      if (exists) {
        throw new Error('Username already exists')
      }
    } finally {
      // Hide loading state
      formRef.value?.updateItem('username', {
        renderProps: { loading: false }
      })
    }
  }
}
```

### 3. Error Handling

```typescript
{
  label: 'Email',
  prop: 'email',
  render: 'input',
  asyncValidator: async (rule, value) => {
    try {
      const response = await fetch(`/api/check-email?email=${value}`)
      
      if (!response.ok) {
        // HTTP error handling
        if (response.status === 429) {
          throw new Error('Too many requests, please try again later')
        }
        throw new Error('Verification service temporarily unavailable')
      }
      
      const result = await response.json()
      if (result.exists) {
        throw new Error('This email is already registered')
      }
      
    } catch (error) {
      if (error.name === 'TypeError') {
        // Network error
        throw new Error('Network connection failed, please check your settings')
      }
      throw error
    }
  }
}
```

## Validation Timing Control

### 1. Trigger Configuration

```typescript
{
  label: 'Real-time Validation Field',
  prop: 'realtime',
  render: 'input',
  itemProps: {
    rules: [
      { required: true, message: 'This field is required', trigger: 'change' }  // Validate during input
    ]
  }
}

{
  label: 'Blur Validation Field', 
  prop: 'onblur',
  render: 'input',
  itemProps: {
    rules: [
      { required: true, message: 'This field is required', trigger: 'blur' }   // Validate on blur
    ]
  }
}
```

### 2. Manual Validation Control

```typescript
// Validate specific field
const validateSingleField = async (prop) => {
  try {
    const isValid = await formRef.value?.validateField(prop)
    console.log(`Field ${prop} validation result:`, isValid)
  } catch (error) {
    console.error(`Field ${prop} validation failed:`, error)
  }
}

// Validate entire form
const validateForm = async () => {
  try {
    const isValid = await formRef.value?.validate()
    if (isValid) {
      console.log('Form validation passed')
    }
  } catch (error) {
    console.error('Form validation failed:', error)
  }
}
```

## Related Links

- [MaFormItem Validation Configuration](/en/front/component/ma-form#validation-configuration)
- [Advanced Features - Dynamic Validation](/en/front/component/ma-form#dynamic-validation)
- [Exposed Methods - Form Validation](/en/front/component/ma-form#form-validation)