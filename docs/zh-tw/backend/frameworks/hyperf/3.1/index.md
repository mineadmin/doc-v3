# Hyperf 3.1 實現

Hyperf 3.1 是 MineAdmin 3.x 當前穩定的後端實現之一。它執行在 Swoole/Swow 協程環境中，並透過 Hyperf 的中介軟體、事件、異常處理、配置載入和元件生態落地 MineAdmin 的公共契約。

## 實現邊界

Hyperf 實現負責說明框架相關的細節：

- 應用啟動、命令入口和請求生命週期。
- `config/autoload` 配置、服務註冊和中介軟體順序。
- Hyperf 事件、佇列、日誌、異常處理和檔案系統接入。
- MineAdmin Swagger 註解與 Hyperf Swagger 的整合方式。
- `hyperf/translation` 在業務多語言中的使用方式。

資料模型、後臺路由、介面元資料、響應結構和前臺模板對接的穩定約定，請先閱讀 [公共契約](/v3/backend/contracts/)。

## 文件目錄

- [目錄結構](./base/structure.md)
- [生命週期](./base/lifecycle.md)
- [路由與 API 文件](./base/router.md)
- [錯誤處理](./base/error-handler.md)
- [日誌](./base/logger.md)
- [事件](./base/event-handler.md)
- [檔案上傳](./base/upload.md)
- [多語言](./base/lang.md)
- [使用者認證](./security/passport.md)
- [使用者授權（RBAC）](./security/access.md)
- [獲取客戶端 IP](./security/client-ip.md)
- [資料許可權](./data-permission/overview.md)

## 適用場景

如果你的專案使用 MineAdmin 3.x 預設後端，或者需要了解協程環境下的具體實現方式，請閱讀本節。Laravel 或未來其他後端實現會複用同一套公共契約，但在生命週期、中介軟體、ORM 和配置方式上使用各自框架的實現文件說明。
