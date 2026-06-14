# Core Concepts

This feature implements hierarchical data management and permission control in the system, mainly including modules such as department management, position management, and data permissions.

Compared to the `master` branch, it adds department management and position management functional modules, implements multiple data isolation methods, and enhances the system's organizational structure and role definition capabilities.

## System Architecture Diagram

```plantuml
@startuml
!theme plain
title Data Permission System Architecture

package "Core Model" {
  class User {
    +getPolicy(): ?Policy
    +isSuperAdmin(): bool
    +department(): BelongsToMany
    +position(): BelongsToMany
  }
  
  class Policy {
    +user_id: int
    +position_id: int
    +policy_type: PolicyType
    +value: array
  }
  
  class Department {
    +parent_id: int
    +getFlatChildren(): Collection
  }
  
  class Position {
    +dept_id: int
    +policy(): HasOne
  }
}

package "Permission Engine" {
  class Factory {
    +build(Builder, User): void
  }
  
  class Context {
    +setDeptColumn(string): void
    +setScopeType(ScopeType): void
  }
  
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

User --> Policy : User Policy
Position --> Policy : Position Policy
User --> Position : Multiple Positions
Position --> Department : Department Affiliation
Factory --> Context : Read Configuration
DataScope --> DataScopeAspect : Trigger Interception
DataScopeAspect --> Factory : Execute Permission Filtering

@enduml
```

## Permission Verification Process

```plantuml
@startuml
!theme plain
title Data Permission Verification Process

start

:Receive query request;
:DataScope annotation interception;

if (Is user super admin?) then (Yes)
  :Skip permission check;
  :Return complete data;
  stop
endif

:Get current user;
:Query user policy;

if (User has direct policy?) then (Yes)
  :Use user policy;
else (No)
  :Query user positions;
  if (Position has policy?) then (Yes)
    :Use position policy;
  else (No)
    :Return empty data;
    stop
  endif
endif

:Parse policy type;
switch (PolicyType)
case (SELF)
  :Filter personal data;
case (DEPT_SELF)
  :Filter current department data;
case (DEPT_TREE)
  :Filter department tree data;
case (ALL)
  :Access all data;
case (CUSTOM_DEPT)
  :Filter custom departments;
case (CUSTOM_FUNC)
  :Execute custom function;
endswitch

:Build query conditions;
:Inject into Query Builder;
:Execute filtered query;
:Return data within permissions;

stop
@enduml
```

## Core Components

### Department Management

#### Functional Positioning

Basic unit of organizational structure, implementing tree hierarchical management.

#### Core Features

- Supports unlimited hierarchical parent-child department structure
- Departments associated with positions and users
- Supports setting department heads

#### Data Model

```php
// /mineadmin/app/Model/Permission/Department.php
class Department {
    int $id;
    string $name; 
    int $parent_id;
    HasMany $children; // Sub-departments
    BelongsToMany $users; // Department users
    BelongsToMany $leaders; // Department leaders
    
    // Recursively get all child departments
    public function getFlatChildren(): Collection
    {
        $flat = collect();
        $this->load('children');
        $traverse = static function ($departments) use (&$traverse, $flat) {
            foreach ($departments as $department) {
                $flat->push($department);
                if ($department->children->isNotEmpty()) {
                    $traverse($department->children);
                }
            }
        };
        $traverse($this->children);
        return $flat->prepend($this);
    }
}
```

---

### Position Management

#### Functional Positioning

Functional role definition within departments.

#### Core Features

- Must belong to a specific department
- Can set data permission policies
- Supports assigning multiple positions to users

#### Data Model

```php
// /mineadmin/app/Model/Permission/Position.php
class Position {
    int $id;
    string $name;
    int $dept_id;
    
    public function policy(): HasOne
    {
        return $this->hasOne(Policy::class, 'position_id', 'id');
    }
}
```

## Data Permission System

### Policy Types

```php
// /mineadmin/app/Model/Enums/DataPermission/PolicyType.php
enum PolicyType: string
{
    case DeptSelf = 'DEPT_SELF';     // Current department
    case DeptTree = 'DEPT_TREE';     // Current department and sub-departments
    case All = 'ALL';                // All data
    case Self = 'SELF';              // Self only
    case CustomDept = 'CUSTOM_DEPT'; // Custom departments
    case CustomFunc = 'CUSTOM_FUNC'; // Custom function
}
```

