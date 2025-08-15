# User Authentication

::: tip

MineAdmin's authentication process is built using the [mineadmin/auth-jwt](https://github.com/mineadmin/JwtAuth) component combined with [mineadmin/jwt](https://github.com/mineadmin/jwt) component, which integrates [lcobucci/jwt](https://github.com/lcobucci/jwt). This document focuses on explaining how to use JWT for user authentication in MineAdmin.

This guide covers basic JWT authentication usage, security configurations, performance optimization, and best practices to help developers build secure and reliable authentication systems.

:::

## Authentication Mechanism Overview

MineAdmin employs a dual-token JWT (JSON Web Token) authentication mechanism:

- **access_token**: Used for business interface access with short validity (default 1 hour)
- **refresh_token**: Used for seamless refresh of access_token with longer validity (default 2 hours)

This design ensures security while providing good user experience.

## Security Configuration Guide

::: warning Important Security Reminders

1. **Key Security**: JWT keys must use strong random strings with minimum 256-bit length
2. **Environment Isolation**: Production and testing environments must use different JWT keys
3. **Transmission Security**: Production environments must use HTTPS for JWT token transmission
4. **Storage Security**: Clients should store tokens securely (e.g., httpOnly cookies)
5. **Time Control**: Set reasonable token expiration times to avoid long-lived tokens

:::

### JWT Key Generation

Generate secure JWT keys:

```bash
# Generate 256-bit random key
openssl rand -base64 64

# Or generate using PHP
php -r "echo base64_encode(random_bytes(64)) . PHP_EOL;"
```

## Quickly Retrieve Current User in Controllers

::: danger Dependency Injection Scope Limitation

It is not recommended to inject this object outside controllers. For user operations in services, the user instance should be passed to service methods to ensure user retrieval occurs within the HTTP request lifecycle.

**Reasoning**:
- `CurrentUser` depends on JWT token in request context
- Using in non-HTTP environments (e.g., scheduled tasks, queue consumers) causes errors
- Service layer should remain stateless for easier testing and maintenance

:::

### Basic Usage

Use `App\Http\CurrentUser` to quickly retrieve the current request's user object. This class provides various convenient methods to access user information without repeated database queries.

### Core Method Descriptions

- `user()`: Gets complete user model instance (triggers database query)
- `id()`: Quickly retrieves user ID (read directly from JWT token, no database query)
- `refresh()`: Refreshes current user's authentication token
- `menus()`: Gets user's authorized menu list
- `roles()`: Gets user's role information
- `isSystem()`: Checks if user is system type
- `isSuperAdmin()`: Checks if user has super admin privileges

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
    
    // Get current user model instance
    public function user(): ?User
    {
        return $this->userService->getInfo($this->id());
    }

    // Refresh current user's token, returns [access_token=>'xxx',refresh_token=>'xxx']
    public function refresh(): array
    {
        return $this->service->refreshToken($this->getToken());
    }

    // Quickly get current user ID (no DB query)
    public function id(): int
    {
        return (int) $this->getToken()->claims()->get(RegisteredClaims::ID);
    }

    /**
     * Gets current user's menu tree list
     * @return Collection<int,Menu>
     */
    public function menus(): Collection
    {
        // @phpstan-ignore-next-line
        return $this->user()->getMenus();
    }

    /**
     * Gets current user's role list [ [code=>'xxx',name=>'xxxx'] ]
     * @return Collection<int, Role>
     */
    public function roles(): Collection
    {
        // @phpstan-ignore-next-line
        return $this->user()->getRoles()->map(static fn (Role $role) => $role->only(['name', 'code', 'remark']));
    }

    // Checks if current user's user_type is system category
    public function isSystem(): bool
    {
        return $this->user()->user_type === Type::SYSTEM;
    }

    // Checks if current user has super admin privileges
    public function isSuperAdmin(): bool
    {
        return $this->user()->isSuperAdmin();
    }
}

```

:::

## Creating Separate JWT Generation Rules for External Programs

### Use Cases

In enterprise application development, systems are typically divided into multiple independent application domains:

- **Admin Backend**: Management system for administrators
- **Frontend Application**: Interfaces for end users
- **Third-party Integration**: API interfaces for partners
- **Mobile Applications**: Dedicated interfaces for iOS/Android

Each application domain should use independent JWT configurations to achieve:
- **Security Isolation**: Different applications use different signing keys
- **Permission Control**: Different applications have different permission scopes
- **Independent Configuration**: Different expiration times can be set per application

### Implementation Steps

#### Step 1: Configure Environment Variables

Create independent JWT keys in `.env` file. Recommended to configure separate keys per application domain:

```bash
# Admin backend (default)
JWT_SECRET=your_admin_secret_here

