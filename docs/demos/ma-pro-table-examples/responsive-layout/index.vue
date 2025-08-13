<template>
  <div class="demo-responsive-layout">
    <h3>响应式布局</h3>
    <p>展示表格在不同屏幕尺寸下的响应式表现，包含移动端适配和布局优化。</p>
    
    <!-- 设备模拟器 -->
    <div class="device-simulator">
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>设备模拟器</span>
            <el-space>
              <el-button-group>
                <el-button 
                  :type="currentDevice === 'desktop' ? 'primary' : 'default'"
                  @click="switchDevice('desktop')"
                >
                  <el-icon><Monitor /></el-icon>
                  桌面端
                </el-button>
                <el-button 
                  :type="currentDevice === 'tablet' ? 'primary' : 'default'"
                  @click="switchDevice('tablet')"
                >
                  <el-icon></el-icon>
                  平板
                </el-button>
                <el-button 
                  :type="currentDevice === 'mobile' ? 'primary' : 'default'"
                  @click="switchDevice('mobile')"
                >
                  <el-icon><Iphone /></el-icon>
                  手机
                </el-button>
              </el-button-group>
              <el-text type="info">当前宽度: {{ containerWidth }}px</el-text>
            </el-space>
          </div>
        </template>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-statistic title="当前设备" :value="deviceInfo.name" />
          </el-col>
          <el-col :span="8">
            <el-statistic title="屏幕类型" :value="deviceInfo.type" />
          </el-col>
          <el-col :span="8">
            <el-statistic title="推荐列数" :value="deviceInfo.columns" />
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 响应式容器 -->
    <div 
      class="responsive-container" 
      :class="currentDevice"
      :style="{ width: containerWidth + 'px' }"
    >
      <MaProTable 
        ref="tableRef" 
        :options="options" 
        :schema="schema"
        :key="currentDevice"
      />
    </div>
  </div>
</template>

<script setup lang="tsx">
import { ref, reactive, computed, watch } from 'vue'
import type { MaProTableExpose, MaProTableOptions, MaProTableSchema } from "@mineadmin/pro-table"
import { ElMessage, ElNotification } from 'element-plus'
import { Monitor, Iphone, View, Edit, Delete } from '@element-plus/icons-vue'

const tableRef = ref<MaProTableExpose>()
const currentDevice = ref<'desktop' | 'tablet' | 'mobile'>('desktop')

// 设备配置
const deviceConfigs = {
  desktop: { width: 1200, name: '桌面端', type: '大屏幕', columns: 8 },
  tablet: { width: 768, name: '平板', type: '中等屏幕', columns: 5 },
  mobile: { width: 375, name: '手机', type: '小屏幕', columns: 3 }
}

// 当前设备信息
const deviceInfo = computed(() => deviceConfigs[currentDevice.value])
const containerWidth = computed(() => deviceConfigs[currentDevice.value].width)

// 切换设备
const switchDevice = (device: 'desktop' | 'tablet' | 'mobile') => {
  currentDevice.value = device
  ElMessage.info(`切换到${deviceConfigs[device].name}视图`)
}

// 监听设备变化，调整表格配置
watch(currentDevice, (newDevice) => {
  // 根据设备调整搜索项显示数量
  const showNumber = newDevice === 'desktop' ? 4 : newDevice === 'tablet' ? 2 : 1
  options.searchOptions = {
    ...options.searchOptions,
    showNumber,
    layout: newDevice === 'mobile' ? 'vertical' : 'auto'
  }
  
  // 根据设备调整表格列
  updateTableColumns(newDevice)
})

