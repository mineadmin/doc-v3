<script setup lang="ts">
import { ref, computed } from 'vue'

// 用户状态数据
const users = ref([
  { id: 1, name: '张三', status: 'online', lastSeen: '刚刚' },
  { id: 2, name: '李四', status: 'busy', lastSeen: '5分钟前' },
  { id: 3, name: '王五', status: 'offline', lastSeen: '2小时前' },
  { id: 4, name: '赵六', status: 'away', lastSeen: '30分钟前' }
])

// 任务状态数据  
const tasks = ref([
  { id: 1, name: '用户管理模块开发', status: 'completed', priority: 'high' },
  { id: 2, name: '权限系统设计', status: 'in-progress', priority: 'high' },
  { id: 3, name: '数据库优化', status: 'pending', priority: 'medium' },
  { id: 4, name: '前端界面调整', status: 'cancelled', priority: 'low' }
])

// 系统状态数据
const systemStatus = ref([
  { name: 'API 服务', status: 'healthy', uptime: '99.9%' },
  { name: '数据库', status: 'healthy', uptime: '100%' },
  { name: '缓存服务', status: 'warning', uptime: '95.2%' },
  { name: '文件存储', status: 'error', uptime: '0%' }
])

// 订单状态数据
const orders = ref([
  { id: 'ORD001', customer: '客户A', status: 'paid', amount: 1299 },
  { id: 'ORD002', customer: '客户B', status: 'shipped', amount: 899 },
  { id: 'ORD003', customer: '客户C', status: 'delivered', amount: 2199 },
  { id: 'ORD004', customer: '客户D', status: 'cancelled', amount: 599 },
  { id: 'ORD005', customer: '客户E', status: 'pending', amount: 1599 }
])

// 状态配置
const statusConfig = {
  user: {
    online: { icon: 'i-ep:success-filled', color: 'text-green-500', label: '在线' },
    offline: { icon: 'i-ep:failed', color: 'text-gray-400', label: '离线' },
    busy: { icon: 'i-ep:warning-filled', color: 'text-red-500', label: '忙碌' },
    away: { icon: 'i-ep:clock', color: 'text-yellow-500', label: '离开' }
  },
  task: {
    completed: { icon: 'i-ep:circle-check-filled', color: 'text-green-500', label: '已完成' },
    'in-progress': { icon: 'i-ep:loading', color: 'text-blue-500', label: '进行中' },
    pending: { icon: 'i-ep:clock', color: 'text-orange-500', label: '待处理' },
    cancelled: { icon: 'i-ep:circle-close-filled', color: 'text-red-500', label: '已取消' }
  },
  system: {
    healthy: { icon: 'i-ep:success-filled', color: 'text-green-500', label: '健康' },
    warning: { icon: 'i-ep:warning-filled', color: 'text-yellow-500', label: '警告' },
    error: { icon: 'i-ep:circle-close-filled', color: 'text-red-500', label: '错误' }
  },
  order: {
    pending: { icon: 'i-ep:clock', color: 'text-orange-500', label: '待支付' },
    paid: { icon: 'i-ep:money', color: 'text-green-500', label: '已支付' },
    shipped: { icon: 'i-ep:box', color: 'text-blue-500', label: '已发货' },
    delivered: { icon: 'i-ep:circle-check-filled', color: 'text-green-600', label: '已完成' },
    cancelled: { icon: 'i-ep:circle-close-filled', color: 'text-red-500', label: '已取消' }
  },
  priority: {
    high: { icon: 'i-ep:top', color: 'text-red-500', label: '高' },
    medium: { icon: 'i-ep:minus', color: 'text-yellow-500', label: '中' },
    low: { icon: 'i-ep:bottom', color: 'text-green-500', label: '低' }
  }
}

const getStatusInfo = (type: keyof typeof statusConfig, status: string) => {
  return statusConfig[type][status] || { icon: 'i-ep:question-filled', color: 'text-gray-500', label: '未知' }
}

// 统计信息
const stats = computed(() => {
  return {
    totalTasks: tasks.value.length,
    completedTasks: tasks.value.filter(t => t.status === 'completed').length,
    onlineUsers: users.value.filter(u => u.status === 'online').length,
    totalUsers: users.value.length,
    healthyServices: systemStatus.value.filter(s => s.status === 'healthy').length,
    totalServices: systemStatus.value.length
  }
})
</script>

