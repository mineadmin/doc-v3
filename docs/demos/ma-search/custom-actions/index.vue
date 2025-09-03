<template>
  <div>
    <h3>自定义操作按钮</h3>
    <p>演示如何使用插槽自定义搜索表单的操作按钮区域，包括替换默认按钮、添加额外按钮等。</p>

    <div class="demo-section">
      <h4>完全替换操作按钮 (actions 插槽)</h4>
      <ma-search key="actions-demo" ref="customActionsOne" :search-items="demoConfigs.demo1.searchItems"
        :form-options="demoConfigs.demo1.formOptions" :options="demoConfigs.demo1.searchOptions" @search="handleSearch"
        @reset="handleReset">
        <template #actions>
          <el-button type="primary" @click="handleCustomSearch" icon="Search">
            立即查询
          </el-button>
          <el-button type="warning" @click="handleCustomReset" icon="Refresh">
            清空条件
          </el-button>
          <el-button type="success" @click="handleExport" icon="Download">
            导出数据
          </el-button>
        </template>
      </ma-search>
    </div>

    <div class="demo-section">
      <h4>在默认按钮前添加内容 (beforeActions 插槽)</h4>
      <ma-search key="before-actions-demo" ref="customActionsTwo" :search-items="demoConfigs.demo2.searchItems"
        :form-options="demoConfigs.demo2.formOptions" :options="demoConfigs.demo2.searchOptions" @search="handleSearch"
        @reset="handleReset">
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
      <ma-search key="after-actions-demo" ref="customActionsThree" :search-items="demoConfigs.demo3.searchItems"
        :form-options="demoConfigs.demo3.formOptions" :options="demoConfigs.demo3.searchOptions" @search="handleSearch"
        @reset="handleReset">
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
      <ma-search key="combined-demo" ref="customActionsFour" :search-items="demoConfigs.demo4.searchItems"
        :form-options="demoConfigs.demo4.formOptions" :options="demoConfigs.demo4.searchOptions" @search="handleSearch"
        @reset="handleReset">
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
import type { MaSearchItem, MaSearchOptions } from '@mineadmin/search'
import type { MaFormOptions } from '@mineadmin/form'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'

// 组件引用类型定义
const customActionsOne = ref<InstanceType<typeof HTMLElement> | null>(null)
const customActionsTwo = ref<InstanceType<typeof HTMLElement> | null>(null)
const customActionsThree = ref<InstanceType<typeof HTMLElement> | null>(null)
const customActionsFour = ref<InstanceType<typeof HTMLElement> | null>(null)

// 操作日志类型定义
interface ActionLogItem {
  time: string
  action: string
  data?: any
}

const actionLog = ref<ActionLogItem[]>([])

// 基础搜索项配置
const baseSearchItems: MaSearchItem[] = [
  {
    label: '订单号',
    prop: 'order_no',
    render: 'input',
    renderProps: { placeholder: '请输入订单号' }
  },
  {
    label: '客户名称',
    prop: 'customer',
    render: 'input',
    renderProps: { placeholder: '请输入客户名称' }
  },
  {
    label: '订单状态',
    prop: 'status',
    render: 'select',
    renderProps: {
      options: [
        { label: '全部', value: '' },
        { label: '待付款', value: 'pending' },
        { label: '已付款', value: 'paid' },
        { label: '已发货', value: 'shipped' },
        { label: '已完成', value: 'completed' }
      ],
      placeholder: '请选择订单状态'
    },
  }
]

// 额外的搜索项
const extraSearchItems: MaSearchItem[] = [
  {
    label: '订单金额',
    prop: 'amount_range',
    render: 'input',
    renderProps: {
      placeholder: '最小金额'
    }
  },
  {
    label: '创建时间',
    prop: 'create_time',
    render: 'DatePicker',
    renderProps: {
      type: 'datetimerange',
      rangeSeparator: '-',
      startPlaceholder: '请选择开始时间',
      endPlaceholder: '请选择结束时间'
    }
  },
  {
    label: '备注',
    prop: 'remark',
    render: 'input',
    renderProps: {
      placeholder: '请输入备注信息'
    }
  }
]

// 工厂函数
const createSearchItems = (includeExtra: boolean = false): MaSearchItem[] => {
  const items: MaSearchItem[] = JSON.parse(JSON.stringify(baseSearchItems))
  return includeExtra ? [...items, ...JSON.parse(JSON.stringify(extraSearchItems))] : items
}

const createFormOptions = (): MaFormOptions => ({ labelWidth: '80px' })

const createSearchOptions = (fold: boolean = false): MaSearchOptions => ({
  fold,
  ...(fold && { foldRows: 2 }),
  cols: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 }
})

// 配置类型定义
interface DemoConfig {
  searchItems: MaSearchItem[]
  formOptions: MaFormOptions
  searchOptions: MaSearchOptions
}

// 为每个组件创建独立的数据
const demoConfigs: {
  demo1: DemoConfig,
  demo2: DemoConfig,
  demo3: DemoConfig,
  demo4: DemoConfig
} = {
  demo1: {
    searchItems: createSearchItems(),
    formOptions: createFormOptions(),
    searchOptions: createSearchOptions()
  },
  demo2: {
    searchItems: createSearchItems(),
    formOptions: createFormOptions(),
    searchOptions: createSearchOptions()
  },
  demo3: {
    searchItems: createSearchItems(),
    formOptions: createFormOptions(),
    searchOptions: createSearchOptions()
  },
  demo4: {
    searchItems: createSearchItems(true), // 包含额外项
    formOptions: createFormOptions(),
    searchOptions: createSearchOptions(true) // 开启折叠
  }
}

// 函数类型定义
const addLog = (action: string, data?: Record<string, any>): void => {
  actionLog.value.unshift({
    time: new Date().toLocaleTimeString(),
    action,
    data
  } as ActionLogItem)
  if (actionLog.value.length > 10) {
    actionLog.value = actionLog.value.slice(0, 10)
  }
}

const handleSearch = (formData: Record<string, any>): void => {
  addLog('执行搜索', formData)
  ElMessage.success('搜索完成')
}

const handleReset = (formData: Record<string, any>): void => {
  addLog('重置搜索', formData)
  ElMessage.info('已重置搜索条件')
}

const handleCustomSearch = (): void => {
  addLog('自定义搜索按钮点击')
  ElMessage.success('自定义搜索执行')
}

const handleCustomReset = (): void => {
  addLog('自定义重置按钮点击')
  ElMessage.info('自定义重置执行')
}

const handleExport = (): void => {
  addLog('导出数据')
  ElMessage.success('开始导出数据...')
}

const handleSaveTemplate = (): void => {
  addLog('保存搜索模板')
  ElMessage.success('搜索模板已保存')
}

const handleLoadTemplate = (): void => {
  addLog('加载搜索模板')
  ElMessage.success('搜索模板已加载')
}

const handleMoreActions = (command: string): void => {
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

const handleQuickSearch = (type: 'today' | 'week' | 'month'): void => {
  addLog('快速搜索', { type })
  const typeText = type === 'today' ? '今日' : type === 'week' ? '本周' : '本月'
  ElMessage.success(`执行${typeText}数据搜索`)
}

const handleHelp = (): void => {
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