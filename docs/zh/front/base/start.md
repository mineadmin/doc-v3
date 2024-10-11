# 开始

::: tip 提示
以下内容全以源码已经下载好，并在命令行下进入到了 `./web` 目录为前提。
:::

## 开发环境

需要在本地依次安装好 [Node.js](https://nodejs.org/zh-cn), [pnpm](https://pnpm.io/zh/)。也可以使用 `yarn` 等其他包管理工具，推荐使用 `pnpm`，文档内容以 `pnpm` 为准。

- Node.js >= 20.0.0，推荐 20.x.x 的 LTS 版本
- PNPM >= 9.0.0

## 安装依赖及运行
运行成功后，会自动打开页面，默认地址为 http://localhost:2888

```bash
# 安装依赖
pnpm i 或 pnpm install

# 运行
pnpm dev
```

::: warning 安装依赖报错
如果无法正常安装依赖，可能是因为 npm 默认源无法访问，
可以尝试执行 `pnpm config set registry https://registry.npmmirror.com/`
切换为国内 `npmmirror` 镜像源（也可以使用 [nrm](https://github.com/Pana/nrm) 一键切换源），
然后删除根目录下 `/node_modules` 文件夹并重新安装依赖。
:::
