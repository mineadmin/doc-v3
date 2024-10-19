# 日志处理

## 开发模式下的命令行日志

在 `.env` 文件中，如果 `APP_DEBUG=true`，那么服务端会自动把所有错误日志输出到命令行。方便开发者本地进行调试。
如果 `APP_DEBUG=true`，那么服务端会尽可能的把日志输出到默认的 `loggerFactor->get('xxx','default')` 日志通道中


::: tip

关于更多日志使用的文档，请参考 [hyperf](https://hyperf.io) 文档，本文不再另行说明基础用法

:::