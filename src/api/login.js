
import instance from '@/utils/request.js'
// 登录接口
function login(data) {
    return instance({
      url: '/login',
      method: 'post',
      data
    });
  }

export {login}