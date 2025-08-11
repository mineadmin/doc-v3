<script setup lang="ts">
import {ref, computed, watch, h} from 'vue'
import { ElMessage } from 'element-plus'
import type { MaFormItem, MaFormOptions } from '@mineadmin/form'

// 表单数据 - 包含各种条件渲染场景
const formData = ref({
  // 用户类型决定后续字段显示
  userType: '',
  
  // 个人用户字段
  personalName: '',
  personalAge: '',
  personalPhone: '',
  
  // 企业用户字段
  companyName: '',
  companyScale: '',
  businessLicense: '',
  legalPerson: '',
  
  // VIP 相关字段
  isVip: false,
  vipLevel: '',
  vipExpireDate: '',
  
  // 地址信息 - 级联显示
  hasAddress: false,
  country: '',
  province: '',
  city: '',
  district: '',
  detailAddress: '',
  
  // 支付方式 - 动态字段
  paymentMethod: '',
  
  // 银行卡信息
  bankName: '',
  cardNumber: '',
  
  // 支付宝信息
  alipayAccount: '',
  
  // 微信信息
  wechatAccount: '',
  
  // 高级配置 - 多重条件
  enableAdvanced: false,
  advancedType: '',
  advancedConfig: '',
  
  // 其他字段
  description: '',
  agreeTerms: false
})

const formRef = ref()

// 监听用户类型变化，清空相关字段
watch(() => formData.value.userType, (newType, oldType) => {
  if (newType !== oldType) {
    // 清空个人用户相关字段
    if (newType !== 'personal') {
      formData.value.personalName = ''
      formData.value.personalAge = ''
      formData.value.personalPhone = ''
    }
    
    // 清空企业用户相关字段
    if (newType !== 'company') {
      formData.value.companyName = ''
      formData.value.companyScale = ''
      formData.value.businessLicense = ''
      formData.value.legalPerson = ''
    }
  }
})

// 监听 VIP 状态变化
watch(() => formData.value.isVip, (isVip) => {
  if (!isVip) {
    formData.value.vipLevel = ''
    formData.value.vipExpireDate = ''
  }
})

// 监听地址选项变化
watch(() => formData.value.hasAddress, (hasAddress) => {
  if (!hasAddress) {
    formData.value.country = ''
    formData.value.province = ''
    formData.value.city = ''
    formData.value.district = ''
    formData.value.detailAddress = ''
  }
})

// 监听支付方式变化
watch(() => formData.value.paymentMethod, (method, oldMethod) => {
  if (method !== oldMethod) {
    // 清空所有支付相关字段
    formData.value.bankName = ''
    formData.value.cardNumber = ''
    formData.value.alipayAccount = ''
    formData.value.wechatAccount = ''
  }
})

