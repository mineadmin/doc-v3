# 条件レンダリング

フォームデータに基づいてフィールドの表示/非表示を動的に制御する条件レンダリング機能を紹介します。連動表示や複雑な条件判定も含みます。

<DemoPreview dir="demos/ma-form/conditional-rendering" />

## 機能特徴

- **動的表示制御**: フォームデータに基づいてフィールドの表示/非表示を制御
- **依存関係管理**: dependenciesでフィールド間の依存関係を宣言
- **複雑条件サポート**: 複数条件の組み合わせ判定に対応
- **パフォーマンス最適化**: 依存フィールド変更時のみ条件を再計算
- **2つのレンダリング方式**: showとhide属性で異なる表示制御戦略を提供

## 条件レンダリング方法

MaFormでは2種類の条件レンダリング方法を提供しています:

### show属性（推奨）

条件を満たさない場合DOMをレンダリングしないため、最高のパフォーマンスを発揮します:

```typescript
{
  label: '企業名',
  prop: 'companyName',
  render: 'input',
  show: (item, model) => model.userType === 'company',
  dependencies: ['userType']
}
```

**特徴:**
- ✅ DOMをレンダリングしないため最高のパフォーマンス
- ✅ ページスペースを占有しない
- ✅ ほとんどのシナリオに適している
- ⚠️ 初期化時にわずかなちらつきが発生する可能性あり

### hide属性

条件を満たさない場合DOMを非表示にするがレンダリングは行います。頻繁に切り替わるシナリオに適しています:

```typescript
{
  label: 'メール通知',
  prop: 'emailNotifications', 
  render: 'switch',
  hide: (item, model) => !model.enableNotifications,
  dependencies: ['enableNotifications']
}
```

**特徴:**
- ✅ スムーズな切り替え、ちらつきなし
- ✅ フォーム構造を安定させる
- ❌ DOMはレンダリングされる
- ❌ ページスペースを占有する

## 使用シナリオ比較

### show属性の使用例

**1. ユーザータイプに応じたフィールド表示**

```typescript
const userTypeFields = [
  {
    label: 'ユーザータイプ',
    prop: 'userType',
    render: 'select',
    options: [
      { label: '個人ユーザー', value: 'personal' },
      { label: '企業ユーザー', value: 'company' }
    ]
  },
  {
    label: '本名', 
    prop: 'realName',
    render: 'input',
    show: (item, model) => model.userType === 'personal',
    dependencies: ['userType']
  },
  {
    label: '企業名',
    prop: 'companyName', 
    render: 'input',
    show: (item, model) => model.userType === 'company',
    dependencies: ['userType']
  }
]
```

**2. 権限レベル制御**

```typescript
const permissionFields = [
  {
    label: 'ユーザー権限',
    prop: 'permission',
    render: 'select',
    options: [
      { label: '一般ユーザー', value: 'user' },
      { label: '管理者', value: 'admin' },
      { label: 'スーパー管理者', value: 'superAdmin' }
    ]
  },
  {
    label: '管理範囲',
    prop: 'adminScope',
    render: 'checkboxGroup',
    show: (item, model) => ['admin', 'superAdmin'].includes(model.permission),
    dependencies: ['permission']
  },
  {
    label: 'システム設定権限',
    prop: 'systemConfig',
    render: 'switch',
    show: (item, model) => model.permission === 'superAdmin',
    dependencies: ['permission']
  }
]
```

### hide属性の使用例

**1. 頻繁に切り替わる機能スイッチ**

```typescript
const notificationFields = [
  {
    label: '通知を有効化',
    prop: 'enableNotifications',
    render: 'switch'
  },
  {
    label: 'メール通知',
    prop: 'emailNotifications',
    render: 'switch',
    // hideを使用してレイアウト安定性を保持
    hide: (item, model) => !model.enableNotifications,
    dependencies: ['enableNotifications']
  },
  {
    label: 'SMS通知',
    prop: 'smsNotifications',
    render: 'switch',
    hide: (item, model) => !model.enableNotifications,
    dependencies: ['enableNotifications']
  }
]
```

**2. フォームバリデーションヒント**

```typescript
{
  label: 'パスワード強度ヒント',
  prop: 'passwordStrengthTip',
  render: 'input',
  renderProps: {
    readonly: true,
    placeholder: 'パスワード強度: 弱'
  },
  // レイアウトジャンプを防ぐためhideを使用
  hide: (item, model) => !model.password || model.password.length === 0,
  dependencies: ['password']
}
```

## 複雑条件シナリオ

### 1. 複数条件判定

```typescript
{
  label: '特別機能',
  prop: 'specialFeature',
  render: 'input',
  show: (item, model) => {
    // 複数条件: すべての条件を満たす必要あり
    return model.userLevel >= 5 && 
           model.subscription === 'premium' && 
           model.accountAge > 365
  },
  dependencies: ['userLevel', 'subscription', 'accountAge']
}
```

### 2. カスケード条件レンダリング

```typescript
const cascadeFields = [
  {
    label: '住所が必要',
    prop: 'needAddress',
    render: 'switch'
  },
  {
    label: '国',
    prop: 'country',
    render: 'select',
    show: (item, model) => model.needAddress,
    dependencies: ['needAddress']
  },
  {
    label: '都道府県',
    prop: 'province',
    render: 'select',
    // カスケード条件: 住所が必要かつ中国を選択
    show: (item, model) => model.needAddress && model.country === 'china',
    dependencies: ['needAddress', 'country']
  },
  {
    label: '市区町村',
    prop: 'city',
    render: 'select',
    // より複雑なカスケード: 住所が必要かつ都道府県を選択
    show: (item, model) => model.needAddress && !!model.province,
    dependencies: ['needAddress', 'province']
  }
]
```

