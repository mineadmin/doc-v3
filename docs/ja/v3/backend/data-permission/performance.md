# パフォーマンス最適化

## データベースインデックス最適化

データ権限システムの高パフォーマンスを確保するため、適切なデータベースインデックスを作成する必要があります：

```sql
-- コアテーブルのインデックス最適化
CREATE INDEX idx_user_dept_id ON user(dept_id);
CREATE INDEX idx_user_created_by ON user(created_by);
CREATE INDEX idx_dept_parent_id ON department(parent_id);

-- データ権限ポリシー関連インデックス
CREATE INDEX idx_policy_user_id ON data_permission_policy(user_id);
CREATE INDEX idx_policy_position_id ON data_permission_policy(position_id);
CREATE INDEX idx_policy_type ON data_permission_policy(policy_type);

-- 複合クエリ最適化のための複合インデックス
CREATE INDEX idx_user_dept_created ON user(dept_id, created_by);
CREATE INDEX idx_user_dept_status ON user(dept_id, status);

-- 関連テーブルのインデックス
CREATE INDEX idx_user_dept_mapping ON user_dept(user_id, dept_id);
CREATE INDEX idx_user_position_mapping ON user_position(user_id, position_id);
CREATE INDEX idx_dept_leader_mapping ON dept_leader(dept_id, user_id);
```

## 既存システムの最適化提案

MineAdmin の現在のデータ権限実装に基づく、対象的な最適化提案：

### 1. Factory クラスの最適化

```php
// /mineadmin/app/Library/DataPermission/Factory.php
// 現在の Factory クラスは以下の方法で最適化可能：

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
        
        // ユーザーポリシーをキャッシュし、重複クエリを回避
        $cacheKey = "user_policy_{$user->id}";
        $policy = self::$queryCache[$cacheKey] ?? ($user->getPolicy());
        
        if ($policy) {
            self::$queryCache[$cacheKey] = $policy;
            // 権限フィルタリングロジックを適用...
        }
    }
}
```

### 2. 部門ツリークエリの最適化

```php
// /mineadmin/app/Model/Permission/Department.php
// 既存の getFlatChildren メソッドを最適化：

public function getFlatChildren(): Collection
{
    // 再帰CTEを使用して部門ツリークエリを最適化
    $sql = "
        WITH RECURSIVE dept_tree AS (
            SELECT id, parent_id, name, 0 as level
            FROM department 
            WHERE id = ?
            
            UNION ALL
            
            SELECT d.id, d.parent_id, d.name, dt.level + 1
            FROM department d
            INNER JOIN dept_tree dt ON d.parent_id = dt.id
            WHERE dt.level < 10  -- 無限再帰防止
        )
        SELECT * FROM dept_tree ORDER BY level, id
    ";
    
    return collect(DB::select($sql, [$this->id]));
}
```

### 3. DataScope アノテーションのパフォーマンス最適化

```php
// /mineadmin/app/Library/DataPermission/Aspects/DataScopeAspect.php
// アスペクト処理にパフォーマンスモニタリングを追加：

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
// 重複する権限クエリの最適化
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

### 2. バッチクエリの最適化

```php
// 既存システムのバッチ処理最適化
class BatchDataPermissionHelper
{
    public static function loadUsersWithPolicies(array $userIds): Collection
    {
        // ユーザーとその権限ポリシーを一括でプリロード
        return User::with(['policy', 'position.policy'])
                  ->whereIn('id', $userIds)
                  ->get();
    }
    
    public static function loadDepartmentTrees(array $deptIds): array
    {
        // 部門ツリーを一括ロード
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

### Redis キャッシュ設定

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

### ポリシーキャッシュの実装

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

## モニタリングとデバッグ

### クエリパフォーマンスモニタリング

```php
// Factory クラスにパフォーマンスモニタリングを追加
class Factory
{
    public function build(Builder $builder, User $user): void
    {
        if (config('app.debug', false)) {
            $start = microtime(true);
            
            // 元の権限処理ロジック
            $this->applyDataPermission($builder, $user);
            
            $duration = microtime(true) - $start;
            if ($duration > 0.05) { // 50ms超で記録
                Log::debug('データ権限クエリ所要時間', [
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
                if ($query->time > 100) { // 100ms超過
                    Log::warning('スロークエリ検出', [
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

### Hyperf フレームワーク設定

```php
// config/autoload/databases.php
return [
    'default' => [
        'driver' => 'mysql',
        'pool' => [
            'min_connections' => 5,     // 実際の並行性に応じて調整
            'max_connections' => 50,    // コネクション過多を防止
            'connect_timeout' => 10.0,
            'wait_timeout' => 3.0,
            'heartbeat' => -1,          // ハートビートを無効化しオーバーヘッド削減
            'max_idle_time' => 60,      // コネクション最大アイドル時間
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
// データ権限コンテキストにコルーチンセーフ機構を追加
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

現在の MineAdmin データ権限システムの最適化の重点は以下にあります：

1. **データベースインデックス最適化** - コアクエリフィールドに適切なインデックスを追加
2. **クエリキャッシュ** - ユーザーポリシーと部門ツリーのキャッシュ
3. **バッチ操作** - 複数ユーザー権限チェックのバッチ処理最適化
4. **パフォーマンスモニタリング** - クエリパフォーマンスの追跡と警告機能の追加
5. **コルーチンセーフ** - Hyperf コルーチン環境におけるコンテキスト安全性の確保

これらの最適化施策は既存のコード構造に基づいており、段階的に実装することでシステムパフォーマンスを向上させることができます。