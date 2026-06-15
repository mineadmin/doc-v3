# Hyperf 3.1 實現

Hyperf 3.1 是 MineAdmin 3.x 當前穩定的後端實現之一。它運行在 Swoole/Swow 協程環境中，並通過 Hyperf 的中間件、事件、異常處理、配置加載和組件生態落地 MineAdmin 的公共契約。

## 實現邊界

Hyperf 實現負責説明框架相關的細節：

- 應用啓動、命令入口和請求生命週期。
- `config/autoload` 配置、服務註冊和中間件順序。
- Hyperf 事件、隊列、日誌、異常處理和文件系統接入。
- MineAdmin Swagger 註解與 Hyperf Swagger 的集成方式。
- `hyperf/translation` 在業務多語言中的使用方式。

數據模型、後台路由、接口元數據、響應結構和前台模板對接的穩定約定，請先閲讀 [公共契約](/v3/backend/contracts/)。

## 文檔目錄

- [目錄結構](./base/structure.md)
- [生命週期](./base/lifecycle.md)
- [路由與 API 文檔](./base/router.md)
- [錯誤處理](./base/error-handler.md)
- [日誌](./base/logger.md)
- [事件](./base/event-handler.md)
- [文件上傳](./base/upload.md)
- [多語言](./base/lang.md)
- [用户認證](./security/passport.md)
- [用户授權（RBAC）](./security/access.md)
- [獲取客户端 IP](./security/client-ip.md)
- [數據權限](./data-permission/overview.md)

## 適用場景

如果你的項目使用 MineAdmin 3.x 默認後端，或者需要了解協程環境下的具體實現方式，請閲讀本節。Laravel 或未來其他後端實現會複用同一套公共契約，但在生命週期、中間件、ORM 和配置方式上使用各自框架的實現文檔説明。
