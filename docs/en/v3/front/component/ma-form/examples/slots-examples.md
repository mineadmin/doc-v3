# Slot System

Demonstrates the slot system of MaForm, including global slots, form item level slots, dynamic slot naming, and usage of nested component slots.

<DemoPreview dir="demos/ma-form/slots-examples" />

## Features

- **Multi-Level Slots**: Supports slots at three levels: global, form item, and component
- **Dynamic Slot Naming**: Dynamic slot naming mechanism based on prop
- **Configured Slots**: Define slot content through configuration
- **Template Slots**: Supports template-based slot usage
- **Scoped Slots**: Provides rich scoped data

## Global Slots

### 1. Default Slot
When using the default slot, the configuration method automatically becomes invalid, and the template method is fully adopted:

```vue
<ma-form v-model="formData" :options="formOptions">
  <el-form-item label="Username" prop="username">
    <el-input v-model="formData.username" placeholder="Please enter username" />
  </el-form-item>
  
  <el-form-item label="Password" prop="password">
    <el-input 
      v-model="formData.password" 
      type="password" 
      placeholder="Please enter password" 
    />
  </el-form-item>
</ma-form>
```

### 2. Footer Slot
Used for placing action buttons at the bottom of the form:

```vue
<ma-form 
  v-model="formData" 
  :options="formOptions" 
  :items="formItems"
>
  <template #footer="{ formRef, model, loading }">
    <div class="form-footer">
      <el-button @click="handleReset">Reset</el-button>
      <el-button 
        type="primary" 
        :loading="loading"
        @click="handleSubmit(formRef)"
      >
        Submit
      </el-button>
    </div>
  </template>
</ma-form>
```

### 3. Loading Slot
Custom loading state display:

```vue
<ma-form 
  v-model="formData" 
  :options="formOptions" 
  :items="formItems"
>
  <template #loading="{ loading }">
    <div v-if="loading" class="custom-loading">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>Processing...</span>
    </div>
  </template>
</ma-form>
```

## Dynamic Slot Naming

### 1. Form Item Content Slot
Format: `#item-{prop}`

```vue
<ma-form v-model="formData" :items="formItems">
  <!-- Custom rendering for field with prop 'username' -->
  <template #item-username="{ item, model, disabled, readonly, size }">
    <div class="custom-username-field">
      <el-input 
        v-model="model[item.prop]"
        :disabled="disabled"
        :readonly="readonly"
        :size="size"
        prefix-icon="User"
        placeholder="Please enter username"
      >
        <template #append>
          <el-button icon="Check" @click="checkUsername">Verify</el-button>
        </template>
      </el-input>
    </div>
  </template>
</ma-form>
```

### 2. Form Item Label Slot
Format: `#label-{prop}`

```vue
<ma-form v-model="formData" :items="formItems">
  <!-- Custom label for field with prop 'password' -->
  <template #label-password>
    <span class="custom-label">
      <el-icon color="#409EFF"><Lock /></el-icon>
      <span style="margin-left: 4px;">Login Password</span>
      <el-tooltip content="Password must be 8-16 characters, containing letters and numbers" placement="top">
        <el-icon style="margin-left: 4px;"><QuestionFilled /></el-icon>
      </el-tooltip>
    </span>
  </template>
</ma-form>
```

### 3. Form Item Error Slot
Format: `#error-{prop}`

```vue
<ma-form v-model="formData" :items="formItems">
  <!-- Custom error display for field with prop 'email' -->
  <template #error-email="{ error }">
    <div class="custom-error">
      <el-icon color="#F56C6C"><WarningFilled /></el-icon>
      <span>{{ error }}</span>
    </div>
  </template>
</ma-form>
```

## Form Item Level Slot Configuration

### 1. itemSlots Configuration
Define form item slots through configuration:

```typescript
{
  label: 'User Info',
  prop: 'userInfo',
  render: 'input',
  itemSlots: {
    // Custom label
    label: ({ label }) => {
      return h('div', { class: 'custom-label' }, [
        h('el-icon', { color: '#409EFF' }, [h('User')]),
        h('span', { style: 'margin-left: 4px;' }, label)
      ])
    },
    
    // Prepended content
    prepend: ({ item, model }) => {
      return h('div', { class: 'prepend-content' }, [
        h('el-text', { type: 'info', size: 'small' }, 'Hint Information')
      ])
    },
    
    // Appended content
    append: ({ item, model }) => {
      return h('div', { class: 'append-content' }, [
        h('el-button', {
          size: 'small',
          type: 'text',
          onClick: () => console.log('Action button clicked')
        }, 'Action')
      ])
    },
    
    // Help information
    help: ({ item, model }) => {
      return h('div', { class: 'help-text' }, [
        h('el-text', { type: 'info', size: 'small' }, 'This is help information')
      ])
    },
    
    // Error information
    error: ({ error }) => {
      return h('div', { class: 'custom-error' }, [
        h('el-icon', { color: '#F56C6C' }, [h('WarningFilled')]),
        h('span', { style: 'margin-left: 4px;' }, error)
      ])
    }
  }
}
```

### 2. Complex Slot Example

