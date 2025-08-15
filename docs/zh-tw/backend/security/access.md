# 使用者授權（RBAC）

## 系統概述

MineAdmin採用基於角色的訪問控制（RBAC）系統，結合JWT認證、多層許可權驗證和資料級許可權控制，為企業級應用提供全面的安全保障。

### 核心架構

```plantuml
@startuml
!theme plain

package "RBAC核心架構" {
    [使用者 User] --> [角色 Role]
    [角色 Role] --> [選單/許可權 Menu]
}

package "許可權驗證流程" {
    [JWT Token] --> [使用者認證]
    [使用者認證] --> [角色許可權檢查]
    [角色許可權檢查] --> [資料許可權過濾]
    [資料許可權過濾] --> [操作審計]
}

package "中介軟體層" {
    component AccessTokenMiddleware
    component PermissionMiddleware
    component OperationMiddleware
    
    AccessTokenMiddleware --> PermissionMiddleware
    PermissionMiddleware --> OperationMiddleware
}

[JWT Token] --> AccessTokenMiddleware

@enduml
```

## 認證系統

### JWT認證機制

使用雙Token策略保障安全性：

```php
// 登入認證流程
public function login(string $username, string $password): array
{
    $user = $this->repository->findByUnameType($username, Type::SYSTEM);
    
    // 密碼驗證
    if (!$user->verifyPassword($password)) {
        throw new BusinessException(ResultCode::UNPROCESSABLE_ENTITY, trans('auth.password_error'));
    }
    
    // 使用者狀態檢查
    if ($user->status->isDisable()) {
        throw new BusinessException(ResultCode::DISABLED);
    }
    
    // 生成Token
    $jwt = $this->getJwt();
    return [
        'access_token' => $jwt->builderAccessToken((string) $user->id)->toString(),
        'refresh_token' => $jwt->builderRefreshToken((string) $user->id)->toString(),
        'expire_at' => (int) $jwt->getConfig('ttl', 0),
    ];
}
```

### 密碼安全

系統使用PHP內建的安全雜湊函式：

```php
// 密碼設定
public function setPasswordAttribute($value): void
{
    $this->attributes['password'] = password_hash((string) $value, \PASSWORD_DEFAULT);
}

// 密碼驗證
public function verifyPassword(string $password): bool
{
    return password_verify($password, $this->password);
}
```

## 許可權系統

### 三層許可權模型

```plantuml
@startuml
!theme plain

entity "USER" as user {
    * id : int
    --
    username : string
    password : string
    status : enum
}

entity "ROLE" as role {
    * id : int
    --
    name : string
    code : string
    sort : int
}

entity "MENU" as menu {
    * id : int
    --
    name : string
    code : string
    type : string
}

entity "USER_BELONGS_ROLE" as user_role {
    * user_id : int
    * role_id : int
}

entity "ROLE_BELONGS_MENU" as role_menu {
    * role_id : int
    * menu_id : int
}

user ||--o{ user_role
role ||--o{ user_role
role ||--o{ role_menu
menu ||--o{ role_menu

@enduml
```

### 許可權檢查實現

```php
// User模型中的許可權檢查方法
public function hasPermission(string $permission): bool
{
    return $this->roles()->whereRelation('menus', 'name', $permission)->exists();
}

public function getPermissions(): Collection
{
    return $this->roles()->with('menus')->orderBy('sort')->get()->pluck('menus')->flatten();
}

public function isSuperAdmin(): bool
{
    return $this->roles()->where('code', 'SuperAdmin')->exists();
}
```

### 許可權註解使用

在控制器方法上使用`@Permission`註解進行許可權控制：

```php
use Mine\Annotation\Permission;

class UserController
{
    #[Permission(code: 'permission:user:index')]
    public function pageList(): Result
    {
        // 使用者列表查詢
    }
    
    #[Permission(code: ['permission:user:save', 'permission:user:update'], operation: Permission::OPERATION_OR)]
    public function save(): Result
    {
        // 使用者儲存或更新
    }
    
    #[Permission(code: ['permission:user:delete', 'permission:role:admin'], operation: Permission::OPERATION_AND)]
    public function delete(): Result
    {
        // 需要同時具備刪除許可權和管理員角色
    }
}
```

