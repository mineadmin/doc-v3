# 生命週期

::: tip

不論是 swoole 或 swow。在 MineAdmin 中都是由 Hyperf 透過[symfony/console](https://github.com/symfony/console) 元件接入
啟動命令 `php bin/hyperf.php start`

MineAdmin 是構建執行在 [PHP](https://php.net) + ([Swoole](https://swoole.com) or [Swow](https://github.com/swow/swow)) + [Hyperf](https://github.com/hyperf/hyperf)
上的，想要了解透徹 MineAdmin 的生命週期，那麼理解基層架構的生命週期也是至關重要的。

本文將不再另行說明上述基層架構生命週期，如有興趣請自行研究學習.
本文將更傾向與業務相關的生命週期描述

:::


## 雙 Token 認證重新整理

雙Token機制是指在使用者登入過程中，除了傳統的`Access Token`外，還引入了一個額外的`Refresh Token`。`Access Token`主要用於驗證使用者身份和保持使用者會話，
而`Refresh Token`則用於在`Access Token`過期後重新獲取新的`Access Token`。這種設計可以在保證安全性的同時，
提供更好的使用者體驗。

::: tip

預設提供的應用程式認證機制都是由兩個 token 來實現互動重新整理鑑權的
也就是 `AccessToken` 以及 `RefreshToken`

而關於 Jwt 的生成和鑑權則統一由 MineAdmin 接入 [lcobucci/jwt](https://github.com/lcobucci/jwt) 元件而實現的

:::

---

### 時序圖

```plantuml
participant "客戶端" as Client
participant "服務端" as Server

Client -> Server : 登入請求
Server -> Client : 登入成功，返回 access_token 和 refresh_token
Client -> Local : 儲存 access_token 和 refresh_token 到本地

Client -> Server : 傳送請求
Server -> Client : 返回 401 錯誤碼且本地 refresh_token 未過期
Client -> Queue : 暫存請求資訊
Client -> Server : 用 refresh_token 換取新 token
alt 換 token 介面返回 401
    Client -> Local : 清除本地快取
    Client -> Server : 重定向到登入頁面
else 換 token 成功
    Client -> Local : 更新本地 token
    Client -> Server : 重試請求失敗的介面
end
```

### 流程圖

```plantuml
start
:登入成功;
->
:儲存 access_token 和 refresh_token 到本地;
->
:傳送請求;
if (請求失敗，code = 401 且本地 refresh_token 未過期) then (yes)
->
:暫存請求資訊到佇列;
->
:用 refresh_token 換新 token;
if (換 token 介面返回 401) then (yes)
->
:清除本地快取，重定向到登入頁面;
else (no)
->
:更新本地 token，重試請求失敗的介面;
endif
else (no)
endif
```

### 講解

在登入成功後，將 access token 與 refresh token 儲存於本地。

當某次請求出現失敗，且錯誤碼為 401，同時本地的 refresh_token 未過期時，需先將當前請求資訊暫存至佇列中。此佇列旨在防止同一時刻多個請求同時去重新整理 token。

隨後，利用 refresh token 換取新的 access_token 與 refresh_token。

倘若換 token 的介面同樣返回 401 錯誤碼，則意味著 acces