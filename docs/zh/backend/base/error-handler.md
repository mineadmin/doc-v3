# 错误处理

## 默认的异常处理机制

::: tip

要理解 MineAdmin 的异常处理，首先需要你对 [Hyperf](https://hyperf.io) 的错误处理有一定的了解。
本文不讲述基础性的说明

:::

在 `config/autolaod/exceptions.php` 中，默认自带了一些异常处理器.
`AppExceptionHandler` 是对整个应用程序最终处理措施。如非必要请勿修改顺序逻辑

::: code-group

```php [exceptions.php]
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
use App\Exception\Handler\AppExceptionHandler;
use App\Exception\Handler\BusinessExceptionHandler;
use App\Exception\Handler\JwtExceptionHandler;
use App\Exception\Handler\UnauthorizedExceptionHandler;
use App\Exception\Handler\ValidationExceptionHandler;
use Hyperf\ExceptionHandler\Listener\ErrorExceptionHandler;
use Hyperf\HttpServer\Exception\Handler\HttpExceptionHandler;

return [
    'handler' => [
        'http' => [
            // 处理业务异常
            BusinessExceptionHandler::class,
            // 处理未授权异常
            UnauthorizedExceptionHandler::class,
            // 处理验证器异常
            ValidationExceptionHandler::class,
            // 处理JWT异常
            JwtExceptionHandler::class,
            // 处理应用异常
            AppExceptionHandler::class,
        ],
    ],
];

```

```php [AppExceptionHandler]
final class AppExceptionHandler extends AbstractHandler
{
    public function handleResponse(\Throwable $throwable): Result
    {
        $this->stopPropagation();
        return new Result(
            code: ResultCode::FAIL,
            message: $throwable->getMessage()
        );
    }
    
    public function isValid(\Throwable $throwable): bool
    {
        return true;
    }
}

```

```php [AbstractHandler]

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

namespace App\Exception\Handler;

use App\Http\Common\Result;
use Hyperf\Codec\Json;
use Hyperf\Context\Context;
use Hyperf\Contract\ConfigInterface;
use Hyperf\Contract\StdoutLoggerInterface;
use Hyperf\ExceptionHandler\ExceptionHandler;
use Hyperf\ExceptionHandler\Formatter\FormatterInterface;
use Hyperf\HttpMessage\Stream\SwooleStream;
use Hyperf\Logger\LoggerFactory;
use Mine\Support\Logger\UuidRequestIdProcessor;
use Mine\Support\Traits\Debugging;
use Psr\Container\ContainerInterface;
use Swow\Psr7\Message\ResponsePlusInterface;

abstract class AbstractHandler extends ExceptionHandler
{
    use Debugging;

    public function __construct(
        /** @phpstan-ignore-next-line */
        private readonly ConfigInterface $config,
        private readonly ContainerInterface $container,
        private readonly LoggerFactory $loggerFactory
    ) {}

    abstract public function handleResponse(\Throwable $throwable): Result;

    public function handle(\Throwable $throwable, ResponsePlusInterface $response)
    {
        $this->report($throwable);
        return value(function (ResponsePlusInterface $responsePlus)use ($throwable) {
            // 如果是 debug 模式，自动处理跨域
            if ($this->isDebug()) {
                $responsePlus
                    ->setHeader('Access-Control-Allow-Origin', '*')
                    ->setHeader('Access-Control-Allow-Credentials', 'true')
                    ->setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
                    ->setHeader('Access-Control-Allow-Headers', 'DNT,Keep-Alive,User-Agent,Cache-Control,Content-Type,Authorization');
                Context::set(self::class . '.throwable', [
                    'message' => $throwable->getMessage(),
                    'file' => $throwable->getFile(),
                    'line' => $throwable->getLine(),
                    'trace' => $throwable->getTrace(),
                ]);
            }
            return $responsePlus;
        }, $this->handlerRequestId(
            $this->handlerResult(
                $response,
                $this->handleResponse($throwable)
            )
        ));
    }

    /**
     * 上报日志+打印错误.
     */
    public function report(\Throwable $throwable)
    {
        // 如果是debug模式，打印错误到控制台
        if ($this->isDebug()) {
            $this->container->get(StdoutLoggerInterface::class)->error(
                $this->container->get(FormatterInterface::class)->format($throwable)
            );
        }
        $this->loggerFactory
            ->get('error')
            ->error($throwable->getMessage(), ['exception' => $throwable]);
    }

    /**
     * 处理result 打包到 response body 中.
     */
    protected function handlerResult(ResponsePlusInterface $responsePlus, Result $result): ResponsePlusInterface
    {
        $responsePlus->setHeader('Content-Type', 'application/json; charset=utf-8');

        if ($this->isDebug()){
            $result = $result->toArray();
            $result['throwable'] = Context::get(self::class . '.throwable');
            return $responsePlus
                ->setBody(new SwooleStream(Json::encode($result)));
        }

        return $responsePlus
            ->setBody(new SwooleStream(Json::encode($result)));
    }

    /**
     * 处理 response 加上 request-id 信息.
     */
    private function handlerRequestId(ResponsePlusInterface $responsePlus): ResponsePlusInterface
    {
        return $responsePlus->setHeader('Request-Id', UuidRequestIdProcessor::getUuid());
    }
}

```

:::


也就意味着，当应用发生错误时。如果 `APP_DEBUG=true` 则会打印`调用栈`以及在命令行输出`错误日志`
当然我们并不推荐你直接进行 `throw new Exception` 的操作。而是推荐使用 `throw new BusinessException` 抛出业务异常
以下是默认自带的业务异常

::: code-group

```php [BusinessException]
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

namespace App\Exception;

use App\Http\Common\Result;
use App\Http\Common\ResultCode;

class BusinessException extends \RuntimeException
{
    private Result $response;

    public function __construct(ResultCode $code = ResultCode::FAIL, ?string $message = null, mixed $data = [])
    {
        $this->response = new Result($code, $message, $data);
    }

    public function getResponse(): Result
    {
        return $this->response;
    }
}

```

```php [TestService]
class TestService{

    public function test(){
        if(false){
            throw new BusinessException(ResultCode::Fail,trans('xxx'));
        }
    }
}
```

```php [TestController]

class TestController {
    
   private TestService $testService;
   // ... other code
   
   public function test(){
      $this->testService->test();
      return $this->success();
   }

}

```

::: code-group

## 注册一个自定义异常

尽管默认自带的异常处理已经足够日常开发了，但如果遇到特殊的业务场景需要二次开发自己的异常处理器。那么就需要
保证你的异常处理器继承于 `App\Exception\Handler\AbstractHandler`. 并且实现 `handleResponse` 以及
`isValid` 方法

`isValid` 将当前的异常实例传入进来。需要返回 true 或 false 来判断当前异常是否需要捕获，`handleResponse` 则是当捕获到异常时，则调用此方法。并把返回的 Result 实例返回到 client

例如默认提供的 `UnauthorizedExceptionHandler` 异常处理类。他只处理 `UnauthorizedException`。也就是
未授权时才会进入到处理状态。并且返回 403 业务码.