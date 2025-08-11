# 高级应用场景

展示 MaForm 在真实业务场景中的复杂应用，包括多步骤表单、数据字典集成、权限控制、国际化等高级特性。

<DemoPreview dir="demos/ma-form/advanced-scenarios" />

## 功能特性

- **多步骤表单**：分步骤的复杂表单流程
- **数据字典集成**：与后端数据字典系统集成
- **权限控制**：基于用户权限的表单字段控制
- **国际化支持**：多语言表单配置
- **业务规则引擎**：复杂的业务逻辑处理
- **数据联动**：多级数据联动和依赖关系

## 多步骤表单

### 1. 分步表单结构

```typescript
interface StepFormData {
  currentStep: number
  stepData: {
    basic: BasicInfo
    contact: ContactInfo
    additional: AdditionalInfo
  }
}

const stepFormConfig = {
  steps: [
    {
      title: '基本信息',
      key: 'basic',
      description: '填写基本个人信息',
      icon: 'User'
    },
    {
      title: '联系方式',
      key: 'contact', 
      description: '填写联系信息',
      icon: 'Phone'
    },
    {
      title: '附加信息',
      key: 'additional',
      description: '补充其他信息',
      icon: 'Document'
    }
  ]
}

// 分步表单项配置
const getStepFormItems = (currentStep: number): MaFormItem[] => {
  const stepConfigs = {
    0: [ // 基本信息步骤
      {
        label: '姓名',
        prop: 'basic.name',
        render: 'input',
        itemProps: {
          rules: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
        },
        cols: { xs: 24, sm: 12 }
      },
      {
        label: '性别',
        prop: 'basic.gender',
        render: 'radioGroup',
        renderSlots: {
          default: () => [
            h('el-radio', { label: 'male' }, '男'),
            h('el-radio', { label: 'female' }, '女')
          ]
        },
        cols: { xs: 24, sm: 12 }
      },
      {
        label: '出生日期',
        prop: 'basic.birthDate',
        render: 'datePicker',
        renderProps: {
          type: 'date',
          placeholder: '选择出生日期',
          disabledDate: (time: Date) => time.getTime() > Date.now()
        },
        cols: { xs: 24, sm: 12 }
      }
    ],
    1: [ // 联系方式步骤
      {
        label: '手机号码',
        prop: 'contact.phone',
        render: 'input',
        renderProps: {
          placeholder: '请输入手机号码'
        },
        customValidator: (rule, value, callback) => {
          if (!value) {
            callback(new Error('请输入手机号码'))
          } else if (!/^1[3-9]\d{9}$/.test(value)) {
            callback(new Error('请输入有效的手机号码'))
          } else {
            callback()
          }
        },
        cols: { xs: 24, sm: 12 }
      },
      {
        label: '邮箱地址',
        prop: 'contact.email',
        render: 'input',
        renderProps: {
          type: 'email',
          placeholder: '请输入邮箱地址'
        },
        asyncValidator: async (rule, value) => {
          if (value) {
            const exists = await checkEmailExists(value)
            if (exists) {
              throw new Error('该邮箱已被使用')
            }
          }
        },
        cols: { xs: 24, sm: 12 }
      },
      {
        label: '联系地址',
        prop: 'contact.address',
        render: 'cascader',
        renderProps: {
          options: await loadAddressOptions(),
          props: { expandTrigger: 'hover' },
          placeholder: '请选择地址'
        },
        cols: { xs: 24, sm: 24 }
      }
    ],
    2: [ // 附加信息步骤
      {
        label: '个人简介',
        prop: 'additional.bio',
        render: 'textarea',
        renderProps: {
          rows: 4,
          placeholder: '请输入个人简介',
          maxlength: 500,
          showWordLimit: true
        },
        cols: { xs: 24, sm: 24 }
      },
      {
        label: '兴趣爱好',
        prop: 'additional.hobbies',
        render: 'checkboxGroup',
        renderSlots: {
          default: () => hobbiesList.map(hobby => 
            h('el-checkbox', { label: hobby.value }, hobby.label)
          )
        },
        cols: { xs: 24, sm: 24 }
      }
    ]
  }
  
  return stepConfigs[currentStep] || []
}

// 步骤控制逻辑
const stepFormController = {
  currentStep: ref(0),
  stepData: ref<StepFormData['stepData']>({
    basic: {},
    contact: {},
    additional: {}
  }),
  
  // 下一步
  nextStep: async () => {
    const isValid = await formRef.value.validate()
    if (isValid) {
      if (stepFormController.currentStep.value < stepFormConfig.steps.length - 1) {
        stepFormController.currentStep.value++
        updateFormItems()
      }
    }
  },
  
  // 上一步
  prevStep: () => {
    if (stepFormController.currentStep.value > 0) {
      stepFormController.currentStep.value--
      updateFormItems()
    }
  },
  
  // 跳转到指定步骤
  goToStep: async (targetStep: number) => {
    // 验证当前步骤
    const isValid = await formRef.value.validate()
    if (isValid || targetStep < stepFormController.currentStep.value) {
      stepFormController.currentStep.value = targetStep
      updateFormItems()
    }
  }
}

// 更新表单项
const updateFormItems = () => {
  const items = getStepFormItems(stepFormController.currentStep.value)
  formRef.value.setItems(items)
}
```

