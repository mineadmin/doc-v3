# Loading States

Demonstrates various loading state configurations for MaForm, including global loading, partial loading, custom loading styles, and dynamic loading control.

<DemoPreview dir="demos/ma-form/loading-states" />

## Features

- **Multi-level Loading Control**: Supports global and partial loading states
- **Custom Loading Styles**: Supports custom loading icons, text, colors, etc.
- **Dynamic Loading States**: Supports runtime dynamic switching of loading states
- **Loading Mask Configuration**: Configurable background mask, scroll locking, etc.
- **Loading Slot Support**: Supports fully customizable loading content

## Basic Loading Configuration

### 1. Global Loading State

```typescript
// Configure global loading via options
const formOptions = {
  loading: true,  // Enable loading state
  loadingConfig: {
    text: 'Form loading...',
    background: 'rgba(0, 0, 0, 0.8)',
    customClass: 'custom-loading'
  }
}

// Configure via props (higher priority)
<ma-form 
  v-model="formData" 
  :options="formOptions"
  :items="formItems"
  :loading="globalLoading"
/>
```

### 2. Dynamic Loading State Control

```typescript
// Use exposed methods to control loading
const toggleLoading = () => {
  const currentState = formRef.value.getLoadingState()
  formRef.value.setLoadingState(!currentState)
}

// Loading control during async operations
const handleAsyncOperation = async () => {
  formRef.value.setLoadingState(true)
  try {
    await performAsyncTask()
    ElMessage.success('Operation completed')
  } catch (error) {
    ElMessage.error('Operation failed')
  } finally {
    formRef.value.setLoadingState(false)
  }
}
```

## LoadingConfig Detailed Configuration

### 1. Basic Configuration Options

```typescript
const loadingConfig = {
  // Loading text
  text: 'Processing data, please wait...',
  
  // Custom icon class
  spinner: 'el-loading-spinner',
  
  // Custom SVG icon
  svg: `
    <svg viewBox="0 0 50 50" class="circular">
      <circle cx="25" cy="25" r="20" fill="none" class="path"></circle>
    </svg>
  `,
  
  // SVG viewBox attribute
  viewBox: '0 0 50 50',
  
  // Background mask color
  background: 'rgba(0, 0, 0, 0.7)',
  
  // Custom style class
  customClass: 'my-loading',
  
  // Whether to lock page scrolling
  lock: true,
  
  // Whether to display fullscreen
  fullscreen: false
}
```

### 2. Loading Configurations for Different Scenarios

```typescript
// Data fetching loading
const dataLoadingConfig = {
  text: 'Fetching data...',
  spinner: 'el-loading-spinner',
  background: 'rgba(255, 255, 255, 0.9)',
  customClass: 'data-loading'
}

// Form submission loading
const submitLoadingConfig = {
  text: 'Submitting, please wait...',
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

// Validation loading
const validationLoadingConfig = {
  text: 'Validating...',
  spinner: 'custom-validation-spinner',
  background: 'rgba(103, 194, 58, 0.1)',
  customClass: 'validation-loading'
}
```

## Custom Loading Styles

### 1. CSS Style Customization

```css
/* Custom loading styles */
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

### 2. Theme-Adaptive Loading Styles

```typescript
// Dynamically configure loading styles based on theme
const getLoadingConfigByTheme = (theme: 'light' | 'dark') => {
  const configs = {
    light: {
      text: 'Loading...',
      background: 'rgba(255, 255, 255, 0.8)',
      customClass: 'light-loading'
    },
    dark: {
      text: 'Loading...',
      background: 'rgba(0, 0, 0, 0.8)',
      customClass: 'dark-loading'
    }
  }
  
  return configs[theme]
}

// Dynamically apply theme loading configuration
const applyThemeLoading = (theme: 'light' | 'dark') => {
  const loadingConfig = getLoadingConfigByTheme(theme)
  
  formRef.value.updateOptions(options => ({
    ...options,
    loadingConfig
  }))
}
```

## Partial Loading Control

### 1. Field-Level Loading State

```typescript
// Loading state for a single field
{
  label: 'Async Validation Field',
  prop: 'asyncField',
  render: 'input',
  renderProps: {
    loading: false,  // Field-level loading state
    placeholder: 'Async validation will occur after input'
  },
  asyncValidator: async (rule, value) => {
    // Show loading when validation starts
    formRef.value.updateItem('asyncField', {
      renderProps: { loading: true }
    })
    
    try {
      await validateAsync(value)
    } finally {
      // Hide loading after validation completes
      formRef.value.updateItem('asyncField', {
        renderProps: { loading: false }
      })
    }
  }
}
```

### 2. Component Group Loading

```typescript
// Set loading state for a group of related fields
const setFieldGroupLoading = (fieldProps: string[], loading: boolean) => {
  fieldProps.forEach(prop => {
    formRef.value.updateItem(prop, {
      renderProps: { 
        loading,
        disabled: loading  // Disable input during loading
      }
    })
  })
}

