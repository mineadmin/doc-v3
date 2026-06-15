# 效能最佳化

## 資料庫索引最佳化

為了確保資料許可權系統的高效能，需要建立適當的資料庫索引：

```sql
-- 核心表索引最佳化
CREATE INDEX idx_user_dept_id ON user(dept_id);
CREATE INDEX idx_user_created_by ON user(created_by);
CREATE INDEX idx_dept_parent_id ON department(parent_id);

-- 資料許可權策略相關索引
CREATE INDEX idx_policy_user_id ON data_permission_policy(user_id);
CREATE INDEX idx_policy_position_id ON data_permission_policy(position_id);
CREATE INDEX idx_policy_type ON data_permission_policy(policy_type);

-- 組合索引最佳化複合查詢
CREATE INDEX idx_user_dept_created ON user(dept_id, created_by);
CREATE INDEX idx_user_dept_status ON user(dept_id, status);

-- 關聯表索引
CREATE INDEX idx_user_dept_mapping ON user_dept(user_id, dept_id);
CREATE INDEX idx_user_position_mapping ON user_position(user_id, position_id);
CREATE INDEX idx_dept_leader_mapping ON dept_leader(dept_id, user_id);
```

## 現有系統最佳化建議

基於 MineAdmin 當前的資料許可權實現，以下是針對性的最佳化建議：

### 1. Factory 類最佳化

```php
// /mineadmin/app/Library/DataPermission/Factory.php
// 當前的 Factory 類可以透過以下方式最佳化：

class Factory
{
    // 新增查詢結果快取
    private static array $queryCache = [];
    
    public function build(Builder $builder, User $user): void
    {
        // 超級管理員跳過檢查
        if ($user->isSuperAdmin()) {
            return;
        }
        
        // 快取使用者策略避免重複查詢
        $cacheKey = "user_policy_{$user->id}";
        $policy = self::$queryCache[$cacheKey] ?? ($user->getPolicy());
        
        if ($policy) {
            self::$queryCache[$cacheKey] = $policy;
            // 應用許可權過濾邏輯...
        }
    }
}
```

### 2. 部門樹查詢最佳化

```php
// /mineadmin/app/Model/Permission/Department.php
// 最佳化現有的 getFlatChildren 方法：

public function getFlatChildren(): Collection
{
    // 使用遞迴CTE最佳化部門樹查詢
    $sql = "
        WITH RECURSIVE dept_tree AS (
            SELECT id, parent_id, name, 0 as level
            FROM department 
            WHERE id = ?
            
            UNION ALL
            
            SELECT d.id, d.parent_id, d.name, dt.level + 1
            FROM department d
            INNER JOIN dept_tree dt ON d.parent_id = dt.id
            WHERE dt.level < 10  -- 防止無限遞迴
        )
        SELECT * FROM dept_tree ORDER BY level, id
    ";
    
    return collect(DB::select($sql, [$this->id]));
}
```

### 3. DataScope 註解效能最佳化

```php
// /mineadmin/app/Library/DataPermission/Aspects/DataScopeAspect.php
// 建議在切面處理中新增效能監控：

class DataScopeAspect
{
    public function process(ProceedingJoinPoint $proceedingJoinPoint)
    {
        $start = microtime(true);
        
        try {
            $result = $this->handleDataScope($proceedingJoinPoint);
            
            // 記錄執行時間
            $duration = microtime(true) - $start;
            if ($duration > 0.1) {
                Log::warning('資料許可權處理耗時較長', [
                    'method' => $proceedingJoinPoint->className . '::' . $proceedingJoinPoint->methodName,
                    'duration' => $duration
                ]);
            }
            
            return $result;
        } catch (\Throwable $e) {
            Log::error('資料許可權處理異常', [
                'error' => $e->getMessage(),
                'method' => $proceedingJoinPoint->className . '::' . $proceedingJoinPoint->methodName
            ]);
            throw $e;
        }
    }
}
```

## 查詢最佳化策略

### 1. 預編譯語句使用

```php
// 最佳化重複的許可權查詢
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

### 2. 批次查詢最佳化

```php
// 針對現有系統的批次操作最佳化
class BatchDataPermissionHelper
{
    public static function loadUsersWithPolicies(array $userIds): Collection
    {
        // 批次預載入使用者及其許可權策略
        return User::with(['policy', 'position.policy'])
                  ->whereIn('id', $userIds)
                  ->get();
    }
    
    public static function loadDepartmentTrees(array $deptIds): array
    {
        // 批次載入部門樹
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

## 快取策略

### Redis 快取配置

```php
// config/autoload/cache.php
return [
    'default' => [
        'driver' => 'redis',
        'packer' => Hyperf\Utils\Packer\PhpSerializerPacker::class,
        'prefix' => 'mineadmin:cache:',
    ],
    
    // 資料許可權專用快取
    'data_permission' => [
        'driver' => 'redis',
        'packer' => Hyperf\Utils\Packer\PhpSerializerPacker::class,
        'prefix' => 'mineadmin:data_perm:',
        'pool' => 'default',
    ]
];
```

### 策略快取實現

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

## 監控和除錯

### 查詢效能監控

```php
// 在 Factory 類中新增效能監控
class Factory
{
    public function build(Builder $builder, User $user): void
    {
        if (config('app.debug', false)) {
            $start = microtime(true);
            
            // 原有的許可權處理邏輯
            $this->applyDataPermission($builder, $user);
            
            $duration = microtime(true) - $start;
            if ($duration > 0.05) { // 超過50ms記錄
                Log::debug('資料許可權查詢耗時', [
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

### 慢查詢分析

```php
// 在服務提供者中註冊查詢監聽器
class AppServiceProvider
{
    public function boot()
    {
        if (config('app.debug')) {
            DB::listen(function ($query) {
                if ($query->time > 100) { // 超過100ms
                    Log::warning('慢查詢檢測', [
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

## 配置最佳化建議

### Hyperf 框架配置

```php
// config/autoload/databases.php
return [
    'default' => [
        'driver' => 'mysql',
        'pool' => [
            'min_connections' => 5,     // 根據實際併發調整
            'max_connections' => 50,    // 避免連線過多
            'connect_timeout' => 10.0,
            'wait_timeout' => 3.0,
            'heartbeat' => -1,          // 停用心跳減少開銷
            'max_idle_time' => 60,      // 連線最大空閒時間
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

### 協程上下文最佳化

```php
// 在資料許可權上下文中新增協程安全機制
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

## 總結

當前 MineAdmin 資料許可權系統的最佳化重點應該放在：

1. **資料庫索引最佳化** - 為核心查詢欄位新增合適的索引
2. **查詢快取** - 對使用者策略和部門樹進行快取
3. **批次操作** - 最佳化多使用者許可權檢查的批次處理
4. **效能監控** - 新增查詢效能追蹤和告警
5. **協程安全** - 確保在 Hyperf 協程環境下的上下文安全

這些最佳化措施基於現有的程式碼結構，可以逐步實施以提升系統性能。