# 动态验证

展示 MaForm 的动态验证功能，包括自定义同步验证、异步验证、联动验证和复杂验证规则。

<DemoPreview dir="demos/ma-form/dynamic-validation" />

## 功能特性

- **多层次验证**：支持 Element Plus 原生规则、自定义同步验证、异步验证
- **联动验证**：字段间相互依赖的验证逻辑
- **实时验证**：输入过程中的即时验证反馈
- **异步验证**：支持服务端验证（唯一性检查等）
- **自定义错误消息**：灵活的错误提示定制

## 验证层次

### 1. Element Plus 原生验证规则

```typescript
{
  label: '用户名',
  prop: 'username',
  render: 'input',
  itemProps: {
    rules: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' },
      { pattern: /^[a-zA-Z0-9_]+$/, message: '只能包含字母、数字和下划线', trigger: 'blur' }
    ]
  }
}
```

### 2. 自定义同步验证

```typescript
{
  label: '确认密码',
  prop: 'confirmPassword',
  render: 'input',
  renderProps: {
    type: 'password',
    showPassword: true
  },
  customValidator: (rule, value, callback) => {
    if (!value) {
      callback(new Error('请确认密码'))
    } else if (value !== formData.password) {
      callback(new Error('两次输入的密码不一致'))
    } else {
      callback()
    }
  }
}
```

### 3. 异步验证

```typescript
{
  label: '邮箱地址',
  prop: 'email', 
  render: 'input',
  renderProps: {
    type: 'email'
  },
  asyncValidator: async (rule, value) => {
    if (!value) {
      throw new Error('请输入邮箱地址')
    }
    
    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      throw new Error('请输入有效的邮箱地址')
    }
    
    // 异步检查邮箱是否已存在
    try {
      const exists = await checkEmailExists(value)
      if (exists) {
        throw new Error('该邮箱地址已被注册')
      }
    } catch (error) {
      if (error.message.includes('已被注册')) {
        throw error
      }
      throw new Error('邮箱验证失败，请稍后再试')
    }
  }
}
```

## 复杂验证场景

### 1. 联动验证

```typescript
const linkedValidationFields = [
  {
    label: '开始日期',
    prop: 'startDate',
    render: 'datePicker',
    renderProps: {
      type: 'date',
      placeholder: '选择开始日期'
    },
    customValidator: (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择开始日期'))
        return
      }
      
      const endDate = formData.endDate
      if (endDate && new Date(value) >= new Date(endDate)) {
        callback(new Error('开始日期必须早于结束日期'))
      } else {
        callback()
        // 触发结束日期重新验证
        nextTick(() => {
          if (endDate) {
            formRef.value?.validateField('endDate')
          }
        })
      }
    }
  },
  {
    label: '结束日期',
    prop: 'endDate',
    render: 'datePicker',
    renderProps: {
      type: 'date', 
      placeholder: '选择结束日期'
    },
    customValidator: (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择结束日期'))
        return
      }
      
      const startDate = formData.startDate
      if (startDate && new Date(value) <= new Date(startDate)) {
        callback(new Error('结束日期必须晚于开始日期'))
      } else {
        callback()
        // 触发开始日期重新验证
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

### 2. 条件验证

```typescript
{
  label: '手机号码',
  prop: 'phoneNumber',
  render: 'input',
  customValidator: (rule, value, callback) => {
    // 根据用户类型决定是否必填
    const userType = formData.userType
    const isRequired = userType === 'individual'
    
    if (isRequired && !value) {
      callback(new Error('个人用户必须填写手机号码'))
      return
    }
    
    if (value && !/^1[3-9]\d{9}$/.test(value)) {
      callback(new Error('请输入有效的手机号码'))
      return  
    }
    
    callback()
  },
  dependencies: ['userType']
}
```

### 3. 业务逻辑验证

```typescript
{
  label: '商品价格',
  prop: 'price',
  render: 'inputNumber',
  renderProps: {
    min: 0,
    precision: 2,
    controlsPosition: 'right'
  },
  customValidator: (rule, value, callback) => {
    if (value === null || value === undefined) {
      callback(new Error('请输入商品价格'))
      return
    }
    
    if (value <= 0) {
      callback(new Error('商品价格必须大于 0'))
      return
    }
    
    // 业务规则：VIP 商品价格不能低于 100
    const isVipProduct = formData.isVipProduct
    if (isVipProduct && value < 100) {
      callback(new Error('VIP 商品价格不能低于 100 元'))
      return
    }
    
    // 业务规则：促销商品价格不能高于 1000
    const isPromotional = formData.isPromotional  
    if (isPromotional && value > 1000) {
      callback(new Error('促销商品价格不能高于 1000 元'))
      return
    }
    
    callback()
  },
  dependencies: ['isVipProduct', 'isPromotional']
}
```

## 异步验证最佳实践

### 1. 防抖处理

```typescript
// 创建防抖函数
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

