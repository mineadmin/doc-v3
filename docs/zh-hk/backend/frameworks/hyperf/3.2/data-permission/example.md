# 使用示例

在代碼中使用數據權限，目前支持多種方式進行動態開啓與關閉。以下舉幾種常見的開發案例

## 對整個模型進行數據權限控制

以默認的 `User` 模型為例，假設我們需要對 `User` 模型進行數據權限控制。

可以在 `User` 模型中 use `DataScopes` trait 來啓用數據權限作用域。

```php
// /mineadmin/app/Library/DataPermission/Scope/DataScope.php
use App\Library\DataPermission\Scope\DataScopes;

class User extends Model {
    // 使用數據權限作用域
    use DataScopes;

    // 其他代碼...
}
```

這樣會使所有對 `User` 模型的查詢都自動應用數據權限控制。

## 對某個代碼塊進行數據權限控制

得益於 Hyperf AOP 特性，我們可以在類或者類方法上使用 [DataScope](https://github.com/mineadmin/MineAdmin/blob/master-department/app/Library/DataPermission/Attribute/DataScope.php) 註解來對指定的代碼塊開啓數據權限控制。 

以自帶的用户模塊的[分頁列表](https://github.com/mineadmin/MineAdmin/blob/master-department/app/Service/Permission/UserService.php#L93~L100)為例

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

這樣在調用 `page` 方法時，數據權限會自動應用到查詢中。

## 對指定的 ORM Query 進行權限控制

在某些特定場景中，需要更加細化的進行權限隔離。此時可以通過 `Factory::make()->build()` 方法來對指定的 Query 進行限制

```php
// 手動使用 Factory 進行權限過濾
use App\Library\DataPermission\Factory;
use App\Model\Permission\User;

class DemoService {

    public function test(User $user): void {
        $userQuery = User::query();
        
        // 對 UserQuery 單獨進行數據隔離拼接
        Factory::make()->build($userQuery->getQuery(), $user);
        
        $result = $userQuery->get();
    }
}
```

## 使用 Context 配置數據權限

### 基本配置方式

```php
// /mineadmin/app/Library/DataPermission/Context.php
use App\Library\DataPermission\Context;
use App\Library\DataPermission\ScopeType;

// 設置部門字段名稱
Context::setDeptColumn('department_id');
// 設置創建人字段名稱
Context::setCreatedByColumn('creator');
// 設置隔離方式
Context::setScopeType(ScopeType::DEPT_CREATED_BY);
// 只對指定表進行數據隔離
Context::setOnlyTables(['user', 'orders']);

$query = User::query();
Factory::make()->build($query->getQuery(), $user);
```

### DataScope 註解完整配置

```php
// /mineadmin/app/Library/DataPermission/Attribute/DataScope.php
#[DataScope(
    // 部門字段名稱（默認：dept_id）
    deptColumn: 'department_id',
    
    // 創建人字段名稱（默認：created_by）
    createdByColumn: 'creator_id',
    
    // 隔離方式（默認：ScopeType::DEPT_CREATED_BY）
    scopeType: ScopeType::DEPT_SELF,
    
    // 只對指定表生效（默認：null，對所有表生效）
    onlyTables: ['orders', 'order_items']
)]
public function getFilteredData(): Collection
{
    return Order::with('items')->get();
}
```

## 策略類型使用示例

### DEPT_SELF - 本部門權限

```php
// 來源：基於 /Users/zhuzhu/project/mineadmin/app/Model/Enums/DataPermission/PolicyType.php
#[DataScope(scopeType: ScopeType::DEPT)]
public function getDepartmentUsers(): Collection
{
    // 自動過濾為當前用户所在部門的用户
    return User::query()->get();
}
```

### DEPT_TREE - 部門樹權限  

```php
#[DataScope(scopeType: ScopeType::DEPT)]
public function getDepartmentTreeUsers(): Collection
{
    // 自動包含當前部門及所有子部門的用户
    return User::query()->get();
}
```

### CREATED_BY - 創建人權限

```php
#[DataScope(scopeType: ScopeType::CREATED_BY)]
public function getMyCreatedData(): Collection
{
    // 只返回當前用户創建的數據
    return Document::query()->get();
}
```

### 組合權限使用

```php
// AND 條件：既要是本部門，又要是自己創建的
#[DataScope(scopeType: ScopeType::DEPT_CREATED_BY)]
public function getMyDeptData(): Collection
{
    return Document::query()->get();
}

// OR 條件：本部門的或者自己創建的
#[DataScope(scopeType: ScopeType::DEPT_OR_CREATED_BY)]
public function getDeptOrMyData(): Collection
{
    return Document::query()->get();
}
```

## 自定義函數策略

### 創建自定義函數

```php
// /mineadmin/config/autoload/department/custom.php
return [
    'my_custom_filter' => function (Builder $builder, ScopeType $scopeType, Policy $policy, User $user) {
        // 自定義業務邏輯
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

### 使用自定義函數

要使用自定義函數，需要設置策略類型為 `CUSTOM_FUNC` 並在策略的 `value` 字段中指定函數名：

```php
// 在數據庫中創建策略記錄
Policy::create([
    'user_id' => $userId,
    'policy_type' => PolicyType::CustomFunc,
    'value' => ['my_custom_filter'],  // 自定義函數名
    'is_default' => true
]);
```

## 數據權限結合業務場景

### 訂單管理系統

```php
class OrderService 
{
    // 普通員工只能看到自己創建的訂單
    #[DataScope(
        scopeType: ScopeType::CREATED_BY,
        onlyTables: ['orders']
    )]
    public function getMyOrders(): Collection
    {
        return Order::query()->get();
    }
    
    // 部門經理可以看到整個部門的訂單
    #[DataScope(
        scopeType: ScopeType::DEPT,
        onlyTables: ['orders']
    )]
    public function getDepartmentOrders(): Collection
    {
        return Order::query()->get();
    }
    
    // 區域經理可以看到部門樹的所有訂單
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

