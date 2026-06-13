# 響應式表格

展示表格的自適應高度、響應式佈局和載入狀態等功能。

## 響應式表格演示

<DemoPreview dir="demos/ma-table/responsive" />

## 功能特性

### 自適應高度
- **動態高度**: 表格高度根據視窗大小自動調整
- **底部偏移**: 可配置距離頁面底部的偏移量
- **視窗監聽**: 監聽視窗尺寸變化並實時響應
- **容器適配**: 根據父容器尺寸自動調整

### 響應式佈局
- **列寬自適應**: 列寬根據內容和可用空間自動調整
- **移動端適配**: 在小螢幕裝置上最佳化顯示效果
- **尺寸控制**: 支援大、中、小三種表格尺寸

### 載入狀態
- **載入動畫**: 資料載入時顯示遮罩和動畫
- **自定義配置**: 可自定義載入文案、圖示、背景等
- **狀態控制**: 程式化控制載入狀態的顯示和隱藏

## 配置示例

### 自適應高度配置
```javascript
const options = {
  adaption: true,              // 開啟自適應高度
  adaptionOffsetBottom: 100,   // 距離底部偏移量(px)
  containerHeight: 'auto'      // 容器高度設定
}
```

### 載入狀態配置
```javascript
const options = {
  loading: false,              // 載入狀態
  loadingConfig: {
    text: '資料載入中...',      // 載入文案
    spinner: 'el-icon-loading', // 載入圖示
    background: 'rgba(0, 0, 0, 0.7)', // 背景顏色
    customClass: 'custom-loading'      // 自定義樣式類
  }
}
```

### 響應式列配置
```javascript
const columns = [
  { 
    label: '標題', 
    prop: 'title',
    minWidth: 200,              // 最小寬度
    showOverflowTooltip: true   // 內容溢位時顯示tooltip
  },
  { 
    label: '描述', 
    prop: 'description',
    width: 'auto',              // 自適應寬度
    align: 'left'
  }
]
```

### 動態控制示例
```vue
<template>
  <div>
    <!-- 控制面板 -->
    <div class="control-panel">
      <el-switch 
        v-model="adaptionEnabled"
        @change="toggleAdaption"
        active-text="自適應高度"
      />
      
      <el-slider 
        v-model="offsetBottom"
        :min="50"
        :max="200"
        @change="updateOffset"
        style="width: 200px;"
      />
      
      <el-button @click="simulateLoading">
        重新整理資料
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
    text: '資料載入中...',
    background: 'rgba(0, 0, 0, 0.7)'
  }
})

// 切換自適應高度
const toggleAdaption = (enabled) => {
  options.adaption = enabled
  tableRef.value?.setOptions(options)
}

// 更新底部偏移
const updateOffset = (value) => {
  options.adaptionOffsetBottom = value
  tableRef.value?.setOptions(options)
}

// 模擬載入
const simulateLoading = async () => {
  tableRef.value?.setLoadingState(true)
  
  try {
    // 模擬非同步操作
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 更新資料
    await refreshData()
    
  } finally {
    tableRef.value?.setLoadingState(false)
  }
}

// 視窗尺寸變化監聽
const handleResize = () => {
  // 表格會自動響應視窗變化，這裡可以新增額外邏輯
  console.log('視窗尺寸變化')
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
```

## 響應式引數

### 自適應配置

| 引數 | 說明 | 型別 | 預設值 |
|-----|------|-----|--------|
| `adaption` | 是否開啟自適應高度 | `boolean` | `false` |
| `adaptionOffsetBottom` | 距離底部偏移量(px) | `number` | `70` |
| `containerHeight` | 容器高度設定 | `string` | - |
| `height` | 表格高度 | `string \| number` | - |
| `maxHeight` | 表格最大高度 | `string \| number` | - |

### 載入配置

