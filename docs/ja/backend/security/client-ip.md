# クライアントIPの取得

::: warning 

mineadmin/support >= 3.0.21 が必要

:::

ユーザー操作記録を記録するミドルウェアでは、各リクエストごとにユーザーのアクセス記録を記録します。その中にはユーザーのIPアドレスも含まれています。
クライアントIPの取得は、`Support`コンポーネントの[ClientIpRequestTrait](https://github.com/mineadmin/components/blob/3.0/src/Support/Request/ClientIpRequestTrait.php)でカプセル化されており、ここでは直接`symfony Request`の実装方法を参考にしています。

しかし、本番環境では通常1層以上のリバースプロキシが配置されています。この場合、信頼できるプロキシを設定しないと、実際のリバースプロキシのIPが取得されてしまいます。以下では、リバースプロキシ配下のプログラムで正しいクライアントIPを取得する方法（ローカルネットワークアドレスではなく）について簡単に説明します。

新しいファイル`app/Http/Common/Listener/SetRequestTrustedProxiesListener`を作成します：

```php
<?php

<?php
namespace App\Http\Common\Listener;

use Hyperf\Event\Annotation\Listener;
use Hyperf\Event\Contract\ListenerInterface;
use Hyperf\Framework\Event\BootApplication;
use Mine\Support\Request;
use Mine\Support\Request\ClientIpRequestConstant;

#[Listener]
class SetRequestTrustedProxiesListener implements ListenerInterface{

    public function listen(): array
    {
        // アプリケーション起動イベントを監視
        // アプリケーション起動時に信頼できるプロキシを設定
        // これによりリクエスト処理前に信頼できるプロキシが設定され
        // クライアントIPアドレスを正しく処理できるようになります
        return [
            BootApplication::class,
        ];
    }

    public function process(object $event): void
    {
        /**
         * 信頼できるプロキシを設定
         * 第1引数は信頼できるプロキシIPアドレスまたはCIDR範囲
         * ここで'PRIVATE_SUBNETS'を実際のプライベートサブネットIPアドレスまたはCIDR範囲に置き換える必要があります
         * Symfony\Component\HttpFoundation\IpUtils::PRIVATE_SUBNETSで定義されている信頼できるネットワーク範囲を使用
         * 第2引数はクライアントIPアドレス取得に使用するリクエストヘッダ
         * ここではClientIpRequestConstant::HEADER_X_FORWARDED_FORを使用
         * これによりリクエスト処理時にX-Forwarded-ForヘッダからクライアントIPアドレスを取得します
         */
        Request::setTrustedProxies(['PRIVATE_SUBNETS'],ClientIpRequestConstant::HEADER_X_FORWARDED_FOR);
    }
}
```

次に、リバースプロキシの設定（nginxを例として）でx-forwarded-forリクエストヘッダを設定します：

```conf
#PROXY-START/

location ^~ /
{
    proxy_pass http://127.0.0.1:55502//;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Real-IP $proxy_add_x_forwarded_for;
    proxy_set_header REMOTE-HOST $remote_addr;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
    proxy_http_version 1.1;
    # proxy_hide_header Upgrade;

    add_header X-Cache $upstream_cache_status;
    #Nginxキャッシュ設定

    set $static_filephG5rYEX 0;
    if ( $uri ~* "\.(gif|png|jpg|css|js|woff|woff2)$" )
    {
        set $static_filephG5rYEX 1;
        expires 1m;
    }
    if ( $static_filephG5rYEX = 0 )
    {
        add_header Cache-Control no-cache;
    }
}
#PROXY-END/
```

これでクライアントの実際のIPを正しく取得できるようになります。