### 文檔管理系統

```php
class DocumentService
{
    // 文檔權限：部門共享 + 個人私有
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

## 多表關聯查詢

當涉及多表關聯時，可以指定 `onlyTables` 參數來控制哪些表應用數據權限：

```php
#[DataScope(
    scopeType: ScopeType::DEPT_SELF,
    onlyTables: ['orders']  // 只對 orders 表應用權限過濾
)]
public function getOrdersWithCustomers(): Collection
{
    return Order::query()
                ->join('customers', 'orders.customer_id', '=', 'customers.id')
                ->select('orders.*', 'customers.name as customer_name')
                ->get();
}
```

## 注意事項

::: warning 協程上下文

需要注意，不管哪種使用方式。如果新開一個協程，都要重新設置一遍才能起效

```php
// ❌ 錯誤：協程中權限丟失
Co::create(function () {
    // 權限配置已丟失，可能返回錯誤數據
    $data = User::query()->get();
});

// ✅ 正確：重新設置協程權限
Co::create(function () use ($user) {
    // 需要重新設置上下文
    Context::setDeptColumn('dept_id');
    Context::setCreatedByColumn('created_by');
    Context::setScopeType(ScopeType::DEPT_SELF);
    
    $data = User::query()->get();
});
```

:::

## 完整 API 參考

### DataScope 註解參數

| 參數 | 類型 | 默認值 | 説明 |
|------|------|--------|------|
| `deptColumn` | string | `'dept_id'` | 部門字段名稱 |
| `createdByColumn` | string | `'created_by'` | 創建人字段名稱 |
| `scopeType` | ScopeType | `ScopeType::DEPT_CREATED_BY` | 權限範圍類型 |
| `onlyTables` | array\|null | `null` | 只對指定表生效，null則對所有表生效 |

### Context 類方法

| 方法 | 説明 |
|------|------|
| `Context::setDeptColumn(string)` | 設置部門字段名 |
| `Context::setCreatedByColumn(string)` | 設置創建人字段名 |
| `Context::setScopeType(ScopeType)` | 設置權限範圍類型 |
| `Context::setOnlyTables(array)` | 設置只對指定表生效 |
| `Context::getDeptColumn()` | 獲取部門字段名 |
| `Context::getCreatedByColumn()` | 獲取創建人字段名 |
| `Context::getScopeType()` | 獲取權限範圍類型 |
| `Context::getOnlyTables()` | 獲取指定表列表 |

### Factory 類方法

| 方法 | 説明 |
|------|------|
| `Factory::make()` | 創建工廠實例 |
| `Factory::build(Builder, User)` | 對查詢構建器應用權限過濾 |

### ScopeType 枚舉值

| 值 | 説明 |
|----|------|
| `ScopeType::DEPT` | 只根據部門過濾 |
| `ScopeType::CREATED_BY` | 只根據創建人過濾 |
| `ScopeType::DEPT_CREATED_BY` | 根據部門 AND 創建人過濾 |
| `ScopeType::DEPT_OR_CREATED_BY` | 根據部門 OR 創建人過濾 |

### PolicyType 枚舉值

| 值 | 説明 |
|----|------|
| `PolicyType::DeptSelf` | 本部門 |
| `PolicyType::DeptTree` | 本部門及子部門 |
| `PolicyType::All` | 全部數據 |
| `PolicyType::Self` | 僅本人 |
| `PolicyType::CustomDept` | 自定義部門 |
| `PolicyType::CustomFunc` | 自定義函數 |