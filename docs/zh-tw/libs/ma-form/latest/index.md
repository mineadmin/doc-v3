# MaForm

`@mineadmin/form` 是基於 Vue 3、Element Plus 和 TSX 封裝的配置化表單庫。它把 `ElForm`、`ElFormItem` 和常見資料錄入元件組合成一個可透過 `items` 陣列動態渲染的表單元件，適合後臺管理系統中的新增、編輯、篩選、高階配置表單等場景。

本文按 `@mineadmin/form` 當前原始碼整理。

## 當前版本

- 文件版本：`latest`
- 原始碼版本：`1.0.57`
- 包名：`@mineadmin/form`
- 版本策略：獨立發版，不跟隨 MineAdmin 主產品大版本
- peer dependency：`element-plus`

## 安裝

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

在應用入口註冊外掛：

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

SSR 場景可以開啟延遲客戶端渲染：

```ts
app.use(MaForm, { ssr: true })
```

## 快速開始

`MaForm` 接收一個物件模型和一組表單項配置。每個 `item` 透過 `prop` 繫結模型路徑，透過 `render` 指定要渲染的 Element Plus 元件或自定義元件。

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
    username: [{ required: true, message: '請輸入使用者名稱', trigger: 'blur' }],
  },
}

const items: MaFormItem[] = [
  {
    label: '使用者名稱',
    prop: 'username',
    render: 'input',
    renderProps: {
      clearable: true,
      placeholder: '請輸入使用者名稱',
    },
    cols: { span: 12 },
  },
  {
    label: '啟用狀態',
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

`prop` 支援點路徑，內部透過 `lodash-es` 的 `get` 和 `set` 讀寫模型：

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
    label: '暱稱',
    prop: 'user.profile.nickname',
    render: 'input',
  },
]
```

## Props

| 引數 | 說明 | 型別 | 預設值 |
|------|------|------|--------|
| `v-model` / `modelValue` | 表單資料模型，支援物件與巢狀路徑 | `MaModel` | `{}` |
| `options` | 表單配置，包含 Element Plus `ElForm` 屬性和 MaForm 擴充套件屬性 | `MaFormOptions` | `{}` |
| `items` | 表單項配置陣列 | `MaFormItem[]` | `[]` |

## MaFormOptions

`MaFormOptions` 繼承了 Element Plus Form 的常用配置，並額外提供載入態、佈局和頁尾渲染能力。

| 引數 | 說明 | 型別 |
|------|------|------|
| `rules` | 表單驗證規則，對應 `ElForm` 的 `rules` | `FormRules` |
| `inline` | 是否使用行內表單模式 | `boolean` |
| `labelPosition` | 標籤位置 | `'left' \| 'right' \| 'top'` |
| `labelWidth` | 標籤寬度 | `string \| number` |
| `labelSuffix` | 標籤字尾 | `string` |
| `hideRequiredAsterisk` | 是否隱藏必填星號 | `boolean` |
| `showMessage` | 是否顯示校驗錯誤資訊 | `boolean` |
| `inlineMessage` | 是否以行內形式展示校驗資訊 | `boolean` |
| `statusIcon` | 是否顯示校驗反饋圖示 | `boolean` |
| `validateOnRuleChange` | `rules` 改變後是否立即驗證 | `boolean` |
| `size` | 表單內元件尺寸 | `'' \| 'large' \| 'default' \| 'small'` |
| `disabled` | 是否停用表單內所有元件 | `boolean` |
| `scrollToError` | 校驗失敗時是否滾動到第一個錯誤項 | `boolean` |
| `scrollIntoViewOptions` | 滾動到錯誤項時的 `scrollIntoView` 配置 | `Record<string, any> \| boolean` |
| `onValidate` | 任一表單項完成校驗後的回撥 | `(prop, isValid, message) => void` |
| `loading` | 是否顯示容器載入態 | `boolean` |
| `loadingConfig` | 載入態配置 | `LoadingConfig` |
| `containerClass` | 表單外層容器 class | `string` |
| `layout` | 佈局模式，未設定時按 `flex` 處理 | `'flex' \| 'grid'` |
| `flex` | `flex` 佈局引數，透傳給 `el-row` | `object` |
| `grid` | `grid` 佈局引數，實際透傳給 `el-space` | `object` |
| `footerSlot` | 使用 TSX/JSX 配置頁尾內容 | `() => any` |

### LoadingConfig

| 引數 | 說明 | 型別 |
|------|------|------|
| `text` | 載入文案 | `string` |
| `spinner` | 自定義載入圖示 class | `string` |
| `svg` | 自定義 SVG 載入圖示 | `string` |
| `viewBox` | 自定義 SVG 的 viewBox | `string` |
| `background` | 背景遮罩顏色 | `string` |
| `customClass` | 自定義載入層 class | `string` |

## 佈局

預設佈局是 `flex`，每個表單項會包裹在 `el-col` 中，`item.cols` 透傳給 `el-col`。

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
  { label: '手機', prop: 'mobile', render: 'input', cols: { xs: 24, sm: 12 } },
]
```

