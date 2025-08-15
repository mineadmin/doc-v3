<template>
  <section class="code-examples">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">简洁优雅的代码</h2>
        <p class="section-subtitle">
          清晰的代码结构，完善的类型支持，让开发事半功倍
        </p>
      </div>
      
      <div class="examples-container">
        <div class="example-tabs">
          <button
            v-for="example in examples"
            :key="example.id"
            :class="['example-tab', { active: activeExample === example.id }]"
            @click="activeExample = example.id"
          >
            <component :is="example.icon" />
            <span>{{ example.label }}</span>
          </button>
        </div>
        
        <div class="example-content">
          <div class="example-header">
            <h3>{{ currentExample.title }}</h3>
            <p>{{ currentExample.description }}</p>
          </div>
          
          <div class="code-editor">
            <div class="editor-header">
              <div class="editor-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div class="editor-file">{{ currentExample.file }}</div>
              <button class="copy-btn" @click="copyCode">
                <CopyIcon v-if="!copied" />
                <CheckIcon v-else />
              </button>
            </div>
            <div class="editor-body">
              <pre><code v-html="currentExample.code"></code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { h } from 'vue'

const activeExample = ref('crud')
const copied = ref(false)

// Icon Components
const DatabaseIcon = () => h('svg', { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none' }, [
  h('ellipse', { cx: '12', cy: '5', rx: '9', ry: '3', stroke: 'currentColor', 'stroke-width': '2' }),
  h('path', { d: 'M21 12c0 1.66-4 3-9 3s-9-1.34-9-3', stroke: 'currentColor', 'stroke-width': '2' }),
  h('path', { d: 'M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5', stroke: 'currentColor', 'stroke-width': '2' })
])

