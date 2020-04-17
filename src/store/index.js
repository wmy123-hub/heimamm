// vuex的提取

import Vue from 'vue'
// 导包
import Vuex from 'vuex'

// 注册
Vue.use(Vuex);

// 实例化
const store = new Vuex.Store({
    state:{
        userInfo:'',   //用户信息
        roleObj:{
            1:'超级管理员',
            2:'管理员',
            3:'老师',
            4:'学生',
        },
        role:'超级管理员',//默认给最高的权限
    }
})

export default store