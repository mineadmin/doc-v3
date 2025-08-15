<template>
  <div class="demo-custom-operations">
    <h3>自定义操作</h3>
    <p>展示不同类型的操作列配置，包含条件显示、自定义样式和复杂操作逻辑。</p>
    
    <div class="control-panel">
      <el-space>
        <el-button @click="batchApprove" type="primary">批量审批</el-button>
        <el-button @click="exportData" type="success">导出数据</el-button>
        <el-button @click="refreshTable">刷新表格</el-button>
      </el-space>
    </div>
    
    <MaProTable 
      ref="tableRef" 
      :options="options" 
      :schema="schema"
      @row-drag-sort="handleRowDragSort"
    />
  </div>
</template>

<script setup lang="tsx">
import { ref, reactive } from 'vue'
import type { MaProTableExpose, MaProTableOptions, MaProTableSchema } from "@mineadmin/pro-table"
import { ElMessage, ElMessageBox } from 'element-plus'

const tableRef = ref<MaProTableExpose>()

// 模拟 API 接口
const getOperationsList = async (params: any) => {
  console.log('操作列表参数:', params)
  
  const data = [
    { 
      id: 1, 
      title: '系统升级申请', 
      applicant: '张三',
      department: '技术部',
      priority: 'high',
      status: 'pending',
      amount: 50000,
      description: '升级服务器硬件配置',
      createTime: '2024-01-15',
      approver: '',
      canEdit: true,
      canApprove: true,
      canDelete: false
    },
    { 
      id: 2, 
      title: '营销活动预算', 
      applicant: '李四',
      department: '市场部',
      priority: 'medium',
      status: 'approved',
      amount: 100000,
      description: '春节营销活动推广费用',
      createTime: '2024-01-16',
      approver: '王总',
      canEdit: false,
      canApprove: false,
      canDelete: false
    },
    { 
      id: 3, 
      title: '团建活动申请', 
      applicant: '王五',
      department: '人事部',
      priority: 'low',
      status: 'rejected',
      amount: 20000,
      description: '季度团建活动费用申请',
      createTime: '2024-01-17',
      approver: '李总',
      canEdit: true,
      canApprove: false,
      canDelete: true
    },
    { 
      id: 4, 
      title: '办公设备采购', 
      applicant: '赵六',
      department: '行政部',
      priority: 'medium',
      status: 'processing',
      amount: 80000,
      description: '采购新一批办公电脑和显示器',
      createTime: '2024-01-18',
      approver: '张总',
      canEdit: false,
      canApprove: true,
      canDelete: false
    },
    { 
      id: 5, 
      title: '培训课程费用', 
      applicant: '孙七',
      department: '技术部',
      priority: 'high',
      status: 'pending',
      amount: 30000,
      description: '员工技能提升培训课程',
      createTime: '2024-01-19',
      approver: '',
      canEdit: true,
      canApprove: true,
      canDelete: false
    }
  ]
  
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

// 控制面板操作
const batchApprove = () => {
  ElMessageBox.confirm('确定要批量审批选中的申请吗?', '批量操作', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('批量审批成功')
  })
}

const exportData = () => {
  ElMessage.success('数据导出功能触发')
}

const refreshTable = () => {
  tableRef.value?.refresh()
  ElMessage.info('表格刷新完成')
}

// 拖拽排序
const handleRowDragSort = (tableData: any[]) => {
  ElMessage.success(`拖拽排序完成，新顺序: ${tableData.map(item => item.title).join(', ')}`)
}

// 组件配置
const options = reactive<MaProTableOptions>({
  requestOptions: {
    api: getOperationsList,
    autoRequest: true,

  },
  tableOptions: {
    adaption: true,
    pagination: {
      total: 0,
      pageSize: 10
    },
    selection: true, // 开启多选
    rowDrag: true    // 开启行拖拽
  },
  header: {
    show: true,
    mainTitle: '申请单管理',
    subTitle: '支持多种操作类型'
  },
  rowContextMenu: {
    enabled: true,
    items: [
      {
        label: '查看详情',
        icon: 'view',
        onMenuClick: (data: any) => {
          ElMessage.info(`查看申请单: ${data.row.title}`)
        }
      },
      {
        label: '复制申请',
        icon: 'copy',
        onMenuClick: (data: any) => {
          ElMessage.success(`复制申请单: ${data.row.title}`)
        }
      },
      {
        label: '导出PDF',
        icon: 'download',
        onMenuClick: (data: any) => {
          ElMessage.success(`导出PDF: ${data.row.title}`)
        }
      },
      {
        label: '删除',
        icon: 'delete',
        disabled: (data: any) => !data.row.canDelete,
        onMenuClick: (data: any) => {
          ElMessage.warning(`删除申请单: ${data.row.title}`)
        }
      }
    ]
  }
})

