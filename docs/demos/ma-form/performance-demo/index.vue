<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch, h } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { MaFormExpose } from "@mineadmin/form"

// 性能监控状态
const isLargeFormMode = ref(false)
const fieldCount = ref(50)
const renderTime = ref(0)
const memoryUsage = ref(0)
const validationTime = ref(0)
const isRendering = ref(false)
const isValidating = ref(false)

// 性能统计
const performanceStats = ref({
  initialRenderTime: 0,
  lastRenderTime: 0,
  averageRenderTime: 0,
  renderCount: 0,
  totalValidationTime: 0,
  validationCount: 0,
  averageValidationTime: 0,
  memoryPeak: 0,
  memoryStart: 0
})

const formRef = ref<MaFormExpose>()

// 生成大量字段的表单数据
const generateLargeFormData = (count: number) => {
  const data: any = {}
  
  for (let i = 0; i < count; i++) {
    const fieldType = i % 10
    const fieldName = `field_${i}`
    
    switch (fieldType) {
      case 0: // 文本输入
        data[fieldName] = `Text Field ${i}`
        break
      case 1: // 数字输入
        data[fieldName] = Math.floor(Math.random() * 1000)
        break
      case 2: // 选择器
        data[fieldName] = ['option1', 'option2', 'option3'][i % 3]
        break
      case 3: // 开关
        data[fieldName] = i % 2 === 0
        break
      case 4: // 日期
        data[fieldName] = new Date(2020 + (i % 5), i % 12, (i % 28) + 1).toISOString().split('T')[0]
        break
      case 5: // 多选
        data[fieldName] = ['a', 'b', 'c'].slice(0, (i % 3) + 1)
        break
      case 6: // 滑块
        data[fieldName] = i % 100
        break
      case 7: // 文本域
        data[fieldName] = `This is a textarea content for field ${i}. Lorem ipsum dolor sit amet.`
        break
      case 8: // 评分
        data[fieldName] = (i % 5) + 1
        break
      case 9: // 时间选择
        data[fieldName] = `${8 + (i % 12)}:${(i % 60).toString().padStart(2, '0')}:00`
        break
    }
  }
  
  return data
}

// 表单数据
const formData = ref(generateLargeFormData(fieldCount.value))

