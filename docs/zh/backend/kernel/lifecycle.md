# 生命周期

::: tip

不论是 swoole 或 swow。在 MineAdmin 中都是由 Hyperf 通过[symfony/console](https://github.com/symfony/console) 组件接入
启动命令 `php bin/hyperf.php start`

MineAdmin 是构建运行在 [PHP](https://php.net) + ([Swoole](https://swoole.com) or [Swow](https://github.com/swow/swow)) + [Hyperf](https://github.com/hyperf/hyperf)
上的，想要了解透彻 MineAdmin 的生命周期，那么理解基层架构的生命周期也是至关重要的。

本文将不再另行说明上述基层架构生命周期，如有兴趣请自行研究学习.
本文将更倾向与业务相关的生命周期描述

:::


## 双 Token 认证刷新

双Token机制是指在用户登录过程中，除了传统的`Access Token`外，还引入了一个额外的`Refresh Token`。`Access Token`主要用于验证用户身份和保持用户会话，
而`Refresh Token`则用于在`Access Token`过期后重新获取新的`Access Token`。这种设计可以在保证安全性的同时，
提供更好的用户体验。

::: tip

自 `MineAdmin >= 3.0` 版本起，我们默认提供的应用程序认证机制都是由两个 token 来实现交互刷新鉴权的
也就是 `AccessToken` 以及 `RefreshToken`

而关于 Jwt 的生成和鉴权则统一由 MineAdmin 接入 [lcobucci/jwt](https://github.com/lcobucci/jwt) 组件而实现的

:::

![时序图](./token.png)
