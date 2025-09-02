<script setup lang="tsx">
import {ref, computed, h} from 'vue'
import { ElMessage } from 'element-plus'
import type { MaFormItem, MaFormOptions } from '@mineadmin/components'

// 表单数据
const formData = ref({
  // 个人信息
  fullName: '张三',
  email: 'zhangsan@example.com',
  phone: '13800138000',
  age: 28,
  
  // 地址信息
  country: 'china',
  province: 'beijing',
  city: 'beijing',
  address: '朝阳区建国路88号',
  
  // 职业信息
  company: 'MineAdmin',
  position: 'Frontend Developer',
  salary: 15000,
  experience: 3,
  
  // 其他信息
  hobbies: ['reading', 'coding'],
  isActive: true,
  description: '这是一个展示不同布局系统的示例表单。'
})

const formRef = ref()

// 当前布局模式
const layoutMode = ref<'flex' | 'grid'>('flex')
const screenSize = ref('lg') // xs, sm, md, lg, xl

// 基础表单项配置
const baseFormItems: MaFormItem[] = [
  {
    label: '姓名',
    prop: 'fullName',
    render: 'input',
    renderProps: { placeholder: '请输入姓名', clearable: true },
    itemProps: { rules: [{ required: true, message: '请输入姓名' }] }
  },
  {
    label: '邮箱',
    prop: 'email',
    render: 'input',
    renderProps: { type: 'email', placeholder: '请输入邮箱', clearable: true },
    itemProps: { rules: [{ type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }] }
  },
  {
    label: '手机号',
    prop: 'phone',
    render: 'input',
    renderProps: { placeholder: '请输入手机号', clearable: true }
  },
  {
    label: '年龄',
    prop: 'age',
    render: 'inputNumber',
    renderProps: { min: 1, max: 100, placeholder: '请输入年龄' }
  },
  {
    label: '国家',
    prop: 'country',
    render: 'select',
    renderProps: {
      options: [
        { label: '中国', value: 'china' },
        { label: '美国', value: 'usa' },
        { label: '日本', value: 'japan' },
        { label: '韩国', value: 'korea' }
      ],
      placeholder: '请选择国家'
    },
  },
  {
    label: '省份',
    prop: 'province',
    render: 'select',
    renderProps: {
      options: [
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '广东', value: 'guangdong' },
        { label: '江苏', value: 'jiangsu' }
      ],
      placeholder: '请选择省份'
    },
  },
  {
    label: '城市',
    prop: 'city',
    render: 'select',
    renderProps: {
      options: [
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '深圳', value: 'shenzhen' },
        { label: '杭州', value: 'hangzhou' }
      ],
      placeholder: '请选择城市'
    },
  },
  {
    label: '详细地址',
    prop: 'address',
    render: 'input',
    renderProps: { placeholder: '请输入详细地址', clearable: true }
  },
  {
    label: '公司',
    prop: 'company',
    render: 'input',
    renderProps: { placeholder: '请输入公司名称', clearable: true }
  },
  {
    label: '职位',
    prop: 'position',
    render: 'input',
    renderProps: { placeholder: '请输入职位', clearable: true }
  },
  {
    label: '薪资',
    prop: 'salary',
    render: 'inputNumber',
    renderProps: { 
      min: 0, 
      step: 1000,
      placeholder: '请输入薪资',
      formatter: (value: number) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      parser: (value: string) => parseInt(value.replace(/[^\d]/g, ''))
    }
  },
  {
    label: '工作经验',
    prop: 'experience',
    render: 'slider',
    renderProps: {
      min: 0,
      max: 10,
      'show-tooltip': true,
      'format-tooltip': (value: number) => `${value} 年`
    }
  },
  {
    label: '兴趣爱好',
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
  },
  {
    label: '状态',
    prop: 'isActive',
    render: 'switch',
    renderProps: {
      'active-text': '激活',
      'inactive-text': '未激活'
    }
  },
  {
    label: '个人描述',
    prop: 'description',
    render: 'input',
    renderProps: {
      type: 'textarea',
      placeholder: '请输入个人描述',
      rows: 3,
      'show-word-limit': true,
      maxlength: 200
    }
  }
]

