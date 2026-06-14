# 核心概念

本功能指在系統中實現資料的分層管理和許可權控制，主要包括部門管理、崗位管理、資料許可權等模組。

相對比 `master` 分支來說新增了部門管理和崗位管理的功能模組、實現了多種資料隔離方式，增強了系統的組織架構和角色定義能力。

## 系統架構圖

```plantuml
@startuml
!theme plain
title 資料許可權系統架構

package "核心模型" {
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

package "許可權引擎" {
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

package "AOP層" {
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

User --> Policy : 使用者策略
Position --> Policy : 崗位策略
User --> Position : 多崗位
Position --> Department : 部門歸屬
Factory --> Context : 讀取配置
DataScope --> DataScopeAspect : 觸發攔截
DataScopeAspect --> Factory : 執行許可權過濾

@enduml
```

## 許可權驗證流程

```plantuml
@startuml
!theme plain
title 資料許可權驗證流程

start

:接收查詢請求;
:DataScope註解攔截;

if (使用者是超級管理員?) then (是)
  :跳過許可權檢查;
  :返回完整資料;
  stop
endif

:獲取當前使用者;
:查詢使用者策略;

if (使用者有直接策略?) then (有)
  :使用使用者策略;
else (無)
  :查詢使用者崗位;
  if (崗位有策略?) then (有)
    :使用崗位策略;
  else (無)
    :返回空資料;
    stop
  endif
endif

:解析策略型別;
switch (PolicyType)
case (SELF)
  :過濾個人資料;
case (DEPT_SELF)
  :過濾本部門資料;
case (DEPT_TREE)
  :過濾部門樹資料;
case (ALL)
  :訪問全部資料;
case (CUSTOM_DEPT)
  :過濾自定義部門;
case (CUSTOM_FUNC)
  :執行自定義函式;
endswitch

:構建查詢條件;
:注入到 Query Builder;
:執行過濾查詢;
:返回許可權內資料;

stop
@enduml
```

## 核心元件

### 部門管理

#### 功能定位

組織架構的基礎單元，實現樹形層級管理。

#### 核心特性

- 支援無限級父子部門結構
- 部門關聯崗位和使用者
- 支援設定部門負責人

#### 資料模型

```php
// /mineadmin/app/Model/Permission/Department.php
class Department {
    int $id;
    string $name; 
    int $parent_id;
    HasMany $children; // 子部門
    BelongsToMany $users; // 部門使用者
    BelongsToMany $leaders; // 部門領導
    
    // 遞迴獲取所有子部門
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

### 崗位管理

#### 功能定位

部門內的職能角色定義

#### 核心特性

- 必須歸屬於具體部門
- 可設定資料許可權策略
- 支援使用者多崗位分配

#### 資料模型

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

## 資料許可權體系

### 策略型別

```php
// /mineadmin/app/Model/Enums/DataPermission/PolicyType.php
enum PolicyType: string
{
    case DeptSelf = 'DEPT_SELF';     // 本部門
    case DeptTree = 'DEPT_TREE';     // 本部門及下級部門
    case All = 'ALL';                // 全部資料
    case Self = 'SELF';              // 僅本人
    case CustomDept = 'CUSTOM_DEPT'; // 自定義部門
    case CustomFunc = 'CUSTOM_FUNC'; // 自定義函式
}
```

| 許可權標識碼 | 型別 | 作用域 | 備註 |
|-------|----|-----|----|
| DEPT_SELF | 部門 | 當前部門 | 僅限當前部門資料 |
| DEPT_TREE | 部門 | 當前部門及子部門 | 包括當前部門和所有子部門資料 |
| ALL | 全域性 | 全部資料 | 包括所有部門和使用者資料 |
| SELF | 個人 | 個人資料 | 僅限當前使用者資料 |
| CUSTOM_DEPT | 自定義 | 自定義部門 | 允許選擇特定部門 |
| CUSTOM_FUNC | 自定義 | 自定義函式 | 允許自定義處理邏輯 |

### 隔離方式

```php
// /mineadmin/app/Library/DataPermission/ScopeType.php
enum ScopeType: int
{
    case DEPT = 1;                    // 只根據部門過濾
    case CREATED_BY = 2;              // 只根據建立人過濾
    case DEPT_CREATED_BY = 3;         // 根據部門 and 建立人過濾
    case DEPT_OR_CREATED_BY = 4;      // 根據部門 or 建立人過濾
}
```

### 實現機制

資料許可權透過與`崗位` or `使用者` 關聯的`資料許可權策略`實現。每個崗位或使用者可以有一個或多個數據許可權策略，系統根據這些策略來過濾和控制資料訪問。

#### 策略模型

```php
// /mineadmin/app/Model/DataPermission/Policy.php
class Policy {
    int $user_id; // 使用者ID
    int $position_id; // 崗位ID 
    PolicyType $policy_type;
    bool $is_default;
    array $value; // 策略值
}
```

#### 策略解析優先順序

```php
// /mineadmin/app/Model/Permission/User.php:160-179
public function getPolicy(): ?Policy
{
    // 1. 優先檢查使用者專屬策略
    $policy = $this->policy()->first();
    if (! empty($policy)) {
        return $policy;
    }

    // 2. 如果使用者沒有直接策略，則查詢崗位策略
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

#### 執行流程

```plantuml
@startuml
!theme plain

participant Controller
participant DataScopeAspect  
participant Factory
participant Context
participant QueryBuilder

Controller -> DataScopeAspect: 資料查詢請求
DataScopeAspect -> Factory: 獲取當前使用者策略
Factory -> Context: 讀取許可權配置
Context --> Factory: 返回配置資訊
Factory -> QueryBuilder: 注入查詢條件
QueryBuilder --> Controller: 返回過濾後資料
@enduml
```

## 核心API

### DataScope 註解

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

### Context 上下文管理

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

### Factory 許可權工廠

```php
// /mineadmin/app/Library/DataPermission/Factory.php
class Factory
{
    public static function make(): self;
    
    public function build(Builder $builder, User $user): void
    {
        if ($user->isSuperAdmin()) {
            return; // 超級管理員跳過許可權檢查
        }
        
        if (($policy = $user->getPolicy()) === null) {
            return; // 無策略則跳過
        }
        
        // 根據 ScopeType 處理不同的資料許可權邏輯
        $scopeType = Context::getScopeType();
        // ... 許可權處理邏輯
    }
}
```

## 安全特性

### 超級管理員繞過

超級管理員會自動跳過所有資料許可權檢查：

```php
// /mineadmin/app/Library/DataPermission/Factory.php:37-39
if ($user->isSuperAdmin()) {
    return; // 超級管理員跳過所有資料許可權檢查
}
```

### 自定義函式支援

系統支援透過配置檔案定義自定義許可權函式：

```php
// /mineadmin/config/autoload/department/custom.php
return [
    'testction' => function (Builder $builder, ScopeType $scopeType, Policy $policy, User $user) {
        // 自定義許可權邏輯
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
            // ... 其他邏輯
        }
    }
];
```