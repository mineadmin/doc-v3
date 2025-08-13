# 响应式表格

展示表格的自适应高度、响应式布局和加载状态等功能。

## 响应式表格演示

<DemoPreview dir="demos/ma-table/responsive" />

## 功能特性

### 自适应高度
- **动态高度**: 表格高度根据窗口大小自动调整
- **底部偏移**: 可配置距离页面底部的偏移量
- **窗口监听**: 监听窗口尺寸变化并实时响应
- **容器适配**: 根据父容器尺寸自动调整

### 响应式布局
- **列宽自适应**: 列宽根据内容和可用空间自动调整
- **移动端适配**: 在小屏幕设备上优化显示效果
- **尺寸控制**: 支持大、中、小三种表格尺寸

### 加载状态
- **加载动画**: 数据加载时显示遮罩和动画
- **自定义配置**: 可自定义加载文案、图标、背景等
- **状态控制**: 程序化控制加载状态的显示和隐藏

## 配置示例

### 自适应高度配置
```javascript
const options = {
  adaption: true,              // 开启自适应高度
  adaptionOffsetBottom: 100,   // 距离底部偏移量(px)
  containerHeight: 'auto'      // 容器高度设置
}
```

### 加载状态配置
```javascript
const options = {
  loading: false,              // 加载状态
  loadingConfig: {
    text: '数据加载中...',      // 加载文案
    spinner: 'el-icon-loading', // 加载图标
    background: 'rgba(0, 0, 0, 0.7)', // 背景颜色
    customClass: 'custom-loading'      // 自定义样式类
  }
}
```

### 响应式列配置
```javascript
const columns = [
  { 
    label: '标题', 
    prop: 'title',
    minWidth: 200,              // 最小宽度
    showOverflowTooltip: true   // 内容溢出时显示tooltip
  },
  { 
    label: '描述', 
    prop: 'description',
    width: 'auto',              // 自适应宽度
    align: 'left'
  }
]
```

### 动态控制示例
```vue
<template>
  <div>
    <!-- 控制面板 -->
    <div class="control-panel">
      <el-switch 
        v-model="adaptionEnabled"
        @change="toggleAdaption"
        active-text="自适应高度"
      />
      
      <el-slider 
        v-model="offsetBottom"
        :min="50"
        :max="200"
        @change="updateOffset"
        style="width: 200px;"
      />
      
      <el-button @click="simulateLoading">
        刷新数据
      </el-button>
    </div>
    
    <ma-table 
      ref="tableRef"
      :columns="columns" 
      :data="data" 
      :options="options" 
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'

const tableRef = ref()
const adaptionEnabled = ref(true)
const offsetBottom = ref(100)

const options = reactive({
  adaption: true,
  adaptionOffsetBottom: 100,
  loading: false,
  loadingConfig: {
    text: '数据加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  }
})

// 切换自适应高度
const toggleAdaption = (enabled) => {
  options.adaption = enabled
  tableRef.value?.setOptions(options)
}

// 更新底部偏移
const updateOffset = (value) => {
  options.adaptionOffsetBottom = value
  tableRef.value?.setOptions(options)
}

// 模拟加载
const simulateLoading = async () => {
  tableRef.value?.setLoadingState(true)
  
  try {
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 更新数据
    await refreshData()
    
  } finally {
    tableRef.value?.setLoadingState(false)
  }
}

// 窗口尺寸变化监听
const handleResize = () => {
  // 表格会自动响应窗口变化，这里可以添加额外逻辑
  console.log('窗口尺寸变化')
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
```

## 响应式参数

### 自适应配置

| 参数 | 说明 | 类型 | 默认值 |
|-----|------|-----|--------|
| `adaption` | 是否开启自适应高度 | `boolean` | `false` |
| `adaptionOffsetBottom` | 距离底部偏移量(px) | `number` | `70` |
| `containerHeight` | 容器高度设置 | `string` | - |
| `height` | 表格高度 | `string \| number` | - |
| `maxHeight` | 表格最大高度 | `string \| number` | - |

