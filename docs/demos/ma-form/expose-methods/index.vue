<script setup lang="ts">
import { ref, reactive, h, nextTick } from 'vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { MaFormExpose } from '@mineadmin/form'
import type { MaFormItem, MaFormOptions } from '@mineadmin/form'

// 表单数据
const formData = ref({
  username: 'admin',
  email: 'admin@example.com',
  password: '',
  confirmPassword: '',
  age: 25,
  gender: 'male',
  hobbies: ['reading'],
  birthDate: '1998-01-01',
  address: '北京市朝阳区',
  phone: '13800138000',
  description: '这是一个展示 MaForm 暴露方法的示例。',
  isActive: true,
  subscribeNews: false
})

// 表单引用
const formRef = ref<MaFormExpose>()

// 方法调用日志
const methodLogs = reactive<Array<{
  method: string
  params?: any
  result?: any
  timestamp: string
  type: 'success' | 'error' | 'info'
}>>([])

// 添加日志的辅助函数
const addLog = (method: string, params?: any, result?: any, type: 'success' | 'error' | 'info' = 'info') => {
  methodLogs.unshift({
    method,
    params: params ? JSON.stringify(params) : undefined,
    result: result ? JSON.stringify(result) : undefined,
    timestamp: new Date().toLocaleTimeString(),
    type
  })
  
  // 保持日志数量在合理范围内
  if (methodLogs.length > 20) {
    methodLogs.pop()
  }
}

