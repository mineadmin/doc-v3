# Contribution Guide

:::tip Build Open Source Together
Open source requires everyone's support. There are many ways to support it, such as using, recommending, writing tutorials, protecting the ecosystem, contributing code, answering questions, sharing experiences, etc. Welcome to join us!
:::

## Repository Addresses
> Please do not contribute to the Gitee repository. Code submitted to Gitee will be overwritten by the Github repository, and your name will not appear in the contributor list.

### Github

* [MineAdmin Backend Source Code](https://github.com/mineadmin/mineadmin)
* [MineAdmin Frontend Source Code](https://github.com/mineadmin/mineadmin-vue)
* [MineAdmin Core Components](https://github.com/mineadmin/components)
* [MineAdmin Documentation](https://github.com/mineadmin/doc-v3)

### Gitee

* [MineAdmin Backend Source Code](https://gitee.com/mineadmin/mineadmin)
* [MineAdmin Frontend Source Code](https://gitee.com/mineadmin/mineadmin-vue)

## What You Can Do

### Monitor [Issues](https://github.com/mineadmin/mineadmin/issues) Activity

* We will publish features to be developed in issues. If you are interested, you can leave a comment in the issues, and we will reply as soon as possible.
* Reply to comments to help users who have questions.
* Based on the content of [issues](https://github.com/mineadmin/mineadmin/issues), propose reasonable solutions; fix bugs or implement features, and submit them to the MineAdmin repository as a [pull request](https://github.com/mineadmin/mineadmin/pulls).
* Monitor the progress and status of your submitted Pull Request to facilitate its merger into the main repository as soon as possible.
* Perform Code Review on Pull Requests submitted by others and provide your suggestions and opinions.
* Develop independent functional components based on the needs of others or yourself.
* Improve the [documentation](https://gitee.com/mineadmin/doc-v3) to provide better usage instructions.

### Pull Request Guide

Although we will periodically publish features to be developed, we welcome you to propose features you wish to implement. You can propose your ideas in [issues](https://github.com/mineadmin/mineadmin/issues), and we will reply as soon as possible regarding acceptance. Before submitting an issue, please check if a similar issue has already been published.

* Fork this repository to your Github account.
* The commit message format should be [File Name]: Info about commit. (e.g.) README.md: Fix xxx bug
* Before submitting code, first execute `composer cs-fix` to format the code.
* Before submitting code, first execute `composer an` to perform static code analysis.
* Before submitting code, first execute `composer test` to run unit tests. Do not run unit tests in any of your production environments, as they will delete and add data.
* Ensure the PR is created from your feature branch, rather than directly submitting modifications on the master branch.
* If your PR fixes a bug, please provide a description of the related bug.