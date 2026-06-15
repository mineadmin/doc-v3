# 故障排除

## 常见问题诊断

### 1. 权限策略不生效

**问题现象**: 用户设置了数据权限策略，但查询结果仍显示所有数据

**排查步骤**:

#### 1.1 检查用户是否为超级管理员

```php
// 来源：基于 /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Factory.php:37-39
$user = User::find($userId);

// 超级管理员会自动跳过所有数据权限检查
if ($user->isSuperAdmin()) {
    echo "用户是超级管理员，会绕过所有数据权限检查";
}
```

#### 1.2 检查用户策略配置

```php
// 来源：基于 /Users/zhuzhu/project/mineadmin/app/Model/Permission/User.php:160-179
$user = User::find($userId);

// 检查用户直接策略
$userPolicy = $user->policy()->first();
if ($userPolicy) {
    echo "用户策略存在:";
    var_dump([
        'policy_type' => $userPolicy->policy_type,
        'value' => $userPolicy->value,
        'is_default' => $userPolicy->is_default
    ]);
} else {
    echo "用户无直接策略，检查岗位策略:";
    
    // 检查岗位策略
    $user->load('position');
    foreach ($user->position as $position) {
        $positionPolicy = $position->policy()->first();
        if ($positionPolicy) {
            echo "找到岗位策略:";
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

#### 1.3 验证 DataScope 注解配置

确保方法有正确的 DataScope 注解：

```php
// 来源：基于 /Users/zhuzhu/project/mineadmin/app/Service/Permission/UserService.php:94-98
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

#### 1.4 检查数据权限上下文

```php
// 来源：基于 /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Context.php
use App\Library\DataPermission\Context;

// 检查当前上下文配置
$context = [
    'dept_column' => Context::getDeptColumn(),
    'created_by_column' => Context::getCreatedByColumn(),
    'scope_type' => Context::getScopeType(),
    'only_tables' => Context::getOnlyTables()
];

var_dump($context);
```

### 2. 协程上下文丢失

**问题现象**: 在协程中数据权限配置丢失

**解决方案**:

在新协程中重新设置上下文：

```php
// 来源：基于 /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Context.php
use Hyperf\Utils\Coroutine;
use App\Library\DataPermission\Context;
use App\Library\DataPermission\ScopeType;

// 正确的协程上下文处理
Coroutine::create(function () use ($userId) {
    // 在新协程中重新设置数据权限上下文
    Context::setDeptColumn('dept_id');
    Context::setCreatedByColumn('created_by');
    Context::setScopeType(ScopeType::DEPT_CREATED_BY);
    Context::setOnlyTables(['user']);
    
    // 执行业务逻辑
    $result = UserService::page($params);
});
```

### 3. 查询性能问题

**问题现象**: 启用数据权限后查询速度明显变慢

#### 3.1 添加必要的数据库索引

```sql
-- 基础索引（根据实际表结构调整）
CREATE INDEX idx_user_dept_id ON user(dept_id);
CREATE INDEX idx_user_created_by ON user(created_by);
CREATE INDEX idx_dept_parent_id ON department(parent_id);

-- 数据权限策略相关索引
CREATE INDEX idx_policy_user_id ON data_permission_policy(user_id);
CREATE INDEX idx_policy_position_id ON data_permission_policy(position_id);
CREATE INDEX idx_policy_type ON data_permission_policy(policy_type);

-- 组合索引优化复合查询
CREATE INDEX idx_user_dept_created ON user(dept_id, created_by);
```

#### 3.2 启用 SQL 查询日志进行分析

```php
// 在调试环境中启用查询日志
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
            // 记录慢查询（超过100ms）
            if ($event->time > 100) {
                Logger::warning('慢查询检测', [
                    'sql' => $event->sql,
                    'bindings' => $event->bindings,
                    'time' => $event->time . 'ms'
                ]);
            }
        }
    }
}
```

#### 3.3 优化部门树查询

```php
// 来源：优化 /Users/zhuzhu/project/mineadmin/app/Model/Permission/Department.php 的 getFlatChildren 方法
use Hyperf\Database\Model\Collection;
use Hyperf\DbConnection\Db;

class Department extends Model
{
    // 使用递归 CTE 优化部门树查询
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
                WHERE dt.level < 10  -- 防止无限递归
            )
            SELECT * FROM dept_tree ORDER BY level, id
        ";
        
        $results = Db::select($sql, [$this->id]);
        return new Collection($results);
    }
}
```

