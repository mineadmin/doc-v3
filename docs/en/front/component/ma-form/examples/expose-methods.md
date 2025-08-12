# Exposed Methods

Showcases all API methods exposed by the MaForm component through defineExpose, including loading state control, reactive state management, instance access, and other functionalities.

<DemoPreview dir="demos/ma-form/expose-methods" />

## Features

- **Loading State Control**: Set form loading state
- **Reactive State Management**: Mobile state detection
- **Form Item Management**: Dynamically modify form item configurations
- **Instance Access**: Access underlying Element Plus Form instance for advanced operations

## Detailed Explanation of MaForm Exposed Methods

### State Management Methods

### Loading State Control

```typescript
// Set loading state
formRef.value?.setLoadingState(true)

// Get current loading state
const isLoading = formRef.value?.getLoadingState?.()

// Toggle loading state
const toggleLoading = () => {
  const currentState = formRef.value?.getLoadingState?.() || false
  formRef.value?.setLoadingState(!currentState)
}

// Simulate loading state during submission
const handleSubmit = async () => {
  try {
    formRef.value?.setLoadingState(true)
    
    // Perform form validation
    await formRef.value?.getElFormRef()?.validate()
    
    // Simulate async submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    ElMessage.success('Submission successful')
  } catch (error) {
    ElMessage.error('Submission failed')
  } finally {
    formRef.value?.setLoadingState(false)
  }
}
```

### Reactive State Management

```typescript
// Check mobile state
const isMobile = formRef.value?.isMobileState?.()

// Manually update reactive state (when window resizes)
window.addEventListener('resize', () => {
  formRef.value?.updateResponsiveState?.()
})

// Adjust form layout based on device state
const adjustFormLayout = () => {
  const isMobile = formRef.value?.isMobileState?.()
  if (isMobile) {
    // Use single-column layout for mobile
    console.log('Mobile detected, using responsive layout')
  } else {
    // Use multi-column layout for desktop
    console.log('Desktop detected, using standard layout')
  }
}
```

## Element Plus Form Instance Access

### Access Native Form Instance

One of MaForm's most important exposed methods is `getElFormRef()`, which allows accessing the underlying Element Plus Form instance to use all native form methods:

```typescript
// Get Element Plus el-form instance
const getElFormInstance = () => {
  const elFormInstance = formRef.value?.getElFormRef()
  if (elFormInstance) {
    console.log('Element Plus form instance:', elFormInstance)
    return elFormInstance
  } else {
    console.warn('Form instance not initialized')
    return null
  }
}
```

### Form Validation via Instance

The instance obtained through `getElFormRef()` can call all native validation methods of Element Plus forms:

```typescript
// Validate entire form
const validateForm = async () => {
  try {
    const elFormRef = formRef.value?.getElFormRef()
    if (!elFormRef) {
      throw new Error('Form instance not found')
    }
    
    const isValid = await elFormRef.validate()
    if (isValid) {
      ElMessage.success('Form validation passed')
      return true
    }
  } catch (error) {
    ElMessage.error('Form validation failed')
    console.error('Validation error:', error)
    return false
  }
}

// Validate single field
const validateSingleField = async (prop: string) => {
  try {
    const elFormRef = formRef.value?.getElFormRef()
    if (!elFormRef) return false
    
    await elFormRef.validateField(prop)
    console.log(`Field ${prop} validation passed`)
    return true
  } catch (error) {
    console.error(`Field ${prop} validation failed:`, error)
    return false
  }
}

// Batch validate specified fields
const validateMultipleFields = async (props: string[]) => {
  const elFormRef = formRef.value?.getElFormRef()
  if (!elFormRef) return false
  
  try {
    const results = await Promise.allSettled(
      props.map(prop => elFormRef.validateField(prop))
    )
    
    const failedCount = results.filter(r => r.status === 'rejected').length
    const successCount = results.length - failedCount
    
    console.log(`Validation complete, ${successCount}/${results.length} fields passed`)
    return failedCount === 0
  } catch (error) {
    console.error('Batch validation failed:', error)
    return false
  }
}
```

