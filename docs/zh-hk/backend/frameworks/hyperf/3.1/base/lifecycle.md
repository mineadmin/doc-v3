# 生命週期

::: tip

不論是 swoole 或 swow。在 MineAdmin 中都是由 Hyperf 通過[symfony/console](https://github.com/symfony/console) 組件接入
啓動命令 `php bin/hyperf.php start`

MineAdmin 是構建運行在 [PHP](https://php.net) + ([Swoole](https://swoole.com) or [Swow](https://github.com/swow/swow)) + [Hyperf](https://github.com/hyperf/hyperf)
上的，想要了解透徹 MineAdmin 的生命週期，那麼理解基層架構的生命週期也是至關重要的。

本文將不再另行説明上述基層架構生命週期，如有興趣請自行研究學習.
本文將更傾向與業務相關的生命週期描述

:::


## 雙 Token 認證刷新

雙Token機制是指在用户登錄過程中，除了傳統的`Access Token`外，還引入了一個額外的`Refresh Token`。`Access Token`主要用於驗證用户身份和保持用户會話，
而`Refresh Token`則用於在`Access Token`過期後重新獲取新的`Access Token`。這種設計可以在保證安全性的同時，
提供更好的用户體驗。

::: tip

默認提供的應用程序認證機制都是由兩個 token 來實現交互刷新鑑權的
也就是 `AccessToken` 以及 `RefreshToken`

而關於 Jwt 的生成和鑑權則統一由 MineAdmin 接入 [lcobucci/jwt](https://github.com/lcobucci/jwt) 組件而實現的

:::

---

### 時序圖

```plantuml
participant "客户端" as Client
participant "服務端" as Server

Client -> Server : 登錄請求
Server -> Client : 登錄成功，返回 access_token 和 refresh_token
Client -> Local : 存儲 access_token 和 refresh_token 到本地

Client -> Server : 發送請求
Server -> Client : 返回 401 錯誤碼且本地 refresh_token 未過期
Client -> Queue : 暫存請求信息
Client -> Server : 用 refresh_token 換取新 token
alt 換 token 接口返回 401
    Client -> Local : 清除本地緩存
    Client -> Server : 重定向到登錄頁面
else 換 token 成功
    Client -> Local : 更新本地 token
    Client -> Server : 重試請求失敗的接口
end
```

### 流程圖

```plantuml
start
:登錄成功;
->
:存儲 access_token 和 refresh_token 到本地;
->
:發送請求;
if (請求失敗，code = 401 且本地 refresh_token 未過期) then (yes)
->
:暫存請求信息到隊列;
->
:用 refresh_token 換新 token;
if (換 token 接口返回 401) then (yes)
->
:清除本地緩存，重定向到登錄頁面;
else (no)
->
:更新本地 token，重試請求失敗的接口;
endif
else (no)
endif
```

### 講解

在登錄成功後，將 access token 與 refresh token 存儲於本地。

當某次請求出現失敗，且錯誤碼為 401，同時本地的 refresh_token 未過期時，需先將當前請求信息暫存至隊列中。此隊列旨在防止同一時刻多個請求同時去刷新 token。

隨後，利用 refresh token 換取新的 access_token 與 refresh_token。

倘若換 token 的接口同樣返回 401 錯誤碼，則意味着 access_token 與 refresh_token 均已過期，此時需清除本地緩存，並重定向至登錄頁面。

若換 token 成功，則需更新本地 token，並重試之前失敗的請求。

---

