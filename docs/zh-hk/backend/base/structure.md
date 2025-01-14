# 目錄結構

默認的 MineAdmin 應用程序結構旨在為大型和小型應用程序提供一個良好的起點。但是你可以自由地組織你的應用程序

我們參考了 [laravel](https://laravel.com/) 的目錄結構。如果你有接觸過那麼對你來説將會異常簡單

## 根目錄

### App 目錄

包含應用程序的核心代碼。應用程序中幾乎所有的類都將在此目錄中

### Config 目錄

包含所有應用程序的配置文件

### Database 目錄

包含數據庫遷移、模型工廠和數據填充文件

### Storage 目錄

包含日誌、語言文件。默認上傳文件、Swagger OpenApi 文件

### Tests 目錄

包含自動化測試。 開箱即用的示例 PHPUnit 單元測試和功能測試

### Web 目錄

包含了前端應用代碼

### Plugin 目錄

包含了你從插件市場下載的插件，每個新應用都默認自帶應用市場插件

## App 目錄

在一個經典項目開發中，你的絕大部分業務代碼將都位於 `app` 目錄下

### Exceptions 目錄

`Exceptions` 目錄包含應用程序的異常處理程序，也是放置應用程序拋出的任何異常的好地方。 如果你想自定義記錄或呈現異常，你應該修改此目錄中的 Handler 目錄。

### Http 目錄

和 Laravel 一致，Http 目錄包含你的控制器、中間件和表單請求。 幾乎所有處理進入應用程序的請求的邏輯都將放在這個目錄中。


### Model 目錄

包含所有 Eloquent 模型類。 MineAdmin 中包含的 Eloquent ORM 提供了一個漂亮、簡單的 ActiveRecord 實現來處理你的數據庫。 每個數據庫表都有一個相應的「模型」，用於與該表進行交互。 模型允許你查詢表中的數據，以及將新記錄插入表中

::: warning

使用方法參考 [laravel 文檔](https://laravel.com/docs/11.x/eloquent),中國開發者參考 [國內譯文](https://learnku.com/docs/laravel/10.x/eloquent/14888)

注意，[協程版 Eloquent ORM](https://hyperf.wiki/3.1/#/en/) 由 [Hyperf](https://github.com/hyperf/hyperf)維護
在用法上會和 Laravel 官方有一定差異。

:::

### Service 目錄

包含所有的業務邏輯實行類，Service 將調度 `Repository`、`Model` 進行業務編排，使其最終實現業務邏輯

### Repository 目錄

包含所有的存儲查詢類，調度 `redis`,`model`,`es` 等各種外部程序進行數據的組裝和處理。並將結果返回到上一層

### Schema 目錄

包含所有的 Swagger Schema 類，理論上 <el-tag type="danger">嚴格禁止</el-tag> 參與業務調度。此目錄只是為了方便生成 Swagger OpenApi 文件

