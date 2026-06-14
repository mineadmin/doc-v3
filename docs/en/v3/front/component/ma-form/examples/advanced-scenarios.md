# Advanced Scenarios

Demonstrates the complex application of MaForm in real business scenarios, including multi-step forms, data dictionary integration, permission control, internationalization, and other advanced features.

<DemoPreview dir="demos/ma-form/advanced-scenarios" />

## Features

- **Multi-Step Forms**: Complex form flows split into steps
- **Data Dictionary Integration**: Integration with backend data dictionary systems
- **Permission Control**: Form field control based on user permissions
- **Internationalization Support**: Multi-language form configuration
- **Business Rule Engine**: Complex business logic processing
- **Data Linkage**: Multi-level data linkage and dependency relationships

## Multi-Step Forms

### 1. Step Form Structure

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
      title: 'Basic Information',
      key: 'basic',
      description: 'Fill in basic personal information',
      icon: 'User'
    },
    {
      title: 'Contact Information',
      key: 'contact',
      description: 'Fill in contact information',
      icon: 'Phone'
    },
    {
      title: 'Additional Information',
      key: 'additional',
      description: 'Supplement other information',
      icon: 'Document'
    }
  ]
}

// Step form item configuration
const getStepFormItems = (currentStep: number): MaFormItem[] => {
  const stepConfigs = {
    0: [ // Basic Information Step
      {
        label: 'Name',
        prop: 'basic.name',
        render: 'input',
        itemProps: {
          rules: [{ required: true, message: 'Please enter name', trigger: 'blur' }]
        },
        cols: { xs: 24, sm: 12 }
      },
      {
        label: 'Gender',
        prop: 'basic.gender',
        render: 'radioGroup',
        renderSlots: {
          default: () => [
            h('el-radio', { label: 'male' }, 'Male'),
            h('el-radio', { label: 'female' }, 'Female')
          ]
        },
        cols: { xs: 24, sm: 12 }
      },
      {
        label: 'Date of Birth',
        prop: 'basic.birthDate',
        render: 'datePicker',
        renderProps: {
          type: 'date',
          placeholder: 'Select date of birth',
          disabledDate: (time: Date) => time.getTime() > Date.now()
        },
        cols: { xs: 24, sm: 12 }
      }
    ],
    1: [ // Contact Information Step
      {
        label: 'Phone Number',
        prop: 'contact.phone',
        render: 'input',
        renderProps: {
          placeholder: 'Please enter phone number'
        },
        customValidator: (rule, value, callback) => {
          if (!value) {
            callback(new Error('Please enter phone number'))
          } else if (!/^1[3-9]\d{9}$/.test(value)) {
            callback(new Error('Please enter a valid phone number'))
          } else {
            callback()
          }
        },
        cols: { xs: 24, sm: 12 }
      },
      {
        label: 'Email Address',
        prop: 'contact.email',
        render: 'input',
        renderProps: {
          type: 'email',
          placeholder: 'Please enter email address'
        },
        asyncValidator: async (rule, value) => {
          if (value) {
            const exists = await checkEmailExists(value)
            if (exists) {
              throw new Error('This email is already in use')
            }
          }
        },
        cols: { xs: 24, sm: 12 }
      },
      {
        label: 'Contact Address',
        prop: 'contact.address',
        render: 'cascader',
        renderProps: {
          options: await loadAddressOptions(),
          props: { expandTrigger: 'hover' },
          placeholder: 'Please select address'
        },
        cols: { xs: 24, sm: 24 }
      }
    ],
    2: [ // Additional Information Step
      {
        label: 'Personal Bio',
        prop: 'additional.bio',
        render: 'textarea',
        renderProps: {
          rows: 4,
          placeholder: 'Please enter personal bio',
          maxlength: 500,
          showWordLimit: true
        },
        cols: { xs: 24, sm: 24 }
      },
      {
        label: 'Hobbies',
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

// Step control logic
const stepFormController = {
  currentStep: ref(0),
  stepData: ref<StepFormData['stepData']>({
    basic: {},
    contact: {},
    additional: {}
  }),

  // Next step
  nextStep: async () => {
    const isValid = await formRef.value.validate()
    if (isValid) {
      if (stepFormController.currentStep.value < stepFormConfig.steps.length - 1) {
        stepFormController.currentStep.value++
        updateFormItems()
      }
    }
  },

  // Previous step
  prevStep: () => {
    if (stepFormController.currentStep.value > 0) {
      stepFormController.currentStep.value--
      updateFormItems()
    }
  },

  // Go to specified step
  goToStep: async (targetStep: number) => {
    // Validate current step
    const isValid = await formRef.value.validate()
    if (isValid || targetStep < stepFormController.currentStep.value) {
      stepFormController.currentStep.value = targetStep
      updateFormItems()
    }
  }
}

// Update form items
const updateFormItems = () => {
  const items = getStepFormItems(stepFormController.currentStep.value)
  formRef.value.setItems(items)
}
```

### 2. Step Validation Strategy

```typescript
const stepValidationStrategy = {
  // Validate step
  validateStep: async (stepIndex: number): Promise<boolean> => {
    const stepKey = stepFormConfig.steps[stepIndex].key
    const stepProps = Object.keys(stepFormController.stepData.value[stepKey])

    try {
      // Validate all fields in the current step
      const validationPromises = stepProps.map(prop =>
        formRef.value.validateField(`${stepKey}.${prop}`)
      )

      await Promise.all(validationPromises)
      return true
    } catch (error) {
      return false
    }
  },

  // Validate all steps
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

  // Get step status
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

## Data Dictionary Integration

### 1. Data Dictionary Management

```typescript
interface DictionaryItem {
  label: string
  value: string | number
  disabled?: boolean
  children?: DictionaryItem[]
  extra?: Record<string, any>
}

interface DictionaryConfig {
  code: string          // Dictionary code
  label: string         // Dictionary name
  cache: boolean        // Whether to cache
  cascade?: boolean     // Whether cascading
  parentField?: string  // Parent field (used for cascading)
}

const dictionaryService = {
  // Dictionary data cache
  cache: new Map<string, DictionaryItem[]>(),

  // Get dictionary data
  async getDictionary(config: DictionaryConfig): Promise<DictionaryItem[]> {
    // Check cache
    if (config.cache && this.cache.has(config.code)) {
      return this.cache.get(config.code)!
    }

    try {
      const response = await fetch(`/api/dictionary/${config.code}`)
      const data = await response.json()

      // Cache data
      if (config.cache) {
        this.cache.set(config.code, data)
      }

      return data
    } catch (error) {
      console.error(`Failed to get dictionary ${config.code}:`, error)
      return []
    }
  },

  // Get cascading dictionary data
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
      console.error(`Failed to get cascading dictionary ${config.code}:`, error)
      return []
    }
  },

  // Clear dictionary cache
  clearCache: (code?: string) => {
    if (code) {
      // Clear cache for specified dictionary
      const keysToDelete = Array.from(this.cache.keys()).filter(key => key.startsWith(code))
      keysToDelete.forEach(key => this.cache.delete(key))
    } else {
      // Clear all cache
      this.cache.clear()
    }
  }
}

// Dictionary form item factory
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
      placeholder: placeholder || `Please select ${label}`,
      multiple: renderType === 'select' ? multiple : undefined,
      loading: true  // Initial loading state
    },
    renderSlots: {
      default: () => [] // Initially empty, dynamically updated
    },

    // Load dictionary data when field is mounted
    async onMounted() {
      try {
        const dictData = await dictionaryService.getDictionary(dictConfig)

        // Update field options
        const slots = createDictSlots(dictData, renderType)
        formRef.value?.updateItem(prop, {
          renderProps: { loading: false },
          renderSlots: { default: slots }
        })

      } catch (error) {
        console.error(`Failed to load dictionary data: ${dictConfig.code}`, error)
        formRef.value?.updateItem(prop, {
          renderProps: { loading: false }
        })
      }
    }
  }
}

// Create dictionary option slots
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

### 2. Cascading Dictionary Implementation

```typescript
const cascadeDictionaryFields = [
  {
    label: 'Province',
    prop: 'province',
    render: 'select',
    renderProps: {
      placeholder: 'Please select province',
      clearable: true
    },
    renderSlots: {
      default: async () => {
        const provinces = await dictionaryService.getDictionary({
          code: 'province',
          label: 'Province',
          cache: true
        })
        return provinces.map(item =>
          h('el-option', { label: item.label, value: item.value })
        )
      }
    },
    // Update city options when province changes
    onChange: async (value: string) => {
      // Clear city and district
      formRef.value.setFormData({
        ...formRef.value.getFormData(),
        city: '',
        district: ''
      })

      if (value) {
        // Load city data
        formRef.value.updateItem('city', {
          renderProps: { loading: true }
        })

        const cities = await dictionaryService.getCascadeDictionary({
          code: 'city',
          label: 'City',
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
    label: 'City',
    prop: 'city',
    render: 'select',
    renderProps: {
      placeholder: 'Please select province first',
      clearable: true,
      disabled: true  // Initially disabled
    },
    show: (model) => !!model.province,
    dependencies: ['province'],
    onChange: async (value: string) => {
      // Similar district cascading logic
      const formData = formRef.value.getFormData()
      if (value && formData.province) {
        // Load district data...
      }
    }
  }
]
```

## Permission Control System

### 1. Field Permission Configuration

```typescript
interface FieldPermission {
  field: string
  permissions: {
    view: boolean      // Whether visible
    edit: boolean      // Whether editable
    required: boolean  // Whether required
  }
  conditions?: {
    roles?: string[]           // Role conditions
    departments?: string[]     // Department conditions
    customCheck?: () => boolean // Custom condition
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

  // Check field permission
  checkFieldPermission(fieldPermission: FieldPermission): {
    visible: boolean
    editable: boolean
    required: boolean
  } {
    const user = this.userContext.value
    if (!user) {
      return { visible: false, editable: false, required: false }
    }

    // Basic permission check
    let { view, edit, required } = fieldPermission.permissions

    // Conditional permission check
    if (fieldPermission.conditions) {
      const { roles, departments, customCheck } = fieldPermission.conditions

      // Role check
      if (roles && !roles.some(role => user.roles.includes(role))) {
        view = false
        edit = false
      }

      // Department check
      if (departments && !departments.includes(user.department)) {
        view = false
        edit = false
      }

      // Custom check
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

  // Apply permissions to form items
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
            { required: true, message: `${item.label} is required`, trigger: 'blur' }
          ] : item.itemProps?.rules
        }
      }
    })
  }
}

// Create permission-controlled form configuration
const createPermissionControlledForm = (
  baseItems: MaFormItem[],
  permissions: FieldPermission[]
): MaFormItem[] => {
  return permissionService.applyPermissionsToItems(baseItems, permissions)
}

// Usage example
const userFormPermissions: FieldPermission[] = [
  {
    field: 'username',
    permissions: { view: true, edit: true, required: true }
  },
  {
    field: 'salary',
    permissions: { view: true, edit: true, required: false },
    conditions: {
      roles: ['admin', 'hr'],  // Only admin and HR can edit salary
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

### 2. Dynamic Permission Update

```typescript
const dynamicPermissionManager = {
  // Watch user permission changes
  watchUserPermissions: () => {
    watch(
      () => permissionService.userContext.value,
      (newUser, oldUser) => {
        if (newUser?.id !== oldUser?.id) {
          // Re-apply permissions when user switches
          dynamicPermissionManager.refreshFormPermissions()
        }
      },
      { deep: true }
    )
  },

  // Refresh form permissions
  refreshFormPermissions: () => {
    const currentItems = formRef.value?.getItems() || []
    const updatedItems = permissionService.applyPermissionsToItems(
      currentItems,
      userFormPermissions
    )

    formRef.value?.setItems(updatedItems)
  },

  // Update field-level permission
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
            { required: true, message: 'This field is required', trigger: 'blur' }
          ] : []
        }
      })
    }
  }
}
```

## Internationalization Support

### 1. Multi-Language Configuration

```typescript
interface I18nConfig {
  locale: string
  messages: Record<string, string>
  dateFormat: string
  numberFormat: Intl.NumberFormatOptions
}

const i18nService = {
  currentLocale: ref('en-US'),
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

  // Get translated text
  t(key: string, fallback?: string): string {
    const locale = this.currentLocale.value
    const message = this.messages.value[locale]?.[key]
    return message || fallback || key
  },

  // Switch language
  setLocale(locale: string) {
    this.currentLocale.value = locale
    // Update form items
    this.updateFormItemsLocale()
  },

  // Update form items internationalized text
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

// Internationalized form item creation factory
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

### 2. Reactive Internationalization

```typescript
// Reactive internationalization composable function
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

  // Watch language changes
  watch(
    () => i18nService.currentLocale.value,
    () => {
      // Re-set form items to apply new translations
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

## Business Rule Engine

### 1. Rule Engine Implementation

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

  // Register rule
  registerRule(rule: BusinessRule) {
    this.rules.set(rule.id, rule)
  },

  // Execute rules
  async executeRules(data: Record<string, any>) {
    // Sort rules by priority
    const sortedRules = Array.from(this.rules.values())
      .filter(rule => rule.enabled)
      .sort((a, b) => b.priority - a.priority)

    for (const rule of sortedRules) {
      try {
        if (rule.condition(data)) {
          await rule.action(data, formRef.value)
        }
      } catch (error) {
        console.error(`Failed to execute rule ${rule.name}:`, error)
      }
    }
  },

  // Remove rule
  removeRule(ruleId: string) {
    this.rules.delete(ruleId)
  }
}

// Business rule examples
const registerBusinessRules = () => {
  // Rule 1: VIP customers display exclusive fields
  businessRuleEngine.registerRule({
    id: 'vip-customer-fields',
    name: 'VIP Customer Fields Display',
    description: 'Display exclusive VIP fields when customer type is VIP',
    condition: (data) => data.customerType === 'vip',
    action: (data, formRef) => {
      const vipFields = [
        {
          label: 'VIP Level',
          prop: 'vipLevel',
          render: 'select',
          renderSlots: {
            default: () => [
              h('el-option', { label: 'Gold', value: 'gold' }),
              h('el-option', { label: 'Platinum', value: 'platinum' }),
              h('el-option', { label: 'Black', value: 'black' })
            ]
          }
        },
        {
          label: 'Dedicated Service',
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

  // Rule 2: Enterprise customer required fields
  businessRuleEngine.registerRule({
    id: 'enterprise-required-fields',
    name: 'Enterprise Customer Required Fields',
    description: 'Enterprise customers need to fill in additional required fields',
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
                { required: true, message: `${item.label} is required`, trigger: 'blur' }
              ]
            }
          })
        }
      })
    },
    priority: 90,
    enabled: true
  })

  // Rule 3: Amount limit check
  businessRuleEngine.registerRule({
    id: 'amount-limit-check',
    name: 'Amount Limit Check',
    description: 'Limit transaction amount based on customer level',
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
                    callback(new Error(`Single transaction limit for ${customerLevel} customers is ${limit} CNY`))
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

// Execute rules when form data changes
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

## Data Linkage System

### 1. Complex Data Linkage

```typescript
const dataLinkageManager = {
  // Linkage configuration
  linkageConfig: new Map<string, {
    triggers: string[]                    // Trigger fields
    target: string                        // Target field
    handler: (data: any) => any | Promise<any>  // Handler function
    debounce?: number                     // Debounce time
  }>(),

  // Register linkage
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

  // Handle field change
  handleFieldChange(changedField: string, formData: Record<string, any>) {
    this.linkageConfig.forEach((config, id) => {
      if (config.triggers.includes(changedField)) {
        // Debounce handling
        clearTimeout(this.debounceTimers?.get(id))

        const timer = setTimeout(async () => {
          try {
            const result = await config.handler(formData)
            if (result !== undefined) {
              // Update target field
              const currentData = formRef.value?.getFormData() || {}
              formRef.value?.setFormData({
                ...currentData,
                [config.target]: result
              })
            }
          } catch (error) {
            console.error(`Linkage processing failed ${id}:`, error)
          }
        }, config.debounce)

        this.debounceTimers = this.debounceTimers || new Map()
        this.debounceTimers.set(id, timer)
      }
    })
  },

  debounceTimers: new Map<string, number>()
}

// Register linkage examples
const setupDataLinkages = () => {
  // Province-city linkage
  dataLinkageManager.registerLinkage({
    id: 'province-city-linkage',
    triggers: ['province'],
    target: 'city',
    handler: async (data) => {
      if (data.province) {
        const cities = await loadCitiesByProvince(data.province)
        // Update city options
        updateCityOptions(cities)
        return '' // Clear city selection
      }
      return undefined
    }
  })

  // Price calculation
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

  // Customer information auto-fill
  dataLinkageManager.registerLinkage({
    id: 'customer-info-autofill',
    triggers: ['customerId'],
    target: 'customerInfo',
    handler: async (data) => {
      if (data.customerId) {
        const customerInfo = await fetchCustomerInfo(data.customerId)
        // Batch update multiple fields
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

// Watch form data changes to trigger linkage
watch(
  () => formRef.value?.getFormData(),
  (newData, oldData) => {
    if (newData && oldData) {
      // Find changed fields
      const changedFields = Object.keys(newData).filter(
        key => newData[key] !== oldData[key]
      )

      // Process each changed field
      changedFields.forEach(field => {
        dataLinkageManager.handleFieldChange(field, newData)
      })
    }
  },
  { deep: true }
)
```

## Related Links

- [Conditional Rendering](/v3/front/component/ma-form/examples/conditional-rendering)
- [Dynamic Validation](/v3/front/component/ma-form/examples/dynamic-validation)
- [Nested Forms](/v3/front/component/ma-form/examples/nested-forms)
- [Exposed Methods](/v3/front/component/ma-form/examples/expose-methods)