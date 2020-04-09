
import instance from '@/utils/request.js'
// 登录接口
function getUserInfo() {
    return instance({
      url: '/info',
    });
  }

export {getUserInfo}