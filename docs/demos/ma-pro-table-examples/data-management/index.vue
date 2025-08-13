<template>
  <div class="demo-data-management">
    <h3>数据管理</h3>
    <p>展示完整的CRUD操作，包含新增、编辑、删除和数据联动等功能。</p>
    
    <!-- 数据操作面板 -->
    <div class="management-panel">
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
            <el-statistic title="平均薪资" :value="statistics.avgSalary" :formatter="salaryFormatter" />
          </el-col>
          <el-col :span="6">
            <el-statistic title="本月新增" :value="statistics.newThisMonth" />
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <MaProTable 
      ref="tableRef" 
      :options="options" 
      :schema="schema"
      @search-submit="handleSearchSubmit"
      @search-reset="handleSearchReset"
    />
    
    <!-- 新增/编辑对话框 -->
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
              <el-select v-model="employeeForm.department" placeholder="请选择部门" style="width: 100%">
                <el-option label="技术部" value="技术部" />
                <el-option label="产品部" value="产品部" />
                <el-option label="设计部" value="设计部" />
                <el-option label="运营部" value="运营部" />
                <el-option label="财务部" value="财务部" />
                <el-option label="人事部" value="人事部" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="职位" prop="position">
              <el-input v-model="employeeForm.position" placeholder="请输入职位" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="薪资" prop="salary">
              <el-input-number 
                v-model="employeeForm.salary" 
                :min="3000" 
                :max="100000" 
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="employeeForm.status">
                <el-radio :label="1">在职</el-radio>
                <el-radio :label="0">离职</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入职时间" prop="createTime">
              <el-date-picker
                v-model="employeeForm.createTime"
                type="date"
                placeholder="选择入职时间"
                style="width: 100%"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="技能标签" prop="skills">
          <el-select 
            v-model="employeeForm.skills" 
            multiple 
            placeholder="请选择技能标签"
            style="width: 100%"
          >
            <el-option label="Vue" value="Vue" />
            <el-option label="React" value="React" />
            <el-option label="TypeScript" value="TypeScript" />
            <el-option label="Java" value="Java" />
            <el-option label="Python" value="Python" />
            <el-option label="UI设计" value="UI设计" />
            <el-option label="产品设计" value="产品设计" />
            <el-option label="数据分析" value="数据分析" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="备注">
          <el-input 
            v-model="employeeForm.remark" 
            type="textarea" 
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveEmployee" :loading="saving">
            {{ editingEmployee ? '保存' : '新增' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx">
import { ref, reactive, computed, nextTick } from 'vue'
import type { MaProTableExpose, MaProTableOptions, MaProTableSchema } from "@mineadmin/pro-table"
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { Plus, Download, Edit, Delete, View } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const tableRef = ref<MaProTableExpose>()
const formRef = ref<FormInstance>()
const dialogVisible = ref(false)
const saving = ref(false)
const editingEmployee = ref<any>(null)
const tableData = ref<any[]>([])

// 员工表单
const employeeForm = reactive({
  id: 0,
  name: '',
  department: '',
  position: '',
  salary: 8000,
  status: 1,
  createTime: '',
  skills: [] as string[],
  remark: ''
})

// 表单验证规则
const formRules: FormRules = {
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
  ],
  createTime: [
    { required: true, message: '请选择入职时间', trigger: 'change' }
  ]
}

// 统计数据
const statistics = computed(() => {
  const total = tableData.value.length
  const active = tableData.value.filter(item => item.status === 1).length
  const avgSalary = total > 0 ? Math.round(tableData.value.reduce((sum, item) => sum + item.salary, 0) / total) : 0
  const newThisMonth = tableData.value.filter(item => {
    const createDate = new Date(item.createTime)
    const now = new Date()
    return createDate.getMonth() === now.getMonth() && createDate.getFullYear() === now.getFullYear()
  }).length
  
  return { total, active, avgSalary, newThisMonth }
})

// 薪资格式化
const salaryFormatter = (value: number) => `￥${value.toLocaleString()}`

// 对话框操作
const showAddDialog = () => {
  editingEmployee.value = null
  resetForm()
  dialogVisible.value = true
}

const showEditDialog = (employee: any) => {
  editingEmployee.value = employee
  Object.assign(employeeForm, {
    ...employee,
    skills: employee.skills || []
  })
  dialogVisible.value = true
}

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

const handleSaveEmployee = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    saving.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (editingEmployee.value) {
      // 编辑
      const index = tableData.value.findIndex(item => item.id === editingEmployee.value.id)
      if (index !== -1) {
        tableData.value[index] = { ...employeeForm }
      }
      ElMessage.success('员工信息更新成功')
    } else {
      // 新增
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

// 删除员工
const handleDeleteEmployee = (employee: any) => {
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

// 批量操作
const handleExportSelected = () => {
  ElMessage.success('导出选中员工数据')
}

// 搜索事件
const handleSearchSubmit = (form: any) => {
  console.log('搜索条件:', form)
  ElMessage.info('执行搜索操作')
  return form
}

const handleSearchReset = (form: any) => {
  console.log('重置搜索:', form)
  ElMessage.info('重置搜索条件')
  return form
}

// 模拟 API 接口
const getManagementList = async (params: any) => {
  console.log('数据管理参数:', params)
  
  const data = [
    { 
      id: 1, 
      name: '张三', 
      department: '技术部', 
      position: '前端工程师', 
      salary: 15000, 
      status: 1, 
      createTime: '2024-01-15',
      skills: ['Vue', 'TypeScript', 'React'],
      remark: '技术能力突出，工作认真负责'
    },
    { 
      id: 2, 
      name: '李四', 
      department: '产品部', 
      position: '产品经理', 
      salary: 18000, 
      status: 1, 
      createTime: '2024-01-16',
      skills: ['产品设计', '数据分析'],
      remark: '具有丰富的产品设计经验'
    },
    { 
      id: 3, 
      name: '王五', 
      department: '设计部', 
      position: 'UI设计师', 
      salary: 12000, 
      status: 0, 
      createTime: '2024-01-17',
      skills: ['UI设计', 'Figma'],
      remark: '设计风格独特，创意丰富'
    },
    { 
      id: 4, 
      name: '赵六', 
      department: '技术部', 
      position: '后端工程师', 
      salary: 16000, 
      status: 1, 
      createTime: '2024-01-18',
      skills: ['Java', 'Spring', 'MySQL'],
      remark: '后端技术扎实，系统架构能力强'
    },
    { 
      id: 5, 
      name: '孙七', 
      department: '运营部', 
      position: '运营专员', 
      salary: 10000, 
      status: 1, 
      createTime: '2024-01-19',
      skills: ['数据分析', '用户运营'],
      remark: '运营策略清晰，执行力强'
    }
  ]
  
  // 更新组件数据
  tableData.value = data
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          list: data,
          total: data.length
        }
      })
    }, 500)
  })
}

