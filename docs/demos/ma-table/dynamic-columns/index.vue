<script setup lang="tsx">
import {ref, computed, watch, nextTick} from 'vue'
import type {
  MaTableColumns,
  MaTableExpose,
  MaTableOptions
} from "@mineadmin/table"
import { ElMessage, ElButton, ElSwitch, ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption } from 'element-plus'

const tableRef = ref<MaTableExpose>()
const dialogVisible = ref(false)
const newColumn = ref({
  label: '',
  prop: '',
  width: '',
  align: 'center'
})

// 列显示控制
const columnVisibility = ref({
  name: true,
  age: true,
  email: true,
  department: true,
  salary: true,
  joinDate: true
})

// 基础列配置
const baseColumns: MaTableColumns[] = [
  { label: '姓名', prop: 'name', width: 120 },
  { label: '年龄', prop: 'age', width: 80 },
  { label: '邮箱', prop: 'email' },
  { label: '部门', prop: 'department', width: 120 },
  { 
    label: '薪资', 
    prop: 'salary',
    cellRender: ({ row }) => <span style="color: #e74c3c; font-weight: bold;">￥{row.salary}k</span>
  },
  { label: '入职时间', prop: 'joinDate', width: 120 }
]

// 动态列
const dynamicColumns = ref<MaTableColumns[]>([])

// 计算最终显示的列
const columns = computed(() => {
  const visibleBaseColumns = baseColumns.filter(col => 
    columnVisibility.value[col.prop as keyof typeof columnVisibility.value]
  )
  return [...visibleBaseColumns, ...dynamicColumns.value]
})

// 监听列变化并手动更新表格
watch(columns, (newColumns) => {
  nextTick(() => {
    if (tableRef.value) {
      tableRef.value.setColumns(newColumns)
    }
  })
}, { deep: true })


// 表格配置
const options = ref<MaTableOptions>({
  stripe: true,
  border: true,
  size: 'default'
})

// 示例数据
const data = ref([
  { 
    id: 1, name: '张三', age: 28, email: 'zhangsan@example.com', 
    department: '技术部', salary: 18, joinDate: '2023-01-15'
  },
  { 
    id: 2, name: '李四', age: 32, email: 'lisi@example.com', 
    department: '产品部', salary: 25, joinDate: '2022-08-20'
  },
  { 
    id: 3, name: '王五', age: 26, email: 'wangwu@example.com', 
    department: '设计部', salary: 16, joinDate: '2023-03-10'
  },
  { 
    id: 4, name: '赵六', age: 35, email: 'zhaoliu@example.com', 
    department: '技术部', salary: 30, joinDate: '2021-12-05'
  }
])
// 强制表格重新渲染的键
const tableKey = ref(true)
const forceRerender = () => {
  tableKey.value = false
  tableKey.value = true
}

// 切换列显示
const toggleColumn = (prop: string, visible: boolean) => {
  ElMessage.info(`${visible ? '显示' : '隐藏'} ${prop} 列`)
  // 强制重新渲染以确保列的显示隐藏生效
  nextTick(() => {
    forceRerender()
  })
}

// 添加动态列
const addDynamicColumn = () => {
  if (!newColumn.value.label || !newColumn.value.prop) {
    ElMessage.error('请填写完整的列信息')
    return
  }
  
  // 检查是否已存在
  const exists = [...baseColumns, ...dynamicColumns.value].some(col => 
    col.prop === newColumn.value.prop
  )
  
  if (exists) {
    ElMessage.error('该字段名已存在')
    return
  }
  
  const column: MaTableColumns = {
    label: newColumn.value.label,
    prop: newColumn.value.prop,
    align: newColumn.value.align as any,
    width: newColumn.value.width ? parseInt(newColumn.value.width) : undefined,
    cellRender: ({ row }) => {
      const value = row[newColumn.value.prop]
      return value !== undefined ? String(value) : '--'
    }
  }
  
  dynamicColumns.value.push(column)
  
  // 重置表单
  newColumn.value = {
    label: '',
    prop: '',
    width: '',
    align: 'center'
  }
  
  dialogVisible.value = false
  ElMessage.success('动态列添加成功')
}

// 删除动态列
const removeDynamicColumn = (prop: string) => {
  const index = dynamicColumns.value.findIndex(col => col.prop === prop)
  if (index > -1) {
    dynamicColumns.value.splice(index, 1)
    ElMessage.success('动态列删除成功')
    forceRerender()
  }
}

