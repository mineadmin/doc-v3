# 多言語処理

::: tip

MineAdminの多言語処理は [hyperf/translation](https://github.com/hyperf/translation) に依存しています。
したがって、多言語のロード方法については本記事では改めて説明しません。

:::

## クライアント言語識別

MineAdminでは、クライアントの言語識別は `Mine\Support\Middleware\TranslationMiddleware` ミドルウェアによって行われ、
`config/autoload/middlewares.php` でミドルウェア登録されています。

::: code-group

```php{34-41} [TranslationMiddleware]

declare(strict_types=1);
/**
 * このファイルはMineAdminの一部です。
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
        // リクエストヘッダーにAccept-Language言語識別子があるかどうかを判断。あれば設定し、なければ簡体中国語に設定
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
 * このファイルはMineAdminの一部です。
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
        // CORSミドルウェア、本番環境では無効化推奨。NginxなどのプロキシサーバーでCORS問題を処理
        CorsMiddleware::class,
        // バリデーターミドルウェア、formRequestバリデーターを処理
        ValidationMiddleware::class,
    ],
];


```

:::

## 使用方法

典型的な業務開発シナリオであるユーザーセンターのログインを例に説明します。ログイン時に「ログイン成功」「ログイン失敗」「パスワードエラー」「ユーザーがロックされています」を返す必要があるとします。

また、「簡体中国語」「繁体中国語」「英語」の3言語翻訳が必要です。以下の例に従って3つの翻訳ファイルを作成します。

| ファイル名          | ファイルディレクトリ    | 説明       |
|-----------------|---------------|----------|
| user-center.php | storage/en    | 英語翻訳ファイル   |
| user-center.php | storage/zh_CN | 簡体中国語翻訳ファイル |
| user-center.php | storage/zh_TW | 繁体中国語翻訳ファイル |

ユーザー処理クラスでは直接 `throw new BusinessException(ResultCode::Fail,'翻訳識別子')` で業務エラーメッセージを返します。

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

```php{1} [簡体中国語翻訳ファイル]
// storage/zh_CN/user-center.php
return [
    'success' => '登录成功',
    'fail' => '登录失败',
    'passport_eror' => '密码错误',
    'user_lock' => '账号已被锁定'
];
```

```php{1} [繁体中国語翻訳ファイル]
// storage/zh_TW/user-center.php
return [
    'success' => '登錄成功',
    'fail' => '登錄失敗',
    'passport_eror' => '密碼錯誤',
    'user_lock' => '賬號已被鎖定'
];

```

```php{5,8,11} [業務処理クラス]
class UserController extends AbstractController {
    public function Login(string $username,string $password){
        $entity = UserModel::query->where('username',$username)->first();
        if(!$entity){
            throw new BusinessException(ResultCode::Fail,trans('user-center.fail'));
        }
        if(!password_verify($password,$entity->password)){
            throw new BusinessException(ResultCode::Fail,trans('user-center.passport_error'));
        }
        if($user->status !== StatusEnum::Normal){
            throw new BusinessException(ResultCode::Fail,trans('user-center.user_lock'));
        }
        return $this->success(trans('user-center.success'));
    }
}

```
:::