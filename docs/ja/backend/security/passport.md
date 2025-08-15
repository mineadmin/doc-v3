# ユーザー認証

::: tip

MineAdminの認証フローは[mineadmin/auth-jwt](https://github.com/mineadmin/JwtAuth)コンポーネントと[mineadmin/jwt](https://github.com/mineadmin/jwt)コンポーネントを介して[lcobucci/jwt](https://github.com/lcobucci/jwt)を統合して構築されています。このドキュメントでは、MineAdminでJWTを使用したユーザー認証の方法について重点的に説明します。

本ドキュメントでは、JWT認証の基本的な使用方法、セキュリティ設定、パフォーマンス最適化、ベストプラクティスを網羅し、開発者が安全で信頼性の高い認証システムを構築するのを支援します。

:::

## 認証メカニズム概要

MineAdminはJWT（JSON Web Token）のデュアルトークン認証メカニズムを採用しています：

- **access_token**: 業務インターフェースアクセス用、有効期間が短い（デフォルト1時間）
- **refresh_token**: access_tokenのシームレスなリフレッシュ用、有効期間が長い（デフォルト2時間）

この設計はセキュリティを確保しながら、優れたユーザーエクスペリエンスを提供します。

## セキュリティ設定ガイド

::: warning 重要なセキュリティリマインダー

1. **鍵のセキュリティ**: JWT鍵は強力なランダム文字列を使用し、長さは少なくとも256ビット以上
2. **環境分離**: 本番環境とテスト環境では異なるJWT鍵を使用
3. **転送セキュリティ**: 本番環境ではHTTPSを使用してJWTトークンを転送
4. **保存セキュリティ**: クライアントはトークンを安全な場所（httpOnly cookieなど）に保存
5. **有効期間制御**: トークンの有効期間を適切に設定し、長期有効なトークンを避ける

:::

### JWT鍵生成

安全なJWT鍵を生成：

```bash
# 256ビットランダム鍵を生成
openssl rand -base64 64

# またはPHPで生成
php -r "echo base64_encode(random_bytes(64)) . PHP_EOL;"
```

## コントローラーで現在のユーザーを迅速に取得

::: danger 依存注入の範囲制限

コントローラー以外でのこのオブジェクトの注入は推奨しません。serviceでuserを操作する場合、userインスタンスをserviceメソッドに渡すことで、ユーザー取得がHTTPリクエスト周期内であることを保証します。

**理由説明**:
- `CurrentUser`はリクエストコンテキスト内のJWTトークンに依存
- 非HTTPリクエスト環境（スケジュールタスク、キューコンシューマーなど）で使用するとエラーが発生
- Service層はステートレスを維持し、テストとメンテナンスを容易にする

:::

### 基本使用方法

`App\Http\CurrentUser`を使用して現在のリクエストのユーザーオブジェクトを迅速に取得。このクラスはユーザー情報にアクセスするための様々な便利なメソッドを提供し、毎回データベースをクエリする必要がありません。

### コアメソッド説明

- `user()`: 完全なユーザーモデルインスタンスを取得（データベースクエリが発生）
- `id()`: ユーザーIDを迅速に取得（JWTトークンから直接読み取り、データベースクエリなし）
- `refresh()`: 現在のユーザーの認証トークンをリフレッシュ
- `menus()`: ユーザーが権限を持つメニューリストを取得
- `roles()`: ユーザーのロール情報を取得
- `isSystem()`: システムユーザーかどうかを判断
- `isSuperAdmin()`: スーパーアドミンかどうかを判断

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
    
    // 現在のユーザーモデルインスタンスを取得
    public function user(): ?User
    {
        return $this->userService->getInfo($this->id());
    }

    // 現在のユーザーのトークンをリフレッシュ、[access_token=>'xxx',refresh_token=>'xxx']を返す
    public function refresh(): array
    {
        return $this->service->refreshToken($this->getToken());
    }

    // 現在のユーザーIDを迅速に取得（DBクエリなし）
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

    // 現在のユーザーのuser_typeがsystemタイプかどうかを判断
    public function isSystem(): bool
    {
        return $this->user()->user_type === Type::SYSTEM;
    }

    // 現在のユーザーがスーパーアドミン権限を持つかどうかを判断
    public function isSuperAdmin(): bool
    {
        return $this->user()->isSuperAdmin();
    }
}

