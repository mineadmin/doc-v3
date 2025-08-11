# Obtaining Client IP

::: warning 

mineadmin/support >= 3.0.21

:::

In the middleware that records user operations, each request logs the user's access record, including the user's IP address.  
The client IP is obtained through the [ClientIpRequestTrait](https://github.com/mineadmin/components/blob/3.0/src/Support/Request/ClientIpRequestTrait.php) encapsulated in the `Support` component. This implementation is directly inspired by `symfony Request`.

In production environments, applications are often behind one or more reverse proxy layers. Without configuring trusted proxies, the actual reverse proxy IP may be captured instead of the client's real IP. Below is a brief guide on how to correctly obtain the client IP in a reverse-proxied setup rather than the local network address.

Create a new file `app/Http/Common/Listener/SetRequestTrustedProxiesListener`:

```php
<?php

namespace App\Http\Common\Listener;

use Hyperf\Event\Annotation\Listener;
use Hyperf\Event\Contract\ListenerInterface;
use Hyperf\Framework\Event\BootApplication;
use Mine\Support\Request;
use Mine\Support\Request\ClientIpRequestConstant;

#[Listener]
class SetRequestTrustedProxiesListener implements ListenerInterface {

    public function listen(): array
    {
        // Listen to the application boot event  
        // to set trusted proxies upon startup.  
        // This ensures trusted proxies are configured  
        // before request handling begins,  
        // enabling correct client IP resolution.  
        return [
            BootApplication::class,
        ];
    }

    public function process(object $event): void
    {
        /**
         * Configure trusted proxies.  
         * The first parameter is the trusted proxy IP or CIDR range.  
         * Replace 'PRIVATE_SUBNETS' with actual private subnet IPs or CIDR ranges.  
         * Symfony\Component\HttpFoundation\IpUtils::PRIVATE_SUBNETS defines trusted subnets.  
         * The second parameter specifies the request header for client IP retrieval.  
         * Here, ClientIpRequestConstant::HEADER_X_FORWARDED_FOR is used,  
         * leveraging the X-Forwarded-For header for client IP resolution.  
         */
        Request::setTrustedProxies(['PRIVATE_SUBNETS'], ClientIpRequestConstant::HEADER_X_FORWARDED_FOR);
    }
}
```

Then, configure the reverse proxy (using Nginx as an example) to forward the `X-Forwarded-For` header:

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

This ensures the correct client IP is retrieved.