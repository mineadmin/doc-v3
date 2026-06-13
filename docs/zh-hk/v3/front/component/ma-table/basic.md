# 基礎表格

展示最基本的表格功能，包括條紋、邊框、高亮當前行等特性。

## 基本用法

<DemoPreview dir="demos/ma-table/basic" />

## 特性説明

### 基礎配置
- **條紋顯示**: `stripe: true` 開啓隔行換色
- **邊框顯示**: `border: true` 顯示錶格邊框  
- **當前行高亮**: `highlightCurrentRow: true` 點擊行時高亮顯示
- **表頭顯示**: `showHeader: true` 控制表頭的顯示隱藏

### 列配置
- **固定寬度**: `width` 設置列的固定寬度
- **最小寬度**: `minWidth` 設置列的最小寬度
- **列對齊**: `align` 控制列內容的對齊方式

## 代碼示例

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
  { label: '年齡', prop: 'age', width: 80 },
  { label: '郵箱', prop: 'email' },
  { label: '部門', prop: 'department' },
  { label: '職位', prop: 'position' }
])

const options = ref({
  stripe: true,
  border: true,
  size: 'default',
  showHeader: true,
  highlightCurrentRow: true
})

const data = [
  { name: '張三', age: 28, email: 'zhangsan@example.com', department: '技術部', position: '前端工程師' },
  // ... 更多數據
]
</script>
```

## 配置參數

| 參數 | 説明 | 類型 | 默認值 |
|-----|------|-----|--------|
| `stripe` | 是否為斑馬紋表格 | `boolean` | `false` |
| `border` | 是否帶有縱向邊框 | `boolean` | `false` |
| `size` | 表格的尺寸 | `'large' \| 'default' \| 'small'` | `'default'` |
| `highlightCurrentRow` | 是否要高亮當前行 | `boolean` | `false` |
| `showHeader` | 是否顯示錶頭 | `boolean` | `true` |