// 表单项配置 - 包含各种条件渲染逻辑
const formItems = computed<MaFormItem[]>(() => [
  // 用户类型选择 - 主控字段
  {
    label: '用户类型',
    prop: 'userType',
    render: 'select',
    renderProps: {
      placeholder: '请选择用户类型',
      clearable: true
    },
    renderSlots: {
      default: () => [
        { label: '个人用户', value: 'personal' },
        { label: '企业用户', value: 'company' }
      ].map(item => h('el-option', { 
        key: item.value, 
        label: item.label, 
        value: item.value 
      }))
    },
    itemProps: {
      rules: [{ required: true, message: '请选择用户类型', trigger: 'change' }]
    },
    cols: { span: 12 }
  },

  // 个人用户字段组 - 条件显示
  {
    label: '姓名',
    prop: 'personalName',
    render: 'input',
    renderProps: { 
      placeholder: '请输入真实姓名',
      clearable: true 
    },
    itemProps: {
      rules: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
        { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' }
      ]
    },
    // 仅当用户类型为个人时显示
    when: (model) => model.userType === 'personal',
    dependencies: ['userType'],
    cols: { span: 12 }
  },
  {
    label: '年龄',
    prop: 'personalAge',
    render: 'inputNumber',
    renderProps: { 
      min: 1, 
      max: 150,
      placeholder: '请输入年龄' 
    },
    itemProps: {
      rules: [{ required: true, message: '请输入年龄', trigger: 'blur' }]
    },
    when: (model) => model.userType === 'personal',
    dependencies: ['userType'],
    cols: { span: 8 }
  },
  {
    label: '手机号',
    prop: 'personalPhone',
    render: 'input',
    renderProps: { 
      placeholder: '请输入手机号',
      clearable: true 
    },
    itemProps: {
      rules: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
      ]
    },
    when: (model) => model.userType === 'personal',
    dependencies: ['userType'],
    cols: { span: 8 }
  },

  // 企业用户字段组 - 条件显示
  {
    label: '企业名称',
    prop: 'companyName',
    render: 'input',
    renderProps: { 
      placeholder: '请输入企业名称',
      clearable: true 
    },
    itemProps: {
      rules: [{ required: true, message: '请输入企业名称', trigger: 'blur' }]
    },
    when: (model) => model.userType === 'company',
    dependencies: ['userType'],
    cols: { span: 12 }
  },
  {
    label: '企业规模',
    prop: 'companyScale',
    render: 'select',
    renderProps: { placeholder: '请选择企业规模' },
    renderSlots: {
      default: () => [
        { label: '1-50人', value: 'small' },
        { label: '50-200人', value: 'medium' },
        { label: '200-1000人', value: 'large' },
        { label: '1000人以上', value: 'xlarge' }
      ].map(item => h('el-option', { 
        key: item.value, 
        label: item.label, 
        value: item.value 
      }))
    },
    itemProps: {
      rules: [{ required: true, message: '请选择企业规模', trigger: 'change' }]
    },
    when: (model) => model.userType === 'company',
    dependencies: ['userType'],
    cols: { span: 8 }
  },
  {
    label: '营业执照号',
    prop: 'businessLicense',
    render: 'input',
    renderProps: { 
      placeholder: '请输入营业执照号',
      clearable: true 
    },
    itemProps: {
      rules: [{ required: true, message: '请输入营业执照号', trigger: 'blur' }]
    },
    when: (model) => model.userType === 'company',
    dependencies: ['userType'],
    cols: { span: 8 }
  },
  {
    label: '法人代表',
    prop: 'legalPerson',
    render: 'input',
    renderProps: { 
      placeholder: '请输入法人代表姓名',
      clearable: true 
    },
    itemProps: {
      rules: [{ required: true, message: '请输入法人代表姓名', trigger: 'blur' }]
    },
    when: (model) => model.userType === 'company',
    dependencies: ['userType'],
    cols: { span: 8 }
  },

  // VIP 相关字段 - 级联条件显示
  {
    label: '是否VIP',
    prop: 'isVip',
    render: 'switch',
    renderProps: {
      'active-text': 'VIP用户',
      'inactive-text': '普通用户'
    },
    // 仅当有用户类型时显示
    when: (model) => !!model.userType,
    dependencies: ['userType'],
    cols: { span: 8 }
  },
  {
    label: 'VIP等级',
    prop: 'vipLevel',
    render: 'select',
    renderProps: { placeholder: '请选择VIP等级' },
    renderSlots: {
      default: () => [
        { label: '黄金VIP', value: 'gold' },
        { label: '白金VIP', value: 'platinum' },
        { label: '钻石VIP', value: 'diamond' }
      ].map(item => h('el-option', { 
        key: item.value, 
        label: item.label, 
        value: item.value 
      }))
    },
    itemProps: {
      rules: [{ required: true, message: '请选择VIP等级', trigger: 'change' }]
    },
    // 仅当是VIP用户时显示
    when: (model) => model.isVip === true,
    dependencies: ['isVip'],
    cols: { span: 8 }
  },
  {
    label: 'VIP到期时间',
    prop: 'vipExpireDate',
    render: 'datePicker',
    renderProps: {
      type: 'date',
      placeholder: '请选择VIP到期时间',
      format: 'YYYY-MM-DD',
      'value-format': 'YYYY-MM-DD',
      'disabled-date': (date: Date) => date < new Date()
    },
    itemProps: {
      rules: [{ required: true, message: '请选择VIP到期时间', trigger: 'change' }]
    },
    when: (model) => model.isVip === true,
    dependencies: ['isVip'],
    cols: { span: 8 }
  },

  // 地址信息 - 级联显示
  {
    label: '填写地址',
    prop: 'hasAddress',
    render: 'checkbox',
    renderSlots: {
      default: () => '需要填写详细地址信息'
    },
    when: (model) => !!model.userType,
    dependencies: ['userType'],
    cols: { span: 12 }
  },
  {
    label: '国家',
    prop: 'country',
    render: 'select',
    renderProps: { placeholder: '请选择国家' },
    renderSlots: {
      default: () => [
        { label: '中国', value: 'china' },
        { label: '美国', value: 'usa' },
        { label: '日本', value: 'japan' }
      ].map(item => h('el-option', { 
        key: item.value, 
        label: item.label, 
        value: item.value 
      }))
    },
    when: (model) => model.hasAddress === true,
    dependencies: ['hasAddress'],
    cols: { span: 6 }
  },
  {
    label: '省份',
    prop: 'province',
    render: 'select',
    renderProps: { placeholder: '请选择省份' },
    renderSlots: {
      default: () => [
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '广东', value: 'guangdong' }
      ].map(item => h('el-option', { 
        key: item.value, 
        label: item.label, 
        value: item.value 
      }))
    },
    when: (model) => model.hasAddress === true && model.country === 'china',
    dependencies: ['hasAddress', 'country'],
    cols: { span: 6 }
  },
  {
    label: '城市',
    prop: 'city',
    render: 'select',
    renderProps: { placeholder: '请选择城市' },
    renderSlots: {
      default: () => [
        { label: '北京市', value: 'beijing' },
        { label: '上海市', value: 'shanghai' },
        { label: '深圳市', value: 'shenzhen' }
      ].map(item => h('el-option', { 
        key: item.value, 
        label: item.label, 
        value: item.value 
      }))
    },
    when: (model) => model.hasAddress === true && !!model.province,
    dependencies: ['hasAddress', 'province'],
    cols: { span: 6 }
  },
  {
    label: '区县',
    prop: 'district',
    render: 'input',
    renderProps: { placeholder: '请输入区县' },
    when: (model) => model.hasAddress === true && !!model.city,
    dependencies: ['hasAddress', 'city'],
    cols: { span: 6 }
  },
  {
    label: '详细地址',
    prop: 'detailAddress',
    render: 'input',
    renderProps: { 
      type: 'textarea',
      placeholder: '请输入详细地址',
      rows: 2
    },
    when: (model) => model.hasAddress === true,
    dependencies: ['hasAddress'],
    cols: { span: 24 }
  },

  // 支付方式 - 动态字段显示
  {
    label: '支付方式',
    prop: 'paymentMethod',
    render: 'radio',
    renderSlots: {
      default: () => [
        { label: '银行卡', value: 'bank' },
        { label: '支付宝', value: 'alipay' },
        { label: '微信支付', value: 'wechat' }
      ].map(item => h('el-radio', { 
        key: item.value,
        label: item.value,
        value: item.value 
      }, () => item.label))
    },
    // 仅 VIP 用户可以选择支付方式
    when: (model) => model.isVip === true,
    dependencies: ['isVip'],
    cols: { span: 24 }
  },

  // 银行卡信息 - 条件显示
  {
    label: '银行名称',
    prop: 'bankName',
    render: 'select',
    renderProps: { placeholder: '请选择银行' },
    renderSlots: {
      default: () => [
        { label: '中国工商银行', value: 'icbc' },
        { label: '中国建设银行', value: 'ccb' },
        { label: '中国农业银行', value: 'abc' },
        { label: '中国银行', value: 'boc' }
      ].map(item => h('el-option', { 
        key: item.value, 
        label: item.label, 
        value: item.value 
      }))
    },
    when: (model) => model.paymentMethod === 'bank',
    dependencies: ['paymentMethod'],
    cols: { span: 12 }
  },
  {
    label: '银行卡号',
    prop: 'cardNumber',
    render: 'input',
    renderProps: { 
      placeholder: '请输入银行卡号',
      clearable: true 
    },
    itemProps: {
      rules: [
        { required: true, message: '请输入银行卡号', trigger: 'blur' },
        { pattern: /^\d{16,19}$/, message: '请输入正确的银行卡号', trigger: 'blur' }
      ]
    },
    when: (model) => model.paymentMethod === 'bank',
    dependencies: ['paymentMethod'],
    cols: { span: 12 }
  },

  // 支付宝信息 - 条件显示
  {
    label: '支付宝账户',
    prop: 'alipayAccount',
    render: 'input',
    renderProps: { 
      placeholder: '请输入支付宝账户（手机号或邮箱）',
      clearable: true 
    },
    itemProps: {
      rules: [{ required: true, message: '请输入支付宝账户', trigger: 'blur' }]
    },
    when: (model) => model.paymentMethod === 'alipay',
    dependencies: ['paymentMethod'],
    cols: { span: 12 }
  },

  // 微信信息 - 条件显示
  {
    label: '微信账户',
    prop: 'wechatAccount',
    render: 'input',
    renderProps: { 
      placeholder: '请输入微信号',
      clearable: true 
    },
    itemProps: {
      rules: [{ required: true, message: '请输入微信号', trigger: 'blur' }]
    },
    when: (model) => model.paymentMethod === 'wechat',
    dependencies: ['paymentMethod'],
    cols: { span: 12 }
  },

  // 高级配置 - 多重条件
  {
    label: '启用高级配置',
    prop: 'enableAdvanced',
    render: 'switch',
    renderProps: {
      'active-text': '启用',
      'inactive-text': '禁用'
    },
    // 仅企业VIP用户可以启用高级配置
    when: (model) => model.userType === 'company' && model.isVip === true,
    dependencies: ['userType', 'isVip'],
    cols: { span: 8 }
  },
  {
    label: '配置类型',
    prop: 'advancedType',
    render: 'select',
    renderProps: { placeholder: '请选择配置类型' },
    renderSlots: {
      default: () => [
        { label: 'API配置', value: 'api' },
        { label: '数据库配置', value: 'database' },
        { label: '缓存配置', value: 'cache' }
      ].map(item => h('el-option', { 
        key: item.value, 
        label: item.label, 
        value: item.value 
      }))
    },
    when: (model) => model.enableAdvanced === true,
    dependencies: ['enableAdvanced'],
    cols: { span: 8 }
  },
  {
    label: '配置详情',
    prop: 'advancedConfig',
    render: 'input',
    renderProps: {
      type: 'textarea',
      placeholder: '请输入JSON格式的配置信息',
      rows: 4
    },
    when: (model) => model.enableAdvanced === true && !!model.advancedType,
    dependencies: ['enableAdvanced', 'advancedType'],
    cols: { span: 8 }
  },

  // 其他字段
  {
    label: '备注说明',
    prop: 'description',
    render: 'input',
    renderProps: {
      type: 'textarea',
      placeholder: '请输入备注说明（可选）',
      rows: 3,
      'show-word-limit': true,
      maxlength: 200
    },
    when: (model) => !!model.userType,
    dependencies: ['userType'],
    cols: { span: 24 }
  },
  {
    label: '同意条款',
    prop: 'agreeTerms',
    render: 'checkbox',
    renderSlots: {
      default: () => '我已阅读并同意相关服务条款'
    },
    itemProps: {
      rules: [{ 
        validator: (rule: any, value: boolean, callback: Function) => {
          if (!value) {
            callback(new Error('请同意服务条款'))
          } else {
            callback()
          }
        }, 
        trigger: 'change' 
      }]
    },
    when: (model) => !!model.userType,
    dependencies: ['userType'],
    cols: { span: 24 }
  }
])

