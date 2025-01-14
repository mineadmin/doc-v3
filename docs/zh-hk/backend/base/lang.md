# 多語言處理

::: tip

MineAdmin 的多語言處理依賴 [hyperf/translation](https://github.com/hyperf/translation)。
因此關於如何加載多語言本文不再另行講述。

:::

## 客户端語言識別

在 MineAdmin 中。識別客户端的語言交由了 `Mine\Support\Middleware\TranslationMiddleware` 中間件識別
並在 `config/autoload/middlewares.php` 中進行了中間件註冊

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

    // 獲取語言標識
    protected function getLocale(ServerRequestInterface $request): string
    {
        
        $locale = null;
        // 判斷請求頭是否有 Accept-Language 語言標識。如果有則設置。如果沒有則設置為簡體中文
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
        // 請求ID中間件
        RequestIdMiddleware::class,
        // 多語言識別中間件
        TranslationMiddleware::class,
        // 跨域中間件，正式環境建議關閉。使用 Nginx 等代理服務器處理跨域問題。
        CorsMiddleware::class,
        // 驗證器中間件,處理 formRequest 驗證器
        ValidationMiddleware::class,
    ],
];


```

:::

## 使用

以經典的業務開發場景-用户中心用户登錄來説。假設在登錄時。需要返回 `登錄成功` `登錄失敗` `密碼錯誤` `用户已被鎖定`

並且需要做 `簡體中文` `繁體中文` `英語` 三個語言翻譯。以下方示例為準。創建三個翻譯文件

| 文件名稱            | 文件所在目錄        | 解釋       |
|-----------------|---------------|----------|
| user-center.php | storage/en    | 英文翻譯文件   |
| user-center.php | storage/zh_CN | 簡體中文翻譯文件 |
| user-center.php | storage/ZH_TW | 繁體中文翻譯文件 |

同時在用户處理類中直接通過 `throw new BusinessException(ResultCode::Fail,'翻譯標識')` 返回業務端錯誤信息

::: code-group

```php{1} [英文翻譯文件]
// storage/en/user-center.php
return [
    'success' => 'Login Success.',
    'fail' => 'Login Fail.',
    ’passport_eror' => 'Incorrect password.',
    'user_lock' => 'The account has been locked.'
];
```

```php{1} [簡體中文翻譯文化]
// storage/zh_CN/user-center.php
return [
    'success' => '登錄成功',
    'fail' => '登錄失敗',
    ’passport_eror' => '密碼錯誤',
    'user_lock' => '賬號已被鎖定'
];
```

```php{1} [繁體中文翻譯文件]
// storage/zh_TW/user-center.php
return [
    'success' => ' 登錄成功 ',
    'fail' => ' 登錄失敗 ',
    'passport_eror' => ' 密碼錯誤 ',
    'user_lock' => ' 賬號已被鎖定 '
];

```

```php{5,8,11} [業務處理類]
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
