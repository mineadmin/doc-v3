# Database Migration

Documentation for Database Migration Files

---

1. The plugin uses [Migration](https://hyperf.wiki/3.1/#/zh-cn/db/migration){style="color: green;"} by default to manage data migration and seeding for the plugin.
2. `Unless absolutely necessary`, all data migrations should be done using migration files and seed files. Use `InstallScript` and `UninstallScript` for other checks or file migrations.
3. The database migration directory for the plugin follows the [Plugin Directory Structure Chapter](../structure.md){style="color: green;"}.