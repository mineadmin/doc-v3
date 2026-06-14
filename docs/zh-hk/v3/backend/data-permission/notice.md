# 注意事項與最佳實踐

本文檔提供使用 MineAdmin 數據權限系統的重要注意事項、常見陷阱和最佳實踐指南。遵循這些指導原則可以確保系統的安全性、可靠性和性能。

## ❗ 關鍵注意事項

### 1. 協程上下文隔離

::: danger 嚴重警告

**協程上下文隔離是數據權限系統的核心安全特性，必須嚴格遵守！**

:::

#### 問題描述

在 Hyperf 協程環境中，每個協程擁有獨立的上下文空間。如果不正確處理協程上下文，可能導致：

- **數據泄露**：用户 A 的數據被用户 B 看到
- **權限升級**：低權限用户獲得高權限訪問
- **數據不一致**：同一用户在不同請求中看到不同數據

#### 正確做法

```php
// 來源：基於 /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Context.php
use App\Library\DataPermission\Context;
use App\Library\DataPermission\ScopeType;

// ✅ 正確：在每個協程開始時設置上下文
co(function () {
    // 設置數據權限上下文
    Context::setDeptColumn('dept_id');
    Context::setCreatedByColumn('created_by');
    Context::setScopeType(ScopeType::DEPT_CREATED_BY);
    Context::setOnlyTables(['user']);
    
    // 執行業務邏輯
    $data = User::query()->get();
});

// ✅ 正確：創建協程上下文管理輔助類
class CoroutineDataPermissionHelper
{
    public static function withContext(User $user, callable $callback): mixed
    {
        return co(function () use ($user, $callback) {
            // 設置用户相關的權限上下文
            self::setupContextForUser($user);
            
            // 執行回調
            return $callback();
        });
    }
    
    private static function setupContextForUser(User $user): void
    {
        Context::setDeptColumn('dept_id');
        Context::setCreatedByColumn('created_by');
        
        // 根據用户策略設置權限範圍
        $policy = $user->getPolicy();
        if ($policy) {
            Context::setScopeType(ScopeType::DEPT_CREATED_BY);
        }
    }
}
```

#### 錯誤做法

```php
// ❌ 錯誤：跨協程共享上下文
$globalUser = auth()->user();
go(function () use ($globalUser) {
    // 危險！可能使用其他協程的上下文
    $data = User::query()->get();
});

// ❌ 錯誤：在協程池中不重新設置上下文
for ($i = 0; $i < 10; $i++) {
    go(function () use ($i) {
        // 危險！協程池複用可能導致上下文污染
        $user = User::find($i);
        // 缺少 Context 重新設置
        $data = User::query()->get();
    });
}
```

### 2. 數據庫字段映射

#### 確保字段名正確

```php
// 來源：基於 /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Attribute/DataScope.php
// ✅ 正確：明確指定字段名
#[DataScope(
    deptColumn: 'department_id',    // 確保數據表中有這個字段
    createdByColumn: 'creator_id',  // 確保數據表中有這個字段
    onlyTables: ['orders', 'customers'] // 只對指定表生效
)]
public function getData(): Collection
{
    return Order::with('customer')->get();
}

// ✅ 正確：驗證字段存在（建議的輔助方法）
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
        Log::error('字段驗證失敗', [
            'table' => $table,
            'fields' => $fields,
            'error' => $e->getMessage()
        ]);
        return false;
    }
}
```

#### 錯誤做法

```php
// ❌ 錯誤：使用不存在的字段
#[DataScope(
    deptColumn: 'dept_id',          // 如果表中字段是 'department_id'
    createdByColumn: 'created_by'   // 如果表中字段是 'creator_id'
)]
public function getData(): Collection
{
    // 會導致 SQL 錯誤或權限失效
    return Order::query()->get();
}
```

## ⚠️ 安全警告

### 1. 防止權限繞過

::: warning 安全風險

以下行為可能導致權限繞過，必須避免！

:::

