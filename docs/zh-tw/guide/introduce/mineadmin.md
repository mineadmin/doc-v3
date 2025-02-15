# 關於 MineAdmin

::: info 你正在閱讀的是 `MineAdmin 3.x` 版本的文件 
- MineAdmin 2.x 目前已進入維護期，不再增加新功能，僅進行bug修復。
- 新版本與舊版本不相容，如果你使用的是舊版本，請在右上角檢視 **`老版本文件`**
- 如發現文件有誤，歡迎提交 [issue](https://github.com/mineadmin/doc-v3) 幫助我們改進。
- 再次感謝選擇 MineAdmin
:::

::: tip 為什麼選擇我們
我們致力於為個人開發者及企業提供一款現代化簡潔且高效的後臺管理系統。憑藉以下優勢，我們助您在專案開發中事半功倍：
- 採用最新的技術棧，包括 Hyperf3.x、PHP 8.x、Vue 3.x、Vite 5.x等，確保您的專案始終常用常新。
- 注重程式碼的規範性與質量，確保程式碼的一致性和可維護性，為專案的長期發展奠定堅實基礎。
- 無論是個人開發者的輕量級應用初創專案的快速搭建，還是企業級應用的複雜需求，我們的系統都能提供強有力的支援，助您實現快速開發、快速落地、快速迭代及快速部署。
:::

## 內建功能
- 使用者管理，完成使用者新增、修改、刪除配置。
- 角色管理，角色選單許可權分配、角色資料許可權分配（基於casbin）。
- 選單管理，配置系統選單、前端路由和按鈕等許可權。
- 操作日誌，使用者對系統的一些正常操作的查詢。
- 登入日誌，使用者登入系統的記錄查詢
- 程式碼生成，根據資料庫表結構生成對應的增刪改查（前後端）程式碼，目前待完成。
- 應用市場，MineAdmin的生態系統，提供豐富的外掛和模板，方便使用者快速搭建自己的應用。
- 使用者中心，專門的佈局和頁面，獨立的選單，提供使用者資料修改等操作，可擴充套件其他功能。

## 發展歷程

從 MineAdmin 0.x 版本開始，後臺系統經歷了許多迭代和最佳化。

後端使用的 Hyperf 框架從 2.0 跟隨升級到 3.0。前端從最早一開始使用的 SCUI 開源前端專案，到後來基於 Arco 自行開發了一套前端框架，
再到現在採用全新的架構，重構了前後端程式碼，精簡了功能。新版本中，重新開始，不斷最佳化框架，以提供更好的使用者體驗。
我們的目標是讓開發者能夠快速上手，專注於業務邏輯的開發，併為企業和品牌創造價值。