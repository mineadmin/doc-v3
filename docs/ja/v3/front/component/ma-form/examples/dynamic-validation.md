# 動的検証

MaFormの動的検証機能を紹介します。カスタム同期検証、非同期検証、連動検証、複雑な検証ルールを含みます。

<DemoPreview dir="demos/ma-form/dynamic-validation" />

## 機能特性

- **多層次検証**：Element Plusネイティブルール、カスタム同期検証、非同期検証をサポート
- **連動検証**：フィールド間で相互依存する検証ロジック
- **リアルタイム検証**：入力中の即時検証フィードバック
- **非同期検証**：サーバー側検証（一意性チェックなど）をサポート
- **カスタムエラーメッセージ**：柔軟なエラーメッセージカスタマイズ

## 検証層次

### 1. Element Plus ネイティブ検証ルール

```typescript
{
  label: 'ユーザー名',
  prop: 'username',
  render: 'input',
  itemProps: {
    rules: [
      { required: true, message: 'ユーザー名を入力してください', trigger: 'blur' },
      { min: 3, max: 15, message: '3～15文字の間で入力してください', trigger: 'blur' },
      { pattern: /^[a-zA-Z0-9_]+$/, message: '英数字とアンダースコアのみ使用できます', trigger: 'blur' }
    ]
  }
}
```

### 2. カスタム同期検証

```typescript
{
  label: 'パスワード確認',
  prop: 'confirmPassword',
  render: 'input',
  renderProps: {
    type: 'password',
    showPassword: true
  },
  customValidator: (rule, value, callback) => {
    if (!value) {
      callback(new Error('パスワードを確認してください'))
    } else if (value !== formData.password) {
      callback(new Error('パスワードが一致しません'))
    } else {
      callback()
    }
  }
}
```

### 3. 非同期検証

```typescript
{
  label: 'メールアドレス',
  prop: 'email', 
  render: 'input',
  renderProps: {
    type: 'email'
  },
  asyncValidator: async (rule, value) => {
    if (!value) {
      throw new Error('メールアドレスを入力してください')
    }
    
    // メール形式検証
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      throw new Error('有効なメールアドレスを入力してください')
    }
    
    // メールアドレスが既に存在するか非同期チェック
    try {
      const exists = await checkEmailExists(value)
      if (exists) {
        throw new Error('このメールアドレスは既に登録されています')
      }
    } catch (error) {
      if (error.message.includes('既に登録')) {
        throw error
      }
      throw new Error('メール検証に失敗しました。後でもう一度お試しください')
    }
  }
}
```

## 複雑な検証シナリオ

### 1. 連動検証

```typescript
const linkedValidationFields = [
  {
    label: '開始日',
    prop: 'startDate',
    render: 'datePicker',
    renderProps: {
      type: 'date',
      placeholder: '開始日を選択'
    },
    customValidator: (rule, value, callback) => {
      if (!value) {
        callback(new Error('開始日を選択してください'))
        return
      }
      
      const endDate = formData.endDate
      if (endDate && new Date(value) >= new Date(endDate)) {
        callback(new Error('開始日は終了日より前である必要があります'))
      } else {
        callback()
        // 終了日を再検証
        nextTick(() => {
          if (endDate) {
            formRef.value?.validateField('endDate')
          }
        })
      }
    }
  },
  {
    label: '終了日',
    prop: 'endDate',
    render: 'datePicker',
    renderProps: {
      type: 'date', 
      placeholder: '終了日を選択'
    },
    customValidator: (rule, value, callback) => {
      if (!value) {
        callback(new Error('終了日を選択してください'))
        return
      }
      
      const startDate = formData.startDate
      if (startDate && new Date(value) <= new Date(startDate)) {
        callback(new Error('終了日は開始日より後である必要があります'))
      } else {
        callback()
        // 開始日を再検証
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

### 2. 条件付き検証

```typescript
{
  label: '電話番号',
  prop: 'phoneNumber',
  render: 'input',
  customValidator: (rule, value, callback) => {
    // ユーザータイプによって必須かどうかを決定
    const userType = formData.userType
    const isRequired = userType === 'individual'
    
    if (isRequired && !value) {
      callback(new Error('個人ユーザーは電話番号を入力する必要があります'))
      return
    }
    
    if (value && !/^1[3-9]\d{9}$/.test(value)) {
      callback(new Error('有効な電話番号を入力してください'))
      return  
    }
    
    callback()
  },
  dependencies: ['userType']
}
```

### 3. ビジネスロジック検証

```typescript
{
  label: '商品価格',
  prop: 'price',
  render: 'inputNumber',
  renderProps: {
    min: 0,
    precision: 2,
    controlsPosition: 'right'
  },
  customValidator: (rule, value, callback) => {
    if (value === null || value === undefined) {
      callback(new Error('商品価格を入力してください'))
      return
    }
    
    if (value <= 0) {
      callback(new Error('商品価格は0より大きくなければなりません'))
      return
    }
    
    // ビジネスルール：VIP商品の価格は100以上である必要がある
    const isVipProduct = formData.isVipProduct
    if (isVipProduct && value < 100) {
      callback(new Error('VIP商品の価格は100元以上である必要があります'))
      return
    }
    
    // ビジネスルール：プロモーション商品の価格は1000以下である必要がある
    const isPromotional = formData.isPromotional  
    if (isPromotional && value > 1000) {
      callback(new Error('プロモーション商品の価格は1000元以下である必要があります'))
      return
    }
    
    callback()
  },
  dependencies: ['isVipProduct', 'isPromotional']
}
```

## 非同期検証のベストプラクティス

### 1. デバウンス処理

```typescript
// デバウンス関数を作成
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

