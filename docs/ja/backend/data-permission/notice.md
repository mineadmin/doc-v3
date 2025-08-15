# 注意事項とベストプラクティス

このドキュメントは、MineAdminデータ権限システムを使用する際の重要な注意事項、一般的な落とし穴、およびベストプラクティスガイドを提供します。これらのガイドラインに従うことで、システムのセキュリティ、信頼性、およびパフォーマンスを確保できます。

## ❗ 重要な注意事項

### 1. コルーチンコンテキストの分離

::: danger 重大な警告

**コルーチンコンテキストの分離はデータ権限システムのコアセキュリティ機能であり、厳守する必要があります！**

:::

#### 問題の説明

Hyperfのコルーチン環境では、各コルーチンは独立したコンテキスト空間を持ちます。コルーチンコンテキストを適切に処理しないと、以下の問題が発生する可能性があります：

- **データ漏洩**：ユーザーAのデータがユーザーBに見える
- **権限昇格**：低権限ユーザーが高権限アクセスを取得
- **データ不整合**：同じユーザーが異なるリクエストで異なるデータを見る

#### 正しい方法

```php
// ソース：/Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Context.php に基づく
use App\Library\DataPermission\Context;
use App\Library\DataPermission\ScopeType;

// ✅ 正しい：各コルーチンの開始時にコンテキストを設定
co(function () {
    // データ権限コンテキストを設定
    Context::setDeptColumn('dept_id');
    Context::setCreatedByColumn('created_by');
    Context::setScopeType(ScopeType::DEPT_CREATED_BY);
    Context::setOnlyTables(['user']);
    
    // ビジネスロジックを実行
    $data = User::query()->get();
});

// ✅ 正しい：コルーチンコンテキスト管理ヘルパークラスを作成
class CoroutineDataPermissionHelper
{
    public static function withContext(User $user, callable $callback): mixed
    {
        return co(function () use ($user, $callback) {
            // ユーザー関連の権限コンテキストを設定
            self::setupContextForUser($user);
            
            // コールバックを実行
            return $callback();
        });
    }
    
    private static function setupContextForUser(User $user): void
    {
        Context::setDeptColumn('dept_id');
        Context::setCreatedByColumn('created_by');
        
        // ユーザーポリシーに基づいて権限範囲を設定
        $policy = $user->getPolicy();
        if ($policy) {
            Context::setScopeType(ScopeType::DEPT_CREATED_BY);
        }
    }
}
```

#### 誤った方法

```php
// ❌ 誤り：コルーチン間でコンテキストを共有
$globalUser = auth()->user();
go(function () use ($globalUser) {
    // 危険！他のコルーチンのコンテキストを使用する可能性あり
    $data = User::query()->get();
});

// ❌ 誤り：コルーチンプールでコンテキストを再設定しない
for ($i = 0; $i < 10; $i++) {
    go(function () use ($i) {
        // 危険！コルーチンプールの再利用によりコンテキスト汚染が発生する可能性
        $user = User::find($i);
        // Contextの再設定が不足
        $data = User::query()->get();
    });
}
```

### 2. データベースフィールドマッピング

#### フィールド名が正しいことを確認

```php
// ソース：/Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Attribute/DataScope.php に基づく
// ✅ 正しい：フィールド名を明示的に指定
#[DataScope(
    deptColumn: 'department_id',    // データテーブルにこのフィールドが存在することを確認
    createdByColumn: 'creator_id',  // データテーブルにこのフィールドが存在することを確認
    onlyTables: ['orders', 'customers'] // 指定されたテーブルのみに適用
)]
public function getData(): Collection
{
    return Order::with('customer')->get();
}

// ✅ 正しい：フィールドの存在を検証（推奨ヘルパーメソッド）
function validatePermissionFields(string $table, array $fields): bool
{
    try {
        $schema = DB::connection()->getSchemaBuilder()->getColumnListing($table);
        
        foreach ($fields as $field) {
            if (!in_array($field, $schema)) {
                throw new \InvalidArgumentException(
                    "フィールド '{$field}' はテーブル '{$table}' に存在しません"
                );
            }
        }
        
        return true;
    } catch (\Exception $e) {
        Log::error('フィールド検証失敗', [
            'table' => $table,
            'fields' => $fields,
            'error' => $e->getMessage()
        ]);
        return false;
    }
}
```

#### 誤った方法

```php
// ❌ 誤り：存在しないフィールドを使用
#[DataScope(
    deptColumn: 'dept_id',          // テーブルのフィールドが 'department_id' の場合
    createdByColumn: 'created_by'   // テーブルのフィールドが 'creator_id' の場合
)]
public function getData(): Collection
{
    // SQLエラーまたは権限無効化の原因となる
    return Order::query()->get();
}
```

## ⚠️ セキュリティ警告

