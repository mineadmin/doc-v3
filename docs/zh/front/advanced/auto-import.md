# 自动导入

## 概述

MineAdmin 使用基于 Vite 的自动导入系统，通过 `unplugin-auto-import` 和 `unplugin-vue-components` 插件，大幅简化开发体验，减少样板代码。开发者无需手动导入常用的 Vue API、组件和自定义工具函数。

## 自动导入范围

::: tip 自动导入清单
在开发 `*.vue、*.ts、*.tsx` 文件时，以下内容无需手动导入：

**核心框架 API**
- Vue 3 所有 API (`ref`, `reactive`, `computed`, `watch` 等)
- Vue Router API (`useRouter`, `useRoute` 等)
- Pinia API (`defineStore`, `storeToRefs` 等)

**项目特定模块**
- 所有 Store 模块：`./src/store/modules/*`
- 自动导入的 Hooks：`./src/hooks/auto-imports/*`
- 全局组件：`./src/components/*` (仅限 `.vue` 文件)
:::

### 自动导入与手动导入的区别

MineAdmin 项目中的 hooks 分为两类：

| 类型 | 位置 | 导入方式 | 使用场景 |
|------|------|----------|----------|
| 自动导入 Hooks | `src/hooks/auto-imports/` | 无需 import | 全局通用工具函数 |
| 手动导入 Hooks | `src/hooks/` | 需要 import | 特定场景的工具函数 |

## 配置详解

### 自动导入 API 配置

`./vite/auto-import.ts` 配置文件负责自动导入 API 和函数：

```typescript
import autoImport from 'unplugin-auto-import/vite'

export default function createAutoImport() {
  return autoImport({
    // 预设的包导入
    imports: [
      'vue',          // Vue 3 APIs
      'vue-router',   // Vue Router APIs  
      'pinia',        // Pinia APIs
    ],
    
    // 生成的类型定义文件
    dts: './types/auto-imports.d.ts',
    
    // 自定义目录扫描
    dirs: [
      './src/hooks/auto-imports/**',  // 自动导入的工具函数
      './src/store/modules/**',       // Pinia stores
    ],
  })
}
```

### 自动导入组件配置

`./vite/components.ts` 配置文件负责自动导入 Vue 组件：

```typescript
import components from 'unplugin-vue-components/vite'

export default function createComponents() {
  return components({
    dirs: ['src/components'],                    // 组件扫描目录
    include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/], // 支持的文件类型
    dts: './types/components.d.ts',              // 生成的类型定义文件
  })
}
```

## 实际使用示例

### 1. 在 Vue 组件中使用自动导入

```vue
<template>
  <div>
    <el-button @click="handleClick">{{ $t('common.submit') }}</el-button>
    <ma-svg-icon name="user" />
  </div>
</template>

<script setup lang="ts">
// 无需导入以下内容：
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

// 直接使用自动导入的 Store
const menuStore = useMenuStore()

// 直接使用自动导入的工具函数
const dayjs = useDayjs()
const { $t } = useTrans()

const handleClick = () => {
  count.value++
  console.log('当前时间:', dayjs().format('YYYY-MM-DD HH:mm:ss'))
}
</script>
```

### 2. 自动导入工具函数示例

以 `useDayjs.ts` 为例，展示自动导入工具函数的实现：

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

在组件中直接使用：

```typescript
// 无需导入，直接使用
const currentTime = useDayjs().format('YYYY-MM-DD HH:mm:ss')
const relativeTime = useDayjs('2023-01-01').fromNow()
```

### 3. Store 自动导入示例

Store 模块也会自动导入：

```typescript
// src/store/modules/useMenuStore.ts  
import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', () => {
  const menus = ref([])
  
  const getMenus = () => {
    // 获取菜单数据的逻辑
  }
  
  return { menus, getMenus }
})
```

在组件中使用：

```vue
<script setup lang="ts">
// 无需导入 useMenuStore，直接使用
const menuStore = useMenuStore()
const { menus } = storeToRefs(menuStore)

onMounted(() => {
  menuStore.getMenus()
})
</script>
```

## 项目结构详解

```
src/
├── hooks/
│   ├── auto-imports/          # 自动导入的工具函数
│   │   ├── useDayjs.ts       # 日期处理工具
│   │   ├── useGlobal.ts      # 全局配置工具
│   │   ├── useHttp.ts        # HTTP 请求工具
│   │   └── useTrans.ts       # 国际化工具
│   │
│   └── useCache.ts           # 手动导入的工具函数
│   └── useDialog.ts
│   └── useDrawer.ts
│
├── store/modules/             # 自动导入的 Store 模块
│   ├── useDictStore.ts       # 字典数据 Store
│   ├── useMenuStore.ts       # 菜单数据 Store
│   └── useKeepAliveStore.ts  # 页面缓存 Store
│
└── components/               # 自动导入的全局组件
    ├── ma-svg-icon/         # SVG 图标组件
    ├── ma-upload-image/     # 图片上传组件
    └── ma-dialog/           # 对话框组件
```

