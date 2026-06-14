# 暴露方法

展示 MaForm 組件通過 defineExpose 暴露的所有 API 方法，包括加載狀態控制、響應式狀態管理、實例訪問等功能。

<DemoPreview dir="demos/ma-form/expose-methods" />

## 功能特性

- **加載狀態控制**：設置表單加載狀態
- **響應式狀態管理**：移動端狀態檢測
- **表單項管理**：動態修改表單項配置
- **實例訪問**：獲取底層 Element Plus Form 實例進行高級操作

## MaForm 暴露方法詳解

### 狀態管理方法

### 加載狀態控制

```typescript
// 設置加載狀態
formRef.value?.setLoadingState(true)

// 獲取當前加載狀態
const isLoading = formRef.value?.getLoadingState?.()

// 切換加載狀態
const toggleLoading = () => {
  const currentState = formRef.value?.getLoadingState?.() || false
  formRef.value?.setLoadingState(!currentState)
}

// 模擬提交過程中的加載狀態
const handleSubmit = async () => {
  try {
    formRef.value?.setLoadingState(true)
    
    // 執行表單驗證
    await formRef.value?.getElFormRef()?.validate()
    
    // 模擬異步提交
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    ElMessage.success('提交成功')
  } catch (error) {
    ElMessage.error('提交失敗')
  } finally {
    formRef.value?.setLoadingState(false)
  }
}
```

### 響應式狀態管理

```typescript
// 檢查是否為移動端狀態
const isMobile = formRef.value?.isMobileState?.()

// 手動更新響應式狀態（窗口大小改變時）
window.addEventListener('resize', () => {
  formRef.value?.updateResponsiveState?.()
})

// 根據設備狀態調整表單佈局
const adjustFormLayout = () => {
  const isMobile = formRef.value?.isMobileState?.()
  if (isMobile) {
    // 移動端使用單列布局
    console.log('當前為移動端，使用響應式佈局')
  } else {
    // 桌面端使用多列布局
    console.log('當前為桌面端，使用標準佈局')
  }
}
```

## Element Plus Form 實例訪問

### 獲取原生表單實例

MaForm 最重要的暴露方法之一是 `getElFormRef()`，它允許你訪問底層的 Element Plus Form 實例，從而使用所有原生表單方法：

```typescript
// 獲取 Element Plus el-form 實例
const getElFormInstance = () => {
  const elFormInstance = formRef.value?.getElFormRef()
  if (elFormInstance) {
    console.log('Element Plus 表單實例:', elFormInstance)
    return elFormInstance
  } else {
    console.warn('表單實例尚未初始化')
    return null
  }
}
```

### 通過實例進行表單驗證

通過 `getElFormRef()` 獲取的實例可以調用所有 Element Plus 表單的原生驗證方法：

```typescript
// 驗證整個表單
const validateForm = async () => {
  try {
    const elFormRef = formRef.value?.getElFormRef()
    if (!elFormRef) {
      throw new Error('表單實例未找到')
    }
    
    const isValid = await elFormRef.validate()
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

// 驗證單個字段
const validateSingleField = async (prop: string) => {
  try {
    const elFormRef = formRef.value?.getElFormRef()
    if (!elFormRef) return false
    
    await elFormRef.validateField(prop)
    console.log(`字段 ${prop} 驗證通過`)
    return true
  } catch (error) {
    console.error(`字段 ${prop} 驗證失敗:`, error)
    return false
  }
}

// 批量驗證指定字段
const validateMultipleFields = async (props: string[]) => {
  const elFormRef = formRef.value?.getElFormRef()
  if (!elFormRef) return false
  
  try {
    const results = await Promise.allSettled(
      props.map(prop => elFormRef.validateField(prop))
    )
    
    const failedCount = results.filter(r => r.status === 'rejected').length
    const successCount = results.length - failedCount
    
    console.log(`驗證完成，${successCount}/${results.length} 個字段通過`)
    return failedCount === 0
  } catch (error) {
    console.error('批量驗證失敗:', error)
    return false
  }
}
```