// 计算当前显示的字段数量
const visibleFieldsCount = computed(() => {
  return formItems.value.filter(item => {
    if (!item.when) return true
    return item.when(formData.value, item)
  }).length
})

// 表单配置
const formOptions: MaFormOptions = {
  labelWidth: '120px',
  labelPosition: 'right',
  size: 'default',
}

// 表单提交
const handleSubmit = async () => {
  try {
    formRef.value?.setLoadingState(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const isValid = await formRef.value?.getElFormRef()?.validate()
    if (isValid) {
      ElMessage.success('提交成功！')
      console.log('表单数据:', formData.value)
    }
  } catch (error) {
    ElMessage.error('表单验证失败，请检查必填项')
  } finally {
    formRef.value?.setLoadingState(false)
  }
}

// 重置表单
const handleReset = () => {
  formRef.value?.getElFormRef()?.resetFields()
  ElMessage.info('表单已重置')
}

// 清空所有数据
const handleClear = () => {
  Object.keys(formData.value).forEach(key => {
    if (typeof formData.value[key as keyof typeof formData.value] === 'boolean') {
      (formData.value[key as keyof typeof formData.value] as boolean) = false
    } else if (typeof formData.value[key as keyof typeof formData.value] === 'number') {
      (formData.value[key as keyof typeof formData.value] as number) = 0
    } else {
      (formData.value[key as keyof typeof formData.value] as string) = ''
    }
  })
  formRef.value?.getElFormRef()?.clearValidate()
  ElMessage.info('表单已清空')
}
</script>

<template>
  <div class="conditional-rendering-demo">
    <!-- 演示说明 -->
    <div class="demo-description">
      <h3>条件渲染演示</h3>
      <p>展示 MaForm 的条件渲染功能，根据表单数据动态显示/隐藏字段，支持复杂的依赖关系和级联显示。</p>
      <div class="demo-features">
        <el-tag type="info" size="small">基础条件显示</el-tag>
        <el-tag type="success" size="small">级联字段</el-tag>
        <el-tag type="warning" size="small">多重条件</el-tag>
        <el-tag type="danger" size="small">动态验证</el-tag>
        <el-tag size="small">依赖清理</el-tag>
      </div>
      <div class="demo-stats">
        <el-statistic title="当前显示字段" :value="visibleFieldsCount" />
      </div>
    </div>

    <!-- 条件渲染表单 -->
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
            <el-button @click="handleClear">清空</el-button>
            <el-button @click="handleReset">重置</el-button>
            <el-button type="primary" @click="handleSubmit">提交</el-button>
          </div>
        </template>
      </ma-form>
    </div>

    <!-- 条件逻辑说明 -->
    <div class="logic-explanation">
      <el-card shadow="never">
        <template #header>
          <span>条件渲染逻辑说明</span>
        </template>
        
        <div class="logic-tree">
          <div class="logic-item">
            <h4>1. 用户类型 (userType)</h4>
            <ul>
              <li><strong>个人用户</strong>: 显示姓名、年龄、手机号字段</li>
              <li><strong>企业用户</strong>: 显示企业名称、规模、营业执照、法人代表字段</li>
            </ul>
          </div>
          
          <div class="logic-item">
            <h4>2. VIP状态 (isVip)</h4>
            <ul>
              <li><strong>启用VIP</strong>: 显示VIP等级、到期时间、支付方式字段</li>
              <li><strong>禁用VIP</strong>: 隐藏所有VIP相关字段</li>
            </ul>
          </div>
          
          <div class="logic-item">
            <h4>3. 地址信息 (hasAddress)</h4>
            <ul>
              <li><strong>需要地址</strong>: 显示国家、省份、城市等级联字段</li>
              <li><strong>国家为中国</strong>: 显示省份选择器</li>
              <li><strong>有省份</strong>: 显示城市选择器</li>
              <li><strong>有城市</strong>: 显示区县输入框</li>
            </ul>
          </div>
          
          <div class="logic-item">
            <h4>4. 支付方式 (paymentMethod)</h4>
            <ul>
              <li><strong>银行卡</strong>: 显示银行名称、银行卡号字段</li>
              <li><strong>支付宝</strong>: 显示支付宝账户字段</li>
              <li><strong>微信支付</strong>: 显示微信账户字段</li>
            </ul>
          </div>
          
          <div class="logic-item">
            <h4>5. 高级配置 (多重条件)</h4>
            <ul>
              <li><strong>企业用户 + VIP</strong>: 可以启用高级配置</li>
              <li><strong>启用高级配置</strong>: 显示配置类型选择器</li>
              <li><strong>有配置类型</strong>: 显示配置详情输入框</li>
            </ul>
          </div>
        </div>
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

    <!-- 技术要点说明 -->
    <div class="tech-points">
      <el-card shadow="never">
        <template #header>
          <span>技术要点</span>
        </template>
        
        <div class="tech-list">
          <div class="tech-item">
            <h5>when 函数</h5>
            <p>使用 <code>when: (model) => condition</code> 定义显示条件</p>
          </div>
          
          <div class="tech-item">
            <h5>dependencies 数组</h5>
            <p>声明字段依赖关系，确保条件变化时及时重新计算</p>
          </div>
          
          <div class="tech-item">
            <h5>watch 监听</h5>
            <p>监听关键字段变化，自动清理不相关的字段数据</p>
          </div>
          
          <div class="tech-item">
            <h5>计算属性</h5>
            <p>使用 computed 动态生成表单项配置，实现响应式条件渲染</p>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.conditional-rendering-demo {
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
  margin-bottom: 15px;
}

.demo-stats {
  display: flex;
  gap: 20px;
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

.logic-explanation,
.data-display,
.tech-points {
  margin-bottom: 20px;
}

.logic-tree {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.logic-item h4 {
  margin: 0 0 10px 0;
  color: #409EFF;
  font-size: 14px;
}

.logic-item ul {
  margin: 0;
  padding-left: 20px;
}

.logic-item li {
  margin-bottom: 8px;
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

.tech-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.tech-item h5 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 14px;
}

.tech-item p {
  margin: 0;
  color: #606266;
  font-size: 13px;
  line-height: 1.5;
}

.tech-item code {
  background-color: #f1f2f3;
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 12px;
  color: #e6a23c;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .conditional-rendering-demo {
    padding: 10px;
  }
  
  .demo-features {
    justify-content: center;
  }
  
  .form-footer {
    flex-direction: column;
    align-items: center;
  }
  
  .tech-list {
    grid-template-columns: 1fr;
  }
  
  .demo-stats {
    justify-content: center;
  }
}
</style>