// 防抖的异步验证
const debouncedUsernameCheck = debounce(async (username) => {
  return await checkUsernameExists(username)
}, 500)

{
  label: '用户名',
  prop: 'username',
  render: 'input',
  asyncValidator: async (rule, value) => {
    if (!value) {
      throw new Error('请输入用户名')
    }
    
    const exists = await debouncedUsernameCheck(value)
    if (exists) {
      throw new Error('用户名已存在')
    }
  }
}
```

### 2. 加载状态指示

```typescript
{
  label: '用户名',
  prop: 'username', 
  render: 'input',
  renderProps: {
    loading: false  // 通过 updateItem 动态更新
  },
  asyncValidator: async (rule, value) => {
    if (!value) {
      throw new Error('请输入用户名')
    }
    
    // 显示加载状态
    formRef.value?.updateItem('username', {
      renderProps: { loading: true }
    })
    
    try {
      const exists = await checkUsernameExists(value)
      if (exists) {
        throw new Error('用户名已存在')
      }
    } finally {
      // 隐藏加载状态
      formRef.value?.updateItem('username', {
        renderProps: { loading: false }
      })
    }
  }
}
```

### 3. 错误处理

```typescript
{
  label: '邮箱',
  prop: 'email',
  render: 'input',
  asyncValidator: async (rule, value) => {
    try {
      const response = await fetch(`/api/check-email?email=${value}`)
      
      if (!response.ok) {
        // HTTP 错误处理
        if (response.status === 429) {
          throw new Error('请求过于频繁，请稍后再试')
        }
        throw new Error('验证服务暂时不可用')
      }
      
      const result = await response.json()
      if (result.exists) {
        throw new Error('该邮箱已被注册')
      }
      
    } catch (error) {
      if (error.name === 'TypeError') {
        // 网络错误
        throw new Error('网络连接失败，请检查网络设置')
      }
      throw error
    }
  }
}
```

## 验证时机控制

### 1. 触发方式配置

```typescript
{
  label: '实时验证字段',
  prop: 'realtime',
  render: 'input',
  itemProps: {
    rules: [
      { required: true, message: '此字段为必填项', trigger: 'change' }  // 输入时验证
    ]
  }
}

{
  label: '失焦验证字段', 
  prop: 'onblur',
  render: 'input',
  itemProps: {
    rules: [
      { required: true, message: '此字段为必填项', trigger: 'blur' }   // 失焦时验证
    ]
  }
}
```

### 2. 手动验证控制

```typescript
// 验证特定字段
const validateSingleField = async (prop) => {
  try {
    const isValid = await formRef.value?.validateField(prop)
    console.log(`字段 ${prop} 验证结果:`, isValid)
  } catch (error) {
    console.error(`字段 ${prop} 验证失败:`, error)
  }
}

// 验证整个表单
const validateForm = async () => {
  try {
    const isValid = await formRef.value?.validate()
    if (isValid) {
      console.log('表单验证通过')
    }
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}
```

## 相关链接

- [MaFormItem 验证配置](/front/component/ma-form#验证配置)
- [高级特性 - 动态验证](/front/component/ma-form#动态验证)
- [暴露方法 - 表单验证](/front/component/ma-form#表单验证)