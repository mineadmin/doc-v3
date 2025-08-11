# 暴露方法

展示 MaForm 組件通過 defineExpose 暴露的所有 API 方法，包括狀態管理、配置管理、表單項管理、驗證等功能。

<DemoPreview dir="demos/ma-form/expose-methods" />

## 功能特性

- **狀態管理**：加載狀態、響應式狀態控制
- **配置管理**：動態修改表單配置選項
- **表單項管理**：增刪改查表單項配置
- **驗證控制**：表單和字段驗證管理
- **數據操作**：表單數據的讀取和設置
- **實例訪問**：獲取底層 Element Plus 實例

## 狀態管理方法

### 加載狀態控制

```typescript
// 設置加載狀態
formRef.value.setLoadingState(true)

// 獲取當前加載狀態
const isLoading = formRef.value.getLoadingState()

// 切換加載狀態
const toggleLoading = () => {
  const currentState = formRef.value.getLoadingState()
  formRef.value.setLoadingState(!currentState)
}
```

### 響應式狀態管理

```typescript
// 檢查是否為移動端狀態
const isMobile = formRef.value.isMobileState()

// 手動更新響應式狀態（窗口大小改變時）
window.addEventListener('resize', () => {
  formRef.value.updateResponsiveState()
})
```

## 配置管理方法

### 設置表單配置

```typescript
// 完全替換配置
formRef.value.setOptions({
  layout: 'grid',
  loading: true,
  labelWidth: '120px'
})

// 獲取當前配置
const currentOptions = formRef.value.getOptions()
console.log('當前配置:', currentOptions)

// 通過更新函數修改配置
formRef.value.updateOptions(options => ({
  ...options,
  layout: options.layout === 'flex' ? 'grid' : 'flex',
  loading: false
}))
```

### 批量配置更新

```typescript
// 根據條件批量更新配置
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

## 表單項管理方法

### 添加表單項

```typescript
// 在末尾添加表單項
const appendNewField = () => {
  formRef.value.appendItem({
    label: `新字段 ${Date.now()}`,
    prop: `field_${Date.now()}`,
    render: 'input',
    renderProps: {
      placeholder: '動態添加的字段'
    }
  })
}

// 在指定位置插入表單項
const insertField = (index: number) => {
  formRef.value.appendItem({
    label: '插入字段',
    prop: `inserted_field_${Date.now()}`,
    render: 'input'
  }, index)
}

// 在開頭添加表單項
const prependField = () => {
  formRef.value.prependItem({
    label: '首位字段',
    prop: `first_field_${Date.now()}`,
    render: 'input',
    cols: { span: 24 }
  })
}
```

### 刪除表單項

```typescript
// 根據 prop 刪除表單項
const removeField = (prop: string) => {
  const success = formRef.value.removeItem(prop)
  if (success) {
    ElMessage.success(`字段 ${prop} 刪除成功`)
  } else {
    ElMessage.error(`字段 ${prop} 不存在`)
  }
}

// 批量刪除表單項
const removeMultipleFields = (props: string[]) => {
  const results = props.map(prop => ({
    prop,
    success: formRef.value.removeItem(prop)
  }))
  
  const successCount = results.filter(r => r.success).length
  ElMessage.info(`成功刪除 ${successCount} 個字段`)
}
```

### 更新表單項

```typescript
// 更新單個表單項
const updateField = (prop: string, updates: Partial<MaFormItem>) => {
  const success = formRef.value.updateItem(prop, updates)
  if (success) {
    ElMessage.success('字段更新成功')
  }
}

// 動態更新字段屬性
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

// 批量更新字段
const updateMultipleFields = (updates: Record<string, Partial<MaFormItem>>) => {
  Object.entries(updates).forEach(([prop, update]) => {
    formRef.value.updateItem(prop, update)
  })
}
```

### 替換表單項

```typescript
// 完全替換表單項數組
const replaceAllItems = () => {
  const newItems = [
    {
      label: '新用户名',
      prop: 'newUsername',
      render: 'input'
    },
    {
      label: '新郵箱',
      prop: 'newEmail', 
      render: 'input',
      renderProps: { type: 'email' }
    }
  ]
  
  formRef.value.setItems(newItems)
}

// 獲取當前所有表單項
const getAllItems = () => {
  const items = formRef.value.getItems()
  console.log('當前表單項:', items)
  return items
}
```

## 表單項查詢方法

### 單個查詢

```typescript
// 根據 prop 查找表單項
const findFieldByProp = (prop: string) => {
  const item = formRef.value.getItemByProp(prop)
  if (item) {
    console.log(`找到字段 ${prop}:`, item)
  } else {
    console.log(`字段 ${prop} 不存在`)
  }
  return item
}
```

### 條件查詢

```typescript
// 查找所有隱藏字段
const findHiddenFields = () => {
  const hiddenFields = formRef.value.getItemsByCondition(item => 
    item.hide === true || (typeof item.hide === 'function' && item.hide(formData.value, item))
  )
  console.log('隱藏字段:', hiddenFields)
  return hiddenFields
}

// 查找指定類型的字段
const findFieldsByRender = (renderType: string) => {
  return formRef.value.getItemsByCondition(item => item.render === renderType)
}

// 查找必填字段
const findRequiredFields = () => {
  return formRef.value.getItemsByCondition(item => 
    item.itemProps?.rules?.some(rule => rule.required === true)
  )
}
```

### 可見性查詢

```typescript
// 獲取所有可見字段
const getVisibleFields = () => {
  const visibleItems = formRef.value.getVisibleItems()
  console.log('可見字段數量:', visibleItems.length)
  return visibleItems
}