// 使用 Expose 方法动态操作
const useExposeMethod = (method: string) => {
  if (!tableRef.value) return
  
  switch (method) {
    case 'getColumns':
      const currentColumns = tableRef.value.getColumns()
      ElMessage.info(`当前共有 ${currentColumns.length} 列`)
      console.log('当前列配置：', currentColumns)
      break
      
    case 'appendColumn':
      const randomColumn: MaTableColumns = {
        label: `随机列${Date.now()}`,
        prop: `random_${Date.now()}`,
        cellRender: () => <el-tag type="success">随机</el-tag>
      }
      tableRef.value.appendColumn(randomColumn)
      ElMessage.success('使用 appendColumn 添加列成功')
      break
      
    case 'removeColumn':
      if (dynamicColumns.value.length > 0) {
        const lastColumn = dynamicColumns.value[dynamicColumns.value.length - 1]
        tableRef.value.removeColumn(lastColumn.prop as string)
        dynamicColumns.value.pop()
        ElMessage.success('使用 removeColumn 删除最后一列')
      } else {
        ElMessage.warning('没有可删除的动态列')
      }
      break
  }
}
</script>

<template>
  <div class="demo-dynamic-columns">
    <h3>动态列管理</h3>
    <p>展示如何动态控制列的显示隐藏、添加删除列，以及使用 Expose 方法进行列管理。</p>
    
    <!-- 列显示控制 -->
    <div class="control-panel">
      <div class="panel-section">
        <h4>列显示控制</h4>
        <div class="column-switches">
          <div v-for="(visible, key) in columnVisibility" :key="key" class="switch-item">
            <el-switch
              v-model="columnVisibility[key]"
              @change="(val) => toggleColumn(key, val)"
            />
            <span>{{ baseColumns.find(col => col.prop === key)?.label }}</span>
          </div>
        </div>
      </div>
      
      <div class="panel-section">
        <h4>动态列操作</h4>
        <div class="dynamic-buttons">
          <el-button type="primary" @click="dialogVisible = true">
            添加动态列
          </el-button>
          <el-button 
            type="danger" 
            :disabled="dynamicColumns.length === 0"
            @click="removeDynamicColumn(dynamicColumns[dynamicColumns.length - 1]?.prop!)"
          >
            删除最后一列
          </el-button>
        </div>
        
        <div class="dynamic-columns-list">
          <span v-if="dynamicColumns.length > 0">
            动态列：
            <el-tag 
              v-for="col in dynamicColumns" 
              :key="col.prop" 
              closable 
              @close="removeDynamicColumn(col.prop!)"
            >
              {{ col.label }}
            </el-tag>
          </span>
        </div>
      </div>
      
      <div class="panel-section">
        <h4>Expose 方法演示</h4>
        <div class="expose-buttons">
          <el-button size="small" @click="useExposeMethod('getColumns')">
            getColumns
          </el-button>
          <el-button size="small" @click="useExposeMethod('appendColumn')">
            appendColumn
          </el-button>
          <el-button size="small" @click="useExposeMethod('removeColumn')">
            removeColumn
          </el-button>
        </div>
      </div>
    </div>
    
    <ma-table
      ref="tableRef"
      v-show="tableKey"
      :columns="columns"
      :data="data"
      :options="options"
    />
    
    <!-- 添加列对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="添加动态列"
      width="400px"
    >
      <el-form :model="newColumn" label-width="80px">
        <el-form-item label="列标题" required>
          <el-input v-model="newColumn.label" placeholder="请输入列标题" />
        </el-form-item>
        <el-form-item label="字段名" required>
          <el-input v-model="newColumn.prop" placeholder="请输入字段名" />
        </el-form-item>
        <el-form-item label="列宽度">
          <el-input v-model="newColumn.width" placeholder="可选，如：120" />
        </el-form-item>
        <el-form-item label="对齐方式">
          <el-select v-model="newColumn.align" style="width: 100%">
            <el-option label="居左" value="left" />
            <el-option label="居中" value="center" />
            <el-option label="居右" value="right" />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addDynamicColumn">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.demo-dynamic-columns {
  padding: 20px;
}

.demo-dynamic-columns h3 {
  margin-bottom: 8px;
  color: #333;
}

.demo-dynamic-columns p {
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

.panel-section {
  margin-bottom: 20px;
}

.panel-section:last-child {
  margin-bottom: 0;
}

.panel-section h4 {
  margin-bottom: 12px;
  color: #333;
  font-size: 16px;
}

.column-switches {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.switch-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.switch-item span {
  font-size: 14px;
  color: #555;
}

.dynamic-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.dynamic-columns-list {
  font-size: 14px;
  color: #555;
}

.dynamic-columns-list .el-tag {
  margin-left: 8px;
}

.expose-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>