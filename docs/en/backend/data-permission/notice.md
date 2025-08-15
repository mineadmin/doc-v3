# Notes and Best Practices

This document provides important considerations, common pitfalls, and best practice guidelines for using the MineAdmin data permission system. Following these guidelines ensures system security, reliability, and performance.

## ❗ Key Considerations

### 1. Coroutine Context Isolation

::: danger Critical Warning

**Coroutine context isolation is a core security feature of the data permission system and must be strictly followed!**

:::

#### Issue Description

In the Hyperf coroutine environment, each coroutine has its own independent context space. Improper handling of coroutine contexts may lead to:

- **Data leakage**: User A's data being visible to User B
- **Privilege escalation**: Low-privilege users gaining high-privilege access
- **Data inconsistency**: The same user seeing different data across different requests

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

// ✅ Correct: Create a coroutine context management helper class
class CoroutineDataPermissionHelper
{
    public static function withContext(User $user, callable $callback): mixed
    {
        return co(function () use ($user, $callback) {
            // Set user-specific permission context
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
    // Dangerous! May use another coroutine's context
    $data = User::query()->get();
});

// ❌ Incorrect: Not resetting context in coroutine pool
for ($i = 0; $i < 10; $i++) {
    go(function () use ($i) {
        // Dangerous! Coroutine pool reuse may cause context pollution
        $user = User::find($i);
        // Missing Context reset
        $data = User::query()->get();
    });
}
```

### 2. Database Field Mapping

#### Ensure Correct Field Names

```php
// Source: Based on /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Attribute/DataScope.php
// ✅ Correct: Explicitly specify field names
#[DataScope(
    deptColumn: 'department_id',    // Ensure this field exists in the table
    createdByColumn: 'creator_id',  // Ensure this field exists in the table
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
    deptColumn: 'dept_id',          // If the actual field is 'department_id'
    createdByColumn: 'created_by'   // If the actual field is 'creator_id'
)]
public function getData(): Collection
{
    // Will cause SQL errors or permission failures
    return Order::query()->get();
}
```

## ⚠️ Security Warnings

### 1. Preventing Permission Bypass

::: warning Security Risk

The following behaviors may lead to permission bypass and must be avoided!

:::

```php
// ❌ Dangerous: Manually constructing SQL to bypass permission checks
$sql = "SELECT * FROM users WHERE dept_id = ?";
$users = DB::select($sql, [auth()->user()->dept_id]);

// ❌ Dangerous: Using whereRaw to bypass permission filtering
$users = User::whereRaw('1=1')->get();

// ❌ Dangerous: Not using permission control in admin interfaces
public function adminGetAllUsers(): Collection
{
    // Dangerous! Returns all user data directly
    return User::all();
}

// ✅ Secure: Always use the permission system
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

### 2. Input Validation and Sanitization

```php
// ✅ Secure: Validate user input
class SecurePermissionService
{
    public function getFilteredData(array $filters): Collection
    {
        // Validate input parameters
        $this->validateFilters($filters);
        
        // Use allowlist validation
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

### 3. Audit Logging

```php
// Source: Based on /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Factory.php
// ✅ Important: Enable logging for sensitive operations
#[DataScope(
    scopeType: ScopeType::CREATED_BY,
    onlyTables: ['financial_records']
)]
public function getFinancialData(): Collection
{
    // Log sensitive data access
    Log::info('Sensitive data access', [
        'user_id' => auth()->id(),
        'operation' => 'get_financial_data',
        'ip' => request()->ip(),
        'user_agent' => request()->userAgent(),
        'timestamp' => now()
    ]);
    
    return FinancialRecord::query()->get();
}

// ✅ Permission operation monitoring (recommended implementation)
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
            // Use most restrictive permissions when no policy exists
            Context::setScopeType(ScopeType::CREATED_BY);
            Context::setOnlyTables(['user']);
            return collect();
        }
        
        // Configure scope based on policy type
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

### 2. Error Handling Strategy

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
    fn() => $this->getBasicUserData()  // Fallback
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
            
            // Log performance metrics
            if ($executionTime > 100) { // Log if exceeds 100ms
                Log::warning('Data permission operation took too long', [
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
        
        // Test that user1 can only see their department's data
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

Before using the data permission system, use this checklist to ensure security:

### Configuration Check
- [ ] **Correct field mapping** - Ensure `deptColumn` and `createdByColumn` match actual table fields
- [ ] **Appropriate policy types** - Choose suitable `ScopeType` based on business needs
- [ ] **Clear table scope** - Use `onlyTables` to limit scope
- [ ] **Super admin check** - Confirm super admin bypass logic is correct

### Security Check
- [ ] **Coroutine context management** - Reset context for each new coroutine
- [ ] **Input validation** - Validate and sanitize all user input
- [ ] **Error handling** - Implement proper error handling and fallback strategies
- [ ] **Audit logging** - Enable detailed logging for sensitive operations

### Performance Check
- [ ] **Database indexes** - Create appropriate indexes for permission fields
- [ ] **Query optimization** - Avoid N+1 queries and unnecessary joins
- [ ] **Monitoring alerts** - Set up query performance monitoring

### Testing Check
- [ ] **Unit tests** - Write unit tests for various permission scenarios
- [ ] **Integration tests** - Test integration with other components
- [ ] **Boundary tests** - Test permission boundaries and edge cases

## Summary

The core of MineAdmin's data permission system lies in correctly configuring Context and DataScope annotations. Key points:

1. **Strict coroutine context management** - Prevent permission leaks
2. **Correct field mapping** - Ensure permission filtering works
3. **Follow least privilege principle** - Default to most restrictive permissions
4. **Comprehensive error handling** - Ensure system security in exceptional cases
5. **Thorough test coverage** - Validate correctness across permission scenarios

Following these considerations and best practices ensures the MineAdmin data permission system operates securely and efficiently in your application.