# Contribution Guide  

:::tip Open Source Collaboration  
Open source thrives on collective support, which can take many forms—such as using the project, recommending it, writing tutorials, protecting the ecosystem, contributing code, answering questions, or sharing experiences. We warmly welcome you to join us!  
:::  

## Repository Addresses  
> **Please do not contribute to the Gitee repository.** Code submitted to Gitee will be overwritten by the GitHub repository, and your name will not appear in the contributor list.  

### GitHub  

* [MineAdmin Backend Source Code](https://github.com/mineadmin/mineadmin)  
* [MineAdmin Frontend Source Code](https://github.com/mineadmin/mineadmin-vue)  
* [MineAdmin Core Components](https://github.com/mineadmin/components)  
* [MineAdmin Documentation](https://github.com/mineadmin/doc-v3)  

### Gitee  

* [MineAdmin Backend Source Code](https://gitee.com/mineadmin/mineadmin)  
* [MineAdmin Frontend Source Code](https://gitee.com/mineadmin/mineadmin-vue)  

## What You Can Do  

### Follow [Issues](https://github.com/mineadmin/mineadmin/issues) Activity  

* We post pending development tasks in the issues section. If you're interested, feel free to leave a comment, and we'll respond promptly.  
* Reply to users' questions in the comments to help them.  
* Propose reasonable solutions based on the [issues](https://github.com/mineadmin/mineadmin/issues) content, fix bugs or implement features, and submit them as a [pull request](https://github.com/mineadmin/mineadmin/pulls) to the MineAdmin repository.  
* Track the progress and status of your submitted Pull Requests to expedite their merging into the main repository.  
* Review others' Pull Requests (Code Review) and provide your suggestions and feedback.  
* Develop standalone functional components based on your own or others' needs.  
* Improve the [documentation](https://gitee.com/mineadmin/doc-v3) to provide better usage instructions.  

### Pull Request Guidelines  

While we periodically publish pending development tasks, we also encourage you to propose features you'd like to implement. You can share your ideas in the [issues](https://github.com/mineadmin/mineadmin/issues), and we'll respond promptly regarding acceptance.  
Before submitting an issue, please check if a similar one already exists.  

* Fork this repository to your GitHub account.  
* Commit messages should follow the format: `[File Name]: Info about commit.` (Example: `README.md: Fix xxx bug`).  
* Before submitting code, run `composer cs-fix` to format the code.  
* Before submitting code, run `composer an` for static code analysis.  
* Before submitting code, run `composer test` for unit testing. **Do not run unit tests in any production environment**, as they may delete or modify data.  
* Ensure your PR is created from a feature branch, not directly from the `master` branch.  
* If your PR fixes a bug, include a description of the related bug.