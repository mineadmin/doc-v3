# 加载状态

展示 MaForm 的各种加载状态配置，包括全局加载、局部加载、自定义加载样式和动态加载控制。

<DemoPreview dir="demos/ma-form/loading-states" />

## 功能特性

- **多级加载控制**：支持全局和局部加载状态
- **自定义加载样式**：支持自定义加载图标、文案、颜色等
- **动态加载状态**：支持运行时动态切换加载状态
- **加载遮罩配置**：可配置背景遮罩、锁定滚动等
- **加载插槽支持**：支持完全自定义加载内容

## 基础加载配置

### 1. 全局加载状态

```typescript
// 通过 options 配置全局加载
const formOptions = {
  loading: true,  // 启用加载状态
  loadingConfig: {
    text: '表单加载中...',
    background: 'rgba(0, 0, 0, 0.8)',
    customClass: 'custom-loading'
  }
}

// 通过 props 配置（优先级更高）
<ma-form 
  v-model="formData" 
  :options="formOptions"
  :items="formItems"
  :loading="globalLoading"
/>
```

### 2. 动态控制加载状态

```typescript
// 使用暴露的方法控制加载
const toggleLoading = () => {
  const currentState = formRef.value.getLoadingState()
  formRef.value.setLoadingState(!currentState)
}

// 异步操作时的加载控制
const handleAsyncOperation = async () => {
  formRef.value.setLoadingState(true)
  try {
    await performAsyncTask()
    ElMessage.success('操作完成')
  } catch (error) {
    ElMessage.error('操作失败')
  } finally {
    formRef.value.setLoadingState(false)
  }
}
```

## LoadingConfig 详细配置

### 1. 基础配置选项

```typescript
const loadingConfig = {
  // 加载文案
  text: '数据处理中，请稍候...',
  
  // 自定义图标类名
  spinner: 'el-loading-spinner',
  
  // 自定义 SVG 图标
  svg: `
    <svg viewBox="0 0 50 50" class="circular">
      <circle cx="25" cy="25" r="20" fill="none" class="path"></circle>
    </svg>
  `,
  
  // SVG viewBox 属性
  viewBox: '0 0 50 50',
  
  // 背景遮罩颜色
  background: 'rgba(0, 0, 0, 0.7)',
  
  // 自定义样式类
  customClass: 'my-loading',
  
  // 是否锁定页面滚动
  lock: true,
  
  // 是否全屏显示
  fullscreen: false
}
```

### 2. 不同场景的加载配置

```typescript
// 数据获取加载
const dataLoadingConfig = {
  text: '正在获取数据...',
  spinner: 'el-loading-spinner',
  background: 'rgba(255, 255, 255, 0.9)',
  customClass: 'data-loading'
}

// 表单提交加载
const submitLoadingConfig = {
  text: '正在提交，请稍候...',
  svg: `
    <svg class="loading-svg" viewBox="0 0 120 30" fill="currentColor">
      <circle cx="15" cy="15" r="15">
        <animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"></animate>
        <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate>
      </circle>
    </svg>
  `,
  background: 'rgba(64, 158, 255, 0.1)',
  customClass: 'submit-loading'
}

// 验证加载
const validationLoadingConfig = {
  text: '验证中...',
  spinner: 'custom-validation-spinner',
  background: 'rgba(103, 194, 58, 0.1)',
  customClass: 'validation-loading'
}
```

## 自定义加载样式

### 1. CSS 样式定制

```css
/* 自定义加载样式 */
.custom-loading {
  .el-loading-text {
    color: #409EFF;
    font-size: 14px;
    font-weight: 500;
  }
  
  .el-loading-spinner {
    width: 50px;
    height: 50px;
    
    .circular {
      width: 50px;
      height: 50px;
      animation: loading-rotate 2s linear infinite;
    }
    
    .path {
      stroke: #409EFF;
      stroke-width: 3;
      stroke-linecap: round;
      animation: loading-dash 1.5s ease-in-out infinite;
    }
  }
}

@keyframes loading-rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
```

### 2. 主题适配加载样式

```typescript
// 根据主题动态配置加载样式
const getLoadingConfigByTheme = (theme: 'light' | 'dark') => {
  const configs = {
    light: {
      text: '加载中...',
      background: 'rgba(255, 255, 255, 0.8)',
      customClass: 'light-loading'
    },
    dark: {
      text: '加载中...',
      background: 'rgba(0, 0, 0, 0.8)',
      customClass: 'dark-loading'
    }
  }
  
  return configs[theme]
}

// 动态应用主题加载配置
const applyThemeLoading = (theme: 'light' | 'dark') => {
  const loadingConfig = getLoadingConfigByTheme(theme)
  
  formRef.value.updateOptions(options => ({
    ...options,
    loadingConfig
  }))
}
```

## 局部加载控制

### 1. 字段级加载状态

```typescript
// 单个字段的加载状态
{
  label: '异步验证字段',
  prop: 'asyncField',
  render: 'input',
  renderProps: {
    loading: false,  // 字段级加载状态
    placeholder: '输入后将进行异步验证'
  },
  asyncValidator: async (rule, value) => {
    // 开始验证时显示加载
    formRef.value.updateItem('asyncField', {
      renderProps: { loading: true }
    })
    
    try {
      await validateAsync(value)
    } finally {
      // 验证完成后隐藏加载
      formRef.value.updateItem('asyncField', {
        renderProps: { loading: false }
      })
    }
  }
}
```

### 2. 组件组加载

