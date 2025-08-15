<script setup lang="ts" >
import DefaultTheme from 'vitepress/theme'
import {useData, useRoute} from "vitepress";
import giscusTalk from "vitepress-plugin-comment-with-giscus";
import {ElConfigProvider} from "element-plus"
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import CustomHome from './CustomHome.vue'

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
      <div class="relative">
        <div class="sticky top-65px z-20 hidden lg:block mx-auto text-center w-full" v-if="route.path === '/' || route.path === '/zh/'">
          <el-alert type="success" effect="dark" center>
            ⭐ 开源不易，如果觉得本项目对您的工作还是有帮助的话，请帮忙在 <a target="_blank" href="https://github.com/mineadmin/mineadmin">GitHub</a> 点个Star ⭐
          </el-alert>
        </div>
        <!-- 使用自定义首页 -->
        <CustomHome v-if="frontmatter.layout === 'home' && frontmatter.customHome" />
        <Layout v-else>
        </Layout>
      </div>
    </ElConfigProvider>
</template>