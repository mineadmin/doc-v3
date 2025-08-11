# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [v3.0.6] - 2025-08-02

### ✨ Features
- feat(e2e): add Playwright configuration and initial tests ([#675](https://github.com/mineadmin/mineadmin/pull/675)) ([a0694fd](https://github.com/mineadmin/mineadmin/commit/a0694fd84da20ae758bebdc744af5188d4b3ae4d))
- feat(workflow): 更新 push 和 pull_request 事件的路径配置 ([#668](https://github.com/mineadmin/mineadmin/pull/668)) ([2ff8c5f](https://github.com/mineadmin/mineadmin/commit/2ff8c5fb957cd2cf252f6eb33b852b3f030bb80a))
- feat(app-store): 新增插件下载与安装的提示信息 ([#667](https://github.com/mineadmin/mineadmin/pull/667)) ([14617f5](https://github.com/mineadmin/mineadmin/commit/14617f5b600691141e8b688fb4741d9ba35050fc))
- feat(dialog): 优化全屏交互体验，实现全屏状态可控，并增大全屏按钮热区 ([#660](https://github.com/mineadmin/mineadmin/pull/660)) ([ba5816a](https://github.com/mineadmin/mineadmin/commit/ba5816a2d5f210f4a771d7ab960f42aa1ea65998))
- feat(boring-cyborg): 更新文件路径配置，增加多个模块的权限设置 ([#659](https://github.com/mineadmin/mineadmin/pull/659)) ([a8fb2b5](https://github.com/mineadmin/mineadmin/commit/a8fb2b5ad117f5d3755011e7b43b2ed42dafac75))

### 🐛 Bug Fixes
- fix(boring-cyborg): 修正 Logstash 服务路径的大小写错误 ([#665](https://github.com/mineadmin/mineadmin/pull/665)) ([6375e2c](https://github.com/mineadmin/mineadmin/commit/6375e2ce247fc040cb5d5c0b1088c5acc0de4c3b))
- fix(handleResize)：修复响应式情况下 addEventListener 事件错误，导致菜单异常关闭 ([#662](https://github.com/mineadmin/mineadmin/pull/662)) ([6882046](https://github.com/mineadmin/mineadmin/commit/6882046d84eec0350d0b889d4cbb9ab73e8cc5f1))

## [v3.0.5] - 2025-07-22

### ✨ Features
- feat(user): enhance user service with caching and refactor menu filtering logic ([#655](https://github.com/mineadmin/mineadmin/pull/655)) ([dc501ca](https://github.com/mineadmin/mineadmin/commit/dc501ca91c84293169e51631a25e5f02e7a57192))

### 🐛 Bug Fixes
- fix(issue-template): 修正 bug 报告模板中的 composer 命令以匹配项目名称 ([#658](https://github.com/mineadmin/mineadmin/pull/658)) ([c57753e](https://github.com/mineadmin/mineadmin/commit/c57753e3f547683dc3e14836c3563a51ba4edaee))
- fix(workflow): fixed PHP version change to php-version ([#657](https://github.com/mineadmin/mineadmin/pull/657)) ([7bbc5c0](https://github.com/mineadmin/mineadmin/commit/7bbc5c09301d93b67b4539e9f321dab2165a4c77))
- fix: 修复 .env.example 中 APP_URL 的格式并更新 .gitignore 以包含 storage/uploads ([#648](https://github.com/mineadmin/mineadmin/pull/648)) ([012853e](https://github.com/mineadmin/mineadmin/commit/012853e71ae2da8ac3905c715dc9412365f925e0))

### 📚 Documentation
- docs(README): 修复英文md 中的描述错误，更新 QQ 群链接为可点击格式 ([#654](https://github.com/mineadmin/mineadmin/pull/654)) ([4139090](https://github.com/mineadmin/mineadmin/commit/4139090a67245cc3321da875a2956dd720c255b2))

### ♻️ Code Refactoring
- refactor(repository): 重构列表接口方法 ([#651](https://github.com/mineadmin/mineadmin/pull/651)) ([4261b4b](https://github.com/mineadmin/mineadmin/commit/4261b4b06bf1e09af9e33979f46da7d436148095))

### 🔧 Others
- chore(workbench): 优化快捷入口路由显示逻辑 ([#643](https://github.com/mineadmin/mineadmin/pull/643)) ([805b92d](https://github.com/mineadmin/mineadmin/commit/805b92dc48b1f0182f47c640b8730b5582ef4143))
- ci(swoole): expand swoole 6.x version coverage in test matrix ([#652](https://github.com/mineadmin/mineadmin/pull/652)) ([95e5788](https://github.com/mineadmin/mineadmin/commit/95e578866e79d2d09fcaeacefdb93a3fb2796c50))

## [v3.0.4] - 2025-07-10

### 🐛 Bug Fixes
- fix: 添加 MINE_ACCESS_TOKEN 检查状态提示信息 ([#646](https://github.com/mineadmin/mineadmin/pull/646)) ([c60a937](https://github.com/mineadmin/mineadmin/commit/c60a9374c8c20ff3e0622b3e12dac5da602033e1))
- fix: update upload method parameter type hint to support Swow ([#640](https://github.com/mineadmin/mineadmin/pull/640)) ([b6af324](https://github.com/mineadmin/mineadmin/commit/b6af32480010506edbf6a16c06ab72ec653a98c6))

### ♻️ Code Refactoring
- refactor: simplify UserController by removing PassportService dependency and updating login method ([#647](https://github.com/mineadmin/mineadmin/pull/647)) ([86e883e](https://github.com/mineadmin/mineadmin/commit/86e883ea629459dfb5eac158e172da8084ca07b4))

## [v3.0.3] - 2025-06-13

### 🐛 Bug Fixes
- fix: 适配最新ele版本的 el-link api ([f194d8f](https://github.com/mineadmin/mineadmin/commit/f194d8f2c3cf7b61da23c48142deedd7b10ad3dd))
- fix: 修复引用了Swow包的bug ([66e0fb6](https://github.com/mineadmin/mineadmin/commit/66e0fb6f225a81df22a488b2ed7cca08ea448d4f))

### 📚 Documentation
- docs(README): Updated contributors graphs link ([#626](https://github.com/mineadmin/mineadmin/pull/626)) ([d9bf462](https://github.com/mineadmin/mineadmin/commit/d9bf46280101bacc64edc4d0670c2f1469d079bf))

## [v3.0.2] - 2025-05-29

### ✨ Features
- feat(plugin): 前端插件添加 loginBefore Hook，用于登录请求前处理提交的登录数据，可修改提交的登录数据到后端 ([040a1f6](https://github.com/mineadmin/mineadmin/commit/040a1f6b75a72a1bd8e38d1e472639426ce7425c))
- feat(app-store): support displaying latest version, compatible versions, and demo link on plugin detail page ([#601](https://github.com/mineadmin/mineadmin/pull/601)) ([1edebfc](https://github.com/mineadmin/mineadmin/commit/1edebfc5c789dbb7cfd0476010c3a619172ac33d))
- feat: 新增远程加载 vue 并渲染的功能。 ([559fe56](https://github.com/mineadmin/mineadmin/commit/559fe5624d1be42b9f4da292262d7d727d332121))
- feat(ma-dict-picker): support rendering disabled attribute for checkbox, radio, and select components ([#599](https://github.com/mineadmin/mineadmin/pull/599)) ([2cfef12](https://github.com/mineadmin/mineadmin/commit/2cfef1257fb4d300bac601487f946b9672ed8fd9))
- feat: add fast kill port and process file ([991c0b3](https://github.com/mineadmin/mineadmin/commit/991c0b3eb3f4bddfd5502af28f0d267afa6b51ae))
- feat(result): 添加账号禁用相关错误处理和国际化支持 ([#593](https://github.com/mineadmin/mineadmin/pull/593)) ([7f24cb4](https://github.com/mineadmin/mineadmin/commit/7f24cb46524edc522ecdfca2bd01fb2e5f6d90e1))
- feat(download): 添加下载 Base64 文件功能 ([#592](https://github.com/mineadmin/mineadmin/pull/592)) ([2aa7003](https://github.com/mineadmin/mineadmin/commit/2aa7003d374d0c75626c0084cd391556e1537664))
- feat:(component) 新增 ma-select-table 组件 ([#587](https://github.com/mineadmin/mineadmin/pull/587)) ([e7586e7](https://github.com/mineadmin/mineadmin/commit/e7586e73a7f403bd724938da001d1bf8e30d2d2b))
- feat: 前端语言监听第一次初始化 ([#585](https://github.com/mineadmin/mineadmin/pull/585)) ([d831aef](https://github.com/mineadmin/mineadmin/commit/d831aef2860425c982bb61287ba588b1b997d1da))
- feat(user): add password validation rules to UserRequest ([#580](https://github.com/mineadmin/mineadmin/pull/580)) ([c814e19](https://github.com/mineadmin/mineadmin/commit/c814e19a0f67419fef61fbd3a817ffd1552f2a90))
- feat: 新增request动态规则匹配类 ActionRulesTrait ([#579](https://github.com/mineadmin/mineadmin/pull/579)) ([af439bb](https://github.com/mineadmin/mineadmin/commit/af439bb781483b6a9c3a288e266bd54a0cc10488))
- feat: 升级 mineadmin/search 到 1.0.31 版本 ([67701e8](https://github.com/mineadmin/mineadmin/commit/67701e8257eaaac885764a9dc22199d7fa8fc633))
- feat(download): optimize file download handling ([#574](https://github.com/mineadmin/mineadmin/pull/574)) ([bbbb130](https://github.com/mineadmin/mineadmin/commit/bbbb130135fc97d9e83066ed6a82b82be1a48dea))
- feat: enhance user permission handling and add account status checks ([#573](https://github.com/mineadmin/mineadmin/pull/573)) ([aa508ba](https://github.com/mineadmin/mineadmin/commit/aa508ba7aaa25bdb6cfc2bbbc976caf7b84e154e))
- feat: Add 'Toolbar Settings' configuration information and save it to the user data table ([#571](https://github.com/mineadmin/mineadmin/pull/571)) ([1625566](https://github.com/mineadmin/mineadmin/commit/1625566a55ca3c1cf4273320f4fab8330f544f27))
- feat:(ma-col-card) 新增卡片列表组件 ([bd54161](https://github.com/mineadmin/mineadmin/commit/bd54161aae8436990233c390c5713f09f3abb192))
- feat: 更新依赖 ([4485dec](https://github.com/mineadmin/mineadmin/commit/4485dec4ef6ce170b925cae06feeca783448aa32))
- feat: ma-form 更新到 1.0.25 ([#534](https://github.com/mineadmin/mineadmin/pull/534)) ([7e6c18a](https://github.com/mineadmin/mineadmin/commit/7e6c18a2b52710e5832fa9992d07f544f1fec83e))

### 🐛 Bug Fixes
- fix(login): 修复用户登录后未设置语言标记，造成默认为英文的bug ([eb4615b](https://github.com/mineadmin/mineadmin/commit/eb4615b4745fbdef168cd5a9783ee3bb60e6d814))
- fix(icons): 修复生成图标命令报缺少`inquirer`库 ([1123bf4](https://github.com/mineadmin/mineadmin/commit/1123bf45a9984dc517393509b0882426fbbb6cbe))
- fix(ma-select-table): 修复单行/多行选中状态判断报错，增强选中判断的安全性 ([#610](https://github.com/mineadmin/mineadmin/pull/610)) ([8e5436f](https://github.com/mineadmin/mineadmin/commit/8e5436f8d69273aa7cf5f7dbb00feebb244defcf))
- fix(menu-form): 修复 菜单管理 页面渲染中递归更新问题 ([#605](https://github.com/mineadmin/mineadmin/pull/605)) ([58c6873](https://github.com/mineadmin/mineadmin/commit/58c6873bf04d8fa811bc156644885ded6cb525b4))
- fix(MaDictSelect): 支持 el-option-group 分组选项渲染、混合选项 ([#604](https://github.com/mineadmin/mineadmin/pull/604)) ([8288988](https://github.com/mineadmin/mineadmin/commit/8288988c51ee529f8171f6d47c44425ddd14574e))
- fix: 还原mineadmin/search下的style.css。 ([e26abba](https://github.com/mineadmin/mineadmin/commit/e26abba6658967937d1b2c6e129905d30c686525))
- fix: 还原 ma-dict-select 组件 ([805a6ab](https://github.com/mineadmin/mineadmin/commit/805a6ab7b94eb834fd18e72948c88c1b0d6ab716))
- fix: 修复 ma-form 支持 children 配置项后，造成组件默认插槽参数丢失以及 render 函数里 jsx 语法的子组件不渲染问题，同时修复 ma-search 兼容 ma-form 的一些问题 ([6f09d93](https://github.com/mineadmin/mineadmin/commit/6f09d939721edbba750b545cf668efe61f62f549))
- fix: README-en.md ([daa15a3](https://github.com/mineadmin/mineadmin/commit/daa15a33e23c6d600821fd36ef639227ca3d6e9c))
- fix: README.md ([d7a4df0](https://github.com/mineadmin/mineadmin/commit/d7a4df047518008e86cf21fb87559e4a8387ddb3))
- fix(menu): 修复子菜单全部隐藏时父菜单无法点击的问题 ([#595](https://github.com/mineadmin/mineadmin/pull/595)) ([0644922](https://github.com/mineadmin/mineadmin/commit/064492263501646210a2537c9ca4c24ba148259a))
- fix: Cache retrieval logic error does not return default value ([#589](https://github.com/mineadmin/mineadmin/pull/589)) ([198f8f1](https://github.com/mineadmin/mineadmin/commit/198f8f15c603edf681986518248186a476e5526d))
- fix: 修复偶尔主题模式与组件主题模式不一致的问题 ([c98d5a7](https://github.com/mineadmin/mineadmin/commit/c98d5a79b7c836459c76033a1bab3f8227d585d7))
- fix: add PHPStan ignore directive for ActionRulesTrait ([719a755](https://github.com/mineadmin/mineadmin/commit/719a7553b6c190a5b5323ea75dbaf6074d941fa1))
- fix swagger render bug ([#578](https://github.com/mineadmin/mineadmin/pull/578)) ([afcc510](https://github.com/mineadmin/mineadmin/commit/afcc510c7de94310a78c3d62f1f26f0c1198715d))
- fix: 优化IRepository的handlePage方法 使得更专注分页格式化 ([#566](https://github.com/mineadmin/mineadmin/pull/566)) ([9c0770e](https://github.com/mineadmin/mineadmin/commit/9c0770e1b91579fc616137ae8f7a0c278364657b))
- fix: 修正getQuery参数搜索 ([#565](https://github.com/mineadmin/mineadmin/pull/565)) ([9f91123](https://github.com/mineadmin/mineadmin/commit/9f9112306b01e875f2e19a4150018db5afacd840))
- fix(MenuService): update create method to return Menu type and correct parent_id reference ([#560](https://github.com/mineadmin/mineadmin/pull/560)) ([ab9076e](https://github.com/mineadmin/mineadmin/commit/ab9076e7ccedb18f59e5b8b62f8b1177e5a57f91))
- fix：Breadcrumb navigation display hidden menu bug ([#553](https://github.com/mineadmin/mineadmin/pull/553)) ([5eabf44](https://github.com/mineadmin/mineadmin/commit/5eabf44f8577b2db20f3d03fb83d87ea000fced2))
- fix: Duplicate data appears when adding "button permissions" to the menu ([#548](https://github.com/mineadmin/mineadmin/pull/548)) ([88a7200](https://github.com/mineadmin/mineadmin/commit/88a7200023347a732e089557598e268919ec5efe))
- fix: 修改接口请求地址和代理前缀以适配开发环境 ([947bac0](https://github.com/mineadmin/mineadmin/commit/947bac0122bfc132389e78c61c16b62bfb407f97))

### ♻️ Code Refactoring
- refactor: 移除 mine-admin/remoteVue 插件 ([faad2b2](https://github.com/mineadmin/mineadmin/commit/faad2b2f80e6b7db9e8bc17a03d8d3590f071cc5))
- refactor(ma-dict-select): 重构字典选择器插槽逻辑并更新依赖版本 ([f989ab9](https://github.com/mineadmin/mineadmin/commit/f989ab960efa023cf11260e43b82f682215a4a7d))
- refactor(config): 调整 Swagger 配置修复多个插件 swagger 覆盖问题 ([#597](https://github.com/mineadmin/mineadmin/pull/597)) ([370928a](https://github.com/mineadmin/mineadmin/commit/370928aec1164d9a49599b21b01b94885b2cc85c))
- refactor(server): clean up configuration settings by removing commented lines ([#575](https://github.com/mineadmin/mineadmin/pull/575)) ([a354f6a](https://github.com/mineadmin/mineadmin/commit/a354f6a0591ac5bf1b604b8c6bf8c3bb10d1de6f))
- refactor(http): optimize request authorization and validation ([#532](https://github.com/mineadmin/mineadmin/pull/532)) ([4c7cbb0](https://github.com/mineadmin/mineadmin/commit/4c7cbb08dcea5d17b491d0e240c88640019d0832))

### 🔧 Others
- chore(deps): 升级 @mineadmin/form 依赖版本至 ^1.0.51 ([0453007](https://github.com/mineadmin/mineadmin/commit/04530071b83fb94516e83dca2742e6d8fb79f7a6))
- chore(deps): 升级 @mineadmin/form 依赖版本至 ^1.0.33 ([776620b](https://github.com/mineadmin/mineadmin/commit/776620b5e50dcd31fe33607d0c0a5f83e3e9c239))
- chore(deps): 升级 vite 依赖版本至 ^6.2.6 ([7cec2b4](https://github.com/mineadmin/mineadmin/commit/7cec2b4cc81d8bba0bcb3747754ee8a89f3e9a7f))
- chore(deps): 更新 package.json 依赖配置 ([3fb7549](https://github.com/mineadmin/mineadmin/commit/3fb75496aad60f9a74973f4a0551b34aa443018b))
- chore(deps): 升级 @mineadmin/form 和 @mineadmin/pro-table 依赖版本 ([4d06473](https://github.com/mineadmin/mineadmin/commit/4d064738dbef9c20dc5e7686a1ea22bacb5eb4f9))
- styles: remove el-tag border ([#557](https://github.com/mineadmin/mineadmin/pull/557)) ([7c2eede](https://github.com/mineadmin/mineadmin/commit/7c2eede7d3beaa665d6f81d67564482e7d86c7b0))
- chore: fix Menu highlight menu field editing cannot save data ([#544](https://github.com/mineadmin/mineadmin/pull/544)) ([5baebc7](https://github.com/mineadmin/mineadmin/commit/5baebc7f3904a1b570598c197cb9264bd92448d1))
- chore: fix MaRemoteSelect component Slot not displayed ([#543](https://github.com/mineadmin/mineadmin/pull/543)) ([4d414cb](https://github.com/mineadmin/mineadmin/commit/4d414cb51a3665127462ea37d10d623a7798da5b))
- chore: add ma-key-value component ([#538](https://github.com/mineadmin/mineadmin/pull/538)) ([85f06a2](https://github.com/mineadmin/mineadmin/commit/85f06a22fd2252d14f55fb39f4500fe72b9cfd6d))
- styles: remove el-tag border ([#536](https://github.com/mineadmin/mineadmin/pull/536)) ([bbd4724](https://github.com/mineadmin/mineadmin/commit/bbd4724ea031c2b5ef4efd26f762b5b55a488ff8))
- chore: add APP_DEBUG  to .env.example ([#535](https://github.com/mineadmin/mineadmin/pull/535)) ([16a0cd7](https://github.com/mineadmin/mineadmin/commit/16a0cd7d8dd57b98b99ab19dcf2b050d21e3b83e))
- ci: update code coverage and simplify phone number validation ([#533](https://github.com/mineadmin/mineadmin/pull/533)) ([b4d9213](https://github.com/mineadmin/mineadmin/commit/b4d9213b1a1abf8f5ef0b4d3d026b0f4a49ff338))

## [v3.0.1] - 2025-01-08

### ✨ Features
- feat(ma-pro-table & ma-remote-select) : ([#499](https://github.com/mineadmin/mineadmin/pull/499)) ([631fae7](https://github.com/mineadmin/mineadmin/commit/631fae759bbe8c5ffc31c108772a3d24793a2759))
- feat(ma-drawer): 增加 ma-drawer 组件，优化增强 `ma-dialog` 组件： ([#470](https://github.com/mineadmin/mineadmin/pull/470)) ([de0b94b](https://github.com/mineadmin/mineadmin/commit/de0b94b5c50e523c12450ac5ebe69ba501fedc5c))
- feat(iframe): 新增iframe菜单缓存，切换tab时不再重新加载第三方网页 ([#465](https://github.com/mineadmin/mineadmin/pull/465)) ([1b79b76](https://github.com/mineadmin/mineadmin/commit/1b79b768a484a003f97e2673afae40c744f29b71))
- feat(dict-component): 字典相关组件的`props：data` 属性支持传入函数 ([321e507](https://github.com/mineadmin/mineadmin/commit/321e5075d407d44b1d38f76c0eeb2b8cf02b12ac))
- feat(package): 新增 vue3-ace-editor 依赖作为默认依赖 ([#441](https://github.com/mineadmin/mineadmin/pull/441)) ([fc36e23](https://github.com/mineadmin/mineadmin/commit/fc36e23a09c82e81e853a73a48fdae0edeb4b6a7))
- feat(readme): 添加鸣谢信息 ([#440](https://github.com/mineadmin/mineadmin/pull/440)) ([e0881a7](https://github.com/mineadmin/mineadmin/commit/e0881a740f9a90609358b4dc902ed07c9c6be7e1))
- feat(tab): useTabStore add changeTabTitle() ([#437](https://github.com/mineadmin/mineadmin/pull/437)) ([e69159c](https://github.com/mineadmin/mineadmin/commit/e69159c8513351423b0796a56311da87d3bb2f47))
- feat(dict-component): 字典组件props增加data参数，可直接传入字典数据集合 ([#435](https://github.com/mineadmin/mineadmin/pull/435)) ([e86e9cc](https://github.com/mineadmin/mineadmin/commit/e86e9cc446dc53655c2d5afd44bf75b2c624d7d7))
- feat(resource): 增加资源管理器页面，更新依赖 ([#413](https://github.com/mineadmin/mineadmin/pull/413)) ([25d5e9c](https://github.com/mineadmin/mineadmin/commit/25d5e9ce50f8962a880c50c0678f832ca00141f8))
- feat(ma-tree): 新增 extra 插槽 ([#412](https://github.com/mineadmin/mineadmin/pull/412)) ([a3016af](https://github.com/mineadmin/mineadmin/commit/a3016af8ca7899f8e2d1cdb6691cdce440306e7c))
- feat(ma-search): 新增监听 enter 按下就快捷提交搜索 ([#411](https://github.com/mineadmin/mineadmin/pull/411)) ([af4cc3b](https://github.com/mineadmin/mineadmin/commit/af4cc3b51ee4afcded9900091f7e4f76c3a7f1fa))
- feat(favicon.ico): add favicon.ico file ([#403](https://github.com/mineadmin/mineadmin/pull/403)) ([87c9883](https://github.com/mineadmin/mineadmin/commit/87c988378b6cda58b5c4f6289dfbcfd1084f7a13))
- feat(maTree)：添加`setCheckStrictly()`，优化角色设置菜单编辑下默认为严格模式 ([#402](https://github.com/mineadmin/mineadmin/pull/402)) ([5aa771f](https://github.com/mineadmin/mineadmin/commit/5aa771fadcb01790ddea90af668d2825cf8a1590))
- feat: 解决上传组件重置为空的情况 ([#400](https://github.com/mineadmin/mineadmin/pull/400)) ([aea0013](https://github.com/mineadmin/mineadmin/commit/aea0013d00e7eedcedd630db0167871df4ce18ff))
- feat(i18n): 添加数据中心相关翻译 ([#391](https://github.com/mineadmin/mineadmin/pull/391)) ([cfa22e4](https://github.com/mineadmin/mineadmin/commit/cfa22e4df261781119769a24b4fb8ab5784ef0f8))
- feat(swagger): 增加ui界面，通过 `http://127.0.0.1:9503/swagger` 查看接口文档 ([#390](https://github.com/mineadmin/mineadmin/pull/390)) ([7d6d997](https://github.com/mineadmin/mineadmin/commit/7d6d99770afdabcfd116d209a85b70c579714d0c))
- feat(menu): 更新菜单权限并添加数据中心相关权限 ([#388](https://github.com/mineadmin/mineadmin/pull/388)) ([bdbe598](https://github.com/mineadmin/mineadmin/commit/bdbe5986ac9b9f4ecf649db7224728523bbfdba1))
- feat(config): add ModeNotFoundHandler to exception handlers ([#373](https://github.com/mineadmin/mineadmin/pull/373)) ([afe51c4](https://github.com/mineadmin/mineadmin/commit/afe51c4ae4b379e989f7746f6750e611a3154134))

### 🐛 Bug Fixes
- fix(tabbar):修复连续按两次 Alt 键会触发浏览器的Access Keys模式,导致 useMagicKeys 无法正常捕捉 Alt 键事件。 ([#510](https://github.com/mineadmin/mineadmin/pull/510)) ([2ee8e31](https://github.com/mineadmin/mineadmin/commit/2ee8e31ff682e4719cfcf7f37fae35a7e8e3eb81))
- fix(table-and-menu): 去掉菜单新增和保存弹框，element plus 的el-tree-select 存在递归报错bug，所以去掉弹框。 ([#511](https://github.com/mineadmin/mineadmin/pull/511)) ([80ef288](https://github.com/mineadmin/mineadmin/commit/80ef2887290362015282fbbe649390398cb1301e))
- fix(ma-search): 升级ma-search到1.0.27版本 ([#505](https://github.com/mineadmin/mineadmin/pull/505)) ([f78b21b](https://github.com/mineadmin/mineadmin/commit/f78b21b42ffc83abeb770ab2d944aaf657311643))
- fix(ma-remote-select): 修复 api 参数未传入 axiosConfig 配置项 ([#504](https://github.com/mineadmin/mineadmin/pull/504)) ([87975c9](https://github.com/mineadmin/mineadmin/commit/87975c9d257b04d75804710dca74c065cc5c935a))
- fix 修复表格固定列样式不统一问题 ([#500](https://github.com/mineadmin/mineadmin/pull/500)) ([bda1653](https://github.com/mineadmin/mineadmin/commit/bda165309e018e1b9820ef66fe2a071b0e504549))
- fix(migrate): 修正附件表删除时的表名错误 ([#497](https://github.com/mineadmin/mineadmin/pull/497)) ([d7edbe1](https://github.com/mineadmin/mineadmin/commit/d7edbe1555e31e49d8fde7d56c3dea1d808d5610))
- fix(Permission): 修复后台权限注解解析逻辑 ([#492](https://github.com/mineadmin/mineadmin/pull/492)) ([c7598f6](https://github.com/mineadmin/mineadmin/commit/c7598f6a6399811196c89ab7e412be0411445a1e))
- fix(docker-compose/dockerfile):修复前端 dockerfile 固定 production 以及重复打包 ([#495](https://github.com/mineadmin/mineadmin/pull/495)) ([212b5eb](https://github.com/mineadmin/mineadmin/commit/212b5eb8636527e12e3451a6ceb91d3d9c997b55))
- fix(pro-table): 修复pro-table的操作列在使用setTableColumns时，设置无效 ([#484](https://github.com/mineadmin/mineadmin/pull/484)) ([e2bd3a0](https://github.com/mineadmin/mineadmin/commit/e2bd3a098a60fada078fb8e8046776e2b4e10316))
- fix(swagger): 修复文档引入的 css 和 js 失效问题 ([#482](https://github.com/mineadmin/mineadmin/pull/482)) ([1b3b8f0](https://github.com/mineadmin/mineadmin/commit/1b3b8f093f5524c41c8db582e77d24e3b25c648e))
- fix(seeder): 修复执行php-cs-fixer造成seeder文件类名错误的问题 ([#476](https://github.com/mineadmin/mineadmin/pull/476)) ([f368ec1](https://github.com/mineadmin/mineadmin/commit/f368ec1ae0f93c823d6f17a85eb71515790e09b7))
- fix(php-cs) ([#475](https://github.com/mineadmin/mineadmin/pull/475)) ([e380d78](https://github.com/mineadmin/mineadmin/commit/e380d7868a82228f1bf4e2c332e5eb25d519685c))
- fix(layout): 修复布局与iframe页面问题 ([#469](https://github.com/mineadmin/mineadmin/pull/469)) ([74ed80a](https://github.com/mineadmin/mineadmin/commit/74ed80a9270c47e40add28390fe121972e19a93f))
- fix:(menu): 修复提示信息描述不准确 ([#468](https://github.com/mineadmin/mineadmin/pull/468)) ([24b08c1](https://github.com/mineadmin/mineadmin/commit/24b08c17b010adc61a017cff3d4f2400d7ac4472))
- fix(pro-table): 修复`requestPage`设置`size`参数无效的bug ([#467](https://github.com/mineadmin/mineadmin/pull/467)) ([28a028f](https://github.com/mineadmin/mineadmin/commit/28a028f9559e66046fb3c85b9e1a602fb312bb6f))
- fix(pro-table): 修复单元格插件注册后调用无效的问题 ([#466](https://github.com/mineadmin/mineadmin/pull/466)) ([9290f22](https://github.com/mineadmin/mineadmin/commit/9290f22b0fbe7630d6dc7d4a90004a200e903748))
- fix(front-permission): 修复前端权限检查时如果值为空对象时：{}，进入判断条件，导致显示无权限 ([#463](https://github.com/mineadmin/mineadmin/pull/463)) ([4f11da1](https://github.com/mineadmin/mineadmin/commit/4f11da1fd6be88776c2e2f585432bd5a8b084dd9))
- fix(welcomePage): 修复路由添加 welcomePage 时，自定义数据未覆盖默认数据 ([#458](https://github.com/mineadmin/mineadmin/pull/458)) ([7331b5f](https://github.com/mineadmin/mineadmin/commit/7331b5fe3128c5290af38249c80ed4c22ab860db))
- fix(cs-fix): fix cs-fix error ([#453](https://github.com/mineadmin/mineadmin/pull/453)) ([d742aa0](https://github.com/mineadmin/mineadmin/commit/d742aa026cfd01400e205beb436336f4b1b2cc0b))
- fix(analyse): fix analyse error ([#452](https://github.com/mineadmin/mineadmin/pull/452)) ([30644a8](https://github.com/mineadmin/mineadmin/commit/30644a8e3af91ed7f4266efebad6fc4362255e62))
- fix(vite-config): 未添加 `base` 参数，导致`VITE_APP_ROOT_BASE` 无效 ([#448](https://github.com/mineadmin/mineadmin/pull/448)) ([618bb66](https://github.com/mineadmin/mineadmin/commit/618bb665b18fb75fca986f17fb5196e142fe6443))
- fix(bug): 修复添加顶级菜单按钮未初始化id，修复应用商店打开官网链接插件详情页404，优化应用商店图片显示 ([#444](https://github.com/mineadmin/mineadmin/pull/444)) ([2589a7d](https://github.com/mineadmin/mineadmin/commit/2589a7de9b46c52d4f9764808ca55e3e9ef59984))
- fix(main-aside): 修复分栏模式下，菜单激活问题 ([#443](https://github.com/mineadmin/mineadmin/pull/443)) ([6def465](https://github.com/mineadmin/mineadmin/commit/6def4653ae2a08cd341ee8987877768c4d633fb5))
- fix：修增菜单含三级或以上的情况下只有一级菜单有选中样式 ([#439](https://github.com/mineadmin/mineadmin/pull/439)) ([2548a1e](https://github.com/mineadmin/mineadmin/commit/2548a1ec97f42674aa0805a098d0fe5f0147de71))
- fix(menu-btn-permission): 修复菜单按钮列表为空时，未清楚的问题 ([#433](https://github.com/mineadmin/mineadmin/pull/433)) ([94c7ded](https://github.com/mineadmin/mineadmin/commit/94c7dedba7e7134d155348a8f41c1367c4777dd0))
- fix(cs-fix): fix 语法 ([#427](https://github.com/mineadmin/mineadmin/pull/427)) ([a6d86a4](https://github.com/mineadmin/mineadmin/commit/a6d86a435de141a90e197867148ccc55b13de265))
- fix(menu): 修复菜单使用bug ([#426](https://github.com/mineadmin/mineadmin/pull/426)) ([8eef50d](https://github.com/mineadmin/mineadmin/commit/8eef50df68c566ac72506466aea71dc56b66a84a))
- fix(menu): 修复编辑类型为M的菜单时，按钮权限列表未回显 ([#424](https://github.com/mineadmin/mineadmin/pull/424)) ([d38a8d3](https://github.com/mineadmin/mineadmin/commit/d38a8d38af6ae357c064465135e4519b15804bfd))
- fix：资源选择器新增删除方法，修复多语言问题 ([#422](https://github.com/mineadmin/mineadmin/pull/422)) ([cf49390](https://github.com/mineadmin/mineadmin/commit/cf49390d9e5b900a39b707da756aa59fbca5f868))
- fix(menu): 拼写错误 ([#421](https://github.com/mineadmin/mineadmin/pull/421)) ([0f7e101](https://github.com/mineadmin/mineadmin/commit/0f7e101f09c0aaafcaf088df0c5e258814ead2b1))
- fix(pro-table, setPermissionForm): 升级pro-table修复classList.add报错bug，修复勾选权限严格模式未生效问题 ([#408](https://github.com/mineadmin/mineadmin/pull/408)) ([97d3a60](https://github.com/mineadmin/mineadmin/commit/97d3a60187f9cabc6fe38a8f5226f7b0b76b6b01))
- fix: 修复顶级菜单无法被添加的问题 ([#407](https://github.com/mineadmin/mineadmin/pull/407)) ([334c619](https://github.com/mineadmin/mineadmin/commit/334c619c86170f17c01718822ee2dc004fcaf820))
- fix(roleCode): code error ([#401](https://github.com/mineadmin/mineadmin/pull/401)) ([9a970b1](https://github.com/mineadmin/mineadmin/commit/9a970b119879c0dc146e80f0752df9591e5df13f))
- fix(watcher, usePluginStore): 移除监听 api 目录, 修复usePluginStore 类型报错问题 ([#395](https://github.com/mineadmin/mineadmin/pull/395)) ([44ce6e3](https://github.com/mineadmin/mineadmin/commit/44ce6e3a7fa99c265655f219b353252bdd8d4fb2))
- fix(前端类型错误): 修复前端插件类型定义问题以及usePluginStore部分函数返回值类型错误问题 ([#382](https://github.com/mineadmin/mineadmin/pull/382)) ([807da0e](https://github.com/mineadmin/mineadmin/commit/807da0e83f5a295d8c34452ee989b3bd4a82545c))
- fix(app): stop propagation on mode not found exception ([#375](https://github.com/mineadmin/mineadmin/pull/375)) ([664d757](https://github.com/mineadmin/mineadmin/commit/664d75783ee03ce127178eec72546b9defbcea6b))
- fix(修复菜单新增和编辑逻辑错误) ([#379](https://github.com/mineadmin/mineadmin/pull/379)) ([a140517](https://github.com/mineadmin/mineadmin/commit/a140517c11de756138585d9414cd257349c664b2))
- fix(水印) ([38ad110](https://github.com/mineadmin/mineadmin/commit/38ad11096229af8e760c6cd7def3fa2b59d06940))
- fix(menu、table): 修复菜单新增可一直点击，优化表结构，修复菜单错误提示未翻译的问题 ([8ac3676](https://github.com/mineadmin/mineadmin/commit/8ac367624f13fc4a57bc3b1991a9b1e083fcc237))
- fix(refresh_token): 修复刷新token也失效的情况下，导致一直在加载页面转圈 ([6dc7519](https://github.com/mineadmin/mineadmin/commit/6dc7519b2dffa0812c8580240a33f1f6e876de88))

### 📚 Documentation
- docs(README): 更新组件库链接 ([#491](https://github.com/mineadmin/mineadmin/pull/491)) ([8d196f3](https://github.com/mineadmin/mineadmin/commit/8d196f3255d9ee7149b3e929cab1198007eb27b3))
- docs(README): remove badges and update content ([#414](https://github.com/mineadmin/mineadmin/pull/414)) ([b15a004](https://github.com/mineadmin/mineadmin/commit/b15a0043c8f59f5c9b036644f9afb449893ca1b8))

### ♻️ Code Refactoring
- refactor(menu-tree, useDialog, useDrawer) 优化 ([#493](https://github.com/mineadmin/mineadmin/pull/493)) ([479b13c](https://github.com/mineadmin/mineadmin/commit/479b13c7f1523716f7e2a6df6075206c61cb8fc2))
- refactor(iframe): 优化 iframe 在tab页关闭和刷新时重新加载iframe页面。 ([#478](https://github.com/mineadmin/mineadmin/pull/478)) ([666fd46](https://github.com/mineadmin/mineadmin/commit/666fd46e83954c9653676f9dc400751a3f0ce110))
- refactor(logManage): 优化日志管理批量删除时，弹出提示框确认是否删除 ([#473](https://github.com/mineadmin/mineadmin/pull/473)) ([8c8d35d](https://github.com/mineadmin/mineadmin/commit/8c8d35d0b336aec8c9b65c0e8825ebf30bafe912))
- refactor(upload): 抽离上传本地服务器方法到utils里，可被单独调用 ([#472](https://github.com/mineadmin/mineadmin/pull/472)) ([b323488](https://github.com/mineadmin/mineadmin/commit/b32348804bc55024a6bb462f67c82077b952387f))
- refactor(pro-table): 升级到1.0.37，增加暴露搜索事件`@search-submit`, `@search-reset` 和参数 `onSearchSubmit`, `onSearchReset` ([#462](https://github.com/mineadmin/mineadmin/pull/462)) ([3efad49](https://github.com/mineadmin/mineadmin/commit/3efad49c15eb508d1066fb2e4992d5dbfb3a9b98))
- refactor(menu): 菜单排序无效问题 ([#449](https://github.com/mineadmin/mineadmin/pull/449)) ([215decb](https://github.com/mineadmin/mineadmin/commit/215decbf75effd9ec89af4bac8e5a1967421756d))
- refactor(repository): optimize query handling and update saveById method ([#416](https://github.com/mineadmin/mineadmin/pull/416)) ([745b087](https://github.com/mineadmin/mineadmin/commit/745b0874e723f13a6482cec1444b0c01c2e32244))
- refactor(app): improve menu filtering logic ([#409](https://github.com/mineadmin/mineadmin/pull/409)) ([35e59ed](https://github.com/mineadmin/mineadmin/commit/35e59ed364efd5f942aef3ad5f855854496dab79))
- refactor(delete): change delete method return type and behavior ([#404](https://github.com/mineadmin/mineadmin/pull/404)) ([e1c657f](https://github.com/mineadmin/mineadmin/commit/e1c657fcdaedb67d2dad20eab7a31d1ca6c63092))
- refactor(permissions): remove Casbin and refactor permission logic ([#399](https://github.com/mineadmin/mineadmin/pull/399)) ([b445b22](https://github.com/mineadmin/mineadmin/commit/b445b22ca04ee6016e2e10a8980e7c50398f9bb2))
- refactor(ma-table)：升级到1.0.25版，优化列头对齐未指定下默认使用单元格对齐 ([#392](https://github.com/mineadmin/mineadmin/pull/392)) ([5e5f6b0](https://github.com/mineadmin/mineadmin/commit/5e5f6b0898a8038ac0229e1ba137050fc2efabd7))
- refactor(admin):重构控制器中的请求数据获取方式 ([#386](https://github.com/mineadmin/mineadmin/pull/386)) ([0859e44](https://github.com/mineadmin/mineadmin/commit/0859e4492823891eb4a40b236b229e1ae47d0935))
- refactor: correct typos in language files ([#372](https://github.com/mineadmin/mineadmin/pull/372)) ([85a5e10](https://github.com/mineadmin/mineadmin/commit/85a5e10e74650273ea6c94796398f28bda977582))
- refactor(user): internationalize error messages in UserListener ([#371](https://github.com/mineadmin/mineadmin/pull/371)) ([c7a30e6](https://github.com/mineadmin/mineadmin/commit/c7a30e6e669b51faf7f662d3e1b89eb65388fec9))

### 🔧 Others
- chore(http.ts): 优化401状态退出不用等满3秒显得很卡 ([#514](https://github.com/mineadmin/mineadmin/pull/514)) ([e3981ef](https://github.com/mineadmin/mineadmin/commit/e3981ef9e5575f631476d64ae4e5900a41a33c4e))
- ci: add CodeRabbit configuration file ([#501](https://github.com/mineadmin/mineadmin/pull/501)) ([be870d0](https://github.com/mineadmin/mineadmin/commit/be870d057bf04eddd04cd31a817d80f46ea9174b))
- chore(readme.md): 修改战略合作链接 ([d20b78d](https://github.com/mineadmin/mineadmin/commit/d20b78d3d0a69706a3fae17dcb8cc76450e20178))
- chore(readme.md): 增加战略合作链接，vue-i18n更新到10.0.5 ([#490](https://github.com/mineadmin/mineadmin/pull/490)) ([f3de93e](https://github.com/mineadmin/mineadmin/commit/f3de93e03d029a169884def7ece87c9dbed0a601))
- chore(ma-city-select): 优化省市区选择组件 ([#486](https://github.com/mineadmin/mineadmin/pull/486)) ([6d3629e](https://github.com/mineadmin/mineadmin/commit/6d3629e8b1990736b2cc786952bb0112de878f3c))
- styles(ma-tree): 优化 ma-tree 下的 `.mine-tree-node` 样式 ([#483](https://github.com/mineadmin/mineadmin/pull/483)) ([635b5ec](https://github.com/mineadmin/mineadmin/commit/635b5ec914e948252a4099c418802b7c0c9f9a67))
- chore(package): 更新最新依赖，适配最新版i18n ([#471](https://github.com/mineadmin/mineadmin/pull/471)) ([1b73f61](https://github.com/mineadmin/mineadmin/commit/1b73f6190b6cd54b7c8782822e27c11f2be60615))
- chore(pro-table): 修复table参数覆盖问题导致参数失效 ([#461](https://github.com/mineadmin/mineadmin/pull/461)) ([7ccd472](https://github.com/mineadmin/mineadmin/commit/7ccd472cac7f7865f1a84db61f431f872966cb3d))
- chore(package): 更新pro-table和search，修复几处小问题 ([#459](https://github.com/mineadmin/mineadmin/pull/459)) ([2091a3a](https://github.com/mineadmin/mineadmin/commit/2091a3a40356f4659e03e970a426a1e50383b499))
- styles(layout): 优化布局样式 ([#457](https://github.com/mineadmin/mineadmin/pull/457)) ([b3c5d8b](https://github.com/mineadmin/mineadmin/commit/b3c5d8b328722840d3d8c883e3c35b4c0ea6064b))
- chore(front): 优化修改插件钩子参数 ([#456](https://github.com/mineadmin/mineadmin/pull/456)) ([a50284c](https://github.com/mineadmin/mineadmin/commit/a50284c41b6418c70bf59ea289822041819f0f6b))
- chore(other): 修改类型定义，优化默认静态路由 ([#454](https://github.com/mineadmin/mineadmin/pull/454)) ([305ad7f](https://github.com/mineadmin/mineadmin/commit/305ad7f3c68795bb8286776dbf9d0ad91f6ce398))
- chore(ma-pro-table): 更新ma-pro-table到1.0.27版，pnpm-lock加入忽略列表 ([#434](https://github.com/mineadmin/mineadmin/pull/434)) ([f1b74fd](https://github.com/mineadmin/mineadmin/commit/f1b74fd656131b1d56bbac80c86d6ca603e71ecd))
- styles(样式优化) ([#428](https://github.com/mineadmin/mineadmin/pull/428)) ([bb1f17e](https://github.com/mineadmin/mineadmin/commit/bb1f17e947cb970b8caaed5e10fdf73a8b94f619))
- chore(tab): 变更标签页新增时检查的key，优化布局文件 ([#425](https://github.com/mineadmin/mineadmin/pull/425)) ([aa6474a](https://github.com/mineadmin/mineadmin/commit/aa6474aafdb36cb5b867e457dee913be88252feb))
- chore(tsconfig): 开启默认允许js ([#423](https://github.com/mineadmin/mineadmin/pull/423)) ([40e2b24](https://github.com/mineadmin/mineadmin/commit/40e2b24cacd5003d5de844048d8773148f5ab7e4))
- styles(menu): 优化子级菜单激活后，父级菜单高亮 ([#419](https://github.com/mineadmin/mineadmin/pull/419)) ([df8ec2c](https://github.com/mineadmin/mineadmin/commit/df8ec2cc1e099df99039ea253d1936d3c39e7d0b))
- chore(front): 退出清除所有tab，ma-dialog新增操作快捷键，ma-tree增加 buttons插槽 ([#410](https://github.com/mineadmin/mineadmin/pull/410)) ([0fd8605](https://github.com/mineadmin/mineadmin/commit/0fd86053dbe6d6a6d7589e0b0e49b1820428091e))
- chore(ma-form,ma-search)：升级俩组件依赖，优化一些方法入参 ([#393](https://github.com/mineadmin/mineadmin/pull/393)) ([4716ffe](https://github.com/mineadmin/mineadmin/commit/4716ffe337a4566b632edc442916a313283b75bc))
- chore(pro-table)：升级到1.0.22版，组件增加 `getProTableOptions()` 方法 ([#384](https://github.com/mineadmin/mineadmin/pull/384)) ([c73725e](https://github.com/mineadmin/mineadmin/commit/c73725e2cdf0886fbc882940f952b0680dadac86))
- chore(@mineadmin/pro-table): 升级pro-table到1.0.21，pro-table重构工具栏，开放api可以插件形式扩展: `useProTableToolbar()` ([#378](https://github.com/mineadmin/mineadmin/pull/378)) ([df1df62](https://github.com/mineadmin/mineadmin/commit/df1df62659585e8f5117273c2e12697e2968ac33))
- chore(toolbar): 修改 remove 方法的参数 ([ec639ef](https://github.com/mineadmin/mineadmin/commit/ec639efdb6919ce33146d9e78100b6c5a8a94c4d))

## [v3.0-RC] - 2024-10-23

## [v3.0] - 2024-11-28

### ✨ Features
- feat(ma-drawer): 增加 ma-drawer 组件，优化增强 `ma-dialog` 组件： ([#470](https://github.com/mineadmin/mineadmin/pull/470)) ([de0b94b](https://github.com/mineadmin/mineadmin/commit/de0b94b5c50e523c12450ac5ebe69ba501fedc5c))
- feat(iframe): 新增iframe菜单缓存，切换tab时不再重新加载第三方网页 ([#465](https://github.com/mineadmin/mineadmin/pull/465)) ([1b79b76](https://github.com/mineadmin/mineadmin/commit/1b79b768a484a003f97e2673afae40c744f29b71))
- feat(dict-component): 字典相关组件的`props：data` 属性支持传入函数 ([321e507](https://github.com/mineadmin/mineadmin/commit/321e5075d407d44b1d38f76c0eeb2b8cf02b12ac))
- feat(package): 新增 vue3-ace-editor 依赖作为默认依赖 ([#441](https://github.com/mineadmin/mineadmin/pull/441)) ([fc36e23](https://github.com/mineadmin/mineadmin/commit/fc36e23a09c82e81e853a73a48fdae0edeb4b6a7))
- feat(readme): 添加鸣谢信息 ([#440](https://github.com/mineadmin/mineadmin/pull/440)) ([e0881a7](https://github.com/mineadmin/mineadmin/commit/e0881a740f9a90609358b4dc902ed07c9c6be7e1))
- feat(tab): useTabStore add changeTabTitle() ([#437](https://github.com/mineadmin/mineadmin/pull/437)) ([e69159c](https://github.com/mineadmin/mineadmin/commit/e69159c8513351423b0796a56311da87d3bb2f47))
- feat(dict-component): 字典组件props增加data参数，可直接传入字典数据集合 ([#435](https://github.com/mineadmin/mineadmin/pull/435)) ([e86e9cc](https://github.com/mineadmin/mineadmin/commit/e86e9cc446dc53655c2d5afd44bf75b2c624d7d7))
- feat(resource): 增加资源管理器页面，更新依赖 ([#413](https://github.com/mineadmin/mineadmin/pull/413)) ([25d5e9c](https://github.com/mineadmin/mineadmin/commit/25d5e9ce50f8962a880c50c0678f832ca00141f8))
- feat(ma-tree): 新增 extra 插槽 ([#412](https://github.com/mineadmin/mineadmin/pull/412)) ([a3016af](https://github.com/mineadmin/mineadmin/commit/a3016af8ca7899f8e2d1cdb6691cdce440306e7c))
- feat(ma-search): 新增监听 enter 按下就快捷提交搜索 ([#411](https://github.com/mineadmin/mineadmin/pull/411)) ([af4cc3b](https://github.com/mineadmin/mineadmin/commit/af4cc3b51ee4afcded9900091f7e4f76c3a7f1fa))
- feat(favicon.ico): add favicon.ico file ([#403](https://github.com/mineadmin/mineadmin/pull/403)) ([87c9883](https://github.com/mineadmin/mineadmin/commit/87c988378b6cda58b5c4f6289dfbcfd1084f7a13))
- feat(maTree)：添加`setCheckStrictly()`，优化角色设置菜单编辑下默认为严格模式 ([#402](https://github.com/mineadmin/mineadmin/pull/402)) ([5aa771f](https://github.com/mineadmin/mineadmin/commit/5aa771fadcb01790ddea90af668d2825cf8a1590))
- feat: 解决上传组件重置为空的情况 ([#400](https://github.com/mineadmin/mineadmin/pull/400)) ([aea0013](https://github.com/mineadmin/mineadmin/commit/aea0013d00e7eedcedd630db0167871df4ce18ff))
- feat(i18n): 添加数据中心相关翻译 ([#391](https://github.com/mineadmin/mineadmin/pull/391)) ([cfa22e4](https://github.com/mineadmin/mineadmin/commit/cfa22e4df261781119769a24b4fb8ab5784ef0f8))
- feat(swagger): 增加ui界面，通过 `http://127.0.0.1:9503/swagger` 查看接口文档 ([#390](https://github.com/mineadmin/mineadmin/pull/390)) ([7d6d997](https://github.com/mineadmin/mineadmin/commit/7d6d99770afdabcfd116d209a85b70c579714d0c))
- feat(menu): 更新菜单权限并添加数据中心相关权限 ([#388](https://github.com/mineadmin/mineadmin/pull/388)) ([bdbe598](https://github.com/mineadmin/mineadmin/commit/bdbe5986ac9b9f4ecf649db7224728523bbfdba1))
- feat(config): add ModeNotFoundHandler to exception handlers ([#373](https://github.com/mineadmin/mineadmin/pull/373)) ([afe51c4](https://github.com/mineadmin/mineadmin/commit/afe51c4ae4b379e989f7746f6750e611a3154134))
- feat(admin): use os() method to get operating system information ([cb3a7d9](https://github.com/mineadmin/mineadmin/commit/cb3a7d97550f02c74065e9eb9d591fbfd023b28e))
- feat(应用商店) ([3a6fdfe](https://github.com/mineadmin/mineadmin/commit/3a6fdfea30576f0c0d4248761628cb49b481c8ba))
- feat(应用商店详情页) ([dcf9691](https://github.com/mineadmin/mineadmin/commit/dcf9691346cdf4637e72e7485ea72ce923e52895))
- feat(应用商店详情页.todo...) ([52efb52](https://github.com/mineadmin/mineadmin/commit/52efb520c0158e653f235dbac1ada8ce7d14e588))
- feat(应用商店本地上传安装) ([5d4ade7](https://github.com/mineadmin/mineadmin/commit/5d4ade707efbc919bb4c7695c429e9361089e9aa))
- feat(app-store): optimize application store functionality ([f568e23](https://github.com/mineadmin/mineadmin/commit/f568e234b9586c9c99d3bdffbb6184357ca4bb70))
- feat(应用商店列表) ([d85baf8](https://github.com/mineadmin/mineadmin/commit/d85baf8377ed8ccc134d985fce5dfeca3da26134))
- feat(应用商店翻译，接口对接部分) ([2bf9615](https://github.com/mineadmin/mineadmin/commit/2bf9615c8b6b90ea9e8efe6aed2784102a6b2bd0))
- feat(front plugin): 新增插件动态启用和停用 ([e4dfe59](https://github.com/mineadmin/mineadmin/commit/e4dfe590477cc657fe3d1e02fad240e2a7fc9fed))
- feat(新增依赖): hyperf/guzzle ([86c8005](https://github.com/mineadmin/mineadmin/commit/86c8005d8ab363f9e389efaa63f91b93378dba7c))
- feat(侧边栏黑暗模式) ([13c0f33](https://github.com/mineadmin/mineadmin/commit/13c0f33f9283763c453f1c3a1a7a4913f2e2701e))
- feat(侧边栏黑暗模式，待完善) ([163d097](https://github.com/mineadmin/mineadmin/commit/163d09725a142f4499bc3a380cd9ae7a1d633db3))
- feat(应用市场页面 - 1): 未完成 ([dd9a578](https://github.com/mineadmin/mineadmin/commit/dd9a5780ccc4babb3f5a3714fcea7765d85c8eb8))
- feat(refreshToken)：新增刷新token，自动续期token ([b5daf76](https://github.com/mineadmin/mineadmin/commit/b5daf768536d2255299c3084a67c61db4344a509))
- feat(修改密码接口对接) ([be117ab](https://github.com/mineadmin/mineadmin/commit/be117abf97c0f07d6ac2caebb3f8790d56a25182))
- feat(add appstore api file) ([1d02006](https://github.com/mineadmin/mineadmin/commit/1d020068803abcd689aa6885179087add4260a87))
- feat(用户信息修改) ([e2f49b4](https://github.com/mineadmin/mineadmin/commit/e2f49b42751918acdff706d0a04a0b9f6829bff7))
- feat(个人信息修改头像) ([6cd3900](https://github.com/mineadmin/mineadmin/commit/6cd3900bf08659799ecb3d33b2726494525ecec8))
- feature 增加修改个人信息接口 ([b6d6833](https://github.com/mineadmin/mineadmin/commit/b6d6833f361c1d0fc1aa291a02018e156775b194))
- feature(Repository): 补充搜索参数处理 ([bba3f22](https://github.com/mineadmin/mineadmin/commit/bba3f22c0c9034eb2094d07713284a7168b90b61))
- feature docker-compose.yml 增加前端配置，前端 production 配置默认为 hyperf:9501 ([47d6afb](https://github.com/mineadmin/mineadmin/commit/47d6afbb523fef0e9dbde64d76fbc34a66427521))
- feat(tab栏增加左右滑动按钮，兼容macos) ([ab80a66](https://github.com/mineadmin/mineadmin/commit/ab80a66467a353bbf62b78fd94b4566288dc89eb))
- feat(菜单管理)：完成菜单管理 ([c016c2a](https://github.com/mineadmin/mineadmin/commit/c016c2a781c3d67cd5ba42516ea6502df8b236ab))
- feat(menu) ([3910637](https://github.com/mineadmin/mineadmin/commit/3910637d15f44c4b3e9e20b8240aaae6753ff437))
- feat(menu管理) ([0f6d596](https://github.com/mineadmin/mineadmin/commit/0f6d596fcfb8a6f8de94c9a467d91bed798097a0))
- feat(增强ma-tree组件) ([72ce4c7](https://github.com/mineadmin/mineadmin/commit/72ce4c73cd24fdd12f2a12066c6238601c701cf1))
- feat(角色管理) ([fc1424d](https://github.com/mineadmin/mineadmin/commit/fc1424dd5fb4619d0cd3a01dfb540027bdfb8462))
- feat(用户crud): 用户管理完成，新版CRUD最佳实践操作 ([2acf5b3](https://github.com/mineadmin/mineadmin/commit/2acf5b3229d46d14a500e28664e4ad984ab7f262))
- feat(用户管理): 已完成 ([cd799fa](https://github.com/mineadmin/mineadmin/commit/cd799fa71617986a252b06b9e3707d46551cbb70))
- feat(用户crud): 确定了前端crud写法及模式 ([eec8e54](https://github.com/mineadmin/mineadmin/commit/eec8e54522d67b90f4b52ad9f8a3384298827e79))
- feat(用户crud): 用户管理新增和修改 ([fbc7563](https://github.com/mineadmin/mineadmin/commit/fbc7563812bb9e85e153f63866e4957a29341cec))
- feat(crud): 用户管理，设计crud架构模式 ([01195c8](https://github.com/mineadmin/mineadmin/commit/01195c83e81abb34c268b5fe33539eca3c2fde8e))
- feat(用户管理form): 未完成 ([173baa7](https://github.com/mineadmin/mineadmin/commit/173baa71129cfa03c0b2c52b8c8ae03f401d13e6))
- feat(新增文件上传) ([078fed8](https://github.com/mineadmin/mineadmin/commit/078fed86719484f169419b9a8eb52669677fcfda))
- feat(新增图片上传) ([d2d88b7](https://github.com/mineadmin/mineadmin/commit/d2d88b722c73bd01fb6406a5248a4e45c16eb541))
- feat(cell-render): 添加proxy参数支持 ([a3f5866](https://github.com/mineadmin/mineadmin/commit/a3f58668c9ad2b15ada971bbc6caf2dd7e08bfec))
- feat(cell-render): renderTo添加proxy参数支持 ([d7e44d1](https://github.com/mineadmin/mineadmin/commit/d7e44d1e1c80ea8c1b0d25f3d83b5a31cce51142))
- feat(cell-render): useCellRender支持传入maProTableRef以获得更好的内部支持 ([0e4d5b8](https://github.com/mineadmin/mineadmin/commit/0e4d5b8483cd4ad9f078699bbf15ebcab9e9c8dc))
- feat(cell-render): 添加buttons组件 ([ac67d0e](https://github.com/mineadmin/mineadmin/commit/ac67d0e21738d6dd1fd0b6d4b23cc6b0d92f2578))
- feature(request log): 完善操作日志页面查询以及删除 ([3ae52af](https://github.com/mineadmin/mineadmin/commit/3ae52af33d77aaf1f2cf4e2a98e45c0634386e3f))
- feature(userLoginLog): 用户登录日志前端实现 ([091253a](https://github.com/mineadmin/mineadmin/commit/091253ab1676e3753ca787fdfb71d856c8804097))
- feat(upload-image): ui设计 未完成 ([4018464](https://github.com/mineadmin/mineadmin/commit/401846432e21daa8b392b5891e9455835fb56b1c))
- feat(seeder): 菜单图标优化 ([7c0a6c9](https://github.com/mineadmin/mineadmin/commit/7c0a6c93bf27fdea5417ee5550d43d7e0425dfea))
- feat(upload-image): 新增上传图片组件（未完成） ([e02a5cd](https://github.com/mineadmin/mineadmin/commit/e02a5cd15414c31ced7f84c5d7b21e781f5bafff))
- feat(remote-select): 新增远程select组件。 ([0887ef7](https://github.com/mineadmin/mineadmin/commit/0887ef77740883ab77b0cb78040bbabb77997f34))
- feature(menu): 优化默认翻译展示逻辑 ([22a6e83](https://github.com/mineadmin/mineadmin/commit/22a6e8341d859fa117bb5720d511a6999503499c))
- feature(menu): 增加日志管理菜单填充和翻译文件补充 ([58b031c](https://github.com/mineadmin/mineadmin/commit/58b031c3cf55257b2cde25abbe8caae0d545d9a3))
- feat(remote-select): 未完成 ([c50a41d](https://github.com/mineadmin/mineadmin/commit/c50a41d77620b3b464930029171c7e891ccfea02))
- feat(dict数据渲染组件)：新增radio、select、checkbox字典渲染组件，优化i18n功能。 ([19f811d](https://github.com/mineadmin/mineadmin/commit/19f811d505872e66e79814b28e2c3c986ba6267d))
- feat(seeder): 菜单seeder添加按钮i18n ([79f4d2b](https://github.com/mineadmin/mineadmin/commit/79f4d2b668c7a6b60d2d2f856699f0207f98882e))
- feat(dictionary): 新增字典处理及字典数据存放点 ([29ff8d1](https://github.com/mineadmin/mineadmin/commit/29ff8d174a26538ec8434c82e96be9c036fb2d70))
- feat(user): 集成用户管理，新增ma-dialog组件 ([5d02618](https://github.com/mineadmin/mineadmin/commit/5d02618eb97391d05c4d9cb6f85d0050f48e9964))
- feat(cell-render): ✨ 添加user渲染器 ([c244abc](https://github.com/mineadmin/mineadmin/commit/c244abcdb480ff271d640aabba176a0857ce6626))
- feat(用户) ([ca943e9](https://github.com/mineadmin/mineadmin/commit/ca943e92c4f690c03776871df2ebc9378133e7fb))
- feature(log): 新增用户登录日志、操作日志的查询和删除接口 ([34807b2](https://github.com/mineadmin/mineadmin/commit/34807b2fc21320e1d3ebfb4dc2809103c7a26a2b))
- feat(user): 界面优化，更新pro-table版本 ([ca04095](https://github.com/mineadmin/mineadmin/commit/ca040952bc22ef160a3f95c5edfc6433b12a33e4))
- feat(menu): 持续菜单集成 ([5f816b6](https://github.com/mineadmin/mineadmin/commit/5f816b60d1948f939de12deafc95588c12b1e60d))
- feat(插件): 前端支持后端注册插件路由 ([b5ce0e7](https://github.com/mineadmin/mineadmin/commit/b5ce0e7c7eae30d7a3755fcbfc82e9d4c743a282))
- feat(菜单管理)：还未完成 ([e5748bd](https://github.com/mineadmin/mineadmin/commit/e5748bd2fc7ebee512085564da511dc0c5145058))
- feat(菜单管理) ([5880dd8](https://github.com/mineadmin/mineadmin/commit/5880dd8f41763f047961b89015c8cd124f6fe09a))
- feat(工作台页面) ([15d8663](https://github.com/mineadmin/mineadmin/commit/15d8663affc3e816aaea9420b234e42cc2e303c3))
- feat(统计报表) ([87643b4](https://github.com/mineadmin/mineadmin/commit/87643b49e75aabb3a554ff3562e53c7c739cf2da))
- feat(分析页) ([70beaa0](https://github.com/mineadmin/mineadmin/commit/70beaa003e54ead71738e6de94a9593f88ee4945))
- feat(分析页)：还未完成 ([75350e8](https://github.com/mineadmin/mineadmin/commit/75350e8fa1198e677b5c6aca307b4ebef9a8429f))
- feat(i18n): MenuSeeder填充数据和前端添加i18n ([079ce16](https://github.com/mineadmin/mineadmin/commit/079ce168ff1966e108e042ae0627c01129685c09))
- feat(demo): 添加demo相关页面 ([ad07125](https://github.com/mineadmin/mineadmin/commit/ad071258c5b8a102b3e6fc684240fa26467099f7))
- feat(欢迎页): 完善了欢迎页 ([da04d0a](https://github.com/mineadmin/mineadmin/commit/da04d0a0a70f328c4d21db945b5a4a414360cd85))
- feat(mock): ✨ 取消插件mock的支持尝试 ([e3969c7](https://github.com/mineadmin/mineadmin/commit/e3969c77e6b93b3cce2b91a0b72ae2ca4ba3067b))
- feat(兼容mock模式): 新增mock env配置文件 ([12c4b5e](https://github.com/mineadmin/mineadmin/commit/12c4b5e3290a1eb40826f65d4b1e3cc4ac310c61))
- feat(menu): 增加强制子侧边栏显示菜单参数: subForceShow ([be455fe](https://github.com/mineadmin/mineadmin/commit/be455fee0d2f1c4fbed77a076be36cc4c688ca9a))
- feat(mock): ✨ 支持插件mock ([855cc78](https://github.com/mineadmin/mineadmin/commit/855cc78c8b212ed61e29278ad2c1578c6047dd9b))
- feat(ma-search): 更新ma-search组件版本，修复默认折叠失效问题 ([7e6df21](https://github.com/mineadmin/mineadmin/commit/7e6df214a402918c255360b437a9725a196c8db2))
- feat: add pro-table ([349f959](https://github.com/mineadmin/mineadmin/commit/349f95987f34d3c17c454289977a3cdb334300ba))
- feature(result): 返回消息翻译化 ([d242443](https://github.com/mineadmin/mineadmin/commit/d24244320d65c847affbd8bfe3e2e062443f95ef))
- feature(permission): 赋予用户角色接口 ([ae9cc0a](https://github.com/mineadmin/mineadmin/commit/ae9cc0a7e98c8c435d66c821493620d1ff099afc))
- feature(user): 新增 修改个人信息接口，重置个人密码接口，修复 phpstan 报错,优化部分代码 ([690aa76](https://github.com/mineadmin/mineadmin/commit/690aa7651e948bc13e58e82b03c19d37664711bd))
- feat(add plugin config): ✨ 插件新增配置文件发布功能 ([886f9d7](https://github.com/mineadmin/mineadmin/commit/886f9d7cf2d4a81080b4c32810fd393471dffca9))
- feat(component): ✨ 新增search组件 ([810eaf9](https://github.com/mineadmin/mineadmin/commit/810eaf9bbb834a31e4a19d3c433a9fbbc6e41925))
- feat(新增build:nocheck打包命令): ✨ 增加不检查ts错误的打包方式，防止因为ts类型等方面错误导致打包失败 ([a2db516](https://github.com/mineadmin/mineadmin/commit/a2db516229e67fa0379c4d3abbf6f6a1303f3c6e))
- feat(AttachmentRepository): ✨ 附加搜索处理函数以支持附件筛选: 添加一个新的处理函数到AttachmentRepository，允许基于给定参数中的'suffix'字段进行搜索。该函数使用when方法来条件地应用筛选，提高搜索的灵活性和效率 ([ccb6c1f](https://github.com/mineadmin/mineadmin/commit/ccb6c1fe5eb1153cfa4eb33bd8a42b184900ea13))
- feat(resource-picker): 添加对话框组件及类型声明 ([c683d5a](https://github.com/mineadmin/mineadmin/commit/c683d5a164d746df79daeef756df1fbebcd8ff0e))
- feat(hooks): 实现useImageViewer自定义钩子 :创建了一个新的Vue自定义钩子useImageViewer，用于在页面上动态渲染图片查看器。该钩子接受一个图像数组和可选的配置选项， 并将其传递给Element Plus的ElImageViewer组件。当查看器关闭时，它还会从DOM中移除自身。 ([13c9ad7](https://github.com/mineadmin/mineadmin/commit/13c9ad79d146cdb0843873996019eef862111fc6))
- feat(ma-resource-picker): 增加右键菜单:资源选择器面板增加右键菜单和图片查看功能, 在资源选择器面板中实现右键点击显示菜单的功能，该菜单允许用户选择、取消选择、独选此项、查看和下载资源。 同时，面板支持点击资源预览图片，增强用户体验。 ([6db2240](https://github.com/mineadmin/mineadmin/commit/6db2240f06e910eed5c1adbbf03432459c8bc2c1))
- feat(base): 临时更改资源选择器的打开方式,用于调试 ([2b0ae75](https://github.com/mineadmin/mineadmin/commit/2b0ae75d0de23e32928b3f3209ee07ff3aae8587))
- feat(resource-picker): 优化页面结构,添加加载动画等,该版本为开发板 还未完善 ([3c85c74](https://github.com/mineadmin/mineadmin/commit/3c85c748e0dc29394ca27d99e300b60606dd5e99))
- feat(resource-picker):增加分页功能并优化UI ([ef7eb3b](https://github.com/mineadmin/mineadmin/commit/ef7eb3b856c8c0f0ef85751441e647d9c7f14c7a))
- feat(mock): 新增附件(mock)数据生成逻辑，用于资源选择器面板测试。 ([12946af](https://github.com/mineadmin/mineadmin/commit/12946afa410532817f69eda4ec18406dc371170a))
- feat(resource-picker): 完善展示,始终为正方形展示框且且实现自适应 ([769052c](https://github.com/mineadmin/mineadmin/commit/769052cdab25e8afb09d76b2ffa6301218a45e9c))
- feat(resource-picker): 添加资源选择器组件,现在包括一个面板组件，用于显示和选择资源。此组件支持多选和限制选择数量的功能，并具有根据资源类型过滤的选项。样式和脚本都已相应调整，以适应新功能。 ([89b256f](https://github.com/mineadmin/mineadmin/commit/89b256fc6b2227a149b1d4243d0dadf42f2309bf))
- feat(tab组件): 添加了一个新的对齐属性，以增强选项卡组件中的项目对齐灵活性。可以在水平或垂直方向上选择"start"、"center"或"end"对齐方式。此属性为选项卡组件的设计提供了更多自定义选项。 ([33dc713](https://github.com/mineadmin/mineadmin/commit/33dc713ebe6798e1dcbfe8dd2e87834ae95dde66))
- feat(m-tab): 在选项卡组件中引入具名插槽以增强可定制性。此改动允许通过`<slot name="default" :item="item">`访问单个选项卡项的内容，使开发者能够自定义选项卡项的显示方式。 ([6e95a9b](https://github.com/mineadmin/mineadmin/commit/6e95a9b82f5c55b9e24f3e464505b9c33eda6958))
- feat(tab组件):新增加了垂直方向选项，使选项卡可以垂直对齐。通过在选项卡组件中引入 'direction' 属性，用户现在可以选择 选项卡是水平对齐还是垂直对齐，从而提高了用户界面的灵活性。 ([db0dff9](https://github.com/mineadmin/mineadmin/commit/db0dff9c734ff47d71214289173065aba155e106))
- feature(web): 增加用于 web 系统的流程脚本 ([16ee204](https://github.com/mineadmin/mineadmin/commit/16ee204ca054388959918d4ebdc3843ae0bab81a))
- feature(web): 增加前端代码 ([ccae081](https://github.com/mineadmin/mineadmin/commit/ccae0817763233422e7ee8bcd047c7c306c0652e))
- feature(upload): 增加资源，资源列表，删除资源接口 ([#338](https://github.com/mineadmin/mineadmin/pull/338)) ([854d393](https://github.com/mineadmin/mineadmin/commit/854d393298a2c4c7558570849afc1de42bddff5f))
- feature(config): 增加配置、分组配置API ([#333](https://github.com/mineadmin/mineadmin/pull/333)) ([945d1ad](https://github.com/mineadmin/mineadmin/commit/945d1ad0c7138f246514633be694e023d3e6ec8c))
- feature(permission): 增加用于用户获取权限的API以及相关单元测试 ([#331](https://github.com/mineadmin/mineadmin/pull/331)) ([0ee8e7e](https://github.com/mineadmin/mineadmin/commit/0ee8e7eabed234d54054ed6b6f90aae0085a33e2))
- feature(role): 新增角色权限赋予API ([#329](https://github.com/mineadmin/mineadmin/pull/329)) ([470d98c](https://github.com/mineadmin/mineadmin/commit/470d98c0bbae7fda1feccc1747bb973fb13ccf73))
- feature(actions): 增加对Swow的测试支持 ([#328](https://github.com/mineadmin/mineadmin/pull/328)) ([f49ffd0](https://github.com/mineadmin/mineadmin/commit/f49ffd011754b157205727d618d3c0e005ffe7a7))
- feature(post): 增加岗位管理API ([#327](https://github.com/mineadmin/mineadmin/pull/327)) ([8a04d81](https://github.com/mineadmin/mineadmin/commit/8a04d810cf778c713064bdebaca22147019c86ce))
- feature(dept): 增加部门管理API ([#326](https://github.com/mineadmin/mineadmin/pull/326)) ([eb88889](https://github.com/mineadmin/mineadmin/commit/eb88889d3f867676fe6226d9446f38be3b3abb8e))
- feature(menu): 添加菜单管理api ([#325](https://github.com/mineadmin/mineadmin/pull/325)) ([8552619](https://github.com/mineadmin/mineadmin/commit/855261908744dc33629260587c8e1622de7ec07c))
- feature(role): 增加权限管理API ([#323](https://github.com/mineadmin/mineadmin/pull/323)) ([ec6d72a](https://github.com/mineadmin/mineadmin/commit/ec6d72a172c2db5ef30d5233bc324657371e1d1e))
- feature(user): 增加用户管理api ([9e704c8](https://github.com/mineadmin/mineadmin/commit/9e704c81796b25598f7f8a581ba21dd56addb3cc))
- feature(menu): 增加用户菜单列表接口 ([10136d2](https://github.com/mineadmin/mineadmin/commit/10136d27234274471410ed55b5a4b65e6b0c9c9d))
- feature(passport): 必应背景图测试用例补充 ([a4db968](https://github.com/mineadmin/mineadmin/commit/a4db96886cb4fd6baeac5feda06d481ec5e8c459))
- feature(passport): 完善刷新 token 接口 ([d2544be](https://github.com/mineadmin/mineadmin/commit/d2544bef225d39c73c59f947f57f0e025a7a1b66))
- feature(passport): 完善我的信息接口 ([62a8558](https://github.com/mineadmin/mineadmin/commit/62a8558776eda578bc397260bdd6a9611cff2f16))
- feature(passport): 完善退出接口 ([f625169](https://github.com/mineadmin/mineadmin/commit/f6251693f0115b3f46b7a8994271aa68818935ab))
- feature(swagger): 完善 swagger ([175d66e](https://github.com/mineadmin/mineadmin/commit/175d66e4dc83ef1ebd37973f28fa9eb722ba33b9))
- feature(passport): 完善登录接口+测试用例 ([938fee6](https://github.com/mineadmin/mineadmin/commit/938fee6f0c911b8863aaacab81878cc83d08caa4))
- feature(passport): 登录，获取背景图 ([f29e719](https://github.com/mineadmin/mineadmin/commit/f29e719f4129009500b7dbee0abe0945b8ee3a8d))
- feature(swagger): 增加 swagger 配置+文档，暂时将旧代码移植到 tmp 目录下 ([a572f22](https://github.com/mineadmin/mineadmin/commit/a572f22a1abf96a7797935c9880e5b0825d25793))
- feat(databases): 移除未使用的模块并清理 seeders 和 migrations 文件 ([3aa4982](https://github.com/mineadmin/mineadmin/commit/3aa49827aa5a91f97686a40b08dc2281f6e29d04))
- feat(attachment)： 将 'uploadfile' 重命名为 'attachment' 并更新相关组件 ([08ae915](https://github.com/mineadmin/mineadmin/commit/08ae915cec133be2ef06032628894b41d00a8ab7))
- feat(hyperf/helper): 引入 hyperf/helper 的全局函数 移除了use function 方式 ([63dbfda](https://github.com/mineadmin/mineadmin/commit/63dbfda7446fd268f66369572ddc58e3b07c367b))
- feature(composer): 引入 hyperf/helper ([e4b1a36](https://github.com/mineadmin/mineadmin/commit/e4b1a360ea8644e130fb6cf60c1384e3337a5de7))
- feat(swagger): 新增 Swagger 配置文件 ([3aaf765](https://github.com/mineadmin/mineadmin/commit/3aaf76545b5a718732244ca90df7a64e1c52c697))
- feat(setting_config): improve encoding & seeding for config_select_data ([4d74468](https://github.com/mineadmin/mineadmin/commit/4d744689c937d78d37b6416a0081f5dfa2c078cc))

### 🐛 Bug Fixes
- fix(seeder): 修复执行php-cs-fixer造成seeder文件类名错误的问题 ([#476](https://github.com/mineadmin/mineadmin/pull/476)) ([f368ec1](https://github.com/mineadmin/mineadmin/commit/f368ec1ae0f93c823d6f17a85eb71515790e09b7))
- fix(php-cs) ([#475](https://github.com/mineadmin/mineadmin/pull/475)) ([e380d78](https://github.com/mineadmin/mineadmin/commit/e380d7868a82228f1bf4e2c332e5eb25d519685c))
- fix(layout): 修复布局与iframe页面问题 ([#469](https://github.com/mineadmin/mineadmin/pull/469)) ([74ed80a](https://github.com/mineadmin/mineadmin/commit/74ed80a9270c47e40add28390fe121972e19a93f))
- fix:(menu): 修复提示信息描述不准确 ([#468](https://github.com/mineadmin/mineadmin/pull/468)) ([24b08c1](https://github.com/mineadmin/mineadmin/commit/24b08c17b010adc61a017cff3d4f2400d7ac4472))
- fix(pro-table): 修复`requestPage`设置`size`参数无效的bug ([#467](https://github.com/mineadmin/mineadmin/pull/467)) ([28a028f](https://github.com/mineadmin/mineadmin/commit/28a028f9559e66046fb3c85b9e1a602fb312bb6f))
- fix(pro-table): 修复单元格插件注册后调用无效的问题 ([#466](https://github.com/mineadmin/mineadmin/pull/466)) ([9290f22](https://github.com/mineadmin/mineadmin/commit/9290f22b0fbe7630d6dc7d4a90004a200e903748))
- fix(front-permission): 修复前端权限检查时如果值为空对象时：{}，进入判断条件，导致显示无权限 ([#463](https://github.com/mineadmin/mineadmin/pull/463)) ([4f11da1](https://github.com/mineadmin/mineadmin/commit/4f11da1fd6be88776c2e2f585432bd5a8b084dd9))
- fix(welcomePage): 修复路由添加 welcomePage 时，自定义数据未覆盖默认数据 ([#458](https://github.com/mineadmin/mineadmin/pull/458)) ([7331b5f](https://github.com/mineadmin/mineadmin/commit/7331b5fe3128c5290af38249c80ed4c22ab860db))
- fix(cs-fix): fix cs-fix error ([#453](https://github.com/mineadmin/mineadmin/pull/453)) ([d742aa0](https://github.com/mineadmin/mineadmin/commit/d742aa026cfd01400e205beb436336f4b1b2cc0b))
- fix(analyse): fix analyse error ([#452](https://github.com/mineadmin/mineadmin/pull/452)) ([30644a8](https://github.com/mineadmin/mineadmin/commit/30644a8e3af91ed7f4266efebad6fc4362255e62))
- fix(vite-config): 未添加 `base` 参数，导致`VITE_APP_ROOT_BASE` 无效 ([#448](https://github.com/mineadmin/mineadmin/pull/448)) ([618bb66](https://github.com/mineadmin/mineadmin/commit/618bb665b18fb75fca986f17fb5196e142fe6443))
- fix(bug): 修复添加顶级菜单按钮未初始化id，修复应用商店打开官网链接插件详情页404，优化应用商店图片显示 ([#444](https://github.com/mineadmin/mineadmin/pull/444)) ([2589a7d](https://github.com/mineadmin/mineadmin/commit/2589a7de9b46c52d4f9764808ca55e3e9ef59984))
- fix(main-aside): 修复分栏模式下，菜单激活问题 ([#443](https://github.com/mineadmin/mineadmin/pull/443)) ([6def465](https://github.com/mineadmin/mineadmin/commit/6def4653ae2a08cd341ee8987877768c4d633fb5))
- fix：修增菜单含三级或以上的情况下只有一级菜单有选中样式 ([#439](https://github.com/mineadmin/mineadmin/pull/439)) ([2548a1e](https://github.com/mineadmin/mineadmin/commit/2548a1ec97f42674aa0805a098d0fe5f0147de71))
- fix(menu-btn-permission): 修复菜单按钮列表为空时，未清楚的问题 ([#433](https://github.com/mineadmin/mineadmin/pull/433)) ([94c7ded](https://github.com/mineadmin/mineadmin/commit/94c7dedba7e7134d155348a8f41c1367c4777dd0))
- fix(cs-fix): fix 语法 ([#427](https://github.com/mineadmin/mineadmin/pull/427)) ([a6d86a4](https://github.com/mineadmin/mineadmin/commit/a6d86a435de141a90e197867148ccc55b13de265))
- fix(menu): 修复菜单使用bug ([#426](https://github.com/mineadmin/mineadmin/pull/426)) ([8eef50d](https://github.com/mineadmin/mineadmin/commit/8eef50df68c566ac72506466aea71dc56b66a84a))
- fix(menu): 修复编辑类型为M的菜单时，按钮权限列表未回显 ([#424](https://github.com/mineadmin/mineadmin/pull/424)) ([d38a8d3](https://github.com/mineadmin/mineadmin/commit/d38a8d38af6ae357c064465135e4519b15804bfd))
- fix：资源选择器新增删除方法，修复多语言问题 ([#422](https://github.com/mineadmin/mineadmin/pull/422)) ([cf49390](https://github.com/mineadmin/mineadmin/commit/cf49390d9e5b900a39b707da756aa59fbca5f868))
- fix(menu): 拼写错误 ([#421](https://github.com/mineadmin/mineadmin/pull/421)) ([0f7e101](https://github.com/mineadmin/mineadmin/commit/0f7e101f09c0aaafcaf088df0c5e258814ead2b1))
- fix(pro-table, setPermissionForm): 升级pro-table修复classList.add报错bug，修复勾选权限严格模式未生效问题 ([#408](https://github.com/mineadmin/mineadmin/pull/408)) ([97d3a60](https://github.com/mineadmin/mineadmin/commit/97d3a60187f9cabc6fe38a8f5226f7b0b76b6b01))
- fix: 修复顶级菜单无法被添加的问题 ([#407](https://github.com/mineadmin/mineadmin/pull/407)) ([334c619](https://github.com/mineadmin/mineadmin/commit/334c619c86170f17c01718822ee2dc004fcaf820))
- fix(roleCode): code error ([#401](https://github.com/mineadmin/mineadmin/pull/401)) ([9a970b1](https://github.com/mineadmin/mineadmin/commit/9a970b119879c0dc146e80f0752df9591e5df13f))
- fix(watcher, usePluginStore): 移除监听 api 目录, 修复usePluginStore 类型报错问题 ([#395](https://github.com/mineadmin/mineadmin/pull/395)) ([44ce6e3](https://github.com/mineadmin/mineadmin/commit/44ce6e3a7fa99c265655f219b353252bdd8d4fb2))
- fix(前端类型错误): 修复前端插件类型定义问题以及usePluginStore部分函数返回值类型错误问题 ([#382](https://github.com/mineadmin/mineadmin/pull/382)) ([807da0e](https://github.com/mineadmin/mineadmin/commit/807da0e83f5a295d8c34452ee989b3bd4a82545c))
- fix(app): stop propagation on mode not found exception ([#375](https://github.com/mineadmin/mineadmin/pull/375)) ([664d757](https://github.com/mineadmin/mineadmin/commit/664d75783ee03ce127178eec72546b9defbcea6b))
- fix(修复菜单新增和编辑逻辑错误) ([#379](https://github.com/mineadmin/mineadmin/pull/379)) ([a140517](https://github.com/mineadmin/mineadmin/commit/a140517c11de756138585d9414cd257349c664b2))
- fix(水印) ([38ad110](https://github.com/mineadmin/mineadmin/commit/38ad11096229af8e760c6cd7def3fa2b59d06940))
- fix(menu、table): 修复菜单新增可一直点击，优化表结构，修复菜单错误提示未翻译的问题 ([8ac3676](https://github.com/mineadmin/mineadmin/commit/8ac367624f13fc4a57bc3b1991a9b1e083fcc237))
- fix(refresh_token): 修复刷新token也失效的情况下，导致一直在加载页面转圈 ([6dc7519](https://github.com/mineadmin/mineadmin/commit/6dc7519b2dffa0812c8580240a33f1f6e876de88))
- fix(获取用户信息失败后未跳转登录页问题) ([9cc5bfa](https://github.com/mineadmin/mineadmin/commit/9cc5bfa7351b3100262ebaccc171bd6a51a5e184))
- fix(修复意外引入element-plus图标) ([724479a](https://github.com/mineadmin/mineadmin/commit/724479ad6936a554aec32d99d829d2249da6701e))
- fix(数据返回类型) ([6946606](https://github.com/mineadmin/mineadmin/commit/6946606d84d1552a99345a817b1a2aee2f89f8c6))
- fix(login)：默认账号更改为admin，适配后端 ([7182398](https://github.com/mineadmin/mineadmin/commit/71823983ef77dad18c443c34594084c1652fb31c))
- fix(admin): handle null user and optimize menu query ([d07c4ed](https://github.com/mineadmin/mineadmin/commit/d07c4ed57e1efb18b66055256f46e86c179c18e3))
- fix(login)：修复蹼泳用户获取后台设置问题导致退出问题 ([e3f70ac](https://github.com/mineadmin/mineadmin/commit/e3f70ac04b67b2db48cfb36117bd9a7468924d86))
- fix(mixed layout)：修复混合布局无子级菜单仍显示子侧边栏bug ([f34bf2b](https://github.com/mineadmin/mineadmin/commit/f34bf2b97005de2872433e0c498074bd28dd95e9))
- fix(添加顶级菜单报错bug) ([4d50841](https://github.com/mineadmin/mineadmin/commit/4d50841e61b296d5f79e706b3885c60c133a2cf1))
- fix(修复颜色模式偶尔刷新下，el组件颜色显示不对的问题) ([a2fa06c](https://github.com/mineadmin/mineadmin/commit/a2fa06c8fdd178a9560106a6b0bc632c1fcaa527))
- refactor(exception): use match expression in JwtExceptionHandler ([e20f8d6](https://github.com/mineadmin/mineadmin/commit/e20f8d6e398898d3205dee590451d8103ed9169f))
- fix(修改密码后，关闭弹窗) ([7d4f0ff](https://github.com/mineadmin/mineadmin/commit/7d4f0ffb83dd83a509c52374d73c64042801526b))
- fix(用户中心修改密码) ([06ee54e](https://github.com/mineadmin/mineadmin/commit/06ee54ef389a30e0e3adcacf6aa4e92d9473b8b1))
- fix(m-button组件loading状态下未被禁用的bug，修复登录失败，按钮未恢复正常状态问题) ([3a124bf](https://github.com/mineadmin/mineadmin/commit/3a124bf77834f1261dea1c1767e2551a240eb47a))
- fix(修复前端超管判断逻辑) ([7ab13d9](https://github.com/mineadmin/mineadmin/commit/7ab13d907844c0051c2d74abdeb5497af065fbe2))
- fix(修复会员中心) ([3f877b8](https://github.com/mineadmin/mineadmin/commit/3f877b8f662eeef4428361b5d907862587204f7c))
- fix(修复ma-upload-image组件调用资源选择器未更新v-model的bug) ([d70c92b](https://github.com/mineadmin/mineadmin/commit/d70c92b307d8043e9e364b5dc114ce89fc2a1d7f))
- fixed phpunit ([4bfe14f](https://github.com/mineadmin/mineadmin/commit/4bfe14fba2d4bbe47fdc6433569ffaaefd2525c3))
- fixed phpstan ([ae0787f](https://github.com/mineadmin/mineadmin/commit/ae0787f7b3999b44a7f82ff3724458f4d9103c9f))
- fix(layout) ([d6794a1](https://github.com/mineadmin/mineadmin/commit/d6794a1bbe65203d833c5d5374c2698cb4486bab))
- fix(面包屑bug) ([322839d](https://github.com/mineadmin/mineadmin/commit/322839d3da5c1a6c4101ff2ccc7b84ff80bf1531))
- fix(tab refresh): 修复tab刷新bug ([6a05388](https://github.com/mineadmin/mineadmin/commit/6a053881208a46abb9c1de22006e4b4d7d917d2a))
- fix(role bind menus) ([175b986](https://github.com/mineadmin/mineadmin/commit/175b98680464ae8bbd2b0763a86739fb46981689))
- fix(menuSeeder) ([82811c2](https://github.com/mineadmin/mineadmin/commit/82811c22a8103e068c01cc3df9bc4d509a7c6951))
- fix(优化) ([406391d](https://github.com/mineadmin/mineadmin/commit/406391d0093615cd63c9c7a3020c010334e822a7))
- fix(角色状态错误) ([3bac227](https://github.com/mineadmin/mineadmin/commit/3bac227efdf517b60e3b6ae207a03a72b042f188))
- fix(用户crud) ([134098b](https://github.com/mineadmin/mineadmin/commit/134098bd979b7612a8ff7c19f049169cb6daed96))
- fixed: 修复 refresh token 中间件验证问题 ([acb35cc](https://github.com/mineadmin/mineadmin/commit/acb35cc752921cdb1e5e2c56b184eafa0a00f0f4))
- fix(remove log icon): 移除菜单填充里的操作之日按钮权限的图标 ([fff948d](https://github.com/mineadmin/mineadmin/commit/fff948d4b341f946acada5301a519baa16d646e3))
- fix(public_url): 错误的问题 ([94510a1](https://github.com/mineadmin/mineadmin/commit/94510a1c2866e71bd606ca419433a6765b4dc669))
- fix(sql打印): substr_replace导致的位置替换有问题 ([82d2d1e](https://github.com/mineadmin/mineadmin/commit/82d2d1e2c6d8755551b31fe23e8f960f7d27dc64))
- fix(http): 修复前端接管服务器返回错误的处理 ([10e17f2](https://github.com/mineadmin/mineadmin/commit/10e17f2a7c44380679011c4acd78e211b8ed2091))
- fix(web): 修复字体引用 src 属性错误 ([a03995f](https://github.com/mineadmin/mineadmin/commit/a03995ffb42a42750d47c7d5632121a97a362c07))
- fix(menu): 菜单填充数据修复，多语言key修复 ([f0e8273](https://github.com/mineadmin/mineadmin/commit/f0e82739396b88fecb35a2f536cea8f4e688f012))
- fixed(jwt auth): 收敛用户事件到 jwt 组件中 ([81231e1](https://github.com/mineadmin/mineadmin/commit/81231e1c2d5a57cd47b8dc3f5f1a8d139dd3ee09))
- fixed(login event): error class name ([81707b2](https://github.com/mineadmin/mineadmin/commit/81707b2aab3641e2bf3713cf92f6bce0fed6d182))
- fix(eslint去掉import sort规则) ([51853a2](https://github.com/mineadmin/mineadmin/commit/51853a2925f1989d30f1f2a4291f72de8a5ed57f))
- fix(更新pro-table)：修复pro-table搜索设置不显示时，但外容器还显示的问题 ([ccfb0a2](https://github.com/mineadmin/mineadmin/commit/ccfb0a298e85448fd1f959cc0a23938f53abcef7))
- fix(seeder) ([25d00f4](https://github.com/mineadmin/mineadmin/commit/25d00f4b44c9ed7ef421a2162fba77afc223c27c))
- fix(修复bug) ([1217685](https://github.com/mineadmin/mineadmin/commit/1217685884178bd3e2e979b68249a30eb075ad6f))
- fixed result response ([381bc19](https://github.com/mineadmin/mineadmin/commit/381bc19455f23576c4211919f9c5ec35049a84ac))
- fix(ResultResponse): 🐛 在解析器中实现对字符串实例化的支持 ([35f23b6](https://github.com/mineadmin/mineadmin/commit/35f23b61f8c4b6b5b82c354ef2bb3b838c2f13cc))
- fix(DbQueryExecutedListener): 添加对position最大值的判断 ([8cc8691](https://github.com/mineadmin/mineadmin/commit/8cc8691e7481a24075c33cbb73cd1c9daf126138))
- fix(seeders): 大驼峰命名 ([8bdda0c](https://github.com/mineadmin/mineadmin/commit/8bdda0c61cd503a95eb25be5bfc71199341232bd))
- fix(seeder): 类名改成驼峰兼容php8.1 ([2759f0e](https://github.com/mineadmin/mineadmin/commit/2759f0e2f66d4c56480b0676b8e12c162efc49e6))
- fix(menuSeeder): 填充数据优化 ([ecdd2c4](https://github.com/mineadmin/mineadmin/commit/ecdd2c4ecff722d65689033b813a426349c41824))
- fix(menuSeeder): 填充数据修复 ([de7c389](https://github.com/mineadmin/mineadmin/commit/de7c389ab575f725b5d465f645ed8ed52d3535a3))
- fix(seeders.menu):  删除data_scope写入,该字段已移除 ([f19f721](https://github.com/mineadmin/mineadmin/commit/f19f721747ffa3e2b1402c7747c57b933a24a1c5))
- fix(migrations.attachment): 🐛 修复问题 ([e708ccb](https://github.com/mineadmin/mineadmin/commit/e708ccbad0babf82bd3e0df8e4174252c49373d3))
- fix(constants.user.status): 🐛 描述和值错误 ([c9884b4](https://github.com/mineadmin/mineadmin/commit/c9884b4c0de7f83b597902f4edf97d2ba53b58de))
- fix(menu.pageList): 数据返回改为树形 ([7099bce](https://github.com/mineadmin/mineadmin/commit/7099bce32e309607a61e9aab7cdd51b73330a046))
- fix(PermissionMiddleware): 缺少对超管的放行 ([e26b762](https://github.com/mineadmin/mineadmin/commit/e26b762db230e77815815d6df3446d6d1e802e62))
- fix(cancel debug): 去掉显示debug信息 ([6711a44](https://github.com/mineadmin/mineadmin/commit/6711a447acf7965ec3155aa613d8c73e2828e75d))
- fix(jwt): 修复 jwt 过期时间配置不生效问题 ([402d5c3](https://github.com/mineadmin/mineadmin/commit/402d5c3dcc72f2d1df80b1e835558c1f64d6545e))
- fix(menu)：刷新后，父菜单不展开的问题 ([5fd7d48](https://github.com/mineadmin/mineadmin/commit/5fd7d481f9b6d75912ca8230e66ae31db375e5b9))
- fix：菜单不显示的问题 ([3216ec4](https://github.com/mineadmin/mineadmin/commit/3216ec4e5a655c19659f9f39683557b46b1c7232))
- fix(seeder): MenuSeeder填充数据优化 ([6b49dd9](https://github.com/mineadmin/mineadmin/commit/6b49dd9fd7feee17e828c399f0aac8c5aa80b2f9))
- fix：token过期退出失败问题 ([2f3a3ba](https://github.com/mineadmin/mineadmin/commit/2f3a3ba327ed4c4ab64ec130fc7639623c6d2646))
- fix(cs-fix): 统一 kernel 编码规范 ([bf5aff2](https://github.com/mineadmin/mineadmin/commit/bf5aff2c2c5f859b763c28cf217edd1c5b9838c3))
- fix(debug): 去掉debug日志输出 ([b2a278a](https://github.com/mineadmin/mineadmin/commit/b2a278a6c72fb197adc2cf50c8cbd497416f172b))
- fix(vue-proxy): 修复前端代理错误的问题 ([33b1064](https://github.com/mineadmin/mineadmin/commit/33b10646f7e6ff62a5b6af5574ecc079dfafadce))
- fix(seeder): db:seed执行后找不到迁移文件的bug ([8f658a6](https://github.com/mineadmin/mineadmin/commit/8f658a68b27e654652fbe29fe10b51f99ad08331))
- fix(dbSeed): 优化数据填充，统一代码风格 ([fc41315](https://github.com/mineadmin/mineadmin/commit/fc41315fa8d0ed5e65651d476f5d8e9cf17177bd))
- fix(unit test): 修复单元测试，修复用户获取角色、菜单接口数据混淆问题 ([554184c](https://github.com/mineadmin/mineadmin/commit/554184c58a9bbc32486bb306599001a762549e1c))
- fix(资源选择器):完善类型定义,完善页面样式 ([67fddcf](https://github.com/mineadmin/mineadmin/commit/67fddcf8d272945c07c5e5d66046531d1ec3347b))
- fix(资源选择器): 完善类型定义 ([efc5717](https://github.com/mineadmin/mineadmin/commit/efc5717b7c5c74ac29d989440989994577c002b1))
- fix(mine-admin/cell-render): 修正switch组件beforeChange回调参数 ([49e6524](https://github.com/mineadmin/mineadmin/commit/49e65240ac1f8b5e2cb63e5a4e17ffadbc7af00d))
- fix(用户信息): 死循环问题 ([ddc7059](https://github.com/mineadmin/mineadmin/commit/ddc705968f6de0697ce589e2a362a8f651a45817))
- fix(pro-table): 修复使用icon组件控制台出警告信息 ([24d2293](https://github.com/mineadmin/mineadmin/commit/24d22939443c9ade9689d83d19338364eb203c8f))
- fix(mine-admin): 修正单元格渲染器的开关请求参数修正了单元格渲染器组件中的开关请求参数。现在正确地传递开关状态更改的请求数据，以反映状态更新时的期望行为。 ([079522d](https://github.com/mineadmin/mineadmin/commit/079522d83853037b8f1024973d8bcebd6be29bea))
- fix(mine-admin): 修正switch组件beforeChange回调执行逻辑 ([3737e92](https://github.com/mineadmin/mineadmin/commit/3737e92198f536391d0aed1dca0b67cab7dce290))
- fix(mine-admin): 确保在switch组件的beforeChange钩子中正确处理加载状态 ([9ed093d](https://github.com/mineadmin/mineadmin/commit/9ed093dabed4c3d80cb8b1bb524d42e2d456d683))
- fix(兼容mock模式) ([d58baa6](https://github.com/mineadmin/mineadmin/commit/d58baa6043bfeeff5bf95159fb8f1a00a38515b2))
- fix(代码格式) ([dfcf5a5](https://github.com/mineadmin/mineadmin/commit/dfcf5a5b909573cf0d6722939906522f7dc06f87))
- fix(mine-admin): 修正switch组件api类型定义及demo使用修正了switch组件中api的类型定义，将其实参从params改为data，以更好地反映其用法。同时，在demo示例中，改为直接使用useHttp().get方法，以便正确演示switch组件的api ([c840bef](https://github.com/mineadmin/mineadmin/commit/c840bef5d279a8913119c4af0f63055972bf0036))
- fix(color): 修复颜色在黑暗模式下显示level的问题 ([046ae30](https://github.com/mineadmin/mineadmin/commit/046ae3043d0657fb277210176af28b186a6e1eee))
- fix(menu): 菜单隐藏失效bug ([b757544](https://github.com/mineadmin/mineadmin/commit/b757544e8da54cb1ed1cc2c93a916aaeec98ce28))
- fix(layout): 菜单版权是否显示与全局取消关联 ([8dd3bba](https://github.com/mineadmin/mineadmin/commit/8dd3bba5bd62a26149461d6e56e11150c38daeeb))
- fix: 🐛 按钮列属性默认值修正为`id` ([0c9bb4f](https://github.com/mineadmin/mineadmin/commit/0c9bb4ffdee8789b9d7f36e23b3573264a90efaa))
- fix(pro-table): 优化加载状态处理和自动查询逻辑 ([07560a5](https://github.com/mineadmin/mineadmin/commit/07560a5e442e48a4d6fb0ed3d8f7bf43199f6129))
- fix(plugin): 🐛 插件的setup钩子调用点修复，非layout布局下不生效问题 ([f327407](https://github.com/mineadmin/mineadmin/commit/f327407b51f3a6ea1c2aa2b0bca61e99cf5e5394))
- fix(menu): 🐛 菜单的badge在Popup状态下仍然显示的问题 ([8b33db5](https://github.com/mineadmin/mineadmin/commit/8b33db5a4cca2283e880b5201cc95e8e66b080b3))
- fix(ma-resource-picker):临时提交,准备做回显相关的处理 ([a3613da](https://github.com/mineadmin/mineadmin/commit/a3613da83a60fc1e1aa7e20b8d8b7667fa378b9c))
- fix(ma-resource-picker): 修复资源选择器的双击选择和数据模型同步问题 ([71d0f8a](https://github.com/mineadmin/mineadmin/commit/71d0f8a06fb1d20a006ba97756a3f9b41ee8b979))
- fix(tab): 修正change事件参数类型:变更事件现在会发出新的参数类型，包括选项项，以便在选择选项时提供额外的上下文。这使得在处理选项变化时能够更方便地访问选项的元数据。 ([88eee4a](https://github.com/mineadmin/mineadmin/commit/88eee4ad4d1378f29cfc0e859794dbf7c1058c57))
- fix(panel): 更正资源项名称的背景颜色和文字颜色 :: ([a963326](https://github.com/mineadmin/mineadmin/commit/a963326c5ef72b86c1e0e811be25933850c0b2a4))
- fix(useImageViewer): 修正类型定义，排除urlList属性 ([c12a70f](https://github.com/mineadmin/mineadmin/commit/c12a70f42da36cbbe499460cefdce2773b3d415c))
- fix(resource-picker): 实现资源项双击预览功能: ([5997477](https://github.com/mineadmin/mineadmin/commit/5997477e8c3b7dab5116ef629a8053df0ba13868))
- fix(resource-picker): 修正选中状态样式显示问题:解决资源选择器组件中选中状态样式未正确显示的问题。调整资源项的选中图标位置并确保其在激活状态下正确显现。去除不必要的样式注释，清理并优化CSS代码可读性。 ([bc63d60](https://github.com/mineadmin/mineadmin/commit/bc63d60eabc728cdb716fc6d7f198ec5c9dac331))
- fix(ma-resource-picker): 修复多选和限制逻辑，并改进资源项样式 ([927d42f](https://github.com/mineadmin/mineadmin/commit/927d42f0a8923b60340affde2eb09179416f084f))
- fix(base): 修正MaResourcePanel容器高度样式 ([ba98b54](https://github.com/mineadmin/mineadmin/commit/ba98b54e4d87887563f28dcdf864d65c406fd4ea))
- fix(ma-icon-picker):在MaIconPicker组件中，移除了更新模型值的emit调用，该调用在model更新时被错误地调用两次。现在，当选择一个图标时，仅更新model值而不进行冗余的事件发射。 ([b5fe3dc](https://github.com/mineadmin/mineadmin/commit/b5fe3dc3b3976ea2793629f8efbc6845af1f4993))
- fix(ci): 自动测试脚本修复 ([7805671](https://github.com/mineadmin/mineadmin/commit/78056715e6b008e91b26ef62ecd7c7f6f7e4b117))
- fix(Tests): 修复DictData测试 ([#335](https://github.com/mineadmin/mineadmin/pull/335)) ([f429262](https://github.com/mineadmin/mineadmin/commit/f429262e09236e6c8bcf2684435760cd49c14345))
- fixed(ci): 优化 pgsql 环境单元测试用例失败 ([#320](https://github.com/mineadmin/mineadmin/pull/320)) ([1d88131](https://github.com/mineadmin/mineadmin/commit/1d8813107dd8996137e2e1dd7b477a78068d25f5))
- fixed(ci): 修复 docker build 错误 ([8c5e188](https://github.com/mineadmin/mineadmin/commit/8c5e1883d2bbdeecdb9ca65c6ba40a95dc8c422f))
- fixed(cache): 测试流程中错误的缓存键拼写 ([74816f9](https://github.com/mineadmin/mineadmin/commit/74816f9214806ed681dca46d7c87bca28fcfcab4))
- fix(QueueMessageService)：修复发私信调用函数不存在（直接发送） ([57f2422](https://github.com/mineadmin/mineadmin/commit/57f242284fe708cce716e6a3564ec91f8ccc45f6))
- fix(model, ws router): 修正 NoticeModel 和 ws 路由器的命名空间 ([3550ac1](https://github.com/mineadmin/mineadmin/commit/3550ac14a9233f949a6d4e8361d2bf5c1a4a6b67))
- refactor(structure): rename framework components for consistency ([#310](https://github.com/mineadmin/mineadmin/pull/310)) ([99dff8e](https://github.com/mineadmin/mineadmin/commit/99dff8e98c1f683493d0bcbafe4c8c4ec1aa143c))

### 📚 Documentation
- docs(README): remove badges and update content ([#414](https://github.com/mineadmin/mineadmin/pull/414)) ([b15a004](https://github.com/mineadmin/mineadmin/commit/b15a0043c8f59f5c9b036644f9afb449893ca1b8))
- docs(迁移文件): 📝 规范迁移文件结构 ([bc860e3](https://github.com/mineadmin/mineadmin/commit/bc860e3e2db376fd00374a801f7e65f3259f4dc9))
- docs(迁移文件): 📝 优化代码结构 ([5fd2077](https://github.com/mineadmin/mineadmin/commit/5fd20778a11d37b2d140beeadca57c4e0f3baa2c))
- docs(迁移文件): 📝 优化注释 ([aa312ce](https://github.com/mineadmin/mineadmin/commit/aa312ce469648fb6f220892187ad4120e2891f00))
- docs(迁移文件): 📝 修改`attachment`迁移文件结构，优化字段注释 ([ad6798a](https://github.com/mineadmin/mineadmin/commit/ad6798ae9ce809a766b09373ef075dfee5f5f88e))
- docs(tools.ts): 更新表格单元格渲染工具类型定义 ([dc3ff19](https://github.com/mineadmin/mineadmin/commit/dc3ff1980c05eeebaea08387fc29afd795e8b9db))

### ⚡ Performance
- perf(sql输入): ⚡ 更改DbQueryExecutedListener的日志级别为info ([78d7ab6](https://github.com/mineadmin/mineadmin/commit/78d7ab632cfed1a7d47bf889f1896bc8c476e381))
- perf(更新@mineadmin/table): ⚡️更新 @mineadmin/table 到 1.0.5版本 ([da1dfea](https://github.com/mineadmin/mineadmin/commit/da1dfea4650589f8f04996e8d9f1bb221970d51b))
- perf(更新@mineadmin/table): ⚡️更新 @mineadmin/table 到 1.0.3版本 ([adb2d7d](https://github.com/mineadmin/mineadmin/commit/adb2d7d03ed604845c8dbe8b67a854d35c5edee5))

### ♻️ Code Refactoring
- refactor(iframe): 优化 iframe 在tab页关闭和刷新时重新加载iframe页面。 ([#478](https://github.com/mineadmin/mineadmin/pull/478)) ([666fd46](https://github.com/mineadmin/mineadmin/commit/666fd46e83954c9653676f9dc400751a3f0ce110))
- refactor(logManage): 优化日志管理批量删除时，弹出提示框确认是否删除 ([#473](https://github.com/mineadmin/mineadmin/pull/473)) ([8c8d35d](https://github.com/mineadmin/mineadmin/commit/8c8d35d0b336aec8c9b65c0e8825ebf30bafe912))
- refactor(upload): 抽离上传本地服务器方法到utils里，可被单独调用 ([#472](https://github.com/mineadmin/mineadmin/pull/472)) ([b323488](https://github.com/mineadmin/mineadmin/commit/b32348804bc55024a6bb462f67c82077b952387f))
- refactor(pro-table): 升级到1.0.37，增加暴露搜索事件`@search-submit`, `@search-reset` 和参数 `onSearchSubmit`, `onSearchReset` ([#462](https://github.com/mineadmin/mineadmin/pull/462)) ([3efad49](https://github.com/mineadmin/mineadmin/commit/3efad49c15eb508d1066fb2e4992d5dbfb3a9b98))
- refactor(menu): 菜单排序无效问题 ([#449](https://github.com/mineadmin/mineadmin/pull/449)) ([215decb](https://github.com/mineadmin/mineadmin/commit/215decbf75effd9ec89af4bac8e5a1967421756d))
- refactor(repository): optimize query handling and update saveById method ([#416](https://github.com/mineadmin/mineadmin/pull/416)) ([745b087](https://github.com/mineadmin/mineadmin/commit/745b0874e723f13a6482cec1444b0c01c2e32244))
- refactor(app): improve menu filtering logic ([#409](https://github.com/mineadmin/mineadmin/pull/409)) ([35e59ed](https://github.com/mineadmin/mineadmin/commit/35e59ed364efd5f942aef3ad5f855854496dab79))
- refactor(delete): change delete method return type and behavior ([#404](https://github.com/mineadmin/mineadmin/pull/404)) ([e1c657f](https://github.com/mineadmin/mineadmin/commit/e1c657fcdaedb67d2dad20eab7a31d1ca6c63092))
- refactor(permissions): remove Casbin and refactor permission logic ([#399](https://github.com/mineadmin/mineadmin/pull/399)) ([b445b22](https://github.com/mineadmin/mineadmin/commit/b445b22ca04ee6016e2e10a8980e7c50398f9bb2))
- refactor(ma-table)：升级到1.0.25版，优化列头对齐未指定下默认使用单元格对齐 ([#392](https://github.com/mineadmin/mineadmin/pull/392)) ([5e5f6b0](https://github.com/mineadmin/mineadmin/commit/5e5f6b0898a8038ac0229e1ba137050fc2efabd7))
- refactor(admin):重构控制器中的请求数据获取方式 ([#386](https://github.com/mineadmin/mineadmin/pull/386)) ([0859e44](https://github.com/mineadmin/mineadmin/commit/0859e4492823891eb4a40b236b229e1ae47d0935))
- refactor: correct typos in language files ([#372](https://github.com/mineadmin/mineadmin/pull/372)) ([85a5e10](https://github.com/mineadmin/mineadmin/commit/85a5e10e74650273ea6c94796398f28bda977582))
- refactor(user): internationalize error messages in UserListener ([#371](https://github.com/mineadmin/mineadmin/pull/371)) ([c7a30e6](https://github.com/mineadmin/mineadmin/commit/c7a30e6e669b51faf7f662d3e1b89eb65388fec9))
- refactor(auth): rename login request and optimize passport controller ([5c87642](https://github.com/mineadmin/mineadmin/commit/5c876421f4f3e09e4881f42b414ad8633876da0c))
- refactor(localization): update and rename localization files for zh_TW locale ([b42b314](https://github.com/mineadmin/mineadmin/commit/b42b314fc2253f5704c2b48e24a11bd381079efe))
- refactor(http) ([9e6a5e7](https://github.com/mineadmin/mineadmin/commit/9e6a5e7d6490a7310b6af0470ce0eefed6ed1436))
- refactor(admin): update permission codes and remove unused exception handlers ([48d7d71](https://github.com/mineadmin/mineadmin/commit/48d7d71c27131673ada01e39366c45c8c8e87f69))
- refactor(admin): update permission codes for menu, role and user management ([c6b5f1d](https://github.com/mineadmin/mineadmin/commit/c6b5f1d86a171178b06e6c7e21c0ab9524beb1c3))
- refactor(app-store): 重构代码并添加国际化支持 ([7dbbe2f](https://github.com/mineadmin/mineadmin/commit/7dbbe2f98de2c2994d62f94dccb8ee96ea0118b8))
- refactor(exception): optimize exception handling and remove redundant code ([9e2fbdc](https://github.com/mineadmin/mineadmin/commit/9e2fbdc078bb4f653627323453a0371130314894))
- refactor(attachment): change storageMode property type from string to int ([1f1e09d](https://github.com/mineadmin/mineadmin/commit/1f1e09da516ea85515a79e2b9a8e9b8878e3db49))
- refactor(permission): adjust status handling and improve repository tests ([f84f9b0](https://github.com/mineadmin/mineadmin/commit/f84f9b0d9d3726279a18f009747ed3cc6e0f07f8))
- refactor(exception): use match expression in JwtExceptionHandler ([e20f8d6](https://github.com/mineadmin/mineadmin/commit/e20f8d6e398898d3205dee590451d8103ed9169f))
- refactor(重构modal和drawer组件) ([5784468](https://github.com/mineadmin/mineadmin/commit/5784468fa3d5417f58efd6cb636487ded4aff251))
- refactor: ♻️ 优化请求菜单那、角色逻辑，适配http、code问题，修复一些小bug ([0217955](https://github.com/mineadmin/mineadmin/commit/02179558b42daf2ab7bd9bb3dd5be7db75229f45))
- refactor(ma-resource-picker):简化文件类型选择逻辑并改善封面获取方法 ([5efadf5](https://github.com/mineadmin/mineadmin/commit/5efadf51b742abe1ad4641ed003b9cd249a7255c))
- refactor(mine-admin/cell-render): 重命名RFV接口为RowFieldValues ([8856a1a](https://github.com/mineadmin/mineadmin/commit/8856a1a4066c0f5fa1fabf42fc801ebc35dd39b3))
- refactor(mine-admin): 移除cell-render插件中的路由注册 ([565d2c5](https://github.com/mineadmin/mineadmin/commit/565d2c5e5c1cf834dba1710381b63bc59fbc5370))
- refactor(mine-admin/cell-render): 更新单元格渲染配置 ([032faff](https://github.com/mineadmin/mineadmin/commit/032faff88661b926e9e99ea7334b19f1348cd27b))
- refactor(mine-admin): 更新proTable组件和单元测试 ([09c974b](https://github.com/mineadmin/mineadmin/commit/09c974b038392345a7d2e5660460828a93c180af))
- refactor(resource-picker): 使用Element Plus图标替换SVG图标: ([c9d8038](https://github.com/mineadmin/mineadmin/commit/c9d8038205f8bdea0fef5334ef20798cdcb71996))
- refactor(resource-picker): 优化选定资源的循环迭代: ([9a846d3](https://github.com/mineadmin/mineadmin/commit/9a846d371b872e0cd2748281e9e853e02a99b62e))
- refactor(resource-picker): 在选择按钮上添加 popover 以显示已选资源: ([aff449c](https://github.com/mineadmin/mineadmin/commit/aff449c8e7c9b42bcb24a6ea75182b95b9efde4b))
- refactor(resource-picker): 移除对话框页脚并更新文件类型选择器: - 删除了ma-resource-picker组件中的对话框页脚，以简化UI。 - 使用`<el-segmented>`替代`<MTabs>`用于文件类型选择，增强可用性。 - 调整了输入框的大小并添加了清除功能，提升用户体验。 - 新的文件类型选择器实现了更一致的筛选行为，并优化了视觉展示。 ([159d716](https://github.com/mineadmin/mineadmin/commit/159d7164216b26c547fa19b65b13cf0d8af58748))
- refactor(resource-picker): 更新图标和文件类型列表: ([a9ead21](https://github.com/mineadmin/mineadmin/commit/a9ead21016728fc02d940855c4934ed4052f2e38))
- refactor(resource-picker): 将类型定义移动到专用的type.ts文件: ([4e148e7](https://github.com/mineadmin/mineadmin/commit/4e148e73e8b3c881866783a2bad21d506da8a075))
- refactor(mine-admin): 更改FileType接口继承的范型定义在`ma-resource-picker`组件中，`FileType`接口原是继承自`OptionItems<string>`的。此次更改将其改为继承自`MTabsOptionItems<string>`，以利用`MTabsOptionItems`中定义的更准确的属性，提高代码的可维护性和一致性。 ([98df98c](https://github.com/mineadmin/mineadmin/commit/98df98cd988e2ccb228a4d66e9eba70e537188a4))
- refactor(tab): 更新类型定义并简化props与emits ([fc18910](https://github.com/mineadmin/mineadmin/commit/fc189106dc10fc7e200f7b85313eec03602d86c4))
- refactor(tab): 将类型定义抽离,方便别的组件调用 ([fb301bb](https://github.com/mineadmin/mineadmin/commit/fb301bba3ad2ff8e79eb5aac0fd911239cced468))
- refactor(mock): 优化附件模拟数据和文件类型处理: ([4faef8c](https://github.com/mineadmin/mineadmin/commit/4faef8cd4bc2fc9651491127525b75dbb4bd9cce))
- refactor(resource-picker): 重命名函数参数以提高清晰度:资源选择器组件中的函数参数从`item`重命名为`resource`，以提高代码的可读性和可维护性。相关功能包括切换选择、检查是否选中、预览能力和双击事件处理的函数现在使用更清晰的参数命名。上下文菜单中的操作也进行了类似的重命名处理。 ([9993b41](https://github.com/mineadmin/mineadmin/commit/9993b412b1b4d61f2905de228525b08f32f2cf50))
- refactor(resource-picker): 抽离图像预览功能至useImageViewer钩子: ([34506a0](https://github.com/mineadmin/mineadmin/commit/34506a0e78930cee2efcd7c1564c6b60f966c888))
- refactor(resource-picker): 双击行为待定: ([813f55c](https://github.com/mineadmin/mineadmin/commit/813f55c8ada6b6e8bee40cd4dfe18f663ded1422))
- refactor(resource-picker): 非固定分页大小及平滑加载动画 ([a356816](https://github.com/mineadmin/mineadmin/commit/a35681628b646cdc02eaeb4438afe4ce26f284f0))
- refactor(resource-picker): 重构资源选择器面板的样式和结构，以适应动态内容高度。通过修改CSS类应用和调整元素间距，实现了资源项目的均匀分布。此外，还优化了滚动条组件的使用，以提高在长列表上的性能。 ([a78c4ca](https://github.com/mineadmin/mineadmin/commit/a78c4ca57180ad59ab13bf050cf7a775ee8573a0))
- refactor(cleanup): 删除遗漏ModuleRequest类 ([93023c9](https://github.com/mineadmin/mineadmin/commit/93023c90d9e6b55e9fd885922f14e7134ff2249e))
- refactor(cleanup): 删除自动生成的注释 @throws 等优化可读性 PS：后续还会持续优化 ([49be9fb](https://github.com/mineadmin/mineadmin/commit/49be9fbd319f6b3dd05051adb2d420ac1740d72e))
- refactor(structure): rename framework components for consistency ([#310](https://github.com/mineadmin/mineadmin/pull/310)) ([99dff8e](https://github.com/mineadmin/mineadmin/commit/99dff8e98c1f683493d0bcbafe4c8c4ec1aa143c))

### 🔧 Others
- chore(package): 更新最新依赖，适配最新版i18n ([#471](https://github.com/mineadmin/mineadmin/pull/471)) ([1b73f61](https://github.com/mineadmin/mineadmin/commit/1b73f6190b6cd54b7c8782822e27c11f2be60615))
- chore(pro-table): 修复table参数覆盖问题导致参数失效 ([#461](https://github.com/mineadmin/mineadmin/pull/461)) ([7ccd472](https://github.com/mineadmin/mineadmin/commit/7ccd472cac7f7865f1a84db61f431f872966cb3d))
- chore(package): 更新pro-table和search，修复几处小问题 ([#459](https://github.com/mineadmin/mineadmin/pull/459)) ([2091a3a](https://github.com/mineadmin/mineadmin/commit/2091a3a40356f4659e03e970a426a1e50383b499))
- styles(layout): 优化布局样式 ([#457](https://github.com/mineadmin/mineadmin/pull/457)) ([b3c5d8b](https://github.com/mineadmin/mineadmin/commit/b3c5d8b328722840d3d8c883e3c35b4c0ea6064b))
- chore(front): 优化修改插件钩子参数 ([#456](https://github.com/mineadmin/mineadmin/pull/456)) ([a50284c](https://github.com/mineadmin/mineadmin/commit/a50284c41b6418c70bf59ea289822041819f0f6b))
- chore(other): 修改类型定义，优化默认静态路由 ([#454](https://github.com/mineadmin/mineadmin/pull/454)) ([305ad7f](https://github.com/mineadmin/mineadmin/commit/305ad7f3c68795bb8286776dbf9d0ad91f6ce398))
- chore(ma-pro-table): 更新ma-pro-table到1.0.27版，pnpm-lock加入忽略列表 ([#434](https://github.com/mineadmin/mineadmin/pull/434)) ([f1b74fd](https://github.com/mineadmin/mineadmin/commit/f1b74fd656131b1d56bbac80c86d6ca603e71ecd))
- styles(样式优化) ([#428](https://github.com/mineadmin/mineadmin/pull/428)) ([bb1f17e](https://github.com/mineadmin/mineadmin/commit/bb1f17e947cb970b8caaed5e10fdf73a8b94f619))
- chore(tab): 变更标签页新增时检查的key，优化布局文件 ([#425](https://github.com/mineadmin/mineadmin/pull/425)) ([aa6474a](https://github.com/mineadmin/mineadmin/commit/aa6474aafdb36cb5b867e457dee913be88252feb))
- chore(tsconfig): 开启默认允许js ([#423](https://github.com/mineadmin/mineadmin/pull/423)) ([40e2b24](https://github.com/mineadmin/mineadmin/commit/40e2b24cacd5003d5de844048d8773148f5ab7e4))
- styles(menu): 优化子级菜单激活后，父级菜单高亮 ([#419](https://github.com/mineadmin/mineadmin/pull/419)) ([df8ec2c](https://github.com/mineadmin/mineadmin/commit/df8ec2cc1e099df99039ea253d1936d3c39e7d0b))
- chore(front): 退出清除所有tab，ma-dialog新增操作快捷键，ma-tree增加 buttons插槽 ([#410](https://github.com/mineadmin/mineadmin/pull/410)) ([0fd8605](https://github.com/mineadmin/mineadmin/commit/0fd86053dbe6d6a6d7589e0b0e49b1820428091e))
- chore(ma-form,ma-search)：升级俩组件依赖，优化一些方法入参 ([#393](https://github.com/mineadmin/mineadmin/pull/393)) ([4716ffe](https://github.com/mineadmin/mineadmin/commit/4716ffe337a4566b632edc442916a313283b75bc))
- chore(pro-table)：升级到1.0.22版，组件增加 `getProTableOptions()` 方法 ([#384](https://github.com/mineadmin/mineadmin/pull/384)) ([c73725e](https://github.com/mineadmin/mineadmin/commit/c73725e2cdf0886fbc882940f952b0680dadac86))
- chore(@mineadmin/pro-table): 升级pro-table到1.0.21，pro-table重构工具栏，开放api可以插件形式扩展: `useProTableToolbar()` ([#378](https://github.com/mineadmin/mineadmin/pull/378)) ([df1df62](https://github.com/mineadmin/mineadmin/commit/df1df62659585e8f5117273c2e12697e2968ac33))
- chore(toolbar): 修改 remove 方法的参数 ([ec639ef](https://github.com/mineadmin/mineadmin/commit/ec639efdb6919ce33146d9e78100b6c5a8a94c4d))
- test: update repository tests and remove unnecessary comments ([9e011a7](https://github.com/mineadmin/mineadmin/commit/9e011a75178073aef15d58366920e83879f45fd4))
- ci: update phpunit configuration and project documentation ([0762acc](https://github.com/mineadmin/mineadmin/commit/0762acc6ef1040dc63a5a2d40ad76d2576d03c80))
- test: adjust code coverage settings and remove @coversNothing annotation ([4782848](https://github.com/mineadmin/mineadmin/commit/4782848ac50c1cb220664af87d4ef6cbbd56bb4e))
- chore(应用商店) ([ea409f1](https://github.com/mineadmin/mineadmin/commit/ea409f17b85fa44f3fda45f4d26dc7af60b31538))
- style(variables) ([d41144f](https://github.com/mineadmin/mineadmin/commit/d41144fc07dbf78c801e4b3dc597724127e32186))
- chore(整理文件) ([0332ceb](https://github.com/mineadmin/mineadmin/commit/0332cebc7f5b6faca16a0694053fbdd873693974))
- chore(更新依赖) ([4271e6e](https://github.com/mineadmin/mineadmin/commit/4271e6e6d6c50203640cae113f484c5ad25f46c9))
- chore(http)：优化 ([bfa16e6](https://github.com/mineadmin/mineadmin/commit/bfa16e60d648a0c4993ad37ee23b3f7bcff9fe34))
- chore(workbench)：优化工作台快捷入口路由正则匹配 ([9385ecf](https://github.com/mineadmin/mineadmin/commit/9385ecf76e1ea859ee049c67613c3176b4b006bc))
- chore(优化404页面，移除user center假功能) ([12499c9](https://github.com/mineadmin/mineadmin/commit/12499c97ed545dd6f4ad00ee98272fb86c33969e))
- test(repository): add abstract test repository and implement attachment, login log, and operation log repository tests ([3e304db](https://github.com/mineadmin/mineadmin/commit/3e304dbec1b718a9a39f3eb4b9c4a55abafab910))
- chore(优化banner布局下，显隐toolbar的按钮位置) ([728efd8](https://github.com/mineadmin/mineadmin/commit/728efd82504657485863fbab22216f34183b9f80))
- chore(Settings)：后台前端设置新增持久化保存 ([371d7d6](https://github.com/mineadmin/mineadmin/commit/371d7d6c85cfa796a872aa7976063e1cc8377d75))
- chore(Menu)：优化菜单在树结构里显示所属类型 ([80013fa](https://github.com/mineadmin/mineadmin/commit/80013fae643009b37e3b20ed02ad536920f05d74))
- chore(.env.example 增加 APP_URL 参数) ([e28380f](https://github.com/mineadmin/mineadmin/commit/e28380f96e281cad20191e64dc6c872cc642e3ff))
- chore(移除useScrollTo，使用vueuse里的替代) ([7d50a8a](https://github.com/mineadmin/mineadmin/commit/7d50a8a8b8fd50779ca7321ffa1d2151d8d391fb))
- chore(移除打包时进行eslint检查) ([1852f53](https://github.com/mineadmin/mineadmin/commit/1852f538a7dea16afd3d17424d0db0269bf6e062))
- chore(菜单、权限标识优化修改-2) ([409282c](https://github.com/mineadmin/mineadmin/commit/409282cc6ef3be4ccd0cf415319882b633f741c7))
- chore(菜单、权限标识优化修改) ([e38144a](https://github.com/mineadmin/mineadmin/commit/e38144ad3b0561cfbeab4a46a8dbde911eab4d93))
- chore(优化修改) ([5c0f9ee](https://github.com/mineadmin/mineadmin/commit/5c0f9eeb1351060e0d9cd900489a18f269d95053))
- chore(优化) ([0c4d0e3](https://github.com/mineadmin/mineadmin/commit/0c4d0e31ba3256c622eb72f43182d450f623ce8b))
- chore(framework): 优化操作日志记录机制、优化获取 client ip 逻辑 ([d91a24c](https://github.com/mineadmin/mineadmin/commit/d91a24cca10db12cffbb29ddc04ada3c1909d13d))
- chore(repository): 优化仓储层设计，增加 page hook 机制 ([21c9012](https://github.com/mineadmin/mineadmin/commit/21c9012b2ebb38d6512107c77ab85eadf890d519))
- chore(watch): 优化热重启 ([b8333bb](https://github.com/mineadmin/mineadmin/commit/b8333bb21d1d1ae53f9c37cdd1aeaa8166c1b7c0))
- chore(jwt): 增加 jwt 过期错误，优化用户登录日志表结构 ([f545335](https://github.com/mineadmin/mineadmin/commit/f54533511cee5a53984283c9060c42431fe634a5))
- chore(登录) ([5408c74](https://github.com/mineadmin/mineadmin/commit/5408c743a3ed9f24b6ead092f9a5674be79f1fb1))
- chore(上传) ([82c4cc4](https://github.com/mineadmin/mineadmin/commit/82c4cc423ed00ed28aa957d2f2852c9f1a7d1775))
- chore(优化用户栏): mixed布局下，新增按钮控制用户栏显隐 ([d8aaf41](https://github.com/mineadmin/mineadmin/commit/d8aaf416328ceccabca326983b17ee61905ed3c7))
- chore(layouts): 优化混合布局 ([a5a21cd](https://github.com/mineadmin/mineadmin/commit/a5a21cd1fae3fa8ffc6966350bad0beb098125b7))
- style(字体样式): 📦 更新字体设置以提升可读性和美观度 ([2e286f8](https://github.com/mineadmin/mineadmin/commit/2e286f8bf928d4f2581c0c20e802ef81b40fd335))
- chore(适配vue3.5.x) ([2e3bcf0](https://github.com/mineadmin/mineadmin/commit/2e3bcf0629f92fc27814d65c95031065299eb26e))
- chore(package): 更新依赖 ([cc33d16](https://github.com/mineadmin/mineadmin/commit/cc33d16fe907920f46acce3772ea85e8fc4ba0fd))
- chore(i18n): 📦 优化多语言资源加载策略 ([4f8a150](https://github.com/mineadmin/mineadmin/commit/4f8a150406a53870a3e149a06ff912baf1d6d727))
- chore(http.ts): 优化401状态防抖策略 ([c3975be](https://github.com/mineadmin/mineadmin/commit/c3975be3ab4af1b92e09382f392408649693f49c))
- chore(min-admin/cell-render): 优化页面展示 ([ae06af2](https://github.com/mineadmin/mineadmin/commit/ae06af2d08646e58247cc53eb43d366839f033fe))
- chore(min-admin/cell-render): 调整请求地址 ([63ccbfa](https://github.com/mineadmin/mineadmin/commit/63ccbfad4c948fe8c8c87f1b91b1a4cc4b7d69cb))
- test(cell-render) ([88c4bd3](https://github.com/mineadmin/mineadmin/commit/88c4bd36ec8bf44f9b2461808ee5666dc9de5d7e))
- test(pro-table): 测试 pro-table ([4b9c259](https://github.com/mineadmin/mineadmin/commit/4b9c2594c12db4086e4b139092c7660e787ce494))
- test: ✅ 表格 ([67978a9](https://github.com/mineadmin/mineadmin/commit/67978a909cd59b494740e087c4bde5633b157ea1))
- test(pro-table) ([aa9bc3a](https://github.com/mineadmin/mineadmin/commit/aa9bc3a6f9ddba8be0148e5595841abff0660725))
- chore(update vue): 🔨 升级vue到3.5，组件适配优化 ([b01295b](https://github.com/mineadmin/mineadmin/commit/b01295b0b3cce05320d274b2138f09ebd981a44c))
- chore(更新、优化、修复): 🔨 更新依赖，优化样式、修复一些类型错误 ([59c39b9](https://github.com/mineadmin/mineadmin/commit/59c39b9f8d084ee329ef1383d7be83e7be6a9c7f))
- chore(更新依赖): 🔨 @mineadmin/form ([1a4ba71](https://github.com/mineadmin/mineadmin/commit/1a4ba71346fc18c446b9b038137ff6e10a84a394))
- chore(更新依赖): 🔨 @mineadmin/table ([875ffd6](https://github.com/mineadmin/mineadmin/commit/875ffd6bfa02db6358a9b3ccb097b6afb505fb6f))
- chore(测试 ssh推送): ✅ 测试 ssh推送 ([2f1f257](https://github.com/mineadmin/mineadmin/commit/2f1f25716117b2fc0ea863fa5188f8a428345860))
- test(resource-picker): ✅ css资源项视觉更新：更改背景色和优化样式 ([0084733](https://github.com/mineadmin/mineadmin/commit/0084733f9027409fd2f22e1caecf50ba5aac3518))
- test(resource-picker): ✅ 资源选择器面板 enhancement ([43a1dd3](https://github.com/mineadmin/mineadmin/commit/43a1dd30d1f68e33482d85bb6a4e81fde55b2f05))
- test(resource-picker): ✅ 在资源选择器组件中添加对话框页脚 ([52adbec](https://github.com/mineadmin/mineadmin/commit/52adbec8766c2088c80d3235c826a21dd8489d99))
- test(resource-picker): ✅ 在welcome页面添加组件,方便调试 ([9d9ba55](https://github.com/mineadmin/mineadmin/commit/9d9ba5572fcee44d055e2cef2e5af65269072314))

## [v2.0.3] - 2024-10-06

### 🐛 Bug Fixes
- fix(setting_config_seeder): 确保config_select_data为数组类型 ([#341](https://github.com/mineadmin/mineadmin/pull/341)) ([a79bae6](https://github.com/mineadmin/mineadmin/commit/a79bae66fb966bcee1c7fb3f76edc15eb1109474))
- fix(修复下载插件失败): 修复因space与插件名拼接重叠导致无法下载 ([#319](https://github.com/mineadmin/mineadmin/pull/319)) ([3d796b4](https://github.com/mineadmin/mineadmin/commit/3d796b4165f9e8d815bf7e309afafb908e42def8))
- fix: 修复ClearLogCrontab 清空所有日志时开启事务导致失败 和 watch 脚本php8.2警告 ([#309](https://github.com/mineadmin/mineadmin/pull/309)) ([33d001a](https://github.com/mineadmin/mineadmin/commit/33d001ac1fd84a2966730f4821cb2bd8e706d811))
- fix dept level bug ([#306](https://github.com/mineadmin/mineadmin/pull/306)) ([3f11af4](https://github.com/mineadmin/mineadmin/commit/3f11af44badfa475925b949fa02c330db1ef8d98))

## [v2.0.2] - 2024-07-09

### 🐛 Bug Fixes
- fixed ([#292](https://github.com/mineadmin/mineadmin/pull/292)) ([a954d96](https://github.com/mineadmin/mineadmin/commit/a954d960ba880b916296ddf6bbe598d0e45d61f2))

## [v2.0.1.1] - 2024-06-23

## [v2.0.1] - 2024-06-22

### ✨ Features
- feat: 字典分类新增list接口 ([2f3ab3c](https://github.com/mineadmin/mineadmin/commit/2f3ab3cf72b00c0157bcef5f674cad952fd32d13))
- feat Auto-generated changelog ([#271](https://github.com/mineadmin/mineadmin/pull/271)) ([1abf182](https://github.com/mineadmin/mineadmin/commit/1abf182bb76607bcce1a433306b135d4cf2ccec4))
- feat: 后台可视化应用市场插件 ([87b8a0b](https://github.com/mineadmin/mineadmin/commit/87b8a0b8eca06193ffa61ae7af00462b465bfe34))
- feat: add appStore plugin ([1482197](https://github.com/mineadmin/mineadmin/commit/148219750394fb49726b877e087477ceb812b274))
- feat: `common/commmon.php` add has_permission() and has_role() two function for helpes ([dbe16e0](https://github.com/mineadmin/mineadmin/commit/dbe16e057d1bea2a511794b2d6b4252360226c17))

### 🐛 Bug Fixes
- fix 修改用户更新个人资料过滤不存在的字段、修复手机号码验证传递null会报错的问题 ([#283](https://github.com/mineadmin/mineadmin/pull/283)) ([b3c98d5](https://github.com/mineadmin/mineadmin/commit/b3c98d57addb76e7fe78581efa142f70d5fb8eda))
- fix:修复变量注释不自动提示问题 ([#277](https://github.com/mineadmin/mineadmin/pull/277)) ([9d501bb](https://github.com/mineadmin/mineadmin/commit/9d501bba76542594671e49824e5f421787bba315))
- fixed: 修复因 storage_mode是int类型获取文件系统不正确导致无法删除OSS或其他文件系统文件 ([#275](https://github.com/mineadmin/mineadmin/pull/275)) ([001d656](https://github.com/mineadmin/mineadmin/commit/001d6562269a6af29e995cba31038b98b3c72056))
- fix 解决部门树状数据时重复问题 ([#274](https://github.com/mineadmin/mineadmin/pull/274)) ([4b64fe1](https://github.com/mineadmin/mineadmin/commit/4b64fe190c18d5c0c7c0c21211a7754f81877b02))
- fix: Optimise user filtering logic ([#250](https://github.com/mineadmin/mineadmin/pull/250)) ([f88f2ef](https://github.com/mineadmin/mineadmin/commit/f88f2ef3e5a0810b3a2ff698dfb7ad452a46fb4b))
- fix: 更新模块json里的order属性，市场插件up ([f3ed750](https://github.com/mineadmin/mineadmin/commit/f3ed75095f789717e637c89213a47959541b216f))
- fix: created table migrations allow nullable ([a728b26](https://github.com/mineadmin/mineadmin/commit/a728b2667cb58a9265d8a9ac5db4faff6a3c63c8))

### ♻️ Code Refactoring
- refactor ([25b1818](https://github.com/mineadmin/mineadmin/commit/25b1818b04ea928cf9cafd653e06a3929dce20fe))

## [v2.0.0-beta.6] - 2024-04-11

## [v2.0.0-beta.5] - 2024-03-04

### 🐛 Bug Fixes
- fix: monitor service ([3d1a741](https://github.com/mineadmin/mineadmin/commit/3d1a741886c6ba9b6ffa2652120e25f23a1a2f95))

## [v2.0.0-beta.4] - 2024-02-02

### 🐛 Bug Fixes
- fixed gitignore ([d526a56](https://github.com/mineadmin/mineadmin/commit/d526a567978365c022623ad3d26cdb2fcad97a87))
- fixed pest ([f45ffd7](https://github.com/mineadmin/mineadmin/commit/f45ffd788404daea17826e9b85351683cda2e3eb))
- fix: return value for save function. ([cdf4500](https://github.com/mineadmin/mineadmin/commit/cdf450042f8e7e3c082c473c003ec1de04d2a6b3))

## [v2.0.0-beta.3] - 2024-01-31

### 🐛 Bug Fixes
- fixed library version suport latest ([1bbe0ff](https://github.com/mineadmin/mineadmin/commit/1bbe0ffb71a8896fd2555534e5bf1cb4631ffd79))
- fix: 修改handleSearch条件检查函数，以及适配主键支持雪花ID和UUID ([800c06e](https://github.com/mineadmin/mineadmin/commit/800c06e56c5e9a11b6686d938bec95d98b661721))

### 🔧 Others
- test.yml add redis and mysql ([8056ef8](https://github.com/mineadmin/mineadmin/commit/8056ef8cc3b0f7630e3fa9c16d2c57c2ded659f8))

## [v2.0.0-beta.2] - 2024-01-25

### ✨ Features
- feature hyperf issue template ([7dbb095](https://github.com/mineadmin/mineadmin/commit/7dbb0952ddbebf8e8ee194be330fdc24121dbd37))
- feature workflows dockerfile ([3486e82](https://github.com/mineadmin/mineadmin/commit/3486e82f9e5f0fc40d81eb76a10c0fa23251e56b))

### 🐛 Bug Fixes
- fixed mine-core ([0f740ae](https://github.com/mineadmin/mineadmin/commit/0f740aea28cf75a9688a61af5729135d414f0d11))
- fixed cacheable annotation ([7a24d46](https://github.com/mineadmin/mineadmin/commit/7a24d46f3a2e862bd1e65f82878272b8772a6800))
- fixed dockerfile ([d429f3e](https://github.com/mineadmin/mineadmin/commit/d429f3e728e1ce41bd45765fee9ee8ef40821333))
- fix: dockerfile 改为用 hyperf官方镜像 ([f2373e9](https://github.com/mineadmin/mineadmin/commit/f2373e9cbf238b2ff2ddc368528598887144931e))
- fix: readme ([c2148f7](https://github.com/mineadmin/mineadmin/commit/c2148f7f524ce2dac6470ef6d91ee1d7fb53b4bd))

## [v2.0.0-beta.1] - 2024-01-21

### 🐛 Bug Fixes
- fix common.php autoload ([61eab10](https://github.com/mineadmin/mineadmin/commit/61eab101054efbc25d16ea143082558d765ec352))
- fix env ([0ecd10b](https://github.com/mineadmin/mineadmin/commit/0ecd10b71c5dde7e17a5ff1f68c9b28dee1ca46f))
- fix 在线用户统计优化，配置获取缓存逻辑优化 ([f122ba5](https://github.com/mineadmin/mineadmin/commit/f122ba59c6048f100f99b55b6c001ed83f3fe834))
- fix test actions ([668a219](https://github.com/mineadmin/mineadmin/commit/668a2198e3a6921834fb7ea4f52d2006ddb581d5))
- fix: cs-fix排除runtime ([7af7020](https://github.com/mineadmin/mineadmin/commit/7af7020b020cba0fdd172c422a546c2d1756256f))

## [v2.0.0-beta] - 2024-01-20

### 🐛 Bug Fixes
- fix: cs-fix ([fd98ce1](https://github.com/mineadmin/mineadmin/commit/fd98ce103420946f6c59f56655b4f3eb04dd984d))

## [v2.0.0-alpha.5] - 2024-01-19

## [v2.0.0-alpha.4] - 2024-01-13

### ✨ Features
- feat 新的代码生成器 ([e26fe5c](https://github.com/mineadmin/mineadmin/commit/e26fe5ca123bb1d71adf20d788372a1cae37a3bd))

### 🐛 Bug Fixes
- fix: 附件删除菜单权限父ID归属错误问题 ([78035eb](https://github.com/mineadmin/mineadmin/commit/78035eb918c2e68be0dbe35d1a8e300c8ad78c0c))

## [v2.0.0-alpha.3] - 2023-12-23

### 🐛 Bug Fixes
- fix 缓存错误处理 ([d7bb21e](https://github.com/mineadmin/mineadmin/commit/d7bb21e25daaf0458f46fce359db805c1033f26c))

## [v2.0.0-alpha.2] - 2023-12-21

## [v2.0-stable] - 2024-05-30

### ✨ Features
- feat: 后台可视化应用市场插件 ([87b8a0b](https://github.com/mineadmin/mineadmin/commit/87b8a0b8eca06193ffa61ae7af00462b465bfe34))
- feat: add appStore plugin ([1482197](https://github.com/mineadmin/mineadmin/commit/148219750394fb49726b877e087477ceb812b274))

### 🐛 Bug Fixes
- fix: 更新模块json里的order属性，市场插件up ([f3ed750](https://github.com/mineadmin/mineadmin/commit/f3ed75095f789717e637c89213a47959541b216f))

## [v2.0-RC.1] - 2024-05-17

### ✨ Features
- feat: `common/commmon.php` add has_permission() and has_role() two function for helpes ([dbe16e0](https://github.com/mineadmin/mineadmin/commit/dbe16e057d1bea2a511794b2d6b4252360226c17))
- feature hyperf issue template ([7dbb095](https://github.com/mineadmin/mineadmin/commit/7dbb0952ddbebf8e8ee194be330fdc24121dbd37))
- feature workflows dockerfile ([3486e82](https://github.com/mineadmin/mineadmin/commit/3486e82f9e5f0fc40d81eb76a10c0fa23251e56b))
- feat 新的代码生成器 ([e26fe5c](https://github.com/mineadmin/mineadmin/commit/e26fe5ca123bb1d71adf20d788372a1cae37a3bd))
- feature github actions ([6476a28](https://github.com/mineadmin/mineadmin/commit/6476a28b7fa7b48763d91c900ae5a90c92ccf630))

### 🐛 Bug Fixes
- fix: Optimise user filtering logic ([#250](https://github.com/mineadmin/mineadmin/pull/250)) ([f88f2ef](https://github.com/mineadmin/mineadmin/commit/f88f2ef3e5a0810b3a2ff698dfb7ad452a46fb4b))
- fix: created table migrations allow nullable ([a728b26](https://github.com/mineadmin/mineadmin/commit/a728b2667cb58a9265d8a9ac5db4faff6a3c63c8))
- fix: monitor service ([3d1a741](https://github.com/mineadmin/mineadmin/commit/3d1a741886c6ba9b6ffa2652120e25f23a1a2f95))
- fixed gitignore ([d526a56](https://github.com/mineadmin/mineadmin/commit/d526a567978365c022623ad3d26cdb2fcad97a87))
- fixed pest ([f45ffd7](https://github.com/mineadmin/mineadmin/commit/f45ffd788404daea17826e9b85351683cda2e3eb))
- fixed library version suport latest ([1bbe0ff](https://github.com/mineadmin/mineadmin/commit/1bbe0ffb71a8896fd2555534e5bf1cb4631ffd79))
- fix: return value for save function. ([cdf4500](https://github.com/mineadmin/mineadmin/commit/cdf450042f8e7e3c082c473c003ec1de04d2a6b3))
- fix: 修改handleSearch条件检查函数，以及适配主键支持雪花ID和UUID ([800c06e](https://github.com/mineadmin/mineadmin/commit/800c06e56c5e9a11b6686d938bec95d98b661721))
- fixed mine-core ([0f740ae](https://github.com/mineadmin/mineadmin/commit/0f740aea28cf75a9688a61af5729135d414f0d11))
- fixed cacheable annotation ([7a24d46](https://github.com/mineadmin/mineadmin/commit/7a24d46f3a2e862bd1e65f82878272b8772a6800))
- fixed dockerfile ([d429f3e](https://github.com/mineadmin/mineadmin/commit/d429f3e728e1ce41bd45765fee9ee8ef40821333))
- fix: dockerfile 改为用 hyperf官方镜像 ([f2373e9](https://github.com/mineadmin/mineadmin/commit/f2373e9cbf238b2ff2ddc368528598887144931e))
- fix: readme ([c2148f7](https://github.com/mineadmin/mineadmin/commit/c2148f7f524ce2dac6470ef6d91ee1d7fb53b4bd))
- fix common.php autoload ([61eab10](https://github.com/mineadmin/mineadmin/commit/61eab101054efbc25d16ea143082558d765ec352))
- fix env ([0ecd10b](https://github.com/mineadmin/mineadmin/commit/0ecd10b71c5dde7e17a5ff1f68c9b28dee1ca46f))
- fix 在线用户统计优化，配置获取缓存逻辑优化 ([f122ba5](https://github.com/mineadmin/mineadmin/commit/f122ba59c6048f100f99b55b6c001ed83f3fe834))
- fix test actions ([668a219](https://github.com/mineadmin/mineadmin/commit/668a2198e3a6921834fb7ea4f52d2006ddb581d5))
- fix: cs-fix排除runtime ([7af7020](https://github.com/mineadmin/mineadmin/commit/7af7020b020cba0fdd172c422a546c2d1756256f))
- fix: cs-fix ([fd98ce1](https://github.com/mineadmin/mineadmin/commit/fd98ce103420946f6c59f56655b4f3eb04dd984d))
- fix: 附件删除菜单权限父ID归属错误问题 ([78035eb](https://github.com/mineadmin/mineadmin/commit/78035eb918c2e68be0dbe35d1a8e300c8ad78c0c))
- fix 缓存错误处理 ([d7bb21e](https://github.com/mineadmin/mineadmin/commit/d7bb21e25daaf0458f46fce359db805c1033f26c))
- fix Annotation ([89123af](https://github.com/mineadmin/mineadmin/commit/89123af847dde49758556c3d50d6cf17528ca0c5))
- fix v2.0.0-alpha.2 ([3ae8ae3](https://github.com/mineadmin/mineadmin/commit/3ae8ae38fad770f431943dc1fc9474023946b3a7))
- fix 缓存改为注解形式 ([21cc920](https://github.com/mineadmin/mineadmin/commit/21cc92098b10c650049f3d84ded55d72bbe98275))
- fix: code generator ([5bb743f](https://github.com/mineadmin/mineadmin/commit/5bb743ffa00f2e800542fbc3f7bab092764e887f))
- fix: old syntax ([ea47da4](https://github.com/mineadmin/mineadmin/commit/ea47da4f7362a783d2460196632f71c6b1ce89cf))
- fix library version ([5ebf0fb](https://github.com/mineadmin/mineadmin/commit/5ebf0fb321cc4f5fe99d6c6eb3f8183cb0d611ea))
- fix 适配3.1 ([e211f74](https://github.com/mineadmin/mineadmin/commit/e211f745ffd9548c44236531d739be54a260c9a2))
- fix 优化提示 ([6480ead](https://github.com/mineadmin/mineadmin/commit/6480eada83557d5cfa027aa2d6fea69ef61e6668))
- fix: 适配支持Hyperf 3.1 ([12d3953](https://github.com/mineadmin/mineadmin/commit/12d3953c34fb98198c9110b2588e189323ae8850))

### ♻️ Code Refactoring
- refactor ([25b1818](https://github.com/mineadmin/mineadmin/commit/25b1818b04ea928cf9cafd653e06a3929dce20fe))

### 🔧 Others
- test.yml add redis and mysql ([8056ef8](https://github.com/mineadmin/mineadmin/commit/8056ef8cc3b0f7630e3fa9c16d2c57c2ded659f8))
- style: all code ([07c457d](https://github.com/mineadmin/mineadmin/commit/07c457dae843f401477c9c5f8fc39af6669df002))

## [v1.4.13] - 2023-12-17

### 🐛 Bug Fixes
- fix 统一子包 ([970f6fb](https://github.com/mineadmin/mineadmin/commit/970f6fbbb08fe7722be0846c966af28eeab981f2))

## [v1.4.12] - 2024-01-20

### 🐛 Bug Fixes
- fix ide error ([92c50fe](https://github.com/mineadmin/mineadmin/commit/92c50fe94614ec85598e3ebcd202b1da76d48c81))

## [v1.4.11] - 2024-01-20

### 🐛 Bug Fixes
- fix 语法错误 ([3b22cae](https://github.com/mineadmin/mineadmin/commit/3b22caec4da4cc7e4cd67c1abe12d4366ade1699))

## [v1.4.1] - 2024-01-19

### ✨ Features
- feat 新增php-cs-fixer配置.本次升级涉及大量代码风格重构.勿无脑升级 ([46861cc](https://github.com/mineadmin/mineadmin/commit/46861cc197b057f4e1e63973431dbf30b44dbc7a))
- feat: 升级mine-core到1.5.5版本，代码生成的mapper用 filled 替换 blank ([1aa57a3](https://github.com/mineadmin/mineadmin/commit/1aa57a31c68fdd25991fbcb93c798e57fea55ed8))
- feat: 升级mine-core到1.5.4版本，修复已知bug，新增表主键支持雪花ID、uuid，自动识别主键类型 ([f733026](https://github.com/mineadmin/mineadmin/commit/f7330267fa853bdd5a4f30f988b404cea74122ac))

### 🐛 Bug Fixes
- fix: mapper的filled函数替换blank函数，blank函数意思有歧义。`注意1.5.4的mine-core升级上来后，需要自行批量替换blank函数` ([30517df](https://github.com/mineadmin/mineadmin/commit/30517dfd95b9c9a550249c1660cb4cae12e15766))
- fix: 附件删除菜单权限父ID归属错误问题 ([f6ec802](https://github.com/mineadmin/mineadmin/commit/f6ec802da160f298b0a3a8cf3b03d214747b886b))
- fix: 修复Seeder php 8.2语法兼容性 ([c0229de](https://github.com/mineadmin/mineadmin/commit/c0229de00abf0ce72a89191fbbe695e283f590a0))
- fix: README.md ([fe71651](https://github.com/mineadmin/mineadmin/commit/fe71651fc960d8d033deec4d35c0356b58f2ccb5))

## [v1.4.x] - 2023-12-08

### ✨ Features
- feat: UploadController.php 新增 showFile 方法，适配前端hash输入图片或文件 ([f029c32](https://github.com/mineadmin/mineadmin/commit/f029c32b2c283e62356f6013acbc2216b6fc0376))
- feat: 新增sys_config() 和 sys_group_config() 函数 ([15985cf](https://github.com/mineadmin/mineadmin/commit/15985cff0eb228b6c490039e2dc65d177853e744))

### 🐛 Bug Fixes
- fix: 修复拼写错误 ([d24f85b](https://github.com/mineadmin/mineadmin/commit/d24f85ba5ca2fa28a1c12f64a7a7d1a6ed3bef85))
- fix: 修复获取配置文件信息拼写错误 ([d24f21a](https://github.com/mineadmin/mineadmin/commit/d24f21aebeb855fbe5c6c51efacef0f2cfa84469))
- fix: 修复查询字段名称写错的问题 ([a76e35b](https://github.com/mineadmin/mineadmin/commit/a76e35b7498483948c3a0100b039d5ee0ce67dc4))
- fix: 修复个人中心修改头像和资料会导致平权修改数据的漏洞 ([016f175](https://github.com/mineadmin/mineadmin/commit/016f175c1d53483da2e721a42a3e3a261f23cec6))
- fix: 修复个人中心获取登录和操作日志可平权查看数据的漏洞 ([12e5ca1](https://github.com/mineadmin/mineadmin/commit/12e5ca1d4bb229e44eed9a8c8c3d1287fb11d398))
- fix: 开启日志记录requestId ([4b04cad](https://github.com/mineadmin/mineadmin/commit/4b04cad52397e6172dbf8e4b72bf4b720c0cab74))
- fix: 修复上传的文件若在回收站则无法重新上传的问题 ([22267d1](https://github.com/mineadmin/mineadmin/commit/22267d1896567cf769fd3d559bd61413f4b2812d))
- fix: 修复更新系统配置时，提示 `config_select_data` 未定义的bug ([0cd2743](https://github.com/mineadmin/mineadmin/commit/0cd274349ae91c4f0558217e18e933533d82e627))
- fix: 创建setting_datasource表之前，检查表是否存在 ([be0d45d](https://github.com/mineadmin/mineadmin/commit/be0d45d0050fc839b2f1e7d859406723f4d83b83))
- fix: 修复命名空间大小写问题 ([f63b596](https://github.com/mineadmin/mineadmin/commit/f63b5960e923497b37e6b14aa09330f07c18ec1c))
- fix: 修复系统配置对复选框支持不友好的问题 ([db6a335](https://github.com/mineadmin/mineadmin/commit/db6a3356554316d1e60992f82ae41e19925005b5))
- fix: 部门编辑报错 ([38293ff](https://github.com/mineadmin/mineadmin/commit/38293ff8997e99b03029038825052756e626d0d7))
- fix: 修复代码生成树表后添加数据时报错的问题 ps: composer update xmo/mine-core ([409000f](https://github.com/mineadmin/mineadmin/commit/409000fffcce6316e1cd33fd5e1c201bd9a3bca3))
- fix allow_roles field cast to array ([33f6fd1](https://github.com/mineadmin/mineadmin/commit/33f6fd1e24e8801dce307490222bd179477782a6))

### ♻️ Code Refactoring
- refactor: 更新mine-core核心包 ([059702d](https://github.com/mineadmin/mineadmin/commit/059702db5371a7995de0a3a259e939b033ab8a76))
- refactor: 关闭 buffer 输出大小限制 ([77731cf](https://github.com/mineadmin/mineadmin/commit/77731cfc33fd6a9d919836d6abd90cfc6f379587))
- refactor: 优化在开启数据权限后非超管账号添加部门时可选择父级部门为自身所在部门 ([d08e2db](https://github.com/mineadmin/mineadmin/commit/d08e2db3dc687a9e61fc03410033bd39bb713f85))
- refactor: 优化登录提示错误信息防止用户被枚举 ([25fa4d3](https://github.com/mineadmin/mineadmin/commit/25fa4d345888952deec2c5b8ca61b17819eb8128))
- refactor: 感谢最菜兄优化 `bin/reboot.php`，mine-core的amqp队列监听器移动到 App\System\Listener 下，升级mine-core ([b3362d9](https://github.com/mineadmin/mineadmin/commit/b3362d9cc6b0eae6f068796d94a2c0b6002901af))
- refactor: 业务里的isset替换为 !empty ([f724295](https://github.com/mineadmin/mineadmin/commit/f724295a2ef10c080331f5dcdbed7a9a302e9fec))
- refactor ([6fc5f01](https://github.com/mineadmin/mineadmin/commit/6fc5f01a2e2955b3b1a1818749dea4f745fc1b55))
- refactor: 优化api抛出异常信息提示 ([1ef5d1e](https://github.com/mineadmin/mineadmin/commit/1ef5d1e0c0d2929e47e6614a6787e46304f82359))

## [v1.3.3] - 2023-06-02

### ✨ Features
- feat: 新增通用接口功能，变更版本为1.3.3 ([555de3e](https://github.com/mineadmin/mineadmin/commit/555de3e8ca846680901a82dce4a1321ff0d220d0))

### 🐛 Bug Fixes
- fix: php 8.2 兼容 swoole>=4.4.6 PHP Deprecated: Swoole\Event::rshutdown(): ([13b9295](https://github.com/mineadmin/mineadmin/commit/13b92952ea36f7071be72125cbde0a5a7f031577))
- fix: 修复mine改成package后，生成代码时找不到模板文件 ([21c9ef7](https://github.com/mineadmin/mineadmin/commit/21c9ef76f2b8ef5664dbcf95ef6234d496711278))
- fix: 修复用户列表在使用表前缀后报表不存在的问题 ([c980163](https://github.com/mineadmin/mineadmin/commit/c980163a92cd3d3c8b44b9761c049e150c9934ca))

### ♻️ Code Refactoring
- refactor: 优化watch支持8.2，兼容8.0和8.1 ([8bcb7a4](https://github.com/mineadmin/mineadmin/commit/8bcb7a4a41beb8c6df67e7613b6be49e71a6a214))

## [v1.3.0] - 2023-05-25

### ✨ Features
- feat: mine 剥离 ([0e23e71](https://github.com/mineadmin/mineadmin/commit/0e23e719ecf7548141f0ecbbd2b3b4a5580104fd))

### 🐛 Bug Fixes
- fix: 移除配置项添加时，后端验证value必填 ([38d40fc](https://github.com/mineadmin/mineadmin/commit/38d40fcc265e2c85c5bb12a2809e0ee5cdba37d5))
- fix and refactor ([e92b6c5](https://github.com/mineadmin/mineadmin/commit/e92b6c5e615cd325a540ae07a712f5d178a52f61))

### ♻️ Code Refactoring
- refactor ([b83abb4](https://github.com/mineadmin/mineadmin/commit/b83abb47f1f529ad199e96444cf05bfb9605968d))

## [v1.2.1] - 2023-05-23

### ✨ Features
- feat: 安装项目命令新增下载前端项目代码到 ./web 目录下 ([80dab0e](https://github.com/mineadmin/mineadmin/commit/80dab0e7accb7deb5851a9783d30b61fd7dd643f))
- feat: 增加重启服务脚本 ([06870c1](https://github.com/mineadmin/mineadmin/commit/06870c13ba16efb4b67a76165b5ac72fa8da0517))
- feat: 添加敏感词过滤，后续待添加管理功能 ([228e1b7](https://github.com/mineadmin/mineadmin/commit/228e1b763d5d10ee797562cc2251f5f31d4314fb))

### 🐛 Bug Fixes
- fix：修复数据迁移表名错误 fix：安装时没有清空超管默认部门数据 ([1130d25](https://github.com/mineadmin/mineadmin/commit/1130d2560723934fb74428fb1020c9a3e79b41d4))
- fix: 修复用户列表在查询部门用户的情况下子部门出现重复数据问题 ([d47c768](https://github.com/mineadmin/mineadmin/commit/d47c768258cd775cff13e35d43cfabe9ee05942e))
- fix trim value is null ([9bc0682](https://github.com/mineadmin/mineadmin/commit/9bc0682242720649611a07a158bb57c2ac9c3495))
- fix aarch64 systeminfo ([8f92f27](https://github.com/mineadmin/mineadmin/commit/8f92f2716c14573040b606b2849fcaa7115da5fb))
- fix: 执行定时任务命令方式时make无法实例化ArrayInput问题 ([d1b2f1d](https://github.com/mineadmin/mineadmin/commit/d1b2f1d615799989c29ee472f476f88745e39c56))
- fix: 修复pr ([d6821f2](https://github.com/mineadmin/mineadmin/commit/d6821f2eba837de852df0c4a6df670b44f440488))
- fix php version info ([547c1c0](https://github.com/mineadmin/mineadmin/commit/547c1c0aea350d1db27f980ef82cab455b3f5ceb))

### ♻️ Code Refactoring
- refactor `changStatus.stub` template ([459ced9](https://github.com/mineadmin/mineadmin/commit/459ced9e8d5a0f5cc2465ea976c69d03b217b8cf))
- refactor ([8164d5c](https://github.com/mineadmin/mineadmin/commit/8164d5c29cd4dfff1429c40a4322bcaa0adcd9bf))
- refactor(用户管理): 选择部门后下级部门人员不展示 ([1332825](https://github.com/mineadmin/mineadmin/commit/1332825663455f0331ee430649d352193f6f59de))
- refactor: 优化安装时下载前端项目逻辑 ([a912001](https://github.com/mineadmin/mineadmin/commit/a912001167cee7aef25b7f2d3ec67cb03be26610))
- refactor: 定制任务的删除缓存注解移到service上面去 ([c21c586](https://github.com/mineadmin/mineadmin/commit/c21c586bbc8d7339b706b31b1cfb51d5874248ce))
- refactor: 获取必应背景图片改为使用file_get_contents函数，增强兼容性 ([9965eb7](https://github.com/mineadmin/mineadmin/commit/9965eb71bc3898def4140385cbbdc2e455f58c0b))

## [v1.2.0] - 2023-04-13

### ✨ Features
- feat: 新增获取每日必应背景图 ([b4fc22c](https://github.com/mineadmin/mineadmin/commit/b4fc22cfc2ec83dafda33f3c3776c32d11ef463f))
- feat: 新增数据源功能，代码生成器可以生成远程表结构到本地数据库 ([c639e91](https://github.com/mineadmin/mineadmin/commit/c639e91f81b70eff60c11392f0013b7b17db6b2a))
- feat ([31076d9](https://github.com/mineadmin/mineadmin/commit/31076d922d90228f1867f701a1ca8ddb81039ca9))
- feat: 抛出的异常全部允许跨域 ([9b3970b](https://github.com/mineadmin/mineadmin/commit/9b3970b4a8aeb3f1e2b22ea671b5b7a801fe73de))
- feat：数据源crud ([b668146](https://github.com/mineadmin/mineadmin/commit/b668146c1f8a87954c0a8bdaa8b234bd3ed74fa4))
- feat: 添加数据源表迁移文件 ([a00c52f](https://github.com/mineadmin/mineadmin/commit/a00c52f1757b1793cfaa41d805baa8e0d44b0a46))
- feat: 添加迁移回滚命令 mine:migrate-rollback --name=模块名 ([295a682](https://github.com/mineadmin/mineadmin/commit/295a6826cb0fefd3a4e38b5a7a1ebc6ae5601441))
- feat: 代码生成器添加tag页配置方式及选项 ([fe2874c](https://github.com/mineadmin/mineadmin/commit/fe2874c7cf162ee11bf00a4c4bce7da46e485569))
- feat: 新增附件列表无权限验证接口 ([1207f0b](https://github.com/mineadmin/mineadmin/commit/1207f0bd8770baacdcfb104b070cddb206122a18))
- feat: 代码生成条件增加in和not in ([4ccd4c7](https://github.com/mineadmin/mineadmin/commit/4ccd4c7d8ccc58a8c1283e79268a09d0fefc260d))

### 🐛 Bug Fixes
- fix: 修复Auth注解只获取method参数的，未获取class的bug ([df597fd](https://github.com/mineadmin/mineadmin/commit/df597fd4f08f87124f7b10112c8b6c91feceabe8))
- fix: 修复古老时期因使用雪花id造成队列消息的一个小bug ([05120ef](https://github.com/mineadmin/mineadmin/commit/05120ef1ed45ecf05653e6bc03fc4d08a12d1b1d))
- update mine/Helper/MineCaptcha.php ([6ed715d](https://github.com/mineadmin/mineadmin/commit/6ed715dc4edde7728a319d3e5726bcc3f5c424af))
- fix: 修复应用未绑定某接口也可以访问的bug ([5c6bbdc](https://github.com/mineadmin/mineadmin/commit/5c6bbdc98e3383f936639abfe95b742800acac2c))

### ♻️ Code Refactoring
- refactor: 优化excel导出支持超过26列 ([4e4c2dd](https://github.com/mineadmin/mineadmin/commit/4e4c2dd7d10217f49632a404a76b1819b3cfeadd))
- refactor: 多模块按order排序，避免初始化安装系统时，先安装自定义模块 感谢 @裘牧 贡献的代码 ([2aa3d71](https://github.com/mineadmin/mineadmin/commit/2aa3d7150db516cea80d79025561f6bcfcc83a4a))
- refactor: api文档接口增加分组列表数据 ([2854a04](https://github.com/mineadmin/mineadmin/commit/2854a043efd1eca1bea0e9fd4741709bdbd3298f))

## [v1.1.1] - 2023-03-02

### ✨ Features
- feat: 系统添加默认允许跨域 ([c2e7a8f](https://github.com/mineadmin/mineadmin/commit/c2e7a8f03d2de4bb22db83cb71558bd8eabfe427))

### 🐛 Bug Fixes
- fix apple m1 cpu info and memory info ([e691c51](https://github.com/mineadmin/mineadmin/commit/e691c51dc3dc0dfdfff33366d00252327deb35f8))

### ♻️ Code Refactoring
- refactor: 使用前端默认的搜索标签宽度 ([c63f807](https://github.com/mineadmin/mineadmin/commit/c63f8078bcc6bd528f9c07ca9710af46e429e5f0))
- refactor: 适配新版前端crud组件 ([6b495ee](https://github.com/mineadmin/mineadmin/commit/6b495eecbd74193673b72ee9dee2f1814c96a203))
- refactor: 优化删除方法，兼容删除缓存数据 ([5d77e3d](https://github.com/mineadmin/mineadmin/commit/5d77e3d551172da433f58ad5446d2a8ec139617b))
- refactor: 定时任务、字典相关再更新、删除等操作后更新缓存 ([2e19362](https://github.com/mineadmin/mineadmin/commit/2e1936235b5a51bf4f35c02908462b6765daf35b))
- refactor:代码生成器模型模板加上类型 ([e567ab0](https://github.com/mineadmin/mineadmin/commit/e567ab0e62400b9a3e0746d8af8d6b2aa87db778))

## [v1.1.0] - 2023-01-04

### ✨ Features
- feat: 用户改为多部门，部门新增设置领导。PS:使用 php bin/hyperf.php mine:update 升级数据库 ([55ace59](https://github.com/mineadmin/mineadmin/commit/55ace59c14c9333aa07aa3110f71cffdc9f0d93e))
- feat: 增强DTO导出注解，支持字典翻译功能 ([7556e52](https://github.com/mineadmin/mineadmin/commit/7556e5284619f5e143d38ec4cc2fcda92a04354f))
- feat: 新增几个接口 ([2e9d03b](https://github.com/mineadmin/mineadmin/commit/2e9d03b830647badc01c21774add1536f84bf2a5))
- feat: 代码生成器新增排序选项 ([bd179fc](https://github.com/mineadmin/mineadmin/commit/bd179fcfa7dad0d5421e4e5ce031e47c386aaabe))
- feat: 新增用户删除监听，删除用户同时让当前活跃用户状态失效 ([55eae42](https://github.com/mineadmin/mineadmin/commit/55eae42493831fc6ad30890f296c2386152a6311))
- feat: 新增用户添加和删除事件 ([c68a7e4](https://github.com/mineadmin/mineadmin/commit/c68a7e4ccd94ea049286f77d6433a1e4307d9b57))

### 🐛 Bug Fixes
- fix: 修复新增用户可能出现的请求超时 ([b86f10d](https://github.com/mineadmin/mineadmin/commit/b86f10d8107c6f733850e25cd4c3da6fde4f9687))
- fix: 配置保存报类型错误的问题 ([cec974d](https://github.com/mineadmin/mineadmin/commit/cec974d6b0c17357924c19263ab2c39441bfe068))
- fix: 修复数据权限本部门及子部门使用like查询的问题 ([896deca](https://github.com/mineadmin/mineadmin/commit/896deca5fecfc83f9128c7271aa26415fdec015b))
- fix: 修复saveAspect在定时任务下，无法获取头信息导致任务执行失败 ([c7b602e](https://github.com/mineadmin/mineadmin/commit/c7b602e7544a817874f9e4b0a549111e04964a79))
- fix: 修复 DemoApi.php 调用函数名称拼写错误问 ([c4bc571](https://github.com/mineadmin/mineadmin/commit/c4bc5710aa7bc5aa4cd311ab97d7bd1378730409))
- fix: 修复本部门和子部门数据权限bug以及获取部门树数据非顶级不显示bug ([ee18aa5](https://github.com/mineadmin/mineadmin/commit/ee18aa5f47350dd3885b1b34b388413cd8744066))
- fix: 修复获取当前用户部门id返回值类型不对问题 ([a223d61](https://github.com/mineadmin/mineadmin/commit/a223d6168f575fb5a56256cb458ea2e925e85dec))
- fix:修复类型不匹配导致选择文件存储类型失败 ([5b12759](https://github.com/mineadmin/mineadmin/commit/5b127594279c1332656f7ae3579bbeca42cb71dd))
- fix：修复上传功能找不到配置项问题 ([b7e08a3](https://github.com/mineadmin/mineadmin/commit/b7e08a34d1b0b0f09cd6b6c12f26b6f3251c75a4))
- fix: 修复之前改表字段名导致选择上传存储模式失效问题 ([fb77739](https://github.com/mineadmin/mineadmin/commit/fb77739218a81642311ba6934b56c63b8e5cdf0f))
- fix：修复代码生成器生成密码组件formType属性错误问题 ([59f3d53](https://github.com/mineadmin/mineadmin/commit/59f3d53f890026159da6a9fec313f91c7814972d))
- fix: 修复优化Mine.php造成获取模块地址出错 ([a1f384a](https://github.com/mineadmin/mineadmin/commit/a1f384a930060a6d4e6e872a544537acb02c4276))
- fix: 修复服务监控某些情况下可能出现变量未定义 ([d0aaf6a](https://github.com/mineadmin/mineadmin/commit/d0aaf6a6f72f2eebaa76088a913d6356e6036c75))
- fix: 修复记录删除定时任务日志时，业务名称为未定义菜单问题 ([02962d3](https://github.com/mineadmin/mineadmin/commit/02962d355889244b806454ef31ecbc05a18fb6ff))
- fix: 修复生成控制器生成用户选择器组件名字拼写错误 ([8564a0a](https://github.com/mineadmin/mineadmin/commit/8564a0aed7a5ea7b034919af83d576efd9a47949))
- fix: 修复代码生成器生成日期时间组件为范围选择的时候无效问题 ([2cf5cb2](https://github.com/mineadmin/mineadmin/commit/2cf5cb2b93087902fb1c5279459bd670e50ca0e3))
- fix: 修复生成控制器注释生成错误 ([a9fd121](https://github.com/mineadmin/mineadmin/commit/a9fd121e90cb0fe616f0138675a017455128189c))
- fix: 修复缓存监控和在线用户权限标识代码问题 ([b62c973](https://github.com/mineadmin/mineadmin/commit/b62c9739ff711a103e7869d0a5c40acc574e51e8))
- fix: 修复代码生成器未勾选必填项无效问题 ([55785f5](https://github.com/mineadmin/mineadmin/commit/55785f58ecf4f0879436358f52d6ed65440dc585))
- fix:修复代码生成器生成删除接口拼写错误 ([f6d1002](https://github.com/mineadmin/mineadmin/commit/f6d100264efaa36da9af8bf0257d7d714dd621cf))
- fix: 修复代码生成器配置显示组件无效问题 ([b11fc19](https://github.com/mineadmin/mineadmin/commit/b11fc19c8197acb2f8db36a4820ba87a6d9a79a0))
- fix: 修复代码生成器生成日期时间组件某些选项无效的问题 ([d03b35d](https://github.com/mineadmin/mineadmin/commit/d03b35d407f89ebd2601cfda8704c4b303f4566f))
- fix: 修复phpoffice驱动设置宽度无效和报数组未定义问题 ([10c2535](https://github.com/mineadmin/mineadmin/commit/10c2535621862b28298b4e1b52dfa05797a3aad7))
- fix:修复代码生成器少个花括号 ([bc071aa](https://github.com/mineadmin/mineadmin/commit/bc071aacdc105e06c2ff00893b37aacef1bcb2aa))
- fix:修复代码生成器缺失生成导入和导出 ([d7d5402](https://github.com/mineadmin/mineadmin/commit/d7d54028a4e4cc5b7dbf752eaf29e8cd35fbe9ed))

### ♻️ Code Refactoring
- refactor ([11af477](https://github.com/mineadmin/mineadmin/commit/11af477459b5b5e6f190163da66c3f309ddef7ec))
- refactor: 更新获取模块名称的逻辑，修复notice提示的问题 ([d0be1f7](https://github.com/mineadmin/mineadmin/commit/d0be1f7acd1cf3767aabe38abf111cf7e11411ec))
- refactor: 更新获取模块名称大小写逻辑 ([66128b2](https://github.com/mineadmin/mineadmin/commit/66128b2fe2c550826321bf889b4b0aa4cc7c58c1))
- refactor: 设置菜单权限获取数据逻辑变更，只能看到自己有权限的菜单 ([52d6bdc](https://github.com/mineadmin/mineadmin/commit/52d6bdce996d313e0829b37781df2bf4f1421499))
- refactor: 配置值适配最新的ma-form组件props ([5759776](https://github.com/mineadmin/mineadmin/commit/5759776d3fca124297d6c1ec44c6c8adf9ce2530))
- refactor: 优化表迁移创建结构 ([10c0ca8](https://github.com/mineadmin/mineadmin/commit/10c0ca8ea52b8b60485373ee1c8e80a3a6a23a5a))
- refactor: 优化代码生成器 ([7504422](https://github.com/mineadmin/mineadmin/commit/7504422cf999c4f6e3060c3c4758814aaf4709e1))
- refactor: 优化服务监控报错则返回无法获取信息 ([42ce9bc](https://github.com/mineadmin/mineadmin/commit/42ce9bc0f5fd1cdedc55e3d98d4d179b8f431eea))
- refactor: 更新README ([5553707](https://github.com/mineadmin/mineadmin/commit/5553707c9ff5913bb19cf2d90afd946ac7d2fe5d))
- refactor: 新增和保存切面优化 ([8af65a8](https://github.com/mineadmin/mineadmin/commit/8af65a8c40de07e1c23ab9c49d477a9342fa2343))
- refactor: 优化清空缓存 ([3ba8148](https://github.com/mineadmin/mineadmin/commit/3ba81485cdab5a486ab34b1fc6347b2d98fbe41f))
- refactor: 优化API返回数据类型格式，由自己控制 ([e260b91](https://github.com/mineadmin/mineadmin/commit/e260b913559eac1bdde85c02c0d6a6338f2c20f9))
- refactor: 优化获取缓存前缀赋予null默认值 ([b0e4514](https://github.com/mineadmin/mineadmin/commit/b0e4514fff4b4cba7878042911d54c09bf5d0a55))
- refactor: 升级依赖 ([95b785b](https://github.com/mineadmin/mineadmin/commit/95b785b4619d585cb38a4b3259a88c3d1627c84a))
- refactor: 优化Mine.php、MineController.php，删除$this->app()方法，内部调用改用container()函数 ([676f659](https://github.com/mineadmin/mineadmin/commit/676f65998d6fa836b9c68db614588e2976c9611c))
- refactor: 优化删除附件逻辑，改为删除附件时判断附件当时使用的存储方式。感谢@maimake贡献的代码 ([1d41597](https://github.com/mineadmin/mineadmin/commit/1d415972811de8046d99103a1423fbd3e2bfcbc0))
- refactor: README.md ([89d6e45](https://github.com/mineadmin/mineadmin/commit/89d6e45cc3a66f86ef36472b27e1b5243cd11eb1))
- refactor: vue生成模板更新 ([11848ff](https://github.com/mineadmin/mineadmin/commit/11848ff892ee0ce54cef1ab709fdbcfac295dafd))
- refactor: 代码生成器控制器生成列表添加父级权限 ([500be11](https://github.com/mineadmin/mineadmin/commit/500be11218505cb99e6f99bdf9cbabc564501534))
- refactor: 更新docker-composer ([51b6788](https://github.com/mineadmin/mineadmin/commit/51b6788200579af171c57eb839e3a73831bcfe0e))
- refactor: 更新所有权限注解的权限代码，以适配菜单只勾选父级菜单 ([ba44280](https://github.com/mineadmin/mineadmin/commit/ba44280d2510beae4e75b1a6c21b210193f46a84))
- refactor: 导出excel添加参数 ([9bda61a](https://github.com/mineadmin/mineadmin/commit/9bda61ad8e7f25e382d6530d8d81c79bf30bbaf3))
- refactor: 公共控制器增加登录和操作日志方法 ([f849b95](https://github.com/mineadmin/mineadmin/commit/f849b95e6f8cf0b528e0c4d26fbface2fb35bfec))
- refactor: 更换回阿里云的源 ([3125b07](https://github.com/mineadmin/mineadmin/commit/3125b07d87d36ed73385e371ab0b1e8be20c244b))
- refactor: 更新依赖 ([7716f3a](https://github.com/mineadmin/mineadmin/commit/7716f3a2a0ab82521e1ae2f257c86c0a0de1cb4e))

## [v1.0.0] - 2022-08-24

### 🐛 Bug Fixes
- fix:修复代码生成一些配置无效问题 ([de1c39c](https://github.com/mineadmin/mineadmin/commit/de1c39cad23703bd683051166eb9c32a5dd62147))
- fix:修复代码生成缺少操作列参数 ([8b7b00e](https://github.com/mineadmin/mineadmin/commit/8b7b00e58988248d92d3f4cc921cc404a8119724))
- fix:修复时间搜索拼字符串缺少空格导致搜索为空 ([5e007d6](https://github.com/mineadmin/mineadmin/commit/5e007d65e5b92a252dd62e4c59cdf91021dc71fd))
- fix: 修复生成index.vue缺少引入Message ([8bafd25](https://github.com/mineadmin/mineadmin/commit/8bafd254236e4475726a726ede5bbb7a6ffafda6))
- fix: 还原api文件被意外替换 ([26032ac](https://github.com/mineadmin/mineadmin/commit/26032ac0706167c6490f62f4491b19498106f7df))
- fix： 移除无用指令 ([a9f7396](https://github.com/mineadmin/mineadmin/commit/a9f73960643ae2273381c89396933b950db34a8e))
- fix: 修复 inatall 安装失败 ([060f30b](https://github.com/mineadmin/mineadmin/commit/060f30b000a708f8ce2f5e0add68c769c9c43a5e))
- fix: 修复拼写错误 ([8160c8e](https://github.com/mineadmin/mineadmin/commit/8160c8e7bc5072a0e588e3b6e09d2edd3d5dfebf))
- fix: 兼容 php 8.1 ([6515688](https://github.com/mineadmin/mineadmin/commit/651568879703a52d334da026423121511c590613))
- fix: 兼容php8.1 ([6fe71ad](https://github.com/mineadmin/mineadmin/commit/6fe71ada2cb9f78558dfb3bf3428994986e89691))
- fixed the multiple primary key ([aafbc14](https://github.com/mineadmin/mineadmin/commit/aafbc14f40e2924984ae9f0e6642c80625e3d2b6))

## [v0.7.2] - 2022-06-02

## [v0.7.1] - 2022-05-31

## [v0.7.0] - 2022-04-26

## [v0.6.3] - 2022-04-12

## [v0.6.2] - 2022-04-07

## [2.0.0-alpha.1] - 2023-12-19

### ✨ Features
- feat: UploadController.php 新增 showFile 方法，适配前端hash输入图片或文件 ([f029c32](https://github.com/mineadmin/mineadmin/commit/f029c32b2c283e62356f6013acbc2216b6fc0376))
- feat: 新增sys_config() 和 sys_group_config() 函数 ([15985cf](https://github.com/mineadmin/mineadmin/commit/15985cff0eb228b6c490039e2dc65d177853e744))
- feat: 新增通用接口功能，变更版本为1.3.3 ([555de3e](https://github.com/mineadmin/mineadmin/commit/555de3e8ca846680901a82dce4a1321ff0d220d0))
- feat: mine 剥离 ([0e23e71](https://github.com/mineadmin/mineadmin/commit/0e23e719ecf7548141f0ecbbd2b3b4a5580104fd))
- feat: 安装项目命令新增下载前端项目代码到 ./web 目录下 ([80dab0e](https://github.com/mineadmin/mineadmin/commit/80dab0e7accb7deb5851a9783d30b61fd7dd643f))
- feat: 增加重启服务脚本 ([06870c1](https://github.com/mineadmin/mineadmin/commit/06870c13ba16efb4b67a76165b5ac72fa8da0517))
- feat: 添加敏感词过滤，后续待添加管理功能 ([228e1b7](https://github.com/mineadmin/mineadmin/commit/228e1b763d5d10ee797562cc2251f5f31d4314fb))
- feat: 新增获取每日必应背景图 ([b4fc22c](https://github.com/mineadmin/mineadmin/commit/b4fc22cfc2ec83dafda33f3c3776c32d11ef463f))
- feat: 新增数据源功能，代码生成器可以生成远程表结构到本地数据库 ([c639e91](https://github.com/mineadmin/mineadmin/commit/c639e91f81b70eff60c11392f0013b7b17db6b2a))
- feat ([31076d9](https://github.com/mineadmin/mineadmin/commit/31076d922d90228f1867f701a1ca8ddb81039ca9))
- feat: 抛出的异常全部允许跨域 ([9b3970b](https://github.com/mineadmin/mineadmin/commit/9b3970b4a8aeb3f1e2b22ea671b5b7a801fe73de))
- feat：数据源crud ([b668146](https://github.com/mineadmin/mineadmin/commit/b668146c1f8a87954c0a8bdaa8b234bd3ed74fa4))
- feat: 添加数据源表迁移文件 ([a00c52f](https://github.com/mineadmin/mineadmin/commit/a00c52f1757b1793cfaa41d805baa8e0d44b0a46))
- feat: 添加迁移回滚命令 mine:migrate-rollback --name=模块名 ([295a682](https://github.com/mineadmin/mineadmin/commit/295a6826cb0fefd3a4e38b5a7a1ebc6ae5601441))
- feat: 代码生成器添加tag页配置方式及选项 ([fe2874c](https://github.com/mineadmin/mineadmin/commit/fe2874c7cf162ee11bf00a4c4bce7da46e485569))
- feat: 新增附件列表无权限验证接口 ([1207f0b](https://github.com/mineadmin/mineadmin/commit/1207f0bd8770baacdcfb104b070cddb206122a18))
- feat: 代码生成条件增加in和not in ([4ccd4c7](https://github.com/mineadmin/mineadmin/commit/4ccd4c7d8ccc58a8c1283e79268a09d0fefc260d))
- feat: 系统添加默认允许跨域 ([c2e7a8f](https://github.com/mineadmin/mineadmin/commit/c2e7a8f03d2de4bb22db83cb71558bd8eabfe427))
- feat: 用户改为多部门，部门新增设置领导。PS:使用 php bin/hyperf.php mine:update 升级数据库 ([55ace59](https://github.com/mineadmin/mineadmin/commit/55ace59c14c9333aa07aa3110f71cffdc9f0d93e))
- feat: 增强DTO导出注解，支持字典翻译功能 ([7556e52](https://github.com/mineadmin/mineadmin/commit/7556e5284619f5e143d38ec4cc2fcda92a04354f))
- feat: 新增几个接口 ([2e9d03b](https://github.com/mineadmin/mineadmin/commit/2e9d03b830647badc01c21774add1536f84bf2a5))
- feat: 代码生成器新增排序选项 ([bd179fc](https://github.com/mineadmin/mineadmin/commit/bd179fcfa7dad0d5421e4e5ce031e47c386aaabe))
- feat: 新增用户删除监听，删除用户同时让当前活跃用户状态失效 ([55eae42](https://github.com/mineadmin/mineadmin/commit/55eae42493831fc6ad30890f296c2386152a6311))
- feat: 新增用户添加和删除事件 ([c68a7e4](https://github.com/mineadmin/mineadmin/commit/c68a7e4ccd94ea049286f77d6433a1e4307d9b57))

### 🐛 Bug Fixes
- fix library version ([5ebf0fb](https://github.com/mineadmin/mineadmin/commit/5ebf0fb321cc4f5fe99d6c6eb3f8183cb0d611ea))
- fix 适配3.1 ([e211f74](https://github.com/mineadmin/mineadmin/commit/e211f745ffd9548c44236531d739be54a260c9a2))
- fix 优化提示 ([6480ead](https://github.com/mineadmin/mineadmin/commit/6480eada83557d5cfa027aa2d6fea69ef61e6668))
- fix: 适配支持Hyperf 3.1 ([12d3953](https://github.com/mineadmin/mineadmin/commit/12d3953c34fb98198c9110b2588e189323ae8850))
- fix: 修复拼写错误 ([d24f85b](https://github.com/mineadmin/mineadmin/commit/d24f85ba5ca2fa28a1c12f64a7a7d1a6ed3bef85))
- fix: 修复获取配置文件信息拼写错误 ([d24f21a](https://github.com/mineadmin/mineadmin/commit/d24f21aebeb855fbe5c6c51efacef0f2cfa84469))
- fix: 修复查询字段名称写错的问题 ([a76e35b](https://github.com/mineadmin/mineadmin/commit/a76e35b7498483948c3a0100b039d5ee0ce67dc4))
- fix: 修复个人中心修改头像和资料会导致平权修改数据的漏洞 ([016f175](https://github.com/mineadmin/mineadmin/commit/016f175c1d53483da2e721a42a3e3a261f23cec6))
- fix: 修复个人中心获取登录和操作日志可平权查看数据的漏洞 ([12e5ca1](https://github.com/mineadmin/mineadmin/commit/12e5ca1d4bb229e44eed9a8c8c3d1287fb11d398))
- fix: 开启日志记录requestId ([4b04cad](https://github.com/mineadmin/mineadmin/commit/4b04cad52397e6172dbf8e4b72bf4b720c0cab74))
- fix: 修复上传的文件若在回收站则无法重新上传的问题 ([22267d1](https://github.com/mineadmin/mineadmin/commit/22267d1896567cf769fd3d559bd61413f4b2812d))
- fix: 修复更新系统配置时，提示 `config_select_data` 未定义的bug ([0cd2743](https://github.com/mineadmin/mineadmin/commit/0cd274349ae91c4f0558217e18e933533d82e627))
- fix: 创建setting_datasource表之前，检查表是否存在 ([be0d45d](https://github.com/mineadmin/mineadmin/commit/be0d45d0050fc839b2f1e7d859406723f4d83b83))
- fix: 修复命名空间大小写问题 ([f63b596](https://github.com/mineadmin/mineadmin/commit/f63b5960e923497b37e6b14aa09330f07c18ec1c))
- fix: 修复系统配置对复选框支持不友好的问题 ([db6a335](https://github.com/mineadmin/mineadmin/commit/db6a3356554316d1e60992f82ae41e19925005b5))
- fix: 部门编辑报错 ([38293ff](https://github.com/mineadmin/mineadmin/commit/38293ff8997e99b03029038825052756e626d0d7))
- fix: 修复代码生成树表后添加数据时报错的问题 ps: composer update xmo/mine-core ([409000f](https://github.com/mineadmin/mineadmin/commit/409000fffcce6316e1cd33fd5e1c201bd9a3bca3))
- fix allow_roles field cast to array ([33f6fd1](https://github.com/mineadmin/mineadmin/commit/33f6fd1e24e8801dce307490222bd179477782a6))
- fix: php 8.2 兼容 swoole>=4.4.6 PHP Deprecated: Swoole\Event::rshutdown(): ([13b9295](https://github.com/mineadmin/mineadmin/commit/13b92952ea36f7071be72125cbde0a5a7f031577))
- fix: 修复mine改成package后，生成代码时找不到模板文件 ([21c9ef7](https://github.com/mineadmin/mineadmin/commit/21c9ef76f2b8ef5664dbcf95ef6234d496711278))
- fix: 修复用户列表在使用表前缀后报表不存在的问题 ([c980163](https://github.com/mineadmin/mineadmin/commit/c980163a92cd3d3c8b44b9761c049e150c9934ca))
- fix: 移除配置项添加时，后端验证value必填 ([38d40fc](https://github.com/mineadmin/mineadmin/commit/38d40fcc265e2c85c5bb12a2809e0ee5cdba37d5))
- fix and refactor ([e92b6c5](https://github.com/mineadmin/mineadmin/commit/e92b6c5e615cd325a540ae07a712f5d178a52f61))
- fix：修复数据迁移表名错误 fix：安装时没有清空超管默认部门数据 ([1130d25](https://github.com/mineadmin/mineadmin/commit/1130d2560723934fb74428fb1020c9a3e79b41d4))
- fix: 修复用户列表在查询部门用户的情况下子部门出现重复数据问题 ([d47c768](https://github.com/mineadmin/mineadmin/commit/d47c768258cd775cff13e35d43cfabe9ee05942e))
- fix trim value is null ([9bc0682](https://github.com/mineadmin/mineadmin/commit/9bc0682242720649611a07a158bb57c2ac9c3495))
- fix aarch64 systeminfo ([8f92f27](https://github.com/mineadmin/mineadmin/commit/8f92f2716c14573040b606b2849fcaa7115da5fb))
- fix: 执行定时任务命令方式时make无法实例化ArrayInput问题 ([d1b2f1d](https://github.com/mineadmin/mineadmin/commit/d1b2f1d615799989c29ee472f476f88745e39c56))
- fix: 修复pr ([d6821f2](https://github.com/mineadmin/mineadmin/commit/d6821f2eba837de852df0c4a6df670b44f440488))
- fix php version info ([547c1c0](https://github.com/mineadmin/mineadmin/commit/547c1c0aea350d1db27f980ef82cab455b3f5ceb))
- fix: 修复Auth注解只获取method参数的，未获取class的bug ([df597fd](https://github.com/mineadmin/mineadmin/commit/df597fd4f08f87124f7b10112c8b6c91feceabe8))
- fix: 修复古老时期因使用雪花id造成队列消息的一个小bug ([05120ef](https://github.com/mineadmin/mineadmin/commit/05120ef1ed45ecf05653e6bc03fc4d08a12d1b1d))
- update mine/Helper/MineCaptcha.php ([6ed715d](https://github.com/mineadmin/mineadmin/commit/6ed715dc4edde7728a319d3e5726bcc3f5c424af))
- fix: 修复应用未绑定某接口也可以访问的bug ([5c6bbdc](https://github.com/mineadmin/mineadmin/commit/5c6bbdc98e3383f936639abfe95b742800acac2c))
- fix apple m1 cpu info and memory info ([e691c51](https://github.com/mineadmin/mineadmin/commit/e691c51dc3dc0dfdfff33366d00252327deb35f8))
- fix: 修复新增用户可能出现的请求超时 ([b86f10d](https://github.com/mineadmin/mineadmin/commit/b86f10d8107c6f733850e25cd4c3da6fde4f9687))
- fix: 配置保存报类型错误的问题 ([cec974d](https://github.com/mineadmin/mineadmin/commit/cec974d6b0c17357924c19263ab2c39441bfe068))
- fix: 修复数据权限本部门及子部门使用like查询的问题 ([896deca](https://github.com/mineadmin/mineadmin/commit/896deca5fecfc83f9128c7271aa26415fdec015b))
- fix: 修复saveAspect在定时任务下，无法获取头信息导致任务执行失败 ([c7b602e](https://github.com/mineadmin/mineadmin/commit/c7b602e7544a817874f9e4b0a549111e04964a79))
- fix: 修复 DemoApi.php 调用函数名称拼写错误问 ([c4bc571](https://github.com/mineadmin/mineadmin/commit/c4bc5710aa7bc5aa4cd311ab97d7bd1378730409))
- fix: 修复本部门和子部门数据权限bug以及获取部门树数据非顶级不显示bug ([ee18aa5](https://github.com/mineadmin/mineadmin/commit/ee18aa5f47350dd3885b1b34b388413cd8744066))
- fix: 修复获取当前用户部门id返回值类型不对问题 ([a223d61](https://github.com/mineadmin/mineadmin/commit/a223d6168f575fb5a56256cb458ea2e925e85dec))
- fix:修复类型不匹配导致选择文件存储类型失败 ([5b12759](https://github.com/mineadmin/mineadmin/commit/5b127594279c1332656f7ae3579bbeca42cb71dd))
- fix：修复上传功能找不到配置项问题 ([b7e08a3](https://github.com/mineadmin/mineadmin/commit/b7e08a34d1b0b0f09cd6b6c12f26b6f3251c75a4))
- fix: 修复之前改表字段名导致选择上传存储模式失效问题 ([fb77739](https://github.com/mineadmin/mineadmin/commit/fb77739218a81642311ba6934b56c63b8e5cdf0f))
- fix：修复代码生成器生成密码组件formType属性错误问题 ([59f3d53](https://github.com/mineadmin/mineadmin/commit/59f3d53f890026159da6a9fec313f91c7814972d))
- fix: 修复优化Mine.php造成获取模块地址出错 ([a1f384a](https://github.com/mineadmin/mineadmin/commit/a1f384a930060a6d4e6e872a544537acb02c4276))
- fix: 修复服务监控某些情况下可能出现变量未定义 ([d0aaf6a](https://github.com/mineadmin/mineadmin/commit/d0aaf6a6f72f2eebaa76088a913d6356e6036c75))
- fix: 修复记录删除定时任务日志时，业务名称为未定义菜单问题 ([02962d3](https://github.com/mineadmin/mineadmin/commit/02962d355889244b806454ef31ecbc05a18fb6ff))
- fix: 修复生成控制器生成用户选择器组件名字拼写错误 ([8564a0a](https://github.com/mineadmin/mineadmin/commit/8564a0aed7a5ea7b034919af83d576efd9a47949))
- fix: 修复代码生成器生成日期时间组件为范围选择的时候无效问题 ([2cf5cb2](https://github.com/mineadmin/mineadmin/commit/2cf5cb2b93087902fb1c5279459bd670e50ca0e3))
- fix: 修复生成控制器注释生成错误 ([a9fd121](https://github.com/mineadmin/mineadmin/commit/a9fd121e90cb0fe616f0138675a017455128189c))
- fix: 修复缓存监控和在线用户权限标识代码问题 ([b62c973](https://github.com/mineadmin/mineadmin/commit/b62c9739ff711a103e7869d0a5c40acc574e51e8))
- fix: 修复代码生成器未勾选必填项无效问题 ([55785f5](https://github.com/mineadmin/mineadmin/commit/55785f58ecf4f0879436358f52d6ed65440dc585))
- fix:修复代码生成器生成删除接口拼写错误 ([f6d1002](https://github.com/mineadmin/mineadmin/commit/f6d100264efaa36da9af8bf0257d7d714dd621cf))
- fix: 修复代码生成器配置显示组件无效问题 ([b11fc19](https://github.com/mineadmin/mineadmin/commit/b11fc19c8197acb2f8db36a4820ba87a6d9a79a0))
- fix: 修复代码生成器生成日期时间组件某些选项无效的问题 ([d03b35d](https://github.com/mineadmin/mineadmin/commit/d03b35d407f89ebd2601cfda8704c4b303f4566f))
- fix: 修复phpoffice驱动设置宽度无效和报数组未定义问题 ([10c2535](https://github.com/mineadmin/mineadmin/commit/10c2535621862b28298b4e1b52dfa05797a3aad7))
- fix:修复代码生成器少个花括号 ([bc071aa](https://github.com/mineadmin/mineadmin/commit/bc071aacdc105e06c2ff00893b37aacef1bcb2aa))
- fix:修复代码生成器缺失生成导入和导出 ([d7d5402](https://github.com/mineadmin/mineadmin/commit/d7d54028a4e4cc5b7dbf752eaf29e8cd35fbe9ed))
- fix:修复代码生成一些配置无效问题 ([de1c39c](https://github.com/mineadmin/mineadmin/commit/de1c39cad23703bd683051166eb9c32a5dd62147))
- fix:修复代码生成缺少操作列参数 ([8b7b00e](https://github.com/mineadmin/mineadmin/commit/8b7b00e58988248d92d3f4cc921cc404a8119724))
- fix:修复时间搜索拼字符串缺少空格导致搜索为空 ([5e007d6](https://github.com/mineadmin/mineadmin/commit/5e007d65e5b92a252dd62e4c59cdf91021dc71fd))
- fix: 修复生成index.vue缺少引入Message ([8bafd25](https://github.com/mineadmin/mineadmin/commit/8bafd254236e4475726a726ede5bbb7a6ffafda6))
- fix: 还原api文件被意外替换 ([26032ac](https://github.com/mineadmin/mineadmin/commit/26032ac0706167c6490f62f4491b19498106f7df))
- fix： 移除无用指令 ([a9f7396](https://github.com/mineadmin/mineadmin/commit/a9f73960643ae2273381c89396933b950db34a8e))
- fix: 修复 inatall 安装失败 ([060f30b](https://github.com/mineadmin/mineadmin/commit/060f30b000a708f8ce2f5e0add68c769c9c43a5e))
- fix: 兼容 php 8.1 ([6515688](https://github.com/mineadmin/mineadmin/commit/651568879703a52d334da026423121511c590613))
- fix: 兼容php8.1 ([6fe71ad](https://github.com/mineadmin/mineadmin/commit/6fe71ada2cb9f78558dfb3bf3428994986e89691))
- fixed the multiple primary key ([aafbc14](https://github.com/mineadmin/mineadmin/commit/aafbc14f40e2924984ae9f0e6642c80625e3d2b6))

### ♻️ Code Refactoring
- refactor: 更新mine-core核心包 ([059702d](https://github.com/mineadmin/mineadmin/commit/059702db5371a7995de0a3a259e939b033ab8a76))
- refactor: 关闭 buffer 输出大小限制 ([77731cf](https://github.com/mineadmin/mineadmin/commit/77731cfc33fd6a9d919836d6abd90cfc6f379587))
- refactor: 优化在开启数据权限后非超管账号添加部门时可选择父级部门为自身所在部门 ([d08e2db](https://github.com/mineadmin/mineadmin/commit/d08e2db3dc687a9e61fc03410033bd39bb713f85))
- refactor: 优化登录提示错误信息防止用户被枚举 ([25fa4d3](https://github.com/mineadmin/mineadmin/commit/25fa4d345888952deec2c5b8ca61b17819eb8128))
- refactor: 感谢最菜兄优化 `bin/reboot.php`，mine-core的amqp队列监听器移动到 App\System\Listener 下，升级mine-core ([b3362d9](https://github.com/mineadmin/mineadmin/commit/b3362d9cc6b0eae6f068796d94a2c0b6002901af))
- refactor: 业务里的isset替换为 !empty ([f724295](https://github.com/mineadmin/mineadmin/commit/f724295a2ef10c080331f5dcdbed7a9a302e9fec))
- refactor ([6fc5f01](https://github.com/mineadmin/mineadmin/commit/6fc5f01a2e2955b3b1a1818749dea4f745fc1b55))
- refactor: 优化api抛出异常信息提示 ([1ef5d1e](https://github.com/mineadmin/mineadmin/commit/1ef5d1e0c0d2929e47e6614a6787e46304f82359))
- refactor: 优化watch支持8.2，兼容8.0和8.1 ([8bcb7a4](https://github.com/mineadmin/mineadmin/commit/8bcb7a4a41beb8c6df67e7613b6be49e71a6a214))
- refactor `changStatus.stub` template ([459ced9](https://github.com/mineadmin/mineadmin/commit/459ced9e8d5a0f5cc2465ea976c69d03b217b8cf))
- refactor(用户管理): 选择部门后下级部门人员不展示 ([1332825](https://github.com/mineadmin/mineadmin/commit/1332825663455f0331ee430649d352193f6f59de))
- refactor: 优化安装时下载前端项目逻辑 ([a912001](https://github.com/mineadmin/mineadmin/commit/a912001167cee7aef25b7f2d3ec67cb03be26610))
- refactor: 定制任务的删除缓存注解移到service上面去 ([c21c586](https://github.com/mineadmin/mineadmin/commit/c21c586bbc8d7339b706b31b1cfb51d5874248ce))
- refactor: 获取必应背景图片改为使用file_get_contents函数，增强兼容性 ([9965eb7](https://github.com/mineadmin/mineadmin/commit/9965eb71bc3898def4140385cbbdc2e455f58c0b))
- refactor: 优化excel导出支持超过26列 ([4e4c2dd](https://github.com/mineadmin/mineadmin/commit/4e4c2dd7d10217f49632a404a76b1819b3cfeadd))
- refactor: 多模块按order排序，避免初始化安装系统时，先安装自定义模块 感谢 @裘牧 贡献的代码 ([2aa3d71](https://github.com/mineadmin/mineadmin/commit/2aa3d7150db516cea80d79025561f6bcfcc83a4a))
- refactor: api文档接口增加分组列表数据 ([2854a04](https://github.com/mineadmin/mineadmin/commit/2854a043efd1eca1bea0e9fd4741709bdbd3298f))
- refactor: 使用前端默认的搜索标签宽度 ([c63f807](https://github.com/mineadmin/mineadmin/commit/c63f8078bcc6bd528f9c07ca9710af46e429e5f0))
- refactor: 适配新版前端crud组件 ([6b495ee](https://github.com/mineadmin/mineadmin/commit/6b495eecbd74193673b72ee9dee2f1814c96a203))
- refactor: 优化删除方法，兼容删除缓存数据 ([5d77e3d](https://github.com/mineadmin/mineadmin/commit/5d77e3d551172da433f58ad5446d2a8ec139617b))
- refactor: 定时任务、字典相关再更新、删除等操作后更新缓存 ([2e19362](https://github.com/mineadmin/mineadmin/commit/2e1936235b5a51bf4f35c02908462b6765daf35b))
- refactor:代码生成器模型模板加上类型 ([e567ab0](https://github.com/mineadmin/mineadmin/commit/e567ab0e62400b9a3e0746d8af8d6b2aa87db778))
- refactor: 更新获取模块名称的逻辑，修复notice提示的问题 ([d0be1f7](https://github.com/mineadmin/mineadmin/commit/d0be1f7acd1cf3767aabe38abf111cf7e11411ec))
- refactor: 更新获取模块名称大小写逻辑 ([66128b2](https://github.com/mineadmin/mineadmin/commit/66128b2fe2c550826321bf889b4b0aa4cc7c58c1))
- refactor: 设置菜单权限获取数据逻辑变更，只能看到自己有权限的菜单 ([52d6bdc](https://github.com/mineadmin/mineadmin/commit/52d6bdce996d313e0829b37781df2bf4f1421499))
- refactor: 配置值适配最新的ma-form组件props ([5759776](https://github.com/mineadmin/mineadmin/commit/5759776d3fca124297d6c1ec44c6c8adf9ce2530))
- refactor: 优化表迁移创建结构 ([10c0ca8](https://github.com/mineadmin/mineadmin/commit/10c0ca8ea52b8b60485373ee1c8e80a3a6a23a5a))
- refactor: 优化代码生成器 ([7504422](https://github.com/mineadmin/mineadmin/commit/7504422cf999c4f6e3060c3c4758814aaf4709e1))
- refactor: 优化服务监控报错则返回无法获取信息 ([42ce9bc](https://github.com/mineadmin/mineadmin/commit/42ce9bc0f5fd1cdedc55e3d98d4d179b8f431eea))
- refactor: 更新README ([5553707](https://github.com/mineadmin/mineadmin/commit/5553707c9ff5913bb19cf2d90afd946ac7d2fe5d))
- refactor: 新增和保存切面优化 ([8af65a8](https://github.com/mineadmin/mineadmin/commit/8af65a8c40de07e1c23ab9c49d477a9342fa2343))
- refactor: 优化清空缓存 ([3ba8148](https://github.com/mineadmin/mineadmin/commit/3ba81485cdab5a486ab34b1fc6347b2d98fbe41f))
- refactor: 优化API返回数据类型格式，由自己控制 ([e260b91](https://github.com/mineadmin/mineadmin/commit/e260b913559eac1bdde85c02c0d6a6338f2c20f9))
- refactor: 优化获取缓存前缀赋予null默认值 ([b0e4514](https://github.com/mineadmin/mineadmin/commit/b0e4514fff4b4cba7878042911d54c09bf5d0a55))
- refactor: 升级依赖 ([95b785b](https://github.com/mineadmin/mineadmin/commit/95b785b4619d585cb38a4b3259a88c3d1627c84a))
- refactor: 优化Mine.php、MineController.php，删除$this->app()方法，内部调用改用container()函数 ([676f659](https://github.com/mineadmin/mineadmin/commit/676f65998d6fa836b9c68db614588e2976c9611c))
- refactor: 优化删除附件逻辑，改为删除附件时判断附件当时使用的存储方式。感谢@maimake贡献的代码 ([1d41597](https://github.com/mineadmin/mineadmin/commit/1d415972811de8046d99103a1423fbd3e2bfcbc0))
- refactor: README.md ([89d6e45](https://github.com/mineadmin/mineadmin/commit/89d6e45cc3a66f86ef36472b27e1b5243cd11eb1))
- refactor: vue生成模板更新 ([11848ff](https://github.com/mineadmin/mineadmin/commit/11848ff892ee0ce54cef1ab709fdbcfac295dafd))
- refactor: 代码生成器控制器生成列表添加父级权限 ([500be11](https://github.com/mineadmin/mineadmin/commit/500be11218505cb99e6f99bdf9cbabc564501534))
- refactor: 更新docker-composer ([51b6788](https://github.com/mineadmin/mineadmin/commit/51b6788200579af171c57eb839e3a73831bcfe0e))
- refactor: 更新所有权限注解的权限代码，以适配菜单只勾选父级菜单 ([ba44280](https://github.com/mineadmin/mineadmin/commit/ba44280d2510beae4e75b1a6c21b210193f46a84))
- refactor: 导出excel添加参数 ([9bda61a](https://github.com/mineadmin/mineadmin/commit/9bda61ad8e7f25e382d6530d8d81c79bf30bbaf3))
- refactor: 公共控制器增加登录和操作日志方法 ([f849b95](https://github.com/mineadmin/mineadmin/commit/f849b95e6f8cf0b528e0c4d26fbface2fb35bfec))
- refactor: 更换回阿里云的源 ([3125b07](https://github.com/mineadmin/mineadmin/commit/3125b07d87d36ed73385e371ab0b1e8be20c244b))
- refactor: 更新依赖 ([7716f3a](https://github.com/mineadmin/mineadmin/commit/7716f3a2a0ab82521e1ae2f257c86c0a0de1cb4e))


<!-- Links -->
[Unreleased]: https://github.com/mineadmin/mineadmin/compare/v3.0.6...HEAD
[v.1.1.2]: https://github.com/mineadmin/mineadmin/compare/v3.0.6...v.1.1.2
[v3.0.6]: https://github.com/mineadmin/mineadmin/compare/v3.0.5...v3.0.6
[v3.0.5]: https://github.com/mineadmin/mineadmin/compare/v3.0.4...v3.0.5
[v3.0.4]: https://github.com/mineadmin/mineadmin/compare/v3.0.3...v3.0.4
[v3.0.3]: https://github.com/mineadmin/mineadmin/compare/v3.0.2...v3.0.3
[v3.0.2]: https://github.com/mineadmin/mineadmin/compare/v3.0.1...v3.0.2
[v3.0.1]: https://github.com/mineadmin/mineadmin/compare/v3.0-RC...v3.0.1
[v3.0-RC]: https://github.com/mineadmin/mineadmin/compare/v3.0...v3.0-RC
[v3.0]: https://github.com/mineadmin/mineadmin/compare/v2.0.3...v3.0
[v2.0.3]: https://github.com/mineadmin/mineadmin/compare/v2.0.2...v2.0.3
[v2.0.2]: https://github.com/mineadmin/mineadmin/compare/v2.0.1.1...v2.0.2
[v2.0.1.1]: https://github.com/mineadmin/mineadmin/compare/v2.0.1...v2.0.1.1
[v2.0.1]: https://github.com/mineadmin/mineadmin/compare/v2.0.0-beta.6...v2.0.1
[v2.0.0-beta.6]: https://github.com/mineadmin/mineadmin/compare/v2.0.0-beta.5...v2.0.0-beta.6
[v2.0.0-beta.5]: https://github.com/mineadmin/mineadmin/compare/v2.0.0-beta.4...v2.0.0-beta.5
[v2.0.0-beta.4]: https://github.com/mineadmin/mineadmin/compare/v2.0.0-beta.3...v2.0.0-beta.4
[v2.0.0-beta.3]: https://github.com/mineadmin/mineadmin/compare/v2.0.0-beta.2...v2.0.0-beta.3
[v2.0.0-beta.2]: https://github.com/mineadmin/mineadmin/compare/v2.0.0-beta.1...v2.0.0-beta.2
[v2.0.0-beta.1]: https://github.com/mineadmin/mineadmin/compare/v2.0.0-beta...v2.0.0-beta.1
[v2.0.0-beta]: https://github.com/mineadmin/mineadmin/compare/v2.0.0-alpha.5...v2.0.0-beta
[v2.0.0-alpha.5]: https://github.com/mineadmin/mineadmin/compare/v2.0.0-alpha.4...v2.0.0-alpha.5
[v2.0.0-alpha.4]: https://github.com/mineadmin/mineadmin/compare/v2.0.0-alpha.3...v2.0.0-alpha.4
[v2.0.0-alpha.3]: https://github.com/mineadmin/mineadmin/compare/v2.0.0-alpha.2...v2.0.0-alpha.3
[v2.0.0-alpha.2]: https://github.com/mineadmin/mineadmin/compare/v2.0-stable...v2.0.0-alpha.2
[v2.0-stable]: https://github.com/mineadmin/mineadmin/compare/v2.0-RC.1...v2.0-stable
[v2.0-RC.1]: https://github.com/mineadmin/mineadmin/compare/v1.4.13...v2.0-RC.1
[v1.4.13]: https://github.com/mineadmin/mineadmin/compare/v1.4.12...v1.4.13
[v1.4.12]: https://github.com/mineadmin/mineadmin/compare/v1.4.11...v1.4.12
[v1.4.11]: https://github.com/mineadmin/mineadmin/compare/v1.4.1...v1.4.11
[v1.4.1]: https://github.com/mineadmin/mineadmin/compare/v1.4.x...v1.4.1
[v1.4.x]: https://github.com/mineadmin/mineadmin/compare/v1.3.3...v1.4.x
[v1.3.3]: https://github.com/mineadmin/mineadmin/compare/v1.3.0...v1.3.3
[v1.3.0]: https://github.com/mineadmin/mineadmin/compare/v1.2.1...v1.3.0
[v1.2.1]: https://github.com/mineadmin/mineadmin/compare/v1.2.0...v1.2.1
[v1.2.0]: https://github.com/mineadmin/mineadmin/compare/v1.1.1...v1.2.0
[v1.1.1]: https://github.com/mineadmin/mineadmin/compare/v1.1.0...v1.1.1
[v1.1.0]: https://github.com/mineadmin/mineadmin/compare/v1.0.0...v1.1.0
[v1.0.0]: https://github.com/mineadmin/mineadmin/compare/v0.7.2...v1.0.0
[v0.7.2]: https://github.com/mineadmin/mineadmin/compare/v0.7.1...v0.7.2
[v0.7.1]: https://github.com/mineadmin/mineadmin/compare/v0.7.0...v0.7.1
[v0.7.0]: https://github.com/mineadmin/mineadmin/compare/v0.6.3...v0.7.0
[v0.6.3]: https://github.com/mineadmin/mineadmin/compare/v0.6.2...v0.6.3
[v0.6.2]: https://github.com/mineadmin/mineadmin/compare/2.0.0-alpha.1...v0.6.2
