# 路由與API文檔

內置所有接口接入了 [Swagger](https://swagger.io) 文檔,
在本地開發時，訪問 `localhost:9503/swagger` 即可訪問現有的 API文檔

::: tip

[mineadmin/swagger](https://github.com/mineadmin/Swagger) 基於 [hyperf/swagger](https://github.com/hyperf/swagger)封裝了一套適用於 MineAdmin 手腳架的文檔註解

而 `hyperf/swagger` 則基於 [zircote/swagger-php](https://github.com/zircote/swagger-php) 封裝了 swagger 註解收集並生成 API 文檔的邏輯

`zircote/swagger-php` 則是對 [OpenAPI 規範](https://github.com/OAI/OpenAPI-Specification)的基層封裝

本文將講解如何在 MineAdmin 中使用 Swagger 開發您的 API 應用程序

:::

## Http 規範

### 路由命名

在現代化應用程序中，Restful 風格已經風靡人心。在 `2.0` 以及 `3.0` 版本中。我們推薦按照以下説明規範你的 API 接口

- 獲取數據使用 GET
- 修改數據使用 PUT
- 刪除數據使用 DELETE
- 新增數據使用 POST

以自帶的 `UserController` 舉例。

- GET `/admin/user/list` 獲取用户列表
- PUT `/admin/user/{id}` 修改單一用户
- POST `/admin/user` 創建用户
- DELETE `/admin/user` 刪除用户

你應該保證你的應用程序儘量貼合官方推薦規範,但請不要`無腦參考`. 
雖然技術的規範會使你的應用程序更加壯碩。但是不能一味追求規範。需要以業務的可持續迭代為主

### HTTP 響應結構體

推薦並遵循的是全局的響應對象為 `\App\Http\Common\Result`，也就是
在你的接口開發中，為了方便後續的`迭代升級`以及遵循統一的規範。你應該返回 `\App\Http\Common\Result` 實例。而不是自己拼接響應參數
同時我們也提供了 `App\Http\Common\Controller\AbstractController` 方便在日常開發中能夠快速返回 `Result` 實例

只需在你的控制器中使用 `return $this->success()` 即可組裝成一個全新的 `Result` 實例

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
        #[OA\Property(ref: 'ResultCode', title: '響應碼')]
        public ResultCode $code = ResultCode::SUCCESS,
        #[OA\Property(title: '響應消息', type: 'string')]
        public ?string $message = null,
        #[OA\Property(title: '響應數據', type: 'array')]
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

### Http Result Code

默認提供了一個 `App\Http\Common\ResultCode` 枚舉。並準備了一些公用的 code 方便業務開發.

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


## MineAdmin 註解

以下所有沒有做完整命名空間全部以 `Mine\Swagger\Attributes\` 前綴拼接為完整命名空間

### `ResultResponse`

用作生成接口響應相關信息

#### 構造函數原型

```php
ResultResponse::__construct(object|string $instance,?string $title = null,?array $examples = null,?string $description = null, mixed $example = Generator::UNDEFINED,?array $headers = null,?int $response = 200)
```

#### 參數説明

- $instance：類實例或者類名、返回的類如果有其他註解將自動解析
- $title：標題
- $examples：聲明多個示例,
- $description：返回説明
- $example：聲明單個示例。
- $headers：響應頭。
- $response：返回的 http code

#### 使用示例

本文示例基於 登錄接口。涉及的完整命名空間將不再講述，可以在你下載的應用程序中自行尋找

::: code-group

```php [Controller]

#[ResultResponse(
    instance: new Result(data: new PassportLoginVo()),
    title: '登錄成功',
    description: '登錄成功返回對象',
    example: '{"code":200,"message":"成功","data":{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MjIwOTQwNTYsIm5iZiI6MTcyMjA5NDAiwiZXhwIjoxNzIyMDk0MzU2fQ.7EKiNHb_ZeLJ1NArDpmK6sdlP7NsDecsTKLSZn_3D7k","refresh_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MjIwOTQwNTYsIm5iZiI6MTcyMjA5NDAiwiZXhwIjoxNzIyMDk0MzU2fQ.7EKiNHb_ZeLJ1NArDpmK6sdlP7NsDecsTKLSZn_3D7k","expire_at":300}}'
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
        #[OA\Property(ref: 'ResultCode', title: '響應碼')]
        public ResultCode $code = ResultCode::SUCCESS,
        #[OA\Property(title: '響應消息', type: 'string')]
        public ?string $message = null,
        #[OA\Property(title: '響應數據', type: 'array')]
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
            "description": "登錄成功返回對象",
            "content": {
              "application/json": {
                "schema": {
                  "title": "登錄成功",
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
                "example": "{\"code\":200,\"message\":\"成功\",\"data\":{\"access_token\":\"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MjIwOTQwNTYsIm5iZiI6MTcyMjA5NDAiwiZXhwIjoxNzIyMDk0MzU2fQ.7EKiNHb_ZeLJ1NArDpmK6sdlP7NsDecsTKLSZn_3D7k\",\"refresh_token\":\"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MjIwOTQwNTYsIm5iZiI6MTcyMjA5NDAiwiZXhwIjoxNzIyMDk0MzU2fQ.7EKiNHb_ZeLJ1NArDpmK6sdlP7NsDecsTKLSZn_3D7k\",\"expire_at\":300}}"
              }
            }
          }
        }
```

```php [PassportLoginVo]
#[OA\Schema(
    description: '登錄成功返回',
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
        description: '過期時間,單位秒',
        type: 'integer',
        example: 300
    )]
    public int $expire_at;
}
```

:::

### `PageResponse`

作用返回分頁説明

#### 構造函數原型

與 `ResultResponse` 原型一致

#### 參數説明

與 `ResultResponse` 原型一致

#### 使用示例

來自默認自帶的用户列表接口

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
    #[Property(property: 'id', title: '用户ID，主鍵', type: 'int')]
    public ?int $id;

    #[Property(property: 'username', title: '用户名', type: 'string')]
    public ?string $username;

    #[Property(property: 'user_type', title: '用户類型：(100系統用户)', type: 'string')]
    public ?Type $userType;

    #[Property(property: 'nickname', title: '用户暱稱', type: 'string')]
    public ?string $nickname;

    #[Property(property: 'phone', title: '手機', type: 'string')]
    public ?string $phone;

    #[Property(property: 'email', title: '用户郵箱', type: 'string')]
    public ?string $email;

    #[Property(property: 'avatar', title: '用户頭像', type: 'string')]
    public ?string $avatar;

    #[Property(property: 'signed', title: '個人簽名', type: 'string')]
    public ?string $signed;

    #[Property(property: 'status', title: '狀態 (1正常 2停用)', type: 'int')]
    public ?Status $status;

    #[Property(property: 'login_ip', title: '最後登陸IP', type: 'string')]
    public ?string $loginIp;

    #[Property(property: 'login_time', title: '最後登陸時間', type: 'string')]
    public mixed $loginTime;

    #[Property(property: 'backend_setting', title: '後台設置數據', type: 'array')]
    public ?array $backendSetting;

    #[Property(property: 'created_by', title: '創建者', type: 'int')]
    public ?int $createdBy;

    #[Property(property: 'updated_by', title: '更新者', type: 'int')]
    public ?int $updatedBy;

    #[Property(property: 'created_at', title: '創建時間', type: 'string')]
    public mixed $createdAt;

    #[Property(property: 'updated_at', title: '更新時間', type: 'string')]
    public mixed $updatedAt;

    #[Property(property: 'deleted_at', title: '刪除時間', type: 'string')]
    public mixed $deletedAt;

    #[Property(property: 'remark', title: '備註', type: 'string')]
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
        $this->backendSetting = $model->backend_setting;
        $this->createdBy = $model->created_by;
        $this->updatedBy = $model->updated_by;
        $this->createdAt = $model->created_at;
        $this->updatedAt = $model->updated_at;
        $this->deletedAt = $model->deleted_at;
        $this->remark = $model->remark;
    }

    public function jsonSerialize(): mixed
    {
        return ['id' => $this->id, 'username' => $this->username, 'user_type' => $this->userType, 'nickname' => $this->nickname, 'phone' => $this->phone, 'email' => $this->email, 'avatar' => $this->avatar, 'signed' => $this->signed, 'status' => $this->status, 'login_ip' => $this->loginIp, 'login_time' => $this->loginTime, 'backend_setting' => $this->backendSetting, 'created_by' => $this->createdBy, 'updated_by' => $this->updatedBy, 'created_at' => $this->createdAt, 'updated_at' => $this->updatedAt, 'deleted_at' => $this->deletedAt, 'remark' => $this->remark];
    }
}
```


