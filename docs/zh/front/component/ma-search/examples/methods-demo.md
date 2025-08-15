# 方法演示

展示所有暴露方法的使用，包含实时状态跟踪和操作日志记录，帮助开发者深入了解组件的编程接口和高级用法。

## 方法演示

<DemoPreview dir="demos/ma-search/methods-demo" />

## 暴露方法详解

### 表单数据管理
操作和获取搜索表单的数据：

```typescript
// 设置搜索表单数据
const setFormData = () => {
  const newData = {
    username: 'admin',
    status: 'active',
    created_at: '2024-01-01'
  }
  searchRef.value?.setSearchForm(newData)
}

// 获取当前搜索表单数据
const getFormData = () => {
  const formData = searchRef.value?.getSearchForm()
  console.log('当前表单数据:', formData)
  return formData
}

// 清空表单数据
const clearFormData = () => {
  searchRef.value?.setSearchForm({})
}
```

### 折叠状态控制
管理搜索面板的折叠展开状态：

```typescript
// 切换折叠状态
const toggleFold = () => {
  searchRef.value?.foldToggle()
}

// 获取当前折叠状态
const getCurrentFoldState = () => {
  const isFold = searchRef.value?.getFold()
  console.log('当前折叠状态:', isFold ? '已折叠' : '已展开')
  return isFold
}

// 程序化设置折叠状态
const setFoldState = (fold: boolean) => {
  const currentState = searchRef.value?.getFold()
  if (currentState !== fold) {
    searchRef.value?.foldToggle()
  }
}
```

### 显示状态管理
控制整个搜索组件的显示和隐藏：

```typescript
// 设置显示状态
const setVisibility = (visible: boolean) => {
  searchRef.value?.setShowState(visible)
}

// 获取当前显示状态
const getVisibility = () => {
  const isVisible = searchRef.value?.getShowState()
  console.log('组件显示状态:', isVisible ? '显示' : '隐藏')
  return isVisible
}

// 切换显示状态
const toggleVisibility = () => {
  const currentState = searchRef.value?.getShowState()
  searchRef.value?.setShowState(!currentState)
}
```

### 配置动态管理
动态修改组件的各种配置选项：

```typescript
// 动态设置搜索选项
const updateSearchOptions = () => {
  const newOptions = {
    cols: { xs: 1, sm: 2, md: 3, lg: 4 },
    fold: true,
    foldRows: 3,
    text: {
      searchBtn: '立即查询',
      resetBtn: '重置条件'
    }
  }
  searchRef.value?.setOptions(newOptions)
}

// 动态设置表单选项  
const updateFormOptions = () => {
  const formOptions = {
    labelWidth: '120px',
    labelPosition: 'right',
    size: 'large'
  }
  searchRef.value?.setFormOptions(formOptions)
}

// 获取当前配置
const getCurrentConfig = () => {
  const searchOptions = searchRef.value?.getOptions()
  const formOptions = searchRef.value?.getFormOptions()
  
  console.log('搜索组件配置:', searchOptions)
  console.log('表单组件配置:', formOptions)
  
  return { searchOptions, formOptions }
}
```

### 搜索项动态管理
运行时动态修改搜索项配置：

```typescript
// 批量设置搜索项
const setBatchItems = () => {
  const newItems = [
    { label: '用户ID', prop: 'user_id', render: 'input-number' },
    { label: '用户名', prop: 'username', render: 'input' },
    { label: '邮箱', prop: 'email', render: 'input' },
    { label: '状态', prop: 'status', render: 'select', options: statusOptions }
  ]
  searchRef.value?.setItems(newItems)
}

// 追加单个搜索项
const appendSingleItem = () => {
  const newItem = {
    label: '注册时间',
    prop: 'created_at',
    render: 'date-picker',
    props: {
      type: 'daterange',
      format: 'YYYY-MM-DD'
    }
  }
  searchRef.value?.appendItem(newItem)
}

// 删除指定搜索项
const removeSpecificItem = (prop: string) => {
  searchRef.value?.removeItem(prop)
}

// 查找特定搜索项
const findItemByProp = (prop: string) => {
  const item = searchRef.value?.getItemByProp(prop)
  if (item) {
    console.log(`找到搜索项:`, item)
  } else {
    console.log(`未找到 prop 为 "${prop}" 的搜索项`)
  }
  return item
}

// 获取所有搜索项
const getAllItems = () => {
  const items = searchRef.value?.getItems()
  console.log('所有搜索项:', items)
  return items
}
```

### 表单引用获取
获取内部 ma-form 组件引用进行更底层操作：

```typescript
// 获取表单引用
const getFormRef = () => {
  const formRef = searchRef.value?.getMaFormRef()
  if (formRef) {
    console.log('获取到表单引用:', formRef)
    return formRef
  }
}

// 通过表单引用进行验证
const validateViaFormRef = async () => {
  const formRef = searchRef.value?.getMaFormRef()
  if (formRef) {
    try {
      await formRef.validate()
      console.log('表单验证通过')
      return true
    } catch (error) {
      console.log('表单验证失败:', error)
      return false
    }
  }
}

// 重置表单通过引用
const resetViaFormRef = () => {
  const formRef = searchRef.value?.getMaFormRef()
  if (formRef) {
    formRef.resetFields()
    console.log('表单已重置')
  }
}
```

