<script setup lang="tsx">
import { ref, reactive } from 'vue'
import {ElButton, ElMessage} from "element-plus";

const model = ref({
  name: '萧晨',
})
const formRef = ref()
const buttonRef = ref()
const inputRef = ref()
const inputItemRef = ref()

const items = ref([
  {
    label: '姓名', prop: 'name', render: 'input',
    renderProps: {
      // props 里获取 ref
      ref: (el: any, itemRef: any) => {
        inputRef.value = el
        inputItemRef.value = itemRef
      },
    },
    cols: { span: 8 },
  },
  {
    label: '', prop: 'name',
    renderProps: {
      // props 里获取 ref
      ref: (el: any) => buttonRef.value = el,
    },
    render: () => <el-button onClick={() => {
      ElMessage.success(`
      buttonRef: ${JSON.stringify(buttonRef.value)}
      inputRef: ${JSON.stringify(inputRef.value)}
      inputItemRef: ${JSON.stringify(inputItemRef.value)}
      `)
    }}>获取 input 和 button 的 Ref</el-button>,
    cols: { span: 8 },
  },
])
</script>

<template>
  <ma-form ref="formRef" v-model="model" :items="items" />
</template>
