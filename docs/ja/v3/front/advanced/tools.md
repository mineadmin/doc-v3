# ツールバー拡張

:::tip ヒント
右上隅のアイコンボタンの列がツールバーです。システムはツールバーを拡張するためのインターフェースを公開しています。ツールバーシステムはコンポーネントベースのアーキテクチャに基づいており、動的な追加、削除、管理をサポートしています。
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
| notification | メッセージ通知 | `heroicons:bell` | `@/layouts/components/bars/toolbar/components/notification.tsx` |
| translate | 言語切り替え | `heroicons:language-20-solid` | `@/layouts/components/bars/toolbar/components/translate.tsx` |
| fullscreen | 全画面切り替え | `mingcute:fullscreen-line` | `@/layouts/components/bars/toolbar/components/fullscreen.tsx` |
| switchMode | テーマ切り替え | `lets-icons:color-mode-light` | `@/layouts/components/bars/toolbar/components/switch-mode.tsx` |
| settings | システム設定 | `heroicons:cog-solid` | `@/layouts/components/bars/toolbar/components/settings.tsx` |

## ツールバーインスタンスの取得

::: code-group

```vue [useGlobal() 方式]
<!-- `setup()` ライフサイクルまたは `Vueコンテキスト` が取得可能なコード内での取得方法 -->
<script setup lang="ts">
import { useGlobal } from '@/hooks/useGlobal'

const toolbar = useGlobal().$toolbars
</script>
```

```ts [Vue インスタンス経由での取得]
import { getCurrentInstance } from 'vue'

// 現在のインスタンス経由で取得
const { appContext } = getCurrentInstance()
const toolbar = appContext.config.globalProperties.$toolbars
```

```ts [プラグイン内での取得方法]
import type { App } from 'vue'
import type { MineToolbarExpose } from '#/global'

/**
 * システムプラグイン `install` メソッド、外部から Vue インスタンスが渡され、toolbar を取得
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
  state: Ref<boolean>                    // ツールバーの状態
  defaultToolbars: Ref<MineToolbar[]>    // デフォルトツールバーリスト
  toolbars: Ref<MineToolbar[]>          // 現在のツールバーリスト
  getShowToolbar: () => MineToolbar[]   // 表示されているツールバーを取得
  add: (toolbar: MineToolbar) => void   // ツールバーを追加
  remove: (name: string) => void        // ツールバーを削除
  render: () => Promise<any[]>          // ツールバーをレンダリング
}
```

### API メソッド詳細

| API | 型 | 説明 | 戻り値 |
|-----|------|------|--------|
| `state` | `Ref<boolean>` | ツールバー全体の表示状態 | `boolean` |
| `defaultToolbars` | `Ref<MineToolbar[]>` | システムデフォルトツールバー（読み取り専用） | `MineToolbar[]` |
| `toolbars` | `Ref<MineToolbar[]>` | 現在登録されている全ツールバー | `MineToolbar[]` |
| `getShowToolbar()` | `Function` | 現在有効で表示されているツールバーを取得 | `MineToolbar[]` |
| `add(toolbar)` | `Function` | ツールバーに新しいツールを登録 | `void` |
| `remove(name)` | `Function` | 指定された名前のツールバーを削除 | `void` |
| `render()` | `Function` | ツールバーコンポーネントをレンダリング（内部使用） | `Promise<any[]>` |

## MineToolbar 型定義

