<script setup lang="ts">
import { ref, h, computed } from 'vue'
import { ElMessage, ElButton, ElCard } from 'element-plus'
import type { MaFormExpose } from "@mineadmin/form"

// 嵌套表单数据模型 - 展示层级结构的复杂数据
const formData = ref({
  // 用户基本信息
  userInfo: {
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138000'
  },
  
  // 公司信息
  companyInfo: {
    name: 'MineAdmin科技有限公司',
    address: {
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      detail: '科技园南区'
    },
    departments: [
      {
        id: 1,
        name: '技术部',
        manager: '李四',
        budget: 100000,
        employees: [
          { name: '王五', position: '前端工程师', salary: 15000 },
          { name: '赵六', position: '后端工程师', salary: 18000 }
        ]
      },
      {
        id: 2,
        name: '产品部',
        manager: '孙七',
        budget: 80000,
        employees: [
          { name: '周八', position: '产品经理', salary: 20000 },
          { name: '吴九', position: 'UI设计师', salary: 12000 }
        ]
      }
    ]
  },
  
  // 项目配置
  projectSettings: {
    basic: {
      name: 'MineAdmin V3',
      version: '3.0.0',
      description: '企业级后台管理系统'
    },
    features: {
      multiLanguage: true,
      darkMode: true,
      mobileResponsive: true,
      permissions: ['read', 'write', 'delete']
    },
    database: {
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      config: {
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
        timezone: '+08:00'
      }
    }
  }
})

const formRef = ref<MaFormExpose>()

// 动态添加部门
const addDepartment = () => {
  const newId = Math.max(...formData.value.companyInfo.departments.map(d => d.id)) + 1
  formData.value.companyInfo.departments.push({
    id: newId,
    name: `新部门${newId}`,
    manager: '',
    budget: 50000,
    employees: []
  })
  ElMessage.success('添加部门成功')
}

// 删除部门
const removeDepartment = (index: number) => {
  formData.value.companyInfo.departments.splice(index, 1)
  ElMessage.success('删除部门成功')
}

// 添加员工
const addEmployee = (deptIndex: number) => {
  formData.value.companyInfo.departments[deptIndex].employees.push({
    name: '',
    position: '',
    salary: 10000
  })
  ElMessage.success('添加员工成功')
}

// 删除员工
const removeEmployee = (deptIndex: number, empIndex: number) => {
  formData.value.companyInfo.departments[deptIndex].employees.splice(empIndex, 1)
  ElMessage.success('删除员工成功')
}

// 计算总预算
const totalBudget = computed(() => {
  return formData.value.companyInfo.departments.reduce((sum, dept) => sum + dept.budget, 0)
})

