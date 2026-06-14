# Lifecycle

::: tip

Whether using Swoole or Swow, in MineAdmin, Hyperf integrates through the [symfony/console](https://github.com/symfony/console) component.
Start command: `php bin/hyperf.php start`

MineAdmin is built and runs on [PHP](https://php.net) + ([Swoole](https://swoole.com) or [Swow](https://github.com/swow/swow)) + [Hyperf](https://github.com/hyperf/hyperf).
To thoroughly understand the lifecycle of MineAdmin, understanding the lifecycle of the underlying architecture is also crucial.

This article will not further explain the aforementioned underlying architecture lifecycle. If interested, please research and study independently.
This article will focus more on describing the lifecycle related to business logic.

:::

## Dual Token Authentication Refresh

The dual token mechanism means that during the user login process, in addition to the traditional `Access Token`, an additional `Refresh Token` is introduced. `Access Token` is primarily used to verify user identity and maintain user sessions, while `Refresh Token` is used to obtain a new `Access Token` after the `Access Token` expires. This design can provide a better user experience while ensuring security.

::: tip

The default application authentication mechanism uses two tokens for interactive refresh authentication.
These are `AccessToken` and `RefreshToken`.

The generation and authentication of Jwt are uniformly implemented by MineAdmin integrating the [lcobucci/jwt](https://github.com/lcobucci/jwt) component.

:::

---

### Sequence Diagram

```plantuml
participant "Client" as Client
participant "Server" as Server

Client -> Server : Login Request
Server -> Client : Login successful, return access_token and refresh_token
Client -> Local : Store access_token and refresh_token locally

Client -> Server : Send request
Server -> Client : Return 401 error code and local refresh_token not expired
Client -> Queue : Temporarily store request information
Client -> Server : Exchange refresh_token for new token
alt Token exchange endpoint returns 401
    Client -> Local : Clear local cache
    Client -> Server : Redirect to login page
else Token exchange successful
    Client -> Local : Update local token
    Client -> Server : Retry the failed request endpoint
end
```

### Flowchart

```plantuml
start
:Login successful;
->
:Store access_token and refresh_token locally;
->
:Send request;
if (Request failed, code = 401 and local refresh_token not expired) then (yes)
->
:Temporarily store request information in queue;
->
:Exchange refresh_token for new token;
if (Token exchange endpoint returns 401) then (yes)
->
:Clear local cache, redirect to login page;
else (no)
->
:Update local token, retry the failed request endpoint;
endif
else (no)
endif
```

### Explanation

After a successful login, store the access token and refresh token locally.

When a request fails with error code 401 and the local refresh_token has not expired, the current request information should be temporarily stored in a queue. This queue is designed to prevent multiple requests from refreshing the token simultaneously.

Then, use the refresh token to obtain a new access_token and refresh_token.

If the token exchange endpoint also returns error code 401, it indicates that both the access_token and refresh_token have expired. In this case, clear the local cache and redirect to the login page.

If the token exchange is successful, update the local token and retry the previously failed request.

---