# ユーザー認証

::: tip

MineAdminの認証フローは、[mineadmin/auth-jwt](https://github.com/mineadmin/JwtAuth)コンポーネントと[mineadmin/jwt](https://github.com/mineadmin/jwt)コンポーネントを介して[lcobucci/jwt](https://github.com/lcobucci/jwt)を統合して構築されています。このドキュメントでは、MineAdminでJWTを使用してユーザー認証を行う方法について重点的に説明します。

:::

## コントローラーで現在のユーザーを迅速に取得する

::: danger

コントローラー以外でこのオブジェクトを注入することは推奨されません。Serviceでユーザーを操作する場合、ユーザーインスタンスをServiceメソッドに渡すことで、ユーザー取得がHTTPリクエスト周期内であることを保証してください。

:::

`App\Http\CurrentUser`を使用して、現在のリクエストのユーザーオブジェクトを迅速に取得します。

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
 * このファイルはMineAdminの一部です。
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
    
    // 現在のユーザーのmodelインスタンスを取得
    public function user(): ?User
    {
        return $this->userService->getInfo($this->id());
    }

    // 現在のユーザーのtokenを更新、[access_token=>'xxx',refresh_token=>'xxx']を返す
    public function refresh(): array
    {
        return $this->service->refreshToken($this->getToken());
    }

    // DBクエリなしで現在のユーザーIDを迅速に取得
    public function id(): int
    {
        return (int) $this->getToken()->claims()->get(RegisteredClaims::ID);
    }

    /**
     * 現在のユーザーのメニューツリーリストを取得
     * @return Collection<int,Menu>
     */
    public function menus(): Collection
    {
        // @phpstan-ignore-next-line
        return $this->user()->getMenus();
    }

    /**
     * 現在のユーザーのロールリストを取得 [ [code=>'xxx',name=>'xxxx'] ]
     * @return Collection<int, Role>
     */
    public function roles(): Collection
    {
        // @phpstan-ignore-next-line
        return $this->user()->getRoles()->map(static fn (Role $role) => $role->only(['name', 'code', 'remark']));
    }

    // 現在のユーザーのuser_typeがsystemタイプかどうかを判定
    public function isSystem(): bool
    {
        return $this->user()->user_type === Type::SYSTEM;
    }

    // 現在のユーザーがスーパー管理者権限を持っているかどうかを判定
    public function isSuperAdmin(): bool
    {
        return $this->user()->isSuperAdmin();
    }
}

```

:::

::: code-group

## 外部プログラム用に別途JWT生成ルールを作成

日常のアプリケーション開発では、業務バックエンドとフロントエンドアプリケーションで通常異なる生成ルールを使用します。MineAdminでこれが必要な場合は、この章を参照してください。

1. envファイルに新しいJWT_API_SECRETを作成。値はランダムな文字列をbase64エンコードした内容
2. `config/autoload/jwt.php`に新しいシーンを追加
3. 新しいシーンのJWTを検証するための`ApiTokenMiddleware`ミドルウェアを作成
4. フロントエンドコントローラーで`ApiTokenMiddleware`ミドルウェアを使用してユーザー認証を行う
5. `PassportService`に新しい`loginApi`メソッドを追加

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
 * このファイルはMineAdminの一部です。
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
        // jwt設定 https://lcobucci-jwt.readthedocs.io/en/latest/
        'driver' => Jwt::class,
        // jwt署名キー
        'key' => InMemory::base64Encoded(env('JWT_SECRET')),
        // jwt署名アルゴリズム オプション https://lcobucci-jwt.readthedocs.io/en/latest/supported-algorithms/
        'alg' => new Sha256(),
        // token有効期限（秒）
        'ttl' => (int) env('JWT_TTL', 3600),
        // リフレッシュtoken有効期限（秒）
        'refresh_ttl' => (int) env('JWT_REFRESH_TTL', 7200),
        // ブラックリストモード
        'blacklist' => [
            // ブラックリストを有効にするか
            'enable' => true,
            // ブラックリストキャッシュプレフィックス
            'prefix' => 'jwt_blacklist',
            // ブラックリストキャッシュドライバ
            'connection' => 'default',
            // ブラックリストキャッシュ時間 この時間はtoken有効期限より少し長く設定する必要があります
            'ttl' => (int) env('JWT_BLACKLIST_TTL', 7201),
        ],
        'claims' => [
            // デフォルトのjwt claims
            RegisteredClaims::ISSUER => (string) env('APP_NAME'),
        ],
    ],
    // 異なるシーンを使用したい場合、ここに設定を追加できます
    'api' => [
        'key' => InMemory::base64Encoded(env('JWT_API_SECRET')),
    ],
];


```

