# ネストフォーム

MaFormのネストフォーム構造の実装を展示します。階層フォーム、動的ネスト、オブジェクト配列フォーム、複雑なデータ構造処理を含みます。

<DemoPreview dir="demos/ma-form/nested-forms" />

## 機能特徴

- **階層構造**: マルチレベルネストフォーム構造をサポート
- **動的ネスト**: ネストフォーム項目の動的追加・削除が可能
- **オブジェクト配列**: オブジェクト配列形式の複雑なデータ構造をサポート
- **独立検証**: 各ネストレベルに独立した検証メカニズム
- **柔軟な設定**: ネスト項目の個別設定をサポート

## 基本ネスト構造

### 1. シンプルなオブジェクトネスト

```typescript
const nestedFormItems = [
  {
    label: 'ユーザー情報',
    prop: 'userInfo',
    children: [
      {
        label: '氏名',
        prop: 'userInfo.name',
        render: 'input',
        renderProps: {
          placeholder: '氏名を入力してください'
        },
        cols: { xs: 24, sm: 12 }
      },
      {
        label: '年齢',
        prop: 'userInfo.age',
        render: 'inputNumber',
        renderProps: {
          min: 0,
          max: 150
        },
        cols: { xs: 24, sm: 12 }
      },
      {
        label: 'メールアドレス',
        prop: 'userInfo.email',
        render: 'input',
        renderProps: {
          type: 'email',
          placeholder: 'メールアドレスを入力してください'
        },
        cols: { xs: 24, sm: 24 }
      }
    ]
  }
]
```

### 2. マルチレベルネスト

```typescript
const multiLevelNested = [
  {
    label: '会社情報',
    prop: 'company',
    children: [
      {
        label: '基本情報',
        prop: 'company.basic',
        children: [
          {
            label: '会社名',
            prop: 'company.basic.name',
            render: 'input',
            renderProps: {
              placeholder: '会社名を入力してください'
            }
          },
          {
            label: '設立日',
            prop: 'company.basic.foundedDate',
            render: 'datePicker',
            renderProps: {
              type: 'date',
              placeholder: '設立日を選択'
            }
          }
        ]
      },
      {
        label: '連絡先情報',
        prop: 'company.contact',
        children: [
          {
            label: '住所',
            prop: 'company.contact.address',
            render: 'textarea',
            renderProps: {
              rows: 3,
              placeholder: '詳細な住所を入力してください'
            }
          },
          {
            label: '電話番号',
            prop: 'company.contact.phone',
            render: 'input',
            renderProps: {
              placeholder: '電話番号を入力してください'
            }
          }
        ]
      }
    ]
  }
]
```

## 動的ネストフォーム

### 1. 動的追加/削除子項目

```typescript
// ネストフォーム項目の動的管理
const dynamicNestedManagement = {
  // 子フォーム項目を追加
  addChildItem: (parentProp: string, childItem: MaFormItem) => {
    const parentItem = formRef.value.getItemByProp(parentProp)
    if (parentItem) {
      const updatedChildren = [...(parentItem.children || []), childItem]
      formRef.value.updateItem(parentProp, {
        children: updatedChildren
      })
    }
  },

  // 子フォーム項目を削除
  removeChildItem: (parentProp: string, childIndex: number) => {
    const parentItem = formRef.value.getItemByProp(parentProp)
    if (parentItem && parentItem.children) {
      const updatedChildren = parentItem.children.filter((_, index) => index !== childIndex)
      formRef.value.updateItem(parentProp, {
        children: updatedChildren
      })
    }
  },

  // 子フォーム項目を一括更新
  updateChildrenItems: (parentProp: string, children: MaFormItem[]) => {
    formRef.value.updateItem(parentProp, { children })
  }
}

// 動的連絡先フォーム例
const contactFormItems = [
  {
    label: '連絡先リスト',
    prop: 'contacts',
    children: [], // 初期は空、動的に追加
    itemSlots: {
      append: ({ item, model }) => {
        return h('div', { class: 'contact-actions' }, [
          h('el-button', {
            type: 'primary',
            size: 'small',
            icon: 'Plus',
            onClick: () => addContact()
          }, '連絡先を追加')
        ])
      }
    }
  }
]

// 連絡先を追加
const addContact = () => {
  const contactIndex = contactCount.value++
  const newContactFields = [
    {
      label: `連絡先 ${contactIndex + 1}`,
      prop: `contacts.${contactIndex}`,
      children: [
        {
          label: '氏名',
          prop: `contacts.${contactIndex}.name`,
          render: 'input',
          cols: { xs: 24, sm: 8 }
        },
        {
          label: '電話番号',
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
            }, '削除')
          },
          cols: { xs: 24, sm: 8 }
        }
      ]
    }
  ]
  
  dynamicNestedManagement.addChildItem('contacts', newContactFields[0])
}
```

