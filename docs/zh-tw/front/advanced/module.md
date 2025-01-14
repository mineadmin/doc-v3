# 模組化

::: tip 說明
現版本**檢視、api定義檔案等**將以模組化管理。
:::

## 模組根目錄

`src/modules`

## base模組

`base` 模組是系統自帶的一個基礎模組，會發現模組將 `檢視檔案`，`API請求檔案`，`模組全域性多語言` 等 `其他檔案` 歸類存放管理。
基礎模組裡包含了目前系統自帶的所有功能，包括登入、歡迎頁、儀表盤、整個許可權系統等等都在 `base` 模組下
```bash
./src/modules/base/
  api/       # 模組下的API請求檔案
    attachment.ts
    log.ts
    menu.ts
    permisstion.ts
    role.ts
    user.ts
  locales/   # 模組下的全域性國際化
    en[English].yaml
    zh_CN[簡體中文].yaml
    zh_TW[繁體中文].yaml
  views/
    dashboard/  
      *.vue  # 太多vue 檔案就不一一列出，以星號代替
    log/
      *.vue  # 太多vue 檔案就不一一列出，以星號代替
    login/
      *.vue  # 太多vue 檔案就不一一列出，以星號代替
    permission/
      *.vue  # 太多vue 檔案就不一一列出，以星號代替
    uc/
      *.vue  # 太多vue 檔案就不一一列出，以星號代替
    welcome/
      *.vue  # 太多vue 檔案就不一一列出，以星號代替
```

::: info 
如果新開發功能，就建議另外新建模組，不要寫在 `base` 下。
:::