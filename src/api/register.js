// 接口
import axios from 'axios'

function getPhoneCode(obj){
    return axios({
        url: process.env.VUE_APP_URL + '/sendsms',
        method:'post',
        data:obj,

        withCredentials:true   //跨域照样携带cookie
      });
}

// 导出
export default getPhoneCode