### Form Reset via Instance

```typescript
// Reset form validation state
const resetValidation = () => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    elFormRef.resetFields()
    ElMessage.info('Form reset')
  }
}

// Reset specified fields
const resetSpecificFields = (props: string[]) => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    elFormRef.resetFields(props)
    ElMessage.info(`Reset ${props.join(', ')} fields`)
  }
}

// Clear validation errors
const clearValidationErrors = () => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    elFormRef.clearValidate()
    ElMessage.info('Validation errors cleared')
  }
}

// Clear specified field errors  
const clearFieldErrors = (props: string[]) => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    elFormRef.clearValidate(props)
    console.log(`Cleared validation errors for ${props.join(', ')} fields`)
  }
}
```

### Advanced Instance Operations

```typescript
// Scroll to specified field
const scrollToField = (prop: string) => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    elFormRef.scrollToField(prop)
    console.log(`Scrolled to field: ${prop}`)
  }
}

// Get field instance
const getFieldInstance = (prop: string) => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    // Get field instance via DOM query
    const fieldElement = document.querySelector(`[data-field="${prop}"]`)
    return fieldElement
  }
  return null
}
```

## Practical Application Scenarios

### Form Submission Flow

Combining all exposed methods to implement a complete form submission flow:

```typescript
const handleFormSubmit = async () => {
  try {
    // 1. Set loading state
    formRef.value?.setLoadingState(true)
    
    // 2. Perform form validation
    const elFormRef = formRef.value?.getElFormRef()
    if (!elFormRef) {
      throw new Error('Form instance not initialized')
    }
    
    await elFormRef.validate()
    
    // 3. Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 4. Handle successful submission
    ElMessage.success('Submission successful')
    
    // 5. Reset form (optional)
    elFormRef.resetFields()
    
  } catch (error) {
    // Handle validation failure or submission error
    ElMessage.error('Submission failed, please check the form')
    console.error('Submission error:', error)
    
    // Scroll to first error field
    const firstErrorField = document.querySelector('.el-form-item.is-error')
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth' })
    }
  } finally {
    // 6. Clear loading state
    formRef.value?.setLoadingState(false)
  }
}
```

### Responsive Layout Adaptation

Utilize reactive state management for optimal experience across devices:

```typescript
const handleResponsiveLayout = () => {
  const isMobile = formRef.value?.isMobileState?.()
  
  if (isMobile) {
    // Mobile optimization: Show compact layout hint
    ElMessage({
      message: 'Switched to mobile layout mode',
      type: 'info',
      duration: 2000
    })
    
    // Logic that may require special handling on mobile
    console.log('Mobile mode detected, using single-column layout')
  } else {
    // Desktop layout
    console.log('Desktop mode detected, using multi-column layout')
  }
}

// Listen for window resize
window.addEventListener('resize', () => {
  formRef.value?.updateResponsiveState?.()
  handleResponsiveLayout()
})
```

### Error Handling and UX Optimization

```typescript
// Smart form operation handler
const smartFormHandler = {
  // Safe form validation
  safeValidate: async (showLoading = true) => {
    try {
      if (showLoading) {
        formRef.value?.setLoadingState(true)
      }
      
      const elFormRef = formRef.value?.getElFormRef()
      if (!elFormRef) {
        throw new Error('Form instance not ready')
      }
      
      const isValid = await elFormRef.validate()
      return { success: true, valid: isValid }
    } catch (error) {
      return { success: false, error, valid: false }
    } finally {
      if (showLoading) {
        formRef.value?.setLoadingState(false)
      }
    }
  },
  
  // Smart reset
  smartReset: (clearValidation = true) => {
    const elFormRef = formRef.value?.getElFormRef()
    if (elFormRef) {
      elFormRef.resetFields()
      if (clearValidation) {
        elFormRef.clearValidate()
      }
      ElMessage.info('Form reset')
    }
  },
  
  // Get current status info
  getStatus: () => {
    return {
      loading: formRef.value?.getLoadingState?.() || false,
      mobile: formRef.value?.isMobileState?.() || false,
      formReady: !!formRef.value?.getElFormRef()
    }
  }
}
```

