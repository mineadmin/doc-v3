# 高級搜索

演示覆雜搜索場景的實現，包含多種表單組件類型、JSX 自定義渲染、條件顯示等高級功能。

## 複雜搜索表單

<DemoPreview dir="demos/ma-search/advanced-search" />

## 高級功能説明

### JSX 自定義渲染
通過函數返回 JSX 元素，實現完全自定義的表單組件：

```typescript
{
  label: '自定義組件',
  prop: 'custom',
  render: () => <CustomSearchComponent />
}
```

### 條件顯示
使用 `hide` 函數實現搜索項的動態顯示和隱藏：

```typescript
{
  label: '高級選項',
  prop: 'advanced',
  render: 'input',
  hide: () => !showAdvanced.value
}
```

### 多選組件
支持複選框組、級聯選擇器等多選類型的搜索組件：

```typescript
{
  label: '多選分類',
  prop: 'categories',
  render: 'checkbox-group',
  options: categoryOptions
}
```

## 使用場景

### 1. 企業級數據篩選
適用於複雜的業務數據篩選，支持多維度、多條件的組合查詢。

### 2. 報表查詢系統  
適用於需要精確條件控制的報表查詢，支持時間範圍、數值區間等複雜條件。

### 3. 電商高級篩選
適用於電商平台的商品篩選，支持品牌、規格、價格等多種篩選維度。

## 關鍵特性

- 🎯 支持 JSX/TSX 自定義渲染
- 🔄 動態顯示和隱藏搜索項
- 📊 多種數據選擇組件支持
- ⚡ 性能優化的渲染機制
- 🛠 靈活的配置和擴展能力

## 技術要點

### 自定義渲染函數
- 支持返回任意 Vue 組件或 JSX 元素
- 自動傳遞表單數據和更新方法
- 完整的類型推斷和智能提示

### 性能優化
- 使用虛擬列表技術處理大量選項
- 防抖處理減少不必要的請求
- 智能緩存提升用户體驗

## 相關鏈接

- [基礎用法](./basic-usage) - 瞭解基礎搜索配置
- [自定義操作](./custom-actions) - 瞭解自定義操作按鈕
- [動態管理](./dynamic-items) - 瞭解動態搜索項管理