# フォーム検証

様々な検証ルールとシナリオをデモンストレーションします。基本検証、高度な検証、非同期検証、条件検証などを含み、検索条件の正確性とデータの完全性を確保します。

## フォーム検証デモ

<DemoPreview dir="demos/ma-search/form-validation" />

## 検証ルールの説明

### 基本検証
最も一般的なフォーム検証ルール：

```typescript
// 必須入力検証
{
  label: 'ユーザー名',
  prop: 'username',
  render: 'input',
  rules: [
    { required: true, message: 'ユーザー名は必須です', trigger: 'blur' }
  ]
}

// 長さ検証
{
  label: '説明',
  prop: 'description', 
  render: 'input',
  rules: [
    { min: 10, max: 100, message: '説明は10〜100文字で入力してください', trigger: 'blur' }
  ]
}
```

### 形式検証
メールアドレス、電話番号、URLなどの形式検証：

```typescript
// メールアドレス検証
{
  label: 'メールアドレス',
  prop: 'email',
  render: 'input',
  rules: [
    { required: true, message: 'メールアドレスは必須です', trigger: 'blur' },
    { type: 'email', message: 'メールアドレスの形式が正しくありません', trigger: 'blur' }
  ]
}

// カスタム正規表現検証
{
  label: '電話番号',
  prop: 'phone',
  render: 'input',
  rules: [
    { 
      pattern: /^1[3-9]\d{9}$/, 
      message: '正しい電話番号を入力してください', 
      trigger: 'blur' 
    }
  ]
}
```

### 数値範囲検証
数値入力の範囲検証：

```typescript
// 数値範囲検証
{
  label: '年齢',
  prop: 'age',
  render: 'input-number',
  rules: [
    { type: 'number', min: 18, max: 65, message: '年齢は18〜65の間でなければなりません', trigger: 'blur' }
  ]
}

// 金額検証
{
  label: '価格',
  prop: 'price',
  render: 'input-number',
  rules: [
    { required: true, message: '価格は必須です', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '価格は0より大きくなければなりません', trigger: 'blur' }
  ]
}
```

## 高度な検証シナリオ

### 非同期検証
サーバーサイド検証をサポートする非同期検証ルール：

```typescript
// 非同期検証の例
{
  label: 'ユーザー名',
  prop: 'username',
  render: 'input',
  rules: [
    {
      validator: async (rule: any, value: string) => {
        if (!value) return
        
        // 非同期検証をシミュレート
        const response = await checkUsernameExists(value)
        if (response.exists) {
          throw new Error('ユーザー名は既に存在します')
        }
      },
      trigger: 'blur'
    }
  ]
}

// デバウンス付き非同期検証
{
  label: '企業名',
  prop: 'company',
  render: 'input',
  rules: [
    {
      validator: debounce(async (rule: any, value: string) => {
        if (!value) return
        
        const isValid = await validateCompanyName(value)
        if (!isValid) {
          throw new Error('企業名が規格に適合していません')
        }
      }, 500),
      trigger: 'change'
    }
  ]
}
```

### 条件検証
他のフィールドの値に基づく条件検証：

```typescript
// 条件検証の例
const createConditionalRules = () => {
  return [
    {
      validator: (rule: any, value: string) => {
        const formData = searchRef.value?.getSearchForm()
        
        // 「企業ユーザー」が選択されている場合、企業名は必須
        if (formData?.userType === 'enterprise' && !value) {
          throw new Error('企業ユーザーは企業名を入力する必要があります')
        }
      },
      trigger: 'blur'
    }
  ]
}

// 条件検証の適用
{
  label: '企業名',
  prop: 'company',
  render: 'input',
  rules: createConditionalRules()
}
```

### 組み合わせ検証
複数フィールドの連携検証：

```typescript
// パスワード確認検証
{
  label: 'パスワード確認',
  prop: 'confirmPassword',
  render: 'input',
  props: { type: 'password' },
  rules: [
    {
      validator: (rule: any, value: string) => {
        const formData = searchRef.value?.getSearchForm()
        
        if (value !== formData?.password) {
          throw new Error('入力されたパスワードが一致しません')
        }
      },
      trigger: 'blur'
    }
  ]
}

// 日付範囲検証
{
  label: '終了時間',
  prop: 'endDate',
  render: 'date-picker',
  rules: [
    {
      validator: (rule: any, value: string) => {
        const formData = searchRef.value?.getSearchForm()
        
        if (value && formData?.startDate && new Date(value) < new Date(formData.startDate)) {
          throw new Error('終了時間は開始時間より前にはできません')
        }
      },
      trigger: 'change'
    }
  ]
}
```

## 使用シナリオ

### 1. ユーザー登録検索
ユーザー登録情報の厳格な検証：

```typescript
const userRegisterSearchItems = [
  {
    label: 'ユーザー名',
    prop: 'username',
    render: 'input',
    rules: [
      { required: true, message: 'ユーザー名は必須です' },
      { min: 3, max: 20, message: 'ユーザー名は3〜20文字です' },
      { pattern: /^[a-zA-Z0-9_]+$/, message: 'ユーザー名は英数字、アンダースコアのみ使用できます' }
    ]
  },
  {
    label: 'メールアドレス',
    prop: 'email',
    render: 'input',
    rules: [
      { required: true, message: 'メールアドレスは必須です' },
      { type: 'email', message: 'メールアドレスの形式が正しくありません' }
    ]
  }
]
```

