# 基礎用法

MaForm 的基礎用法演示，包含常見表單控制元件的配置方式和基本功能特性。

<DemoPreview dir="demos/ma-form/basic-usage" />

## 功能特性

- **多種輸入型別支援**：文字輸入框、密碼框、數字輸入等
- **自動資料繫結**：雙向繫結表單資料，無需手動處理
- **基礎驗證規則**：支援必填、長度、格式等常用驗證
- **元件配置簡單**：透過配置化方式快速構建表單
- **原生相容性**：完全相容 Element Plus 原生屬性和事件

## 核心概念

### 配置化開發
透過 `items` 陣列配置表單項，每個配置物件包含：
- `label`：表單項標籤
- `prop`：繫結的資料欄位名
- `render`：要渲染的元件型別
- `renderProps`：傳遞給元件的屬性

### 資料繫結
使用 `v-model` 實現雙向資料繫結：
```vue
<ma-form v-model="formData" :items="formItems" />
```

## 常用配置示例

### 基礎輸入框
```typescript
{
  label: '使用者名稱',
  prop: 'username',
  render: 'input',
  renderProps: {
    placeholder: '請輸入使用者名稱',
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

## 相關連結

- [Props 配置](/zh-tw/front/component/ma-form#props)
- [MaFormItem 配置](/zh-tw/front/component/ma-form#maformitem-配置詳解)
- [元件渲染系統](/zh-tw/front/component/ma-form#元件渲染系統)