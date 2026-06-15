<script setup lang="tsx">
import { computed, ref } from 'vue'
import { ElButton, ElInput, ElInputNumber, ElMessage, ElTable, ElTableColumn } from 'element-plus'
import type { MaFormItem, MaFormOptions, MaModel } from '@mineadmin/form'

interface ProductRow {
  name: string
  quantity: number
  price: number
}

const model = ref<MaModel>({
  customer: '上海演示客户',
  products: [
    { name: 'MineAdmin 专业版', quantity: 1, price: 2999 },
    { name: '部署服务', quantity: 2, price: 800 },
  ],
})

const rows = computed<ProductRow[]>(() => model.value.products ?? [])

const options: MaFormOptions = {
  labelWidth: '96px',
  layout: 'flex',
  flex: {
    gutter: 16,
    align: 'top',
  },
}

const removeRow = (index: number) => {
  rows.value.splice(index, 1)
}

const totalAmount = computed(() => {
  return rows.value.reduce((total, row) => total + row.quantity * row.price, 0)
})

const addRow = () => {
  rows.value.push({ name: '', quantity: 1, price: 0 })
}

const items: MaFormItem[] = [
  {
    label: '客户名称',
    prop: 'customer',
    render: 'input',
    cols: { span: 24 },
    renderProps: {
      clearable: true,
      placeholder: '请输入客户名称',
    },
  },
  {
    label: '商品明细',
    prop: 'products',
    cols: { span: 24 },
    itemProps: {
      help: 'MaForm 负责整体模型，MaTable 直接读取和编辑 model.products。',
    },
    itemSlots: {
      default: () => {
        return (
          <div class="ma-form-table-demo__table">
            <ElTable data={rows.value} border stripe style={{ width: '100%' }}>
              <ElTableColumn label="商品名称" minWidth={180}>
                {{
                  default: ({ row }: { row: ProductRow }) => (
                    <ElInput
                      modelValue={row.name}
                      placeholder="请输入商品名称"
                      onUpdate:modelValue={value => row.name = String(value ?? '')}
                    />
                  ),
                }}
              </ElTableColumn>
              <ElTableColumn label="数量" width={150}>
                {{
                  default: ({ row }: { row: ProductRow }) => (
                    <ElInputNumber
                      modelValue={row.quantity}
                      min={1}
                      controlsPosition="right"
                      onUpdate:modelValue={value => row.quantity = value ?? 1}
                    />
                  ),
                }}
              </ElTableColumn>
              <ElTableColumn label="单价" width={160}>
                {{
                  default: ({ row }: { row: ProductRow }) => (
                    <ElInputNumber
                      modelValue={row.price}
                      min={0}
                      precision={2}
                      controlsPosition="right"
                      onUpdate:modelValue={value => row.price = value ?? 0}
                    />
                  ),
                }}
              </ElTableColumn>
              <ElTableColumn label="小计" width={120}>
                {{
                  default: ({ row }: { row: ProductRow }) => `￥${(row.quantity * row.price).toFixed(2)}`,
                }}
              </ElTableColumn>
              <ElTableColumn label="操作" width={100}>
                {{
                  default: ({ $index }: { $index: number }) => (
                    <ElButton type="danger" link onClick={() => removeRow($index)}>
                      删除
                    </ElButton>
                  ),
                }}
              </ElTableColumn>
            </ElTable>
            <div class="ma-form-table-demo__actions">
              <ElButton type="primary" link onClick={addRow}>
                新增商品
              </ElButton>
            </div>
          </div>
        )
      },
    },
  },
]

const submit = () => {
  ElMessage.success(`提交金额：￥${totalAmount.value.toFixed(2)}`)
}
</script>

<template>
  <div class="ma-form-table-demo">
    <ma-form v-model="model" :options="options" :items="items">
      <template #footer>
        <div class="ma-form-table-demo__footer">
          <span>合计：￥{{ totalAmount.toFixed(2) }}</span>
          <el-button type="primary" @click="submit">
            提交订单
          </el-button>
        </div>
      </template>
    </ma-form>
  </div>
</template>

<style scoped>
.ma-form-table-demo {
  width: 100%;
}

.ma-form-table-demo__table {
  width: 100%;
}

.ma-form-table-demo__actions {
  margin-top: 12px;
}

.ma-form-table-demo__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 12px;
  font-weight: 600;
}
</style>
