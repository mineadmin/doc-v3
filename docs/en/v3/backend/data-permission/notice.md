# Notes and Best Practices

This document provides important notes, common pitfalls, and best practices for using the MineAdmin data permission system. Following these guidelines ensures system security, reliability, and performance.

## ❗ Key Notes

### 1. Coroutine Context Isolation

::: danger Serious Warning

**Coroutine context isolation is a core security feature of the data permission system and must be strictly followed!**

:::

#### Problem Description

In the Hyperf coroutine environment, each coroutine has its own independent context space. Improper handling of coroutine context can lead to:

- **Data Leakage**: User A's data being seen by User B
- **Privilege Escalation**: Low-privilege users gaining high-privilege access
- **Data Inconsistency**: Same user seeing different data across different requests

#### Correct Approach

```php
// Source: Based on /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Context.php
use App\Library\DataPermission\Context;
use App\Library\DataPermission\ScopeType;

// ✅ Correct: Set context at the start of each coroutine
co(function () {
    // Set data permission context
    Context::setDeptColumn('dept_id');
    Context::setCreatedByColumn('created_by');
    Context::setScopeType(ScopeType::DEPT_CREATED_BY);
    Context::setOnlyTables(['user']);
    
    // Execute business logic
    $data = User::query()->get();
});

// ✅ Correct: Create coroutine context management helper class
class CoroutineDataPermissionHelper
{
    public static function withContext(User $user, callable $callback): mixed
    {
        return co(function () use ($user, $callback) {
            // Set user-related permission context
            self::setupContextForUser($user);
            
            // Execute callback
            return $callback();
        });
    }
    
    private static function setupContextForUser(User $user): void
    {
        Context::setDeptColumn('dept_id');
        Context::setCreatedByColumn('created_by');
        
        // Set permission scope based on user policy
        $policy = $user->getPolicy();
        if ($policy) {
            Context::setScopeType(ScopeType::DEPT_CREATED_BY);
        }
    }
}
```

#### Incorrect Approach

```php
// ❌ Incorrect: Sharing context across coroutines
$globalUser = auth()->user();
go(function () use ($globalUser) {
    // Dangerous! May use context from another coroutine
    $data = User::query()->get();
});

// ❌ Incorrect: Not resetting context in coroutine pool
for ($i = 0; $i < 10; $i++) {
    go(function () use ($i) {
        // Dangerous! Coroutine pool reuse may cause context pollution
        $user = User::find($i);
        // Missing Context re-setting
        $data = User::query()->get();
    });
}
```

### 2. Database Field Mapping

#### Ensure Field Names Are Correct

```php
// Source: Based on /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Attribute/DataScope.php
// ✅ Correct: Explicitly specify field names
#[DataScope(
    deptColumn: 'department_id',    // Ensure this field exists in the data table
    createdByColumn: 'creator_id',  // Ensure this field exists in the data table
    onlyTables: ['orders', 'customers'] // Only applies to specified tables
)]
public function getData(): Collection
{
    return Order::with('customer')->get();
}

// ✅ Correct: Validate field existence (recommended helper method)
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
        Log::error('Field validation failed', [
            'table' => $table,
            'fields' => $fields,
            'error' => $e->getMessage()
        ]);
        return false;
    }
}
```

#### Incorrect Approach

```php
// ❌ Incorrect: Using non-existent fields
#[DataScope(
    deptColumn: 'dept_id',          // If the table field is 'department_id'
    createdByColumn: 'created_by'   // If the table field is 'creator_id'
)]
public function getData(): Collection
{
    // Will cause SQL errors or permission failure
    return Order::query()->get();
}
```

## ⚠️ Security Warnings

### 1. Preventing Permission Bypass

::: warning Security Risk

The following behaviors may lead to permission bypass and must be avoided!

:::