### 4. 数据不一致问题

**问题现象**: 同一用户在不同时间查询到的数据不一致

#### 4.1 清除相关缓存

```php
// 如果使用了缓存，需要及时清除
use Hyperf\Cache\Cache;

function clearDataPermissionCache(int $userId): void
{
    $cache = ApplicationContext::getContainer()->get(Cache::class);
    
    // 清除用户策略缓存
    $cache->delete("user_policy_{$userId}");
    
    // 清除部门树缓存
    $user = User::find($userId);
    if ($user && $user->department) {
        foreach ($user->department as $dept) {
            $cache->delete("dept_tree_{$dept->id}");
        }
    }
}
```

#### 4.2 强制从数据库重新加载

```php
// 强制从数据库重新加载用户及相关数据
$user = User::find($userId);
$user->refresh(); // 刷新用户数据
$user->load(['policy', 'position.policy', 'department']); // 重新加载关联数据

// 获取最新的策略
$policy = $user->getPolicy();
```

### 5. AOP 切面不生效

**问题现象**: DataScope 注解不起作用

#### 5.1 检查 AOP 配置

```php
// 检查 config/autoload/annotations.php 中是否正确配置了 AOP
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

#### 5.2 确认切面类存在

```php
// 来源：确认 /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Aspects/DataScopeAspect.php 文件存在
use App\Library\DataPermission\Aspects\DataScopeAspect;

// 检查切面是否正确注册
if (class_exists(DataScopeAspect::class)) {
    echo "DataScopeAspect 类存在";
} else {
    echo "DataScopeAspect 类不存在，请检查文件路径";
}
```

### 6. 调试方法

#### 6.1 启用调试模式

```php
// 在需要调试的地方添加日志
use Hyperf\Logger\LoggerFactory;
use Hyperf\Utils\ApplicationContext;

$logger = ApplicationContext::getContainer()->get(LoggerFactory::class)->get('data_permission');

// 记录当前用户信息
$logger->debug('数据权限调试', [
    'user_id' => $userId,
    'is_super_admin' => $user->isSuperAdmin(),
    'user_policy' => $user->policy ? $user->policy->toArray() : null,
    'position_policies' => $user->position->map(function ($pos) {
        return $pos->policy ? $pos->policy->toArray() : null;
    })->filter()->toArray()
]);
```

#### 6.2 手动检查权限过滤

```php
// 来源：基于 /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Factory.php
use App\Library\DataPermission\Factory;
use App\Model\Permission\User;
use Hyperf\Database\Query\Builder;

function testDataPermission(int $userId): void
{
    $user = User::find($userId);
    $query = User::query();
    $builder = $query->getQuery();
    
    // 手动应用数据权限过滤
    $factory = new Factory();
    $factory->build($builder, $user);
    
    // 输出生成的 SQL
    echo "生成的 SQL: " . $builder->toSql() . PHP_EOL;
    echo "绑定参数: " . json_encode($builder->getBindings()) . PHP_EOL;
    
    // 执行查询查看结果
    $results = $query->get();
    echo "查询结果数量: " . $results->count() . PHP_EOL;
}
```

### 7. 常用检查命令

创建一个简单的检查脚本：

```php
// 创建文件：check_data_permission.php
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
    
    // 检查用户策略
    $userPolicy = $user->policy()->first();
    if ($userPolicy) {
        $result['user_policy'] = $userPolicy->toArray();
    }
    
    // 检查岗位策略
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

## 总结

在排查 MineAdmin 数据权限问题时，建议按照以下顺序进行：

1. **检查超级管理员状态** - 超级管理员会绕过所有权限检查
2. **验证策略配置** - 确保用户或岗位有正确的权限策略  
3. **检查注解配置** - 确认方法上的 DataScope 注解正确
4. **验证 AOP 是否生效** - 确认切面能够正常拦截方法调用
5. **检查协程上下文** - 在新协程中重新设置权限上下文
6. **分析查询性能** - 添加必要的数据库索引
7. **清除缓存** - 在数据变更后及时清除相关缓存

这些基于实际代码的诊断方法可以有效地解决大部分数据权限相关的问题。