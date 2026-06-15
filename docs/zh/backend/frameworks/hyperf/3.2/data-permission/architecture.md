# 系统架构

## 数据权限系统架构设计

MineAdmin 数据权限系统基于 AOP（面向切面编程）设计，通过注解和切面拦截的方式自动为数据查询注入权限过滤条件。

## 核心组件架构图

```plantuml
@startuml
!theme plain

package "数据模型层" {
    class User {
        +id: int
        +isSuperAdmin(): bool
        +getPolicy(): ?Policy
        +department(): BelongsToMany
        +position(): BelongsToMany
    }
    
    class Policy {
        +user_id: int
        +position_id: int
        +policy_type: PolicyType
        +value: array
        +is_default: bool
    }
    
    class Department {
        +id: int
        +parent_id: int
        +getFlatChildren(): Collection
    }
    
    class Position {
        +id: int
        +dept_id: int
        +policy(): HasOne
    }
}

package "权限引擎" {
    class Factory {
        +make(): self
        +build(Builder, User): void
    }
    
    class Context {
        +setDeptColumn(string): void
        +setCreatedByColumn(string): void
        +setScopeType(ScopeType): void
        +setOnlyTables(array): void
    }
    
    class Rule {
        +getDeptIds(User, Policy): array
        +getCreatedByList(User, Policy): array
    }
}

package "AOP 层" {
    annotation DataScope {
        +deptColumn: string
        +createdByColumn: string  
        +scopeType: ScopeType
        +onlyTables: array
    }
    
    class DataScopeAspect {
        +process(): void
    }
}

package "枚举定义" {
    enum PolicyType {
        DEPT_SELF
        DEPT_TREE
        ALL
        SELF
        CUSTOM_DEPT
        CUSTOM_FUNC
    }
    
    enum ScopeType {
        DEPT = 1
        CREATED_BY = 2
        DEPT_CREATED_BY = 3
        DEPT_OR_CREATED_BY = 4
    }
}

User --> Policy : 关联策略
Position --> Policy : 关联策略
User --> Department : 所属部门
Position --> Department : 归属部门
Factory --> Rule : 使用规则
Factory --> Context : 读取上下文
DataScope --> DataScopeAspect : 触发切面
DataScopeAspect --> Factory : 调用工厂

@enduml
```

## 权限解析流程

```plantuml
@startuml
!theme plain

start

:接收查询请求;
:DataScope 注解拦截;

if (用户是超级管理员?) then (是)
    :跳过权限检查;
    stop
endif

:获取当前用户;

note right
来源：User.php:160-179
getPolicy() 方法
end note

if (用户有直接策略?) then (有)
    :使用用户策略;
else (无)
    :遍历用户岗位;
    if (岗位有策略?) then (有)
        :使用第一个岗位策略;
    else (无)
        :返回空结果;
        stop
    endif
endif

:根据 ScopeType 处理;

note right
来源：Factory.php:51-65
处理不同的 ScopeType
end note

switch (ScopeType)
case (CREATED_BY)
    :过滤创建人数据;
case (DEPT)
    :过滤部门数据;
case (DEPT_CREATED_BY)
    :AND 条件过滤;
case (DEPT_OR_CREATED_BY)
    :OR 条件过滤;
endswitch

:构建 WHERE 条件;
:注入到 QueryBuilder;
:执行查询;

stop

@enduml
```

## 数据权限执行机制

### Factory 工厂类

权限过滤的核心实现：

```php
// /mineadmin/app/Library/DataPermission/Factory.php
class Factory
{
    public function build(Builder $builder, User $user): void 
    {
        // 1. 超级管理员绕过检查
        if ($user->isSuperAdmin()) {
            return;
        }
        
        // 2. 获取用户策略
        if (($policy = $user->getPolicy()) === null) {
            return;
        }
        
        // 3. 获取当前 ScopeType
        $scopeType = Context::getScopeType();
        
        // 4. 处理自定义函数
        if ($policy->policy_type === PolicyType::CustomFunc) {
            $customFunc = $policy->value[0] ?? null;
            $this->rule->loadCustomFunc($customFunc, $builder, $user, $policy, $scopeType);
        }
        
        // 5. 根据 ScopeType 处理不同的过滤逻辑
        switch ($scopeType) {
            case ScopeType::CREATED_BY:
                $this->handleCreatedBy($user, $policy, $builder);
                break;
            case ScopeType::DEPT:
                $this->handleDept($user, $policy, $builder);
                break;
            case ScopeType::DEPT_CREATED_BY:
                $this->handleDeptCreatedBy($user, $policy, $builder);
                break;
            case ScopeType::DEPT_OR_CREATED_BY:
                $this->handleDeptOrCreatedBy($user, $policy, $builder);
                break;
        }
    }
}
```

### 具体过滤实现

各种过滤条件的具体实现：

