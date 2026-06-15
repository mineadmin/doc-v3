# MaForm

`@mineadmin/form` 是基于 Vue 3、Element Plus 和 TSX 封装的配置化表单库。它把 `ElForm`、`ElFormItem` 和常见数据录入组件组合成一个可通过 `items` 数组动态渲染的表单组件，适合后台管理系统中的新增、编辑、筛选、高级配置表单等场景。

本文按 `@mineadmin/form` 当前源码整理。

## 当前版本

- 文档版本：`latest`
- 源码版本：`1.0.57`
- 包名：`@mineadmin/form`
- 版本策略：独立发版，不跟随 MineAdmin 主产品大版本
- peer dependency：`element-plus`

## 安装

::: code-group

```bash [pnpm]
pnpm add @mineadmin/form element-plus
```

```bash [npm]
npm install @mineadmin/form element-plus
```

```bash [yarn]
yarn add @mineadmin/form element-plus
```

:::

在应用入口注册插件：

```ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import MaForm from '@mineadmin/form'
import '@mineadmin/form/dist/index.css'
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus)
app.use(MaForm)
app.mount('#app')
```

SSR 场景可以开启延迟客户端渲染：

```ts
app.use(MaForm, { ssr: true })
```

## 快速开始

`MaForm` 接收一个对象模型和一组表单项配置。每个 `item` 通过 `prop` 绑定模型路径，通过 `render` 指定要渲染的 Element Plus 组件或自定义组件。

<DemoPreview dir="demos/ma-form/default" />

```vue
<script setup lang="tsx">
import { ref } from 'vue'
import type { MaFormItem, MaFormOptions, MaModel } from '@mineadmin/form'

const model = ref<MaModel>({
  username: '',
  enabled: true,
})

const options: MaFormOptions = {
  labelWidth: '100px',
  rules: {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  },
}

const items: MaFormItem[] = [
  {
    label: '用户名',
    prop: 'username',
    render: 'input',
    renderProps: {
      clearable: true,
      placeholder: '请输入用户名',
    },
    cols: { span: 12 },
  },
  {
    label: '启用状态',
    prop: 'enabled',
    render: 'switch',
    cols: { span: 12 },
  },
]
</script>

<template>
  <ma-form v-model="model" :options="options" :items="items" />
</template>
```

`prop` 支持点路径，内部通过 `lodash-es` 的 `get` 和 `set` 读写模型：

