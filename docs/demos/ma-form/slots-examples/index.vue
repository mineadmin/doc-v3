<script setup lang="ts">
import { ref, h } from 'vue'
import { ElMessage, ElButton, ElTag, ElIcon } from 'element-plus'
import type { MaFormExpose } from '@mineadmin/form'
import type { MaFormItem, MaFormOptions } from '@mineadmin/form'

// 表单数据
const formData = ref({
  // 基础表单字段
  username: 'admin',
  email: 'admin@example.com',
  password: '',
  confirmPassword: '',
  
  // 高级字段
  userType: 'vip',
  region: 'beijing',
  hobbies: ['reading', 'coding'],
  birthDate: '1990-05-15',
  
  // 特殊字段
  customField: 'Custom Value',
  fileUpload: [],
  description: '这是一个展示各种插槽用法的示例表单。',
  
  // 协议字段
  agreeTerms: false,
  subscribeNews: true
})

const formRef = ref<MaFormExpose>()

// 表单项配置 - 展示不同的插槽用法
const formItems = ref<MaFormItem[]>([
  // ============ 基础插槽示例 ============
  
  // 1. 表单项标题插槽 (item slot)
  {
    label: '用户名',
    prop: 'username',
    render: 'input',
    renderProps: {
      placeholder: '请输入用户名',
      clearable: true
    },
    itemSlot: 'username-item', // 自定义整个表单项
    cols: { span: 8 }
  },
  
  // 2. 表单项前缀插槽
  {
    label: '邮箱地址',
    prop: 'email',
    render: 'input',
    renderProps: {
      type: 'email',
      placeholder: '请输入邮箱地址',
      clearable: true
    },
    itemProps: {
      // Element Plus FormItem 原生插槽
      slots: {
        label: () => h('div', { style: 'display: flex; align-items: center; gap: 4px;' }, [
          h(ElIcon, { size: 16, color: '#409EFF' }, [h('Message')]),
          '邮箱地址',
          h(ElTag, { size: 'small', type: 'warning' }, () => '必填')
        ])
      }
    },
    cols: { span: 8 }
  },
  
  // 3. 带帮助信息的字段
  {
    label: '密码',
    prop: 'password',
    render: 'input',
    renderProps: {
      type: 'password',
      placeholder: '请输入密码',
      'show-password': true,
      clearable: true
    },
    itemProps: {
      slots: {
        // 自定义错误信息插槽
        error: (error: { message: string }) => h('div', { 
          style: 'color: #f56c6c; font-size: 12px; margin-top: 4px;' 
        }, [
          h(ElIcon, { size: 12, style: 'margin-right: 4px;' }, [h('WarningFilled')]),
          error.message
        ])
      },
      rules: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度至少6位', trigger: 'blur' }
      ]
    },
    cols: { span: 8 }
  },
  
  // 4. 组件内部插槽示例 - Select
  {
    label: '用户类型',
    prop: 'userType',
    render: 'select',
    renderProps: {
      placeholder: '请选择用户类型'
    },
    renderSlots: {
      // Select 组件的默认插槽
      default: () => [
        h('el-option', { 
          label: '普通用户', 
          value: 'normal' 
        }),
        h('el-option', { 
          label: 'VIP用户', 
          value: 'vip',
          disabled: false 
        }, [
          h('div', { style: 'display: flex; align-items: center; justify-content: space-between;' }, [
            h('span', 'VIP用户'),
            h(ElTag, { type: 'warning', size: 'small' }, () => '推荐')
          ])
        ]),
        h('el-option', { 
          label: '企业用户', 
          value: 'enterprise' 
        })
      ],
      // Select 组件的前缀插槽
      prefix: () => h(ElIcon, { size: 14, color: '#909399' }, [h('User')])
    },
    cols: { span: 8 }
  },
  
  // 5. 复选框组插槽示例
  {
    label: '兴趣爱好',
    prop: 'hobbies',
    render: 'checkboxGroup',
    renderSlots: {
      default: () => [
        { label: '阅读', value: 'reading', icon: 'Reading' },
        { label: '编程', value: 'coding', icon: 'Monitor' },
        { label: '运动', value: 'sports', icon: 'Football' },
        { label: '音乐', value: 'music', icon: 'Headphone' },
        { label: '旅行', value: 'travel', icon: 'Place' },
        { label: '摄影', value: 'photography', icon: 'Camera' }
      ].map(item => 
        h('el-checkbox', { 
          key: item.value,
          label: item.value,
          value: item.value 
        }, [
          h('div', { style: 'display: flex; align-items: center; gap: 4px;' }, [
            h(ElIcon, { size: 16 }, [h(item.icon)]),
            item.label
          ])
        ])
      )
    },
    cols: { span: 16 }
  },
  
  // 6. 日期选择器插槽示例
  {
    label: '出生日期',
    prop: 'birthDate',
    render: 'datePicker',
    renderProps: {
      type: 'date',
      placeholder: '请选择出生日期',
      format: 'YYYY年MM月DD日',
      'value-format': 'YYYY-MM-DD'
    },
    renderSlots: {
      // 日期选择器的前缀插槽
      'prefix-icon': () => h(ElIcon, { color: '#409EFF' }, [h('Calendar')])
    },
    cols: { span: 8 }
  },
  
  // 7. 上传组件插槽示例
  {
    label: '文件上传',
    prop: 'fileUpload',
    render: 'upload',
    renderProps: {
      action: '/api/upload',
      multiple: true,
      'show-file-list': true,
      'before-upload': (file: File) => {
        const isValidType = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
        if (!isValidType) {
          ElMessage.error('只能上传图片文件!')
        }
        return isValidType
      }
    },
    renderSlots: {
      // 上传按钮插槽
      default: () => h(ElButton, { 
        type: 'primary',
        icon: 'Upload' 
      }, () => '选择图片'),
      
      // 上传提示插槽
      tip: () => h('div', { 
        class: 'el-upload__tip',
        style: 'margin-top: 8px; color: #606266; font-size: 12px;' 
      }, [
        h(ElIcon, { size: 12, style: 'margin-right: 4px;' }, [h('InfoFilled')]),
        '只能上传 JPG/PNG/GIF 格式的图片文件'
      ])
    },
    cols: { span: 12 }
  },
  
  // 8. 自定义渲染插槽 - 复杂组合
  {
    label: '自定义字段',
    prop: 'customField',
    render: ({ formData, item }) => {
      return h('div', { class: 'custom-field-container' }, [
        // 输入框部分
        h('el-input', {
          modelValue: formData[item.prop],
          'onUpdate:modelValue': (value: string) => formData[item.prop] = value,
          placeholder: '请输入自定义内容',
          style: { flex: 1 }
        }, {
          // Input 组件的前缀插槽
          prefix: () => h(ElIcon, { color: '#409EFF' }, [h('Edit')]),
          // Input 组件的后缀插槽
          suffix: () => h('div', { 
            style: 'display: flex; align-items: center; gap: 4px;' 
          }, [
            h(ElButton, {
              size: 'small',
              type: 'text',
              onClick: () => {
                formData[item.prop] = `Generated-${Date.now()}`
                ElMessage.success('已生成随机内容')
              }
            }, () => '生成'),
            h(ElButton, {
              size: 'small',
              type: 'text',
              onClick: () => {
                formData[item.prop] = ''
                ElMessage.info('已清空内容')
              }
            }, () => '清空')
          ])
        }),
        
        // 额外的状态显示
        h('div', {
          style: 'margin-top: 4px; font-size: 12px; color: #909399;'
        }, `当前字符数: ${formData[item.prop]?.length || 0}`)
      ])
    },
    cols: { span: 12 }
  },
  
  // 9. 多行文本插槽示例
  {
    label: '详细描述',
    prop: 'description',
    render: 'input',
    renderProps: {
      type: 'textarea',
      rows: 4,
      placeholder: '请输入详细描述',
      'show-word-limit': true,
      maxlength: 200
    },
    itemProps: {
      slots: {
        // 自定义标签插槽
        label: () => h('div', { style: 'position: relative;' }, [
          h('span', '详细描述'),
          h(ElTag, {
            size: 'small',
            type: 'info',
            style: 'margin-left: 8px;'
          }, () => '可选')
        ])
      }
    },
    cols: { span: 24 }
  },
  
  // 10. 开关组件插槽示例
  {
    label: '订阅通知',
    prop: 'subscribeNews',
    render: 'switch',
    renderProps: {
      'active-text': '开启',
      'inactive-text': '关闭',
      'inline-prompt': true
    },
    // 使用表单项插槽来添加额外说明
    itemProps: {
      slots: {
        default: (scope: any) => h('div', {
          style: 'display: flex; align-items: center; gap: 12px;'
        }, [
          // 原始开关组件
          scope.default(),
          // 额外的说明文字
          h('span', {
            style: 'color: #606266; font-size: 13px;'
          }, formData.value.subscribeNews ? '您将收到最新的产品通知' : '您将不会收到产品通知')
        ])
      }
    },
    cols: { span: 12 }
  },
  
  // 11. 协议同意 - 带链接的复选框
  {
    label: '用户协议',
    prop: 'agreeTerms',
    render: 'checkbox',
    renderSlots: {
      default: () => h('div', [
        '我已阅读并同意',
        h('el-link', { 
          type: 'primary', 
          style: 'margin: 0 4px;',
          onClick: () => {
            ElMessage.info('跳转到用户协议页面')
          }
        }, () => '《用户服务协议》'),
        '和',
        h('el-link', { 
          type: 'primary', 
          style: 'margin: 0 4px;',
          onClick: () => {
            ElMessage.info('跳转到隐私政策页面')
          }
        }, () => '《隐私政策》')
      ])
    },
    itemProps: {
      rules: [
        {
          validator: (rule: any, value: boolean, callback: Function) => {
            if (!value) {
              callback(new Error('必须同意用户协议才能继续'))
            } else {
              callback()
            }
          },
          trigger: 'change'
        }
      ]
    },
    cols: { span: 24 }
  }
])

