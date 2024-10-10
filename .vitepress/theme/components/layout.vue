<script setup lang="ts" >
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, getCurrentInstance } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import DefaultTheme from 'vitepress/theme'
import { ElConfigProvider } from 'element-plus'

const { Layout } = DefaultTheme;
</script>

<template>
  <ElConfigProvider :locale="zhCn">
    <Layout />
  </ElConfigProvider>
</template>