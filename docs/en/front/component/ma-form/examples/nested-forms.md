# Nested Forms

Demonstrates the implementation of MaForm's nested form structure, including hierarchical forms, dynamic nesting, object array forms, and complex data structure handling.

<DemoPreview dir="demos/ma-form/nested-forms" />

## Features

- **Hierarchical Structure**: Supports multi-level nested form structures
- **Dynamic Nesting**: Allows dynamic addition and removal of nested form items
- **Object Arrays**: Supports complex data structures in object array format
- **Independent Validation**: Each nested level has independent validation mechanisms
- **Flexible Configuration**: Supports personalized configuration for nested items

## Basic Nested Structure

### 1. Simple Object Nesting

```typescript
const nestedFormItems = [
  {
    label: 'User Information',
    prop: 'userInfo',
    children: [
      {
        label: 'Name',
        prop: 'userInfo.name',
        render: 'input',
        renderProps: {
          placeholder: 'Enter name'
        },
        cols: { xs: 24, sm: 12 }
      },
      {
        label: 'Age',
        prop: 'userInfo.age',
        render: 'inputNumber',
        renderProps: {
          min: 0,
          max: 150
        },
        cols: { xs: 24, sm: 12 }
      },
      {
        label: 'Email',
        prop: 'userInfo.email',
        render: 'input',
        renderProps: {
          type: 'email',
          placeholder: 'Enter email address'
        },
        cols: { xs: 24, sm: 24 }
      }
    ]
  }
]
```

### 2. Multi-Level Nesting

```typescript
const multiLevelNested = [
  {
    label: 'Company Information',
    prop: 'company',
    children: [
      {
        label: 'Basic Information',
        prop: 'company.basic',
        children: [
          {
            label: 'Company Name',
            prop: 'company.basic.name',
            render: 'input',
            renderProps: {
              placeholder: 'Enter company name'
            }
          },
          {
            label: 'Founded Date',
            prop: 'company.basic.foundedDate',
            render: 'datePicker',
            renderProps: {
              type: 'date',
              placeholder: 'Select founded date'
            }
          }
        ]
      },
      {
        label: 'Contact Information',
        prop: 'company.contact',
        children: [
          {
            label: 'Address',
            prop: 'company.contact.address',
            render: 'textarea',
            renderProps: {
              rows: 3,
              placeholder: 'Enter detailed address'
            }
          },
          {
            label: 'Phone',
            prop: 'company.contact.phone',
            render: 'input',
            renderProps: {
              placeholder: 'Enter contact phone'
            }
          }
        ]
      }
    ]
  }
]
```

## Dynamic Nested Forms

### 1. Dynamic Add/Remove Child Items

```typescript
// Dynamically manage nested form items
const dynamicNestedManagement = {
  // Add child form item
  addChildItem: (parentProp: string, childItem: MaFormItem) => {
    const parentItem = formRef.value.getItemByProp(parentProp)
    if (parentItem) {
      const updatedChildren = [...(parentItem.children || []), childItem]
      formRef.value.updateItem(parentProp, {
        children: updatedChildren
      })
    }
  },

  // Remove child form item
  removeChildItem: (parentProp: string, childIndex: number) => {
    const parentItem = formRef.value.getItemByProp(parentProp)
    if (parentItem && parentItem.children) {
      const updatedChildren = parentItem.children.filter((_, index) => index !== childIndex)
      formRef.value.updateItem(parentProp, {
        children: updatedChildren
      })
    }
  },

  // Batch update child items
  updateChildrenItems: (parentProp: string, children: MaFormItem[]) => {
    formRef.value.updateItem(parentProp, { children })
  }
}

// Dynamic contact form example
const contactFormItems = [
  {
    label: 'Contact List',
    prop: 'contacts',
    children: [], // Initially empty, added dynamically
    itemSlots: {
      append: ({ item, model }) => {
        return h('div', { class: 'contact-actions' }, [
          h('el-button', {
            type: 'primary',
            size: 'small',
            icon: 'Plus',
            onClick: () => addContact()
          }, 'Add Contact')
        ])
      }
    }
  }
]

// Add contact
const addContact = () => {
  const contactIndex = contactCount.value++
  const newContactFields = [
    {
      label: `Contact ${contactIndex + 1}`,
      prop: `contacts.${contactIndex}`,
      children: [
        {
          label: 'Name',
          prop: `contacts.${contactIndex}.name`,
          render: 'input',
          cols: { xs: 24, sm: 8 }
        },
        {
          label: 'Phone',
          prop: `contacts.${contactIndex}.phone`,
          render: 'input',
          cols: { xs: 24, sm: 8 }
        },
        {
          label: 'Action',
          prop: `contacts.${contactIndex}.actions`,
          render: ({ item }) => {
            return h('el-button', {
              type: 'danger',
              size: 'small',
              onClick: () => removeContact(contactIndex)
            }, 'Delete')
          },
          cols: { xs: 24, sm: 8 }
        }
      ]
    }
  ]
  
  dynamicNestedManagement.addChildItem('contacts', newContactFields[0])
}
```

