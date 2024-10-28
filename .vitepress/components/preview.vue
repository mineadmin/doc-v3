<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  files?: string;
}

const props = withDefaults(defineProps<Props>(), { files: '() => []' });

const parsedFiles = computed(() => {
  try {
    return JSON.parse(decodeURIComponent(props.files ?? ''));
  } catch {
    return [];
  }
});
</script>

<template>
  <div class="border-border shadow-float relative rounded-xl border">
    {{ parsedFiles }}
    <div
      class="not-prose relative w-full overflow-x-auto rounded-t-lg px-4 py-6"
    >
      <div class="flex w-full max-w-[700px] px-2">
        <ClientOnly>
          <slot v-if="parsedFiles.length > 0"></slot>
          <div v-else class="text-destructive text-sm">
            <span class="bg-destructive text-foreground rounded-sm px-1 py-1">
              找不到演示文件路径
            </span>
          </div>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>