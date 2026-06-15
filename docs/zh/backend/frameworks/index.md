# 后端框架实现

这里收录 MineAdmin 后端框架实现文档。框架实现不跟随 MineAdmin 主产品的 `v3`、`v4` 大版本节奏，而是按照各框架自己的版本独立维护。

## 版本关系

| 框架 | 实现版本 | 状态 | 适配契约 | 入口 |
|------|----------|------|----------|------|
| Hyperf | 3.2 | latest / 稳定实现 | MineAdmin v3 | [Hyperf latest](/backend/frameworks/hyperf/) |
| Hyperf | 3.1 | 稳定实现 | MineAdmin v3 | [Hyperf 3.1](/backend/frameworks/hyperf/3.1/) |
| Laravel | 1.0 | 规划中 | MineAdmin v3 | [Laravel 1.0](/backend/frameworks/laravel/1.0/) |

## 阅读方式

如果你要了解跨框架必须一致的接口、响应、路由和前台对接约定，请先阅读 [MineAdmin v3 后端公共契约](/v3/backend/contracts/)。

如果你要查看具体框架的生命周期、容器、中间件、异常、日志、事件、队列、上传或数据权限实现，请进入对应框架版本文档。

