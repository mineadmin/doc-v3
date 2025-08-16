/**
 * MineAdmin is committed to providing solutions for quickly building web applications
 * Please view the LICENSE file that was distributed with this source code,
 * For the full copyright and license information.
 * Thank you very much for using MineAdmin.
 *
 * @Author X.Mo<root@imoi.cn>
 * @Link   https://github.com/mineadmin
 */

import type { EnhanceAppContext, Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

// @ts-ignore
import Layout from './components/layout.vue'

import ContextMenu from '@imengyu/vue3-context-menu'
import MaTable from '@mineadmin/table/dist/index.umd.js'
import MaSearch from '@mineadmin/search/dist/index.umd.js'
import MaForm from '@mineadmin/form/dist/index.umd.js'
import MaProTable from '@mineadmin/pro-table/dist/index.umd.js'

// maTable样式
import '@mineadmin/table/dist/style.css'
// maSearch样式
import '@mineadmin/search/dist/style.css'
// MaProTable样式
import '@mineadmin/pro-table/dist/style.css'
// ContextMenu 样式
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'

import './styles/fonts.css'
import './styles/var.css'
import './styles/element.css'
import './styles/i18n-typography.css'
import './styles/i18n-components.css'
import './styles/modern-components.css'
import './styles/animations.css'
import './styles/enhancements.css'
import './styles/enhanced-tables.css'
import './styles/table-override.css'
import './styles/enhanced-toc.css'
import './styles/toc-i18n-integration.css'
import './styles/layout-fixes.css'
import './styles/toc-width-fix.css'
import { baiduPlugin } from "./plugin/baidu";
import initEcharts from "./plugin/echarts";
import { getLanguageDetector } from "./plugins/languageDetector";
import enhanceTOC from "./enhanceTOC";

import "virtual:uno.css";

import DemoPreview from '../components/demo-preview.vue';
import CopyOrDownloadAsMarkdownButtons from 'vitepress-plugin-llms/vitepress-components/CopyOrDownloadAsMarkdownButtons.vue'


export default {
  async enhanceApp(ctx: EnhanceAppContext) {
    const { app } = ctx;

    // 条件导入 Element Plus 以避免 SSR 问题
    if (!import.meta.env.SSR) {
      const ElementPlus = await import('element-plus')
      const zh = await import('element-plus/dist/locale/zh-cn.mjs')
      // @ts-ignore
      app.use(ElementPlus.default, { locale: zh.default })
      app.use(MaTable, { ssr: true })
      app.use(MaSearch, { ssr: true })
      app.use(MaForm, { ssr: true })
      app.use(MaProTable, {
        ssr: true,
        provider: {
          app,
          contextMenu: ContextMenu.showContextMenu,
        },
        app,
      })
      app.component('CopyOrDownloadAsMarkdownButtons', CopyOrDownloadAsMarkdownButtons)

      app.component('DemoPreview', DemoPreview)
      
      // Initialize enhanced Table of Contents
      enhanceTOC({
        enableReadingTime: true,
        enableProgress: true,
        enableCollapse: true,
        enableSmoothScroll: true,
        enableKeyboardNav: true,
        enableMobileFloat: true,
        enableSearchHighlight: true
      })
      
      // Initialize language detection and optimization
      const detector = getLanguageDetector()
      const currentLang = detector.getCurrentLanguage()
      detector.applyLanguageToUI(currentLang)
    }

    baiduPlugin()
    initEcharts(app)
  },
  extends: DefaultTheme,
  Layout,
} satisfies Theme;