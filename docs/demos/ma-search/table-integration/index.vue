<template>
  <div>
    <h3>表格集成</h3>
    <p>演示 ma-search 与数据表格的集成使用，包括搜索、分页、排序等完整的数据管理流程。</p>
    
    <div class="search-table-container p-5">
      <ma-search
        ref="searchRef"
        :search-items="searchItems"
        :form-options="formOptions"
        :options="searchOptions"
        @search="handleSearch"
        @reset="handleReset"
      >
        <template #afterActions>
          <el-button type="success" @click="handleAdd" icon="Plus">
            新增用户
          </el-button>
          <el-button type="info" @click="handleRefresh" icon="Refresh">
            刷新
          </el-button>
        </template>
      </ma-search>

      <div class="table-toolbar">
        <div class="toolbar-left">
          <span class="result-count">共 {{ tableData.total }} 条记录</span>
          <el-button 
            v-if="selectedRows.length" 
            type="danger" 
            size="small"
            @click="handleBatchDelete"
          >
            批量删除 ({{ selectedRows.length }})
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-button-group>
            <el-button 
              size="small" 
              :type="viewMode === 'table' ? 'primary' : ''"
              @click="viewMode = 'table'"
            >
              表格视图
            </el-button>
            <el-button 
              size="small" 
              :type="viewMode === 'card' ? 'primary' : ''"
              @click="viewMode = 'card'"
            >
              卡片视图
            </el-button>
          </el-button-group>
        </div>
      </div>

      <!-- 表格视图 -->
      <div v-show="viewMode === 'table'" class="table-view">
        <el-table
          ref="tableRef"
          v-loading="loading"
          :data="tableData.list"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
          stripe
          border
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="ID" width="80" sortable="custom" />
          <el-table-column prop="username" label="用户名" min-width="120" />
          <el-table-column prop="email" label="邮箱" min-width="180" />
          <el-table-column prop="phone" label="手机号" width="140" />
          <el-table-column prop="department" label="部门" width="100">
            <template #default="{ row }">
              <el-tag :type="getDepartmentTagType(row.department)">
                {{ getDepartmentName(row.department) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="80">
            <template #default="{ row }">
              <el-switch 
                v-model="row.status" 
                :active-value="1"
                :inactive-value="0"
                @change="handleStatusChange(row)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建时间" width="180" sortable="custom" />
          <el-table-column label="操作" width="160" fixed="right">
            <template #default="{ row }">
              <el-button size="small" type="primary" @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 卡片视图 -->
      <div v-show="viewMode === 'card'" class="card-view" v-loading="loading">
        <div class="card-grid">
          <div v-for="item in tableData.list" :key="item.id" class="user-card">
            <div class="card-header">
              <div class="user-avatar">
                <el-avatar :size="50">{{ item.username.charAt(0).toUpperCase() }}</el-avatar>
              </div>
              <div class="user-info">
                <h4>{{ item.username }}</h4>
                <p>{{ item.email }}</p>
              </div>
              <div class="card-actions">
                <el-dropdown @command="(cmd) => handleCardAction(cmd, item)">
                  <el-button type="text" icon="More" />
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="edit">编辑</el-dropdown-item>
                      <el-dropdown-item command="delete">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
            <div class="card-body">
              <div class="info-row">
                <span class="label">手机:</span>
                <span>{{ item.phone }}</span>
              </div>
              <div class="info-row">
                <span class="label">部门:</span>
                <el-tag size="small" :type="getDepartmentTagType(item.department)">
                  {{ getDepartmentName(item.department) }}
                </el-tag>
              </div>
              <div class="info-row">
                <span class="label">状态:</span>
                <el-tag size="small" :type="item.status ? 'success' : 'danger'">
                  {{ item.status ? '启用' : '禁用' }}
                </el-tag>
              </div>
              <div class="info-row">
                <span class="label">创建时间:</span>
                <span>{{ item.created_at }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :total="tableData.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { ref, reactive, onMounted } from 'vue'
import type { MaSearchItem } from '@mineadmin/search'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchRef = ref<any>(null)
const tableRef = ref<any>(null)
const loading = ref(false)
const selectedRows = ref<any[]>([])
const viewMode = ref<'table' | 'card'>('table')

// 搜索条件
const searchItems = ref<MaSearchItem[]>([
  {
    label: '用户名',
    prop: 'username',
    render: 'input',
    renderProps: { placeholder: '请输入用户名', clearable: true }
  },
  {
    label: '邮箱',
    prop: 'email',
    render: 'input',
    renderProps: {
      placeholder: '请输入邮箱', clearable: true
    }
  },
  {
    label: '手机号',
    prop: 'phone',
    render: 'input',
    renderProps: { placeholder: '请输入手机号', clearable: true }
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
        { label: '运营部', value: 'operation' },
        { label: '市场部', value: 'marketing' }
      ]
    }
  },
  {
    label: '状态',
    prop: 'status',
    render: 'select',
    renderProps: {
      options: [
        { label: '全部状态', value: '' },
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ]
    }
  },
  {
    label: '创建时间',
    prop: 'created_at',
    render: 'datePicker',
    renderProps: {
      type: 'datetimerange',
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间',
      format: 'YYYY-MM-DD HH:mm:ss'
    }
  }
])

const formOptions = {
  labelWidth: '100px'
}

const searchOptions = {
  fold: true,
  foldRows: 2,
  cols: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
  text: {
    searchBtn: () => '查询',
    resetBtn: () => '重置'
  }
}

// 分页参数
const pagination = reactive({
  page: 1,
  size: 20
})

// 排序参数
const sortParams = ref<{prop?: string, order?: string}>({})

// 当前搜索条件
const searchCondition = ref<any>({})

// 表格数据
const tableData = ref<{list: any[], total: number}>({
  list: [],
  total: 0
})

// 模拟数据
const mockData = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  username: `user_${index + 1}`,
  email: `user${index + 1}@example.com`,
  phone: `138${String(index + 1).padStart(8, '0')}`,
  department: ['tech', 'product', 'operation', 'marketing'][index % 4],
  status: index % 3 !== 0 ? 1 : 0,
  created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleString()
}))