// 生成大量字段配置
const generateLargeFormItems = (count: number) => {
  const items = []
  
  for (let i = 0; i < count; i++) {
    const fieldType = i % 10
    const fieldName = `field_${i}`
    const baseConfig = {
      label: `字段 ${i + 1}`,
      prop: fieldName,
      cols: { span: fieldType === 7 ? 24 : 12 } // 文本域占全宽
    }
    
    switch (fieldType) {
      case 0: // 文本输入
        items.push({
          ...baseConfig,
          render: 'input',
          renderProps: {
            placeholder: `请输入字段 ${i + 1}`,
            clearable: true
          },
          itemProps: {
            rules: i < 20 ? [
              { required: true, message: `字段 ${i + 1} 是必填项`, trigger: 'blur' }
            ] : []
          }
        })
        break
        
      case 1: // 数字输入
        items.push({
          ...baseConfig,
          render: 'inputNumber',
          renderProps: {
            min: 0,
            max: 9999,
            step: 1,
            placeholder: `请输入数字 ${i + 1}`
          }
        })
        break
        
      case 2: // 选择器
        items.push({
          ...baseConfig,
          render: 'select',
          renderProps: {
            placeholder: `请选择 ${i + 1}`,
            clearable: true,
            options: [
              { label: `选项1-${i}`, value: 'option1' },
              { label: `选项2-${i}`, value: 'option2' },
              { label: `选项3-${i}`, value: 'option3' },
              { label: `选项4-${i}`, value: 'option4' },
              { label: `选项5-${i}`, value: 'option5' }
            ]
          }
        })
        break
        
      case 3: // 开关
        items.push({
          ...baseConfig,
          render: 'switch',
          renderProps: {
            'active-text': '开启',
            'inactive-text': '关闭'
          },
          cols: { span: 8 }
        })
        break
        
      case 4: // 日期选择
        items.push({
          ...baseConfig,
          render: 'datePicker',
          renderProps: {
            type: 'date',
            placeholder: `选择日期 ${i + 1}`,
            format: 'YYYY-MM-DD',
            'value-format': 'YYYY-MM-DD',
            style: { width: '100%' }
          }
        })
        break
        
      case 5: // 多选框组
        items.push({
          ...baseConfig,
          render: 'checkboxGroup',
          renderProps: {
            options: ['a', 'b', 'c', 'd', 'e'].map(value => ({
              label: `选项${value.toUpperCase()}-${i}`,
              value: value
            }))
          },
          cols: { span: 24 }
        })
        break
        
      case 6: // 滑块
        items.push({
          ...baseConfig,
          render: 'slider',
          renderProps: {
            min: 0,
            max: 100,
            step: 1,
            'show-tooltip': true,
            'format-tooltip': (value: number) => `${value}%`
          }
        })
        break
        
      case 7: // 文本域
        items.push({
          ...baseConfig,
          render: 'input',
          renderProps: {
            type: 'textarea',
            placeholder: `请输入详细内容 ${i + 1}`,
            rows: 3,
            'show-word-limit': true,
            maxlength: 200
          }
        })
        break
        
      case 8: // 评分
        items.push({
          ...baseConfig,
          render: 'rate',
          renderProps: {
            'show-text': true,
            colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
            texts: ['很差', '差', '一般', '好', '很好']
          },
          cols: { span: 8 }
        })
        break
        
      case 9: // 时间选择
        items.push({
          ...baseConfig,
          render: 'timePicker',
          renderProps: {
            placeholder: `选择时间 ${i + 1}`,
            format: 'HH:mm:ss',
            'value-format': 'HH:mm:ss',
            style: { width: '100%' }
          }
        })
        break
    }
  }
  
  return items
}

// 表单项配置
const formItems = ref(generateLargeFormItems(fieldCount.value))

// 表单配置
const formOptions = ref({
  labelWidth: '120px',
  labelPosition: 'right',
  size: 'default'
})

// 性能监控工具
const measurePerformance = async <T>(
  operation: () => Promise<T> | T,
  statType: 'render' | 'validation'
): Promise<T> => {
  const startTime = performance.now()
  const startMemory = (performance as any).memory?.usedJSHeapSize || 0
  
  try {
    const result = await operation()
    const endTime = performance.now()
    const endMemory = (performance as any).memory?.usedJSHeapSize || 0
    const duration = endTime - startTime
    
    // 更新性能统计
    if (statType === 'render') {
      renderTime.value = duration
      performanceStats.value.lastRenderTime = duration
      performanceStats.value.renderCount++
      performanceStats.value.totalRenderTime = (performanceStats.value.totalRenderTime || 0) + duration
      performanceStats.value.averageRenderTime = performanceStats.value.totalRenderTime / performanceStats.value.renderCount
      
      if (performanceStats.value.renderCount === 1) {
        performanceStats.value.initialRenderTime = duration
      }
    } else if (statType === 'validation') {
      validationTime.value = duration
      performanceStats.value.validationCount++
      performanceStats.value.totalValidationTime += duration
      performanceStats.value.averageValidationTime = performanceStats.value.totalValidationTime / performanceStats.value.validationCount
    }
    
    // 更新内存使用情况
    memoryUsage.value = endMemory - startMemory
    if (endMemory > performanceStats.value.memoryPeak) {
      performanceStats.value.memoryPeak = endMemory
    }
    
    return result
  } catch (error) {
    throw error
  }
}

