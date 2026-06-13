# 故障排除

## 常見問題診斷

### 1. 許可權策略不生效

**問題現象**: 使用者設定了資料許可權策略，但查詢結果仍顯示所有資料

**排查步驟**:

#### 1.1 檢查使用者是否為超級管理員

```php
// 來源：基於 /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Factory.php:37-39
$user = User::find($userId);

// 超級管理員會自動跳過所有資料許可權檢查
if ($user->isSuperAdmin()) {
    echo "使用者是超級管理員，會繞過所有資料許可權檢查";
}
```

#### 1.2 檢查使用者策略配置

```php
// 來源：基於 /Users/zhuzhu/project/mineadmin/app/Model/Permission/User.php:160-179
$user = User::find($userId);

// 檢查使用者直接策略
$userPolicy = $user->policy()->first();
if ($userPolicy) {
    echo "使用者策略存在:";
    var_dump([
        'policy_type' => $userPolicy->policy_type,
        'value' => $userPolicy->value,
        'is_default' => $userPolicy->is_default
    ]);
} else {
    echo "使用者無直接策略，檢查崗位策略:";
    
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

#### 1.4 檢查資料許可權上下文

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

**問題現象**: 在協程中資料許可權配置丟失

**解決方案**:

在新協程中重新設定上下文：

```php
// 來源：基於 /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Context.php
use Hyperf\Utils\Coroutine;
use App\Library\DataPermission\Context;
use App\Library\DataPermission\ScopeType;

// 正確的協程上下文處理
Coroutine::create(function () use ($userId) {
    // 在新協程中重新設定資料許可權上下文
    Context::setDeptColumn('dept_id');
    Context::setCreatedByColumn('created_by');
    Context::setScopeType(ScopeType::DEPT_CREATED_BY);
    Context::setOnlyTables(['user']);
    
    // 執行業務邏輯
    $result = UserService::page($params);
});
```

### 3. 查詢效能問題

**問題現象**: 啟用資料許可權後查詢速度明顯變慢

#### 3.1 新增必要的資料庫索引

```sql
-- 基礎索引（根據實際表結構調整）
CREATE INDEX idx_user_dept_id ON user(dept_id);
CREATE INDEX idx_user_created_by ON user(created_by);
CREATE INDEX idx_dept_parent_id ON department(parent_id);

-- 資料許可權策略相關索引
CREATE INDEX idx_policy_user_id ON data_permission_policy(user_id);
CREATE INDEX idx_policy_position_id ON data_permission_policy(position_id);
CREATE INDEX idx_policy_type ON data_permission_policy(policy_type);

-- 組合索引最佳化複合查詢
CREATE INDEX idx_user_dept_created ON user(dept_id, created_by);
```

#### 3.2 啟用 SQL 查詢日誌進行分析

```php
// 在除錯環境中啟用查詢日誌
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

#### 3.3 最佳化部門樹查詢

```php
// 來源：最佳化 /Users/zhuzhu/project/mineadmin/app/Model/Permission/Department.php 的 getFlatChildren 方法
use Hyperf\Database\Model\Collection;
use Hyperf\DbConnection\Db;

class Department extends Model
{
    // 使用遞迴 CTE 最佳化部門樹查詢
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
                WHERE dt.level < 10  -- 防止無限遞迴
            )
            SELECT * FROM dept_tree ORDER BY level, id
        ";
        
        $results = Db::select($sql, [$this->id]);
        return new Collection($results);
    }
}
```

### 4. 資料不一致問題

**問題現象**: 同一使用者在不同時間查詢到的資料不一致

#### 4.1 清除相關快取

```php
// 如果使用了快取，需要及時清除
use Hyperf\Cache\Cache;

function clearDataPermissionCache(int $userId): void
{
    $cache = ApplicationContext::getContainer()->get(Cache::class);
    
    // 清除使用者策略快取
    $cache->delete("user_policy_{$userId}");
    
    // 清除部門樹快取
    $user = User::find($userId);
    if ($user && $user->department) {
        foreach ($user->department as $dept) {
            $cache->delete("dept_tree_{$dept->id}");
        }
    }
}
```

#### 4.2 強制從資料庫重新載入

```php
// 強制從資料庫重新載入使用者及相關資料
$user = User::find($userId);
$user->refresh(); // 重新整理使用者資料
$user->load(['policy', 'position.policy', 'department']); // 重新載入關聯資料

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
// 來源：確認 /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Aspects/DataScopeAspect.php 檔案存在
use App\Library\DataPermission\Aspects\DataScopeAspect;

// 檢查切面是否正確註冊
if (class_exists(DataScopeAspect::class)) {
    echo "DataScopeAspect 類存在";
} else {
    echo "DataScopeAspect 類不存在，請檢查檔案路徑";
}
```

### 6. 除錯方法

#### 6.1 啟用除錯模式

```php
// 在需要除錯的地方新增日誌
use Hyperf\Logger\LoggerFactory;
use Hyperf\Utils\ApplicationContext;

$logger = ApplicationContext::getContainer()->get(LoggerFactory::class)->get('data_permission');

// 記錄當前使用者資訊
$logger->debug('資料許可權除錯', [
    'user_id' => $userId,
    'is_super_admin' => $user->isSuperAdmin(),
    'user_policy' => $user->policy ? $user->policy->toArray() : null,
    'position_policies' => $user->position->map(function ($pos) {
        return $pos->policy ? $pos->policy->toArray() : null;
    })->filter()->toArray()
]);
```

#### 6.2 手動檢查許可權過濾

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
    
    // 手動應用資料許可權過濾
    $factory = new Factory();
    $factory->build($builder, $user);
    
    // 輸出生成的 SQL
    echo "生成的 SQL: " . $builder->toSql() . PHP_EOL;
    echo "繫結引數: " . json_encode($builder->getBindings()) . PHP_EOL;
    
    // 執行查詢檢視結果
    $results = $query->get();
    echo "查詢結果數量: " . $results->count() . PHP_EOL;
}
```

### 7. 常用檢查命令

建立一個簡單的檢查指令碼：

```php
// 建立檔案：check_data_permission.php
<?php

use App\Model\Permission\User;
use App\Model\DataPermission\Policy;
use App\Library\DataPermission\Context;

function checkDataPermissionStatus(int $userId): array
{
    $user = User::find($userId);
    if (!$user) {
        return ['error' => '使用者不存在'];
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
    
    // 檢查使用者策略
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

在排查 MineAdmin 資料許可權問題時，建議按照以下順序進行：

1. **檢查超級管理員狀態** - 超級管理員會繞過所有許可權檢查
2. **驗證策略配置** - 確保使用者或崗位有正確的許可權策略  
3. **檢查註解配置** - 確認方法上的 DataScope 註解正確
4. **驗證 AOP 是否生效** - 確認切面能夠正常攔截方法呼叫
5. **檢查協程上下文** - 在新協程中重新設定許可權上下文
6. **分析查詢效能** - 新增必要的資料庫索引
7. **清除快取** - 在資料變更後及時清除相關快取

這些基於實際程式碼的診斷方法可以有效地解決大部分資料許可權相關的問題。