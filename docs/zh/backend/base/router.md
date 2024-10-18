# 路由与API文档

自 `MineAdmin 3.0` 我们内置为所有接口接入了 [Swagger](https://swagger.io) 文档,
在本地开发时，访问 `localhost:9502/swagger` 即可访问现有的 API文档

::: tip

[mineadmin/swagger](https://github.com/mineadmin/Swagger) 基于 [hyperf/swagger](https://github.com/hyperf/swagger)封装了一套适用于 MineAdmin 手脚架的文档注解

而 `hyperf/swagger` 则基于 [zircote/swagger-php](https://github.com/zircote/swagger-php) 封装了 swagger 注解收集并生成 API 文档的逻辑

`zircote/swagger-php` 则是对 [OpenAPI 规范](https://github.com/OAI/OpenAPI-Specification)的基层封装

本文将讲解如何在 MineAdmin 中使用 Swagger 开发您的 API 应用程序

:::

## MineAdmin 注解

以下所有没有做完整命名空间全部以 `Mine\Swagger\Attributes\` 前缀拼接为完整命名空间

### `ResultResponse`

用作生成接口响应相关信息

#### 构造函数原型

```php
ResultResponse::__construct(object|string $instance,?string $title = null,?array $examples = null,?string $description = null, mixed $example = Generator::UNDEFINED,?array $headers = null,?int $response = 200)
```

#### 参数说明

- $instance：类实例或者类名、返回的类如果有其他注解将自动解析
- $title：标题
- $examples：声明多个示例,
- $description：返回说明
- $example：声明单个示例。
- $headers：响应头。
- $response：返回的 http code

#### 使用示例

本文示例基于 登录接口。涉及的完整命名空间将不再讲述，可以在你下载的应用程序中自行寻找

::: code-group

```php [Controller]

#[ResultResponse(
    instance: new Result(data: new PassportLoginVo()),
    title: '登录成功',
    description: '登录成功返回对象',
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
        #[OA\Property(ref: 'ResultCode', title: '响应码')]
        public ResultCode $code = ResultCode::SUCCESS,
        #[OA\Property(title: '响应消息', type: 'string')]
        public ?string $message = null,
        #[OA\Property(title: '响应数据', type: 'array')]
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
            "description": "登录成功返回对象",
            "content": {
              "application/json": {
                "schema": {
                  "title": "登录成功",
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
    description: '登录成功返回',
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
        description: '过期时间,单位秒',
        type: 'integer',
        example: 300
    )]
    public int $expire_at;
}
```

:::

### `PageResponse`

作用返回分页说明

#### 构造函数原型

与 `ResultResponse` 原型一致

#### 参数说明

与 `ResultResponse` 原型一致

#### 使用示例

来自默认自带的用户列表接口

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
    #[Property(property: 'id', title: '用户ID，主键', type: 'int')]
    public ?int $id;

    #[Property(property: 'username', title: '用户名', type: 'string')]
    public ?string $username;

    #[Property(property: 'user_type', title: '用户类型：(100系统用户)', type: 'string')]
    public ?Type $userType;

    #[Property(property: 'nickname', title: '用户昵称', type: 'string')]
    public ?string $nickname;

    #[Property(property: 'phone', title: '手机', type: 'string')]
    public ?string $phone;

    #[Property(property: 'email', title: '用户邮箱', type: 'string')]
    public ?string $email;

    #[Property(property: 'avatar', title: '用户头像', type: 'string')]
    public ?string $avatar;

    #[Property(property: 'signed', title: '个人签名', type: 'string')]
    public ?string $signed;

    #[Property(property: 'status', title: '状态 (1正常 2停用)', type: 'int')]
    public ?Status $status;

    #[Property(property: 'login_ip', title: '最后登陆IP', type: 'string')]
    public ?string $loginIp;

    #[Property(property: 'login_time', title: '最后登陆时间', type: 'string')]
    public mixed $loginTime;

    #[Property(property: 'backend_setting', title: '后台设置数据', type: 'array')]
    public ?array $backendSetting;

    #[Property(property: 'created_by', title: '创建者', type: 'int')]
    public ?int $createdBy;

    #[Property(property: 'updated_by', title: '更新者', type: 'int')]
    public ?int $updatedBy;

    #[Property(property: 'created_at', title: '创建时间', type: 'string')]
    public mixed $createdAt;

    #[Property(property: 'updated_at', title: '更新时间', type: 'string')]
    public mixed $updatedAt;

    #[Property(property: 'deleted_at', title: '删除时间', type: 'string')]
    public mixed $deletedAt;

    #[Property(property: 'remark', title: '备注', type: 'string')]
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
                  "description": "总数量",
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
            "title": "用户ID，主键",
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
            "title": "用户类型：(100系统用户)",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "nickname": {
            "title": "用户昵称",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "phone": {
            "title": "手机",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "email": {
            "title": "用户邮箱",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "avatar": {
            "title": "用户头像",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "signed": {
            "title": "个人签名",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "status": {
            "title": "状态 (1正常 2停用)",
            "type": "integer",
            "rules": null,
            "attribute": null
          },
          "login_ip": {
            "title": "最后登陆IP",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "login_time": {
            "title": "最后登陆时间",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "backend_setting": {
            "title": "后台设置数据",
            "type": "array",
            "rules": null,
            "attribute": null
          },
          "created_by": {
            "title": "创建者",
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
            "title": "创建时间",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "updated_at": {
            "title": "更新时间",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "deleted_at": {
            "title": "删除时间",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "remark": {
            "title": "备注",
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

继承 `OpenApi\Attributes\Schema`,本意是将传入的 schema 进行二次属性解析

#### 构造函数原型

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

#### 参数

- `?string $schema = null`：需要二次解析的 schema 类名
- `?string $title = null`：可选参数，用于设置表单请求的标题。
- `?string $description = null`：可选参数，提供对表单请求的描述信息。
- `?array $required = null`：可选参数，一个数组，用于指定表单请求中必填的字段。
- `?array $properties = null`：可选参数，一个数组，用于设置表单请求的其他属性。
- `array $only = []`：一个数组，用于特定的筛选条件，在代码中用于对`properties`进行筛选操作。

#### 示例

基于自带的用户管理功能

::: code-group


```php [Controller]
    #[RequestBody(content: new JsonContent(ref: UserRequest::class, title: '修改个人信息'))]
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
    title: '创建用户',
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
        "title": "创建用户",
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
            "title": "用户类型：(100系统用户)",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "nickname": {
            "title": "用户昵称",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "phone": {
            "title": "手机",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "email": {
            "title": "用户邮箱",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "avatar": {
            "title": "用户头像",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "signed": {
            "title": "个人签名",
            "type": "string",
            "rules": null,
            "attribute": null
          },
          "status": {
            "title": "状态 (1正常 2停用)",
            "type": "integer",
            "rules": null,
            "attribute": null
          },
          "backend_setting": {
            "title": "后台设置数据",
            "type": "array",
            "rules": null,
            "attribute": null
          },
          "remark": {
            "title": "备注",
            "type": "string",
            "rules": null,
            "attribute": null
          }
        },
        "type": "object"
      },
```


:::