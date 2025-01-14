# Configuration

## Environment Variable Configuration

By default, there are two environment configuration files: `development` and `production`. If you need to extend, you can copy one and modify it according to your needs.

For more details, please refer to the [Vite - Environment Variables and Modes](https://cn.vitejs.dev/guide/env-and-mode) section.

::: code-group

```YAML [.env.development]
# Page title
VITE_APP_TITLE = MineAdmin
  # Port
VITE_APP_PORT = 2888
  # Application root path
VITE_APP_ROOT_BASE = /
  # API request address, will be set to the baseURL parameter of axios
VITE_APP_API_BASEURL = http://127.0.0.1:9501
  # Routing mode: history and hash, default is hash (with #)
VITE_APP_ROUTE_MODE = hash

  # Storage prefix
VITE_APP_STORAGE_PREFIX = mine_

  # Whether to enable proxy
VITE_OPEN_PROXY = true
  # Proxy prefix identifier
VITE_PROXY_PREFIX = /dev
  # Whether to enable vConsole (can be enabled for mobile debugging)
VITE_OPEN_vCONSOLE = false
  # Whether to enable developer tools
VITE_OPEN_DEVTOOLS = false

```

```YAML [.env.production]
# Page title
VITE_APP_TITLE = MineAdmin
  # Application root path
VITE_APP_ROOT_BASE = /
  # API request address, will be set to the baseURL parameter of axios
VITE_APP_API_BASEURL = /
  # Routing mode: history and hash, default is hash (with #)
VITE_APP_ROUTE_MODE = hash

  # Storage prefix
VITE_APP_STORAGE_PREFIX = mine_

  # Whether to enable proxy
VITE_OPEN_PROXY = true
  # Proxy prefix identifier
VITE_PROXY_PREFIX = /prod

  # Whether to enable Mock during build
VITE_BUILD_MOCK = false
  # Whether to generate sourcemap during build
VITE_BUILD_SOURCEMAP = false
  # Whether to enable compression during build, supports gzip and brotli
VITE_BUILD_COMPRESS = gzip,brotli
  # Whether to generate archives after build, supports zip and tar
VITE_BUILD_ARCHIVE =

```
:::