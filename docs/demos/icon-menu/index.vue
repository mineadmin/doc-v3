<script setup lang="ts">
import { ref } from 'vue'
import MaSvgIcon from "../ma-svg-icon/index.vue";

// 模拟菜单数据结构
const menuData = ref([
  {
    id: 1,
    name: '系统管理',
    icon: 'i-ep:setting',
    path: '/system',
    children: [
      {
        id: 11,
        name: '用户管理',
        icon: 'i-ep:user',
        path: '/system/user'
      },
      {
        id: 12,
        name: '角色管理',
        icon: 'i-ep:avatar',
        path: '/system/role'
      },
      {
        id: 13,
        name: '权限管理',
        icon: 'i-ep:key',
        path: '/system/permission'
      }
    ]
  },
  {
    id: 2,
    name: '内容管理',
    icon: 'i-ep:document',
    path: '/content',
    children: [
      {
        id: 21,
        name: '文章管理',
        icon: 'i-ep:edit-pen',
        path: '/content/article'
      },
      {
        id: 22,
        name: '分类管理',
        icon: 'i-ep:folder',
        path: '/content/category'
      }
    ]
  },
  {
    id: 3,
    name: '数据统计',
    icon: 'i-ep:data-line',
    path: '/statistics',
    children: [
      {
        id: 31,
        name: '访问统计',
        icon: 'i-ep:view',
        path: '/statistics/visits'
      },
      {
        id: 32,
        name: '用户统计',
        icon: 'i-ep:pie-chart',
        path: '/statistics/users'
      }
    ]
  }
])

const activeMenu = ref('/system/user')
const expandedMenus = ref<number[]>([1])

const toggleMenu = (menuId: number) => {
  if (expandedMenus.value.includes(menuId)) {
    expandedMenus.value = expandedMenus.value.filter(id => id !== menuId)
  } else {
    expandedMenus.value.push(menuId)
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- 菜单示例说明 -->
    <div>
      <h3 class="text-lg font-semibold mb-2">路由菜单中的图标使用</h3>
      <p class="text-sm text-gray-600 mb-4">
        演示如何在菜单系统中正确配置和使用图标，包括一级菜单和子菜单的图标显示。
      </p>
    </div>

    <!-- 侧边栏菜单示例 -->
    <div class="flex gap-6">
      <!-- 菜单区域 -->
      <div class="w-64 bg-gray-900 text-white rounded-lg overflow-hidden">
        <div class="p-4 bg-gray-800">
          <h4 class="font-semibold flex items-center gap-2">
            <div class="i-ep:menu text-lg"></div>
            MineAdmin 菜单
          </h4>
        </div>
        
        <nav class="p-2">
          <div v-for="menu in menuData" :key="menu.id" class="mb-1">
            <!-- 一级菜单 -->
            <div 
              class="flex items-center justify-between px-3 py-2 rounded cursor-pointer hover:bg-gray-700 transition-colors"
              @click="toggleMenu(menu.id)"
            >
              <div class="flex items-center gap-3">

                <div :class="[menu.icon, 'text-lg']"></div>
                <span>{{ menu.name }}</span>
              </div>
              <div 
                :class="['i-ep:arrow-right text-sm transition-transform', 
                expandedMenus.includes(menu.id) ? 'rotate-90' : '']"
              ></div>
            </div>
            
            <!-- 子菜单 -->
            <div 
              v-if="expandedMenus.includes(menu.id)" 
              class="ml-4 mt-1 space-y-1"
            >
              <div 
                v-for="child in menu.children" 
                :key="child.id"
                :class="[
                  'flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-colors',
                  activeMenu === child.path 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                ]"
                @click="activeMenu = child.path"
              >
                <div :class="[child.icon, 'text-base']"></div>
                <span class="text-sm">{{ child.name }}</span>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <!-- 配置代码示例 -->
      <div class="flex-1">
        <h4 class="font-semibold mb-3">菜单配置示例</h4>
        <div class="bg-gray-50 rounded-lg p-4 text-sm">
          <pre class="text-gray-700 overflow-x-auto"><code>// 菜单配置数据结构
const menuConfig = [
  {
    name: '系统管理',
    icon: 'i-ep:setting',  // Element Plus 图标
    path: '/system',
    children: [
      {
        name: '用户管理',
        icon: 'i-ep:user',
        path: '/system/user'
      }
    ]
  }
]

</code></pre>
        </div>

        <!-- 当前选中菜单 -->
        <div class="mt-4 p-4 bg-blue-50 rounded-lg">
          <h5 class="font-medium text-blue-900 mb-2">当前选中菜单</h5>
          <div class="text-blue-700">
            路径: <code class="bg-blue-100 px-2 py-1 rounded">{{ activeMenu }}</code>
          </div>
        </div>
      </div>
    </div>

    <!-- 面包屑导航示例 -->
    <div>
      <h4 class="font-semibold mb-3">面包屑导航中的图标</h4>
      <div class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
        <div class="i-ep:home-filled text-gray-600"></div>
        <span class="text-gray-600">首页</span>
        <div class="i-ep:arrow-right text-gray-400 text-sm"></div>
        <div class="i-ep:setting text-gray-600"></div>
        <span class="text-gray-600">系统管理</span>
        <div class="i-ep:arrow-right text-gray-400 text-sm"></div>
        <div class="i-ep:user text-blue-600"></div>
        <span class="text-blue-600 font-medium">用户管理</span>
      </div>
    </div>

    <!-- 标签页示例 -->
    <div>
      <h4 class="font-semibold mb-3">标签页中的图标</h4>
      <div class="flex gap-1 border-b">
        <div class="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 border-b-2 border-blue-600">
          <div class="i-ep:user text-sm"></div>
          <span class="text-sm">用户管理</span>
          <div class="i-ep:close text-xs cursor-pointer hover:text-red-500"></div>
        </div>
        <div class="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 cursor-pointer">
          <div class="i-ep:avatar text-sm"></div>
          <span class="text-sm">角色管理</span>
          <div class="i-ep:close text-xs cursor-pointer hover:text-red-500"></div>
        </div>
        <div class="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 cursor-pointer">
          <div class="i-ep:key text-sm"></div>
          <span class="text-sm">权限管理</span>
          <div class="i-ep:close text-xs cursor-pointer hover:text-red-500"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 菜单动画效果 */
.transition-transform {
  transition: transform 0.2s ease;
}

/* 确保图标显示正常 */
[class*="i-"] {
  display: inline-block;
  flex-shrink: 0;
}

/* 代码块样式 */
pre {
  white-space: pre-wrap;
  word-break: break-word;
}

code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}
</style>