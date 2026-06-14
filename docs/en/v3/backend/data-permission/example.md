## Usage Examples

Using data permissions in code currently supports multiple ways to dynamically enable and disable them. Here are several common development cases.

## Applying Data Permission Control to an Entire Model

Taking the default `User` model as an example, suppose we need to apply data permission control to the `User` model.

You can use the `DataScopes` trait in the `User` model to enable the data permission scope.

```php
// /mineadmin/app/Library/DataPermission/Scope/DataScope.php
use App\Library\DataPermission\Scope\DataScopes;

class User extends Model {
    // Use data permission scope
    use DataScopes;

    // Other code...
}
```

This will automatically apply data permission control to all queries on the `User` model.

## Applying Data Permission Control to a Specific Code Block

Thanks to the Hyperf AOP feature, you can use the [DataScope](https://github.com/mineadmin/MineAdmin/blob/master-department/app/Library/DataPermission/Attribute/DataScope.php) annotation on classes or class methods to enable data permission control for specific code blocks.

Taking the built-in user module's [paginated list](https://github.com/mineadmin/MineAdmin/blob/master-department/app/Service/Permission/UserService.php#L93~L100) as an example:

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

This way, when the `page` method is called, data permissions are automatically applied to the query.

## Applying Permission Control to a Specific ORM Query

In certain specific scenarios, more granular permission isolation is needed. In such cases, you can use the `Factory::make()->build()` method to restrict a specific query.

```php
// Manually use Factory for permission filtering
use App\Library\DataPermission\Factory;
use App\Model\Permission\User;

class DemoService {

    public function test(User $user): void {
        $userQuery = User::query();
        
        // Apply data isolation to UserQuery individually
        Factory::make()->build($userQuery->getQuery(), $user);
        
        $result = $userQuery->get();
    }
}
```

## Configuring Data Permissions Using Context

### Basic Configuration

```php
// /mineadmin/app/Library/DataPermission/Context.php
use App\Library\DataPermission\Context;
use App\Library\DataPermission\ScopeType;

// Set the department field name
Context::setDeptColumn('department_id');
// Set the creator field name
Context::setCreatedByColumn('creator');
// Set the isolation mode
Context::setScopeType(ScopeType::DEPT_CREATED_BY);
// Isolate data only for specified tables
Context::setOnlyTables(['user', 'orders']);

$query = User::query();
Factory::make()->build($query->getQuery(), $user);
```

### Complete DataScope Annotation Configuration

```php
// /mineadmin/app/Library/DataPermission/Attribute/DataScope.php
#[DataScope(
    // Department field name (default: dept_id)
    deptColumn: 'department_id',
    
    // Creator field name (default: created_by)
    createdByColumn: 'creator_id',
    
    // Isolation mode (default: ScopeType::DEPT_CREATED_BY)
    scopeType: ScopeType::DEPT_SELF,
    
    // Applies only to specified tables (default: null, applies to all tables)
    onlyTables: ['orders', 'order_items']
)]
public function getFilteredData(): Collection
{
    return Order::with('items')->get();
}
```

## Policy Type Usage Examples

### DEPT_SELF - Current Department Permission

```php
// Source: Based on /Users/zhuzhu/project/mineadmin/app/Model/Enums/DataPermission/PolicyType.php
#[DataScope(scopeType: ScopeType::DEPT)]
public function getDepartmentUsers(): Collection
{
    // Automatically filters to users in the current user's department
    return User::query()->get();
}
```

### DEPT_TREE - Department Tree Permission

```php
#[DataScope(scopeType: ScopeType::DEPT)]
public function getDepartmentTreeUsers(): Collection
{
    // Automatically includes users from the current department and all sub-departments
    return User::query()->get();
}
```

### CREATED_BY - Creator Permission

```php
#[DataScope(scopeType: ScopeType::CREATED_BY)]
public function getMyCreatedData(): Collection
{
    // Returns only data created by the current user
    return Document::query()->get();
}
```

### Combined Permission Usage

```php
// AND condition: Must be in the same department AND created by the user
#[DataScope(scopeType: ScopeType::DEPT_CREATED_BY)]
public function getMyDeptData(): Collection
{
    return Document::query()->get();
}

// OR condition: In the same department OR created by the user
#[DataScope(scopeType: ScopeType::DEPT_OR_CREATED_BY)]
public function getDeptOrMyData(): Collection
{
    return Document::query()->get();
}
```

## Custom Function Policies

### Creating a Custom Function

```php
// /mineadmin/config/autoload/department/custom.php
return [
    'my_custom_filter' => function (Builder $builder, ScopeType $scopeType, Policy $policy, User $user) {
        // Custom business logic
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

### Using a Custom Function

To use a custom function, you need to set the policy type to `CUSTOM_FUNC` and specify the function name in the `value` field of the policy:

```php
// Create a policy record in the database
Policy::create([
    'user_id' => $userId,
    'policy_type' => PolicyType::CustomFunc,
    'value' => ['my_custom_filter'],  // Custom function name
    'is_default' => true
]);
```

## Data Permissions Combined with Business Scenarios

### Order Management System

```php
class OrderService 
{
    // Regular employees can only see their own orders
    #[DataScope(
        scopeType: ScopeType::CREATED_BY,
        onlyTables: ['orders']
    )]
    public function getMyOrders(): Collection
    {
        return Order::query()->get();
    }
    
    // Department managers can see all orders in the department
    #[DataScope(
        scopeType: ScopeType::DEPT,
        onlyTables: ['orders']
    )]
    public function getDepartmentOrders(): Collection
    {
        return Order::query()->get();
    }
    
    // Regional managers can see all orders in the department tree
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

