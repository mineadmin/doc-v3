# 使用例

コード内でデータ権限を使用する場合、現在複数の方法で動的な有効化・無効化がサポートされています。以下によくある開発事例をいくつか挙げます。

## モデル全体に対するデータ権限制御

デフォルトの `User` モデルを例に、`User` モデルに対してデータ権限制御が必要な場合を想定します。

`User` モデルで `DataScopes` トレイトを `use` することで、データ権限スコープを有効化できます。

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

Hyperf の AOP 機能を活用し、クラスやクラスメソッドに [DataScope](https://github.com/mineadmin/MineAdmin/blob/master-department/app/Library/DataPermission/Attribute/DataScope.php) アノテーションを使用して、指定したコードブロックに対してデータ権限制御を有効化できます。

組み込みのユーザーモジュールの[ページネーションリスト](https://github.com/mineadmin/MineAdmin/blob/master-department/app/Service/Permission/UserService.php#L93~L100)を例とします。

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

これにより、`page` メソッド呼び出し時に、データ権限が自動的にクエリに適用されます。

## 指定した ORM Query に対する権限制御

特定のシナリオでは、より細かい権限の分離が必要になる場合があります。その場合は、`Factory::make()->build()` メソッドを使用して、指定した Query を制限できます。

```php
// Factory を手動で使用して権限フィルタリングを行う
use App\Library\DataPermission\Factory;
use App\Model\Permission\User;

class DemoService {

    public function test(User $user): void {
        $userQuery = User::query();
        
        // UserQuery に対して個別にデータ分離を実装
        Factory::make()->build($userQuery->getQuery(), $user);
        
        $result = $userQuery->get();
    }
}
```

## Context を使用したデータ権限の設定

### 基本的な設定方法

```php
// /mineadmin/app/Library/DataPermission/Context.php
use App\Library\DataPermission\Context;
use App\Library\DataPermission\ScopeType;

// 部署フィールド名の設定
Context::setDeptColumn('department_id');
// 作成者フィールド名の設定
Context::setCreatedByColumn('creator');
// 分離方法の設定
Context::setScopeType(ScopeType::DEPT_CREATED_BY);
// 指定したテーブルのみデータ分離を適用
Context::setOnlyTables(['user', 'orders']);

$query = User::query();
Factory::make()->build($query->getQuery(), $user);
```

### DataScope アノテーションの完全設定

```php
// /mineadmin/app/Library/DataPermission/Attribute/DataScope.php
#[DataScope(
    // 部署フィールド名（デフォルト：dept_id）
    deptColumn: 'department_id',
    
    // 作成者フィールド名（デフォルト：created_by）
    createdByColumn: 'creator_id',
    
    // 分離方法（デフォルト：ScopeType::DEPT_CREATED_BY）
    scopeType: ScopeType::DEPT_SELF,
    
    // 指定したテーブルにのみ有効（デフォルト：null、すべてのテーブルに有効）
    onlyTables: ['orders', 'order_items']
)]
public function getFilteredData(): Collection
{
    return Order::with('items')->get();
}
```

## ポリシータイプの使用例

### DEPT_SELF - 自部署権限

```php
// 出典：ベース /Users/zhuzhu/project/mineadmin/app/Model/Enums/DataPermission/PolicyType.php
#[DataScope(scopeType: ScopeType::DEPT)]
public function getDepartmentUsers(): Collection
{
    // 現在のユーザーが所属する部署のユーザーに自動フィルタリング
    return User::query()->get();
}
```

### DEPT_TREE - 部署ツリー権限

```php
#[DataScope(scopeType: ScopeType::DEPT)]
public function getDepartmentTreeUsers(): Collection
{
    // 現在の部署とすべての子部署のユーザーを自動的に含む
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
// AND 条件：自部署かつ自分が作成したもの
#[DataScope(scopeType: ScopeType::DEPT_CREATED_BY)]
public function getMyDeptData(): Collection
{
    return Document::query()->get();
}

// OR 条件：自部署または自分が作成したもの
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

カスタム関数を使用するには、ポリシータイプを `CUSTOM_FUNC` に設定し、ポリシーの `value` フィールドで関数名を指定する必要があります。

```php
// データベースにポリシーレコードを作成
Policy::create([
    'user_id' => $userId,
    'policy_type' => PolicyType::CustomFunc,
    'value' => ['my_custom_filter'],  // カスタム関数名
    'is_default' => true
]);
```

## データ権限とビジネスシナリオの組み合わせ

### 注文管理システム

```php
class OrderService 
{
    // 一般社員は自分が作成した注文のみ表示可能
    #[DataScope(
        scopeType: ScopeType::CREATED_BY,
        onlyTables: ['orders']
    )]
    public function getMyOrders(): Collection
    {
        return Order::query()->get();
    }
    
    // 部署マネージャーは部署全体の注文を表示可能
    #[DataScope(
        scopeType: ScopeType::DEPT,
        onlyTables: ['orders']
    )]
    public function getDepartmentOrders(): Collection
    {
        return Order::query()->get();
    }
    
    // エリアマネージャーは部署ツリーのすべての注文を表示可能
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
    // ドキュメント権限：部署共有 + 個人プライベート
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

