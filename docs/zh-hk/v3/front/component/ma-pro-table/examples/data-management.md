# 數據管理

展示完整的CRUD操作，包含新增、編輯、刪除和數據聯動等功能。

<DemoPreview dir="demos/ma-pro-table-examples/data-management" />

## 功能特點

- **完整CRUD**：支持數據的增刪改查操作
- **表單聯動**：新增/編輯表單與表格數據聯動
- **數據統計**：實時統計數據指標
- **批量操作**：支持批量選擇和操作
- **狀態同步**：操作後自動刷新表格數據

## 數據操作面板

### 統計面板
```vue
<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span>數據操作面板</span>
        <el-space>
          <el-button type="primary" @click="showAddDialog">
            <el-icon><Plus /></el-icon>
            新增員工
          </el-button>
          <el-button type="success" @click="handleExportSelected">
            <el-icon><Download /></el-icon>
            導出選中
          </el-button>
        </el-space>
      </div>
    </template>
    
    <el-row :gutter="20">
      <el-col :span="6">
        <el-statistic title="總員工數" :value="statistics.total" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="在職人數" :value="statistics.active" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="平均薪資" :value="statistics.avgSalary" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="本月新增" :value="statistics.newThisMonth" />
      </el-col>
    </el-row>
  </el-card>
</template>
```

### 實時統計
```javascript
const statistics = computed(() => {
  const total = tableData.value.length
  const active = tableData.value.filter(item => item.status === 1).length
  const avgSalary = total > 0 ? Math.round(
    tableData.value.reduce((sum, item) => sum + item.salary, 0) / total
  ) : 0
  const newThisMonth = tableData.value.filter(item => {
    const createDate = new Date(item.createTime)
    const now = new Date()
    return createDate.getMonth() === now.getMonth() && 
           createDate.getFullYear() === now.getFullYear()
  }).length
  
  return { total, active, avgSalary, newThisMonth }
})
```

## 新增/編輯表單

### 表單組件
```vue
<template>
  <el-dialog 
    v-model="dialogVisible" 
    :title="editingEmployee ? '編輯員工' : '新增員工'"
    width="600px"
    destroy-on-close
  >
    <el-form 
      ref="formRef"
      :model="employeeForm" 
      :rules="formRules"
      label-width="100px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="employeeForm.name" placeholder="請輸入姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部門" prop="department">
            <el-select v-model="employeeForm.department" style="width: 100%">
              <el-option label="技術部" value="技術部" />
              <el-option label="產品部" value="產品部" />
              <!-- 更多選項... -->
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      
      <!-- 更多表單項... -->
    </el-form>
    
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSaveEmployee" :loading="saving">
        {{ editingEmployee ? '保存' : '新增' }}
      </el-button>
    </template>
  </el-dialog>
</template>
```

### 表單驗證
```javascript
const formRules = {
  name: [
    { required: true, message: '請輸入員工姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名長度在 2 到 10 個字符', trigger: 'blur' }
  ],
  department: [
    { required: true, message: '請選擇部門', trigger: 'change' }
  ],
  position: [
    { required: true, message: '請輸入職位', trigger: 'blur' }
  ],
  salary: [
    { required: true, message: '請輸入薪資', trigger: 'blur' },
    { type: 'number', min: 3000, max: 100000, message: '薪資範圍 3000-100000', trigger: 'blur' }
  ]
}
```

## CRUD 操作實現

### 新增操作
```javascript
const showAddDialog = () => {
  editingEmployee.value = null
  resetForm()
  dialogVisible.value = true
}

const handleSaveEmployee = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    saving.value = true
    
    // 模擬API調用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (editingEmployee.value) {
      // 編輯模式
      const index = tableData.value.findIndex(item => item.id === editingEmployee.value.id)
      if (index !== -1) {
        tableData.value[index] = { ...employeeForm }
      }
      ElMessage.success('員工信息更新成功')
    } else {
      // 新增模式
      const newId = Math.max(...tableData.value.map(item => item.id), 0) + 1
      tableData.value.push({ ...employeeForm, id: newId })
      ElMessage.success('員工添加成功')
    }
    
    dialogVisible.value = false
    await tableRef.value?.refresh()
    
  } catch (error) {
    console.error('保存失敗:', error)
  } finally {
    saving.value = false
  }
}
```

### 編輯操作
```javascript
const showEditDialog = (employee) => {
  editingEmployee.value = employee
  Object.assign(employeeForm, {
    ...employee,
    skills: employee.skills || []
  })
  dialogVisible.value = true
}

// 在操作列中配置編輯按鈕
{
  name: 'edit',
  text: '編輯',
  onClick: (data) => {
    showEditDialog(data.row)
  }
}
```

