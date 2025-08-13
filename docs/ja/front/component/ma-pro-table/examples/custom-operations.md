# カスタム操作

異なるタイプの操作列の設定を表示し、条件付き表示、カスタムスタイル、複雑な操作ロジックを含みます。

<DemoPreview dir="demos/ma-pro-table-examples/custom-operations" />

## 機能特徴

- **複数の操作タイプ**: フラット表示、ドロップダウンメニュー、自動折りたたみなどの表示方法をサポート
- **条件付き表示**: 行データに基づいて操作ボタンを動的に表示/非表示
- **右クリックメニュー**: 行の右クリックメニュー機能をサポート
- **ドラッグソート**: 行のドラッグによる並べ替えをサポート
- **バッチ操作**: 複数選択とバッチ操作機能をサポート

## 操作列の設定

### 基本的な操作設定
```javascript
{
  type: 'operation',
  label: '操作',
  width: 280,
  fixed: 'right',
  operationConfigure: {
    type: 'auto',           // auto/dropdown/tile
    fold: 2,                // 自動モードでの折りたたみ数
    actions: [
      {
        name: 'view',
        text: '詳細',
        icon: 'view',
        onClick: (data) => {
          console.log('詳細を表示:', data.row)
        }
      }
    ]
  }
}
```

### 操作タイプの説明

#### 1. 自動モード (auto)
```javascript
operationConfigure: {
  type: 'auto',
  fold: 2,                  // 2つのボタンを表示後に折りたたむ
  actions: [...]
}
```

#### 2. ドロップダウンメニューモード (dropdown)
```javascript
operationConfigure: {
  type: 'dropdown',
  actions: [...]
}
```

#### 3. フラットモード (tile)
```javascript
operationConfigure: {
  type: 'tile',
  actions: [...]
}
```

## 操作ボタンの設定

### 基本ボタン
```javascript
{
  name: 'edit',
  text: '編集',
  icon: 'edit',
  onClick: (data, proxy) => {
    console.log('データを編集:', data.row)
    console.log('テーブルインスタンス:', proxy)
  }
}
```

### 条件付き表示
```javascript
{
  name: 'approve',
  text: '承認',
  show: (data) => data.row.status === 'pending',    // 条件付き表示
  disabled: (data) => !data.row.canApprove,        // 条件付き無効化
  onClick: (data, proxy) => {
    // 承認ロジック
    proxy.refresh()  // テーブルを更新
  }
}
```

### カスタムスタイル
```javascript
{
  name: 'delete',
  text: '削除',
  icon: 'delete',
  linkProps: {
    type: 'danger',         // ボタンタイプ
    size: 'small'           // ボタンサイズ
  },
  onClick: (data) => {
    ElMessageBox.confirm('削除しますか?', '確認', {
      type: 'warning'
    }).then(() => {
      console.log('削除:', data.row)
    })
  }
}
```

### 操作の並べ替え
```javascript
{
  name: 'high-priority',
  text: '高優先度',
  order: 1,                 // 並べ替え重み、数字が小さいほど前に表示
  onClick: (data) => {
    console.log('高優先度操作')
  }
}
```

## 右クリックメニュー

### 右クリックメニューを有効化
```javascript
const options = {
  rowContextMenu: {
    enabled: true,
    items: [
      {
        label: '詳細を表示',
        icon: 'view',
        onMenuClick: (data, event) => {
          console.log('右クリックで表示:', data.row)
        }
      },
      {
        label: '申請をコピー',
        icon: 'copy',
        onMenuClick: (data, event) => {
          console.log('データをコピー:', data.row)
        }
      },
      {
        label: '削除',
        icon: 'delete',
        disabled: (data) => !data.row.canDelete,  // 条件付き無効化
        onMenuClick: (data, event) => {
          console.log('右クリックで削除:', data.row)
        }
      }
    ]
  }
}
```

## ドラッグソート

### ドラッグを有効化
```javascript
const options = {
  tableOptions: {
    rowDrag: true           // 行ドラッグを有効化
  }
}

// ドラッグイベントを監視
const schema = {
  tableColumns: [
    { type: 'sort', width: 60 },  // ドラッグ列
    // ...その他の列
  ]
}
```

### ドラッグイベント
```vue
<MaProTable 
  :options="options" 
  :schema="schema"
  @row-drag-sort="handleRowDragSort"
/>

<script setup>
const handleRowDragSort = (tableData) => {
  console.log('新しい並び順:', tableData.map(item => item.title))
  // APIを呼び出して新しい並び順を保存
}
</script>
```

## バッチ操作

### 複数選択を有効化
```javascript
const options = {
  tableOptions: {
    selection: true         // 複数選択を有効化
  }
}
```

### バッチ操作の例
```vue
<template>
  <div class="control-panel">
    <el-button @click="batchApprove" type="primary">一括承認</el-button>
    <el-button @click="batchDelete" type="danger">一括削除</el-button>
  </div>
  <MaProTable ref="tableRef" :options="options" :schema="schema" />
</template>

<script setup>
const tableRef = ref()

const batchApprove = () => {
  const selectedRows = tableRef.value?.getTableRef?.()?.getSelectionRows?.()
  console.log('選択された行:', selectedRows)
}

const batchDelete = () => {
  ElMessageBox.confirm('選択した項目を一括削除しますか?', 'バッチ操作', {
    type: 'warning'
  }).then(() => {
    // 一括削除ロジック
    tableRef.value?.refresh()
  })
}
</script>
```

## 高度な操作例

### 非同期操作
```javascript
{
  name: 'async-action',
  text: '非同期操作',
  onClick: async (data, proxy) => {
    try {
      ElMessage.info('処理中...')
      await someAsyncOperation(data.row.id)
      ElMessage.success('操作成功')
      await proxy.refresh()  // テーブルを更新
    } catch (error) {
      ElMessage.error('操作失敗')
    }
  }
}
```

### ダイアログ操作
```javascript
{
  name: 'dialog-action',
  text: 'ダイアログ操作',
  onClick: (data, proxy) => {
    ElMessageBox.prompt('備考を入力してください', '操作確認', {
      confirmButtonText: '確定',
      cancelButtonText: '取消'
    }).then(({ value }) => {
      console.log('備考:', value)
      console.log('データ:', data.row)
      proxy.refresh()
    })
  }
}
```

カスタム操作機能により、複雑なインタラクションロジックを構築し、さまざまな業務シナリオの操作要件を満たすことができます。