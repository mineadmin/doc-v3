# パフォーマンス最適化

## データベースインデックス最適化

データ権限システムの高性能化を確保するため、適切なデータベースインデックスを作成する必要があります：

```sql
-- コアテーブルインデックス最適化
CREATE INDEX idx_user_dept_id ON user(dept_id);
CREATE INDEX idx_user_created_by ON user(created_by);
CREATE INDEX idx_dept_parent_id ON department(parent_id);

-- データ権限ポリシー関連インデックス
CREATE INDEX idx_policy_user_id ON data_permission_policy(user_id);
CREATE INDEX idx_policy_position_id ON data_permission_policy(position_id);
CREATE INDEX idx_policy_type ON data_permission_policy(policy_type);

-- 複合インデックスで複合クエリを最適化
CREATE INDEX idx_user_dept_created ON user(dept_id, created_by);
CREATE INDEX idx_user_dept_status ON user(dept_id, status);

-- 関連テーブルインデックス
CREATE INDEX idx_user_dept_mapping ON user_dept(user_id, dept_id);
CREATE INDEX idx_user_position_mapping ON user_position(user_id, position_id);
CREATE INDEX idx_dept_leader_mapping ON dept_leader(dept_id, user_id);
```

## 既存システム最適化提案

MineAdminの現在のデータ権限実装に基づき、以下は対象的な最適化提案です：

### 1. Factoryクラス最適化

```php
// /mineadmin/app/Library/DataPermission/Factory.php
// 現在のFactoryクラスは以下の方法で最適化可能：

class Factory
{
    // クエリ結果キャッシュを追加
    private static array $queryCache = [];
    
    public function build(Builder $builder, User $user): void
    {
        // スーパー管理者はチェックをスキップ
        if ($user->isSuperAdmin()) {
            return;
        }
        
        // ユーザーポリシーをキャッシュして重複クエリを回避
        $cacheKey = "user_policy_{$user->id}";
        $policy = self::$queryCache[$cacheKey] ?? ($user->getPolicy());
        
        if ($policy) {
            self::$queryCache[$cacheKey] = $policy;
            // 権限フィルタリングロジックを適用...
        }
    }
}
```

### 2. 部門ツリークエリ最適化

```php
// /mineadmin/app/Model/Permission/Department.php
// 既存のgetFlatChildrenメソッドを最適化：

public function getFlatChildren(): Collection
{
    // 再帰CTEで部門ツリークエリを最適化
    $sql = "
        WITH RECURSIVE dept_tree AS (
            SELECT id, parent_id, name, 0 as level
            FROM department 
            WHERE id = ?
            
            UNION ALL
            
            SELECT d.id, d.parent_id, d.name, dt.level + 1
            FROM department d
            INNER JOIN dept_tree dt ON d.parent_id = dt.id
            WHERE dt.level < 10  -- 無限再帰を防止
        )
        SELECT * FROM dept_tree ORDER BY level, id
    ";
    
    return collect(DB::select($sql, [$this->id]));
}
```

### 3. DataScopeアノテーションパフォーマンス最適化

```php
// /mineadmin/app/Library/DataPermission/Aspects/DataScopeAspect.php
// アスペクト処理にパフォーマンス監視を追加することを推奨：

class DataScopeAspect
{
    public function process(ProceedingJoinPoint $proceedingJoinPoint)
    {
        $start = microtime(true);
        
        try {
            $result = $this->handleDataScope($proceedingJoinPoint);
            
            // 実行時間を記録
            $duration = microtime(true) - $start;
            if ($duration > 0.1) {
                Log::warning('データ権限処理に時間がかかりました', [
                    'method' => $proceedingJoinPoint->className . '::' . $proceedingJoinPoint->methodName,
                    'duration' => $duration
                ]);
            }
            
            return $result;
        } catch (\Throwable $e) {
            Log::error('データ権限処理で例外が発生しました', [
                'error' => $e->getMessage(),
                'method' => $proceedingJoinPoint->className . '::' . $proceedingJoinPoint->methodName
            ]);
            throw $e;
        }
    }
}
```

## クエリ最適化戦略

### 1. プリペアドステートメントの使用

```php
// 重複する権限クエリを最適化
class OptimizedPolicyResolver
{
    private static array $preparedStatements = [];
    
    public static function getUserPolicy(int $userId): ?Policy
    {
        $stmt = self::$preparedStatements['user_policy'] ?? DB::getPdo()->prepare(
            "SELECT * FROM data_permission_policy WHERE user_id = ? LIMIT 1"
        );
        
        $stmt->execute([$userId]);
        $result = $stmt->fetch();
        
        return $result ? new Policy($result) : null;
    }
}
```

### 2. バッチクエリ最適化

