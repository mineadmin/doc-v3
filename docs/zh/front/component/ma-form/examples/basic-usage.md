# 基础用法

MaForm 的基础用法演示，包含常见表单控件的配置方式和基本功能特性。

<DemoPreview dir="demos/ma-form/basic-usage" />

## 功能特性

- **多种输入类型支持**：文本输入框、密码框、数字输入等
- **自动数据绑定**：双向绑定表单数据，无需手动处理
- **基础验证规则**：支持必填、长度、格式等常用验证
- **组件配置简单**：通过配置化方式快速构建表单
- **原生兼容性**：完全兼容 Element Plus 原生属性和事件

## 核心概念

### 配置化开发
通过 `items` 数组配置表单项，每个配置对象包含：
- `label`：表单项标签
- `prop`：绑定的数据字段名
- `render`：要渲染的组件类型
- `renderProps`：传递给组件的属性

### 数据绑定
使用 `v-model` 实现双向数据绑定：
```vue
<ma-form v-model="formData" :items="formItems" />
```

## 常用配置示例

### 基础输入框
```typescript
{
  label: '用户名',
  prop: 'username',
  render: 'input',
  renderProps: {
    placeholder: '请输入用户名',
    clearable: true
  }
}
```

### 密码输入框
```typescript
{
  label: '密码',
  prop: 'password',
  render: 'input',
  renderProps: {
    type: 'password',
    showPassword: true,
    placeholder: '请输入密码'
  }
}
```

### 数字输入框
```typescript
{
  label: '年龄',
  prop: 'age',
  render: 'inputNumber',
  renderProps: {
    min: 0,
    max: 150,
    controlsPosition: 'right'
  }
}
```

## 相关链接

- [Props 配置](/front/component/ma-form#props)
- [MaFormItem 配置](/front/component/ma-form#maformitem-配置详解)
- [组件渲染系统](/front/component/ma-form#组件渲染系统)