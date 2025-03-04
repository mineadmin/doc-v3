# 应用发布

打包应用并发布到应用市场, 供其他用户下载使用。

## 应用打包

目前提供一种打包方式，将插件应用整个目录作为一个 git 仓库项目。可以托管到 `github`、`gitee` 等代码托管平台。
也可以托管到 MineAdmin 自建的 GIT 服务器上。 http://git.mineadmin.com


### 打包步骤

1. 将应用目录作为一个 git 仓库项目，提交到代码托管平台。

```shell
cd 你的插件应用目录

git init

git add .

git commit -m "first commit"

git remote add origin 你的代码仓库地址

git push -u origin master
```

2. 进入 [MineAdmin 插件创建页](https://www.mineadmin.com/member/createApp) 输入代码仓库地址并提交

<ElImage :preview-src-list="['/public/images/create_app.png']" src="/public/images/create_app.png"></ElImage>

3. 等待 MineAdmin 审核通过后，应用会显示在应用市场中。

::: warning 打包注意事项

* 一定要将 `mine.json` 必填信息填写完整，否则应用无法正常发布。
* 应用上传后，会经过我们审核，审核通过后，才会显示到应用市场，请知悉。
* 请确保你的插件目录中不包含 `install.lock` 文件，否则会导致应用无法正常安装。

:::

## 应用版本控制

为了保持 `MineAdmin` 生态系统的健康、可靠和安全，每次你对自己拥有的应用进行重大更新时，我们建议遵循：
<a href="https://semver.org/lang/zh-CN/" target="_blank">semantic versioning spec</a>
的基础上发布新版本。

### 建议
我们建议你的应用版本从1.0.0开始并递增，如下：

| 代码状态           | 阶段说明          | 规则         | 示例版本号  |
|:---------------|:--------------|:-----------|:-------|
| 代码首次发布         | 新版本上线         | 从 1.0.0 开始 | 	1.0.0 |
| 代码向后兼容的错误修复    | Bug 修复，发布补丁版本 | 建议增加第三位数字  | 	1.0.1 |
| 代码向后兼容的新功能     | 新增小功能，发布次要版本  | 建议增加第二位数字  | 	1.1.0 |
| 代码破坏并不向后兼容性的变更 | 破坏性更新，发布主要版本  | 建议增加第一位数字  | 	2.0.0 |
