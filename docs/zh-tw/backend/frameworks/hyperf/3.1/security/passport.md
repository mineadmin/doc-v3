# 使用者認證

::: tip

MineAdmin 的認證流程由 [mineadmin/auth-jwt](https://github.com/mineadmin/JwtAuth) 元件加 [mineadmin/jwt](https://github.com/mineadmin/jwt) 元件接入 [lcobucci/jwt](https://github.com/lcobucci/jwt)
構建而成，本文將著重講解如何在 MineAdmin 中使用 JWT 進行使用者認證。

本文涵蓋 JWT 認證的基本使用、安全配置、效能最佳化以及最佳實踐，幫助開發者構建安全可靠的認證系統。

:::

## 認證機制概述

MineAdmin 採用 JWT（JSON Web Token）雙 token 認證機制：

- **access_token**: 用於業務介面訪問，有效期較短（預設 1 小時）
- **refresh_token**: 用於無感重新整理 access_token，有效期較長（預設 2 小時）

這種設計在保證安全性的同時，提供了良好的使用者體驗。

## 安全配置指南

::: warning 重要安全提醒

1. **金鑰安全**: JWT 金鑰必須使用強隨機字串，長度至少 256 位
2. **環境隔離**: 生產環境和測試環境必須使用不同的 JWT 金鑰
3. **傳輸安全**: 生產環境必須使用 HTTPS 傳輸 JWT token
4. **儲存安全**: 客戶端應將 token 儲存在安全的地方（如 httpOnly cookie）
5. **時效控制**: 合理設定 token 有效期，避免長期有效的 token

:::

### JWT 金鑰生成

生成安全的 JWT 金鑰：

```bash
# 生成 256 位隨機金鑰
openssl rand -base64 64

# 或使用 PHP 生成
php -r "echo base64_encode(random_bytes(64)) . PHP_EOL;"
```

## 在控制器中快速獲取當前使用者

::: danger 依賴注入範圍限制

不建議在控制器以外注入此物件。對於 service 中操作 user、應將 user 例項傳入到 service 方法中
從而保證獲取使用者是在 http 請求週期內。

**原因說明**：
- `CurrentUser` 依賴於請求上下文中的 JWT token
- 在非 HTTP 請求環境（如定時任務、佇列消費者）中使用會導致錯誤
- Service 層應該保持無狀態，便於測試和維護

:::

### 基本用法

使用 `App\Http\CurrentUser` 快速獲取當前請求的使用者物件。該類提供了多種便捷方法來訪問使用者資訊，無需每次都查詢資料庫。

### 核心方法說明

- `user()`: 獲取完整的使用者模型例項（會觸發資料庫查詢）
- `id()`: 快速獲取使用者 ID（從 JWT token 直接讀取，無資料庫查詢）
- `refresh()`: 重新整理當前使用者的認證 token
- `menus()`: 獲取使用者有許可權的選單列表
- `roles()`: 獲取使用者的角色資訊
- `isSystem()`: 判斷是否為系統使用者
- `isSuperAdmin()`: 判斷是否為超級管理員

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
    
    // 獲取當前使用者 model 例項
    public function user(): ?User
    {
        return $this->userService->getInfo($this->id());
    }

    // 重新整理當前使用者的 token、返回 [access_token=>'xxx',refresh_token=>'xxx']
    public function refresh(): array
    {
        return $this->service->refreshToken($this->getToken());
    }

    // 快速獲取當前使用者 id （不走 db 查詢)
    public function id(): int
    {
        return (int) $this->getToken()->claims()->get(RegisteredClaims::ID);
    }

    /**
     * 用於獲取當前使用者的 選單樹狀列表
     * @return Collection<int,Menu>
     */
    public function menus(): Collection
    {
        // @phpstan-ignore-next-line
        return $this->user()->getMenus();
    }

    /**
     * 用於獲取當前使用者的角色列表 [ [code=>'xxx',name=>'xxxx'] ]
     * @return Collection<int, Role>
     */
    public function roles(): Collection
    {
        // @phpstan-ignore-next-line
        return $this->user()->getRoles()->map(static fn (Role $role) => $role->only(['name', 'code', 'remark']));
    }

    // 判斷當前使用者的 user_type 是否為 system 類別
    public function isSystem(): bool
    {
        return $this->user()->user_type === Type::SYSTEM;
    }

    // 判斷當前使用者是否具有超管許可權
    public function isSuperAdmin(): bool
    {
        return $this->user()->isSuperAdmin();
    }
}

