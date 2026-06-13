# クライアントIPの取得

::: warning

この方法でクライアントIPを取得するには、手動で `symfony/http-foundation` を require する必要があります !!!

mineadmin/support >= 3.0.21

:::

ユーザー操作記録を記録するミドルウェアでは、リクエストのたびにユーザーのアクセス記録が記録されます。これにはユーザーのIPアドレスも含まれます。
クライアントIPの取得は、`Support` コンポーネントの [ClientIpRequestTrait](https://github.com/mineadmin/components/blob/3.0/src/Support/Request/ClientIpRequestTrait.php) によってカプセル化されています。ここでは `symfony Request` の実装方法を直接参考にしています。

本番環境では、一般的に1層または複数層のリバースプロキシを挟むことが多いため、信頼できるプロキシを設定しないと、実際のリバースプロキシのIPが取得されてしまいます。以下では、リバースプロキシ経由の環境で、ローカルネットワークアドレスではなく正しいクライアントIPを取得する方法を簡単に説明します。

新しいファイル `app/Http/Common/Listener/SetRequestTrustedProxiesListener` を作成します。

```php
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
        // アプリケーション起動時に信頼できるプロキシを設定するため
        // これにより、リクエストを処理する前に信頼できるプロキシが設定され
        // クライアントIPアドレスを正しく処理できるようになります
        return [
            BootApplication::class,
        ];
    }

    public function process(object $event): void
    {
        /**
         * 信頼できるプロキシを設定
         * 第1引数は信頼できるプロキシのIPアドレスまたはCIDR範囲
         * ここでの 'PRIVATE_SUBNETS' は実際のプライベートサブネットのIPアドレスまたはCIDR範囲に置き換える必要があります
         * Symfony\Component\HttpFoundation\IpUtils::PRIVATE_SUBNETS で信頼できるネットワークセグメントが定義されています
         * 第2引数はクライアントIPアドレスを取得するためのリクエストヘッダー
         * ここでは ClientIpRequestConstant::HEADER_X_FORWARDED_FOR を使用
         * これにより、リクエスト処理時に X-Forwarded-For ヘッダーを使用してクライアントIPアドレスを取得します
         */
        Request::setTrustedProxies(['PRIVATE_SUBNETS'],ClientIpRequestConstant::HEADER_X_FORWARDED_FOR);
    }
}
```

次に、リバースプロキシの設定で、nginx を例にして x-forwarded-for リクエストヘッダーを設定します。

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
    #Set Nginx Cache

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

これにより、クライアントの実際のIPを正しく取得できるようになります。