<script setup lang="ts">
import { ref, computed, h, nextTick } from 'vue'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { MaFormExpose } from "@mineadmin/form"

// 多步骤表单状态管理
const currentStep = ref(0)
const formRef = ref<MaFormExpose>()
const isSubmitting = ref(false)

// 步骤配置
const steps = [
  { title: '基本信息', icon: 'User', description: '填写用户基本资料' },
  { title: '账户设置', icon: 'Setting', description: '配置账户安全信息' },
  { title: '个人偏好', icon: 'StarFilled', description: '设置个人偏好选项' },
  { title: '企业信息', icon: 'OfficeBuilding', description: '填写企业相关信息' },
  { title: '完成注册', icon: 'CircleCheckFilled', description: '确认信息并完成注册' }
]

// 复杂的多步骤表单数据
const formData = ref({
  // 第一步：基本信息
  personalInfo: {
    avatar: '',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '13800138000',
    birthDate: '1990-05-15',
    gender: 'male',
    nationality: 'CN',
    idType: 'id_card',
    idNumber: '440123199005150001',
    address: {
      country: 'CN',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      street: '科技园南区',
      zipCode: '518000'
    }
  },
  
  // 第二步：账户设置
  accountSettings: {
    username: 'johndoe2024',
    password: '',
    confirmPassword: '',
    securityQuestion: 'pet_name',
    securityAnswer: '',
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: 30,
    allowedIPs: [],
    backupEmail: '',
    recoveryPhone: ''
  },
  
  // 第三步：个人偏好
  preferences: {
    theme: 'auto',
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    dateFormat: 'YYYY-MM-DD',
    currency: 'CNY',
    notifications: {
      email: true,
      sms: false,
      push: true,
      marketing: false
    },
    privacy: {
      profileVisibility: 'friends',
      showEmail: false,
      showPhone: false,
      allowSearch: true
    },
    interests: ['technology', 'business', 'design'],
    newsletter: true
  },
  
  // 第四步：企业信息
  companyInfo: {
    companyName: 'TechCorp Solutions',
    businessType: 'technology',
    industry: 'software',
    employeeCount: '11-50',
    establishedYear: 2020,
    registrationNumber: '91440300MA5H1A2X3Y',
    taxNumber: '91440300MA5H1A2X3Y',
    legalRepresentative: 'Jane Smith',
    businessLicense: '',
    address: {
      country: 'CN',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      street: '科技园北区',
      zipCode: '518000'
    },
    contact: {
      department: 'IT部',
      contactPerson: 'John Doe',
      position: 'CTO',
      email: 'contact@techcorp.com',
      phone: '0755-12345678'
    },
    bankInfo: {
      accountName: 'TechCorp Solutions Ltd.',
      bankName: '招商银行',
      accountNumber: '123456789012345678',
      branchName: '深圳科技园支行'
    }
  }
})