// 响应式栅格配置映射
const responsiveColsMap = {
  xs: { // 手机 < 576px
    fullName: { span: 24 },
    email: { span: 24 },
    phone: { span: 24 },
    age: { span: 24 },
    country: { span: 24 },
    province: { span: 24 },
    city: { span: 24 },
    address: { span: 24 },
    company: { span: 24 },
    position: { span: 24 },
    salary: { span: 24 },
    experience: { span: 24 },
    hobbies: { span: 24 },
    isActive: { span: 24 },
    description: { span: 24 }
  },
  sm: { // 平板 >= 576px
    fullName: { span: 12 },
    email: { span: 12 },
    phone: { span: 12 },
    age: { span: 12 },
    country: { span: 8 },
    province: { span: 8 },
    city: { span: 8 },
    address: { span: 24 },
    company: { span: 12 },
    position: { span: 12 },
    salary: { span: 12 },
    experience: { span: 12 },
    hobbies: { span: 24 },
    isActive: { span: 12 },
    description: { span: 24 }
  },
  md: { // 小屏桌面 >= 768px
    fullName: { span: 8 },
    email: { span: 8 },
    phone: { span: 8 },
    age: { span: 6 },
    country: { span: 6 },
    province: { span: 6 },
    city: { span: 6 },
    address: { span: 12 },
    company: { span: 8 },
    position: { span: 8 },
    salary: { span: 8 },
    experience: { span: 12 },
    hobbies: { span: 12 },
    isActive: { span: 6 },
    description: { span: 24 }
  },
  lg: { // 中屏桌面 >= 992px
    fullName: { span: 6 },
    email: { span: 6 },
    phone: { span: 6 },
    age: { span: 6 },
    country: { span: 6 },
    province: { span: 6 },
    city: { span: 6 },
    address: { span: 6 },
    company: { span: 6 },
    position: { span: 6 },
    salary: { span: 6 },
    experience: { span: 6 },
    hobbies: { span: 12 },
    isActive: { span: 6 },
    description: { span: 24 }
  },
  xl: { // 大屏桌面 >= 1200px
    fullName: { span: 4 },
    email: { span: 4 },
    phone: { span: 4 },
    age: { span: 4 },
    country: { span: 4 },
    province: { span: 4 },
    city: { span: 4 },
    address: { span: 4 },
    company: { span: 4 },
    position: { span: 4 },
    salary: { span: 4 },
    experience: { span: 4 },
    hobbies: { span: 12 },
    isActive: { span: 4 },
    description: { span: 24 }
  }
}

// 计算当前表单项配置
const formItems = computed(() => {
  const cols = responsiveColsMap[screenSize.value as keyof typeof responsiveColsMap]
  
  return baseFormItems.map(item => ({
    ...item,
    cols: cols[item.prop as keyof typeof cols]
  }))
})

// Flex 布局配置
const flexOptions = computed<MaFormOptions>(() => ({
  labelWidth: '100px',
  labelPosition: 'right',
  size: 'default',
  
  // Flex 布局特定配置
  layout: 'flex',
  gutter: layoutMode.value === 'flex' ? 20 : 0,
  justify: 'start',
  align: 'top',
  
  // 响应式配置
  responsive: true,
  mobileBreakpoint: 768,
  responsiveConfig: {
    enabled: true,
    mobileSingleColumn: screenSize.value === 'xs',
    mobileHideLabels: false,
    breakpoints: {
      xs: 576,
      sm: 768,
      md: 992,
      lg: 1200,
      xl: 1920
    }
  }
}))

// Grid 布局配置
const gridOptions = computed<MaFormOptions>(() => ({
  labelWidth: '100px',
  labelPosition: 'right',
  size: 'default',
  
  // Grid 布局特定配置
  layout: 'grid',
  grid: {
    direction: 'horizontal',
    size: 'medium',
    wrap: true,
    fill: true,
    fillRatio: 30,
    alignment: 'start'
  },
  
  // 响应式配置
  responsive: true,
  mobileBreakpoint: 768
}))

// 当前表单配置
const currentOptions = computed(() => {
  return layoutMode.value === 'flex' ? flexOptions.value : gridOptions.value
})

// 切换布局模式
const switchLayoutMode = (mode: 'flex' | 'grid') => {
  layoutMode.value = mode
  ElMessage.info(`已切换到 ${mode === 'flex' ? 'Flex' : 'Grid'} 布局`)
}

// 切换屏幕尺寸
const switchScreenSize = (size: string) => {
  screenSize.value = size
  ElMessage.info(`已切换到 ${size.toUpperCase()} 屏幕尺寸`)
}

