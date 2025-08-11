# Notes  

When using the data permission feature, please keep the following points in mind:  

1. Ensure that the data isolation method and scope are correctly configured before using data permissions.  
2. Ensure that the data permission feature is used within a single coroutine to avoid invalidation due to cross-coroutine usage.  
3. When applying data permissions, avoid manually adding conditions in queries that conflict with data permissions, as this may cause the permissions to fail.