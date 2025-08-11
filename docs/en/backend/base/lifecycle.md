# Lifecycle

::: tip

Whether it's Swoole or Swow, in MineAdmin, they are integrated by Hyperf via the [symfony/console](https://github.com/symfony/console) component.  
The startup command is `php bin/hyperf.php start`.

MineAdmin is built to run on [PHP](https://php.net) + ([Swoole](https://swoole.com) or [Swow](https://github.com/swow/swow)) + [Hyperf](https://github.com/hyperf/hyperf).  
To thoroughly understand the lifecycle of MineAdmin, it is crucial to grasp the lifecycle of its underlying architecture.

This article will not elaborate further on the lifecycle of the aforementioned underlying architecture. If interested, please study it independently.  
This article will focus more on describing the lifecycle related to business logic.

:::

## Dual-Token Authentication Refresh

The dual-token mechanism refers to the introduction of an additional `Refresh Token` alongside the traditional `Access Token` during user login. The `Access Token` is primarily used for identity verification and maintaining user sessions, while the `Refresh Token` is used to obtain a new `Access Token` when the current one expires. This design ensures security while providing a better user experience.

::: tip

By default, the application's authentication mechanism is implemented using two tokens for interactive refresh authentication: the `AccessToken` and the `RefreshToken`.

The generation and authentication of JWT are uniformly handled by MineAdmin through the [lcobucci/jwt](https://github.com/lcobucci/jwt) component.

:::

---

### Sequence Diagram

```plantuml
participant "Client" as Client
participant "Server" as Server

Client -> Server : Login Request
Server -> Client : Login successful, returns access_token and refresh_token
Client -> Local : Stores access_token and refresh_token locally

Client -> Server : Sends a request
Server -> Client : Returns 401 error code, and local refresh_token is not expired
Client -> Queue : Temporarily stores request information
Client -> Server : Exchanges refresh_token for a new token
alt Token exchange returns 401
    Client -> Local : Clears local cache
    Client -> Server : Redirects to login page
else Token exchange successful
    Client -> Local : Updates local token
    Client -> Server : Retries the failed request
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
if (Request fails, code = 401 and local refresh_token is not expired) then (yes)
->
:Temporarily store request information in queue;
->
:Exchange refresh_token for a new token;
if (Token exchange returns 401) then (yes)
->
:Clear local cache and redirect to login page;
else (no)
->
:Update local token and retry the failed request;
endif
else (no)
endif
```

### Explanation

After a successful login, the access token and refresh token are stored locally.

When a request fails with a 401 error code and the local refresh_token is not expired, the current request information is temporarily stored in a queue. This queue prevents multiple requests from simultaneously refreshing the token.

Subsequently, the refresh token is used to obtain a new access_token and refresh_token.

If the token exchange interface also returns a 401 error code, it means both the access_token and refresh_token have expired. In this case, the local cache must be cleared, and the user should be redirected to the login page.

If the token exchange is successful, the local token is updated, and the previously failed request is retried.

---