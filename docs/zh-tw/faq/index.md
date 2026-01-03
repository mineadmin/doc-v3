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

---

## Windows下使用Docker啟動為什麼這麼慢

### 原因分析

在Windows系統下使用Docker時，啟動速度慢主要是由於Docker的檔案系統特性導致的。Docker在Windows上執行時，底層使用的是虛擬化技術（如WSL2或Hyper-V），當使用bind mount（繫結掛載）方式將Windows宿主機的目錄掛載到容器內時，會產生跨檔案系統的訪問開銷。

特別是當掛載包含大量小檔案的目錄（如`vendor`目錄包含成千上萬個相依套件檔案，`runtime`目錄包含日誌和快取檔案）時，每次檔案讀寫都需要經過：
1. 容器內的檔案系統
2. Docker虛擬化層
3. Windows主機檔案系統

這種跨檔案系統的頻繁I/O操作會顯著降低效能，導致應用程式啟動緩慢。

### 解決方案

透過使用Docker的命名卷（named volumes）來管理不需要頻繁修改的目錄，讓這些目錄完全在Docker內部的檔案系統中管理，避免跨檔案系統訪問。同時只掛載必要的原始碼目錄，實現效能和開發便利性的平衡。

在`docker-compose.yml`中配置如下：

```yaml
services:
  hyperf:
    volumes:
      # 使用命名卷儲存vendor和runtime，避免跨檔案系統訪問
      - vendor_data:/www/vendor
      - runtime_data:/www/runtime
      # 只掛載必要的原始碼目錄
      - ./app:/www/app
      - ./config:/www/config
      - ./bin:/www/bin
      - ./plugin:/www/plugin
      - ./databases:/www/databases
      - ./storage:/www/storage
      - ./web:/www/web
      - ./composer.json:/www/composer.json
      - ./composer.lock:/www/composer.lock
      - ./.env:/www/.env

# 定義命名卷
volumes:
  vendor_data:
  runtime_data:
```

**配置說明：**
- `vendor_data` 和 `runtime_data` 是Docker命名卷，資料儲存在Docker管理的空間中，I/O效能接近原生
- 原始碼目錄（如`app`、`config`等）仍然掛載到宿主機，方便即時編輯和除錯
- `composer.json`、`composer.lock`和`.env`單獨掛載，確保相依配置和環境變數可以即時同步

採用這種配置後，應用程式啟動速度可以顯著提升。
