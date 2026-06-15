# Laravel 1.0 實現

Laravel `1.0` 是 MineAdmin 後端多實現方案的預留入口。第一階段只建立文檔結構，不補齊完整實現細節。

## 目標

Laravel 實現需要複用 [公共契約](/v3/backend/contracts/) 中的數據模型、後台路由、接口元數據、響應結構和前台模板對接約定。這樣同一套 MineAdmin 前台模板可以連接 Hyperf 或 Laravel 後端，而不需要維護兩套前台邏輯。

## 預計覆蓋範圍

後續補齊 Laravel `1.0` 實現時，建議按以下主題組織：

- 應用啓動與請求生命週期。
- 服務容器、服務提供器和配置加載。
- 中間件註冊、認證和權限校驗。
- Eloquent 模型、倉儲層和事務處理。
- OpenAPI/Swagger 元數據生成。
- 異常處理、日誌、事件、隊列和文件上傳。
- 多語言消息加載與客户端語言識別。

## 當前狀態

當前頁面只作為規劃入口。正式使用 Laravel `1.0` 實現前，請以 [Hyperf latest](/backend/frameworks/hyperf/) 和公共契約為準。

::: warning 説明

當前文檔中的用户認證、用户授權、獲取客户端 IP 和數據權限章節均為 Hyperf 實現內容。Laravel 實現暫未提供這些章節。

:::
