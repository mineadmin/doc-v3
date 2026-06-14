# 注意事項とベストプラクティス

本ドキュメントでは、MineAdmin データ権限システムの重要な注意事項、よくある落とし穴、およびベストプラクティスについて説明します。これらのガイドラインに従うことで、システムのセキュリティ、信頼性、パフォーマンスを確保できます。

## ❗ 重要な注意事項

### 1. コルーチンコンテキストの分離

::: danger 重大警告

**コルーチンコンテキストの分離はデータ権限システムの中核となるセキュリティ機能であり、厳守する必要があります！**

:::

#### 問題の説明

Hyperf のコルーチン環境では、各コルーチンが独立したコンテキスト空間を持ちます。コルーチンコンテキストを適切に処理しないと、以下が発生する可能性があります：

- **データ漏洩**：ユーザーAのデータがユーザーBに見える
- **権限昇格**：低権限ユーザーが高権限アクセスを獲得
- **データ不整合**：同一ユーザーが異なるリクエストで異なるデータを見る

#### 正しい実装

```php
// 出典：/Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Context.php に基づく
use App\Library\DataPermission\Context;
use App\Library\DataPermission\ScopeType;

// ✅ 正しい：各コルーチン開始時にコンテキストを設定
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
            // ユーザーに関連する権限コンテキストを設定
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

#### 誤った実装

```php
// ❌ 誤り：コルーチンをまたがるコンテキスト共有
$globalUser = auth()->user();
go(function () use ($globalUser) {
    // 危険！他のコルーチンのコンテキストを使用する可能性がある
    $data = User::query()->get();
});

// ❌ 誤り：コルーチンプールでコンテキストを再設定しない
for ($i = 0; $i < 10; $i++) {
    go(function () use ($i) {
        // 危険！コルーチンプールの再利用によりコンテキストが汚染される可能性がある
        $user = User::find($i);
        // Context の再設定が欠けている
        $data = User::query()->get();
    });
}
```

### 2. データベースフィールドマッピング

#### フィールド名の正確性確保

```php
// 出典：/Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Attribute/DataScope.php に基づく
// ✅ 正しい：フィールド名を明示的に指定
#[DataScope(
    deptColumn: 'department_id',    // データテーブルにこのフィールドがあることを確認
    createdByColumn: 'creator_id',  // データテーブルにこのフィールドがあることを確認
    onlyTables: ['orders', 'customers'] // 指定したテーブルにのみ適用
)]
public function getData(): Collection
{
    return Order::with('customer')->get();
}

