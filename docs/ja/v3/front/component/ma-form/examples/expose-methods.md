# 公開メソッド

MaForm コンポーネントが `defineExpose` を通じて公開するすべての API メソッドを紹介します。これには、ローディング状態の制御、リアクティブ状態管理、インスタンスアクセスなどの機能が含まれます。

<DemoPreview dir="demos/ma-form/expose-methods" />

## 機能特性

- **ローディング状態制御**：フォームのローディング状態を設定
- **リアクティブ状態管理**：モバイル端末の状態検出
- **フォーム項目管理**：フォーム項目設定の動的変更
- **インスタンスアクセス**：基底の Element Plus Form インスタンスを取得して高度な操作を実行

## MaForm 公開メソッド詳細

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
    
    // フォーム検証を実行
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
// モバイル端末状態か確認
const isMobile = formRef.value?.isMobileState?.()

// リアクティブ状態を手動更新（ウィンドウサイズ変更時）
window.addEventListener('resize', () => {
  formRef.value?.updateResponsiveState?.()
})

// デバイス状態に応じてフォームレイアウトを調整
const adjustFormLayout = () => {
  const isMobile = formRef.value?.isMobileState?.()
  if (isMobile) {
    // モバイル端末では1カラムレイアウト
    console.log('現在モバイル端末、リアクティブレイアウトを使用')
  } else {
    // デスクトップではマルチカラムレイアウト
    console.log('現在デスクトップ、標準レイアウトを使用')
  }
}
```

## Element Plus Form インスタンスアクセス

### ネイティブフォームインスタンスの取得

MaForm の最も重要な公開メソッドの一つは `getElFormRef()` で、基底の Element Plus Form インスタンスにアクセスし、すべてのネイティブフォームメソッドを使用できるようにします：

```typescript
// Element Plus el-form インスタンスを取得
const getElFormInstance = () => {
  const elFormInstance = formRef.value?.getElFormRef()
  if (elFormInstance) {
    console.log('Element Plus フォームインスタンス:', elFormInstance)
    return elFormInstance
  } else {
    console.warn('フォームインスタンスが初期化されていません')
    return null
  }
}
```

### インスタンスによるフォーム検証

`getElFormRef()` で取得したインスタンスは、Element Plus フォームのすべてのネイティブ検証メソッドを呼び出すことができます：

```typescript
// フォーム全体を検証
const validateForm = async () => {
  try {
    const elFormRef = formRef.value?.getElFormRef()
    if (!elFormRef) {
      throw new Error('フォームインスタンスが見つかりません')
    }
    
    const isValid = await elFormRef.validate()
    if (isValid) {
      ElMessage.success('フォーム検証成功')
      return true
    }
  } catch (error) {
    ElMessage.error('フォーム検証失敗')
    console.error('検証エラー:', error)
    return false
  }
}

// 単一フィールドを検証
const validateSingleField = async (prop: string) => {
  try {
    const elFormRef = formRef.value?.getElFormRef()
    if (!elFormRef) return false
    
    await elFormRef.validateField(prop)
    console.log(`フィールド ${prop} 検証成功`)
    return true
  } catch (error) {
    console.error(`フィールド ${prop} 検証失敗:`, error)
    return false
  }
}

// 指定フィールドを一括検証
const validateMultipleFields = async (props: string[]) => {
  const elFormRef = formRef.value?.getElFormRef()
  if (!elFormRef) return false
  
  try {
    const results = await Promise.allSettled(
      props.map(prop => elFormRef.validateField(prop))
    )
    
    const failedCount = results.filter(r => r.status === 'rejected').length
    const successCount = results.length - failedCount
    
    console.log(`検証完了、${successCount}/${results.length} 個のフィールドが成功`)
    return failedCount === 0
  } catch (error) {
    console.error('一括検証失敗:', error)
    return false
  }
}
```

### インスタンスによるフォームリセット

```typescript
// フォーム検証状態をリセット
const resetValidation = () => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    elFormRef.resetFields()
    ElMessage.info('フォームがリセットされました')
  }
}

