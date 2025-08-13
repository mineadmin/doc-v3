# フォームバリデーション

様々なバリデーションルールとシナリオをデモンストレーションします。基本バリデーション、高度なバリデーション、非同期バリデーション、条件付きバリデーションなどを含み、検索条件の正確性とデータの完全性を保証します。

## フォームバリデーションデモ

<DemoPreview dir="demos/ma-search/form-validation" />

## バリデーションルール説明

### 基本バリデーション
最も一般的なフォームバリデーションルール：

```typescript
// 必須バリデーション
{
  label: 'ユーザー名',
  prop: 'username',
  render: 'input',
  rules: [
    { required: true, message: 'ユーザー名は必須です', trigger: 'blur' }
  ]
}

// 長さバリデーション
{
  label: '説明',
  prop: 'description', 
  render: 'input',
  rules: [
    { min: 10, max: 100, message: '説明は10～100文字で入力してください', trigger: 'blur' }
  ]
}
```

### フォーマットバリデーション
メールアドレス、電話番号、URLなどのフォーマットバリデーション：

```typescript
// メールアドレスバリデーション
{
  label: 'メールアドレス',
  prop: 'email',
  render: 'input',
  rules: [
    { required: true, message: 'メールアドレスは必須です', trigger: 'blur' },
    { type: 'email', message: '正しいメールアドレス形式で入力してください', trigger: 'blur' }
  ]
}

// カスタム正規表現バリデーション
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

### 数値範囲バリデーション
数値入力の範囲バリデーション：

```typescript
// 数値範囲バリデーション
{
  label: '年齢',
  prop: 'age',
  render: 'input-number',
  rules: [
    { type: 'number', min: 18, max: 65, message: '年齢は18～65歳の間で入力してください', trigger: 'blur' }
  ]
}

// 金額バリデーション
{
  label: '価格',
  prop: 'price',
  render: 'input-number',
  rules: [
    { required: true, message: '価格は必須です', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '価格は0より大きい値を入力してください', trigger: 'blur' }
  ]
}
```

## 高度なバリデーションシナリオ

### 非同期バリデーション
サーバーサイドバリデーションをサポートする非同期バリデーションルール：

```typescript
// 非同期バリデーション例
{
  label: 'ユーザー名',
  prop: 'username',
  render: 'input',
  rules: [
    {
      validator: async (rule: any, value: string) => {
        if (!value) return
        
        // 非同期バリデーションのシミュレーション
        const response = await checkUsernameExists(value)
        if (response.exists) {
          throw new Error('このユーザー名は既に使用されています')
        }
      },
      trigger: 'blur'
    }
  ]
}

// デバウンス非同期バリデーション
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
          throw new Error('企業名が規格に合致しません')
        }
      }, 500),
      trigger: 'change'
    }
  ]
}
```

### 条件付きバリデーション
他のフィールド値に基づく条件付きバリデーション：

```typescript
// 条件付きバリデーション例
const createConditionalRules = () => {
  return [
    {
      validator: (rule: any, value: string) => {
        const formData = searchRef.value?.getSearchForm()
        
        // 「企業ユーザー」選択時、企業名は必須
        if (formData?.userType === 'enterprise' && !value) {
          throw new Error('企業ユーザーは企業名を入力してください')
        }
      },
      trigger: 'blur'
    }
  ]
}

// 条件付きバリデーション適用
{
  label: '企業名',
  prop: 'company',
  render: 'input',
  rules: createConditionalRules()
}
```

### 複合バリデーション
複数フィールドの連携バリデーション：

```typescript
// パスワード確認バリデーション
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
          throw new Error('パスワードが一致しません')
        }
      },
      trigger: 'blur'
    }
  ]
}

