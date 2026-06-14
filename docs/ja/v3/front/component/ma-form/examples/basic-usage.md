# 基本使い方

MaForm の基本使い方のデモ。一般的なフォームコントロールの設定方法と基本的な機能特性を含みます。

<DemoPreview dir="demos/ma-form/basic-usage" />

## 機能特性

- **多様な入力タイプのサポート**：テキスト入力ボックス、パスワードボックス、数値入力など
- **自動データバインディング**：フォームデータの双方向バインディング、手動処理不要
- **基本的な検証ルール**：必須入力、長さ、形式などの一般的な検証をサポート
- **コンポーネント設定が簡単**：設定方式で素早くフォームを構築
- **ネイティブ互換性**：Element Plus のネイティブプロパティとイベントに完全対応

## コアコンセプト

### 設定による開発
`items` 配列でフォーム項目を設定し、各設定オブジェクトには以下を含む：
- `label`：フォーム項目のラベル
- `prop`：バインドするデータフィールド名
- `render`：レンダリングするコンポーネントタイプ
- `renderProps`：コンポーネントに渡すプロパティ

### データバインディング
`v-model` を使用して双方向データバインディングを実現：
```vue
<ma-form v-model="formData" :items="formItems" />
```

## よく使う設定例

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

- [Props 設定](/v3/front/component/ma-form#props)
- [MaFormItem 設定](/v3/front/component/ma-form#maformitem-設定の詳細)
- [コンポーネントレンダリングシステム](/v3/front/component/ma-form#コンポーネントレンダリングシステム)