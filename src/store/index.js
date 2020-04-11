// vuex的提取

import Vue from 'vue'
// 导包
import Vuex from 'vuex'

// 注册
Vue.use(Vuex);

// 实例化
const store = new Vuex.Store({
    state:{
        userInfo:''   //用户信息
    }
})

export default store