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
  routes: [{
      path: '/',
      component: login,
      meta: {
        // 路由元信息
        title: '登录',
        auto: '也可以自己定义',
        rules: ["超级管理员", "管理员", "老师", "学生"],
      }
    },
    {
      path: '/home',
      redirect: '/home/subject', //页面从home页面重定向到subject页面
      component: layout,
      // 嵌套路由
      children: [{
          path: 'chart', //相对路径，不要加/
          component: chart,
          meta: {
            title: '数据概览',
            rules: ["超级管理员", "管理员", "老师"],
            icon:"el-icon-pie-chart",
          }
        },
        {
          path: 'userList', //相对路径，不要加/
          component: userList,
          meta: {
            title: '用户列表',
            rules: ["超级管理员", "管理员"],
            icon:"el-icon-user-solid",
          }
        },
        {
          path: 'question', //相对路径，不要加/
          component: question,
          meta: {
            title: '题库列表',
            rules: ["超级管理员", "管理员", "老师"],
            icon:"el-icon-edit-outline",
          }
        },
        {
          path: 'business', //相对路径，不要加/
          component: business,
          meta: {
            title: '企业列表',
            rules: ["超级管理员", "管理员", "老师"],
            icon:"el-icon-office-building",
          }
        },
        {
          path: 'subject', //相对路径，不要加/
          component: subject,
          // 路由元信息
          meta: {
            title: '学科列表',
            rules: ["超级管理员", "管理员", "老师", "学生"],
            icon:"el-icon-notebook-2",
          }
        },
      ]
    }
  ]
});


// // 路由拦截
// // 路由进入拦截
/* 
  to:到哪去，需要进入的路由的基本信息
  from:从哪来，来的那个路由的基本信息
  next()：给不给你过，给过就是next()  
          不给过它可以把你换到另一个地方 next("可以写一个path把你甩到任意地方去，这里的next相当于一个$router.push后面控制了")
   */
// router.beforeEach((to, from, next) => {
//   console.log('to', to);
//   console.log('from', from);
//   if (to.fullPath == '/home') {
//     next('/home/chart')
//   } else {
//     next();
//   }
// })

// // 路由进入后 的处理
// router.afterEach((to,from)=>{
// })


// 进度条
import NProgress from 'nprogress'
// 导入他的样式
import 'nprogress/nprogress.css'

import store from '@/store/index.js'
import {Message} from 'element-ui'
import {removeToken} from '@/utils/token.js'
/* 
1. 导航守卫 `beforeEach`  开启    `Nprogress.start()`
2. 导航守卫`afterEach `  关闭即可  `Nprogress.done()`
 */
router.beforeEach((to, from, next) => {
  NProgress.start();

  if(to.meta.rules.includes(store.state.role)){
    next();
  }else{
    // 弹出错误提示
    Message.warning('您无权访问此页面');
    // 删除token
    removeToken();
    // 跳转到登录页
    next("/");

  }
 
});

router.afterEach((to) => {
  NProgress.done();
  // 调用路由元信息修改网页标题
  document.title = to.meta.title; //to就相当于是$route的信息
})

// 输出
export default router