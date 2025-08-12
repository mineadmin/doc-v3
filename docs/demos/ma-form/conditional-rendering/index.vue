<script setup lang="tsx">
import { ref, computed, watch } from 'vue'
import {ElMessage, ElSelect} from 'element-plus'
import type { MaFormItem as BaseMaFormItem, MaFormOptions, MaFormExpose } from '@mineadmin/form'

// 扩展MaFormItem以支持show、hide属性和dependencies
interface MaFormItem extends BaseMaFormItem {
  show?: (item: MaFormItem, model: any) => boolean
  hide?: (item: MaFormItem, model: any) => boolean
  dependencies?: string[]
}

// 表单数据类型定义
interface FormData {
  userType: string
  personalName: string
  personalAge: string | number
  personalEmail: string
  companyName: string
  companyScale: string
  legalPerson: string
  isVip: boolean
  vipLevel: string
  vipExpireDate: string
  needAddress: boolean
  country: string
  province: string
  city: string
  detailAddress: string
  paymentMethod: string
  bankCard: string
  alipayAccount: string
  enableNotifications: boolean
  emailNotifications: boolean
  smsNotifications: boolean
  remarks: string
  agreeTerms: boolean
}

// 表单数据 - 包含show和hide的演示场景
const formData = ref({
  // 基础信息
  userType: '',
  
  // 个人用户字段
  personalName: '',
  personalAge: 0,
  personalEmail: '',
  
  // 企业用户字段  
  companyName: '',
  companyScale: '',
  legalPerson: '',
  
  // VIP相关字段
  isVip: false,
  vipLevel: '',
  vipExpireDate: '',
  
  // 地址信息
  needAddress: false,
  country: '',
  province: '',
  city: '',
  detailAddress: '',
  
  // 支付方式
  paymentMethod: '',
  bankCard: '',
  alipayAccount: '',
  
  // 通知设置
  enableNotifications: true,
  emailNotifications: true,
  smsNotifications: false,
  
  // 其他
  remarks: '',
  agreeTerms: false
})

const formRef = ref<MaFormExpose>()

// 监听用户类型变化，自动清空相关字段
watch(() => formData.value.userType, (newType, oldType) => {
  if (newType !== oldType) {
    // 清空个人用户字段
    if (newType !== 'personal') {
      formData.value.personalName = ''
      formData.value.personalAge = 0
      formData.value.personalEmail = ''
    }
    
    // 清空企业用户字段
    if (newType !== 'company') {
      formData.value.companyName = ''
      formData.value.companyScale = ''
      formData.value.legalPerson = ''
    }
    
    // 重置VIP状态
    formData.value.isVip = false
    formData.value.vipLevel = ''
    formData.value.vipExpireDate = ''
  }
})

// 监听VIP状态变化
watch(() => formData.value.isVip, (isVip) => {
  if (!isVip) {
    formData.value.vipLevel = ''
    formData.value.vipExpireDate = ''
  }
})

// 监听地址需求变化
watch(() => formData.value.needAddress, (needAddress) => {
  if (!needAddress) {
    formData.value.country = ''
    formData.value.province = ''
    formData.value.city = ''
    formData.value.detailAddress = ''
  }
})

// 监听支付方式变化
watch(() => formData.value.paymentMethod, (method, oldMethod) => {
  if (method !== oldMethod) {
    formData.value.bankCard = ''
    formData.value.alipayAccount = ''
  }
})

// 监听通知设置变化
watch(() => formData.value.enableNotifications, (enabled) => {
  if (!enabled) {
    formData.value.emailNotifications = false
    formData.value.smsNotifications = false
  }
})

