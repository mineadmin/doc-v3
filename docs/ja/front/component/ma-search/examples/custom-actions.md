# カスタムアクションボタン

すべてのスロットの使用方法をデモンストレーションします。アクションボタン領域の完全置換、前へのコンテンツ挿入、後へのコンテンツ追加など、様々なカスタマイズシナリオを網羅しています。

## カスタムアクションデモ

<DemoPreview dir="demos/ma-search/custom-actions" />

## スロット使用説明

### actionsスロット
デフォルトのアクションボタン領域を完全に置換し、最大限のカスタマイズ柔軟性を実現:

```vue
<template #actions="{ searchLoading, resetLoading }">
  <div class="custom-actions">
    <el-button 
      type="primary" 
      :loading="searchLoading"
      @click="handleCustomSearch"
    >
      すぐに検索
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

### beforeActionsスロット
デフォルトのアクションボタンの前にカスタムコンテンツを挿入:

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

### afterActionsスロット
デフォルトのアクションボタンの後にカスタムコンテンツを追加:

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
        <el-dropdown-item command="today">今日のデータ</el-dropdown-item>
        <el-dropdown-item command="week">今週のデータ</el-dropdown-item>
      </el-dropdown-Menu>
    </template>
  </el-dropdown>
</template>
```

## 使用シナリオ

### 1. 検索テンプレート管理
検索条件の保存・読み込み機能を追加し、よく使う検索条件を再利用可能にします。

### 2. データインポート/エクスポート
検索エリアにインポート/エクスポート機能を追加し、バッチ操作とデータ交換をサポートします。

### 3. クイック操作メニュー
今日、今週、今月のデータなど、ドロップダウンメニュー形式のクイックフィルタリングを提供します。

### 4. マルチステップ検索フロー
ウィザード形式の検索フローを実現し、カスタムボタンで検索ステップを制御します。

## スロットパラメータ説明

### actionsスロットパラメータ
- `searchLoading: boolean` - 検索ボタンのローディング状態
- `resetLoading: boolean` - リセットボタンのローディング状態

### beforeActions & afterActionsスロット
- パラメータなし、純粋なコンテンツ挿入

## 主要特性

- 🎨 完全にカスタマイズ可能なアクション領域
- 🔧 柔軟なスロットシステム設計
- 📦 既存機能を維持しながら拡張可能
- 🎯 複雑な業務シナリオのカスタマイズに対応
- ⚡ 高性能なスロットレンダリングメカニズム

## デザインパターン

### 置換モード (actions)
アクション領域を完全に再設計する必要があるシナリオに適しています:

```vue
<!-- 完全カスタムのアクション領域 -->
<template #actions>
  <CustomActionBar />
</template>
```

### 拡張モード (beforeActions/afterActions)
デフォルト機能を維持しながら追加操作を加える場合に適しています:

```vue
<!-- デフォルトボタンをベースに拡張 -->
<template #beforeActions>
  <ExtraActions />
</template>
```

## ベストプラクティス

### 1. 操作の一貫性を維持
カスタムアクションボタンは、システム全体のビジュアルスタイルと一貫性を保つようにします。

### 2. ローディング状態の適切な使用
スロットパラメータの `loading` 状態を活用し、カスタムボタンにローディング効果を追加します。

### 3. レスポンシブデザイン
カスタム操作が様々な画面サイズで正常に表示・操作できることを確認します。

### 4. ユーザーエクスペリエンスの最適化
- 明確な操作フィードバックを提供
- 適切な確認ダイアログを追加
- 操作の取り消し機能を実装

## 関連リンク

- [メソッドデモ](./methods-demo) - 公開されているすべてのメソッドの使用方法を学ぶ
- [動的管理](./dynamic-items) - 動的検索項目管理について学ぶ
- [フォーム検証](./form-validation) - フォーム検証機能について学ぶ