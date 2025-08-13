# 表单验证

演示各种验证规则和场景，包括基础验证、高级验证、异步验证、条件验证等，确保搜索条件的准确性和数据完整性。

## 表单验证演示

<DemoPreview dir="demos/ma-search/form-validation" />

## 验证规则说明

### 基础验证
最常用的表单验证规则：

```typescript
// 必填验证
{
  label: '用户名',
  prop: 'username',
  render: 'input',
  rules: [
    { required: true, message: '用户名不能为空', trigger: 'blur' }
  ]
}

// 长度验证
{
  label: '描述',
  prop: 'description', 
  render: 'input',
  rules: [
    { min: 10, max: 100, message: '描述长度在10-100个字符之间', trigger: 'blur' }
  ]
}
```

### 格式验证
邮箱、手机号、URL等格式验证：

```typescript
// 邮箱验证
{
  label: '邮箱',
  prop: 'email',
  render: 'input',
  rules: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ]
}

// 自定义正则验证
{
  label: '手机号',
  prop: 'phone',
  render: 'input',
  rules: [
    { 
      pattern: /^1[3-9]\d{9}$/, 
      message: '请输入正确的手机号', 
      trigger: 'blur' 
    }
  ]
}
```

### 数值范围验证
数字输入的范围验证：

```typescript
// 数值范围验证
{
  label: '年龄',
  prop: 'age',
  render: 'input-number',
  rules: [
    { type: 'number', min: 18, max: 65, message: '年龄必须在18-65之间', trigger: 'blur' }
  ]
}

// 金额验证
{
  label: '价格',
  prop: 'price',
  render: 'input-number',
  rules: [
    { required: true, message: '价格不能为空', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '价格必须大于0', trigger: 'blur' }
  ]
}
```

## 高级验证场景

### 异步验证
支持服务端验证的异步验证规则：

```typescript
// 异步验证示例
{
  label: '用户名',
  prop: 'username',
  render: 'input',
  rules: [
    {
      validator: async (rule: any, value: string) => {
        if (!value) return
        
        // 模拟异步验证
        const response = await checkUsernameExists(value)
        if (response.exists) {
          throw new Error('用户名已存在')
        }
      },
      trigger: 'blur'
    }
  ]
}

// 防抖异步验证
{
  label: '企业名称',
  prop: 'company',
  render: 'input',
  rules: [
    {
      validator: debounce(async (rule: any, value: string) => {
        if (!value) return
        
        const isValid = await validateCompanyName(value)
        if (!isValid) {
          throw new Error('企业名称不符合规范')
        }
      }, 500),
      trigger: 'change'
    }
  ]
}
```

### 条件验证
根据其他字段值进行条件验证：

```typescript
// 条件验证示例
const createConditionalRules = () => {
  return [
    {
      validator: (rule: any, value: string) => {
        const formData = searchRef.value?.getSearchForm()
        
        // 当选择"企业用户"时，企业名称为必填
        if (formData?.userType === 'enterprise' && !value) {
          throw new Error('企业用户必须填写企业名称')
        }
      },
      trigger: 'blur'
    }
  ]
}

// 应用条件验证
{
  label: '企业名称',
  prop: 'company',
  render: 'input',
  rules: createConditionalRules()
}
```

### 组合验证
多个字段联合验证：

```typescript
// 密码确认验证
{
  label: '确认密码',
  prop: 'confirmPassword',
  render: 'input',
  props: { type: 'password' },
  rules: [
    {
      validator: (rule: any, value: string) => {
        const formData = searchRef.value?.getSearchForm()
        
        if (value !== formData?.password) {
          throw new Error('两次输入的密码不一致')
        }
      },
      trigger: 'blur'
    }
  ]
}

// 日期范围验证
{
  label: '结束时间',
  prop: 'endDate',
  render: 'date-picker',
  rules: [
    {
      validator: (rule: any, value: string) => {
        const formData = searchRef.value?.getSearchForm()
        
        if (value && formData?.startDate && new Date(value) < new Date(formData.startDate)) {
          throw new Error('结束时间不能早于开始时间')
        }
      },
      trigger: 'change'
    }
  ]
}
```

## 使用场景

### 1. 用户注册搜索
用户注册信息的严格验证：

```typescript
const userRegisterSearchItems = [
  {
    label: '用户名',
    prop: 'username',
    render: 'input',
    rules: [
      { required: true, message: '用户名不能为空' },
      { min: 3, max: 20, message: '用户名长度在3-20个字符' },
      { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字、下划线' }
    ]
  },
  {
    label: '邮箱',
    prop: 'email',
    render: 'input',
    rules: [
      { required: true, message: '邮箱不能为空' },
      { type: 'email', message: '邮箱格式不正确' }
    ]
  }
]
```

