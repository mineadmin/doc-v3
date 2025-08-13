<template>
  <div class="demo-toolbar-extensions">
    <h3>工具栏扩展</h3>
    <p>展示如何通过插件API扩展工具栏功能，包含自定义工具按钮和工具栏布局。</p>
    
    <div class="toolbar-info">
      <el-alert 
        title="工具栏说明" 
        type="info" 
        description="本示例展示了如何注册自定义工具栏插件，包括数据统计、批量操作、导入导出等功能。"
        show-icon
        :closable="false"
      />
    </div>
    
    <MaProTable ref="tableRef" :options="options" :schema="schema">
      <!-- 使用插槽扩展工具栏左侧 -->
      <template #toolbarLeft>
        <div class="custom-toolbar-left">
          <el-space>
            <el-text type="primary">共 {{ tableData.length }} 条记录</el-text>
            <el-divider direction="vertical" />
            <el-text type="success">在职 {{ activeCount }} 人</el-text>
          </el-space>
        </div>
      </template>
      
      <!-- 表格顶部插槽 -->
      <template #tableTop>
        <div class="table-top-actions">
          <el-space>
            <el-button type="primary" size="small" @click="handleBatchAdd">
              <el-icon><Plus /></el-icon>
              批量添加
            </el-button>
            <el-button type="warning" size="small" @click="handleBatchEdit">
              <el-icon><Edit /></el-icon>
              批量编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleBatchDelete">
              <el-icon><Delete /></el-icon>
              批量删除
            </el-button>
          </el-space>
        </div>
      </template>
    </MaProTable>
  </div>
</template>

<script setup lang="tsx">
import { ref, reactive, computed, onMounted } from 'vue'
import type { MaProTableExpose, MaProTableOptions, MaProTableSchema } from "@mineadmin/pro-table"
import { useProTableToolbar } from '@mineadmin/pro-table'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { Plus, Edit, Delete, Download, Upload, Refresh, Setting, ChatDotRound, Warning } from '@element-plus/icons-vue'

const tableRef = ref<MaProTableExpose>()
const { add, remove, hide, show } = useProTableToolbar()
const tableData = ref<any[]>([])

// 计算在职人数
const activeCount = computed(() => {
  return tableData.value.filter(item => item.status === 1).length
})

// 注册自定义工具栏插件
onMounted(() => {
  // 数据统计工具
  add({
    name: 'statistics',
    render: ({ proxy }: any) => (
      <el-button
        circle
        type="info"
        title="数据统计"
        onClick={() => showStatistics()}
      >
        <el-icon><ChatDotRound /></el-icon>
      </el-button>
    ),
    show: true,
    order: 1
  })

  // 批量导出工具
  add({
    name: 'export',
    render: ({ proxy }: any) => (
      <el-button
        circle
        type="success"
        title="导出数据"
        onClick={() => handleExport(proxy)}
      >
        <el-icon><Download /></el-icon>
      </el-button>
    ),
    show: true,
    order: 2
  })

  // 批量导入工具
  add({
    name: 'import',
    render: ({ proxy }: any) => (
      <el-button
        circle
        type="warning"
        title="导入数据"
        onClick={() => handleImport(proxy)}
      >
        <el-icon><Upload /></el-icon>
      </el-button>
    ),
    show: true,
    order: 3
  })

  // 高级设置工具
  add({
    name: 'settings',
    render: ({ proxy }: any) => (
      <el-button
        circle
        type="primary"
        title="高级设置"
        onClick={() => showSettings(proxy)}
      >
        <el-icon><Setting /></el-icon>
      </el-button>
    ),
    show: true,
    order: 4
  })

  // 系统监控工具
  add({
    name: 'monitor',
    render: ({ proxy }: any) => (
      <el-button
        circle
        type="danger"
        title="系统监控"
        onClick={() => showMonitor()}
      >
        <el-icon><Warning /></el-icon>
      </el-button>
    ),
    show: true,
    order: 5
  })

  // 手动刷新工具（覆盖默认的刷新工具）
  add({
    name: 'refresh',
    render: ({ proxy }: any) => (
      <el-button
        circle
        title="刷新数据"
        onClick={() => handleCustomRefresh(proxy)}
      >
        <el-icon><Refresh /></el-icon>
      </el-button>
    ),
    show: true,
    order: 0
  })
})

