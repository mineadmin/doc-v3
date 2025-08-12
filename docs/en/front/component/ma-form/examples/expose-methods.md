# Exposed Methods

Showcases all API methods exposed by the MaForm component via defineExpose, including state management, configuration management, form item management, validation, and other functionalities.

<DemoPreview dir="demos/ma-form/expose-methods" />

## Features

- **State Management**: Loading state, responsive state control  
- **Configuration Management**: Dynamic modification of form configuration options  
- **Form Item Management**: CRUD operations for form item configurations  
- **Validation Control**: Form and field validation management  
- **Data Operations**: Reading and setting form data  
- **Instance Access**: Access to underlying Element Plus instances  

## State Management Methods

### Loading State Control

```typescript
// Set loading state
formRef.value.setLoadingState(true)

// Get current loading state
const isLoading = formRef.value.getLoadingState()

// Toggle loading state
const toggleLoading = () => {
  const currentState = formRef.value.getLoadingState()
  formRef.value.setLoadingState(!currentState)
}
```

### Responsive State Management

```typescript
// Check mobile state
const isMobile = formRef.value.isMobileState()

// Manually update responsive state (when window size changes)
window.addEventListener('resize', () => {
  formRef.value.updateResponsiveState()
})
```

## Configuration Management Methods

### Set Form Configuration

```typescript
// Completely replace configuration
formRef.value.setOptions({
  layout: 'grid',
  loading: true,
  labelWidth: '120px'
})

// Get current configuration
const currentOptions = formRef.value.getOptions()
console.log('Current config:', currentOptions)

// Modify configuration via update function
formRef.value.updateOptions(options => ({
  ...options,
  layout: options.layout === 'flex' ? 'grid' : 'flex',
  loading: false
}))
```

### Batch Configuration Updates

```typescript
// Batch update configuration based on condition
const updateConfigByCondition = (condition: string) => {
  const updates = {
    mobile: {
      layout: 'grid',
      responsiveConfig: { mobileSingleColumn: true }
    },
    desktop: {
      layout: 'flex', 
      flex: { gutter: 20 }
    }
  }
  
  formRef.value.updateOptions(options => ({
    ...options,
    ...updates[condition]
  }))
}
```

## Form Item Management Methods

### Add Form Items

```typescript
// Append item at end
const appendNewField = () => {
  formRef.value.appendItem({
    label: `New Field ${Date.now()}`,
    prop: `field_${Date.now()}`,
    render: 'input',
    renderProps: {
      placeholder: 'Dynamically added field'
    }
  })
}

// Insert item at specified position
const insertField = (index: number) => {
  formRef.value.appendItem({
    label: 'Inserted Field',
    prop: `inserted_field_${Date.now()}`,
    render: 'input'
  }, index)
}

// Prepend item at beginning
const prependField = () => {
  formRef.value.prependItem({
    label: 'First Field',
    prop: `first_field_${Date.now()}`,
    render: 'input',
    cols: { span: 24 }
  })
}
```

### Remove Form Items

```typescript
// Remove item by prop
const removeField = (prop: string) => {
  const success = formRef.value.removeItem(prop)
  if (success) {
    ElMessage.success(`Field ${prop} removed successfully`)
  } else {
    ElMessage.error(`Field ${prop} does not exist`)
  }
}

// Batch remove items
const removeMultipleFields = (props: string[]) => {
  const results = props.map(prop => ({
    prop,
    success: formRef.value.removeItem(prop)
  }))
  
  const successCount = results.filter(r => r.success).length
  ElMessage.info(`Successfully removed ${successCount} fields`)
}
```

### Update Form Items

```typescript
// Update single item
const updateField = (prop: string, updates: Partial<MaFormItem>) => {
  const success = formRef.value.updateItem(prop, updates)
  if (success) {
    ElMessage.success('Field updated successfully')
  }
}

// Toggle field disabled state
const toggleFieldDisabled = (prop: string) => {
  const item = formRef.value.getItemByProp(prop)
  if (item) {
    formRef.value.updateItem(prop, {
      renderProps: {
        ...item.renderProps,
        disabled: !item.renderProps?.disabled
      }
    })
  }
}

// Batch update fields
const updateMultipleFields = (updates: Record<string, Partial<MaFormItem>>) => {
  Object.entries(updates).forEach(([prop, update]) => {
    formRef.value.updateItem(prop, update)
  })
}
```