ツールバー項目の完全な型定義（出典：[`web/types/global.d.ts#L319-327`](https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts#L319-327)）：

```ts
interface MineToolbar {
  name: string                          // ツールの一意識別子
  icon: string                          // アイコン名（複数のアイコンライブラリをサポート）
  title: string | (() => string)        // ツールのタイトル、関数による動的返却をサポート
  show: boolean                         // ツールを表示するかどうか
  className?: string | (() => string)   // カスタムCSSクラス名
  component?: () => any                 // カスタムコンポーネント（handleと排他）
  handle?: (toolbar: MineToolbar) => any // クリック処理関数（componentと排他）
}
```

### プロパティ説明

- **name**: ツールの一意識別子。ツールの識別と管理に使用
- **icon**: アイコン名。heroicons、mingcute などのアイコンライブラリをサポート
- **title**: ツールのヒントテキスト。国際化関数をサポート
- **show**: ツールをツールバーに表示するかどうかを制御
- **className**: オプションのCSSクラス名。カスタムスタイルに使用
- **component**: カスタムVueコンポーネント。複雑なツール実装に使用
- **handle**: シンプルなクリック処理関数。クイック機能実装に使用

:::warning 注意
`handle` と `component` プロパティは排他的です。両方を定義した場合、`handle` の優先度が高く、`component` は無視されます。
:::

## ツールバーの拡張

### シンプルなツール拡張

シンプルなクリックイベントを持つツールを追加：

```ts
const toolbar = useGlobal().$toolbars

// シンプルなアラートツールを追加
toolbar.add({
  name: 'simple-alert',
  title: 'シンプルヒント',
  show: true,
  icon: 'heroicons:information-circle',
  handle: (toolbar) => {
    console.log('ツールがクリックされました:', toolbar.name)
    alert('これはシンプルなツール拡張です！')
  }
})
```

### コンポーネントベースのツール拡張

カスタムコンポーネントを使用する複雑なツールを追加：

```ts
const toolbar = useGlobal().$toolbars

// コンポーネントベースのツールを追加
toolbar.add({
  name: 'custom-component',
  title: 'カスタムコンポーネント',
  show: true,
  icon: 'heroicons:puzzle-piece',
  // 注意：component を使用する場合は handle を定義しない
  component: () => import('@/components/custom-toolbar-item.vue')
})
```

### 動的ツールバー

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

### プラグイン内でのツールバー拡張

プラグイン開発でのツールバー拡張（参考：[`web/src/plugins/mine-admin/demo/index.ts#L19-26`](https://github.com/mineadmin/mineadmin/blob/master/web/src/plugins/mine-admin/demo/index.ts#L19-26)）：

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
      handle: () => Message.info('プラグインで拡張されたツールバーです！')
    })
  }
}

export default pluginConfig
```

## ツールバーの削除

### 単一ツールの削除

```ts
const toolbar = useGlobal().$toolbars

// 指定された名前のツールを削除
toolbar.remove('test')
```

### 一括ツールの削除

```ts
const toolbar = useGlobal().$toolbars
const toolsToRemove = ['tool1', 'tool2', 'tool3']

// 一括削除
toolsToRemove.forEach(name => {
  toolbar.remove(name)
})
```

## ベストプラクティス

### 命名規則

- 意味のある名前を使用：`user-profile`（`tool1` ではなく）
- ハイフン区切りを使用：`admin-panel`（`adminPanel` ではなく）
- システムデフォルトツールとの名前重複を避ける

### アイコン選択

システムは複数のアイコンライブラリをサポート。推奨：
- **Heroicons**: `heroicons:user-circle`
- **Mingcute**: `mingcute:settings-line`
- **Tabler**: `tabler:dashboard`

### パフォーマンス考慮

- `component` 使用時は動的インポートでコード分割を活用
- `handle` 関数内で重い処理を実行しない
- `show` プロパティを適切に設定し、不要なレンダリングを削減

### ユーザーエクスペリエンス

- 明確な `title` でツール機能を説明
- 一貫性のあるアイコンスタイルを使用
- 異なる権限ユーザーの使用シナリオを考慮

## よくある質問

### Q: ツールバーが表示されない？

**A**: 以下を確認：
1. `show` プロパティが `true` に設定されているか
2. ツール名が既存のツールと重複していないか
3. `$toolbars` インスタンスが正しく取得できているか

### Q: `handle` と `component` を両方定義するとどうなる？

**A**: `handle` の優先度が高く、`component` は無視されます。どちらか一方のみを定義することを推奨します。

### Q: ツールバーの問題をデバッグするには？

**A**: ブラウザの開発者ツールで：
```js
// 現在の全ツールバーを確認
console.log(window.__vue_app__.config.globalProperties.$toolbars.toolbars.value)

// 表示されているツールバーを確認
console.log(window.__vue_app__.config.globalProperties.$toolbars.getShowToolbar())
```

### Q: ツールバーの権限制御？

**A**: `show` プロパティと権限システムを活用：
```ts
const userStore = useUserStore()

toolbar.add({
  name: 'admin-only',
  title: '管理機能',
  show: userStore.hasRole('admin'), // 権限に基づいて表示
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