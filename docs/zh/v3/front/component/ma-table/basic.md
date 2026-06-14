# 基础表格

展示最基本的表格功能，包括条纹、边框、高亮当前行等特性。

## 基本用法

<DemoPreview dir="demos/ma-table/basic" />

## 特性说明

### 基础配置
- **条纹显示**: `stripe: true` 开启隔行换色
- **边框显示**: `border: true` 显示表格边框  
- **当前行高亮**: `highlightCurrentRow: true` 点击行时高亮显示
- **表头显示**: `showHeader: true` 控制表头的显示隐藏

### 列配置
- **固定宽度**: `width` 设置列的固定宽度
- **最小宽度**: `minWidth` 设置列的最小宽度
- **列对齐**: `align` 控制列内容的对齐方式

## 代码示例

```vue
<template>
  <ma-table
    :columns="columns"
    :data="data"
    :options="options"
  />
</template>

<script setup>
import { ref } from 'vue'

const columns = ref([
  { label: '姓名', prop: 'name', width: 120 },
  { label: '年龄', prop: 'age', width: 80 },
  { label: '邮箱', prop: 'email' },
  { label: '部门', prop: 'department' },
  { label: '职位', prop: 'position' }
])

const options = ref({
  stripe: true,
  border: true,
  size: 'default',
  showHeader: true,
  highlightCurrentRow: true
})

const data = [
  { name: '张三', age: 28, email: 'zhangsan@example.com', department: '技术部', position: '前端工程师' },
  // ... 更多数据
]
</script>
```

## 配置参数

| 参数 | 说明 | 类型 | 默认值 |
|-----|------|-----|--------|
| `stripe` | 是否为斑马纹表格 | `boolean` | `false` |
| `border` | 是否带有纵向边框 | `boolean` | `false` |
| `size` | 表格的尺寸 | `'large' \| 'default' \| 'small'` | `'default'` |
| `highlightCurrentRow` | 是否要高亮当前行 | `boolean` | `false` |
| `showHeader` | 是否显示表头 | `boolean` | `true` |