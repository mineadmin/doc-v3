# 暴露方法

展示 MaForm 组件通过 defineExpose 暴露的所有 API 方法，包括加载状态控制、响应式状态管理、实例访问等功能。

<DemoPreview dir="demos/ma-form/expose-methods" />

## 功能特性

- **加载状态控制**：设置表单加载状态
- **响应式状态管理**：移动端状态检测
- **表单项管理**：动态修改表单项配置
- **实例访问**：获取底层 Element Plus Form 实例进行高级操作

## MaForm 暴露方法详解

### 状态管理方法

### 加载状态控制

```typescript
// 设置加载状态
formRef.value?.setLoadingState(true)

// 获取当前加载状态
const isLoading = formRef.value?.getLoadingState?.()

// 切换加载状态
const toggleLoading = () => {
  const currentState = formRef.value?.getLoadingState?.() || false
  formRef.value?.setLoadingState(!currentState)
}

// 模拟提交过程中的加载状态
const handleSubmit = async () => {
  try {
    formRef.value?.setLoadingState(true)
    
    // 执行表单验证
    await formRef.value?.getElFormRef()?.validate()
    
    // 模拟异步提交
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    ElMessage.success('提交成功')
  } catch (error) {
    ElMessage.error('提交失败')
  } finally {
    formRef.value?.setLoadingState(false)
  }
}
```

### 响应式状态管理

```typescript
// 检查是否为移动端状态
const isMobile = formRef.value?.isMobileState?.()

// 手动更新响应式状态（窗口大小改变时）
window.addEventListener('resize', () => {
  formRef.value?.updateResponsiveState?.()
})

// 根据设备状态调整表单布局
const adjustFormLayout = () => {
  const isMobile = formRef.value?.isMobileState?.()
  if (isMobile) {
    // 移动端使用单列布局
    console.log('当前为移动端，使用响应式布局')
  } else {
    // 桌面端使用多列布局
    console.log('当前为桌面端，使用标准布局')
  }
}
```

## Element Plus Form 实例访问

### 获取原生表单实例

MaForm 最重要的暴露方法之一是 `getElFormRef()`，它允许你访问底层的 Element Plus Form 实例，从而使用所有原生表单方法：

```typescript
// 获取 Element Plus el-form 实例
const getElFormInstance = () => {
  const elFormInstance = formRef.value?.getElFormRef()
  if (elFormInstance) {
    console.log('Element Plus 表单实例:', elFormInstance)
    return elFormInstance
  } else {
    console.warn('表单实例尚未初始化')
    return null
  }
}
```

### 通过实例进行表单验证

通过 `getElFormRef()` 获取的实例可以调用所有 Element Plus 表单的原生验证方法：

```typescript
// 验证整个表单
const validateForm = async () => {
  try {
    const elFormRef = formRef.value?.getElFormRef()
    if (!elFormRef) {
      throw new Error('表单实例未找到')
    }
    
    const isValid = await elFormRef.validate()
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

// 验证单个字段
const validateSingleField = async (prop: string) => {
  try {
    const elFormRef = formRef.value?.getElFormRef()
    if (!elFormRef) return false
    
    await elFormRef.validateField(prop)
    console.log(`字段 ${prop} 验证通过`)
    return true
  } catch (error) {
    console.error(`字段 ${prop} 验证失败:`, error)
    return false
  }
}

// 批量验证指定字段
const validateMultipleFields = async (props: string[]) => {
  const elFormRef = formRef.value?.getElFormRef()
  if (!elFormRef) return false
  
  try {
    const results = await Promise.allSettled(
      props.map(prop => elFormRef.validateField(prop))
    )
    
    const failedCount = results.filter(r => r.status === 'rejected').length
    const successCount = results.length - failedCount
    
    console.log(`验证完成，${successCount}/${results.length} 个字段通过`)
    return failedCount === 0
  } catch (error) {
    console.error('批量验证失败:', error)
    return false
  }
}
```

