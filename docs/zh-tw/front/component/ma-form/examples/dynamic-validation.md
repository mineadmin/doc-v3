# 動態驗證

展示 MaForm 的動態驗證功能，包括自定義同步驗證、非同步驗證、聯動驗證和複雜驗證規則。

<DemoPreview dir="demos/ma-form/dynamic-validation" />

## 功能特性

- **多層次驗證**：支援 Element Plus 原生規則、自定義同步驗證、非同步驗證
- **聯動驗證**：欄位間相互依賴的驗證邏輯
- **實時驗證**：輸入過程中的即時驗證反饋
- **非同步驗證**：支援服務端驗證（唯一性檢查等）
- **自定義錯誤訊息**：靈活的錯誤提示定製

## 驗證層次

### 1. Element Plus 原生驗證規則

```typescript
{
  label: '使用者名稱',
  prop: 'username',
  render: 'input',
  itemProps: {
    rules: [
      { required: true, message: '請輸入使用者名稱', trigger: 'blur' },
      { min: 3, max: 15, message: '長度在 3 到 15 個字元', trigger: 'blur' },
      { pattern: /^[a-zA-Z0-9_]+$/, message: '只能包含字母、數字和下劃線', trigger: 'blur' }
    ]
  }
}
```

### 2. 自定義同步驗證

```typescript
{
  label: '確認密碼',
  prop: 'confirmPassword',
  render: 'input',
  renderProps: {
    type: 'password',
    showPassword: true
  },
  customValidator: (rule, value, callback) => {
    if (!value) {
      callback(new Error('請確認密碼'))
    } else if (value !== formData.password) {
      callback(new Error('兩次輸入的密碼不一致'))
    } else {
      callback()
    }
  }
}
```

### 3. 非同步驗證

```typescript
{
  label: '郵箱地址',
  prop: 'email', 
  render: 'input',
  renderProps: {
    type: 'email'
  },
  asyncValidator: async (rule, value) => {
    if (!value) {
      throw new Error('請輸入郵箱地址')
    }
    
    // 郵箱格式驗證
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      throw new Error('請輸入有效的郵箱地址')
    }
    
    // 非同步檢查郵箱是否已存在
    try {
      const exists = await checkEmailExists(value)
      if (exists) {
        throw new Error('該郵箱地址已被註冊')
      }
    } catch (error) {
      if (error.message.includes('已被註冊')) {
        throw error
      }
      throw new Error('郵箱驗證失敗，請稍後再試')
    }
  }
}
```

## 複雜驗證場景

### 1. 聯動驗證

```typescript
const linkedValidationFields = [
  {
    label: '開始日期',
    prop: 'startDate',
    render: 'datePicker',
    renderProps: {
      type: 'date',
      placeholder: '選擇開始日期'
    },
    customValidator: (rule, value, callback) => {
      if (!value) {
        callback(new Error('請選擇開始日期'))
        return
      }
      
      const endDate = formData.endDate
      if (endDate && new Date(value) >= new Date(endDate)) {
        callback(new Error('開始日期必須早於結束日期'))
      } else {
        callback()
        // 觸發結束日期重新驗證
        nextTick(() => {
          if (endDate) {
            formRef.value?.validateField('endDate')
          }
        })
      }
    }
  },
  {
    label: '結束日期',
    prop: 'endDate',
    render: 'datePicker',
    renderProps: {
      type: 'date', 
      placeholder: '選擇結束日期'
    },
    customValidator: (rule, value, callback) => {
      if (!value) {
        callback(new Error('請選擇結束日期'))
        return
      }
      
      const startDate = formData.startDate
      if (startDate && new Date(value) <= new Date(startDate)) {
        callback(new Error('結束日期必須晚於開始日期'))
      } else {
        callback()
        // 觸發開始日期重新驗證
        nextTick(() => {
          if (startDate) {
            formRef.value?.validateField('startDate')
          }
        })
      }
    }
  }
]
```

### 2. 條件驗證

```typescript
{
  label: '手機號碼',
  prop: 'phoneNumber',
  render: 'input',
  customValidator: (rule, value, callback) => {
    // 根據使用者型別決定是否必填
    const userType = formData.userType
    const isRequired = userType === 'individual'
    
    if (isRequired && !value) {
      callback(new Error('個人使用者必須填寫手機號碼'))
      return
    }
    
    if (value && !/^1[3-9]\d{9}$/.test(value)) {
      callback(new Error('請輸入有效的手機號碼'))
      return  
    }
    
    callback()
  },
  dependencies: ['userType']
}
```

### 3. 業務邏輯驗證

