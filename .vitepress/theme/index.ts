/**
 * MineAdmin is committed to providing solutions for quickly building web applications
 * Please view the LICENSE file that was distributed with this source code,
 * For the full copyright and license information.
 * Thank you very much for using MineAdmin.
 *
 * @Author X.Mo<root@imoi.cn>
 * @Link   https://github.com/mineadmin
 */

import DefaultTheme from 'vitepress/theme';

import elementplus from "element-plus"
// 导入elementplus组件-中文
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 导入elementplus组件-暗黑模式
import "element-plus/dist/index.css";
import 'element-plus/theme-chalk/dark/css-vars.css'

import MaTable from '@mineadmin/table'
import MaForm from '@mineadmin/form'
import MaSearch from '@mineadmin/search'
import MaProTable from '@mineadmin/pro-table'
import ContextMenu from "@imengyu/vue3-context-menu"

import './styles/var.css'

// maTable样式
import '@mineadmin/table/dist/style.css'
// maSearch样式
import '@mineadmin/search/dist/style.css'
// MaProTable样式
import '@mineadmin/pro-table/dist/style.css'
// ContextMenu 样式
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'


export default {
  enhanceApp({ app , router }) {
    app.use(elementplus, {
      locale: zhCn,
    })
    app.use(MaTable)
    app.use(MaForm)
    app.use(MaSearch)
    app.use(MaProTable, {
      ssr: false,
      provider: {
        app,
        contextMenu: ContextMenu.showContextMenu,
      },
    })
  },
  extends: DefaultTheme,
}