# レイアウトシステム

MaFormの2種類のレイアウトシステム（FlexグリッドレイアウトとGridスペーシングレイアウト）とレスポンシブデザインの実装を紹介します。

<DemoPreview dir="demos/ma-form/layout-systems" />

## 機能特徴

- **デュアルレイアウトシステム**: FlexとGridの2つのレイアウト方式をサポート
- **レスポンシブグリッド**: Element Plusのグリッドシステムに基づくレスポンシブレイアウト
- **ブレークポイント対応**: xs、sm、md、lg、xlの5つのブレークポイントをサポート
- **柔軟な設定**: 各フォーム項目ごとにレイアウトプロパティを個別に設定可能
- **モバイル最適化**: モバイル端末では自動的に単一カラムレイアウトに切り替え

## Flexレイアウト（デフォルト）

Element Plusの`el-row`と`el-col`を利用したグリッドシステム:

### 基本設定
```typescript
const formOptions = {
  layout: 'flex',
  flex: {
    gutter: 20,        // グリッド間隔
    type: 'flex',      // flexモードを有効化
    justify: 'start',  // 水平方向の配置
    align: 'middle'    // 垂直方向の配置
  }
}
```

### グリッド設定
```typescript
const formItem = {
  label: 'タイトル',
  prop: 'title',
  render: 'input',
  cols: {
    span: 12,        // 12列を占有（合計24列）
    offset: 0,       // 左側の間隔列数
    push: 0,         // 右方向への移動列数
    pull: 0,         // 左方向への移動列数
    order: 1,        // ソート優先順位
    
    // レスポンシブ設定
    xs: 24,          // 超小画面：1行を占有
    sm: 12,          // 小画面：半分を占有
    md: 8,           // 中画面：1/3を占有
    lg: 6,           // 大画面：1/4を占有
    xl: 4            // 超大画面：1/6を占有
  }
}
```

## Gridレイアウト

Element Plusの`el-space`を利用したスペーシングレイアウト:

### 基本設定
```typescript
const formOptions = {
  layout: 'grid',
  grid: {
    direction: 'vertical',    // 配置方向
    size: 'large',           // スペースサイズ：small | default | large
    wrap: true,              // 折り返し有無
    fill: true,              // コンテナ幅を埋めるか
    fillRatio: 30,           // 埋め込み比率
    alignment: 'start'       // 配置方法
  }
}
```

### 適用シナリオ
- **垂直フォーム**: 項目数の少ないシンプルなフォーム
- **動的フォーム**: 項目数が不定のフォーム
- **コンパクトレイアウト**: スペースを節約したい場面

## レスポンシブシステム

### ブレークポイント定義

| ブレークポイント | デバイスタイプ | 幅範囲 | 推奨列数 |
|------|---------|----------|----------|
| `xs` | スマホ縦 | < 768px | 1列 |
| `sm` | スマホ横/小型タブレット | ≥ 768px | 1-2列 |
| `md` | タブレット | ≥ 992px | 2-3列 |
| `lg` | 小型デスクトップ | ≥ 1200px | 3-4列 |
| `xl` | 大型デスクトップ | ≥ 1920px | 4+列 |

### レスポンシブ設定例

```typescript
// レスポンシブフォーム項目設定
const responsiveField = {
  label: 'タイトル',
  prop: 'title',
  render: 'input',
  cols: {
    // モバイルファースト
    xs: { span: 24 },                    // スマホ：1行占有
    sm: { span: 12, offset: 0 },         // 小画面：1行2列
    md: { span: 8, offset: 0 },          // 中画面：1行3列  
    lg: { span: 6, offset: 0 },          // 大画面：1行4列
    xl: { span: 4, offset: 2 }           // 超大画面：1行6列、左マージン
  }
}

// グローバルレスポンシブ設定
const formOptions = {
  responsiveConfig: {
    enabled: true,
    mobileSingleColumn: true,      // モバイル端末で強制単一列
    mobileHideLabels: false,      // モバイルでラベルを非表示にするか
    breakpoints: {
      xs: 576,
      sm: 768, 
      md: 992,
      lg: 1200,
      xl: 1920
    }
  }
}
```

## レイアウトベストプラクティス

### 1. 適切なレイアウトシステムの選択

```typescript
// 複雑なフォーム → Flexレイアウトを使用
const complexForm = {
  layout: 'flex',
  flex: { gutter: 16 }
}

// シンプルなフォーム → Gridレイアウトを使用  
const simpleForm = {
  layout: 'grid',
  grid: { direction: 'vertical', size: 'medium' }
}
```

### 2. グリッドの合理的な計画

```typescript
// 標準3列レイアウト
const threeColumnLayout = {
  cols: {
    xs: 24,    // モバイル：1列
    sm: 24,    // 小画面：1列
    md: 8,     // 中画面：3列
    lg: 8,     // 大画面：3列
    xl: 8      // 超大画面：3列
  }
}

// 主従レイアウト
const primarySecondaryLayout = {
  // 主要項目
  cols: { xs: 24, sm: 16, md: 12, lg: 16 },
  
  // 次要項目
  cols: { xs: 24, sm: 8, md: 6, lg: 8 }
}
```

### 3. モバイル最適化

```typescript
const mobileOptimized = {
  mobileBreakpoint: 768,
  responsiveConfig: {
    enabled: true,
    mobileSingleColumn: true,      // モバイルで単一列
    mobileHideLabels: false        // ラベル表示を保持
  }
}
```

## 関連リンク

- [レイアウトシステム詳細](/front/component/ma-form#レイアウトシステム詳細)
- [レスポンシブ設定](/front/component/ma-form#responsiveconfig-レスポンシブ設定)
- [モバイル適応](/front/component/ma-form/examples/mobile-responsive)