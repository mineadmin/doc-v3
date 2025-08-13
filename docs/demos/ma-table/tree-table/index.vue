<script setup lang="tsx">
import {nextTick, ref, toRaw} from 'vue'
import type {
  MaTableColumns,
  MaTableExpose,
  MaTableOptions
} from "@mineadmin/table"
import { ElMessage, ElButton, ElTag, ElIcon } from 'element-plus'

const tableRef = ref<MaTableExpose>()

// 树形表格列配置
const columns = ref<MaTableColumns[]>([
  { 
    label: '部门名称', 
    prop: 'name',
    width: 250,
    cellRender: ({ row }) => (
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 16px;">{row.icon}</span>
        <span style="font-weight: row.children ? 'bold' : 'normal';">
          {row.name}
        </span>
        {row.isNew && <el-tag size="small" type="success">新</el-tag>}
      </div>
    )
  },
  { 
    label: '负责人', 
    prop: 'manager',
    cellRender: ({ row }) => row.manager || '--'
  },
  { 
    label: '员工数', 
    prop: 'employeeCount',
    width: 100,
    cellRender: ({ row }) => (
      <span style={`color: ${row.employeeCount > 10 ? '#e74c3c' : '#27ae60'}`}>
        {row.employeeCount}人
      </span>
    )
  },
  { 
    label: '预算', 
    prop: 'budget',
    width: 120,
    cellRender: ({ row }) => row.budget ? (
      <span style="color: #f39c12; font-weight: bold;">
        ￥{row.budget}万
      </span>
    ) : '--'
  },
  { 
    label: '状态', 
    prop: 'status',
    width: 100,
    cellRender: ({ row }) => {
      const statusConfig = {
        'active': { type: 'success', text: '正常' },
        'pending': { type: 'warning', text: '筹建中' },
        'inactive': { type: 'danger', text: '已撤销' }
      }
      const config = statusConfig[row.status as keyof typeof statusConfig]
      return <el-tag type={config.type}>{config.text}</el-tag>
    }
  },
  { 
    label: '操作', 
    prop: 'actions',
    width: 180,
    cellRender: ({ row }) => (
      <div style="display: flex; gap: 8px;">
        <el-button size="small" type="primary" onClick={() => handleEdit(row)}>
          编辑
        </el-button>
        {!row.children?.length && (
          <el-button size="small" type="success" onClick={() => handleAddChild(row)}>
            添加子部门
          </el-button>
        )}
        <el-button size="small" type="danger" onClick={() => handleDelete(row)}>
          删除
        </el-button>
      </div>
    )
  }
])

// 树形表格配置
const options = ref<MaTableOptions>({
  stripe: true,
  border: true,
  rowKey: 'id',
  defaultExpandAll: false,
  treeProps: {
    children: 'children',
    hasChildren: 'hasChildren'
  },
  // 可以设置默认展开的行
  expandRowKeys: [1, 2],
  on: {
    onExpand: (row, expanded) => {
      ElMessage.info(`${row.name} ${expanded ? '展开' : '收起'}`)
    }
  }
})

