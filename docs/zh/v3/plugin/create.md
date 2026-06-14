# 创建应用

创建一个MineAdmin应用

## [命令创建](./command.md#创建一个插件)

MineAdmin可以通过命令行创建一个应用，首先，将当前命令行目录定位到我们的项目根目录，然后输入下面这行命令：

```shell
php bin/hyperf.php mine-extension:create test/demo --name test --type mix --author zds --description 这是一个混合插件
```

执行此命令行后将会创建一个 plugin/test/demo 插件目录,[目录规范](./structure.md)

## 上传应用

进入 [应用发布页面](https://www.mineadmin.com/member/createApp)，上传应用压缩包(.zip)格式，然后填写相关信息即可，然后等待管理员审核
