# Plugin Unit Testing

Standard Application Directory Structure Description

---

## Essentially, a plugin is also a composer package, except that Mine integrates more features on top of it.

For developers who need to perform unit testing, please directly create a composer.json file in the plugin directory.

However, please note the following:

1. Ensure that the psr4 namespaces in composer.json and mine.json are consistent
2. Friendly reminder: [Do not install any unofficial plugins](#){style="color: red;"} to prevent malicious damage to your application