### 2. 步骤验证策略

```typescript
const stepValidationStrategy = {
  // 分步验证
  validateStep: async (stepIndex: number): Promise<boolean> => {
    const stepKey = stepFormConfig.steps[stepIndex].key
    const stepProps = Object.keys(stepFormController.stepData.value[stepKey])
    
    try {
      // 验证当前步骤的所有字段
      const validationPromises = stepProps.map(prop => 
        formRef.value.validateField(`${stepKey}.${prop}`)
      )
      
      await Promise.all(validationPromises)
      return true
    } catch (error) {
      return false
    }
  },
  
  // 验证所有步骤
  validateAllSteps: async (): Promise<{ isValid: boolean; invalidSteps: number[] }> => {
    const invalidSteps: number[] = []
    
    for (let i = 0; i < stepFormConfig.steps.length; i++) {
      const isStepValid = await stepValidationStrategy.validateStep(i)
      if (!isStepValid) {
        invalidSteps.push(i)
      }
    }
    
    return {
      isValid: invalidSteps.length === 0,
      invalidSteps
    }
  },
  
  // 获取步骤完成状态
  getStepStatus: (stepIndex: number): 'wait' | 'process' | 'finish' | 'error' => {
    if (stepIndex < stepFormController.currentStep.value) {
      return 'finish'
    } else if (stepIndex === stepFormController.currentStep.value) {
      return 'process'
    } else {
      return 'wait'
    }
  }
}
```

## 数据字典集成

### 1. 数据字典管理

