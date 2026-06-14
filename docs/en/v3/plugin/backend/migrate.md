# Database Migration

Database Migration File Description

---

1. The plugin uses [Migration](https://hyperf.wiki/3.1/#/zh-cn/db/migration){style="color: green;"} by default to manage plugin data migration and seeding.
2. Unless `necessary`, please perform all data migration using migration files and seeding files. Use `InstallScript` and `UninstallScript` for other checks or file migrations.
3. The plugin database migration directory follows the [Plugin Directory Specification chapter](../structure.md){style="color: green;"}.