// 表单提交
const handleSubmit = async () => {
  try {
    formRef.value?.setLoadingState(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const isValid = await formRef.value?.getElFormRef()?.validate()
    if (isValid) {
      ElMessage.success('提交成功！')
      console.log('表单数据:', formData.value)
    }
  } catch (error) {
    ElMessage.error('表单验证失败')
  } finally {
    formRef.value?.setLoadingState(false)
  }
}

// 重置表单
const handleReset = () => {
  formRef.value?.getElFormRef()?.resetFields()
  ElMessage.info('表单已重置')
}
const activeCollapse = ref(['config'])
</script>

<template>
  <div class="layout-systems-demo">
    <!-- 控制面板 -->
    <div class="demo-controls">
      <div class="control-section">
        <h4>布局模式</h4>
        <el-radio-group v-model="layoutMode" @change="switchLayoutMode">
          <el-radio-button value="flex">Flex 布局</el-radio-button>
          <el-radio-button value="grid">Grid 布局</el-radio-button>
        </el-radio-group>
      </div>
      
      <div class="control-section">
        <h4>屏幕尺寸模拟</h4>
        <el-radio-group v-model="screenSize" @change="switchScreenSize">
          <el-radio-button value="xs">XS (手机)</el-radio-button>
          <el-radio-button value="sm">SM (平板)</el-radio-button>
          <el-radio-button value="md">MD (小屏)</el-radio-button>
          <el-radio-button value="lg">LG (中屏)</el-radio-button>
          <el-radio-button value="xl">XL (大屏)</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 布局说明 -->
    <div class="layout-info">
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>当前配置: {{ layoutMode === 'flex' ? 'Flex' : 'Grid' }} 布局 - {{ screenSize.toUpperCase() }} 尺寸</span>
          </div>
        </template>
        
        <div class="layout-description">
          <div v-if="layoutMode === 'flex'" class="flex-info">
            <h5>Flex 布局特点:</h5>
            <ul>
              <li>基于 Element Plus 的 el-row/el-col 栅格系统</li>
              <li>支持 24 栅格布局，灵活的响应式配置</li>
              <li>可配置栅格间距 (gutter: {{ flexOptions.gutter }}px)</li>
              <li>支持水平对齐 (justify: {{ flexOptions.justify }}) 和垂直对齐 (align: {{ flexOptions.align }})</li>
              <li>适合复杂的表单布局和响应式设计</li>
            </ul>
          </div>
          
          <div v-else class="grid-info">
            <h5>Grid 布局特点:</h5>
            <ul>
              <li>基于 Element Plus 的 el-space 组件</li>
              <li>简化的间距布局，适合简单表单</li>
              <li>支持方向控制 ({{ gridOptions.grid?.direction }})</li>
              <li>自动换行和填充 (wrap: {{ gridOptions.grid?.wrap }}, fill: {{ gridOptions.grid?.fill }})</li>
              <li>统一的间距管理 (size: {{ gridOptions.grid?.size }})</li>
            </ul>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 演示表单 -->
    <div class="demo-form" :class="`size-${screenSize}`">
      <ma-form 
        ref="formRef"
        v-model="formData" 
        :options="currentOptions"
        :items="formItems"
      >
        <!-- 自定义底部操作栏 -->
        <template #footer>
          <div class="form-footer">
            <el-button @click="handleReset">重置</el-button>
            <el-button type="primary" @click="handleSubmit">提交</el-button>
          </div>
        </template>
      </ma-form>
    </div>

    <!-- 配置详情 -->
    <div class="config-details">
      <el-collapse v-model="activeCollapse">
        <el-collapse-item title="当前表单配置" name="config">
          <pre class="config-json">{{ JSON.stringify(currentOptions, null, 2) }}</pre>
        </el-collapse-item>
        
        <el-collapse-item title="当前表单数据" name="data">
          <pre class="data-json">{{ JSON.stringify(formData, null, 2) }}</pre>
        </el-collapse-item>
        
        <el-collapse-item title="响应式栅格配置" name="responsive">
          <pre class="responsive-json">{{ JSON.stringify(responsiveColsMap[screenSize as keyof typeof responsiveColsMap], null, 2) }}</pre>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<style scoped>
.layout-systems-demo {

}

.demo-controls {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
  flex-wrap: wrap;
}

.control-section h4 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 14px;
}

.layout-info {
  margin-bottom: 20px;
}

.card-header {
  font-weight: 600;
  color: #409EFF;
}

.layout-description {
  font-size: 14px;
  line-height: 1.6;
}

.layout-description h5 {
  margin: 0 0 10px 0;
  color: #303133;
}

.layout-description ul {
  margin: 0;
  padding-left: 20px;
  color: #606266;
}

.layout-description li {
  margin-bottom: 5px;
}

.demo-form {
  margin-bottom: 30px;
  transition: all 0.3s ease;
}

/* 模拟不同屏幕尺寸的样式 */
.size-xs {
  max-width: 375px;
  margin: 0 auto;
}

.size-sm {
  max-width: 576px;
  margin: 0 auto;
}

.size-md {
  max-width: 768px;
  margin: 0 auto;
}

.size-lg {
  max-width: 992px;
  margin: 0 auto;
}

.size-xl {
  max-width: 100%;
}

.form-footer {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px 0;
}

.config-details {
  margin-top: 30px;
}

.config-json,
.data-json,
.responsive-json {
  background-color: #f4f4f5;
  padding: 16px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.5;
  color: #606266;
  overflow-x: auto;
  white-space: pre-wrap;
  max-height: 400px;
  overflow-y: auto;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .layout-systems-demo {
    padding: 10px;
  }
  
  .demo-controls {
    flex-direction: column;
    gap: 20px;
  }
  
  .control-section {
    width: 100%;
  }
  
  .form-footer {
    flex-direction: column;
    align-items: center;
  }
}

/* 布局模式特定样式 */
.layout-systems-demo :deep(.el-form-item) {
  transition: all 0.3s ease;
}

.layout-systems-demo :deep(.el-row) {
  transition: all 0.3s ease;
}

.layout-systems-demo :deep(.el-space) {
  width: 100%;
}

/* 不同尺寸下的标签宽度调整 */
.size-xs :deep(.el-form-item__label) {
  width: 80px !important;
}

.size-sm :deep(.el-form-item__label) {
  width: 90px !important;
}

.size-md :deep(.el-form-item__label) {
  width: 100px !important;
}
</style>