## 中介軟體體系

### 三層中介軟體保護

```php
#[Middleware(middleware: AccessTokenMiddleware::class, priority: 100)]
#[Middleware(middleware: PermissionMiddleware::class, priority: 99)]
#[Middleware(middleware: OperationMiddleware::class, priority: 98)]
class AdminController
{
    // 控制器邏輯
}
```

#### 1. AccessTokenMiddleware

驗證訪問令牌的有效性：

```php
public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
{
    $token = $this->getTokenFromRequest($request);
    
    try {
        $jwt = $this->getJwt();
        $token = $jwt->parseToken($token);
        
        // 檢查黑名單
        if ($jwt->isBlacklisted($token)) {
            throw new TokenValidException('Token已被列入黑名單');
        }
        
        // 設定當前使用者
        $this->setCurrentUser($token);
        
    } catch (\Throwable $e) {
        throw new BusinessException(ResultCode::UNAUTHORIZED, $e->getMessage());
    }
    
    return $handler->handle($request);
}
```

#### 2. PermissionMiddleware

執行許可權驗證邏輯：

```php
private function handlePermission(Permission $permission): void
{
    $operation = $permission->getOperation();
    $codes = $permission->getCode();
    
    foreach ($codes as $code) {
        $hasPermission = $this->currentUser->user()->hasPermission($code);
        
        if ($operation === Permission::OPERATION_AND && !$hasPermission) {
            throw new BusinessException(code: ResultCode::FORBIDDEN);
        }
        
        if ($operation === Permission::OPERATION_OR && $hasPermission) {
            return;
        }
    }
    
    if ($operation === Permission::OPERATION_OR) {
        throw new BusinessException(code: ResultCode::FORBIDDEN);
    }
}
```

#### 3. OperationMiddleware

記錄操作日誌：

```php
public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
{
    $response = $handler->handle($request);
    
    // 記錄操作日誌
    $this->dispatcher->dispatch(new RequestOperationEvent(
        $this->user->id(),
        $operator->summary,
        $request->getUri()->getPath(),
        $request->getClientIps(),
        $request->getMethod(),
    ));
    
    return $response;
}
```

## API參考

### CurrentUser服務

```php
use Mine\Support\CurrentUser;

class ExampleController
{
    public function __construct(private readonly CurrentUser $currentUser) {}
    
    public function getUserInfo(): array
    {
        $user = $this->currentUser->user();
        
        return [
            'id' => $user->id,
            'username' => $user->username,
            'roles' => $user->roles,
            'permissions' => $user->getPermissions(),
            'is_super_admin' => $user->isSuperAdmin(),
        ];
    }
    
    public function checkPermission(string $permission): bool
    {
        return $this->currentUser->user()->hasPermission($permission);
    }
}
```

### 許可權驗證方法

```php
// AND操作：需要同時具備所有許可權
#[Permission(code: ['user:read', 'user:write'], operation: Permission::OPERATION_AND)]

// OR操作：具備任一許可權即可
#[Permission(code: ['user:read', 'admin:all'], operation: Permission::OPERATION_OR)]

// 單一許可權檢查
#[Permission(code: 'user:delete')]

// 程式化許可權檢查
if ($this->currentUser->user()->hasPermission('user:create')) {
    // 允許建立使用者
}
```


## 故障排除

### 常見問題

#### 許可權檢查失敗

**問題**: 使用者無法訪問有許可權的資源

**除錯步驟**:
```php
// 1. 檢查使用者角色
$user = User::find($userId);
dd($user->roles);

// 2. 檢查角色許可權
foreach ($user->roles as $role) {
    dd($role->menus);
}

// 3. 檢查許可權碼
$hasPermission = $user->hasPermission('permission:user:index');
dd($hasPermission);

// 4. 檢查SuperAdmin狀態
dd($user->isSuperAdmin());
```