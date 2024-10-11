# 准备工作

::: tip
如果开发 MineAdmin 应用；首先，得熟悉 MineAdmin 和 Hyperf 框架，然后做以下的准备工作。
:::

## 获取AccessToken

MineAdmin不管下载插件应用、更新插件应用还是开发插件应用都需要 `ACCESS_TOKEN`

获取步骤：

- 登录 [MineAdmin](https://www.mineadmin.com/login) 官网
- 进入 `个人中心`  的 [_设置_](https://www.mineadmin.com/member/setting) 页面
- 点击查看`我的AccessToken`

::: danger

---
 
注意

请保管好自己的 AccessToken，不要泄露！！！

---

:::

## 配置后端 .env 文件

打开后端根目录的 _.env_ 文件，找到 **MINE_ACCESS_TOKEN** 项，把刚复制的字符串粘贴到 **等号** 后面

```ini [.env]
APP_NAME = MineAdmin

APP_ENV = dev

# 省略...

MINE_ACCESS_TOKEN = 107299501236086
```

## 申请开发者

如果仅是本地开发应用并且自己使用，这种情况不需要有开发者认证权限，你也可以分发给其他任何人。

如果打算上架官方应用市场，需要进行开发者认证后，才可发布你的应用，并且受到官方版权保护。

目前还未支持线上直接申请认证，需要通过联系 **MineAdmin团队成员** 给你开通开发者权限