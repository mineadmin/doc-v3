# 事件

MineAdmin 的事件是基於 [hyperf/event](https://github.com/hyperf/event),要了解事件如何運行請前往 [hyperf 文檔](https:://hyperf.io)
本文不再另行講述事件運行機制

## 默認自帶的監聽者

| 監聽者                             | 作用                                                      | 是否自帶 |
|---------------------------------|---------------------------------------------------------|------|
| ErrorExceptionHandler           | 當發生錯誤時，如果當前的錯誤報告級別與給定的錯誤級別匹配，就會拋出一個ErrorException異常     | √    |
| UploadSubscriber                | 默認文件上傳處理                                                | √    |
| BootApplicationSubscriber       | 在程序啓動時把 databases 目錄下的 seeders 和 migrations 目錄註冊到全局遷移實例 | √    |
| DbQueryExecutedSubscriber       | 根據 env 配置打印每次執行的 sql 信息                                 | √    |
| FailToHandleSubscriber          | 當 Command 執行失敗時打印輸出錯誤信息                                 | √    |
| ResumeExitCoordinatorSubscriber | 處理 Worker 進程退出                                          | √    |
| QueueHandleSubscriber           | 當有隊列執行時打印隊列相關信息                                         | √    |
| RegisterBlueprintListener       | 註冊新的 Blueprint 方法                                       | √    |





