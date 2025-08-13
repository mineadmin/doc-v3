# Data Management

Demonstrates complete CRUD operations including create, edit, delete, and data linkage.

<DemoPreview dir="demos/ma-pro-table-examples/data-management" />

## Key Features

- **Complete CRUD**: Supports create, read, update, and delete operations
- **Form Linkage**: New/edit forms synchronize with table data
- **Data Statistics**: Real-time statistical indicators
- **Batch Operations**: Supports batch selection and operations
- **Status Synchronization**: Automatically refreshes table data after operations

## Data Operation Panel

### Statistics Panel
```vue
<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span>Data Operation Panel</span>
        <el-space>
          <el-button type="primary" @click="showAddDialog">
            <el-icon><Plus /></el-icon>
            Add Employee
          </el-button>
          <el-button type="success" @click="handleExportSelected">
            <el-icon><Download /></el-icon>
            Export Selected
          </el-button>
        </el-space>
      </div>
    </template>
    
    <el-row :gutter="20">
      <el-col :span="6">
        <el-statistic title="Total Employees" :value="statistics.total" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="Active Employees" :value="statistics.active" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="Average Salary" :value="statistics.avgSalary" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="New This Month" :value="statistics.newThisMonth" />
      </el-col>
    </el-row>
  </el-card>
</template>
```

### Real-time Statistics
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

## Add/Edit Form

### Form Component
```vue
<template>
  <el-dialog 
    v-model="dialogVisible" 
    :title="editingEmployee ? 'Edit Employee' : 'Add Employee'"
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
          <el-form-item label="Name" prop="name">
            <el-input v-model="employeeForm.name" placeholder="Enter name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Department" prop="department">
            <el-select v-model="employeeForm.department" style="width: 100%">
              <el-option label="Technology" value="Technology" />
              <el-option label="Product" value="Product" />
              <!-- More options... -->
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      
      <!-- More form items... -->
    </el-form>
    
    <template #footer>
      <el-button @click="dialogVisible = false">Cancel</el-button>
      <el-button type="primary" @click="handleSaveEmployee" :loading="saving">
        {{ editingEmployee ? 'Save' : 'Add' }}
      </el-button>
    </template>
  </el-dialog>
</template>
```

### Form Validation
```javascript
const formRules = {
  name: [
    { required: true, message: 'Please enter employee name', trigger: 'blur' },
    { min: 2, max: 10, message: 'Name length should be 2-10 characters', trigger: 'blur' }
  ],
  department: [
    { required: true, message: 'Please select department', trigger: 'change' }
  ],
  position: [
    { required: true, message: 'Please enter position', trigger: 'blur' }
  ],
  salary: [
    { required: true, message: 'Please enter salary', trigger: 'blur' },
    { type: 'number', min: 3000, max: 100000, message: 'Salary range 3000-100000', trigger: 'blur' }
  ]
}
```

## CRUD Implementation

### Create Operation
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
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (editingEmployee.value) {
      // Edit mode
      const index = tableData.value.findIndex(item => item.id === editingEmployee.value.id)
      if (index !== -1) {
        tableData.value[index] = { ...employeeForm }
      }
      ElMessage.success('Employee updated successfully')
    } else {
      // Add mode
      const newId = Math.max(...tableData.value.map(item => item.id), 0) + 1
      tableData.value.push({ ...employeeForm, id: newId })
      ElMessage.success('Employee added successfully')
    }
    
    dialogVisible.value = false
    await tableRef.value?.refresh()
    
  } catch (error) {
    console.error('Save failed:', error)
  } finally {
    saving.value = false
  }
}
```

### Edit Operation
```javascript
const showEditDialog = (employee) => {
  editingEmployee.value = employee
  Object.assign(employeeForm, {
    ...employee,
    skills: employee.skills || []
  })
  dialogVisible.value = true
}

