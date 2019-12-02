import axios from 'axios'
import store from '@/store/index'
import router from '@/router/index'
import { Message, Modal } from 'iview'
import Cookies from 'js-cookie'
import { getAccessToken, removeAccessToken, removeUserInfo, removeUserAccess } from '@/libs/util'

let insBase = process.env.INS_API_HOST;
let commonBase = process.env.COMMON_API_HOST;
let personalBase = process.env.PERSONAL_API_HOST;
axios.defaults.timeout = 10000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

axios.interceptors.request.use(config => {
    //设置请求头携带token
    if (getAccessToken()) {
        config.headers.access_token = `${getAccessToken()}`;
    }
    return config;
}, err => {
    Modal.error({
        title: "提示信息",
        content: "请求发生异常！"
    });
    return Promise.resolve(err);
})

axios.interceptors.response.use(data => {
    //access_token验证失败 || access_token已过期
    if (data.data.code == 40201 || data.data.code == 40202) {
        Modal.error({
            title: "提示信息",
            content: "登录信息已过期，请重新登录！",
            onOk: () => {
                removeAccessToken();
                removeUserInfo();
                removeUserAccess();
                localStorage.removeItem("tagNaveList");
                router.go({ name: "login" });
            }
        });
    } else {
        return data;
    }
}, err => {
    Modal.error({
        title: "提示信息",
        content: "请求发生异常！"
    });
    return Promise.reject(err);
})

//get请求
export const getRequest = (url, urlparams) => {
    if (getAccessToken()) {
        return axios({
            method: 'get',
            url: `${insBase}${url}` + (urlparams == '' ? "" + "?access_token=" + getAccessToken() : "?" + urlparams + "&access_token=" + getAccessToken()),
            headers: {
                'access_token': `${getAccessToken()}`
            }
        });
    } else {
        return axios({
            method: 'get',
            url: `${insBase}${url}` + (urlparams == '' ? "" : "?" + urlparams)
        });
    }
}

//get请求字典
export const getDictionaries = (code) => {
    return axios({
        method: 'get',
        url: `${commonBase}` + "dataitem/" + code,
    })
}

//get请求  公共服务
export const getCommonApiRequest = (url, urlparams) => {
    if (getAccessToken()) {
        return axios({
            method: 'get',
            url: `${commonBase}${url}` + (urlparams == '' ? "" + "?access_token=" + getAccessToken() : "?" + urlparams + "&access_token=" + getAccessToken()),
            headers: {
                'access_token': `${getAccessToken()}`
            }
        });
    } else {
        return axios({
            method: 'get',
            url: `${commonBase}${url}` + (urlparams == '' ? "" : "?" + urlparams)
        });
    }
}

//get请求  个人服务
export const getPersonalApiRequest = (url, urlparams) => {
    if (getAccessToken()) {
        return axios({
            method: 'get',
            url: `${personalBase}${url}` + (urlparams == '' ? "" + "?access_token=" + getAccessToken() : "?" + urlparams + "&access_token=" + getAccessToken()),
            headers: {
                'access_token': `${getAccessToken()}`
            }
        });
    } else {
        return axios({
            method: 'get',
            url: `${personalBase}${url}` + (urlparams == '' ? "" : "?" + urlparams)
        });
    }
}

//post请求  
export const postRequest = (url, params) => {
    if (getAccessToken()) {
        return axios({
            method: 'post',
            url: `${insBase}${url}${url.indexOf('?') > -1 ? "&" : "?"}` + "access_token=" + getAccessToken(),
            data: params,
            headers: {
                'Content-Type': 'application/json',
                'access_token': `${getAccessToken()}`
            }
        });
    } else {
        return axios({
            method: 'post',
            url: `${insBase}${url}`,
            data: params,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

//post请求  公共服务
export const postCommonApiRequest = (url, params) => {
    if (getAccessToken()) {
        return axios({
            method: 'post',
            url: `${commonBase}${url}${url.indexOf('?') > -1 ? "&" : "?"}` + "access_token=" + getAccessToken(),
            data: params,
            headers: {
                'Content-Type': 'application/json',
                'access_token': `${getAccessToken()}`
            }
        });
    } else {
        return axios({
            method: 'post',
            url: `${commonBase}${url}`,
            data: params,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

//post请求  个人服务
export const postPersonalApiRequest = (url, params) => {
    if (getAccessToken()) {
        return axios({
            method: 'post',
            url: `${personalBase}${url}${url.indexOf('?') > -1 ? "&" : "?"}` + "access_token=" + getAccessToken(),
            data: params,
            headers: {
                'Content-Type': 'application/json',
                'access_token': `${getAccessToken()}`
            }
        });
    } else {
        return axios({
            method: 'post',
            url: `${personalBase}${url}`,
            data: params,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

//文件上传
export const uploadFileRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${insBase}${url}${url.indexOf('?') > -1 ? "&" : "?"}` + "access_token=" + getAccessToken(),
        data: params,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

//文件上传  个人服务
export const uploadFilePersonalApiRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${personalBase}${url}${url.indexOf('?') > -1 ? "&" : "?"}` + "access_token=" + getAccessToken(),
        data: params,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}


//put请求  
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${insBase}${url}${url.indexOf('?') > -1 ? "&" : "?"}` + "access_token=" + getAccessToken(),
        data: params,
        headers: {
            'Content-Type': 'application/json',
            'access_token': `${getAccessToken()}`
        }
    });
}

//put请求  公共服务
export const putCommonApiRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${commonBase}${url}${url.indexOf('?') > -1 ? "&" : "?"}` + "access_token=" + getAccessToken(),
        data: params,
        headers: {
            'Content-Type': 'application/json',
            'access_token': `${getAccessToken()}`
        }
    });
}

//put请求  个人服务
export const putPersonalApiRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${personalBase}${url}${url.indexOf('?') > -1 ? "&" : "?"}` + "access_token=" + getAccessToken(),
        data: params,
        headers: {
            'Content-Type': 'application/json',
            'access_token': `${getAccessToken()}`
        }
    });
}

//delete请求
export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: `${insBase}${url}${url.indexOf('?') > -1 ? "&" : "?"}` + "access_token=" + getAccessToken(),
        data: params,
        headers: {
            'Content-Type': 'application/json',
            'access_token': `${getAccessToken()}`
        }
    });
}

//delete请求 公共服务
export const deleteCommonApiRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: `${commonBase}${url}${url.indexOf('?') > -1 ? "&" : "?"}` + "access_token=" + getAccessToken(),
        data: params,
        headers: {
            'Content-Type': 'application/json',
            'access_token': `${getAccessToken()}`
        }
    });
}

//delete请求 个人服务
export const deletePersonalApiRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: `${personalBase}${url}${url.indexOf('?') > -1 ? "&" : "?"}` + "access_token=" + getAccessToken(),
        data: params,
        headers: {
            'Content-Type': 'application/json',
            'access_token': `${getAccessToken()}`
        }
    });
}