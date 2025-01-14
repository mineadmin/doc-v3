# Application Release

Package and release your application

---

## Application Packaging
Once your application development is complete, you can upload it to the official app marketplace for others to download and use.

### Packaging Notes

* Please compress the files at the root directory, meaning the compressed file should directly display the file list when opened, without an additional folder layer. For example, package the following structure:

```shell
xmo@XMo:/opt/www/plugin/mine-admin/app-store$ ls -l
total 0
-rwxrwxrwx 1 xmo xmo   1 Apr 22 16:34 install.lock
-rwxrwxrwx 1 xmo xmo 420 May 27 10:11 mine.json
drwxrwxrwx 1 xmo xmo 512 May 27 10:11 src
```

* Ensure that all required information in `mine.json` is filled out completely; otherwise, the application cannot be published normally.
* After uploading, the application will undergo our review process. It will only be displayed in the app marketplace once it passes the review. Please be aware of this.

## Application Version Control

To maintain the health, reliability, and security of the `MineAdmin` ecosystem, we recommend following the <a href="https://semver.org/lang/zh-CN/" target="_blank">semantic versioning spec</a> when releasing significant updates to your applications.

### Recommendations
We suggest starting your application version at 1.0.0 and incrementing as follows:

| Code Status           | Stage Description          | Rule         | Example Version  |
|:---------------|:--------------|:-----------|:-------|
| Initial Release         | New version launch         | Start at 1.0.0 | 	1.0.0 |
| Backward-compatible bug fixes    | Bug fixes, patch release | Increment the third digit  | 	1.0.1 |
| Backward-compatible new features     | Minor feature additions, minor release  | Increment the second digit  | 	1.1.0 |
| Breaking changes that are not backward-compatible | Major updates, major release  | Increment the first digit  | 	2.0.0 |