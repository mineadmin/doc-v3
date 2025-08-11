# プラグインのディレクトリ構造

標準的なプラグインのディレクトリ構造についての説明

---

[プラグイン作成の章](./create.md)を例として

```shell
- plugin/test/demo プラグインのルートディレクトリ
-- plugin/test/demo/src プラグインのバックエンドディレクトリ
--- plugin/test/demo/src/InstallScript.php プラグインインストール時に実行されるクラスメソッド
--- plugin/test/demo/src/UninstallScript.php プラグインアンインストール時に実行されるクラスメソッド
--- plugin/test/demo/src/ConfigProvider.php プラグイン設定ディレクトリ、このファイルはhyperf公式の設定と一致
-- plugin/test/demo/Database プラグインのデータベースマイグレーションとシードファイルディレクトリ
--- plugin/test/demo/Database/Migrations プラグインのデータベースマイグレーションファイル
--- plugin/test/demo/Database/Seeder プラグインのデータベースシードファイル
-- plugin/test/demo/web プラグインのフロントエンドディレクトリ
-- plugin/test/demo/mine.json プラグインのコア情報ファイル
```