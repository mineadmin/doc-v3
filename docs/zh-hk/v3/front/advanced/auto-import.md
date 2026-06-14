# 自動導入

## 概述

MineAdmin 使用基於 Vite 的自動導入系統，通過 `unplugin-auto-import` 和 `unplugin-vue-components` 插件，大幅簡化開發體驗，減少樣板代碼。開發者無需手動導入常用的 Vue API、組件和自定義工具函數。

## 自動導入範圍

::: tip 自動導入清單
在開發 `*.vue、*.ts、*.tsx` 文件時，以下內容無需手動導入：

**核心框架 API**
- Vue 3 所有 API (`ref`, `reactive`, `computed`, `watch` 等)
- Vue Router API (`useRouter`, `useRoute` 等)
- Pinia API (`defineStore`, `storeToRefs` 等)

**項目特定模塊**
- 所有 Store 模塊：`./src/store/modules/*`
- 自動導入的 Hooks：`./src/hooks/auto-imports/*`
- 全局組件：`./src/components/*` (僅限 `.vue` 文件)
:::

### 自動導入與手動導入的區別

MineAdmin 項目中的 hooks 分為兩類：

| 類型 | 位置 | 導入方式 | 使用場景 |
|------|------|----------|----------|
| 自動導入 Hooks | `src/hooks/auto-imports/` | 無需 import | 全局通用工具函數 |
| 手動導入 Hooks | `src/hooks/` | 需要 import | 特定場景的工具函數 |

## 配置詳解

### 自動導入 API 配置

`./vite/auto-import.ts` 配置文件負責自動導入 API 和函數：

```typescript
import autoImport from 'unplugin-auto-import/vite'

export default function createAutoImport() {
  return autoImport({
    // 預設的包導入
    imports: [
      'vue',          // Vue 3 APIs
      'vue-router',   // Vue Router APIs  
      'pinia',        // Pinia APIs
    ],
    
    // 生成的類型定義文件
    dts: './types/auto-imports.d.ts',
    
    // 自定義目錄掃描
    dirs: [
      './src/hooks/auto-imports/**',  // 自動導入的工具函數
      './src/store/modules/**',       // Pinia stores
    ],
  })
}
```

### 自動導入組件配置

`./vite/components.ts` 配置文件負責自動導入 Vue 組件：

```typescript
import components from 'unplugin-vue-components/vite'

export default function createComponents() {
  return components({
    dirs: ['src/components'],                    // 組件掃描目錄
    include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/], // 支持的文件類型
    dts: './types/components.d.ts',              // 生成的類型定義文件
  })
}
```

## 實際使用示例

### 1. 在 Vue 組件中使用自動導入

```vue
<template>
  <div>
    <el-button @click="handleClick">{{ $t('common.submit') }}</el-button>
    <ma-svg-icon name="user" />
  </div>
</template>

<script setup lang="ts">
// 無需導入以下內容：
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

// 直接使用自動導入的 Store
const menuStore = useMenuStore()

// 直接使用自動導入的工具函數
const dayjs = useDayjs()
const { $t } = useTrans()

const handleClick = () => {
  count.value++
  console.log('當前時間:', dayjs().format('YYYY-MM-DD HH:mm:ss'))
}
</script>
```

### 2. 自動導入工具函數示例

以 `useDayjs.ts` 為例，展示自動導入工具函數的實現：

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

在組件中直接使用：

```typescript
// 無需導入，直接使用
const currentTime = useDayjs().format('YYYY-MM-DD HH:mm:ss')
const relativeTime = useDayjs('2023-01-01').fromNow()
```

### 3. Store 自動導入示例

Store 模塊也會自動導入：

```typescript
// src/store/modules/useMenuStore.ts  
import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', () => {
  const menus = ref([])
  
  const getMenus = () => {
    // 獲取菜單數據的邏輯
  }
  
  return { menus, getMenus }
})
```

在組件中使用：

```vue
<script setup lang="ts">
// 無需導入 useMenuStore，直接使用
const menuStore = useMenuStore()
const { menus } = storeToRefs(menuStore)

onMounted(() => {
  menuStore.getMenus()
})
</script>
```

## 項目結構詳解