## 複数テーブルの関連クエリ

複数テーブルの関連がある場合、`onlyTables` パラメータを指定して、データ権限を適用するテーブルを制御できます。

```php
#[DataScope(
    scopeType: ScopeType::DEPT_SELF,
    onlyTables: ['orders']  // orders テーブルにのみ権限フィルタを適用
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

どの使用方法であっても、新しいコルーチンを開始する場合は、権限設定を再度行う必要があることに注意してください。

```php
// ❌ 誤り：コルーチン内で権限が失われる
Co::create(function () {
    // 権限設定が失われており、誤ったデータを返す可能性がある
    $data = User::query()->get();
});

// ✅ 正しい：コルーチン内で権限を再設定
Co::create(function () use ($user) {
    // コンテキストの再設定が必要
    Context::setDeptColumn('dept_id');
    Context::setCreatedByColumn('created_by');
    Context::setScopeType(ScopeType::DEPT_SELF);
    
    $data = User::query()->get();
});
```

:::

## 完全な API リファレンス

### DataScope アノテーションパラメータ

| パラメータ | 型 | デフォルト値 | 説明 |
|------|------|--------|------|
| `deptColumn` | string | `'dept_id'` | 部署フィールド名 |
| `createdByColumn` | string | `'created_by'` | 作成者フィールド名 |
| `scopeType` | ScopeType | `ScopeType::DEPT_CREATED_BY` | 権限範囲タイプ |
| `onlyTables` | array\|null | `null` | 指定したテーブルにのみ有効、null の場合は全テーブルに有効 |

### Context クラスメソッド

| メソッド | 説明 |
|------|------|
| `Context::setDeptColumn(string)` | 部署フィールド名の設定 |
| `Context::setCreatedByColumn(string)` | 作成者フィールド名の設定 |
| `Context::setScopeType(ScopeType)` | 権限範囲タイプの設定 |
| `Context::setOnlyTables(array)` | 指定テーブルのみ有効にする設定 |
| `Context::getDeptColumn()` | 部署フィールド名の取得 |
| `Context::getCreatedByColumn()` | 作成者フィールド名の取得 |
| `Context::getScopeType()` | 権限範囲タイプの取得 |
| `Context::getOnlyTables()` | 指定テーブルリストの取得 |

### Factory クラスメソッド

| メソッド | 説明 |
|------|------|
| `Factory::make()` | ファクトリインスタンスの作成 |
| `Factory::build(Builder, User)` | クエリビルダーに権限フィルタを適用 |

### ScopeType 列挙値

| 値 | 説明 |
|----|------|
| `ScopeType::DEPT` | 部署のみでフィルタリング |
| `ScopeType::CREATED_BY` | 作成者のみでフィルタリング |
| `ScopeType::DEPT_CREATED_BY` | 部署 AND 作成者でフィルタリング |
| `ScopeType::DEPT_OR_CREATED_BY` | 部署 OR 作成者でフィルタリング |

### PolicyType 列挙値

| 値 | 説明 |
|----|------|
| `PolicyType::DeptSelf` | 自部署 |
| `PolicyType::DeptTree` | 自部署および子部署 |
| `PolicyType::All` | 全データ |
| `PolicyType::Self` | 本人のみ |
| `PolicyType::CustomDept` | カスタム部署 |
| `PolicyType::CustomFunc` | カスタム関数 |