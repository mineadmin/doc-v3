# User Authentication

::: tip

MineAdmin's authentication flow is built by integrating the [mineadmin/auth-jwt](https://github.com/mineadmin/JwtAuth) component and the [mineadmin/jwt](https://github.com/mineadmin/jwt) component with [lcobucci/jwt](https://github.com/lcobucci/jwt). This article will focus on how to use JWT for user authentication in MineAdmin.

This article covers the basic usage of JWT authentication, security configuration, performance optimization, and best practices to help developers build a secure and reliable authentication system.

:::

## Overview of Authentication Mechanism

MineAdmin adopts a JWT (JSON Web Token) dual-token authentication mechanism:

- **access_token**: Used for accessing business interfaces, with a short validity period (default 1 hour).
- **refresh_token**: Used for seamlessly refreshing the access_token, with a longer validity period (default 2 hours).

This design ensures security while providing a good user experience.

## Security Configuration Guide

::: warning Important Security Reminders

1. **Key Security**: JWT keys must use strong random strings with a minimum length of 256 bits.
2. **Environment Isolation**: Production and testing environments must use different JWT keys.
3. **Transport Security**: Production environments must use HTTPS to transmit JWT tokens.
4. **Storage Security**: Clients should store tokens in a secure location (e.g., httpOnly cookie).
5. **Time Control**: Set token validity periods reasonably to avoid long-lived tokens.

:::

### JWT Key Generation

Generate secure JWT keys:

```bash
# Generate a 256-bit random key
openssl rand -base64 64

# Or use PHP to generate
php -r "echo base64_encode(random_bytes(64)) . PHP_EOL;"
```

## Quickly Get the Current User in a Controller

::: danger Dependency Injection Scope Limitation

It is not recommended to inject this object outside of a controller. To operate on a user within a service, pass the user instance into the service method.
This ensures the user is obtained within the HTTP request cycle.

**Reason Explanation**:
- `CurrentUser` depends on the JWT token from the request context.
- Using it in non-HTTP request environments (e.g., scheduled tasks, queue consumers) will cause errors.
- The Service layer should remain stateless for easier testing and maintenance.

:::

### Basic Usage

Use `App\Http\CurrentUser` to quickly obtain the user object for the current request. This class provides multiple convenient methods to access user information without querying the database every time.

### Core Methods Explanation

- `user()`: Gets the complete user model instance (triggers a database query).
- `id()`: Quickly gets the user ID (reads directly from the JWT token, no database query).
- `refresh()`: Refreshes the authentication token of the current user.
- `menus()`: Gets the list of menus the user has permission to access.
- `roles()`: Gets the user's role information.
- `isSystem()`: Checks if the user is a system user.
- `isSuperAdmin()`: Checks if the user is a super administrator.

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

    // Gets the current user model instance
    public function user(): ?User
    {
        return $this->userService->getInfo($this->id());
    }

    // Refreshes the current user's token, returns [access_token=>'xxx', refresh_token=>'xxx']
    public function refresh(): array
    {
        return $this->service->refreshToken($this->getToken());
    }

    // Quickly gets the current user id (without db query)
    public function id(): int
    {
        return (int) $this->getToken()->claims()->get(RegisteredClaims::ID);
    }

    /**
     * Used to get the current user's menu tree list
     * @return Collection<int,Menu>
     */
    public function menus(): Collection
    {
        // @phpstan-ignore-next-line
        return $this->user()->getMenus();
    }

    /**
     * Used to get the current user's role list [ [code=>'xxx', name=>'xxxx'] ]
     * @return Collection<int, Role>
     */
    public function roles(): Collection
    {
        // @phpstan-ignore-next-line
        return $this->user()->getRoles()->map(static fn (Role $role) => $role->only(['name', 'code', 'remark']));
    }

    // Checks if the current user's user_type is system category
    public function isSystem(): bool
    {
        return $this->user()->user_type === Type::SYSTEM;
    }

    // Checks if the current user has super admin privileges
    public function isSuperAdmin(): bool
    {
        return $this->user()->isSuperAdmin();
    }
}

