<script setup lang="ts" >
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import DefaultTheme from 'vitepress/theme'
import { ElConfigProvider } from 'element-plus'
import {useData, useRoute} from "vitepress";
import giscusTalk from "vitepress-plugin-comment-with-giscus";

const { Layout } = DefaultTheme;

const { frontmatter }: any = useData();
const route = useRoute();
// giscus配置
giscusTalk({
    repo: 'mineadmin/mineadmin', //仓库
    repoId: 'MDEwOlJlcG9zaXRvcnk0MjQ2MDA5', //仓库ID
    category: 'Q&A', // 讨论分类
    categoryId: 'DIC_kwDOAEDJ-c4CR7vK', //讨论分类ID
    mapping: 'pathname',
    inputPosition: 'bottom',
    lang: 'zh-CN',
  },
  {
    frontmatter, route
  },
  true
);
</script>

<template>
  <ElConfigProvider :locale="zhCn">
    <Layout />
  </ElConfigProvider>
</template>