// 日付範囲バリデーション
{
  label: '終了日',
  prop: 'endDate',
  render: 'date-picker',
  rules: [
    {
      validator: (rule: any, value: string) => {
        const formData = searchRef.value?.getSearchForm()
        
        if (value && formData?.startDate && new Date(value) < new Date(formData.startDate)) {
          throw new Error('終了日は開始日より前にはできません')
        }
      },
      trigger: 'change'
    }
  ]
}
```

## 使用シナリオ

### 1. ユーザー登録検索
ユーザー登録情報の厳格なバリデーション：

```typescript
const userRegisterSearchItems = [
  {
    label: 'ユーザー名',
    prop: 'username',
    render: 'input',
    rules: [
      { required: true, message: 'ユーザー名は必須です' },
      { min: 3, max: 20, message: 'ユーザー名は3～20文字で入力してください' },
      { pattern: /^[a-zA-Z0-9_]+$/, message: 'ユーザー名は英数字とアンダースコアのみ使用できます' }
    ]
  },
  {
    label: 'メールアドレス',
    prop: 'email',
    render: 'input',
    rules: [
      { required: true, message: 'メールアドレスは必須です' },
      { type: 'email', message: '正しいメールアドレス形式で入力してください' }
    ]
  }
]
```

### 2. 金融データ検索
金融分野の精密データバリデーション：

```typescript
const financialSearchItems = [
  {
    label: '取引金額',
    prop: 'amount',
    render: 'input-number',
    rules: [
      { required: true, message: '取引金額は必須です' },
      { type: 'number', min: 0.01, max: 999999.99, message: '金額は0.01～999999.99の範囲で入力してください' }
    ]
  },
  {
    label: '口座番号',
    prop: 'account',
    render: 'input',
    rules: [
      { required: true, message: '口座番号は必須です' },
      { pattern: /^\d{16,19}$/, message: '口座番号は16～19桁の数字で入力してください' }
    ]
  }
]
```

### 3. 注文管理バリデーション
注文検索のビジネスルールバリデーション：

```typescript
const orderSearchItems = [
  {
    label: '注文番号',
    prop: 'orderNo',
    render: 'input',
    rules: [
      { pattern: /^ORD\d{12}$/, message: '注文番号形式：ORD+12桁数字' }
    ]
  },
  {
    label: '注文金額',
    prop: 'orderAmount',
    render: 'input-number',
    rules: [
      { type: 'number', min: 1, message: '注文金額は0より大きい値を入力してください' }
    ]
  }
]
```

## 主要機能

- ✅ 完全なバリデーションルールサポート
- 🔄 非同期バリデーション機能
- 🎯 条件付きバリデーションと連携バリデーション
- 📝 分かりやすいエラーメッセージ
- ⚡ 高性能なバリデーションメカニズム
- 🛡 データセキュリティと完全性の保証

## バリデーションタイミング制御

### トリガー方法設定
異なるバリデーショントリガータイミング：

```typescript
// リアルタイムバリデーション
{
  rules: [
    { required: true, message: '必須入力です', trigger: 'change' }
  ]
}

// フォーカス外れバリデーション
{
  rules: [
    { type: 'email', message: '正しいメールアドレス形式で入力してください', trigger: 'blur' }
  ]
}

// 手動バリデーション
{
  rules: [
    { 
      validator: validateAsync, 
      trigger: 'manual'  // 手動でバリデーションを呼び出す必要あり
    }
  ]
}
```

### バリデーション状態管理
バリデーション状態の取得と制御：

```typescript
// 単一フィールドバリデーション
const validateField = async (prop: string) => {
  const formRef = searchRef.value?.getMaFormRef()
  try {
    await formRef?.validateField(prop)
    console.log(`${prop}フィールドのバリデーションに成功しました`)
  } catch (error) {
    console.log(`${prop}フィールドのバリデーションに失敗しました:`, error)
  }
}

// フォーム全体バリデーション
const validateForm = async () => {
  const formRef = searchRef.value?.getMaFormRef()
  try {
    await formRef?.validate()
    console.log('フォームバリデーションに成功しました。検索を実行できます')
    return true
  } catch (error) {
    console.log('フォームバリデーションに失敗しました:', error)
    return false
  }
}

// バリデーション状態クリア
const clearValidation = () => {
  const formRef = searchRef.value?.getMaFormRef()
  formRef?.clearValidate()
}
```

## ベストプラクティス

### 1. ユーザーエクスペリエンス最適化
- リアルタイムのバリデーションフィードバックを提供
- 分かりやすいエラーメッセージを使用
- エラーメッセージの国際化をサポート

```typescript
// ユーザーフレンドリーなエラーメッセージ
const createFriendlyRules = (fieldName: string) => [
  { 
    required: true, 
    message: `${fieldName}を入力してください`, 
    trigger: 'blur' 
  },
  {
    validator: (rule: any, value: string) => {
      if (value && value.length < 2) {
        throw new Error(`${fieldName}は2文字以上必要です`)
      }
    },
    trigger: 'blur'
  }
]
```

### 2. パフォーマンス最適化
- 頻繁なバリデーションにはデバウンスを使用
- 非同期バリデーションのエラー処理
- バリデーションキャッシュメカニズム

```typescript
// バリデーションキャッシュ
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

### 3. メンテナンス性
- 共通バリデーションルールの抽出
- バリデーションルールファクトリ関数の作成
- バリデーションルールの動的設定サポート

```typescript
// 共通バリデーションルールライブラリ
const ValidationRules = {
  required: (message?: string) => ({
    required: true,
    message: message || 'このフィールドは必須です',
    trigger: 'blur'
  }),
  
  email: (message?: string) => ({
    type: 'email',
    message: message || '正しいメールアドレス形式で入力してください',
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
    message: message || `${min}～${max}の範囲で入力してください`,
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

- [高度な検索](./advanced-search) - 複雑な検索シナリオでのバリデーション適用を理解
- [テーブル統合](./table-integration) - データ送信前のバリデーションの役割を理解
- [メソッドデモ](./methods-demo) - バリデーション関連のコンポーネントメソッドを理解