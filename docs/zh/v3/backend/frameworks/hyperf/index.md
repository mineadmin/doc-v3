# Hyperf 实现

Hyperf 是 MineAdmin 3.x 当前稳定的后端实现。它运行在 Swoole/Swow 协程环境中，并通过 Hyperf 的中间件、事件、异常处理、配置加载和组件生态落地 MineAdmin 的公共契约。

## 实现边界

Hyperf 实现负责说明框架相关的细节：

- 应用启动、命令入口和请求生命周期。
- `config/autoload` 配置、服务注册和中间件顺序。
- Hyperf 事件、队列、日志、异常处理和文件系统接入。
- MineAdmin Swagger 注解与 Hyperf Swagger 的集成方式。
- `hyperf/translation` 在业务多语言中的使用方式。

数据模型、后台路由、接口元数据、响应结构和前台模板对接的稳定约定，请先阅读 [公共契约](/v3/backend/contracts/)。

## 文档目录

- [目录结构](./base/structure.md)
- [生命周期](./base/lifecycle.md)
- [路由与 API 文档](./base/router.md)
- [错误处理](./base/error-handler.md)
- [日志](./base/logger.md)
- [事件](./base/event-handler.md)
- [文件上传](./base/upload.md)
- [多语言](./base/lang.md)

## 适用场景

如果你的项目使用 MineAdmin 3.x 默认后端，或者需要了解协程环境下的具体实现方式，请阅读本节。Laravel 或未来其他后端实现会复用同一套公共契约，但在生命周期、中间件、ORM 和配置方式上使用各自框架的实现文档说明。
