# 使用示例

在程式碼中使用資料許可權，目前支援多種方式進行動態開啟與關閉。以下舉幾種常見的開發案例

## 對整個模型進行資料許可權控制

以預設的 `User` 模型為例，假設我們需要對 `User` 模型進行資料許可權控制。

可以在 `User` 模型中 use `DataScopes` trait 來啟用資料許可權作用域。

```php
// /mineadmin/app/Library/DataPermission/Scope/DataScope.php
use App\Library\DataPermission\Scope\DataScopes;

class User extends Model {
    // 使用資料許可權作用域
    use DataScopes;

    // 其他程式碼...
}
```

這樣會使所有對 `User` 模型的查詢都自動應用資料許可權控制。

## 對某個程式碼塊進行資料許可權控制

得益於 Hyperf AOP 特性，我們可以在類或者類方法上使用 [DataScope](https://github.com/mineadmin/MineAdmin/blob/master-department/app/Library/DataPermission/Attribute/DataScope.php) 註解來對指定的程式碼塊開啟資料許可權控制。 

以自帶的使用者模組的[分頁列表](https://github.com/mineadmin/MineAdmin/blob/master-department/app/Service/Permission/UserService.php#L93~L100)為例

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

這樣在呼叫 `page` 方法時，資料許可權會自動應用到查詢中。

## 對指定的 ORM Query 進行許可權控制

在某些特定場景中，需要更加細化的進行許可權隔離。此時可以透過 `Factory::make()->build()` 方法來對指定的 Query 進行限制

```php
// 手動使用 Factory 進行許可權過濾
use App\Library\DataPermission\Factory;
use App\Model\Permission\User;

class DemoService {

    public function test(User $user): void {
        $userQuery = User::query();
        
        // 對 UserQuery 單獨進行資料隔離拼接
        Factory::make()->build($userQuery->getQuery(), $user);
        
        $result = $userQuery->get();
    }
}
```

## 使用 Context 配置資料許可權

### 基本配置方式

```php
// /mineadmin/app/Library/DataPermission/Context.php
use App\Library\DataPermission\Context;
use App\Library\DataPermission\ScopeType;

// 設定部門欄位名稱
Context::setDeptColumn('department_id');
// 設定建立人欄位名稱
Context::setCreatedByColumn('creator');
// 設定隔離方式
Context::setScopeType(ScopeType::DEPT_CREATED_BY);
// 只對指定表進行資料隔離
Context::setOnlyTables(['user', 'orders']);

$query = User::query();
Factory::make()->build($query->getQuery(), $user);
```

### DataScope 註解完整配置

```php
// /mineadmin/app/Library/DataPermission/Attribute/DataScope.php
#[DataScope(
    // 部門欄位名稱（預設：dept_id）
    deptColumn: 'department_id',
    
    // 建立人欄位名稱（預設：created_by）
    createdByColumn: 'creator_id',
    
    // 隔離方式（預設：ScopeType::DEPT_CREATED_BY）
    scopeType: ScopeType::DEPT_SELF,
    
    // 只對指定表生效（預設：null，對所有表生效）
    onlyTables: ['orders', 'order_items']
)]
public function getFilteredData(): Collection
{
    return Order::with('items')->get();
}
```

## 策略型別使用示例

### DEPT_SELF - 本部門許可權

```php
// 來源：基於 /Users/zhuzhu/project/mineadmin/app/Model/Enums/DataPermission/PolicyType.php
#[DataScope(scopeType: ScopeType::DEPT)]
public function getDepartmentUsers(): Collection
{
    // 自動過濾為當前使用者所在部門的使用者
    return User::query()->get();
}
```

### DEPT_TREE - 部門樹許可權  

```php
#[DataScope(scopeType: ScopeType::DEPT)]
public function getDepartmentTreeUsers(): Collection
{
    // 自動包含當前部門及所有子部門的使用者
    return User::query()->get();
}
```

### CREATED_BY - 建立人許可權

```php
#[DataScope(scopeType: ScopeType::CREATED_BY)]
public function getMyCreatedData(): Collection
{
    // 只返回當前使用者建立的資料
    return Document::query()->get();
}
```

### 組合許可權使用

```php
// AND 條件：既要是本部門，又要是自己建立的
#[DataScope(scopeType: ScopeType::DEPT_CREATED_BY)]
public function getMyDeptData(): Collection
{
    return Document::query()->get();
}

// OR 條件：本部門的或者自己建立的
#[DataScope(scopeType: ScopeType::DEPT_OR_CREATED_BY)]
public function getDeptOrMyData(): Collection
{
    return Document::query()->get();
}
```

## 自定義函式策略

### 建立自定義函式

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

### 使用自定義函式

要使用自定義函式，需要設定策略型別為 `CUSTOM_FUNC` 並在策略的 `value` 欄位中指定函式名：

```php
// 在資料庫中建立策略記錄
Policy::create([
    'user_id' => $userId,
    'policy_type' => PolicyType::CustomFunc,
    'value' => ['my_custom_filter'],  // 自定義函式名
    'is_default' => true
]);
```

## 資料許可權結合業務場景

### 訂單管理系統

```php
class OrderService 
{
    // 普通員工只能看到自己建立的訂單
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

### 文件管理系統

```php
class DocumentService
{
    // 文件許可權：部門共享 + 個人私有
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

當涉及多表關聯時，可以指定 `onlyTables` 引數來控制哪些表應用資料許可權：

```php
#[DataScope(
    scopeType: ScopeType::DEPT_SELF,
    onlyTables: ['orders']  // 只對 orders 表應用許可權過濾
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

需要注意，不管哪種使用方式。如果新開一個協程，都要重新設定一遍才能起效

```php
// ❌ 錯誤：協程中許可權丟失
Co::create(function () {
    // 許可權配置已丟失，可能返回錯誤資料
    $data = User::query()->get();
});

// ✅ 正確：重新設定協程許可權
Co::create(function () use ($user) {
    // 需要重新設定上下文
    Context::setDeptColumn('dept_id');
    Context::setCreatedByColumn('created_by');
    Context::setScopeType(ScopeType::DEPT_SELF);
    
    $data = User::query()->get();
});
```

:::

## 完整 API 參考

### DataScope 註解引數

| 引數 | 型別 | 預設值 | 說明 |
|------|------|--------|------|
| `deptColumn` | string | `'dept_id'` | 部門欄位名稱 |
| `createdByColumn` | string | `'created_by'` | 建立人欄位名稱 |
| `scopeType` | ScopeType | `ScopeType::DEPT_CREATED_BY` | 許可權範圍型別 |
| `onlyTables` | array\|null | `null` | 只對指定表生效，null則對所有表生效 |

### Context 類方法

| 方法 | 說明 |
|------|------|
| `Context::setDeptColumn(string)` | 設定部門欄位名 |
| `Context::setCreatedByColumn(string)` | 設定建立人欄位名 |
| `Context::setScopeType(ScopeType)` | 設定許可權範圍型別 |
| `Context::setOnlyTables(array)` | 設定只對指定表生效 |
| `Context::getDeptColumn()` | 獲取部門欄位名 |
| `Context::getCreatedByColumn()` | 獲取建立人欄位名 |
| `Context::getScopeType()` | 獲取許可權範圍型別 |
| `Context::getOnlyTables()` | 獲取指定表列表 |

### Factory 類方法

| 方法 | 說明 |
|------|------|
| `Factory::make()` | 建立工廠例項 |
| `Factory::build(Builder, User)` | 對查詢構建器應用許可權過濾 |

### ScopeType 列舉值

| 值 | 說明 |
|----|------|
| `ScopeType::DEPT` | 只根據部門過濾 |
| `ScopeType::CREATED_BY` | 只根據建立人過濾 |
| `ScopeType::DEPT_CREATED_BY` | 根據部門 AND 建立人過濾 |
| `ScopeType::DEPT_OR_CREATED_BY` | 根據部門 OR 建立人過濾 |

### PolicyType 列舉值

| 值 | 說明 |
|----|------|
| `PolicyType::DeptSelf` | 本部門 |
| `PolicyType::DeptTree` | 本部門及子部門 |
| `PolicyType::All` | 全部資料 |
| `PolicyType::Self` | 僅本人 |
| `PolicyType::CustomDept` | 自定義部門 |
| `PolicyType::CustomFunc` | 自定義函式 |