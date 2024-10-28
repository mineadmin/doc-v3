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
  <el-tabs
    v-model="currentTab"
  >
    <el-tab-pane v-for="tab in tabs" :label="tab.label" :name="tab.label" >
      <component :is="tab.component" class="border-0" />
    </el-tab-pane>
  </el-tabs>
</template>