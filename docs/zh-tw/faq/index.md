# 常見問題

## 如何從 Swoole 切換到 Swow

::: warning

Swow 安裝請參考 [Swow 官方文件](https://docs.toast.run/swow-blog/chs/init.html#%E6%94%AF%E6%8C%81%E7%9A%84%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F) 

:::

1. copy 專案目錄下的 `.github/ci/server.php` 覆蓋 `config/autoload/server.php`
2. copy 專案目錄下的 `.github/ci/hyperf.php` 覆蓋 `bin/hyperf.php`

重新啟動即可
