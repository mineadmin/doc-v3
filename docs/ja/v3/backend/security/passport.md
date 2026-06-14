# ユーザー認証

::: tip

MineAdmin の認証フローは、[mineadmin/auth-jwt](https://github.com/mineadmin/JwtAuth) コンポーネントと [mineadmin/jwt](https://github.com/mineadmin/jwt) コンポーネントが [lcobucci/jwt](https://github.com/lcobucci/jwt) を統合して構築されています。本稿では、MineAdmin で JWT を使用してユーザー認証を行う方法について詳しく説明します。

本稿では、JWT 認証の基本的な使用方法、セキュリティ設定、パフォーマンス最適化、およびベストプラクティスについて説明し、開発者が安全で信頼性の高い認証システムを構築できるように支援します。

:::

## 認証メカニズムの概要

MineAdmin は、JWT（JSON Web Token）によるデュアルトークン認証メカニズムを採用しています。

- **access_token**: ビジネスインターフェースへのアクセスに使用します。有効期間は短く（デフォルト 1 時間）設定されています。
- **refresh_token**: access_token をシームレスに更新するために使用します。有効期間は長く（デフォルト 2 時間）設定されています。

この設計により、セキュリティを確保しながら、優れたユーザーエクスペリエンスを提供します。

## セキュリティ設定ガイド

::: warning 重要なセキュリティ注意事項

1. **鍵の安全性**: JWT 鍵は強力なランダム文字列を使用し、長さは少なくとも 256 ビット必要です。
2. **環境の分離**: 本番環境とテスト環境では、異なる JWT 鍵を使用する必要があります。
3. **転送の安全性**: 本番環境では、JWT トークンの転送に HTTPS を使用する必要があります。
4. **保存の安全性**: クライアント側では、トークンを安全な場所（httpOnly Cookie など）に保存する必要があります。
5. **有効期限の管理**: トークンの有効期限を適切に設定し、長期有効なトークンを避けてください。

:::

### JWT 鍵の生成

安全な JWT 鍵を生成します。

```bash
# 256 ビットのランダム鍵を生成
openssl rand -base64 64

# または PHP を使用して生成
php -r "echo base64_encode(random_bytes(64)) . PHP_EOL;"
```

## コントローラー内で現在のユーザーを迅速に取得する

::: danger 依存注入のスコープ制限

コントローラー以外でこのオブジェクトを注入することは推奨されません。service でユーザーを操作する場合は、service メソッドにユーザーインスタンスを渡す必要があります。
これにより、HTTP リクエストのサイクル内でユーザーが確実に取得されます。

**理由の説明**：
- `CurrentUser` はリクエストコンテキスト内の JWT トークンに依存します。
- 非 HTTP リクエスト環境（cron ジョブ、キューコンシューマーなど）で使用すると、エラーが発生する可能性があります。
- Service 層はステートレスに保ち、テストと保守を容易にする必要があります。

:::

### 基本的な使用方法

`App\Http\CurrentUser` を使用して、現在のリクエストのユーザーオブジェクトを迅速に取得します。このクラスは、データベースに毎回問い合わせることなく、ユーザー情報にアクセスするための便利なメソッドを複数提供します。

### コアメソッドの説明

- `user()`: 完全なユーザーモデルインスタンスを取得します（データベースクエリが発生します）。
- `id()`: ユーザー ID を迅速に取得します（JWT トークンから直接読み取るため、データベースクエリは発生しません）。
- `refresh()`: 現在のユーザーの認証トークンを更新します。
- `menus()`: ユーザーが権限を持つメニューリストを取得します。
- `roles()`: ユーザーのロール情報を取得します。
- `isSystem()`: システムユーザーかどうかを判断します。
- `isSuperAdmin()`: スーパー管理者かどうかを判断します。

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
    
    // 現在のユーザーの model インスタンスを取得
    public function user(): ?User
    {
        return $this->userService->getInfo($this->id());
    }

    // 現在のユーザーのトークンを更新し、[access_token=>'xxx',refresh_token=>'xxx'] を返す
    public function refresh(): array
    {
        return $this->service->refreshToken($this->getToken());
    }

    // 現在のユーザー ID を迅速に取得（DB クエリなし）
    public function id(): int
    {
        return (int) $this->getToken()->claims()->get(RegisteredClaims::ID);
    }

    /**
     * 現在のユーザーのメニュー階層リストを取得するために使用
     * @return Collection<int,Menu>
     */
    public function menus(): Collection
    {
        // @phpstan-ignore-next-line
        return $this->user()->getMenus();
    }

    /**
     * 現在のユーザーのロールリストを取得するために使用 [ [code=>'xxx',name=>'xxxx'] ]
     * @return Collection<int, Role>
     */
    public function roles(): Collection
    {
        // @phpstan-ignore-next-line
        return $this->user()->getRoles()->map(static fn (Role $role) => $role->only(['name', 'code', 'remark']));
    }

    // 現在のユーザーの user_type が system カテゴリかどうかを判断
    public function isSystem(): bool
    {
        return $this->user()->user_type === Type::SYSTEM;
    }

    // 現在のユーザーにスーパー管理者権限があるかどうかを判断
    public function isSuperAdmin(): bool
    {
        return $this->user()->isSuperAdmin();
    }
}

