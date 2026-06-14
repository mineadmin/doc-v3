# レイアウトシステム

MaFormの2つのレイアウトシステム（FlexグリッドレイアウトとGrid間隔レイアウト）と、レスポンシブデザインの実装を紹介します。

<DemoPreview dir="demos/ma-form/layout-systems" />

## 機能特性

- **デュアルレイアウトシステム**：FlexとGridの2つのレイアウト方式をサポート
- **レスポンシブグリッド**：Element Plusのグリッドシステムに基づくレスポンシブレイアウト
- **ブレークポイント対応**：xs、sm、md、lg、xlの5つのブレークポイントに対応
- **柔軟な設定**：各フォーム項目ごとにレイアウトプロパティを個別に設定可能
- **モバイル最適化**：モバイル端末では自動的にシングルカラムレイアウトに切り替え

## Flexレイアウト（デフォルト）

Element Plusの `el-row` と `el-col` に基づくグリッドシステム：

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
    span: 12,        // 12グリッドを占有（合計24グリッド）
    offset: 0,       // 左側の間隔グリッド数
    push: 0,         // 右へ移動するグリッド数
    pull: 0,         // 左へ移動するグリッド数
    order: 1,        // ソート優先度
    
    // レスポンシブ設定
    xs: 24,          // 極小画面：1行を占有
    sm: 12,          // 小画面：半分を占有
    md: 8,           // 中画面：3分の1を占有
    lg: 6,           // 大画面：4分の1を占有
    xl: 4            // 超大画面：6分の1を占有
  }
}
```

## Gridレイアウト

Element Plusの `el-space` に基づく間隔レイアウト：

### 基本設定
```typescript
const formOptions = {
  layout: 'grid',
  grid: {
    direction: 'vertical',    // 配置方向
    size: 'large',           // 間隔サイズ：small | default | large
    wrap: true,              // 折り返しの有無
    fill: true,              // コンテナ幅を埋めるかどうか
    fillRatio: 30,           // 埋める割合
    alignment: 'start'       // 配置方法
  }
}
```

### 適用シーン
- **縦型フォーム**：フィールドが少ないシンプルなフォーム
- **動的フォーム**：フィールド数が確定していないフォーム
- **コンパクトレイアウト**：スペースを節約したいシーン

## レスポンシブシステム

### ブレークポイント定義

| ブレークポイント | デバイスタイプ | 幅範囲 | 推奨列数 |
|------|---------|----------|----------|
| `xs` | スマートフォン縦向き | < 768px | 1列 |
| `sm` | スマートフォン横向き/小型タブレット | ≥ 768px | 1-2列 |
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
    // モバイル優先
    xs: { span: 24 },                    // スマホ：1行を占有
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
    mobileSingleColumn: true,      // モバイル端末で強制的にシングルカラム
    mobileHideLabels: false,       // モバイル端末でラベルを非表示にするかどうか
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

## レイアウトのベストプラクティス

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

### 2. グリッドの適切な計画

```typescript
// 標準3列レイアウト
const threeColumnLayout = {
  cols: {
    xs: 24,    // モバイル：シングルカラム
    sm: 24,    // 小画面：シングルカラム
    md: 8,     // 中画面：3列
    lg: 8,     // 大画面：3列
    xl: 8      // 超大画面：3列
  }
}

// 主従が明確なレイアウト
const primarySecondaryLayout = {
  // 主要フィールド
  cols: { xs: 24, sm: 16, md: 12, lg: 16 },
  
  // 従属フィールド
  cols: { xs: 24, sm: 8, md: 6, lg: 8 }
}
```

### 3. モバイル最適化

```typescript
const mobileOptimized = {
  mobileBreakpoint: 768,
  responsiveConfig: {
    enabled: true,
    mobileSingleColumn: true,      // モバイル端末でシングルカラム
    mobileHideLabels: false        // ラベル表示を維持
  }
}
```

## 関連リンク

- [レイアウトシステム詳細](/v3/front/component/ma-form#レイアウトシステム詳細)
- [レスポンシブ設定](/v3/front/component/ma-form#responsiveconfig-レスポンシブ設定)
- [モバイル端末対応](/v3/front/component/ma-form/examples/mobile-responsive)