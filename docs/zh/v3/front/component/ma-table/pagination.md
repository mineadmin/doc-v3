# 分页表格

展示完整的分页功能，包括分页配置、事件处理、动态更新等。

## 分页演示

<DemoPreview dir="demos/ma-table/pagination" />

## 功能特性

### 分页组件
- **页码导航**: 支持页码切换和跳转
- **页面大小**: 可选择每页显示的条数
- **总数显示**: 显示数据总条数
- **快速跳转**: 支持输入页码快速跳转

### 分页配置
- **布局配置**: 自定义分页组件的显示元素
- **样式配置**: 支持背景色、尺寸等样式配置
- **事件处理**: 监听页码和页面大小变化事件
- **动态更新**: 运行时修改分页配置

## 配置示例

### 基础分页配置
```javascript
const options = {
  showPagination: true,
  pagination: {
    currentPage: 1,
    pageSize: 10,
    total: 100,
    layout: 'total, sizes, prev, pager, next, jumper',
    pageSizes: [10, 20, 50, 100],
    background: true
  }
}
```

### 分页事件处理
```javascript
const options = {
  pagination: {
    currentPage: 1,
    pageSize: 10,
    total: 100,
    onChange: (currentPage, pageSize) => {
      console.log('分页变化:', currentPage, pageSize)
      // 重新加载数据
      loadData(currentPage, pageSize)
    },
    onSizeChange: (pageSize) => {
      console.log('页面大小变化:', pageSize)
    },
    onCurrentChange: (currentPage) => {
      console.log('当前页变化:', currentPage)
    }
  }
}
```

### 自定义分页布局
```javascript
const options = {
  pagination: {
    layout: 'prev, pager, next, jumper, ->, total, sizes',
    pageSizes: [5, 10, 20, 50],
    // 隐藏单页时的分页
    hideOnSinglePage: true
  }
}
```

### 分页样式配置
```javascript
const options = {
  pagination: {
    size: 'small',        // 分页尺寸
    background: true,     // 页码背景
    disabled: false,      // 是否禁用
    prevText: '上一页',    // 上一页按钮文字
    nextText: '下一页'     // 下一页按钮文字
  }
}
```

### 使用 Expose 方法更新分页
```vue
<template>
  <ma-table 
    ref="tableRef"
    :columns="columns" 
    :data="data" 
    :options="options" 
  />
</template>

<script setup>
const tableRef = ref()

// 更新分页配置
const updatePagination = () => {
  const newPagination = {
    currentPage: 1,
    pageSize: 20,
    total: 200
  }
  tableRef.value?.setPagination(newPagination)
}

// 获取当前配置
const getCurrentOptions = () => {
  const options = tableRef.value?.getOptions()
  console.log('当前分页配置:', options.pagination)
}
</script>
```

## 分页参数

### 基础参数

| 参数 | 说明 | 类型 | 默认值 |
|-----|------|-----|--------|
| `currentPage` | 当前页数 | `number` | `1` |
| `pageSize` | 每页显示条目个数 | `number` | `10` |
| `total` | 总条目数 | `number` | `0` |
| `pageSizes` | 每页显示个数选择器的选项 | `number[]` | `[10, 20, 50, 100]` |

### 样式参数

| 参数 | 说明 | 类型 | 默认值 |
|-----|------|-----|--------|
| `size` | 分页组件大小 | `'large' \| 'default' \| 'small'` | `'default'` |
| `background` | 是否为页码按钮添加背景色 | `boolean` | `false` |
| `layout` | 组件布局，子组件名用逗号分隔 | `string` | `'prev, pager, next, jumper, ->, total'` |
| `pagerCount` | 页码按钮的数量 | `number` | `7` |

### 控制参数

| 参数 | 说明 | 类型 | 默认值 |
|-----|------|-----|--------|
| `disabled` | 是否禁用分页 | `boolean` | `false` |
| `hideOnSinglePage` | 只有一页时是否隐藏 | `boolean` | `false` |
| `prevText` | 替代图标显示的上一页文字 | `string` | - |
| `nextText` | 替代图标显示的下一页文字 | `string` | - |

## 分页事件

| 事件名 | 说明 | 参数 |
|-------|------|------|
| `onChange` | 页码或页面大小改变时触发 | `(currentPage, pageSize)` |
| `onSizeChange` | 每页条数改变时触发 | `(pageSize)` |
| `onCurrentChange` | 当前页改变时触发 | `(currentPage)` |
| `onPrevClick` | 用户点击上一页按钮改变当前页后触发 | `(currentPage)` |
| `onNextClick` | 用户点击下一页按钮改变当前页后触发 | `(currentPage)` |

## 布局选项

`layout` 属性可以配置以下组件：

- `prev`: 上一页按钮
- `pager`: 页码列表
- `next`: 下一页按钮
- `jumper`: 跳转输入框
- `total`: 总条目数
- `sizes`: 每页显示个数选择器
- `->`: 分隔符，表示后面的组件靠右显示

示例布局：
- `'total, sizes, prev, pager, next, jumper'`
- `'prev, pager, next, jumper, ->, total, sizes'`

## 最佳实践

1. **数据分页**: 建议在服务端进行数据分页，避免一次性加载大量数据
2. **状态同步**: 确保分页状态与实际数据保持同步
3. **用户体验**: 提供合适的页面大小选项，通常包含 10、20、50 等
4. **加载状态**: 在数据加载时显示 loading 状态
5. **错误处理**: 处理分页数据加载失败的情况

## 服务端分页示例

```vue
<template>
  <ma-table 
    :columns="columns" 
    :data="currentPageData" 
    :options="tableOptions" 
  />
</template>

<script setup>
import { ref, reactive } from 'vue'

const currentPageData = ref([])
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const tableOptions = {
  loading: false,
  pagination: {
    ...pagination,
    onChange: async (currentPage, pageSize) => {
      pagination.currentPage = currentPage
      pagination.pageSize = pageSize
      await loadData()
    }
  }
}

const loadData = async () => {
  try {
    tableOptions.loading = true
    const response = await api.getTableData({
      page: pagination.currentPage,
      size: pagination.pageSize
    })
    
    currentPageData.value = response.data
    pagination.total = response.total
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    tableOptions.loading = false
  }
}

// 初始加载
loadData()
</script>
```