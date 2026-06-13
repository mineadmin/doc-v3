# テーブルソート

複数のソート方法をサポート：内蔵ソート、カスタムソート、マルチレベルソートなど。

## ソートデモ

<DemoPreview dir="demos/ma-table/sorting" />

## 機能特性

### ソートタイプ
- **内蔵ソート**: `sortable: true` を直接設定し、デフォルトのソートアルゴリズムを使用
- **カスタムソート**: `sortable: 'custom'` を設定し、イベントリスニングでカスタムソートロジックを実装
- **ソート無効**: `sortable` を設定しないか、`false` に設定

### ソート制御
- **デフォルトソート**: `defaultSort` でテーブルの初期ソート状態を設定
- **ソート順序**: `sortOrders` でソートの切り替え順序を制御
- **ソートイベント**: `sort-change` イベントをリスニングしてソートの変化を取得

## 設定例

### 基本ソート
```javascript
const columns = [
  { 
    label: '商品名', 
    prop: 'name', 
    sortable: true  // 内蔵ソートを有効化
  },
  { 
    label: '価格', 
    prop: 'price', 
    sortable: 'custom'  // カスタムソート
  }
]
```

### ソート設定
```javascript
const options = {
  // デフォルトソートを設定
  defaultSort: { 
    prop: 'price', 
    order: 'descending' 
  },
  // ソートイベントをリスニング
  on: {
    onSortChange: ({ column, prop, order }) => {
      console.log('ソート変更:', column.label, order)
    }
  }
}
```

### カスタムソート順序
```javascript
const columns = [
  { 
    label: '売上', 
    prop: 'sales', 
    sortable: true,
    // カスタムソート順序：昇順 → 降順 → ソートなし
    sortOrders: ['ascending', 'descending', null]
  }
]
```

## ソートパラメータ

| パラメータ | 説明 | 型 | デフォルト値 |
|-----------|------|----|------------|
| `sortable` | 対応列のソート可否 | `boolean \| 'custom'` | `false` |
| `sortMethod` | データソート時に使用するメソッド | `Function(a, b)` | - |
| `sortBy` | データをソートする属性を指定 | `string \| array \| Function(row, index)` | - |
| `sortOrders` | ソート時の順序ローテーション | `array` | `['ascending', 'descending', null]` |
| `defaultSort` | デフォルトのソート列の prop と順序 | `object` | - |

## イベント説明

| イベント名 | 説明 | パラメータ |
|-----------|------|-----------|
| `sort-change` | テーブルのソート条件が変更された時に発生 | `{ column, prop, order }` |

`order` の値：
- `'ascending'`: 昇順
- `'descending'`: 降順
- `null`: ソート解除