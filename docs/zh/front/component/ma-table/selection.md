# 多选表格

展示表格的多选功能，包括单选、全选、批量操作等。

## 多选表格演示

<DemoPreview dir="demos/ma-table/selection" />

## 功能特性

### 选择控制
- **单行选择**: 点击复选框选择单行数据
- **全选功能**: 表头复选框实现全选/反选
- **选择约束**: 可设置某些行不可选择
- **选择保持**: 支持跨页保持选择状态

### 批量操作
- **批量处理**: 基于选中行进行批量操作
- **选择统计**: 实时显示选中记录的数量和状态
- **操作反馈**: 批量操作的结果反馈和确认

## 配置示例

### 基础多选配置
```javascript
const columns = [
  {
    type: 'selection',        // 多选列
    width: 50,
    selectable: (row, index) => {
      // 设置选择约束条件
      return row.status !== 'disabled'
    }
  },
  { label: '姓名', prop: 'name' },
  { label: '状态', prop: 'status' }
]
```

### 监听选择事件
```javascript
const options = {
  on: {
    onSelect: (selection, row) => {
      console.log('单行选择:', row, selection.includes(row) ? '选中' : '取消')
    },
    onSelectAll: (selection) => {
      console.log('全选操作:', selection.length > 0 ? '全选' : '取消全选')
    },
    onSelectionChange: (selection) => {
      console.log('选择变化:', selection)
      // 更新选中状态
      selectedRows.value = selection
    }
  }
}
```

### 程序化选择控制
```vue
<template>
  <div>
    <div class="selection-controls">
      <el-button @click="selectAll">全选</el-button>
      <el-button @click="clearSelection">清空选择</el-button>
      <el-button @click="toggleSelection">反选</el-button>
      <el-button @click="selectActive">选择正常状态</el-button>
    </div>
    
    <ma-table 
      ref="tableRef"
      :columns="columns" 
      :data="data" 
      :options="options" 
    />
  </div>
</template>

<script setup>
const tableRef = ref()
const selectedRows = ref([])

// 全选
const selectAll = () => {
  const selectableRows = data.value.filter(row => row.status !== 'disabled')
  selectableRows.forEach(row => {
    tableRef.value?.getElTableRef()?.toggleRowSelection(row, true)
  })
}

// 清空选择
const clearSelection = () => {
  tableRef.value?.getElTableRef()?.clearSelection()
}

// 反选
const toggleSelection = () => {
  data.value.forEach(row => {
    if (row.status !== 'disabled') {
      const isSelected = selectedRows.value.includes(row)
      tableRef.value?.getElTableRef()?.toggleRowSelection(row, !isSelected)
    }
  })
}

// 选择特定条件的行
const selectActive = () => {
  const activeRows = data.value.filter(row => row.status === 'active')
  activeRows.forEach(row => {
    tableRef.value?.getElTableRef()?.toggleRowSelection(row, true)
  })
}
</script>
```

### 批量操作示例
```vue
<template>
  <div>
    <!-- 批量操作工具栏 -->
    <div v-if="selectedRows.length > 0" class="batch-toolbar">
      <span>已选择 {{ selectedRows.length }} 条记录</span>
      <el-button type="success" @click="batchActivate">
        批量激活
      </el-button>
      <el-button type="warning" @click="batchDeactivate">
        批量停用
      </el-button>
      <el-button type="danger" @click="batchDelete">
        批量删除
      </el-button>
    </div>
    
    <ma-table 
      :columns="columns" 
      :data="data" 
      :options="options" 
    />
  </div>
</template>

<script setup>
// 批量激活
const batchActivate = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要激活选中的 ${selectedRows.value.length} 个用户吗？`,
      '批量激活',
      { type: 'warning' }
    )
    
    // 执行批量操作
    const ids = selectedRows.value.map(row => row.id)
    await api.batchActivateUsers(ids)
    
    // 更新本地数据
    selectedRows.value.forEach(row => {
      row.status = 'active'
    })
    
    ElMessage.success('批量激活成功')
    clearSelection()
    
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量激活失败')
    }
  }
}

