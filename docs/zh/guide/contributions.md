# 贡献指南

:::tip 共建开源
开源需要大家一起来支持，支持的方式有很多种，比如使用、推荐、写教程、保护生态、贡献代码、回答问题、分享经验等；欢迎您加入我们！
:::

## 仓库地址
> 请不要贡献到 Gitee 仓库，Gitee提交的代码会被Github仓库覆盖、而且贡献人列表也不会出现您的名字

### Github

* [MineAdmin 后端源代码](https://github.com/mineadmin/mineadmin)
* [MineAdmin 前端源代码](https://github.com/mineadmin/mineadmin-vue)
* [MineAdmin 内核组件](https://github.com/mineadmin/components)
* [MineAdmin 文档](https://github.com/mineadmin/doc-v3)

### Gitee

* [MineAdmin 后端源代码](https://gitee.com/mineadmin/mineadmin)
* [MineAdmin 前端源代码](https://gitee.com/mineadmin/mineadmin-vue)

## 你可以做什么

### 关注 [issues](https://github.com/mineadmin/mineadmin/issues) 动态

* 我们会在 issues 中发布一些待开发的功能，如果你感兴趣，可以在 issues 中留言，我们会尽快回复。
* 评论回复帮助提出疑问的用户；
* 根据[issues](https://github.com/mineadmin/mineadmin/issues)内容，提出合理的解决方案；去修复bug或者实现功能，并以 [pull request](https://github.com/mineadmin/mineadmin/pulls) 形式提交至 MineAdmin 仓库
* 关注自己提交 Pull Request 的进度和状态，以推动您的 Pull Request 尽快合入主仓库；
* 对其他人提交的 Pull Request 进行 Code Review，并给出您的建议和看法。
* 根据他人或自己的需求，研发独立的功能组件；
* 完善[文档](https://gitee.com/mineadmin/doc-v3)，提供更好的使用说明。

###  Pull Request 指南

虽然我们会定期发布一些待开发的功能，但是我们更欢迎你自己提出你想要实现的功能。你可以在 [issues](https://github.com/mineadmin/mineadmin/issues) 中提出你的想法，我们会尽快回复是否接受。
在提交问题之前，请检查是否已经发布了类似的问题。

* fork 本仓库到你的 Github 账号下；
* 提交信息的格式应为 [File Name]: Info about commit. （例如） README.md: Fix xxx bug
* 提交代码前，请先执行 `composer cs-fix` 进行代码格式化；
* 提交代码前，请先执行 `composer an` 进行代码静态检查；
* 提交代码前，请先执行 `composer test` 进行单元测试；单元测试不要在您的任何生产环境上运行，因为它会删除添加数据；
* 确保将 PR 创建为你的功能分支， 而不是 master 分支上直接提交修改。
* 如果你的 PR 修复了 bug，请提供有关相关 bug 的描述。