// 组件配置
const options = reactive<MaProTableOptions>({
  requestOptions: {
    api: getManagementList,
    autoRequest: true,
    response: {
      totalKey: 'data.total',
      dataKey: 'data.list'
    }
  },
  tableOptions: {
    adaption: true,
    pagination: {
      total: 0,
      pageSize: 10
    },
    selection: true
  },
  header: {
    show: true,
    mainTitle: '员工数据管理',
    subTitle: '完整的CRUD操作示例'
  }
})

// 表格架构
const schema = reactive<MaProTableSchema>({
  searchItems: [
    {
      label: '姓名',
      prop: 'name',
      render: 'input',
      renderProps: {
        placeholder: '请输入姓名'
      }
    },
    {
      label: '部门',
      prop: 'department',
      render: 'select',
      renderProps: {
        options: [
          { label: '技术部', value: '技术部' },
          { label: '产品部', value: '产品部' },
          { label: '设计部', value: '设计部' },
          { label: '运营部', value: '运营部' },
          { label: '财务部', value: '财务部' },
          { label: '人事部', value: '人事部' }
        ]
      }
    },
    {
      label: '状态',
      prop: 'status',
      render: 'select',
      renderProps: {
        options: [
          { label: '在职', value: 1 },
          { label: '离职', value: 0 }
        ]
      }
    },
    {
      label: '薪资范围',
      prop: 'salaryRange',
      render: 'input-number-range',
      renderProps: {
        startPlaceholder: '最低薪资',
        endPlaceholder: '最高薪资'
      }
    }
  ],
  tableColumns: [
    { label: 'ID', prop: 'id', width: 60 },
    { label: '姓名', prop: 'name', width: 100 },
    { label: '部门', prop: 'department', width: 100 },
    { label: '职位', prop: 'position', width: 150 },
    { 
      label: '薪资', 
      prop: 'salary', 
      width: 120, 
      formatter: (row: any) => `￥${row.salary.toLocaleString()}`,
      sortable: true
    },
    { 
      label: '技能标签', 
      prop: 'skills', 
      width: 200,
      cellRender: ({ row }: any) => (
        <div>
          {(row.skills || []).map((skill: string, index: number) => (
            <el-tag key={index} size="small" style="margin-right: 4px; margin-bottom: 2px;">
              {skill}
            </el-tag>
          ))}
        </div>
      )
    },
    { 
      label: '状态', 
      prop: 'status', 
      width: 80,
      cellRenderTo: {
        name: 'tag',
        props: (data: any) => ({
          type: data.row.status === 1 ? 'success' : 'info'
        })
      },
      formatter: (row: any) => row.status === 1 ? '在职' : '离职'
    },
    { label: '入职时间', prop: 'createTime', width: 120 },
    { label: '备注', prop: 'remark', width: 200, showOverflowTooltip: true },
    {
      type: 'operation',
      label: '操作',
      width: 220,
      fixed: 'right',
      operationConfigure: {
        type: 'tile',
        actions: [
          {
            name: 'view',
            text: '查看',
            icon: 'view',
            onClick: (data: any) => {
              ElNotification({
                title: '员工详情',
                message: `姓名: ${data.row.name}\n部门: ${data.row.department}\n职位: ${data.row.position}\n薪资: ￥${data.row.salary.toLocaleString()}`,
                type: 'info',
                duration: 5000
              })
            }
          },
          {
            name: 'edit',
            text: '编辑',
            icon: 'edit',
            onClick: (data: any) => {
              showEditDialog(data.row)
            },
            linkProps: {
              type: 'primary'
            }
          },
          {
            name: 'delete',
            text: '删除',
            icon: 'delete',
            onClick: (data: any) => {
              handleDeleteEmployee(data.row)
            },
            linkProps: {
              type: 'danger'
            }
          }
        ]
      }
    }
  ]
})
</script>

<style scoped>
.demo-data-management {
  padding: 20px;
}

.demo-data-management h3 {
  margin-bottom: 8px;
  color: #333;
}

.demo-data-management p {
  margin-bottom: 16px;
  color: #666;
  font-size: 14px;
}

.management-panel {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>