`grid` 佈局使用 `el-space` 渲染表單項，適合固定間距、自動換行或縱向排列的場景。

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

| 引數 | 說明 | 型別 |
|------|------|------|
| `label` | 表單項標籤 | `string \| (() => string)` |
| `prop` | 模型欄位路徑，使用校驗、重置等能力時建議必填 | `string \| (() => string)` |
| `hide` | 是否隱藏該項，隱藏後保留資料與元件例項 | `boolean \| state` |
| `show` | 是否渲染該項，不渲染時不會輸出表單項 | `boolean \| state` |
| `cols` | `flex` 佈局下的 `el-col` 引數 | `object` |
| `itemProps` | `ElFormItem` 屬性，已移除 `label` 和 `prop` | `FormItem` |
| `itemSlots` | `ElFormItem` 插槽配置 | `object` |
| `render` | 字串元件名、自定義渲染函式、元件或 VNode | `renderType` |
| `renderProps` | 渲染元件的 props | `Record<string, any>` |
| `renderSlots` | 渲染元件的插槽 | `Record<string, renderSlotType>` |
| `children` | 子表單項配置 | `MaFormItem[]` |

`hide` 和 `show` 都可以接收函式，函式引數是當前表單項和整個表單模型：

```ts
const items: MaFormItem[] = [
  {
    label: '賬號型別',
    prop: 'type',
    render: 'select',
  },
  {
    label: '企業名稱',
    prop: 'companyName',
    render: 'input',
    show: (_item, model) => model.type === 'company',
  },
  {
    label: '內部備註',
    prop: 'remark',
    render: 'input',
    hide: (_item, model) => model.type !== 'internal',
  },
]
```

### itemProps 與輔助說明

`itemProps` 會透傳給 `ElFormItem`，並額外支援 `help` 和 `extra` 文案。

```ts
const items: MaFormItem[] = [
  {
    label: '郵箱',
    prop: 'email',
    render: 'input',
    itemProps: {
      rules: [
        { required: true, message: '請輸入郵箱', trigger: 'blur' },
        { type: 'email', message: '郵箱格式不正確', trigger: 'blur' },
      ],
      help: '用於接收系統通知',
      extra: '請使用常用郵箱',
    },
  },
]
```

`itemSlots` 可以覆蓋表單項的 `default`、`label`、`error`、`help` 和 `extra`。

```tsx
const items: MaFormItem[] = [
  {
    prop: 'password',
    render: 'input',
    renderProps: { type: 'password', showPassword: true },
    itemSlots: {
      label: () => <span style="color: #409eff">登入密碼</span>,
      help: () => <span>至少 8 位，建議包含數字和字母</span>,
    },
  },
]
```

## 渲染元件

