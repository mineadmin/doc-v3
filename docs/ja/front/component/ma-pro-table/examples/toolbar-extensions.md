# ツールバー拡張

プラグインAPIを使用してツールバー機能を拡張する方法を紹介し、カスタムツールボタンとツールバーレイアウトを含みます。

<DemoPreview dir="demos/ma-pro-table-examples/toolbar-extensions" />

## 機能特徴

- **プラグイン機構**：プラグインAPIでツールバー機能を拡張
- **カスタムツール**：カスタムツールボタンの登録をサポート
- **スロット拡張**：スロットによるツールバーレイアウト拡張をサポート
- **状態制御**：ツールの動的な表示/非表示をサポート
- **順序制御**：ツール表示順序のカスタマイズをサポート

## プラグインAPI拡張

### ツールバープラグイン登録
```javascript
import { useProTableToolbar } from '@mineadmin/pro-table'

const { add, remove, hide, show } = useProTableToolbar()

// カスタムツールを追加
add({
  name: 'statistics',           // ツール名（ユニーク識別子）
  render: ({ proxy }) => (      // レンダリング関数
    <el-button
      circle
      type="info"
      title="データ統計"
      onClick={() => showStatistics()}
    >
      <el-icon><ChatDotRound /></el-icon>
    </el-button>
  ),
  show: true,                   // 表示するかどうか
  order: 1                      // 表示順序
})
```

### ツールバー管理メソッド
```javascript
const { add, remove, hide, show, get, getAll } = useProTableToolbar()

// ツールを追加
add(toolbar)

// ツールを削除
remove('tool-name')

// ツールを非表示
hide('tool-name')

// ツールを表示
show('tool-name')

// 単一ツールを取得
const tool = get('tool-name')

// 全てのツールを取得
const allTools = getAll()
```

## 一般的なツール例