```php
// /mineadmin/app/Library/DataPermission/Factory.php:67-102

// 创建人过滤
private function handleCreatedBy(User $user, Policy $policy, Builder $builder): void
{
    $builder->when($this->rule->getCreatedByList($user, $policy), 
        static function (Builder $query, array $createdByList) {
            $query->whereIn(Context::getCreatedByColumn(), $createdByList);
        });
}

// 部门过滤
private function handleDept(User $user, Policy $policy, Builder $builder): void
{
    $builder->when($this->rule->getDeptIds($user, $policy), 
        static function (Builder $query, array $deptList) {
            $query->whereIn(Context::getDeptColumn(), $deptList);
        });
}

// 部门 AND 创建人过滤
private function handleDeptCreatedBy(User $user, Policy $policy, Builder $builder): void
{
    $builder->when($this->rule->getDeptIds($user, $policy), 
        static function (Builder $query, array $deptList) {
            $query->whereIn(Context::getDeptColumn(), $deptList);
        })->when($this->rule->getCreatedByList($user, $policy), 
        static function (Builder $query, array $createdByList) {
            $query->whereIn(Context::getCreatedByColumn(), $createdByList);
        });
}

// 部门 OR 创建人过滤
private function handleDeptOrCreatedBy(User $user, Policy $policy, Builder $builder): void
{
    $createdByList = $this->rule->getCreatedByList($user, $policy);
    $deptList = $this->rule->getDeptIds($user, $policy);
    
    $builder->where(static function (Builder $query) use ($createdByList, $deptList) {
        if ($createdByList) {
            $query->whereIn(Context::getCreatedByColumn(), $createdByList);
        }
        if ($deptList) {
            $query->orWhereIn(Context::getDeptColumn(), $deptList);
        }
    });
}
```

## Context 上下文管理

### 上下文存储机制

```php
// /mineadmin/app/Library/DataPermission/Context.php
final class Context
{
    private const DEPT_COLUMN_KEY = 'data_permission_dept_column';
    private const CREATED_BY_COLUMN_KEY = 'data_permission_created_by_column';
    private const SCOPE_TYPE_KEY = 'data_permission_scope_type';
    private const ONLY_TABLES_KEY = 'data_permission_only_tables';

    public static function setDeptColumn(string $column = 'dept_id'): void
    {
        Ctx::set(self::DEPT_COLUMN_KEY, $column);
    }

    public static function getDeptColumn(): string
    {
        return Ctx::get(self::DEPT_COLUMN_KEY, 'dept_id');
    }
    
    // ... 其他方法类似
}
```

## 部门层级处理

### 递归部门树算法

```php
// /mineadmin/app/Model/Permission/Department.php
public function getFlatChildren(): Collection
{
    $flat = collect();
    $this->load('children'); // 预加载子部门
    
    $traverse = static function ($departments) use (&$traverse, $flat) {
        foreach ($departments as $department) {
            $flat->push($department);
            if ($department->children->isNotEmpty()) {
                $traverse($department->children); // 递归处理
            }
        }
    };
    
    $traverse($this->children);
    return $flat->prepend($this); // 包含自身
}
```

### 部门权限处理流程

```plantuml
@startuml
!theme plain

start
:获取用户部门;

if (策略类型 == DEPT_SELF?) then (是)
    :只获取当前部门ID;
else (否)
    if (策略类型 == DEPT_TREE?) then (是)
        :获取当前部门;
        :调用 getFlatChildren();
        :递归获取所有子部门;
        :返回部门ID数组;
    else (否)
        if (策略类型 == CUSTOM_DEPT?) then (是)
            :从策略配置读取部门ID;
        endif
    endif
endif

:构建 WHERE IN 条件;
:dept_id IN (1,2,3...);

stop
@enduml
```

## AOP 切面机制

### DataScope 注解定义

```php
// /mineadmin/app/Library/DataPermission/Attribute/DataScope.php
#[\Attribute(\Attribute::TARGET_CLASS | \Attribute::TARGET_METHOD)]
class DataScope extends AbstractAnnotation
{
    public function __construct(
        private readonly string $deptColumn = 'dept_id',
        private readonly string $createdByColumn = 'created_by',
        private readonly ScopeType $scopeType = ScopeType::DEPT_CREATED_BY,
        private readonly ?array $onlyTables = null
    ) {}
}
```

### 切面拦截处理

```plantuml
@startuml
!theme plain

participant "业务方法" as method
participant "DataScopeAspect" as aspect  
participant "Factory" as factory
participant "QueryBuilder" as builder

method -> aspect: 调用带@DataScope注解的方法
aspect -> aspect: 解析DataScope注解参数
aspect -> factory: 获取Factory实例
aspect -> builder: 拦截QueryBuilder
factory -> builder: 注入权限过滤条件
builder -> method: 返回过滤后的查询
method -> method: 执行业务逻辑

@enduml
```

## 自定义函数扩展

### 自定义函数配置

```php
// /mineadmin/config/autoload/department/custom.php
return [
    'testction' => function (Builder $builder, ScopeType $scopeType, Policy $policy, User $user) {
        // 只针对特定用户生效
        if ($user->id !== 2) {
            return;
        }
        
        $createdByColumn = Context::getCreatedByColumn();
        $deptColumn = Context::getDeptColumn();
        
        switch ($scopeType) {
            case ScopeType::CREATED_BY:
                $builder->where($createdByColumn, $user->id);
                break;
            case ScopeType::DEPT:
                $builder->whereIn($deptColumn, 
                    $user->department()->get()->pluck('id'));
                break;
            case ScopeType::DEPT_CREATED_BY:
                $builder->whereIn($deptColumn, 
                    $user->department()->get()->pluck('id'));
                $builder->where($createdByColumn, $user->id);
                break;
            case ScopeType::DEPT_OR_CREATED_BY:
                $builder->whereIn($deptColumn, 
                    $user->department()->get()->pluck('id'));
                $builder->orWhere($createdByColumn, $user->id);
                break;
        }
    }
];
```

## 实际使用示例

### 在 Service 中的使用

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

这个真实的使用示例展示了如何在 MineAdmin 中应用数据权限注解来控制用户列表的访问权限。

通过这个架构设计，MineAdmin 实现了声明式的数据权限控制，开发者只需要在方法上添加 `@DataScope` 注解，系统就会自动根据当前用户的权限策略过滤数据。