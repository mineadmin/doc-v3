<script setup lang="ts">
import { ref, reactive } from 'vue'
import {ElMessage} from "element-plus";

const model = ref({
  name: '张三',
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

const submit = async () => {
  formRef.value.setLoadingState(true)
  setTimeout(() => {
    ElMessage.success('提交的数据：' + JSON.stringify(model.value))
    formRef.value.setLoadingState(false)
  }, 1000)
}
</script>

<template>
  <ma-form ref="formRef" v-model="model">
    <el-form-item label="姓名" prop="name">
      <el-input v-model="model.name" />
    </el-form-item>
    <el-form-item label="年龄" prop="age">
      <el-input-number v-model="model.age" />
    </el-form-item>
    <el-form-item label="性别" prop="sex">
      <el-select v-model="model.sex">
        <el-option label="男" :value="1" />
        <el-option label="女" :value="2" />
      </el-select>
    </el-form-item>
    <el-form-item label="爱好" prop="hobby">
      <el-radio-group v-model="model.hobby">
        <el-radio v-for="item in hobby" :label="item.label" :value="item.label" />
      </el-radio-group>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="model.remark" type="textarea" />
    </el-form-item>

    <template #footer>
      <div class="w-full text-center">
        <el-button @click="submit">提交</el-button>
      </div>
    </template>
  </ma-form>
</template>