### 1. データ統計ツール
```javascript
add({
  name: 'statistics',
  render: ({ proxy }) => (
    <el-button
      circle
      type="info"
      title="データ統計"
      onClick={() => {
        const stats = calculateStatistics(proxy.getTableData())
        ElNotification({
          title: 'データ統計',
          message: `総数: ${stats.total} | 在職: ${stats.active}`,
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

### 2. エクスポートツール
```javascript
add({
  name: 'export',
  render: ({ proxy }) => (
    <el-button
      circle
      type="success"
      title="データエクスポート"
      onClick={() => {
        const data = proxy.getTableData()
        exportToExcel(data)
        ElMessage.success('エクスポート中...')
      }}
    >
      <el-icon><Download /></el-icon>
    </el-button>
  ),
  show: true,
  order: 2
})
```

### 3. インポートツール
```javascript
add({
  name: 'import',
  render: ({ proxy }) => (
    <el-button
      circle
      type="warning"
      title="データインポート"
      onClick={() => {
        ElMessageBox.confirm('データをインポートしますか？', 'インポート確認', {
          type: 'warning'
        }).then(() => {
          // ファイル選択またはインポートダイアログを表示
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

### 4. 設定ツール
```javascript
add({
  name: 'settings',
  render: ({ proxy }) => (
    <el-button
      circle
      type="primary"
      title="詳細設定"
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

### 5. カスタムリフレッシュツール
```javascript
add({
  name: 'refresh',
  render: ({ proxy }) => (
    <el-button
      circle
      title="データ更新"
      onClick={async () => {
        ElMessage.info('更新中...')
        await proxy.refresh()
        ElMessage.success('更新完了')
      }}
    >
      <el-icon><Refresh /></el-icon>
    </el-button>
  ),
  show: true,
  order: 0                      // 最高優先度
})
```

## スロット拡張

### ツールバー左側拡張
```vue
<template>
  <MaProTable :options="options" :schema="schema">
    <template #toolbarLeft>
      <div class="custom-toolbar-left">
        <el-space>
          <el-text type="primary">合計 {{ totalCount }} 件</el-text>
          <el-divider direction="vertical" />
          <el-text type="success">在職 {{ activeCount }} 人</el-text>
        </el-space>
      </div>
    </template>
  </MaProTable>
</template>
```

### テーブル上部操作エリア
```vue
<template>
  <MaProTable :options="options" :schema="schema">
    <template #tableTop>
      <div class="table-top-actions">
        <el-space>
          <el-button type="primary" size="small" @click="handleBatchAdd">
            <el-icon><Plus /></el-icon>
            一括追加
          </el-button>
          <el-button type="warning" size="small" @click="handleBatchEdit">
            <el-icon><Edit /></el-icon>
            一括編集
          </el-button>
          <el-button type="danger" size="small" @click="handleBatchDelete">
            <el-icon><Delete /></el-icon>
            一括削除
          </el-button>
        </el-space>
      </div>
    </template>
  </MaProTable>
</template>
```

### ツールバー前後拡張
```vue
<template>
  <MaProTable :options="options" :schema="schema">
    <!-- ツールバー前コンテンツ -->
    <template #beforeToolbar>
      <el-button size="small" type="text">前ボタン</el-button>
    </template>
    
    <!-- ツールバー後コンテンツ -->
    <template #afterToolbar>
      <el-button size="small" type="text">後ボタン</el-button>
    </template>
  </MaProTable>
</template>
```

## ツール状態制御

### ツール表示状態設定
```javascript
const options = {
  toolbar: true,                // ツールバーを表示するか
  toolStates: {
    size: true,                 // サイズ調整ツールを表示
    setting: true,              // 列設定ツールを表示
    fullscreen: true,           // 全画面ツールを表示
    refresh: false              // 更新ツールを非表示
  }
}
```

### 動的ツール状態制御
```javascript
// 実行時制御
const { hide, show } = useProTableToolbar()

// 特定ツールを非表示
hide('statistics')

// 特定ツールを表示
show('statistics')

// 条件付き表示
const shouldShowExport = computed(() => hasPermission('export'))
add({
  name: 'export',
  show: shouldShowExport.value,
  render: ({ proxy }) => (...)
})
```

## 高度なツール例

### システム監視ツール
```javascript
add({
  name: 'monitor',
  render: ({ proxy }) => (
    <el-button
      circle
      type="danger"
      title="システム監視"
      onClick={() => {
        // システム状態を取得
        const status = getSystemStatus()
        ElNotification({
          title: 'システム監視',
          message: `CPU: ${status.cpu}% | メモリ: ${status.memory}% | データベース: ${status.db}`,
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

### バッチ操作ツール
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
          <el-button circle type="warning" title="一括操作">
            <el-icon><MoreFilled /></el-icon>
          </el-button>
        ),
        dropdown: () => (
          <el-dropdown-menu>
            <el-dropdown-item command="approve">一括承認</el-dropdown-item>
            <el-dropdown-item command="reject">一括拒否</el-dropdown-item>
            <el-dropdown-item command="delete" divided>一括削除</el-dropdown-item>
          </el-dropdown-menu>
        )
      }}
    </el-dropdown>
  ),
  show: true,
  order: 6
})
```

### リアルタイムデータツール
```javascript
add({
  name: 'realtime',
  render: ({ proxy }) => {
    const [isRealtime, setIsRealtime] = useState(false)
    
    return (
      <el-button
        circle
        type={isRealtime ? 'success' : 'info'}
        title={isRealtime ? 'リアルタイム更新停止' : 'リアルタイム更新開始'}
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

## ツールバー型定義

```typescript
interface MaProTableToolbar {
  name: string                          // ツール名
  render: (props: {                     // レンダリング関数
    proxy: MaProTableExpose
  }) => VNode | Component
  show: boolean | (() => boolean)       // 表示するかどうか
  order: number                         // 表示順序
}
```

## ベストプラクティス

### 1. ツール命名
- 説明的な名前を使用
- 組み込みツールとの重複を避ける
- 命名の一貫性を保つ

### 2. ユーザーエクスペリエンス
- 明確なツールチップを提供
- 適切なアイコンと色を使用
- ツールの論理的なグループ化を考慮

### 3. パフォーマンス最適化
- render関数での重い計算を避ける
- リアクティブ状態を適切に使用
- 不要なツールを適時に削除

### 4. 権限制御
```javascript
add({
  name: 'admin-tool',
  show: () => hasRole('admin'),         // 権限に基づいて表示
  render: ({ proxy }) => (...)
})
```

ツールバー拡張機能により、機能豊富なテーブル操作インターフェースを構築し、ユーザー操作体験を向上させることができます。