```json [OpenAPI]
"responses": {
      "200": {
        "content": {
          "application/json": {
            "schema": {
              "properties": {
                "total": {
                  "description": "總數量",
                  "type": "integer",
                  "rules": null,
                  "attribute": null
                },
                "list": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/UserSchema"
                  },
                  "rules": null,
                  "attribute": null
                }
              },
              "type": "object"
            }
          }
        }
      }
    }
```

```json [Ref:UserSchema]
"UserSchema": {
        "properties": {
          "id": {
            "title": "用户ID，主鍵",
            "type": "integer",
            "rules": null,
            "attribute": null
          },
          "username": {
            "title": "用户名",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "user_type": {
            "title": "用户類型：(100系統用户)",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "nickname": {
            "title": "用户暱稱",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "phone": {
            "title": "手機",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "email": {
            "title": "用户郵箱",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "avatar": {
            "title": "用户頭像",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "signed": {
            "title": "個人簽名",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "status": {
            "title": "狀態 (1正常 2停用)",
            "type": "integer",
            "rules": null,
            "attribute": null
          },
          "login_ip": {
            "title": "最後登陸IP",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "login_time": {
            "title": "最後登陸時間",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "backend_setting": {
            "title": "後台設置數據",
            "type": "array",
            "rules": null,
            "attribute": null
          },
          "created_by": {
            "title": "創建者",
            "type": "integer",
            "rules": null,
            "attribute": null
          },
          "updated_by": {
            "title": "更新者",
            "type": "integer",
            "rules": null,
            "attribute": null
          },
          "created_at": {
            "title": "創建時間",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "updated_at": {
            "title": "更新時間",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "deleted_at": {
            "title": "刪除時間",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "remark": {
            "title": "備註",
            "type": "string",
            "rules": null,
            "attribute": null
          }
        },
        "type": "object"
      }
```
:::

