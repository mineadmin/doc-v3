# 表格排序

支持多種排序方式：內置排序、自定義排序、多級排序等。

## 排序演示

<DemoPreview dir="demos/ma-table/sorting" />

## 功能特性

### 排序類型
- **內置排序**: 直接設置 `sortable: true`，使用默認排序算法
- **自定義排序**: 設置 `sortable: 'custom'`，通過事件監聽實現自定義排序邏輯
- **禁用排序**: 不設置 `sortable` 或設置為 `false`

### 排序控制
- **默認排序**: 通過 `defaultSort` 設置表格初始排序狀態
- **排序順序**: 通過 `sortOrders` 控制排序的切換順序
- **排序事件**: 監聽 `sort-change` 事件獲取排序變化

## 配置示例

### 基礎排序
```javascript
const columns = [
  { 
    label: '商品名稱', 
    prop: 'name', 
    sortable: true  // 開啓內置排序
  },
  { 
    label: '價格', 
    prop: 'price', 
    sortable: 'custom'  // 自定義排序
  }
]
```

### 排序配置
```javascript
const options = {
  // 設置默認排序
  defaultSort: { 
    prop: 'price', 
    order: 'descending' 
  },
  // 監聽排序事件
  on: {
    onSortChange: ({ column, prop, order }) => {
      console.log('排序變更:', column.label, order)
    }
  }
}
```

### 自定義排序順序
```javascript
const columns = [
  { 
    label: '銷量', 
    prop: 'sales', 
    sortable: true,
    // 自定義排序順序：升序 -> 降序 -> 無排序
    sortOrders: ['ascending', 'descending', null]
  }
]
```

## 排序參數

| 參數 | 説明 | 類型 | 默認值 |
|-----|------|-----|--------|
| `sortable` | 對應列是否可以排序 | `boolean \| 'custom'` | `false` |
| `sortMethod` | 對數據進行排序的時候使用的方法 | `Function(a, b)` | - |
| `sortBy` | 指定數據按照哪個屬性進行排序 | `string \| array \| Function(row, index)` | - |
| `sortOrders` | 數據在排序時所使用排序策略的輪轉順序 | `array` | `['ascending', 'descending', null]` |
| `defaultSort` | 默認的排序列的 prop 和順序 | `object` | - |

## 事件説明

| 事件名 | 説明 | 參數 |
|-------|------|------|
| `sort-change` | 當表格的排序條件發生變化的時候會觸發該事件 | `{ column, prop, order }` |

其中 `order` 的值為：
- `'ascending'`: 升序
- `'descending'`: 降序  
- `null`: 取消排序