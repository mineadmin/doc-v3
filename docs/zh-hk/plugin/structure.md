# 插件目錄結構

一個標準插件目錄結構説明

---

以[插件創建章節](./create.md)為例

```shell
- plugin/test/demo 插件根目錄
-- plugin/test/demo/src 插件後端目錄
--- plugin/test/demo/src/InstallScript.php 插件安裝時執行類方法
--- plugin/test/demo/src/UninstallScript.php 插件卸載時執行類方法
--- plugin/test/demo/src/ConfigProvider.php 插件配置目錄,此文件與 hyperf 官方配置一致
--  plugin/test/demo/Database 插件數據庫遷移與填充文件目錄
--- plugin/test/demo/Database/Migrations 插件數據庫遷移文件
--- plugin/test/demo/Database/Seeder 插件數據庫數據填充文件
-- plugin/test/demo/web 插件前端目錄
-- plugin/test/demo/mine.json 插件核心信息文件
```