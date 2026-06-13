# 圖示系統

MineAdmin 採用現代化的圖示解決方案，基於 Iconify 圖示框架和 UnoCSS 提供強大的圖示支援。系統支援線上圖示庫、離線模式和自定義圖示等多種方案。

## 圖示架構概覽

```plantuml
@startuml
!theme plain

package "圖示系統架構" {
  [Iconify框架] as iconify
  [UnoCSS引擎] as unocss
  [MaSvgIcon元件] as component
  [離線圖示快取] as cache
  [自定義SVG圖示] as custom
  
  iconify --> unocss : 圖示解析
  unocss --> component : CSS類生成
  iconify --> cache : 本地快取
  custom --> component : 本地圖示
  
  component --> [瀏覽器渲染]
}

@enduml
```

## 圖示解決方案對比

| 解決方案 | 優勢 | 適用場景 | 效能 | 維護成本 |
|---------|------|---------|------|---------|
| **Iconify線上** | 圖示豐富(200k+)、即用即載入 | 快速開發、原型設計 | ⭐⭐⭐ | 低 |
| **Iconify離線** | 無網路依賴、載入速度快 | 生產環境、內網部署 | ⭐⭐⭐⭐⭐ | 中 |
| **自定義SVG** | 完全可控、品牌定製 | 企業級應用、品牌統一 | ⭐⭐⭐⭐ | 高 |

## Iconify 圖示使用

::: tip Iconify 優勢
`Iconify` 是目前最全面的圖示框架，包含：
- **150+ 圖示集合**：FontAwesome、Material Design、Ant Design、Tabler Icons等
- **200,000+ 圖示**：涵蓋各行各業的設計需求  
- **統一API**：一套語法適配所有圖示集
- **按需載入**：只加載使用的圖示，減少包體積
:::

### 基礎圖示使用

<DemoPreview dir="demos/icon-basic" />

### 圖示搜尋和選擇

