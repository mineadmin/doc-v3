# カスタムアクションボタン

すべてのスロットの使用方法をデモンストレーションします。アクションボタン領域の完全置換、前挿入コンテンツ、後追コンテンツ追加など、様々なカスタマイズシナリオを網羅しています。

## カスタムアクションデモ

<DemoPreview dir="demos/ma-search/custom-actions" />

## スロット使用説明

### actions スロット
デフォルトのアクションボタン領域を完全に置換し、最大限のカスタマイズ柔軟性を実現:

```vue
<template #actions="{ searchLoading, resetLoading }">
  <div class="custom-actions">
    <el-button 
      type="primary" 
      :loading="searchLoading"
      @click="handleCustomSearch"
    >
      即時検索
    </el-button>
    <el-button @click="handleAdvancedSearch">
      詳細検索
    </el-button>
    <el-button 
      :loading="resetLoading"
      @click="handleCustomReset"
    >
      条件クリア
    </el-button>
  </div>
</template>
```

### beforeActions スロット
デフォルトアクションボタンの前にカスタムコンテンツを挿入:

```vue
<template #beforeActions>
  <el-button type="info" @click="handleImport">
    条件インポート
  </el-button>
  <el-button type="warning" @click="handleExport">
    条件エクスポート
  </el-button>
</template>
```

### afterActions スロット
デフォルトアクションボタンの後にカスタムコンテンツを追加:

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
        <el-dropdown-item command="clear">全クリア</el-dropdown-item>
        <el-dropdown-item command="today">本日データ</el-dropdown-item>
        <el-dropdown-item command="week">今週データ</el-dropdown-item>
      </el-dropdown-Menu>
    </template>
  </el-dropdown>
</template>
```

## 使用シナリオ

### 1. 検索テンプレート管理
検索条件の保存・読み込み機能を追加し、よく使う検索条件の再利用を容易にします。

### 2. データインポート/エクスポート
検索エリアにインポート/エクスポート機能を追加し、バッチ操作とデータ交換をサポート。

### 3. クイック操作メニュー
ドロップダウンメニュー形式で、本日・今週・今月データのクイックフィルタリングを提供。

### 4. マルチステップ検索フロー
ウィザード形式の検索フローを実現し、カスタムボタンで検索ステップを制御。

## スロットパラメータ説明

### actions スロットパラメータ
- `searchLoading: boolean` - 検索ボタンのローディング状態
- `resetLoading: boolean` - リセットボタンのローディング状態

### beforeActions & afterActions スロット
- パラメータなし、純粋なコンテンツ挿入

## 主要特性

- 🎨 完全カスタマイズ可能な操作領域
- 🔧 柔軟なスロットシステム設計
- 📦 既存機能を維持しながら拡張可能
- 🎯 複雑な業務シナリオのカスタマイズ対応
- ⚡ 高性能なスロットレンダリング機構

## デザインパターン

### 置換モード (actions)
操作領域を完全に再設計する必要があるシナリオに適応:

```vue
<!-- 完全カスタムの操作領域 -->
<template #actions>
  <CustomActionBar />
</template>
```

### 拡張モード (beforeActions/afterActions)
デフォルト機能を維持しつつ追加操作を実装する場合:

```vue
<!-- デフォルトボタンに機能拡張 -->
<template #beforeActions>
  <ExtraActions />
</template>
```

## ベストプラクティス

### 1. 操作の一貫性保持
カスタムアクションボタンは、システム全体のビジュアルスタイルと一貫性を保つこと。

### 2. ローディング状態の適切な使用
スロットパラメータの `loading` 状態を活用し、カスタムボタンにローディング効果を追加。

### 3. レスポンシブデザイン
カスタム操作が様々な画面サイズで正しく表示・操作できることを確認。

### 4. ユーザーエクスペリエンス最適化
- 明確な操作フィードバックを提供
- 適切な確認ダイアログを追加
- 操作の取り消し機能を実装

## 関連リンク

- [メソッドデモ](./methods-demo) - 公開メソッドの使用方法を学ぶ
- [動的管理](./dynamic-items) - 動的検索項目管理を理解
- [フォーム検証](./form-validation) - フォーム検証機能を確認