# Usage Examples

Using data permissions in code currently supports multiple methods for dynamic enabling and disabling. Here are several common development scenarios:

## Controlling Data Permissions for an Entire Model

Taking the default `User` model as an example, suppose we need to implement data permission control for the `User` model.

You can use the `DataScopes` trait in the `User` model to enable data permission scoping.

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

## Controlling Data Permissions for a Code Block

Thanks to Hyperf AOP features, we can use the [DataScope](https://github.com/mineadmin/MineAdmin/blob/master-department/app/Library/DataPermission/Attribute/DataScope.php) annotation on classes or class methods to enable data permission control for specific code blocks.

Taking the built-in user module's [pagination list](https://github.com/mineadmin/MineAdmin/blob/master-department/app/Service/Permission/UserService.php#L93~L100) as an example:

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

When calling the `page` method, data permissions will automatically apply to the query.

## Controlling Permissions for Specific ORM Queries

In certain scenarios, more granular permission isolation is needed. In such cases, you can use the `Factory::make()->build()` method to restrict specific queries.

```php
// Manually using Factory for permission filtering
use App\Library\DataPermission\Factory;
use App\Model\Permission\User;

class DemoService {

    public function test(User $user): void {
        $userQuery = User::query();
        
        // Apply data isolation to UserQuery separately
        Factory::make()->build($userQuery->getQuery(), $user);
        
        $result = $userQuery->get();
    }
}
```

## Configuring Data Permissions Using Context

### Basic Configuration Method

```php
// /mineadmin/app/Library/DataPermission/Context.php
use App\Library\DataPermission\Context;
use App\Library\DataPermission\ScopeType;

// Set department field name
Context::setDeptColumn('department_id');
// Set creator field name
Context::setCreatedByColumn('creator');
// Set isolation method
Context::setScopeType(ScopeType::DEPT_CREATED_BY);
// Apply data isolation only to specified tables
Context::setOnlyTables(['user', 'orders']);

$query = User::query();
Factory::make()->build($query->getQuery(), $user);
```

### Complete DataScope Annotation Configuration

```php
// /mineadmin/app/Library/DataPermission/Attribute/DataScope.php
#[DataScope(
    // Department field name (default: 'dept_id')
    deptColumn: 'department_id',
    
    // Creator field name (default: 'created_by')
    createdByColumn: 'creator_id',
    
    // Isolation method (default: ScopeType::DEPT_CREATED_BY)
    scopeType: ScopeType::DEPT_SELF,
    
    // Apply only to specified tables (default: null, applies to all tables)
    onlyTables: ['orders', 'order_items']
)]
public function getFilteredData(): Collection
{
    return Order::with('items')->get();
}
```

## Policy Type Usage Examples

### DEPT_SELF - Department-Level Permissions

```php
// Source: Based on /Users/zhuzhu/project/mineadmin/app/Model/Enums/DataPermission/PolicyType.php
#[DataScope(scopeType: ScopeType::DEPT)]
public function getDepartmentUsers(): Collection
{
    // Automatically filters to users in the current user's department
    return User::query()->get();
}
```

### DEPT_TREE - Department Tree Permissions  

```php
#[DataScope(scopeType: ScopeType::DEPT)]
public function getDepartmentTreeUsers(): Collection
{
    // Automatically includes users from current department and all sub-departments
    return User::query()->get();
}
```

### CREATED_BY - Creator Permissions

```php
#[DataScope(scopeType: ScopeType::CREATED_BY)]
public function getMyCreatedData(): Collection
{
    // Returns only data created by current user
    return Document::query()->get();
}
```

### Combined Permission Usage

```php
// AND condition: Must belong to current department AND be created by user
#[DataScope(scopeType: ScopeType::DEPT_CREATED_BY)]
public function getMyDeptData(): Collection
{
    return Document::query()->get();
}

// OR condition: Belongs to current department OR created by user
#[DataScope(scopeType: ScopeType::DEPT_OR_CREATED_BY)]
public function getDeptOrMyData(): Collection
{
    return Document::query()->get();
}
```

## Custom Function Policies

### Creating Custom Functions

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

### Using Custom Functions

To use custom functions, set the policy type to `CUSTOM_FUNC` and specify the function name in the policy's `value` field:

```php
// Create policy record in database
Policy::create([
    'user_id' => $userId,
    'policy_type' => PolicyType::CustomFunc,
    'value' => ['my_custom_filter'],  // Custom function name
    'is_default' => true
]);
```

## Data Permissions in Business Scenarios

### Order Management System

```php
class OrderService 
{
    // Regular employees can only see orders they created
    #[DataScope(
        scopeType: ScopeType::CREATED_BY,
        onlyTables: ['orders']
    )]
    public function getMyOrders(): Collection
    {
        return Order::query()->get();
    }
    
    // Department managers can see all department orders
    #[DataScope(
        scopeType: ScopeType::DEPT,
        onlyTables: ['orders']
    )]
    public function getDepartmentOrders(): Collection
    {
        return Order::query()->get();
    }
    
    // Regional managers can see all orders in department tree
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
    // Document permissions: Department shared + personal private
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

When dealing with multi-table joins, you can specify the `onlyTables` parameter to control which tables have data permissions applied:

```php
#[DataScope(
    scopeType: ScopeType::DEPT_SELF,
    onlyTables: ['orders']  // Apply permission filtering only to orders table
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

Note that regardless of the method used, if a new coroutine is created, the permissions must be reconfigured to take effect.

```php
// ❌ Wrong: Permissions lost in coroutine
Co::create(function () {
    // Permission configuration lost, may return incorrect data
    $data = User::query()->get();
});

// ✅ Correct: Reset coroutine permissions
Co::create(function () use ($user) {
    // Need to reset context
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
| `onlyTables` | array\|null | `null` | Apply only to specified tables, null applies to all tables |

### Context Class Methods

| Method | Description |
|--------|-------------|
| `Context::setDeptColumn(string)` | Set department field name |
| `Context::setCreatedByColumn(string)` | Set creator field name |
| `Context::setScopeType(ScopeType)` | Set permission scope type |
| `Context::setOnlyTables(array)` | Set tables to apply permissions to |
| `Context::getDeptColumn()` | Get department field name |
| `Context::getCreatedByColumn()` | Get creator field name |
| `Context::getScopeType()` | Get permission scope type |
| `Context::getOnlyTables()` | Get specified table list |

### Factory Class Methods

| Method | Description |
|--------|-------------|
| `Factory::make()` | Create factory instance |
| `Factory::build(Builder, User)` | Apply permission filtering to query builder |

### ScopeType Enum Values

| Value | Description |
|-------|-------------|
| `ScopeType::DEPT` | Filter by department only |
| `ScopeType::CREATED_BY` | Filter by creator only |
| `ScopeType::DEPT_CREATED_BY` | Filter by department AND creator |
| `ScopeType::DEPT_OR_CREATED_BY` | Filter by department OR creator |

### PolicyType Enum Values

| Value | Description |
|-------|-------------|
| `PolicyType::DeptSelf` | Current department |
| `PolicyType::DeptTree` | Current department and sub-departments |
| `PolicyType::All` | All data |
| `PolicyType::Self` | Only own data |
| `PolicyType::CustomDept` | Custom department |
| `PolicyType::CustomFunc` | Custom function |