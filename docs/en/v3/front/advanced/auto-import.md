# Auto Import

## Overview

MineAdmin uses a Vite-based auto-import system, leveraging the `unplugin-auto-import` and `unplugin-vue-components` plugins to significantly streamline the development experience and reduce boilerplate code. Developers no longer need to manually import commonly used Vue APIs, components, and custom utility functions.

## Auto Import Scope

::: tip Auto Import Checklist
When developing `*.vue`, `*.ts`, `*.tsx` files, the following items do not require manual imports:

**Core Framework APIs**
- All Vue 3 APIs (`ref`, `reactive`, `computed`, `watch`, etc.)
- Vue Router APIs (`useRouter`, `useRoute`, etc.)
- Pinia APIs (`defineStore`, `storeToRefs`, etc.)

**Project-Specific Modules**
- All Store modules: `./src/store/modules/*`
- Auto-imported Hooks: `./src/hooks/auto-imports/*`
- Global Components: `./src/components/*` (`.vue` files only)
:::

### Difference Between Auto-imported and Manually Imported

Hooks in the MineAdmin project are divided into two categories:

| Type | Location | Import Method | Use Case |
|------|----------|---------------|----------|
| Auto-imported Hooks | `src/hooks/auto-imports/` | No import needed | Global utility functions |
| Manually Imported Hooks | `src/hooks/` | Requires import | Specific scenario utility functions |

## Configuration Details

### Auto Import API Configuration

The `./vite/auto-import.ts` configuration file handles automatic API and function imports:

```typescript
import autoImport from 'unplugin-auto-import/vite'

export default function createAutoImport() {
  return autoImport({
    // Preset package imports
    imports: [
      'vue',          // Vue 3 APIs
      'vue-router',   // Vue Router APIs
      'pinia',        // Pinia APIs
    ],

    // Generated type definition file
    dts: './types/auto-imports.d.ts',

    // Custom directory scanning
    dirs: [
      './src/hooks/auto-imports/**',  // Utility functions for auto-import
      './src/store/modules/**',       // Pinia stores
    ],
  })
}
```

### Auto Import Component Configuration

The `./vite/components.ts` configuration file handles automatic Vue component imports:

```typescript
import components from 'unplugin-vue-components/vite'

export default function createComponents() {
  return components({
    dirs: ['src/components'],                    // Component scanning directory
    include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/], // Supported file types
    dts: './types/components.d.ts',              // Generated type definition file
  })
}
```

## Practical Usage Examples

### 1. Using Auto Imports in Vue Components

```vue
<template>
  <div>
    <el-button @click="handleClick">{{ $t('common.submit') }}</el-button>
    <ma-svg-icon name="user" />
  </div>
</template>

<script setup lang="ts">
// No need to import the following:
// import { ref, computed } from 'vue'
// import { useRouter } from 'vue-router'
// import { useMenuStore } from '@/store/modules/useMenuStore'
// import useDayjs from '@/hooks/auto-imports/useDayjs'
// import useTrans from '@/hooks/auto-imports/useTrans'

// Use Vue API directly
const count = ref(0)
const doubleCount = computed(() => count.value * 2)

// Use Vue Router directly
const router = useRouter()

// Use auto-imported Store directly
const menuStore = useMenuStore()

// Use auto-imported utility functions directly
const dayjs = useDayjs()
const { $t } = useTrans()

const handleClick = () => {
  count.value++
  console.log('Current time:', dayjs().format('YYYY-MM-DD HH:mm:ss'))
}
</script>
```

### 2. Auto Imported Utility Function Example

Using `useDayjs.ts` as an example, this shows the implementation of auto-imported utility functions:

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

Using it directly in a component:

```typescript
// No import needed, use directly
const currentTime = useDayjs().format('YYYY-MM-DD HH:mm:ss')
const relativeTime = useDayjs('2023-01-01').fromNow()
```

### 3. Store Auto Import Example

Store modules are also auto-imported:

```typescript
// src/store/modules/useMenuStore.ts
import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', () => {
  const menus = ref([])

  const getMenus = () => {
    // Logic to fetch menu data
  }

  return { menus, getMenus }
})
```

Using it in a component:

```vue
<script setup lang="ts">
// No need to import useMenuStore, use it directly
const menuStore = useMenuStore()
const { menus } = storeToRefs(menuStore)

onMounted(() => {
  menuStore.getMenus()
})
</script>
```

## Project Structure Details

