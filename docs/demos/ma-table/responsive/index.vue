<script setup lang="tsx">
import { ref, onMounted, onUnmounted } from 'vue'
import type {
  MaTableColumns,
  MaTableExpose,
  MaTableOptions
} from "@mineadmin/table"
import { ElMessage, ElButton, ElSwitch, ElSlider } from 'element-plus'

const tableRef = ref<MaTableExpose>()
const containerRef = ref<HTMLElement>()
const windowHeight = ref(window.innerHeight)
const adaptionEnabled = ref(true)
const offsetBottom = ref(100)
const loading = ref(false)

// 响应式列配置
const columns = ref<MaTableColumns[]>([
  { label: '任务ID', prop: 'id', width: 100 },
  { 
    label: '任务标题', 
    prop: 'title',
    minWidth: 200,
    showOverflowTooltip: true,
    cellRender: ({ row }) => (
      <div style="font-weight: 500; color: #333;">
        {row.title}
      </div>
    )
  },
  { 
    label: '优先级', 
    prop: 'priority',
    width: 120,
    cellRender: ({ row }) => {
      const priorityConfig = {
        'high': { type: 'danger', text: '高优先级', icon: '🔥' },
        'medium': { type: 'warning', text: '中优先级', icon: '⚡' },
        'low': { type: 'success', text: '低优先级', icon: '✨' }
      }
      const config = priorityConfig[row.priority as keyof typeof priorityConfig]
      return (
        <el-tag type={config.type} size="small">
          <span style="margin-right: 4px;">{config.icon}</span>
          {config.text}
        </el-tag>
      )
    }
  },
  { 
    label: '进度', 
    prop: 'progress',
    width: 150,
    cellRender: ({ row }) => (
      <el-progress 
        percentage={row.progress}
        stroke-width={8}
        color={
          row.progress >= 80 ? '#67c23a' : 
          row.progress >= 50 ? '#e6a23c' : '#f56c6c'
        }
      />
    )
  },
  { 
    label: '负责人', 
    prop: 'assignee',
    width: 120,
    cellRender: ({ row }) => (
      <div style="display: flex; align-items: center; gap: 8px;">
        <div 
          style="width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(45deg, #409eff, #67c23a); display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold;"
        >
          {row.assignee.charAt(0)}
        </div>
        <span>{row.assignee}</span>
      </div>
    )
  },
  { 
    label: '截止时间', 
    prop: 'dueDate',
    width: 140,
    cellRender: ({ row }) => {
      const isOverdue = new Date(row.dueDate) < new Date()
      return (
        <span style={`color: ${isOverdue ? '#f56c6c' : '#606266'}`}>
          {row.dueDate}
        </span>
      )
    }
  },
  { 
    label: '状态', 
    prop: 'status',
    width: 100,
    cellRender: ({ row }) => {
      const statusConfig = {
        'todo': { type: 'info', text: '待开始' },
        'in_progress': { type: 'warning', text: '进行中' },
        'review': { type: 'primary', text: '待审核' },
        'done': { type: 'success', text: '已完成' }
      }
      const config = statusConfig[row.status as keyof typeof statusConfig]
      return <el-tag type={config.type}>{config.text}</el-tag>
    }
  }
])

// 响应式表格配置
const options = ref<MaTableOptions>({
  stripe: true,
  border: true,
  fit: true,
  loading: loading.value,
  loadingConfig: {
    text: '数据加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  },
  adaption: adaptionEnabled.value,
  adaptionOffsetBottom: offsetBottom.value,
  showPagination: true,
  pagination: {
    total: 100,
    pageSize: 15,
    currentPage: 1,
    layout: 'total, sizes, prev, pager, next',
    pageSizes: [10, 15, 20, 50],
    background: true
  }
})

// 生成任务数据
const generateTasks = (count: number) => {
  const titles = [
    '用户管理系统重构', '数据库性能优化', '前端界面改版', '移动端适配开发',
    'API接口文档更新', '单元测试完善', '安全漏洞修复', '新功能需求分析',
    '用户体验优化', '服务器部署配置', '代码质量检查', '性能监控实施'
  ]
  const assignees = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十']
  const priorities = ['high', 'medium', 'low']
  const statuses = ['todo', 'in_progress', 'review', 'done']
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: titles[i % titles.length] + ` (任务${i + 1})`,
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    progress: Math.floor(Math.random() * 100),
    assignee: assignees[Math.floor(Math.random() * assignees.length)],
    dueDate: new Date(Date.now() + (Math.random() - 0.5) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    status: statuses[Math.floor(Math.random() * statuses.length)]
  }))
}

const data = ref(generateTasks(100))

// 窗口尺寸变化监听
const handleResize = () => {
  windowHeight.value = window.innerHeight
}

// 切换自适应高度
const toggleAdaption = (enabled: boolean) => {
  adaptionEnabled.value = enabled
  options.value.adaption = enabled
  tableRef.value?.setOptions(options.value)
  ElMessage.info(`自适应高度已${enabled ? '开启' : '关闭'}`)
}

