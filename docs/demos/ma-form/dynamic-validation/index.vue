<script setup lang="ts">
import {ref, computed, nextTick, h} from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import type { MaFormItem, MaFormOptions } from '@mineadmin/components'

// 模拟后端API
const mockApi = {
  // 检查用户名是否存在
  checkUsername: async (username: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    const existingUsers = ['admin', 'user', 'test', 'demo']
    return existingUsers.includes(username.toLowerCase())
  },
  
  // 检查邮箱是否已注册
  checkEmail: async (email: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const existingEmails = ['admin@test.com', 'user@test.com', 'demo@example.com']
    return existingEmails.includes(email.toLowerCase())
  },
  
  // 验证手机号是否有效
  verifyPhone: async (phone: string): Promise<{ valid: boolean, operator?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 800))
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(phone)) {
      return { valid: false }
    }
    
    // 模拟运营商识别
    const operators = {
      '13': '中国移动',
      '15': '中国移动', 
      '18': '中国移动',
      '14': '中国联通',
      '16': '中国联通',
      '17': '中国电信',
      '19': '中国电信'
    }
    
    const prefix = phone.substring(0, 2)
    const operator = operators[prefix as keyof typeof operators] || '未知运营商'
    
    return { valid: true, operator }
  }
}

// 表单数据
const formData = ref({
  // 基础验证字段
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  
  // 动态验证字段
  userType: '',
  idCard: '',
  birthDate: '',
  emergencyContact: '',
  
  // 条件验证字段
  hasCompany: false,
  companyName: '',
  companyType: '',
  registrationNumber: '',
  
  // 自定义验证字段
  customField: '',
  securityQuestion: '',
  securityAnswer: '',
  
  // 其他字段
  agreePolicy: false,
  subscribeNewsletter: false
})

const formRef = ref()
const validationStatus = ref<Record<string, { loading: boolean, message: string, type: 'success' | 'error' | 'warning' | '' }>>({})

// 自定义验证规则函数
const createCustomValidator = (fieldName: string, validator: (value: any) => Promise<{ valid: boolean, message?: string, type?: 'success' | 'error' | 'warning' }>) => {
  return async (rule: any, value: any, callback: Function) => {
    if (!value) {
      callback()
      return
    }
    
    try {
      // 设置加载状态
      validationStatus.value[fieldName] = { loading: true, message: '验证中...', type: '' }
      
      const result = await validator(value)
      
      // 更新验证状态
      validationStatus.value[fieldName] = { 
        loading: false, 
        message: result.message || (result.valid ? '验证通过' : '验证失败'),
        type: result.type || (result.valid ? 'success' : 'error')
      }
      
      if (result.valid) {
        callback()
      } else {
        callback(new Error(result.message || '验证失败'))
      }
    } catch (error) {
      validationStatus.value[fieldName] = { loading: false, message: '验证异常', type: 'error' }
      callback(new Error('验证过程中发生异常'))
    }
  }
}

