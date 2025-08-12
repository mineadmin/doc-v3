# Component Rendering

Demonstrates all Element Plus component rendering methods supported by MaForm, including input, selection, date, and special components.

<DemoPreview dir="demos/ma-form/component-rendering" />

## Features

- **Comprehensive Support**: Supports all Element Plus form components
- **Multiple Rendering Methods**: String, component, and function-based rendering
- **Slot Support**: Complete slot system support
- **Property Passing**: Pass component properties via renderProps
- **Event Handling**: Supports all native component events

## Input Components

### Input Field
```typescript
{
  label: 'Username',
  prop: 'username',
  render: 'input',
  renderProps: {
    placeholder: 'Please enter username',
    clearable: true,
    prefixIcon: 'User',
    maxlength: 20,
    showWordLimit: true
  }
}
```

### Number Input
```typescript
{
  label: 'Quantity',
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

### Textarea
```typescript
{
  label: 'Description',
  prop: 'description',
  render: 'textarea',
  renderProps: {
    rows: 4,
    placeholder: 'Please enter description',
    maxlength: 500,
    showWordLimit: true,
    autosize: { minRows: 2, maxRows: 6 },
    resize: 'vertical'
  }
}
```

## Selection Components

### Select
```typescript
{
  label: 'City',
  prop: 'city',
  render: 'select',
  renderProps: {
    placeholder: 'Please select city',
    clearable: true,
    filterable: true,
    multiple: false,
    multipleLimit: 3
  },
  renderSlots: {
    default: () => [
      h('el-option', { label: 'Beijing', value: 'beijing' }),
      h('el-option', { label: 'Shanghai', value: 'shanghai' }),
      h('el-option', { label: 'Guangzhou', value: 'guangzhou' }),
      h('el-option', { label: 'Shenzhen', value: 'shenzhen' })
    ]
  }
}
```

### Cascader
```typescript
{
  label: 'Region',
  prop: 'region',
  render: 'cascader',
  renderProps: {
    options: [
      {
        value: 'guangdong',
        label: 'Guangdong Province',
        children: [
          { value: 'guangzhou', label: 'Guangzhou' },
          { value: 'shenzhen', label: 'Shenzhen' }
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

### Radio Group
```typescript
{
  label: 'Gender',
  prop: 'gender',
  render: 'radioGroup',
  renderProps: {
    size: 'default',
    textColor: '#409EFF',
    fill: '#a0cfff'
  },
  renderSlots: {
    default: () => [
      h('el-radio', { label: 'male' }, 'Male'),
      h('el-radio', { label: 'female' }, 'Female'),
      h('el-radio', { label: 'other' }, 'Other')
    ]
  }
}
```

### Checkbox Group
```typescript
{
  label: 'Hobbies',
  prop: 'hobbies',
  render: 'checkboxGroup',
  renderProps: {
    min: 1,
    max: 3
  },
  renderSlots: {
    default: () => [
      h('el-checkbox', { label: 'reading' }, 'Reading'),
      h('el-checkbox', { label: 'music' }, 'Music'),
      h('el-checkbox', { label: 'sports' }, 'Sports'),
      h('el-checkbox', { label: 'travel' }, 'Travel')
    ]
  }
}
```

## Date & Time Components

### Date Picker
```typescript
{
  label: 'Birth Date',
  prop: 'birthDate',
  render: 'datePicker',
  renderProps: {
    type: 'date',
    placeholder: 'Select date',
    format: 'YYYY-MM-DD',
    valueFormat: 'YYYY-MM-DD',
    disabledDate: (time) => {
      return time.getTime() > Date.now()
    },
    shortcuts: [
      {
        text: 'Today',
        value: new Date()
      },
      {
        text: 'Yesterday',
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

### Time Picker
```typescript
{
  label: 'Time',
  prop: 'time',
  render: 'timePicker',
  renderProps: {
    placeholder: 'Select time',
    format: 'HH:mm:ss',
    valueFormat: 'HH:mm:ss',
    clearable: true,
    selectableRange: ['09:00:00 - 18:00:00']
  }
}
```

### DateTime Picker
```typescript
{
  label: 'Appointment Time',
  prop: 'appointmentTime',
  render: 'dateTimePicker',
  renderProps: {
    type: 'datetime',
    placeholder: 'Select date and time',
    format: 'YYYY-MM-DD HH:mm:ss',
    valueFormat: 'YYYY-MM-DD HH:mm:ss',
    timePickerOptions: {
      selectableRange: '09:00:00 - 18:00:00'
    }
  }
}
```

## Special Components

### Switch
```typescript
{
  label: 'Enabled',
  prop: 'enabled',
  render: 'switch',
  renderProps: {
    activeText: 'Enabled',
    inactiveText: 'Disabled', 
    activeValue: true,
    inactiveValue: false,
    activeColor: '#13ce66',
    inactiveColor: '#ff4949',
    beforeChange: () => {
      return new Promise((resolve) => {
        ElMessageBox.confirm('Confirm to change status?')
          .then(() => resolve(true))
          .catch(() => resolve(false))
      })
    }
  }
}
```

### Rate
```typescript
{
  label: 'Rating',
  prop: 'rating',
  render: 'rate',
  renderProps: {
    max: 5,
    allowHalf: true,
    showText: true,
    showScore: true,
    scoreTemplate: '{value} points',
    texts: ['Terrible', 'Disappointed', 'Normal', 'Satisfied', 'Surprised'],
    colors: ['#99A9BF', '#F7BA2A', '#FF9900']
  }
}
```

### Slider
```typescript
{
  label: 'Progress',
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

### Upload
```typescript
{
  label: 'File Upload',
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
        ElMessage.error('Only image files allowed!')
        return false
      }
      if (!isLt2M) {
        ElMessage.error('File size cannot exceed 2MB!')
        return false
      }
      return true
    },
    onSuccess: (response, file) => {
      console.log('Upload success:', response, file)
    },
    onError: (error) => {
      console.error('Upload failed:', error)
    }
  },
  renderSlots: {
    trigger: () => h('el-button', { size: 'small', type: 'primary' }, 'Select File'),
    tip: () => h('div', { class: 'el-upload__tip' }, 'Only jpg/png files under 2mb')
  }
}
```

## Custom Rendering

### 1. Function Rendering
```typescript
{
  label: 'Custom Content',
  prop: 'custom',
  render: ({ item, model, formRef, disabled, readonly, size }) => {
    return h('div', { class: 'custom-field' }, [
      h('el-input', {
        modelValue: model[item.prop],
        'onUpdate:modelValue': (value) => model[item.prop] = value,
        disabled,
        readonly,
        size,
        placeholder: 'Custom rendered input'
      }),
      h('el-button', {
        size: 'small',
        type: 'text',
        onClick: () => {
          ElMessage.info('Custom button clicked')
        }
      }, 'Action')
    ])
  }
}
```

### 2. Component Rendering
```typescript
import CustomComponent from './CustomComponent.vue'

{
  label: 'Custom Component',
  prop: 'customComponent',
  render: CustomComponent,
  renderProps: {
    customProp: 'customValue',
    onCustomEvent: (data) => {
      console.log('Custom event:', data)
    }
  }
}
```

### 3. JSX Rendering
```tsx
{
  label: 'JSX Rendering',
  prop: 'jsxField',
  render: ({ item, model }) => (
    <div class="jsx-field">
      <el-input
        v-model={model[item.prop]}
        placeholder="JSX rendering"
        clearable
        v-slots={{
          append: () => <el-button icon="Search">Search</el-button>
        }}
      />
    </div>
  )
}
```

## Component Event Handling

### Unified Event Handling
```typescript
{
  label: 'Event Handling',
  prop: 'eventField',
  render: 'select',
  renderProps: {
    // Element Plus native events
    onChange: (value) => {
      console.log('Selection changed:', value)
    },
    onFocus: () => {
      console.log('Focused')
    },
    onBlur: () => {
      console.log('Blurred')
    },
    onClear: () => {
      console.log('Cleared')
    }
  }
}
```

## Related Links

- [Component Rendering System](/en/front/component/ma-form#component-rendering-system)
- [Supported Element Plus Components](/en/front/component/ma-form#supported-element-plus-components)
- [Slot System](/en/front/component/ma-form#slot-system)