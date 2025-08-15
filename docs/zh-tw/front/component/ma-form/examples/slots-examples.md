# 插槽系統

展示 MaForm 的插槽系統，包括全域性插槽、表單項級別插槽、動態插槽命名和巢狀元件插槽的使用方式。

<DemoPreview dir="demos/ma-form/slots-examples" />

## 功能特性

- **多層級插槽**：支援全域性、表單項、元件三個層級的插槽
- **動態插槽命名**：基於 prop 的動態插槽命名機制
- **配置化插槽**：透過配置方式定義插槽內容
- **模板插槽**：支援模板方式的插槽使用
- **作用域插槽**：提供豐富的作用域資料

## 全域性插槽

### 1. 預設插槽
使用預設插槽時，配置方式會自動失效，完全使用模板方式：

```vue
<ma-form v-model="formData" :options="formOptions">
  <el-form-item label="使用者名稱" prop="username">
    <el-input v-model="formData.username" placeholder="請輸入使用者名稱" />
  </el-form-item>
  
  <el-form-item label="密碼" prop="password">
    <el-input 
      v-model="formData.password" 
      type="password" 
      placeholder="請輸入密碼" 
    />
  </el-form-item>
</ma-form>
```

### 2. Footer 插槽
用於放置表單底部的操作按鈕：

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
自定義載入狀態顯示：

```vue
<ma-form 
  v-model="formData" 
  :options="formOptions" 
  :items="formItems"
>
  <template #loading="{ loading }">
    <div v-if="loading" class="custom-loading">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>正在處理中...</span>
    </div>
  </template>
</ma-form>
```

## 動態插槽命名

### 1. 表單項內容插槽
格式：`#item-{prop}`

```vue
<ma-form v-model="formData" :items="formItems">
  <!-- 為 prop 為 'username' 的欄位自定義渲染 -->
  <template #item-username="{ item, model, disabled, readonly, size }">
    <div class="custom-username-field">
      <el-input 
        v-model="model[item.prop]"
        :disabled="disabled"
        :readonly="readonly"
        :size="size"
        prefix-icon="User"
        placeholder="請輸入使用者名稱"
      >
        <template #append>
          <el-button icon="Check" @click="checkUsername">驗證</el-button>
        </template>
      </el-input>
    </div>
  </template>
</ma-form>
```

### 2. 表單項標籤插槽
格式：`#label-{prop}`

```vue
<ma-form v-model="formData" :items="formItems">
  <!-- 為 prop 為 'password' 的欄位自定義標籤 -->
  <template #label-password>
    <span class="custom-label">
      <el-icon color="#409EFF"><Lock /></el-icon>
      <span style="margin-left: 4px;">登入密碼</span>
      <el-tooltip content="密碼長度8-16位，包含字母和數字" placement="top">
        <el-icon style="margin-left: 4px;"><QuestionFilled /></el-icon>
      </el-tooltip>
    </span>
  </template>
</ma-form>
```

### 3. 表單項錯誤插槽
格式：`#error-{prop}`

```vue
<ma-form v-model="formData" :items="formItems">
  <!-- 為 prop 為 'email' 的欄位自定義錯誤顯示 -->
  <template #error-email="{ error }">
    <div class="custom-error">
      <el-icon color="#F56C6C"><WarningFilled /></el-icon>
      <span>{{ error }}</span>
    </div>
  </template>
</ma-form>
```

## 表單項級別插槽配置

### 1. itemSlots 配置
透過配置方式定義表單項插槽：

```typescript
{
  label: '使用者資訊',
  prop: 'userInfo',
  render: 'input',
  itemSlots: {
    // 自定義標籤
    label: ({ label }) => {
      return h('div', { class: 'custom-label' }, [
        h('el-icon', { color: '#409EFF' }, [h('User')]),
        h('span', { style: 'margin-left: 4px;' }, label)
      ])
    },
    
    // 前置內容
    prepend: ({ item, model }) => {
      return h('div', { class: 'prepend-content' }, [
        h('el-text', { type: 'info', size: 'small' }, '提示資訊')
      ])
    },
    
    // 後置內容
    append: ({ item, model }) => {
      return h('div', { class: 'append-content' }, [
        h('el-button', {
          size: 'small',
          type: 'text',
          onClick: () => console.log('操作按鈕點選')
        }, '操作')
      ])
    },
    
    // 幫助資訊
    help: ({ item, model }) => {
      return h('div', { class: 'help-text' }, [
        h('el-text', { type: 'info', size: 'small' }, '這是幫助資訊')
      ])
    },
    
    // 錯誤資訊
    error: ({ error }) => {
      return h('div', { class: 'custom-error' }, [
        h('el-icon', { color: '#F56C6C' }, [h('WarningFilled')]),
        h('span', { style: 'margin-left: 4px;' }, error)
      ])
    }
  }
}
```

### 2. 複雜插槽示例

```typescript
{
  label: '頭像上傳',
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
        h('el-text', { type: 'info', size: 'small' }, '支援 jpg、png 格式，檔案大小不超過 2MB')
      ])
    }
  }
}
```

## 巢狀元件插槽