// 切换大表单模式
const toggleLargeForm = async () => {
  try {
    if (!isLargeFormMode.value) {
      await ElMessageBox.confirm(
        '大表单模式将生成大量字段，可能会影响性能。继续吗？',
        '性能提醒',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
    }
    
    isLargeFormMode.value = !isLargeFormMode.value
    
    if (isLargeFormMode.value) {
      fieldCount.value = 200 // 大表单模式使用200个字段
      ElMessage.warning('已切换到大表单模式，请注意性能影响')
    } else {
      fieldCount.value = 50 // 正常模式使用50个字段
      ElMessage.success('已切换到正常模式')
    }
    
    await regenerateForm()
    
  } catch (error) {
    // 用户取消操作
  }
}

// 重新生成表单
const regenerateForm = async () => {
  isRendering.value = true
  
  try {
    await measurePerformance(async () => {
      formData.value = generateLargeFormData(fieldCount.value)
      nextTick(()=>formRef.value.setItems(generateLargeFormItems(fieldCount.value)))
      
      await nextTick() // 等待DOM更新
      
      return Promise.resolve()
    }, 'render')
    
    ElMessage.success(`已生成 ${fieldCount.value} 个字段，渲染时间: ${renderTime.value.toFixed(2)}ms`)
  } catch (error) {
    console.log(error)
    ElMessage.error('表单生成失败')
  } finally {
    isRendering.value = false
  }
}

// 性能测试 - 验证表单
const performanceValidation = async () => {
  if (!formRef.value) return
  
  isValidating.value = true
  
  try {
    const result = await measurePerformance(async () => {
      return await formRef.value!.getElFormRef()?.validate()
    }, 'validation')
    
    if (result) {
      ElMessage.success(`表单验证通过，耗时: ${validationTime.value.toFixed(2)}ms`)
    }
  } catch (error) {
    ElMessage.error(`表单验证失败，耗时: ${validationTime.value.toFixed(2)}ms`)
  } finally {
    isValidating.value = false
  }
}

// 批量填充数据
const batchFillData = async () => {
  const startTime = performance.now()
  
  try {
    // 模拟API数据加载
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const newData = generateLargeFormData(fieldCount.value)
    formData.value = { ...newData }
    
    const endTime = performance.now()
    ElMessage.success(`批量数据填充完成，耗时: ${(endTime - startTime).toFixed(2)}ms`)
  } catch (error) {
    ElMessage.error('批量填充数据失败')
  }
}

// 清空所有数据
const clearAllData = () => {
  const startTime = performance.now()
  
  Object.keys(formData.value).forEach(key => {
    const fieldType = parseInt(key.split('_')[1]) % 10
    
    switch (fieldType) {
      case 0: // 文本
      case 7: // 文本域
        formData.value[key] = ''
        break
      case 1: // 数字
      case 6: // 滑块
      case 8: // 评分
        formData.value[key] = 0
        break
      case 2: // 选择器
      case 4: // 日期
      case 9: // 时间
        formData.value[key] = ''
        break
      case 3: // 开关
        formData.value[key] = false
        break
      case 5: // 多选
        formData.value[key] = []
        break
    }
  })
  
  const endTime = performance.now()
  ElMessage.info(`数据清空完成，耗时: ${(endTime - startTime).toFixed(2)}ms`)
}

// 内存使用情况格式化
const formatMemoryUsage = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 性能评级
const getPerformanceRating = computed(() => {
  const avgRenderTime = performanceStats.value.averageRenderTime
  
  if (avgRenderTime === 0) return { rating: 'N/A', color: '#909399', desc: '暂无数据' }
  if (avgRenderTime < 50) return { rating: 'A+', color: '#67c23a', desc: '优秀' }
  if (avgRenderTime < 100) return { rating: 'A', color: '#95d475', desc: '良好' }
  if (avgRenderTime < 200) return { rating: 'B', color: '#e6a23c', desc: '一般' }
  if (avgRenderTime < 500) return { rating: 'C', color: '#f56c6c', desc: '较差' }
  return { rating: 'D', color: '#f56c6c', desc: '需要优化' }
})

// 监听字段数量变化
watch(fieldCount, async (newCount) => {
  if (newCount > 0 && newCount <= 1000) {
    await regenerateForm()
  }
})

// 重置性能统计
const resetPerformanceStats = () => {
  performanceStats.value = {
    initialRenderTime: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    renderCount: 0,
    totalValidationTime: 0,
    validationCount: 0,
    averageValidationTime: 0,
    memoryPeak: 0,
    memoryStart: (performance as any).memory?.usedJSHeapSize || 0
  }
  renderTime.value = 0
  validationTime.value = 0
  memoryUsage.value = 0
  ElMessage.info('性能统计已重置')
}

// 导出性能报告
const exportPerformanceReport = () => {
  const report = {
    timestamp: new Date().toISOString(),
    fieldCount: fieldCount.value,
    isLargeFormMode: isLargeFormMode.value,
    performanceStats: performanceStats.value,
    currentMetrics: {
      renderTime: renderTime.value,
      validationTime: validationTime.value,
      memoryUsage: memoryUsage.value
    },
    rating: getPerformanceRating.value
  }
  
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ma-form-performance-report-${Date.now()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  ElMessage.success('性能报告已导出')
}

// 组件挂载时初始化
onMounted(async () => {
  performanceStats.value.memoryStart = (performance as any).memory?.usedJSHeapSize || 0
  await regenerateForm()
})
</script>

<template>
  <div class="performance-demo">
    <!-- 演示说明 -->
    <div class="demo-description">
      <h3>性能优化演示</h3>
      <p>展示 MaForm 在大量字段场景下的性能表现，包括渲染时间、内存使用、验证效率等关键指标的监控和优化。</p>
      <div class="demo-features">
        <el-tag type="info" size="small">大量字段</el-tag>
        <el-tag type="success" size="small">性能监控</el-tag>
        <el-tag type="warning" size="small">内存优化</el-tag>
        <el-tag type="danger" size="small">渲染性能</el-tag>
        <el-tag size="small">验证效率</el-tag>
        <el-tag type="info" size="small">性能分析</el-tag>
      </div>
    </div>

    <!-- 性能控制面板 -->
    <div class="performance-control-panel">
      <el-card class="control-card">
        <template #header>
          <div class="control-header">
            <span>性能控制面板</span>
            <el-tag 
              :type="isLargeFormMode ? 'danger' : 'success'" 
              size="small"
            >
              {{ isLargeFormMode ? '大表单模式' : '正常模式' }}
            </el-tag>
          </div>
        </template>
        
        <div class="control-content">
          <div class="control-group">
            <label>字段数量：</label>
            <el-input-number 
              v-model="fieldCount" 
              :min="10" 
              :max="1000" 
              :step="10"
              size="small"
              :disabled="isRendering"
            />
            <span class="field-count-tip">当前: {{ fieldCount }} 个字段</span>
          </div>
          
          <div class="control-actions">
            <el-button 
              type="primary" 
              size="small" 
              @click="toggleLargeForm"
              :loading="isRendering"
            >
              {{ isLargeFormMode ? '切换到正常模式' : '切换到大表单模式' }}
            </el-button>
            <el-button size="small" @click="regenerateForm" :loading="isRendering">
              重新生成表单
            </el-button>
            <el-button size="small" @click="batchFillData">
              批量填充数据
            </el-button>
            <el-button size="small" @click="clearAllData">
              清空数据
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 性能指标仪表板 -->
    <div class="performance-dashboard">
      <el-row :gutter="16">
        <!-- 实时性能指标 -->
        <el-col :span="8">
          <el-card class="metric-card render-card">
            <div class="metric-content">
              <div class="metric-icon">
                <el-icon><Timer /></el-icon>
              </div>
              <div class="metric-info">
                <div class="metric-label">渲染时间</div>
                <div class="metric-value">{{ renderTime.toFixed(2) }}ms</div>
                <div class="metric-desc">
                  平均: {{ performanceStats.averageRenderTime.toFixed(2) }}ms
                </div>
              </div>
            </div>
            <div class="metric-progress">
              <el-progress 
                :percentage="Math.min((renderTime / 1000) * 100, 100)"
                :color="renderTime < 100 ? '#67c23a' : renderTime < 500 ? '#e6a23c' : '#f56c6c'"
                :show-text="false"
                :stroke-width="4"
              />
            </div>
          </el-card>
        </el-col>
        
        <!-- 验证性能 -->
        <el-col :span="8">
          <el-card class="metric-card validation-card">
            <div class="metric-content">
              <div class="metric-icon">
                <el-icon><CircleCheckFilled /></el-icon>
              </div>
              <div class="metric-info">
                <div class="metric-label">验证时间</div>
                <div class="metric-value">{{ validationTime.toFixed(2) }}ms</div>
                <div class="metric-desc">
                  平均: {{ performanceStats.averageValidationTime.toFixed(2) }}ms
                </div>
              </div>
            </div>
            <div class="metric-progress">
              <el-progress 
                :percentage="Math.min((validationTime / 200) * 100, 100)"
                :color="validationTime < 50 ? '#67c23a' : validationTime < 100 ? '#e6a23c' : '#f56c6c'"
                :show-text="false"
                :stroke-width="4"
              />
            </div>
          </el-card>
        </el-col>
        
        <!-- 内存使用 -->
        <el-col :span="8">
          <el-card class="metric-card memory-card">
            <div class="metric-content">
              <div class="metric-icon">
                <el-icon><Monitor /></el-icon>
              </div>
              <div class="metric-info">
                <div class="metric-label">内存使用</div>
                <div class="metric-value">{{ formatMemoryUsage(Math.abs(memoryUsage)) }}</div>
                <div class="metric-desc">
                  峰值: {{ formatMemoryUsage(performanceStats.memoryPeak) }}
                </div>
              </div>
            </div>
            <div class="metric-progress">
              <el-progress 
                :percentage="Math.min((Math.abs(memoryUsage) / (10 * 1024 * 1024)) * 100, 100)"
                :color="Math.abs(memoryUsage) < 5 * 1024 * 1024 ? '#67c23a' : '#e6a23c'"
                :show-text="false"
                :stroke-width="4"
              />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 性能评级和统计 -->
    <div class="performance-rating">
      <el-card class="rating-card">
        <div class="rating-content">
          <div class="rating-score">
            <div class="score-circle" :style="{ borderColor: getPerformanceRating.color }">
              <span class="score-text" :style="{ color: getPerformanceRating.color }">
                {{ getPerformanceRating.rating }}
              </span>
            </div>
            <div class="score-desc">
              <span>性能评级</span>
              <span class="score-label">{{ getPerformanceRating.desc }}</span>
            </div>
          </div>
          
          <div class="rating-stats">
            <div class="stat-grid">
              <div class="stat-item">
                <span class="stat-label">初次渲染</span>
                <span class="stat-value">{{ performanceStats.initialRenderTime.toFixed(2) }}ms</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">渲染次数</span>
                <span class="stat-value">{{ performanceStats.renderCount }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">验证次数</span>
                <span class="stat-value">{{ performanceStats.validationCount }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">字段密度</span>
                <span class="stat-value">{{ (fieldCount / 10).toFixed(1) }}/col</span>
              </div>
            </div>
          </div>
          
          <div class="rating-actions">
            <el-button size="small" @click="resetPerformanceStats">
              重置统计
            </el-button>
            <el-button size="small" type="primary" @click="exportPerformanceReport">
              导出报告
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 性能测试操作 -->
    <div class="performance-test-actions">
      <el-card class="test-card">
        <template #header>
          <div class="test-header">
            <span>性能测试操作</span>
            <div class="test-status">
              <el-tag v-if="isRendering" type="warning" size="small">渲染中</el-tag>
              <el-tag v-if="isValidating" type="info" size="small">验证中</el-tag>
            </div>
          </div>
        </template>
        
        <div class="test-actions">
          <el-button 
            type="success" 
            @click="performanceValidation" 
            :loading="isValidating"
            :disabled="isRendering"
          >
            性能验证测试
          </el-button>
          <el-button 
            type="warning" 
            @click="batchFillData"
            :disabled="isRendering || isValidating"
          >
            批量数据测试
          </el-button>
          <el-button 
            type="info" 
            @click="regenerateForm" 
            :loading="isRendering"
            :disabled="isValidating"
          >
            重渲染测试
          </el-button>
        </div>
      </el-card>
    </div>

    <!-- 大表单 -->
    <div class="large-form-container">
      <el-card class="form-card">
        <template #header>
          <div class="form-header">
            <div class="form-title">
              <h3>性能测试表单</h3>
              <p>当前包含 {{ fieldCount }} 个不同类型的字段</p>
            </div>
            <div class="form-meta">
              <el-tag size="small">{{ isLargeFormMode ? '大表单模式' : '正常模式' }}</el-tag>
              <el-tag size="small" type="info">{{ Object.keys(formData).length }} 个数据项</el-tag>
            </div>
          </div>
        </template>
        
        <div v-loading="isRendering" element-loading-text="生成表单中...">
          <ma-form 
            ref="formRef"
            v-model="formData" 
            :options="formOptions"
            :items="formItems"
            class="performance-form"
          >
            <!-- 性能优化的底部操作栏 -->
            <template #footer>
              <div class="form-footer">
                <div class="footer-info">
                  <span>字段总数: {{ fieldCount }}</span>
                  <span>•</span>
                  <span>数据项: {{ Object.keys(formData).length }}</span>
                  <span>•</span>
                  <span>最后渲染: {{ renderTime.toFixed(2) }}ms</span>
                </div>
                <div class="footer-actions">
                  <el-button @click="clearAllData">清空数据</el-button>
                  <el-button @click="batchFillData">批量填充</el-button>
                  <el-button 
                    type="primary" 
                    @click="performanceValidation"
                    :loading="isValidating"
                  >
                    验证表单
                  </el-button>
                </div>
              </div>
            </template>
          </ma-form>
        </div>
      </el-card>
    </div>

    <!-- 性能建议 -->
    <div class="performance-suggestions">
      <el-card class="suggestions-card">
        <template #header>
          <span>性能优化建议</span>
        </template>
        
        <div class="suggestions-content">
          <el-alert
            v-if="renderTime > 500"
            title="渲染性能警告"
            type="warning"
            description="表单渲染时间较长，建议减少字段数量或使用虚拟滚动"
            :closable="false"
            show-icon
            class="suggestion-alert"
          />
          
          <el-alert
            v-if="validationTime > 100"
            title="验证性能提醒"
            type="info"
            description="表单验证时间较长，建议优化验证规则或使用异步验证"
            :closable="false"
            show-icon
            class="suggestion-alert"
          />
          
          <el-alert
            v-if="fieldCount > 100"
            title="字段数量建议"
            type="warning"
            description="字段数量较多，建议考虑分页或分步骤表单来提升用户体验"
            :closable="false"
            show-icon
            class="suggestion-alert"
          />
          
          <div class="optimization-tips">
            <h4>性能优化技巧:</h4>
            <ul>
              <li><strong>减少字段数量:</strong> 考虑将表单分解为多个步骤或页面</li>
              <li><strong>延迟加载:</strong> 对于复杂组件，可以考虑按需加载</li>
              <li><strong>虚拟滚动:</strong> 当字段数量超过100个时，使用虚拟滚动</li>
              <li><strong>异步验证:</strong> 将复杂的验证逻辑移至服务端或使用防抖</li>
              <li><strong>内存管理:</strong> 及时清理不需要的数据和事件监听器</li>
              <li><strong>缓存策略:</strong> 对于静态选项数据，使用适当的缓存机制</li>
            </ul>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.performance-demo {
  max-width: 1400px;
  margin: 0 auto;
}

.demo-description {
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.demo-description h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
}

.demo-description p {
  margin: 0 0 16px 0;
  font-size: 14px;
  opacity: 0.9;
}

.demo-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* 性能控制面板 */
.performance-control-panel {
  margin-bottom: 20px;
}

.control-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.control-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.control-group label {
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  white-space: nowrap;
}

.field-count-tip {
  font-size: 12px;
  color: #909399;
}

.control-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 性能指标仪表板 */
.performance-dashboard {
  margin-bottom: 20px;
}

.metric-card {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.render-card {
  border-top: 4px solid #409EFF;
}

.validation-card {
  border-top: 4px solid #67C23A;
}

.memory-card {
  border-top: 4px solid #E6A23C;
}

.metric-content {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.metric-icon {
  font-size: 24px;
  margin-right: 12px;
  color: #409EFF;
}

.validation-card .metric-icon {
  color: #67C23A;
}

.memory-card .metric-icon {
  color: #E6A23C;
}

.metric-info {
  flex: 1;
}

.metric-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.metric-value {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 2px;
}

.metric-desc {
  font-size: 11px;
  color: #C0C4CC;
}

.metric-progress {
  margin-top: 8px;
}

/* 性能评级 */
.performance-rating {
  margin-bottom: 20px;
}

.rating-card {
  border-radius: 12px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.rating-content {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 24px;
  align-items: center;
}

.rating-score {
  display: flex;
  align-items: center;
  gap: 16px;
}

.score-circle {
  width: 60px;
  height: 60px;
  border: 3px solid;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

.score-text {
  font-size: 18px;
  font-weight: bold;
}

.score-desc {
  display: flex;
  flex-direction: column;
}

.score-desc span:first-child {
  font-size: 12px;
  color: #909399;
}

.score-label {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.rating-stats {
  flex: 1;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.rating-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 性能测试操作 */
.performance-test-actions {
  margin-bottom: 24px;
}

.test-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.test-status {
  display: flex;
  gap: 8px;
}

.test-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

/* 大表单容器 */
.large-form-container {
  margin-bottom: 24px;
}

.form-card {
  border-radius: 12px;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.form-title h3 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 18px;
}

.form-title p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.form-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.performance-form {
  min-height: 200px;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-top: 1px solid #ebeef5;
  margin-top: 20px;
}

.footer-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #909399;
}

.footer-actions {
  display: flex;
  gap: 8px;
}

/* 性能建议 */
.performance-suggestions {
  margin-top: 32px;
}

.suggestions-card {
  border-radius: 12px;
}

.suggestions-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.suggestion-alert {
  border-radius: 8px;
}

.optimization-tips h4 {
  margin: 16px 0 12px 0;
  color: #303133;
  font-size: 16px;
}

.optimization-tips ul {
  margin: 0;
  padding-left: 20px;
}

.optimization-tips li {
  margin-bottom: 8px;
  color: #606266;
  line-height: 1.6;
}

.optimization-tips strong {
  color: #303133;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .rating-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .stat-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .rating-actions {
    flex-direction: row;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .form-header {
    flex-direction: column;
    gap: 12px;
  }
  
  .form-footer {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .footer-actions {
    justify-content: center;
  }
  
  .control-group {
    justify-content: center;
  }
  
  .control-actions {
    justify-content: center;
  }
  
  .test-actions {
    flex-direction: column;
  }
  
  .stat-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .optimization-tips ul {
    padding-left: 16px;
  }
}

@media (max-width: 480px) {
  .demo-description {
    padding: 16px;
  }
  
  .metric-value {
    font-size: 16px;
  }
  
  .score-circle {
    width: 50px;
    height: 50px;
  }
  
  .score-text {
    font-size: 16px;
  }
  
  .stat-grid {
    grid-template-columns: 1fr;
  }
}
</style>