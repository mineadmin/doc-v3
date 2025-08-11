# 條件渲染

展示基於表單資料動態控制欄位顯示隱藏的條件渲染功能，包括聯動顯示和複雜條件判斷。

<DemoPreview dir="demos/ma-form/conditional-rendering" />

## 功能特性

- **動態顯示控制**：基於表單資料控制欄位顯示/隱藏
- **依賴關係管理**：透過 dependencies 宣告欄位依賴關係
- **複雜條件支援**：支援多條件組合判斷
- **效能最佳化**：只在依賴欄位變化時重新計算條件
- **show vs hide**：提供兩種不同的控制方式

## 條件渲染方式

### 1. show 屬性（推薦）
不滿足條件時不渲染元件，不佔用 DOM 空間，效能更佳：

```typescript
{
  label: '企業名稱',
  prop: 'companyName',
  render: 'input',
  show: (model, item) => model.userType === 'company',
  dependencies: ['userType']
}
```

### 2. hide 屬性
不滿足條件時隱藏元件，但仍佔用 DOM 空間：

```typescript
{
  label: '個人資訊',
  prop: 'personalInfo', 
  render: 'input',
  hide: (model, item) => model.userType === 'company',
  dependencies: ['userType']
}
```

### 3. when 條件函式
更靈活的條件判斷方式：

```typescript
{
  label: '高階選項',
  prop: 'advancedOptions',
  render: 'switch',
  when: (model, item) => {
    return model.userLevel === 'advanced' && model.isVip === true
  },
  dependencies: ['userLevel', 'isVip']
}
```

## 常見應用場景

### 1. 型別聯動顯示

```typescript
const userTypeFields = [
  {
    label: '使用者型別',
    prop: 'userType',
    render: 'select',
    renderProps: {
      placeholder: '請選擇使用者型別'
    },
    renderSlots: {
      default: () => [
        h('el-option', { label: '個人使用者', value: 'personal' }),
        h('el-option', { label: '企業使用者', value: 'company' })
      ]
    }
  },
  {
    label: '真實姓名', 
    prop: 'realName',
    render: 'input',
    show: (model) => model.userType === 'personal',
    dependencies: ['userType']
  },
  {
    label: '企業名稱',
    prop: 'companyName', 
    render: 'input',
    show: (model) => model.userType === 'company',
    dependencies: ['userType']
  },
  {
    label: '統一社會信用程式碼',
    prop: 'creditCode',
    render: 'input',
    show: (model) => model.userType === 'company',
    dependencies: ['userType']
  }
]
```

### 2. 許可權等級控制

```typescript
const permissionFields = [
  {
    label: '使用者許可權',
    prop: 'permission',
    render: 'select',
    renderSlots: {
      default: () => [
        h('el-option', { label: '普通使用者', value: 'user' }),
        h('el-option', { label: '管理員', value: 'admin' }),
        h('el-option', { label: '超級管理員', value: 'superAdmin' })
      ]
    }
  },
  {
    label: '管理範圍',
    prop: 'adminScope',
    render: 'checkboxGroup',
    show: (model) => ['admin', 'superAdmin'].includes(model.permission),
    dependencies: ['permission']
  },
  {
    label: '系統配置許可權',
    prop: 'systemConfig',
    render: 'switch',
    show: (model) => model.permission === 'superAdmin',
    dependencies: ['permission']
  }
]
```

### 3. 複雜多條件判斷

```typescript
const complexConditionField = {
  label: '特殊功能',
  prop: 'specialFeature',
  render: 'input',
  when: (model, item) => {
    // 多重條件判斷
    const hasPermission = model.userLevel >= 5
    const isSubscribed = model.subscription === 'premium'
    const isEligible = model.accountAge > 365 // 賬戶年齡大於1年
    
    // 組合條件：需要同時滿足許可權、訂閱狀態和賬戶年齡
    return hasPermission && isSubscribed && isEligible
  },
  dependencies: ['userLevel', 'subscription', 'accountAge']
}
```

### 4. 巢狀條件渲染

```typescript
const nestedConditionFields = [
  {
    label: '啟用高階功能',
    prop: 'enableAdvanced',
    render: 'switch'
  },
  {
    label: '高階配置',
    prop: 'advancedConfig',
    show: (model) => model.enableAdvanced === true,
    dependencies: ['enableAdvanced'],
    children: [
      {
        label: '快取策略',
        prop: 'cacheStrategy',
        render: 'select',
        show: (model) => model.enableAdvanced === true,
        dependencies: ['enableAdvanced']
      },
      {
        label: '快取時間（小時）',
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

## 依賴關係最佳化

### 1. 宣告依賴欄位
透過 `dependencies` 陣列宣告欄位依賴關係，實現精確更新：

```typescript
{
  label: '關聯欄位',
  prop: 'relatedField',
  render: 'input',
  show: (model) => model.status === 'active' && model.type === 'premium',
  dependencies: ['status', 'type']  // 只有這兩個欄位變化時才重新計算
}
```

### 2. 避免過度依賴

```typescript
// ❌ 不推薦：依賴過多欄位
{
  dependencies: ['field1', 'field2', 'field3', 'field4', 'field5']
}

// ✅ 推薦：精確依賴
{
  dependencies: ['userType']  // 只依賴真正影響顯示的欄位
}
```

## 效能考慮

### 1. 使用 show 而不是 hide

```typescript
// ✅ 推薦：使用 show，不渲染隱藏元素
{
  show: (model) => model.userType === 'admin'
}

// ❌ 避免：使用 hide，仍會渲染但隱藏
{  
  hide: (model) => model.userType !== 'admin'
}
```

### 2. 快取條件計算結果

```typescript
// 複雜條件計算可以使用計算屬性快取
const computedCondition = computed(() => {
  return model.value.userLevel >= 5 && 
         model.value.subscription === 'premium' &&
         model.value.accountAge > 365
})

const field = {
  label: '特殊功能',
  prop: 'specialFeature', 
  render: 'input',
  show: () => computedCondition.value,
  dependencies: ['userLevel', 'subscription', 'accountAge']
}
```

## 除錯技巧

### 1. 條件函式除錯

```typescript
{
  label: '除錯欄位',
  prop: 'debugField',
  render: 'input',
  show: (model, item) => {
    const condition = model.userType === 'admin'
    console.log(`欄位 ${item.prop} 顯示條件:`, {
      userType: model.userType,
      condition
    })
    return condition
  },
  dependencies: ['userType']
}
```

### 2. 依賴追蹤

```typescript
{
  label: '追蹤欄位',
  prop: 'trackField',
  render: 'input', 
  show: (model, item) => {
    console.log(`依賴欄位變化:`, {
      dependencies: item.dependencies,
      values: item.dependencies?.map(dep => ({ [dep]: model[dep] }))
    })
    return model.status === 'active'
  },
  dependencies: ['status']
}
```

## 相關連結

- [MaFormItem 配置詳解](/zh-tw/front/component/ma-form#maformitem-配置詳解)
- [高階特性 - 條件渲染](/zh-tw/front/component/ma-form#條件渲染)
- [巢狀表單結構](/zh-tw/front/component/ma-form/examples/nested-forms)