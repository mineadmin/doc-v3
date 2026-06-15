# Laravel 1.0 實現

Laravel `1.0` 是 MineAdmin 後端多實現方案的預留入口。第一階段只建立文件結構，不補齊完整實現細節。

## 目標

Laravel 實現需要複用 [公共契約](/v3/backend/contracts/) 中的資料模型、後臺路由、介面元資料、響應結構和前臺模板對接約定。這樣同一套 MineAdmin 前臺模板可以連線 Hyperf 或 Laravel 後端，而不需要維護兩套前臺邏輯。

## 預計覆蓋範圍

後續補齊 Laravel `1.0` 實現時，建議按以下主題組織：

- 應用啟動與請求生命週期。
- 服務容器、服務提供器和配置載入。
- 中介軟體註冊、認證和許可權校驗。
- Eloquent 模型、倉儲層和事務處理。
- OpenAPI/Swagger 元資料生成。
- 異常處理、日誌、事件、佇列和檔案上傳。
- 多語言訊息載入與客戶端語言識別。

## 當前狀態

當前頁面只作為規劃入口。正式使用 Laravel `1.0` 實現前，請以 [Hyperf latest](/backend/frameworks/hyperf/) 和公共契約為準。

::: warning 說明

當前文件中的使用者認證、使用者授權、獲取客戶端 IP 和資料許可權章節均為 Hyperf 實現內容。Laravel 實現暫未提供這些章節。

:::
