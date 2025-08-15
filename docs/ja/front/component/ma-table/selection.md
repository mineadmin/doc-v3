# 複数選択テーブル

テーブルの複数選択機能を表示します。単一選択、全選択、バッチ操作などが含まれます。

## 複数選択テーブルのデモ

<DemoPreview dir="demos/ma-table/selection" />

## 機能特性

### 選択制御
- **単一行選択**: チェックボックスをクリックして単一行のデータを選択
- **全選択機能**: ヘッダーのチェックボックスで全選択/選択解除を実現
- **選択制約**: 特定の行を選択不可に設定可能
- **選択状態保持**: ページ跨ぎで選択状態を保持するサポート

### バッチ操作
- **バッチ処理**: 選択された行に基づくバッチ操作
- **選択統計**: 選択されたレコードの数と状態をリアルタイム表示
- **操作フィードバック**: バッチ操作の結果フィードバックと確認

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
      console.log('単一行選択:', row, selection.includes(row) ? '選択' : '解除')
    },
    onSelectAll: (selection) => {
      console.log('全選択操作:', selection.length > 0 ? '全選択' : '全解除')
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
      <el-button @click="clearSelection">選択解除</el-button>
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

// 選択解除
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

### バッチ操作例
```vue
<template>
  <div>
    <!-- バッチ操作ツールバー -->
    <div v-if="selectedRows.length > 0" class="batch-toolbar">
      <span>{{ selectedRows.length }} 件選択中</span>
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
      `選択した ${selectedRows.value.length} 件のユーザーを有効化しますか？`,
      '一括有効化',
      { type: 'warning' }
    )
    
    // バッチ操作を実行
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
      `選択した ${selectedRows.value.length} 件のレコードを削除しますか？この操作は元に戻せません！`,
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

| パラメータ | 説明 | タイプ | デフォルト値 |
|-----|------|-----|--------|
| `type` | 列タイプ、'selection'に設定すると複数選択列になる | `string` | - |
| `selectable` | 行のチェックボックスが選択可能かどうか | `Function(row, index)` | - |
| `reserveSelection` | データ更新後に選択状態を保持するか | `boolean` | `false` |

### 選択イベント

| イベント名 | 説明 | パラメータ |
|-------|------|------|
| `select` | ユーザーが手動で行のCheckboxを選択した時に発火 | `(selection, row)` |
| `select-all` | ユーザーが全選択Checkboxを選択した時に発火 | `(selection)` |
| `selection-change` | 選択項目が変更された時に発火 | `(selection)` |

## テーブルメソッド

`tableRef.value?.getElTableRef()` で以下のメソッドにアクセス可能:

| メソッド名 | 説明 | パラメータ |
|-------|------|------|
| `clearSelection` | すべての選択を解除 | - |
| `getSelectionRows` | 現在選択されている行を返す | - |
| `toggleRowSelection` | 特定の行の選択状態を切り替え | `(row, selected)` |
| `toggleAllSelection` | 全選択状態を切り替え | - |

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
// 注文のバッチ処理
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
// 選択データをエクスポート
const exportSelected = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('エクスポートするデータを選択してください')
    return
  }
  
  // エクスポートデータを構築
  const exportData = selectedRows.value.map(row => ({
    名前: row.name,
    メール: row.email,
    部門: row.department,
    役職: row.position
  }))
  
  // エクスポート実行
  exportToExcel(exportData, 'ユーザーデータ.xlsx')
  ElMessage.success(`${selectedRows.value.length} 件のデータをエクスポートしました`)
}
```

## ベストプラクティス

1. **選択制約**: `selectable` 関数を適切に設定し、操作すべきでないデータの選択を防ぐ
2. **状態同期**: 選択状態と実際のデータを常に同期させる
3. **バッチ確認**: 特に削除などの危険な操作の前には必ず確認を行う
4. **操作フィードバック**: バッチ操作の結果をユーザーに即時フィードバック
5. **パフォーマンス考慮**: 大量データ時は仮想スクロールやページネーションを検討

## 注意事項

- 選択状態は自動保存されず、ページリフレッシュで失われる
- ページ跨ぎ選択には特別な処理が必要、`reserveSelection` 属性を使用可能
- バッチ操作時はネットワーク異常や部分失敗を考慮する
- 選択制約関数はレンダリングごとに呼び出されるため、複雑な計算は避ける