<template>
  <div>
    <h3>方法演示</h3>
    <p>演示 ma-search 组件暴露的所有方法，包括获取/设置数据、配置管理、表单控制等。</p>
    
    <div class="control-panel">
      <div class="method-section">
        <h4>基础表单方法</h4>
        <div class="method-group">
          <el-button type="primary" @click="getMaFormRef">
            获取 MaForm 引用
          </el-button>
          <el-button type="success" @click="getSearchForm">
            获取搜索表单值
          </el-button>
          <el-button type="warning" @click="setSearchForm">
            设置搜索表单值
          </el-button>
          <el-button type="info" @click="resetSearchForm">
            重置搜索表单
          </el-button>
        </div>
      </div>

      <div class="method-section">
        <h4>折叠控制方法</h4>
        <div class="method-group">
          <el-button type="primary" @click="foldToggle">
            切换折叠状态
          </el-button>
          <el-button type="success" @click="getFold">
            获取折叠状态
          </el-button>
        </div>
      </div>

      <div class="method-section">
        <h4>显示状态方法</h4>
        <div class="method-group">
          <el-button type="primary" @click="toggleShow">
            切换显示状态
          </el-button>
          <el-button type="success" @click="getShowState">
            获取显示状态
          </el-button>
          <el-button type="warning" @click="setShowStateTrue">
            设置显示
          </el-button>
          <el-button type="danger" @click="setShowStateFalse">
            设置隐藏
          </el-button>
        </div>
      </div>

      <div class="method-section">
        <h4>配置管理方法</h4>
        <div class="method-group">
          <el-button type="primary" @click="getOptions">
            获取组件配置
          </el-button>
          <el-button type="success" @click="setOptions">
            设置组件配置
          </el-button>
          <el-button type="info" @click="getFormOptions">
            获取表单配置
          </el-button>
          <el-button type="warning" @click="setFormOptions">
            设置表单配置
          </el-button>
        </div>
      </div>

      <div class="method-section">
        <h4>搜索项管理方法</h4>
        <div class="method-group">
          <el-button type="primary" @click="getItems">
            获取搜索项
          </el-button>
          <el-button type="success" @click="setItems">
            设置搜索项
          </el-button>
          <el-button type="info" @click="appendItem">
            追加搜索项
          </el-button>
          <el-button type="warning" @click="removeItem">
            移除搜索项
          </el-button>
          <el-button type="danger" @click="getItemByProp">
            按属性获取项
          </el-button>
        </div>
      </div>

      <div class="method-section">
        <h4>表单验证方法</h4>
        <div class="method-group">
          <el-button type="primary" @click="validateForm">
            验证表单
          </el-button>
          <el-button type="success" @click="validateField">
            验证指定字段
          </el-button>
          <el-button type="warning" @click="clearValidate">
            清空验证
          </el-button>
        </div>
      </div>
    </div>

    <div class="search-container">
      <ma-search
        ref="methodDemoRef"
        :search-items="searchItems"
        :form-options="formOptions"
        :options="searchOptions"
        @search="handleSearch"
        @reset="handleReset"
        @fold="handleFold"
      />
    </div>

    <div class="result-display">
      <div class="result-section">
        <h4>方法执行结果</h4>
        <div class="result-content">
          <div v-for="(result, index) in methodResults" :key="index" class="result-item">
            <div class="result-header">
              <span class="result-time">{{ result.time }}</span>
              <span class="result-method">{{ result.method }}</span>
              <span class="result-status" :class="result.success ? 'success' : 'error'">
                {{ result.success ? '成功' : '失败' }}
              </span>
            </div>
            <div v-if="result.data" class="result-data">
              <pre>{{ JSON.stringify(result.data, null, 2) }}</pre>
            </div>
            <div v-if="result.error" class="result-error">
              {{ result.error }}
            </div>
          </div>
        </div>
      </div>

      <div class="current-state">
        <h4>当前状态</h4>
        <div class="state-grid">
          <div class="state-item">
            <label>折叠状态:</label>
            <span :class="currentState.isFold ? 'state-true' : 'state-false'">
              {{ currentState.isFold ? '已折叠' : '已展开' }}
            </span>
          </div>
          <div class="state-item">
            <label>显示状态:</label>
            <span :class="currentState.isShow ? 'state-true' : 'state-false'">
              {{ currentState.isShow ? '显示中' : '已隐藏' }}
            </span>
          </div>
          <div class="state-item">
            <label>搜索项数量:</label>
            <span>{{ currentState.itemCount }}</span>
          </div>
          <div class="state-item">
            <label>表单数据:</label>
            <span class="form-data">{{ Object.keys(currentState.formData || {}).length }} 个字段</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { ref, reactive, onMounted } from 'vue'
