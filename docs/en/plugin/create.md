# Create Application

Create a MineAdmin Application

## [Command Creation](./command.md#create-a-plugin)

MineAdmin allows you to create an application via the command line. First, navigate your command line to the root directory of your project, then enter the following command:

```shell
php bin/hyperf.php mine-extension:create test/demo --name test --type mix --author zds --description This is a mixed plugin
```

After executing this command, a plugin directory `plugin/test/demo` will be created. Refer to the [Directory Structure](./structure.md) for more details.

## Upload Application

Go to the [Application Submission Page](https://www.mineadmin.com/member/createApp), upload the application in a compressed (.zip) format, fill in the relevant information, and then wait for administrator approval.