```ts
const model = ref({
  user: {
    profile: {
      nickname: '',
    },
  },
})

const items: MaFormItem[] = [
  {
    label: '昵称',
    prop: 'user.profile.nickname',
    render: 'input',
  },
]
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `v-model` / `modelValue` | 表单数据模型，支持对象与嵌套路径 | `MaModel` | `{}` |
| `options` | 表单配置，包含 Element Plus `ElForm` 属性和 MaForm 扩展属性 | `MaFormOptions` | `{}` |
| `items` | 表单项配置数组 | `MaFormItem[]` | `[]` |

## MaFormOptions

`MaFormOptions` 继承了 Element Plus Form 的常用配置，并额外提供加载态、布局和页脚渲染能力。

| 参数 | 说明 | 类型 |
|------|------|------|
| `rules` | 表单验证规则，对应 `ElForm` 的 `rules` | `FormRules` |
| `inline` | 是否使用行内表单模式 | `boolean` |
| `labelPosition` | 标签位置 | `'left' \| 'right' \| 'top'` |
| `labelWidth` | 标签宽度 | `string \| number` |
| `labelSuffix` | 标签后缀 | `string` |
| `hideRequiredAsterisk` | 是否隐藏必填星号 | `boolean` |
| `showMessage` | 是否显示校验错误信息 | `boolean` |
| `inlineMessage` | 是否以行内形式展示校验信息 | `boolean` |
| `statusIcon` | 是否显示校验反馈图标 | `boolean` |
| `validateOnRuleChange` | `rules` 改变后是否立即验证 | `boolean` |
| `size` | 表单内组件尺寸 | `'' \| 'large' \| 'default' \| 'small'` |
| `disabled` | 是否禁用表单内所有组件 | `boolean` |
| `scrollToError` | 校验失败时是否滚动到第一个错误项 | `boolean` |
| `scrollIntoViewOptions` | 滚动到错误项时的 `scrollIntoView` 配置 | `Record<string, any> \| boolean` |
| `onValidate` | 任一表单项完成校验后的回调 | `(prop, isValid, message) => void` |
| `loading` | 是否显示容器加载态 | `boolean` |
| `loadingConfig` | 加载态配置 | `LoadingConfig` |
| `containerClass` | 表单外层容器 class | `string` |
| `layout` | 布局模式，未设置时按 `flex` 处理 | `'flex' \| 'grid'` |
| `flex` | `flex` 布局参数，透传给 `el-row` | `object` |
| `grid` | `grid` 布局参数，实际透传给 `el-space` | `object` |
| `footerSlot` | 使用 TSX/JSX 配置页脚内容 | `() => any` |

### LoadingConfig

| 参数 | 说明 | 类型 |
|------|------|------|
| `text` | 加载文案 | `string` |
| `spinner` | 自定义加载图标 class | `string` |
| `svg` | 自定义 SVG 加载图标 | `string` |
| `viewBox` | 自定义 SVG 的 viewBox | `string` |
| `background` | 背景遮罩颜色 | `string` |
| `customClass` | 自定义加载层 class | `string` |

## 布局

默认布局是 `flex`，每个表单项会包裹在 `el-col` 中，`item.cols` 透传给 `el-col`。

```ts
const options: MaFormOptions = {
  layout: 'flex',
  flex: {
    gutter: 16,
    justify: 'start',
    align: 'top',
  },
}

