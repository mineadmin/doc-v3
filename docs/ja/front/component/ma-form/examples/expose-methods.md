# 公開メソッド

MaFormコンポーネントがdefineExposeを通じて公開するすべてのAPIメソッドを紹介します。状態管理、設定管理、フォーム項目管理、バリデーションなどの機能が含まれます。

<DemoPreview dir="demos/ma-form/expose-methods" />

## 機能特徴

- **状態管理**: ローディング状態、レスポンシブ状態制御
- **設定管理**: フォーム設定オプションの動的変更
- **フォーム項目管理**: フォーム項目設定の追加・削除・更新・検索
- **バリデーション制御**: フォームとフィールドのバリデーション管理
- **データ操作**: フォームデータの読み取りと設定
- **インスタンスアクセス**: 基盤となるElement Plusインスタンスの取得

## 状態管理メソッド

### ローディング状態制御

```typescript
// ローディング状態を設定
formRef.value.setLoadingState(true)

// 現在のローディング状態を取得
const isLoading = formRef.value.getLoadingState()

// ローディング状態を切り替え
const toggleLoading = () => {
  const currentState = formRef.value.getLoadingState()
  formRef.value.setLoadingState(!currentState)
}
```

### レスポンシブ状態管理

```typescript
// モバイル状態かどうかを確認
const isMobile = formRef.value.isMobileState()

// 手動でレスポンシブ状態を更新（ウィンドウサイズ変更時）
window.addEventListener('resize', () => {
  formRef.value.updateResponsiveState()
})
```

## 設定管理メソッド

### フォーム設定の設定

```typescript
// 設定を完全に置き換え
formRef.value.setOptions({
  layout: 'grid',
  loading: true,
  labelWidth: '120px'
})

// 現在の設定を取得
const currentOptions = formRef.value.getOptions()
console.log('現在の設定:', currentOptions)

// 更新関数で設定を変更
formRef.value.updateOptions(options => ({
  ...options,
  layout: options.layout === 'flex' ? 'grid' : 'flex',
  loading: false
}))
```

### 一括設定更新

```typescript
// 条件に基づいて設定を一括更新
const updateConfigByCondition = (condition: string) => {
  const updates = {
    mobile: {
      layout: 'grid',
      responsiveConfig: { mobileSingleColumn: true }
    },
    desktop: {
      layout: 'flex', 
      flex: { gutter: 20 }
    }
  }
  
  formRef.value.updateOptions(options => ({
    ...options,
    ...updates[condition]
  }))
}
```

## フォーム項目管理メソッド

### フォーム項目の追加

```typescript
// 末尾にフォーム項目を追加
const appendNewField = () => {
  formRef.value.appendItem({
    label: `新規フィールド ${Date.now()}`,
    prop: `field_${Date.now()}`,
    render: 'input',
    renderProps: {
      placeholder: '動的に追加されたフィールド'
    }
  })
}

// 指定位置にフォーム項目を挿入
const insertField = (index: number) => {
  formRef.value.appendItem({
    label: '挿入フィールド',
    prop: `inserted_field_${Date.now()}`,
    render: 'input'
  }, index)
}

// 先頭にフォーム項目を追加
const prependField = () => {
  formRef.value.prependItem({
    label: '先頭フィールド',
    prop: `first_field_${Date.now()}`,
    render: 'input',
    cols: { span: 24 }
  })
}
```

### フォーム項目の削除

```typescript
// propに基づいてフォーム項目を削除
const removeField = (prop: string) => {
  const success = formRef.value.removeItem(prop)
  if (success) {
    ElMessage.success(`フィールド ${prop} の削除に成功`)
  } else {
    ElMessage.error(`フィールド ${prop} は存在しません`)
  }
}

// 複数フォーム項目を削除
const removeMultipleFields = (props: string[]) => {
  const results = props.map(prop => ({
    prop,
    success: formRef.value.removeItem(prop)
  }))
  
  const successCount = results.filter(r => r.success).length
  ElMessage.info(`${successCount} 個のフィールドを削除しました`)
}
```

### フォーム項目の更新

```typescript
// 単一フォーム項目を更新
const updateField = (prop: string, updates: Partial<MaFormItem>) => {
  const success = formRef.value.updateItem(prop, updates)
  if (success) {
    ElMessage.success('フィールドの更新に成功')
  }
}

// フィールド属性を動的に更新
const toggleFieldDisabled = (prop: string) => {
  const item = formRef.value.getItemByProp(prop)
  if (item) {
    formRef.value.updateItem(prop, {
      renderProps: {
        ...item.renderProps,
        disabled: !item.renderProps?.disabled
      }
    })
  }
}

// 複数フィールドを更新
const updateMultipleFields = (updates: Record<string, Partial<MaFormItem>>) => {
  Object.entries(updates).forEach(([prop, update]) => {
    formRef.value.updateItem(prop, update)
  })
}
```

