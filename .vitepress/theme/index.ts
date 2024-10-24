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

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

// @ts-ignore
import Layout from './components/layout.vue'

import zh from 'element-plus/dist/locale/zh-cn.mjs'

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

import './styles/var.css'
import { baiduPlugin } from "./plugin/baidu";

import "virtual:uno.css";

export default {
  enhanceApp(ctx: EnhanceAppContext) {

    const { app } = ctx;
    // @ts-ignore
    app.use(ElementPlus, { locale: zh })
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
    baiduPlugin()
  },
  extends: DefaultTheme,
  Layout,
} satisfies Theme;