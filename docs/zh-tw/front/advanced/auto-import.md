# 自動匯入

## 概述

MineAdmin 使用基於 Vite 的自動匯入系統，透過 `unplugin-auto-import` 和 `unplugin-vue-components` 外掛，大幅簡化開發體驗，減少樣板程式碼。開發者無需手動匯入常用的 Vue API、元件和自定義工具函式。

## 自動匯入範圍

::: tip 自動匯入清單
在開發 `*.vue、*.ts、*.tsx` 檔案時，以下內容無需手動匯入：

**核心框架 API**
- Vue 3 所有 API (`ref`, `reactive`, `computed`, `watch` 等)
- Vue Router API (`useRouter`, `useRoute` 等)
- Pinia API (`defineStore`, `storeToRefs` 等)

**專案特定模組**
- 所有 Store 模組：`./src/store/modules/*`
- 自動匯入的 Hooks：`./src/hooks/auto-imports/*`
- 全域性元件：`./src/components/*` (僅限 `.vue` 檔案)
:::

### 自動匯入與手動匯入的區別

MineAdmin 專案中的 hooks 分為兩類：

| 型別 | 位置 | 匯入方式 | 使用場景 |
|------|------|----------|----------|
| 自動匯入 Hooks | `src/hooks/auto-imports/` | 無需 import | 全域性通用工具函式 |
| 手動匯入 Hooks | `src/hooks/` | 需要 import | 特定場景的工具函式 |

## 配置詳解

### 自動匯入 API 配置

`./vite/auto-import.ts` 配置檔案負責自動匯入 API 和函式：

```typescript
import autoImport from 'unplugin-auto-import/vite'

export default function createAutoImport() {
  return autoImport({
    // 預設的包匯入
    imports: [
      'vue',          // Vue 3 APIs
      'vue-router',   // Vue Router APIs  
      'pinia',        // Pinia APIs
    ],
    
    // 生成的型別定義檔案
    dts: './types/auto-imports.d.ts',
    
    // 自定義目錄掃描
    dirs: [
      './src/hooks/auto-imports/**',  // 自動匯入的工具函式
      './src/store/modules/**',       // Pinia stores
    ],
  })
}
```

### 自動匯入元件配置

`./vite/components.ts` 配置檔案負責自動匯入 Vue 元件：

```typescript
import components from 'unplugin-vue-components/vite'

export default function createComponents() {
  return components({
    dirs: ['src/components'],                    // 元件掃描目錄
    include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/], // 支援的檔案型別
    dts: './types/components.d.ts',              // 生成的型別定義檔案
  })
}
```

## 實際使用示例

### 1. 在 Vue 元件中使用自動匯入

```vue
<template>
  <div>
    <el-button @click="handleClick">{{ $t('common.submit') }}</el-button>
    <ma-svg-icon name="user" />
  </div>
</template>

<script setup lang="ts">
// 無需匯入以下內容：
// import { ref, computed } from 'vue'
// import { useRouter } from 'vue-router'
// import { useMenuStore } from '@/store/modules/useMenuStore'
// import useDayjs from '@/hooks/auto-imports/useDayjs'
// import useTrans from '@/hooks/auto-imports/useTrans'

// 直接使用 Vue API
const count = ref(0)
const doubleCount = computed(() => count.value * 2)

// 直接使用 Vue Router
const router = useRouter()

// 直接使用自動匯入的 Store
const menuStore = useMenuStore()

// 直接使用自動匯入的工具函式
const dayjs = useDayjs()
const { $t } = useTrans()

const handleClick = () => {
  count.value++
  console.log('當前時間:', dayjs().format('YYYY-MM-DD HH:mm:ss'))
}
</script>
```

### 2. 自動匯入工具函式示例

以 `useDayjs.ts` 為例，展示自動匯入工具函式的實現：

```typescript
// src/hooks/auto-imports/useDayjs.ts
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

export default function useDayjs(date?: dayjs.ConfigType, origin: boolean = false): any {
  return origin ? dayjs : dayjs(date)
}
```

在元件中直接使用：

```typescript
// 無需匯入，直接使用
const currentTime = useDayjs().format('YYYY-MM-DD HH:mm:ss')
const relativeTime = useDayjs('2023-01-01').fromNow()
```

### 3. Store 自動匯入示例

Store 模組也會自動匯入：

```typescript
// src/store/modules/useMenuStore.ts  
import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', () => {
  const menus = ref([])
  
  const getMenus = () => {
    // 獲取選單資料的邏輯
  }
  
  return { menus, getMenus }
})
```

在元件中使用：

```vue
<script setup lang="ts">
// 無需匯入 useMenuStore，直接使用
const menuStore = useMenuStore()
const { menus } = storeToRefs(menuStore)

onMounted(() => {
  menuStore.getMenus()
})
</script>
```

## 專案結構詳解