// 表单项配置 - 演示show和hide属性的使用
const formItems = computed((): MaFormItem[] => [
  // 基础字段 - 用户类型选择
  {
    label: '用户类型',
    prop: 'userType',
    render: ()=> ElSelect,
    renderProps: {
      placeholder: '请选择用户类型',
      clearable: true,
      options: [
        { label: '个人用户', value: 'personal' },
        { label: '企业用户', value: 'company' }
      ],
    },
    itemProps: {
      rules: [{ required: true, message: '请选择用户类型', trigger: 'change' }]
    },
    cols: { span: 12 }
  },

  // 个人用户字段 - 使用show属性（推荐方式）
  {
    label: '个人姓名',
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
    // show 函数：不满足条件时不渲染DOM，性能更佳
    show: (item: MaFormItem, model: FormData) => model.userType === 'personal',
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
      placeholder: '请输入年龄',
    },
    itemProps: {
      rules: [{ required: true, message: '请输入年龄', trigger: 'blur' }]
    },
    show: (item: MaFormItem, model: FormData) => model.userType === 'personal',
    dependencies: ['userType'],
    cols: { span: 8 }
  },
  {
    label: '邮箱地址',
    prop: 'personalEmail',
    render: 'input',
    renderProps: { 
      type: 'email',
      placeholder: '请输入邮箱地址',
      clearable: true 
    },
    itemProps: {
      rules: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
      ]
    },
    show: (item: MaFormItem, model: FormData) => model.userType === 'personal',
    dependencies: ['userType'],
    cols: { span: 8 }
  },

  // 企业用户字段 - 使用show属性
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
    show: (item: MaFormItem, model: FormData) => model.userType === 'company',
    dependencies: ['userType'],
    cols: { span: 12 }
  },
  {
    label: '企业规模',
    prop: 'companyScale',
    render: 'select',
    renderProps: { placeholder: '请选择企业规模' ,options: [
        { label: '1-50人', value: 'small' },
        { label: '51-200人', value: 'medium' },
        { label: '201-1000人', value: 'large' },
        { label: '1000+人', value: 'xlarge' }
      ],},
    itemProps: {
      rules: [{ required: true, message: '请选择企业规模', trigger: 'change' }]
    },
    show: (item: MaFormItem, model: FormData) => model.userType === 'company',
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
    show: (item: MaFormItem, model: FormData) => model.userType === 'company',
    dependencies: ['userType'],
    cols: { span: 8 }
  },

  // VIP相关字段 - 级联条件渲染
  {
    label: '开通VIP',
    prop: 'isVip',
    render: 'switch',
    renderProps: {
      'active-text': 'VIP用户',
      'inactive-text': '普通用户'
    },
    // 当选择了用户类型后才显示VIP选项
    show: (item: MaFormItem, model: FormData) => !!model.userType,
    dependencies: ['userType'],
    cols: { span: 8 }
  },
  {
    label: 'VIP等级',
    prop: 'vipLevel',
    render: 'select',
    renderProps: { placeholder: '请选择VIP等级',options: [
        { label: '黄金VIP', value: 'gold' },
        { label: '白金VIP', value: 'platinum' },
        { label: '钻石VIP', value: 'diamond' }
      ], },
    itemProps: {
      rules: [{ required: true, message: '请选择VIP等级', trigger: 'change' }]
    },
    // 级联条件：仅当开通VIP时显示
    show: (item: MaFormItem, model: FormData) => model.isVip === true,
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
    show: (item: MaFormItem, model: FormData) => model.isVip === true,
    dependencies: ['isVip'],
    cols: { span: 8 }
  },

  // 地址信息 - 复杂级联条件
  {
    label: '填写地址信息',
    prop: 'needAddress',
    render: 'checkbox',
    renderSlots: {
      default: () => '需要填写详细地址'
    },
    show: (item: MaFormItem, model: FormData) => !!model.userType,
    dependencies: ['userType'],
    cols: { span: 12 }
  },
  {
    label: '国家',
    prop: 'country',
    render: 'select',
    renderProps: { placeholder: '请选择国家',options: [
        { label: '中国', value: 'china' },
        { label: '美国', value: 'usa' },
        { label: '日本', value: 'japan' }
      ], },
    show: (item: MaFormItem, model: FormData) => model.needAddress === true,
    dependencies: ['needAddress'],
    cols: { span: 8 }
  },
  {
    label: '省份',
    prop: 'province',
    render: 'select',
    renderProps: { placeholder: '请选择省份' ,options: [
        { label: '北京市', value: 'beijing' },
        { label: '上海市', value: 'shanghai' },
        { label: '广东省', value: 'guangdong' },
        { label: '江苏省', value: 'jiangsu' }
      ],},
    // 多重条件：需要地址 且 选择了中国
    show: (item: MaFormItem, model: FormData) => model.needAddress === true && model.country === 'china',
    dependencies: ['needAddress', 'country'],
    cols: { span: 8 }
  },
  {
    label: '城市',
    prop: 'city',
    render: 'select',
    renderProps: { placeholder: '请选择城市' ,options: [
        { label: '北京市', value: 'beijing' },
        { label: '上海市', value: 'shanghai' },
        { label: '深圳市', value: 'shenzhen' },
        { label: '广州市', value: 'guangzhou' }
      ],},
    // 复杂条件：需要地址 且 选择了省份
    show: (item: MaFormItem, model: FormData) => model.needAddress === true && !!model.province,
    dependencies: ['needAddress', 'province'],
    cols: { span: 8 }
  },
  {
    label: '详细地址',
    prop: 'detailAddress',
    render: 'input',
    renderProps: { 
      type: 'textarea',
      placeholder: '请输入详细地址',
      rows: 3
    },
    show: (item: MaFormItem, model: FormData) => model.needAddress === true,
    dependencies: ['needAddress'],
    cols: { span: 24 }
  },

  // 支付方式 - 基于VIP状态的条件渲染
  {
    label: '支付方式',
    prop: 'paymentMethod',
    render: 'radio',
    renderProps:{
      options: [
        { label: '银行卡', value: 'bank' },
        { label: '支付宝', value: 'alipay' }
      ],
    },
    // 仅VIP用户可选择支付方式
    show: (item: MaFormItem, model: FormData) => model.isVip === true,
    dependencies: ['isVip'],
    cols: { span: 12 }
  },
  {
    label: '银行卡号',
    prop: 'bankCard',
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
    show: (item: MaFormItem, model: FormData) => model.paymentMethod === 'bank',
    dependencies: ['paymentMethod'],
    cols: { span: 12 }
  },
  {
    label: '支付宝账户',
    prop: 'alipayAccount',
    render: 'input',
    renderProps: { 
      placeholder: '请输入支付宝账户',
      clearable: true 
    },
    itemProps: {
      rules: [{ required: true, message: '请输入支付宝账户', trigger: 'blur' }]
    },
    show: (item: MaFormItem, model: FormData) => model.paymentMethod === 'alipay',
    dependencies: ['paymentMethod'],
    cols: { span: 12 }
  },

  // 通知设置 - 演示hide属性的使用场景
  {
    label: '启用通知',
    prop: 'enableNotifications',
    render: 'switch',
    renderProps: {
      'active-text': '开启',
      'inactive-text': '关闭'
    },
    show: (item: MaFormItem, model: FormData) => !!model.userType,
    dependencies: ['userType'],
    cols: { span: 8 }
  },
  {
    label: '邮件通知',
    prop: 'emailNotifications',
    render: 'switch',
    renderProps: {
      'active-text': '开启',
      'inactive-text': '关闭'
    },
    // hide 函数：不满足条件时隐藏DOM但仍渲染，适用于频繁切换的场景
    hide: (item: MaFormItem, model: FormData) => !model.enableNotifications,
    dependencies: ['enableNotifications'],
    cols: { span: 8 }
  },
  {
    label: '短信通知',
    prop: 'smsNotifications',
    render: 'switch',
    renderProps: {
      'active-text': '开启',
      'inactive-text': '关闭'
    },
    // 使用hide属性，当通知被禁用时隐藏但保留DOM结构
    hide: (item: MaFormItem, model: FormData) => !model.enableNotifications,
    dependencies: ['enableNotifications'],
    cols: { span: 8 }
  },

  // 其他字段
  {
    label: '备注',
    prop: 'remarks',
    render: 'input',
    renderProps: {
      type: 'textarea',
      placeholder: '请输入备注（可选）',
      rows: 3,
      'show-word-limit': true,
      maxlength: 200
    },
    show: (item: MaFormItem, model: FormData) => !!model.userType,
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
    show: (item: MaFormItem, model: FormData) => !!model.userType,
    dependencies: ['userType'],
    cols: { span: 24 }
  }
])