### Document Management System

```php
class DocumentService
{
    // Document permissions: Department shared + Personal private
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

## Multi-Table Join Queries

When involving multi-table joins, you can specify the `onlyTables` parameter to control which tables apply data permissions:

```php
#[DataScope(
    scopeType: ScopeType::DEPT_SELF,
    onlyTables: ['orders']  // Apply permission filtering only to the orders table
)]
public function getOrdersWithCustomers(): Collection
{
    return Order::query()
                ->join('customers', 'orders.customer_id', '=', 'customers.id')
                ->select('orders.*', 'customers.name as customer_name')
                ->get();
}
```

## Important Notes

::: warning Coroutine Context

Note that regardless of which usage method you use, if you start a new coroutine, you need to re-configure the settings for them to take effect.

```php
// ❌ Incorrect: Permissions are lost in the coroutine
Co::create(function () {
    // Permission configuration is lost, may return incorrect data
    $data = User::query()->get();
});

// ✅ Correct: Re-configure coroutine permissions
Co::create(function () use ($user) {
    // Context needs to be re-set
    Context::setDeptColumn('dept_id');
    Context::setCreatedByColumn('created_by');
    Context::setScopeType(ScopeType::DEPT_SELF);
    
    $data = User::query()->get();
});
```

:::

## Complete API Reference

### DataScope Annotation Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `deptColumn` | string | `'dept_id'` | Department field name |
| `createdByColumn` | string | `'created_by'` | Creator field name |
| `scopeType` | ScopeType | `ScopeType::DEPT_CREATED_BY` | Permission scope type |
| `onlyTables` | array\|null | `null` | Applies only to specified tables; null applies to all tables |

### Context Class Methods

| Method | Description |
|--------|-------------|
| `Context::setDeptColumn(string)` | Sets the department field name |
| `Context::setCreatedByColumn(string)` | Sets the creator field name |
| `Context::setScopeType(ScopeType)` | Sets the permission scope type |
| `Context::setOnlyTables(array)` | Sets tables to apply permissions to |
| `Context::getDeptColumn()` | Gets the department field name |
| `Context::getCreatedByColumn()` | Gets the creator field name |
| `Context::getScopeType()` | Gets the permission scope type |
| `Context::getOnlyTables()` | Gets the list of specified tables |

### Factory Class Methods

| Method | Description |
|--------|-------------|
| `Factory::make()` | Creates a factory instance |
| `Factory::build(Builder, User)` | Applies permission filtering to the query builder |

### ScopeType Enum Values

| Value | Description |
|-------|-------------|
| `ScopeType::DEPT` | Filters only by department |
| `ScopeType::CREATED_BY` | Filters only by creator |
| `ScopeType::DEPT_CREATED_BY` | Filters by department AND creator |
| `ScopeType::DEPT_OR_CREATED_BY` | Filters by department OR creator |

### PolicyType Enum Values

| Value | Description |
|-------|-------------|
| `PolicyType::DeptSelf` | Current department |
| `PolicyType::DeptTree` | Current department and sub-departments |
| `PolicyType::All` | All data |
| `PolicyType::Self` | Self only |
| `PolicyType::CustomDept` | Custom department |
| `PolicyType::CustomFunc` | Custom function |