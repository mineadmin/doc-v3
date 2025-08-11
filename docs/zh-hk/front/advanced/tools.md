# 工具欄擴展

:::tip 提示
右上角一排圖標按鈕，就是工具欄，系統開放了接口可以擴展工具欄。工具欄系統基於組件化架構，支持動態添加、移除和管理各種工具。
:::

![工具欄](https://s21.ax1x.com/2024/10/24/pAwKsvq.jpg)

## 系統架構

工具欄系統的核心實現位於以下文件中：

- **主要實現**: [`web/src/utils/toolbars.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/src/utils/toolbars.ts) (本地: `/web/src/utils/toolbars.ts`)
- **類型定義**: [`web/types/global.d.ts#L319-327`](https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts#L319-327) (本地: `/web/types/global.d.ts:319`)
- **全局註冊**: [`web/src/bootstrap.ts#L85`](https://github.com/mineadmin/mineadmin/blob/master/web/src/bootstrap.ts#L85) (本地: `/web/src/bootstrap.ts:85`)
- **插件示例**: [`web/src/plugins/mine-admin/demo/index.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/src/plugins/mine-admin/demo/index.ts) (本地: `/web/src/plugins/mine-admin/demo/index.ts`)

## 默認工具欄

系統內置了以下默認工具欄：

| 工具名稱 | 功能描述 | 圖標 | 組件位置 |
|---------|---------|------|----------|
| search | 全局搜索 | `heroicons:magnifying-glass-20-solid` | `@/layouts/components/bars/toolbar/components/search.tsx` |
| notification | 消息通知 | `heroicons:bell` | `@/layouts/components/bars/toolbar/components/notification.tsx` |
| translate | 語言切換 | `heroicons:language-20-solid` | `@/layouts/components/bars/toolbar/components/translate.tsx` |
| fullscreen | 全屏切換 | `mingcute:fullscreen-line` | `@/layouts/components/bars/toolbar/components/fullscreen.tsx` |
| switchMode | 主題切換 | `lets-icons:color-mode-light` | `@/layouts/components/bars/toolbar/components/switch-mode.tsx` |
| settings | 系統設置 | `heroicons:cog-solid` | `@/layouts/components/bars/toolbar/components/settings.tsx` |

## 獲取工具欄實例

::: code-group

```vue [useGlobal() 方式]
<!-- 在 `setup()` 生命週期或者可以獲取到 `Vue上下文` 中的代碼裏獲取方式 -->
<script setup lang="ts">
import { useGlobal } from '@/hooks/useGlobal'

const toolbar = useGlobal().$toolbars
</script>
```

```ts [通過 Vue 實例獲取]
import { getCurrentInstance } from 'vue'

// 通過當前實例獲取
const { appContext } = getCurrentInstance()
const toolbar = appContext.config.globalProperties.$toolbars
```

```ts [插件內獲取方法]
import type { App } from 'vue'
import type { MineToolbarExpose } from '#/global'

/**
 * 系統插件 `install` 方法，外部會傳入 Vue 實例，然後獲取 toolbar
 * 參考: web/src/plugins/mine-admin/demo/index.ts
 **/
function install(app: App) {
  const toolbar = app.config.globalProperties.$toolbars as MineToolbarExpose
  // 在這裏可以添加自定義工具欄
}
```
:::

## API 接口

### MineToolbarExpose 類型

完整的工具欄 API 接口定義如下（來源：[`web/types/global.d.ts#L329-336`](https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts#L329-336)）：

```ts
interface MineToolbarExpose {
  state: Ref<boolean>                    // 工具欄狀態
  defaultToolbars: Ref<MineToolbar[]>    // 默認工具欄列表
  toolbars: Ref<MineToolbar[]>          // 當前工具欄列表
  getShowToolbar: () => MineToolbar[]   // 獲取顯示的工具欄
  add: (toolbar: MineToolbar) => void   // 添加工具欄
  remove: (name: string) => void        // 移除工具欄
  render: () => Promise<any[]>          // 渲染工具欄
}
```

### API 方法詳解

| API | 類型 | 説明 | 返回值 |
|-----|------|------|--------|
| `state` | `Ref<boolean>` | 工具欄整體顯示狀態 | `boolean` |
| `defaultToolbars` | `Ref<MineToolbar[]>` | 系統默認工具欄（只讀） | `MineToolbar[]` |
| `toolbars` | `Ref<MineToolbar[]>` | 當前註冊的所有工具欄 | `MineToolbar[]` |
| `getShowToolbar()` | `Function` | 獲取當前啓用並顯示的工具欄 | `MineToolbar[]` |
| `add(toolbar)` | `Function` | 向工具欄註冊新工具 | `void` |
| `remove(name)` | `Function` | 移除指定名稱的工具欄 | `void` |
| `render()` | `Function` | 渲染工具欄組件（內部使用） | `Promise<any[]>` |

## MineToolbar 類型定義

工具欄項的完整類型定義（來源：[`web/types/global.d.ts#L319-327`](https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts#L319-327)）：

```ts
interface MineToolbar {
  name: string                          // 工具唯一標識符
  icon: string                          // 圖標名稱（支持多種圖標庫）
  title: string | (() => string)        // 工具標題，支持函數動態返回
  show: boolean                         // 是否顯示該工具
  className?: string | (() => string)   // 自定義CSS類名
  component?: () => any                 // 自定義組件（與handle互斥）
  handle?: (toolbar: MineToolbar) => any // 點擊處理函數（與component互斥）
}
```

### 屬性説明

- **name**: 工具的唯一標識，用於識別和管理工具
- **icon**: 圖標名稱，支持 heroicons、mingcute 等圖標庫
- **title**: 工具提示文本，支持國際化函數
- **show**: 控制工具是否在工具欄中顯示
- **className**: 可選的CSS類名，用於自定義樣式
- **component**: 自定義Vue組件，用於複雜的工具實現
- **handle**: 簡單的點擊處理函數，用於快速功能實現

:::warning 注意
`handle` 和 `component` 屬性是互斥的。如果同時定義，`handle` 優先級更高，`component` 將被忽略。
:::

## 擴展工具欄

### 簡單工具擴展

添加一個帶有簡單點擊事件的工具：

```ts
const toolbar = useGlobal().$toolbars

// 添加一個簡單的提示工具
toolbar.add({
  name: 'simple-alert',
  title: '簡單提示',
  show: true,
  icon: 'heroicons:information-circle',
  handle: (toolbar) => {
    console.log('點擊了工具:', toolbar.name)
    alert('這是一個簡單的工具擴展！')
  }
})
```

### 組件化工具擴展

添加一個使用自定義組件的複雜工具：

```ts
const toolbar = useGlobal().$toolbars

// 添加一個組件化工具
toolbar.add({
  name: 'custom-component',
  title: '自定義組件',
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

// 添加管理員專用工具
toolbar.add({
  name: 'admin-panel',
  title: () => userStore.hasPermission('admin') ? '管理面板' : '無權限',
  show: userStore.hasPermission('admin'),
  icon: 'heroicons:cog-8-tooth',
  className: () => userStore.hasPermission('admin') ? 'admin-tool' : 'disabled-tool',
  handle: () => {
    if (userStore.hasPermission('admin')) {
      // 打開管理面板
      router.push('/admin/panel')
    } else {
      message.warning('您沒有管理員權限')
    }
  }
})
```

### 插件中的工具欄擴展

在插件開發中擴展工具欄（參考：[`web/src/plugins/mine-admin/demo/index.ts#L19-26`](https://github.com/mineadmin/mineadmin/blob/master/web/src/plugins/mine-admin/demo/index.ts#L19-26)）：

```ts
import type { Plugin, MineToolbarExpose } from '#/global'
import Message from 'vue-m-message'

const pluginConfig: Plugin.PluginConfig = {
  install(app) {
    const $toolbars = app.config.globalProperties.$toolbars as MineToolbarExpose
    
    // 插件擴展的工具欄
    $toolbars.add({
      name: 'plugin-demo',
      title: '插件演示',
      show: true,
      icon: 'heroicons:archive-box',
      handle: () => Message.info('我是在插件中擴展的工具欄！')
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

### 批量移除工具

```ts
const toolbar = useGlobal().$toolbars
const toolsToRemove = ['tool1', 'tool2', 'tool3']

// 批量移除
toolsToRemove.forEach(name => {
  toolbar.remove(name)
})
```

## 最佳實踐

### 命名規範

- 使用有意義的名稱：`user-profile` 而不是 `tool1`
- 使用短橫線分隔：`admin-panel` 而不是 `adminPanel`
- 避免與系統默認工具重名

### 圖標選擇

系統支持多種圖標庫，推薦使用：
- **Heroicons**: `heroicons:user-circle`
- **Mingcute**: `mingcute:settings-line`
- **Tabler**: `tabler:dashboard`

### 性能考慮

- 使用 `component` 時，利用動態導入進行代碼分割
- 避免在 `handle` 函數中執行重操作
- 合理設置 `show` 屬性，減少不必要的渲染

### 用户體驗

- 提供清晰的 `title` 描述工具功能
- 使用一致的圖標風格
- 考慮不同權限用户的使用場景

## 常見問題

### Q: 工具欄不顯示？

**A**: 檢查以下幾點：
1. `show` 屬性是否設置為 `true`
2. 工具名稱是否與現有工具重複
3. 是否正確獲取了 `$toolbars` 實例

### Q: `handle` 和 `component` 同時定義了會怎樣？

**A**: `handle` 優先級更高，`component` 會被忽略。建議只定義其中一個。

### Q: 如何調試工具欄問題？

**A**: 在瀏覽器開發者工具中：
```js
// 查看當前所有工具欄
console.log(window.__vue_app__.config.globalProperties.$toolbars.toolbars.value)

// 查看顯示的工具欄
console.log(window.__vue_app__.config.globalProperties.$toolbars.getShowToolbar())
```

### Q: 工具欄權限控制？

**A**: 利用 `show` 屬性和權限系統：
```ts
const userStore = useUserStore()

toolbar.add({
  name: 'admin-only',
  title: '管理功能',
  show: userStore.hasRole('admin'), // 基於權限顯示
  icon: 'heroicons:shield-check',
  handle: () => { /* 管理功能 */ }
})
```

## 源碼參考

- **核心實現**: [`web/src/utils/toolbars.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/src/utils/toolbars.ts)
- **類型定義**: [`web/types/global.d.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts#L319-336) 
- **默認組件**: [`web/src/layouts/components/bars/toolbar/components/`](https://github.com/mineadmin/mineadmin/tree/master/web/src/layouts/components/bars/toolbar/components)
- **插件示例**: [`web/src/plugins/mine-admin/demo/index.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/src/plugins/mine-admin/demo/index.ts)
- **全局註冊**: [`web/src/bootstrap.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/src/bootstrap.ts#L85)