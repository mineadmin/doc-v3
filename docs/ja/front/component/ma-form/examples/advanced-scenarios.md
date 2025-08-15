# 高度な応用シナリオ

MaFormの実際のビジネスシナリオにおける複雑な応用を紹介します。マルチステップフォーム、データ辞書統合、権限制御、国際化などの高度な機能を含みます。

<DemoPreview dir="demos/ma-form/advanced-scenarios" />

## 機能特性

- **マルチステップフォーム**: ステップごとの複雑なフォームフロー
- **データ辞書統合**: バックエンドのデータ辞書システムとの統合
- **権限制御**: ユーザー権限に基づくフォームフィールド制御
- **国際化サポート**: 多言語フォーム設定
- **ビジネスルールエンジン**: 複雑なビジネスロジック処理
- **データ連動**: マルチレベルデータ連動と依存関係

## マルチステップフォーム

### 1. ステップフォーム構造

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
      title: '基本情報',
      key: 'basic',
      description: '基本個人情報を入力',
      icon: 'User'
    },
    {
      title: '連絡先',
      key: 'contact', 
      description: '連絡先情報を入力',
      icon: 'Phone'
    },
    {
      title: '追加情報',
      key: 'additional',
      description: 'その他の情報を追加',
      icon: 'Document'
    }
  ]
}

