# 加載狀態

展示 MaForm 的各種加載狀態配置，包括全局加載、局部加載、自定義加載樣式和動態加載控制。

<DemoPreview dir="demos/ma-form/loading-states" />

## 功能特性

- **多級加載控制**：支持全局和局部加載狀態
- **自定義加載樣式**：支持自定義加載圖標、文案、顏色等
- **動態加載狀態**：支持運行時動態切換加載狀態
- **加載遮罩配置**：可配置背景遮罩、鎖定滾動等
- **加載插槽支持**：支持完全自定義加載內容

## 基礎加載配置

### 1. 全局加載狀態

```typescript
// 通過 options 配置全局加載
const formOptions = {
  loading: true,  // 啓用加載狀態
  loadingConfig: {
    text: '表單加載中...',
    background: 'rgba(0, 0, 0, 0.8)',
    customClass: 'custom-loading'
  }
}

// 通過 props 配置（優先級更高）
<ma-form 
  v-model="formData" 
  :options="formOptions"
  :items="formItems"
  :loading="globalLoading"
/>
```

### 2. 動態控制加載狀態

```typescript
// 使用暴露的方法控制加載
const toggleLoading = () => {
  const currentState = formRef.value.getLoadingState()
  formRef.value.setLoadingState(!currentState)
}

// 異步操作時的加載控制
const handleAsyncOperation = async () => {
  formRef.value.setLoadingState(true)
  try {
    await performAsyncTask()
    ElMessage.success('操作完成')
  } catch (error) {
    ElMessage.error('操作失敗')
  } finally {
    formRef.value.setLoadingState(false)
  }
}
```

## LoadingConfig 詳細配置

### 1. 基礎配置選項

```typescript
const loadingConfig = {
  // 加載文案
  text: '數據處理中，請稍候...',
  
  // 自定義圖標類名
  spinner: 'el-loading-spinner',
  
  // 自定義 SVG 圖標
  svg: `
    <svg viewBox="0 0 50 50" class="circular">
      <circle cx="25" cy="25" r="20" fill="none" class="path"></circle>
    </svg>
  `,
  
  // SVG viewBox 屬性
  viewBox: '0 0 50 50',
  
  // 背景遮罩顏色
  background: 'rgba(0, 0, 0, 0.7)',
  
  // 自定義樣式類
  customClass: 'my-loading',
  
  // 是否鎖定頁面滾動
  lock: true,
  
  // 是否全屏顯示
  fullscreen: false
}
```

### 2. 不同場景的加載配置

```typescript
// 數據獲取加載
const dataLoadingConfig = {
  text: '正在獲取數據...',
  spinner: 'el-loading-spinner',
  background: 'rgba(255, 255, 255, 0.9)',
  customClass: 'data-loading'
}

// 表單提交加載
const submitLoadingConfig = {
  text: '正在提交，請稍候...',
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

// 驗證加載
const validationLoadingConfig = {
  text: '驗證中...',
  spinner: 'custom-validation-spinner',
  background: 'rgba(103, 194, 58, 0.1)',
  customClass: 'validation-loading'
}
```

## 自定義加載樣式

### 1. CSS 樣式定製

```css
/* 自定義加載樣式 */
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

### 2. 主題適配加載樣式

```typescript
// 根據主題動態配置加載樣式
const getLoadingConfigByTheme = (theme: 'light' | 'dark') => {
  const configs = {
    light: {
      text: '加載中...',
      background: 'rgba(255, 255, 255, 0.8)',
      customClass: 'light-loading'
    },
    dark: {
      text: '加載中...',
      background: 'rgba(0, 0, 0, 0.8)',
      customClass: 'dark-loading'
    }
  }
  
  return configs[theme]
}