import type { MaSearchItem } from '@mineadmin/search'
import { ElMessage, ElMessageBox } from 'element-plus'

const methodDemoRef = ref<any>(null)

const methodResults = ref<Array<{
  time: string
  method: string
  success: boolean
  data?: any
  error?: string
}>>([])

const currentState = reactive({
  isFold: false,
  isShow: true,
  itemCount: 0,
  formData: {}
})

// 搜索项配置
const searchItems = ref<MaSearchItem[]>([
  {
    label: '用户名',
    prop: 'username',
    render: 'input',
    renderProps: {
      placeholder: '请输入用户名',
      clearable: true,
    },
    itemProps: {
      rules: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
      ]
    }
  },
  {
    label: '邮箱',
    prop: 'email',
    render: 'input',
    renderProps: {
      placeholder: '请输入邮箱',
      clearable: true,
    },
    itemProps: {
      rules: [
        { required: true, message: '邮箱不能为空', trigger: 'blur' },
        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
      ]
    }
  },
  {
    label: '状态',
    prop: 'status',
    render: 'select',
    renderProps: {
      options: [
        { label: '全部', value: '' },
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ]
    }
  },
  {
    label: '部门',
    prop: 'department',
    render: 'select',
    renderProps: {
      options: [
        { label: '全部部门', value: '' },
        { label: '技术部', value: 'tech' },
        { label: '产品部', value: 'product' },
        { label: '运营部', value: 'operation' }
      ]
    }
  }
])

const formOptions = ref({
  labelWidth: '100px'
})

const searchOptions = ref({
  fold: true,
  foldRows: 2,
  show: true,
  text: {
    searchBtn: () => '搜索',
    resetBtn: () => '重置',
    isFoldBtn: () => '展开',
    notFoldBtn: () => '收起'
  }
})

// 记录方法执行结果
const recordResult = (method: string, success: boolean, data?: any, error?: string) => {
  methodResults.value.unshift({
    time: new Date().toLocaleTimeString(),
    method,
    success,
    data,
    error
  })
  
  if (methodResults.value.length > 20) {
    methodResults.value = methodResults.value.slice(0, 20)
  }
}

// 更新当前状态
const updateCurrentState = () => {
  if (methodDemoRef.value) {
    try {
      currentState.isFold = methodDemoRef.value.getFold() || false
      currentState.isShow = methodDemoRef.value.getShowState() || false
      currentState.itemCount = methodDemoRef.value.getItems()?.length || 0
      currentState.formData = methodDemoRef.value.getSearchForm() || {}
    } catch (error) {
      console.warn('更新状态时出错:', error)
    }
  }
}

// 基础表单方法
const getMaFormRef = () => {
  try {
    const maFormRef = methodDemoRef.value?.getMaFormRef()
    recordResult('getMaFormRef', !!maFormRef, maFormRef ? 'MaForm引用获取成功' : null)
    ElMessage.success(maFormRef ? 'MaForm引用获取成功' : 'MaForm引用获取失败')
    updateCurrentState()
  } catch (error) {
    recordResult('getMaFormRef', false, null, String(error))
    ElMessage.error('获取MaForm引用失败')
  }
}

const getSearchForm = () => {
  try {
    const formData = methodDemoRef.value?.getSearchForm()
    recordResult('getSearchForm', true, formData)
    ElMessage.success('获取搜索表单值成功')
    updateCurrentState()
  } catch (error) {
    recordResult('getSearchForm', false, null, String(error))
    ElMessage.error('获取搜索表单值失败')
  }
}

const setSearchForm = () => {
  try {
    const sampleData = {
      username: 'sample_user',
      email: 'sample@example.com',
      status: 1,
      department: 'tech'
    }
    methodDemoRef.value?.setSearchForm(sampleData)
    recordResult('setSearchForm', true, sampleData)
    ElMessage.success('设置搜索表单值成功')
    updateCurrentState()
  } catch (error) {
    recordResult('setSearchForm', false, null, String(error))
    ElMessage.error('设置搜索表单值失败')
  }
}

