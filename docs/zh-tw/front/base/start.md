# 開始

::: tip 提示
以下內容全以原始碼已經下載好，並在命令列下進入到了 `./web` 目錄為前提。
:::

## 開發環境

需要在本地依次安裝好 [Node.js](https://nodejs.org/zh-cn), [pnpm](https://pnpm.io/zh-tw/)。也可以使用 `yarn` 等其他包管理工具，推薦使用 `pnpm`，文件內容以 `pnpm` 為準。

- Node.js >= 20.0.0，推薦 20.x.x 的 LTS 版本
- PNPM >= 9.0.0

## 安裝依賴及執行
執行成功後，會自動開啟頁面，預設地址為 http://localhost:2888

```bash
# 安裝依賴
pnpm i 或 pnpm install

# 執行
pnpm dev
```

::: warning 安裝依賴報錯
如果無法正常安裝依賴，可能是因為 npm 預設源無法訪問，
可以嘗試執行 `pnpm config set registry https://registry.npmmirror.com/`
切換為國內 `npmmirror` 映象源（也可以使用 [nrm](https://github.com/Pana/nrm) 一鍵切換源），
然後刪除根目錄下 `/node_modules` 資料夾並重新安裝依賴。
:::
