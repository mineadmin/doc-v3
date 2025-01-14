# 使用者認證

::: tip

MineAdmin 的認證流程由 [mineadmin/auth-jwt](https://github.com/mineadmin/JwtAuth) 元件加 [mineadmin/jwt](https://github.com/mineadmin/jwt) 元件接入 [lcobucci/jwt](https://github.com/lcobucci/jwt)
構建而成，本文將著重講解如何在 MineAdmin 中使用 jwt 進行使用者認證

:::

## 在控制器中快速獲取當前使用者

::: danger

不建議在控制器以外注入此物件。對於 service 中操作 user、應將 user 例項傳入到 service 方法中
從而保證獲取使用者是在 http 請求週期內

:::

使用 `App\Http\CurrentUser` 快速獲取當前請求的使用者物件

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

::: code-group

## 為外部程式建立單獨的 jwt 生成規則

在日常的應用開發中。業務後臺與前臺應用通常使用兩個不同的生成規則。在 MineAdmin 中需要此項參考本章節內容

1. env 檔案中新建一個 JWT_API_SECRET 。值為隨機字串 base64 編碼後的內容
2. 在 `config/autoload/jwt.php` 中新建一個場景
3. 新建一個 `ApiTokenMiddleware` 中介軟體專門用來驗證新的場景 jwt
4. 在你的前臺控制器中使用 `ApiTokenMiddleware` 中介軟體進行使用者驗證
5. 在 `PassportService` 新增一個 `loginApi` 方法

::: code-group

```php[.env]
#other ...

MINE_API_SECERT=azOVxsOWt3r0ozZNz8Ss429ht0T8z6OpeIJAIwNp6X0xqrbEY2epfIWyxtC1qSNM8eD6/LQ/SahcQi2ByXa/2A==

```

```php{46-50} [jwt.php]
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
    'default' => [
        // jwt 配置 https://lcobucci-jwt.readthedocs.io/en/latest/
        'driver' => Jwt::class,
        // jwt 簽名key
        'key' => InMemory::base64Encoded(env('JWT_SECRET')),
        // jwt 簽名演算法 可選 https://lcobucci-jwt.readthedocs.io/en/latest/supported-algorithms/
        'alg' => new Sha256(),
        // token過期時間，單位為秒
        'ttl' => (int) env('JWT_TTL', 3600),
        // 重新整理token過期時間，單位為秒
        'refresh_ttl' => (int) env('JWT_REFRESH_TTL', 7200),
        // 黑名單模式
        'blacklist' => [
            // 是否開啟黑名單
            'enable' => true,
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
        ],
    ],
    // 在你想要使用不同的場景時，可以在這裡新增配置.可以填一個。其他會使用預設配置
    'api' => [
        'key' => InMemory::base64Encoded(env('JWT_API_SECRET')),
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


## jwt 

::: tip

檢視本文件前，需要對 jwt 的知識有一定了解。本文不再另行解釋相關基礎知識

:::

### 雙 token 的區別

在 MineAdmin 中、登入成功後會返回兩個 token。即 `access_token` 和 `refresh_token`
前者 `access_token` 用來作業務使用者認證。後者 `refresh_token` 用來做無感重新整理 `access_token`。具體重新整理流程可檢視 [ 雙 token 重新整理機制](../base/lifecycle.md#雙-token-認證重新整理)

`refresh_token` 相比較 `access_token` 多了一個 `sub` 屬性。值為 `refresh` 作用標明該 token 只能用於重新整理 access_token
同時該 token 只能重新整理一次即失效。下次重新整理必須選擇新的 refresh_token

前後者的 `id` 屬性則都是儲存使用者的 id

access_token 的驗證由 `App\Http\Common\Middleware\AccessTokenMiddleware` 中介軟體決定
refresh_token 的驗證由 `App\Http\Common\Middleware\RefreshTokenMiddleware` 中介軟體決定

而這兩個都是繼承於 `Mine\JwtAuth\Middleware\AbstractTokenMiddleware`