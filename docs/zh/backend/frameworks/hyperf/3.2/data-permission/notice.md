# 注意事项与最佳实践

本文档提供使用 MineAdmin 数据权限系统的重要注意事项、常见陷阱和最佳实践指南。遵循这些指导原则可以确保系统的安全性、可靠性和性能。

## ❗ 关键注意事项

### 1. 协程上下文隔离

::: danger 严重警告

**协程上下文隔离是数据权限系统的核心安全特性，必须严格遵守！**

:::

#### 问题描述

在 Hyperf 协程环境中，每个协程拥有独立的上下文空间。如果不正确处理协程上下文，可能导致：

- **数据泄露**：用户 A 的数据被用户 B 看到
- **权限升级**：低权限用户获得高权限访问
- **数据不一致**：同一用户在不同请求中看到不同数据

#### 正确做法

```php
// 来源：基于 /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Context.php
use App\Library\DataPermission\Context;
use App\Library\DataPermission\ScopeType;

// ✅ 正确：在每个协程开始时设置上下文
co(function () {
    // 设置数据权限上下文
    Context::setDeptColumn('dept_id');
    Context::setCreatedByColumn('created_by');
    Context::setScopeType(ScopeType::DEPT_CREATED_BY);
    Context::setOnlyTables(['user']);
    
    // 执行业务逻辑
    $data = User::query()->get();
});

// ✅ 正确：创建协程上下文管理辅助类
class CoroutineDataPermissionHelper
{
    public static function withContext(User $user, callable $callback): mixed
    {
        return co(function () use ($user, $callback) {
            // 设置用户相关的权限上下文
            self::setupContextForUser($user);
            
            // 执行回调
            return $callback();
        });
    }
    
    private static function setupContextForUser(User $user): void
    {
        Context::setDeptColumn('dept_id');
        Context::setCreatedByColumn('created_by');
        
        // 根据用户策略设置权限范围
        $policy = $user->getPolicy();
        if ($policy) {
            Context::setScopeType(ScopeType::DEPT_CREATED_BY);
        }
    }
}
```

#### 错误做法

```php
// ❌ 错误：跨协程共享上下文
$globalUser = auth()->user();
go(function () use ($globalUser) {
    // 危险！可能使用其他协程的上下文
    $data = User::query()->get();
});

// ❌ 错误：在协程池中不重新设置上下文
for ($i = 0; $i < 10; $i++) {
    go(function () use ($i) {
        // 危险！协程池复用可能导致上下文污染
        $user = User::find($i);
        // 缺少 Context 重新设置
        $data = User::query()->get();
    });
}
```

### 2. 数据库字段映射

#### 确保字段名正确

```php
// 来源：基于 /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Attribute/DataScope.php
// ✅ 正确：明确指定字段名
#[DataScope(
    deptColumn: 'department_id',    // 确保数据表中有这个字段
    createdByColumn: 'creator_id',  // 确保数据表中有这个字段
    onlyTables: ['orders', 'customers'] // 只对指定表生效
)]
public function getData(): Collection
{
    return Order::with('customer')->get();
}

// ✅ 正确：验证字段存在（建议的辅助方法）
function validatePermissionFields(string $table, array $fields): bool
{
    try {
        $schema = DB::connection()->getSchemaBuilder()->getColumnListing($table);
        
        foreach ($fields as $field) {
            if (!in_array($field, $schema)) {
                throw new \InvalidArgumentException(
                    "Field '{$field}' does not exist in table '{$table}'"
                );
            }
        }
        
        return true;
    } catch (\Exception $e) {
        Log::error('字段验证失败', [
            'table' => $table,
            'fields' => $fields,
            'error' => $e->getMessage()
        ]);
        return false;
    }
}
```

#### 错误做法

```php
// ❌ 错误：使用不存在的字段
#[DataScope(
    deptColumn: 'dept_id',          // 如果表中字段是 'department_id'
    createdByColumn: 'created_by'   // 如果表中字段是 'creator_id'
)]
public function getData(): Collection
{
    // 会导致 SQL 错误或权限失效
    return Order::query()->get();
}
```

## ⚠️ 安全警告

### 1. 防止权限绕过

::: warning 安全风险

以下行为可能导致权限绕过，必须避免！

:::

