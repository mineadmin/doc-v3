# 自動匯入


## 說明
在之前的 `2.x` 以及更古老的版本。

在使用 `Vue API` 的時候，都需要在檔案內寫入 `import { ref, ... } from 'vue'` 等等語句。
現在 `vite` 經過發展，社群的外掛已經非常豐富，基於此，我們可以簡化程式碼，提高開發效率，感謝那些大神提供的外掛。

::: tip 說明
現在在開發 `*.vue、*.ts、*.tsx` 時，不需要手動引入以下 `API` 或者元件：

- Vue的所有api
- VueRouter
- Pinia
- 所有的 `store` 檔案：`./src/store/modules/*` 
- hooks下自動匯入目錄：`./src/hooks/auto-imports/*`
- 以及 `./src/components/` 下的所有元件 `（只有 *.vue 型別檔案可以不顯性寫匯入）`
:::

## 自定義自動匯入

在 `./vite` 目錄下，有兩個檔案：`auto-import.ts` 和 `components.ts` 可定義自動匯入的**包、函式、元件**等。

### 自動匯入包、函式

在 `./vite/auto-import.ts` 中，可以定義自動匯入的包或函式，例如：`vue-router`、`pinia`、`axios` 等

```ts{3-8,10-14}
export default function createAutoImport() {
  return autoImport({
    // 這裡可以自定義匯入的
    imports: [
      'vue',
      'vue-router',
      'pinia',
    ],
    dts: './types/auto-imports.d.ts',
    // 這裡可加入自定義匯入的函式庫或者其他ts檔案
    dirs: [
      './src/hooks/auto-imports/**',
      './src/store/modules/**',
    ],
  })
}
```

### 自動匯入自定義元件庫

在 `./vite/components.ts` 中，可以定義自動匯入的元件庫目錄，系統內 `./src/components` 目錄下的元件，無需顯性匯入。

```ts{2}
  return components({
  dirs: ['src/components'],
  include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/],
  dts: './types/components.d.ts',
})
```