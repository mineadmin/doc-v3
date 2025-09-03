<template>
  <div>
    <h2>MaSearch 组件演示</h2>
    <p>这是 MaSearch 组件的综合演示，展示了各种使用场景和功能特性。</p>
    
    <div class="demo-navigation">
      <h3>快速导航</h3>
      <div class="nav-grid">
        <div v-for="demo in demoList" :key="demo.key" class="nav-item" @click="activeDemo = demo.key">
          <div class="nav-icon">
            <el-icon>
              <component
                  :is="ElementIcons[
                    demo.icon
                      .replace('el-icon-', '')
                      .split('-')
                      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
                      .join('')
                  ]
                "
              />
            </el-icon>
          </div>
          <div class="nav-content">
            <h4>{{ demo.title }}</h4>
            <p>{{ demo.description }}</p>
          </div>
          <div class="nav-arrow" :class="{ active: activeDemo === demo.key }">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="demo-content">
      <div v-show="activeDemo === 'overview'" class="demo-section">
        <h3>快速开始</h3>
        <p>最简单的搜索表单示例，了解基本用法。</p>
        <ma-search
          :options="{ fold: true }"
          :form-options="{ labelWidth: '80px'}"
          :search-items="quickStartItems"
          @search="(form: any) => {
            ElMessage.success('提交的数据：' + JSON.stringify(form))
          }"
        />
      </div>

      <div v-show="activeDemo === 'basic'" class="demo-section">
        <basic-usage />
      </div>

      <div v-show="activeDemo === 'advanced'" class="demo-section">
        <advanced-search />
      </div>

      <div v-show="activeDemo === 'collapsible'" class="demo-section">
        <collapsible-search />
      </div>

      <div v-show="activeDemo === 'actions'" class="demo-section">
        <custom-actions />
      </div>

      <div v-show="activeDemo === 'dynamic'" class="demo-section">
        <dynamic-items />
      </div>

      <div v-show="activeDemo === 'responsive'" class="demo-section">
        <responsive-layout />
      </div>

      <div v-show="activeDemo === 'table'" class="demo-section">
        <table-integration />
      </div>

      <div v-show="activeDemo === 'validation'" class="demo-section">
        <form-validation />
      </div>

      <div v-show="activeDemo === 'methods'" class="demo-section">
        <methods-demo />
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { ref } from 'vue'
import type { MaSearchItem } from '@mineadmin/search'
import { ElMessage } from 'element-plus'
import * as ElementIcons from '@element-plus/icons-vue'

// 导入所有演示组件
import BasicUsage from '../basic-usage/index.vue'
import AdvancedSearch from '../advanced-search/index.vue'
import CollapsibleSearch from '../collapsible-search/index.vue'
import CustomActions from '../custom-actions/index.vue'
import DynamicItems from '../dynamic-items/index.vue'
import ResponsiveLayout from '../responsive-layout/index.vue'
import TableIntegration from '../table-integration/index.vue'
import FormValidation from '../form-validation/index.vue'
import MethodsDemo from '../methods-demo/index.vue'

const activeDemo = ref('overview')

const demoList = [
  {
    key: 'overview',
    title: '快速开始',
    description: '了解基本用法和核心概念',
    icon: 'el-icon-star-on'
  },
  {
    key: 'basic',
    title: '基础用法',
    description: '基本的搜索表单实现',
    icon: 'el-icon-document'
  },
  {
    key: 'advanced',
    title: '高级搜索',
    description: '复杂表单元素和配置',
    icon: 'el-icon-setting'
  },
  {
    key: 'collapsible',
    title: '折叠搜索',
    description: '可折叠的搜索面板',
    icon: 'el-icon-menu'
  },
  {
    key: 'actions',
    title: '自定义操作',
    description: '自定义按钮和插槽用法',
    icon: 'el-icon-magic-stick'
  },
  {
    key: 'dynamic',
    title: '动态管理',
    description: '动态添加删除搜索项',
    icon: 'el-icon-refresh'
  },
  {
    key: 'responsive',
    title: '响应式布局',
    description: '不同屏幕尺寸适配',
    icon: 'el-icon-mobile'
  },
  {
    key: 'table',
    title: '表格集成',
    description: '与数据表格配合使用',
    icon: 'el-icon-grid'
  },
  {
    key: 'validation',
    title: '表单验证',
    description: '表单验证规则和错误处理',
    icon: 'el-icon-warning'
  },
  {
    key: 'methods',
    title: '方法演示',
    description: '所有暴露方法的使用',
    icon: 'el-icon-cpu'
  }
]

const quickStartItems = ref<MaSearchItem[]>([
  { label: '账户', prop: 'username', render: 'input' },
  { label: '昵称', prop: 'nickname', render: 'input' },
  { 
    label: '状态', 
    prop: 'status',
    render: () => (
      <el-radio-group>
        <el-radio label="启用" value="1" />
        <el-radio label="停用" value="2" />
      </el-radio-group>
    )
  },
])
</script>

<style scoped>
.demo-navigation {
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.demo-navigation h3 {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 600;
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.nav-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  margin-right: 15px;
  font-size: 18px;
}

.nav-content {
  flex: 1;
}

.nav-content h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
  font-weight: 600;
}

.nav-content p {
  margin: 0;
  font-size: 14px;
  opacity: 0.8;
  line-height: 1.4;
}

.nav-arrow {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.nav-arrow.active {
  background: rgba(64, 158, 255, 0.3);
  transform: rotate(90deg);
}

.demo-content {
  min-height: 400px;
}

.demo-section {
  padding: 30px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.demo-section h3 {
  margin-bottom: 15px;
  font-size: 24px;
  color: #303133;
  border-bottom: 2px solid #409eff;
  padding-bottom: 10px;
}

.demo-section p {
  margin-bottom: 20px;
  color: #606266;
  font-size: 16px;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .nav-grid {
    grid-template-columns: 1fr;
  }
  
  .nav-item {
    padding: 12px 15px;
  }
  
  .nav-icon {
    width: 32px;
    height: 32px;
    margin-right: 12px;
    font-size: 16px;
  }
  
  .nav-content h4 {
    font-size: 14px;
  }
  
  .nav-content p {
    font-size: 12px;
  }
  
  .demo-section {
    padding: 20px;
  }
}
</style>