# 暴露方法

展示 MaForm 元件透過 defineExpose 暴露的所有 API 方法，包括載入狀態控制、響應式狀態管理、例項訪問等功能。

<DemoPreview dir="demos/ma-form/expose-methods" />

## 功能特性

- **載入狀態控制**：設定表單載入狀態
- **響應式狀態管理**：移動端狀態檢測
- **表單項管理**：動態修改表單項配置
- **例項訪問**：獲取底層 Element Plus Form 例項進行高階操作

## MaForm 暴露方法詳解

### 狀態管理方法

### 載入狀態控制

```typescript
// 設定載入狀態
formRef.value?.setLoadingState(true)

// 獲取當前載入狀態
const isLoading = formRef.value?.getLoadingState?.()

// 切換載入狀態
const toggleLoading = () => {
  const currentState = formRef.value?.getLoadingState?.() || false
  formRef.value?.setLoadingState(!currentState)
}

// 模擬提交過程中的載入狀態
const handleSubmit = async () => {
  try {
    formRef.value?.setLoadingState(true)
    
    // 執行表單驗證
    await formRef.value?.getElFormRef()?.validate()
    
    // 模擬非同步提交
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

// 手動更新響應式狀態（視窗大小改變時）
window.addEventListener('resize', () => {
  formRef.value?.updateResponsiveState?.()
})

// 根據裝置狀態調整表單佈局
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

## Element Plus Form 例項訪問

### 獲取原生表單例項

MaForm 最重要的暴露方法之一是 `getElFormRef()`，它允許你訪問底層的 Element Plus Form 例項，從而使用所有原生表單方法：

```typescript
// 獲取 Element Plus el-form 例項
const getElFormInstance = () => {
  const elFormInstance = formRef.value?.getElFormRef()
  if (elFormInstance) {
    console.log('Element Plus 表單例項:', elFormInstance)
    return elFormInstance
  } else {
    console.warn('表單例項尚未初始化')
    return null
  }
}
```

### 透過例項進行表單驗證

透過 `getElFormRef()` 獲取的例項可以呼叫所有 Element Plus 表單的原生驗證方法：

```typescript
// 驗證整個表單
const validateForm = async () => {
  try {
    const elFormRef = formRef.value?.getElFormRef()
    if (!elFormRef) {
      throw new Error('表單例項未找到')
    }
    
    const isValid = await elFormRef.validate()
    if (isValid) {
      ElMessage.success('表單驗證透過')
      return true
    }
  } catch (error) {
    ElMessage.error('表單驗證失敗')
    console.error('驗證錯誤:', error)
    return false
  }
}

// 驗證單個欄位
const validateSingleField = async (prop: string) => {
  try {
    const elFormRef = formRef.value?.getElFormRef()
    if (!elFormRef) return false
    
    await elFormRef.validateField(prop)
    console.log(`欄位 ${prop} 驗證透過`)
    return true
  } catch (error) {
    console.error(`欄位 ${prop} 驗證失敗:`, error)
    return false
  }
}

// 批次驗證指定欄位
const validateMultipleFields = async (props: string[]) => {
  const elFormRef = formRef.value?.getElFormRef()
  if (!elFormRef) return false
  
  try {
    const results = await Promise.allSettled(
      props.map(prop => elFormRef.validateField(prop))
    )
    
    const failedCount = results.filter(r => r.status === 'rejected').length
    const successCount = results.length - failedCount
    
    console.log(`驗證完成，${successCount}/${results.length} 個欄位透過`)
    return failedCount === 0
  } catch (error) {
    console.error('批次驗證失敗:', error)
    return false
  }
}
```

### 透過例項進行表單重置

```typescript
// 重置表單驗證狀態
const resetValidation = () => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    elFormRef.resetFields()
    ElMessage.info('表單已重置')
  }
}

// 重置指定欄位
const resetSpecificFields = (props: string[]) => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    elFormRef.resetFields(props)
    ElMessage.info(`已重置 ${props.join(', ')} 欄位`)
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

// 清除指定欄位驗證錯誤  
const clearFieldErrors = (props: string[]) => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    elFormRef.clearValidate(props)
    console.log(`已清除 ${props.join(', ')} 欄位的驗證錯誤`)
  }
}
```

### 高階例項操作

```typescript
// 滾動到指定欄位
const scrollToField = (prop: string) => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    elFormRef.scrollToField(prop)
    console.log(`已滾動到欄位: ${prop}`)
  }
}

