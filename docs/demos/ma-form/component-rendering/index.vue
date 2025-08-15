<script setup lang="tsx">
import {ref, h, computed, Ref, watch, onMounted, nextTick} from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import type {MaFormExpose, MaFormItem} from '@mineadmin/form'

// 表单数据 - 包含所有支持的组件类型
const formData = ref({
  // 输入类组件
  inputText: '文本输入示例',
  inputPassword: '',
  inputNumber: 100,
  inputTextarea: '这是一个多行文本输入示例\n支持换行显示',
  
  // 选择类组件
  select: 'option2',
  selectMultiple: ['option1', 'option3'],
  selectRemote: '',
  
  // 单选和多选
  radio: 'radio2',
  radioButton: 'button2',
  checkbox: true,
  checkboxGroup: ['check1', 'check3'],
  
  // 开关和滑块
  switch: true,
  slider: 60,
  sliderRange: [20, 80],
  
  // 日期时间
  date: '2024-01-15',
  dateRange: ['2024-01-01', '2024-01-31'],
  datetime: '2024-01-15 14:30:00',
  time: '14:30:00',
  timeRange: ['09:00:00', '18:00:00'],
  
  // 评分和色彩
  rate: 4,
  colorPicker: '#409EFF',
  
  // 树形选择
  treeSelect: [],
  
  // 级联选择
  cascader: [],
  cascaderMultiple: [],
  
  // 穿梭框
  transfer: [],
  
  // 上传
  upload: [],
  uploadDrag: [],
  uploadImage: [],
  
  // 富文本编辑器
  richEditor: '<p>这是一个<strong>富文本</strong>编辑器示例</p>',
  
  // 自动补全
  autocomplete: '',
  
  // 其他
  mention: '',
  tags: ['标签1', '标签2']
})

const formRef = ref<MaFormExpose>()

// 模拟数据源
const mockData = {
  // 选择器选项
  selectOptions: [
    { label: '选项一', value: 'option1' },
    { label: '选项二', value: 'option2' },
    { label: '选项三', value: 'option3' },
    { label: '选项四', value: 'option4' }
  ],
  
  // 远程搜索数据
  remoteOptions: [
    { label: '远程选项1', value: 'remote1' },
    { label: '远程选项2', value: 'remote2' },
    { label: '远程选项3', value: 'remote3' },
    { label: '远程选项4', value: 'remote4' }
  ],
  
  // 树形数据
  treeData: [
    {
      label: '一级分类1',
      value: 'level1-1',
      children: [
        { label: '二级分类1-1', value: 'level2-1-1' },
        { label: '二级分类1-2', value: 'level2-1-2' }
      ]
    },
    {
      label: '一级分类2',
      value: 'level1-2',
      children: [
        { label: '二级分类2-1', value: 'level2-2-1' },
        { label: '二级分类2-2', value: 'level2-2-2' }
      ]
    }
  ],
  
  // 级联数据
  cascaderOptions: [
    {
      value: 'beijing',
      label: '北京',
      children: [
        {
          value: 'chaoyang',
          label: '朝阳区',
          children: [
            { value: 'sanlitun', label: '三里屯' },
            { value: 'guomao', label: '国贸' }
          ]
        },
        {
          value: 'haidian',
          label: '海淀区',
          children: [
            { value: 'zhongguancun', label: '中关村' },
            { value: 'wudaokou', label: '五道口' }
          ]
        }
      ]
    },
    {
      value: 'shanghai',
      label: '上海',
      children: [
        {
          value: 'huangpu',
          label: '黄浦区',
          children: [
            { value: 'nanjinglu', label: '南京路' },
            { value: 'waitan', label: '外滩' }
          ]
        }
      ]
    }
  ],
  
  // 穿梭框数据
  transferData: Array.from({ length: 15 }, (_, index) => ({
    key: index,
    label: `选项 ${index + 1}`,
    disabled: index % 4 === 0
  })),
  
  // 自动补全数据
  autocompleteData: [
    'Vue.js',
    'React',
    'Angular',
    'Svelte',
    'TypeScript',
    'JavaScript',
    'HTML',
    'CSS',
    'Node.js',
    'Express.js'
  ]
}