const resetSearchForm = () => {
  try {
    methodDemoRef.value?.setSearchForm({})
    recordResult('resetSearchForm', true, '表单已重置')
    ElMessage.success('重置搜索表单成功')
    updateCurrentState()
  } catch (error) {
    recordResult('resetSearchForm', false, null, String(error))
    ElMessage.error('重置搜索表单失败')
  }
}

// 折叠控制方法
const foldToggle = () => {
  try {
    methodDemoRef.value?.foldToggle()
    recordResult('foldToggle', true, '折叠状态已切换')
    ElMessage.success('折叠状态切换成功')
    setTimeout(updateCurrentState, 100) // 等待动画完成
  } catch (error) {
    recordResult('foldToggle', false, null, String(error))
    ElMessage.error('切换折叠状态失败')
  }
}

const getFold = () => {
  try {
    const isFold = methodDemoRef.value?.getFold()
    recordResult('getFold', true, { isFold })
    ElMessage.info(`当前折叠状态: ${isFold ? '已折叠' : '已展开'}`)
    updateCurrentState()
  } catch (error) {
    recordResult('getFold', false, null, String(error))
    ElMessage.error('获取折叠状态失败')
  }
}

// 显示状态方法
const toggleShow = () => {
  try {
    const currentShow = methodDemoRef.value?.getShowState()
    methodDemoRef.value?.setShowState(!currentShow)
    recordResult('toggleShow', true, { newState: !currentShow })
    ElMessage.success(`显示状态已切换为: ${!currentShow ? '显示' : '隐藏'}`)
    updateCurrentState()
  } catch (error) {
    recordResult('toggleShow', false, null, String(error))
    ElMessage.error('切换显示状态失败')
  }
}

const getShowState = () => {
  try {
    const isShow = methodDemoRef.value?.getShowState()
    recordResult('getShowState', true, { isShow })
    ElMessage.info(`当前显示状态: ${isShow ? '显示中' : '已隐藏'}`)
    updateCurrentState()
  } catch (error) {
    recordResult('getShowState', false, null, String(error))
    ElMessage.error('获取显示状态失败')
  }
}

const setShowStateTrue = () => {
  try {
    methodDemoRef.value?.setShowState(true)
    recordResult('setShowState', true, { show: true })
    ElMessage.success('已设置为显示状态')
    updateCurrentState()
  } catch (error) {
    recordResult('setShowState', false, null, String(error))
    ElMessage.error('设置显示状态失败')
  }
}

const setShowStateFalse = () => {
  try {
    methodDemoRef.value?.setShowState(false)
    recordResult('setShowState', true, { show: false })
    ElMessage.success('已设置为隐藏状态')
    updateCurrentState()
  } catch (error) {
    recordResult('setShowState', false, null, String(error))
    ElMessage.error('设置隐藏状态失败')
  }
}

// 配置管理方法
const getOptions = () => {
  try {
    const options = methodDemoRef.value?.getOptions()
    recordResult('getOptions', true, options)
    ElMessage.success('获取组件配置成功')
    updateCurrentState()
  } catch (error) {
    recordResult('getOptions', false, null, String(error))
    ElMessage.error('获取组件配置失败')
  }
}

const setOptions = () => {
  try {
    const newOptions = {
      fold: !currentState.isFold,
      foldRows: Math.floor(Math.random() * 3) + 1,
      text: {
        searchBtn: '立即搜索',
        resetBtn: '清空重置',
        isFoldBtn: '显示更多',
        notFoldBtn: '收起条件'
      }
    }
    methodDemoRef.value?.setOptions(newOptions)
    recordResult('setOptions', true, newOptions)
    ElMessage.success('设置组件配置成功')
    setTimeout(updateCurrentState, 100)
  } catch (error) {
    recordResult('setOptions', false, null, String(error))
    ElMessage.error('设置组件配置失败')
  }
}

const getFormOptions = () => {
  try {
    const formOpts = methodDemoRef.value?.getFormOptions()
    recordResult('getFormOptions', true, formOpts)
    ElMessage.success('获取表单配置成功')
    updateCurrentState()
  } catch (error) {
    recordResult('getFormOptions', false, null, String(error))
    ElMessage.error('获取表单配置失败')
  }
}

