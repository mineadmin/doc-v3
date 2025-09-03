<script setup lang="tsx">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type {MaFormExpose} from "@mineadmin/form";

// 表单数据模型 - 展示不同数据类型的基础用法
const formData = ref({
  // 文本输入
  username: 'MineAdmin',
  email: 'admin@mineadmin.com',
  
  // 数字输入
  age: 25,
  score: 85.5,
  
  // 选择器
  gender: 'male',
  department: 'tech',
  
  // 多选
  hobbies: ['reading', 'coding'],
  
  // 开关和复选框
  isActive: true,
  agreeTerms: false,
  
  // 日期时间
  birthday: '',
  workTime: '',
  
  // 文本域
  description: '这是一个基础表单示例，展示了各种常用的输入组件类型。',
  
  // 滑块和评分
  satisfaction: 4,
  rating: 3
})

const formRef = ref<MaFormExpose>()

// 表单项配置 - 展示各种基础组件的使用
const formItems = ref([
  {
    label: '用户名',
    prop: 'username',
    render: 'input',
    renderProps: {
      placeholder: '请输入用户名',
      clearable: true
    },
    itemProps: {
      rules: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
      ]
    },
    cols: { span: 12 }
  },
  {
    label: '邮箱',
    prop: 'email',
    render: 'input',
    renderProps: {
      type: 'email',
      placeholder: '请输入邮箱地址',
      clearable: true
    },
    itemProps: {
      rules: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
      ]
    },
    cols: { span: 12 }
  },
  {
    label: '年龄',
    prop: 'age',
    render: 'inputNumber',
    renderProps: {
      min: 1,
      max: 100,
      step: 1,
      placeholder: '请输入年龄'
    },
    cols: { span: 8 }
  },
  {
    label: '评分',
    prop: 'score',
    render: 'inputNumber',
    renderProps: {
      min: 0,
      max: 100,
      step: 0.1,
      precision: 1,
      placeholder: '请输入评分'
    },
    cols: { span: 8 }
  },
  {
    label: '性别',
    prop: 'gender',
    render: 'select',
    renderProps: {
      placeholder: '请选择性别',
      clearable: true,
      options:[
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
        { label: '其他', value: 'other' }
      ]
    },
    cols: { span: 8 }
  },
  {
    label: '部门',
    prop: 'department',
    render: 'select',
    renderProps: {
      placeholder: '请选择部门',
      clearable: true,
      options: [
        { label: '技术部', value: 'tech' },
        { label: '产品部', value: 'product' },
        { label: '运营部', value: 'operation' },
        { label: '人力资源部', value: 'hr' }
      ]
    },
    cols: { span: 12 }
  },
  {
    label: '爱好',
    prop: 'hobbies',
    render: () => {
      return (
          <el-checkbox-group>
          {[
                { label: '阅读', value: 'reading' },
          { label: '编程', value: 'coding' },
          { label: '运动', value: 'sports' },
          { label: '音乐', value: 'music' },
          { label: '旅行', value: 'travel' },
          { label: '摄影', value: 'photography' }
        ].map((item) => (
              <el-checkbox key={item.value} label={item.value}>
              {item.label}
              </el-checkbox>
        ))}
          </el-checkbox-group>
        )
    },
    cols: { span: 12 }
  },
  {
    label: '是否激活',
    prop: 'isActive',
    render: 'switch',
    renderProps: {
      'active-text': '开启',
      'inactive-text': '关闭'
    },
    cols: { span: 8 }
  },
  {
    label: '同意条款',
    prop: 'agreeTerms',
    render: () => <el-checkbox />,
    renderProps: {
      label: '我已阅读并同意用户协议'
    },
    cols: { span: 8 }
  },
  {
    label: '出生日期',
    prop: 'birthday',
    render: 'datePicker',
    renderProps: {
      type: 'date',
      placeholder: '请选择出生日期',
      format: 'YYYY-MM-DD',
      'value-format': 'YYYY-MM-DD'
    },
    cols: { span: 8 }
  },
  {
    label: '工作时间',
    prop: 'workTime',
    render: 'timePicker',
    renderProps: {
      placeholder: '请选择工作时间',
      format: 'HH:mm:ss',
      'value-format': 'HH:mm:ss'
    },
    cols: { span: 8 }
  },
  {
    label: '满意度',
    prop: 'satisfaction',
    render: 'slider',
    renderProps: {
      min: 1,
      max: 5,
      'show-tooltip': true,
      'format-tooltip': (value: number) => `${value} 星`
    },
    cols: { span: 8 }
  },
  {
    label: '综合评价',
    prop: 'rating',
    render: 'rate',
    renderProps: {
      'show-text': true,
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
      texts: ['极差', '失望', '一般', '满意', '惊喜']
    },
    cols: { span: 8 }
  },
  {
    label: '详细描述',
    prop: 'description',
    render: 'input',
    renderProps: {
      type: 'textarea',
      placeholder: '请输入详细描述',
      rows: 4,
      'show-word-limit': true,
      maxlength: 500
    },
    cols: { span: 24 }
  }
])