```typescript
{
  label: 'Avatar Upload',
  prop: 'avatar',
  render: 'upload',
  renderProps: {
    action: '/api/upload/avatar',
    showFileList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/')
      const isLt2M = file.size / 1024 / 1024 < 2
      return isImage && isLt2M
    }
  },
  itemSlots: {
    prepend: ({ item, model }) => {
      const avatarUrl = model[item.prop]
      return h('div', { class: 'avatar-preview' }, [
        avatarUrl 
          ? h('img', { src: avatarUrl, style: 'width: 60px; height: 60px; border-radius: 50%;' })
          : h('div', { 
              class: 'avatar-placeholder',
              style: 'width: 60px; height: 60px; border-radius: 50%; background: #f5f7fa; display: flex; align-items: center; justify-content: center;'
            }, [
              h('el-icon', { size: 24, color: '#cdd0d6' }, [h('Plus')])
            ])
      ])
    },
    
    help: ({ item, model }) => {
      return h('div', { class: 'upload-help' }, [
        h('el-text', { type: 'info', size: 'small' }, 'Supports jpg, png formats, file size not exceeding 2MB')
      ])
    }
  }
}
```

## Nested Component Slots

### 1. renderSlots Configuration
Configure slots for rendered components:

```typescript
{
  label: 'Selector',
  prop: 'selector',
  render: 'select',
  renderProps: {
    placeholder: 'Please select an option',
    clearable: true,
    filterable: true
  },
  renderSlots: {
    // Default slot - options list
    default: () => [
      h('el-option', { label: 'Option 1', value: '1' }),
      h('el-option', { label: 'Option 2', value: '2' }),
      h('el-option', { label: 'Option 3', value: '3' })
    ],
    
    // Prefix slot
    prefix: () => h('el-icon', [h('Search')]),
    
    // Empty state slot
    empty: () => h('div', { style: 'text-align: center; color: #999;' }, [
      h('el-icon', { size: 24 }, [h('DocumentDelete')]),
      h('div', 'No options')
    ])
  }
}
```

### 2. Upload Component Slots

```typescript
{
  label: 'File Upload',
  prop: 'files',
  render: 'upload',
  renderProps: {
    action: '/api/upload',
    multiple: true,
    drag: true,
    accept: '.pdf,.doc,.docx'
  },
  renderSlots: {
    // Upload trigger
    trigger: () => h('div', { class: 'upload-trigger' }, [
      h('el-icon', { size: 32, color: '#409EFF' }, [h('UploadFilled')]),
      h('div', { style: 'margin-top: 8px;' }, 'Click or drag files to upload')
    ]),
    
    // Tip information
    tip: () => h('div', { class: 'upload-tip' }, [
      h('el-text', { type: 'info', size: 'small' }, 'Supports PDF, Word formats, single file not exceeding 10MB')
    ]),
    
    // File list
    file: ({ file }) => h('div', { class: 'custom-file-item' }, [
      h('el-icon', [h('Document')]),
      h('span', { style: 'margin-left: 8px;' }, file.name),
      h('el-button', {
        size: 'small',
        type: 'danger',
        text: true,
        style: 'margin-left: auto;',
        onClick: () => {
          // Delete file logic
        }
      }, 'Delete')
    ])
  }
}
```

## Slot Scoped Data

### FormItemScope Interface
Scoped data for form item slots:

```typescript
interface FormItemScope {
  item: MaFormItem        // Current form item configuration
  model: Record<string, any>  // Form data model
  disabled: boolean       // Whether disabled
  readonly: boolean       // Whether read-only
  size: ComponentSize     // Component size
  formRef: Ref<FormInstance | undefined>  // Form instance reference
}
```

### Usage Example

```vue
<template #item-complex="{ item, model, disabled, readonly, size, formRef }">
  <div class="complex-field">
    <!-- Using scoped data -->
    <el-input 
      v-model="model[item.prop]"
      :disabled="disabled"
      :readonly="readonly" 
      :size="size"
      placeholder="Complex field"
    />
    
    <!-- Action button -->
    <el-button 
      :size="size"
      @click="handleFieldAction(item, model, formRef)"
    >
      Action
    </el-button>
  </div>
</template>
```

## Slot Priority

When multiple slot definition methods exist simultaneously, the priority is as follows:

1. **Template Slots** (Highest Priority)
2. **itemSlots Configuration Slots**
3. **renderSlots Configuration Slots**
4. **Default Rendering** (Lowest Priority)

### Example

```typescript
// Slots defined in configuration
{
  label: 'Test Field',
  prop: 'testField',
  render: 'input',
  itemSlots: {
    label: () => h('span', 'Config Slot Label')
  }
}
```

```vue
<!-- Template slots override configuration slots -->
<ma-form v-model="formData" :items="items">
  <template #label-testField>
    <span>Template Slot Label</span>  <!-- This will take effect -->
  </template>
</ma-form>
```

## Best Practices

### 1. Slot Performance Optimization

```typescript
// ✅ Recommended: Cache using arrow functions
const labelSlot = () => h('span', 'Label')

// ❌ Avoid: Creating new functions on every render
itemSlots: {
  label: () => h('span', 'Label')  // New function every time
}
```

### 2. Conditional Slots

```typescript
{
  label: 'Conditional Slot',
  prop: 'conditionalSlot',
  render: 'input',
  itemSlots: {
    append: ({ item, model }) => {
      // Display different content based on conditions
      return model.showButton 
        ? h('el-button', { size: 'small' }, 'Action')
        : null
    }
  }
}
```

### 3. Responsive Slots

```typescript
{
  label: 'Responsive Slot',
  prop: 'responsiveSlot',
  render: 'input',
  itemSlots: {
    help: ({ item, model }) => {
      const isMobile = window.innerWidth < 768
      return h('div', { 
        class: isMobile ? 'mobile-help' : 'desktop-help' 
      }, 'Responsive help information')
    }
  }
}
```

## Related Links

- [Slot System Details](/v3/front/component/ma-form#slot-system)
- [MaFormItem itemSlots Configuration](/v3/front/component/ma-form#layout-configuration)
- [Component Rendering renderSlots](/v3/front/component/ma-form/examples/component-rendering)