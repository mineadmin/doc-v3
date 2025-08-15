<template>
  <section class="features-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">为什么选择 MineAdmin</h2>
        <p class="section-subtitle">
          现代化的技术栈，企业级的解决方案，让开发更高效
        </p>
      </div>
      
      <div class="features-grid">
        <div v-for="feature in features" :key="feature.title" class="feature-card">
          <div class="feature-icon">
            <component :is="feature.icon" />
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
          <a v-if="feature.link" :href="feature.link" class="feature-link">
            了解更多 →
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { h } from 'vue'

// Icon Components
const PerformanceIcon = () => h('svg', { 
  width: '32', 
  height: '32', 
  viewBox: '0 0 24 24', 
  fill: 'none' 
}, [
  h('path', {
    d: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  })
])

const CodeIcon = () => h('svg', { 
  width: '32', 
  height: '32', 
  viewBox: '0 0 24 24', 
  fill: 'none' 
}, [
  h('path', {
    d: 'M16 18l6-6-6-6M8 6l-6 6 6 6',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  })
])

const GlobalIcon = () => h('svg', { 
  width: '32', 
  height: '32', 
  viewBox: '0 0 24 24', 
  fill: 'none' 
}, [
  h('circle', {
    cx: '12',
    cy: '12',
    r: '10',
    stroke: 'currentColor',
    'stroke-width': '2'
  }),
  h('path', {
    d: 'M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  })
])

const PluginIcon = () => h('svg', { 
  width: '32', 
  height: '32', 
  viewBox: '0 0 24 24', 
  fill: 'none' 
}, [
  h('path', {
    d: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  })
])

const SecurityIcon = () => h('svg', { 
  width: '32', 
  height: '32', 
  viewBox: '0 0 24 24', 
  fill: 'none' 
}, [
  h('path', {
    d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  })
])

const ComponentIcon = () => h('svg', { 
  width: '32', 
  height: '32', 
  viewBox: '0 0 24 24', 
  fill: 'none' 
}, [
  h('rect', {
    x: '3',
    y: '3',
    width: '7',
    height: '7',
    stroke: 'currentColor',
    'stroke-width': '2'
  }),
  h('rect', {
    x: '14',
    y: '3',
    width: '7',
    height: '7',
    stroke: 'currentColor',
    'stroke-width': '2'
  }),
  h('rect', {
    x: '14',
    y: '14',
    width: '7',
    height: '7',
    stroke: 'currentColor',
    'stroke-width': '2'
  }),
  h('rect', {
    x: '3',
    y: '14',
    width: '7',
    height: '7',
    stroke: 'currentColor',
    'stroke-width': '2'
  })
])

const features = [
  {
    icon: PerformanceIcon,
    title: '极致性能',
    description: '基于 Swoole/Swow 协程框架，内存常驻，性能比传统 PHP-FPM 提升 10 倍以上',
    link: '/guide/backend/performance'
  },
  {
    icon: CodeIcon,
    title: '现代化技术栈',
    description: 'PHP 8.2+ / Vue 3 / TypeScript / Vite 5，拥抱最新技术，享受开发乐趣',
    link: '/guide/introduce/tech-stack'
  },
  {
    icon: GlobalIcon,
    title: '国际化支持',
    description: '内置完善的多语言解决方案，支持中文、英文、日文、繁体中文等多种语言',
    link: '/guide/front/i18n'
  },
  {
    icon: PluginIcon,
    title: '强大的插件系统',
    description: '模块化设计，插件即插即用，应用市场提供丰富的扩展插件',
    link: '/plugin/create'
  },
  {
    icon: SecurityIcon,
    title: '企业级权限',
    description: 'RBAC 权限管理，数据权限控制，按钮级别权限，满足复杂业务需求',
    link: '/guide/backend/permission'
  },
  {
    icon: ComponentIcon,
    title: '丰富的组件库',
    description: '提供 Form、Table、Search、ProTable 等企业级组件，开箱即用',
    link: '/guide/front/component'
  }
]
</script>

<style scoped>
.features-section {
  padding: 100px 24px;
  background: var(--vp-c-bg-soft);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 80px;
  animation: fadeInUp 0.6s ease;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  color: var(--vp-c-text-1);
  margin: 0 0 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--vp-c-text-2);
  margin: 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
}

.feature-card {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 32px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.6s ease both;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: transparent;
}

.feature-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  color: white;
}

.feature-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 12px;
}

.feature-description {
  font-size: 15px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
  margin: 0 0 20px;
}

.feature-link {
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;
}

.feature-link:hover {
  gap: 4px;
}

/* Stagger animation */
.feature-card:nth-child(1) { animation-delay: 0.1s; }
.feature-card:nth-child(2) { animation-delay: 0.2s; }
.feature-card:nth-child(3) { animation-delay: 0.3s; }
.feature-card:nth-child(4) { animation-delay: 0.4s; }
.feature-card:nth-child(5) { animation-delay: 0.5s; }
.feature-card:nth-child(6) { animation-delay: 0.6s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dark Mode */
.dark .feature-card {
  background: rgba(30, 30, 34, 0.8);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .feature-card:hover {
  background: rgba(38, 38, 42, 1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .features-section {
    padding: 60px 20px;
  }
  
  .section-header {
    margin-bottom: 48px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .feature-card {
    padding: 24px;
  }
}
</style>