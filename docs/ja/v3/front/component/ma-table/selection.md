# 複数選択テーブル

テーブルの複数選択機能を表示します。単一選択、全選択、一括操作などを含みます。

## 複数選択テーブルのデモ

<DemoPreview dir="demos/ma-table/selection" />

## 機能特性

### 選択制御
- **単一行選択**: チェックボックスをクリックして単一行データを選択
- **全選択機能**: テーブルヘッダーのチェックボックスで全選択/選択解除
- **選択制約**: 特定の行を選択不可に設定可能
- **選択保持**: ページをまたいで選択状態を保持

### 一括操作
- **一括処理**: 選択行に基づく一括操作
- **選択統計**: 選択レコードの数と状態をリアルタイム表示
- **操作フィードバック**: 一括操作の結果フィードバックと確認

## 設定例

### 基本複数選択設定
```javascript
const columns = [
  {
    type: 'selection',        // 複数選択列
    width: 50,
    selectable: (row, index) => {
      // 選択制約条件を設定
      return row.status !== 'disabled'
    }
  },
  { label: '名前', prop: 'name' },
  { label: '状態', prop: 'status' }
]
```

### 選択イベントの監視
```javascript
const options = {
  on: {
    onSelect: (selection, row) => {
      console.log('単一行選択:', row, selection.includes(row) ? '選択' : '取消')
    },
    onSelectAll: (selection) => {
      console.log('全選択操作:', selection.length > 0 ? '全選択' : '全選択取消')
    },
    onSelectionChange: (selection) => {
      console.log('選択変更:', selection)
      // 選択状態を更新
      selectedRows.value = selection
    }
  }
}
```

### プログラムによる選択制御
```vue
<template>
  <div>
    <div class="selection-controls">
      <el-button @click="selectAll">全選択</el-button>
      <el-button @click="clearSelection">選択をクリア</el-button>
      <el-button @click="toggleSelection">選択反転</el-button>
      <el-button @click="selectActive">正常状態を選択</el-button>
    </div>
    
    <ma-table 
      ref="tableRef"
      :columns="columns" 
      :data="data" 
      :options="options" 
    />
  </div>
</template>

<script setup>
const tableRef = ref()
const selectedRows = ref([])

// 全選択
const selectAll = () => {
  const selectableRows = data.value.filter(row => row.status !== 'disabled')
  selectableRows.forEach(row => {
    tableRef.value?.getElTableRef()?.toggleRowSelection(row, true)
  })
}

// 選択をクリア
const clearSelection = () => {
  tableRef.value?.getElTableRef()?.clearSelection()
}

// 選択反転
const toggleSelection = () => {
  data.value.forEach(row => {
    if (row.status !== 'disabled') {
      const isSelected = selectedRows.value.includes(row)
      tableRef.value?.getElTableRef()?.toggleRowSelection(row, !isSelected)
    }
  })
}

// 特定条件の行を選択
const selectActive = () => {
  const activeRows = data.value.filter(row => row.status === 'active')
  activeRows.forEach(row => {
    tableRef.value?.getElTableRef()?.toggleRowSelection(row, true)
  })
}
</script>
```

### 一括操作の例
```vue
<template>
  <div>
    <!-- 一括操作ツールバー -->
    <div v-if="selectedRows.length > 0" class="batch-toolbar">
      <span>選択中 {{ selectedRows.length }} 件のレコード</span>
      <el-button type="success" @click="batchActivate">
        一括有効化
      </el-button>
      <el-button type="warning" @click="batchDeactivate">
        一括無効化
      </el-button>
      <el-button type="danger" @click="batchDelete">
        一括削除
      </el-button>
    </div>
    
    <ma-table 
      :columns="columns" 
      :data="data" 
      :options="options" 
    />
  </div>
</template>

<script setup>
// 一括有効化
const batchActivate = async () => {
  try {
    await ElMessageBox.confirm(
      `選択した ${selectedRows.value.length} 人のユーザーを有効化してもよろしいですか？`,
      '一括有効化',
      { type: 'warning' }
    )
    
    // 一括操作を実行
    const ids = selectedRows.value.map(row => row.id)
    await api.batchActivateUsers(ids)
    
    // ローカルデータを更新
    selectedRows.value.forEach(row => {
      row.status = 'active'
    })
    
    ElMessage.success('一括有効化成功')
    clearSelection()
    
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('一括有効化失敗')
    }
  }
}

// 一括削除
const batchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `選択した ${selectedRows.value.length} 件のレコードを削除してもよろしいですか？この操作は元に戻せません！`,
      '一括削除',
      { type: 'error' }
    )
    
    const ids = selectedRows.value.map(row => row.id)
    await api.batchDeleteUsers(ids)
    
    // ローカルデータから削除
    data.value = data.value.filter(row => !ids.includes(row.id))
    
    ElMessage.success('一括削除成功')
    selectedRows.value = []
    
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('一括削除失敗')
    }
  }
}
</script>
```