```php
// ❌ 危險：手動構建 SQL，繞過權限檢查
$sql = "SELECT * FROM users WHERE dept_id = ?";
$users = DB::select($sql, [auth()->user()->dept_id]);

// ❌ 危險：使用 whereRaw 繞過權限過濾
$users = User::whereRaw('1=1')->get();

// ❌ 危險：在管理員接口不使用權限控制
public function adminGetAllUsers(): Collection
{
    // 危險！直接返回所有用户數據
    return User::all();
}

// ✅ 安全：始終使用權限系統
// 來源：基於 /Users/zhuzhu/project/mineadmin/app/Service/Permission/UserService.php:94-98
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

### 2. 輸入驗證和安全過濾

```php
// ✅ 安全：驗證用户輸入
class SecurePermissionService
{
    public function getFilteredData(array $filters): Collection
    {
        // 驗證輸入參數
        $this->validateFilters($filters);
        
        // 使用白名單驗證
        $allowedColumns = ['name', 'email', 'status'];
        $filters = array_intersect_key($filters, array_flip($allowedColumns));
        
        // 應用數據權限
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

### 3. 日誌審計

```php
// 來源：基於 /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Factory.php
// ✅ 重要：對敏感操作啓用日誌
#[DataScope(
    scopeType: ScopeType::CREATED_BY,
    onlyTables: ['financial_records']
)]
public function getFinancialData(): Collection
{
    // 記錄敏感數據訪問
    Log::info('敏感數據訪問', [
        'user_id' => auth()->id(),
        'operation' => 'get_financial_data',
        'ip' => request()->ip(),
        'user_agent' => request()->userAgent(),
        'timestamp' => now()
    ]);
    
    return FinancialRecord::query()->get();
}

// ✅ 權限操作監聽（建議實現）
class DataPermissionLogger
{
    public static function logPermissionAccess(User $user, string $operation): void
    {
        Log::info('數據權限訪問', [
            'user_id' => $user->id,
            'operation' => $operation,
            'policy' => $user->getPolicy()?->toArray(),
            'ip' => request()->ip(),
            'timestamp' => now()
        ]);
    }
}
```

## 🛡️ 最佳實踐

### 1. 權限策略設計

#### 遵循最小權限原則

```php
// 來源：基於 /Users/zhuzhu/project/mineadmin/app/Model/Permission/User.php:160-179
class DataPermissionService
{
    public function getDataByUserRole(User $user): Collection
    {
        // 獲取用户策略
        $policy = $user->getPolicy();
        if (!$policy) {
            // 無策略時使用最保守的權限
            Context::setScopeType(ScopeType::CREATED_BY);
            Context::setOnlyTables(['user']);
            return collect();
        }
        
        // 根據策略類型設置權限範圍
        $this->configureScopeByPolicy($policy);
        
        return User::query()->get();
    }
    
    private function configureScopeByPolicy($policy): void
    {
        Context::setDeptColumn('dept_id');
        Context::setCreatedByColumn('created_by');
        
        // 根據策略類型配置
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

### 2. 錯誤處理策略

```php
// ✅ 最佳實踐：優雅的錯誤處理
class SafeDataPermissionService
{
    public function executeWithFallback(callable $primaryAction, callable $fallbackAction = null): mixed
    {
        try {
            return $primaryAction();
        } catch (\Exception $e) {
            // 記錄權限相關錯誤
            Log::warning('數據權限操作失敗', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            
            // 執行回退策略
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

### 3. 性能優化

```php
// ✅ 最佳實踐：性能監控
class DataPermissionMonitor
{
    public function monitorExecution(callable $action, string $operationName): mixed
    {
        $startTime = microtime(true);
        
        try {
            $result = $action();
            
            $executionTime = (microtime(true) - $startTime) * 1000;
            
            // 記錄性能指標
            if ($executionTime > 100) { // 超過100ms記錄
                Log::warning('數據權限操作耗時較長', [
                    'operation' => $operationName,
                    'execution_time' => $executionTime . 'ms',
                    'user_id' => auth()->id()
                ]);
            }
            
            return $result;
            
        } catch (\Throwable $e) {
            Log::error('數據權限操作異常', [
                'operation' => $operationName,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
}
```

### 4. 測試最佳實踐

```php
// ✅ 最佳實踐：權限測試
class DataPermissionTest extends TestCase
{
    public function test_department_isolation(): void
    {
        // 創建測試數據
        $dept1 = Department::factory()->create();
        $dept2 = Department::factory()->create();
        
        $user1 = User::factory()->create(['dept_id' => $dept1->id]);
        $user2 = User::factory()->create(['dept_id' => $dept2->id]);
        
        $order1 = Order::factory()->create(['dept_id' => $dept1->id]);
        $order2 = Order::factory()->create(['dept_id' => $dept2->id]);
        
        // 測試用户1只能看到自己部門的數據
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
        // 來源：基於 /Users/zhuzhu/project/mineadmin/app/Model/Permission/User.php:160-179
        $user = User::factory()->create();
        
        // 創建用户策略
        Policy::factory()->create([
            'user_id' => $user->id,
            'policy_type' => PolicyType::DeptSelf,
            'is_default' => true
        ]);
        
        // 驗證策略獲取
        $policy = $user->getPolicy();
        $this->assertNotNull($policy);
        $this->assertEquals(PolicyType::DeptSelf, $policy->policy_type);
    }
}
```

## 📝 檢查清單

在使用數據權限系統前，請使用以下檢查清單確保系統安全：

### 配置檢查
- [ ] **字段映射正確** - 確保 `deptColumn` 和 `createdByColumn` 對應實際數據表字段
- [ ] **策略類型適當** - 根據業務需求選擇合適的 `ScopeType`
- [ ] **表範圍明確** - 使用 `onlyTables` 限制作用範圍
- [ ] **超級管理員檢查** - 確認超級管理員繞過邏輯正確

### 安全檢查
- [ ] **協程上下文管理** - 每個新協程都要重新設置上下文
- [ ] **輸入驗證** - 對所有用户輸入進行驗證和清洗
- [ ] **錯誤處理** - 實現適當的錯誤處理和回退策略
- [ ] **日誌審計** - 對敏感操作啓用詳細日誌記錄

### 性能檢查
- [ ] **數據庫索引** - 為權限字段創建適當的索引
- [ ] **查詢優化** - 避免 N+1 查詢和不必要的聯表操作
- [ ] **監控告警** - 設置查詢性能監控

### 測試檢查
- [ ] **單元測試** - 編寫各種權限場景的單元測試
- [ ] **集成測試** - 測試權限系統與其他組件的集成
- [ ] **邊界測試** - 測試權限邊界和異常情況

## 總結

MineAdmin 數據權限系統的核心在於正確配置 Context 和 DataScope 註解。關鍵要點：

1. **嚴格管理協程上下文** - 避免權限泄露
2. **正確配置字段映射** - 確保權限過濾生效
3. **遵循最小權限原則** - 默認使用最保守的權限策略
4. **充分的錯誤處理** - 確保系統在異常情況下的安全性
5. **完善的測試覆蓋** - 驗證各種權限場景的正確性

遵循這些注意事項和最佳實踐，可以確保 MineAdmin 數據權限系統在您的應用中安全、高效地運行。