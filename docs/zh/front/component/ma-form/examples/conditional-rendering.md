# 条件渲染

展示基于表单数据动态控制字段显示隐藏的条件渲染功能，包括联动显示和复杂条件判断。

<DemoPreview dir="demos/ma-form/conditional-rendering" />

## 功能特性

- **动态显示控制**：基于表单数据控制字段显示/隐藏
- **依赖关系管理**：通过 dependencies 声明字段依赖关系
- **复杂条件支持**：支持多条件组合判断
- **性能优化**：只在依赖字段变化时重新计算条件
- **两种渲染方式**：show 和 hide 属性提供不同的显示控制策略

## 条件渲染方式

MaForm 提供了两种条件渲染方式，每种方式都有其特定的使用场景：

### show 属性（推荐）

不满足条件时不渲染 DOM，性能最佳，适用于大部分场景：

```typescript
{
  label: '企业名称',
  prop: 'companyName',
  render: 'input',
  show: (item, model) => model.userType === 'company',
  dependencies: ['userType']
}
```

**特点：**
- ✅ 不渲染 DOM，性能最佳
- ✅ 不占用页面空间
- ✅ 适用于大部分场景
- ⚠️ 初始化时可能有轻微闪烁

### hide 属性

不满足条件时隐藏 DOM 但仍渲染，适用于频繁切换的场景：

```typescript
{
  label: '邮件通知',
  prop: 'emailNotifications', 
  render: 'switch',
  hide: (item, model) => !model.enableNotifications,
  dependencies: ['enableNotifications']
}
```

**特点：**
- ✅ 切换流畅，无闪烁
- ✅ 保持表单结构稳定
- ❌ 仍会渲染 DOM
- ❌ 占用页面空间

## 使用场景对比

### show 属性使用场景

**1. 根据用户类型显示不同字段**

```typescript
const userTypeFields = [
  {
    label: '用户类型',
    prop: 'userType',
    render: 'select',
    options: [
      { label: '个人用户', value: 'personal' },
      { label: '企业用户', value: 'company' }
    ]
  },
  {
    label: '真实姓名', 
    prop: 'realName',
    render: 'input',
    show: (item, model) => model.userType === 'personal',
    dependencies: ['userType']
  },
  {
    label: '企业名称',
    prop: 'companyName', 
    render: 'input',
    show: (item, model) => model.userType === 'company',
    dependencies: ['userType']
  }
]
```

**2. 权限等级控制**

```typescript
const permissionFields = [
  {
    label: '用户权限',
    prop: 'permission',
    render: 'select',
    options: [
      { label: '普通用户', value: 'user' },
      { label: '管理员', value: 'admin' },
      { label: '超级管理员', value: 'superAdmin' }
    ]
  },
  {
    label: '管理范围',
    prop: 'adminScope',
    render: 'checkboxGroup',
    show: (item, model) => ['admin', 'superAdmin'].includes(model.permission),
    dependencies: ['permission']
  },
  {
    label: '系统配置权限',
    prop: 'systemConfig',
    render: 'switch',
    show: (item, model) => model.permission === 'superAdmin',
    dependencies: ['permission']
  }
]
```

### hide 属性使用场景

**1. 频繁切换的功能开关**

```typescript
const notificationFields = [
  {
    label: '启用通知',
    prop: 'enableNotifications',
    render: 'switch'
  },
  {
    label: '邮件通知',
    prop: 'emailNotifications',
    render: 'switch',
    // 使用 hide 保持布局稳定，切换更流畅
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

**2. 表单验证提示**

```typescript
{
  label: '密码强度提示',
  prop: 'passwordStrengthTip',
  render: 'input',
  renderProps: {
    readonly: true,
    placeholder: '密码强度：弱'
  },
  // 使用 hide 避免布局跳动
  hide: (item, model) => !model.password || model.password.length === 0,
  dependencies: ['password']
}
```

## 复杂条件场景

### 1. 多重条件判断

```typescript
{
  label: '特殊功能',
  prop: 'specialFeature',
  render: 'input',
  show: (item, model) => {
    // 多重条件：需要同时满足多个条件
    return model.userLevel >= 5 && 
           model.subscription === 'premium' && 
           model.accountAge > 365
  },
  dependencies: ['userLevel', 'subscription', 'accountAge']
}
```

### 2. 级联条件渲染

```typescript
const cascadeFields = [
  {
    label: '需要地址',
    prop: 'needAddress',
    render: 'switch'
  },
  {
    label: '国家',
    prop: 'country',
    render: 'select',
    show: (item, model) => model.needAddress,
    dependencies: ['needAddress']
  },
  {
    label: '省份',
    prop: 'province',
    render: 'select',
    // 级联条件：需要地址 且 选择了中国
    show: (item, model) => model.needAddress && model.country === 'china',
    dependencies: ['needAddress', 'country']
  },
  {
    label: '城市',
    prop: 'city',
    render: 'select',
    // 更复杂的级联：需要地址、选择了省份
    show: (item, model) => model.needAddress && !!model.province,
    dependencies: ['needAddress', 'province']
  }
]
```

### 3. 动态计算条件

```typescript
// 使用计算属性优化复杂条件
const isAdvancedUser = computed(() => {
  return formData.value.userLevel >= 10 && 
         formData.value.vipStatus === 'active' &&
         formData.value.experience > 1000
})