const items: MaFormItem[] = [
  { label: '姓名', prop: 'name', render: 'input', cols: { xs: 24, sm: 12 } },
  { label: '手机', prop: 'mobile', render: 'input', cols: { xs: 24, sm: 12 } },
]
```

`grid` 布局使用 `el-space` 渲染表单项，适合固定间距、自动换行或纵向排列的场景。

```ts
const options: MaFormOptions = {
  layout: 'grid',
  grid: {
    wrap: true,
    fill: true,
    fillRatio: 30,
    style: { width: '100%' },
  },
}
```

## MaFormItem

| 参数 | 说明 | 类型 |
|------|------|------|
| `label` | 表单项标签 | `string \| (() => string)` |
| `prop` | 模型字段路径，使用校验、重置等能力时建议必填 | `string \| (() => string)` |
| `hide` | 是否隐藏该项，隐藏后保留数据与组件实例 | `boolean \| state` |
| `show` | 是否渲染该项，不渲染时不会输出表单项 | `boolean \| state` |
| `cols` | `flex` 布局下的 `el-col` 参数 | `object` |
| `itemProps` | `ElFormItem` 属性，已移除 `label` 和 `prop` | `FormItem` |
| `itemSlots` | `ElFormItem` 插槽配置 | `object` |
| `render` | 字符串组件名、自定义渲染函数、组件或 VNode | `renderType` |
| `renderProps` | 渲染组件的 props | `Record<string, any>` |
| `renderSlots` | 渲染组件的插槽 | `Record<string, renderSlotType>` |
| `children` | 子表单项配置 | `MaFormItem[]` |

`hide` 和 `show` 都可以接收函数，函数参数是当前表单项和整个表单模型：

```ts
const items: MaFormItem[] = [
  {
    label: '账号类型',
    prop: 'type',
    render: 'select',
  },
  {
    label: '企业名称',
    prop: 'companyName',
    render: 'input',
    show: (_item, model) => model.type === 'company',
  },
  {
    label: '内部备注',
    prop: 'remark',
    render: 'input',
    hide: (_item, model) => model.type !== 'internal',
  },
]
```

### itemProps 与辅助说明

`itemProps` 会透传给 `ElFormItem`，并额外支持 `help` 和 `extra` 文案。

```ts
const items: MaFormItem[] = [
  {
    label: '邮箱',
    prop: 'email',
    render: 'input',
    itemProps: {
      rules: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
      ],
      help: '用于接收系统通知',
      extra: '请使用常用邮箱',
    },
  },
]
```

`itemSlots` 可以覆盖表单项的 `default`、`label`、`error`、`help` 和 `extra`。

```tsx
const items: MaFormItem[] = [
  {
    prop: 'password',
    render: 'input',
    renderProps: { type: 'password', showPassword: true },
    itemSlots: {
      label: () => <span style="color: #409eff">登录密码</span>,
      help: () => <span>至少 8 位，建议包含数字和字母</span>,
    },
  },
]
```

## 渲染组件

当 `render` 是字符串时，MaForm 会把首字母转成大写后到内置组件映射中查找 Element Plus 组件。

| render 值 | Element Plus 组件 |
|-----------|-------------------|
| `radio` / `radioButton` | `ElRadioGroup` |
| `checkbox` / `checkboxButton` | `ElCheckboxGroup` |
| `input` | `ElInput` |
| `mention` | `ElMention` |
| `autocomplete` | `ElAutocomplete` |
| `inputNumber` | `ElInputNumber` |
| `select` | `ElSelect` |
| `selectV2` | `ElSelectV2` |
| `treeSelect` | `ElTreeSelect` |
| `cascader` | `ElCascader` |
| `switch` | `ElSwitch` |
| `slider` | `ElSlider` |
| `timePicker` | `ElTimePicker` |
| `datePicker` | `ElDatePicker` |
| `timeSelect` | `ElTimeSelect` |
| `rate` | `ElRate` |
| `colorPicker` | `ElColorPicker` |
| `transfer` | `ElTransfer` |

:::tip
`ComponentName` 类型中保留了 `Upload`，但当前内置 `componentMap` 未注册上传组件。上传类场景建议使用自定义渲染函数。
:::

### renderProps

`renderProps` 会传给实际渲染的组件，MaForm 会自动补上 `modelValue` 和 `onUpdate:modelValue`。

```ts
const items: MaFormItem[] = [
  {
    label: '标题',
    prop: 'title',
    render: 'input',
    renderProps: {
      maxlength: 60,
      showWordLimit: true,
      placeholder: '请输入标题',
    },
  },
]
```

### renderSlots

组件插槽通过 `renderSlots` 配置。适合给 `select`、`treeSelect` 等组件补充子节点。

```tsx
import { ElOption } from 'element-plus'

const items: MaFormItem[] = [
  {
    label: '状态',
    prop: 'status',
    render: 'select',
    renderProps: {
      clearable: true,
      placeholder: '请选择状态',
    },
    renderSlots: {
      default: () => [
        <ElOption label="启用" value="enabled" />,
        <ElOption label="禁用" value="disabled" />,
      ],
    },
  },
]
```

### 自定义渲染

`render` 也可以传函数，函数会收到当前 `item` 和完整 `formData`。

```tsx
import { ElInput, ElTag } from 'element-plus'

const items: MaFormItem[] = [
  {
    label: '邀请码',
    prop: 'inviteCode',
    render: ({ formData }) => (
      <ElInput placeholder="请输入邀请码">
        {{
          append: () => formData.inviteCode ? <ElTag type="success">已填写</ElTag> : '待填写',
        }}
      </ElInput>
    ),
  },
]
```

### 接入 Table 组件

`@mineadmin/form` 当前源码没有在内置 `componentMap` 中注册 `table`，因此不能通过 `render: 'table'` 直接渲染表格。需要在应用里额外安装并注册表格组件，然后通过自定义渲染把 `MaTable`、`ElTable` 或业务表格组件放进表单项。

如果使用 `@mineadmin/table` 的 `MaTable`，需要先在入口完成注册；如果使用 Element Plus 的 `ElTable`，已随 `ElementPlus` 注册：

```ts
import MaForm from '@mineadmin/form'
import MaTable from '@mineadmin/table'

