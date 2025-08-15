# 故障排除

## 常見問題診斷

### 1. 權限策略不生效

**問題現象**: 用户設置了數據權限策略，但查詢結果仍顯示所有數據

**排查步驟**:

#### 1.1 檢查用户是否為超級管理員

```php
// 來源：基於 /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Factory.php:37-39
$user = User::find($userId);

// 超級管理員會自動跳過所有數據權限檢查
if ($user->isSuperAdmin()) {
    echo "用户是超級管理員，會繞過所有數據權限檢查";
}
```

#### 1.2 檢查用户策略配置

```php
// 來源：基於 /Users/zhuzhu/project/mineadmin/app/Model/Permission/User.php:160-179
$user = User::find($userId);

// 檢查用户直接策略
$userPolicy = $user->policy()->first();
if ($userPolicy) {
    echo "用户策略存在:";
    var_dump([
        'policy_type' => $userPolicy->policy_type,
        'value' => $userPolicy->value,
        'is_default' => $userPolicy->is_default
    ]);
} else {
    echo "用户無直接策略，檢查崗位策略:";
    
    // 檢查崗位策略
    $user->load('position');
    foreach ($user->position as $position) {
        $positionPolicy = $position->policy()->first();
        if ($positionPolicy) {
            echo "找到崗位策略:";
            var_dump([
                'position_id' => $position->id,
                'position_name' => $position->name,
                'policy_type' => $positionPolicy->policy_type,
                'value' => $positionPolicy->value
            ]);
            break;
        }
    }
}
```

#### 1.3 驗證 DataScope 註解配置

確保方法有正確的 DataScope 註解：

```php
// 來源：基於 /Users/zhuzhu/project/mineadmin/app/Service/Permission/UserService.php:94-98
use App\Library\DataPermission\Attribute\DataScope;
use App\Library\DataPermission\ScopeType;

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

#### 1.4 檢查數據權限上下文

```php
// 來源：基於 /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Context.php
use App\Library\DataPermission\Context;

// 檢查當前上下文配置
$context = [
    'dept_column' => Context::getDeptColumn(),
    'created_by_column' => Context::getCreatedByColumn(),
    'scope_type' => Context::getScopeType(),
    'only_tables' => Context::getOnlyTables()
];

var_dump($context);
```

### 2. 協程上下文丟失

**問題現象**: 在協程中數據權限配置丟失

**解決方案**:

在新協程中重新設置上下文：

```php
// 來源：基於 /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Context.php
use Hyperf\Utils\Coroutine;
use App\Library\DataPermission\Context;
use App\Library\DataPermission\ScopeType;

// 正確的協程上下文處理
Coroutine::create(function () use ($userId) {
    // 在新協程中重新設置數據權限上下文
    Context::setDeptColumn('dept_id');
    Context::setCreatedByColumn('created_by');
    Context::setScopeType(ScopeType::DEPT_CREATED_BY);
    Context::setOnlyTables(['user']);
    
    // 執行業務邏輯
    $result = UserService::page($params);
});
```

### 3. 查詢性能問題

**問題現象**: 啓用數據權限後查詢速度明顯變慢

#### 3.1 添加必要的數據庫索引

```sql
-- 基礎索引（根據實際表結構調整）
CREATE INDEX idx_user_dept_id ON user(dept_id);
CREATE INDEX idx_user_created_by ON user(created_by);
CREATE INDEX idx_dept_parent_id ON department(parent_id);

-- 數據權限策略相關索引
CREATE INDEX idx_policy_user_id ON data_permission_policy(user_id);
CREATE INDEX idx_policy_position_id ON data_permission_policy(position_id);
CREATE INDEX idx_policy_type ON data_permission_policy(policy_type);

-- 組合索引優化複合查詢
CREATE INDEX idx_user_dept_created ON user(dept_id, created_by);
```

#### 3.2 啓用 SQL 查詢日誌進行分析

```php
// 在調試環境中啓用查詢日誌
use Hyperf\Database\Model\Events\QueryExecuted;
use Hyperf\Event\Annotation\Listener;
use Hyperf\Event\Contract\ListenerInterface;

#[Listener]
class QueryListener implements ListenerInterface
{
    public function listen(): array
    {
        return [QueryExecuted::class];
    }

    public function process(object $event)
    {
        if ($event instanceof QueryExecuted) {
            // 記錄慢查詢（超過100ms）
            if ($event->time > 100) {
                Logger::warning('慢查詢檢測', [
                    'sql' => $event->sql,
                    'bindings' => $event->bindings,
                    'time' => $event->time . 'ms'
                ]);
            }
        }
    }
}
```

#### 3.3 優化部門樹查詢

```php
// 來源：優化 /Users/zhuzhu/project/mineadmin/app/Model/Permission/Department.php 的 getFlatChildren 方法
use Hyperf\Database\Model\Collection;
use Hyperf\DbConnection\Db;

class Department extends Model
{
    // 使用遞歸 CTE 優化部門樹查詢
    public function getFlatChildrenOptimized(): Collection
    {
        $sql = "
            WITH RECURSIVE dept_tree AS (
                SELECT id, parent_id, name, 0 as level
                FROM department 
                WHERE id = ?
                
                UNION ALL
                
                SELECT d.id, d.parent_id, d.name, dt.level + 1
                FROM department d
                INNER JOIN dept_tree dt ON d.parent_id = dt.id
                WHERE dt.level < 10  -- 防止無限遞歸
            )
            SELECT * FROM dept_tree ORDER BY level, id
        ";
        
        $results = Db::select($sql, [$this->id]);
        return new Collection($results);
    }
}
```

### 4. 數據不一致問題

**問題現象**: 同一用户在不同時間查詢到的數據不一致

#### 4.1 清除相關緩存

```php
// 如果使用了緩存，需要及時清除
use Hyperf\Cache\Cache;