const advancedField = {
  label: '高级功能',
  prop: 'advancedFeature',
  render: 'input',
  show: (item) => isAdvancedUser.value,
  dependencies: ['userLevel', 'vipStatus', 'experience']
}
```

## 依赖关系优化

### 1. 精确声明依赖

```typescript
// ✅ 推荐：精确依赖
{
  show: (item, model) => model.userType === 'admin',
  dependencies: ['userType']  // 只依赖真正影响显示的字段
}

// ❌ 避免：过度依赖
{
  show: (item, model) => model.userType === 'admin',
  dependencies: ['userType', 'userName', 'email', 'phone']  // 包含不必要的依赖
}
```

### 2. 避免循环依赖

```typescript
// ❌ 错误：可能导致循环依赖
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
  dependencies: ['fieldA']  // 循环依赖
}

// ✅ 正确：使用共同的控制字段
{
  label: '控制开关',
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

## 性能优化建议

### 1. 优先使用 show 属性

```typescript
// ✅ 推荐：使用 show，不渲染隐藏元素
{
  show: (item, model) => model.userType === 'admin'
}

// ⚠️ 谨慎使用：使用 hide，仍会渲染但隐藏
{  
  hide: (item, model) => model.userType !== 'admin'
}
```

### 2. 缓存复杂计算

```typescript
// 复杂条件计算使用计算属性缓存
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

### 3. 减少依赖数量

```typescript
// ✅ 合并相关逻辑，减少依赖
{
  show: (item, model) => {
    // 将相关条件合并到一个函数中
    return model.status === 'active' && model.level > 3
  },
  dependencies: ['status', 'level']
}

// ❌ 避免：分散的条件检查
{
  show: (item, model) => model.status === 'active',
  dependencies: ['status', 'level', 'type', 'category']
}
```

## 调试技巧

### 1. 条件函数调试

```typescript
{
  label: '调试字段',
  prop: 'debugField',
  render: 'input',
  show: (item, model) => {
    const condition = model.userType === 'admin'
    
    // 开发环境下的调试信息
    if (process.env.NODE_ENV === 'development') {
      console.log(`字段 ${item.prop} 显示条件:`, {
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

### 2. 依赖追踪

```typescript
// 创建调试工具函数
const createDebugShow = (conditionFn: Function, debugName: string) => {
  return (item: any, model: any) => {
    const result = conditionFn(item, model)
    
    console.log(`[${debugName}] 条件检查:`, {
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

// 使用调试工具
{
  label: '测试字段',
  prop: 'testField',
  render: 'input',
  show: createDebugShow(
    (item, model) => model.status === 'active',
    'testField'
  ),
  dependencies: ['status']
}
```

## 最佳实践

### 1. 明确使用场景

- **show 属性**：适用于大部分条件渲染场景，性能最佳
- **hide 属性**：适用于频繁切换、需要保持布局稳定的场景

### 2. 合理设计依赖关系

- 只声明真正影响显示的字段作为依赖
- 避免过度依赖和循环依赖
- 使用计算属性缓存复杂条件

### 3. 考虑用户体验

- 对于频繁切换的场景，使用 hide 属性避免布局跳动
- 对于一次性显示的场景，使用 show 属性节省性能
- 提供适当的过渡动画增强体验

## 相关链接

- [MaFormItem 配置详解](/front/component/ma-form#maformitem-配置详解)
- [高级特性 - 条件渲染](/front/component/ma-form#条件渲染)
- [嵌套表单结构](/front/component/ma-form/examples/nested-forms)