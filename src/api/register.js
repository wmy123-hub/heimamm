import instance from '@/utils/request.js'


// 获取手机验证码接口
function getPhoneCode(obj) {
  return instance({
    url: '/sendsms',
    method: 'post',
    data: obj,
  });
}

// 注册接口
function register(data) {
  return instance({
    url: '/register',
    method: 'post',
    data
  });
}

// 导出
// export default getPhoneCode
export {
  getPhoneCode,
  register
}