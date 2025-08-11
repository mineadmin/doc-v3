# 插槽系统

展示 MaForm 的插槽系统，包括全局插槽、表单项级别插槽、动态插槽命名和嵌套组件插槽的使用方式。

<DemoPreview dir="demos/ma-form/slots-examples" />

## 功能特性

- **多层级插槽**：支持全局、表单项、组件三个层级的插槽
- **动态插槽命名**：基于 prop 的动态插槽命名机制
- **配置化插槽**：通过配置方式定义插槽内容
- **模板插槽**：支持模板方式的插槽使用
- **作用域插槽**：提供丰富的作用域数据

## 全局插槽

### 1. 默认插槽
使用默认插槽时，配置方式会自动失效，完全使用模板方式：

```vue
<ma-form v-model="formData" :options="formOptions">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="formData.username" placeholder="请输入用户名" />
  </el-form-item>
  
  <el-form-item label="密码" prop="password">
    <el-input 
      v-model="formData.password" 
      type="password" 
      placeholder="请输入密码" 
    />
  </el-form-item>
</ma-form>
```

### 2. Footer 插槽
用于放置表单底部的操作按钮：

```vue
<ma-form 
  v-model="formData" 
  :options="formOptions" 
  :items="formItems"
>
  <template #footer="{ formRef, model, loading }">
    <div class="form-footer">
      <el-button @click="handleReset">重置</el-button>
      <el-button 
        type="primary" 
        :loading="loading"
        @click="handleSubmit(formRef)"
      >
        提交
      </el-button>
    </div>
  </template>
</ma-form>
```

### 3. Loading 插槽
自定义加载状态显示：

```vue
<ma-form 
  v-model="formData" 
  :options="formOptions" 
  :items="formItems"
>
  <template #loading="{ loading }">
    <div v-if="loading" class="custom-loading">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>正在处理中...</span>
    </div>
  </template>
</ma-form>
```

## 动态插槽命名

### 1. 表单项内容插槽
格式：`#item-{prop}`

```vue
<ma-form v-model="formData" :items="formItems">
  <!-- 为 prop 为 'username' 的字段自定义渲染 -->
  <template #item-username="{ item, model, disabled, readonly, size }">
    <div class="custom-username-field">
      <el-input 
        v-model="model[item.prop]"
        :disabled="disabled"
        :readonly="readonly"
        :size="size"
        prefix-icon="User"
        placeholder="请输入用户名"
      >
        <template #append>
          <el-button icon="Check" @click="checkUsername">验证</el-button>
        </template>
      </el-input>
    </div>
  </template>
</ma-form>
```

### 2. 表单项标签插槽
格式：`#label-{prop}`

```vue
<ma-form v-model="formData" :items="formItems">
  <!-- 为 prop 为 'password' 的字段自定义标签 -->
  <template #label-password>
    <span class="custom-label">
      <el-icon color="#409EFF"><Lock /></el-icon>
      <span style="margin-left: 4px;">登录密码</span>
      <el-tooltip content="密码长度8-16位，包含字母和数字" placement="top">
        <el-icon style="margin-left: 4px;"><QuestionFilled /></el-icon>
      </el-tooltip>
    </span>
  </template>
</ma-form>
```

### 3. 表单项错误插槽
格式：`#error-{prop}`

```vue
<ma-form v-model="formData" :items="formItems">
  <!-- 为 prop 为 'email' 的字段自定义错误显示 -->
  <template #error-email="{ error }">
    <div class="custom-error">
      <el-icon color="#F56C6C"><WarningFilled /></el-icon>
      <span>{{ error }}</span>
    </div>
  </template>
</ma-form>
```

## 表单项级别插槽配置

### 1. itemSlots 配置
通过配置方式定义表单项插槽：

```typescript
{
  label: '用户信息',
  prop: 'userInfo',
  render: 'input',
  itemSlots: {
    // 自定义标签
    label: ({ label }) => {
      return h('div', { class: 'custom-label' }, [
        h('el-icon', { color: '#409EFF' }, [h('User')]),
        h('span', { style: 'margin-left: 4px;' }, label)
      ])
    },
    
    // 前置内容
    prepend: ({ item, model }) => {
      return h('div', { class: 'prepend-content' }, [
        h('el-text', { type: 'info', size: 'small' }, '提示信息')
      ])
    },
    
    // 后置内容
    append: ({ item, model }) => {
      return h('div', { class: 'append-content' }, [
        h('el-button', {
          size: 'small',
          type: 'text',
          onClick: () => console.log('操作按钮点击')
        }, '操作')
      ])
    },
    
    // 帮助信息
    help: ({ item, model }) => {
      return h('div', { class: 'help-text' }, [
        h('el-text', { type: 'info', size: 'small' }, '这是帮助信息')
      ])
    },
    
    // 错误信息
    error: ({ error }) => {
      return h('div', { class: 'custom-error' }, [
        h('el-icon', { color: '#F56C6C' }, [h('WarningFilled')]),
        h('span', { style: 'margin-left: 4px;' }, error)
      ])
    }
  }
}
```

### 2. 复杂插槽示例

```typescript
{
  label: '头像上传',
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
        h('el-text', { type: 'info', size: 'small' }, '支持 jpg、png 格式，文件大小不超过 2MB')
      ])
    }
  }
}
```

