# 响应式布局

展示表格在不同屏幕尺寸下的响应式表现，包含移动端适配和布局优化。

<DemoPreview dir="demos/ma-pro-table-examples/responsive-layout" />

## 功能特点

- **设备适配**：自动适配桌面端、平板、手机等不同设备
- **动态列管理**：根据屏幕尺寸动态显示/隐藏列
- **搜索响应式**：搜索表单支持响应式布局
- **操作优化**：不同设备下的操作方式优化
- **性能友好**：避免在小屏幕设备上显示过多信息

## 设备断点配置

### 标准断点
```javascript
const deviceConfigs = {
  desktop: { 
    width: 1200, 
    name: '桌面端', 
    type: '大屏幕', 
    columns: 8 
  },
  tablet: { 
    width: 768, 
    name: '平板', 
    type: '中等屏幕', 
    columns: 5 
  },
  mobile: { 
    width: 375, 
    name: '手机', 
    type: '小屏幕', 
    columns: 3 
  }
}
```

### 响应式容器
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

## 响应式搜索

### 搜索项数量控制
```javascript
// 根据设备调整搜索项显示数量
const updateSearchLayout = (device) => {
  const showNumber = device === 'desktop' ? 4 : 
                    device === 'tablet' ? 2 : 1
                    
  options.searchOptions = {
    showNumber,
    layout: device === 'mobile' ? 'vertical' : 'auto'
  }
}
```

### 搜索布局模式
```javascript
const searchOptions = {
  showNumber: 3,            // 默认显示搜索项数量
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

## 响应式表格列

### 动态列显示
```javascript
const updateTableColumns = (device) => {
  const baseColumns = [
    { label: 'ID', prop: 'id', width: 60 },
    { label: '姓名', prop: 'name', width: 100, fixed: 'left' },
    { label: '部门', prop: 'department', width: 100 },
    { label: '职位', prop: 'position', width: 150 },
    { label: '薪资', prop: 'salary', width: 120 },
    { label: '状态', prop: 'status', width: 80 },
    { label: '入职时间', prop: 'createTime', width: 120 }
  ]
  
  let visibleColumns
  if (device === 'mobile') {
    // 手机端只显示核心信息
    visibleColumns = [
      baseColumns[0], // ID
      baseColumns[1], // 姓名
      baseColumns[2], // 部门
      baseColumns[5], // 状态
      operationColumn
    ]
  } else if (device === 'tablet') {
    // 平板端显示主要信息
    visibleColumns = [
      baseColumns[0], // ID
      baseColumns[1], // 姓名
      baseColumns[2], // 部门
      baseColumns[3], // 职位
      baseColumns[4], // 薪资
      baseColumns[5], // 状态
      operationColumn
    ]
  } else {
    // 桌面端显示全部信息
    visibleColumns = [...baseColumns, operationColumn]
  }
  
  schema.tableColumns = visibleColumns
}
```

### 列宽度适配
```javascript
// 移动端列宽度优化
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

## 响应式操作

### 操作列适配
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

### 设备特定操作
```javascript
const getDeviceActions = (device) => {
  const baseActions = [
    {
      name: 'view',
      text: device === 'mobile' ? '查看' : '详情',
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
      text: '编辑',
      onClick: (data) => {
        showEditDialog(data.row, device)
      }
    }
  ]
  
  // 桌面端显示更多操作
  if (device === 'desktop') {
    baseActions.push(
      {
        name: 'contact',
        text: '联系',
        onClick: (data) => {
          showContactInfo(data.row)
        }
      },
      {
        name: 'history',
        text: '历史',
        onClick: (data) => {
          showHistory(data.row)
        }
      }
    )
  }
  
  return baseActions
}
```

## 移动端优化

### 单元格内容适配
```javascript
// 移动端技能标签显示优化
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

### 移动端样式
```css
/* 移动端特殊样式 */
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

### 平板端样式
```css
/* 平板端特殊样式 */
.responsive-container.tablet :deep(.el-table th),
.responsive-container.tablet :deep(.el-table td) {
  padding: 10px 6px;
}

.responsive-container.tablet :deep(.el-button) {
  padding: 6px 12px;
}
```

## 分页响应式

### 分页布局适配
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

## 媒体查询集成

### CSS媒体查询
```css
/* 使用媒体查询实现真正的响应式 */
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

### JavaScript媒体查询
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

## 工具栏响应式

### 工具栏按钮适配
```javascript
const getToolbarConfig = (device) => {
  if (device === 'mobile') {
    return {
      size: 'small',
      onlyIcons: true,        // 只显示图标
      maxButtons: 3           // 最多显示3个按钮
    }
  } else if (device === 'tablet') {
    return {
      size: 'default',
      showText: true,         // 显示文字
      maxButtons: 5
    }
  } else {
    return {
      size: 'default',
      showText: true,
      maxButtons: -1          // 显示所有按钮
    }
  }
}
```

## 最佳实践

### 1. 渐进增强
- 从移动端开始设计
- 逐步增加桌面端功能
- 确保核心功能在所有设备上可用

### 2. 性能优化
- 避免在小屏幕设备上加载过多数据
- 使用虚拟滚动处理大量数据
- 合理使用图片和媒体资源

### 3. 用户体验
- 提供设备特定的交互方式
- 保持一致的视觉层次
- 确保触摸目标足够大

### 4. 测试策略
- 在真实设备上测试
- 使用浏览器开发工具模拟
- 考虑网络条件的影响

响应式布局功能让你的表格应用能够完美适配各种设备，提供一致的用户体验。