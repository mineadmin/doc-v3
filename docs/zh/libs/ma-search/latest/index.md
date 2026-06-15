# MaSearch

`@mineadmin/search` 是基于 `@mineadmin/form` 和 Element Plus 封装的列表搜索面板组件。它把搜索字段、搜索/重置按钮、折叠展开、响应式列布局和运行时方法组织成一个独立库，适合后台列表页、筛选面板和 `ma-pro-table` 搜索区域。


## 当前版本

- 文档版本：`latest`
- 包名：`@mineadmin/search`
- 源码版本：`1.0.59`
- 版本策略：独立发版，不跟随 MineAdmin 主产品大版本
- peer dependency：`element-plus`

## 安装

```bash
pnpm add @mineadmin/search @mineadmin/form element-plus
```

`ma-search` 内部渲染 `ma-form`，因此应用入口需要同时注册 Element Plus、MaForm 和 MaSearch。

```ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import MaForm from '@mineadmin/form'
import MaSearch from '@mineadmin/search'

import 'element-plus/dist/index.css'
import '@mineadmin/form/dist/index.css'
import '@mineadmin/search/dist/index.css'
import App from './App.vue'

const app = createApp(App)

app
  .use(ElementPlus)
  .use(MaForm)
  .use(MaSearch)
  .mount('#app')
```

SSR 场景可以开启客户端挂载后渲染：

```ts
app.use(MaSearch, { ssr: true })
```

## 基础用法

`ma-search` 接收三组核心配置：

- `options`：搜索面板自身配置，例如默认值、列数、折叠、按钮文案。
- `formOptions`：透传给内部 `ma-form` 的表单配置，例如 `labelWidth`。
- `searchItems`：搜索项配置，类型继承自 `MaFormItem`，额外扩展 `span`、`offset` 和 `hide`。

```vue
<script setup lang="tsx">
import { ref } from 'vue'
import type {
  MaSearchExpose,
  MaSearchItem,
  MaSearchOptions,
} from '@mineadmin/search'

const searchRef = ref<MaSearchExpose>()

const options: MaSearchOptions = {
  defaultValue: {
    status: 'enabled',
  },
  cols: {
    xs: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 4,
  },
}

const searchItems: MaSearchItem[] = [
  {
    label: '用户名',
    prop: 'username',
    render: 'input',
    renderProps: {
      clearable: true,
      placeholder: '请输入用户名',
    },
  },
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
        { label: '启用', value: 'enabled' },
        { label: '禁用', value: 'disabled' },
      ].map(item => (
        <el-option label={item.label} value={item.value} />
      )),
    },
  },
  {
    label: '创建时间',
    prop: 'created_at',
    render: 'date-picker',
    span: 2,
    renderProps: {
      type: 'daterange',
      valueFormat: 'YYYY-MM-DD',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
    },
  },
]

const handleSearch = (form: Record<string, any>) => {
  console.log('搜索参数', form)
}

const handleReset = (form: Record<string, any>) => {
  console.log('重置后参数', form)
}
</script>

<template>
  <ma-search
    ref="searchRef"
    :options="options"
    :form-options="{ labelWidth: '90px' }"
    :search-items="searchItems"
    @search="handleSearch"
    @reset="handleReset"
  />
</template>
```

搜索项的 `prop` 支持点路径，字段值会写入对应的嵌套对象：

```ts
const searchItems: MaSearchItem[] = [
  { label: '用户名', prop: 'user.name', render: 'input' },
]
```

输入组件监听回车键，按下 `Enter` 会触发一次 `search` 事件。

## Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `options` | 搜索面板配置 | `MaSearchOptions` | `{}` |
| `formOptions` | 内部 `ma-form` 配置 | `MaFormOptions` | `{}` |
| `searchItems` | 搜索项配置数组 | `MaSearchItem[]` | `[]` |

组件上的其他属性会继续透传给内部 `ma-form`。

