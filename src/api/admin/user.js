/**
 * Created by lk on 17/6/4.
 */
import axios from "../../utils/axios";

// 谁最懂我相关

// 列表
export function getUserList() {
    return axios({
        url: "/admin/user/list",
        method: "get"
    });
}

// 列表
export function getPageList(query) {
    return axios({
        url: "/admin/user/page",
        method: "get",
        params: query
    });
}

export function getUserInfo(id) {
    return axios({
        url: "/admin/user/" + id,
        method: "get"
    })
}

export function addUser(data) {
    return axios({
        url: "/admin/user",
        method: "post",
        data: data
    });
}

export function updateUser(data) {
    return axios({
        url: "/admin/user",
        method: "put",
        data: data
    });
}

export function deleteUser(id) {
    return axios({
        url: "/admin/user/" + id,
        method: "delete"
    })
}


export function getMenuList() {
    return axios({
        url: "/admin/menu",
        method: "get"
    });
}


export function getApplyUserInfo(query) {
    return axios({
        url: "/admin/user/apply",
        method: "get",
        params: query
    })
}
