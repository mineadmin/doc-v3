# 後端框架實現

這裡收錄 MineAdmin 後端框架實現文件。框架實現不跟隨 MineAdmin 主產品的 `v3`、`v4` 大版本節奏，而是按照各框架自己的版本獨立維護。

## 版本關係

| 框架 | 實現版本 | 狀態 | 適配契約 | 入口 |
|------|----------|------|----------|------|
| Hyperf | 3.2 | latest / 穩定實現 | MineAdmin v3 | [Hyperf latest](/backend/frameworks/hyperf/) |
| Hyperf | 3.1 | 穩定實現 | MineAdmin v3 | [Hyperf 3.1](/backend/frameworks/hyperf/3.1/) |
| Laravel | 1.0 | 規劃中 | MineAdmin v3 | [Laravel 1.0](/backend/frameworks/laravel/1.0/) |

## 閱讀方式

如果你要了解跨框架必須一致的介面、響應、路由和前臺對接約定，請先閱讀 [MineAdmin v3 後端公共契約](/v3/backend/contracts/)。

如果你要檢視具體框架的生命週期、容器、中介軟體、異常、日誌、事件、佇列、上傳或資料許可權實現，請進入對應框架版本文件。

