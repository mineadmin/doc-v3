# 事件

MineAdmin 的事件是基於 [hyperf/event](https://github.com/hyperf/event),要了解事件如何執行請前往 [hyperf 文件](https:://hyperf.io)
本文不再另行講述事件執行機制

## 預設自帶的監聽者

| 監聽者                             | 作用                                                      | 是否自帶 |
|---------------------------------|---------------------------------------------------------|------|
| ErrorExceptionHandler           | 當發生錯誤時，如果當前的錯誤報告級別與給定的錯誤級別匹配，就會丟擲一個ErrorException異常     | √    |
| UploadSubscriber                | 預設檔案上傳處理                                                | √    |
| BootApplicationSubscriber       | 在程式啟動時把 databases 目錄下的 seeders 和 migrations 目錄註冊到全域性遷移例項 | √    |
| DbQueryExecutedSubscriber       | 根據 env 配置列印每次執行的 sql 資訊                                 | √    |
| FailToHandleSubscriber          | 當 Command 執行失敗時列印輸出錯誤資訊                                 | √    |
| ResumeExitCoordinatorSubscriber | 處理 Worker 程序退出                                          | √    |
| QueueHandleSubscriber           | 當有佇列執行時列印佇列相關資訊                                         | √    |
| RegisterBlueprintListener       | 註冊新的 Blueprint 方法                                       | √    |





