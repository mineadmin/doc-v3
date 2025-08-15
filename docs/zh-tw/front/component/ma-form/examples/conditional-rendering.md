# 條件渲染

展示基於表單資料動態控制欄位顯示隱藏的條件渲染功能，包括聯動顯示和複雜條件判斷。

<DemoPreview dir="demos/ma-form/conditional-rendering" />

## 功能特性

- **動態顯示控制**：基於表單資料控制欄位顯示/隱藏
- **依賴關係管理**：透過 dependencies 宣告欄位依賴關係
- **複雜條件支援**：支援多條件組合判斷
- **效能最佳化**：只在依賴欄位變化時重新計算條件
- **兩種渲染方式**：show 和 hide 屬性提供不同的顯示控制策略

## 條件渲染方式

MaForm 提供了兩種條件渲染方式，每種方式都有其特定的使用場景：

### show 屬性（推薦）

不滿足條件時不渲染 DOM，效能最佳，適用於大部分場景：

```typescript
{
  label: '企業名稱',
  prop: 'companyName',
  render: 'input',
  show: (item, model) => model.userType === 'company',
  dependencies: ['userType']
}
```

**特點：**
- ✅ 不渲染 DOM，效能最佳
- ✅ 不佔用頁面空間
- ✅ 適用於大部分場景
- ⚠️ 初始化時可能有輕微閃爍

### hide 屬性

不滿足條件時隱藏 DOM 但仍渲染，適用於頻繁切換的場景：

```typescript
{
  label: '郵件通知',
  prop: 'emailNotifications', 
  render: 'switch',
  hide: (item, model) => !model.enableNotifications,
  dependencies: ['enableNotifications']
}
```

**特點：**
- ✅ 切換流暢，無閃爍
- ✅ 保持表單結構穩定
- ❌ 仍會渲染 DOM
- ❌ 佔用頁面空間

## 使用場景對比

### show 屬性使用場景

**1. 根據使用者型別顯示不同欄位**

```typescript
const userTypeFields = [
  {
    label: '使用者型別',
    prop: 'userType',
    render: 'select',
    options: [
      { label: '個人使用者', value: 'personal' },
      { label: '企業使用者', value: 'company' }
    ]
  },
  {
    label: '真實姓名', 
    prop: 'realName',
    render: 'input',
    show: (item, model) => model.userType === 'personal',
    dependencies: ['userType']
  },
  {
    label: '企業名稱',
    prop: 'companyName', 
    render: 'input',
    show: (item, model) => model.userType === 'company',
    dependencies: ['userType']
  }
]
```

**2. 許可權等級控制**

```typescript
const permissionFields = [
  {
    label: '使用者許可權',
    prop: 'permission',
    render: 'select',
    options: [
      { label: '普通使用者', value: 'user' },
      { label: '管理員', value: 'admin' },
      { label: '超級管理員', value: 'superAdmin' }
    ]
  },
  {
    label: '管理範圍',
    prop: 'adminScope',
    render: 'checkboxGroup',
    show: (item, model) => ['admin', 'superAdmin'].includes(model.permission),
    dependencies: ['permission']
  },
  {
    label: '系統配置許可權',
    prop: 'systemConfig',
    render: 'switch',
    show: (item, model) => model.permission === 'superAdmin',
    dependencies: ['permission']
  }
]
```

### hide 屬性使用場景

**1. 頻繁切換的功能開關**

```typescript
const notificationFields = [
  {
    label: '啟用通知',
    prop: 'enableNotifications',
    render: 'switch'
  },
  {
    label: '郵件通知',
    prop: 'emailNotifications',
    render: 'switch',
    // 使用 hide 保持佈局穩定，切換更流暢
    hide: (item, model) => !model.enableNotifications,
    dependencies: ['enableNotifications']
  },
  {
    label: '簡訊通知',
    prop: 'smsNotifications',
    render: 'switch',
    hide: (item, model) => !model.enableNotifications,
    dependencies: ['enableNotifications']
  }
]
```

**2. 表單驗證提示**

```typescript
{
  label: '密碼強度提示',
  prop: 'passwordStrengthTip',
  render: 'input',
  renderProps: {
    readonly: true,
    placeholder: '密碼強度：弱'
  },
  // 使用 hide 避免佈局跳動
  hide: (item, model) => !model.password || model.password.length === 0,
  dependencies: ['password']
}
```

## 複雜條件場景

### 1. 多重條件判斷

```typescript
{
  label: '特殊功能',
  prop: 'specialFeature',
  render: 'input',
  show: (item, model) => {
    // 多重條件：需要同時滿足多個條件
    return model.userLevel >= 5 && 
           model.subscription === 'premium' && 
           model.accountAge > 365
  },
  dependencies: ['userLevel', 'subscription', 'accountAge']
}
```

### 2. 級聯條件渲染

```typescript
const cascadeFields = [
  {
    label: '需要地址',
    prop: 'needAddress',
    render: 'switch'
  },
  {
    label: '國家',
    prop: 'country',
    render: 'select',
    show: (item, model) => model.needAddress,
    dependencies: ['needAddress']
  },
  {
    label: '省份',
    prop: 'province',
    render: 'select',
    // 級聯條件：需要地址 且 選擇了中國
    show: (item, model) => model.needAddress && model.country === 'china',
    dependencies: ['needAddress', 'country']
  },
  {
    label: '城市',
    prop: 'city',
    render: 'select',
    // 更復雜的級聯：需要地址、選擇了省份
    show: (item, model) => model.needAddress && !!model.province,
    dependencies: ['needAddress', 'province']
  }
]
```

