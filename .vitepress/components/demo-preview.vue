<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
import { ElButton, ElIcon } from 'element-plus'
import { View, Hide } from '@element-plus/icons-vue'
import CodeGroup from "./code-group.vue"

interface Props {
  dir?: string
  files?: string
  title?: string
  description?: string
}

const { files, title, description } = defineProps<Props>()

const codeFiles = computed(() => {
  try {
    return JSON.parse(decodeURIComponent(files ?? ''))
  } catch {
    return []
  }
})

const isOpen = ref<boolean>(false)
const isLoading = ref<boolean>(false)

const toggleCode = async () => {
  if (!isOpen.value) {
    isLoading.value = true
    // 模拟代码加载时间，提升用户体验
    await new Promise(resolve => setTimeout(resolve, 150))
  }
  
  isOpen.value = !isOpen.value
  isLoading.value = false
  
  // 确保 DOM 更新后再执行动画
  await nextTick()
}

const copyCode = async () => {
  try {
    // 简单实现，实际项目中可以集成更复杂的代码复制逻辑
    await navigator.clipboard.writeText('代码已复制')
  } catch (err) {
    console.warn('复制失败:', err)
  }
}

const onCodeEnter = (el: Element) => {
  const htmlEl = el as HTMLElement
  htmlEl.style.height = '0'
  htmlEl.style.opacity = '0'
  
  // 强制重排
  htmlEl.offsetHeight
  
  htmlEl.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  htmlEl.style.height = 'auto'
  htmlEl.style.opacity = '1'
}

const onCodeLeave = (el: Element) => {
  const htmlEl = el as HTMLElement
  htmlEl.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  htmlEl.style.height = '0'
  htmlEl.style.opacity = '0'
}
</script>

<template>
  <div class="demo-preview-container">
    <!-- 预览区域 -->
    <div class="demo-preview-content">
      <!-- 头部信息 -->
      <div v-if="title || description" class="demo-preview-header">
        <h4 v-if="title" class="demo-preview-title">{{ title }}</h4>
        <p v-if="description" class="demo-preview-description">{{ description }}</p>
      </div>
      
      <!-- 演示区域 -->
      <div class="demo-preview-showcase">
        <div v-if="codeFiles.length > 0" class="demo-content">
          <slot></slot>
        </div>
        <div v-else class="demo-error">
          <el-icon class="demo-error-icon"><View /></el-icon>
          <span class="demo-error-text">演示文件加载失败，请检查文件路径</span>
        </div>
      </div>
      
      <!-- 操作区域 -->
      <div class="demo-preview-actions">
        <div class="demo-actions-left">
          <el-button
            class="demo-action-btn demo-toggle-btn"
            :type="isOpen ? 'primary' : 'default'"
            :loading="isLoading"
            @click="toggleCode"
          >
            <el-icon class="demo-btn-icon">
              <View v-if="!isOpen" />
              <Hide v-else />
            </el-icon>
            {{ isOpen ? '隐藏代码' : '查看代码' }}
          </el-button>
        </div>
        
        <div class="demo-actions-right">
          <el-button
            class="demo-action-btn demo-copy-btn"
            size="small"
            text
            @click="copyCode"
          >
            <el-icon></el-icon>
          </el-button>
        </div>
      </div>
    </div>
    
    <!-- 代码展示区域 -->
    <transition
      name="code-slide"
      @enter="onCodeEnter"
      @leave="onCodeLeave"
    >
      <div v-if="isOpen" class="demo-code-section">
        <div class="demo-code-wrapper">
          <code-group v-if="codeFiles.length > 0" :files="codeFiles" class="demo-code-group">
            <template v-for="file in codeFiles" #[file]>
              <slot :name="file"></slot>
            </template>
          </code-group>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* ========================================================================
   Demo Preview Container - 现代化组件容器
   ======================================================================== */

