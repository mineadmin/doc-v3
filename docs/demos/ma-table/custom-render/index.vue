<script setup lang="tsx">
import { ref } from 'vue'
import type {
  MaTableColumns,
  MaTableExpose,
  MaTableOptions
} from "@mineadmin/table"
import { ElMessage, ElButton, ElProgress, ElImage, ElRate, ElTag } from 'element-plus'

const tableRef = ref<MaTableExpose>()

// 自定义渲染列配置
const columns = ref<MaTableColumns[]>([
  { 
    label: '头像', 
    prop: 'avatar',
    width: 80,
    cellRender: ({ row }) => (
      <el-image
        style="width: 40px; height: 40px; border-radius: 50%;"
        src={row.avatar}
        fit="cover"
        preview-src-list={[row.avatar]}
      />
    )
  },
  { label: '姓名', prop: 'name', width: 100 },
  { 
    label: '技能等级', 
    prop: 'skillLevel',
    headerRender: () => (
      <div style="display: flex; align-items: center; gap: 4px;">
        <span>⚡</span>
        <span style="color: #e74c3c;">技能等级</span>
      </div>
    ),
    cellRender: ({ row }) => (
      <el-progress
        percentage={row.skillLevel}
        color={
          row.skillLevel >= 80 ? '#67c23a' : 
          row.skillLevel >= 60 ? '#e6a23c' : '#f56c6c'
        }
        stroke-width={8}
        text-inside
      />
    )
  },
  { 
    label: '评价', 
    prop: 'rating',
    width: 140,
    cellRender: ({ row }) => (
      <el-rate
        v-model={row.rating}
        disabled
        show-score
        text-color="#ff9900"
        score-template="{value} 分"
      />
    )
  },
  { 
    label: '状态', 
    prop: 'status',
    cellRender: ({ row }) => {
      const statusConfig = {
        '在线': { type: 'success', icon: '🟢' },
        '忙碌': { type: 'warning', icon: '🟡' },
        '离线': { type: 'danger', icon: '🔴' }
      }
      const config = statusConfig[row.status as keyof typeof statusConfig]
      return (
        <el-tag type={config.type}>
          <span style="margin-right: 4px;">{config.icon}</span>
          {row.status}
        </el-tag>
      )
    }
  },
  { 
    label: '操作', 
    prop: 'actions',
    width: 180,
    cellRender: ({ row }) => (
      <div style="display: flex; gap: 8px;">
        <el-button 
          size="small" 
          type="primary"
          onClick={() => handleView(row)}
        >
          查看
        </el-button>
        <el-button 
          size="small" 
          type="success"
          onClick={() => handleEdit(row)}
        >
          编辑
        </el-button>
        <el-button 
          size="small" 
          type="danger"
          onClick={() => handleDelete(row)}
        >
          删除
        </el-button>
      </div>
    )
  }
])

// 表格配置
const options = ref<MaTableOptions>({
  stripe: true,
  border: true,
  showOverflowTooltip: false,
  rowStyle: ({ rowIndex }) => {
    return rowIndex % 2 === 0 ? { backgroundColor: '#fafafa' } : {}
  }
})

// 示例数据
const data: any[] = [
  { 
    id: 1, 
    name: '张小明', 
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    skillLevel: 85,
    rating: 4.5,
    status: '在线'
  },
  { 
    id: 2, 
    name: '李小红', 
    avatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
    skillLevel: 72,
    rating: 4.2,
    status: '忙碌'
  },
  { 
    id: 3, 
    name: '王小刚', 
    avatar: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    skillLevel: 91,
    rating: 4.8,
    status: '在线'
  },
  { 
    id: 4, 
    name: '赵小丽', 
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    skillLevel: 45,
    rating: 3.6,
    status: '离线'
  },
  { 
    id: 5, 
    name: '孙小华', 
    avatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
    skillLevel: 68,
    rating: 4.0,
    status: '在线'
  }
]

// 操作方法
const handleView = (row: any) => {
  ElMessage.info(`查看用户：${row.name}`)
}

const handleEdit = (row: any) => {
  ElMessage.success(`编辑用户：${row.name}`)
}

const handleDelete = (row: any) => {
  ElMessage.error(`删除用户：${row.name}`)
}
</script>

<template>
  <div class="demo-custom-render-table">
    <h3>自定义渲染</h3>
    <p>展示如何使用 cellRender 和 headerRender 进行自定义单元格和表头渲染。</p>
    
    <div class="demo-features">
      <ul>
        <li><strong>图片渲染</strong>：头像列使用 ElImage 组件展示图片</li>
        <li><strong>进度条渲染</strong>：技能等级使用 ElProgress 进度条展示</li>
        <li><strong>评分渲染</strong>：评价列使用 ElRate 星级评分组件</li>
        <li><strong>状态标签</strong>：状态列使用带图标的 ElTag 组件</li>
        <li><strong>操作按钮</strong>：操作列使用多个操作按钮</li>
        <li><strong>自定义表头</strong>：技能等级表头使用了图标和颜色</li>
      </ul>
    </div>
    
    <ma-table
      ref="tableRef"
      :columns="columns"
      :data="data"
      :options="options"
    />

    <div class="render-code-example">
      <h4>cellRender 示例：</h4>
      <pre><code>cellRender: ({ row }) => (
  &lt;el-progress
    percentage={row.skillLevel}
    color={row.skillLevel >= 80 ? '#67c23a' : '#e6a23c'}
    stroke-width={8}
    text-inside
  /&gt;
)</code></pre>
    </div>
  </div>
</template>

<style scoped>
.demo-custom-render-table {
  padding: 20px;
}
.demo-custom-render-table h3 {
  margin-bottom: 8px;
  color: #333;
}
.demo-custom-render-table p {
  margin-bottom: 16px;
  color: #666;
  font-size: 14px;
}

.demo-features {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 20px;
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

.render-code-example {
  margin-top: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
}

.render-code-example h4 {
  margin-bottom: 12px;
  color: #333;
  font-size: 16px;
}

.render-code-example pre {
  background: #2d3748;
  color: #e2e8f0;
  padding: 16px;
  border-radius: 4px;
  font-size: 13px;
  overflow-x: auto;
  margin: 0;
}
</style>