// 更新表格列配置
const updateTableColumns = (device: 'desktop' | 'tablet' | 'mobile') => {
  const baseColumns = [
    { label: 'ID', prop: 'id', width: 60 },
    { label: '姓名', prop: 'name', width: 100, fixed: 'left' },
    { label: '部门', prop: 'department', width: 100 },
    { label: '职位', prop: 'position', width: 150 },
    { 
      label: '薪资', 
      prop: 'salary', 
      width: 120, 
      formatter: (row: any) => `￥${row.salary.toLocaleString()}`,
      sortable: true
    },
    { 
      label: '技能', 
      prop: 'skills', 
      width: 180,
      cellRender: ({ row }: any) => (
        <div>
          {(row.skills || []).slice(0, device === 'mobile' ? 1 : 3).map((skill: string, index: number) => (
            <el-tag key={index} size="small" style="margin-right: 4px; margin-bottom: 2px;">
              {skill}
            </el-tag>
          ))}
          {row.skills && row.skills.length > (device === 'mobile' ? 1 : 3) && (
            <el-tag size="small" type="info">+{row.skills.length - (device === 'mobile' ? 1 : 3)}</el-tag>
          )}
        </div>
      )
    },
    { 
      label: '状态', 
      prop: 'status', 
      width: 80,
      cellRenderTo: {
        name: 'tag',
        props: (data: any) => ({
          type: data.row.status === 1 ? 'success' : 'info',
          size: device === 'mobile' ? 'small' : 'default'
        })
      },
      formatter: (row: any) => row.status === 1 ? '在职' : '离职'
    },
    { label: '入职时间', prop: 'createTime', width: 120 },
    { label: '最后活跃', prop: 'lastActive', width: 160 },
    { label: '邮箱', prop: 'email', width: 200, showOverflowTooltip: true },
    { label: '电话', prop: 'phone', width: 140 }
  ]
  
  const operationColumn = {
    type: 'operation' as const,
    label: '操作',
    width: device === 'mobile' ? 120 : device === 'tablet' ? 160 : 200,
    fixed: 'right' as const,
    operationConfigure: {
      type: device === 'mobile' ? 'dropdown' : 'auto',
      fold: device === 'mobile' ? 1 : device === 'tablet' ? 2 : 3,
      actions: [
        {
          name: 'view',
          text: device === 'mobile' ? '查看' : '详情',
          icon: 'view',
          onClick: (data: any) => {
            ElMessage.info(`查看员工: ${data.row.name}`)
          }
        },
        {
          name: 'edit',
          text: '编辑',
          icon: 'edit',
          onClick: (data: any) => {
            ElMessage.success(`编辑员工: ${data.row.name}`)
          }
        },
        {
          name: 'contact',
          text: '联系',
          show: () => device !== 'mobile',
          onClick: (data: any) => {
            ElNotification({
              title: '联系信息',
              message: `邮箱: ${data.row.email}\n电话: ${data.row.phone}`,
              type: 'info',
              duration: 3000
            })
          }
        },
        {
          name: 'delete',
          text: '删除',
          icon: 'delete',
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
  
  // 根据设备过滤列
  let visibleColumns
  if (device === 'mobile') {
    visibleColumns = [
      baseColumns[0], // ID
      baseColumns[1], // 姓名
      baseColumns[2], // 部门
      baseColumns[6], // 状态
      operationColumn
    ]
  } else if (device === 'tablet') {
    visibleColumns = [
      baseColumns[0], // ID
      baseColumns[1], // 姓名
      baseColumns[2], // 部门
      baseColumns[3], // 职位
      baseColumns[4], // 薪资
      baseColumns[6], // 状态
      operationColumn
    ]
  } else {
    visibleColumns = [...baseColumns, operationColumn]
  }
  
  schema.tableColumns = visibleColumns
}

// 模拟 API 接口
const getResponsiveList = async (params: any) => {
  console.log('响应式列表参数:', params)
  
  const data = [
    { 
      id: 1, 
      name: '张三', 
      department: '技术部', 
      position: '前端工程师', 
      salary: 15000, 
      status: 1, 
      createTime: '2024-01-15',
      lastActive: '2024-01-20 14:30',
      email: 'zhangsan@company.com',
      phone: '13800138001',
      skills: ['Vue', 'React', 'TypeScript', 'Node.js']
    },
    { 
      id: 2, 
      name: '李四', 
      department: '产品部', 
      position: '产品经理', 
      salary: 18000, 
      status: 1, 
      createTime: '2024-01-16',
      lastActive: '2024-01-20 16:45',
      email: 'lisi@company.com',
      phone: '13800138002',
      skills: ['产品设计', '用户研究', '数据分析']
    },
    { 
      id: 3, 
      name: '王五', 
      department: '设计部', 
      position: 'UI设计师', 
      salary: 12000, 
      status: 0, 
      createTime: '2024-01-17',
      lastActive: '2024-01-19 10:15',
      email: 'wangwu@company.com',
      phone: '13800138003',
      skills: ['UI设计', 'Figma', 'Sketch', 'Principle']
    },
    { 
      id: 4, 
      name: '赵六', 
      department: '技术部', 
      position: '后端工程师', 
      salary: 16000, 
      status: 1, 
      createTime: '2024-01-18',
      lastActive: '2024-01-20 18:20',
      email: 'zhaoliu@company.com',
      phone: '13800138004',
      skills: ['Java', 'Spring', 'MySQL', 'Redis']
    },
    { 
      id: 5, 
      name: '孙七', 
      department: '运营部', 
      position: '运营专员', 
      salary: 10000, 
      status: 1, 
      createTime: '2024-01-19',
      lastActive: '2024-01-20 12:10',
      email: 'sunqi@company.com',
      phone: '13800138005',
      skills: ['数据分析', '用户运营', 'SQL']
    },
    { 
      id: 6, 
      name: '周八', 
      department: '财务部', 
      position: '财务专员', 
      salary: 9000, 
      status: 1, 
      createTime: '2024-01-10',
      lastActive: '2024-01-20 09:30',
      email: 'zhouba@company.com',
      phone: '13800138006',
      skills: ['财务分析', 'Excel', '税务处理']
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
    }, 500)
  })
}

// 组件配置
const options = reactive<MaProTableOptions>({
  requestOptions: {
    api: getResponsiveList,
    autoRequest: true,
    response: {
      totalKey: 'data.total',
      dataKey: 'data.list'
    }
  },
  tableOptions: {
    adaption: true,
    pagination: {
      total: 0,
      pageSize: 10,
      layout: 'total, sizes, prev, pager, next'
    }
  },
  searchOptions: {
    showNumber: 4,
    layout: 'auto'
  },
  header: {
    show: true,
    mainTitle: '响应式员工表格',
    subTitle: '适配不同设备屏幕'
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
          { label: '运营部', value: '运营部' },
          { label: '财务部', value: '财务部' }
        ]
      }
    },
    {
      label: '状态',
      prop: 'status',
      render: 'select',
      renderProps: {
        options: [
          { label: '在职', value: 1 },
          { label: '离职', value: 0 }
        ]
      }
    },
    {
      label: '薪资范围',
      prop: 'salaryRange',
      render: 'input-number-range',
      renderProps: {
        startPlaceholder: '最低',
        endPlaceholder: '最高'
      }
    }
  ],
  tableColumns: [] // 将通过 updateTableColumns 动态设置
})

