<script setup lang="tsx">
import { ref } from 'vue'
import type {
  MaTableColumns,
  MaTableExpose,
  MaTableOptions
} from "@mineadmin/table"
import { ElMessage } from 'element-plus'

const tableRef = ref<MaTableExpose>()
const columns = ref<MaTableColumns[]>([
  {
    label: '人员信息', prop: 'base',
    children: [
      { label: '姓名', prop: 'name', align: 'left' },
      { label: '所在部门', prop: 'dept' }
    ]
  },
  {
    label: '应发薪资', prop: 'xinshui',
    sortable: true,
    cellRender:({ row }) => <el-tag>{ row.xinshui }</el-tag>
  },
  { label: '入职时间', prop: 'date' },
])

const options = ref<MaTableOptions>({
  defaultSort: { prop: 'xinshui', order: 'descending' },
  showSummary: true,
  sumText: '合计薪资',
  // 分页配置
  pagination: {
    total: 30,
    onChange: (currentPage: number, pageSize: number) => {
      ElMessage.success('当前页：' + currentPage + ', 每页显示：' + pageSize)
    }
  }
})

const data: any[] = [
  { name: '石昊', dept: '研发部', xinshui: 12365, date: '2021-08-04' },
  { name: '叶凡', dept: '销售部', xinshui: 13984, date: '2022-03-31' },
  { name: '罗峰', dept: '运营部', xinshui: 11288, date: '2022-04-05' },
  { name: '白小纯', dept: '研发部', xinshui: 9989, date: '2022-05-05' },
  { name: '林七夜', dept: '销售部', xinshui: 10258, date: '2022-06-05' },
  { name: '萧炎', dept: '销售部', xinshui: 13069, date: '2022-07-05' },
  { name: '陈平安', dept: '运营部', xinshui: 8750, date: '2022-08-05' },
  { name: '王林', dept: '研发部', xinshui: 11369, date: '2022-09-05' },
]

</script>

<template>
  <ma-table
    ref="tableRef"
    :columns="columns"
    :data="data"
    :options="options"
  />
</template>