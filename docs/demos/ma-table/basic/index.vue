<script setup lang="tsx">
import { ref } from 'vue'
import type {
  MaTableColumns,
  MaTableExpose,
  MaTableOptions
} from "@mineadmin/table"

const tableRef = ref<MaTableExpose>()

// 基础列配置
const columns = ref<MaTableColumns[]>([
  { label: '姓名', prop: 'name', width: 120 },
  { label: '年龄', prop: 'age', width: 80 },
  { label: '邮箱', prop: 'email' },
  { label: '部门', prop: 'department' },
  { label: '职位', prop: 'position' },
])

// 基础表格配置
const options = ref<MaTableOptions>({
  stripe: true,
  border: true,
  size: 'default',
  showHeader: true,
  highlightCurrentRow: true,
})

// 示例数据
const data: any[] = [
  { id: 1, name: '张三', age: 28, email: 'zhangsan@example.com', department: '技术部', position: '前端工程师' },
  { id: 2, name: '李四', age: 32, email: 'lisi@example.com', department: '产品部', position: '产品经理' },
  { id: 3, name: '王五', age: 26, email: 'wangwu@example.com', department: '设计部', position: 'UI设计师' },
  { id: 4, name: '赵六', age: 35, email: 'zhaoliu@example.com', department: '技术部', position: '后端工程师' },
  { id: 5, name: '孙七', age: 29, email: 'sunqi@example.com', department: '运营部', position: '运营专员' },
]
</script>

<template>
  <div class="demo-basic-table">
    <h3>基础表格</h3>
    <p>展示最基本的表格功能，包括条纹、边框、高亮当前行等特性。</p>
    
    <ma-table
      ref="tableRef"
      :columns="columns"
      :data="data"
      :options="options"
    />
  </div>
</template>

<style scoped>
.demo-basic-table {
  padding: 20px;
}
.demo-basic-table h3 {
  margin-bottom: 8px;
  color: #333;
}
.demo-basic-table p {
  margin-bottom: 16px;
  color: #666;
  font-size: 14px;
}
</style>