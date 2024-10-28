# 用户授权（Rbac)

::: tip

授权由 [mineadmin/casbin](https://github.com/mineadmin/casbin) 接入 [casbin/casbin](https://github.com/php-casbin/php-casbin) 

本文不再讲述基础性功能，需要自行查看 [casbin](https://casbin.org/) 文档

:::

默认授权策略模型由 `config/autoload/casbin/rbac-model.conf` 定义.
而 Admin 的授权检测则由控制器方法的 `Permission` 注解 和 `PermissionMiddleware` 中间件组合而成

::: code-group

```ini [rbac-model.conf]
[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act || r.sub == "SuperAdmin"
```

```php{3,19} [MenuController]
#[HyperfServer(name: 'http')]
#[Middleware(middleware: AccessTokenMiddleware::class, priority: 100)]
#[Middleware(middleware: PermissionMiddleware::class, priority: 99)]
#[Middleware(middleware: OperationMiddleware::class, priority: 98)]
final class MenuController extends AbstractController
{
    public function __construct(
        private readonly MenuService $service,
        private readonly CurrentUser $user
    ) {}

    #[Get(
        path: '/admin/menu/list',
        operationId: 'menuList',
        summary: '菜单列表',
        security: [['Bearer' => [], 'ApiKey' => []]],
        tags: ['菜单管理']
    )]
    #[Permission(code: 'permission:menu:index')]
    #[ResultResponse(instance: new Result())]
    public function pageList(RequestInterface $request): Result
    {
        return $this->success(data: $this->service->getRepository()->list([
            'children' => true,
            'parent_id' => 0,
        ]));
    }

```

:::

## 必看-注意事项

由于 casbin 是一张表存储了所有授权策略。orm 在执行 xx()->sync 操作时会导致 user.username = role.code = menu.name 这种数据一块删除
所以理应禁止 用户名、角色 code、菜单code 存在重复情况。在默认的编辑新增已经加上了唯一性检测。需要在业务开发时注意此项

## 实体关系 图文表达


rules 表是授权策略的缓存模型

user 与 role 多对多关联、根据  rules 中间表 `user.username=rules.v0 and role.code = rules.v1 and rules.ptype = g` 关联形成

role 与 menu 多对多关联。根据 rules 中间表 `role.code = rules.v0 and menu.name = rules.v1 and rules.ptype = p`
关联形成

```plantuml

' Entities
entity "rules" as rules {
  * id : bigint
  --
  ptype : string
  v0 : string
  v1 : string
  v2 : string
  v3 : string
  v4 : string
  v5 : string
  created_at : datetime
  updated_at : datetime
}

entity "user" as user {
  * id : bigint
  --
  username : string(20)
  password : string(100)
  user_type : string(3)
  nickname : string(30)
  phone : string(11)
  email : string(50)
  avatar : string(255)
  signed : string(255)
  status : tinyint
  login_ip : string
  login_time : datetime
  backend_setting : json
  created_by : bigint
  updated_at : datetime
  remark : string(255)
}

entity "role" as role {
  * id : bigint
  --
  name : string(30)
  code : string(100)
  status : tinyint
  sort : smallint
  created_by : bigint
  updated_at : datetime
  remark : string
}

entity "menu" as menu {
  * id : bigint
  --
  parent_id : bigint
  name : string(50)
  meta : json
  path : string(60)
  component : string(150)
  redirect : string(100)
  status : tinyint
  sort : smallint
  created_by : bigint
  updated_at : datetime
  remark : string(60)
}

' Relationships
user ||--o{ role : "many-to-many"
role ||--o{ menu : "many-to-many"
user }|-- rules : "many-to-many"
role }|-- rules : "many-to-many"

```

## 运行原理 图文表达

在新版中砍掉了 `Auth` 注解。全部自带的接口统一由中间件进行验证

- 用户识别中间件 `App\Http\Common\Middleware\AccessTokenMiddleware`
- 权限检测中间件 `App\Http\Admin\Middleware\PermissionMiddleware`
- 记录请求日志中间件 `App\Http\Common\Middleware\OperationMiddleware`

在进入 controller 之前会按顺序执行上方的中间件`用户识别中间件必须在第一位！！`,而权限检测中间件则会读取控制器中的
`Permission` 注解。获取 code 和运算符(默认为 and)。在权限检测中间件中的执行流程首先判断当前用户是否是超管。如果是则固定性放行。
如果不是则获取当前用户所有的权限code。判断是否具有权限。如果没有则抛出 `ResultCode::FORBIDDEN` 403 异常。如果存在则进入下一个中间件

### 流程图

```plantuml
start
:请求进入;
if (当前用户是超管？) then (是)
    :固定放行;
else (否)
    :获取当前用户所有权限 code;
    if (用户具有权限？) then (是)
        :进入下一个中间件;
    else (否)
        :抛出 403 异常;
        end
    endif
endif
:进入 controller;
stop
```

### 时序图

```plantuml
participant "客户端" as Client
participant "用户识别中间件" as AccessTokenMiddleware
participant "权限检测中间件" as PermissionMiddleware
participant "记录请求日志中间件" as OperationMiddleware
participant "Controller" as Controller

Client -> AccessTokenMiddleware : 请求
AccessTokenMiddleware -> PermissionMiddleware : 传递请求
PermissionMiddleware -> PermissionMiddleware : 判断当前用户是否是超管
alt 是超管
    PermissionMiddleware -> OperationMiddleware : 固定放行并传递请求
else 不是超管
    PermissionMiddleware -> PermissionMiddleware : 获取当前用户所有权限 code
    PermissionMiddleware -> PermissionMiddleware : 判断用户是否具有权限
    alt 有权限
        PermissionMiddleware -> OperationMiddleware : 传递请求
    else 无权限
        PermissionMiddleware -> Client : 抛出 403 异常
    end
end
OperationMiddleware -> Controller : 传递请求
Controller -> OperationMiddleware : 处理完成后返回响应
OperationMiddleware -> PermissionMiddleware : 返回响应
PermissionMiddleware -> AccessTokenMiddleware : 返回响应
AccessTokenMiddleware -> Client : 返回响应
```
