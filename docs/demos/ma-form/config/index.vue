<script setup lang="tsx">
import { ref, reactive } from 'vue'
import {ElMessage} from "element-plus";

const model = ref({
  name: '萧晨',
  age: 22,
  sex: 1,
  hobby: '4',

})
const formRef = ref()

const hobby = reactive([
  { label: '唱', value: '1' },
  { label: '跳', value: '2' },
  { label: 'Rap', value: '3' },
  { label: '篮球', value: '4' },
  { label: '足球', value: '5' },
  { label: '羽毛球', value: '6' },
])

const items = ref([
  { label: '姓名', prop: 'name', render: 'input',
    cols: { span: 8 },
    itemProps: { rules: [{ required: true, message: '请输入姓名' }] }
  },
  { label: '年龄', prop: 'age', render: 'inputNumber', cols: { span: 8 } },
  { label: '性别', prop: 'sex', cols: { span: 8 },
    render: ({ formData }) => {
      return (
        <el-select v-model={formData.sex} placeholder="请选择性别">
          {[{ label: '男', value: 1 }, { label: '女', value: 2 }].map(item => {
            return <el-option label={item.label} value={item.value}></el-option>
          })}
        </el-select>
      )
    }
  },
  { label: '爱好', prop: 'hobby', render: ({ formData }) => (
      <el-radio-group>
        {hobby.map(item => {
          return <el-radio label={item.label} value={item.value}></el-radio>
        })}
      </el-radio-group>
    )
  },
  {
    label: '备注', prop: 'remark', render: 'input', renderProps: { type: 'textarea'},
    itemProps: { rules: [{ required: true, message: '请输入备注' }] }
  },
  { label: '日期', prop: 'date', render: 'datePicker', cols: { span: 12 } },
  { label: '时间', prop: 'time', render: 'timePicker', cols: { span: 12 } },
])

const options = ref({
  footerSlot: () => (
    <div class="w-full text-center">
      <el-button type="primary" onClick=
      {() => {
        formRef.value.setLoadingState(true)
        setTimeout(() => {
          formRef.value.getElFormRef().validate().then(() => {
            ElMessage.success('验证通过')
            formRef.value.setLoadingState(false)
          }).catch(() => {
            ElMessage.error('验证失败')
            formRef.value.setLoadingState(false)
          })
        }, 1000)
      }}>提交</el-button>
    </div>
  )
})
</script>

<template>
  <ma-form ref="formRef" v-model="model" :options="options" :items="items" />
</template>