// ✅ 正しい：フィールド存在確認（推奨ヘルパーメソッド）
function validatePermissionFields(string $table, array $fields): bool
{
    try {
        $schema = DB::connection()->getSchemaBuilder()->getColumnListing($table);
        
        foreach ($fields as $field) {
            if (!in_array($field, $schema)) {
                throw new \InvalidArgumentException(
                    "フィールド '{$field}' がテーブル '{$table}' に存在しません"
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

#### 誤った実装

```php
// ❌ 誤り：存在しないフィールドを使用
#[DataScope(
    deptColumn: 'dept_id',          // テーブル内のフィールドが 'department_id' の場合
    createdByColumn: 'created_by'   // テーブル内のフィールドが 'creator_id' の場合
)]
public function getData(): Collection
{
    // SQLエラーまたは権限無効が発生する
    return Order::query()->get();
}
```

## ⚠️ セキュリティ警告

### 1. 権限バイパスの防止

::: warning セキュリティリスク

以下の行為は権限バイパスを引き起こす可能性があるため、避ける必要があります！

:::

```php
// ❌ 危険：手動SQL構築による権限チェックのバイパス
$sql = "SELECT * FROM users WHERE dept_id = ?";
$users = DB::select($sql, [auth()->user()->dept_id]);

// ❌ 危険：whereRaw による権限フィルタリングのバイパス
$users = User::whereRaw('1=1')->get();

// ❌ 危険：管理者インターフェースで権限制御を使用しない
public function adminGetAllUsers(): Collection
{
    // 危険！全ユーザーデータを直接返す
    return User::all();
}

// ✅ 安全：常に権限システムを使用
// 出典：/Users/zhuzhu/project/mineadmin/app/Service/Permission/UserService.php:94-98 に基づく
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
                throw new \InvalidArgumentException("無効なフィルター: {$key}");
            }
        }
    }
}
```

### 3. ログ監査

```php
// 出典：/Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Factory.php に基づく
// ✅ 重要：機密操作にはログを有効化
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

// ✅ 権限操作のリスナー（推奨実装）
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
// 出典：/Users/zhuzhu/project/mineadmin/app/Model/Permission/User.php:160-179 に基づく
class DataPermissionService
{
    public function getDataByUserRole(User $user): Collection
    {
        // ユーザーポリシーを取得
        $policy = $user->getPolicy();
        if (!$policy) {
            // ポリシーがない場合は最も保守的な権限を使用
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

### 2. エラーハンドリング戦略

```php
// ✅ ベストプラクティス：優雅なエラーハンドリング
class SafeDataPermissionService
{
    public function executeWithFallback(callable $primaryAction, callable $fallbackAction = null): mixed
    {
        try {
            return $primaryAction();
        } catch (\Exception $e) {
            // 権限関連エラーを記録
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
    fn() => $this->getBasicUserData()  // フォールバックプラン
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
            
            // パフォーマンス指標を記録
            if ($executionTime > 100) { // 100msを超えた場合に記録
                Log::warning('データ権限操作の所要時間が長い', [
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
        
        // ユーザー1が自分の部門のデータのみを見られることをテスト
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
        // 出典：/Users/zhuzhu/project/mineadmin/app/Model/Permission/User.php:160-179 に基づく
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

データ権限システムを使用する前に、以下のチェックリストを使用してシステムのセキュリティを確認してください：

### 設定チェック
- [ ] **フィールドマッピングの正確性** - `deptColumn` と `createdByColumn` が実際のデータテーブルフィールドに対応していることを確認
- [ ] **ポリシータイプの適切性** - ビジネス要件に応じて適切な `ScopeType` を選択
- [ ] **テーブル範囲の明確化** - `onlyTables` を使用して適用範囲を制限
- [ ] **スーパー管理者チェック** - スーパー管理者バイパスロジックが正しいことを確認

### セキュリティチェック
- [ ] **コルーチンコンテキスト管理** - 新しいコルーチンごとにコンテキストを再設定
- [ ] **入力検証** - すべてのユーザー入力を検証とサニタイズ
- [ ] **エラーハンドリング** - 適切なエラーハンドリングとフォールバック戦略を実装
- [ ] **ログ監査** - 機密操作には詳細なログ記録を有効化

### パフォーマンスチェック
- [ ] **データベースインデックス** - 権限フィールドに適切なインデックスを作成
- [ ] **クエリ最適化** - N+1 クエリと不要な結合操作を回避
- [ ] **監視アラート** - クエリパフォーマンス監視を設定

### テストチェック
- [ ] **単体テスト** - 様々な権限シナリオの単体テストを作成
- [ ] **統合テスト** - 権限システムと他のコンポーネントの統合をテスト
- [ ] **境界テスト** - 権限境界と例外ケースをテスト

## まとめ

MineAdmin データ権限システムの中核は、Context と DataScope アノテーションの正しい設定にあります。重要なポイント：

1. **コルーチンコンテキストを厳格に管理** - 権限漏洩を防止
2. **フィールドマッピングを正しく設定** - 権限フィルタリングを有効化
3. **最小権限の原則に従う** - デフォルトで最も保守的な権限ポリシーを使用
4. **十分なエラーハンドリング** - 異常時におけるシステムのセキュリティを確保
5. **完全なテストカバレッジ** - 様々な権限シナリオの正しさを検証

これらの注意事項とベストプラクティスに従うことで、MineAdmin データ権限システムがお客様のアプリケーションで安全かつ効率的に動作することを保証できます。