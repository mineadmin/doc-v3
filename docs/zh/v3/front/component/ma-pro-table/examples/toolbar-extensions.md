# 工具栏扩展

展示如何通过插件API扩展工具栏功能，包含自定义工具按钮和工具栏布局。

<DemoPreview dir="demos/ma-pro-table-examples/toolbar-extensions" />

## 功能特点

- **插件机制**：通过插件API扩展工具栏功能
- **自定义工具**：支持注册自定义工具按钮
- **插槽扩展**：支持通过插槽扩展工具栏布局
- **状态控制**：支持动态显示/隐藏工具
- **排序控制**：支持自定义工具显示顺序

## 插件API扩展

### 注册工具栏插件
```javascript
import { useProTableToolbar } from '@mineadmin/pro-table'

const { add, remove, hide, show } = useProTableToolbar()

// 添加自定义工具
add({
  name: 'statistics',           // 工具名称（唯一标识）
  render: ({ proxy }) => (      // 渲染函数
    <el-button
      circle
      type="info"
      title="数据统计"
      onClick={() => showStatistics()}
    >
      <el-icon><ChatDotRound /></el-icon>
    </el-button>
  ),
  show: true,                   // 是否显示
  order: 1                      // 显示顺序
})
```

### 工具栏管理方法
```javascript
const { add, remove, hide, show, get, getAll } = useProTableToolbar()

// 添加工具
add(toolbar)

// 移除工具
remove('tool-name')

// 隐藏工具
hide('tool-name')

// 显示工具
show('tool-name')

// 获取单个工具
const tool = get('tool-name')

// 获取所有工具
const allTools = getAll()
```

## 常用工具示例

### 1. 数据统计工具
```javascript
add({
  name: 'statistics',
  render: ({ proxy }) => (
    <el-button
      circle
      type="info"
      title="数据统计"
      onClick={() => {
        const stats = calculateStatistics(proxy.getTableData())
        ElNotification({
          title: '数据统计',
          message: `总数: ${stats.total} | 在职: ${stats.active}`,
          type: 'info'
        })
      }}
    >
      <el-icon><ChatDotRound /></el-icon>
    </el-button>
  ),
  show: true,
  order: 1
})
```

### 2. 导出工具
```javascript
add({
  name: 'export',
  render: ({ proxy }) => (
    <el-button
      circle
      type="success"
      title="导出数据"
      onClick={() => {
        const data = proxy.getTableData()
        exportToExcel(data)
        ElMessage.success('导出中...')
      }}
    >
      <el-icon><Download /></el-icon>
    </el-button>
  ),
  show: true,
  order: 2
})
```

### 3. 导入工具
```javascript
add({
  name: 'import',
  render: ({ proxy }) => (
    <el-button
      circle
      type="warning"
      title="导入数据"
      onClick={() => {
        ElMessageBox.confirm('确定要导入数据吗？', '导入确认', {
          type: 'warning'
        }).then(() => {
          // 触发文件选择或显示导入对话框
          showImportDialog(proxy)
        })
      }}
    >
      <el-icon><Upload /></el-icon>
    </el-button>
  ),
  show: true,
  order: 3
})
```

### 4. 设置工具
```javascript
add({
  name: 'settings',
  render: ({ proxy }) => (
    <el-button
      circle
      type="primary"
      title="高级设置"
      onClick={() => {
        showSettingsDialog(proxy)
      }}
    >
      <el-icon><Setting /></el-icon>
    </el-button>
  ),
  show: true,
  order: 4
})
```

### 5. 自定义刷新工具
```javascript
add({
  name: 'refresh',
  render: ({ proxy }) => (
    <el-button
      circle
      title="刷新数据"
      onClick={async () => {
        ElMessage.info('正在刷新...')
        await proxy.refresh()
        ElMessage.success('刷新完成')
      }}
    >
      <el-icon><Refresh /></el-icon>
    </el-button>
  ),
  show: true,
  order: 0                      // 优先级最高
})
```

## 插槽扩展

### 工具栏左侧扩展
```vue
<template>
  <MaProTable :options="options" :schema="schema">
    <template #toolbarLeft>
      <div class="custom-toolbar-left">
        <el-space>
          <el-text type="primary">共 {{ totalCount }} 条记录</el-text>
          <el-divider direction="vertical" />
          <el-text type="success">在职 {{ activeCount }} 人</el-text>
        </el-space>
      </div>
    </template>
  </MaProTable>
</template>
```

