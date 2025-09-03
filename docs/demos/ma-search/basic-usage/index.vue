<template>
  <div>
    <h3>基础用法</h3>
    <p>最简单的搜索表单，包含输入框、下拉选择等基本表单元素。</p>
    
    <ma-search
      :search-items="searchItems"
      :options="searchOptions"
      @search="handleSearch"
      @reset="handleReset"
    />

    <div v-if="searchResult" class="result-display">
      <h4>搜索结果：</h4>
      <pre>{{ JSON.stringify(searchResult, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchResult = ref<any>(null)

// 基础搜索配置
const searchItems = ref([
  {
    label: '用户名',
    prop: 'username',
    render: 'input',
    renderProps: {
      placeholder: '请输入用户名',
      clearable: true
    }
  },
  {
    label: '邮箱',
    prop: 'email',
    render: 'input',
    renderProps: {
      placeholder: '请输入邮箱',
      clearable: true
    }
  },
  {
    label: '状态',
    prop: 'status',
    render: 'select',
    renderProps: {
      placeholder: '请选择状态',
      clearable: true,
      options: [
        { label: '全部', value: '' },
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ]
    },
  }
])

const searchOptions = {
  cols: { xs: 1, sm: 2, md: 3, lg: 4, xl: 4 }
}

const handleSearch = (formData: any) => {
  console.log('搜索数据:', formData)
  searchResult.value = formData
}

const handleReset = (formData: any) => {
  console.log('重置数据:', formData)
  searchResult.value = null
}
</script>

<style scoped>
.result-display {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.result-display h4 {
  margin-bottom: 10px;
  color: #303133;
}

.result-display pre {
  background-color: #fff;
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
}
</style>