// 远程搜索方法
const remoteSearchMethod = (query: string) => {
  if (query) {
    setTimeout(() => {
      const filtered = mockData.remoteOptions.filter(item => 
        item.label.toLowerCase().includes(query.toLowerCase())
      )
      // 这里通常会更新选项数据
      console.log('远程搜索结果:', filtered)
    }, 200)
  }
}

// 自动补全查询方法
const querySearchAsync = (queryString: string, callback: Function) => {
  const results = mockData.autocompleteData
    .filter(item => item.toLowerCase().includes(queryString.toLowerCase()))
    .map(item => ({ value: item }))
  
  setTimeout(() => {
    callback(results)
  }, 200)
}

// 上传相关方法
const handleUploadSuccess = (response: any, file: any, fileList: any[]) => {
  ElMessage.success(`文件 ${file.name} 上传成功`)
}

const handleUploadError = (error: any, file: any, fileList: any[]) => {
  ElMessage.error(`文件 ${file.name} 上传失败`)
}

const beforeUpload = (file: File) => {
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('上传文件大小不能超过 2MB!')
  }
  return isLt2M
}

// 表单项配置 - 展示所有支持的组件
const formItems:Ref<MaFormItem[]> = ref([
  // ============ 输入类组件 ============
  {
    label: '文本输入',
    prop: 'inputText',
    render: 'input',
    renderProps: {
      placeholder: '请输入文本内容',
      clearable: true,
      'prefix-icon': 'Edit',
      'show-word-limit': true,
      maxlength: 50
    },
    cols: { span: 8 }
  },
  {
    label: '密码输入',
    prop: 'inputPassword',
    render: 'input',
    renderProps: {
      type: 'password',
      placeholder: '请输入密码',
      'show-password': true,
      clearable: true
    },
    cols: { span: 8 }
  },
  
  {
    label: '数字输入',
    prop: 'inputNumber',
    render: 'inputNumber',
    renderProps: {
      min: 0,
      max: 1000,
      step: 10,
      'step-strictly': false,
      'controls-position': 'right'
    },
    cols: { span: 8 }
  },
  
  {
    label: '多行文本',
    prop: 'inputTextarea',
    render: 'input',
    renderProps: {
      type: 'textarea',
      placeholder: '请输入多行文本',
      rows: 4,
      'show-word-limit': true,
      maxlength: 200,
      resize: 'both'
    },
    cols: { span: 24 }
  },
  
  // ============ 选择类组件 ============
  {
    label: '下拉选择',
    prop: 'select',
    render: 'select',
    renderProps: {
      placeholder: '请选择选项',
      clearable: true,
      filterable: true,
      options: mockData.selectOptions
    },
    cols: { span: 8 }
  },
  
  {
    label: '多选下拉',
    prop: 'selectMultiple',
    render: 'select',
    renderProps: {
      multiple: true,
      placeholder: '请选择多个选项',
      clearable: true,
      'collapse-tags': true,
      'collapse-tags-tooltip': true,
      options: mockData.selectOptions
    },
    cols: { span: 8 }
  },
  
  {
    label: '远程搜索',
    prop: 'selectRemote',
    render: 'select',
    renderProps: {
      placeholder: '请输入关键字进行远程搜索',
      filterable: true,
      remote: true,
      'remote-method': remoteSearchMethod,
      loading: false,
      clearable: true,
      options: mockData.remoteOptions
    },
    cols: { span: 8 }
  },
  
  // ============ 单选多选组件 ============
  {
    label: '单选按钮',
    prop: 'radio',
    render: ({ formData }) => (
      <el-radio-group>
        {[
          { label: '选项1', value: 'radio1' },
          { label: '选项2', value: 'radio2' },
          { label: '选项3', value: 'radio3' }
        ].map(item => {
          return <el-radio label={item.value} value={item.value}>{item.label}</el-radio>
        })}
      </el-radio-group>
    ),
    cols: { span: 12 }
  },
  
  {
    label: '单选按钮组',
    prop: 'radioButton',
    render: ({ formData }) => (
      <el-radio-group>
        {[
          { label: '按钮1', value: 'button1' },
          { label: '按钮2', value: 'button2' },
          { label: '按钮3', value: 'button3' }
        ].map(item => {
          return <el-radio label={item.value} value={item.value}>{item.label}</el-radio>
        })}
      </el-radio-group>
    ),
    cols: { span: 12 }
  },
  
  {
    label: '单个复选框',
    prop: 'checkbox',
    render: 'checkbox',
    renderProps: {
      label: '我同意相关条款和条件'
    },
    cols: { span: 8 }
  },
  
  {
    label: '复选框组',
    prop: 'checkboxGroup',
    render: 'checkboxGroup',
    renderProps: {
      options: [
        { label: '复选项1', value: 'check1' },
        { label: '复选项2', value: 'check2' },
        { label: '复选项3', value: 'check3' },
        { label: '复选项4', value: 'check4' }
      ]
    },
    cols: { span: 16 }
  },
  
  // ============ 开关和滑块 ============
  {
    label: '开关',
    prop: 'switch',
    render: 'switch',
    renderProps: {
      'active-text': '开启',
      'inactive-text': '关闭',
      'active-color': '#13ce66',
      'inactive-color': '#ff4949'
    },
    cols: { span: 8 }
  },
  
  {
    label: '数值滑块',
    prop: 'slider',
    render: 'slider',
    renderProps: {
      min: 0,
      max: 100,
      step: 5,
      'show-tooltip': true,
      'show-input': true,
      'show-stops': true
    },
    cols: { span: 8 }
  },
  
  {
    label: '范围滑块',
    prop: 'sliderRange',
    render: 'slider',
    renderProps: {
      range: true,
      min: 0,
      max: 100,
      step: 1,
      'show-tooltip': true
    },
    cols: { span: 8 }
  },
  
  // ============ 日期时间组件 ============
  {
    label: '日期选择',
    prop: 'date',
    render: 'datePicker',
    renderProps: {
      type: 'date',
      placeholder: '请选择日期',
      format: 'YYYY-MM-DD',
      'value-format': 'YYYY-MM-DD',
      clearable: true
    },
    cols: { span: 6 }
  },
  
  {
    label: '日期范围',
    prop: 'dateRange',
    render: 'datePicker',
    renderProps: {
      type: 'daterange',
      'start-placeholder': '开始日期',
      'end-placeholder': '结束日期',
      format: 'YYYY-MM-DD',
      'value-format': 'YYYY-MM-DD'
    },
    cols: { span: 6 }
  },
  
  {
    label: '日期时间',
    prop: 'datetime',
    render: 'datePicker',
    renderProps: {
      type: 'datetime',
      placeholder: '请选择日期时间',
      format: 'YYYY-MM-DD HH:mm:ss',
      'value-format': 'YYYY-MM-DD HH:mm:ss'
    },
    cols: { span: 6 }
  },
  
  {
    label: '时间选择',
    prop: 'time',
    render: 'timePicker',
    renderProps: {
      placeholder: '请选择时间',
      format: 'HH:mm:ss',
      'value-format': 'HH:mm:ss'
    },
    cols: { span: 6 }
  },
  
  {
    label: '时间范围',
    prop: 'timeRange',
    render: 'timePicker',
    renderProps: {
      'is-range': true,
      'start-placeholder': '开始时间',
      'end-placeholder': '结束时间',
      format: 'HH:mm:ss',
      'value-format': 'HH:mm:ss'
    },
    cols: { span: 12 }
  },
  
  // ============ 评分和颜色 ============
  {
    label: '评分组件',
    prop: 'rate',
    render: 'rate',
    renderProps: {
      max: 5,
      'allow-half': true,
      'show-text': true,
      'show-score': true,
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
      texts: ['极差', '失望', '一般', '满意', '惊喜']
    },
    cols: { span: 8 }
  },
  
  {
    label: '颜色选择',
    prop: 'colorPicker',
    render: 'colorPicker',
    renderProps: {
      'show-alpha': true,
      'color-format': 'hex',
      predefine: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585'
      ]
    },
    cols: { span: 8 }
  },
  
  // ============ 树形选择 ============
  {
    label: '树形选择',
    prop: 'treeSelect',
    render: 'treeSelect',
    renderProps: {
      data: mockData.treeData,
      multiple: true,
      'check-strictly': false,
      'show-checkbox': true,
      'node-key': 'value',
      placeholder: '请选择树形节点'
    },
    cols: { span: 12 }
  },
  
  // ============ 级联选择 ============
  {
    label: '级联选择',
    prop: 'cascader',
    render: () => (
      <el-cascader
        options={mockData.cascaderOptions}
        placeholder="请选择级联选项"
        clearable={true}
        filterable={true}
        show-all-levels={false}
      />
    ),
    cols: { span: 8 }
  },
  
  {
    label: '多选级联',
    prop: 'cascaderMultiple',
    render: () => (
      <el-cascader
        options={mockData.cascaderOptions}
        props={{ multiple: true }}
        placeholder="请选择多个级联选项"
        clearable={true}
        collapse-tags={true}
      />
    ),
    cols: { span: 8 }
  },
  
  // ============ 穿梭框 ============
  {
    label: '穿梭框',
    prop: 'transfer',
    render: 'transfer',
    renderProps: {
      data: mockData.transferData,
      titles: ['源列表', '目标列表'],
      'button-texts': ['移除', '添加'],
      filterable: true,
      'filter-placeholder': '请输入搜索内容'
    },
    cols: { span: 24 }
  },
  
  // ============ 上传组件 ============
  {
    label: '文件上传',
    prop: 'upload',
    render: 'upload',
    renderProps: {
      action: '/api/upload', // 模拟上传地址
      'show-file-list': true,
      multiple: true,
      'before-upload': beforeUpload,
      'on-success': handleUploadSuccess,
      'on-error': handleUploadError,
      'file-list': []
    },
    renderSlots: {
      default: () => h('el-button', { type: 'primary' }, () => '选择文件'),
      tip: () => h('div', { class: 'el-upload__tip' }, '只能上传jpg/png文件，且不超过2MB')
    },
    cols: { span: 8 }
  },
  
  {
    label: '拖拽上传',
    prop: 'uploadDrag',
    render: 'upload',
    renderProps: {
      action: '/api/upload',
      drag: true,
      multiple: true,
      'before-upload': beforeUpload,
      'on-success': handleUploadSuccess
    },
    renderSlots: {
      default: () => [
        h('el-icon', { class: 'el-icon--upload' }, [h('UploadFilled')]),
        h('div', { class: 'el-upload__text' }, [
          '将文件拖到此处，或',
          h('em', '点击上传')
        ])
      ],
      tip: () => h('div', { class: 'el-upload__tip' }, '只能上传jpg/png文件，且不超过2MB')
    },
    cols: { span: 8 }
  },
  
  {
    label: '图片上传',
    prop: 'uploadImage',
    render: 'upload',
    renderProps: {
      action: '/api/upload',
      'list-type': 'picture-card',
      'show-file-list': true,
      'on-success': handleUploadSuccess
    },
    renderSlots: {
      default: () => h('el-icon', [h('Plus')]),
      tip: () => h('div', { class: 'el-upload__tip' }, '只能上传图片文件')
    },
    cols: { span: 8 }
  },
  
  // ============ 自动补全 ============
  {
    label: '自动补全',
    prop: 'autocomplete',
    render: 'autocomplete',
    renderProps: {
      placeholder: '请输入内容，支持自动补全',
      'fetch-suggestions': querySearchAsync,
      clearable: true,
      'highlight-first-item': true
    },
    cols: { span: 12 }
  },
  
  // ============ 标签输入 ============
  {
    label: '标签输入',
    prop: 'tags',
    render: ({ formData, item }) => {
      return h('div', { class: 'tag-input-container' }, [
        // 现有标签显示
        ...formData[item.prop].map((tag: string, index: number) => 
          h('el-tag', {
            key: tag,
            closable: true,
            type: 'info',
            onClose: () => {
              formData[item.prop].splice(index, 1)
            }
          }, () => tag)
        ),
        // 新增标签输入
        h('el-input', {
          modelValue: '',
          size: 'small',
          style: { width: '100px' },
          placeholder: '新标签',
          onKeyup: (e: KeyboardEvent) => {
            if (e.key === 'Enter' && e.target) {
              const input = e.target as HTMLInputElement
              const newTag = input.value.trim()
              if (newTag && !formData[item.prop].includes(newTag)) {
                formData[item.prop].push(newTag)
                input.value = ''
              }
            }
          }
        })
      ])
    },
    cols: { span: 12 }
  }
])

