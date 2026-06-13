# Log Handling

## Command Line Logging in Development Mode

In the `.env` file, if `APP_DEBUG=true`, the server will automatically output all error logs to the command line. This facilitates local debugging for developers.
If `APP_DEBUG=false`, the server will output logs as much as possible to the default `loggerFactor->get('xxx','default')` log channel.

::: tip

For more documentation on log usage, please refer to the [hyperf](https://hyperf.io) documentation. Basic usage will not be explained further here.

:::