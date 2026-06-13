# 多選表格

展示表格的多選功能，包括單選、全選、批量操作等。

## 多選表格演示

<DemoPreview dir="demos/ma-table/selection" />

## 功能特性

### 選擇控制
- **單行選擇**: 點擊複選框選擇單行數據
- **全選功能**: 表頭複選框實現全選/反選
- **選擇約束**: 可設置某些行不可選擇
- **選擇保持**: 支持跨頁保持選擇狀態

### 批量操作
- **批量處理**: 基於選中行進行批量操作
- **選擇統計**: 實時顯示選中記錄的數量和狀態
- **操作反饋**: 批量操作的結果反饋和確認

## 配置示例

### 基礎多選配置
```javascript
const columns = [
  {
    type: 'selection',        // 多選列
    width: 50,
    selectable: (row, index) => {
      // 設置選擇約束條件
      return row.status !== 'disabled'
    }
  },
  { label: '姓名', prop: 'name' },
  { label: '狀態', prop: 'status' }
]
```

### 監聽選擇事件
```javascript
const options = {
  on: {
    onSelect: (selection, row) => {
      console.log('單行選擇:', row, selection.includes(row) ? '選中' : '取消')
    },
    onSelectAll: (selection) => {
      console.log('全選操作:', selection.length > 0 ? '全選' : '取消全選')
    },
    onSelectionChange: (selection) => {
      console.log('選擇變化:', selection)
      // 更新選中狀態
      selectedRows.value = selection
    }
  }
}
```

### 程序化選擇控制
```vue
<template>
  <div>
    <div class="selection-controls">
      <el-button @click="selectAll">全選</el-button>
      <el-button @click="clearSelection">清空選擇</el-button>
      <el-button @click="toggleSelection">反選</el-button>
      <el-button @click="selectActive">選擇正常狀態</el-button>
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

// 全選
const selectAll = () => {
  const selectableRows = data.value.filter(row => row.status !== 'disabled')
  selectableRows.forEach(row => {
    tableRef.value?.getElTableRef()?.toggleRowSelection(row, true)
  })
}

// 清空選擇
const clearSelection = () => {
  tableRef.value?.getElTableRef()?.clearSelection()
}

// 反選
const toggleSelection = () => {
  data.value.forEach(row => {
    if (row.status !== 'disabled') {
      const isSelected = selectedRows.value.includes(row)
      tableRef.value?.getElTableRef()?.toggleRowSelection(row, !isSelected)
    }
  })
}

// 選擇特定條件的行
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
    <!-- 批量操作工具欄 -->
    <div v-if="selectedRows.length > 0" class="batch-toolbar">
      <span>已選擇 {{ selectedRows.length }} 條記錄</span>
      <el-button type="success" @click="batchActivate">
        批量激活
      </el-button>
      <el-button type="warning" @click="batchDeactivate">
        批量停用
      </el-button>
      <el-button type="danger" @click="batchDelete">
        批量刪除
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
      `確定要激活選中的 ${selectedRows.value.length} 個用户嗎？`,
      '批量激活',
      { type: 'warning' }
    )
    
    // 執行批量操作
    const ids = selectedRows.value.map(row => row.id)
    await api.batchActivateUsers(ids)
    
    // 更新本地數據
    selectedRows.value.forEach(row => {
      row.status = 'active'
    })
    
    ElMessage.success('批量激活成功')
    clearSelection()
    
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量激活失敗')
    }
  }
}

// 批量刪除
const batchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `確定要刪除選中的 ${selectedRows.value.length} 條記錄嗎？此操作不可恢復！`,
      '批量刪除',
      { type: 'error' }
    )
    
    const ids = selectedRows.value.map(row => row.id)
    await api.batchDeleteUsers(ids)
    
    // 從本地數據中移除
    data.value = data.value.filter(row => !ids.includes(row.id))
    
    ElMessage.success('批量刪除成功')
    selectedRows.value = []
    
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量刪除失敗')
    }
  }
}
</script>
```

## 多選參數

### 選擇列配置

| 參數 | 説明 | 類型 | 默認值 |
|-----|------|-----|--------|
| `type` | 列類型，設置為 'selection' 即為多選列 | `string` | - |
| `selectable` | 該行的複選框是否可以勾選 | `Function(row, index)` | - |
| `reserveSelection` | 數據更新後是否保留選項 | `boolean` | `false` |

### 選擇事件

| 事件名 | 説明 | 參數 |
|-------|------|------|
| `select` | 當用户手動勾選數據行的 Checkbox 時觸發 | `(selection, row)` |
| `select-all` | 當用户手動勾選全選 Checkbox 時觸發 | `(selection)` |
| `selection-change` | 當選擇項發生變化時會觸發該事件 | `(selection)` |

## 表格方法

通過 `tableRef.value?.getElTableRef()` 可以訪問以下方法：

| 方法名 | 説明 | 參數 |
|-------|------|------|
| `clearSelection` | 清空所有選擇 | - |
| `getSelectionRows` | 返回當前選中的行 | - |
| `toggleRowSelection` | 切換某一行的選中狀態 | `(row, selected)` |
| `toggleAllSelection` | 切換全選狀態 | - |

## 使用場景

### 1. 用户管理
```javascript
// 用户數據結構
const userData = [
  {
    id: 1,
    name: '張三',
    status: 'active',    // 正常狀態可選擇
    role: 'admin'
  },
  {
    id: 2,
    name: '李四',
    status: 'disabled',  // 禁用狀態不可選擇
    role: 'user'
  }
]

// 選擇約束
const columns = [
  {
    type: 'selection',
    selectable: (row) => row.status !== 'disabled'
  }
]
```

### 2. 訂單管理
```javascript
// 批量操作訂單
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
    ElMessage.error(`批量${action}操作失敗`)
  }
}
```

### 3. 數據導出
```javascript
// 導出選中數據
const exportSelected = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('請先選擇要導出的數據')
    return
  }
  
  // 構造導出數據
  const exportData = selectedRows.value.map(row => ({
    姓名: row.name,
    郵箱: row.email,
    部門: row.department,
    職位: row.position
  }))
  
  // 執行導出
  exportToExcel(exportData, '用户數據.xlsx')
  ElMessage.success(`已導出 ${selectedRows.value.length} 條數據`)
}
```

## 最佳實踐

1. **選擇約束**: 合理設置 `selectable` 函數，避免用户選擇不應該操作的數據
2. **狀態同步**: 確保選中狀態與實際數據保持同步
3. **批量確認**: 批量操作前進行二次確認，特別是刪除等危險操作
4. **操作反饋**: 及時給用户反饋批量操作的結果
5. **性能考慮**: 大量數據時考慮虛擬滾動或分頁處理

## 注意事項

- 選擇狀態不會自動保存，頁面刷新後會丟失
- 跨頁選擇需要特殊處理，可使用 `reserveSelection` 屬性
- 批量操作時要考慮網絡異常和部分失敗的情況
- 選擇約束函數會在每次渲染時調用，避免複雜計算