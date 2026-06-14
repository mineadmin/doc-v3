# Application Publishing

Package the application and publish it to the app marketplace for other users to download and use.

## Application Packaging

Currently, there is one packaging method: treating the entire plugin application directory as a Git repository project. It can be hosted on code hosting platforms such as `github`, `gitee`, etc.

It can also be hosted on MineAdmin's self-built GIT server at http://git.mineadmin.com

### Packaging Steps

1. Treat the application directory as a Git repository project and submit it to a code hosting platform.

```shell
cd your-plugin-app-directory

git init

git add .

git commit -m "first commit"

git remote add origin your-code-repository-url

git push -u origin master
```

2. Go to the [MineAdmin Plugin Creation Page](https://www.mineadmin.com/member/createApp), enter the code repository URL, and submit.

<ElImage :preview-src-list="['/images/create_app.png']" src="/images/create_app.png"></ElImage>

3. After MineAdmin approves the review, the application will be displayed in the app marketplace.

::: warning Packaging Notes

* Ensure that all required fields in `mine.json` are filled out completely; otherwise, the application cannot be published properly.
* After uploading the application, it will undergo our review process. It will only be displayed in the app marketplace after approval. Please be aware.
* Make sure your plugin directory does not contain the `install.lock` file; otherwise, the application cannot be installed correctly.

:::

## Application Version Control

To maintain a healthy, reliable, and secure ecosystem for `MineAdmin`, we recommend that for every major update to an application you own, you publish a new version following the <a href="https://semver.org/" target="_blank">Semantic Versioning spec</a>.

### Recommendation

We recommend starting your application version at 1.0.0 and incrementing it as follows:

| Code Status                             | Stage Description              | Rule                         | Example Version |
|:----------------------------------------|:-------------------------------|:-----------------------------|:----------------|
| First release of code                   | New version launch             | Start from 1.0.0             | 1.0.0           |
| Backward-compatible bug fixes           | Bug fix, patch release         | Increase the third digit     | 1.0.1           |
| Backward-compatible new functionality   | Minor feature addition, minor version | Increase the second digit   | 1.1.0           |
| Breaking, non-backward-compatible changes | Destructive update, major version | Increase the first digit     | 2.0.0           |