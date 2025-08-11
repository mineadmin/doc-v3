import { defineConfig, presetUno, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      warn: true,
      collections: {
        // Element Plus 图标集
        ep: () => import('@iconify/json/json/ep.json').then(i => i.default),
        // Heroicons 图标集
        heroicons: () => import('@iconify/json/json/heroicons.json').then(i => i.default),
        // Material Design Icons
        mdi: () => import('@iconify/json/json/mdi.json').then(i => i.default),
        // Carbon Icons
        carbon: () => import('@iconify/json/json/carbon.json').then(i => i.default),
        // Tabler Icons  
        tabler: () => import('@iconify/json/json/tabler.json').then(i => i.default),
      },
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      }
    }),
  ],
  shortcuts: [
    // 图标相关的快捷方式
    {
      'icon-btn': 'inline-flex items-center justify-center w-8 h-8 rounded cursor-pointer hover:bg-gray-100 transition-colors',
      'icon-lg': 'text-lg',
      'icon-xl': 'text-xl',
      'icon-2xl': 'text-2xl',
    }
  ],
  theme: {
    colors: {
      // 可以在这里定义自定义颜色
    }
  }
})