# 自動導入


## 説明
在之前的 `2.x` 以及更古老的版本。

在使用 `Vue API` 的時候，都需要在文件內寫入 `import { ref, ... } from 'vue'` 等等語句。
現在 `vite` 經過發展，社區的插件已經非常豐富，基於此，我們可以簡化代碼，提高開發效率，感謝那些大神提供的插件。

::: tip 説明
現在在開發 `*.vue、*.ts、*.tsx` 時，不需要手動引入以下 `API` 或者組件：

- Vue的所有api
- VueRouter
- Pinia
- 所有的 `store` 文件：`./src/store/modules/*` 
- hooks下自動導入目錄：`./src/hooks/auto-imports/*`
- 以及 `./src/components/` 下的所有組件 `（只有 *.vue 類型文件可以不顯性寫導入）`
:::

## 自定義自動導入

在 `./vite` 目錄下，有兩個文件：`auto-import.ts` 和 `components.ts` 可定義自動導入的**包、函數、組件**等。

### 自動導入包、函數

在 `./vite/auto-import.ts` 中，可以定義自動導入的包或函數，例如：`vue-router`、`pinia`、`axios` 等

```ts{3-8,10-14}
export default function createAutoImport() {
  return autoImport({
    // 這裏可以自定義導入的
    imports: [
      'vue',
      'vue-router',
      'pinia',
    ],
    dts: './types/auto-imports.d.ts',
    // 這裏可加入自定義導入的函數庫或者其他ts文件
    dirs: [
      './src/hooks/auto-imports/**',
      './src/store/modules/**',
    ],
  })
}
```

### 自動導入自定義組件庫

在 `./vite/components.ts` 中，可以定義自動導入的組件庫目錄，系統內 `./src/components` 目錄下的組件，無需顯性導入。

```ts{2}
  return components({
  dirs: ['src/components'],
  include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/],
  dts: './types/components.d.ts',
})
```