// 表单配置
const formOptions = ref({
  labelWidth: '120px',
  labelPosition: 'right' as const,
  size: 'default' as const
})

// 当前组件分类
interface ComponentCategory {
  name: string;
  props: string[];
  active: boolean;
}

const componentCategories: Ref<ComponentCategory[]> = ref([
  { name: '输入类组件', props: ['inputText', 'inputPassword', 'inputNumber', 'inputTextarea'], active: true },
  { name: '选择类组件', props: ['select', 'selectMultiple', 'selectRemote'], active: true },
  { name: '单选多选', props: ['radio', 'radioButton', 'checkbox', 'checkboxGroup'], active: true },
  { name: '开关滑块', props: ['switch', 'slider', 'sliderRange'], active: true },
  { name: '日期时间', props: ['date', 'dateRange', 'datetime', 'time', 'timeRange'], active: true },
  { name: '评分颜色', props: ['rate', 'colorPicker'], active: true },
  { name: '树形级联', props: ['treeSelect', 'cascader', 'cascaderMultiple'], active: true },
  { name: '数据传输', props: ['transfer'], active: true },
  { name: '文件上传', props: ['upload', 'uploadDrag', 'uploadImage'], active: true },
  { name: '其他组件', props: ['autocomplete', 'tags'], active: true }
])

