<script setup lang="tsx">
import { ref } from 'vue'
import type {
  MaTableColumns,
  MaTableExpose,
  MaTableOptions
} from "@mineadmin/table"
import { ElMessage } from 'element-plus'

const tableRef = ref<MaTableExpose>()

// 排序列配置
const columns = ref<MaTableColumns[]>([
  { label: '商品名称', prop: 'name', sortable: true },
  { 
    label: '价格', 
    prop: 'price', 
    sortable: 'custom',
    width: 120,
    cellRender: ({ row }) => <span style="color: #e74c3c; font-weight: bold;">￥{row.price}</span>
  },
  { 
    label: '销量', 
    prop: 'sales', 
    sortable: true,
    sortOrders: ['ascending', 'descending', null]
  },
  { 
    label: '评分', 
    prop: 'rating', 
    sortable: true,
    cellRender: ({ row }) => (
      <div style="display: flex; align-items: center; gap: 4px;">
        <span style="color: #f39c12;">⭐</span>
        <span>{row.rating}</span>
      </div>
    )
  },
  { 
    label: '状态', 
    prop: 'status',
    cellRender: ({ row }) => (
      <el-tag type={row.status === '在售' ? 'success' : 'danger'}>
        {row.status}
      </el-tag>
    )
  }
])

// 排序配置
const options = ref<MaTableOptions>({
  stripe: true,
  border: true,
  defaultSort: { prop: 'price', order: 'descending' },
  on: {
    onSortChange: ({ column, prop, order }) => {
      ElMessage.info(`排序变更：${column?.label} - ${order || '取消排序'}`)
    }
  }
})

// 商品数据
const data: any[] = [
  { id: 1, name: 'iPhone 15 Pro', price: 7999, sales: 15420, rating: 4.8, status: '在售' },
  { id: 2, name: 'MacBook Air M2', price: 8999, sales: 8936, rating: 4.9, status: '在售' },
  { id: 3, name: 'iPad Pro 12.9', price: 6799, sales: 12650, rating: 4.7, status: '在售' },
  { id: 4, name: 'Apple Watch Ultra', price: 6299, sales: 5888, rating: 4.6, status: '缺货' },
  { id: 5, name: 'AirPods Pro 2', price: 1899, sales: 28750, rating: 4.8, status: '在售' },
  { id: 6, name: 'Mac Studio M2', price: 14999, sales: 1256, rating: 4.9, status: '在售' },
  { id: 7, name: 'HomePod mini', price: 749, sales: 9450, rating: 4.3, status: '缺货' },
]
</script>

<template>
  <div class="demo-sorting-table">
    <h3>表格排序</h3>
    <p>支持多种排序方式：内置排序、自定义排序、多级排序等。</p>
    
    <div class="demo-features">
      <ul>
        <li><strong>内置排序</strong>：商品名称、销量、评分支持自动排序</li>
        <li><strong>自定义排序</strong>：价格列使用自定义排序逻辑</li>
        <li><strong>默认排序</strong>：表格默认按价格降序排列</li>
        <li><strong>排序顺序</strong>：销量列支持升序、降序、无序三种状态</li>
      </ul>
    </div>
    
    <ma-table
      ref="tableRef"
      :columns="columns"
      :data="data"
      :options="options"
    />
  </div>
</template>

<style scoped>
.demo-sorting-table {
  padding: 20px;
}
.demo-sorting-table h3 {
  margin-bottom: 8px;
  color: #333;
}
.demo-sorting-table p {
  margin-bottom: 16px;
  color: #666;
  font-size: 14px;
}
.demo-features {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 20px;
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