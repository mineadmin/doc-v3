# 貢獻指南

:::tip 共建開源
開源需要大家一起來支援，支援的方式有很多種，比如使用、推薦、寫教程、保護生態、貢獻程式碼、回答問題、分享經驗等；歡迎您加入我們！
:::

## 倉庫地址
> 請不要貢獻到 Gitee 倉庫，Gitee提交的程式碼會被Github倉庫覆蓋、而且貢獻人列表也不會出現您的名字

### Github

* [MineAdmin 後端原始碼](https://github.com/mineadmin/mineadmin)
* [MineAdmin 前端原始碼](https://github.com/mineadmin/mineadmin-vue)
* [MineAdmin 核心元件](https://github.com/mineadmin/components)
* [MineAdmin 文件](https://github.com/mineadmin/doc-v3)

### Gitee

* [MineAdmin 後端原始碼](https://gitee.com/mineadmin/mineadmin)
* [MineAdmin 前端原始碼](https://gitee.com/mineadmin/mineadmin-vue)

## 你可以做什麼

### 關注 [issues](https://github.com/mineadmin/mineadmin/issues) 動態

* 我們會在 issues 中釋出一些待開發的功能，如果你感興趣，可以在 issues 中留言，我們會盡快回復。
* 評論回覆幫助提出疑問的使用者；
* 根據[issues](https://github.com/mineadmin/mineadmin/issues)內容，提出合理的解決方案；去修復bug或者實現功能，並以 [pull request](https://github.com/mineadmin/mineadmin/pulls) 形式提交至 MineAdmin 倉庫
* 關注自己提交 Pull Request 的進度和狀態，以推動您的 Pull Request 儘快合入主倉庫；
* 對其他人提交的 Pull Request 進行 Code Review，並給出您的建議和看法。
* 根據他人或自己的需求，研發獨立的功能元件；
* 完善[文件](https://gitee.com/mineadmin/doc-v3)，提供更好的使用說明。

###  Pull Request 指南

雖然我們會定期釋出一些待開發的功能，但是我們更歡迎你自己提出你想要實現的功能。你可以在 [issues](https://github.com/mineadmin/mineadmin/issues) 中提出你的想法，我們會盡快回復是否接受。
在提交問題之前，請檢查是否已經發布了類似的問題。

* fork 本倉庫到你的 Github 賬號下；
* 提交資訊的格式應為 [File Name]: Info about commit. （例如） README.md: Fix xxx bug
* 提交程式碼前，請先執行 `composer cs-fix` 進行程式碼格式化；
* 提交程式碼前，請先執行 `composer an` 進行程式碼靜態檢查；
* 提交程式碼前，請先執行 `composer test` 進行單元測試；單元測試不要在您的任何生產環境上執行，因為它會刪除新增資料；
* 確保將 PR 建立為你的功能分支， 而不是 master 分支上直接提交修改。
* 如果你的 PR 修復了 bug，請提供有關相關 bug 的描述。