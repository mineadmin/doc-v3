# 準備工作

::: tip
如果開發 MineAdmin 應用；首先，得熟悉 MineAdmin 和 Hyperf 框架，然後做以下的準備工作。
:::

## 獲取AccessToken

MineAdmin不管下載插件應用、更新插件應用還是開發插件應用都需要 `ACCESS_TOKEN`

獲取步驟：

- 登錄 [MineAdmin](https://www.mineadmin.com/login) 官網
- 進入 `個人中心`  的 [_設置_](https://www.mineadmin.com/member/setting) 頁面
- 點擊查看`我的AccessToken`

::: danger

---
 
注意

請保管好自己的 AccessToken，不要泄露！！！

---

:::

## 配置後端 .env 文件

打開後端根目錄的 _.env_ 文件，找到 **MINE_ACCESS_TOKEN** 項，把剛複製的字符串粘貼到 **等號** 後面

```ini [.env]
APP_NAME = MineAdmin

APP_ENV = dev

# 省略...

MINE_ACCESS_TOKEN = 107299501236086
```

## 申請開發者

如果僅是本地開發應用並且自己使用，這種情況不需要有開發者認證權限，你也可以分發給其他任何人。

如果打算上架官方應用市場，需要進行開發者認證後，才可發佈你的應用，並且受到官方版權保護。

目前還未支持線上直接申請認證，需要通過聯繫 **MineAdmin團隊成員** 給你開通開發者權限