function clearDataPermissionCache(int $userId): void
{
    $cache = ApplicationContext::getContainer()->get(Cache::class);
    
    // 清除用户策略緩存
    $cache->delete("user_policy_{$userId}");
    
    // 清除部門樹緩存
    $user = User::find($userId);
    if ($user && $user->department) {
        foreach ($user->department as $dept) {
            $cache->delete("dept_tree_{$dept->id}");
        }
    }
}
```

#### 4.2 強制從數據庫重新加載

```php
// 強制從數據庫重新加載用户及相關數據
$user = User::find($userId);
$user->refresh(); // 刷新用户數據
$user->load(['policy', 'position.policy', 'department']); // 重新加載關聯數據

// 獲取最新的策略
$policy = $user->getPolicy();
```

### 5. AOP 切面不生效

**問題現象**: DataScope 註解不起作用

#### 5.1 檢查 AOP 配置

```php
// 檢查 config/autoload/annotations.php 中是否正確配置了 AOP
return [
    'scan' => [
        'paths' => [
            BASE_PATH . '/app',
        ],
        'ignore_annotations' => [
            'mixin',
        ],
        'class_map' => [],
    ],
];
```

#### 5.2 確認切面類存在

```php
// 來源：確認 /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Aspects/DataScopeAspect.php 文件存在
use App\Library\DataPermission\Aspects\DataScopeAspect;

// 檢查切面是否正確註冊
if (class_exists(DataScopeAspect::class)) {
    echo "DataScopeAspect 類存在";
} else {
    echo "DataScopeAspect 類不存在，請檢查文件路徑";
}
```

### 6. 調試方法

#### 6.1 啓用調試模式

```php
// 在需要調試的地方添加日誌
use Hyperf\Logger\LoggerFactory;
use Hyperf\Utils\ApplicationContext;

$logger = ApplicationContext::getContainer()->get(LoggerFactory::class)->get('data_permission');

// 記錄當前用户信息
$logger->debug('數據權限調試', [
    'user_id' => $userId,
    'is_super_admin' => $user->isSuperAdmin(),
    'user_policy' => $user->policy ? $user->policy->toArray() : null,
    'position_policies' => $user->position->map(function ($pos) {
        return $pos->policy ? $pos->policy->toArray() : null;
    })->filter()->toArray()
]);
```

#### 6.2 手動檢查權限過濾

```php
// 來源：基於 /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Factory.php
use App\Library\DataPermission\Factory;
use App\Model\Permission\User;
use Hyperf\Database\Query\Builder;

function testDataPermission(int $userId): void
{
    $user = User::find($userId);
    $query = User::query();
    $builder = $query->getQuery();
    
    // 手動應用數據權限過濾
    $factory = new Factory();
    $factory->build($builder, $user);
    
    // 輸出生成的 SQL
    echo "生成的 SQL: " . $builder->toSql() . PHP_EOL;
    echo "綁定參數: " . json_encode($builder->getBindings()) . PHP_EOL;
    
    // 執行查詢查看結果
    $results = $query->get();
    echo "查詢結果數量: " . $results->count() . PHP_EOL;
}
```

### 7. 常用檢查命令

創建一個簡單的檢查腳本：

```php
// 創建文件：check_data_permission.php
<?php

use App\Model\Permission\User;
use App\Model\DataPermission\Policy;
use App\Library\DataPermission\Context;

function checkDataPermissionStatus(int $userId): array
{
    $user = User::find($userId);
    if (!$user) {
        return ['error' => '用户不存在'];
    }
    
    $result = [
        'user_id' => $userId,
        'is_super_admin' => $user->isSuperAdmin(),
        'user_policy' => null,
        'position_policies' => [],
        'context' => [
            'dept_column' => Context::getDeptColumn(),
            'created_by_column' => Context::getCreatedByColumn(),
            'scope_type' => Context::getScopeType()?->value,
            'only_tables' => Context::getOnlyTables()
        ]
    ];
    
    // 檢查用户策略
    $userPolicy = $user->policy()->first();
    if ($userPolicy) {
        $result['user_policy'] = $userPolicy->toArray();
    }
    
    // 檢查崗位策略
    $user->load('position');
    foreach ($user->position as $position) {
        $positionPolicy = $position->policy()->first();
        if ($positionPolicy) {
            $result['position_policies'][] = [
                'position' => $position->toArray(),
                'policy' => $positionPolicy->toArray()
            ];
        }
    }
    
    return $result;
}

// 使用示例
// $status = checkDataPermissionStatus(1);
// var_dump($status);
```

## 總結

在排查 MineAdmin 數據權限問題時，建議按照以下順序進行：

1. **檢查超級管理員狀態** - 超級管理員會繞過所有權限檢查
2. **驗證策略配置** - 確保用户或崗位有正確的權限策略  
3. **檢查註解配置** - 確認方法上的 DataScope 註解正確
4. **驗證 AOP 是否生效** - 確認切面能夠正常攔截方法調用
5. **檢查協程上下文** - 在新協程中重新設置權限上下文
6. **分析查詢性能** - 添加必要的數據庫索引
7. **清除緩存** - 在數據變更後及時清除相關緩存

這些基於實際代碼的診斷方法可以有效地解決大部分數據權限相關的問題。