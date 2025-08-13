# 响应式布局

演示不同屏幕尺寸下的响应式效果，包含实时视口信息和动态配置测试，确保搜索组件在各种设备上都有良好的用户体验。

## 响应式布局演示

<DemoPreview dir="demos/ma-search/responsive-layout" />

## 响应式配置说明

### 断点系统
MaSearch 采用基于 CSS Media Queries 的响应式断点系统：

| 断点 | 屏幕尺寸 | 默认列数 | 典型设备 |
|------|----------|----------|----------|
| `xs` | < 768px | 1 | 手机竖屏 |
| `sm` | ≥ 768px | 2 | 手机横屏、小平板 |
| `md` | ≥ 992px | 2 | 平板、小笔记本 |
| `lg` | ≥ 1200px | 3 | 桌面显示器 |
| `xl` | ≥ 1920px | 4 | 大屏显示器 |

### 基础配置
通过 `cols` 参数配置不同断点下的列数：

```typescript
const searchOptions = {
  cols: {
    xs: 1,  // 移动端单列显示
    sm: 2,  // 平板双列显示  
    md: 2,  // 中等屏幕双列显示
    lg: 3,  // 大屏三列显示
    xl: 4   // 超大屏四列显示
  }
}
```

### 自定义断点
根据实际业务需求自定义断点配置：

```typescript
// 紧凑型布局
const compactCols = {
  xs: 1,
  sm: 3,
  md: 4,
  lg: 5,
  xl: 6
}

// 宽松型布局  
const spaciousCols = {
  xs: 1,
  sm: 1,
  md: 2,
  lg: 2,
  xl: 3
}
```

## 使用场景

### 1. 移动端优先设计
专为移动设备优化的搜索界面：

```typescript
// 移动端友好配置
const mobileFirstConfig = {
  cols: { xs: 1, sm: 1, md: 2, lg: 3, xl: 4 },
  fold: true,
  foldRows: 1  // 移动端默认只显示一行
}
```

### 2. 桌面端密集显示
充分利用桌面端的屏幕空间：

```typescript
// 桌面端密集显示
const desktopDenseConfig = {
  cols: { xs: 1, sm: 2, md: 3, lg: 4, xl: 6 }
}
```

### 3. 自适应数据仪表板
根据仪表板布局自动调整搜索区域：

```typescript
// 仪表板自适应配置
const dashboardConfig = {
  cols: { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 },
  fold: true,
  foldRows: 1
}
```

## 响应式特性

### 自动列计算
组件会根据容器宽度和断点配置自动计算每行的列数。

### 平滑过渡
在屏幕尺寸改变时，布局会平滑过渡，避免突兀的跳转。

### 内容溢出处理
当搜索项内容过长时，自动添加省略号或换行处理。

## 关键特性

- 📱 移动端友好的响应式设计
- 🖥 充分利用大屏空间
- 🔄 平滑的布局过渡动画
- 📏 灵活的断点配置系统
- ⚡ 高性能的布局计算

## 高级配置

### 动态响应式
根据容器大小动态调整布局：

```typescript
// 监听容器尺寸变化
const useResponsiveColumns = () => {
  const containerRef = ref<HTMLElement>()
  const cols = ref({ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 })
  
  const updateCols = () => {
    if (!containerRef.value) return
    
    const width = containerRef.value.offsetWidth
    if (width < 600) {
      cols.value = { xs: 1, sm: 1, md: 2, lg: 3, xl: 4 }
    } else if (width > 1400) {
      cols.value = { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }
    }
  }
  
  onMounted(() => {
    window.addEventListener('resize', updateCols)
    updateCols()
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', updateCols)
  })
  
  return { containerRef, cols }
}
```

### 设备类型检测
根据设备类型优化布局：

```typescript
// 检测设备类型
const deviceType = () => {
  const ua = navigator.userAgent
  if (/Mobile|Android|iPhone/i.test(ua)) {
    return 'mobile'
  } else if (/Tablet|iPad/i.test(ua)) {
    return 'tablet' 
  } else {
    return 'desktop'
  }
}

// 根据设备类型配置
const getDeviceConfig = () => {
  const type = deviceType()
  switch (type) {
    case 'mobile':
      return { cols: { xs: 1, sm: 1, md: 1, lg: 2, xl: 2 }, foldRows: 1 }
    case 'tablet':
      return { cols: { xs: 1, sm: 2, md: 2, lg: 3, xl: 3 }, foldRows: 2 }
    case 'desktop':
      return { cols: { xs: 2, sm: 3, md: 4, lg: 4, xl: 5 }, foldRows: 3 }
  }
}
```

## 最佳实践

### 1. 渐进式增强
从移动端开始设计，逐步增强桌面端体验：

```typescript
// 移动端优先的配置策略
const progressiveConfig = {
  // 移动端基础体验
  cols: { xs: 1 },
  fold: true,
  foldRows: 1,
  
  // 平板端增强
  ...window.innerWidth >= 768 && { 
    cols: { xs: 1, sm: 2 },
    foldRows: 2 
  },
  
  // 桌面端完整体验
  ...window.innerWidth >= 1200 && { 
    cols: { xs: 1, sm: 2, md: 3, lg: 4 },
    foldRows: 3 
  }
}
```

### 2. 内容优先级
在不同屏幕下显示不同优先级的搜索项：

```typescript
// 根据屏幕大小显示不同优先级的搜索项
const getItemsByPriority = (screenSize: string) => {
  const allItems = [
    { label: '用户名', prop: 'username', priority: 'high' },
    { label: '状态', prop: 'status', priority: 'high' },
    { label: '注册时间', prop: 'created_at', priority: 'medium' },
    { label: '最后登录', prop: 'last_login', priority: 'low' }
  ]
  
  switch (screenSize) {
    case 'xs':
      return allItems.filter(item => item.priority === 'high')
    case 'sm':
      return allItems.filter(item => ['high', 'medium'].includes(item.priority))
    default:
      return allItems
  }
}
```

### 3. 性能优化
在小屏设备上优化渲染性能：

```typescript
// 小屏设备性能优化
const optimizedConfig = {
  // 移动端减少列数以提升性能
  cols: window.innerWidth < 768 ? { xs: 1 } : { xs: 1, sm: 2, md: 3, lg: 4 },
  
  // 移动端默认折叠以减少初始渲染
  fold: window.innerWidth < 768,
  foldRows: window.innerWidth < 768 ? 1 : 2
}
```

## 相关链接

- [折叠搜索](./collapsible-search) - 了解折叠功能与响应式的结合使用
- [表格集成](./table-integration) - 了解响应式搜索与表格的集成
- [基础用法](./basic-usage) - 了解基础的搜索功能