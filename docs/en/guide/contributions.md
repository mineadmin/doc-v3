# Contribution Guide

:::tip Open Source Collaboration
Open source thrives on community support, and there are many ways to contribute, such as using, recommending, writing tutorials, protecting the ecosystem, contributing code, answering questions, sharing experiences, and more. We welcome you to join us!
:::

## Repository Addresses
> Please do not contribute to the Gitee repository, as code submitted to Gitee will be overwritten by the Github repository, and your name will not appear in the contributor list.

### Github

* [MineAdmin Backend Source Code](https://github.com/mineadmin/mineadmin)
* [MineAdmin Frontend Source Code](https://github.com/mineadmin/mineadmin-vue)
* [MineAdmin Core Components](https://github.com/mineadmin/components)
* [MineAdmin Documentation](https://github.com/mineadmin/doc-v3)

### Gitee

* [MineAdmin Backend Source Code](https://gitee.com/mineadmin/mineadmin)
* [MineAdmin Frontend Source Code](https://gitee.com/mineadmin/mineadmin-vue)

## What You Can Do

### Follow [issues](https://github.com/mineadmin/mineadmin/issues) Activity

* We will post some features to be developed in the issues. If you are interested, you can leave a message in the issues, and we will reply as soon as possible.
* Comment and reply to help users with their questions;
* Propose reasonable solutions based on the content of [issues](https://github.com/mineadmin/mineadmin/issues); fix bugs or implement features, and submit them as [pull requests](https://github.com/mineadmin/mineadmin/pulls) to the MineAdmin repository.
* Track the progress and status of your Pull Request to expedite its merging into the main repository;
* Conduct Code Reviews on Pull Requests submitted by others and provide your suggestions and opinions.
* Develop independent functional components based on your own or others' needs;
* Improve the [documentation](https://gitee.com/mineadmin/doc-v3) to provide better usage instructions.

### Pull Request Guide

Although we periodically release features to be developed, we welcome you to propose the features you want to implement. You can share your ideas in [issues](https://github.com/mineadmin/mineadmin/issues), and we will respond promptly on whether they will be accepted.
Before submitting an issue, please check if a similar issue has already been posted.

* Fork this repository to your Github account;
* The commit message format should be [File Name]: Info about commit. (For example) README.md: Fix xxx bug
* Before submitting code, run `composer cs-fix` to format the code;
* Before submitting code, run `composer an` for static code analysis;
* Before submitting code, run `composer test` for unit testing; do not run unit tests on any of your production environments as it will delete added data;
* Ensure that the PR is created from your feature branch, not directly from the master branch.
* If your PR fixes a bug, please provide a description of the related bug.