// 表单项配置
const formItems = ref<MaFormItem[]>([
  {
    label: '用户名',
    prop: 'username',
    render: 'input',
    renderProps: { placeholder: '请输入用户名', clearable: true },
    itemProps: { 
      rules: [{ required: true, message: '请输入用户名', trigger: 'blur' }] 
    },
    cols: { span: 8 }
  },
  {
    label: '邮箱',
    prop: 'email',
    render: 'input',
    renderProps: { type: 'email', placeholder: '请输入邮箱', clearable: true },
    itemProps: { 
      rules: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
      ] 
    },
    cols: { span: 8 }
  },
  {
    label: '年龄',
    prop: 'age',
    render: 'inputNumber',
    renderProps: { min: 1, max: 100 },
    itemProps: { 
      rules: [{ required: true, message: '请输入年龄', trigger: 'blur' }] 
    },
    cols: { span: 8 }
  },
  {
    label: '密码',
    prop: 'password',
    render: 'input',
    renderProps: { 
      type: 'password', 
      placeholder: '请输入密码', 
      'show-password': true 
    },
    itemProps: { 
      rules: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度至少6位', trigger: 'blur' }
      ] 
    },
    cols: { span: 12 }
  },
  {
    label: '确认密码',
    prop: 'confirmPassword',
    render: 'input',
    renderProps: { 
      type: 'password', 
      placeholder: '请再次输入密码', 
      'show-password': true 
    },
    itemProps: {
      rules: [
        { required: true, message: '请确认密码', trigger: 'blur' },
        {
          validator: (rule: any, value: string, callback: Function) => {
            if (value !== formData.value.password) {
              callback(new Error('两次输入的密码不一致'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ]
    },
    cols: { span: 12 }
  },
  {
    label: '性别',
    prop: 'gender',
    render: 'select',
    renderProps: { placeholder: '请选择性别' },
    renderSlots: {
      default: () => [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' }
      ].map(item => h('el-option', { 
        key: item.value, 
        label: item.label, 
        value: item.value 
      }))
    },
    cols: { span: 8 }
  },
  {
    label: '兴趣爱好',
    prop: 'hobbies',
    render: 'checkboxGroup',
    renderSlots: {
      default: () => [
        { label: '阅读', value: 'reading' },
        { label: '运动', value: 'sports' },
        { label: '音乐', value: 'music' },
        { label: '旅行', value: 'travel' }
      ].map(item => h('el-checkbox', { 
        key: item.value,
        label: item.value 
      }, () => item.label))
    },
    cols: { span: 16 }
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
  {
    label: '手机号',
    prop: 'phone',
    render: 'input',
    renderProps: { placeholder: '请输入手机号', clearable: true },
    itemProps: {
      rules: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
      ]
    },
    cols: { span: 8 }
  },
  {
    label: '地址',
    prop: 'address',
    render: 'input',
    renderProps: { placeholder: '请输入地址', clearable: true },
    cols: { span: 8 }
  },
  {
    label: '状态',
    prop: 'isActive',
    render: 'switch',
    renderProps: { 'active-text': '激活', 'inactive-text': '未激活' },
    cols: { span: 8 }
  },
  {
    label: '订阅通知',
    prop: 'subscribeNews',
    render: 'checkbox',
    renderSlots: { default: () => '订阅产品更新通知' },
    cols: { span: 8 }
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
  }
])

// 表单配置
const formOptions: MaFormOptions = {
  labelWidth: '100px',
  labelPosition: 'right',
  size: 'default',
  gutter: 20
}

// ============ MaForm 暴露方法演示 ============

// 1. 表单验证方法
const handleValidate = async () => {
  try {
    const result = await formRef.value?.getElFormRef()?.validate()
    addLog('validate', undefined, `验证结果: ${result}`, 'success')
    ElMessage.success('表单验证通过')
  } catch (error) {
    addLog('validate', undefined, '验证失败', 'error')
    ElMessage.error('表单验证失败')
  }
}

const handleValidateField = async (prop: string) => {
  try {
    await formRef.value?.getElFormRef()?.validateField(prop)
    addLog('validateField', { prop }, '字段验证通过', 'success')
    ElMessage.success(`字段 ${prop} 验证通过`)
  } catch (error) {
    addLog('validateField', { prop }, '字段验证失败', 'error')
    ElMessage.error(`字段 ${prop} 验证失败`)
  }
}

// 2. 表单重置方法
const handleResetFields = () => {
  formRef.value?.getElFormRef()?.resetFields()
  addLog('resetFields', undefined, '表单已重置', 'success')
  ElMessage.success('表单已重置')
}

const handleClearValidate = () => {
  formRef.value?.getElFormRef()?.clearValidate()
  addLog('clearValidate', undefined, '验证状态已清除', 'success')
  ElMessage.info('验证状态已清除')
}

const handleClearValidateField = (prop: string) => {
  formRef.value?.getElFormRef()?.clearValidate(prop)
  addLog('clearValidate', { prop }, `字段 ${prop} 验证状态已清除`, 'success')
  ElMessage.info(`字段 ${prop} 验证状态已清除`)
}

// 3. 加载状态控制
const handleSetLoadingState = (loading: boolean) => {
  formRef.value?.setLoadingState(loading)
  addLog('setLoadingState', { loading }, `加载状态: ${loading}`, 'info')
  ElMessage.info(`加载状态已设置为: ${loading}`)
  
  if (loading) {
    // 3秒后自动关闭加载状态
    setTimeout(() => {
      formRef.value?.setLoadingState(false)
      addLog('setLoadingState', { loading: false }, '自动关闭加载状态', 'info')
    }, 3000)
  }
}

const handleToggleLoading = () => {
  const currentState = formRef.value?.getLoadingState() || false
  handleSetLoadingState(!currentState)
}

const handleGetLoadingState = () => {
  const state = formRef.value?.getLoadingState()
  addLog('getLoadingState', undefined, `当前加载状态: ${state}`, 'info')
  ElMessage.info(`当前加载状态: ${state}`)
}

// 4. 表单实例获取
const handleGetElFormRef = () => {
  const elFormRef = formRef.value?.getElFormRef()
  addLog('getElFormRef', undefined, `获取到 ElForm 实例: ${!!elFormRef}`, 'info')
  if (elFormRef) {
    ElMessage.success('成功获取 ElForm 实例')
    console.log('ElForm 实例:', elFormRef)
  } else {
    ElMessage.error('获取 ElForm 实例失败')
  }
}

// 5. 响应式状态获取
const handleGetMobileState = () => {
  const isMobile = formRef.value?.isMobileState()
  addLog('isMobileState', undefined, `移动端状态: ${isMobile}`, 'info')
  ElMessage.info(`当前${isMobile ? '是' : '不是'}移动端状态`)
}

const handleUpdateResponsiveState = () => {
  formRef.value?.updateResponsiveState()
  addLog('updateResponsiveState', undefined, '响应式状态已更新', 'success')
  ElMessage.success('响应式状态已更新')
}

// 6. 表单数据操作演示
const handleFillTestData = () => {
  const testData = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    confirmPassword: 'password123',
    age: 30,
    gender: 'female',
    hobbies: ['reading', 'music', 'travel'],
    birthDate: '1993-05-20',
    address: '上海市浦东新区',
    phone: '13912345678',
    description: '这是通过方法填充的测试数据，展示了如何程序化地操作表单。',
    isActive: true,
    subscribeNews: true
  }
  
  Object.assign(formData.value, testData)
  addLog('fillTestData', testData, '测试数据已填充', 'success')
  ElMessage.success('测试数据已填充')
}

const handleClearFormData = () => {
  const emptyData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: 0,
    gender: '',
    hobbies: [],
    birthDate: '',
    address: '',
    phone: '',
    description: '',
    isActive: false,
    subscribeNews: false
  }
  
  Object.assign(formData.value, emptyData)
  formRef.value?.getElFormRef()?.clearValidate()
  addLog('clearFormData', undefined, '表单数据已清空', 'success')
  ElMessage.success('表单数据已清空')
}

// 7. 高级验证演示
const handleCustomValidation = async () => {
  try {
    addLog('customValidation', undefined, '开始自定义验证...', 'info')
    
    // 模拟异步验证过程
    formRef.value?.setLoadingState(true)
    
    // 自定义验证逻辑
    const errors: string[] = []
    
    if (formData.value.username.length < 3) {
      errors.push('用户名长度不能少于3位')
    }
    
    if (formData.value.age < 18) {
      errors.push('用户年龄不能小于18岁')
    }
    
    if (formData.value.hobbies.length === 0) {
      errors.push('至少选择一个兴趣爱好')
    }
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    if (errors.length > 0) {
      addLog('customValidation', undefined, `验证失败: ${errors.join(', ')}`, 'error')
      ElMessageBox.alert(errors.join('\n'), '自定义验证失败', {
        type: 'error'
      })
    } else {
      addLog('customValidation', undefined, '自定义验证通过', 'success')
      ElNotification({
        title: '验证成功',
        message: '所有自定义验证规则都通过了！',
        type: 'success'
      })
    }
  } catch (error) {
    addLog('customValidation', undefined, '验证过程出错', 'error')
  } finally {
    formRef.value?.setLoadingState(false)
  }
}

// 8. 批量操作演示
const handleBatchOperations = async () => {
  addLog('batchOperations', undefined, '开始批量操作...', 'info')
  
  try {
    // 1. 清除所有验证
    formRef.value?.getElFormRef()?.clearValidate()
    await nextTick()
    
    // 2. 批量验证多个字段
    const fieldsToValidate = ['username', 'email', 'password']
    const validationPromises = fieldsToValidate.map(field => 
      formRef.value?.getElFormRef()?.validateField(field)
    )
    
    await Promise.all(validationPromises)
    
    // 3. 设置加载状态
    formRef.value?.setLoadingState(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    formRef.value?.setLoadingState(false)
    
    addLog('batchOperations', { fields: fieldsToValidate }, '批量操作完成', 'success')
    ElMessage.success('批量操作完成')
  } catch (error) {
    addLog('batchOperations', undefined, '批量操作失败', 'error')
    ElMessage.error('批量操作失败')
  }
}

// 清空日志
const handleClearLogs = () => {
  methodLogs.splice(0)
  ElMessage.info('日志已清空')
}

// 导出日志
const handleExportLogs = () => {
  const logsJson = JSON.stringify(methodLogs, null, 2)
  const blob = new Blob([logsJson], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ma-form-methods-log-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('日志已导出')
}
</script>

<template>
  <div class="expose-methods-demo">
    <!-- 演示说明 -->
    <div class="demo-description">
      <h3>暴露方法演示</h3>
      <p>展示 MaForm 组件暴露的所有公共方法，包括表单验证、状态控制、数据操作等功能。</p>
      <div class="demo-features">
        <el-tag type="info" size="small">表单验证</el-tag>
        <el-tag type="success" size="small">状态控制</el-tag>
        <el-tag type="warning" size="small">数据操作</el-tag>
        <el-tag type="danger" size="small">响应式方法</el-tag>
        <el-tag size="small">实例获取</el-tag>
      </div>
    </div>

    <!-- 方法操作面板 -->
    <div class="methods-panel">
      <el-card shadow="never">
        <template #header>
          <div class="panel-header">
            <span>MaForm 暴露方法操作面板</span>
            <el-badge :value="methodLogs.length" :max="99" type="info">
              <el-button size="small" @click="handleClearLogs">清空日志</el-button>
            </el-badge>
          </div>
        </template>
        
        <div class="methods-grid">
          <!-- 表单验证方法 -->
          <div class="method-group">
            <h4>表单验证方法</h4>
            <div class="method-buttons">
              <el-button type="primary" @click="handleValidate">
                validate() - 全表单验证
              </el-button>
              <el-dropdown @command="handleValidateField">
                <el-button>
                  validateField() - 单字段验证
                  <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="username">验证用户名</el-dropdown-item>
                    <el-dropdown-item command="email">验证邮箱</el-dropdown-item>
                    <el-dropdown-item command="password">验证密码</el-dropdown-item>
                    <el-dropdown-item command="phone">验证手机号</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-button type="warning" @click="handleCustomValidation">
                自定义验证逻辑
              </el-button>
            </div>
          </div>

          <!-- 表单重置方法 -->
          <div class="method-group">
            <h4>表单重置方法</h4>
            <div class="method-buttons">
              <el-button @click="handleResetFields">
                resetFields() - 重置表单
              </el-button>
              <el-button @click="handleClearValidate">
                clearValidate() - 清除验证
              </el-button>
              <el-dropdown @command="handleClearValidateField">
                <el-button>
                  clearValidate(prop) - 清除单字段
                  <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="username">清除用户名验证</el-dropdown-item>
                    <el-dropdown-item command="email">清除邮箱验证</el-dropdown-item>
                    <el-dropdown-item command="password">清除密码验证</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>

          <!-- 加载状态控制 -->
          <div class="method-group">
            <h4>加载状态控制</h4>
            <div class="method-buttons">
              <el-button type="success" @click="() => handleSetLoadingState(true)">
                setLoadingState(true) - 开始加载
              </el-button>
              <el-button type="danger" @click="() => handleSetLoadingState(false)">
                setLoadingState(false) - 停止加载
              </el-button>
              <el-button @click="handleToggleLoading">
                切换加载状态
              </el-button>
              <el-button @click="handleGetLoadingState">
                getLoadingState() - 获取状态
              </el-button>
            </div>
          </div>

          <!-- 实例和响应式方法 -->
          <div class="method-group">
            <h4>实例和响应式方法</h4>
            <div class="method-buttons">
              <el-button @click="handleGetElFormRef">
                getElFormRef() - 获取 ElForm
              </el-button>
              <el-button @click="handleGetMobileState">
                isMobileState() - 移动端状态
              </el-button>
              <el-button @click="handleUpdateResponsiveState">
                updateResponsiveState() - 更新响应式
              </el-button>
            </div>
          </div>

          <!-- 数据操作演示 -->
          <div class="method-group">
            <h4>数据操作演示</h4>
            <div class="method-buttons">
              <el-button type="info" @click="handleFillTestData">
                填充测试数据
              </el-button>
              <el-button @click="handleClearFormData">
                清空表单数据
              </el-button>
              <el-button type="warning" @click="handleBatchOperations">
                批量操作演示
              </el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 演示表单 -->
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
            <el-text size="small" type="info">
              通过上方的方法面板来测试各种暴露的方法功能
            </el-text>
          </div>
        </template>
      </ma-form>
    </div>

    <!-- 方法调用日志 -->
    <div class="method-logs">
      <el-card shadow="never">
        <template #header>
          <div class="logs-header">
            <span>方法调用日志</span>
            <div class="logs-actions">
              <el-button size="small" @click="handleExportLogs">导出日志</el-button>
              <el-button size="small" type="danger" @click="handleClearLogs">清空</el-button>
            </div>
          </div>
        </template>
        
        <div class="logs-container">
          <div v-if="methodLogs.length === 0" class="empty-logs">
            <el-empty description="暂无方法调用日志，请点击上方按钮进行测试" />
          </div>
          
          <div v-else class="logs-list">
            <div 
              v-for="(log, index) in methodLogs" 
              :key="`${log.timestamp}-${index}`"
              class="log-item"
              :class="log.type"
            >
              <div class="log-header">
                <div class="log-method">
                  <el-tag 
                    :type="log.type === 'success' ? 'success' : log.type === 'error' ? 'danger' : 'info'" 
                    size="small"
                  >
                    {{ log.method }}
                  </el-tag>
                  <span class="log-time">{{ log.timestamp }}</span>
                </div>
                <div class="log-type">
                  <el-icon v-if="log.type === 'success'" color="#67c23a">
                    <SuccessFilled />
                  </el-icon>
                  <el-icon v-else-if="log.type === 'error'" color="#f56c6c">
                    <CircleCloseFilled />
                  </el-icon>
                  <el-icon v-else color="#409EFF">
                    <InfoFilled />
                  </el-icon>
                </div>
              </div>
              
              <div v-if="log.params" class="log-params">
                <span class="log-label">参数:</span>
                <code>{{ log.params }}</code>
              </div>
              
              <div v-if="log.result" class="log-result">
                <span class="log-label">结果:</span>
                <code>{{ log.result }}</code>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- API 方法文档 -->
    <div class="api-docs">
      <el-card shadow="never">
        <template #header>
          <span>API 方法文档</span>
        </template>
        
        <el-collapse v-model="activeApi">
          <el-collapse-item title="表单验证方法" name="validation">
            <div class="api-content">
              <div class="api-method">
                <h5>validate(): Promise&lt;boolean&gt;</h5>
                <p>对整个表单进行验证，返回验证结果的 Promise。</p>
                <p><strong>返回值:</strong> Promise&lt;boolean&gt; - 验证通过返回 true，失败返回 false</p>
              </div>
              
              <div class="api-method">
                <h5>validateField(prop: string): Promise&lt;void&gt;</h5>
                <p>对单个表单项进行验证。</p>
                <p><strong>参数:</strong> prop - 要验证的字段名</p>
                <p><strong>返回值:</strong> Promise&lt;void&gt; - 验证成功时 resolve，失败时 reject</p>
              </div>
            </div>
          </el-collapse-item>
          
          <el-collapse-item title="表单重置方法" name="reset">
            <div class="api-content">
              <div class="api-method">
                <h5>resetFields(): void</h5>
                <p>重置整个表单，恢复到初始值并清除验证信息。</p>
              </div>
              
              <div class="api-method">
                <h5>clearValidate(props?: string | string[]): void</h5>
                <p>清除表单验证信息。</p>
                <p><strong>参数:</strong> props - 可选，指定要清除验证的字段名或字段名数组</p>
              </div>
            </div>
          </el-collapse-item>
          
          <el-collapse-item title="加载状态控制" name="loading">
            <div class="api-content">
              <div class="api-method">
                <h5>setLoadingState(loading: boolean): void</h5>
                <p>设置表单的加载状态。</p>
                <p><strong>参数:</strong> loading - true 显示加载状态，false 隐藏加载状态</p>
              </div>
              
              <div class="api-method">
                <h5>getLoadingState(): boolean</h5>
                <p>获取当前的加载状态。</p>
                <p><strong>返回值:</strong> boolean - 当前加载状态</p>
              </div>
            </div>
          </el-collapse-item>
          
          <el-collapse-item title="实例和响应式方法" name="instance">
            <div class="api-content">
              <div class="api-method">
                <h5>getElFormRef(): FormInstance | undefined</h5>
                <p>获取内部 Element Plus Form 组件的实例。</p>
                <p><strong>返回值:</strong> FormInstance - Element Plus Form 实例</p>
              </div>
              
              <div class="api-method">
                <h5>isMobileState(): boolean</h5>
                <p>获取当前是否为移动端状态。</p>
                <p><strong>返回值:</strong> boolean - 是否为移动端状态</p>
              </div>
              
              <div class="api-method">
                <h5>updateResponsiveState(): void</h5>
                <p>手动更新响应式状态，重新计算布局。</p>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>
  </div>
</template>

<script>
// 用于展开面板的响应式状态
const activeApi = ref(['validation', 'loading'])
</script>

<style scoped>
.expose-methods-demo {
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

.demo-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.methods-panel {
  margin-bottom: 20px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.methods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.method-group {
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 16px;
  background-color: #fafbfc;
}

.method-group h4 {
  margin: 0 0 12px 0;
  color: #409EFF;
  font-size: 14px;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 8px;
}

.method-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.method-buttons .el-button {
  text-align: left;
  justify-content: flex-start;
}

.demo-form {
  margin-bottom: 30px;
}

.form-footer {
  text-align: center;
  padding: 16px 0;
  border-top: 1px solid #e4e7ed;
}

.method-logs {
  margin-bottom: 20px;
}

.logs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logs-actions {
  display: flex;
  gap: 8px;
}

.logs-container {
  max-height: 400px;
  overflow-y: auto;
}

.empty-logs {
  text-align: center;
  padding: 40px 0;
}

.logs-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.log-item {
  padding: 12px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background-color: #fafafa;
}

.log-item.success {
  border-color: #67c23a;
  background-color: #f0f9ff;
}

.log-item.error {
  border-color: #f56c6c;
  background-color: #fef0f0;
}

.log-item.info {
  border-color: #409EFF;
  background-color: #ecf5ff;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.log-method {
  display: flex;
  align-items: center;
  gap: 8px;
}

.log-time {
  color: #909399;
  font-size: 12px;
}

.log-params,
.log-result {
  margin-top: 8px;
  font-size: 12px;
}

.log-label {
  color: #606266;
  font-weight: 600;
  margin-right: 8px;
}

.log-params code,
.log-result code {
  background-color: #f4f4f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
  color: #e6a23c;
  word-break: break-all;
}

.api-docs {
  margin-bottom: 20px;
}

.api-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.api-method h5 {
  margin: 0 0 8px 0;
  color: #409EFF;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 14px;
  background-color: #f4f4f5;
  padding: 8px 12px;
  border-radius: 4px;
}

.api-method p {
  margin: 0 0 6px 0;
  color: #606266;
  font-size: 13px;
  line-height: 1.5;
}

.api-method p strong {
  color: #303133;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .expose-methods-demo {
    padding: 10px;
  }
  
  .demo-features {
    justify-content: center;
  }
  
  .methods-grid {
    grid-template-columns: 1fr;
  }
  
  .panel-header,
  .logs-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .logs-actions {
    align-self: flex-end;
  }
  
  .log-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  
  .method-buttons .el-button {
    font-size: 12px;
    padding: 8px 12px;
  }
}

/* 滚动条样式 */
.logs-container::-webkit-scrollbar {
  width: 6px;
}

.logs-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.logs-container::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}

.logs-container::-webkit-scrollbar-thumb:hover {
  background: #a8abb2;
}
</style>