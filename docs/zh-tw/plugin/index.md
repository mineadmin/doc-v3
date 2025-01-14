# 準備工作

::: tip
如果開發 MineAdmin 應用；首先，得熟悉 MineAdmin 和 Hyperf 框架，然後做以下的準備工作。
:::

## 獲取AccessToken

MineAdmin不管下載外掛應用、更新外掛應用還是開發外掛應用都需要 `ACCESS_TOKEN`

獲取步驟：

- 登入 [MineAdmin](https://www.mineadmin.com/login) 官網
- 進入 `個人中心`  的 [_設定_](https://www.mineadmin.com/member/setting) 頁面
- 點選檢視`我的AccessToken`

::: danger

---
 
注意

請保管好自己的 AccessToken，不要洩露！！！

---

:::

## 配置後端 .env 檔案

開啟後端根目錄的 _.env_ 檔案，找到 **MINE_ACCESS_TOKEN** 項，把剛複製的字串貼上到 **等號** 後面

```ini [.env]
APP_NAME = MineAdmin

APP_ENV = dev

# 省略...

MINE_ACCESS_TOKEN = 107299501236086
```

## 申請開發者

如果僅是本地開發應用並且自己使用，這種情況不需要有開發者認證許可權，你也可以分發給其他任何人。

如果打算上架官方應用市場，需要進行開發者認證後，才可釋出你的應用，並且受到官方版權保護。

目前還未支援線上直接申請認證，需要透過聯絡 **MineAdmin團隊成員** 給你開通開發者許可權