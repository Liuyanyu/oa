/**
 * Created by lk on 17/6/4.
 */
import axios from "../../utils/axios";
const scope = 'server'
// 获取信息
export function userInfo(id, token) {
    return axios({
        url: "/admin/user/info",
        method: "get"
    });
}

export function loginName(username, password, code, randomStr) {
    const grant_type = 'password'
    return axios({
        url: '/auth/oauth/token',
        headers: {
            isToken: false,
            'TENANT-ID': '1', 
            'Authorization': 'Basic d2ViOndlYg=='
        },
        method: 'post',
        params: { username, password, randomStr, code, grant_type, scope }
    });
}

export function logout() {
    return axios({
        url: "/auth/token/logout",
        method: "delete"
    });
}

export function password(data) {
    return axios({
        url: "/admin/auth/login/password",
        method: "post",
        data: data
    });
}