### 刪除操作
```javascript
const handleDeleteEmployee = (employee) => {
  ElMessageBox.confirm(`確定要刪除員工"${employee.name}"嗎？`, '刪除確認', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = tableData.value.findIndex(item => item.id === employee.id)
    if (index !== -1) {
      tableData.value.splice(index, 1)
      ElMessage.success('員工刪除成功')
      tableRef.value?.refresh()
    }
  })
}

// 在操作列中配置刪除按鈕
{
  name: 'delete',
  text: '刪除',
  onClick: (data) => {
    handleDeleteEmployee(data.row)
  },
  linkProps: {
    type: 'danger'
  }
}
```

### 查看操作
```javascript
const showEmployeeDetail = (employee) => {
  ElNotification({
    title: '員工詳情',
    message: `
      姓名: ${employee.name}
      部門: ${employee.department}
      職位: ${employee.position}
      薪資: ￥${employee.salary.toLocaleString()}
    `,
    type: 'info',
    duration: 5000
  })
}

// 在操作列中配置查看按鈕
{
  name: 'view',
  text: '查看',
  onClick: (data) => {
    showEmployeeDetail(data.row)
  }
}
```

## 批量操作

### 啓用多選
```javascript
const options = {
  tableOptions: {
    selection: true         // 開啓多選功能
  }
}
```

### 批量導出
```javascript
const handleExportSelected = () => {
  const selectedRows = tableRef.value?.getTableRef?.()?.getSelectionRows?.()
  if (!selectedRows?.length) {
    ElMessage.warning('請先選擇要導出的數據')
    return
  }
  
  console.log('導出數據:', selectedRows)
  ElMessage.success(`導出 ${selectedRows.length} 條記錄`)
}
```

### 批量刪除
```javascript
const handleBatchDelete = () => {
  const selectedRows = tableRef.value?.getTableRef?.()?.getSelectionRows?.()
  if (!selectedRows?.length) {
    ElMessage.warning('請先選擇要刪除的數據')
    return
  }
  
  ElMessageBox.confirm(`確定要刪除選中的 ${selectedRows.length} 條記錄嗎？`, '批量刪除', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const selectedIds = selectedRows.map(row => row.id)
    tableData.value = tableData.value.filter(item => !selectedIds.includes(item.id))
    ElMessage.success('批量刪除成功')
    tableRef.value?.refresh()
  })
}
```

## 數據聯動

### 搜索事件處理
```javascript
const handleSearchSubmit = (form) => {
  console.log('搜索條件:', form)
  ElMessage.info('執行搜索操作')
  // 可以在這裏處理搜索邏輯
  return form
}

const handleSearchReset = (form) => {
  console.log('重置搜索:', form)
  ElMessage.info('重置搜索條件')
  return form
}
```

### 表格刷新
```javascript
const refreshTableData = async () => {
  try {
    await tableRef.value?.refresh()
    ElMessage.success('數據刷新成功')
  } catch (error) {
    ElMessage.error('數據刷新失敗')
  }
}
```

## 高級功能

### 表單狀態管理
```javascript
const resetForm = () => {
  Object.assign(employeeForm, {
    id: 0,
    name: '',
    department: '',
    position: '',
    salary: 8000,
    status: 1,
    createTime: '',
    skills: [],
    remark: ''
  })
  
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}
```

### 數據校驗
```javascript
const validateFormData = (data) => {
  const errors = []
  
  if (!data.name?.trim()) {
    errors.push('姓名不能為空')
  }
  
  if (data.salary < 3000 || data.salary > 100000) {
    errors.push('薪資範圍不合法')
  }
  
  if (errors.length > 0) {
    ElMessage.error(errors.join(', '))
    return false
  }
  
  return true
}
```

### 數據持久化
```javascript
const saveDataToStorage = (data) => {
  try {
    localStorage.setItem('employee-data', JSON.stringify(data))
  } catch (error) {
    console.error('保存到本地存儲失敗:', error)
  }
}

const loadDataFromStorage = () => {
  try {
    const data = localStorage.getItem('employee-data')
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('從本地存儲加載失敗:', error)
    return []
  }
}
```

## 最佳實踐

### 1. 表單設計
- 合理分組表單字段
- 提供清晰的驗證提示
- 支持鍵盤快捷操作

### 2. 數據管理
- 及時同步表格和表單數據
- 提供數據備份和恢復功能
- 實現樂觀鎖避免數據衝突

### 3. 用户體驗
- 提供操作確認和撤銷功能
- 顯示操作進度和狀態
- 合理的錯誤處理和提示

### 4. 性能優化
- 大數據量時考慮分頁和虛擬滾動
- 避免頻繁的數據刷新
- 合理使用防抖和節流

數據管理功能讓你可以構建完整的數據操作界面，滿足各種業務場景的數據管理需求。