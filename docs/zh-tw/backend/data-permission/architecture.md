# 系統架構

## 資料許可權系統架構設計

MineAdmin 資料許可權系統基於 AOP（面向切面程式設計）設計，透過註解和切面攔截的方式自動為資料查詢注入許可權過濾條件。

## 核心元件架構圖

```plantuml
@startuml
!theme plain

package "資料模型層" {
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

package "許可權引擎" {
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

package "AOP 層" {
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

package "列舉定義" {
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

User --> Policy : 關聯策略
Position --> Policy : 關聯策略
User --> Department : 所屬部門
Position --> Department : 歸屬部門
Factory --> Rule : 使用規則
Factory --> Context : 讀取上下文
DataScope --> DataScopeAspect : 觸發切面
DataScopeAspect --> Factory : 呼叫工廠

@enduml
```

## 許可權解析流程

```plantuml
@startuml
!theme plain

start

:接收查詢請求;
:DataScope 註解攔截;

if (使用者是超級管理員?) then (是)
    :跳過許可權檢查;
    stop
endif

:獲取當前使用者;

note right
來源：User.php:160-179
getPolicy() 方法
end note

if (使用者有直接策略?) then (有)
    :使用使用者策略;
else (無)
    :遍歷使用者崗位;
    if (崗位有策略?) then (有)
        :使用第一個崗位策略;
    else (無)
        :返回空結果;
        stop
    endif
endif

:根據 ScopeType 處理;

note right
來源：Factory.php:51-65
處理不同的 ScopeType
end note

switch (ScopeType)
case (CREATED_BY)
    :過濾建立人資料;
case (DEPT)
    :過濾部門資料;
case (DEPT_CREATED_BY)
    :AND 條件過濾;
case (DEPT_OR_CREATED_BY)
    :OR 條件過濾;
endswitch

:構建 WHERE 條件;
:注入到 QueryBuilder;
:執行查詢;

stop

@enduml
```

## 資料許可權執行機制

### Factory 工廠類

許可權過濾的核心實現：

```php
// /mineadmin/app/Library/DataPermission/Factory.php
class Factory
{
    public function build(Builder $builder, User $user): void 
    {
        // 1. 超級管理員繞過檢查
        if ($user->isSuperAdmin()) {
            return;
        }
        
        // 2. 獲取使用者策略
        if (($policy = $user->getPolicy()) === null) {
            return;
        }
        
        // 3. 獲取當前 ScopeType
        $scopeType = Context::getScopeType();
        
        // 4. 處理自定義函式
        if ($policy->policy_type === PolicyType::CustomFunc) {
            $customFunc = $policy->value[0] ?? null;
            $this->rule->loadCustomFunc($customFunc, $builder, $user, $policy, $scopeType);
        }
        
        // 5. 根據 ScopeType 處理不同的過濾邏輯
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

### 具體過濾實現

各種過濾條件的具體實現：

```php
// /mineadmin/app/Library/DataPermission/Factory.php:67-102

// 建立人過濾
private function handleCreatedBy(User $user, Policy $policy, Builder $builder): void
{
    $builder->when($this->rule->getCreatedByList($user, $policy), 
        static function (Builder $query, array $createdByList) {
            $query->whereIn(Context::getCreatedByColumn(), $createdByList);
        });
}

// 部門過濾
private function handleDept(User $user, Policy $policy, Builder $builder): void
{
    $builder->when($this->rule->getDeptIds($user, $policy), 
        static function (Builder $query, array $deptList) {
            $query->whereIn(Context::getDeptColumn(), $deptList);
        });
}

// 部門 AND 建立人過濾
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

// 部門 OR 建立人過濾
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

### 上下文儲存機制

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
    
    // ... 其他方法類似
}
```

## 部門層級處理

### 遞迴部門樹演算法

```php
// /mineadmin/app/Model/Permission/Department.php
public function getFlatChildren(): Collection
{
    $flat = collect();
    $this->load('children'); // 預載入子部門
    
    $traverse = static function ($departments) use (&$traverse, $flat) {
        foreach ($departments as $department) {
            $flat->push($department);
            if ($department->children->isNotEmpty()) {
                $traverse($department->children); // 遞迴處理
            }
        }
    };
    
    $traverse($this->children);
    return $flat->prepend($this); // 包含自身
}
```

### 部門許可權處理流程

```plantuml
@startuml
!theme plain

start
:獲取使用者部門;

if (策略型別 == DEPT_SELF?) then (是)
    :只獲取當前部門ID;
else (否)
    if (策略型別 == DEPT_TREE?) then (是)
        :獲取當前部門;
        :呼叫 getFlatChildren();
        :遞迴獲取所有子部門;
        :返回部門ID陣列;
    else (否)
        if (策略型別 == CUSTOM_DEPT?) then (是)
            :從策略配置讀取部門ID;
        endif
    endif
endif

:構建 WHERE IN 條件;
:dept_id IN (1,2,3...);

stop
@enduml
```

## AOP 切面機制

### DataScope 註解定義

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

### 切面攔截處理

```plantuml
@startuml
!theme plain

participant "業務方法" as method
participant "DataScopeAspect" as aspect  
participant "Factory" as factory
participant "QueryBuilder" as builder

method -> aspect: 呼叫帶@DataScope註解的方法
aspect -> aspect: 解析DataScope註解引數
aspect -> factory: 獲取Factory例項
aspect -> builder: 攔截QueryBuilder
factory -> builder: 注入許可權過濾條件
builder -> method: 返回過濾後的查詢
method -> method: 執行業務邏輯

@enduml
```

## 自定義函式擴充套件

### 自定義函式配置

```php
// /mineadmin/config/autoload/department/custom.php
return [
    'testction' => function (Builder $builder, ScopeType $scopeType, Policy $policy, User $user) {
        // 只針對特定使用者生效
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

## 實際使用示例

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

這個真實的使用示例展示瞭如何在 MineAdmin 中應用資料許可權註解來控制使用者列表的訪問許可權。

透過這個架構設計，MineAdmin 實現了宣告式的資料許可權控制，開發者只需要在方法上新增 `@DataScope` 註解，系統就會自動根據當前使用者的許可權策略過濾資料。