# Frequently Asked Questions

## How to Switch from Swoole to Swow

::: warning

For Swow installation, please refer to the [Swow Official Documentation](https://docs.toast.run/swow-blog/chs/init.html#%E6%94%AF%E6%8C%81%E7%9A%84%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F)

:::

1. Copy `.github/ci/server.php` from the project directory to overwrite `config/autoload/server.php`.
2. Copy `.github/ci/hyperf.php` from the project directory to overwrite `bin/hyperf.php`.

Restart the application after completing these steps.