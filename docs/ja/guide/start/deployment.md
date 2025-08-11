# デプロイ

この記事では、MineAdminのフロントエンドとバックエンドアプリケーションを本番環境にデプロイする方法について説明します。

## バックエンド

### サービスデプロイ

一般的に、最新のサーバーサイドアプリケーションはDockerを使用してデプロイされます。
MineAdminもすぐに使える[Dockerfile](https://github.com/mineadmin/MineAdmin/blob/master/Dockerfile)を提供しており、迅速なサービスデプロイが可能です。
場合によっては、サーバーに直接インストールする必要があるかもしれません。以下では、2つのデプロイ方法を紹介します。

#### サーバーに直接デプロイ

MineAdminをサーバーに直接デプロイする場合、サーバーは以下のシステム要件を満たしている必要があります。

::: tip
PHPと拡張機能のインストールについては、各自で関連するチュートリアルを検索してください。ここでは説明しません。
:::

* PHP >= 8.1
* cURL PHP拡張
* Fileinfo PHP拡張
* OpenSSL PHP拡張
* PDO拡張
* Redis拡張
* Json拡張
* PDO_MYSQL拡張 (オプション)
* PDO_PGSQL拡張 (オプション)
* Swoole >= 5.1拡張 (オプション)
* Swow >= 1.5または開発版 (オプション)

プロジェクトディレクトリに移動して、以下のコマンドを実行します。

```shell
php bin/hyperf.php start
```

これで起動に成功します。

デフォルトのプログラムは常駐プロセスオプションを提供していません。プロジェクトを永続的に実行するためには、[supervisord](http://www.supervisord.org/)などのサードパーティアプリケーションを使用することをお勧めします。
使用方法については、[Hyperfドキュメント](https://hyperf.wiki)を参照してください。

#### コンテナ形式でデプロイ (推奨)

コンテナサービスとしてアプリケーションサービスを提供したい場合は、プロジェクトのDockerfileを使用できます。使い方は簡単です。

まず、サーバーに[docker](https://www.docker.com/)がインストールされていることを確認してください。

次に、プロジェクトディレクトリに移動します。

```shell
cd yourProject
```

`docker build . -t mineadmin`を実行してイメージをビルドします。

```shell
# -tパラメータの詳細は各自で調べてください。ここでは説明しません。
docker build . -t mineadmin
```

次に、`docker run`を実行してコンテナを起動します。

```shell
docker run -d --name mineadmin mineadmin
```

これでプロジェクトのサーバーサイドのデプロイが完了します。

---

::: tip
上記の2つのデプロイ方法は、<el-tag type="danger">.env</el-tag>ファイルがすでに設定されていることが前提です。
:::

### リバースプロキシ

<el-alert type="warning">アプリケーションを直接公衆ネットワーク環境に公開することは、いかなる場合でも推奨されません。必ずリバースプロキシを介して公開してください。</el-alert>

ここではいくつかのリバースプロキシの設定例を紹介します。

#### Nginx

プログラムをnginxが実行されているサーバーにデプロイする場合、以下のリバースプロキシ設定ファイルをサイトの起点として参照できます。

```nginx
#PROXY-START/server

location ^~ /
{
    # アプリケーションポート
    proxy_pass http://127.0.0.1:9501/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header REMOTE-HOST $remote_addr;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
    proxy_http_version 1.1;
    # proxy_hide_header Upgrade;

    add_header X-Cache $upstream_cache_status;
    #Set Nginx Cache

    set $static_fileyqrHU0ll 0;
    if ( $uri ~* "\.(gif|png|jpg|css|js|woff|woff2)$" )
    {
        set $static_fileyqrHU0ll 1;
        expires 1m;
    }
    if ( $static_fileyqrHU0ll = 0 )
    {
        add_header Cache-Control no-cache;
    }
}
#PROXY-END/
```

#### K8s Ingress

プログラムをk8sクラスターにデプロイする場合、以下の設定を参照できます。

##### サービスの作成

```yaml
# Kubernetes APIのバージョン
apiVersion: v1
# リソースタイプはサービス（Service）
kind: Service
# サービスのメタデータ
metadata:
  # サービス名
  name: mineadmin-service
# サービスの仕様
spec:
  # サービスに関連付けるPodを選択
  selector:
    app: mineadmin-server
  # サービスが公開するポート
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9501
```

##### Ingressリソースの作成

```yaml
apiVersion: networking.k8s.io/v1
# リソースタイプはIngress
kind: Ingress
metadata:
  # Ingressリソース名
  name: mineadmin-ingress
  annotations:
    # リライトターゲットパス
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  # Ingressのルールリスト
  rules:
      # ホスト名がwww.mineadmin.comのリクエストに適用
    - host: www.mineadmin.com
      # HTTPリクエストを処理
      http:
        paths:
          # ルートパスにマッチ
          - path: /
            # パスマッチタイプはプレフィックスマッチ
            pathType: Prefix
            # リクエストがルーティングされるバックエンドサービス
            backend:
              # バックエンドサービスとしてKubernetesサービスを指定
              service:
                # バックエンドサービス名は「mineadmin-service」
                name: mineadmin-service
                # バックエンドサービスのポート番号は80
                port:
                  number: 80
```

### デバッグモード

`config/config.php`設定ファイルでは、デバッグオプションがユーザーに表示されるエラー情報の量を決定します。デフォルトでは、このオプションは環境変数`APP_DEBUG`の値に従って設定されます。この値はプロジェクトの`.env`ファイルに保存されています。

::: warning
本番環境では、この値は常に`false`に設定する必要があります。本番環境で`true`に設定すると、機密情報がユーザーに返されるリスクがあります。
:::

## フロントエンド

### サービスデプロイ

#### サーバーに直接デプロイ

MineAdminのフロントエンドサービスをサーバーにデプロイする場合、典型的なNginxサービスを例に取ります。

まず静的リソースを生成します。プロジェクトの`web`ディレクトリで`pnpm build`を実行して生成します（サーバーで生成することも、ローカルで事前に生成することも可能です）。

静的リソースをサイトディレクトリに配置すれば、インストールが完了します。

#### コンテナサービスとしてデプロイ（推奨）

バックエンドと同様に、フロントエンドのビルド用の`Dockerfile`を提供しています。
`アプリケーション/web`ディレクトリに移動して、以下のコマンドを実行します。

```shell
docker build . -t frontend
```

これでnginxイメージがビルドされます。

このイメージを使用してコンテナサービスを起動します。

```shell
docker run -d --name frontend frontend
```

サイトのリバースプロキシを`[コンテナIP:80]`ポートに設定すれば、デプロイが完了します。