// 工具栏功能函数
const showStatistics = () => {
  const stats = {
    total: tableData.value.length,
    active: activeCount.value,
    inactive: tableData.value.length - activeCount.value,
    avgSalary: Math.round(tableData.value.reduce((sum, item) => sum + item.salary, 0) / tableData.value.length)
  }
  
  ElNotification({
    title: '数据统计',
    message: `总员工: ${stats.total}人 | 在职: ${stats.active}人 | 离职: ${stats.inactive}人 | 平均薪资: ￥${stats.avgSalary.toLocaleString()}`,
    type: 'info',
    duration: 5000
  })
}

const handleExport = (proxy: any) => {
  ElMessage.success('导出功能触发，正在生成Excel文件...')
  // 模拟导出过程
  setTimeout(() => {
    ElNotification({
      title: '导出完成',
      message: '员工数据已成功导出到Excel文件',
      type: 'success'
    })
  }, 2000)
}

const handleImport = (proxy: any) => {
  ElMessageBox.confirm('确定要导入员工数据吗？这将覆盖现有数据。', '导入确认', {
    confirmButtonText: '确定导入',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('导入功能触发，正在处理文件...')
    setTimeout(() => {
      proxy?.refresh()
      ElNotification({
        title: '导入完成',
        message: '员工数据导入成功，表格已刷新',
        type: 'success'
      })
    }, 1500)
  })
}

const showSettings = (proxy: any) => {
  ElNotification({
    title: '高级设置',
    message: '表格配置、列显示设置、数据过滤规则等高级功能',
    type: 'info',
    duration: 3000
  })
}

const showMonitor = () => {
  ElNotification({
    title: '系统监控',
    message: 'CPU使用率: 45% | 内存使用率: 62% | 数据库连接: 正常',
    type: 'warning',
    duration: 4000
  })
}

const handleCustomRefresh = (proxy: any) => {
  ElMessage.info('正在刷新数据...')
  proxy?.refresh().then(() => {
    ElMessage.success('数据刷新完成')
  })
}

// 批量操作功能
const handleBatchAdd = () => {
  ElMessage.success('批量添加功能触发')
}

const handleBatchEdit = () => {
  ElMessage.warning('批量编辑功能触发')
}

const handleBatchDelete = () => {
  ElMessageBox.confirm('确定要删除选中的员工吗？', '批量删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('批量删除成功')
  })
}

// 模拟 API 接口
const getToolbarList = async (params: any) => {
  console.log('工具栏列表参数:', params)
  
  const data = [
    { 
      id: 1, 
      name: '张三', 
      department: '技术部', 
      position: '前端工程师', 
      salary: 15000, 
      status: 1, 
      createTime: '2024-01-15',
      lastActive: '2024-01-20 14:30:00'
    },
    { 
      id: 2, 
      name: '李四', 
      department: '产品部', 
      position: '产品经理', 
      salary: 18000, 
      status: 1, 
      createTime: '2024-01-16',
      lastActive: '2024-01-20 16:45:00'
    },
    { 
      id: 3, 
      name: '王五', 
      department: '设计部', 
      position: 'UI设计师', 
      salary: 12000, 
      status: 0, 
      createTime: '2024-01-17',
      lastActive: '2024-01-19 10:15:00'
    },
    { 
      id: 4, 
      name: '赵六', 
      department: '技术部', 
      position: '后端工程师', 
      salary: 16000, 
      status: 1, 
      createTime: '2024-01-18',
      lastActive: '2024-01-20 18:20:00'
    },
    { 
      id: 5, 
      name: '孙七', 
      department: '运营部', 
      position: '运营专员', 
      salary: 10000, 
      status: 1, 
      createTime: '2024-01-19',
      lastActive: '2024-01-20 12:10:00'
    },
    { 
      id: 6, 
      name: '周八', 
      department: '技术部', 
      position: '架构师', 
      salary: 25000, 
      status: 1, 
      createTime: '2024-01-10',
      lastActive: '2024-01-20 09:30:00'
    },
    { 
      id: 7, 
      name: '吴九', 
      department: '财务部', 
      position: '财务专员', 
      salary: 8000, 
      status: 0, 
      createTime: '2024-01-12',
      lastActive: '2024-01-18 17:45:00'
    }
  ]
  
  // 更新组件数据
  tableData.value = data
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          list: data,
          total: data.length
        }
      })
    }, 600)
  })
}

