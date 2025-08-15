<template>
  <div class="home-hero">
    <div class="hero-container">
      <!-- Left Content -->
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="gradient-text">MineAdmin</span>
        </h1>
        <p class="hero-subtitle">企业级后台管理系统</p>
        <p class="hero-description">
          基于 Hyperf + Vue3 构建的高性能企业级应用框架<br>
          让后台开发更简单、更高效、更优雅
        </p>
        
        <div class="hero-actions">
          <a href="/guide/introduce/mineadmin" class="btn btn-primary">
            <span>快速开始</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
          <a href="https://demo.mineadmin.com" target="_blank" class="btn btn-secondary">
            <span>在线演示</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>
        
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-number">10x</span>
            <span class="stat-label">性能提升</span>
          </div>
          <div class="stat">
            <span class="stat-number">50+</span>
            <span class="stat-label">内置组件</span>
          </div>
          <div class="stat">
            <span class="stat-number">1k+</span>
            <span class="stat-label">企业用户</span>
          </div>
        </div>
      </div>
      
      <!-- Right Code Display -->
      <div class="hero-code">
        <div class="code-tabs">
          <button 
            v-for="tab in codeTabs" 
            :key="tab.id"
            :class="['code-tab', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>
        
        <div class="code-window">
          <div class="code-header">
            <div class="code-dots">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
            <div class="code-title">{{ currentCode.file }}</div>
          </div>
          <div class="code-body">
            <pre><code v-html="currentCode.content"></code></pre>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Background Effects -->
    <div class="hero-bg">
      <div class="gradient-orb gradient-1"></div>
      <div class="gradient-orb gradient-2"></div>
      <div class="gradient-orb gradient-3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref('backend')

const codeTabs = [
  { id: 'backend', label: 'Backend' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'api', label: 'API' }
]

const codeExamples = {
  backend: {
    file: 'app/Controller/UserController.php',
    content: `<span class="comment">// 用户控制器 - 简洁优雅的代码风格</span>
<span class="keyword">namespace</span> <span class="namespace">App\\Controller</span>;

<span class="keyword">use</span> <span class="namespace">Hyperf\\HttpServer\\Annotation\\Controller</span>;
<span class="keyword">use</span> <span class="namespace">Hyperf\\HttpServer\\Annotation\\GetMapping</span>;
<span class="keyword">use</span> <span class="namespace">Mine\\MineController</span>;

<span class="annotation">#[Controller(prefix: "/api/user")]</span>
<span class="keyword">class</span> <span class="class">UserController</span> <span class="keyword">extends</span> <span class="class">MineController</span>
{
    <span class="annotation">#[GetMapping("list")]</span>
    <span class="annotation">#[Permission("user:list")]</span>
    <span class="keyword">public function</span> <span class="function">getList</span>(): <span class="type">array</span>
    {
        <span class="variable">$params</span> = <span class="variable">$this</span>-><span class="property">request</span>-><span class="method">all</span>();
        <span class="keyword">return</span> <span class="variable">$this</span>-><span class="property">success</span>(
            <span class="variable">$this</span>-><span class="property">service</span>-><span class="method">getPageList</span>(<span class="variable">$params</span>)
        );
    }
}`
  },
  frontend: {
    file: 'src/views/user/index.vue',
    content: `<span class="comment">// Vue3 组合式 API - 类型安全、响应式编程</span>
<span class="tag">&lt;script</span> <span class="attr">setup</span> <span class="attr">lang</span>=<span class="string">"ts"</span><span class="tag">&gt;</span>
<span class="keyword">import</span> { ref, reactive } <span class="keyword">from</span> <span class="string">'vue'</span>
<span class="keyword">import</span> { MaProTable } <span class="keyword">from</span> <span class="string">'@mineadmin/pro-table'</span>
<span class="keyword">import</span> { getUserList } <span class="keyword">from</span> <span class="string">'@/api/user'</span>

<span class="keyword">const</span> <span class="variable">tableRef</span> = <span class="function">ref</span>&lt;<span class="type">InstanceType</span>&lt;<span class="keyword">typeof</span> <span class="type">MaProTable</span>&gt;&gt;()

<span class="keyword">const</span> <span class="variable">columns</span> = [
  { <span class="property">label</span>: <span class="string">'用户名'</span>, <span class="property">prop</span>: <span class="string">'username'</span> },
  { <span class="property">label</span>: <span class="string">'邮箱'</span>, <span class="property">prop</span>: <span class="string">'email'</span> },
  { <span class="property">label</span>: <span class="string">'状态'</span>, <span class="property">prop</span>: <span class="string">'status'</span>, <span class="property">type</span>: <span class="string">'tag'</span> },
  { <span class="property">label</span>: <span class="string">'操作'</span>, <span class="property">type</span>: <span class="string">'operation'</span> }
]
<span class="tag">&lt;/script&gt;</span>

<span class="tag">&lt;template&gt;</span>
  <span class="tag">&lt;ma-pro-table</span> <span class="attr">:api</span>=<span class="string">"getUserList"</span> <span class="attr">:columns</span>=<span class="string">"columns"</span> <span class="tag">/&gt;</span>
<span class="tag">&lt;/template&gt;</span>`
  },
  api: {
    file: 'routes/api.php',
    content: `<span class="comment">// RESTful API 路由定义 - 清晰规范</span>
<span class="keyword">use</span> <span class="namespace">Hyperf\\HttpServer\\Router\\Router</span>;

<span class="comment">// API 版本控制</span>
<span class="variable">Router</span>::<span class="method">addGroup</span>(<span class="string">'/api/v1'</span>, <span class="keyword">function</span> () {
    
    <span class="comment">// 用户管理模块</span>
    <span class="variable">Router</span>::<span class="method">addGroup</span>(<span class="string">'/user'</span>, <span class="keyword">function</span> () {
        <span class="variable">Router</span>::<span class="method">get</span>(<span class="string">'/list'</span>, <span class="string">'UserController@getList'</span>);
        <span class="variable">Router</span>::<span class="method">post</span>(<span class="string">'/create'</span>, <span class="string">'UserController@create'</span>);
        <span class="variable">Router</span>::<span class="method">put</span>(<span class="string">'/{id}'</span>, <span class="string">'UserController@update'</span>);
        <span class="variable">Router</span>::<span class="method">delete</span>(<span class="string">'/{id}'</span>, <span class="string">'UserController@delete'</span>);
    });
    
    <span class="comment">// 权限管理模块</span>
    <span class="variable">Router</span>::<span class="method">addGroup</span>(<span class="string">'/permission'</span>, <span class="keyword">function</span> () {
        <span class="variable">Router</span>::<span class="method">get</span>(<span class="string">'/menu'</span>, <span class="string">'PermissionController@getMenu'</span>);
        <span class="variable">Router</span>::<span class="method">get</span>(<span class="string">'/role'</span>, <span class="string">'PermissionController@getRoles'</span>);
    });
});`
  }
}

