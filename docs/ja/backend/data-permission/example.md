# 使用例

データ権限をコードで使用する場合、現在は動的な有効化と無効化をサポートしています。以下に一般的な開発例をいくつか紹介します。

## モデル全体に対するデータ権限制御

デフォルトの `User` モデルを例に、`User` モデルにデータ権限制御を適用する場合を考えます。

`User` モデルで `DataScopes` trait を使用してデータ権限スコープを有効化できます。

```php
// /mineadmin/app/Library/DataPermission/Scope/DataScope.php
use App\Library\DataPermission\Scope\DataScopes;

class User extends Model {
    // データ権限スコープを使用
    use DataScopes;

    // その他のコード...
}
```

これにより、`User` モデルに対するすべてのクエリに自動的にデータ権限制御が適用されます。

## 特定のコードブロックに対するデータ権限制御

Hyperf AOPの機能を活用し、クラスやメソッドに[DataScope](https://github.com/mineadmin/MineAdmin/blob/master-department/app/Library/DataPermission/Attribute/DataScope.php)アノテーションを使用して、指定したコードブロックにデータ権限制御を適用できます。

ユーザーモジュールの[ページネーションリスト](https://github.com/mineadmin/MineAdmin/blob/master-department/app/Service/Permission/UserService.php#L93~L100)を例にします。

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

これにより、`page`メソッドを呼び出す際に、データ権限が自動的にクエリに適用されます。

## 特定のORMクエリに対する権限制御

より細かい権限分離が必要な特定のシナリオでは、`Factory::make()->build()`メソッドを使用して指定したクエリに制限をかけることができます。

```php
// Factoryを使用して手動で権限フィルタリング
use App\Library\DataPermission\Factory;
use App\Model\Permission\User;

class DemoService {

    public function test(User $user): void {
        $userQuery = User::query();
        
        // UserQueryに個別にデータ分離を適用
        Factory::make()->build($userQuery->getQuery(), $user);
        
        $result = $userQuery->get();
    }
}
```

## Contextを使用したデータ権限設定

### 基本的な設定方法

```php
// /mineadmin/app/Library/DataPermission/Context.php
use App\Library\DataPermission\Context;
use App\Library\DataPermission\ScopeType;

// 部門フィールド名を設定
Context::setDeptColumn('department_id');
// 作成者フィールド名を設定
Context::setCreatedByColumn('creator');
// 分離方法を設定
Context::setScopeType(ScopeType::DEPT_CREATED_BY);
// 指定テーブルのみにデータ分離を適用
Context::setOnlyTables(['user', 'orders']);

$query = User::query();
Factory::make()->build($query->getQuery(), $user);
```

### DataScopeアノテーションの完全な設定

```php
// /mineadmin/app/Library/DataPermission/Attribute/DataScope.php
#[DataScope(
    // 部門フィールド名（デフォルト：dept_id）
    deptColumn: 'department_id',
    
    // 作成者フィールド名（デフォルト：created_by）
    createdByColumn: 'creator_id',
    
    // 分離方法（デフォルト：ScopeType::DEPT_CREATED_BY）
    scopeType: ScopeType::DEPT_SELF,
    
    // 指定テーブルのみに適用（デフォルト：null、すべてのテーブルに適用）
    onlyTables: ['orders', 'order_items']
)]
public function getFilteredData(): Collection
{
    return Order::with('items')->get();
}
```

## ポリシータイプの使用例

### DEPT_SELF - 自部門権限

```php
// 出典：/Users/zhuzhu/project/mineadmin/app/Model/Enums/DataPermission/PolicyType.php
#[DataScope(scopeType: ScopeType::DEPT)]
public function getDepartmentUsers(): Collection
{
    // 現在のユーザーが所属する部門のユーザーのみを自動的にフィルタリング
    return User::query()->get();
}
```

### DEPT_TREE - 部門ツリー権限  

```php
#[DataScope(scopeType: ScopeType::DEPT)]
public function getDepartmentTreeUsers(): Collection
{
    // 現在の部門とすべての子部門のユーザーを自動的に含める
    return User::query()->get();
}
```

### CREATED_BY - 作成者権限

```php
#[DataScope(scopeType: ScopeType::CREATED_BY)]
public function getMyCreatedData(): Collection
{
    // 現在のユーザーが作成したデータのみを返す
    return Document::query()->get();
}
```

### 組み合わせ権限の使用

```php
// AND条件：自部門かつ自分が作成したデータ
#[DataScope(scopeType: ScopeType::DEPT_CREATED_BY)]
public function getMyDeptData(): Collection
{
    return Document::query()->get();
}

// OR条件：自部門または自分が作成したデータ
#[DataScope(scopeType: ScopeType::DEPT_OR_CREATED_BY)]
public function getDeptOrMyData(): Collection
{
    return Document::query()->get();
}
```

## カスタム関数ポリシー

### カスタム関数の作成

```php
// /mineadmin/config/autoload/department/custom.php
return [
    'my_custom_filter' => function (Builder $builder, ScopeType $scopeType, Policy $policy, User $user) {
        // カスタムビジネスロジック
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

### カスタム関数の使用

カスタム関数を使用するには、ポリシータイプを`CUSTOM_FUNC`に設定し、ポリシーの`value`フィールドに関数名を指定します：

```php
// データベースにポリシーレコードを作成
Policy::create([
    'user_id' => $userId,
    'policy_type' => PolicyType::CustomFunc,
    'value' => ['my_custom_filter'],  // カスタム関数名
    'is_default' => true
]);
```

## データ権限とビジネスシナリオの統合

### 注文管理システム

```php
class OrderService 
{
    // 一般従業員は自分が作成した注文のみ閲覧可能
    #[DataScope(
        scopeType: ScopeType::CREATED_BY,
        onlyTables: ['orders']
    )]
    public function getMyOrders(): Collection
    {
        return Order::query()->get();
    }
    
    // 部門マネージャーは部門全体の注文を閲覧可能
    #[DataScope(
        scopeType: ScopeType::DEPT,
        onlyTables: ['orders']
    )]
    public function getDepartmentOrders(): Collection
    {
        return Order::query()->get();
    }
    
    // 地域マネージャーは部門ツリー全体の注文を閲覧可能
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

