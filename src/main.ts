import Vue, { DirectiveOptions } from 'vue'
import 'normalize.css'
import ElementUI from 'element-ui'
import SvgIcon from 'vue-svgicon'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/base.scss'
import App from '@/App.vue'
import store from '@/store'
import router from '@/router/index'
import '@/icons/components'
import '@/utils/permission' 
import request from '@/utils/request'
import Base from './utils/base'
import * as directives from '@/utils/directives/directives'
import injectFilters from '@/utils/filters/filters'
import KeDict from './components/keDict.vue'
import KeFiles from './components/keFiles.vue'
import KeTree from './components/keTree.vue'

import VueI18n from 'vue-i18n'

Vue.component('KeDict',KeDict)
Vue.component('KeFiles',KeFiles)
Vue.component('KeTree',KeTree)

Object.keys(directives).forEach((key) => {
  Vue.directive(key, (directives as { [key: string]: DirectiveOptions })[key])
})
Vue.use(ElementUI, { size: 'medium', zIndex: 3000 })

const select = (ElementUI.Select as any)
select.props.placeholder.default = ''
const cascader = (ElementUI.Cascader as any)
cascader.props.placeholder.default = ''

Vue.prototype.$http = request
Vue.prototype.$base = Base
Vue.use(SvgIcon, {
  tagName: 'svg-icon'
})
Vue.config.productionTip = false
// 注入全局过滤器
injectFilters(Vue)
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'zh',
  messages: {
    zh: require('./lang/zh'), // 中文语言包
    ph: require('./lang/ph') // 菲语言包
  }
})

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App)
}).$mount('#app')
