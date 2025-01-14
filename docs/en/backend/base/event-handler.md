# Events

MineAdmin's events are based on [hyperf/event](https://github.com/hyperf/event). To understand how events operate, please refer to the [Hyperf documentation](https://hyperf.io). This article will not further elaborate on the event mechanism.

## Default Built-in Listeners

| Listener                           | Purpose                                                                 | Built-in |
|------------------------------------|-------------------------------------------------------------------------|----------|
| ErrorExceptionHandler              | When an error occurs, if the current error reporting level matches the given error level, an ErrorException is thrown | √        |
| UploadSubscriber                   | Default file upload handling                                            | √        |
| BootApplicationSubscriber          | Registers the seeders and migrations directories under the databases directory to the global migration instance when the application starts | √        |
| DbQueryExecutedSubscriber          | Prints the SQL information for each execution based on the env configuration | √        |
| FailToHandleSubscriber             | Prints error information when a Command execution fails                  | √        |
| ResumeExitCoordinatorSubscriber    | Handles Worker process exit                                             | √        |
| QueueHandleSubscriber              | Prints queue-related information when a queue is executed                | √        |
| RegisterBlueprintListener          | Registers new Blueprint methods                                         | √        |