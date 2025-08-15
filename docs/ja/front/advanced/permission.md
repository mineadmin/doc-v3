# MineAdmin 権限管理システム

## 概要

MineAdmin は完全なフロントエンド権限管理システムを提供し、細かい粒度の権限管理を実現しています。権限管理は2つのレベルで構成されます：

:::tip 権限アーキテクチャ概要
- **ルートレベル権限**：バックエンドから返されるメニューデータに基づくページアクセス制御
- **コンテンツレベル権限**：ヘルパー関数、ディレクティブ、コンポーネントによるページコンテンツの表示/非表示制御

権限システムはバックエンドのHyperfフレームワークと深く統合され、フロントエンドとバックエンドの権限管理を一貫させます。
:::

### 権限タイプ

MineAdmin は3種類の細粒度権限管理をサポートします：

| 権限タイプ | 判断基準 | 適用シナリオ | 実装方法 |
|---------|---------|---------|---------|
| **権限コード権限** | メニューの `name` フィールド | 機能モジュール権限管理 | 関数、ディレクティブ、コンポーネント |
| **ロール権限** | ロールの `code` フィールド | 職責ベースの権限管理 | 関数、ディレクティブ |
| **ユーザー権限** | ユーザーの `username` フィールド | 特定ユーザー権限管理 | 関数、ディレクティブ |

::: info 実装原理
権限システムはユーザーログイン後に取得する権限データに基づき、現在のユーザーが持つ権限コード、ロールコード、ユーザー識別子を比較して特定機能へのアクセス権限を判断します。権限データはフロントエンドの状態管理に保存され、効率的な権限検証を実現します。
:::

## 権限ヘルパー関数

### 関数の導入と基本使用法

MineAdmin は3つのコア権限判断関数を提供し、`web/src/utils/permission/` ディレクトリに配置されています：

```javascript
// 権限コードチェック関数
import hasAuth from '@/utils/permission/hasAuth'
// ロールチェック関数  
import hasRole from '@/utils/permission/hasRole'
// ユーザーチェック関数
import hasUser from '@/utils/permission/hasUser'
```

::: tip 関数の場所説明
**ソースコードパス**：
- GitHub: `https://github.com/mineadmin/mineadmin/tree/master/web/src/utils/permission/`
- ローカル開発: `/web/src/utils/permission/`

これらの関数はグローバルに登録されており、コンポーネント内で直接呼び出すことができます。
:::

### ビジネスロジックでの使用

```vue
<script setup>
// 権限コード検証 - 単一権限または権限配列をサポート
if (hasAuth('user:list') || hasAuth(['user:list', 'user:create'])) {
  // ユーザー管理権限検証通過
  console.log('ユーザー管理権限を持っています')
}

// ロール検証 - 単一ロールまたはロール配列をサポート
if (hasRole('SuperAdmin') || hasRole(['admin', 'manager'])) {
  // 管理者ロール検証通過
  console.log('管理者権限を持っています')
}

// ユーザー検証 - 単一ユーザー名またはユーザー名配列をサポート
if (hasUser('admin') || hasUser(['admin', 'root'])) {
  // 特定ユーザー検証通過
  console.log('特定ユーザー検証通過')
}

// 複合権限判断例
const canManageUsers = hasAuth(['user:list', 'user:create']) && hasRole('admin')
if (canManageUsers) {
  // 権限コードとロール要件を同時に満たす
}
</script>
```

### テンプレートでの使用

```vue
<script setup>
// 権限判断関数をインポート
import hasAuth from '@/utils/permission/hasAuth'
import hasRole from '@/utils/permission/hasRole'
import hasUser from '@/utils/permission/hasUser'
</script>

<template>
  <div>
    <!-- 権限コード検証 -->
    <div v-if="hasAuth('user:list') || hasAuth(['user:list', 'user:create'])">
      <el-button type="primary">ユーザー管理</el-button>
    </div>
    
    <!-- ロール検証 -->
    <div v-if="hasRole('SuperAdmin') || hasRole(['admin', 'manager'])">
      <el-button type="danger">システム設定</el-button>
    </div>

    <!-- ユーザー検証 -->
    <div v-if="hasUser('admin') || hasUser(['root', 'administrator'])">
      <el-button type="warning">高度な機能</el-button>
    </div>

    <!-- 複合条件検証 -->
    <div v-if="hasAuth('role:manage') && hasRole('admin')">
      <el-button>ロール管理</el-button>
    </div>
  </div>
</template>
```

### 関数パラメータ説明

すべての権限関数は以下の2つのパラメータ形式をサポートします：