```

:::

## 外部プログラム用の個別 JWT 生成ルールを作成する

### 適用シナリオ

エンタープライズアプリケーション開発では、通常、システムを複数の独立したアプリケーションドメインに分割する必要があります。

- **管理バックエンド**: 管理者が使用するバックエンド管理システム
- **フロントエンドアプリケーション**: エンドユーザー向けのアプリケーションインターフェース
- **サードパーティ連携**: パートナーに提供する API インターフェース
- **モバイルアプリケーション**: iOS/Android など、モバイル端末専用のインターフェース

各アプリケーションドメインは、独立した JWT 設定を使用する必要があります。これにより、以下を実現します。
- **セキュリティの分離**: 異なるアプリケーションは異なる署名鍵を使用します。
- **権限制御**: 異なるアプリケーションは異なる権限範囲を持ちます。
- **設定の独立性**: アプリケーションごとに異なる有効期限などのパラメータを設定できます。

### 実装手順

#### 手順 1: 環境変数の設定

`.env` ファイルに、独立した JWT 鍵を新規作成します。各アプリケーションドメインに独立した鍵を設定することをお勧めします。

```bash
# 管理バックエンド（デフォルト）
JWT_SECRET=your_admin_secret_here

# フロントエンド API
JWT_API_SECRET=your_api_secret_here

# モバイルアプリケーション
JWT_MOBILE_SECRET=your_mobile_secret_here

