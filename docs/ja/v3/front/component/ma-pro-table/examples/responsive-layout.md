# レスポンシブレイアウト

異なる画面サイズにおけるテーブルのレスポンシブ動作を示し、モバイル端末への適応とレイアウト最適化を含みます。

<DemoPreview dir="demos/ma-pro-table-examples/responsive-layout" />

## 機能特徴

- **デバイス適応**：デスクトップ、タブレット、スマートフォンなど、さまざまなデバイスに自動適応
- **動的列管理**：画面サイズに応じて列を動的に表示/非表示
- **レスポンシブ検索**：検索フォームがレスポンシブレイアウトに対応
- **操作最適化**：デバイスごとに最適化された操作方法
- **パフォーマンス重視**：小画面デバイスに過剰な情報を表示しない

## デバイスブレークポイント設定

### 標準ブレークポイント
```javascript
const deviceConfigs = {
  desktop: { 
    width: 1200, 
    name: 'デスクトップ', 
    type: '大画面', 
    columns: 8 
  },
  tablet: { 
    width: 768, 
    name: 'タブレット', 
    type: '中画面', 
    columns: 5 
  },
  mobile: { 
    width: 375, 
    name: 'スマートフォン', 
    type: '小画面', 
    columns: 3 
  }
}
```

### レスポンシブコンテナ
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

## レスポンシブ検索

### 検索項目数の制御
```javascript
// デバイスに応じて検索項目の表示数を調整
const updateSearchLayout = (device) => {
  const showNumber = device === 'desktop' ? 4 : 
                    device === 'tablet' ? 2 : 1
                    
  options.searchOptions = {
    showNumber,
    layout: device === 'mobile' ? 'vertical' : 'auto'
  }
}
```

### 検索レイアウトモード
```javascript
const searchOptions = {
  showNumber: 3,            // デフォルトの表示検索項目数
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

## レスポンシブテーブル列

### 動的列表示
```javascript
const updateTableColumns = (device) => {
  const baseColumns = [
    { label: 'ID', prop: 'id', width: 60 },
    { label: '氏名', prop: 'name', width: 100, fixed: 'left' },
    { label: '部署', prop: 'department', width: 100 },
    { label: '役職', prop: 'position', width: 150 },
    { label: '給与', prop: 'salary', width: 120 },
    { label: 'ステータス', prop: 'status', width: 80 },
    { label: '入社日', prop: 'createTime', width: 120 }
  ]
  
  let visibleColumns
  if (device === 'mobile') {
    // スマートフォンではコア情報のみ表示
    visibleColumns = [
      baseColumns[0], // ID
      baseColumns[1], // 氏名
      baseColumns[2], // 部署
      baseColumns[5], // ステータス
      operationColumn
    ]
  } else if (device === 'tablet') {
    // タブレットでは主要情報を表示
    visibleColumns = [
      baseColumns[0], // ID
      baseColumns[1], // 氏名
      baseColumns[2], // 部署
      baseColumns[3], // 役職
      baseColumns[4], // 給与
      baseColumns[5], // ステータス
      operationColumn
    ]
  } else {
    // デスクトップでは全情報を表示
    visibleColumns = [...baseColumns, operationColumn]
  }
  
  schema.tableColumns = visibleColumns
}
```

### 列幅の適応
```javascript
// スマートフォン向け列幅最適化
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

## レスポンシブ操作

### 操作列の適応
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

### デバイス固有の操作
```javascript
const getDeviceActions = (device) => {
  const baseActions = [
    {
      name: 'view',
      text: device === 'mobile' ? '表示' : '詳細',
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
      text: '編集',
      onClick: (data) => {
        showEditDialog(data.row, device)
      }
    }
  ]
  
  // デスクトップではより多くの操作を表示
  if (device === 'desktop') {
    baseActions.push(
      {
        name: 'contact',
        text: '連絡',
        onClick: (data) => {
          showContactInfo(data.row)
        }
      },
      {
        name: 'history',
        text: '履歴',
        onClick: (data) => {
          showHistory(data.row)
        }
      }
    )
  }
  
  return baseActions
}
```

## スマートフォン向け最適化

### セル内容の適応
```javascript
// スマートフォン向けスキルタグ表示の最適化
{
  label: 'スキル',
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

### スマートフォン向けスタイル
```css
/* スマートフォン専用スタイル */
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

### タブレット向けスタイル
```css
/* タブレット専用スタイル */
.responsive-container.tablet :deep(.el-table th),
.responsive-container.tablet :deep(.el-table td) {
  padding: 10px 6px;
}

.responsive-container.tablet :deep(.el-button) {
  padding: 6px 12px;
}
```

## ページネーションのレスポンシブ対応

### ページネーションレイアウトの適応
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

## メディアクエリの統合

### CSSメディアクエリ
```css
/* メディアクエリを使用した真のレスポンシブ実現 */
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

### JavaScriptメディアクエリ
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

// 使用例
const isMobile = useMediaQuery('(max-width: 768px)')
const isTablet = useMediaQuery('(max-width: 1024px) and (min-width: 769px)')
```

## ツールバーのレスポンシブ対応

### ツールバーボタンの適応
```javascript
const getToolbarConfig = (device) => {
  if (device === 'mobile') {
    return {
      size: 'small',
      onlyIcons: true,        // アイコンのみ表示
      maxButtons: 3           // 最大3つのボタンを表示
    }
  } else if (device === 'tablet') {
    return {
      size: 'default',
      showText: true,         // テキストを表示
      maxButtons: 5
    }
  } else {
    return {
      size: 'default',
      showText: true,
      maxButtons: -1          // すべてのボタンを表示
    }
  }
}
```

## ベストプラクティス

### 1. プログレッシブエンハンスメント
- スマートフォンからデザインを開始
- デスクトップ機能を段階的に追加
- コア機能をすべてのデバイスで利用可能に

### 2. パフォーマンス最適化
- 小画面デバイスでの過剰なデータ読み込みを回避
- 大量データの場合は仮想スクロールを使用
- 画像やメディアリソースを適切に使用

### 3. ユーザーエクスペリエンス
- デバイス固有の操作方式を提供
- 一貫した視覚的階層を維持
- タッチターゲットの十分な大きさを確保

### 4. テスト戦略
- 実際のデバイスでテスト
- ブラウザ開発ツールを使用したシミュレーション
- ネットワーク条件の影響を考慮

レスポンシブレイアウト機能により、テーブルアプリケーションがさまざまなデバイスに完全に適応し、一貫したユーザーエクスペリエンスを提供します。