```php
// ❌ Dangerous: Manually building SQL, bypassing permission checks
$sql = "SELECT * FROM users WHERE dept_id = ?";
$users = DB::select($sql, [auth()->user()->dept_id]);

// ❌ Dangerous: Using whereRaw to bypass permission filtering
$users = User::whereRaw('1=1')->get();

// ❌ Dangerous: Not using permission control in admin endpoints
public function adminGetAllUsers(): Collection
{
    // Dangerous! Returns all user data directly
    return User::all();
}

// ✅ Safe: Always use permission system
// Source: Based on /Users/zhuzhu/project/mineadmin/app/Service/Permission/UserService.php:94-98
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

### 2. Input Validation and Security Filtering

```php
// ✅ Safe: Validate user input
class SecurePermissionService
{
    public function getFilteredData(array $filters): Collection
    {
        // Validate input parameters
        $this->validateFilters($filters);
        
        // Use whitelist validation
        $allowedColumns = ['name', 'email', 'status'];
        $filters = array_intersect_key($filters, array_flip($allowedColumns));
        
        // Apply data permissions
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

### 3. Logging and Auditing

```php
// Source: Based on /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Factory.php
// ✅ Important: Enable logging for sensitive operations
#[DataScope(
    scopeType: ScopeType::CREATED_BY,
    onlyTables: ['financial_records']
)]
public function getFinancialData(): Collection
{
    // Record sensitive data access
    Log::info('Sensitive data access', [
        'user_id' => auth()->id(),
        'operation' => 'get_financial_data',
        'ip' => request()->ip(),
        'user_agent' => request()->userAgent(),
        'timestamp' => now()
    ]);
    
    return FinancialRecord::query()->get();
}

// ✅ Permission operation listener (recommended implementation)
class DataPermissionLogger
{
    public static function logPermissionAccess(User $user, string $operation): void
    {
        Log::info('Data permission access', [
            'user_id' => $user->id,
            'operation' => $operation,
            'policy' => $user->getPolicy()?->toArray(),
            'ip' => request()->ip(),
            'timestamp' => now()
        ]);
    }
}
```

## 🛡️ Best Practices

### 1. Permission Policy Design

#### Follow the Principle of Least Privilege

```php
// Source: Based on /Users/zhuzhu/project/mineadmin/app/Model/Permission/User.php:160-179
class DataPermissionService
{
    public function getDataByUserRole(User $user): Collection
    {
        // Get user policy
        $policy = $user->getPolicy();
        if (!$policy) {
            // Use most conservative permissions when no policy exists
            Context::setScopeType(ScopeType::CREATED_BY);
            Context::setOnlyTables(['user']);
            return collect();
        }
        
        // Set permission scope based on policy type
        $this->configureScopeByPolicy($policy);
        
        return User::query()->get();
    }
    
    private function configureScopeByPolicy($policy): void
    {
        Context::setDeptColumn('dept_id');
        Context::setCreatedByColumn('created_by');
        
        // Configure based on policy type
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

### 2. Error Handling Strategies

```php
// ✅ Best Practice: Graceful error handling
class SafeDataPermissionService
{
    public function executeWithFallback(callable $primaryAction, callable $fallbackAction = null): mixed
    {
        try {
            return $primaryAction();
        } catch (\Exception $e) {
            // Log permission-related errors
            Log::warning('Data permission operation failed', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            
            // Execute fallback strategy
            if ($fallbackAction) {
                return $fallbackAction();
            }
            
            return collect(); // Return empty collection
        }
    }
}

// Usage example
$service = new SafeDataPermissionService();

$data = $service->executeWithFallback(
    fn() => $this->getComplexDataWithPermissions(),
    fn() => $this->getBasicUserData()  // Fallback plan
);
```

### 3. Performance Optimization

```php
// ✅ Best Practice: Performance monitoring
class DataPermissionMonitor
{
    public function monitorExecution(callable $action, string $operationName): mixed
    {
        $startTime = microtime(true);
        
        try {
            $result = $action();
            
            $executionTime = (microtime(true) - $startTime) * 1000;
            
            // Record performance metrics
            if ($executionTime > 100) { // Log if exceeds 100ms
                Log::warning('Data permission operation is slow', [
                    'operation' => $operationName,
                    'execution_time' => $executionTime . 'ms',
                    'user_id' => auth()->id()
                ]);
            }
            
            return $result;
            
        } catch (\Throwable $e) {
            Log::error('Data permission operation exception', [
                'operation' => $operationName,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
}
```

### 4. Testing Best Practices

```php
// ✅ Best Practice: Permission testing
class DataPermissionTest extends TestCase
{
    public function test_department_isolation(): void
    {
        // Create test data
        $dept1 = Department::factory()->create();
        $dept2 = Department::factory()->create();
        
        $user1 = User::factory()->create(['dept_id' => $dept1->id]);
        $user2 = User::factory()->create(['dept_id' => $dept2->id]);
        
        $order1 = Order::factory()->create(['dept_id' => $dept1->id]);
        $order2 = Order::factory()->create(['dept_id' => $dept2->id]);
        
        // Test user1 can only see their own department's data
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
        // Source: Based on /Users/zhuzhu/project/mineadmin/app/Model/Permission/User.php:160-179
        $user = User::factory()->create();
        
        // Create user policy
        Policy::factory()->create([
            'user_id' => $user->id,
            'policy_type' => PolicyType::DeptSelf,
            'is_default' => true
        ]);
        
        // Verify policy retrieval
        $policy = $user->getPolicy();
        $this->assertNotNull($policy);
        $this->assertEquals(PolicyType::DeptSelf, $policy->policy_type);
    }
}
```

## 📝 Checklist

Before using the data permission system, use the following checklist to ensure system security:

### Configuration Check
- [ ] **Correct Field Mapping** - Ensure `deptColumn` and `createdByColumn` correspond to actual data table fields
- [ ] **Appropriate Policy Type** - Choose the correct `ScopeType` based on business requirements
- [ ] **Clear Table Scope** - Use `onlyTables` to limit scope
- [ ] **Super Admin Check** - Ensure super admin bypass logic is correct

### Security Check
- [ ] **Coroutine Context Management** - Reset context for each new coroutine
- [ ] **Input Validation** - Validate and sanitize all user input
- [ ] **Error Handling** - Implement proper error handling and fallback strategies
- [ ] **Logging and Auditing** - Enable detailed logging for sensitive operations

### Performance Check
- [ ] **Database Indexes** - Create appropriate indexes for permission fields
- [ ] **Query Optimization** - Avoid N+1 queries and unnecessary joins
- [ ] **Monitoring Alerts** - Set up query performance monitoring

### Test Check
- [ ] **Unit Tests** - Write unit tests for various permission scenarios
- [ ] **Integration Tests** - Test permission system integration with other components
- [ ] **Boundary Tests** - Test permission boundaries and edge cases

## Summary

The core of the MineAdmin data permission system lies in correctly configuring Context and DataScope annotations. Key points:

1. **Strictly Manage Coroutine Context** - Prevent permission leaks
2. **Correctly Configure Field Mapping** - Ensure permission filtering works
3. **Follow the Principle of Least Privilege** - Default to the most conservative permission policy
4. **Comprehensive Error Handling** - Ensure system security under exceptional conditions
5. **Thorough Test Coverage** - Verify correctness across various permission scenarios

Following these notes and best practices ensures the MineAdmin data permission system operates securely and efficiently in your application.