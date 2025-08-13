# 高階搜尋

演示覆雜搜尋場景的實現，包含多種表單元件型別、JSX 自定義渲染、條件顯示等高階功能。

## 複雜搜尋表單

<DemoPreview dir="demos/ma-search/advanced-search" />

## 高階功能說明

### JSX 自定義渲染
透過函式返回 JSX 元素，實現完全自定義的表單元件：

```typescript
{
  label: '自定義元件',
  prop: 'custom',
  render: () => <CustomSearchComponent />
}
```

### 條件顯示
使用 `hide` 函式實現搜尋項的動態顯示和隱藏：

```typescript
{
  label: '高階選項',
  prop: 'advanced',
  render: 'input',
  hide: () => !showAdvanced.value
}
```

### 多選元件
支援複選框組、級聯選擇器等多選型別的搜尋元件：

```typescript
{
  label: '多選分類',
  prop: 'categories',
  render: 'checkbox-group',
  options: categoryOptions
}
```

## 使用場景

### 1. 企業級資料篩選
適用於複雜的業務資料篩選，支援多維度、多條件的組合查詢。

### 2. 報表查詢系統  
適用於需要精確條件控制的報表查詢，支援時間範圍、數值區間等複雜條件。

### 3. 電商高階篩選
適用於電商平臺的商品篩選，支援品牌、規格、價格等多種篩選維度。

## 關鍵特性

- 🎯 支援 JSX/TSX 自定義渲染
- 🔄 動態顯示和隱藏搜尋項
- 📊 多種資料選擇元件支援
- ⚡ 效能最佳化的渲染機制
- 🛠 靈活的配置和擴充套件能力

## 技術要點

### 自定義渲染函式
- 支援返回任意 Vue 元件或 JSX 元素
- 自動傳遞表單資料和更新方法
- 完整的型別推斷和智慧提示

### 效能最佳化
- 使用虛擬列表技術處理大量選項
- 防抖處理減少不必要的請求
- 智慧快取提升使用者體驗

## 相關連結

- [基礎用法](./basic-usage) - 瞭解基礎搜尋配置
- [自定義操作](./custom-actions) - 瞭解自定義操作按鈕
- [動態管理](./dynamic-items) - 瞭解動態搜尋項管理