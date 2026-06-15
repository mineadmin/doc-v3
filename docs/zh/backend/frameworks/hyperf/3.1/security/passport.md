# 用户认证

::: tip

MineAdmin 的认证流程由 [mineadmin/auth-jwt](https://github.com/mineadmin/JwtAuth) 组件加 [mineadmin/jwt](https://github.com/mineadmin/jwt) 组件接入 [lcobucci/jwt](https://github.com/lcobucci/jwt)
构建而成，本文将着重讲解如何在 MineAdmin 中使用 JWT 进行用户认证。

本文涵盖 JWT 认证的基本使用、安全配置、性能优化以及最佳实践，帮助开发者构建安全可靠的认证系统。

:::

## 认证机制概述

MineAdmin 采用 JWT（JSON Web Token）双 token 认证机制：

- **access_token**: 用于业务接口访问，有效期较短（默认 1 小时）
- **refresh_token**: 用于无感刷新 access_token，有效期较长（默认 2 小时）

这种设计在保证安全性的同时，提供了良好的用户体验。

## 安全配置指南

::: warning 重要安全提醒

1. **密钥安全**: JWT 密钥必须使用强随机字符串，长度至少 256 位
2. **环境隔离**: 生产环境和测试环境必须使用不同的 JWT 密钥
3. **传输安全**: 生产环境必须使用 HTTPS 传输 JWT token
4. **存储安全**: 客户端应将 token 存储在安全的地方（如 httpOnly cookie）
5. **时效控制**: 合理设置 token 有效期，避免长期有效的 token

:::

### JWT 密钥生成

生成安全的 JWT 密钥：

```bash
# 生成 256 位随机密钥
openssl rand -base64 64

# 或使用 PHP 生成
php -r "echo base64_encode(random_bytes(64)) . PHP_EOL;"
```

## 在控制器中快速获取当前用户

::: danger 依赖注入范围限制

不建议在控制器以外注入此对象。对于 service 中操作 user、应将 user 实例传入到 service 方法中
从而保证获取用户是在 http 请求周期内。

**原因说明**：
- `CurrentUser` 依赖于请求上下文中的 JWT token
- 在非 HTTP 请求环境（如定时任务、队列消费者）中使用会导致错误
- Service 层应该保持无状态，便于测试和维护

:::

### 基本用法

使用 `App\Http\CurrentUser` 快速获取当前请求的用户对象。该类提供了多种便捷方法来访问用户信息，无需每次都查询数据库。

### 核心方法说明

- `user()`: 获取完整的用户模型实例（会触发数据库查询）
- `id()`: 快速获取用户 ID（从 JWT token 直接读取，无数据库查询）
- `refresh()`: 刷新当前用户的认证 token
- `menus()`: 获取用户有权限的菜单列表
- `roles()`: 获取用户的角色信息
- `isSystem()`: 判断是否为系统用户
- `isSuperAdmin()`: 判断是否为超级管理员

::: code-group

```php{2,5,8} [TestController]

#[Middleware(AccessTokenMiddleware::class)]
class TestController {
    
    public function __construct(private readonly CurrentUser $currentUser){};
    
    public function test(){
        return $this->success('CurrentUser: '. $this->currentUser->user()->username);
    }
    
    

}
```

```php [CurrentUser]
<?php

declare(strict_types=1);
/**
 * This file is part of MineAdmin.
 *
 * @link     https://www.mineadmin.com
 * @document https://doc.mineadmin.com
 * @contact  root@imoi.cn
 * @license  https://github.com/mineadmin/MineAdmin/blob/master/LICENSE
 */

namespace App\Http;

use App\Model\Enums\User\Type;
use App\Model\Permission\Menu;
use App\Model\Permission\Role;
use App\Model\Permission\User;
use App\Service\PassportService;
use App\Service\Permission\UserService;
use Hyperf\Collection\Collection;
use Lcobucci\JWT\Token\RegisteredClaims;
use Mine\Jwt\Traits\RequestScopedTokenTrait;

final class CurrentUser
{
    use RequestScopedTokenTrait;

    public function __construct(
        private readonly PassportService $service,
        private readonly UserService $userService
    ) {}
    
    // 获取当前用户 model 实例
    public function user(): ?User
    {
        return $this->userService->getInfo($this->id());
    }

    // 刷新当前用户的 token、返回 [access_token=>'xxx',refresh_token=>'xxx']
    public function refresh(): array
    {
        return $this->service->refreshToken($this->getToken());
    }

    // 快速获取当前用户 id （不走 db 查询)
    public function id(): int
    {
        return (int) $this->getToken()->claims()->get(RegisteredClaims::ID);
    }

    /**
     * 用于获取当前用户的 菜单树状列表
     * @return Collection<int,Menu>
     */
    public function menus(): Collection
    {
        // @phpstan-ignore-next-line
        return $this->user()->getMenus();
    }

    /**
     * 用于获取当前用户的角色列表 [ [code=>'xxx',name=>'xxxx'] ]
     * @return Collection<int, Role>
     */
    public function roles(): Collection
    {
        // @phpstan-ignore-next-line
        return $this->user()->getRoles()->map(static fn (Role $role) => $role->only(['name', 'code', 'remark']));
    }

    // 判断当前用户的 user_type 是否为 system 类别
    public function isSystem(): bool
    {
        return $this->user()->user_type === Type::SYSTEM;
    }

    // 判断当前用户是否具有超管权限
    public function isSuperAdmin(): bool
    {
        return $this->user()->isSuperAdmin();
    }
}

```

:::

## 为外部程序创建单独的 JWT 生成规则

### 应用场景

在企业级应用开发中，通常需要将系统分为多个独立的应用域：

- **管理后台**：供管理员使用的后台管理系统
- **前台应用**：面向最终用户的应用接口
- **第三方接入**：提供给合作伙伴的 API 接口
- **移动端应用**：iOS/Android 等移动端专用接口

每个应用域都应该使用独立的 JWT 配置，以实现：
- **安全隔离**：不同应用使用不同的签名密钥
- **权限控制**：不同应用有不同的权限范围
- **配置独立**：可以为不同应用设置不同的过期时间等参数

### 实施步骤

#### 步骤 1: 配置环境变量

在 `.env` 文件中新建独立的 JWT 密钥。建议为每个应用域配置独立的密钥：

```bash
# 管理后台（默认）
JWT_SECRET=your_admin_secret_here

# 前台 API
JWT_API_SECRET=your_api_secret_here

# 移动端应用
JWT_MOBILE_SECRET=your_mobile_secret_here

# 第三方接入
JWT_PARTNER_SECRET=your_partner_secret_here
```

#### 步骤 2: 配置 JWT 场景

在 `config/autoload/jwt.php` 中新建多个场景配置：

#### 步骤 3: 创建专用中间件

为每个应用域创建专门的 token 验证中间件：

#### 步骤 4: 控制器中使用中间件

在对应的控制器中使用相应的中间件进行用户验证：

#### 步骤 5: 扩展认证服务

在 `PassportService` 中新增对应的登录方法：

::: code-group

```php[.env]
#other ...

MINE_API_SECERT=azOVxsOWt3r0ozZNz8Ss429ht0T8z6OpeIJAIwNp6X0xqrbEY2epfIWyxtC1qSNM8eD6/LQ/SahcQi2ByXa/2A==

```

```php{46-80} [jwt.php]
// config/autoload/jwt.php
<?php

declare(strict_types=1);
/**
 * This file is part of MineAdmin.
 *
 * @link     https://www.mineadmin.com
 * @document https://doc.mineadmin.com
 * @contact  root@imoi.cn
 * @license  https://github.com/mineadmin/MineAdmin/blob/master/LICENSE
 */
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lcobucci\JWT\Token\RegisteredClaims;
use Mine\Jwt\Jwt;

return [
    // 默认场景：管理后台
    'default' => [
        // jwt 配置 https://lcobucci-jwt.readthedocs.io/en/latest/
        'driver' => Jwt::class,
        // jwt 签名key
        'key' => InMemory::base64Encoded(env('JWT_SECRET')),
        // jwt 签名算法 可选 https://lcobucci-jwt.readthedocs.io/en/latest/supported-algorithms/
        'alg' => new Sha256(),
        // token过期时间，单位为秒 (管理后台建议短一些)
        'ttl' => (int) env('JWT_TTL', 3600), // 1小时
        // 刷新token过期时间，单位为秒
        'refresh_ttl' => (int) env('JWT_REFRESH_TTL', 7200), // 2小时
        // 黑名单模式
        'blacklist' => [
            // 是否开启黑名单
            'enable' => env('JWT_BLACKLIST_ENABLE', true),
            // 黑名单缓存前缀
            'prefix' => 'jwt_blacklist',
            // 黑名单缓存驱动
            'connection' => 'default',
            // 黑名单缓存时间 该时间一定要设置比token过期时间要大一点，最好设置跟过期时间一样
            'ttl' => (int) env('JWT_BLACKLIST_TTL', 7201),
        ],
        'claims' => [
            // 默认的jwt claims
            RegisteredClaims::ISSUER => (string) env('APP_NAME'),
            RegisteredClaims::AUDIENCE => 'admin', // 明确标识受众
        ],
    ],
    
    // 前台 API 场景
    'api' => [
        'key' => InMemory::base64Encoded(env('JWT_API_SECRET')),
        'ttl' => (int) env('JWT_API_TTL', 7200), // 2小时，前台可以长一些
        'refresh_ttl' => (int) env('JWT_API_REFRESH_TTL', 86400), // 24小时
        'claims' => [
            RegisteredClaims::ISSUER => (string) env('APP_NAME'),
            RegisteredClaims::AUDIENCE => 'api',
        ],
    ],
    
    // 移动端场景
    'mobile' => [
        'key' => InMemory::base64Encoded(env('JWT_MOBILE_SECRET')),
        'ttl' => (int) env('JWT_MOBILE_TTL', 86400), // 24小时，移动端更长
        'refresh_ttl' => (int) env('JWT_MOBILE_REFRESH_TTL', 604800), // 7天
        'blacklist' => [
            'enable' => true,
            'prefix' => 'jwt_mobile_blacklist',
            'ttl' => (int) env('JWT_MOBILE_BLACKLIST_TTL', 604801),
        ],
        'claims' => [
            RegisteredClaims::ISSUER => (string) env('APP_NAME'),
            RegisteredClaims::AUDIENCE => 'mobile',
        ],
    ],
    
    // 第三方合作伙伴场景
    'partner' => [
        'key' => InMemory::base64Encoded(env('JWT_PARTNER_SECRET')),
        'ttl' => (int) env('JWT_PARTNER_TTL', 3600), // 1小时，第三方建议短期
        'refresh_ttl' => (int) env('JWT_PARTNER_REFRESH_TTL', 7200), // 2小时
        'claims' => [
            RegisteredClaims::ISSUER => (string) env('APP_NAME'),
            RegisteredClaims::AUDIENCE => 'partner',
        ],
    ],
];


```

```php{20-24} [ApiTokenMiddleware]
<?php

declare(strict_types=1);
/**
 * This file is part of MineAdmin.
 *
 * @link     https://www.mineadmin.com
 * @document https://doc.mineadmin.com
 * @contact  root@imoi.cn
 * @license  https://github.com/mineadmin/MineAdmin/blob/master/LICENSE
 */

namespace App\Http\Api\Middleware;

use Mine\Jwt\JwtInterface;
use Mine\JwtAuth\Middleware\AbstractTokenMiddleware;

final class ApiTokenMiddleware extends AbstractTokenMiddleware
{
    public function getJwt(): JwtInterface
    {
        // 指定场景为 上一步新建的场景名称
        return $this->jwtFactory->get('api');
    }
}


```

```php{36-81} [TestController]
<?php

declare(strict_types=1);
/**
 * This file is part of MineAdmin.
 *
 * @link     https://www.mineadmin.com
 * @document https://doc.mineadmin.com
 * @contact  root@imoi.cn
 * @license  https://github.com/mineadmin/MineAdmin/blob/master/LICENSE
 */

namespace App\Http\Admin\Controller;

use App\Http\Admin\Request\Passport\LoginRequest;
use App\Http\Admin\Vo\PassportLoginVo;
use App\Http\Common\Controller\AbstractController;
use App\Http\Common\Middleware\AccessTokenMiddleware;
use App\Http\Common\Middleware\RefreshTokenMiddleware;
use App\Http\Common\Result;
use App\Http\CurrentUser;
use App\Model\Enums\User\Type;
use App\Schema\UserSchema;
use App\Service\PassportService;
use Hyperf\Collection\Arr;
use Hyperf\HttpServer\Annotation\Middleware;
use Hyperf\HttpServer\Contract\RequestInterface;
use Hyperf\Swagger\Annotation as OA;
use Hyperf\Swagger\Annotation\Post;
use Mine\Jwt\Traits\RequestScopedTokenTrait;
use Mine\Swagger\Attributes\ResultResponse;

#[OA\HyperfServer(name: 'http')]
final class PassportController extends AbstractController
{
    use RequestScopedTokenTrait;

    public function __construct(
        private readonly PassportService $passportService,
        private readonly CurrentUser $currentUser
    ) {}

    #[Post(
        path: '/admin/api/login',
        operationId: 'ApiLogin',
        summary: '系统登录',
        tags: ['api:passport']
    )]
    #[ResultResponse(
        instance: new Result(data: new PassportLoginVo()),
        title: '登录成功',
        description: '登录成功返回对象',
        example: '{"code":200,"message":"成功","data":{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MjIwOTQwNTYsIm5iZiI6MTcyMjA5NDAiwiZXhwIjoxNzIyMDk0MzU2fQ.7EKiNHb_ZeLJ1NArDpmK6sdlP7NsDecsTKLSZn_3D7k","refresh_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MjIwOTQwNTYsIm5iZiI6MTcyMjA5NDAiwiZXhwIjoxNzIyMDk0MzU2fQ.7EKiNHb_ZeLJ1NArDpmK6sdlP7NsDecsTKLSZn_3D7k","expire_at":300}}'
    )]
    #[OA\RequestBody(content: new OA\JsonContent(
        ref: LoginRequest::class,
        title: '登录请求参数',
        required: ['username', 'password'],
        example: '{"username":"admin","password":"123456"}'
    ))]
    public function loginApi(LoginRequest $request): Result
    {
        $username = (string) $request->input('username');
        $password = (string) $request->input('password');
        $ip = Arr::first(array: $request->getClientIps(), callback: static fn ($val) => $val ?: null, default: '0.0.0.0');
        $browser = $request->header('User-Agent') ?: 'unknown';
        // todo 用户系统的获取
        $os = $request->header('User-Agent') ?: 'unknown';

        return $this->success(
            $this->passportService->loginApi(
                $username,
                $password,
                Type::User,
                $ip,
                $browser,
                $os
            )
        );
    }

```

```php{48-70} [PassportService]
namespace App\Service;

use App\Exception\BusinessException;
use App\Exception\JwtInBlackException;
use App\Http\Common\ResultCode;
use App\Model\Enums\User\Type;
use App\Repository\Permission\UserRepository;
use Lcobucci\JWT\Token\RegisteredClaims;
use Lcobucci\JWT\UnencryptedToken;
use Mine\Jwt\Factory;
use Mine\Jwt\JwtInterface;
use Mine\JwtAuth\Event\UserLoginEvent;
use Mine\JwtAuth\Interfaces\CheckTokenInterface;
use Psr\EventDispatcher\EventDispatcherInterface;

final class PassportService extends IService implements CheckTokenInterface
{
    /**
     * @var string jwt场景
     */
    private string $jwt = 'default';

    public function __construct(
        protected readonly UserRepository $repository,
        protected readonly Factory $jwtFactory,
        protected readonly EventDispatcherInterface $dispatcher
    ) {}

    /**
     * @return array<string,int|string>
     */
    public function login(string $username, string $password, Type $userType = Type::SYSTEM, string $ip = '0.0.0.0', string $browser = 'unknown', string $os = 'unknown'): array
    {
        $user = $this->repository->findByUnameType($username, $userType);
        if (! $user->verifyPassword($password)) {
            $this->dispatcher->dispatch(new UserLoginEvent($user, $ip, $os, $browser, false));
            throw new BusinessException(ResultCode::UNPROCESSABLE_ENTITY, trans('auth.password_error'));
        }
        $this->dispatcher->dispatch(new UserLoginEvent($user, $ip, $os, $browser));
        $jwt = $this->getJwt();
        return [
            'access_token' => $jwt->builderAccessToken((string) $user->id)->toString(),
            'refresh_token' => $jwt->builderRefreshToken((string) $user->id)->toString(),
            'expire_at' => (int) $jwt->getConfig('ttl', 0),
        ];
    }
    
   /**
     * @return array<string,int|string>
     */
    public function loginApi(string $username, string $password, Type $userType = Type::SYSTEM, string $ip = '0.0.0.0', string $browser = 'unknown', string $os = 'unknown'): array
    {
        $user = $this->repository->findByUnameType($username, $userType);
        if (! $user->verifyPassword($password)) {
            $this->dispatcher->dispatch(new UserLoginEvent($user, $ip, $os, $browser, false));
            throw new BusinessException(ResultCode::UNPROCESSABLE_ENTITY, trans('auth.password_error'));
        }
        $this->dispatcher->dispatch(new UserLoginEvent($user, $ip, $os, $browser));
        $jwt = $this->getApiJwt();
        return [
            'access_token' => $jwt->builderAccessToken((string) $user->id)->toString(),
            'refresh_token' => $jwt->builderRefreshToken((string) $user->id)->toString(),
            'expire_at' => (int) $jwt->getConfig('ttl', 0),
        ];
    }
    
    public function getApiJwt(): JwtInterface{
        // 填写上一步的场景值
        return $this->jwtFactory->get('api');
    }
    
    public function getJwt(): JwtInterface
    {
        return $this->jwtFactory->get($this->jwt);
    }
```

:::


## JWT 核心概念详解

::: tip JWT 基础知识

如果您对 JWT（JSON Web Token）的基础概念还不够熟悉，建议先阅读 [JWT 官方文档](https://jwt.io/introduction) 了解基本原理。

:::

### JWT 结构分析

JWT 由三部分组成，用点（.）分隔：

```
header.payload.signature
```

#### 1. Header（头部）
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

#### 2. Payload（载荷）
```json
{
  "id": "123",
  "iss": "MineAdmin",
  "aud": "admin",
  "exp": 1640995200,
  "iat": 1640991600,
  "nbf": 1640991600
}
```

字段说明：
- `id`: 用户 ID
- `iss`: 签发者（Issuer）
- `aud`: 受众（Audience）
- `exp`: 过期时间（Expiration Time）
- `iat`: 签发时间（Issued At）
- `nbf`: 生效时间（Not Before）

#### 3. Signature（签名）
```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

### 双 Token 认证机制详解

MineAdmin 采用双 token 设计，这是一种安全性和用户体验的最佳平衡方案。

#### Token 类型对比

| 特性       | Access Token     | Refresh Token     |
|------------|------------------|-------------------|
| **用途**   | 业务接口访问     | 刷新 access_token |
| **有效期** | 短期（1-4小时）  | 长期（2-24小时）  |
| **使用频率** | 每次 API 调用   | 仅在刷新时使用    |
| **安全风险** | 低（短期有效）   | 中（需妥善保管）  |
| **存储位置** | 内存/临时存储    | 安全存储          |

#### 双 Token 工作流程

```mermaid
sequenceDiagram
    participant Client as 客户端
    participant Server as 服务器
    participant Redis as Redis缓存

    Client->>Server: 1. 登录请求
    Server->>Redis: 2. 验证用户凭据
    Server->>Client: 3. 返回 access_token + refresh_token
    
    loop 业务请求
        Client->>Server: 4. 携带 access_token 访问 API
        Server->>Client: 5. 返回业务数据
    end
    
    Client->>Server: 6. access_token 过期，使用 refresh_token 刷新
    Server->>Redis: 7. 验证 refresh_token 并标记为已使用
    Server->>Client: 8. 返回新的 access_token + refresh_token
```

#### Token 内容差异

**Access Token Claims:**
```json
{
  "id": "123",
  "iss": "MineAdmin", 
  "aud": "admin",
  "exp": 1640995200,
  "iat": 1640991600,
  "nbf": 1640991600
}
```

**Refresh Token Claims:**
```json
{
  "id": "123",
  "iss": "MineAdmin",
  "aud": "admin", 
  "sub": "refresh",
  "exp": 1641002400,
  "iat": 1640991600,
  "nbf": 1640991600
}
```

关键字段说明：
- `sub`: 标识这是刷新 token
- `exp`: 更长的过期时间

#### 关键差异说明

1. **`sub` 声明**: refresh_token 包含 `"sub": "refresh"` 声明，用于标识其用途
2. **使用限制**: 每个 refresh_token 只能使用一次，使用后立即失效
3. **安全机制**: 刷新时会生成全新的 token 对，防止 token 重放攻击

### 中间件验证机制

MineAdmin 提供了两个专门的中间件来处理不同类型的 token：

#### AccessTokenMiddleware
- **职责**: 验证业务访问 token
- **应用场景**: 所有需要用户身份认证的业务接口
- **验证逻辑**: 检查 token 有效性、是否在黑名单、权限范围等

#### RefreshTokenMiddleware  
- **职责**: 验证刷新 token
- **应用场景**: 仅用于 token 刷新接口
- **验证逻辑**: 检查 `sub` 声明、一次性使用限制等

#### 自定义中间件示例

```php
namespace App\Http\Common\Middleware;

use Mine\JwtAuth\Middleware\AbstractTokenMiddleware;

class CustomTokenMiddleware extends AbstractTokenMiddleware
{
    public function getJwt(): JwtInterface
    {
        // 指定使用的 JWT 场景
        return $this->jwtFactory->get('api');
    }
    
    protected function validateCustomClaims(UnencryptedToken $token): void
    {
        // 自定义验证逻辑
        $audience = $token->claims()->get(RegisteredClaims::AUDIENCE);
        if ($audience !== 'api') {
            throw new InvalidTokenException('Invalid token audience');
        }
    }
}
```

### 安全考虑

#### 1. Token 生命周期管理
- Access token 应该设置较短的有效期（1-4小时）
- Refresh token 有效期应该适中（2-24小时）
- 避免设置永不过期的 token

#### 2. 黑名单机制
- 登出时应该将 token 加入黑名单
- 密码修改时应该使所有 token 失效
- 定期清理过期的黑名单记录

#### 3. 安全存储
- 客户端应该安全存储 refresh token
- 避免将敏感信息放入 JWT payload
- 使用 HTTPS 传输所有包含 token 的请求

## 安全最佳实践

### 1. 生产环境安全配置

::: danger 生产环境必读

在生产环境部署前，请务必检查以下安全配置：

:::

```php
// .env 生产环境配置示例
JWT_SECRET=your_super_secure_256_bit_key_here
JWT_API_SECRET=another_super_secure_256_bit_key_here
JWT_TTL=3600          // 1小时，建议不超过4小时
JWT_REFRESH_TTL=7200  // 2小时，建议不超过24小时
JWT_BLACKLIST_TTL=7201 // 比 refresh_ttl 多1秒
```