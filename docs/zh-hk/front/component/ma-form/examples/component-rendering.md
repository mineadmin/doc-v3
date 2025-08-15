# 組件渲染

展示 MaForm 支持的所有 Element Plus 組件渲染方式，包括輸入類、選擇類、日期類和特殊組件。

<DemoPreview dir="demos/ma-form/component-rendering" />

## 功能特性

- **全面支持**：支持所有 Element Plus 表單組件
- **多種渲染方式**：字符串、組件、函數三種渲染方式
- **插槽支持**：完整的插槽系統支持
- **屬性傳遞**：通過 renderProps 傳遞組件屬性
- **事件處理**：支持組件的所有原生事件

## 輸入類組件

### Input 輸入框
```typescript
{
  label: '用户名',
  prop: 'username',
  render: 'input',
  renderProps: {
    placeholder: '請輸入用户名',
    clearable: true,
    prefixIcon: 'User',
    maxlength: 20,
    showWordLimit: true
  }
}
```

### InputNumber 數字輸入框
```typescript
{
  label: '數量',
  prop: 'quantity',
  render: 'inputNumber',
  renderProps: {
    min: 1,
    max: 999,
    step: 1,
    stepStrictly: true,
    precision: 0,
    controlsPosition: 'right'
  }
}
```

### Textarea 文本域
```typescript
{
  label: '描述',
  prop: 'description',
  render: 'textarea',
  renderProps: {
    rows: 4,
    placeholder: '請輸入描述信息',
    maxlength: 500,
    showWordLimit: true,
    autosize: { minRows: 2, maxRows: 6 },
    resize: 'vertical'
  }
}
```

## 選擇類組件

### Select 選擇器
```typescript
{
  label: '城市',
  prop: 'city',
  render: 'select',
  renderProps: {
    placeholder: '請選擇城市',
    clearable: true,
    filterable: true,
    multiple: false,
    multipleLimit: 3
  },
  renderSlots: {
    default: () => [
      h('el-option', { label: '北京', value: 'beijing' }),
      h('el-option', { label: '上海', value: 'shanghai' }),
      h('el-option', { label: '廣州', value: 'guangzhou' }),
      h('el-option', { label: '深圳', value: 'shenzhen' })
    ]
  }
}
```

### Cascader 級聯選擇器
```typescript
{
  label: '地區',
  prop: 'region',
  render: 'cascader',
  renderProps: {
    options: [
      {
        value: 'guangdong',
        label: '廣東省',
        children: [
          { value: 'guangzhou', label: '廣州市' },
          { value: 'shenzhen', label: '深圳市' }
        ]
      }
    ],
    props: {
      expandTrigger: 'hover',
      multiple: false,
      checkStrictly: false
    },
    showAllLevels: true,
    collapseTags: true,
    filterable: true
  }
}
```

### RadioGroup 單選框組
```typescript
{
  label: '性別',
  prop: 'gender',
  render: 'radioGroup',
  renderProps: {
    size: 'default',
    textColor: '#409EFF',
    fill: '#a0cfff'
  },
  renderSlots: {
    default: () => [
      h('el-radio', { label: 'male' }, '男'),
      h('el-radio', { label: 'female' }, '女'),
      h('el-radio', { label: 'other' }, '其他')
    ]
  }
}
```

### CheckboxGroup 複選框組
```typescript
{
  label: '興趣愛好',
  prop: 'hobbies',
  render: 'checkboxGroup',
  renderProps: {
    min: 1,
    max: 3
  },
  renderSlots: {
    default: () => [
      h('el-checkbox', { label: 'reading' }, '閲讀'),
      h('el-checkbox', { label: 'music' }, '音樂'),
      h('el-checkbox', { label: 'sports' }, '運動'),
      h('el-checkbox', { label: 'travel' }, '旅遊')
    ]
  }
}
```

## 日期時間類組件

### DatePicker 日期選擇器
```typescript
{
  label: '出生日期',
  prop: 'birthDate',
  render: 'datePicker',
  renderProps: {
    type: 'date',
    placeholder: '選擇日期',
    format: 'YYYY-MM-DD',
    valueFormat: 'YYYY-MM-DD',
    disabledDate: (time) => {
      return time.getTime() > Date.now()
    },
    shortcuts: [
      {
        text: '今天',
        value: new Date()
      },
      {
        text: '昨天',
        value: () => {
          const date = new Date()
          date.setTime(date.getTime() - 3600 * 1000 * 24)
          return date
        }
      }
    ]
  }
}
```

### TimePicker 時間選擇器
```typescript
{
  label: '時間',
  prop: 'time',
  render: 'timePicker',
  renderProps: {
    placeholder: '選擇時間',
    format: 'HH:mm:ss',
    valueFormat: 'HH:mm:ss',
    clearable: true,
    selectableRange: ['09:00:00 - 18:00:00']
  }
}
```

