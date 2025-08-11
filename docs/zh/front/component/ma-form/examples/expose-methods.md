# 暴露方法

展示 MaForm 组件通过 defineExpose 暴露的所有 API 方法，包括状态管理、配置管理、表单项管理、验证等功能。

<DemoPreview dir="demos/ma-form/expose-methods" />

## 功能特性

- **状态管理**：加载状态、响应式状态控制
- **配置管理**：动态修改表单配置选项
- **表单项管理**：增删改查表单项配置
- **验证控制**：表单和字段验证管理
- **数据操作**：表单数据的读取和设置
- **实例访问**：获取底层 Element Plus 实例

## 状态管理方法

### 加载状态控制

```typescript
// 设置加载状态
formRef.value.setLoadingState(true)

// 获取当前加载状态
const isLoading = formRef.value.getLoadingState()

// 切换加载状态
const toggleLoading = () => {
  const currentState = formRef.value.getLoadingState()
  formRef.value.setLoadingState(!currentState)
}
```

### 响应式状态管理

```typescript
// 检查是否为移动端状态
const isMobile = formRef.value.isMobileState()

// 手动更新响应式状态（窗口大小改变时）
window.addEventListener('resize', () => {
  formRef.value.updateResponsiveState()
})
```

## 配置管理方法

### 设置表单配置

```typescript
// 完全替换配置
formRef.value.setOptions({
  layout: 'grid',
  loading: true,
  labelWidth: '120px'
})

// 获取当前配置
const currentOptions = formRef.value.getOptions()
console.log('当前配置:', currentOptions)

// 通过更新函数修改配置
formRef.value.updateOptions(options => ({
  ...options,
  layout: options.layout === 'flex' ? 'grid' : 'flex',
  loading: false
}))
```

### 批量配置更新

```typescript
// 根据条件批量更新配置
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

## 表单项管理方法

### 添加表单项

```typescript
// 在末尾添加表单项
const appendNewField = () => {
  formRef.value.appendItem({
    label: `新字段 ${Date.now()}`,
    prop: `field_${Date.now()}`,
    render: 'input',
    renderProps: {
      placeholder: '动态添加的字段'
    }
  })
}

// 在指定位置插入表单项
const insertField = (index: number) => {
  formRef.value.appendItem({
    label: '插入字段',
    prop: `inserted_field_${Date.now()}`,
    render: 'input'
  }, index)
}

// 在开头添加表单项
const prependField = () => {
  formRef.value.prependItem({
    label: '首位字段',
    prop: `first_field_${Date.now()}`,
    render: 'input',
    cols: { span: 24 }
  })
}
```

### 删除表单项

```typescript
// 根据 prop 删除表单项
const removeField = (prop: string) => {
  const success = formRef.value.removeItem(prop)
  if (success) {
    ElMessage.success(`字段 ${prop} 删除成功`)
  } else {
    ElMessage.error(`字段 ${prop} 不存在`)
  }
}

// 批量删除表单项
const removeMultipleFields = (props: string[]) => {
  const results = props.map(prop => ({
    prop,
    success: formRef.value.removeItem(prop)
  }))
  
  const successCount = results.filter(r => r.success).length
  ElMessage.info(`成功删除 ${successCount} 个字段`)
}
```

### 更新表单项

```typescript
// 更新单个表单项
const updateField = (prop: string, updates: Partial<MaFormItem>) => {
  const success = formRef.value.updateItem(prop, updates)
  if (success) {
    ElMessage.success('字段更新成功')
  }
}

// 动态更新字段属性
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

### 替换表单项

```typescript
// 完全替换表单项数组
const replaceAllItems = () => {
  const newItems = [
    {
      label: '新用户名',
      prop: 'newUsername',
      render: 'input'
    },
    {
      label: '新邮箱',
      prop: 'newEmail', 
      render: 'input',
      renderProps: { type: 'email' }
    }
  ]
  
  formRef.value.setItems(newItems)
}

// 获取当前所有表单项
const getAllItems = () => {
  const items = formRef.value.getItems()
  console.log('当前表单项:', items)
  return items
}
```

## 表单项查询方法

### 单个查询

```typescript
// 根据 prop 查找表单项
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

### 条件查询

```typescript
// 查找所有隐藏字段
const findHiddenFields = () => {
  const hiddenFields = formRef.value.getItemsByCondition(item => 
    item.hide === true || (typeof item.hide === 'function' && item.hide(formData.value, item))
  )
  console.log('隐藏字段:', hiddenFields)
  return hiddenFields
}

// 查找指定类型的字段
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

### 可见性查询

```typescript
// 获取所有可见字段
const getVisibleFields = () => {
  const visibleItems = formRef.value.getVisibleItems()
  console.log('可见字段数量:', visibleItems.length)
  return visibleItems
}

// 统计字段状态
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

## 验证控制方法

### 表单验证

```typescript
// 验证整个表单
const validateForm = async () => {
  try {
    const isValid = await formRef.value.validate()
    if (isValid) {
      ElMessage.success('表单验证通过')
      return true
    }
  } catch (error) {
    ElMessage.error('表单验证失败')
    console.error('验证错误:', error)
    return false
  }
}

