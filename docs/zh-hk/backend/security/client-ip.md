# 獲取客户端Ip

::: warning 

mineadmin/support >= 3.0.21

:::

在記錄用户操作記錄的中間件中，會在每次請求時記錄用户的訪問記錄。其中包括了用户 ip 地址。
而獲取客户端 ip，是由 `Support` 組件中的 [ClientIpRequestTrait](https://github.com/mineadmin/components/blob/3.0/src/Support/Request/ClientIpRequestTrait.php) 封裝而來的。此處則直接借鑑了 `symfony Request` 的實現方法。

而由於在生產環境中，一般來説還會會套一層或多層反向代理。這樣如果不設置受信任的代理時。則會獲取到真實的反向代理 ip。以下將簡單介紹下如何在反向代理後的程序中獲取正確的客户端 ip 而不是局域網地址


新建一個 `app/Http/Common/Listener/SetRequestTrustedProxiesListener` 文件

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
        // 監聽應用啓動事件
        // 以便在應用啓動時設置受信任的代理
        // 這將確保在處理請求之前設置受信任的代理
        // 以便正確處理客户端 IP 地址
        return [
            BootApplication::class,
        ];
    }

    public function process(object $event): void
    {
        /**
         * 設置受信任的代理
         * 第一個參數是受信任的代理 IP 地址或 CIDR 範圍
         * 這裏的 'PRIVATE_SUBNETS' 應該替換為實際的私有子網 IP 地址或 CIDR 範圍
         * 在 Symfony\Component\HttpFoundation\IpUtils::PRIVATE_SUBNETS 中定義了可信任的網段
         * 第二個參數是用於獲取客户端 IP 地址的請求頭
         * 這裏使用了 ClientIpRequestConstant::HEADER_X_FORWARDED_FOR
         * 這將在處理請求時使用 X-Forwarded-For 頭來獲取客户端 IP 地址
         */
        Request::setTrustedProxies(['PRIVATE_SUBNETS'],ClientIpRequestConstant::HEADER_X_FORWARDED_FOR);
    }
}

```

再在反向代理配置，以 nginx 為例，配置 x-forwarded-for 請求頭

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

即可正確獲取到客户端真實 ip