### 2. 金融数据查询
金融领域的精确数据验证：

```typescript
const financialSearchItems = [
  {
    label: '交易金额',
    prop: 'amount',
    render: 'input-number',
    rules: [
      { required: true, message: '交易金额不能为空' },
      { type: 'number', min: 0.01, max: 999999.99, message: '金额范围0.01-999999.99' }
    ]
  },
  {
    label: '账户号码',
    prop: 'account',
    render: 'input',
    rules: [
      { required: true, message: '账户号码不能为空' },
      { pattern: /^\d{16,19}$/, message: '账户号码必须是16-19位数字' }
    ]
  }
]
```

### 3. 订单管理验证
订单查询的业务规则验证：

```typescript
const orderSearchItems = [
  {
    label: '订单号',
    prop: 'orderNo',
    render: 'input',
    rules: [
      { pattern: /^ORD\d{12}$/, message: '订单号格式：ORD+12位数字' }
    ]
  },
  {
    label: '订单金额',
    prop: 'orderAmount',
    render: 'input-number',
    rules: [
      { type: 'number', min: 1, message: '订单金额必须大于0' }
    ]
  }
]
```

## 关键特性

- ✅ 完整的验证规则支持
- 🔄 异步验证能力
- 🎯 条件验证和联合验证
- 📝 友好的错误提示
- ⚡ 高性能的验证机制
- 🛡 数据安全和完整性保障

## 验证时机控制

### 触发方式配置
不同的验证触发时机：

```typescript
// 实时验证
{
  rules: [
    { required: true, message: '不能为空', trigger: 'change' }
  ]
}

// 失焦验证
{
  rules: [
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ]
}

// 手动验证
{
  rules: [
    { 
      validator: validateAsync, 
      trigger: 'manual'  // 需要手动调用验证
    }
  ]
}
```

### 验证状态管理
获取和控制验证状态：

```typescript
// 验证单个字段
const validateField = async (prop: string) => {
  const formRef = searchRef.value?.getMaFormRef()
  try {
    await formRef?.validateField(prop)
    console.log(`${prop}字段验证通过`)
  } catch (error) {
    console.log(`${prop}字段验证失败:`, error)
  }
}

// 验证整个表单
const validateForm = async () => {
  const formRef = searchRef.value?.getMaFormRef()
  try {
    await formRef?.validate()
    console.log('表单验证通过，可以提交搜索')
    return true
  } catch (error) {
    console.log('表单验证失败:', error)
    return false
  }
}

// 清除验证状态
const clearValidation = () => {
  const formRef = searchRef.value?.getMaFormRef()
  formRef?.clearValidate()
}
```

## 最佳实践

### 1. 用户体验优化
- 提供实时的验证反馈
- 使用友好的错误提示信息
- 支持错误信息的国际化

```typescript
// 友好的错误提示
const createFriendlyRules = (fieldName: string) => [
  { 
    required: true, 
    message: `请输入${fieldName}`, 
    trigger: 'blur' 
  },
  {
    validator: (rule: any, value: string) => {
      if (value && value.length < 2) {
        throw new Error(`${fieldName}至少需要2个字符`)
      }
    },
    trigger: 'blur'
  }
]
```

### 2. 性能优化
- 使用防抖处理频繁验证
- 异步验证的错误处理
- 验证缓存机制

```typescript
// 验证缓存
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

### 3. 可维护性
- 提取通用的验证规则
- 创建验证规则工厂函数
- 支持验证规则的动态配置

```typescript
// 通用验证规则库
const ValidationRules = {
  required: (message?: string) => ({
    required: true,
    message: message || '此字段为必填项',
    trigger: 'blur'
  }),
  
  email: (message?: string) => ({
    type: 'email',
    message: message || '邮箱格式不正确',
    trigger: 'blur'
  }),
  
  phone: (message?: string) => ({
    pattern: /^1[3-9]\d{9}$/,
    message: message || '请输入正确的手机号',
    trigger: 'blur'
  }),
  
  range: (min: number, max: number, message?: string) => ({
    type: 'number',
    min,
    max,
    message: message || `值必须在${min}-${max}之间`,
    trigger: 'blur'
  })
}

// 使用通用规则
{
  label: '邮箱',
  prop: 'email',
  render: 'input',
  rules: [
    ValidationRules.required(),
    ValidationRules.email()
  ]
}
```

## 相关链接

- [高级搜索](./advanced-search) - 了解复杂搜索场景下的验证应用
- [表格集成](./table-integration) - 了解验证在数据提交前的作用
- [方法演示](./methods-demo) - 了解验证相关的组件方法