當 `render` 是字串時，MaForm 會把首字母轉成大寫後到內建元件對映中查詢 Element Plus 元件。

| render 值 | Element Plus 元件 |
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
`ComponentName` 型別中保留了 `Upload`，但當前內建 `componentMap` 未註冊上傳元件。上傳類場景建議使用自定義渲染函式。
:::

### renderProps

`renderProps` 會傳給實際渲染的元件，MaForm 會自動補上 `modelValue` 和 `onUpdate:modelValue`。

```ts
const items: MaFormItem[] = [
  {
    label: '標題',
    prop: 'title',
    render: 'input',
    renderProps: {
      maxlength: 60,
      showWordLimit: true,
      placeholder: '請輸入標題',
    },
  },
]
```

### renderSlots

元件插槽透過 `renderSlots` 配置。適合給 `select`、`treeSelect` 等元件補充子節點。

```tsx
import { ElOption } from 'element-plus'

const items: MaFormItem[] = [
  {
    label: '狀態',
    prop: 'status',
    render: 'select',
    renderProps: {
      clearable: true,
      placeholder: '請選擇狀態',
    },
    renderSlots: {
      default: () => [
        <ElOption label="啟用" value="enabled" />,
        <ElOption label="停用" value="disabled" />,
      ],
    },
  },
]
```

### 自定義渲染

`render` 也可以傳函式，函式會收到當前 `item` 和完整 `formData`。

```tsx
import { ElInput, ElTag } from 'element-plus'

const items: MaFormItem[] = [
  {
    label: '邀請碼',
    prop: 'inviteCode',
    render: ({ formData }) => (
      <ElInput placeholder="請輸入邀請碼">
        {{
          append: () => formData.inviteCode ? <ElTag type="success">已填寫</ElTag> : '待填寫',
        }}
      </ElInput>
    ),
  },
]
```

### 接入 Table 元件

`@mineadmin/form` 當前原始碼沒有在內建 `componentMap` 中註冊 `table`，因此不能透過 `render: 'table'` 直接渲染表格。需要在應用裡額外安裝並登錄檔格元件，然後透過自定義渲染把 `MaTable`、`ElTable` 或業務表格元件放進表單項。

如果使用 `@mineadmin/table` 的 `MaTable`，需要先在入口完成註冊；如果使用 Element Plus 的 `ElTable`，已隨 `ElementPlus` 註冊：

```ts
import MaForm from '@mineadmin/form'
import MaTable from '@mineadmin/table'

app.use(MaForm)
app.use(MaTable)
```

表格元件通常不使用 `v-model`，需要顯式把表單模型裡的陣列傳給表格。單元格編輯、增刪行等操作直接修改這個陣列即可，最終提交時仍然從 `ma-form` 的 `v-model` 中讀取完整資料。對於表格這類不需要 MaForm 自動注入 `modelValue` 的元件，推薦使用 `itemSlots.default` 填充表單項內容。

<DemoPreview dir="demos/ma-form/table-in-form" title="表格明細表單" description="在 MaForm 中透過 itemSlots.default 接入 ElTable，並把明細行儲存到表單模型。" />

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
    { name: 'MineAdmin 專業版', quantity: 1, price: 2999 },
  ],
})

const rows = computed<ProductRow[]>(() => model.value.products ?? [])

const addRow = () => {
  rows.value.push({ name: '', quantity: 1, price: 0 })
}

