# 工具欄擴充套件

:::tip 提示
右上角一排圖示按鈕，就是工具欄，系統開放了介面可以擴充套件工具欄。
:::
![工具欄](https://s21.ax1x.com/2024/10/24/pAwKsvq.jpg)

## 獲取工具欄助手函式例項

::: code-group

```vue [useGlobal() 方式]
<!-- 在 `setup()` 生命週期或者可以獲取到 `Vue上下文` 中的程式碼裡獲取方式 -->
<script setup lang="ts">
const toolbar = useGlobal().$toolbars
</script>
```

```ts [透過 Vue 例項獲取]
// 通過當前例項獲取
const { appContext } = getCurrentInstance()
const toolbar = appContext.config.globalProperties.$toolbars

```

```ts [外掛內獲取方法]
/**
 * 系統外掛 `install` 方法，外部會傳入 Vue 例項，然後獲取 toolbar
 * 可參考 `src/plugins/mine-admin/demo/index.ts`
 **/
install(app: App) {
  const toolbar = app.config.globalProperties.$toolbars
}
```
:::

## toolbar API列表
|       API        |               型別               |     說明     |      返回值       |
|:----------------:|:------------------------------:|:----------:|:--------------:|
|  getShowToolbar  |            Function            | 獲取啟用的工具列表  | MineToolbar[]  |
|     toolbars     |       Ref<MineToolbar[]>       |  註冊的工具列表   | MineToolbar[]  |
|  add  | Function(toolbar: MineToolbar) | 向工具欄註冊新工具  |      void      |
|  remove  |     Function(name: string)     | 移除工具欄註冊的工具 |      void      |

## MineToolbar 型別
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
## 註冊新工具

:::tip
`handle` 事件和 `component` 屬性衝突，兩者只會生效一種，`handle` 優先順序高。
如若使用 `component` 請不要定義 `handle` 或者註釋掉
:::

```ts
const toolbar = useGlobal().$toolbars
toolbar.add({
  name: 'test',
  title: '測試',
  show: true,
  icon: 'heroicons:archive-box',
  // 工具被點選時，觸發 handle 方法，可用於簡單的彈窗提示等等
  handle: () => alert('我是註冊的新工具哦'),
  /**
   * 指定元件，完全透過元件來渲染顯示
   * 同時上面的 icon 屬性將不被渲染，handle 方法也將失效
   * 
   * 注意：實際開發中，在使用 component 後需要將 handle 註釋掉
   **/
  component: () => import('@/modules/demo/views/demo.vue')
})
```

## 移除已註冊的工具

```ts
const toolbar = useGlobal().$toolbars

// 移除 name 為 test 的工具
toolbar.remove('test')
```