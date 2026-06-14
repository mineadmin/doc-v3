# 表格篩選

支持多種篩選方式：列頭篩選、自定義搜索、組合篩選等。

## 篩選演示

<DemoPreview dir="demos/ma-table/filter" />

## 功能特性

### 篩選類型
- **列頭篩選**: 在列頭提供篩選下拉菜單
- **多選篩選**: 支持同時選擇多個篩選條件
- **自定義篩選**: 通過 `filterMethod` 實現自定義篩選邏輯
- **外部搜索**: 結合輸入框、選擇器等組件實現外部篩選

### 篩選控制
- **篩選數據**: 通過 `filters` 定義篩選選項
- **篩選方法**: 通過 `filterMethod` 自定義篩選邏輯
- **篩選事件**: 監聽 `filter-change` 事件獲取篩選變化

## 配置示例

### 基礎篩選
```javascript
const columns = [
  { 
    label: '部門', 
    prop: 'department',
    filters: [
      { text: '技術部', value: '技術部' },
      { text: '產品部', value: '產品部' },
      { text: '設計部', value: '設計部' }
    ],
    filterMethod: (value, row) => row.department === value
  }
]
```

### 多選篩選
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
    filterMultiple: true  // 開啓多選
  }
]
```

### 自定義篩選邏輯
```javascript
const columns = [
  { 
    label: '薪資範圍', 
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

### 外部篩選控制
```vue
<template>
  <div>
    <!-- 外部篩選控件 -->
    <el-input 
      v-model="searchName" 
      placeholder="搜索姓名" 
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

## 篩選參數

| 參數 | 説明 | 類型 | 默認值 |
|-----|------|-----|--------|
| `filters` | 數據過濾的選項 | `array[{ text, value }]` | - |
| `filterPlacement` | 過濾彈出框的定位 | `string` | - |
| `filterMultiple` | 數據過濾的選項是否多選 | `boolean` | `true` |
| `filterMethod` | 數據過濾使用的方法 | `Function(value, row, column)` | - |
| `filteredValue` | 選中的數據過濾項 | `array` | - |

## 篩選方法

| 方法名 | 説明 | 參數 |
|-------|------|------|
| `clearFilter` | 用於清空指定列的過濾條件 | `columnKeys` |
| `setCurrentRow` | 用於單選表格，設定某一行為選中行 | `row` |

## 事件説明

| 事件名 | 説明 | 參數 |
|-------|------|------|
| `filter-change` | 當表格的篩選條件發生變化的時候會觸發該事件 | `filters` |

## 最佳實踐

1. **合理使用篩選**: 對於數據量大的列建議使用篩選，提升用户體驗
2. **篩選項命名**: 篩選選項的文本要簡潔明瞭，便於用户理解
3. **組合篩選**: 多個篩選條件可以組合使用，提供更精確的篩選能力
4. **篩選反饋**: 篩選後及時給用户反饋，顯示篩選結果數量