### 加载配置

| 参数 | 说明 | 类型 | 默认值 |
|-----|------|-----|--------|
| `loading` | 是否显示加载状态 | `boolean` | `false` |
| `loadingConfig.text` | 加载提示文案 | `string` | - |
| `loadingConfig.spinner` | 自定义加载图标 | `string` | - |
| `loadingConfig.svg` | 自定义SVG图标 | `string` | - |
| `loadingConfig.background` | 遮罩背景色 | `string` | - |
| `loadingConfig.customClass` | 自定义样式类 | `string` | - |

### 响应式列配置

| 参数 | 说明 | 类型 | 默认值 |
|-----|------|-----|--------|
| `minWidth` | 列最小宽度 | `string \| number` | - |
| `showOverflowTooltip` | 内容过长时显示tooltip | `boolean` | `false` |
| `fit` | 列宽是否自撑开 | `boolean` | `true` |

## Expose 方法

| 方法名 | 说明 | 参数 | 返回值 |
|-------|------|------|--------|
| `setLoadingState` | 设置加载状态 | `loading: boolean` | - |
| `setOptions` | 更新表格配置 | `options: MaTableOptions` | - |

## 使用场景

### 1. 全屏表格
```javascript
const fullScreenOptions = {
  adaption: true,
  adaptionOffsetBottom: 0,  // 无底部偏移
  containerHeight: '100vh',
  showPagination: false
}
```

### 2. 弹窗内表格
```javascript
const dialogTableOptions = {
  adaption: false,
  height: '400px',         // 固定高度
  maxHeight: '400px'
}
```

### 3. 移动端适配
```javascript
const mobileOptions = {
  size: 'small',           // 小尺寸
  showOverflowTooltip: true,
  columnAlign: 'left',     // 左对齐更适合移动端
  showPagination: true,
  pagination: {
    size: 'small',
    layout: 'prev, pager, next'  // 简化分页布局
  }
}
```

### 4. 数据刷新场景
```vue
<script setup>
// 带加载状态的数据刷新
const refreshWithLoading = async () => {
  try {
    // 开启加载状态
    tableRef.value?.setLoadingState(true)
    
    // 获取新数据
    const newData = await api.fetchTableData()
    
    // 更新数据
    tableRef.value?.setData(newData)
    
    ElMessage.success('数据刷新成功')
    
  } catch (error) {
    ElMessage.error('数据刷新失败')
    console.error(error)
    
  } finally {
    // 关闭加载状态
    tableRef.value?.setLoadingState(false)
  }
}

// 定时刷新
let refreshTimer = null

const startAutoRefresh = () => {
  refreshTimer = setInterval(refreshWithLoading, 30000) // 30秒刷新一次
}

const stopAutoRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

onMounted(startAutoRefresh)
onUnmounted(stopAutoRefresh)
</script>
```

## 最佳实践

1. **合理使用自适应**: 在页面主要区域使用自适应高度，在弹窗等场景使用固定高度
2. **加载状态管理**: 统一管理加载状态，避免重复显示
3. **响应式设计**: 考虑不同屏幕尺寸下的显示效果
4. **性能优化**: 避免频繁的高度计算和DOM操作
5. **用户体验**: 提供清晰的加载反馈和错误处理

## 注意事项

- 自适应高度依赖于窗口尺寸，在隐藏状态下可能不准确
- 加载状态的显示和隐藏要成对出现，避免状态混乱
- 移动端需要特别注意触摸操作的体验
- 窗口尺寸变化监听要及时清理，避免内存泄漏

## CSS 变量自定义

```css
/* 自定义表格响应式样式 */
.ma-table {
  --table-border-color: #ebeef5;
  --table-text-color: #606266;
  --table-header-background: #f5f7fa;
  --table-row-hover-background: #f5f7fa;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .ma-table {
    font-size: 12px;
  }
  
  .ma-table .cell {
    padding: 8px 4px;
  }
}
```