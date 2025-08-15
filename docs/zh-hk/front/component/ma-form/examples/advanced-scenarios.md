# 高級應用場景

展示 MaForm 在真實業務場景中的複雜應用，包括多步驟表單、數據字典集成、權限控制、國際化等高級特性。

<DemoPreview dir="demos/ma-form/advanced-scenarios" />

## 功能特性

- **多步驟表單**：分步驟的複雜表單流程
- **數據字典集成**：與後端數據字典系統集成
- **權限控制**：基於用户權限的表單字段控制
- **國際化支持**：多語言表單配置
- **業務規則引擎**：複雜的業務邏輯處理
- **數據聯動**：多級數據聯動和依賴關係

## 多步驟表單

### 1. 分步表單結構

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
      description: '填寫基本個人信息',
      icon: 'User'
    },
    {
      title: '聯繫方式',
      key: 'contact', 
      description: '填寫聯繫信息',
      icon: 'Phone'
    },
    {
      title: '附加信息',
      key: 'additional',
      description: '補充其他信息',
      icon: 'Document'
    }
  ]
}

// 分步表單項配置
const getStepFormItems = (currentStep: number): MaFormItem[] => {
  const stepConfigs = {
    0: [ // 基本信息步驟
      {
        label: '姓名',
        prop: 'basic.name',
        render: 'input',
        itemProps: {
          rules: [{ required: true, message: '請輸入姓名', trigger: 'blur' }]
        },
        cols: { xs: 24, sm: 12 }
      },
      {
        label: '性別',
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
          placeholder: '選擇出生日期',
          disabledDate: (time: Date) => time.getTime() > Date.now()
        },
        cols: { xs: 24, sm: 12 }
      }
    ],
    1: [ // 聯繫方式步驟
      {
        label: '手機號碼',
        prop: 'contact.phone',
        render: 'input',
        renderProps: {
          placeholder: '請輸入手機號碼'
        },
        customValidator: (rule, value, callback) => {
          if (!value) {
            callback(new Error('請輸入手機號碼'))
          } else if (!/^1[3-9]\d{9}$/.test(value)) {
            callback(new Error('請輸入有效的手機號碼'))
          } else {
            callback()
          }
        },
        cols: { xs: 24, sm: 12 }
      },
      {
        label: '郵箱地址',
        prop: 'contact.email',
        render: 'input',
        renderProps: {
          type: 'email',
          placeholder: '請輸入郵箱地址'
        },
        asyncValidator: async (rule, value) => {
          if (value) {
            const exists = await checkEmailExists(value)
            if (exists) {
              throw new Error('該郵箱已被使用')
            }
          }
        },
        cols: { xs: 24, sm: 12 }
      },
      {
        label: '聯繫地址',
        prop: 'contact.address',
        render: 'cascader',
        renderProps: {
          options: await loadAddressOptions(),
          props: { expandTrigger: 'hover' },
          placeholder: '請選擇地址'
        },
        cols: { xs: 24, sm: 24 }
      }
    ],
    2: [ // 附加信息步驟
      {
        label: '個人簡介',
        prop: 'additional.bio',
        render: 'textarea',
        renderProps: {
          rows: 4,
          placeholder: '請輸入個人簡介',
          maxlength: 500,
          showWordLimit: true
        },
        cols: { xs: 24, sm: 24 }
      },
      {
        label: '興趣愛好',
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

// 步驟控制邏輯
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
  
  // 跳轉到指定步驟
  goToStep: async (targetStep: number) => {
    // 驗證當前步驟
    const isValid = await formRef.value.validate()
    if (isValid || targetStep < stepFormController.currentStep.value) {
      stepFormController.currentStep.value = targetStep
      updateFormItems()
    }
  }
}

// 更新表單項
const updateFormItems = () => {
  const items = getStepFormItems(stepFormController.currentStep.value)
  formRef.value.setItems(items)
}
```

### 2. 步驟驗證策略

```typescript
const stepValidationStrategy = {
  // 分步驗證
  validateStep: async (stepIndex: number): Promise<boolean> => {
    const stepKey = stepFormConfig.steps[stepIndex].key
    const stepProps = Object.keys(stepFormController.stepData.value[stepKey])
    
    try {
      // 驗證當前步驟的所有字段
      const validationPromises = stepProps.map(prop => 
        formRef.value.validateField(`${stepKey}.${prop}`)
      )
      
      await Promise.all(validationPromises)
      return true
    } catch (error) {
      return false
    }
  },
  
  // 驗證所有步驟
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
  
  // 獲取步驟完成狀態
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

## 數據字典集成

### 1. 數據字典管理

```typescript
interface DictionaryItem {
  label: string
  value: string | number
  disabled?: boolean
  children?: DictionaryItem[]
  extra?: Record<string, any>
}

interface DictionaryConfig {
  code: string          // 字典編碼
  label: string         // 字典名稱
  cache: boolean        // 是否緩存
  cascade?: boolean     // 是否級聯
  parentField?: string  // 父級字段（級聯時使用）
}

const dictionaryService = {
  // 字典數據緩存
  cache: new Map<string, DictionaryItem[]>(),
  
  // 獲取字典數據
  async getDictionary(config: DictionaryConfig): Promise<DictionaryItem[]> {
    // 檢查緩存
    if (config.cache && this.cache.has(config.code)) {
      return this.cache.get(config.code)!
    }
    
    try {
      const response = await fetch(`/api/dictionary/${config.code}`)
      const data = await response.json()
      
      // 緩存數據
      if (config.cache) {
        this.cache.set(config.code, data)
      }
      
      return data
    } catch (error) {
      console.error(`獲取字典 ${config.code} 失敗:`, error)
      return []
    }
  },
  
  // 級聯字典數據獲取
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
      console.error(`獲取級聯字典 ${config.code} 失敗:`, error)
      return []
    }
  },
  
  // 清除字典緩存
  clearCache: (code?: string) => {
    if (code) {
      // 清除指定字典的緩存
      const keysToDelete = Array.from(this.cache.keys()).filter(key => key.startsWith(code))
      keysToDelete.forEach(key => this.cache.delete(key))
    } else {
      // 清除所有緩存
      this.cache.clear()
    }
  }
}

// 字典表單項工廠
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
      placeholder: placeholder || `請選擇${label}`,
      multiple: renderType === 'select' ? multiple : undefined,
      loading: true  // 初始加載狀態
    },
    renderSlots: {
      default: () => [] // 初始為空，動態更新
    },
    
    // 字段掛載時加載字典數據
    async onMounted() {
      try {
        const dictData = await dictionaryService.getDictionary(dictConfig)
        
        // 更新字段選項
        const slots = createDictSlots(dictData, renderType)
        formRef.value?.updateItem(prop, {
          renderProps: { loading: false },
          renderSlots: { default: slots }
        })
        
      } catch (error) {
        console.error(`加載字典數據失敗: ${dictConfig.code}`, error)
        formRef.value?.updateItem(prop, {
          renderProps: { loading: false }
        })
      }
    }
  }
}

// 創建字典選項插槽
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

### 2. 級聯字典實現

```typescript
const cascadeDictionaryFields = [
  {
    label: '省份',
    prop: 'province',
    render: 'select',
    renderProps: {
      placeholder: '請選擇省份',
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
    // 省份變化時更新城市選項
    onChange: async (value: string) => {
      // 清空城市和區縣
      formRef.value.setFormData({
        ...formRef.value.getFormData(),
        city: '',
        district: ''
      })
      
      if (value) {
        // 加載城市數據
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
      placeholder: '請先選擇省份',
      clearable: true,
      disabled: true  // 初始禁用
    },
    show: (model) => !!model.province,
    dependencies: ['province'],
    onChange: async (value: string) => {
      // 類似的區縣聯動邏輯
      const formData = formRef.value.getFormData()
      if (value && formData.province) {
        // 加載區縣數據...
      }
    }
  }
]
```

## 權限控制系統

### 1. 字段權限配置

```typescript
interface FieldPermission {
  field: string
  permissions: {
    view: boolean      // 是否可見
    edit: boolean      // 是否可編輯
    required: boolean  // 是否必填
  }
  conditions?: {
    roles?: string[]           // 角色條件
    departments?: string[]     // 部門條件
    customCheck?: () => boolean // 自定義條件
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
  
  // 檢查字段權限
  checkFieldPermission(fieldPermission: FieldPermission): {
    visible: boolean
    editable: boolean
    required: boolean
  } {
    const user = this.userContext.value
    if (!user) {
      return { visible: false, editable: false, required: false }
    }
    
    // 基礎權限檢查
    let { view, edit, required } = fieldPermission.permissions
    
    // 條件權限檢查
    if (fieldPermission.conditions) {
      const { roles, departments, customCheck } = fieldPermission.conditions
      
      // 角色檢查
      if (roles && !roles.some(role => user.roles.includes(role))) {
        view = false
        edit = false
      }
      
      // 部門檢查
      if (departments && !departments.includes(user.department)) {
        view = false
        edit = false
      }
      
      // 自定義檢查
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
  
  // 應用權限到表單項
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
            { required: true, message: `${item.label}為必填項`, trigger: 'blur' }
          ] : item.itemProps?.rules
        }
      }
    })
  }
}

// 權限控制的表單配置
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
      roles: ['admin', 'hr'],  // 只有管理員和HR可以編輯薪資
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

### 2. 動態權限更新

```typescript
const dynamicPermissionManager = {
  // 監聽用户權限變化
  watchUserPermissions: () => {
    watch(
      () => permissionService.userContext.value,
      (newUser, oldUser) => {
        if (newUser?.id !== oldUser?.id) {
          // 用户切換時重新應用權限
          dynamicPermissionManager.refreshFormPermissions()
        }
      },
      { deep: true }
    )
  },
  
  // 刷新表單權限
  refreshFormPermissions: () => {
    const currentItems = formRef.value?.getItems() || []
    const updatedItems = permissionService.applyPermissionsToItems(
      currentItems, 
      userFormPermissions
    )
    
    formRef.value?.setItems(updatedItems)
  },
  
  // 字段級權限更新
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
            { required: true, message: '此字段為必填項', trigger: 'blur' }
          ] : []
        }
      })
    }
  }
}
```

## 國際化支持

### 1. 多語言配置

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
      'field.required': '此字段為必填項',
      'field.username': '用户名',
      'field.email': '郵箱',
      'field.phone': '電話',
      'placeholder.username': '請輸入用户名',
      'placeholder.email': '請輸入郵箱地址'
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
  
  // 獲取翻譯文本
  t(key: string, fallback?: string): string {
    const locale = this.currentLocale.value
    const message = this.messages.value[locale]?.[key]
    return message || fallback || key
  },
  
  // 切換語言
  setLocale(locale: string) {
    this.currentLocale.value = locale
    // 更新表單項
    this.updateFormItemsLocale()
  },
  
  // 更新表單項的國際化文本
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

// 國際化表單項創建工廠
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

### 2. 響應式國際化

```typescript
// 響應式國際化組合函數
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
  
  // 監聽語言變化
  watch(
    () => i18nService.currentLocale.value,
    () => {
      // 重新設置表單項以應用新的翻譯
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

## 業務規則引擎

### 1. 規則引擎實現

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
  
  // 註冊規則
  registerRule(rule: BusinessRule) {
    this.rules.set(rule.id, rule)
  },
  
  // 執行規則
  async executeRules(data: Record<string, any>) {
    // 按優先級排序規則
    const sortedRules = Array.from(this.rules.values())
      .filter(rule => rule.enabled)
      .sort((a, b) => b.priority - a.priority)
    
    for (const rule of sortedRules) {
      try {
        if (rule.condition(data)) {
          await rule.action(data, formRef.value)
        }
      } catch (error) {
        console.error(`執行規則 ${rule.name} 失敗:`, error)
      }
    }
  },
  
  // 刪除規則
  removeRule(ruleId: string) {
    this.rules.delete(ruleId)
  }
}

// 業務規則示例
const registerBusinessRules = () => {
  // 規則1：VIP客户顯示專屬字段
  businessRuleEngine.registerRule({
    id: 'vip-customer-fields',
    name: 'VIP客户字段顯示',
    description: '當客户類型為VIP時，顯示VIP專屬字段',
    condition: (data) => data.customerType === 'vip',
    action: (data, formRef) => {
      const vipFields = [
        {
          label: 'VIP等級',
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
          label: '專屬客服',
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
  
  // 規則2：企業客户必填字段
  businessRuleEngine.registerRule({
    id: 'enterprise-required-fields',
    name: '企業客户必填字段',
    description: '企業客户需要填寫額外的必填字段',
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
                { required: true, message: `${item.label}為必填項`, trigger: 'blur' }
              ]
            }
          })
        }
      })
    },
    priority: 90,
    enabled: true
  })
  
  // 規則3：金額限制檢查
  businessRuleEngine.registerRule({
    id: 'amount-limit-check',
    name: '金額限制檢查',
    description: '根據客户等級限制交易金額',
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
                    callback(new Error(`${customerLevel}客户單筆交易限額為${limit}元`))
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

// 在表單數據變化時執行規則
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

## 數據聯動系統

### 1. 複雜數據聯動

```typescript
const dataLinkageManager = {
  // 聯動關係配置
  linkageConfig: new Map<string, {
    triggers: string[]                    // 觸發字段
    target: string                        // 目標字段
    handler: (data: any) => any | Promise<any>  // 處理函數
    debounce?: number                     // 防抖時間
  }>(),
  
  // 註冊聯動關係
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
  
  // 處理字段變化
  handleFieldChange(changedField: string, formData: Record<string, any>) {
    this.linkageConfig.forEach((config, id) => {
      if (config.triggers.includes(changedField)) {
        // 防抖處理
        clearTimeout(this.debounceTimers?.get(id))
        
        const timer = setTimeout(async () => {
          try {
            const result = await config.handler(formData)
            if (result !== undefined) {
              // 更新目標字段
              const currentData = formRef.value?.getFormData() || {}
              formRef.value?.setFormData({
                ...currentData,
                [config.target]: result
              })
            }
          } catch (error) {
            console.error(`聯動處理失敗 ${id}:`, error)
          }
        }, config.debounce)
        
        this.debounceTimers = this.debounceTimers || new Map()
        this.debounceTimers.set(id, timer)
      }
    })
  },
  
  debounceTimers: new Map<string, number>()
}

// 註冊聯動關係示例
const setupDataLinkages = () => {
  // 省市區聯動
  dataLinkageManager.registerLinkage({
    id: 'province-city-linkage',
    triggers: ['province'],
    target: 'city',
    handler: async (data) => {
      if (data.province) {
        const cities = await loadCitiesByProvince(data.province)
        // 更新城市選項
        updateCityOptions(cities)
        return '' // 清空城市選擇
      }
      return undefined
    }
  })
  
  // 商品價格計算
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
  
  // 客户信息自動填充
  dataLinkageManager.registerLinkage({
    id: 'customer-info-autofill',
    triggers: ['customerId'],
    target: 'customerInfo',
    handler: async (data) => {
      if (data.customerId) {
        const customerInfo = await fetchCustomerInfo(data.customerId)
        // 批量更新多個字段
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

// 監聽表單數據變化觸發聯動
watch(
  () => formRef.value?.getFormData(),
  (newData, oldData) => {
    if (newData && oldData) {
      // 找出變化的字段
      const changedFields = Object.keys(newData).filter(
        key => newData[key] !== oldData[key]
      )
      
      // 處理每個變化的字段
      changedFields.forEach(field => {
        dataLinkageManager.handleFieldChange(field, newData)
      })
    }
  },
  { deep: true }
)
```

## 相關鏈接

- [條件渲染](/front/component/ma-form/examples/conditional-rendering)
- [動態驗證](/front/component/ma-form/examples/dynamic-validation)
- [嵌套表單](/front/component/ma-form/examples/nested-forms)
- [暴露方法](/front/component/ma-form/examples/expose-methods)