```typescript
// 为一组相关字段设置加载状态
const setFieldGroupLoading = (fieldProps: string[], loading: boolean) => {
  fieldProps.forEach(prop => {
    formRef.value.updateItem(prop, {
      renderProps: { 
        loading,
        disabled: loading  // 加载时禁用输入
      }
    })
  })
}

// 使用示例
const handleRemoteDataLoad = async () => {
  const relatedFields = ['province', 'city', 'district']
  
  setFieldGroupLoading(relatedFields, true)
  try {
    const data = await fetchLocationData()
    // 更新字段选项
    updateLocationOptions(data)
  } finally {
    setFieldGroupLoading(relatedFields, false)
  }
}
```

## 加载插槽自定义

### 1. 全局加载插槽

```vue
<ma-form 
  v-model="formData" 
  :options="formOptions"
  :items="formItems"
  :loading="loading"
>
  <template #loading="{ loading }">
    <div v-if="loading" class="custom-loading-overlay">
      <!-- 自定义加载内容 -->
      <div class="loading-content">
        <div class="loading-spinner">
          <div class="spinner-dot"></div>
          <div class="spinner-dot"></div>
          <div class="spinner-dot"></div>
        </div>
        <p class="loading-text">{{ loadingText }}</p>
        <el-progress 
          :percentage="loadingProgress" 
          :show-text="false"
          class="loading-progress"
        />
      </div>
    </div>
  </template>
</ma-form>
```

### 2. 动态加载内容

```typescript
// 动态更新加载文案和进度
const loadingMessages = [
  '正在初始化表单...',
  '正在加载配置数据...',
  '正在验证权限...',
  '加载完成'
]

const simulateProgressLoading = async () => {
  formRef.value.setLoadingState(true)
  
  for (let i = 0; i < loadingMessages.length; i++) {
    loadingText.value = loadingMessages[i]
    loadingProgress.value = ((i + 1) / loadingMessages.length) * 100
    
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  formRef.value.setLoadingState(false)
  ElMessage.success('加载完成!')
}
```

### 3. 骨架屏加载

```vue
<ma-form 
  v-model="formData" 
  :options="formOptions"
  :items="formItems"
  :loading="loading"
>
  <template #loading="{ loading }">
    <div v-if="loading" class="skeleton-loading">
      <!-- 模拟表单结构的骨架屏 -->
      <div class="skeleton-item" v-for="n in 4" :key="n">
        <div class="skeleton-label"></div>
        <div class="skeleton-input"></div>
      </div>
    </div>
  </template>
</ma-form>

<style>
.skeleton-loading {
  .skeleton-item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    
    .skeleton-label {
      width: 80px;
      height: 20px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: skeleton-loading 1.5s infinite;
      margin-right: 12px;
    }
    
    .skeleton-input {
      flex: 1;
      height: 32px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: skeleton-loading 1.5s infinite;
      border-radius: 4px;
    }
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
```

## 加载状态最佳实践

### 1. 加载时机控制

```typescript
// 表单初始化加载
const initializeForm = async () => {
  formRef.value.setLoadingState(true)
  
  try {
    // 并行加载数据
    const [formConfig, initialData, optionsData] = await Promise.all([
      fetchFormConfig(),
      fetchInitialData(),
      fetchOptionsData()
    ])
    
    // 应用配置和数据
    formRef.value.setOptions(formConfig)
    formRef.value.setFormData(initialData)
    updateFieldOptions(optionsData)
    
  } catch (error) {
    ElMessage.error('表单初始化失败')
  } finally {
    formRef.value.setLoadingState(false)
  }
}

// 表单提交加载
const submitForm = async () => {
  const isValid = await formRef.value.validate()
  if (!isValid) return
  
  formRef.value.setLoadingState(true)
  
  try {
    const formData = formRef.value.getFormData()
    await submitFormData(formData)
    
    ElMessage.success('提交成功')
  } catch (error) {
    ElMessage.error('提交失败，请重试')
  } finally {
    formRef.value.setLoadingState(false)
  }
}
```

### 2. 用户体验优化

```typescript
// 防止重复操作
const isSubmitting = ref(false)

const handleSubmit = async () => {
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  formRef.value.setLoadingState(true)
  
  try {
    await submitForm()
  } finally {
    isSubmitting.value = false
    formRef.value.setLoadingState(false)
  }
}

// 加载超时处理
const handleLoadingWithTimeout = async (asyncTask: () => Promise<any>, timeout = 30000) => {
  formRef.value.setLoadingState(true)
  
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('操作超时')), timeout)
  })
  
  try {
    await Promise.race([asyncTask(), timeoutPromise])
  } catch (error) {
    if (error.message === '操作超时') {
      ElMessage.error('操作超时，请检查网络连接')
    } else {
      ElMessage.error('操作失败')
    }
  } finally {
    formRef.value.setLoadingState(false)
  }
}
```

### 3. 响应式加载

```typescript
// 根据设备类型调整加载样式
const getResponsiveLoadingConfig = () => {
  const isMobile = formRef.value.isMobileState()
  
  return {
    text: isMobile ? '加载中...' : '正在加载数据，请稍候...',
    customClass: isMobile ? 'mobile-loading' : 'desktop-loading',
    fullscreen: isMobile,  // 移动端全屏加载
    lock: true
  }
}

// 监听响应式变化更新加载配置
watch(() => formRef.value?.isMobileState(), (isMobile) => {
  if (formRef.value) {
    const loadingConfig = getResponsiveLoadingConfig()
    formRef.value.updateOptions(options => ({
      ...options,
      loadingConfig
    }))
  }
})
```

## 相关链接

- [LoadingConfig 配置详解](/zh/front/component/ma-form#loadingconfig-配置)
- [状态管理方法](/zh/front/component/ma-form#状态管理)
- [暴露方法 - 加载状态](/zh/front/component/ma-form/examples/expose-methods#状态管理方法)