// 树形数据
const treeData: any[] = [
  {
    id: 1,
    name: '总公司',
    icon: '🏢',
    manager: '张总',
    employeeCount: 150,
    budget: 5000,
    status: 'active',
    isNew: false,
    children: [
      {
        id: 11,
        name: '技术部',
        icon: '💻',
        manager: '李技术',
        employeeCount: 45,
        budget: 1500,
        status: 'active',
        isNew: false,
        children: [
          {
            id: 111,
            name: '前端组',
            icon: '🎨',
            manager: '王前端',
            employeeCount: 15,
            budget: 500,
            status: 'active',
            isNew: false
          },
          {
            id: 112,
            name: '后端组',
            icon: '⚙️',
            manager: '赵后端',
            employeeCount: 20,
            budget: 600,
            status: 'active',
            isNew: true
          },
          {
            id: 113,
            name: '运维组',
            icon: '🔧',
            manager: '孙运维',
            employeeCount: 10,
            budget: 400,
            status: 'active',
            isNew: false
          }
        ]
      },
      {
        id: 12,
        name: '产品部',
        icon: '📊',
        manager: '刘产品',
        employeeCount: 25,
        budget: 800,
        status: 'active',
        isNew: false,
        children: [
          {
            id: 121,
            name: '产品设计组',
            icon: '🎯',
            manager: '周设计',
            employeeCount: 12,
            budget: 400,
            status: 'active',
            isNew: false
          },
          {
            id: 122,
            name: '数据分析组',
            icon: '📈',
            manager: '吴分析',
            employeeCount: 13,
            budget: 400,
            status: 'pending',
            isNew: true
          }
        ]
      },
      {
        id: 13,
        name: '市场部',
        icon: '📢',
        manager: '郑市场',
        employeeCount: 30,
        budget: 1000,
        status: 'active',
        isNew: false,
        children: [
          {
            id: 131,
            name: '品牌推广组',
            icon: '🌟',
            manager: '钱推广',
            employeeCount: 18,
            budget: 600,
            status: 'active',
            isNew: false
          },
          {
            id: 132,
            name: '商务拓展组',
            icon: '🤝',
            manager: '陈商务',
            employeeCount: 12,
            budget: 400,
            status: 'active',
            isNew: false
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: '分公司A',
    icon: '🏬',
    manager: '林总',
    employeeCount: 80,
    budget: 2000,
    status: 'active',
    isNew: false,
    children: [
      {
        id: 21,
        name: '销售部',
        icon: '💰',
        manager: '何销售',
        employeeCount: 35,
        budget: 800,
        status: 'active',
        isNew: false
      },
      {
        id: 22,
        name: '客服部',
        icon: '📞',
        manager: '韩客服',
        employeeCount: 25,
        budget: 600,
        status: 'active',
        isNew: false
      },
      {
        id: 23,
        name: '财务部',
        icon: '💼',
        manager: '曹财务',
        employeeCount: 20,
        budget: 600,
        status: 'active',
        isNew: false
      }
    ]
  },
  {
    id: 3,
    name: '分公司B',
    icon: '🏬',
    manager: '梁总',
    employeeCount: 0,
    budget: 0,
    status: 'pending',
    isNew: true,
    hasChildren: false
  }
]

const data = ref([...treeData])

// 操作方法
const handleEdit = (row: any) => {
  ElMessage.info(`编辑部门：${row.name}`)
}

const handleAddChild = (row: any) => {
  const newChild = {
    id: Date.now(),
    name: `新子部门${Math.floor(Math.random() * 100)}`,
    icon: '🏛️',
    manager: '新负责人',
    employeeCount: Math.floor(Math.random() * 20) + 1,
    budget: Math.floor(Math.random() * 500) + 100,
    status: 'pending',
    isNew: true,
    children: []
  }
  
  if (!row.children) {
    row.children = []
  }
  row.children.push(newChild)
  
  // 更新数据以触发重新渲染
  data.value = [...data.value]
  
  ElMessage.success(`已为 ${row.name} 添加子部门`)
}

const handleDelete = (row: any) => {
  ElMessage.warning(`删除部门：${row.name}`)
}

// 展开/收起所有
const expandAll = async () => {
  await nextTick()
  try {
    const elTable = toRaw(tableRef.value.getElTableRef())
    console.log('展开所有 - 表格实例已准备:', elTable)

    const getAllRowsWithChildren = (nodes: any[]): any[] => {
      const rows: any[] = []
      nodes.forEach(node => {
        if (node.children?.length) {
          rows.push(node)
          rows.push(...getAllRowsWithChildren(node.children))
        }
      })
      return rows
    }

    const allRowsWithChildren = getAllRowsWithChildren(data.value)
    console.log('需要展开的行:', allRowsWithChildren.map(r => r.name))

    // 逐个展开，添加小延时确保每个操作都能执行
    for (const row of allRowsWithChildren) {
      console.log('正在展开:', row.name)
      elTable.toggleRowExpansion(row, true)
      await new Promise(resolve => setTimeout(resolve, 10)) // 10ms延时
    }

    ElMessage.success(`已展开所有节点 (共${allRowsWithChildren.length}个)`)
  } catch (error) {
    console.error('展开失败:', error)
    ElMessage.error('展开失败：' + error.message)
  }
}

const collapseAll = async () => {
  try {
    await nextTick()
    const elTable = toRaw(tableRef.value.getElTableRef())
    console.log('收起所有 - 表格实例已准备:', elTable)

    const getAllRowsWithChildren = (nodes: any[]): any[] => {
      const rows: any[] = []
      nodes.forEach(node => {
        if (node.children?.length) {
          rows.push(node)
          rows.push(...getAllRowsWithChildren(node.children))
        }
      })
      return rows
    }

    const allRowsWithChildren = getAllRowsWithChildren(data.value)
    console.log('需要收起的行:', allRowsWithChildren.map(r => r.name))

    // 反向遍历，先收起子节点再收起父节点，添加小延时
    const reversedRows = [...allRowsWithChildren].reverse()
    for (const row of reversedRows) {
      console.log('正在收起:', row.name)
      elTable.toggleRowExpansion(row, false)
      await new Promise(resolve => setTimeout(resolve, 10)) // 10ms延时
    }

    ElMessage.success(`已收起所有节点 (共${allRowsWithChildren.length}个)`)
  } catch (error) {
    console.error('收起失败:', error)
    ElMessage.error('收起失败：' + error.message)
  }
}

// 获取选中的行
const getSelectedRows = () => {
  const tableInstance = tableRef.value?.getElTableRef()
  console.log('树形表格实例：', tableInstance)
  ElMessage.info('请查看控制台输出')
}
</script>

<template>
  <div class="demo-tree-table">
    <h3>树形表格</h3>
    <p>展示层级结构数据，支持展开收起、懒加载、自定义图标等功能。</p>
    
    <!-- 控制面板 -->
    <div class="control-panel">
      <div class="panel-section">
        <h4>树形控制</h4>
        <div class="tree-buttons">
          <el-button type="primary" @click="expandAll">
            展开所有
          </el-button>
          <el-button @click="collapseAll">
            收起所有
          </el-button>
          <el-button type="info" @click="getSelectedRows">
            获取表格实例
          </el-button>
        </div>
      </div>
    </div>
    
    <ma-table
      ref="tableRef"
      :columns="columns"
      :data="data"
      :options="options"
    />
    
    <div class="demo-features">
      <h4>功能特性：</h4>
      <ul>
        <li><strong>层级结构</strong>：支持多级嵌套的树形数据展示</li>
        <li><strong>展开控制</strong>：可控制默认展开状态和动态展开收起</li>
        <li><strong>自定义图标</strong>：每个节点可配置自定义图标</li>
        <li><strong>状态标识</strong>：新增节点、不同状态的视觉标识</li>
        <li><strong>层级操作</strong>：支持为节点添加子节点</li>
        <li><strong>懒加载</strong>：可配置 hasChildren 实现懒加载（示例中未启用）</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.demo-tree-table {
  padding: 20px;
}

.demo-tree-table h3 {
  margin-bottom: 8px;
  color: #333;
}

.demo-tree-table p {
  margin-bottom: 16px;
  color: #666;
  font-size: 14px;
}

.control-panel {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.panel-section h4 {
  margin-bottom: 12px;
  color: #333;
  font-size: 16px;
}

.tree-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.demo-features {
  margin-top: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
}

.demo-features h4 {
  margin-bottom: 12px;
  color: #333;
  font-size: 16px;
}

.demo-features ul {
  margin: 0;
  padding-left: 20px;
}

.demo-features li {
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
}
</style>