### フォーム項目の置換

```typescript
// フォーム項目配列を完全に置換
const replaceAllItems = () => {
  const newItems = [
    {
      label: '新規ユーザー名',
      prop: 'newUsername',
      render: 'input'
    },
    {
      label: '新規メール',
      prop: 'newEmail', 
      render: 'input',
      renderProps: { type: 'email' }
    }
  ]
  
  formRef.value.setItems(newItems)
}

// 現在のすべてのフォーム項目を取得
const getAllItems = () => {
  const items = formRef.value.getItems()
  console.log('現在のフォーム項目:', items)
  return items
}
```

## フォーム項目検索メソッド

### 単一検索

```typescript
// propに基づいてフォーム項目を検索
const findFieldByProp = (prop: string) => {
  const item = formRef.value.getItemByProp(prop)
  if (item) {
    console.log(`フィールド ${prop} を検出:`, item)
  } else {
    console.log(`フィールド ${prop} は存在しません`)
  }
  return item
}
```

### 条件検索

```typescript
// すべての非表示フィールドを検索
const findHiddenFields = () => {
  const hiddenFields = formRef.value.getItemsByCondition(item => 
    item.hide === true || (typeof item.hide === 'function' && item.hide(formData.value, item))
  )
  console.log('非表示フィールド:', hiddenFields)
  return hiddenFields
}

// 指定タイプのフィールドを検索
const findFieldsByRender = (renderType: string) => {
  return formRef.value.getItemsByCondition(item => item.render === renderType)
}

// 必須フィールドを検索
const findRequiredFields = () => {
  return formRef.value.getItemsByCondition(item => 
    item.itemProps?.rules?.some(rule => rule.required === true)
  )
}
```

### 可視性検索

```typescript
// すべての可視フィールドを取得
const getVisibleFields = () => {
  const visibleItems = formRef.value.getVisibleItems()
  console.log('可視フィールド数:', visibleItems.length)
  return visibleItems
}

// フィールド状態を統計
const getFieldStats = () => {
  const allItems = formRef.value.getItems()
  const visibleItems = formRef.value.getVisibleItems()
  
  return {
    total: allItems.length,
    visible: visibleItems.length,
    hidden: allItems.length - visibleItems.length
  }
}
```

## バリデーション制御メソッド

### フォームバリデーション

```typescript
// フォーム全体をバリデーション
const validateForm = async () => {
  try {
    const isValid = await formRef.value.validate()
    if (isValid) {
      ElMessage.success('フォームバリデーションに成功')
      return true
    }
  } catch (error) {
    ElMessage.error('フォームバリデーションに失敗')
    console.error('バリデーションエラー:', error)
    return false
  }
}

// エラーハンドリング付きフォームバリデーション
const validateFormWithErrorHandling = async () => {
  const loadingInstance = ElLoading.service({ text: 'バリデーション中...' })
  
  try {
    const isValid = await formRef.value.validate()
    loadingInstance.close()
    
    if (isValid) {
      ElMessage.success('バリデーション成功、送信可能')
      return true
    }
  } catch (error) {
    loadingInstance.close()
    ElMessage.error('フォーム入力を確認してください')
    
    // 最初のエラーフィールドにスクロール
    const firstErrorField = document.querySelector('.el-form-item.is-error')
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth' })
    }
    
    return false
  }
}
```

### フィールドバリデーション

```typescript
// 単一フィールドをバリデーション
const validateSingleField = async (prop: string) => {
  try {
    const isValid = await formRef.value.validateField(prop)
    console.log(`フィールド ${prop} バリデーション結果:`, isValid)
    return isValid
  } catch (error) {
    console.error(`フィールド ${prop} バリデーション失敗:`, error)
    return false
  }
}

// 複数フィールドをバリデーション
const validateMultipleFields = async (props: string[]) => {
  const results = await Promise.allSettled(
    props.map(async prop => ({
      prop,
      valid: await formRef.value.validateField(prop)
    }))
  )
  
  const validResults = results.filter(r => r.status === 'fulfilled')
  const invalidCount = validResults.filter(r => !r.value.valid).length
  
  console.log(`バリデーション完了、${validResults.length - invalidCount}/${validResults.length} フィールドが成功`)
  return invalidCount === 0
}
```

