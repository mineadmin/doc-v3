<script setup lang="tsx">
import { ref, computed } from 'vue'
import type {
  MaTableColumns,
  MaTableExpose,
  MaTableOptions
} from "@mineadmin/table"
import { ElMessage, ElButton, ElTag, ElMessageBox } from 'element-plus'

const tableRef = ref<MaTableExpose>()
const selectedRows = ref<any[]>([])

// 多选表格列配置
const columns = ref<MaTableColumns[]>([
  { 
    type: 'selection',
    width: 50,
    selectable: (row) => row.status !== 'disabled'
  },
  { 
    type: 'index',
    label: '#',
    width: 60
  },
  { 
    label: '用户信息', 
    prop: 'userInfo',
    width: 200,
    cellRender: ({ row }) => (
      <div style="display: flex; align-items: center; gap: 12px;">
        <div 
          style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(45deg, #409eff, #67c23a); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;"
        >
          {row.name.charAt(0)}
        </div>
        <div>
          <div style="font-weight: bold;">{row.name}</div>
          <div style="font-size: 12px; color: #999;">{row.email}</div>
        </div>
      </div>
    )
  },
  { 
    label: '部门', 
    prop: 'department',
    width: 120
  },
  { 
    label: '角色权限', 
    prop: 'roles',
    cellRender: ({ row }) => (
      <div style="display: flex; gap: 4px; flex-wrap: wrap;">
        {row.roles.map((role: string, index: number) => (
          <el-tag 
            key={index}
            size="small" 
            type={role === 'admin' ? 'danger' : role === 'manager' ? 'warning' : 'info'}
          >
            {role}
          </el-tag>
        ))}
      </div>
    )
  },
  { 
    label: '最后登录', 
    prop: 'lastLogin',
    width: 160
  },
  { 
    label: '状态', 
    prop: 'status',
    width: 100,
    cellRender: ({ row }) => {
      const statusConfig = {
        'active': { type: 'success', text: '正常', icon: '✅' },
        'inactive': { type: 'warning', text: '停用', icon: '⚠️' },
        'disabled': { type: 'danger', text: '禁用', icon: '❌' }
      }
      const config = statusConfig[row.status as keyof typeof statusConfig]
      return (
        <el-tag type={config.type}>
          <span style="margin-right: 4px;">{config.icon}</span>
          {config.text}
        </el-tag>
      )
    }
  }
])

// 多选表格配置
const options = ref<MaTableOptions>({
  stripe: true,
  border: true,
  highlightCurrentRow: true,
  on: {
    onSelect: (selection, row) => {
      selectedRows.value = selection
      ElMessage.info(`${row.name} ${selection.includes(row) ? '被选中' : '被取消选择'}`)
    },
    onSelectAll: (selection) => {
      selectedRows.value = selection
      ElMessage.info(`${selection.length > 0 ? '全选' : '取消全选'}了 ${selection.length} 条记录`)
    },
    onSelectionChange: (selection) => {
      selectedRows.value = selection
    }
  }
})

// 用户数据
const userData: any[] = [
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@company.com',
    department: '技术部',
    roles: ['admin', 'developer'],
    lastLogin: '2024-01-15 14:30:25',
    status: 'active'
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@company.com',
    department: '产品部',
    roles: ['manager'],
    lastLogin: '2024-01-15 12:20:10',
    status: 'active'
  },
  {
    id: 3,
    name: '王五',
    email: 'wangwu@company.com',
    department: '设计部',
    roles: ['designer'],
    lastLogin: '2024-01-14 16:45:30',
    status: 'inactive'
  },
  {
    id: 4,
    name: '赵六',
    email: 'zhaoliu@company.com',
    department: '技术部',
    roles: ['developer'],
    lastLogin: '2024-01-13 09:15:20',
    status: 'disabled'
  },
  {
    id: 5,
    name: '孙七',
    email: 'sunqi@company.com',
    department: '运营部',
    roles: ['operator', 'analyst'],
    lastLogin: '2024-01-15 11:30:45',
    status: 'active'
  },
  {
    id: 6,
    name: '周八',
    email: 'zhouba@company.com',
    department: '财务部',
    roles: ['accountant'],
    lastLogin: '2024-01-12 15:20:10',
    status: 'active'
  },
  {
    id: 7,
    name: '吴九',
    email: 'wujiu@company.com',
    department: '人事部',
    roles: ['hr'],
    lastLogin: '2024-01-14 08:45:30',
    status: 'inactive'
  }
]

const data = ref([...userData])

// 选中行统计
const selectionStats = computed(() => {
  const total = selectedRows.value.length
  const byStatus = selectedRows.value.reduce((acc, row) => {
    acc[row.status] = (acc[row.status] || 0) + 1
    return acc
  }, {})
  
  return { total, byStatus }
})

// 批量操作
const batchActivate = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要操作的用户')
    return
  }
  
  try {
    await ElMessageBox.confirm(
      `确定要激活选中的 ${selectedRows.value.length} 个用户吗？`,
      '批量激活',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    selectedRows.value.forEach(row => {
      if (row.status !== 'active') {
        row.status = 'active'
      }
    })
    
    data.value = [...data.value]
    ElMessage.success(`已激活 ${selectedRows.value.length} 个用户`)
    clearSelection()
    
  } catch {
    ElMessage.info('已取消操作')
  }
}

