# Application Publishing  

Package your application and publish it to the marketplace for other users to download and use.  

## Application Packaging  

Currently, one packaging method is provided: treating the plugin application's entire directory as a Git repository project. It can be hosted on code platforms like `GitHub` or `Gitee`, or on MineAdmin's self-built Git server at [http://git.mineadmin.com](http://git.mineadmin.com).  

### Packaging Steps  

1. Treat the application directory as a Git repository project and push it to a code hosting platform.  

```shell  
cd your-plugin-application-directory  

git init  

git add .  

git commit -m "first commit"  

git remote add origin your-repository-url  

git push -u origin master  
```  

2. Go to the [MineAdmin Plugin Creation Page](https://www.mineadmin.com/member/createApp), enter the repository URL, and submit.  

<ElImage :preview-src-list="['/public/images/create_app.png']" src="/public/images/create_app.png"></ElImage>  

3. After MineAdmin's review and approval, the application will appear in the marketplace.  

::: warning Packaging Notes  

* Ensure all required fields in `mine.json` are filled out completely; otherwise, the application cannot be published.  
* After uploading, your application will undergo review. It will only appear in the marketplace once approved.  
* Make sure your plugin directory does not contain an `install.lock` file, as this will prevent proper installation.  

:::  

## Application Version Control  

To maintain the health, reliability, and security of the `MineAdmin` ecosystem, we recommend adhering to the <a href="https://semver.org/lang/zh-CN/" target="_blank">Semantic Versioning Specification</a> when releasing major updates to your applications.  

### Recommendations  
We suggest starting your application version at 1.0.0 and incrementing it as follows:  

| Code Status           | Stage Description          | Rule         | Example Version  |  
|:----------------------|:---------------------------|:-------------|:-----------------|  
| Initial Release       | New version launch         | Start at 1.0.0 | 1.0.0 |  
| Backward-compatible bug fixes | Bug fixes, patch release | Increment the third digit | 1.0.1 |  
| Backward-compatible new features | Minor feature additions | Increment the second digit | 1.1.0 |  
| Breaking changes (non-backward-compatible) | Major updates | Increment the first digit | 2.0.0 |