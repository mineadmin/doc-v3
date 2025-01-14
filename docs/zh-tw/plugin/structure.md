# 外掛目錄結構

一個標準外掛目錄結構說明

---

以[外掛建立章節](./create.md)為例

```shell
- plugin/test/demo 外掛根目錄
-- plugin/test/demo/src 外掛後端目錄
--- plugin/test/demo/src/InstallScript.php 外掛安裝時執行類方法
--- plugin/test/demo/src/UninstallScript.php 外掛解除安裝時執行類方法
--- plugin/test/demo/src/ConfigProvider.php 外掛配置目錄,此檔案與 hyperf 官方配置一致
--  plugin/test/demo/Database 外掛資料庫遷移與填充檔案目錄
--- plugin/test/demo/Database/Migrations 外掛資料庫遷移檔案
--- plugin/test/demo/Database/Seeder 外掛資料庫資料填充檔案
-- plugin/test/demo/web 外掛前端目錄
-- plugin/test/demo/mine.json 外掛核心資訊檔案
```