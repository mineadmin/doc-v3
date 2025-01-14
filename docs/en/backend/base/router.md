# Routing and API Documentation

All built-in interfaces are integrated with [Swagger](https://swagger.io) documentation. During local development, you can access the existing API documentation by visiting `localhost:9503/swagger`.

::: tip

[mineadmin/swagger](https://github.com/mineadmin/Swagger) is based on [hyperf/swagger](https://github.com/hyperf/swagger) and provides a set of documentation annotations suitable for the MineAdmin scaffold.

`hyperf/swagger` is based on [zircote/swagger-php](https://github.com/zircote/swagger-php), which encapsulates the logic for collecting swagger annotations and generating API documentation.

`zircote/swagger-php` is a foundational encapsulation of the [OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification).

This article will explain how to use Swagger to develop your API applications in MineAdmin.

:::

## HTTP Specifications

### Route Naming

In modern applications, the Restful style has become very popular. In versions `2.0` and `3.0`, we recommend following the guidelines below to standardize your API interfaces.

- Use GET to retrieve data
- Use PUT to modify data
- Use DELETE to delete data
- Use POST to create data

Taking the built-in `UserController` as an example:

- GET `/admin/user/list` to get the user list
- PUT `/admin/user/{id}` to modify a single user
- POST `/admin/user` to create a user
- DELETE `/admin/user` to delete a user

You should ensure that your application adheres to the official recommended standards as much as possible, but do not blindly follow them. While technical standards can make your application more robust, they should not be pursued at the expense of sustainable business iteration.

### HTTP Response Structure

The recommended and followed global response object is `\App\Http\Common\Result`. In your interface development, to facilitate future `iterative upgrades` and adhere to unified standards, you should return an instance of `\App\Http\Common\Result` rather than manually constructing response parameters. We also provide `App\Http\Common\Controller\AbstractController` to quickly return `Result` instances in daily development.

Simply use `return $this->success()` in your controller to assemble a new `Result` instance.

::: code-group

```php [Result]
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

namespace App\Http\Common;

use Hyperf\Contract\Arrayable;
use Hyperf\Swagger\Annotation as OA;

/**
 * @template T
 */
#[OA\Schema(title: 'Api Response', description: 'Api Response')]
class Result implements Arrayable
{
    /**
     * @param ResultCode $code
     * @param null|string $message
     * @param T $data
     */
    public function __construct(
        #[OA\Property(ref: 'ResultCode', title: 'Response Code')]
        public ResultCode $code = ResultCode::SUCCESS,
        #[OA\Property(title: 'Response Message', type: 'string')]
        public ?string $message = null,
        #[OA\Property(title: 'Response Data', type: 'array')]
        public mixed $data = []
    ) {
        if ($this->message === null) {
            $this->message = ResultCode::getMessage($this->code->value);
        }
    }

    public function toArray(): array
    {
        return [
            'code' => $this->code->value,
            'message' => $this->message,
            'data' => $this->data,
        ];
    }
}
```

```php [Common\Controller\AbstractController]
abstract class AbstractController
{
    protected function success(mixed $data = [], ?string $message = null): Result
    {
        return new Result(ResultCode::SUCCESS, $message, $data);
    }

    protected function error(?string $message = null, mixed $data = []): Result
    {
        return new Result(ResultCode::FAIL, $message, $data);
    }

    protected function json(ResultCode $code, mixed $data = [], ?string $message = null): Result
    {
        return new Result($code, $message, $data);
    }
}
```

```php [Admin\Controller\AbstractController]
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

use App\Http\Common\Controller\AbstractController as Base;
use Hyperf\Context\ApplicationContext;
use Hyperf\HttpServer\Contract\RequestInterface;

class AbstractController extends Base
{
    protected function getCurrentPage(): int
    {
        return (int) $this->getRequest()->input('page', 1);
    }

    protected function getPageSize(): int
    {
        return (int) $this->getRequest()->input('page_size', 10);
    }

    protected function getRequest(): RequestInterface
    {
        return ApplicationContext::getContainer()->get(RequestInterface::class);
    }
}
```

:::

### HTTP Result Code

A default `App\Http\Common\ResultCode` enumeration is provided, along with some common codes for business development.

```php [Result]
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

namespace App\Http\Common;

use Hyperf\Constants\Annotation\Constants;
use Hyperf\Constants\Annotation\Message;
use Hyperf\Constants\ConstantsTrait;
use Hyperf\Swagger\Annotation as OA;

#[Constants]
#[OA\Schema(title: 'ResultCode', type: 'integer', default: 200)]
enum ResultCode: int
{
    use ConstantsTrait;

    #[Message('result.success')]
    case SUCCESS = 200;

    #[Message('result.fail')]
    case FAIL = 500;

    #[Message('result.unauthorized')]
    case UNAUTHORIZED = 401;

    #[Message('result.forbidden')]
    case FORBIDDEN = 403;

    #[Message('result.not_found')]
    case NOT_FOUND = 404;

    #[Message('result.method_not_allowed')]
    case METHOD_NOT_ALLOWED = 405;

    #[Message('result.not_acceptable')]
    case NOT_ACCEPTABLE = 406;

    #[Message('result.conflict')]
    case UNPROCESSABLE_ENTITY = 422;
}
```

## MineAdmin Annotations

All namespaces below are prefixed with `Mine\Swagger\Attributes\` to form the complete namespace.

### `ResultResponse`

Used to generate interface response-related information.

#### Constructor Prototype

```php
ResultResponse::__construct(object|string $instance,?string $title = null,?array $examples = null,?string $description = null, mixed $example = Generator::UNDEFINED,?array $headers = null,?int $response = 200)
```

#### Parameter Description

- $instance: Class instance or class name; if the returned class has other annotations, they will be automatically parsed.
- $title: Title
- $examples: Declare multiple examples
- $description: Return description
- $example: Declare a single example
- $headers: Response headers
- $response: Returned HTTP code

#### Usage Example

This example is based on the login interface. The complete namespace involved will not be discussed further and can be found in the downloaded application.

::: code-group

```php [Controller]

#[ResultResponse(
    instance: new Result(data: new PassportLoginVo()),
    title: 'Login Successful',
    description: 'Login successful return object',
    example: '{"code":200,"message":"Success","data":{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MjIwOTQwNTYsIm5iZiI6MTcyMjA5NDAiwiZXhwIjoxNzIyMDk0MzU2fQ.7EKiNHb_ZeLJ1NArDpmK6sdlP7NsDecsTKLSZn_3D7k","refresh_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MjIwOTQwNTYsIm5iZiI6MTcyMjA5NDAiwiZXhwIjoxNzIyMDk0MzU2fQ.7EKiNHb_ZeLJ1NArDpmK6sdlP7NsDecsTKLSZn_3D7k","expire_at":300}}'
)]
public function login(RoleRequest $request): Result
{
    return $this->success();
}
```

```php [Result]
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

namespace App\Http\Common;

use Hyperf\Contract\Arrayable;
use Hyperf\Swagger\Annotation as OA;

/**
 * @template T
 */
#[OA\Schema(title: 'Api Response', description: 'Api Response')]
class Result implements Arrayable
{
    /**
     * @param ResultCode $code
     * @param null|string $message
     * @param T $data
     */
    public function __construct(
        #[OA\Property(ref: 'ResultCode', title: 'Response Code')]
        public ResultCode $code = ResultCode::SUCCESS,
        #[OA\Property(title: 'Response Message', type: 'string')]
        public ?string $message = null,
        #[OA\Property(title: 'Response Data', type: 'array')]
        public mixed $data = []
    ) {
        if ($this->message === null) {
            $this->message = ResultCode::getMessage($this->code->value);
        }
    }

    public function toArray(): array
    {
        return [
            'code' => $this->code->value,
            'message' => $this->message,
            'data' => $this->data,
        ];
    }
}
```

```json [OpenAPI]
"responses": {
          "200": {
            "description": "Login successful return object",
            "content": {
              "application/json": {
                "schema": {
                  "title": "Login Successful",
                  "properties": {
                    "code": {
                      "$ref": "#/components/schemas/ResultCode"
                    },
                    "message": {
                      "rules": null,
                      "attribute": null
                    },
                    "data": {
                      "$ref": "#/components/schemas/PassportLoginVo"
                    }
                  },
                  "type": "object"
                },
                "example": "{\"code\":200,\"message\":\"Success\",\"data\":{\"access_token\":\"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MjIwOTQwNTYsIm5iZiI6MTcyMjA5NDAiwiZXhwIjoxNzIyMDk0MzU2fQ.7EKiNHb_ZeLJ1NArDpmK6sdlP7NsDecsTKLSZn_3D7k\",\"refresh_token\":\"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MjIwOTQwNTYsIm5iZiI6MTcyMjA5NDAiwiZXhwIjoxNzIyMDk0MzU2fQ.7EKiNHb_ZeLJ1NArDpmK6sdlP7NsDecsTKLSZn_3D7k\",\"expire_at\":300}}"
              }
            }
          }
        }
```

```php [PassportLoginVo]
#[OA\Schema(
    description: 'Login successful return',
    example: '{"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MjIwOTQwNTYsIm5iZiI6MTcyMjA5NDAiwiZXhwIjoxNzIyMDk0MzU2fQ.7EKiNHb_ZeLJ1NArDpmK6sdlP7NsDecsTKLSZn_3D7k","expire_at":300}'
)]
final class PassportLoginVo
{
    #[OA\Property(
        description: 'Access Token',
        type: 'string',
        example: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MjIwOTQwNTYsIm5iZiI6MTcyMjA5NDAiwiZXhwIjoxNzIyMDk0MzU2fQ.7EKiNHb_ZeLJ1NArDpmK6sdlP7NsDecsTKLSZn_3D7k'
    )]
    public string $access_token;

    #[OA\Property(
        description: 'Refresh Token',
        type: 'string',
        example: 'eyJ0eXAiOi'
    )]
    public string $refresh_token;

    #[OA\Property(
        description: 'Expiration time, in seconds',
        type: 'integer',
        example: 300
    )]
    public int $expire_at;
}
```

:::

### `PageResponse`

Used to return pagination information.

#### Constructor Prototype

Same as `ResultResponse`.

#### Parameter Description

Same as `ResultResponse`.

#### Usage Example

From the default user list interface.

::: code-group

```php [Controller]
#[PageResponse(instance: UserSchema::class)]
public function pageList(Request $request): Result
{
    return $this->success(
        $this->userService->page(
            $request->all(),
            $this->getCurrentPage(),
            $this->getPageSize()
        )
    );
}
```

```php [UserSchema]

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

