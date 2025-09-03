<template>
  <div class="demo-advanced-search">
    <h3>高级搜索</h3>
    <p>展示多种搜索组件类型和复杂搜索逻辑，包含日期范围、数字范围、多选等功能。</p>

    <MaProTable ref="tableRef" :options="options" :schema="schema" />
  </div>
</template>

<script setup lang="tsx">
import { ref, reactive } from 'vue'
import type { MaProTableExpose, MaProTableOptions, MaProTableSchema } from "@mineadmin/pro-table"
import { ElMessage, ElTag } from 'element-plus'

const tableRef = ref<MaProTableExpose>()

// 表单数据
const formData = reactive({
  // 姓名
  name: '',
  // 部门，多选
  department: [],
  // 薪资范围
  salaryMin: 0,
  salaryMax: 10,
  // 工作经验
  experience: [0, 15], // 如果 slider range 默认值
  // 入职时间范围
  joinDateRange: [],
  // 职级，多选
  level: [],
  // 绩效评分
  performanceMin: 1,
  performanceMax: 2,
  // 在职状态
  status: '',
})

// 模拟 API 接口
const getAdvancedList = async (params: any) => {
  console.log('高级搜索参数:', params)

  // 模拟更复杂的数据
  const data = [
    {
      id: 1,
      name: '张三',
      department: ['技术部', '研发中心'],
      position: '高级前端工程师',
      salary: 25000,
      experience: 5,
      skills: ['Vue', 'React', 'TypeScript'],
      level: 'P6',
      status: 1,
      joinDate: '2019-03-15',
      lastLogin: '2024-01-20 14:30:00',
      performance: 85
    },
    {
      id: 2,
      name: '李四',
      department: ['产品部'],
      position: '产品总监',
      salary: 35000,
      experience: 8,
      skills: ['产品设计', '用户研究', '项目管理'],
      level: 'P8',
      status: 1,
      joinDate: '2017-08-20',
      lastLogin: '2024-01-20 16:45:00',
      performance: 92
    },
    {
      id: 3,
      name: '王五',
      department: ['设计部'],
      position: 'UI设计师',
      salary: 18000,
      experience: 3,
      skills: ['Figma', 'Sketch', 'Principle'],
      level: 'P4',
      status: 0,
      joinDate: '2021-12-10',
      lastLogin: '2024-01-19 10:15:00',
      performance: 78
    },
    {
      id: 4,
      name: '赵六',
      department: ['技术部', '架构组'],
      position: '架构师',
      salary: 45000,
      experience: 10,
      skills: ['Java', 'Spring', '微服务', 'Kubernetes'],
      level: 'P9',
      status: 1,
      joinDate: '2015-06-01',
      lastLogin: '2024-01-20 18:20:00',
      performance: 95
    },
    {
      id: 5,
      name: '孙七',
      department: ['运营部', '增长团队'],
      position: '增长运营专家',
      salary: 22000,
      experience: 4,
      skills: ['数据分析', 'A/B测试', '用户增长'],
      level: 'P5',
      status: 1,
      joinDate: '2020-09-15',
      lastLogin: '2024-01-20 12:10:00',
      performance: 88
    }
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
    }, 800)
  })
}