```

:::

## 為外部程式建立單獨的 JWT 生成規則

### 應用場景

在企業級應用開發中，通常需要將系統分為多個獨立的應用域：

- **管理後臺**：供管理員使用的後臺管理系統
- **前臺應用**：面向終端使用者的應用介面
- **第三方接入**：提供給合作伙伴的 API 介面
- **移動端應用**：iOS/Android 等移動端專用介面

每個應用域都應該使用獨立的 JWT 配置，以實現：
- **安全隔離**：不同應用使用不同的簽名金鑰
- **許可權控制**：不同應用有不同的許可權範圍
- **配置獨立**：可以為不同應用設定不同的過期時間等引數

### 實施步驟

#### 步驟 1: 配置環境變數

在 `.env` 檔案中新建獨立的 JWT 金鑰。建議為每個應用域配置獨立的金鑰：

```bash
# 管理後臺（預設）
JWT_SECRET=your_admin_secret_here

# 前臺 API
JWT_API_SECRET=your_api_secret_here

# 移動端應用
JWT_MOBILE_SECRET=your_mobile_secret_here

# 第三方接入
JWT_PARTNER_SECRET=your_partner_secret_here
```

#### 步驟 2: 配置 JWT 場景

在 `config/autoload/jwt.php` 中新建多個場景配置：

#### 步驟 3: 建立專用中介軟體

為每個應用域建立專門的 token 驗證中介軟體：

#### 步驟 4: 控制器中使用中介軟體

在對應的控制器中使用相應的中介軟體進行使用者驗證：

#### 步驟 5: 擴充套件認證服務

在 `PassportService` 中新增對應的登入方法：

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
    // 預設場景：管理後臺
    'default' => [
        // jwt 配置 https://lcobucci-jwt.readthedocs.io/en/latest/
        'driver' => Jwt::class,
        // jwt 簽名key
        'key' => InMemory::base64Encoded(env('JWT_SECRET')),
        // jwt 簽名演算法 可選 https://lcobucci-jwt.readthedocs.io/en/latest/supported-algorithms/
        'alg' => new Sha256(),
        // token過期時間，單位為秒 (管理後臺建議短一些)
        'ttl' => (int) env('JWT_TTL', 3600), // 1小時
        // 重新整理token過期時間，單位為秒
        'refresh_ttl' => (int) env('JWT_REFRESH_TTL', 7200), // 2小時
        // 黑名單模式
        'blacklist' => [
            // 是否開啟黑名單
            'enable' => env('JWT_BLACKLIST_ENABLE', true),
            // 黑名單快取字首
            'prefix' => 'jwt_blacklist',
            // 黑名單快取驅動
            'connection' => 'default',
            // 黑名單快取時間 該時間一定要設定比token過期時間要大一點，最好設定跟過期時間一樣
            'ttl' => (int) env('JWT_BLACKLIST_TTL', 7201),
        ],
        'claims' => [
            // 預設的jwt claims
            RegisteredClaims::ISSUER => (string) env('APP_NAME'),
            RegisteredClaims::AUDIENCE => 'admin', // 明確標識受眾
        ],
    ],
    
    // 前臺 API 場景
    'api' => [
        'key' => InMemory::base64Encoded(env('JWT_API_SECRET')),
        'ttl' => (int) env('JWT_API_TTL', 7200), // 2小時，前臺可以長一些
        'refresh_ttl' => (int) env('JWT_API_REFRESH_TTL', 86400), // 24小時
        'claims' => [
            RegisteredClaims::ISSUER => (string) env('APP_NAME'),
            RegisteredClaims::AUDIENCE => 'api',
        ],
    ],
    
    // 移動端場景
    'mobile' => [
        'key' => InMemory::base64Encoded(env('JWT_MOBILE_SECRET')),
        'ttl' => (int) env('JWT_MOBILE_TTL', 86400), // 24小時，移動端更長
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
    
    // 第三方合作伙伴場景
    'partner' => [
        'key' => InMemory::base64Encoded(env('JWT_PARTNER_SECRET')),
        'ttl' => (int) env('JWT_PARTNER_TTL', 3600), // 1小時，第三方建議短期
        'refresh_ttl' => (int) env('JWT_PARTNER_REFRESH_TTL', 7200), // 2小時
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
        // 指定場景為 上一步新建的場景名稱
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
        summary: '系統登入',
        tags: ['api:passport']
    )]
    #[ResultResponse(
        instance: new Result(data: new PassportLoginVo()),
        title: '登入成功',
        description: '登入成功返回物件',
        example: '{"code":200,"message":"成功","data":{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MjIwOTQwNTYsIm5iZiI6MTcyMjA5NDAiwiZXhwIjoxNzIyMDk0MzU2fQ.7EKiNHb_ZeLJ1NArDpmK6sdlP7NsDecsTKLSZn_3D7k","refresh_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MjIwOTQwNTYsIm5iZiI6MTcyMjA5NDAiwiZXhwIjoxNzIyMDk0MzU2fQ.7EKiNHb_ZeLJ1NArDpmK6sdlP7NsDecsTKLSZn_3D7k","expire_at":300}}'
    )]
    #[OA\RequestBody(content: new OA\JsonContent(
        ref: LoginRequest::class,
        title: '登入請求引數',
        required: ['username', 'password'],
        example: '{"username":"admin","password":"123456"}'
    ))]
    public function loginApi(LoginRequest $request): Result
    {
        $username = (string) $request->input('username');
        $password = (string) $request->input('password');
        $ip = Arr::first(array: $request->getClientIps(), callback: static fn ($val) => $val ?: null, default: '0.0.0.0');
        $browser = $request->header('User-Agent') ?: 'unknown';
        // todo 使用者系統的獲取
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
     * @var string jwt場景
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
        // 填寫上一步的場景值
        return $this->jwtFactory->get('api');
    }
    
    public function getJwt(): JwtInterface
    {
        return $this->jwtFactory->get($this->jwt);
    }
```

