# 工具欄擴充套件

:::tip 提示
右上角一排圖示按鈕，就是工具欄，系統開放了介面可以擴充套件工具欄。工具欄系統基於元件化架構，支援動態新增、移除和管理各種工具。
:::

![工具欄](https://s21.ax1x.com/2024/10/24/pAwKsvq.jpg)

## 系統架構

工具欄系統的核心實現位於以下檔案中：

- **主要實現**: [`web/src/utils/toolbars.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/src/utils/toolbars.ts) (本地: `/web/src/utils/toolbars.ts`)
- **型別定義**: [`web/types/global.d.ts#L319-327`](https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts#L319-327) (本地: `/web/types/global.d.ts:319`)
- **全域性註冊**: [`web/src/bootstrap.ts#L85`](https://github.com/mineadmin/mineadmin/blob/master/web/src/bootstrap.ts#L85) (本地: `/web/src/bootstrap.ts:85`)
- **外掛示例**: [`web/src/plugins/mine-admin/demo/index.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/src/plugins/mine-admin/demo/index.ts) (本地: `/web/src/plugins/mine-admin/demo/index.ts`)

## 預設工具欄

系統內建了以下預設工具欄：

| 工具名稱 | 功能描述 | 圖示 | 元件位置 |
|---------|---------|------|----------|
| search | 全域性搜尋 | `heroicons:magnifying-glass-20-solid` | `@/layouts/components/bars/toolbar/components/search.tsx` |
| notification | 訊息通知 | `heroicons:bell` | `@/layouts/components/bars/toolbar/components/notification.tsx` |
| translate | 語言切換 | `heroicons:language-20-solid` | `@/layouts/components/bars/toolbar/components/translate.tsx` |
| fullscreen | 全屏切換 | `mingcute:fullscreen-line` | `@/layouts/components/bars/toolbar/components/fullscreen.tsx` |
| switchMode | 主題切換 | `lets-icons:color-mode-light` | `@/layouts/components/bars/toolbar/components/switch-mode.tsx` |
| settings | 系統設定 | `heroicons:cog-solid` | `@/layouts/components/bars/toolbar/components/settings.tsx` |

## 獲取工具欄例項

::: code-group

```vue [useGlobal() 方式]
<!-- 在 `setup()` 生命週期或者可以獲取到 `Vue上下文` 中的程式碼裡獲取方式 -->
<script setup lang="ts">
import { useGlobal } from '@/hooks/useGlobal'

const toolbar = useGlobal().$toolbars
</script>
```

```ts [透過 Vue 例項獲取]
import { getCurrentInstance } from 'vue'

// 通過當前例項獲取
const { appContext } = getCurrentInstance()
const toolbar = appContext.config.globalProperties.$toolbars
```

```ts [外掛內獲取方法]
import type { App } from 'vue'
import type { MineToolbarExpose } from '#/global'

/**
 * 系統外掛 `install` 方法，外部會傳入 Vue 例項，然後獲取 toolbar
 * 參考: web/src/plugins/mine-admin/demo/index.ts
 **/
function install(app: App) {
  const toolbar = app.config.globalProperties.$toolbars as MineToolbarExpose
  // 在這裡可以新增自定義工具欄
}
```
:::

## API 介面

### MineToolbarExpose 型別

完整的工具欄 API 介面定義如下（來源：[`web/types/global.d.ts#L329-336`](https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts#L329-336)）：

```ts
interface MineToolbarExpose {
  state: Ref<boolean>                    // 工具欄狀態
  defaultToolbars: Ref<MineToolbar[]>    // 預設工具欄列表
  toolbars: Ref<MineToolbar[]>          // 當前工具欄列表
  getShowToolbar: () => MineToolbar[]   // 獲取顯示的工具欄
  add: (toolbar: MineToolbar) => void   // 新增工具欄
  remove: (name: string) => void        // 移除工具欄
  render: () => Promise<any[]>          // 渲染工具欄
}
```

### API 方法詳解

| API | 型別 | 說明 | 返回值 |
|-----|------|------|--------|
| `state` | `Ref<boolean>` | 工具欄整體顯示狀態 | `boolean` |
| `defaultToolbars` | `Ref<MineToolbar[]>` | 系統預設工具欄（只讀） | `MineToolbar[]` |
| `toolbars` | `Ref<MineToolbar[]>` | 當前註冊的所有工具欄 | `MineToolbar[]` |
| `getShowToolbar()` | `Function` | 獲取當前啟用並顯示的工具欄 | `MineToolbar[]` |
| `add(toolbar)` | `Function` | 向工具欄註冊新工具 | `void` |
| `remove(name)` | `Function` | 移除指定名稱的工具欄 | `void` |
| `render()` | `Function` | 渲染工具欄元件（內部使用） | `Promise<any[]>` |

## MineToolbar 型別定義

工具欄項的完整型別定義（來源：[`web/types/global.d.ts#L319-327`](https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts#L319-327)）：

```ts
interface MineToolbar {
  name: string                          // 工具唯一識別符號
  icon: string                          // 圖示名稱（支援多種圖示庫）
  title: string | (() => string)        // 工具標題，支援函式動態返回
  show: boolean                         // 是否顯示該工具
  className?: string | (() => string)   // 自定義CSS類名
  component?: () => any                 // 自定義元件（與handle互斥）
  handle?: (toolbar: MineToolbar) => any // 點選處理函式（與component互斥）
}
```

### 屬性說明

- **name**: 工具的唯一標識，用於識別和管理工具
- **icon**: 圖示名稱，支援 heroicons、mingcute 等圖示庫
- **title**: 工具提示文字，支援國際化函式
- **show**: 控制工具是否在工具欄中顯示
- **className**: 可選的CSS類名，用於自定義樣式
- **component**: 自定義Vue元件，用於複雜的工具實現
- **handle**: 簡單的點選處理函式，用於快速功能實現

:::warning 注意
`handle` 和 `component` 屬性是互斥的。如果同時定義，`handle` 優先順序更高，`component` 將被忽略。
:::

## 擴充套件工具欄

### 簡單工具擴充套件

新增一個帶有簡單點選事件的工具：

```ts
const toolbar = useGlobal().$toolbars

// 新增一個簡單的提示工具
toolbar.add({
  name: 'simple-alert',
  title: '簡單提示',
  show: true,
  icon: 'heroicons:information-circle',
  handle: (toolbar) => {
    console.log('點選了工具:', toolbar.name)
    alert('這是一個簡單的工具擴充套件！')
  }
})
```

### 元件化工具擴充套件

新增一個使用自定義元件的複雜工具：

```ts
const toolbar = useGlobal().$toolbars

// 新增一個元件化工具
toolbar.add({
  name: 'custom-component',
  title: '自定義元件',
  show: true,
  icon: 'heroicons:puzzle-piece',
  // 注意：使用 component 時不要定義 handle
  component: () => import('@/components/custom-toolbar-item.vue')
})
```

### 動態工具欄

根據條件動態顯示工具：

```ts
const toolbar = useGlobal().$toolbars
const userStore = useUserStore()

// 新增管理員專用工具
toolbar.add({
  name: 'admin-panel',
  title: () => userStore.hasPermission('admin') ? '管理面板' : '無許可權',
  show: userStore.hasPermission('admin'),
  icon: 'heroicons:cog-8-tooth',
  className: () => userStore.hasPermission('admin') ? 'admin-tool' : 'disabled-tool',
  handle: () => {
    if (userStore.hasPermission('admin')) {
      // 開啟管理面板
      router.push('/admin/panel')
    } else {
      message.warning('您沒有管理員許可權')
    }
  }
})
```

### 外掛中的工具欄擴充套件

在外掛開發中擴充套件工具欄（參考：[`web/src/plugins/mine-admin/demo/index.ts#L19-26`](https://github.com/mineadmin/mineadmin/blob/master/web/src/plugins/mine-admin/demo/index.ts#L19-26)）：

```ts
import type { Plugin, MineToolbarExpose } from '#/global'
import Message from 'vue-m-message'

const pluginConfig: Plugin.PluginConfig = {
  install(app) {
    const $toolbars = app.config.globalProperties.$toolbars as MineToolbarExpose
    
    // 外掛擴充套件的工具欄
    $toolbars.add({
      name: 'plugin-demo',
      title: '外掛演示',
      show: true,
      icon: 'heroicons:archive-box',
      handle: () => Message.info('我是在外掛中擴充套件的工具欄！')
    })
  }
}

export default pluginConfig
```

## 移除工具欄

### 移除單個工具

```ts
const toolbar = useGlobal().$toolbars

// 移除指定名稱的工具
toolbar.remove('test')
```

### 批次移除工具

```ts
const toolbar = useGlobal().$toolbars
const toolsToRemove = ['tool1', 'tool2', 'tool3']

// 批次移除
toolsToRemove.forEach(name => {
  toolbar.remove(name)
})
```

## 最佳實踐

### 命名規範

- 使用有意義的名稱：`user-profile` 而不是 `tool1`
- 使用短橫線分隔：`admin-panel` 而不是 `adminPanel`
- 避免與系統預設工具重名

### 圖示選擇

系統支援多種圖示庫，推薦使用：
- **Heroicons**: `heroicons:user-circle`
- **Mingcute**: `mingcute:settings-line`
- **Tabler**: `tabler:dashboard`

### 效能考慮

- 使用 `component` 時，利用動態匯入進行程式碼分割
- 避免在 `handle` 函式中執行重操作
- 合理設定 `show` 屬性，減少不必要的渲染

### 使用者體驗

- 提供清晰的 `title` 描述工具功能
- 使用一致的圖示風格
- 考慮不同許可權使用者的使用場景

## 常見問題

### Q: 工具欄不顯示？

**A**: 檢查以下幾點：
1. `show` 屬性是否設定為 `true`
2. 工具名稱是否與現有工具重複
3. 是否正確獲取了 `$toolbars` 例項

### Q: `handle` 和 `component` 同時定義了會怎樣？

**A**: `handle` 優先順序更高，`component` 會被忽略。建議只定義其中一個。

### Q: 如何除錯工具欄問題？

**A**: 在瀏覽器開發者工具中：
```js
// 檢視當前所有工具欄
console.log(window.__vue_app__.config.globalProperties.$toolbars.toolbars.value)

// 檢視顯示的工具欄
console.log(window.__vue_app__.config.globalProperties.$toolbars.getShowToolbar())
```

### Q: 工具欄許可權控制？

**A**: 利用 `show` 屬性和許可權系統：
```ts
const userStore = useUserStore()

toolbar.add({
  name: 'admin-only',
  title: '管理功能',
  show: userStore.hasRole('admin'), // 基於許可權顯示
  icon: 'heroicons:shield-check',
  handle: () => { /* 管理功能 */ }
})
```

## 原始碼參考

- **核心實現**: [`web/src/utils/toolbars.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/src/utils/toolbars.ts)
- **型別定義**: [`web/types/global.d.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts#L319-336) 
- **預設元件**: [`web/src/layouts/components/bars/toolbar/components/`](https://github.com/mineadmin/mineadmin/tree/master/web/src/layouts/components/bars/toolbar/components)
- **外掛示例**: [`web/src/plugins/mine-admin/demo/index.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/src/plugins/mine-admin/demo/index.ts)
- **全域性註冊**: [`web/src/bootstrap.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/src/bootstrap.ts#L85)