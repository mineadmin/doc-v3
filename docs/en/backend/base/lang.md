# Multilingual Processing

::: tip

MineAdmin's multilingual processing relies on [hyperf/translation](https://github.com/hyperf/translation).
Therefore, this article will not elaborate on how to load multiple languages.

:::

## Client Language Identification

In MineAdmin, the identification of the client's language is handled by the `Mine\Support\Middleware\TranslationMiddleware` middleware,
which is registered in `config/autoload/middlewares.php`.

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

    // Get language identifier
    protected function getLocale(ServerRequestInterface $request): string
    {
        
        $locale = null;
        // Check if the request header has an Accept-Language identifier. If so, set it. If not, set it to Simplified Chinese.
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
        // Request ID middleware
        RequestIdMiddleware::class,
        // Multilingual identification middleware
        TranslationMiddleware::class,
        // Cross-origin middleware, recommended to disable in production. Use Nginx or other proxy servers to handle cross-origin issues.
        CorsMiddleware::class,
        // Validator middleware, handles formRequest validators
        ValidationMiddleware::class,
    ],
];


```

:::

## Usage

Taking the classic business development scenario—user center login—as an example. Assume that during login, you need to return `Login Success`, `Login Fail`, `Incorrect Password`, `User Locked`.

And you need to translate these into `Simplified Chinese`, `Traditional Chinese`, and `English`. Create three translation files as per the example below.

| File Name         | Directory        | Explanation       |
|-------------------|------------------|-------------------|
| user-center.php   | storage/en       | English translation file   |
| user-center.php   | storage/zh_CN    | Simplified Chinese translation file |
| user-center.php   | storage/zh_TW    | Traditional Chinese translation file |

In the user processing class, directly return business-side error messages through `throw new BusinessException(ResultCode::Fail,'translation identifier')`.

::: code-group

```php{1} [English Translation File]
// storage/en/user-center.php
return [
    'success' => 'Login Success.',
    'fail' => 'Login Fail.',
    'passport_error' => 'Incorrect password.',
    'user_lock' => 'The account has been locked.'
];
```

```php{1} [Simplified Chinese Translation File]
// storage/zh_CN/user-center.php
return [
    'success' => '登录成功',
    'fail' => '登录失败',
    'passport_error' => '密码错误',
    'user_lock' => '账号已被锁定'
];
```

```php{1} [Traditional Chinese Translation File]
// storage/zh_TW/user-center.php
return [
    'success' => '登錄成功',
    'fail' => '登錄失敗',
    'passport_error' => '密碼錯誤',
    'user_lock' => '賬號已被鎖定'
];

```

```php{5,8,11} [Business Processing Class]
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