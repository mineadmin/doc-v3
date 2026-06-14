# System Architecture

## Data Permission System Architecture Design

MineAdmin's data permission system is designed based on AOP (Aspect-Oriented Programming), automatically injecting permission filtering conditions into data queries through annotations and aspect interception.

## Core Component Architecture Diagram

```plantuml
@startuml
!theme plain

package "Data Model Layer" {
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

package "Permission Engine" {
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

package "AOP Layer" {
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

package "Enum Definitions" {
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

User --> Policy : Associated Policy
Position --> Policy : Associated Policy
User --> Department : Belonging Department
Position --> Department : Assigned Department
Factory --> Rule : Uses Rules
Factory --> Context : Reads Context
DataScope --> DataScopeAspect : Triggers Aspect
DataScopeAspect --> Factory : Calls Factory

@enduml
```

## Permission Resolution Flow

```plantuml
@startuml
!theme plain

start

:Receive query request;
:DataScope annotation interception;

if (User is super admin?) then (Yes)
    :Skip permission check;
    stop
endif

:Get current user;

note right
Source: User.php:160-179
getPolicy() method
end note

if (User has direct policy?) then (Yes)
    :Use user policy;
else (No)
    :Iterate user positions;
    if (Position has policy?) then (Yes)
        :Use first position policy;
    else (No)
        :Return empty result;
        stop
    endif
endif

:Process based on ScopeType;

note right
Source: Factory.php:51-65
Handling different ScopeTypes
end note

switch (ScopeType)
case (CREATED_BY)
    :Filter by creator data;
case (DEPT)
    :Filter by department data;
case (DEPT_CREATED_BY)
    :AND condition filtering;
case (DEPT_OR_CREATED_BY)
    :OR condition filtering;
endswitch

:Build WHERE conditions;
:Inject into QueryBuilder;
:Execute query;

stop

@enduml
```

## Data Permission Execution Mechanism

### Factory Class

Core implementation of permission filtering:

```php
// /mineadmin/app/Library/DataPermission/Factory.php
class Factory
{
    public function build(Builder $builder, User $user): void 
    {
        // 1. Super admin bypass check
        if ($user->isSuperAdmin()) {
            return;
        }
        
        // 2. Get user policy
        if (($policy = $user->getPolicy()) === null) {
            return;
        }
        
        // 3. Get current ScopeType
        $scopeType = Context::getScopeType();
        
        // 4. Handle custom function
        if ($policy->policy_type === PolicyType::CustomFunc) {
            $customFunc = $policy->value[0] ?? null;
            $this->rule->loadCustomFunc($customFunc, $builder, $user, $policy, $scopeType);
        }
        
        // 5. Process different filtering logic based on ScopeType
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

### Specific Filter Implementations

Specific implementations of various filter conditions:

```php
// /mineadmin/app/Library/DataPermission/Factory.php:67-102

// Creator filter
private function handleCreatedBy(User $user, Policy $policy, Builder $builder): void
{
    $builder->when($this->rule->getCreatedByList($user, $policy), 
        static function (Builder $query, array $createdByList) {
            $query->whereIn(Context::getCreatedByColumn(), $createdByList);
        });
}

// Department filter
private function handleDept(User $user, Policy $policy, Builder $builder): void
{
    $builder->when($this->rule->getDeptIds($user, $policy), 
        static function (Builder $query, array $deptList) {
            $query->whereIn(Context::getDeptColumn(), $deptList);
        });
}

// Department AND Creator filter
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

// Department OR Creator filter
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

## Context Management

### Context Storage Mechanism

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
    
    // ... Other methods similar
}
```

## Department Hierarchy Processing

### Recursive Department Tree Algorithm

```php
// /mineadmin/app/Model/Permission/Department.php
public function getFlatChildren(): Collection
{
    $flat = collect();
    $this->load('children'); // Preload sub-departments
    
    $traverse = static function ($departments) use (&$traverse, $flat) {
        foreach ($departments as $department) {
            $flat->push($department);
            if ($department->children->isNotEmpty()) {
                $traverse($department->children); // Recursive processing
            }
        }
    };
    
    $traverse($this->children);
    return $flat->prepend($this); // Include self
}
```

### Department Permission Processing Flow

```plantuml
@startuml
!theme plain

start
:Get user department;

if (Policy type == DEPT_SELF?) then (Yes)
    :Get only current department ID;
else (No)
    if (Policy type == DEPT_TREE?) then (Yes)
        :Get current department;
        :Call getFlatChildren();
        :Recursively get all sub-departments;
        :Return department ID array;
    else (No)
        if (Policy type == CUSTOM_DEPT?) then (Yes)
            :Read department IDs from policy config;
        endif
    endif
endif

:Build WHERE IN condition;
:dept_id IN (1,2,3...);

stop
@enduml
```

## AOP Aspect Mechanism

### DataScope Annotation Definition

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

### Aspect Interception Processing

```plantuml
@startuml
!theme plain

participant "Business Method" as method
participant "DataScopeAspect" as aspect  
participant "Factory" as factory
participant "QueryBuilder" as builder

method -> aspect: Call method with @DataScope annotation
aspect -> aspect: Parse DataScope annotation parameters
aspect -> factory: Get Factory instance
aspect -> builder: Intercept QueryBuilder
factory -> builder: Inject permission filter conditions
builder -> method: Return filtered query
method -> method: Execute business logic

@enduml
```

## Custom Function Extension

### Custom Function Configuration

```php
// /mineadmin/config/autoload/department/custom.php
return [
    'testction' => function (Builder $builder, ScopeType $scopeType, Policy $policy, User $user) {
        // Only effective for specific users
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

## Actual Usage Example

### Usage in Service

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

This real usage example demonstrates how to apply data permission annotations in MineAdmin to control access permissions for user lists.

Through this architecture design, MineAdmin implements declarative data permission control. Developers only need to add the `@DataScope` annotation to methods, and the system will automatically filter data based on the current user's permission policy.