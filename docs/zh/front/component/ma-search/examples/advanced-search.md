# 高级搜索

演示复杂搜索场景的实现，包含多种表单组件类型、JSX 自定义渲染、条件显示等高级功能。

## 复杂搜索表单

<DemoPreview dir="demos/ma-search/advanced-search" />

## 高级功能说明

### JSX 自定义渲染
通过函数返回 JSX 元素，实现完全自定义的表单组件：

```typescript
{
  label: '自定义组件',
  prop: 'custom',
  render: () => <CustomSearchComponent />
}
```

### 条件显示
使用 `hide` 函数实现搜索项的动态显示和隐藏：

```typescript
{
  label: '高级选项',
  prop: 'advanced',
  render: 'input',
  hide: () => !showAdvanced.value
}
```

### 多选组件
支持复选框组、级联选择器等多选类型的搜索组件：

```typescript
{
  label: '多选分类',
  prop: 'categories',
  render: 'checkbox-group',
  options: categoryOptions
}
```

## 使用场景

### 1. 企业级数据筛选
适用于复杂的业务数据筛选，支持多维度、多条件的组合查询。

### 2. 报表查询系统  
适用于需要精确条件控制的报表查询，支持时间范围、数值区间等复杂条件。

### 3. 电商高级筛选
适用于电商平台的商品筛选，支持品牌、规格、价格等多种筛选维度。

## 关键特性

- 🎯 支持 JSX/TSX 自定义渲染
- 🔄 动态显示和隐藏搜索项
- 📊 多种数据选择组件支持
- ⚡ 性能优化的渲染机制
- 🛠 灵活的配置和扩展能力

## 技术要点

### 自定义渲染函数
- 支持返回任意 Vue 组件或 JSX 元素
- 自动传递表单数据和更新方法
- 完整的类型推断和智能提示

### 性能优化
- 使用虚拟列表技术处理大量选项
- 防抖处理减少不必要的请求
- 智能缓存提升用户体验

## 相关链接

- [基础用法](./basic-usage) - 了解基础搜索配置
- [自定义操作](./custom-actions) - 了解自定义操作按钮
- [动态管理](./dynamic-items) - 了解动态搜索项管理