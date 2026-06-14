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

  使用Nginx 代理可以借鑑以下配置 （注意 env 配置 和上傳目錄權限）。請注意，以下路徑僅為示例，需根據實際部署環境調整。
  假設資源url 為 https://example.com/uploads/**/****.png
```nginx
# 代理 uploads 中的圖片資源
location /uploads/ {
    alias /www/wwwroot/MineAdmin/storage/uploads/;
    expires 30d;
    add_header Cache-Control "public";
    add_header Access-Control-Allow-Origin *;
    
    # 只允許圖片文件
    location ~* \.(jpg|jpeg|png|gif|webp|svg|ico|bmp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # 防止訪問其他文件類型
    location ~* \.(php|html|htm|js|css)$ {
        deny all;
    }
}
```
::: warning

如果確認所有配置均正確，但仍無法訪問並且出現 403 Forbidden，請檢查 `uploads` 目錄的權限是否設置為 755，並確保所屬用户為 `www`。

:::

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

---

## Windows下使用Docker啓動為什麼這麼慢

### 原因分析

在Windows系統下使用Docker時，啓動速度慢主要是由於Docker的文件系統特性導致的。Docker在Windows上運行時，底層使用的是虛擬化技術（如WSL2或Hyper-V），當使用bind mount（綁定掛載）方式將Windows宿主機的目錄掛載到容器內時，會產生跨文件系統的訪問開銷。

特別是當掛載包含大量小文件的目錄（如`vendor`目錄包含成千上萬個依賴包文件，`runtime`目錄包含日誌和緩存文件）時，每次文件讀寫都需要經過：
1. 容器內的文件系統
2. Docker虛擬化層
3. Windows主機文件系統

這種跨文件系統的頻繁I/O操作會顯著降低性能，導致應用啓動緩慢。

### 解決方案

通過使用Docker的命名卷（named volumes）來管理不需要頻繁修改的目錄，讓這些目錄完全在Docker內部的文件系統中管理，避免跨文件系統訪問。同時只掛載必要的源代碼目錄，實現性能和開發便利性的平衡。

在`docker-compose.yml`中配置如下：

```yaml
services:
  hyperf:
    volumes:
      # 使用命名卷存儲vendor和runtime，避免跨文件系統訪問
      - vendor_data:/www/vendor
      - runtime_data:/www/runtime
      # 只掛載必要的源代碼目錄
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

**配置説明：**
- `vendor_data` 和 `runtime_data` 是Docker命名卷，數據存儲在Docker管理的空間中，I/O性能接近原生
- 源代碼目錄（如`app`、`config`等）仍然掛載到宿主機，方便實時編輯和調試
- `composer.json`、`composer.lock`和`.env`單獨掛載，確保依賴配置和環境變量可以實時同步

採用這種配置後，應用啓動速度可以顯著提升。

---

## 定時任務-Command類型，只有第一次成功，後續都失敗問題。

調用目標，需要加上--disable-event-dispatcher: ture配置。
即crontab表中的value值為：
```json
{"command":"mine:xxx","--disable-event-dispatcher":true}
```

詳細文檔：https://hyperf.wiki/3.1/#/zh-cn/crontab
