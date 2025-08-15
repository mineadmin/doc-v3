# 條件渲染

展示基於表單數據動態控制字段顯示隱藏的條件渲染功能，包括聯動顯示和複雜條件判斷。

<DemoPreview dir="demos/ma-form/conditional-rendering" />

## 功能特性

- **動態顯示控制**：基於表單數據控制字段顯示/隱藏
- **依賴關係管理**：通過 dependencies 聲明字段依賴關係
- **複雜條件支持**：支持多條件組合判斷
- **性能優化**：只在依賴字段變化時重新計算條件
- **兩種渲染方式**：show 和 hide 屬性提供不同的顯示控制策略

## 條件渲染方式

MaForm 提供了兩種條件渲染方式，每種方式都有其特定的使用場景：

### show 屬性（推薦）

不滿足條件時不渲染 DOM，性能最佳，適用於大部分場景：

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
- ✅ 不渲染 DOM，性能最佳
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

**1. 根據用户類型顯示不同字段**

```typescript
const userTypeFields = [
  {
    label: '用户類型',
    prop: 'userType',
    render: 'select',
    options: [
      { label: '個人用户', value: 'personal' },
      { label: '企業用户', value: 'company' }
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

**2. 權限等級控制**

```typescript
const permissionFields = [
  {
    label: '用户權限',
    prop: 'permission',
    render: 'select',
    options: [
      { label: '普通用户', value: 'user' },
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
    label: '系統配置權限',
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
    label: '啓用通知',
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
    label: '短信通知',
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
// 使用計算屬性優化複雜條件
const isAdvancedUser = computed(() => {
  return formData.value.userLevel >= 10 && 
         formData.value.vipStatus === 'active' &&
         formData.value.experience > 1000
})

const advancedField = {
  label: '高級功能',
  prop: 'advancedFeature',
  render: 'input',
  show: (item) => isAdvancedUser.value,
  dependencies: ['userLevel', 'vipStatus', 'experience']
}
```

## 依賴關係優化

### 1. 精確聲明依賴

```typescript
// ✅ 推薦：精確依賴
{
  show: (item, model) => model.userType === 'admin',
  dependencies: ['userType']  // 只依賴真正影響顯示的字段
}

// ❌ 避免：過度依賴
{
  show: (item, model) => model.userType === 'admin',
  dependencies: ['userType', 'userName', 'email', 'phone']  // 包含不必要的依賴
}
```

### 2. 避免循環依賴

```typescript
// ❌ 錯誤：可能導致循環依賴
{
  label: '字段A',
  prop: 'fieldA',
  show: (item, model) => model.fieldB === 'show',
  dependencies: ['fieldB']
},
{
  label: '字段B',
  prop: 'fieldB',
  show: (item, model) => model.fieldA === 'active',
  dependencies: ['fieldA']  // 循環依賴
}

// ✅ 正確：使用共同的控制字段
{
  label: '控制開關',
  prop: 'enableFeatures',
  render: 'switch'
},
{
  label: '字段A',
  prop: 'fieldA',
  show: (item, model) => model.enableFeatures,
  dependencies: ['enableFeatures']
},
{
  label: '字段B',
  prop: 'fieldB',
  show: (item, model) => model.enableFeatures,
  dependencies: ['enableFeatures']
}
```

## 性能優化建議

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

### 2. 緩存複雜計算

```typescript
// 複雜條件計算使用計算屬性緩存
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
    // 將相關條件合併到一個函數中
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

## 調試技巧

### 1. 條件函數調試

```typescript
{
  label: '調試字段',
  prop: 'debugField',
  render: 'input',
  show: (item, model) => {
    const condition = model.userType === 'admin'
    
    // 開發環境下的調試信息
    if (process.env.NODE_ENV === 'development') {
      console.log(`字段 ${item.prop} 顯示條件:`, {
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
// 創建調試工具函數
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

// 使用調試工具
{
  label: '測試字段',
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

- **show 屬性**：適用於大部分條件渲染場景，性能最佳
- **hide 屬性**：適用於頻繁切換、需要保持佈局穩定的場景

### 2. 合理設計依賴關係

- 只聲明真正影響顯示的字段作為依賴
- 避免過度依賴和循環依賴
- 使用計算屬性緩存複雜條件

### 3. 考慮用户體驗

- 對於頻繁切換的場景，使用 hide 屬性避免佈局跳動
- 對於一次性顯示的場景，使用 show 屬性節省性能
- 提供適當的過渡動畫增強體驗

## 相關鏈接

- [MaFormItem 配置詳解](/zh-hk/front/component/ma-form#maformitem-配置詳解)
- [高級特性 - 條件渲染](/zh-hk/front/component/ma-form#條件渲染)
- [嵌套表單結構](/zh-hk/front/component/ma-form/examples/nested-forms)