// 组件配置
const options = reactive<MaProTableOptions>({
  requestOptions: {
    api: getAdvancedList,
    autoRequest: true,

  },
  tableOptions: {
    adaption: true,
    pagination: {
      total: 0,
      pageSize: 10
    }
  },
  searchOptions: {
    fold: true,
    text: {
      searchBtn: () => '高级搜索',
      resetBtn: () => '清空条件'
    }
  },
  header: {
    show: true,
    mainTitle: '高级员工管理',
    subTitle: '支持复杂条件搜索'
  },
  onSearchSubmit: (form: Record<string, any>) => {
    ElMessage.success(`搜索提交: ${JSON.stringify(form)}`)
    return form
  },
  onSearchReset: (form: Record<string, any>) => {
    ElMessage.info('搜索条件已重置')
    return form
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
        placeholder: '请输入姓名',
        clearable: true
      }
    },
    {
      label: '部门',
      prop: 'department',
      render: 'select',
      renderProps: {
        multiple: true,
        placeholder: '请选择部门',
        options: [
          { label: '技术部', value: '技术部' },
          { label: '产品部', value: '产品部' },
          { label: '设计部', value: '设计部' },
          { label: '运营部', value: '运营部' },
          { label: '研发中心', value: '研发中心' },
          { label: '架构组', value: '架构组' },
          { label: '增长团队', value: '增长团队' }
        ],
      }
    },
    {
      label: '薪资范围',
      prop: 'salaryRange',
      render: ({ formData }: any) => (
        <div style="display: flex; gap: 8px; align-items: center;">
          <el-input-number
            v-model={formData.salaryMin}
            placeholder="最低薪资"
            min={0}
            max={100000}
            controls-position="right"
            style="width: 140px;"
          />
          <span>-</span>
          <el-input-number
            v-model={formData.salaryMax}
            placeholder="最高薪资"
            min={0}
            max={100000}
            controls-position="right"
            style="width: 140px;"
          />
        </div>
      ),
      span: 2
    },
    {
      label: '工作经验',
      prop: 'experience',
      render: 'slider',
      renderProps: {
        min: 0,
        max: 15,
        range: true,
        marks: {
          0: '0年',
          5: '5年',
          10: '10年',
          15: '15年+'
        }
      }
    },
    {
      label: '入职时间',
      prop: 'joinDateRange',
      render: ({ formData }: any) => (
        <el-date-picker
          v-model={formData.joinDateRange}
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
      )
    },
    {
      label: '职级',
      prop: 'level',
      render: ({ formData }: any) => (
        <el-checkbox-group v-model={formData.level}>
          <el-checkbox label="P4" value="P4" />
          <el-checkbox label="P5" value="P5" />
          <el-checkbox label="P6" value="P6" />
          <el-checkbox label="P7" value="P7" />
          <el-checkbox label="P8" value="P8" />
          <el-checkbox label="P9" value="P9" />
        </el-checkbox-group>
      )
    },
    {
      label: '绩效评分',
      prop: 'performanceRange',
      render: ({ formData }: any) => (
        <div style="display: flex; gap: 8px; align-items: center;">
          <el-input-number
            v-model={formData.performanceMin}
            placeholder="最低分"
            min={0}
            max={100}
            controls-position="right"
            style="width: 120px;"
          />
          <span>-</span>
          <el-input-number
            v-model={formData.performanceMax}
            placeholder="最高分"
            min={0}
            max={100}
            controls-position="right"
            style="width: 120px;"
          />
        </div>
      ),
      span: 2
    },
    {
      label: '在职状态',
      prop: 'status',
      render: ({ formData }: any) => (
        <el-radio-group v-model={formData.status}>
          <el-radio label="" value="">全部</el-radio>
          <el-radio label={1} value={1}>在职</el-radio>
          <el-radio label={0} value={0}>离职</el-radio>
        </el-radio-group>
      )
    }
  ],
  tableColumns: [
    { label: 'ID', prop: 'id', width: 60 },
    { label: '姓名', prop: 'name', width: 100, fixed: 'left' },
    {
      label: '部门',
      prop: 'department',
      width: 200,
      formatter: (row: any) => row.department.join(' / ')
    },
    { label: '职位', prop: 'position', width: 150 },
    {
      label: '薪资',
      prop: 'salary',
      width: 120,
      formatter: (row: any) => `￥${row.salary.toLocaleString()}`,
      sortable: true
    },
    {
      label: '工作经验',
      prop: 'experience',
      width: 120,
      formatter: (row: any) => `${row.experience}年`,
      sortable: true
    },
    {
      label: '技能标签',
      prop: 'skills',
      width: 200,
      cellRender: ({ row }: any) => (
        <div>
          {row.skills && Array.isArray(row.skills) ? row.skills.map((skill: string, index: number) => (
            <el-tag key={index} size="small" style="margin-right: 4px; margin-bottom: 2px;">
              {skill}
            </el-tag>
          )) : null}
        </div>
      )
    },
    {
      label: '职级',
      prop: 'level',
      width: 80,
      cellRenderTo: {
        name: 'tag',
        props: (data: any) => ({
          type: data.row.level.includes('P8') || data.row.level.includes('P9') ? 'warning' : 'primary'
        })
      }
    },
    {
      label: '绩效评分',
      prop: 'performance',
      width: 120,
      cellRender: ({ row }: any) => (
        <el-progress
          percentage={row.performance}
          color={row.performance >= 90 ? '#67c23a' : row.performance >= 80 ? '#e6a23c' : '#f56c6c'}
          stroke-width={8}
          text-inside
        />
      )
    },
    {
      label: '状态',
      prop: 'status',
      width: 80,
      cellRender: ({ row }) => (
        <ElTag type={row.status === 1 ? 'success' : 'danger'}>
          {row.status === 1 ? '在职' : '离职'}
        </ElTag>
      ),
    },
    { label: '入职时间', prop: 'joinDate', width: 120 },
    { label: '最后登录', prop: 'lastLogin', width: 160 },
    {
      type: 'operation',
      label: '操作',
      width: 180,
      fixed: 'right',
      operationConfigure: {
        type: 'auto',
        fold: 2,
        actions: [
          {
            name: 'view',
            text: '详情',
            onClick: (data: any) => {
              ElMessage.info(`查看员工详情: ${data.row.name}`)
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
            name: 'performance',
            text: '绩效',
            onClick: (data: any) => {
              ElMessage.warning(`查看绩效: ${data.row.name}`)
            }
          },
          {
            name: 'promote',
            text: '晋升',
            show: (data: any) => data.row.performance >= 85,
            onClick: (data: any) => {
              ElMessage.success(`员工晋升: ${data.row.name}`)
            },
            linkProps: {
              type: 'warning'
            }
          },
          {
            name: 'delete',
            text: '删除',
            onClick: (data: any) => {
              ElMessage.error(`删除员工: ${data.row.name}`)
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
.demo-advanced-search {
  padding: 20px;
}

.demo-advanced-search h3 {
  margin-bottom: 8px;
  color: #333;
}

.demo-advanced-search p {
  margin-bottom: 16px;
  color: #666;
  font-size: 14px;
}
</style>