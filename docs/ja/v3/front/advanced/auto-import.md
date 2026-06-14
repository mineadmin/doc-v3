# 自動インポート

## 概要

MineAdmin は、Vite ベースの自動インポートシステムを採用し、`unplugin-auto-import` および `unplugin-vue-components` プラグインを介して、開発体験を大幅に簡素化し、ボイラープレートコードを削減します。開発者は、一般的な Vue API、コンポーネント、およびカスタムユーティリティ関数を手動でインポートする必要がありません。

## 自動インポートの範囲

::: tip 自動インポート一覧
`*.vue、*.ts、*.tsx` ファイルを開発する際、以下の内容は手動でインポートする必要はありません：

**コアフレームワーク API**
- Vue 3 の全 API (`ref`, `reactive`, `computed`, `watch` など)
- Vue Router API (`useRouter`, `useRoute` など)
- Pinia API (`defineStore`, `storeToRefs` など)

**プロジェクト固有モジュール**
- すべての Store モジュール：`./src/store/modules/*`
- 自動インポートされる Hooks：`./src/hooks/auto-imports/*`
- グローバルコンポーネント：`./src/components/*` (`.vue` ファイルのみ)
:::

### 自動インポートと手動インポートの違い

MineAdmin プロジェクトの hooks は 2 つのカテゴリに分類されます：

| タイプ | 場所 | インポート方法 | 使用シナリオ |
|------|------|----------|----------|
| 自動インポート Hooks | `src/hooks/auto-imports/` | import 不要 | グローバル共通ユーティリティ関数 |
| 手動インポート Hooks | `src/hooks/` | import 必要 | 特定シナリオのユーティリティ関数 |

## 設定の詳細

### 自動インポート API 設定

`./vite/auto-import.ts` 設定ファイルは、API と関数の自動インポートを担当します：

```typescript
import autoImport from 'unplugin-auto-import/vite'

export default function createAutoImport() {
  return autoImport({
    // プリセットのパッケージインポート
    imports: [
      'vue',          // Vue 3 APIs
      'vue-router',   // Vue Router APIs  
      'pinia',        // Pinia APIs
    ],
    
    // 生成される型定義ファイル
    dts: './types/auto-imports.d.ts',
    
    // カスタムディレクトリスキャン
    dirs: [
      './src/hooks/auto-imports/**',  // 自動インポートされるユーティリティ関数
      './src/store/modules/**',       // Pinia stores
    ],
  })
}
```

### 自動インポートコンポーネント設定

`./vite/components.ts` 設定ファイルは、Vue コンポーネントの自動インポートを担当します：

```typescript
import components from 'unplugin-vue-components/vite'

export default function createComponents() {
  return components({
    dirs: ['src/components'],                    // コンポーネントスキャンディレクトリ
    include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/], // サポートするファイルタイプ
    dts: './types/components.d.ts',              // 生成される型定義ファイル
  })
}
```

## 実際の使用例

### 1. Vue コンポーネントでの自動インポートの使用

```vue
<template>
  <div>
    <el-button @click="handleClick">{{ $t('common.submit') }}</el-button>
    <ma-svg-icon name="user" />
  </div>
</template>

<script setup lang="ts">
// 以下をインポートする必要はありません：
// import { ref, computed } from 'vue'
// import { useRouter } from 'vue-router'
// import { useMenuStore } from '@/store/modules/useMenuStore'
// import useDayjs from '@/hooks/auto-imports/useDayjs'
// import useTrans from '@/hooks/auto-imports/useTrans'

// Vue API を直接使用
const count = ref(0)
const doubleCount = computed(() => count.value * 2)

// Vue Router を直接使用
const router = useRouter()

// 自動インポートされた Store を直接使用
const menuStore = useMenuStore()

// 自動インポートされたユーティリティ関数を直接使用
const dayjs = useDayjs()
const { $t } = useTrans()

const handleClick = () => {
  count.value++
  console.log('現在時刻:', dayjs().format('YYYY-MM-DD HH:mm:ss'))
}
</script>
```

### 2. 自動インポートユーティリティ関数の例

`useDayjs.ts` を例に、自動インポートユーティリティ関数の実装を示します：

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

コンポーネント内で直接使用：

```typescript
// インポート不要で直接使用
const currentTime = useDayjs().format('YYYY-MM-DD HH:mm:ss')
const relativeTime = useDayjs('2023-01-01').fromNow()
```

### 3. Store 自動インポートの例

Store モジュールも自動インポートされます：

```typescript
// src/store/modules/useMenuStore.ts  
import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', () => {
  const menus = ref([])
  
  const getMenus = () => {
    // メニューデータを取得するロジック
  }
  
  return { menus, getMenus }
})
```

コンポーネント内での使用：

```vue
<script setup lang="ts">
// useMenuStore をインポートする必要はなく、直接使用
const menuStore = useMenuStore()
const { menus } = storeToRefs(menuStore)

onMounted(() => {
  menuStore.getMenus()
})
</script>
```

## プロジェクト構造の詳細