### 3. 動的条件計算

```typescript
// 計算プロパティを使用して複雑な条件を最適化
const isAdvancedUser = computed(() => {
  return formData.value.userLevel >= 10 && 
         formData.value.vipStatus === 'active' &&
         formData.value.experience > 1000
})

const advancedField = {
  label: '高度な機能',
  prop: 'advancedFeature',
  render: 'input',
  show: (item) => isAdvancedUser.value,
  dependencies: ['userLevel', 'vipStatus', 'experience']
}
```

## 依存関係最適化

### 1. 正確な依存宣言

```typescript
// ✅ 推奨: 正確な依存関係
{
  show: (item, model) => model.userType === 'admin',
  dependencies: ['userType']  // 表示に影響するフィールドのみ依存
}

// ❌ 避ける: 過剰な依存関係
{
  show: (item, model) => model.userType === 'admin',
  dependencies: ['userType', 'userName', 'email', 'phone']  // 不要な依存関係を含む
}
```

### 2. 循環依存を避ける

```typescript
// ❌ 誤り: 循環依存の可能性あり
{
  label: 'フィールドA',
  prop: 'fieldA',
  show: (item, model) => model.fieldB === 'show',
  dependencies: ['fieldB']
},
{
  label: 'フィールドB',
  prop: 'fieldB',
  show: (item, model) => model.fieldA === 'active',
  dependencies: ['fieldA']  // 循環依存
}

// ✅ 正解: 共通の制御フィールドを使用
{
  label: '制御スイッチ',
  prop: 'enableFeatures',
  render: 'switch'
},
{
  label: 'フィールドA',
  prop: 'fieldA',
  show: (item, model) => model.enableFeatures,
  dependencies: ['enableFeatures']
},
{
  label: 'フィールドB',
  prop: 'fieldB',
  show: (item, model) => model.enableFeatures,
  dependencies: ['enableFeatures']
}
```

## パフォーマンス最適化の推奨事項

### 1. show属性を優先使用

```typescript
// ✅ 推奨: showを使用、非表示要素はレンダリングしない
{
  show: (item, model) => model.userType === 'admin'
}

// ⚠️ 注意: hideを使用、非表示でもレンダリングされる
{  
  hide: (item, model) => model.userType !== 'admin'
}
```

### 2. 複雑な計算をキャッシュ

```typescript
// 複雑な条件計算には計算プロパティを使用
const complexCondition = computed(() => {
  const { userLevel, subscription, accountAge } = formData.value
  return userLevel >= 5 && 
         subscription === 'premium' &&
         accountAge > 365
})

const field = {
  label: '特別機能',
  prop: 'specialFeature', 
  render: 'input',
  show: () => complexCondition.value,
  dependencies: ['userLevel', 'subscription', 'accountAge']
}
```

### 3. 依存関係数を削減

```typescript
// ✅ 関連ロジックを統合、依存関係を削減
{
  show: (item, model) => {
    // 関連条件を1つの関数に統合
    return model.status === 'active' && model.level > 3
  },
  dependencies: ['status', 'level']
}

// ❌ 避ける: 分散した条件チェック
{
  show: (item, model) => model.status === 'active',
  dependencies: ['status', 'level', 'type', 'category']
}
```

## デバッグテクニック

### 1. 条件関数のデバッグ

```typescript
{
  label: 'デバッグフィールド',
  prop: 'debugField',
  render: 'input',
  show: (item, model) => {
    const condition = model.userType === 'admin'
    
    // 開発環境でのデバッグ情報
    if (process.env.NODE_ENV === 'development') {
      console.log(`フィールド ${item.prop} 表示条件:`, {
        userType: model.userType,
        condition,
        dependencies: item.dependencies
      })
    }
    
    return condition
  },
  dependencies: ['userType']
}
```

### 2. 依存関係追跡

```typescript
// デバッグ用ユーティリティ関数を作成
const createDebugShow = (conditionFn: Function, debugName: string) => {
  return (item: any, model: any) => {
    const result = conditionFn(item, model)
    
    console.log(`[${debugName}] 条件チェック:`, {
      result,
      dependencies: item.dependencies,
      dependencyValues: item.dependencies?.reduce((acc: any, dep: string) => {
        acc[dep] = model[dep]
        return acc
      }, {})
    })
    
    return result
  }
}

// デバッグツールを使用
{
  label: 'テストフィールド',
  prop: 'testField',
  render: 'input',
  show: createDebugShow(
    (item, model) => model.status === 'active',
    'testField'
  ),
  dependencies: ['status']
}
```

## ベストプラクティス

### 1. 明確な使用シナリオ

- **show属性**: ほとんどの条件レンダリングシナリオに適し、最高のパフォーマンス
- **hide属性**: 頻繁な切り替えやレイアウト安定性が必要なシナリオに適している

### 2. 適切な依存関係設計

- 表示に実際に影響するフィールドのみを依存関係として宣言
- 過剰な依存関係や循環依存を避ける
- 複雑な条件には計算プロパティを使用してキャッシュ

### 3. ユーザーエクスペリエンスを考慮

- 頻繁に切り替わるシナリオではhide属性を使用してレイアウトジャンプを防止
- 一度きりの表示シナリオではshow属性を使用してパフォーマンスを最適化
- 適切なトランジションアニメーションでUXを向上

## 関連リンク

- [MaFormItem 設定詳細](/ja/front/component/ma-form#maformitem-設定詳細)
- [高度な機能 - 条件レンダリング](/ja/front/component/ma-form#条件レンダリング)
- [ネストされたフォーム構造](/ja/front/component/ma-form/examples/nested-forms)