### 3. 動態計算條件

```typescript
// 使用計算屬性最佳化複雜條件
const isAdvancedUser = computed(() => {
  return formData.value.userLevel >= 10 && 
         formData.value.vipStatus === 'active' &&
         formData.value.experience > 1000
})

const advancedField = {
  label: '高階功能',
  prop: 'advancedFeature',
  render: 'input',
  show: (item) => isAdvancedUser.value,
  dependencies: ['userLevel', 'vipStatus', 'experience']
}
```

## 依賴關係最佳化

### 1. 精確宣告依賴

```typescript
// ✅ 推薦：精確依賴
{
  show: (item, model) => model.userType === 'admin',
  dependencies: ['userType']  // 只依賴真正影響顯示的欄位
}

// ❌ 避免：過度依賴
{
  show: (item, model) => model.userType === 'admin',
  dependencies: ['userType', 'userName', 'email', 'phone']  // 包含不必要的依賴
}
```

### 2. 避免迴圈依賴

```typescript
// ❌ 錯誤：可能導致迴圈依賴
{
  label: '欄位A',
  prop: 'fieldA',
  show: (item, model) => model.fieldB === 'show',
  dependencies: ['fieldB']
},
{
  label: '欄位B',
  prop: 'fieldB',
  show: (item, model) => model.fieldA === 'active',
  dependencies: ['fieldA']  // 迴圈依賴
}

// ✅ 正確：使用共同的控制欄位
{
  label: '控制開關',
  prop: 'enableFeatures',
  render: 'switch'
},
{
  label: '欄位A',
  prop: 'fieldA',
  show: (item, model) => model.enableFeatures,
  dependencies: ['enableFeatures']
},
{
  label: '欄位B',
  prop: 'fieldB',
  show: (item, model) => model.enableFeatures,
  dependencies: ['enableFeatures']
}
```

## 效能最佳化建議

### 1. 優先使用 show 屬性

```typescript
// ✅ 推薦：使用 show，不渲染隱藏元素
{
  show: (item, model) => model.userType === 'admin'
}

// ⚠️ 謹慎使用：使用 hide，仍會渲染但隱藏
{  
  hide: (item, model) => model.userType !== 'admin'
}
```

### 2. 快取複雜計算

```typescript
// 複雜條件計算使用計算屬性快取
const complexCondition = computed(() => {
  const { userLevel, subscription, accountAge } = formData.value
  return userLevel >= 5 && 
         subscription === 'premium' &&
         accountAge > 365
})

const field = {
  label: '特殊功能',
  prop: 'specialFeature', 
  render: 'input',
  show: () => complexCondition.value,
  dependencies: ['userLevel', 'subscription', 'accountAge']
}
```

### 3. 減少依賴數量

```typescript
// ✅ 合併相關邏輯，減少依賴
{
  show: (item, model) => {
    // 將相關條件合併到一個函式中
    return model.status === 'active' && model.level > 3
  },
  dependencies: ['status', 'level']
}

// ❌ 避免：分散的條件檢查
{
  show: (item, model) => model.status === 'active',
  dependencies: ['status', 'level', 'type', 'category']
}
```

## 除錯技巧

### 1. 條件函式除錯

```typescript
{
  label: '除錯欄位',
  prop: 'debugField',
  render: 'input',
  show: (item, model) => {
    const condition = model.userType === 'admin'
    
    // 開發環境下的除錯資訊
    if (process.env.NODE_ENV === 'development') {
      console.log(`欄位 ${item.prop} 顯示條件:`, {
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

### 2. 依賴追蹤

```typescript
// 建立除錯工具函式
const createDebugShow = (conditionFn: Function, debugName: string) => {
  return (item: any, model: any) => {
    const result = conditionFn(item, model)
    
    console.log(`[${debugName}] 條件檢查:`, {
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

// 使用除錯工具
{
  label: '測試欄位',
  prop: 'testField',
  render: 'input',
  show: createDebugShow(
    (item, model) => model.status === 'active',
    'testField'
  ),
  dependencies: ['status']
}
```

## 最佳實踐

### 1. 明確使用場景

- **show 屬性**：適用於大部分條件渲染場景，效能最佳
- **hide 屬性**：適用於頻繁切換、需要保持佈局穩定的場景

### 2. 合理設計依賴關係

- 只宣告真正影響顯示的欄位作為依賴
- 避免過度依賴和迴圈依賴
- 使用計算屬性快取複雜條件

### 3. 考慮使用者體驗

- 對於頻繁切換的場景，使用 hide 屬性避免佈局跳動
- 對於一次性顯示的場景，使用 show 屬性節省效能
- 提供適當的過渡動畫增強體驗

## 相關連結

- [MaFormItem 配置詳解](/front/component/ma-form#maformitem-配置詳解)
- [高階特性 - 條件渲染](/front/component/ma-form#條件渲染)
- [巢狀表單結構](/front/component/ma-form/examples/nested-forms)