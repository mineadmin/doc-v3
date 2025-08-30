<template>
  <div>
    <h3>表单验证</h3>
    <p>演示搜索表单的验证功能，包括必填项验证、格式验证、自定义验证规则等。</p>
    
    <div class="demo-section">
      <h4>基础验证</h4>
      <ma-search
        ref="basicValidationRef"
        :search-items="basicValidationItems"
        :form-options="basicFormOptions"
        @search="handleBasicSearch"
        @reset="handleReset"
      >
        <template #afterActions>
          <el-button type="info" @click="validateBasicForm">
            手动验证
          </el-button>
          <el-button type="warning" @click="clearBasicValidation">
            清空验证
          </el-button>
        </template>
      </ma-search>
    </div>

    <div class="demo-section">
      <h4>高级验证</h4>
      <ma-search
        ref="advancedValidationRef"
        :search-items="advancedValidationItems"
        :form-options="advancedFormOptions"
        @search="handleAdvancedSearch"
        @reset="handleReset"
      >
        <template #afterActions>
          <el-button type="info" @click="validateAdvancedForm">
            手动验证
          </el-button>
          <el-button type="warning" @click="clearAdvancedValidation">
            清空验证
          </el-button>
        </template>
      </ma-search>
    </div>

    <div class="demo-section">
      <h4>异步验证</h4>
      <ma-search
        ref="asyncValidationRef"
        :search-items="asyncValidationItems"
        :form-options="asyncFormOptions"
        @search="handleAsyncSearch"
        @reset="handleReset"
      >
        <template #afterActions>
          <el-button type="info" @click="validateAsyncForm">
            手动验证
          </el-button>
        </template>
      </ma-search>
    </div>

    <div class="demo-section">
      <h4>条件验证</h4>
      <p class="demo-tip">根据其他字段的值动态调整验证规则</p>
      <ma-search
        ref="conditionalValidationRef"
        :search-items="conditionalValidationItems"
        :form-options="conditionalFormOptions"
        @search="handleConditionalSearch"
        @reset="handleReset"
      />
    </div>

    <div v-if="validationLog.length" class="validation-log">
      <h4>验证日志</h4>
      <div class="log-content">
        <div v-for="(log, index) in validationLog" :key="index" class="log-item">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-type" :class="log.type">{{ log.type }}</span>
          <span class="log-message">{{ log.message }}</span>
          <pre v-if="log.data" class="log-data">{{ JSON.stringify(log.data, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { ref, reactive } from 'vue'
import type { MaSearchItem } from '@mineadmin/search'
import { ElMessage } from 'element-plus'

const basicValidationRef = ref<any>(null)
const advancedValidationRef = ref<any>(null)
const asyncValidationRef = ref<any>(null)
const conditionalValidationRef = ref<any>(null)

const validationLog = ref<Array<{
  time: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  data?: any
}>>([])

// 添加验证日志
const addValidationLog = (type: 'success' | 'error' | 'warning' | 'info', message: string, data?: any) => {
  validationLog.value.unshift({
    time: new Date().toLocaleTimeString(),
    type,
    message,
    data
  })
  if (validationLog.value.length > 20) {
    validationLog.value = validationLog.value.slice(0, 20)
  }
}

// 自定义验证器
const validatePhone = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback()
    return
  }
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(value)) {
    callback(new Error('请输入正确的手机号码格式'))
  } else {
    callback()
  }
}

const validateEmail = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback()
    return
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    callback(new Error('请输入正确的邮箱格式'))
  } else {
    callback()
  }
}

const validateAge = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback()
    return
  }
  if (value < 18 || value > 65) {
    callback(new Error('年龄必须在18-65岁之间'))
  } else {
    callback()
  }
}

// 异步验证用户名是否存在
const asyncValidateUsername = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback()
    return
  }
  
  // 模拟异步验证
  setTimeout(() => {
    const existingUsers = ['admin', 'root', 'test', 'demo']
    if (existingUsers.includes(value.toLowerCase())) {
      addValidationLog('error', '用户名验证失败', { username: value, reason: '用户名已存在' })
      callback(new Error('该用户名已存在'))
    } else {
      addValidationLog('success', '用户名验证通过', { username: value })
      callback()
    }
  }, 1000)
}

