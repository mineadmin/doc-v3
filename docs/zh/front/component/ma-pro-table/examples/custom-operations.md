# 自定义操作

展示不同类型的操作列配置，包含条件显示、自定义样式和复杂操作逻辑。

<DemoPreview dir="demos/ma-pro-table-examples/custom-operations" />

## 功能特点

- **多种操作类型**：支持平铺、下拉菜单、自动折叠等显示方式
- **条件显示**：根据行数据动态显示/隐藏操作按钮
- **右键菜单**：支持行右键菜单功能
- **拖拽排序**：支持行拖拽重新排序
- **批量操作**：支持多选和批量操作功能

## 操作列配置

### 基础操作配置
```javascript
{
  type: 'operation',
  label: '操作',
  width: 280,
  fixed: 'right',
  operationConfigure: {
    type: 'auto',           // auto/dropdown/tile
    fold: 2,                // 自动模式下的折叠数量
    actions: [
      {
        name: 'view',
        text: '详情',
        icon: 'view',
        onClick: (data) => {
          console.log('查看详情:', data.row)
        }
      }
    ]
  }
}
```

### 操作类型说明

#### 1. 自动模式 (auto)
```javascript
operationConfigure: {
  type: 'auto',
  fold: 2,                  // 显示2个按钮后折叠
  actions: [...]
}
```

#### 2. 下拉菜单模式 (dropdown)
```javascript
operationConfigure: {
  type: 'dropdown',
  actions: [...]
}
```

#### 3. 平铺模式 (tile)
```javascript
operationConfigure: {
  type: 'tile',
  actions: [...]
}
```

## 操作按钮配置

### 基础按钮
```javascript
{
  name: 'edit',
  text: '编辑',
  icon: 'edit',
  onClick: (data, proxy) => {
    console.log('编辑数据:', data.row)
    console.log('表格实例:', proxy)
  }
}
```

### 条件显示
```javascript
{
  name: 'approve',
  text: '审批',
  show: (data) => data.row.status === 'pending',    // 条件显示
  disabled: (data) => !data.row.canApprove,        // 条件禁用
  onClick: (data, proxy) => {
    // 审批逻辑
    proxy.refresh()  // 刷新表格
  }
}
```

### 自定义样式
```javascript
{
  name: 'delete',
  text: '删除',
  icon: 'delete',
  linkProps: {
    type: 'danger',         // 按钮类型
    size: 'small'           // 按钮尺寸
  },
  onClick: (data) => {
    ElMessageBox.confirm('确定删除?', '确认', {
      type: 'warning'
    }).then(() => {
      console.log('删除:', data.row)
    })
  }
}
```

### 操作排序
```javascript
{
  name: 'high-priority',
  text: '高优先级',
  order: 1,                 // 排序权重，数字越小越靠前
  onClick: (data) => {
    console.log('高优先级操作')
  }
}
```

## 右键菜单

### 启用右键菜单
```javascript
const options = {
  rowContextMenu: {
    enabled: true,
    items: [
      {
        label: '查看详情',
        icon: 'view',
        onMenuClick: (data, event) => {
          console.log('右键查看:', data.row)
        }
      },
      {
        label: '复制申请',
        icon: 'copy',
        onMenuClick: (data, event) => {
          console.log('复制数据:', data.row)
        }
      },
      {
        label: '删除',
        icon: 'delete',
        disabled: (data) => !data.row.canDelete,  // 条件禁用
        onMenuClick: (data, event) => {
          console.log('右键删除:', data.row)
        }
      }
    ]
  }
}
```

## 拖拽排序

### 启用拖拽
```javascript
const options = {
  tableOptions: {
    rowDrag: true           // 开启行拖拽
  }
}

// 监听拖拽事件
const schema = {
  tableColumns: [
    { type: 'sort', width: 60 },  // 拖拽列
    // ...其他列
  ]
}
```

### 拖拽事件
```vue
<MaProTable 
  :options="options" 
  :schema="schema"
  @row-drag-sort="handleRowDragSort"
/>

<script setup>
const handleRowDragSort = (tableData) => {
  console.log('新的排序:', tableData.map(item => item.title))
  // 调用API保存新的排序
}
</script>
```

## 批量操作

### 启用多选
```javascript
const options = {
  tableOptions: {
    selection: true         // 开启多选
  }
}
```

### 批量操作示例
```vue
<template>
  <div class="control-panel">
    <el-button @click="batchApprove" type="primary">批量审批</el-button>
    <el-button @click="batchDelete" type="danger">批量删除</el-button>
  </div>
  <MaProTable ref="tableRef" :options="options" :schema="schema" />
</template>

<script setup>
const tableRef = ref()

const batchApprove = () => {
  const selectedRows = tableRef.value?.getTableRef?.()?.getSelectionRows?.()
  console.log('选中的行:', selectedRows)
}

const batchDelete = () => {
  ElMessageBox.confirm('确定批量删除选中项?', '批量操作', {
    type: 'warning'
  }).then(() => {
    // 批量删除逻辑
    tableRef.value?.refresh()
  })
}
</script>
```

## 高级操作示例

### 异步操作
```javascript
{
  name: 'async-action',
  text: '异步操作',
  onClick: async (data, proxy) => {
    try {
      ElMessage.info('处理中...')
      await someAsyncOperation(data.row.id)
      ElMessage.success('操作成功')
      await proxy.refresh()  // 刷新表格
    } catch (error) {
      ElMessage.error('操作失败')
    }
  }
}
```

### 弹窗操作
```javascript
{
  name: 'dialog-action',
  text: '弹窗操作',
  onClick: (data, proxy) => {
    ElMessageBox.prompt('请输入备注', '操作确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then(({ value }) => {
      console.log('备注:', value)
      console.log('数据:', data.row)
      proxy.refresh()
    })
  }
}
```

自定义操作功能让你可以构建复杂的交互逻辑，满足各种业务场景的操作需求。