```php{20-24} [ApiTokenMiddleware]
<?php

declare(strict_types=1);
/**
 * このファイルはMineAdminの一部です。
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
        // 前の手順で作成したシーン名を指定
        return $this->jwtFactory->get('api');
    }
}


```

```php{36-81} [TestController]
<?php

declare(strict_types=1);
/**
 * このファイルはMineAdminの一部です。
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
        summary: 'システムログイン',
        tags: ['api:passport']
    )]
    #[ResultResponse(
        instance: new Result(data: new PassportLoginVo()),
        title: 'ログイン成功',
        description: 'ログイン成功時の返却オブジェクト',
        example: '{"code":200,"message":"成功","data":{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MjIwOTQwNTYsIm5iZiI6MTcyMjA5NDAiwiZXhwIjoxNzIyMDk0MzU2fQ.7EKiNHb_ZeLJ1NArDpmK6sdlP7NsDecsTKLSZn_3D7k","refresh_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MjIwOTQwNTYsIm5iZiI6MTcyMjA5NDAiwiZXhwIjoxNzIyMDk0MzU2fQ.7EKiNHb_ZeLJ1NArDpmK6sdlP7NsDecsTKLSZn_3D7k","expire_at":300}}'
    )]
    #[OA\RequestBody(content: new OA\JsonContent(
        ref: LoginRequest::class,
        title: 'ログインリクエストパラメータ',
        required: ['username', 'password'],
        example: '{"username":"admin","password":"123456"}'
    ))]
    public function loginApi(LoginRequest $request): Result
    {
        $username = (string) $request->input('username');
        $password = (string) $request->input('password');
        $ip = Arr::first(array: $request->getClientIps(), callback: static fn ($val) => $val ?: null, default: '0.0.0.0');
        $browser = $request->header('User-Agent') ?: 'unknown';
        // todo ユーザーシステムの取得
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
     * @var string jwtシーン
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
        // 前の手順のシーン値を入力
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

このドキュメントを読む前に、JWTの基本的な知識を理解している必要があります。このドキュメントでは基本的な概念については説明しません。

:::

### 二つのトークンの違い

MineAdminでは、ログイン成功後に2つのトークンが返されます。`access_token`と`refresh_token`です。
前者の`access_token`は業務ユーザー認証に使用され、後者の`refresh_token`は`access_token`をシームレスに更新するために使用されます。具体的な更新フローは[二つのトークン更新メカニズム](../base/lifecycle.md#二つのトークン認証更新)を参照してください。

`refresh_token`は`access_token`と比較して、`sub`属性が追加されています。値は`refresh`で、このトークンがaccess_tokenの更新のみに使用できることを示します。
また、このトークンは一度しか更新に使用できません。次回の更新では新しいrefresh_tokenを選択する必要があります。

両方のトークンの`id`属性にはユーザーIDが格納されています。

access_tokenの検証は`App\Http\Common\Middleware\AccessTokenMiddleware`ミドルウェアによって決定され、
refresh_tokenの検証は`App\Http\Common\Middleware\RefreshTokenMiddleware`ミドルウェアによって決定されます。

これら2つはどちらも`Mine\JwtAuth\Middleware\AbstractTokenMiddleware`を継承しています。