### 通过实例进行表单重置

```typescript
// 重置表单验证状态
const resetValidation = () => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    elFormRef.resetFields()
    ElMessage.info('表单已重置')
  }
}

// 重置指定字段
const resetSpecificFields = (props: string[]) => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    elFormRef.resetFields(props)
    ElMessage.info(`已重置 ${props.join(', ')} 字段`)
  }
}

// 清除验证错误
const clearValidationErrors = () => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    elFormRef.clearValidate()
    ElMessage.info('验证错误已清除')
  }
}

// 清除指定字段验证错误  
const clearFieldErrors = (props: string[]) => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    elFormRef.clearValidate(props)
    console.log(`已清除 ${props.join(', ')} 字段的验证错误`)
  }
}
```

### 高级实例操作

```typescript
// 滚动到指定字段
const scrollToField = (prop: string) => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    elFormRef.scrollToField(prop)
    console.log(`已滚动到字段: ${prop}`)
  }
}

// 获取字段实例
const getFieldInstance = (prop: string) => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    // 通过 DOM 查询获取字段实例
    const fieldElement = document.querySelector(`[data-field="${prop}"]`)
    return fieldElement
  }
  return null
}
```

## 实际应用场景

### 表单提交流程

结合所有暴露的方法，我们可以实现一个完整的表单提交流程：

```typescript
const handleFormSubmit = async () => {
  try {
    // 1. 设置加载状态
    formRef.value?.setLoadingState(true)
    
    // 2. 执行表单验证
    const elFormRef = formRef.value?.getElFormRef()
    if (!elFormRef) {
      throw new Error('表单实例未初始化')
    }
    
    await elFormRef.validate()
    
    // 3. 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 4. 提交成功处理
    ElMessage.success('提交成功')
    
    // 5. 重置表单（可选）
    elFormRef.resetFields()
    
  } catch (error) {
    // 验证失败或提交错误处理
    ElMessage.error('提交失败，请检查表单')
    console.error('提交错误:', error)
    
    // 滚动到第一个错误字段
    const firstErrorField = document.querySelector('.el-form-item.is-error')
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth' })
    }
  } finally {
    // 6. 清除加载状态
    formRef.value?.setLoadingState(false)
  }
}
```

### 响应式布局适配

利用响应式状态管理来实现不同设备下的最佳体验：

```typescript
const handleResponsiveLayout = () => {
  const isMobile = formRef.value?.isMobileState?.()
  
  if (isMobile) {
    // 移动端优化：显示紧凑布局提示
    ElMessage({
      message: '已切换到移动端布局模式',
      type: 'info',
      duration: 2000
    })
    
    // 移动端可能需要特殊处理的逻辑
    console.log('当前为移动端模式，使用单列布局')
  } else {
    // 桌面端布局
    console.log('当前为桌面端模式，使用多列布局')
  }
}

// 监听窗口大小变化
window.addEventListener('resize', () => {
  formRef.value?.updateResponsiveState?.()
  handleResponsiveLayout()
})
```

### 错误处理和用户体验优化

```typescript
// 智能表单操作处理器
const smartFormHandler = {
  // 安全的表单验证
  safeValidate: async (showLoading = true) => {
    try {
      if (showLoading) {
        formRef.value?.setLoadingState(true)
      }
      
      const elFormRef = formRef.value?.getElFormRef()
      if (!elFormRef) {
        throw new Error('表单实例未就绪')
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
  
  // 智能重置
  smartReset: (clearValidation = true) => {
    const elFormRef = formRef.value?.getElFormRef()
    if (elFormRef) {
      elFormRef.resetFields()
      if (clearValidation) {
        elFormRef.clearValidate()
      }
      ElMessage.info('表单已重置')
    }
  },
  
  // 获取当前状态信息
  getStatus: () => {
    return {
      loading: formRef.value?.getLoadingState?.() || false,
      mobile: formRef.value?.isMobileState?.() || false,
      formReady: !!formRef.value?.getElFormRef()
    }
  }
}
```

