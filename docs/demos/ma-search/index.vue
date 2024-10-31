<script setup lang="tsx">
import { ref } from 'vue'
import {MaSearchItem} from "@mineadmin/search";
import {ElMessage} from "element-plus";

const searchItem = ref<MaSearchItem>([
  { label: '账户', prop: 'username', render: 'input' },
  { label: '昵称', prop: 'nickname', render: 'input' },
  { label: '状态', prop: 'status',
    render: () => (
      <el-radio-group>
        <el-radio label="启用" value="1" />
        <el-radio label="停用" value="2" />
      </el-radio-group>
    )
  },
])
</script>

<template>
  <ma-search
    :options="{ fold: true }"
    :form-options="{ labelWidth: '80px'}"
    :search-items="searchItem"
    @search="(form: any) => {
      ElMessage.success('提交的数据：' + JSON.stringify(form))
    }"
  />
</template>

<style scoped>

</style>