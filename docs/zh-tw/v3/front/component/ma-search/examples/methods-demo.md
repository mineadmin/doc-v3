# 方法演示

展示所有暴露方法的使用，包含實時狀態跟蹤和操作日誌記錄，幫助開發者深入瞭解元件的程式設計介面和高階用法。

## 方法演示

<DemoPreview dir="demos/ma-search/methods-demo" />

## 暴露方法詳解

### 表單資料管理
操作和獲取搜尋表單的資料：

```typescript
// 設定搜尋表單資料
const setFormData = () => {
  const newData = {
    username: 'admin',
    status: 'active',
    created_at: '2024-01-01'
  }
  searchRef.value?.setSearchForm(newData)
}

// 獲取當前搜尋表單資料
const getFormData = () => {
  const formData = searchRef.value?.getSearchForm()
  console.log('當前表單資料:', formData)
  return formData
}

// 清空表單資料
const clearFormData = () => {
  searchRef.value?.setSearchForm({})
}
```

### 摺疊狀態控制
管理搜尋面板的摺疊展開狀態：

```typescript
// 切換摺疊狀態
const toggleFold = () => {
  searchRef.value?.foldToggle()
}

// 獲取當前摺疊狀態
const getCurrentFoldState = () => {
  const isFold = searchRef.value?.getFold()
  console.log('當前摺疊狀態:', isFold ? '已摺疊' : '已展開')
  return isFold
}

// 程式化設定摺疊狀態
const setFoldState = (fold: boolean) => {
  const currentState = searchRef.value?.getFold()
  if (currentState !== fold) {
    searchRef.value?.foldToggle()
  }
}
```

### 顯示狀態管理
控制整個搜尋元件的顯示和隱藏：

```typescript
// 設定顯示狀態
const setVisibility = (visible: boolean) => {
  searchRef.value?.setShowState(visible)
}

// 獲取當前顯示狀態
const getVisibility = () => {
  const isVisible = searchRef.value?.getShowState()
  console.log('元件顯示狀態:', isVisible ? '顯示' : '隱藏')
  return isVisible
}

// 切換顯示狀態
const toggleVisibility = () => {
  const currentState = searchRef.value?.getShowState()
  searchRef.value?.setShowState(!currentState)
}
```

### 配置動態管理
動態修改元件的各種配置選項：

```typescript
// 動態設定搜尋選項
const updateSearchOptions = () => {
  const newOptions = {
    cols: { xs: 1, sm: 2, md: 3, lg: 4 },
    fold: true,
    foldRows: 3,
    text: {
      searchBtn: '立即查詢',
      resetBtn: '重置條件'
    }
  }
  searchRef.value?.setOptions(newOptions)
}

// 動態設定表單選項  
const updateFormOptions = () => {
  const formOptions = {
    labelWidth: '120px',
    labelPosition: 'right',
    size: 'large'
  }
  searchRef.value?.setFormOptions(formOptions)
}

// 獲取當前配置
const getCurrentConfig = () => {
  const searchOptions = searchRef.value?.getOptions()
  const formOptions = searchRef.value?.getFormOptions()
  
  console.log('搜尋元件配置:', searchOptions)
  console.log('表單元件配置:', formOptions)
  
  return { searchOptions, formOptions }
}
```

### 搜尋項動態管理
執行時動態修改搜尋項配置：

```typescript
// 批次設定搜尋項
const setBatchItems = () => {
  const newItems = [
    { label: '使用者ID', prop: 'user_id', render: 'input-number' },
    { label: '使用者名稱', prop: 'username', render: 'input' },
    { label: '郵箱', prop: 'email', render: 'input' },
    { label: '狀態', prop: 'status', render: 'select', options: statusOptions }
  ]
  searchRef.value?.setItems(newItems)
}

// 追加單個搜尋項
const appendSingleItem = () => {
  const newItem = {
    label: '註冊時間',
    prop: 'created_at',
    render: 'date-picker',
    props: {
      type: 'daterange',
      format: 'YYYY-MM-DD'
    }
  }
  searchRef.value?.appendItem(newItem)
}

// 刪除指定搜尋項
const removeSpecificItem = (prop: string) => {
  searchRef.value?.removeItem(prop)
}

// 查詢特定搜尋項
const findItemByProp = (prop: string) => {
  const item = searchRef.value?.getItemByProp(prop)
  if (item) {
    console.log(`找到搜尋項:`, item)
  } else {
    console.log(`未找到 prop 為 "${prop}" 的搜尋項`)
  }
  return item
}

// 獲取所有搜尋項
const getAllItems = () => {
  const items = searchRef.value?.getItems()
  console.log('所有搜尋項:', items)
  return items
}
```

