# テーブルフィルタリング

複数のフィルタリング方法をサポート：列ヘッダーフィルタリング、カスタム検索、組み合わせフィルタリングなど。

## フィルタリングデモ

<DemoPreview dir="demos/ma-table/filter" />

## 機能特性

### フィルタリングタイプ
- **列ヘッダーフィルタリング**: 列ヘッダーにフィルタリングドロップダウンメニューを提供
- **複数選択フィルタリング**: 複数のフィルタ条件を同時に選択可能
- **カスタムフィルタリング**: `filterMethod` でカスタムフィルタロジックを実装
- **外部検索**: 入力ボックス、セレクターなどのコンポーネントと組み合わせた外部フィルタリング

### フィルタリング制御
- **フィルタデータ**: `filters` でフィルタオプションを定義
- **フィルタ方法**: `filterMethod` でカスタムフィルタロジックを設定
- **フィルタイベント**: `filter-change` イベントでフィルタ変更を監視

## 設定例

### 基本フィルタリング
```javascript
const columns = [
  { 
    label: '部門', 
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

### 複数選択フィルタリング
```javascript
const columns = [
  { 
    label: '職級', 
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

### カスタムフィルタロジック
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

### 外部フィルタ制御
```vue
<template>
  <div>
    <!-- 外部フィルタコントロール -->
    <el-input 
      v-model="searchName" 
      placeholder="名前検索" 
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

## フィルタパラメータ

| パラメータ | 説明 | タイプ | デフォルト値 |
|-----|------|-----|--------|
| `filters` | データフィルタのオプション | `array[{ text, value }]` | - |
| `filterPlacement` | フィルタポップアップの位置 | `string` | - |
| `filterMultiple` | データフィルタの複数選択可否 | `boolean` | `true` |
| `filterMethod` | データフィルタに使用するメソッド | `Function(value, row, column)` | - |
| `filteredValue` | 選択されたデータフィルタ項目 | `array` | - |

## フィルタメソッド

| メソッド名 | 説明 | パラメータ |
|-------|------|------|
| `clearFilter` | 指定列のフィルタ条件をクリア | `columnKeys` |
| `setCurrentRow` | 単一選択テーブルで行を選択状態に設定 | `row` |

## イベント説明

| イベント名 | 説明 | パラメータ |
|-------|------|------|
| `filter-change` | テーブルのフィルタ条件が変更された時に発火 | `filters` |

## ベストプラクティス

1. **適切なフィルタ使用**: データ量が多い列ではフィルタを使用してユーザー体験を向上
2. **フィルタ項目命名**: フィルタオプションのテキストは簡潔で分かりやすく
3. **組み合わせフィルタ**: 複数のフィルタ条件を組み合わせてより正確なフィルタリングを提供
4. **フィルタフィードバック**: フィルタ後に結果件数を表示するなどユーザーに即時フィードバック