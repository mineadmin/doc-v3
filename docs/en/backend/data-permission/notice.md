# Notes

When using the data permission feature, please keep the following points in mind:

1. Ensure that the data isolation method and scope are properly configured before using data permissions.
2. Make sure to use the data permission feature within a single coroutine to avoid permission failures caused by cross-coroutine usage.
3. When applying data permissions, be careful not to manually add query conditions that conflict with the data permissions, as this may cause the permissions to fail.