const items: MaFormItem[] = [
  {
    label: '商品明細',
    prop: 'products',
    cols: { span: 24 },
    itemProps: {
      help: '表格資料會儲存在 model.products 中，可隨表單一起校驗和提交。',
    },
    itemSlots: {
      default: () => {
        return (
          <div style="width: 100%">
            <ElTable data={rows.value} border stripe style={{ width: '100%' }}>
              <ElTableColumn label="商品名稱" minWidth={180}>
                {{
                  default: ({ row }: { row: ProductRow }) => (
                    <ElInput
                      modelValue={row.name}
                      placeholder="請輸入商品名稱"
                      onUpdate:modelValue={value => row.name = String(value ?? '')}
                    />
                  ),
                }}
              </ElTableColumn>
              <ElTableColumn label="數量" width={150}>
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
              <ElTableColumn label="單價" width={160}>
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

如果你希望完全透過 `render` 維護表格，也可以在 `render` 函式中返回一個表格容器元件，並由該元件內部管理 `MaTable` 的 `data`、`columns` 和行編輯邏輯。

:::tip
`MaForm` 會把 `modelValue` 和 `onUpdate:modelValue` 注入給最終渲染元件，但表格類元件更常見的是 `data`、`columns`、`options` 這類屬性。接入這類元件時，以表單模型中的陣列作為資料來源會更直觀，也能避免誤以為 `render: 'table'` 是內建能力。
:::

## 巢狀表單項

`children` 會在當前渲染元件的預設插槽內繼續渲染一組子表單項，適合把一組欄位包進卡片、摺疊面板或自定義容器中。

```tsx
const items: MaFormItem[] = [
  {
    prop: 'profile',
    render: () => <div class="profile-panel" />,
    children: [
      { label: '姓名', prop: 'profile.name', render: 'input' },
      { label: '職位', prop: 'profile.title', render: 'input' },
    ],
  },
]
```

## 頁尾

可以使用元件插槽寫頁尾，也可以用 `options.footerSlot` 在配置中宣告。

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

模板插槽寫法：

```vue
<template>
  <ma-form v-model="model" :options="options" :items="items">
    <template #footer>
      <el-button>取消</el-button>
      <el-button type="primary">儲存</el-button>
    </template>
  </ma-form>
</template>
```

## 暴露方法

透過元件 `ref` 可以訪問 MaForm 暴露的方法。常用方式是使用 `useForm(refName)`，也可以直接使用 Vue 的模板 ref。

| 方法 | 說明 |
|------|------|
| `setLoadingState(loading)` | 設定 `options.loading` |
| `setOptions(options)` | 合併更新表單配置 |
| `getOptions()` | 獲取當前表單配置 |
| `setItems(items)` | 替換表單項陣列 |
| `getItems()` | 獲取當前表單項陣列 |
| `appendItem(item)` | 追加一個表單項 |
| `getItemByProp(prop)` | 按 `prop` 查詢表單項，執行時找不到返回 `null` |
| `getElFormRef()` | 獲取底層 Element Plus `ElForm` 例項 |

當前原始碼還在執行時暴露了 `removeItem(prop)` 和 `isMobileState()`；如果在 TypeScript 中使用並遇到型別提示缺失，可以按專案需要擴充套件本地型別。

## useForm

`useForm(refName)` 會在元件掛載後按字串 ref 查詢 MaForm 例項，並返回一個 Promise。

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
    { label: '使用者名稱', prop: 'username', render: 'input' },
  ])
})
</script>

<template>
  <ma-form ref="userForm" v-model="model" :items="items" />
</template>
```

:::warning
`useForm` 內部依賴 `getCurrentInstance()` 和 `onMounted()`，需要在元件 `setup` 階段呼叫。
:::

## 型別匯出

`@mineadmin/form` 匯出了常用型別，便於在業務專案中約束配置。

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

## 與 Element Plus 的關係

MaForm 不重新實現表單校驗和表單項能力，而是把配置透傳到 Element Plus：

- 表單級配置透過 `options` 傳給 `ElForm`
- 表單項級配置透過 `item.itemProps` 傳給 `ElFormItem`
- 元件級配置透過 `item.renderProps` 傳給最終渲染元件
- 校驗、重置、清除校驗等操作透過 `getElFormRef()` 呼叫 Element Plus Form 例項方法

```ts
useForm('userForm').then(async (form) => {
  const elForm = form.getElFormRef()
  await elForm.validate()
  elForm.resetFields()
})
```