// ステップフォームアイテム設定
const getStepFormItems = (currentStep: number): MaFormItem[] => {
  const stepConfigs = {
    0: [ // 基本情報ステップ
      {
        label: '氏名',
        prop: 'basic.name',
        render: 'input',
        itemProps: {
          rules: [{ required: true, message: '氏名を入力してください', trigger: 'blur' }]
        },
        cols: { xs: 24, sm: 12 }
      },
      {
        label: '性別',
        prop: 'basic.gender',
        render: 'radioGroup',
        renderSlots: {
          default: () => [
            h('el-radio', { label: 'male' }, '男性'),
            h('el-radio', { label: 'female' }, '女性')
          ]
        },
        cols: { xs: 24, sm: 12 }
      },
      {
        label: '生年月日',
        prop: 'basic.birthDate',
        render: 'datePicker',
        renderProps: {
          type: 'date',
          placeholder: '生年月日を選択',
          disabledDate: (time: Date) => time.getTime() > Date.now()
        },
        cols: { xs: 24, sm: 12 }
      }
    ],
    1: [ // 連絡先ステップ
      {
        label: '携帯電話',
        prop: 'contact.phone',
        render: 'input',
        renderProps: {
          placeholder: '携帯電話番号を入力'
        },
        customValidator: (rule, value, callback) => {
          if (!value) {
            callback(new Error('携帯電話番号を入力してください'))
          } else if (!/^1[3-9]\d{9}$/.test(value)) {
            callback(new Error('有効な携帯電話番号を入力してください'))
          } else {
            callback()
          }
        },
        cols: { xs: 24, sm: 12 }
      },
      {
        label: 'メールアドレス',
        prop: 'contact.email',
        render: 'input',
        renderProps: {
          type: 'email',
          placeholder: 'メールアドレスを入力'
        },
        asyncValidator: async (rule, value) => {
          if (value) {
            const exists = await checkEmailExists(value)
            if (exists) {
              throw new Error('このメールアドレスは既に使用されています')
            }
          }
        },
        cols: { xs: 24, sm: 12 }
      },
      {
        label: '住所',
        prop: 'contact.address',
        render: 'cascader',
        renderProps: {
          options: await loadAddressOptions(),
          props: { expandTrigger: 'hover' },
          placeholder: '住所を選択'
        },
        cols: { xs: 24, sm: 24 }
      }
    ],
    2: [ // 追加情報ステップ
      {
        label: '自己紹介',
        prop: 'additional.bio',
        render: 'textarea',
        renderProps: {
          rows: 4,
          placeholder: '自己紹介を入力',
          maxlength: 500,
          showWordLimit: true
        },
        cols: { xs: 24, sm: 24 }
      },
      {
        label: '趣味',
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

// ステップ制御ロジック
const stepFormController = {
  currentStep: ref(0),
  stepData: ref<StepFormData['stepData']>({
    basic: {},
    contact: {},
    additional: {}
  }),
  
  // 次のステップ
  nextStep: async () => {
    const isValid = await formRef.value.validate()
    if (isValid) {
      if (stepFormController.currentStep.value < stepFormConfig.steps.length - 1) {
        stepFormController.currentStep.value++
        updateFormItems()
      }
    }
  },
  
  // 前のステップ
  prevStep: () => {
    if (stepFormController.currentStep.value > 0) {
      stepFormController.currentStep.value--
      updateFormItems()
    }
  },
  
  // 指定ステップに移動
  goToStep: async (targetStep: number) => {
    // 現在のステップを検証
    const isValid = await formRef.value.validate()
    if (isValid || targetStep < stepFormController.currentStep.value) {
      stepFormController.currentStep.value = targetStep
      updateFormItems()
    }
  }
}

// フォームアイテムを更新
const updateFormItems = () => {
  const items = getStepFormItems(stepFormController.currentStep.value)
  formRef.value.setItems(items)
}
```

### 2. ステップ検証戦略

```typescript
const stepValidationStrategy = {
  // ステップごとの検証
  validateStep: async (stepIndex: number): Promise<boolean> => {
    const stepKey = stepFormConfig.steps[stepIndex].key
    const stepProps = Object.keys(stepFormController.stepData.value[stepKey])
    
    try {
      // 現在のステップの全フィールドを検証
      const validationPromises = stepProps.map(prop => 
        formRef.value.validateField(`${stepKey}.${prop}`)
      )
      
      await Promise.all(validationPromises)
      return true
    } catch (error) {
      return false
    }
  },
  
  // 全ステップの検証
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
  
  // ステップ完了状態を取得
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

## データ辞書統合

### 1. データ辞書管理

```typescript
interface DictionaryItem {
  label: string
  value: string | number
  disabled?: boolean
  children?: DictionaryItem[]
  extra?: Record<string, any>
}

interface DictionaryConfig {
  code: string          // 辞書コード
  label: string         // 辞書名
  cache: boolean        // キャッシュするか
  cascade?: boolean     // カスケードするか
  parentField?: string  // 親フィールド（カスケード時使用）
}

const dictionaryService = {
  // 辞書データキャッシュ
  cache: new Map<string, DictionaryItem[]>(),
  
  // 辞書データを取得
  async getDictionary(config: DictionaryConfig): Promise<DictionaryItem[]> {
    // キャッシュをチェック
    if (config.cache && this.cache.has(config.code)) {
      return this.cache.get(config.code)!
    }
    
    try {
      const response = await fetch(`/api/dictionary/${config.code}`)
      const data = await response.json()
      
      // データをキャッシュ
      if (config.cache) {
        this.cache.set(config.code, data)
      }
      
      return data
    } catch (error) {
      console.error(`辞書 ${config.code} の取得に失敗:`, error)
      return []
    }
  },
  
  // カスケード辞書データを取得
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
      console.error(`カスケード辞書 ${config.code} の取得に失敗:`, error)
      return []
    }
  },
  
  // 辞書キャッシュをクリア
  clearCache: (code?: string) => {
    if (code) {
      // 指定辞書のキャッシュをクリア
      const keysToDelete = Array.from(this.cache.keys()).filter(key => key.startsWith(code))
      keysToDelete.forEach(key => this.cache.delete(key))
    } else {
      // 全キャッシュをクリア
      this.cache.clear()
    }
  }
}

// 辞書フォームフィールドファクトリ
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
      placeholder: placeholder || `${label}を選択`,
      multiple: renderType === 'select' ? multiple : undefined,
      loading: true  // 初期ローディング状態
    },
    renderSlots: {
      default: () => [] // 初期は空、動的に更新
    },
    
    // フィールドマウント時に辞書データをロード
    async onMounted() {
      try {
        const dictData = await dictionaryService.getDictionary(dictConfig)
        
        // フィールドオプションを更新
        const slots = createDictSlots(dictData, renderType)
        formRef.value?.updateItem(prop, {
          renderProps: { loading: false },
          renderSlots: { default: slots }
        })
        
      } catch (error) {
        console.error(`辞書データのロードに失敗: ${dictConfig.code}`, error)
        formRef.value?.updateItem(prop, {
          renderProps: { loading: false }
        })
      }
    }
  }
}

// 辞書オプションスロットを作成
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

### 2. カスケード辞書実装

```typescript
const cascadeDictionaryFields = [
  {
    label: '都道府県',
    prop: 'province',
    render: 'select',
    renderProps: {
      placeholder: '都道府県を選択',
      clearable: true
    },
    renderSlots: {
      default: async () => {
        const provinces = await dictionaryService.getDictionary({
          code: 'province',
          label: '都道府県',
          cache: true
        })
        return provinces.map(item => 
          h('el-option', { label: item.label, value: item.value })
        )
      }
    },
    // 都道府県変更時に市区町村オプションを更新
    onChange: async (value: string) => {
      // 市区町村と区をクリア
      formRef.value.setFormData({
        ...formRef.value.getFormData(),
        city: '',
        district: ''
      })
      
      if (value) {
        // 市区町村データをロード
        formRef.value.updateItem('city', {
          renderProps: { loading: true }
        })
        
        const cities = await dictionaryService.getCascadeDictionary({
          code: 'city',
          label: '市区町村',
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
    label: '市区町村',
    prop: 'city',
    render: 'select',
    renderProps: {
      placeholder: 'まず都道府県を選択',
      clearable: true,
      disabled: true  // 初期は無効
    },
    show: (model) => !!model.province,
    dependencies: ['province'],
    onChange: async (value: string) => {
      // 同様の区連動ロジック
      const formData = formRef.value.getFormData()
      if (value && formData.province) {
        // 区データをロード...
      }
    }
  }
]
```

## 権限制御システム

### 1. フィールド権限設定

```typescript
interface FieldPermission {
  field: string
  permissions: {
    view: boolean      // 表示可能か
    edit: boolean      // 編集可能か
    required: boolean  // 必須か
  }
  conditions?: {
    roles?: string[]           // ロール条件
    departments?: string[]     // 部署条件
    customCheck?: () => boolean // カスタム条件
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
  
  // フィールド権限をチェック
  checkFieldPermission(fieldPermission: FieldPermission): {
    visible: boolean
    editable: boolean
    required: boolean
  } {
    const user = this.userContext.value
    if (!user) {
      return { visible: false, editable: false, required: false }
    }
    
    // 基本権限チェック
    let { view, edit, required } = fieldPermission.permissions
    
    // 条件権限チェック
    if (fieldPermission.conditions) {
      const { roles, departments, customCheck } = fieldPermission.conditions
      
      // ロールチェック
      if (roles && !roles.some(role => user.roles.includes(role))) {
        view = false
        edit = false
      }
      
      // 部署チェック
      if (departments && !departments.includes(user.department)) {
        view = false
        edit = false
      }
      
      // カスタムチェック
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
  
  // 権限をフォームアイテムに適用
  applyPermissionsToItems(items: MaFormItem[], permissions: FieldPermission[]): MaFormItem[] {
    return items.map(item => {
      const permission = permissions.find(p => p.field === item.prop)
      if (!permission) return item
      
      const { visible, editable, required } = this.checkFieldPermission(permission)
      
      return {
        ...item,
        show: visible,
        renderProps: