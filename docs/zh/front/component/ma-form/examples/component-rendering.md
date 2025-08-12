# 组件渲染

展示 MaForm 支持的所有 Element Plus 组件渲染方式，包括输入类、选择类、日期类和特殊组件。

<DemoPreview dir="demos/ma-form/component-rendering" />

## 功能特性

- **全面支持**：支持所有 Element Plus 表单组件
- **多种渲染方式**：字符串、组件、函数三种渲染方式
- **插槽支持**：完整的插槽系统支持
- **属性传递**：通过 renderProps 传递组件属性
- **事件处理**：支持组件的所有原生事件

## 输入类组件

### Input 输入框
```typescript
{
  label: '用户名',
  prop: 'username',
  render: 'input',
  renderProps: {
    placeholder: '请输入用户名',
    clearable: true,
    prefixIcon: 'User',
    maxlength: 20,
    showWordLimit: true
  }
}
```

### InputNumber 数字输入框
```typescript
{
  label: '数量',
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
    placeholder: '请输入描述信息',
    maxlength: 500,
    showWordLimit: true,
    autosize: { minRows: 2, maxRows: 6 },
    resize: 'vertical'
  }
}
```

## 选择类组件

### Select 选择器
```typescript
{
  label: '城市',
  prop: 'city',
  render: 'select',
  renderProps: {
    placeholder: '请选择城市',
    clearable: true,
    filterable: true,
    multiple: false,
    multipleLimit: 3
  },
  renderSlots: {
    default: () => [
      h('el-option', { label: '北京', value: 'beijing' }),
      h('el-option', { label: '上海', value: 'shanghai' }),
      h('el-option', { label: '广州', value: 'guangzhou' }),
      h('el-option', { label: '深圳', value: 'shenzhen' })
    ]
  }
}
```

### Cascader 级联选择器
```typescript
{
  label: '地区',
  prop: 'region',
  render: 'cascader',
  renderProps: {
    options: [
      {
        value: 'guangdong',
        label: '广东省',
        children: [
          { value: 'guangzhou', label: '广州市' },
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

### RadioGroup 单选框组
```typescript
{
  label: '性别',
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

### CheckboxGroup 复选框组
```typescript
{
  label: '兴趣爱好',
  prop: 'hobbies',
  render: 'checkboxGroup',
  renderProps: {
    min: 1,
    max: 3
  },
  renderSlots: {
    default: () => [
      h('el-checkbox', { label: 'reading' }, '阅读'),
      h('el-checkbox', { label: 'music' }, '音乐'),
      h('el-checkbox', { label: 'sports' }, '运动'),
      h('el-checkbox', { label: 'travel' }, '旅游')
    ]
  }
}
```

## 日期时间类组件

### DatePicker 日期选择器
```typescript
{
  label: '出生日期',
  prop: 'birthDate',
  render: 'datePicker',
  renderProps: {
    type: 'date',
    placeholder: '选择日期',
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

### TimePicker 时间选择器
```typescript
{
  label: '时间',
  prop: 'time',
  render: 'timePicker',
  renderProps: {
    placeholder: '选择时间',
    format: 'HH:mm:ss',
    valueFormat: 'HH:mm:ss',
    clearable: true,
    selectableRange: ['09:00:00 - 18:00:00']
  }
}
```

### DateTimePicker 日期时间选择器
```typescript
{
  label: '预约时间',
  prop: 'appointmentTime',
  render: 'dateTimePicker',
  renderProps: {
    type: 'datetime',
    placeholder: '选择日期时间',
    format: 'YYYY-MM-DD HH:mm:ss',
    valueFormat: 'YYYY-MM-DD HH:mm:ss',
    timePickerOptions: {
      selectableRange: '09:00:00 - 18:00:00'
    }
  }
}
```

## 特殊组件

### Switch 开关
```typescript
{
  label: '启用状态',
  prop: 'enabled',
  render: 'switch',
  renderProps: {
    activeText: '启用',
    inactiveText: '禁用', 
    activeValue: true,
    inactiveValue: false,
    activeColor: '#13ce66',
    inactiveColor: '#ff4949',
    beforeChange: () => {
      return new Promise((resolve) => {
        ElMessageBox.confirm('确定要切换状态吗？')
          .then(() => resolve(true))
          .catch(() => resolve(false))
      })
    }
  }
}
```

### Rate 评分
```typescript
{
  label: '评分',
  prop: 'rating',
  render: 'rate',
  renderProps: {
    max: 5,
    allowHalf: true,
    showText: true,
    showScore: true,
    scoreTemplate: '{value} 分',
    texts: ['极差', '失望', '一般', '满意', '惊喜'],
    colors: ['#99A9BF', '#F7BA2A', '#FF9900']
  }
}
```

### Slider 滑块
```typescript
{
  label: '进度',
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

### Upload 上传
```typescript
{
  label: '文件上传',
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
        ElMessage.error('只能上传图片文件!')
        return false
      }
      if (!isLt2M) {
        ElMessage.error('上传文件大小不能超过 2MB!')
        return false
      }
      return true
    },
    onSuccess: (response, file) => {
      console.log('上传成功:', response, file)
    },
    onError: (error) => {
      console.error('上传失败:', error)
    }
  },
  renderSlots: {
    trigger: () => h('el-button', { size: 'small', type: 'primary' }, '选择文件'),
    tip: () => h('div', { class: 'el-upload__tip' }, '只能上传jpg/png文件，且不超过2mb')
  }
}
```

## 自定义渲染

### 1. 函数渲染方式
```typescript
{
  label: '自定义内容',
  prop: 'custom',
  render: ({ item, model, formRef, disabled, readonly, size }) => {
    return h('div', { class: 'custom-field' }, [
      h('el-input', {
        modelValue: model[item.prop],
        'onUpdate:modelValue': (value) => model[item.prop] = value,
        disabled,
        readonly,
        size,
        placeholder: '自定义渲染的输入框'
      }),
      h('el-button', {
        size: 'small',
        type: 'text',
        onClick: () => {
          ElMessage.info('自定义按钮点击')
        }
      }, '操作')
    ])
  }
}
```

### 2. 组件渲染方式
```typescript
import CustomComponent from './CustomComponent.vue'

{
  label: '自定义组件',
  prop: 'customComponent',
  render: CustomComponent,
  renderProps: {
    customProp: 'customValue',
    onCustomEvent: (data) => {
      console.log('自定义事件:', data)
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

## 组件事件处理

### 统一事件处理
```typescript
{
  label: '事件处理',
  prop: 'eventField',
  render: 'select',
  renderProps: {
    // Element Plus 原生事件
    onChange: (value) => {
      console.log('选择改变:', value)
    },
    onFocus: () => {
      console.log('获得焦点')
    },
    onBlur: () => {
      console.log('失去焦点')
    },
    onClear: () => {
      console.log('清空选择')
    }
  }
}
```

## 相关链接

- [组件渲染系统](/zh/front/component/ma-form#组件渲染系统)
- [支持的 Element Plus 组件](/zh/front/component/ma-form#支持的-element-plus-组件)
- [插槽系统](/zh/front/component/ma-form#插槽系统)