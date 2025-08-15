# Performance Optimization

## Database Index Optimization

To ensure high performance of the data permission system, appropriate database indexes should be created:

```sql
-- Core table index optimization
CREATE INDEX idx_user_dept_id ON user(dept_id);
CREATE INDEX idx_user_created_by ON user(created_by);
CREATE INDEX idx_dept_parent_id ON department(parent_id);

-- Data permission policy related indexes
CREATE INDEX idx_policy_user_id ON data_permission_policy(user_id);
CREATE INDEX idx_policy_position_id ON data_permission_policy(position_id);
CREATE INDEX idx_policy_type ON data_permission_policy(policy_type);

-- Composite indexes for complex queries
CREATE INDEX idx_user_dept_created ON user(dept_id, created_by);
CREATE INDEX idx_user_dept_status ON user(dept_id, status);

-- Association table indexes
CREATE INDEX idx_user_dept_mapping ON user_dept(user_id, dept_id);
CREATE INDEX idx_user_position_mapping ON user_position(user_id, position_id);
CREATE INDEX idx_dept_leader_mapping ON dept_leader(dept_id, user_id);
```

## Existing System Optimization Recommendations

Based on MineAdmin's current data permission implementation, here are targeted optimization suggestions:

### 1. Factory Class Optimization

```php
// /mineadmin/app/Library/DataPermission/Factory.php
// The current Factory class can be optimized as follows:

class Factory
{
    // Add query result caching
    private static array $queryCache = [];
    
    public function build(Builder $builder, User $user): void
    {
        // Skip check for super admin
        if ($user->isSuperAdmin()) {
            return;
        }
        
        // Cache user policies to avoid repeated queries
        $cacheKey = "user_policy_{$user->id}";
        $policy = self::$queryCache[$cacheKey] ?? ($user->getPolicy());
        
        if ($policy) {
            self::$queryCache[$cacheKey] = $policy;
            // Apply permission filtering logic...
        }
    }
}
```

### 2. Department Tree Query Optimization

```php
// /mineadmin/app/Model/Permission/Department.php
// Optimize the existing getFlatChildren method:

public function getFlatChildren(): Collection
{
    // Use recursive CTE to optimize department tree queries
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
    
    return collect(DB::select($sql, [$this->id]));
}
```

### 3. DataScope Annotation Performance Optimization

```php
// /mineadmin/app/Library/DataPermission/Aspects/DataScopeAspect.php
// It's recommended to add performance monitoring in aspect processing:

class DataScopeAspect
{
    public function process(ProceedingJoinPoint $proceedingJoinPoint)
    {
        $start = microtime(true);
        
        try {
            $result = $this->handleDataScope($proceedingJoinPoint);
            
            // Log execution time
            $duration = microtime(true) - $start;
            if ($duration > 0.1) {
                Log::warning('Data permission processing took too long', [
                    'method' => $proceedingJoinPoint->className . '::' . $proceedingJoinPoint->methodName,
                    'duration' => $duration
                ]);
            }
            
            return $result;
        } catch (\Throwable $e) {
            Log::error('Data permission processing exception', [
                'error' => $e->getMessage(),
                'method' => $proceedingJoinPoint->className . '::' . $proceedingJoinPoint->methodName
            ]);
            throw $e;
        }
    }
}
```

## Query Optimization Strategies

### 1. Prepared Statement Usage

```php
// Optimize repeated permission queries
class OptimizedPolicyResolver
{
    private static array $preparedStatements = [];
    
    public static function getUserPolicy(int $userId): ?Policy
    {
        $stmt = self::$preparedStatements['user_policy'] ?? DB::getPdo()->prepare(
            "SELECT * FROM data_permission_policy WHERE user_id = ? LIMIT 1"
        );
        
        $stmt->execute([$userId]);
        $result = $stmt->fetch();
        
        return $result ? new Policy($result) : null;
    }
}
```

### 2. Batch Query Optimization

```php
// Optimize batch operations for the existing system
class BatchDataPermissionHelper
{
    public static function loadUsersWithPolicies(array $userIds): Collection
    {
        // Batch eager load users with their permission policies
        return User::with(['policy', 'position.policy'])
                  ->whereIn('id', $userIds)
                  ->get();
    }
    
    public static function loadDepartmentTrees(array $deptIds): array
    {
        // Batch load department trees
        $departments = Department::with('children')
                                ->whereIn('id', $deptIds)
                                ->get();
        
        $trees = [];
        foreach ($departments as $dept) {
            $trees[$dept->id] = $dept->getFlatChildren();
        }
        
        return $trees;
    }
}
```