```typescript
interface DictionaryItem {
  label: string
  value: string | number
  disabled?: boolean
  children?: DictionaryItem[]
  extra?: Record<string, any>
}

interface DictionaryConfig {
  code: string          // 字典编码
  label: string         // 字典名称
  cache: boolean        // 是否缓存
  cascade?: boolean     // 是否级联
  parentField?: string  // 父级字段（级联时使用）
}

const dictionaryService = {
  // 字典数据缓存
  cache: new Map<string, DictionaryItem[]>(),
  
  // 获取字典数据
  async getDictionary(config: DictionaryConfig): Promise<DictionaryItem[]> {
    // 检查缓存
    if (config.cache && this.cache.has(config.code)) {
      return this.cache.get(config.code)!
    }
    
    try {
      const response = await fetch(`/api/dictionary/${config.code}`)
      const data = await response.json()
      
      // 缓存数据
      if (config.cache) {
        this.cache.set(config.code, data)
      }
      
      return data
    } catch (error) {
      console.error(`获取字典 ${config.code} 失败:`, error)
      return []
    }
  },
  
  // 级联字典数据获取
  async getCascadeDictionary(
    config: DictionaryConfig, 
    parentValue: string | number
  ): Promise<DictionaryItem[]> {
    const cacheKey = `${config.code}_${parentValue}`
    
    if (config.cache && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }
    
    try {
      const response = await fetch(`/api/dictionary/${config.code}?parent=${parentValue}`)
      const data = await response.json()
      
      if (config.cache) {
        this.cache.set(cacheKey, data)
      }
      
      return data
    } catch (error) {
      console.error(`获取级联字典 ${config.code} 失败:`, error)
      return []
    }
  },
  
  // 清除字典缓存
  clearCache: (code?: string) => {
    if (code) {
      // 清除指定字典的缓存
      const keysToDelete = Array.from(this.cache.keys()).filter(key => key.startsWith(code))
      keysToDelete.forEach(key => this.cache.delete(key))
    } else {
      // 清除所有缓存
      this.cache.clear()
    }
  }
}

// 字典表单项工厂
const createDictionaryField = (config: {
  label: string
  prop: string
  dictConfig: DictionaryConfig
  renderType?: 'select' | 'radioGroup' | 'checkboxGroup' | 'cascader'
  multiple?: boolean
  placeholder?: string
}): MaFormItem => {
  const { label, prop, dictConfig, renderType = 'select', multiple = false, placeholder } = config
  
  return {
    label,
    prop,
    render: renderType,
    renderProps: {
      placeholder: placeholder || `请选择${label}`,
      multiple: renderType === 'select' ? multiple : undefined,
      loading: true  // 初始加载状态
    },
    renderSlots: {
      default: () => [] // 初始为空，动态更新
    },
    
    // 字段挂载时加载字典数据
    async onMounted() {
      try {
        const dictData = await dictionaryService.getDictionary(dictConfig)
        
        // 更新字段选项
        const slots = createDictSlots(dictData, renderType)
        formRef.value?.updateItem(prop, {
          renderProps: { loading: false },
          renderSlots: { default: slots }
        })
        
      } catch (error) {
        console.error(`加载字典数据失败: ${dictConfig.code}`, error)
        formRef.value?.updateItem(prop, {
          renderProps: { loading: false }
        })
      }
    }
  }
}

// 创建字典选项插槽
const createDictSlots = (data: DictionaryItem[], renderType: string) => {
  return () => {
    switch (renderType) {
      case 'select':
        return data.map(item => 
          h('el-option', {
            key: item.value,
            label: item.label,
            value: item.value,
            disabled: item.disabled
          })
        )
      case 'radioGroup':
        return data.map(item =>
          h('el-radio', {
            key: item.value,
            label: item.value,
            disabled: item.disabled
          }, item.label)
        )
      case 'checkboxGroup':
        return data.map(item =>
          h('el-checkbox', {
            key: item.value,
            label: item.value,
            disabled: item.disabled
          }, item.label)
        )
      default:
        return []
    }
  }
}
```

### 2. 级联字典实现

```typescript
const cascadeDictionaryFields = [
  {
    label: '省份',
    prop: 'province',
    render: 'select',
    renderProps: {
      placeholder: '请选择省份',
      clearable: true
    },
    renderSlots: {
      default: async () => {
        const provinces = await dictionaryService.getDictionary({
          code: 'province',
          label: '省份',
          cache: true
        })
        return provinces.map(item => 
          h('el-option', { label: item.label, value: item.value })
        )
      }
    },
    // 省份变化时更新城市选项
    onChange: async (value: string) => {
      // 清空城市和区县
      formRef.value.setFormData({
        ...formRef.value.getFormData(),
        city: '',
        district: ''
      })
      
      if (value) {
        // 加载城市数据
        formRef.value.updateItem('city', {
          renderProps: { loading: true }
        })
        
        const cities = await dictionaryService.getCascadeDictionary({
          code: 'city',
          label: '城市',
          cache: true,
          cascade: true,
          parentField: 'province'
        }, value)
        
        const citySlots = () => cities.map(item =>
          h('el-option', { label: item.label, value: item.value })
        )
        
        formRef.value.updateItem('city', {
          renderProps: { loading: false },
          renderSlots: { default: citySlots }
        })
      }
    }
  },
  {
    label: '城市',
    prop: 'city',
    render: 'select',
    renderProps: {
      placeholder: '请先选择省份',
      clearable: true,
      disabled: true  // 初始禁用
    },
    show: (model) => !!model.province,
    dependencies: ['province'],
    onChange: async (value: string) => {
      // 类似的区县联动逻辑
      const formData = formRef.value.getFormData()
      if (value && formData.province) {
        // 加载区县数据...
      }
    }
  }
]
```

