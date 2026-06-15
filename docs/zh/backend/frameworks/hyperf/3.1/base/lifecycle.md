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

默认提供的应用程序认证机制都是由两个 token 来实现交互刷新鉴权的
也就是 `AccessToken` 以及 `RefreshToken`

而关于 Jwt 的生成和鉴权则统一由 MineAdmin 接入 [lcobucci/jwt](https://github.com/lcobucci/jwt) 组件而实现的

:::

---

### 时序图

```plantuml
participant "客户端" as Client
participant "服务端" as Server

Client -> Server : 登录请求
Server -> Client : 登录成功，返回 access_token 和 refresh_token
Client -> Local : 存储 access_token 和 refresh_token 到本地

Client -> Server : 发送请求
Server -> Client : 返回 401 错误码且本地 refresh_token 未过期
Client -> Queue : 暂存请求信息
Client -> Server : 用 refresh_token 换取新 token
alt 换 token 接口返回 401
    Client -> Local : 清除本地缓存
    Client -> Server : 重定向到登录页面
else 换 token 成功
    Client -> Local : 更新本地 token
    Client -> Server : 重试请求失败的接口
end
```

### 流程图

```plantuml
start
:登录成功;
->
:存储 access_token 和 refresh_token 到本地;
->
:发送请求;
if (请求失败，code = 401 且本地 refresh_token 未过期) then (yes)
->
:暂存请求信息到队列;
->
:用 refresh_token 换新 token;
if (换 token 接口返回 401) then (yes)
->
:清除本地缓存，重定向到登录页面;
else (no)
->
:更新本地 token，重试请求失败的接口;
endif
else (no)
endif
```

### 讲解

在登录成功后，将 access token 与 refresh token 存储于本地。

当某次请求出现失败，且错误码为 401，同时本地的 refresh_token 未过期时，需先将当前请求信息暂存至队列中。此队列旨在防止同一时刻多个请求同时去刷新 token。

随后，利用 refresh token 换取新的 access_token 与 refresh_token。

倘若换 token 的接口同样返回 401 错误码，则意味着 access_token 与 refresh_token 均已过期，此时需清除本地缓存，并重定向至登录页面。

若换 token 成功，则需更新本地 token，并重试之前失败的请求。

---

