# 性能优化

## 数据库索引优化

为了确保数据权限系统的高性能，需要创建适当的数据库索引：

```sql
-- 核心表索引优化
CREATE INDEX idx_user_dept_id ON user(dept_id);
CREATE INDEX idx_user_created_by ON user(created_by);
CREATE INDEX idx_dept_parent_id ON department(parent_id);

-- 数据权限策略相关索引
CREATE INDEX idx_policy_user_id ON data_permission_policy(user_id);
CREATE INDEX idx_policy_position_id ON data_permission_policy(position_id);
CREATE INDEX idx_policy_type ON data_permission_policy(policy_type);

-- 组合索引优化复合查询
CREATE INDEX idx_user_dept_created ON user(dept_id, created_by);
CREATE INDEX idx_user_dept_status ON user(dept_id, status);

-- 关联表索引
CREATE INDEX idx_user_dept_mapping ON user_dept(user_id, dept_id);
CREATE INDEX idx_user_position_mapping ON user_position(user_id, position_id);
CREATE INDEX idx_dept_leader_mapping ON dept_leader(dept_id, user_id);
```

## 现有系统优化建议

基于 MineAdmin 当前的数据权限实现，以下是针对性的优化建议：

### 1. Factory 类优化

```php
// /mineadmin/app/Library/DataPermission/Factory.php
// 当前的 Factory 类可以通过以下方式优化：

class Factory
{
    // 添加查询结果缓存
    private static array $queryCache = [];
    
    public function build(Builder $builder, User $user): void
    {
        // 超级管理员跳过检查
        if ($user->isSuperAdmin()) {
            return;
        }
        
        // 缓存用户策略避免重复查询
        $cacheKey = "user_policy_{$user->id}";
        $policy = self::$queryCache[$cacheKey] ?? ($user->getPolicy());
        
        if ($policy) {
            self::$queryCache[$cacheKey] = $policy;
            // 应用权限过滤逻辑...
        }
    }
}
```

### 2. 部门树查询优化

```php
// /mineadmin/app/Model/Permission/Department.php
// 优化现有的 getFlatChildren 方法：

public function getFlatChildren(): Collection
{
    // 使用递归CTE优化部门树查询
    $sql = "
        WITH RECURSIVE dept_tree AS (
            SELECT id, parent_id, name, 0 as level
            FROM department 
            WHERE id = ?
            
            UNION ALL
            
            SELECT d.id, d.parent_id, d.name, dt.level + 1
            FROM department d
            INNER JOIN dept_tree dt ON d.parent_id = dt.id
            WHERE dt.level < 10  -- 防止无限递归
        )
        SELECT * FROM dept_tree ORDER BY level, id
    ";
    
    return collect(DB::select($sql, [$this->id]));
}
```

### 3. DataScope 注解性能优化

```php
// /mineadmin/app/Library/DataPermission/Aspects/DataScopeAspect.php
// 建议在切面处理中添加性能监控：

class DataScopeAspect
{
    public function process(ProceedingJoinPoint $proceedingJoinPoint)
    {
        $start = microtime(true);
        
        try {
            $result = $this->handleDataScope($proceedingJoinPoint);
            
            // 记录执行时间
            $duration = microtime(true) - $start;
            if ($duration > 0.1) {
                Log::warning('数据权限处理耗时较长', [
                    'method' => $proceedingJoinPoint->className . '::' . $proceedingJoinPoint->methodName,
                    'duration' => $duration
                ]);
            }
            
            return $result;
        } catch (\Throwable $e) {
            Log::error('数据权限处理异常', [
                'error' => $e->getMessage(),
                'method' => $proceedingJoinPoint->className . '::' . $proceedingJoinPoint->methodName
            ]);
            throw $e;
        }
    }
}
```

## 查询优化策略

### 1. 预编译语句使用

```php
// 优化重复的权限查询
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

### 2. 批量查询优化

```php
// 针对现有系统的批量操作优化
class BatchDataPermissionHelper
{
    public static function loadUsersWithPolicies(array $userIds): Collection
    {
        // 批量预加载用户及其权限策略
        return User::with(['policy', 'position.policy'])
                  ->whereIn('id', $userIds)
                  ->get();
    }
    
    public static function loadDepartmentTrees(array $deptIds): array
    {
        // 批量加载部门树
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

## 缓存策略

### Redis 缓存配置

```php
// config/autoload/cache.php
return [
    'default' => [
        'driver' => 'redis',
        'packer' => Hyperf\Utils\Packer\PhpSerializerPacker::class,
        'prefix' => 'mineadmin:cache:',
    ],
    
    // 数据权限专用缓存
    'data_permission' => [
        'driver' => 'redis',
        'packer' => Hyperf\Utils\Packer\PhpSerializerPacker::class,
        'prefix' => 'mineadmin:data_perm:',
        'pool' => 'default',
    ]
];
```

### 策略缓存实现

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

## 监控和调试

### 查询性能监控

```php
// 在 Factory 类中添加性能监控
class Factory
{
    public function build(Builder $builder, User $user): void
    {
        if (config('app.debug', false)) {
            $start = microtime(true);
            
            // 原有的权限处理逻辑
            $this->applyDataPermission($builder, $user);
            
            $duration = microtime(true) - $start;
            if ($duration > 0.05) { // 超过50ms记录
                Log::debug('数据权限查询耗时', [
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

### 慢查询分析

```php
// 在服务提供者中注册查询监听器
class AppServiceProvider
{
    public function boot()
    {
        if (config('app.debug')) {
            DB::listen(function ($query) {
                if ($query->time > 100) { // 超过100ms
                    Log::warning('慢查询检测', [
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

## 配置优化建议

### Hyperf 框架配置

```php
// config/autoload/databases.php
return [
    'default' => [
        'driver' => 'mysql',
        'pool' => [
            'min_connections' => 5,     // 根据实际并发调整
            'max_connections' => 50,    // 避免连接过多
            'connect_timeout' => 10.0,
            'wait_timeout' => 3.0,
            'heartbeat' => -1,          // 禁用心跳减少开销
            'max_idle_time' => 60,      // 连接最大空闲时间
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

### 协程上下文优化

```php
// 在数据权限上下文中添加协程安全机制
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

## 总结

当前 MineAdmin 数据权限系统的优化重点应该放在：

1. **数据库索引优化** - 为核心查询字段添加合适的索引
2. **查询缓存** - 对用户策略和部门树进行缓存
3. **批量操作** - 优化多用户权限检查的批量处理
4. **性能监控** - 添加查询性能追踪和告警
5. **协程安全** - 确保在 Hyperf 协程环境下的上下文安全

这些优化措施基于现有的代码结构，可以逐步实施以提升系统性能。