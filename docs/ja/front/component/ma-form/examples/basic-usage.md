# 基本使い方

MaFormの基本的な使い方のデモンストレーション。一般的なフォームコントロールの設定方法と基本的な機能特性を含みます。

<DemoPreview dir="demos/ma-form/basic-usage" />

## 機能特性

- **複数の入力タイプ対応**: テキスト入力ボックス、パスワードボックス、数値入力など
- **自動データバインディング**: フォームデータの双方向バインディング、手動処理不要
- **基本バリデーションルール**: 必須入力、長さ、フォーマットなどの一般的なバリデーション対応
- **コンポーネント設定の簡易化**: 設定ベースでフォームを迅速に構築
- **ネイティブ互換性**: Element Plusのネイティブプロパティとイベントに完全対応

## コアコンセプト

### 設定ベース開発
`items`配列でフォーム項目を設定。各設定オブジェクトには以下を含む:
- `label`: フォーム項目ラベル
- `prop`: バインドするデータフィールド名
- `render`: レンダリングするコンポーネントタイプ
- `renderProps`: コンポーネントに渡すプロパティ

### データバインディング
`v-model`を使用して双方向データバインディングを実現:
```vue
<ma-form v-model="formData" :items="formItems" />
```

## よく使われる設定例

### 基本入力ボックス
```typescript
{
  label: 'ユーザー名',
  prop: 'username',
  render: 'input',
  renderProps: {
    placeholder: 'ユーザー名を入力してください',
    clearable: true
  }
}
```

### パスワード入力ボックス
```typescript
{
  label: 'パスワード',
  prop: 'password',
  render: 'input',
  renderProps: {
    type: 'password',
    showPassword: true,
    placeholder: 'パスワードを入力してください'
  }
}
```

### 数値入力ボックス
```typescript
{
  label: '年齢',
  prop: 'age',
  render: 'inputNumber',
  renderProps: {
    min: 0,
    max: 150,
    controlsPosition: 'right'
  }
}
```

## 関連リンク

- [Props 設定](/ja/front/component/ma-form#props)
- [MaFormItem 設定](/ja/front/component/ma-form#maformitem-設定詳細)
- [コンポーネントレンダリングシステム](/ja/front/component/ma-form#コンポーネントレンダリングシステム)