## 複数選択パラメータ

### 選択列設定

| パラメータ | 説明 | 型 | デフォルト値 |
|-----------|------|-----|------------|
| `type` | 列タイプ、'selection' を設定すると複数選択列になる | `string` | - |
| `selectable` | その行のチェックボックスが選択可能かどうか | `Function(row, index)` | - |
| `reserveSelection` | データ更新後に選択を保持するかどうか | `boolean` | `false` |

### 選択イベント

| イベント名 | 説明 | パラメータ |
|-----------|------|-----------|
| `select` | ユーザーが手動でデータ行のCheckboxを選択した時にトリガー | `(selection, row)` |
| `select-all` | ユーザーが手動で全選択Checkboxを選択した時にトリガー | `(selection)` |
| `selection-change` | 選択項目が変更された時にトリガー | `(selection)` |

## テーブルメソッド

`tableRef.value?.getElTableRef()` で以下のメソッドにアクセス可能：

| メソッド名 | 説明 | パラメータ |
|-----------|------|-----------|
| `clearSelection` | 全ての選択をクリア | - |
| `getSelectionRows` | 現在選択されている行を返す | - |
| `toggleRowSelection` | 特定の行の選択状態を切り替える | `(row, selected)` |
| `toggleAllSelection` | 全選択状態を切り替える | - |

## 使用シナリオ

### 1. ユーザー管理
```javascript
// ユーザーデータ構造
const userData = [
  {
    id: 1,
    name: '張三',
    status: 'active',    // 正常状態は選択可能
    role: 'admin'
  },
  {
    id: 2,
    name: '李四',
    status: 'disabled',  // 無効状態は選択不可
    role: 'user'
  }
]

// 選択制約
const columns = [
  {
    type: 'selection',
    selectable: (row) => row.status !== 'disabled'
  }
]
```

### 2. 注文管理
```javascript
// 注文の一括操作
const batchProcessOrders = async (action) => {
  const orderIds = selectedRows.value.map(row => row.orderId)
  
  try {
    switch (action) {
      case 'ship':
        await api.batchShipOrders(orderIds)
        break
      case 'cancel':
        await api.batchCancelOrders(orderIds)
        break
      case 'export':
        await api.exportOrders(orderIds)
        break
    }
    
    ElMessage.success(`一括${action}操作成功`)
    refreshData()
    
  } catch (error) {
    ElMessage.error(`一括${action}操作失敗`)
  }
}
```

### 3. データエクスポート
```javascript
// 選択データのエクスポート
const exportSelected = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('エクスポートするデータを先に選択してください')
    return
  }
  
  // エクスポートデータを構築
  const exportData = selectedRows.value.map(row => ({
    名前: row.name,
    メール: row.email,
    部門: row.department,
    役職: row.position
  }))
  
  // エクスポートを実行
  exportToExcel(exportData, 'ユーザーデータ.xlsx')
  ElMessage.success(`${selectedRows.value.length} 件のデータをエクスポートしました`)
}
```

## ベストプラクティス

1. **選択制約**: `selectable` 関数を適切に設定し、ユーザーが操作すべきでないデータを選択できないようにする
2. **状態同期**: 選択状態と実際のデータの同期を確保する
3. **一括確認**: 一括操作前に確認を求め、特に削除などの危険な操作では注意を促す
4. **操作フィードバック**: ユーザーに一括操作の結果を適時フィードバックする
5. **パフォーマンス考慮**: 大量データの場合は仮想スクロールやページネーション処理を検討する

## 注意事項

- 選択状態は自動保存されず、ページ更新で失われる
- ページをまたぐ選択は特別な処理が必要で、`reserveSelection` 属性が使用可能
- 一括操作ではネットワークエラーや部分失敗を考慮する必要がある
- 選択制約関数はレンダリングのたびに呼び出されるため、複雑な計算は避ける