## 权限控制系统

### 1. 字段权限配置

```typescript
interface FieldPermission {
  field: string
  permissions: {
    view: boolean      // 是否可见
    edit: boolean      // 是否可编辑
    required: boolean  // 是否必填
  }
  conditions?: {
    roles?: string[]           // 角色条件
    departments?: string[]     // 部门条件
    customCheck?: () => boolean // 自定义条件
  }
}

interface UserContext {
  id: string
  roles: string[]
  department: string
  permissions: string[]
}

const permissionService = {
  userContext: ref<UserContext | null>(null),
  
  // 检查字段权限
  checkFieldPermission(fieldPermission: FieldPermission): {
    visible: boolean
    editable: boolean
    required: boolean
  } {
    const user = this.userContext.value
    if (!user) {
      return { visible: false, editable: false, required: false }
    }
    
    // 基础权限检查
    let { view, edit, required } = fieldPermission.permissions
    
    // 条件权限检查
    if (fieldPermission.conditions) {
      const { roles, departments, customCheck } = fieldPermission.conditions
      
      // 角色检查
      if (roles && !roles.some(role => user.roles.includes(role))) {
        view = false
        edit = false
      }
      
      // 部门检查
      if (departments && !departments.includes(user.department)) {
        view = false
        edit = false
      }
      
      // 自定义检查
      if (customCheck && !customCheck()) {
        view = false
        edit = false
      }
    }
    
    return {
      visible: view,
      editable: edit && view,
      required: required && view && edit
    }
  },
  
  // 应用权限到表单项
  applyPermissionsToItems(items: MaFormItem[], permissions: FieldPermission[]): MaFormItem[] {
    return items.map(item => {
      const permission = permissions.find(p => p.field === item.prop)
      if (!permission) return item
      
      const { visible, editable, required } = this.checkFieldPermission(permission)
      
      return {
        ...item,
        show: visible,
        renderProps: {
          ...item.renderProps,
          disabled: !editable
        },
        itemProps: {
          ...item.itemProps,
          rules: required ? [
            ...(item.itemProps?.rules || []),
            { required: true, message: `${item.label}为必填项`, trigger: 'blur' }
          ] : item.itemProps?.rules
        }
      }
    })
  }
}

// 权限控制的表单配置
const createPermissionControlledForm = (
  baseItems: MaFormItem[], 
  permissions: FieldPermission[]
): MaFormItem[] => {
  return permissionService.applyPermissionsToItems(baseItems, permissions)
}

// 使用示例
const userFormPermissions: FieldPermission[] = [
  {
    field: 'username',
    permissions: { view: true, edit: true, required: true }
  },
  {
    field: 'salary',
    permissions: { view: true, edit: true, required: false },
    conditions: {
      roles: ['admin', 'hr'],  // 只有管理员和HR可以编辑薪资
    }
  },
  {
    field: 'confidentialInfo',
    permissions: { view: false, edit: false, required: false },
    conditions: {
      customCheck: () => permissionService.userContext.value?.permissions.includes('view_confidential')
    }
  }
]
```

### 2. 动态权限更新

```typescript
const dynamicPermissionManager = {
  // 监听用户权限变化
  watchUserPermissions: () => {
    watch(
      () => permissionService.userContext.value,
      (newUser, oldUser) => {
        if (newUser?.id !== oldUser?.id) {
          // 用户切换时重新应用权限
          dynamicPermissionManager.refreshFormPermissions()
        }
      },
      { deep: true }
    )
  },
  
  // 刷新表单权限
  refreshFormPermissions: () => {
    const currentItems = formRef.value?.getItems() || []
    const updatedItems = permissionService.applyPermissionsToItems(
      currentItems, 
      userFormPermissions
    )
    
    formRef.value?.setItems(updatedItems)
  },
  
  // 字段级权限更新
  updateFieldPermission: (fieldProp: string, newPermission: Partial<FieldPermission>) => {
    const permission = userFormPermissions.find(p => p.field === fieldProp)
    if (permission) {
      Object.assign(permission, newPermission)
      
      const { visible, editable, required } = permissionService.checkFieldPermission(permission)
      
      formRef.value?.updateItem(fieldProp, {
        show: visible,
        renderProps: { disabled: !editable },
        itemProps: {
          rules: required ? [
            { required: true, message: '此字段为必填项', trigger: 'blur' }
          ] : []
        }
      })
    }
  }
}
```

