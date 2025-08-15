<script setup lang="tsx">
import { ref, computed } from 'vue'
import type {
  MaTableColumns,
  MaTableExpose,
  MaTableOptions,
  PaginationProps
} from "@mineadmin/table"
import { ElMessage, ElButton } from 'element-plus'

const tableRef = ref<MaTableExpose>()

// 分页状态
const pagination = ref<PaginationProps>({
  currentPage: 1,
  pageSize: 5,
  total: 50,
  layout: 'total, sizes, prev, pager, next, jumper',
  pageSizes: [5, 10, 20, 50],
  background: true,
  small: false,
  onCurrentChange: (currentPage: number) => {
    console.log('页码变化:', currentPage)
    pagination.value.currentPage = currentPage
    ElMessage.success(`切换到第 ${currentPage} 页`)
  },
  onSizeChange: (pageSize: number) => {
    console.log('页面大小变化:', pageSize)
    pagination.value.pageSize = pageSize
    pagination.value.currentPage = 1 // 重置到第一页
    ElMessage.success(`每页 ${pageSize} 条`)
  }
})

// 列配置
const columns = ref<MaTableColumns[]>([
  { 
    label: '订单号', 
    prop: 'orderNo', 
    width: 160,
    cellRender: ({ row }) => (
      <span style="font-family: monospace; color: #409eff;">#{row.orderNo}</span>
    )
  },
  { label: '客户姓名', prop: 'customerName', width: 120 },
  { 
    label: '商品信息', 
    prop: 'productInfo',
    cellRender: ({ row }) => (
      <div>
        <div style="font-weight: bold;">{row.productName}</div>
        <div style="font-size: 12px; color: #999;">数量: {row.quantity}</div>
      </div>
    )
  },
  { 
    label: '订单金额', 
    prop: 'amount',
    width: 120,
    cellRender: ({ row }) => (
      <span style="color: #e74c3c; font-weight: bold;">
        ￥{row.amount.toFixed(2)}
      </span>
    )
  },
  { 
    label: '订单状态', 
    prop: 'status',
    width: 100,
    cellRender: ({ row }) => {
      const statusConfig = {
        'pending': { type: 'warning', text: '待付款' },
        'paid': { type: 'success', text: '已付款' },
        'shipped': { type: 'info', text: '已发货' },
        'delivered': { type: 'success', text: '已送达' },
        'cancelled': { type: 'danger', text: '已取消' }
      }
      const config = statusConfig[row.status as keyof typeof statusConfig]
      return <el-tag type={config.type}>{config.text}</el-tag>
    }
  },
  { label: '下单时间', prop: 'createTime', width: 160 }
])

// 表格配置
const options = computed<MaTableOptions>(() => {
  const opts:MaTableOptions = {
    stripe: true,
    border: true,
    size: 'default',
    showSummary: true,
    sumText: '总计',
    summaryMethod: (param) => {
      const { columns, data } = param
      const sums: any[] = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          return
        }
        if (column.property === 'amount') {
          const values = data.map(item => Number(item.amount))
          if (!values.every(value => Number.isNaN(value))) {
            sums[index] = `￥${values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!Number.isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0).toFixed(2)}`
          } else {
            sums[index] = '--'
          }
        } else {
          sums[index] = '--'
        }
      })
      return sums
    },
    pagination: pagination.value,
    showPagination:true
  }
  console.log('表格配置 - 分页配置:', opts.pagination)
  return opts
})

// 模拟完整数据（50条）
const generateMockData = (total: number) => {
  const products = ['MacBook Pro', 'iPhone 15', 'iPad Air', 'AirPods Pro', 'Apple Watch']
  const customers = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十']
  const statuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']
  
  return Array.from({ length: total }, (_, i) => ({
    id: i + 1,
    orderNo: `ORD${String(i + 1).padStart(6, '0')}`,
    customerName: customers[i % customers.length],
    productName: products[i % products.length],
    quantity: Math.floor(Math.random() * 5) + 1,
    amount: Math.random() * 5000 + 500,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    createTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleString()
  }))
}

const allData = generateMockData(50)

