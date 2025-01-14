# 建立應用

建立一個MineAdmin應用

## [命令建立](./command.md#建立一個外掛)

MineAdmin可以透過命令列建立一個應用，首先，將當前命令列目錄定位到我們的專案根目錄，然後輸入下面這行命令：

```shell
php bin/hyperf.php mine-extension:create test/demo --name test --type mix --author zds --description 這是一個混合外掛
```

執行此命令列後將會建立一個 plugin/test/demo 外掛目錄,[目錄規範](./structure.md)

## 上傳應用

進入 [應用釋出頁面](https://www.mineadmin.com/member/createApp)，上傳應用壓縮包(.zip)格式，然後填寫相關資訊即可，然後等待管理員稽核