// 動態應用主題加載配置
const applyThemeLoading = (theme: 'light' | 'dark') => {
  const loadingConfig = getLoadingConfigByTheme(theme)
  
  formRef.value.updateOptions(options => ({
    ...options,
    loadingConfig
  }))
}
```

## 局部加載控制

### 1. 字段級加載狀態

```typescript
// 單個字段的加載狀態
{
  label: '異步驗證字段',
  prop: 'asyncField',
  render: 'input',
  renderProps: {
    loading: false,  // 字段級加載狀態
    placeholder: '輸入後將進行異步驗證'
  },
  asyncValidator: async (rule, value) => {
    // 開始驗證時顯示加載
    formRef.value.updateItem('asyncField', {
      renderProps: { loading: true }
    })
    
    try {
      await validateAsync(value)
    } finally {
      // 驗證完成後隱藏加載
      formRef.value.updateItem('asyncField', {
        renderProps: { loading: false }
      })
    }
  }
}
```

### 2. 組件組加載

```typescript
// 為一組相關字段設置加載狀態
const setFieldGroupLoading = (fieldProps: string[], loading: boolean) => {
  fieldProps.forEach(prop => {
    formRef.value.updateItem(prop, {
      renderProps: { 
        loading,
        disabled: loading  // 加載時禁用輸入
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
    // 更新字段選項
    updateLocationOptions(data)
  } finally {
    setFieldGroupLoading(relatedFields, false)
  }
}
```

## 加載插槽自定義

### 1. 全局加載插槽

```vue
<ma-form 
  v-model="formData" 
  :options="formOptions"
  :items="formItems"
  :loading="loading"
>
  <template #loading="{ loading }">
    <div v-if="loading" class="custom-loading-overlay">
      <!-- 自定義加載內容 -->
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

### 2. 動態加載內容

```typescript
// 動態更新加載文案和進度
const loadingMessages = [
  '正在初始化表單...',
  '正在加載配置數據...',
  '正在驗證權限...',
  '加載完成'
]

const simulateProgressLoading = async () => {
  formRef.value.setLoadingState(true)
  
  for (let i = 0; i < loadingMessages.length; i++) {
    loadingText.value = loadingMessages[i]
    loadingProgress.value = ((i + 1) / loadingMessages.length) * 100
    
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  formRef.value.setLoadingState(false)
  ElMessage.success('加載完成!')
}
```

### 3. 骨架屏加載

```vue
<ma-form 
  v-model="formData" 
  :options="formOptions"
  :items="formItems"
  :loading="loading"
>
  <template #loading="{ loading }">
    <div v-if="loading" class="skeleton-loading">
      <!-- 模擬表單結構的骨架屏 -->
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

## 加載狀態最佳實踐

### 1. 加載時機控制

```typescript
// 表單初始化加載
const initializeForm = async () => {
  formRef.value.setLoadingState(true)
  
  try {
    // 並行加載數據
    const [formConfig, initialData, optionsData] = await Promise.all([
      fetchFormConfig(),
      fetchInitialData(),
      fetchOptionsData()
    ])
    
    // 應用配置和數據
    formRef.value.setOptions(formConfig)
    formRef.value.setFormData(initialData)
    updateFieldOptions(optionsData)
    
  } catch (error) {
    ElMessage.error('表單初始化失敗')
  } finally {
    formRef.value.setLoadingState(false)
  }
}

// 表單提交加載
const submitForm = async () => {
  const isValid = await formRef.value.validate()
  if (!isValid) return
  
  formRef.value.setLoadingState(true)
  
  try {
    const formData = formRef.value.getFormData()
    await submitFormData(formData)
    
    ElMessage.success('提交成功')
  } catch (error) {
    ElMessage.error('提交失敗，請重試')
  } finally {
    formRef.value.setLoadingState(false)
  }
}
```

### 2. 用户體驗優化

```typescript
// 防止重複操作
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

// 加載超時處理
const handleLoadingWithTimeout = async (asyncTask: () => Promise<any>, timeout = 30000) => {
  formRef.value.setLoadingState(true)
  
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('操作超時')), timeout)
  })
  
  try {
    await Promise.race([asyncTask(), timeoutPromise])
  } catch (error) {
    if (error.message === '操作超時') {
      ElMessage.error('操作超時，請檢查網絡連接')
    } else {
      ElMessage.error('操作失敗')
    }
  } finally {
    formRef.value.setLoadingState(false)
  }
}
```

### 3. 響應式加載

```typescript
// 根據設備類型調整加載樣式
const getResponsiveLoadingConfig = () => {
  const isMobile = formRef.value.isMobileState()
  
  return {
    text: isMobile ? '加載中...' : '正在加載數據，請稍候...',
    customClass: isMobile ? 'mobile-loading' : 'desktop-loading',
    fullscreen: isMobile,  // 移動端全屏加載
    lock: true
  }
}

// 監聽響應式變化更新加載配置
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

## 相關鏈接

- [LoadingConfig 配置詳解](/front/component/ma-form#loadingconfig-配置)
- [狀態管理方法](/front/component/ma-form#狀態管理)
- [暴露方法 - 加載狀態](/front/component/ma-form/examples/expose-methods#狀態管理方法)