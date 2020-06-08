import axios from "axios";
import { serialize } from '@/utils/utils'
import { Message } from "element-ui";
import store from "../store/index";
import { BASE_URL } from "../config/app";
import router from "../router/index";

// 创建axios实例
const service = axios.create({
    baseURL: BASE_URL, // api的base_url
    timeout: 5000 // 请求超时时间
});


// 返回其他状态吗
service.defaults.validateStatus = function(status) {
    return status >= 200 && status <= 500 // 默认的
}
// 跨域请求，允许保存cookie
service.defaults.withCredentials = true


// HTTPrequest拦截
service.interceptors.request.use(config => {

    const isToken = (config.headers || {}).isToken === false
    const token = store.getters.token
    if (token && !isToken) {
        config.headers['Authorization'] = 'Bearer ' + token// token
    }

    // headers中配置serialize为true开启序列化
    if (config.method === 'post' && config.headers.serialize) {
        config.data = serialize(config.data)
        delete config.data.serialize
    }
    return config
}, error => {
    return Promise.reject(error)
})

// HTTPresponse拦截
service.interceptors.response.use(response => {
    const status = Number(response.status) || 200
    const message = response.data.msg
    if (status === 401) {
        Message({
            message: message,
            type: 'error'
        })
        store.dispatch('FedLogOut').then(() => {
            router.push({ path: '/login' })
        })
        return
    }

    if (status !== 200 || response.data.code === 1) {
        Message({
            message: message,
            type: 'error'
        })
        return Promise.reject(new Error(message))
    }

    return response
}, error => {
    return Promise.reject(new Error(error))
})
export default service;
