# 表格排序

支持多种排序方式：内置排序、自定义排序、多级排序等。

## 排序演示

<DemoPreview dir="demos/ma-table/sorting" />

## 功能特性

### 排序类型
- **内置排序**: 直接设置 `sortable: true`，使用默认排序算法
- **自定义排序**: 设置 `sortable: 'custom'`，通过事件监听实现自定义排序逻辑
- **禁用排序**: 不设置 `sortable` 或设置为 `false`

### 排序控制
- **默认排序**: 通过 `defaultSort` 设置表格初始排序状态
- **排序顺序**: 通过 `sortOrders` 控制排序的切换顺序
- **排序事件**: 监听 `sort-change` 事件获取排序变化

## 配置示例

### 基础排序
```javascript
const columns = [
  { 
    label: '商品名称', 
    prop: 'name', 
    sortable: true  // 开启内置排序
  },
  { 
    label: '价格', 
    prop: 'price', 
    sortable: 'custom'  // 自定义排序
  }
]
```

### 排序配置
```javascript
const options = {
  // 设置默认排序
  defaultSort: { 
    prop: 'price', 
    order: 'descending' 
  },
  // 监听排序事件
  on: {
    onSortChange: ({ column, prop, order }) => {
      console.log('排序变更:', column.label, order)
    }
  }
}
```

### 自定义排序顺序
```javascript
const columns = [
  { 
    label: '销量', 
    prop: 'sales', 
    sortable: true,
    // 自定义排序顺序：升序 -> 降序 -> 无排序
    sortOrders: ['ascending', 'descending', null]
  }
]
```

## 排序参数

| 参数 | 说明 | 类型 | 默认值 |
|-----|------|-----|--------|
| `sortable` | 对应列是否可以排序 | `boolean \| 'custom'` | `false` |
| `sortMethod` | 对数据进行排序的时候使用的方法 | `Function(a, b)` | - |
| `sortBy` | 指定数据按照哪个属性进行排序 | `string \| array \| Function(row, index)` | - |
| `sortOrders` | 数据在排序时所使用排序策略的轮转顺序 | `array` | `['ascending', 'descending', null]` |
| `defaultSort` | 默认的排序列的 prop 和顺序 | `object` | - |

## 事件说明

| 事件名 | 说明 | 参数 |
|-------|------|------|
| `sort-change` | 当表格的排序条件发生变化的时候会触发该事件 | `{ column, prop, order }` |

其中 `order` 的值为：
- `'ascending'`: 升序
- `'descending'`: 降序  
- `null`: 取消排序