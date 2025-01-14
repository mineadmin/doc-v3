# Modularization

::: tip Note
In the current version, **views, API definition files, etc.** will be managed in a modular way.
:::

## Module Root Directory

`src/modules`

## Base Module

The `base` module is a built-in foundational module of the system. You will notice that the module organizes `view files`, `API request files`, `module-wide multilingual files`, and `other files` into categorized directories for management. The base module includes all the built-in functionalities of the system, such as login, welcome page, dashboard, and the entire permission system, all of which are under the `base` module.

```bash
./src/modules/base/
  api/       # API request files under the module
    attachment.ts
    log.ts
    menu.ts
    permission.ts
    role.ts
    user.ts
  locales/   # Global internationalization files under the module
    en[English].yaml
    zh_CN[Simplified Chinese].yaml
    zh_TW[Traditional Chinese].yaml
  views/
    dashboard/  
      *.vue  # Too many Vue files to list individually, represented by asterisks
    log/
      *.vue  # Too many Vue files to list individually, represented by asterisks
    login/
      *.vue  # Too many Vue files to list individually, represented by asterisks
    permission/
      *.vue  # Too many Vue files to list individually, represented by asterisks
    uc/
      *.vue  # Too many Vue files to list individually, represented by asterisks
    welcome/
      *.vue  # Too many Vue files to list individually, represented by asterisks
```

::: info 
If you are developing new features, it is recommended to create a new module instead of writing them under `base`.
:::