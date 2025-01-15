# 常见问题

---

## 安装成功后报错 `DNS Lookup resolve failed`

检查 `.env` 文件中的 `mysql` `redis` 是否正确,能否正常连接

---

## 购买的插件无法使用

如果是付费插件请在QQ群或微信群联系管理员，提供订单号，管理员会拉你进对应的插件售后群

---



## 如何从 Swoole 切换到 Swow

::: warning

Swow 安装请参考 [Swow 官方文档](https://docs.toast.run/swow-blog/chs/init.html#%E6%94%AF%E6%8C%81%E7%9A%84%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F) 

:::

1. copy 项目目录下的 `.github/ci/server.php` 覆盖 `config/autoload/server.php`
2. copy 项目目录下的 `.github/ci/hyperf.php` 覆盖 `bin/hyperf.php`

重新启动即可

---