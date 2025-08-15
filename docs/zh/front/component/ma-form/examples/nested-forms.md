# 嵌套表单

展示 MaForm 的嵌套表单结构实现，包括层级表单、动态嵌套、对象数组表单和复杂数据结构处理。

<DemoPreview dir="demos/ma-form/nested-forms" />

## 功能特性

- **层级结构**：支持多层级嵌套表单结构
- **动态嵌套**：可以动态添加和删除嵌套表单项
- **对象数组**：支持对象数组形式的复杂数据结构
- **独立验证**：每个嵌套层级都有独立的验证机制
- **灵活配置**：支持对嵌套项的个性化配置

## 基础嵌套结构

### 1. 简单对象嵌套

```typescript
const nestedFormItems = [
  {
    label: '用户信息',
    prop: 'userInfo',
    children: [
      {
        label: '姓名',
        prop: 'userInfo.name',
        render: 'input',
        renderProps: {
          placeholder: '请输入姓名'
        },
        cols: { xs: 24, sm: 12 }
      },
      {
        label: '年龄',
        prop: 'userInfo.age',
        render: 'inputNumber',
        renderProps: {
          min: 0,
          max: 150
        },
        cols: { xs: 24, sm: 12 }
      },
      {
        label: '邮箱',
        prop: 'userInfo.email',
        render: 'input',
        renderProps: {
          type: 'email',
          placeholder: '请输入邮箱地址'
        },
        cols: { xs: 24, sm: 24 }
      }
    ]
  }
]
```

### 2. 多层级嵌套

```typescript
const multiLevelNested = [
  {
    label: '公司信息',
    prop: 'company',
    children: [
      {
        label: '基本信息',
        prop: 'company.basic',
        children: [
          {
            label: '公司名称',
            prop: 'company.basic.name',
            render: 'input',
            renderProps: {
              placeholder: '请输入公司名称'
            }
          },
          {
            label: '成立时间',
            prop: 'company.basic.foundedDate',
            render: 'datePicker',
            renderProps: {
              type: 'date',
              placeholder: '选择成立时间'
            }
          }
        ]
      },
      {
        label: '联系信息',
        prop: 'company.contact',
        children: [
          {
            label: '联系地址',
            prop: 'company.contact.address',
            render: 'textarea',
            renderProps: {
              rows: 3,
              placeholder: '请输入详细地址'
            }
          },
          {
            label: '联系电话',
            prop: 'company.contact.phone',
            render: 'input',
            renderProps: {
              placeholder: '请输入联系电话'
            }
          }
        ]
      }
    ]
  }
]
```

## 动态嵌套表单

### 1. 动态添加/删除子项

```typescript
// 动态管理嵌套表单项
const dynamicNestedManagement = {
  // 添加子表单项
  addChildItem: (parentProp: string, childItem: MaFormItem) => {
    const parentItem = formRef.value.getItemByProp(parentProp)
    if (parentItem) {
      const updatedChildren = [...(parentItem.children || []), childItem]
      formRef.value.updateItem(parentProp, {
        children: updatedChildren
      })
    }
  },

  // 删除子表单项
  removeChildItem: (parentProp: string, childIndex: number) => {
    const parentItem = formRef.value.getItemByProp(parentProp)
    if (parentItem && parentItem.children) {
      const updatedChildren = parentItem.children.filter((_, index) => index !== childIndex)
      formRef.value.updateItem(parentProp, {
        children: updatedChildren
      })
    }
  },

  // 批量更新子表单项
  updateChildrenItems: (parentProp: string, children: MaFormItem[]) => {
    formRef.value.updateItem(parentProp, { children })
  }
}

// 动态联系人表单示例
const contactFormItems = [
  {
    label: '联系人列表',
    prop: 'contacts',
    children: [], // 初始为空，动态添加
    itemSlots: {
      append: ({ item, model }) => {
        return h('div', { class: 'contact-actions' }, [
          h('el-button', {
            type: 'primary',
            size: 'small',
            icon: 'Plus',
            onClick: () => addContact()
          }, '添加联系人')
        ])
      }
    }
  }
]

// 添加联系人
const addContact = () => {
  const contactIndex = contactCount.value++
  const newContactFields = [
    {
      label: `联系人 ${contactIndex + 1}`,
      prop: `contacts.${contactIndex}`,
      children: [
        {
          label: '姓名',
          prop: `contacts.${contactIndex}.name`,
          render: 'input',
          cols: { xs: 24, sm: 8 }
        },
        {
          label: '电话',
          prop: `contacts.${contactIndex}.phone`,
          render: 'input',
          cols: { xs: 24, sm: 8 }
        },
        {
          label: '操作',
          prop: `contacts.${contactIndex}.actions`,
          render: ({ item }) => {
            return h('el-button', {
              type: 'danger',
              size: 'small',
              onClick: () => removeContact(contactIndex)
            }, '删除')
          },
          cols: { xs: 24, sm: 8 }
        }
      ]
    }
  ]
  
  dynamicNestedManagement.addChildItem('contacts', newContactFields[0])
}
```

