# レスポンシブレイアウト

異なる画面サイズでのレスポンシブ効果をデモンストレーションし、リアルタイムのビューポート情報と動的な設定テストを含み、検索コンポーネントが様々なデバイスで良好なユーザーエクスペリエンスを提供することを保証します。

## レスポンシブレイアウトデモ

<DemoPreview dir="demos/ma-search/responsive-layout" />

## レスポンシブ設定説明

### ブレークポイントシステム
MaSearchはCSS Media Queriesに基づいたレスポンシブブレークポイントシステムを採用しています：

| ブレークポイント | 画面サイズ | デフォルト列数 | 代表的なデバイス |
|------|----------|----------|----------|
| `xs` | < 768px | 1 | スマートフォン縦向き |
| `sm` | ≥ 768px | 2 | スマートフォン横向き、小型タブレット |
| `md` | ≥ 992px | 2 | タブレット、小型ノートPC |
| `lg` | ≥ 1200px | 3 | デスクトップモニター |
| `xl` | ≥ 1920px | 4 | 大型ディスプレイ |

### 基本設定
`cols`パラメータで異なるブレークポイントでの列数を設定：

```typescript
const searchOptions = {
  cols: {
    xs: 1,  // モバイル端末で単列表示
    sm: 2,  // タブレットで2列表示  
    md: 2,  // 中画面で2列表示
    lg: 3,  // 大画面で3列表示
    xl: 4   // 超大画面で4列表示
  }
}
```

### カスタムブレークポイント
実際の業務ニーズに応じてブレークポイントをカスタマイズ：

```typescript
// コンパクトレイアウト
const compactCols = {
  xs: 1,
  sm: 3,
  md: 4,
  lg: 5,
  xl: 6
}

// ゆったりレイアウト  
const spaciousCols = {
  xs: 1,
  sm: 1,
  md: 2,
  lg: 2,
  xl: 3
}
```

## 使用シナリオ

### 1. モバイルファースト設計
モバイルデバイスに最適化された検索インターフェース：

```typescript
// モバイルフレンドリー設定
const mobileFirstConfig = {
  cols: { xs: 1, sm: 1, md: 2, lg: 3, xl: 4 },
  fold: true,
  foldRows: 1  // モバイル端末ではデフォルトで1行表示
}
```

### 2. デスクトップ高密度表示
デスクトップの画面スペースを最大限に活用：

```typescript
// デスクトップ高密度表示
const desktopDenseConfig = {
  cols: { xs: 1, sm: 2, md: 3, lg: 4, xl: 6 }
}
```

### 3. 適応型データダッシュボード
ダッシュボードレイアウトに応じて検索エリアを自動調整：

```typescript
// ダッシュボード適応型設定
const dashboardConfig = {
  cols: { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 },
  fold: true,
  foldRows: 1
}
```

## レスポンシブ機能

### 自動列計算
コンポーネントはコンテナ幅とブレークポイント設定に基づいて自動的に列数を計算します。

### スムーズな遷移
画面サイズ変更時にレイアウトがスムーズに遷移し、突然のジャンプを防ぎます。

### コンテンツオーバーフロー処理
検索項目の内容が長すぎる場合、自動的に省略記号を追加または改行処理を行います。

## 主要機能

- 📱 モバイルフレンドリーなレスポンシブデザイン
- 🖥 大画面スペースの有効活用
- 🔄 スムーズなレイアウト遷移アニメーション
- 📏 柔軟なブレークポイント設定システム
- ⚡ 高性能なレイアウト計算

## 高度な設定

### ダイナミックレスポンシブ
コンテナサイズに応じて動的にレイアウトを調整：

```typescript
// コンテナサイズ変化を監視
const useResponsiveColumns = () => {
  const containerRef = ref<HTMLElement>()
  const cols = ref({ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 })
  
  const updateCols = () => {
    if (!containerRef.value) return
    
    const width = containerRef.value.offsetWidth
    if (width < 600) {
      cols.value = { xs: 1, sm: 1, md: 2, lg: 3, xl: 4 }
    } else if (width > 1400) {
      cols.value = { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }
    }
  }
  
  onMounted(() => {
    window.addEventListener('resize', updateCols)
    updateCols()
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', updateCols)
  })
  
  return { containerRef, cols }
}
```

### デバイスタイプ検出
デバイスタイプに応じてレイアウトを最適化：

```typescript
// デバイスタイプを検出
const deviceType = () => {
  const ua = navigator.userAgent
  if (/Mobile|Android|iPhone/i.test(ua)) {
    return 'mobile'
  } else if (/Tablet|iPad/i.test(ua)) {
    return 'tablet' 
  } else {
    return 'desktop'
  }
}

// デバイスタイプに応じて設定
const getDeviceConfig = () => {
  const type = deviceType()
  switch (type) {
    case 'mobile':
      return { cols: { xs: 1, sm: 1, md: 1, lg: 2, xl: 2 }, foldRows: 1 }
    case 'tablet':
      return { cols: { xs: 1, sm: 2, md: 2, lg: 3, xl: 3 }, foldRows: 2 }
    case 'desktop':
      return { cols: { xs: 2, sm: 3, md: 4, lg: 4, xl: 5 }, foldRows: 3 }
  }
}
```

## ベストプラクティス

### 1. プログレッシブエンハンスメント
モバイルから設計を開始し、徐々にデスクトップエクスペリエンスを強化：

```typescript
// モバイルファーストの設定戦略
const progressiveConfig = {
  // モバイル基本エクスペリエンス
  cols: { xs: 1 },
  fold: true,
  foldRows: 1,
  
  // タブレットエンハンスメント
  ...window.innerWidth >= 768 && { 
    cols: { xs: 1, sm: 2 },
    foldRows: 2 
  },
  
  // デスクトップ完全エクスペリエンス
  ...window.innerWidth >= 1200 && { 
    cols: { xs: 1, sm: 2, md: 3, lg: 4 },
    foldRows: 3 
  }
}
```

### 2. コンテンツ優先順位
異なる画面サイズで異なる優先順位の検索項目を表示：

```typescript
// 画面サイズに応じて優先順位の異なる検索項目を表示
const getItemsByPriority = (screenSize: string) => {
  const allItems = [
    { label: 'ユーザー名', prop: 'username', priority: 'high' },
    { label: 'ステータス', prop: 'status', priority: 'high' },
    { label: '登録日時', prop: 'created_at', priority: 'medium' },
    { label: '最終ログイン', prop: 'last_login', priority: 'low' }
  ]
  
  switch (screenSize) {
    case 'xs':
      return allItems.filter(item => item.priority === 'high')
    case 'sm':
      return allItems.filter(item => ['high', 'medium'].includes(item.priority))
    default:
      return allItems
  }
}
```

### 3. パフォーマンス最適化
小型デバイスでレンダリングパフォーマンスを最適化：

```typescript
// 小型デバイスのパフォーマンス最適化
const optimizedConfig = {
  // モバイルで列数を減らしてパフォーマンス向上
  cols: window.innerWidth < 768 ? { xs: 1 } : { xs: 1, sm: 2, md: 3, lg: 4 },
  
  // モバイルでデフォルト折りたたみにより初期レンダリングを軽減
  fold: window.innerWidth < 768,
  foldRows: window.innerWidth < 768 ? 1 : 2
}
```

## 関連リンク

- [折りたたみ検索](./collapsible-search) - 折りたたみ機能とレスポンシブの連携について
- [テーブル統合](./table-integration) - レスポンシブ検索とテーブルの統合について
- [基本使用法](./basic-usage) - 基本的な検索機能について