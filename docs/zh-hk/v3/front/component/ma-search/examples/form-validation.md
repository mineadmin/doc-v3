# 表單驗證

演示各種驗證規則和場景，包括基礎驗證、高級驗證、異步驗證、條件驗證等，確保搜索條件的準確性和數據完整性。

## 表單驗證演示

<DemoPreview dir="demos/ma-search/form-validation" />

## 驗證規則説明

### 基礎驗證
最常用的表單驗證規則：

```typescript
// 必填驗證
{
  label: '用户名',
  prop: 'username',
  render: 'input',
  rules: [
    { required: true, message: '用户名不能為空', trigger: 'blur' }
  ]
}

// 長度驗證
{
  label: '描述',
  prop: 'description', 
  render: 'input',
  rules: [
    { min: 10, max: 100, message: '描述長度在10-100個字符之間', trigger: 'blur' }
  ]
}
```

### 格式驗證
郵箱、手機號、URL等格式驗證：

```typescript
// 郵箱驗證
{
  label: '郵箱',
  prop: 'email',
  render: 'input',
  rules: [
    { required: true, message: '郵箱不能為空', trigger: 'blur' },
    { type: 'email', message: '郵箱格式不正確', trigger: 'blur' }
  ]
}

// 自定義正則驗證
{
  label: '手機號',
  prop: 'phone',
  render: 'input',
  rules: [
    { 
      pattern: /^1[3-9]\d{9}$/, 
      message: '請輸入正確的手機號', 
      trigger: 'blur' 
    }
  ]
}
```

### 數值範圍驗證
數字輸入的範圍驗證：

```typescript
// 數值範圍驗證
{
  label: '年齡',
  prop: 'age',
  render: 'input-number',
  rules: [
    { type: 'number', min: 18, max: 65, message: '年齡必須在18-65之間', trigger: 'blur' }
  ]
}

// 金額驗證
{
  label: '價格',
  prop: 'price',
  render: 'input-number',
  rules: [
    { required: true, message: '價格不能為空', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '價格必須大於0', trigger: 'blur' }
  ]
}
```

## 高級驗證場景

### 異步驗證
支持服務端驗證的異步驗證規則：

```typescript
// 異步驗證示例
{
  label: '用户名',
  prop: 'username',
  render: 'input',
  rules: [
    {
      validator: async (rule: any, value: string) => {
        if (!value) return
        
        // 模擬異步驗證
        const response = await checkUsernameExists(value)
        if (response.exists) {
          throw new Error('用户名已存在')
        }
      },
      trigger: 'blur'
    }
  ]
}

// 防抖異步驗證
{
  label: '企業名稱',
  prop: 'company',
  render: 'input',
  rules: [
    {
      validator: debounce(async (rule: any, value: string) => {
        if (!value) return
        
        const isValid = await validateCompanyName(value)
        if (!isValid) {
          throw new Error('企業名稱不符合規範')
        }
      }, 500),
      trigger: 'change'
    }
  ]
}
```

### 條件驗證
根據其他字段值進行條件驗證：

```typescript
// 條件驗證示例
const createConditionalRules = () => {
  return [
    {
      validator: (rule: any, value: string) => {
        const formData = searchRef.value?.getSearchForm()
        
        // 當選擇"企業用户"時，企業名稱為必填
        if (formData?.userType === 'enterprise' && !value) {
          throw new Error('企業用户必須填寫企業名稱')
        }
      },
      trigger: 'blur'
    }
  ]
}

// 應用條件驗證
{
  label: '企業名稱',
  prop: 'company',
  render: 'input',
  rules: createConditionalRules()
}
```

### 組合驗證
多個字段聯合驗證：

```typescript
// 密碼確認驗證
{
  label: '確認密碼',
  prop: 'confirmPassword',
  render: 'input',
  props: { type: 'password' },
  rules: [
    {
      validator: (rule: any, value: string) => {
        const formData = searchRef.value?.getSearchForm()
        
        if (value !== formData?.password) {
          throw new Error('兩次輸入的密碼不一致')
        }
      },
      trigger: 'blur'
    }
  ]
}

// 日期範圍驗證
{
  label: '結束時間',
  prop: 'endDate',
  render: 'date-picker',
  rules: [
    {
      validator: (rule: any, value: string) => {
        const formData = searchRef.value?.getSearchForm()
        
        if (value && formData?.startDate && new Date(value) < new Date(formData.startDate)) {
          throw new Error('結束時間不能早於開始時間')
        }
      },
      trigger: 'change'
    }
  ]
}
```

## 使用場景

### 1. 用户註冊搜索
用户註冊信息的嚴格驗證：

```typescript
const userRegisterSearchItems = [
  {
    label: '用户名',
    prop: 'username',
    render: 'input',
    rules: [
      { required: true, message: '用户名不能為空' },
      { min: 3, max: 20, message: '用户名長度在3-20個字符' },
      { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、數字、下劃線' }
    ]
  },
  {
    label: '郵箱',
    prop: 'email',
    render: 'input',
    rules: [
      { required: true, message: '郵箱不能為空' },
      { type: 'email', message: '郵箱格式不正確' }
    ]
  }
]
```

### 2. 金融數據查詢
金融領域的精確數據驗證：