```
src/
├── hooks/
│   ├── auto-imports/          # 自動インポートされるユーティリティ関数
│   │   ├── useDayjs.ts       # 日付処理ユーティリティ
│   │   ├── useGlobal.ts      # グローバル設定ユーティリティ
│   │   ├── useHttp.ts        # HTTP リクエストユーティリティ
│   │   └── useTrans.ts       # 国際化ユーティリティ
│   │
│   └── useCache.ts           # 手動インポート用ユーティリティ関数
│   └── useDialog.ts
│   └── useDrawer.ts
│
├── store/modules/             # 自動インポートされる Store モジュール
│   ├── useDictStore.ts       # 辞書データ Store
│   ├── useMenuStore.ts       # メニューデータ Store
│   └── useKeepAliveStore.ts  # ページキャッシュ Store
│
└── components/               # 自動インポートされるグローバルコンポーネント
    ├── ma-svg-icon/         # SVG アイコンコンポーネント
    ├── ma-upload-image/     # 画像アップロードコンポーネント
    └── ma-dialog/           # ダイアログコンポーネント
```

## 型定義ファイル

自動インポートシステムは、2 つの重要な型定義ファイルを生成します：

### 1. auto-imports.d.ts

```typescript
// types/auto-imports.d.ts
declare global {
  const ref: typeof import('vue')['ref']
  const computed: typeof import('vue')['computed']
  const useRouter: typeof import('vue-router')['useRouter']
  const useDayjs: typeof import('../src/hooks/auto-imports/useDayjs')['default']
  const useMenuStore: typeof import('../src/store/modules/useMenuStore')['useMenuStore']
  // ... その他の自動インポート宣言
}
```

### 2. components.d.ts

```typescript
// types/components.d.ts
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    MaSvgIcon: typeof import('../src/components/ma-svg-icon/index.vue')['default']
    MaUploadImage: typeof import('../src/components/ma-upload-image/index.vue')['default']
    // ... その他のコンポーネント宣言
  }
}
```

## ベストプラクティス

### 1. 自動インポートユーティリティ関数の整理

汎用ユーティリティ関数は `src/hooks/auto-imports/` ディレクトリに配置します：

```typescript
// ✅ 自動インポートに適したユーティリティ関数
export default function useGlobal() {
  // グローバル設定に関するユーティリティ関数
  return {
    getAppVersion: () => import.meta.env.VITE_APP_VERSION,
    isProduction: () => import.meta.env.PROD
  }
}
```

### 2. 手動インポートの使用タイミング

特定のシナリオでは手動インポートを推奨します：

```typescript
// ✅ 手動インポートに適したユーティリティ関数
// src/hooks/useDialog.ts
export function useDialog() {
  // ダイアログに関する特定のロジック
  // 必要なコンポーネントでのみインポートして使用
}
```

### 3. コンポーネント命名規則

自動インポートされるコンポーネントは PascalCase に従います：

```vue
<template>
  <!-- ✅ 正しいコンポーネントの使用方法 -->
  <MaSvgIcon name="user" />
  <MaUploadImage v-model="imageUrl" />
  
  <!-- ❌ 誤った使用方法 -->
  <ma-svg-icon name="user" />
</template>
```

## パフォーマンス最適化

### 1. オンデマンド読み込み

自動インポートシステムはオンデマンド読み込みをサポートしており、未使用の API とコンポーネントはバンドルされません：

```typescript
// 実際に使用する API のみがインポートされる
const count = ref(0)        // ref はインポートされる
// const state = reactive({}) // reactive はインポートされない（未使用）
```

### 2. Tree Shaking

Vite の Tree Shaking 機能と組み合わせることで、バンドルサイズをさらに最適化できます：

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      treeshake: true, // Tree Shaking を有効化
    },
  },
})
```

## トラブルシューティング

### 1. 型定義ファイルが生成されない

型定義ファイルが自動生成されない場合、以下の解決策を試してください：

```bash
# 既存の型ファイルを削除して再構築
rm -rf types/auto-imports.d.ts types/components.d.ts
pnpm run dev
```

### 2. IDE 型ヒントの問題

`tsconfig.json` に生成された型定義ファイルが含まれていることを確認してください：

```json
{
  "compilerOptions": {
    "types": ["./types/auto-imports.d.ts", "./types/components.d.ts"]
  },
  "include": ["types/**/*"]
}
```

### 3. コンポーネントが自動インポートできない

コンポーネントファイル構造を確認してください：

```
src/components/ma-svg-icon/
├── index.vue        # ✅ メインコンポーネントファイル
└── types.ts         # その他の補助ファイル
```

### 4. 自動インポートのデバッグ

開発モードで生成された型ファイルを確認します：

```bash
# 自動インポートされた API を確認
cat types/auto-imports.d.ts

# 自動インポートされたコンポーネントを確認
cat types/components.d.ts
```

## 拡張設定

### サードパーティライブラリの自動インポート追加

```typescript
// vite/auto-import.ts
export default function createAutoImport() {
  return autoImport({
    imports: [
      'vue',
      'vue-router',
      'pinia',
      // カスタムライブラリを追加
      {
        'lodash-es': ['debounce', 'throttle'],
        '@vueuse/core': ['useLocalStorage', 'useSessionStorage'],
      },
    ],
    // ...その他の設定
  })
}
```

### カスタムコンポーネントライブラリの統合

```typescript
// vite/components.ts
export default function createComponents() {
  return components({
    dirs: ['src/components'],
    // サードパーティコンポーネントライブラリの自動インポートを追加
    resolvers: [
      // Element Plus コンポーネントの自動インポート
      ElementPlusResolver(),
    ],
    // ...その他の設定
  })
}
```