// 嵌套表单项配置 - 使用 children 属性构建层级结构
const formItems = ref([
  // 用户信息分组
  {
    label: '用户基本信息',
    prop: 'userInfo',
    render: 'group',
    renderProps: {
      title: '用户基本信息',
      collapsible: true,
      defaultExpanded: true
    },
    children: [
      {
        label: '姓名',
        prop: 'userInfo.name',
        render: 'input',
        renderProps: {
          placeholder: '请输入姓名',
          clearable: true
        },
        itemProps: {
          rules: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
        },
        cols: { span: 8 }
      },
      {
        label: '邮箱',
        prop: 'userInfo.email',
        render: 'input',
        renderProps: {
          type: 'email',
          placeholder: '请输入邮箱',
          clearable: true
        },
        itemProps: {
          rules: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
          ]
        },
        cols: { span: 8 }
      },
      {
        label: '手机号',
        prop: 'userInfo.phone',
        render: 'input',
        renderProps: {
          placeholder: '请输入手机号',
          clearable: true
        },
        itemProps: {
          rules: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
          ]
        },
        cols: { span: 8 }
      }
    ]
  },
  
  // 公司信息分组
  {
    label: '公司信息',
    prop: 'companyInfo',
    render: 'group',
    renderProps: {
      title: '公司信息',
      collapsible: true,
      defaultExpanded: true
    },
    children: [
      {
        label: '公司名称',
        prop: 'companyInfo.name',
        render: 'input',
        renderProps: {
          placeholder: '请输入公司名称',
          clearable: true
        },
        itemProps: {
          rules: [{ required: true, message: '请输入公司名称', trigger: 'blur' }]
        },
        cols: { span: 24 }
      },
      
      // 地址嵌套分组
      {
        label: '公司地址',
        prop: 'companyInfo.address',
        render: 'group',
        renderProps: {
          title: '详细地址',
          size: 'small'
        },
        children: [
          {
            label: '省份',
            prop: 'companyInfo.address.province',
            render: 'select',
            renderProps: {
              placeholder: '请选择省份',
              clearable: true,
              options: [
                { label: '广东省', value: '广东省' },
                { label: '北京市', value: '北京市' },
                { label: '上海市', value: '上海市' },
                { label: '浙江省', value: '浙江省' }
              ]
            },
            cols: { span: 6 }
          },
          {
            label: '城市',
            prop: 'companyInfo.address.city',
            render: 'select',
            renderProps: {
              placeholder: '请选择城市',
              clearable: true,
              options: [
                { label: '深圳市', value: '深圳市' },
                { label: '广州市', value: '广州市' },
                { label: '东莞市', value: '东莞市' }
              ]
            },
            cols: { span: 6 }
          },
          {
            label: '区县',
            prop: 'companyInfo.address.district',
            render: 'select',
            renderProps: {
              placeholder: '请选择区县',
              clearable: true,
              options: [
                { label: '南山区', value: '南山区' },
                { label: '福田区', value: '福田区' },
                { label: '罗湖区', value: '罗湖区' }
              ]
            },
            cols: { span: 6 }
          },
          {
            label: '详细地址',
            prop: 'companyInfo.address.detail',
            render: 'input',
            renderProps: {
              placeholder: '请输入详细地址',
              clearable: true
            },
            cols: { span: 6 }
          }
        ]
      }
    ]
  },
  
  // 项目配置分组
  {
    label: '项目设置',
    prop: 'projectSettings',
    render: 'group',
    renderProps: {
      title: '项目配置',
      collapsible: true,
      defaultExpanded: true
    },
    children: [
      // 基础配置子分组
      {
        label: '基础信息',
        prop: 'projectSettings.basic',
        render: 'group',
        renderProps: {
          title: '基础配置',
          size: 'small'
        },
        children: [
          {
            label: '项目名称',
            prop: 'projectSettings.basic.name',
            render: 'input',
            renderProps: {
              placeholder: '请输入项目名称',
              clearable: true
            },
            cols: { span: 8 }
          },
          {
            label: '版本号',
            prop: 'projectSettings.basic.version',
            render: 'input',
            renderProps: {
              placeholder: '请输入版本号',
              clearable: true
            },
            cols: { span: 8 }
          },
          {
            label: '项目描述',
            prop: 'projectSettings.basic.description',
            render: 'input',
            renderProps: {
              type: 'textarea',
              placeholder: '请输入项目描述',
              rows: 3
            },
            cols: { span: 8 }
          }
        ]
      },
      
      // 功能配置子分组
      {
        label: '功能设置',
        prop: 'projectSettings.features',
        render: 'group',
        renderProps: {
          title: '功能配置',
          size: 'small'
        },
        children: [
          {
            label: '多语言支持',
            prop: 'projectSettings.features.multiLanguage',
            render: 'switch',
            renderProps: {
              'active-text': '开启',
              'inactive-text': '关闭'
            },
            cols: { span: 6 }
          },
          {
            label: '暗黑模式',
            prop: 'projectSettings.features.darkMode',
            render: 'switch',
            renderProps: {
              'active-text': '支持',
              'inactive-text': '不支持'
            },
            cols: { span: 6 }
          },
          {
            label: '移动端适配',
            prop: 'projectSettings.features.mobileResponsive',
            render: 'switch',
            renderProps: {
              'active-text': '启用',
              'inactive-text': '禁用'
            },
            cols: { span: 6 }
          },
          {
            label: '权限类型',
            prop: 'projectSettings.features.permissions',
            render: 'checkboxGroup',
            renderProps: {
              options: [
                { label: '读取', value: 'read' },
                { label: '写入', value: 'write' },
                { label: '删除', value: 'delete' },
                { label: '管理', value: 'admin' }
              ]
            },
            cols: { span: 6 }
          }
        ]
      },
      
      // 数据库配置子分组
      {
        label: '数据库配置',
        prop: 'projectSettings.database',
        render: 'group',
        renderProps: {
          title: '数据库设置',
          size: 'small'
        },
        children: [
          {
            label: '数据库类型',
            prop: 'projectSettings.database.type',
            render: 'select',
            renderProps: {
              placeholder: '请选择数据库类型',
              clearable: true,
              options: [
                { label: 'MySQL', value: 'mysql' },
                { label: 'PostgreSQL', value: 'postgresql' },
                { label: 'SQLite', value: 'sqlite' },
                { label: 'MongoDB', value: 'mongodb' }
              ]
            },
            cols: { span: 6 }
          },
          {
            label: '主机地址',
            prop: 'projectSettings.database.host',
            render: 'input',
            renderProps: {
              placeholder: '请输入主机地址'
            },
            cols: { span: 9 }
          },
          {
            label: '端口',
            prop: 'projectSettings.database.port',
            render: 'inputNumber',
            renderProps: {
              min: 1,
              max: 65535,
              placeholder: '请输入端口号'
            },
            cols: { span: 9 }
          },
          
          // 数据库详细配置嵌套
          {
            label: '详细配置',
            prop: 'projectSettings.database.config',
            render: 'group',
            renderProps: {
              title: '高级选项',
              size: 'small'
            },
            children: [
              {
                label: '字符集',
                prop: 'projectSettings.database.config.charset',
                render: 'select',
                renderProps: {
                  placeholder: '请选择字符编码',
                  clearable: true,
                  options: [
                    { label: 'utf8mb4', value: 'utf8mb4' },
                    { label: 'utf8', value: 'utf8' },
                    { label: 'latin1', value: 'latin1' }
                  ]
                },
                cols: { span: 8 }
              },
              {
                label: '排序规则',
                prop: 'projectSettings.database.config.collation',
                render: 'input',
                renderProps: {
                  placeholder: '请输入排序规则'
                },
                cols: { span: 8 }
              },
              {
                label: '时区',
                prop: 'projectSettings.database.config.timezone',
                render: 'select',
                renderProps: {
                  placeholder: '请选择时区',
                  clearable: true,
                  options: [
                    { label: 'Asia/Shanghai (+08:00)', value: '+08:00' },
                    { label: 'UTC (+00:00)', value: '+00:00' },
                    { label: 'America/New_York (-05:00)', value: '-05:00' }
                  ]
                },
                cols: { span: 8 }
              }
            ]
          }
        ]
      }
    ]
  }
])