```typescript
const financialSearchItems = [
  {
    label: '交易金額',
    prop: 'amount',
    render: 'input-number',
    rules: [
      { required: true, message: '交易金額不能為空' },
      { type: 'number', min: 0.01, max: 999999.99, message: '金額範圍0.01-999999.99' }
    ]
  },
  {
    label: '賬户號碼',
    prop: 'account',
    render: 'input',
    rules: [
      { required: true, message: '賬户號碼不能為空' },
      { pattern: /^\d{16,19}$/, message: '賬户號碼必須是16-19位數字' }
    ]
  }
]
```

### 3. 訂單管理驗證
訂單查詢的業務規則驗證：

```typescript
const orderSearchItems = [
  {
    label: '訂單號',
    prop: 'orderNo',
    render: 'input',
    rules: [
      { pattern: /^ORD\d{12}$/, message: '訂單號格式：ORD+12位數字' }
    ]
  },
  {
    label: '訂單金額',
    prop: 'orderAmount',
    render: 'input-number',
    rules: [
      { type: 'number', min: 1, message: '訂單金額必須大於0' }
    ]
  }
]
```

## 關鍵特性

- ✅ 完整的驗證規則支持
- 🔄 異步驗證能力
- 🎯 條件驗證和聯合驗證
- 📝 友好的錯誤提示
- ⚡ 高性能的驗證機制
- 🛡 數據安全和完整性保障

## 驗證時機控制

### 觸發方式配置
不同的驗證觸發時機：

```typescript
// 實時驗證
{
  rules: [
    { required: true, message: '不能為空', trigger: 'change' }
  ]
}

// 失焦驗證
{
  rules: [
    { type: 'email', message: '郵箱格式不正確', trigger: 'blur' }
  ]
}

// 手動驗證
{
  rules: [
    { 
      validator: validateAsync, 
      trigger: 'manual'  // 需要手動調用驗證
    }
  ]
}
```

### 驗證狀態管理
獲取和控制驗證狀態：

```typescript
// 驗證單個字段
const validateField = async (prop: string) => {
  const formRef = searchRef.value?.getMaFormRef()
  try {
    await formRef?.validateField(prop)
    console.log(`${prop}字段驗證通過`)
  } catch (error) {
    console.log(`${prop}字段驗證失敗:`, error)
  }
}

// 驗證整個表單
const validateForm = async () => {
  const formRef = searchRef.value?.getMaFormRef()
  try {
    await formRef?.validate()
    console.log('表單驗證通過，可以提交搜索')
    return true
  } catch (error) {
    console.log('表單驗證失敗:', error)
    return false
  }
}

// 清除驗證狀態
const clearValidation = () => {
  const formRef = searchRef.value?.getMaFormRef()
  formRef?.clearValidate()
}
```

## 最佳實踐

### 1. 用户體驗優化
- 提供實時的驗證反饋
- 使用友好的錯誤提示信息
- 支持錯誤信息的國際化

```typescript
// 友好的錯誤提示
const createFriendlyRules = (fieldName: string) => [
  { 
    required: true, 
    message: `請輸入${fieldName}`, 
    trigger: 'blur' 
  },
  {
    validator: (rule: any, value: string) => {
      if (value && value.length < 2) {
        throw new Error(`${fieldName}至少需要2個字符`)
      }
    },
    trigger: 'blur'
  }
]
```

### 2. 性能優化
- 使用防抖處理頻繁驗證
- 異步驗證的錯誤處理
- 驗證緩存機制

```typescript
// 驗證緩存
const validationCache = new Map()

const cachedValidator = (cacheKey: string, validator: Function) => {
  return async (rule: any, value: string) => {
    if (validationCache.has(cacheKey + value)) {
      const result = validationCache.get(cacheKey + value)
      if (result.error) {
        throw new Error(result.error)
      }
      return
    }
    
    try {
      await validator(rule, value)
      validationCache.set(cacheKey + value, { success: true })
    } catch (error) {
      validationCache.set(cacheKey + value, { error: error.message })
      throw error
    }
  }
}
```

### 3. 可維護性
- 提取通用的驗證規則
- 創建驗證規則工廠函數
- 支持驗證規則的動態配置

```typescript
// 通用驗證規則庫
const ValidationRules = {
  required: (message?: string) => ({
    required: true,
    message: message || '此字段為必填項',
    trigger: 'blur'
  }),
  
  email: (message?: string) => ({
    type: 'email',
    message: message || '郵箱格式不正確',
    trigger: 'blur'
  }),
  
  phone: (message?: string) => ({
    pattern: /^1[3-9]\d{9}$/,
    message: message || '請輸入正確的手機號',
    trigger: 'blur'
  }),
  
  range: (min: number, max: number, message?: string) => ({
    type: 'number',
    min,
    max,
    message: message || `值必須在${min}-${max}之間`,
    trigger: 'blur'
  })
}

// 使用通用規則
{
  label: '郵箱',
  prop: 'email',
  render: 'input',
  rules: [
    ValidationRules.required(),
    ValidationRules.email()
  ]
}
```

## 相關鏈接

- [高級搜索](./advanced-search) - 瞭解複雜搜索場景下的驗證應用
- [表格集成](./table-integration) - 瞭解驗證在數據提交前的作用
- [方法演示](./methods-demo) - 瞭解驗證相關的組件方法