```
src/
├── hooks/
│   ├── auto-imports/          # 自動匯入的工具函式
│   │   ├── useDayjs.ts       # 日期處理工具
│   │   ├── useGlobal.ts      # 全域性配置工具
│   │   ├── useHttp.ts        # HTTP 請求工具
│   │   └── useTrans.ts       # 國際化工具
│   │
│   └── useCache.ts           # 手動匯入的工具函式
│   └── useDialog.ts
│   └── useDrawer.ts
│
├── store/modules/             # 自動匯入的 Store 模組
│   ├── useDictStore.ts       # 字典資料 Store
│   ├── useMenuStore.ts       # 選單資料 Store
│   └── useKeepAliveStore.ts  # 頁面快取 Store
│
└── components/               # 自動匯入的全域性元件
    ├── ma-svg-icon/         # SVG 圖示元件
    ├── ma-upload-image/     # 圖片上傳元件
    └── ma-dialog/           # 對話方塊元件
```

## 型別定義檔案

自動匯入系統會生成兩個重要的型別定義檔案：

### 1. auto-imports.d.ts

```typescript
// types/auto-imports.d.ts
declare global {
  const ref: typeof import('vue')['ref']
  const computed: typeof import('vue')['computed']
  const useRouter: typeof import('vue-router')['useRouter']
  const useDayjs: typeof import('../src/hooks/auto-imports/useDayjs')['default']
  const useMenuStore: typeof import('../src/store/modules/useMenuStore')['useMenuStore']
  // ... 其他自動匯入的宣告
}
```

### 2. components.d.ts

```typescript
// types/components.d.ts
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    MaSvgIcon: typeof import('../src/components/ma-svg-icon/index.vue')['default']
    MaUploadImage: typeof import('../src/components/ma-upload-image/index.vue')['default']
    // ... 其他元件宣告
  }
}
```

## 最佳實踐

### 1. 組織自動匯入工具函式

將通用的工具函式放在 `src/hooks/auto-imports/` 目錄：

```typescript
// ✅ 適合自動匯入的工具函式
export default function useGlobal() {
  // 全域性配置相關的工具函式
  return {
    getAppVersion: () => import.meta.env.VITE_APP_VERSION,
    isProduction: () => import.meta.env.PROD
  }
}
```

### 2. 何時使用手動匯入

某些特殊場景建議使用手動匯入：

```typescript
// ✅ 適合手動匯入的工具函式
// src/hooks/useDialog.ts
export function useDialog() {
  // 對話方塊相關的特定邏輯
  // 只在需要的元件中匯入使用
}
```

### 3. 元件命名規範

自動匯入的元件遵循 PascalCase 命名：

```vue
<template>
  <!-- ✅ 正確的元件使用方式 -->
  <MaSvgIcon name="user" />
  <MaUploadImage v-model="imageUrl" />
  
  <!-- ❌ 錯誤的使用方式 -->
  <ma-svg-icon name="user" />
</template>
```

## 效能最佳化

### 1. 按需載入

自動匯入系統支援按需載入，未使用的 API 和元件不會被打包：

```typescript
// 只有實際使用的 API 才會被匯入
const count = ref(0)        // ref 會被匯入
// const state = reactive({}) // reactive 不會被匯入（未使用）
```

### 2. Tree Shaking

配合 Vite 的 Tree Shaking 功能，可以進一步最佳化打包體積：

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      treeshake: true, // 啟用 Tree Shaking
    },
  },
})
```

## 故障排除

### 1. 型別定義檔案未生成

如果型別定義檔案未自動生成，嘗試以下解決方案：

```bash
# 刪除現有型別檔案並重新構建
rm -rf types/auto-imports.d.ts types/components.d.ts
pnpm run dev
```

### 2. IDE 型別提示問題

確保 `tsconfig.json` 包含生成的型別定義檔案：

```json
{
  "compilerOptions": {
    "types": ["./types/auto-imports.d.ts", "./types/components.d.ts"]
  },
  "include": ["types/**/*"]
}
```

### 3. 元件無法自動匯入

檢查元件檔案結構：

```
src/components/ma-svg-icon/
├── index.vue        # ✅ 主元件檔案
└── types.ts         # 其他輔助檔案
```

### 4. 除錯自動匯入

在開發模式下檢查生成的型別檔案：

```bash
# 檢視自動匯入的 API
cat types/auto-imports.d.ts

# 檢視自動匯入的元件
cat types/components.d.ts
```

## 擴充套件配置

### 新增第三方庫自動匯入

```typescript
// vite/auto-import.ts
export default function createAutoImport() {
  return autoImport({
    imports: [
      'vue',
      'vue-router',
      'pinia',
      // 新增自定義庫
      {
        'lodash-es': ['debounce', 'throttle'],
        '@vueuse/core': ['useLocalStorage', 'useSessionStorage'],
      },
    ],
    // ...其他配置
  })
}
```

### 自定義元件庫整合

```typescript
// vite/components.ts
export default function createComponents() {
  return components({
    dirs: ['src/components'],
    // 新增第三方元件庫的自動匯入
    resolvers: [
      // Element Plus 元件自動匯入
      ElementPlusResolver(),
    ],
    // ...其他配置
  })
}
```