### 2. 条件付きネスト表示

```typescript
const conditionalNestedItems = [
  {
    label: 'アカウントタイプ',
    prop: 'accountType',
    render: 'select',
    renderSlots: {
      default: () => [
        h('el-option', { label: '個人アカウント', value: 'personal' }),
        h('el-option', { label: '企業アカウント', value: 'business' })
      ]
    }
  },
  {
    label: '個人情報',
    prop: 'personalInfo',
    show: (model) => model.accountType === 'personal',
    dependencies: ['accountType'],
    children: [
      {
        label: '身分証番号',
        prop: 'personalInfo.idCard',
        render: 'input',
        show: (model) => model.accountType === 'personal',
        dependencies: ['accountType']
      },
      {
        label: '生年月日',
        prop: 'personalInfo.birthDate',
        render: 'datePicker',
        show: (model) => model.accountType === 'personal',
        dependencies: ['accountType']
      }
    ]
  },
  {
    label: '企業情報',
    prop: 'businessInfo',
    show: (model) => model.accountType === 'business',
    dependencies: ['accountType'],
    children: [
      {
        label: '統一社会信用コード',
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

## オブジェクト配列フォーム

### 1. 基本オブジェクト配列

```typescript
// 配列形式のネストデータ処理
const arrayFormItems = [
  {
    label: '学歴',
    prop: 'education',
    children: [], // 動的に配列項目を生成
    itemSlots: {
      append: () => {
        return h('el-button', {
          type: 'primary',
          size: 'small',
          onClick: () => addEducationItem()
        }, '学歴を追加')
      }
    }
  }
]

// 配列項目の動的管理
const educationArray = ref([])

const addEducationItem = () => {
  const index = educationArray.value.length
  educationArray.value.push({
    school: '',
    major: '',
    startDate: '',
    endDate: ''
  })
  
  // フォーム項目を動的に追加
  const newEducationItem = {
    label: `学歴 ${index + 1}`,
    prop: `education.${index}`,
    children: [
      {
        label: '学校名',
        prop: `education.${index}.school`,
        render: 'input',
        cols: { xs: 24, sm: 12 }
      },
      {
        label: '専攻',
        prop: `education.${index}.major`,
        render: 'input',
        cols: { xs: 24, sm: 12 }
      },
      {
        label: '開始日',
        prop: `education.${index}.startDate`,
        render: 'datePicker',
        renderProps: { type: 'date' },
        cols: { xs: 24, sm: 8 }
      },
      {
        label: '終了日',
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
          }, '削除')
        },
        cols: { xs: 24, sm: 8 }
      }
    ],
    itemSlots: {
      label: () => {
        return h('div', { class: 'education-header' }, [
          h('span', `学歴 ${index + 1}`),
          h('el-tag', { size: 'small', type: 'info' }, '削除可能')
        ])
      }
    }
  }
  
  dynamicNestedManagement.addChildItem('education', newEducationItem)
}

const removeEducationItem = (index: number) => {
  educationArray.value.splice(index, 1)
  // フォーム項目を再構築
  rebuildEducationItems()
}

const rebuildEducationItems = () => {
  const educationItems = educationArray.value.map((_, index) => ({
    // ... フォーム項目設定を再構築
  }))
  
  dynamicNestedManagement.updateChildrenItems('education', educationItems)
}
```

### 2. 複雑なオブジェクト配列

```typescript
const complexArrayForm = [
  {
    label: 'プロジェクト経験',
    prop: 'projects',
    children: [], // 動的に生成
    itemSlots: {
      label: ({ item }) => {
        return h('div', { class: 'section-header' }, [
          h('h3', 'プロジェクト経験'),
          h('el-button', {
            type: 'primary',
            size: 'small',
            onClick: () => addProject()
          }, 'プロジェクトを追加')
        ])
      }
    }
  }
]