```php
// ❌ 危险：手动构建 SQL，绕过权限检查
$sql = "SELECT * FROM users WHERE dept_id = ?";
$users = DB::select($sql, [auth()->user()->dept_id]);

// ❌ 危险：使用 whereRaw 绕过权限过滤
$users = User::whereRaw('1=1')->get();

// ❌ 危险：在管理员接口不使用权限控制
public function adminGetAllUsers(): Collection
{
    // 危险！直接返回所有用户数据
    return User::all();
}

// ✅ 安全：始终使用权限系统
// 来源：基于 /Users/zhuzhu/project/mineadmin/app/Service/Permission/UserService.php:94-98
#[DataScope(
    scopeType: ScopeType::CREATED_BY,
    onlyTables: ['user'],
    createdByColumn: 'id'
)]
public function adminGetAllUsers(): Collection
{
    return User::query()->get();
}
```

### 2. 输入验证和安全过滤

```php
// ✅ 安全：验证用户输入
class SecurePermissionService
{
    public function getFilteredData(array $filters): Collection
    {
        // 验证输入参数
        $this->validateFilters($filters);
        
        // 使用白名单验证
        $allowedColumns = ['name', 'email', 'status'];
        $filters = array_intersect_key($filters, array_flip($allowedColumns));
        
        // 应用数据权限
        Context::setDeptColumn('dept_id');
        Context::setCreatedByColumn('created_by');
        Context::setScopeType(ScopeType::DEPT_CREATED_BY);
        
        return User::query()
                   ->when($filters['name'] ?? null, fn($q, $name) => $q->where('name', 'like', "%{$name}%"))
                   ->when($filters['status'] ?? null, fn($q, $status) => $q->where('status', $status))
                   ->get();
    }
    
    private function validateFilters(array $filters): void
    {
        foreach ($filters as $key => $value) {
            if (!in_array($key, ['name', 'email', 'status'])) {
                throw new \InvalidArgumentException("Invalid filter: {$key}");
            }
        }
    }
}
```

### 3. 日志审计

```php
// 来源：基于 /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Factory.php
// ✅ 重要：对敏感操作启用日志
#[DataScope(
    scopeType: ScopeType::CREATED_BY,
    onlyTables: ['financial_records']
)]
public function getFinancialData(): Collection
{
    // 记录敏感数据访问
    Log::info('敏感数据访问', [
        'user_id' => auth()->id(),
        'operation' => 'get_financial_data',
        'ip' => request()->ip(),
        'user_agent' => request()->userAgent(),
        'timestamp' => now()
    ]);
    
    return FinancialRecord::query()->get();
}

// ✅ 权限操作监听（建议实现）
class DataPermissionLogger
{
    public static function logPermissionAccess(User $user, string $operation): void
    {
        Log::info('数据权限访问', [
            'user_id' => $user->id,
            'operation' => $operation,
            'policy' => $user->getPolicy()?->toArray(),
            'ip' => request()->ip(),
            'timestamp' => now()
        ]);
    }
}
```

## 🛡️ 最佳实践

### 1. 权限策略设计

#### 遵循最小权限原则

```php
// 来源：基于 /Users/zhuzhu/project/mineadmin/app/Model/Permission/User.php:160-179
class DataPermissionService
{
    public function getDataByUserRole(User $user): Collection
    {
        // 获取用户策略
        $policy = $user->getPolicy();
        if (!$policy) {
            // 无策略时使用最保守的权限
            Context::setScopeType(ScopeType::CREATED_BY);
            Context::setOnlyTables(['user']);
            return collect();
        }
        
        // 根据策略类型设置权限范围
        $this->configureScopeByPolicy($policy);
        
        return User::query()->get();
    }
    
    private function configureScopeByPolicy($policy): void
    {
        Context::setDeptColumn('dept_id');
        Context::setCreatedByColumn('created_by');
        
        // 根据策略类型配置
        match($policy->policy_type->value) {
            'ALL' => Context::setScopeType(ScopeType::DEPT),
            'DEPT_TREE' => Context::setScopeType(ScopeType::DEPT_CREATED_BY),
            'DEPT_SELF' => Context::setScopeType(ScopeType::DEPT_CREATED_BY),
            'SELF' => Context::setScopeType(ScopeType::CREATED_BY),
            default => Context::setScopeType(ScopeType::CREATED_BY)
        };
    }
}
```

### 2. 错误处理策略

