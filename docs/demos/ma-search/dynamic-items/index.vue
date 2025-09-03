<template>
  <div>
    <h3>动态管理搜索项</h3>
    <p>演示如何通过编程方式动态添加、删除、修改搜索表单项，展示所有相关的暴露方法。</p>
    
    <div class="control-panel">
      <div class="button-group">
        <h4>搜索项管理</h4>
        <el-button type="primary" @click="appendNewItem" icon="Plus">
          添加搜索项
        </el-button>
        <el-button type="danger" @click="removeLastItem" icon="Minus">
          移除最后一项
        </el-button>
        <el-button type="warning" @click="removeSpecificItem" icon="Delete">
          移除指定项
        </el-button>
        <el-button type="info" @click="getItemInfo" icon="View">
          获取项信息
        </el-button>
      </div>

      <div class="button-group">
        <h4>配置管理</h4>
        <el-button type="success" @click="updateOptions" icon="Setting">
          更新配置
        </el-button>
        <el-button type="primary" @click="updateFormOptions" icon="Edit">
          更新表单配置
        </el-button>
        <el-button type="info" @click="showCurrentConfig" icon="Document">
          显示当前配置
        </el-button>
      </div>

      <div class="button-group">
        <h4>表单数据操作</h4>
        <el-button type="success" @click="setFormData" icon="EditPen">
          设置表单数据
        </el-button>
        <el-button type="primary" @click="getFormData" icon="View">
          获取表单数据
        </el-button>
        <el-button type="warning" @click="clearFormData" icon="RefreshLeft">
          清空表单数据
        </el-button>
      </div>

      <div class="button-group">
        <h4>显示状态控制</h4>
        <el-button type="info" @click="toggleShow" icon="Hide">
          切换显示状态
        </el-button>
        <el-button type="success" @click="getShowStatus" icon="View">
          获取显示状态
        </el-button>
      </div>
    </div>

    <div class="search-container">
      <ma-search
        ref="dynamicSearchRef"
        :search-items="dynamicSearchItems"
        :form-options="currentFormOptions"
        :options="currentOptions"
        @search="handleSearch"
        @reset="handleReset"
      />
    </div>

    <div class="info-display">
      <div v-if="operationLog.length" class="log-section">
        <h4>操作日志</h4>
        <div class="log-content">
          <div v-for="(log, index) in operationLog" :key="index" class="log-item">
            <span class="log-time">{{ log.time }}</span>
            <span class="log-action">{{ log.action }}</span>
            <span v-if="log.result" class="log-result">{{ log.result }}</span>
          </div>
        </div>
      </div>

      <div v-if="currentConfig" class="config-section">
        <h4>当前配置信息</h4>
        <pre class="config-content">{{ JSON.stringify(currentConfig, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { ref, reactive } from 'vue'
import type { MaSearchItem } from '@mineadmin/search'
import { ElMessage, ElMessageBox } from 'element-plus'

const dynamicSearchRef = ref<any>(null)
const operationLog = ref<Array<{time: string, action: string, result?: string}>>([])
const currentConfig = ref<any>(null)

// 初始搜索项
const dynamicSearchItems = ref<MaSearchItem[]>([
  {
    label: '用户名',
    prop: 'username',
    render: 'input',
    renderProps: { placeholder: '请输入用户名' }
  },
  {
    label: '邮箱',
    prop: 'email',
    render: 'input',
    renderProps: { placeholder: '请输入邮箱' }
  }
])

// 当前表单配置
const currentFormOptions = ref({
  labelWidth: '120px'
})

// 当前组件配置
const currentOptions = ref({
  fold: false,
  show: true
})

// 可用的搜索项模板
const availableItems: MaSearchItem[] = [
  {
    label: '手机号',
    prop: 'phone',
    render: 'input',
    renderProps: { placeholder: '请输入手机号' }
  },
  {
    label: '状态',
    prop: 'status',
    render: 'select',
    renderProps: {
      options: [
        {label: '全部', value: ''},
        {label: '启用', value: 1},
        {label: '禁用', value: 0}
      ]
    }
  },
  {
    label: '部门',
    prop: 'department',
    render: 'select',
    renderProps: {
      options: [
        {label: '全部部门', value: ''},
        {label: '技术部', value: 'tech'},
        {label: '产品部', value: 'product'},
        {label: '运营部', value: 'operation'}
      ]
    }
  },
  {
    label: '注册时间',
    prop: 'register_date',
    render: 'date-picker',
    renderProps: { type: 'daterange', placeholder: ['开始日期', '结束日期'] }
  },
  {
    label: '年龄',
    prop: 'age',
    render: 'input-number',
    renderProps: { min: 0, max: 120, placeholder: '请输入年龄' }
  }
]

let itemCounter = 0

const addLog = (action: string, result?: string) => {
  operationLog.value.unshift({
    time: new Date().toLocaleTimeString(),
    action,
    result
  })
  if (operationLog.value.length > 20) {
    operationLog.value = operationLog.value.slice(0, 20)
  }
}

const appendNewItem = () => {
  if (itemCounter >= availableItems.length) {
    ElMessage.warning('没有更多可添加的搜索项')
    return
  }
  
  const newItem = { ...availableItems[itemCounter] }
  itemCounter++
  
  if (dynamicSearchRef.value) {
    dynamicSearchRef.value.appendItem(newItem)
    addLog('添加搜索项', `${newItem.label} (${newItem.prop})`)
    ElMessage.success(`已添加搜索项: ${newItem.label}`)
  }
}

const removeLastItem = () => {
  const currentItems = dynamicSearchRef.value?.getItems() || []
  if (currentItems.length <= 1) {
    ElMessage.warning('至少要保留一个搜索项')
    return
  }
  
  const lastItem = currentItems[currentItems.length - 1]
  if (dynamicSearchRef.value) {
    dynamicSearchRef.value.removeItem(lastItem.prop)
    addLog('移除搜索项', `${lastItem.label} (${lastItem.prop})`)
    ElMessage.success(`已移除搜索项: ${lastItem.label}`)
  }
}

const removeSpecificItem = async () => {
  const currentItems = dynamicSearchRef.value?.getItems() || []
  if (currentItems.length <= 1) {
    ElMessage.warning('至少要保留一个搜索项')
    return
  }
  
  const options = currentItems.map(item => item.prop).join('、')
  
  try {
    const { value: propName } = await ElMessageBox.prompt(
      `当前搜索项: ${options}`,
      '请输入要移除的搜索项prop',
      {
        confirmButtonText: '移除',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '请输入有效的prop名称'
      }
    )
    
    const targetItem = currentItems.find(item => item.prop === propName)
    if (targetItem) {
      dynamicSearchRef.value.removeItem(propName)
      addLog('移除指定搜索项', `${targetItem.label} (${propName})`)
      ElMessage.success(`已移除搜索项: ${targetItem.label}`)
    } else {
      ElMessage.error('未找到指定的搜索项')
    }
  } catch {
    // 用户取消操作
  }
}

const getItemInfo = () => {
  if (dynamicSearchRef.value) {
    const items = dynamicSearchRef.value.getItems()
    const itemsInfo = items.map((item: any) => `${item.label}(${item.prop})`).join('、')
    addLog('获取搜索项信息', `共${items.length}项: ${itemsInfo}`)
    ElMessage.info(`当前搜索项(${items.length}个): ${itemsInfo}`)
  }
}

const updateOptions = () => {
  const newOptions = {
    fold: !currentOptions.value.fold,
    foldRows: Math.floor(Math.random() * 3) + 1,
    text: {
      searchBtn: () => '立即搜索',
      resetBtn: () => '重置条件',
      isFoldBtn: () => '展开更多条件',
      notFoldBtn: () => '收起条件'
    }
  }
  
  if (dynamicSearchRef.value) {
    dynamicSearchRef.value.setOptions(newOptions)
    currentOptions.value = { ...newOptions }
    addLog('更新组件配置', `折叠: ${newOptions.fold}, 行数: ${newOptions.foldRows}`)
    ElMessage.success('组件配置已更新')
  }
}

const updateFormOptions = () => {
  const labelWidths = ['80px', '100px', '120px', '140px']
  const randomWidth = labelWidths[Math.floor(Math.random() * labelWidths.length)]
  
  const newFormOptions = {
    labelWidth: randomWidth,
    labelPosition: Math.random() > 0.5 ? 'left' : 'top'
  }
  
  if (dynamicSearchRef.value) {
    dynamicSearchRef.value.setFormOptions(newFormOptions)
    currentFormOptions.value = { ...newFormOptions }
    addLog('更新表单配置', `标签宽度: ${randomWidth}`)
    ElMessage.success('表单配置已更新')
  }
}

const showCurrentConfig = () => {
  if (dynamicSearchRef.value) {
    const options = dynamicSearchRef.value.getOptions()
    const formOptions = dynamicSearchRef.value.getFormOptions()
    const items = dynamicSearchRef.value.getItems()
    
    currentConfig.value = {
      options,
      formOptions,
      itemsCount: items.length,
      items: items.map((item: any) => ({ label: item.label, prop: item.prop, render: item.render }))
    }
    
    addLog('获取当前配置', '配置信息已显示在下方')
    ElMessage.success('配置信息已更新显示')
  }
}

const setFormData = () => {
  const sampleData = {
    username: 'demo_user',
    email: 'demo@example.com',
    phone: '13800138000',
    status: 1,
    department: 'tech'
  }
  
  if (dynamicSearchRef.value) {
    dynamicSearchRef.value.setSearchForm(sampleData)
    addLog('设置表单数据', JSON.stringify(sampleData))
    ElMessage.success('表单数据已设置')
  }
}

const getFormData = () => {
  if (dynamicSearchRef.value) {
    const formData = dynamicSearchRef.value.getSearchForm()
    addLog('获取表单数据', JSON.stringify(formData))
    ElMessage.info('表单数据已打印到控制台')
    console.log('当前表单数据:', formData)
  }
}

const clearFormData = () => {
  if (dynamicSearchRef.value) {
    dynamicSearchRef.value.setSearchForm({})
    addLog('清空表单数据', '所有字段已清空')
    ElMessage.success('表单数据已清空')
  }
}

const toggleShow = () => {
  if (dynamicSearchRef.value) {
    const currentShow = dynamicSearchRef.value.getShowState()
    dynamicSearchRef.value.setShowState(!currentShow)
    addLog('切换显示状态', `${!currentShow ? '显示' : '隐藏'}`)
    ElMessage.success(`搜索框已${!currentShow ? '显示' : '隐藏'}`)
  }
}

const getShowStatus = () => {
  if (dynamicSearchRef.value) {
    const showState = dynamicSearchRef.value.getShowState()
    addLog('获取显示状态', showState ? '显示中' : '已隐藏')
    ElMessage.info(`当前状态: ${showState ? '显示中' : '已隐藏'}`)
  }
}

const handleSearch = (formData: any) => {
  addLog('执行搜索', JSON.stringify(formData))
  ElMessage.success('搜索完成')
}

const handleReset = (formData: any) => {
  addLog('重置搜索', '表单已重置')
  ElMessage.info('搜索条件已重置')
}
</script>

<style scoped>
.control-panel {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.button-group {
  margin-bottom: 20px;
}

.button-group:last-child {
  margin-bottom: 0;
}

.button-group h4 {
  margin-bottom: 10px;
  color: #303133;
  font-size: 14px;
  font-weight: 600;
}

.button-group .el-button {
  margin-right: 10px;
  margin-bottom: 8px;
}

.search-container {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.info-display {
  display: flex;
  gap: 20px;
}

.log-section, .config-section {
  flex: 1;
  min-width: 0;
}

.log-section h4, .config-section h4 {
  margin-bottom: 10px;
  color: #303133;
  font-size: 16px;
}

.log-content {
  max-height: 300px;
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.log-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
}

.log-item:last-child {
  border-bottom: none;
}

.log-time {
  width: 80px;
  color: #909399;
  font-size: 12px;
}

.log-action {
  width: 120px;
  color: #606266;
  font-weight: 500;
  margin-right: 10px;
}

.log-result {
  flex: 1;
  color: #409eff;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.config-content {
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 15px;
  font-size: 12px;
  max-height: 300px;
  overflow-y: auto;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .info-display {
    flex-direction: column;
  }
  
  .button-group .el-button {
    margin-right: 5px;
    margin-bottom: 5px;
  }
}
</style>