### 1. renderSlots 配置
為渲染的元件配置插槽：

```typescript
{
  label: '選擇器',
  prop: 'selector',
  render: 'select',
  renderProps: {
    placeholder: '請選擇選項',
    clearable: true,
    filterable: true
  },
  renderSlots: {
    // 預設插槽 - 選項列表
    default: () => [
      h('el-option', { label: '選項1', value: '1' }),
      h('el-option', { label: '選項2', value: '2' }),
      h('el-option', { label: '選項3', value: '3' })
    ],
    
    // 字首插槽
    prefix: () => h('el-icon', [h('Search')]),
    
    // 空狀態插槽
    empty: () => h('div', { style: 'text-align: center; color: #999;' }, [
      h('el-icon', { size: 24 }, [h('DocumentDelete')]),
      h('div', '暫無選項')
    ])
  }
}
```

### 2. Upload 元件插槽

```typescript
{
  label: '檔案上傳',
  prop: 'files',
  render: 'upload',
  renderProps: {
    action: '/api/upload',
    multiple: true,
    drag: true,
    accept: '.pdf,.doc,.docx'
  },
  renderSlots: {
    // 上傳觸發器
    trigger: () => h('div', { class: 'upload-trigger' }, [
      h('el-icon', { size: 32, color: '#409EFF' }, [h('UploadFilled')]),
      h('div', { style: 'margin-top: 8px;' }, '點選或拖拽上傳檔案')
    ]),
    
    // 提示資訊
    tip: () => h('div', { class: 'upload-tip' }, [
      h('el-text', { type: 'info', size: 'small' }, '支援 PDF、Word 格式，單個檔案不超過 10MB')
    ]),
    
    // 檔案列表
    file: ({ file }) => h('div', { class: 'custom-file-item' }, [
      h('el-icon', [h('Document')]),
      h('span', { style: 'margin-left: 8px;' }, file.name),
      h('el-button', {
        size: 'small',
        type: 'danger',
        text: true,
        style: 'margin-left: auto;',
        onClick: () => {
          // 刪除檔案邏輯
        }
      }, '刪除')
    ])
  }
}
```

## 插槽作用域資料

### FormItemScope 介面
表單項插槽的作用域資料：

```typescript
interface FormItemScope {
  item: MaFormItem        // 當前表單項配置
  model: Record<string, any>  // 表單資料模型
  disabled: boolean       // 是否停用
  readonly: boolean       // 是否只讀
  size: ComponentSize     // 元件尺寸
  formRef: Ref<FormInstance | undefined>  // 表單例項引用
}
```

### 使用示例

```vue
<template #item-complex="{ item, model, disabled, readonly, size, formRef }">
  <div class="complex-field">
    <!-- 使用作用域資料 -->
    <el-input 
      v-model="model[item.prop]"
      :disabled="disabled"
      :readonly="readonly" 
      :size="size"
      placeholder="複雜欄位"
    />
    
    <!-- 操作按鈕 -->
    <el-button 
      :size="size"
      @click="handleFieldAction(item, model, formRef)"
    >
      操作
    </el-button>
  </div>
</template>
```

## 插槽優先順序

當同時存在多種插槽定義方式時，優先順序如下：

1. **模板插槽**（最高優先順序）
2. **itemSlots 配置插槽**
3. **renderSlots 配置插槽**
4. **預設渲染**（最低優先順序）

### 示例

```typescript
// 配置中定義的插槽
{
  label: '測試欄位',
  prop: 'testField',
  render: 'input',
  itemSlots: {
    label: () => h('span', '配置插槽標籤')
  }
}
```

```vue
<!-- 模板插槽會覆蓋配置插槽 -->
<ma-form v-model="formData" :items="items">
  <template #label-testField>
    <span>模板插槽標籤</span>  <!-- 這個會生效 -->
  </template>
</ma-form>
```

## 最佳實踐

### 1. 插槽效能最佳化

```typescript
// ✅ 推薦：使用箭頭函式快取
const labelSlot = () => h('span', '標籤')

// ❌ 避免：每次渲染都建立新函式
itemSlots: {
  label: () => h('span', '標籤')  // 每次都是新函式
}
```

### 2. 條件插槽

```typescript
{
  label: '條件插槽',
  prop: 'conditionalSlot',
  render: 'input',
  itemSlots: {
    append: ({ item, model }) => {
      // 根據條件顯示不同內容
      return model.showButton 
        ? h('el-button', { size: 'small' }, '操作')
        : null
    }
  }
}
```

### 3. 響應式插槽

```typescript
{
  label: '響應式插槽',
  prop: 'responsiveSlot',
  render: 'input',
  itemSlots: {
    help: ({ item, model }) => {
      const isMobile = window.innerWidth < 768
      return h('div', { 
        class: isMobile ? 'mobile-help' : 'desktop-help' 
      }, '響應式幫助資訊')
    }
  }
}
```

## 相關連結

- [插槽系統詳解](/front/component/ma-form#插槽系統)
- [MaFormItem itemSlots 配置](/front/component/ma-form#佈局配置)
- [元件渲染 renderSlots](/front/component/ma-form/examples/component-rendering)