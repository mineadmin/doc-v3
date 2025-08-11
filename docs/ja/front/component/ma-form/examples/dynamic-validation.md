# 動的バリデーション

MaFormの動的バリデーション機能を紹介します。カスタム同期バリデーション、非同期バリデーション、連動バリデーション、複雑なバリデーションルールを含みます。

<DemoPreview dir="demos/ma-form/dynamic-validation" />

## 機能特徴

- **多層バリデーション**: Element Plusネイティブルール、カスタム同期バリデーション、非同期バリデーションをサポート
- **連動バリデーション**: フィールド間の依存関係を持つバリデーションロジック
- **リアルタイムバリデーション**: 入力中の即時フィードバック
- **非同期バリデーション**: サーバーサイドバリデーション（ユニークチェックなど）をサポート
- **カスタムエラーメッセージ**: 柔軟なエラーメッセージカスタマイズ

## バリデーションレベル

### 1. Element Plusネイティブバリデーションルール

```typescript
{
  label: 'ユーザー名',
  prop: 'username',
  render: 'input',
  itemProps: {
    rules: [
      { required: true, message: 'ユーザー名を入力してください', trigger: 'blur' },
      { min: 3, max: 15, message: '3〜15文字で入力してください', trigger: 'blur' },
      { pattern: /^[a-zA-Z0-9_]+$/, message: '英数字とアンダースコアのみ使用可能', trigger: 'blur' }
    ]
  }
}
```

### 2. カスタム同期バリデーション

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

### 3. 非同期バリデーション

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
    
    // メール形式バリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      throw new Error('有効なメールアドレスを入力してください')
    }
    
    // メールアドレスの存在チェック（非同期）
    try {
      const exists = await checkEmailExists(value)
      if (exists) {
        throw new Error('このメールアドレスは既に登録されています')
      }
    } catch (error) {
      if (error.message.includes('既に登録')) {
        throw error
      }
      throw new Error('メールアドレスの確認に失敗しました。後ほど再試行してください')
    }
  }
}
```

## 複雑なバリデーションシナリオ

### 1. 連動バリデーション

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
        callback(new Error('開始日は終了日より前でなければなりません'))
      } else {
        callback()
        // 終了日の再バリデーションをトリガー
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
        callback(new Error('終了日は開始日より後でなければなりません'))
      } else {
        callback()
        // 開始日の再バリデーションをトリガー
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

### 2. 条件付きバリデーション

```typescript
{
  label: '電話番号',
  prop: 'phoneNumber',
  render: 'input',
  customValidator: (rule, value, callback) => {
    // ユーザータイプに基づいて必須かどうかを決定
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

### 3. ビジネスロジックバリデーション

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
      callback(new Error('商品価格は0より大きい必要があります'))
      return
    }
    
    // ビジネスルール: VIP商品は100未満不可
    const isVipProduct = formData.isVipProduct
    if (isVipProduct && value < 100) {
      callback(new Error('VIP商品の価格は100元以上でなければなりません'))
      return
    }
    
    // ビジネスルール: プロモーション商品は1000超不可
    const isPromotional = formData.isPromotional  
    if (isPromotional && value > 1000) {
      callback(new Error('プロモーション商品の価格は1000円以下でなければなりません'))
      return
    }
    
    callback()
  },
  dependencies: ['isVipProduct', 'isPromotional']
}
```

## 非同期バリデーションのベストプラクティス

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

// デバウンス付き非同期バリデーション
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
      throw new Error('このユーザー名は既に使用されています')
    }
  }
}
```

### 2. ローディング状態表示

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
        throw new Error('このユーザー名は既に使用されています')
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

### 3. エラー処理

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
          throw new Error('リクエストが多すぎます。しばらくしてから再試行してください')
        }
        throw new Error('バリデーションサービスが利用できません')
      }
      
      const result = await response.json()
      if (result.exists) {
        throw new Error('このメールアドレスは既に登録されています')
      }
      
    } catch (error) {
      if (error.name === 'TypeError') {
        // ネットワークエラー
        throw new Error('ネットワーク接続に失敗しました。設定を確認してください')
      }
      throw error
    }
  }
}
```

## バリデーションタイミング制御

### 1. トリガー方法設定

```typescript
{
  label: 'リアルタイムバリデーションフィールド',
  prop: 'realtime',
  render: 'input',
  itemProps: {
    rules: [
      { required: true, message: 'このフィールドは必須です', trigger: 'change' }  // 入力時にバリデーション
    ]
  }
}

{
  label: 'フォーカスアウトバリデーションフィールド', 
  prop: 'onblur',
  render: 'input',
  itemProps: {
    rules: [
      { required: true, message: 'このフィールドは必須です', trigger: 'blur' }   // フォーカスアウト時にバリデーション
    ]
  }
}
```

### 2. 手動バリデーション制御

```typescript
// 特定フィールドをバリデーション
const validateSingleField = async (prop) => {
  try {
    const isValid = await formRef.value?.validateField(prop)
    console.log(`フィールド ${prop} バリデーション結果:`, isValid)
  } catch (error) {
    console.error(`フィールド ${prop} バリデーション失敗:`, error)
  }
}

// フォーム全体をバリデーション
const validateForm = async () => {
  try {
    const isValid = await formRef.value?.validate()
    if (isValid) {
      console.log('フォームバリデーション成功')
    }
  } catch (error) {
    console.error('フォームバリデーション失敗:', error)
  }
}
```

## 関連リンク

- [MaFormItem バリデーション設定](/ja/front/component/ma-form#バリデーション設定)
- [高度な機能 - 動的バリデーション](/ja/front/component/ma-form#動的バリデーション)
- [公開メソッド - フォームバリデーション](/ja/front/component/ma-form#フォームバリデーション)