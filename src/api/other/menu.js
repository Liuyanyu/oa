/**
 * Created by lk on 17/6/4.
 */
import axios from "../../utils/axios";

// 列表
export function getPageList(query) {
    return axios({
        url: "/admin/menu/page",
        method: "get",
        params: query
    });
}

export function fetchMenuTree(query) {
    return axios({
        url: '/admin/menu/tree',
        method: 'get',
        params: query
    })
}

export function addObj(data) {
    return axios({
        url: "/admin/menu",
        method: "post",
        data: data
    });
}

export function updateObj(data) {
    return axios({
        url: "/admin/menu",
        method: "put",
        data: data
    });
}

export function deleteObj(id) {
    return axios({
        url: "/admin/menu/" + id,
        method: "delete"
    })
}