namespace App\Schema;

use App\Model\Enums\User\Status;
use App\Model\Enums\User\Type;
use App\Model\Permission\User;
use Hyperf\Swagger\Annotation\Property;
use Hyperf\Swagger\Annotation\Schema;

#[Schema]
final class UserSchema implements \JsonSerializable
{
    #[Property(property: 'id', title: 'User ID, primary key', type: 'int')]
    public ?int $id;

    #[Property(property: 'username', title: 'Username', type: 'string')]
    public ?string $username;

    #[Property(property: 'user_type', title: 'User type: (100 system user)', type: 'string')]
    public ?Type $userType;

    #[Property(property: 'nickname', title: 'User nickname', type: 'string')]
    public ?string $nickname;

    #[Property(property: 'phone', title: 'Phone', type: 'string')]
    public ?string $phone;

    #[Property(property: 'email', title: 'User email', type: 'string')]
    public ?string $email;

    #[Property(property: 'avatar', title: 'User avatar', type: 'string')]
    public ?string $avatar;

    #[Property(property: 'signed', title: 'Personal signature', type: 'string')]
    public ?string $signed;

    #[Property(property: 'status', title: 'Status (1 normal 2 disabled)', type: 'int')]
    public ?Status $status;

    #[Property(property: 'login_ip', title: 'Last login IP', type: 'string')]
    public ?string $loginIp;

