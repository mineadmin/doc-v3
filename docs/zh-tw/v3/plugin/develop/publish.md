# 應用釋出

打包應用併發布到應用市場, 供其他使用者下載使用。

## 應用打包

目前提供一種打包方式，將外掛應用整個目錄作為一個 git 倉庫專案。可以託管到 `github`、`gitee` 等程式碼託管平臺。
也可以託管到 MineAdmin 自建的 GIT 伺服器上。 http://git.mineadmin.com


### 打包步驟

1. 將應用目錄作為一個 git 倉庫專案，提交到程式碼託管平臺。

```shell
cd 你的外掛應用目錄

git init

git add .

git commit -m "first commit"

git remote add origin 你的程式碼倉庫地址

git push -u origin master
```

2. 進入 [MineAdmin 外掛建立頁](https://www.mineadmin.com/member/createApp) 輸入程式碼倉庫地址並提交

<ElImage :preview-src-list="['/images/create_app.png']" src="/images/create_app.png"></ElImage>

3. 等待 MineAdmin 稽核通過後，應用會顯示在應用市場中。

::: warning 打包注意事項

* 一定要將 `mine.json` 必填資訊填寫完整，否則應用無法正常釋出。
* 應用上傳後，會經過我們稽核，稽核通過後，才會顯示到應用市場，請知悉。
* 請確保你的外掛目錄中不包含 `install.lock` 檔案，否則會導致應用無法正常安裝。

:::

## 應用版本控制

為了保持 `MineAdmin` 生態系統的健康、可靠和安全，每次你對自己擁有的應用進行重大更新時，我們建議遵循：
<a href="https://semver.org/lang/zh-CN/" target="_blank">semantic versioning spec</a>
的基礎上釋出新版本。

### 建議
我們建議你的應用版本從1.0.0開始並遞增，如下：

| 程式碼狀態           | 階段說明          | 規則         | 示例版本號  |
|:---------------|:--------------|:-----------|:-------|
| 程式碼首次釋出         | 新版本上線         | 從 1.0.0 開始 | 	1.0.0 |
| 程式碼向後相容的錯誤修復    | Bug 修復，釋出補丁版本 | 建議增加第三位數字  | 	1.0.1 |
| 程式碼向後相容的新功能     | 新增小功能，釋出次要版本  | 建議增加第二位數字  | 	1.1.0 |
| 程式碼破壞並不向後相容性的變更 | 破壞性更新，釋出主要版本  | 建議增加第一位數字  | 	2.0.0 |
