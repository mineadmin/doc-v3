# メソッドデモンストレーション

公開されているすべてのメソッドの使用方法を展示し、リアルタイム状態追跡と操作ログ記録を含め、開発者がコンポーネントのプログラミングインターフェースと高度な使用方法を深く理解できるようにします。

## メソッドデモンストレーション

<DemoPreview dir="demos/ma-search/methods-demo" />

## 公開メソッド詳細解説

### フォームデータ管理
検索フォームのデータを操作・取得:

```typescript
// 検索フォームデータを設定
const setFormData = () => {
  const newData = {
    username: 'admin',
    status: 'active',
    created_at: '2024-01-01'
  }
  searchRef.value?.setSearchForm(newData)
}

// 現在の検索フォームデータを取得
const getFormData = () => {
  const formData = searchRef.value?.getSearchForm()
  console.log('現在のフォームデータ:', formData)
  return formData
}

// フォームデータをクリア
const clearFormData = () => {
  searchRef.value?.setSearchForm({})
}
```

### 折りたたみ状態制御
検索パネルの折りたたみ/展開状態を管理:

```typescript
// 折りたたみ状態をトグル
const toggleFold = () => {
  searchRef.value?.foldToggle()
}

// 現在の折りたたみ状態を取得
const getCurrentFoldState = () => {
  const isFold = searchRef.value?.getFold()
  console.log('現在の折りたたみ状態:', isFold ? '折りたたまれています' : '展開されています')
  return isFold
}

// プログラムで折りたたみ状態を設定
const setFoldState = (fold: boolean) => {
  const currentState = searchRef.value?.getFold()
  if (currentState !== fold) {
    searchRef.value?.foldToggle()
  }
}
```

### 表示状態管理
検索コンポーネント全体の表示/非表示を制御:

```typescript
// 表示状態を設定
const setVisibility = (visible: boolean) => {
  searchRef.value?.setShowState(visible)
}

// 現在の表示状態を取得
const getVisibility = () => {
  const isVisible = searchRef.value?.getShowState()
  console.log('コンポーネント表示状態:', isVisible ? '表示中' : '非表示')
  return isVisible
}

// 表示状態をトグル
const toggleVisibility = () => {
  const currentState = searchRef.value?.getShowState()
  searchRef.value?.setShowState(!currentState)
}
```

### 設定動的管理
コンポーネントの各種設定オプションを動的に変更:

```typescript
// 検索オプションを動的に設定
const updateSearchOptions = () => {
  const newOptions = {
    cols: { xs: 1, sm: 2, md: 3, lg: 4 },
    fold: true,
    foldRows: 3,
    text: {
      searchBtn: 'すぐに検索',
      resetBtn: '条件をリセット'
    }
  }
  searchRef.value?.setOptions(newOptions)
}

// フォームオプションを動的に設定  
const updateFormOptions = () => {
  const formOptions = {
    labelWidth: '120px',
    labelPosition: 'right',
    size: 'large'
  }
  searchRef.value?.setFormOptions(formOptions)
}

// 現在の設定を取得
const getCurrentConfig = () => {
  const searchOptions = searchRef.value?.getOptions()
  const formOptions = searchRef.value?.getFormOptions()
  
  console.log('検索コンポーネント設定:', searchOptions)
  console.log('フォームコンポーネント設定:', formOptions)
  
  return { searchOptions, formOptions }
}
```

### 検索項目動的管理
実行時に検索項目設定を動的に変更:

```typescript
// 検索項目を一括設定
const setBatchItems = () => {
  const newItems = [
    { label: 'ユーザーID', prop: 'user_id', render: 'input-number' },
    { label: 'ユーザー名', prop: 'username', render: 'input' },
    { label: 'メールアドレス', prop: 'email', render: 'input' },
    { label: '状態', prop: 'status', render: 'select', options: statusOptions }
  ]
  searchRef.value?.setItems(newItems)
}

// 単一検索項目を追加
const appendSingleItem = () => {
  const newItem = {
    label: '登録日時',
    prop: 'created_at',
    render: 'date-picker',
    props: {
      type: 'daterange',
      format: 'YYYY-MM-DD'
    }
  }
  searchRef.value?.appendItem(newItem)
}

// 指定検索項目を削除
const removeSpecificItem = (prop: string) => {
  searchRef.value?.removeItem(prop)
}

// 特定検索項目を検索
const findItemByProp = (prop: string) => {
  const item = searchRef.value?.getItemByProp(prop)
  if (item) {
    console.log(`検索項目が見つかりました:`, item)
  } else {
    console.log(`prop "${prop}" の検索項目が見つかりませんでした`)
  }
  return item
}

// すべての検索項目を取得
const getAllItems = () => {
  const items = searchRef.value?.getItems()
  console.log('すべての検索項目:', items)
  return items
}
```