### 2. 条件嵌套显示

```typescript
const conditionalNestedItems = [
  {
    label: '账户类型',
    prop: 'accountType',
    render: 'select',
    renderSlots: {
      default: () => [
        h('el-option', { label: '个人账户', value: 'personal' }),
        h('el-option', { label: '企业账户', value: 'business' })
      ]
    }
  },
  {
    label: '个人信息',
    prop: 'personalInfo',
    show: (model) => model.accountType === 'personal',
    dependencies: ['accountType'],
    children: [
      {
        label: '身份证号',
        prop: 'personalInfo.idCard',
        render: 'input',
        show: (model) => model.accountType === 'personal',
        dependencies: ['accountType']
      },
      {
        label: '出生日期',
        prop: 'personalInfo.birthDate',
        render: 'datePicker',
        show: (model) => model.accountType === 'personal',
        dependencies: ['accountType']
      }
    ]
  },
  {
    label: '企业信息',
    prop: 'businessInfo',
    show: (model) => model.accountType === 'business',
    dependencies: ['accountType'],
    children: [
      {
        label: '统一社会信用代码',
        prop: 'businessInfo.creditCode',
        render: 'input',
        show: (model) => model.accountType === 'business',
        dependencies: ['accountType']
      },
      {
        label: '法人代表',
        prop: 'businessInfo.legalPerson',
        render: 'input',
        show: (model) => model.accountType === 'business',
        dependencies: ['accountType']
      }
    ]
  }
]
```

## 对象数组表单

### 1. 基础对象数组

```typescript
// 处理数组形式的嵌套数据
const arrayFormItems = [
  {
    label: '教育经历',
    prop: 'education',
    children: [], // 动态生成数组项
    itemSlots: {
      append: () => {
        return h('el-button', {
          type: 'primary',
          size: 'small',
          onClick: () => addEducationItem()
        }, '添加教育经历')
      }
    }
  }
]

// 动态管理数组项
const educationArray = ref([])

const addEducationItem = () => {
  const index = educationArray.value.length
  educationArray.value.push({
    school: '',
    major: '',
    startDate: '',
    endDate: ''
  })
  
  // 动态添加表单项
  const newEducationItem = {
    label: `教育经历 ${index + 1}`,
    prop: `education.${index}`,
    children: [
      {
        label: '学校名称',
        prop: `education.${index}.school`,
        render: 'input',
        cols: { xs: 24, sm: 12 }
      },
      {
        label: '专业',
        prop: `education.${index}.major`,
        render: 'input',
        cols: { xs: 24, sm: 12 }
      },
      {
        label: '开始时间',
        prop: `education.${index}.startDate`,
        render: 'datePicker',
        renderProps: { type: 'date' },
        cols: { xs: 24, sm: 8 }
      },
      {
        label: '结束时间',
        prop: `education.${index}.endDate`,
        render: 'datePicker',
        renderProps: { type: 'date' },
        cols: { xs: 24, sm: 8 }
      },
      {
        label: '操作',
        prop: `education.${index}.actions`,
        render: () => {
          return h('el-button', {
            type: 'danger',
            size: 'small',
            onClick: () => removeEducationItem(index)
          }, '删除')
        },
        cols: { xs: 24, sm: 8 }
      }
    ],
    itemSlots: {
      label: () => {
        return h('div', { class: 'education-header' }, [
          h('span', `教育经历 ${index + 1}`),
          h('el-tag', { size: 'small', type: 'info' }, '可删除')
        ])
      }
    }
  }
  
  dynamicNestedManagement.addChildItem('education', newEducationItem)
}

const removeEducationItem = (index: number) => {
  educationArray.value.splice(index, 1)
  // 重新构建表单项
  rebuildEducationItems()
}

const rebuildEducationItems = () => {
  const educationItems = educationArray.value.map((_, index) => ({
    // ... 重新构建表单项配置
  }))
  
  dynamicNestedManagement.updateChildrenItems('education', educationItems)
}
```

### 2. 复杂对象数组

