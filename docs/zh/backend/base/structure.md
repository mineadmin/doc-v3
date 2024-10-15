# 目录结构

默认的 MineAdmin 应用程序结构旨在为大型和小型应用程序提供一个良好的起点。但是你可以自由地组织你的应用程序

在 `>=3.0` 版本中我们参考了 [laravel](https://laravel.com/) 的目录结构。如果你有接触过那么对你来说将会异常简单

## 根目录

### App 目录

包含应用程序的核心代码。应用程序中几乎所有的类都将在此目录中

### Config 目录

包含所有应用程序的配置文件

### Database 目录

包含数据库迁移、模型工厂和数据填充文件

### Storage 目录

包含日志、语言文件。默认上传文件、Swagger OpenApi 文件

### Tests 目录

包含自动化测试。 开箱即用的示例 PHPUnit 单元测试和功能测试

### Web 目录

包含了前端应用代码

### Plugin 目录

包含了你从插件市场下载的插件，每个新应用都默认自带应用市场插件

## App 目录

在一个经典项目开发中，你的绝大部分业务代码将都位于 `app` 目录下

### Exceptions 目录

`Exceptions` 目录包含应用程序的异常处理程序，也是放置应用程序抛出的任何异常的好地方。 如果你想自定义记录或呈现异常，你应该修改此目录中的 Handler 目录。

### Http 目录

和 Laravel 一致，Http 目录包含你的控制器、中间件和表单请求。 几乎所有处理进入应用程序的请求的逻辑都将放在这个目录中。


### Model 目录

包含所有 Eloquent 模型类。 MineAdmin 中包含的 Eloquent ORM 提供了一个漂亮、简单的 ActiveRecord 实现来处理你的数据库。 每个数据库表都有一个相应的「模型」，用于与该表进行交互。 模型允许你查询表中的数据，以及将新记录插入表中

<el-alert type="warning">
使用方法参考 <a href="https://laravel.com/docs/11.x/eloquent">laravel 文档</a> 
中国开发者参考 <a href="https://learnku.com/docs/laravel/10.x/eloquent/14888">国内译文</a>
<br />
注意，<a href="https://hyperf.wiki/3.1/#/en/">协程版 Eloquent ORM</a> 由 <a href="https://github.com/hyperf/hyperf"> Hyperf </a>维护
在用法上会和 Laravel 官方有一定差异。
<br />
如需某个特性功能请往 <a href="https://github.com/hyperf/hyperf/issues"> Hyperf </a> 提交您的问题。或参与开发
</el-alert>

### Service 目录

包含所有的业务逻辑实行类，Service 将调度 `Repository`、`Model` 进行业务编排，使其最终实现业务逻辑

### Repository 目录

包含所有的存储查询类，调度 `redis`,`model`,`es` 等各种外部程序进行数据的组装和处理。并将结果返回到上一层

### Schema 目录

包含所有的 Swagger Schema 类，理论上 <el-tag type="danger">严格禁止</el-tag> 参与业务调度。此目录只是为了方便生成 Swagger OpenApi 文件

