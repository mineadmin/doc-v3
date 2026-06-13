# Get Client IP

::: warning 

Use this method to get client IP. You need to manually require symfony/http-foundation !!!

mineadmin/support >= 3.0.21

:::

In the middleware that records user operation logs, the user's access records are recorded with each request. This includes the user's IP address.
The method for obtaining the client IP is encapsulated by the [ClientIpRequestTrait](https://github.com/mineadmin/components/blob/3.0/src/Support/Request/ClientIpRequestTrait.php) in the `Support` component. This directly borrows the implementation method of `symfony Request`.

In production environments, there is usually one or more layers of reverse proxies. If trusted proxies are not set, the actual reverse proxy IP will be obtained. The following briefly introduces how to obtain the correct client IP instead of a local area network address in a program behind a reverse proxy.

Create a new `app/Http/Common/Listener/SetRequestTrustedProxiesListener` file

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
        // Listen for the application boot event
        // to set trusted proxies when the application starts
        // This ensures trusted proxies are set before processing requests
        // so the client IP address can be correctly handled
        return [
            BootApplication::class,
        ];
    }

    public function process(object $event): void
    {
        /**
         * Set trusted proxies
         * The first parameter is the trusted proxy IP address or CIDR range
         * Replace 'PRIVATE_SUBNETS' with the actual private subnet IP addresses or CIDR ranges
         * Definable trusted subnets are defined in Symfony\Component\HttpFoundation\IpUtils::PRIVATE_SUBNETS
         * The second parameter is the request header used to obtain the client IP address
         * ClientIpRequestConstant::HEADER_X_FORWARDED_FOR is used here
         * This will use the X-Forwarded-For header to obtain the client IP address when processing requests
         */
        Request::setTrustedProxies(['PRIVATE_SUBNETS'],ClientIpRequestConstant::HEADER_X_FORWARDED_FOR);
    }
}

```

Then configure the x-forwarded-for request header in the reverse proxy configuration, using nginx as an example:

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

This allows you to correctly obtain the client's real IP address.