## 类型定义文件

自动导入系统会生成两个重要的类型定义文件：

### 1. auto-imports.d.ts

```typescript
// types/auto-imports.d.ts
declare global {
  const ref: typeof import('vue')['ref']
  const computed: typeof import('vue')['computed']
  const useRouter: typeof import('vue-router')['useRouter']
  const useDayjs: typeof import('../src/hooks/auto-imports/useDayjs')['default']
  const useMenuStore: typeof import('../src/store/modules/useMenuStore')['useMenuStore']
  // ... 其他自动导入的声明
}
```

### 2. components.d.ts

```typescript
// types/components.d.ts
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    MaSvgIcon: typeof import('../src/components/ma-svg-icon/index.vue')['default']
    MaUploadImage: typeof import('../src/components/ma-upload-image/index.vue')['default']
    // ... 其他组件声明
  }
}
```

## 最佳实践

### 1. 组织自动导入工具函数

将通用的工具函数放在 `src/hooks/auto-imports/` 目录：

```typescript
// ✅ 适合自动导入的工具函数
export default function useGlobal() {
  // 全局配置相关的工具函数
  return {
    getAppVersion: () => import.meta.env.VITE_APP_VERSION,
    isProduction: () => import.meta.env.PROD
  }
}
```

### 2. 何时使用手动导入

某些特殊场景建议使用手动导入：

```typescript
// ✅ 适合手动导入的工具函数
// src/hooks/useDialog.ts
export function useDialog() {
  // 对话框相关的特定逻辑
  // 只在需要的组件中导入使用
}
```

### 3. 组件命名规范

自动导入的组件遵循 PascalCase 命名：

```vue
<template>
  <!-- ✅ 正确的组件使用方式 -->
  <MaSvgIcon name="user" />
  <MaUploadImage v-model="imageUrl" />
  
  <!-- ❌ 错误的使用方式 -->
  <ma-svg-icon name="user" />
</template>
```

## 性能优化

### 1. 按需加载

自动导入系统支持按需加载，未使用的 API 和组件不会被打包：

```typescript
// 只有实际使用的 API 才会被导入
const count = ref(0)        // ref 会被导入
// const state = reactive({}) // reactive 不会被导入（未使用）
```

### 2. Tree Shaking

配合 Vite 的 Tree Shaking 功能，可以进一步优化打包体积：

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      treeshake: true, // 启用 Tree Shaking
    },
  },
})
```

## 故障排除

### 1. 类型定义文件未生成

如果类型定义文件未自动生成，尝试以下解决方案：

```bash
# 删除现有类型文件并重新构建
rm -rf types/auto-imports.d.ts types/components.d.ts
pnpm run dev
```

### 2. IDE 类型提示问题

确保 `tsconfig.json` 包含生成的类型定义文件：

```json
{
  "compilerOptions": {
    "types": ["./types/auto-imports.d.ts", "./types/components.d.ts"]
  },
  "include": ["types/**/*"]
}
```

### 3. 组件无法自动导入

检查组件文件结构：

```
src/components/ma-svg-icon/
├── index.vue        # ✅ 主组件文件
└── types.ts         # 其他辅助文件
```

### 4. 调试自动导入

在开发模式下检查生成的类型文件：

```bash
# 查看自动导入的 API
cat types/auto-imports.d.ts

# 查看自动导入的组件
cat types/components.d.ts
```

## 扩展配置

### 添加第三方库自动导入

```typescript
// vite/auto-import.ts
export default function createAutoImport() {
  return autoImport({
    imports: [
      'vue',
      'vue-router',
      'pinia',
      // 添加自定义库
      {
        'lodash-es': ['debounce', 'throttle'],
        '@vueuse/core': ['useLocalStorage', 'useSessionStorage'],
      },
    ],
    // ...其他配置
  })
}
```

### 自定义组件库集成

```typescript
// vite/components.ts
export default function createComponents() {
  return components({
    dirs: ['src/components'],
    // 添加第三方组件库的自动导入
    resolvers: [
      // Element Plus 组件自动导入
      ElementPlusResolver(),
    ],
    // ...其他配置
  })
}
```