| 引數 | 說明 | 型別 | 預設值 |
|-----|------|-----|--------|
| `loading` | 是否顯示載入狀態 | `boolean` | `false` |
| `loadingConfig.text` | 載入提示文案 | `string` | - |
| `loadingConfig.spinner` | 自定義載入圖示 | `string` | - |
| `loadingConfig.svg` | 自定義SVG圖示 | `string` | - |
| `loadingConfig.background` | 遮罩背景色 | `string` | - |
| `loadingConfig.customClass` | 自定義樣式類 | `string` | - |

### 響應式列配置

| 引數 | 說明 | 型別 | 預設值 |
|-----|------|-----|--------|
| `minWidth` | 列最小寬度 | `string \| number` | - |
| `showOverflowTooltip` | 內容過長時顯示tooltip | `boolean` | `false` |
| `fit` | 列寬是否自撐開 | `boolean` | `true` |

## Expose 方法

| 方法名 | 說明 | 引數 | 返回值 |
|-------|------|------|--------|
| `setLoadingState` | 設定載入狀態 | `loading: boolean` | - |
| `setOptions` | 更新表格配置 | `options: MaTableOptions` | - |

## 使用場景

### 1. 全屏表格
```javascript
const fullScreenOptions = {
  adaption: true,
  adaptionOffsetBottom: 0,  // 無底部偏移
  containerHeight: '100vh',
  showPagination: false
}
```

### 2. 彈窗內表格
```javascript
const dialogTableOptions = {
  adaption: false,
  height: '400px',         // 固定高度
  maxHeight: '400px'
}
```

### 3. 移動端適配
```javascript
const mobileOptions = {
  size: 'small',           // 小尺寸
  showOverflowTooltip: true,
  columnAlign: 'left',     // 左對齊更適合移動端
  showPagination: true,
  pagination: {
    size: 'small',
    layout: 'prev, pager, next'  // 簡化分頁佈局
  }
}
```

### 4. 資料重新整理場景
```vue
<script setup>
// 帶載入狀態的資料重新整理
const refreshWithLoading = async () => {
  try {
    // 開啟載入狀態
    tableRef.value?.setLoadingState(true)
    
    // 獲取新資料
    const newData = await api.fetchTableData()
    
    // 更新資料
    tableRef.value?.setData(newData)
    
    ElMessage.success('資料重新整理成功')
    
  } catch (error) {
    ElMessage.error('資料重新整理失敗')
    console.error(error)
    
  } finally {
    // 關閉載入狀態
    tableRef.value?.setLoadingState(false)
  }
}

// 定時重新整理
let refreshTimer = null

const startAutoRefresh = () => {
  refreshTimer = setInterval(refreshWithLoading, 30000) // 30秒重新整理一次
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

## 最佳實踐

1. **合理使用自適應**: 在頁面主要區域使用自適應高度，在彈窗等場景使用固定高度
2. **載入狀態管理**: 統一管理載入狀態，避免重複顯示
3. **響應式設計**: 考慮不同螢幕尺寸下的顯示效果
4. **效能最佳化**: 避免頻繁的高度計算和DOM操作
5. **使用者體驗**: 提供清晰的載入反饋和錯誤處理

## 注意事項

- 自適應高度依賴於視窗尺寸，在隱藏狀態下可能不準確
- 載入狀態的顯示和隱藏要成對出現，避免狀態混亂
- 移動端需要特別注意觸控操作的體驗
- 視窗尺寸變化監聽要及時清理，避免記憶體洩漏

## CSS 變數自定義

```css
/* 自定義表格響應式樣式 */
.ma-table {
  --table-border-color: #ebeef5;
  --table-text-color: #606266;
  --table-header-background: #f5f7fa;
  --table-row-hover-background: #f5f7fa;
}

/* 移動端適配 */
@media (max-width: 768px) {
  .ma-table {
    font-size: 12px;
  }
  
  .ma-table .cell {
    padding: 8px 4px;
  }
}
```