### フォーム参照取得
内部ma-formコンポーネント参照を取得してより低レベルの操作を実行:

```typescript
// フォーム参照を取得
const getFormRef = () => {
  const formRef = searchRef.value?.getMaFormRef()
  if (formRef) {
    console.log('フォーム参照を取得:', formRef)
    return formRef
  }
}

// フォーム参照を通じて検証
const validateViaFormRef = async () => {
  const formRef = searchRef.value?.getMaFormRef()
  if (formRef) {
    try {
      await formRef.validate()
      console.log('フォーム検証が成功しました')
      return true
    } catch (error) {
      console.log('フォーム検証が失敗しました:', error)
      return false
    }
  }
}

// フォーム参照を通じてリセット
const resetViaFormRef = () => {
  const formRef = searchRef.value?.getMaFormRef()
  if (formRef) {
    formRef.resetFields()
    console.log('フォームがリセットされました')
  }
}
```

## 使用シナリオ

### 1. 検索条件プリセット
業務シナリオに基づいて異なる検索条件をプリセット:

```typescript
// 検索シナリオをプリセット
const presetScenarios = {
  today: () => {
    searchRef.value?.setSearchForm({
      created_at: [
        dayjs().format('YYYY-MM-DD'),
        dayjs().format('YYYY-MM-DD')
      ]
    })
  },
  
  thisWeek: () => {
    searchRef.value?.setSearchForm({
      created_at: [
        dayjs().startOf('week').format('YYYY-MM-DD'),
        dayjs().endOf('week').format('YYYY-MM-DD')
      ]
    })
  },
  
  activeUsers: () => {
    searchRef.value?.setSearchForm({
      status: 'active',
      last_login: [
        dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
        dayjs().format('YYYY-MM-DD')
      ]
    })
  }
}

// プリセットシナリオを適用
const applyPreset = (scenario: keyof typeof presetScenarios) => {
  presetScenarios[scenario]()
}
```

### 2. 権限制御
ユーザー権限に基づいて検索機能を動的に調整:

```typescript
// 権限で検索項目を制御
const applyPermissionControl = (userRole: string) => {
  const baseItems = [
    { label: 'ユーザー名', prop: 'username', render: 'input' },
    { label: '状態', prop: 'status', render: 'select', options: statusOptions }
  ]
  
  // 管理者はより多くの検索項目を見られる
  if (userRole === 'admin') {
    baseItems.push(
      { label: '作成者', prop: 'creator', render: 'select', options: userOptions },
      { label: '内部ID', prop: 'internal_id', render: 'input-number' }
    )
  }
  
  searchRef.value?.setItems(baseItems)
}

// 表示状態を権限で制御
const applyVisibilityControl = (userRole: string) => {
  // ゲストユーザーは検索機能を非表示
  if (userRole === 'guest') {
    searchRef.value?.setShowState(false)
  } else {
    searchRef.value?.setShowState(true)
  }
}
```

### 3. レスポンシブ設定調整
デバイスタイプと画面サイズに基づいて設定を動的に調整:

```typescript
// デバイスに応じて設定を調整
const adjustForDevice = () => {
  const isMobile = window.innerWidth < 768
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024
  
  let newOptions = {}
  
  if (isMobile) {
    newOptions = {
      cols: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
      fold: true,
      foldRows: 1
    }
  } else if (isTablet) {
    newOptions = {
      cols: { xs: 1, sm: 2, md: 2, lg: 2, xl: 2 },
      fold: true,
      foldRows: 2
    }
  } else {
    newOptions = {
      cols: { xs: 2, sm: 3, md: 4, lg: 4, xl: 5 },
      fold: false,
      foldRows: 3
    }
  }
  
  searchRef.value?.setOptions(newOptions)
}

// ウィンドウサイズ変化を監視
onMounted(() => {
  window.addEventListener('resize', adjustForDevice)
  adjustForDevice() // 初期調整
})

onUnmounted(() => {
  window.removeEventListener('resize', adjustForDevice)
})
```

