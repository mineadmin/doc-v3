# 表格排序

支援多種排序方式：內建排序、自定義排序、多級排序等。

## 排序演示

<DemoPreview dir="demos/ma-table/sorting" />

## 功能特性

### 排序型別
- **內建排序**: 直接設定 `sortable: true`，使用預設排序演算法
- **自定義排序**: 設定 `sortable: 'custom'`，透過事件監聽實現自定義排序邏輯
- **停用排序**: 不設定 `sortable` 或設定為 `false`

### 排序控制
- **預設排序**: 透過 `defaultSort` 設定表格初始排序狀態
- **排序順序**: 透過 `sortOrders` 控制排序的切換順序
- **排序事件**: 監聽 `sort-change` 事件獲取排序變化

## 配置示例

### 基礎排序
```javascript
const columns = [
  { 
    label: '商品名稱', 
    prop: 'name', 
    sortable: true  // 開啟內建排序
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
  // 設定預設排序
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

## 排序引數

| 引數 | 說明 | 型別 | 預設值 |
|-----|------|-----|--------|
| `sortable` | 對應列是否可以排序 | `boolean \| 'custom'` | `false` |
| `sortMethod` | 對資料進行排序的時候使用的方法 | `Function(a, b)` | - |
| `sortBy` | 指定資料按照哪個屬性進行排序 | `string \| array \| Function(row, index)` | - |
| `sortOrders` | 資料在排序時所使用排序策略的輪轉順序 | `array` | `['ascending', 'descending', null]` |
| `defaultSort` | 預設的排序列的 prop 和順序 | `object` | - |

## 事件說明

| 事件名 | 說明 | 引數 |
|-------|------|------|
| `sort-change` | 當表格的排序條件發生變化的時候會觸發該事件 | `{ column, prop, order }` |

其中 `order` 的值為：
- `'ascending'`: 升序
- `'descending'`: 降序  
- `null`: 取消排序