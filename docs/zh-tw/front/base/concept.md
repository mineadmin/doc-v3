# 基礎概念

整個專案進行了重構，現在我們將會介紹一些基礎概念，以便於你更好的理解整個文件，請務必仔先閱讀這一部分。

::: tip
以下所講全部針對原始碼根目錄下的 `./web` 裡的結構
:::

## 全域性型別

由於新版採用 `Typescript` 所寫，全域性的型別定義都在 `./types` 目錄下存放著，可在裡面找到相關的資料型別結構。

## 模組

新版本進行模組化劃分，目錄為 `./src/modules`。目錄下可以存在不同的模組，每個模組管理著的所屬業務的 `api`、`types`、`ts`以及`檢視檔案`。

## 外掛

新版前端中新增了一個 `./src/plugins` 目錄，專門存放獨立應用或者外掛等等。

## 別名系統
在 `vite.config.ts` 檔案中定義了以下別名，在引入檔案時可使用別名代替全量路徑：

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

- `@`：代表了 `./src` 目錄，一般情況下所有前端專案預設都有此別名。
- `#`：代表了 `./types` 目錄，可方便引入全域性型別。
- `$`: 代表了 `./src/plugins` 目錄，可方便快速的引入外掛內的檔案。
- `~`: 代表了 `./src/modules` 目錄，可方便快速的引入模組內的檔案。