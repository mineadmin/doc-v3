<script setup lang="tsx">
import { ref } from 'vue'
import type {
  MaTableColumns,
  MaTableExpose,
  MaTableOptions
} from "@mineadmin/table"
import { ElMessage, ElInput, ElSelect, ElOption } from 'element-plus'

const tableRef = ref<MaTableExpose>()
const searchName = ref('')
const filterDepartment = ref('')

// 筛选列配置
const columns = ref<MaTableColumns[]>([
  { label: '姓名', prop: 'name', width: 120 },
  { 
    label: '部门', 
    prop: 'department',
    filters: [
      { text: '技术部', value: '技术部' },
      { text: '产品部', value: '产品部' },
      { text: '设计部', value: '设计部' },
      { text: '市场部', value: '市场部' },
    ],
    filterMethod: (value: string, row: any) => row.department === value
  },
  { 
    label: '职级', 
    prop: 'level',
    filters: [
      { text: 'P5', value: 'P5' },
      { text: 'P6', value: 'P6' },
      { text: 'P7', value: 'P7' },
      { text: 'P8', value: 'P8' },
    ],
    filterMethod: (value: string, row: any) => row.level === value,
    filterMultiple: true
  },
  { 
    label: '薪资范围', 
    prop: 'salary',
    cellRender: ({ row }) => <span style="color: #27ae60; font-weight: bold;">￥{row.salary}k</span>,
    filters: [
      { text: '10k以下', value: 'low' },
      { text: '10k-20k', value: 'medium' },
      { text: '20k-30k', value: 'high' },
      { text: '30k以上', value: 'very-high' },
    ],
    filterMethod: (value: string, row: any) => {
      switch (value) {
        case 'low': return row.salary < 10
        case 'medium': return row.salary >= 10 && row.salary < 20
        case 'high': return row.salary >= 20 && row.salary < 30
        case 'very-high': return row.salary >= 30
        default: return true
      }
    }
  },
  { 
    label: '状态', 
    prop: 'status',
    cellRender: ({ row }) => (
      <el-tag type={
        row.status === '在职' ? 'success' : 
        row.status === '请假' ? 'warning' : 'danger'
      }>
        {row.status}
      </el-tag>
    )
  }
])

// 筛选配置
const options = ref<MaTableOptions>({
  stripe: true,
  border: true,
  on: {
    onFilterChange: (filters) => {
      console.log('筛选条件变更：', filters)
      ElMessage.info('筛选条件已更新')
    }
  }
})

// 原始数据
const originalData: any[] = [
  { id: 1, name: '张三', department: '技术部', level: 'P6', salary: 18, status: '在职' },
  { id: 2, name: '李四', department: '产品部', level: 'P7', salary: 25, status: '在职' },
  { id: 3, name: '王五', department: '设计部', level: 'P5', salary: 12, status: '请假' },
  { id: 4, name: '赵六', department: '技术部', level: 'P8', salary: 35, status: '在职' },
  { id: 5, name: '孙七', department: '市场部', level: 'P6', salary: 16, status: '离职' },
  { id: 6, name: '周八', department: '技术部', level: 'P7', salary: 28, status: '在职' },
  { id: 7, name: '吴九', department: '产品部', level: 'P6', salary: 22, status: '在职' },
  { id: 8, name: '郑十', department: '设计部', level: 'P5', salary: 14, status: '请假' },
  { id: 9, name: '王十一', department: '市场部', level: 'P7', salary: 20, status: '在职' },
  { id: 10, name: '李十二', department: '技术部', level: 'P8', salary: 40, status: '在职' },
]

// 筛选后的数据
const filteredData = ref([...originalData])

// 名称搜索
const handleNameSearch = () => {
  applyFilters()
}

// 部门筛选
const handleDepartmentFilter = () => {
  applyFilters()
}

// 应用筛选
const applyFilters = () => {
  let data = [...originalData]
  
  // 名称搜索
  if (searchName.value.trim()) {
    data = data.filter(item => 
      item.name.includes(searchName.value.trim())
    )
  }
  
  // 部门筛选
  if (filterDepartment.value) {
    data = data.filter(item => 
      item.department === filterDepartment.value
    )
  }
  
  filteredData.value = data
  ElMessage.success(`筛选完成，共找到 ${data.length} 条记录`)
}

// 清空筛选
const clearFilters = () => {
  searchName.value = ''
  filterDepartment.value = ''
  filteredData.value = [...originalData]
  tableRef.value?.getElTableRef()?.clearFilter()
  ElMessage.info('已清空所有筛选条件')
}
</script>

<template>
  <div class="demo-filter-table">
    <h3>表格筛选</h3>
    <p>支持多种筛选方式：列头筛选、自定义搜索、组合筛选等。</p>
    
    <!-- 自定义搜索区域 -->
    <div class="filter-controls">
      <div class="filter-item">
        <label>姓名搜索：</label>
        <el-input
          v-model="searchName"
          placeholder="请输入姓名"
          style="width: 200px"
          @input="handleNameSearch"
          clearable
        />
      </div>
      <div class="filter-item">
        <label>部门筛选：</label>
        <el-select
          v-model="filterDepartment"
          placeholder="请选择部门"
          style="width: 150px"
          @change="handleDepartmentFilter"
          clearable
        >
          <el-option label="技术部" value="技术部" />
          <el-option label="产品部" value="产品部" />
          <el-option label="设计部" value="设计部" />
          <el-option label="市场部" value="市场部" />
        </el-select>
      </div>
      <el-button @click="clearFilters" type="warning">清空筛选</el-button>
    </div>

    <div class="demo-features">
      <ul>
        <li><strong>列头筛选</strong>：部门、职级、薪资范围支持列头筛选</li>
        <li><strong>多选筛选</strong>：职级支持多选筛选</li>
        <li><strong>自定义筛选</strong>：薪资范围使用自定义筛选逻辑</li>
        <li><strong>实时搜索</strong>：姓名输入框支持实时搜索</li>
      </ul>
    </div>
    
    <ma-table
      ref="tableRef"
      :columns="columns"
      :data="filteredData"
      :options="options"
    />
  </div>
</template>

<style scoped>
.demo-filter-table {
  padding: 20px;
}
.demo-filter-table h3 {
  margin-bottom: 8px;
  color: #333;
}
.demo-filter-table p {
  margin-bottom: 16px;
  color: #666;
  font-size: 14px;
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-item label {
  font-size: 14px;
  color: #555;
  white-space: nowrap;
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