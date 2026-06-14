# アプリケーション作成

MineAdminアプリケーションの作成

## [コマンドによる作成](./command.md#プラグインの作成)

MineAdminでは、コマンドラインを使用してアプリケーションを作成できます。まず、現在のコマンドラインのディレクトリをプロジェクトのルートディレクトリに移動し、次のコマンドを入力します。

```shell
php bin/hyperf.php mine-extension:create test/demo --name test --type mix --author zds --description これは混合プラグインです
```

このコマンドを実行すると、`plugin/test/demo` プラグインディレクトリが作成されます。[ディレクトリ規約](./structure.md)

## アプリケーションのアップロード

[アプリケーション公開ページ](https://www.mineadmin.com/member/createApp) にアクセスし、アプリケーションの圧縮パッケージ(.zip形式)をアップロードし、関連情報を入力して、管理者の審査を待ちます。