// 表单配置
const formOptions: MaFormOptions = {
  labelWidth: '120px',
  labelPosition: 'right',
  size: 'default',
  gutter: 20
}

// 提交表单
const handleSubmit = async () => {
  try {
    formRef.value?.setLoadingState(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const isValid = await formRef.value?.getElFormRef()?.validate()
    if (isValid) {
      ElMessage.success('提交成功！')
      console.log('表单数据:', formData.value)
    }
  } catch (error) {
    ElMessage.error('表单验证失败')
  } finally {
    formRef.value?.setLoadingState(false)
  }
}

// 重置表单
const handleReset = () => {
  formRef.value?.getElFormRef()?.resetFields()
  ElMessage.info('表单已重置')
}

// 演示不同插槽的状态
const slotExamples = ref([
  {
    name: '表单项插槽 (itemSlot)',
    description: '完全自定义整个表单项的渲染',
    prop: 'username',
    usage: 'itemSlot: "slot-name"'
  },
  {
    name: '标签插槽 (label slot)',
    description: '自定义表单项标签部分',
    prop: 'email',
    usage: 'itemProps.slots.label'
  },
  {
    name: '组件插槽 (renderSlots)',
    description: '配置被渲染组件的内部插槽',
    prop: 'userType',
    usage: 'renderSlots: { default: () => [...] }'
  },
  {
    name: '函数渲染插槽',
    description: '使用渲染函数创建复杂的自定义组件',
    prop: 'customField',
    usage: 'render: ({ formData, item }) => h(...)'
  }
])

const activeTech = ref(['item-slot', 'render-slots'])
</script>

<template>
  <div class="slots-examples-demo">
    <!-- 演示说明 -->
    <div class="demo-description">
      <h3>插槽使用演示</h3>
      <p>展示 MaForm 中各种插槽的使用方法，包括表单项插槽、组件插槽、自定义渲染等高级用法。</p>
      <div class="demo-features">
        <el-tag type="info" size="small">表单项插槽</el-tag>
        <el-tag type="success" size="small">组件插槽</el-tag>
        <el-tag type="warning" size="small">自定义渲染</el-tag>
        <el-tag type="danger" size="small">复杂插槽</el-tag>
        <el-tag size="small">动态内容</el-tag>
      </div>
    </div>

    <!-- 插槽类型说明 -->
    <div class="slot-types">
      <el-card shadow="never">
        <template #header>
          <span>插槽类型说明</span>
        </template>
        
        <div class="slot-examples-grid">
          <div 
            v-for="example in slotExamples" 
            :key="example.prop"
            class="slot-example-item"
          >
            <h5>{{ example.name }}</h5>
            <p>{{ example.description }}</p>
            <code>{{ example.usage }}</code>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 插槽演示表单 -->
    <div class="demo-form">
      <ma-form 
        ref="formRef"
        v-model="formData" 
        :options="formOptions"
        :items="formItems"
      >
        <!-- 自定义表单项插槽 - username -->
        <template #username-item="{ item, model }">
          <el-form-item 
            :label="item.label"
            :prop="item.prop"
            class="custom-form-item"
          >
            <!-- 自定义输入框包装 -->
            <div class="custom-input-wrapper">
              <el-avatar 
                :size="32" 
                :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${model[item.prop]}`"
                class="user-avatar"
              />
              <el-input
                v-model="model[item.prop]"
                placeholder="请输入用户名"
                clearable
                @input="$forceUpdate()"
              />
              <el-tooltip content="用户名将用于登录和显示" placement="top">
                <el-icon class="help-icon"><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
            <!-- 实时用户名预览 -->
            <div class="username-preview">
              <el-text size="small" type="info">
                预览: Hello, {{ model[item.prop] || 'User' }}!
              </el-text>
            </div>
          </el-form-item>
        </template>

        <!-- 自定义底部操作栏 -->
        <template #footer>
          <div class="form-footer">
            <!-- 左侧状态信息 -->
            <div class="footer-info">
              <el-text size="small" type="info">
                <el-icon><InfoFilled /></el-icon>
                表单包含 {{ formItems.length }} 个字段，展示了多种插槽用法
              </el-text>
            </div>
            
            <!-- 右侧操作按钮 -->
            <div class="footer-actions">
              <el-button @click="handleReset">重置表单</el-button>
              <el-button type="primary" @click="handleSubmit">
                <el-icon class="mr-1"><Check /></el-icon>
                提交表单
              </el-button>
            </div>
          </div>
        </template>
      </ma-form>
    </div>

    <!-- 技术要点说明 -->
    <div class="tech-details">
      <el-card shadow="never">
        <template #header>
          <span>插槽技术要点</span>
        </template>
        
        <el-collapse v-model="activeTech">
          <el-collapse-item title="1. 表单项插槽 (itemSlot)" name="item-slot">
            <div class="tech-content">
              <h5>使用场景</h5>
              <p>• 完全自定义整个表单项的渲染结构</p>
              <p>• 需要特殊布局或组合多个组件</p>
              <p>• 添加额外的交互元素或装饰</p>
              
              <h5>配置方法</h5>
              <pre><code>{
  label: '字段标签',
  prop: 'fieldName',
  itemSlot: 'custom-slot-name'  // 指定插槽名称
}</code></pre>
              
              <h5>模板使用</h5>
              <pre><code>&lt;template #custom-slot-name="{ item, model }"&gt;
  &lt;!-- 自定义内容 --&gt;
&lt;/template&gt;</code></pre>
            </div>
          </el-collapse-item>
          
          <el-collapse-item title="2. 组件插槽 (renderSlots)" name="render-slots">
            <div class="tech-content">
              <h5>使用场景</h5>
              <p>• 配置 Element Plus 组件的内部插槽</p>
              <p>• 自定义选项、图标、提示内容等</p>
              <p>• 增强组件的显示效果</p>
              
              <h5>配置方法</h5>
              <pre><code>{
  render: 'select',
  renderSlots: {
    default: () => [...],     // 默认插槽
    prefix: () => h(...),     // 前缀插槽
    suffix: () => h(...)      // 后缀插槽
  }
}</code></pre>
            </div>
          </el-collapse-item>
          
          <el-collapse-item title="3. FormItem 插槽" name="form-item-slots">
            <div class="tech-content">
              <h5>使用场景</h5>
              <p>• 自定义标签、错误信息显示</p>
              <p>• 添加帮助信息、必填标记等</p>
              <p>• 自定义表单项的局部区域</p>
              
              <h5>配置方法</h5>
              <pre><code>{
  itemProps: {
    slots: {
      label: () => h(...),    // 标签插槽
      error: (error) => h(...) // 错误插槽
    }
  }
}</code></pre>
            </div>
          </el-collapse-item>
          
          <el-collapse-item title="4. 函数渲染" name="function-render">
            <div class="tech-content">
              <h5>使用场景</h5>
              <p>• 需要复杂的自定义逻辑</p>
              <p>• 组合多个组件或添加交互</p>
              <p>• 实现完全自定义的字段类型</p>
              
              <h5>配置方法</h5>
              <pre><code>{
  render: ({ formData, item, disabled }) => {
    return h('div', [
      // 自定义渲染内容
    ])
  }
}</code></pre>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>

    <!-- 表单数据展示 -->
    <div class="data-display">
      <el-card shadow="never">
        <template #header>
          <span>当前表单数据</span>
        </template>
        <pre class="data-json">{{ JSON.stringify(formData, null, 2) }}</pre>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.slots-examples-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.demo-description {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.demo-description h3 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 18px;
}

.demo-description p {
  margin: 0 0 15px 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
}

.demo-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.slot-types {
  margin-bottom: 20px;
}

.slot-examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.slot-example-item {
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background-color: #fafafa;
}

.slot-example-item h5 {
  margin: 0 0 8px 0;
  color: #409EFF;
  font-size: 14px;
}

.slot-example-item p {
  margin: 0 0 8px 0;
  color: #606266;
  font-size: 13px;
  line-height: 1.5;
}

.slot-example-item code {
  display: block;
  background-color: #f4f4f5;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #e6a23c;
  word-break: break-all;
}

/* 自定义表单项样式 */
.custom-form-item {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
  background-color: #f9fafc;
}

.custom-input-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.user-avatar {
  flex-shrink: 0;
}

.help-icon {
  color: #909399;
  cursor: help;
  flex-shrink: 0;
}

.username-preview {
  text-align: center;
  padding: 8px;
  background-color: #ecf5ff;
  border-radius: 4px;
  border: 1px solid #d0e8ff;
}

/* 自定义字段样式 */
.custom-field-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.demo-form {
  margin-bottom: 30px;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-top: 1px solid #e4e7ed;
}

.footer-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.footer-actions {
  display: flex;
  gap: 12px;
}

.mr-1 {
  margin-right: 4px;
}

.tech-details,
.data-display {
  margin-bottom: 20px;
}

.tech-content h5 {
  margin: 0 0 8px 0;
  color: #409EFF;
  font-size: 14px;
}

.tech-content p {
  margin: 0 0 8px 0;
  color: #606266;
  font-size: 13px;
  line-height: 1.5;
}

.tech-content pre {
  background-color: #f4f4f5;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.4;
  margin: 8px 0;
}

.data-json {
  background-color: #f4f4f5;
  padding: 16px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.5;
  color: #606266;
  overflow-x: auto;
  white-space: pre-wrap;
  max-height: 300px;
  overflow-y: auto;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .slots-examples-demo {
    padding: 10px;
  }
  
  .demo-features {
    justify-content: center;
  }
  
  .slot-examples-grid {
    grid-template-columns: 1fr;
  }
  
  .custom-input-wrapper {
    flex-direction: column;
    align-items: stretch;
  }
  
  .form-footer {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .footer-info {
    justify-content: center;
  }
  
  .footer-actions {
    justify-content: center;
  }
}

/* 上传组件提示样式 */
:deep(.el-upload__tip) {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>