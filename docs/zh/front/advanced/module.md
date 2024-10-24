# 模块化

::: tip 说明
现版本**视图、api定义文件等**将以模块化管理。
:::

## 模块根目录

`src/modules`

## base模块

`base` 模块是系统自带的一个基础模块，会发现模块将 `视图文件`，`API请求文件`，`模块全局多语言` 等 `其他文件` 归类存放管理。
基础模块里包含了目前系统自带的所有功能，包括登录、欢迎页、仪表盘、整个权限系统等等都在 `base` 模块下
```bash
./src/modules/base/
  api/       # 模块下的API请求文件
    attachment.ts
    log.ts
    menu.ts
    permisstion.ts
    role.ts
    user.ts
  locales/   # 模块下的全局国际化
    en[English].yaml
    zh_CN[简体中文].yaml
    zh_TW[繁體中文].yaml
  views/
    dashboard/  
      *.vue  # 太多vue 文件就不一一列出，以星号代替
    log/
      *.vue  # 太多vue 文件就不一一列出，以星号代替
    login/
      *.vue  # 太多vue 文件就不一一列出，以星号代替
    permission/
      *.vue  # 太多vue 文件就不一一列出，以星号代替
    uc/
      *.vue  # 太多vue 文件就不一一列出，以星号代替
    welcome/
      *.vue  # 太多vue 文件就不一一列出，以星号代替
```

::: info 
如果新开发功能，就建议另外新建模块，不要写在 `base` 下。
:::