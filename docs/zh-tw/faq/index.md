# 常見問題

---

## 安裝成功後報錯 `DNS Lookup resolve failed`

檢查 `.env` 檔案中的 `mysql` `redis` 是否正確,能否正常連線

---

## 購買的外掛無法使用

如果是付費外掛請在QQ群或微信群聯絡管理員，提供訂單號，管理員會拉你進對應的外掛售後群

---



## 如何從 Swoole 切換到 Swow

::: warning

Swow 安裝請參考 [Swow 官方文件](https://docs.toast.run/swow-blog/chs/init.html#%E6%94%AF%E6%8C%81%E7%9A%84%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F) 

:::

1. copy 專案目錄下的 `.github/ci/server.php` 覆蓋 `config/autoload/server.php`
2. copy 專案目錄下的 `.github/ci/hyperf.php` 覆蓋 `bin/hyperf.php`

重新啟動即可

---