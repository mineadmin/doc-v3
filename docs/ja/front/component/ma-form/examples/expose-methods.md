# 公開メソッド

MaFormコンポーネントがdefineExposeを通じて公開するすべてのAPIメソッドを紹介します。これにはローディング状態の制御、リアクティブな状態管理、インスタンスアクセスなどの機能が含まれます。

<DemoPreview dir="demos/ma-form/expose-methods" />

## 機能特徴

- **ローディング状態制御**: フォームのローディング状態を設定
- **リアクティブ状態管理**: モバイル状態の検出
- **フォームアイテム管理**: 動的にフォームアイテム設定を変更
- **インスタンスアクセス**: 基盤のElement Plus Formインスタンスを取得して高度な操作を実行

## MaForm公開メソッド詳細

### 状態管理メソッド

### ローディング状態制御

```typescript
// ローディング状態を設定
formRef.value?.setLoadingState(true)

// 現在のローディング状態を取得
const isLoading = formRef.value?.getLoadingState?.()

// ローディング状態を切り替え
const toggleLoading = () => {
  const currentState = formRef.value?.getLoadingState?.() || false
  formRef.value?.setLoadingState(!currentState)
}

// 送信処理中のローディング状態をシミュレート
const handleSubmit = async () => {
  try {
    formRef.value?.setLoadingState(true)
    
    // フォームバリデーションを実行
    await formRef.value?.getElFormRef()?.validate()
    
    // 非同期送信をシミュレート
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    ElMessage.success('送信成功')
  } catch (error) {
    ElMessage.error('送信失敗')
  } finally {
    formRef.value?.setLoadingState(false)
  }
}
```

### リアクティブ状態管理

```typescript
// モバイル状態かどうかをチェック
const isMobile = formRef.value?.isMobileState?.()

// 手動でリアクティブ状態を更新（ウィンドウサイズ変更時）
window.addEventListener('resize', () => {
  formRef.value?.updateResponsiveState?.()
})

// デバイス状態に応じてフォームレイアウトを調整
const adjustFormLayout = () => {
  const isMobile = formRef.value?.isMobileState?.()
  if (isMobile) {
    // モバイルではシングルカラムレイアウトを使用
    console.log('現在モバイルモードです。レスポンシブレイアウトを使用します')
  } else {
    // デスクトップではマルチカラムレイアウトを使用
    console.log('現在デスクトップモードです。標準レイアウトを使用します')
  }
}
```

## Element Plus Formインスタンスアクセス

### ネイティブフォームインスタンスの取得

MaFormで最も重要な公開メソッドの1つが`getElFormRef()`で、基盤のElement Plus Formインスタンスにアクセスし、すべてのネイティブフォームメソッドを使用できます:

```typescript
// Element Plus el-formインスタンスを取得
const getElFormInstance = () => {
  const elFormInstance = formRef.value?.getElFormRef()
  if (elFormInstance) {
    console.log('Element Plusフォームインスタンス:', elFormInstance)
    return elFormInstance
  } else {
    console.warn('フォームインスタンスが初期化されていません')
    return null
  }
}
```

### インスタンスを使用したフォームバリデーション

`getElFormRef()`で取得したインスタンスでElement Plusフォームのすべてのネイティブバリデーションメソッドを呼び出せます:

```typescript
// フォーム全体をバリデーション
const validateForm = async () => {
  try {
    const elFormRef = formRef.value?.getElFormRef()
    if (!elFormRef) {
      throw new Error('フォームインスタンスが見つかりません')
    }
    
    const isValid = await elFormRef.validate()
    if (isValid) {
      ElMessage.success('フォームバリデーション成功')
      return true
    }
  } catch (error) {
    ElMessage.error('フォームバリデーション失敗')
    console.error('バリデーションエラー:', error)
    return false
  }
}

// 単一フィールドをバリデーション
const validateSingleField = async (prop: string) => {
  try {
    const elFormRef = formRef.value?.getElFormRef()
    if (!elFormRef) return false
    
    await elFormRef.validateField(prop)
    console.log(`フィールド ${prop} バリデーション成功`)
    return true
  } catch (error) {
    console.error(`フィールド ${prop} バリデーション失敗:`, error)
    return false
  }
}

// 複数フィールドを一括バリデーション
const validateMultipleFields = async (props: string[]) => {
  const elFormRef = formRef.value?.getElFormRef()
  if (!elFormRef) return false
  
  try {
    const results = await Promise.allSettled(
      props.map(prop => elFormRef.validateField(prop))
    )
    
    const failedCount = results.filter(r => r.status === 'rejected').length
    const successCount = results.length - failedCount
    
    console.log(`バリデーション完了，${successCount}/${results.length} フィールド成功`)
    return failedCount === 0
  } catch (error) {
    console.error('一括バリデーション失敗:', error)
    return false
  }
}
```

