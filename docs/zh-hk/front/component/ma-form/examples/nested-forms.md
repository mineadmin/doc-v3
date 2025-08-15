# 嵌套表單

展示 MaForm 的嵌套表單結構實現，包括層級表單、動態嵌套、對象數組表單和複雜數據結構處理。

<DemoPreview dir="demos/ma-form/nested-forms" />

## 功能特性

- **層級結構**：支持多層級嵌套表單結構
- **動態嵌套**：可以動態添加和刪除嵌套表單項
- **對象數組**：支持對象數組形式的複雜數據結構
- **獨立驗證**：每個嵌套層級都有獨立的驗證機制
- **靈活配置**：支持對嵌套項的個性化配置

## 基礎嵌套結構

### 1. 簡單對象嵌套

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
          placeholder: '請輸入姓名'
        },
        cols: { xs: 24, sm: 12 }
      },
      {
        label: '年齡',
        prop: 'userInfo.age',
        render: 'inputNumber',
        renderProps: {
          min: 0,
          max: 150
        },
        cols: { xs: 24, sm: 12 }
      },
      {
        label: '郵箱',
        prop: 'userInfo.email',
        render: 'input',
        renderProps: {
          type: 'email',
          placeholder: '請輸入郵箱地址'
        },
        cols: { xs: 24, sm: 24 }
      }
    ]
  }
]
```

### 2. 多層級嵌套

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
            label: '公司名稱',
            prop: 'company.basic.name',
            render: 'input',
            renderProps: {
              placeholder: '請輸入公司名稱'
            }
          },
          {
            label: '成立時間',
            prop: 'company.basic.foundedDate',
            render: 'datePicker',
            renderProps: {
              type: 'date',
              placeholder: '選擇成立時間'
            }
          }
        ]
      },
      {
        label: '聯繫信息',
        prop: 'company.contact',
        children: [
          {
            label: '聯繫地址',
            prop: 'company.contact.address',
            render: 'textarea',
            renderProps: {
              rows: 3,
              placeholder: '請輸入詳細地址'
            }
          },
          {
            label: '聯繫電話',
            prop: 'company.contact.phone',
            render: 'input',
            renderProps: {
              placeholder: '請輸入聯繫電話'
            }
          }
        ]
      }
    ]
  }
]
```

## 動態嵌套表單

### 1. 動態添加/刪除子項

```typescript
// 動態管理嵌套表單項
const dynamicNestedManagement = {
  // 添加子表單項
  addChildItem: (parentProp: string, childItem: MaFormItem) => {
    const parentItem = formRef.value.getItemByProp(parentProp)
    if (parentItem) {
      const updatedChildren = [...(parentItem.children || []), childItem]
      formRef.value.updateItem(parentProp, {
        children: updatedChildren
      })
    }
  },

  // 刪除子表單項
  removeChildItem: (parentProp: string, childIndex: number) => {
    const parentItem = formRef.value.getItemByProp(parentProp)
    if (parentItem && parentItem.children) {
      const updatedChildren = parentItem.children.filter((_, index) => index !== childIndex)
      formRef.value.updateItem(parentProp, {
        children: updatedChildren
      })
    }
  },

  // 批量更新子表單項
  updateChildrenItems: (parentProp: string, children: MaFormItem[]) => {
    formRef.value.updateItem(parentProp, { children })
  }
}

// 動態聯繫人表單示例
const contactFormItems = [
  {
    label: '聯繫人列表',
    prop: 'contacts',
    children: [], // 初始為空，動態添加
    itemSlots: {
      append: ({ item, model }) => {
        return h('div', { class: 'contact-actions' }, [
          h('el-button', {
            type: 'primary',
            size: 'small',
            icon: 'Plus',
            onClick: () => addContact()
          }, '添加聯繫人')
        ])
      }
    }
  }
]

// 添加聯繫人
const addContact = () => {
  const contactIndex = contactCount.value++
  const newContactFields = [
    {
      label: `聯繫人 ${contactIndex + 1}`,
      prop: `contacts.${contactIndex}`,
      children: [
        {
          label: '姓名',
          prop: `contacts.${contactIndex}.name`,
          render: 'input',
          cols: { xs: 24, sm: 8 }
        },
        {
          label: '電話',
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
            }, '刪除')
          },
          cols: { xs: 24, sm: 8 }
        }
      ]
    }
  ]
  
  dynamicNestedManagement.addChildItem('contacts', newContactFields[0])
}
```

