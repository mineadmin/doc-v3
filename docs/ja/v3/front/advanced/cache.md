# フロントエンドキャッシュシステム

MineAdmin フロントエンドは、ページキャッシュ、データキャッシュ、ブラウザストレージキャッシュなど、多層的なキャッシュ戦略を備えた完全なキャッシュシステムを提供しています。キャッシュメカニズムを適切に利用することで、アプリケーションのパフォーマンスとユーザーエクスペリエンスを大幅に向上させることができます。

## キャッシュタイプ概要

- **ページキャッシュ**: Vue の `keep-alive` メカニズムに基づき、ページコンポーネントの状態をキャッシュします
- **データキャッシュ**: API リクエスト結果とユーザーデータをキャッシュします
- **ストレージキャッシュ**: localStorage/sessionStorage に基づく永続化キャッシュ
- **ルートキャッシュ**: ルート状態とタブページ情報をキャッシュします

## ページキャッシュ (Keep-Alive)

ページキャッシュは Vue の `keep-alive` メカニズムに基づいて実装され、ページコンポーネントの状態をキャッシュして、再レンダリングやデータリクエストを回避します。

### ページキャッシュの有効化

ページキャッシュを有効にするには、以下の3つの条件を満たす必要があります。

1. **ルートメタ情報の設定**: ルートの `meta.cache` プロパティを `true` に設定します
2. **コンポーネント名の定義**: ページコンポーネントで `defineOptions` を使用してコンポーネント名を定義します
3. **単一ルートノードの維持**: ページテンプレートにはルートノードが1つだけ必要です

### 実装例

```vue
<script setup lang="ts">
// コンポーネント名を定義します。ルートの name プロパティと一致させる必要があります
defineOptions({ 
  name: 'UserManagement' // 対応するルート name: 'UserManagement'
})

// ページロジック
const userList = ref([])
const searchForm = ref({})

// ページデータはキャッシュされ、ユーザーがタブを切り替えて戻ってきたときに以前の状態を保持します
</script>

<template>
  <!-- 単一ルートノードを維持する必要があります -->
  <div class="user-management-page">
    <ma-table 
      ref="tableRef"
      :columns="columns"
      :data="userList"
      :search="searchForm"
    />
  </div>
</template>
```

### ルート設定

#### 静的ルート
```typescript
// src/router/static-routes/userRoute.ts
export default {
  name: 'UserManagement',
  path: '/user/management',
  component: () => import('@/views/user/management/index.vue'),
  meta: {
    title: 'ユーザー管理',
    cache: true, // キャッシュを有効にする
    icon: 'i-heroicons:users',
    type: 'M'
  }
}
```

#### 動的ルート（メニュー管理）

バックエンドのメニュー管理を通じて生成された動的ルートの場合、メニュー管理インターフェースでキャッシュプロパティを設定できます。

1. **システム管理** → **メニュー管理** に移動します
2. 対応するメニュー項目を編集します
3. フォームで **キャッシュする** スイッチを見つけます
4. オンにして保存します

