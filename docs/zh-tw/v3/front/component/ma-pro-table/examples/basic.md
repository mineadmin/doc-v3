# 基礎用法

最簡單的表格使用方式，包含搜尋、分頁和基本操作功能。

<DemoPreview dir="demos/ma-pro-table-examples/basic" />

## 功能特點

- **快速搭建**：基於 ma-search 和 ma-table 組合
- **搜尋功能**：內建搜尋表單，支援多種搜尋元件
- **分頁支援**：自動處理分頁邏輯
- **操作列**：支援靈活的操作按鈕配置
- **資料繫結**：自動處理 API 請求和資料渲染

## 核心配置

### 基本結構
```vue
<template>
  <MaProTable :options="options" :schema="schema" />
</template>

<script setup>
import { reactive } from 'vue'

// 元件配置
const options = reactive({
  requestOptions: {
    api: getDataList,        // API 介面
    autoRequest: true,       // 自動請求
    response: {
      totalKey: 'data.total',
      dataKey: 'data.list'
    }
  },
  tableOptions: {
    adaption: true,          // 自適應高度
    pagination: {
      total: 0,
      pageSize: 10
    }
  }
})

// 表格架構
const schema = reactive({
  searchItems: [             // 搜尋配置
    {
      label: '姓名',
      prop: 'name',
      render: 'input'
    }
  ],
  tableColumns: [            // 表格列配置
    { label: 'ID', prop: 'id' },
    { label: '姓名', prop: 'name' }
  ]
})
</script>
```

### 操作列配置
```javascript
{
  type: 'operation',
  label: '操作',
  width: 200,
  operationConfigure: {
    type: 'tile',            // 平鋪顯示
    actions: [
      {
        name: 'edit',
        text: '編輯',
        onClick: (data) => {
          console.log('編輯', data.row)
        }
      }
    ]
  }
}
```

## 使用說明

1. **API 介面**：需要返回符合 `{ code, data: { list, total } }` 格式的資料
2. **搜尋元件**：支援 input、select、date 等多種型別
3. **操作按鈕**：可以配置點選事件、顯示條件、樣式等
4. **自適應高度**：開啟 `adaption` 後會自動計算表格高度

這是使用 MaProTable 的最基本示例，展示瞭如何快速構建一個完整的 CRUD 介面。