# Troubleshooting

## Common Issue Diagnosis

### 1. Permission Policy Not Taking Effect

**Issue**: User has configured data permission policies, but query results still show all data

**Diagnosis Steps**:

#### 1.1 Check if User is Super Admin

```php
// Source: Based on /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Factory.php:37-39
$user = User::find($userId);

// Super admins automatically bypass all data permission checks
if ($user->isSuperAdmin()) {
    echo "User is super admin, will bypass all data permission checks";
}
```

#### 1.2 Check User Policy Configuration

```php
// Source: Based on /Users/zhuzhu/project/mineadmin/app/Model/Permission/User.php:160-179
$user = User::find($userId);

// Check user's direct policy
$userPolicy = $user->policy()->first();
if ($userPolicy) {
    echo "User policy exists:";
    var_dump([
        'policy_type' => $userPolicy->policy_type,
        'value' => $userPolicy->value,
        'is_default' => $userPolicy->is_default
    ]);
} else {
    echo "User has no direct policy, checking position policies:";
    
    // Check position policies
    $user->load('position');
    foreach ($user->position as $position) {
        $positionPolicy = $position->policy()->first();
        if ($positionPolicy) {
            echo "Found position policy:";
            var_dump([
                'position_id' => $position->id,
                'position_name' => $position->name,
                'policy_type' => $positionPolicy->policy_type,
                'value' => $positionPolicy->value
            ]);
            break;
        }
    }
}
```

#### 1.3 Verify DataScope Annotation Configuration

Ensure the method has the correct DataScope annotation:

```php
// Source: Based on /Users/zhuzhu/project/mineadmin/app/Service/Permission/UserService.php:94-98
use App\Library\DataPermission\Attribute\DataScope;
use App\Library\DataPermission\ScopeType;

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

#### 1.4 Check Data Permission Context

```php
// Source: Based on /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Context.php
use App\Library\DataPermission\Context;

// Check current context configuration
$context = [
    'dept_column' => Context::getDeptColumn(),
    'created_by_column' => Context::getCreatedByColumn(),
    'scope_type' => Context::getScopeType(),
    'only_tables' => Context::getOnlyTables()
];

var_dump($context);
```

### 2. Coroutine Context Loss

**Issue**: Data permission configuration lost within coroutines

**Solution**:

Reset the context in the new coroutine:

```php
// Source: Based on /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Context.php
use Hyperf\Utils\Coroutine;
use App\Library\DataPermission\Context;
use App\Library\DataPermission\ScopeType;

// Correct coroutine context handling
Coroutine::create(function () use ($userId) {
    // Reset data permission context in the new coroutine
    Context::setDeptColumn('dept_id');
    Context::setCreatedByColumn('created_by');
    Context::setScopeType(ScopeType::DEPT_CREATED_BY);
    Context::setOnlyTables(['user']);
    
    // Execute business logic
    $result = UserService::page($params);
});
```

### 3. Query Performance Issues

**Issue**: Query speed significantly slower after enabling data permissions

#### 3.1 Add Necessary Database Indexes

```sql
-- Basic indexes (adjust based on actual table structure)
CREATE INDEX idx_user_dept_id ON user(dept_id);
CREATE INDEX idx_user_created_by ON user(created_by);
CREATE INDEX idx_dept_parent_id ON department(parent_id);

-- Data permission policy related indexes
CREATE INDEX idx_policy_user_id ON data_permission_policy(user_id);
CREATE INDEX idx_policy_position_id ON data_permission_policy(position_id);
CREATE INDEX idx_policy_type ON data_permission_policy(policy_type);

-- Composite index for optimized compound queries
CREATE INDEX idx_user_dept_created ON user(dept_id, created_by);
```

#### 3.2 Enable SQL Query Logging for Analysis

```php
// Enable query logging in debug environment
use Hyperf\Database\Model\Events\QueryExecuted;
use Hyperf\Event\Annotation\Listener;
use Hyperf\Event\Contract\ListenerInterface;

#[Listener]
class QueryListener implements ListenerInterface
{
    public function listen(): array
    {
        return [QueryExecuted::class];
    }

    public function process(object $event)
    {
        if ($event instanceof QueryExecuted) {
            // Log slow queries (over 100ms)
            if ($event->time > 100) {
                Logger::warning('Slow query detected', [
                    'sql' => $event->sql,
                    'bindings' => $event->bindings,
                    'time' => $event->time . 'ms'
                ]);
            }
        }
    }
}
```

#### 3.3 Optimize Department Tree Queries

```php
// Source: Optimize getFlatChildren method in /Users/zhuzhu/project/mineadmin/app/Model/Permission/Department.php
use Hyperf\Database\Model\Collection;
use Hyperf\DbConnection\Db;

class Department extends Model
{
    // Use recursive CTE to optimize department tree queries
    public function getFlatChildrenOptimized(): Collection
    {
        $sql = "
            WITH RECURSIVE dept_tree AS (
                SELECT id, parent_id, name, 0 as level
                FROM department 
                WHERE id = ?
                
                UNION ALL
                
                SELECT d.id, d.parent_id, d.name, dt.level + 1
                FROM department d
                INNER JOIN dept_tree dt ON d.parent_id = dt.id
                WHERE dt.level < 10  -- Prevent infinite recursion
            )
            SELECT * FROM dept_tree ORDER BY level, id
        ";
        
        $results = Db::select($sql, [$this->id]);
        return new Collection($results);
    }
}
```

### 4. Data Inconsistency Issues

**Issue**: Same user queries return different data at different times

#### 4.1 Clear Related Cache

```php
// Clear cache if caching is used
use Hyperf\Cache\Cache;

