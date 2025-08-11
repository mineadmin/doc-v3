# Plugin Directory Structure  

A description of a standard plugin directory structure.  

---  

Taking the [Plugin Creation Chapter](./create.md) as an example:  

```shell
- plugin/test/demo                     # Plugin root directory  
-- plugin/test/demo/src                # Plugin backend directory  
--- plugin/test/demo/src/InstallScript.php    # Class methods executed during plugin installation  
--- plugin/test/demo/src/UninstallScript.php  # Class methods executed during plugin uninstallation  
--- plugin/test/demo/src/ConfigProvider.php   # Plugin configuration file (consistent with Hyperf's official configuration)  
-- plugin/test/demo/Database            # Plugin database migration and seeder directory  
--- plugin/test/demo/Database/Migrations      # Plugin database migration files  
--- plugin/test/demo/Database/Seeder          # Plugin database seeder files  
-- plugin/test/demo/web                 # Plugin frontend directory  
-- plugin/test/demo/mine.json           # Core plugin information file  
```