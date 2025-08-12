<script setup lang="tsx">
import { ref, computed, onMounted, onUnmounted, h } from 'vue'
import { ElMessage } from 'element-plus'
import type { MaFormExpose } from "@mineadmin/form"

// 响应式状态管理
const isMobile = ref(false)
const screenWidth = ref(0)
const formRef = ref<MaFormExpose>()

// 检测移动端状态 - 模拟 MaForm 的 isMobileState() 方法
const isMobileState = () => {
  return screenWidth.value <= 768
}

// 响应式断点定义
const breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200
}

// 获取当前设备类型
const deviceType = computed(() => {
  if (screenWidth.value <= breakpoints.mobile) return 'mobile'
  if (screenWidth.value <= breakpoints.tablet) return 'tablet'
  return 'desktop'
})

// 窗口尺寸变化处理
const handleResize = () => {
  screenWidth.value = window.innerWidth
  isMobile.value = isMobileState()
  
  // 动态更新表单配置
  updateFormConfig()
}

// 移动端优化的表单数据
const formData = ref({
  // 用户基本信息
  avatar: '',
  username: '',
  email: '',
  phone: '',
  
  // 个人信息
  realName: '',
  gender: '',
  birthday: '',
  
  // 地址信息
  region: [],
  address: '',
  
  // 职业信息
  company: '',
  position: '',
  industry: '',
  experience: 1,
  
  // 偏好设置
  notifications: {
    email: true,
    sms: false,
    push: true
  },
  theme: 'light',
  language: 'zh-CN',
  
  // 联系方式
  contactMethods: ['email'],
  emergencyContact: {
    name: '',
    phone: '',
    relationship: ''
  },
  
  // 其他信息
  hobbies: [],
  bio: '',
  agreeTerms: false
})

// 动态表单配置 - 根据屏幕尺寸调整
const formOptions = ref({
  labelWidth: '120px',
  labelPosition: 'right',
  size: 'default',
  gutter: 20,
  justify: 'start',
  align: 'top'
})

// 更新表单配置
const updateFormConfig = () => {
  if (isMobile.value) {
    // 移动端配置
    formOptions.value = {
      labelWidth: 'auto',
      labelPosition: 'top',  // 移动端标签在上方
      size: 'default',
      gutter: 16,
      justify: 'start',
      align: 'top'
    }
  } else if (deviceType.value === 'tablet') {
    // 平板配置
    formOptions.value = {
      labelWidth: '100px',
      labelPosition: 'right',
      size: 'default',
      gutter: 18,
      justify: 'start',
      align: 'top'
    }
  } else {
    // 桌面端配置
    formOptions.value = {
      labelWidth: '120px',
      labelPosition: 'right',
      size: 'default',
      gutter: 20,
      justify: 'start',
      align: 'top'
    }
  }
}

