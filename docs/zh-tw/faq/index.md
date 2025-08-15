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


## 安裝了外掛後，提交到git後，線上部署拉取程式碼(或者其他人拉取程式碼)，前端訪問外掛的後端介面報not fund

1. plugin/mine-admin下面的外掛中install.lock 必須提交，否則外掛的路由無法識別
2. gitignore中有*.lock，去掉這行


---


## 上傳圖片或檔案，訪問Not Found 問題

1. 生產環境下，建議使用nginx代理。

  使用Nginx 代理可以借鑑以下配置 （注意 env 配置 和上傳目錄許可權）。請注意，以下路徑僅為示例，需根據實際部署環境調整。
  假設資源url 為 https://example.com/uploads/**/****.png
```nginx
# 代理 uploads 中的圖片資源
location /uploads/ {
    alias /mineadmin/storage/uploads/; # 示例路徑，請根據實際部署環境調整
    expires 7d;
    add_header Cache-Control "public";  # 允許所有使用者和中間快取伺服器（如CDN）快取此資源，提高快取效率
    add_header Access-Control-Allow-Origin https://example.com;  # 只允許 https://example.com 域名的網頁跨域請求本資源，提升安全性
}
```
2. 開發環境下，在/config/autoload/server.php，配置如下：
```php
'settings' => [
  // 開啟外部可以訪問
  Constant::OPTION_ENABLE_STATIC_HANDLER => env('APP_DEBUG', false),
  Constant::OPTION_DOCUMENT_ROOT => BASE_PATH . '/storage',
  //...
],
```
.env檔案，APP_DEBUG改為true，配置後重啟服務。
