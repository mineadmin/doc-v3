# MaForm

与 `2.0` 相比，`3.0` 的更加自由高效，几乎接近原生写法，同时配合 `tsx` 或 `jsx` 语法，事半功倍。

## 开始

### useForm 方式 

<div class="mt-5 shadow-lg">
    <ma-form ref="form" :items="[
    { label: '用户名', prop: 'username', render: 'input' },
    { label: '昵称', prop: 'nickname', render: 'input' },
    ]" />
</div>

::: details 查看代码
```vue
<script setup lang="tsx">
import { type MaFormExpose, useForm } from '@mineadmin/form'

useForm('form').then((form: MaFormExpose) => {
  form.setItems([
    { label: '用户名', prop: 'username', render: 'input' },
    { label: '昵称', prop: 'nickname', render: 'input' },
  ])
})
</script>

<template>
  <ma-form ref="form" />
</template>
```
:::

### 传统方式
<div style="margin-top: 20px;">
    <ma-form ref="form" :items="[
    { label: '用户名', prop: 'username', render: 'input' },
    { label: '昵称', prop: 'nickname', render: 'input' },
    ]" />
</div>

::: details 查看代码
```vue
<script setup lang="tsx">
import { type MaFormExpose, useForm } from '@mineadmin/form'

const form = ref<MaFormExpose>()
const items = reactive([
  { label: '用户名', prop: 'username', render: 'input' },
  { label: '昵称', prop: 'nickname', render: 'input' },
])
</script>

<template>
  <ma-form ref="form" :items="items" />
</template>
```
:::