## Caching Strategies

### Redis Cache Configuration

```php
// config/autoload/cache.php
return [
    'default' => [
        'driver' => 'redis',
        'packer' => Hyperf\Utils\Packer\PhpSerializerPacker::class,
        'prefix' => 'mineadmin:cache:',
    ],
    
    // Dedicated cache for data permissions
    'data_permission' => [
        'driver' => 'redis',
        'packer' => Hyperf\Utils\Packer\PhpSerializerPacker::class,
        'prefix' => 'mineadmin:data_perm:',
        'pool' => 'default',
    ]
];
```

### Policy Cache Implementation

```php
use Hyperf\Cache\Annotation\Cacheable;

class CachedPolicyService
{
    #[Cacheable(prefix: "user_policy", ttl: 300)]
    public function getUserPolicy(int $userId): ?Policy
    {
        return Policy::where('user_id', $userId)->first();
    }
    
    #[Cacheable(prefix: "dept_tree", ttl: 600)]
    public function getDepartmentTree(int $deptId): array
    {
        $dept = Department::find($deptId);
        return $dept ? $dept->getFlatChildren()->toArray() : [];
    }
}
```

## Monitoring and Debugging

### Query Performance Monitoring

```php
// Add performance monitoring to the Factory class
class Factory
{
    public function build(Builder $builder, User $user): void
    {
        if (config('app.debug', false)) {
            $start = microtime(true);
            
            // Original permission processing logic
            $this->applyDataPermission($builder, $user);
            
            $duration = microtime(true) - $start;
            if ($duration > 0.05) { // Log if exceeds 50ms
                Log::debug('Data permission query duration', [
                    'user_id' => $user->id,
                    'duration' => $duration,
                    'sql' => $builder->toSql()
                ]);
            }
        } else {
            $this->applyDataPermission($builder, $user);
        }
    }
}
```

### Slow Query Analysis

```php
// Register query listener in service provider
class AppServiceProvider
{
    public function boot()
    {
        if (config('app.debug')) {
            DB::listen(function ($query) {
                if ($query->time > 100) { // Exceeds 100ms
                    Log::warning('Slow query detected', [
                        'sql' => $query->sql,
                        'bindings' => $query->bindings,
                        'time' => $query->time . 'ms'
                    ]);
                }
            });
        }
    }
}
```

## Configuration Optimization Recommendations

### Hyperf Framework Configuration

```php
// config/autoload/databases.php
return [
    'default' => [
        'driver' => 'mysql',
        'pool' => [
            'min_connections' => 5,     // Adjust based on actual concurrency
            'max_connections' => 50,    // Avoid too many connections
            'connect_timeout' => 10.0,
            'wait_timeout' => 3.0,
            'heartbeat' => -1,          // Disable heartbeat to reduce overhead
            'max_idle_time' => 60,      // Maximum connection idle time
        ],
        'options' => [
            PDO::ATTR_CASE => PDO::CASE_NATURAL,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_ORACLE_NULLS => PDO::NULL_NATURAL,
            PDO::ATTR_STRINGIFY_FETCHES => false,
            PDO::ATTR_EMULATE_PREPARES => false,
        ],
    ]
];
```

### Coroutine Context Optimization

```php
// Add coroutine safety mechanism in data permission context
use Hyperf\Utils\Context;

class DataPermissionContext
{
    public static function setUserPolicy(Policy $policy): void
    {
        Context::set('data_permission.user_policy', $policy);
    }
    
    public static function getUserPolicy(): ?Policy
    {
        return Context::get('data_permission.user_policy');
    }
    
    public static function clearContext(): void
    {
        Context::destroy('data_permission.user_policy');
    }
}
```

## Summary

The optimization priorities for MineAdmin's current data permission system should focus on:

1. **Database Index Optimization** - Add appropriate indexes for core query fields
2. **Query Caching** - Cache user policies and department trees
3. **Batch Operations** - Optimize batch processing for multi-user permission checks
4. **Performance Monitoring** - Add query performance tracking and alerts
5. **Coroutine Safety** - Ensure context safety in Hyperf's coroutine environment

These optimization measures are based on the existing code structure and can be implemented incrementally to improve system performance.