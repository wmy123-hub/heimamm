import Vue from 'vue'
import App from './App.vue'
// 导入elementui 及其 样式
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 注册
Vue.use(ElementUI);

import router from '@/router/router.js'

Vue.config.productionTip = false

new Vue({
  // 注入
  router,
  render: h => h(App),
}).$mount('#app')
