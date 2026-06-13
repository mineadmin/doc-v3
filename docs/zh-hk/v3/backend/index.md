# 後端文檔

歡迎來到 MineAdmin 3.x 後端開發文檔。本文檔將幫助您深入理解 MineAdmin 的後端架構、開發規範和最佳實踐。

## 架構概述

MineAdmin 後端採用現代化的 PHP 技術棧構建，基於 Hyperf 3.x 框架開發，運行在高性能的協程環境中。

### 核心特性

- **高性能協程**: 基於 Swoole/Swow 擴展的協程特性，提供卓越的併發性能
- **現代化架構**: 分層架構清晰
- **安全可靠**: 內置雙 Token 認證機制，完善的權限控制系統
- **易於擴展**: 支持插件化開發，模塊化架構設計

## 技術棧

| 技術組件 | 版本 | 説明 |
|---------|------|------|
| PHP | 8.x+ | 現代化 PHP 語言特性支持 |
| Hyperf | 3.x | 高性能協程框架 |
| Swoole/Swow | 最新穩定版 | 協程運行時環境 |
| MySQL | 5.7+ / 8.0+ | 主數據庫 |
| Redis | 6.0+ | 緩存和會話存儲 |
| JWT | - | 基於 lcobucci/jwt 的認證方案 |

## 快速開始

### 環境要求

- PHP >= 8.1
- Swoole >= 5.1 或 Swow >= 1.0
- MySQL 
- Redis 

### 啓動服務

```bash
# 啓動 HTTP 服務
php bin/hyperf.php start
```

### 開發模式

```bash
# 熱重載模式（開發環境推薦）
php bin/hyperf.php server:watch
```

## 項目結構

MineAdmin 的目錄結構參考了 Laravel 的設計理念，如果您有 Laravel 開發經驗，將會很快上手。

### 根目錄結構

```
├── App/              # 應用核心代碼目錄
├── Config/           # 配置文件目錄
├── Database/         # 數據庫相關文件
├── Storage/          # 存儲目錄（日誌、上傳文件等）
├── Tests/            # 測試代碼目錄
├── Web/              # 前端應用代碼
└── Plugin/           # 插件目錄
```

### App 目錄詳解

```
App/
├── Exceptions/       # 異常處理
├── Http/            # HTTP 相關（控制器、中間件、請求驗證）
├── Model/           # 數據模型（Eloquent ORM）
├── Service/         # 業務邏輯層
├── Repository/      # 數據訪問層
└── Schema/          # API 文檔 Schema 定義
```

**架構分層説明**:

- **Controller**: 處理 HTTP 請求，參數驗證和響應格式化
- **Service**: 業務邏輯編排，調度 Repository 和 Model
- **Repository**: 數據訪問抽象，統一數據來源（MySQL、Redis、ES等）
- **Model**: 數據模型定義，基於協程版 Eloquent ORM

## 核心功能

### 認證授權

- **雙 Token 機制**: Access Token + Refresh Token 無感刷新
- **RBAC 權限控制**: 基於角色的訪問控制，支持數據權限
- **多端支持**: 支持 Web、移動端、API 等多種客户端

### 數據權限

- **靈活配置**: 基於規則的數據權限控制
- **多維度支持**: 支持部門、用户、角色等多維度權限控制
- **透明集成**: 與業務邏輯無感集成

### 日誌監控

- **操作日誌**: 詳細記錄用户操作行為
- **登錄日誌**: 用户登錄記錄和安全分析
- **系統日誌**: 應用運行日誌和錯誤追蹤

## 開發指南

### 基礎開發

- [目錄結構詳解](./base/structure.md) - 深入瞭解項目目錄組織
- [生命週期](./base/lifecycle.md) - 理解應用啓動和請求處理流程
- [路由系統](./base/router.md) - 路由定義和中間件使用
- [異常處理](./base/error-handler.md) - 統一異常處理機制

### 進階功能

- [安全機制](./security/passport.md) - 認證和授權詳解
- [數據權限](./data-permission/overview.md) - 數據權限系統使用
- [事件處理](./base/event-handler.md) - 事件驅動開發

### 部署運維

- [日誌管理](./base/logger.md) - 日誌配置和管理
- [文件上傳](./base/upload.md) - 文件處理和存儲

## 插件開發

MineAdmin 支持插件化擴展，您可以通過插件機制快速擴展系統功能：

- [插件開發指南](../plugin/index.md) - 插件開發完整教程
- [應用市場](../plugin/develop/publish.md) - 插件發佈和分發

## API 文檔

- [API 接口文檔](../api/) - 完整的 REST API 文檔
- Swagger 文檔地址：`/swagger` （開發環境）

## 常見問題

- [FAQ 常見問題](../faq/) - 開發中的常見問題和解決方案

## 社區與支持

- **GitHub**: [https://github.com/mineadmin/mineadmin](https://github.com/mineadmin/mineadmin)
- **文檔問題**: [提交 Issue](https://github.com/mineadmin/doc-v3/issues)
- **技術交流**: 加入官方社區羣組

## 參考資料

本文檔在編寫過程中參考了以下優秀項目的文檔（排名不分先後）：

1. [Laravel 官方文檔](https://laravel.com/docs/11.x/)
2. [Hyperf 官方文檔](https://hyperf.wiki/3.1)

---

**下一步**: 建議先閲讀 [目錄結構詳解](./base/structure.md) 來深入理解項目架構。