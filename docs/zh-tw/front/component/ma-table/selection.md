# 多選表格

展示表格的多選功能，包括單選、全選、批次操作等。

## 多選表格演示

<DemoPreview dir="demos/ma-table/selection" />

## 功能特性

### 選擇控制
- **單行選擇**: 點選複選框選擇單行資料
- **全選功能**: 表頭複選框實現全選/反選
- **選擇約束**: 可設定某些行不可選擇
- **選擇保持**: 支援跨頁保持選擇狀態

### 批次操作
- **批次處理**: 基於選中行進行批次操作
- **選擇統計**: 實時顯示選中記錄的數量和狀態
- **操作反饋**: 批次操作的結果反饋和確認

## 配置示例

### 基礎多選配置
```javascript
const columns = [
  {
    type: 'selection',        // 多選列
    width: 50,
    selectable: (row, index) => {
      // 設定選擇約束條件
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

### 程式化選擇控制
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

### 批次操作示例
```vue
<template>
  <div>
    <!-- 批次操作工具欄 -->
    <div v-if="selectedRows.length > 0" class="batch-toolbar">
      <span>已選擇 {{ selectedRows.length }} 條記錄</span>
      <el-button type="success" @click="batchActivate">
        批次啟用
      </el-button>
      <el-button type="warning" @click="batchDeactivate">
        批次停用
      </el-button>
      <el-button type="danger" @click="batchDelete">
        批次刪除
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
// 批次啟用
const batchActivate = async () => {
  try {
    await ElMessageBox.confirm(
      `確定要啟用選中的 ${selectedRows.value.length} 個使用者嗎？`,
      '批次啟用',
      { type: 'warning' }
    )
    
    // 執行批次操作
    const ids = selectedRows.value.map(row => row.id)
    await api.batchActivateUsers(ids)
    
    // 更新本地資料
    selectedRows.value.forEach(row => {
      row.status = 'active'
    })
    
    ElMessage.success('批次啟用成功')
    clearSelection()
    
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批次啟用失敗')
    }
  }
}

// 批次刪除
const batchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `確定要刪除選中的 ${selectedRows.value.length} 條記錄嗎？此操作不可恢復！`,
      '批次刪除',
      { type: 'error' }
    )
    
    const ids = selectedRows.value.map(row => row.id)
    await api.batchDeleteUsers(ids)
    
    // 從本地資料中移除
    data.value = data.value.filter(row => !ids.includes(row.id))
    
    ElMessage.success('批次刪除成功')
    selectedRows.value = []
    
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批次刪除失敗')
    }
  }
}
</script>
```

## 多選引數

### 選擇列配置

| 引數 | 說明 | 型別 | 預設值 |
|-----|------|-----|--------|
| `type` | 列型別，設定為 'selection' 即為多選列 | `string` | - |
| `selectable` | 該行的複選框是否可以勾選 | `Function(row, index)` | - |
| `reserveSelection` | 資料更新後是否保留選項 | `boolean` | `false` |

### 選擇事件

| 事件名 | 說明 | 引數 |
|-------|------|------|
| `select` | 當用戶手動勾選資料行的 Checkbox 時觸發 | `(selection, row)` |
| `select-all` | 當用戶手動勾選全選 Checkbox 時觸發 | `(selection)` |
| `selection-change` | 當選擇項發生變化時會觸發該事件 | `(selection)` |

## 表格方法

透過 `tableRef.value?.getElTableRef()` 可以訪問以下方法：

| 方法名 | 說明 | 引數 |
|-------|------|------|
| `clearSelection` | 清空所有選擇 | - |
| `getSelectionRows` | 返回當前選中的行 | - |
| `toggleRowSelection` | 切換某一行的選中狀態 | `(row, selected)` |
| `toggleAllSelection` | 切換全選狀態 | - |

## 使用場景

### 1. 使用者管理
```javascript
// 使用者資料結構
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
    status: 'disabled',  // 停用狀態不可選擇
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
// 批次操作訂單
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
    
    ElMessage.success(`批次${action}操作成功`)
    refreshData()
    
  } catch (error) {
    ElMessage.error(`批次${action}操作失敗`)
  }
}
```

### 3. 資料匯出
```javascript
// 匯出選中資料
const exportSelected = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('請先選擇要匯出的資料')
    return
  }
  
  // 構造匯出資料
  const exportData = selectedRows.value.map(row => ({
    姓名: row.name,
    郵箱: row.email,
    部門: row.department,
    職位: row.position
  }))
  
  // 執行匯出
  exportToExcel(exportData, '使用者資料.xlsx')
  ElMessage.success(`已匯出 ${selectedRows.value.length} 條資料`)
}
```

## 最佳實踐

1. **選擇約束**: 合理設定 `selectable` 函式，避免使用者選擇不應該操作的資料
2. **狀態同步**: 確保選中狀態與實際資料保持同步
3. **批次確認**: 批次操作前進行二次確認，特別是刪除等危險操作
4. **操作反饋**: 及時給使用者反饋批次操作的結果
5. **效能考慮**: 大量資料時考慮虛擬滾動或分頁處理

## 注意事項

- 選擇狀態不會自動儲存，頁面重新整理後會丟失
- 跨頁選擇需要特殊處理，可使用 `reserveSelection` 屬性
- 批次操作時要考慮網路異常和部分失敗的情況
- 選擇約束函式會在每次渲染時呼叫，避免複雜計算