### 表單引用獲取
獲取內部 ma-form 元件引用進行更底層操作：

```typescript
// 獲取表單引用
const getFormRef = () => {
  const formRef = searchRef.value?.getMaFormRef()
  if (formRef) {
    console.log('獲取到表單引用:', formRef)
    return formRef
  }
}

// 透過表單引用進行驗證
const validateViaFormRef = async () => {
  const formRef = searchRef.value?.getMaFormRef()
  if (formRef) {
    try {
      await formRef.validate()
      console.log('表單驗證透過')
      return true
    } catch (error) {
      console.log('表單驗證失敗:', error)
      return false
    }
  }
}

// 重置表單透過引用
const resetViaFormRef = () => {
  const formRef = searchRef.value?.getMaFormRef()
  if (formRef) {
    formRef.resetFields()
    console.log('表單已重置')
  }
}
```

## 使用場景

### 1. 搜尋條件預設
根據業務場景預設不同的搜尋條件：

```typescript
// 預設搜尋場景
const presetScenarios = {
  today: () => {
    searchRef.value?.setSearchForm({
      created_at: [
        dayjs().format('YYYY-MM-DD'),
        dayjs().format('YYYY-MM-DD')
      ]
    })
  },
  
  thisWeek: () => {
    searchRef.value?.setSearchForm({
      created_at: [
        dayjs().startOf('week').format('YYYY-MM-DD'),
        dayjs().endOf('week').format('YYYY-MM-DD')
      ]
    })
  },
  
  activeUsers: () => {
    searchRef.value?.setSearchForm({
      status: 'active',
      last_login: [
        dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
        dayjs().format('YYYY-MM-DD')
      ]
    })
  }
}

// 應用預設場景
const applyPreset = (scenario: keyof typeof presetScenarios) => {
  presetScenarios[scenario]()
}
```

### 2. 許可權控制
根據使用者許可權動態調整搜尋功能：

```typescript
// 許可權控制搜尋項
const applyPermissionControl = (userRole: string) => {
  const baseItems = [
    { label: '使用者名稱', prop: 'username', render: 'input' },
    { label: '狀態', prop: 'status', render: 'select', options: statusOptions }
  ]
  
  // 管理員可以看到更多搜尋項
  if (userRole === 'admin') {
    baseItems.push(
      { label: '建立人', prop: 'creator', render: 'select', options: userOptions },
      { label: '內部ID', prop: 'internal_id', render: 'input-number' }
    )
  }
  
  searchRef.value?.setItems(baseItems)
}

// 許可權控制顯示狀態
const applyVisibilityControl = (userRole: string) => {
  // 遊客使用者隱藏搜尋功能
  if (userRole === 'guest') {
    searchRef.value?.setShowState(false)
  } else {
    searchRef.value?.setShowState(true)
  }
}
```

### 3. 響應式配置調整
根據裝置型別和螢幕尺寸動態調整配置：

```typescript
// 響應式配置調整
const adjustForDevice = () => {
  const isMobile = window.innerWidth < 768
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024
  
  let newOptions = {}
  
  if (isMobile) {
    newOptions = {
      cols: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
      fold: true,
      foldRows: 1
    }
  } else if (isTablet) {
    newOptions = {
      cols: { xs: 1, sm: 2, md: 2, lg: 2, xl: 2 },
      fold: true,
      foldRows: 2
    }
  } else {
    newOptions = {
      cols: { xs: 2, sm: 3, md: 4, lg: 4, xl: 5 },
      fold: false,
      foldRows: 3
    }
  }
  
  searchRef.value?.setOptions(newOptions)
}

// 監聽視窗大小變化
onMounted(() => {
  window.addEventListener('resize', adjustForDevice)
  adjustForDevice() // 初始調整
})

onUnmounted(() => {
  window.removeEventListener('resize', adjustForDevice)
})
```