| Permission Code | Type | Scope | Notes |
|-------|----|-----|----|
| DEPT_SELF | Department | Current department | Current department data only |
| DEPT_TREE | Department | Current department and sub-departments | Includes current department and all sub-department data |
| ALL | Global | All data | Includes all department and user data |
| SELF | Personal | Personal data | Current user data only |
| CUSTOM_DEPT | Custom | Custom departments | Allows selecting specific departments |
| CUSTOM_FUNC | Custom | Custom function | Allows custom processing logic |

### Isolation Methods

```php
// /mineadmin/app/Library/DataPermission/ScopeType.php
enum ScopeType: int
{
    case DEPT = 1;                    // Filter by department only
    case CREATED_BY = 2;              // Filter by creator only
    case DEPT_CREATED_BY = 3;         // Filter by department and creator
    case DEPT_OR_CREATED_BY = 4;      // Filter by department or creator
}
```

### Implementation Mechanism

Data permissions are implemented through `data permission policies` associated with `positions` or `users`. Each position or user can have one or more data permission policies, and the system filters and controls data access based on these policies.

#### Policy Model

```php
// /mineadmin/app/Model/DataPermission/Policy.php
class Policy {
    int $user_id; // User ID
    int $position_id; // Position ID 
    PolicyType $policy_type;
    bool $is_default;
    array $value; // Policy value
}
```

#### Policy Resolution Priority

```php
// /mineadmin/app/Model/Permission/User.php:160-179
public function getPolicy(): ?Policy
{
    // 1. Check user-specific policy first
    $policy = $this->policy()->first();
    if (! empty($policy)) {
        return $policy;
    }

    // 2. If user has no direct policy, find position policy
    $this->load('position');
    $positionList = $this->position;
    foreach ($positionList as $position) {
        $current = $position->policy()->first();
        if (! empty($current)) {
            return $current;
        }
    }
    return null;
}
```

#### Execution Flow

```plantuml
@startuml
!theme plain

participant Controller
participant DataScopeAspect  
participant Factory
participant Context
participant QueryBuilder

Controller -> DataScopeAspect: Data query request
DataScopeAspect -> Factory: Get current user policy
Factory -> Context: Read permission configuration
Context --> Factory: Return configuration info
Factory -> QueryBuilder: Inject query conditions
QueryBuilder --> Controller: Return filtered data
@enduml
```

## Core API

### DataScope Annotation

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

### Context Management

```php
// /mineadmin/app/Library/DataPermission/Context.php
final class Context
{
    public static function setDeptColumn(string $column = 'dept_id'): void;
    public static function setCreatedByColumn(string $column = 'created_by'): void;
    public static function setScopeType(ScopeType $scopeType): void;
    public static function setOnlyTables(?array $tables): void;
    
    public static function getDeptColumn(): string;
    public static function getCreatedByColumn(): string;
    public static function getScopeType(): ScopeType;
    public static function getOnlyTables(): array;
}
```

### Factory Permission Factory

```php
// /mineadmin/app/Library/DataPermission/Factory.php
class Factory
{
    public static function make(): self;
    
    public function build(Builder $builder, User $user): void
    {
        if ($user->isSuperAdmin()) {
            return; // Super admin skips permission check
        }
        
        if (($policy = $user->getPolicy()) === null) {
            return; // Skip if no policy
        }
        
        // Process different data permission logic based on ScopeType
        $scopeType = Context::getScopeType();
        // ... Permission processing logic
    }
}
```

## Security Features

### Super Admin Bypass

Super admins automatically bypass all data permission checks:

```php
// /mineadmin/app/Library/DataPermission/Factory.php:37-39
if ($user->isSuperAdmin()) {
    return; // Super admin bypasses all data permission checks
}
```

### Custom Function Support

The system supports defining custom permission functions through configuration files:

```php
// /mineadmin/config/autoload/department/custom.php
return [
    'testction' => function (Builder $builder, ScopeType $scopeType, Policy $policy, User $user) {
        // Custom permission logic
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
                $builder->whereIn($deptColumn, $user->department()->get()->pluck('id'));
                break;
            // ... Other logic
        }
    }
];
```