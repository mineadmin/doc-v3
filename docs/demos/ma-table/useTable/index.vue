<script setup lang="tsx">
import { ref } from 'vue'
import type { MaTableColumns, MaTableExpose } from "@mineadmin/table"

const tableRef = ref<MaTableExpose>()
const columns = ref<MaTableColumns[]>([
  {
    label: '角色基础信息',
    prop: 'base',
    children: [
      { label: '姓名', prop: 'name' },
      { label: '性别', prop: 'sex' },
    ]
  },
  { label: '成就', prop: 'chengjiu' },
  {
    label: '战力评价', prop: 'zhanli',
    cellRender:({ row }) => <el-tag>{ row.zhanli }</el-tag>
  },
])

const data: any[] = [
  {
    name: '石昊',
    sex: '男',
    chengjiu: '独断万古',
    zhanli: 'SSS+',
  },
  {
    name: '叶凡',
    sex: '男',
    chengjiu: '一叶遮天',
    zhanli: 'SSS+',
  },
  {
    name: '罗峰',
    sex: '男',
    chengjiu: '永恒真神',
    zhanli: 'SS',
  },
]
</script>

<template>
  <ma-table ref="tableRef" :columns="columns" :data="data" />
</template>

<style scoped>

</style>