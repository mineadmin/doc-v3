# 創建應用

創建一個MineAdmin應用

## [命令創建](./command.md#創建一個插件)

MineAdmin可以通過命令行創建一個應用，首先，將當前命令行目錄定位到我們的項目根目錄，然後輸入下面這行命令：

```shell
php bin/hyperf.php mine-extension:create test/demo --name test --type mix --author zds --description 這是一個混合插件
```

執行此命令行後將會創建一個 plugin/test/demo 插件目錄,[目錄規範](./structure.md)

## 上傳應用

進入 [應用發佈頁面](https://www.mineadmin.com/member/createApp)，上傳應用壓縮包(.zip)格式，然後填寫相關信息即可，然後等待管理員審核
