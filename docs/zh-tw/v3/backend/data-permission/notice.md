# 注意事項與最佳實踐

本文件提供使用 MineAdmin 資料許可權系統的重要注意事項、常見陷阱和最佳實踐指南。遵循這些指導原則可以確保系統的安全性、可靠性和效能。

## ❗ 關鍵注意事項

### 1. 協程上下文隔離

::: danger 嚴重警告

**協程上下文隔離是資料許可權系統的核心安全特性，必須嚴格遵守！**

:::

#### 問題描述

在 Hyperf 協程環境中，每個協程擁有獨立的上下文空間。如果不正確處理協程上下文，可能導致：

- **資料洩露**：使用者 A 的資料被使用者 B 看到
- **許可權升級**：低許可權使用者獲得高許可權訪問
- **資料不一致**：同一使用者在不同請求中看到不同資料

#### 正確做法

```php
// 來源：基於 /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Context.php
use App\Library\DataPermission\Context;
use App\Library\DataPermission\ScopeType;

// ✅ 正確：在每個協程開始時設定上下文
co(function () {
    // 設定資料許可權上下文
    Context::setDeptColumn('dept_id');
    Context::setCreatedByColumn('created_by');
    Context::setScopeType(ScopeType::DEPT_CREATED_BY);
    Context::setOnlyTables(['user']);
    
    // 執行業務邏輯
    $data = User::query()->get();
});

// ✅ 正確：建立協程上下文管理輔助類
class CoroutineDataPermissionHelper
{
    public static function withContext(User $user, callable $callback): mixed
    {
        return co(function () use ($user, $callback) {
            // 設定使用者相關的許可權上下文
            self::setupContextForUser($user);
            
            // 執行回撥
            return $callback();
        });
    }
    
    private static function setupContextForUser(User $user): void
    {
        Context::setDeptColumn('dept_id');
        Context::setCreatedByColumn('created_by');
        
        // 根據使用者策略設定許可權範圍
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

// ❌ 錯誤：在協程池中不重新設定上下文
for ($i = 0; $i < 10; $i++) {
    go(function () use ($i) {
        // 危險！協程池複用可能導致上下文汙染
        $user = User::find($i);
        // 缺少 Context 重新設定
        $data = User::query()->get();
    });
}
```

### 2. 資料庫欄位對映

#### 確保欄位名正確

```php
// 來源：基於 /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Attribute/DataScope.php
// ✅ 正確：明確指定欄位名
#[DataScope(
    deptColumn: 'department_id',    // 確保資料表中有這個欄位
    createdByColumn: 'creator_id',  // 確保資料表中有這個欄位
    onlyTables: ['orders', 'customers'] // 只對指定表生效
)]
public function getData(): Collection
{
    return Order::with('customer')->get();
}

// ✅ 正確：驗證欄位存在（建議的輔助方法）
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
        Log::error('欄位驗證失敗', [
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
// ❌ 錯誤：使用不存在的欄位
#[DataScope(
    deptColumn: 'dept_id',          // 如果表中欄位是 'department_id'
    createdByColumn: 'created_by'   // 如果表中欄位是 'creator_id'
)]
public function getData(): Collection
{
    // 會導致 SQL 錯誤或許可權失效
    return Order::query()->get();
}
```

## ⚠️ 安全警告

### 1. 防止許可權繞過

::: warning 安全風險

以下行為可能導致許可權繞過，必須避免！

:::

```php
// ❌ 危險：手動構建 SQL，繞過許可權檢查
$sql = "SELECT * FROM users WHERE dept_id = ?";
$users = DB::select($sql, [auth()->user()->dept_id]);

// ❌ 危險：使用 whereRaw 繞過許可權過濾
$users = User::whereRaw('1=1')->get();

// ❌ 危險：在管理員介面不使用許可權控制
public function adminGetAllUsers(): Collection
{
    // 危險！直接返回所有使用者資料
    return User::all();
}

// ✅ 安全：始終使用許可權系統
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
// ✅ 安全：驗證使用者輸入
class SecurePermissionService
{
    public function getFilteredData(array $filters): Collection
    {
        // 驗證輸入引數
        $this->validateFilters($filters);
        
        // 使用白名單驗證
        $allowedColumns = ['name', 'email', 'status'];
        $filters = array_intersect_key($filters, array_flip($allowedColumns));
        
        // 應用資料許可權
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
// ✅ 重要：對敏感操作啟用日誌
#[DataScope(
    scopeType: ScopeType::CREATED_BY,
    onlyTables: ['financial_records']
)]
public function getFinancialData(): Collection
{
    // 記錄敏感資料訪問
    Log::info('敏感資料訪問', [
        'user_id' => auth()->id(),
        'operation' => 'get_financial_data',
        'ip' => request()->ip(),
        'user_agent' => request()->userAgent(),
        'timestamp' => now()
    ]);
    
    return FinancialRecord::query()->get();
}

// ✅ 許可權操作監聽（建議實現）
class DataPermissionLogger
{
    public static function logPermissionAccess(User $user, string $operation): void
    {
        Log::info('資料許可權訪問', [
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

### 1. 許可權策略設計

#### 遵循最小許可權原則

```php
// 來源：基於 /Users/zhuzhu/project/mineadmin/app/Model/Permission/User.php:160-179
class DataPermissionService
{
    public function getDataByUserRole(User $user): Collection
    {
        // 獲取使用者策略
        $policy = $user->getPolicy();
        if (!$policy) {
            // 無策略時使用最保守的許可權
            Context::setScopeType(ScopeType::CREATED_BY);
            Context::setOnlyTables(['user']);
            return collect();
        }
        
        // 根據策略型別設定許可權範圍
        $this->configureScopeByPolicy($policy);
        
        return User::query()->get();
    }
    