// 表单验证规则
const validationRules = {
  personalInfo: {
    'personalInfo.firstName': [
      { required: true, message: '请输入名字', trigger: 'blur' }
    ],
    'personalInfo.lastName': [
      { required: true, message: '请输入姓氏', trigger: 'blur' }
    ],
    'personalInfo.email': [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
    ],
    'personalInfo.phone': [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
    ]
  },
  accountSettings: {
    'accountSettings.username': [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 20, message: '用户名长度为3-20个字符', trigger: 'blur' }
    ],
    'accountSettings.password': [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 8, max: 20, message: '密码长度为8-20个字符', trigger: 'blur' },
      { 
        validator: (rule: any, value: string, callback: Function) => {
          if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
            callback(new Error('密码必须包含大小写字母和数字'))
          } else {
            callback()
          }
        }, 
        trigger: 'blur' 
      }
    ],
    'accountSettings.confirmPassword': [
      { required: true, message: '请确认密码', trigger: 'blur' },
      {
        validator: (rule: any, value: string, callback: Function) => {
          if (value !== formData.value.accountSettings.password) {
            callback(new Error('两次输入的密码不一致'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  }
}

// 动态表单项配置 - 根据当前步骤显示不同内容
const currentFormItems = computed(() => {
  switch (currentStep.value) {
    case 0: // 基本信息
      return [
        {
          label: '头像',
          prop: 'personalInfo.avatar',
          render: 'upload',
          renderProps: {
            action: '#',
            'list-type': 'picture-card',
            'auto-upload': false,
            accept: 'image/*',
            limit: 1
          },
          cols: { span: 24 }
        },
        {
          label: '名字',
          prop: 'personalInfo.firstName',
          render: 'input',
          renderProps: {
            placeholder: '请输入名字',
            clearable: true
          },
          itemProps: {
            rules: validationRules.personalInfo['personalInfo.firstName']
          },
          cols: { span: 12 }
        },
        {
          label: '姓氏',
          prop: 'personalInfo.lastName',
          render: 'input',
          renderProps: {
            placeholder: '请输入姓氏',
            clearable: true
          },
          itemProps: {
            rules: validationRules.personalInfo['personalInfo.lastName']
          },
          cols: { span: 12 }
        },
        {
          label: '邮箱地址',
          prop: 'personalInfo.email',
          render: 'input',
          renderProps: {
            type: 'email',
            placeholder: '请输入邮箱地址',
            clearable: true,
            prefixIcon: 'Message'
          },
          itemProps: {
            rules: validationRules.personalInfo['personalInfo.email']
          },
          cols: { span: 12 }
        },
        {
          label: '手机号码',
          prop: 'personalInfo.phone',
          render: 'input',
          renderProps: {
            placeholder: '请输入手机号码',
            clearable: true,
            prefixIcon: 'Phone'
          },
          itemProps: {
            rules: validationRules.personalInfo['personalInfo.phone']
          },
          cols: { span: 12 }
        },
        {
          label: '出生日期',
          prop: 'personalInfo.birthDate',
          render: 'datePicker',
          renderProps: {
            type: 'date',
            placeholder: '请选择出生日期',
            format: 'YYYY-MM-DD',
            'value-format': 'YYYY-MM-DD',
            style: { width: '100%' }
          },
          cols: { span: 8 }
        },
        {
          label: '性别',
          prop: 'personalInfo.gender',
          render: 'select',
          renderProps: {
            placeholder: '请选择性别'
          },
          renderSlots: {
            default: () => [
              { label: '男', value: 'male' },
              { label: '女', value: 'female' },
              { label: '其他', value: 'other' }
            ].map(item => h('el-option', {
              key: item.value,
              label: item.label,
              value: item.value
            }))
          },
          cols: { span: 8 }
        },
        {
          label: '国籍',
          prop: 'personalInfo.nationality',
          render: 'select',
          renderProps: {
            placeholder: '请选择国籍',
            filterable: true
          },
          renderSlots: {
            default: () => [
              { label: '中国', value: 'CN' },
              { label: '美国', value: 'US' },
              { label: '英国', value: 'GB' },
              { label: '加拿大', value: 'CA' },
              { label: '澳大利亚', value: 'AU' }
            ].map(item => h('el-option', {
              key: item.value,
              label: item.label,
              value: item.value
            }))
          },
          cols: { span: 8 }
        },
        {
          label: '证件类型',
          prop: 'personalInfo.idType',
          render: 'select',
          renderProps: {
            placeholder: '请选择证件类型'
          },
          renderSlots: {
            default: () => [
              { label: '身份证', value: 'id_card' },
              { label: '护照', value: 'passport' },
              { label: '港澳通行证', value: 'hk_mo_pass' },
              { label: '台湾通行证', value: 'tw_pass' }
            ].map(item => h('el-option', {
              key: item.value,
              label: item.label,
              value: item.value
            }))
          },
          cols: { span: 12 }
        },
        {
          label: '证件号码',
          prop: 'personalInfo.idNumber',
          render: 'input',
          renderProps: {
            placeholder: '请输入证件号码',
            clearable: true
          },
          cols: { span: 12 }
        }
      ]

    case 1: // 账户设置
      return [
        {
          label: '用户名',
          prop: 'accountSettings.username',
          render: 'input',
          renderProps: {
            placeholder: '请输入用户名',
            clearable: true,
            prefixIcon: 'User'
          },
          itemProps: {
            rules: validationRules.accountSettings['accountSettings.username']
          },
          cols: { span: 12 }
        },
        {
          label: '密码',
          prop: 'accountSettings.password',
          render: 'input',
          renderProps: {
            type: 'password',
            placeholder: '请输入密码',
            clearable: true,
            'show-password': true,
            prefixIcon: 'Lock'
          },
          itemProps: {
            rules: validationRules.accountSettings['accountSettings.password']
          },
          cols: { span: 12 }
        },
        {
          label: '确认密码',
          prop: 'accountSettings.confirmPassword',
          render: 'input',
          renderProps: {
            type: 'password',
            placeholder: '请再次输入密码',
            clearable: true,
            'show-password': true,
            prefixIcon: 'Lock'
          },
          itemProps: {
            rules: validationRules.accountSettings['accountSettings.confirmPassword']
          },
          cols: { span: 12 }
        },
        {
          label: '安全问题',
          prop: 'accountSettings.securityQuestion',
          render: 'select',
          renderProps: {
            placeholder: '请选择安全问题'
          },
          renderSlots: {
            default: () => [
              { label: '您宠物的名字？', value: 'pet_name' },
              { label: '您的出生地？', value: 'birth_place' },
              { label: '您母亲的姓名？', value: 'mother_name' },
              { label: '您最喜欢的颜色？', value: 'favorite_color' }
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
          prop: 'accountSettings.securityAnswer',
          render: 'input',
          renderProps: {
            placeholder: '请输入安全问题答案',
            clearable: true
          },
          cols: { span: 12 }
        },
        {
          label: '双重认证',
          prop: 'accountSettings.twoFactorAuth',
          render: 'switch',
          renderProps: {
            'active-text': '启用',
            'inactive-text': '禁用'
          },
          cols: { span: 8 }
        },
        {
          label: '登录通知',
          prop: 'accountSettings.loginNotifications',
          render: 'switch',
          renderProps: {
            'active-text': '开启',
            'inactive-text': '关闭'
          },
          cols: { span: 8 }
        },
        {
          label: '会话超时',
          prop: 'accountSettings.sessionTimeout',
          render: 'select',
          renderProps: {
            placeholder: '请选择会话超时时间'
          },
          renderSlots: {
            default: () => [
              { label: '15分钟', value: 15 },
              { label: '30分钟', value: 30 },
              { label: '1小时', value: 60 },
              { label: '2小时', value: 120 },
              { label: '永不超时', value: 0 }
            ].map(item => h('el-option', {
              key: item.value,
              label: item.label,
              value: item.value
            }))
          },
          cols: { span: 8 }
        },
        {
          label: '备用邮箱',
          prop: 'accountSettings.backupEmail',
          render: 'input',
          renderProps: {
            type: 'email',
            placeholder: '请输入备用邮箱',
            clearable: true
          },
          cols: { span: 12 }
        },
        {
          label: '恢复手机',
          prop: 'accountSettings.recoveryPhone',
          render: 'input',
          renderProps: {
            placeholder: '请输入恢复手机号',
            clearable: true
          },
          cols: { span: 12 }
        }
      ]

    case 2: // 个人偏好
      return [
        {
          label: '主题',
          prop: 'preferences.theme',
          render: 'radioGroup',
          renderSlots: {
            default: () => [
              { label: '浅色', value: 'light' },
              { label: '深色', value: 'dark' },
              { label: '自动', value: 'auto' }
            ].map(item => h('el-radio', {
              key: item.value,
              label: item.value
            }, () => item.label))
          },
          cols: { span: 12 }
        },
        {
          label: '语言',
          prop: 'preferences.language',
          render: 'select',
          renderProps: {
            placeholder: '请选择语言'
          },
          renderSlots: {
            default: () => [
              { label: '简体中文', value: 'zh-CN' },
              { label: '繁體中文', value: 'zh-TW' },
              { label: 'English', value: 'en-US' },
              { label: '日本語', value: 'ja-JP' },
              { label: '한국어', value: 'ko-KR' }
            ].map(item => h('el-option', {
              key: item.value,
              label: item.label,
              value: item.value
            }))
          },
          cols: { span: 12 }
        },
        {
          label: '时区',
          prop: 'preferences.timezone',
          render: 'select',
          renderProps: {
            placeholder: '请选择时区',
            filterable: true
          },
          renderSlots: {
            default: () => [
              { label: 'Asia/Shanghai (+08:00)', value: 'Asia/Shanghai' },
              { label: 'UTC (+00:00)', value: 'UTC' },
              { label: 'America/New_York (-05:00)', value: 'America/New_York' },
              { label: 'Europe/London (+00:00)', value: 'Europe/London' },
              { label: 'Asia/Tokyo (+09:00)', value: 'Asia/Tokyo' }
            ].map(item => h('el-option', {
              key: item.value,
              label: item.label,
              value: item.value
            }))
          },
          cols: { span: 12 }
        },
        {
          label: '日期格式',
          prop: 'preferences.dateFormat',
          render: 'select',
          renderProps: {
            placeholder: '请选择日期格式'
          },
          renderSlots: {
            default: () => [
              { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
              { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
              { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
              { label: 'YYYY年MM月DD日', value: 'YYYY年MM月DD日' }
            ].map(item => h('el-option', {
              key: item.value,
              label: item.label,
              value: item.value
            }))
          },
          cols: { span: 12 }
        },
        {
          label: '货币',
          prop: 'preferences.currency',
          render: 'select',
          renderProps: {
            placeholder: '请选择货币',
            filterable: true
          },
          renderSlots: {
            default: () => [
              { label: '人民币 (CNY)', value: 'CNY' },
              { label: '美元 (USD)', value: 'USD' },
              { label: '欧元 (EUR)', value: 'EUR' },
              { label: '日元 (JPY)', value: 'JPY' },
              { label: '英镑 (GBP)', value: 'GBP' }
            ].map(item => h('el-option', {
              key: item.value,
              label: item.label,
              value: item.value
            }))
          },
          cols: { span: 12 }
        },
        {
          label: '通知设置',
          prop: 'preferences.notifications',
          render: 'custom',
          renderSlots: {
            default: () => h('div', { class: 'notification-grid' }, [
              h('div', { class: 'notification-item' }, [
                h('span', '邮件通知'),
                h('el-switch', {
                  modelValue: formData.value.preferences.notifications.email,
                  'onUpdate:modelValue': (value: boolean) => {
                    formData.value.preferences.notifications.email = value
                  }
                })
              ]),
              h('div', { class: 'notification-item' }, [
                h('span', '短信通知'),
                h('el-switch', {
                  modelValue: formData.value.preferences.notifications.sms,
                  'onUpdate:modelValue': (value: boolean) => {
                    formData.value.preferences.notifications.sms = value
                  }
                })
              ]),
              h('div', { class: 'notification-item' }, [
                h('span', '推送通知'),
                h('el-switch', {
                  modelValue: formData.value.preferences.notifications.push,
                  'onUpdate:modelValue': (value: boolean) => {
                    formData.value.preferences.notifications.push = value
                  }
                })
              ]),
              h('div', { class: 'notification-item' }, [
                h('span', '营销信息'),
                h('el-switch', {
                  modelValue: formData.value.preferences.notifications.marketing,
                  'onUpdate:modelValue': (value: boolean) => {
                    formData.value.preferences.notifications.marketing = value
                  }
                })
              ])
            ])
          },
          cols: { span: 24 }
        },
        {
          label: '隐私设置',
          prop: 'preferences.privacy',
          render: 'custom',
          renderSlots: {
            default: () => h('div', { class: 'privacy-settings' }, [
              h('div', { class: 'privacy-item' }, [
                h('span', '资料可见性：'),
                h('el-select', {
                  modelValue: formData.value.preferences.privacy.profileVisibility,
                  'onUpdate:modelValue': (value: string) => {
                    formData.value.preferences.privacy.profileVisibility = value
                  },
                  placeholder: '请选择'
                }, () => [
                  { label: '公开', value: 'public' },
                  { label: '好友可见', value: 'friends' },
                  { label: '仅自己', value: 'private' }
                ].map(item => h('el-option', {
                  key: item.value,
                  label: item.label,
                  value: item.value
                })))
              ]),
              h('div', { class: 'privacy-switch-group' }, [
                h('div', { class: 'privacy-switch-item' }, [
                  h('span', '显示邮箱'),
                  h('el-switch', {
                    modelValue: formData.value.preferences.privacy.showEmail,
                    'onUpdate:modelValue': (value: boolean) => {
                      formData.value.preferences.privacy.showEmail = value
                    }
                  })
                ]),
                h('div', { class: 'privacy-switch-item' }, [
                  h('span', '显示手机'),
                  h('el-switch', {
                    modelValue: formData.value.preferences.privacy.showPhone,
                    'onUpdate:modelValue': (value: boolean) => {
                      formData.value.preferences.privacy.showPhone = value
                    }
                  })
                ]),
                h('div', { class: 'privacy-switch-item' }, [
                  h('span', '允许搜索'),
                  h('el-switch', {
                    modelValue: formData.value.preferences.privacy.allowSearch,
                    'onUpdate:modelValue': (value: boolean) => {
                      formData.value.preferences.privacy.allowSearch = value
                    }
                  })
                ])
              ])
            ])
          },
          cols: { span: 24 }
        },
        {
          label: '兴趣爱好',
          prop: 'preferences.interests',
          render: 'checkboxGroup',
          renderSlots: {
            default: () => [
              { label: '技术', value: 'technology' },
              { label: '商业', value: 'business' },
              { label: '设计', value: 'design' },
              { label: '科学', value: 'science' },
              { label: '艺术', value: 'art' },
              { label: '体育', value: 'sports' },
              { label: '音乐', value: 'music' },
              { label: '旅行', value: 'travel' }
            ].map(item => h('el-checkbox', {
              key: item.value,
              label: item.value,
              value: item.value
            }, () => item.label))
          },
          cols: { span: 24 }
        },
        {
          label: '订阅新闻',
          prop: 'preferences.newsletter',
          render: 'switch',
          renderProps: {
            'active-text': '订阅',
            'inactive-text': '不订阅'
          },
          cols: { span: 12 }
        }
      ]

    case 3: // 企业信息
      return [
        {
          label: '公司名称',
          prop: 'companyInfo.companyName',
          render: 'input',
          renderProps: {
            placeholder: '请输入公司名称',
            clearable: true
          },
          itemProps: {
            rules: [{ required: true, message: '请输入公司名称', trigger: 'blur' }]
          },
          cols: { span: 12 }
        },
        {
          label: '业务类型',
          prop: 'companyInfo.businessType',
          render: 'select',
          renderProps: {
            placeholder: '请选择业务类型'
          },
          renderSlots: {
            default: () => [
              { label: '科技公司', value: 'technology' },
              { label: '制造业', value: 'manufacturing' },
              { label: '服务业', value: 'service' },
              { label: '贸易', value: 'trading' },
              { label: '其他', value: 'other' }
            ].map(item => h('el-option', {
              key: item.value,
              label: item.label,
              value: item.value
            }))
          },
          cols: { span: 12 }
        },
        {
          label: '所属行业',
          prop: 'companyInfo.industry',
          render: 'select',
          renderProps: {
            placeholder: '请选择所属行业',
            filterable: true
          },
          renderSlots: {
            default: () => [
              { label: '软件开发', value: 'software' },
              { label: '互联网服务', value: 'internet' },
              { label: '电子商务', value: 'ecommerce' },
              { label: '人工智能', value: 'ai' },
              { label: '区块链', value: 'blockchain' },
              { label: '金融科技', value: 'fintech' }
            ].map(item => h('el-option', {
              key: item.value,
              label: item.label,
              value: item.value
            }))
          },
          cols: { span: 12 }
        },
        {
          label: '员工规模',
          prop: 'companyInfo.employeeCount',
          render: 'select',
          renderProps: {
            placeholder: '请选择员工规模'
          },
          renderSlots: {
            default: () => [
              { label: '1-10人', value: '1-10' },
              { label: '11-50人', value: '11-50' },
              { label: '51-200人', value: '51-200' },
              { label: '201-500人', value: '201-500' },
              { label: '500+人', value: '500+' }
            ].map(item => h('el-option', {
              key: item.value,
              label: item.label,
              value: item.value
            }))
          },
          cols: { span: 12 }
        },
        {
          label: '成立年份',
          prop: 'companyInfo.establishedYear',
          render: 'inputNumber',
          renderProps: {
            min: 1900,
            max: new Date().getFullYear(),
            step: 1,
            placeholder: '请输入成立年份'
          },
          cols: { span: 8 }
        },
        {
          label: '注册号码',
          prop: 'companyInfo.registrationNumber',
          render: 'input',
          renderProps: {
            placeholder: '请输入注册号码',
            clearable: true
          },
          cols: { span: 8 }
        },
        {
          label: '税务号码',
          prop: 'companyInfo.taxNumber',
          render: 'input',
          renderProps: {
            placeholder: '请输入税务号码',
            clearable: true
          },
          cols: { span: 8 }
        },
        {
          label: '法定代表人',
          prop: 'companyInfo.legalRepresentative',
          render: 'input',
          renderProps: {
            placeholder: '请输入法定代表人姓名',
            clearable: true
          },
          cols: { span: 12 }
        },
        {
          label: '营业执照',
          prop: 'companyInfo.businessLicense',
          render: 'upload',
          renderProps: {
            action: '#',
            accept: 'image/*,.pdf',
            'auto-upload': false,
            drag: true
          },
          cols: { span: 12 }
        }
      ]

    case 4: // 完成注册
      return [
        {
          label: '注册摘要',
          prop: 'summary',
          render: 'custom',
          renderSlots: {
            default: () => h('div', { class: 'registration-summary' }, [
              h('div', { class: 'summary-section' }, [
                h('h4', '个人信息'),
                h('div', { class: 'summary-item' }, [
                  h('span', '姓名：'),
                  h('span', `${formData.value.personalInfo.firstName} ${formData.value.personalInfo.lastName}`)
                ]),
                h('div', { class: 'summary-item' }, [
                  h('span', '邮箱：'),
                  h('span', formData.value.personalInfo.email)
                ]),
                h('div', { class: 'summary-item' }, [
                  h('span', '手机：'),
                  h('span', formData.value.personalInfo.phone)
                ])
              ]),
              h('div', { class: 'summary-section' }, [
                h('h4', '账户设置'),
                h('div', { class: 'summary-item' }, [
                  h('span', '用户名：'),
                  h('span', formData.value.accountSettings.username)
                ]),
                h('div', { class: 'summary-item' }, [
                  h('span', '双重认证：'),
                  h('span', formData.value.accountSettings.twoFactorAuth ? '已启用' : '未启用')
                ])
              ]),
              h('div', { class: 'summary-section' }, [
                h('h4', '企业信息'),
                h('div', { class: 'summary-item' }, [
                  h('span', '公司名称：'),
                  h('span', formData.value.companyInfo.companyName)
                ]),
                h('div', { class: 'summary-item' }, [
                  h('span', '员工规模：'),
                  h('span', formData.value.companyInfo.employeeCount)
                ])
              ])
            ])
          },
          cols: { span: 24 }
        }
      ]

    default:
      return []
  }
})

// 表单选项配置
const formOptions = ref({
  labelWidth: '120px',
  labelPosition: 'right',
  size: 'default',
  gutter: 20,
  justify: 'start',
  align: 'top'
})

// 步骤导航
const nextStep = async () => {
  try {
    // 验证当前步骤
    const isValid = await formRef.value?.getElFormRef()?.validate()
    
    if (isValid) {
      if (currentStep.value < steps.length - 1) {
        currentStep.value++
        ElMessage.success('验证通过，进入下一步')
        
        // 滚动到顶部
        await nextTick()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  } catch (error) {
    ElMessage.error('请检查当前步骤的输入内容')
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    ElMessage.info('返回上一步')
  }
}

// 跳转到指定步骤
const goToStep = (step: number) => {
  if (step >= 0 && step < steps.length && step <= currentStep.value + 1) {
    currentStep.value = step
  }
}

// 提交表单
const submitRegistration = async () => {
  try {
    isSubmitting.value = true
    
    // 显示确认对话框
    await ElMessageBox.confirm(
      '确定要提交注册信息吗？提交后将无法修改。',
      '确认提交',
      {
        confirmButtonText: '确定提交',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const loading = ElLoading.service({
      lock: true,
      text: '正在提交注册信息...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    
    // 模拟API调用
    await simulateApiCall()
    
    loading.close()
    
    ElMessage.success({
      message: '注册成功！欢迎加入我们！',
      duration: 3000
    })
    
    console.log('完整注册数据:', formData.value)
    
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('注册失败，请重试')
      console.error('Registration error:', error)
    }
  } finally {
    isSubmitting.value = false
  }
}

// 模拟API调用
const simulateApiCall = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 模拟网络延迟和可能的错误
    const delay = Math.random() * 2000 + 1000 // 1-3秒随机延迟
    const shouldFail = Math.random() < 0.1 // 10%的失败率
    
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('服务器错误'))
      } else {
        resolve()
      }
    }, delay)
  })
}

// 保存草稿
const saveDraft = () => {
  try {
    localStorage.setItem('registration-draft', JSON.stringify(formData.value))
    ElMessage.success('草稿已保存')
  } catch (error) {
    ElMessage.error('保存草稿失败')
  }
}

// 加载草稿
const loadDraft = () => {
  try {
    const draft = localStorage.getItem('registration-draft')
    if (draft) {
      formData.value = JSON.parse(draft)
      ElMessage.success('草稿已加载')
    } else {
      ElMessage.info('没有找到保存的草稿')
    }
  } catch (error) {
    ElMessage.error('加载草稿失败')
  }
}

// 重置所有数据
const resetAllData = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要重置所有数据吗？此操作不可恢复。',
      '重置确认',
      {
        confirmButtonText: '确定重置',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 重置表单数据
    formRef.value?.getElFormRef()?.resetFields()
    currentStep.value = 0
    localStorage.removeItem('registration-draft')
    
    ElMessage.success('所有数据已重置')
  } catch (error) {
    // 用户取消操作
  }
}
const activeNames = ref(['personal'])
</script>

<template>
  <div class="advanced-scenarios-demo">
    <!-- 演示说明 -->
    <div class="demo-description">
      <h3>高级应用场景演示</h3>
      <p>展示 MaForm 在复杂业务场景中的应用，包括多步骤注册流程、数据验证、状态管理和用户体验优化。</p>
      <div class="demo-features">
        <el-tag type="info" size="small">多步骤表单</el-tag>
        <el-tag type="success" size="small">复杂验证</el-tag>
        <el-tag type="warning" size="small">状态管理</el-tag>
        <el-tag type="danger" size="small">API集成</el-tag>
        <el-tag size="small">用户体验</el-tag>
        <el-tag type="info" size="small">数据持久化</el-tag>
      </div>
    </div>

    <!-- 步骤导航 -->
    <div class="steps-navigation">
      <el-card class="steps-card">
        <el-steps :active="currentStep" finish-status="success" align-center>
          <el-step
            v-for="(step, index) in steps"
            :key="index"
            :title="step.title"
            :description="step.description"
            :icon="step.icon"
            @click="goToStep(index)"
            class="clickable-step"
          />
        </el-steps>
      </el-card>
    </div>

    <!-- 进度指示器 -->
    <div class="progress-indicator">
      <div class="progress-info">
        <span>完成进度: {{ Math.round(((currentStep + 1) / steps.length) * 100) }}%</span>
        <el-progress 
          :percentage="Math.round(((currentStep + 1) / steps.length) * 100)"
          :color="['#f56565', '#ed8936', '#38b2ac', '#4299e1', '#48bb78'][currentStep]"
        />
      </div>
    </div>

    <!-- 动态表单内容 -->
    <div class="dynamic-form-content">
      <el-card class="form-card">
        <template #header>
          <div class="form-header">
            <div class="step-info">
              <h3>{{ steps[currentStep].title }}</h3>
              <p>{{ steps[currentStep].description }}</p>
            </div>
            <div class="form-actions">
              <el-button size="small" @click="saveDraft">保存草稿</el-button>
              <el-button size="small" @click="loadDraft">加载草稿</el-button>
              <el-button size="small" type="danger" @click="resetAllData">重置</el-button>
            </div>
          </div>
        </template>
        
        <!-- MaForm 表单 -->
        <ma-form 
          ref="formRef"
          v-model="formData" 
          :options="formOptions"
          :items="currentFormItems"
          class="step-form"
        />
      </el-card>
    </div>

    <!-- 导航按钮 -->
    <div class="navigation-buttons">
      <el-button 
        @click="prevStep" 
        :disabled="currentStep === 0"
        size="large"
      >
        上一步
      </el-button>
      
      <div class="nav-spacer" />
      
      <el-button 
        v-if="currentStep < steps.length - 1"
        type="primary" 
        @click="nextStep"
        size="large"
      >
        下一步
      </el-button>
      
      <el-button 
        v-else
        type="success" 
        @click="submitRegistration"
        :loading="isSubmitting"
        size="large"
      >
        {{ isSubmitting ? '提交中...' : '完成注册' }}
      </el-button>
    </div>

    <!-- 数据预览面板 -->
    <div class="data-preview-panel">
      <el-card>
        <template #header>
          <div class="panel-header">
            <span>数据预览</span>
            <el-button 
              size="small" 
              type="text" 
              @click="() => {}"
            >
              展开/收起
            </el-button>
          </div>
        </template>
        
        <el-collapse v-model="activeNames" accordion>
          <el-collapse-item title="个人信息" name="personal">
            <div class="data-section">
              <pre>{{ JSON.stringify(formData.personalInfo, null, 2) }}</pre>
            </div>
          </el-collapse-item>
          
          <el-collapse-item title="账户设置" name="account">
            <div class="data-section">
              <pre>{{ JSON.stringify({
                ...formData.accountSettings,
                password: '***',
                confirmPassword: '***'
              }, null, 2) }}</pre>
            </div>
          </el-collapse-item>
          
          <el-collapse-item title="个人偏好" name="preferences">
            <div class="data-section">
              <pre>{{ JSON.stringify(formData.preferences, null, 2) }}</pre>
            </div>
          </el-collapse-item>
          
          <el-collapse-item title="企业信息" name="company">
            <div class="data-section">
              <pre>{{ JSON.stringify(formData.companyInfo, null, 2) }}</pre>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.advanced-scenarios-demo {
  max-width: 1200px;
  margin: 0 auto;
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
  opacity: 0.9;
}

.demo-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.steps-navigation {
  margin-bottom: 24px;
}

.steps-card {
  padding: 20px;
  border-radius: 12px;
}

.clickable-step {
  cursor: pointer;
  transition: all 0.3s ease;
}

.clickable-step:hover {
  transform: translateY(-2px);
}

.progress-indicator {
  margin-bottom: 24px;
  padding: 16px 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #409EFF;
}

.progress-info span {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.dynamic-form-content {
  margin-bottom: 24px;
}

.form-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.step-info h3 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
}

.step-info p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.form-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.step-form {
  min-height: 400px;
  padding: 20px 0;
}

.navigation-buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.nav-spacer {
  flex: 1;
}

.data-preview-panel {
  margin-top: 32px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.data-section {
  background-color: #f4f4f5;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
}

.data-section pre {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: #606266;
  white-space: pre-wrap;
}

/* 注册摘要样式 */
.registration-summary {
  background-color: #f9f9f9;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.summary-section {
  margin-bottom: 24px;
}

.summary-section:last-child {
  margin-bottom: 0;
}

.summary-section h4 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 2px solid #409EFF;
  padding-bottom: 8px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #ebeef5;
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-item span:first-child {
  color: #909399;
  font-size: 14px;
}

.summary-item span:last-child {
  color: #303133;
  font-weight: 500;
  font-size: 14px;
}

/* 通知设置网格 */
.notification-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f9f9f9;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}

.notification-item span {
  font-size: 14px;
  color: #606266;
}

/* 隐私设置 */
.privacy-settings {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.privacy-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.privacy-item span {
  font-size: 14px;
  color: #606266;
}

.privacy-switch-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.privacy-switch-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.privacy-switch-item span {
  font-size: 13px;
  color: #606266;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .form-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .navigation-buttons {
    flex-direction: column;
    gap: 16px;
  }
  
  .navigation-buttons .el-button {
    width: 100%;
  }
  
  .nav-spacer {
    display: none;
  }
  
  .notification-grid {
    grid-template-columns: 1fr;
  }
  
  .privacy-switch-group {
    grid-template-columns: 1fr;
  }
  
  .summary-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .steps-card {
    padding: 16px;
  }
  
  .demo-description {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .step-form {
    min-height: 300px;
    padding: 16px 0;
  }
  
  .data-section {
    padding: 12px;
  }
  
  .data-section pre {
    font-size: 11px;
  }
}
</style>