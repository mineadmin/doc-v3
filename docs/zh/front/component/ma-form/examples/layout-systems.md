# 布局系统

展示 MaForm 的两种布局系统：Flex 栅格布局和 Grid 间距布局，以及响应式设计的实现。

<DemoPreview dir="demos/ma-form/layout-systems" />

## 功能特性

- **双布局系统**：支持 Flex 和 Grid 两种布局方式
- **响应式栅格**：基于 Element Plus 栅格系统的响应式布局
- **断点适配**：支持 xs、sm、md、lg、xl 五个断点
- **灵活配置**：可单独为每个表单项配置布局属性
- **移动端优化**：移动端自动切换为单列布局

## Flex 布局（默认）

基于 Element Plus 的 `el-row` 和 `el-col` 实现的栅格系统：

### 基础配置
```typescript
const formOptions = {
  layout: 'flex',
  flex: {
    gutter: 20,        // 栅格间距
    type: 'flex',      // 启用 flex 模式
    justify: 'start',  // 水平对齐
    align: 'middle'    // 垂直对齐
  }
}
```

### 栅格配置
```typescript
const formItem = {
  label: '标题',
  prop: 'title',
  render: 'input',
  cols: {
    span: 12,        // 占据 12 格（总共 24 格）
    offset: 0,       // 左侧间隔格数
    push: 0,         // 向右移动格数
    pull: 0,         // 向左移动格数
    order: 1,        // 排序优先级
    
    // 响应式配置
    xs: 24,          // 超小屏幕：占满一行
    sm: 12,          // 小屏幕：占一半
    md: 8,           // 中等屏幕：占三分之一
    lg: 6,           // 大屏幕：占四分之一
    xl: 4            // 超大屏幕：占六分之一
  }
}
```

## Grid 布局

基于 Element Plus 的 `el-space` 实现的间距布局：

### 基础配置
```typescript
const formOptions = {
  layout: 'grid',
  grid: {
    direction: 'vertical',    // 排列方向
    size: 'large',           // 间距大小：small | default | large
    wrap: true,              // 是否换行
    fill: true,              // 是否填充容器宽度
    fillRatio: 30,           // 填充比例
    alignment: 'start'       // 对齐方式
  }
}
```

### 适用场景
- **垂直表单**：字段较少的简单表单
- **动态表单**：字段数量不确定的表单
- **紧凑布局**：需要节省空间的场景

## 响应式系统

### 断点定义

| 断点 | 设备类型 | 宽度范围 | 推荐列数 |
|------|---------|----------|----------|
| `xs` | 手机竖屏 | < 768px | 1 列 |
| `sm` | 手机横屏/小平板 | ≥ 768px | 1-2 列 |
| `md` | 平板 | ≥ 992px | 2-3 列 |
| `lg` | 小桌面 | ≥ 1200px | 3-4 列 |
| `xl` | 大桌面 | ≥ 1920px | 4+ 列 |

### 响应式配置示例

```typescript
// 响应式表单项配置
const responsiveField = {
  label: '标题',
  prop: 'title',
  render: 'input',
  cols: {
    // 移动端优先
    xs: { span: 24 },                    // 手机：占满整行
    sm: { span: 12, offset: 0 },         // 小屏：一行两列
    md: { span: 8, offset: 0 },          // 中屏：一行三列  
    lg: { span: 6, offset: 0 },          // 大屏：一行四列
    xl: { span: 4, offset: 2 }           // 超大屏：一行六列，左边距
  }
}

// 全局响应式配置
const formOptions = {
  responsiveConfig: {
    enabled: true,
    mobileSingleColumn: true,      // 移动端强制单列
    mobileHideLabels: false,       // 移动端是否隐藏标签
    breakpoints: {
      xs: 576,
      sm: 768, 
      md: 992,
      lg: 1200,
      xl: 1920
    }
  }
}
```

## 布局最佳实践

### 1. 选择合适的布局系统

```typescript
// 复杂表单 → 使用 Flex 布局
const complexForm = {
  layout: 'flex',
  flex: { gutter: 16 }
}

// 简单表单 → 使用 Grid 布局  
const simpleForm = {
  layout: 'grid',
  grid: { direction: 'vertical', size: 'medium' }
}
```

### 2. 合理规划栅格

```typescript
// 标准三列布局
const threeColumnLayout = {
  cols: {
    xs: 24,    // 移动端：单列
    sm: 24,    // 小屏：单列
    md: 8,     // 中屏：三列
    lg: 8,     // 大屏：三列
    xl: 8      // 超大屏：三列
  }
}

// 主次分明布局
const primarySecondaryLayout = {
  // 主要字段
  cols: { xs: 24, sm: 16, md: 12, lg: 16 },
  
  // 次要字段
  cols: { xs: 24, sm: 8, md: 6, lg: 8 }
}
```

### 3. 移动端优化

```typescript
const mobileOptimized = {
  mobileBreakpoint: 768,
  responsiveConfig: {
    enabled: true,
    mobileSingleColumn: true,      // 移动端单列
    mobileHideLabels: false        // 保留标签显示
  }
}
```

## 相关链接

- [布局系统详解](/zh/front/component/ma-form#布局系统详解)
- [响应式配置](/zh/front/component/ma-form#responsiveconfig-响应式配置)
- [移动端适配](/zh/front/component/ma-form/examples/mobile-responsive)