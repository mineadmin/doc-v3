# 高度な応用シナリオ

MaFormの実際のビジネスシナリオにおける複雑な応用を示します。多段階フォーム、データ辞書統合、権限制御、国際化などの高度な機能を含みます。

<DemoPreview dir="demos/ma-form/advanced-scenarios" />

## 機能特性

- **多段階フォーム**：段階的な複雑なフォームフロー
- **データ辞書統合**：バックエンドのデータ辞書システムとの統合
- **権限制御**：ユーザー権限に基づくフォームフィールド制御
- **国際化対応**：多言語フォーム設定
- **ビジネスルールエンジン**：複雑なビジネスロジック処理
- **データ連携**：多段階のデータ連携と依存関係

## 多段階フォーム

### 1. 段階フォーム構造

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
      description: 'その他の情報を補足',
      icon: 'Document'
    }
  ]
}

// 段階フォーム項目設定
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
        label: '電話番号',
        prop: 'contact.phone',
        render: 'input',
        renderProps: {
          placeholder: '電話番号を入力'
        },
        customValidator: (rule, value, callback) => {
          if (!value) {
            callback(new Error('電話番号を入力してください'))
          } else if (!/^1[3-9]\d{9}$/.test(value)) {
            callback(new Error('有効な電話番号を入力してください'))
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
        label: '趣味・関心',
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

  // 次のステップへ
  nextStep: async () => {
    const isValid = await formRef.value.validate()
    if (isValid) {
      if (stepFormController.currentStep.value < stepFormConfig.steps.length - 1) {
        stepFormController.currentStep.value++
        updateFormItems()
      }
    }
  },

  // 前のステップへ
  prevStep: () => {
    if (stepFormController.currentStep.value > 0) {
      stepFormController.currentStep.value--
      updateFormItems()
    }
  },

  // 指定のステップへ移動
  goToStep: async (targetStep: number) => {
    // 現在のステップを検証
    const isValid = await formRef.value.validate()
    if (isValid || targetStep < stepFormController.currentStep.value) {
      stepFormController.currentStep.value = targetStep
      updateFormItems()
    }
  }
}

// フォーム項目の更新
const updateFormItems = () => {
  const items = getStepFormItems(stepFormController.currentStep.value)
  formRef.value.setItems(items)
}
```

### 2. ステップ検証戦略

```typescript
const stepValidationStrategy = {
  // 段階検証
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

  // 全ステップを検証
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

  // ステップの完了状態を取得
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
  parentField?: string  // 親フィールド（カスケード時）
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

  // カスケード辞書データの取得
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

  // 辞書キャッシュのクリア
  clearCache: (code?: string) => {
    if (code) {
      // 指定された辞書のキャッシュをクリア
      const keysToDelete = Array.from(this.cache.keys()).filter(key => key.startsWith(code))
      keysToDelete.forEach(key => this.cache.delete(key))
    } else {
      // すべてのキャッシュをクリア
      this.cache.clear()
    }
  }
}

// 辞書フォーム項目ファクトリ
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
      placeholder: placeholder || `選択${label}`,
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

### 2. カスケード辞書の実装

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
      // 市区町村をクリア
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
      placeholder: '先に都道府県を選択',
      clearable: true,
      disabled: true  // 初期は無効
    },
    show: (model) => !!model.province,
    dependencies: ['province'],
    onChange: async (value: string) => {
      // 同様の町村連携ロジック
      const formData = formRef.value.getFormData()
      if (value && formData.province) {
        // 町村データをロード...
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
    view: boolean      // 表示するか
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

  // フォーム項目に権限を適用
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
            { required: true, message: `${item.label}は必須項目です`, trigger: 'blur' }
          ] : item.itemProps?.rules
        }
      }
    })
  }
}

// 権限制御されたフォーム設定
const createPermissionControlledForm = (
  baseItems: MaFormItem[],
  permissions: FieldPermission[]
): MaFormItem[] => {
  return permissionService.applyPermissionsToItems(baseItems, permissions)
}

