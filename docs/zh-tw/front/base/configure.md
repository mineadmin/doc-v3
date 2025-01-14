# 配置

## 環境變數配置

預設自帶了 `開發環境` 和 `生產環境` 兩種環境配置檔案。如需要擴充套件，可以複製一份根據自身需要修改。

具體請閱讀 [Vite - 環境變數和模式](https://cn.vitejs.dev/guide/env-and-mode) 章節。

::: code-group

```YAML [.env.development]
# 頁面標題
VITE_APP_TITLE = MineAdmin
  # 埠
VITE_APP_PORT = 2888
  # 應用根路徑
VITE_APP_ROOT_BASE = /
  # 介面請求地址，會設定到 axios 的 baseURL 引數上
VITE_APP_API_BASEURL = http://127.0.0.1:9501
  # 路由模式: history 和 hash 兩種，預設hash，帶#號那種
VITE_APP_ROUTE_MODE = hash

  # 儲存字首
VITE_APP_STORAGE_PREFIX = mine_

  # 是否開啟代理
VITE_OPEN_PROXY = true
  # 代理字首標識
VITE_PROXY_PREFIX = /dev
  # 是否開啟vConsole （手機端調式可開啟）
VITE_OPEN_vCONSOLE = false
  # 是否開啟開發者工具
VITE_OPEN_DEVTOOLS = false

```

```YAML [.env.production]
# 頁面標題
VITE_APP_TITLE = MineAdmin
  # 應用根路徑
VITE_APP_ROOT_BASE = /
  # 介面請求地址，會設定到 axios 的 baseURL 引數上
VITE_APP_API_BASEURL = /
  # 路由模式: history 和 hash 兩種，預設hash，帶#號那種
VITE_APP_ROUTE_MODE = hash

  # 儲存字首
VITE_APP_STORAGE_PREFIX = mine_

  # 是否開啟代理
VITE_OPEN_PROXY = true
  # 代理字首標識
VITE_PROXY_PREFIX = /prod

  # 是否在打包時啟用 Mock
VITE_BUILD_MOCK = false
  # 是否在打包時生成 sourcemap
VITE_BUILD_SOURCEMAP = false
  # 是否在打包時開啟壓縮，支援 gzip 和 brotli
VITE_BUILD_COMPRESS = gzip,brotli
  # 是否在打包後生成存檔，支援 zip 和 tar
VITE_BUILD_ARCHIVE =

```
:::
