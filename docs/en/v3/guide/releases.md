# Release Notes

## Versioning Scheme

MineAdmin adopts [Semantic Versioning](https://semver.org/) for versioning starting from `>=3.0`
Major versions are released annually, while smaller patches are released `weekly or monthly`

<el-alert type="warning">
This means you should use version constraints like <el-tag type="danger">~3.0</el-tag> in your application whenever possible
</el-alert>

## Naming Parameters

[Named arguments](https://www.php.net/manual/en/functions.arguments.php#functions.named-arguments) are not yet fully adopted.
We may rename `class names`, `class methods`, and `functions` as necessary to improve MineAdmin code

The current official naming conventions are as follows

1. All classes use `PascalCase` naming
2. All class methods use `camelCase` naming
3. Functions use `snake_case` naming

## Support Policy

For all MineAdmin versions, `bug fixes` are provided for 18 months of support, and `security fixes` are provided for two years of support

<el-alert type="warning">Due to historical reasons, <el-tag type="danger">2.0</el-tag> security maintenance services will end with the <a href="https://www.php.net/supported-versions.php">end of life</a> of PHP 8.3</el-alert>


| Version | PHP(*)  | Hyperf(*) | Release Date | Bug Fix End Date | Security Fix End Date |
|---------|---------|-----------|--------------|------------------|-----------------------|
| 0.4     | 8.0     | 2.2       | 2021-01      | 2024-01          | 2024-01               |
| 1.4     | 8.0     | 2.2       | 2022-07      | 2024-07          | 2024-07               |
| 2.0     | 8.1~8.3 | 3.1       | 2023-12      | 2027-12          | 2027-12               |
| 3.0     | 8.1~8.3 | >=3.1     | 2024-10      | 2026-04          | 2026-10               |