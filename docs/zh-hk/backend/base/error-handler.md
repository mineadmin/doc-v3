# 錯誤處理

## 默認的異常處理機制

::: tip

要理解 MineAdmin 的異常處理，首先需要你對 [Hyperf](https://hyperf.io) 的錯誤處理有一定的瞭解。
本文不講述基礎性的説明

:::

在 `config/autolaod/exceptions.php` 中，默認自帶了一些異常處理器.
`AppExceptionHandler` 是對整個應用程序最終處理措施。如非必要請勿修改順序邏輯

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
            // 處理業務異常
            BusinessExceptionHandler::class,
            // 處理未授權異常
            UnauthorizedExceptionHandler::class,
            // 處理驗證器異常
            ValidationExceptionHandler::class,
            // 處理JWT異常
            JwtExceptionHandler::class,
            // 處理應用異常
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
            // 如果是 debug 模式，自動處理跨域
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
     * 上報日誌+打印錯誤.
     */
    public function report(\Throwable $throwable)
    {
        // 如果是debug模式，打印錯誤到控制枱
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
     * 處理result 打包到 response body 中.
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
     * 處理 response 加上 request-id 信息.
     */
    private function handlerRequestId(ResponsePlusInterface $responsePlus): ResponsePlusInterface
    {
        return $responsePlus->setHeader('Request-Id', UuidRequestIdProcessor::getUuid());
    }
}

```

:::


也就意味着，當應用發生錯誤時。如果 `APP_DEBUG=true` 則會打印`調用棧`以及在命令行輸出`錯誤日誌`
當然我們並不推薦你直接進行 `throw new Exception` 的操作。而是推薦使用 `throw new BusinessException` 拋出業務異常
以下是默認自帶的業務異常

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

## 註冊一個自定義異常

儘管默認自帶的異常處理已經足夠日常開發了，但如果遇到特殊的業務場景需要二次開發自己的異常處理器。那麼就需要
保證你的異常處理器繼承於 `App\Exception\Handler\AbstractHandler`. 並且實現 `handleResponse` 以及
`isValid` 方法

`isValid` 將當前的異常實例傳入進來。需要返回 true 或 false 來判斷當前異常是否需要捕獲，`handleResponse` 則是當捕獲到異常時，則調用此方法。並把返回的 Result 實例返回到 client

例如默認提供的 `UnauthorizedExceptionHandler` 異常處理類。他只處理 `UnauthorizedException`。也就是
未授權時才會進入到處理狀態。並且返回 403 業務碼.