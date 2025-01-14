# 配置

## 環境變量配置

默認自帶了 `開發環境` 和 `生產環境` 兩種環境配置文件。如需要擴展，可以拷貝一份根據自身需要修改。

具體請閲讀 [Vite - 環境變量和模式](https://cn.vitejs.dev/guide/env-and-mode) 章節。

::: code-group

```YAML [.env.development]
# 頁面標題
VITE_APP_TITLE = MineAdmin
  # 端口
VITE_APP_PORT = 2888
  # 應用根路徑
VITE_APP_ROOT_BASE = /
  # 接口請求地址，會設置到 axios 的 baseURL 參數上
VITE_APP_API_BASEURL = http://127.0.0.1:9501
  # 路由模式: history 和 hash 兩種，默認hash，帶#號那種
VITE_APP_ROUTE_MODE = hash

  # 存儲前綴
VITE_APP_STORAGE_PREFIX = mine_

  # 是否開啓代理
VITE_OPEN_PROXY = true
  # 代理前綴標識
VITE_PROXY_PREFIX = /dev
  # 是否開啓vConsole （手機端調式可開啓）
VITE_OPEN_vCONSOLE = false
  # 是否開啓開發者工具
VITE_OPEN_DEVTOOLS = false

```

```YAML [.env.production]
# 頁面標題
VITE_APP_TITLE = MineAdmin
  # 應用根路徑
VITE_APP_ROOT_BASE = /
  # 接口請求地址，會設置到 axios 的 baseURL 參數上
VITE_APP_API_BASEURL = /
  # 路由模式: history 和 hash 兩種，默認hash，帶#號那種
VITE_APP_ROUTE_MODE = hash

  # 存儲前綴
VITE_APP_STORAGE_PREFIX = mine_

  # 是否開啓代理
VITE_OPEN_PROXY = true
  # 代理前綴標識
VITE_PROXY_PREFIX = /prod

  # 是否在打包時啓用 Mock
VITE_BUILD_MOCK = false
  # 是否在打包時生成 sourcemap
VITE_BUILD_SOURCEMAP = false
  # 是否在打包時開啓壓縮，支持 gzip 和 brotli
VITE_BUILD_COMPRESS = gzip,brotli
  # 是否在打包後生成存檔，支持 zip 和 tar
VITE_BUILD_ARCHIVE =

```
:::