## 国际化支持

### 1. 多语言配置

```typescript
interface I18nConfig {
  locale: string
  messages: Record<string, string>
  dateFormat: string
  numberFormat: Intl.NumberFormatOptions
}

const i18nService = {
  currentLocale: ref('zh-CN'),
  messages: ref<Record<string, Record<string, string>>>({
    'zh-CN': {
      'form.submit': '提交',
      'form.reset': '重置',
      'form.cancel': '取消',
      'field.required': '此字段为必填项',
      'field.username': '用户名',
      'field.email': '邮箱',
      'field.phone': '电话',
      'placeholder.username': '请输入用户名',
      'placeholder.email': '请输入邮箱地址'
    },
    'en-US': {
      'form.submit': 'Submit',
      'form.reset': 'Reset',
      'form.cancel': 'Cancel',
      'field.required': 'This field is required',
      'field.username': 'Username',
      'field.email': 'Email',
      'field.phone': 'Phone',
      'placeholder.username': 'Please enter username',
      'placeholder.email': 'Please enter email address'
    },
    'ja-JP': {
      'form.submit': '送信',
      'form.reset': 'リセット',
      'form.cancel': 'キャンセル',
      'field.required': 'この項目は必須です',
      'field.username': 'ユーザー名',
      'field.email': 'メール',
      'field.phone': '電話',
      'placeholder.username': 'ユーザー名を入力してください',
      'placeholder.email': 'メールアドレスを入力してください'
    }
  }),
  
  // 获取翻译文本
  t(key: string, fallback?: string): string {
    const locale = this.currentLocale.value
    const message = this.messages.value[locale]?.[key]
    return message || fallback || key
  },
  
  // 切换语言
  setLocale(locale: string) {
    this.currentLocale.value = locale
    // 更新表单项
    this.updateFormItemsLocale()
  },
  
  // 更新表单项的国际化文本
  updateFormItemsLocale() {
    const items = formRef.value?.getItems() || []
    const updatedItems = items.map(item => ({
      ...item,
      label: this.t(`field.${item.prop}`, item.label),
      renderProps: {
        ...item.renderProps,
        placeholder: this.t(`placeholder.${item.prop}`, item.renderProps?.placeholder)
      },
      itemProps: {
        ...item.itemProps,
        rules: item.itemProps?.rules?.map(rule => ({
          ...rule,
          message: rule.required 
            ? this.t('field.required')
            : rule.message
        }))
      }
    }))
    
    formRef.value?.setItems(updatedItems)
  }
}

// 国际化表单项创建工厂
const createI18nFormItems = (): MaFormItem[] => [
  {
    label: i18nService.t('field.username'),
    prop: 'username',
    render: 'input',
    renderProps: {
      placeholder: i18nService.t('placeholder.username')
    },
    itemProps: {
      rules: [
        { required: true, message: i18nService.t('field.required'), trigger: 'blur' }
      ]
    }
  },
  {
    label: i18nService.t('field.email'),
    prop: 'email',
    render: 'input',
    renderProps: {
      type: 'email',
      placeholder: i18nService.t('placeholder.email')
    }
  }
]
```

### 2. 响应式国际化

```typescript
// 响应式国际化组合函数
const useI18nForm = () => {
  const formItems = computed(() => createI18nFormItems())
  
  const footerButtons = computed(() => [
    {
      label: i18nService.t('form.cancel'),
      type: 'default',
      onClick: () => handleCancel()
    },
    {
      label: i18nService.t('form.reset'),
      type: 'warning',
      onClick: () => handleReset()
    },
    {
      label: i18nService.t('form.submit'),
      type: 'primary',
      onClick: () => handleSubmit()
    }
  ])
  
  // 监听语言变化
  watch(
    () => i18nService.currentLocale.value,
    () => {
      // 重新设置表单项以应用新的翻译
      nextTick(() => {
        formRef.value?.setItems(formItems.value)
      })
    }
  )
  
  return {
    formItems,
    footerButtons,
    changeLanguage: i18nService.setLocale
  }
}
```