## 使用场景

### 1. 搜索条件预设
根据业务场景预设不同的搜索条件：

```typescript
// 预设搜索场景
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

// 应用预设场景
const applyPreset = (scenario: keyof typeof presetScenarios) => {
  presetScenarios[scenario]()
}
```

### 2. 权限控制
根据用户权限动态调整搜索功能：

```typescript
// 权限控制搜索项
const applyPermissionControl = (userRole: string) => {
  const baseItems = [
    { label: '用户名', prop: 'username', render: 'input' },
    { label: '状态', prop: 'status', render: 'select', options: statusOptions }
  ]
  
  // 管理员可以看到更多搜索项
  if (userRole === 'admin') {
    baseItems.push(
      { label: '创建人', prop: 'creator', render: 'select', options: userOptions },
      { label: '内部ID', prop: 'internal_id', render: 'input-number' }
    )
  }
  
  searchRef.value?.setItems(baseItems)
}

// 权限控制显示状态
const applyVisibilityControl = (userRole: string) => {
  // 游客用户隐藏搜索功能
  if (userRole === 'guest') {
    searchRef.value?.setShowState(false)
  } else {
    searchRef.value?.setShowState(true)
  }
}
```

### 3. 响应式配置调整
根据设备类型和屏幕尺寸动态调整配置：

```typescript
// 响应式配置调整
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

// 监听窗口大小变化
onMounted(() => {
  window.addEventListener('resize', adjustForDevice)
  adjustForDevice() // 初始调整
})

onUnmounted(() => {
  window.removeEventListener('resize', adjustForDevice)
})
```

## 关键特性

- 🔧 完整的编程接口
- 📊 实时状态跟踪
- 🎯 灵活的配置管理
- ⚡ 高性能的方法调用
- 🛠 强大的扩展能力
- 📝 详细的操作日志

## 高级用法示例

### 搜索模板系统
创建可保存和加载的搜索模板：

```typescript
// 搜索模板管理
class SearchTemplateManager {
  private templates = new Map()
  
  // 保存当前搜索配置为模板
  saveTemplate(name: string, searchRef: any) {
    const template = {
      formData: searchRef.getSearchForm(),
      items: searchRef.getItems(),
      options: searchRef.getOptions()
    }
    this.templates.set(name, template)
    
    // 持久化到本地存储
    localStorage.setItem('searchTemplates', JSON.stringify(Array.from(this.templates)))
  }
  
  // 加载搜索模板
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
  
  // 从本地存储恢复模板
  loadFromStorage() {
    const stored = localStorage.getItem('searchTemplates')
    if (stored) {
      const templates = JSON.parse(stored)
      this.templates = new Map(templates)
    }
  }
}
```

### 搜索状态监控
监控搜索组件的各种状态变化：

```typescript
// 状态监控器
class SearchStateMonitor {
  private logs: any[] = []
  
  // 监控方法调用
  monitorMethod(methodName: string, args: any[], result: any) {
    const log = {
      timestamp: new Date(),
      method: methodName,
      arguments: args,
      result: result,
      type: 'method_call'
    }
    this.logs.push(log)
    console.log('方法调用:', log)
  }
  
  // 监控状态变化
  monitorStateChange(stateName: string, oldValue: any, newValue: any) {
    const log = {
      timestamp: new Date(),
      state: stateName,
      oldValue: oldValue,
      newValue: newValue,
      type: 'state_change'
    }
    this.logs.push(log)
    console.log('状态变化:', log)
  }
  
  // 获取监控日志
  getLogs(type?: string) {
    if (type) {
      return this.logs.filter(log => log.type === type)
    }
    return [...this.logs]
  }
  
  // 清除日志
  clearLogs() {
    this.logs = []
  }
}
```

## 最佳实践

### 1. 方法调用的错误处理
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
    console.error(`调用方法 ${methodName} 失败:`, error)
    // 可以添加用户友好的错误提示
    ElMessage.error(`操作失败: ${error.message}`)
    return null
  }
}
```

### 2. 批量操作优化
```typescript
const batchOperations = (operations: Array<() => void>) => {
  // 暂停响应式更新
  const pauseReactivity = () => {
    // 实现暂停逻辑
  }
  
  const resumeReactivity = () => {
    // 实现恢复逻辑
  }
  
  try {
    pauseReactivity()
    operations.forEach(operation => operation())
  } finally {
    resumeReactivity()
  }
}
```

### 3. 状态同步
```typescript
const syncWithExternalState = (externalState: any) => {
  // 同步表单数据
  if (externalState.formData) {
    searchRef.value?.setSearchForm(externalState.formData)
  }
  
  // 同步配置选项
  if (externalState.options) {
    searchRef.value?.setOptions(externalState.options)
  }
  
  // 同步搜索项
  if (externalState.items) {
    searchRef.value?.setItems(externalState.items)
  }
}
```

## 相关链接

- [动态管理](./dynamic-items) - 了解搜索项的动态管理
- [自定义操作](./custom-actions) - 了解自定义操作按钮的实现
- [表单验证](./form-validation) - 了解通过方法进行表单验证