    #[Property(property: 'login_time', title: 'Last login time', type: 'string')]
    public mixed $loginTime;

    #[Property(property: 'backend_setting', title: 'Backend setting data', type: 'array')]
    public ?array $backendSetting;

    #[Property(property: 'created_by', title: 'Creator', type: 'int')]
    public ?int $createdBy;

    #[Property(property: 'updated_by', title: 'Updater', type: 'int')]
    public ?int $updatedBy;

    #[Property(property: 'created_at', title: 'Creation time', type: 'string')]
    public mixed $createdAt;

    #[Property(property: 'updated_at', title: 'Update time', type: 'string')]
    public mixed $updatedAt;

    #[Property(property: 'deleted_at', title: 'Deletion time', type: 'string')]
    public mixed $deletedAt;

    #[Property(property: 'remark', title: 'Remark', type: 'string')]
    public ?string $remark;

    public function __construct(User $model)
    {
        $this->id = $model->id;
        $this->username = $model->username;
        $this->userType = $model->user_type;
        $this->nickname = $model->nickname;
        $this->phone = $model->phone;
        $this->email = $model->email;
        $this->avatar = $model->avatar;
        $this->signed = $model->signed;
        $this->status = $model->status;
        $this->loginIp = $model->login_ip;
        $this->loginTime = $model->login_time;
        $this->backendSetting = $model->backend_setting