    private function configureScopeByPolicy($policy): void
    {
        Context::setDeptColumn('dept_id');
        Context::setCreatedByColumn('created_by');
        
        // 根據策略型別配置
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
            // 記錄許可權相關錯誤
            Log::warning('資料許可權操作失敗', [
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

### 3. 效能最佳化

```php
// ✅ 最佳實踐：效能監控
class DataPermissionMonitor
{
    public function monitorExecution(callable $action, string $operationName): mixed
    {
        $startTime = microtime(true);
        
        try {
            $result = $action();
            
            $executionTime = (microtime(true) - $startTime) * 1000;
            
            // 記錄效能指標
            if ($executionTime > 100) { // 超過100ms記錄
                Log::warning('資料許可權操作耗時較長', [
                    'operation' => $operationName,
                    'execution_time' => $executionTime . 'ms',
                    'user_id' => auth()->id()
                ]);
            }
            
            return $result;
            
        } catch (\Throwable $e) {
            Log::error('資料許可權操作異常', [
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
// ✅ 最佳實踐：許可權測試
class DataPermissionTest extends TestCase
{
    public function test_department_isolation(): void
    {
        // 建立測試資料
        $dept1 = Department::factory()->create();
        $dept2 = Department::factory()->create();
        
        $user1 = User::factory()->create(['dept_id' => $dept1->id]);
        $user2 = User::factory()->create(['dept_id' => $dept2->id]);
        
        $order1 = Order::factory()->create(['dept_id' => $dept1->id]);
        $order2 = Order::factory()->create(['dept_id' => $dept2->id]);
        
        // 測試使用者1只能看到自己部門的資料
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
        
        // 建立使用者策略
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

在使用資料許可權系統前，請使用以下檢查清單確保系統安全：

### 配置檢查
- [ ] **欄位對映正確** - 確保 `deptColumn` 和 `createdByColumn` 對應實際資料表字段
- [ ] **策略型別適當** - 根據業務需求選擇合適的 `ScopeType`
- [ ] **表範圍明確** - 使用 `onlyTables` 限制作用範圍
- [ ] **超級管理員檢查** - 確認超級管理員繞過邏輯正確

### 安全檢查
- [ ] **協程上下文管理** - 每個新協程都要重新設定上下文
- [ ] **輸入驗證** - 對所有使用者輸入進行驗證和清洗
- [ ] **錯誤處理** - 實現適當的錯誤處理和回退策略
- [ ] **日誌審計** - 對敏感操作啟用詳細日誌記錄

### 效能檢查
- [ ] **資料庫索引** - 為許可權欄位建立適當的索引
- [ ] **查詢最佳化** - 避免 N+1 查詢和不必要的聯表操作
- [ ] **監控告警** - 設定查詢效能監控

### 測試檢查
- [ ] **單元測試** - 編寫各種許可權場景的單元測試
- [ ] **整合測試** - 測試許可權系統與其他元件的整合
- [ ] **邊界測試** - 測試許可權邊界和異常情況

## 總結

MineAdmin 資料許可權系統的核心在於正確配置 Context 和 DataScope 註解。關鍵要點：

1. **嚴格管理協程上下文** - 避免許可權洩露
2. **正確配置欄位對映** - 確保許可權過濾生效
3. **遵循最小許可權原則** - 預設使用最保守的許可權策略
4. **充分的錯誤處理** - 確保系統在異常情況下的安全性
5. **完善的測試覆蓋** - 驗證各種許可權場景的正確性

遵循這些注意事項和最佳實踐，可以確保 MineAdmin 資料許可權系統在您的應用中安全、高效地執行。