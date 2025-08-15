# App Publishing

Package and publish your application to the app store for other users to download and use.

## App Packaging

Currently, one packaging method is provided: treating the plugin application's entire directory as a Git repository project. It can be hosted on code hosting platforms like `GitHub` or `Gitee`, or on MineAdmin's self-built Git server at http://git.mineadmin.com.

### Packaging Steps

1. Treat the app directory as a Git repository project and push it to a code hosting platform.

```shell
cd your-plugin-app-directory

git init

git add .

git commit -m "first commit"

git remote add origin your-repository-url

git push -u origin master
```

2. Go to the [MineAdmin Plugin Creation Page](https://www.mineadmin.com/member/createApp), enter the repository URL, and submit.

<ElImage :preview-src-list="['/images/create_app.png']" src="/images/create_app.png"></ElImage>

3. After MineAdmin approves your submission, the app will appear in the app store.

::: Warning: Packaging Notes

* Ensure all required fields in `mine.json` are filled out completely; otherwise, the app cannot be published.
* Submitted apps undergo review before appearing in the app store. Please be aware of this process.
* Make sure your plugin directory does not contain an `install.lock` file, as this will prevent proper installation.

:::

## App Version Control

To maintain the health, reliability, and security of the `MineAdmin` ecosystem, we recommend following the <a href="https://semver.org/lang/zh-CN/" target="_blank">Semantic Versioning Specification</a> when releasing major updates to your apps.

### Recommendations
We suggest starting your app version at 1.0.0 and incrementing as follows:

| Code Status           | Stage Description | Rule         | Example Version  |
|:---------------------|:-----------------|:------------|:----------------|
| Initial release       | New version launch | Start at 1.0.0 | 1.0.0 |
| Backward-compatible bug fixes | Bug fixes, patch release | Increment third digit | 1.0.1 |
| Backward-compatible new features | Minor feature additions | Increment second digit | 1.1.0 |
| Breaking, non-backward-compatible changes | Major updates | Increment first digit | 2.0.0 |