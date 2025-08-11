# 条件渲染

展示基于表单数据动态控制字段显示隐藏的条件渲染功能，包括联动显示和复杂条件判断。

<DemoPreview dir="demos/ma-form/conditional-rendering" />

## 功能特性

- **动态显示控制**：基于表单数据控制字段显示/隐藏
- **依赖关系管理**：通过 dependencies 声明字段依赖关系
- **复杂条件支持**：支持多条件组合判断
- **性能优化**：只在依赖字段变化时重新计算条件
- **show vs hide**：提供两种不同的控制方式

## 条件渲染方式

### 1. show 属性（推荐）
不满足条件时不渲染组件，不占用 DOM 空间，性能更佳：

```typescript
{
  label: '企业名称',
  prop: 'companyName',
  render: 'input',
  show: (model, item) => model.userType === 'company',
  dependencies: ['userType']
}
```

### 2. hide 属性
不满足条件时隐藏组件，但仍占用 DOM 空间：

```typescript
{
  label: '个人信息',
  prop: 'personalInfo', 
  render: 'input',
  hide: (model, item) => model.userType === 'company',
  dependencies: ['userType']
}
```

### 3. when 条件函数
更灵活的条件判断方式：

```typescript
{
  label: '高级选项',
  prop: 'advancedOptions',
  render: 'switch',
  when: (model, item) => {
    return model.userLevel === 'advanced' && model.isVip === true
  },
  dependencies: ['userLevel', 'isVip']
}
```

## 常见应用场景

### 1. 类型联动显示

```typescript
const userTypeFields = [
  {
    label: '用户类型',
    prop: 'userType',
    render: 'select',
    renderProps: {
      placeholder: '请选择用户类型'
    },
    renderSlots: {
      default: () => [
        h('el-option', { label: '个人用户', value: 'personal' }),
        h('el-option', { label: '企业用户', value: 'company' })
      ]
    }
  },
  {
    label: '真实姓名', 
    prop: 'realName',
    render: 'input',
    show: (model) => model.userType === 'personal',
    dependencies: ['userType']
  },
  {
    label: '企业名称',
    prop: 'companyName', 
    render: 'input',
    show: (model) => model.userType === 'company',
    dependencies: ['userType']
  },
  {
    label: '统一社会信用代码',
    prop: 'creditCode',
    render: 'input',
    show: (model) => model.userType === 'company',
    dependencies: ['userType']
  }
]
```

### 2. 权限等级控制

```typescript
const permissionFields = [
  {
    label: '用户权限',
    prop: 'permission',
    render: 'select',
    renderSlots: {
      default: () => [
        h('el-option', { label: '普通用户', value: 'user' }),
        h('el-option', { label: '管理员', value: 'admin' }),
        h('el-option', { label: '超级管理员', value: 'superAdmin' })
      ]
    }
  },
  {
    label: '管理范围',
    prop: 'adminScope',
    render: 'checkboxGroup',
    show: (model) => ['admin', 'superAdmin'].includes(model.permission),
    dependencies: ['permission']
  },
  {
    label: '系统配置权限',
    prop: 'systemConfig',
    render: 'switch',
    show: (model) => model.permission === 'superAdmin',
    dependencies: ['permission']
  }
]
```

### 3. 复杂多条件判断

```typescript
const complexConditionField = {
  label: '特殊功能',
  prop: 'specialFeature',
  render: 'input',
  when: (model, item) => {
    // 多重条件判断
    const hasPermission = model.userLevel >= 5
    const isSubscribed = model.subscription === 'premium'
    const isEligible = model.accountAge > 365 // 账户年龄大于1年
    
    // 组合条件：需要同时满足权限、订阅状态和账户年龄
    return hasPermission && isSubscribed && isEligible
  },
  dependencies: ['userLevel', 'subscription', 'accountAge']
}
```

### 4. 嵌套条件渲染

```typescript
const nestedConditionFields = [
  {
    label: '启用高级功能',
    prop: 'enableAdvanced',
    render: 'switch'
  },
  {
    label: '高级配置',
    prop: 'advancedConfig',
    show: (model) => model.enableAdvanced === true,
    dependencies: ['enableAdvanced'],
    children: [
      {
        label: '缓存策略',
        prop: 'cacheStrategy',
        render: 'select',
        show: (model) => model.enableAdvanced === true,
        dependencies: ['enableAdvanced']
      },
      {
        label: '缓存时间（小时）',
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

## 依赖关系优化

### 1. 声明依赖字段
通过 `dependencies` 数组声明字段依赖关系，实现精确更新：

```typescript
{
  label: '关联字段',
  prop: 'relatedField',
  render: 'input',
  show: (model) => model.status === 'active' && model.type === 'premium',
  dependencies: ['status', 'type']  // 只有这两个字段变化时才重新计算
}
```

### 2. 避免过度依赖

```typescript
// ❌ 不推荐：依赖过多字段
{
  dependencies: ['field1', 'field2', 'field3', 'field4', 'field5']
}

// ✅ 推荐：精确依赖
{
  dependencies: ['userType']  // 只依赖真正影响显示的字段
}
```

## 性能考虑

### 1. 使用 show 而不是 hide

```typescript
// ✅ 推荐：使用 show，不渲染隐藏元素
{
  show: (model) => model.userType === 'admin'
}

// ❌ 避免：使用 hide，仍会渲染但隐藏
{  
  hide: (model) => model.userType !== 'admin'
}
```

### 2. 缓存条件计算结果

```typescript
// 复杂条件计算可以使用计算属性缓存
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

## 调试技巧

### 1. 条件函数调试

```typescript
{
  label: '调试字段',
  prop: 'debugField',
  render: 'input',
  show: (model, item) => {
    const condition = model.userType === 'admin'
    console.log(`字段 ${item.prop} 显示条件:`, {
      userType: model.userType,
      condition
    })
    return condition
  },
  dependencies: ['userType']
}
```

### 2. 依赖追踪

```typescript
{
  label: '追踪字段',
  prop: 'trackField',
  render: 'input', 
  show: (model, item) => {
    console.log(`依赖字段变化:`, {
      dependencies: item.dependencies,
      values: item.dependencies?.map(dep => ({ [dep]: model[dep] }))
    })
    return model.status === 'active'
  },
  dependencies: ['status']
}
```

## 相关链接

- [MaFormItem 配置详解](/zh/front/component/ma-form#maformitem-配置详解)
- [高级特性 - 条件渲染](/zh/front/component/ma-form#条件渲染)
- [嵌套表单结构](/zh/front/component/ma-form/examples/nested-forms)