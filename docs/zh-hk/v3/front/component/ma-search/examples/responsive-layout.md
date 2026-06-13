# 響應式佈局

演示不同屏幕尺寸下的響應式效果，包含實時視口信息和動態配置測試，確保搜索組件在各種設備上都有良好的用户體驗。

## 響應式佈局演示

<DemoPreview dir="demos/ma-search/responsive-layout" />

## 響應式配置説明

### 斷點系統
MaSearch 採用基於 CSS Media Queries 的響應式斷點系統：

| 斷點 | 屏幕尺寸 | 默認列數 | 典型設備 |
|------|----------|----------|----------|
| `xs` | < 768px | 1 | 手機豎屏 |
| `sm` | ≥ 768px | 2 | 手機橫屏、小平板 |
| `md` | ≥ 992px | 2 | 平板、小筆記本 |
| `lg` | ≥ 1200px | 3 | 桌面顯示器 |
| `xl` | ≥ 1920px | 4 | 大屏顯示器 |

### 基礎配置
通過 `cols` 參數配置不同斷點下的列數：

```typescript
const searchOptions = {
  cols: {
    xs: 1,  // 移動端單列顯示
    sm: 2,  // 平板雙列顯示  
    md: 2,  // 中等屏幕雙列顯示
    lg: 3,  // 大屏三列顯示
    xl: 4   // 超大屏四列顯示
  }
}
```

### 自定義斷點
根據實際業務需求自定義斷點配置：

```typescript
// 緊湊型佈局
const compactCols = {
  xs: 1,
  sm: 3,
  md: 4,
  lg: 5,
  xl: 6
}

// 寬鬆型佈局  
const spaciousCols = {
  xs: 1,
  sm: 1,
  md: 2,
  lg: 2,
  xl: 3
}
```

## 使用場景

### 1. 移動端優先設計
專為移動設備優化的搜索界面：

```typescript
// 移動端友好配置
const mobileFirstConfig = {
  cols: { xs: 1, sm: 1, md: 2, lg: 3, xl: 4 },
  fold: true,
  foldRows: 1  // 移動端默認只顯示一行
}
```

### 2. 桌面端密集顯示
充分利用桌面端的屏幕空間：

```typescript
// 桌面端密集顯示
const desktopDenseConfig = {
  cols: { xs: 1, sm: 2, md: 3, lg: 4, xl: 6 }
}
```

### 3. 自適應數據儀表板
根據儀表板佈局自動調整搜索區域：

```typescript
// 儀表板自適應配置
const dashboardConfig = {
  cols: { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 },
  fold: true,
  foldRows: 1
}
```

## 響應式特性

### 自動列計算
組件會根據容器寬度和斷點配置自動計算每行的列數。

### 平滑過渡
在屏幕尺寸改變時，佈局會平滑過渡，避免突兀的跳轉。

### 內容溢出處理
當搜索項內容過長時，自動添加省略號或換行處理。

## 關鍵特性

- 📱 移動端友好的響應式設計
- 🖥 充分利用大屏空間
- 🔄 平滑的佈局過渡動畫
- 📏 靈活的斷點配置系統
- ⚡ 高性能的佈局計算

## 高級配置

### 動態響應式
根據容器大小動態調整佈局：

```typescript
// 監聽容器尺寸變化
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

### 設備類型檢測
根據設備類型優化佈局：

```typescript
// 檢測設備類型
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

// 根據設備類型配置
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

## 最佳實踐

### 1. 漸進式增強
從移動端開始設計，逐步增強桌面端體驗：

```typescript
// 移動端優先的配置策略
const progressiveConfig = {
  // 移動端基礎體驗
  cols: { xs: 1 },
  fold: true,
  foldRows: 1,
  
  // 平板端增強
  ...window.innerWidth >= 768 && { 
    cols: { xs: 1, sm: 2 },
    foldRows: 2 
  },
  
  // 桌面端完整體驗
  ...window.innerWidth >= 1200 && { 
    cols: { xs: 1, sm: 2, md: 3, lg: 4 },
    foldRows: 3 
  }
}
```

### 2. 內容優先級
在不同屏幕下顯示不同優先級的搜索項：

```typescript
// 根據屏幕大小顯示不同優先級的搜索項
const getItemsByPriority = (screenSize: string) => {
  const allItems = [
    { label: '用户名', prop: 'username', priority: 'high' },
    { label: '狀態', prop: 'status', priority: 'high' },
    { label: '註冊時間', prop: 'created_at', priority: 'medium' },
    { label: '最後登錄', prop: 'last_login', priority: 'low' }
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

### 3. 性能優化
在小屏設備上優化渲染性能：

```typescript
// 小屏設備性能優化
const optimizedConfig = {
  // 移動端減少列數以提升性能
  cols: window.innerWidth < 768 ? { xs: 1 } : { xs: 1, sm: 2, md: 3, lg: 4 },
  
  // 移動端默認摺疊以減少初始渲染
  fold: window.innerWidth < 768,
  foldRows: window.innerWidth < 768 ? 1 : 2
}
```

## 相關鏈接

- [摺疊搜索](./collapsible-search) - 瞭解摺疊功能與響應式的結合使用
- [表格集成](./table-integration) - 瞭解響應式搜索與表格的集成
- [基礎用法](./basic-usage) - 瞭解基礎的搜索功能