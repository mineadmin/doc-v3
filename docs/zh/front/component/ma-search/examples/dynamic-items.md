# 动态管理搜索项

展示所有编程式管理方法的使用，包括添加、删除、修改搜索项等操作，适用于需要根据业务逻辑动态调整搜索条件的场景。

## 动态管理演示

<DemoPreview dir="demos/ma-search/dynamic-items" />

## 动态管理方法

### 添加搜索项
使用 `appendItem` 方法动态添加新的搜索项：

```typescript
// 添加单个搜索项
const addSearchItem = () => {
  searchRef.value?.appendItem({
    label: '新字段',
    prop: 'new_field',
    render: 'input',
    props: {
      placeholder: '请输入新字段值'
    }
  })
}
```

### 删除搜索项
使用 `removeItem` 方法移除指定的搜索项：

```typescript
// 删除指定搜索项
const removeSearchItem = (prop: string) => {
  searchRef.value?.removeItem(prop)
}
```

### 批量设置搜索项
使用 `setItems` 方法一次性设置所有搜索项：

```typescript
// 批量更新搜索项
const updateAllItems = () => {
  const newItems = [
    { label: '用户名', prop: 'username', render: 'input' },
    { label: '状态', prop: 'status', render: 'select', options: statusOptions }
  ]
  searchRef.value?.setItems(newItems)
}
```

### 获取搜索项信息
使用各种获取方法查询当前搜索项配置：

```typescript
// 获取所有搜索项
const allItems = searchRef.value?.getItems()

// 获取特定搜索项
const userItem = searchRef.value?.getItemByProp('username')

// 检查搜索项是否存在
const hasUserItem = !!searchRef.value?.getItemByProp('username')
```

## 使用场景

### 1. 权限控制
根据用户权限动态显示不同的搜索条件：

```typescript
// 管理员显示所有搜索项，普通用户显示部分搜索项
if (userRole === 'admin') {
  searchRef.value?.appendItem({
    label: '创建人',
    prop: 'creator',
    render: 'select',
    options: userOptions
  })
}
```

### 2. 业务场景切换
根据业务场景切换不同的搜索条件组合：

```typescript
// 切换业务场景
const switchScenario = (scenario: string) => {
  let items = []
  switch (scenario) {
    case 'order':
      items = orderSearchItems
      break
    case 'user':
      items = userSearchItems
      break
    case 'product':
      items = productSearchItems
      break
  }
  searchRef.value?.setItems(items)
}
```

### 3. 条件依赖关系
实现搜索条件之间的依赖关系：

```typescript
// 当选择某个分类时，动态添加子分类搜索项
const onCategoryChange = (categoryId: string) => {
  if (categoryId) {
    searchRef.value?.appendItem({
      label: '子分类',
      prop: 'subcategory',
      render: 'select',
      options: getSubcategories(categoryId)
    })
  } else {
    searchRef.value?.removeItem('subcategory')
  }
}
```

## 关键特性

- 🔧 完整的 CRUD 操作支持
- 🔄 实时的搜索项管理
- 📊 丰富的查询和检索方法
- 🎯 支持复杂的业务逻辑
- ⚡ 高性能的动态更新机制

## 高级用法

### 搜索项模板系统
创建可重用的搜索项模板：

```typescript
// 定义搜索项模板
const templates = {
  userSearch: [
    { label: '用户名', prop: 'username', render: 'input' },
    { label: '邮箱', prop: 'email', render: 'input' },
    { label: '状态', prop: 'status', render: 'select', options: statusOptions }
  ],
  orderSearch: [
    { label: '订单号', prop: 'order_no', render: 'input' },
    { label: '订单状态', prop: 'order_status', render: 'select', options: orderStatusOptions },
    { label: '下单时间', prop: 'created_at', render: 'date-picker' }
  ]
}

// 应用模板
const applyTemplate = (templateName: string) => {
  const template = templates[templateName]
  if (template) {
    searchRef.value?.setItems([...template])
  }
}
```

### 动态验证规则
根据搜索项动态添加验证规则：

```typescript
const addItemWithValidation = (item: any) => {
  // 为某些字段添加验证规则
  if (item.prop === 'email') {
    item.rules = [
      { required: true, message: '邮箱不能为空', trigger: 'blur' },
      { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
    ]
  }
  
  searchRef.value?.appendItem(item)
}
```

## 最佳实践

### 1. 状态管理
建议使用状态管理库（如 Pinia）来管理复杂的搜索项状态：

```typescript
// 使用 Pinia store 管理搜索项
const useSearchStore = defineStore('search', () => {
  const searchItems = ref([])
  
  const addItem = (item: any) => {
    searchItems.value.push(item)
    searchRef.value?.setItems(searchItems.value)
  }
  
  const removeItem = (prop: string) => {
    searchItems.value = searchItems.value.filter(item => item.prop !== prop)
    searchRef.value?.setItems(searchItems.value)
  }
  
  return { searchItems, addItem, removeItem }
})
```

### 2. 性能优化
在频繁动态更新搜索项时，使用防抖技术优化性能：

```typescript
import { debounce } from 'lodash-es'

// 防抖更新搜索项
const updateItemsDebounced = debounce((items: any[]) => {
  searchRef.value?.setItems(items)
}, 300)
```

### 3. 数据持久化
将动态创建的搜索项配置保存到本地存储：

```typescript
// 保存搜索项配置
const saveSearchConfig = () => {
  const items = searchRef.value?.getItems()
  localStorage.setItem('searchConfig', JSON.stringify(items))
}

// 恢复搜索项配置
const restoreSearchConfig = () => {
  const savedConfig = localStorage.getItem('searchConfig')
  if (savedConfig) {
    const items = JSON.parse(savedConfig)
    searchRef.value?.setItems(items)
  }
}
```

## 相关链接

- [方法演示](./methods-demo) - 了解所有暴露方法的详细使用
- [自定义操作](./custom-actions) - 了解自定义操作按钮
- [高级搜索](./advanced-search) - 了解复杂搜索场景的实现