# プラグインコマンド

## プラグイン拡張初期化コマンド

---

::: danger

MineAdmin 2.0 バージョンでは、プラグイン拡張と初期化アクションがデフォルトで存在するため、初期化を繰り返し実行する必要はありません。

:::


> このコマンドは app-store の設定ファイル、言語ファイルを公開します。

```shell
php bin/hyperf.php mine-extension:initial
```

---

## リモートプラグイン一覧の照会（MineAdmin 公式拡張ソースから）

```shell
php bin/hyperf.php mine-extension:list
```

### パラメータ

| パラメータ   | タイプ   | デフォルト値 | 備考           |
|---------|---------|---------|--------------|
| --type  | string  | all     | 拡張タイプのフィルタリング |
| --name  | string  | なし     | 拡張名のフィルタリング   |

---

## ローカルの全プラグインの照会（未インストールのものを含む）

```shell
php bin/hyperf.php mine-extension:local-list
```

## リモートプラグインのローカルへのダウンロード

```shell
php bin/hyperf.php mine-extension:download
```

### パラメータ

| パラメータ   | タイプ   | デフォルト値 | 備考 |
|---------|---------|---------|----|
| --name  | string  | なし     | 必須 |

## 指定プラグインのインストール

```shell
php bin/hyperf.php mine-extension:install {path} --yes
```

### パラメータ

| パラメータ   | タイプ   | デフォルト値 | 備考           |
|---------|---------|---------|--------------|
| path    | string  | なし     | 必須、プラグインが配置されているディレクトリ |
| --yes   | bool    | false   | インストール確認の表示有無        |

## 指定プラグインのアンインストール

```shell
php bin/hyperf.php mine-extension:uninstall {path} --yes
```

### パラメータ

| パラメータ   | タイプ   | デフォルト値 | 備考           |
|---------|---------|---------|--------------|
| path    | string  | なし     | 必須、プラグインが配置されているディレクトリ |
| --yes   | bool    | false   | アンインストール確認の表示有無      |

## プラグインの作成

```shell
php bin/hyperf.php mine-extension:create
```

### パラメータ

| パラメータ          | タイプ     | デフォルト値      | 備考                                  |
|-----------------|---------|-------------|-------------------------------------|
| path            | string  | なし         | 必須；作成パス、形式は ユーザー名/プラグインディレクトリ名（例：zds/app-store） |
| --type          | string  | mixed       | プラグインタイプ 選択可能: mixed,frontend,backend |
| --author        | string  | なし、任意     | 作者名、この値は minejson.author に設定されます         |
| --description   | string  | なし、任意     | プラグインの説明、この値は minejson.description に設定されます |