### 1. 権限バイパスの防止

::: warning セキュリティリスク

以下の行為は権限バイパスを引き起こす可能性があり、避ける必要があります！

:::

```php
// ❌ 危険：手動でSQLを構築し、権限チェックをバイパス
$sql = "SELECT * FROM users WHERE dept_id = ?";
$users = DB::select($sql, [auth()->user()->dept_id]);

// ❌ 危険：whereRawを使用して権限フィルタリングをバイパス
$users = User::whereRaw('1=1')->get();

// ❌ 危険：管理者インターフェースで権限制御を使用しない
public function adminGetAllUsers(): Collection
{
    // 危険！すべてのユーザーデータを直接返す
    return User::all();
}

// ✅ 安全：常に権限システムを使用
// ソース：/Users/zhuzhu/project/mineadmin/app/Service/Permission/UserService.php:94-98 に基づく
#[DataScope(
    scopeType: ScopeType::CREATED_BY,
    onlyTables: ['user'],
    createdByColumn: 'id'
)]
public function adminGetAllUsers(): Collection
{
    return User::query()->get();
}
```

### 2. 入力検証とセキュリティフィルタリング

```php
// ✅ 安全：ユーザー入力を検証
class SecurePermissionService
{
    public function getFilteredData(array $filters): Collection
    {
        // 入力パラメータを検証
        $this->validateFilters($filters);
        
        // ホワイトリスト検証を使用
        $allowedColumns = ['name', 'email', 'status'];
        $filters = array_intersect_key($filters, array_flip($allowedColumns));
        
        // データ権限を適用
        Context::setDeptColumn('dept_id');
        Context::setCreatedByColumn('created_by');
        Context::setScopeType(ScopeType::DEPT_CREATED_BY);
        
        return User::query()
                   ->when($filters['name'] ?? null, fn($q, $name) => $q->where('name', 'like', "%{$name}%"))
                   ->when($filters['status'] ?? null, fn($q, $status) => $q->where('status', $status))
                   ->get();
    }
    
    private function validateFilters(array $filters): void
    {
        foreach ($filters as $key => $value) {
            if (!in_array($key, ['name', 'email', 'status'])) {
                throw new \InvalidArgumentException("無効なフィルタ: {$key}");
            }
        }
    }
}
```

### 3. ログ監査

```php
// ソース：/Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Factory.php に基づく
// ✅ 重要：機密操作のログを有効化
#[DataScope(
    scopeType: ScopeType::CREATED_BY,
    onlyTables: ['financial_records']
)]
public function getFinancialData(): Collection
{
    // 機密データアクセスを記録
    Log::info('機密データアクセス', [
        'user_id' => auth()->id(),
        'operation' => 'get_financial_data',
        'ip' => request()->ip(),
        'user_agent' => request()->userAgent(),
        'timestamp' => now()
    ]);
    
    return FinancialRecord::query()->get();
}

// ✅ 権限操作監視（実装推奨）
class DataPermissionLogger
{
    public static function logPermissionAccess(User $user, string $operation): void
    {
        Log::info('データ権限アクセス', [
            'user_id' => $user->id,
            'operation' => $operation,
            'policy' => $user->getPolicy()?->toArray(),
            'ip' => request()->ip(),
            'timestamp' => now()
        ]);
    }
}
```

## 🛡️ ベストプラクティス

### 1. 権限ポリシーの設計

#### 最小権限の原則に従う

```php
// ソース：/Users/zhuzhu/project/mineadmin/app/Model/Permission/User.php:160-179 に基づく
class DataPermissionService
{
    public function getDataByUserRole(User $user): Collection
    {
        // ユーザーポリシーを取得
        $policy = $user->getPolicy();
        if (!$policy) {
            // ポリシーがない場合は最も制限的な権限を使用
            Context::setScopeType(ScopeType::CREATED_BY);
            Context::setOnlyTables(['user']);
            return collect();
        }
        
        // ポリシータイプに基づいて権限範囲を設定
        $this->configureScopeByPolicy($policy);
        
        return User::query()->get();
    }
    
    private function configureScopeByPolicy($policy): void
    {
        Context::setDeptColumn('dept_id');
        Context::setCreatedByColumn('created_by');
        
        // ポリシータイプに基づいて設定
        match($policy->policy_type->value) {
            'ALL' => Context::setScopeType(ScopeType::DEPT),
            'DEPT_TREE' => Context::setScopeType(ScopeType::DEPT_CREATED_BY),
            'DEPT_SELF' => Context::setScopeType(ScopeType::DEPT_CREATED_BY),
            'SELF' => Context::setScopeType(ScopeType::CREATED_BY),
            default => Context::setScopeType(ScopeType::CREATED_BY)
        };
    }
}
```

### 2. エラー処理戦略