### 2. Conditional Nested Display

```typescript
const conditionalNestedItems = [
  {
    label: 'Account Type',
    prop: 'accountType',
    render: 'select',
    renderSlots: {
      default: () => [
        h('el-option', { label: 'Personal Account', value: 'personal' }),
        h('el-option', { label: 'Business Account', value: 'business' })
      ]
    }
  },
  {
    label: 'Personal Information',
    prop: 'personalInfo',
    show: (model) => model.accountType === 'personal',
    dependencies: ['accountType'],
    children: [
      {
        label: 'ID Number',
        prop: 'personalInfo.idCard',
        render: 'input',
        show: (model) => model.accountType === 'personal',
        dependencies: ['accountType']
      },
      {
        label: 'Birth Date',
        prop: 'personalInfo.birthDate',
        render: 'datePicker',
        show: (model) => model.accountType === 'personal',
        dependencies: ['accountType']
      }
    ]
  },
  {
    label: 'Business Information',
    prop: 'businessInfo',
    show: (model) => model.accountType === 'business',
    dependencies: ['accountType'],
    children: [
      {
        label: 'Unified Social Credit Code',
        prop: 'businessInfo.creditCode',
        render: 'input',
        show: (model) => model.accountType === 'business',
        dependencies: ['accountType']
      },
      {
        label: 'Legal Representative',
        prop: 'businessInfo.legalPerson',
        render: 'input',
        show: (model) => model.accountType === 'business',
        dependencies: ['accountType']
      }
    ]
  }
]
```

## Object Array Forms

### 1. Basic Object Array

```typescript
// Handle array-type nested data
const arrayFormItems = [
  {
    label: 'Education History',
    prop: 'education',
    children: [], // Dynamically generate array items
    itemSlots: {
      append: () => {
        return h('el-button', {
          type: 'primary',
          size: 'small',
          onClick: () => addEducationItem()
        }, 'Add Education')
      }
    }
  }
]

// Dynamically manage array items
const educationArray = ref([])

const addEducationItem = () => {
  const index = educationArray.value.length
  educationArray.value.push({
    school: '',
    major: '',
    startDate: '',
    endDate: ''
  })
  
  // Dynamically add form items
  const newEducationItem = {
    label: `Education ${index + 1}`,
    prop: `education.${index}`,
    children: [
      {
        label: 'School Name',
        prop: `education.${index}.school`,
        render: 'input',
        cols: { xs: 24, sm: 12 }
      },
      {
        label: 'Major',
        prop: `education.${index}.major`,
        render: 'input',
        cols: { xs: 24, sm: 12 }
      },
      {
        label: 'Start Date',
        prop: `education.${index}.startDate`,
        render: 'datePicker',
        renderProps: { type: 'date' },
        cols: { xs: 24, sm: 8 }
      },
      {
        label: 'End Date',
        prop: `education.${index}.endDate`,
        render: 'datePicker',
        renderProps: { type: 'date' },
        cols: { xs: 24, sm: 8 }
      },
      {
        label: 'Action',
        prop: `education.${index}.actions`,
        render: () => {
          return h('el-button', {
            type: 'danger',
            size: 'small',
            onClick: () => removeEducationItem(index)
          }, 'Delete')
        },
        cols: { xs: 24, sm: 8 }
      }
    ],
    itemSlots: {
      label: () => {
        return h('div', { class: 'education-header' }, [
          h('span', `Education ${index + 1}`),
          h('el-tag', { size: 'small', type: 'info' }, 'Removable')
        ])
      }
    }
  }
  
  dynamicNestedManagement.addChildItem('education', newEducationItem)
}

const removeEducationItem = (index: number) => {
  educationArray.value.splice(index, 1)
  // Rebuild form items
  rebuildEducationItems()
}

const rebuildEducationItems = () => {
  const educationItems = educationArray.value.map((_, index) => ({
    // ... Rebuild form item configuration
  }))
  
  dynamicNestedManagement.updateChildrenItems('education', educationItems)
}
```

### 2. Complex Object Array

