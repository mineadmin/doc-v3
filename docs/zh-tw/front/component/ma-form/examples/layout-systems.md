# 佈局系統

展示 MaForm 的兩種佈局系統：Flex 柵格佈局和 Grid 間距佈局，以及響應式設計的實現。

<DemoPreview dir="demos/ma-form/layout-systems" />

## 功能特性

- **雙佈局系統**：支援 Flex 和 Grid 兩種佈局方式
- **響應式柵格**：基於 Element Plus 柵格系統的響應式佈局
- **斷點適配**：支援 xs、sm、md、lg、xl 五個斷點
- **靈活配置**：可單獨為每個表單項配置佈局屬性
- **移動端最佳化**：移動端自動切換為單列布局

## Flex 佈局（預設）

基於 Element Plus 的 `el-row` 和 `el-col` 實現的柵格系統：

### 基礎配置
```typescript
const formOptions = {
  layout: 'flex',
  flex: {
    gutter: 20,        // 柵格間距
    type: 'flex',      // 啟用 flex 模式
    justify: 'start',  // 水平對齊
    align: 'middle'    // 垂直對齊
  }
}
```

### 柵格配置
```typescript
const formItem = {
  label: '標題',
  prop: 'title',
  render: 'input',
  cols: {
    span: 12,        // 佔據 12 格（總共 24 格）
    offset: 0,       // 左側間隔格數
    push: 0,         // 向右移動格數
    pull: 0,         // 向左移動格數
    order: 1,        // 排序優先順序
    
    // 響應式配置
    xs: 24,          // 超小螢幕：佔滿一行
    sm: 12,          // 小螢幕：佔一半
    md: 8,           // 中等螢幕：佔三分之一
    lg: 6,           // 大螢幕：佔四分之一
    xl: 4            // 超大螢幕：佔六分之一
  }
}
```

## Grid 佈局

基於 Element Plus 的 `el-space` 實現的間距佈局：

### 基礎配置
```typescript
const formOptions = {
  layout: 'grid',
  grid: {
    direction: 'vertical',    // 排列方向
    size: 'large',           // 間距大小：small | default | large
    wrap: true,              // 是否換行
    fill: true,              // 是否填充容器寬度
    fillRatio: 30,           // 填充比例
    alignment: 'start'       // 對齊方式
  }
}
```

### 適用場景
- **垂直表單**：欄位較少的簡單表單
- **動態表單**：欄位數量不確定的表單
- **緊湊佈局**：需要節省空間的場景

## 響應式系統

### 斷點定義

| 斷點 | 裝置型別 | 寬度範圍 | 推薦列數 |
|------|---------|----------|----------|
| `xs` | 手機豎屏 | < 768px | 1 列 |
| `sm` | 手機橫屏/小平板 | ≥ 768px | 1-2 列 |
| `md` | 平板 | ≥ 992px | 2-3 列 |
| `lg` | 小桌面 | ≥ 1200px | 3-4 列 |
| `xl` | 大桌面 | ≥ 1920px | 4+ 列 |

### 響應式配置示例

```typescript
// 響應式表單項配置
const responsiveField = {
  label: '標題',
  prop: 'title',
  render: 'input',
  cols: {
    // 移動端優先
    xs: { span: 24 },                    // 手機：佔滿整行
    sm: { span: 12, offset: 0 },         // 小屏：一行兩列
    md: { span: 8, offset: 0 },          // 中屏：一行三列  
    lg: { span: 6, offset: 0 },          // 大屏：一行四列
    xl: { span: 4, offset: 2 }           // 超大屏：一行六列，左邊距
  }
}

// 全域性響應式配置
const formOptions = {
  responsiveConfig: {
    enabled: true,
    mobileSingleColumn: true,      // 移動端強制單列
    mobileHideLabels: false,       // 移動端是否隱藏標籤
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

## 佈局最佳實踐

### 1. 選擇合適的佈局系統

```typescript
// 複雜表單 → 使用 Flex 佈局
const complexForm = {
  layout: 'flex',
  flex: { gutter: 16 }
}

// 簡單表單 → 使用 Grid 佈局  
const simpleForm = {
  layout: 'grid',
  grid: { direction: 'vertical', size: 'medium' }
}
```

### 2. 合理規劃柵格

```typescript
// 標準三列布局
const threeColumnLayout = {
  cols: {
    xs: 24,    // 移動端：單列
    sm: 24,    // 小屏：單列
    md: 8,     // 中屏：三列
    lg: 8,     // 大屏：三列
    xl: 8      // 超大屏：三列
  }
}

// 主次分明佈局
const primarySecondaryLayout = {
  // 主要欄位
  cols: { xs: 24, sm: 16, md: 12, lg: 16 },
  
  // 次要欄位
  cols: { xs: 24, sm: 8, md: 6, lg: 8 }
}
```

### 3. 移動端最佳化

```typescript
const mobileOptimized = {
  mobileBreakpoint: 768,
  responsiveConfig: {
    enabled: true,
    mobileSingleColumn: true,      // 移動端單列
    mobileHideLabels: false        // 保留標籤顯示
  }
}
```

## 相關連結

- [佈局系統詳解](/front/component/ma-form#佈局系統詳解)
- [響應式配置](/front/component/ma-form#responsiveconfig-響應式配置)
- [移動端適配](/front/component/ma-form/examples/mobile-responsive)