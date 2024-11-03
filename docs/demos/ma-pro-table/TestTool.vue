<script setup lang="ts">
import { MaProTableExpose } from '@mineadmin/pro-table'
import { ElMessage } from 'element-plus'

const { proxy } = defineProps<{ proxy: MaProTableExpose }>()

const execute = async () => {
  ElMessage.success('我是扩展出来的，哈哈哈')
}
</script>

<template>
  <el-tooltip content="我是扩展出来的，哈哈哈哈">
    <el-button circle @click="execute">扩</el-button>
  </el-tooltip>
</template>

<style scoped>

</style>