// 计算当前显示的字段数量
const visibleFieldsCount = computed(() => {
  return formItems.value.filter((item: any) => {
    if (item.show) {
      return item.show(item, formData.value)
    }
    if (item.hide) {
      return !item.hide(item, formData.value)
    }
    return true
  }).length
})

// 计算隐藏的字段数量（使用hide属性的字段）
const hiddenFieldsCount = computed(() => {
  return formItems.value.filter((item: any) => {
    if (item.hide) {
      return item.hide(item, formData.value)
    }
    return false
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
      <p>演示 ma-form 的条件渲染功能，通过 <code>show</code> 和 <code>hide</code> 属性配合 <code>dependencies</code> 数组实现字段的动态显示隐藏。</p>
      <div class="demo-features">
        <el-tag type="primary" size="small">show属性</el-tag>
        <el-tag type="success" size="small">hide属性</el-tag>
        <el-tag type="info" size="small">级联条件</el-tag>
        <el-tag type="warning" size="small">多重条件</el-tag>
        <el-tag type="danger" size="small">自动清理</el-tag>
      </div>
      <div class="demo-stats">
        <el-statistic title="当前显示字段" :value="visibleFieldsCount" />
        <el-statistic title="隐藏字段数量" :value="hiddenFieldsCount" />
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
        <template #footer>
          <div class="form-footer">
            <el-button @click="handleClear">清空</el-button>
            <el-button @click="handleReset">重置</el-button>
            <el-button type="primary" @click="handleSubmit">提交</el-button>
          </div>
        </template>
      </ma-form>
    </div>

    <!-- 核心API说明 -->
    <div class="api-explanation">
      <el-card shadow="never">
        <template #header>
          <span>条件渲染核心API</span>
        </template>
        
        <div class="api-list">
          <div class="api-item">
            <h4>show 属性（推荐）</h4>
            <div class="code-block">
              <code>show: (item: MaFormItem, model) => model.userType === 'personal'</code>
            </div>
            <p>不满足条件时不渲染DOM，性能更佳，适用于大部分场景</p>
          </div>
          
          <div class="api-item">
            <h4>hide 属性</h4>
            <div class="code-block">
              <code>hide: (item: MaFormItem, model) => !model.enableNotifications</code>
            </div>
            <p>不满足条件时隐藏DOM但仍渲染，适用于频繁切换的场景</p>
          </div>
          
          <div class="api-item">
            <h4>dependencies 数组</h4>
            <div class="code-block">
              <code>dependencies: ['userType', 'isVip']</code>
            </div>
            <p>声明字段依赖关系，当依赖字段变化时会重新计算条件</p>
          </div>
          
          <div class="api-item">
            <h4>多重条件示例</h4>
            <div class="code-block">
              <code>show: (item: MaFormItem, model) => model.needAddress && model.country === 'china'</code>
            </div>
            <p>支持复杂的条件逻辑，实现多重依赖的级联显示</p>
          </div>
        </div>
      </el-card>
    </div>

    <!-- show vs hide 对比说明 -->
    <div class="comparison-section">
      <el-card shadow="never">
        <template #header>
          <span>show vs hide 对比</span>
        </template>
        
        <div class="comparison-grid">
          <div class="comparison-item">
            <h4>show 属性</h4>
            <ul class="comparison-features">
              <li class="feature-item positive">✓ 不渲染DOM，性能最佳</li>
              <li class="feature-item positive">✓ 不占用页面空间</li>
              <li class="feature-item positive">✓ 适用于大部分场景</li>
              <li class="feature-item neutral">• 初始化时可能有轻微闪烁</li>
            </ul>
            <div class="usage-scenario">
              <strong>使用场景：</strong>根据用户类型显示不同表单字段
            </div>
          </div>
          
          <div class="comparison-item">
            <h4>hide 属性</h4>
            <ul class="comparison-features">
              <li class="feature-item positive">✓ 切换流畅，无闪烁</li>
              <li class="feature-item positive">✓ 保持表单结构稳定</li>
              <li class="feature-item negative">✗ 仍会渲染DOM</li>
              <li class="feature-item negative">✗ 占用页面空间</li>
            </ul>
            <div class="usage-scenario">
              <strong>使用场景：</strong>通知设置等频繁切换的功能
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 条件逻辑流程 -->
    <div class="logic-flow">
      <el-card shadow="never">
        <template #header>
          <span>条件渲染流程图</span>
        </template>
        
        <div class="flow-steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h5>选择用户类型</h5>
              <p>显示对应的用户信息字段</p>
            </div>
          </div>
          
          <div class="step-arrow">→</div>
          
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h5>开通VIP（可选）</h5>
              <p>显示VIP等级和到期时间</p>
            </div>
          </div>
          
          <div class="step-arrow">→</div>
          
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h5>通知设置</h5>
              <p>使用hide属性平滑切换</p>
            </div>
          </div>
          
          <div class="step-arrow">→</div>
          
          <div class="step">
            <div class="step-number">4</div>
            <div class="step-content">
              <h5>支付方式（VIP专享）</h5>
              <p>根据支付方式显示对应字段</p>
            </div>
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
  </div>
</template>

<style scoped>
.conditional-rendering-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.demo-description {
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.demo-description h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
}

.demo-description p {
  margin: 0 0 16px 0;
  font-size: 14px;
  line-height: 1.6;
  opacity: 0.9;
}

.demo-description code {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
}

.demo-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.demo-stats {
  display: flex;
  gap: 20px;
}

.demo-form {
  margin-bottom: 32px;
}

.form-footer {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px 0;
}

.api-explanation,
.comparison-section,
.logic-flow,
.data-display {
  margin-bottom: 24px;
}

.api-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.api-item h4 {
  margin: 0 0 12px 0;
  color: #409EFF;
  font-size: 16px;
  font-weight: 600;
}

.code-block {
  background-color: #f6f8fa;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  padding: 12px 16px;
  margin: 8px 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.code-block code {
  color: #d73a49;
  font-size: 14px;
  font-weight: 500;
}

.api-item p {
  margin: 8px 0 0 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
}

.comparison-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.comparison-item {
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background-color: #fafafa;
}

.comparison-item h4 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.comparison-features {
  list-style: none;
  padding: 0;
  margin: 0 0 16px 0;
}

.feature-item {
  padding: 6px 0;
  font-size: 14px;
  line-height: 1.5;
}

.feature-item.positive {
  color: #67c23a;
}

.feature-item.negative {
  color: #f56c6c;
}

.feature-item.neutral {
  color: #909399;
}

.usage-scenario {
  padding: 12px;
  background-color: #fff;
  border-radius: 4px;
  border-left: 4px solid #409EFF;
  font-size: 13px;
  line-height: 1.5;
}

.flow-steps {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.step {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 200px;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409EFF, #67C23A);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.step-content h5 {
  margin: 0 0 4px 0;
  color: #303133;
  font-size: 14px;
  font-weight: 600;
}

.step-content p {
  margin: 0;
  color: #606266;
  font-size: 12px;
  line-height: 1.4;
}

.step-arrow {
  color: #C0C4CC;
  font-size: 18px;
  font-weight: bold;
  flex-shrink: 0;
}

.data-json {
  background-color: #f6f8fa;
  border: 1px solid #e1e4e8;
  padding: 16px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.5;
  color: #24292e;
  overflow-x: auto;
  white-space: pre-wrap;
  max-height: 400px;
  overflow-y: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .conditional-rendering-demo {
    padding: 16px;
  }
  
  .demo-description {
    padding: 16px;
  }
  
  .demo-features {
    justify-content: center;
  }
  
  .form-footer {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  
  .form-footer .el-button {
    width: 100%;
    max-width: 200px;
  }
  
  .comparison-grid {
    grid-template-columns: 1fr;
  }
  
  .flow-steps {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .step {
    width: 100%;
    min-width: unset;
  }
  
  .step-arrow {
    transform: rotate(90deg);
    align-self: center;
  }
  
  .demo-stats {
    justify-content: center;
  }
  
  .code-block {
    padding: 8px 12px;
  }
  
  .code-block code {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .conditional-rendering-demo {
    padding: 12px;
  }
  
  .data-json {
    font-size: 11px;
    padding: 12px;
  }
  
  .step-content h5 {
    font-size: 13px;
  }
  
  .step-content p {
    font-size: 11px;
  }
}
</style>