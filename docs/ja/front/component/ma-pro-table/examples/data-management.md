# データ管理

完全なCRUD操作を表示し、新規追加、編集、削除、データ連動などの機能を含みます。

<DemoPreview dir="demos/ma-pro-table-examples/data-management" />

## 機能特徴

- **完全なCRUD**：データの追加、削除、更新、検索操作をサポート
- **フォーム連動**：新規追加/編集フォームとテーブルデータの連動
- **データ統計**：リアルタイムでデータ指標を統計
- **一括操作**：一括選択と操作をサポート
- **状態同期**：操作後に自動的にテーブルデータを更新

## データ操作パネル

### 統計パネル
```vue
<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span>データ操作パネル</span>
        <el-space>
          <el-button type="primary" @click="showAddDialog">
            <el-icon><Plus /></el-icon>
            従業員を追加
          </el-button>
          <el-button type="success" @click="handleExportSelected">
            <el-icon><Download /></el-icon>
            選択をエクスポート
          </el-button>
        </el-space>
      </div>
    </template>
    
    <el-row :gutter="20">
      <el-col :span="6">
        <el-statistic title="総従業員数" :value="statistics.total" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="在職人数" :value="statistics.active" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="平均給与" :value="statistics.avgSalary" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="今月の新規" :value="statistics.newThisMonth" />
      </el-col>
    </el-row>
  </el-card>
</template>
```

### リアルタイム統計
```javascript
const statistics = computed(() => {
  const total = tableData.value.length
  const active = tableData.value.filter(item => item.status === 1).length
  const avgSalary = total > 0 ? Math.round(
    tableData.value.reduce((sum, item) => sum + item.salary, 0) / total
  ) : 0
  const newThisMonth = tableData.value.filter(item => {
    const createDate = new Date(item.createTime)
    const now = new Date()
    return createDate.getMonth() === now.getMonth() && 
           createDate.getFullYear() === now.getFullYear()
  }).length
  
  return { total, active, avgSalary, newThisMonth }
})
```

## 新規追加/編集フォーム

### フォームコンポーネント
```vue
<template>
  <el-dialog 
    v-model="dialogVisible" 
    :title="editingEmployee ? '従業員を編集' : '従業員を追加'"
    width="600px"
    destroy-on-close
  >
    <el-form 
      ref="formRef"
      :model="employeeForm" 
      :rules="formRules"
      label-width="100px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="氏名" prop="name">
            <el-input v-model="employeeForm.name" placeholder="氏名を入力してください" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部門" prop="department">
            <el-select v-model="employeeForm.department" style="width: 100%">
              <el-option label="技術部" value="技術部" />
              <el-option label="製品部" value="製品部" />
              <!-- その他のオプション... -->
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      
      <!-- その他のフォーム項目... -->
    </el-form>
    
    <template #footer>
      <el-button @click="dialogVisible = false">キャンセル</el-button>
      <el-button type="primary" @click="handleSaveEmployee" :loading="saving">
        {{ editingEmployee ? '保存' : '追加' }}
      </el-button>
    </template>
  </el-dialog>
</template>
```

### フォーム検証
```javascript
const formRules = {
  name: [
    { required: true, message: '従業員氏名を入力してください', trigger: 'blur' },
    { min: 2, max: 10, message: '氏名の長さは2～10文字です', trigger: 'blur' }
  ],
  department: [
    { required: true, message: '部門を選択してください', trigger: 'change' }
  ],
  position: [
    { required: true, message: '職位を入力してください', trigger: 'blur' }
  ],
  salary: [
    { required: true, message: '給与を入力してください', trigger: 'blur' },
    { type: 'number', min: 3000, max: 100000, message: '給与範囲は3000～100000です', trigger: 'blur' }
  ]
}
```

## CRUD 操作実装

### 新規追加操作
```javascript
const showAddDialog = () => {
  editingEmployee.value = null
  resetForm()
  dialogVisible.value = true
}

const handleSaveEmployee = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    saving.value = true
    
    // API呼び出しをシミュレート
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (editingEmployee.value) {
      // 編集モード
      const index = tableData.value.findIndex(item => item.id === editingEmployee.value.id)
      if (index !== -1) {
        tableData.value[index] = { ...employeeForm }
      }
      ElMessage.success('従業員情報を更新しました')
    } else {
      // 新規追加モード
      const newId = Math.max(...tableData.value.map(item => item.id), 0) + 1
      tableData.value.push({ ...employeeForm, id: newId })
      ElMessage.success('従業員を追加しました')
    }
    
    dialogVisible.value = false
    await tableRef.value?.refresh()
    
  } catch (error) {
    console.error('保存に失敗しました:', error)
  } finally {
    saving.value = false
  }
}
```

### 編集操作
```javascript
const showEditDialog = (employee) => {
  editingEmployee.value = employee
  Object.assign(employeeForm, {
    ...employee,
    skills: employee.skills || []
  })
  dialogVisible.value = true
}

// 操作列に編集ボタンを設定
{
  name: 'edit',
  text: '編集',
  onClick: (data) => {
    showEditDialog(data.row)
  }
}
```