<template>
  <div class="space-y-8">
    <!-- 状态图标概览 -->
    <div>
      <h3 class="text-lg font-semibold mb-4">状态指示器图标</h3>
      <div class="grid grid-cols-2 gap-6">
        <!-- 用户状态 -->
        <div class="p-4 bg-gray-50 rounded-lg">
          <h4 class="font-medium mb-3">用户在线状态</h4>
          <div class="space-y-2">
            <div v-for="user in users" :key="user.id" class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div :class="[getStatusInfo('user', user.status).icon, getStatusInfo('user', user.status).color, 'text-sm']"></div>
                <span class="text-sm">{{ user.name }}</span>
                <span :class="['text-xs px-2 py-1 rounded-full', getStatusInfo('user', user.status).color.replace('text-', 'bg-').replace('500', '100')]">
                  {{ getStatusInfo('user', user.status).label }}
                </span>
              </div>
              <span class="text-xs text-gray-500">{{ user.lastSeen }}</span>
            </div>
          </div>
        </div>

        <!-- 任务状态 -->
        <div class="p-4 bg-gray-50 rounded-lg">
          <h4 class="font-medium mb-3">任务进度状态</h4>
          <div class="space-y-2">
            <div v-for="task in tasks" :key="task.id" class="flex items-center justify-between">
              <div class="flex items-center gap-2 flex-1">
                <div :class="[getStatusInfo('task', task.status).icon, getStatusInfo('task', task.status).color, 'text-sm']"></div>
                <span class="text-sm truncate">{{ task.name }}</span>
              </div>
              <div class="flex items-center gap-2 ml-2">
                <div :class="[getStatusInfo('priority', task.priority).icon, getStatusInfo('priority', task.priority).color, 'text-xs']"></div>
                <span :class="['text-xs px-2 py-1 rounded-full', getStatusInfo('task', task.status).color.replace('text-', 'bg-').replace('500', '100')]">
                  {{ getStatusInfo('task', task.status).label }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 系统状态监控 -->
    <div>
      <h3 class="text-lg font-semibold mb-4">系统服务状态监控</h3>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          v-for="service in systemStatus" 
          :key="service.name"
          class="p-4 bg-white border rounded-lg shadow-sm"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium">{{ service.name }}</span>
            <div :class="[getStatusInfo('system', service.status).icon, getStatusInfo('system', service.status).color, 'text-lg']"></div>
          </div>
          <div class="text-xs text-gray-500">
            运行时间: {{ service.uptime }}
          </div>
          <div class="mt-2">
            <span :class="['text-xs px-2 py-1 rounded-full', getStatusInfo('system', service.status).color.replace('text-', 'bg-').replace('500', '100')]">
              {{ getStatusInfo('system', service.status).label }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 订单状态表格 -->
    <div>
      <h3 class="text-lg font-semibold mb-4">订单状态表格</h3>
      <div class="overflow-hidden border rounded-lg">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">订单号</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">客户</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金额</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-sm font-mono">{{ order.id }}</td>
              <td class="px-4 py-3 text-sm">{{ order.customer }}</td>
              <td class="px-4 py-3 text-sm">
                <div class="flex items-center gap-2">
                  <div :class="[getStatusInfo('order', order.status).icon, getStatusInfo('order', order.status).color, 'text-sm']"></div>
                  <span>{{ getStatusInfo('order', order.status).label }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-sm font-medium">¥{{ order.amount }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div>
      <h3 class="text-lg font-semibold mb-4">统计卡片示例</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- 任务统计 -->
        <div class="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold">{{ stats.completedTasks }}/{{ stats.totalTasks }}</div>
              <div class="text-blue-100">已完成任务</div>
            </div>
            <div class="i-ep:circle-check-filled text-3xl text-blue-200"></div>
          </div>
          <div class="mt-4 flex items-center">
            <div class="i-ep:top text-sm mr-1"></div>
            <span class="text-sm text-blue-100">完成率: {{ Math.round((stats.completedTasks / stats.totalTasks) * 100) }}%</span>
          </div>
        </div>

        <!-- 用户统计 -->
        <div class="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold">{{ stats.onlineUsers }}/{{ stats.totalUsers }}</div>
              <div class="text-green-100">在线用户</div>
            </div>
            <div class="i-ep:user-filled text-3xl text-green-200"></div>
          </div>
          <div class="mt-4 flex items-center">
            <div class="i-ep:success-filled text-sm mr-1"></div>
            <span class="text-sm text-green-100">在线率: {{ Math.round((stats.onlineUsers / stats.totalUsers) * 100) }}%</span>
          </div>
        </div>

        <!-- 服务统计 -->
        <div class="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold">{{ stats.healthyServices }}/{{ stats.totalServices }}</div>
              <div class="text-purple-100">健康服务</div>
            </div>
            <div class="i-ep:monitor text-3xl text-purple-200"></div>
          </div>
          <div class="mt-4 flex items-center">
            <div class="i-ep:success-filled text-sm mr-1"></div>
            <span class="text-sm text-purple-100">健康率: {{ Math.round((stats.healthyServices / stats.totalServices) * 100) }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 状态配置说明 -->
    <div>
      <h3 class="text-lg font-semibold mb-4">状态配置说明</h3>
      <div class="bg-gray-50 rounded-lg p-4">
        <pre class="text-sm text-gray-700 overflow-x-auto"><code>// 状态配置示例
const statusConfig = {
  user: {
    online: { icon: 'i-ep:success-filled', color: 'text-green-500', label: '在线' },
    offline: { icon: 'i-ep:failed', color: 'text-gray-400', label: '离线' },
    busy: { icon: 'i-ep:warning-filled', color: 'text-red-500', label: '忙碌' },
    away: { icon: 'i-ep:clock', color: 'text-yellow-500', label: '离开' }
  }
}

// 使用方法
const getStatusInfo = (type, status) => {
  return statusConfig[type][status] || { icon: 'i-ep:question-filled', color: 'text-gray-500' }
}</code></pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 动画效果 */
.i-ep\:loading {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 确保图标显示 */
[class*="i-"] {
  display: inline-block;
  flex-shrink: 0;
}

/* 表格样式 */
table {
  border-collapse: collapse;
}

/* 代码样式 */
pre {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>