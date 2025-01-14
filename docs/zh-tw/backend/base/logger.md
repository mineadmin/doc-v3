# 日誌處理

## 開發模式下的命令列日誌

在 `.env` 檔案中，如果 `APP_DEBUG=true`，那麼服務端會自動把所有錯誤日誌輸出到命令列。方便開發者本地進行除錯。
如果 `APP_DEBUG=true`，那麼服務端會盡可能的把日誌輸出到預設的 `loggerFactor->get('xxx','default')` 日誌通道中


::: tip

關於更多日誌使用的文件，請參考 [hyperf](https://hyperf.io) 文件，本文不再另行說明基礎用法

:::