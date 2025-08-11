# Contribution Guide  

:::tip Open Source Collaboration  
Open source thrives on collective support, which can take many forms—using the software, recommending it, writing tutorials, protecting the ecosystem, contributing code, answering questions, sharing experiences, and more. Welcome to join us!  
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

* We post upcoming features in **Issues**. If you're interested, leave a comment, and we'll respond promptly.  
* Help users by answering their questions in the comments.  
* Propose reasonable solutions based on the [Issues](https://github.com/mineadmin/mineadmin/issues) content, fix bugs, or implement features, then submit them as a [Pull Request](https://github.com/mineadmin/mineadmin/pulls) to the MineAdmin repository.  
* Track the progress and status of your submitted Pull Requests to ensure they are merged into the main repository as soon as possible.  
* Review others' Pull Requests with constructive feedback and suggestions.  
* Develop independent functional components based on your own or others' needs.  
* Improve the [documentation](https://gitee.com/mineadmin/doc-v3) to provide better usage instructions.  

### Pull Request Guidelines  

While we periodically post features awaiting development, we highly encourage you to propose ideas you'd like to implement. You can share your thoughts in [Issues](https://github.com/mineadmin/mineadmin/issues), and we'll respond promptly on whether they'll be accepted.  
Before submitting an issue, check if a similar one already exists.  

* Fork this repository to your GitHub account.  
* Commit messages should follow the format: **[File Name]: Info about commit.** (Example) `README.md: Fix xxx bug`  
* Before submitting code, run `composer cs-fix` to format your code.  
* Before submitting code, run `composer an` for static code analysis.  
* Before submitting code, run `composer test` for unit testing. **Do not run unit tests in any production environment**, as it will delete added data.  
* Ensure your PR is created from a feature branch, not directly from the `master` branch.  
* If your PR fixes a bug, include a description of the related bug.