// 根据分类过滤表单项
const getFilteredFormItems = () => {
  const activeProps = componentCategories.value
    .filter(cat => cat.active)
    .flatMap(cat => cat.props)
  
  return formItems.value.filter(item => activeProps.includes(item.prop))
}

// 初始化表单项
const filteredFormItems = ref<MaFormItem[]>(getFilteredFormItems())

// 监听分类变化，通过 setItems 方法更新表单
watch(componentCategories, () => {
  const newItems = getFilteredFormItems()
  filteredFormItems.value = newItems
  
  // 通过 ma-form 的 setItems 方法来实时更新表单项
  if (formRef.value) {
    formRef.value.setItems(newItems)
  }
}, { deep: true })

// 组件挂载后初始化表单项
onMounted(async () => {
  // 等待下一个 tick，确保 ma-form 组件完全挂载
  await nextTick()
  if (formRef.value) {
    formRef.value.setItems(filteredFormItems.value)
  }
})

// 切换组件分类显示
const toggleCategory = (index: number) => {
  componentCategories.value[index].active = !componentCategories.value[index].active
  
  // 立即更新表单项
  const newItems = getFilteredFormItems()
  filteredFormItems.value = newItems
  if (formRef.value) {
    formRef.value.setItems(newItems)
  }
}

