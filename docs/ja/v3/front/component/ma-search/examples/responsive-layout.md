# レスポンシブレイアウト

異なる画面サイズにおけるレスポンシブ効果のデモを表示します。リアルタイムビューポート情報と動的設定テストを含み、検索コンポーネントが様々なデバイスで優れたユーザー体験を提供できることを確認します。

## レスポンシブレイアウトデモ

<DemoPreview dir="demos/ma-search/responsive-layout" />

## レスポンシブ設定説明

### ブレークポイントシステム
MaSearch は CSS Media Queries に基づくレスポンシブブレークポイントシステムを採用しています：

| ブレークポイント | 画面サイズ | デフォルト列数 | 代表的なデバイス |
|------|----------|----------|----------|
| `xs` | < 768px | 1 | スマートフォン縦画面 |
| `sm` | ≥ 768px | 2 | スマートフォン横画面、小型タブレット |
| `md` | ≥ 992px | 2 | タブレット、小型ノートPC |
| `lg` | ≥ 1200px | 3 | デスクトップモニター |
| `xl` | ≥ 1920px | 4 | 大型モニター |

### 基本設定
`cols` パラメータを使用して、異なるブレークポイントでの列数を設定します：

```typescript
const searchOptions = {
  cols: {
    xs: 1,  // モバイル端末では1列表示
    sm: 2,  // タブレットでは2列表示  
    md: 2,  // 中画面では2列表示
    lg: 3,  // 大画面では3列表示
    xl: 4   // 超大画面では4列表示
  }
}
```

### カスタムブレークポイント
実際のビジネス要件に応じてブレークポイントをカスタマイズします：

```typescript
// コンパクトなレイアウト
const compactCols = {
  xs: 1,
  sm: 3,
  md: 4,
  lg: 5,
  xl: 6
}

// ゆったりとしたレイアウト  
const spaciousCols = {
  xs: 1,
  sm: 1,
  md: 2,
  lg: 2,
  xl: 3
}
```

## 使用シーン

### 1. モバイルファースト設計
モバイルデバイス向けに最適化された検索インターフェース：

```typescript
// モバイルフレンドリー設定
const mobileFirstConfig = {
  cols: { xs: 1, sm: 1, md: 2, lg: 3, xl: 4 },
  fold: true,
  foldRows: 1  // モバイル端末ではデフォルトで1行のみ表示
}
```

### 2. デスクトップ密集表示
デスクトップの画面スペースを最大限に活用：

```typescript
// デスクトップ密集表示
const desktopDenseConfig = {
  cols: { xs: 1, sm: 2, md: 3, lg: 4, xl: 6 }
}
```

### 3. 適応型データダッシュボード
ダッシュボードのレイアウトに応じて検索領域を自動調整：

```typescript
// ダッシュボード適応設定
const dashboardConfig = {
  cols: { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 },
  fold: true,
  foldRows: 1
}
```

## レスポンシブ特性

### 自動列計算
コンポーネントはコンテナの幅とブレークポイント設定に基づいて、各行の列数を自動計算します。

### スムーズな遷移
画面サイズが変更されると、レイアウトはスムーズに遷移し、不自然なジャンプを避けます。

### コンテンツオーバーフロー処理
検索項目の内容が長すぎる場合、自動的に省略記号または改行処理が行われます。

## 主な特徴

- 📱 モバイルフレンドリーなレスポンシブ設計
- 🖥 大画面スペースの最大活用
- 🔄 スムーズなレイアウト遷移アニメーション
- 📏 柔軟なブレークポイント設定システム
- ⚡ 高性能なレイアウト計算

## 高度な設定

### 動的レスポンシブ
コンテナサイズに応じてレイアウトを動的に調整：

```typescript
// コンテナサイズ変更の監視
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

### デバイス種別検出
デバイスの種類に応じてレイアウトを最適化：

```typescript
// デバイス種別の検出
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

// デバイス種別に応じた設定
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
モバイル端末から設計を始め、段階的にデスクトップの体験を強化：

```typescript
// モバイルファーストの設定戦略
const progressiveConfig = {
  // モバイル端末の基本体験
  cols: { xs: 1 },
  fold: true,
  foldRows: 1,
  
  // タブレット端末の強化
  ...window.innerWidth >= 768 && { 
    cols: { xs: 1, sm: 2 },
    foldRows: 2 
  },
  
  // デスクトップ端末の完全な体験
  ...window.innerWidth >= 1200 && { 
    cols: { xs: 1, sm: 2, md: 3, lg: 4 },
    foldRows: 3 
  }
}
```

### 2. コンテンツの優先順位
異なる画面サイズで異なる優先順位の検索項目を表示：

```typescript
// 画面サイズに応じて異なる優先順位の検索項目を表示
const getItemsByPriority = (screenSize: string) => {
  const allItems = [
    { label: 'ユーザー名', prop: 'username', priority: 'high' },
    { label: 'ステータス', prop: 'status', priority: 'high' },
    { label: '登録日', prop: 'created_at', priority: 'medium' },
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
小画面デバイスでの描画パフォーマンスを最適化：

```typescript
// 小画面デバイスのパフォーマンス最適化
const optimizedConfig = {
  // モバイル端末では列数を減らしてパフォーマンス向上
  cols: window.innerWidth < 768 ? { xs: 1 } : { xs: 1, sm: 2, md: 3, lg: 4 },
  
  // モバイル端末ではデフォルトで折りたたみ、初期描画を削減
  fold: window.innerWidth < 768,
  foldRows: window.innerWidth < 768 ? 1 : 2
}
```

## 関連リンク

- [折りたたみ検索](./collapsible-search) - 折りたたみ機能とレスポンシブの組み合わせについて
- [テーブル統合](./table-integration) - レスポンシブ検索とテーブルの統合について
- [基本の使い方](./basic-usage) - 基本的な検索機能について