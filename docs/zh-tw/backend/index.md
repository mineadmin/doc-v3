# 後端文件

歡迎來到 MineAdmin 3.x 後端開發文件。本文件將幫助您深入理解 MineAdmin 的後端架構、開發規範和最佳實踐。

## 架構概述

MineAdmin 後端採用現代化的 PHP 技術棧構建，基於 Hyperf 3.x 框架開發，執行在高效能的協程環境中。

### 核心特性

- **高效能協程**: 基於 Swoole/Swow 擴充套件的協程特性，提供卓越的併發效能
- **現代化架構**: 分層架構清晰
- **安全可靠**: 內建雙 Token 認證機制，完善的許可權控制系統
- **易於擴充套件**: 支援外掛化開發，模組化架構設計

## 技術棧

| 技術元件 | 版本 | 說明 |
|---------|------|------|
| PHP | 8.x+ | 現代化 PHP 語言特性支援 |
| Hyperf | 3.x | 高效能協程框架 |
| Swoole/Swow | 最新穩定版 | 協程執行時環境 |
| MySQL | 5.7+ / 8.0+ | 主資料庫 |
| Redis | 6.0+ | 快取和會話儲存 |
| JWT | - | 基於 lcobucci/jwt 的認證方案 |

## 快速開始

### 環境要求

- PHP >= 8.1
- Swoole >= 5.1 或 Swow >= 1.0
- MySQL 
- Redis 

### 啟動服務

```bash
# 啟動 HTTP 服務
php bin/hyperf.php start
```

### 開發模式

```bash
# 熱過載模式（開發環境推薦）
php bin/hyperf.php server:watch
```

## 專案結構

MineAdmin 的目錄結構參考了 Laravel 的設計理念，如果您有 Laravel 開發經驗，將會很快上手。

### 根目錄結構

```
├── App/              # 應用核心程式碼目錄
├── Config/           # 配置檔案目錄
├── Database/         # 資料庫相關檔案
├── Storage/          # 儲存目錄（日誌、上傳檔案等）
├── Tests/            # 測試程式碼目錄
├── Web/              # 前端應用程式碼
└── Plugin/           # 外掛目錄
```

### App 目錄詳解

```
App/
├── Exceptions/       # 異常處理
├── Http/            # HTTP 相關（控制器、中介軟體、請求驗證）
├── Model/           # 資料模型（Eloquent ORM）
├── Service/         # 業務邏輯層
├── Repository/      # 資料訪問層
└── Schema/          # API 文件 Schema 定義
```

**架構分層說明**:

- **Controller**: 處理 HTTP 請求，引數驗證和響應格式化
- **Service**: 業務邏輯編排，排程 Repository 和 Model
- **Repository**: 資料訪問抽象，統一資料來源（MySQL、Redis、ES等）
- **Model**: 資料模型定義，基於協程版 Eloquent ORM

## 核心功能

### 認證授權

- **雙 Token 機制**: Access Token + Refresh Token 無感重新整理
- **RBAC 許可權控制**: 基於角色的訪問控制，支援資料許可權
- **多端支援**: 支援 Web、移動端、API 等多種客戶端

### 資料許可權

- **靈活配置**: 基於規則的資料許可權控制
- **多維度支援**: 支援部門、使用者、角色等多維度許可權控制
- **透明整合**: 與業務邏輯無感整合

### 日誌監控

- **操作日誌**: 詳細記錄使用者操作行為
- **登入日誌**: 使用者登入記錄和安全分析
- **系統日誌**: 應用執行日誌和錯誤追蹤

## 開發指南

### 基礎開發

- [目錄結構詳解](./base/structure.md) - 深入瞭解專案目錄組織
- [生命週期](./base/lifecycle.md) - 理解應用啟動和請求處理流程
- [路由系統](./base/router.md) - 路由定義和中介軟體使用
- [異常處理](./base/error-handler.md) - 統一異常處理機制

### 進階功能

- [安全機制](./security/passport.md) - 認證和授權詳解
- [資料許可權](./data-permission/overview.md) - 資料許可權系統使用
- [事件處理](./base/event-handler.md) - 事件驅動開發

### 部署運維

- [日誌管理](./base/logger.md) - 日誌配置和管理
- [檔案上傳](./base/upload.md) - 檔案處理和儲存

## 外掛開發

MineAdmin 支援外掛化擴充套件，您可以透過外掛機制快速擴充套件系統功能：

- [外掛開發指南](../plugin/index.md) - 外掛開發完整教程
- [應用市場](../plugin/develop/publish.md) - 外掛釋出和分發

## API 文件

- [API 介面文件](../api/) - 完整的 REST API 文件
- Swagger 文件地址：`/swagger` （開發環境）

## 常見問題

- [FAQ 常見問題](../faq/) - 開發中的常見問題和解決方案

## 社群與支援

- **GitHub**: [https://github.com/mineadmin/mineadmin](https://github.com/mineadmin/mineadmin)
- **文件問題**: [提交 Issue](https://github.com/mineadmin/doc-v3/issues)
- **技術交流**: 加入官方社群群組

## 參考資料

本文件在編寫過程中參考了以下優秀專案的文件（排名不分先後）：

1. [Laravel 官方文件](https://laravel.com/docs/11.x/)
2. [Hyperf 官方文件](https://hyperf.wiki/3.1)

---

**下一步**: 建議先閱讀 [目錄結構詳解](./base/structure.md) 來深入理解專案架構。