// 响应式表单项配置
const formItems = computed(() => [
  // 头像上传 - 移动端优化
  {
    label: '头像',
    prop: 'avatar',
    render: 'upload',
    renderProps: {
      action: '#',
      'list-type': isMobile.value ? 'picture' : 'picture-card',
      'auto-upload': false,
      accept: 'image/*',
      limit: 1
    },
    cols: { 
      span: isMobile.value ? 24 : 8,
      xs: 24, sm: 12, md: 8, lg: 6, xl: 6
    }
  },
  
  // 基本信息组
  {
    label: '用户名',
    prop: 'username',
    render: 'input',
    renderProps: {
      placeholder: '请输入用户名',
      clearable: true,
      prefixIcon: 'User'
    },
    itemProps: {
      rules: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
      ]
    },
    cols: { 
      span: isMobile.value ? 24 : 12,
      xs: 24, sm: 12, md: 12, lg: 8, xl: 8
    }
  },
  
  {
    label: '邮箱',
    prop: 'email',
    render: 'input',
    renderProps: {
      type: 'email',
      placeholder: '请输入邮箱地址',
      clearable: true,
      prefixIcon: 'Message'
    },
    itemProps: {
      rules: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
      ]
    },
    cols: { 
      span: isMobile.value ? 24 : 12,
      xs: 24, sm: 12, md: 12, lg: 8, xl: 8
    }
  },
  
  {
    label: '手机号',
    prop: 'phone',
    render: 'input',
    renderProps: {
      placeholder: '请输入手机号',
      clearable: true,
      prefixIcon: 'Phone'
    },
    itemProps: {
      rules: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
      ]
    },
    cols: { 
      span: isMobile.value ? 24 : 12,
      xs: 24, sm: 12, md: 12, lg: 8, xl: 8
    }
  },
  
  // 个人信息
  {
    label: '真实姓名',
    prop: 'realName',
    render: 'input',
    renderProps: {
      placeholder: '请输入真实姓名',
      clearable: true
    },
    cols: { 
      span: isMobile.value ? 24 : 8,
      xs: 24, sm: 8, md: 8, lg: 6, xl: 6
    }
  },
  
  {
    label: '性别',
    prop: 'gender',
    render: isMobile.value 
      ? ({ formData }) => (
          <el-radio-group>
            {[
              { label: '男', value: 'male' },
              { label: '女', value: 'female' },
              { label: '其他', value: 'other' }
            ].map(item => {
              return <el-radio label={item.value} value={item.value}>{item.label}</el-radio>
            })}
          </el-radio-group>
        )
      : 'select',
    renderProps: isMobile.value ? {} : {
      placeholder: '请选择性别'
    },
    renderSlots: isMobile.value ? undefined : {
      default: () => [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
        { label: '其他', value: 'other' }
      ].map(item => h('el-option', { key: item.value, label: item.label, value: item.value }))
    },
    cols: { 
      span: isMobile.value ? 24 : 8,
      xs: 24, sm: 8, md: 8, lg: 6, xl: 6
    }
  },
  
  {
    label: '出生日期',
    prop: 'birthday',
    render: 'datePicker',
    renderProps: {
      type: 'date',
      placeholder: '请选择出生日期',
      format: 'YYYY-MM-DD',
      'value-format': 'YYYY-MM-DD',
      style: { width: '100%' }
    },
    cols: { 
      span: isMobile.value ? 24 : 8,
      xs: 24, sm: 8, md: 8, lg: 6, xl: 6
    }
  },
  
  // 地址信息 - 移动端使用级联选择器
  {
    label: '所在地区',
    prop: 'region',
    render: 'cascader',
    renderProps: {
      placeholder: '请选择所在地区',
      options: [
        {
          value: 'guangdong',
          label: '广东省',
          children: [
            {
              value: 'shenzhen',
              label: '深圳市',
              children: [
                { value: 'nanshan', label: '南山区' },
                { value: 'futian', label: '福田区' },
                { value: 'luohu', label: '罗湖区' }
              ]
            },
            {
              value: 'guangzhou',
              label: '广州市',
              children: [
                { value: 'tianhe', label: '天河区' },
                { value: 'yuexiu', label: '越秀区' }
              ]
            }
          ]
        },
        {
          value: 'beijing',
          label: '北京市',
          children: [
            {
              value: 'beijing-city',
              label: '北京市',
              children: [
                { value: 'chaoyang', label: '朝阳区' },
                { value: 'haidian', label: '海淀区' }
              ]
            }
          ]
        }
      ],
      style: { width: '100%' },
      clearable: true,
      'show-all-levels': false,
      props: {
        expandTrigger: isMobile.value ? 'click' : 'hover'
      }
    },
    cols: { 
      span: isMobile.value ? 24 : 12,
      xs: 24, sm: 12, md: 12, lg: 8, xl: 8
    }
  },
  
  {
    label: '详细地址',
    prop: 'address',
    render: 'input',
    renderProps: {
      type: isMobile.value ? 'textarea' : 'input',
      placeholder: '请输入详细地址',
      rows: isMobile.value ? 2 : undefined,
      clearable: true
    },
    cols: { 
      span: isMobile.value ? 24 : 12,
      xs: 24, sm: 12, md: 12, lg: 8, xl: 8
    }
  },
  
  // 职业信息
  {
    label: '公司名称',
    prop: 'company',
    render: 'input',
    renderProps: {
      placeholder: '请输入公司名称',
      clearable: true
    },
    cols: { 
      span: isMobile.value ? 24 : 8,
      xs: 24, sm: 12, md: 8, lg: 6, xl: 6
    }
  },
  
  {
    label: '职位',
    prop: 'position',
    render: 'input',
    renderProps: {
      placeholder: '请输入职位',
      clearable: true
    },
    cols: { 
      span: isMobile.value ? 24 : 8,
      xs: 24, sm: 12, md: 8, lg: 6, xl: 6
    }
  },
  
  {
    label: '行业',
    prop: 'industry',
    render: 'select',
    renderProps: {
      placeholder: '请选择行业',
      clearable: true,
      filterable: true
    },
    renderSlots: {
      default: () => [
        { label: '互联网/IT', value: 'it' },
        { label: '金融', value: 'finance' },
        { label: '教育', value: 'education' },
        { label: '医疗健康', value: 'healthcare' },
        { label: '制造业', value: 'manufacturing' },
        { label: '其他', value: 'other' }
      ].map(item => h('el-option', {
        key: item.value,
        label: item.label,
        value: item.value
      }))
    },
    cols: { 
      span: isMobile.value ? 24 : 8,
      xs: 24, sm: 12, md: 8, lg: 6, xl: 6
    }
  },
  
  {
    label: '工作经验',
    prop: 'experience',
    render: 'slider',
    renderProps: {
      min: 0,
      max: 20,
      step: 1,
      'show-tooltip': true,
      'format-tooltip': (value: number) => `${value} 年`,
      marks: {
        0: '应届',
        5: '5年',
        10: '10年',
        20: '20年+'
      }
    },
    cols: { 
      span: isMobile.value ? 24 : 12,
      xs: 24, sm: 24, md: 12, lg: 6, xl: 6
    }
  },
  
  // 偏好设置 - 移动端优化布局
  {
    label: '通知设置',
    prop: 'notifications',
    render: 'custom',
    renderSlots: {
      default: () => h('div', { class: 'notification-settings' }, [
        h('div', { class: 'notification-item' }, [
          h('span', '邮件通知'),
          h('el-switch', {
            modelValue: formData.value.notifications.email,
            'onUpdate:modelValue': (value: boolean) => {
              formData.value.notifications.email = value
            }
          })
        ]),
        h('div', { class: 'notification-item' }, [
          h('span', '短信通知'),
          h('el-switch', {
            modelValue: formData.value.notifications.sms,
            'onUpdate:modelValue': (value: boolean) => {
              formData.value.notifications.sms = value
            }
          })
        ]),
        h('div', { class: 'notification-item' }, [
          h('span', '推送通知'),
          h('el-switch', {
            modelValue: formData.value.notifications.push,
            'onUpdate:modelValue': (value: boolean) => {
              formData.value.notifications.push = value
            }
          })
        ])
      ])
    },
    cols: { 
      span: isMobile.value ? 24 : 12,
      xs: 24, sm: 12, md: 12, lg: 8, xl: 8
    }
  },
  
  {
    label: '主题',
    prop: 'theme',
    render: ({ formData }) => (
      <el-radio-group>
        {[
          { label: '浅色', value: 'light' },
          { label: '深色', value: 'dark' },
          { label: '自动', value: 'auto' }
        ].map(item => {
          return <el-radio label={item.value} value={item.value}>{item.label}</el-radio>
        })}
      </el-radio-group>
    ),
    cols: { 
      span: isMobile.value ? 24 : 12,
      xs: 24, sm: 12, md: 12, lg: 8, xl: 8
    }
  },
  
  {
    label: '语言',
    prop: 'language',
    render: 'select',
    renderProps: {
      placeholder: '请选择语言'
    },
    renderSlots: {
      default: () => [
        { label: '简体中文', value: 'zh-CN' },
        { label: '繁體中文', value: 'zh-TW' },
        { label: 'English', value: 'en-US' },
        { label: '日本語', value: 'ja-JP' }
      ].map(item => h('el-option', {
        key: item.value,
        label: item.label,
        value: item.value
      }))
    },
    cols: { 
      span: isMobile.value ? 24 : 8,
      xs: 24, sm: 8, md: 8, lg: 4, xl: 4
    }
  },
  
  // 联系方式
  {
    label: '联系方式',
    prop: 'contactMethods',
    render: 'checkboxGroup',
    renderSlots: {
      default: () => [
        { label: '邮箱', value: 'email' },
        { label: '短信', value: 'sms' },
        { label: '电话', value: 'phone' },
        { label: '微信', value: 'wechat' }
      ].map(item => h('el-checkbox', {
        key: item.value,
        label: item.value,
        value: item.value
      }, () => item.label))
    },
    cols: { 
      span: 24,
      xs: 24, sm: 24, md: 12, lg: 8, xl: 8
    }
  },
  
  // 紧急联系人
  {
    label: '紧急联系人',
    prop: 'emergencyContact.name',
    render: 'input',
    renderProps: {
      placeholder: '请输入紧急联系人姓名',
      clearable: true
    },
    cols: { 
      span: isMobile.value ? 24 : 8,
      xs: 24, sm: 8, md: 8, lg: 6, xl: 6
    }
  },
  
  {
    label: '联系人电话',
    prop: 'emergencyContact.phone',
    render: 'input',
    renderProps: {
      placeholder: '请输入联系人电话',
      clearable: true
    },
    cols: { 
      span: isMobile.value ? 24 : 8,
      xs: 24, sm: 8, md: 8, lg: 6, xl: 6
    }
  },
  
  {
    label: '关系',
    prop: 'emergencyContact.relationship',
    render: 'select',
    renderProps: {
      placeholder: '请选择关系',
      clearable: true
    },
    renderSlots: {
      default: () => [
        { label: '父亲', value: 'father' },
        { label: '母亲', value: 'mother' },
        { label: '配偶', value: 'spouse' },
        { label: '子女', value: 'child' },
        { label: '朋友', value: 'friend' },
        { label: '其他', value: 'other' }
      ].map(item => h('el-option', {
        key: item.value,
        label: item.label,
        value: item.value
      }))
    },
    cols: { 
      span: isMobile.value ? 24 : 8,
      xs: 24, sm: 8, md: 8, lg: 6, xl: 6
    }
  },
  
  // 爱好
  {
    label: '兴趣爱好',
    prop: 'hobbies',
    render: 'checkboxGroup',
    renderSlots: {
      default: () => [
        { label: '阅读', value: 'reading' },
        { label: '运动', value: 'sports' },
        { label: '音乐', value: 'music' },
        { label: '旅行', value: 'travel' },
        { label: '摄影', value: 'photography' },
        { label: '烹饪', value: 'cooking' },
        { label: '编程', value: 'coding' },
        { label: '游戏', value: 'gaming' }
      ].map(item => h('el-checkbox', {
        key: item.value,
        label: item.value,
        value: item.value
      }, () => item.label))
    },
    cols: { 
      span: 24,
      xs: 24, sm: 24, md: 24, lg: 12, xl: 12
    }
  },
  
  // 个人简介
  {
    label: '个人简介',
    prop: 'bio',
    render: 'input',
    renderProps: {
      type: 'textarea',
      placeholder: '请输入个人简介',
      rows: isMobile.value ? 3 : 4,
      'show-word-limit': true,
      maxlength: 500
    },
    cols: { span: 24 }
  },
  
  // 同意条款
  {
    label: '用户协议',
    prop: 'agreeTerms',
    render: 'checkbox',
    renderSlots: {
      default: () => '我已阅读并同意用户协议和隐私政策'
    },
    itemProps: {
      rules: [
        { 
          validator: (rule: any, value: boolean, callback: Function) => {
            if (!value) {
              callback(new Error('请同意用户协议'))
            } else {
              callback()
            }
          }, 
          trigger: 'change' 
        }
      ]
    },
    cols: { span: 24 }
  }
])

