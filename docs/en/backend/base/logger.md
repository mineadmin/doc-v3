# Log Handling

## Command Line Logs in Development Mode

In the `.env` file, if `APP_DEBUG=true`, the server will automatically output all error logs to the command line. This facilitates local debugging for developers.  
If `APP_DEBUG=true`, the server will attempt to output logs to the default logging channel `loggerFactor->get('xxx','default')`.

::: tip

For more documentation on log usage, please refer to the [Hyperf](https://hyperf.io) documentation. Basic usage will not be further explained here.

:::