const batchDeactivate = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要操作的用户')
    return
  }
  
  try {
    await ElMessageBox.confirm(
      `确定要停用选中的 ${selectedRows.value.length} 个用户吗？`,
      '批量停用',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    selectedRows.value.forEach(row => {
      row.status = 'inactive'
    })
    
    data.value = [...data.value]
    ElMessage.success(`已停用 ${selectedRows.value.length} 个用户`)
    clearSelection()
    
  } catch {
    ElMessage.info('已取消操作')
  }
}

const batchDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的用户')
    return
  }
  
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 个用户吗？此操作不可恢复！`,
      '批量删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
      }
    )
    
    const selectedIds = selectedRows.value.map(row => row.id)
    data.value = data.value.filter(row => !selectedIds.includes(row.id))
    
    ElMessage.success(`已删除 ${selectedRows.value.length} 个用户`)
    selectedRows.value = []
    
  } catch {
    ElMessage.info('已取消删除操作')
  }
}

// 清空选择
const clearSelection = () => {
  tableRef.value?.getElTableRef()?.clearSelection()
  selectedRows.value = []
  ElMessage.info('已清空选择')
}

// 选择指定行
const selectSpecificRows = () => {
  const activeUsers = data.value.filter(row => row.status === 'active')
  activeUsers.forEach(row => {
    tableRef.value?.getElTableRef()?.toggleRowSelection(row, true)
  })
  ElMessage.info(`已选择所有正常状态的用户 (${activeUsers.length} 个)`)
}

// 反选
const toggleSelection = () => {
  const allRows = data.value.filter(row => row.status !== 'disabled')
  allRows.forEach(row => {
    const isSelected = selectedRows.value.includes(row)
    tableRef.value?.getElTableRef()?.toggleRowSelection(row, !isSelected)
  })
  ElMessage.info('已执行反选操作')
}
</script>

<template>
  <div class="demo-selection-table">
    <h3>多选表格</h3>
    <p>展示表格的多选功能，包括单选、全选、批量操作等。</p>
    
    <!-- 批量操作面板 -->
    <div class="control-panel">
      <div class="panel-section">
        <h4>选择统计</h4>
        <div class="selection-stats">
          <span class="stat-item">
            已选择：<strong>{{ selectionStats.total }}</strong> 条
          </span>
          <span v-if="selectionStats.byStatus.active" class="stat-item">
            正常：<strong>{{ selectionStats.byStatus.active }}</strong> 个
          </span>
          <span v-if="selectionStats.byStatus.inactive" class="stat-item">
            停用：<strong>{{ selectionStats.byStatus.inactive }}</strong> 个
          </span>
          <span v-if="selectionStats.byStatus.disabled" class="stat-item">
            禁用：<strong>{{ selectionStats.byStatus.disabled }}</strong> 个
          </span>
        </div>
      </div>
      
      <div class="panel-section">
        <h4>选择控制</h4>
        <div class="selection-buttons">
          <el-button size="small" @click="selectSpecificRows">
            选择正常用户
          </el-button>
          <el-button size="small" @click="toggleSelection">
            反选
          </el-button>
          <el-button size="small" @click="clearSelection">
            清空选择
          </el-button>
        </div>
      </div>
      
      <div class="panel-section">
        <h4>批量操作</h4>
        <div class="batch-buttons">
          <el-button 
            type="success" 
            :disabled="selectedRows.length === 0"
            @click="batchActivate"
          >
            批量激活 ({{ selectedRows.length }})
          </el-button>
          <el-button 
            type="warning" 
            :disabled="selectedRows.length === 0"
            @click="batchDeactivate"
          >
            批量停用 ({{ selectedRows.length }})
          </el-button>
          <el-button 
            type="danger" 
            :disabled="selectedRows.length === 0"
            @click="batchDelete"
          >
            批量删除 ({{ selectedRows.length }})
          </el-button>
        </div>
      </div>
    </div>
    
    <ma-table
      ref="tableRef"
      :columns="columns"
      :data="data"
      :options="options"
    >
      <template #pageLeft>
        <div class="selection-summary">
          <span v-if="selectedRows.length > 0" style="color: #409eff; font-weight: bold;">
            已选择 {{ selectedRows.length }} 条记录
          </span>
          <span v-else style="color: #999;">
            未选择任何记录
          </span>
        </div>
      </template>
    </ma-table>
    
    <div class="demo-features">
      <h4>功能特性：</h4>
      <ul>
        <li><strong>多选控制</strong>：支持单行选择、全选、范围选择</li>
        <li><strong>选择约束</strong>：禁用状态的行不可选择</li>
        <li><strong>选择事件</strong>：监听选择变化事件，实时更新选中状态</li>
        <li><strong>批量操作</strong>：基于选中行进行批量激活、停用、删除操作</li>
        <li><strong>选择统计</strong>：实时显示选中记录的数量和状态分布</li>
        <li><strong>灵活控制</strong>：支持程序化选择、反选、清空等操作</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.demo-selection-table {
  padding: 20px;
}

.demo-selection-table h3 {
  margin-bottom: 8px;
  color: #333;
}

.demo-selection-table p {
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

.selection-stats {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.stat-item {
  font-size: 14px;
  color: #555;
}

.selection-buttons,
.batch-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.selection-summary {
  display: flex;
  align-items: center;
  font-size: 14px;
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