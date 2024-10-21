# 事件

MineAdmin 的事件是基于 [hyperf/event](https://github.com/hyperf/event),要了解事件如何运行请前往 [hyperf 文档](https:://hyperf.io)
本文不再另行讲述事件运行机制

## 默认自带的监听者

| 监听者                             | 作用                                                      | 是否自带 |
|---------------------------------|---------------------------------------------------------|------|
| ErrorExceptionHandler           | 当发生错误时，如果当前的错误报告级别与给定的错误级别匹配，就会抛出一个ErrorException异常     | √    |
| UploadSubscriber                | 默认文件上传处理                                                | √    |
| BootApplicationSubscriber       | 在程序启动时把 databases 目录下的 seeders 和 migrations 目录注册到全局迁移实例 | √    |
| DbQueryExecutedSubscriber       | 根据 env 配置打印每次执行的 sql 信息                                 | √    |
| FailToHandleSubscriber          | 当 Command 执行失败时打印输出错误信息                                 | √    |
| ResumeExitCoordinatorSubscriber | 处理 Worker 进程退出                                          | √    |
| QueueHandleSubscriber           | 当有队列执行时打印队列相关信息                                         | √    |
| RegisterBlueprintListener       | 注册新的 Blueprint 方法                                       | √    |





