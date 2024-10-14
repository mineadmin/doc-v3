# 配置

## 环境变量配置

默认自带了 `开发环境` 和 `生产环境` 两种环境配置文件。如需要扩展，可以拷贝一份根据自身需要修改。

具体请阅读 [Vite - 环境变量和模式](https://cn.vitejs.dev/guide/env-and-mode) 章节。

::: code-group

```YAML [.env.development]
# 页面标题
VITE_APP_TITLE = MineAdmin
  # 端口
VITE_APP_PORT = 2888
  # 应用根路径
VITE_APP_ROOT_BASE = /
  # 接口请求地址，会设置到 axios 的 baseURL 参数上
VITE_APP_API_BASEURL = http://127.0.0.1:9501
  # 路由模式: history 和 hash 两种，默认hash，带#号那种
VITE_APP_ROUTE_MODE = hash

  # 存储前缀
VITE_APP_STORAGE_PREFIX = mine_

  # 是否开启代理
VITE_OPEN_PROXY = true
  # 代理前缀标识
VITE_PROXY_PREFIX = /dev
  # 是否开启vConsole （手机端调式可开启）
VITE_OPEN_vCONSOLE = false
  # 是否开启开发者工具
VITE_OPEN_DEVTOOLS = false

```

```YAML [.env.production]
# 页面标题
VITE_APP_TITLE = MineAdmin
  # 应用根路径
VITE_APP_ROOT_BASE = /
  # 接口请求地址，会设置到 axios 的 baseURL 参数上
VITE_APP_API_BASEURL = /
  # 路由模式: history 和 hash 两种，默认hash，带#号那种
VITE_APP_ROUTE_MODE = hash

  # 存储前缀
VITE_APP_STORAGE_PREFIX = mine_

  # 是否开启代理
VITE_OPEN_PROXY = true
  # 代理前缀标识
VITE_PROXY_PREFIX = /prod

  # 是否在打包时启用 Mock
VITE_BUILD_MOCK = false
  # 是否在打包时生成 sourcemap
VITE_BUILD_SOURCEMAP = false
  # 是否在打包时开启压缩，支持 gzip 和 brotli
VITE_BUILD_COMPRESS = gzip,brotli
  # 是否在打包后生成存档，支持 zip 和 tar
VITE_BUILD_ARCHIVE =

```
:::
