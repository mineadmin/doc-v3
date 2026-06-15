<script setup lang="tsx">
import { ref } from 'vue'
import { ElButton, ElMessage, ElOption } from 'element-plus'
import type { MaFormExpose, MaFormItem, MaFormOptions, MaModel } from '@mineadmin/form'

const formRef = ref<MaFormExpose>()

const model = ref<MaModel>({
  username: '',
  role: '',
  profile: {
    email: '',
  },
  enabled: true,
  remark: '',
})

const options: MaFormOptions = {
  labelWidth: '96px',
  rules: {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    role: [{ required: true, message: '请选择角色', trigger: 'change' }],
    'profile.email': [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
    ],
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
    cols: { xs: 24, sm: 12 },
  },
  {
    label: '角色',
    prop: 'role',
    render: 'select',
    renderProps: {
      clearable: true,
      placeholder: '请选择角色',
      style: { width: '100%' },
    },
    renderSlots: {
      default: () => [
        <ElOption label="管理员" value="admin" />,
        <ElOption label="运营人员" value="operator" />,
        <ElOption label="访客" value="guest" />,
      ],
    },
    cols: { xs: 24, sm: 12 },
  },
  {
    label: '邮箱',
    prop: 'profile.email',
    render: 'input',
    renderProps: {
      clearable: true,
      placeholder: '请输入邮箱',
    },
    itemProps: {
      help: '支持通过点路径绑定嵌套字段。',
    },
    cols: { xs: 24, sm: 12 },
  },
  {
    label: '启用',
    prop: 'enabled',
    render: 'switch',
    cols: { xs: 24, sm: 12 },
  },
  {
    label: '备注',
    prop: 'remark',
    render: 'input',
    renderProps: {
      type: 'textarea',
      rows: 3,
      maxlength: 120,
      showWordLimit: true,
      placeholder: '请输入备注',
    },
    cols: { span: 24 },
  },
]

const submit = async () => {
  try {
    await formRef.value?.getElFormRef()?.validate()
    ElMessage.success('校验通过')
  } catch {
    ElMessage.warning('请完善表单内容')
  }
}

const reset = () => {
  formRef.value?.getElFormRef()?.resetFields()
}

const fillDemoData = () => {
  model.value.username = 'mineadmin'
  model.value.role = 'admin'
  model.value.profile.email = 'mineadmin@example.com'
  model.value.enabled = true
  model.value.remark = '这是一条由 MaForm 配置项驱动的表单示例。'
}
</script>

<template>
  <div class="ma-form-demo">
    <ma-form
      ref="formRef"
      v-model="model"
      :options="options"
      :items="items"
    >
      <template #footer>
        <div class="ma-form-demo__footer">
          <el-button type="primary" @click="submit">提交校验</el-button>
          <el-button @click="reset">重置</el-button>
          <el-button text type="primary" @click="fillDemoData">填充示例数据</el-button>
        </div>
      </template>
    </ma-form>
  </div>
</template>

<style scoped>
.ma-form-demo {
  width: 100%;
}

.ma-form-demo__footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 8px;
}
</style>
