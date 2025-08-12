# Advanced Application Scenarios

Demonstrates complex applications of MaForm in real business scenarios, including multi-step forms, data dictionary integration, permission control, internationalization, and other advanced features.

<DemoPreview dir="demos/ma-form/advanced-scenarios" />

## Features

- **Multi-step Forms**: Complex form workflows divided into steps
- **Data Dictionary Integration**: Integration with backend data dictionary systems
- **Permission Control**: Form field control based on user permissions
- **Internationalization Support**: Multi-language form configuration
- **Business Rule Engine**: Complex business logic processing
- **Data Linkage**: Multi-level data relationships and dependencies

## Multi-step Forms

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
      title: 'Contact Details',
      key: 'contact', 
      description: 'Fill in contact information',
      icon: 'Phone'
    },
    {
      title: 'Additional Information',
      key: 'additional',
      description: 'Provide supplementary information',
      icon: 'Document'
    }
  ]
}

// Step form item configuration
const getStepFormItems = (currentStep: number): MaFormItem[] => {
  const stepConfigs = {
    0: [ // Basic information step
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
          placeholder: 'Select birth date',
          disabledDate: (time: Date) => time.getTime() > Date.now()
        },
        cols: { xs: 24, sm: 12 }
      }
    ],
    1: [ // Contact details step
      {
        label: 'Phone Number',
        prop: 'contact.phone',
        render: 'input',
        renderProps: {
          placeholder: 'Enter phone number'
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
          placeholder: 'Enter email address'
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
        label: 'Address',
        prop: 'contact.address',
        render: 'cascader',
        renderProps: {
          options: await loadAddressOptions(),
          props: { expandTrigger: 'hover' },
          placeholder: 'Select address'
        },
        cols: { xs: 24, sm: 24 }
      }
    ],
    2: [ // Additional information step
      {
        label: 'Biography',
        prop: 'additional.bio',
        render: 'textarea',
        renderProps: {
          rows: 4,
          placeholder: 'Enter personal bio',
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
  
  // Jump to specific step
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
  // Step validation
  validateStep: async (stepIndex: number): Promise<boolean> => {
    const stepKey = stepFormConfig.steps[stepIndex].key
    const stepProps = Object.keys(stepFormController.stepData.value[stepKey])
    
    try {
      // Validate all fields in current step
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
  parentField?: string  // Parent field (for cascading)
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
      // Clear cache for specific dictionary
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
      placeholder: placeholder || `Select ${label}`,
      multiple: renderType === 'select' ? multiple : undefined,
      loading: true  // Initial loading state
    },
    renderSlots: {
      default: () => [] // Initially empty, updated dynamically
    },
    
    // Load dictionary data when field mounts
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
      placeholder: 'Select province',
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
      placeholder: 'Select province first',
      clearable: true,
      disabled: true  // Initially disabled
    },
    show: (model) => !!model.province,
    dependencies: ['province'],
    onChange: async (value: string) => {
      // Similar district linkage logic
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
    customCheck?: () => boolean // Custom conditions
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
  
  // Check field permissions
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

// Permission-controlled form configuration
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

### 2. Dynamic Permission Updates

```typescript
const dynamicPermissionManager = {
  // Watch user permission changes
  watchUserPermissions: () => {
    watch(
      () => permissionService.userContext.value,
      (newUser, oldUser) => {
        if (newUser?.id !== oldUser?.id) {
          // Reapply permissions when user changes
          dynamicPermissionManager.refreshFormPermissions()
        }
      },
      { deep: true }
    )
  },
  
