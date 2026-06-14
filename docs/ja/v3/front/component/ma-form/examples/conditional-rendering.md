# 条件付きレンダリング

フォームデータに基づいてフィールドの表示/非表示を動的に制御する条件付きレンダリング機能を紹介します。連動表示や複雑な条件判定を含みます。

<DemoPreview dir="demos/ma-form/conditional-rendering" />

## 機能特性

- **動的表示制御**：フォームデータに基づいてフィールドの表示/非表示を制御
- **依存関係管理**：dependencies でフィールドの依存関係を宣言
- **複雑な条件サポート**：複数条件の組み合わせ判定に対応
- **パフォーマンス最適化**：依存フィールドが変更された時のみ条件を再計算
- **2つのレンダリング方式**：show と hide プロパティで異なる表示制御戦略を提供

## 条件付きレンダリングの方法

MaForm は2つの条件付きレンダリング方法を提供しており、それぞれに適した使用シーンがあります。

### show プロパティ（推奨）

条件を満たさない場合に DOM をレンダリングせず、パフォーマンスが最も優れています。ほとんどのシーンに適しています。

```typescript
{
  label: '企業名',
  prop: 'companyName',
  render: 'input',
  show: (item, model) => model.userType === 'company',
  dependencies: ['userType']
}
```

**特徴：**
- ✅ DOM をレンダリングしないため、パフォーマンスが最も優れている
- ✅ ページのスペースを占用しない
- ✅ ほとんどのシーンに適用可能
- ⚠️ 初期化時にわずかなちらつきが発生する可能性がある

### hide プロパティ

条件を満たさない場合に DOM を非表示にするが、レンダリングは行う。頻繁に切り替えるシーンに適しています。

```typescript
{
  label: 'メール通知',
  prop: 'emailNotifications', 
  render: 'switch',
  hide: (item, model) => !model.enableNotifications,
  dependencies: ['enableNotifications']
}
```

**特徴：**
- ✅ 切り替えがスムーズでちらつきがない
- ✅ フォーム構造を安定に保つ
- ❌ DOM はレンダリングされる
- ❌ ページのスペースを占用する

## 使用シーンの比較

### show プロパティの使用シーン

**1. ユーザータイプに応じて異なるフィールドを表示**

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

### hide プロパティの使用シーン

**1. 頻繁に切り替える機能スイッチ**

```typescript
const notificationFields = [
  {
    label: '通知を有効にする',
    prop: 'enableNotifications',
    render: 'switch'
  },
  {
    label: 'メール通知',
    prop: 'emailNotifications',
    render: 'switch',
    // hide を使用してレイアウトを安定に保ち、切り替えをスムーズにする
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

**2. フォームバリデーションのヒント**

```typescript
{
  label: 'パスワード強度ヒント',
  prop: 'passwordStrengthTip',
  render: 'input',
  renderProps: {
    readonly: true,
    placeholder: 'パスワード強度：弱'
  },
  // hide を使用してレイアウトの飛び跳ねを防ぐ
  hide: (item, model) => !model.password || model.password.length === 0,
  dependencies: ['password']
}
```

## 複雑な条件シーン

### 1. 複数条件判定

```typescript
{
  label: '特別機能',
  prop: 'specialFeature',
  render: 'input',
  show: (item, model) => {
    // 複数条件：複数の条件を同時に満たす必要がある
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
    label: '省',
    prop: 'province',
    render: 'select',
    // カスケード条件：住所が必要 かつ 中国を選択
    show: (item, model) => model.needAddress && model.country === 'china',
    dependencies: ['needAddress', 'country']
  },
  {
    label: '都市',
    prop: 'city',
    render: 'select',
    // より複雑なカスケード：住所が必要、省を選択済み
    show: (item, model) => model.needAddress && !!model.province,
    dependencies: ['needAddress', 'province']
  }
]
```

### 3. 動的計算条件

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

## 依存関係の最適化

### 1. 正確な依存関係の宣言

```typescript
// ✅ 推奨：正確な依存関係
{
  show: (item, model) => model.userType === 'admin',
  dependencies: ['userType']  // 実際に表示に影響するフィールドのみに依存
}

// ❌ 避けるべき：過剰な依存
{
  show: (item, model) => model.userType === 'admin',
  dependencies: ['userType', 'userName', 'email', 'phone']  // 不必要な依存を含む
}
```

### 2. 循環依存を避ける

```typescript
// ❌ 誤り：循環依存を引き起こす可能性がある
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

// ✅ 正しい：共通の制御フィールドを使用
{
  label: 'コントロールスイッチ',
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

## パフォーマンス最適化のアドバイス

### 1. 優先的に show プロパティを使用

```typescript
// ✅ 推奨：show を使用し、非表示要素をレンダリングしない
{
  show: (item, model) => model.userType === 'admin'
}

// ⚠️ 慎重に使用：hide を使用するとレンダリングは行うが非表示にする
{  
  hide: (item, model) => model.userType !== 'admin'
}
```

### 2. 複雑な計算をキャッシュする

```typescript
// 複雑な条件計算は計算プロパティでキャッシュ
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

### 3. 依存関係の数を減らす

```typescript
// ✅ 関連ロジックを統合し、依存関係を減らす
{
  show: (item, model) => {
    // 関連する条件を1つの関数に統合
    return model.status === 'active' && model.level > 3
  },
  dependencies: ['status', 'level']
}

// ❌ 避けるべき：分散した条件チェック
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

### 2. 依存関係の追跡

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

### 1. 使用シーンを明確にする

- **show プロパティ**：ほとんどの条件付きレンダリングシーンに適し、パフォーマンスが最も優れている
- **hide プロパティ**：頻繁に切り替えたり、レイアウトを安定に保つ必要があるシーンに適している

### 2. 依存関係を適切に設計する

- 実際に表示に影響するフィールドのみを依存関係として宣言する
- 過剰な依存や循環依存を避ける
- 計算プロパティを使用して複雑な条件をキャッシュする

### 3. ユーザーエクスペリエンスを考慮する

- 頻繁に切り替えるシーンでは、hide プロパティを使用してレイアウトの飛び跳ねを防ぐ
- 一度だけ表示するシーンでは、show プロパティを使用してパフォーマンスを節約する
- 適切なトランジションアニメーションを提供してエクスペリエンスを向上させる

## 関連リンク

- [MaFormItem 設定詳細](/v3/front/component/ma-form#maformitem-設定詳細)
- [高度な機能 - 条件付きレンダリング](/v3/front/component/ma-form#条件付きレンダリング)
- [ネストされたフォーム構造](/v3/front/component/ma-form/examples/nested-forms)