<script setup lang="ts">
import {computed, ref} from 'vue'
import CodeGroup from "./code-group.vue";

interface Props {
  dir?: string
  files?: string
}

const { files } = defineProps<Props>()

const codeFiles = computed(() => {
  try {
    return JSON.parse(decodeURIComponent(files ?? ''))
  } catch {
    return []
  }
})

const isOpen = ref<boolean>(false)
</script>

<template>
  <div class="b-1 b-solid b-l-5 b-gray-2 dark:b-dark-2 relative rounded-lg shadow-sm dark:shadow-dark-3 hover:b-blue transition-all duration-300">
    <div
      class="not-prose relative w-full overflow-x-auto"
    >
      <div class="flex w-full p-4 pb-10">
        <slot v-if="codeFiles.length > 0"></slot>
        <div v-else class="text-sm">
          <span class="rounded-sm">
            出错了，找不到演示文件路径
          </span>
        </div>
      </div>
      <div class="relative min-h-42px w-full">
        <el-button
          class="absolute left-[calc(50%-48px)] bottom-5px z-9999"
          type="primary"
          plain
          @click="() => isOpen = !isOpen"
        >
          {{ isOpen ? '隐藏' : '显示' }}代码
        </el-button>
        <div class="px-4">
          <code-group v-if="codeFiles.length > 0 && isOpen" :files="codeFiles">
            <template v-for="file in codeFiles" #[file]>
              <slot :name="file"></slot>
            </template>
          </code-group>
        </div>
      </div>
    </div>
  </div>
</template>