```javascript
// 文字列形式 - 単一権限チェック
hasAuth('user:list')
hasRole('admin')  
hasUser('admin')

// 配列形式 - 複数権限チェック（OR論理）
hasAuth(['user:list', 'user:create', 'user:edit'])
hasRole(['admin', 'manager', 'supervisor'])
hasUser(['admin', 'root', 'system'])
```

::: warning 注意事項
- 配列パラメータは **OR 論理** を使用、いずれかの条件を満たせば `true` を返します
- **AND 論理** が必要な場合、複数の関数呼び出しを組み合わせてください：`hasAuth('a') && hasAuth('b')`
- 権限コードは `モジュール:操作` の命名規則が推奨されます、例：`user:list`、`role:create`
:::

### ルート権限パラメータ

権限関数は第2のオプションパラメータ `checkRoute` をサポートし、ルート権限も同時にチェックするかどうかを制御します：

```javascript
// 第2パラメータはデフォルトで false、機能権限のみチェック
hasAuth('user:list', false)  

// true に設定すると、ルート権限も同時にチェック
hasAuth('user:list', true)
```

## 権限ディレクティブ

MineAdmin は3つの権限ディレクティブを提供し、テンプレート内の権限管理を簡素化します。ディレクティブは `web/src/directives/permission/` ディレクトリに配置されています：

::: tip ディレクティブソースコードの場所
**GitHubパス**：
- `https://github.com/mineadmin/mineadmin/tree/master/web/src/directives/permission/auth/`
- `https://github.com/mineadmin/mineadmin/tree/master/web/src/directives/permission/role/`
- `https://github.com/mineadmin/mineadmin/tree/master/web/src/directives/permission/user/`

**ローカルパス**：`/web/src/directives/permission/`
:::

### ディレクティブ使用法

```vue
<template>
  <div>
    <!-- 権限コードディレクティブ - 文字列と配列をサポート -->
    <div v-auth="'user:list'">
      単一権限コード制御
    </div>
    <div v-auth="['user:list', 'user:create']">
      複数権限コード制御（いずれかを満たせば可）
    </div>
    
    <!-- ロールディレクティブ -->
    <div v-role="'admin'">
      単一ロール制御
    </div>
    <div v-role="['admin', 'manager']">
      複数ロール制御（いずれかを満たせば可）
    </div>

    <!-- ユーザーディレクティブ -->
    <div v-user="'admin'">
      単一ユーザー制御
    </div>
    <div v-user="['admin', 'root']">
      複数ユーザー制御（いずれかを満たせば可）
    </div>

    <!-- 実際の業務シナリオ例 -->
    <el-button v-auth="'user:create'" type="primary">
      ユーザー追加
    </el-button>
    
    <el-button v-role="'SuperAdmin'" type="danger">
      データ削除
    </el-button>
    
    <div v-auth="['log:operation', 'log:login']" class="log-panel">
      ログ表示パネル
    </div>
  </div>
</template>
```

### ディレクティブ vs 関数比較

| 方法 | 利点 | 適用シナリオ | 例 |
|------|------|----------|------|
| **ディレクティブ方式** | 簡潔で直観的、要素の表示/非表示を自動制御 | シンプルな権限管理、静的権限チェック | `v-auth="'user:list'"` |
| **関数方式** | 柔軟性が高い、複雑なロジック判断をサポート | 業務ロジック内の権限判断、動的権限チェック | `v-if="hasAuth('a') && hasRole('b')"` |

::: warning ディレクティブ使用上の注意
- ディレクティブは **OR 論理** を使用、配列内のいずれかの条件を満たせば要素を表示
- ディレクティブは直接DOM要素の表示/非表示を制御、権限がない場合要素はレンダリングされません
- 複雑な権限ロジックの組み合わせはディレクティブではなく関数方式を使用することを推奨
:::

## MaAuth 権限コンポーネント

### コンポーネント紹介

`MaAuth` コンポーネントは MineAdmin が提供する権限管理コンポーネントで、広範囲のコンテンツ権限管理に適しています。関数やディレクティブと比較し、コンポーネント方式はより複雑な権限表示ロジックに適しています。

::: info コンポーネントソースコードの場所
**GitHub パス**：`https://github.com/mineadmin/mineadmin/tree/master/web/src/components/ma-auth/index.vue`

**ローカルパス**：`/web/src/components/ma-auth/index.vue`

このコンポーネントはグローバルに登録されており、どのVueコンポーネントでも直接使用でき、手動インポートは不要です。
:::

### 基本使用法

```vue
<template>
  <!-- 単一権限制御 -->
  <ma-auth :value="'user:list'">
    <div class="user-management">
      <h3>ユーザー管理パネル</h3>
      <p>ユーザーリスト表示権限を持っています</p>
    </div>
  </ma-auth>

  <!-- 複数権限制御（いずれかの権限を満たせば表示） -->
  <ma-auth :value="['user:list', 'user:create', 'user:edit']">
    <div class="user-operations">
      <el-button type="primary">ユーザー追加</el-button>
      <el-button type="success">ユーザー編集</el-button>
      <el-button type="danger">ユーザー削除</el-button>
    </div>
  </ma-auth>
</template>
```