推薦使用 [Icônes](https://icones.js.org/) 搜尋圖示，這是基於 Iconify 的專業圖示搜尋工具：

![Icônes 介面展示](https://s21.ax1x.com/2024/10/14/pAt0w8S.jpg)

**搜尋技巧：**
1. **按分類瀏覽**：選擇 Material Design、FontAwesome 等知名圖示集
2. **關鍵詞搜尋**：支援中英文搜尋，如 "使用者"、"user"、"profile" 
3. **標籤篩選**：透過 solid、outline、filled 等標籤精確篩選
4. **尺寸預覽**：實時預覽不同尺寸下的圖示效果

::: info 圖示命名規範
複製得到的圖示格式為：`i-{集合名}:{圖示名}`
- 例如：`i-material-symbols:person`
- 例如：`i-heroicons:user-solid`
:::

### MaSvgIcon 元件使用

`MaSvgIcon` 是系統內建的圖示元件，提供統一的圖示渲染介面：

```vue
<template>
  <!-- 基礎使用 -->
  <ma-svg-icon name="i-material-symbols:person" />
  
  <!-- 設定尺寸 -->
  <ma-svg-icon name="i-heroicons:home" size="24" />
  
  <!-- 設定顏色 -->
  <ma-svg-icon name="i-tabler:heart" color="red" />
  
  <!-- 組合使用 -->
  <ma-svg-icon 
    name="i-lucide:settings" 
    size="20" 
    color="#409eff" 
    class="mr-2" 
  />
</template>
```

**元件屬性說明：**

| 屬性 | 型別 | 預設值 | 說明 |
|------|------|--------|------|
| `name` | string | - | 圖示名稱（必填） |
| `size` | string\|number | '16' | 圖示尺寸（px） |
| `color` | string | 'currentColor' | 圖示顏色 |
| `class` | string | - | 自定義CSS類 |

### CSS 類直接使用

對於簡單場景，可以直接使用 CSS 類名：

```html
<!-- 基礎使用 -->
<i class="i-material-symbols:person"></i>
<span class="i-heroicons:home"></span>

<!-- 結合 UnoCSS 工具類 -->
<i class="i-tabler:heart text-red-500 text-2xl"></i>
<span class="i-lucide:settings w-6 h-6 text-blue-500"></span>
```

::: warning 使用限制
CSS 類方式有以下限制：
- **不支援非同步載入**：圖示名稱必須在構建時確定
- **不支援動態拼接**：`class="i-${iconName}"` 這種寫法無效
- **推薦靜態使用**：適用於佈局固定的場景
:::

### 在路由選單中使用

<DemoPreview dir="demos/icon-menu" />

在路由配置中使用圖示，支援多種圖示來源：

```typescript
// 路由配置示例
export const routes = [
  {
    name: 'dashboard',
    path: '/dashboard',
    meta: {
      title: '儀表盤',
      icon: 'i-material-symbols:dashboard',  // Iconify圖示
    }
  },
  {
    name: 'users',
    path: '/users',
    meta: {
      title: '使用者管理',
      icon: 'i-heroicons:users',  // 另一個圖示集
    }
  },
  {
    name: 'settings',
    path: '/settings', 
    meta: {
      title: '系統設定',
      icon: 'custom-gear',  // 自定義SVG圖示
    }
  }
]
```

### 離線模式配置

對於生產環境或內網部署，建議使用離線模式以提升效能和穩定性：

```plantuml
@startuml
!theme plain

start
:開發階段;
:收集使用的圖示;
note right
  統計專案中實際使用的
  所有 Iconify 圖示
end note

:執行生成命令;
note right: pnpm run gen:icons
:選擇圖示集;
:選擇離線模式;
:生成本地圖示庫;

:構建應用;
note right
  圖示直接從本地載入
  無需網路請求
end note

stop
@enduml
```

**離線模式設定步驟：**

1. **收集圖示使用情況**
   ```bash
   # 掃描專案中使用的圖示
   grep -r "i-[a-zA-Z-]*:" src/ --include="*.vue" --include="*.ts"
   ```

2. **生成離線圖示庫**
   ```bash
   # 執行圖示生成命令
   pnpm run gen:icons
   ```

3. **按提示選擇配置**
   - 選擇需要的圖示集（如 Material Symbols、Heroicons）
   - 選擇使用模式為 "離線模式"  
   - 確認生成配置

::: tip 效能最佳化建議
- **按需選擇**：只選擇專案實際使用的圖示集
- **定期更新**：當新增新圖示時記得重新生成
- **版本控制**：將生成的圖示檔案納入版本管理
:::

## 自定義 SVG 圖示

對於企業特定的圖示需求，可以使用自定義 SVG 圖示：

### 圖示檔案管理

```
src/assets/icons/
├── brand/              # 品牌相關圖示
│   ├── logo.svg
│   └── logo-mini.svg
├── business/           # 業務專用圖示  
│   ├── order.svg
│   └── product.svg
└── common/             # 通用圖示
    ├── export.svg
    └── import.svg
```

### 使用自定義圖示

```vue
<template>
  <!-- 使用相對路徑（相對於 assets/icons） -->
  <ma-svg-icon name="brand/logo" />
  <ma-svg-icon name="business/order" />
  <ma-svg-icon name="common/export" />
  
  <!-- 直接使用檔名（需放在 icons 根目錄） -->
  <ma-svg-icon name="custom-icon" />
</template>
```

### SVG 圖示規範

為確保圖示在系統中正常顯示，請遵循以下規範：

```xml
<!-- 推薦的SVG格式 -->
<svg 
  xmlns="http://www.w3.org/2000/svg" 
  viewBox="0 0 24 24" 
  fill="currentColor"
  width="24" 
  height="24"
>
  <path d="..."/>
</svg>
```

**規範要點：**
- **統一尺寸**：建議使用 24x24 的 viewBox
- **可變顏色**：使用 `currentColor` 支援動態顏色
- **簡化路徑**：移除不必要的屬性和註釋
- **語義化命名**：檔名要清晰表達圖示含義

## 圖示在元件中的應用

### 表格操作按鈕

```vue
<script setup lang="tsx">
import { MaProTableSchema } from '@mineadmin/pro-table'

const schema: MaProTableSchema = {
  tableColumns: [
    {
      type: 'operation',
      operationConfigure: {
        actions: [
          {
            name: 'edit',
            text: '編輯',
            icon: 'i-heroicons:pencil-square',  // 編輯圖示
            onClick: (data) => editUser(data.row)
          },
          {
            name: 'delete', 
            text: '刪除',
            icon: 'i-heroicons:trash',  // 刪除圖示
            onClick: (data) => deleteUser(data.row)
          }
        ]
      }
    }
  ]
}
</script>
```

### 表單元件圖示

```vue
<template>
  <ma-form :items="formItems" />
</template>

<script setup>
const formItems = [
  {
    label: '使用者資訊',
    prop: 'user',
    render: 'input',
    icon: 'i-heroicons:user',  // 欄位圖示
    placeholder: '請輸入使用者名稱'
  }
]
</script>
```

### 狀態指示器

<DemoPreview dir="demos/icon-status" />

```vue
<template>
  <div class="status-list">
    <!-- 線上狀態 -->
    <div class="flex items-center">
      <ma-svg-icon name="i-heroicons:signal" color="green" />
      <span class="ml-2">線上</span>
    </div>
    
    <!-- 離線狀態 -->  
    <div class="flex items-center">
      <ma-svg-icon name="i-heroicons:signal-slash" color="gray" />
      <span class="ml-2">離線</span>
    </div>
  </div>
</template>
```

## 實踐指南

### 圖示選擇原則

1. **一致性原則**
   ```vue
   <!-- 推薦：統一使用一個圖示集 -->
   <ma-svg-icon name="i-heroicons:user" />
   <ma-svg-icon name="i-heroicons:cog-6-tooth" />
   <ma-svg-icon name="i-heroicons:home" />
   
   <!-- 避免：混用多個風格的圖示集 -->
   <ma-svg-icon name="i-heroicons:user" />          <!-- outline 風格 -->
   <ma-svg-icon name="i-material-symbols:settings" />  <!-- filled 風格 -->  
   <ma-svg-icon name="i-ant-design:home-filled" />     <!-- 不同設計語言 -->
   ```

2. **語義化原則**
   ```vue
   <!-- 推薦：圖示語義與功能匹配 -->
   <el-button @click="save">
     <ma-svg-icon name="i-heroicons:bookmark" /> 儲存
   </el-button>
   
   <!-- 避免：圖示語義不明確 -->
   <el-button @click="save">
     <ma-svg-icon name="i-heroicons:star" /> 儲存  
   </el-button>
   ```

### 效能最佳化策略

```typescript
// 圖示預載入配置
const criticalIcons = [
  'i-heroicons:home',
  'i-heroicons:user', 
  'i-heroicons:cog-6-tooth',
  'i-heroicons:bell'
]

// 在應用啟動時預載入關鍵圖示
criticalIcons.forEach(icon => {
  // 觸發圖示載入
  document.createElement('i').className = icon
})
```

### 無障礙訪問支援

```vue
<template>
  <!-- 新增適當的 aria 標籤 -->
  <button aria-label="設定">
    <ma-svg-icon name="i-heroicons:cog-6-tooth" />
  </button>
  
  <!-- 裝飾性圖示使用 aria-hidden -->
  <h2>
    <ma-svg-icon name="i-heroicons:star" aria-hidden="true" />
    重要通知
  </h2>
</template>
```

## 常見問題排查

### 圖示不顯示

**問題現象：**
- 圖示位置顯示空白
- 控制檯出現 404 錯誤

**排查步驟：**
1. **檢查圖示名稱**
   ```vue
   <!-- 檢查圖示名是否正確 -->
   <ma-svg-icon name="i-heroicons:user-solid" />
   <!--           ↑ 確認集合名和圖示名 -->
   ```

2. **驗證網路連線**
   ```javascript
   // 在瀏覽器控制檯檢查
   fetch('https://api.iconify.design/heroicons.json')
     .then(r => r.json())
     .then(data => console.log('圖示集資料:', data))
   ```

3. **檢查離線配置**
   ```bash
   # 確認離線圖示是否包含所需圖示
   ls dist/assets/icons/  # 檢查生成的圖示檔案
   ```

### 圖示載入緩慢

**最佳化方案：**
```typescript
// 1. 啟用圖示預載入
const iconPreloader = {
  preload: ['i-heroicons:user', 'i-heroicons:home'],
  
  init() {
    this.preload.forEach(icon => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = `https://api.iconify.design/${icon.replace('i-', '').replace(':', '/')}.svg`
      link.as = 'image'
      document.head.appendChild(link)
    })
  }
}