### 通過實例進行表單重置

```typescript
// 重置表單驗證狀態
const resetValidation = () => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    elFormRef.resetFields()
    ElMessage.info('表單已重置')
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

// 清除驗證錯誤
const clearValidationErrors = () => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    elFormRef.clearValidate()
    ElMessage.info('驗證錯誤已清除')
  }
}

// 清除指定字段驗證錯誤  
const clearFieldErrors = (props: string[]) => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    elFormRef.clearValidate(props)
    console.log(`已清除 ${props.join(', ')} 字段的驗證錯誤`)
  }
}
```

### 高級實例操作

```typescript
// 滾動到指定字段
const scrollToField = (prop: string) => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    elFormRef.scrollToField(prop)
    console.log(`已滾動到字段: ${prop}`)
  }
}

// 獲取字段實例
const getFieldInstance = (prop: string) => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    // 通過 DOM 查詢獲取字段實例
    const fieldElement = document.querySelector(`[data-field="${prop}"]`)
    return fieldElement
  }
  return null
}
```

## 實際應用場景

### 表單提交流程

結合所有暴露的方法，我們可以實現一個完整的表單提交流程：

```typescript
const handleFormSubmit = async () => {
  try {
    // 1. 設置加載狀態
    formRef.value?.setLoadingState(true)
    
    // 2. 執行表單驗證
    const elFormRef = formRef.value?.getElFormRef()
    if (!elFormRef) {
      throw new Error('表單實例未初始化')
    }
    
    await elFormRef.validate()
    
    // 3. 模擬 API 調用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 4. 提交成功處理
    ElMessage.success('提交成功')
    
    // 5. 重置表單（可選）
    elFormRef.resetFields()
    
  } catch (error) {
    // 驗證失敗或提交錯誤處理
    ElMessage.error('提交失敗，請檢查表單')
    console.error('提交錯誤:', error)
    
    // 滾動到第一個錯誤字段
    const firstErrorField = document.querySelector('.el-form-item.is-error')
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth' })
    }
  } finally {
    // 6. 清除加載狀態
    formRef.value?.setLoadingState(false)
  }
}
```

### 響應式佈局適配

利用響應式狀態管理來實現不同設備下的最佳體驗：

```typescript
const handleResponsiveLayout = () => {
  const isMobile = formRef.value?.isMobileState?.()
  
  if (isMobile) {
    // 移動端優化：顯示緊湊佈局提示
    ElMessage({
      message: '已切換到移動端佈局模式',
      type: 'info',
      duration: 2000
    })
    
    // 移動端可能需要特殊處理的邏輯
    console.log('當前為移動端模式，使用單列布局')
  } else {
    // 桌面端佈局
    console.log('當前為桌面端模式，使用多列布局')
  }
}

// 監聽窗口大小變化
window.addEventListener('resize', () => {
  formRef.value?.updateResponsiveState?.()
  handleResponsiveLayout()
})
```

### 錯誤處理和用户體驗優化

```typescript
// 智能表單操作處理器
const smartFormHandler = {
  // 安全的表單驗證
  safeValidate: async (showLoading = true) => {
    try {
      if (showLoading) {
        formRef.value?.setLoadingState(true)
      }
      
      const elFormRef = formRef.value?.getElFormRef()
      if (!elFormRef) {
        throw new Error('表單實例未就緒')
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
      ElMessage.info('表單已重置')
    }
  },
  
  // 獲取當前狀態信息
  getStatus: () => {
    return {
      loading: formRef.value?.getLoadingState?.() || false,
      mobile: formRef.value?.isMobileState?.() || false,
      formReady: !!formRef.value?.getElFormRef()
    }
  }
}
```

### 調試和開發工具