### 2. 條件嵌套顯示

```typescript
const conditionalNestedItems = [
  {
    label: '賬户類型',
    prop: 'accountType',
    render: 'select',
    renderSlots: {
      default: () => [
        h('el-option', { label: '個人賬户', value: 'personal' }),
        h('el-option', { label: '企業賬户', value: 'business' })
      ]
    }
  },
  {
    label: '個人信息',
    prop: 'personalInfo',
    show: (model) => model.accountType === 'personal',
    dependencies: ['accountType'],
    children: [
      {
        label: '身份證號',
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
    label: '企業信息',
    prop: 'businessInfo',
    show: (model) => model.accountType === 'business',
    dependencies: ['accountType'],
    children: [
      {
        label: '統一社會信用代碼',
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

## 對象數組表單

### 1. 基礎對象數組

```typescript
// 處理數組形式的嵌套數據
const arrayFormItems = [
  {
    label: '教育經歷',
    prop: 'education',
    children: [], // 動態生成數組項
    itemSlots: {
      append: () => {
        return h('el-button', {
          type: 'primary',
          size: 'small',
          onClick: () => addEducationItem()
        }, '添加教育經歷')
      }
    }
  }
]

// 動態管理數組項
const educationArray = ref([])

const addEducationItem = () => {
  const index = educationArray.value.length
  educationArray.value.push({
    school: '',
    major: '',
    startDate: '',
    endDate: ''
  })
  
  // 動態添加表單項
  const newEducationItem = {
    label: `教育經歷 ${index + 1}`,
    prop: `education.${index}`,
    children: [
      {
        label: '學校名稱',
        prop: `education.${index}.school`,
        render: 'input',
        cols: { xs: 24, sm: 12 }
      },
      {
        label: '專業',
        prop: `education.${index}.major`,
        render: 'input',
        cols: { xs: 24, sm: 12 }
      },
      {
        label: '開始時間',
        prop: `education.${index}.startDate`,
        render: 'datePicker',
        renderProps: { type: 'date' },
        cols: { xs: 24, sm: 8 }
      },
      {
        label: '結束時間',
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
          }, '刪除')
        },
        cols: { xs: 24, sm: 8 }
      }
    ],
    itemSlots: {
      label: () => {
        return h('div', { class: 'education-header' }, [
          h('span', `教育經歷 ${index + 1}`),
          h('el-tag', { size: 'small', type: 'info' }, '可刪除')
        ])
      }
    }
  }
  
  dynamicNestedManagement.addChildItem('education', newEducationItem)
}

const removeEducationItem = (index: number) => {
  educationArray.value.splice(index, 1)
  // 重新構建表單項
  rebuildEducationItems()
}

const rebuildEducationItems = () => {
  const educationItems = educationArray.value.map((_, index) => ({
    // ... 重新構建表單項配置
  }))
  
  dynamicNestedManagement.updateChildrenItems('education', educationItems)
}
```

### 2. 複雜對象數組

```typescript
const complexArrayForm = [
  {
    label: '項目經驗',
    prop: 'projects',
    children: [], // 動態生成
    itemSlots: {
      label: ({ item }) => {
        return h('div', { class: 'section-header' }, [
          h('h3', '項目經驗'),
          h('el-button', {
            type: 'primary',
            size: 'small',
            onClick: () => addProject()
          }, '添加項目')
        ])
      }
    }
  }
]

