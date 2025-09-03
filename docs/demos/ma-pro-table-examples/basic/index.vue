<template>
  <div class="demo-basic">
    <h3>基础用法</h3>
    <p>最简单的表格使用方式，包含搜索、分页和基本操作功能。</p>
    
    <MaProTable ref="tableRef" :options="options" :schema="schema" />
  </div>
</template>

<script setup lang="tsx">
import { ref, reactive } from 'vue'
import type { MaProTableExpose, MaProTableOptions, MaProTableSchema } from "@mineadmin/pro-table"
import { ElMessage, ElTag } from 'element-plus'

const tableRef = ref<MaProTableExpose>()

// 模拟 API 接口
const getBasicList = async (params: any) => {
  console.log('请求参数:', params)
  
  // 模拟数据
  const data = [
    { id: 1, name: '张三', department: '技术部', position: '前端工程师', salary: 15000, status: 1, createTime: '2024-01-15' },
    { id: 2, name: '李四', department: '产品部', position: '产品经理', salary: 18000, status: 1, createTime: '2024-01-16' },
    { id: 3, name: '王五', department: '设计部', position: 'UI设计师', salary: 12000, status: 0, createTime: '2024-01-17' },
    { id: 4, name: '赵六', department: '技术部', position: '后端工程师', salary: 16000, status: 1, createTime: '2024-01-18' },
    { id: 5, name: '孙七', department: '运营部', position: '运营专员', salary: 10000, status: 1, createTime: '2024-01-19' }
  ]
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          list: data,
          total: data.length
        }
      })
    }, 500)
  })
}

// 组件配置
const options = reactive<MaProTableOptions>({
  requestOptions: {
    api: getBasicList,
    autoRequest: true,

  },
  tableOptions: {
    adaption: true,
    pagination: {
      total: 0,
      pageSize: 10
    }
  },
  header: {
    show: true,
    mainTitle: '员工管理',
    subTitle: '基础表格示例'
  }
})

// 表格架构
const schema = reactive<MaProTableSchema>({
  searchItems: [
    {
      label: '姓名',
      prop: 'name',
      render: 'input',
      renderProps: {
        placeholder: '请输入姓名'
      }
    },
    {
      label: '部门',
      prop: 'department',
      render: 'select',
      renderProps: {
        options: [
          { label: '技术部', value: '技术部' },
          { label: '产品部', value: '产品部' },
          { label: '设计部', value: '设计部' },
          { label: '运营部', value: '运营部' }
        ]
      }
    }
  ],
  tableColumns: [
    { label: 'ID', prop: 'id', width: 80 },
    { label: '姓名', prop: 'name', width: 120 },
    { label: '部门', prop: 'department', width: 120 },
    { label: '职位', prop: 'position', width: 150 },
    { label: '薪资', prop: 'salary', width: 120, formatter: (row: any) => `￥${row.salary.toLocaleString()}` },
    { 
      label: '状态', 
      prop: 'status',
      cellRender: ({ row }) => (
          <ElTag type={row.status === 1 ? 'success' : 'danger'}>
            {row.status === 1 ? '在职' : '离职'}
          </ElTag>
      ),
    },
    { label: '入职时间', prop: 'createTime', width: 150 },
    {
      type: 'operation',
      label: '操作',
      width: 200,
      operationConfigure: {
        type: 'tile',
        actions: [
          {
            name: 'view',
            text: '查看',
            onClick: (data: any) => {
              ElMessage.info(`查看员工: ${data.row.name}`)
            }
          },
          {
            name: 'edit',
            text: '编辑',
            onClick: (data: any) => {
              ElMessage.success(`编辑员工: ${data.row.name}`)
            }
          },
          {
            name: 'delete',
            text: '删除',
            onClick: (data: any) => {
              ElMessage.warning(`删除员工: ${data.row.name}`)
            },
            linkProps: {
              type: 'danger'
            }
          }
        ]
      }
    }
  ]
})
</script>

<style scoped>
.demo-basic {
  padding: 20px;
}

.demo-basic h3 {
  margin-bottom: 8px;
  color: #333;
}

.demo-basic p {
  margin-bottom: 16px;
  color: #666;
  font-size: 14px;
}
</style>