// 獲取欄位例項
const getFieldInstance = (prop: string) => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    // 透過 DOM 查詢獲取欄位例項
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
    // 1. 設定載入狀態
    formRef.value?.setLoadingState(true)
    
    // 2. 執行表單驗證
    const elFormRef = formRef.value?.getElFormRef()
    if (!elFormRef) {
      throw new Error('表單例項未初始化')
    }
    
    await elFormRef.validate()
    
    // 3. 模擬 API 呼叫
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 4. 提交成功處理
    ElMessage.success('提交成功')
    
    // 5. 重置表單（可選）
    elFormRef.resetFields()
    
  } catch (error) {
    // 驗證失敗或提交錯誤處理
    ElMessage.error('提交失敗，請檢查表單')
    console.error('提交錯誤:', error)
    
    // 滾動到第一個錯誤欄位
    const firstErrorField = document.querySelector('.el-form-item.is-error')
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth' })
    }
  } finally {
    // 6. 清除載入狀態
    formRef.value?.setLoadingState(false)
  }
}
```

### 響應式佈局適配

利用響應式狀態管理來實現不同裝置下的最佳體驗：

```typescript
const handleResponsiveLayout = () => {
  const isMobile = formRef.value?.isMobileState?.()
  
  if (isMobile) {
    // 移動端最佳化：顯示緊湊佈局提示
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

// 監聽視窗大小變化
window.addEventListener('resize', () => {
  formRef.value?.updateResponsiveState?.()
  handleResponsiveLayout()
})
```

### 錯誤處理和使用者體驗最佳化

```typescript
// 智慧表單操作處理器
const smartFormHandler = {
  // 安全的表單驗證
  safeValidate: async (showLoading = true) => {
    try {
      if (showLoading) {
        formRef.value?.setLoadingState(true)
      }
      
      const elFormRef = formRef.value?.getElFormRef()
      if (!elFormRef) {
        throw new Error('表單例項未就緒')
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
  
  // 智慧重置
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
  
  // 獲取當前狀態資訊
  getStatus: () => {
    return {
      loading: formRef.value?.getLoadingState?.() || false,
      mobile: formRef.value?.isMobileState?.() || false,
      formReady: !!formRef.value?.getElFormRef()
    }
  }
}
```

### 除錯和開發工具

```typescript
// 開發時的除錯工具
const devTools = {
  // 列印所有暴露方法的狀態
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
    console.log('狀態資訊:', status)
    console.log('可用方法:', Object.keys(formRef.value || {}))
    console.groupEnd()
    
    return status
  },
  
  // 測試所有方法
  testMethods: async () => {
    console.log('📋 測試 MaForm 暴露方法...')
    
    // 測試載入狀態
    const initialLoading = formRef.value?.getLoadingState?.()
    console.log('初始載入狀態:', initialLoading)
    
    formRef.value?.setLoadingState(true)
    console.log('設定載入狀態為 true')
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    formRef.value?.setLoadingState(false)
    console.log('設定載入狀態為 false')
    
    // 測試響應式狀態
    const isMobile = formRef.value?.isMobileState?.()
    console.log('當前移動端狀態:', isMobile)
    
    formRef.value?.updateResponsiveState?.()
    console.log('已更新響應式狀態')
    
    // 測試表單例項
    const elFormRef = formRef.value?.getElFormRef()
    console.log('表單例項是否可用:', !!elFormRef)
    
    console.log('✅ 所有方法測試完成')
  }
}
```

## API 方法總結

### MaForm 暴露的方法

| 方法名 | 引數 | 返回值 | 說明 |
|-------|-----|-------|-----|
| `setLoadingState` | `loading: boolean` | `void` | 設定表單的全域性載入狀態 |
| `setOptions` | `opts: MaFormOptions` | `void` | 設定表單配置選項 |
| `getOptions` | - | `MaFormOptions` | 獲取當前表單配置 |
| `setItems` | `items: MaFormItem[]` | `void` | 設定表單項陣列 |
| `getItems` | - | `MaFormItem[]` | 獲取當前表單項陣列 |
| `appendItem` | `item: MaFormItem` | `void` | 新增一個表單項 |
| `removeItem` | `prop: string` | `void` | 根據 prop 刪除表單項 |
| `getItemByProp` | `prop: string` | `MaFormItem \| null` | 根據 prop 獲取表單項 |
| `getElFormRef` | - | `FormInstance \| undefined` | 獲取 Element Plus Form 例項 |
| `isMobileState` | - | `boolean` | 檢查當前是否為移動端狀態 |

### 不可用的方法

以下方法在當前版本中不存在：

| 方法名 | 說明 |
|-------|----- |
| `getLoadingState` | 獲取當前的載入狀態（請自行維護載入狀態） |
| `updateResponsiveState` | 手動觸發響應式狀態更新（表單會自動處理） |

### Element Plus Form 例項方法

透過 `getElFormRef()` 獲取的例項支援以下常用方法：

| 方法名 | 引數 | 返回值 | 說明 |
|-------|-----|-------|-----|
| `validate` | `callback?: Function` | `Promise<boolean>` | 驗證整個表單 |
| `validateField` | `props: string \| string[]` | `Promise<void>` | 驗證指定欄位 |
| `resetFields` | `props?: string \| string[]` | `void` | 重置欄位值和驗證狀態 |
| `clearValidate` | `props?: string \| string[]` | `void` | 清除驗證狀態 |
| `scrollToField` | `prop: string` | `void` | 滾動到指定欄位 |

## 注意事項

1. **安全呼叫**：使用可選鏈運算子 (`?.`) 來安全呼叫方法，避免在元件未掛載時出錯
2. **時機把握**：確保在元件掛載完成後再呼叫這些方法
3. **錯誤處理**：對非同步方法（如 `validate`）要做好錯誤處理
4. **型別安全**：配合 TypeScript 使用時，匯入正確的型別定義

## 相關連結

- [MaForm 基礎用法](/zh-tw/front/component/ma-form/examples/basic-usage)
- [表單驗證示例](/zh-tw/front/component/ma-form/examples/dynamic-validation)
- [載入狀態演示](/zh-tw/front/component/ma-form/examples/loading-states)
- [Element Plus Form 文件](https://element-plus.org/zh-CN/component/form.html)