```
src/
├── hooks/
│   ├── auto-imports/          # 自動導入的工具函數
│   │   ├── useDayjs.ts       # 日期處理工具
│   │   ├── useGlobal.ts      # 全局配置工具
│   │   ├── useHttp.ts        # HTTP 請求工具
│   │   └── useTrans.ts       # 國際化工具
│   │
│   └── useCache.ts           # 手動導入的工具函數
│   └── useDialog.ts
│   └── useDrawer.ts
│
├── store/modules/             # 自動導入的 Store 模塊
│   ├── useDictStore.ts       # 字典數據 Store
│   ├── useMenuStore.ts       # 菜單數據 Store
│   └── useKeepAliveStore.ts  # 頁面緩存 Store
│
└── components/               # 自動導入的全局組件
    ├── ma-svg-icon/         # SVG 圖標組件
    ├── ma-upload-image/     # 圖片上傳組件
    └── ma-dialog/           # 對話框組件
```

## 類型定義文件

自動導入系統會生成兩個重要的類型定義文件：

### 1. auto-imports.d.ts

```typescript
// types/auto-imports.d.ts
declare global {
  const ref: typeof import('vue')['ref']
  const computed: typeof import('vue')['computed']
  const useRouter: typeof import('vue-router')['useRouter']
  const useDayjs: typeof import('../src/hooks/auto-imports/useDayjs')['default']
  const useMenuStore: typeof import('../src/store/modules/useMenuStore')['useMenuStore']
  // ... 其他自動導入的聲明
}
```

### 2. components.d.ts

```typescript
// types/components.d.ts
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    MaSvgIcon: typeof import('../src/components/ma-svg-icon/index.vue')['default']
    MaUploadImage: typeof import('../src/components/ma-upload-image/index.vue')['default']
    // ... 其他組件聲明
  }
}
```

## 最佳實踐

### 1. 組織自動導入工具函數

將通用的工具函數放在 `src/hooks/auto-imports/` 目錄：

```typescript
// ✅ 適合自動導入的工具函數
export default function useGlobal() {
  // 全局配置相關的工具函數
  return {
    getAppVersion: () => import.meta.env.VITE_APP_VERSION,
    isProduction: () => import.meta.env.PROD
  }
}
```

### 2. 何時使用手動導入

某些特殊場景建議使用手動導入：

```typescript
// ✅ 適合手動導入的工具函數
// src/hooks/useDialog.ts
export function useDialog() {
  // 對話框相關的特定邏輯
  // 只在需要的組件中導入使用
}
```

### 3. 組件命名規範

自動導入的組件遵循 PascalCase 命名：

```vue
<template>
  <!-- ✅ 正確的組件使用方式 -->
  <MaSvgIcon name="user" />
  <MaUploadImage v-model="imageUrl" />
  
  <!-- ❌ 錯誤的使用方式 -->
  <ma-svg-icon name="user" />
</template>
```

## 性能優化

### 1. 按需加載

自動導入系統支持按需加載，未使用的 API 和組件不會被打包：

```typescript
// 只有實際使用的 API 才會被導入
const count = ref(0)        // ref 會被導入
// const state = reactive({}) // reactive 不會被導入（未使用）
```

### 2. Tree Shaking

配合 Vite 的 Tree Shaking 功能，可以進一步優化打包體積：

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      treeshake: true, // 啓用 Tree Shaking
    },
  },
})
```

## 故障排除

### 1. 類型定義文件未生成

如果類型定義文件未自動生成，嘗試以下解決方案：

```bash
# 刪除現有類型文件並重新構建
rm -rf types/auto-imports.d.ts types/components.d.ts
pnpm run dev
```

### 2. IDE 類型提示問題

確保 `tsconfig.json` 包含生成的類型定義文件：

```json
{
  "compilerOptions": {
    "types": ["./types/auto-imports.d.ts", "./types/components.d.ts"]
  },
  "include": ["types/**/*"]
}
```

### 3. 組件無法自動導入

檢查組件文件結構：

```
src/components/ma-svg-icon/
├── index.vue        # ✅ 主組件文件
└── types.ts         # 其他輔助文件
```

### 4. 調試自動導入

在開發模式下檢查生成的類型文件：

```bash
# 查看自動導入的 API
cat types/auto-imports.d.ts

# 查看自動導入的組件
cat types/components.d.ts
```

## 擴展配置

### 添加第三方庫自動導入

```typescript
// vite/auto-import.ts
export default function createAutoImport() {
  return autoImport({
    imports: [
      'vue',
      'vue-router',
      'pinia',
      // 添加自定義庫
      {
        'lodash-es': ['debounce', 'throttle'],
        '@vueuse/core': ['useLocalStorage', 'useSessionStorage'],
      },
    ],
    // ...其他配置
  })
}
```

### 自定義組件庫集成

```typescript
// vite/components.ts
export default function createComponents() {
  return components({
    dirs: ['src/components'],
    // 添加第三方組件庫的自動導入
    resolvers: [
      // Element Plus 組件自動導入
      ElementPlusResolver(),
    ],
    // ...其他配置
  })
}
```