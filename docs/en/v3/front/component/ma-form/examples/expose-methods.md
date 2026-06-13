# Exposure Methods

Shows all API methods exposed by the MaForm component through `defineExpose`, including loading state control, reactive state management, instance access, and other features.

<DemoPreview dir="demos/ma-form/expose-methods" />

## Features

- **Loading State Control**: Set the form's loading state
- **Reactive State Management**: Mobile device state detection
- **Form Item Management**: Dynamically modify form item configurations
- **Instance Access**: Obtain the underlying Element Plus Form instance for advanced operations

## MaForm Exposure Methods Explained

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
    
    // Execute form validation
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
// Check if it's a mobile state
const isMobile = formRef.value?.isMobileState?.()

// Manually update responsive state (when window is resized)
window.addEventListener('resize', () => {
  formRef.value?.updateResponsiveState?.()
})

// Adjust form layout based on device state
const adjustFormLayout = () => {
  const isMobile = formRef.value?.isMobileState?.()
  if (isMobile) {
    // Single column layout for mobile
    console.log('Currently on mobile, using responsive layout')
  } else {
    // Multi-column layout for desktop
    console.log('Currently on desktop, using standard layout')
  }
}
```

## Element Plus Form Instance Access

### Getting the Native Form Instance

One of the most important exposure methods of MaForm is `getElFormRef()`, which allows you to access the underlying Element Plus Form instance and use all native form methods:

```typescript
// Get Element Plus el-form instance
const getElFormInstance = () => {
  const elFormInstance = formRef.value?.getElFormRef()
  if (elFormInstance) {
    console.log('Element Plus form instance:', elFormInstance)
    return elFormInstance
  } else {
    console.warn('Form instance not yet initialized')
    return null
  }
}
```

### Form Validation via Instance

The instance obtained through `getElFormRef()` can call all native validation methods of Element Plus forms:

```typescript
// Validate the entire form
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

// Validate a single field
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

// Batch validate specific fields
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
    ElMessage.info('Form has been reset')
  }
}

// Reset specific fields
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

// Clear validation errors for specific fields
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
// Scroll to a specific field
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

### Form Submission Process

Combining all exposed methods, we can implement a complete form submission process:

```typescript
const handleFormSubmit = async () => {
  try {
    // 1. Set loading state
    formRef.value?.setLoadingState(true)
    
    // 2. Execute form validation
    const elFormRef = formRef.value?.getElFormRef()
    if (!elFormRef) {
      throw new Error('Form instance not initialized')
    }
    
    await elFormRef.validate()
    
    // 3. Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 4. Submission success handling
    ElMessage.success('Submission successful')
    
    // 5. Reset form (optional)
    elFormRef.resetFields()
    
  } catch (error) {
    // Validation failure or submission error handling
    ElMessage.error('Submission failed, please check the form')
    console.error('Submission error:', error)
    
    // Scroll to the first error field
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

Utilize reactive state management to achieve the best experience across different devices:

```typescript
const handleResponsiveLayout = () => {
  const isMobile = formRef.value?.isMobileState?.()
  
  if (isMobile) {
    // Mobile optimization: show compact layout prompt
    ElMessage({
      message: 'Switched to mobile layout mode',
      type: 'info',
      duration: 2000
    })
    
    // Logic for mobile-specific handling
    console.log('Currently in mobile mode, using single column layout')
  } else {
    // Desktop layout
    console.log('Currently in desktop mode, using multi-column layout')
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
      ElMessage.info('Form has been reset')
    }
  },
  
  // Get current status information
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
    
    // Test reactive state
    const isMobile = formRef.value?.isMobileState?.()
    console.log('Current mobile state:', isMobile)
    
    formRef.value?.updateResponsiveState?.()
    console.log('Responsive state updated')
    
    // Test form instance
    const elFormRef = formRef.value?.getElFormRef()
    console.log('Form instance available:', !!elFormRef)
    
    console.log('✅ All methods tested')
  }
}
```

## API Method Summary

### Methods Exposed by MaForm

| Method | Parameters | Return Value | Description |
|-------|-----|-------|-----|
| `setLoadingState` | `loading: boolean` | `void` | Sets the global loading state of the form |
| `setOptions` | `opts: MaFormOptions` | `void` | Sets form configuration options |
| `getOptions` | - | `MaFormOptions` | Gets current form configuration |
| `setItems` | `items: MaFormItem[]` | `void` | Sets the form items array |
| `getItems` | - | `MaFormItem[]` | Gets current form items array |
| `appendItem` | `item: MaFormItem` | `void` | Adds a form item |
| `removeItem` | `prop: string` | `void` | Removes a form item by prop |
| `getItemByProp` | `prop: string` | `MaFormItem \| null` | Gets a form item by prop |
| `getElFormRef` | - | `FormInstance \| undefined` | Gets the Element Plus Form instance |
| `isMobileState` | - | `boolean` | Checks if currently in mobile state |

### Unavailable Methods

The following methods do not exist in the current version:

| Method | Description |
|-------|----- |
| `getLoadingState` | Gets the current loading state (maintain loading state yourself) |
| `updateResponsiveState` | Manually triggers reactive state update (form handles this automatically) |

### Element Plus Form Instance Methods

The instance obtained through `getElFormRef()` supports the following commonly used methods:

| Method | Parameters | Return Value | Description |
|-------|-----|-------|-----|
| `validate` | `callback?: Function` | `Promise<boolean>` | Validates the entire form |
| `validateField` | `props: string \| string[]` | `Promise<void>` | Validates specified fields |
| `resetFields` | `props?: string \| string[]` | `void` | Resets field values and validation state |
| `clearValidate` | `props?: string \| string[]` | `void` | Clears validation state |
| `scrollToField` | `prop: string` | `void` | Scrolls to a specified field |

## Important Notes

1. **Safe Invocation**: Use the optional chaining operator (`?.`) to safely call methods, avoiding errors when the component is not mounted
2. **Timing**: Ensure methods are called after the component has been mounted
3. **Error Handling**: Handle errors properly for asynchronous methods (e.g., `validate`)
4. **Type Safety**: Import correct type definitions when using with TypeScript

## Related Links

- [MaForm Basic Usage](/v3/front/component/ma-form/examples/basic-usage)
- [Form Validation Examples](/v3/front/component/ma-form/examples/dynamic-validation)
- [Loading State Demo](/v3/front/component/ma-form/examples/loading-states)
- [Element Plus Form Documentation](https://element-plus.org/en-US/component/form.html)