<!--
 - MineAdmin is committed to providing solutions for quickly building web applications
 - Please view the LICENSE file that was distributed with this source code,
 - For the full copyright and license information.
 - Thank you very much for using MineAdmin.
 -
 - @Author X.Mo<root@imoi.cn>
 - @Link   https://github.com/mineadmin
-->
<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const { files = [] } = defineProps<{files?: string[]}>()

const slots = useSlots();

const tabs = computed(() => {
  return files.map((file) => {
    return {
      component: slots[file],
      label: file,
    };
  });
});

const currentTab = ref('index.vue');
</script>

<template>
  <div class="code-group-container">
    <el-tabs
      v-model="currentTab"
      class="code-group-tabs"
      tab-position="top"
    >
      <el-tab-pane
        v-for="tab in tabs"
        :key="tab.label"
        :label="tab.label"
        :name="tab.label"
        class="code-group-pane"
      >
        <div class="code-content-wrapper">
          <component :is="tab.component" class="code-content" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.code-group-container {
  width: 100%;
  background: var(--vp-c-bg-alt);
}

.code-group-tabs {
  width: 100%;
}

.code-content-wrapper {
  position: relative;
  background: var(--vp-code-block-bg);
  border-radius: 0 0 8px 8px;
  overflow: hidden;
}

.code-content {
  display: block;
  width: 100%;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  overflow-x: auto;
}

/* Element Plus 标签页样式重写 */
.code-group-tabs :deep(.el-tabs__header) {
  margin: 0;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.code-group-tabs :deep(.el-tabs__nav-wrap) {
  padding: 0;
}

.code-group-tabs :deep(.el-tabs__nav-scroll) {
  display: flex;
  overflow-x: auto;
}

.code-group-tabs :deep(.el-tabs__item) {
  padding: 0.75rem 1.25rem;
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  border: none;
  background: transparent;
  transition: all 0.2s ease;
  white-space: nowrap;
  position: relative;
}

.code-group-tabs :deep(.el-tabs__item:hover) {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.code-group-tabs :deep(.el-tabs__item.is-active) {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  font-weight: 600;
}

.code-group-tabs :deep(.el-tabs__active-bar) {
  background: var(--vp-c-brand-1);
  height: 2px;
  border-radius: 1px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.code-group-tabs :deep(.el-tabs__content) {
  padding: 0;
  background: var(--vp-code-block-bg);
}

.code-group-tabs :deep(.el-tab-pane) {
  padding: 0;
  background: transparent;
}

/* 代码块内容样式优化 */
.code-content :deep(pre) {
  margin: 0;
  padding: 1.25rem;
  background: var(--vp-code-block-bg) !important;
  border-radius: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  overflow-x: auto;
}

.code-content :deep(code) {
  background: transparent !important;
  color: var(--vp-code-block-color);
  font-family: var(--vp-font-family-mono);
  font-weight: 400;
}

/* 滚动条样式 */
.code-content :deep(pre)::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.code-content :deep(pre)::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.code-content :deep(pre)::-webkit-scrollbar-thumb {
  background: var(--vp-c-brand-1);
  border-radius: 3px;
}

.code-content :deep(pre)::-webkit-scrollbar-thumb:hover {
  background: var(--vp-c-brand-2);
}

/* 深色模式适配 */
.dark .code-group-container {
  background: var(--vp-c-bg);
}

.dark .code-group-tabs :deep(.el-tabs__header) {
  background: var(--vp-c-bg-alt);
  border-color: var(--vp-c-border);
}

.dark .code-group-tabs :deep(.el-tabs__item.is-active) {
  background: var(--vp-c-bg-soft);
}

.dark .code-content :deep(pre)::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .code-group-tabs :deep(.el-tabs__item) {
    padding: 0.625rem 1rem;
    font-size: 0.8rem;
  }
  
  .code-content :deep(pre) {
    padding: 1rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .code-group-tabs :deep(.el-tabs__item) {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
  
  .code-content :deep(pre) {
    padding: 0.875rem;
    font-size: 0.75rem;
  }
}

/* 文件名样式优化 */
.code-group-tabs :deep(.el-tabs__item) {
  font-family: var(--vp-font-family-mono);
}

/* 活动标签页指示器动画 */
.code-group-tabs :deep(.el-tabs__item.is-active)::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  animation: tabGlow 0.3s ease;
}

@keyframes tabGlow {
  from {
    opacity: 0;
    transform: scaleX(0);
  }
  to {
    opacity: 1;
    transform: scaleX(1);
  }
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
  .code-group-tabs :deep(.el-tabs__active-bar),
  .code-group-tabs :deep(.el-tabs__item) {
    transition: none !important;
  }
  
  .code-group-tabs :deep(.el-tabs__item.is-active)::before {
    animation: none;
  }
}
</style>