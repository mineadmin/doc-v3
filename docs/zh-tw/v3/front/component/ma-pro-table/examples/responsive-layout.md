# 響應式佈局

展示表格在不同螢幕尺寸下的響應式表現，包含移動端適配和佈局最佳化。

<DemoPreview dir="demos/ma-pro-table-examples/responsive-layout" />

## 功能特點

- **裝置適配**：自動適配桌面端、平板、手機等不同裝置
- **動態列管理**：根據螢幕尺寸動態顯示/隱藏列
- **搜尋響應式**：搜尋表單支援響應式佈局
- **操作最佳化**：不同裝置下的操作方式最佳化
- **效能友好**：避免在小螢幕裝置上顯示過多資訊

## 裝置斷點配置

### 標準斷點
```javascript
const deviceConfigs = {
  desktop: { 
    width: 1200, 
    name: '桌面端', 
    type: '大螢幕', 
    columns: 8 
  },
  tablet: { 
    width: 768, 
    name: '平板', 
    type: '中等螢幕', 
    columns: 5 
  },
  mobile: { 
    width: 375, 
    name: '手機', 
    type: '小螢幕', 
    columns: 3 
  }
}
```

### 響應式容器
```vue
<template>
  <div 
    class="responsive-container" 
    :class="currentDevice"
    :style="{ width: containerWidth + 'px' }"
  >
    <MaProTable :options="options" :schema="schema" />
  </div>
</template>

<style scoped>
.responsive-container {
  margin: 0 auto;
  border: 2px dashed #e4e7ed;
  border-radius: 8px;
  overflow-x: auto;
  transition: all 0.3s ease;
}

.responsive-container.desktop {
  border-color: #409eff;
}

.responsive-container.tablet {
  border-color: #e6a23c;
}

.responsive-container.mobile {
  border-color: #f56c6c;
}
</style>
```

## 響應式搜尋

### 搜尋項數量控制
```javascript
// 根據裝置調整搜尋項顯示數量
const updateSearchLayout = (device) => {
  const showNumber = device === 'desktop' ? 4 : 
                    device === 'tablet' ? 2 : 1
                    
  options.searchOptions = {
    showNumber,
    layout: device === 'mobile' ? 'vertical' : 'auto'
  }
}
```

### 搜尋佈局模式
```javascript
const searchOptions = {
  showNumber: 3,            // 預設顯示搜尋項數量
  layout: 'auto',           // auto/inline/vertical
  responsive: {
    mobile: {
      showNumber: 1,
      layout: 'vertical'
    },
    tablet: {
      showNumber: 2,
      layout: 'auto'
    }
  }
}
```

## 響應式表格列

### 動態列顯示
```javascript
const updateTableColumns = (device) => {
  const baseColumns = [
    { label: 'ID', prop: 'id', width: 60 },
    { label: '姓名', prop: 'name', width: 100, fixed: 'left' },
    { label: '部門', prop: 'department', width: 100 },
    { label: '職位', prop: 'position', width: 150 },
    { label: '薪資', prop: 'salary', width: 120 },
    { label: '狀態', prop: 'status', width: 80 },
    { label: '入職時間', prop: 'createTime', width: 120 }
  ]
  
  let visibleColumns
  if (device === 'mobile') {
    // 手機端只顯示核心資訊
    visibleColumns = [
      baseColumns[0], // ID
      baseColumns[1], // 姓名
      baseColumns[2], // 部門
      baseColumns[5], // 狀態
      operationColumn
    ]
  } else if (device === 'tablet') {
    // 平板端顯示主要資訊
    visibleColumns = [
      baseColumns[0], // ID
      baseColumns[1], // 姓名
      baseColumns[2], // 部門
      baseColumns[3], // 職位
      baseColumns[4], // 薪資
      baseColumns[5], // 狀態
      operationColumn
    ]
  } else {
    // 桌面端顯示全部資訊
    visibleColumns = [...baseColumns, operationColumn]
  }
  
  schema.tableColumns = visibleColumns
}
```

### 列寬度適配
```javascript
// 移動端列寬度最佳化
const getColumnWidth = (device, column) => {
  if (device === 'mobile') {
    return {
      id: 50,
      name: 80,
      department: 90,
      status: 70
    }[column.prop] || column.width
  }
  return column.width
}
```

## 響應式操作

### 操作列適配
```javascript
const getOperationConfig = (device) => {
  return {
    type: device === 'mobile' ? 'dropdown' : 'auto',
    width: device === 'mobile' ? 120 : 
           device === 'tablet' ? 160 : 200,
    fold: device === 'mobile' ? 1 : 
          device === 'tablet' ? 2 : 3,
    actions: getDeviceActions(device)
  }
}
```

