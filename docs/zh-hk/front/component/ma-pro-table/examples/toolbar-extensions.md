# 工具欄擴展

展示如何通過插件API擴展工具欄功能，包含自定義工具按鈕和工具欄佈局。

<DemoPreview dir="demos/ma-pro-table-examples/toolbar-extensions" />

## 功能特點

- **插件機制**：通過插件API擴展工具欄功能
- **自定義工具**：支持註冊自定義工具按鈕
- **插槽擴展**：支持通過插槽擴展工具欄佈局
- **狀態控制**：支持動態顯示/隱藏工具
- **排序控制**：支持自定義工具顯示順序

## 插件API擴展

### 註冊工具欄插件
```javascript
import { useProTableToolbar } from '@mineadmin/pro-table'

const { add, remove, hide, show } = useProTableToolbar()

// 添加自定義工具
add({
  name: 'statistics',           // 工具名稱（唯一標識）
  render: ({ proxy }) => (      // 渲染函數
    <el-button
      circle
      type="info"
      title="數據統計"
      onClick={() => showStatistics()}
    >
      <el-icon><ChatDotRound /></el-icon>
    </el-button>
  ),
  show: true,                   // 是否顯示
  order: 1                      // 顯示順序
})
```

### 工具欄管理方法
```javascript
const { add, remove, hide, show, get, getAll } = useProTableToolbar()

// 添加工具
add(toolbar)

// 移除工具
remove('tool-name')

// 隱藏工具
hide('tool-name')

// 顯示工具
show('tool-name')

// 獲取單個工具
const tool = get('tool-name')

// 獲取所有工具
const allTools = getAll()
```

## 常用工具示例

### 1. 數據統計工具
```javascript
add({
  name: 'statistics',
  render: ({ proxy }) => (
    <el-button
      circle
      type="info"
      title="數據統計"
      onClick={() => {
        const stats = calculateStatistics(proxy.getTableData())
        ElNotification({
          title: '數據統計',
          message: `總數: ${stats.total} | 在職: ${stats.active}`,
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

### 2. 導出工具
```javascript
add({
  name: 'export',
  render: ({ proxy }) => (
    <el-button
      circle
      type="success"
      title="導出數據"
      onClick={() => {
        const data = proxy.getTableData()
        exportToExcel(data)
        ElMessage.success('導出中...')
      }}
    >
      <el-icon><Download /></el-icon>
    </el-button>
  ),
  show: true,
  order: 2
})
```

### 3. 導入工具
```javascript
add({
  name: 'import',
  render: ({ proxy }) => (
    <el-button
      circle
      type="warning"
      title="導入數據"
      onClick={() => {
        ElMessageBox.confirm('確定要導入數據嗎？', '導入確認', {
          type: 'warning'
        }).then(() => {
          // 觸發文件選擇或顯示導入對話框
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

### 4. 設置工具
```javascript
add({
  name: 'settings',
  render: ({ proxy }) => (
    <el-button
      circle
      type="primary"
      title="高級設置"
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

### 5. 自定義刷新工具
```javascript
add({
  name: 'refresh',
  render: ({ proxy }) => (
    <el-button
      circle
      title="刷新數據"
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
  order: 0                      // 優先級最高
})
```

## 插槽擴展

### 工具欄左側擴展
```vue
<template>
  <MaProTable :options="options" :schema="schema">
    <template #toolbarLeft>
      <div class="custom-toolbar-left">
        <el-space>
          <el-text type="primary">共 {{ totalCount }} 條記錄</el-text>
          <el-divider direction="vertical" />
          <el-text type="success">在職 {{ activeCount }} 人</el-text>
        </el-space>
      </div>
    </template>
  </MaProTable>
</template>
```

### 表格頂部操作區
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
            批量編輯
          </el-button>
          <el-button type="danger" size="small" @click="handleBatchDelete">
            <el-icon><Delete /></el-icon>
            批量刪除
          </el-button>
        </el-space>
      </div>
    </template>
  </MaProTable>
</template>
```

### 工具欄前後擴展
```vue
<template>
  <MaProTable :options="options" :schema="schema">
    <!-- 工具欄前置內容 -->
    <template #beforeToolbar>
      <el-button size="small" type="text">前置按鈕</el-button>
    </template>
    
    <!-- 工具欄後置內容 -->
    <template #afterToolbar>
      <el-button size="small" type="text">後置按鈕</el-button>
    </template>
  </MaProTable>
</template>
```

## 工具狀態控制

### 配置工具顯示狀態
```javascript
const options = {
  toolbar: true,                // 是否顯示工具欄
  toolStates: {
    size: true,                 // 顯示尺寸調整工具
    setting: true,              // 顯示列設置工具
    fullscreen: true,           // 顯示全屏工具
    refresh: false              // 隱藏刷新工具
  }
}
```

### 動態控制工具狀態
```javascript
// 運行時控制
const { hide, show } = useProTableToolbar()

// 隱藏某個工具
hide('statistics')

// 顯示某個工具
show('statistics')

// 條件顯示
const shouldShowExport = computed(() => hasPermission('export'))
add({
  name: 'export',
  show: shouldShowExport.value,
  render: ({ proxy }) => (...)
})
```

## 高級工具示例

### 系統監控工具
```javascript
add({
  name: 'monitor',
  render: ({ proxy }) => (
    <el-button
      circle
      type="danger"
      title="系統監控"
      onClick={() => {
        // 獲取系統狀態
        const status = getSystemStatus()
        ElNotification({
          title: '系統監控',
          message: `CPU: ${status.cpu}% | 內存: ${status.memory}% | 數據庫: ${status.db}`,
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
            <el-dropdown-item command="approve">批量審批</el-dropdown-item>
            <el-dropdown-item command="reject">批量拒絕</el-dropdown-item>
            <el-dropdown-item command="delete" divided>批量刪除</el-dropdown-item>
          </el-dropdown-menu>
        )
      }}
    </el-dropdown>
  ),
  show: true,
  order: 6
})
```

### 實時數據工具
```javascript
add({
  name: 'realtime',
  render: ({ proxy }) => {
    const [isRealtime, setIsRealtime] = useState(false)
    
    return (
      <el-button
        circle
        type={isRealtime ? 'success' : 'info'}
        title={isRealtime ? '停止實時刷新' : '開啓實時刷新'}
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

## 工具欄類型定義

```typescript
interface MaProTableToolbar {
  name: string                          // 工具名稱
  render: (props: {                     // 渲染函數
    proxy: MaProTableExpose
  }) => VNode | Component
  show: boolean | (() => boolean)       // 是否顯示
  order: number                         // 顯示順序
}
```

## 最佳實踐

### 1. 工具命名
- 使用描述性的名稱
- 避免與內置工具重名
- 保持命名一致性

### 2. 用户體驗
- 提供清晰的工具提示
- 使用合適的圖標和顏色
- 考慮工具的邏輯分組

### 3. 性能優化
- 避免在 render 函數中進行重度計算
- 合理使用響應式狀態
- 適時移除不需要的工具

### 4. 權限控制
```javascript
add({
  name: 'admin-tool',
  show: () => hasRole('admin'),         // 基於權限顯示
  render: ({ proxy }) => (...)
})
```

工具欄擴展功能讓你可以構建功能豐富的表格操作界面，提升用户的操作體驗。