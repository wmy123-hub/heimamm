// 接口
import axios from 'axios'

import {getToken} from '@/utils/token.js'

// 单独引用message
import { Message } from 'element-ui';

// 创建axios副本
const instance = axios.create({
  baseURL: process.env.VUE_APP_URL, //基地址
  withCredentials: true //跨域照样携带cookie
});


// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 有token加上请求头
  // console.log('请求拦截的' ,config);
  if(getToken()){
    config.headers.token = getToken()
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  if(response.data.code == 200){
    // 因为axios多包了一层data,所以架构师直接手动干掉
    return response.data;
  }else{
    Message.error(response.data.message);
    // 只要return了一个Promise.reject(error)，后面的接口的then就不会执行了
    return Promise.reject("error");
  }
  // 对响应数据做点什么
  // return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default instance