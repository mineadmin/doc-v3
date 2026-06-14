# ツリー形式テーブル

階層構造データを表示し、展開・折りたたみ、遅延読み込み、カスタムアイコンなどの機能をサポートします。

## ツリー形式テーブルのデモ

<DemoPreview dir="demos/ma-table/tree-table" />

## 機能特性

### 階層構造
- **多階層ネスト**: 任意の階層のツリーデータを表示可能
- **展開制御**: ノードの展開・折りたたみ状態を制御可能
- **デフォルト展開**: デフォルトで展開するノードを設定可能
- **遅延読み込み**: ノードの遅延読み込みメカニズムをサポート

### 視覚的識別
- **階層インデント**: 階層に応じて自動的にインデントを追加
- **展開アイコン**: デフォルトの展開・折りたたみアイコンを提供
- **カスタムアイコン**: 各ノードにカスタムアイコンを設定可能
- **状態識別**: 異なる状態のノードに視覚的識別を追加可能

## 設定例

### 基本ツリー設定
```javascript
const options = {
  rowKey: 'id',                    // 行データのキー
  defaultExpandAll: false,         // すべての行をデフォルトで展開するか
  treeProps: {
    children: 'children',          // 子ノードのフィールド名を指定
    hasChildren: 'hasChildren'     // 子ノード有無のフィールド名を指定
  }
}
```

### 指定ノードをデフォルト展開
```javascript
const options = {
  rowKey: 'id',
  expandRowKeys: [1, 2, 3],       // デフォルトで展開する行のキー配列
  treeProps: {
    children: 'children',
    hasChildren: 'hasChildren'
  }
}
```

### 遅延読み込み設定
```javascript
const options = {
  rowKey: 'id',
  lazy: true,                     // 遅延読み込みを有効化
  load: async (row, treeNode, resolve) => {
    // 子ノードデータを非同期読み込み
    try {
      const children = await loadChildrenData(row.id)
      resolve(children)
    } catch (error) {
      resolve([])
    }
  },
  treeProps: {
    children: 'children',
    hasChildren: 'hasChildren'
  }
}
```

### ツリーデータ構造
```javascript
const treeData = [
  {
    id: 1,
    name: '本社',
    manager: '張社長',
    children: [
      {
        id: 11,
        name: '技術部',
        manager: '李技術部長',
        children: [
          {
            id: 111,
            name: 'フロントエンドグループ',
            manager: '王フロントエンド',
            children: []
          },
          {
            id: 112,
            name: 'バックエンドグループ',
            manager: '趙バックエンド',
            children: []
          }
        ]
      }
    ]
  }
]
```

### カスタムノードレンダリング
```javascript
const columns = [
  {
    label: '部署名',
    prop: 'name',
    cellRender: ({ row }) => (
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 16px;">{row.icon}</span>
        <span style={`font-weight: ${row.children?.length ? 'bold' : 'normal'}`}>
          {row.name}
        </span>
        {row.isNew && <el-tag size="small" type="success">新規</el-tag>}
      </div>
    )
  }
]
```

## ツリー形式テーブルのパラメータ

### 基本パラメータ

| パラメータ | 説明 | 型 | デフォルト値 |
|-----------|------|-----|------------|
| `rowKey` | 行データのキー。Tableのレンダリングを最適化 | `string \| Function(row): string` | - |
| `defaultExpandAll` | すべての行をデフォルトで展開するか | `boolean` | `false` |
| `expandRowKeys` | 現在の展開行を設定 | `array` | - |
| `treeProps` | ネストデータレンダリングの設定オプション | `object` | - |

### 遅延読み込みパラメータ

| パラメータ | 説明 | 型 | デフォルト値 |
|-----------|------|-----|------------|
| `lazy` | 子ノードデータを遅延読み込みするか | `boolean` | `false` |
| `load` | 子ノードデータを読み込む関数 | `Function(row, treeNode, resolve)` | - |
| `indent` | 隣接ノード間の水平インデント（ピクセル単位） | `number` | `16` |