// 表单选项配置
const formOptions = ref({
  // Element Plus 原生属性
  labelWidth: '120px',
  labelPosition: 'right',
  size: 'default'
})

// 提交处理
const handleSubmit = async () => {
  try {
    formRef.value?.setLoadingState(true)
    
    // 模拟异步提交
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 表单验证
    const isValid = await formRef.value?.getElFormRef()?.validate()
    
    if (isValid) {
      ElMessage.success({
        message: '提交成功！',
        duration: 2000
      })
      console.log('表单数据:', formData.value)
    }
  } catch (error) {
    ElMessage.error('表单验证失败，请检查输入内容')
  } finally {
    formRef.value?.setLoadingState(false)
  }
}

// 重置表单
const handleReset = () => {
  formRef.value?.getElFormRef()?.resetFields()
  ElMessage.info('表单已重置')
}

// 清空表单
const handleClear = () => {
  formRef.value?.getElFormRef()?.clearValidate()
  // 清空所有字段值
  Object.keys(formData.value).forEach(key => {
    if (Array.isArray(formData.value[key as keyof typeof formData.value])) {
      (formData.value[key as keyof typeof formData.value] as any[]) = []
    } else if (typeof formData.value[key as keyof typeof formData.value] === 'boolean') {
      (formData.value[key as keyof typeof formData.value] as boolean) = false
    } else if (typeof formData.value[key as keyof typeof formData.value] === 'number') {
      (formData.value[key as keyof typeof formData.value] as number) = 0
    } else {
      (formData.value[key as keyof typeof formData.value] as string) = ''
    }
  })
  ElMessage.info('表单已清空')
}
</script>

<template>
  <div class="basic-usage-demo">
    <!-- 演示说明 -->
    <div class="demo-description">
      <h3>基础用法演示</h3>
      <p>展示 MaForm 支持的各种基础输入组件类型，包括文本输入、数字输入、选择器、日期时间、开关等。</p>
      <div class="demo-features">
        <el-tag type="info" size="small">文本输入</el-tag>
        <el-tag type="success" size="small">数字输入</el-tag>
        <el-tag type="warning" size="small">选择器</el-tag>
        <el-tag type="danger" size="small">日期时间</el-tag>
        <el-tag size="small">开关组件</el-tag>
        <el-tag type="info" size="small">评分滑块</el-tag>
      </div>
    </div>

    <!-- MaForm 表单 -->
    <ma-form 
      ref="formRef"
      v-model="formData" 
      :options="formOptions"
      :items="formItems"
    >
      <!-- 自定义底部操作栏 -->
      <template #footer>
        <div class="form-footer">
          <el-button @click="handleReset">重置</el-button>
          <el-button @click="handleClear">清空</el-button>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </div>
      </template>
    </ma-form>

    <!-- 数据展示 -->
    <div class="data-display">
      <h4>当前表单数据：</h4>
      <pre class="data-json">{{ JSON.stringify(formData, null, 2) }}</pre>
    </div>
  </div>
</template>

<style scoped>
.basic-usage-demo {

}

.demo-description {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.demo-description h3 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 16px;
}

.demo-description p {
  margin: 0 0 12px 0;
  color: #606266;
  font-size: 14px;
}

.demo-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.form-footer {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px 0;
}

.data-display {
  margin-top: 24px;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border-left: 4px solid #409EFF;
}

.data-display h4 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 14px;
}

.data-json {
  background-color: #f4f4f5;
  padding: 12px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.5;
  color: #606266;
  overflow-x: auto;
  white-space: pre-wrap;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .demo-features {
    justify-content: center;
  }
  
  .form-footer {
    flex-direction: column;
    align-items: center;
  }
  
  .data-json {
    font-size: 11px;
  }
}
</style>