```typescript
{
  label: '商品價格',
  prop: 'price',
  render: 'inputNumber',
  renderProps: {
    min: 0,
    precision: 2,
    controlsPosition: 'right'
  },
  customValidator: (rule, value, callback) => {
    if (value === null || value === undefined) {
      callback(new Error('請輸入商品價格'))
      return
    }
    
    if (value <= 0) {
      callback(new Error('商品價格必須大於 0'))
      return
    }
    
    // 業務規則：VIP 商品價格不能低於 100
    const isVipProduct = formData.isVipProduct
    if (isVipProduct && value < 100) {
      callback(new Error('VIP 商品價格不能低於 100 元'))
      return
    }
    
    // 業務規則：促銷商品價格不能高於 1000
    const isPromotional = formData.isPromotional  
    if (isPromotional && value > 1000) {
      callback(new Error('促銷商品價格不能高於 1000 元'))
      return
    }
    
    callback()
  },
  dependencies: ['isVipProduct', 'isPromotional']
}
```

## 非同步驗證最佳實踐

### 1. 防抖處理

```typescript
// 建立防抖函式
const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// 防抖的非同步驗證
const debouncedUsernameCheck = debounce(async (username) => {
  return await checkUsernameExists(username)
}, 500)

{
  label: '使用者名稱',
  prop: 'username',
  render: 'input',
  asyncValidator: async (rule, value) => {
    if (!value) {
      throw new Error('請輸入使用者名稱')
    }
    
    const exists = await debouncedUsernameCheck(value)
    if (exists) {
      throw new Error('使用者名稱已存在')
    }
  }
}
```

### 2. 載入狀態指示

```typescript
{
  label: '使用者名稱',
  prop: 'username', 
  render: 'input',
  renderProps: {
    loading: false  // 透過 updateItem 動態更新
  },
  asyncValidator: async (rule, value) => {
    if (!value) {
      throw new Error('請輸入使用者名稱')
    }
    
    // 顯示載入狀態
    formRef.value?.updateItem('username', {
      renderProps: { loading: true }
    })
    
    try {
      const exists = await checkUsernameExists(value)
      if (exists) {
        throw new Error('使用者名稱已存在')
      }
    } finally {
      // 隱藏載入狀態
      formRef.value?.updateItem('username', {
        renderProps: { loading: false }
      })
    }
  }
}
```

### 3. 錯誤處理

```typescript
{
  label: '郵箱',
  prop: 'email',
  render: 'input',
  asyncValidator: async (rule, value) => {
    try {
      const response = await fetch(`/api/check-email?email=${value}`)
      
      if (!response.ok) {
        // HTTP 錯誤處理
        if (response.status === 429) {
          throw new Error('請求過於頻繁，請稍後再試')
        }
        throw new Error('驗證服務暫時不可用')
      }
      
      const result = await response.json()
      if (result.exists) {
        throw new Error('該郵箱已被註冊')
      }
      
    } catch (error) {
      if (error.name === 'TypeError') {
        // 網路錯誤
        throw new Error('網路連線失敗，請檢查網路設定')
      }
      throw error
    }
  }
}
```

## 驗證時機控制

### 1. 觸發方式配置

```typescript
{
  label: '實時驗證欄位',
  prop: 'realtime',
  render: 'input',
  itemProps: {
    rules: [
      { required: true, message: '此欄位為必填項', trigger: 'change' }  // 輸入時驗證
    ]
  }
}

{
  label: '失焦驗證欄位', 
  prop: 'onblur',
  render: 'input',
  itemProps: {
    rules: [
      { required: true, message: '此欄位為必填項', trigger: 'blur' }   // 失焦時驗證
    ]
  }
}
```

### 2. 手動驗證控制

```typescript
// 驗證特定欄位
const validateSingleField = async (prop) => {
  try {
    const isValid = await formRef.value?.validateField(prop)
    console.log(`欄位 ${prop} 驗證結果:`, isValid)
  } catch (error) {
    console.error(`欄位 ${prop} 驗證失敗:`, error)
  }
}

// 驗證整個表單
const validateForm = async () => {
  try {
    const isValid = await formRef.value?.validate()
    if (isValid) {
      console.log('表單驗證透過')
    }
  } catch (error) {
    console.error('表單驗證失敗:', error)
  }
}
```

## 相關連結

- [MaFormItem 驗證配置](/front/component/ma-form#驗證配置)
- [高階特性 - 動態驗證](/front/component/ma-form#動態驗證)
- [暴露方法 - 表單驗證](/front/component/ma-form#表單驗證)