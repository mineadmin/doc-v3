<script setup lang="tsx">
import {onMounted, reactive, ref, inject, h} from 'vue'
import { MaProTableSchema, MaProTableOptions, MaProTableExpose, useProTableToolbar } from '@mineadmin/pro-table'
import {ElMessage} from "element-plus";
import TestTool from './TestTool.vue'

useProTableToolbar().add({
  name: 'test',
  order: 0,
  render: () => TestTool
})


const tableRef = ref<MaProTableExpose>()

const originData = [
  { name: '石昊', dept: '研发部', xinshui: 12365, date: '2021-08-04' },
  { name: '叶凡', dept: '销售部', xinshui: 13984, date: '2022-03-31' },
  { name: '罗峰', dept: '运营部', xinshui: 11288, date: '2022-04-05' },
  { name: '白小纯', dept: '研发部', xinshui: 9989, date: '2022-05-05' },
  { name: '林七夜', dept: '销售部', xinshui: 10258, date: '2022-06-05' },
  { name: '萧炎', dept: '销售部', xinshui: 13069, date: '2022-07-05' },
  { name: '陈平安', dept: '运营部', xinshui: 8750, date: '2022-08-05' },
  { name: '王林', dept: '研发部', xinshui: 11369, date: '2022-09-05' },
  { name: '黑皇', dept: '销售部', xinshui: 11111, date: '2022-10-05' },
  { name: '秦羽', dept: '运营部', xinshui: 13333, date: '2022-11-05' },
]

const getPageList = (params = {}): Promise<any> => {
  return new Promise((resolve, reject) => {
    const data = []
    const { page = 1 } = params
    originData.map((item, idx) =>{
      data.push({
        name: item.name + (page * idx),
        dept: item.dept + (page * idx),
        xinshui: item.xinshui,
        date: item.date,
      })
    })
    resolve({
      data: {
        total: 1000,
        list: data,
      }
    })
  })
}

const options = reactive<MaProTableOptions>({
  requestOptions: {
    api: getPageList,
    requestParams: {page: 1},
    responseDataHandler: (response): any[] => {
      return response.list
    },
  },

  tableOptions: {
    pagination: {
      total: 1000,
    }
  },

  rowContextMenu: {
    enabled: true,
    items: [{
      label: '自定义鼠标右键',
      disabled: false,
      divider: true,
      onMenuClick: (data, event) => {
        ElMessage.success('选择的这行数据: ' + JSON.stringify(data))
      },
    },{
      label: '哈哈哈',
      disabled: false,
      onMenuClick: () => {
        ElMessage.success('点击了哈哈哈')
      },
    }
    ]
  },
})

const schema = reactive<MaProTableSchema>({
  searchItems: [
    { label: '姓名', prop: 'name', render: 'input' },
  ],

  tableColumns: [
    {
      type: 'selection',
      showOverflowTooltip: false,
    },
    {
      width: '80px',
      type: 'sort'
    },
    {
      label: '人员信息', prop: 'base',
      children: [
        { label: '姓名', prop: 'name', cellRenderTo: { name: 'tag' } },
        { label: '所在部门', prop: 'dept' }
      ]
    },
    {
      label: '应发薪资', prop: 'xinshui',
      sortable: true,
      // 使用插件
      cellRenderTo: { name: 'tag', props: { type: 'danger' } }
    },
    { label: '入职时间', prop: 'date' },
    {
      type: 'operation',
      operationConfigure: {
        type: 'tile',
        actions: [
          {
            name: 'edit',
            text: () => {
              return '编辑'
            },
            disabled: (data) => {
              return data.row.name === '叶凡1'
            },
            show: (data) => {
              return data.row.name !== '石昊0'
            },
            onClick: (data, proxy) => {
              ElMessage.success('编辑的数据标题是: ' + data.row.name)
            }
          },
          {
            name: 'ok',
            text: () => 'OK',
            onClick: () => {
              ElMessage.success('OK')
            }
          },
        ]
      },
    },
  ]
})

onMounted(() => {
  // tableRef.value.getMaTableRef().setData(getPageList(1).data.list)
  tableRef.value.setSearchForm({
    username: '123',
  })
})
</script>

<template>
  <ma-pro-table
    ref="tableRef"
    :options="options"
    :schema="schema"
    @row-drag-sort="(v: any[]) => {
       ElMessage.success('排序完成：' + v)
    }"
  >
    <template #headerRight>
      <el-button>头部右边扩展</el-button>
    </template>
    <template #toolbarLeft>
      <el-button>工具栏左边扩展</el-button>
    </template>
    <template #pageLeft>
      <el-button>分页左边扩展</el-button>
    </template>
  </ma-pro-table>
</template>

<style scoped>

</style>