<script setup lang="ts">
import { ref, h, computed } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import type { MaFormExpose } from '@mineadmin/form'
import type { MaFormItem, MaFormOptions } from '@mineadmin/form'

// 表单数据
const formData = ref({
  // 基础信息
  name: 'admin',
  email: 'admin@example.com',
  phone: '13800138000',
  
  // 详细信息
  company: 'MineAdmin',
  position: 'Developer',
  experience: 3,
  
  // 地址信息
  country: 'china',
  province: 'beijing',
  city: 'beijing',
  address: '朝阳区建国路88号',
  
  // 其他信息
  hobbies: ['coding', 'reading'],
  birthDate: '1995-01-01',
  description: '展示不同加载状态的示例表单',
  agreeTerms: false
})

// 表单引用
const formRef = ref<MaFormExpose>()

// 加载状态控制
const loadingStates = ref({
  global: false,        // 全局加载状态
  validation: false,    // 验证加载状态
  submission: false,    // 提交加载状态
  asyncField: false,    // 异步字段加载状态
  fileUpload: false,    // 文件上传加载状态
  dataFetch: false      // 数据获取加载状态
})

// 异步操作队列
const operationQueue = ref<Array<{
  id: string
  type: string
  description: string
  duration: number
  status: 'pending' | 'running' | 'completed' | 'failed'
  startTime?: number
  endTime?: number
}>>([])

// 模拟 API 调用
const mockApi = {
  validateEmail: async (email: string): Promise<{ valid: boolean, message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 2000))
    const existingEmails = ['admin@test.com', 'user@test.com']
    const exists = existingEmails.includes(email)
    return {
      valid: !exists,
      message: exists ? '邮箱已被注册' : '邮箱可以使用'
    }
  },
  
  fetchCityList: async (province: string): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    const cityMap: Record<string, string[]> = {
      beijing: ['北京市'],
      shanghai: ['上海市'],
      guangdong: ['广州市', '深圳市', '珠海市', '佛山市'],
      jiangsu: ['南京市', '苏州市', '无锡市', '常州市']
    }
    return cityMap[province] || []
  },
  
  uploadFile: async (file: File): Promise<{ url: string }> => {
    await new Promise(resolve => setTimeout(resolve, 3000))
    return { url: `https://example.com/files/${file.name}` }
  },
  
  submitForm: async (data: any): Promise<{ success: boolean, id: string }> => {
    await new Promise(resolve => setTimeout(resolve, 2500))
    return { success: true, id: `FORM_${Date.now()}` }
  }
}

