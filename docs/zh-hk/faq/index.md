# 常見問題

---

## 安裝成功後報錯 `DNS Lookup resolve failed`

檢查 `.env` 文件中的 `mysql` `redis` 是否正確,能否正常連接

---

## 購買的插件無法使用

如果是付費插件請在QQ羣或微信羣聯繫管理員，提供訂單號，管理員會拉你進對應的插件售後羣

---



## 如何從 Swoole 切換到 Swow

::: warning

Swow 安裝請參考 [Swow 官方文檔](https://docs.toast.run/swow-blog/chs/init.html#%E6%94%AF%E6%8C%81%E7%9A%84%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F) 

:::

1. copy 項目目錄下的 `.github/ci/server.php` 覆蓋 `config/autoload/server.php`
2. copy 項目目錄下的 `.github/ci/hyperf.php` 覆蓋 `bin/hyperf.php`

重新啓動即可

---


## 安裝了插件後，提交到git後，線上部署拉取代碼(或者其他人拉取代碼)，前端訪問插件的後端接口報not fund

1. plugin/mine-admin下面的插件中install.lock 必須提交，否則插件的路由無法識別
2. gitignore中有*.lock，去掉這行


---


## 上傳圖片或文件，訪問Not Found 問題

1. 生產環境下，建議使用nginx代理。
2. 開發環境下，在/config/autoload/server.php，配置如下：
```php
'settings' => [
  // 開啓外部可以訪問
  Constant::OPTION_ENABLE_STATIC_HANDLER => env('APP_DEBUG', false),
  Constant::OPTION_DOCUMENT_ROOT => BASE_PATH . '/storage',
  //...
],
```
.env文件，APP_DEBUG改為true，配置後重啓服務。