```typescript
const complexArrayForm = [
  {
    label: '项目经验',
    prop: 'projects',
    children: [], // 动态生成
    itemSlots: {
      label: ({ item }) => {
        return h('div', { class: 'section-header' }, [
          h('h3', '项目经验'),
          h('el-button', {
            type: 'primary',
            size: 'small',
            onClick: () => addProject()
          }, '添加项目')
        ])
      }
    }
  }
]

// 项目数据结构
interface ProjectItem {
  name: string
  description: string
  technologies: string[]
  startDate: string
  endDate: string
  members: {
    name: string
    role: string
  }[]
}

const addProject = () => {
  const projectIndex = projectsArray.value.length
  const newProject: ProjectItem = {
    name: '',
    description: '',
    technologies: [],
    startDate: '',
    endDate: '',
    members: []
  }
  
  projectsArray.value.push(newProject)
  
  const projectFormItem = {
    label: `项目 ${projectIndex + 1}`,
    prop: `projects.${projectIndex}`,
    children: [
      {
        label: '项目名称',
        prop: `projects.${projectIndex}.name`,
        render: 'input',
        cols: { xs: 24, sm: 12 }
      },
      {
        label: '项目描述',
        prop: `projects.${projectIndex}.description`,
        render: 'textarea',
        renderProps: { rows: 3 },
        cols: { xs: 24, sm: 12 }
      },
      {
        label: '技术栈',
        prop: `projects.${projectIndex}.technologies`,
        render: 'select',
        renderProps: {
          multiple: true,
          placeholder: '选择技术栈'
        },
        renderSlots: {
          default: () => [
            h('el-option', { label: 'Vue.js', value: 'vue' }),
            h('el-option', { label: 'React', value: 'react' }),
            h('el-option', { label: 'Angular', value: 'angular' }),
            h('el-option', { label: 'Node.js', value: 'nodejs' })
          ]
        },
        cols: { xs: 24, sm: 24 }
      },
      {
        label: '项目成员',
        prop: `projects.${projectIndex}.members`,
        children: [], // 嵌套的成员列表
        itemSlots: {
          append: () => {
            return h('el-button', {
              size: 'small',
              onClick: () => addProjectMember(projectIndex)
            }, '添加成员')
          }
        }
      }
    ]
  }
  
  dynamicNestedManagement.addChildItem('projects', projectFormItem)
}

// 添加项目成员（三级嵌套）
const addProjectMember = (projectIndex: number) => {
  const memberIndex = projectsArray.value[projectIndex].members.length
  projectsArray.value[projectIndex].members.push({ name: '', role: '' })
  
  const memberFormItem = {
    label: `成员 ${memberIndex + 1}`,
    prop: `projects.${projectIndex}.members.${memberIndex}`,
    children: [
      {
        label: '姓名',
        prop: `projects.${projectIndex}.members.${memberIndex}.name`,
        render: 'input',
        cols: { xs: 24, sm: 8 }
      },
      {
        label: '角色',
        prop: `projects.${projectIndex}.members.${memberIndex}.role`,
        render: 'select',
        renderSlots: {
          default: () => [
            h('el-option', { label: '项目经理', value: 'pm' }),
            h('el-option', { label: '前端开发', value: 'frontend' }),
            h('el-option', { label: '后端开发', value: 'backend' }),
            h('el-option', { label: '测试工程师', value: 'tester' })
          ]
        },
        cols: { xs: 24, sm: 8 }
      },
      {
        label: '操作',
        prop: `projects.${projectIndex}.members.${memberIndex}.actions`,
        render: () => {
          return h('el-button', {
            type: 'danger',
            size: 'small',
            onClick: () => removeProjectMember(projectIndex, memberIndex)
          }, '删除')
        },
        cols: { xs: 24, sm: 8 }
      }
    ]
  }
  
  // 添加到项目的成员列表
  const projectItem = formRef.value.getItemByProp(`projects.${projectIndex}`)
  const membersItem = projectItem?.children?.find(child => child.prop === `projects.${projectIndex}.members`)
  if (membersItem) {
    membersItem.children = [...(membersItem.children || []), memberFormItem]
    formRef.value.updateItem(`projects.${projectIndex}`, projectItem)
  }
}
```

## 嵌套表单验证

### 1. 层级验证规则

