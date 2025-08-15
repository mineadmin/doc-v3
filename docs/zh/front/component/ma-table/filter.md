# 表格筛选

支持多种筛选方式：列头筛选、自定义搜索、组合筛选等。

## 筛选演示

<DemoPreview dir="demos/ma-table/filter" />

## 功能特性

### 筛选类型
- **列头筛选**: 在列头提供筛选下拉菜单
- **多选筛选**: 支持同时选择多个筛选条件
- **自定义筛选**: 通过 `filterMethod` 实现自定义筛选逻辑
- **外部搜索**: 结合输入框、选择器等组件实现外部筛选

### 筛选控制
- **筛选数据**: 通过 `filters` 定义筛选选项
- **筛选方法**: 通过 `filterMethod` 自定义筛选逻辑
- **筛选事件**: 监听 `filter-change` 事件获取筛选变化

## 配置示例

### 基础筛选
```javascript
const columns = [
  { 
    label: '部门', 
    prop: 'department',
    filters: [
      { text: '技术部', value: '技术部' },
      { text: '产品部', value: '产品部' },
      { text: '设计部', value: '设计部' }
    ],
    filterMethod: (value, row) => row.department === value
  }
]
```

### 多选筛选
```javascript
const columns = [
  { 
    label: '职级', 
    prop: 'level',
    filters: [
      { text: 'P5', value: 'P5' },
      { text: 'P6', value: 'P6' },
      { text: 'P7', value: 'P7' }
    ],
    filterMethod: (value, row) => row.level === value,
    filterMultiple: true  // 开启多选
  }
]
```

### 自定义筛选逻辑
```javascript
const columns = [
  { 
    label: '薪资范围', 
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

### 外部筛选控制
```vue
<template>
  <div>
    <!-- 外部筛选控件 -->
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

## 筛选参数

| 参数 | 说明 | 类型 | 默认值 |
|-----|------|-----|--------|
| `filters` | 数据过滤的选项 | `array[{ text, value }]` | - |
| `filterPlacement` | 过滤弹出框的定位 | `string` | - |
| `filterMultiple` | 数据过滤的选项是否多选 | `boolean` | `true` |
| `filterMethod` | 数据过滤使用的方法 | `Function(value, row, column)` | - |
| `filteredValue` | 选中的数据过滤项 | `array` | - |

## 筛选方法

| 方法名 | 说明 | 参数 |
|-------|------|------|
| `clearFilter` | 用于清空指定列的过滤条件 | `columnKeys` |
| `setCurrentRow` | 用于单选表格，设定某一行为选中行 | `row` |

## 事件说明

| 事件名 | 说明 | 参数 |
|-------|------|------|
| `filter-change` | 当表格的筛选条件发生变化的时候会触发该事件 | `filters` |

## 最佳实践

1. **合理使用筛选**: 对于数据量大的列建议使用筛选，提升用户体验
2. **筛选项命名**: 筛选选项的文本要简洁明了，便于用户理解
3. **组合筛选**: 多个筛选条件可以组合使用，提供更精确的筛选能力
4. **筛选反馈**: 筛选后及时给用户反馈，显示筛选结果数量