### 権限がない場合のヒント

コンポーネントは `#notAuth` スロットを提供し、権限がない場合の表示内容をカスタマイズできます：

```vue
<template>
  <ma-auth :value="['admin:system', 'admin:config']">
    <!-- 権限がある場合の表示内容 -->
    <div class="admin-panel">
      <h2>システム管理</h2>
      <el-form>
        <el-form-item label="システム設定">
          <el-input placeholder="設定項目" />
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 権限がない場合の表示内容 -->
    <template #notAuth>
      <el-alert
        title="権限不足"
        description="システム管理権限がありません、管理者に連絡して関連権限を申請してください"
        type="warning"
        :closable="false"
        show-icon
      />
    </template>
  </ma-auth>
</template>
```

### 高度な使用法

#### ネストされた権限制御

```vue
<template>
  <ma-auth :value="'module:access'">
    <!-- モジュールレベル権限 -->
    <div class="module-container">
      <h2>業務モジュール</h2>
      
      <!-- 機能レベル権限 -->
      <ma-auth :value="'feature:read'">
        <div class="read-section">
          <p>読み取り専用エリア</p>
        </div>
        <template #notAuth>
          <p class="text-gray">読み取り権限がありません</p>
        </template>
      </ma-auth>

      <!-- 操作レベル権限 -->
      <ma-auth :value="['feature:create', 'feature:edit']">
        <div class="action-buttons">
          <el-button>作成</el-button>
          <el-button>編集</el-button>
        </div>
        <template #notAuth>
          <p class="text-muted">操作権限がありません</p>
        </template>
      </ma-auth>
    </div>
    
    <template #notAuth>
      <el-empty description="このモジュールにアクセスする権限がありません" />
    </template>
  </ma-auth>
</template>
```

#### 他のコンポーネントとの組み合わせ

```vue
<template>
  <!-- テーブル操作権限制御 -->
  <el-table :data="tableData">
    <el-table-column label="氏名" prop="name" />
    <el-table-column label="操作">
      <template #default="{ row }">
        <ma-auth :value="'user:edit'">
          <el-button size="small" @click="editUser(row)">編集</el-button>
          <template #notAuth>
            <el-button size="small" disabled>権限なし</el-button>
          </template>
        </ma-auth>
        
        <ma-auth :value="'user:delete'">
          <el-button size="small" type="danger" @click="deleteUser(row)">
            削除
          </el-button>
        </ma-auth>
      </template>
    </el-table-column>
  </el-table>
</template>
```

### コンポーネントパラメータ

| パラメータ | タイプ | デフォルト値 | 説明 |
|------|------|--------|------|
| `value` | `string \| string[]` | `[]` | 検証する権限コード、文字列または配列をサポート |

### コンポーネントスロット

| スロット名 | 説明 | パラメータ |
|--------|------|------|
| `default` | 権限がある場合の表示内容 | - |
| `notAuth` | 権限がない場合の表示内容 | - |

### コンポーネント vs 他の方法比較

| 方法 | 適用シナリオ | 利点 | 欠点 |
|------|----------|------|------|
| **MaAuth コンポーネント** | 大規模コンテンツ権限制御、権限なしヒントが必要 | スロットカスタマイズをサポート、コード構造が明確 | やや冗長 |
| **権限ディレクティブ** | シンプルな要素権限制御 | 簡潔で直観的 | 権限なしヒントをサポートしない |
| **権限関数** | 複雑な業務ロジック権限判断 | 柔軟性が最も高い | 表示ロジックを手動で処理する必要がある |

## ルート権限制御

### 静的ルート権限設定

MineAdmin はルートレベルでの権限制御をサポートし、ルートの `meta` プロパティで権限パラメータを設定することでアクセス制御を実現します。

::: tip ルート権限メカニズム
**制御範囲**：コンポーネントを持つページルートのみ有効、ボタンなどのページ内要素は含まない

**チェックタイミング**：ルート遷移時に自動的に権限をチェック

**権限検証失敗**：403 ページを表示

**ソースコードの場所**：`/web/src/router/` - ルート設定と権限ガードロジック
:::

### ルート権限設定構文

ルート設定ファイルで、`meta` オブジェクトを通じて権限パラメータを設定：

```javascript
// ルート設定例
const routes = [
  {
    path: '/user',
    name: 'User',
    component: () => import('@/views/user/index.vue'),
    meta: {
      // 権限コード制御 - ユーザー管理権限が必要
      auth: ['user:list', 'user:manage