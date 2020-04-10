import instance from '@/utils/request.js'
// 登录接口
function getUserInfo() {
  return instance({
    url: '/info',
  });
}

// 登录接口
function logout() {
  return instance({
    url: '/logout',
  });
}

export {
  getUserInfo,
  logout
}