app.use(MaForm)
app.use(MaTable)
```

表格组件通常不使用 `v-model`，需要显式把表单模型里的数组传给表格。单元格编辑、增删行等操作直接修改这个数组即可，最终提交时仍然从 `ma-form` 的 `v-model` 中读取完整数据。对于表格这类不需要 MaForm 自动注入 `modelValue` 的组件，推荐使用 `itemSlots.default` 填充表单项内容。

<DemoPreview dir="demos/ma-form/table-in-form" title="表格明细表单" description="在 MaForm 中通过 itemSlots.default 接入 ElTable，并把明细行保存到表单模型。" />

```tsx
import { computed, ref } from 'vue'
import { ElButton, ElInput, ElInputNumber, ElTable, ElTableColumn } from 'element-plus'
import type { MaFormItem, MaModel } from '@mineadmin/form'

interface ProductRow {
  name: string
  quantity: number
  price: number
}

const model = ref<MaModel>({
  products: [
    { name: 'MineAdmin 专业版', quantity: 1, price: 2999 },
  ],
})

const rows = computed<ProductRow[]>(() => model.value.products ?? [])

const addRow = () => {
  rows.value.push({ name: '', quantity: 1, price: 0 })
}

const items: MaFormItem[] = [
  {
    label: '商品明细',
    prop: 'products',
    cols: { span: 24 },
    itemProps: {
      help: '表格数据会保存在 model.products 中，可随表单一起校验和提交。',
    },
    itemSlots: {
      default: () => {
        return (
          <div style="width: 100%">
            <ElTable data={rows.value} border stripe style={{ width: '100%' }}>
              <ElTableColumn label="商品名称" minWidth={180}>
                {{
                  default: ({ row }: { row: ProductRow }) => (
                    <ElInput
                      modelValue={row.name}
                      placeholder="请输入商品名称"
                      onUpdate:modelValue={value => row.name = String(value ?? '')}
                    />
                  ),
                }}
              </ElTableColumn>
              <ElTableColumn label="数量" width={150}>
                {{
                  default: ({ row }: { row: ProductRow }) => (
                    <ElInputNumber
                      modelValue={row.quantity}
                      min={1}
                      onUpdate:modelValue={value => row.quantity = value ?? 1}
                    />
                  ),
                }}
              </ElTableColumn>
              <ElTableColumn label="单价" width={160}>
                {{
                  default: ({ row }: { row: ProductRow }) => (
                    <ElInputNumber
                      modelValue={row.price}
                      min={0}
                      precision={2}
                      onUpdate:modelValue={value => row.price = value ?? 0}
                    />
                  ),
                }}
              </ElTableColumn>
            </ElTable>
            <ElButton
              type="primary"
              link
              onClick={addRow}
            >
              新增一行
            </ElButton>
          </div>
        )
      },
    },
  },
]
```

如果你希望完全通过 `render` 维护表格，也可以在 `render` 函数中返回一个表格容器组件，并由该组件内部管理 `MaTable` 的 `data`、`columns` 和行编辑逻辑。

:::tip
`MaForm` 会把 `modelValue` 和 `onUpdate:modelValue` 注入给最终渲染组件，但表格类组件更常见的是 `data`、`columns`、`options` 这类属性。接入这类组件时，以表单模型中的数组作为数据源会更直观，也能避免误以为 `render: 'table'` 是内置能力。
:::

## 嵌套表单项

`children` 会在当前渲染组件的默认插槽内继续渲染一组子表单项，适合把一组字段包进卡片、折叠面板或自定义容器中。

```tsx
const items: MaFormItem[] = [
  {
    prop: 'profile',
    render: () => <div class="profile-panel" />,
    children: [
      { label: '姓名', prop: 'profile.name', render: 'input' },
      { label: '职位', prop: 'profile.title', render: 'input' },
    ],
  },
]
```

## 页脚

可以使用组件插槽写页脚，也可以用 `options.footerSlot` 在配置中声明。

```tsx
const options: MaFormOptions = {
  footerSlot: () => (
    <div style="text-align: right">
      <el-button>取消</el-button>
      <el-button type="primary">提交</el-button>
    </div>
  ),
}
```

模板插槽写法：

```vue
<template>
  <ma-form v-model="model" :options="options" :items="items">
    <template #footer>
      <el-button>取消</el-button>
      <el-button type="primary">保存</el-button>
    </template>
  </ma-form>
