<script setup lang="ts">
import { ref } from 'vue'

// 常用图标示例
const commonIcons = [
  'i-ep:home-filled',
  'i-ep:user-filled', 
  'i-ep:setting',
  'i-ep:search',
  'i-ep:plus',
  'i-ep:edit',
  'i-ep:delete',
  'i-ep:download',
  'i-ep:upload',
  'i-ep:star-filled'
]

// 不同尺寸
const sizes = [
  { size: 'text-sm', label: '小 (14px)' },
  { size: 'text-base', label: '默认 (16px)' },
  { size: 'text-lg', label: '大 (18px)' },
  { size: 'text-xl', label: '特大 (20px)' },
  { size: 'text-2xl', label: '超大 (24px)' }
]

// 不同颜色
const colors = [
  { color: 'text-gray-600', label: '默认灰色' },
  { color: 'text-blue-500', label: '蓝色' },
  { color: 'text-green-500', label: '绿色' },
  { color: 'text-red-500', label: '红色' },
  { color: 'text-yellow-500', label: '黄色' },
  { color: 'text-purple-500', label: '紫色' }
]

const selectedIcon = ref('i-ep:home-filled')
</script>

<template>
  <div class="space-y-8">
    <!-- 基础使用 -->
    <div>
      <h3 class="text-lg font-semibold mb-4">基础图标展示</h3>
      <div class="grid grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
        <div 
          v-for="icon in commonIcons" 
          :key="icon"
          class="flex flex-col items-center p-3 bg-white rounded hover:bg-blue-50 cursor-pointer transition-colors"
        >
          <div :class="icon" class="text-2xl text-gray-600 mb-2"></div>
          <span class="text-xs text-gray-500 text-center">{{ icon.replace('i-ep:', '') }}</span>
        </div>
      </div>
    </div>

    <!-- 不同尺寸 -->
    <div>
      <h3 class="text-lg font-semibold mb-4">图标尺寸</h3>
      <div class="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
        <div 
          v-for="size in sizes" 
          :key="size.size"
          class="flex flex-col items-center gap-2"
        >
          <div :class="['i-ep:star-filled', size.size, 'text-yellow-500']"></div>
          <span class="text-sm text-gray-600">{{ size.label }}</span>
        </div>
      </div>
    </div>

    <!-- 不同颜色 -->
    <div>
      <h3 class="text-lg font-semibold mb-4">图标颜色</h3>
      <div class="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
        <div 
          v-for="colorOption in colors" 
          :key="colorOption.color"
          class="flex flex-col items-center gap-2"
        >
          <div :class="['i-ep:heart-filled', 'text-xl', colorOption.color]"></div>
          <span class="text-sm text-gray-600">{{ colorOption.label }}</span>
        </div>
      </div>
    </div>

    <!-- 交互式示例 -->
    <div>
      <h3 class="text-lg font-semibold mb-4">交互式图标选择器</h3>
      <div class="p-4 bg-gray-50 rounded-lg">
        <div class="flex items-center gap-4 mb-4">
          <span class="text-sm font-medium">选择图标：</span>
          <select 
            v-model="selectedIcon" 
            class="px-3 py-1 border rounded-md text-sm"
          >
            <option v-for="icon in commonIcons" :key="icon" :value="icon">
              {{ icon.replace('i-ep:', '') }}
            </option>
          </select>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 px-4 py-2 bg-white rounded-md">
            <div :class="[selectedIcon, 'text-xl text-blue-500']"></div>
            <span class="text-sm">{{ selectedIcon }}</span>
          </div>
          
          <div class="text-sm text-gray-500">
            代码：<code class="bg-gray-100 px-1 rounded">&lt;div class="{{ selectedIcon }}"&gt;&lt;/div&gt;</code>
          </div>
        </div>
      </div>
    </div>

    <!-- 按钮中的图标 -->
    <div>
      <h3 class="text-lg font-semibold mb-4">按钮中的图标应用</h3>
      <div class="flex gap-4 p-4 bg-gray-50 rounded-lg">
        <button class="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          <div class="i-ep:plus text-base"></div>
          <span>新增</span>
        </button>
        
        <button class="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
          <div class="i-ep:edit text-base"></div>
          <span>编辑</span>
        </button>
        
        <button class="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
          <div class="i-ep:delete text-base"></div>
          <span>删除</span>
        </button>
        
        <button class="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
          <div class="i-ep:download text-base"></div>
          <span>下载</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 确保图标能正确显示 */
[class*="i-"] {
  display: inline-block;
}
</style>