// 更新底部偏移量
const updateOffsetBottom = (value: number) => {
  offsetBottom.value = value
  options.value.adaptionOffsetBottom = value
  tableRef.value?.setOptions(options.value)
}

// 模拟加载状态
const simulateLoading = async () => {
  loading.value = true
  tableRef.value?.setLoadingState(true)
  
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // 重新生成数据
  data.value = generateTasks(100)
  
  loading.value = false
  tableRef.value?.setLoadingState(false)
  ElMessage.success('数据刷新完成')
}

// 切换表格尺寸
const toggleTableSize = () => {
  const sizes = ['large', 'default', 'small']
  const currentSize = options.value.size || 'default'
  const currentIndex = sizes.indexOf(currentSize)
  const nextIndex = (currentIndex + 1) % sizes.length
  const nextSize = sizes[nextIndex]
  
  options.value.size = nextSize as any
  tableRef.value?.setOptions(options.value)
  ElMessage.info(`表格尺寸切换为：${nextSize}`)
}

// 切换边框显示
const toggleBorder = () => {
  options.value.border = !options.value.border
  tableRef.value?.setOptions(options.value)
  ElMessage.info(`表格边框${options.value.border ? '显示' : '隐藏'}`)
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div ref="containerRef" class="demo-responsive-table">
    <h3>响应式表格</h3>
    <p>展示表格的自适应高度、响应式布局和加载状态等功能。</p>
    
    <!-- 响应式控制面板 -->
    <div class="control-panel">
      <div class="panel-section">
        <h4>窗口信息</h4>
        <div class="window-info">
          <span>窗口高度：{{ windowHeight }}px</span>
          <span>容器状态：{{ containerRef ? '已挂载' : '未挂载' }}</span>
        </div>
      </div>
      
      <div class="panel-section">
        <h4>自适应配置</h4>
        <div class="adaption-controls">
          <div class="control-item">
            <span>自适应高度：</span>
            <el-switch 
              v-model="adaptionEnabled"
              @change="toggleAdaption"
            />
          </div>
          <div class="control-item">
            <span>底部偏移：{{ offsetBottom }}px</span>
            <el-slider 
              v-model="offsetBottom"
              :min="50"
              :max="200"
              :step="10"
              style="width: 150px; margin-left: 12px;"
              @change="updateOffsetBottom"
            />
          </div>
        </div>
      </div>
      
      <div class="panel-section">
        <h4>表格控制</h4>
        <div class="table-controls">
          <el-button 
            type="primary" 
            :loading="loading"
            @click="simulateLoading"
          >
            刷新数据
          </el-button>
          <el-button @click="toggleTableSize">
            切换尺寸
          </el-button>
          <el-button @click="toggleBorder">
            切换边框
          </el-button>
        </div>
      </div>
    </div>
    
    <ma-table
      ref="tableRef"
      :columns="columns"
      :data="data.slice(0, 15)"
      :options="options"
    >
      <template #pageLeft>
        <div class="responsive-info">
          <span style="color: #666; font-size: 14px;">
            自适应高度：{{ adaptionEnabled ? '开启' : '关闭' }} | 
            偏移量：{{ offsetBottom }}px | 
            表格尺寸：{{ options.size || 'default' }}
          </span>
        </div>
      </template>
    </ma-table>
    
    <div class="demo-features">
      <h4>功能特性：</h4>
      <ul>
        <li><strong>自适应高度</strong>：表格高度根据窗口大小自动调整</li>
        <li><strong>底部偏移</strong>：可配置距离底部的偏移量</li>
        <li><strong>加载状态</strong>：支持加载动画和自定义加载配置</li>
        <li><strong>响应式列</strong>：列宽度根据内容和窗口大小自动调整</li>
        <li><strong>动态配置</strong>：运行时修改表格配置参数</li>
        <li><strong>窗口监听</strong>：监听窗口尺寸变化并实时响应</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.demo-responsive-table {
  padding: 20px;
}

.demo-responsive-table h3 {
  margin-bottom: 8px;
  color: #333;
}

.demo-responsive-table p {
  margin-bottom: 16px;
  color: #666;
  font-size: 14px;
}

.control-panel {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.panel-section {
  margin-bottom: 16px;
}

.panel-section:last-child {
  margin-bottom: 0;
}

.panel-section h4 {
  margin-bottom: 12px;
  color: #333;
  font-size: 16px;
}

.window-info {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #555;
}

.adaption-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.control-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #555;
}

.table-controls {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.responsive-info {
  display: flex;
  align-items: center;
}

.demo-features {
  margin-top: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
}

.demo-features h4 {
  margin-bottom: 12px;
  color: #333;
  font-size: 16px;
}

.demo-features ul {
  margin: 0;
  padding-left: 20px;
}

.demo-features li {
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
}
</style>