# サードパーティ連携
JWT_PARTNER_SECRET=your_partner_secret_here
```

#### 手順 2: JWT シナリオの設定

`config/autoload/jwt.php` に、複数のシナリオ設定を新規作成します。

#### 手順 3: 専用ミドルウェアの作成

各アプリケーションドメイン用に、専用のトークン検証ミドルウェアを作成します。

#### 手順 4: コントローラーでのミドルウェアの使用

対応するコントローラーで、対応するミドルウェアを使用してユーザーを検証します。

#### 手順 5: 認証サービスの拡張

`PassportService` に対応するログインメソッドを新規追加します。

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
    // デフォルトシナリオ：管理バックエンド
    'default' => [
        // jwt 設定 https://lcobucci-jwt.readthedocs.io/en/latest/
        'driver' => Jwt::class,
        // jwt 署名鍵
        'key' => InMemory::base64Encoded(env('JWT_SECRET')),
        // jwt 署名アルゴリズム オプション https://lcobucci-jwt.readthedocs.io/en/latest/supported-algorithms/
        'alg' => new Sha256(),
        // トークンの有効期限（秒） (管理バックエンドは短めを推奨)
        'ttl' => (int) env('JWT_TTL', 3600), // 1時間
        // リフレッシュトークンの有効期限（秒）
        'refresh_ttl' => (int) env('JWT_REFRESH_TTL', 7200), // 2時間
        // ブラックリストモード
        'blacklist' => [
            // ブラックリストを有効にするかどうか
            'enable' => env('JWT_BLACKLIST_ENABLE', true),
            // ブラックリストキャッシュプレフィックス
            'prefix' => 'jwt_blacklist',
            // ブラックリストキャッシュドライバー
            'connection' => 'default',
            // ブラックリストキャッシュ時間 この時間はトークンの有効期限より少し長く設定する必要があり、有効期限と同じに設定するのが最適
            'ttl' => (int) env('JWT_BLACKLIST_TTL', 7201),
        ],
        'claims' => [
            // デフォルトの jwt claims
            RegisteredClaims::ISSUER => (string) env('APP_NAME'),
            RegisteredClaims::AUDIENCE => 'admin', // オーディエンスを明確に識別
        ],
    ],
    
    // フロントエンド API シナリオ
    'api' => [
        'key' => InMemory::base64Encoded(env('JWT_API_SECRET')),
        'ttl' => (int) env('JWT_API_TTL', 7200), // 2時間、フロントエンドは長めに設定可能
        'refresh_ttl' => (int) env('JWT_API_REFRESH_TTL', 86400), // 24時間
        'claims' => [
            RegisteredClaims::ISSUER => (string) env('APP_NAME'),
            RegisteredClaims::AUDIENCE => 'api',
        ],
    ],
    
    // モバイルシナリオ
    'mobile' => [
        'key' => InMemory::base64Encoded(env('JWT_MOBILE_SECRET')),
        'ttl' => (int) env('JWT_MOBILE_TTL', 86400), // 24時間、モバイルはさらに長め
        'refresh_ttl' => (int) env('JWT_MOBILE_REFRESH_TTL', 604800), // 7日間
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
    
    // サードパーティパートナーシナリオ
    'partner' => [
        'key' => InMemory::base64Encoded(env('JWT_PARTNER_SECRET')),
        'ttl' => (int) env('JWT_PARTNER_TTL', 3600), // 1時間、サードパーティは短期推奨
        'refresh_ttl' => (int) env('JWT_PARTNER_REFRESH_TTL', 7200), // 2時間
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
        // 前の手順で新規作成したシナリオ名を指定
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
        summary: 'システムログイン',
        tags: ['api:passport']
    )]
    #[ResultResponse(
        instance: new Result(data: new PassportLoginVo()),
        title: 'ログイン成功',
        description: 'ログイン成功時にオブジェクトを返す',
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
     * @var string jwtシナリオ
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
        // 前の手順のシナリオ値を入力
        return $this->jwtFactory->get('api');
    }
    
    public function getJwt(): JwtInterface
    {
        return $this->jwtFactory->get($this->jwt);
    }
```

:::


## JWT コアコンセプトの詳細説明

::: tip JWT 基礎知識