### インスタンスを使用したフォームリセット

```typescript
// フォームバリデーション状態をリセット
const resetValidation = () => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    elFormRef.resetFields()
    ElMessage.info('フォームをリセットしました')
  }
}

// 指定フィールドをリセット
const resetSpecificFields = (props: string[]) => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    elFormRef.resetFields(props)
    ElMessage.info(`${props.join(', ')} フィールドをリセットしました`)
  }
}

// バリデーションエラーをクリア
const clearValidationErrors = () => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    elFormRef.clearValidate()
    ElMessage.info('バリデーションエラーをクリアしました')
  }
}

// 指定フィールドのバリデーションエラーをクリア  
const clearFieldErrors = (props: string[]) => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    elFormRef.clearValidate(props)
    console.log(`${props.join(', ')} フィールドのバリデーションエラーをクリアしました`)
  }
}
```

### 高度なインスタンス操作

```typescript
// 指定フィールドまでスクロール
const scrollToField = (prop: string) => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    elFormRef.scrollToField(prop)
    console.log(`フィールド ${prop} までスクロールしました`)
  }
}

// フィールドインスタンスを取得
const getFieldInstance = (prop: string) => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    // DOMクエリでフィールドインスタンスを取得
    const fieldElement = document.querySelector(`[data-field="${prop}"]`)
    return fieldElement
  }
  return null
}
```

## 実際の使用シナリオ

### フォーム送信フロー

公開メソッドをすべて組み合わせて、完全なフォーム送信フローを実装できます:

```typescript
const handleFormSubmit = async () => {
  try {
    // 1. ローディング状態を設定
    formRef.value?.setLoadingState(true)
    
    // 2. フォームバリデーションを実行
    const elFormRef = formRef.value?.getElFormRef()
    if (!elFormRef) {
      throw new Error('フォームインスタンスが初期化されていません')
    }
    
    await elFormRef.validate()
    
    // 3. API呼び出しをシミュレート
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 4. 送信成功処理
    ElMessage.success('送信成功')
    
    // 5. フォームをリセット（オプション）
    elFormRef.resetFields()
    
  } catch (error) {
    // バリデーション失敗または送信エラー処理
    ElMessage.error('送信失敗。フォームを確認してください')
    console.error('送信エラー:', error)
    
    // 最初のエラーフィールドまでスクロール
    const firstErrorField = document.querySelector('.el-form-item.is-error')
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth' })
    }
  } finally {
    // 6. ローディング状態をクリア
    formRef.value?.setLoadingState(false)
  }
}
```

### レスポンシブレイアウト適応

リアクティブ状態管理を使用して、異なるデバイスでの最適な体験を実現:

```typescript
const handleResponsiveLayout = () => {
  const isMobile = formRef.value?.isMobileState?.()
  
  if (isMobile) {
    // モバイル最適化: コンパクトレイアウト通知を表示
    ElMessage({
      message: 'モバイルレイアウトモードに切り替えました',
      type: 'info',
      duration: 2000
    })
    
    // モバイルで特別な処理が必要なロジック
    console.log('現在モバイルモードです。シングルカラムレイアウトを使用します')
  } else {
    // デスクトップレイアウト
    console.log('現在デスクトップモードです。マルチカラムレイアウトを使用します')
  }
}

// ウィンドウサイズ変更を監視
window.addEventListener('resize', () => {
  formRef.value?.updateResponsiveState?.()
  handleResponsiveLayout()
})
```

### エラー処理とユーザー体験最適化

```typescript
// インテリジェントフォーム操作ハンドラ
const smartFormHandler = {
  // 安全なフォームバリデーション
  safeValidate: async (showLoading = true) => {
    try {
      if (showLoading) {
        formRef.value?.setLoadingState(true)
      }
      
      const elFormRef = formRef.value?.getElFormRef()
      if (!elFormRef) {
        throw new Error('フォームインスタンスが準備できていません')
      }
      
      const isValid = await elFormRef.validate()
      return { success: true, valid: isValid }
    } catch (error) {
      return { success: false, error, valid: false }
    } finally {
      if (showLoading) {
        formRef.value?.setLoadingState(false)
      }
    }
  },
  
  // インテリジェントリセット
  smartReset: (clearValidation = true) => {
    const elFormRef = formRef.value?.getElFormRef()
    if (elFormRef) {
      elFormRef.resetFields()
      if (clearValidation) {
        elFormRef.clearValidate()
      }
      ElMessage.info('フォームをリセットしました')
    }
  },
  
  // 現在の状態情報を取得
  getStatus: () => {
    return {
      loading: formRef.value?.getLoadingState?.() || false,
      mobile: formRef.value?.isMobileState?.() || false,
      formReady: !!formRef.value?.getElFormRef()
    }
  }
}
```

