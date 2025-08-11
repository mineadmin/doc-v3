# Plugin Unit Testing  

A standard application directory structure explanation  

---  

## Essentially, a plugin is also a Composer package, but Mine integrates additional functionalities on top of it.  

For developers who need to perform unit testing, please directly create a `composer.json` file in the plugin directory.  

However, please note the following points:  

1. Ensure that the PSR-4 namespaces in `composer.json` and `mine.json` are consistent.  
2. Friendly reminder: [Installing any plugins outside of official sources is prohibited](#){style="color: red;"} to prevent malicious damage to your application.