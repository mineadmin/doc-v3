# ツールバー拡張

:::tip ヒント
右上隅の一連のアイコンボタンがツールバーです。システムはツールバーを拡張するためのインターフェースを提供しています。ツールバーシステムはコンポーネントベースのアーキテクチャで、各種ツールの動的な追加、削除、管理をサポートしています。
:::

![ツールバー](https://s21.ax1x.com/2024/10/24/pAwKsvq.jpg)

## システムアーキテクチャ

ツールバーシステムのコア実装は以下のファイルにあります：

- **主要実装**: [`web/src/utils/toolbars.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/src/utils/toolbars.ts) (ローカル: `/web/src/utils/toolbars.ts`)
- **型定義**: [`web/types/global.d.ts#L319-327`](https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts#L319-327) (ローカル: `/web/types/global.d.ts:319`)
- **グローバル登録**: [`web/src/bootstrap.ts#L85`](https://github.com/mineadmin/mineadmin/blob/master/web/src/bootstrap.ts#L85) (ローカル: `/web/src/bootstrap.ts:85`)
- **プラグイン例**: [`web/src/plugins/mine-admin/demo/index.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/src/plugins/mine-admin/demo/index.ts) (ローカル: `/web/src/plugins/mine-admin/demo/index.ts`)

## デフォルトツールバー

システムには以下のデフォルトツールバーが組み込まれています：

| ツール名 | 機能説明 | アイコン | コンポーネント位置 |
|---------|---------|------|----------|
| search | グローバル検索 | `heroicons:magnifying-glass-20-solid` | `@/layouts/components/bars/toolbar/components/search.tsx` |
| notification | 通知 | `heroicons:bell` | `@/layouts/components/bars/toolbar/components/notification.tsx` |
| translate | 言語切替 | `heroicons:language-20-solid` | `@/layouts/components/bars/toolbar/components/translate.tsx` |
| fullscreen | フルスクリーン切替 | `mingcute:fullscreen-line` | `@/layouts/components/bars/toolbar/components/fullscreen.tsx` |
| switchMode | テーマ切替 | `lets-icons:color-mode-light` | `@/layouts/components/bars/toolbar/components/switch-mode.tsx` |
| settings | システム設定 | `heroicons:cog-solid` | `@/layouts/components/bars/toolbar/components/settings.tsx` |

## ツールバーインスタンスの取得

::: code-group

```vue [useGlobal() 方式]
<!-- `setup()` ライフサイクルまたは `Vueコンテキスト` を取得できるコード内での取得方法 -->
<script setup lang="ts">
import { useGlobal } from '@/hooks/useGlobal'

const toolbar = useGlobal().$toolbars
</script>
```

```ts [Vue インスタンス経由で取得]
import { getCurrentInstance } from 'vue'

// 現在のインスタンスから取得
const { appContext } = getCurrentInstance()
const toolbar = appContext.config.globalProperties.$toolbars
```

```ts [プラグイン内での取得方法]
import type { App } from 'vue'
import type { MineToolbarExpose } from '#/global'

/**
 * システムプラグイン `install` メソッド、外部からVueインスタンスが渡され、toolbarを取得
 * 参考: web/src/plugins/mine-admin/demo/index.ts
 **/
function install(app: App) {
  const toolbar = app.config.globalProperties.$toolbars as MineToolbarExpose
  // ここでカスタムツールバーを追加可能
}
```
:::

## API インターフェース

### MineToolbarExpose 型

完全なツールバーAPIインターフェース定義（出典：[`web/types/global.d.ts#L329-336`](https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts#L329-336)）：

```ts
interface MineToolbarExpose {
  state: Ref<boolean>                    // ツールバー状態
  defaultToolbars: Ref<MineToolbar[]>    // デフォルトツールバーリスト
  toolbars: Ref<MineToolbar[]>          // 現在のツールバーリスト
  getShowToolbar: () => MineToolbar[]   // 表示中のツールバー取得
  add: (toolbar: MineToolbar) => void   // ツールバー追加
  remove: (name: string) => void        // ツールバー削除
  render: () => Promise<any[]>          // ツールバーレンダリング
}
```

### API メソッド詳細

| API | 型 | 説明 | 戻り値 |
|-----|------|------|--------|
| `state` | `Ref<boolean>` | ツールバー全体の表示状態 | `boolean` |
| `defaultToolbars` | `Ref<MineToolbar[]>` | システムデフォルトツールバー（読み取り専用） | `MineToolbar[]` |
| `toolbars` | `Ref<MineToolbar[]>` | 現在登録されている全てのツールバー | `MineToolbar[]` |
| `getShowToolbar()` | `Function` | 現在有効で表示中のツールバーを取得 | `MineToolbar[]` |
| `add(toolbar)` | `Function` | ツールバーに新規ツールを登録 | `void` |
| `remove(name)` | `Function` | 指定名称のツールバーを削除 | `void` |
| `render()` | `Function` | ツールバーコンポーネントをレンダリング（内部使用） | `Promise<any[]>` |

## MineToolbar 型定義

ツールバー項目の完全な型定義（出典：[`web/types/global.d.ts#L319-327`](https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts#L319-327)）：

```ts
interface MineToolbar {
  name: string                          // ツール一意識別子
  icon: string                          // アイコン名（複数アイコンライブラリ対応）
  title: string | (() => string)        // ツールチップテキスト、関数で動的返却可能
  show: boolean                         // 当該ツールを表示するか
  className?: string | (() => string)   // カスタムCSSクラス名
  component?: () => any                 // カスタムコンポーネント（handleと排他）
  handle?: (toolbar: MineToolbar) => any // クリック処理関数（componentと排他）
}
```

### 属性説明

- **name**: ツールの一意識別、管理用
- **icon**: アイコン名、heroicons、mingcuteなどのアイコンライブラリ対応
- **title**: ツールチップテキスト、国際化関数対応
- **show**: ツールバーにツールを表示するか制御
- **className**: オプションのCSSクラス名、カスタムスタイル用
- **component**: カスタムVueコンポーネント、複雑なツール実装用
- **handle**: シンプルなクリック処理関数、簡易機能実装用

:::warning 注意
`handle` と `component` 属性は排他的です。両方定義した場合、`handle` が優先され、`component` は無視されます。
:::

## ツールバー拡張

### シンプルツール拡張

シンプルなクリックイベント付きツールを追加：

```ts
const toolbar = useGlobal().$toolbars

// シンプルなアラートツールを追加
toolbar.add({
  name: 'simple-alert',
  title: 'シンプルアラート',
  show: true,
  icon: 'heroicons:information-circle',
  handle: (toolbar) => {
    console.log('ツールをクリック:', toolbar.name)
    alert('これはシンプルなツール拡張です！')
  }
})
```

### コンポーネント化ツール拡張

カスタムコンポーネントを使用する複雑なツールを追加：

```ts
const toolbar = useGlobal().$toolbars

// コンポーネント化ツールを追加
toolbar.add({
  name: 'custom-component',
  title: 'カスタムコンポーネント',
  show: true,
  icon: 'heroicons:puzzle-piece',
  // 注意：component 使用時は handle を定義しない
  component: () => import('@/components/custom-toolbar-item.vue')
})
```

### ダイナミックツールバー

条件に基づいてツールを動的に表示：

```ts
const toolbar = useGlobal().$toolbars
const userStore = useUserStore()

// 管理者専用ツールを追加
toolbar.add({
  name: 'admin-panel',
  title: () => userStore.hasPermission('admin') ? '管理パネル' : '権限なし',
  show: userStore.hasPermission('admin'),
  icon: 'heroicons:cog-8-tooth',
  className: () => userStore.hasPermission('admin') ? 'admin-tool' : 'disabled-tool',
  handle: () => {
    if (userStore.hasPermission('admin')) {
      // 管理パネルを開く
      router.push('/admin/panel')
    } else {
      message.warning('管理者権限がありません')
    }
  }
})
```

### プラグイン内のツールバー拡張

プラグイン開発でツールバーを拡張（参考：[`web/src/plugins/mine-admin/demo/index.ts#L19-26`](https://github.com/mineadmin/mineadmin/blob/master/web/src/plugins/mine-admin/demo/index.ts#L19-26)）：

```ts
import type { Plugin, MineToolbarExpose } from '#/global'
import Message from 'vue-m-message'

const pluginConfig: Plugin.PluginConfig = {
  install(app) {
    const $toolbars = app.config.globalProperties.$toolbars as MineToolbarExpose
    
    // プラグイン拡張のツールバー
    $toolbars.add({
      name: 'plugin-demo',
      title: 'プラグインデモ',
      show: true,
      icon: 'heroicons:archive-box',
      handle: () => Message.info('プラグインで拡張したツールバーです！')
    })
  }
}

export default pluginConfig
```

## ツールバー削除

### 単一ツール削除

```ts
const toolbar = useGlobal().$toolbars

// 指定名称のツールを削除
toolbar.remove('test')
```

### バッチツール削除

```ts
const toolbar = useGlobal().$toolbars
const toolsToRemove = ['tool1', 'tool2', 'tool3']

// バッチ削除
toolsToRemove.forEach(name => {
  toolbar.remove(name)
})
```

## ベストプラクティス

### 命名規則

- 意味のある名前を使用：`user-profile` ではなく `tool1`
- ハイフン区切りを使用：`admin-panel` ではなく `adminPanel`
- システムデフォルトツールとの重複を避ける

### アイコン選択

システムは複数アイコンライブラリをサポート、推奨：
- **Heroicons**: `heroicons:user-circle`
- **Mingcute**: `mingcute:settings-line`
- **Tabler**: `tabler:dashboard`

### パフォーマンス考慮

- `component` 使用時、動的インポートでコード分割を活用
- `handle` 関数で重い処理を実行しない
- `show` 属性を適切に設定し、不要なレンダリングを削減

### ユーザーエクスペリエンス

- 明確な `title` で機能を説明
- 一貫したアイコンスタイルを使用
- 異なる権限ユーザーの使用シナリオを考慮

## よくある質問

### Q: ツールバーが表示されない？

**A**: 以下を確認：
1. `show` 属性が `true` に設定されているか
2. ツール名が既存ツールと重複していないか
3. `$toolbars` インスタンスを正しく取得しているか

### Q: `handle` と `component` を同時定義すると？

**A**: `handle` が優先され、`component` は無視されます。どちらか一方のみ定義を推奨。

### Q: ツールバー問題のデバッグ方法？

**A**: ブラウザ開発者ツールで：
```js
// 現在の全てのツールバーを表示
console.log(window.__vue_app__.config.globalProperties.$toolbars.toolbars.value)

// 表示中のツールバーを表示
console.log(window.__vue_app__.config.globalProperties.$toolbars.getShowToolbar())
```

### Q: ツールバー権限制御？

**A**: `show` 属性と権限システムを活用：
```ts
const userStore = useUserStore()

toolbar.add({
  name: 'admin-only',
  title: '管理機能',
  show: userStore.hasRole('admin'), // 権限に基づき表示
  icon: 'heroicons:shield-check',
  handle: () => { /* 管理機能 */ }
})
```

## ソースコード参考

- **コア実装**: [`web/src/utils/toolbars.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/src/utils/toolbars.ts)
- **型定義**: [`web/types/global.d.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts#L319-336) 
- **デフォルトコンポーネント**: [`web/src/layouts/components/bars/toolbar/components/`](https://github.com/mineadmin/mineadmin/tree/master/web/src/layouts/components/bars/toolbar/components)
- **プラグイン例**: [`web/src/plugins/mine-admin/demo/index.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/src/plugins/mine-admin/demo/index.ts)
- **グローバル登録**: [`web/src/bootstrap.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/src/bootstrap.ts#L85)