JWT（JSON Web Token）の基本概念にまだ詳しくない場合は、[JWT 公式ドキュメント](https://jwt.io/introduction) を読んで基本原理を理解することをお勧めします。

:::

### JWT 構造分析

JWT は、ドット（.）で区切られた 3 つの部分で構成されます。

```
header.payload.signature
```

#### 1. Header（ヘッダー）
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

#### 2. Payload（ペイロード）
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

フィールドの説明：
- `id`: ユーザー ID
- `iss`: 発行者（Issuer）
- `aud`: 受信者（Audience）
- `exp`: 有効期限（Expiration Time）
- `iat`: 発行時刻（Issued At）
- `nbf`: 有効開始時刻（Not Before）

#### 3. Signature（署名）
```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

### デュアルトークン認証メカニズムの詳細説明

MineAdmin は、セキュリティとユーザーエクスペリエンスの最適なバランスを実現するためのデュアルトークン設計を採用しています。

#### トークンタイプの比較

| 特性       | Access Token     | Refresh Token     |
|------------|------------------|-------------------|
| **用途**   | ビジネスインターフェースへのアクセス | access_token の更新 |
| **有効期間** | 短期（1～4時間）  | 長期（2～24時間）  |
| **使用頻度** | 毎回の API 呼び出し | 更新時のみ使用    |
| **セキュリティリスク** | 低（短期有効）   | 中（適切に保管する必要あり）  |
| **保存場所** | メモリ/一時保存    | 安全な保存場所          |

#### デュアルトークンのワークフロー

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant Server as サーバー
    participant Redis as Redis キャッシュ

    Client->>Server: 1. ログインリクエスト
    Server->>Redis: 2. ユーザー資格情報を検証
    Server->>Client: 3. access_token + refresh_token を返す
    
    loop ビジネスリクエスト
        Client->>Server: 4. access_token を付けて API にアクセス
        Server->>Client: 5. ビジネスデータを返す
    end
    
    Client->>Server: 6. access_token 期限切れ、refresh_token を使用して更新
    Server->>Redis: 7. refresh_token を検証し、使用済みとしてマーク
    Server->>Client: 8. 新しい access_token + refresh_token を返す
```

#### トークン内容の違い

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

主なフィールドの説明：
- `sub`: これがリフレッシュトークンであることを示します。
- `exp`: より長い有効期限。

#### 主な違いの説明

1. **`sub` クレーム**: refresh_token には `"sub": "refresh"` クレームが含まれ、その用途を示します。
2. **使用制限**: 各 refresh_token は 1 回のみ使用でき、使用後すぐに無効になります。
3. **セキュリティメカニズム**: 更新時に完全に新しいトークンペアが生成され、トークンのリプレイ攻撃を防ぎます。

### ミドルウェア検証メカニズム

MineAdmin は、異なるタイプのトークンを処理するための 2 つの専用ミドルウェアを提供します。

#### AccessTokenMiddleware
- **責務**: ビジネスアクセストークンを検証します。
- **適用シナリオ**: ユーザー認証が必要なすべてのビジネスインターフェース。
- **検証ロジック**: トークンの有効性、ブラックリストへの登録状況、権限範囲などを確認します。

#### RefreshTokenMiddleware  
- **責務**: リフレッシュトークンを検証します。
- **適用シナリオ**: トークン更新インターフェースのみに使用されます。
- **検証ロジック**: `sub` クレーム、1 回限りの使用制限などを確認します。

#### カスタムミドルウェアの例

```php
namespace App\Http\Common\Middleware;

use Mine\JwtAuth\Middleware\AbstractTokenMiddleware;

class CustomTokenMiddleware extends AbstractTokenMiddleware
{
    public function getJwt(): JwtInterface
    {
        // 使用する JWT シナリオを指定
        return $this->jwtFactory->get('api');
    }
    
    protected function validateCustomClaims(UnencryptedToken $token): void
    {
        // カスタム検証ロジック
        $audience = $token->claims()->get(RegisteredClaims::AUDIENCE);
        if ($audience !== 'api') {
            throw new InvalidTokenException('Invalid token audience');
        }
    }
}
```

### セキュリティに関する考慮事項

#### 1. トークンのライフサイクル管理
- Access token は短い有効期間（1～4 時間）に設定する必要があります。
- Refresh token の有効期間は適切な長さ（2～24 時間）に設定する必要があります。
- 無期限のトークンは設定しないでください。

#### 2. ブラックリストメカニズム
- ログアウト時には、トークンをブラックリストに追加する必要があります。
- パスワード変更時には、すべてのトークンを無効にする必要があります。
- 期限切れのブラックリストレコードは定期的にクリーンアップする必要があります。

#### 3. 安全な保存
- クライアント側では、refresh token を安全に保存する必要があります。
- 機密情報を JWT ペイロードに含めないでください。
- トークンを含むすべてのリクエストには HTTPS を使用してください。

## セキュリティのベストプラクティス

### 1. 本番環境のセキュリティ設定

::: danger 本番環境では必読

本番環境にデプロイする前に、以下のセキュリティ設定を必ず確認してください。

:::

```php
// .env 本番環境設定例
JWT_SECRET=your_super_secure_256_bit_key_here
JWT_API_SECRET=another_super_secure_256_bit_key_here
JWT_TTL=3600          // 1時間、4時間を超えないことを推奨
JWT_REFRESH_TTL=7200  // 2時間、24時間を超えないことを推奨
JWT_BLACKLIST_TTL=7201 // refresh_ttl より1秒長く設定
```