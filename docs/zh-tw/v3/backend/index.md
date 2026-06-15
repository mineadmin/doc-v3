# 後端文件

歡迎來到 MineAdmin 3.x 後端開發文件。這裡主要描述 MineAdmin v3 的公共契約：前臺模板、後臺路由、介面元資料、響應結構和資料模型等穩定約定。具體框架實現已經獨立到 [後端框架實現](/backend/frameworks/)。

## 閱讀路徑

如果你只關心業務開發，建議先閱讀公共契約，再進入當前專案使用的框架實現：

1. [公共契約](/v3/backend/contracts/)：瞭解所有後端實現必須保持一致的介面、模型和響應規範。
2. [Hyperf latest](/backend/frameworks/hyperf/)：當前指向 Hyperf 3.2，包含生命週期、中介軟體、異常處理、日誌、事件、上傳、多語言、認證授權和資料許可權等細節。
3. [Laravel 1.0](/backend/frameworks/laravel/1.0/)：規劃中實現入口，後續 Laravel 版本將複用同一套公共契約。

## 架構原則

MineAdmin 的後端實現可以由不同框架承載，但面向前臺模板和外部整合時需要保持一致：

- 資料模型語義一致：使用者、角色、選單、部門、崗位、附件等核心模型保持同一業務含義。
- 後臺路由一致：同類後臺資源使用一致的路由語義、許可權標識和操作邊界。
- 介面元資料一致：OpenAPI/Swagger 元資料需要描述同一套請求、響應和認證要求。
- 響應結構一致：介面統一返回業務狀態碼、訊息和資料載荷，避免前臺因框架差異分支處理。
- 前臺模板一致：同一套前臺模板可以透過同一套介面契約對接不同後端實現。

## 當前實現狀態

| 實現 | 版本 | 語言 | 狀態 | 說明 |
|------|------|------|------|------|
| Hyperf | 3.2 | PHP | latest / 穩定實現 | MineAdmin 3.x 當前預設後端實現，執行在 Swoole/Swow 協程環境中。 |
| Hyperf | 3.1 | PHP | 穩定實現 | 與 3.2 初始文件結構一致，後續按版本差異維護。 |
| Laravel | 1.0 | PHP | 規劃中 | 第一階段只保留入口，後續按公共契約補齊實現文件。 |

## 核心專題

- [Hyperf 使用者認證](/backend/frameworks/hyperf/3.2/security/passport)：雙 Token、JWT 與登入流程。
- [Hyperf 使用者授權（RBAC）](/backend/frameworks/hyperf/3.2/security/access)：角色、選單、許可權校驗與審計。
- [Hyperf 資料許可權](/backend/frameworks/hyperf/3.2/data-permission/overview)：部門、崗位、策略和資料過濾規則。
- [外掛開發](/v3/plugin/index)：透過外掛機制擴充套件系統功能。

## 參考資料

- [公共契約總覽](/v3/backend/contracts/)
- [後端框架實現](/backend/frameworks/)
- [Hyperf 官方文件](https://hyperf.wiki/3.1)
- [Laravel 官方文件](https://laravel.com/docs/11.x/)
