# ツールバー拡張

:::tip ヒント
右上隅の一連のアイコンボタンがツールバーです。システムはツールバーを拡張するためのインターフェースを提供しています。
:::
![ツールバー](https://s21.ax1x.com/2024/10/24/pAwKsvq.jpg)

## ツールバーヘルパー関数インスタンスの取得

::: code-group

```vue [useGlobal() 方式]
<!-- `setup()` ライフサイクルまたは `Vueコンテキスト` を取得できるコード内での取得方法 -->
<script setup lang="ts">
const toolbar = useGlobal().$toolbars
</script>
```

```ts [Vueインスタンス経由で取得]
// 現在のインスタンスから取得
const { appContext } = getCurrentInstance()
const toolbar = appContext.config.globalProperties.$toolbars

```

```ts [プラグイン内での取得方法]
/**
 * システムプラグインの `install` メソッド。外部からVueインスタンスが渡され、toolbarを取得します
 * `src/plugins/mine-admin/demo/index.ts` を参照してください
 **/
install(app: App) {
  const toolbar = app.config.globalProperties.$toolbars
}
```
:::

## toolbar APIリスト
|       API        |               タイプ               |     説明     |      戻り値       |
|:----------------:|:------------------------------:|:----------:|:--------------:|
|  getShowToolbar  |            Function            | 有効なツールリストを取得 | MineToolbar[]  |
|     toolbars     |       Ref<MineToolbar[]>       |  登録済みツールリスト   | MineToolbar[]  |
|  add  | Function(toolbar: MineToolbar) | ツールバーに新規ツールを登録 |      void      |
|  remove  |     Function(name: string)     | ツールバーからツールを削除 |      void      |

## MineToolbar タイプ
```ts
interface MineToolbar {
  name: string
  icon: string
  title: string | (() => string)
  show: boolean
  className?: string | (() => string)
  component?: () => any
  handle?: (toolbar: MineToolbar) => any
}
```
## 新規ツールの登録

:::tip
`handle` イベントと `component` プロパティは競合し、両方が定義されている場合は `handle` が優先されます。
`component` を使用する場合は、`handle` を定義しないかコメントアウトしてください
:::

```ts
const toolbar = useGlobal().$toolbars
toolbar.add({
  name: 'test',
  title: 'テスト',
  show: true,
  icon: 'heroicons:archive-box',
  // ツールがクリックされた時にhandleメソッドがトリガーされ、簡単なアラート表示などに使用可能
  handle: () => alert('私は新しく登録されたツールです'),
  /**
   * コンポーネントを指定し、完全にコンポーネントを通じてレンダリング表示
   * この場合、上記のiconプロパティはレンダリングされず、handleメソッドも無効になります
   * 
   * 注意：実際の開発では、component使用後はhandleをコメントアウトしてください
   **/
  component: () => import('@/modules/demo/views/demo.vue')
})
```

## 登録済みツールの削除

```ts
const toolbar = useGlobal().$toolbars

// nameがtestのツールを削除
toolbar.remove('test')
```