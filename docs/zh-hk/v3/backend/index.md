# 後端文檔

歡迎來到 MineAdmin 3.x 後端開發文檔。這裏主要描述 MineAdmin v3 的公共契約：前台模板、後台路由、接口元數據、響應結構和數據模型等穩定約定。具體框架實現已經獨立到 [後端框架實現](/backend/frameworks/)。

## 閲讀路徑

如果你只關心業務開發，建議先閲讀公共契約，再進入當前項目使用的框架實現：

1. [公共契約](/v3/backend/contracts/)：瞭解所有後端實現必須保持一致的接口、模型和響應規範。
2. [Hyperf latest](/backend/frameworks/hyperf/)：當前指向 Hyperf 3.2，包含生命週期、中間件、異常處理、日誌、事件、上傳、多語言、認證授權和數據權限等細節。
3. [Laravel 1.0](/backend/frameworks/laravel/1.0/)：規劃中實現入口，後續 Laravel 版本將複用同一套公共契約。

## 架構原則

MineAdmin 的後端實現可以由不同框架承載，但面向前台模板和外部集成時需要保持一致：

- 數據模型語義一致：用户、角色、菜單、部門、崗位、附件等核心模型保持同一業務含義。
- 後台路由一致：同類後台資源使用一致的路由語義、權限標識和操作邊界。
- 接口元數據一致：OpenAPI/Swagger 元數據需要描述同一套請求、響應和認證要求。
- 響應結構一致：接口統一返回業務狀態碼、消息和數據載荷，避免前台因框架差異分支處理。
- 前台模板一致：同一套前台模板可以通過同一套接口契約對接不同後端實現。

## 當前實現狀態

| 實現 | 版本 | 語言 | 狀態 | 説明 |
|------|------|------|------|------|
| Hyperf | 3.2 | PHP | latest / 穩定實現 | MineAdmin 3.x 當前默認後端實現，運行在 Swoole/Swow 協程環境中。 |
| Hyperf | 3.1 | PHP | 穩定實現 | 與 3.2 初始文檔結構一致，後續按版本差異維護。 |
| Laravel | 1.0 | PHP | 規劃中 | 第一階段只保留入口，後續按公共契約補齊實現文檔。 |

## 核心專題

- [Hyperf 用户認證](/backend/frameworks/hyperf/3.2/security/passport)：雙 Token、JWT 與登錄流程。
- [Hyperf 用户授權（RBAC）](/backend/frameworks/hyperf/3.2/security/access)：角色、菜單、權限校驗與審計。
- [Hyperf 數據權限](/backend/frameworks/hyperf/3.2/data-permission/overview)：部門、崗位、策略和數據過濾規則。
- [插件開發](/v3/plugin/index)：通過插件機制擴展系統功能。

## 參考資料

- [公共契約總覽](/v3/backend/contracts/)
- [後端框架實現](/backend/frameworks/)
- [Hyperf 官方文檔](https://hyperf.wiki/3.1)
- [Laravel 官方文檔](https://laravel.com/docs/11.x/)