```typescript
// 開發時的調試工具
const devTools = {
  // 打印所有暴露方法的狀態
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
    console.log('狀態信息:', status)
    console.log('可用方法:', Object.keys(formRef.value || {}))
    console.groupEnd()
    
    return status
  },
  
  // 測試所有方法
  testMethods: async () => {
    console.log('📋 測試 MaForm 暴露方法...')
    
    // 測試加載狀態
    const initialLoading = formRef.value?.getLoadingState?.()
    console.log('初始加載狀態:', initialLoading)
    
    formRef.value?.setLoadingState(true)
    console.log('設置加載狀態為 true')
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    formRef.value?.setLoadingState(false)
    console.log('設置加載狀態為 false')
    
    // 測試響應式狀態
    const isMobile = formRef.value?.isMobileState?.()
    console.log('當前移動端狀態:', isMobile)
    
    formRef.value?.updateResponsiveState?.()
    console.log('已更新響應式狀態')
    
    // 測試表單實例
    const elFormRef = formRef.value?.getElFormRef()
    console.log('表單實例是否可用:', !!elFormRef)
    
    console.log('✅ 所有方法測試完成')
  }
}
```

## API 方法總結

### MaForm 暴露的方法

| 方法名 | 參數 | 返回值 | 説明 |
|-------|-----|-------|-----|
| `setLoadingState` | `loading: boolean` | `void` | 設置表單的全局加載狀態 |
| `setOptions` | `opts: MaFormOptions` | `void` | 設置表單配置選項 |
| `getOptions` | - | `MaFormOptions` | 獲取當前表單配置 |
| `setItems` | `items: MaFormItem[]` | `void` | 設置表單項數組 |
| `getItems` | - | `MaFormItem[]` | 獲取當前表單項數組 |
| `appendItem` | `item: MaFormItem` | `void` | 添加一個表單項 |
| `removeItem` | `prop: string` | `void` | 根據 prop 刪除表單項 |
| `getItemByProp` | `prop: string` | `MaFormItem \| null` | 根據 prop 獲取表單項 |
| `getElFormRef` | - | `FormInstance \| undefined` | 獲取 Element Plus Form 實例 |
| `isMobileState` | - | `boolean` | 檢查當前是否為移動端狀態 |

### 不可用的方法

以下方法在當前版本中不存在：

| 方法名 | 説明 |
|-------|----- |
| `getLoadingState` | 獲取當前的加載狀態（請自行維護加載狀態） |
| `updateResponsiveState` | 手動觸發響應式狀態更新（表單會自動處理） |

### Element Plus Form 實例方法

通過 `getElFormRef()` 獲取的實例支持以下常用方法：

| 方法名 | 參數 | 返回值 | 説明 |
|-------|-----|-------|-----|
| `validate` | `callback?: Function` | `Promise<boolean>` | 驗證整個表單 |
| `validateField` | `props: string \| string[]` | `Promise<void>` | 驗證指定字段 |
| `resetFields` | `props?: string \| string[]` | `void` | 重置字段值和驗證狀態 |
| `clearValidate` | `props?: string \| string[]` | `void` | 清除驗證狀態 |
| `scrollToField` | `prop: string` | `void` | 滾動到指定字段 |

## 注意事項

1. **安全調用**：使用可選鏈操作符 (`?.`) 來安全調用方法，避免在組件未掛載時出錯
2. **時機把握**：確保在組件掛載完成後再調用這些方法
3. **錯誤處理**：對異步方法（如 `validate`）要做好錯誤處理
4. **類型安全**：配合 TypeScript 使用時，導入正確的類型定義

## 相關鏈接

- [MaForm 基礎用法](/v3/front/component/ma-form/examples/basic-usage)
- [表單驗證示例](/v3/front/component/ma-form/examples/dynamic-validation)
- [加載狀態演示](/v3/front/component/ma-form/examples/loading-states)
- [Element Plus Form 文檔](https://element-plus.org/zh-CN/component/form.html)