// 批量删除
const batchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 条记录吗？此操作不可恢复！`,
      '批量删除',
      { type: 'error' }
    )
    
    const ids = selectedRows.value.map(row => row.id)
    await api.batchDeleteUsers(ids)
    
    // 从本地数据中移除
    data.value = data.value.filter(row => !ids.includes(row.id))
    
    ElMessage.success('批量删除成功')
    selectedRows.value = []
    
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  }
}
</script>
```

## 多选参数

### 选择列配置

| 参数 | 说明 | 类型 | 默认值 |
|-----|------|-----|--------|
| `type` | 列类型，设置为 'selection' 即为多选列 | `string` | - |
| `selectable` | 该行的复选框是否可以勾选 | `Function(row, index)` | - |
| `reserveSelection` | 数据更新后是否保留选项 | `boolean` | `false` |

### 选择事件

| 事件名 | 说明 | 参数 |
|-------|------|------|
| `select` | 当用户手动勾选数据行的 Checkbox 时触发 | `(selection, row)` |
| `select-all` | 当用户手动勾选全选 Checkbox 时触发 | `(selection)` |
| `selection-change` | 当选择项发生变化时会触发该事件 | `(selection)` |

## 表格方法

通过 `tableRef.value?.getElTableRef()` 可以访问以下方法：

| 方法名 | 说明 | 参数 |
|-------|------|------|
| `clearSelection` | 清空所有选择 | - |
| `getSelectionRows` | 返回当前选中的行 | - |
| `toggleRowSelection` | 切换某一行的选中状态 | `(row, selected)` |
| `toggleAllSelection` | 切换全选状态 | - |

## 使用场景

### 1. 用户管理
```javascript
// 用户数据结构
const userData = [
  {
    id: 1,
    name: '张三',
    status: 'active',    // 正常状态可选择
    role: 'admin'
  },
  {
    id: 2,
    name: '李四',
    status: 'disabled',  // 禁用状态不可选择
    role: 'user'
  }
]

// 选择约束
const columns = [
  {
    type: 'selection',
    selectable: (row) => row.status !== 'disabled'
  }
]
```

### 2. 订单管理
```javascript
// 批量操作订单
const batchProcessOrders = async (action) => {
  const orderIds = selectedRows.value.map(row => row.orderId)
  
  try {
    switch (action) {
      case 'ship':
        await api.batchShipOrders(orderIds)
        break
      case 'cancel':
        await api.batchCancelOrders(orderIds)
        break
      case 'export':
        await api.exportOrders(orderIds)
        break
    }
    
    ElMessage.success(`批量${action}操作成功`)
    refreshData()
    
  } catch (error) {
    ElMessage.error(`批量${action}操作失败`)
  }
}
```

### 3. 数据导出
```javascript
// 导出选中数据
const exportSelected = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要导出的数据')
    return
  }
  
  // 构造导出数据
  const exportData = selectedRows.value.map(row => ({
    姓名: row.name,
    邮箱: row.email,
    部门: row.department,
    职位: row.position
  }))
  
  // 执行导出
  exportToExcel(exportData, '用户数据.xlsx')
  ElMessage.success(`已导出 ${selectedRows.value.length} 条数据`)
}
```

## 最佳实践

1. **选择约束**: 合理设置 `selectable` 函数，避免用户选择不应该操作的数据
2. **状态同步**: 确保选中状态与实际数据保持同步
3. **批量确认**: 批量操作前进行二次确认，特别是删除等危险操作
4. **操作反馈**: 及时给用户反馈批量操作的结果
5. **性能考虑**: 大量数据时考虑虚拟滚动或分页处理

## 注意事项

- 选择状态不会自动保存，页面刷新后会丢失
- 跨页选择需要特殊处理，可使用 `reserveSelection` 属性
- 批量操作时要考虑网络异常和部分失败的情况
- 选择约束函数会在每次渲染时调用，避免复杂计算