### Replace Form Items

```typescript
// Completely replace form items array
const replaceAllItems = () => {
  const newItems = [
    {
      label: 'New Username',
      prop: 'newUsername',
      render: 'input'
    },
    {
      label: 'New Email',
      prop: 'newEmail', 
      render: 'input',
      renderProps: { type: 'email' }
    }
  ]
  
  formRef.value.setItems(newItems)
}

// Get all current form items
const getAllItems = () => {
  const items = formRef.value.getItems()
  console.log('Current form items:', items)
  return items
}
```

## Form Item Query Methods

### Single Query

```typescript
// Find item by prop
const findFieldByProp = (prop: string) => {
  const item = formRef.value.getItemByProp(prop)
  if (item) {
    console.log(`Found field ${prop}:`, item)
  } else {
    console.log(`Field ${prop} does not exist`)
  }
  return item
}
```

### Conditional Query

```typescript
// Find all hidden fields
const findHiddenFields = () => {
  const hiddenFields = formRef.value.getItemsByCondition(item => 
    item.hide === true || (typeof item.hide === 'function' && item.hide(formData.value, item))
  )
  console.log('Hidden fields:', hiddenFields)
  return hiddenFields
}

// Find fields by render type
const findFieldsByRender = (renderType: string) => {
  return formRef.value.getItemsByCondition(item => item.render === renderType)
}

// Find required fields
const findRequiredFields = () => {
  return formRef.value.getItemsByCondition(item => 
    item.itemProps?.rules?.some(rule => rule.required === true)
  )
}
```

### Visibility Query

```typescript
// Get all visible fields
const getVisibleFields = () => {
  const visibleItems = formRef.value.getVisibleItems()
  console.log('Visible fields count:', visibleItems.length)
  return visibleItems
}

// Get field statistics
const getFieldStats = () => {
  const allItems = formRef.value.getItems()
  const visibleItems = formRef.value.getVisibleItems()
  
  return {
    total: allItems.length,
    visible: visibleItems.length,
    hidden: allItems.length - visibleItems.length
  }
}
```

## Validation Control Methods

### Form Validation

```typescript
// Validate entire form
const validateForm = async () => {
  try {
    const isValid = await formRef.value.validate()
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

// Form validation with error handling
const validateFormWithErrorHandling = async () => {
  const loadingInstance = ElLoading.service({ text: 'Validating...' })
  
  try {
    const isValid = await formRef.value.validate()
    loadingInstance.close()
    
    if (isValid) {
      ElMessage.success('Validation passed, ready to submit')
      return true
    }
  } catch (error) {
    loadingInstance.close()
    ElMessage.error('Please check form inputs')
    
    // Scroll to first error field
    const firstErrorField = document.querySelector('.el-form-item.is-error')
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth' })
    }
    
    return false
  }
}
```

### Field Validation

```typescript
// Validate single field
const validateSingleField = async (prop: string) => {
  try {
    const isValid = await formRef.value.validateField(prop)
    console.log(`Field ${prop} validation result:`, isValid)
    return isValid
  } catch (error) {
    console.error(`Field ${prop} validation failed:`, error)
    return false
  }
}

// Batch validate specified fields
const validateMultipleFields = async (props: string[]) => {
  const results = await Promise.allSettled(
    props.map(async prop => ({
      prop,
      valid: await formRef.value.validateField(prop)
    }))
  )
  
  const validResults = results.filter(r => r.status === 'fulfilled')
  const invalidCount = validResults.filter(r => !r.value.valid).length
  
  console.log(`Validation complete, ${validResults.length - invalidCount}/${validResults.length} fields passed`)
  return invalidCount === 0
}
```

### Validation State Management

