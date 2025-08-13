<template>
  <div>
    <h3>自定义操作按钮</h3>
    <p>演示如何使用插槽自定义搜索表单的操作按钮区域，包括替换默认按钮、添加额外按钮等。</p>
    
    <div class="demo-section">
      <h4>完全替换操作按钮 (actions 插槽)</h4>
      <ma-search
        :search-items="searchItems"
        :form-options="formOptions"
        @search="handleSearch"
        @reset="handleReset"
      >
        <template #actions="{ searchLoading, resetLoading }">
          <el-button 
            type="primary" 
            :loading="searchLoading"
            @click="handleCustomSearch"
            icon="Search"
          >
            立即查询
          </el-button>
          <el-button 
            type="warning"
            :loading="resetLoading"
            @click="handleCustomReset"
            icon="Refresh"
          >
            清空条件
          </el-button>
          <el-button 
            type="success"
            @click="handleExport"
            icon="Download"
          >
            导出数据
          </el-button>
        </template>
      </ma-search>
    </div>

    <div class="demo-section">
      <h4>在默认按钮前添加内容 (beforeActions 插槽)</h4>
      <ma-search
        :search-items="searchItems"
        :form-options="formOptions"
        @search="handleSearch"
        @reset="handleReset"
      >
        <template #beforeActions>
          <el-button type="info" @click="handleSaveTemplate" icon="Collection">
            保存模板
          </el-button>
          <el-button type="primary" plain @click="handleLoadTemplate" icon="FolderOpened">
            加载模板
          </el-button>
        </template>
      </ma-search>
    </div>

    <div class="demo-section">
      <h4>在默认按钮后添加内容 (afterActions 插槽)</h4>
      <ma-search
        :search-items="searchItems"
        :form-options="formOptions"
        @search="handleSearch"
        @reset="handleReset"
      >
        <template #afterActions>
          <el-dropdown @command="handleMoreActions">
            <el-button type="primary" plain icon="More">
              更多操作
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="batch-delete">批量删除</el-dropdown-item>
                <el-dropdown-item command="batch-export">批量导出</el-dropdown-item>
                <el-dropdown-item command="advanced-settings">高级设置</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </ma-search>
    </div>

    <div class="demo-section">
      <h4>组合使用插槽</h4>
      <ma-search
        :search-items="moreSearchItems"
        :form-options="formOptions"
        :options="{ fold: true, foldRows: 2 }"
        @search="handleSearch"
        @reset="handleReset"
      >
        <template #beforeActions>
          <el-button-group>
            <el-button type="primary" size="small" @click="handleQuickSearch('today')">
              今日数据
            </el-button>
            <el-button type="primary" size="small" @click="handleQuickSearch('week')">
              本周数据
            </el-button>
            <el-button type="primary" size="small" @click="handleQuickSearch('month')">
              本月数据
            </el-button>
          </el-button-group>
        </template>
        
        <template #afterActions>
          <el-divider direction="vertical" />
          <el-button type="text" @click="handleHelp" icon="QuestionFilled">
            帮助
          </el-button>
        </template>
      </ma-search>
    </div>

    <div v-if="actionLog.length" class="log-display">
      <h4>操作日志：</h4>
      <div class="log-content">
        <div v-for="(log, index) in actionLog" :key="index" class="log-item">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-action">{{ log.action }}</span>
          <span v-if="log.data" class="log-data">{{ JSON.stringify(log.data) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { ref } from 'vue'
import type { MaSearchItem } from '@mineadmin/search'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'

const actionLog = ref<Array<{time: string, action: string, data?: any}>>([])

const searchItems = ref<MaSearchItem[]>([
  {
    label: '订单号',
    prop: 'order_no',
    render: 'input',
    props: { placeholder: '请输入订单号' }
  },
  {
    label: '客户名称',
    prop: 'customer',
    render: 'input',
    props: { placeholder: '请输入客户名称' }
  },
  {
    label: '订单状态',
    prop: 'status',
    render: 'select',
    options: [
      { label: '全部', value: '' },
      { label: '待付款', value: 'pending' },
      { label: '已付款', value: 'paid' },
      { label: '已发货', value: 'shipped' },
      { label: '已完成', value: 'completed' }
    ]
  }
])

const moreSearchItems = ref<MaSearchItem[]>([
  ...searchItems.value,
  {
    label: '订单金额',
    prop: 'amount_range',
    render: 'input',
    props: { placeholder: '最小金额' }
  },
  {
    label: '创建时间',
    prop: 'create_time',
    render: 'date-picker',
    props: { type: 'datetimerange', placeholder: ['开始时间', '结束时间'] }
  },
  {
    label: '备注',
    prop: 'remark',
    render: 'input',
    props: { placeholder: '请输入备注信息' }
  }
])

const formOptions = {
  labelWidth: '100px'
}

const addLog = (action: string, data?: any) => {
  actionLog.value.unshift({
    time: new Date().toLocaleTimeString(),
    action,
    data
  })
  if (actionLog.value.length > 10) {
    actionLog.value = actionLog.value.slice(0, 10)
  }
}

const handleSearch = (formData: any) => {
  addLog('执行搜索', formData)
  ElMessage.success('搜索完成')
}

const handleReset = (formData: any) => {
  addLog('重置搜索', formData)
  ElMessage.info('已重置搜索条件')
}

const handleCustomSearch = () => {
  addLog('自定义搜索按钮点击')
  ElMessage.success('自定义搜索执行')
}

const handleCustomReset = () => {
  addLog('自定义重置按钮点击')
  ElMessage.info('自定义重置执行')
}

const handleExport = () => {
  addLog('导出数据')
  ElMessage.success('开始导出数据...')
}

const handleSaveTemplate = () => {
  addLog('保存搜索模板')
  ElMessage.success('搜索模板已保存')
}

const handleLoadTemplate = () => {
  addLog('加载搜索模板')
  ElMessage.success('搜索模板已加载')
}

const handleMoreActions = (command: string) => {
  addLog('更多操作', { command })
  
  switch (command) {
    case 'batch-delete':
      ElMessageBox.confirm('确认批量删除选中项？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ElMessage.success('批量删除完成')
      })
      break
    case 'batch-export':
      ElMessage.success('批量导出任务已创建')
      break
    case 'advanced-settings':
      ElMessage.info('打开高级设置')
      break
  }
}

const handleQuickSearch = (type: string) => {
  addLog('快速搜索', { type })
  ElMessage.success(`执行${type === 'today' ? '今日' : type === 'week' ? '本周' : '本月'}数据搜索`)
}

const handleHelp = () => {
  addLog('查看帮助')
  ElMessage.info('打开帮助文档')
}
</script>

<style scoped>
.demo-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.demo-section h4 {
  margin-bottom: 15px;
  color: #303133;
  font-size: 16px;
}

.log-display {
  margin-top: 30px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.log-display h4 {
  margin-bottom: 10px;
  color: #303133;
}

.log-content {
  max-height: 200px;
  overflow-y: auto;
}

.log-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e4e7ed;
  font-size: 14px;
}

.log-item:last-child {
  border-bottom: none;
}

.log-time {
  width: 100px;
  color: #909399;
  font-size: 12px;
}

.log-action {
  flex: 1;
  color: #606266;
  font-weight: 500;
  margin: 0 10px;
}

.log-data {
  color: #409eff;
  font-size: 12px;
  background-color: #ecf5ff;
  padding: 2px 6px;
  border-radius: 2px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.el-button-group) {
  margin-right: 10px;
}
</style>