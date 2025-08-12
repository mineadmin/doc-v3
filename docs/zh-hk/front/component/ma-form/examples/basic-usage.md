# 基礎用法

MaForm 的基礎用法演示，包含常見表單控件的配置方式和基本功能特性。

<DemoPreview dir="demos/ma-form/basic-usage" />

## 功能特性

- **多種輸入類型支持**：文本輸入框、密碼框、數字輸入等
- **自動數據綁定**：雙向綁定表單數據，無需手動處理
- **基礎驗證規則**：支持必填、長度、格式等常用驗證
- **組件配置簡單**：通過配置化方式快速構建表單
- **原生兼容性**：完全兼容 Element Plus 原生屬性和事件

## 核心概念

### 配置化開發
通過 `items` 數組配置表單項，每個配置對象包含：
- `label`：表單項標籤
- `prop`：綁定的數據字段名
- `render`：要渲染的組件類型
- `renderProps`：傳遞給組件的屬性

### 數據綁定
使用 `v-model` 實現雙向數據綁定：
```vue
<ma-form v-model="formData" :items="formItems" />
```

## 常用配置示例

### 基礎輸入框
```typescript
{
  label: '用户名',
  prop: 'username',
  render: 'input',
  renderProps: {
    placeholder: '請輸入用户名',
    clearable: true
  }
}
```

### 密碼輸入框
```typescript
{
  label: '密碼',
  prop: 'password',
  render: 'input',
  renderProps: {
    type: 'password',
    showPassword: true,
    placeholder: '請輸入密碼'
  }
}
```

### 數字輸入框
```typescript
{
  label: '年齡',
  prop: 'age',
  render: 'inputNumber',
  renderProps: {
    min: 0,
    max: 150,
    controlsPosition: 'right'
  }
}
```

## 相關鏈接

- [Props 配置](/zh-hk/front/component/ma-form#props)
- [MaFormItem 配置](/zh-hk/front/component/ma-form#maformitem-配置詳解)
- [組件渲染系統](/zh-hk/front/component/ma-form#組件渲染系統)