# テーブルフィルター

複数のフィルター方法に対応：列ヘッダーフィルター、カスタム検索、複合フィルターなど。

## フィルターデモ

<DemoPreview dir="demos/ma-table/filter" />

## 機能特性

### フィルタータイプ
- **列ヘッダーフィルター**: 列ヘッダーにフィルタードロップダウンメニューを提供
- **複数選択フィルター**: 複数のフィルター条件を同時に選択可能
- **カスタムフィルター**: `filterMethod` によるカスタムフィルターロジックの実装
- **外部検索**: 入力ボックスやセレクターなどのコンポーネントと連携した外部フィルター

### フィルター制御
- **フィルターデータ**: `filters` でフィルターオプションを定義
- **フィルター方法**: `filterMethod` でフィルターロジックをカスタマイズ
- **フィルターイベント**: `filter-change` イベントを監視してフィルターの変更を取得

## 設定例

### 基本フィルター
```javascript
const columns = [
  { 
    label: '部署', 
    prop: 'department',
    filters: [
      { text: '技術部', value: '技術部' },
      { text: '製品部', value: '製品部' },
      { text: 'デザイン部', value: 'デザイン部' }
    ],
    filterMethod: (value, row) => row.department === value
  }
]
```

### 複数選択フィルター
```javascript
const columns = [
  { 
    label: '職位レベル', 
    prop: 'level',
    filters: [
      { text: 'P5', value: 'P5' },
      { text: 'P6', value: 'P6' },
      { text: 'P7', value: 'P7' }
    ],
    filterMethod: (value, row) => row.level === value,
    filterMultiple: true  // 複数選択を有効化
  }
]
```

### カスタムフィルターロジック
```javascript
const columns = [
  { 
    label: '給与範囲', 
    prop: 'salary',
    filters: [
      { text: '10k以下', value: 'low' },
      { text: '10k-20k', value: 'medium' },
      { text: '20k-30k', value: 'high' }
    ],
    filterMethod: (value, row) => {
      switch (value) {
        case 'low': return row.salary < 10
        case 'medium': return row.salary >= 10 && row.salary < 20
        case 'high': return row.salary >= 20 && row.salary < 30
        default: return true
      }
    }
  }
]
```

### 外部フィルター制御
```vue
<template>
  <div>
    <!-- 外部フィルターコントロール -->
    <el-input 
      v-model="searchName" 
      placeholder="名前を検索" 
      @input="handleSearch"
    />
    
    <ma-table 
      :columns="columns" 
      :data="filteredData" 
      :options="options" 
    />
  </div>
</template>

<script setup>
const searchName = ref('')
const filteredData = ref([...originalData])

const handleSearch = () => {
  filteredData.value = originalData.filter(item => 
    item.name.includes(searchName.value)
  )
}
</script>
```

## フィルターパラメータ

| パラメータ | 説明 | 型 | デフォルト値 |
|-----------|------|-----|------------|
| `filters` | データフィルターのオプション | `array[{ text, value }]` | - |
| `filterPlacement` | フィルターポップアップの配置 | `string` | - |
| `filterMultiple` | データフィルターの複数選択の有無 | `boolean` | `true` |
| `filterMethod` | データフィルターに使用するメソッド | `Function(value, row, column)` | - |
| `filteredValue` | 選択済みのデータフィルター項目 | `array` | - |

## フィルターメソッド

| メソッド名 | 説明 | パラメータ |
|-----------|------|----------|
| `clearFilter` | 指定列のフィルター条件をクリア | `columnKeys` |
| `setCurrentRow` | 単一選択テーブルで特定の行を選択状態に設定 | `row` |

## イベント説明

| イベント名 | 説明 | パラメータ |
|-----------|------|----------|
| `filter-change` | テーブルのフィルター条件が変更されたときに発火 | `filters` |

## ベストプラクティス

1. **フィルターの適切な使用**: データ量の多い列にはフィルターを推奨し、ユーザー体験を向上
2. **フィルター項目の命名**: フィルターオプションのテキストは簡潔かつ明確にし、ユーザーが理解しやすいようにする
3. **複合フィルター**: 複数のフィルター条件を組み合わせて使用し、より精密なフィルター機能を提供
4. **フィルターのフィードバック**: フィルター後にユーザーに結果をすぐに表示し、フィルター結果の件数を示す