```php
// 既存システムのバッチ操作を最適化
class BatchDataPermissionHelper
{
    public static function loadUsersWithPolicies(array $userIds): Collection
    {
        // ユーザーとその権限ポリシーをバッチプリロード
        return User::with(['policy', 'position.policy'])
                  ->whereIn('id', $userIds)
                  ->get();
    }
    
    public static function loadDepartmentTrees(array $deptIds): array
    {
        // 部門ツリーをバッチロード
        $departments = Department::with('children')
                                ->whereIn('id', $deptIds)
                                ->get();
        
        $trees = [];
        foreach ($departments as $dept) {
            $trees[$dept->id] = $dept->getFlatChildren();
        }
        
        return $trees;
    }
}
```

## キャッシュ戦略

### Redisキャッシュ設定

```php
// config/autoload/cache.php
return [
    'default' => [
        'driver' => 'redis',
        'packer' => Hyperf\Utils\Packer\PhpSerializerPacker::class,
        'prefix' => 'mineadmin:cache:',
    ],
    
    // データ権限専用キャッシュ
    'data_permission' => [
        'driver' => 'redis',
        'packer' => Hyperf\Utils\Packer\PhpSerializerPacker::class,
        'prefix' => 'mineadmin:data_perm:',
        'pool' => 'default',
    ]
];
```

### ポリシーキャッシュ実装

```php
use Hyperf\Cache\Annotation\Cacheable;

class CachedPolicyService
{
    #[Cacheable(prefix: "user_policy", ttl: 300)]
    public function getUserPolicy(int $userId): ?Policy
    {
        return Policy::where('user_id', $userId)->first();
    }
    
    #[Cacheable(prefix: "dept_tree", ttl: 600)]
    public function getDepartmentTree(int $deptId): array
    {
        $dept = Department::find($deptId);
        return $dept ? $dept->getFlatChildren()->toArray() : [];
    }
}
```

## 監視とデバッグ

### クエリパフォーマンス監視

```php
// Factoryクラスにパフォーマンス監視を追加
class Factory
{
    public function build(Builder $builder, User $user): void
    {
        if (config('app.debug', false)) {
            $start = microtime(true);
            
            // 元の権限処理ロジック
            $this->applyDataPermission($builder, $user);
            
            $duration = microtime(true) - $start;
            if ($duration > 0.05) { // 50msを超えた場合記録
                Log::debug('データ権限クエリ時間', [
                    'user_id' => $user->id,
                    'duration' => $duration,
                    'sql' => $builder->toSql()
                ]);
            }
        } else {
            $this->applyDataPermission($builder, $user);
        }
    }
}
```

### スロークエリ分析

```php
// サービスプロバイダーにクエリリスナーを登録
class AppServiceProvider
{
    public function boot()
    {
        if (config('app.debug')) {
            DB::listen(function ($query) {
                if ($query->time > 100) { // 100msを超える場合
                    Log::warning('スロークエリが検出されました', [
                        'sql' => $query->sql,
                        'bindings' => $query->bindings,
                        'time' => $query->time . 'ms'
                    ]);
                }
            });
        }
    }
}
```

## 設定最適化提案

### Hyperfフレームワーク設定

```php
// config/autoload/databases.php
return [
    'default' => [
        'driver' => 'mysql',
        'pool' => [
            'min_connections' => 5,     // 実際の並列数に基づき調整
            'max_connections' => 50,    // 接続過多を回避
            'connect_timeout' => 10.0,
            'wait_timeout' => 3.0,
            'heartbeat' => -1,          // オーバーヘッド削減のためハートビートを無効化
            'max_idle_time' => 60,      // 接続最大アイドル時間
        ],
        'options' => [
            PDO::ATTR_CASE => PDO::CASE_NATURAL,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_ORACLE_NULLS => PDO::NULL_NATURAL,
            PDO::ATTR_STRINGIFY_FETCHES => false,
            PDO::ATTR_EMULATE_PREPARES => false,
        ],
    ]
];
```

### コルーチンコンテキスト最適化

```php
// データ権限コンテキストにコルーチンセーフメカニズムを追加
use Hyperf\Utils\Context;

class DataPermissionContext
{
    public static function setUserPolicy(Policy $policy): void
    {
        Context::set('data_permission.user_policy', $policy);
    }
    
    public static function getUserPolicy(): ?Policy
    {
        return Context::get('data_permission.user_policy');
    }
    
    public static function clearContext(): void
    {
        Context::destroy('data_permission.user_policy');
    }
}
```

## まとめ

現在のMineAdminデータ権限システムの最適化重点は以下に置くべきです：

1. **データベースインデックス最適化** - コアクエリフィールドに適切なインデックスを追加
2. **クエリキャッシュ** - ユーザーポリシーと部門ツリーをキャッシュ
3. **バッチ操作** - 複数ユーザー権限チェックのバッチ処理を最適化
4. **パフォーマンス監視** - クエリパフォーマンス追跡とアラートを追加
5. **コルーチンセーフ** - Hyperfコルーチン環境下でのコンテキスト安全性を確保

これらの最適化措置は既存のコード構造に基づいており、システムパフォーマンス向上のために段階的に実施できます。