# コアコンセプト

本機能は、システムにおけるデータの階層管理と権限制御を実現するものであり、主に部門管理、役職管理、データ権限などのモジュールを含みます。

`master` ブランチと比較して、部門管理と役職管理の機能モジュールが新たに追加され、複数のデータ分離方式が実装され、システムの組織構造とロール定義能力が強化されています。

## システムアーキテクチャ図

```plantuml
@startuml
!theme plain
title データ権限システムアーキテクチャ

package "コアモデル" {
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

package "権限エンジン" {
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

User --> Policy : ユーザーポリシー
Position --> Policy : 役職ポリシー
User --> Position : 複数役職
Position --> Department : 部門所属
Factory --> Context : 設定読み取り
DataScope --> DataScopeAspect : インターセプトトリガー
DataScopeAspect --> Factory : 権限フィルタリング実行

@enduml
```

## 権限検証フロー

```plantuml
@startuml
!theme plain
title データ権限検証フロー

start

:クエリリクエストを受信;
:DataScopeアノテーションでインターセプト;

if (ユーザーはスーパー管理者?) then (はい)
  :権限チェックをスキップ;
  :全データを返す;
  stop
endif

:現在のユーザーを取得;
:ユーザーポリシーを照会;

if (ユーザーに直接ポリシーがある?) then (ある)
  :ユーザーポリシーを使用;
else (ない)
  :ユーザーの役職を照会;
  if (役職にポリシーがある?) then (ある)
    :役職ポリシーを使用;
  else (ない)
    :空データを返す;
    stop
  endif
endif

:ポリシータイプを解析;
switch (PolicyType)
case (SELF)
  :個人データをフィルタリング;
case (DEPT_SELF)
  :自部門データをフィルタリング;
case (DEPT_TREE)
  :部門ツリーデータをフィルタリング;
case (ALL)
  :全データにアクセス;
case (CUSTOM_DEPT)
  :カスタム部門をフィルタリング;
case (CUSTOM_FUNC)
  :カスタム関数を実行;
endswitch

:クエリ条件を構築;
:Query Builderに注入;
:フィルタリングクエリを実行;
:権限内データを返す;

stop
@enduml
```

## コアコンポーネント

### 部門管理

#### 機能位置付け

組織構造の基本単位であり、ツリー階層管理を実現します。

#### コア特性

- 無制限の親子部門構造をサポート
- 部門と役職・ユーザーの関連付け
- 部門責任者の設定をサポート

#### データモデル

```php
// /mineadmin/app/Model/Permission/Department.php
class Department {
    int $id;
    string $name; 
    int $parent_id;
    HasMany $children; // 子部門
    BelongsToMany $users; // 部門ユーザー
    BelongsToMany $leaders; // 部門リーダー
    
    // 再帰的に全子部門を取得
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

### 役職管理

#### 機能位置付け

部門内の職能ロール定義

#### コア特性

- 特定の部門に所属する必要がある
- データ権限ポリシーを設定可能
- ユーザーへの複数役職割り当てをサポート

#### データモデル

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

## データ権限体系

### ポリシータイプ

```php
// /mineadmin/app/Model/Enums/DataPermission/PolicyType.php
enum PolicyType: string
{
    case DeptSelf = 'DEPT_SELF';     // 自部門
    case DeptTree = 'DEPT_TREE';     // 自部門および下位部門
    case All = 'ALL';                // 全データ
    case Self = 'SELF';              // 本人のみ
    case CustomDept = 'CUSTOM_DEPT'; // カスタム部門
    case CustomFunc = 'CUSTOM_FUNC'; // カスタム関数
}
```

| 権限識別コード | タイプ | スコープ | 備考 |
|-------|----|-----|----|
| DEPT_SELF | 部門 | 現在の部門 | 現在の部門データのみ |
| DEPT_TREE | 部門 | 現在の部門および子部門 | 現在の部門と全子部門データを含む |
| ALL | グローバル | 全データ | 全部門と全ユーザーデータを含む |
| SELF | 個人 | 個人データ | 現在のユーザーデータのみ |
| CUSTOM_DEPT | カスタム | カスタム部門 | 特定の部門を選択可能 |
| CUSTOM_FUNC | カスタム | カスタム関数 | カスタム処理ロジックを許可 |

### 分離方式

```php
// /mineadmin/app/Library/DataPermission/ScopeType.php
enum ScopeType: int
{
    case DEPT = 1;                    // 部門のみでフィルタリング
    case CREATED_BY = 2;              // 作成者のみでフィルタリング
    case DEPT_CREATED_BY = 3;         // 部門 AND 作成者でフィルタリング
    case DEPT_OR_CREATED_BY = 4;      // 部門 OR 作成者でフィルタリング
}
```

### 実装メカニズム

データ権限は、`役職` または `ユーザー` に関連付けられた `データ権限ポリシー` によって実現されます。各役職またはユーザーは1つ以上のデータ権限ポリシーを持つことができ、システムはこれらのポリシーに基づいてデータアクセスをフィルタリングおよび制御します。

#### ポリシーモデル

```php
// /mineadmin/app/Model/DataPermission/Policy.php
class Policy {
    int $user_id; // ユーザーID
    int $position_id; // 役職ID 
    PolicyType $policy_type;
    bool $is_default;
    array $value; // ポリシー値
}
```

#### ポリシー解析優先順位

```php
// /mineadmin/app/Model/Permission/User.php:160-179
public function getPolicy(): ?Policy
{
    // 1. ユーザー専用ポリシーを優先チェック
    $policy = $this->policy()->first();
    if (! empty($policy)) {
        return $policy;
    }

    // 2. ユーザーに直接ポリシーがない場合、役職ポリシーを検索
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

#### 実行フロー

```plantuml
@startuml
!theme plain

participant Controller
participant DataScopeAspect  
participant Factory
participant Context
participant QueryBuilder

Controller -> DataScopeAspect: データクエリリクエスト
DataScopeAspect -> Factory: 現在のユーザーポリシーを取得
Factory -> Context: 権限設定を読み取り
Context --> Factory: 設定情報を返す
Factory -> QueryBuilder: クエリ条件を注入
QueryBuilder --> Controller: フィルタリング後のデータを返す
@enduml
```

## コアAPI

### DataScope アノテーション

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

### Context コンテキスト管理

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

### Factory 権限ファクトリー

```php
// /mineadmin/app/Library/DataPermission/Factory.php
class Factory
{
    public static function make(): self;
    
    public function build(Builder $builder, User $user): void
    {
        if ($user->isSuperAdmin()) {
            return; // スーパー管理者は権限チェックをスキップ
        }
        
        if (($policy = $user->getPolicy()) === null) {
            return; // ポリシーがない場合はスキップ
        }
        
        // ScopeTypeに応じて異なるデータ権限ロジックを処理
        $scopeType = Context::getScopeType();
        // ... 権限処理ロジック
    }
}
```

## セキュリティ特性

### スーパー管理者バイパス

スーパー管理者は自動的にすべてのデータ権限チェックをスキップします：

```php
// /mineadmin/app/Library/DataPermission/Factory.php:37-39
if ($user->isSuperAdmin()) {
    return; // スーパー管理者はすべてのデータ権限チェックをスキップ
}
```

### カスタム関数サポート

システムは設定ファイルを介してカスタム権限関数を定義することをサポートしています：

```php
// /mineadmin/config/autoload/department/custom.php
return [
    'testction' => function (Builder $builder, ScopeType $scopeType, Policy $policy, User $user) {
        // カスタム権限ロジック
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
            // ... その他のロジック
        }
    }
];
```