```

:::

## 外部プログラム用の独立したJWT生成ルールを作成

### アプリケーションシナリオ

エンタープライズアプリケーション開発では、システムを複数の独立したアプリケーションドメインに分割する必要があります：

- **管理バックエンド**: 管理者用のバックエンド管理システム
- **フロントエンドアプリケーション**: エンドユーザー向けのアプリケーションインターフェース
- **サードパーティ統合**: パートナー向けのAPIインターフェース
- **モバイルアプリケーション**: iOS/Androidなどのモバイル専用インターフェース

各アプリケーションドメインでは独立したJWT設定を使用し、以下を実現します：
- **セキュリティ分離**: 異なるアプリケーションで異なる署名鍵を使用
- **権限制御**: 異なるアプリケーションで異なる権限範囲を設定
- **独立設定**: 異なるアプリケーションで異なる有効期限などのパラメータを設定可能

### 実装手順

#### ステップ1: 環境変数の設定

`.env`ファイルに独立したJWT鍵を新規作成。各アプリケーションドメインに独立した鍵を設定することを推奨：

```bash
# 管理バックエンド（デフォルト）
JWT_SECRET=your_admin_secret_here

# フロントエンドAPI
JWT_API_SECRET=your_api_secret_here

# モバイルアプリケーション
JWT_MOBILE_SECRET=your_mobile_secret_here

# サードパーティ統合
JWT_PARTNER_SECRET=your_partner_secret_here
```

#### ステップ2: JWTシナリオの設定

`config/autoload/jwt.php`に複数のシナリオ設定を新規作成：

#### ステップ3: 専用ミドルウェアの作成

各アプリケーションドメイン用の専用トークン検証ミドルウェアを作成：

#### ステップ4: コントローラーでのミドルウェアの使用

対応するコントローラーで適切なミドルウェアを使用してユーザー検証：

#### ステップ5: 認証サービスの拡張

`PassportService`に対応するログインメソッドを新規追加：

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
        // jwt設定 https://lcobucci-jwt.readthedocs.io/en/latest/
        'driver' => Jwt::class,
        // jwt署名key
        'key' => InMemory::base64Encoded(env('JWT_SECRET')),
        // jwt署名アルゴリズム オプション https://lcobucci-jwt.readthedocs.io/en/latest/supported-algorithms/
        'alg' => new Sha256(),
        // token有効期限、秒単位（管理バックエンドは短めに推奨）
        'ttl' => (int) env('JWT_TTL', 3600), // 1時間
        // リフレッシュトークンの有効期限、秒単位
        'refresh_ttl' => (int) env('JWT_REFRESH_TTL', 7200), // 2時間
        // ブラックリストモード
        'blacklist' => [
            // ブラックリストを有効にするか
            'enable' => env('JWT_BLACKLIST_ENABLE', true),
            // ブラックリストキャッシュプレフィックス
            'prefix' => 'jwt_blacklist',
            // ブラックリストキャッシュドライバ
            'connection' => 'default',
            // ブラックリストキャッシュ時間 この時間は必ずtoken有効期限より少し長く設定、有効期限と同じに設定するのがベスト
            'ttl' => (int) env('JWT_BLACKLIST_TTL', 7201),
        ],
        'claims' => [
            // デフォルトのjwt claims
            RegisteredClaims::ISSUER => (string) env('APP_NAME'),
            RegisteredClaims::AUDIENCE => 'admin', // オーディエンスを明確に識別
        ],
    ],
    
    // フロントエンドAPIシナリオ
    'api' => [
        'key' => InMemory::base64Encoded(env('JWT_API_SECRET')),
        'ttl' => (int) env('JWT_API_TTL', 7200), // 2時間、フロントエンドは長めに
        'refresh_ttl' => (int) env('JWT_API_REFRESH_TTL', 86400), // 24時間
        'claims' => [
            RegisteredClaims::ISSUER => (string) env('APP_NAME'),
            RegisteredClaims::AUDIENCE => 'api',
        ],
    ],
    
    // モバイルシナリオ
    'mobile' => [
        'key' => InMemory::base64Encoded(env('JWT_MOBILE_SECRET')),
        'ttl' => (int) env('JWT_MOBILE_TTL', 86400), // 24時間、モバイルはさらに長く
        'refresh_ttl' => (int) env('JWT_MOBILE_REFRESH_TTL', 604800), // 7日
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
        // 前のステップで作成したシナリオ名を指定
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
        description: 'ログイン成功時の返却オブジェクト',
        example: '{"code":200,"message":"成功","data":{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MjIwOTQwNTYsIm5iZiI6MTcyMjA5NDAiwiZXhwIjoxNzIyMDk0MzU2fQ.7EKiNHb_ZeLJ1NArDpmK6sdlP7NsDecsTKLSZn_3D