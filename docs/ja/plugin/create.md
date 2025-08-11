# アプリケーションの作成

MineAdminアプリケーションを作成する

## [コマンドでの作成](./command.md#创建一个插件)

MineAdminではコマンドラインを使用してアプリケーションを作成できます。まず、コマンドラインの現在のディレクトリをプロジェクトのルートディレクトリに移動し、次のコマンドを入力します：

```shell
php bin/hyperf.php mine-extension:create test/demo --name test --type mix --author zds --description これは混合プラグインです
```

このコマンドを実行すると、plugin/test/demo プラグインディレクトリが作成されます。[ディレクトリ構造](./structure.md)

## アプリケーションのアップロード

[アプリケーション公開ページ](https://www.mineadmin.com/member/createApp)にアクセスし、アプリケーションの圧縮ファイル(.zip形式)をアップロードし、関連情報を入力します。その後、管理者の審査を待ちます。