function clearDataPermissionCache(int $userId): void
{
    $cache = ApplicationContext::getContainer()->get(Cache::class);
    
    // Clear user policy cache
    $cache->delete("user_policy_{$userId}");
    
    // Clear department tree cache
    $user = User::find($userId);
    if ($user && $user->department) {
        foreach ($user->department as $dept) {
            $cache->delete("dept_tree_{$dept->id}");
        }
    }
}
```

#### 4.2 Force Reload from Database

```php
// Force reload user and related data from database
$user = User::find($userId);
$user->refresh(); // Refresh user data
$user->load(['policy', 'position.policy', 'department']); // Reload related data

// Get the latest policy
$policy = $user->getPolicy();
```

### 5. AOP Aspect Not Taking Effect

**Issue**: DataScope annotation not working

#### 5.1 Check AOP Configuration

```php
// Check config/autoload/annotations.php for correct AOP configuration
return [
    'scan' => [
        'paths' => [
            BASE_PATH . '/app',
        ],
        'ignore_annotations' => [
            'mixin',
        ],
        'class_map' => [],
    ],
];
```

#### 5.2 Confirm Aspect Class Exists

```php
// Source: Confirm file exists at /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Aspects/DataScopeAspect.php
use App\Library\DataPermission\Aspects\DataScopeAspect;

// Check if aspect is correctly registered
if (class_exists(DataScopeAspect::class)) {
    echo "DataScopeAspect class exists";
} else {
    echo "DataScopeAspect class does not exist, please check file path";
}
```

### 6. Debugging Methods

#### 6.1 Enable Debug Mode

```php
// Add logging where debugging is needed
use Hyperf\Logger\LoggerFactory;
use Hyperf\Utils\ApplicationContext;

$logger = ApplicationContext::getContainer()->get(LoggerFactory::class)->get('data_permission');

// Log current user information
$logger->debug('Data permission debugging', [
    'user_id' => $userId,
    'is_super_admin' => $user->isSuperAdmin(),
    'user_policy' => $user->policy ? $user->policy->toArray() : null,
    'position_policies' => $user->position->map(function ($pos) {
        return $pos->policy ? $pos->policy->toArray() : null;
    })->filter()->toArray()
]);
```

#### 6.2 Manually Check Permission Filtering

```php
// Source: Based on /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Factory.php
use App\Library\DataPermission\Factory;
use App\Model\Permission\User;
use Hyperf\Database\Query\Builder;

function testDataPermission(int $userId): void
{
    $user = User::find($userId);
    $query = User::query();
    $builder = $query->getQuery();
    
    // Manually apply data permission filtering
    $factory = new Factory();
    $factory->build($builder, $user);
    
    // Output generated SQL
    echo "Generated SQL: " . $builder->toSql() . PHP_EOL;
    echo "Binding parameters: " . json_encode($builder->getBindings()) . PHP_EOL;
    
    // Execute query to see results
    $results = $query->get();
    echo "Query result count: " . $results->count() . PHP_EOL;
}
```

### 7. Common Check Commands

Create a simple check script:

```php
// Create file: check_data_permission.php
<?php

use App\Model\Permission\User;
use App\Model\DataPermission\Policy;
use App\Library\DataPermission\Context;

function checkDataPermissionStatus(int $userId): array
{
    $user = User::find($userId);
    if (!$user) {
        return ['error' => 'User does not exist'];
    }
    
    $result = [
        'user_id' => $userId,
        'is_super_admin' => $user->isSuperAdmin(),
        'user_policy' => null,
        'position_policies' => [],
        'context' => [
            'dept_column' => Context::getDeptColumn(),
            'created_by_column' => Context::getCreatedByColumn(),
            'scope_type' => Context::getScopeType()?->value,
            'only_tables' => Context::getOnlyTables()
        ]
    ];
    
    // Check user policy
    $userPolicy = $user->policy()->first();
    if ($userPolicy) {
        $result['user_policy'] = $userPolicy->toArray();
    }
    
    // Check position policies
    $user->load('position');
    foreach ($user->position as $position) {
        $positionPolicy = $position->policy()->first();
        if ($positionPolicy) {
            $result['position_policies'][] = [
                'position' => $position->toArray(),
                'policy' => $positionPolicy->toArray()
            ];
        }
    }
    
    return $result;
}

// Usage example
// $status = checkDataPermissionStatus(1);
// var_dump($status);
```

## Summary

When troubleshooting MineAdmin data permission issues, follow this order:

1. **Check Super Admin Status** - Super admins bypass all permission checks
2. **Verify Policy Configuration** - Ensure user or position has correct permission policies
3. **Check Annotation Configuration** - Confirm the DataScope annotation on the method is correct
4. **Verify AOP is Working** - Confirm the aspect can properly intercept method calls
5. **Check Coroutine Context** - Reset permission context in new coroutines
6. **Analyze Query Performance** - Add necessary database indexes
7. **Clear Cache** - Clear related caches promptly after data changes

These diagnosis methods based on actual code can effectively resolve most data permission-related issues.