# レスポンシブテーブル

テーブルのアダプティブ高さ、レスポンシブレイアウト、ローディング状態などの機能を紹介します。

## レスポンシブテーブルデモ

<DemoPreview dir="demos/ma-table/responsive" />

## 機能特性

### アダプティブ高さ
- **動的高さ**: テーブルの高さがウィンドウサイズに応じて自動調整されます
- **下部オフセット**: ページ下部からのオフセット量を設定可能
- **ウィンドウ監視**: ウィンドウサイズの変化を監視しリアルタイムに応答
- **コンテナ適応**: 親コンテナのサイズに応じて自動調整

### レスポンシブレイアウト
- **列幅自動調整**: 列幅がコンテンツと利用可能なスペースに応じて自動調整
- **モバイル対応**: 小画面デバイスでの表示を最適化
- **サイズ制御**: 大、中、小の3種類のテーブルサイズをサポート

### ローディング状態
- **ローディングアニメーション**: データ読み込み中にマスクとアニメーションを表示
- **カスタム設定**: ローディングテキスト、アイコン、背景などをカスタマイズ可能
- **状態制御**: プログラムによるローディング状態の表示/非表示制御

## 設定例

### アダプティブ高さ設定
```javascript
const options = {
  adaption: true,              // アダプティブ高さを有効化
  adaptionOffsetBottom: 100,   // 下部からのオフセット量(px)
  containerHeight: 'auto'      // コンテナ高さ設定
}
```

### ローディング状態設定
```javascript
const options = {
  loading: false,              // ローディング状態
  loadingConfig: {
    text: 'データ読み込み中...',      // ローディングテキスト
    spinner: 'el-icon-loading', // ローディングアイコン
    background: 'rgba(0, 0, 0, 0.7)', // 背景色
    customClass: 'custom-loading'      // カスタムスタイルクラス
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
    showOverflowTooltip: true   // コンテンツオーバーフロー時にツールチップ表示
  },
  { 
    label: '説明', 
    prop: 'description',
    width: 'auto',              // 自動調整幅
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
        active-text="アダプティブ高さ"
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

// アダプティブ高さ切り替え
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
    // 非同期処理をシミュレート
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // データ更新
    await refreshData()
    
  } finally {
    tableRef.value?.setLoadingState(false)
  }
}

// ウィンドウサイズ変化監視
const handleResize = () => {
  // テーブルは自動的にウィンドウ変化に応答、ここでは追加ロジックを記述可能
  console.log('ウィンドウサイズ変更')
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

### アダプティブ設定

| パラメータ | 説明 | 型 | デフォルト値 |
|-----------|------|-----|------------|
| `adaption` | アダプティブ高さを有効にするか | `boolean` | `false` |
| `adaptionOffsetBottom` | 下部からのオフセット量(px) | `number` | `70` |
| `containerHeight` | コンテナ高さ設定 | `string` | - |
| `height` | テーブル高さ | `string \| number` | - |
| `maxHeight` | テーブル最大高さ | `string \| number` | - |

### ローディング設定

| パラメータ | 説明 | 型 | デフォルト値 |
|-----------|------|-----|------------|
| `loading` | ローディング状態を表示するか | `boolean` | `false` |
| `loadingConfig.text` | ローディングテキスト | `string` | - |
| `loadingConfig.spinner` | カスタムローディングアイコン | `string` | - |
| `loadingConfig.svg` | カスタムSVGアイコン | `string` | - |
| `loadingConfig.background` | マスク背景色 | `string` | - |
| `loadingConfig.customClass` | カスタムスタイルクラス | `string` | - |

### レスポンシブ列設定

| パラメータ | 説明 | 型 | デフォルト値 |
|-----------|------|-----|------------|
| `minWidth` | 列の最小幅 | `string \| number` | - |
| `showOverflowTooltip` | コンテンツが長すぎる場合にツールチップを表示 | `boolean` | `false` |
| `fit` | 列幅を自動調整するか | `boolean` | `true` |

## Expose メソッド

| メソッド名 | 説明 | パラメータ | 戻り値 |
|-----------|------|-----------|--------|
| `setLoadingState` | ローディング状態を設定 | `loading: boolean` | - |
| `setOptions` | テーブル設定を更新 | `options: MaTableOptions` | - |

## 使用シーン

### 1. 全画面テーブル
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
  columnAlign: 'left',     // 左揃えはモバイルに最適
  showPagination: true,
  pagination: {
    size: 'small',
    layout: 'prev, pager, next'  // ページネーションレイアウト簡略化
  }
}
```

### 4. データ更新シーン
```vue
<script setup>
// ローディング状態付きデータ更新
const refreshWithLoading = async () => {
  try {
    // ローディング状態を有効化
    tableRef.value?.setLoadingState(true)
    
    // 新データを取得
    const newData = await api.fetchTableData()
    
    // データ更新
    tableRef.value?.setData(newData)
    
    ElMessage.success('データ更新成功')
    
  } catch (error) {
    ElMessage.error('データ更新失敗')
    console.error(error)
    
  } finally {
    // ローディング状態を無効化
    tableRef.value?.setLoadingState(false)
  }
}

// 定期更新
let refreshTimer = null

const startAutoRefresh = () => {
  refreshTimer = setInterval(refreshWithLoading, 30000) // 30秒ごとに更新
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

1. **アダプティブの適切な使用**: ページの主要領域ではアダプティブ高さを使用し、ダイアログなどのシーンでは固定高さを使用
2. **ローディング状態管理**: ローディング状態を統一管理し、重複表示を避ける
3. **レスポンシブデザイン**: 異なる画面サイズでの表示効果を考慮
4. **パフォーマンス最適化**: 頻繁な高さ計算やDOM操作を避ける
5. **ユーザー体験**: 明確なローディングフィードバックとエラー処理を提供

## 注意事項

- アダプティブ高さはウィンドウサイズに依存するため、非表示状態では正確でない場合があります
- ローディング状態の表示と非表示は対で使用し、状態の混乱を避ける
- モバイル端末ではタッチ操作の体験に特に注意
- ウィンドウサイズ変化の監視は適切にクリーンアップし、メモリリークを防止

## CSS 変数カスタマイズ

```css
/* カスタムテーブルレスポンシブスタイル */
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