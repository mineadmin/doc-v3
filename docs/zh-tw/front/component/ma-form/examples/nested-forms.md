# 巢狀表單

展示 MaForm 的巢狀表單結構實現，包括層級表單、動態巢狀、物件陣列表單和複雜資料結構處理。

<DemoPreview dir="demos/ma-form/nested-forms" />

## 功能特性

- **層級結構**：支援多層級巢狀表單結構
- **動態巢狀**：可以動態新增和刪除巢狀表單項
- **物件陣列**：支援物件陣列形式的複雜資料結構
- **獨立驗證**：每個巢狀層級都有獨立的驗證機制
- **靈活配置**：支援對巢狀項的個性化配置

## 基礎巢狀結構

### 1. 簡單物件巢狀

```typescript
const nestedFormItems = [
  {
    label: '使用者資訊',
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

### 2. 多層級巢狀

```typescript
const multiLevelNested = [
  {
    label: '公司資訊',
    prop: 'company',
    children: [
      {
        label: '基本資訊',
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
        label: '聯絡資訊',
        prop: 'company.contact',
        children: [
          {
            label: '聯絡地址',
            prop: 'company.contact.address',
            render: 'textarea',
            renderProps: {
              rows: 3,
              placeholder: '請輸入詳細地址'
            }
          },
          {
            label: '聯絡電話',
            prop: 'company.contact.phone',
            render: 'input',
            renderProps: {
              placeholder: '請輸入聯絡電話'
            }
          }
        ]
      }
    ]
  }
]
```

## 動態巢狀表單

### 1. 動態新增/刪除子項

```typescript
// 動態管理巢狀表單項
const dynamicNestedManagement = {
  // 新增子表單項
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

  // 批次更新子表單項
  updateChildrenItems: (parentProp: string, children: MaFormItem[]) => {
    formRef.value.updateItem(parentProp, { children })
  }
}

// 動態聯絡人表單示例
const contactFormItems = [
  {
    label: '聯絡人列表',
    prop: 'contacts',
    children: [], // 初始為空，動態新增
    itemSlots: {
      append: ({ item, model }) => {
        return h('div', { class: 'contact-actions' }, [
          h('el-button', {
            type: 'primary',
            size: 'small',
            icon: 'Plus',
            onClick: () => addContact()
          }, '新增聯絡人')
        ])
      }
    }
  }
]

// 新增聯絡人
const addContact = () => {
  const contactIndex = contactCount.value++
  const newContactFields = [
    {
      label: `聯絡人 ${contactIndex + 1}`,
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

### 2. 條件巢狀顯示

```typescript
const conditionalNestedItems = [
  {
    label: '賬戶型別',
    prop: 'accountType',
    render: 'select',
    renderSlots: {
      default: () => [
        h('el-option', { label: '個人賬戶', value: 'personal' }),
        h('el-option', { label: '企業賬戶', value: 'business' })
      ]
    }
  },
  {
    label: '個人資訊',
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
    label: '企業資訊',
    prop: 'businessInfo',
    show: (model) => model.accountType === 'business',
    dependencies: ['accountType'],
    children: [
      {
        label: '統一社會信用程式碼',
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

## 物件陣列表單

### 1. 基礎物件陣列

```typescript
// 處理陣列形式的巢狀資料
const arrayFormItems = [
  {
    label: '教育經歷',
    prop: 'education',
    children: [], // 動態生成陣列項
    itemSlots: {
      append: () => {
        return h('el-button', {
          type: 'primary',
          size: 'small',
          onClick: () => addEducationItem()
        }, '新增教育經歷')
      }
    }
  }
]

// 動態管理陣列項
const educationArray = ref([])

const addEducationItem = () => {
  const index = educationArray.value.length
  educationArray.value.push({
    school: '',
    major: '',
    startDate: '',
    endDate: ''
  })
  
  // 動態新增表單項
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

### 2. 複雜物件陣列

```typescript
const complexArrayForm = [
  {
    label: '專案經驗',
    prop: 'projects',
    children: [], // 動態生成
    itemSlots: {
      label: ({ item }) => {
        return h('div', { class: 'section-header' }, [
          h('h3', '專案經驗'),
          h('el-button', {
            type: 'primary',
            size: 'small',
            onClick: () => addProject()
          }, '新增專案')
        ])
      }
    }
  }
]

// 專案資料結構
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
    label: `專案 ${projectIndex + 1}`,
    prop: `projects.${projectIndex}`,
    children: [
      {
        label: '專案名稱',
        prop: `projects.${projectIndex}.name`,
        render: 'input',
        cols: { xs: 24, sm: 12 }
      },
      {
        label: '專案描述',
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
        label: '專案成員',
        prop: `projects.${projectIndex}.members`,
        children: [], // 巢狀的成員列表
        itemSlots: {
          append: () => {
            return h('el-button', {
              size: 'small',
              onClick: () => addProjectMember(projectIndex)
            }, '新增成員')
          }
        }
      }
    ]
  }
  
  dynamicNestedManagement.addChildItem('projects', projectFormItem)
}

// 新增專案成員（三級巢狀）
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
            h('el-option', { label: '專案經理', value: 'pm' }),
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
  
  // 新增到專案的成員列表
  const projectItem = formRef.value.getItemByProp(`projects.${projectIndex}`)
  const membersItem = projectItem?.children?.find(child => child.prop === `projects.${projectIndex}.members`)
  if (membersItem) {
    membersItem.children = [...(membersItem.children || []), memberFormItem]
    formRef.value.updateItem(`projects.${projectIndex}`, projectItem)
  }
}
```

## 巢狀表單驗證

### 1. 層級驗證規則

```typescript
const nestedValidationItems = [
  {
    label: '使用者資料',
    prop: 'profile',
    children: [
      {
        label: '基本資訊',
        prop: 'profile.basic',
        children: [
          {
            label: '使用者名稱',
            prop: 'profile.basic.username',
            render: 'input',
            itemProps: {
              rules: [
                { required: true, message: '請輸入使用者名稱', trigger: 'blur' },
                { min: 3, max: 20, message: '使用者名稱長度在3-20個字元', trigger: 'blur' }
              ]
            }
          }
        ]
      },
      {
        label: '聯絡方式',
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

### 2. 陣列項驗證

```typescript
// 驗證所有陣列項
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

// 驗證巢狀物件
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

## 資料處理工具

### 1. 巢狀資料扁平化

```typescript
// 將巢狀資料扁平化用於表單顯示
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

// 將扁平化資料轉換回巢狀結構
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

### 2. 陣列資料管理

```typescript
// 陣列資料操作工具
const arrayDataManager = {
  // 新增陣列項
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
  
  // 刪除陣列項
  removeItem: (arrayPath: string, index: number) => {
    const currentData = formRef.value.getFormData()
    const arrayData = get(currentData, arrayPath) || []
    
    arrayData.splice(index, 1)
    set(currentData, arrayPath, arrayData)
    formRef.value.setFormData(currentData)
  },
  
  // 移動陣列項
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

## 相關連結

- [MaFormItem children 配置](/front/component/ma-form#巢狀與條件配置)
- [高階特性 - 條件渲染](/front/component/ma-form#條件渲染)
- [表單項管理方法](/front/component/ma-form/examples/expose-methods#表單項管理方法)