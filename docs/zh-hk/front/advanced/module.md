# 模塊化

::: tip 説明
現版本**視圖、api定義文件等**將以模塊化管理。
:::

## 模塊根目錄

`src/modules`

## base模塊

`base` 模塊是系統自帶的一個基礎模塊，會發現模塊將 `視圖文件`，`API請求文件`，`模塊全局多語言` 等 `其他文件` 歸類存放管理。
基礎模塊裏包含了目前系統自帶的所有功能，包括登錄、歡迎頁、儀表盤、整個權限系統等等都在 `base` 模塊下
```bash
./src/modules/base/
  api/       # 模塊下的API請求文件
    attachment.ts
    log.ts
    menu.ts
    permisstion.ts
    role.ts
    user.ts
  locales/   # 模塊下的全局國際化
    en[English].yaml
    zh_CN[簡體中文].yaml
    zh_TW[繁體中文].yaml
  views/
    dashboard/  
      *.vue  # 太多vue 文件就不一一列出，以星號代替
    log/
      *.vue  # 太多vue 文件就不一一列出，以星號代替
    login/
      *.vue  # 太多vue 文件就不一一列出，以星號代替
    permission/
      *.vue  # 太多vue 文件就不一一列出，以星號代替
    uc/
      *.vue  # 太多vue 文件就不一一列出，以星號代替
    welcome/
      *.vue  # 太多vue 文件就不一一列出，以星號代替
```

::: info 
如果新開發功能，就建議另外新建模塊，不要寫在 `base` 下。
:::