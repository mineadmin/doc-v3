<template>
  <section class="cta-section">
    <div class="container">
      <div class="cta-content">
        <h2 class="cta-title">准备好开始了吗？</h2>
        <p class="cta-subtitle">
          加入数千家企业的选择，使用 MineAdmin 构建您的下一个项目
        </p>
        <div class="cta-actions">
          <a href="/guide/introduce/mineadmin" class="cta-btn cta-primary">
            立即开始
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
          <a href="https://github.com/mineadmin/mineadmin" target="_blank" class="cta-btn cta-secondary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub Star
          </a>
        </div>
        
        <div class="cta-stats">
          <div class="stat-item">
            <span class="stat-value">5k+</span>
            <span class="stat-label">GitHub Stars</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">1k+</span>
            <span class="stat-label">企业用户</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">50+</span>
            <span class="stat-label">贡献者</span>
          </div>
        </div>
      </div>
      
      <div class="cta-decoration">
        <div class="decoration-circle decoration-1"></div>
        <div class="decoration-circle decoration-2"></div>
        <div class="decoration-circle decoration-3"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.cta-section {
  padding: 120px 24px;
  background: linear-gradient(135deg, var(--vp-c-bg) 0%, var(--vp-c-bg-soft) 100%);
  position: relative;
  overflow: hidden;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
}

.cta-content {
  animation: fadeInUp 0.8s ease;
}

.cta-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  margin: 0 0 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
}

.cta-subtitle {
  font-size: clamp(1.125rem, 2vw, 1.5rem);
  color: var(--vp-c-text-2);
  margin: 0 0 48px;
  line-height: 1.6;
}

.cta-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 80px;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.cta-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
  position: relative;
  overflow: hidden;
}

.cta-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s ease;
}

.cta-primary:hover::before {
  left: 100%;
}

.cta-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.5);
}

.cta-secondary {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border: 2px solid var(--vp-c-divider);
}

.cta-secondary:hover {
  background: var(--vp-c-bg-soft);
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.cta-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-value {
  font-size: 36px;
  font-weight: 900;
  color: var(--vp-c-text-1);
}

.stat-label {
  font-size: 14px;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--vp-c-divider);
}

/* Decoration */
.cta-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0.1;
  filter: blur(60px);
}

.decoration-1 {
  width: 400px;
  height: 400px;
  top: -200px;
  left: -100px;
  animation: float 15s ease-in-out infinite;
}

.decoration-2 {
  width: 300px;
  height: 300px;
  bottom: -150px;
  right: -100px;
  animation: float 20s ease-in-out infinite reverse;
}

.decoration-3 {
  width: 500px;
  height: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 10s ease-in-out infinite;
}

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

@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  33% {
    transform: translate(30px, -30px);
  }
  66% {
    transform: translate(-20px, 20px);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.1;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.2;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

/* Dark Mode */
.dark .cta-section {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

.dark .cta-secondary {
  background: rgba(30, 30, 34, 0.8);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .cta-secondary:hover {
  background: rgba(38, 38, 42, 1);
}

.dark .decoration-circle {
  opacity: 0.05;
}

/* Responsive */
@media (max-width: 640px) {
  .cta-section {
    padding: 80px 20px;
  }
  
  .cta-title {
    font-size: 2rem;
  }
  
  .cta-subtitle {
    font-size: 1.125rem;
    margin-bottom: 32px;
  }
  
  .cta-actions {
    flex-direction: column;
    margin-bottom: 60px;
  }
  
  .cta-btn {
    width: 100%;
    justify-content: center;
  }
  
  .cta-stats {
    gap: 24px;
  }
  
  .stat-value {
    font-size: 28px;
  }
  
  .stat-divider {
    height: 30px;
  }
}
</style>