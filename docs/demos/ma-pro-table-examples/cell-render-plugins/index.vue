<template>
  <div class="demo-cell-render-plugins">
    <h3>单元格渲染插件</h3>
    <p>展示各种单元格渲染插件的使用方法，包含内置插件和自定义插件。</p>
    
    <div class="plugin-info">
      <el-alert 
        title="插件说明" 
        type="info" 
        description="本示例展示了多种单元格渲染插件的用法，包括标签、进度条、图片、评分等。"
        show-icon
        :closable="false"
      />
    </div>
    
    <MaProTable ref="tableRef" :options="options" :schema="schema" />
  </div>
</template>

<script setup lang="tsx">
import { ref, reactive, onMounted } from 'vue'
import type { MaProTableExpose, MaProTableOptions, MaProTableSchema } from "@mineadmin/pro-table"
import { useProTableRenderPlugin } from '@mineadmin/pro-table'
import { ElMessage, ElProgress, ElRate, ElImage, ElSwitch, ElLink } from 'element-plus'
import { h } from 'vue'

const tableRef = ref<MaProTableExpose>()
const { addPlugin } = useProTableRenderPlugin()

// 注册自定义渲染插件
onMounted(() => {
  // 进度条插件
  addPlugin({
    name: 'progress',
    render: (data: any, props: any) => {
      return h(ElProgress, {
        percentage: data.row[data.column.property] || 0,
        color: props?.color || '#409eff',
        strokeWidth: props?.strokeWidth || 10,
        textInside: props?.textInside !== false,
        ...props
      })
    }
  })

  // 评分插件
  addPlugin({
    name: 'rate',
    render: (data: any, props: any) => {
      return h(ElRate, {
        modelValue: data.row[data.column.property] || 0,
        disabled: true,
        showScore: props?.showScore !== false,
        scoreTemplate: props?.scoreTemplate || '{value} 分',
        ...props
      })
    }
  })

  // 图片插件
  addPlugin({
    name: 'image',
    render: (data: any, props: any) => {
      const src = data.row[data.column.property]
      if (!src) return '暂无图片'
      return h(ElImage, {
        src,
        style: { width: '60px', height: '40px' },
        fit: 'cover',
        previewSrcList: [src],
        ...props
      })
    }
  })

  // 开关插件
  addPlugin({
    name: 'switch',
    render: (data: any, props: any, proxy: any) => {
      return h(ElSwitch, {
        modelValue: !!data.row[data.column.property],
        onChange: (value: boolean) => {
          ElMessage.success(`${data.row.name} 的 ${data.column.label} 已${value ? '开启' : '关闭'}`)
        },
        ...props
      })
    }
  })

  // 链接插件
  addPlugin({
    name: 'link',
    render: (data: any, props: any) => {
      const text = data.row[data.column.property]
      return h(ElLink, {
        type: props?.type || 'primary',
        href: props?.href || '#',
        target: props?.target || '_blank',
        onClick: () => {
          if (props?.onClick) {
            props.onClick(data)
          } else {
            ElMessage.info(`点击链接: ${text}`)
          }
        },
        ...props
      }, {
        default: () => text
      })
    }
  })

  // 多标签插件
  addPlugin({
    name: 'tags',
    render: (data: any, props: any) => {
      const tags = data.row[data.column.property] || []
      if (!Array.isArray(tags)) return '无标签'
      
      return h('div', tags.map((tag: string, index: number) => 
        h('el-tag', {
          key: index,
          size: 'small',
          type: props?.type || 'primary',
          style: 'margin-right: 4px; margin-bottom: 2px;',
          ...props
        }, {
          default: () => tag
        })
      ))
    }
  })
})

