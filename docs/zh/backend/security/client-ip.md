# 获取客户端Ip

::: warning 

mineadmin/support >= 3.0.21

:::

在记录用户操作记录的中间件中，会在每次请求时记录用户的访问记录。其中包括了用户 ip 地址。
而获取客户端 ip，是由 `Support` 组件中的 [ClientIpRequestTrait](https://github.com/mineadmin/components/blob/3.0/src/Support/Request/ClientIpRequestTrait.php) 封装而来的。此处则直接借鉴了 `symfony Request` 的实现方法。

而由于在生产环境中，一般来说还会会套一层或多层反向代理。这样如果不设置受信任的代理时。则会获取到真实的反向代理 ip。以下将简单介绍下如何在反向代理后的程序中获取正确的客户端 ip 而不是局域网地址


新建一个 `app/Http/Common/Listener/SetRequestTrustedProxiesListener` 文件

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
        // 监听应用启动事件
        // 以便在应用启动时设置受信任的代理
        // 这将确保在处理请求之前设置受信任的代理
        // 以便正确处理客户端 IP 地址
        return [
            BootApplication::class,
        ];
    }

    public function process(object $event): void
    {
        /**
         * 设置受信任的代理
         * 第一个参数是受信任的代理 IP 地址或 CIDR 范围
         * 这里的 'PRIVATE_SUBNETS' 应该替换为实际的私有子网 IP 地址或 CIDR 范围
         * 在 Symfony\Component\HttpFoundation\IpUtils::PRIVATE_SUBNETS 中定义了可信任的网段
         * 第二个参数是用于获取客户端 IP 地址的请求头
         * 这里使用了 ClientIpRequestConstant::HEADER_X_FORWARDED_FOR
         * 这将在处理请求时使用 X-Forwarded-For 头来获取客户端 IP 地址
         */
        Request::setTrustedProxies(['PRIVATE_SUBNETS'],ClientIpRequestConstant::HEADER_X_FORWARDED_FOR);
    }
}

```

再在反向代理配置，以 nginx 为例，配置 x-forwarded-for 请求头

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

即可正确获取到客户端真实 ip