```php
// ✅ ベストプラクティス：優雅なエラー処理
class SafeDataPermissionService
{
    public function executeWithFallback(callable $primaryAction, callable $fallbackAction = null): mixed
    {
        try {
            return $primaryAction();
        } catch (\Exception $e) {
            // 権限関連のエラーを記録
            Log::warning('データ権限操作失敗', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            
            // フォールバック戦略を実行
            if ($fallbackAction) {
                return $fallbackAction();
            }
            
            return collect(); // 空のコレクションを返す
        }
    }
}

// 使用例
$service = new SafeDataPermissionService();

$data = $service->executeWithFallback(
    fn() => $this->getComplexDataWithPermissions(),
    fn() => $this->getBasicUserData()  // フォールバック
);
```

### 3. パフォーマンス最適化

```php
// ✅ ベストプラクティス：パフォーマンス監視
class DataPermissionMonitor
{
    public function monitorExecution(callable $action, string $operationName): mixed
    {
        $startTime = microtime(true);
        
        try {
            $result = $action();
            
            $executionTime = (microtime(true) - $startTime) * 1000;
            
            // パフォーマンスメトリクスを記録
            if ($executionTime > 100) { // 100msを超える場合に記録
                Log::warning('データ権限操作が長時間かかりました', [
                    'operation' => $operationName,
                    'execution_time' => $executionTime . 'ms',
                    'user_id' => auth()->id()
                ]);
            }
            
            return $result;
            
        } catch (\Throwable $e) {
            Log::error('データ権限操作例外', [
                'operation' => $operationName,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
}
```

### 4. テストのベストプラクティス

```php
// ✅ ベストプラクティス：権限テスト
class DataPermissionTest extends TestCase
{
    public function test_department_isolation(): void
    {
        // テストデータを作成
        $dept1 = Department::factory()->create();
        $dept2 = Department::factory()->create();
        
        $user1 = User::factory()->create(['dept_id' => $dept1->id]);
        $user2 = User::factory()->create(['dept_id' => $dept2->id]);
        
        $order1 = Order::factory()->create(['dept_id' => $dept1->id]);
        $order2 = Order::factory()->create(['dept_id' => $dept2->id]);
        
        // ユーザー1が自分の部門のデータのみ見えることをテスト
        $this->actingAs($user1);
        
        Context::setDeptColumn('dept_id');
        Context::setScopeType(ScopeType::DEPT);
        Context::setOnlyTables(['orders']);
        
        $results = Order::query()->get();
        
        $this->assertCount(1, $results);
        $this->assertEquals($order1->id, $results->first()->id);
    }
    
    public function test_user_policy_application(): void
    {
        // ソース：/Users/zhuzhu/project/mineadmin/app/Model/Permission/User.php:160-179 に基づく
        $user = User::factory()->create();
        
        // ユーザーポリシーを作成
        Policy::factory()->create([
            'user_id' => $user->id,
            'policy_type' => PolicyType::DeptSelf,
            'is_default' => true
        ]);
        
        // ポリシー取得を検証
        $policy = $user->getPolicy();
        $this->assertNotNull($policy);
        $this->assertEquals(PolicyType::DeptSelf, $policy->policy_type);
    }
}
```

## 📝 チェックリスト

データ権限システムを使用する前に、以下のチェックリストを使用してシステムの安全性を確認してください：

### 設定チェック
- [ ] **フィールドマッピングが正しい** - `deptColumn` と `createdByColumn` が実際のデータテーブルフィールドに対応している
- [ ] **ポリシータイプが適切** - ビジネス要件に基づいて適切な `ScopeType` を選択
- [ ] **テーブル範囲が明確** - `onlyTables` を使用して適用範囲を制限
- [ ] **スーパー管理者チェック** - スーパー管理者のバイパスロジックが正しいことを確認

### セキュリティチェック
- [ ] **コルーチンコンテキスト管理** - 新しい各コルーチンでコンテキストを再設定
- [ ] **入力検証** - すべてのユーザー入力を検証およびサニタイズ
- [ ] **エラー処理** - 適切なエラー処理とフォールバック戦略を実装
- [ ] **ログ監査** - 機密操作の詳細なログ記録を有効化

### パフォーマンスチェック
- [ ] **データベースインデックス** - 権限フィールドに適切なインデックスを作成
- [ ] **クエリ最適化** - N+1クエリや不要な結合操作を回避
- [ ] **監視アラート** - クエリパフォーマンス監視を設定

### テストチェック
- [ ] **単体テスト** - 様々な権限シナリオの単体テストを作成
- [ ] **統合テスト** - 権限システムと他のコンポーネントの統合をテスト
- [ ] **境界テスト** - 権限境界と例外ケースをテスト

## まとめ

MineAdminデータ権限システムの核心は、ContextとDataScope