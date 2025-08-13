<template>
  <div>
    <h3>响应式布局</h3>
    <p>演示搜索表单在不同屏幕尺寸下的响应式布局效果，以及如何配置不同断点的列数。</p>
    
    <div class="viewport-indicator">
      <h4>当前视口信息</h4>
      <div class="viewport-info">
        <span>宽度: {{ windowWidth }}px</span>
        <span>断点: {{ currentBreakpoint }}</span>
        <span>预期列数: {{ expectedCols }}</span>
      </div>
    </div>

    <div class="demo-section">
      <h4>默认响应式配置</h4>
      <ma-search
        :search-items="searchItems"
        :form-options="formOptions"
        :options="defaultResponsiveOptions"
        @search="handleSearch"
        @reset="handleReset"
      />
    </div>

    <div class="demo-section">
      <h4>自定义响应式配置</h4>
      <ma-search
        :search-items="moreSearchItems"
        :form-options="formOptions"
        :options="customResponsiveOptions"
        @search="handleSearch"
        @reset="handleReset"
      />
    </div>

    <div class="demo-section">
      <h4>极端响应式配置 (适合内容密集型界面)</h4>
      <ma-search
        :search-items="extendedSearchItems"
        :form-options="formOptions"
        :options="extremeResponsiveOptions"
        @search="handleSearch"
        @reset="handleReset"
      />
    </div>

    <div class="breakpoint-examples">
      <h4>各断点效果预览</h4>
      <div class="breakpoint-grid">
        <div v-for="bp in breakpoints" :key="bp.name" class="breakpoint-card">
          <div class="breakpoint-header">
            <h5>{{ bp.name }}</h5>
            <span class="breakpoint-range">{{ bp.range }}</span>
          </div>
          <div class="breakpoint-preview" :style="{ width: bp.previewWidth }">
            <ma-search
              :search-items="previewItems"
              :form-options="{ labelWidth: '80px' }"
              :options="{ 
                cols: { [bp.key]: bp.cols },
                show: true
              }"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="configuration-panel">
      <h4>动态配置测试</h4>
      <div class="config-controls">
        <div class="control-group">
          <label>XS (< 768px):</label>
          <el-input-number 
            v-model="dynamicCols.xs" 
            :min="1" 
            :max="6"
            @change="updateDynamicConfig"
          />
        </div>
        <div class="control-group">
          <label>SM (≥ 768px):</label>
          <el-input-number 
            v-model="dynamicCols.sm" 
            :min="1" 
            :max="6"
            @change="updateDynamicConfig"
          />
        </div>
        <div class="control-group">
          <label>MD (≥ 992px):</label>
          <el-input-number 
            v-model="dynamicCols.md" 
            :min="1" 
            :max="6"
            @change="updateDynamicConfig"
          />
        </div>
        <div class="control-group">
          <label>LG (≥ 1200px):</label>
          <el-input-number 
            v-model="dynamicCols.lg" 
            :min="1" 
            :max="8"
            @change="updateDynamicConfig"
          />
        </div>
        <div class="control-group">
          <label>XL (≥ 1920px):</label>
          <el-input-number 
            v-model="dynamicCols.xl" 
            :min="1" 
            :max="8"
            @change="updateDynamicConfig"
          />
        </div>
      </div>
      
      <ma-search
        ref="dynamicSearchRef"
        :search-items="dynamicSearchItems"
        :form-options="formOptions"
        :options="dynamicOptions"
        @search="handleSearch"
        @reset="handleReset"
      />
    </div>
  </div>
</template>

<script setup lang="tsx">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { MaSearchItem } from '@mineadmin/search'
import { ElMessage } from 'element-plus'

const dynamicSearchRef = ref<any>(null)
const windowWidth = ref(window.innerWidth)

// 基础搜索项
const searchItems = ref<MaSearchItem[]>([
  {
    label: '用户名',
    prop: 'username',
    render: 'input',
    props: { placeholder: '请输入用户名' }
  },
  {
    label: '邮箱',
    prop: 'email',
    render: 'input',
    props: { placeholder: '请输入邮箱' }
  },
  {
    label: '状态',
    prop: 'status',
    render: 'select',
    options: [
      { label: '全部', value: '' },
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 }
    ]
  },
  {
    label: '部门',
    prop: 'department',
    render: 'select',
    options: [
      { label: '全部部门', value: '' },
      { label: '技术部', value: 'tech' },
      { label: '产品部', value: 'product' }
    ]
  }
])

// 更多搜索项
const moreSearchItems = ref<MaSearchItem[]>([
  ...searchItems.value,
  {
    label: '手机号',
    prop: 'phone',
    render: 'input',
    props: { placeholder: '请输入手机号' }
  },
  {
    label: '注册时间',
    prop: 'register_date',
    render: 'date-picker',
    props: { type: 'daterange', placeholder: ['开始日期', '结束日期'] }
  }
])

// 扩展搜索项
const extendedSearchItems = ref<MaSearchItem[]>([
  ...moreSearchItems.value,
  {
    label: '年龄',
    prop: 'age',
    render: 'input-number',
    props: { min: 0, max: 120 }
  },
  {
    label: '地区',
    prop: 'region',
    render: 'input',
    props: { placeholder: '请输入地区' }
  },
  {
    label: '职位',
    prop: 'position',
    render: 'input',
    props: { placeholder: '请输入职位' }
  }
])

// 预览用搜索项
const previewItems = ref<MaSearchItem[]>([
  { label: '姓名', prop: 'name', render: 'input' },
  { label: '状态', prop: 'status', render: 'select', options: [{ label: '全部', value: '' }] },
  { label: '时间', prop: 'time', render: 'date-picker' }
])