## 主要特性

- 🔧 完全なプログラミングインターフェース
- 📊 リアルタイム状態追跡
- 🎯 柔軟な設定管理
- ⚡ 高性能なメソッド呼び出し
- 🛠 強力な拡張能力
- 📝 詳細な操作ログ

## 高度な使用例

### 検索テンプレートシステム
保存・読み込み可能な検索テンプレートを作成:

```typescript
// 検索テンプレート管理
class SearchTemplateManager {
  private templates = new Map()
  
  // 現在の検索設定をテンプレートとして保存
  saveTemplate(name: string, searchRef: any) {
    const template = {
      formData: searchRef.getSearchForm(),
      items: searchRef.getItems(),
      options: searchRef.getOptions()
    }
    this.templates.set(name, template)
    
    // ローカルストレージに永続化
    localStorage.setItem('searchTemplates', JSON.stringify(Array.from(this.templates)))
  }
  
  // 検索テンプレートを読み込み
  loadTemplate(name: string, searchRef: any) {
    const template = this.templates.get(name)
    if (template) {
      searchRef.setItems(template.items)
      searchRef.setOptions(template.options)
      searchRef.setSearchForm(template.formData)
      return true
    }
    return false
  }
  
  // ローカルストレージからテンプレートを復元
  loadFromStorage() {
    const stored = localStorage.getItem('searchTemplates')
    if (stored) {
      const templates = JSON.parse(stored)
      this.templates = new Map(templates)
    }
  }
}
```

### 検索状態監視
検索コンポーネントの各種状態変化を監視:

```typescript
// 状態モニター
class SearchStateMonitor {
  private logs: any[] = []
  
  // メソッド呼び出しを監視
  monitorMethod(methodName: string, args: any[], result: any) {
    const log = {
      timestamp: new Date(),
      method: methodName,
      arguments: args,
      result: result,
      type: 'method_call'
    }
    this.logs.push(log)
    console.log('メソッド呼び出し:', log)
  }
  
  // 状態変化を監視
  monitorStateChange(stateName: string, oldValue: any, newValue: any) {
    const log = {
      timestamp: new Date(),
      state: stateName,
      oldValue: oldValue,
      newValue: newValue,
      type: 'state_change'
    }
    this.logs.push(log)
    console.log('状態変化:', log)
  }
  
  // 監視ログを取得
  getLogs(type?: string) {
    if (type) {
      return this.logs.filter(log => log.type === type)
    }
    return [...this.logs]
  }
  
  // ログをクリア
  clearLogs() {
    this.logs = []
  }
}
```

## ベストプラクティス

### 1. メソッド呼び出しのエラーハンドリング
```typescript
const safeMethodCall = async (methodName: string, ...args: any[]) => {
  try {
    const method = searchRef.value?.[methodName]
    if (typeof method === 'function') {
      return await method.apply(searchRef.value, args)
    } else {
      throw new Error(`メソッド ${methodName} が存在しません`)
    }
  } catch (error) {
    console.error(`メソッド ${methodName} の呼び出しに失敗:`, error)
    // ユーザーフレンドリーなエラーメッセージを追加可能
    ElMessage.error(`操作が失敗しました: ${error.message}`)
    return null
  }
}
```

### 2. バッチ操作最適化
```typescript
const batchOperations = (operations: Array<() => void>) => {
  // リアクティブ更新を一時停止
  const pauseReactivity = () => {
    // 一時停止ロジックを実装
  }
  
  const resumeReactivity = () => {
    // 再開ロジックを実装
  }
  
  try {
    pauseReactivity()
    operations.forEach(operation => operation())
  } finally {
    resumeReactivity()
  }
}
```

### 3. 状態同期
```typescript
const syncWithExternalState = (externalState: any) => {
  // フォームデータを同期
  if (externalState.formData) {
    searchRef.value?.setSearchForm(externalState.formData)
  }
  
  // 設定オプションを同期
  if (externalState.options) {
    searchRef.value?.setOptions(externalState.options)
  }
  
  // 検索項目を同期
  if (externalState.items) {
    searchRef.value?.setItems(externalState.items)
  }
}
```

## 関連リンク

- [動的管理](./dynamic-items) - 検索項目の動的管理について
- [カスタムアクション](./custom-actions) - カスタムアクションボタンの実装について
- [フォーム検証](./form-validation) - メソッドによるフォーム検証について