```php
// ✅ 最佳实践：优雅的错误处理
class SafeDataPermissionService
{
    public function executeWithFallback(callable $primaryAction, callable $fallbackAction = null): mixed
    {
        try {
            return $primaryAction();
        } catch (\Exception $e) {
            // 记录权限相关错误
            Log::warning('数据权限操作失败', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            
            // 执行回退策略
            if ($fallbackAction) {
                return $fallbackAction();
            }
            
            return collect(); // 返回空集合
        }
    }
}

// 使用示例
$service = new SafeDataPermissionService();

$data = $service->executeWithFallback(
    fn() => $this->getComplexDataWithPermissions(),
    fn() => $this->getBasicUserData()  // 回退方案
);
```

### 3. 性能优化

```php
// ✅ 最佳实践：性能监控
class DataPermissionMonitor
{
    public function monitorExecution(callable $action, string $operationName): mixed
    {
        $startTime = microtime(true);
        
        try {
            $result = $action();
            
            $executionTime = (microtime(true) - $startTime) * 1000;
            
            // 记录性能指标
            if ($executionTime > 100) { // 超过100ms记录
                Log::warning('数据权限操作耗时较长', [
                    'operation' => $operationName,
                    'execution_time' => $executionTime . 'ms',
                    'user_id' => auth()->id()
                ]);
            }
            
            return $result;
            
        } catch (\Throwable $e) {
            Log::error('数据权限操作异常', [
                'operation' => $operationName,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
}
```

### 4. 测试最佳实践

```php
// ✅ 最佳实践：权限测试
class DataPermissionTest extends TestCase
{
    public function test_department_isolation(): void
    {
        // 创建测试数据
        $dept1 = Department::factory()->create();
        $dept2 = Department::factory()->create();
        
        $user1 = User::factory()->create(['dept_id' => $dept1->id]);
        $user2 = User::factory()->create(['dept_id' => $dept2->id]);
        
        $order1 = Order::factory()->create(['dept_id' => $dept1->id]);
        $order2 = Order::factory()->create(['dept_id' => $dept2->id]);
        
        // 测试用户1只能看到自己部门的数据
        $this->actingAs($user1);
        
        Context::setDeptColumn('dept_id');
        Context::setScopeType(ScopeType::DEPT);
        Context::setOnlyTables(['orders']);
        
        $results = Order::query()->get();
        
        $this->assertCount(1, $results);
        $this->assertEquals($order1->id, $results->first()->id);
    }
    
    public function test_user_policy_application(): void
    {
        // 来源：基于 /Users/zhuzhu/project/mineadmin/app/Model/Permission/User.php:160-179
        $user = User::factory()->create();
        
        // 创建用户策略
        Policy::factory()->create([
            'user_id' => $user->id,
            'policy_type' => PolicyType::DeptSelf,
            'is_default' => true
        ]);
        
        // 验证策略获取
        $policy = $user->getPolicy();
        $this->assertNotNull($policy);
        $this->assertEquals(PolicyType::DeptSelf, $policy->policy_type);
    }
}
```

## 📝 检查清单

在使用数据权限系统前，请使用以下检查清单确保系统安全：

### 配置检查
- [ ] **字段映射正确** - 确保 `deptColumn` 和 `createdByColumn` 对应实际数据表字段
- [ ] **策略类型适当** - 根据业务需求选择合适的 `ScopeType`
- [ ] **表范围明确** - 使用 `onlyTables` 限制作用范围
- [ ] **超级管理员检查** - 确认超级管理员绕过逻辑正确

### 安全检查
- [ ] **协程上下文管理** - 每个新协程都要重新设置上下文
- [ ] **输入验证** - 对所有用户输入进行验证和清洗
- [ ] **错误处理** - 实现适当的错误处理和回退策略
- [ ] **日志审计** - 对敏感操作启用详细日志记录

### 性能检查
- [ ] **数据库索引** - 为权限字段创建适当的索引
- [ ] **查询优化** - 避免 N+1 查询和不必要的联表操作
- [ ] **监控告警** - 设置查询性能监控

### 测试检查
- [ ] **单元测试** - 编写各种权限场景的单元测试
- [ ] **集成测试** - 测试权限系统与其他组件的集成
- [ ] **边界测试** - 测试权限边界和异常情况

## 总结

MineAdmin 数据权限系统的核心在于正确配置 Context 和 DataScope 注解。关键要点：

1. **严格管理协程上下文** - 避免权限泄露
2. **正确配置字段映射** - 确保权限过滤生效
3. **遵循最小权限原则** - 默认使用最保守的权限策略
4. **充分的错误处理** - 确保系统在异常情况下的安全性
5. **完善的测试覆盖** - 验证各种权限场景的正确性

遵循这些注意事项和最佳实践，可以确保 MineAdmin 数据权限系统在您的应用中安全、高效地运行。