// 带错误处理的表单验证
const validateFormWithErrorHandling = async () => {
  const loadingInstance = ElLoading.service({ text: '验证中...' })
  
  try {
    const isValid = await formRef.value.validate()
    loadingInstance.close()
    
    if (isValid) {
      ElMessage.success('验证通过，可以提交')
      return true
    }
  } catch (error) {
    loadingInstance.close()
    ElMessage.error('请检查表单填写')
    
    // 定位到第一个错误字段
    const firstErrorField = document.querySelector('.el-form-item.is-error')
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth' })
    }
    
    return false
  }
}
```

### 字段验证

```typescript
// 验证单个字段
const validateSingleField = async (prop: string) => {
  try {
    const isValid = await formRef.value.validateField(prop)
    console.log(`字段 ${prop} 验证结果:`, isValid)
    return isValid
  } catch (error) {
    console.error(`字段 ${prop} 验证失败:`, error)
    return false
  }
}

// 批量验证指定字段
const validateMultipleFields = async (props: string[]) => {
  const results = await Promise.allSettled(
    props.map(async prop => ({
      prop,
      valid: await formRef.value.validateField(prop)
    }))
  )
  
  const validResults = results.filter(r => r.status === 'fulfilled')
  const invalidCount = validResults.filter(r => !r.value.valid).length
  
  console.log(`验证完成，${validResults.length - invalidCount}/${validResults.length} 个字段通过`)
  return invalidCount === 0
}
```

### 验证状态管理

```typescript
// 重置表单验证状态
const resetValidation = () => {
  formRef.value.resetFields()
  ElMessage.info('表单已重置')
}

// 重置指定字段
const resetSpecificFields = (props: string[]) => {
  formRef.value.resetFields(props)
  ElMessage.info(`已重置 ${props.join(', ')} 字段`)
}

// 清除验证错误
const clearValidationErrors = () => {
  formRef.value.clearValidate()
  ElMessage.info('验证错误已清除')
}

// 清除指定字段验证错误  
const clearFieldErrors = (props: string[]) => {
  formRef.value.clearValidate(props)
}
```

## 数据操作方法

### 数据读取

```typescript
// 获取表单数据
const getFormData = () => {
  const data = formRef.value.getFormData()
  console.log('当前表单数据:', data)
  return data
}

// 获取指定字段数据
const getFieldValue = (prop: string) => {
  const data = formRef.value.getFormData()
  return data[prop]
}

// 获取变更的数据
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

### 数据设置

```typescript
// 设置表单数据
const setFormData = (data: Record<string, any>) => {
  formRef.value.setFormData(data)
  ElMessage.success('数据设置成功')
}

// 批量设置字段值
const setMultipleFields = (fieldValues: Record<string, any>) => {
  const currentData = formRef.value.getFormData()
  formRef.value.setFormData({
    ...currentData,
    ...fieldValues
  })
}

// 重置到初始数据
const resetToInitialData = () => {
  formRef.value.resetFormData()
  ElMessage.info('数据已重置到初始状态')
}
```

## Element Plus 实例访问

### 获取原生实例

```typescript
// 获取 Element Plus el-form 实例
const getElFormInstance = () => {
  const elFormInstance = formRef.value.getElFormRef()
  if (elFormInstance) {
    console.log('Element Plus 表单实例:', elFormInstance)
    // 可以调用 el-form 的原生方法
    return elFormInstance
  }
}

// 使用原生实例方法
const useElFormMethods = () => {
  const elForm = formRef.value.getElFormRef()
  if (elForm) {
    // 调用 el-form 原生方法
    elForm.scrollToField('username')
    elForm.clearValidate(['email'])
  }
}
```

## 综合应用示例

### 表单动态管理

```typescript
const formManager = {
  // 添加字段组
  addFieldGroup: (groupName: string, fields: MaFormItem[]) => {
    fields.forEach((field, index) => {
      field.prop = `${groupName}.${field.prop}`
      formRef.value.appendItem(field, index)
    })
  },
  
  // 删除字段组
  removeFieldGroup: (groupName: string) => {
    const items = formRef.value.getItems()
    const toRemove = items
      .filter(item => item.prop?.startsWith(`${groupName}.`))
      .map(item => item.prop)
    
    toRemove.forEach(prop => formRef.value.removeItem(prop))
  },
  
  // 字段状态切换
  toggleFieldState: (prop: string, state: 'disabled' | 'hidden' | 'readonly') => {
    const updates = {
      disabled: { renderProps: { disabled: true } },
      hidden: { hide: true },
      readonly: { renderProps: { readonly: true } }
    }
    
    formRef.value.updateItem(prop, updates[state])
  },
  
  // 表单模式切换
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

## 相关链接

- [暴露方法详解](/zh/front/component/ma-form#暴露方法-expose)
- [MaFormExpose 类型定义](/zh/front/component/ma-form#maformexpose)
- [表单验证方法](/zh/front/component/ma-form#表单验证)