// デバウンスされた非同期検証
const debouncedUsernameCheck = debounce(async (username) => {
  return await checkUsernameExists(username)
}, 500)

{
  label: 'ユーザー名',
  prop: 'username',
  render: 'input',
  asyncValidator: async (rule, value) => {
    if (!value) {
      throw new Error('ユーザー名を入力してください')
    }
    
    const exists = await debouncedUsernameCheck(value)
    if (exists) {
      throw new Error('ユーザー名は既に存在します')
    }
  }
}
```

### 2. ローディング表示

```typescript
{
  label: 'ユーザー名',
  prop: 'username', 
  render: 'input',
  renderProps: {
    loading: false  // updateItemで動的に更新
  },
  asyncValidator: async (rule, value) => {
    if (!value) {
      throw new Error('ユーザー名を入力してください')
    }
    
    // ローディング状態を表示
    formRef.value?.updateItem('username', {
      renderProps: { loading: true }
    })
    
    try {
      const exists = await checkUsernameExists(value)
      if (exists) {
        throw new Error('ユーザー名は既に存在します')
      }
    } finally {
      // ローディング状態を非表示
      formRef.value?.updateItem('username', {
        renderProps: { loading: false }
      })
    }
  }
}
```

### 3. エラーハンドリング

```typescript
{
  label: 'メール',
  prop: 'email',
  render: 'input',
  asyncValidator: async (rule, value) => {
    try {
      const response = await fetch(`/api/check-email?email=${value}`)
      
      if (!response.ok) {
        // HTTPエラー処理
        if (response.status === 429) {
          throw new Error('リクエストが多すぎます。後でもう一度お試しください')
        }
        throw new Error('検証サービスが一時的に利用できません')
      }
      
      const result = await response.json()
      if (result.exists) {
        throw new Error('このメールアドレスは既に登録されています')
      }
      
    } catch (error) {
      if (error.name === 'TypeError') {
        // ネットワークエラー
        throw new Error('ネットワーク接続に失敗しました。ネットワーク設定を確認してください')
      }
      throw error
    }
  }
}
```

## 検証タイミング制御

### 1. トリガー設定

```typescript
{
  label: 'リアルタイム検証フィールド',
  prop: 'realtime',
  render: 'input',
  itemProps: {
    rules: [
      { required: true, message: 'このフィールドは必須です', trigger: 'change' }  // 入力中に検証
    ]
  }
}

{
  label: 'フォーカス喪失検証フィールド', 
  prop: 'onblur',
  render: 'input',
  itemProps: {
    rules: [
      { required: true, message: 'このフィールドは必須です', trigger: 'blur' }   // フォーカス喪失時に検証
    ]
  }
}
```

### 2. 手動検証制御

```typescript
// 特定フィールドを検証
const validateSingleField = async (prop) => {
  try {
    const isValid = await formRef.value?.validateField(prop)
    console.log(`フィールド ${prop} 検証結果:`, isValid)
  } catch (error) {
    console.error(`フィールド ${prop} 検証失敗:`, error)
  }
}

// フォーム全体を検証
const validateForm = async () => {
  try {
    const isValid = await formRef.value?.validate()
    if (isValid) {
      console.log('フォーム検証成功')
    }
  } catch (error) {
    console.error('フォーム検証失敗:', error)
  }
}
```

## 関連リンク

- [MaFormItem 検証設定](/v3/front/component/ma-form#検証設定)
- [高度な機能 - 動的検証](/v3/front/component/ma-form#動的検証)
- [公開メソッド - フォーム検証](/v3/front/component/ma-form#フォーム検証)