# 自定義操作按鈕

演示所有插槽的使用方法，包括完全替換操作按鈕區域、前置插入內容、後置追加內容等多種自定義場景。

## 自定義操作演示

<DemoPreview dir="demos/ma-search/custom-actions" />

## 插槽使用說明

### actions 插槽
完全替換預設的操作按鈕區域，獲得最大的定製靈活性：

```vue
<template #actions="{ searchLoading, resetLoading }">
  <div class="custom-actions">
    <el-button 
      type="primary" 
      :loading="searchLoading"
      @click="handleCustomSearch"
    >
      立即搜尋
    </el-button>
    <el-button @click="handleAdvancedSearch">
      高階搜尋
    </el-button>
    <el-button 
      :loading="resetLoading"
      @click="handleCustomReset"
    >
      清空條件
    </el-button>
  </div>
</template>
```

### beforeActions 插槽
在預設操作按鈕前插入自定義內容：

```vue
<template #beforeActions>
  <el-button type="info" @click="handleImport">
    匯入條件
  </el-button>
  <el-button type="warning" @click="handleExport">
    匯出條件
  </el-button>
</template>
```

### afterActions 插槽
在預設操作按鈕後追加自定義內容：

```vue
<template #afterActions>
  <el-button type="success" @click="handleSaveTemplate">
    儲存模板
  </el-button>
  <el-dropdown @command="handleQuickAction">
    <el-button>
      快捷操作 <el-icon><arrow-down /></el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="clear">清空所有</el-dropdown-item>
        <el-dropdown-item command="today">今日資料</el-dropdown-item>
        <el-dropdown-item command="week">本週資料</el-dropdown-item>
      </el-dropdown-Menu>
    </template>
  </el-dropdown>
</template>
```

## 使用場景

### 1. 搜尋模板管理
新增儲存、載入搜尋模板的功能，方便使用者複用常用的搜尋條件。

### 2. 資料匯入匯出
在搜尋區域新增匯入/匯出功能，支援批次操作和資料交換。

### 3. 快捷操作選單
提供下拉選單形式的快捷操作，如快速篩選今日、本週、本月資料。

### 4. 多步驟搜尋流程
實現嚮導式的搜尋流程，透過自定義按鈕控制搜尋步驟。

## 插槽引數說明

### actions 插槽引數
- `searchLoading: boolean` - 搜尋按鈕載入狀態
- `resetLoading: boolean` - 重置按鈕載入狀態

### beforeActions & afterActions 插槽
- 無引數，純內容插入

## 關鍵特性

- 🎨 完全自定義的操作區域
- 🔧 靈活的插槽系統設計
- 📦 保持原有功能的同時擴充套件能力
- 🎯 支援複雜的業務場景定製
- ⚡ 高效能的插槽渲染機制

## 設計模式

### 替換模式 (actions)
適用於需要完全重新設計操作區域的場景：

```vue
<!-- 完全自定義的操作區域 -->
<template #actions>
  <CustomActionBar />
</template>
```

### 擴充套件模式 (beforeActions/afterActions)
適用於在保持預設功能基礎上新增額外操作：

```vue
<!-- 在預設按鈕基礎上擴充套件 -->
<template #beforeActions>
  <ExtraActions />
</template>
```

## 最佳實踐

### 1. 保持操作一致性
自定義操作按鈕時，保持與系統整體的視覺風格一致。

### 2. 合理使用載入狀態
利用插槽引數中的 `loading` 狀態，為自定義按鈕新增載入效果。

### 3. 響應式設計
確保自定義操作在不同螢幕尺寸下都能正常顯示和操作。

### 4. 使用者體驗最佳化
- 提供清晰的操作反饋
- 新增適當的確認對話方塊
- 實現操作的撤銷功能

## 相關連結

- [方法演示](./methods-demo) - 瞭解所有暴露方法的使用
- [動態管理](./dynamic-items) - 瞭解動態搜尋項管理
- [表單驗證](./form-validation) - 瞭解表單驗證功能