### デバッグと開発ツール

```typescript
// 開発時のデバッグツール
const devTools = {
  // すべての公開メソッドの状態を出力
  debug: () => {
    const status = {
      loadingState: formRef.value?.getLoadingState?.(),
      mobileState: formRef.value?.isMobileState?.(),
      formInstance: !!formRef.value?.getElFormRef(),
      methods: [
        'setLoadingState',
        'getLoadingState', 
        'getElFormRef',
        'isMobileState',
        'updateResponsiveState'
      ]
    }
    
    console.group('🔧 MaFormデバッグ情報')
    console.log('状態情報:', status)
    console.log('利用可能なメソッド:', Object.keys(formRef.value || {}))
    console.groupEnd()
    
    return status
  },
  
  // すべてのメソッドをテスト
  testMethods: async () => {
    console.log('📋 MaForm公開メソッドをテスト中...')
    
    // ローディング状態をテスト
    const initialLoading = formRef.value?.getLoadingState?.()
    console.log('初期ローディング状態:', initialLoading)
    
    formRef.value?.setLoadingState(true)
    console.log('ローディング状態をtrueに設定')
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    formRef.value?.setLoadingState(false)
    console.log('ローディング状態をfalseに設定')
    
    // リアクティブ状態をテスト
    const isMobile = formRef.value?.isMobileState?.()
    console.log('現在のモバイル状態:', isMobile)
    
    formRef.value?.updateResponsiveState?.()
    console.log('リアクティブ状態を更新しました')
    
    // フォームインスタンスをテスト
    const elFormRef = formRef.value?.getElFormRef()
    console.log('フォームインスタンスが利用可能か:', !!elFormRef)
    
    console.log('✅ すべてのメソッドテスト完了')
  }
}
```

## APIメソッドまとめ

### MaForm公開メソッド

| メソッド名 | パラメータ | 戻り値 | 説明 |
|-------|-----|-------|-----|
| `setLoadingState` | `loading: boolean` | `void` | フォームのグローバルローディング状態を設定 |
| `setOptions` | `opts: MaFormOptions` | `void` | フォーム設定オプションを設定 |
| `getOptions` | - | `MaFormOptions` | 現在のフォーム設定を取得 |
| `setItems` | `items: MaFormItem[]` | `void` | フォームアイテム配列を設定 |
| `getItems` | - | `MaFormItem[]` | 現在のフォームアイテム配列を取得 |
| `appendItem` | `item: MaFormItem` | `void` | フォームアイテムを追加 |
| `removeItem` | `prop: string` | `void` | propでフォームアイテムを削除 |
| `getItemByProp` | `prop: string` | `MaFormItem \| null` | propでフォームアイテムを取得 |
| `getElFormRef` | - | `FormInstance \| undefined` | Element Plus Formインスタンスを取得 |
| `isMobileState` | - | `boolean` | 現在がモバイル状態かどうかをチェック |

### 利用不可のメソッド

現在のバージョンでは以下のメソッドは利用できません:

| メソッド名 | 説明 |
|-------|----- |
| `getLoadingState` | 現在のローディング状態を取得（ローディング状態は自身で管理してください） |
| `updateResponsiveState` | 手動でリアクティブ状態を更新（フォームが自動的に処理します） |

### Element Plus Formインスタンスメソッド

`getElFormRef()`で取得したインスタンスで以下の一般的なメソッドが利用可能:

| メソッド名 | パラメータ | 戻り値 | 説明 |
|-------|-----|-------|-----|
| `validate` | `callback?: Function` | `Promise<boolean>` | フォーム全体をバリデーション |
| `validateField` | `props: string \| string[]` | `Promise<void>` | 指定フィールドをバリデーション |
| `resetFields` | `props?: string \| string[]` | `void` | フィールド値とバリデーション状態をリセット |
| `clearValidate` | `props?: string \| string[]` | `void` | バリデーション状態をクリア |
| `scrollToField` | `prop: string` | `void` | 指定フィールドまでスクロール |

## 注意事項

1. **安全な呼び出し**: コンポーネントがマウントされていない場合のエラーを避けるため、オプショナルチェーン(`?.`)を使用して安全にメソッドを呼び出してください
2. **タイミング**: コンポーネントがマウント完了後にこれらのメソッドを呼び出すようにしてください
3. **エラー処理**: `validate`などの非同期メソッドでは適切なエラー処理を行ってください
4. **型安全**: TypeScriptを使用する場合は、正しい型定義をインポートしてください

## 関連リンク

- [MaForm 基本使用法](/ja/front/component/ma-form/ex