// 表单选项配置
const formOptions = ref({
  labelWidth: '140px',
  labelPosition: 'right',
  size: 'default',
  gutter: 20,
  justify: 'start',
  align: 'top'
})

// 验证嵌套表单
const validateNestedForm = async () => {
  try {
    formRef.value?.setLoadingState(true)
    
    // 模拟异步验证
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const isValid = await formRef.value?.getElFormRef()?.validate()
    
    if (isValid) {
      ElMessage.success({
        message: '嵌套表单验证通过！',
        duration: 2000
      })
      
      console.log('嵌套表单数据:', formData.value)
      console.log('总预算:', totalBudget.value)
    }
  } catch (error) {
    ElMessage.error('表单验证失败，请检查各层级的输入内容')
    console.error('验证错误:', error)
  } finally {
    formRef.value?.setLoadingState(false)
  }
}

// 重置嵌套表单
const resetNestedForm = () => {
  formRef.value?.getElFormRef()?.resetFields()
  ElMessage.info('嵌套表单已重置')
}

// 验证指定层级
const validateLevel = (prop: string) => {
  formRef.value?.getElFormRef()?.validateField(prop, (valid: boolean) => {
    if (valid) {
      ElMessage.success(`${prop} 层级验证通过`)
    } else {
      ElMessage.error(`${prop} 层级验证失败`)
    }
  })
}
</script>