.demo-preview-container {
  position: relative;
  width: 100%;
  margin: 1.5rem 0;
  border-radius: 16px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
  box-shadow: var(--vp-shadow-2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.demo-preview-container:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--vp-shadow-3);
  transform: translateY(-2px);
}

/* ========================================================================
   Demo Content Area - 演示内容区域
   ======================================================================== */

.demo-preview-content {
  position: relative;
  background: var(--vp-c-bg);
}

.demo-preview-header {
  padding: 1.5rem 1.5rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.demo-preview-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.demo-preview-description {
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.demo-preview-showcase {
  position: relative;
  padding: 2rem 1.5rem;
  min-height: 80px;
  background: var(--vp-c-bg);
  overflow-x: auto;
}

.demo-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ========================================================================
   Error State - 错误状态
   ======================================================================== */

.demo-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 2px dashed var(--vp-c-divider);
}

.demo-error-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  opacity: 0.6;
}

.demo-error-text {
  font-size: 0.9rem;
  text-align: center;
}

/* ========================================================================
   Action Area - 操作区域
   ======================================================================== */

.demo-preview-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-divider);
}

.demo-actions-left,
.demo-actions-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.demo-action-btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.demo-toggle-btn {
  padding: 0.5rem 1rem;
  min-width: 120px;
}

.demo-toggle-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.demo-toggle-btn:hover::before {
  left: 100%;
}

.demo-copy-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.demo-copy-btn:hover {
  background: var(--vp-c-brand-1);
  color: white;
  transform: scale(1.1);
}

.demo-btn-icon {
  margin-right: 0.5rem;
  font-size: 1rem;
}

/* ========================================================================
   Code Section - 代码展示区域
   ======================================================================== */

.demo-code-section {
  background: var(--vp-c-bg-alt);
  border-top: 1px solid var(--vp-c-divider);
  overflow: hidden;
}

.demo-code-wrapper {
  position: relative;
}

.demo-code-group {
  margin: 0;
}

/* 重写 Element Plus 标签页样式以适配演示组件 */
.demo-code-section :deep(.el-tabs) {
  margin: 0;
}

.demo-code-section :deep(.el-tabs__header) {
  margin: 0;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 0 1rem;
}

.demo-code-section :deep(.el-tabs__nav-wrap) {
  padding: 0;
}

.demo-code-section :deep(.el-tabs__item) {
  padding: 1rem 1.5rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.demo-code-section :deep(.el-tabs__item:hover) {
  color: var(--vp-c-brand-1);
}

.demo-code-section :deep(.el-tabs__item.is-active) {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
}

.demo-code-section :deep(.el-tabs__active-bar) {
  background: var(--vp-c-brand-1);
  height: 3px;
}

.demo-code-section :deep(.el-tabs__content) {
  padding: 0;
}

.demo-code-section :deep(.el-tab-pane) {
  padding: 1.5rem;
  background: var(--vp-c-bg-alt);
}

/* ========================================================================
   Code Transition Animations - 代码展开动画
   ======================================================================== */

.code-slide-enter-active,
.code-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.code-slide-enter-from {
  height: 0 !important;
  opacity: 0;
  transform: translateY(-10px);
}

.code-slide-leave-to {
  height: 0 !important;
  opacity: 0;
  transform: translateY(-10px);
}

/* ========================================================================
   Dark Mode Support - 深色模式适配
   ======================================================================== */

.dark .demo-preview-container {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-border);
}

.dark .demo-preview-container:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.2);
}

.dark .demo-preview-header {
  background: var(--vp-c-bg-alt);
  border-color: var(--vp-c-border);
}

.dark .demo-preview-showcase {
  background: var(--vp-c-bg-soft);
}

.dark .demo-preview-actions {
  background: var(--vp-c-bg-alt);
  border-color: var(--vp-c-border);
}

.dark .demo-error {
  background: var(--vp-c-bg-alt);
  border-color: var(--vp-c-border);
  color: var(--vp-c-text-2);
}

