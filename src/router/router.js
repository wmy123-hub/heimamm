import Vue from 'vue'

// 导入相应的组件
import login from '@/view/login/login.vue'
import layout from '@/view/home/layout.vue'

// 导入vue-router
import VueRouter from 'vue-router'
// 注册
Vue.use(VueRouter);
// 创建
const router = new VueRouter({
  // 写响应的配置文件
  routes:[
      {
          path:'/',
          component:login
      },
      {
        path:'/home',
        component:layout
      }
  ]
});

// 输出
export default router