<template>
  <div class="nested-forms-demo">
    <!-- 演示说明 -->
    <div class="demo-description">
      <h3>嵌套表单演示</h3>
      <p>展示 MaForm 的层级表单结构能力，支持多层嵌套的复杂数据结构，包括分组、子分组和动态列表等场景。</p>
      <div class="demo-features">
        <el-tag type="info" size="small">层级分组</el-tag>
        <el-tag type="success" size="small">嵌套验证</el-tag>
        <el-tag type="warning" size="small">动态列表</el-tag>
        <el-tag type="danger" size="small">复杂结构</el-tag>
        <el-tag size="small">数据联动</el-tag>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="statistics-panel">
      <el-card class="stat-card">
        <div class="stat-item">
          <span class="stat-label">部门总数：</span>
          <span class="stat-value">{{ formData.companyInfo.departments.length }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">员工总数：</span>
          <span class="stat-value">
            {{ formData.companyInfo.departments.reduce((sum, dept) => sum + dept.employees.length, 0) }}
          </span>
        </div>
        <div class="stat-item">
          <span class="stat-label">总预算：</span>
          <span class="stat-value">¥{{ totalBudget.toLocaleString() }}</span>
        </div>
      </el-card>
    </div>

    <!-- 嵌套表单 -->
    <ma-form 
      ref="formRef"
      v-model="formData" 
      :options="formOptions"
      :items="formItems"
    >
      <!-- 自定义底部操作栏 -->
      <template #footer>
        <div class="form-footer">
          <el-button @click="resetNestedForm">重置表单</el-button>
          <el-button @click="validateLevel('userInfo')">验证用户信息</el-button>
          <el-button @click="validateLevel('companyInfo')">验证公司信息</el-button>
          <el-button @click="validateLevel('projectSettings')">验证项目配置</el-button>
          <el-button type="primary" @click="validateNestedForm">提交表单</el-button>
        </div>
      </template>
    </ma-form>

    <!-- 动态部门管理 -->
    <div class="departments-management">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>部门管理</span>
            <el-button type="primary" size="small" @click="addDepartment">
              添加部门
            </el-button>
          </div>
        </template>
        
        <div class="departments-list">
          <el-card 
            v-for="(dept, deptIndex) in formData.companyInfo.departments" 
            :key="dept.id"
            class="department-card"
            shadow="hover"
          >
            <template #header>
              <div class="department-header">
                <span>{{ dept.name }}</span>
                <div class="department-actions">
                  <el-button 
                    type="success" 
                    size="small" 
                    @click="addEmployee(deptIndex)"
                  >
                    添加员工
                  </el-button>
                  <el-button 
                    type="danger" 
                    size="small" 
                    @click="removeDepartment(deptIndex)"
                  >
                    删除部门
                  </el-button>
                </div>
              </div>
            </template>
            
            <div class="department-info">
              <p><strong>负责人：</strong>{{ dept.manager }}</p>
              <p><strong>预算：</strong>¥{{ dept.budget.toLocaleString() }}</p>
              <p><strong>员工数量：</strong>{{ dept.employees.length }} 人</p>
              
              <div v-if="dept.employees.length > 0" class="employees-list">
                <h5>员工列表：</h5>
                <div class="employees-grid">
                  <div 
                    v-for="(emp, empIndex) in dept.employees" 
                    :key="empIndex"
                    class="employee-item"
                  >
                    <div class="employee-info">
                      <span class="emp-name">{{ emp.name || '未命名' }}</span>
                      <span class="emp-position">{{ emp.position || '未设置' }}</span>
                      <span class="emp-salary">¥{{ emp.salary.toLocaleString() }}</span>
                    </div>
                    <el-button 
                      type="danger" 
                      size="small" 
                      link
                      @click="removeEmployee(deptIndex, empIndex)"
                    >
                      删除
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </el-card>
    </div>

    <!-- 数据展示 -->
    <div class="data-display">
      <h4>当前嵌套表单数据：</h4>
      <pre class="data-json">{{ JSON.stringify(formData, null, 2) }}</pre>
    </div>
  </div>
</template>

<style scoped>
.nested-forms-demo {
  max-width: 1200px;
  margin: 0 auto;
}

.demo-description {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.demo-description h3 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 16px;
}

.demo-description p {
  margin: 0 0 12px 0;
  color: #606266;
  font-size: 14px;
}

.demo-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.statistics-panel {
  margin-bottom: 20px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.stat-card :deep(.el-card__body) {
  display: flex;
  justify-content: space-around;
  padding: 20px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 5px;
}

.stat-value {
  display: block;
  font-size: 20px;
  font-weight: bold;
}

.form-footer {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px 0;
  flex-wrap: wrap;
}

.departments-management {
  margin: 24px 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.departments-list {
  display: grid;
  gap: 16px;
}

.department-card {
  border-left: 4px solid #409EFF;
}

.department-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.department-actions {
  display: flex;
  gap: 8px;
}

.department-info p {
  margin: 8px 0;
  color: #606266;
}

.employees-list {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.employees-list h5 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 14px;
}

.employees-grid {
  display: grid;
  gap: 8px;
}

.employee-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f9f9f9;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.employee-info {
  display: flex;
  gap: 16px;
  align-items: center;
}

.emp-name {
  font-weight: 500;
  color: #303133;
}

.emp-position {
  color: #909399;
  font-size: 13px;
}

.emp-salary {
  color: #67c23a;
  font-weight: 500;
}

.data-display {
  margin-top: 24px;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border-left: 4px solid #409EFF;
}

.data-display h4 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 14px;
}

.data-json {
  background-color: #f4f4f5;
  padding: 12px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.5;
  color: #606266;
  overflow-x: auto;
  white-space: pre-wrap;
  max-height: 400px;
  overflow-y: auto;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .demo-features {
    justify-content: center;
  }
  
  .form-footer {
    flex-direction: column;
    align-items: center;
  }
  
  .form-footer .el-button {
    width: 100%;
    max-width: 200px;
  }
  
  .stat-card :deep(.el-card__body) {
    flex-direction: column;
    gap: 16px;
  }
  
  .department-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .department-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .employee-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .employee-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .data-json {
    font-size: 11px;
  }
}
</style>