### 调试和开发工具

```typescript
// 开发时的调试工具
const devTools = {
  // 打印所有暴露方法的状态
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
    console.log('状态信息:', status)
    console.log('可用方法:', Object.keys(formRef.value || {}))
    console.groupEnd()
    
    return status
  },
  
  // 测试所有方法
  testMethods: async () => {
    console.log('📋 测试 MaForm 暴露方法...')
    
    // 测试加载状态
    const initialLoading = formRef.value?.getLoadingState?.()
    console.log('初始加载状态:', initialLoading)
    
    formRef.value?.setLoadingState(true)
    console.log('设置加载状态为 true')
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    formRef.value?.setLoadingState(false)
    console.log('设置加载状态为 false')
    
    // 测试响应式状态
    const isMobile = formRef.value?.isMobileState?.()
    console.log('当前移动端状态:', isMobile)
    
    formRef.value?.updateResponsiveState?.()
    console.log('已更新响应式状态')
    
    // 测试表单实例
    const elFormRef = formRef.value?.getElFormRef()
    console.log('表单实例是否可用:', !!elFormRef)
    
    console.log('✅ 所有方法测试完成')
  }
}
```

## API 方法总结

### MaForm 暴露的方法

| 方法名 | 参数 | 返回值 | 说明 |
|-------|-----|-------|-----|
| `setLoadingState` | `loading: boolean` | `void` | 设置表单的全局加载状态 |
| `setOptions` | `opts: MaFormOptions` | `void` | 设置表单配置选项 |
| `getOptions` | - | `MaFormOptions` | 获取当前表单配置 |
| `setItems` | `items: MaFormItem[]` | `void` | 设置表单项数组 |
| `getItems` | - | `MaFormItem[]` | 获取当前表单项数组 |
| `appendItem` | `item: MaFormItem` | `void` | 添加一个表单项 |
| `removeItem` | `prop: string` | `void` | 根据 prop 删除表单项 |
| `getItemByProp` | `prop: string` | `MaFormItem \| null` | 根据 prop 获取表单项 |
| `getElFormRef` | - | `FormInstance \| undefined` | 获取 Element Plus Form 实例 |
| `isMobileState` | - | `boolean` | 检查当前是否为移动端状态 |

### 不可用的方法

以下方法在当前版本中不存在：

| 方法名 | 说明 |
|-------|----- |
| `getLoadingState` | 获取当前的加载状态（请自行维护加载状态） |
| `updateResponsiveState` | 手动触发响应式状态更新（表单会自动处理） |

### Element Plus Form 实例方法

通过 `getElFormRef()` 获取的实例支持以下常用方法：

| 方法名 | 参数 | 返回值 | 说明 |
|-------|-----|-------|-----|
| `validate` | `callback?: Function` | `Promise<boolean>` | 验证整个表单 |
| `validateField` | `props: string \| string[]` | `Promise<void>` | 验证指定字段 |
| `resetFields` | `props?: string \| string[]` | `void` | 重置字段值和验证状态 |
| `clearValidate` | `props?: string \| string[]` | `void` | 清除验证状态 |
| `scrollToField` | `prop: string` | `void` | 滚动到指定字段 |

## 注意事项

1. **安全调用**：使用可选链操作符 (`?.`) 来安全调用方法，避免在组件未挂载时出错
2. **时机把握**：确保在组件挂载完成后再调用这些方法
3. **错误处理**：对异步方法（如 `validate`）要做好错误处理
4. **类型安全**：配合 TypeScript 使用时，导入正确的类型定义

## 相关链接

- [MaForm 基础用法](/v3/front/component/ma-form/examples/basic-usage)
- [表单验证示例](/v3/front/component/ma-form/examples/dynamic-validation)
- [加载状态演示](/v3/front/component/ma-form/examples/loading-states)
- [Element Plus Form 文档](https://element-plus.org/zh-CN/component/form.html)