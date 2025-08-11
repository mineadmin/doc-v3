# User Authentication  

::: tip  

MineAdmin's authentication process is built using the [mineadmin/auth-jwt](https://github.com/mineadmin/JwtAuth) component combined with the [mineadmin/jwt](https://github.com/mineadmin/jwt) component, which integrates [lcobucci/jwt](https://github.com/lcobucci/jwt).  
This document focuses on explaining how to use JWT for user authentication in MineAdmin.  

:::  

## Quickly Retrieve the Current User in a Controller  

::: danger  

It is not recommended to inject this object outside of controllers. For user operations in services, the user instance should be passed into the service method to ensure user retrieval occurs within the HTTP request lifecycle.  

:::  

Use `App\Http\CurrentUser` to quickly retrieve the user object for the current request.  

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

    // Get the current user model instance  
    public function user(): ?User  
    {  
        return $this->userService->getInfo($this->id());  
    }  

    // Refresh the current user's token, returns [access_token=>'xxx', refresh_token=>'xxx']  
    public function refresh(): array  
    {  
        return $this->service->refreshToken($this->getToken());  
    }  

    // Quickly retrieve the current user ID (without querying the database)  
    public function id(): int  
    {  
        return (int) $this->getToken()->claims()->get(RegisteredClaims::ID);  
    }  

    /**  
     * Retrieve the current user's menu tree list  
     * @return Collection<int,Menu>  
     */  
    public function menus(): Collection  
    {  
        // @phpstan-ignore-next-line  
        return $this->user()->getMenus();  
    }  

    /**  
     * Retrieve the current user's role list [ [code=>'xxx', name=>'xxxx'] ]  
     * @return Collection<int, Role>  
     */  
    public function roles(): Collection  
    {  
        // @phpstan-ignore-next-line  
        return $this->user()->getRoles()->map(static fn (Role $role) => $role->only(['name', 'code', 'remark']));  
    }  

    // Check if the current user's user_type is of the system category  
    public function isSystem(): bool  
    {  
        return $this->user()->user_type === Type::SYSTEM;  
    }  

    // Check if the current user has super admin privileges  
    public function isSuperAdmin(): bool  
    {  
        return $this->user()->isSuperAdmin();  
    }  
}  
```  

:::  

## Create Separate JWT Generation Rules for External Applications  

In daily application development, the backend and frontend applications often use different generation rules. To implement this in MineAdmin, follow these steps:  

1. Add a new `JWT_API_SECRET` in the `.env` file with a base64-encoded random string.  
2. Create a new scenario in `config/autoload/jwt.php`.  
3. Create an `ApiTokenMiddleware` middleware specifically for validating the new scenario's JWT.  
4. Use the `ApiTokenMiddleware` in your frontend controller for user validation.  
5. Add a `loginApi` method to `PassportService`.  

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
        // JWT configuration: https://lcobucci-jwt.readthedocs.io/en/latest/  
        'driver' => Jwt::class,  
        // JWT signing key  
        'key' => InMemory::base64Encoded(env('JWT_SECRET')),  
        // JWT signing algorithm options: https://lcobucci-jwt.readthedocs.io/en/latest/supported-algorithms/  
        'alg' => new Sha256(),  
        // Token expiration time in seconds  
        'ttl' => (int) env('JWT_TTL', 3600),  
        // Refresh token expiration time in seconds  
        'refresh_ttl' => (int) env('JWT_REFRESH_TTL', 7200),  
        // Blacklist mode  
        'blacklist' => [  
            // Whether to enable the blacklist  
            'enable' => true,  
            // Blacklist cache prefix  
            'prefix' => 'jwt_blacklist',  
            // Blacklist cache driver  
            'connection' => 'default',  
            // Blacklist cache time (must be slightly longer than token expiration time, ideally matching it)  
            'ttl' => (int) env('JWT_BLACKLIST_TTL', 7201),  
        ],  
        'claims' => [  
            // Default JWT claims  
            RegisteredClaims::ISSUER => (string) env('APP_NAME'),  
        ],  
    ],  
    // Add configurations here for different scenarios. Others will use default settings.  
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
        description: 'Returns the login success object',  
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
        // TODO: User system retrieval  
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
     * @var string JWT scenario  
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
        // Specify the scenario name from the previous step  
        return $this->jwtFactory->get('api');  
    }  

    public function getJwt(): JwtInterface  
    {  
        return $this->jwtFactory->get($this->jwt);  
    }  
```  

:::  

## JWT  

::: tip  

Before reading this document, a basic understanding of JWT is required. This section will not explain foundational concepts.  

:::  

### Differences Between Dual Tokens  

In MineAdmin, two tokens are returned upon successful login: `access_token` and `refresh_token`.  
- The `access_token` is used for business user authentication.  
- The `refresh_token` is used for seamless refreshing of the `access_token`. For details on the refresh mechanism, see [Dual Token Refresh Mechanism](../base/lifecycle.md#双-token-认证刷新).  

The `refresh_token` includes an additional `sub` attribute with the value `refresh`, indicating that this token can only be used to refresh the `access_token`.  
Additionally, this token can only be refreshed once before becoming invalid. Subsequent refreshes must use a new `refresh_token`.  

Both tokens store the user's ID in the `id` attribute.  

- `access_token` validation is handled by the `App\Http\Common\Middleware\AccessTokenMiddleware` middleware.  
- `refresh_token` validation is handled by the `App\Http\Common\Middleware\RefreshTokenMiddleware` middleware.  

Both middleware classes inherit from `Mine\JwtAuth\Middleware\AbstractTokenMiddleware`.