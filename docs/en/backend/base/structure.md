# Directory Structure

The default MineAdmin application structure is designed to provide a good starting point for both large and small applications. However, you are free to organize your application as you see fit.

We have referenced the [Laravel](https://laravel.com/) directory structure. If you have experience with it, this will be very straightforward for you.

## Root Directory

### App Directory

Contains the core code of the application. Almost all classes in the application will be located here.

### Config Directory

Contains all the configuration files for the application.

### Database Directory

Contains database migrations, model factories, and data seeding files.

### Storage Directory

Contains logs, language files, default upload files, and Swagger OpenApi files.

### Tests Directory

Contains automated tests. Out-of-the-box examples include PHPUnit unit tests and functional tests.

### Web Directory

Contains the front-end application code.

### Plugin Directory

Contains plugins downloaded from the plugin market. Each new application comes with the App Market plugin by default.

## App Directory

In a classic project development, the majority of your business code will be located in the `app` directory.

### Exceptions Directory

The `Exceptions` directory contains the application's exception handlers and is also a good place to store any exceptions thrown by the application. If you want to customize how exceptions are logged or rendered, you should modify the Handler directory within this directory.

### Http Directory

Consistent with Laravel, the Http directory contains your controllers, middleware, and form requests. Almost all logic for handling incoming requests to the application will be placed in this directory.

### Model Directory

Contains all Eloquent model classes. The Eloquent ORM included in MineAdmin provides a beautiful, simple ActiveRecord implementation for interacting with your database. Each database table has a corresponding "model" used to interact with that table. Models allow you to query data from the table and insert new records into the table.

::: warning

Usage reference: [Laravel Documentation](https://laravel.com/docs/11.x/eloquent), for Chinese developers, refer to [Chinese Translation](https://learnku.com/docs/laravel/10.x/eloquent/14888).

Note that the [Coroutine Version of Eloquent ORM](https://hyperf.wiki/3.1/#/en/) is maintained by [Hyperf](https://github.com/hyperf/hyperf). There may be some differences in usage compared to the official Laravel documentation.

:::

### Service Directory

Contains all business logic implementation classes. The Service layer orchestrates `Repository` and `Model` to implement business logic.

### Repository Directory

Contains all storage query classes, orchestrating `redis`, `model`, `es`, and other external programs for data assembly and processing. The results are then returned to the upper layer.

### Schema Directory

Contains all Swagger Schema classes. In theory, <el-tag type="danger">strictly prohibited</el-tag> from participating in business orchestration. This directory is solely for the convenience of generating Swagger OpenApi files.