.dark .demo-code-section {
  background: var(--vp-c-bg);
  border-color: var(--vp-c-border);
}

.dark .demo-code-section :deep(.el-tabs__header) {
  background: var(--vp-c-bg-alt);
  border-color: var(--vp-c-border);
}

.dark .demo-code-section :deep(.el-tabs__item.is-active) {
  background: var(--vp-c-bg-soft);
}

.dark .demo-code-section :deep(.el-tab-pane) {
  background: var(--vp-c-bg);
}

/* ========================================================================
   Responsive Design - 响应式设计
   ======================================================================== */

@media (max-width: 768px) {
  .demo-preview-container {
    margin: 1rem 0;
    border-radius: 12px;
  }
  
  .demo-preview-header {
    padding: 1rem 1rem 0;
  }
  
  .demo-preview-showcase {
    padding: 1.5rem 1rem;
  }
  
  .demo-preview-actions {
    padding: 0.75rem 1rem;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .demo-actions-left,
  .demo-actions-right {
    width: 100%;
    justify-content: center;
  }
  
  .demo-toggle-btn {
    width: 100%;
    min-width: auto;
  }
  
  .demo-code-section :deep(.el-tabs__header) {
    padding: 0 0.5rem;
  }
  
  .demo-code-section :deep(.el-tabs__item) {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
  
  .demo-code-section :deep(.el-tab-pane) {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .demo-preview-showcase {
    padding: 1rem 0.75rem;
  }
  
  .demo-preview-header {
    padding: 0.75rem 0.75rem 0;
  }
  
  .demo-preview-title {
    font-size: 1rem;
  }
  
  .demo-preview-description {
    font-size: 0.85rem;
  }
}

/* ========================================================================
   Code Block Enhancements - 代码块增强
   ======================================================================== */

.demo-code-section :deep(pre) {
  margin: 0;
  padding: 0;
  background: transparent !important;
  border-radius: 0;
}

.demo-code-section :deep(code) {
  background: transparent !important;
  font-family: var(--vp-font-family-mono);
  font-size: 0.9rem;
  line-height: 1.6;
}

/* 滚动条样式 */
.demo-preview-showcase::-webkit-scrollbar,
.demo-code-section :deep(*)::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.demo-preview-showcase::-webkit-scrollbar-track,
.demo-code-section :deep(*)::-webkit-scrollbar-track {
  background: var(--vp-c-bg-soft);
  border-radius: 3px;
}

.demo-preview-showcase::-webkit-scrollbar-thumb,
.demo-code-section :deep(*)::-webkit-scrollbar-thumb {
  background: var(--vp-c-brand-1);
  border-radius: 3px;
}

.demo-preview-showcase::-webkit-scrollbar-thumb:hover,
.demo-code-section :deep(*)::-webkit-scrollbar-thumb:hover {
  background: var(--vp-c-brand-2);
}

/* ========================================================================
   Enhanced Visual Effects - 增强视觉效果
   ======================================================================== */

.demo-preview-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-2), var(--vp-c-brand-3));
  opacity: 0;
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.demo-preview-container:hover::before {
  opacity: 1;
}

/* 加载状态的细节优化 */
.demo-toggle-btn.is-loading {
  pointer-events: none;
}

/* 聚焦状态优化 */
.demo-action-btn:focus {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .demo-preview-container {
    border-width: 2px;
  }
  
  .demo-preview-actions {
    border-top-width: 2px;
  }
  
  .demo-code-section {
    border-top-width: 2px;
  }
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
  .demo-preview-container,
  .demo-action-btn,
  .code-slide-enter-active,
  .code-slide-leave-active {
    transition: none !important;
  }
  
  .demo-preview-container:hover {
    transform: none;
  }
  
  .demo-toggle-btn::before {
    display: none;
  }
}
</style>