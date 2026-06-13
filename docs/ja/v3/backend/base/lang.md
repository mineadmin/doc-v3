# 多言語処理

::: tip

MineAdmin の多言語処理は [hyperf/translation](https://github.com/hyperf/translation) に依存しています。
そのため、多言語ファイルの読み込み方法についてはここでは説明しません。

:::

## クライアント言語の識別

MineAdmin では、クライアントの言語識別を `Mine\Support\Middleware\TranslationMiddleware` ミドルウェアに任せています。
また、`config/autoload/middlewares.php` でミドルウェアの登録が行われています。

::: code-group

```php{34-41} [TranslationMiddleware]

declare(strict_types=1);
/**
 * This file is part of MineAdmin.
 *
 * @link     https://www.mineadmin.com
 * @document https://doc.mineadmin.com
 * @contact  root@imoi.cn
 * @license  https://github.com/mineadmin/MineAdmin/blob/master/LICENSE
 */

namespace Mine\Support\Middleware;

use Hyperf\Contract\TranslatorInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class TranslationMiddleware implements MiddlewareInterface
{
    public function __construct(
        private readonly TranslatorInterface $translator
    ) {}

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $this->translator->setLocale($this->getLocale($request));
        return $handler->handle($request);
    }

    // 言語識別子を取得
    protected function getLocale(ServerRequestInterface $request): string
    {
        
        $locale = null;
        // リクエストヘッダーに Accept-Language 言語識別子があるか判断。あれば設定。なければ簡体字中国語を設定
        if ($request->hasHeader('Accept-Language')) {
            $locale = $request->getHeaderLine('Accept-Language');
        }
        return $locale ?: 'zh_CN';
    }
}
```

```php{25-26} [middlewares.php]
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
use Hyperf\Validation\Middleware\ValidationMiddleware;
use Mine\Support\Middleware\CorsMiddleware;
use Mine\Support\Middleware\RequestIdMiddleware;
use Mine\Support\Middleware\TranslationMiddleware;

return [
    'http' => [
        // リクエストIDミドルウェア
        RequestIdMiddleware::class,
        // 多言語識別ミドルウェア
        TranslationMiddleware::class,
        // CORSミドルウェア、本番環境では無効化推奨。Nginxなどのプロキシサーバーでクロスドメイン問題を処理
        CorsMiddleware::class,
        // バリデーターミドルウェア、formRequest バリデーターを処理
        ValidationMiddleware::class,
    ],
];


```

:::

## 使用方法

典型的なビジネス開発シナリオ-ユーザー管理のユーザーログインを例とします。ログイン時に `ログイン成功` `ログイン失敗` `パスワードエラー` `ユーザーがロックされています` を返す必要があると仮定します。

また、`簡体字中国語` `繁体字中国語` `英語` の3言語翻訳が必要です。以下の例に従って、3つの翻訳ファイルを作成します。

| ファイル名          | ファイル保存ディレクトリ | 説明         |
|-----------------|---------------|------------|
| user-center.php | storage/en    | 英語翻訳ファイル   |
| user-center.php | storage/zh_CN | 簡体字中国語翻訳ファイル |
| user-center.php | storage/ZH_TW | 繁体字中国語翻訳ファイル |

同時に、ユーザー処理クラス内で直接 `throw new BusinessException(ResultCode::Fail,'翻訳識別子')` を使用してビジネス側のエラー情報を返します。

::: code-group

```php{1} [英語翻訳ファイル]
// storage/en/user-center.php
return [
    'success' => 'Login Success.',
    'fail' => 'Login Fail.',
    'passport_eror' => 'Incorrect password.',
    'user_lock' => 'The account has been locked.'
];
```

```php{1} [簡体字中国語翻訳ファイル]
// storage/zh_CN/user-center.php
return [
    'success' => '登录成功',
    'fail' => '登录失败',
    'passport_eror' => '密码错误',
    'user_lock' => '账号已被锁定'
];
```

```php{1} [繁体字中国語翻訳ファイル]
// storage/zh_TW/user-center.php
return [
    'success' => ' 登錄成功 ',
    'fail' => ' 登錄失敗 ',
    'passport_eror' => ' 密碼錯誤 ',
    'user_lock' => ' 賬號已被鎖定 '
];

```

```php{5,8,11} [ビジネス処理クラス]
class UserController extends AbstractController {
    public function Login(string $username,string $password){
        $entity = UserModel::query->where('username',$username)->first();
        if(!$entity){
            throw new BusinessException(ResultCode::Fail,trans('user-center.fail');
        }
        if(!password_verify($password,$entity->password)){
            throw new BusinessException(ResultCode::Fail,trans('user-center.passport_error');
        }
        if($user->status !== StatusEnum::Normal){
            throw new BusinessException(ResultCode::Fail,trans('user-center.user_lock');
        }
        return $this->success(trans('user-center.success'));
    }
}

```
:::