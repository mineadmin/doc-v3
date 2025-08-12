# レスポンシブテーブル

テーブルの高さ自動調整、レスポンシブレイアウト、ローディング状態などの機能を展示します。

## レスポンシブテーブルデモ

<DemoPreview dir="demos/ma-table/responsive" />

## 機能特徴

### 高さ自動調整
- **動的高さ**: ウィンドウサイズに応じてテーブル高さを自動調整
- **下部オフセット**: ページ下部からのオフセット量を設定可能
- **ウィンドウ監視**: ウィンドウサイズ変化を監視しリアルタイム対応
- **コンテナ適応**: 親コンテナサイズに基づき自動調整

### レスポンシブレイアウト
- **列幅自動調整**: 内容と利用可能スペースに基づき列幅を自動調整
- **モバイル対応**: 小画面デバイス向けに表示を最適化
- **サイズ制御**: 大・中・小3種類のテーブルサイズをサポート

### ローディング状態
- **ローディングアニメーション**: データ読み込み時にマスクとアニメーションを表示
- **カスタム設定**: ローディングテキスト、アイコン、背景などをカスタマイズ可能
- **状態制御**: プログラムでローディング状態の表示/非表示を制御

## 設定例

### 高さ自動調整設定
```javascript
const options = {
  adaption: true,              // 高さ自動調整を有効化
  adaptionOffsetBottom: 100,   // 下部オフセット量(px)
  containerHeight: 'auto'      // コンテナ高さ設定
}
```

### ローディング状態設定
```javascript
const options = {
  loading: false,              // ローディング状態
  loadingConfig: {
    text: 'データ読み込み中...', // ローディングテキスト
    spinner: 'el-icon-loading', // ローディングアイコン
    background: 'rgba(0, 0, 0, 0.7)', // 背景色
    customClass: 'custom-loading'     // カスタムCSSクラス
  }
}
```

### レスポンシブ列設定
```javascript
const columns = [
  { 
    label: 'タイトル', 
    prop: 'title',
    minWidth: 200,              // 最小幅
    showOverflowTooltip: true   // 内容オーバーフロー時にツールチップ表示
  },
  { 
    label: '説明', 
    prop: 'description',
    width: 'auto',              // 自動幅調整
    align: 'left'
  }
]
```

### 動的制御例
```vue
<template>
  <div>
    <!-- コントロールパネル -->
    <div class="control-panel">
      <el-switch 
        v-model="adaptionEnabled"
        @change="toggleAdaption"
        active-text="高さ自動調整"
      />
      
      <el-slider 
        v-model="offsetBottom"
        :min="50"
        :max="200"
        @change="updateOffset"
        style="width: 200px;"
      />
      
      <el-button @click="simulateLoading">
        データ更新
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
    text: 'データ読み込み中...',
    background: 'rgba(0, 0, 0, 0.7)'
  }
})

// 高さ自動調整切り替え
const toggleAdaption = (enabled) => {
  options.adaption = enabled
  tableRef.value?.setOptions(options)
}

// 下部オフセット更新
const updateOffset = (value) => {
  options.adaptionOffsetBottom = value
  tableRef.value?.setOptions(options)
}

// ローディングシミュレーション
const simulateLoading = async () => {
  tableRef.value?.setLoadingState(true)
  
  try {
    // 非同期操作シミュレーション
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // データ更新
    await refreshData()
    
  } finally {
    tableRef.value?.setLoadingState(false)
  }
}

// ウィンドウサイズ変化監視
const handleResize = () => {
  // テーブルは自動的にウィンドウ変化に対応、追加ロジック可能
  console.log('ウィンドウサイズ変化')
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
```

## レスポンシブパラメータ

### 高さ自動調整設定

| パラメータ | 説明 | タイプ | デフォルト値 |
|-----|------|-----|--------|
| `adaption` | 高さ自動調整有効化 | `boolean` | `false` |
| `adaptionOffsetBottom` | 下部オフセット量(px) | `number` | `70` |
| `containerHeight` | コンテナ高さ設定 | `string` | - |
| `height` | テーブル高さ | `string \| number` | - |
| `maxHeight` | テーブル最大高さ | `string \| number` | - |