### DateTimePicker 日期時間選擇器
```typescript
{
  label: '預約時間',
  prop: 'appointmentTime',
  render: 'dateTimePicker',
  renderProps: {
    type: 'datetime',
    placeholder: '選擇日期時間',
    format: 'YYYY-MM-DD HH:mm:ss',
    valueFormat: 'YYYY-MM-DD HH:mm:ss',
    timePickerOptions: {
      selectableRange: '09:00:00 - 18:00:00'
    }
  }
}
```

## 特殊組件

### Switch 開關
```typescript
{
  label: '啓用狀態',
  prop: 'enabled',
  render: 'switch',
  renderProps: {
    activeText: '啓用',
    inactiveText: '禁用', 
    activeValue: true,
    inactiveValue: false,
    activeColor: '#13ce66',
    inactiveColor: '#ff4949',
    beforeChange: () => {
      return new Promise((resolve) => {
        ElMessageBox.confirm('確定要切換狀態嗎？')
          .then(() => resolve(true))
          .catch(() => resolve(false))
      })
    }
  }
}
```

### Rate 評分
```typescript
{
  label: '評分',
  prop: 'rating',
  render: 'rate',
  renderProps: {
    max: 5,
    allowHalf: true,
    showText: true,
    showScore: true,
    scoreTemplate: '{value} 分',
    texts: ['極差', '失望', '一般', '滿意', '驚喜'],
    colors: ['#99A9BF', '#F7BA2A', '#FF9900']
  }
}
```

### Slider 滑塊
```typescript
{
  label: '進度',
  prop: 'progress',
  render: 'slider',
  renderProps: {
    min: 0,
    max: 100,
    step: 5,
    showInput: true,
    showInputControls: true,
    showStops: true,
    showTooltip: true,
    range: false,
    marks: {
      0: '0%',
      25: '25%',
      50: '50%',
      75: '75%',
      100: '100%'
    }
  }
}
```

### Upload 上傳
```typescript
{
  label: '文件上傳',
  prop: 'files',
  render: 'upload',
  renderProps: {
    action: '/api/upload',
    multiple: true,
    drag: true,
    accept: '.jpg,.jpeg,.png,.gif',
    listType: 'picture-card',
    autoUpload: true,
    showFileList: true,
    limit: 5,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/')
      const isLt2M = file.size / 1024 / 1024 < 2
      
      if (!isImage) {
        ElMessage.error('只能上傳圖片文件!')
        return false
      }
      if (!isLt2M) {
        ElMessage.error('上傳文件大小不能超過 2MB!')
        return false
      }
      return true
    },
    onSuccess: (response, file) => {
      console.log('上傳成功:', response, file)
    },
    onError: (error) => {
      console.error('上傳失敗:', error)
    }
  },
  renderSlots: {
    trigger: () => h('el-button', { size: 'small', type: 'primary' }, '選擇文件'),
    tip: () => h('div', { class: 'el-upload__tip' }, '只能上傳jpg/png文件，且不超過2mb')
  }
}
```

## 自定義渲染

### 1. 函數渲染方式
```typescript
{
  label: '自定義內容',
  prop: 'custom',
  render: ({ item, model, formRef, disabled, readonly, size }) => {
    return h('div', { class: 'custom-field' }, [
      h('el-input', {
        modelValue: model[item.prop],
        'onUpdate:modelValue': (value) => model[item.prop] = value,
        disabled,
        readonly,
        size,
        placeholder: '自定義渲染的輸入框'
      }),
      h('el-button', {
        size: 'small',
        type: 'text',
        onClick: () => {
          ElMessage.info('自定義按鈕點擊')
        }
      }, '操作')
    ])
  }
}
```

### 2. 組件渲染方式
```typescript
import CustomComponent from './CustomComponent.vue'

{
  label: '自定義組件',
  prop: 'customComponent',
  render: CustomComponent,
  renderProps: {
    customProp: 'customValue',
    onCustomEvent: (data) => {
      console.log('自定義事件:', data)
    }
  }
}
```

### 3. JSX 渲染方式
```tsx
{
  label: 'JSX 渲染',
  prop: 'jsxField',
  render: ({ item, model }) => (
    <div class="jsx-field">
      <el-input
        v-model={model[item.prop]}
        placeholder="JSX 方式渲染"
        clearable
        v-slots={{
          append: () => <el-button icon="Search">搜索</el-button>
        }}
      />
    </div>
  )
}
```

## 組件事件處理

### 統一事件處理
```typescript
{
  label: '事件處理',
  prop: 'eventField',
  render: 'select',
  renderProps: {
    // Element Plus 原生事件
    onChange: (value) => {
      console.log('選擇改變:', value)
    },
    onFocus: () => {
      console.log('獲得焦點')
    },
    onBlur: () => {
      console.log('失去焦點')
    },
    onClear: () => {
      console.log('清空選擇')
    }
  }
}
```

## 相關鏈接

- [組件渲染系統](/front/component/ma-form#組件渲染系統)
- [支持的 Element Plus 組件](/front/component/ma-form#支持的-element-plus-組件)
- [插槽系統](/front/component/ma-form#插槽系統)