// Configure edit button in action column
{
  name: 'edit',
  text: 'Edit',
  onClick: (data) => {
    showEditDialog(data.row)
  }
}
```

### Delete Operation
```javascript
const handleDeleteEmployee = (employee) => {
  ElMessageBox.confirm(`Are you sure to delete employee "${employee.name}"?`, 'Delete Confirmation', {
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(() => {
    const index = tableData.value.findIndex(item => item.id === employee.id)
    if (index !== -1) {
      tableData.value.splice(index, 1)
      ElMessage.success('Employee deleted successfully')
      tableRef.value?.refresh()
    }
  })
}

// Configure delete button in action column
{
  name: 'delete',
  text: 'Delete',
  onClick: (data) => {
    handleDeleteEmployee(data.row)
  },
  linkProps: {
    type: 'danger'
  }
}
```

### View Operation
```javascript
const showEmployeeDetail = (employee) => {
  ElNotification({
    title: 'Employee Details',
    message: `
      Name: ${employee.name}
      Department: ${employee.department}
      Position: ${employee.position}
      Salary: $${employee.salary.toLocaleString()}
    `,
    type: 'info',
    duration: 5000
  })
}

// Configure view button in action column
{
  name: 'view',
  text: 'View',
  onClick: (data) => {
    showEmployeeDetail(data.row)
  }
}
```

## Batch Operations

### Enable Multi-selection
```javascript
const options = {
  tableOptions: {
    selection: true         // Enable multi-selection
  }
}
```

### Batch Export
```javascript
const handleExportSelected = () => {
  const selectedRows = tableRef.value?.getTableRef?.()?.getSelectionRows?.()
  if (!selectedRows?.length) {
    ElMessage.warning('Please select data to export first')
    return
  }
  
  console.log('Export data:', selectedRows)
  ElMessage.success(`Exported ${selectedRows.length} records`)
}
```

### Batch Delete
```javascript
const handleBatchDelete = () => {
  const selectedRows = tableRef.value?.getTableRef?.()?.getSelectionRows?.()
  if (!selectedRows?.length) {
    ElMessage.warning('Please select data to delete first')
    return
  }
  
  ElMessageBox.confirm(`Are you sure to delete ${selectedRows.length} selected records?`, 'Batch Delete', {
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(() => {
    const selectedIds = selectedRows.map(row => row.id)
    tableData.value = tableData.value.filter(item => !selectedIds.includes(item.id))
    ElMessage.success('Batch delete successful')
    tableRef.value?.refresh()
  })
}
```

## Data Linkage

### Search Event Handling
```javascript
const handleSearchSubmit = (form) => {
  console.log('Search criteria:', form)
  ElMessage.info('Performing search operation')
  // Handle search logic here
  return form
}

const handleSearchReset = (form) => {
  console.log('Reset search:', form)
  ElMessage.info('Search criteria reset')
  return form
}
```

### Table Refresh
```javascript
const refreshTableData = async () => {
  try {
    await tableRef.value?.refresh()
    ElMessage.success('Data refreshed successfully')
  } catch (error) {
    ElMessage.error('Data refresh failed')
  }
}
```

## Advanced Features

### Form State Management
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

### Data Validation
```javascript
const validateFormData = (data) => {
  const errors = []
  
  if (!data.name?.trim()) {
    errors.push('Name cannot be empty')
  }
  
  if (data.salary < 3000 || data.salary > 100000) {
    errors.push('Invalid salary range')
  }
  
  if (errors.length > 0) {
    ElMessage.error(errors.join(', '))
    return false
  }
  
  return true
}
```

### Data Persistence
```javascript
const saveDataToStorage = (data) => {
  try {
    localStorage.setItem('employee-data', JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save to local storage:', error)
  }
}

const loadDataFromStorage = () => {
  try {
    const data = localStorage.getItem('employee-data')
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Failed to load from local storage:', error)
    return []
  }
}
```

## Best Practices

### 1. Form Design
- Group form fields logically
- Provide clear validation prompts
- Support keyboard shortcuts

### 2. Data Management
- Synchronize table and form data promptly
- Provide data backup and recovery
- Implement optimistic locking to prevent conflicts

### 3. User Experience
- Provide operation confirmation and undo
- Display operation progress and status
- Proper error handling and prompts

### 4. Performance Optimization
- Consider pagination and virtual scrolling for large datasets
- Avoid frequent data refreshes
- Use debounce and throttle appropriately

The data management feature allows you to build complete data operation interfaces to meet various business scenario requirements.