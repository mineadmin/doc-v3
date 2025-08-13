# 基础用法

最简单的表格使用方式，包含搜索、分页和基本操作功能。

<DemoPreview dir="demos/ma-pro-table-examples/basic" />

## 功能特点

- **快速搭建**：基于 ma-search 和 ma-table 组合
- **搜索功能**：内置搜索表单，支持多种搜索组件
- **分页支持**：自动处理分页逻辑
- **操作列**：支持灵活的操作按钮配置
- **数据绑定**：自动处理 API 请求和数据渲染

## 核心配置

### 基本结构
```vue
<template>
  <MaProTable :options="options" :schema="schema" />
</template>

<script setup>
import { reactive } from 'vue'

// 组件配置
const options = reactive({
  requestOptions: {
    api: getDataList,        // API 接口
    autoRequest: true,       // 自动请求
    response: {
      totalKey: 'data.total',
      dataKey: 'data.list'
    }
  },
  tableOptions: {
    adaption: true,          // 自适应高度
    pagination: {
      total: 0,
      pageSize: 10
    }
  }
})

// 表格架构
const schema = reactive({
  searchItems: [             // 搜索配置
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
    type: 'tile',            // 平铺显示
    actions: [
      {
        name: 'edit',
        text: '编辑',
        onClick: (data) => {
          console.log('编辑', data.row)
        }
      }
    ]
  }
}
```

## 使用说明

1. **API 接口**：需要返回符合 `{ code, data: { list, total } }` 格式的数据
2. **搜索组件**：支持 input、select、date 等多种类型
3. **操作按钮**：可以配置点击事件、显示条件、样式等
4. **自适应高度**：开启 `adaption` 后会自动计算表格高度

这是使用 MaProTable 的最基本示例，展示了如何快速构建一个完整的 CRUD 界面。