## MaSearchOptions

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `defaultValue` | 搜索表单默认值 | `Record<string, any>` | `{}` |
| `cols` | 响应式列数配置 | `Record<'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl', number>` | 见下方断点 |
| `fold` | 初始折叠配置。传 `true` 时挂载后会先收起超过 `foldRows` 的搜索项 | `boolean` | `false` |
| `foldButtonShow` | 是否显示折叠/展开按钮 | `boolean` | `true` |
| `foldRows` | 收起状态下保留的搜索项行数 | `number` | `2` |
| `show` | 是否显示整个搜索面板，也可以传函数动态判断 | `boolean \| (() => boolean)` | `true` |
| `text` | 搜索、重置、展开、折叠按钮文案 | `TextConfig` | - |
| `searchBtnProps` | 透传给搜索按钮的 Element Plus Button 属性 | `Record<string, any>` | - |
| `resetBtnProps` | 透传给重置按钮的 Element Plus Button 属性 | `Record<string, any>` | - |

### 响应式列

`cols` 根据窗口宽度计算当前网格列数。未配置某个断点时使用内置默认值。

| 断点 | 宽度范围 | 默认列数 |
| --- | --- | --- |
| `xs` | `< 768px` | `1` |
| `sm` | `>= 768px` 且 `< 992px` | `2` |
| `md` | `>= 992px` 且 `< 1200px` | `2` |
| `lg` | `>= 1200px` 且 `< 1920px` | `3` |
| `xl` | `>= 1920px` | `4` |

```ts
const options: MaSearchOptions = {
  cols: {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 6,
  },
}
```

### 按钮文案

按钮文案需要使用函数返回字符串。

```ts
const options: MaSearchOptions = {
  text: {
    searchBtn: () => '查询',
    resetBtn: () => '清空',
    isFoldBtn: () => '收起',
    notFoldBtn: () => '更多',
  },
}
```

### 折叠行为

组件挂载时会执行一次 `foldToggle()` 来初始化折叠状态：

- `options.fold` 省略或为 `false`：初始展开全部搜索项。
- `options.fold` 为 `true`：初始只保留 `foldRows` 行内的搜索项，其余项收起。
- `getFold()` 返回的是当前运行状态，`true` 表示展开，`false` 表示收起。

```ts
const options: MaSearchOptions = {
  fold: true,
  foldRows: 1,
}
```

## MaSearchItem

`MaSearchItem` 继承 `@mineadmin/form` 的 `MaFormItem`，所以 `label`、`prop`、`render`、`renderProps`、`renderSlots`、`itemProps`、`cols` 等能力与 MaForm 保持一致。

MaSearch 额外处理以下字段：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `hide` | 是否隐藏当前搜索项。收起/展开计算时会尊重该配置 | `boolean \| (() => boolean)` | `false` |
| `span` | 当前项在搜索网格中跨几列 | `number` | `1` |
| `offset` | 当前项左侧偏移几列 | `number` | `0` |

```ts
const searchItems: MaSearchItem[] = [
  {
    label: '关键词',
    prop: 'keyword',
    render: 'input',
    span: 2,
    renderProps: {
      clearable: true,
      placeholder: '请输入名称、编号或手机号',
    },
  },
  {
    label: '内部字段',
    prop: 'internal',
    render: 'input',
    hide: () => true,
  },
]
```

::: tip
组件内部会自动追加一个 `__MaSearchAction` 操作项，用来渲染搜索、重置和折叠按钮。搜索、重置以及 `getSearchForm()` 返回数据前都会移除这个内部字段。
:::

## 事件

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `search` | 点击搜索按钮或在输入项中按下回车后触发 | `form: Record<string, any>` |
| `reset` | 点击重置按钮后触发 | `form: Record<string, any>` |
| `fold` | 折叠状态变化后触发 | `state: boolean` |

## 插槽

| 插槽 | 说明 |
| --- | --- |
| `default` | 透传给内部 `ma-form` 的默认插槽，适合直接编写自定义表单项 |
| `actions` | 完全替换默认操作区域 |
| `beforeActions` | 插入到搜索、重置按钮之前 |
| `afterActions` | 插入到搜索、重置按钮之后 |

```vue
<template>
  <ma-search :search-items="searchItems">
    <template #beforeActions>
      <el-button>导出</el-button>
    </template>

    <template #afterActions>
      <el-button link type="primary">保存筛选</el-button>
    </template>
  </ma-search>
</template>
```

如果需要完全接管按钮区域，可以使用 `actions`：

