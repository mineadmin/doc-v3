# プラグインコマンド

## プラグイン拡張初期化コマンド

---

::: danger

 MineAdmin 2.0 バージョンではデフォルトでプラグイン拡張および初期化アクションが含まれており、初期化を繰り返す必要はありません

:::

> このコマンドは app-store の設定ファイルと言語ファイルを公開します

```shell
php bin/hyperf.php mine-extension:initial
```

---

## リモートプラグインリストの検索（MineAdmin公式拡張ソースから）

```shell
php bin/hyperf.php mine-extension:list
```

### パラメータ

| パラメータ      | タイプ      | デフォルト値  | 備考 |
|---------|---------|------| ---|
| --type  | string  | all  | 拡張タイプでフィルタリング | 
| --name | string | 無 | 拡張名でフィルタリング |

---

## ローカルにあるすべてのプラグインを検索（未インストールのものも含む）

```shell
php bin/hyperf.php mine-extension:local-list
```

## リモートプラグインをローカルにダウンロード

```shell
php bin/hyperf.php mine-extension:download
```

### パラメータ

| パラメータ      | タイプ      | デフォルト値 | 備考 |
|---------|---------|-----| ---|
| --name | string | 無   | 必須 |

## 指定したプラグインをインストール

```shell
php bin/hyperf.php mine-extension:install {path} --yes
```

### パラメータ

| パラメータ      | タイプ      | デフォルト値 | 備考        |
|---------|---------|-----|-----------|
| path | string | 無 | 必須,プラグインのディレクトリ |
| --yes | bool | false | インストール確認をスキップするか  |


## 指定したプラグインをアンインストール

```shell
php bin/hyperf.php mine-extension:uninstall {path} --yes
```

### パラメータ

| パラメータ      | タイプ      | デフォルト値 | 備考        |
|---------|---------|-----|-----------|
| path | string | 無 | 必須,プラグインのディレクトリ |
| --yes | bool | false | アンインストール確認をスキップするか  |


## 新しいプラグインを作成

```shell
php bin/hyperf.php mine-extension:create
```

### パラメータ

| パラメータ            | タイプ      | デフォルト値     | 備考                                 |
|---------------|---------|---------|------------------------------------|
| path          | string | 無,必須    | 作成パス,例: zds/app-store              | 
| --name        | string | example | プラグイン名                               |                        
| --type        | string | mixed     | プラグインタイプ 選択可能: mixed,frontend,backend     |
| --author      | string| 無,オプション    | 作者名、minejson.authorに記入されます      |
| --description | string| 無,オプション    | プラグイン説明、minejson.descriptionに記入されます |