### treeProps 設定

| パラメータ | 説明 | 型 | デフォルト値 |
|-----------|------|-----|------------|
| `children` | サブツリーとしてノードオブジェクトのプロパティ値を指定 | `string` | `'children'` |
| `hasChildren` | ノードがリーフノードかどうかのフラグを指定 | `string` | `'hasChildren'` |

## ツリー形式テーブルのイベント

| イベント名 | 説明 | パラメータ |
|-----------|------|----------|
| `expand` | ユーザーが行を展開・折りたたみ時に発火 | `(row, expanded)` |

## ツリー形式テーブルのメソッド

| メソッド名 | 説明 | パラメータ |
|-----------|------|----------|
| `toggleRowExpansion` | 展開可能テーブルまたはツリーテーブルで、行の展開状態を切り替え | `(row, expanded)` |

## 使用例

### 部門組織構成
```vue
<template>
  <ma-table
    ref="tableRef"
    :columns="columns"
    :data="departmentData"
    :options="treeOptions"
  />
</template>

<script setup>
import { ref } from 'vue'

const tableRef = ref()

const columns = [
  {
    label: '部署名',
    prop: 'name',
    cellRender: ({ row }) => (
      <div style="display: flex; align-items: center; gap: 8px;">
        <span>{row.icon}</span>
        <span>{row.name}</span>
      </div>
    )
  },
  { label: '責任者', prop: 'manager' },
  { label: '社員数', prop: 'employeeCount' }
]

const treeOptions = {
  rowKey: 'id',
  defaultExpandAll: false,
  treeProps: {
    children: 'children',
    hasChildren: 'hasChildren'
  },
  on: {
    onExpand: (row, expanded) => {
      console.log(`${row.name} ${expanded ? '展開' : '折りたたみ'}`)
    }
  }
}

// すべてのノードを展開
const expandAll = () => {
  // 全ノードIDを取得
  const getAllIds = (nodes) => {
    const ids = []
    nodes.forEach(node => {
      ids.push(node.id)
      if (node.children?.length) {
        ids.push(...getAllIds(node.children))
      }
    })
    return ids
  }
  
  treeOptions.expandRowKeys = getAllIds(departmentData)
}

// すべてのノードを折りたたみ
const collapseAll = () => {
  treeOptions.expandRowKeys = []
}
</script>
```

### 遅延読み込み例
```vue
<script setup>
const lazyTreeOptions = {
  rowKey: 'id',
  lazy: true,
  load: async (row, treeNode, resolve) => {
    try {
      // 非同期読み込みをシミュレート
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const children = await fetchChildrenData(row.id)
      resolve(children)
    } catch (error) {
      console.error('子ノードの読み込みに失敗:', error)
      resolve([])
    }
  },
  treeProps: {
    children: 'children',
    hasChildren: 'hasChildren'
  }
}

const fetchChildrenData = async (parentId) => {
  // API呼び出しをシミュレート
  const response = await api.getChildren(parentId)
  return response.data
}
</script>
```

## ベストプラクティス

1. **データ構造**: ツリーデータに正しい親子関係と一意のIDがあることを確認
2. **パフォーマンス最適化**: 大量データの場合は遅延読み込みメカニズムの使用を推奨
3. **ユーザー体験**: 明確な読み込み状態と展開・折りたたみのフィードバックを提供
4. **階層制御**: ツリー構造の階層深度を適切に制御し、過度なネストを回避
5. **操作インタラクション**: ツリーノードに適切な操作ボタンと右クリックメニューを提供

## 注意事項

- `rowKey` は必須で、各行データを一意に識別します
- 遅延読み込みモードでは、`hasChildren` フィールドでノードに子ノードがあるかを判断します
- 展開状態は `expandRowKeys` で制御し、配列内の値が `rowKey` と対応していることを確認してください
- ツリーデータの変更はデータ構造の整合性を保つ必要があります