// 添加操作到队列
const addOperation = (type: string, description: string, duration: number): string => {
  const id = `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  operationQueue.value.push({
    id,
    type,
    description,
    duration,
    status: 'pending'
  })
  return id
}

// 更新操作状态
const updateOperation = (id: string, status: 'running' | 'completed' | 'failed', startTime?: number, endTime?: number) => {
  const operation = operationQueue.value.find(op => op.id === id)
  if (operation) {
    operation.status = status
    if (startTime) operation.startTime = startTime
    if (endTime) operation.endTime = endTime
  }
}

// 城市数据
const cityOptions = ref<string[]>([])

// 表单项配置
const formItems = computed<MaFormItem[]>(() => [
  {
    label: '姓名',
    prop: 'name',
    render: 'input',
    renderProps: {
      placeholder: '请输入姓名',
      clearable: true
    },
    itemProps: {
      rules: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
    },
    cols: { span: 8 }
  },
  
  // 异步验证的邮箱字段
  {
    label: '邮箱地址',
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
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
        {
          asyncValidator: async (rule: any, value: string, callback: Function) => {
            if (!value) {
              callback()
              return
            }
            
            try {
              loadingStates.value.asyncField = true
              const opId = addOperation('validation', '验证邮箱是否已注册', 2000)
              updateOperation(opId, 'running', Date.now())
              
              const result = await mockApi.validateEmail(value)
              
              updateOperation(opId, 'completed', undefined, Date.now())
              
              if (result.valid) {
                callback()
              } else {
                callback(new Error(result.message))
              }
            } catch (error) {
              callback(new Error('验证过程中发生异常'))
            } finally {
              loadingStates.value.asyncField = false
            }
          },
          trigger: 'blur'
        }
      ]
    },
    cols: { span: 8 }
  },
  
  {
    label: '手机号',
    prop: 'phone',
    render: 'input',
    renderProps: {
      placeholder: '请输入手机号',
      clearable: true
    },
    itemProps: {
      rules: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
      ]
    },
    cols: { span: 8 }
  },
  
  {
    label: '公司名称',
    prop: 'company',
    render: 'input',
    renderProps: {
      placeholder: '请输入公司名称',
      clearable: true
    },
    cols: { span: 8 }
  },
  
  {
    label: '职位',
    prop: 'position',
    render: 'input',
    renderProps: {
      placeholder: '请输入职位',
      clearable: true
    },
    cols: { span: 8 }
  },
  
  {
    label: '工作经验',
    prop: 'experience',
    render: 'slider',
    renderProps: {
      min: 0,
      max: 20,
      'show-tooltip': true,
      'format-tooltip': (value: number) => `${value} 年`
    },
    cols: { span: 8 }
  },
  
  {
    label: '国家',
    prop: 'country',
    render: 'select',
    renderProps: {
      placeholder: '请选择国家'
    },
    renderSlots: {
      default: () => [
        { label: '中国', value: 'china' },
        { label: '美国', value: 'usa' },
        { label: '日本', value: 'japan' }
      ].map(item => h('el-option', { 
        key: item.value, 
        label: item.label, 
        value: item.value 
      }))
    },
    cols: { span: 6 }
  },
  
  // 级联加载的省份字段
  {
    label: '省份',
    prop: 'province',
    render: 'select',
    renderProps: {
      placeholder: '请选择省份',
      onChange: async (value: string) => {
        if (value) {
          try {
            loadingStates.value.dataFetch = true
            formData.value.city = '' // 清空城市选择
            
            const opId = addOperation('data-fetch', `获取${value}的城市列表`, 1500)
            updateOperation(opId, 'running', Date.now())
            
            const cities = await mockApi.fetchCityList(value)
            cityOptions.value = cities
            
            updateOperation(opId, 'completed', undefined, Date.now())
            ElMessage.success(`已加载${cities.length}个城市`)
          } catch (error) {
            ElMessage.error('获取城市列表失败')
          } finally {
            loadingStates.value.dataFetch = false
          }
        }
      }
    },
    renderSlots: {
      default: () => [
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '广东', value: 'guangdong' },
        { label: '江苏', value: 'jiangsu' }
      ].map(item => h('el-option', { 
        key: item.value, 
        label: item.label, 
        value: item.value 
      }))
    },
    when: (item, model) => model.country === 'china',
    dependencies: ['country'],
    cols: { span: 6 }
  },
  
  // 动态加载的城市字段
  {
    label: '城市',
    prop: 'city',
    render: 'select',
    renderProps: {
      placeholder: cityOptions.value.length > 0 ? '请选择城市' : '请先选择省份',
      loading: loadingStates.value.dataFetch,
      disabled: cityOptions.value.length === 0
    },
    renderSlots: {
      default: () => cityOptions.value.map(city => 
        h('el-option', { 
          key: city, 
          label: city, 
          value: city 
        })
      )
    },
    when: (item, model) => !!model.province,
    dependencies: ['province'],
    cols: { span: 6 }
  },
  
  {
    label: '详细地址',
    prop: 'address',
    render: 'input',
    renderProps: {
      placeholder: '请输入详细地址',
      clearable: true
    },
    when: (item, model) => !!model.city,
    dependencies: ['city'],
    cols: { span: 6 }
  },
  
  // 兴趣爱好
  {
    label: '兴趣爱好',
    prop: 'hobbies',
    render: 'checkboxGroup',
    renderSlots: {
      default: () => [
        { label: '编程', value: 'coding' },
        { label: '阅读', value: 'reading' },
        { label: '运动', value: 'sports' },
        { label: '音乐', value: 'music' },
        { label: '旅行', value: 'travel' }
      ].map(item => h('el-checkbox', { 
        key: item.value,
        label: item.value 
      }, () => item.label))
    },
    cols: { span: 12 }
  },
  
  {
    label: '出生日期',
    prop: 'birthDate',
    render: 'datePicker',
    renderProps: {
      type: 'date',
      placeholder: '请选择出生日期',
      format: 'YYYY-MM-DD',
      'value-format': 'YYYY-MM-DD'
    },
    cols: { span: 8 }
  },
  
  // 带加载状态的文件上传
  {
    label: '文件上传',
    prop: 'fileUpload',
    render: ({ formData, item }) => {
      return h('div', [
        h('el-upload', {
          action: '#',
          'auto-upload': false,
          'show-file-list': true,
          'before-upload': async (file: File) => {
            try {
              loadingStates.value.fileUpload = true
              const opId = addOperation('upload', `上传文件 ${file.name}`, 3000)
              updateOperation(opId, 'running', Date.now())
              
              const result = await mockApi.uploadFile(file)
              
              updateOperation(opId, 'completed', undefined, Date.now())
              ElMessage.success(`文件上传成功: ${result.url}`)
              return true
            } catch (error) {
              ElMessage.error('文件上传失败')
              return false
            } finally {
              loadingStates.value.fileUpload = false
            }
          }
        }, {
          default: () => h('el-button', {
            type: 'primary',
            loading: loadingStates.value.fileUpload
          }, () => loadingStates.value.fileUpload ? '上传中...' : '选择文件')
        })
      ])
    },
    cols: { span: 12 }
  },
  
  {
    label: '个人描述',
    prop: 'description',
    render: 'input',
    renderProps: {
      type: 'textarea',
      rows: 3,
      placeholder: '请输入个人描述',
      'show-word-limit': true,
      maxlength: 200
    },
    cols: { span: 24 }
  },
  
  {
    label: '同意条款',
    prop: 'agreeTerms',
    render: 'checkbox',
    renderSlots: {
      default: () => '我已阅读并同意相关服务条款'
    },
    itemProps: {
      rules: [
        {
          validator: (rule: any, value: boolean, callback: Function) => {
            if (!value) {
              callback(new Error('必须同意服务条款'))
            } else {
              callback()
            }
          },
          trigger: 'change'
        }
      ]
    },
    cols: { span: 12 }
  }
])

// 表单配置
const formOptions: MaFormOptions = {
  labelWidth: '100px',
  labelPosition: 'right',
  size: 'default'
}

// 计算加载状态统计
const loadingStats = computed(() => {
  const activeLoadings = Object.values(loadingStates.value).filter(Boolean).length
  const completedOperations = operationQueue.value.filter(op => op.status === 'completed').length
  const runningOperations = operationQueue.value.filter(op => op.status === 'running').length
  const failedOperations = operationQueue.value.filter(op => op.status === 'failed').length
  
  return {
    active: activeLoadings,
    completed: completedOperations,
    running: runningOperations,
    failed: failedOperations,
    total: operationQueue.value.length
  }
})

// ============ 表单操作方法 ============

// 全局加载状态控制
const handleGlobalLoading = async (duration: number = 3000) => {
  loadingStates.value.global = true
  formRef.value?.setLoadingState(true)
  
  const opId = addOperation('global', `全局加载状态 (${duration}ms)`, duration)
  updateOperation(opId, 'running', Date.now())
  
  await new Promise(resolve => setTimeout(resolve, duration))
  
  updateOperation(opId, 'completed', undefined, Date.now())
  loadingStates.value.global = false
  formRef.value?.setLoadingState(false)
  
  ElMessage.success('全局加载完成')
}

// 表单验证（带加载状态）
const handleValidateWithLoading = async () => {
  try {
    loadingStates.value.validation = true
    const opId = addOperation('validation', '表单验证', 1000)
    updateOperation(opId, 'running', Date.now())
    
    // 模拟验证延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const isValid = await formRef.value?.getElFormRef()?.validate()
    
    updateOperation(opId, 'completed', undefined, Date.now())
    
    if (isValid) {
      ElNotification({
        title: '验证成功',
        message: '所有字段验证通过！',
        type: 'success'
      })
    }
  } catch (error) {
    ElNotification({
      title: '验证失败',
      message: '请检查表单中的错误信息',
      type: 'error'
    })
  } finally {
    loadingStates.value.validation = false
  }
}

// 表单提交（带加载状态）
const handleSubmitWithLoading = async () => {
  try {
    // 先验证表单
    await handleValidateWithLoading()
    
    loadingStates.value.submission = true
    formRef.value?.setLoadingState(true)
    
    const opId = addOperation('submission', '提交表单数据', 2500)
    updateOperation(opId, 'running', Date.now())
    
    const result = await mockApi.submitForm(formData.value)
    
    updateOperation(opId, 'completed', undefined, Date.now())
    
    ElNotification({
      title: '提交成功',
      message: `表单已成功提交，ID: ${result.id}`,
      type: 'success',
      duration: 4000
    })
  } catch (error) {
    ElNotification({
      title: '提交失败',
      message: '表单提交过程中发生错误',
      type: 'error'
    })
  } finally {
    loadingStates.value.submission = false
    formRef.value?.setLoadingState(false)
  }
}

// 批量异步操作
const handleBatchOperations = async () => {
  const operations = [
    { name: '验证邮箱', duration: 2000 },
    { name: '获取城市数据', duration: 1500 },
    { name: '上传文件', duration: 3000 },
    { name: '提交表单', duration: 2500 }
  ]
  
  ElMessage.info('开始批量异步操作...')
  
  for (const op of operations) {
    const opId = addOperation('batch', op.name, op.duration)
    updateOperation(opId, 'running', Date.now())
    
    await new Promise(resolve => setTimeout(resolve, op.duration))
    
    updateOperation(opId, 'completed', undefined, Date.now())
    ElMessage.success(`${op.name} 完成`)
  }
  
  ElNotification({
    title: '批量操作完成',
    message: '所有异步操作都已成功完成！',
    type: 'success'
  })
}

// 清空操作记录
const handleClearOperations = () => {
  operationQueue.value.splice(0)
  ElMessage.info('操作记录已清空')
}

// 模拟网络错误
const handleSimulateError = async () => {
  loadingStates.value.global = true
  formRef.value?.setLoadingState(true)
  
  const opId = addOperation('error', '模拟网络错误', 2000)
  updateOperation(opId, 'running', Date.now())
  
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  updateOperation(opId, 'failed', undefined, Date.now())
  
  loadingStates.value.global = false
  formRef.value?.setLoadingState(false)
  
  ElMessage.error('模拟操作失败')
}

const activeTech = ref(['global', 'validation'])
</script>

<template>
  <div class="loading-states-demo">
    <!-- 演示说明 -->
    <div class="demo-description">
      <h3>加载状态演示</h3>
      <p>展示 MaForm 中各种加载状态的控制和管理，包括全局加载、异步验证、数据获取、文件上传等场景。</p>
      <div class="demo-features">
        <el-tag type="info" size="small">全局加载</el-tag>
        <el-tag type="success" size="small">异步验证</el-tag>
        <el-tag type="warning" size="small">数据获取</el-tag>
        <el-tag type="danger" size="small">文件上传</el-tag>
        <el-tag size="small">批量操作</el-tag>
      </div>
    </div>

    <!-- 加载状态控制面板 -->
    <div class="loading-controls">
      <el-card shadow="never">
        <template #header>
          <div class="controls-header">
            <span>加载状态控制面板</span>
            <div class="loading-indicators">
              <el-tag 
                v-for="(loading, key) in loadingStates" 
                :key="key"
                :type="loading ? 'success' : 'info'"
                size="small"
                :effect="loading ? 'dark' : 'plain'"
              >
                {{ key }}: {{ loading ? 'ON' : 'OFF' }}
              </el-tag>
            </div>
          </div>
        </template>
        
        <div class="controls-grid">
          <!-- 全局加载控制 -->
          <div class="control-group">
            <h4>全局加载控制</h4>
            <div class="control-buttons">
              <el-button 
                type="primary" 
                :loading="loadingStates.global"
                @click="handleGlobalLoading(2000)"
              >
                2秒全局加载
              </el-button>
              <el-button 
                type="success" 
                :loading="loadingStates.global"
                @click="handleGlobalLoading(5000)"
              >
                5秒全局加载
              </el-button>
            </div>
          </div>

          <!-- 表单操作 -->
          <div class="control-group">
            <h4>表单操作</h4>
            <div class="control-buttons">
              <el-button 
                type="warning" 
                :loading="loadingStates.validation"
                @click="handleValidateWithLoading"
              >
                验证表单
              </el-button>
              <el-button 
                type="danger" 
                :loading="loadingStates.submission"
                @click="handleSubmitWithLoading"
              >
                提交表单
              </el-button>
            </div>
          </div>

          <!-- 异步操作 -->
          <div class="control-group">
            <h4>异步操作</h4>
            <div class="control-buttons">
              <el-button @click="handleBatchOperations">
                批量异步操作
              </el-button>
              <el-button type="info" @click="handleSimulateError">
                模拟网络错误
              </el-button>
            </div>
          </div>

          <!-- 操作记录 -->
          <div class="control-group">
            <h4>操作记录</h4>
            <div class="control-buttons">
              <el-button size="small" @click="handleClearOperations">
                清空记录
              </el-button>
              <div class="stats-info">
                <el-statistic title="总操作" :value="loadingStats.total" />
                <el-statistic title="进行中" :value="loadingStats.running" />
                <el-statistic title="已完成" :value="loadingStats.completed" />
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 加载状态演示表单 -->
    <div class="demo-form">
      <ma-form 
        ref="formRef"
        v-model="formData" 
        :options="formOptions"
        :items="formItems"
      >
        <!-- 自定义底部操作栏 -->
        <template #footer>
          <div class="form-footer">
            <div class="footer-info">
              <el-text size="small" type="info">
                <el-icon v-if="loadingStats.active > 0" class="is-loading">
                  <Loading />
                </el-icon>
                <el-icon v-else><SuccessFilled /></el-icon>
                {{ loadingStats.active > 0 ? `${loadingStats.active} 个操作进行中` : '所有操作已完成' }}
              </el-text>
            </div>
            <div class="footer-actions">
              <el-button @click="formRef?.getElFormRef()?.resetFields()">
                重置表单
              </el-button>
              <el-button 
                type="primary" 
                :loading="loadingStates.submission"
                @click="handleSubmitWithLoading"
              >
                <template v-if="!loadingStates.submission">
                  <el-icon class="mr-1"><Check /></el-icon>
                </template>
                {{ loadingStates.submission ? '提交中...' : '提交表单' }}
              </el-button>
            </div>
          </div>
        </template>
      </ma-form>
    </div>

    <!-- 操作队列展示 -->
    <div class="operation-queue">
      <el-card shadow="never">
        <template #header>
          <div class="queue-header">
            <span>操作队列</span>
            <el-text size="small" type="info">
              实时显示所有异步操作的状态和进度
            </el-text>
          </div>
        </template>
        
        <div class="queue-container">
          <div v-if="operationQueue.length === 0" class="empty-queue">
            <el-empty description="暂无操作记录，请点击上方按钮进行测试" />
          </div>
          
          <div v-else class="operations-list">
            <div 
              v-for="operation in operationQueue.slice().reverse()" 
              :key="operation.id"
              class="operation-item"
              :class="operation.status"
            >
              <div class="operation-header">
                <div class="operation-info">
                  <el-tag 
                    :type="operation.status === 'completed' ? 'success' : 
                          operation.status === 'failed' ? 'danger' : 
                          operation.status === 'running' ? 'warning' : 'info'"
                    size="small"
                  >
                    {{ operation.type }}
                  </el-tag>
                  <span class="operation-desc">{{ operation.description }}</span>
                </div>
                
                <div class="operation-status">
                  <el-icon v-if="operation.status === 'running'" class="is-loading">
                    <Loading />
                  </el-icon>
                  <el-icon v-else-if="operation.status === 'completed'" color="#67c23a">
                    <SuccessFilled />
                  </el-icon>
                  <el-icon v-else-if="operation.status === 'failed'" color="#f56c6c">
                    <CircleCloseFilled />
                  </el-icon>
                  <el-icon v-else color="#909399">
                    <Clock />
                  </el-icon>
                </div>
              </div>
              
              <!-- 进度条 -->
              <div v-if="operation.status === 'running'" class="operation-progress">
                <el-progress 
                  :percentage="Math.min(100, ((Date.now() - (operation.startTime || 0)) / operation.duration) * 100)"
                  :stroke-width="4"
                  status="active"
                />
              </div>
              
              <!-- 时间信息 -->
              <div v-if="operation.startTime || operation.endTime" class="operation-time">
                <el-text size="small" type="info">
                  {{ operation.startTime ? `开始: ${new Date(operation.startTime).toLocaleTimeString()}` : '' }}
                  {{ operation.endTime ? ` | 结束: ${new Date(operation.endTime).toLocaleTimeString()}` : '' }}
                  {{ operation.startTime && operation.endTime ? ` | 耗时: ${operation.endTime - operation.startTime}ms` : '' }}
                </el-text>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 技术说明 -->
    <div class="tech-details">
      <el-card shadow="never">
        <template #header>
          <span>加载状态技术说明</span>
        </template>
        
        <el-collapse v-model="activeTech">
          <el-collapse-item title="全局加载状态" name="global">
            <div class="tech-content">
              <h5>setLoadingState(loading: boolean)</h5>
              <p>• 控制整个表单的全局加载状态</p>
              <p>• 加载时禁用所有表单项，显示加载动画</p>
              <p>• 适用于表单提交、数据获取等场景</p>
              
              <h5>使用示例</h5>
              <pre><code>// 开启加载状态
formRef.value?.setLoadingState(true)

// 执行异步操作
await submitForm()

// 关闭加载状态
formRef.value?.setLoadingState(false)</code></pre>
            </div>
          </el-collapse-item>
          
          <el-collapse-item title="异步验证加载" name="validation">
            <div class="tech-content">
              <h5>asyncValidator</h5>
              <p>• 表单项支持异步验证规则</p>
              <p>• 验证过程中可以显示加载状态</p>
              <p>• 支持复杂的远程验证逻辑</p>
              
              <h5>配置方法</h5>
              <pre><code>itemProps: {
  rules: [{
    asyncValidator: async (rule, value, callback) => {
      // 设置加载状态
      setLoading(true)
      
      // 异步验证逻辑
      const result = await validateRemote(value)
      
      // 处理验证结果
      if (result.valid) {
        callback()
      } else {
        callback(new Error(result.message))
      }
      
      // 清除加载状态
      setLoading(false)
    }
  }]
}</code></pre>
            </div>
          </el-collapse-item>
          
          <el-collapse-item title="组件级加载" name="component">
            <div class="tech-content">
              <h5>组件内置加载状态</h5>
              <p>• Select、Upload 等组件支持 loading 属性</p>
              <p>• 可以为单个组件设置独立的加载状态</p>
              <p>• 不影响其他表单项的交互</p>
              
              <h5>使用示例</h5>
              <pre><code>renderProps: {
  loading: isLoading.value,
  placeholder: '加载中...'
}</code></pre>
            </div>
          </el-collapse-item>
          
          <el-collapse-item title="批量操作管理" name="batch">
            <div class="tech-content">
              <h5>操作队列管理</h5>
              <p>• 跟踪多个异步操作的状态</p>
              <p>• 提供操作进度和时间统计</p>
              <p>• 支持操作失败重试和错误处理</p>
              
              <h5>最佳实践</h5>
              <p>• 为每个异步操作分配唯一 ID</p>
              <p>• 记录操作开始和结束时间</p>
              <p>• 提供用户友好的进度反馈</p>
              <p>• 合理处理操作异常和超时</p>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.loading-states-demo {
  max-width: 1200px;
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

.demo-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.loading-controls {
  margin-bottom: 20px;
}

.controls-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.loading-indicators {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.control-group {
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 16px;
  background-color: #fafbfc;
}

.control-group h4 {
  margin: 0 0 12px 0;
  color: #409EFF;
  font-size: 14px;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 8px;
}

.control-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stats-info {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #e4e7ed;
}

.demo-form {
  margin-bottom: 30px;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-top: 1px solid #e4e7ed;
  flex-wrap: wrap;
  gap: 16px;
}

.footer-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.footer-actions {
  display: flex;
  gap: 12px;
}

.mr-1 {
  margin-right: 4px;
}

.operation-queue {
  margin-bottom: 20px;
}

.queue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.queue-container {
  max-height: 400px;
  overflow-y: auto;
}

.empty-queue {
  text-align: center;
  padding: 40px 0;
}

.operations-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.operation-item {
  padding: 12px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background-color: #fafafa;
  transition: all 0.3s;
}

.operation-item.running {
  border-color: #e6a23c;
  background-color: #fdf6ec;
}

.operation-item.completed {
  border-color: #67c23a;
  background-color: #f0f9ff;
}

.operation-item.failed {
  border-color: #f56c6c;
  background-color: #fef0f0;
}

.operation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.operation-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.operation-desc {
  color: #303133;
  font-size: 13px;
}

.operation-progress {
  margin: 8px 0;
}

.operation-time {
  font-size: 11px;
  color: #909399;
}

.tech-details {
  margin-bottom: 20px;
}

.tech-content h5 {
  margin: 0 0 8px 0;
  color: #409EFF;
  font-size: 14px;
}

.tech-content p {
  margin: 0 0 8px 0;
  color: #606266;
  font-size: 13px;
  line-height: 1.5;
}

.tech-content pre {
  background-color: #f4f4f5;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.4;
  margin: 8px 0;
}

/* 加载动画 */
.is-loading {
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .loading-states-demo {
    padding: 10px;
  }
  
  .demo-features {
    justify-content: center;
  }
  
  .controls-grid {
    grid-template-columns: 1fr;
  }
  
  .controls-header,
  .queue-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .loading-indicators {
    width: 100%;
    justify-content: center;
  }
  
  .form-footer {
    flex-direction: column;
    align-items: stretch;
  }
  
  .footer-info {
    justify-content: center;
  }
  
  .footer-actions {
    justify-content: center;
  }
  
  .stats-info {
    justify-content: space-around;
  }
  
  .operation-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

/* 滚动条样式 */
.queue-container::-webkit-scrollbar {
  width: 6px;
}

.queue-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.queue-container::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}

.queue-container::-webkit-scrollbar-thumb:hover {
  background: #a8abb2;
}
</style>