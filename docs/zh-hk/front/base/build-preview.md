# 構建與預覽

## 構建（打包）
項目開發完成之後，要部署在服務器上，則需要對前端項目進行構建打包。

執行 `pnpm run build` 命令進行構建，打包成功之後，會在 `./web` 下目錄生成 `dist` 文件夾，裏面就是打包好的靜態文件。

::: info 提示
如果訪問地址並未為域名的根節點，如 `https://www.example.com/app`
則需要在 `環境變量文件` 中修改 `VITE_APP_ROOT_BASE` 選項為 `/app`，否則會出現資源引用錯誤。
:::

## 預覽

為了保證構建打包出來的項目能正常運行，一般需要本地測試一下。

這時候可以執行 `pnpm run serve` 命令預覽打包好的項目，並以真實的情況訪問後端服務器。

## 壓縮

在 `環境變量文件` 裏設置 `VITE_BUILD_COMPRESS` 即可在構建打包時生成 `.gz` 或 `.br` 文件。但兩者均需要 `nginx` 安裝指定模塊並開啓後才會生效。
```yaml
# 單獨開啓 gzip
VITE_BUILD_COMPRESS = gzip

# 單獨開啓 brotli ，brotli 是比 gzip 壓縮率更高的算法
VITE_BUILD_COMPRESS = brotli

# 或者也可以都開啓，兩者可以共存
VITE_BUILD_COMPRESS = gzip,brotli
```