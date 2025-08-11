# Database Migration

Documentation for Database Migration Files

---

1. The plugin defaults to using [Migration](https://hyperf.wiki/3.1/#/zh-cn/db/migration){style="color: green;"} to manage data migration and seeding for the plugin.  
2. `Unless absolutely necessary`, all data migrations should be performed using migration and seed files. `InstallScript` and `UninstallScript` should be reserved for other checks or file migrations.  
3. The database migration directory for plugins follows the standards outlined in the [Plugin Directory Structure section](../structure.md){style="color: green;"}.