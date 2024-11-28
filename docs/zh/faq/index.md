# 常见问题

## 如何从 Swoole 切换到 Swow

::: warning

Swow 安装请参考 [Swow 官方文档](https://docs.toast.run/swow-blog/chs/init.html#%E6%94%AF%E6%8C%81%E7%9A%84%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F) 

:::

1. copy 项目目录下的 `.github/ci/server.php` 覆盖 `config/autoload/server.php`
2. copy 项目目录下的 `.github/ci/hyperf.php` 覆盖 `bin/hyperf.php`

重新启动即可
