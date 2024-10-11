# 插件目录结构

一个标准插件目录结构说明

---

以[插件创建章节](./create.md)为例

```shell
- plugin/test/demo 插件根目录
-- plugin/test/demo/src 插件后端目录
--- plugin/test/demo/src/InstallScript.php 插件安装时执行类方法
--- plugin/test/demo/src/UninstallScript.php 插件卸载时执行类方法
--- plugin/test/demo/src/ConfigProvider.php 插件配置目录,此文件与 hyperf 官方配置一致
--  plugin/test/demo/Database 插件数据库迁移与填充文件目录
--- plugin/test/demo/Database/Migrations 插件数据库迁移文件
--- plugin/test/demo/Database/Seeder 插件数据库数据填充文件
-- plugin/test/demo/web 插件前端目录
-- plugin/test/demo/mine.json 插件核心信息文件
```