### `FormRequest`

繼承 `OpenApi\Attributes\Schema`,本意是將傳入的 schema 進行二次屬性解析

#### 構造函數原型

```php
    public function __construct(
        ?string $schema = null,
        ?string $title = null,
        ?string $description = null,
        ?array $required = null,
        ?array $properties = null,
        array $only = []
    ) {
```

#### 參數

- `?string $schema = null`：需要二次解析的 schema 類名
- `?string $title = null`：可選參數，用於設置表單請求的標題。
- `?string $description = null`：可選參數，提供對錶單請求的描述信息。
- `?array $required = null`：可選參數，一個數組，用於指定表單請求中必填的字段。
- `?array $properties = null`：可選參數，一個數組，用於設置表單請求的其他屬性。
- `array $only = []`：一個數組，用於特定的篩選條件，在代碼中用於對`properties`進行篩選操作。

#### 示例

基於自帶的用户管理功能

::: code-group


```php [Controller]
    #[RequestBody(content: new JsonContent(ref: UserRequest::class, title: '修改個人信息'))]
    public function updateInfo(UserRequest $request): Result
    {
        return $this->success();
    }
```

```php [UserRequest]
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

namespace App\Http\Admin\Request\Permission;

use App\Schema\UserSchema;
use Hyperf\Validation\Request\FormRequest;
use Mine\Swagger\Attributes\FormRequest as FormRequestAnnotation;

#[FormRequestAnnotation(
    schema: UserSchema::class,
    title: '創建用户',
    required: [
        'username',
        'user_type',
        'nickname',
        'phone',
        'email',
        'avatar',
        'signed',
        'status',
        'backend_setting',
        'remark',
    ],
    only: [
        'username',
        'user_type',
        'nickname',
        'phone',
        'email',
        'avatar',
        'signed',
        'status',
        'backend_setting',
        'remark',
    ]
)]
class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => 'required|string|max:20',
            'user_type' => 'required|integer',
            'nickname' => ['required', 'string', 'max:60', 'regex:/^[^\s]+$/'],
            'phone' => 'sometimes|string|max:12',
            'email' => 'sometimes|string|max:60',
            'avatar' => 'sometimes|string|max:255',
            'signed' => 'sometimes|string|max:255',
            'status' => 'sometimes|integer',
            'backend_setting' => 'sometimes|array|max:255',
            'remark' => 'sometimes|string|max:255',
        ];
    }

    public function attributes(): array
    {
        return [
            'username' => trans('user.username'),
            'user_type' => trans('user.user_type'),
            'nickname' => trans('user.nickname'),
            'phone' => trans('user.phone'),
            'email' => trans('user.email'),
            'avatar' => trans('user.avatar'),
            'signed' => trans('user.signed'),
            'status' => trans('user.status'),
            'backend_setting' => trans('user.backend_setting'),
            'created_by' => trans('user.created_by'),
            'remark' => trans('user.remark'),
        ];
    }
}

```

```json [OpenAPI]
"requestBody": {
  "content": {
    "application/json": {
      "schema": {
        "$ref": "#/components/schemas/UserRequest"
      }
    }
  }
},
```

```json [Ref:UserRequest]

"UserRequest": {
        "title": "創建用户",
        "required": [
          "username",
          "user_type",
          "nickname",
          "phone",
          "email",
          "avatar",
          "signed",
          "status",
          "backend_setting",
          "remark"
        ],
        "properties": {
          "username": {
            "title": "用户名",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "user_type": {
            "title": "用户類型：(100系統用户)",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "nickname": {
            "title": "用户暱稱",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "phone": {
            "title": "手機",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "email": {
            "title": "用户郵箱",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "avatar": {
            "title": "用户頭像",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "signed": {
            "title": "個人簽名",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "status": {
            "title": "狀態 (1正常 2停用)",
            "type": "integer",
            "rules": null,
            "attribute": null
          },
          "backend_setting": {
            "title": "後台設置數據",
            "type": "array",
            "rules": null,
            "attribute": null
          },
          "remark": {
            "title": "備註",
            "type": "string",
            "rules": null,
            "attribute": null
          }
        },
        "type": "object"
      },
```


:::