```typescript
const nestedValidationItems = [
  {
    label: '用户资料',
    prop: 'profile',
    children: [
      {
        label: '基本信息',
        prop: 'profile.basic',
        children: [
          {
            label: '用户名',
            prop: 'profile.basic.username',
            render: 'input',
            itemProps: {
              rules: [
                { required: true, message: '请输入用户名', trigger: 'blur' },
                { min: 3, max: 20, message: '用户名长度在3-20个字符', trigger: 'blur' }
              ]
            }
          }
        ]
      },
      {
        label: '联系方式',
        prop: 'profile.contact',
        children: [
          {
            label: '邮箱',
            prop: 'profile.contact.email',
            render: 'input',
            renderProps: { type: 'email' },
            customValidator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请输入邮箱地址'))
              } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                callback(new Error('请输入有效的邮箱地址'))
              } else {
                callback()
              }
            }
          },
          {
            label: '电话',
            prop: 'profile.contact.phone',
            render: 'input',
            asyncValidator: async (rule, value) => {
              if (value) {
                const isValid = await validatePhoneNumber(value)
                if (!isValid) {
                  throw new Error('电话号码格式不正确')
                }
              }
            }
          }
        ]
      }
    ]
  }
]
```

### 2. 数组项验证

```typescript
// 验证所有数组项
const validateArrayItems = async (arrayProp: string) => {
  const arrayData = get(formData.value, arrayProp) || []
  const validationResults = []
  
  for (let i = 0; i < arrayData.length; i++) {
    try {
      const itemValid = await formRef.value.validateField(`${arrayProp}.${i}`)
      validationResults.push({ index: i, valid: itemValid })
    } catch (error) {
      validationResults.push({ index: i, valid: false, error })
    }
  }
  
  return validationResults
}

// 验证嵌套对象
const validateNestedObject = async (objectProp: string) => {
  const nestedProps = []
  const collectNestedProps = (items: MaFormItem[], prefix = '') => {
    items.forEach(item => {
      if (item.prop && item.prop.startsWith(objectProp)) {
        nestedProps.push(item.prop)
      }
      if (item.children) {
        collectNestedProps(item.children, prefix)
      }
    })
  }
  
  collectNestedProps(formRef.value.getItems())
  
  const results = await Promise.allSettled(
    nestedProps.map(prop => formRef.value.validateField(prop))
  )
  
  return results.every(result => result.status === 'fulfilled')
}
```

## 数据处理工具

### 1. 嵌套数据扁平化

```typescript
// 将嵌套数据扁平化用于表单显示
const flattenNestedData = (data: Record<string, any>, prefix = ''): Record<string, any> => {
  const flattened: Record<string, any> = {}
  
  for (const [key, value] of Object.entries(data)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(flattened, flattenNestedData(value, fullKey))
    } else {
      flattened[fullKey] = value
    }
  }
  
  return flattened
}

// 将扁平化数据转换回嵌套结构
const unflattenData = (flatData: Record<string, any>): Record<string, any> => {
  const nested: Record<string, any> = {}
  
  for (const [key, value] of Object.entries(flatData)) {
    const keys = key.split('.')
    let current = nested
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {}
      }
      current = current[keys[i]]
    }
    
    current[keys[keys.length - 1]] = value
  }
  
  return nested
}
```

### 2. 数组数据管理

```typescript
// 数组数据操作工具
const arrayDataManager = {
  // 添加数组项
  addItem: (arrayPath: string, item: any, index?: number) => {
    const currentData = formRef.value.getFormData()
    const arrayData = get(currentData, arrayPath) || []
    
    if (typeof index === 'number') {
      arrayData.splice(index, 0, item)
    } else {
      arrayData.push(item)
    }
    
    set(currentData, arrayPath, arrayData)
    formRef.value.setFormData(currentData)
  },
  
  // 删除数组项
  removeItem: (arrayPath: string, index: number) => {
    const currentData = formRef.value.getFormData()
    const arrayData = get(currentData, arrayPath) || []
    
    arrayData.splice(index, 1)
    set(currentData, arrayPath, arrayData)
    formRef.value.setFormData(currentData)
  },
  
  // 移动数组项
  moveItem: (arrayPath: string, fromIndex: number, toIndex: number) => {
    const currentData = formRef.value.getFormData()
    const arrayData = get(currentData, arrayPath) || []
    
    const item = arrayData.splice(fromIndex, 1)[0]
    arrayData.splice(toIndex, 0, item)
    
    set(currentData, arrayPath, arrayData)
    formRef.value.setFormData(currentData)
  }
}
```

## 相关链接

- [MaFormItem children 配置](/front/component/ma-form#嵌套与条件配置)
- [高级特性 - 条件渲染](/front/component/ma-form#条件渲染)
- [表单项管理方法](/front/component/ma-form/examples/expose-methods#表单项管理方法)