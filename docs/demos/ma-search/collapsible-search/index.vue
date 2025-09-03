<template>
  <div>
    <h3>折叠搜索</h3>
    <p>演示搜索表单的折叠和展开功能，支持设置默认显示行数和自定义操作按钮文案。</p>
    
    <div class="demo-section">
      <h4>基本折叠</h4>
      <ma-search
        ref="searchRef1"
        :search-items="searchItems"
        :form-options="formOptions1"
        :options="foldOptions1"
        @search="handleSearch"
        @reset="handleReset"
        @fold="handleFoldToggle"
      />
    </div>

    <div class="demo-section">
      <h4>自定义折叠配置</h4>
      <ma-search
        ref="searchRef2"
        :search-items="moreSearchItems"
        :form-options="formOptions2"
        :options="foldOptions2"
        @search="handleSearch"
        @reset="handleReset"
        @fold="handleFoldToggle"
      />
    </div>

    <div class="control-buttons">
      <el-button @click="toggleFold1" type="primary">
        切换第一个搜索框状态
      </el-button>
      <el-button @click="toggleFold2" type="success">
        切换第二个搜索框状态
      </el-button>
      <el-button @click="getFoldStatus" type="info">
        获取折叠状态
      </el-button>
    </div>

    <div v-if="foldStatus" class="status-display">
      <h4>当前折叠状态：</h4>
      <p>搜索框1：{{ foldStatus.search1 ? '已折叠' : '已展开' }}</p>
      <p>搜索框2：{{ foldStatus.search2 ? '已折叠' : '已展开' }}</p>
    </div>

    <div v-if="searchResult" class="result-display">
      <h4>搜索结果：</h4>
      <pre>{{ JSON.stringify(searchResult, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { MaSearchItem, MaSearchOptions } from '@mineadmin/search'

const searchRef1 = ref<any>(null)
const searchRef2 = ref<any>(null)
const searchResult = ref<any>(null)
const foldStatus = ref<any>(null)

// 基础搜索项
const searchItems = ref([
  {
    label: '用户名',
    prop: 'username',
    render: 'input',
    renderProps: { placeholder: '请输入用户名', clearable: true }
  },
  {
    label: '邮箱',
    prop: 'email',
    render: 'input',
    renderProps: { placeholder: '请输入邮箱', clearable: true }
  },
  {
    label: '手机号',
    prop: 'phone',
    render: 'input',
    renderProps: { placeholder: '请输入手机号', clearable: true }
  },
  {
    label: '状态',
    prop: 'status',
    render: 'select',
    renderProps: {
      options: [
        { label: '全部', value: '' },
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ]
    }
  }
])

// 更多搜索项
const moreSearchItems = ref([
  {
    label: '用户ID',
    prop: 'user_id',
    render: 'input',
    renderProps: { placeholder: '请输入用户ID', clearable: true }
  },
  {
    label: '用户名',
    prop: 'username',
    render: 'input',
    renderProps: { placeholder: '请输入用户名', clearable: true }
  },
  {
    label: '真实姓名',
    prop: 'real_name',
    render: 'input',
    renderProps: { placeholder: '请输入真实姓名', clearable: true }
  },
  {
    label: '邮箱',
    prop: 'email',
    render: 'input',
    renderProps: { placeholder: '请输入邮箱地址', clearable: true }
  },
  {
    label: '手机号',
    prop: 'phone',
    render: 'input',
    renderProps: { placeholder: '请输入手机号码', clearable: true }
  },
  {
    label: '部门',
    prop: 'department',
    render: 'select',
    renderProps: {
      options: [
        { label: '全部部门', value: 'all' },
        { label: '技术部', value: 'tech' },
        { label: '产品部', value: 'product' },
        { label: '运营部', value: 'operation' }
      ]
    }
  },
  {
    label: '职位',
    prop: 'position',
    render: 'input',
    renderProps: { placeholder: '请输入职位', clearable: true }
  },
  {
    label: '入职时间',
    prop: 'join_date',
    render: 'datePicker',
    renderProps: { type: 'daterange', startPlaceholder: '开始日期', endPlaceholder: '结束日期' }
  }
])

const formOptions1 = ref({
  labelWidth: '120px'
})

const formOptions2 = ref({
  labelWidth: '120px'
})

// 折叠配置 - 基本
const foldOptions1 = ref<MaSearchOptions>({
  fold: true,
  foldRows: 1,
  cols: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
  text: {
    searchBtn: () => '搜索',
    resetBtn: () => '重置',
    isFoldBtn: () => '展开更多',
    notFoldBtn: () => '收起'
  }
})

// 折叠配置 - 自定义
const foldOptions2 = ref<MaSearchOptions>({
  fold: true,
  foldRows: 3,
  cols: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
  text: {
    searchBtn: () => '开始搜索',
    resetBtn: () => '清空重置',
    isFoldBtn: () => '显示全部条件',
    notFoldBtn: () => '收起部分条件'
  }
})

const handleSearch = (formData: any) => {
  ElMessage.success('执行搜索操作')
  searchResult.value = formData
}

const handleReset = (formData: any) => {
  ElMessage.info('重置搜索条件')
  searchResult.value = null
}

const handleFoldToggle = (state: boolean) => {
  ElMessage.info(`搜索框${state ? '已折叠' : '已展开'}`)
}

const toggleFold1 = () => {
  if (searchRef1.value) {
    searchRef1.value.foldToggle()
  }
}

const toggleFold2 = () => {
  if (searchRef2.value) {
    searchRef2.value.foldToggle()
  }
}

const getFoldStatus = () => {
  foldStatus.value = {
    search1: searchRef1.value?.getFold() || false,
    search2: searchRef2.value?.getFold() || false
  }
}
</script>

<style scoped>
.demo-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.demo-section h4 {
  margin-bottom: 15px;
  color: #303133;
  font-size: 16px;
}

.control-buttons {
  margin: 20px 0;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.status-display {
  margin-top: 20px;
  padding: 15px;
  background-color: #e1f3d8;
  border-radius: 4px;
}

.status-display h4 {
  margin-bottom: 10px;
  color: #67c23a;
}

.status-display p {
  margin: 5px 0;
  color: #606266;
}

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
  max-height: 200px;
  overflow-y: auto;
}
</style>