// 获取部门名称
const getDepartmentName = (dept: string) => {
  const names: Record<string, string> = {
    tech: '技术部',
    product: '产品部',
    operation: '运营部',
    marketing: '市场部'
  }
  return names[dept] || dept
}

// 获取部门标签类型
const getDepartmentTagType = (dept: string) => {
  const types: Record<string, string> = {
    tech: 'primary',
    product: 'success',
    operation: 'warning',
    marketing: 'info'
  }
  return types[dept] || ''
}

// 加载数据
const loadData = async () => {
  loading.value = true
  
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let filteredData = [...mockData]
    
    // 应用搜索条件
    if (searchCondition.value.username) {
      filteredData = filteredData.filter(item => 
        item.username.includes(searchCondition.value.username)
      )
    }
    if (searchCondition.value.email) {
      filteredData = filteredData.filter(item => 
        item.email.includes(searchCondition.value.email)
      )
    }
    if (searchCondition.value.phone) {
      filteredData = filteredData.filter(item => 
        item.phone.includes(searchCondition.value.phone)
      )
    }
    if (searchCondition.value.department) {
      filteredData = filteredData.filter(item => 
        item.department === searchCondition.value.department
      )
    }
    if (searchCondition.value.status !== undefined && searchCondition.value.status !== '') {
      filteredData = filteredData.filter(item => 
        item.status === searchCondition.value.status
      )
    }
    
    // 应用排序
    if (sortParams.value.prop) {
      filteredData.sort((a, b) => {
        const aVal = a[sortParams.value.prop!]
        const bVal = b[sortParams.value.prop!]
        const result = aVal > bVal ? 1 : -1
        return sortParams.value.order === 'ascending' ? result : -result
      })
    }
    
    const total = filteredData.length
    const start = (pagination.page - 1) * pagination.size
    const end = start + pagination.size
    const list = filteredData.slice(start, end)
    
    tableData.value = { list, total }
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = (formData: any) => {
  searchCondition.value = formData
  pagination.page = 1
  loadData()
  ElMessage.success('查询完成')
}

// 重置处理
const handleReset = () => {
  searchCondition.value = {}
  pagination.page = 1
  sortParams.value = {}
  loadData()
  ElMessage.info('已重置查询条件')
}

// 分页处理
const handlePageChange = (page: number) => {
  pagination.page = page
  loadData()
}

const handleSizeChange = (size: number) => {
  pagination.size = size
  pagination.page = 1
  loadData()
}

// 排序处理
const handleSortChange = ({ prop, order }: any) => {
  sortParams.value = { prop, order }
  loadData()
}

// 选择处理
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
}

// 状态切换
const handleStatusChange = (row: any) => {
  ElMessage.success(`用户 ${row.username} 状态已${row.status ? '启用' : '禁用'}`)
  // 这里可以调用API更新状态
}

// 操作处理
const handleAdd = () => {
  ElMessage.info('打开新增用户对话框')
}

const handleEdit = (row: any) => {
  ElMessage.info(`编辑用户: ${row.username}`)
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确认删除用户 ${row.username}？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    loadData()
  })
}

const handleBatchDelete = () => {
  ElMessageBox.confirm(`确认删除选中的 ${selectedRows.value.length} 个用户？`, '批量删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success(`已删除 ${selectedRows.value.length} 个用户`)
    selectedRows.value = []
    loadData()
  })
}

const handleRefresh = () => {
  loadData()
  ElMessage.success('数据已刷新')
}

const handleCardAction = (command: string, item: any) => {
  if (command === 'edit') {
    handleEdit(item)
  } else if (command === 'delete') {
    handleDelete(item)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.search-table-container {
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  overflow: hidden;
  background-color: #fff;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e4e7ed;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.result-count {
  font-size: 14px;
  color: #606266;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.table-view {
  padding: 0;
}

.card-view {
  padding: 20px;
  min-height: 400px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.user-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.user-card:hover {
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #fafafa;
  border-bottom: 1px solid #e4e7ed;
}

.user-avatar {
  margin-right: 12px;
}

.user-info {
  flex: 1;
}

.user-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.user-info p {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.card-actions {
  margin-left: auto;
}

.card-body {
  padding: 16px;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-row .label {
  width: 60px;
  color: #909399;
  margin-right: 8px;
}

.pagination-wrapper {
  padding: 16px 20px;
  background-color: #f8f9fa;
  border-top: 1px solid #e4e7ed;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .table-toolbar {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .toolbar-left,
  .toolbar-right {
    justify-content: center;
  }
  
  .card-grid {
    grid-template-columns: 1fr;
  }
}
</style>