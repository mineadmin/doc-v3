# ローディング状態

MaFormの各種ローディング状態設定を表示します。グローバルローディング、部分ローディング、カスタムローディングスタイル、動的ローディング制御などが含まれます。

<DemoPreview dir="demos/ma-form/loading-states" />

## 機能特徴

- **多段階ローディング制御**: グローバルおよび部分的なローディング状態をサポート
- **カスタムローディングスタイル**: ローディングアイコン、テキスト、色などのカスタマイズをサポート
- **動的ローディング状態**: 実行時に動的にローディング状態を切り替え可能
- **ローディングマスク設定**: 背景マスク、スクロールロックなどの設定が可能
- **ローディングスロットサポート**: 完全にカスタマイズ可能なローディングコンテンツをサポート

## 基本ローディング設定

### 1. グローバルローディング状態

```typescript
// optionsでグローバルローディングを設定
const formOptions = {
  loading: true,  // ローディング状態を有効化
  loadingConfig: {
    text: 'フォームをロード中...',
    background: 'rgba(0, 0, 0, 0.8)',
    customClass: 'custom-loading'
  }
}

// propsで設定（優先度が高い）
<ma-form 
  v-model="formData" 
  :options="formOptions"
  :items="formItems"
  :loading="globalLoading"
/>
```

### 2. 動的ローディング制御

```typescript
// 公開メソッドを使用してローディングを制御
const toggleLoading = () => {
  const currentState = formRef.value.getLoadingState()
  formRef.value.setLoadingState(!currentState)
}

// 非同期操作時のローディング制御
const handleAsyncOperation = async () => {
  formRef.value.setLoadingState(true)
  try {
    await performAsyncTask()
    ElMessage.success('操作が完了しました')
  } catch (error) {
    ElMessage.error('操作に失敗しました')
  } finally {
    formRef.value.setLoadingState(false)
  }
}
```

## LoadingConfig 詳細設定

### 1. 基本設定オプション

```typescript
const loadingConfig = {
  // ローディングテキスト
  text: 'データ処理中、少々お待ちください...',
  
  // カスタムアイコンクラス名
  spinner: 'el-loading-spinner',
  
  // カスタムSVGアイコン
  svg: `
    <svg viewBox="0 0 50 50" class="circular">
      <circle cx="25" cy="25" r="20" fill="none" class="path"></circle>
    </svg>
  `,
  
  // SVG viewBox属性
  viewBox: '0 0 50 50',
  
  // 背景マスク色
  background: 'rgba(0, 0, 0, 0.7)',
  
  // カスタムスタイルクラス
  customClass: 'my-loading',
  
  // ページスクロールをロックするか
  lock: true,
  
  // フルスクリーン表示するか
  fullscreen: false
}
```

### 2. 異なるシナリオのローディング設定

```typescript
// データ取得ローディング
const dataLoadingConfig = {
  text: 'データを取得中...',
  spinner: 'el-loading-spinner',
  background: 'rgba(255, 255, 255, 0.9)',
  customClass: 'data-loading'
}

// フォーム送信ローディング
const submitLoadingConfig = {
  text: '送信中、少々お待ちください...',
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

// 検証ローディング
const validationLoadingConfig = {
  text: '検証中...',
  spinner: 'custom-validation-spinner',
  background: 'rgba(103, 194, 58, 0.1)',
  customClass: 'validation-loading'
}
```

## カスタムローディングスタイル

### 1. CSSスタイルカスタマイズ

```css
/* カスタムローディングスタイル */
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

### 2. テーマに応じたローディングスタイル

```typescript
// テーマに基づいて動的にローディングスタイルを設定
const getLoadingConfigByTheme = (theme: 'light' | 'dark') => {
  const configs = {
    light: {
      text: 'ロード中...',
      background: 'rgba(255, 255, 255, 0.8)',
      customClass: 'light-loading'
    },
    dark: {
      text: 'ロード中...',
      background: 'rgba(0, 0, 0, 0.8)',
      customClass: 'dark-loading'
    }
  }
  
  return configs[theme]
}

// テーマローディング設定を動的に適用
const applyThemeLoading = (theme: 'light' | 'dark') => {
  const loadingConfig = getLoadingConfigByTheme(theme)
  
  formRef.value.updateOptions(options => ({
    ...options,
    loadingConfig
  }))
}
```

## 部分ローディング制御

### 1. フィールドレベルローディング状態

```typescript
// 単一フィールドのローディング状態
{
  label: '非同期検証フィールド',
  prop: 'asyncField',
  render: 'input',
  renderProps: {
    loading: false,  // フィールドレベルローディング状態
    placeholder: '入力後に非同期検証が行われます'
  },
  asyncValidator: async (rule, value) => {
    // 検証開始時にローディングを表示
    formRef.value.updateItem('asyncField', {
      renderProps: { loading: true }
    })
    
    try {
      await validateAsync(value)
    } finally {
      // 検証完了後にローディングを非表示
      formRef.value.updateItem('asyncField', {
        renderProps: { loading: false }
      })
    }
  }
}
```

### 2. コンポーネントグループローディング

```typescript
// 関連するフィールドグループにローディング状態を設定
const setFieldGroupLoading = (fieldProps: string[], loading: boolean) => {
  fieldProps.forEach(prop => {
    formRef.value.updateItem(prop, {
      renderProps: { 
        loading,
        disabled: loading  // ローディング時に入力を無効化
      }
    })
  })
}