const setFormOptions = () => {
  try {
    const labelWidths = ['80px', '100px', '120px', '140px']
    const randomWidth = labelWidths[Math.floor(Math.random() * labelWidths.length)]
    const newFormOptions = {
      labelWidth: randomWidth,
      labelPosition: Math.random() > 0.5 ? 'left' : 'top'
    }
    methodDemoRef.value?.setFormOptions(newFormOptions)
    recordResult('setFormOptions', true, newFormOptions)
    ElMessage.success('设置表单配置成功')
    updateCurrentState()
  } catch (error) {
    recordResult('setFormOptions', false, null, String(error))
    ElMessage.error('设置表单配置失败')
  }
}

// 搜索项管理方法
const getItems = () => {
  try {
    const items = methodDemoRef.value?.getItems()
    const itemsInfo = items?.map((item: any) => ({ label: item.label, prop: item.prop }))
    recordResult('getItems', true, itemsInfo)
    ElMessage.success(`获取搜索项成功，共${items?.length || 0}项`)
    updateCurrentState()
  } catch (error) {
    recordResult('getItems', false, null, String(error))
    ElMessage.error('获取搜索项失败')
  }
}

const setItems = () => {
  try {
    const newItems: MaSearchItem[] = [
      {
        label: '新用户名',
        prop: 'new_username',
        render: 'input',
        props: { placeholder: '请输入新用户名' }
      },
      {
        label: '新状态',
        prop: 'new_status',
        render: 'select',
        options: [
          { label: '全部', value: '' },
          { label: '活跃', value: 'active' },
          { label: '非活跃', value: 'inactive' }
        ]
      }
    ]
    methodDemoRef.value?.setItems(newItems)
    recordResult('setItems', true, newItems)
    ElMessage.success('设置搜索项成功')
    updateCurrentState()
  } catch (error) {
    recordResult('setItems', false, null, String(error))
    ElMessage.error('设置搜索项失败')
  }
}

const appendItem = () => {
  try {
    const newItem: MaSearchItem = {
      label: '动态添加项',
      prop: 'dynamic_field',
      render: 'input',
      props: { placeholder: '这是动态添加的字段' }
    }
    methodDemoRef.value?.appendItem(newItem)
    recordResult('appendItem', true, newItem)
    ElMessage.success('追加搜索项成功')
    updateCurrentState()
  } catch (error) {
    recordResult('appendItem', false, null, String(error))
    ElMessage.error('追加搜索项失败')
  }
}

const removeItem = async () => {
  try {
    const items = methodDemoRef.value?.getItems() || []
    if (items.length <= 1) {
      ElMessage.warning('至少要保留一个搜索项')
      return
    }
    
    const { value: propName } = await ElMessageBox.prompt(
      '请输入要移除的搜索项prop名称',
      '移除搜索项',
      {
        confirmButtonText: '移除',
        cancelButtonText: '取消'
      }
    )
    
    methodDemoRef.value?.removeItem(propName)
    recordResult('removeItem', true, { removedProp: propName })
    ElMessage.success(`移除搜索项 ${propName} 成功`)
    updateCurrentState()
  } catch (error) {
    if (error !== 'cancel') {
      recordResult('removeItem', false, null, String(error))
      ElMessage.error('移除搜索项失败')
    }
  }
}

const getItemByProp = async () => {
  try {
    const { value: propName } = await ElMessageBox.prompt(
      '请输入要查找的搜索项prop名称',
      '获取搜索项',
      {
        confirmButtonText: '查找',
        cancelButtonText: '取消'
      }
    )
    
    const item = methodDemoRef.value?.getItemByProp(propName)
    recordResult('getItemByProp', !!item, item ? { prop: propName, item } : null)
    
    if (item) {
      ElMessage.success(`找到搜索项: ${item.label}`)
    } else {
      ElMessage.warning(`未找到prop为 ${propName} 的搜索项`)
    }
    updateCurrentState()
  } catch (error) {
    if (error !== 'cancel') {
      recordResult('getItemByProp', false, null, String(error))
      ElMessage.error('获取搜索项失败')
    }
  }
}