メニューフォームの実装を参照: [menu-form.vue#L175](https://github.com/mineadmin/mineadmin/blob/master/web/src/modules/base/views/permission/menu/menu-form.vue#L175)

### キャッシュメカニズムの原理

システムは以下の方法でページキャッシュを実現します。

1. **ルートガード検出**: `router.afterEach` でルートの `meta.cache` プロパティを検出します
2. **コンポーネント名収集**: ページコンポーネントの `name` プロパティを取得し、キャッシュリストに追加します
3. **Keep-Alive ラッピング**: レイアウトコンポーネントで `<KeepAlive>` を使用してルートビューをラップします

コア実装コード:

```typescript
// src/router/index.ts
router.afterEach(async (to) => {
  const keepAliveStore = useKeepAliveStore()
  
  // キャッシュが必要かどうか、かつiframeページでないかをチェック
  if (to.meta.cache && to.meta.type !== 'I') {
    const componentName = to.matched.at(-1)?.components?.default!.name
    if (componentName) {
      keepAliveStore.add(componentName) // キャッシュリストに追加
    } else {
      console.warn(`コンポーネントページにコンポーネント名が設定されていません。キャッシュされません`)
    }
  }
})
```

```tsx
// src/layouts/index.tsx
<RouterView>
  {({ Component }) => (
    <Transition name={appSetting.pageAnimate} mode="out-in">
      <KeepAlive include={keepAliveStore.list}>
        {(keepAliveStore.getShowState() && route.meta.type !== 'I') && 
          <Component key={route.fullPath} />
        }
      </KeepAlive>
    </Transition>
  )}
</RouterView>
```

### キャッシュ管理

#### ページキャッシュの無効化

ページキャッシュを無効にする方法は複数あります。

1. **キャッシュプロパティを設定しない**（推奨）
```typescript
// ルート設定で cache を設定しないか、false に設定
meta: {
  title: '一時ページ',
  cache: false // またはこのプロパティを設定しない
}
```

2. **コンポーネント名を定義しない**
```vue
<script setup lang="ts">
// defineOptions を使用してコンポーネント名を定義しない
// ルートで cache: true が設定されていても、キャッシュされません
</script>
```

#### ページキャッシュのクリア

システムはキャッシュをクリアするための複数の方法を提供しています。

```typescript
// keep-alive ストレージインスタンスを取得
const keepAliveStore = useKeepAliveStore()

// 1. 指定したページキャッシュを削除
keepAliveStore.remove('UserManagement')

// 2. 複数のページキャッシュを削除
keepAliveStore.remove(['UserManagement', 'RoleManagement'])

// 3. すべてのページキャッシュをクリア
keepAliveStore.clean()

// 4. キャッシュを一時的に非表示にする（ページリフレッシュ用）
keepAliveStore.hidden()
// キャッシュの表示を復元
keepAliveStore.display()
```

#### タブページキャッシュ管理

タブシステムはページキャッシュと密接に連携し、完全なキャッシュライフサイクル管理を提供します。

```typescript
const tabStore = useTabStore()

// 現在のタブをリフレッシュ（キャッシュをクリアして再読み込み）
await tabStore.refreshTab()

// タブを閉じるときに、対応するページキャッシュを自動的にクリア
tabStore.closeTab(targetTab)

// 他のタブを閉じる（固定タブと現在のタブのキャッシュは保持）
await tabStore.closeOtherTab(currentTab)
```

## データキャッシュ (Web Storage)

ページキャッシュに加えて、MineAdmin は API データやユーザー設定などをキャッシュするための強力なデータキャッシュシステムを提供しています。

### useCache Hook

システムは `useCache` Hook を提供し、ブラウザストレージを統一的に管理します。

```typescript
import useCache from '@/hooks/useCache'

// localStorage を使用（デフォルト）
const localStorage = useCache('localStorage')

// sessionStorage を使用
const sessionStorage = useCache('sessionStorage')
```

### 基本的な使い方

```typescript
const cache = useCache()

// データを保存
cache.set('userInfo', {
  id: 1,
  name: 'admin',
  roles: ['admin']
})

// 有効期限付きでデータを保存（単位：秒）
cache.set('tempData', { value: 'temp' }, { exp: 3600 }) // 1時間後に期限切れ

// データを取得
const userInfo = cache.get('userInfo')
const tempData = cache.get('tempData', null) // デフォルト値を指定

// データを削除
cache.remove('tempData')

// 期限切れデータをすべて削除
cache.removeAllExpires()

// データの有効期限を更新
cache.touch('userInfo', 7200) // 2時間延長
```

### 高度な機能

#### 自動プレフィックス
すべてのキャッシュキーには自動的にアプリケーションプレフィックスが付加され、他のアプリケーションとの競合を防ぎます。

```typescript
// 実際に保存されるキー名は: VITE_APP_STORAGE_PREFIX + 'userInfo'
cache.set('userInfo', data)
```

#### 容量管理
ストレージ容量が不足すると、システムは自動的に期限切れデータをクリーンアップします。

```typescript
cache.set('largeData', data, {
  exp: 3600,
  force: true // 容量が不足している場合、強制的に期限切れデータをクリアしてから保存
})
```

### HTTP リクエストでの応用

システムは HTTP インターセプターでキャッシュを使用してユーザー認証情報を保存します。

```typescript
// src/utils/http.ts
const cache = useCache()
const userStore = useUserStore()

// 認証トークンを保存
cache.set('token', data.access_token)
cache.set('expire', useDayjs().unix() + data.expire_at, { exp: data.expire_at })
cache.set('refresh_token', data.refresh_token)

// トークン自動リフレッシュ時にキャッシュを読み取り
if (!cache.get('refresh_token')) {
  await logout()
}
```

## キャッシュのベストプラクティス

### 1. ページキャッシュの適切な使用

- **キャッシュに適したページ**: 一覧ページ、フォームページ、詳細表示ページ
- **キャッシュに適さないページ**: ログインページ、エラーページ、一時的なポップアップページ
- **注意事項**: コンポーネント名を一意にし、キャッシュの競合を避ける

### 2. データキャッシュ戦略

```typescript
// 辞書データをキャッシュ（長期有効）
cache.set('dictData', dictList, { exp: 24 * 3600 }) // 24時間

// ユーザー設定をキャッシュ（永続化）
cache.set('userSettings', settings) // 有効期限なし

// 一時的な状態をキャッシュ（短期有効）
cache.set('searchForm', formData, { exp: 1800 }) // 30分
```

### 3. キャッシュクリアリング戦略

```typescript
// ユーザーログアウト時に機密データをクリア
function logout() {
  cache.remove('token')
  cache.remove('refresh_token')
  cache.remove('userInfo')
  
  // ページキャッシュをクリア
  keepAliveStore.clean()
  tabStore.clearTab()
}

// 定期的に期限切れデータをクリア
setInterval(() => {
  cache.removeAllExpires()
}, 60 * 60 * 1000) // 1時間ごとにクリア
```

### 4. パフォーマンス最適化の提案

- 大きすぎるデータオブジェクトのキャッシュを避ける
- 適切な有効期限を設定し、メモリリークを防ぐ
- 頻繁に更新されるデータには sessionStorage の使用を検討する
- キャッシュ使用状況を監視し、不要なキャッシュを適時にクリアする

## よくある問題

### 問題1：ページキャッシュが有効にならない

**考えられる原因**：
- コンポーネントに `name` プロパティが定義されていない
- ルート `meta.cache` が `true` に設定されていない
- ページテンプレートに複数のルートノードがある

**解決策**：
```vue
<!-- 誤った例：複数のルートノード -->
<template>
  <div>内容1</div>
  <div>内容2</div>
</template>

<!-- 正しい例：単一のルートノード -->
<template>
  <div>
    <div>内容1</div>
    <div>内容2</div>
  </div>
</template>
```

### 問題2：キャッシュデータの期限切れ

```typescript
// データが存在し、期限切れでないかをチェック
const cachedData = cache.get('userData')
if (!cachedData) {
  // データを再取得
  const newData = await fetchUserData()
  cache.set('userData', newData, { exp: 3600 })
}
```

### 問題3：キャッシュが過剰に容量を占有する

```typescript
// 定期的にキャッシュ使用状況をクリアおよび監視
function monitorCacheUsage() {
  try {
    const used = JSON.stringify(localStorage).length
    const quota = 5 * 1024 * 1024 // 5MB 制限
    
    if (used > quota * 0.8) {
      console.warn('キャッシュ使用率が高いため、クリアを推奨します')
      cache.removeAllExpires()
    }
  } catch (error) {
    console.error('キャッシュ監視に失敗しました', error)
  }
}
```

## ソースコード参照

- [useCache Hook](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useCache.ts) - データキャッシュツール
- [useKeepAliveStore](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/useKeepAliveStore.ts) - ページキャッシュ状態管理
- [useTabStore](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/useTabStore.ts) - タブページキャッシュ管理
- [Router 設定](https://github.com/mineadmin/mineadmin/blob/master/web/src/router/index.ts) - ルートキャッシュロジック
- [Layout レイアウト](https://github.com/mineadmin/mineadmin/blob/master/web/src/layouts/index.tsx) - Keep-Alive 実装