:::


## JWT 核心概念詳解

::: tip JWT 基礎知識

如果您對 JWT（JSON Web Token）的基礎概念還不夠熟悉，建議先閱讀 [JWT 官方文件](https://jwt.io/introduction) 瞭解基本原理。

:::

### JWT 結構分析

JWT 由三部分組成，用點（.）分隔：

```
header.payload.signature
```

#### 1. Header（頭部）
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

#### 2. Payload（載荷）
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

欄位說明：
- `id`: 使用者 ID
- `iss`: 簽發者（Issuer）
- `aud`: 受眾（Audience）
- `exp`: 過期時間（Expiration Time）
- `iat`: 簽發時間（Issued At）
- `nbf`: 生效時間（Not Before）

#### 3. Signature（簽名）
```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

### 雙 Token 認證機制詳解

MineAdmin 採用雙 token 設計，這是一種安全性和使用者體驗的最佳平衡方案。

#### Token 型別對比

| 特性       | Access Token     | Refresh Token     |
|------------|------------------|-------------------|
| **用途**   | 業務介面訪問     | 重新整理 access_token |
| **有效期** | 短期（1-4小時）  | 長期（2-24小時）  |
| **使用頻率** | 每次 API 呼叫   | 僅在重新整理時使用    |
| **安全風險** | 低（短期有效）   | 中（需妥善保管）  |
| **儲存位置** | 記憶體/臨時儲存    | 安全儲存          |

#### 雙 Token 工作流程

```mermaid
sequenceDiagram
    participant Client as 客戶端
    participant Server as 伺服器
    participant Redis as Redis快取

    Client->>Server: 1. 登入請求
    Server->>Redis: 2. 驗證使用者憑據
    Server->>Client: 3. 返回 access_token + refresh_token
    
    loop 業務請求
        Client->>Server: 4. 攜帶 access_token 訪問 API
        Server->>Client: 5. 返回業務資料
    end
    
    Client->>Server: 6. access_token 過期，使用 refresh_token 重新整理
    Server->>Redis: 7. 驗證 refresh_token 並標記為已使用
    Server->>Client: 8. 返回新的 access_token + refresh_token
```

#### Token 內容差異

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

關鍵欄位說明：
- `sub`: 標識這是重新整理 token
- `exp`: 更長的過期時間

#### 關鍵差異說明

1. **`sub` 宣告**: refresh_token 包含 `"sub": "refresh"` 宣告，用於標識其用途
2. **使用限制**: 每個 refresh_token 只能使用一次，使用後立即失效
3. **安全機制**: 重新整理時會生成全新的 token 對，防止 token 重放攻擊

### 中介軟體驗證機制

MineAdmin 提供了兩個專門的中介軟體來處理不同型別的 token：

#### AccessTokenMiddleware
- **職責**: 驗證業務訪問 token
- **應用場景**: 所有需要使用者身份認證的業務介面
- **驗證邏輯**: 檢查 token 有效性、是否在黑名單、許可權範圍等

#### RefreshTokenMiddleware  
- **職責**: 驗證重新整理 token
- **應用場景**: 僅用於 token 重新整理介面
- **驗證邏輯**: 檢查 `sub` 宣告、一次性使用限制等

#### 自定義中介軟體示例

```php
namespace App\Http\Common\Middleware;

use Mine\JwtAuth\Middleware\AbstractTokenMiddleware;

class CustomTokenMiddleware extends AbstractTokenMiddleware
{
    public function getJwt(): JwtInterface
    {
        // 指定使用的 JWT 場景
        return $this->jwtFactory->get('api');
    }
    
    protected function validateCustomClaims(UnencryptedToken $token): void
    {
        // 自定義驗證邏輯
        $audience = $token->claims()->get(RegisteredClaims::AUDIENCE);
        if ($audience !== 'api') {
            throw new InvalidTokenException('Invalid token audience');
        }
    }
}
```

### 安全考慮

#### 1. Token 生命週期管理
- Access token 應該設定較短的有效期（1-4小時）
- Refresh token 有效期應該適中（2-24小時）
- 避免設定永不過期的 token

#### 2. 黑名單機制
- 登出時應該將 token 加入黑名單
- 密碼修改時應該使所有 token 失效
- 定期清理過期的黑名單記錄

#### 3. 安全儲存
- 客戶端應該安全儲存 refresh token
- 避免將敏感資訊放入 JWT payload
- 使用 HTTPS 傳輸所有包含 token 的請求

## 安全最佳實踐

### 1. 生產環境安全配置

::: danger 生產環境必讀

在生產環境部署前，請務必檢查以下安全配置：

:::

```php
// .env 生產環境配置示例
JWT_SECRET=your_super_secure_256_bit_key_here
JWT_API_SECRET=another_super_secure_256_bit_key_here
JWT_TTL=3600          // 1小時，建議不超過4小時
JWT_REFRESH_TTL=7200  // 2小時，建議不超過24小時
JWT_BLACKLIST_TTL=7201 // 比 refresh_ttl 多1秒
```