---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
sidebar: false
title: MineAdmin - 企业级后台管理系统
titleTemplate: 基于 PHP & Vue.js 的现代化开发框架
description: MineAdmin 是一个现代化的企业级后台管理系统，基于 Hyperf + Vue3 构建，提供高性能、可扩展的解决方案，支持 RBAC 权限管理、多语言、插件系统等企业级功能。
head:
  - - meta
    - name: keywords
      content: MineAdmin,后台管理系统,PHP,Vue.js,Hyperf,企业级,开源,RBAC权限,多语言,插件系统
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: MineAdmin - 企业级后台管理系统
  - - meta
    - property: og:description
      content: 基于 Hyperf + Vue3 构建的现代化企业级后台管理系统，开箱即用，免费开源
  - - meta
    - property: og:image
      content: https://mineadmin.com/images/og-image.png
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - name: twitter:title
      content: MineAdmin - 企业级后台管理系统
  - - meta
    - name: twitter:description
      content: 基于 Hyperf + Vue3 构建的现代化企业级后台管理系统，开箱即用，免费开源

hero:
  name: MineAdmin
  text: 企业级后台管理系统
  tagline: 全新版本，全新架构，开箱即用，免费开源
  actions:
    - theme: brand
      text: 快速开始 ->
      link: /guide/introduce/mineadmin
    - theme: alt
      text: 查看演示
      link: https://demo.mineadmin.com
    - theme: alt
      text: 下载源码
      link: https://github.com/mineadmin/mineadmin

features:
  - icon: 🚀
    title: 最新技术栈
    details: 基于 Swoole5、Swow、Hyperf3.1、PHP8.2+、Vue3、Vite5、TypeScript 等最新前沿技术构建。
    link: /guide/introduce/tech-stack
  - icon: ⚡
    title: 极致性能
    details: 基于 Swoole 协程引擎，内存常驻，性能比传统 PHP-FPM 提升 10 倍以上，轻松应对高并发场景。
    link: /guide/backend/performance
  - icon: 🏗️
    title: 现代化架构
    details: 企业架构设计，模块化开发，代码结构清晰，易于维护和扩展，支持多数据库、缓存适配。
    link: /guide/backend/architecture
  - icon: 🌐
    title: 多语言支持
    details: 内置完善的国际化解决方案，支持简体中文、繁体中文、英文、日文等多种语言动态切换。
    link: /guide/front/i18n
  - icon: 🔒
    title: 企业级权限
    details: 基于 RBAC 的完整权限管理体系，支持菜单权限、数据权限、按钮权限，满足复杂业务需求。
    link: /guide/backend/permission
  - icon: 🧩
    title: 强大插件系统
    details: 插件化架构设计，支持热插拔，丰富的应用市场，快速扩展业务功能，构建完整生态。
    link: /plugin/create

---