## 嵌套组件插槽

### 1. renderSlots 配置
为渲染的组件配置插槽：

```typescript
{
  label: '选择器',
  prop: 'selector',
  render: 'select',
  renderProps: {
    placeholder: '请选择选项',
    clearable: true,
    filterable: true
  },
  renderSlots: {
    // 默认插槽 - 选项列表
    default: () => [
      h('el-option', { label: '选项1', value: '1' }),
      h('el-option', { label: '选项2', value: '2' }),
      h('el-option', { label: '选项3', value: '3' })
    ],
    
    // 前缀插槽
    prefix: () => h('el-icon', [h('Search')]),
    
    // 空状态插槽
    empty: () => h('div', { style: 'text-align: center; color: #999;' }, [
      h('el-icon', { size: 24 }, [h('DocumentDelete')]),
      h('div', '暂无选项')
    ])
  }
}
```

### 2. Upload 组件插槽

```typescript
{
  label: '文件上传',
  prop: 'files',
  render: 'upload',
  renderProps: {
    action: '/api/upload',
    multiple: true,
    drag: true,
    accept: '.pdf,.doc,.docx'
  },
  renderSlots: {
    // 上传触发器
    trigger: () => h('div', { class: 'upload-trigger' }, [
      h('el-icon', { size: 32, color: '#409EFF' }, [h('UploadFilled')]),
      h('div', { style: 'margin-top: 8px;' }, '点击或拖拽上传文件')
    ]),
    
    // 提示信息
    tip: () => h('div', { class: 'upload-tip' }, [
      h('el-text', { type: 'info', size: 'small' }, '支持 PDF、Word 格式，单个文件不超过 10MB')
    ]),
    
    // 文件列表
    file: ({ file }) => h('div', { class: 'custom-file-item' }, [
      h('el-icon', [h('Document')]),
      h('span', { style: 'margin-left: 8px;' }, file.name),
      h('el-button', {
        size: 'small',
        type: 'danger',
        text: true,
        style: 'margin-left: auto;',
        onClick: () => {
          // 删除文件逻辑
        }
      }, '删除')
    ])
  }
}
```

## 插槽作用域数据

### FormItemScope 接口
表单项插槽的作用域数据：

```typescript
interface FormItemScope {
  item: MaFormItem        // 当前表单项配置
  model: Record<string, any>  // 表单数据模型
  disabled: boolean       // 是否禁用
  readonly: boolean       // 是否只读
  size: ComponentSize     // 组件尺寸
  formRef: Ref<FormInstance | undefined>  // 表单实例引用
}
```

### 使用示例

```vue
<template #item-complex="{ item, model, disabled, readonly, size, formRef }">
  <div class="complex-field">
    <!-- 使用作用域数据 -->
    <el-input 
      v-model="model[item.prop]"
      :disabled="disabled"
      :readonly="readonly" 
      :size="size"
      placeholder="复杂字段"
    />
    
    <!-- 操作按钮 -->
    <el-button 
      :size="size"
      @click="handleFieldAction(item, model, formRef)"
    >
      操作
    </el-button>
  </div>
</template>
```

## 插槽优先级

当同时存在多种插槽定义方式时，优先级如下：

1. **模板插槽**（最高优先级）
2. **itemSlots 配置插槽**
3. **renderSlots 配置插槽**
4. **默认渲染**（最低优先级）

### 示例

```typescript
// 配置中定义的插槽
{
  label: '测试字段',
  prop: 'testField',
  render: 'input',
  itemSlots: {
    label: () => h('span', '配置插槽标签')
  }
}
```

```vue
<!-- 模板插槽会覆盖配置插槽 -->
<ma-form v-model="formData" :items="items">
  <template #label-testField>
    <span>模板插槽标签</span>  <!-- 这个会生效 -->
  </template>
</ma-form>
```

## 最佳实践

### 1. 插槽性能优化

```typescript
// ✅ 推荐：使用箭头函数缓存
const labelSlot = () => h('span', '标签')

// ❌ 避免：每次渲染都创建新函数
itemSlots: {
  label: () => h('span', '标签')  // 每次都是新函数
}
```

### 2. 条件插槽

```typescript
{
  label: '条件插槽',
  prop: 'conditionalSlot',
  render: 'input',
  itemSlots: {
    append: ({ item, model }) => {
      // 根据条件显示不同内容
      return model.showButton 
        ? h('el-button', { size: 'small' }, '操作')
        : null
    }
  }
}
```

### 3. 响应式插槽

```typescript
{
  label: '响应式插槽',
  prop: 'responsiveSlot',
  render: 'input',
  itemSlots: {
    help: ({ item, model }) => {
      const isMobile = window.innerWidth < 768
      return h('div', { 
        class: isMobile ? 'mobile-help' : 'desktop-help' 
      }, '响应式帮助信息')
    }
  }
}
```

## 相关链接

- [插槽系统详解](/zh/front/component/ma-form#插槽系统)
- [MaFormItem itemSlots 配置](/zh/front/component/ma-form#布局配置)
- [组件渲染 renderSlots](/zh/front/component/ma-form/examples/component-rendering)