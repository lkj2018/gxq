// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'
import store from '@/store'
import iview from 'iview'
import echarts from 'echarts'
import SecurityApp from './SecurityApp'
import router from '@/router/security'
import '@/directive'//使用全局指令
import '@/filter'//使用全局过滤器
import 'iview/dist/styles/iview.css'//使用iview样式
import '@/assets/css/iconfont.css'//使用全局样式
import '!style-loader!css-loader!less-loader!@/assets/css/com.less'//使用全局样式
import '@static/ueditor/ueditor.config.js'
import '@static/ueditor/ueditor.all.js'
import '@static/ueditor/lang/zh-cn/zh-cn.js'
import '@static/ueditor/ueditor.parse.min.js'
import '@static/login'
//import '@static/Simple-Calendar'//全局使用日历插件
import hyTable from '@/components/hengyun/table'

Vue.use(iview)
Vue.use(hyTable)
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { SecurityApp },
  template: '<SecurityApp />'
})
