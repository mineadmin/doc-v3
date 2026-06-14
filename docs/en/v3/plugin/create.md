# Create Application

Create a MineAdmin Application

## [Command Creation](./command.md#create-a-plugin)

MineAdmin allows you to create an application via command line. First, navigate your current command line directory to the project root directory, then enter the following command:

```shell
php bin/hyperf.php mine-extension:create test/demo --name test --type mix --author zds --description This is a hybrid plugin
```

After executing this command, a `plugin/test/demo` plugin directory will be created. See [Directory Structure](./structure.md) for details.

## Upload Application

Go to the [Application Publishing Page](https://www.mineadmin.com/member/createApp), upload the application compressed package in `.zip` format, fill in the relevant information, and then wait for administrator review.