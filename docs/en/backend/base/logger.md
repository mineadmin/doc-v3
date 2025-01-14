# Log Processing

## Command Line Logs in Development Mode

In the `.env` file, if `APP_DEBUG=true`, the server will automatically output all error logs to the command line. This facilitates local debugging for developers.
If `APP_DEBUG=true`, the server will try to output logs to the default `loggerFactor->get('xxx','default')` log channel.

::: tip

For more documentation on log usage, please refer to the [Hyperf](https://hyperf.io) documentation. This article will not elaborate on basic usage.

:::