```typescript
const complexArrayForm = [
  {
    label: 'Project Experience',
    prop: 'projects',
    children: [], // Dynamically generated
    itemSlots: {
      label: ({ item }) => {
        return h('div', { class: 'section-header' }, [
          h('h3', 'Project Experience'),
          h('el-button', {
            type: 'primary',
            size: 'small',
            onClick: () => addProject()
          }, 'Add Project')
        ])
      }
    }
  }
]

// Project data structure
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
    label: `Project ${projectIndex + 1}`,
    prop: `projects.${projectIndex}`,
    children: [
      {
        label: 'Project Name',
        prop: `projects.${projectIndex}.name`,
        render: 'input',
        cols: { xs: 24, sm: 12 }
      },
      {
        label: 'Project Description',
        prop: `projects.${projectIndex}.description`,
        render: 'textarea',
        renderProps: { rows: 3 },
        cols: { xs: 24, sm: 12 }
      },
      {
        label: 'Technologies',
        prop: `projects.${projectIndex}.technologies`,
        render: 'select',
        renderProps: {
          multiple: true,
          placeholder: 'Select technologies'
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
        label: 'Project Members',
        prop: `projects.${projectIndex}.members`,
        children: [], // Nested member list
        itemSlots: {
          append: () => {
            return h('el-button', {
              size: 'small',
              onClick: () => addProjectMember(projectIndex)
            }, 'Add Member')
          }
        }
      }
    ]
  }
  
  dynamicNestedManagement.addChildItem('projects', projectFormItem)
}

// Add project member (third-level nesting)
const addProjectMember = (projectIndex: number) => {
  const memberIndex = projectsArray.value[projectIndex].members.length
  projectsArray.value[projectIndex].members.push({ name: '', role: '' })
  
  const memberFormItem = {
    label: `Member ${memberIndex + 1}`,
    prop: `projects.${projectIndex}.members.${memberIndex}`,
    children: [
      {
        label: 'Name',
        prop: `projects.${projectIndex}.members.${memberIndex}.name`,
        render: 'input',
        cols: { xs: 24, sm: 8 }
      },
      {
        label: 'Role',
        prop: `projects.${projectIndex}.members.${memberIndex}.role`,
        render: 'select',
        renderSlots: {
          default: () => [
            h('el-option', { label: 'Project Manager', value: 'pm' }),
            h('el-option', { label: 'Frontend Developer', value: 'frontend' }),
            h('el-option', { label: 'Backend Developer', value: 'backend' }),
            h('el-option', { label: 'QA Engineer', value: 'tester' })
          ]
        },
        cols: { xs: 24, sm: 8 }
      },
      {
        label: 'Action',
        prop: `projects.${projectIndex}.members.${memberIndex}.actions`,
        render: () => {
          return h('el-button', {
            type: 'danger',
            size: 'small',
            onClick: () => removeProjectMember(projectIndex, memberIndex)
          }, 'Delete')
        },
        cols: { xs: 24, sm: 8 }
      }
    ]
  }
  
  // Add to project's member list
  const projectItem = formRef.value.getItemByProp(`projects.${projectIndex}`)
  const membersItem = projectItem?.children?.find(child => child.prop === `projects.${projectIndex}.members`)
  if (membersItem) {
    membersItem.children = [...(membersItem.children || []), memberFormItem]
    formRef.value.updateItem(`projects.${projectIndex}`, projectItem)
  }
}
```

## Nested Form Validation

### 1. Hierarchical Validation Rules

```typescript
const nestedValidationItems = [
  {
    label: 'User Profile',
    prop: 'profile',
    children: [
      {
        label: 'Basic Information',
        prop: 'profile.basic',
        children: [
          {
            label: 'Username',
            prop: 'profile.basic.username',
            render: 'input',
            itemProps: {
              rules: [
                { required: true, message: 'Please enter username', trigger: 'blur' },
                { min: 3, max: 20, message: 'Username length 3-20 characters', trigger: 'blur' }
              ]
            }
          }
        ]
      },
      {
        label: 'Contact Information',
        prop: 'profile.contact',
        children: [
          {
            label: 'Email',
            prop: 'profile.contact.email',
            render: 'input',
            renderProps: { type: 'email' },
            customValidator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('Please enter email address'))
              } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                callback(new Error('Please enter valid email address'))
              } else {
                callback()
              }
            }
          },
          {
            label: 'Phone',
            prop: 'profile.contact.phone',
            render: 'input',
            asyncValidator: async (rule, value) => {
              if (value) {
                const isValid = await validatePhoneNumber(value)
                if (!isValid) {
                  throw new Error('Invalid phone number format')
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

### 2. Array Item Validation

```typescript
// Validate all array items
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

// Validate nested objects
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

## Data Processing Utilities

### 