```
src/
├── hooks/
│   ├── auto-imports/          # Auto-imported utility functions
│   │   ├── useDayjs.ts       # Date handling utility
│   │   ├── useGlobal.ts      # Global configuration utility
│   │   ├── useHttp.ts        # HTTP request utility
│   │   └── useTrans.ts       # Internationalization utility
│   │
│   └── useCache.ts           # Manually imported utility function
│   └── useDialog.ts
│   └── useDrawer.ts
│
├── store/modules/             # Auto-imported Store modules
│   ├── useDictStore.ts       # Dictionary data Store
│   ├── useMenuStore.ts       # Menu data Store
│   └── useKeepAliveStore.ts  # Page cache Store
│
└── components/               # Auto-imported global components
    ├── ma-svg-icon/         # SVG icon component
    ├── ma-upload-image/     # Image upload component
    └── ma-dialog/           # Dialog component
```

## Type Definition Files

The auto-import system generates two important type definition files:

### 1. auto-imports.d.ts

```typescript
// types/auto-imports.d.ts
declare global {
  const ref: typeof import('vue')['ref']
  const computed: typeof import('vue')['computed']
  const useRouter: typeof import('vue-router')['useRouter']
  const useDayjs: typeof import('../src/hooks/auto-imports/useDayjs')['default']
  const useMenuStore: typeof import('../src/store/modules/useMenuStore')['useMenuStore']
  // ... other auto import declarations
}
```

### 2. components.d.ts

```typescript
// types/components.d.ts
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    MaSvgIcon: typeof import('../src/components/ma-svg-icon/index.vue')['default']
    MaUploadImage: typeof import('../src/components/ma-upload-image/index.vue')['default']
    // ... other component declarations
  }
}
```

## Best Practices

### 1. Organizing Auto-imported Utility Functions

Place general utility functions in the `src/hooks/auto-imports/` directory:

```typescript
// ✅ Suitable for auto-imported utility functions
export default function useGlobal() {
  // Utility functions related to global configuration
  return {
    getAppVersion: () => import.meta.env.VITE_APP_VERSION,
    isProduction: () => import.meta.env.PROD
  }
}
```

### 2. When to Use Manual Imports

Certain specific scenarios recommend using manual imports:

```typescript
// ✅ Suitable for manually imported utility functions
// src/hooks/useDialog.ts
export function useDialog() {
  // Dialog-related specific logic
  // Only import and use in required components
}
```

### 3. Component Naming Convention

Auto-imported components follow PascalCase naming:

```vue
<template>
  <!-- ✅ Correct component usage -->
  <MaSvgIcon name="user" />
  <MaUploadImage v-model="imageUrl" />

  <!-- ❌ Incorrect usage -->
  <ma-svg-icon name="user" />
</template>
```

## Performance Optimization

### 1. On-Demand Loading

The auto-import system supports on-demand loading; unused APIs and components are not bundled:

```typescript
// Only actually used APIs are imported
const count = ref(0)        // ref will be imported
// const state = reactive({}) // reactive will not be imported (unused)
```

### 2. Tree Shaking

Combined with Vite's Tree Shaking feature for further bundle size optimization:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      treeshake: true, // Enable Tree Shaking
    },
  },
})
```

## Troubleshooting

### 1. Type Definition Files Not Generated

If type definition files are not generated automatically, try the following solutions:

```bash
# Delete existing type files and rebuild
rm -rf types/auto-imports.d.ts types/components.d.ts
pnpm run dev
```

### 2. IDE Type Hint Issues

Ensure `tsconfig.json` includes the generated type definition files:

```json
{
  "compilerOptions": {
    "types": ["./types/auto-imports.d.ts", "./types/components.d.ts"]
  },
  "include": ["types/**/*"]
}
```

### 3. Components Not Auto-imported

Check the component file structure:

```
src/components/ma-svg-icon/
├── index.vue        # ✅ Main component file
└── types.ts         # Other auxiliary files
```

### 4. Debugging Auto Imports

Check the generated type files in development mode:

```bash
# View auto-imported APIs
cat types/auto-imports.d.ts

# View auto-imported components
cat types/components.d.ts
```

## Extended Configuration

### Adding Third-party Library Auto Imports

```typescript
// vite/auto-import.ts
export default function createAutoImport() {
  return autoImport({
    imports: [
      'vue',
      'vue-router',
      'pinia',
      // Add custom libraries
      {
        'lodash-es': ['debounce', 'throttle'],
        '@vueuse/core': ['useLocalStorage', 'useSessionStorage'],
      },
    ],
    // ...other configuration
  })
}
```

### Integrating Custom Component Libraries

```typescript
// vite/components.ts
export default function createComponents() {
  return components({
    dirs: ['src/components'],
    // Add automatic import for third-party component libraries
    resolvers: [
      // Element Plus component auto import
      ElementPlusResolver(),
    ],
    // ...other configuration
  })
}
```