## 业务规则引擎

### 1. 规则引擎实现

```typescript
interface BusinessRule {
  id: string
  name: string
  description: string
  condition: (data: Record<string, any>) => boolean
  action: (data: Record<string, any>, formRef: any) => void | Promise<void>
  priority: number
  enabled: boolean
}

const businessRuleEngine = {
  rules: new Map<string, BusinessRule>(),
  
  // 注册规则
  registerRule(rule: BusinessRule) {
    this.rules.set(rule.id, rule)
  },
  
  // 执行规则
  async executeRules(data: Record<string, any>) {
    // 按优先级排序规则
    const sortedRules = Array.from(this.rules.values())
      .filter(rule => rule.enabled)
      .sort((a, b) => b.priority - a.priority)
    
    for (const rule of sortedRules) {
      try {
        if (rule.condition(data)) {
          await rule.action(data, formRef.value)
        }
      } catch (error) {
        console.error(`执行规则 ${rule.name} 失败:`, error)
      }
    }
  },
  
  // 删除规则
  removeRule(ruleId: string) {
    this.rules.delete(ruleId)
  }
}

// 业务规则示例
const registerBusinessRules = () => {
  // 规则1：VIP客户显示专属字段
  businessRuleEngine.registerRule({
    id: 'vip-customer-fields',
    name: 'VIP客户字段显示',
    description: '当客户类型为VIP时，显示VIP专属字段',
    condition: (data) => data.customerType === 'vip',
    action: (data, formRef) => {
      const vipFields = [
        {
          label: 'VIP等级',
          prop: 'vipLevel',
          render: 'select',
          renderSlots: {
            default: () => [
              h('el-option', { label: '金卡', value: 'gold' }),
              h('el-option', { label: '白金卡', value: 'platinum' }),
              h('el-option', { label: '黑卡', value: 'black' })
            ]
          }
        },
        {
          label: '专属客服',
          prop: 'dedicatedService',
          render: 'switch'
        }
      ]
      
      vipFields.forEach(field => {
        formRef.appendItem(field)
      })
    },
    priority: 100,
    enabled: true
  })
  
  // 规则2：企业客户必填字段
  businessRuleEngine.registerRule({
    id: 'enterprise-required-fields',
    name: '企业客户必填字段',
    description: '企业客户需要填写额外的必填字段',
    condition: (data) => data.customerType === 'enterprise',
    action: (data, formRef) => {
      const requiredFields = ['companyName', 'businessLicense', 'taxId']
      
      requiredFields.forEach(fieldProp => {
        const item = formRef.getItemByProp(fieldProp)
        if (item) {
          formRef.updateItem(fieldProp, {
            itemProps: {
              ...item.itemProps,
              rules: [
                ...(item.itemProps?.rules || []),
                { required: true, message: `${item.label}为必填项`, trigger: 'blur' }
              ]
            }
          })
        }
      })
    },
    priority: 90,
    enabled: true
  })
  
  // 规则3：金额限制检查
  businessRuleEngine.registerRule({
    id: 'amount-limit-check',
    name: '金额限制检查',
    description: '根据客户等级限制交易金额',
    condition: (data) => data.transactionAmount > 0,
    action: async (data, formRef) => {
      const customerLevel = data.customerLevel || 'basic'
      const limits = {
        basic: 10000,
        premium: 50000,
        vip: 100000
      }
      
      const limit = limits[customerLevel] || limits.basic
      
      if (data.transactionAmount > limit) {
        formRef.updateItem('transactionAmount', {
          itemProps: {
            rules: [
              { 
                validator: (rule, value, callback) => {
                  if (value > limit) {
                    callback(new Error(`${customerLevel}客户单笔交易限额为${limit}元`))
                  } else {
                    callback()
                  }
                },
                trigger: 'blur'
              }
            ]
          }
        })
      }
    },
    priority: 80,
    enabled: true
  })
}

// 在表单数据变化时执行规则
watch(
  () => formRef.value?.getFormData(),
  (newData) => {
    if (newData) {
      businessRuleEngine.executeRules(newData)
    }
  },
  { deep: true }
)
```