### 裝置特定操作
```javascript
const getDeviceActions = (device) => {
  const baseActions = [
    {
      name: 'view',
      text: device === 'mobile' ? '檢視' : '詳情',
      onClick: (data) => {
        if (device === 'mobile') {
          showMobileDetail(data.row)
        } else {
          showDesktopDetail(data.row)
        }
      }
    },
    {
      name: 'edit',
      text: '編輯',
      onClick: (data) => {
        showEditDialog(data.row, device)
      }
    }
  ]
  
  // 桌面端顯示更多操作
  if (device === 'desktop') {
    baseActions.push(
      {
        name: 'contact',
        text: '聯絡',
        onClick: (data) => {
          showContactInfo(data.row)
        }
      },
      {
        name: 'history',
        text: '歷史',
        onClick: (data) => {
          showHistory(data.row)
        }
      }
    )
  }
  
  return baseActions
}
```

## 移動端最佳化

### 單元格內容適配
```javascript
// 移動端技能標籤顯示最佳化
{
  label: '技能',
  prop: 'skills',
  cellRender: ({ row }) => (
    <div>
      {row.skills.slice(0, device === 'mobile' ? 1 : 3).map((skill, index) => (
        <el-tag key={index} size="small">
          {skill}
        </el-tag>
      ))}
      {row.skills.length > (device === 'mobile' ? 1 : 3) && (
        <el-tag size="small" type="info">
          +{row.skills.length - (device === 'mobile' ? 1 : 3)}
        </el-tag>
      )}
    </div>
  )
}
```

### 移動端樣式
```css
/* 移動端特殊樣式 */
.responsive-container.mobile :deep(.ma-pro-table) {
  font-size: 14px;
}

.responsive-container.mobile :deep(.el-table th),
.responsive-container.mobile :deep(.el-table td) {
  padding: 8px 4px;
}

.responsive-container.mobile :deep(.el-pagination) {
  text-align: center;
}

.responsive-container.mobile :deep(.el-tag) {
  font-size: 12px;
  height: 20px;
  line-height: 18px;
}
```

### 平板端樣式
```css
/* 平板端特殊樣式 */
.responsive-container.tablet :deep(.el-table th),
.responsive-container.tablet :deep(.el-table td) {
  padding: 10px 6px;
}

.responsive-container.tablet :deep(.el-button) {
  padding: 6px 12px;
}
```

## 分頁響應式

### 分頁佈局適配
```javascript
const getPaginationLayout = (device) => {
  if (device === 'mobile') {
    return 'total, prev, pager, next'
  } else if (device === 'tablet') {
    return 'total, sizes, prev, pager, next'
  } else {
    return 'total, sizes, prev, pager, next, jumper'
  }
}

const options = {
  tableOptions: {
    pagination: {
      layout: getPaginationLayout(currentDevice.value),
      pageSizes: currentDevice.value === 'mobile' ? [10, 20] : [10, 20, 50, 100]
    }
  }
}
```

## 媒體查詢整合

### CSS媒體查詢
```css
/* 使用媒體查詢實現真正的響應式 */
@media (max-width: 768px) {
  .ma-pro-table {
    font-size: 14px;
  }
  
  .ma-pro-table .el-table th,
  .ma-pro-table .el-table td {
    padding: 8px 4px !important;
  }
  
  .search-form .el-form-item {
    margin-bottom: 12px;
  }
}

@media (max-width: 480px) {
  .ma-pro-table {
    font-size: 12px;
  }
  
  .toolbar-buttons .el-button {
    padding: 4px 8px;
    font-size: 12px;
  }
}
```

### JavaScript媒體查詢
```javascript
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false)
  
  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)
    
    const listener = (e) => setMatches(e.matches)
    media.addListener(listener)
    
    return () => media.removeListener(listener)
  }, [query])
  
  return matches
}

// 使用
const isMobile = useMediaQuery('(max-width: 768px)')
const isTablet = useMediaQuery('(max-width: 1024px) and (min-width: 769px)')
```

## 工具欄響應式

### 工具欄按鈕適配
```javascript
const getToolbarConfig = (device) => {
  if (device === 'mobile') {
    return {
      size: 'small',
      onlyIcons: true,        // 只顯示圖示
      maxButtons: 3           // 最多顯示3個按鈕
    }
  } else if (device === 'tablet') {
    return {
      size: 'default',
      showText: true,         // 顯示文字
      maxButtons: 5
    }
  } else {
    return {
      size: 'default',
      showText: true,
      maxButtons: -1          // 顯示所有按鈕
    }
  }
}
```

## 最佳實踐

### 1. 漸進增強
- 從移動端開始設計
- 逐步增加桌面端功能
- 確保核心功能在所有裝置上可用

### 2. 效能最佳化
- 避免在小螢幕裝置上載入過多資料
- 使用虛擬滾動處理大量資料
- 合理使用圖片和媒體資源

### 3. 使用者體驗
- 提供裝置特定的互動方式
- 保持一致的視覺層次
- 確保觸控目標足夠大

### 4. 測試策略
- 在真實裝置上測試
- 使用瀏覽器開發工具模擬
- 考慮網路條件的影響

響應式佈局功能讓你的表格應用能夠完美適配各種裝置，提供一致的使用者體驗。