// 表单项配置
const formItems = computed<MaFormItem[]>(() => [
  // 基础同步验证
  {
    label: '用户名',
    prop: 'username',
    render: 'input',
    renderProps: {
      placeholder: '请输入用户名（4-20个字符）',
      clearable: true,
      'show-password': false
    },
    itemProps: {
      rules: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 4, max: 20, message: '用户名长度为4-20个字符', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' },
        { 
          asyncValidator: createCustomValidator('username', async (username: string) => {
            const exists = await mockApi.checkUsername(username)
            return {
              valid: !exists,
              message: exists ? '用户名已存在，请更换其他用户名' : '用户名可以使用',
              type: exists ? 'error' : 'success'
            }
          }),
          trigger: 'blur' 
        }
      ]
    },
    cols: { span: 12 }
  },
  
  {
    label: '邮箱地址',
    prop: 'email',
    render: 'input',
    renderProps: {
      type: 'email',
      placeholder: '请输入邮箱地址',
      clearable: true
    },
    itemProps: {
      rules: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
        {
          asyncValidator: createCustomValidator('email', async (email: string) => {
            const exists = await mockApi.checkEmail(email)
            return {
              valid: !exists,
              message: exists ? '邮箱已被注册，请使用其他邮箱' : '邮箱可以使用',
              type: exists ? 'error' : 'success'
            }
          }),
          trigger: 'blur'
        }
      ]
    },
    cols: { span: 12 }
  },
  
  {
    label: '手机号',
    prop: 'phone',
    render: 'input',
    renderProps: {
      placeholder: '请输入手机号',
      clearable: true,
      maxlength: 11
    },
    itemProps: {
      rules: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' },
        {
          asyncValidator: createCustomValidator('phone', async (phone: string) => {
            const result = await mockApi.verifyPhone(phone)
            return {
              valid: result.valid,
              message: result.valid ? `手机号有效 (${result.operator})` : '手机号格式不正确或不存在',
              type: result.valid ? 'success' : 'error'
            }
          }),
          trigger: 'blur'
        }
      ]
    },
    cols: { span: 12 }
  },
  
  // 密码相关验证
  {
    label: '密码',
    prop: 'password',
    render: 'input',
    renderProps: {
      type: 'password',
      'show-password': true,
      placeholder: '请输入密码（至少8位，包含字母和数字）',
      clearable: true
    },
    itemProps: {
      rules: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 8, message: '密码长度不能少于8位', trigger: 'blur' },
        { 
          validator: (rule: any, value: string, callback: Function) => {
            if (!value) {
              callback()
              return
            }
            
            const hasLetter = /[a-zA-Z]/.test(value)
            const hasNumber = /\d/.test(value)
            const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)
            
            if (!hasLetter || !hasNumber) {
              callback(new Error('密码必须包含字母和数字'))
            } else if (hasSpecial && hasLetter && hasNumber) {
              callback() // 强密码
            } else {
              callback() // 中等密码
            }
          },
          trigger: 'blur'
        }
      ]
    },
    cols: { span: 12 }
  },
  
  {
    label: '确认密码',
    prop: 'confirmPassword',
    render: 'input',
    renderProps: {
      type: 'password',
      'show-password': true,
      placeholder: '请再次输入密码',
      clearable: true
    },
    itemProps: {
      rules: [
        { required: true, message: '请确认密码', trigger: 'blur' },
        {
          validator: (rule: any, value: string, callback: Function) => {
            if (value !== formData.value.password) {
              callback(new Error('两次输入的密码不一致'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ]
    },
    cols: { span: 12 }
  },
  
  // 动态验证条件
  {
    label: '用户类型',
    prop: 'userType',
    render: 'select',
    renderProps: { placeholder: '请选择用户类型' },
    renderSlots: {
      default: () => [
        { label: '个人用户', value: 'personal' },
        { label: '企业用户', value: 'business' },
        { label: '开发者', value: 'developer' }
      ].map(item => h('el-option', { 
        key: item.value, 
        label: item.label, 
        value: item.value 
      }))
    },
    itemProps: {
      rules: [{ required: true, message: '请选择用户类型', trigger: 'change' }]
    },
    cols: { span: 8 }
  },
  
  // 条件验证 - 身份证（个人用户必填）
  {
    label: '身份证号',
    prop: 'idCard',
    render: 'input',
    renderProps: {
      placeholder: '请输入身份证号',
      clearable: true,
      maxlength: 18
    },
    itemProps: {
      rules: computed(() => {
        const rules: any[] = []
        
        // 个人用户身份证必填
        if (formData.value.userType === 'personal') {
          rules.push({ required: true, message: '个人用户必须填写身份证号', trigger: 'blur' })
        }
        
        // 身份证格式验证
        if (formData.value.idCard) {
          rules.push({
            validator: (rule: any, value: string, callback: Function) => {
              if (!value) {
                callback()
                return
              }
              
              const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
              if (!idCardRegex.test(value)) {
                callback(new Error('请输入正确的身份证号格式'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          })
        }
        
        return rules
      }).value
    },
    when: (item, model) => !!model.userType,
    dependencies: ['userType'],
    cols: { span: 8 }
  },
  
  // 出生日期验证（从身份证提取或手动输入）
  {
    label: '出生日期',
    prop: 'birthDate',
    render: 'datePicker',
    renderProps: {
      type: 'date',
      placeholder: '请选择出生日期',
      format: 'YYYY-MM-DD',
      'value-format': 'YYYY-MM-DD',
      'disabled-date': (date: Date) => date > new Date() || date < new Date('1900-01-01')
    },
    itemProps: {
      rules: [
        { required: true, message: '请选择出生日期', trigger: 'change' },
        {
          validator: (rule: any, value: string, callback: Function) => {
            if (!value || !formData.value.idCard) {
              callback()
              return
            }
            
            // 从身份证提取出生日期
            const idCard = formData.value.idCard
            if (idCard.length === 18) {
              const birthFromId = `${idCard.substring(6, 10)}-${idCard.substring(10, 12)}-${idCard.substring(12, 14)}`
              if (value !== birthFromId) {
                callback(new Error('出生日期与身份证信息不匹配'))
              } else {
                callback()
              }
            } else {
              callback()
            }
          },
          trigger: 'change'
        }
      ]
    },
    when: (item, model) => !!model.userType,
    dependencies: ['userType'],
    cols: { span: 8 }
  },
  
  // 紧急联系人（开发者必填）
  {
    label: '紧急联系人',
    prop: 'emergencyContact',
    render: 'input',
    renderProps: {
      placeholder: '请输入紧急联系人手机号',
      clearable: true
    },
    itemProps: {
      rules: computed(() => {
        const rules: any[] = []
        
        if (formData.value.userType === 'developer') {
          rules.push({ required: true, message: '开发者必须填写紧急联系人', trigger: 'blur' })
        }
        
        if (formData.value.emergencyContact) {
          rules.push({ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' })
          rules.push({
            validator: (rule: any, value: string, callback: Function) => {
              if (value === formData.value.phone) {
                callback(new Error('紧急联系人不能是本人手机号'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          })
        }
        
        return rules
      }).value
    },
    when: (item, model) => !!model.userType,
    dependencies: ['userType'],
    cols: { span: 12 }
  },
  
  // 企业信息条件验证
  {
    label: '是否有公司',
    prop: 'hasCompany',
    render: 'switch',
    renderProps: {
      'active-text': '有公司',
      'inactive-text': '无公司'
    },
    when: (item, model) => model.userType === 'business',
    dependencies: ['userType'],
    cols: { span: 8 }
  },
  
  {
    label: '公司名称',
    prop: 'companyName',
    render: 'input',
    renderProps: {
      placeholder: '请输入公司名称',
      clearable: true
    },
    itemProps: {
      rules: [
        { required: true, message: '请输入公司名称', trigger: 'blur' },
        { min: 2, max: 50, message: '公司名称长度为2-50个字符', trigger: 'blur' },
        {
          asyncValidator: createCustomValidator('companyName', async (name: string) => {
            // 模拟企业名称查重
            await new Promise(resolve => setTimeout(resolve, 1200))
            const existingCompanies = ['测试公司', '示例企业', 'Demo Corp']
            const exists = existingCompanies.includes(name)
            return {
              valid: !exists,
              message: exists ? '公司名称已被注册' : '公司名称可以使用',
              type: exists ? 'error' : 'success'
            }
          }),
          trigger: 'blur'
        }
      ]
    },
    when: (item, model) => model.hasCompany === true,
    dependencies: ['hasCompany'],
    cols: { span: 12 }
  },
  
  {
    label: '公司类型',
    prop: 'companyType',
    render: 'select',
    renderProps: { placeholder: '请选择公司类型' },
    renderSlots: {
      default: () => [
        { label: '有限责任公司', value: 'ltd' },
        { label: '股份有限公司', value: 'corp' },
        { label: '个人独资企业', value: 'sole' },
        { label: '合伙企业', value: 'partnership' }
      ].map(item => h('el-option', { 
        key: item.value, 
        label: item.label, 
        value: item.value 
      }))
    },
    itemProps: {
      rules: [{ required: true, message: '请选择公司类型', trigger: 'change' }]
    },
    when: (item, model) => model.hasCompany === true,
    dependencies: ['hasCompany'],
    cols: { span: 8 }
  },
  
  {
    label: '工商注册号',
    prop: 'registrationNumber',
    render: 'input',
    renderProps: {
      placeholder: '请输入工商注册号',
      clearable: true
    },
    itemProps: {
      rules: [
        { required: true, message: '请输入工商注册号', trigger: 'blur' },
        { 
          validator: (rule: any, value: string, callback: Function) => {
            // 统一社会信用代码验证
            const creditCodeRegex = /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/
            if (!creditCodeRegex.test(value)) {
              callback(new Error('请输入正确的统一社会信用代码格式'))
            } else {
              callback()
            }
          },
          trigger: 'blur' 
        }
      ]
    },
    when: (item, model) => model.hasCompany === true,
    dependencies: ['hasCompany'],
    cols: { span: 8 }
  },
  
  // 自定义复杂验证
  {
    label: '自定义字段',
    prop: 'customField',
    render: 'input',
    renderProps: {
      placeholder: '请输入自定义字段（复杂验证示例）',
      clearable: true
    },
    itemProps: {
      rules: [
        {
          validator: (rule: any, value: string, callback: Function) => {
            if (!value) {
              callback()
              return
            }
            
            // 复杂的自定义验证逻辑
            const hasUpperCase = /[A-Z]/.test(value)
            const hasLowerCase = /[a-z]/.test(value)
            const hasNumber = /\d/.test(value)
            const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)
            const length = value.length
            
            let score = 0
            let messages = []
            
            if (hasUpperCase) score += 1
            else messages.push('包含大写字母')
            
            if (hasLowerCase) score += 1
            else messages.push('包含小写字母')
            
            if (hasNumber) score += 1
            else messages.push('包含数字')
            
            if (hasSpecialChar) score += 1
            else messages.push('包含特殊字符')
            
            if (length >= 8) score += 1
            else messages.push('长度至少8位')
            
            if (score < 3) {
              callback(new Error(`字段强度不够，还需要：${messages.join('、')}`))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ]
    },
    cols: { span: 24 }
  },
  
  // 安全问题（联动验证）
  {
    label: '安全问题',
    prop: 'securityQuestion',
    render: 'select',
    renderProps: { placeholder: '请选择安全问题' },
    renderSlots: {
      default: () => [
        { label: '您的出生城市是？', value: 'birthCity' },
        { label: '您小学的名字是？', value: 'primarySchool' },
        { label: '您的第一个宠物叫什么？', value: 'petName' },
        { label: '您最喜欢的电影是？', value: 'favoriteMovie' }
      ].map(item => h('el-option', { 
        key: item.value, 
        label: item.label, 
        value: item.value 
      }))
    },
    cols: { span: 12 }
  },
  
  {
    label: '安全答案',
    prop: 'securityAnswer',
    render: 'input',
    renderProps: {
      placeholder: '请输入安全问题答案',
      clearable: true
    },
    itemProps: {
      rules: computed(() => {
        const rules: any[] = []
        
        if (formData.value.securityQuestion) {
          rules.push({ required: true, message: '请输入安全问题答案', trigger: 'blur' })
          rules.push({ min: 2, max: 20, message: '答案长度为2-20个字符', trigger: 'blur' })
        }
        
        return rules
      }).value
    },
    when: (item, model) => !!model.securityQuestion,
    dependencies: ['securityQuestion'],
    cols: { span: 12 }
  },
  
  // 协议同意（必须验证）
  {
    label: '用户协议',
    prop: 'agreePolicy',
    render: 'checkbox',
    renderSlots: {
      default: () => '我已阅读并同意《用户服务协议》和《隐私政策》'
    },
    itemProps: {
      rules: [
        {
          validator: (rule: any, value: boolean, callback: Function) => {
            if (!value) {
              callback(new Error('必须同意用户协议才能继续'))
            } else {
              callback()
            }
          },
          trigger: 'change'
        }
      ]
    },
    cols: { span: 12 }
  },
  
  {
    label: '订阅通知',
    prop: 'subscribeNewsletter',
    render: 'checkbox',
    renderSlots: {
      default: () => '订阅产品更新和营销信息（可选）'
    },
    cols: { span: 12 }
  }
])

// 表单配置
const formOptions: MaFormOptions = {
  labelWidth: '130px',
  labelPosition: 'right',
  size: 'default',
  gutter: 20
}

// 计算密码强度
const passwordStrength = computed(() => {
  const password = formData.value.password
  if (!password) return { level: 0, text: '未设置', color: '#ddd' }
  
  let score = 0
  if (password.length >= 8) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1
  
  if (score <= 2) return { level: score, text: '弱', color: '#f56c6c' }
  if (score <= 3) return { level: score, text: '中等', color: '#e6a23c' }
  return { level: score, text: '强', color: '#67c23a' }
})

// 表单提交
const handleSubmit = async () => {
  try {
    formRef.value?.setLoadingState(true)
    
    // 等待所有异步验证完成
    await nextTick()
    
    const isValid = await formRef.value?.getElFormRef()?.validate()
    
    if (isValid) {
      // 模拟提交延迟
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      ElNotification({
        title: '注册成功',
        message: '账户已创建，所有验证通过！',
        type: 'success',
        duration: 3000
      })
      
      console.log('表单数据:', formData.value)
    }
  } catch (error) {
    ElNotification({
      title: '验证失败',
      message: '请检查表单中的错误信息并修正',
      type: 'error',
      duration: 3000
    })
  } finally {
    formRef.value?.setLoadingState(false)
  }
}

// 重置表单
const handleReset = () => {
  formRef.value?.getElFormRef()?.resetFields()
  validationStatus.value = {}
  ElMessage.info('表单已重置')
}

// 清除验证状态
const clearValidation = () => {
  formRef.value?.getElFormRef()?.clearValidate()
  validationStatus.value = {}
  ElMessage.info('验证状态已清除')
}

const activeRules = ref(['async', 'conditional'])
</script>

<template>
  <div class="dynamic-validation-demo">
    <!-- 演示说明 -->
    <div class="demo-description">
      <h3>动态验证演示</h3>
      <p>展示 MaForm 的高级验证功能，包括异步验证、条件验证、自定义验证规则、联动验证等。</p>
      <div class="demo-features">
        <el-tag type="info" size="small">异步验证</el-tag>
        <el-tag type="success" size="small">条件验证</el-tag>
        <el-tag type="warning" size="small">自定义规则</el-tag>
        <el-tag type="danger" size="small">联动验证</el-tag>
        <el-tag size="small">实时反馈</el-tag>
      </div>
    </div>

    <!-- 验证状态面板 -->
    <div class="validation-status" v-if="Object.keys(validationStatus).length > 0">
      <el-card shadow="never">
        <template #header>
          <span>实时验证状态</span>
        </template>
        
        <div class="status-grid">
          <div 
            v-for="(status, field) in validationStatus" 
            :key="field" 
            class="status-item"
            :class="status.type"
          >
            <div class="status-field">{{ field }}</div>
            <div class="status-message">
              <el-icon v-if="status.loading" class="is-loading"><Loading /></el-icon>
              <el-icon v-else-if="status.type === 'success'"><SuccessFilled /></el-icon>
              <el-icon v-else-if="status.type === 'error'"><CircleCloseFilled /></el-icon>
              <el-icon v-else-if="status.type === 'warning'"><WarningFilled /></el-icon>
              <span>{{ status.message }}</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 密码强度指示器 -->
    <div class="password-strength" v-if="formData.password">
      <el-card shadow="never">
        <template #header>
          <span>密码强度评估</span>
        </template>
        
        <div class="strength-indicator">
          <div class="strength-bar">
            <div 
              class="strength-fill" 
              :style="{ 
                width: `${(passwordStrength.level / 5) * 100}%`,
                backgroundColor: passwordStrength.color
              }"
            ></div>
          </div>
          <div class="strength-text" :style="{ color: passwordStrength.color }">
            {{ passwordStrength.text }} ({{ passwordStrength.level }}/5)
          </div>
        </div>
      </el-card>
    </div>

    <!-- 动态验证表单 -->
    <div class="demo-form">
      <ma-form 
        ref="formRef"
        v-model="formData" 
        :options="formOptions"
        :items="formItems"
      >
        <!-- 自定义底部操作栏 -->
        <template #footer>
          <div class="form-footer">
            <el-button @click="clearValidation">清除验证</el-button>
            <el-button @click="handleReset">重置表单</el-button>
            <el-button type="primary" @click="handleSubmit">提交注册</el-button>
          </div>
        </template>
      </ma-form>
    </div>

    <!-- 验证规则说明 -->
    <div class="validation-rules">
      <el-card shadow="never">
        <template #header>
          <span>验证规则说明</span>
        </template>
        
        <el-collapse v-model="activeRules">
          <el-collapse-item title="异步验证规则" name="async">
            <div class="rule-content">
              <h5>用户名检查</h5>
              <p>• 异步检查用户名是否已存在（模拟1.5秒延迟）</p>
              <p>• 已存在的用户名：admin, user, test, demo</p>
              
              <h5>邮箱检查</h5>
              <p>• 异步检查邮箱是否已注册（模拟1秒延迟）</p>
              <p>• 已注册的邮箱：admin@test.com, user@test.com, demo@example.com</p>
              
              <h5>手机号验证</h5>
              <p>• 异步验证手机号有效性并识别运营商（模拟0.8秒延迟）</p>
              <p>• 同时进行格式验证和运营商识别</p>
            </div>
          </el-collapse-item>
          
          <el-collapse-item title="条件验证规则" name="conditional">
            <div class="rule-content">
              <h5>用户类型条件验证</h5>
              <p>• 个人用户：身份证号必填，需要格式验证</p>
              <p>• 企业用户：可选择是否填写公司信息</p>
              <p>• 开发者：紧急联系人必填，且不能是本人手机号</p>
              
              <h5>企业信息验证</h5>
              <p>• 有公司时：公司名称、类型、注册号全部必填</p>
              <p>• 工商注册号使用统一社会信用代码格式验证</p>
            </div>
          </el-collapse-item>
          
          <el-collapse-item title="自定义验证规则" name="custom">
            <div class="rule-content">
              <h5>密码强度验证</h5>
              <p>• 长度至少8位</p>
              <p>• 必须包含字母和数字</p>
              <p>• 包含特殊字符可获得更高强度评分</p>
              
              <h5>自定义字段验证</h5>
              <p>• 复杂的多条件验证示例</p>
              <p>• 需要满足至少3个条件：大写字母、小写字母、数字、特殊字符、长度≥8</p>
              
              <h5>身份证与出生日期联动验证</h5>
              <p>• 从身份证提取出生日期进行交叉验证</p>
            </div>
          </el-collapse-item>
          
          <el-collapse-item title="联动验证规则" name="linked">
            <div class="rule-content">
              <h5>密码确认</h5>
              <p>• 实时检查两次密码输入是否一致</p>
              
              <h5>安全问题联动</h5>
              <p>• 选择安全问题后，答案字段变为必填</p>
              
              <h5>协议同意验证</h5>
              <p>• 必须同意用户协议才能提交</p>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>

    <!-- 表单数据展示 -->
    <div class="data-display">
      <el-card shadow="never">
        <template #header>
          <span>当前表单数据</span>
        </template>
        <pre class="data-json">{{ JSON.stringify(formData, null, 2) }}</pre>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.dynamic-validation-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.demo-description {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.demo-description h3 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 18px;
}

.demo-description p {
  margin: 0 0 15px 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
}

.demo-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.validation-status,
.password-strength {
  margin-bottom: 20px;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 12px;
}

.status-item {
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}

.status-item.success {
  background-color: #f0f9ff;
  border-color: #67c23a;
}

.status-item.error {
  background-color: #fef0f0;
  border-color: #f56c6c;
}

.status-item.warning {
  background-color: #fdf6ec;
  border-color: #e6a23c;
}

.status-field {
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
  font-size: 13px;
}

.status-message {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #606266;
  font-size: 12px;
}

.status-message .el-icon {
  font-size: 14px;
}

.status-message .el-icon.is-loading {
  animation: rotating 2s linear infinite;
}

.strength-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
}

.strength-bar {
  flex: 1;
  height: 8px;
  background-color: #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.strength-text {
  font-size: 14px;
  font-weight: 600;
  min-width: 60px;
}

.demo-form {
  margin-bottom: 30px;
}

.form-footer {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px 0;
}

.validation-rules,
.data-display {
  margin-bottom: 20px;
}

.rule-content h5 {
  margin: 0 0 8px 0;
  color: #409EFF;
  font-size: 14px;
}

.rule-content p {
  margin: 0 0 8px 0;
  color: #606266;
  font-size: 13px;
  line-height: 1.5;
}

.data-json {
  background-color: #f4f4f5;
  padding: 16px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.5;
  color: #606266;
  overflow-x: auto;
  white-space: pre-wrap;
  max-height: 300px;
  overflow-y: auto;
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .dynamic-validation-demo {
    padding: 10px;
  }
  
  .demo-features {
    justify-content: center;
  }
  
  .form-footer {
    flex-direction: column;
    align-items: center;
  }
  
  .status-grid {
    grid-template-columns: 1fr;
  }
  
  .strength-indicator {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
}
</style>