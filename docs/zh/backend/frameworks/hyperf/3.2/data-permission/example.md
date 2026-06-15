# 使用示例

在代码中使用数据权限，目前支持多种方式进行动态开启与关闭。以下举几种常见的开发案例

## 对整个模型进行数据权限控制

以默认的 `User` 模型为例，假设我们需要对 `User` 模型进行数据权限控制。

可以在 `User` 模型中 use `DataScopes` trait 来启用数据权限作用域。

```php
// /mineadmin/app/Library/DataPermission/Scope/DataScope.php
use App\Library\DataPermission\Scope\DataScopes;

class User extends Model {
    // 使用数据权限作用域
    use DataScopes;

    // 其他代码...
}
```

这样会使所有对 `User` 模型的查询都自动应用数据权限控制。

## 对某个代码块进行数据权限控制

得益于 Hyperf AOP 特性，我们可以在类或者类方法上使用 [DataScope](https://github.com/mineadmin/MineAdmin/blob/master-department/app/Library/DataPermission/Attribute/DataScope.php) 注解来对指定的代码块开启数据权限控制。 

以自带的用户模块的[分页列表](https://github.com/mineadmin/MineAdmin/blob/master-department/app/Service/Permission/UserService.php#L93~L100)为例

```php
// /mineadmin/app/Service/Permission/UserService.php:94-98
class UserService
{
    #[DataScope(
        scopeType: ScopeType::CREATED_BY,
        onlyTables: ['user'],
        createdByColumn: 'id'
    )]
    public function page(array $params, int $page = 1, int $pageSize = 10): array
    {
        return parent::page($params, $page, $pageSize);
    }
}
```

这样在调用 `page` 方法时，数据权限会自动应用到查询中。

## 对指定的 ORM Query 进行权限控制

在某些特定场景中，需要更加细化的进行权限隔离。此时可以通过 `Factory::make()->build()` 方法来对指定的 Query 进行限制

```php
// 手动使用 Factory 进行权限过滤
use App\Library\DataPermission\Factory;
use App\Model\Permission\User;

class DemoService {

    public function test(User $user): void {
        $userQuery = User::query();
        
        // 对 UserQuery 单独进行数据隔离拼接
        Factory::make()->build($userQuery->getQuery(), $user);
        
        $result = $userQuery->get();
    }
}
```

## 使用 Context 配置数据权限

### 基本配置方式

```php
// /mineadmin/app/Library/DataPermission/Context.php
use App\Library\DataPermission\Context;
use App\Library\DataPermission\ScopeType;

// 设置部门字段名称
Context::setDeptColumn('department_id');
// 设置创建人字段名称
Context::setCreatedByColumn('creator');
// 设置隔离方式
Context::setScopeType(ScopeType::DEPT_CREATED_BY);
// 只对指定表进行数据隔离
Context::setOnlyTables(['user', 'orders']);

$query = User::query();
Factory::make()->build($query->getQuery(), $user);
```

### DataScope 注解完整配置

```php
// /mineadmin/app/Library/DataPermission/Attribute/DataScope.php
#[DataScope(
    // 部门字段名称（默认：dept_id）
    deptColumn: 'department_id',
    
    // 创建人字段名称（默认：created_by）
    createdByColumn: 'creator_id',
    
    // 隔离方式（默认：ScopeType::DEPT_CREATED_BY）
    scopeType: ScopeType::DEPT_SELF,
    
    // 只对指定表生效（默认：null，对所有表生效）
    onlyTables: ['orders', 'order_items']
)]
public function getFilteredData(): Collection
{
    return Order::with('items')->get();
}
```

## 策略类型使用示例

### DEPT_SELF - 本部门权限

```php
// 来源：基于 /Users/zhuzhu/project/mineadmin/app/Model/Enums/DataPermission/PolicyType.php
#[DataScope(scopeType: ScopeType::DEPT)]
public function getDepartmentUsers(): Collection
{
    // 自动过滤为当前用户所在部门的用户
    return User::query()->get();
}
```

### DEPT_TREE - 部门树权限  

```php
#[DataScope(scopeType: ScopeType::DEPT)]
public function getDepartmentTreeUsers(): Collection
{
    // 自动包含当前部门及所有子部门的用户
    return User::query()->get();
}
```

### CREATED_BY - 创建人权限

```php
#[DataScope(scopeType: ScopeType::CREATED_BY)]
public function getMyCreatedData(): Collection
{
    // 只返回当前用户创建的数据
    return Document::query()->get();
}
```

### 组合权限使用

```php
// AND 条件：既要是本部门，又要是自己创建的
#[DataScope(scopeType: ScopeType::DEPT_CREATED_BY)]
public function getMyDeptData(): Collection
{
    return Document::query()->get();
}

// OR 条件：本部门的或者自己创建的
#[DataScope(scopeType: ScopeType::DEPT_OR_CREATED_BY)]
public function getDeptOrMyData(): Collection
{
    return Document::query()->get();
}
```

## 自定义函数策略

### 创建自定义函数

```php
// /mineadmin/config/autoload/department/custom.php
return [
    'my_custom_filter' => function (Builder $builder, ScopeType $scopeType, Policy $policy, User $user) {
        // 自定义业务逻辑
        $createdByColumn = Context::getCreatedByColumn();
        $deptColumn = Context::getDeptColumn();
        
        switch ($scopeType) {
            case ScopeType::CREATED_BY:
                $builder->where($createdByColumn, $user->id);
                break;
            case ScopeType::DEPT:
                $builder->whereIn($deptColumn, $user->department()->get()->pluck('id'));
                break;
            case ScopeType::DEPT_CREATED_BY:
                $builder->whereIn($deptColumn, $user->department()->get()->pluck('id'));
                $builder->where($createdByColumn, $user->id);
                break;
            case ScopeType::DEPT_OR_CREATED_BY:
                $builder->whereIn($deptColumn, $user->department()->get()->pluck('id'));
                $builder->orWhere($createdByColumn, $user->id);
                break;
        }
    }
];
```

### 使用自定义函数

要使用自定义函数，需要设置策略类型为 `CUSTOM_FUNC` 并在策略的 `value` 字段中指定函数名：

```php
// 在数据库中创建策略记录
Policy::create([
    'user_id' => $userId,
    'policy_type' => PolicyType::CustomFunc,
    'value' => ['my_custom_filter'],  // 自定义函数名
    'is_default' => true
]);
```

## 数据权限结合业务场景

### 订单管理系统

```php
class OrderService 
{
    // 普通员工只能看到自己创建的订单
    #[DataScope(
        scopeType: ScopeType::CREATED_BY,
        onlyTables: ['orders']
    )]
    public function getMyOrders(): Collection
    {
        return Order::query()->get();
    }
    
    // 部门经理可以看到整个部门的订单
    #[DataScope(
        scopeType: ScopeType::DEPT,
        onlyTables: ['orders']
    )]
    public function getDepartmentOrders(): Collection
    {
        return Order::query()->get();
    }
    
    // 区域经理可以看到部门树的所有订单
    #[DataScope(
        scopeType: ScopeType::DEPT,
        onlyTables: ['orders']
    )]
    public function getRegionOrders(): Collection
    {
        return Order::query()->get();
    }
}
```

### 文档管理系统

```php
class DocumentService
{
    // 文档权限：部门共享 + 个人私有
    #[DataScope(
        scopeType: ScopeType::DEPT_OR_CREATED_BY,
        deptColumn: 'department_id',
        createdByColumn: 'author_id'
    )]
    public function getAccessibleDocuments(): Collection
    {
        return Document::query()
                      ->where('status', 'published')
                      ->get();
    }
}
```

## 多表关联查询

当涉及多表关联时，可以指定 `onlyTables` 参数来控制哪些表应用数据权限：

```php
#[DataScope(
    scopeType: ScopeType::DEPT_SELF,
    onlyTables: ['orders']  // 只对 orders 表应用权限过滤
)]
public function getOrdersWithCustomers(): Collection
{
    return Order::query()
                ->join('customers', 'orders.customer_id', '=', 'customers.id')
                ->select('orders.*', 'customers.name as customer_name')
                ->get();
}
```

## 注意事项

::: warning 协程上下文

需要注意，不管哪种使用方式。如果新开一个协程，都要重新设置一遍才能起效

```php
// ❌ 错误：协程中权限丢失
Co::create(function () {
    // 权限配置已丢失，可能返回错误数据
    $data = User::query()->get();
});

// ✅ 正确：重新设置协程权限
Co::create(function () use ($user) {
    // 需要重新设置上下文
    Context::setDeptColumn('dept_id');
    Context::setCreatedByColumn('created_by');
    Context::setScopeType(ScopeType::DEPT_SELF);
    
    $data = User::query()->get();
});
```

:::

## 完整 API 参考

### DataScope 注解参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `deptColumn` | string | `'dept_id'` | 部门字段名称 |
| `createdByColumn` | string | `'created_by'` | 创建人字段名称 |
| `scopeType` | ScopeType | `ScopeType::DEPT_CREATED_BY` | 权限范围类型 |
| `onlyTables` | array\|null | `null` | 只对指定表生效，null则对所有表生效 |

### Context 类方法

| 方法 | 说明 |
|------|------|
| `Context::setDeptColumn(string)` | 设置部门字段名 |
| `Context::setCreatedByColumn(string)` | 设置创建人字段名 |
| `Context::setScopeType(ScopeType)` | 设置权限范围类型 |
| `Context::setOnlyTables(array)` | 设置只对指定表生效 |
| `Context::getDeptColumn()` | 获取部门字段名 |
| `Context::getCreatedByColumn()` | 获取创建人字段名 |
| `Context::getScopeType()` | 获取权限范围类型 |
| `Context::getOnlyTables()` | 获取指定表列表 |

### Factory 类方法

| 方法 | 说明 |
|------|------|
| `Factory::make()` | 创建工厂实例 |
| `Factory::build(Builder, User)` | 对查询构建器应用权限过滤 |

### ScopeType 枚举值

| 值 | 说明 |
|----|------|
| `ScopeType::DEPT` | 只根据部门过滤 |
| `ScopeType::CREATED_BY` | 只根据创建人过滤 |
| `ScopeType::DEPT_CREATED_BY` | 根据部门 AND 创建人过滤 |
| `ScopeType::DEPT_OR_CREATED_BY` | 根据部门 OR 创建人过滤 |

### PolicyType 枚举值

| 值 | 说明 |
|----|------|
| `PolicyType::DeptSelf` | 本部门 |
| `PolicyType::DeptTree` | 本部门及子部门 |
| `PolicyType::All` | 全部数据 |
| `PolicyType::Self` | 仅本人 |
| `PolicyType::CustomDept` | 自定义部门 |
| `PolicyType::CustomFunc` | 自定义函数 |