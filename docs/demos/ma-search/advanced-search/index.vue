<template>
  <div>
    <h3>高级搜索</h3>
    <p>包含多种表单组件类型的复杂搜索场景，展示丰富的表单元素和配置选项。</p>

    <ma-search :search-items="searchItems" :form-options="formOptions" :options="searchOptions" @search="handleSearch"
      @reset="handleReset" />

    <div v-if="searchResult" class="result-display">
      <h4>搜索条件：</h4>
      <pre>{{ JSON.stringify(searchResult, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { MaSearchItem, MaSearchOptions } from "@mineadmin/search";
import type {MaFormOptions} from "@mineadmin/form";

const searchResult = ref<any>(null)

// 高级搜索配置
const searchItems = ref<MaSearchItem[]>([
  {
    label: '用户账号',
    prop: 'username',
    render: 'input',
    renderProps: {
      placeholder: '支持模糊搜索',
      clearable: true
    },

  },
  {
    label: '用户角色',
    prop: 'role',
    render: 'select',
    renderProps: {
      multiple: true,
      placeholder: '可多选',
      clearable: true,
      options: [
        { label: '全部角色', value: '' },
        { label: '管理员', value: 'admin' },
        { label: '编辑者', value: 'editor' },
        { label: '查看者', value: 'viewer' }
      ],
    }
  },
  {
    label: '注册时间',
    prop: 'register_time',
    render: 'datePicker',
    renderProps: {
      type: 'datetimerange',
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间',
      format: 'YYYY-MM-DD HH:mm:ss'
    }
  },
  {
    label: '年龄范围',
    render: () => <div class="!p-0 flex gap-2 w-full" />,
    children: [
      {
        prop: 'age_range',
        render: 'InputNumber',
        renderProps: {
          placeholder: '最小年龄',
          min: 0,
        },
        cols: {md: 12, xs: 24},
      },
      {
        prop: 'age_max',
        render: 'InputNumber',
        renderProps: {
          placeholder: '最大年龄',
          max: 120,
        },
        cols: {md: 12, xs: 24},
      },
    ],
  },
  {
    label: '账户状态',
    prop: 'status',
    render: () => (
      <el-radio-group>
        <el-radio label="" value="">全部</el-radio>
        <el-radio label={1} value={1}>正常</el-radio>
        <el-radio label={0} value={0}>禁用</el-radio>
        <el-radio label={-1} value={-1}>锁定</el-radio>
      </el-radio-group>
    ),
  },
  {
    label: '所属部门',
    prop: 'department',
    render: () => (
      <el-cascader
        placeholder="请选择部门"
        props={{ multiple: true }}
        options={[
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
        ]}
      />
    )
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
  }
])

const formOptions: MaFormOptions = {
  labelWidth: 80
}

const searchOptions: MaSearchOptions = {
  fold: false,
  foldRows: 2,
  cols: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
  text: {
    searchBtn: () => '高级搜索',
    resetBtn: () => '清空条件'
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