### バリデーション状態管理

```typescript
// フォームバリデーション状態をリセット
const resetValidation = () => {
  formRef.value.resetFields()
  ElMessage.info('フォームをリセットしました')
}

// 指定フィールドをリセット
const resetSpecificFields = (props: string[]) => {
  formRef.value.resetFields(props)
  ElMessage.info(`${props.join(', ')} フィールドをリセットしました`)
}

// バリデーションエラーをクリア
const clearValidationErrors = () => {
  formRef.value.clearValidate()
  ElMessage.info('バリデーションエラーをクリアしました')
}

// 指定フィールドのエラーをクリア  
const clearFieldErrors = (props: string[]) => {
  formRef.value.clearValidate(props)
}
```

## データ操作メソッド

### データ読み取り

```typescript
// フォームデータを取得
const getFormData = () => {
  const data = formRef.value.getFormData()
  console.log('現在のフォームデータ:', data)
  return data
}

// 指定フィールドデータを取得
const getFieldValue = (prop: string) => {
  const data = formRef.value.getFormData()
  return data[prop]
}

// 変更されたデータを取得
const getChangedData = () => {
  const currentData = formRef.value.getFormData()
  const initialData = initialFormData.value
  
  const changes = {}
  Object.keys(currentData).forEach(key => {
    if (currentData[key] !== initialData[key]) {
      changes[key] = {
        from: initialData[key],
        to: currentData[key]
      }
    }
  })
  
  return changes
}
```

### データ設定

```typescript
// フォームデータを設定
const setFormData = (data: Record<string, any>) => {
  formRef.value.setFormData(data)
  ElMessage.success('データ設定に成功')
}

// 複数フィールド値を一括設定
const setMultipleFields = (fieldValues: Record<string, any>) => {
  const currentData = formRef.value.getFormData()
  formRef.value.setFormData({
    ...currentData,
    ...fieldValues
  })
}

// 初期データにリセット
const resetToInitialData = () => {
  formRef.value.resetFormData()
  ElMessage.info('データを初期状態にリセットしました')
}
```

## Element Plusインスタンスアクセス

### ネイティブインスタンスの取得

```typescript
// Element Plus el-formインスタンスを取得
const getElFormInstance = () => {
  const elFormInstance = formRef.value.getElFormRef()
  if (elFormInstance) {
    console.log('Element Plusフォームインスタンス:', elFormInstance)
    // el-formのネイティブメソッドを呼び出し可能
    return elFormInstance
  }
}

// ネイティブメソッドの使用
const useElFormMethods = () => {
  const elForm = formRef.value.getElFormRef()
  if (elForm) {
    // el-formネイティブメソッドを呼び出し
    elForm.scrollToField('username')
    elForm.clearValidate(['email'])
  }
}
```

## 統合アプリケーション例

### フォーム動的管理

```typescript
const formManager = {
  // フィールドグループを追加
  addFieldGroup: (groupName: string, fields: MaFormItem[]) => {
    fields.forEach((field, index) => {
      field.prop = `${groupName}.${field.prop}`
      formRef.value.appendItem(field, index)
    })
  },
  
  // フィールドグループを削除
  removeFieldGroup: (groupName: string) => {
    const items = formRef.value.getItems()
    const toRemove = items
      .filter(item => item.prop?.startsWith(`${groupName}.`))
      .map(item => item.prop)
    
    toRemove.forEach(prop => formRef.value.removeItem(prop))
  },
  
  // フィールド状態を切り替え
  toggleFieldState: (prop: string, state: 'disabled' | 'hidden' | 'readonly') => {
    const updates = {
      disabled: { renderProps: { disabled: true } },
      hidden: { hide: true },
      readonly: { renderProps: { readonly: true } }
    }
    
    formRef.value.updateItem(prop, updates[state])
  },
  
  // フォームモードを切り替え
  switchMode: (mode: 'create' | 'edit' | 'view') => {
    const configs = {
      create: { disabled: false, loading: false },
      edit: { disabled: false, loading: false },
      view: { disabled: true, loading: false }
    }
    
    formRef.value.updateOptions(options => ({
      ...options,
      ...configs[mode]
    }))
  }
}
```

## 関連リンク

- [公開メソッド詳細](/ja/front/component/ma-form#公開メソッド-expose)
- [MaFormExpose 型定義](/ja/front/component/ma-form#maformexpose)
- [フォームバリデーションメソッド](/ja/front/component/ma-form#フォームバリデーション)