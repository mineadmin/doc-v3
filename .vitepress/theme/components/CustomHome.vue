<template>
  <div class="custom-home">
    <HomeHero />
    <FeaturesSection />
    <CodeExamples />
    <CTASection />
  </div>
</template>

<script setup lang="ts">
import HomeHero from './HomeHero.vue'
import FeaturesSection from './FeaturesSection.vue'
import CodeExamples from './CodeExamples.vue'
import CTASection from './CTASection.vue'
</script>

<style scoped>
.custom-home {
  min-height: 100vh;
  background: var(--vp-c-bg);
}
</style>