## 關鍵特性

- 🔧 完整的程式設計介面
- 📊 實時狀態跟蹤
- 🎯 靈活的配置管理
- ⚡ 高效能的方法呼叫
- 🛠 強大的擴充套件能力
- 📝 詳細的操作日誌

## 高階用法示例

### 搜尋模板系統
建立可儲存和載入的搜尋模板：

```typescript
// 搜尋模板管理
class SearchTemplateManager {
  private templates = new Map()
  
  // 儲存當前搜尋配置為模板
  saveTemplate(name: string, searchRef: any) {
    const template = {
      formData: searchRef.getSearchForm(),
      items: searchRef.getItems(),
      options: searchRef.getOptions()
    }
    this.templates.set(name, template)
    
    // 持久化到本地儲存
    localStorage.setItem('searchTemplates', JSON.stringify(Array.from(this.templates)))
  }
  
  // 載入搜尋模板
  loadTemplate(name: string, searchRef: any) {
    const template = this.templates.get(name)
    if (template) {
      searchRef.setItems(template.items)
      searchRef.setOptions(template.options)
      searchRef.setSearchForm(template.formData)
      return true
    }
    return false
  }
  
  // 從本地儲存恢復模板
  loadFromStorage() {
    const stored = localStorage.getItem('searchTemplates')
    if (stored) {
      const templates = JSON.parse(stored)
      this.templates = new Map(templates)
    }
  }
}
```

### 搜尋狀態監控
監控搜尋元件的各種狀態變化：

```typescript
// 狀態監控器
class SearchStateMonitor {
  private logs: any[] = []
  
  // 監控方法呼叫
  monitorMethod(methodName: string, args: any[], result: any) {
    const log = {
      timestamp: new Date(),
      method: methodName,
      arguments: args,
      result: result,
      type: 'method_call'
    }
    this.logs.push(log)
    console.log('方法呼叫:', log)
  }
  
  // 監控狀態變化
  monitorStateChange(stateName: string, oldValue: any, newValue: any) {
    const log = {
      timestamp: new Date(),
      state: stateName,
      oldValue: oldValue,
      newValue: newValue,
      type: 'state_change'
    }
    this.logs.push(log)
    console.log('狀態變化:', log)
  }
  
  // 獲取監控日誌
  getLogs(type?: string) {
    if (type) {
      return this.logs.filter(log => log.type === type)
    }
    return [...this.logs]
  }
  
  // 清除日誌
  clearLogs() {
    this.logs = []
  }
}
```

## 最佳實踐

### 1. 方法呼叫的錯誤處理
```typescript
const safeMethodCall = async (methodName: string, ...args: any[]) => {
  try {
    const method = searchRef.value?.[methodName]
    if (typeof method === 'function') {
      return await method.apply(searchRef.value, args)
    } else {
      throw new Error(`方法 ${methodName} 不存在`)
    }
  } catch (error) {
    console.error(`呼叫方法 ${methodName} 失敗:`, error)
    // 可以新增使用者友好的錯誤提示
    ElMessage.error(`操作失敗: ${error.message}`)
    return null
  }
}
```

### 2. 批次操作最佳化
```typescript
const batchOperations = (operations: Array<() => void>) => {
  // 暫停響應式更新
  const pauseReactivity = () => {
    // 實現暫停邏輯
  }
  
  const resumeReactivity = () => {
    // 實現恢復邏輯
  }
  
  try {
    pauseReactivity()
    operations.forEach(operation => operation())
  } finally {
    resumeReactivity()
  }
}
```

### 3. 狀態同步
```typescript
const syncWithExternalState = (externalState: any) => {
  // 同步表單資料
  if (externalState.formData) {
    searchRef.value?.setSearchForm(externalState.formData)
  }
  
  // 同步配置選項
  if (externalState.options) {
    searchRef.value?.setOptions(externalState.options)
  }
  
  // 同步搜尋項
  if (externalState.items) {
    searchRef.value?.setItems(externalState.items)
  }
}
```

## 相關連結

- [動態管理](./dynamic-items) - 瞭解搜尋項的動態管理
- [自定義操作](./custom-actions) - 瞭解自定義操作按鈕的實現
- [表單驗證](./form-validation) - 瞭解透過方法進行表單驗證