### 2. 金融データ照会
金融分野の正確なデータ検証：

```typescript
const financialSearchItems = [
  {
    label: '取引金額',
    prop: 'amount',
    render: 'input-number',
    rules: [
      { required: true, message: '取引金額は必須です' },
      { type: 'number', min: 0.01, max: 999999.99, message: '金額範囲：0.01〜999999.99' }
    ]
  },
  {
    label: '口座番号',
    prop: 'account',
    render: 'input',
    rules: [
      { required: true, message: '口座番号は必須です' },
      { pattern: /^\d{16,19}$/, message: '口座番号は16〜19桁の数字でなければなりません' }
    ]
  }
]
```

### 3. 注文管理検証
注文照会のビジネスルール検証：

```typescript
const orderSearchItems = [
  {
    label: '注文番号',
    prop: 'orderNo',
    render: 'input',
    rules: [
      { pattern: /^ORD\d{12}$/, message: '注文番号形式：ORD+12桁の数字' }
    ]
  },
  {
    label: '注文金額',
    prop: 'orderAmount',
    render: 'input-number',
    rules: [
      { type: 'number', min: 1, message: '注文金額は0より大きくなければなりません' }
    ]
  }
]
```

## 主要機能

- ✅ 完全な検証ルールのサポート
- 🔄 非同期検証機能
- 🎯 条件検証と連携検証
- 📝 わかりやすいエラーメッセージ
- ⚡ 高性能な検証メカニズム
- 🛡 データセキュリティと完全性の保証

## 検証タイミングの制御

### トリガー方式の設定
異なる検証トリガータイミング：

```typescript
// リアルタイム検証
{
  rules: [
    { required: true, message: '必須項目です', trigger: 'change' }
  ]
}

// フォーカス喪失時検証
{
  rules: [
    { type: 'email', message: 'メールアドレスの形式が正しくありません', trigger: 'blur' }
  ]
}

// 手動検証
{
  rules: [
    { 
      validator: validateAsync, 
      trigger: 'manual'  // 手動で検証を呼び出す必要があります
    }
  ]
}
```

### 検証状態管理
検証状態の取得と制御：

```typescript
// 単一フィールドの検証
const validateField = async (prop: string) => {
  const formRef = searchRef.value?.getMaFormRef()
  try {
    await formRef?.validateField(prop)
    console.log(`${prop}フィールドの検証に成功しました`)
  } catch (error) {
    console.log(`${prop}フィールドの検証に失敗しました:`, error)
  }
}

// フォーム全体の検証
const validateForm = async () => {
  const formRef = searchRef.value?.getMaFormRef()
  try {
    await formRef?.validate()
    console.log('フォーム検証に成功しました。検索を実行できます')
    return true
  } catch (error) {
    console.log('フォーム検証に失敗しました:', error)
    return false
  }
}

// 検証状態のクリア
const clearValidation = () => {
  const formRef = searchRef.value?.getMaFormRef()
  formRef?.clearValidate()
}
```

## ベストプラクティス

### 1. ユーザーエクスペリエンスの最適化
- リアルタイムの検証フィードバックを提供
- わかりやすいエラーメッセージを使用
- エラーメッセージの国際化をサポート

```typescript
// わかりやすいエラーメッセージ
const createFriendlyRules = (fieldName: string) => [
  { 
    required: true, 
    message: `${fieldName}を入力してください`, 
    trigger: 'blur' 
  },
  {
    validator: (rule: any, value: string) => {
      if (value && value.length < 2) {
        throw new Error(`${fieldName}は最低2文字必要です`)
      }
    },
    trigger: 'blur'
  }
]
```

### 2. パフォーマンス最適化
- 頻繁な検証にはデバウンスを使用
- 非同期検証のエラーハンドリング
- 検証キャッシュメカニズム

```typescript
// 検証キャッシュ
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

### 3. 保守性
- 共通の検証ルールを抽出
- 検証ルールファクトリ関数を作成
- 検証ルールの動的設定をサポート

```typescript
// 共通検証ルールライブラリ
const ValidationRules = {
  required: (message?: string) => ({
    required: true,
    message: message || 'このフィールドは必須です',
    trigger: 'blur'
  }),
  
  email: (message?: string) => ({
    type: 'email',
    message: message || 'メールアドレスの形式が正しくありません',
    trigger: 'blur'
  }),
  
  phone: (message?: string) => ({
    pattern: /^1[3-9]\d{9}$/,
    message: message || '正しい電話番号を入力してください',
    trigger: 'blur'
  }),
  
  range: (min: number, max: number, message?: string) => ({
    type: 'number',
    min,
    max,
    message: message || `値は${min}〜${max}の間でなければなりません`,
    trigger: 'blur'
  })
}

// 共通ルールの使用
{
  label: 'メールアドレス',
  prop: 'email',
  render: 'input',
  rules: [
    ValidationRules.required(),
    ValidationRules.email()
  ]
}
```

## 関連リンク

- [高度な検索](./advanced-search) - 複雑な検索シナリオでの検証の適用について
- [テーブル連携](./table-integration) - データ送信前の検証の役割について
- [メソッドデモ](./methods-demo) - 検証関連のコンポーネントメソッドについて