```

:::

## Creating Separate JWT Generation Rules for External Programs

### Application Scenarios

In enterprise-level application development, it is often necessary to divide the system into multiple independent application domains:

- **Admin Backend**: A backend management system for administrators.
- **Frontend Application**: Application interfaces for end-users.
- **Third-party Integration**: API interfaces provided to partners.
- **Mobile Application**: Dedicated interfaces for iOS/Android and other mobile apps.

Each application domain should use an independent JWT configuration to achieve:
- **Security Isolation**: Different applications use different signing keys.
- **Permission Control**: Different applications have different permission scopes.
- **Independent Configuration**: Different applications can have different expiration times and other parameters.

### Implementation Steps

#### Step 1: Configure Environment Variables

Create independent JWT keys in the `.env` file. It is recommended to configure independent keys for each application domain:

```bash
# Admin Backend (Default)
JWT_SECRET=your_admin_secret_here

# Frontend API
JWT_API_SECRET=your_api_secret_here

# Mobile Application
JWT_MOBILE_SECRET=your_mobile_secret_here

# Third-party Partner
JWT_PARTNER_SECRET=your_partner_secret_here
```

#### Step 2: Configure JWT Scenarios

Create multiple scenario configurations in `config/autoload/jwt.php`:

#### Step 3: Create Dedicated Middleware

Create specialized token validation middleware for each application domain:

#### Step 4: Use Middleware in Controllers

Use the corresponding middleware for user validation in the respective controllers:

#### Step 5: Extend Authentication Service

Add the corresponding login method in `PassportService`:

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
    // Default scenario: Admin Backend
    'default' => [
        // jwt configuration https://lcobucci-jwt.readthedocs.io/en/latest/
        'driver' => Jwt::class,
        // jwt signing key
        'key' => InMemory::base64Encoded(env('JWT_SECRET')),
        // jwt signing algorithm optional https://lcobucci-jwt.readthedocs.io/en/latest/supported-algorithms/
        'alg' => new Sha256(),
        // token expiration time in seconds (recommended shorter for admin backend)
        'ttl' => (int) env('JWT_TTL', 3600), // 1 hour
        // refresh token expiration time in seconds
        'refresh_ttl' => (int) env('JWT_REFRESH_TTL', 7200), // 2 hours
        // Blacklist mode
        'blacklist' => [
            // Whether to enable blacklist
            'enable' => env('JWT_BLACKLIST_ENABLE', true),
            // Blacklist cache prefix
            'prefix' => 'jwt_blacklist',
            // Blacklist cache driver
            'connection' => 'default',
            // Blacklist cache time. This time must be set slightly larger than the token expiration time; it is best to set it the same as the expiration time.
            'ttl' => (int) env('JWT_BLACKLIST_TTL', 7201),
        ],
        'claims' => [
            // Default jwt claims
            RegisteredClaims::ISSUER => (string) env('APP_NAME'),
            RegisteredClaims::AUDIENCE => 'admin', // Explicitly identify audience
        ],
    ],

    // Frontend API scenario
    'api' => [
        'key' => InMemory::base64Encoded(env('JWT_API_SECRET')),
        'ttl' => (int) env('JWT_API_TTL', 7200), // 2 hours, can be longer for frontend
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
        'ttl' => (int) env('JWT_PARTNER_TTL', 3600), // 1 hour, recommended short-term for third parties
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
        // Specify the scenario name created in the previous step
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
        summary: 'System Login',
        tags: ['api:passport']
    )]
    #[ResultResponse(
        instance: new Result(data: new PassportLoginVo()),
        title: 'Login Successful',
        description: 'Returns object on successful login',
        example: '{"code":200,"message":"Success","data":{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MjIwOTQwNTYsIm5iZiI6MTcyMjA5NDAiwiZXhwIjoxNzIyMDk0MzU2fQ.7EKiNHb_ZeLJ1NArDpmK6sdlP7NsDecsTKLSZn_3D7k","refresh_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MjIwOTQwNTYsIm5iZiI6MTcyMjA5NDAiwiZXhwIjoxNzIyMDk0MzU2fQ.7EKiNHb_ZeLJ1NArDpmK6sdlP7NsDecsTKLSZn_3D7k","expire_at":300}}'
    )]
    #[OA\RequestBody(content: new OA\JsonContent(
        ref: LoginRequest::class,
        title: 'Login Request Parameters',
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
        // Fill in the scenario value from the previous step
        return $this->jwtFactory->get('api');
    }

    public function getJwt(): JwtInterface
    {
        return $this->jwtFactory->get($this->jwt);
    }
```

:::

## Detailed Explanation of JWT Core Concepts

::: tip JWT Basics

