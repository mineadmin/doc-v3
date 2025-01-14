# 構建與預覽

## 構建（打包）
專案開發完成之後，要部署在伺服器上，則需要對前端專案進行構建打包。

執行 `pnpm run build` 命令進行構建，打包成功之後，會在 `./web` 下目錄生成 `dist` 資料夾，裡面就是打包好的靜態檔案。

::: info 提示
如果訪問地址並未為域名的根節點，如 `https://www.example.com/app`
則需要在 `環境變數檔案` 中修改 `VITE_APP_ROOT_BASE` 選項為 `/app`，否則會出現資源引用錯誤。
:::

## 預覽

為了保證構建打包出來的專案能正常執行，一般需要本地測試一下。

這時候可以執行 `pnpm run serve` 命令預覽打包好的專案，並以真實的情況訪問後端伺服器。

## 壓縮

在 `環境變數檔案` 裡設定 `VITE_BUILD_COMPRESS` 即可在構建打包時生成 `.gz` 或 `.br` 檔案。但兩者均需要 `nginx` 安裝指定模組並開啟後才會生效。
```yaml
# 單獨開啟 gzip
VITE_BUILD_COMPRESS = gzip

# 單獨開啟 brotli ，brotli 是比 gzip 壓縮率更高的演算法
VITE_BUILD_COMPRESS = brotli

# 或者也可以都開啟，兩者可以共存
VITE_BUILD_COMPRESS = gzip,brotli
```