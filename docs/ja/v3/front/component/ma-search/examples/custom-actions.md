# カスタム操作ボタン

すべてのスロットの使用方法をデモンストレーションします。操作ボタン領域の完全置き換え、前置き挿入、後置き追加など、さまざまなカスタマイズシナリオに対応しています。

## カスタム操作デモ

<DemoPreview dir="demos/ma-search/custom-actions" />

## スロット使用説明

### actions スロット
デフォルトの操作ボタン領域を完全に置き換え、最大限のカスタマイズ性を実現します：

```vue
<template #actions="{ searchLoading, resetLoading }">
  <div class="custom-actions">
    <el-button 
      type="primary" 
      :loading="searchLoading"
      @click="handleCustomSearch"
    >
      今すぐ検索
    </el-button>
    <el-button @click="handleAdvancedSearch">
      高度な検索
    </el-button>
    <el-button 
      :loading="resetLoading"
      @click="handleCustomReset"
    >
      条件をクリア
    </el-button>
  </div>
</template>
```

### beforeActions スロット
デフォルトの操作ボタンの前にカスタムコンテンツを挿入します：

```vue
<template #beforeActions>
  <el-button type="info" @click="handleImport">
    条件をインポート
  </el-button>
  <el-button type="warning" @click="handleExport">
    条件をエクスポート
  </el-button>
</template>
```

### afterActions スロット
デフォルトの操作ボタンの後にカスタムコンテンツを追加します：

```vue
<template #afterActions>
  <el-button type="success" @click="handleSaveTemplate">
    テンプレート保存
  </el-button>
  <el-dropdown @command="handleQuickAction">
    <el-button>
      クイック操作 <el-icon><arrow-down /></el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="clear">すべてクリア</el-dropdown-item>
        <el-dropdown-item command="today">本日のデータ</el-dropdown-item>
        <el-dropdown-item command="week">今週のデータ</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
```

## 使用シナリオ

### 1. 検索テンプレート管理
検索テンプレートの保存・読み込み機能を追加し、よく使う検索条件を簡単に再利用できるようにします。

### 2. データのインポート/エクスポート
検索領域にインポート/エクスポート機能を追加し、バッチ操作やデータ交換をサポートします。

### 3. クイック操作メニュー
ドロップダウンメニュー形式のクイック操作を提供します（例：本日、今週、今月のデータを素早くフィルタリング）。

### 4. マルチステップ検索フロー
ウィザード形式の検索フローを実装し、カスタムボタンで検索ステップを制御します。

## スロットパラメータ説明

### actions スロットパラメータ
- `searchLoading: boolean` - 検索ボタンのローディング状態
- `resetLoading: boolean` - リセットボタンのローディング状態

### beforeActions & afterActions スロット
- パラメータなし、純粋なコンテンツ挿入

## 主要機能

- 🎨 完全にカスタマイズ可能な操作領域
- 🔧 柔軟なスロットシステム設計
- 📦 既存機能を維持しつつ拡張可能
- 🎯 複雑なビジネスシナリオのカスタマイズに対応
- ⚡ 高性能なスロットレンダリング機構

## デザインパターン

### 置き換えモード (actions)
操作領域を完全に再設計する必要がある場合に適しています：

```vue
<!-- 完全にカスタマイズされた操作領域 -->
<template #actions>
  <CustomActionBar />
</template>
```

### 拡張モード (beforeActions/afterActions)
デフォルト機能を維持しつつ、追加操作を加える場合に適しています：

```vue
<!-- デフォルトボタンに拡張を追加 -->
<template #beforeActions>
  <ExtraActions />
</template>
```

## ベストプラクティス

### 1. 操作の一貫性を維持
カスタム操作ボタンは、システム全体のビジュアルスタイルと一貫性を保つようにします。

### 2. ローディング状態の適切な使用
スロットパラメータの `loading` 状態を活用し、カスタムボタンにローディング効果を追加します。

### 3. レスポンシブデザイン
カスタム操作が異なる画面サイズでも正常に表示・操作できるようにします。

### 4. ユーザー体験の最適化
- 明確な操作フィードバックを提供
- 適切な確認ダイアログを追加
- 操作の取り消し機能を実装

## 関連リンク

- [メソッドデモ](./methods-demo) - 公開メソッドの使用方法を確認
- [動的管理](./dynamic-items) - 動的検索項目の管理を確認
- [フォーム検証](./form-validation) - フォーム検証機能を確認