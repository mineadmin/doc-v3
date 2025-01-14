# Release Notes

## Version Control Scheme

Starting from `>=3.0`, MineAdmin adopts [Semantic Versioning](https://semver.org/) for its version control scheme. Major versions are released annually, while smaller patches are released `weekly or monthly`.

<el-alert type="warning">
This means that in your application, you should use version constraints similar to <el-tag type="danger">~3.0</el-tag>.
</el-alert>

## Named Parameters

[Named Parameters](https://www.php.net/manual/en/functions.arguments.php#functions.named-arguments) are not yet fully adopted. We may rename `class names`, `class method names`, and `function names` as necessary to improve MineAdmin's code.

The current official naming conventions are as follows:

1. All class names use `PascalCase`.
2. All class methods use `camelCase`.
3. Functions use `snake_case`.

## Support Plan

For all MineAdmin versions, `bug fixes` are supported for 18 months, and `security fixes` are supported for two years.

<el-alert type="warning">Due to historical reasons, security maintenance for <el-tag type="danger">2.0</el-tag> will end with the <a href="https://www.php.net/supported-versions.php">lifecycle of php8.3</a>.</el-alert>

| Version | PHP(*)  | Hyperf(*) | Release Date | Bug Fix End Date | Security Fix End Date |
|---------|---------|-----------|--------------|------------------|-----------------------|
| 0.4     | 8.0     | 2.2       | 2021-01      | 2024-01          | 2024-01               |
| 1.4     | 8.0     | 2.2       | 2022-07      | 2024-07          | 2024-07               |
| 2.0     | 8.1~8.3 | 3.1       | 2023-12      | 2027-12          | 2027-12               |
| 3.0     | 8.1~8.3 | >=3.1     | 2024-10      | 2026-04          | 2026-10               |

## MineAdmin 3.0

MineAdmin 3.0 makes development more convenient by introducing a simpler application structure.

## PHP8.1

MineAdmin 3.0 requires a minimum PHP version of 8.1.