// 移动端特殊处理的提交方法
const handleMobileSubmit = async () => {
  try {
    // 移动端提交时显示加载状态
    formRef.value?.setLoadingState(true)
    
    // 模拟移动端网络延迟
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const isValid = await formRef.value?.getElFormRef()?.validate()
    
    if (isValid) {
      ElMessage.success({
        message: '移动端表单提交成功！',
        duration: 2000
      })
      
      console.log('移动端表单数据:', formData.value)
      console.log('设备类型:', deviceType.value)
      console.log('屏幕宽度:', screenWidth.value)
    }
  } catch (error) {
    ElMessage.error('表单验证失败，请检查输入内容')
  } finally {
    formRef.value?.setLoadingState(false)
  }
}

// 重置表单
const resetForm = () => {
  formRef.value?.getElFormRef()?.resetFields()
  ElMessage.info('表单已重置')
}

// 预览移动端效果
const previewMobile = () => {
  const demoContainer = document.querySelector('.mobile-responsive-demo')
  if (demoContainer) {
    demoContainer.classList.toggle('mobile-preview')
    ElMessage.info(demoContainer.classList.contains('mobile-preview') ? '切换到移动端预览' : '切换到桌面端预览')
  }
}

// 生命周期管理
onMounted(() => {
  screenWidth.value = window.innerWidth
  isMobile.value = isMobileState()
  updateFormConfig()
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="mobile-responsive-demo">
    <!-- 演示说明 -->
    <div class="demo-description">
      <h3>移动端响应式演示</h3>
      <p>展示 MaForm 在不同屏幕尺寸下的响应式行为，包括移动端优化、触摸友好交互和自适应布局。</p>
      <div class="demo-features">
        <el-tag type="info" size="small">响应式布局</el-tag>
        <el-tag type="success" size="small">移动端优化</el-tag>
        <el-tag type="warning" size="small">触摸友好</el-tag>
        <el-tag type="danger" size="small">设备适配</el-tag>
        <el-tag size="small">断点管理</el-tag>
      </div>
    </div>

    <!-- 设备信息面板 -->
    <div class="device-info-panel">
      <el-card class="device-card">
        <div class="device-info">
          <div class="info-item">
            <span class="info-label">设备类型：</span>
            <el-tag :type="deviceType === 'mobile' ? 'danger' : deviceType === 'tablet' ? 'warning' : 'success'">
              {{ deviceType === 'mobile' ? '手机' : deviceType === 'tablet' ? '平板' : '桌面' }}
            </el-tag>
          </div>
          <div class="info-item">
            <span class="info-label">屏幕宽度：</span>
            <span class="info-value">{{ screenWidth }}px</span>
          </div>
          <div class="info-item">
            <span class="info-label">移动端状态：</span>
            <el-tag :type="isMobile ? 'danger' : 'success'">
              {{ isMobile ? '是' : '否' }}
            </el-tag>
          </div>
          <div class="info-item">
            <span class="info-label">标签位置：</span>
            <span class="info-value">{{ formOptions.labelPosition }}</span>
          </div>
        </div>
        <div class="device-actions">
          <el-button size="small" @click="previewMobile">
            {{ isMobile ? '桌面预览' : '移动预览' }}
          </el-button>
          <el-button size="small" @click="handleResize">刷新检测</el-button>
        </div>
      </el-card>
    </div>

    <!-- 响应式表单 -->
    <ma-form 
      ref="formRef"
      v-model="formData" 
      :options="formOptions"
      :items="formItems"
      class="responsive-form"
    >
      <!-- 移动端优化的底部操作栏 -->
      <template #footer>
        <div class="form-footer" :class="{ 'mobile-footer': isMobile }">
          <el-button @click="resetForm" :size="isMobile ? 'large' : 'default'">
            重置
          </el-button>
          <el-button 
            type="primary" 
            @click="handleMobileSubmit" 
            :size="isMobile ? 'large' : 'default'"
            class="submit-btn"
          >
            提交表单
          </el-button>
        </div>
      </template>
    </ma-form>

    <!-- 响应式数据展示 -->
    <div class="responsive-data-display">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>响应式状态数据</span>
            <el-button 
              size="small" 
              type="text" 
              @click="() => {}"
            >
              刷新
            </el-button>
          </div>
        </template>
        
        <div class="responsive-info">
          <div class="info-grid">
            <div class="info-block">
              <h4>断点信息</h4>
              <ul>
                <li>移动端: ≤{{ breakpoints.mobile }}px</li>
                <li>平板: ≤{{ breakpoints.tablet }}px</li>
                <li>桌面: >{{ breakpoints.tablet }}px</li>
              </ul>
            </div>
            
            <div class="info-block">
              <h4>当前配置</h4>
              <ul>
                <li>标签宽度: {{ formOptions.labelWidth }}</li>
                <li>标签位置: {{ formOptions.labelPosition }}</li>
                <li>栅格间距: {{ formOptions.gutter }}px</li>
                <li>组件尺寸: {{ formOptions.size }}</li>
              </ul>
            </div>
            
            <div class="info-block">
              <h4>优化特性</h4>
              <ul>
                <li v-if="isMobile">✅ 移动端标签上置</li>
                <li v-if="isMobile">✅ 触摸友好按钮</li>
                <li v-if="isMobile">✅ 全宽度输入框</li>
                <li v-if="!isMobile">✅ 桌面端优化布局</li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- 表单数据预览 -->
        <div class="form-data-preview" v-if="!isMobile">
          <h4>表单数据预览：</h4>
          <pre class="data-json">{{ JSON.stringify(formData, null, 2) }}</pre>
        </div>
        
        <!-- 移动端简化数据展示 -->
        <div class="mobile-data-summary" v-else>
          <h4>数据摘要：</h4>
          <div class="summary-items">
            <div class="summary-item">
              <span>用户名：</span>
              <span>{{ formData.username || '未填写' }}</span>
            </div>
            <div class="summary-item">
              <span>邮箱：</span>
              <span>{{ formData.email || '未填写' }}</span>
            </div>
            <div class="summary-item">
              <span>手机号：</span>
              <span>{{ formData.phone || '未填写' }}</span>
            </div>
            <div class="summary-item">
              <span>已选爱好：</span>
              <span>{{ formData.hobbies.length }} 项</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.mobile-responsive-demo {
  max-width: 1200px;
  margin: 0 auto;
  transition: all 0.3s ease;
}

/* 移动端预览模式 */
.mobile-responsive-demo.mobile-preview {
  max-width: 375px;
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

.device-info-panel {
  margin-bottom: 20px;
}

.device-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.device-card :deep(.el-card__body) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.device-info {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-label {
  font-size: 14px;
  opacity: 0.9;
}

.info-value {
  font-weight: 500;
}

.device-actions {
  display: flex;
  gap: 12px;
}

.responsive-form {
  margin-bottom: 24px;
}

.form-footer {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px 0;
}

.form-footer.mobile-footer {
  position: sticky;
  bottom: 0;
  background: white;
  border-top: 1px solid #ebeef5;
  margin: 0 -16px -16px;
  padding: 16px;
  z-index: 10;
}

.form-footer.mobile-footer .submit-btn {
  flex: 1;
}

.responsive-data-display {
  margin-top: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.responsive-info {
  margin-bottom: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.info-block h4 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 14px;
  font-weight: 500;
  border-bottom: 2px solid #409EFF;
  padding-bottom: 6px;
}

.info-block ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-block li {
  padding: 4px 0;
  color: #606266;
  font-size: 13px;
}

.form-data-preview h4 {
  margin: 20px 0 12px 0;
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
  max-height: 300px;
  overflow-y: auto;
}

.mobile-data-summary h4 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 14px;
}

.summary-items {
  display: grid;
  gap: 8px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: #f9f9f9;
  border-radius: 4px;
  font-size: 13px;
}

.summary-item span:first-child {
  color: #909399;
}

.summary-item span:last-child {
  color: #303133;
  font-weight: 500;
}

/* 通知设置自定义样式 */
.notification-settings {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.notification-item span {
  font-size: 14px;
  color: #606266;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .demo-features {
    justify-content: center;
  }
  
  .device-info {
    flex-direction: column;
    gap: 12px;
  }
  
  .info-item {
    justify-content: space-between;
    width: 100%;
  }
  
  .device-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .device-card :deep(.el-card__body) {
    flex-direction: column;
    gap: 16px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .notification-settings {
    gap: 8px;
  }
  
  .notification-item {
    padding: 12px;
  }
  
  .form-footer {
    position: sticky;
    bottom: 0;
    background: white;
    border-top: 1px solid #ebeef5;
    margin: 0 -16px;
    padding: 16px;
    z-index: 10;
  }
  
  .form-footer .el-button {
    flex: 1;
  }
  
  .data-json {
    font-size: 11px;
  }
}

/* 平板端优化 */
@media (min-width: 769px) and (max-width: 1024px) {
  .device-info {
    gap: 16px;
  }
  
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 超大屏优化 */
@media (min-width: 1200px) {
  .mobile-responsive-demo {
    max-width: 1400px;
  }
  
  .info-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>