// プロジェクトデータ構造
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
    label: `プロジェクト ${projectIndex + 1}`,
    prop: `projects.${projectIndex}`,
    children: [
      {
        label: 'プロジェクト名',
        prop: `projects.${projectIndex}.name`,
        render: 'input',
        cols: { xs: 24, sm: 12 }
      },
      {
        label: 'プロジェクト説明',
        prop: `projects.${projectIndex}.description`,
        render: 'textarea',
        renderProps: { rows: 3 },
        cols: { xs: 24, sm: 12 }
      },
      {
        label: '技術スタック',
        prop: `projects.${projectIndex}.technologies`,
        render: 'select',
        renderProps: {
          multiple: true,
          placeholder: '技術スタックを選択'
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
        label: 'プロジェクトメンバー',
        prop: `projects.${projectIndex}.members`,
        children: [], // ネストされたメンバーリスト
        itemSlots: {
          append: () => {
            return h('el-button', {
              size: 'small',
              onClick: () => addProjectMember(projectIndex)
            }, 'メンバーを追加')
          }
        }
      }
    ]
  }
  
  dynamicNestedManagement.addChildItem('projects', projectFormItem)
}

// プロジェクトメンバーを追加（3階層ネスト）
const addProjectMember = (projectIndex: number) => {
  const memberIndex = projectsArray.value[projectIndex].members.length
  projectsArray.value[projectIndex].members.push({ name: '', role: '' })
  
  const memberFormItem = {
    label: `メンバー ${memberIndex + 1}`,
    prop: `projects.${projectIndex}.members.${memberIndex}`,
    children: [
      {
        label: '氏名',
        prop: `projects.${projectIndex}.members.${memberIndex}.name`,
        render: 'input',
        cols: { xs: 24, sm: 8 }
      },
      {
        label: '役割',
        prop: `projects.${projectIndex}.members.${memberIndex}.role`,
        render: 'select',
        renderSlots: {
          default: () => [
            h('el-option', { label: 'プロジェクトマネージャー', value: 'pm' }),
            h('el-option', { label: 'フロントエンド開発者', value: 'frontend' }),
            h('el-option', { label: 'バックエンド開発者', value: 'backend' }),
            h('el-option', { label: 'テストエンジニア', value: 'tester' })
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
          }, '削除')
        },
        cols: { xs: 24, sm: 8 }
      }
    ]
  }
  
  // プロジェクトのメンバーリストに追加
  const projectItem = formRef.value.getItemByProp(`projects.${projectIndex}`)
  const membersItem = projectItem?.children?.find(child => child.prop === `projects.${projectIndex}.members`)
  if (membersItem) {
    membersItem.children = [...(membersItem.children || []), memberFormItem]
    formRef.value.updateItem(`projects.${projectIndex}`, projectItem)
  }
}
```

## ネストフォーム検証

### 1. 階層検証ルール

```typescript
const nestedValidationItems = [
  {
    label: 'ユーザープロファイル',
    prop: 'profile',
    children: [
      {
        label: '基本情報',
        prop: 'profile.basic',
        children: [
          {
            label: 'ユーザー名',
            prop: 'profile.basic.username',
            render: 'input',
            itemProps: {
              rules: [
                { required: true, message: 'ユーザー名を入力してください', trigger: 'blur' },
                { min: 3, max: 20, message: 'ユーザー名は3-20文字で入力してください', trigger: 'blur' }
              ]
            }
          }
        ]
      },
      {
        label: '連絡先',
        prop: 'profile.contact',
        children: [
          {
            label: 'メールアドレス',
            prop: 'profile.contact.email',
            render: 'input',
            renderProps: { type: 'email' },
            customValidator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('メールアドレスを入力してください'))
              } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                callback(new Error('有効なメールアドレスを入力してください'))
              } else {
                callback()
              }
            }
          },
          {
            label: '電話番号',
            prop: 'profile.contact.phone',
            render: 'input',
            asyncValidator: async (rule, value) => {
              if (value) {
                const isValid = await validatePhoneNumber(value)
                if (!isValid) {
                  throw new Error('電話番号の形式が正しくありません')
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

### 2. 配列項目検証

```typescript
// 