const ApiIcon = () => h('svg', { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none' }, [
  h('path', { d: 'M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
])

const ComponentIcon = () => h('svg', { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none' }, [
  h('path', { d: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
])

const CopyIcon = () => h('svg', { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none' }, [
  h('rect', { x: '9', y: '9', width: '13', height: '13', rx: '2', ry: '2', stroke: 'currentColor', 'stroke-width': '2' }),
  h('path', { d: 'M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1', stroke: 'currentColor', 'stroke-width': '2' })
])

const CheckIcon = () => h('svg', { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none' }, [
  h('path', { d: 'M20 6L9 17l-5-5', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
])

const examples = [
  {
    id: 'crud',
    label: 'CRUD 操作',
    icon: DatabaseIcon,
    title: '简洁的 CRUD 操作',
    description: '使用 Service 层封装，代码清晰易维护',
    file: 'app/Service/UserService.php',
    code: `<span class="keyword">namespace</span> <span class="namespace">App\\Service</span>;

<span class="keyword">use</span> <span class="namespace">Mine\\MineService</span>;
<span class="keyword">use</span> <span class="namespace">App\\Model\\User</span>;

<span class="keyword">class</span> <span class="class">UserService</span> <span class="keyword">extends</span> <span class="class">MineService</span>
{
    <span class="comment">/**
     * 获取用户列表
     */</span>
    <span class="keyword">public function</span> <span class="function">getPageList</span>(<span class="type">array</span> <span class="variable">$params</span>): <span class="type">array</span>
    {
        <span class="variable">$query</span> = <span class="class">User</span>::<span class="method">query</span>()
            -><span class="method">filterStatus</span>(<span class="variable">$params</span>[<span class="string">'status'</span>] ?? <span class="keyword">null</span>)
            -><span class="method">filterDate</span>(<span class="variable">$params</span>[<span class="string">'created_at'</span>] ?? []);

        <span class="keyword">if</span> (!<span class="function">empty</span>(<span class="variable">$params</span>[<span class="string">'keyword'</span>])) {
            <span class="variable">$query</span>-><span class="method">where</span>(<span class="keyword">function</span> (<span class="variable">$q</span>) <span class="keyword">use</span> (<span class="variable">$params</span>) {
                <span class="variable">$q</span>-><span class="method">where</span>(<span class="string">'username'</span>, <span class="string">'like'</span>, <span class="string">"%{<span class="variable">$params</span>[<span class="string">'keyword'</span>]}%"</span>)
                  -><span class="method">orWhere</span>(<span class="string">'email'</span>, <span class="string">'like'</span>, <span class="string">"%{<span class="variable">$params</span>[<span class="string">'keyword'</span>]}%"</span>);
            });
        }

        <span class="keyword">return</span> <span class="variable">$this</span>-><span class="method">paginate</span>(<span class="variable">$query</span>, <span class="variable">$params</span>);
    }

    <span class="comment">/**
     * 创建用户
     */</span>
    <span class="keyword">public function</span> <span class="function">create</span>(<span class="type">array</span> <span class="variable">$data</span>): <span class="type">User</span>
    {
        <span class="variable">$data</span>[<span class="string">'password'</span>] = <span class="function">password_hash</span>(<span class="variable">$data</span>[<span class="string">'password'</span>], <span class="constant">PASSWORD_DEFAULT</span>);
        <span class="keyword">return</span> <span class="class">User</span>::<span class="method">create</span>(<span class="variable">$data</span>);
    }
}`
  },
  {
    id: 'api',
    label: 'API 接口',
    icon: ApiIcon,
    title: '优雅的 API 设计',
    description: '注解路由，自动验证，响应规范化',
    file: 'app/Controller/Api/AuthController.php',
    code: `<span class="keyword">namespace</span> <span class="namespace">App\\Controller\\Api</span>;

<span class="keyword">use</span> <span class="namespace">Hyperf\\HttpServer\\Annotation\\Controller</span>;
<span class="keyword">use</span> <span class="namespace">Hyperf\\HttpServer\\Annotation\\PostMapping</span>;
<span class="keyword">use</span> <span class="namespace">Mine\\Annotation\\Auth</span>;
<span class="keyword">use</span> <span class="namespace">Mine\\Request\\LoginRequest</span>;

<span class="annotation">#[Controller(prefix: "/api/auth")]</span>
<span class="keyword">class</span> <span class="class">AuthController</span>
{
    <span class="comment">/**
     * 用户登录
     */</span>
    <span class="annotation">#[PostMapping("login")]</span>
    <span class="keyword">public function</span> <span class="function">login</span>(<span class="class">LoginRequest</span> <span class="variable">$request</span>): <span class="type">array</span>
    {
        <span class="variable">$validated</span> = <span class="variable">$request</span>-><span class="method">validated</span>();
        
        <span class="variable">$token</span> = <span class="variable">$this</span>-><span class="property">authService</span>-><span class="method">login</span>(
            <span class="variable">$validated</span>[<span class="string">'username'</span>],
            <span class="variable">$validated</span>[<span class="string">'password'</span>]
        );

        <span class="keyword">return</span> <span class="variable">$this</span>-><span class="method">success</span>([
            <span class="string">'token'</span> => <span class="variable">$token</span>,
            <span class="string">'expire_in'</span> => <span class="number">7200</span>
        ]);
    }

    <span class="comment">/**
     * 获取用户信息
     */</span>
    <span class="annotation">#[PostMapping("me")]</span>
    <span class="annotation">#[Auth]</span>
    <span class="keyword">public function</span> <span class="function">me</span>(): <span class="type">array</span>
    {
        <span class="variable">$user</span> = <span class="variable">$this</span>-><span class="method">getUser</span>();
        
        <span class="keyword">return</span> <span class="variable">$this</span>-><span class="method">success</span>([
            <span class="string">'user'</span> => <span class="variable">$user</span>,
            <span class="string">'roles'</span> => <span class="variable">$user</span>-><span class="property">roles</span>,
            <span class="string">'permissions'</span> => <span class="variable">$user</span>-><span class="property">permissions</span>
        ]);
    }
}`
  },
  {
    id: 'component',
    label: '前端组件',
    icon: ComponentIcon,
    title: 'Vue3 组合式 API',
    description: '类型安全，响应式编程，组件化开发',
    file: 'src/components/UserTable.vue',
    code: `<span class="tag">&lt;script</span> <span class="attr">setup</span> <span class="attr">lang</span>=<span class="string">"ts"</span><span class="tag">&gt;</span>
<span class="keyword">import</span> { ref, reactive, computed } <span class="keyword">from</span> <span class="string">'vue'</span>
<span class="keyword">import</span> { ElMessage } <span class="keyword">from</span> <span class="string">'element-plus'</span>
<span class="keyword">import</span> { MaProTable } <span class="keyword">from</span> <span class="string">'@mineadmin/pro-table'</span>
<span class="keyword">import</span> <span class="keyword">type</span> { <span class="type">User</span>, <span class="type">TableColumn</span> } <span class="keyword">from</span> <span class="string">'@/types'</span>

<span class="keyword">const</span> <span class="variable">tableRef</span> = <span class="function">ref</span>&lt;<span class="type">InstanceType</span>&lt;<span class="keyword">typeof</span> <span class="type">MaProTable</span>&gt;&gt;()
<span class="keyword">const</span> <span class="variable">loading</span> = <span class="function">ref</span>(<span class="keyword">false</span>)
<span class="keyword">const</span> <span class="variable">selection</span> = <span class="function">ref</span>&lt;<span class="type">User</span>[]&gt;([])

<span class="keyword">const</span> <span class="variable">columns</span> = <span class="function">reactive</span>&lt;<span class="type">TableColumn</span>[]&gt;([
  { <span class="property">type</span>: <span class="string">'selection'</span>, <span class="property">width</span>: <span class="number">50</span> },
  { <span class="property">label</span>: <span class="string">'ID'</span>, <span class="property">prop</span>: <span class="string">'id'</span>, <span class="property">width</span>: <span class="number">80</span> },
  { <span class="property">label</span>: <span class="string">'用户名'</span>, <span class="property">prop</span>: <span class="string">'username'</span>, <span class="property">search</span>: <span class="keyword">true</span> },
  { <span class="property">label</span>: <span class="string">'邮箱'</span>, <span class="property">prop</span>: <span class="string">'email'</span>, <span class="property">search</span>: <span class="keyword">true</span> },
  {
    <span class="property">label</span>: <span class="string">'状态'</span>,
    <span class="property">prop</span>: <span class="string">'status'</span>,
    <span class="property">type</span>: <span class="string">'tag'</span>,
    <span class="property">tagType</span>: (<span class="variable">row</span>) => <span class="variable">row</span>.<span class="property">status</span> ? <span class="string">'success'</span> : <span class="string">'danger'</span>,
    <span class="property">tagLabel</span>: (<span class="variable">row</span>) => <span class="variable">row</span>.<span class="property">status</span> ? <span class="string">'启用'</span> : <span class="string">'禁用'</span>
  },
  { <span class="property">label</span>: <span class="string">'创建时间'</span>, <span class="property">prop</span>: <span class="string">'created_at'</span>, <span class="property">type</span>: <span class="string">'datetime'</span> },
  { <span class="property">label</span>: <span class="string">'操作'</span>, <span class="property">type</span>: <span class="string">'operation'</span>, <span class="property">width</span>: <span class="number">200</span> }
])

<span class="keyword">const</span> <span class="function">handleEdit</span> = (<span class="variable">row</span>: <span class="type">User</span>) => {
  <span class="comment">// 编辑逻辑</span>
  <span class="class">ElMessage</span>.<span class="method">success</span>(<span class="string">'编辑用户: '</span> + <span class="variable">row</span>.<span class="property">username</span>)
}

<span class="keyword">const</span> <span class="function">handleDelete</span> = <span class="keyword">async</span> (<span class="variable">row</span>: <span class="type">User</span>) => {
  <span class="keyword">await</span> <span class="function">deleteUser</span>(<span class="variable">row</span>.<span class="property">id</span>)
  <span class="variable">tableRef</span>.<span class="property">value</span>?.<span class="method">refresh</span>()
  <span class="class">ElMessage</span>.<span class="method">success</span>(<span class="string">'删除成功'</span>)
}
<span class="tag">&lt;/script&gt;</span>

<span class="tag">&lt;template&gt;</span>
  <span class="tag">&lt;ma-pro-table</span>
    <span class="attr">ref</span>=<span class="string">"tableRef"</span>
    <span class="attr">:api</span>=<span class="string">"getUserList"</span>
    <span class="attr">:columns</span>=<span class="string">"columns"</span>
    <span class="attr">v-model:selection</span>=<span class="string">"selection"</span>
    <span class="attr">@edit</span>=<span class="string">"handleEdit"</span>
    <span class="attr">@delete</span>=<span class="string">"handleDelete"</span>
  <span class="tag">/&gt;</span>
<span class="tag">&lt;/template&gt;</span>`
  }
]

const currentExample = computed(() => 
  examples.find(e => e.id === activeExample.value) || examples[0]
)

const copyCode = async () => {
  const code = currentExample.value.code.replace(/<[^>]*>/g, '')
  await navigator.clipboard.writeText(code)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<style scoped>
.code-examples {
  padding: 100px 24px;
  background: var(--vp-c-bg);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
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

.examples-container {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 40px;
  align-items: start;
}

.example-tabs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.example-tab {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: transparent;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.example-tab:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.example-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.example-content {
  animation: fadeIn 0.3s ease;
}

.example-header {
  margin-bottom: 24px;
}

.example-header h3 {
  font-size: 24px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 8px;
}

.example-header p {
  font-size: 16px;
  color: var(--vp-c-text-2);
  margin: 0;
}

.code-editor {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
}

.editor-header {
  background: var(--vp-c-bg-soft);
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.editor-dots {
  display: flex;
  gap: 8px;
}

.editor-dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--vp-c-divider);
}

.editor-dots span:nth-child(1) { background: #ff5f57; }
.editor-dots span:nth-child(2) { background: #ffbd2e; }
.editor-dots span:nth-child(3) { background: #28ca42; }

.editor-file {
  flex: 1;
  font-size: 13px;
  color: var(--vp-c-text-2);
  font-family: 'Fira Code', monospace;
}

.copy-btn {
  background: transparent;
  border: none;
  color: var(--vp-c-text-2);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  transition: color 0.3s ease;
}

.copy-btn:hover {
  color: var(--vp-c-text-1);
}

.editor-body {
  padding: 24px;
  overflow-x: auto;
  background: var(--vp-c-bg);
}

.editor-body pre {
  margin: 0;
  font-family: 'Fira Code', 'Cascadia Code', monospace;
  font-size: 14px;
  line-height: 1.6;
}

.editor-body code {
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
.number { color: #005cc5; }
.constant { color: #005cc5; }

.dark .string { color: #9ecbff; }
.dark .keyword { color: #f97583; }
.dark .comment { color: #6a737d; }
.dark .function { color: #b392f0; }
.dark .variable { color: #79b8ff; }
.dark .property { color: #85e89d; }
.dark .class { color: #ffab70; }
.dark .tag { color: #85e89d; }
.dark .attr { color: #b392f0; }

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dark Mode */
.dark .code-editor {
  background: #1e1e2e;
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .editor-header {
  background: #181825;
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .editor-body {
  background: #1e1e2e;
}

/* Responsive */
@media (max-width: 768px) {
  .code-examples {
    padding: 60px 20px;
  }
  
  .examples-container {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .example-tabs {
    flex-direction: row;
    overflow-x: auto;
  }
  
  .example-tab {
    white-space: nowrap;
  }
}
</style>