// 基础验证配置
const basicValidationItems = ref<MaSearchItem[]>([
  {
    label: '用户名',
    prop: 'username',
    render: 'input',
    renderProps: { placeholder: '请输入用户名' },
    itemProps: {
      rules: [
        {required: true, message: '用户名不能为空', trigger: 'blur'},
        {min: 3, max: 20, message: '用户名长度在3-20个字符', trigger: 'blur'}
      ]
    }
  },
  {
    label: '邮箱',
    prop: 'email',
    render: 'input',
    renderProps: { placeholder: '请输入邮箱地址' },
    itemProps: {
      rules: [
        { required: true, message: '邮箱不能为空', trigger: 'blur' },
        { validator: validateEmail, trigger: 'blur' }
      ]
    }
  },
  {
    label: '年龄',
    prop: 'age',
    render: () => <el-input-number />,
    renderProps: {
      min: 1,
      max: 120,
      placeholder: '请输入年龄'
    },
    itemProps: {
      rules: [
        {required: true, message: '年龄不能为空', trigger: 'blur'},
        {validator: validateAge, trigger: 'change'}
      ]
    }
  }
])

const basicFormOptions = {
  labelWidth: '100px',
  rules: {}
}

// 高级验证配置
const advancedValidationItems = ref<MaSearchItem[]>([
  {
    label: '手机号',
    prop: 'phone',
    render: 'input',
    renderProps: { placeholder: '请输入11位手机号' },
    itemProps: {
      rules: [
        {required: true, message: '手机号不能为空', trigger: 'blur'},
        {validator: validatePhone, trigger: 'blur'}
      ]
    }
  },
  {
    label: '身份证号',
    prop: 'idcard',
    render: 'input',
    renderProps: { placeholder: '请输入身份证号' },
    itemProps: {
      rules: [
        {required: true, message: '身份证号不能为空', trigger: 'blur'},
        {pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证号格式不正确', trigger: 'blur'}
      ]
    }
  },
  {
    label: '工资范围',
    prop: 'salary_min',
    render: () => <el-input-number />,
    renderProps: { min: 0, placeholder: '最低工资' },
    itemProps: {
      rules: [
        {type: 'number', message: '请输入数字', trigger: 'change'}
      ]
    }
  },
  {
    label: '到',
    prop: 'salary_max',
    render: () => <el-input-number />,
    renderProps: { min: 0, placeholder: '最高工资' },
    itemProps: {
      rules: [
        {type: 'number', message: '请输入数字', trigger: 'change'},
        {
          validator: (rule: any, value: any, callback: any) => {
            const formData = advancedValidationRef.value?.getSearchForm() || {}
            if (value && formData.salary_min && value <= formData.salary_min) {
              callback(new Error('最高工资必须大于最低工资'))
            } else {
              callback()
            }
          },
          trigger: 'change'
        }
      ]
    }
  }
])

const advancedFormOptions = {
  labelWidth: '100px'
}

// 异步验证配置
const asyncValidationItems = ref<MaSearchItem[]>([
  {
    label: '用户名',
    prop: 'async_username',
    render: 'input',
    renderProps: { placeholder: '输入用户名检查是否存在' },
    itemProps: {
      rules: [
        {required: true, message: '用户名不能为空', trigger: 'blur'},
        {validator: asyncValidateUsername, trigger: 'blur'}
      ]
    }
  },
  {
    label: '邮箱',
    prop: 'async_email',
    render: 'input',
    renderProps: { placeholder: '请输入邮箱' },
    itemProps: {
      rules: [
        {required: true, message: '邮箱不能为空', trigger: 'blur'},
        {validator: validateEmail, trigger: 'blur'}
      ]
    }
  }
])

const asyncFormOptions = {
  labelWidth: '100px'
}

// 条件验证配置
const conditionalValidationItems = ref<MaSearchItem[]>([
  {
    label: '查询类型',
    prop: 'query_type',
    render: 'radio-group',
    renderProps: {
      options: [
        {label: '按用户名', value: 'username'},
        {label: '按邮箱', value: 'email'},
        {label: '按手机号', value: 'phone'}
      ],
    },
    itemProps: {
      rules: [
        {required: true, message: '请选择查询类型', trigger: 'change'}
      ]
    }
  },
  {
    label: '查询值',
    prop: 'query_value',
    render: 'input',
    renderProps: { placeholder: '请输入查询值' },
    itemProps: {
      rules: [
        {required: true, message: '查询值不能为空', trigger: 'blur'},
        {
          validator: (rule: any, value: any, callback: any) => {
            if (!value) {
              callback()
              return
            }

            const formData = conditionalValidationRef.value?.getSearchForm() || {}
            const queryType = formData.query_type

            if (queryType === 'email' && !validateEmail(null, value, () => {})) {
              callback(new Error('请输入正确的邮箱格式'))
            } else if (queryType === 'phone' && !/^1[3-9]\d{9}$/.test(value)) {
              callback(new Error('请输入正确的手机号格式'))
            } else if (queryType === 'username' && (value.length < 3 || value.length > 20)) {
              callback(new Error('用户名长度在3-20个字符'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ]
    }
  },
  {
    label: '是否精确匹配',
    prop: 'exact_match',
    render: 'switch',
    renderProps: { activeText: '是', inactiveText: '否' }
  }
])

const conditionalFormOptions = {
  labelWidth: '120px'
}

// 验证处理函数
const validateBasicForm = async () => {
  try {
    const maFormRef = basicValidationRef.value?.getMaFormRef()
    if (maFormRef) {
      await maFormRef.validate()
      addValidationLog('success', '基础表单验证通过')
      ElMessage.success('基础表单验证通过')
    }
  } catch (error) {
    addValidationLog('error', '基础表单验证失败', error)
    ElMessage.error('基础表单验证失败')
  }
}

const validateAdvancedForm = async () => {
  try {
    const maFormRef = advancedValidationRef.value?.getMaFormRef()
    if (maFormRef) {
      await maFormRef.validate()
      addValidationLog('success', '高级表单验证通过')
      ElMessage.success('高级表单验证通过')
    }
  } catch (error) {
    addValidationLog('error', '高级表单验证失败', error)
    ElMessage.error('高级表单验证失败')
  }
}

const validateAsyncForm = async () => {
  try {
    const maFormRef = asyncValidationRef.value?.getMaFormRef()
    if (maFormRef) {
      await maFormRef.validate()
      addValidationLog('success', '异步表单验证通过')
      ElMessage.success('异步表单验证通过')
    }
  } catch (error) {
    addValidationLog('error', '异步表单验证失败', error)
    ElMessage.error('异步表单验证失败')
  }
}

const clearBasicValidation = () => {
  const maFormRef = basicValidationRef.value?.getMaFormRef()
  if (maFormRef) {
    maFormRef.clearValidate()
    addValidationLog('info', '已清空基础表单验证状态')
    ElMessage.info('已清空验证状态')
  }
}

const clearAdvancedValidation = () => {
  const maFormRef = advancedValidationRef.value?.getMaFormRef()
  if (maFormRef) {
    maFormRef.clearValidate()
    addValidationLog('info', '已清空高级表单验证状态')
    ElMessage.info('已清空验证状态')
  }
}

// 搜索处理
const handleBasicSearch = async (formData: any) => {
  addValidationLog('info', '执行基础搜索', formData)
  ElMessage.success('基础搜索完成')
}

const handleAdvancedSearch = async (formData: any) => {
  addValidationLog('info', '执行高级搜索', formData)
  ElMessage.success('高级搜索完成')
}

const handleAsyncSearch = async (formData: any) => {
  addValidationLog('info', '执行异步搜索', formData)
  ElMessage.success('异步搜索完成')
}

const handleConditionalSearch = async (formData: any) => {
  addValidationLog('info', '执行条件搜索', formData)
  ElMessage.success('条件搜索完成')
}

const handleReset = () => {
  addValidationLog('info', '重置表单')
  ElMessage.info('表单已重置')
}
</script>

<style scoped>
.demo-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background-color: #fafafa;
}

.demo-section h4 {
  margin-bottom: 15px;
  color: #303133;
  font-size: 16px;
}

.demo-tip {
  margin-bottom: 15px;
  padding: 8px 12px;
  background-color: #e1f3d8;
  border-radius: 4px;
  font-size: 14px;
  color: #67c23a;
}

.validation-log {
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.validation-log h4 {
  margin-bottom: 15px;
  color: #303133;
  font-size: 16px;
}

.log-content {
  max-height: 400px;
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.log-item {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.log-item:last-child {
  border-bottom: none;
}

.log-time {
  display: inline-block;
  width: 80px;
  color: #909399;
  font-size: 12px;
  margin-right: 12px;
}

.log-type {
  display: inline-block;
  width: 60px;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  margin-right: 12px;
}

.log-type.success {
  background-color: #f0f9ff;
  color: #67c23a;
  border: 1px solid #b3e5ab;
}

.log-type.error {
  background-color: #fef0f0;
  color: #f56c6c;
  border: 1px solid #fbc4c4;
}

.log-type.warning {
  background-color: #fdf6ec;
  color: #e6a23c;
  border: 1px solid #f5dab1;
}

.log-type.info {
  background-color: #f4f4f5;
  color: #909399;
  border: 1px solid #d3d4d6;
}

.log-message {
  color: #606266;
  font-size: 14px;
}

.log-data {
  margin-top: 8px;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.5;
  color: #409eff;
  white-space: pre-wrap;
  word-break: break-all;
}

:deep(.el-form-item.is-error .el-input__inner) {
  border-color: #f56c6c;
}

:deep(.el-form-item.is-error .el-form-item__label) {
  color: #f56c6c;
}

@media (max-width: 768px) {
  .demo-section {
    padding: 15px;
  }
  
  .log-time {
    width: 60px;
    margin-right: 8px;
  }
  
  .log-type {
    width: 50px;
    margin-right: 8px;
  }
}
</style>