// 使用例
const userFormPermissions: FieldPermission[] = [
  {
    field: 'username',
    permissions: { view: true, edit: true, required: true }
  },
  {
    field: 'salary',
    permissions: { view: true, edit: true, required: false },
    conditions: {
      roles: ['admin', 'hr'],  // 管理者と人事のみ給与を編集可能
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

### 2. 動的権限更新

```typescript
const dynamicPermissionManager = {
  // ユーザー権限変更を監視
  watchUserPermissions: () => {
    watch(
      () => permissionService.userContext.value,
      (newUser, oldUser) => {
        if (newUser?.id !== oldUser?.id) {
          // ユーザー切り替え時に権限を再適用
          dynamicPermissionManager.refreshFormPermissions()
        }
      },
      { deep: true }
    )
  },

  // フォーム権限をリフレッシュ
  refreshFormPermissions: () => {
    const currentItems = formRef.value?.getItems() || []
    const updatedItems = permissionService.applyPermissionsToItems(
      currentItems,
      userFormPermissions
    )

    formRef.value?.setItems(updatedItems)
  },

  // フィールドレベルの権限更新
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
            { required: true, message: 'このフィールドは必須です', trigger: 'blur' }
          ] : []
        }
      })
    }
  }
}
```

## 国際化対応

### 1. 多言語設定

```typescript
interface I18nConfig {
  locale: string
  messages: Record<string, string>
  dateFormat: string
  numberFormat: Intl.NumberFormatOptions
}

const i18nService = {
  currentLocale: ref('ja-JP'),
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

  // 翻訳テキストを取得
  t(key: string, fallback?: string): string {
    const locale = this.currentLocale.value
    const message = this.messages.value[locale]?.[key]
    return message || fallback || key
  },

  // 言語を切り替え
  setLocale(locale: string) {
    this.currentLocale.value = locale
    // フォーム項目を更新
    this.updateFormItemsLocale()
  },

  // フォーム項目の国際化テキストを更新
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

// 国際化フォーム項目作成ファクトリ
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

### 2. リアクティブ国際化

```typescript
// リアクティブ国際化コンポジション関数
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

  // 言語変更を監視
  watch(
    () => i18nService.currentLocale.value,
    () => {
      // 新しい翻訳を適用するためにフォーム項目を再設定
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

## ビジネスルールエンジン

### 1. ルールエンジンの実装

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

  // ルールを登録
  registerRule(rule: BusinessRule) {
    this.rules.set(rule.id, rule)
  },

  // ルールを実行
  async executeRules(data: Record<string, any>) {
    // 優先度でソート
    const sortedRules = Array.from(this.rules.values())
      .filter(rule => rule.enabled)
      .sort((a, b) => b.priority - a.priority)

    for (const rule of sortedRules) {
      try {
        if (rule.condition(data)) {
          await rule.action(data, formRef.value)
        }
      } catch (error) {
        console.error(`ルール ${rule.name} の実行に失敗:`, error)
      }
    }
  },

  // ルールを削除
  removeRule(ruleId: string) {
    this.rules.delete(ruleId)
  }
}

// ビジネスルールの例
const registerBusinessRules = () => {
  // ルール1：VIP顧客に専用フィールドを表示
  businessRuleEngine.registerRule({
    id: 'vip-customer-fields',
    name: 'VIP顧客フィールド表示',
    description: '顧客タイプがVIPの場合、VIP専用フィールドを表示',
    condition: (data) => data.customerType === 'vip',
    action: (data, formRef) => {
      const vipFields = [
        {
          label: 'VIPランク',
          prop: 'vipLevel',
          render: 'select',
          renderSlots: {
            default: () => [
              h('el-option', { label: 'ゴールド', value: 'gold' }),
              h('el-option', { label: 'プラチナ', value: 'platinum' }),
              h('el-option', { label: 'ブラック', value: 'black' })
            ]
          }
        },
        {
          label: '専任サポート',
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

  // ルール2：法人顧客の必須フィールド
  businessRuleEngine.registerRule({
    id: 'enterprise-required-fields',
    name: '法人顧客必須フィールド',
    description: '法人顧客は追加の必須フィールドを入力する必要がある',
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
                { required: true, message: `${item.label}は必須項目です`, trigger: 'blur' }
              ]
            }
          })
        }
      })
    },
    priority: 90,
    enabled: true
  })

  // ルール3：金額制限チェック
  businessRuleEngine.registerRule({
    id: 'amount-limit-check',
    name: '金額制限チェック',
    description: '顧客ランクに基づいて取引金額を制限',
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
                    callback(new Error(`${customerLevel}顧客の1回あたりの取引限度額は${limit}円です`))
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

// フォームデータ変更時にルールを実行
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

## データ連携システム

### 1. 複雑なデータ連携

```typescript
const dataLinkageManager = {
  // 連携関係設定
  linkageConfig: new Map<string, {
    triggers: string[]                    // トリガーフィールド
    target: string                        // ターゲットフィールド
    handler: (data: any) => any | Promise<any>  // 処理関数
    debounce?: number                     // デバウンス時間
  }>(),

  // 連携関係を登録
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

  // フィールド変更を処理
  handleFieldChange(changedField: string, formData: Record<string, any>) {
    this.linkageConfig.forEach((config, id) => {
      if (config.triggers.includes(changedField)) {
        // デバウンス処理
        clearTimeout(this.debounceTimers?.get(id))

        const timer = setTimeout(async () => {
          try {
            const result = await config.handler(formData)
            if (result !== undefined) {
              // ターゲットフィールドを更新
              const currentData = formRef.value?.getFormData() || {}
              formRef.value?.setFormData({
                ...currentData,
                [config.target]: result
              })
            }
          } catch (error) {
            console.error(`連携処理失敗 ${id}:`, error)
          }
        }, config.debounce)

        this.debounceTimers = this.debounceTimers || new Map()
        this.debounceTimers.set(id, timer)
      }
    })
  },

  debounceTimers: new Map<string, number>()
}

// 連携関係登録の例
const setupDataLinkages = () => {
  // 都道府県・市区町村連携
  dataLinkageManager.registerLinkage({
    id: 'province-city-linkage',
    triggers: ['province'],
    target: 'city',
    handler: async (data) => {
      if (data.province) {
        const cities = await loadCitiesByProvince(data.province)
        // 市区町村オプションを更新
        updateCityOptions(cities)
        return '' // 市区町村選択をクリア
      }
      return undefined
    }
  })

  // 商品価格計算
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

  // 顧客情報自動入力
  dataLinkageManager.registerLinkage({
    id: 'customer-info-autofill',
    triggers: ['customerId'],
    target: 'customerInfo',
    handler: async (data) => {
      if (data.customerId) {
        const customerInfo = await fetchCustomerInfo(data.customerId)
        // 複数フィールドを一括更新
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

// フォームデータ変更を監視して連携をトリガー
watch(
  () => formRef.value?.getFormData(),
  (newData, oldData) => {
    if (newData && oldData) {
      // 変更されたフィールドを特定
      const changedFields = Object.keys(newData).filter(
        key => newData[key] !== oldData[key]
      )

      // 各変更フィールドを処理
      changedFields.forEach(field => {
        dataLinkageManager.handleFieldChange(field, newData)
      })
    }
  },
  { deep: true }
)
```

## 関連リンク

- [条件付きレンダリング](/v3/front/component/ma-form/examples/conditional-rendering)
- [動的検証](/v3/front/component/ma-form/examples/dynamic-validation)
- [ネストフォーム](/v3/front/component/ma-form/examples/nested-forms)
- [公開メソッド](/v3/front/component/ma-form/examples/expose-methods)