### ローディング設定

| パラメータ | 説明 | タイプ | デフォルト値 |
|-----|------|-----|--------|
| `loading` | ローディング状態表示 | `boolean` | `false` |
| `loadingConfig.text` | ローディングテキスト | `string` | - |
| `loadingConfig.spinner` | カスタムローディングアイコン | `string` | - |
| `loadingConfig.svg` | カスタムSVGアイコン | `string` | - |
| `loadingConfig.background` | マスク背景色 | `string` | - |
| `loadingConfig.customClass` | カスタムCSSクラス | `string` | - |

### レスポンシブ列設定

| パラメータ | 説明 | タイプ | デフォルト値 |
|-----|------|-----|--------|
| `minWidth` | 列最小幅 | `string \| number` | - |
| `showOverflowTooltip` | 内容オーバーフロー時にツールチップ表示 | `boolean` | `false` |
| `fit` | 列幅自動調整 | `boolean` | `true` |

## Expose メソッド

| メソッド名 | 説明 | パラメータ | 戻り値 |
|-------|------|------|--------|
| `setLoadingState` | ローディング状態設定 | `loading: boolean` | - |
| `setOptions` | テーブル設定更新 | `options: MaTableOptions` | - |

## 使用シナリオ

### 1. フルスクリーンテーブル
```javascript
const fullScreenOptions = {
  adaption: true,
  adaptionOffsetBottom: 0,  // 下部オフセットなし
  containerHeight: '100vh',
  showPagination: false
}
```

### 2. ダイアログ内テーブル
```javascript
const dialogTableOptions = {
  adaption: false,
  height: '400px',         // 固定高さ
  maxHeight: '400px'
}
```

### 3. モバイル対応
```javascript
const mobileOptions = {
  size: 'small',           // 小サイズ
  showOverflowTooltip: true,
  columnAlign: 'left',     // 左揃え（モバイル向け）
  showPagination: true,
  pagination: {
    size: 'small',
    layout: 'prev, pager, next'  // 簡易ページネーション
  }
}
```

### 4. データ更新シナリオ
```vue
<script setup>
// ローディング状態付きデータ更新
const refreshWithLoading = async () => {
  try {
    // ローディング状態開始
    tableRef.value?.setLoadingState(true)
    
    // 新規データ取得
    const newData = await api.fetchTableData()
    
    // データ更新
    tableRef.value?.setData(newData)
    
    ElMessage.success('データ更新成功')
    
  } catch (error) {
    ElMessage.error('データ更新失敗')
    console.error(error)
    
  } finally {
    // ローディング状態終了
    tableRef.value?.setLoadingState(false)
  }
}

// 自動更新
let refreshTimer = null

const startAutoRefresh = () => {
  refreshTimer = setInterval(refreshWithLoading, 30000) // 30秒間隔で更新
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

## ベストプラクティス

1. **適切な高さ自動調整**: メインエリアでは高さ自動調整、ダイアログでは固定高さを使用
2. **ローディング状態管理**: ローディング状態を統一管理し重複表示を防止
3. **レスポンシブ設計**: 異なる画面サイズでの表示を考慮
4. **パフォーマンス最適化**: 高さ計算とDOM操作の頻度を抑える
5. **ユーザー体験**: 明確なローディングフィードバックとエラー処理を提供

## 注意事項

- 高さ自動調整はウィンドウサイズに依存し、非表示状態では不正確になる可能性
- ローディング状態の表示/非表示はペアで管理し状態混乱を防止
- モバイルではタッチ操作のユーザー体験に特に注意
- ウィンドウサイズ変化監視は適切にクリーンアップしメモリリークを防止

## CSS変数カスタマイズ

```css
/* カスタムレスポンシブテーブルスタイル */
.ma-table {
  --table-border-color: #ebeef5;
  --table-text-color: #606266;
  --table-header-background: #f5f7fa;
  --table-row-hover-background: #f5f7fa;
}

/* モバイル対応 */
@media (max-width: 768px) {
  .ma-table {
    font-size: 12px;
  }
  
  .ma-table .cell {
    padding: 8px 4px;
  }
}
```