</template>
```

## 暴露方法

通过组件 `ref` 可以访问 MaForm 暴露的方法。常用方式是使用 `useForm(refName)`，也可以直接使用 Vue 的模板 ref。

| 方法 | 说明 |
|------|------|
| `setLoadingState(loading)` | 设置 `options.loading` |
| `setOptions(options)` | 合并更新表单配置 |
| `getOptions()` | 获取当前表单配置 |
| `setItems(items)` | 替换表单项数组 |
| `getItems()` | 获取当前表单项数组 |
| `appendItem(item)` | 追加一个表单项 |
| `getItemByProp(prop)` | 按 `prop` 查找表单项，运行时找不到返回 `null` |
| `getElFormRef()` | 获取底层 Element Plus `ElForm` 实例 |

当前源码还在运行时暴露了 `removeItem(prop)` 和 `isMobileState()`；如果在 TypeScript 中使用并遇到类型提示缺失，可以按项目需要扩展本地类型。

## useForm

`useForm(refName)` 会在组件挂载后按字符串 ref 查找 MaForm 实例，并返回一个 Promise。

```vue
<script setup lang="tsx">
import { ref } from 'vue'
import { useForm } from '@mineadmin/form'
import type { MaFormExpose, MaFormItem, MaModel } from '@mineadmin/form'

const model = ref<MaModel>({})
const items = ref<MaFormItem[]>([])

useForm('userForm').then((form: MaFormExpose) => {
  form.setOptions({
    labelWidth: '100px',
    footerSlot: () => (
      <el-button
        type="primary"
        onClick={() => form.getElFormRef().validate()}
      >
        提交
      </el-button>
    ),
  })

  form.setItems([
    { label: '用户名', prop: 'username', render: 'input' },
  ])
})
</script>

<template>
  <ma-form ref="userForm" v-model="model" :items="items" />
</template>
```

:::warning
`useForm` 内部依赖 `getCurrentInstance()` 和 `onMounted()`，需要在组件 `setup` 阶段调用。
:::

## 类型导出

`@mineadmin/form` 导出了常用类型，便于在业务项目中约束配置。

```ts
import type {
  ComponentName,
  FormItem,
  LoadingConfig,
  MaFormExpose,
  MaFormInstallOptions,
  MaFormItem,
  MaFormOptions,
  MaModel,
  renderType,
  state,
} from '@mineadmin/form'
```

## 与 Element Plus 的关系

MaForm 不重新实现表单校验和表单项能力，而是把配置透传到 Element Plus：

- 表单级配置通过 `options` 传给 `ElForm`
- 表单项级配置通过 `item.itemProps` 传给 `ElFormItem`
- 组件级配置通过 `item.renderProps` 传给最终渲染组件
- 校验、重置、清除校验等操作通过 `getElFormRef()` 调用 Element Plus Form 实例方法

```ts
useForm('userForm').then(async (form) => {
  const elForm = form.getElFormRef()
  await elForm.validate()
  elForm.resetFields()
})
```
