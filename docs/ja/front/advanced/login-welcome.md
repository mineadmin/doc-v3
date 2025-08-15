# ログインとウェルカムページ

:::tip
この章では、ログインページ、ログインコードの呼び出し、およびログイン後のデフォルトリダイレクトページの設定について説明します。
:::

## ログインページ

ページは `src/modules/base/views/login/index.vue` にあり、このページは実際には統合ページで、ログインは多くの小さなコンポーネントに分かれており、`index.vue` によって統合されています。
その中で、`<LoginForm />` はフォームログイン機能で、`IDE` 内で `ctrl（Mac:COMMAND）+ クリック` するとコードを追跡できます。

::: info 変更の提案：
まず、ログインページのフォームは `Element plus` コンポーネントライブラリではなく、`MineAdmin` 自身の `基本コンポーネントライブラリ` を使用していることに注意してください。これらのコンポーネントは非常に簡素で、基本的な機能しかサポートしていません。
このページを変更する必要がある場合、直接ソースコードを変更することはお勧めしません。今後の `アップグレード` に影響を与える可能性があります。

`3.0` のフロントエンドは[プラグイン](/ja/front/high/plugin.md)機能をサポートしています。プラグインの形式で `login` ルートの `component` プロパティを変更し、`ログインページの置き換え` 効果を達成することをお勧めします。

:::

```vue
<template>
  <div class="h-full min-w-[380px] w-full flex items-center justify-center overflow-hidden border-1 bg-blue-950 lg:justify-between lg:bg-white">
    <div class="relative hidden h-full w-10/12 md:hidden lg:flex">
      <div class="gradient-rainbow" />
      <Dashed />
      <Light />
      <Slogan />
      <OneWord />
    </div>
    <div class="login-form-container">
      <Logo />
      <LoginForm />
      <CopyRight />
    </div>
    <!-- モバイル端末用の互換性 -->
    <div class="min-[380px] relative left-0 top-0 z-4 h-full max-w-[1024px] w-full flex lg:hidden">
      <Dashed />
      <Light />
    </div>
  </div>
</template>
```

## ログインコードの呼び出し

::: info
実際の開発で `UI` のみを変更し、`ログインプロセス` を変更する必要がない場合は、この段落をスキップできます。
:::

ログイン呼び出しプロセス：

- `src/store/modules/useUserStore.ts` の `login()` メソッドは、内部で `token`、`refresh_token`、`expire_at` などの認証データを保存します。
- ページがウェルカムページにリダイレクトされると、`ルートガード` によってインターセプトされ、ユーザーの基本データがリクエストされます。
- `src/store/modules/useUserStore.ts` の `requestUserInfo()` メソッドは、`ユーザーデータ、メニュー権限、ロール` などの基本データをリクエストします。
- `requestUserInfo()` では重要なステップも実行されます：`ルートデータ` の初期化、呼び出しコード：`routeStore.initRoutes()`。

以上がログイン呼び出しプロセス全体です。まだわからない場合は、交流グループで相談するか、私たちに連絡してください。

## デフォルトウェルカムページの設定

ログイン後、リダイレクトするルートが指定されている場合：`/#/login?redirect=[ログイン成功後にリダイレクトするルートアドレス]`、パラメータに含まれるページにリダイレクトされますが、これは通常、認証が期限切れになった後にログインページにリダイレクトされるときに以前のページアドレスが含まれます。デフォルトでは、ログイン成功後はシステム内蔵のデフォルトページ（例：`index`、`dashboard` など）にリダイレクトされます。

```ts
welcomePage: {
    name: 'welcome',
    path: '/welcome',
    title: 'ウェルカムページ',
    icon: 'icon-park-outline:jewelry',
}
```

::: info 設定の提案
`3.0` では、デフォルトのウェルカムページおよび名前、アイコン、説明などを設定できます。`src/provider/settings/index.ts` ファイルを開き、`welcomePage` 設定項目を見つけて、この項目を設定できます。

ただし、このファイルを直接変更することはお勧めしません。一部のパラメータを同じディレクトリの `settings.config.ts` ファイルに `コピー` すると、システムが自動的に設定パラメータをマージし、デフォルト設定に影響を与えます。
:::