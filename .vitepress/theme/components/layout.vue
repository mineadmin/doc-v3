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
  <ElConfigProvider :locale="{ zhCn }">
    <div class="relative">
      <div class="sticky top-65px z-20 hidden lg:block mx-auto text-center w-full" v-if="route.path === '/'">
        <el-alert type="success" effect="dark" center>
          ⭐ 开源不易，如果觉得本项目对您的工作还是有帮助的话，请帮忙在 <a target="_blank" href="https://github.com/mineadmin/mineadmin">GitHub</a> 点个Star ⭐
        </el-alert>
      </div>
      <Layout>
      </Layout>
    </div>
  </ElConfigProvider>
</template>