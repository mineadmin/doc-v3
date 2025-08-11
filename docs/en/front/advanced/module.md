# Modularization  

::: tip Note  
In the current version, **views, API definition files, etc.** will be managed in a modular way.  
:::  

## Module Root Directory  

`src/modules`  

## Base Module  

The `base` module is a built-in foundational module of the system. You will notice that it organizes `view files`, `API request files`, `module-wide multilingual files`, and `other files` in a categorized manner.  

The base module includes all the system's built-in functionalities, such as login, welcome page, dashboard, and the entire permission system, all of which are located under the `base` module.  

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
      *.vue  # Too many Vue files to list individually; represented by asterisks  
    log/  
      *.vue  # Too many Vue files to list individually; represented by asterisks  
    login/  
      *.vue  # Too many Vue files to list individually; represented by asterisks  
    permission/  
      *.vue  # Too many Vue files to list individually; represented by asterisks  
    uc/  
      *.vue  # Too many Vue files to list individually; represented by asterisks  
    welcome/  
      *.vue  # Too many Vue files to list individually; represented by asterisks  
```  

::: info  
For new feature development, it is recommended to create a new module instead of adding it under `base`.  
:::