### 表格顶部操作区
```vue
<template>
  <MaProTable :options="options" :schema="schema">
    <template #tableTop>
      <div class="table-top-actions">
        <el-space>
          <el-button type="primary" size="small" @click="handleBatchAdd">
            <el-icon><Plus /></el-icon>
            批量添加
          </el-button>
          <el-button type="warning" size="small" @click="handleBatchEdit">
            <el-icon><Edit /></el-icon>
            批量编辑
          </el-button>
          <el-button type="danger" size="small" @click="handleBatchDelete">
            <el-icon><Delete /></el-icon>
            批量删除
          </el-button>
        </el-space>
      </div>
    </template>
  </MaProTable>
</template>
```

### 工具栏前后扩展
```vue
<template>
  <MaProTable :options="options" :schema="schema">
    <!-- 工具栏前置内容 -->
    <template #beforeToolbar>
      <el-button size="small" type="text">前置按钮</el-button>
    </template>
    
    <!-- 工具栏后置内容 -->
    <template #afterToolbar>
      <el-button size="small" type="text">后置按钮</el-button>
    </template>
  </MaProTable>
</template>
```

## 工具状态控制

### 配置工具显示状态
```javascript
const options = {
  toolbar: true,                // 是否显示工具栏
  toolStates: {
    size: true,                 // 显示尺寸调整工具
    setting: true,              // 显示列设置工具
    fullscreen: true,           // 显示全屏工具
    refresh: false              // 隐藏刷新工具
  }
}
```

### 动态控制工具状态
```javascript
// 运行时控制
const { hide, show } = useProTableToolbar()

// 隐藏某个工具
hide('statistics')

// 显示某个工具
show('statistics')

// 条件显示
const shouldShowExport = computed(() => hasPermission('export'))
add({
  name: 'export',
  show: shouldShowExport.value,
  render: ({ proxy }) => (...)
})
```

## 高级工具示例

### 系统监控工具
```javascript
add({
  name: 'monitor',
  render: ({ proxy }) => (
    <el-button
      circle
      type="danger"
      title="系统监控"
      onClick={() => {
        // 获取系统状态
        const status = getSystemStatus()
        ElNotification({
          title: '系统监控',
          message: `CPU: ${status.cpu}% | 内存: ${status.memory}% | 数据库: ${status.db}`,
          type: 'warning',
          duration: 4000
        })
      }}
    >
      <el-icon><Warning /></el-icon>
    </el-button>
  ),
  show: true,
  order: 5
})
```

### 批量操作工具
```javascript
add({
  name: 'batch-operations',
  render: ({ proxy }) => (
    <el-dropdown
      trigger="click"
      onCommand={(command) => handleBatchCommand(command, proxy)}
    >
      {{
        default: () => (
          <el-button circle type="warning" title="批量操作">
            <el-icon><MoreFilled /></el-icon>
          </el-button>
        ),
        dropdown: () => (
          <el-dropdown-menu>
            <el-dropdown-item command="approve">批量审批</el-dropdown-item>
            <el-dropdown-item command="reject">批量拒绝</el-dropdown-item>
            <el-dropdown-item command="delete" divided>批量删除</el-dropdown-item>
          </el-dropdown-menu>
        )
      }}
    </el-dropdown>
  ),
  show: true,
  order: 6
})
```

### 实时数据工具
```javascript
add({
  name: 'realtime',
  render: ({ proxy }) => {
    const [isRealtime, setIsRealtime] = useState(false)
    
    return (
      <el-button
        circle
        type={isRealtime ? 'success' : 'info'}
        title={isRealtime ? '停止实时刷新' : '开启实时刷新'}
        onClick={() => {
          setIsRealtime(!isRealtime)
          if (!isRealtime) {
            startRealtimeRefresh(proxy)
          } else {
            stopRealtimeRefresh()
          }
        }}
      >
        <el-icon>{isRealtime ? <VideoPause /> : <VideoPlay />}</el-icon>
      </el-button>
    )
  },
  show: true,
  order: 7
})
```

## 工具栏类型定义

```typescript
interface MaProTableToolbar {
  name: string                          // 工具名称
  render: (props: {                     // 渲染函数
    proxy: MaProTableExpose
  }) => VNode | Component
  show: boolean | (() => boolean)       // 是否显示
  order: number                         // 显示顺序
}
```

## 最佳实践

### 1. 工具命名
- 使用描述性的名称
- 避免与内置工具重名
- 保持命名一致性

### 2. 用户体验
- 提供清晰的工具提示
- 使用合适的图标和颜色
- 考虑工具的逻辑分组

### 3. 性能优化
- 避免在 render 函数中进行重度计算
- 合理使用响应式状态
- 适时移除不需要的工具

### 4. 权限控制
```javascript
add({
  name: 'admin-tool',
  show: () => hasRole('admin'),         // 基于权限显示
  render: ({ proxy }) => (...)
})
```

工具栏扩展功能让你可以构建功能丰富的表格操作界面，提升用户的操作体验。