# データベース移行

データベース移行ファイルの説明

---

1. プラグインはデフォルトで [Migration](https://hyperf.wiki/3.1/#/ja/db/migration){style="color: green;"} を使用して、プラグインのデータ移行とデータ投入を管理します。
2. `必要な場合以外`は、すべて移行ファイルとデータ投入ファイルを使用してデータ移行を行ってください。`InstallScript` および `UninstallScript` は、その他のチェックやファイル移行に使用します。
3. プラグインのデータベース移行ディレクトリは、[プラグインディレクトリ仕様](../structure.md){style="color: green;"} に従います。