If you are not familiar with the basic concepts of JWT (JSON Web Token), it is recommended to first read the [JWT Official Documentation](https://jwt.io/introduction) to understand the fundamental principles.

:::

### JWT Structure Analysis

JWT consists of three parts, separated by dots (.):

```
header.payload.signature
```

#### 1. Header
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

#### 2. Payload
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

Field Explanation:
- `id`: User ID
- `iss`: Issuer
- `aud`: Audience
- `exp`: Expiration Time
- `iat`: Issued At
- `nbf`: Not Before

#### 3. Signature
```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

### Detailed Explanation of Dual-Token Authentication Mechanism

MineAdmin adopts a dual-token design, which is the best balance between security and user experience.

#### Token Type Comparison

| Feature     | Access Token     | Refresh Token     |
|-------------|------------------|-------------------|
| **Purpose** | Business interface access | Refresh access_token |
| **Validity** | Short-term (1-4 hours) | Long-term (2-24 hours) |
| **Usage Frequency** | Every API call | Only used during refresh |
| **Security Risk** | Low (short-term validity) | Medium (requires careful storage) |
| **Storage Location** | Memory/Temporary storage | Secure storage |

#### Dual-Token Workflow

```mermaid
sequenceDiagram
    participant Client as Client
    participant Server as Server
    participant Redis as Redis Cache

    Client->>Server: 1. Login Request
    Server->>Redis: 2. Verify User Credentials
    Server->>Client: 3. Return access_token + refresh_token

    loop Business Requests
        Client->>Server: 4. Carry access_token to access API
        Server->>Client: 5. Return Business Data
    end

    Client->>Server: 6. access_token expired, use refresh_token to refresh
    Server->>Redis: 7. Verify refresh_token and mark as used
    Server->>Client: 8. Return new access_token + refresh_token
```

#### Token Content Differences

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

Key Field Explanation:
- `sub`: Identifies this as a refresh token
- `exp`: Longer expiration time

#### Key Differences Explanation

1. **`sub` Declaration**: The refresh_token contains the `"sub": "refresh"` declaration to identify its purpose.
2. **Usage Restriction**: Each refresh_token can only be used once and becomes invalid immediately after use.
3. **Security Mechanism**: A completely new token pair is generated during refresh to prevent token replay attacks.

### Middleware Validation Mechanism

MineAdmin provides two specialized middleware to handle different types of tokens:

#### AccessTokenMiddleware
- **Responsibility**: Validates business access tokens.
- **Application Scenario**: All business interfaces requiring user identity authentication.
- **Validation Logic**: Checks token validity, blacklist status, permission scope, etc.

#### RefreshTokenMiddleware
- **Responsibility**: Validates refresh tokens.
- **Application Scenario**: Only used for token refresh interfaces.
- **Validation Logic**: Checks the `sub` declaration, single-use restriction, etc.

#### Custom Middleware Example

```php
namespace App\Http\Common\Middleware;

use Mine\JwtAuth\Middleware\AbstractTokenMiddleware;

class CustomTokenMiddleware extends AbstractTokenMiddleware
{
    public function getJwt(): JwtInterface
    {
        // Specify the JWT scenario to use
        return $this->jwtFactory->get('api');
    }

    protected function validateCustomClaims(UnencryptedToken $token): void
    {
        // Custom validation logic
        $audience = $token->claims()->get(RegisteredClaims::AUDIENCE);
        if ($audience !== 'api') {
            throw new InvalidTokenException('Invalid token audience');
        }
    }
}
```

### Security Considerations

#### 1. Token Lifecycle Management
- Access tokens should have a short validity period (1-4 hours).
- Refresh tokens should have a moderate validity period (2-24 hours).
- Avoid setting tokens that never expire.

#### 2. Blacklist Mechanism
- Tokens should be added to the blacklist upon logout.
- All tokens should be invalidated when a password is changed.
- Periodically clean up expired blacklist records.

#### 3. Secure Storage
- Clients should securely store the refresh token.
- Avoid placing sensitive information in the JWT payload.
- Use HTTPS for all requests containing tokens.

## Security Best Practices

### 1. Production Environment Security Configuration

::: danger Must Read for Production Environment

Please ensure you check the following security configurations before deploying to production:

:::

```php
// .env Production Environment Configuration Example
JWT_SECRET=your_super_secure_256_bit_key_here
JWT_API_SECRET=another_super_secure_256_bit_key_here
JWT_TTL=3600          // 1 hour, recommended no more than 4 hours
JWT_REFRESH_TTL=7200  // 2 hours, recommended no more than 24 hours
JWT_BLACKLIST_TTL=7201 // 1 second longer than refresh_ttl
```