### Debugging and Development Tools

```typescript
// Development debugging tools
const devTools = {
  // Print status of all exposed methods
  debug: () => {
    const status = {
      loadingState: formRef.value?.getLoadingState?.(),
      mobileState: formRef.value?.isMobileState?.(),
      formInstance: !!formRef.value?.getElFormRef(),
      methods: [
        'setLoadingState',
        'getLoadingState', 
        'getElFormRef',
        'isMobileState',
        'updateResponsiveState'
      ]
    }
    
    console.group('🔧 MaForm Debug Info')
    console.log('Status info:', status)
    console.log('Available methods:', Object.keys(formRef.value || {}))
    console.groupEnd()
    
    return status
  },
  
  // Test all methods
  testMethods: async () => {
    console.log('📋 Testing MaForm exposed methods...')
    
    // Test loading state
    const initialLoading = formRef.value?.getLoadingState?.()
    console.log('Initial loading state:', initialLoading)
    
    formRef.value?.setLoadingState(true)
    console.log('Set loading state to true')
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    formRef.value?.setLoadingState(false)
    console.log('Set loading state to false')
    
    // Test responsive state
    const isMobile = formRef.value?.isMobileState?.()
    console.log('Current mobile state:', isMobile)
    
    formRef.value?.updateResponsiveState?.()
    console.log('Responsive state updated')
    
    // Test form instance
    const elFormRef = formRef.value?.getElFormRef()
    console.log('Form instance available:', !!elFormRef)
    
    console.log('✅ All method tests completed')
  }
}
```

## API Method Summary

### Methods Exposed by MaForm

| Method | Parameters | Return Value | Description |
|-------|-----|-------|-----|
| `setLoadingState` | `loading: boolean` | `void` | Set global loading state of form |
| `setOptions` | `opts: MaFormOptions` | `void` | Set form configuration options |
| `getOptions` | - | `MaFormOptions` | Get current form configuration |
| `setItems` | `items: MaFormItem[]` | `void` | Set form item array |
| `getItems` | - | `MaFormItem[]` | Get current form items array |
| `appendItem` | `item: MaFormItem` | `void` | Add a form item |
| `removeItem` | `prop: string` | `void` | Remove form item by prop |
| `getItemByProp` | `prop: string` | `MaFormItem \| null` | Get form item by prop |
| `getElFormRef` | - | `FormInstance \| undefined` | Get Element Plus Form instance |
| `isMobileState` | - | `boolean` | Check if currently in mobile state |

### Unavailable Methods

The following methods do not exist in the current version:

| Method | Description |
|-------|----- |
| `getLoadingState` | Get current loading state (please maintain loading state yourself) |
| `updateResponsiveState` | Manually trigger responsive state update (form handles this automatically) |

### Element Plus Form Instance Methods

The instance obtained via `getElFormRef()` supports these common methods:

| Method | Parameters | Return Value | Description |
|-------|-----|-------|-----|
| `validate` | `callback?: Function` | `Promise<boolean>` | Validate entire form |
| `validateField` | `props: string \| string[]` | `Promise<void>` | Validate specified fields |
| `resetFields` | `props?: string \| string[]` | `void` | Reset field values and validation state |
| `clearValidate` | `props?: string \| string[]` | `void` | Clear validation state |
| `scrollToField` | `prop: string` | `void` | Scroll to specified field |

## Notes

1. **Safe Calls**: Use optional chaining (`?.`) to safely call methods and avoid errors when component is not mounted
2. **Timing**: Ensure methods are called after component is mounted
3. **Error Handling**: Implement proper error handling for async methods (like `validate`)
4. **Type Safety**: When using TypeScript, import correct type definitions

## Related Links

- [MaForm Basic Usage](/en/front/component/ma-form/examples/basic-usage)
- [Form Validation Examples](/en/front/component/ma-form/examples/dynamic-validation)
- [Loading State Demo](/en/front/component/ma-form/examples/loading-states)
- [Element Plus Form Documentation](https://element-plus.org/zh-CN/component/form.html)