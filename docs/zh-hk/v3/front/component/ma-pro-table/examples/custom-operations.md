# 自定義操作

展示不同類型的操作列配置，包含條件顯示、自定義樣式和複雜操作邏輯。

<DemoPreview dir="demos/ma-pro-table-examples/custom-operations" />

## 功能特點

- **多種操作類型**：支持平鋪、下拉菜單、自動摺疊等顯示方式
- **條件顯示**：根據行數據動態顯示/隱藏操作按鈕
- **右鍵菜單**：支持行右鍵菜單功能
- **拖拽排序**：支持行拖拽重新排序
- **批量操作**：支持多選和批量操作功能

## 操作列配置

### 基礎操作配置
```javascript
{
  type: 'operation',
  label: '操作',
  width: 280,
  fixed: 'right',
  operationConfigure: {
    type: 'auto',           // auto/dropdown/tile
    fold: 2,                // 自動模式下的摺疊數量
    actions: [
      {
        name: 'view',
        text: '詳情',
        icon: 'view',
        onClick: (data) => {
          console.log('查看詳情:', data.row)
        }
      }
    ]
  }
}
```

### 操作類型説明

#### 1. 自動模式 (auto)
```javascript
operationConfigure: {
  type: 'auto',
  fold: 2,                  // 顯示2個按鈕後摺疊
  actions: [...]
}
```

#### 2. 下拉菜單模式 (dropdown)
```javascript
operationConfigure: {
  type: 'dropdown',
  actions: [...]
}
```

#### 3. 平鋪模式 (tile)
```javascript
operationConfigure: {
  type: 'tile',
  actions: [...]
}
```

## 操作按鈕配置

### 基礎按鈕
```javascript
{
  name: 'edit',
  text: '編輯',
  icon: 'edit',
  onClick: (data, proxy) => {
    console.log('編輯數據:', data.row)
    console.log('表格實例:', proxy)
  }
}
```

### 條件顯示
```javascript
{
  name: 'approve',
  text: '審批',
  show: (data) => data.row.status === 'pending',    // 條件顯示
  disabled: (data) => !data.row.canApprove,        // 條件禁用
  onClick: (data, proxy) => {
    // 審批邏輯
    proxy.refresh()  // 刷新表格
  }
}
```

### 自定義樣式
```javascript
{
  name: 'delete',
  text: '刪除',
  icon: 'delete',
  linkProps: {
    type: 'danger',         // 按鈕類型
    size: 'small'           // 按鈕尺寸
  },
  onClick: (data) => {
    ElMessageBox.confirm('確定刪除?', '確認', {
      type: 'warning'
    }).then(() => {
      console.log('刪除:', data.row)
    })
  }
}
```

### 操作排序
```javascript
{
  name: 'high-priority',
  text: '高優先級',
  order: 1,                 // 排序權重，數字越小越靠前
  onClick: (data) => {
    console.log('高優先級操作')
  }
}
```

## 右鍵菜單

### 啓用右鍵菜單
```javascript
const options = {
  rowContextMenu: {
    enabled: true,
    items: [
      {
        label: '查看詳情',
        icon: 'view',
        onMenuClick: (data, event) => {
          console.log('右鍵查看:', data.row)
        }
      },
      {
        label: '複製申請',
        icon: 'copy',
        onMenuClick: (data, event) => {
          console.log('複製數據:', data.row)
        }
      },
      {
        label: '刪除',
        icon: 'delete',
        disabled: (data) => !data.row.canDelete,  // 條件禁用
        onMenuClick: (data, event) => {
          console.log('右鍵刪除:', data.row)
        }
      }
    ]
  }
}
```

## 拖拽排序

### 啓用拖拽
```javascript
const options = {
  tableOptions: {
    rowDrag: true           // 開啓行拖拽
  }
}

// 監聽拖拽事件
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
  // 調用API保存新的排序
}
</script>
```

## 批量操作

### 啓用多選
```javascript
const options = {
  tableOptions: {
    selection: true         // 開啓多選
  }
}
```

### 批量操作示例
```vue
<template>
  <div class="control-panel">
    <el-button @click="batchApprove" type="primary">批量審批</el-button>
    <el-button @click="batchDelete" type="danger">批量刪除</el-button>
  </div>
  <MaProTable ref="tableRef" :options="options" :schema="schema" />
</template>

<script setup>
const tableRef = ref()

const batchApprove = () => {
  const selectedRows = tableRef.value?.getTableRef?.()?.getSelectionRows?.()
  console.log('選中的行:', selectedRows)
}

const batchDelete = () => {
  ElMessageBox.confirm('確定批量刪除選中項?', '批量操作', {
    type: 'warning'
  }).then(() => {
    // 批量刪除邏輯
    tableRef.value?.refresh()
  })
}
</script>
```

## 高級操作示例

### 異步操作
```javascript
{
  name: 'async-action',
  text: '異步操作',
  onClick: async (data, proxy) => {
    try {
      ElMessage.info('處理中...')
      await someAsyncOperation(data.row.id)
      ElMessage.success('操作成功')
      await proxy.refresh()  // 刷新表格
    } catch (error) {
      ElMessage.error('操作失敗')
    }
  }
}
```

### 彈窗操作
```javascript
{
  name: 'dialog-action',
  text: '彈窗操作',
  onClick: (data, proxy) => {
    ElMessageBox.prompt('請輸入備註', '操作確認', {
      confirmButtonText: '確定',
      cancelButtonText: '取消'
    }).then(({ value }) => {
      console.log('備註:', value)
      console.log('數據:', data.row)
      proxy.refresh()
    })
  }
}
```

自定義操作功能讓你可以構建複雜的交互邏輯，滿足各種業務場景的操作需求。