// 使用例
const handleRemoteDataLoad = async () => {
  const relatedFields = ['province', 'city', 'district']
  
  setFieldGroupLoading(relatedFields, true)
  try {
    const data = await fetchLocationData()
    // フィールドオプションを更新
    updateLocationOptions(data)
  } finally {
    setFieldGroupLoading(relatedFields, false)
  }
}
```

## ローディングスロットカスタマイズ

### 1. グローバルローディングスロット

```vue
<ma-form 
  v-model="formData" 
  :options="formOptions"
  :items="formItems"
  :loading="loading"
>
  <template #loading="{ loading }">
    <div v-if="loading" class="custom-loading-overlay">
      <!-- カスタムローディングコンテンツ -->
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

### 2. 動的ローディングコンテンツ

```typescript
// ローディングテキストと進捗を動的に更新
const loadingMessages = [
  'フォームを初期化中...',
  '設定データをロード中...',
  '権限を検証中...',
  'ロード完了'
]

const simulateProgressLoading = async () => {
  formRef.value.setLoadingState(true)
  
  for (let i = 0; i < loadingMessages.length; i++) {
    loadingText.value = loadingMessages[i]
    loadingProgress.value = ((i + 1) / loadingMessages.length) * 100
    
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  formRef.value.setLoadingState(false)
  ElMessage.success('ロード完了!')
}
```

### 3. スケルトンローディング

```vue
<ma-form 
  v-model="formData" 
  :options="formOptions"
  :items="formItems"
  :loading="loading"
>
  <template #loading="{ loading }">
    <div v-if="loading" class="skeleton-loading">
      <!-- フォーム構造を模倣したスケルトン -->
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

## ローディング状態ベストプラクティス

### 1. ローディングタイミング制御

```typescript
// フォーム初期化ローディング
const initializeForm = async () => {
  formRef.value.setLoadingState(true)
  
  try {
    // データを並列でロード
    const [formConfig, initialData, optionsData] = await Promise.all([
      fetchFormConfig(),
      fetchInitialData(),
      fetchOptionsData()
    ])
    
    // 設定とデータを適用
    formRef.value.setOptions(formConfig)
    formRef.value.setFormData(initialData)
    updateFieldOptions(optionsData)
    
  } catch (error) {
    ElMessage.error('フォーム初期化に失敗しました')
  } finally {
    formRef.value.setLoadingState(false)
  }
}

// フォーム送信ローディング
const submitForm = async () => {
  const isValid = await formRef.value.validate()
  if (!isValid) return
  
  formRef.value.setLoadingState(true)
  
  try {
    const formData = formRef.value.getFormData()
    await submitFormData(formData)
    
    ElMessage.success('送信が成功しました')
  } catch (error) {
    ElMessage.error('送信に失敗しました、再試行してください')
  } finally {
    formRef.value.setLoadingState(false)
  }
}
```

### 2. ユーザーエクスペリエンスの最適化

```typescript
// 重複操作を防止
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

// ローディングタイムアウト処理
const handleLoadingWithTimeout = async (asyncTask: () => Promise<any>, timeout = 30000) => {
  formRef.value.setLoadingState(true)
  
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('操作がタイムアウトしました')), timeout)
  })
  
  try {
    await Promise.race([asyncTask(), timeoutPromise])
  } catch (error) {
    if (error.message === '操作がタイムアウトしました') {
      ElMessage.error('操作がタイムアウトしました、ネットワーク接続を確認してください')
    } else {
      ElMessage.error('操作に失敗しました')
    }
  } finally {
    formRef.value.setLoadingState(false)
  }
}
```

### 3. レスポンシブローディング

```typescript
// デバイスタイプに応じてローディングスタイルを調整
const getResponsiveLoadingConfig = () => {
  const isMobile = formRef.value.isMobileState()
  
  return {
    text: isMobile ? 'ロード中...' : 'データをロード中、少々お待ちください...',
    customClass: isMobile ? 'mobile-loading' : 'desktop-loading',
    fullscreen: isMobile,  // モバイルではフルスクリーンローディング
    lock: true
  }
}

// レスポンシブ変更を監視してローディング設定を更新
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

## 関連リンク

- [LoadingConfig 設定詳細](/ja/front/component/ma-form#loadingconfig-設定)
- [状態管理方法](/ja/front/component/ma-form#状態管理)
- [公開メソッド - ローディング状態](/ja/front/component/ma-form/examples/expose-methods#状態管理方法)