### ドキュメント管理システム

```php
class DocumentService
{
    // ドキュメント権限：部門共有 + 個人プライベート
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

## 複数テーブル結合クエリ

複数テーブルの結合が必要な場合、`onlyTables`パラメータを使用してどのテーブルにデータ権限を適用するかを指定できます：

```php
#[DataScope(
    scopeType: ScopeType::DEPT_SELF,
    onlyTables: ['orders']  // ordersテーブルのみに権限フィルタリングを適用
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

::: warning コルーチンコンテキスト

どの使用方法でも、新しいコルーチンを開始する場合は、再度設定する必要があります。

```php
// ❌ 誤り：コルーチン内で権限が失われる
Co::create(function () {
    // 権限設定が失われ、誤ったデータが返される可能性
    $data = User::query()->get();
});

// ✅ 正しい：コルーチン権限を再設定
Co::create(function () use ($user) {
    // コンテキストを再設定する必要がある
    Context::setDeptColumn('dept_id');
    Context::setCreatedByColumn('created_by');
    Context::setScopeType(ScopeType::DEPT_SELF);
    
    $data = User::query()->get();
});
```

:::

## 完全なAPIリファレンス

### DataScopeアノテーションパラメータ

| パラメータ | タイプ | デフォルト値 | 説明 |
|------|------|--------|------|
| `deptColumn` | string | `'dept_id'` | 部門フィールド名 |
| `createdByColumn` | string | `'created_by'` | 作成者フィールド名 |
| `scopeType` | ScopeType | `ScopeType::DEPT_CREATED_BY` | 権限範囲タイプ |
| `onlyTables` | array\|null | `null` | 指定テーブルのみに適用、nullならすべてのテーブルに適用 |

### Contextクラスメソッド

| メソッド | 説明 |
|------|------|
| `Context::setDeptColumn(string)` | 部門フィールド名を設定 |
| `Context::setCreatedByColumn(string)` | 作成者フィールド名を設定 |
| `Context::setScopeType(ScopeType)` | 権限範囲タイプを設定 |
| `Context::setOnlyTables(array)` | 指定テーブルのみに適用 |
| `Context::getDeptColumn()` | 部門フィールド名を取得 |
| `Context::getCreatedByColumn()` | 作成者フィールド名を取得 |
| `Context::getScopeType()` | 権限範囲タイプを取得 |
| `Context::getOnlyTables()` | 指定テーブルリストを取得 |

### Factoryクラスメソッド

| メソッド | 説明 |
|------|------|
| `Factory::make()` | ファクトリインスタンスを作成 |
| `Factory::build(Builder, User)` | クエリビルダーに権限フィルタリングを適用 |

### ScopeType列挙値

| 値 | 説明 |
|----|------|
| `ScopeType::DEPT` | 部門のみでフィルタリング |
| `ScopeType::CREATED_BY` | 作成者のみでフィルタリング |
| `ScopeType::DEPT_CREATED_BY` | 部門 AND 作成者でフィルタリング |
| `ScopeType::DEPT_OR_CREATED_BY` | 部門 OR 作成者でフィルタリング |

### PolicyType列挙値

| 値 | 説明 |
|----|------|
| `PolicyType::DeptSelf` | 自部門 |
| `PolicyType::DeptTree` | 自部門及び子部門 |
| `PolicyType::All` | 全データ |
| `PolicyType::Self` | 本人のみ |
| `PolicyType::CustomDept` | カスタム部門 |
| `PolicyType::CustomFunc` | カスタム関数 |