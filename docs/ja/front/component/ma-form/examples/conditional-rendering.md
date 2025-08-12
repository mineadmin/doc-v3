# 条件付きレンダリング

フォームデータに基づいてフィールドの表示/非表示を動的に制御する条件付きレンダリング機能を紹介します。連動表示や複雑な条件判断を含みます。

<DemoPreview dir="demos/ma-form/conditional-rendering" />

## 機能特徴

- **動的表示制御**：フォームデータに基づいてフィールドの表示/非表示を制御
- **依存関係管理**：dependenciesでフィールド間の依存関係を宣言
- **複雑条件サポート**：複数条件の組み合わせ判断をサポート
- **パフォーマンス最適化**：依存フィールド変更時のみ条件を再計算
- **show vs hide**：2種類の制御方式を提供

## 条件付きレンダリング方法

### 1. show属性（推奨）
条件を満たさない場合コンポーネントをレンダリングせず、DOMスペースを占有しないためパフォーマンス向上：

```typescript
{
  label: '企業名',
  prop: 'companyName',
  render: 'input',
  show: (model, item) => model.userType === 'company',
  dependencies: ['userType']
}
```

### 2. hide属性
条件を満たさない場合コンポーネントを非表示にするが、DOMスペースは占有：

```typescript
{
  label: '個人情報', 
  prop: 'personalInfo',
  render: 'input',
  hide: (model, item) => model.userType === 'company',
  dependencies: ['userType']
}
```

### 3. when条件関数
より柔軟な条件判断方式：

```typescript
{
  label: '詳細オプション',
  prop: 'advancedOptions',
  render: 'switch',
  when: (model, item) => {
    return model.userLevel === 'advanced' && model.isVip === true
  },
  dependencies: ['userLevel', 'isVip']
}
```

## 一般的な使用シナリオ

### 1. タイプ連動表示

```typescript
const userTypeFields = [
  {
    label: 'ユーザータイプ',
    prop: 'userType',
    render: 'select',
    renderProps: {
      placeholder: 'ユーザータイプを選択'
    },
    renderSlots: {
      default: () => [
        h('el-option', { label: '個人ユーザー', value: 'personal' }),
        h('el-option', { label: '企業ユーザー', value: 'company' })
      ]
    }
  },
  {
    label: '本名',
    prop: 'realName',
    render: 'input',
    show: (model) => model.userType === 'personal',
    dependencies: ['userType']
  },
  {
    label: '企業名',
    prop: 'companyName',
    render: 'input',
    show: (model) => model.userType === 'company',
    dependencies: ['userType']
  },
  {
    label: '統一社会信用コード',
    prop: 'creditCode',
    render: 'input',
    show: (model) => model.userType === 'company',
    dependencies: ['userType']
  }
]
```

### 2. 権限レベル制御

```typescript
const permissionFields = [
  {
    label: 'ユーザー権限',
    prop: 'permission',
    render: 'select',
    renderSlots: {
      default: () => [
        h('el-option', { label: '一般ユーザー', value: 'user' }),
        h('el-option', { label: '管理者', value: 'admin' }),
        h('el-option', { label: 'スーパー管理者', value: 'superAdmin' })
      ]
    }
  },
  {
    label: '管理範囲',
    prop: 'adminScope',
    render: 'checkboxGroup',
    show: (model) => ['admin', 'superAdmin'].includes(model.permission),
    dependencies: ['permission']
  },
  {
    label: 'システム設定権限',
    prop: 'systemConfig',
    render: 'switch',
    show: (model) => model.permission === 'superAdmin',
    dependencies: ['permission']
  }
]
```

### 3. 複雑な複数条件判断

```typescript
const complexConditionField = {
  label: '特殊機能',
  prop: 'specialFeature',
  render: 'input',
  when: (model, item) => {
    // 複数条件判断
    const hasPermission = model.userLevel >= 5
    const isSubscribed = model.subscription === 'premium'
    const isEligible = model.accountAge > 365 // アカウント年齢1年以上
    
    // 組み合わせ条件：権限、購読状態、アカウント年齢すべて満たす必要あり
    return hasPermission && isSubscribed && isEligible
  },
  dependencies: ['userLevel', 'subscription', 'accountAge']
}
```

