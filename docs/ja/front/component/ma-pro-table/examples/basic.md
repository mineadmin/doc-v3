# 基本の使い方

最もシンプルなテーブルの使用例で、検索、ページネーション、基本操作機能を含みます。

<DemoPreview dir="demos/ma-pro-table-examples/basic" />

## 特徴

- **迅速な構築**: ma-search と ma-table の組み合わせをベース
- **検索機能**: 内蔵の検索フォーム、複数の検索コンポーネントをサポート
- **ページネーション対応**: 自動的にページネーションロジックを処理
- **操作列**: 柔軟な操作ボタン設定をサポート
- **データバインディング**: APIリクエストとデータレンダリングを自動処理

## コア設定

### 基本構造
```vue
<template>
  <MaProTable :options="options" :schema="schema" />
</template>

<script setup>
import { reactive } from 'vue'

// コンポーネント設定
const options = reactive({
  requestOptions: {
    api: getDataList,        // APIインターフェース
    autoRequest: true,       // 自動リクエスト
    response: {
      totalKey: 'data.total',
      dataKey: 'data.list'
    }
  },
  tableOptions: {
    adaption: true,          // 高さの自動調整
    pagination: {
      total: 0,
      pageSize: 10
    }
  }
})

// テーブルスキーマ
const schema = reactive({
  searchItems: [             // 検索設定
    {
      label: '名前',
      prop: 'name',
      render: 'input'
    }
  ],
  tableColumns: [            // テーブル列設定
    { label: 'ID', prop: 'id' },
    { label: '名前', prop: 'name' }
  ]
})
</script>
```

### 操作列設定
```javascript
{
  type: 'operation',
  label: '操作',
  width: 200,
  operationConfigure: {
    type: 'tile',            // タイル表示
    actions: [
      {
        name: 'edit',
        text: '編集',
        onClick: (data) => {
          console.log('編集', data.row)
        }
      }
    ]
  }
}
```

## 使用説明

1. **APIインターフェース**: `{ code, data: { list, total } }` 形式のデータを返す必要あり
2. **検索コンポーネント**: input、select、date など複数のタイプをサポート
3. **操作ボタン**: クリックイベント、表示条件、スタイルなどを設定可能
4. **高さ自動調整**: `adaption` を有効にするとテーブルの高さを自動計算

これは MaProTable を使用した最も基本的な例で、完全な CRUD インターフェースを迅速に構築する方法を示しています。