// 表格架构
const schema = reactive<MaProTableSchema>({
  searchItems: [
    {
      label: '申请标题',
      prop: 'title',
      render: 'input',
      renderProps: {
        placeholder: '请输入申请标题'
      }
    },
    {
      label: '申请状态',
      prop: 'status',
      render: 'select',
      renderProps: {
        options: [
          { label: '待审批', value: 'pending' },
          { label: '审批中', value: 'processing' },
          { label: '已通过', value: 'approved' },
          { label: '已拒绝', value: 'rejected' }
        ]
      }
    },
    {
      label: '优先级',
      prop: 'priority',
      render: 'select',
      renderProps: {
        options: [
          { label: '高', value: 'high' },
          { label: '中', value: 'medium' },
          { label: '低', value: 'low' }
        ]
      }
    }
  ],
  tableColumns: [
    { type: 'sort', width: 60 }, // 拖拽排序列
    { label: 'ID', prop: 'id', width: 60 },
    { label: '申请标题', prop: 'title', width: 200, fixed: 'left' },
    { label: '申请人', prop: 'applicant', width: 100 },
    { label: '部门', prop: 'department', width: 100 },
    { 
      label: '优先级', 
      prop: 'priority', 
      width: 100,
      cellRenderTo: {
        name: 'tag',
        props: (data: any) => {
          const priorityMap = {
            high: { type: 'danger', text: '高' },
            medium: { type: 'warning', text: '中' },
            low: { type: 'info', text: '低' }
          }
          return {
            type: priorityMap[data.row.priority]?.type || 'info'
          }
        }
      },
      formatter: (row: any) => {
        const priorityMap = { high: '高', medium: '中', low: '低' }
        return priorityMap[row.priority] || row.priority
      }
    },
    { 
      label: '申请状态', 
      prop: 'status', 
      width: 120,
      cellRender: ({ row }: any) => {
        const statusMap = {
          pending: { type: 'warning', text: '待审批' },
          processing: { type: 'primary', text: '审批中' },
          approved: { type: 'success', text: '已通过' },
          rejected: { type: 'danger', text: '已拒绝' }
        }
        const config = statusMap[row.status] || { type: 'info', text: row.status }
        return <el-tag type={config.type}>{config.text}</el-tag>
      }
    },
    { 
      label: '申请金额', 
      prop: 'amount', 
      width: 120,
      formatter: (row: any) => `￥${row.amount.toLocaleString()}`,
      sortable: true
    },
    { label: '申请描述', prop: 'description', width: 200, showOverflowTooltip: true },
    { label: '申请时间', prop: 'createTime', width: 120 },
    { label: '审批人', prop: 'approver', width: 100 },
    {
      type: 'operation',
      label: '操作',
      width: 280,
      fixed: 'right',
      operationConfigure: {
        type: 'auto',
        fold: 2,
        actions: [
          {
            name: 'view',
            text: '详情',
            icon: 'view',
            onClick: (data: any) => {
              ElMessage.info(`查看申请详情: ${data.row.title}`)
            }
          },
          {
            name: 'edit',
            text: '编辑',
            icon: 'edit',
            show: (data: any) => data.row.canEdit,
            onClick: (data: any) => {
              ElMessage.success(`编辑申请: ${data.row.title}`)
            }
          },
          {
            name: 'approve',
            text: '审批',
            icon: 'check',
            show: (data: any) => data.row.canApprove && data.row.status === 'pending',
            onClick: (data: any) => {
              ElMessageBox.confirm(`确定要审批申请"${data.row.title}"吗?`, '审批确认', {
                confirmButtonText: '通过',
                cancelButtonText: '拒绝',
                distinguishCancelAndClose: true,
                type: 'warning'
              }).then(() => {
                ElMessage.success(`申请已通过: ${data.row.title}`)
                // 刷新表格
                tableRef.value?.refresh()
              }).catch((action: string) => {
                if (action === 'cancel') {
                  ElMessage.info(`申请已拒绝: ${data.row.title}`)
                  tableRef.value?.refresh()
                }
              })
            },
            linkProps: {
              type: 'success'
            }
          },
          {
            name: 'process',
            text: '处理',
            icon: 'setting',
            show: (data: any) => data.row.status === 'processing',
            onClick: (data: any) => {
              ElMessage.warning(`处理申请: ${data.row.title}`)
            },
            linkProps: {
              type: 'warning'
            }
          },
          {
            name: 'copy',
            text: '复制',
            icon: 'copy',
            onClick: (data: any) => {
              ElMessage.success(`复制申请: ${data.row.title}`)
            }
          },
          {
            name: 'export',
            text: '导出',
            icon: 'download',
            onClick: (data: any) => {
              ElMessage.success(`导出申请: ${data.row.title}`)
            }
          },
          {
            name: 'history',
            text: '历史',
            icon: 'time',
            onClick: (data: any) => {
              ElMessage.info(`查看申请历史: ${data.row.title}`)
            }
          },
          {
            name: 'delete',
            text: '删除',
            icon: 'delete',
            show: (data: any) => data.row.canDelete,
            onClick: (data: any) => {
              ElMessageBox.confirm(`确定要删除申请"${data.row.title}"吗?`, '删除确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                ElMessage.success(`申请已删除: ${data.row.title}`)
                tableRef.value?.refresh()
              })
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
.demo-custom-operations {
  padding: 20px;
}

.demo-custom-operations h3 {
  margin-bottom: 8px;
  color: #333;
}

.demo-custom-operations p {
  margin-bottom: 16px;
  color: #666;
  font-size: 14px;
}

.control-panel {
  margin-bottom: 16px;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 6px;
}
</style>