```typescript
// Reset form validation state
const resetValidation = () => {
  formRef.value.resetFields()
  ElMessage.info('Form reset')
}

// Reset specified fields
const resetSpecificFields = (props: string[]) => {
  formRef.value.resetFields(props)
  ElMessage.info(`Reset fields: ${props.join(', ')}`)
}

// Clear validation errors
const clearValidationErrors = () => {
  formRef.value.clearValidate()
  ElMessage.info('Validation errors cleared')
}

// Clear specified field errors  
const clearFieldErrors = (props: string[]) => {
  formRef.value.clearValidate(props)
}
```

## Data Operation Methods

### Data Retrieval

```typescript
// Get form data
const getFormData = () => {
  const data = formRef.value.getFormData()
  console.log('Current form data:', data)
  return data
}

// Get specified field value
const getFieldValue = (prop: string) => {
  const data = formRef.value.getFormData()
  return data[prop]
}

// Get changed data
const getChangedData = () => {
  const currentData = formRef.value.getFormData()
  const initialData = initialFormData.value
  
  const changes = {}
  Object.keys(currentData).forEach(key => {
    if (currentData[key] !== initialData[key]) {
      changes[key] = {
        from: initialData[key],
        to: currentData[key]
      }
    }
  })
  
  return changes
}
```

### Data Setting

```typescript
// Set form data
const setFormData = (data: Record<string, any>) => {
  formRef.value.setFormData(data)
  ElMessage.success('Data set successfully')
}

// Batch set field values
const setMultipleFields = (fieldValues: Record<string, any>) => {
  const currentData = formRef.value.getFormData()
  formRef.value.setFormData({
    ...currentData,
    ...fieldValues
  })
}

// Reset to initial data
const resetToInitialData = () => {
  formRef.value.resetFormData()
  ElMessage.info('Data reset to initial state')
}
```

## Element Plus Instance Access

### Get Native Instance

```typescript
// Get Element Plus el-form instance
const getElFormInstance = () => {
  const elFormInstance = formRef.value.getElFormRef()
  if (elFormInstance) {
    console.log('Element Plus form instance:', elFormInstance)
    // Can call native el-form methods
    return elFormInstance
  }
}

// Use native instance methods
const useElFormMethods = () => {
  const elForm = formRef.value.getElFormRef()
  if (elForm) {
    // Call native el-form methods
    elForm.scrollToField('username')
    elForm.clearValidate(['email'])
  }
}
```

## Comprehensive Usage Examples

### Dynamic Form Management

```typescript
const formManager = {
  // Add field group
  addFieldGroup: (groupName: string, fields: MaFormItem[]) => {
    fields.forEach((field, index) => {
      field.prop = `${groupName}.${field.prop}`
      formRef.value.appendItem(field, index)
    })
  },
  
  // Remove field group
  removeFieldGroup: (groupName: string) => {
    const items = formRef.value.getItems()
    const toRemove = items
      .filter(item => item.prop?.startsWith(`${groupName}.`))
      .map(item => item.prop)
    
    toRemove.forEach(prop => formRef.value.removeItem(prop))
  },
  
  // Toggle field state
  toggleFieldState: (prop: string, state: 'disabled' | 'hidden' | 'readonly') => {
    const updates = {
      disabled: { renderProps: { disabled: true } },
      hidden: { hide: true },
      readonly: { renderProps: { readonly: true } }
    }
    
    formRef.value.updateItem(prop, updates[state])
  },
  
  // Switch form mode
  switchMode: (mode: 'create' | 'edit' | 'view') => {
    const configs = {
      create: { disabled: false, loading: false },
      edit: { disabled: false, loading: false },
      view: { disabled: true, loading: false }
    }
    
    formRef.value.updateOptions(options => ({
      ...options,
      ...configs[mode]
    }))
  }
}
```

## Related Links

- [Exposed Methods Details](/en/front/component/ma-form#暴露方法-expose)
- [MaFormExpose Type Definition](/en/front/component/ma-form#maformexpose)
- [Form Validation Methods](/en/front/component/ma-form#表单验证)