# テーブルソート

複数のソート方式をサポート：組み込みソート、カスタムソート、多段階ソートなど。

## ソートデモ

<DemoPreview dir="demos/ma-table/sorting" />

## 機能特徴

### ソートタイプ
- **組み込みソート**: `sortable: true` を直接設定し、デフォルトのソートアルゴリズムを使用
- **カスタムソート**: `sortable: 'custom'` を設定し、イベントリスナーを通じてカスタムソートロジックを実装
- **ソート無効**: `sortable` を設定しないか `false` に設定

### ソート制御
- **デフォルトソート**: `defaultSort` でテーブルの初期ソート状態を設定
- **ソート順序**: `sortOrders` でソートの切り替え順序を制御
- **ソートイベント**: `sort-change` イベントを監視してソート変更を取得

## 設定例

### 基本ソート
```javascript
const columns = [
  { 
    label: '商品名', 
    prop: 'name', 
    sortable: true  // 組み込みソートを有効化
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
  // ソートイベントを監視
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
    label: '販売数', 
    prop: 'sales', 
    sortable: true,
    // カスタムソート順序：昇順 -> 降順 -> ソート無し
    sortOrders: ['ascending', 'descending', null]
  }
]
```

## ソートパラメータ

| パラメータ | 説明 | タイプ | デフォルト値 |
|-----|------|-----|--------|
| `sortable` | 列のソート可否 | `boolean \| 'custom'` | `false` |
| `sortMethod` | データソート時に使用するメソッド | `Function(a, b)` | - |
| `sortBy` | データのソート基準となる属性を指定 | `string \| array \| Function(row, index)` | - |
| `sortOrders` | ソート時の順序切り替え戦略 | `array` | `['ascending', 'descending', null]` |
| `defaultSort` | デフォルトのソート列と順序 | `object` | - |

## イベント説明

| イベント名 | 説明 | パラメータ |
|-------|------|------|
| `sort-change` | テーブルのソート条件が変更された時に発火 | `{ column, prop, order }` |

`order` の値は：
- `'ascending'`: 昇順
- `'descending'`: 降順  
- `null`: ソート解除