// 当前页数据
const currentPageData = computed(() => {
  const start = (pagination.value.currentPage - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return allData.slice(start, end)
})


// 动态更新分页配置
const updatePaginationConfig = (config: Partial<PaginationProps>) => {
  Object.assign(pagination.value, config)
  tableRef.value?.setPagination(pagination.value)
  ElMessage.info('分页配置已更新')
}

// 重置分页
const resetPagination = () => {
  pagination.value = {
    currentPage: 1,
    pageSize: 5,
    total: 50,
    layout: 'total, sizes, prev, pager, next, jumper',
    pageSizes: [5, 10, 20, 50],
    background: true,
    small: false,
  }
  tableRef.value?.setPagination(pagination.value)
  ElMessage.info('分页已重置')
}

// 模拟异步加载数据
const loadMoreData = () => {
  const newData = generateMockData(20)
  allData.push(...newData)
  pagination.value.total += 20
  tableRef.value?.setPagination(pagination.value)
  ElMessage.success(`新增了 20 条数据，总计 ${allData.length} 条`)
}
</script>

<template>
  <div class="demo-pagination-table">
    <h3>分页表格</h3>
    <p>展示完整的分页功能，包括分页配置、事件处理、动态更新等。</p>
    
    <!-- 分页控制面板 -->
    <div class="control-panel">
      <div class="panel-section">
        <h4>分页配置</h4>
        <div class="config-buttons">
          <el-button 
            size="small" 
            @click="updatePaginationConfig({ background: !pagination.background })"
          >
            切换背景色
          </el-button>
          <el-button 
            size="small" 
            @click="updatePaginationConfig({ small: !pagination.small })"
          >
            切换尺寸
          </el-button>
          <el-button 
            size="small" 
            @click="updatePaginationConfig({ 
              layout: pagination.layout?.includes('jumper') 
                ? 'total, sizes, prev, pager, next' 
                : 'total, sizes, prev, pager, next, jumper' 
            })"
          >
            切换跳页器
          </el-button>
        </div>
      </div>
      
      <div class="panel-section">
        <h4>数据操作</h4>
        <div class="data-buttons">
          <el-button type="primary" @click="loadMoreData">
            模拟加载更多数据
          </el-button>
          <el-button @click="resetPagination">
            重置分页配置
          </el-button>
        </div>
      </div>
      
      <div class="panel-section">
        <h4>当前分页信息</h4>
        <div class="pagination-info">
          <span>当前页：{{ pagination.currentPage }}</span>
          <span>每页条数：{{ pagination.pageSize }}</span>
          <span>总条数：{{ pagination.total }}</span>
          <span>总页数：{{ Math.ceil(pagination.total / pagination.pageSize) }}</span>
        </div>
      </div>
    </div>
    
    <ma-table
      ref="tableRef"
      :columns="columns"
      :data="currentPageData"
      :options="options"
    >
      <template #pageLeft>
        <div class="page-left-content">
          <span style="color: #666; font-size: 14px;">
            显示第 {{ (pagination.currentPage - 1) * pagination.pageSize + 1 }} - 
            {{ Math.min(pagination.currentPage * pagination.pageSize, pagination.total) }} 条，
            共 {{ pagination.total }} 条记录
          </span>
        </div>
      </template>
    </ma-table>
    
    <div class="demo-features">
      <h4>功能特性：</h4>
      <ul>
        <li><strong>完整分页</strong>：支持页码、页面大小切换、跳转等</li>
        <li><strong>自定义布局</strong>：可配置分页组件的显示元素</li>
        <li><strong>事件处理</strong>：页码变化时的回调处理</li>
        <li><strong>动态配置</strong>：运行时修改分页参数</li>
        <li><strong>总计行</strong>：支持显示汇总信息</li>
        <li><strong>插槽扩展</strong>：pageLeft 插槽显示自定义信息</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.demo-pagination-table {
  padding: 20px;
}

.demo-pagination-table h3 {
  margin-bottom: 8px;
  color: #333;
}

.demo-pagination-table p {
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

.config-buttons,
.data-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.pagination-info {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  font-size: 14px;
  color: #555;
}

.page-left-content {
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