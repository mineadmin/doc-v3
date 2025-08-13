# 数据管理

展示完整的CRUD操作，包含新增、编辑、删除和数据联动等功能。

<DemoPreview dir="demos/ma-pro-table-examples/data-management" />

## 功能特点

- **完整CRUD**：支持数据的增删改查操作
- **表单联动**：新增/编辑表单与表格数据联动
- **数据统计**：实时统计数据指标
- **批量操作**：支持批量选择和操作
- **状态同步**：操作后自动刷新表格数据

## 数据操作面板

### 统计面板
```vue
<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span>数据操作面板</span>
        <el-space>
          <el-button type="primary" @click="showAddDialog">
            <el-icon><Plus /></el-icon>
            新增员工
          </el-button>
          <el-button type="success" @click="handleExportSelected">
            <el-icon><Download /></el-icon>
            导出选中
          </el-button>
        </el-space>
      </div>
    </template>
    
    <el-row :gutter="20">
      <el-col :span="6">
        <el-statistic title="总员工数" :value="statistics.total" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="在职人数" :value="statistics.active" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="平均薪资" :value="statistics.avgSalary" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="本月新增" :value="statistics.newThisMonth" />
      </el-col>
    </el-row>
  </el-card>
</template>
```

### 实时统计
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

## 新增/编辑表单

### 表单组件
```vue
<template>
  <el-dialog 
    v-model="dialogVisible" 
    :title="editingEmployee ? '编辑员工' : '新增员工'"
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
            <el-input v-model="employeeForm.name" placeholder="请输入姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门" prop="department">
            <el-select v-model="employeeForm.department" style="width: 100%">
              <el-option label="技术部" value="技术部" />
              <el-option label="产品部" value="产品部" />
              <!-- 更多选项... -->
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      
      <!-- 更多表单项... -->
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

### 表单验证
```javascript
const formRules = {
  name: [
    { required: true, message: '请输入员工姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  department: [
    { required: true, message: '请选择部门', trigger: 'change' }
  ],
  position: [
    { required: true, message: '请输入职位', trigger: 'blur' }
  ],
  salary: [
    { required: true, message: '请输入薪资', trigger: 'blur' },
    { type: 'number', min: 3000, max: 100000, message: '薪资范围 3000-100000', trigger: 'blur' }
  ]
}
```

## CRUD 操作实现

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
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (editingEmployee.value) {
      // 编辑模式
      const index = tableData.value.findIndex(item => item.id === editingEmployee.value.id)
      if (index !== -1) {
        tableData.value[index] = { ...employeeForm }
      }
      ElMessage.success('员工信息更新成功')
    } else {
      // 新增模式
      const newId = Math.max(...tableData.value.map(item => item.id), 0) + 1
      tableData.value.push({ ...employeeForm, id: newId })
      ElMessage.success('员工添加成功')
    }
    
    dialogVisible.value = false
    await tableRef.value?.refresh()
    
  } catch (error) {
    console.error('保存失败:', error)
  } finally {
    saving.value = false
  }
}
```

### 编辑操作
```javascript
const showEditDialog = (employee) => {
  editingEmployee.value = employee
  Object.assign(employeeForm, {
    ...employee,
    skills: employee.skills || []
  })
  dialogVisible.value = true
}

// 在操作列中配置编辑按钮
{
  name: 'edit',
  text: '编辑',
  onClick: (data) => {
    showEditDialog(data.row)
  }
}
```

### 删除操作
```javascript
const handleDeleteEmployee = (employee) => {
  ElMessageBox.confirm(`确定要删除员工"${employee.name}"吗？`, '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = tableData.value.findIndex(item => item.id === employee.id)
    if (index !== -1) {
      tableData.value.splice(index, 1)
      ElMessage.success('员工删除成功')
      tableRef.value?.refresh()
    }
  })
}

// 在操作列中配置删除按钮
{
  name: 'delete',
  text: '删除',
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
    title: '员工详情',
    message: `
      姓名: ${employee.name}
      部门: ${employee.department}
      职位: ${employee.position}
      薪资: ￥${employee.salary.toLocaleString()}
    `,
    type: 'info',
    duration: 5000
  })
}

// 在操作列中配置查看按钮
{
  name: 'view',
  text: '查看',
  onClick: (data) => {
    showEmployeeDetail(data.row)
  }
}
```

## 批量操作

### 启用多选
```javascript
const options = {
  tableOptions: {
    selection: true         // 开启多选功能
  }
}
```

### 批量导出
```javascript
const handleExportSelected = () => {
  const selectedRows = tableRef.value?.getTableRef?.()?.getSelectionRows?.()
  if (!selectedRows?.length) {
    ElMessage.warning('请先选择要导出的数据')
    return
  }
  
  console.log('导出数据:', selectedRows)
  ElMessage.success(`导出 ${selectedRows.length} 条记录`)
}
```

### 批量删除
```javascript
const handleBatchDelete = () => {
  const selectedRows = tableRef.value?.getTableRef?.()?.getSelectionRows?.()
  if (!selectedRows?.length) {
    ElMessage.warning('请先选择要删除的数据')
    return
  }
  
  ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.length} 条记录吗？`, '批量删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const selectedIds = selectedRows.map(row => row.id)
    tableData.value = tableData.value.filter(item => !selectedIds.includes(item.id))
    ElMessage.success('批量删除成功')
    tableRef.value?.refresh()
  })
}
```

## 数据联动

### 搜索事件处理
```javascript
const handleSearchSubmit = (form) => {
  console.log('搜索条件:', form)
  ElMessage.info('执行搜索操作')
  // 可以在这里处理搜索逻辑
  return form
}

const handleSearchReset = (form) => {
  console.log('重置搜索:', form)
  ElMessage.info('重置搜索条件')
  return form
}
```

### 表格刷新
```javascript
const refreshTableData = async () => {
  try {
    await tableRef.value?.refresh()
    ElMessage.success('数据刷新成功')
  } catch (error) {
    ElMessage.error('数据刷新失败')
  }
}
```

## 高级功能

### 表单状态管理
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

### 数据校验
```javascript
const validateFormData = (data) => {
  const errors = []
  
  if (!data.name?.trim()) {
    errors.push('姓名不能为空')
  }
  
  if (data.salary < 3000 || data.salary > 100000) {
    errors.push('薪资范围不合法')
  }
  
  if (errors.length > 0) {
    ElMessage.error(errors.join(', '))
    return false
  }
  
  return true
}
```

### 数据持久化
```javascript
const saveDataToStorage = (data) => {
  try {
    localStorage.setItem('employee-data', JSON.stringify(data))
  } catch (error) {
    console.error('保存到本地存储失败:', error)
  }
}

const loadDataFromStorage = () => {
  try {
    const data = localStorage.getItem('employee-data')
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('从本地存储加载失败:', error)
    return []
  }
}
```

## 最佳实践

### 1. 表单设计
- 合理分组表单字段
- 提供清晰的验证提示
- 支持键盘快捷操作

### 2. 数据管理
- 及时同步表格和表单数据
- 提供数据备份和恢复功能
- 实现乐观锁避免数据冲突

### 3. 用户体验
- 提供操作确认和撤销功能
- 显示操作进度和状态
- 合理的错误处理和提示

### 4. 性能优化
- 大数据量时考虑分页和虚拟滚动
- 避免频繁的数据刷新
- 合理使用防抖和节流

数据管理功能让你可以构建完整的数据操作界面，满足各种业务场景的数据管理需求。