// Usage example
const handleRemoteDataLoad = async () => {
  const relatedFields = ['province', 'city', 'district']
  
  setFieldGroupLoading(relatedFields, true)
  try {
    const data = await fetchLocationData()
    // Update field options
    updateLocationOptions(data)
  } finally {
    setFieldGroupLoading(relatedFields, false)
  }
}
```

## Loading Slot Customization

### 1. Global Loading Slot

```vue
<ma-form 
  v-model="formData" 
  :options="formOptions"
  :items="formItems"
  :loading="loading"
>
  <template #loading="{ loading }">
    <div v-if="loading" class="custom-loading-overlay">
      <!-- Custom loading content -->
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

### 2. Dynamic Loading Content

```typescript
// Dynamically update loading text and progress
const loadingMessages = [
  'Initializing form...',
  'Loading configuration data...',
  'Validating permissions...',
  'Loading complete'
]

const simulateProgressLoading = async () => {
  formRef.value.setLoadingState(true)
  
  for (let i = 0; i < loadingMessages.length; i++) {
    loadingText.value = loadingMessages[i]
    loadingProgress.value = ((i + 1) / loadingMessages.length) * 100
    
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  formRef.value.setLoadingState(false)
  ElMessage.success('Loading complete!')
}
```

### 3. Skeleton Loading

```vue
<ma-form 
  v-model="formData" 
  :options="formOptions"
  :items="formItems"
  :loading="loading"
>
  <template #loading="{ loading }">
    <div v-if="loading" class="skeleton-loading">
      <!-- Skeleton screen simulating form structure -->
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

## Loading State Best Practices

### 1. Loading Timing Control

```typescript
// Form initialization loading
const initializeForm = async () => {
  formRef.value.setLoadingState(true)
  
  try {
    // Parallel data loading
    const [formConfig, initialData, optionsData] = await Promise.all([
      fetchFormConfig(),
      fetchInitialData(),
      fetchOptionsData()
    ])
    
    // Apply configuration and data
    formRef.value.setOptions(formConfig)
    formRef.value.setFormData(initialData)
    updateFieldOptions(optionsData)
    
  } catch (error) {
    ElMessage.error('Form initialization failed')
  } finally {
    formRef.value.setLoadingState(false)
  }
}

// Form submission loading
const submitForm = async () => {
  const isValid = await formRef.value.validate()
  if (!isValid) return
  
  formRef.value.setLoadingState(true)
  
  try {
    const formData = formRef.value.getFormData()
    await submitFormData(formData)
    
    ElMessage.success('Submission successful')
  } catch (error) {
    ElMessage.error('Submission failed, please try again')
  } finally {
    formRef.value.setLoadingState(false)
  }
}
```

### 2. User Experience Optimization

```typescript
// Prevent duplicate operations
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

// Loading timeout handling
const handleLoadingWithTimeout = async (asyncTask: () => Promise<any>, timeout = 30000) => {
  formRef.value.setLoadingState(true)
  
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Operation timeout')), timeout)
  })
  
  try {
    await Promise.race([asyncTask(), timeoutPromise])
  } catch (error) {
    if (error.message === 'Operation timeout') {
      ElMessage.error('Operation timeout, please check network connection')
    } else {
      ElMessage.error('Operation failed')
    }
  } finally {
    formRef.value.setLoadingState(false)
  }
}
```

### 3. Responsive Loading

```typescript
// Adjust loading styles based on device type
const getResponsiveLoadingConfig = () => {
  const isMobile = formRef.value.isMobileState()
  
  return {
    text: isMobile ? 'Loading...' : 'Loading data, please wait...',
    customClass: isMobile ? 'mobile-loading' : 'desktop-loading',
    fullscreen: isMobile,  // Fullscreen loading on mobile
    lock: true
  }
}

// Watch responsive changes to update loading configuration
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

## Related Links

- [LoadingConfig Detailed Configuration](/en/front/component/ma-form#loadingconfig-configuration)
- [State Management Methods](/en/front/component/ma-form#state-management)
- [Exposed Methods - Loading States](/en/front/component/ma-form/examples/expose-methods#state-management-methods)