// 组件配置
const options = reactive<MaProTableOptions>({
  requestOptions: {
    api: getToolbarList,
    autoRequest: true,
    response: {
      totalKey: 'data.total',
      dataKey: 'data.list'
    }
  },
  tableOptions: {
    adaption: true,
    pagination: {
      total: 0,
      pageSize: 10
    },
    selection: true // 开启多选，配合批量操作
  },
  header: {
    show: true,
    mainTitle: '工具栏扩展示例',
    subTitle: '展示自定义工具栏功能'
  },
  toolStates: {
    // 控制内置工具栏的显示/隐藏
    size: true,      // 显示尺寸调整
    setting: true,   // 显示列设置
    fullscreen: true // 显示全屏
  }
})

// 表格架构
const schema = reactive<MaProTableSchema>({
  searchItems: [
    {
      label: '姓名',
      prop: 'name',
      render: 'input',
      renderProps: {
        placeholder: '请输入姓名'
      }
    },
    {
      label: '部门',
      prop: 'department',
      render: 'select',
      renderProps: {
        options: [
          { label: '技术部', value: '技术部' },
          { label: '产品部', value: '产品部' },
          { label: '设计部', value: '设计部' },
          { label: '运营部', value: '运营部' },
          { label: '财务部', value: '财务部' }
        ]
      }
    },
    {
      label: '状态',
      prop: 'status',
      render: 'select',
      renderProps: {
        options: [
          { label: '在职', value: 1 },
          { label: '离职', value: 0 }
        ]
      }
    }
  ],
  tableColumns: [
    { label: 'ID', prop: 'id', width: 60 },
    { label: '姓名', prop: 'name', width: 100 },
    { label: '部门', prop: 'department', width: 100 },
    { label: '职位', prop: 'position', width: 150 },
    { 
      label: '薪资', 
      prop: 'salary', 
      width: 120, 
      formatter: (row: any) => `￥${row.salary.toLocaleString()}`,
      sortable: true
    },
    { 
      label: '状态', 
      prop: 'status', 
      width: 80,
      cellRenderTo: {
        name: 'tag',
        props: (data: any) => ({
          type: data.row.status === 1 ? 'success' : 'info'
        })
      },
      formatter: (row: any) => row.status === 1 ? '在职' : '离职'
    },
    { label: '入职时间', prop: 'createTime', width: 120 },
    { label: '最后活跃', prop: 'lastActive', width: 160 },
    {
      type: 'operation',
      label: '操作',
      width: 200,
      operationConfigure: {
        type: 'tile',
        actions: [
          {
            name: 'view',
            text: '查看',
            onClick: (data: any) => {
              ElMessage.info(`查看员工: ${data.row.name}`)
            }
          },
          {
            name: 'edit',
            text: '编辑',
            onClick: (data: any) => {
              ElMessage.success(`编辑员工: ${data.row.name}`)
            }
          },
          {
            name: 'delete',
            text: '删除',
            onClick: (data: any) => {
              ElMessage.warning(`删除员工: ${data.row.name}`)
            },
            linkProps: {
              type: 'danger'
            }
          }
        ]
      }
    }
  ]
})
</script>

<style scoped>
.demo-toolbar-extensions {
  padding: 20px;
}

.demo-toolbar-extensions h3 {
  margin-bottom: 8px;
  color: #333;
}

.demo-toolbar-extensions p {
  margin-bottom: 16px;
  color: #666;
  font-size: 14px;
}

.toolbar-info {
  margin-bottom: 20px;
}

.custom-toolbar-left {
  display: flex;
  align-items: center;
  padding: 0 12px;
}

.table-top-actions {
  padding: 8px 0;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 8px;
  text-align: center;
}
</style>