// 动态配置搜索项
const dynamicSearchItems = ref<MaSearchItem[]>([
  { label: 'ID', prop: 'id', render: 'input' },
  { label: '名称', prop: 'name', render: 'input' },
  { label: '类型', prop: 'type', render: 'select', options: [{ label: '全部', value: '' }] },
  { label: '状态', prop: 'status', render: 'select', options: [{ label: '全部', value: '' }] },
  { label: '创建时间', prop: 'created_at', render: 'date-picker' },
  { label: '更新时间', prop: 'updated_at', render: 'date-picker' }
])

const formOptions = {
  labelWidth: '100px'
}

// 默认响应式配置
const defaultResponsiveOptions = {
  cols: {
    xs: 1,  // <768px 1列
    sm: 2,  // ≥768px 2列
    md: 2,  // ≥992px 2列
    lg: 3,  // ≥1200px 3列
    xl: 4   // ≥1920px 4列
  },
  fold: true,
  foldRows: 2
}

// 自定义响应式配置
const customResponsiveOptions = {
  cols: {
    xs: 1,  // 小屏单列
    sm: 1,  // 中小屏也保持单列
    md: 3,  // 中屏3列
    lg: 4,  // 大屏4列
    xl: 6   // 超大屏6列
  },
  fold: true,
  foldRows: 1
}

// 极端响应式配置
const extremeResponsiveOptions = {
  cols: {
    xs: 1,
    sm: 2,
    md: 4,
    lg: 6,
    xl: 8
  },
  fold: true,
  foldRows: 2
}

// 动态列数配置
const dynamicCols = ref({
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 5
})

const dynamicOptions = ref({
  cols: { ...dynamicCols.value },
  fold: true,
  foldRows: 2
})

// 断点信息
const breakpoints = [
  { name: 'XS', key: 'xs', range: '< 768px', cols: 1, previewWidth: '300px' },
  { name: 'SM', key: 'sm', range: '≥ 768px', cols: 2, previewWidth: '500px' },
  { name: 'MD', key: 'md', range: '≥ 992px', cols: 3, previewWidth: '700px' },
  { name: 'LG', key: 'lg', range: '≥ 1200px', cols: 4, previewWidth: '900px' },
  { name: 'XL', key: 'xl', range: '≥ 1920px', cols: 5, previewWidth: '1100px' }
]

// 计算当前断点
const currentBreakpoint = computed(() => {
  const w = windowWidth.value
  if (w < 768) return 'XS'
  if (w < 992) return 'SM'
  if (w < 1200) return 'MD'
  if (w < 1920) return 'LG'
  return 'XL'
})

// 计算预期列数
const expectedCols = computed(() => {
  const w = windowWidth.value
  if (w < 768) return defaultResponsiveOptions.cols.xs
  if (w < 992) return defaultResponsiveOptions.cols.sm
  if (w < 1200) return defaultResponsiveOptions.cols.md
  if (w < 1920) return defaultResponsiveOptions.cols.lg
  return defaultResponsiveOptions.cols.xl
})

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

const updateDynamicConfig = () => {
  dynamicOptions.value = {
    ...dynamicOptions.value,
    cols: { ...dynamicCols.value }
  }
  
  if (dynamicSearchRef.value) {
    dynamicSearchRef.value.setOptions(dynamicOptions.value)
  }
}

const handleSearch = (formData: any) => {
  ElMessage.success('搜索完成')
  console.log('搜索数据:', formData)
}

const handleReset = (formData: any) => {
  ElMessage.info('搜索条件已重置')
}

onMounted(() => {
  window.addEventListener('resize', updateWindowWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth)
})
</script>

<style scoped>
.viewport-indicator {
  margin-bottom: 20px;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
}

.viewport-indicator h4 {
  margin-bottom: 10px;
  font-size: 16px;
}

.viewport-info {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.viewport-info span {
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
}

.demo-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background-color: #fafafa;
}

.demo-section h4 {
  margin-bottom: 15px;
  color: #303133;
  font-size: 16px;
}

.breakpoint-examples {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background-color: #f8f9fa;
}

.breakpoint-examples h4 {
  margin-bottom: 20px;
  color: #303133;
  font-size: 16px;
}

.breakpoint-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.breakpoint-card {
  border: 1px solid #d9ecff;
  border-radius: 6px;
  overflow: hidden;
  background-color: white;
}

.breakpoint-header {
  padding: 12px 16px;
  background-color: #ecf5ff;
  border-bottom: 1px solid #d9ecff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.breakpoint-header h5 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.breakpoint-range {
  font-size: 12px;
  color: #909399;
}

.breakpoint-preview {
  padding: 16px;
  overflow-x: auto;
  transform: scale(0.8);
  transform-origin: top left;
  height: 200px;
}

.configuration-panel {
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background-color: #fff;
}

.configuration-panel h4 {
  margin-bottom: 20px;
  color: #303133;
  font-size: 16px;
}

.config-controls {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-group label {
  font-size: 14px;
  color: #606266;
  min-width: 80px;
  font-weight: 500;
}

.control-group :deep(.el-input-number) {
  width: 80px;
}

@media (max-width: 768px) {
  .viewport-info {
    flex-direction: column;
    gap: 8px;
  }
  
  .breakpoint-grid {
    grid-template-columns: 1fr;
  }
  
  .config-controls {
    flex-direction: column;
    gap: 10px;
  }
  
  .control-group {
    justify-content: space-between;
  }
}
</style>