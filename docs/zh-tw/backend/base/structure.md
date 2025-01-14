# 目錄結構

預設的 MineAdmin 應用程式結構旨在為大型和小型應用程式提供一個良好的起點。但是你可以自由地組織你的應用程式

我們參考了 [laravel](https://laravel.com/) 的目錄結構。如果你有接觸過那麼對你來說將會異常簡單

## 根目錄

### App 目錄

包含應用程式的核心程式碼。應用程式中幾乎所有的類都將在此目錄中

### Config 目錄

包含所有應用程式的配置檔案

### Database 目錄

包含資料庫遷移、模型工廠和資料填充檔案

### Storage 目錄

包含日誌、語言檔案。預設上傳檔案、Swagger OpenApi 檔案

### Tests 目錄

包含自動化測試。 開箱即用的示例 PHPUnit 單元測試和功能測試

### Web 目錄

包含了前端應用程式碼

### Plugin 目錄

包含了你從外掛市場下載的外掛，每個新應用都預設自帶應用市場外掛

## App 目錄

在一個經典專案開發中，你的絕大部分業務程式碼將都位於 `app` 目錄下

### Exceptions 目錄

`Exceptions` 目錄包含應用程式的異常處理程式，也是放置應用程式丟擲的任何異常的好地方。 如果你想自定義記錄或呈現異常，你應該修改此目錄中的 Handler 目錄。

### Http 目錄

和 Laravel 一致，Http 目錄包含你的控制器、中介軟體和表單請求。 幾乎所有處理進入應用程式的請求的邏輯都將放在這個目錄中。


### Model 目錄

包含所有 Eloquent 模型類。 MineAdmin 中包含的 Eloquent ORM 提供了一個漂亮、簡單的 ActiveRecord 實現來處理你的資料庫。 每個資料庫表都有一個相應的「模型」，用於與該表進行互動。 模型允許你查詢表中的資料，以及將新記錄插入表中

::: warning

使用方法參考 [laravel 文件](https://laravel.com/docs/11.x/eloquent),中國開發者參考 [國內譯文](https://learnku.com/docs/laravel/10.x/eloquent/14888)

注意，[協程版 Eloquent ORM](https://hyperf.wiki/3.1/#/en/) 由 [Hyperf](https://github.com/hyperf/hyperf)維護
在用法上會和 Laravel 官方有一定差異。

:::

### Service 目錄

包含所有的業務邏輯實行類，Service 將排程 `Repository`、`Model` 進行業務編排，使其最終實現業務邏輯

### Repository 目錄

包含所有的儲存查詢類，排程 `redis`,`model`,`es` 等各種外部程式進行資料的組裝和處理。並將結果返回到上一層

### Schema 目錄

包含所有的 Swagger Schema 類，理論上 <el-tag type="danger">嚴格禁止</el-tag> 參與業務排程。此目錄只是為了方便生成 Swagger OpenApi 檔案