### 4. ネストした条件レンダリング

```typescript
const nestedConditionFields = [
  {
    label: '詳細機能を有効化',
    prop: 'enableAdvanced',
    render: 'switch'
  },
  {
    label: '詳細設定',
    prop: 'advancedConfig',
    show: (model) => model.enableAdvanced === true,
    dependencies: ['enableAdvanced'],
    children: [
      {
        label: 'キャッシュ戦略',
        prop: 'cacheStrategy',
        render: 'select',
        show: (model) => model.enableAdvanced === true,
        dependencies: ['enableAdvanced']
      },
      {
        label: 'キャッシュ時間（時間）',
        prop: 'cacheTimeout',
        render: 'inputNumber',
        show: (model) => {
          return model.enableAdvanced === true && 
                 model.cacheStrategy === 'custom'
        },
        dependencies: ['enableAdvanced', 'cacheStrategy']
      }
    ]
  }
]
```

## 依存関係最適化

### 1. 依存フィールドの宣言
`dependencies`配列でフィールド依存関係を宣言し、正確な更新を実現：

```typescript
{
  label: '関連フィールド',
  prop: 'relatedField',
  render: 'input',
  show: (model) => model.status === 'active' && model.type === 'premium',
  dependencies: ['status', 'type']  // これらのフィールド変更時のみ再計算
}
```

### 2. 過剰な依存を避ける

```typescript
// ❌ 非推奨：依存フィールドが多すぎる
{
  dependencies: ['field1', 'field2', 'field3', 'field4', 'field5']
}

// ✅ 推奨：正確な依存関係
{
  dependencies: ['userType']  // 表示に実際に影響するフィールドのみ依存
}
```

## パフォーマンス考慮事項

### 1. hideではなくshowを使用

```typescript
// ✅ 推奨：showを使用し、非表示要素をレンダリングしない
{
  show: (model) => model.userType === 'admin'
}

// ❌ 避ける：hideを使用するとレンダリングはされるが非表示
{  
  hide: (model) => model.userType !== 'admin'
}
```

### 2. 条件計算結果をキャッシュ

```typescript
// 複雑な条件計算にはcomputedプロパティでキャッシュ可能
const computedCondition = computed(() => {
  return model.value.userLevel >= 5 && 
         model.value.subscription === 'premium' &&
         model.value.accountAge > 365
})

const field = {
  label: '特殊機能',
  prop: 'specialFeature',
  render: 'input',
  show: () => computedCondition.value,
  dependencies: ['userLevel', 'subscription', 'accountAge']
}
```

## デバッグテクニック

### 1. 条件関数のデバッグ

```typescript
{
  label: 'デバッグフィールド',
  prop: 'debugField',
  render: 'input',
  show: (model, item) => {
    const condition = model.userType === 'admin'
    console.log(`フィールド ${item.prop} 表示条件:`, {
      userType: model.userType,
      condition
    })
    return condition
  },
  dependencies: ['userType']
}
```

### 2. 依存関係の追跡

```typescript
{
  label: '追跡フィールド',
  prop: 'trackField',
  render: 'input',
  show: (model, item) => {
    console.log(`依存フィールド変更:`, {
      dependencies: item.dependencies,
      values: item.dependencies?.map(dep => ({ [dep]: model[dep] }))
    })
    return model.status === 'active'
  },
  dependencies: ['status']
}
```

## 関連リンク

- [MaFormItem 設定詳細](/ja/front/component/ma-form#maformitem-設定詳細)
- [高度な機能 - 条件付きレンダリング](/ja/front/component/ma-form#条件付きレンダリング)
- [ネストしたフォーム構造](/ja/front/component/ma-form/examples/nested-forms)