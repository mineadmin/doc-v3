# MaForm

基於 `Element plus` 的表單二次封裝的 `Form` 組件，支持所有原生表單的參數、事件、插槽、寫法，還支持通過配置方式來實現。
另外還支持了基於 `el-row` 和 `el-space` 的佈局來規劃表單，具備響應式設計和移動端適配能力。

::: tip 説明
由於全部兼容及支持原生 `el-from` 的所有參數、事件、插槽，所以本文檔主要講解擴展功能。

官方表單參數請參考 [Element plus](https://element-plus.org/zh-CN/component/form.html) 官方文檔。
:::

## 快速開始

### 配置方式使用
<DemoPreview dir="demos/ma-form/config" />

### 模板方式使用
<DemoPreview dir="demos/ma-form/template" />

### 獲取`組件`和`el-form-item`的`Ref`
:::tip 提示
這個方式用於 **配置形式**，`template` 裏可以自己定義 `ref` 
:::

<DemoPreview dir="demos/ma-form/getRef" />

## 完整示例

:::info 示例導航
以下示例展示了 MaForm 的各種用法和高級特性，從基礎使用到複雜場景應用。建議按順序學習以獲得最佳效果。
:::

### 基礎功能示例
- [基礎用法](/zh-hk/front/component/ma-form/examples/basic-usage) - 常見表單控件的基礎配置和使用方法
- [佈局系統](/zh-hk/front/component/ma-form/examples/layout-systems) - Flex 和 Grid 佈局的響應式設計
- [組件渲染](/zh-hk/front/component/ma-form/examples/component-rendering) - 所有支持的 Element Plus 組件展示

### 高級功能示例
- [條件渲染](/zh-hk/front/component/ma-form/examples/conditional-rendering) - 基於表單數據的字段顯示控制
- [動態驗證](/zh-hk/front/component/ma-form/examples/dynamic-validation) - 自定義驗證規則和異步驗證
- [插槽系統](/zh-hk/front/component/ma-form/examples/slots-examples) - 多級插槽的靈活使用方法

### 功能演示示例
- [暴露方法](/zh-hk/front/component/ma-form/examples/expose-methods) - 所有 API 方法的使用演示
- [加載狀態](/zh-hk/front/component/ma-form/examples/loading-states) - 各種加載場景的處理方式
- [嵌套表單](/zh-hk/front/component/ma-form/examples/nested-forms) - 複雜層級結構的表單處理

### 實際應用示例
- [移動端適配](/zh-hk/front/component/ma-form/examples/mobile-responsive) - 響應式設計和移動端優化
- [高級場景](/zh-hk/front/component/ma-form/examples/advanced-scenarios) - 多步驟流程和複雜業務邏輯
- [性能優化](/zh-hk/front/component/ma-form/examples/performance-demo) - 大表單性能優化策略

## TypeScript 類型定義

### 核心接口

#### MaFormOptions
表單配置選項的完整類型定義：

```typescript
interface MaFormOptions {
  // Element Plus 原生 el-form 屬性
  model?: Record<string, any>
  rules?: Record<string, FormItemRule[]>
  inline?: boolean
  labelPosition?: 'left' | 'right' | 'top'
  labelWidth?: string | number
  labelSuffix?: string
  hideRequiredAsterisk?: boolean
  requireAsteriskPosition?: 'left' | 'right'
  showMessage?: boolean
  inlineMessage?: boolean
  statusIcon?: boolean
  validateOnRuleChange?: boolean
  size?: 'large' | 'default' | 'small'
  disabled?: boolean
  scrollToError?: boolean
  scrollIntoViewOptions?: boolean | ScrollIntoViewOptions
  
  // MaForm 擴展屬性
  containerClass?: string
  loading?: boolean
  loadingConfig?: LoadingConfig
  layout?: 'flex' | 'grid'
  flex?: ElRowProps
  grid?: ElSpaceProps
  footerSlot?: () => VNode | VNode[]
  
  // 響應式配置
  responsiveConfig?: ResponsiveConfig
  mobileBreakpoint?: number
}
```

#### MaFormItem
表單項配置的完整類型定義：

```typescript
interface MaFormItem {
  // 基礎配置
  label?: string | (() => string)
  prop?: string | (() => string)
  hide?: boolean | ((item: MaFormItem, model: MaModel) => boolean)
  show?: boolean | ((item: MaFormItem, model: MaModel) => boolean)
  
  // 佈局配置
  cols?: ColsConfiguration
  itemProps?: ElFormItemProps
  itemSlots?: Record<string, (...args: any[]) => VNode | VNode[]>
  
  // 渲染配置
  render?: RenderType
  renderProps?: Record<string, any>
  renderSlots?: Record<string, (...args: any[]) => VNode | VNode[]>
  
  // 嵌套配置
  children?: MaFormItem[]
  
  // 條件渲染
  when?: ConditionFunction
  dependencies?: string[]
  
  // 驗證配置
  customValidator?: (rule: any, value: any, callback: Function) => void
  asyncValidator?: (rule: any, value: any) => Promise<void>
  
  // 移動端配置
  mobileProps?: Record<string, any>
  mobileHide?: boolean
}
```

#### ColsConfiguration
響應式列配置類型：

```typescript
interface ColsConfiguration {
  // 基礎柵格配置
  span?: number
  offset?: number
  push?: number
  pull?: number
  
  // 響應式配置
  xs?: number | ResponsiveColConfig
  sm?: number | ResponsiveColConfig
  md?: number | ResponsiveColConfig
  lg?: number | ResponsiveColConfig
  xl?: number | ResponsiveColConfig
  
  // 自定義配置
  order?: number
  flex?: string | number
}

interface ResponsiveColConfig {
  span?: number
  offset?: number
  push?: number
  pull?: number
}
```

#### RenderType
組件渲染類型定義：

```typescript
type RenderType = 
  | string  // Element Plus 組件名稱
  | Component  // Vue 組件
  | ((data: RenderContext) => VNode | VNode[])  // 渲染函數

interface RenderContext {
  item: MaFormItem
  model: MaModel
  formRef: Ref<FormInstance | undefined>
  disabled: boolean
  readonly: boolean
  size: ComponentSize
}
```

#### MaFormExpose
組件暴露方法的類型定義：

```typescript
interface MaFormExpose {
  // 狀態管理
  setLoadingState: (loading: boolean) => void
  getLoadingState: () => boolean
  
  // 配置管理
  setOptions: (options: Partial<MaFormOptions>) => void
  getOptions: () => MaFormOptions
  updateOptions: (updater: (options: MaFormOptions) => MaFormOptions) => void
  
  // 表單項管理
  setItems: (items: MaFormItem[]) => void
  getItems: () => MaFormItem[]
  appendItem: (item: MaFormItem, index?: number) => void
  prependItem: (item: MaFormItem) => void
  removeItem: (prop: string) => boolean
  updateItem: (prop: string, updates: Partial<MaFormItem>) => boolean
  
  // 表單項查詢
  getItemByProp: (prop: string) => MaFormItem | undefined
  getItemsByCondition: (condition: (item: MaFormItem) => boolean) => MaFormItem[]
  getVisibleItems: () => MaFormItem[]
  
  // 表單驗證
  validate: () => Promise<boolean>
  validateField: (prop: string) => Promise<boolean>
  resetFields: (props?: string[]) => void
  clearValidate: (props?: string[]) => void
  
  // 表單數據
  getFormData: () => Record<string, any>
  setFormData: (data: Record<string, any>) => void
  resetFormData: () => void
  
  // 響應式和移動端
  isMobileState: () => boolean
  updateResponsiveState: () => void
  
  // El-Form 實例
  getElFormRef: () => FormInstance | undefined
}
```

## Props

| 參數        | 説明                             | 類型         | 默認值 | 版本    |
|-----------|--------------------------------|-------------------|-------|-------|
| `v-model` | 表單數據，雙向綁定，支持響應式更新 | `Record<string, any>` | `{}` | 1.0.0 |
| `options` | 表單配置選項，包含 Element Plus 原生屬性和擴展屬性 | `MaFormOptions` | `{}` | 1.0.0 |
| `items`   | 表單項配置數組，支持嵌套和動態配置 | `MaFormItem[]` | `[]` | 1.0.0 |
| `loading` | 全局加載狀態，優先級高於 options.loading | `boolean` | `false` | 1.0.0 |
| `disabled` | 全局禁用狀態，優先級高於 options.disabled | `boolean` | `false` | 1.0.0 |

### MaFormOptions 擴展配置

::: tip 説明
這些是 `ma-form` 對 `el-form` 的擴展參數，與 Element Plus 原生參數完全兼容。
:::

| 參數        | 説明                                                                    | 類型                                                                                              | 默認值      | 版本    |
|-----------|-----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|----------|-------|
| `containerClass` | 表單容器自定義類名，用於樣式定製                                                   | `string`                                                                                        | -        | 1.0.0 |
| `loading` | 是否顯示加載動畫，支持全局和局部加載狀態                                               | `boolean`                                                                                       | `false`  | 1.0.0 |
| `loadingConfig` | 加載動畫詳細配置選項                                                             | [LoadingConfig](#loadingconfig-配置)                                                               | `{}`     | 1.0.0 |
| `layout` | 佈局方式：`flex` 使用柵格系統，`grid` 使用間距佈局                                    | `'flex' \| 'grid'`                                                                              | `flex`   | 1.0.0 |
| `flex` | flex 佈局配置，基於 `el-row` 組件                                            | `ElRowProps`                                                                                    | `{}`     | 1.0.0 |
| `grid` | grid 佈局配置，基於 `el-space` 組件                                          | `ElSpaceProps`                                                                                  | `{}`     | 1.0.0 |
| `footerSlot` | 配置型底部插槽，可返回 VNode 或 VNode 數組                                        | `() => VNode \| VNode[]`                                                                        | -        | 1.0.0 |
| `responsiveConfig` | 響應式配置選項                                                               | `ResponsiveConfig`                                                                              | -        | 1.0.0 |
| `mobileBreakpoint` | 移動端斷點像素值                                                             | `number`                                                                                        | `768`    | 1.0.0 |

#### ResponsiveConfig 響應式配置

```typescript
interface ResponsiveConfig {
  // 啓用響應式佈局
  enabled?: boolean
  // 移動端單列布局
  mobileSingleColumn?: boolean
  // 移動端隱藏標籤
  mobileHideLabels?: boolean
  // 自定義斷點
  breakpoints?: {
    xs?: number  // 超小屏幕
    sm?: number  // 小屏幕
    md?: number  // 中等屏幕
    lg?: number  // 大屏幕
    xl?: number  // 超大屏幕
  }
}
```

#### LoadingConfig 配置

加載動畫的詳細配置選項：

| 參數        | 説明      | 類型   | 默認值 | 版本    |
|-----------|----------|------|-----|-------|
| `text` | 顯示在加載圖標下方的加載文案   | `string`  | `'加載中...'`   | 1.0.0 |
| `spinner` | 自定義加載圖標類名   | `string` | -   | 1.0.0 |
| `svg` | 自定義 SVG 加載圖標   | `string` | -   | 1.0.0 |
| `viewBox` | SVG 圖標的 viewBox 屬性   | `string` | -   | 1.0.0 |
| `background` | 背景遮罩的顏色   | `string` | `'rgba(0, 0, 0, 0.8)'`   | 1.0.0 |
| `customClass` | 自定義樣式類名   | `string` | -   | 1.0.0 |
| `lock` | 是否鎖定滾動   | `boolean` | `true`   | 1.0.0 |
| `fullscreen` | 是否全屏顯示   | `boolean` | `false`   | 1.0.0 |

### MaFormItem 配置詳解

表單項的完整配置選項：

#### 基礎配置

| 參數            | 説明                                                                                                                                                                             | 類型                                                                                                 | 默認值     | 版本     |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|---------|--------|
| `label`       | 表單項標籤，支持字符串或函數返回值                                                                                                                                                                | `string \| (() => string)`                                                                             | -       | 1.0.0  |
| `prop`        | 表單項字段名，支持字符串或函數返回值，用於數據綁定和驗證                                                                                                                                                                | `string \| (() => string)`                                                                             | -       | 1.0.0  |
| `hide`        | 是否隱藏該項（隱藏但保留數據），支持動態控制                                                                                            | `boolean \| ((item: MaFormItem, model: Record<string, any>) => boolean)` | `false` | 1.0.0  |
| `show`        | 是否顯示該項（不顯示則不渲染且無數據），支持動態控制                                                                                       | `boolean \| ((item: MaFormItem, model: Record<string, any>) => boolean)` | `true`  | 1.0.0  |

#### 佈局配置

| 參數            | 説明                                                                                                                                                                             | 類型                                                                                                 | 默認值     | 版本     |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|---------|--------|
| `cols`        | 柵格佈局配置，在 `layout` 為 `flex` 時生效，支持響應式配置                                                                                                                                                  | `ColsConfiguration`                    | -       | 1.0.0  |
| `itemProps`   | Element Plus `el-form-item` 的原生屬性                                                                                                                                                                            | `ElFormItemProps`                    | `{}`       | 1.0.0  |
| `itemSlots`   | Element Plus `el-form-item` 的原生插槽配置                                                                                                                                                                            | `Record<string, (...args: any[]) => VNode \| VNode[]>`                         | `{}`       | 1.0.0  |

#### 渲染配置

| 參數            | 説明                                                                                                                                                                             | 類型                                                                                                 | 默認值     | 版本     |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|---------|--------|
| `render`      | 渲染組件類型：可設置 Element Plus 組件名（如 `'input'`, `'select'`），Vue 組件，或渲染函數 | `RenderType`                                                                            | -       | 1.0.0  |
| `renderProps` | 被渲染組件的 props 屬性配置                                                                                                                                                                              | `Record<string, any>`                                                                              | `{}`       | 1.0.0  |
| `renderSlots` | 被渲染組件的插槽配置                                                                                                                                                                       | `Record<string, (...args: any[]) => VNode \| VNode[]>`                                                                  | `{}`       | 1.0.0  |

#### 嵌套與條件配置

| 參數            | 説明                                                                                                                                                                             | 類型                                                                                                 | 默認值     | 版本     |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|---------|--------|
| `children`    | 子配置項，支持無限嵌套，用於複雜表單結構                                                                                                                                                                 | `MaFormItem[]`                                                                                     | `[]`       | 1.0.33 |
| `when`        | 條件渲染函數，返回 true 時渲染該項                                                                                                                                                                | `(model: Record<string, any>, item: MaFormItem) => boolean`                                                                                     | -       | 1.0.0 |
| `dependencies`| 依賴字段數組，當依賴字段變化時重新計算條件                                                                                                                                                                | `string[]`                                                                                     | `[]`       | 1.0.0 |

#### 驗證配置

| 參數            | 説明                                                                                                                                                                             | 類型                                                                                                 | 默認值     | 版本     |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|---------|--------|
| `customValidator` | 自定義同步驗證函數                                                                                                                                                                | `(rule: any, value: any, callback: Function) => void`                                                                                     | -       | 1.0.0 |
| `asyncValidator`  | 自定義異步驗證函數                                                                                                                                                                | `(rule: any, value: any) => Promise<void>`                                                                                     | -       | 1.0.0 |

#### 移動端配置

| 參數            | 説明                                                                                                                                                                             | 類型                                                                                                 | 默認值     | 版本     |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|---------|--------|
| `mobileProps` | 移動端專用的組件 props 配置                                                                                                                                                                | `Record<string, any>`                                                                                     | `{}`       | 1.0.0 |
| `mobileHide`  | 移動端是否隱藏該項                                                                                                                                                                | `boolean`                                                                                     | `false`       | 1.0.0 |

## 插槽系統

MaForm 提供了靈活的插槽系統，支持多層級的內容自定義：

### 全局插槽

| 名稱              | 説明                                    | 作用域變量 | 示例 |
|-----------------|---------------------------------------|----------|------|
| `default`       | 默認插槽，可寫原生 `<el-form-item>` 標籤，使用後配置方式自動失效 | - | `<ma-form><el-form-item>...</el-form-item></ma-form>` |
| `footer`        | 表單底部插槽，用於放置提交按鈕等操作元素 | `{ formRef, model, loading }` | `<template #footer="{ formRef }">` |
| `loading`       | 自定義加載狀態內容 | `{ loading }` | `<template #loading="{ loading }">` |

### 表單項級別插槽

每個 `MaFormItem` 都支持通過 `itemSlots` 配置自定義插槽：

#### itemSlots 配置

```typescript
interface ItemSlots {
  // Element Plus el-form-item 原生插槽
  label?: (scope: { label: string }) => VNode | VNode[]
  error?: (scope: { error: string }) => VNode | VNode[]
  
  // MaForm 擴展插槽
  prepend?: (scope: FormItemScope) => VNode | VNode[]  // 前置內容
  append?: (scope: FormItemScope) => VNode | VNode[]   // 後置內容
  help?: (scope: FormItemScope) => VNode | VNode[]     // 幫助信息
}

interface FormItemScope {
  item: MaFormItem
  model: Record<string, any>
  disabled: boolean
  readonly: boolean
  size: ComponentSize
  formRef: Ref<FormInstance | undefined>
}
```

### 動態插槽命名

支持基於 `prop` 的動態插槽命名，格式：`item-{prop}`

```vue
<ma-form :items="items">
  <!-- 為 prop 為 'username' 的項自定義渲染 -->
  <template #item-username="{ item, model }">
    <el-input v-model="model[item.prop]" prefix-icon="User" />
  </template>
  
  <!-- 為 prop 為 'password' 的項自定義標籤 -->
  <template #label-password>
    <span style="color: red;">* 密碼</span>
  </template>
</ma-form>
```

### 嵌套組件插槽

對於渲染的 Element Plus 組件，可以通過 `renderSlots` 配置其插槽：

```tsx
const field ={
  render: 'select',
  renderSlots: {
    // el-select 的默認插槽
    default: () => [
      h('el-option', { label: '選項1', value: '1' }),
      h('el-option', { label: '選項2', value: '2' })
    ],
    // el-select 的前綴插槽
    prefix: () => h('el-icon', {}, [h('Search')])
  }
}
```


## 暴露方法 (Expose)

MaForm 組件通過 `defineExpose` 暴露了豐富的 API 方法，用於外部控制和數據操作：

### 狀態管理

| 方法名 | 説明 | 參數 | 返回值 | 示例 |
|-------|------|-----|-------|------|
| `setLoadingState(loading)` | 設置表單加載狀態 | `loading: boolean` | `void` | `formRef.value.setLoadingState(true)` |
| `getLoadingState()` | 獲取當前加載狀態 | - | `boolean` | `const loading = formRef.value.getLoadingState()` |

### 配置管理

| 方法名 | 説明 | 參數 | 返回值 | 示例 |
|-------|------|-----|-------|------|
| `setOptions(options)` | 設置表單配置選項 | `options: Partial<MaFormOptions>` | `void` | `formRef.value.setOptions({ loading: true })` |
| `getOptions()` | 獲取當前表單配置 | - | `MaFormOptions` | `const opts = formRef.value.getOptions()` |
| `updateOptions(updater)` | 通過更新函數修改配置 | `updater: (options) => MaFormOptions` | `void` | `formRef.value.updateOptions(opts => ({ ...opts, loading: false }))` |

### 表單項管理

| 方法名 | 説明 | 參數 | 返回值 | 示例 |
|-------|------|-----|-------|------|
| `setItems(items)` | 設置表單項數組 | `items: MaFormItem[]` | `void` | `formRef.value.setItems(newItems)` |
| `getItems()` | 獲取當前表單項數組 | - | `MaFormItem[]` | `const items = formRef.value.getItems()` |
| `appendItem(item, index?)` | 添加表單項到指定位置 | `item: MaFormItem, index?: number` | `void` | `formRef.value.appendItem(newItem, 2)` |
| `prependItem(item)` | 在開頭添加表單項 | `item: MaFormItem` | `void` | `formRef.value.prependItem(firstItem)` |
| `removeItem(prop)` | 根據 prop 移除表單項 | `prop: string` | `boolean` | `const removed = formRef.value.removeItem('username')` |
| `updateItem(prop, updates)` | 更新指定表單項 | `prop: string, updates: Partial<MaFormItem>` | `boolean` | `formRef.value.updateItem('email', { hide: true })` |

### 表單項查詢

| 方法名 | 説明 | 參數 | 返回值 | 示例 |
|-------|------|-----|-------|------|
| `getItemByProp(prop)` | 根據 prop 獲取表單項 | `prop: string` | `MaFormItem \| undefined` | `const item = formRef.value.getItemByProp('username')` |
| `getItemsByCondition(condition)` | 根據條件獲取表單項數組 | `condition: (item) => boolean` | `MaFormItem[]` | `const hiddenItems = formRef.value.getItemsByCondition(item => item.hide)` |
| `getVisibleItems()` | 獲取所有可見表單項 | - | `MaFormItem[]` | `const visible = formRef.value.getVisibleItems()` |

### 表單驗證

| 方法名 | 説明 | 參數 | 返回值 | 示例 |
|-------|------|-----|-------|------|
| `validate()` | 驗證整個表單 | - | `Promise<boolean>` | `const valid = await formRef.value.validate()` |
| `validateField(prop)` | 驗證指定字段 | `prop: string` | `Promise<boolean>` | `const valid = await formRef.value.validateField('email')` |
| `resetFields(props?)` | 重置字段到初始值 | `props?: string[]` | `void` | `formRef.value.resetFields(['username', 'email'])` |
| `clearValidate(props?)` | 清除驗證結果 | `props?: string[]` | `void` | `formRef.value.clearValidate()` |

### 表單數據

| 方法名 | 説明 | 參數 | 返回值 | 示例 |
|-------|------|-----|-------|------|
| `getFormData()` | 獲取表單數據 | - | `Record<string, any>` | `const data = formRef.value.getFormData()` |
| `setFormData(data)` | 設置表單數據 | `data: Record<string, any>` | `void` | `formRef.value.setFormData({ username: 'admin' })` |
| `resetFormData()` | 重置表單數據為初始狀態 | - | `void` | `formRef.value.resetFormData()` |

### 響應式和移動端

| 方法名 | 説明 | 參數 | 返回值 | 示例 |
|-------|------|-----|-------|------|
| `isMobileState()` | 檢查是否為移動端模式 | - | `boolean` | `const isMobile = formRef.value.isMobileState()` |
| `updateResponsiveState()` | 手動更新響應式狀態 | - | `void` | `formRef.value.updateResponsiveState()` |

### Element Plus 原生實例

| 方法名 | 説明 | 參數 | 返回值 | 示例 |
|-------|------|-----|-------|------|
| `getElFormRef()` | 獲取 Element Plus el-form 實例 | - | `FormInstance \| undefined` | `const elForm = formRef.value.getElFormRef()` |

### 使用示例

```vue
<template>
  <ma-form 
    ref="formRef" 
    v-model="formData" 
    :options="formOptions" 
    :items="formItems"
  />
  
  <div>
    <el-button @click="handleValidate">驗證表單</el-button>
    <el-button @click="handleAddItem">添加項</el-button>
    <el-button @click="handleToggleLoading">切換加載</el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const formRef = ref()
const formData = ref({})

const handleValidate = async () => {
  const isValid = await formRef.value.validate()
  console.log('表單驗證結果:', isValid)
}

const handleAddItem = () => {
  formRef.value.appendItem({
    label: '新字段',
    prop: 'newField',
    render: 'input'
  })
}

const handleToggleLoading = () => {
  const currentLoading = formRef.value.getLoadingState()
  formRef.value.setLoadingState(!currentLoading)
}
</script>
```

## 佈局系統詳解

MaForm 提供了兩種佈局系統，支持響應式設計和移動端適配：

### Flex 佈局 (默認)

基於 Element Plus 的 `el-row` 和 `el-col` 組件實現柵格系統：

```typescript
const field ={
  layout: 'flex',
  flex: {
    gutter: 20,        // 柵格間距
    type: 'flex',      // 現代 flexbox 模式
    justify: 'start',  // 水平對齊方式
    align: 'middle'    // 垂直對齊方式
  }
}
```

#### 柵格配置

每個表單項可以通過 `cols` 屬性配置柵格佈局：

```typescript
const field ={
  label: '用户名',
  prop: 'username',
  render: 'input',
  cols: {
    span: 12,        // 佔據12格（總共24格）
    offset: 0,       // 左側間隔
    push: 0,         // 向右移動
    pull: 0,         // 向左移動
    order: 1,        // 排序
    
    // 響應式配置
    xs: 24,          // <768px 時佔滿整行
    sm: 12,          // ≥768px 時佔一半
    md: 8,           // ≥992px 時佔三分之一
    lg: 6,           // ≥1200px 時佔四分之一
    xl: 4            // ≥1920px 時佔六分之一
  }
}
```

### Grid 佈局

基於 Element Plus 的 `el-space` 組件實現間距佈局：

```typescript
const field ={
  layout: 'grid',
  grid: {
    direction: 'vertical',  // 排列方向
    size: 'medium',         // 間距大小
    wrap: true,             // 是否換行
    fill: true,             // 是否填充容器
    fillRatio: 30,          // 填充比例
    alignment: 'start'      // 對齊方式
  }
}
```

### 響應式配置

#### 斷點系統

| 斷點 | 設備類型 | 寬度範圍 |
|------|---------|----------|
| `xs` | 超小屏幕 | <768px |
| `sm` | 小屏幕 | ≥768px |
| `md` | 中等屏幕 | ≥992px |
| `lg` | 大屏幕 | ≥1200px |
| `xl` | 超大屏幕 | ≥1920px |

#### 移動端適配

```typescript
const field ={
  mobileBreakpoint: 768,
  responsiveConfig: {
    enabled: true,
    mobileSingleColumn: true,      // 移動端單列布局
    mobileHideLabels: false,       // 移動端隱藏標籤
    breakpoints: {
      xs: 576,
      sm: 768,
      md: 992,
      lg: 1200,
      xl: 1920
    }
  }
}
```

## 組件渲染系統

MaForm 支持多種組件渲染方式，提供靈活的擴展能力：

### 支持的 Element Plus 組件

| 組件名稱 | 渲染值 | 説明 | 常用配置 |
|---------|-------|------|----------|
| `input` | `'input'` | 輸入框 | `type`, `placeholder`, `clearable` |
| `textarea` | `'textarea'` | 文本域 | `rows`, `autosize`, `resize` |
| `select` | `'select'` | 選擇器 | `multiple`, `filterable`, `remote` |
| `cascader` | `'cascader'` | 級聯選擇器 | `options`, `props`, `showAllLevels` |
| `datePicker` | `'datePicker'` | 日期選擇器 | `type`, `format`, `valueFormat` |
| `timePicker` | `'timePicker'` | 時間選擇器 | `format`, `valueFormat`, `selectableRange` |
| `switch` | `'switch'` | 開關 | `activeText`, `inactiveText`, `activeValue` |
| `checkbox` | `'checkbox'` | 複選框 | `trueLabel`, `falseLabel` |
| `checkboxGroup` | `'checkboxGroup'` | 複選框組 | `min`, `max` |
| `radio` | `'radio'` | 單選框 | `label`, `border` |
| `radioGroup` | `'radioGroup'` | 單選框組 | `textColor`, `fill` |
| `rate` | `'rate'` | 評分 | `max`, `allowHalf`, `showText` |
| `slider` | `'slider'` | 滑塊 | `min`, `max`, `step`, `range` |
| `upload` | `'upload'` | 上傳 | `action`, `headers`, `multiple` |
| `transfer` | `'transfer'` | 穿梭框 | `data`, `targetKeys`, `titles` |

### 渲染方式詳解

#### 1. 字符串渲染

```typescript
const field ={
  label: '用户名',
  prop: 'username',
  render: 'input',                    // 字符串方式
  renderProps: {
    placeholder: '請輸入用户名',
    clearable: true,
    prefixIcon: 'User'
  }
}
```

#### 2. 組件渲染

```typescript
import CustomInput from './CustomInput.vue'

const field ={
  label: '自定義字段',
  prop: 'custom',
  render: CustomInput,                // 組件方式
  renderProps: {
    customProp: 'value'
  }
}
```

#### 3. 函數渲染

```typescript
const field = {
  label: '動態渲染',
  prop: 'dynamic',
  render: ({ item, model, disabled }) => {
    return h('div', [
      h('el-input', {
        modelValue: model[item.prop],
        'onUpdate:modelValue': (value) => model[item.prop] = value,
        disabled,
        placeholder: '動態渲染的輸入框'
      })
    ])
  }
}
```

#### 4. JSX/TSX 渲染

```tsx
const field ={
  label: 'JSX 渲染',
  prop: 'jsx',
  render: ({ item, model }) => (
    <el-input
      v-model={model[item.prop]}
      placeholder="JSX 渲染的輸入框"
      clearable
    />
  )
}
```

### 複雜組件配置示例

#### Select 選擇器

```typescript
const field ={
  label: '選擇項',
  prop: 'selection',
  render: 'select',
  renderProps: {
    multiple: true,
    filterable: true,
    remote: true,
    remoteMethod: (query) => {
      // 遠程搜索邏輯
    },
    placeholder: '請選擇'
  },
  renderSlots: {
    default: () => [
      h('el-option', { label: '選項1', value: '1' }),
      h('el-option', { label: '選項2', value: '2' })
    ],
    prefix: () => h('el-icon', [h('Search')])
  }
}
```

#### Upload 上傳

```typescript
const field ={
  label: '文件上傳',
  prop: 'files',
  render: 'upload',
  renderProps: {
    action: '/api/upload',
    multiple: true,
    showFileList: true,
    drag: true,
    accept: '.jpg,.png,.pdf',
    beforeUpload: (file) => {
      // 上傳前驗證
      return true
    },
    onSuccess: (response, file) => {
      // 上傳成功處理
    }
  },
  renderSlots: {
    trigger: () => h('el-button', { type: 'primary' }, '選擇文件'),
    tip: () => h('div', { class: 'el-upload__tip' }, '只能上傳jpg/png文件，且不超過500kb')
  }
}
```

## 高級特性

### 條件渲染

基於表單數據動態控制表單項的顯示和隱藏：

```typescript
const field =[
    {
      label: '賬户類型',
      prop: 'accountType',
      render: 'select',
      renderProps: { /* ... */ }
    },
    {
      label: '企業名稱',
      prop: 'companyName',
      render: 'input',
      // 僅當賬户類型為企業時顯示
      when: (model, item) => model.accountType === 'company',
      dependencies: ['accountType']  // 依賴字段，變化時重新計算
    }
]
```

### 動態驗證

支持基於上下文的動態驗證規則：

```typescript
const field ={
  label: '確認密碼',
  prop: 'confirmPassword',
  render: 'input',
  renderProps: {
    type: 'password',
    showPassword: true
  },
  customValidator: (rule, value, callback) => {
    if (value !== model.password) {
      callback(new Error('兩次輸入的密碼不一致'))
    } else {
      callback()
    }
  }
}
```

### 異步數據加載

```typescript
const field ={
  label: '城市選擇',
  prop: 'city',
  render: 'select',
  renderProps: {
    loading: false,
    filterable: true,
    remote: true,
    remoteMethod: async (query) => {
      formRef.value.updateItem('city', {
        renderProps: { loading: true }
      })
      
      try {
        const cities = await fetchCities(query)
        // 更新選項
        updateCityOptions(cities)
      } finally {
        formRef.value.updateItem('city', {
          renderProps: { loading: false }
        })
      }
    }
  }
}
```

## 最佳實踐

### 1. 性能優化

#### 使用 `show` vs `hide`

```typescript
// 推薦：使用 show，不渲染隱藏項
{
  show: (item,model) => model.userType === 'admin'
}

// 避免：使用 hide，仍會渲染但隱藏
{
  hide: (item,model) => model.userType !== 'admin'
}
```

#### 合理使用響應式配置

```typescript
// 推薦：針對移動端優化
const field ={
  cols: {
    xs: 24,    // 移動端單列
    sm: 12,    // 平板雙列
    md: 8      // 桌面三列
  }
}
```

### 2. 表單驗證策略

#### 分層驗證

```typescript
// 1. 基礎驗證（Element Plus 規則）
itemProps: {
  rules: [
    { required: true, message: '請輸入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '長度在 3 到 20 個字符', trigger: 'blur' }
  ]
}

// 2. 自定義驗證
customValidator: (rule, value, callback) => {
  if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    callback(new Error('只能包含字母、數字和下劃線'))
  } else {
    callback()
  }
}

// 3. 異步驗證
asyncValidator: async (rule, value) => {
  const exists = await checkUsernameExists(value)
  if (exists) {
    throw new Error('用户名已存在')
  }
}
```

### 3. 組件複用

#### 創建通用配置

```typescript
// utils/formConfigs.ts
export const createUserFormItems = (readonly = false): MaFormItem[] => [
  {
    label: '用户名',
    prop: 'username',
    render: 'input',
    renderProps: {
      disabled: readonly,
      placeholder: readonly ? '' : '請輸入用户名'
    }
  },
  {
    label: '郵箱',
    prop: 'email',
    render: 'input',
    renderProps: {
      disabled: readonly,
      type: 'email'
    }
  }
]
```

#### 使用組合式 API

```typescript
// composables/useFormConfig.ts
export function useFormConfig() {
  const createFormItems = (type: 'create' | 'edit' | 'view') => {
    const readonly = type === 'view'
    
    return [
      // 基礎信息
      ...createUserFormItems(readonly),
      
      // 條件字段
      ...(type !== 'view' ? [
        {
          label: '密碼',
          prop: 'password',
          render: 'input',
          renderProps: { type: 'password' }
        }
      ] : [])
    ]
  }
  
  return { createFormItems }
}
```

### 4. 錯誤處理

```typescript
const handleSubmit = async () => {
  try {
    // 驗證表單
    const isValid = await formRef.value.validate()
    if (!isValid) {
      ElMessage.error('請檢查表單填寫')
      return
    }
    
    // 獲取表單數據
    const formData = formRef.value.getFormData()
    
    // 提交數據
    await submitForm(formData)
    
    ElMessage.success('提交成功')
  } catch (error) {
    console.error('表單提交失敗:', error)
    ElMessage.error('提交失敗，請稍後重試')
  }
}
```

## 常見問題 (FAQ)

### Q: 如何實現表單項的動態增減？

A: 使用 `appendItem` 和 `removeItem` 方法：

```typescript
// 添加表單項
const addItem = () => {
  formRef.value.appendItem({
    label: `字段${Date.now()}`,
    prop: `field_${Date.now()}`,
    render: 'input'
  })
}

// 刪除表單項
const removeItem = (prop: string) => {
  formRef.value.removeItem(prop)
}
```

### Q: 如何自定義驗證規則？

A: 使用 `customValidator` 或 `asyncValidator`：

```typescript
const field ={
  customValidator: (rule, value, callback) => {
    // 同步驗證邏輯
    if (condition) {
      callback(new Error('驗證失敗'))
    } else {
      callback()
    }
  },
  asyncValidator: async (rule, value) => {
    // 異步驗證邏輯
    const result = await validateAsync(value)
    if (!result.valid) {
      throw new Error(result.message)
    }
  }
}
```

### Q: 如何處理複雜的嵌套表單？

A: 使用 `children` 配置：

```typescript
const field ={
  label: '地址信息',
  prop: 'address',
  render: 'input',  // 父級渲染（可選）
  children: [
    {
      label: '省份',
      prop: 'address.province',
      render: 'select'
    },
    {
      label: '城市',
      prop: 'address.city', 
      render: 'select'
    }
  ]
}
```

### Q: 移動端適配有哪些注意事項？

A: 關鍵配置項：

```typescript
const field ={
  mobileBreakpoint: 768,
  responsiveConfig: {
    enabled: true,
    mobileSingleColumn: true,    // 移動端強制單列
    mobileHideLabels: false      // 是否隱藏標籤
  }
}

// 表單項級別的移動端配置
const field1 ={
  mobileProps: {
    size: 'large',           // 移動端使用大尺寸
    clearable: false         // 移動端禁用清除按鈕
  },
  mobileHide: false          // 移動端是否隱藏
}
```
