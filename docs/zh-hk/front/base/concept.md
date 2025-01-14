# 基礎概念

整個項目進行了重構，現在我們將會介紹一些基礎概念，以便於你更好的理解整個文檔，請務必仔先閲讀這一部分。

::: tip
以下所講全部針對源碼根目錄下的 `./web` 裏的結構
:::

## 全局類型

由於新版採用 `Typescript` 所寫，全局的類型定義都在 `./types` 目錄下存放着，可在裏面找到相關的數據類型結構。

## 模塊

新版本進行模塊化劃分，目錄為 `./src/modules`。目錄下可以存在不同的模塊，每個模塊管理着的所屬業務的 `api`、`types`、`ts`以及`視圖文件`。

## 插件

新版前端中新增了一個 `./src/plugins` 目錄，專門存放獨立應用或者插件等等。

## 別名系統
在 `vite.config.ts` 文件中定義了以下別名，在引入文件時可使用別名代替全量路徑：

```json vite.config.ts
"resolve": {
    "alias": {
        '@': path.resolve(__dirname, 'src'),
        '#': path.resolve(__dirname, 'types'),
        '$': path.resolve(__dirname, 'src/plugins'),
        '~': path.resolve(__dirname, 'src/modules'),
    },
},
```

- `@`：代表了 `./src` 目錄，一般情況下所有前端項目默認都有此別名。
- `#`：代表了 `./types` 目錄，可方便引入全局類型。
- `$`: 代表了 `./src/plugins` 目錄，可方便快速的引入插件內的文件。
- `~`: 代表了 `./src/modules` 目錄，可方便快速的引入模塊內的文件。