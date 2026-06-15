# 多语言处理

::: tip

MineAdmin 的多语言处理依赖 [hyperf/translation](https://github.com/hyperf/translation)。
因此关于如何加载多语言本文不再另行讲述。

:::

## 客户端语言识别

在 MineAdmin 中。识别客户端的语言交由了 `Mine\Support\Middleware\TranslationMiddleware` 中间件识别
并在 `config/autoload/middlewares.php` 中进行了中间件注册

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

    // 获取语言标识
    protected function getLocale(ServerRequestInterface $request): string
    {
        
        $locale = null;
        // 判断请求头是否有 Accept-Language 语言标识。如果有则设置。如果没有则设置为简体中文
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
        // 请求ID中间件
        RequestIdMiddleware::class,
        // 多语言识别中间件
        TranslationMiddleware::class,
        // 跨域中间件，正式环境建议关闭。使用 Nginx 等代理服务器处理跨域问题。
        CorsMiddleware::class,
        // 验证器中间件,处理 formRequest 验证器
        ValidationMiddleware::class,
    ],
];


```

:::

## 使用

以经典的业务开发场景-用户中心用户登录来说。假设在登录时。需要返回 `登录成功` `登录失败` `密码错误` `用户已被锁定`

并且需要做 `简体中文` `繁体中文` `英语` 三个语言翻译。以下方示例为准。创建三个翻译文件

| 文件名称            | 文件所在目录        | 解释       |
|-----------------|---------------|----------|
| user-center.php | storage/en    | 英文翻译文件   |
| user-center.php | storage/zh_CN | 简体中文翻译文件 |
| user-center.php | storage/ZH_TW | 繁体中文翻译文件 |

同时在用户处理类中直接通过 `throw new BusinessException(ResultCode::Fail,'翻译标识')` 返回业务端错误信息

::: code-group

```php{1} [英文翻译文件]
// storage/en/user-center.php
return [
    'success' => 'Login Success.',
    'fail' => 'Login Fail.',
    ’passport_eror' => 'Incorrect password.',
    'user_lock' => 'The account has been locked.'
];
```

```php{1} [简体中文翻译文化]
// storage/zh_CN/user-center.php
return [
    'success' => '登录成功',
    'fail' => '登录失败',
    ’passport_eror' => '密码错误',
    'user_lock' => '账号已被锁定'
];
```

```php{1} [繁体中文翻译文件]
// storage/zh_TW/user-center.php
return [
    'success' => ' 登錄成功 ',
    'fail' => ' 登錄失敗 ',
    'passport_eror' => ' 密碼錯誤 ',
    'user_lock' => ' 賬號已被鎖定 '
];

```

```php{5,8,11} [业务处理类]
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