// 表单验证方法
const validateForm = async () => {
  try {
    const maFormRef = methodDemoRef.value?.getMaFormRef()
    if (maFormRef) {
      await maFormRef.validate()
      recordResult('validateForm', true, '表单验证通过')
      ElMessage.success('表单验证通过')
    } else {
      throw new Error('无法获取表单引用')
    }
  } catch (error) {
    recordResult('validateForm', false, null, String(error))
    ElMessage.error('表单验证失败')
  }
}

const validateField = async () => {
  try {
    const { value: fieldProp } = await ElMessageBox.prompt(
      '请输入要验证的字段名称',
      '验证字段',
      {
        confirmButtonText: '验证',
        cancelButtonText: '取消'
      }
    )
    
    const maFormRef = methodDemoRef.value?.getMaFormRef()
    if (maFormRef) {
      maFormRef.validateField(fieldProp, (valid: boolean) => {
        recordResult('validateField', valid, { field: fieldProp, valid })
        ElMessage[valid ? 'success' : 'error'](`字段 ${fieldProp} 验证${valid ? '通过' : '失败'}`)
      })
    } else {
      throw new Error('无法获取表单引用')
    }
  } catch (error) {
    if (error !== 'cancel') {
      recordResult('validateField', false, null, String(error))
      ElMessage.error('字段验证失败')
    }
  }
}

const clearValidate = () => {
  try {
    const maFormRef = methodDemoRef.value?.getMaFormRef()
    if (maFormRef) {
      maFormRef.clearValidate()
      recordResult('clearValidate', true, '验证状态已清空')
      ElMessage.success('验证状态已清空')
    } else {
      throw new Error('无法获取表单引用')
    }
  } catch (error) {
    recordResult('clearValidate', false, null, String(error))
    ElMessage.error('清空验证状态失败')
  }
}

// 事件处理
const handleSearch = (formData: any) => {
  recordResult('search事件', true, formData)
  ElMessage.success('搜索事件触发')
}

const handleReset = (formData: any) => {
  recordResult('reset事件', true, formData)
  ElMessage.info('重置事件触发')
  updateCurrentState()
}

const handleFold = (state: boolean) => {
  recordResult('fold事件', true, { foldState: state })
  ElMessage.info(`折叠事件触发: ${state ? '已折叠' : '已展开'}`)
  updateCurrentState()
}

onMounted(() => {
  updateCurrentState()
})
</script>

<style scoped>
.control-panel {
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px;
}

.method-section {
  margin-bottom: 20px;
}

.method-section:last-child {
  margin-bottom: 0;
}

.method-section h4 {
  margin-bottom: 12px;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
  border-left: 4px solid #409eff;
  padding-left: 12px;
}

.method-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.method-group .el-button {
  margin: 0;
}

.search-container {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background-color: #fff;
}

.result-display {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.result-section,
.current-state {
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background-color: #fff;
}

.result-section h4,
.current-state h4 {
  margin-bottom: 15px;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.result-content {
  max-height: 400px;
  overflow-y: auto;
}

.result-item {
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  background-color: #fafafa;
}

.result-item:last-child {
  margin-bottom: 0;
}

.result-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.result-time {
  font-size: 12px;
  color: #909399;
  margin-right: 12px;
}

.result-method {
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  margin-right: 12px;
}

.result-status {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.result-status.success {
  background-color: #f0f9ff;
  color: #67c23a;
  border: 1px solid #b3e5ab;
}

.result-status.error {
  background-color: #fef0f0;
  color: #f56c6c;
  border: 1px solid #fbc4c4;
}

.result-data,
.result-error {
  margin-top: 8px;
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.5;
}

.result-data {
  background-color: #f5f7fa;
  color: #409eff;
  overflow-x: auto;
}

.result-data pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
}

.result-error {
  background-color: #fef0f0;
  color: #f56c6c;
}

.state-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.state-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.state-item label {
  font-weight: 500;
  color: #606266;
}

.state-true {
  color: #67c23a;
  font-weight: 500;
}

.state-false {
  color: #f56c6c;
  font-weight: 500;
}

.form-data {
  color: #409eff;
  font-weight: 500;
}

@media (max-width: 1200px) {
  .result-display {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .method-group {
    flex-direction: column;
  }
  
  .method-group .el-button {
    width: 100%;
  }
  
  .result-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>