// 指定フィールドをリセット
const resetSpecificFields = (props: string[]) => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    elFormRef.resetFields(props)
    ElMessage.info(`${props.join(', ')} フィールドがリセットされました`)
  }
}

// 検証エラーをクリア
const clearValidationErrors = () => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    elFormRef.clearValidate()
    ElMessage.info('検証エラーがクリアされました')
  }
}

// 指定フィールドの検証エラーをクリア
const clearFieldErrors = (props: string[]) => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    elFormRef.clearValidate(props)
    console.log(`${props.join(', ')} フィールドの検証エラーがクリアされました`)
  }
}
```

### 高度なインスタンス操作

```typescript
// 指定フィールドにスクロール
const scrollToField = (prop: string) => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    elFormRef.scrollToField(prop)
    console.log(`フィールドにスクロール: ${prop}`)
  }
}

// フィールドインスタンスを取得
const getFieldInstance = (prop: string) => {
  const elFormRef = formRef.value?.getElFormRef()
  if (elFormRef) {
    // DOM クエリでフィールドインスタンスを取得
    const fieldElement = document.querySelector(`[data-field="${prop}"]`)
    return fieldElement
  }
  return null
}
```

## 実際の応用シナリオ

### フォーム送信フロー

すべての公開メソッドを組み合わせて、完全なフォーム送信フローを実装できます：

```typescript
const handleFormSubmit = async () => {
  try {
    // 1. ローディング状態を設定
    formRef.value?.setLoadingState(true)
    
    // 2. フォーム検証を実行
    const elFormRef = formRef.value?.getElFormRef()
    if (!elFormRef) {
      throw new Error('フォームインスタンスが初期化されていません')
    }
    
    await elFormRef.validate()
    
    // 3. API 呼び出しをシミュレート
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 4. 送信成功処理
    ElMessage.success('送信成功')
    
    // 5. フォームリセット（オプション）
    elFormRef.resetFields()
    
  } catch (error) {
    // 検証失敗または送信エラー処理
    ElMessage.error('送信失敗、フォームを確認してください')
    console.error('送信エラー:', error)
    
    // 最初のエラーフィールドにスクロール
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

### リアクティブレイアウト適応

リアクティブ状態管理を活用して、異なるデバイスでの最適な体験を実現：

```typescript
const handleResponsiveLayout = () => {
  const isMobile = formRef.value?.isMobileState?.()
  
  if (isMobile) {
    // モバイル端末最適化：コンパクトレイアウト表示
    ElMessage({
      message: 'モバイル端末レイアウトモードに切り替わりました',
      type: 'info',
      duration: 2000
    })
    
    // モバイル端末で特別な処理が必要な場合
    console.log('現在モバイル端末モード、1カラムレイアウトを使用')
  } else {
    // デスクトップレイアウト
    console.log('現在デスクトップモード、マルチカラムレイアウトを使用')
  }
}

// ウィンドウサイズ変更を監視
window.addEventListener('resize', () => {
  formRef.value?.updateResponsiveState?.()
  handleResponsiveLayout()
})
```

### エラー処理とユーザー体験の最適化

```typescript
// スマートフォーム操作ハンドラー
const smartFormHandler = {
  // 安全なフォーム検証
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
  
  // スマートリセット
  smartReset: (clearValidation = true) => {
    const elFormRef = formRef.value?.getElFormRef()
    if (elFormRef) {
      elFormRef.resetFields()
      if (clearValidation) {
        elFormRef.clearValidate()
      }
      ElMessage.info('フォームがリセットされました')
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
    
    console.group('🔧 MaForm Debug Info')
    console.log('状態情報:', status)
    console.log('利用可能なメソッド:', Object.keys(formRef.value || {}))
    console.groupEnd()
    
    return status
  },
  
  // すべてのメソッドをテスト
  testMethods: async () => {
    console.log('📋 MaForm 公開メソッドをテスト中...')
    
    // ローディング状態をテスト
    const initialLoading = formRef.value?.getLoadingState?.()
    console.log('初期ローディング状態:', initialLoading)
    
    formRef.value?.setLoadingState(true)
    console.log('ローディング状態を true に設定')
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    formRef.value?.setLoadingState(false)
    console.log('ローディング状態を false に設定')
    
    // リアクティブ状態をテスト
    const isMobile = formRef.value?.isMobileState?.()
    console.log('現在のモバイル端末状態:', isMobile)
    
    formRef.value?.updateResponsiveState?.()
    console.log('リアクティブ状態を更新しました')
    
    // フォームインスタンスをテスト
    const elFormRef = formRef.value?.getElFormRef()
    console.log('フォームインスタンス利用可能:', !!elFormRef)
    
    console.log('✅ 全メソッドのテスト完了')
  }
}
```

## API メソッドまとめ

### MaForm が公開するメソッド

| メソッド名 | 引数 | 戻り値 | 説明 |
|---------|------|--------|------|
| `setLoadingState` | `loading: boolean` | `void` | フォームのグローバルローディング状態を設定 |
| `setOptions` | `opts: MaFormOptions` | `void` | フォーム設定オプションを設定 |
| `getOptions` | - | `MaFormOptions` | 現在のフォーム設定を取得 |
| `setItems` | `items: MaFormItem[]` | `void` | フォーム項目配列を設定 |
| `getItems` | - | `MaFormItem[]` | 現在のフォーム項目配列を取得 |
| `appendItem` | `item: MaFormItem` | `void` | フォーム項目を追加 |
| `removeItem` | `prop: string` | `void` | prop に基づいてフォーム項目を削除 |
| `getItemByProp` | `prop: string` | `MaFormItem \| null` | prop に基づいてフォーム項目を取得 |
| `getElFormRef` | - | `FormInstance \| undefined` | Element Plus Form インスタンスを取得 |
| `isMobileState` | - | `boolean` | 現在モバイル端末状態か確認 |

### 利用不可のメソッド

以下のメソッドは現在のバージョンでは存在しません：

| メソッド名 | 説明 |
|---------|------|
| `getLoadingState` | 現在のローディング状態を取得（ローディング状態はご自身で管理してください） |
| `updateResponsiveState` | リアクティブ状態の手動更新（フォームが自動的に処理します） |

### Element Plus Form インスタンスメソッド

`getElFormRef()` で取得したインスタンスは以下の一般的なメソッドをサポートします：

| メソッド名 | 引数 | 戻り値 | 説明 |
|---------|------|--------|------|
| `validate` | `callback?: Function` | `Promise<boolean>` | フォーム全体を検証 |
| `validateField` | `props: string \| string[]` | `Promise<void>` | 指定フィールドを検証 |
| `resetFields` | `props?: string \| string[]` | `void` | フィールド値と検証状態をリセット |
| `clearValidate` | `props?: string \| string[]` | `void` | 検証状態をクリア |
| `scrollToField` | `prop: string` | `void` | 指定フィールドにスクロール |

## 注意事項

1. **安全な呼び出し**：オプショナルチェーン演算子 (`?.`) を使用してメソッドを安全に呼び出し、コンポーネントがマウントされていない場合のエラーを回避
2. **タイミング**：コンポーネントのマウント完了後にこれらのメソッドを呼び出すことを確認
3. **エラー処理**：非同期メソッド（`validate` など）は適切にエラー処理を行う
4. **型安全**：TypeScript を使用する場合は、正しい型定義をインポートする

## 関連リンク

- [MaForm 基本的な使い方](/v3/front/component/ma-form/examples/basic-usage)
- [フォーム検証の例](/v3/front/component/ma-form/examples/dynamic-validation)
- [ローディング状態のデモ](/v3/front/component/ma-form/examples/loading-states)
- [Element Plus Form ドキュメント](https://element-plus.org/zh-CN/component/form.html)