# Frontend API
JWT_API_SECRET=your_api_secret_here

# Mobile applications
JWT_MOBILE_SECRET=your_mobile_secret_here

# Third-party integration
JWT_PARTNER_SECRET=your_partner_secret_here
```

#### Step 2: Configure JWT Scenarios

Create multiple scenario configurations in `config/autoload/jwt.php`:

#### Step 3: Create Dedicated Middleware

Create specialized token validation middleware for each application domain:

#### Step 4: Use Middleware in Controllers

Use corresponding middleware for user validation in controllers:

#### Step 5: Extend Authentication Service

Add corresponding login methods in `PassportService`:

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
    // Default scenario: Admin backend
    'default' => [
        // jwt config https://lcobucci-jwt.readthedocs.io/en/latest/
        'driver' => Jwt::class,
        // jwt signing key
        'key' => InMemory::base64Encoded(env('JWT_SECRET')),
        // jwt signing algorithm options https://lcobucci-jwt.readthedocs.io/en/latest/supported-algorithms/
        'alg' => new Sha256(),
        // token expiration time in seconds (shorter for admin backend)
        'ttl' => (int) env('JWT_TTL', 3600), // 1 hour
        // refresh token expiration time in seconds
        'refresh_ttl' => (int) env('JWT_REFRESH_TTL', 7200), // 2 hours
        // blacklist mode
        'blacklist' => [
            // whether to enable blacklist
            'enable' => env('JWT_BLACKLIST_ENABLE', true),
            // blacklist cache prefix
            'prefix' => 'jwt_blacklist',
            // blacklist cache driver
            'connection' => 'default',
            // blacklist cache time must be slightly longer than token expiration, preferably same
            'ttl' => (int) env('JWT_BLACKLIST_TTL', 7201),
        ],
        'claims' => [
            // default jwt claims
            RegisteredClaims::ISSUER => (string) env('APP_NAME'),
            RegisteredClaims::AUDIENCE => 'admin', // explicitly identify audience
        ],
    ],
    
    // Frontend API scenario
    'api' => [
        'key' => InMemory::base64Encoded(env('JWT_API_SECRET')),
        'ttl' => (int) env('JWT_API_TTL', 7200), // 2 hours, longer for frontend
        'refresh_ttl' => (int) env('JWT_API_REFRESH_TTL', 86400), // 24 hours
        'claims' => [
            RegisteredClaims::ISSUER => (string) env('APP_NAME'),
            RegisteredClaims::AUDIENCE => 'api',
        ],
    ],
    
    // Mobile scenario
    'mobile' => [
        'key' => InMemory::base64Encoded(env('JWT_MOBILE_SECRET')),
        'ttl' => (int) env('JWT_MOBILE_TTL', 86400), // 24 hours, longer for mobile
        'refresh_ttl' => (int) env('JWT_MOBILE_REFRESH_TTL', 604800), // 7 days
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
    
    // Third-party partner scenario
    'partner' => [
        'key' => InMemory::base64Encoded(env('JWT_PARTNER_SECRET')),
        'ttl' => (int) env('JWT_PARTNER_TTL', 3600), // 1 hour, short-term for third-party
        'refresh_ttl' => (int) env('JWT_PARTNER_REFRESH_TTL', 7200), // 2 hours
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
        // Specify scenario name from previous step
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
        summary: 'System login',
        tags: ['api:passport']
    )]
    #[ResultResponse(
        instance: new Result(data: new PassportLoginVo()),
        title: 'Login successful',
        description: 'Login successful response object',
        example: '{"code":200,"message":"Success","data":{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MjIwOTQwNTYsIm5iZiI6MTcyMjA5NDAiwiZXhwIjoxNzIyMDk0MzU2fQ.7EKiNHb_ZeLJ1NArDpmK6sdlP7NsDecsTKLSZn_3D7k","refresh_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MjIwOTQwNTYsIm5iZiI6MTcyMjA5NDAiwiZXhwIjoxNzIyMDk0MzU2fQ.7EKiNHb_ZeLJ1NArDpmK6sdlP7NsDecsTKLSZn_3D7k","expire_at":300}}'
    )]
    #[OA\RequestBody(content: new OA\JsonContent(
        ref: LoginRequest::class,
        title: 'Login request parameters',
        required: ['username', 'password'],
        example: '{"username":"admin","password":"123456"}'
    ))]
    public function loginApi(LoginRequest $request): Result
    {
        $username = (string) $request->input('username');
        $password = (string) $request->input('password');
        $ip = Arr::first(array: $request->getClientIps(), callback: static fn ($val) => $val ?: null, default: '0.0.0.0');
        $browser = $request->header('User-Agent') ?: 'unknown';
        // todo get user system
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
     * @var string jwt scenario
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
        return