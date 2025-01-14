# Lifecycle

::: tip

Whether it's Swoole or Swow, in MineAdmin, they are both integrated by Hyperf through the [symfony/console](https://github.com/symfony/console) component.
The startup command is `php bin/hyperf.php start`.

MineAdmin is built to run on [PHP](https://php.net) + ([Swoole](https://swoole.com) or [Swow](https://github.com/swow/swow)) + [Hyperf](https://github.com/hyperf/hyperf).
To thoroughly understand the lifecycle of MineAdmin, it is crucial to comprehend the lifecycle of the underlying architecture.

This article will not further elaborate on the lifecycle of the aforementioned underlying architecture. If interested, please study it on your own.
This article will focus more on describing the lifecycle related to business operations.

:::

## Dual Token Authentication Refresh

The dual-token mechanism refers to the process where, in addition to the traditional `Access Token`, an additional `Refresh Token` is introduced during user login. The `Access Token` is primarily used to verify user identity and maintain user sessions,
while the `Refresh Token` is used to obtain a new `Access Token` after the current one expires. This design ensures security while providing a better user experience.

::: tip

The default application authentication mechanism provided is implemented using two tokens for interactive refresh and authentication,
namely `AccessToken` and `RefreshToken`.

The generation and authentication of JWT are uniformly implemented by MineAdmin integrating the [lcobucci/jwt](https://github.com/lcobucci/jwt) component.

:::

---

### Sequence Diagram

```plantuml
participant "Client" as Client
participant "Server" as Server

Client -> Server : Login Request
Server -> Client : Login successful, return access_token and refresh_token
Client -> Local : Store access_token and refresh_token locally

Client -> Server : Send Request
Server -> Client : Return 401 error code and local refresh_token is not expired
Client -> Queue : Temporarily store request information
Client -> Server : Use refresh_token to exchange for new token
alt Token exchange interface returns 401
    Client -> Local : Clear local cache
    Client -> Server : Redirect to login page
else Token exchange successful
    Client -> Local : Update local token
    Client -> Server : Retry the failed request
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
if (Request failed, code = 401 and local refresh_token is not expired) then (yes)
->
:Temporarily store request information in queue;
->
:Use refresh_token to exchange for new token;
if (Token exchange interface returns 401) then (yes)
->
:Clear local cache, redirect to login page;
else (no)
->
:Update local token, retry the failed request;
endif
else (no)
endif
```

### Explanation

After a successful login, store the access token and refresh token locally.

When a request fails with a 401 error code and the local refresh_token is not expired, temporarily store the current request information in a queue. This queue is designed to prevent multiple requests from refreshing the token simultaneously.

Then, use the refresh token to exchange for a new access_token and refresh_token.

If the token exchange interface also returns a 401 error code, it means the access token and refresh token are both invalid, and the user needs to log in again. Clear the local cache and redirect to the login page.

If the token exchange is successful, update the local token and retry the failed request.