// 全选/全不选
const toggleAllCategories = (selectAll: boolean) => {
  componentCategories.value.forEach(cat => {
    cat.active = selectAll
  })
  
  // 立即更新表单项
  const newItems = getFilteredFormItems()
  filteredFormItems.value = newItems
  if (formRef.value) {
    formRef.value.setItems(newItems)
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    formRef.value?.setLoadingState(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const isValid = await formRef.value?.getElFormRef()?.validate()
    if (isValid) {
      ElNotification({
        title: '提交成功',
        message: '所有组件数据已成功收集！',
        type: 'success',
        duration: 3000
      })
      console.log('所有组件数据:', formData.value)
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

// 导出数据
const exportData = () => {
  const dataStr = JSON.stringify(formData.value, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'form-data.json'
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('数据已导出')
}

const activeDocs = ref(['input', 'select'])
</script>

<template>
  <div class="component-rendering-demo">
    <!-- 演示说明 -->
    <div class="demo-description">
      <h3>组件渲染演示</h3>
      <p>展示 MaForm 支持的所有 Element Plus 组件类型，包括输入、选择、日期、上传等各种常用表单组件。</p>
      <div class="demo-stats">
        <el-statistic title="支持组件数量" :value="formItems.length" suffix="个" />
        <el-statistic title="当前显示组件" :value="filteredFormItems.length" suffix="个" />
      </div>
    </div>

    <!-- 组件分类控制器 -->
    <div class="category-controller">
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>组件分类控制</span>
            <div class="header-actions">
              <el-button size="small" @click="toggleAllCategories(true)">全选</el-button>
              <el-button size="small" @click="toggleAllCategories(false)">全不选</el-button>
            </div>
          </div>
        </template>
        
        <div class="category-grid">
          <div 
            v-for="(category, index) in componentCategories" 
            :key="category.name"
            class="category-item"
            :class="{ active: category.active }"
          >
            <el-checkbox v-model="category.active">
              {{ category.name }}
            </el-checkbox>
            <span class="category-count">({{ category.props.length }}个)</span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 组件渲染表单 -->
    <div class="demo-form">
      <ma-form 
        ref="formRef"
        v-model="formData" 
        :options="formOptions"
        :items="filteredFormItems"
      >
        <!-- 自定义底部操作栏 -->
        <template #footer>
          <div class="form-footer">
            <el-button @click="exportData">导出数据</el-button>
            <el-button @click="handleReset">重置表单</el-button>
            <el-button type="primary" @click="handleSubmit">提交表单</el-button>
          </div>
        </template>
      </ma-form>
    </div>

    <!-- 组件说明文档 -->
    <div class="component-docs">
      <el-card shadow="never">
        <template #header>
          <span>组件使用说明</span>
        </template>
        
        <el-collapse v-model="activeDocs">
          <el-collapse-item title="输入类组件 (Input Components)" name="input">
            <div class="doc-content">
              <h5>input - 文本输入框</h5>
              <p>• 支持各种 type：text、password、email、number 等</p>
              <p>• 可配置前缀图标、后缀图标、清除按钮</p>
              <p>• 支持字符计数、最大长度限制</p>
              
              <h5>inputNumber - 数字输入框</h5>
              <p>• 专门用于数字输入，支持精确控制</p>
              <p>• 可设置最小值、最大值、步长</p>
              <p>• 支持控制按钮位置设置</p>
            </div>
          </el-collapse-item>
          
          <el-collapse-item title="选择类组件 (Select Components)" name="select">
            <div class="doc-content">
              <h5>select - 下拉选择器</h5>
              <p>• 支持单选、多选、分组选择</p>
              <p>• 可配置过滤搜索、远程搜索</p>
              <p>• 支持自定义选项模板</p>
              
              <h5>配置示例：</h5>
              <pre><code>{
  render: 'select',
  renderProps: {
    multiple: true,
    filterable: true,
    remote: true
  },
  renderSlots: {
    default: () => optionsArray
  }
}</code></pre>
            </div>
          </el-collapse-item>
          
          <el-collapse-item title="日期时间组件 (DateTime Components)" name="datetime">
            <div class="doc-content">
              <h5>datePicker - 日期选择器</h5>
              <p>• 支持日期、日期时间、日期范围选择</p>
              <p>• 可自定义格式、禁用日期</p>
              <p>• 支持快捷选项配置</p>
              
              <h5>timePicker - 时间选择器</h5>
              <p>• 支持时间点、时间范围选择</p>
              <p>• 可配置时间精度和格式</p>
            </div>
          </el-collapse-item>
          
          <el-collapse-item title="上传组件 (Upload Components)" name="upload">
            <div class="doc-content">
              <h5>upload - 文件上传</h5>
              <p>• 支持多种上传模式：按钮、拖拽、图片墙</p>
              <p>• 可配置文件类型、大小限制</p>
              <p>• 支持上传进度、成功/失败回调</p>
              
              <h5>配置示例：</h5>
              <pre><code>{
  render: 'upload',
  renderProps: {
    action: '/api/upload',
    drag: true,
    multiple: true,
    'list-type': 'picture-card'
  }
}</code></pre>
            </div>
          </el-collapse-item>
          
          <el-collapse-item title="高级组件 (Advanced Components)" name="advanced">
            <div class="doc-content">
              <h5>transfer - 穿梭框</h5>
              <p>• 用于大量数据的双向选择</p>
              <p>• 支持搜索、自定义标题</p>
              
              <h5>treeSelect - 树形选择</h5>
              <p>• 层级结构数据选择</p>
              <p>• 支持多选、父子关联</p>
              
              <h5>cascader - 级联选择器</h5>
              <p>• 多级联动选择</p>
              <p>• 支持任意级别选择</p>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>

    <!-- 数据展示 -->
    <div class="data-display">
      <el-card shadow="never">
        <template #header>
          <span>当前表单数据</span>
        </template>
        <pre class="data-json">{{ JSON.stringify(formData, null, 2) }}</pre>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.component-rendering-demo {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.demo-description {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.demo-description h3 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 18px;
}

.demo-description p {
  margin: 0 0 15px 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
}

.demo-stats {
  display: flex;
  gap: 30px;
}

.category-controller {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.category-item:hover {
  border-color: #409EFF;
  background-color: #f0f9ff;
}

.category-item.active {
  border-color: #409EFF;
  background-color: #ecf5ff;
}

.category-count {
  color: #909399;
  font-size: 12px;
}

.demo-form {
  margin-bottom: 30px;
}

.form-footer {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px 0;
}

/* 自定义标签输入样式 */
.tag-input-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.tag-input-container .el-tag {
  margin-right: 8px;
}

.component-docs,
.data-display {
  margin-bottom: 20px;
}

.doc-content h5 {
  margin: 0 0 8px 0;
  color: #409EFF;
  font-size: 14px;
}

.doc-content p {
  margin: 0 0 8px 0;
  color: #606266;
  font-size: 13px;
  line-height: 1.5;
}

.doc-content pre {
  background-color: #f4f4f5;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.4;
}

.data-json {
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
  .component-rendering-demo {
    padding: 10px;
  }
  
  .demo-stats {
    flex-direction: column;
    gap: 15px;
  }
  
  .category-grid {
    grid-template-columns: 1fr;
  }
  
  .form-footer {
    flex-direction: column;
    align-items: center;
  }
  
  .card-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
}

/* 上传组件特殊样式 */
:deep(.el-upload-dragger) {
  width: 100%;
}

:deep(.el-upload__tip) {
  margin-top: 8px;
  color: #606266;
  font-size: 12px;
}

/* 穿梭框样式优化 */
:deep(.el-transfer) {
  display: flex;
  justify-content: center;
}

/* 滑块组件样式优化 */
:deep(.el-slider) {
  margin: 0 12px;
}

/* 颜色选择器样式 */
:deep(.el-color-picker) {
  vertical-align: middle;
}

/* 评分组件样式 */
:deep(.el-rate) {
  display: flex;
  align-items: center;
}
</style>