// 項目數據結構
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
    label: `項目 ${projectIndex + 1}`,
    prop: `projects.${projectIndex}`,
    children: [
      {
        label: '項目名稱',
        prop: `projects.${projectIndex}.name`,
        render: 'input',
        cols: { xs: 24, sm: 12 }
      },
      {
        label: '項目描述',
        prop: `projects.${projectIndex}.description`,
        render: 'textarea',
        renderProps: { rows: 3 },
        cols: { xs: 24, sm: 12 }
      },
      {
        label: '技術棧',
        prop: `projects.${projectIndex}.technologies`,
        render: 'select',
        renderProps: {
          multiple: true,
          placeholder: '選擇技術棧'
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
        label: '項目成員',
        prop: `projects.${projectIndex}.members`,
        children: [], // 嵌套的成員列表
        itemSlots: {
          append: () => {
            return h('el-button', {
              size: 'small',
              onClick: () => addProjectMember(projectIndex)
            }, '添加成員')
          }
        }
      }
    ]
  }
  
  dynamicNestedManagement.addChildItem('projects', projectFormItem)
}

// 添加項目成員（三級嵌套）
const addProjectMember = (projectIndex: number) => {
  const memberIndex = projectsArray.value[projectIndex].members.length
  projectsArray.value[projectIndex].members.push({ name: '', role: '' })
  
  const memberFormItem = {
    label: `成員 ${memberIndex + 1}`,
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
            h('el-option', { label: '項目經理', value: 'pm' }),
            h('el-option', { label: '前端開發', value: 'frontend' }),
            h('el-option', { label: '後端開發', value: 'backend' }),
            h('el-option', { label: '測試工程師', value: 'tester' })
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
          }, '刪除')
        },
        cols: { xs: 24, sm: 8 }
      }
    ]
  }
  
  // 添加到項目的成員列表
  const projectItem = formRef.value.getItemByProp(`projects.${projectIndex}`)
  const membersItem = projectItem?.children?.find(child => child.prop === `projects.${projectIndex}.members`)
  if (membersItem) {
    membersItem.children = [...(membersItem.children || []), memberFormItem]
    formRef.value.updateItem(`projects.${projectIndex}`, projectItem)
  }
}
```

## 嵌套表單驗證

### 1. 層級驗證規則

```typescript
const nestedValidationItems = [
  {
    label: '用户資料',
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
                { required: true, message: '請輸入用户名', trigger: 'blur' },
                { min: 3, max: 20, message: '用户名長度在3-20個字符', trigger: 'blur' }
              ]
            }
          }
        ]
      },
      {
        label: '聯繫方式',
        prop: 'profile.contact',
        children: [
          {
            label: '郵箱',
            prop: 'profile.contact.email',
            render: 'input',
            renderProps: { type: 'email' },
            customValidator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('請輸入郵箱地址'))
              } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                callback(new Error('請輸入有效的郵箱地址'))
              } else {
                callback()
              }
            }
          },
          {
            label: '電話',
            prop: 'profile.contact.phone',
            render: 'input',
            asyncValidator: async (rule, value) => {
              if (value) {
                const isValid = await validatePhoneNumber(value)
                if (!isValid) {
                  throw new Error('電話號碼格式不正確')
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

### 2. 數組項驗證

```typescript
// 驗證所有數組項
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

// 驗證嵌套對象
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

## 數據處理工具

### 1. 嵌套數據扁平化

```typescript
// 將嵌套數據扁平化用於表單顯示
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

// 將扁平化數據轉換回嵌套結構
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

### 2. 數組數據管理

```typescript
// 數組數據操作工具
const arrayDataManager = {
  // 添加數組項
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
  
  // 刪除數組項
  removeItem: (arrayPath: string, index: number) => {
    const currentData = formRef.value.getFormData()
    const arrayData = get(currentData, arrayPath) || []
    
    arrayData.splice(index, 1)
    set(currentData, arrayPath, arrayData)
    formRef.value.setFormData(currentData)
  },
  
  // 移動數組項
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

## 相關鏈接

- [MaFormItem children 配置](/front/component/ma-form#嵌套與條件配置)
- [高級特性 - 條件渲染](/front/component/ma-form#條件渲染)
- [表單項管理方法](/front/component/ma-form/examples/expose-methods#表單項管理方法)