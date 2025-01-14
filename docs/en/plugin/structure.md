# Plugin Directory Structure

A standard plugin directory structure explanation

---

Taking the [Plugin Creation Chapter](./create.md) as an example

```shell
- plugin/test/demo Plugin root directory
-- plugin/test/demo/src Plugin backend directory
--- plugin/test/demo/src/InstallScript.php Class method executed during plugin installation
--- plugin/test/demo/src/UninstallScript.php Class method executed during plugin uninstallation
--- plugin/test/demo/src/ConfigProvider.php Plugin configuration directory, this file is consistent with the official Hyperf configuration
-- plugin/test/demo/Database Plugin database migration and seeding file directory
--- plugin/test/demo/Database/Migrations Plugin database migration files
--- plugin/test/demo/Database/Seeder Plugin database data seeding files
-- plugin/test/demo/web Plugin frontend directory
-- plugin/test/demo/mine.json Plugin core information file
```