# 権限

## 概要
:::tip 権限概要
ルートページへのアクセス可否はバックエンドから返されるメニューに基づいて決定され、静的ルートはフロントエンドでアクセス可否を制御します。フロントエンドでは現在、主に以下の`コンテンツ`が表示可能か(`v-show`)およびレンダリング可能か(`v-if`)を制御しています：
- ページの要素
- ページのコンポーネント
- ボタン...など
:::

## 詳細説明と使用方法

現在、権限は以下の3つの粒度で分けられています：
- 権限コードに基づく（メニューの`name`フィールド）
- ロールコードに基づく（ロールの`code`フィールド）
- ユーザー名に基づく（ユーザーの`username`フィールド）

::: info
3つの粒度それぞれに、コンテンツのレンダリングを制御する`ヘルパー関数`と`ディレクティブ`があります。権限コードに基づく方法には、さらに**コンポーネント**を使用してコンテンツのレンダリングを制御する方法もあります。
:::

### ビジネスロジックでの使用
```vue
<script setup lang="ts">
// 権限コードチェックのヘルパー関数
import hasAuth from '@/utils/permission/hasAuth'
// ロールコードチェックのヘルパー関数
import hasRole from '@/utils/permission/hasRole'
// ユーザー名チェックのヘルパー関数
import hasUser from '@/utils/permission/hasUser'
  
// 権限チェック
if (hasAuth('permission') || hasAuth(['log', 'log:index'])) {
  // 権限が許可された場合
}

// ロールチェック
if (hasRole('SuperAdmin') || hasRole(['ceo', 'cfo'])) {
  // ロールが許可された場合
}

// ユーザーチェック
if (hasUser('admin') || hasRole(['zhangSan', 'liSi'])) {
  // ユーザーが許可された場合
}
</script>
```

### APIの使用方法
```vue
<script setup lang="ts">
// 権限コードチェックのヘルパー関数
import hasAuth from '@/utils/permission/hasAuth'
// ロールコードチェックのヘルパー関数
import hasRole from '@/utils/permission/hasRole'
// ユーザー名チェックのヘルパー関数
import hasUser from '@/utils/permission/hasUser'
</script>

<template>
  <div>
    <div v-if="hasAuth('permission') || hasAuth(['log', 'log:index'])">
      権限チェック通過、閲覧可能
    </div>
    
    <div v-if="hasRole('SuperAdmin') || hasRole(['ceo', 'cfo'])">
      ロールチェック通過、閲覧可能
    </div>

    <div v-if="hasUser('admin') || hasRole(['zhangSan', 'liSi'])">
      ユーザーチェック通過、閲覧可能
    </div>
  </div>
</template>
```

### ディレクティブの使用方法

文字列の入力もサポートしていますが、簡単なデモのため、文字列入力モードは省略しています。

```vue
<template>
  <div>
    <div v-auth="['log', 'log:index']">
      権限チェック通過、閲覧可能
    </div>
    
    <div v-role="['ceo', 'cfo']">
      ロールチェック通過、閲覧可能
    </div>

    <div v-user="['zhangSan', 'liSi']">
      ユーザーチェック通過、閲覧可能
    </div>
  </div>
</template>
```
::: tip ヒント
`hasAuth`、`hasRole`、`hasUser`関数には、**ルート内の権限**もチェックするかどうかを指定する第2引数があります。
:::

### 権限コンポーネントの使用

他の方法と比べて、コンポーネントは広範囲のコンテンツ制御に適しており、使いやすいです。コンポーネントで表示したいコンテンツをラップし、チェックする権限を渡すだけです。
また、権限がない場合のスロットも提供されており、権限がない場合に表示する内容をカスタマイズできます。

:::info コンポーネントの場所
**`src/components/ma-auth/index.vue`**

コンポーネントはグローバルにインポートされているため、手動でインポートする必要はありません。
:::

```vue
<template>
  <!-- ユーザーとメニュー管理権限を持つユーザーが閲覧可能 -->
  <ma-auth :value="['permission:user', 'permission:menu']">
    権限チェック通過、コンテンツを閲覧可能
    
    <!-- 権限がない場合の表示スロット -->
    <template #notAuth>
      申し訳ありません、このコンテンツを閲覧する権限がありません
    </template>
  </ma-auth>
</template>
```

## 静的ルートのアクセス制御

静的ルートのアクセス制御は、コンポーネントを含むページルートのみを対象とし、ボタンなどは含まれません。ボタンなどは上記の方法で制御する必要があります。

::: tip 使用説明
静的ルートのアクセス制御は非常に簡単で、ルートの`meta`属性に`auth`、`role`、または`user`属性を設定するだけです。フロントエンドはルート遷移時にアクセス可能かどうかをチェックします。
チェックに失敗した場合は`403ページ`が表示され、チェックに成功した場合は通常通りアクセスできます。アクセス制御が必要ない場合は、これらの属性を設定しないか、値を`[]`に設定します。


注意：3つの属性の型はすべて`string[]`です
:::