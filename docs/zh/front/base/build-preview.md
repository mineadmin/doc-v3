# 构建与预览

## 构建（打包）
项目开发完成之后，要部署在服务器上，则需要对前端项目进行构建打包。

执行 `pnpm run build` 命令进行构建，打包成功之后，会在 `./web` 下目录生成 `dist` 文件夹，里面就是打包好的静态文件。

::: info 提示
如果访问地址并未为域名的根节点，如 `https://www.example.com/app`
则需要在 `环境变量文件` 中修改 `VITE_APP_ROOT_BASE` 选项为 `/app`，否则会出现资源引用错误。
:::

## 预览

为了保证构建打包出来的项目能正常运行，一般需要本地测试一下。

这时候可以执行 `pnpm run serve` 命令预览打包好的项目，并以真实的情况访问后端服务器。

## 压缩

在 `环境变量文件` 里设置 `VITE_BUILD_COMPRESS` 即可在构建打包时生成 .gz 或 .br 文件。但两者均需要 `nginx` 安装指定模块并开启后才会生效。
```yaml
# 单独开启 gzip
VITE_BUILD_COMPRESS = gzip

# 单独开启 brotli ，brotli 是比 gzip 压缩率更高的算法
VITE_BUILD_COMPRESS = brotli

# 或者也可以都开启，两者可以共存
VITE_BUILD_COMPRESS = gzip,brotli
```