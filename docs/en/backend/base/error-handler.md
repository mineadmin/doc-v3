# Error Handling

## Default Exception Handling Mechanism

::: tip

To understand MineAdmin's exception handling, you first need to have a basic understanding of [Hyperf](https://hyperf.io)'s error handling.
This article does not cover basic explanations.

:::

In `config/autolaod/exceptions.php`, some exception handlers are included by default.
`AppExceptionHandler` is the final measure for handling exceptions across the entire application. Unless necessary, do not modify the order logic.

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
            // Handle business exceptions
            BusinessExceptionHandler::class,
            // Handle unauthorized exceptions
            UnauthorizedExceptionHandler::class,
            // Handle validation exceptions
            ValidationExceptionHandler::class,
            // Handle JWT exceptions
            JwtExceptionHandler::class,
            // Handle application exceptions
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
            // If in debug mode, automatically handle CORS
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
     * Log and print errors.
     */
    public function report(\Throwable $throwable)
    {
        // If in debug mode, print errors to the console
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
     * Handle the result and package it into the response body.
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
     * Handle the response by adding request-id information.
     */
    private function handlerRequestId(ResponsePlusInterface $responsePlus): ResponsePlusInterface
    {
        return $responsePlus->setHeader('Request-Id', UuidRequestIdProcessor::getUuid());
    }
}

```

:::

This means that when an error occurs in the application, if `APP_DEBUG=true`, it will print the `call stack` and output `error logs` in the command line.
However, we do not recommend directly using `throw new Exception`. Instead, we recommend using `throw new BusinessException` to throw business exceptions.
The following are the default business exceptions included.

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

## Registering a Custom Exception

Although the default exception handling is sufficient for daily development, if you encounter special business scenarios that require custom exception handlers, you need to ensure that your exception handler inherits from `App\Exception\Handler\AbstractHandler` and implements the `handleResponse` and `isValid` methods.

`isValid` takes the current exception instance and returns true or false to determine whether the exception needs to be caught. `handleResponse` is called when the exception is caught, and the returned Result instance is sent back to the client.

For example, the default `UnauthorizedExceptionHandler` exception handler only handles `UnauthorizedException`, meaning it only processes unauthorized exceptions and returns a 403 business code.