// 初始化表格列
updateTableColumns(currentDevice.value)
</script>

<style scoped>
.demo-responsive-layout {
  padding: 20px;
}

.demo-responsive-layout h3 {
  margin-bottom: 8px;
  color: #333;
}

.demo-responsive-layout p {
  margin-bottom: 16px;
  color: #666;
  font-size: 14px;
}

.device-simulator {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.responsive-container {
  margin: 0 auto;
  border: 2px dashed #e4e7ed;
  border-radius: 8px;
  overflow-x: auto;
  transition: all 0.3s ease;
}

.responsive-container.desktop {
  border-color: #409eff;
}

.responsive-container.tablet {
  border-color: #e6a23c;
}

.responsive-container.mobile {
  border-color: #f56c6c;
}

/* 移动端特殊样式 */
.responsive-container.mobile :deep(.ma-pro-table) {
  font-size: 14px;
}

.responsive-container.mobile :deep(.el-table th),
.responsive-container.mobile :deep(.el-table td) {
  padding: 8px 4px;
}

.responsive-container.mobile :deep(.el-pagination) {
  text-align: center;
}

/* 平板端特殊样式 */
.responsive-container.tablet :deep(.el-table th),
.responsive-container.tablet :deep(.el-table td) {
  padding: 10px 6px;
}
</style>