// 2. 使用離線模式
// 執行 pnpm run gen:icons 生成本地圖示庫
```

### 圖示樣式問題

```vue
<template>
  <!-- 問題：圖示尺寸不一致 -->
  <ma-svg-icon name="i-heroicons:user" class="text-sm" />
  <ma-svg-icon name="i-heroicons:home" class="text-lg" />
  
  <!-- 解決：統一設定尺寸 -->
  <ma-svg-icon name="i-heroicons:user" size="20" />
  <ma-svg-icon name="i-heroicons:home" size="20" />
  
  <!-- 或使用 CSS 類統一控制 -->
  <ma-svg-icon name="i-heroicons:user" class="icon-standard" />
  <ma-svg-icon name="i-heroicons:home" class="icon-standard" />
</template>

<style>
.icon-standard {
  width: 20px;
  height: 20px;
}
</style>
```

## 最佳實踐總結

### 開發階段
- ✅ 使用 [Icônes](https://icones.js.org/) 搜尋和預覽圖示
- ✅ 選擇一致的圖示集合（推薦 Heroicons 或 Material Symbols）
- ✅ 為圖示新增語義化的名稱和註釋
- ✅ 建立專案圖示使用規範文件

### 生產部署  
- ✅ 生成離線圖示庫提升載入效能
- ✅ 啟用圖示預載入最佳化首屏體驗
- ✅ 配置 CDN 加速圖示資源載入
- ✅ 監控圖示載入效能和錯誤率

### 維護階段
- ✅ 定期清理未使用的圖示引用
- ✅ 跟蹤圖示集版本更新
- ✅ 建立圖示變更的程式碼審查機制
- ✅ 維護自定義圖示的設計規範