```vue
<template>
  <ma-search ref="searchRef" :search-items="searchItems">
    <template #actions>
      <el-button type="primary" @click="searchRef?.getSearchForm()">
        自定义查询
      </el-button>
    </template>
  </ma-search>
</template>
```

## 暴露方法

| 方法 | 说明 |
| --- | --- |
| `getMaFormRef()` | 获取内部 `ma-form` 实例 |
| `foldToggle()` | 切换展开/收起状态 |
| `getFold()` | 获取当前运行状态，`true` 为展开 |
| `setSearchForm(form)` | 合并设置搜索表单；传 `null` 时清空表单对象 |
| `getSearchForm()` | 获取当前搜索表单数据 |
| `setShowState(state)` | 设置搜索面板显示状态 |
| `getShowState()` | 获取搜索面板显示状态 |
| `setOptions(options)` | 合并更新搜索面板配置，并重新初始化搜索项 |
| `getOptions()` | 获取搜索面板配置 |
| `setFormOptions(options)` | 合并更新内部 `ma-form` 配置 |
| `getFormOptions()` | 获取内部 `ma-form` 配置 |
| `setItems(items)` | 替换搜索项数组 |
| `getItems()` | 获取当前搜索项数组 |
| `appendItem(item)` | 追加一个搜索项 |
| `removeItem(prop)` | 按 `prop` 移除搜索项 |
| `getItemByProp(prop)` | 按 `prop` 获取搜索项，未找到时返回 `null` |
| `setSearchBtnProps(props)` | 合并设置搜索按钮属性 |
| `setResetBtnProps(props)` | 合并设置重置按钮属性 |

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { MaSearchExpose, MaSearchItem } from '@mineadmin/search'

const searchRef = ref<MaSearchExpose>()

const addField = () => {
  searchRef.value?.appendItem({
    label: '手机号',
    prop: 'mobile',
    render: 'input',
    renderProps: {
      clearable: true,
    },
  })
}

const disableSearch = () => {
  searchRef.value?.setSearchBtnProps({
    disabled: true,
  })
}

const setDefaultStatus = () => {
  searchRef.value?.setSearchForm({
    status: 'enabled',
  })
}

const resetModel = () => {
  searchRef.value?.setSearchForm(null)
}
</script>
```

## 类型定义

```ts
export type MediaBreakPoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface MaSearchOptions {
  defaultValue?: Record<string, any>
  cols?: Record<MediaBreakPoint, number>
  fold?: boolean
  foldButtonShow?: boolean
  foldRows?: number
  show?: boolean | (() => boolean)
  text?: {
    searchBtn?: () => string
    resetBtn?: () => string
    isFoldBtn?: () => string
    notFoldBtn?: () => string
  }
  searchBtnProps?: Record<string, any>
  resetBtnProps?: Record<string, any>
}

export interface MaSearchItem extends MaFormItem {
  hide?: boolean | (() => boolean)
  span?: number
  offset?: number
}

export interface MaSearchExpose {
  getMaFormRef: () => typeof MaForm
  foldToggle: () => void
  getFold: () => boolean
  setSearchForm: (form: null | Record<string, any>) => void
  getSearchForm: () => Record<string, any>
  setShowState: (state: boolean) => void
  getShowState: () => boolean
  setOptions: (opts: MaSearchOptions) => void
  getOptions: () => MaSearchOptions
  setFormOptions: (opts: MaFormOptions) => void
  getFormOptions: () => MaFormOptions
  setItems: (items: MaSearchItem[]) => void
  getItems: () => MaSearchItem[]
  appendItem: (item: MaSearchItem) => void
  removeItem: (prop: string) => void
  getItemByProp: (prop: string) => MaSearchItem | null
  setSearchBtnProps: (props: Record<string, any>) => void
  setResetBtnProps: (props: Record<string, any>) => void
}
```

## 使用建议

- 搜索项较多时，建议设置 `fold: true` 和 `foldRows`，让页面初始只展示高频字段。
- 列表页查询参数建议统一从 `search` 事件或 `getSearchForm()` 获取，不要直接读取内部 `ma-form` 模型。
- 复杂字段渲染优先复用 `ma-form` 的 `render`、`renderProps`、`renderSlots` 能力，MaSearch 只负责搜索面板布局和动作区域。