const currentCode = computed(() => codeExamples[activeTab.value])
</script>

<style scoped>
.home-hero {
  position: relative;
  min-height: 80vh;
  padding: 80px 24px;
  overflow: hidden;
}

.hero-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 80px;
  align-items: center;
  position: relative;
  z-index: 1;
}

/* Hero Content */
.hero-content {
  animation: fadeInLeft 0.8s ease;
}

.hero-title {
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 900;
  line-height: 1;
  margin: 0 0 20px;
}

.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.hero-subtitle {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 16px;
}

.hero-description {
  font-size: clamp(1rem, 1.5vw, 1.25rem);
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin: 0 0 40px;
}

/* Action Buttons */
.hero-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 60px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 14px 0 rgba(102, 126, 234, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px 0 rgba(102, 126, 234, 0.5);
}

.btn-secondary {
  background: transparent;
  color: var(--vp-c-text-1);
  border: 2px solid var(--vp-c-divider);
}

.btn-secondary:hover {
  background: var(--vp-c-bg-soft);
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
}

/* Stats */
.hero-stats {
  display: flex;
  gap: 40px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-number {
  font-size: 32px;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-label {
  font-size: 14px;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

/* Code Display */
.hero-code {
  animation: fadeInRight 0.8s ease;
}

.code-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: -1px;
  padding: 0 20px;
}

.code-tab {
  padding: 10px 20px;
  background: transparent;
  border: none;
  border-radius: 8px 8px 0 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.code-tab:hover {
  color: var(--vp-c-text-1);
}

.code-tab.active {
  background: var(--vp-c-bg-elv);
  color: #667eea;
  border: 1px solid var(--vp-c-divider);
  border-bottom: none;
}

.code-window {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  transform: perspective(1000px) rotateY(-2deg);
  transition: transform 0.3s ease;
}

.code-window:hover {
  transform: perspective(1000px) rotateY(0deg);
}

.code-header {
  background: var(--vp-c-bg-soft);
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.code-dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--vp-c-divider);
}

.dot:nth-child(1) { background: #ff5f57; }
.dot:nth-child(2) { background: #ffbd2e; }
.dot:nth-child(3) { background: #28ca42; }

.code-title {
  font-size: 13px;
  color: var(--vp-c-text-2);
  font-family: 'Fira Code', monospace;
}

.code-body {
  padding: 24px;
  max-height: 400px;
  overflow: auto;
  background: var(--vp-c-bg);
}

.code-body pre {
  margin: 0;
  font-family: 'Fira Code', 'Cascadia Code', monospace;
  font-size: 14px;
  line-height: 1.6;
}

.code-body code {
  color: var(--vp-c-text-1);
}

/* Syntax Highlighting */
.comment { color: #6a737d; font-style: italic; }
.keyword { color: #d73a49; font-weight: 600; }
.string { color: #032f62; }
.function { color: #6f42c1; }
.variable { color: #005cc5; }
.property { color: #22863a; }
.method { color: #6f42c1; }
.class { color: #e36209; }
.type { color: #d73a49; }
.namespace { color: #6f42c1; }
.annotation { color: #22863a; font-weight: 600; }
.tag { color: #22863a; }
.attr { color: #6f42c1; }

.dark .string { color: #9ecbff; }
.dark .keyword { color: #f97583; }
.dark .comment { color: #6a737d; }
.dark .function { color: #b392f0; }
.dark .variable { color: #79b8ff; }
.dark .property { color: #85e89d; }
.dark .class { color: #ffab70; }
.dark .tag { color: #85e89d; }
.dark .attr { color: #b392f0; }

/* Background Effects */
.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  animation: float 20s ease-in-out infinite;
}

.gradient-1 {
  width: 600px;
  height: 600px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  top: -200px;
  left: -200px;
  animation-delay: 0s;
}

.gradient-2 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  bottom: -200px;
  right: -200px;
  animation-delay: 5s;
}

.gradient-3 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 60px;
  }
  
  .hero-code {
    display: none;
  }
  
  .hero-content {
    text-align: center;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .hero-stats {
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .home-hero {
    padding: 60px 20px;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
  
  .hero-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
  
  .hero-stats {
    gap: 24px;
  }
  
  .stat-number {
    font-size: 24px;
  }
}

/* Dark Mode */
.dark .code-window {
  background: #1e1e2e;
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .code-header {
  background: #181825;
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .code-body {
  background: #1e1e2e;
}

.dark .code-tab.active {
  background: #1e1e2e;
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .gradient-orb {
  opacity: 0.3;
}
</style>