### 削除操作
```javascript
const handleDeleteEmployee = (employee) => {
  ElMessageBox.confirm(`従業員"${employee.name}"を削除しますか？`, '削除確認', {
    confirmButtonText: '確定',
    cancelButtonText: 'キャンセル',
    type: 'warning'
  }).then(() => {
    const index = tableData.value.findIndex(item => item.id === employee.id)
    if (index !== -1) {
      tableData.value.splice(index, 1)
      ElMessage.success('従業員を削除しました')
      tableRef.value?.refresh()
    }
  })
}

// 操作列に削除ボタンを設定
{
  name: 'delete',
  text: '削除',
  onClick: (data) => {
    handleDeleteEmployee(data.row)
  },
  linkProps: {
    type: 'danger'
  }
}
```

### 詳細表示操作
```javascript
const showEmployeeDetail = (employee) => {
  ElNotification({
    title: '従業員詳細',
    message: `
      氏名: ${employee.name}
      部門: ${employee.department}
      職位: ${employee.position}
      給与: ￥${employee.salary.toLocaleString()}
    `,
    type: 'info',
    duration: 5000
  })
}

// 操作列に詳細表示ボタンを設定
{
  name: 'view',
  text: '詳細',
  onClick: (data) => {
    showEmployeeDetail(data.row)
  }
}
```

## 一括操作

### 複数選択を有効化
```javascript
const options = {
  tableOptions: {
    selection: true         // 複数選択機能を有効化
  }
}
```

### 一括エクスポート
```javascript
const handleExportSelected = () => {
  const selectedRows = tableRef.value?.getTableRef?.()?.getSelectionRows?.()
  if (!selectedRows?.length) {
    ElMessage.warning('エクスポートするデータを選択してください')
    return
  }
  
  console.log('エクスポートデータ:', selectedRows)
  ElMessage.success(`${selectedRows.length}件のレコードをエクスポートしました`)
}
```

### 一括削除
```javascript
const handleBatchDelete = () => {
  const selectedRows = tableRef.value?.getTableRef?.()?.getSelectionRows?.()
  if (!selectedRows?.length) {
    ElMessage.warning('削除するデータを選択してください')
    return
  }
  
  ElMessageBox.confirm(`選択した${selectedRows.length}件のレコードを削除しますか？`, '一括削除', {
    confirmButtonText: '確定',
    cancelButtonText: 'キャンセル',
    type: 'warning'
  }).then(() => {
    const selectedIds = selectedRows.map(row => row.id)
    tableData.value = tableData.value.filter(item => !selectedIds.includes(item.id))
    ElMessage.success('一括削除しました')
    tableRef.value?.refresh()
  })
}
```

## データ連動

### 検索イベント処理
```javascript
const handleSearchSubmit = (form) => {
  console.log('検索条件:', form)
  ElMessage.info('検索操作を実行します')
  // ここで検索ロジックを処理できます
  return form
}

const handleSearchReset = (form) => {
  console.log('検索条件をリセット:', form)
  ElMessage.info('検索条件をリセットしました')
  return form
}
```

### テーブル更新
```javascript
const refreshTableData = async () => {
  try {
    await tableRef.value?.refresh()
    ElMessage.success('データを更新しました')
  } catch (error) {
    ElMessage.error('データの更新に失敗しました')
  }
}
```

## 高度な機能

### フォーム状態管理
```javascript
const resetForm = () => {
  Object.assign(employeeForm, {
    id: 0,
    name: '',
    department: '',
    position: '',
    salary: 8000,
    status: 1,
    createTime: '',
    skills: [],
    remark: ''
  })
  
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}
```

### データ検証
```javascript
const validateFormData = (data) => {
  const errors = []
  
  if (!data.name?.trim()) {
    errors.push('氏名は必須です')
  }
  
  if (data.salary < 3000 || data.salary > 100000) {
    errors.push('給与範囲が無効です')
  }
  
  if (errors.length > 0) {
    ElMessage.error(errors.join(', '))
    return false
  }
  
  return true
}
```

### データ永続化
```javascript
const saveDataToStorage = (data) => {
  try {
    localStorage.setItem('employee-data', JSON.stringify(data))
  } catch (error) {
    console.error('ローカルストレージへの保存に失敗しました:', error)
  }
}

const loadDataFromStorage = () => {
  try {
    const data = localStorage.getItem('employee-data')
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('ローカルストレージからの読み込みに失敗しました:', error)
    return []
  }
}
```

## ベストプラクティス

### 1. フォーム設計
- フォームフィールドを適切にグループ化
- 明確な検証メッセージを提供
- キーボードショートカット操作をサポート

### 2. データ管理
- テーブルとフォームデータをタイムリーに同期
- データバックアップと復元機能を提供
- データ競合を避けるために楽観的ロックを実装

### 3. ユーザーエクスペリエンス
- 操作確認と取り消し機能を提供
- 操作進捗と状態を表示
- 適切なエラー処理と通知

### 4. パフォーマンス最適化
- 大量データの場合はページングと仮想スクロールを考慮
- 頻繁なデータ更新を避ける
- デバウンスとスロットルを適切に使用

データ管理機能を使用すると、完全なデータ操作インターフェースを構築でき、さまざまなビジネスシナリオのデータ管理ニーズを満たすことができます。