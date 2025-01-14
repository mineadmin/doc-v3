# 日誌處理

## 開發模式下的命令行日誌

在 `.env` 文件中，如果 `APP_DEBUG=true`，那麼服務端會自動把所有錯誤日誌輸出到命令行。方便開發者本地進行調試。
如果 `APP_DEBUG=true`，那麼服務端會盡可能的把日誌輸出到默認的 `loggerFactor->get('xxx','default')` 日誌通道中


::: tip

關於更多日誌使用的文檔，請參考 [hyperf](https://hyperf.io) 文檔，本文不再另行説明基礎用法

:::