## 数据联动系统

### 1. 复杂数据联动

```typescript
const dataLinkageManager = {
  // 联动关系配置
  linkageConfig: new Map<string, {
    triggers: string[]                    // 触发字段
    target: string                        // 目标字段
    handler: (data: any) => any | Promise<any>  // 处理函数
    debounce?: number                     // 防抖时间
  }>(),
  
  // 注册联动关系
  registerLinkage(config: {
    id: string
    triggers: string[]
    target: string
    handler: (data: any) => any | Promise<any>
    debounce?: number
  }) {
    this.linkageConfig.set(config.id, {
      triggers: config.triggers,
      target: config.target,
      handler: config.handler,
      debounce: config.debounce || 300
    })
  },
  
  // 处理字段变化
  handleFieldChange(changedField: string, formData: Record<string, any>) {
    this.linkageConfig.forEach((config, id) => {
      if (config.triggers.includes(changedField)) {
        // 防抖处理
        clearTimeout(this.debounceTimers?.get(id))
        
        const timer = setTimeout(async () => {
          try {
            const result = await config.handler(formData)
            if (result !== undefined) {
              // 更新目标字段
              const currentData = formRef.value?.getFormData() || {}
              formRef.value?.setFormData({
                ...currentData,
                [config.target]: result
              })
            }
          } catch (error) {
            console.error(`联动处理失败 ${id}:`, error)
          }
        }, config.debounce)
        
        this.debounceTimers = this.debounceTimers || new Map()
        this.debounceTimers.set(id, timer)
      }
    })
  },
  
  debounceTimers: new Map<string, number>()
}

// 注册联动关系示例
const setupDataLinkages = () => {
  // 省市区联动
  dataLinkageManager.registerLinkage({
    id: 'province-city-linkage',
    triggers: ['province'],
    target: 'city',
    handler: async (data) => {
      if (data.province) {
        const cities = await loadCitiesByProvince(data.province)
        // 更新城市选项
        updateCityOptions(cities)
        return '' // 清空城市选择
      }
      return undefined
    }
  })
  
  // 商品价格计算
  dataLinkageManager.registerLinkage({
    id: 'price-calculation',
    triggers: ['quantity', 'unitPrice', 'discount'],
    target: 'totalPrice',
    handler: (data) => {
      const { quantity = 0, unitPrice = 0, discount = 0 } = data
      const subtotal = quantity * unitPrice
      const discountAmount = subtotal * (discount / 100)
      return Math.max(0, subtotal - discountAmount)
    },
    debounce: 500
  })
  
  // 客户信息自动填充
  dataLinkageManager.registerLinkage({
    id: 'customer-info-autofill',
    triggers: ['customerId'],
    target: 'customerInfo',
    handler: async (data) => {
      if (data.customerId) {
        const customerInfo = await fetchCustomerInfo(data.customerId)
        // 批量更新多个字段
        setTimeout(() => {
          const updates = {
            customerName: customerInfo.name,
            customerPhone: customerInfo.phone,
            customerEmail: customerInfo.email,
            customerAddress: customerInfo.address
          }
          
          const currentData = formRef.value?.getFormData() || {}
          formRef.value?.setFormData({
            ...currentData,
            ...updates
          })
        }, 0)
        
        return customerInfo
      }
      return undefined
    }
  })
}

// 监听表单数据变化触发联动
watch(
  () => formRef.value?.getFormData(),
  (newData, oldData) => {
    if (newData && oldData) {
      // 找出变化的字段
      const changedFields = Object.keys(newData).filter(
        key => newData[key] !== oldData[key]
      )
      
      // 处理每个变化的字段
      changedFields.forEach(field => {
        dataLinkageManager.handleFieldChange(field, newData)
      })
    }
  },
  { deep: true }
)
```

## 相关链接

- [条件渲染](/zh/front/component/ma-form/examples/conditional-rendering)
- [动态验证](/zh/front/component/ma-form/examples/dynamic-validation)
- [嵌套表单](/zh/front/component/ma-form/examples/nested-forms)
- [暴露方法](/zh/front/component/ma-form/examples/expose-methods)