// 統計字段狀態
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

## 驗證控制方法

### 表單驗證

```typescript
// 驗證整個表單
const validateForm = async () => {
  try {
    const isValid = await formRef.value.validate()
    if (isValid) {
      ElMessage.success('表單驗證通過')
      return true
    }
  } catch (error) {
    ElMessage.error('表單驗證失敗')
    console.error('驗證錯誤:', error)
    return false
  }
}

// 帶錯誤處理的表單驗證
const validateFormWithErrorHandling = async () => {
  const loadingInstance = ElLoading.service({ text: '驗證中...' })
  
  try {
    const isValid = await formRef.value.validate()
    loadingInstance.close()
    
    if (isValid) {
      ElMessage.success('驗證通過，可以提交')
      return true
    }
  } catch (error) {
    loadingInstance.close()
    ElMessage.error('請檢查表單填寫')
    
    // 定位到第一個錯誤字段
    const firstErrorField = document.querySelector('.el-form-item.is-error')
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth' })
    }
    
    return false
  }
}
```

### 字段驗證

```typescript
// 驗證單個字段
const validateSingleField = async (prop: string) => {
  try {
    const isValid = await formRef.value.validateField(prop)
    console.log(`字段 ${prop} 驗證結果:`, isValid)
    return isValid
  } catch (error) {
    console.error(`字段 ${prop} 驗證失敗:`, error)
    return false
  }
}

// 批量驗證指定字段
const validateMultipleFields = async (props: string[]) => {
  const results = await Promise.allSettled(
    props.map(async prop => ({
      prop,
      valid: await formRef.value.validateField(prop)
    }))
  )
  
  const validResults = results.filter(r => r.status === 'fulfilled')
  const invalidCount = validResults.filter(r => !r.value.valid).length
  
  console.log(`驗證完成，${validResults.length - invalidCount}/${validResults.length} 個字段通過`)
  return invalidCount === 0
}
```

### 驗證狀態管理

```typescript
// 重置表單驗證狀態
const resetValidation = () => {
  formRef.value.resetFields()
  ElMessage.info('表單已重置')
}

// 重置指定字段
const resetSpecificFields = (props: string[]) => {
  formRef.value.resetFields(props)
  ElMessage.info(`已重置 ${props.join(', ')} 字段`)
}

// 清除驗證錯誤
const clearValidationErrors = () => {
  formRef.value.clearValidate()
  ElMessage.info('驗證錯誤已清除')
}

// 清除指定字段驗證錯誤  
const clearFieldErrors = (props: string[]) => {
  formRef.value.clearValidate(props)
}
```

## 數據操作方法

### 數據讀取

```typescript
// 獲取表單數據
const getFormData = () => {
  const data = formRef.value.getFormData()
  console.log('當前表單數據:', data)
  return data
}

// 獲取指定字段數據
const getFieldValue = (prop: string) => {
  const data = formRef.value.getFormData()
  return data[prop]
}

// 獲取變更的數據
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

### 數據設置

```typescript
// 設置表單數據
const setFormData = (data: Record<string, any>) => {
  formRef.value.setFormData(data)
  ElMessage.success('數據設置成功')
}

// 批量設置字段值
const setMultipleFields = (fieldValues: Record<string, any>) => {
  const currentData = formRef.value.getFormData()
  formRef.value.setFormData({
    ...currentData,
    ...fieldValues
  })
}

// 重置到初始數據
const resetToInitialData = () => {
  formRef.value.resetFormData()
  ElMessage.info('數據已重置到初始狀態')
}
```

## Element Plus 實例訪問

### 獲取原生實例

```typescript
// 獲取 Element Plus el-form 實例
const getElFormInstance = () => {
  const elFormInstance = formRef.value.getElFormRef()
  if (elFormInstance) {
    console.log('Element Plus 表單實例:', elFormInstance)
    // 可以調用 el-form 的原生方法
    return elFormInstance
  }
}

// 使用原生實例方法
const useElFormMethods = () => {
  const elForm = formRef.value.getElFormRef()
  if (elForm) {
    // 調用 el-form 原生方法
    elForm.scrollToField('username')
    elForm.clearValidate(['email'])
  }
}
```

## 綜合應用示例

### 表單動態管理

```typescript
const formManager = {
  // 添加字段組
  addFieldGroup: (groupName: string, fields: MaFormItem[]) => {
    fields.forEach((field, index) => {
      field.prop = `${groupName}.${field.prop}`
      formRef.value.appendItem(field, index)
    })
  },
  
  // 刪除字段組
  removeFieldGroup: (groupName: string) => {
    const items = formRef.value.getItems()
    const toRemove = items
      .filter(item => item.prop?.startsWith(`${groupName}.`))
      .map(item => item.prop)
    
    toRemove.forEach(prop => formRef.value.removeItem(prop))
  },
  
  // 字段狀態切換
  toggleFieldState: (prop: string, state: 'disabled' | 'hidden' | 'readonly') => {
    const updates = {
      disabled: { renderProps: { disabled: true } },
      hidden: { hide: true },
      readonly: { renderProps: { readonly: true } }
    }
    
    formRef.value.updateItem(prop, updates[state])
  },
  
  // 表單模式切換
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

## 相關鏈接

- [暴露方法詳解](/zh-hk/front/component/ma-form#暴露方法-expose)
- [MaFormExpose 類型定義](/zh-hk/front/component/ma-form#maformexpose)
- [表單驗證方法](/zh-hk/front/component/ma-form#表單驗證)