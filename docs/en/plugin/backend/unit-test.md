# Plugin Unit Testing

A standard application directory structure explanation

---

## Essentially, a plugin is also a Composer package, but Mine integrates more functionalities on top of it.

For developers who need to perform unit testing, please directly create a `composer.json` file in the plugin directory.

However, please note the following:

1. Ensure that the PSR-4 namespaces in both `composer.json` and `mine.json` are consistent.
2. Friendly reminder: [Do not install any plugins from non-official sources](#){style="color: red;"}, to avoid malicious damage to your application.