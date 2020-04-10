import Vue from 'vue'

// 导入相应的组件
import login from '@/view/login/login.vue'
import layout from '@/view/home/layout.vue'

import chart from '@/view/home/chart/chart.vue'
import userList from '@/view/home/userList/userList.vue'
import question from '@/view/home/question/question.vue'
import business from '@/view/home/business/business.vue'
import subject from '@/view/home/subject/subject.vue'

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
        redirect:'/home/subject',    //页面从home页面重定向到subject页面
        component:layout,
        // 嵌套路由
        children:[
          {
            path:'chart',    //相对路径，不要加/
            component:chart
          },
          {
            path:'userList',    //相对路径，不要加/
            component:userList
          },
          {
            path:'question',    //相对路径，不要加/
            component:question
          },
          {
            path:'business',    //相对路径，不要加/
            component:business
          },
          {
            path:'subject',    //相对路径，不要加/
            component:subject
          },
        ]
      }
  ]
});


// // 路由拦截
// // 路由进入拦截
// router.beforeEach((to,from,next)=>{
//   /* 
//   to:到哪去，需要进入的路由的基本信息
//   from:从哪来，来的那个路由的基本信息
//   next()：给不给你过，给过就是next()  
//           不给过它可以把你换到另一个地方 next("可以写一个path把你甩到任意地方去，这里的next相当于一个$router.push后面控制了")
//    */
//   console.log('to',to);
//   console.log('from',from);
//   if(to.fullPath == '/home'){
//     next('/home/chart')
//   }else{
//     next();
//   }
// })

// // 路由进入后 的处理
// router.afterEach(()=>{

// })


// 进度条
import  NProgress from 'nprogress'
// 导入他的样式
import 'nprogress/nprogress.css'
/* 
1. 导航守卫 `beforeEach`  开启    `Nprogress.start()`
2. 导航守卫`afterEach `  关闭即可  `Nprogress.done()`
 */
router.beforeEach((to,from,next)=>{
  NProgress.start();
  next();
});

router.afterEach(()=>{
  NProgress.done();
})

// 输出
export default router