// 模拟 API 接口
const getPluginsList = async (params: any) => {
  console.log('插件列表参数:', params)
  
  const data = [
    { 
      id: 1, 
      name: '张三',
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      department: '技术部',
      skills: ['Vue', 'React', 'TypeScript'],
      progress: 85,
      rating: 4.5,
      status: 1,
      isVip: true,
      website: 'https://github.com/zhangsan',
      description: '资深前端工程师，擅长Vue和React开发',
      level: 'senior'
    },
    { 
      id: 2, 
      name: '李四',
      avatar: 'https://cube.elemecdn.com/1/8c/f7e5a9b8b3f3a3d3e3f3a3d3e3fpng.png',
      department: '产品部',
      skills: ['产品设计', '用户研究'],
      progress: 92,
      rating: 4.8,
      status: 1,
      isVip: false,
      website: 'https://github.com/lisi',
      description: '资深产品经理，专注用户体验设计',
      level: 'expert'
    },
    { 
      id: 3, 
      name: '王五',
      avatar: 'https://cube.elemecdn.com/2/a0/9c0f9b0a0e0f0b0a0e0f0b0a0e0png.png',
      department: '设计部',
      skills: ['UI设计', 'Figma', 'Sketch'],
      progress: 78,
      rating: 4.2,
      status: 0,
      isVip: true,
      website: 'https://dribbble.com/wangwu',
      description: 'UI设计师，专注界面设计和用户体验',
      level: 'intermediate'
    },
    { 
      id: 4, 
      name: '赵六',
      avatar: 'https://cube.elemecdn.com/3/7a/bc0f0a0e0f0b0a0e0f0b0a0e0f0png.png',
      department: '技术部',
      skills: ['Java', 'Spring', 'Kubernetes'],
      progress: 95,
      rating: 4.9,
      status: 1,
      isVip: true,
      website: 'https://github.com/zhaoliu',
      description: '架构师，负责系统架构设计和技术选型',
      level: 'expert'
    },
    { 
      id: 5, 
      name: '孙七',
      avatar: 'https://cube.elemecdn.com/4/5b/3c0f0a0e0f0b0a0e0f0b0a0e0f0png.png',
      department: '运营部',
      skills: ['数据分析', '用户增长'],
      progress: 88,
      rating: 4.6,
      status: 1,
      isVip: false,
      website: 'https://github.com/sunqi',
      description: '运营专家，专注数据分析和用户增长',
      level: 'senior'
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
    api: getPluginsList,
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
    mainTitle: '渲染插件示例',
    subTitle: '展示各种单元格渲染效果'
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
      label: '等级',
      prop: 'level',
      render: 'select',
      renderProps: {
        options: [
          { label: '初级', value: 'intermediate' },
          { label: '高级', value: 'senior' },
          { label: '专家', value: 'expert' }
        ]
      }
    }
  ],
  tableColumns: [
    { label: 'ID', prop: 'id', width: 60 },
    { 
      label: '头像', 
      prop: 'avatar', 
      width: 100,
      cellRenderTo: {
        name: 'image',
        props: {
          style: { width: '50px', height: '50px', borderRadius: '50%' }
        }
      }
    },
    { label: '姓名', prop: 'name', width: 100 },
    { 
      label: '部门标签', 
      prop: 'department', 
      width: 120,
      cellRenderTo: {
        name: 'tag',
        props: (data: any) => ({
          type: data.row.department === '技术部' ? 'primary' : 
                data.row.department === '产品部' ? 'success' :
                data.row.department === '设计部' ? 'warning' : 'info'
        })
      }
    },
    { 
      label: '技能标签', 
      prop: 'skills', 
      width: 200,
      cellRenderTo: {
        name: 'tags',
        props: {
          type: 'info'
        }
      }
    },
    { 
      label: '工作进度', 
      prop: 'progress', 
      width: 150,
      cellRenderTo: {
        name: 'progress',
        props: (data: any) => ({
          color: data.row.progress >= 90 ? '#67c23a' : 
                 data.row.progress >= 80 ? '#e6a23c' : '#f56c6c',
          strokeWidth: 12,
          textInside: true
        })
      }
    },
    { 
      label: '能力评分', 
      prop: 'rating', 
      width: 150,
      cellRenderTo: {
        name: 'rate',
        props: {
          showScore: true,
          scoreTemplate: '{value} 分'
        }
      }
    },
    { 
      label: '在职状态', 
      prop: 'status', 
      width: 100,
      cellRenderTo: {
        name: 'switch',
        props: (data: any) => ({
          activeText: '在职',
          inactiveText: '离职'
        })
      }
    },
    { 
      label: 'VIP状态', 
      prop: 'isVip', 
      width: 100,
      cellRenderTo: {
        name: 'tag',
        props: (data: any) => ({
          type: data.row.isVip ? 'warning' : 'info'
        })
      },
      formatter: (row: any) => row.isVip ? 'VIP' : '普通'
    },
    { 
      label: '个人主页', 
      prop: 'website', 
      width: 120,
      cellRenderTo: {
        name: 'link',
        props: (data: any) => ({
          type: 'primary',
          href: data.row.website,
          target: '_blank',
          onClick: (linkData: any) => {
            ElMessage.success(`访问 ${linkData.row.name} 的主页`)
          }
        })
      },
      formatter: (row: any) => '访问主页'
    },
    { 
      label: '等级', 
      prop: 'level', 
      width: 100,
      cellRenderTo: {
        name: 'tag',
        props: (data: any) => {
          const levelMap = {
            intermediate: { type: 'info', text: '初级' },
            senior: { type: 'warning', text: '高级' },
            expert: { type: 'danger', text: '专家' }
          }
          return {
            type: levelMap[data.row.level]?.type || 'info'
          }
        }
      },
      formatter: (row: any) => {
        const levelMap = {
          intermediate: '初级',
          senior: '高级',
          expert: '专家'
        }
        return levelMap[row.level] || row.level
      }
    },
    { 
      label: '描述', 
      prop: 'description', 
      width: 250,
      showOverflowTooltip: true
    },
    {
      type: 'operation',
      label: '操作',
      width: 180,
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
            name: 'promote',
            text: '晋升',
            show: (data: any) => data.row.level !== 'expert',
            onClick: (data: any) => {
              ElMessage.warning(`晋升员工: ${data.row.name}`)
            },
            linkProps: {
              type: 'warning'
            }
          }
        ]
      }
    }
  ]
})
</script>

<style scoped>
.demo-cell-render-plugins {
  padding: 20px;
}

.demo-cell-render-plugins h3 {
  margin-bottom: 8px;
  color: #333;
}

.demo-cell-render-plugins p {
  margin-bottom: 16px;
  color: #666;
  font-size: 14px;
}

.plugin-info {
  margin-bottom: 20px;
}
</style>