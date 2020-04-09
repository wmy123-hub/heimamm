// 1.保存token
function saveToken(name="token",value){
    window.localStorage.setItem(name,value);
}

// 2.获取token
function getToken(name="token"){
    window.localStorage.getItem(name);
}

// 删除token
function removeToken(name="token"){
    window.localStorage.removeItem(name);
}

export {saveToken,getToken,removeToken}