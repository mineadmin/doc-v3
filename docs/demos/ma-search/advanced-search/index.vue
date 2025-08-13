<template>
  <div>
    <h3>高级搜索</h3>
    <p>包含多种表单组件类型的复杂搜索场景，展示丰富的表单元素和配置选项。</p>
    
    <ma-search
      :search-items="searchItems"
      :form-options="formOptions"
      :options="searchOptions"
      @search="handleSearch"
      @reset="handleReset"
    />

    <div v-if="searchResult" class="result-display">
      <h4>搜索条件：</h4>
      <pre>{{ JSON.stringify(searchResult, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const searchResult = ref<any>(null)

// 高级搜索配置
const searchItems = ref([
  {
    label: '用户账号',
    prop: 'username',
    render: 'input',
    renderProps: {
      placeholder: '支持模糊搜索',
      clearable: true
    }
  },
  {
    label: '用户角色',
    prop: 'role',
    render: 'select',
    options: [
      { label: '全部角色', value: '' },
      { label: '管理员', value: 'admin' },
      { label: '编辑者', value: 'editor' },
      { label: '查看者', value: 'viewer' }
    ],
    renderProps: {
      multiple: true,
      placeholder: '可多选',
      clearable: true
    }
  },
  {
    label: '注册时间',
    prop: 'register_time',
    render: 'date-picker',
    renderProps: {
      type: 'datetimerange',
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间',
      format: 'YYYY-MM-DD HH:mm:ss'
    }
  },
  {
    label: '年龄范围',
    prop: 'age_range',
    render: () => (
      <el-input-number
        v-model:model-value={searchResult.value?.age_min}
        placeholder="最小年龄"
        min={0}
        max={120}
        style="width: 120px; margin-right: 10px;"
      />
    ),
    span: 1
  },
  {
    label: '',
    prop: 'age_max',
    render: () => (
      <div style="display: flex; align-items: center; gap: 10px;">
        <span>到</span>
        <el-input-number
          v-model:model-value={searchResult.value?.age_max}
          placeholder="最大年龄"
          min={0}
          max={120}
          style="width: 120px;"
        />
      </div>
    ),
    span: 1
  },
  {
    label: '账户状态',
    prop: 'status',
    render: () => (
      <el-radio-group>
        <el-radio label="全部" value="" />
        <el-radio label="正常" value={1} />
        <el-radio label="禁用" value={0} />
        <el-radio label="锁定" value={-1} />
      </el-radio-group>
    ),
    span: 2
  },
  {
    label: '所属部门',
    prop: 'department',
    render: 'cascader',
    options: [
      {
        value: 'tech',
        label: '技术部',
        children: [
          { value: 'frontend', label: '前端组' },
          { value: 'backend', label: '后端组' },
          { value: 'mobile', label: '移动端组' }
        ]
      },
      {
        value: 'product',
        label: '产品部',
        children: [
          { value: 'design', label: '设计组' },
          { value: 'pm', label: '产品组' }
        ]
      }
    ],
    renderProps: {
      props: { multiple: true },
      placeholder: '请选择部门'
    }
  },
  {
    label: '特殊标签',
    prop: 'tags',
    render: () => (
      <el-checkbox-group>
        <el-checkbox label="VIP用户" value="vip" />
        <el-checkbox label="新用户" value="new" />
        <el-checkbox label="活跃用户" value="active" />
      </el-checkbox-group>
    ),
    span: 2
  }
])

const formOptions = {
  labelWidth: '120px'
}

const searchOptions = {
  fold: true,
  foldRows: 2,
  text: {
    searchBtn: '高级搜索',
    resetBtn: '清空条件'
  }
}

const handleSearch = (formData: any) => {
  ElMessage.success('执行高级搜索')
  searchResult.value = formData
  console.log('高级搜索数据:', formData)
}

const handleReset = (formData: any) => {
  ElMessage.info('已重置搜索条件')
  searchResult.value = null
  console.log('重置后数据:', formData)
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
  max-height: 300px;
  overflow-y: auto;
}
</style>